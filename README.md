**English** · [Português](README.pt-BR.md)

# Portfolio · Luana Almeida

A one-page portfolio for a fashion professional. Scrolling tells her career as a story: each project is a chapter with photos and a link to the original post. Plain HTML, CSS and JavaScript, no build step.

## What it does

- **Animated scroll.** GSAP and ScrollTrigger drive the chapters, and Lenis gives smooth scrolling. All three libraries are included in `vendor/`.
- **Chapters from one template.** Each project is an `<article class="chap">` with a photo collage for one to five images.
- **Accessible.** Alt text on every image, respects `prefers-reduced-motion`, and the page still works without JavaScript.
- **Light images.** Photos are WebP.

## Run it

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

It also works on any static host (GitHub Pages, Netlify, Vercel).

## Edit the content

| What | Where |
|---|---|
| Text, chapters, Instagram links | `index.html` (each project is one `<article class="chap">`) |
| "See on Instagram" and "Watch the reel" links | the `href` of each `<a class="ig">` inside a chapter |
| Photos | `assets/img/` (WebP; keep the same file name to swap an image) |
| Colors and fonts | variables at the top of `css/style.css` (`--or` is the orange) |
| Animations | `js/main.js` |

To add a project, copy a whole `<article class="chap">`. Use one of the classes `n1` to `n5` on the `<div class="collage">` for the number of photos (1 to 5). The class `flip` puts the text on the other side.

## Privacy

The certificates in the catalog contain personal ID numbers and birth dates, so they are **not included**. The "Education and courses" section shows only the skill name, the institution and the hours.
