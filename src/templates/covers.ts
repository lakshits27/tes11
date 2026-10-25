import type { Project } from '../content/projects.ts';

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function sortifyArt(accent: string, secondary: string): string {
  return `
    <g transform="translate(170 170)">
      <g opacity="0.35" stroke="${secondary}" fill="none">
        <path d="M60 430 C250 320 480 430 830 210" stroke-width="3" stroke-dasharray="8 14"/>
        <circle cx="60" cy="430" r="8" fill="${secondary}"/>
      </g>
      <g transform="translate(70 80) rotate(-9)">
        <rect width="250" height="330" rx="22" fill="#151a29" stroke="#ffffff" stroke-opacity=".18"/>
        <path d="M0 72h250" stroke="#ffffff" stroke-opacity=".1"/>
        <circle cx="32" cy="36" r="8" fill="${accent}"/>
        <text x="56" y="43" fill="#c5cadc" font-size="22" font-family="monospace">IMG_2049.PNG</text>
        <rect x="26" y="105" width="198" height="14" rx="7" fill="#ffffff" opacity=".12"/>
        <rect x="26" y="140" width="170" height="14" rx="7" fill="#ffffff" opacity=".08"/>
        <rect x="26" y="175" width="207" height="14" rx="7" fill="#ffffff" opacity=".08"/>
        <rect x="26" y="232" width="198" height="60" rx="12" fill="${secondary}" opacity=".15"/>
        <text x="44" y="270" fill="${secondary}" font-size="22" font-family="monospace">SCAN</text>
      </g>
      <g transform="translate(280 35) rotate(4)">
        <rect width="270" height="355" rx="24" fill="#101523" stroke="${accent}" stroke-opacity=".55"/>
        <text x="28" y="52" fill="${accent}" font-size="20" font-family="monospace" letter-spacing="3">REVIEW PLAN</text>
        <g font-family="monospace" font-size="18">
          <text x="28" y="112" fill="#8f98b2">BEFORE</text><text x="190" y="112" fill="#8f98b2">AFTER</text>
          <path d="M20 128h230" stroke="#ffffff" stroke-opacity=".12"/>
          <text x="28" y="166" fill="#e8ebf5">scan_01.pdf</text><text x="190" y="166" fill="${accent}">invoice.pdf</text>
          <text x="28" y="212" fill="#e8ebf5">draft.docx</text><text x="190" y="212" fill="${accent}">proposal.docx</text>
          <text x="28" y="258" fill="#e8ebf5">photo.png</text><text x="190" y="258" fill="${accent}">site-plan.png</text>
        </g>
        <rect x="28" y="292" width="214" height="34" rx="17" fill="${accent}"/>
        <text x="86" y="316" fill="#10120b" font-size="18" font-family="monospace">APPLY SAFELY</text>
      </g>
      <g transform="translate(600 115)">
        <path d="M0 40h180l34 34v256H0Z" fill="#141a2b" stroke="#ffffff" stroke-opacity=".18"/>
        <path d="M180 40v34h34" fill="none" stroke="#ffffff" stroke-opacity=".18"/>
        <circle cx="108" cy="178" r="57" fill="none" stroke="${secondary}" stroke-width="3" opacity=".5"/>
        <path d="m82 178 18 18 36-40" fill="none" stroke="${accent}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="45" y="282" fill="#c5cadc" font-size="18" font-family="monospace">UNDO READY</text>
      </g>
    </g>`;
}

