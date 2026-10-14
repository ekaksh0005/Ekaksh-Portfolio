/* =====================================================================
   EKAKSH GOYAL · PORTFOLIO ENGINE (main.js)
   Vanilla High-Performance JavaScript matching https://www.chahel.tech/
   Contains:
   1. Viewport Reveal Observers
   2. Hero Diverging Name Scroll Physics
   3. 3D Parallax Portrait Tilt
   4. Project Card Radial Spotlight Physics
   5. Vriti 3D Quantum Protein Folding Simulation (Canvas)
   6. Kavach Post-Quantum Cipher Terminal Stream
   7. Sign Language Glove Flex Telemetry & TTS Audio Stream
   8. Easing Stat Counters (10+, 3, 5+, 10K+)
   9. Live IST Clock
   ===================================================================== */

function initApp() {
  initScrollReveal();
  initHeroDivergence();
  initPortraitTilt();
  initProjectSpotlights();
  initVritiSimulation();
  initKavachTerminal();
  initGloveTelemetry();
  initStatCounters();
  initLiveClock();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

/* ---------------------------------------------------------------------
   1. VIEWPORT SCROLL REVEAL (.reveal -> .in)
   --------------------------------------------------------------------- */
function initScrollReveal() {
  const revealEls = document.querySelectorAll(".reveal");
  
  // Immediately reveal elements already inside or near the initial viewport
  revealEls.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 100) {
      el.classList.add("in");
    }
  });

  if (!("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("in"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  revealEls.forEach((el) => observer.observe(el));
}

/* ---------------------------------------------------------------------
   2. HERO DIVERGING NAME SCROLL PHYSICS
   "Ekaksh" scrolls left, "Goyal" scrolls right
   --------------------------------------------------------------------- */
function initHeroDivergence() {
  const lineEkaksh = document.getElementById("lineEkaksh");
  const lineGoyal = document.getElementById("lineGoyal");
  if (!lineEkaksh || !lineGoyal) return;

  const onScroll = () => {
    const y = window.scrollY;
    const range = window.innerHeight * 0.85;
    const p = Math.max(0, Math.min(1, y / range));

    lineEkaksh.style.transform = `translateX(${-p * 110}vw)`;
    lineEkaksh.style.opacity = Math.max(0, 1 - p * 1.3);

    lineGoyal.style.transform = `translateX(${p * 110}vw)`;
    lineGoyal.style.opacity = Math.max(0, 1 - p * 1.3);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---------------------------------------------------------------------
   3. 3D PARALLAX PORTRAIT TILT
   --------------------------------------------------------------------- */
function initPortraitTilt() {
  const stage = document.getElementById("portraitStage");
  const frame = document.getElementById("portraitFrame");
  if (!stage || !frame) return;

  stage.addEventListener("mousemove", (e) => {
    const r = stage.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    frame.style.transform = `rotateY(${x * 7}deg) rotateX(${-y * 6}deg)`;
  });

  stage.addEventListener("mouseleave", () => {
    frame.style.transform = "rotateY(0deg) rotateX(0deg)";
  });
}

/* ---------------------------------------------------------------------
   4. PROJECT CARD RADIAL SPOTLIGHT PHYSICS (--mx, --my)
   --------------------------------------------------------------------- */
function initProjectSpotlights() {
  const projects = document.querySelectorAll(".project");
  projects.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      card.style.setProperty("--mx", `${x}%`);
      card.style.setProperty("--my", `${y}%`);
    });
  });
}

/* ---------------------------------------------------------------------
   5. VRITI 3D QUANTUM PROTEIN FOLDING SIMULATION (Canvas)
   --------------------------------------------------------------------- */
