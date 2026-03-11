import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { loadFormat, getFormatMeta } from '../../data/formatRegistry';
import { FormatDefinitionViewer } from '../../components/FormatDefinitionViewer';

export default function FormatDetailPage() {
  const { formatId } = useParams<{ formatId: string }>();
  const [formatJson, setFormatJson] = useState<unknown | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const meta = formatId ? getFormatMeta(formatId) : undefined;

  useEffect(() => {
    if (!formatId) {
      setLoading(false);
      setError('No format specified');
      return;
    }
    setLoading(true);
    setError(null);
    setFormatJson(null);
    loadFormat(formatId)
      .then((data) => {
        if (data === undefined) {
          setError(`Unknown format: ${formatId}`);
        } else {
          setFormatJson(data);
        }
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load format');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [formatId]);

  return (
    <section className="section">
      <div className="container">
        <nav className="format-detail__breadcrumb muted">
          <Link to="/formats">Formats</Link>
          {meta && (
            <>
              <span className="sep">/</span>
              <span>{meta.name}</span>
            </>
          )}
        </nav>
        {loading && (
          <p className="format-detail__loading muted">Loading format definition…</p>
        )}
        {error && (
          <div className="format-doc format-doc--error">
            <p className="format-doc__error">{error}</p>
            <p>
              <Link to="/formats" className="ghost">← Back to formats</Link>
            </p>
          </div>
        )}
        {!loading && !error && formatJson != null && (
          <FormatDefinitionViewer format={formatJson} />
        )}
      </div>
    </section>
  );
}
