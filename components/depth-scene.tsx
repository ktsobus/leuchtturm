"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";

/**
 * Two painted stills, each paired with a grayscale depth map
 * (white = near, black = far). A fragment shader displaces the
 * image by depth for a fake-3D parallax and sweeps an amber scan
 * band through the depth range, developing the picture as it goes.
 */
export type DepthSceneHandle = {
  /* mutable uniform state, read on every draw */
  uniforms: {
    scanA: number;
    scanB: number;
    mix: number;
    driftY: number;
  };
  render: () => void;
};

type Scene = { image: string; depth: string };

type Props = {
  sceneA: Scene;
  sceneB: Scene;
  /* intrinsic aspect ratio of the artwork (both scenes share it) */
  imageAspect: number;
  label: string;
  className?: string;
};

const VERT = /* glsl */ `#version 300 es
precision highp float;
out vec2 vUv;
void main() {
  // fullscreen triangle
  vec2 pos = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  vUv = pos;
  gl_Position = vec4(pos * 2.0 - 1.0, 0.0, 1.0);
}`;

const FRAG = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;

uniform sampler2D uImgA;
uniform sampler2D uDepthA;
uniform sampler2D uImgB;
uniform sampler2D uDepthB;
uniform vec2 uParallax;
uniform float uScanA;
uniform float uScanB;
uniform float uMix;
uniform vec2 uPlane;
uniform float uImageAspect;

const vec3 BEAM = vec3(0.878, 0.659, 0.282); // #e0a848

vec2 coverUv(vec2 uv) {
  float planeAspect = uPlane.x / uPlane.y;
  vec2 s = vec2(1.0);
  if (planeAspect > uImageAspect) {
    s.y = uImageAspect / planeAspect;
  } else {
    s.x = planeAspect / uImageAspect;
  }
  return (uv - 0.5) * s + 0.5;
}

vec3 scene(sampler2D img, sampler2D dep, float scan, vec2 uv) {
  float d = texture(dep, uv).r;
  vec3 c = texture(img, uv + (d - 0.5) * uParallax).rgb;
  // pixels the scan has not reached yet sit dim and desaturated
  float developed = smoothstep(d - 0.06, d + 0.06, scan);
  float g = dot(c, vec3(0.299, 0.587, 0.114));
  vec3 latent = mix(vec3(g), c, 0.35) * 0.4;
  c = mix(latent, c, developed);
  // amber band where the scan plane intersects the depth field
  float band = 1.0 - smoothstep(0.0, 0.05, abs(d - scan));
  c += BEAM * band * band * 0.75;
  return c;
}

void main() {
  vec2 uv = coverUv(vec2(vUv.x, 1.0 - vUv.y));
  vec3 a = scene(uImgA, uDepthA, uScanA, uv);
  vec3 b = scene(uImgB, uDepthB, uScanB, uv);
  outColor = vec4(mix(a, b, uMix), 1.0);
}`;

function loadTexture(
  gl: WebGL2RenderingContext,
  unit: number,
  src: string,
  onLoad: () => void
) {
  const tex = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, tex);
  // 1px placeholder so the first draws never sample nothing
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGB,
    1,
    1,
    0,
    gl.RGB,
    gl.UNSIGNED_BYTE,
    new Uint8Array([11, 14, 18])
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const img = new Image();
  img.src = src;
  img.onload = () => {
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
    onLoad();
  };
  return tex;
}

export const DepthScene = forwardRef<DepthSceneHandle, Props>(
  function DepthScene({ sceneA, sceneB, imageAspect, label, className }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [failed, setFailed] = useState(false);
    const handleRef = useRef<DepthSceneHandle>({
      uniforms: { scanA: -0.15, scanB: -0.15, mix: 0, driftY: 0 },
      render: () => {},
    });

    useImperativeHandle(ref, () => handleRef.current, []);

    useEffect(() => {
      const canvas = canvasRef.current;
      const gl = canvas?.getContext("webgl2", {
        antialias: false,
        // keeps the buffer readable after compositing; one small quad,
        // redrawn only on scrub or pointer moves, so the cost is nil
        preserveDrawingBuffer: true,
      });
      if (!canvas || !gl) {
        setFailed(true);
        return;
      }

      const compile = (type: number, src: string) => {
        const sh = gl.createShader(type)!;
        gl.shaderSource(sh, src);
        gl.compileShader(sh);
        return sh;
      };
      const prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        setFailed(true);
        return;
      }
      gl.useProgram(prog);

      const loc = (name: string) => gl.getUniformLocation(prog, name);
      gl.uniform1i(loc("uImgA"), 0);
      gl.uniform1i(loc("uDepthA"), 1);
      gl.uniform1i(loc("uImgB"), 2);
      gl.uniform1i(loc("uDepthB"), 3);
      gl.uniform1f(loc("uImageAspect"), imageAspect);
      const uParallax = loc("uParallax");
      const uScanA = loc("uScanA");
      const uScanB = loc("uScanB");
      const uMix = loc("uMix");
      const uPlane = loc("uPlane");

      /* pointer parallax, lerped; scroll drift comes in via uniforms */
      const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
      const finePointer = window.matchMedia("(pointer: fine)").matches;

      const draw = () => {
        const u = handleRef.current.uniforms;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        if (w === 0 || h === 0) return;
        if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
          canvas.width = w * dpr;
          canvas.height = h * dpr;
        }
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(uPlane, w, h);
        gl.uniform2f(
          uParallax,
          pointer.x * 0.014,
          pointer.y * 0.014 + u.driftY
        );
        gl.uniform1f(uScanA, u.scanA);
        gl.uniform1f(uScanB, u.scanB);
        gl.uniform1f(uMix, u.mix);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      };
      handleRef.current.render = draw;

      const textures = [
        loadTexture(gl, 0, sceneA.image, draw),
        loadTexture(gl, 1, sceneA.depth, draw),
        loadTexture(gl, 2, sceneB.image, draw),
        loadTexture(gl, 3, sceneB.depth, draw),
      ];

      const onPointer = (e: PointerEvent) => {
        const r = canvas.getBoundingClientRect();
        pointer.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
        pointer.ty = ((e.clientY - r.top) / r.height) * 2 - 1;
      };
      const tick = () => {
        const dx = pointer.tx - pointer.x;
        const dy = pointer.ty - pointer.y;
        if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) return;
        const r = canvas.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        pointer.x += dx * 0.06;
        pointer.y += dy * 0.06;
        draw();
      };
      if (finePointer) {
        window.addEventListener("pointermove", onPointer);
        gsap.ticker.add(tick);
      }

      const onLost = (e: Event) => {
        e.preventDefault();
        setFailed(true);
      };
      canvas.addEventListener("webglcontextlost", onLost);
      const onResize = () => draw();
      window.addEventListener("resize", onResize);
      draw();

      return () => {
        if (finePointer) {
          window.removeEventListener("pointermove", onPointer);
          gsap.ticker.remove(tick);
        }
        canvas.removeEventListener("webglcontextlost", onLost);
        window.removeEventListener("resize", onResize);
        handleRef.current.render = () => {};
        textures.forEach((t) => gl.deleteTexture(t));
        gl.deleteProgram(prog);
      };
    }, [sceneA, sceneB, imageAspect]);

    if (failed) {
      return (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={sceneA.image}
          alt={label}
          className={`${className ?? ""} object-cover`}
        />
      );
    }
    return (
      <canvas
        ref={canvasRef}
        className={className}
        role="img"
        aria-label={label}
      />
    );
  }
);
