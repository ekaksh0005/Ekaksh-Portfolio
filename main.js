/* =====================================================================
   EKAKSH GOYAL · PORTFOLIO ENGINE (main.js)
   Complete implementation matching https://www.chahel.tech/
   Contains:
   1. Animation Helpers (Letters, Scramble, Counter, useInView, useScrollProgress)
   2. UI Primitives (DotMark, ArrowGlyph, DownloadGlyph, Eyebrow, BlockHeader, StatusPill, RoleChip, TagChip, Button, CornerBrackets)
   3. Interactive 3D & Canvas Visualizers (Vriti, Kavach, Percy, Glove, Gesture, Aarambh)
   4. Portfolio Sections (Nav, Portrait, Hero, Marquee, Work, Research, HireMe, Education, Certifications, Leadership, About, Contact, Footer)
   5. App Entry & Viewport Scroll Reveal Engine
   ===================================================================== */

const { useState, useEffect, useRef, useCallback } = React;

/* =====================================================================
   SECTION 1: ANIMATION HELPERS
   ===================================================================== */

function Letters({ text, delay = 0, step = 40, className = "letter" }) {
  const arr = text.split("");
  return arr.map((c, i) => (
    <span
      key={i}
      className={className}
      style={{ animationDelay: `${delay + i * step}ms` }}
    >
      {c === " " ? "\u00A0" : c}
    </span>
  ));
}

function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      });
    }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function Scramble({ text, charset = "#$%&*+=-_/<>[]{}|", duration = 900, className = "" }) {
  const [ref, inView] = useInView(0.4);
  const [display, setDisplay] = useState(text);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!inView || startedRef.current) return;
    startedRef.current = true;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const revealed = Math.floor(t * text.length);
      const out = text.split("").map((c, i) => {
        if (c === " ") return " ";
        if (i < revealed) return c;
        return charset[Math.floor(Math.random() * charset.length)];
      }).join("");
      setDisplay(out);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setDisplay(text);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, text, charset, duration]);

  return <span ref={ref} className={className}>{display}</span>;
}

function Counter({ to, duration = 1200, suffix = "", className = "" }) {
  const [ref, inView] = useInView(0.4);
  const [val, setVal] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!inView || startedRef.current) return;
    startedRef.current = true;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const e = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(e * to));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  const padded = String(val).padStart(String(to).length, "0");
  return <span ref={ref} className={className}>{padded + suffix}</span>;
}

function useScrollProgress(range = 700) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setP(Math.max(0, Math.min(1, y / range)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [range]);
  return p;
}

/* =====================================================================
   SECTION 2: UI PRIMITIVES
   ===================================================================== */

function DotMark({ size = 6, accent = false }) {
  return (
    <span style={{
      display: "inline-block",
      width: size,
      height: size,
      background: accent ? "var(--accent)" : "var(--text)",
      transform: "rotate(45deg)"
    }} />
  );
}

function ArrowGlyph({ size = 14, stroke = 1.5 }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={stroke}>
      <path d="M5 11 L11 5 M6 5 H11 V10" />
    </svg>
  );
}

function DownloadGlyph({ size = 14 }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 2 V11 M4 7 L8 11 L12 7 M3 14 H13" />
    </svg>
  );
}

function ArrowRight({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d="M6 16 L16 6 M8 6 H16 V14" />
    </svg>
  );
}

function Eyebrow({ children, accent = false, mono = true, bar = true }) {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    gap: 12,
    fontFamily: mono ? "var(--font-mono, 'Geist Mono', monospace)" : "var(--font-sans, 'Geist', sans-serif)",
    fontSize: mono ? 11 : 11.5,
    color: accent ? "var(--accent)" : "var(--text-mute)",
    letterSpacing: accent ? "0.16em" : "0.12em",
    textTransform: "uppercase"
  };
  return (
    <div style={base}>
      {bar && <span style={{ width: accent ? 18 : 28, height: 1, background: "var(--accent)" }} />}
      {children}
    </div>
  );
}

function BlockHeader({ tag, title }) {
  return (
    <div className="block-head reveal">
      <div className="block-tag mono">{tag}</div>
      <h2 className="block-title">{title}</h2>
    </div>
  );
}

function StatusPill({ kind, children }) {
  return <span className={`status ${kind || ""}`}>{children}</span>;
}

function RoleChip({ accent = false, children }) {
  return <span className={`chip ${accent ? "accent" : ""}`}>{children}</span>;
}

function TagChip({ children }) {
  return <span className="mono">{children}</span>;
}

function Button({ variant = "ghost", href, onClick, target, download, children, glyph = "arrow" }) {
  const cls = `btn ${variant === "primary" ? "btn-primary" : "btn-ghost"}`;
  const G = glyph === "download" ? DownloadGlyph : ArrowGlyph;
  const inner = (<>{children}<G /></>);
  if (href) return <a className={cls} href={href} target={target} download={download} rel={target ? "noreferrer" : undefined}>{inner}</a>;
  return <button className={cls} onClick={onClick}>{inner}</button>;
}

function CornerBrackets({ accent = true, inset = 12, size = 14 }) {
  const base = {
    position: "absolute",
    width: size,
    height: size,
    border: `1px solid ${accent ? "var(--accent)" : "var(--text)"}`,
    zIndex: 4
  };
  return (
    <>
      <span style={{ ...base, top: inset, left: inset, borderRight: 0, borderBottom: 0 }} />
      <span style={{ ...base, top: inset, right: inset, borderLeft: 0, borderBottom: 0 }} />
      <span style={{ ...base, bottom: inset, left: inset, borderRight: 0, borderTop: 0 }} />
      <span style={{ ...base, bottom: inset, right: inset, borderLeft: 0, borderTop: 0 }} />
    </>
  );
}

function EGMark() {
  return (
    <span className="cp-mark" aria-label="Ekaksh Goyal">
      <DotMark size={7} accent />
      <span className="cp-mark-text mono">EG</span>
    </span>
  );
}

