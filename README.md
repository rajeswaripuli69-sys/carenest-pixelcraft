Smart Family Health Companion
A responsive, mobile-first front-end prototype with a desktop-enhanced layout for organizing elderly parents' medicine schedules and health documents.


Features


Family dashboard with medicine, dose and report summaries

Add medicines with dosage, time, instructions and person

Mark today's doses as taken / not taken

Upload PDF or image reports (maximum 1 MB per file)

Search, preview and delete saved reports

Parent Mode with larger text and simplified medicine cards

LocalStorage persistence on the current browser/device

Responsive mobile-first layout with an enhanced desktop dashboard


Project files

carenest-pixelcraft/
├── index.html
├── styles.css
├── app.js
└── README.md

Run locally


Download and extract the project ZIP.

Open index.html in a modern browser.

For the best experience, run it with VS Code Live Server.

Test adding a medicine, marking a dose as taken, uploading a small sample report, searching/deleting a report, and Parent Mode.


No build tools or backend are required.


Deploy with GitHub and Vercel

GitHub


Create a new public repository named carenest-pixelcraft.

Upload index.html, styles.css, app.js, and README.md to the repository root.

Commit the files.


Vercel


Sign in to Vercel using GitHub.

Select Add New → Project.

Import carenest-pixelcraft.

Framework preset: Other.

Build command: leave blank.

Output directory: leave blank / root.

Click Deploy.

Open the deployed URL on a phone and test all key flows.


Important prototype limitations


This is a front-end demonstration, not a production medical-record service.

LocalStorage is browser/device-specific and is not shared between parent and child devices.

LocalStorage is not encrypted medical storage. Use fictional/sample data only; do not upload real sensitive health records.

Browser storage is limited. The app restricts each uploaded file to 1 MB, but multiple files may still fill the browser's storage quota.

Reminder actions are represented in the app; it does not send background push notifications or SMS.

No medical advice, diagnosis, prescription validation or emergency service is provided.

A real shared family product would need a secure backend, authentication, authorization, encrypted storage, backups and privacy/security review.


Suggested demo sequence


Open the dashboard and explain the family overview.

Add a sample medicine.

Mark a dose as taken and show the updated count.

Upload a fictional sample report under 1 MB.

Search for the report and preview it.

Switch to Parent Mode and show the larger, simpler interface.

Explain that this prototype stores demo data locally on the device.

