import { useAppContext } from '../../hooks/useAppContext';

export default function Home() {
  const { state, updateGuildId } = useAppContext();
  const { inviteUrl } = state.config;
  const { online, presenceCount, guildId, isLoading, error } = state.discord;

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="badge"><span className="nowrap">KotOR I & II</span> <span className="sep">•</span> Modding & Reverse‑Engineering</span>
            <h1 className="headline">OpenKotOR — the community hub for tools, docs, and deep dives into the Odyssey engine.</h1>
            <p className="sub">We're a collaborative Discord focused on modding and reverse‑engineering <em>Star Wars: Knights of the Old Republic</em> I & II — from file formats and dialogue cameras to full engine re‑implementations.</p>
          </div>
          <div>
            <div className="kotor-frame card" aria-hidden="true">
              <div style={{ textAlign: "center", padding: 16 }}>
                <div style={{ fontWeight: 800, fontSize: 22, letterSpacing: ".3px", marginBottom: 6 }}>Odyssey Engine • OpenKotOR</div>
                <div className="muted" style={{ fontSize: 14 }}>File formats • Dialogue cameras • Pathfinding • Rendering • Tools</div>
                <div style={{ height: 14 }} />
                <div className="row" style={{ justifyContent: "center", gap: 10 }}>
                  <span className="tag">ERF / RIM / MOD</span>
                  <span className="tag">2DA</span>
                  <span className="tag">GFF</span>
                  <span className="tag">DLG cameras</span>
                  <span className="tag">WOK / Walkmesh</span>
                  <span className="tag">MDL/MDX</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="btnrow">
            <a className="cta" href={inviteUrl} target="_blank" rel="noopener" aria-label="Join OpenKotOR Discord">
              <DiscordGlyph />
              <span>Join Discord</span>
              <small>(Instant invite)</small>
            </a>
            <a className="ghost" href="#projects">See community projects</a>
            <span className="discord-pill" title="Live server stats (requires widget enabled)">
              <CircleInfo />
              <span><strong>{isLoading ? "..." : online == null ? "—" : online.toLocaleString()}</strong> online</span>
            </span>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      {/* <section id="features" className="section">
      <div className="container">
        <h2>What you’ll find in OpenKotOR</h2>
        <p className="lead muted">A focused, respectful space for mod authors, engine devs, and curious tinkerers.</p>
        <div className="grid">
          <div className="feature">
            <h3>Reverse‑engineering deep dives</h3>
            <p>From MDL/MDX to BIF/RIM/ERF, dialogue camera params, animations, and pathfinding — learn and share.</p>
          </div>
          <div className="feature">
            <h3>Open tools & engines</h3>
            <p>Contribute to engine re‑implementations, CLIs, and editors. Compare approaches and trade notes.</p>
          </div>
          <div className="feature">
            <h3>Docs & knowledge base</h3>
            <p>Curated references for file formats, scripting, and mod packaging. Easy to search and keep current.</p>
          </div>
        </div>
      </div>
      </section> */}

      {/* PROJECTS / LINKS */}
      <section id="projects" className="section">
      <div className="container">
        <h2>Community projects & resources</h2>
        <div className="cards-12-3">
          <div className="card">
            <h3 style={{ margin: "0 0 6px" }}>KotOR.js</h3>
            <p className="muted">A remake of the Odyssey Game Engine that powered KotOR I & II written in JS (TypeScript).</p>
            <p style={{ margin: "10px 0 0" }}><a className="ghost" href="https://github.com/KobaltBlu/KotOR.js" target="_blank" rel="noopener">GitHub →</a></p>
          </div>
          <div className="card">
            <h3 style={{ margin: "0 0 6px" }}>reone</h3>
            <p className="muted">reone is a free and open source game engine, capable of running Star Wars: Knights of the Old Republic and its sequel, The Sith Lords.</p>
            <p style={{ margin: "10px 0 0" }}><a className="ghost" href="https://github.com/seedhartha/reone" target="_blank" rel="noopener">GitHub →</a></p>
          </div>
          <div className="card">
            <h3 style={{ margin: "0 0 6px" }}>The Northern Lights Project</h3>
            <p className="muted">The Northern Lights Project (a placeholder name) is a full reimplementation of the Aurora/Odyssey engine, targeting the two Knights of the Old Republic games (KotOR 1 and TSL).</p>
            <p style={{ margin: "10px 0 0" }}><a className="ghost" href="https://github.com/lachjames/NorthernLights" target="_blank" rel="noopener">Learn more →</a></p>
          </div>
        </div>
      </div>
      </section>

      {/* STATS (OPTIONAL LIVE) */}
      <section className="section">
      <div className="container">
        <div className="cards-12-4">
          <div className="stat"><span className="muted">Online now</span><strong>{isLoading ? "..." : online == null ? "—" : online.toLocaleString()}</strong></div>
          <div className="stat"><span className="muted">Members</span><strong>{presenceCount == null ? "—" : presenceCount.toLocaleString()}</strong></div>
          <div className="stat"><span className="muted">Text & voice channels</span><strong>#kotor, #modding, #engine‑dev…</strong></div>
          <div className="stat"><span className="muted">Founded</span><strong>Community‑run</strong></div>
        </div>
        {error && (
          <p className="muted" style={{ marginTop: 8, fontSize: 13, color: "var(--error)" }}>
            Error: {error}
          </p>
        )}
      </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section">
      <div className="container faq">
        <h2>FAQ</h2>
        <details>
          <summary>Is this an official project by the original game developers?</summary>
          <p className="muted">No. OpenKotOR is a fan‑run community focused on research and modding. Respect IP and follow the rules in our Discord.</p>
        </details>
        <details>
          <summary>Can I share code or tools here?</summary>
          <p className="muted">Yes, open‑source contributions are encouraged. Please pick licenses compatible with community goals, and avoid distributing game assets.</p>
        </details>
        <details>
          <summary>How do I join?</summary>
          <p className="muted">Click the <em>Join Discord</em> button above. Once in, read the rules and check the pinned getting‑started posts.</p>
        </details>
      </div>
      </section>
    </>
  );
}

