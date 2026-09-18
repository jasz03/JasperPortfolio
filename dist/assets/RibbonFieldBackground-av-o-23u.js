import{n as e,r as t,t as n}from"./index-ed3lde7v.js";var r=t(e(),1),i=n(),a=`
        attribute vec2 position;
        void main() {
          gl_Position = vec4(position, 0.0, 1.0);
        }
      `,o=`
        precision highp float;
        uniform vec2 resolution;
        uniform float time;
        uniform vec2 pointer;

        float hash(vec2 p) {
          p = fract(p * vec2(123.34, 456.21));
          p += dot(p, p + 45.32);
          return fract(p.x * p.y);
        }

        float ribbon(vec2 uv, float offset, float width, float phase) {
          float y = 0.55 + 0.20 * sin((uv.x * 2.15) + phase) + 0.045 * sin((uv.x * 7.0) - phase * 0.7);
          float d = abs(uv.y - y - offset);
          return exp(-(d * d) / width);
        }

        void main() {
          vec2 uv = gl_FragCoord.xy / resolution.xy;
          vec2 p = uv;
          p.x *= resolution.x / resolution.y;

          float t = time * 0.22;
          float drift = (pointer.x - 0.5) * 0.06;

          float rightFade = smoothstep(0.28, 0.72, uv.x);
          float centerDark = 1.0 - smoothstep(0.0, 0.88, distance(uv, vec2(0.18, 0.48)));

          float r1 = ribbon(vec2(uv.x + drift, uv.y), 0.03, 0.0065, t + 0.9);
          float r2 = ribbon(vec2(uv.x - drift * 0.7, uv.y), -0.23, 0.0085, t + 3.25);
          float r3 = ribbon(vec2(uv.x + drift * 0.4, uv.y), 0.25, 0.014, t + 1.85);

          float glow = r1 * 1.14 + r2 * 1.05 + r3 * 0.48;

          vec3 teal = vec3(0.17, 0.83, 0.75);
          vec3 cyan = vec3(0.22, 0.82, 0.96);
          vec3 indigo = vec3(0.39, 0.38, 0.92);
          vec3 purple = vec3(0.66, 0.33, 0.98);
          vec3 blue = vec3(0.23, 0.51, 0.96);

          vec3 col = vec3(0.0);
          col += cyan * r1 * 0.92;
          col += teal * r1 * 0.62;
          col += indigo * r3 * 0.42;
          col += blue * r2 * 0.66;
          col += purple * (r2 + r3) * 0.30;

          float bloom = exp(-pow(distance(uv, vec2(0.76, 0.40 + 0.035 * sin(t))), 2.0) / 0.050);
          bloom += exp(-pow(distance(uv, vec2(0.71, 0.75 + 0.025 * cos(t))), 2.0) / 0.030);
          col += vec3(0.42, 0.85, 1.0) * bloom * 0.34;

          vec2 grid = fract(gl_FragCoord.xy / 7.0) - 0.5;
          float dotShape = smoothstep(0.29, 0.11, length(grid));
          float noise = hash(floor(gl_FragCoord.xy / 7.0));
          float scan = 0.72 + 0.28 * sin((uv.x + uv.y) * 38.0 + time * 1.3);
          float dots = dotShape * (0.48 + 0.52 * noise) * scan;

          float micro = hash(gl_FragCoord.xy + time) * 0.035;
          float alpha = clamp((glow * 1.55 + bloom * 0.50) * dots * rightFade, 0.0, 1.0);
          alpha *= 1.0 - centerDark * 0.56;

          vec3 base = vec3(0.005, 0.005, 0.005);
          vec3 finalColor = mix(base, col, clamp(alpha * 1.55, 0.0, 1.0));
          finalColor += micro * rightFade;

          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,s={speed:1,pointerAmount:1,smoothing:.035,brightness:1,opacity:1,hue:0,saturation:1};function c(e,t,n){let r=e.createShader(t);if(!r)throw Error(`Unable to create Axiom shader`);if(e.shaderSource(r,n),e.compileShader(r),!e.getShaderParameter(r,e.COMPILE_STATUS))throw Error(e.getShaderInfoLog(r)??`Axiom shader compilation failed`);return r}function l({className:e=``,...t}){let n=(0,r.useRef)(null),l=(0,r.useRef)(null),u=(0,r.useRef)({...s,...t});u.current={...s,...t},(0,r.useEffect)(()=>{let e=n.current,t=l.current;if(!e||!t)return;let r=t.getContext(`webgl`,{alpha:!0,antialias:!1,premultipliedAlpha:!1});if(!r)return;let i=c(r,r.VERTEX_SHADER,a),s=c(r,r.FRAGMENT_SHADER,o),d=r.createProgram();if(!d)return;if(r.attachShader(d,i),r.attachShader(d,s),r.linkProgram(d),!r.getProgramParameter(d,r.LINK_STATUS))throw Error(r.getProgramInfoLog(d)??`Axiom program link failed`);r.useProgram(d);let f=r.createBuffer();r.bindBuffer(r.ARRAY_BUFFER,f),r.bufferData(r.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),r.STATIC_DRAW);let p=r.getAttribLocation(d,`position`);r.enableVertexAttribArray(p),r.vertexAttribPointer(p,2,r.FLOAT,!1,0,0);let m=r.getUniformLocation(d,`resolution`),h=r.getUniformLocation(d,`time`),g=r.getUniformLocation(d,`pointer`),_=.72,v=.42,y=.72,b=.42,x=0,S=!0,C=performance.now(),w=t=>{let n=e.getBoundingClientRect();y=.72+((t.clientX-n.left)/Math.max(n.width,1)-.72)*u.current.pointerAmount,b=.42+(1-(t.clientY-n.top)/Math.max(n.height,1)-.42)*u.current.pointerAmount},T=()=>{let n=e.getBoundingClientRect(),i=Math.min(window.devicePixelRatio||1,2);t.width=Math.max(1,Math.floor(n.width*i)),t.height=Math.max(1,Math.floor(n.height*i)),r.viewport(0,0,t.width,t.height),r.uniform2f(m,t.width,t.height)},E=e=>{let t=u.current;_+=(y-_)*t.smoothing,v+=(b-v)*t.smoothing,r.uniform1f(h,(e-C)*.001*t.speed),r.uniform2f(g,_,v),r.drawArrays(r.TRIANGLES,0,6),x=S&&!document.hidden?requestAnimationFrame(E):0},D=new ResizeObserver(T),O=new IntersectionObserver(([e])=>{S=e?.isIntersecting??!0,S&&!x&&(x=requestAnimationFrame(E)),!S&&x&&(cancelAnimationFrame(x),x=0)});return D.observe(e),O.observe(e),e.addEventListener(`pointermove`,w,{passive:!0}),T(),x=requestAnimationFrame(E),()=>{x&&cancelAnimationFrame(x),D.disconnect(),O.disconnect(),e.removeEventListener(`pointermove`,w),r.deleteBuffer(f),r.deleteShader(i),r.deleteShader(s),r.deleteProgram(d)}},[]);let d=u.current;return(0,i.jsx)(`div`,{ref:n,className:`threeui-background ribbon-field${e?` ${e}`:``}`,children:(0,i.jsx)(`canvas`,{ref:l,style:{opacity:d.opacity,filter:`hue-rotate(${d.hue}deg) saturate(${d.saturation}) brightness(${d.brightness})`}})})}export{l as RibbonFieldBackground};