function initVritiSimulation() {
  const canvas = document.getElementById("vritiCanvas");
  const telemetryEl = document.getElementById("vritiTelemetry");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = (canvas.width = canvas.parentElement.clientWidth || 360);
  let height = (canvas.height = canvas.parentElement.clientHeight || 320);

  window.addEventListener("resize", () => {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.clientWidth || 360;
    height = canvas.height = canvas.parentElement.clientHeight || 320;
  });

  const nodeCount = 18;
  const nodes = [];
  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: (Math.random() - 0.5) * 180,
      y: (Math.random() - 0.5) * 140,
      z: (Math.random() - 0.5) * 140,
      charge: i % 3 === 0 ? "pos" : i % 3 === 1 ? "neg" : "neutral",
      size: 3 + Math.random() * 3
    });
  }

  let angleX = 0, angleY = 0;
  let isDragging = false;
  let lastX = 0, lastY = 0;

  canvas.addEventListener("mousedown", (e) => {
    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
  });
  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    angleY += (e.clientX - lastX) * 0.01;
    angleX += (e.clientY - lastY) * 0.01;
    lastX = e.clientX;
    lastY = e.clientY;
  });
  window.addEventListener("mouseup", () => { isDragging = false; });

  let frame = 0;
  function render() {
    frame++;
    if (!isDragging) {
      angleY += 0.006;
      angleX += 0.003;
    }
    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;
    const fov = 320;

    const cosY = Math.cos(angleY), sinY = Math.sin(angleY);
    const cosX = Math.cos(angleX), sinX = Math.sin(angleX);

    const projected = nodes.map((n, i) => {
      const wave = Math.sin(frame * 0.04 + i) * 1.5;
      const x = n.x + wave;
      const y = n.y;
      const z = n.z;

      const x1 = x * cosY - z * sinY;
      const z1 = z * cosY + x * sinY;
      const y1 = y * cosX - z1 * sinX;
      const z2 = z1 * cosX + y * sinX + 320;

      const scale = fov / Math.max(z2, 50);
      return {
        px: cx + x1 * scale,
        py: cy + y1 * scale,
        z: z2,
        charge: n.charge,
        size: n.size * scale
      };
    });

    // Peptide bonds
    for (let i = 0; i < projected.length - 1; i++) {
      const p1 = projected[i];
      const p2 = projected[i + 1];
      const alpha = Math.min(1, Math.max(0.15, (400 - p1.z) / 300));
      ctx.beginPath();
      ctx.moveTo(p1.px, p1.py);
      ctx.lineTo(p2.px, p2.py);
      ctx.strokeStyle = `rgba(100, 255, 218, ${alpha * 0.8})`;
      ctx.lineWidth = 1.6;
      ctx.stroke();

      if (i % 2 === 0) {
        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.quadraticCurveTo(
          (p1.px + p2.px) / 2 + Math.sin(frame * 0.1) * 8,
          (p1.py + p2.py) / 2 + Math.cos(frame * 0.1) * 8,
          p2.px,
          p2.py
        );
        ctx.strokeStyle = `rgba(0, 180, 255, ${alpha * 0.35})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }

    projected.sort((a, b) => b.z - a.z);
    projected.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.px, p.py, Math.max(1.5, p.size), 0, Math.PI * 2);
      if (p.charge === "pos") {
        ctx.fillStyle = "#64ffda";
        ctx.shadowColor = "#64ffda";
        ctx.shadowBlur = 10;
      } else if (p.charge === "neg") {
        ctx.fillStyle = "#ff5588";
        ctx.shadowColor = "#ff5588";
        ctx.shadowBlur = 8;
      } else {
        ctx.fillStyle = "#5bb1e8";
        ctx.shadowColor = "#5bb1e8";
        ctx.shadowBlur = 6;
      }
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    if (telemetryEl && frame % 45 === 0) {
      const e = (-410 - Math.sin(frame * 0.05) * 6.5).toFixed(1);
      const s = 104 + (frame % 200);
      const r = (0.17 + Math.sin(frame * 0.02) * 0.03).toFixed(2);
      telemetryEl.innerHTML =
        '<span>ΔE: <strong style="color:var(--accent);">' + e + ' kcal/mol</strong></span> ' +
        '<span>RMSD: <strong style="color:var(--text);">' + r + ' Å</strong></span> ' +
        '<span>ITER: <strong style="color:var(--text-mute);">' + s + '</strong></span>';
    }

    requestAnimationFrame(render);
  }

  render();
}

/* ---------------------------------------------------------------------
   6. KAVACH POST-QUANTUM CIPHER TERMINAL STREAM
   --------------------------------------------------------------------- */
function initKavachTerminal() {
  const consoleEl = document.getElementById("kavachConsole");
  if (!consoleEl) return;

  const logs = [
    "INIT KAVACH // PQC-LATTICE-GEN",
    "ENTROPY POOL: 4096-bit CRYSTALS-Kyber",
    "SHOR RESISTANCE: 256-bit Post-Quantum",
    "RSA-4096 WRAPPER: SECURE DUAL-TUNNEL",
    "CIPHER: [0x7f 0x3a 0x9c 0xef 0x12 0x8b 0xaa]",
    "KEYEXCHANGE: OK // ECDH + KYBER-1024",
    "HANDSHAKE: CLIENT ↔ SERVER SECURE",
    "QUANTUM THREAT INTERCEPTED: 0 DETECTIONS",
    "HASH DIGEST: SHA3-512 NOMINAL",
    "ENCRYPTED PACKET DISPATCH: 142 B/s"
  ];

  let currentLogs = logs.slice(0, 4);
  let idx = 4;

  setInterval(() => {
    currentLogs = [...currentLogs.slice(1), logs[idx]];
    idx = (idx + 1) % logs.length;
    consoleEl.innerHTML = currentLogs
      .map(function (log, i) {
        var col = i === currentLogs.length - 1 ? "var(--accent)" : "var(--text-dim)";
        return '<div style="color:' + col + ';white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' +
               '<span style="opacity:0.5;margin-right:6px;">›</span>' + log + '</div>';
      })
      .join("");
  }, 1300);
}

/* ---------------------------------------------------------------------
   7. SIGN LANGUAGE GLOVE FLEX TELEMETRY & TTS AUDIO STREAM
   --------------------------------------------------------------------- */
function initGloveTelemetry() {
  const fingersEl = document.getElementById("gloveFingers");
  const speechEl = document.getElementById("gloveSpeechText");
  if (!fingersEl || !speechEl) return;

  const fingerLabels = ["THUMB", "INDEX", "MIDDLE", "RING", "PINKY"];
  const gestures = [
    "HELLO / WELCOME",
    "ASSISTANCE NEEDED",
    "THANK YOU",
    "WATER PLEASE",
    "I AM SAFE"
  ];

  function updateMeters() {
    const angles = [
      Math.floor(40 + Math.random() * 55),
      Math.floor(40 + Math.random() * 55),
      Math.floor(40 + Math.random() * 55),
      Math.floor(40 + Math.random() * 55),
      Math.floor(30 + Math.random() * 60)
    ];

    fingersEl.innerHTML = angles
      .map(function (ang, i) {
        return '<div style="display:grid;grid-template-columns:55px 1fr 35px;align-items:center;gap:10px;font-size:10px;" class="mono">' +
               '<span style="color:var(--text-dim);">' + fingerLabels[i] + '</span>' +
               '<div style="height:5px;background:rgba(255,255,255,0.06);border-radius:2px;overflow:hidden;">' +
               '<div style="width:' + ang + '%;height:100%;background:linear-gradient(90deg,var(--accent),#e08030);transition:width 0.4s ease;"></div>' +
               '</div>' +
               '<span style="color:var(--text);text-align:right;">' + ang + '°</span>' +
               '</div>';
      })
      .join("");
  }

  updateMeters();
  let gIdx = 0;
  setInterval(() => {
    gIdx = (gIdx + 1) % gestures.length;
    speechEl.textContent = gestures[gIdx];
    updateMeters();
  }, 1800);
}

/* ---------------------------------------------------------------------
   8. EASING STAT COUNTERS (10+, 3, 5+, 10K+)
   --------------------------------------------------------------------- */
function initStatCounters() {
  const counters = document.querySelectorAll(".counter");
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute("data-target") || "0", 10);
          const duration = 1200;
          const start = performance.now();

          const step = (now) => {
            const t = Math.min(1, (now - start) / duration);
            const ease = 1 - Math.pow(1 - t, 3);
            el.textContent = Math.round(ease * target);
            if (t < 1) requestAnimationFrame(step);
            else el.textContent = target;
          };

          requestAnimationFrame(step);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.3 }
  );

  counters.forEach((c) => observer.observe(c));
}

/* ---------------------------------------------------------------------
   9. LIVE INDIAN STANDARD TIME (IST) CLOCK
   --------------------------------------------------------------------- */
function initLiveClock() {
  const clockEl = document.getElementById("liveClock");
  if (!clockEl) return;

  const tick = () => {
    try {
      clockEl.textContent =
        new Date().toLocaleTimeString("en-US", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false
        }) + " IST";
    } catch {
      clockEl.textContent = "--:--:-- IST";
    }
  };

  tick();
  setInterval(tick, 1000);
}