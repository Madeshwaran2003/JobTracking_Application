# Job Application Tracker — Setup Guide

## Project Overview

A modern, full-stack Job Application Tracker built with React + Vite + Tailwind CSS on the frontend and Google Apps Script + Google Sheets on the backend. Features a premium dark dashboard UI with glassmorphism effects, smooth animations, and full CRUD operations.

---

## Quick Start (Local Development with localStorage)

The app works out of the box using localStorage as a fallback when no Google Apps Script URL is configured.

```bash
cd job-tracker
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

---

## Google Sheets + Apps Script Backend Setup

### Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
2. Name it "Job Application Tracker"
3. In Row 1, add these column headers exactly:

| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| id | company | role | jobLink | location | dateApplied | status | notes |

### Step 2: Set Up Google Apps Script

1. In your Google Sheet, go to **Extensions → Apps Script**
2. Delete any existing code in the editor
3. Copy the entire contents of `google-apps-script/Code.gs` from this project
4. Paste it into the Apps Script editor
5. Save the project (Ctrl+S)

### Step 3: Initialize Sheet Headers

1. In the Apps Script editor, select the `setupSheet` function from the function dropdown
2. Click **Run** to format the headers
3. Grant the necessary permissions when prompted

### Step 4: Deploy as Web App

1. Click **Deploy → New Deployment**
2. Click the gear icon next to "Select type" and choose **Web app**
3. Configure:
   - **Description**: "Job Tracker API v1"
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Click **Deploy**
5. **Copy the Web App URL** — you'll need this for the frontend

### Step 5: Connect Frontend to Backend

1. Open the `.env` file in the project root
2. Set the API URL:

```env
VITE_API_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

3. Restart the dev server:

```bash
npm run dev
```

---

## Project Structure

```
job-tracker/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Dashboard/
│   │   │   ├── AnalyticsCards.jsx    # Summary stats cards
│   │   │   ├── ApplicationTable.jsx  # Main data table
│   │   │   └── EmptyState.jsx        # Empty state illustration
│   │   ├── Layout/
│   │   │   ├── Layout.jsx            # Main layout wrapper
│   │   │   ├── Navbar.jsx            # Top navigation bar
│   │   │   └── Sidebar.jsx           # Left sidebar navigation
│   │   ├── Modals/
│   │   │   ├── AddEditModal.jsx      # Add/Edit application form
│   │   │   └── ConfirmDeleteModal.jsx # Delete confirmation dialog
│   │   └── UI/
│   │       ├── LoadingSpinner.jsx    # Loading animation
│   │       ├── SearchBar.jsx         # Search input component
│   │       ├── StatusBadge.jsx       # Colored status badges
│   │       └── Toast.jsx             # Toast notifications
│   ├── hooks/
│   │   ├── useApplications.js        # Application data management
│   │   └── useToast.js               # Toast notification system
│   ├── services/
│   │   └── api.js                    # API service with localStorage fallback
│   ├── utils/
│   │   └── constants.js              # Status options, colors, utilities
│   ├── App.jsx                       # Main application component
│   ├── index.css                     # Tailwind CSS + custom styles
│   └── main.jsx                      # React entry point
├── google-apps-script/
│   └── Code.gs                       # Google Apps Script backend
├── .env                              # Environment variables
├── index.html                        # HTML template
├── package.json                      # Dependencies
├── vite.config.js                    # Vite configuration
└── SETUP.md                          # This file
```

---

## Features

- ✅ Dark dashboard UI with glassmorphism effects
- ✅ Responsive sidebar with collapse/expand
- ✅ Analytics cards (Total, Interviews, Rejected, Offers)
- ✅ Professional data table with sticky headers
- ✅ Search by company, role, or location
- ✅ Filter by status
- ✅ Sort by date or company name
- ✅ Add/Edit/Delete applications with modals
- ✅ Color-coded status badges
- ✅ Toast notifications
- ✅ Confirmation dialog before delete
- ✅ Loading spinner
- ✅ Empty state illustration
- ✅ Framer Motion animations
- ✅ Mobile responsive (collapsible sidebar, horizontal scroll table)
- ✅ localStorage fallback when no backend configured
- ✅ Google Sheets as database via Apps Script API

---

## Status Badges

| Status | Color |
|--------|-------|
| Applied | Blue |
| Assessment | Purple |
| Interview | Orange |
| HR Round | Yellow |
| Rejected | Red |
| Offer Received | Green |

---

## API Endpoints (Google Apps Script)

| Method | Action | URL |
|--------|--------|-----|
| GET | Read all | `?action=read` |
| POST | Create | `?action=create` (JSON body) |
| PUT | Update | `?action=update&id=<id>` (JSON body) |
| DELETE | Delete | `?action=delete&id=<id>` |

---

## Deployment

### Frontend (Vercel / Netlify)

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist/` folder to your hosting provider

**Vercel:**
```bash
npx vercel
```

**Netlify:**
```bash
npx netlify deploy --prod --dir=dist
```

### Environment Variable

Set `VITE_API_URL` in your hosting provider's environment variable settings to your Google Apps Script Web App URL.

---

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Backend**: Google Apps Script
- **Database**: Google Sheets
- **Storage Fallback**: localStorage
