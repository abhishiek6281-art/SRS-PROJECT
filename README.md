# PillPing CareCircle 3D

A 3D-enabled medication reminder and caregiver dashboard hackathon prototype.

## Run locally
- Install Node.js 18+
- Run `npm install`
- Run `npm start`
- Open `http://localhost:3000`

## Deploy on Render
1. Upload the **contents** of this folder to the root of a GitHub repository (so `package.json`, `server.js`, `render.yaml`, and `public/` are at repository root).
2. In Render choose New → Blueprint and connect the repository, or create a Web Service with build command `npm install` and start command `npm start`.
3. The app serves `public/index.html` at `/` and `/api/health` returns a health check.

## Features
- Three.js animated 3D capsule on the home screen
- Senior-friendly high-contrast interface and large confirmation actions
- Snooze, caregiver dashboard, medicine setup, refill alerts, overdue status
- Browser speech synthesis and optional notifications/chime
- Two fictional patient profiles and eight sample medications

## Demo limitations
This prototype keeps data in server memory; restarting/redeploying the service resets data. Multiple instances will not share state. For real persistence and multi-device sync, add a managed database and WebSockets. Browser timers/notifications are not guaranteed when a browser is closed. It is a hackathon demo, not a medical device. Sample medication information is fictional; follow actual clinician prescriptions.
