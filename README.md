# monochrome-emojis

A tiny Next.js API that serves monochrome SVG icons on demand — built for embedding in GitHub `README.md` files.

![target](https://monochrome-emojis.vercel.app/emoji?target=purple&size=xl)
![rocket](https://monochrome-emojis.vercel.app/emoji?rocket=red&size=xl)
![graduation_cap](https://monochrome-emojis.vercel.app/emoji?graduation_cap=blue&size=xl)
![laptop](https://monochrome-emojis.vercel.app/emoji?laptop=green&size=xl)

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
https://monochrome-emojis.vercel.app/emoji?discord=red
https://monochrome-emojis.vercel.app/emoji?github=blue&size=xl
https://monochrome-emojis.vercel.app/emoji?github=yellow
https://monochrome-emojis.vercel.app/emoji?randomname=green
```

Embed directly in a README:

```md
![discord](https://monochrome-emojis.vercel.app/emoji?discord=red)
```

## Supported icons

- `target`
- `puzzle`
- `trophy`
- `briefcase`
- `graduation_cap`
- `person_handrise`
- `person_computer`
- `telescope`
- `rocket`
- `triangular_ruler`
- `open_book`
- `gear`
- `mail_box`
- `email`
- `laptop`
- `brain`
- `internet`
- `back`
- `tools`
- `stats`
- `tick`
- `lock`
- anything else → default fallback icon

## Supported colors

- `red`
- `green`
- `blue`
- `purple`
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


## Embedding inline with text

GitHub strips markdown image syntax (`![]()`) inside HTML blocks — table cells, `<p>`, `<a>`, etc.
Inside those contexts, use a raw `<img>` tag instead:

```html
<img src="https://monochrome-emojis.vercel.app/emoji?rocket=purple" width="20" height="20" align="absmiddle"/> Currently building
```

Plain markdown paragraphs and list items (`- text`) don't have this problem — `![]()` renders fine there.
The HTML `<img>` form works everywhere though, so it's the safer default if you're not sure which context you're in.

## Fixing vertical alignment

By default, inline images align to the text **baseline** — the bottom edge of the icon sits on the baseline,
which usually makes it look like it's floating too high above the center of the line.

GitHub strips `style=""` attributes from README HTML, so `vertical-align: middle` isn't available. Use the
`align` attribute instead:

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