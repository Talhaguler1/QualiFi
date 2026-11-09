# QualiFi

An English landing page for conversational AI for CFO teams. Plain HTML, CSS, and JavaScript; no installation or build step needed. Node.js is required for the local server.

## Run locally

```sh
npm run dev
```

Open http://localhost:3000. Stop with Ctrl+C. Override the port with the PORT environment variable if needed.

The separate Turkish landing page is available at http://localhost:3000/tr (source: `tr.html`). The navigation includes a language switch on both pages. Styling and interactions are shared.

Edit `index.html` for copy and structure, `style.css` for design, and `app.js` for interactions. Refresh the browser after changes.

The analyst preview uses prepared sample answers, not a live AI model. The human CTA opens a placeholder dialog until a real contact or booking URL is supplied. No information is submitted or stored. Google Fonts is optional; system fonts are used offline.
