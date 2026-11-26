// Builds 이력서 (이력서.md) and 경력기술서 (header and companies from 이력서.md, projects from 경력기술서.json) as PDFs.
// These are the files sent with applications; the site keeps its own data in apps/web/src/data.
// Usage: node resume/build.mjs <output dir>
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
// shortcut: micromark comes in transitively through the web app's markdown stack; add it as a dependency if that changes.
import { micromark } from 'micromark';
import { gfm, gfmHtml } from 'micromark-extension-gfm';

const [outDir] = process.argv.slice(2);
if (!outDir) throw new Error('usage: node resume/build.mjs <output dir>');
const here = path.dirname(new URL(import.meta.url).pathname);
const work = fs.mkdtempSync(path.join(fs.realpathSync(process.env.TMPDIR ?? '/tmp'), 'resume-build-'));
fs.mkdirSync(outDir, { recursive: true });

const md = fs.readFileSync(path.join(here, '이력서.md'), 'utf8');
const { projects, others } = JSON.parse(fs.readFileSync(path.join(here, '경력기술서.json'), 'utf8'));

const toHtml = (src) =>
  micromark(src.replace(/\n---\n\n(?=## )/g, '\n'), { extensions: [gfm()], htmlExtensions: [gfmHtml()] });

// The block under a heading, up to the next heading of the same or higher level.
const section = (heading) => {
  const start = md.indexOf(`${heading}\n`);
  if (start < 0) throw new Error(`missing heading: ${heading}`);
  const level = heading.match(/^#+/)[0].length;
  const rest = md.slice(start + heading.length + 1);
  const next = rest.search(new RegExp(`\\n#{1,${level}} `));
  return (next < 0 ? rest : rest.slice(0, next)).replace(/\n---\s*$/, '').trim();
};

const header = md.slice(0, md.indexOf('\n---\n')).trim();
const tilde = (period) => period.replace(' — ', ' ~ ');
const companyNames = [...section('## 경력').matchAll(/^### (.+)$/gm)].map((m) => m[1]);

// One-line markdown (bold, links, & escaping) without the <p> wrapper.
const inline = (s) => micromark(s).replace(/^<p>|<\/p>\n?$/g, '');
const ul = (items) => `<ul>${items.map((i) => `<li>${inline(i)}</li>`).join('')}</ul>`;
const row = (label, value) => (value ? `<tr><th scope="row">${label}</th><td>${value}</td></tr>` : '');

const othersTable = (rows) =>
  rows.length === 0
    ? ''
    : `<h3>그 밖의 프로젝트</h3><table class="grid"><thead><tr><th>프로젝트</th><th>기간</th><th>내용</th></tr></thead><tbody>${rows
        .map((o) => `<tr><td>${inline(o.name)}</td><td>${inline(o.period)}</td><td>${inline(o.description)}</td></tr>`)
        .join('')}</tbody></table>`;

const careerHtml = companyNames
  .map((company) => {
    // Company block: meta line, one-line summary, then the highlights list.
    const [meta, summary] = section(`### ${company}`).split('\n\n');
    const own = projects.filter((p) => p.company === company);
    if (own.length === 0) throw new Error(`no projects for ${company}`);
    const blocks = own.map(
      (p) =>
        `<section class="project"><h3>${inline(p.title)}</h3><table class="kv"><tbody>${[
          row('기간', tilde(p.period)),
          row('역할', inline([p.role, p.contribution].filter(Boolean).join(' · '))),
          row('기술', inline(p.tech.join(', '))),
          row('개요', inline(p.summary)),
          row('담당 업무', ul(p.responsibilities)),
          row('성과', p.outcomes.length ? ul(p.outcomes) : ''),
        ].join('')}</tbody></table></section>`
    );
    const ownOthers = others.filter((o) => o.company === company);
    return `<h2>${company}</h2><p class="company-meta"><strong>${inline(meta)}</strong></p><p>${inline(summary)}</p>${blocks.join('')}${othersTable(ownOthers)}`;
  })
  .join('');

const unplaced = [...projects, ...others].filter((p) => !companyNames.includes(p.company));
if (unplaced.length) throw new Error(`company not in 이력서.md: ${unplaced.map((p) => p.company).join(', ')}`);

const css = `
@page { size: A4; margin: 15mm 16mm 17mm; }
* { box-sizing: border-box; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { margin: 0; font-family: "Pretendard", "Apple SD Gothic Neo", "NanumSquare", sans-serif; font-size: 9.6pt; line-height: 1.68; color: #1f2328; word-break: keep-all; overflow-wrap: anywhere; }
.doc-label { margin: 0 0 2px; font-size: 8.5pt; font-weight: 700; letter-spacing: 0.24em; color: #2563eb; }
h1 { margin: 0 0 4px; font-size: 21pt; letter-spacing: -0.02em; line-height: 1.25; }
h2 { margin: 20px 0 9px; padding-bottom: 4px; border-bottom: 1.4px solid #1f2328; font-size: 12.5pt; break-after: avoid; }
h3 { margin: 18px 0 3px; font-size: 10.8pt; break-after: avoid; }
h3 + p { color: #57606a; font-size: 9pt; }
p { margin: 0 0 7px; }
ul { margin: 0 0 8px; padding-left: 17px; }
li { margin: 1.5px 0; }
li, tr { break-inside: avoid; }
p:has(+ ul) { break-after: avoid; margin-bottom: 3px; }
hr { margin: 13px 0; border: 0; border-top: 1px solid #e5e7eb; }
table { width: 100%; margin: 0 0 8px; border-collapse: collapse; font-size: 9pt; }
th, td { padding: 5px 8px; border-bottom: 1px solid #e5e7eb; text-align: left; vertical-align: top; }
th { background: #f6f8fa; }
table:not(.kv):not(.grid) td:first-child { width: 24%; font-weight: 600; white-space: nowrap; }
a { color: #2563eb; text-decoration: none; }
table.kv, table.grid { border-top: 1.4px solid #c9d1d9; }
table.kv th { width: 13%; padding-right: 10px; font-weight: 600; white-space: nowrap; color: #1f2328; }
table.kv th, table.kv td { padding: 4px 8px; }
table.kv td ul { margin: 0; padding-left: 15px; }
table.kv li { margin: 0.5px 0; }
section.project { break-inside: avoid; }
table.grid td:first-child { width: 24%; font-weight: 600; }
table.grid td:nth-child(2) { width: 1%; color: #57606a; white-space: nowrap; }
.company-meta { margin-bottom: 3px; }
`;

const docs = [
  { title: '이력서_정성훈', label: '이력서', body: toHtml(md) },
  { title: '경력기술서_정성훈', label: '경력기술서', body: toHtml(header) + careerHtml },
];

// shortcut: macOS Chrome path only; take it from an env var if this runs elsewhere.
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
for (const { title, label, body } of docs) {
  const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>${title}</title><style>${css}</style></head><body><p class="doc-label">${label}</p>${body}</body></html>`;
  const htmlPath = path.join(work, `${title}.html`);
  fs.writeFileSync(htmlPath, html);
  const pdfPath = path.resolve(outDir, `${title}.pdf`);
  execFileSync(
    chrome,
    [
      '--headless=new',
      '--disable-gpu',
      `--user-data-dir=${path.join(work, 'chrome-profile')}`,
      '--no-pdf-header-footer',
      `--print-to-pdf=${pdfPath}`,
      `file://${htmlPath}`,
    ],
    { stdio: 'ignore' }
  );
  if (fs.statSync(pdfPath).size < 10_000) throw new Error(`pdf too small: ${pdfPath}`);
  console.log(pdfPath);
}
fs.rmSync(work, { recursive: true, force: true });
