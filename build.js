#!/usr/bin/env node
// IronLog build script
// Compiles src/IronLog.jsx → index.html (root, served by GitHub Pages)
// Run with: npm run build

const { execSync } = require('child_process');
const fs   = require('fs');
const path = require('path');

const SRC  = path.join(__dirname, 'src', 'IronLog.jsx');
const TMP  = path.join(__dirname, 'src', '_compiled.js');
const OUT  = path.join(__dirname, 'index.html');

// ── 1. Read and prepare source ───────────────────────────────────────
let src = fs.readFileSync(SRC, 'utf8');

// Strip things that only exist in the React artifact / Claude environment
src = src.replace(/^import \{ useState.*?from "react";\n/m, '');
src = src.replace(/^export default function App\(\)/m, 'function App()');
src = src.replace(/^\s*<FontLoader \/>\n/m, '');
src = src.replace(
  /function FontLoader\(\) \{[\s\S]*?return null;\n\}/,
  '// Fonts loaded in <head>'
);

fs.writeFileSync(TMP, src, 'utf8');

// ── 2. Compile JSX → plain JS ────────────────────────────────────────
console.log('Compiling JSX...');
execSync(`./node_modules/.bin/babel "${TMP}" -o "${TMP}.out.js"`, { stdio: 'inherit' });
const compiled = fs.readFileSync(`${TMP}.out.js`, 'utf8');

// Clean up temp files
fs.unlinkSync(TMP);
fs.unlinkSync(`${TMP}.out.js`);

// ── 3. Build final JS bundle ──────────────────────────────────────────
const prefix = `const { useState, useEffect, useRef, useCallback } = React;\n\n`;
const suffix = `\nReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));\n`;
const appJs  = (prefix + compiled + suffix).replace(/<\/script>/g, '<\\/script>');

// ── 4. App icon (base64 PNG, embedded) ────────────────────────────────
// To update the icon: replace this string with a new base64-encoded 180×180 PNG
const ICON_B64 = 'iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAYAAAA9zQYyAAADd0lEQVR42u3dP27UQBTA4bG1dVylGIkyLZfgPDkAUmokDsB5uERaynRUuxcwBX+0EkvWXpt43vP3lYgMsfPT8LzssF2ttaxkLHC7bo1FDqWUcjweF0c8DMOSdYp1dr/OeLZOtyhoOzGNGW/duXsxEyju1XZoIdNC1Fd3617MZNqtezGTKepezGSKuhczmaLuxUymqHv3hEx6uzOZdulezGSK2shB6pEDUgRt3CDF2GGHxsgBrepqrcYN0lh6YuUPJzKs08I6Rg7M0CBoEDQIGkGDoEHQIGgQNIIGQYOgQdAgaAQNUTmxQipOrFgn1TpGDszQIGgQNAgaQYOgQdAgaBA0ggZBg6BB0CBoBA1RObFCKk6sWCfVOkYOzNAgaBA0CBpBg6BB0CBoEDSCBkGDoEHQIGh25dDqN/b9Szfr998/Oqfgnjd4YuXbp9Oir394ulPmju95cydWSukWffXv78HJjjnrrHPPW7iupmbouX/l/a81jBlx77mHQlIRNIIGQcMb2Ox16K8f//6155exvH/noS6a55fx4s/zw+ed7NCXLv785hAr5lt+zmmCnnKRoo4f81ZRm6HxUAiCBkHDPIesF/bzHWRrvASYd537Rzt0CN6gtN/7ZORA0ND0DD0MwyqLTVvn6K7vzNS+1uiwwRMrZDOlC5+xAoJG0AH5Lw32e5/S/sPKw9OdU99XH8DyPfMYORA0CBoEDY0HPeXgpIOyMUz5Ob31QdlNdujXLlLMeaLe4tT3Zi/bXbpYb/uMG3Urr2mboTFDg6BB0BA46DUeLLwxad/3fIMTK9ecVvse2rqultc5pbmurtY6tvhusqWfyOQzVuavc8s9b+26mn37qNHBPfdQiIdCtwBBg6BB0CBoBA2CBkGDoEHQCBoEDYIGQcMVXa3VG49Jo7nPWLGOdYwcIGgEDYIGQYOgQdAIGgQNggZBI2gQNAgaBA2CZo+cWCEVJ1ask2odIwdmaBA0CBoEjaBB0CBoEDQIGkGDoEHQIGgQNIKGqLpaaymlOLVCip6dWLFOqnWMHKScoTu3gujjhh2atDs0pAva2EHocePSDi1qwsZs5GAXM7RdmpC782s7tKgJF/O1kUPUhIp5ygwtasLEPPWhUNSEiLmUX/+d7oyFvCuPJkOes0PbrQkR85wd+l9/gB2bzSNeGrS4aSricz8A8r6heTRwhEEAAAAASUVORK5CYII=';

// ── 5. Assemble HTML ─────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <title>IronLog</title>
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black">
  <meta name="apple-mobile-web-app-title" content="IronLog">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="theme-color" content="#0a0a0a">
  <link rel="apple-touch-icon" href="data:image/png;base64,${ICON_B64}">
  <link rel="icon" type="image/png" href="data:image/png;base64,${ICON_B64}">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
  <style>
    *{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
    html,body{margin:0;padding:0;background:#0a0a0a;height:100%;overflow-x:hidden;}
    #root{min-height:100vh;}
  </style>
</head>
<body>
  <div id="root">
    <div style="min-height:100vh;background:#0a0a0a;display:flex;align-items:center;justify-content:center;">
      <span style="font-family:monospace;color:#f59e0b;letter-spacing:3px;font-size:14px;">IRONLOG&#8230;</span>
    </div>
  </div>
  <script>
${appJs}
  </script>
</body>
</html>`;

fs.writeFileSync(OUT, html, 'utf8');

const sizeKb = (fs.statSync(OUT).size / 1024).toFixed(1);
console.log(`✓ Built index.html (${sizeKb} KB)`);
