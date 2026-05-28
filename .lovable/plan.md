## Integrate FormSubmit.co for Contact Form

### Goal
Wire up the portfolio's contact form so submissions are emailed directly to `isribalajj335@gmail.com` via **FormSubmit.co** — a free, no-signup form backend.

### Changes
1. **Update form element** (`src/routes/index.tsx` lines 260-270):
   - Change `<form>` `action` to `https://formsubmit.co/isribalajj335@gmail.com`
   - Set `method="POST"`
   - Remove the `onSubmit` alert handler
2. **Add required `name` attributes** to inputs:
   - Name field → `name="name"`
   - Email field → `name="email"`
   - Message field → `name="message"`
3. **Add hidden FormSubmit options**:
   - `_subject` — custom email subject (e.g. "New Portfolio Contact")
   - `_next` — redirect URL back to the portfolio after submission
   - `_template` — `box` for a clean email layout
4. **Keep existing styling** — no visual changes, just wiring.

### Result
Visitors fill out the contact form, hit Send, and the details arrive in the Gmail inbox within seconds. No backend code or API keys needed.