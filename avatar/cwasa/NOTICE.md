# Attribution & provenance — the signing avatar

The 3D signing avatar in this folder is **JASigning / CWASA**, developed by the
**Virtual Humans group at the University of East Anglia (UEA)** as part of long
‑running European research on sign‑language avatars (the ViSiCAST, eSIGN,
Dicta‑Sign and related projects). The avatar character **“Anna”**, the WebGL
animation engine (`cwa/allcsa.js`), the GLSL skinning shaders (`shaders/`) and
the avatar data (`avatars/anna.jar`) are **the work of UEA, not of this
project.**

This project — the Algerian Sign Language (ALSL) dictionary — contributes the
dataset, the HamNoSys/SiGML encodings of the signs, the validation, and the web
platform that drives the avatar. The signing technology itself is UEA's.

## What lives here and where it came from
- `cwa/allcsa.js`, `cwa/cwasa.css` — the CWASA WebGL player/engine (UEA).
- `cwa/cwacfg.json`, `cwaclientcfg.json` — local configuration (trimmed for this
  site to a single avatar, Anna).
- `shaders/qskin.vert`, `shaders/qskin.frag` — GLSL avatar‑skinning shaders (UEA).
- `avatars/anna.jar`, `avatars/COMMON.jar` — the Anna avatar mesh/texture and
  shared data (UEA).
- `player.html` — a thin host page written for this project that mounts the
  engine and reports its events to the dictionary.

These UEA files are redistributed here, with attribution, for **non‑commercial,
educational** use as a sign‑language tool. They remain the property of the
University of East Anglia and are subject to UEA's terms. If you reuse or
redistribute this project, keep this notice and the on‑site
“Signing powered by JASigning” credit, and consult UEA for any use beyond
non‑commercial research/education:

- JASigning: https://vh.cmp.uea.ac.uk/index.php/JASigning
- CWASA:     https://vh.cmp.uea.ac.uk/index.php/CWASA

If you are the rights holder and would like a change to how this is hosted or
credited, please open an issue — attribution and compliance are intended here,
not appropriation.