function veyloArt(accent: string, secondary: string): string {
  return `
    <g transform="translate(170 160)">
      <circle cx="300" cy="240" r="214" fill="none" stroke="${secondary}" stroke-opacity=".2" stroke-width="2"/>
      <circle cx="300" cy="240" r="170" fill="none" stroke="${accent}" stroke-opacity=".3" stroke-width="2"/>
      <circle cx="300" cy="240" r="124" fill="none" stroke="${secondary}" stroke-opacity=".45" stroke-width="2" stroke-dasharray="4 12"/>
      <path d="M300 26a214 214 0 0 1 190 116" fill="none" stroke="url(#spectrum)" stroke-width="12" stroke-linecap="round"/>
      <circle cx="490" cy="142" r="11" fill="${accent}"/>
      <g transform="translate(65 85)">
        <rect width="470" height="310" rx="28" fill="#111827" stroke="#ffffff" stroke-opacity=".15"/>
        <text x="34" y="58" fill="#dce3f2" font-size="24" font-family="sans-serif" font-weight="700">Today</text>
        <text x="34" y="90" fill="#8f9ab4" font-size="16" font-family="monospace">SMALL STEPS ADD UP</text>
        <g transform="translate(32 116)">
          <rect width="406" height="46" rx="14" fill="${accent}" opacity=".12"/>
          <circle cx="26" cy="23" r="10" fill="${accent}"/>
          <rect x="52" y="16" width="170" height="12" rx="6" fill="#e8f2ff" opacity=".7"/>
          <path d="m370 18 10 10 18-22" fill="none" stroke="${accent}" stroke-width="5" stroke-linecap="round"/>
          <rect y="60" width="406" height="46" rx="14" fill="#ffffff" opacity=".05"/>
          <circle cx="26" cy="83" r="10" fill="${secondary}"/>
          <rect x="52" y="76" width="130" height="12" rx="6" fill="#e8f2ff" opacity=".45"/>
          <rect y="120" width="406" height="46" rx="14" fill="#ffffff" opacity=".05"/>
          <circle cx="26" cy="143" r="10" fill="#ff78b7"/>
          <rect x="52" y="136" width="190" height="12" rx="6" fill="#e8f2ff" opacity=".45"/>
        </g>
      </g>
      <g transform="translate(555 125)">
        <rect width="300" height="250" rx="24" fill="#111827" stroke="#ffffff" stroke-opacity=".15"/>
        <text x="28" y="50" fill="#dce3f2" font-size="20" font-family="sans-serif" font-weight="700">Progress</text>
        <path d="M28 190 C75 170 90 115 135 132 S210 90 270 58" fill="none" stroke="url(#spectrum)" stroke-width="7" stroke-linecap="round"/>
        <g fill="${accent}"><circle cx="28" cy="190" r="6"/><circle cx="135" cy="132" r="6"/><circle cx="270" cy="58" r="6"/></g>
        <path d="M28 214h244" stroke="#ffffff" stroke-opacity=".12"/>
      </g>
    </g>`;
}

