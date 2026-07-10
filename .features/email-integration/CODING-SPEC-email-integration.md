# CODING SPEC: Email Integration — Contact Form

## Context

The site is a **static site on GitHub Pages** built with Bridgetown. There is no server-side processing available. The contact form in `src/_components/contact_form.liquid` currently has no `action` or submission handler — it does not send data anywhere.

This spec covers the viable approaches for triggering an email when a user completes the Contact Us form.

---

## Option 1: Formspree — CHOSEN

**How it works:** Point the form `action` at a Formspree endpoint. They receive the submission and forward it to your email. Using AJAX mode keeps the user on the page with a custom in-page success state (no redirect).

**Steps:**
1. Sign up at [formspree.io](https://formspree.io) (free tier: 50 submissions/month)
2. Create a new form → get an endpoint like `https://formspree.io/f/xyzabc`
3. Update `contact_form.liquid`:
   - Add `action="https://formspree.io/f/xyzabc"` to the `<form>` tag (no `method="POST"` needed for AJAX mode)
   - Add a hidden `<input type="hidden" name="_subject" value="New Contact Form Submission">` for the email subject
4. Add a `fetch()` submit handler in `frontend/javascript/index.js` to POST the form data to Formspree via AJAX — no page redirect
5. Show a custom in-page success/error message after submission
6. Formspree sends an email to `rupakg@gmail.com` on every submission

**Pros:**
- Zero backend code, free, works out of the box
- Akismet spam filtering included on free tier
- Domain allowlisting available on free tier — restricts endpoint to `kotai.team` only, blocking abuse from other origins
- Existing form HTML and CSS completely unchanged (Formspree is invisible to the DOM)
- AJAX mode keeps the user on the page with a fully custom in-page success state

**Cons:**
- 50 submissions/month on free tier (sufficient for a B2B lead-gen site)
- Default (non-AJAX) behavior redirects to a Formspree-hosted thank-you page — mitigated by using AJAX mode

**Security posture:**
- The Formspree endpoint URL (`https://formspree.io/f/xyzabc`) is visible in the HTML source — this is a URL, not a credential
- Domain allowlisting (free tier) means submissions from origins other than `kotai.team` are rejected by Formspree's servers
- No secrets, API keys, or build pipeline changes required — the endpoint URL is safe to commit to git

---

## Option 2: Web3Forms (Free, no monthly limit)

Same approach as Formspree but no submission limits on the free plan.

**Steps:**
1. Sign up at [web3forms.com](https://web3forms.com), get an access key
2. Add `action="https://api.web3forms.com/submit"` and `method="POST"` to the `<form>` tag
3. Add `<input type="hidden" name="access_key" value="YOUR_KEY">` inside the form
4. Submissions arrive in your inbox immediately

**Pros:** Free with no submission limits, simple integration

**Cons:**
- The `access_key` is exposed in HTML source — it is a routing key (not a credential), but without domain restriction it can be used from any origin to spam your inbox
- **Trusted Domains (domain allowlisting) is a Pro-only feature** — not available on the free tier, leaving the key unprotected against abuse from external origins
- Less control over email formatting compared to EmailJS

**Why not chosen:** Domain restriction is Pro-only. Without it, the exposed `access_key` has no origin-level protection on the free tier. Formspree provides equivalent spam filtering plus free domain allowlisting.

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

**Cons:**
- API key visible in client-side JS bundle — more sensitive than a routing key or endpoint URL (it authenticates API calls)
- Domain allowlisting required to prevent quota abuse, but this adds dashboard configuration overhead
- Requires esbuild pipeline changes, dotenv, GitHub Secrets, and SDK integration — highest implementation complexity of the three options
- 200 emails/month on free tier

**Why not chosen:** Highest complexity, highest abuse surface. The Public Key is an API auth credential baked into the JS bundle. Domain allowlisting mitigates but does not eliminate risk. Formspree achieves the same outcome with far less complexity and lower risk.

---

## Security Comparison (Free Tier)

| | Formspree (Option 1) | Web3Forms (Option 2) | EmailJS (Option 3) |
|---|---|---|---|
| What's exposed | Endpoint URL in HTML | `access_key` in HTML | Public Key in JS bundle |
| Nature of exposure | A URL (not a credential) | A routing key | An API auth key |
| Abuse potential | Inbox spam | Inbox spam | Inbox spam + quota burn |
| Built-in spam filter | Yes (Akismet) | Yes (basic) | No |
| Domain restriction (free) | **Yes** | No (Pro only) | Yes (allowlist) |
| Submission limit | 50/month | 250/month | 200/month |
| Implementation complexity | Minimal — form tag + fetch() | Minimal — form tag + hidden input | High — SDK + build pipeline |

---

## Files to Change

| File | Change |
|---|---|
| `src/_components/contact_form.liquid` | Add `action` attribute and hidden `_subject` input to the `<form>` tag |
| `frontend/javascript/index.js` | Replace dummy submit handler with `fetch()` AJAX call to Formspree + in-page success/error state |

---

## Recommendation

**Use Formspree (Option 1) with AJAX mode.**

- Two-file change — no build pipeline, no SDK, no secrets management
- Free domain allowlisting protects the endpoint from external abuse
- Akismet spam filtering included
- AJAX `fetch()` handler keeps the user on the page with a custom success state
- The endpoint URL is the least sensitive thing that could be exposed — structurally a webhook URL, not a secret
