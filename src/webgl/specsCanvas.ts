// Interactive 3D Rotating Architectural Wireframe of Samsung Diamond Drum & Inverter Tub
export function initSpecsCanvas(canvas: HTMLCanvasElement | null): () => void {
  if (!canvas) return () => {};
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let angle = 0;
  const targetSpeed = 0.011;
  let hoverBoost = 0;
  let rafId = 0;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.floor(canvas.clientWidth * dpr);
    const h = Math.floor(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
  };

  const onEnter = () => {
    hoverBoost = 0.025;
  };
  const onLeave = () => {
    hoverBoost = 0;
  };

  const parent = canvas.parentElement;
  parent?.addEventListener('pointerenter', onEnter);
  parent?.addEventListener('pointerleave', onLeave);
  window.addEventListener('resize', resize, { passive: true });
  resize();

  // Horizontal cylindrical drum rings (Samsung Diamond Drum depth profile)
  const drumDepthSlices = [
    { z: -0.78, r: 0.72 },
    { z: -0.58, r: 0.76 },
    { z: -0.30, r: 0.76 },
    { z: 0.0, r: 0.76 },
    { z: 0.30, r: 0.76 },
    { z: 0.58, r: 0.72 },
    { z: 0.74, r: 0.56 },
    { z: 0.84, r: 0.52 },
  ];

  const draw = () => {
    resize();
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const strokeMain = isDark
      ? 'rgba(230, 237, 245, 0.24)'
      : 'rgba(15, 23, 38, 0.20)';
    const strokeAccent = isDark
      ? 'rgba(79, 131, 255, 0.88)'
      : 'rgba(20, 40, 160, 0.78)';

    const cx = w * 0.68;
    const cy = h * 0.44;
    const radius = Math.min(w, h) * 0.34;
    const tiltYaw = 0.52;
    const tiltPitch = -0.18;

    if (!prefersReduced) {
      angle += targetSpeed + hoverBoost;
    }

    const project = (x: number, y: number, z: number) => {
      const cosY = Math.cos(tiltYaw);
      const sinY = Math.sin(tiltYaw);
      const x1 = x * cosY + z * sinY;
      const z1 = -x * sinY + z * cosY;

      const cosP = Math.cos(tiltPitch);
      const sinP = Math.sin(tiltPitch);
      const y2 = y * cosP - z1 * sinP;
      return {
        px: cx + x1 * radius,
        py: cy + y2 * radius,
      };
    };

    ctx.lineWidth = Math.max(1.2, w / 440);

    // Drum radial cross-section rings
    for (let i = 0; i < drumDepthSlices.length; i++) {
      const { z, r } = drumDepthSlices[i];
      ctx.beginPath();
      ctx.strokeStyle = i >= 6 ? strokeAccent : strokeMain;
      const steps = 40;
      for (let s = 0; s <= steps; s++) {
        const theta = (s / steps) * Math.PI * 2;
        const pt = project(Math.cos(theta) * r, Math.sin(theta) * r, z);
        if (s === 0) ctx.moveTo(pt.px, pt.py);
        else ctx.lineTo(pt.px, pt.py);
      }
      ctx.stroke();
    }

    // Rotating longitudinal ribs & Diamond Drum baffles
    const ribs = 16;
    for (let m = 0; m < ribs; m++) {
      const theta = angle + (m * Math.PI * 2) / ribs;
      const isBaffle = m % 4 === 0;
      ctx.beginPath();
      ctx.strokeStyle = isBaffle ? strokeAccent : strokeMain;
      for (let i = 0; i < drumDepthSlices.length; i++) {
        const { z, r } = drumDepthSlices[i];
        const pt = project(Math.cos(theta) * r, Math.sin(theta) * r, z);
        if (i === 0) ctx.moveTo(pt.px, pt.py);
        else ctx.lineTo(pt.px, pt.py);
      }
      ctx.stroke();
    }

    if (!prefersReduced) {
      rafId = requestAnimationFrame(draw);
    }
  };

  rafId = requestAnimationFrame(draw);

  return () => {
    cancelAnimationFrame(rafId);
    parent?.removeEventListener('pointerenter', onEnter);
    parent?.removeEventListener('pointerleave', onLeave);
    window.removeEventListener('resize', resize);
  };
}
