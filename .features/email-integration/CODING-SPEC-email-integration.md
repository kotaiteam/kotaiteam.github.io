# CODING SPEC: Email Integration — Contact Form

## Context

The site is a **static site on GitHub Pages** built with Bridgetown. There is no server-side processing available. The contact form in `src/_components/contact_form.liquid` currently has no `action` or submission handler — it does not send data anywhere.

This spec covers the viable approaches for triggering an email when a user completes the Contact Us form.

---

## Option 1: Formspree (Recommended — simplest)

**How it works:** Point the form `action` at a Formspree endpoint. They receive the submission and forward it to your email.

**Steps:**
1. Sign up at [formspree.io](https://formspree.io) (free tier: 50 submissions/month)
2. Create a new form → get an endpoint like `https://formspree.io/f/xyzabc`
3. Update `contact_form.liquid`:
   - Add `action="https://formspree.io/f/xyzabc"` and `method="POST"` to the `<form>` tag
   - Add a hidden `<input type="hidden" name="_subject" value="New Contact Form Submission">` for the email subject
4. Remove the existing JS submit handler (if any) or let the form POST natively
5. Formspree sends an email to `rupakg@gmail.com` on every submission

**Pros:** Zero backend code, free, works out of the box, spam filtering included
**Cons:** Formspree branding on free tier, 50/month submission limit

---

## Option 2: Web3Forms (Free, no monthly limit)

Same approach as Formspree but no submission limits on the free plan.

**Steps:**
1. Sign up at [web3forms.com](https://web3forms.com), get an access key
2. Add `action="https://api.web3forms.com/submit"` and `method="POST"` to the `<form>` tag
3. Add `<input type="hidden" name="access_key" value="YOUR_KEY">` inside the form
4. Submissions arrive in your inbox immediately

**Pros:** Free with no submission limits, simple integration
**Cons:** Less control over email formatting compared to EmailJS

---

## Option 3: EmailJS (client-side, no form redirect)

**How it works:** JS sends the email directly from the browser — the page does not redirect after submission, enabling a custom in-page success state.

**Steps:**
1. Sign up at [emailjs.com](https://emailjs.com) (free: 200 emails/month)
2. Create an email service (Gmail) + email template in the EmailJS dashboard
3. Add the EmailJS SDK to `src/_components/head.liquid`
4. Replace the form's submit handler in `frontend/javascript/index.js` with an `emailjs.send(...)` call
5. Show a custom success message in the UI without page reload

**Pros:** Full control over UX, no redirect, custom in-page success state
**Cons:** API key visible in client-side JS (mitigated by domain allowlisting in the EmailJS dashboard); 200 emails/month on free tier

---

## Files to Change

| File | Change |
|---|---|
| `src/_components/contact_form.liquid` | Add `action`, `method`, and hidden input fields to the `<form>` tag (Options 1 & 2), or keep as-is and wire up JS handler (Option 3) |
| `src/_components/head.liquid` | Add EmailJS SDK `<script>` tag (Option 3 only) |
| `frontend/javascript/index.js` | Add form `submit` event listener and `emailjs.send()` call (Option 3 only) |

---

## Recommendation

Given the existing site is on GitHub Pages with no backend:

- **Start with Web3Forms or Formspree** — a 2-file change (form action + hidden input), live in minutes.
- **Upgrade to EmailJS** later if a polished in-page success state (no redirect) is needed.
