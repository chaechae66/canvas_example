export interface ProgramInfo {
  program: WebGLProgram;
  attribLocations: {
    vertexPosition: number;
    textureCoord: number;
  };
  uniformLocations: {
    projectionMatrix: WebGLUniformLocation | null;
    modelViewMatrix: WebGLUniformLocation | null;
    uSampler: WebGLUniformLocation | null;
  };
}

export interface Buffers {
  position: WebGLBuffer | null;
  texCoord: WebGLBuffer | null;
}
