# OpenKotOR Website

A React TypeScript website built with Vite for the OpenKotOR community.

## Development

### Prerequisites
- Node.js 22+ (use `.nvmrc` if you use nvm)
- npm

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Starts the Vite development server at http://localhost:3000

### Build for Production
```bash
npm run build
```
Builds the project and outputs to the `docs` folder. Production `base` is controlled with `VITE_BASE` (see [Deployment](#deployment)). Local `npm run dev` uses root `/` by default.

**GitHub project Pages (subpath) test build** (this GitHub repository is `OpenKotOR/website` → `https://<org>.github.io/website/` if you do not use a custom domain):

**Windows (Command Prompt):**
```bat
set VITE_BASE=/website/
npm run build
```

**macOS / Linux (bash),** with the same repo name the workflow uses:
```bash
VITE_BASE=/website/ npm run build
```

CI sets `VITE_BASE` to `/<github-repo-name>/` in [`.github/workflows/deploy-site.yml`](.github/workflows/deploy-site.yml) — for this repo, `/website/`.

### Serve Built Files
```bash
npm run serve
```
Builds the project and serves the `docs` folder using live-server at http://localhost:3000

### Type Checking
```bash
npm run type-check
```
Runs TypeScript type checking without building.

## Deployment

Production is deployed from [`.github/workflows/deploy-site.yml`](.github/workflows/deploy-site.yml) on every push to `main`, on **published** GitHub Releases, and on manual [workflow runs](https://docs.github.com/en/actions/managing-workflow-runs/manually-running-a-workflow) (`workflow_dispatch`).

The workflow runs two static builds: **GitHub Pages** with `VITE_BASE=/<repo>/` (project-site subpath) and a **Hugging Face Space** build with `VITE_BASE=/` at the Space root. That split keeps asset paths and `react-router` correct on each host.

### GitHub Pages

1. In the repository, open **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions** (not *Deploy from a branch* if you use the `deploy-github-pages` job in this repo).
3. The **Deploy site** workflow publishes the `build_github_pages` artifact. The public URL is typically `https://<org>.github.io/<repo>/`.

`GITHUB_TOKEN` is enough; no extra secret is needed for Pages. The publish job uses `id-token: write` and `pages: write` as the official Pages actions require.

### Hugging Face Space

1. **Create the Space once (Static HTML)** using a token that can create repositories in the [OpenKotOR](https://huggingface.co/OpenKotOR) namespace ([token settings](https://huggingface.co/settings/tokens)):

   ```bash
   hf auth login
   hf repos create OpenKotOR/site --repo-type space --space-sdk static --public --exist-ok
   ```

   CI runs the same `hf repos create … --exist-ok` before each upload. Override the Space id with `HF_SPACE_REPO` if needed. Run `hf repos create --help` for other options.

2. In **Settings → Secrets and variables → Actions**, add a secret named either **`HF_TOKEN`** or **`HF_ACCESS_TOKEN`** (same value; the name matches a common local env). Use a user or fine-grained token with **write** access to the Space. Never commit the token, print it, or use it in client-side code. Rotate the token if it is leaked.

3. The **Sync Hugging Face Space** job uploads to **`OpenKotOR/site`** (Space id `HF_SPACE_REPO` in [`.github/workflows/deploy-site.yml`](.github/workflows/deploy-site.yml)). The **canonical Hub mirror** is **`https://openkotor-site.static.hf.space/`** (see [Spaces overview](https://huggingface.co/docs/hub/spaces-overview): the running host is derived from owner + Space name, e.g. `SPACE_HOST` / embed URLs like `https://<author>-<space>.hf.space` in [Spaces embed](https://huggingface.co/docs/hub/spaces-embed); static builds use the `*.static.hf.space` suffix on the same subdomain string).

   **`https://openkotor.static.hf.space/` is not something you can attach to a Space.** That hostname is a single DNS label `openkotor` under the [Public Suffix](https://github.com/publicsuffix/list/pull/2157) zone `static.hf.space`; Hub does not expose “pick any label” for it, and an unauthenticated `GET` currently returns **401** (reserved / unassigned), not your app. The **closest first-party URL** under org **`OpenKotOR`** is therefore **`openkotor-site`** (Space repo `site`) → **`https://openkotor-site.static.hf.space/`**. For a hostname you choose (e.g. `preview.openkotor.com`), use a [custom domain](https://huggingface.co/docs/hub/spaces-custom-domain) (PRO/Team) with a CNAME to `hf.space` as documented there.

**If the Space still shows the Gradio “Get started” tutorial** (or “No application file”) even though `index.html` is on the Hub, the [Space `README.md`](https://huggingface.co/spaces/OpenKotOR/site/raw/main/README.md) is still `sdk: gradio`. A static Vite app **must** use root [`README.md` with `sdk: static`](https://huggingface.co/docs/hub/spaces-sdks-static) — see [`scripts/hf-space-README.md`](scripts/hf-space-README.md). Fix it in either way:

- **From GitHub (no local clone):** push these changes, add **`HF_TOKEN`** in repo secrets, then run the workflow **[Fix HF Space (static README)](.github/workflows/hf-space-set-static-readme.yml)** under the **Actions** tab (**Run workflow**).
- **Locally** (set `HF_TOKEN` or `HF_ACCESS_TOKEN`):

```powershell
.\scripts\fix-hf-space-readme.ps1
```

Full rebuild + upload to the same Space:

```powershell
.\scripts\publish-hf.ps1
```

**Manual upload from your machine (optional):** install the [`hf` CLI](https://huggingface.co/docs/huggingface_hub/main/en/guides/cli) (`pip install "huggingface-hub[cli]"`), set `HF_TOKEN` or `HF_ACCESS_TOKEN`, then from the repository root on Windows:

```powershell
.\scripts\publish-hf.ps1
```

The script runs `VITE_BASE=/` build and `hf upload` to the Space. Override the destination with `HF_SPACE_REPO=Owner/name` if needed.

**If the Space shows the Gradio “get started” page** instead of the app: a [Static HTML Space](https://huggingface.co/docs/hub/spaces-sdks-static) must have a root `README.md` with `sdk: static` (and `app_file: index.html`). This project copies [`scripts/hf-space-README.md`](scripts/hf-space-README.md) into the deploy bundle for every Hub upload. After a successful run, the Space should load `index.html` as the app. (Gradio-specific dependency docs [here](https://huggingface.co/docs/hub/spaces-dependencies) do not apply to static sites.)

**Troubleshooting**

- Missing **`HF_TOKEN` / `HF_ACCESS_TOKEN`**: the job errors; add one of them under Actions secrets and re-run.
- `403` on upload: the token does not have write access to that Space, or the Space is under a different organization than the token is allowed to push to.
- `404` / not found: create the Space first, or point `hf upload` at the correct repository id.
- Space UI still like Gradio after push: in the Space **Files** tab, confirm `README.md` at the top contains `sdk: static` and that `index.html` is at the root; if needed, trigger a **Factory reboot** in Space settings.

## Live Server Configuration

The project is configured to work with VS Code Live Server extension:

1. **VS Code Settings**: The `.vscode/settings.json` file configures Live Server; point the root at the `docs` folder (update it if it still references `dist`).
   - Run on port 3000
   - Auto-open the browser
   - Ignore source files and development dependencies

2. **Usage**:
   - Build the project: `npm run build`
   - Right-click on `docs/index.html` in VS Code
   - Select "Open with Live Server"

## Project Structure

```
├── .github/              # CI: deploy to GitHub Pages and Hugging Face
│   └── workflows/
│       └── deploy-site.yml
├── .nvmrc                # Node version for local dev and Actions
├── docs/                 # Vite build output (served by Live Server and deployed by CI)
│   ├── index.html
│   └── assets/
├── src/                  # Source files
│   ├── App.tsx
│   ├── index.tsx
│   └── app.scss
├── .vscode/
│   └── settings.json
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run serve` - Build and serve with live-server
- `npm run type-check` - Type checking only
