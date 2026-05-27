import { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = { src: string; className?: string };

/**
 * Interstellar-inspired black hole environment with the profile picture
 * floating just outside the photon sphere. Implemented as a single
 * full-quad fragment shader: stars + accretion disk + lensed portrait.
 */
export default function BlackHolePortrait({ src, className }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 1);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const portraitTex = new THREE.TextureLoader().load(src, (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.wrapS = THREE.ClampToEdgeWrapping;
      t.wrapT = THREE.ClampToEdgeWrapping;
      t.minFilter = THREE.LinearFilter;
      t.magFilter = THREE.LinearFilter;
    });

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uPortrait: { value: portraitTex },
      uMouse: { value: new THREE.Vector2(0.0, 0.0) },
      uMouseTarget: { value: new THREE.Vector2(0.0, 0.0) },
    };

    const vert = /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const frag = /* glsl */ `
      precision highp float;
      varying vec2 vUv;
      uniform float uTime;
      uniform vec2  uResolution;
      uniform vec2  uMouse;
      uniform sampler2D uPortrait;

      // --- hash / noise ---
      float hash(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      vec3 starField(vec2 uv) {
        vec3 col = vec3(0.0);
        // Multi-layer parallax stars
        for (int i = 0; i < 3; i++) {
          float fi = float(i);
          float scale = 80.0 + fi * 90.0;
          vec2 g = uv * scale;
          vec2 id = floor(g);
          vec2 f = fract(g) - 0.5;
          float h = hash(id + fi * 13.1);
          float size = smoothstep(0.985, 1.0, h);
          if (size > 0.0) {
            float d = length(f);
            float star = smoothstep(0.05 * (1.0 + h), 0.0, d);
            float twinkle = 0.6 + 0.4 * sin(uTime * (1.5 + h * 4.0) + h * 30.0);
            vec3 tint = mix(vec3(0.7, 0.8, 1.0), vec3(1.0, 0.9, 0.7), h);
            col += star * twinkle * tint * (0.6 + 0.4 * size);
          }
        }
        // Faint nebula wash
        float n = hash(floor(uv * 4.0));
        col += vec3(0.02, 0.01, 0.05) * (0.5 + n);
        return col;
      }

      // Procedural accretion disk color (radius r in disk-plane)
      vec3 diskColor(float r, float ang, float t) {
        // Hot inner -> cool outer
        float inner = 0.28;
        float outer = 0.95;
        float rim = smoothstep(inner, inner + 0.05, r) * (1.0 - smoothstep(outer - 0.15, outer, r));
        // Spiral filaments
        float spiral = 0.5 + 0.5 * sin(ang * 6.0 + r * 25.0 - t * 1.2);
        float fil = pow(spiral, 3.0);
        // Turbulent bands
        float bands = 0.5 + 0.5 * sin(r * 60.0 - t * 2.5 + sin(ang * 3.0 + t) * 2.0);
        float intensity = rim * (0.55 + 0.45 * fil) * (0.7 + 0.3 * bands);
        // Color: blue-white hot near center -> orange outer
        vec3 hot   = vec3(1.4, 1.2, 1.0);
        vec3 mid   = vec3(1.5, 0.7, 0.25);
        vec3 cool  = vec3(0.9, 0.3, 0.1);
        float k = smoothstep(inner, outer, r);
        vec3 c = mix(hot, mid, smoothstep(0.0, 0.45, k));
        c = mix(c, cool, smoothstep(0.5, 1.0, k));
        // Doppler shift: side rotating toward viewer brighter & bluer
        float doppler = sin(ang + t * 0.8);
        c *= 1.0 + 0.6 * doppler;
        c += vec3(-0.25, 0.0, 0.4) * doppler; // blue/red shift
        c = max(c, 0.0);
        return c * intensity * 2.2;
      }

      void main() {
        vec2 res = uResolution;
        vec2 p = (vUv * res - 0.5 * res) / min(res.x, res.y);
        // Mouse shifts the BH slightly (perspective parallax)
        vec2 bh = vec2(0.05, -0.08) + uMouse * 0.12;
        vec2 d = p - bh;
        float r = length(d);
        float ang = atan(d.y, d.x);

        // --- Gravitational lensing deflection on background ---
        // Schwarzschild-ish: deflection ~ Rs / r
        float Rs = 0.085;                          // event horizon radius
        float photon = Rs * 1.5;                   // photon sphere
        float deflect = Rs / max(r, 1e-3);
        vec2 lensDir = normalize(d);
        vec2 lensedUv = vUv - lensDir * deflect * 0.18;

        // Background stars (lensed)
        vec3 col = starField(lensedUv);

        // --- Accretion disk (thin, tilted) ---
        // Project onto disk plane (slight tilt around x-axis)
        float tilt = 0.55;
        float y2 = d.y / max(0.0001, cos(tilt));
        float diskR = sqrt(d.x * d.x + y2 * y2);
        float diskAng = atan(y2, d.x);
        // Disk thickness modulated by lensing (front of disk visible, back wraps over top)
        float diskMask = smoothstep(0.02, 0.0, abs(d.y - sin(diskAng) * diskR * 0.0) - 0.012);
        // Front portion
        float front = smoothstep(Rs * 1.05, 1.2, diskR) * (1.0 - smoothstep(1.1, 1.4, diskR));
        // "Back" of disk lensed up & down around the hole
        float top = smoothstep(0.0, 1.0, 1.0 - abs(d.y - (Rs * 0.55)) / 0.04) * step(diskR, 0.55);
        float bot = smoothstep(0.0, 1.0, 1.0 - abs(d.y + (Rs * 0.55)) / 0.04) * step(diskR, 0.55);
        vec3 disk = diskColor(diskR, diskAng, uTime);
        col += disk * (diskMask * front + top * 1.2 + bot * 0.9);

        // --- Photon ring / Einstein ring ---
        float ring = exp(-pow((r - photon) / 0.012, 2.0));
        col += vec3(1.5, 1.2, 0.9) * ring * 1.4;

        // --- Event horizon shadow ---
        float horizon = smoothstep(Rs + 0.005, Rs - 0.005, r);
        col = mix(col, vec3(0.0), horizon);

        // --- Profile portrait floating outside photon sphere ---
        // Centered upper-right of BH
        vec2 portraitCenter = bh + vec2(0.18, 0.22);
        float portraitR = 0.28;
        vec2 pd = p - portraitCenter;
        // Apply radial lensing pull toward BH onto sample coords
        vec2 toBH = portraitCenter - bh;
        float distBH = length(toBH);
        vec2 pullDir = normalize(toBH); // pulls *away* from BH visually we invert
        // Stretch the portrait toward the BH (radial distortion)
        float radial = dot(pd, -pullDir);
        float warp = smoothstep(portraitR, 0.0, length(pd)) * 0.25 / max(distBH, 0.1);
        vec2 sampleOffset = pd + (-pullDir) * radial * warp;
        // Convert to UV in [0,1] over portrait quad
        vec2 puv = sampleOffset / (portraitR * 1.8) + 0.5;
        // Soft circular mask (slightly oval & distorted)
        float ovalR = portraitR * (1.0 + 0.05 * sin(uTime * 0.6));
        float edge = length(pd / vec2(ovalR, ovalR * 0.95));
        // Edge gets pulled toward BH (drip)
        float drip = smoothstep(0.7, 1.0, edge) * 0.08;
        puv += (-pullDir) * drip;
        float mask = smoothstep(1.0, 0.92, edge);

        if (mask > 0.0 && puv.x > 0.0 && puv.x < 1.0 && puv.y > 0.0 && puv.y < 1.0) {
          vec3 portrait = texture2D(uPortrait, vec2(puv.x, 1.0 - puv.y)).rgb;
          // Doppler-style tint across portrait based on disk rotation direction
          float side = dot(normalize(pd + 1e-4), vec2(cos(uTime * 0.3), sin(uTime * 0.3)));
          portrait *= 1.0 + 0.18 * side;
          portrait += vec3(-0.08, 0.0, 0.12) * side; // blue approaching / red receding
          // Edge light cast from accretion disk
          float rim = smoothstep(0.85, 1.0, edge);
          vec3 rimLight = vec3(1.4, 0.7, 0.25) * rim * 1.2;
          portrait += rimLight;
          // Soft glow halo around portrait
          float halo = smoothstep(1.2, 0.95, edge) * (1.0 - mask);
          col = mix(col, portrait, mask);
          col += vec3(0.3, 0.5, 1.0) * halo * 0.15;
        }

        // Subtle vignette
        float vig = smoothstep(1.4, 0.4, length(p));
        col *= 0.5 + 0.5 * vig;

        // Tone map
        col = col / (1.0 + col);
        col = pow(col, vec3(1.0 / 2.2));

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      uniforms,
    });
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(quad);

    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h, false);
      uniforms.uResolution.value.set(w, h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    const onMove = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      uniforms.uMouseTarget.value.set(x, y);
    };
    window.addEventListener("pointermove", onMove);

    let raf = 0;
    const start = performance.now();
    const tick = () => {
      const t = (performance.now() - start) / 1000;
      uniforms.uTime.value = t;
      // Smoothly chase mouse
      uniforms.uMouse.value.lerp(uniforms.uMouseTarget.value, 0.06);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      renderer.dispose();
      material.dispose();
      quad.geometry.dispose();
      portraitTex.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [src]);

  return <div ref={mountRef} className={className} />;
}
