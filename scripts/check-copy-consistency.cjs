#!/usr/bin/env node
/**
 * Fails when marketing copy contradicts the pricing it sits next to.
 *
 * The FAQ went months telling prospects about a "Starter" plan with "1,000
 * conversations" while the pricing card three sections up sold "Core" with
 * "500 leads". Nobody edits the FAQ when a price changes, so the contradiction
 * survives every redesign and does its damage at the exact moment someone is
 * deciding whether to trust us.
 *
 * PricingSection.tsx is the single source of truth. Everything here is derived
 * from it rather than restated, so this file cannot itself go stale: change the
 * price or the plan names there and these checks follow.
 *
 * Run: node scripts/check-copy-consistency.cjs
 * Exit 1 on any contradiction.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PRICING = path.join(ROOT, 'app/components/PricingSection.tsx');

const read = (p) => fs.readFileSync(p, 'utf8');

// ---- derive the truth from PricingSection ---------------------------------
const pricingSrc = read(PRICING);

const grab = (re, label) => {
  const m = pricingSrc.match(re);
  if (!m) {
    console.error(`could not read ${label} out of PricingSection.tsx - update this script`);
    process.exit(2);
  }
  return m[1];
};

const TRUTH = {
  inrCore: grab(/inr:\s*\{[^}]*core:\s*'([^']+)'/, 'INR core price'),
  usdCore: grab(/usd:\s*\{[^}]*core:\s*'([^']+)'/, 'USD core price'),
  leadCap: grab(/Up to ([\d,]+) leads managed per month/, 'lead cap'),
  foundingLimit: grab(/const FOUNDING_LIMIT = (\d+)/, 'founding limit'),
  primaryPlan: grab(/pr-card-tier--popular">([^<]+)</, 'primary plan name'),
};

// ---- the files whose prose a prospect actually reads ----------------------
const COPY_FILES = [
  'app/components/ProxeLanding.tsx',
  'app/components/PricingSection.tsx',
  'app/components/CapabilitiesSection.tsx',
  'app/components/shared/DeployModal.tsx',
  'app/thank-you/ThankYouContent.tsx',
];

const failures = [];

function scan(file, test) {
  const full = path.join(ROOT, file);
  if (!fs.existsSync(full)) return;
  read(full)
    .split('\n')
    .forEach((line, i) => test(line, `${file}:${i + 1}`));
}

// 1. Retired plan names must not appear as plan names anywhere.
//    "Enterprise Security" is a feature label, not a plan, so only flag
//    "Enterprise plan(s)".
const DEAD_PLANS = [
  { re: /\bStarter\b/, why: 'retired plan name "Starter"' },
  { re: /\bUnlimited\b(?!\s+seats)/, why: 'retired plan name "Unlimited" (allowed: "Unlimited seats")' },
  { re: /\bEnterprise\s+plans?\b/i, why: 'retired plan name "Enterprise plan" (the tier is "Scale")' },
];
for (const f of COPY_FILES) {
  scan(f, (line, at) => {
    for (const d of DEAD_PLANS) if (d.re.test(line)) failures.push(`${at}  ${d.why}`);
  });
}

// 2. Billing is per LEAD, not per conversation. The pricing card says "leads
//    managed per month"; copy that bills "per conversation" contradicts it.
for (const f of COPY_FILES) {
  scan(f, (line, at) => {
    if (/\d[\d,]*\s+conversations?\b/i.test(line) || /billed per (unique )?(conversation|customer)/i.test(line)) {
      failures.push(`${at}  bills by conversation; pricing sells "${TRUTH.leadCap} leads managed per month"`);
    }
  });
}

// 3. Any price shown in copy must be a price we actually charge.
const ALLOWED_PRICES = new Set([
  TRUTH.inrCore,
  TRUTH.usdCore,
  grab(/inr:\s*\{[^}]*was:\s*'([^']+)'/, 'INR anchor'),
  grab(/usd:\s*\{[^}]*was:\s*'([^']+)'/, 'USD anchor'),
  grab(/inr:\s*\{[^}]*seat:\s*'₹([^']+)'/, 'INR seat'),
  grab(/usd:\s*\{[^}]*seat:\s*'\$([^']+)'/, 'USD seat'),
]);
for (const f of COPY_FILES) {
  scan(f, (line, at) => {
    for (const m of line.matchAll(/[₹$]\s?([\d,]{3,})/g)) {
      if (!ALLOWED_PRICES.has(m[1])) {
        failures.push(`${at}  price "${m[0].trim()}" is not one of ${[...ALLOWED_PRICES].join(', ')}`);
      }
    }
  });
}

// 4. The founding-member count must agree wherever it is stated.
for (const f of COPY_FILES) {
  scan(f, (line, at) => {
    for (const m of line.matchAll(/first (\d+) businesses/gi)) {
      if (m[1] !== TRUTH.foundingLimit) {
        failures.push(`${at}  says "first ${m[1]} businesses", FOUNDING_LIMIT is ${TRUTH.foundingLimit}`);
      }
    }
  });
}

// ---- report ---------------------------------------------------------------
console.log('pricing truth from PricingSection.tsx:');
console.log(`  plan        ${TRUTH.primaryPlan}`);
console.log(`  price       ₹${TRUTH.inrCore} / $${TRUTH.usdCore} per month`);
console.log(`  allowance   ${TRUTH.leadCap} leads per month`);
console.log(`  founding    first ${TRUTH.foundingLimit} businesses`);
console.log('');

if (failures.length) {
  console.error(`FOUND ${failures.length} CONTRADICTION(S):\n`);
  for (const f of failures) console.error('  ' + f);
  console.error('\nCopy must agree with the pricing card. Fix the copy, not this check.');
  process.exit(1);
}
console.log('no contradictions found across', COPY_FILES.length, 'copy files');
