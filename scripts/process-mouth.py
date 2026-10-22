"""Optional: knock out the black oval fill only. Do NOT use for the live site.

The website uses the raw asset (see scripts/sync-mouth.mjs) so the mouth matches
new-assets/mouth.png pixel-for-pixel.
"""
from __future__ import annotations

import collections
import sys
from pathlib import Path

from PIL import Image

TH = 32


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    src = root.parent / "new-assets" / "mouth.png"
    if len(sys.argv) > 1:
        src = Path(sys.argv[1])
    dst = root / "public" / "images" / "trollbelle-mouth.png"
    img = Image.open(src).convert("RGBA")
    w, h = img.size
    px = img.load()

    def is_dark(x: int, y: int) -> bool:
        r, g, b, a = px[x, y]
        return a > 0 and r < TH and g < TH and b < TH

    seen: set[tuple[int, int]] = set()
    comps: list[list[tuple[int, int]]] = []
    for sx in range(w):
        for sy in range(h):
            if not is_dark(sx, sy) or (sx, sy) in seen:
                continue
            q: collections.deque[tuple[int, int]] = collections.deque([(sx, sy)])
            seen.add((sx, sy))
            comp = [(sx, sy)]
            while q:
                x, y = q.popleft()
                for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                    if is_dark(nx, ny) and (nx, ny) not in seen:
                        seen.add((nx, ny))
                        comp.append((nx, ny))
                        q.append((nx, ny))
            comps.append(comp)

    if not comps:
        raise SystemExit("no dark regions found")
    largest = max(comps, key=len)
    for x, y in largest:
        px[x, y] = (0, 0, 0, 0)
    dst.parent.mkdir(parents=True, exist_ok=True)
    img.save(dst, optimize=True)
    print(f"wrote {dst} (removed {len(largest)} px from oval)")


if __name__ == "__main__":
    main()
