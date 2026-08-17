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

VAL-021
Area: Navigation
Issue: Deep-linked pages (`scenario`, `conversation`, `grammar-topic`, `grammar-verb`) render a blank screen when opened without a valid ID.
Expected behaviour: User sees a friendly fallback with back navigation.
Current behaviour: Conditional render requires `arg`; missing `arg` shows empty main content.
Priority: High
Status: Fixed
Notes: Added `NavigationFallback` component; `App.tsx` handles all four deep-link page types.

---

VAL-022
Area: Mobile layout
Issue: Fixed bottom navigation and settings gear ignore device safe areas (notch, home indicator).
Expected behaviour: Controls remain fully visible and tappable on modern phones.
Current behaviour: `bottom-0` / `top-3` positioning without `env(safe-area-inset-*)` offsets.
Priority: Medium
Status: Fixed
Notes: Bottom nav uses `pb-[env(safe-area-inset-bottom)]`; settings gear uses `max()` with safe-area insets.

---

VAL-023
Area: Mobile layout
Issue: Some secondary pages use `pb-10` bottom padding, risking content sitting too close to the screen edge on pages without bottom nav.
Expected behaviour: Consistent scroll clearance on all full-screen pages.
Current behaviour: `TinyPracticePage`, `NoShamePage`, and conversation-done state used `pb-10`.
Priority: Low
Status: Fixed
Notes: Standardised to `pb-32` on affected pages; `NoShamePage` now uses `PageHeader` like other pages.

---

VAL-024
Area: Accessibility
Issue: Bottom nav buttons lack accessible names; several interactive buttons missing `type="button"`.
Expected behaviour: Screen readers announce nav destinations; buttons do not submit forms accidentally.
Current behaviour: Only visible text labels; `PageHeader`, `Button`, and stat cards missing explicit button types.
Priority: Medium
Status: Fixed
Notes: Added `aria-label` on nav items; `type="button"` on `Button`, `PageHeader`, settings gear, stat cards; `aria-label` on stat cards.

---

VAL-025
Area: Accessibility
Issue: Rotating No-Shame messages are not announced to screen readers.
Expected behaviour: Message changes are conveyed accessibly without being intrusive.
Current behaviour: Visual rotation only.
Priority: Low
Status: Fixed
Notes: Added `role="status"`, `aria-live="polite"`, `aria-atomic="true"` on `NoShameBanner`.

---

VAL-026
Area: Settings / Navigation
Issue: Settings relies solely on header back affordance; users may not realise they can return home.
Expected behaviour: Clear, obvious path back to Home from Settings.
Current behaviour: Back arrow only in header (functional but easy to miss).
Priority: Low
Status: Fixed
Notes: Added explicit “Back to home” button above reset settings.

---

VAL-027
Area: Content / Romanian
Issue: Several Romanian strings need native-speaker review before demo.
Expected behaviour: Natural, correct Romanian with proper diacritics.
Current behaviour: `Țeva apă pe podea.` likely typo; `Pot repeta, vă rog?` mismatches English intent; slow field missing diacritic on `când`.
Priority: Medium
Status: Fixed
Notes: Fixed `Curge apă pe podea.` and `Puteți repeta, vă rog?` per reference; diacritic in slow field fixed earlier. Remaining naturalness items stay in Mihaela Review for readings.

---

VAL-028
Area: Mobile layout
Issue: Text in grid tiles overflows or spills outside card bounds on narrow mobile viewports (especially home shortcut tiles and stat labels).
Expected behaviour: All tile labels wrap cleanly within their cards at 320px width and with large text size enabled.
Current behaviour: Horizontal icon+label layout on home shortcuts left ~88px for long labels; grid children lacked `min-w-0`; buttons used nowrap.
Priority: Medium
Status: Fixed
Notes: Added `.tile-grid` / `.tile-label` utilities; home shortcuts use vertical tile layout; buttons allow wrapping; bottom nav labels scale down on narrow screens.

---

VAL-029
Area: Weekly Topics / Learning Engine
Issue: No structured weekly topic learning path (vocabulary → reading → translation → exercises) as defined in Learning Engine PRD.
Expected behaviour: Reusable Weekly Topics architecture; Topic 1 Building a Cabin with all PRD sections; progress in localStorage; integration with Home, Progress, and Favourites.
Current behaviour: Weekly Topics feature did not exist.
Priority: High
Status: Fixed
Notes: Added `src/content/weeklyTopics/`, reusable pages and exercise components, progress tracking, translation notes in localStorage. PRD at `docs/LearningEngine_PRD.md`.

