# Say It Your Way Romanian
# Learning Engine PRD

## Vision

This application exists to reinforce my weekly Romanian lessons with my teacher, Mihaela.

It is designed around how I learn, rather than how traditional language-learning applications teach.

The application is built for me first.

If it eventually proves useful for others, especially people with dyslexia, ADHD or other learning differences, it may later be expanded into a public application.

---

# Core Learning Philosophy

Every lesson follows the same learning journey.

Lesson
↓
Vocabulary
↓
Reading
↓
Understanding
↓
Recognition
↓
Speaking
↓
Repetition
↓
Confidence

The application is designed to reinforce communication, not memorisation.

---

# Design Principles

The application must always remain:

- Mobile first
- Dyslexia friendly
- ADHD friendly
- Calm
- Accessible
- Supportive
- Focused on speaking and understanding

The application must never become:

- a spelling application
- a typing application
- a grammar drill application
- a streak-based application
- a gamified competition

The application should always reduce anxiety rather than increase it.

---

# Weekly Topics

The primary learning method is Weekly Topics.

Every week my teacher and I choose one real-life topic.

Examples:

- Building a Cabin
- Romanian Lesson
- Shopping
- Vet
- Gardening
- My Dog Daisy
- The Apartment
- The Accountant
- Travelling
- Going to the Market

Each topic follows exactly the same structure.

---

# Weekly Topic Structure

Vocabulary Bank

↓

Reading Practice

↓

Translation Practice

↓

Vocabulary Review

↓

Exercises

↓

Progress Tracking

---

# Vocabulary Bank

Each topic contains:

## Nouns

## Verbs

## Adjectives

## Useful Phrases

Each vocabulary item should include:

- Romanian
- English
- Audio
- Optional pronunciation
- Category
- Teacher note (optional)

Vocabulary is created with Mihaela.

This vocabulary becomes the primary source for every exercise.

Vocabulary should be reused repeatedly throughout the topic.

---

# Reading Practice

Each topic contains three Romanian reading passages.

Reading 1

- Very simple
- Short sentences
- Heavy repetition of vocabulary
- Very few new words

Reading 2

- Slightly longer
- More natural
- Reuses vocabulary
- Introduces a small number of new words

Reading 3

- Natural conversation or short story
- Uses vocabulary naturally
- Feels like real Romanian

---

# Translation Practice

The learner should attempt to understand the Romanian before seeing English.

Workflow:

1. Display Romanian paragraph.

2. Optional text box:

"My English translation"

3. Button:

"I've finished"

4. Reveal:

- model English translation
- vocabulary used
- new words
- teacher notes

The learner's English translation is never marked.

Translation notes are stored in localStorage.

---

# New Vocabulary

Each reading passage may introduce a small number of new Romanian words.

These should be listed separately as:

New Words

This vocabulary can become the starting point for the following week's lesson.

---

# Exercises

Each Weekly Topic automatically generates:

## Romanian → English

Multiple choice.

3–4 options.

No typing.

Gentle feedback.

---

## English → Romanian

Multiple choice.

No typing.

---

## Vocabulary Matching

Use tap-to-match instead of drag-and-drop.

Tap Romanian.

↓

Tap English.

↓

Correct pairs remain matched.

Designed for mobile.

---

## Category Sorting

Use tap-to-sort.

Possible categories:

- Tools
- Building Materials
- Cabin Parts
- Garden
- Actions

No drag-and-drop if it makes the mobile experience worse.

---

# Progress

Track independently:

- Vocabulary viewed
- Reading 1 completed
- Reading 2 completed
- Reading 3 completed
- Translation attempted
- Romanian → English completed
- English → Romanian completed
- Matching completed
- Category sorting completed

Store progress using localStorage.

Display progress on:

- Weekly Topics page
- Topic page
- Main Progress page

---

# Topic 1

## Building a Cabin

Purpose

Practise Romanian vocabulary connected with building, repairing and discussing my cabin.

Teacher-approved vocabulary:

## Verbs

- a construi
- a lovi
- a munci
- a găti
- a pune
- a tăia
- a săpa
- a urca
- a coborî
- a ridica
- a căra
- a uda
- a hrăni
- a aduna
- a înșuruba
- a tunde

## Nouns

- acoperiș
- scări
- extensie
- perete
- fundație
- șurub
- șurubelniță
- tavan
- izolație
- fire electrice
- podea
- pod (attic)
- pod (bridge)
- topor
- încuietoare
- gard
- greblă

This vocabulary should be reused heavily throughout the reading passages and exercises.

Only introduce a small number of additional words where necessary.

Any new vocabulary should appear in the New Words section.

---

# Romanian Language Rules

Always use:

- natural Romanian
- Romanian diacritics
- everyday language

If unsure:

Leave:

TODO: Review with Mihaela

Never invent uncertain Romanian.

---

# Accessibility

Always maintain:

- Large readable text
- Large touch targets
- Good spacing
- Good colour contrast
- Mobile-first layout
- No horizontal scrolling
- No hover-only interactions
- Browser zoom enabled
- Screen reader friendly where practical

---

# Validation

Every new feature must:

- update VALIDATION.md
- pass npm run typecheck
- pass npm run build

Do not introduce breaking changes.

---

# Guiding Principle

Every feature should answer one question:

"Will this help me communicate more confidently in Romanian after this week's lesson?"

If the answer is no, it probably does not belong in the application.
