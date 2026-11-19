# CARBONCUT — Interactive Carbon Footprint & Reduction Assessment

Static web application demonstrating an **Interactive DOM Component** (5-question Carbon Readiness Quiz with live `Question 1/5` progress bar, real-time `Score` counter, `A/B/C/D` answer rows, and instant feedback), paired with a **Carbon Footprint Tracking Calculator** and a live JavaScript **CRUD** action checklist.

## Files Included
- `index.html` — Root HTML entry point for GitHub Pages and Vercel.
- `carboncut_assessment_ui.css` — Responsive styles replicating the blush-rose interactive quiz interface, calculator, and checklist.
- `carboncut_assessment_logic.js` — Event-driven quiz state machine, real-time carbon calculator, and CRUD task array (`addTask()`).
- `vercel.json` — Zero-config Vercel static deployment configuration.

## GitHub & Vercel Deployment Steps
1. Extract `carboncut_readiness_quiz_v2.zip` and open a terminal inside `carboncut_readiness_quiz_v2`.
2. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Add CARBONCUT interactive carbon readiness quiz website"
   git branch -M main
   git remote add origin https://github.com/<your-username>/carboncut-readiness-quiz-v2.git
   git push -u origin main
   ```
3. Open [vercel.com](https://vercel.com), click **Add New → Project**, import `carboncut-readiness-quiz-v2`, keep Framework Preset as **Other**, and click **Deploy**.
