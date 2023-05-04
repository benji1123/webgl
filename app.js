// https://youtu.be/kB0ZVUrI4Aw
// https://webglfundamentals.org/webgl/lessons/webgl-shaders-and-glsl.html

const InitDemo = () => {
  console.log("Working!");
  const canvas = document.getElementById("webgl-canvas");

  /** @type {WebGLRenderingContext} */
  const gl = canvas.getContext("webgl");
  gl.clearColor(0.71, 1, 0.808, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const vsGLSL = `
    precision mediump float;
    attribute vec2 vertPosition;
    attribute vec3 vertColor;
    varying vec3 fragColor;
    void main(){
        fragColor = vertColor;
        gl_Position = vec4(vertPosition, 0.0, 1.0);
    }
    `;
  const fsGLSL = `
    precision mediump float;
    varying vec3 fragColor;
    void main() {
        gl_FragColor = vec4(fragColor, 1.0);
    }
    `;

  const vs = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vs, vsGLSL);
  gl.compileShader(vs);
  if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
    console.error("ERROR COMPILING VERTEX SHADER", gl.getShaderInfoLog(vs));
    return;
  }

  const fs = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fs, fsGLSL);
  gl.compileShader(fs);
  if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
    console.error("ERROR COMPILING VERTEX SHADER", gl.getShaderInfoLog(fs));
    return;
  }

  const prg = gl.createProgram();
  gl.attachShader(prg, vs);
  gl.attachShader(prg, fs);
  gl.linkProgram(prg);
  if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) {
    console.error("ERROR LINKING PROGRAM!", gl.getProgramInfoLog(prg));
    return;
  }

  gl.validateProgram(prg);
  if (!gl.getProgramParameter(prg, gl.VALIDATE_STATUS)) {
    console.error("ERROR VALIDATING PROGRAM!", gl.getProgamInfoLog(prg));
    return;
  }

  const triangleVertices = [
    0.0, 0.5, 1.0, 0.0, 0.0, -0.66, -0.5, 0.0, 1.0, 0.0, 0.66, -0.5, 0.0, 0.0,
    1.0,
  ];
  const triangleVertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(triangleVertices),
    gl.STATIC_DRAW
  );

  const posAttrLoc = gl.getAttribLocation(prg, "vertPosition");
  gl.vertexAttribPointer(
    posAttrLoc,
    2,
    gl.FLOAT,
    gl.FALSE,
    5 * Float32Array.BYTES_PER_ELEMENT,
    0
  );
  gl.enableVertexAttribArray(posAttrLoc);

  const colorAttrLoc = gl.getAttribLocation(prg, "vertColor");
  gl.vertexAttribPointer(
    colorAttrLoc,
    3,
    gl.FLOAT,
    gl.FALSE,
    5 * Float32Array.BYTES_PER_ELEMENT,
    2 * Float32Array.BYTES_PER_ELEMENT
  );
  gl.enableVertexAttribArray(colorAttrLoc);

  gl.useProgram(prg);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
};

InitDemo();