function sabuddyArt(accent: string, secondary: string): string {
  return `
    <g transform="translate(190 145)">
      <g transform="translate(0 30) rotate(-8)">
        <rect width="210" height="280" rx="24" fill="#171326" stroke="#ffffff" stroke-opacity=".16"/>
        <circle cx="38" cy="42" r="12" fill="${accent}"/>
        <text x="62" y="49" fill="#f5e9f3" font-size="19" font-family="monospace">IDEA</text>
        <rect x="24" y="82" width="162" height="12" rx="6" fill="#ffffff" opacity=".15"/>
        <rect x="24" y="110" width="130" height="12" rx="6" fill="#ffffff" opacity=".1"/>
        <rect x="24" y="150" width="162" height="76" rx="14" fill="${accent}" opacity=".12"/>
        <text x="42" y="196" fill="${accent}" font-size="24" font-family="monospace">REEL_01</text>
      </g>
      <g transform="translate(250 0)">
        <rect width="330" height="470" rx="48" fill="#0d1020" stroke="${secondary}" stroke-opacity=".55" stroke-width="3"/>
        <rect x="18" y="18" width="294" height="434" rx="36" fill="#171b2d"/>
        <rect x="125" y="28" width="80" height="12" rx="6" fill="#ffffff" opacity=".2"/>
        <text x="38" y="84" fill="#f6edf5" font-size="26" font-family="sans-serif" font-weight="700">SaBuddy</text>
        <text x="38" y="112" fill="#9aa3bb" font-size="15" font-family="monospace">CONTENT STUDIO / LOCAL</text>
        <g transform="translate(32 140)">
          <rect width="266" height="76" rx="18" fill="${accent}" opacity=".16"/>
          <circle cx="36" cy="38" r="16" fill="${accent}"/>
          <text x="66" y="33" fill="#fff" font-size="18" font-family="sans-serif">Caption draft</text>
          <text x="66" y="57" fill="#c7b7c9" font-size="14" font-family="monospace">3 ideas · 1 script</text>
          <rect y="92" width="266" height="76" rx="18" fill="#ffffff" opacity=".05"/>
          <circle cx="36" cy="130" r="16" fill="${secondary}"/>
          <text x="66" y="125" fill="#fff" font-size="18" font-family="sans-serif">Calendar</text>
          <text x="66" y="149" fill="#aeb6cc" font-size="14" font-family="monospace">Plan · Save · Search</text>
          <rect y="184" width="266" height="76" rx="18" fill="#ffffff" opacity=".05"/>
          <path d="m36 214 8 18 19 3-14 13 4 19-17-9-17 9 4-19-14-13 19-3Z" fill="#d7ff65"/>
          <text x="86" y="225" fill="#fff" font-size="18" font-family="sans-serif">Gemini assist</text>
          <text x="86" y="249" fill="#aeb6cc" font-size="14" font-family="monospace">Optional · local fallback</text>
        </g>
      </g>
      <g transform="translate(630 95)">
        <rect width="240" height="310" rx="24" fill="#151829" stroke="#ffffff" stroke-opacity=".16"/>
        <text x="26" y="48" fill="#e9ebf5" font-size="20" font-family="sans-serif" font-weight="700">Calendar</text>
        <g transform="translate(24 70)" fill="${accent}">
          ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
            .map((n) => {
              const x = (n % 5) * 40;
              const y = Math.floor(n / 5) * 40;
              const filled = [1, 4, 7, 11, 12].includes(n);
              return `<rect x="${x}" y="${y}" width="30" height="30" rx="8" fill="${
                filled ? accent : '#ffffff'
              }" opacity="${filled ? 0.85 : 0.07}"/>`;
            })
            .join('')}
        </g>
        <path d="M28 274h184" stroke="#ffffff" stroke-opacity=".12"/>
        <text x="28" y="300" fill="${secondary}" font-size="15" font-family="monospace">PLAN · DO NOT AUTO-PUBLISH</text>
      </g>
    </g>`;
}

function facilityfixArt(accent: string, secondary: string): string {
  return `
    <g transform="translate(175 155)">
      <path d="M50 190 330 60 610 190 330 320Z" fill="#101827" stroke="${secondary}" stroke-opacity=".4" stroke-width="3"/>
      <path d="M50 190v210l280 130 280-130V190" fill="#0d1423" stroke="${secondary}" stroke-opacity=".3" stroke-width="3"/>
      <path d="M330 320v210" stroke="${secondary}" stroke-opacity=".3" stroke-width="3"/>
      <g stroke="#ffffff" stroke-opacity=".12" fill="none">
        <path d="M145 150 425 280M235 107 515 237M145 260 425 390M235 217 515 347"/>
      </g>
      <g>
        <path d="M180 130c0-28 22-50 50-50s50 22 50 50c0 36-50 86-50 86s-50-50-50-86Z" fill="${accent}"/>
        <circle cx="230" cy="130" r="18" fill="#111827"/>
        <path d="M420 250c0-28 22-50 50-50s50 22 50 50c0 36-50 86-50 86s-50-50-50-86Z" fill="#ff78b7"/>
        <circle cx="470" cy="250" r="18" fill="#111827"/>
      </g>
      <g transform="translate(590 110)">
        <rect width="360" height="320" rx="26" fill="#111827" stroke="#ffffff" stroke-opacity=".15"/>
        <text x="28" y="52" fill="#e8edf8" font-size="23" font-family="sans-serif" font-weight="700">Issue lifecycle</text>
        <g transform="translate(36 94)" font-family="monospace" font-size="15">
          <circle cx="18" cy="18" r="18" fill="${accent}"/><text x="54" y="24" fill="#dbe2f0">SUBMITTED</text>
          <path d="M18 36v54" stroke="${accent}" stroke-width="3"/>
          <circle cx="18" cy="108" r="18" fill="${secondary}"/><text x="54" y="114" fill="#dbe2f0">IN PROGRESS</text>
          <path d="M18 126v54" stroke="${secondary}" stroke-width="3"/>
          <circle cx="18" cy="198" r="18" fill="#d7ff65"/><text x="54" y="204" fill="#dbe2f0">RESOLVED</text>
        </g>
        <rect x="230" y="92" width="94" height="52" rx="12" fill="#ffffff" opacity=".06"/>
        <rect x="230" y="164" width="94" height="52" rx="12" fill="#ffffff" opacity=".06"/>
        <rect x="230" y="236" width="94" height="52" rx="12" fill="#ffffff" opacity=".06"/>
      </g>
    </g>`;
}

function sarpArt(accent: string, secondary: string): string {
  const dots = [
    [180, 410],
    [235, 390],
    [290, 365],
    [350, 348],
    [410, 352],
    [468, 378],
    [512, 415],
    [548, 462],
  ];
  return `
    <g transform="translate(120 125)">
      <path d="M100 500 500 110 900 500Z" fill="#0c1720" stroke="${secondary}" stroke-opacity=".4" stroke-width="3"/>
      <g stroke="${accent}" stroke-opacity=".18" fill="none">
        ${Array.from({ length: 11 }, (_, i) => `<path d="M${100 + i * 40} 500 500 110"/>`).join('')}
        ${[140, 200, 270, 350, 440, 500].map((y) => `<path d="M${500 - (500 - y) * 1.35} ${y}H${500 + (500 - y) * 1.35}"/>`).join('')}
      </g>
      <path d="M90 510h820" stroke="url(#spectrum)" stroke-width="6" opacity=".65"/>
      <path d="M180 410 C230 390 285 365 350 348 S470 380 548 462" fill="none" stroke="url(#spectrum)" stroke-width="30" stroke-linecap="round" opacity=".3"/>
      ${dots
        .map(
          ([x, y], i) =>
            `<circle cx="${x}" cy="${y}" r="${18 - i}" fill="${
              i === dots.length - 1 ? accent : secondary
            }" opacity="${0.35 + i * 0.07}"/>`,
        )
        .join('')}
      <circle cx="650" cy="270" r="28" fill="#ff4f7d"/>
      <path d="M650 242c8-18 28-17 32-2" fill="none" stroke="${accent}" stroke-width="6" stroke-linecap="round"/>
      <circle cx="720" cy="390" r="18" fill="#ffd35c"/>
      <circle cx="290" cy="260" r="15" fill="#d7ff65"/>
      <g transform="translate(705 105)">
        <rect width="265" height="128" rx="20" fill="#0b111d" stroke="#ffffff" stroke-opacity=".16"/>
        <text x="24" y="48" fill="#9aa5bb" font-size="15" font-family="monospace" letter-spacing="3">SCORE</text>
        <text x="24" y="99" fill="${accent}" font-size="46" font-family="monospace">0420</text>
        <path d="M178 34v62" stroke="#ffffff" stroke-opacity=".12"/>
        <text x="196" y="56" fill="#9aa5bb" font-size="14" font-family="monospace">SPEED</text>
        <text x="196" y="90" fill="${secondary}" font-size="24" font-family="monospace">×1.8</text>
      </g>
      <path d="M160 130 C330 12 640 10 830 140" fill="none" stroke="url(#spectrum)" stroke-width="10" stroke-linecap="round" opacity=".7"/>
    </g>`;
}

function pustakalayaArt(accent: string, secondary: string): string {
  const books = [
    { x: 0, h: 210, c: '#ff78b7' },
    { x: 52, h: 250, c: '#61e7ff' },
    { x: 104, h: 190, c: '#d7ff65' },
    { x: 156, h: 270, c: '#b69bff' },
    { x: 208, h: 225, c: '#ffb86b' },
    { x: 260, h: 255, c: '#ff78b7' },
  ];
  return `
    <g transform="translate(160 150)">
      <g transform="translate(0 100)">
        <rect x="-22" y="300" width="370" height="18" rx="8" fill="${secondary}" opacity=".5"/>
        ${books
          .map(
            (book, i) => `
          <g transform="translate(${book.x} ${300 - book.h})">
            <rect width="42" height="${book.h}" rx="8" fill="${book.c}" opacity=".78"/>
            <rect x="8" y="20" width="26" height="6" rx="3" fill="#111827" opacity=".45"/>
            <rect x="8" y="${book.h - 42}" width="26" height="6" rx="3" fill="#111827" opacity=".35"/>
            <text x="14" y="${book.h / 2}" fill="#111827" font-size="15" font-family="monospace" transform="rotate(-90 14 ${book.h / 2})">0${i + 1}</text>
          </g>`,
          )
          .join('')}
        <path d="M-22 198h370M-22 98h370" stroke="#ffffff" stroke-opacity=".1"/>
      </g>
      <g transform="translate(420 45)">
        <rect width="500" height="330" rx="28" fill="#111827" stroke="#ffffff" stroke-opacity=".16"/>
        <text x="32" y="54" fill="#e8edf8" font-size="23" font-family="sans-serif" font-weight="700">Operations record</text>
        <text x="32" y="83" fill="#8f9ab4" font-size="15" font-family="monospace">LOCAL · SQLITE · AUDITABLE</text>
        <g transform="translate(30 110)">
          <rect width="210" height="76" rx="16" fill="${accent}" opacity=".13"/>
          <text x="20" y="34" fill="${accent}" font-size="16" font-family="monospace">CATALOG</text>
          <text x="20" y="62" fill="#e8edf8" font-size="27" font-family="monospace">2,000</text>
          <rect x="230" width="210" height="76" rx="16" fill="${secondary}" opacity=".13"/>
          <text x="250" y="34" fill="${secondary}" font-size="16" font-family="monospace">COPIES</text>
          <text x="250" y="62" fill="#e8edf8" font-size="27" font-family="monospace">4,200</text>
          <rect y="96" width="440" height="102" rx="18" fill="#ffffff" opacity=".05"/>
          <path d="M24 150 C90 110 130 176 196 132 S320 110 414 70" fill="none" stroke="url(#spectrum)" stroke-width="6" stroke-linecap="round"/>
        </g>
      </g>
      <g transform="translate(455 420)">
        <rect width="440" height="70" rx="16" fill="#0c101d" stroke="#ffffff" stroke-opacity=".14"/>
        <text x="24" y="44" fill="#c7cede" font-size="18" font-family="monospace">978-93-XXXX-XXX-X</text>
        <g fill="${accent}">
          ${Array.from({ length: 26 }, (_, i) => `<rect x="${285 + i * 5}" y="20" width="${i % 4 === 0 ? 3 : 1.5}" height="30"/>`).join('')}
        </g>
      </g>
    </g>`;
}

const ART: Record<string, (accent: string, secondary: string) => string> = {
  sortify: sortifyArt,
  veylo: veyloArt,
  sabuddy: sabuddyArt,
  facilityfix: facilityfixArt,
  sarp: sarpArt,
  pustakalaya: pustakalayaArt,
};

export function coverSvg(project: Project, index: number): string {
  const art = ART[project.slug]?.(project.accent, project.accentSecondary) ?? '';
  const label = escapeXml(project.name.toUpperCase());
  const number = String(index + 1).padStart(2, '0');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" role="img" aria-label="Original ${escapeXml(
    project.name,
  )} project artwork">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#11182a"/>
      <stop offset="0.5" stop-color="#0a0d18"/>
      <stop offset="1" stop-color="#080910"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${project.accent}" stop-opacity="0.28"/>
      <stop offset="0.55" stop-color="${project.accentSecondary}" stop-opacity="0.1"/>
      <stop offset="1" stop-color="${project.accentSecondary}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="spectrum" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${project.accentSecondary}"/>
      <stop offset="0.5" stop-color="${project.accent}"/>
      <stop offset="1" stop-color="#fff4bd"/>
    </linearGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="#ffffff" stroke-opacity="0.055" stroke-width="1"/>
    </pattern>
    <filter id="blur"><feGaussianBlur stdDeviation="42"/></filter>
  </defs>
  <rect width="1200" height="800" fill="url(#bg)"/>
  <rect width="1200" height="800" fill="url(#grid)"/>
  <circle cx="890" cy="180" r="360" fill="url(#glow)" filter="url(#blur)"/>
  <circle cx="180" cy="700" r="280" fill="${project.accentSecondary}" opacity="0.07" filter="url(#blur)"/>
  <text x="1120" y="430" text-anchor="end" fill="#ffffff" opacity="0.035" font-size="390" font-weight="800" font-family="Arial, sans-serif">${number}</text>
  <path d="M-80 650 C210 510 360 690 610 540 S1010 350 1280 470" fill="none" stroke="url(#spectrum)" stroke-width="4" opacity="0.38"/>
  <path d="M-80 685 C210 545 360 725 610 575 S1010 385 1280 505" fill="none" stroke="${project.accentSecondary}" stroke-width="1.5" opacity="0.22"/>
  <circle cx="1035" cy="585" r="92" fill="none" stroke="${project.accent}" stroke-opacity="0.22" stroke-width="2" stroke-dasharray="3 12"/>
  <g fill="${project.accent}">
    <circle cx="96" cy="128" r="4"/><circle cx="1120" cy="92" r="3"/><circle cx="1090" cy="690" r="5"/>
  </g>
  ${art}
  <g font-family="Arial, Helvetica, sans-serif">
    <text x="64" y="74" fill="${project.accent}" font-size="20" font-family="monospace" letter-spacing="5">LAVI / PROJECT ${number}</text>
    <text x="64" y="748" fill="#f5f6fb" font-size="38" font-weight="700" letter-spacing="-1">${label}</text>
    <text x="1136" y="748" text-anchor="end" fill="#aab2c6" font-size="18" font-family="monospace" letter-spacing="3">${project.year} · ORIGINAL ARTWORK</text>
  </g>
</svg>`;
}