/* =====================================================================
   SECTION 3: INTERACTIVE 3D & CANVAS PROJECT VISUALIZERS
   ===================================================================== */

function VritiScene() {
  const canvasRef = useRef(null);
  const [telemetry, setTelemetry] = useState({ energy: -412.8, step: 104, rmsd: 0.18 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let width = canvas.width = canvas.parentElement.clientWidth || 360;
    let height = canvas.height = canvas.parentElement.clientHeight || 320;

    const onResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth || 360;
      height = canvas.height = canvas.parentElement.clientHeight || 320;
    };
    window.addEventListener("resize", onResize);

    const nodeCount = 18;
    const nodes = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: (Math.random() - 0.5) * 180,
        y: (Math.random() - 0.5) * 140,
        z: (Math.random() - 0.5) * 140,
        charge: (i % 3 === 0) ? "pos" : (i % 3 === 1) ? "neg" : "neutral",
        size: 3 + Math.random() * 3
      });
    }

    let angleX = 0, angleY = 0;
    let isDragging = false;
    let lastX = 0, lastY = 0;

    const onMouseDown = (e) => { isDragging = true; lastX = e.clientX; lastY = e.clientY; };
    const onMouseMove = (e) => {
      if (!isDragging) return;
      angleY += (e.clientX - lastX) * 0.01;
      angleX += (e.clientY - lastY) * 0.01;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onMouseUp = () => { isDragging = false; };

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    let frame = 0;
    const render = () => {
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
        let x = n.x + wave;
        let y = n.y;
        let z = n.z;

        let x1 = x * cosY - z * sinY;
        let z1 = z * cosY + x * sinY;
        let y1 = y * cosX - z1 * sinX;
        let z2 = z1 * cosX + y * sinX + 320;

        const scale = fov / Math.max(z2, 50);
        return {
          px: cx + x1 * scale,
          py: cy + y1 * scale,
          z: z2,
          charge: n.charge,
          size: n.size * scale
        };
      });

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
            p2.px, p2.py
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

      if (frame % 45 === 0) {
        setTelemetry({
          energy: Number((-410 - Math.sin(frame * 0.05) * 6.5).toFixed(1)),
          step: 104 + (frame % 200),
          rmsd: Number((0.17 + Math.sin(frame * 0.02) * 0.03).toFixed(2))
        });
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <div className="viz-aether" style={{ width: "100%", height: "100%", position: "relative" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", cursor: "grab" }} />
      <div className="stl-label mono" style={{ position: "absolute", top: 12, right: 12 }}>
        VRITI · QUANTUM SIM
      </div>
      <div className="stl-hint mono" style={{ position: "absolute", bottom: 10, left: 16, fontSize: 10, color: "var(--text-dim)", display: "flex", gap: 16 }}>
        <span>ΔE: <strong style={{ color: "var(--accent)" }}>{telemetry.energy} kcal/mol</strong></span>
        <span>RMSD: <strong style={{ color: "var(--text)" }}>{telemetry.rmsd} Å</strong></span>
        <span>ITER: <strong style={{ color: "var(--text-mute)" }}>{telemetry.step}</strong></span>
      </div>
    </div>
  );
}

function KavachScene() {
  const [cipherLogs, setCipherLogs] = useState([
    "INIT KAVACH // PQC-LATTICE-GEN",
    "ENTROPY POOL: 4096-bit CRYSTALS-Kyber",
    "SHOR RESISTANCE: 256-bit Post-Quantum",
    "RSA-4096 WRAPPER: SECURE DUAL-TUNNEL"
  ]);

  useEffect(() => {
    const stream = [
      "CIPHER: [0x7f 0x3a 0x9c 0xef 0x12 0x8b 0xaa]",
      "KEYEXCHANGE: OK // ECDH + KYBER-1024",
      "HANDSHAKE: CLIENT ↔ SERVER SECURE",
      "QUANTUM THREAT INTERCEPTED: 0 DETECTIONS",
      "HASH DIGEST: SHA3-512 NOMINAL",
      "ENCRYPTED PACKET DISPATCH: 142 B/s"
    ];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % stream.length;
      setCipherLogs((prev) => [...prev.slice(-4), stream[idx]]);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="viz-fdir" style={{ width: "100%", height: "100%" }}>
      <div className="panel" style={{ width: "100%", maxWidth: 380, padding: "18px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span className="mono" style={{ fontSize: 10, color: "var(--accent)", letterSpacing: "0.14em" }}>
            <span style={{ display: "inline-block", width: 6, height: 6, background: "var(--accent)", borderRadius: "50%", marginRight: 6 }} />
            KAVACH · POST-QUANTUM CIPHER
          </span>
          <span className="mono" style={{ fontSize: 9, color: "oklch(0.78 0.12 145)", border: "1px solid rgba(100,255,218,0.3)", padding: "2px 6px", borderRadius: 4 }}>
            AES-GCM // LATTICE
          </span>
        </div>

        <div className="ln ok"><span>ALGORITHM</span><span className="v mono">CRYSTALS-Kyber + RSA</span></div>
        <div className="ln ok"><span>KEY STRENGTH</span><span className="v mono">Post-Quantum Safe</span></div>
        <div className="ln warn"><span>SHOR RESISTANCE</span><span className="v mono">VERIFIED / 100%</span></div>
        <div className="ln ok"><span>CHANNEL ENCRYPTION</span><span className="v mono">E2E TLS HYBRID</span></div>

        <hr style={{ margin: "12px 0", borderColor: "var(--line)" }} />

        <div style={{ background: "rgba(0,0,0,0.4)", padding: "8px 10px", borderRadius: 4, fontFamily: "'Geist Mono', monospace", fontSize: 10, lineHeight: 1.5 }}>
          {cipherLogs.map((log, i) => (
            <div key={i} style={{ color: i === cipherLogs.length - 1 ? "var(--accent)" : "var(--text-dim)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              <span style={{ opacity: 0.5, marginRight: 6 }}>›</span>{log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PercyScene() {
  return (
    <div className="drone3d" style={{ width: "100%", height: "100%" }}>
      <div className="drone3d-stage" style={{ transform: "rotateX(58deg) rotateZ(-28deg)" }}>
        <div className="drone-grid" />
        <div style={{
          position: "absolute",
          width: 140, height: 220,
          left: "50%", top: "50%",
          transform: "translate(-50%, -50%) translateZ(10px)",
          border: "1.5px solid var(--accent)",
          background: "rgba(22, 22, 26, 0.8)",
          borderRadius: 8,
          boxShadow: "0 0 25px rgba(224, 128, 48, 0.25)"
        }}>
          <div style={{
            position: "absolute",
            width: 90, height: 110,
            left: 25, top: 50,
            border: "1px dashed rgba(255, 255, 255, 0.25)",
            background: "rgba(10, 10, 12, 0.6)",
            borderRadius: 6
          }} />
          <div style={{
            position: "absolute",
            left: -22, top: 20, width: 22, height: 180,
            borderRadius: 12,
            border: "1.5px solid #e08030",
            background: "rgba(224, 128, 48, 0.2)",
            boxShadow: "0 0 12px rgba(224, 128, 48, 0.4)"
          }} />
          <div style={{
            position: "absolute",
            right: -22, top: 20, width: 22, height: 180,
            borderRadius: 12,
            border: "1.5px solid #e08030",
            background: "rgba(224, 128, 48, 0.2)",
            boxShadow: "0 0 12px rgba(224, 128, 48, 0.4)"
          }} />
          <div style={{ position: "absolute", left: -32, top: 35, width: 14, height: 35, border: "1px solid #fff", background: "#111" }} />
          <div style={{ position: "absolute", left: -32, top: 150, width: 14, height: 35, border: "1px solid #fff", background: "#111" }} />
          <div style={{ position: "absolute", right: -32, top: 35, width: 14, height: 35, border: "1px solid #fff", background: "#111" }} />
          <div style={{ position: "absolute", right: -32, top: 150, width: 14, height: 35, border: "1px solid #fff", background: "#111" }} />
          <div style={{
            position: "absolute",
            left: "50%", bottom: -20,
            width: 14, height: 14,
            transform: "translateX(-50%)",
            background: "#e08030",
            borderRadius: "50%",
            boxShadow: "0 0 15px #e08030"
          }} />
        </div>
      </div>
      <div className="stl-label mono" style={{ position: "absolute", top: 12, right: 12 }}>
        P.E.R.C.Y · AMPHIBIOUS KIT
      </div>
      <div className="stl-hint mono" style={{ position: "absolute", bottom: 12, left: 16 }}>
        FLOATATION DEPLOYED · DEPTH SENSOR ACTIVE
      </div>
    </div>
  );
}

function GloveScene() {
  const [gesture, setGesture] = useState("HELLO / WELCOME");
  const [angles, setAngles] = useState([82, 75, 91, 64, 45]);

  useEffect(() => {
    const gestures = ["HELLO / WELCOME", "ASSISTANCE NEEDED", "THANK YOU", "WATER PLEASE", "I AM SAFE"];
    let i = 0;
    const t = setInterval(() => {
      i = (i + 1) % gestures.length;
      setGesture(gestures[i]);
      setAngles([
        Math.floor(40 + Math.random() * 55),
        Math.floor(40 + Math.random() * 55),
        Math.floor(40 + Math.random() * 55),
        Math.floor(40 + Math.random() * 55),
        Math.floor(30 + Math.random() * 60)
      ]);
    }, 1800);
    return () => clearInterval(t);
  }, []);

  const fingerLabels = ["THUMB", "INDEX", "MIDDLE", "RING", "PINKY"];

  return (
    <div className="viz-sauron" style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 360, background: "rgba(10, 10, 12, 0.75)", border: "1px solid var(--line-2)", borderRadius: 6, padding: "18px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span className="mono" style={{ fontSize: 10.5, color: "#e08030", letterSpacing: "0.12em" }}>
            WEARABLE TELEMETRY · 5-FLEX ARRAY
          </span>
          <span className="mono" style={{ fontSize: 9.5, color: "var(--text-mute)" }}>
            MPU6050 + BT 5.0
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 14 }}>
          {angles.map((ang, idx) => (
            <div key={idx} style={{ display: "grid", gridTemplateColumns: "55px 1fr 35px", alignItems: "center", gap: 10, fontSize: 10 }} className="mono">
              <span style={{ color: "var(--text-dim)" }}>{fingerLabels[idx]}</span>
              <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ width: `${ang}%`, height: "100%", background: "linear-gradient(90deg, var(--accent), #e08030)", transition: "width 0.4s ease" }} />
              </div>
              <span style={{ color: "var(--text)", textAlign: "right" }}>{ang}°</span>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid var(--line)", paddingTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="mono" style={{ fontSize: 9, color: "var(--text-mute)", textTransform: "uppercase" }}>TTS Audio Stream</div>
            <div className="mono" style={{ fontSize: 13, color: "var(--accent)", fontWeight: 500, marginTop: 2 }}>{gesture}</div>
          </div>
          <span className="mono" style={{ fontSize: 10, color: "oklch(0.78 0.12 145)" }}>99.2% ACC</span>
        </div>
      </div>
    </div>
  );
}

function GestureScene() {
  return (
    <div className="viz-sauron">
      <div className="grid">
        {[
          { x: 50, y: 80 }, { x: 42, y: 65 }, { x: 35, y: 50 }, { x: 30, y: 35 },
          { x: 48, y: 50 }, { x: 46, y: 32 }, { x: 44, y: 18 },
          { x: 55, y: 48 }, { x: 56, y: 30 }, { x: 58, y: 16 },
          { x: 62, y: 52 }, { x: 65, y: 34 }, { x: 68, y: 22 },
          { x: 68, y: 60 }, { x: 74, y: 46 }, { x: 78, y: 36 }
        ].map((n, i) => (
          <React.Fragment key={i}>
            <span className="node" style={{ left: n.x + "%", top: n.y + "%" }} />
          </React.Fragment>
        ))}
        <span className="target" style={{ left: "55%", top: "45%" }} />
      </div>
      <div className="stl-label mono" style={{ position: "absolute", top: 12, right: 12 }}>
        OPENCV · 21 LANDMARKS
      </div>
    </div>
  );
}

function AarambhScene() {
  return (
    <div className="viz-gauss">
      <div className="editor">
        <div className="editor-bar">
          <span className="dot live" /><span className="dot" /><span className="dot" />
          <span className="name">aarambh_core.cpp · charity portal</span>
        </div>
        <div className="editor-body">
          <div><span className="cm">// Aarambh Trust Youth Wing Platform</span></div>
          <div><span className="kw">#include</span> <span className="nm">&lt;aarambh/security.hpp&gt;</span></div>
          <div><span className="kw">auto</span> portal = Portal::init(<span className="ac">"YouthWing"</span>);</div>
          <div>portal.dispatchDonorCampaign(<span className="ac">2024</span>);</div>
          <div>portal.verifyBugStatus();<span className="caret" /></div>
        </div>
      </div>
      <div className="console">
        <div className="ok">✓ 1,200+ beneficiaries logged</div>
        <div className="ok">✓ encrypted donor ledger verified</div>
        <div className="ac">▶ youth wing campaigns active</div>
      </div>
    </div>
  );
}

/* =====================================================================
   SECTION 4: PORTFOLIO SECTIONS
   ===================================================================== */

function Nav() {
  return (
    <nav className="nav">
      <div className="nav-mark">
        <DotMark />
        <span className="mono">EKAKSH GOYAL · PORTFOLIO</span>
      </div>
      <div className="nav-links">
        <a href="#work"><span className="idx mono">01</span> Work</a>
        <a href="#research"><span className="idx mono">02</span> Research</a>
        <a href="#education"><span className="idx mono">03</span> Education</a>
        <a href="#skills"><span className="idx mono">04</span> Skills</a>
        <a href="#leadership"><span className="idx mono">05</span> Leadership</a>
        <a href="#about"><span className="idx mono">06</span> About</a>
      </div>
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <a className="nav-cta" href="Resume/EkakshGoyal_Resume.pdf" target="_blank" download="EkakshGoyal_Resume.pdf">
          <span>Resume</span>
          <DownloadGlyph size={12} />
        </a>
        <a className="nav-cta" href="#contact">
          <span>Get in touch</span>
          <ArrowGlyph size={12} />
        </a>
      </div>
    </nav>
  );
}

function Portrait() {
  const stageRef = useRef(null);
  const frameRef = useRef(null);
  const [imgSrc, setImgSrc] = useState("Images/Profile3.jpeg");

  const onMove = useCallback((e) => {
    const el = stageRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    if (frameRef.current) frameRef.current.style.transform = `rotateY(${x * 6}deg) rotateX(${-y * 5}deg)`;
  }, []);

  const onLeave = useCallback(() => {
    if (frameRef.current) frameRef.current.style.transform = "rotateY(0deg) rotateX(0deg)";
  }, []);

  return (
    <div className="portrait-stage" ref={stageRef} onMouseMove={onMove} onMouseLeave={onLeave}>
      <div className="portrait-frame" ref={frameRef}>
        <img
          src={imgSrc}
          className="portrait-img"
          alt="Ekaksh Goyal"
          onError={() => {
            setImgSrc("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'><rect width='100%25' height='100%25' fill='%23111116'/><circle cx='200' cy='180' r='60' fill='%231d1d24' stroke='%2364ffda' stroke-width='2'/><path d='M100 360 C100 270 300 270 300 360' fill='%231d1d24' stroke='%2364ffda' stroke-width='2'/><text x='200' y='420' font-family='monospace' font-size='14' fill='%238a8a92' text-anchor='middle'>EKAKSH GOYAL</text></svg>");
          }}
        />
        <div className="portrait-veil" />
        <CornerBrackets />
        <span className="portrait-tag t1 mono">Computer Scientist</span>
        <span className="portrait-tag t2 mono">Cybersecurity & AI</span>
        <span className="portrait-tag hover-show mono">Grade XII · Noida</span>
      </div>
    </div>
  );
}

function Hero() {
  const ekakshRef = useRef(null);
  const goyalRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const range = window.innerHeight * 0.85;
      const p = Math.max(0, Math.min(1, y / range));
      if (ekakshRef.current) {
        ekakshRef.current.style.transform = `translateX(${-p * 110}vw)`;
        ekakshRef.current.style.opacity = String(Math.max(0, 1 - p * 1.3));
      }
      if (goyalRef.current) {
        goyalRef.current.style.transform = `translateX(${p * 110}vw)`;
        goyalRef.current.style.opacity = String(Math.max(0, 1 - p * 1.3));
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="hero" id="top">
      <div className="hero-meta-top mono">
        <div className="pair"><span>Portfolio</span><span className="sep">/</span><span>2026</span></div>
        <div className="pair"><span>Noida, India</span><span className="sep">/</span><span>IST (UTC+5:30)</span></div>
      </div>
      <div className="hero-left">
        <div>
          <Eyebrow>CYBERSECURITY / QUANTUM-SAFE AI / ROBOTICS</Eyebrow>
          <h1 className="hero-name" style={{ marginTop: 18 }}>
            <span className="ln line-ekaksh" ref={ekakshRef}>
              <Letters text="Ekaksh" delay={200} step={50} />
            </span>
            <span className="ln indent line-goyal" ref={goyalRef}>
              <Letters text="Goyal" delay={600} step={50} />
            </span>
          </h1>
        </div>
        <div className="hero-tag">
          <p>
            I engineer high-impact intelligent systems — from <strong>quantum-resistant encryption</strong> and <strong>protein folding analysis AI</strong> to assistive robotics and computer vision. Leading the Youth Wing at Aarambh Trust, researching AI in automobile systems, and building technology that solves real-world challenges.
          </p>
          <div className="role-strip">
            <RoleChip accent>Available — Summer 2026 / Undergrad</RoleChip>
            <RoleChip>Quantum & Cybersecurity</RoleChip>
            <RoleChip>Assistive Tech & AI</RoleChip>
          </div>
          <div style={{ display: "flex", gap: "12px", marginTop: "14px", flexWrap: "wrap" }}>
            <Button href="Resume/EkakshGoyal_Resume.pdf" target="_blank" download="EkakshGoyal_Resume.pdf" glyph="download" variant="primary">
              Download Resume
            </Button>
            <Button href="#contact">
              Get in touch
            </Button>
          </div>
        </div>
      </div>
      <div className="hero-right"><Portrait /></div>
    </section>
  );
}

function Marquee() {
  const items = [
    { name: "VRITI", sub: "quantum · bio AI" },
    { name: "KAVACH", sub: "post-quantum rsa" },
    { name: "P.E.R.C.Y", sub: "amphibious car kit", dim: true },
    { name: "SIGN GLOVE", sub: "wearable hardware" },
    { name: "F1 POKEDEX", sub: "python database", dim: true },
    { name: "BUGGY APP", sub: "vuln alerts" },
    { name: "AARAMBH", sub: "youth wing leader", dim: true },
    { name: "IJSDR", sub: "published paper" }
  ];

  const block = (key) => (
    <span key={key}>
      {items.map((it, i) => (
        <React.Fragment key={key + i}>
          <span className={"marquee-item" + (it.dim ? " dim" : "")}>
            {it.name} <span className="sub">{it.sub}</span>
          </span>
          <span className="marquee-sep" />
        </React.Fragment>
      ))}
    </span>
  );

  return (
    <div className="marquee">
      <div className="marquee-track">{block("a")}{block("b")}</div>
    </div>
  );
}

function Project({ num, name, sub, desc, tags, status, span, theme, badge, link, children }) {
  const ref = useRef(null);
  const onMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--mx", (e.clientX - r.left) / r.width * 100 + "%");
    ref.current.style.setProperty("--my", (e.clientY - r.top) / r.height * 100 + "%");
  };

  return (
    <article ref={ref} className={`project ${span} reveal ${theme ? "theme-" + theme : ""}`} onMouseMove={onMove}>
      <div className="row">
        <span className="num">{num}</span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {badge}
          {status && <StatusPill kind={status.kind}>{status.label}</StatusPill>}
        </div>
      </div>
      <div className="visual">{children}</div>
      {link ? (
        <a className="name project-link" href={link} target="_blank" rel="noreferrer">
          {name} <ArrowGlyph size={14} />
        </a>
      ) : (
        <div className="name">{name}</div>
      )}
      <div className="sub mono">{sub}</div>
      <p className="desc">{desc}</p>
      <div className="tags">{tags.map((t) => <TagChip key={t}>{t}</TagChip>)}</div>
    </article>
  );
}

function Work() {
  return (
    <section className="block" id="work">
      <BlockHeader tag="SELECTED WORK / 06" title={<>Systems that compute, protect, <em>and empower.</em></>} />
      <div className="projects">
        <Project
          num="01 / BIO-AI"
          span="span-7"
          badge={<EGMark />}
          status={{ kind: "amber", label: "Active Research" }}
          name="Vriti"
          sub="Protein Folding Quantum Analysis AI"
          desc="Leveraged artificial intelligence and quantum sorting algorithms to model complex protein folding pathways, facilitating accelerated structural prediction for vaccine and drug discovery (modeled SARS-CoV-2 Spike, Tuberculosis Ag85B, and HIV-1 gp120)."
          tags={["Quantum Computing", "AI", "Python", "Bio-Informatics"]}
        >
          <VritiScene />
        </Project>

        <Project
          num="02 / CRYPTO"
          span="span-5"
          theme="violet"
          status={{ kind: "live", label: "Post-Quantum" }}
          name="Kavach"
          sub="Quantum-Resistant RSA Suite"
          desc="Advanced encryption software engineered to resist quantum decryption attacks. Features end-to-end encrypted messaging resistant to Shor's algorithm via hybrid lattice key wrapping."
          tags={["Lattice Crypto", "RSA", "Security", "Python"]}
        >
          <KavachScene />
        </Project>

        <Project
          num="03 / HARDWARE"
          span="span-5"
          theme="orange"
          status={{ kind: "r", label: "Modular Prototype" }}
          name="P.E.R.C.Y"
          sub="Modular Amphibious Vehicle Kit"
          desc="Designed a modular attachment system converting standard civilian automobiles into amphibious rescue crafts for severe flood emergencies. Features automated pontoons, depth sensors, and specialized propulsion."
          tags={["Embedded Systems", "Hardware", "Sensors", "CAD"]}
        >
          <PercyScene />
        </Project>

        <Project
          num="04 / ASSISTIVE"
          span="span-7"
          theme="red"
          status={{ kind: "live", label: "TMU Internship" }}
          name="Sign Language Glove"
          sub="Wearable Gesture-to-Speech Array"
          desc="Engineered a wearable assistive device with flex sensor arrays and IMU sensor fusion that translates sign language in real time into synthesized speech and text for speech/hearing-impaired individuals."
          tags={["Wearables", "Sensors", "Microcontrollers", "Data Analysis"]}
        >
          <GloveScene />
        </Project>

        <Project
          num="05 / VISION"
          span="span-6"
          status={{ kind: "", label: "OpenCV Engine" }}
          name="Hand Gesture Recognition"
          sub="Real-Time Computer Vision Interface"
          desc="Developed computer vision algorithms to interpret complex hand gestures and translate them into actionable system control commands with sub-50ms latency."
          tags={["OpenCV", "Computer Vision", "Python", "HCI"]}
        >
          <GestureScene />
        </Project>

        <Project
          num="06 / IMPACT"
          span="span-6"
          theme="lang"
          badge={<EGMark />}
          name="Aarambh Platform & Buggy"
          sub="Community Trust Tech & Vuln Alerts"
          desc="Architected official infrastructure for Aarambh Trust for Women and Children, managing donor links and youth programs. Built the Buggy App alerting users to real-time software vulnerabilities."
          tags={["Full-Stack", "C++", "MySQL", "Community Leadership"]}
        >
          <AarambhScene />
        </Project>
      </div>
    </section>
  );
}

function Research() {
  const rows = [
    {
      yr: "2024",
      ttl: "Emergence of Artificial Intelligence in Automobile",
      desc: "Comprehensive analysis on autonomous driving models, predictive telemetry, computer vision safety protocols, and deep neural networks in modern vehicular ecosystems.",
      venue: "IJSDR (Vol. 9)",
      href: "https://www.ijsdr.org/papers/IJSDR2407049.pdf"
    },
    {
      yr: "2025",
      ttl: "Agentic AI: Advancing Autonomous Decision Making and Adaptive Intelligence in Complex Systems",
      desc: "Exploring multi-agent architectures, goal-directed planning, and adaptive decision heuristics in complex, safety-critical environments.",
      venue: "IJSDR (Vol. 10)",
      href: "https://www.ijsdr.org/"
    },
    {
      yr: "2024",
      ttl: "Book: Decoding AI — Understanding Algorithms that Shape our World",
      desc: "Published author exploring machine learning algorithms, ethical implications, and practical computational foundations. Sold 200+ copies on Amazon, Kindle & Google Play.",
      venue: "Amazon / Kindle",
      href: "#"
    },
    {
      yr: "2024",
      ttl: "Wearable Sensory Glove Translation for Hearing & Speech Impairment",
      desc: "Hardware telemetry, flex calibration, and real-time gesture-to-speech synthesis developed at Teerthanker Mahaveer University.",
      venue: "TMU CCSIT",
      href: "#"
    }
  ];

  return (
    <section className="block" id="research">
      <BlockHeader tag="RESEARCH & PUBLICATIONS" title="Papers & Books." />
      <div className="research-list reveal">
        {rows.map((r, i) => (
          <a className="research-row" key={i} href={r.href} target="_blank" rel="noreferrer">
            <span className="yr">{r.yr}</span>
            <span className="ttl">{r.ttl}</span>
            <span className="desc">{r.desc}</span>
            <span className="venue">{r.venue}</span>
            <span className="arrow"><ArrowRight /></span>
          </a>
        ))}
      </div>
    </section>
  );
}

function HireMe() {
  return (
    <section className="hire" id="hire">
      <div className="hire-left">
        <div className="hire-eyebrow">Available — Summer 2026 / Undergrad</div>
        <h2 className="hire-title reveal">
          Connect <span className="stroke">with me</span>.<br />
          Build something <em style={{ color: "var(--accent)", fontStyle: "normal" }}>intelligent</em>.
        </h2>
        <p className="hire-sub reveal">
          Open to software engineering internships, research fellowships, and university programs in Computer Science, AI, and Cybersecurity. If you build systems that solve tough challenges — let's connect.
        </p>
        <div className="hire-actions reveal">
          <Button variant="primary" href="mailto:ekaksh1031@gmail.com">ekaksh1031@gmail.com</Button>
          <Button href="https://www.linkedin.com/in/ekakshgoyal" target="_blank">LinkedIn</Button>
          <Button href="Resume/EkakshGoyal_Resume.pdf" target="_blank" download="EkakshGoyal_Resume.pdf" glyph="download">Download Resume</Button>
        </div>
      </div>
      <div className="hire-right reveal">
        <div className="hire-stat">
          <div className="num"><Counter to={10} duration={1200} /><span className="small">+</span></div>
          <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 18l1 2a3 3 0 0 0 2.5 1.5h11A3 3 0 0 0 20 20l1-2" />
            <path d="M4 14l8 2 8-2-1-3H5l-1 3z" />
            <path d="M12 16V5" />
            <path d="M12 5l5 4H7l5-4z" />
          </svg>
          <div className="label">Shipped projects</div>
        </div>
        <div className="hire-stat">
          <div className="num"><Counter to={3} duration={1000} /></div>
          <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M7 3h8l4 4v14H7z" />
            <path d="M15 3v4h4" />
            <path d="M10 12h6M10 16h6M10 8h2" />
          </svg>
          <div className="label">Publications & Books (IJSDR)</div>
        </div>
        <div className="hire-stat">
          <div className="num"><Counter to={5} duration={1100} /><span className="small">+</span></div>
          <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="9" r="5" />
            <path d="M8.5 13.5L7 21l5-2.5L17 21l-1.5-7.5" />
          </svg>
          <div className="label">Years youth leadership</div>
        </div>
        <div className="hire-stat">
          <div className="num"><Counter to={10} duration={1400} />K<span className="small">+</span></div>
          <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="9" cy="9" r="3" />
            <circle cx="17" cy="10" r="2.4" />
            <path d="M3 19c0-3 2.7-5 6-5s6 2 6 5" />
            <path d="M14 19c0-2.4 2-4 4-4s3.5 1.6 3.5 4" />
          </svg>
          <div className="label">Community reach</div>
        </div>
      </div>
    </section>
  );
}

function Education() {
  const schools = [
    {
      tag: "Current · Grade XII",
      name: "Lotus Valley International School",
      loc: "Noida, UP, India",
      years: "2010 — Present · Scholar Badge Holder",
      details: "Physics, Chemistry, Mathematics, Computer Science & English. Grade X: 92% aggregate · Grade IX: 85% aggregate.",
      mono: "LVIS"
    },
    {
      tag: "Undergraduate Target",
      name: "Computer Science & Engineering",
      loc: "Global Universities",
      years: "Fall 2026 Entry",
      details: "Focusing on Artificial Intelligence, Systems Architecture, Cybersecurity, and Robotics.",
      mono: "CSE"
    }
  ];

  return (
    <section className="block" id="education">
      <BlockHeader tag="EDUCATION" title="Academics." />
      <div className="schools" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
        {schools.map((s) => (
          <article className="school reveal" key={s.name}>
            <div className="top">
              <div className="crest"><span className="mono">{s.mono}</span></div>
              <div className="meta"><span className="tag mono">{s.tag}</span></div>
            </div>
            <div className="name">{s.name}</div>
            <div className="loc">{s.loc}</div>
            <div className="years">{s.years}</div>
            <p style={{ marginTop: 12, fontSize: 13, color: "var(--text-dim)", lineHeight: 1.5 }}>{s.details}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Certifications() {
  const certs = [
    {
      issuer: "Programming",
      year: "Core",
      name: "Languages & Frameworks",
      skills: ["C++", "Python", "Java", "JavaScript", "HTML/CSS", "React"],
      desc: "Object-oriented programming, data structures, algorithms, and computational modeling."
    },
    {
      issuer: "Security",
      year: "Specialization",
      name: "Cybersecurity & Cryptography",
      skills: ["RSA", "Post-Quantum", "Network Defense", "Vuln Analysis"],
      desc: "End-to-end cryptographic implementations, threat modeling, and bug notification architectures."
    },
    {
      issuer: "Hardware & IoT",
      year: "Embedded",
      name: "Robotics & Sensors",
      skills: ["Sensors", "IMU Fusion", "Microcontrollers", "CAD"],
      desc: "Wearable flex sensor arrays, telemetry integration, and modular mechanical prototyping."
    },
    {
      issuer: "CompTIA Standards",
      year: "Certified",
      name: "A+ Certification",
      skills: ["Hardware", "Networking", "Troubleshooting"],
      desc: "Core computational systems, computer hardware configuration, network operations, and diagnostics."
    },
    {
      issuer: "Max Mueller Bhawan",
      year: "Certified",
      name: "German A2 Certification",
      skills: ["German A2", "Max Mueller", "Language"],
      desc: "Certified German language proficiency; participated in language immersion workshops at Max Mueller Bhawan, Delhi."
    },
    {
      issuer: "Creative & Media",
      year: "Software",
      name: "Adobe Creative Cloud",
      skills: ["Premiere Pro", "After Effects", "Lightroom", "Figma", "Visily"],
      desc: "Digital media production, video editing, UI wireframing in Visily/Figma, and photographic post-processing."
    }
  ];

  return (
    <section className="block" id="skills">
      <BlockHeader tag="SKILLS & CREDENTIALS" title="Technical toolkit." />
      <div className="certs">
        {certs.map((c, i) => (
          <article className="cert reveal" key={i}>
            <div className="cert-top">
              <div className="issuer mono">{c.issuer}</div>
              <div className="year mono">{c.year}</div>
            </div>
            <div className="name">{c.name}</div>
            <p className="cert-desc">{c.desc}</p>
            <div className="cert-foot">
              <div className="skills">{c.skills.map((s) => <span key={s}>{s}</span>)}</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Leadership() {
  const items = [
    {
      role: "Leader & Founder",
      name: "Aarambh Youth Wing",
      desc: "Established and lead the Youth Wing initiative at Aarambh Trust for Women and Children. Designed promotional digital campaigns, food/relief drives, and community outreach.",
      mark: "AYW"
    },
    {
      role: "President",
      name: "School Photography Team",
      desc: "Head of the school photography society, leading event coverage, visual documentation, and mentorship for student photojournalists. Winner of Wildlife Photography Competition.",
      mark: "PHOTO"
    },
    {
      role: "1st Place Winner",
      name: "Drummer & Community Musician",
      desc: "Drummer (2014-Present) in a youth music band for social impact. 1st place in Noida Talent Contest; performed at Adobe Noida, Ashoka University, DLF Mall of India, and Noida Stadium. Received LOR from Noida Development Authority.",
      mark: "MUSIC"
    },
    {
      role: "District Finalist",
      name: "STEAM Innovation & Codathons",
      desc: "Advanced to district level in STEAM Innovation League. Won 2nd Position in Golden Frame Code-A-Thon; participated in Google Code-A-Thon, Apple Swift Playground, and Technoxian.",
      mark: "CODE"
    },
    {
      role: "Lead Actor & Host",
      name: "Performing Arts & Theatre",
      desc: "Lead actor in school theatre production (2024), short film contestant, master of ceremonies for major school assemblies, and 1st position in inter-school panel discussion.",
      mark: "ARTS"
    },
    {
      role: "Software Intern",
      name: "Priority (USA) & Yahmi",
      desc: "Software development intern contributing bug fixes, product design feedback in Figma/Visily, and software testing across cross-functional teams.",
      mark: "CORP"
    }
  ];

  return (
    <section className="block" id="leadership">
      <BlockHeader tag="LEADERSHIP & ENGAGEMENT" title={<>Impact beyond <em>the code.</em></>} />
      <div className="leadership-grid">
        {items.map((it, i) => (
          <div className="lead-card reveal" key={i}>
            <div className="lead-top">
              <div className="lead-logo"><span className="mono">{it.mark}</span></div>
              <div className="lead-role mono">{it.role}</div>
            </div>
            <div className="lead-name">{it.name}</div>
            <p className="lead-desc">{it.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="block" id="about">
      <BlockHeader tag="ABOUT" title="Operator." />
      <div className="about-grid">
        <p className="about-bio reveal">
          Senior in Grade XII at Lotus Valley International School, Noida. I spend my time exploring <em>quantum-resistant cryptography</em>, writing bio-computational sorting models, and building assistive hardware devices. Outside the lab, I lead the Aarambh Youth Wing, produce digital media, and perform drums.
        </p>
        <div className="about-meta reveal">
          <div className="cell"><div className="label">Based</div><div className="val lg">Noida, UP, India</div></div>
          <div className="cell"><div className="label">Class</div><div className="val lg">Grade XII (PCM + CS)</div></div>
          <div className="cell"><div className="label">Languages</div><div className="val">C++ · Python · Java · JS · SQL</div></div>
          <div className="cell"><div className="label">Focus</div><div className="val">Cybersecurity · AI · Quantum · Robotics</div></div>
          <div className="cell"><div className="label">Leadership</div><div className="val">Aarambh Youth Wing · Photo President</div></div>
          <div className="cell"><div className="label">Honors</div><div className="val">Scholar Badge · 92% Gr. X · 1st Music</div></div>
        </div>
      </div>
    </section>
  );
}

function useClock(tz = "Asia/Kolkata") {
  const [t, setT] = useState("");
  useEffect(() => {
    const tick = () => {
      try {
        setT(new Date().toLocaleTimeString("en-US", {
          timeZone: tz,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false
        }));
      } catch {
        setT("");
      }
    };
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, [tz]);
  return t;
}

function Contact() {
  const clock = useClock();
  const [sending, setSending] = useState(false);

  const handleSubmit = () => {
    setSending(true);
  };

  return (
    <section className="contact" id="contact">
      <div className="block-head reveal">
        <div className="block-tag mono">CONTACT / INQUIRIES</div>
        <div />
      </div>
      <div className="contact-grid">
        <div className="reveal">
          <h2 className="contact-title">Get in <em>touch.</em></h2>
          <a href="mailto:ekaksh1031@gmail.com" className="contact-mail">
            ekaksh1031@gmail.com
            <ArrowGlyph size={18} />
          </a>

          <form
            action="https://formsubmit.co/ekaksh1031@gmail.com"
            method="POST"
            onSubmit={handleSubmit}
            style={{
              marginTop: 40,
              maxWidth: 520,
              display: "flex",
              flexDirection: "column",
              gap: 16
            }}
          >
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_subject" value="New Portfolio Inquiry for Ekaksh Goyal" />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <input
                type="text"
                name="name"
                placeholder="YOUR NAME"
                required
                className="mono"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--line-2)",
                  padding: "14px 16px",
                  borderRadius: 6,
                  color: "var(--text)",
                  fontSize: 12,
                  outline: "none"
                }}
              />
              <input
                type="email"
                name="email"
                placeholder="YOUR EMAIL"
                required
                className="mono"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--line-2)",
                  padding: "14px 16px",
                  borderRadius: 6,
                  color: "var(--text)",
                  fontSize: 12,
                  outline: "none"
                }}
              />
            </div>

            <input
              type="text"
              name="subject"
              placeholder="SUBJECT"
              required
              className="mono"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--line-2)",
                padding: "14px 16px",
                borderRadius: 6,
                color: "var(--text)",
                fontSize: 12,
                outline: "none"
              }}
            />

            <textarea
              name="message"
              placeholder="MESSAGE / INQUIRY"
              rows={4}
              required
              className="mono"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--line-2)",
                padding: "14px 16px",
                borderRadius: 6,
                color: "var(--text)",
                fontSize: 12,
                outline: "none",
                resize: "vertical"
              }}
            />

            <button
              type="submit"
              className="btn btn-primary"
              style={{ alignSelf: "flex-start", marginTop: 4, cursor: "pointer" }}
            >
              <span>{sending ? "Sending..." : "Send Message"}</span>
              <ArrowGlyph size={14} />
            </button>
          </form>
        </div>

        <div className="contact-meta reveal">
          <div className="field">
            <div className="label">PHONE</div>
            <div className="val"><a href="tel:+919910805899">+91 9910805899</a></div>
          </div>
          <div className="field">
            <div className="label">LOCATION</div>
            <div className="val">South Delhi / Noida, India</div>
          </div>
          <div className="field">
            <div className="label">RESUME</div>
            <div className="val">
              <a href="Resume/EkakshGoyal_Resume.pdf" target="_blank" download="EkakshGoyal_Resume.pdf">
                EkakshGoyal_Resume.pdf ↗
              </a>
            </div>
          </div>
          <div className="field">
            <div className="label">LINKEDIN</div>
            <div className="val">
              <a href="https://www.linkedin.com/in/ekakshgoyal" target="_blank" rel="noreferrer">
                /in/ekakshgoyal
              </a>
            </div>
          </div>
          <div className="field">
            <div className="label">GITHUB</div>
            <div className="val">
              <a href="https://github.com/ekaksh0005" target="_blank" rel="noreferrer">
                @ekaksh0005
              </a>
            </div>
          </div>
          <div className="field">
            <div className="label">LOCAL TIME</div>
            <div className="val mono">{clock} IST</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <span>© 2026 · EKAKSH GOYAL</span>
      <div className="social-row">
        <a href="https://www.linkedin.com/in/ekakshgoyal" target="_blank" rel="noreferrer" aria-label="LinkedIn">
          <i className="fab fa-linkedin-in" style={{ fontSize: 10, color: "var(--text-dim)" }} />
        </a>
        <a href="https://github.com/ekaksh0005" target="_blank" rel="noreferrer" aria-label="GitHub">
          <i className="fab fa-github" style={{ fontSize: 10, color: "var(--text-dim)" }} />
        </a>
        <a href="mailto:ekaksh1031@gmail.com" aria-label="Email">
          <i className="fas fa-envelope" style={{ fontSize: 10, color: "var(--text-dim)" }} />
        </a>
      </div>
      <span>NOIDA, UP · INDIA</span>
    </footer>
  );
}

/* =====================================================================
   SECTION 5: APP ENTRY & ROOT RENDER
   ===================================================================== */

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function App() {
  useReveal();
  return (
    <React.Fragment>
      <Nav />
      <Hero />
      <Marquee />
      <Work />
      <HireMe />
      <Research />
      <Education />
      <Certifications />
      <Leadership />
      <About />
      <Contact />
      <Footer />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);