---

VAL-030
Area: Content / Romanian
Issue: Weekly Topic reading passages and new words were authored for Building a Cabin — need Mihaela review for natural Romanian.
Expected behaviour: Teacher-approved vocabulary; new words flagged separately; uncertain Romanian marked for review.
Current behaviour: Passages use approved vocab plus listed new words (`cabană`, `lemn`, `grădină`, etc.).
Priority: Medium
Status: Open
Notes: All teacher-approved PRD vocabulary included. Reading passages should be reviewed with Mihaela before demo.

---

VAL-031
Area: Grammar Help
Issue: Grammar Help lacked structured reference sections for parts of speech, indicative mood tenses, imperfect, auxiliary verbs, predicative verbs, and common verbs from Mihaela’s notes.
Expected behaviour: Mobile-first stacked cards; dyslexia/ADHD-friendly copy; audio on examples; “Make it simpler” on tenses; progress tracked in `completedGrammarTopics` (localStorage only); no spelling or typing tests.
Current behaviour: Grammar Help had only basic patterns and a short verb list.
Priority: High
Status: Fixed
Notes: Added `grammarExtended.ts`, sectioned `GrammarHelpPage`, conjugation cards for imperfect `a avea`, four new verbs (`a pleca`, `a întreba`, `a mânca`, `a bea`). Weekly Topics unchanged.

---

VAL-032
Area: Content / Romanian
Issue: New Grammar Help reading passages and examples were authored for clarity — need Mihaela review for natural Romanian.
Expected behaviour: Natural Romanian with diacritics; uncertain strings marked for teacher review.
Current behaviour: Parts-of-speech examples, predicative verb sentences, and imperfect examples use teacher-inspired patterns but were not verified in class.
Priority: Medium
Status: Open
Notes: Predicative section has 6 examples (2 per verb for `a fi` and `a deveni`). Existing VAL-027 items (`Pot repeta, vă rog?`) remain open. Review `src/content/grammarExtended.ts` and new verb examples in `grammar.ts`. Items now visible in **Mihaela Review** (Settings → Maintenance / Review).

---

VAL-033
Area: Mihaela Review
Issue: Content flagged for teacher review was only in code comments (`TODO: Review with Mihaela`) — not visible in the app during lessons.
Expected behaviour: Reusable `review` metadata on content items; **Mihaela Review** page lists flagged items with Romanian/English, reason, status, teacher notes; Mark approved / Needs changes saved in localStorage (`rcd-review`); mobile-friendly cards; counts for pending, approved, needs changes.
Current behaviour: No in-app review workflow.
Priority: High
Status: Fixed
Notes: Access via **Settings → Maintenance / Review → Mihaela Review**. Collector at `src/content/review/collectReviewItems.ts`. Converted TODO items in `grammar.ts`, `content.ts`, `buildingCabin.ts`. Grammar Help new verbs and predicative topic flagged. Supplemental registry entries for parts-of-speech and imperfect overview bundles.

---

---

VAL-034
Area: Home / Navigation
Issue: Home page had repetitive sections and Weekly Topics felt secondary; hero duplicated Mini Conversations.
Expected behaviour: Clear order: hero → this week’s lesson (Building a Cabin with progress) → need today → ways to practise → today’s phrase → scenarios.
Current behaviour: Weekly Topics was a small card; conversations appeared in hero and in Ways to practise; No Shame banner repeated.
Priority: Medium
Status: Fixed
Notes: Home links directly to `weekly-topic/building-cabin`; “View all weekly topics” secondary link. Removed duplicate hero conversation button and mid-page No Shame banner.

---

VAL-035
Area: Exercises
Issue: Multiple-choice correct answer often appeared as the top option (content order); match/sort exercises were predictable.
Expected behaviour: Shuffled MC options in Weekly Topics and Listen & Choose; shuffled match columns and sort word pool; correctness unchanged.
Current behaviour: Options rendered in source array order.
Priority: High
Status: Fixed
Notes: `src/utils/shuffle.ts` with `shuffledMcOptions`; applied in `WeeklyMcExercise`, `ListenChoose`, `WeeklyTapMatch`, `WeeklyCategorySort`.

---

