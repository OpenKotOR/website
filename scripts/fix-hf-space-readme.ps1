# If https://huggingface.co/spaces/<YourSpace> shows the Gradio tutorial but index.html was already uploaded,
# the Hub still has the default sdk: gradio README. This replaces ONLY README.md so the Space uses sdk: static
# and serves index.html. Requires HF_TOKEN or HF_ACCESS_TOKEN.
$ErrorActionPreference = "Stop"
$root = Join-Path $PSScriptRoot ".."
$spaceRepo = if ($env:HF_SPACE_REPO) { $env:HF_SPACE_REPO } else { "OpenKotOR/site" }

$token = $env:HF_TOKEN
if (-not $token) { $token = $env:HF_ACCESS_TOKEN }
if (-not $token) { Write-Error "Set HF_TOKEN or HF_ACCESS_TOKEN" }

$env:HF_TOKEN = $token
$env:HF_SPACE_REPO = $spaceRepo
Set-Location $root

# Prefer Python uploader (same as GitHub Actions) — more reliable than hf for single file on Windows
$py = Get-Command py -ErrorAction SilentlyContinue
$python = if ($py) { "py" } else { "python" }
Write-Host "Pushing static README to $spaceRepo (sdk: static)..."
& $python -m pip install -q "huggingface-hub>=0.20" 2>$null
& $python "scripts\upload_space_readme.py"
if ($LASTEXITCODE -ne 0) {
  Write-Warning "Python uploader failed; trying hf upload..."
  $readme = Join-Path $root "scripts\hf-space-README.md"
  hf upload $spaceRepo $readme "README.md" --repo-type space
}
