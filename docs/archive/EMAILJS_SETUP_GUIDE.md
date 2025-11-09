# EmailJS Setup Guide — Newsletter Form

## Overview
The newsletter form now uses EmailJS (free alternative to Mailchimp) to send form submissions directly to your email address.

**Free Tier:** 200 emails per month (perfect for newsletter signups)

---

## Setup Steps

### 1. Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### 2. Add Email Service
1. In EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider:
   - **Gmail** (recommended for simplicity)
   - **Outlook**
   - **Custom SMTP** (for other providers)
4. Follow the setup instructions for your provider
5. **Save your Service ID** (e.g., `service_abc123`)

### 3. Create Email Template
1. Go to **Email Templates**
2. Click **Create New Template**
3. Use this template structure:

**Template Name:** Newsletter Signup

**Subject:** `Newsletter-Anmeldung - Hellers Kaffees`

**Content:**
```
Neue Newsletter-Anmeldung

E-Mail-Adresse: {{email}}

Diese Person möchte den Newsletter von Hellers Kaffees erhalten.

---
Gesendet über Hellers Kaffees Website
```

4. **Save your Template ID** (e.g., `template_xyz789`)

### 4. Get Your Public Key
1. Go to **Account** → **General**
2. Find your **Public Key** (e.g., `abcdefghijklmnop`)

### 5. Configure in Code
1. Open `scripts/main.js`
2. Find the `EMAILJS_CONFIG` object (around line 649)
3. Replace the placeholder values:

```javascript
const EMAILJS_CONFIG = {
  publicKey: 'YOUR_PUBLIC_KEY',        // ← Replace with your Public Key
  serviceId: 'YOUR_SERVICE_ID',         // ← Replace with your Service ID
  templateId: 'YOUR_TEMPLATE_ID'       // ← Replace with your Template ID
};
```

**Example:**
```javascript
const EMAILJS_CONFIG = {
  publicKey: 'abcdefghijklmnop',
  serviceId: 'service_abc123',
  templateId: 'template_xyz789'
};
```

### 6. Update Email Address (Optional)
In `scripts/main.js` (line 749), you can change the recipient email:
```javascript
to_email: 'hello@hellerskaffees.com', // Your email address
```

---

## Testing

1. Open your website in a browser
2. Scroll to the footer newsletter form
3. Enter a test email address
4. Click "Abonnieren"
5. Check your email inbox for the notification

**Note:** If you see "Newsletter-Service ist noch nicht konfiguriert", make sure you've updated all three values in `EMAILJS_CONFIG`.

---

## Troubleshooting

### Form shows "Service nicht konfiguriert"
- Check that all three values in `EMAILJS_CONFIG` are updated
- Make sure you're not using the placeholder values

### Form shows "EmailJS SDK nicht geladen"
- Check browser console for script loading errors
- Verify the EmailJS script tag is in the HTML `<head>` section
- Check your internet connection

### Emails not arriving
- Check EmailJS dashboard → **Logs** for error messages
- Verify your email service is connected correctly
- Check spam folder
- Verify template variables match (use `{{email}}` in template)

### Rate limit errors
- Free tier: 200 emails/month
- Upgrade to paid plan if needed
- Consider adding rate limiting on frontend

---

## Security Notes

- **Public Key is safe to expose** (it's designed for client-side use)
- EmailJS handles spam protection
- Consider adding reCAPTCHA for additional protection (optional)
- Monitor EmailJS dashboard for suspicious activity

---

## Alternative: Formspree

If you prefer an even simpler solution:

1. Go to [https://formspree.io/](https://formspree.io/)
2. Sign up (free: 50 submissions/month)
3. Get your form endpoint
4. Update form `action` attribute in HTML

**Pros:** No JavaScript needed, simpler setup  
**Cons:** Lower free tier limit (50 vs 200)

---

## Support

- EmailJS Documentation: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
- EmailJS Support: support@emailjs.com

---

**Last Updated:** November 2025

