# Cusdis Comment System Setup Guide

## Overview
The comment system has been implemented using Cusdis, a lightweight and privacy-focused comment platform. This guide will help you set up and configure the system.

## Step 1: Create Cusdis Account

1. Go to https://cusdis.com
2. Sign up for a free account (or log in if you already have one)
3. Create a new site/project for your website

## Step 2: Get Your App ID

1. After creating your site, navigate to the site settings
2. Find your **App ID** (also called Site ID)
3. Copy this ID - you'll need it in the next step

## Step 3: Configure the Comment System

1. Open `src/scripts/comments.js`
2. Find the `CUSDIS_CONFIG` object at the top of the file (around line 9)
3. Replace `YOUR_CUSDIS_APP_ID` with your actual App ID:

```javascript
const CUSDIS_CONFIG = {
  appId: 'your-actual-app-id-here', // Replace with your Cusdis App ID
  apiUrl: 'https://cusdis.com/api',
  autoApprove: true // Comments are auto-approved
};
```

## Step 4: Configure Cusdis Settings

In your Cusdis dashboard:

1. **Auto-approve comments**: Enable this if you want comments to appear immediately (already configured in code)
2. **Spam protection**: Enable Cusdis's built-in spam protection
3. **Email notifications**: Set up email notifications for new comments (optional)

## Step 5: Test the System

1. Build your site: `npm run build`
2. Start the dev server: `npm run dev`
3. Navigate to any brew method page (e.g., `/aeropress.html`)
4. Scroll to the bottom to see the comment preview section
5. Click "Alle Kommentare anzeigen" to open the comment overlay
6. Submit a test comment
7. Verify the comment appears in the preview and in the overlay

## How It Works

### Comment Preview
- Shows the latest comment at the bottom of each brew method page
- Displays author name, date, and truncated comment text
- Button to open full comment section

### Comment Overlay
- Opens as a centered modal when clicking "Alle Kommentare anzeigen"
- Contains:
  - Comment form at the top
  - Full list of all comments below
- Can be closed by:
  - Clicking the X button
  - Clicking the backdrop
  - Pressing Escape key

### Page Identification
Each brew method page has a unique identifier:
- `aeropress` - AeroPress page
- `chemex` - Chemex page
- `cold-brew` - Cold Brew page
- `drip` - Drip page
- `french-press` - French Press page
- `home-espresso` - Home Espresso page
- `kalita-wave` - Kalita Wave page
- `origami-dripper` - Origami Dripper page
- `v60` - V60 page

Comments are stored separately for each page using these identifiers.

## Troubleshooting

### Comments not loading
- Check that your App ID is correctly set in `comments.js`
- Verify your Cusdis account is active
- Check browser console for error messages
- Ensure Cusdis API is accessible (check network tab)

### Comments not submitting
- Verify form fields are filled correctly
- Check browser console for API errors
- Ensure Cusdis App ID is valid
- Check Cusdis dashboard for any account issues

### Overlay not opening
- Check that `comments.js` is loaded (check Network tab)
- Verify no JavaScript errors in console
- Ensure the overlay HTML is created (check Elements tab)

## Customization

### Changing Auto-approve Setting
In `src/scripts/comments.js`, change:
```javascript
autoApprove: false // Set to false for manual moderation
```

### Styling
All comment styles are in `src/styles/styles.css` starting at line 1806. You can customize:
- Colors
- Spacing
- Fonts
- Animations
- Responsive breakpoints

### Form Fields
To modify the comment form, edit the `createOverlay()` function in `comments.js` (around line 60).

## API Reference

The system uses the Cusdis API:
- **Get comments**: `GET https://cusdis.com/api/comments?appId={APP_ID}&pageId={PAGE_ID}`
- **Submit comment**: `POST https://cusdis.com/api/comments`

For more details, see: https://cusdis.com/doc

## Support

If you encounter issues:
1. Check Cusdis documentation: https://cusdis.com/doc
2. Review browser console for errors
3. Verify network requests in browser DevTools
4. Check Cusdis dashboard for comment status

