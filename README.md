# Vikram Balla — Portfolio

Personal portfolio site. Plain HTML, CSS and JavaScript: no build step, no dependencies.

```
index.html      page content
styles.css      styles (light + dark theme)
script.js       theme toggle, mobile menu, scroll effects
assets/         résumé PDF and favicon
.nojekyll       tells GitHub Pages to serve files as-is
```

## Preview locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy to GitHub Pages

1. Create a repository named `vikramballa.github.io` (or any name).
2. Push these files to the `main` branch, at the repository root.
3. In the repository, open **Settings → Pages**, set **Source** to *Deploy from a branch*, choose `main` and `/ (root)`.
4. The site goes live at `https://vikramballa.github.io/` (or `https://vikramballa.github.io/<repo-name>/`).

## Editing

- Content lives in `index.html`; search for `TODO` to find the spots to personalize.
- To update the résumé, replace `assets/Vikram_Balla_Resume.pdf` (keep the same filename).
- Accent color: change `--accent` in `styles.css` (once for light, twice for dark).