VAL-036
Area: Content / Romanian — Building a Cabin
Issue: Reading passages and phrases sounded unnatural (e.g. greblă + gard, “Peretele este mare”, insulation “pe perete”); long TTS passages sounded strange.
Expected behaviour: More natural Romanian where confident; uncertain strings flagged for Mihaela Review; sentence-by-sentence audio on reading pages.
Current behaviour: Passages updated; readings and changed phrase still flagged in Mihaela Review.
Priority: High
Status: Fixed
Notes: Reading 1–3 Romanian/English revised. Phrase “Lucrez la acoperiș” replaces “Ridic acoperișul”. `v-lovi` / `v-gati` flagged off-topic. Weekly reading page adds sentence-by-sentence play.

---

VAL-037
Area: Phrase Builder / Audio
Issue: Phrase Builder chunk feedback could mis-highlight; pronunciation hints could be confused with TTS source.
Expected behaviour: Chunk feedback compares Romanian text; TTS always uses `*.ro`; pron hints labelled as not read aloud.
Current behaviour: Visual check used index comparison only; pron labels generic.
Priority: Low
Status: Fixed
Notes: `PhraseBuilder` compares chunk `.ro` strings. `PhraseCard` and `ListenChoose` label pron as guide only.

---

VAL-038
Area: Navigation
Issue: Bottom nav prioritised Scenarios over the weekly lesson; weekly sub-pages hid the nav.
Expected behaviour: Lesson tab opens Building a Cabin; bottom nav visible on lesson, vocab, reading, and exercise pages.
Current behaviour: Scenarios in bottom nav; weekly pages full-screen without nav.
Priority: High
Status: Fixed
Notes: `BottomNav` Lesson tab → `weekly-topic/building-cabin`. `App.tsx` shows nav on weekly sub-pages.

---

VAL-039
Area: Exercises / Weekly Topics
Issue: Finishing an exercise dropped users with no clear return path; MC options predictable; progress counted 9 steps including translation.
Expected behaviour: Back to topic + Try again on completion; shuffled options; 8 tracked steps (translation optional, not in %).
Current behaviour: Exercises ended without navigation; fixed option order; 9-step progress bar.
Priority: High
Status: Fixed
Notes: `ExerciseCompletion` component; `shuffle.ts` in weekly exercises; `WEEKLY_TOPIC_STEP_COUNT = 8`.

---

VAL-040
Area: Grammar Help
Issue: No quick way to move between verb pages; duplicate auxiliary/predicative cards in overview.
Expected behaviour: Prev/next verb navigation and chip strip; overview hides topics with dedicated verb pages.
Current behaviour: Manual back-and-forth only; duplicate overview entries.
Priority: Medium
Status: Fixed
Notes: `GrammarVerbNav` + `grammarVerbNav.ts`. `GrammarHelpPage` filters `gr-pos-auxiliary` and `gr-pos-predicative`.

---

VAL-041
Area: Home / Daily / Phrase Builder
Issue: Home buried the lesson; daily phrase unrelated to weekly content; Phrase Builder lacked cabin sentences.
Expected behaviour: Lesson-first home; today’s phrase from Building a Cabin; cabin Phrase Builder items first.
Current behaviour: Stats and scenarios dominated; generic daily phrase; generic builder only.
Priority: High
Status: Fixed
Notes: `getWeeklyLessonPhrase`, `cabinPhraseBuilderItems`, home hero “Continue this week’s lesson”.

---

VAL-042
Area: Reading / Terminology
Issue: Readings had no speak step or next-reading flow; “Matching” and “Favourites” labels inconsistent.
Expected behaviour: Speak-out-loud after reveal; Next reading button; “Vocabulary Review” and “Saved” labels.
Current behaviour: Translation-only finish; inconsistent naming.
Priority: Medium
Status: Fixed
Notes: `WeeklyReadingPage` speak + next reading. Progress, exercises, and Saved page relabelled.

---

VAL-043
Area: Content — Building a Cabin
Issue: MC distractor `a găti` was off-topic for cabin vocabulary exercise.
Expected behaviour: Distractors stay on-theme for the lesson.
Current behaviour: `a găti` appeared as wrong answer in exercise `er5`.
Priority: Low
Status: Fixed
Notes: Replaced with `a săpa` in `buildingCabin.ts` exercise `er5`.

---

