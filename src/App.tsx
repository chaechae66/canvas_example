import React, { useEffect, useRef } from "react";
import { mat4 } from "gl-matrix";

import initShaderProgram from "./library/initShaderProgram";
import initBuffers from "./library/initBuffers";
import loadTexture from "./library/loadTexture";
import drawScene from "./library/drawScene";

const vertexShaderSource = `
attribute vec3 aPosition;
attribute vec2 aTexCoord;
varying vec2 vTexCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

void main() {
    vTexCoord = aTexCoord;
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
}
`;

const fragmentShaderSource = `
precision mediump float;

varying vec2 vTexCoord;
uniform sampler2D uTexture;

void main() {
    gl_FragColor = texture2D(uTexture, vTexCoord);
}
`;

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modelViewMatrixRef = useRef(mat4.create());
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.error("Unable to initialize WebGL.");
      return;
    }

    const shaderProgram = initShaderProgram(
      gl,
      vertexShaderSource,
      fragmentShaderSource
    );
    if (!shaderProgram) return;

    const programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, "aPosition"),
        textureCoord: gl.getAttribLocation(shaderProgram, "aTexCoord"),
      },
      uniformLocations: {
        projectionMatrix: gl.getUniformLocation(
          shaderProgram,
          "uProjectionMatrix"
        ),
        modelViewMatrix: gl.getUniformLocation(
          shaderProgram,
          "uModelViewMatrix"
        ),
        uSampler: gl.getUniformLocation(shaderProgram, "uTexture"),
      },
    };

    const buffers = initBuffers(gl);
    const texture = loadTexture(gl, "/earth.jpeg");

    // Initialize the model view matrix
    mat4.translate(
      modelViewMatrixRef.current,
      modelViewMatrixRef.current,
      [0, 0, -4]
    );

    function render() {
      drawScene(
        gl!,
        programInfo,
        buffers,
        texture!,
        modelViewMatrixRef.current
      );
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }, []);

  const handleMouseDown = (event: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: event.clientX, y: event.clientY };
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDraggingRef.current || !lastMousePosRef.current) return;

    const deltaX = event.clientX - lastMousePosRef.current.x;
    const deltaY = event.clientY - lastMousePosRef.current.y;

    const newMatrix = mat4.clone(modelViewMatrixRef.current);
    mat4.rotate(newMatrix, newMatrix, deltaX * 0.01, [0, 1, 0]);
    mat4.rotate(newMatrix, newMatrix, -deltaY * 0.01, [1, 0, 0]);

    modelViewMatrixRef.current = newMatrix;
    lastMousePosRef.current = { x: event.clientX, y: event.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    lastMousePosRef.current = null;
  };

  const handleWheel = (event: React.WheelEvent) => {
    const newMatrix = mat4.clone(modelViewMatrixRef.current);
    const scaleFactor = event.deltaY > 0 ? 1.1 : 0.9;
    mat4.scale(newMatrix, newMatrix, [scaleFactor, scaleFactor, scaleFactor]);
    modelViewMatrixRef.current = newMatrix;
  };

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
    ></canvas>
  );
};

export default App;
