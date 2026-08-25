import { useState } from 'react';
import { createPaste } from '../api';

const EXPIRY_OPTIONS = [
  { label: 'Never', value: null },
  { label: '10 minutes', value: 10 },
  { label: '1 hour', value: 60 },
  { label: '24 hours', value: 1440 },
  { label: '7 days', value: 10080 },
];

export default function CreatePaste() {
  const [content, setContent] = useState('');
  const [expiryOption, setExpiryOption] = useState(null);
  const [maxViews, setMaxViews] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdUrl, setCreatedUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError('');
    setCreatedUrl('');

    try {
      const result = await createPaste({
        content: content.trim(),
        expiresInMinutes: expiryOption,
        maxViews: maxViews ? parseInt(maxViews, 10) : undefined,
      });
      setCreatedUrl(result.url);
    } catch (err) {
      setError(err.message || 'Failed to create paste. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (createdUrl) {
      try {
        await navigator.clipboard.writeText(createdUrl);
        // Optional: show a "Copied!" feedback briefly
      } catch {
        // fallback
      }
    }
  };

  const isContentEmpty = !content.trim();

  return (
    <div className="create-paste-container">
      <h1>Create a new paste</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your text here..."
            rows={10}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="expiry">Expires</label>
            <select
              id="expiry"
              value={expiryOption ?? ''}
              onChange={(e) => {
                const val = e.target.value === '' ? null : Number(e.target.value);
                setExpiryOption(val);
              }}
            >
              {EXPIRY_OPTIONS.map((opt) => (
                <option key={opt.label} value={opt.value ?? ''}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="maxViews">Max views</label>
            <input
              id="maxViews"
              type="number"
              min="1"
              step="1"
              value={maxViews}
              onChange={(e) => setMaxViews(e.target.value)}
              placeholder="Unlimited"
            />
          </div>
        </div>

        <button type="submit" disabled={isContentEmpty || loading}>
          {loading ? 'Creating...' : 'Create Paste'}
        </button>

        {error && <div className="error-message">{error}</div>}

        {createdUrl && (
          <div className="success-container">
            <p> Paste created! Share this link:</p>
            <div className="link-box">
              <span className="link-url">{createdUrl}</span>
              <button type="button" onClick={handleCopy} className="copy-button">
                Copy Link
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}