Before any UI work, read DESIGN.md and follow it strictly. Use sx, never style.

Components live in client/src/componetns/ (note the spelling — this is intentional, do not "fix" it or create a components/ folder).

No hardcoded user-facing strings. Every string a user can see — buttons, 
   labels, errors, empty states, Snackbars, placeholders — must go through 
   `client/src/translations.js` with both `he` and `en` values. Hardcoded 
   Hebrew (or English) in a component is a bug.