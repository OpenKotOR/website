# Push the production static build to the Hugging Face Space (VITE_BASE=/ for Space root).
# Set either $env:HF_TOKEN or $env:HF_ACCESS_TOKEN to a write-capable Hub token.
# Optional: $env:HF_SPACE_REPO = "OldRepublicDevs/site" (default → oldrepublicdevs-site.static.hf.space)
$ErrorActionPreference = "Stop"
$repoRoot = Join-Path $PSScriptRoot ".."
Set-Location $repoRoot

$token = $env:HF_TOKEN
if (-not $token) { $token = $env:HF_ACCESS_TOKEN }
if (-not $token) {
  Write-Error "Set environment variable HF_TOKEN or HF_ACCESS_TOKEN to your Hugging Face access token (write scope for the Space)."
}

$spaceRepo = $env:HF_SPACE_REPO
if (-not $spaceRepo) { $spaceRepo = "OldRepublicDevs/site" }

$env:HF_TOKEN = $token
$env:VITE_BASE = "/"
if (-not $env:VITE_HF_PUBLIC_BRAND) { $env:VITE_HF_PUBLIC_BRAND = "Old Republic Devs" }
Write-Host "Building for Hugging Face Space (base=/ )..."
npm run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

# Root README must declare `sdk: static` or the Hub keeps Gradio and ignores index.html. See:
# https://huggingface.co/docs/hub/spaces-sdks-static
Copy-Item (Join-Path $repoRoot "scripts\hf-space-README.md") (Join-Path $repoRoot "docs\README.md") -Force

Write-Host "Ensuring Space exists and uploading to huggingface.co/spaces/$spaceRepo ..."
hf repos create $spaceRepo --repo-type space --space-sdk static --public --exist-ok --token $token
# One commit: index.html, assets, and README (sdk: static) — the README line is what switches the Space off the Gradio placeholder.
hf upload $spaceRepo "docs" . `
  --repo-type space `
  --commit-message "chore: deploy static Space (Vite) from local"

Write-Host "Done. See https://huggingface.co/spaces/$spaceRepo"
