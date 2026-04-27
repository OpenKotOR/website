import { Link } from 'react-router-dom';
import { SITE_BRAND } from '../../../config/siteBrand';
import TopNav from '../../topnav/topnav';

export default function AppHeader() {
  return (
    <header className="site-header">
      <div className="container nav">
        <Link className="brand" to="/" aria-label={`${SITE_BRAND} home`}>
          <span className="brand-logo">
            <img src="https://avatars.githubusercontent.com/u/231791108?s=200&v=4" alt={SITE_BRAND} />
          </span>
          <span>{SITE_BRAND}</span>
        </Link>
        <TopNav />
      </div>
    </header>
  );
}