# EmailJS Configuration

The footer newsletter form relies on EmailJS. Follow the steps below to enable live submissions.

## 1. Create EmailJS resources
1. Sign up at [emailjs.com](https://www.emailjs.com/) and verify your account (free tier covers 200 emails/month).
2. Add an email service (Gmail/Outlook/SMTP) and note the **Service ID**.
3. Create a template named “Newsletter Signup” with a subject such as `Newsletter-Anmeldung - Hellers Kaffees` and include the placeholder `{{email}}` in the body. Save the **Template ID**.
4. Copy your **Public Key** from **Account → General**.

## 2. Update the project configuration
Edit `scripts/main.js` and replace the placeholders in `EMAILJS_CONFIG` (`scripts/main.js:814`) with the values from step 1. Example:

```js
const EMAILJS_CONFIG = {
  publicKey: 'public_xxxxx',
  serviceId: 'service_abc123',
  templateId: 'template_xyz789'
};
```

Optional: adjust the fallback contact email inside the success handler if the recipient address changes.

## 3. Test the form
1. Load any page with the footer form (e.g., `index.html`).
2. Submit a test email address.
3. Confirm a success message appears and check the EmailJS dashboard/inbox for the submission.

## 4. Troubleshooting
- “Newsletter-Service ist noch nicht konfiguriert” → confirm all three IDs are set and not the default placeholders.
- “EmailJS SDK nicht geladen” → ensure the CDN script tag in each HTML `<head>` resolves (see `french-press.html:31`).
- No email received → check EmailJS logs, reconnect the service, and inspect spam folders.

Rotate keys if they leak and keep credentials outside of version control for production deployments.
