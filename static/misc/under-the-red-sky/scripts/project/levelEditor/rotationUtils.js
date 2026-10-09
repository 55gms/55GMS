// Rotation order conversion utilities
export class RotationOrderConverter {
  // Convert Euler angles from one rotation order to another
  static convertEulerAngles(eulerAngles, fromOrder, toOrder) {
    if (fromOrder === toOrder) {
      return [...eulerAngles];
    }

    // Convert to rotation matrix first
    const matrix = this.eulerToMatrix(eulerAngles, fromOrder);

    // Then extract Euler angles in the new order
    return this.matrixToEuler(matrix, toOrder);
  }

  // Convert Euler angles to rotation matrix
  static eulerToMatrix(eulerAngles, order) {
    const [rx, ry, rz] = eulerAngles;

    const cosX = Math.cos(rx),
      sinX = Math.sin(rx);
    const cosY = Math.cos(ry),
      sinY = Math.sin(ry);
    const cosZ = Math.cos(rz),
      sinZ = Math.sin(rz);

    // Create individual rotation matrices
    const Rx = [
      [1, 0, 0],
      [0, cosX, -sinX],
      [0, sinX, cosX],
    ];

    const Ry = [
      [cosY, 0, sinY],
      [0, 1, 0],
      [-sinY, 0, cosY],
    ];

    const Rz = [
      [cosZ, -sinZ, 0],
      [sinZ, cosZ, 0],
      [0, 0, 1],
    ];

    // Combine matrices based on rotation order
    switch (order.toLowerCase()) {
      case "xyz":
        return this.multiplyMatrices(this.multiplyMatrices(Rx, Ry), Rz);
      case "xzy":
        return this.multiplyMatrices(this.multiplyMatrices(Rx, Rz), Ry);
      case "yxz":
        return this.multiplyMatrices(this.multiplyMatrices(Ry, Rx), Rz);
      case "yzx":
        return this.multiplyMatrices(this.multiplyMatrices(Ry, Rz), Rx);
      case "zxy":
        return this.multiplyMatrices(this.multiplyMatrices(Rz, Rx), Ry);
      case "zyx":
        return this.multiplyMatrices(this.multiplyMatrices(Rz, Ry), Rx);
      default:
        throw new Error(`Unsupported rotation order: ${order}`);
    }
  }

  // Convert rotation matrix to Euler angles
  static matrixToEuler(matrix, order) {
    const [m11, m12, m13] = matrix[0];
    const [m21, m22, m23] = matrix[1];
    const [m31, m32, m33] = matrix[2];

    let rx, ry, rz;

    switch (order.toLowerCase()) {
      case "xyz":
        ry = Math.asin(Math.max(-1, Math.min(1, m31)));
        if (Math.abs(m31) < 0.99999) {
          rx = Math.atan2(-m32, m33);
          rz = Math.atan2(-m21, m11);
        } else {
          rx = Math.atan2(m23, m22);
          rz = 0;
        }
        break;

      case "xzy":
        rz = Math.asin(-Math.max(-1, Math.min(1, m21)));
        if (Math.abs(m21) < 0.99999) {
          rx = Math.atan2(m23, m22);
          ry = Math.atan2(m31, m11);
        } else {
          rx = Math.atan2(-m32, m33);
          ry = 0;
        }
        break;

      case "yxz":
        rx = Math.asin(-Math.max(-1, Math.min(1, m32)));
        if (Math.abs(m32) < 0.99999) {
          ry = Math.atan2(m31, m33);
          rz = Math.atan2(m12, m22);
        } else {
          ry = Math.atan2(-m13, m11);
          rz = 0;
        }
        break;

      case "yzx":
        rz = Math.asin(Math.max(-1, Math.min(1, m12)));
        if (Math.abs(m12) < 0.99999) {
          ry = Math.atan2(-m13, m11);
          rx = Math.atan2(-m32, m22);
        } else {
          ry = Math.atan2(m31, m33);
          rx = 0;
        }
        break;

      case "zxy":
        rx = Math.asin(Math.max(-1, Math.min(1, m23)));
        if (Math.abs(m23) < 0.99999) {
          rz = Math.atan2(-m21, m22);
          ry = Math.atan2(-m13, m33);
        } else {
          rz = Math.atan2(m12, m11);
          ry = 0;
        }
        break;

      case "zyx":
        ry = Math.asin(-Math.max(-1, Math.min(1, m31)));
        if (Math.abs(m31) < 0.99999) {
          rz = Math.atan2(m21, m11);
          rx = Math.atan2(m32, m33);
        } else {
          rz = Math.atan2(-m12, m22);
          rx = 0;
        }
        break;

      default:
        throw new Error(`Unsupported rotation order: ${order}`);
    }

    return [rx, ry, rz];
  }

  // Helper method to multiply matrices
  static multiplyMatrices(a, b) {
    const result = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        result[i][j] =
          a[i][0] * b[0][j] + a[i][1] * b[1][j] + a[i][2] * b[2][j];
      }
    }

    return result;
  }

  // Convert from ZYX (current) to ZXY (for tags)
  static zyxToZxy(eulerAngles) {
    return this.convertEulerAngles(eulerAngles, "zyx", "zxy");
  }

  // Convert from ZXY (tags) to ZYX (current)
  static zxyToZyx(eulerAngles) {
    return this.convertEulerAngles(eulerAngles, "zxy", "zyx");
  }
}
