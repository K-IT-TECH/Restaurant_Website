# Filter accessibility verification

Checked 1 November 2026.

The Open now only / Free delivery controls are native focusable buttons with switch roles, accessible names, and checked states. Price and rating buttons expose pressed states; the distance range has an accessible name and a value in miles. Switches have a visible focus outline.

Validation completed:

- `npm run build` passed.
- `npx --no-install tsc --noEmit` passed.
- The generated bundle mounted in jsdom: both switches were focusable and changed `aria-checked` after activation; a price selection changed `aria-pressed`; the range exposed its name and unit. No jsdom script errors were observed in that flow.
- `git diff --check` passed.

This is DOM simulation, not a physical keyboard or screen-reader audit. Browser/assistive-technology acceptance check: Tab to each switch, activate with Space and Enter, verify filtering and announced state, then reset the filters. The existing Vite configuration emits a future native-config-loader warning; it did not fail this build.

This PR is limited to the filter controls. The existing demo cart and other placeholder product flows are not implemented by this change.