VAL-044
Area: Home / UX
Issue: Home page presented unrelated features side by side; duplicate shortcuts to Real Life Mode and the weekly lesson; No Shame Mode as a separate tile.
Expected behaviour: Single guided path — Continue lesson → Today’s phrase → Ways to practise → Scenarios → Progress; lesson progress shows vocabulary, reading, exercises, grammar focus; scenarios grouped.
Current behaviour: Hero competed with lesson card; “I actually need this today” duplicated Real Life Mode; flat scenario list; stats mid-page.
Priority: High
Status: Fixed
Notes: `HomePage` reordered and simplified. Removed need-today grid and No Shame tile. `scenarioGroups.ts` for Home and Scenarios page. Optional `grammarFocus` on weekly topics.

---

VAL-045
Area: Grammar Help
Issue: Grammar Help was a collection of disconnected textbook-style topic pages; verbs had only present tense on separate flows; linguistic jargon (indicative mood, predicative, auxiliary).
Expected behaviour: Cheat sheets, verb centre with tense toggle (Present / Perfect Compus / Imperfect / Future), plain-English tense guides, sentence patterns, simplified parts of speech; find answers in one or two taps.
Current behaviour: Old mood/group sections; single tense per verb page; long topic cards with practise tracking.
Priority: High
Status: Fixed
Notes: New `grammarCheatSheets`, `grammarTenseGuides`, `grammarSentencePatterns`, `grammarPartsOfSpeech`, `grammarVerbTenses`. `GrammarTenseToggle` on verb pages. Grammar exercises placeholder. Legacy `grammarTopics` retained for review collector only.

---

VAL-046
Area: Navigation / Home / Mihaela Review
Issue: Scenarios list had no back navigation and hid bottom nav; Home progress was at the bottom; learners could not manually flag content for Mihaela.
Expected behaviour: Scenarios page has back + bottom nav; Home order is hero → progress → lesson → phrase → practise → scenarios; subtle “Flag for Mihaela” on Romanian content saved to localStorage without duplicates.
Current behaviour: Scenarios felt like a dead end; progress at page bottom; only author-flagged content in review.
Priority: High
Status: Fixed
Notes: `FlagForMihaela` component; `ReviewContext.manualFlags`; `user-flag:*` ids in `rcd-review` localStorage.

---

VAL-047
Area: Share with Teacher / QR sync
Issue: No offline way to share review items or progress with Mihaela using QR codes.
Expected behaviour: Settings → Share with Teacher → Review Sync (two-way) and Progress Sync (one-way); multi-QR chunking when payloads are large; teacher review with corrections; learner imports response by id.
Current behaviour: Review and progress stayed on one device only.
Priority: High
Status: Fixed
Notes: `src/services/qr/*` package codec; `qrcode` + `html5-qrcode`; pages under `src/pages/share/`; teacher session in `rcd-teacher-review` localStorage.

---

VAL-048
Area: Share with Teacher / QR scanner
Issue: Camera failed to open when tapping Scan QR code.
Expected behaviour: Scanner region visible before camera starts; back-camera fallback; clear error if HTTPS or permissions block access.
Current behaviour: `html5-qrcode` started while the preview div was `display:none`, so video never attached.
Priority: High
Status: Fixed
Notes: Defer `start()` until after region is shown; enumerate cameras with facingMode fallback; `qr-scanner-region` video CSS.

---

VAL-049
Area: Share with Teacher / QR scanner (desktop)
Issue: Desktop webcam showed black screen after granting camera permission.
Expected behaviour: Live camera preview visible; QR codes scannable on desktop.
Current behaviour: `aspectRatio: 1` and shaded qrbox broke desktop webcams; preview looked black.
Priority: High
Status: Fixed
Notes: Removed forced square aspect ratio; full-frame scan without dark overlay; 4:3 preview container; upload QR image fallback for desktop.

---

VAL-050
Area: Share with Teacher / QR scanner lifecycle
Issue: Scanner did not decode reliably; pressing back without stopping broke the app.
Expected behaviour: Reliable scan on mobile and desktop; back navigation always stops camera first.
Current behaviour: Custom Html5Qrcode integration had hidden preview, no file UI; unmount left camera running.
Priority: High
Status: Fixed
Notes: Switched to `Html5QrcodeScanner`; `useScannerSafeBack` stops camera before navigate; smaller QR payloads; larger display codes.

---

VAL-051
Area: Share with Teacher / QR scanner reliability
Issue: Scanner still failed on mobile and desktop after e86f1de; large review payloads could exceed QR capacity; React StrictMode broke camera lifecycle.
Expected behaviour: Camera, photo upload, or paste all work; generated QRs are scannable; back navigation safe.
Current behaviour: Html5QrcodeScanner unreliable; verbose payloads too large; StrictMode double-mount.
Priority: High
Status: Fixed
Notes: Direct `Html5Qrcode` API; removed StrictMode; compact QR codec; paste fallback; 360px QR display; clearer scan errors.

