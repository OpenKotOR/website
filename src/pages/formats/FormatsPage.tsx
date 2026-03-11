import { Link } from 'react-router-dom';
import { FORMATS } from '../../data/formatRegistry';

export default function FormatsPage() {
  return (
    <section className="section">
      <div className="container">
        <h1 className="format-section__title">File formats</h1>
        <p className="lead muted">
          Binary format reference for KotOR I & II (ERF, GFF, etc.). Definitions are loaded when you open a format.
        </p>
        <ul className="format-list card">
          {FORMATS.map((format) => (
            <li key={format.id} className="format-list__item">
              <Link to={`/formats/${format.id}`} className="format-list__link">
                <span className="format-list__name">{format.name}</span>
                {format.description && (
                  <span className="format-list__desc muted">{format.description}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
