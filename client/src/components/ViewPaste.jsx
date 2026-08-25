import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPaste } from '../api';

export default function ViewPaste() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [paste, setPaste] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // { status, message }
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPaste = async () => {
      setLoading(true);
      setError(null);
      setPaste(null);
      try {
        const data = await getPaste(slug);
        setPaste(data);
      } catch (err) {
        // err has status and message from api.js
        setError({
          status: err.status || 500,
          message: err.message || 'Something went wrong.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPaste();
  }, [slug]);

  const handleCopyContent = async () => {
    if (!paste) return;
    try {
      await navigator.clipboard.writeText(paste.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return null;
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="view-container">
        <div className="spinner"></div>
        <p>Loading paste...</p>
      </div>
    );
  }

  if (error) {
    const is410 = error.status === 410;
    const is404 = error.status === 404;
    let emoji = '😕';
    let title = 'Something went wrong';
    let detail = error.message;
    if (is404) {
      emoji = '🔍';
      title = 'Paste not found';
      detail = 'The paste you’re looking for doesn’t exist.';
    } else if (is410) {
      emoji = '⏳';
      title = 'Paste unavailable';
      // Use the exact message from API
      detail = error.message;
    }
    return (
      <div className="view-container error-state">
        <div className="error-box">
          <div className="error-emoji">{emoji}</div>
          <h2>{title}</h2>
          <p>{detail}</p>
          <button onClick={() => navigate('/')} className="home-button">
            Create New Paste
          </button>
        </div>
      </div>
    );
  }

  // Success
  return (
    <div className="view-container">
      <div className="paste-header">
        <h1>Paste</h1>
        <button onClick={() => navigate('/')} className="new-button">
          + New Paste
        </button>
      </div>

      <div className="paste-content-wrapper">
        <div className="content-toolbar">
          <span className="content-label">Content</span>
          <button onClick={handleCopyContent} className="copy-content-button">
            {copied ? '✅ Copied!' : '📋 Copy Content'}
          </button>
        </div>
        <pre className="paste-content">
          <code>{paste.content}</code>
        </pre>
      </div>

      <div className="paste-metadata">
        <div className="meta-item">
          <span className="meta-label">Created</span>
          <span className="meta-value">{formatDate(paste.created_at)}</span>
        </div>
        {paste.expires_at && (
          <div className="meta-item">
            <span className="meta-label">Expires</span>
            <span className="meta-value">{formatDate(paste.expires_at)}</span>
          </div>
        )}
        {paste.max_views !== null && (
          <div className="meta-item">
            <span className="meta-label">Views</span>
            <span className="meta-value">
              {paste.view_count} / {paste.max_views}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}