---

VAL-052
Area: Share with Teacher / Review Sync payload
Issue: Review Sync generated too many QR codes (e.g. 8 for one sync) because each item carried timestamps, context labels, and verbose array rows.
Expected behaviour: Compact review export (`id`, `area`, `ro`, `en`, `note`, `status`); compact teacher response (`id`, `status`, `cro`, `cen`, `note`, `pron`); omit empty fields; filters before generate (default pending only); item count and soft warning above 3 QRs; progress sync stays separate.
Current behaviour: Verbose per-item arrays and metadata inflated payloads; all active items exported with no filters.
Priority: High
Status: Fixed
Notes: `reviewPackage.ts` compact wire objects; `ReviewExportPage` status/area filters; legacy array/object parsing retained for older QRs.

---

VAL-053
Area: Weekly Topics / Content
Issue: Only one weekly topic (Building a Cabin) existed — learners needed more real-life topic packs.
Expected behaviour: Four new `WeeklyTopic` modules (Camping, Meeting Other Dog Walkers, Driving/Car/Road Signs, Socialising at a BBQ) with vocabulary, 3 readings each, all exercise types, and registration in `weeklyTopics` index.
Current behaviour: Single topic available in Weekly Topics list.
Priority: High
Status: Fixed
Notes: `camping.ts`, `dogWalkers.ts`, `drivingCarRoadSigns.ts`, `bbqSocialising.ts`; icons `TentTree`, `Dog`, `Car`, `CookingPot`; uncertain Romanian marked with `review` metadata for Mihaela.

---

VAL-054
Area: Dictionary / Daily Practice / Navigation
Issue: Scenarios duplicated vocabulary practice; Daily Practice did not teach word-form recognition; no central vocabulary reference.
Expected behaviour: Remove standalone Scenarios UI; migrate scenario phrases into Dictionary; alphabetical Dictionary with search, word families, Grammar Help verb links; Daily Practice uses weighted variant exercises from current/previous weekly topics and Dictionary; Home shows Words explored stat; `dictionaryWordsSeen` in localStorage with backwards-compatible migration.
Current behaviour: Scenarios section on Home; Daily Practice used random scenario dialogue; vocabulary scattered across features.
Priority: High
Status: Fixed
Notes: `src/content/dictionary/*`, `DictionaryPage`, `DictionaryEntryPage`, `WordFamily`, `generateDailyPracticeSession`; scenario content retained in `content.ts` for Dictionary build and saved favourites.

---

VAL-055
Area: Dictionary V2 / Word families / Daily Practice
Issue: Dictionary over-prioritised phrases; word families were fake (singular repeated); grammatical variants were not searchable; Daily Practice lacked EN→RO, Listen & Choose, and teaching feedback chains.
Expected behaviour: Default Dictionary lists lexical headwords only (nouns, verbs, adjectives); phrases in separate filter; canonical word-family model with curated verified forms; search resolves grammatical aliases (e.g. avem → a avea, spus → a spune); WordFamily shows transformation chains; verbs reuse Grammar Help conjugations with tense toggle; Daily Practice uses same family data with 60/25/15 weighting and variant exercise types; phrases linked as usage examples under vocabulary.
Current behaviour: Phrases mixed into default All list; incomplete nouns showed fake word family card; search did not index conjugated forms; Daily Practice limited to RO→EN meaning MCQs.
Priority: High
Status: Fixed
Notes: `familyUtils.ts`, split `dictionaryPhrases`, `dictionaryFormAliases`, `dictionaryAuditReport()`; 187 headwords, 168 phrases separate; 10 complete noun families, 384 searchable variants, 136-variant daily pool.

---

VAL-056
Area: Platform-wide / Romanian Verb Handbook validation
Issue: Verb conjugation data was duplicated across Grammar Help, Dictionary, and grammarExtended; contained errors (a vrea imperfect 3pl used present `vor`; a mânca 3pl used `mâncă` instead of `mănâncă`); missing imperfect for several common verbs.
Expected behaviour: Single canonical verb source (`src/content/verbs/`) consumed by Grammar Help, Dictionary word families, Daily Practice aliases, and imperfect grammar card; conjugations validated against Feldstein Romanian Verb Handbook type patterns where applicable; no handbook content copied.
Current behaviour: Verb data split across `grammar.ts` and `grammarVerbTenses.ts` with cross-file duplication and conjugation errors.
Priority: High
Status: Fixed
Notes: `canonicalVerbBase.ts`, `canonicalVerbTenses.ts`, `canonicalVerbs.ts`; 14 grammar verbs, all 4 tenses; 404 searchable variants; handbook validates -a/-e/-o type patterns (putea, bea, face, pleca); a fi/a avea auxiliaries and perfect compus/future flagged as outside handbook scope; Mihaela review retained for example sentences.

