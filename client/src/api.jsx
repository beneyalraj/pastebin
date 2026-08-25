const API_BASE = '/api/routes';

export async function createPaste({ content, expiresInMinutes, maxViews }) {
  const response = await fetch(`${API_BASE}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, expiresInMinutes, maxViews }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to create paste');
  }
  return response.json();
}

export async function getPaste(slug) {
  const response = await fetch(`${API_BASE}/${slug}`);
  if (response.status === 404) {
    const error = new Error('Paste not found');
    error.status = 404;
    throw error;
  }
  if (response.status === 410) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.error || 'Paste has expired or reached view limit');
    error.status = 410;
    throw error;
  }
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch paste');
  }
  return response.json();
}
