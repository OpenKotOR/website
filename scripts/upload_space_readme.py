#!/usr/bin/env python3
"""Upload scripts/hf-space-README.md as repo root README.md so the Space uses sdk: static."""
from __future__ import annotations

import os
import sys
from pathlib import Path

REPO = os.environ.get("HF_SPACE_REPO", "OpenKotOR/openkotor-site")
REPO_ROOT = Path(__file__).resolve().parent.parent
README_SRC = REPO_ROOT / "scripts" / "hf-space-README.md"


def main() -> int:
    token = os.environ.get("HF_TOKEN") or os.environ.get("HF_ACCESS_TOKEN")
    if not token:
        print(
            "ERROR: Set HF_TOKEN or HF_ACCESS_TOKEN (Hugging Face write token).",
            file=sys.stderr,
        )
        return 1
    if not README_SRC.is_file():
        print(f"ERROR: Missing {README_SRC}", file=sys.stderr)
        return 1
    try:
        from huggingface_hub import HfApi
    except ImportError:
        print("ERROR: pip install 'huggingface_hub>=0.20'", file=sys.stderr)
        return 1
    os.environ["HF_TOKEN"] = token
    api = HfApi(token=token)
    print(f"Uploading {README_SRC.name} -> README.md on {REPO} (type=space)...", flush=True)
    api.upload_file(
        path_or_fileobj=str(README_SRC),
        path_in_repo="README.md",
        repo_id=REPO,
        repo_type="space",
        commit_message="fix(space): set sdk: static; serve index.html (Vite app)",
    )
    print("Done. Space should show the static site at index.html (refresh may take 1–2 min).", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
