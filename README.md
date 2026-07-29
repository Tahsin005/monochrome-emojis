# monochrome-emojis

A tiny Next.js API that serves monochrome SVG icons on demand — built for embedding in GitHub `README.md` files.

Two icon sets, one URL pattern:

![target](https://monochrome-emojis.vercel.app/emoji?target=purple&size=xl)
![rocket](https://monochrome-emojis.vercel.app/emoji?rocket=red&size=xl)
![graduation_cap](https://monochrome-emojis.vercel.app/emoji?graduation_cap=blue&size=xl)
![laptop](https://monochrome-emojis.vercel.app/emoji?laptop=green&size=xl)
![brain-circuit](https://monochrome-emojis.vercel.app/lucid?brain-circuit=purple&size=xl)
![rocket](https://monochrome-emojis.vercel.app/lucid?rocket=red&size=xl)
![github](https://monochrome-emojis.vercel.app/lucid?github=blue&size=xl)
![terminal](https://monochrome-emojis.vercel.app/lucid?terminal=green&size=xl)

## Routes

### `/emoji` — custom hand-crafted icons

```
GET /emoji?<icon>=<color>&size=<size>
```

22 curated icons with unique path data. Add more via `lib/emoji-data.ts`.

### `/lucid` — full Lucide icon set (1,925 icons)

```
GET /lucid?<icon>=<color>&size=<size>
```

Every icon from the [Lucide](https://lucide.dev) library, served on demand. The icon name is the kebab-case Lucide slug (e.g. `arrow-right`, `brain-circuit`, `github`).

## Fallback behavior

- Unknown icon name → default fallback SVG is returned (never an error)
- Unknown color → falls back to `black`
- Missing `size` → defaults to `md` (24 px)

## Supported colors

| key      | hex       |
|----------|-----------|
| `red`    | `#ef4444` |
| `green`  | `#22c55e` |
| `blue`   | `#3b82f6` |
| `purple` | `#7E51B3` |
| `white`  | `#ffffff` |
| `black`  | `#000000` |

## Supported sizes

| key   | px |
|-------|----|
| `sm`  | 16 |
| `md`  | 24 |
| `lg`  | 32 |
| `xl`  | 40 |
| `2xl` | 48 |
| `3xl` | 64 |

## Quick examples

```md
<!-- custom emoji icon -->
![rocket](https://monochrome-emojis.vercel.app/emoji?rocket=red&size=xl)

<!-- lucide icon -->
![github](https://monochrome-emojis.vercel.app/lucid?github=blue&size=xl)
![terminal](https://monochrome-emojis.vercel.app/lucid?terminal=green)
```

## Try it locally

```bash
git clone https://github.com/Tahsin005/monochrome-emojis.git
cd monochrome-emojis
npm install
npm run dev
```

Then open the explorer at **http://localhost:3000** — search icons, pick a color and size, and copy the ready-to-paste markdown.

Or hit the routes directly:

```
http://localhost:3000/emoji?rocket=purple&size=xl
http://localhost:3000/lucid?github=blue&size=lg
http://localhost:3000/lucid?terminal=green
```

## Embedding inline with text

GitHub strips `![]()` inside HTML blocks (table cells, `<p>`, `<a>`, etc.). Use a raw `<img>` tag instead:

```html
<img src="https://monochrome-emojis.vercel.app/lucid?terminal=green" width="20" height="20" align="absmiddle"/> Currently building
```

Plain markdown paragraphs and list items work fine with `![]()`. The `<img>` form is the safer default if you're unsure which context you're in.

## Fixing vertical alignment

GitHub strips `style=""` attributes from README HTML, so `vertical-align: middle` isn't available. Use the `align` attribute instead:

```html
<img src="..." align="absmiddle"/>   <!-- centers icon against the middle of the text line -->
```

| `align` value | effect |
|---|---|
| `absmiddle` | centers the icon on the line — use this by default |
| `top` | aligns icon top with the tallest item on the line |
| `texttop` | aligns icon top with the text's top |
| `middle` | aligns icon middle with the text baseline (sits a bit high) |
| `bottom` (default) | aligns icon bottom with the text baseline |

## Project structure

```
app/
  emoji/route.ts        # custom icon API
  lucid/route.ts        # Lucide icon API (reads from node_modules/lucide-static)
  contribute/page.tsx   # contribution guide
lib/
  emoji-data.ts         # ICONS map, COLORS, SIZES  ← contribute here
  lucide-icons.ts       # auto-generated Lucide path data (do not edit)
scripts/
  generate-icon-data.mjs  # regenerates lib/lucide-icons.ts from lucide-static
# /icons is gitignored — it's a copy of node_modules/lucide-static/icons
#   used only as a convenience when running the generator locally
```

## Contributing

Contributions are for **custom emoji icons only** — add a new entry to `lib/emoji-data.ts`. See the [contribute page →](https://monochrome-emojis.vercel.app/contribute) for the full walkthrough.

The Lucide icon set (`/lucid` route) is auto-generated from the [lucide-static](https://github.com/lucide-icons/lucide) package and is not open for contributions here. Want a new Lucide icon? Contribute upstream at [lucide-icons/lucide](https://github.com/lucide-icons/lucide).

## License

MIT