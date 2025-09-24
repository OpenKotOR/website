import TopNav from '../../topnav/topnav';

export default function AppHeader() {
  return (
    <header>
      <div className="container nav">
        <a className="brand" href="/" aria-label="OpenKotOR Home">
          <span className="brand-logo">
            <img src="https://avatars.githubusercontent.com/u/231791108?s=200&v=4" alt="OpenKotOR" />
          </span>
          <span>OpenKotOR</span>
        </a>
        <TopNav />
      </div>
    </header>
  );
}