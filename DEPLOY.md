# Deploy to Railway

This site ships with a tiny Express server (`server.js`) so Railway can run it.
It listens on `process.env.PORT` (Railway sets this) — don't hard-code a port.

## Easiest path — GitHub, no tools needed
1. Create a new repo on github.com and upload everything in this folder
   (drag-and-drop in the GitHub web "Add file → Upload files" works).
2. On railway.com: **New Project → Deploy from GitHub repo** → pick the repo.
3. Railway detects Node, runs `npm install` then `npm start` automatically.
4. Open the service → **Settings → Networking → Generate Domain**.
   Your site is live at the generated URL. Done.

## Fastest path — Railway CLI (from this folder)
```
npm i -g @railway/cli      # or: brew install railway
railway login
railway init               # name the project
railway up                 # uploads this folder, builds & deploys in the cloud
railway domain             # creates a public URL
```
You don't need Node installed locally for the build — Railway builds it remotely.

## Notes
- Every push to the GitHub repo auto-redeploys (if you used the GitHub path).
- To test locally first: `npm install` then `npm start`, open http://localhost:3000
- The 714 `.sigml` files + JSON are all served as static assets; nothing else
  to configure.
