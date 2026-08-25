const express = require('express');
const { nanoid } = require('nanoid');
const pool = require('../db/pool.js');

const router = express.Router();

async function generateUniqueSlug(length = 8) {
  let slug;
  let exists = true;
  let attempts = 0;
  const maxAttempts = 3;
  while (exists && attempts < maxAttempts) {
    slug = nanoid(length);
    const res = await pool.query('SELECT 1 FROM pastes WHERE slug = $1', [slug]);
    exists = res.rowCount > 0;
    attempts++;
  }
  if (exists) {
    throw new Error('Failed to generate a unique slug after multiple attempts');
  }
  return slug;
}

router.post('/', async (req, res) => {
  try {
    const { content, expiresInMinutes, maxViews } = req.body;

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return res.status(400).json({ error: 'content is required and must be non-empty' });
    }

    const slug = await generateUniqueSlug();

    let expiresAt = null;
    if (expiresInMinutes !== undefined) {
      const minutes = parseInt(expiresInMinutes, 10);
      if (isNaN(minutes) || minutes <= 0) {
        return res.status(400).json({ error: 'expiresInMinutes must be a positive number' });
      }
      expiresAt = new Date(Date.now() + minutes * 60 * 1000);
    }

    let maxViewsInt = null;
    if (maxViews !== undefined) {
      maxViewsInt = parseInt(maxViews, 10);
      if (isNaN(maxViewsInt) || maxViewsInt <= 0) {
        return res.status(400).json({ error: 'maxViews must be a positive integer' });
      }
    }

    const result = await pool.query(
      `INSERT INTO pastes (slug, content, expires_at, max_views)
       VALUES ($1, $2, $3, $4)
       RETURNING slug`,
      [slug, content.trim(), expiresAt, maxViewsInt]
    );

    const protocol = req.protocol;
    const host = req.get('host');
    const baseUrl = process.env.FRONTEND_URL || `${req.protocol}://${req.get('host')}`;
    const url = `${baseUrl}/p/${slug}`;

    res.status(201).json({ slug, url });
  } catch (error) {
    console.error('Error creating paste:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:slug', async (req, res) => {
  const { slug } = req.params;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const result = await client.query(
      `SELECT id, slug, content, created_at, expires_at, max_views, view_count
       FROM pastes
       WHERE slug = $1
       FOR UPDATE`,
      [slug]
    );

    if (result.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Paste not found' });
    }

    const paste = result.rows[0];
    const now = new Date();

    if (paste.expires_at && new Date(paste.expires_at) < now) {
      await client.query('DELETE FROM pastes WHERE id = $1', [paste.id]);
      await client.query('COMMIT');
      return res.status(410).json({ error: 'This paste has expired' });
    }

    if (paste.max_views !== null && paste.view_count >= paste.max_views) {
      await client.query('DELETE FROM pastes WHERE id = $1', [paste.id]);
      await client.query('COMMIT');
      return res.status(410).json({ error: 'This paste has reached its maximum number of views' });
    }

    const updatedResult = await client.query(
      `UPDATE pastes
       SET view_count = view_count + 1
       WHERE id = $1
       RETURNING view_count`,
      [paste.id]
    );
    const newViewCount = updatedResult.rows[0].view_count;

    await client.query('COMMIT');

    const response = {
      slug: paste.slug,
      content: paste.content,
      created_at: paste.created_at,
      expires_at: paste.expires_at,
      max_views: paste.max_views,
      view_count: newViewCount,
    };
    res.json(response);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error retrieving paste:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

module.exports = router;