---

VAL-057
Area: Platform-wide / Romanian: An Essential Grammar validation
Issue: Noun/adjective families, article treatment, gender/agreement, and broader Romanian grammar lacked an external validation layer beyond the Verb Handbook; risk of incorrect plurals, definite forms, or gender in Dictionary V2 and cross-feature content.
Expected behaviour: Use Gönczöl Romanian: An Essential Grammar as validation reference (not content source) for nouns, adjectives, articles, agreement, and broader grammar; curated word families validated against reference; original learner-facing explanations only; uncertain forms flagged for Mihaela Review; `auditEssentialGrammar()` reports validation coverage.
Current behaviour: Dictionary V2 curated families existed but were not systematically audited against Essential Grammar; no platform-wide grammar audit beyond verbs.
Priority: High
Status: Fixed
Notes: `essentialGrammarValidation.ts` + `platformGrammarAuditReport()`; 2 nouns explicitly validated (câine, mașină), 8 pattern-validated; 3 adjectives explicit (bun, mic, mare), 1 pattern (greu); no gender/plural/definite corrections required; article note confirmed original; 103 nouns remain incomplete pending reference; textbook content not copied.

---

VAL-058
Area: Platform-wide / Final QA remediation pass
Issue: Incomplete noun/verb families, vague Mihaela placeholders, fixed back navigation, over-repeated Daily Practice variants, unresolved VAL-027 strings, and missing coverage reporting.
Expected behaviour: Expand validated noun/verb families from references; real navigation history with state preservation; remove bulk Mihaela uncertainty messages; fix known bad Romanian strings; report family coverage not raw entry counts.
Current behaviour: Only 10 noun families complete; 57 verbs unlinked; back buttons used fixed destinations; dictionary showed "being checked by Mihaela" for 100+ entries.
Priority: High
Status: Fixed
Notes: `nounFamilyBuilder.ts` (~85 noun families), `weeklyVerbPatterns.ts` (54 weekly verbs), `NavigationContext.tsx`, VAL-027 fixes (`Curge apă`, `Puteți repeta`), coverage metrics in `dictionaryAuditReport()`.

---

VAL-059
Area: Platform-wide / Critical Romanian language data repair
Issue: Dictionary noun families, weekly verb conjugations, search aliases, and Daily Practice variants were generated from morphology patterns (`nounFamilyBuilder.ts`, `weeklyVerbPatterns.ts`). Pattern rules produced plausible but incorrect forms (e.g. guessed plurals/definite articles). Learners saw unverified forms as established facts.
Expected behaviour: Never invent Romanian forms. Verify each lexical item individually via dexonline.ro (DEX/DOOM paradigms). Only `lexical-explicit`, `lexical-cross-checked`, or `teacher-validated` forms appear in Dictionary word families, search aliases, Daily Practice, and Grammar Help conjugation tables. Pattern generators remain internal candidates only. Honest coverage reporting — accuracy over completeness.
Current behaviour: `verifiedLexicalFamilies.ts` and `verifiedVerbForms.ts` gate all learner-facing morphology. `nounFamilyCandidateRegistry` quarantined. Weekly verbs marked `pattern-inferred`; generated tenses stripped from learner paths. `lexicalSafety.ts` defines learner-safe provenance. `runLexicalRepairAudit()` reports verified vs base-only counts.
Priority: Critical
Status: Fixed
Notes: Stage B (quarantine) + Stage C (dexonline restoration via `scripts/import-dexonline-lexical.mjs`): 71/71 verbs with full four-tense coverage (present, imperfect, perfect compus, future); 88/90 nouns fully verified; bun, mare (adjectives). Base-only until verified: extensie (dexonline lemma extensiune), mici (plural-only, no clean dexonline paradigm). Teacher Review reserved for naturalness/conflicts, not routine morphology. Pre-merge: `npx tsx scripts/pre-merge-lexical-check.mjs`.

---
