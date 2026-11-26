# CareNest — Pixelcraft 2026 (DS-04)

**Smart Family Health Companion**  
A responsive, mobile-first front-end prototype with a desktop-enhanced layout for organizing elderly parents' medicine schedules and health documents.

## Features

- Family dashboard with medicine, dose and report summaries
- Add medicines with dosage, time, instructions and person
- Mark today's doses as taken / not taken
- Upload PDF or image reports (maximum 1 MB per file)
- Search, preview and delete saved reports
- Parent Mode with larger text and simplified medicine cards
- LocalStorage persistence on the current browser/device
- Responsive mobile-first layout with an enhanced desktop dashboard

## Project files

```text
carenest-pixelcraft/
├── index.html
├── styles.css
├── app.js
└── README.md
```

## Run locally

1. Download and extract the project ZIP.
2. Open `index.html` in a modern browser.
3. For the best experience, run it with VS Code Live Server.
4. Test adding a medicine, marking a dose as taken, uploading a small sample report, searching/deleting a report, and Parent Mode.

No build tools or backend are required.

## Deploy with GitHub and Vercel

### GitHub
1. Create a new public repository named `carenest-pixelcraft`.
2. Upload `index.html`, `styles.css`, `app.js`, and `README.md` to the repository root.
3. Commit the files.

### Vercel
1. Sign in to Vercel using GitHub.
2. Select **Add New → Project**.
3. Import `carenest-pixelcraft`.
4. Framework preset: **Other**.
5. Build command: leave blank.
6. Output directory: leave blank / root.
7. Click **Deploy**.
8. Open the deployed URL on a phone and test all key flows.

## Important prototype limitations

- This is a front-end demonstration, not a production medical-record service.
- LocalStorage is browser/device-specific and is not shared between parent and child devices.
- LocalStorage is not encrypted medical storage. Use fictional/sample data only; do not upload real sensitive health records.
- Browser storage is limited. The app restricts each uploaded file to 1 MB, but multiple files may still fill the browser's storage quota.
- Reminder actions are represented in the app; it does not send background push notifications or SMS.
- No medical advice, diagnosis, prescription validation or emergency service is provided.
- A real shared family product would need a secure backend, authentication, authorization, encrypted storage, backups and privacy/security review.

## Suggested demo sequence

1. Open the dashboard and explain the family overview.
2. Add a sample medicine.
3. Mark a dose as taken and show the updated count.
4. Upload a fictional sample report under 1 MB.
5. Search for the report and preview it.
6. Switch to Parent Mode and show the larger, simpler interface.
7. Explain that this prototype stores demo data locally on the device.
