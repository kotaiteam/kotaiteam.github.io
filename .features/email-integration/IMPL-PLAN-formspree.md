# Implementation Plan: Formspree Contact Form (Option 1)

## Context

The site is a static site on GitHub Pages built with Bridgetown. The contact form in `src/_components/contact_form.liquid` currently has no submission handler. This plan covers integrating Formspree (Option 1 from the coding spec) using AJAX mode via `fetch()` for a fully in-page experience with no redirect.

---

## Security Review

### What's exposed

Adding `action="https://formspree.io/f/xyzabc"` to the form tag puts the endpoint URL in the HTML source. This is **a URL, not a credential** — it has no authentication value on its own.

### Abuse vector and mitigations

The only abuse vector is someone using the endpoint URL to spam your inbox directly (e.g. via `curl`). Formspree provides two layers of protection on the free tier:

- **Akismet spam filtering** — automatically filters bot and spam submissions
- **Domain allowlisting** — restrict the endpoint to accept submissions from `kotai.team` only; requests from any other origin are rejected at Formspree's server

### Security posture summary

| Item                          | Status                                               |
| ----------------------------- | ---------------------------------------------------- |
| Endpoint URL in HTML source   | Acceptable — a URL, not a secret                     |
| Spam filtering                | Included free (Akismet)                              |
| Domain restriction            | Available free — configure in Formspree dashboard    |
| Secrets in source code or git | None — no keys, no `.env`, no build pipeline changes |
| GitHub Secrets needed         | None                                                 |

---

## Implementation Plan

### Step 1 — Formspree Dashboard Setup

1. Sign up at [formspree.io](https://formspree.io) (free tier: 50 submissions/month)
2. Create a new form → note the endpoint: `https://formspree.io/f/YOUR_FORM_ID`
3. Set the notification email to `info@kotai.team`
4. Under form **Settings → Restrictions**, add `kotai.team` to the allowed domains
5. Optionally set a custom email subject under **Settings → General**

---

### Step 2 — Update `src/_components/contact_form.liquid`

Add the `action` attribute and a hidden subject input to the `<form>` tag:

**Before:**

```html
<form id="contactForm"></form>
```

**After:**

```html
<form id="contactForm" action="https://formspree.io/f/YOUR_FORM_ID">
  <input
    type="hidden"
    name="_subject"
    value="New Contact Form Submission — kotai.team"
  />
</form>
```

No other changes to the form HTML. All existing fields, CSS classes, and layout stay exactly as-is.

---

### Step 3 — Update `frontend/javascript/index.js`

Replace the existing dummy submit handler with a `fetch()` AJAX call. This keeps the user on the page — no redirect to Formspree's hosted thank-you page.

**Replace the existing `// ===== CONTACT FORM =====` block:**

```js
// ===== CONTACT FORM =====
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    var submitBtn = contactForm.querySelector('[type="submit"]');
    var originalLabel = submitBtn.textContent;

    // Show sending state
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    // Remove any existing status message
    var existing = contactForm.querySelector(".form-status");
    if (existing) existing.remove();

    fetch(contactForm.action, {
      method: "POST",
      body: new FormData(contactForm),
      headers: { Accept: "application/json" },
    })
      .then(function (response) {
        if (response.ok) {
          contactForm.reset();
          submitBtn.textContent = "Message Sent!";

          var success = document.createElement("p");
          success.className = "form-status form-status--success";
          success.textContent = "Thank you! We'll be in touch soon.";
          contactForm.appendChild(success);

          // Reset button label after 4 seconds
          setTimeout(function () {
            submitBtn.disabled = false;
            submitBtn.textContent = originalLabel;
          }, 4000);
        } else {
          return response.json().then(function (data) {
            throw new Error(data.error || "Submission failed");
          });
        }
      })
      .catch(function (err) {
        console.error("Formspree error:", err);
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;

        var error = document.createElement("p");
        error.className = "form-status form-status--error";
        error.textContent =
          "Something went wrong. Please try again or email us directly.";
        contactForm.appendChild(error);
      });
  });
}
```

Key points:

- `fetch(contactForm.action, ...)` reads the endpoint URL directly from the form's `action` attribute — the JS contains no hardcoded URL
- `new FormData(contactForm)` captures all form fields automatically — no manual field extraction needed
- `Accept: application/json` header tells Formspree to return JSON instead of redirecting
- In-page success and error states, no redirect at any point

---

## Files to Change

| File                                  | Change                                                                              |
| ------------------------------------- | ----------------------------------------------------------------------------------- |
| `src/_components/contact_form.liquid` | Add `action` attribute + hidden `_subject` input to `<form>` tag                    |
| `frontend/javascript/index.js`        | Replace dummy submit handler with `fetch()` AJAX call + in-page success/error state |

No other files need to change. No new dependencies, no build pipeline changes, no secrets.

---

## What This Approach Does NOT Require

- No `.env` file
- No GitHub Secrets
- No esbuild changes
- No new npm/yarn packages
- No SDK or CDN script tags
- No server-side code
