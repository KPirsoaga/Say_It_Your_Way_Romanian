/**
 * Parse dexonline.ro definition pages for verb paradigms and noun declensions.
 * Used by import-dexonline-lexical.mjs — not learner-facing.
 */

function decodeHtmlEntities(text) {
  return text
    .replace(/&#x([0-9a-f]+);?/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&mdash;/g, '—');
}

/** Split dexonline variant chains (sunt‑îs‑s, este‑e‑îi) — keep first standard form */
export function extractPrimaryVariant(raw) {
  if (!raw) return '';
  let s = decodeHtmlEntities(String(raw))
    .replace(/<[^>]+>/g, '')
    .replace(/\u2011/g, '|')
    .replace(/\s+/g, ' ')
    .trim();
  if (!s) return '';

  if (s.includes('|')) {
    const parts = s.split('|').map((p) => p.trim()).filter(Boolean);
    if (parts.length) return parts[0];
  }

  return s;
}

function stripHtml(cell) {
  const firstLi = cell.match(/<li[^>]*>([\s\S]*?)<\/li>/i);
  const content = firstLi ? firstLi[1] : cell;
  return extractPrimaryVariant(content);
}

function parseTableRows(tableHtml) {
  const rows = [];
  const trRe = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let tr;
  while ((tr = trRe.exec(tableHtml))) {
    const cells = [];
    const tdRe = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
    let td;
    while ((td = tdRe.exec(tr[1]))) {
      cells.push(stripHtml(td[1]));
    }
    if (cells.some(Boolean)) rows.push(cells);
  }
  return rows;
}

function sharesStem(head, tail, minStem = 2) {
  const max = Math.min(4, head.length, tail.length);
  for (let sl = max; sl >= minStem; sl--) {
    if (head.slice(0, sl) === tail.slice(0, sl)) return true;
    if (head.slice(-sl) === tail.slice(0, sl)) return true;
  }
  return false;
}

/** Detect dexonline merge artefacts — conservative to avoid valid long forms like construiești */
export function isLikelyGluedForm(s) {
  if (!s || typeof s !== 'string') return false;
  const t = s.trim();
  if (!t || t.includes(' ')) return false;
  if (/&#x|&#\d|&[a-z]+;/i.test(t) || /\u2011/.test(t)) return true;
  if (t.length > 12) return true;

  for (let len = Math.floor(t.length / 2); len >= 4; len--) {
    const a = t.slice(0, len);
    const b = t.slice(len);
    if (a === b || b === `${a}u`) return true;
  }

  if (t.length >= 8) {
    for (let i = 4; i <= t.length - 4; i++) {
      const head = t.slice(0, i);
      const tail = t.slice(i);
      if (tail.length < 4) continue;
      if (sharesStem(head, tail, 3) && head.length >= 4) return true;
      if (head.length >= 2 && /^(.{1,3})\1+$/i.test(tail)) return true;
    }
  }

  if (t.length >= 6 && t.length <= 11) {
    for (let i = 3; i <= t.length - 3; i++) {
      const head = t.slice(0, i);
      const tail = t.slice(i);
      if (head.length >= 4 && tail.length >= 4 && sharesStem(head, tail, 3)) return true;
      if (head.length === 3 && tail.length === 3 && sharesStem(head, tail, 2)) return true;
      if (head.length >= 4 && tail.length >= 4 && sharesStem(head, tail, 2) && t.length <= 9) return true;
      if (head.length >= 4 && tail.length === 3 && sharesStem(head, tail, 2) && t.length <= 8 && /[ăâîșț]/i.test(head + tail)) return true;
      if (head.length >= 3 && head.length <= 5 && tail.length >= 4 && head.slice(0, 2) === tail.slice(0, 2) && /[ăâî]/.test(tail)) return true;
    }
    if (/eîi$/i.test(t) && t.length >= 6) return true;
    if (/^(?:îs|eîi)$/i.test(t.slice(-2)) && t.length >= 6) return true;
    if (/^(.{2,3})((?:ie)+|îs)$/i.test(t)) return true;
  }

  return false;
}

/** Split glued dexonline variant chains (stăteamstamsteteam → stăteam) */
export function splitGluedVariants(raw) {
  let s = extractPrimaryVariant(raw);
  if (!s) return '';
  s = s.replace(/\s+/g, ' ').trim();
  if (!isLikelyGluedForm(s)) return s;

  if (s.includes(' ')) {
    return s
      .split(' ')
      .map((w) => splitGluedVariants(w))
      .join(' ');
  }

  for (let len = Math.floor(s.length / 2); len >= 4; len--) {
    const a = s.slice(0, len);
    const b = s.slice(len);
    if (a === b || b === `${a}u`) return a;
  }

  if (s.length > 12) {
    for (let i = 4; i <= Math.min(10, s.length - 3); i++) {
      const head = s.slice(0, i);
      const tail = s.slice(i);
      if (sharesStem(head, tail, 2)) return head;
    }
  }

  if (s.length >= 8) {
    for (let i = 4; i <= s.length - 3; i++) {
      const head = s.slice(0, i);
      const tail = s.slice(i);
      if (sharesStem(head, tail, 3) && head.length >= 4) return head;
      if (head.length >= 2 && tail.length >= 4 && /^(.{1,3})\1+$/i.test(tail)) return head;
    }
  }

  if (s.length >= 6 && s.length <= 11) {
    for (let i = 3; i <= s.length - 3; i++) {
      const head = s.slice(0, i);
      const tail = s.slice(i);
      if (head.length >= 4 && tail.length >= 4 && sharesStem(head, tail, 3)) return head;
      if (head.length === 3 && tail.length === 3 && sharesStem(head, tail, 2)) return head;
      if (head.length >= 4 && tail.length >= 4 && sharesStem(head, tail, 2) && s.length <= 9) return head;
      if (head.length >= 4 && tail.length === 3 && sharesStem(head, tail, 2) && s.length <= 8 && /[ăâîșț]/i.test(head + tail)) return head;
      if (head.length >= 3 && head.length <= 5 && tail.length >= 4 && head.slice(0, 2) === tail.slice(0, 2) && /[ăâî]/.test(tail)) return head;
    }
    for (const tailLen of [2, 3]) {
      if (s.length <= tailLen + 3) continue;
      const head = s.slice(0, -tailLen);
      const tail = s.slice(-tailLen);
      if (head.length >= 4 && (/^(?:îs|eîi)$/i.test(tail) || (tailLen === 3 && /^eîi$/i.test(tail)))) return head;
    }
    const m = s.match(/^(.{2,3})((?:ie)+|îs)$/i);
    if (m) return m[1];
  }

  return s;
}

/** Split merged dexonline variants like "dormitdormitu" → "dormit" */
export function cleanMergedForm(raw) {
  if (!raw) return '';
  let s = extractPrimaryVariant(raw);
  if (!s) return '';

  if (isLikelyGluedForm(s)) {
    s = splitGluedVariants(s);
  }

  for (let len = Math.floor(s.length / 2); len >= 3; len--) {
    const a = s.slice(0, len);
    const b = s.slice(len);
    if (b === a || b === `${a}u` || b.startsWith(a)) return a;
  }

  for (let i = 3; i < s.length - 2; i++) {
    const head = s.slice(0, i);
    const tail = s.slice(i);
    const stemLen = Math.min(4, head.length, tail.length);
    if (stemLen >= 3 && head.slice(0, stemLen) === tail.slice(0, stemLen)) return head;
  }

  return s;
}

/** Prefer standard articulated form over elided variant jammed in the same cell */
export function cleanArticulat(base, raw) {
  const s = cleanMergedForm(raw);
  if (!s || s === '—' || s.includes('&mdash')) return '';

  if (base && s.startsWith(base) && s.length > base.length) return s;

  if (base.endsWith('ă')) {
    const def = base.slice(0, -1) + 'a';
    if (s.startsWith(def)) return def;
  }
  if (base.endsWith('e') && !base.endsWith('ie')) {
    const def = base + 'a';
    if (s.startsWith(def)) return def;
  }
  const defUl = base + 'ul';
  if (s.startsWith(defUl)) return defUl;

  return s;
}

function cleanSubjunctive(raw) {
  return raw.replace(/^\(să\)\s*/i, '').trim();
}

const PERSON_ORDER = ['eu', 'tu', 'el/ea', 'noi', 'voi', 'ei/ele'];

function isPersonRow(cells) {
  const joined = cells.join(' ');
  return /\(eu\)|\(tu\)|\(el|\(noi\)|\(voi\)|\(ei/.test(joined);
}

function personIndex(cells) {
  const joined = cells.join(' ');
  if (/\(eu\)/.test(joined)) return 0;
  if (/\(tu\)/.test(joined)) return 1;
  if (/\(el/.test(joined)) return 2;
  if (/\(noi\)/.test(joined)) return 3;
  if (/\(voi\)/.test(joined)) return 4;
  if (/\(ei/.test(joined)) return 5;
  return -1;
}

/**
 * @param {string} html Full page HTML
 * @returns {import('./dexonline-types.mjs').DexVerbParadigm | null}
 */
export function parseVerbParadigm(html) {
  const idx = html.indexOf('paradigmDiv');
  if (idx < 0) return null;

  const block = html.slice(idx, idx + 40000);
  const tables = [...block.matchAll(/<table[^>]*>([\s\S]*?)<\/table>/gi)].map((m) => m[1]);
  if (!tables.length) return null;

  let verbTable = null;
  for (const t of tables) {
    if (/prezent/i.test(t) && /participiu/i.test(t)) {
      verbTable = t;
      break;
    }
  }
  if (!verbTable) return null;

  const rows = parseTableRows(verbTable);
  let participiu = '';
  let infinitive = '';

  for (const cells of rows) {
    const joined = cells.join(' ');
    if (cells[0]?.startsWith('(a) ')) {
      infinitive = cells[0].replace(/^\(a\)\s*/, '').trim();
      if (cells.length > 2) participiu = cleanMergedForm(cells[2]);
    }
    if (/participiu/i.test(joined) && cells.length > 2 && !participiu) {
      participiu = cleanMergedForm(cells[2]);
    }
  }

  const present = [];
  const subjunctive = [];
  const imperfect = [];

  for (const cells of rows) {
    if (!isPersonRow(cells)) continue;
    const pi = personIndex(cells);
    if (pi < 0) continue;

    const offset = cells.findIndex((c) => /\(eu\)|\(tu\)|\(el|\(noi\)|\(voi\)|\(ei/.test(c));
    const base = offset >= 0 ? offset + 1 : 2;
    if (cells[base]) present[pi] = cleanMergedForm(cells[base]);
    if (cells[base + 1]) subjunctive[pi] = cleanSubjunctive(cleanMergedForm(cells[base + 1]));
    if (cells[base + 2]) imperfect[pi] = cleanMergedForm(cells[base + 2]);
  }

  if (present.filter(Boolean).length < 6) return null;

  return {
    infinitive,
    participiu: participiu || null,
    present: PERSON_ORDER.map((label, i) => ({ label, ro: present[i] ?? '' })),
    subjunctive: PERSON_ORDER.map((label, i) => ({ label, ro: subjunctive[i] ?? '' })),
    imperfect: PERSON_ORDER.map((label, i) => ({ label, ro: imperfect[i] ?? '' })),
    source: 'dexonline.ro',
  };
}

function isNounDeclensionTable(rows) {
  const joined = rows.map((r) => r.join(' ')).join(' ');
  return /nominativ-acuzativ/i.test(joined) && /nearticulat/i.test(joined);
}

function genderFromHeader(rows) {
  const h = rows[0]?.[0] ?? '';
  if (/feminin/i.test(h)) return 'feminine';
  if (/masculin/i.test(h)) return 'masculine';
  if (/neutru/i.test(h)) return 'neuter';
  return 'masculine';
}

/**
 * @param {string} html
 * @returns {import('./dexonline-types.mjs').DexNounDeclension | null}
 */
export function parseNounDeclension(html) {
  const idx = html.indexOf('paradigmDiv');
  if (idx < 0) return null;

  const block = html.slice(idx, idx + 50000);
  const tables = [...block.matchAll(/<table[^>]*>([\s\S]*?)<\/table>/gi)].map((m) => m[1]);

  for (const t of tables) {
    const rows = parseTableRows(t);
    if (!isNounDeclensionTable(rows)) continue;
    if (/-/.test(rows[1]?.[2] ?? '')) continue;

    const gender = genderFromHeader(rows);
    let singular = '';
    let definiteSingular = '';
    let plural = '';
    let definitePlural = '';
    let inNominativ = false;

    for (const cells of rows) {
      if (/nominativ-acuzativ/i.test(cells[0])) inNominativ = true;
      if (/genitiv-dativ/i.test(cells[0])) inNominativ = false;

      if (!inNominativ) continue;

      if (/singular/i.test(cells[1])) {
        singular = cleanMergedForm(cells[2] ?? '');
        definiteSingular = cleanArticulat(singular, cells[3] ?? '');
      }
      if (cells[0] === 'plural' && cells.length >= 2) {
        plural = cleanMergedForm(cells[1] ?? '');
        definitePlural = cleanArticulat(plural, cells[2] ?? '');
      }
    }

    if (!singular) continue;

    return {
      gender,
      singular,
      plural: plural || null,
      definiteSingular: definiteSingular || null,
      definitePlural: definitePlural || null,
      source: 'dexonline.ro',
    };
  }

  return null;
}

export function lemmaFromInfinitive(infinitive) {
  let s = infinitive.trim().replace(/^a\s+/, '');
  if (s.startsWith('se ')) s = s.slice(3);
  if (s.includes(' ')) return null;
  return s;
}
