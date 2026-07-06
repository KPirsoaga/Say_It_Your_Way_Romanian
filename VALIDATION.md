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
Notes: `App.tsx` hides bottom nav on `settings`; `SettingsPage` has no `onBack` prop. Fixed: added `PageHeader` back button wired to `go('home')`.

---

VAL-002
Area: Progress / Daily Practice
Issue: Completing daily practice incorrectly marks the "smalltalk" scenario as done.
Expected behaviour: Daily practice should only update `practisedDays` (and activity counters), not mark an unrelated scenario complete.
Current behaviour: `DailyPage.complete()` calls `markScenarioCompleted('smalltalk')`, inflating scenario completion stats.
Priority: High
Status: Fixed
Notes: Observed in `DailyPage.tsx` line 27. Fixed: removed erroneous `markScenarioCompleted('smalltalk')` call.

---

VAL-003
Area: Progress / localStorage
Issue: Progress calendar uses UTC dates while practice days are stored in local timezone.
Expected behaviour: Calendar squares should match the same local dates used when marking practice.
Current behaviour: `ProgressPage` builds dates with `toISOString()` (UTC) but `todayStr()` stores local dates, so practice may appear on the wrong day for non-UTC timezones.
Priority: High
Status: Fixed
Notes: Affects users west of UTC especially (evening practice logged on wrong day). Fixed: `ProgressPage` now uses shared `toLocalDateStr()` matching `todayStr()`.

---

VAL-004
Area: Progress / Phrase Builder
Issue: Phrase Builder progress is double-counted.
Expected behaviour: Each completed sentence should increment `builderDone` once.
Current behaviour: `PhraseBuilderPage.next()` always calls `addBuilderDone()`, and `PhraseBuilder.finish()` also calls `addBuilderDone()` on correct answers — skip also counts without completing.
Priority: High
Status: Fixed
Notes: Inflates "Phrases built" stat on Progress page. Fixed: removed duplicate `addBuilderDone()` from `PhraseBuilderPage`; only `PhraseBuilder` increments on a correct check.

---

VAL-005
Area: Speech / UX
Issue: Multiple `useSpeech()` hook instances cause stale "Playing…" UI state.
Expected behaviour: When audio stops or a new phrase plays, all play buttons should reset to idle.
Current behaviour: Each component has isolated state; `speechSynthesis.cancel()` from another instance does not reset the first button, leaving stuck "Playing…" / Pause icons (buttons stay disabled).
Priority: High
Status: Fixed
Notes: Reproducible on Scenario detail pages with multiple `PhraseCard` components. Fixed: shared `SpeechProvider` context; play buttons reset correctly across components.

---

VAL-006
Area: Routing / Error handling
Issue: Invalid scenario or conversation IDs cause a runtime crash.
Expected behaviour: Unknown IDs should show a friendly fallback and a way to go back.
Current behaviour: Non-null assertion (`!`) on `find()` result throws when `arg` is invalid or missing.
Priority: High
Status: Fixed
Notes: `ScenarioDetailPage.tsx`, `MiniConversationDetailPage.tsx`. Fixed: friendly fallback UI with navigation when ID is unknown.

---

VAL-007
Area: Navigation / Real Life Mode
Issue: Home shortcut "Appointment" opens the wrong Real Life category.
Expected behaviour: "Appointment" should open appointment/scheduling phrases (`rl-today`).
Current behaviour: Both "Appointment" and "Help" shortcuts use `categoryId: 'rl-help'`.
Priority: Medium
Status: Fixed
Notes: `rl-today` category exists in content but is not linked from home shortcuts. Fixed: Appointment shortcut now opens `rl-today`.

---

VAL-008
Area: Speech / UX
Issue: Play buttons show a Pause icon but cannot stop playback.
Expected behaviour: Tapping again while playing should stop audio, or the icon should not imply pause.
Current behaviour: Buttons are disabled while `isPlaying`, and `useSpeech` has a `stop()` function that is never wired to UI.
Priority: Medium
Status: Fixed
Notes: Affects `PhraseCard`, `ListenChoose`, `SpeakPractice`, `SurvivalPage`, `FavouritesPage`, `TinyPracticePage`, `MiniConversationDetailPage`, `PhraseBuilder`. Fixed: tapping Play while audio is playing now calls `stop()`.

---

VAL-009
Area: Accessibility
Issue: Viewport meta tag disables pinch-to-zoom (`maximum-scale=1.0, user-scalable=no`).
Expected behaviour: Users can zoom for readability (WCAG 1.4.4).
Current behaviour: Zoom is blocked on mobile browsers.
Priority: Medium
Status: Fixed
Notes: `index.html` line 7. Fixed: removed `maximum-scale` and `user-scalable=no` restrictions.

---

VAL-010
Area: UI / Copy
Issue: Ampersand renders as literal `&amp;` in daily practice step title.
Expected behaviour: Step title should read "Listen & choose".
Current behaviour: `DailyPage` passes `"3. Listen &amp; choose"` as a string prop, which JSX renders literally.
Priority: Medium
Status: Fixed
Notes: `ListenChoose` component label has the same issue in JSX text content. Fixed: use `&` directly in JSX strings.

---

VAL-011
Area: localStorage
Issue: Stored progress/settings are not merged with defaults when schema fields are missing.
Expected behaviour: Upgrading or partial JSON should fill in default values for new fields.
Current behaviour: `useLocalStorage` returns parsed JSON as-is; missing fields (e.g. `completedConversations`) can be `undefined` and break `.includes()` / `.length`.
Priority: Medium
Status: Fixed
Notes: Risk for existing users after app updates. Fixed: `useLocalStorage` merges parsed values with defaults.

---

VAL-012
Area: Accessibility
Issue: Clickable `Card` components rendered as `<button>` lack `type="button"`.
Expected behaviour: Interactive cards should use `type="button"` to avoid accidental form submission and follow HTML conventions.
Current behaviour: `Card` renders a plain `<button>` without `type`.
Priority: Low
Status: Fixed
Notes: No forms currently, but affects accessibility tooling and future forms. Fixed: `Card` sets `type="button"` when clickable.

---

VAL-013
Area: Accessibility / Settings
Issue: Text size selector buttons lack `aria-pressed` state for screen readers.
Expected behaviour: Selected text size option is announced as pressed/selected.
Current behaviour: Visual border only; no `aria-pressed` on size buttons.
Priority: Low
Status: Fixed
Notes: `SettingsPage.tsx` text size grid. Fixed: added `aria-pressed` to size selector buttons.

---

VAL-014
Area: PWA
Issue: `theme-color` meta tag does not update when dark mode is enabled.
Expected behaviour: Browser chrome / status bar should match dark background in dark mode.
Current behaviour: Static `#f7f3ea` in `index.html`; `SettingsContext` toggles `dark` class but does not update meta theme-color.
Priority: Low
Status: Fixed
Notes: Minor PWA polish issue on installed app. Fixed: `SettingsContext` updates `theme-color` meta when dark mode toggles.

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
