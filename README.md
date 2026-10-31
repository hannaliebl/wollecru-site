# Wollecru — farm website

A one-page static site built with [Eleventy](https://www.11ty.dev/), editable through [Pages CMS](https://pagescms.org/), and hosted on Netlify.

## Local development

```sh
npm install
npm start          # http://localhost:8080 (live reload)
npm run build      # outputs _site/
```

## Where content lives

| File | What it is | Edited by |
|------|------------|-----------|
| `src/_data/site.json` | Name, tagline, browser title, search description, shop link, contact email, logo | CMS |
| `src/_data/meta.js` | The live site's URL, used for the canonical link, link previews, and the sitemap | Maintainers |
| `src/_data/intro.json` | "Farming Healthy Soil" intro | CMS |
| `src/_data/wool.json`, `flora.json`, `wine.json` | Each section: a list of parts (heading + Markdown text + photos) | CMS |
| `src/_data/contact.json` | Contact section, newsletter embed, bottom photo, credits | CMS |
| `src/img/` | All images, including photos uploaded through the CMS | CMS |
| `src/index.njk` | The page template (same markup as the old hand-written `index.html`) | Maintainers |
| `src/styles.css` | Styles. Section header background photos are set here. | Maintainers |
| `.pages.yml` | What the CMS shows editors | Maintainers |

The menu and section anchors (`#wool`, `#flora`, …) are fixed in `src/index.njk`.

## Images

`<img>` tags in the page are resized to several widths and converted to WebP at build time (Eleventy Image), with `loading="lazy"`. Add `eleventy:ignore` to an `<img>` to skip this. The section header backgrounds in `styles.css` are shrunk in place after the build, keeping their file names. The link preview image (`og-image.jpg`) and favicons are generated from photos in `src/img/`; see `eleventy.config.js`.

## Deployment

Netlify builds every push using `netlify.toml` (`npm run build`, publish `_site/`). That file overrides the build settings in the Netlify UI. Saves in Pages CMS are commits, so they deploy too.

## Pages CMS setup

1. Go to [app.pagescms.org](https://app.pagescms.org), sign in with GitHub, and install the Pages CMS app on this repo.
2. Open the repo → **Settings → Collaborators** → invite editors by email.
