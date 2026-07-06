# Validation Register

Evidence-driven validation items for **Say It Your Way Romanian**.  
Status values: `Open` | `Fixed`

---

VAL-001
Area: Navigation
Issue: Settings page has no way to navigate back — bottom nav is hidden and there is no back button.
Expected behaviour: User can return to Home (or previous page) from Settings without using the browser back button.
Current behaviour: Opening Settings from the home gear leaves the user on a page with no in-app navigation.
Priority: High
Status: Fixed
Notes: Fixed: added `PageHeader` back button wired to `go('home')`.

---

VAL-002
Area: Progress / Daily Practice
Issue: Completing daily practice incorrectly marks the "smalltalk" scenario as done.
Expected behaviour: Daily practice should only update `practisedDays` (and activity counters), not mark an unrelated scenario complete.
Current behaviour: `DailyPage.complete()` called `markScenarioCompleted('smalltalk')`.
Priority: High
Status: Fixed
Notes: Removed erroneous `markScenarioCompleted('smalltalk')` call.

---

VAL-003
Area: Progress / localStorage
Issue: Progress calendar uses UTC dates while practice days are stored in local timezone.
Expected behaviour: Calendar squares should match the same local dates used when marking practice.
Current behaviour: `ProgressPage` used `toISOString()` (UTC) but `todayStr()` stores local dates.
Priority: High
Status: Fixed
Notes: `ProgressPage` now uses shared `toLocalDateStr()`.

---

VAL-004
Area: Progress / Phrase Builder
Issue: Phrase Builder progress is double-counted.
Expected behaviour: Each completed sentence should increment `builderDone` once.
Current behaviour: Page and component both incremented; skip also counted.
Priority: High
Status: Fixed
Notes: Only `PhraseBuilder` increments on a correct check.

---

VAL-005
Area: Speech / UX
Issue: Multiple `useSpeech()` hook instances cause stale "Playing…" UI state.
Expected behaviour: When audio stops or a new phrase plays, all play buttons should reset to idle.
Current behaviour: Isolated state per component left stuck play buttons.
Priority: High
Status: Fixed
Notes: Shared `SpeechProvider` context.

---

VAL-006
Area: Routing / Error handling
Issue: Invalid scenario or conversation IDs cause a runtime crash.
Expected behaviour: Unknown IDs should show a friendly fallback and a way to go back.
Current behaviour: Non-null assertion on `find()` result throws.
Priority: High
Status: Fixed
Notes: Friendly fallback UI in scenario and conversation detail pages.

---

VAL-007
Area: Navigation / Real Life Mode
Issue: Home shortcut "Appointment" opens the wrong Real Life category.
Expected behaviour: "Appointment" should open appointment/scheduling phrases (`rl-today`).
Current behaviour: Both "Appointment" and "Help" used `rl-help`.
Priority: Medium
Status: Fixed
Notes: Appointment shortcut now opens `rl-today`.

---

VAL-008
Area: Speech / UX
Issue: Play buttons show a Pause icon but cannot stop playback.
Expected behaviour: Tapping again while playing should stop audio.
Current behaviour: Buttons were disabled while playing.
Priority: Medium
Status: Fixed
Notes: Play buttons call `stop()` on second tap.

---

VAL-009
Area: Accessibility
Issue: Viewport meta tag disables pinch-to-zoom.
Expected behaviour: Users can zoom for readability (WCAG 1.4.4).
Current behaviour: Zoom was blocked on mobile browsers.
Priority: Medium
Status: Fixed
Notes: Removed `maximum-scale` and `user-scalable=no`.

---

VAL-010
Area: UI / Copy
Issue: Ampersand renders as literal `&amp;` in daily practice step title.
Expected behaviour: Step title should read "Listen & choose".
Current behaviour: HTML entity passed as plain string.
Priority: Medium
Status: Fixed
Notes: Use `&` directly in JSX strings.

---

VAL-011
Area: localStorage
Issue: Stored progress/settings are not merged with defaults when schema fields are missing.
Expected behaviour: Upgrading or partial JSON should fill in default values for new fields.
Current behaviour: Parsed JSON returned as-is; missing fields could break.
Priority: Medium
Status: Fixed
Notes: `useLocalStorage` merges parsed values with defaults.

---

VAL-012
Area: Accessibility
Issue: Clickable `Card` components rendered as `<button>` lack `type="button"`.
Expected behaviour: Interactive cards should use `type="button"`.
Current behaviour: Plain `<button>` without `type`.
Priority: Low
Status: Fixed
Notes: `Card` sets `type="button"` when clickable.

---

VAL-013
Area: Accessibility / Settings
Issue: Text size selector buttons lack `aria-pressed` state for screen readers.
Expected behaviour: Selected text size option is announced as pressed/selected.
Current behaviour: Visual border only.
Priority: Low
Status: Fixed
Notes: Added `aria-pressed` to size selector buttons.

---

VAL-014
Area: PWA
Issue: `theme-color` meta tag does not update when dark mode is enabled.
Expected behaviour: Browser chrome should match dark background in dark mode.
Current behaviour: Static light theme color in HTML.
Priority: Low
Status: Fixed
Notes: `SettingsContext` updates `theme-color` when dark mode toggles.

---

VAL-015
Area: Phrase Builder
Issue: Wrong sentence order still advanced to the next item.
Expected behaviour: User must fix or retry before moving on after an incorrect check.
Current behaviour: `onDone()` was called regardless of correctness.
Priority: High
Status: Fixed
Notes: `onDone` only fires on correct order; incorrect shows feedback + try again.

---

VAL-016
Area: Phrase Builder
Issue: No visual feedback on which chunks were wrong after checking.
Expected behaviour: Correct chunks highlighted positively; wrong chunks clearly marked.
Current behaviour: All placed chunks looked the same after check.
Priority: Medium
Status: Fixed
Notes: Chunk buttons use green/coral styling after check.

---

VAL-017
Area: Speak Practice
Issue: "Try again" left "I said it" disabled so user could not re-confirm.
Expected behaviour: After "Try again", user can tap "I said it" again.
Current behaviour: `result` stayed `'said'` after try again path in some flows.
Priority: Medium
Status: Fixed
Notes: `tryAgain` resets `result` to `null`.

---

VAL-018
Area: Listen & Choose
Issue: Feedback not announced to screen readers.
Expected behaviour: Correct/incorrect result is announced accessibly.
Current behaviour: Visual feedback only.
Priority: Medium
Status: Fixed
Notes: Added `role="status"` and `aria-live="polite"` on result; `aria-pressed` on options.

---

VAL-019
Area: Content
Issue: Limited real-life situations for teacher-led practice (lesson, tax, taxi, pharmacy shortcuts, etc.).
Expected behaviour: App covers common daily situations with natural Romanian phrases.
Current behaviour: Some situations missing or only in scenarios, not Real Life shortcuts.
Priority: Medium
Status: Fixed
Notes: Added scenarios (lesson, doctor, taxi, accountant) and 9 Real Life categories with home shortcuts.

---

VAL-020
Area: Grammar Help
Issue: No dyslexia-friendly grammar section for structured learning with Mihaela.
Expected behaviour: Simple visual grammar patterns, verb tables, audio, practise buttons — without cluttering bottom nav.
Current behaviour: Grammar content did not exist.
Priority: Medium
Status: Fixed
Notes: New Grammar Help section on Home; 6 topics + 10 verbs; progress tracked in localStorage.

---
