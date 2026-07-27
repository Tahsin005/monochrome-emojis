# monochrome-emojis

A tiny Next.js API that serves monochrome SVG icons on demand — built for embedding in GitHub `README.md` files.

## How it works

Hit `/emoji` with an icon name as the query key and a color as its value. Optionally add `size`.

```
GET /emoji?<icon>=<color>&size=<size>
```

- If the icon name isn't recognized, a default fallback SVG is returned (in the requested color) — no errors, ever.
- If the color isn't recognized, it falls back to the default color (`black`).
- If `size` is omitted, it defaults to `md`.

## Try it locally

```bash
npm run dev
```

Then open these in your browser (or `curl` them):

```
http://localhost:3000/emoji?discord=red
http://localhost:3000/emoji?github=blue&size=xl
http://localhost:3000/emoji?github=yellow
http://localhost:3000/emoji?randomname=green
```

Embed directly in a README:

```md
![discord](http://localhost:3000/emoji?discord=red)
```

## Supported icons

- `github`
- `discord`
- anything else → default fallback icon

## Supported colors

- `red`
- `green`
- `blue`
- `white`
- `black`
- anything else → default color (`black`)

## Supported sizes

| key | px |
|-----|----|
| sm  | 16 |
| md  | 24 |
| lg  | 32 |
| xl  | 40 |
| 2xl | 48 |
| 3xl | 64 |

## Status

🚧 Early version — icon set, color palette, and API shape are still evolving.