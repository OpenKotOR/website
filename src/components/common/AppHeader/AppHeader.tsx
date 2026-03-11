import { Link } from 'react-router-dom';
import TopNav from '../../topnav/topnav';

export default function AppHeader() {
  return (
    <header className="site-header">
      <div className="container nav">
        <Link className="brand" to="/" aria-label="OpenKotOR Home">
          <span className="brand-logo">
            <img src="https://avatars.githubusercontent.com/u/231791108?s=200&v=4" alt="OpenKotOR" />
          </span>
          <span>OpenKotOR</span>
        </Link>
        <TopNav />
      </div>
    </header>
  );
}