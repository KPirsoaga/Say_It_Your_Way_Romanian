#!/usr/bin/env node
/**
 * Visual QA screenshot capture for PR review.
 * Run: node scripts/capture-visual-qa.mjs
 */
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = '/opt/cursor/artifacts/screenshots';
const BASE = 'http://127.0.0.1:4173';

const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop-1440', width: 1440, height: 900 },
];

async function waitForServer(url, timeoutMs = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Server not ready at ${url}`);
}

function startPreview() {
  return new Promise((resolve, reject) => {
    const proc = spawn('npm', ['run', 'preview', '--', '--host', '127.0.0.1', '--port', '4173'], {
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    proc.stdout.on('data', (d) => {
      if (String(d).includes('Local:')) resolve(proc);
    });
    proc.stderr.on('data', (d) => {
      if (String(d).includes('error')) reject(new Error(String(d)));
    });
    setTimeout(() => resolve(proc), 8000);
  });
}

async function capture(page, file) {
  await page.screenshot({ path: file, fullPage: true });
  console.log(`  ✓ ${file}`);
}

async function navToDictionaryEntry(page, query) {
  await page.getByLabel('Dictionary', { exact: true }).click();
  await page.waitForTimeout(400);
  await page.getByPlaceholder('Search Romanian or English…').fill(query);
  await page.waitForTimeout(600);
  await page.locator('button').filter({ hasText: new RegExp(query, 'i') }).first().click();
  await page.waitForTimeout(500);
}

async function runViewport(browser, vp) {
  const dir = join(OUT, vp.name);
  await mkdir(dir, { recursive: true });
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });

  // Home
  await page.goto(BASE);
  await page.waitForTimeout(800);
  await capture(page, join(dir, '01-home.png'));

  // Topics list
  await page.getByLabel('Topics', { exact: true }).click();
  await page.waitForTimeout(600);
  await capture(page, join(dir, '02-topics.png'));

  // Topic detail (first card)
  await page.locator('button').filter({ hasText: /Building a Cabin|Camping|Dog Walkers/i }).first().click();
  await page.waitForTimeout(600);
  await capture(page, join(dir, '03-topic-detail.png'));

  // Dictionary
  await page.getByLabel('Dictionary', { exact: true }).click();
  await page.waitForTimeout(600);
  await capture(page, join(dir, '04-dictionary.png'));

  // Noun word family
  await navToDictionaryEntry(page, 'câine');
  await page.waitForTimeout(500);
  await capture(page, join(dir, '05-noun-word-family.png'));

  // Verb word family
  await page.getByRole('button', { name: 'Go back' }).click();
  await page.waitForTimeout(300);
  await navToDictionaryEntry(page, 'a avea');
  await page.waitForTimeout(500);
  await capture(page, join(dir, '06-verb-word-family.png'));

  // Grammar Help verb page
  await page.getByRole('button', { name: 'Go back' }).click();
  await page.waitForTimeout(300);
  await page.getByLabel('More', { exact: true }).click();
  await page.waitForTimeout(400);
  await page.getByRole('button', { name: /Grammar Help/i }).click();
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: /Open verb reference/i }).click();
  await page.waitForTimeout(600);
  await capture(page, join(dir, '07-grammar-verb.png'));

  // Daily Practice
  await page.goto(BASE);
  await page.waitForTimeout(500);
  await page.getByLabel('Practice', { exact: true }).click();
  await page.waitForTimeout(600);
  await capture(page, join(dir, '08-daily-practice.png'));

  // Progress (from Home Explore card)
  await page.goto(BASE);
  await page.waitForTimeout(500);
  await page.locator('button').filter({ hasText: 'Progress' }).filter({ hasText: 'Your calm' }).click();
  await page.waitForTimeout(600);
  await capture(page, join(dir, '09-progress.png'));

  await page.close();
}

async function main() {
  await mkdir(OUT, { recursive: true });
  // Skip rebuild if dist exists — set env SKIP_BUILD=1
  if (!process.env.SKIP_BUILD) {
    console.log('Building app…');
    const build = spawn('npm', ['run', 'build'], { cwd: ROOT, stdio: 'inherit' });
    await new Promise((res, rej) => build.on('close', (c) => (c === 0 ? res() : rej(new Error('build failed')))));
  }

  console.log('Starting preview server…');
  const preview = await startPreview();
  await waitForServer(BASE);

  const browser = await chromium.launch();
  try {
    for (const vp of VIEWPORTS) {
      console.log(`\nCapturing ${vp.name} (${vp.width}×${vp.height})…`);
      await runViewport(browser, vp);
    }
  } finally {
    await browser.close();
    preview.kill('SIGTERM');
  }

  console.log(`\nScreenshots saved to ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
