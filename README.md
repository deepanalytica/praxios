# PRAXIOS — Investor Microsite

Static, dependency-free investor dossier for PRAXIOS.

## Local preview

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## Deploy to GitHub Pages

1. Create a GitHub repository.
2. Upload this folder to the repository root.
3. Push to `main`.
4. In **Settings → Pages**, choose **GitHub Actions** as the source.
5. The included workflow deploys the site automatically.

## Deploy to Cloudflare Pages

Connect the GitHub repository in Cloudflare Pages with:

- Framework preset: `None`
- Build command: leave empty
- Output directory: `/`

The included `_headers` file adds baseline security headers.

## Investor access form

The default build intentionally does **not** transmit investor information. The form generates a formatted access request locally and copies it to the clipboard.

For production, connect the form to your preferred backend (Cloudflare Worker/Pages Function, CRM, email provider, etc.) and update the privacy copy accordingly.

## Content notes

Market-signal cards link directly to Sequoia Capital, Carta, Silicon Valley Bank and Bessemer Venture Partners source material. The pre-seed target is presented as a planning range, not as a committed financing term.
