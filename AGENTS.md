## Learned User Preferences

- For GitHub Actions deploys to Hugging Face, either repository secret name is fine: `HF_TOKEN` or `HF_ACCESS_TOKEN` (same value; the workflow treats the second as a fallback if the first is unset).
- When a static build is fully deployed, the Hugging Face Space is expected to match the production openkotor.com design, not the default Gradio “get started” placeholder.

## Learned Workspace Facts

- The Vite app writes production output to `docs/`. `VITE_BASE` must be `/<GitHub repository name>/` for GitHub project Pages and `/` for a Hugging Face static Space; the React Router `basename` must stay consistent with Vite’s `base` / `import.meta.env.BASE_URL`.
- A Hugging Face static Space still shows the Gradio template if the Space repo’s root `README.md` says `sdk: gradio`. Uploads must include the static metadata README (in-repo `scripts/hf-space-README.md`, typically copied into the build as `docs/README.md`) with `sdk: static` and `app_file: index.html` so the Hub serves the Vite `index.html`.
- The `deploy-site` workflow’s “Sync Hugging Face Space” job only updates the Space when a write-capable Hub token is present in repository secrets; without it, earlier builds can succeed on GitHub while the Space stays on the old SDK or placeholder.
- Default Hub Space id is **`OpenKotOR/site`** → static app URL **`https://openkotor-site.static.hf.space/`** (Hub hostnames are always `{org_slug}-{space_slug}.static.hf.space`, not a bare `openkotor.static.hf.space` on `*.hf.space`).
