export default function createSphere(
  radius: number,
  latitudeBands: number,
  longitudeBands: number
) {
  const positions: number[] = [];
  const texCoords: number[] = [];
  const indices: number[] = [];

  for (let latNumber = 0; latNumber <= latitudeBands; latNumber++) {
    const theta = (latNumber * Math.PI) / latitudeBands;
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);

    for (let longNumber = 0; longNumber <= longitudeBands; longNumber++) {
      const phi = (longNumber * 2 * Math.PI) / longitudeBands;
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      const x = cosPhi * sinTheta;
      const y = cosTheta;
      const z = sinPhi * sinTheta;
      const u = 1 - longNumber / longitudeBands;
      const v = 1 - latNumber / latitudeBands;

      positions.push(radius * x, radius * y, radius * z);
      texCoords.push(u, v);
    }
  }

  for (let latNumber = 0; latNumber < latitudeBands; latNumber++) {
    for (let longNumber = 0; longNumber < longitudeBands; longNumber++) {
      const first = latNumber * (longitudeBands + 1) + longNumber;
      const second = first + longitudeBands + 1;

      indices.push(first, second, first + 1);
      indices.push(second, second + 1, first + 1);
    }
  }

  return {
    positions: new Float32Array(positions),
    texCoords: new Float32Array(texCoords),
    indices: new Uint16Array(indices),
  };
}
