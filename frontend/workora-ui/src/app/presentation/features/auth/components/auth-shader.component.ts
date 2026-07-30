import { Component, ElementRef, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Enterprise Auth Shader Background Component.
 * Renders a WebGL 2D Simplex Noise Liquid Mesh Shader with interactive atmospheric drift orbs.
 */
@Component({
  selector: 'app-auth-shader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[#0d1320]">
      <!-- WebGL Shader Canvas -->
      <canvas #shaderCanvas class="absolute inset-0 w-full h-full block pointer-events-none opacity-80"></canvas>
      
      <!-- Atmospheric Background Glow Orbs -->
      <div #orb1 class="mesh-orb orb-1"></div>
      <div #orb2 class="mesh-orb orb-2"></div>
      <div #orb3 class="mesh-orb orb-3"></div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .mesh-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(90px);
      z-index: 0;
      opacity: 0.35;
      pointer-events: none;
      will-change: transform;
      transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    }

    .orb-1 {
      width: 550px;
      height: 550px;
      background: #4d8eff;
      top: -120px;
      right: -80px;
      animation: drift 22s infinite alternate ease-in-out;
    }

    .orb-2 {
      width: 650px;
      height: 650px;
      background: #b76dff;
      bottom: -180px;
      left: -120px;
      animation: drift 28s infinite alternate-reverse ease-in-out;
    }

    .orb-3 {
      width: 450px;
      height: 450px;
      background: #5de6ff;
      top: 35%;
      left: 25%;
      animation: drift 18s infinite alternate ease-in-out;
    }

    @keyframes drift {
      0% { transform: translate(0, 0) scale(1); }
      50% { transform: translate(50px, 35px) scale(1.1); }
      100% { transform: translate(-30px, -20px) scale(0.95); }
    }
  `]
})
export class AuthShaderComponent implements AfterViewInit, OnDestroy {
  @ViewChild('shaderCanvas', { static: false }) shaderCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('orb1', { static: false }) orb1!: ElementRef<HTMLDivElement>;
  @ViewChild('orb2', { static: false }) orb2!: ElementRef<HTMLDivElement>;
  @ViewChild('orb3', { static: false }) orb3!: ElementRef<HTMLDivElement>;

  private animationFrameId: number | null = null;
  private resizeListener: (() => void) | null = null;
  private mouseListener: ((e: MouseEvent) => void) | null = null;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initShaderCanvas();
      this.initMouseInteractivity();
    }, 50);
  }

  ngOnDestroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
    if (this.mouseListener) {
      window.removeEventListener('mousemove', this.mouseListener);
    }
  }

  /**
   * Initializes WebGL 2D Simplex Noise Liquid Mesh Shader.
   */
  private initShaderCanvas(): void {
    const canvas = this.shaderCanvas?.nativeElement;
    if (!canvas) return;

    const resizeCanvas = () => {
      const w = window.innerWidth || document.documentElement.clientWidth || 1280;
      const h = window.innerHeight || document.documentElement.clientHeight || 720;
      canvas.width = w;
      canvas.height = h;
    };

    resizeCanvas();
    this.resizeListener = resizeCanvas;
    window.addEventListener('resize', this.resizeListener);

    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (!gl) return;

    const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

    const fs = `precision highp float;
varying vec2 v_texCoord;
uniform float u_time;
uniform vec2 u_resolution;

vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m;
  m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
    vec2 uv = v_texCoord;
    float time = u_time * 0.15;
    
    float n1 = snoise(uv * 1.5 + vec2(time * 0.5, time * 0.3));
    float n2 = snoise(uv * 2.0 - vec2(time * 0.4, time * 0.6));
    float n3 = snoise(uv * 1.0 + vec2(sin(time), cos(time)));
    
    vec3 color1 = vec3(0.051, 0.075, 0.125); // Deep Navy #0d1320
    vec3 color2 = vec3(0.302, 0.557, 1.0);   // Primary Blue #4d8eff
    vec3 color3 = vec3(0.718, 0.427, 1.0);   // Tertiary Purple #b76dff
    vec3 color4 = vec3(0.365, 0.902, 1.0);   // Secondary Cyan #5de6ff
    
    vec3 finalColor = color1;
    
    float orb1 = smoothstep(0.2, 0.8, n1);
    float orb2 = smoothstep(0.3, 0.9, n2);
    float orb3 = smoothstep(0.4, 0.7, n3);
    
    finalColor = mix(finalColor, color2, orb1 * 0.35);
    finalColor = mix(finalColor, color3, orb2 * 0.25);
    finalColor = mix(finalColor, color4, orb3 * 0.25);
    
    float dist = distance(uv, vec2(0.5));
    finalColor *= smoothstep(1.5, 0.5, dist);
    
    gl_FragColor = vec4(finalColor, 1.0);
}`;

    const compileShader = (type: number, src: string): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      return shader;
    };

    const vertShader = compileShader(gl.VERTEX_SHADER, vs);
    const fragShader = compileShader(gl.FRAGMENT_SHADER, fs);
    if (!vertShader || !fragShader) return;

    const prog = gl.createProgram();
    if (!prog) return;

    gl.attachShader(prog, vertShader);
    gl.attachShader(prog, fragShader);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');

    const render = (t: number) => {
      if (!gl || !canvas) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      this.animationFrameId = requestAnimationFrame(render);
    };

    this.animationFrameId = requestAnimationFrame(render);
  }

  /**
   * Initializes mouse movement parallax listener for atmospheric background mesh orbs.
   */
  private initMouseInteractivity(): void {
    this.mouseListener = (e: MouseEvent) => {
      const mouseX = (e.clientX / window.innerWidth) - 0.5;
      const mouseY = (e.clientY / window.innerHeight) - 0.5;

      if (this.orb1?.nativeElement) {
        this.orb1.nativeElement.style.transform = `translate(${mouseX * 30}px, ${mouseY * 30}px)`;
      }
      if (this.orb2?.nativeElement) {
        this.orb2.nativeElement.style.transform = `translate(${mouseX * -40}px, ${mouseY * -40}px)`;
      }
      if (this.orb3?.nativeElement) {
        this.orb3.nativeElement.style.transform = `translate(${mouseX * 20}px, ${mouseY * -20}px)`;
      }
    };

    window.addEventListener('mousemove', this.mouseListener);
  }
}
