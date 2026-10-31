# Student AI Tools Finder

A simple static web app that helps students discover free AI tools available online.

## Features

- Search for AI tools by keyword
- Filter tools by category
- Open each tool in a new tab
- Uses a local JSON dataset so it is easy to extend

## Run locally

From the project folder, start a simple local server:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Files

- `index.html` – main page
- `style.css` – styling
- `script.js` – search/filter logic
- `tools.json` – list of AI tools
