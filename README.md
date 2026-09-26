# Phase 10 Scoreboard — PWA

This is the polished Phase 10 scoreboard as a Progressive Web App.

## Features

- Looks and behaves like an iPhone app
- Installable to the iPhone Home Screen
- Works offline after first load
- Game state automatically saved in the browser
- Up to 12 players
- 10 phases
- Ranked scoreboard
- Round score entry
- Phase progress
- Player round history
- Reset game
- Light/dark system appearance

## Put it online

A PWA must be served over HTTPS (localhost is also allowed).

Easy hosting choices include GitHub Pages, Netlify, or Cloudflare Pages.

Upload the files in this folder to your hosting service. Then open the resulting HTTPS address in Safari on the iPhone.

## Install on iPhone

1. Open the PWA URL in Safari.
2. Tap the Share button.
3. Tap "Add to Home Screen".
4. Tap Add.

The app will then launch from the Home Screen in standalone mode.

## Local testing

If Python is installed on your Mac, open Terminal in this folder and run:

python3 -m http.server 8000

Then open http://localhost:8000 in a browser on the Mac.

For iPhone testing on the same Wi-Fi network, use the Mac's local IP address instead of localhost. For actual Home Screen installation, use HTTPS hosting.