function DiscordGlyph(){
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="#0b1020" d="M20.317 4.369A19.91 19.91 0 0 0 16.555 3c-.163.293-.35.69-.479 1.002a18.27 18.27 0 0 0-4.152 0A7.18 7.18 0 0 0 11.446 3a19.91 19.91 0 0 0-3.761 1.369C4.4 7.198 3.675 10.02 3.897 12.79c1.58 1.18 3.108 1.9 4.61 2.373.356-.49.675-1.014.95-1.564-.525-.2-1.025-.449-1.5-.742.125-.092.247-.188.365-.287 2.894 1.35 6.02 1.35 8.888 0 .12.1.243.195.369.287-.474.293-.974.542-1.5.742.275.55.594 1.074.95 1.564 1.503-.473 3.032-1.194 4.61-2.373.379-4.689-.65-7.49-2.321-8.421ZM9.859 12.516c-.86 0-1.564-.79-1.564-1.761 0-.97.7-1.76 1.564-1.76.864 0 1.565.79 1.565 1.76s-.701 1.761-1.565 1.761Zm4.282 0c-.863 0-1.564-.79-1.564-1.761 0-.97.7-1.76 1.564-1.76.864 0 1.565.79 1.565 1.76s-.701 1.761-1.565 1.761Z"/></svg>
  );
}

function CircleInfo(){
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 16, height: 16 }}>
      <path fill="currentColor" d="M12 3a9 9 0 1 0 .001 18.001A9 9 0 0 0 12 3Zm0 4a1.25 1.25 0 1 1 0 2.5A1.25 1.25 0 0 1 12 7Zm2.75 9.25h-5.5a.75.75 0 1 1 0-1.5h1.75V10.5H9.75a.75.75 0 1 1 0-1.5h2.5a.75.75 0 0 1 .75.75v5h1.75a.75.75 0 1 1 0 1.5Z" />
    </svg>
  );
}