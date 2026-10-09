// Import raycast functions for 3D mouse interaction
import { castRay, screenToWorldRay } from "./raycast.js";
import { createGizmoMeshBatcher } from "./gizmoMeshBatcher.js";
import { PICK_MAX_DISTANCE } from "./globalValues.js";

export class GizmoRenderer {
  constructor(renderer) {
    // All draw calls go through a per-color mesh batcher. GizmoManager.renderAll
    // brackets begin/flush around each layer so draws are batched per layer.
    this.renderer = createGizmoMeshBatcher(renderer);
    this.defaultColor = [1, 1, 1, 1]; // White
    this.defaultLineWidth = 2;

    // line3D is drawn as a camera-facing billboard by default; use the "tube3D"
    // gizmo type for the legacy box tube. cameraPos is set by
    // GizmoManager.renderAll each frame so billboards can face the camera.
    this.cameraPos = null;
    this._bbPos = new Float32Array(12);
    this._bbUV = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);
    this._bbIdx = new Uint16Array([0, 1, 2, 0, 2, 3]);
  }

  // Utility methods
  pushState() {
    this.renderer.pushLineWidth(this.defaultLineWidth);
  }

  popState() {
    this.renderer.popLineWidth();
  }

  setGizmoColor(r, g, b, a = 1) {
    this.renderer.setColorRgba(r, g, b, a);
  }

  resetGizmoColor() {
    this.renderer.resetColor();
  }

  // 2D Line
  drawLine2D(x1, y1, x2, y2, color = null, lineWidth = null) {
    this.pushState();
    if (lineWidth) this.renderer.pushLineWidth(lineWidth);
    if (color) this.setGizmoColor(color[0], color[1], color[2], color[3]);

    this.renderer.setColorFillMode();

    this.renderer.line(x1, y1, x2, y2);

    if (color) this.resetGizmoColor();
    if (lineWidth) this.renderer.popLineWidth();
    this.popState();
  }

  _oldDrawLine3D(x1, y1, z1, x2, y2, z2, color = null, thickness = 2) {
    if (color) this.setGizmoColor(color[0], color[1], color[2], color[3]);

    // Calculate direction vector
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dz = z2 - z1;
    const length = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (length > 0) {
      const halfThickness = thickness * 0.5;
      this.renderer.setColorFillMode();

      // Normalize direction vector
      const dirX = dx / length;
      const dirY = dy / length;
      const dirZ = dz / length;

      // Find two perpendicular vectors to the direction
      let perpX1, perpY1, perpZ1;
      let perpX2, perpY2, perpZ2;

      // Choose a vector that's not parallel to direction
      if (Math.abs(dirX) < 0.9) {
        // Cross product with X axis
        perpX1 = 0;
        perpY1 = dirZ;
        perpZ1 = -dirY;
      } else {
        // Cross product with Y axis
        perpX1 = dirZ;
        perpY1 = 0;
        perpZ1 = -dirX;
      }

      // Normalize first perpendicular vector
      const perpLen1 = Math.sqrt(
        perpX1 * perpX1 + perpY1 * perpY1 + perpZ1 * perpZ1
      );
      perpX1 /= perpLen1;
      perpY1 /= perpLen1;
      perpZ1 /= perpLen1;

      // Second perpendicular vector = direction × first perpendicular
      perpX2 = dirY * perpZ1 - dirZ * perpY1;
      perpY2 = dirZ * perpX1 - dirX * perpZ1;
      perpZ2 = dirX * perpY1 - dirY * perpX1;

      // Scale perpendicular vectors by half thickness
      perpX1 *= halfThickness;
      perpY1 *= halfThickness;
      perpZ1 *= halfThickness;
      perpX2 *= halfThickness;
      perpY2 *= halfThickness;
      perpZ2 *= halfThickness;

      // Calculate 8 corners of the box
      const corners = [
        // Back face (at start point)
        [x1 - perpX1 - perpX2, y1 - perpY1 - perpY2, z1 - perpZ1 - perpZ2], // 0
        [x1 + perpX1 - perpX2, y1 + perpY1 - perpY2, z1 + perpZ1 - perpZ2], // 1
        [x1 + perpX1 + perpX2, y1 + perpY1 + perpY2, z1 + perpZ1 + perpZ2], // 2
        [x1 - perpX1 + perpX2, y1 - perpY1 + perpY2, z1 - perpZ1 + perpZ2], // 3
        // Front face (at end point)
        [x2 - perpX1 - perpX2, y2 - perpY1 - perpY2, z2 - perpZ1 - perpZ2], // 4
        [x2 + perpX1 - perpX2, y2 + perpY1 - perpY2, z2 + perpZ1 - perpZ2], // 5
        [x2 + perpX1 + perpX2, y2 + perpY1 + perpY2, z2 + perpZ1 + perpZ2], // 6
        [x2 - perpX1 + perpX2, y2 - perpY1 + perpY2, z2 - perpZ1 + perpZ2], // 7
      ];

      // Draw 6 faces of the box
      const faces = [
        [0, 1, 2, 3], // Back face
        [5, 4, 7, 6], // Front face
        [4, 0, 3, 7], // Left face
        [1, 5, 6, 2], // Right face
        [3, 2, 6, 7], // Top face
        [4, 5, 1, 0], // Bottom face
      ];

      faces.forEach((face) => {
        this.renderer.quad3D(
          corners[face[0]][0],
          corners[face[0]][1],
          corners[face[0]][2],
          corners[face[1]][0],
          corners[face[1]][1],
          corners[face[1]][2],
          corners[face[2]][0],
          corners[face[2]][1],
          corners[face[2]][2],
          corners[face[3]][0],
          corners[face[3]][1],
          corners[face[3]][2],
          { left: 0, top: 0, right: 0, bottom: 0 }
        );
      });
    }

    if (color) this.resetGizmoColor();
  }
  // line3D: camera-facing billboard (2 triangles). Width is scaled by 4/pi, the
  // orbit-average of the legacy square tube's silhouette width, so a billboard
  // reads at the same apparent thickness as a "tube3D" for the same config value.
  drawLine3D(x1, y1, z1, x2, y2, z2, color = null, thickness = 2) {
    if (color) this.setGizmoColor(color[0], color[1], color[2], color[3]);

    const dx = x2 - x1;
    const dy = y2 - y1;
    const dz = z2 - z1;
    const length = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (length > 0) {
      const halfThickness = thickness * 0.5 * (4 / Math.PI);
      this.renderer.setColorFillMode();

      const dirX = dx / length;
      const dirY = dy / length;
      const dirZ = dz / length;

      // View direction: segment midpoint -> camera (fallback +Z if no camera).
      const mx = (x1 + x2) * 0.5;
      const my = (y1 + y2) * 0.5;
      const mz = (z1 + z2) * 0.5;
      let vx, vy, vz;
      if (this.cameraPos) {
        vx = this.cameraPos[0] - mx;
        vy = this.cameraPos[1] - my;
        vz = this.cameraPos[2] - mz;
      } else {
        vx = 0;
        vy = 0;
        vz = 1;
      }
      const vlen = Math.sqrt(vx * vx + vy * vy + vz * vz) || 1;
      vx /= vlen;
      vy /= vlen;
      vz /= vlen;

      // Width axis = dir × view (perpendicular to both → faces the camera).
      let px = dirY * vz - dirZ * vy;
      let py = dirZ * vx - dirX * vz;
      let pz = dirX * vy - dirY * vx;
      let plen = Math.sqrt(px * px + py * py + pz * pz);
      if (plen < 1e-6) {
        if (Math.abs(dirX) < 0.9) {
          px = 0;
          py = dirZ;
          pz = -dirY;
        } else {
          px = dirZ;
          py = 0;
          pz = -dirX;
        }
        plen = Math.sqrt(px * px + py * py + pz * pz) || 1;
      }
      const s = halfThickness / plen;
      px *= s;
      py *= s;
      pz *= s;

      const p = this._bbPos;
      p[0] = x1 - px; p[1] = y1 - py; p[2] = z1 - pz;
      p[3] = x1 + px; p[4] = y1 + py; p[5] = z1 + pz;
      p[6] = x2 + px; p[7] = y2 + py; p[8] = z2 + pz;
      p[9] = x2 - px; p[10] = y2 - py; p[11] = z2 - pz;

      this.renderer.drawMesh(this._bbPos, this._bbUV, this._bbIdx);
    }

    if (color) this.resetGizmoColor();
  }

  // tube3D: the legacy thick 3D line as an 8-vertex box tube (one drawMesh).
  drawTube3D(x1, y1, z1, x2, y2, z2, color = null, thickness = 2) {
    if (color) this.setGizmoColor(color[0], color[1], color[2], color[3]);

    // Calculate direction vector
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dz = z2 - z1;
    const length = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (length > 0) {
      const halfThickness = thickness * 0.5;
      this.renderer.setColorFillMode();

      // Normalize direction vector
      const dirX = dx / length;
      const dirY = dy / length;
      const dirZ = dz / length;

      // Find two perpendicular vectors to the direction
      let perpX1, perpY1, perpZ1;
      let perpX2, perpY2, perpZ2;

      // Choose a vector that's not parallel to direction
      if (Math.abs(dirX) < 0.9) {
        // Cross product with X axis
        perpX1 = 0;
        perpY1 = dirZ;
        perpZ1 = -dirY;
      } else {
        // Cross product with Y axis
        perpX1 = dirZ;
        perpY1 = 0;
        perpZ1 = -dirX;
      }

      // Normalize first perpendicular vector
      const perpLen1 = Math.sqrt(
        perpX1 * perpX1 + perpY1 * perpY1 + perpZ1 * perpZ1
      );
      perpX1 /= perpLen1;
      perpY1 /= perpLen1;
      perpZ1 /= perpLen1;

      // Second perpendicular vector = direction × first perpendicular
      perpX2 = dirY * perpZ1 - dirZ * perpY1;
      perpY2 = dirZ * perpX1 - dirX * perpZ1;
      perpZ2 = dirX * perpY1 - dirY * perpX1;

      // Scale perpendicular vectors by half thickness
      perpX1 *= halfThickness;
      perpY1 *= halfThickness;
      perpZ1 *= halfThickness;
      perpX2 *= halfThickness;
      perpY2 *= halfThickness;
      perpZ2 *= halfThickness;

      // Calculate 8 corners of the box
      const corners = [
        // Back face (at start point)
        [x1 - perpX1 - perpX2, y1 - perpY1 - perpY2, z1 - perpZ1 - perpZ2], // 0
        [x1 + perpX1 - perpX2, y1 + perpY1 - perpY2, z1 + perpZ1 - perpZ2], // 1
        [x1 + perpX1 + perpX2, y1 + perpY1 + perpY2, z1 + perpZ1 + perpZ2], // 2
        [x1 - perpX1 + perpX2, y1 - perpY1 + perpY2, z1 - perpZ1 + perpZ2], // 3
        // Front face (at end point)
        [x2 - perpX1 - perpX2, y2 - perpY1 - perpY2, z2 - perpZ1 - perpZ2], // 4
        [x2 + perpX1 - perpX2, y2 + perpY1 - perpY2, z2 + perpZ1 - perpZ2], // 5
        [x2 + perpX1 + perpX2, y2 + perpY1 + perpY2, z2 + perpZ1 + perpZ2], // 6
        [x2 - perpX1 + perpX2, y2 - perpY1 + perpY2, z2 - perpZ1 + perpZ2], // 7
      ];

      // Create position array (8 vertices × 3 coordinates = 24 floats)
      const posArr = new Float32Array(24);
      for (let i = 0; i < 8; i++) {
        posArr[i * 3] = corners[i][0]; // x
        posArr[i * 3 + 1] = corners[i][1]; // y
        posArr[i * 3 + 2] = corners[i][2]; // z
      }

      // Create UV array (8 vertices × 2 coordinates = 16 floats)
      // Simple UV mapping - you can customize this if needed
      const uvArr = new Float32Array([
        0,
        0, // vertex 0
        1,
        0, // vertex 1
        1,
        1, // vertex 2
        0,
        1, // vertex 3
        0,
        0, // vertex 4
        1,
        0, // vertex 5
        1,
        1, // vertex 6
        0,
        1, // vertex 7
      ]);

      // Create index array (6 faces × 2 triangles × 3 indices = 36 indices)
      const indexArr = new Uint16Array([
        // Back face (0, 1, 2, 3)
        0, 1, 2, 0, 2, 3,
        // Front face (5, 4, 7, 6)
        5, 4, 7, 5, 7, 6,
        // Left face (4, 0, 3, 7)
        4, 0, 3, 4, 3, 7,
        // Right face (1, 5, 6, 2)
        1, 5, 6, 1, 6, 2,
        // Top face (3, 2, 6, 7)
        3, 2, 6, 3, 6, 7,
        // Bottom face (4, 5, 1, 0)
        4, 5, 1, 4, 1, 0,
      ]);

      // Draw the entire line mesh in a single call
      this.renderer.drawMesh(posArr, uvArr, indexArr);
    }

    if (color) this.resetGizmoColor();
  }

  // 2D Plane (Rectangle)
  drawPlane2D(
    x,
    y,
    z,
    width,
    height,
    filled = true,
    color = null,
    lineWidth = null
  ) {
    this.pushState();
    this.renderer.setColorFillMode();

    if (lineWidth) this.renderer.pushLineWidth(lineWidth);
    if (color) this.setGizmoColor(color[0], color[1], color[2], color[3]);

    const currentZ = this.renderer.getCurrentZ() ?? 0;
    this.renderer.setCurrentZ(z);

    if (filled) {
      this.renderer.rect2(x, y, x + width, y + height);
    } else {
      this.renderer.lineRect(x, y, x + width, y + height);
    }

    if (color) this.resetGizmoColor();
    if (lineWidth) this.renderer.popLineWidth();
    this.popState();
    this.renderer.setCurrentZ(currentZ);
  }

  // 3D Plane
  drawPlane3D(
    x,
    y,
    z,
    width,
    height,
    filled = true,
    color = null,
    angleX = 0,
    angleY = 0,
    angleZ = 0
  ) {
    if (color) this.setGizmoColor(color[0], color[1], color[2], color[3]);

    const halfW = width * 0.5;
    const halfH = height * 0.5;

    // Convert Euler angles to quaternion (gimbal-lock free)
    const quaternion = this.eulerToQuaternion(angleX, angleY, angleZ);
    const normalizedQuaternion = this.normalizeQuaternion(quaternion);

    // Helper function to apply quaternion rotation to points
    const rotatePoint = (px, py, pz) => {
      const rotatedPoint = this.rotatePointByQuaternion(
        [px, py, pz],
        normalizedQuaternion
      );
      return [x + rotatedPoint[0], y + rotatedPoint[1], z + rotatedPoint[2]];
    };

    // Calculate the four corners of the plane
    const corners = [
      rotatePoint(-halfW, -halfH, 0), // Bottom-left
      rotatePoint(halfW, -halfH, 0), // Bottom-right
      rotatePoint(halfW, halfH, 0), // Top-right
      rotatePoint(-halfW, halfH, 0), // Top-left
    ];

    if (filled) {
      this.renderer.setColorFillMode();
      this.renderer.quad3D(
        corners[0][0],
        corners[0][1],
        corners[0][2],
        corners[1][0],
        corners[1][1],
        corners[1][2],
        corners[2][0],
        corners[2][1],
        corners[2][2],
        corners[3][0],
        corners[3][1],
        corners[3][2],
        { left: 0, top: 0, right: 1, bottom: 1 }
      );
    } else {
      // Draw outline using lines
      this.drawLine3D(
        corners[0][0],
        corners[0][1],
        corners[0][2],
        corners[1][0],
        corners[1][1],
        corners[1][2],
        color
      );
      this.drawLine3D(
        corners[1][0],
        corners[1][1],
        corners[1][2],
        corners[2][0],
        corners[2][1],
        corners[2][2],
        color
      );
      this.drawLine3D(
        corners[2][0],
        corners[2][1],
        corners[2][2],
        corners[3][0],
        corners[3][1],
        corners[3][2],
        color
      );
      this.drawLine3D(
        corners[3][0],
        corners[3][1],
        corners[3][2],
        corners[0][0],
        corners[0][1],
        corners[0][2],
        color
      );
    }

    if (color) this.resetGizmoColor();
  }

  // Quaternion utility functions for gimbal-lock-free rotation
  // Quaternion format: [x, y, z, w] where w is the scalar component

  // Create quaternion from Euler angles (ZYX order)
  eulerToQuaternion(angleX, angleY, angleZ) {
    const cx = Math.cos(angleX * 0.5);
    const sx = Math.sin(angleX * 0.5);
    const cy = Math.cos(angleY * 0.5);
    const sy = Math.sin(angleY * 0.5);
    const cz = Math.cos(angleZ * 0.5);
    const sz = Math.sin(angleZ * 0.5);

    // ZYX order: first Z, then Y, then X
    const qw = cx * cy * cz + sx * sy * sz;
    const qx = sx * cy * cz - cx * sy * sz;
    const qy = cx * sy * cz + sx * cy * sz;
    const qz = cx * cy * sz - sx * sy * cz;

    return [qx, qy, qz, qw];
  }

  // Multiply two quaternions
  multiplyQuaternions(q1, q2) {
    const [x1, y1, z1, w1] = q1;
    const [x2, y2, z2, w2] = q2;

    return [
      w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2,
      w1 * y2 - x1 * z2 + y1 * w2 + z1 * x2,
      w1 * z2 + x1 * y2 - y1 * x2 + z1 * w2,
      w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2,
    ];
  }

  // Normalize a quaternion
  normalizeQuaternion(q) {
    const [x, y, z, w] = q;
    const length = Math.sqrt(x * x + y * y + z * z + w * w);

    if (length < 0.0001) {
      return [0, 0, 0, 1]; // Identity quaternion
    }

    return [x / length, y / length, z / length, w / length];
  }

  // Rotate a 3D point by a quaternion
  rotatePointByQuaternion(point, quaternion) {
    const [px, py, pz] = point;
    const [qx, qy, qz, qw] = quaternion;

    // Convert point to quaternion [px, py, pz, 0]
    // Multiply q * point * q_conjugate

    // First multiply: q * point
    const temp_x = qw * px + qy * pz - qz * py;
    const temp_y = qw * py + qz * px - qx * pz;
    const temp_z = qw * pz + qx * py - qy * px;
    const temp_w = -qx * px - qy * py - qz * pz;

    // Second multiply: result * q_conjugate
    const result_x = temp_w * -qx + temp_x * qw + temp_y * -qz - temp_z * -qy;
    const result_y = temp_w * -qy - temp_x * -qz + temp_y * qw + temp_z * -qx;
    const result_z = temp_w * -qz + temp_x * -qy - temp_y * -qx + temp_z * qw;

    return [result_x, result_y, result_z];
  }

  // 2D Box
  drawBox2D(
    x,
    y,
    width,
    height,
    filled = true,
    color = null,
    lineWidth = null
  ) {
    this.drawPlane2D(x, y, 0, width, height, filled, color, lineWidth);
  }

  // 3D Box (Wireframe or filled)
  drawBox3D(
    x,
    y,
    z,
    width,
    height,
    depth,
    filled = true,
    color = null,
    lineWidth = 2
  ) {
    if (color) this.setGizmoColor(color[0], color[1], color[2], color[3]);

    const halfW = width * 0.5;
    const halfH = height * 0.5;
    const halfD = depth * 0.5;

    if (filled) {
      this.renderer.setColorFillMode();

      // Front face
      this.renderer.quad3D(
        x - halfW,
        y - halfH,
        z + halfD,
        x + halfW,
        y - halfH,
        z + halfD,
        x + halfW,
        y + halfH,
        z + halfD,
        x - halfW,
        y + halfH,
        z + halfD,
        { left: 0, top: 0, right: 1, bottom: 1 }
      );

      // Back face
      this.renderer.quad3D(
        x + halfW,
        y - halfH,
        z - halfD,
        x - halfW,
        y - halfH,
        z - halfD,
        x - halfW,
        y + halfH,
        z - halfD,
        x + halfW,
        y + halfH,
        z - halfD,
        { left: 0, top: 0, right: 1, bottom: 1 }
      );

      // Left face
      this.renderer.quad3D(
        x - halfW,
        y - halfH,
        z - halfD,
        x - halfW,
        y - halfH,
        z + halfD,
        x - halfW,
        y + halfH,
        z + halfD,
        x - halfW,
        y + halfH,
        z - halfD,
        { left: 0, top: 0, right: 1, bottom: 1 }
      );

      // Right face
      this.renderer.quad3D(
        x + halfW,
        y - halfH,
        z + halfD,
        x + halfW,
        y - halfH,
        z - halfD,
        x + halfW,
        y + halfH,
        z - halfD,
        x + halfW,
        y + halfH,
        z + halfD,
        { left: 0, top: 0, right: 1, bottom: 1 }
      );

      // Top face
      this.renderer.quad3D(
        x - halfW,
        y + halfH,
        z + halfD,
        x + halfW,
        y + halfH,
        z + halfD,
        x + halfW,
        y + halfH,
        z - halfD,
        x - halfW,
        y + halfH,
        z - halfD,
        { left: 0, top: 0, right: 1, bottom: 1 }
      );

      // Bottom face
      this.renderer.quad3D(
        x - halfW,
        y - halfH,
        z - halfD,
        x + halfW,
        y - halfH,
        z - halfD,
        x + halfW,
        y - halfH,
        z + halfD,
        x - halfW,
        y - halfH,
        z + halfD,
        { left: 0, top: 0, right: 1, bottom: 1 }
      );
    } else {
      // Draw wireframe box using lines - all 12 edges of a cube
      // Define the 8 vertices of the cube
      const vertices = [
        [x - halfW, y - halfH, z - halfD], // 0: bottom-left-back
        [x + halfW, y - halfH, z - halfD], // 1: bottom-right-back
        [x + halfW, y - halfH, z + halfD], // 2: bottom-right-front
        [x - halfW, y - halfH, z + halfD], // 3: bottom-left-front
        [x - halfW, y + halfH, z - halfD], // 4: top-left-back
        [x + halfW, y + halfH, z - halfD], // 5: top-right-back
        [x + halfW, y + halfH, z + halfD], // 6: top-right-front
        [x - halfW, y + halfH, z + halfD], // 7: top-left-front
      ];

      // Bottom face edges (4 edges)
      this.drawLine3D(
        vertices[0][0],
        vertices[0][1],
        vertices[0][2],
        vertices[1][0],
        vertices[1][1],
        vertices[1][2],
        color,
        lineWidth
      );
      this.drawLine3D(
        vertices[1][0],
        vertices[1][1],
        vertices[1][2],
        vertices[2][0],
        vertices[2][1],
        vertices[2][2],
        color,
        lineWidth
      );
      this.drawLine3D(
        vertices[2][0],
        vertices[2][1],
        vertices[2][2],
        vertices[3][0],
        vertices[3][1],
        vertices[3][2],
        color,
        lineWidth
      );
      this.drawLine3D(
        vertices[3][0],
        vertices[3][1],
        vertices[3][2],
        vertices[0][0],
        vertices[0][1],
        vertices[0][2],
        color,
        lineWidth
      );

      // Top face edges (4 edges)
      this.drawLine3D(
        vertices[4][0],
        vertices[4][1],
        vertices[4][2],
        vertices[5][0],
        vertices[5][1],
        vertices[5][2],
        color,
        lineWidth
      );
      this.drawLine3D(
        vertices[5][0],
        vertices[5][1],
        vertices[5][2],
        vertices[6][0],
        vertices[6][1],
        vertices[6][2],
        color,
        lineWidth
      );
      this.drawLine3D(
        vertices[6][0],
        vertices[6][1],
        vertices[6][2],
        vertices[7][0],
        vertices[7][1],
        vertices[7][2],
        color,
        lineWidth
      );
      this.drawLine3D(
        vertices[7][0],
        vertices[7][1],
        vertices[7][2],
        vertices[4][0],
        vertices[4][1],
        vertices[4][2],
        color,
        lineWidth
      );

      // Vertical edges connecting bottom to top (4 edges)
      this.drawLine3D(
        vertices[0][0],
        vertices[0][1],
        vertices[0][2],
        vertices[4][0],
        vertices[4][1],
        vertices[4][2],
        color,
        lineWidth
      );
      this.drawLine3D(
        vertices[1][0],
        vertices[1][1],
        vertices[1][2],
        vertices[5][0],
        vertices[5][1],
        vertices[5][2],
        color,
        lineWidth
      );
      this.drawLine3D(
        vertices[2][0],
        vertices[2][1],
        vertices[2][2],
        vertices[6][0],
        vertices[6][1],
        vertices[6][2],
        color,
        lineWidth
      );
      this.drawLine3D(
        vertices[3][0],
        vertices[3][1],
        vertices[3][2],
        vertices[7][0],
        vertices[7][1],
        vertices[7][2],
        color,
        lineWidth
      );
    }

    if (color) this.resetGizmoColor();
  }

  // 2D Arrow
  drawArrow2D(x1, y1, x2, y2, headSize = 10, color = null, lineWidth = null) {
    this.pushState();

    if (lineWidth) this.renderer.pushLineWidth(lineWidth);
    if (color) this.setGizmoColor(color[0], color[1], color[2], color[3]);

    this.renderer.setColorFillMode();

    // Calculate arrow head triangle
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const arrowAngle = Math.PI / 6; // 30 degrees

    const headX1 = x2 - headSize * Math.cos(angle - arrowAngle);
    const headY1 = y2 - headSize * Math.sin(angle - arrowAngle);
    const headX2 = x2 - headSize * Math.cos(angle + arrowAngle);
    const headY2 = y2 - headSize * Math.sin(angle + arrowAngle);

    // Calculate the base of the arrow head (where the line should stop)
    const headBaseX = x2 - headSize * Math.cos(angle);
    const headBaseY = y2 - headSize * Math.sin(angle);

    // Draw main line (stopping at the base of the arrow head)
    this.renderer.line(x1, y1, headBaseX, headBaseY);

    // Draw filled triangle arrow head
    this.drawTriangle2D(x2, y2, headX1, headY1, headX2, headY2, true, color);

    if (color) this.resetGizmoColor();
    if (lineWidth) this.renderer.popLineWidth();
    this.popState();
  }

  // 3D Arrow
  drawArrow3D(
    x1,
    y1,
    z1,
    x2,
    y2,
    z2,
    thickness = 2,
    headSize = 0.5,
    color = null
  ) {
    if (color) this.setGizmoColor(color[0], color[1], color[2], color[3]);

    headSize = headSize * thickness;

    // Calculate direction vector
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dz = z2 - z1;
    const length = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (length > 0) {
      // Normalize direction
      const ndx = dx / length;
      const ndy = dy / length;
      const ndz = dz / length;

      // Create arrow head cone using triangular faces
      const headLength = headSize * 20;
      const headBaseX = x2 - ndx * headLength;
      const headBaseY = y2 - ndy * headLength;
      const headBaseZ = z2 - ndz * headLength;

      // Draw main line (stopping at the base of the arrow head)
      this.drawLine3D(
        x1,
        y1,
        z1,
        headBaseX,
        headBaseY,
        headBaseZ,
        color,
        thickness
      );

      // Create perpendicular vectors for the arrow head base
      let perpX, perpY, perpZ;
      if (Math.abs(ndx) > 0.1) {
        perpX = -ndy;
        perpY = ndx;
        perpZ = 0;
      } else {
        perpX = 0;
        perpY = -ndz;
        perpZ = ndy;
      }

      // Normalize perpendicular vector
      const perpLength = Math.sqrt(
        perpX * perpX + perpY * perpY + perpZ * perpZ
      );
      if (perpLength > 0) {
        perpX /= perpLength;
        perpY /= perpLength;
        perpZ /= perpLength;
      }

      // Create second perpendicular vector using cross product
      const perp2X = ndy * perpZ - ndz * perpY;
      const perp2Y = ndz * perpX - ndx * perpZ;
      const perp2Z = ndx * perpY - ndy * perpX;

      const headRadius = headSize * 10;

      // Create triangular faces for the cone (6 triangles around the cone)
      for (let i = 0; i < 6; i++) {
        const angle1 = (i / 6) * Math.PI * 2;
        const angle2 = ((i + 1) / 6) * Math.PI * 2;

        const cos1 = Math.cos(angle1);
        const sin1 = Math.sin(angle1);
        const cos2 = Math.cos(angle2);
        const sin2 = Math.sin(angle2);

        // Two points on the base circle
        const base1X = headBaseX + (perpX * cos1 + perp2X * sin1) * headRadius;
        const base1Y = headBaseY + (perpY * cos1 + perp2Y * sin1) * headRadius;
        const base1Z = headBaseZ + (perpZ * cos1 + perp2Z * sin1) * headRadius;

        const base2X = headBaseX + (perpX * cos2 + perp2X * sin2) * headRadius;
        const base2Y = headBaseY + (perpY * cos2 + perp2Y * sin2) * headRadius;
        const base2Z = headBaseZ + (perpZ * cos2 + perp2Z * sin2) * headRadius;

        // Draw triangle from tip to two base points
        this.drawTriangle3D(
          x2,
          y2,
          z2,
          base1X,
          base1Y,
          base1Z,
          base2X,
          base2Y,
          base2Z,
          true,
          color
        );
      }
    }

    if (color) this.resetGizmoColor();
  }

  drawArrow2DFromLength(
    x1,
    y1,
    dx,
    dy,
    length = 100,
    headSize = 10,
    color = null,
    lineWidth = null
  ) {
    // Normalize direction vector
    const dirLength = Math.sqrt(dx * dx + dy * dy);
    if (dirLength === 0) return; // Avoid division by zero

    const ndx = (dx / dirLength) * length;
    const ndy = (dy / dirLength) * length;

    // Calculate end point
    const x2 = x1 + ndx;
    const y2 = y1 + ndy;

    // Draw the arrow
    this.drawArrow2D(x1, y1, x2, y2, headSize, color, lineWidth);
  }

  drawArrow3DFromLength(
    x1,
    y1,
    z1,
    dx,
    dy,
    dz,
    length = 100,
    thickness = 2,
    headSize = 0.5,
    color = null
  ) {
    // Normalize direction vector
    const dirLength = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (dirLength === 0) return; // Avoid division by zero
    const ndx = (dx / dirLength) * length;
    const ndy = (dy / dirLength) * length;
    const ndz = (dz / dirLength) * length;

    // Calculate end point
    const x2 = x1 + ndx;
    const y2 = y1 + ndy;
    const z2 = z1 + ndz;

    // Draw the arrow
    this.drawArrow3D(x1, y1, z1, x2, y2, z2, thickness, headSize, color);
  }

  // Grid helper
  drawGrid2D(
    startX,
    startY,
    width,
    height,
    spacingX,
    spacingY,
    color = null,
    lineWidth = 1,
    zPosition = 0
  ) {
    const numLinesX = Math.ceil(width / spacingX) - 1;
    const numLinesY = Math.ceil(height / spacingY) - 1;

    // Vertical lines
    this.renderer.setColorFillMode();
    const currentZ = this.renderer.getCurrentZ() ?? 0;
    this.renderer.setCurrentZ(zPosition);
    for (let i = 0; i <= numLinesX; i++) {
      const x = startX + i * spacingX;
      this.drawLine2D(x, startY, x, startY + height, color, lineWidth);
    }
    this.drawLine2D(
      startX + width,
      startY,
      startX + width,
      startY + height,
      color,
      lineWidth
    );

    // Horizontal lines
    for (let i = 0; i <= numLinesY; i++) {
      const y = startY + i * spacingY;
      this.drawLine2D(startX, y, startX + width, y, color, lineWidth);
    }
    this.drawLine2D(
      startX,
      startY + height,
      startX + width,
      startY + height,
      color,
      lineWidth
    );
    this.renderer.setCurrentZ(currentZ);
  }

  // 2D Triangle
  drawTriangle2D(
    x1,
    y1,
    x2,
    y2,
    x3,
    y3,
    filled = true,
    color = null,
    lineWidth = null
  ) {
    this.pushState();

    if (lineWidth) this.renderer.pushLineWidth(lineWidth);
    if (color) this.setGizmoColor(color[0], color[1], color[2], color[3]);

    this.renderer.setColorFillMode();
    if (filled) {
      // Use convexPoly for filled triangle
      const points = [x1, y1, x2, y2, x3, y3];
      this.renderer.convexPoly(points);
    } else {
      // Draw triangle outline with lines
      this.renderer.line(x1, y1, x2, y2);
      this.renderer.line(x2, y2, x3, y3);
      this.renderer.line(x3, y3, x1, y1);
    }

    if (color) this.resetGizmoColor();
    if (lineWidth) this.renderer.popLineWidth();
    this.popState();
  }

  // 3D Triangle
  drawTriangle3D(
    x1,
    y1,
    z1,
    x2,
    y2,
    z2,
    x3,
    y3,
    z3,
    filled = true,
    color = null,
    lineWidth = 2
  ) {
    if (color) this.setGizmoColor(color[0], color[1], color[2], color[3]);

    if (filled) {
      this.renderer.setColorFillMode();
      // Use quad3D with duplicate fourth vertex to create triangle
      this.renderer.quad3D(x1, y1, z1, x2, y2, z2, x3, y3, z3, x3, y3, z3, {
        left: 0,
        top: 0,
        right: 1,
        bottom: 1,
      });
    } else {
      // Draw triangle outline with 3D lines
      this.drawLine3D(x1, y1, z1, x2, y2, z2, color, lineWidth);
      this.drawLine3D(x2, y2, z2, x3, y3, z3, color, lineWidth);
      this.drawLine3D(x3, y3, z3, x1, y1, z1, color, lineWidth);
    }

    if (color) this.resetGizmoColor();
  }

  // Rotation Ring
  drawRotationRing(
    x,
    y,
    z,
    radius,
    normal = [0, 0, 1],
    segments = 32,
    thickness = 2,
    color = null
  ) {
    if (color) this.setGizmoColor(color[0], color[1], color[2], color[3]);

    // Generate points around the circle
    const points = [];
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const cosAngle = Math.cos(angle);
      const sinAngle = Math.sin(angle);

      // Start with circle in XY plane
      let px = radius * cosAngle;
      let py = radius * sinAngle;
      let pz = 0;

      // Transform to align with normal vector
      // If normal is not [0, 0, 1], we need to rotate the circle
      if (Math.abs(normal[2] - 1) > 0.001) {
        // Use a more robust method to create rotation matrix from normal vector
        // This avoids gimbal lock issues with cross product method

        // Normalize the normal vector
        const normalLength = Math.sqrt(
          normal[0] * normal[0] + normal[1] * normal[1] + normal[2] * normal[2]
        );
        const nx = normal[0] / normalLength;
        const ny = normal[1] / normalLength;
        const nz = normal[2] / normalLength;

        // Create two perpendicular vectors to form a complete basis
        let u1x, u1y, u1z; // First tangent vector
        let u2x, u2y, u2z; // Second tangent vector

        // Choose a vector that's not parallel to normal for cross product
        if (Math.abs(nx) < 0.9) {
          // Cross product with X axis: [1,0,0] × [nx,ny,nz] = [0, nz, -ny]
          u1x = 0;
          u1y = nz;
          u1z = -ny;
        } else {
          // Cross product with Y axis: [0,1,0] × [nx,ny,nz] = [-nz, 0, nx]
          u1x = -nz;
          u1y = 0;
          u1z = nx;
        }

        // Normalize first tangent vector
        const u1Length = Math.sqrt(u1x * u1x + u1y * u1y + u1z * u1z);
        if (u1Length > 0) {
          u1x /= u1Length;
          u1y /= u1Length;
          u1z /= u1Length;
        }

        // Second tangent vector = normal × first tangent
        u2x = ny * u1z - nz * u1y;
        u2y = nz * u1x - nx * u1z;
        u2z = nx * u1y - ny * u1x;

        // Transform the point: px*u1 + py*u2 + pz*normal
        const newPx = px * u1x + py * u2x + pz * nx;
        const newPy = px * u1y + py * u2y + pz * ny;
        const newPz = px * u1z + py * u2z + pz * nz;

        px = newPx;
        py = newPy;
        pz = newPz;
      }

      points.push([x + px, y + py, z + pz]);
    }

    // Draw the ring as connected line segments
    for (let i = 0; i < segments; i++) {
      this.drawLine3D(
        points[i][0],
        points[i][1],
        points[i][2],
        points[i + 1][0],
        points[i + 1][1],
        points[i + 1][2],
        color,
        thickness
      );
    }

    if (color) this.resetGizmoColor();
  }

  // Scale Handle (cube at the end of a line)
  drawScaleHandle(
    x,
    y,
    z,
    direction = [1, 0, 0],
    handleSize = 8,
    lineLength = 50,
    color = null,
    thickness = 2
  ) {
    if (color) this.setGizmoColor(color[0], color[1], color[2], color[3]);

    // Normalize direction
    const len = Math.sqrt(
      direction[0] * direction[0] +
        direction[1] * direction[1] +
        direction[2] * direction[2]
    );
    const dir = [direction[0] / len, direction[1] / len, direction[2] / len];

    // Calculate end position
    const endX = x + dir[0] * lineLength;
    const endY = y + dir[1] * lineLength;
    const endZ = z + dir[2] * lineLength;

    // Draw line from center to handle
    this.drawLine3D(x, y, z, endX, endY, endZ, color, thickness);

    // Draw handle cube at the end
    this.drawBox3D(
      endX,
      endY,
      endZ,
      handleSize,
      handleSize,
      handleSize,
      true,
      color
    );

    if (color) this.resetGizmoColor();
  }

  // Corner Scale Handle (cube at corner for uniform scaling)
  drawCornerScaleHandle(x, y, z, handleSize = 12, color = null) {
    if (color) this.setGizmoColor(color[0], color[1], color[2], color[3]);

    // Draw a slightly larger cube for corner scaling
    this.drawBox3D(x, y, z, handleSize, handleSize, handleSize, true, color);

    if (color) this.resetGizmoColor();
  }
}

// Gizmo Management System
export class GizmoManager {
  constructor(gizmoRenderer) {
    this.gizmoRenderer = gizmoRenderer;
    this.gizmos = new Map(); // id -> gizmo data
    this.layers = new Map(); // layer name -> Set of gizmo IDs
    this.nextId = 1;
    this.hoveredGizmo = null;
    this.clickedGizmo = null;
    this.mouseX = 0;
    this.mouseY = 0;

    // Camera-distance scaling properties
    this.scalingEnabled = false; // Enable camera distance-based scaling
    this.baseScale = 1.0; // Base scale factor
    this.scaleDistance = 500; // Reference distance for scaling

    // Event callbacks
    this.onGizmoHover = null;
    this.onGizmoClick = null;
    this.onGizmoHoverEnd = null;
  }

  destroy() {
    this.gizmos.clear();
    this.layers.clear();
    this.hoveredGizmo = null;
    this.clickedGizmo = null;
    this.onGizmoHover = null;
    this.onGizmoClick = null;
    this.onGizmoHoverEnd = null;
    this.gizmoRenderer = null;
  }

  // Create a new gizmo
  createGizmo(
    type,
    params,
    tags = [],
    interactible = false,
    layer = null,
    scalingConfig = null
  ) {
    const id = this.nextId++;
    const layerName = layer || "Gizmos"; // Default to "Gizmos" layer if not specified
    const gizmo = {
      id,
      type,
      params: { ...params },
      tags: [...tags],
      interactible,
      visible: true,
      hovered: false,
      originalColor: params.color ? [...params.color] : null,
      layer: layerName,
      interactionTriangles: interactible
        ? this.generateInteractionTriangles(type, params)
        : [],
      // Per-gizmo scaling configuration
      scalingConfig: scalingConfig || null, // null means use global scaling, object means use per-gizmo scaling
    };

    this.gizmos.set(id, gizmo);

    // Add to layer storage
    if (!this.layers.has(layerName)) {
      this.layers.set(layerName, new Set());
    }
    this.layers.get(layerName).add(id);

    return id;
  }

  // Delete a gizmo
  deleteGizmo(id) {
    const gizmo = this.gizmos.get(id);
    if (gizmo) {
      // Remove from layer storage
      const layerSet = this.layers.get(gizmo.layer);
      if (layerSet) {
        layerSet.delete(id);
        // Clean up empty layer sets
        if (layerSet.size === 0) {
          this.layers.delete(gizmo.layer);
        }
      }
      return this.gizmos.delete(id);
    }
    return false;
  }

  // Update gizmo parameters
  updateGizmo(id, params) {
    const gizmo = this.gizmos.get(id);
    if (gizmo) {
      Object.assign(gizmo.params, params);
      // Update original color if color was changed
      if (params.color) {
        gizmo.originalColor = [...params.color];
      }
      // Regenerate interaction triangles if interactible
      if (gizmo.interactible) {
        gizmo.interactionTriangles = this.generateInteractionTriangles(
          gizmo.type,
          gizmo.params
        );
      }
      return true;
    }
    return false;
  }

  // Get gizmo by ID
  getGizmo(id) {
    return this.gizmos.get(id);
  }

  // Get gizmos by tag
  getGizmosByTag(tag) {
    const result = [];
    for (const gizmo of this.gizmos.values()) {
      if (gizmo.tags.includes(tag)) {
        result.push(gizmo);
      }
    }
    return result;
  }

  // Get gizmos by layer
  getGizmosByLayer(layerName) {
    const result = [];
    const layerSet = this.layers.get(layerName);
    if (layerSet) {
      for (const id of layerSet) {
        const gizmo = this.gizmos.get(id);
        if (gizmo) {
          result.push(gizmo);
        }
      }
    }
    return result;
  }

  // Set gizmo layer
  setGizmoLayer(id, layerName) {
    const gizmo = this.gizmos.get(id);
    if (gizmo) {
      const oldLayer = gizmo.layer;

      // Remove from old layer
      const oldLayerSet = this.layers.get(oldLayer);
      if (oldLayerSet) {
        oldLayerSet.delete(id);
        // Clean up empty layer sets
        if (oldLayerSet.size === 0) {
          this.layers.delete(oldLayer);
        }
      }

      // Add to new layer
      if (!this.layers.has(layerName)) {
        this.layers.set(layerName, new Set());
      }
      this.layers.get(layerName).add(id);

      gizmo.layer = layerName;
      return true;
    }
    return false;
  }

  // Show/hide gizmo
  setGizmoVisible(id, visible) {
    const gizmo = this.gizmos.get(id);
    if (gizmo) {
      gizmo.visible = visible;
      return true;
    }
    return false;
  }

  // Add/remove tags
  addTag(id, tag) {
    const gizmo = this.gizmos.get(id);
    if (gizmo && !gizmo.tags.includes(tag)) {
      gizmo.tags.push(tag);
      return true;
    }
    return false;
  }

  removeTag(id, tag) {
    const gizmo = this.gizmos.get(id);
    if (gizmo) {
      const index = gizmo.tags.indexOf(tag);
      if (index !== -1) {
        gizmo.tags.splice(index, 1);
        return true;
      }
    }
    return false;
  }

  // Clear all gizmos
  clear() {
    this.gizmos.clear();
    this.layers.clear();
    this.hoveredGizmo = null;
    this.clickedGizmo = null;
  }

  // Clear gizmos by tag
  clearByTag(tag) {
    const toDelete = [];
    for (const [id, gizmo] of this.gizmos) {
      if (gizmo.tags.includes(tag)) {
        toDelete.push(id);
      }
    }
    toDelete.forEach((id) => this.deleteGizmo(id));
  }

  // Clear gizmos by layer
  clearByLayer(layerName) {
    const layerSet = this.layers.get(layerName);
    if (layerSet) {
      // Delete all gizmos in this layer
      for (const id of layerSet) {
        this.gizmos.delete(id);
      }
      // Clear and remove the layer
      this.layers.delete(layerName);
    }
  }

  // Get all layer names
  getLayerNames() {
    return Array.from(this.layers.keys());
  }

  // Check if a layer exists
  hasLayer(layerName) {
    return this.layers.has(layerName);
  }

  // Get gizmo count for a specific layer
  getLayerGizmoCount(layerName) {
    const layerSet = this.layers.get(layerName);
    return layerSet ? layerSet.size : 0;
  }

  // Set layer visibility (show/hide all gizmos in a layer)
  setLayerVisible(layerName, visible) {
    const layerSet = this.layers.get(layerName);
    if (layerSet) {
      for (const id of layerSet) {
        const gizmo = this.gizmos.get(id);
        if (gizmo) {
          gizmo.visible = visible;
        }
      }
      return true;
    }
    return false;
  }

  // Render all visible gizmos for a specific layer
  renderAll(layerName = null, camera = null) {
    // Provide the camera position for billboard lines and bracket a per-layer
    // mesh batch (begin resets the batch buffers, flush submits them).
    const batcher = this.gizmoRenderer.renderer;
    if (camera) {
      this.gizmoRenderer.cameraPos = camera.getCameraPosition();
    }
    batcher.beginBatch(layerName);

    if (layerName) {
      // Optimized: only iterate through gizmos in the specified layer
      const layerSet = this.layers.get(layerName);
      if (layerSet) {
        for (const id of layerSet) {
          const gizmo = this.gizmos.get(id);
          if (gizmo && gizmo.visible) {
            this.renderGizmo(gizmo, camera);
          }
        }
      }
    } else {
      // Render all visible gizmos across all layers
      for (const gizmo of this.gizmos.values()) {
        if (gizmo.visible) {
          this.renderGizmo(gizmo, camera);
        }
      }
    }

    batcher.flushBatch();
  }

  // Render multiple specific layers efficiently.
  // Delegates to renderAll so each layer gets its own begin/flush batch.
  renderLayers(layerNames, camera = null) {
    for (const layerName of layerNames) {
      this.renderAll(layerName, camera);
    }
  }

  // Render layers in a specific order (for z-ordering)
  renderLayersInOrder(orderedLayerNames, camera = null) {
    for (const layerName of orderedLayerNames) {
      this.renderAll(layerName, camera);
    }
  }

  // Render a single gizmo based on its type
  renderGizmo(gizmo, camera = null) {
    const { type, params } = gizmo;

    // Apply camera distance scaling if enabled
    const scaledParams = this.applyGizmoScaling(gizmo, camera);

    switch (type) {
      case "line2D":
        this.gizmoRenderer.drawLine2D(
          scaledParams.x1,
          scaledParams.y1,
          scaledParams.x2,
          scaledParams.y2,
          scaledParams.color,
          scaledParams.lineWidth
        );
        break;

      case "line3D":
        this.gizmoRenderer.drawLine3D(
          scaledParams.x1,
          scaledParams.y1,
          scaledParams.z1,
          scaledParams.x2,
          scaledParams.y2,
          scaledParams.z2,
          scaledParams.color,
          scaledParams.thickness
        );
        break;

      case "tube3D":
        this.gizmoRenderer.drawTube3D(
          scaledParams.x1,
          scaledParams.y1,
          scaledParams.z1,
          scaledParams.x2,
          scaledParams.y2,
          scaledParams.z2,
          scaledParams.color,
          scaledParams.thickness
        );
        break;

      case "box2D":
        this.gizmoRenderer.drawBox2D(
          scaledParams.x,
          scaledParams.y,
          scaledParams.width,
          scaledParams.height,
          scaledParams.filled,
          scaledParams.color,
          scaledParams.lineWidth
        );
        break;

      case "box3D":
        this.gizmoRenderer.drawBox3D(
          scaledParams.x,
          scaledParams.y,
          scaledParams.z,
          scaledParams.width,
          scaledParams.height,
          scaledParams.depth,
          scaledParams.filled,
          scaledParams.color,
          scaledParams.lineWidth
        );
        break;

      case "plane2D":
        this.gizmoRenderer.drawPlane2D(
          scaledParams.x,
          scaledParams.y,
          scaledParams.z || 0,
          scaledParams.width,
          scaledParams.height,
          scaledParams.filled,
          scaledParams.color,
          scaledParams.lineWidth
        );
        break;

      case "plane3D":
        this.gizmoRenderer.drawPlane3D(
          scaledParams.x,
          scaledParams.y,
          scaledParams.z,
          scaledParams.width,
          scaledParams.height,
          scaledParams.filled,
          scaledParams.color,
          scaledParams.angleX,
          scaledParams.angleY,
          scaledParams.angleZ
        );
        break;

      case "triangle2D":
        this.gizmoRenderer.drawTriangle2D(
          scaledParams.x1,
          scaledParams.y1,
          scaledParams.x2,
          scaledParams.y2,
          scaledParams.x3,
          scaledParams.y3,
          scaledParams.filled,
          scaledParams.color,
          scaledParams.lineWidth
        );
        break;

      case "triangle3D":
        this.gizmoRenderer.drawTriangle3D(
          scaledParams.x1,
          scaledParams.y1,
          scaledParams.z1,
          scaledParams.x2,
          scaledParams.y2,
          scaledParams.z2,
          scaledParams.x3,
          scaledParams.y3,
          scaledParams.z3,
          scaledParams.filled,
          scaledParams.color,
          scaledParams.lineWidth
        );
        break;

      case "arrow2D":
        this.gizmoRenderer.drawArrow2D(
          scaledParams.x1,
          scaledParams.y1,
          scaledParams.x2,
          scaledParams.y2,
          scaledParams.headSize,
          scaledParams.color,
          scaledParams.lineWidth
        );
        break;

      case "arrow2DFromLength":
        this.gizmoRenderer.drawArrow2DFromLength(
          scaledParams.x1,
          scaledParams.y1,
          scaledParams.dx,
          scaledParams.dy,
          scaledParams.length,
          scaledParams.headSize,
          scaledParams.color,
          scaledParams.lineWidth
        );
        break;

      case "arrow3D":
        this.gizmoRenderer.drawArrow3D(
          scaledParams.x1,
          scaledParams.y1,
          scaledParams.z1,
          scaledParams.x2,
          scaledParams.y2,
          scaledParams.z2,
          scaledParams.thickness,
          scaledParams.headSize,
          scaledParams.color
        );
        break;

      case "arrow3DFromLength":
        this.gizmoRenderer.drawArrow3DFromLength(
          scaledParams.x1,
          scaledParams.y1,
          scaledParams.z1,
          scaledParams.dx,
          scaledParams.dy,
          scaledParams.dz,
          scaledParams.length,
          scaledParams.thickness,
          scaledParams.headSize,
          scaledParams.color
        );
        break;

      case "grid2D":
        this.gizmoRenderer.drawGrid2D(
          scaledParams.startX,
          scaledParams.startY,
          scaledParams.width,
          scaledParams.height,
          scaledParams.spacingX,
          scaledParams.spacingY,
          scaledParams.color,
          scaledParams.lineWidth,
          scaledParams.zPosition
        );
        break;

      case "rotationRing":
        this.gizmoRenderer.drawRotationRing(
          scaledParams.x,
          scaledParams.y,
          scaledParams.z,
          scaledParams.radius,
          scaledParams.normal,
          scaledParams.segments || 32,
          scaledParams.thickness,
          scaledParams.color
        );
        break;

      case "scaleHandle":
        this.gizmoRenderer.drawScaleHandle(
          scaledParams.x,
          scaledParams.y,
          scaledParams.z,
          scaledParams.direction,
          scaledParams.handleSize,
          scaledParams.lineLength,
          scaledParams.color,
          scaledParams.thickness
        );
        break;

      case "cornerScaleHandle":
        this.gizmoRenderer.drawCornerScaleHandle(
          scaledParams.x,
          scaledParams.y,
          scaledParams.z,
          scaledParams.handleSize,
          scaledParams.color
        );
        break;

      default:
        console.warn(`Unknown gizmo type: ${type}`);
        break;
    }
  }

  // Calculate scale factor based on camera distance
  calculateGizmoScale(centerX, centerY, centerZ, camera = null) {
    if (!this.scalingEnabled || !camera) {
      return this.baseScale;
    }

    return this.calculateGizmoScaleWithConfig(
      centerX,
      centerY,
      centerZ,
      camera,
      this.baseScale,
      this.scaleDistance
    );
  }

  // Calculate scale factor with custom config
  calculateGizmoScaleWithConfig(
    centerX,
    centerY,
    centerZ,
    camera,
    baseScale,
    referenceDistance
  ) {
    if (!camera) {
      return baseScale;
    }

    const cameraPos = camera.getCameraPosition();
    const distance = Math.sqrt(
      (centerX - cameraPos[0]) ** 2 +
        (centerY - cameraPos[1]) ** 2 +
        (centerZ - cameraPos[2]) ** 2
    );

    // Scale factor increases with distance to maintain visual size
    return baseScale * (distance / referenceDistance);
  }

  // Enable/disable camera distance-based scaling
  setCameraScaling(enabled, baseScale = 1.0, referenceDistance = 500) {
    this.scalingEnabled = enabled;
    this.baseScale = baseScale;
    this.scaleDistance = referenceDistance;
  }

  // Convenience method to enable camera scaling with sensible defaults
  enableCameraScaling(baseScale = 1.0, referenceDistance = 500) {
    this.setCameraScaling(true, baseScale, referenceDistance);
  }

  // Convenience method to disable camera scaling
  disableCameraScaling() {
    this.setCameraScaling(false);
  }

  drawGizmoTriangles(gizmos) {
    let gizmoList = Array.isArray(gizmos) ? gizmos : [gizmos];
    const ids = [];
    for (const gizmoId of gizmoList) {
      const gizmo = this.gizmos.get(gizmoId);
      // If gizmo is not interactible, nothing to draw
      if (!gizmo || !gizmo.interactible || !gizmo.interactionTriangles) {
        continue;
      }

      // Draw each scaled triangle
      for (const triangle of gizmo.interactionTriangles) {
        const id = this.createGizmo(
          "triangle3D",
          {
            x1: triangle[0].x,
            y1: triangle[0].y,
            z1: triangle[0].zElevation,
            x2: triangle[1].x,
            y2: triangle[1].y,
            z2: triangle[1].zElevation,
            x3: triangle[2].x,
            y3: triangle[2].y,
            z3: triangle[2].zElevation,
            filled: false,
            color: [1, 1, 1, 0.3],
          },
          [],
          false, // Interaction triangles are not interactible
          "Gizmos"
        );
        ids.push(id);
      }
    }
  }

  // Apply scaling to gizmo parameters based on camera distance
  applyGizmoScaling(gizmo, camera = null) {
    // Check if this gizmo has per-gizmo scaling or should use global scaling
    const shouldScale = gizmo.scalingConfig
      ? gizmo.scalingConfig.enabled
      : this.scalingEnabled;

    if (!shouldScale || !camera || !gizmo.params) {
      return gizmo.params;
    }

    // Extract center position from gizmo parameters
    let centerX, centerY, centerZ;
    const params = gizmo.params;

    switch (gizmo.type) {
      case "line3D":
      case "tube3D":
        centerX = (params.x1 + params.x2) * 0.5;
        centerY = (params.y1 + params.y2) * 0.5;
        centerZ = (params.z1 + params.z2) * 0.5;
        break;
      case "arrow3D":
      case "arrow3DFromLength":
        centerX = params.x1;
        centerY = params.y1;
        centerZ = params.z1;
        break;
      case "box3D":
      case "plane3D":
      case "rotationRing":
      case "scaleHandle":
      case "cornerScaleHandle":
        centerX = params.x;
        centerY = params.y;
        centerZ = params.z;
        break;
      case "triangle3D":
        centerX = (params.x1 + params.x2 + params.x3) / 3;
        centerY = (params.y1 + params.y2 + params.y3) / 3;
        centerZ = (params.z1 + params.z2 + params.z3) / 3;
        break;
      default:
        // For 2D gizmos or unknown types, don't apply scaling
        return params;
    }

    // Use per-gizmo scaling config or fall back to global config
    const scalingConfig = gizmo.scalingConfig || {
      baseScale: this.baseScale,
      referenceDistance: this.scaleDistance,
    };

    const scaleFactor = this.calculateGizmoScaleWithConfig(
      centerX,
      centerY,
      centerZ,
      camera,
      scalingConfig.baseScale,
      scalingConfig.referenceDistance
    );

    // Create scaled parameters
    const scaledParams = { ...params };

    // Use per-gizmo scaling properties or default behavior
    const scaleProperties = gizmo.scalingConfig?.scaleProperties || {
      thickness: true,
      headSize: true,
      width: true,
      height: true,
      depth: true,
      lineWidth: true,
      radius: true, // For rotation rings
      handleSize: true, // For scale handles
      lineLength: true, // For scale handle lines
      // For arrows, we can scale both thickness and length
      length: false, // Default to not scaling length unless specified
    };

    // Apply scaling to specified properties
    if (scaleProperties.thickness && params.thickness) {
      scaledParams.thickness = params.thickness * scaleFactor;
    }
    if (scaleProperties.headSize && params.headSize) {
      scaledParams.headSize = params.headSize * scaleFactor;
    }
    if (scaleProperties.width && params.width) {
      scaledParams.width = params.width * scaleFactor;
    }
    if (scaleProperties.height && params.height) {
      scaledParams.height = params.height * scaleFactor;
    }
    if (scaleProperties.depth && params.depth) {
      scaledParams.depth = params.depth * scaleFactor;
    }
    if (scaleProperties.lineWidth && params.lineWidth) {
      scaledParams.lineWidth = params.lineWidth * scaleFactor;
    }
    if (scaleProperties.radius && params.radius) {
      scaledParams.radius = params.radius * scaleFactor;
    }
    if (scaleProperties.handleSize && params.handleSize) {
      scaledParams.handleSize = params.handleSize * scaleFactor;
    }
    if (scaleProperties.lineLength && params.lineLength) {
      scaledParams.lineLength = params.lineLength * scaleFactor;
    }

    // Special handling for arrow/line length scaling
    if (
      scaleProperties.length &&
      (gizmo.type === "line3D" || gizmo.type === "arrow3D")
    ) {
      const originalLength = Math.sqrt(
        Math.pow(params.x2 - params.x1, 2) +
          Math.pow(params.y2 - params.y1, 2) +
          Math.pow(params.z2 - params.z1, 2)
      );

      const newLength = originalLength * scaleFactor;
      const lengthRatio = newLength / originalLength;

      // Scale the end point while keeping start point fixed
      const dx = params.x2 - params.x1;
      const dy = params.y2 - params.y1;
      const dz = params.z2 - params.z1;

      scaledParams.x2 = params.x1 + dx * lengthRatio;
      scaledParams.y2 = params.y1 + dy * lengthRatio;
      scaledParams.z2 = params.z1 + dz * lengthRatio;
    } else if (
      scaleProperties.length &&
      (gizmo.type === "line2D" || gizmo.type === "arrow2D")
    ) {
      const originalLength = Math.sqrt(
        Math.pow(params.x2 - params.x1, 2) + Math.pow(params.y2 - params.y1, 2)
      );

      const newLength = originalLength * scaleFactor;
      const lengthRatio = newLength / originalLength;

      // Scale the end point while keeping start point fixed
      const dx = params.x2 - params.x1;
      const dy = params.y2 - params.y1;

      scaledParams.x2 = params.x1 + dx * lengthRatio;
      scaledParams.y2 = params.y1 + dy * lengthRatio;
    } else if (scaleProperties.length && params.length) {
      // For arrows defined by length, scale the length directly
      scaledParams.length = params.length * scaleFactor;
    }

    return scaledParams;
  }

  // Configure per-gizmo scaling
  setGizmoScaling(
    id,
    enabled,
    baseScale = 1.0,
    referenceDistance = 500,
    scaleProperties = null
  ) {
    const gizmo = this.gizmos.get(id);
    if (gizmo) {
      gizmo.scalingConfig = {
        enabled,
        baseScale,
        referenceDistance,
        scaleProperties: scaleProperties || {
          thickness: true,
          headSize: true,
          width: true,
          height: true,
          depth: true,
          lineWidth: true,
          radius: true, // For rotation rings
          handleSize: true, // For scale handles
          lineLength: true, // For scale handle lines
          length: false,
        },
      };
      return true;
    }
    return false;
  }

  // Enable scaling for a specific gizmo with custom properties
  enableGizmoScaling(
    id,
    baseScale = 1.0,
    referenceDistance = 500,
    scaleProperties = null
  ) {
    return this.setGizmoScaling(
      id,
      true,
      baseScale,
      referenceDistance,
      scaleProperties
    );
  }

  // Disable scaling for a specific gizmo
  disableGizmoScaling(id) {
    return this.setGizmoScaling(id, false);
  }

  // Get scaling configuration for a gizmo
  getGizmoScalingConfig(id) {
    const gizmo = this.gizmos.get(id);
    return gizmo ? gizmo.scalingConfig : null;
  }

  // Helper method to create scaling config objects
  createScalingConfig(
    enabled = true,
    baseScale = 1.0,
    referenceDistance = 500,
    scaleProperties = null
  ) {
    return {
      enabled,
      baseScale,
      referenceDistance,
      scaleProperties: scaleProperties || {
        thickness: true,
        headSize: true,
        width: true,
        height: true,
        depth: true,
        lineWidth: true,
        radius: true, // For rotation rings
        handleSize: true, // For scale handles
        lineLength: true, // For scale handle lines
        length: false,
      },
    };
  }

  // Predefined scaling configs for common use cases
  static SCALING_CONFIGS = {
    // Selection box - only scale line thickness
    SELECTION_BOX: {
      enabled: true,
      baseScale: 1,
      referenceDistance: 500,
      scaleProperties: {
        thickness: true,
        headSize: false,
        width: false,
        height: false,
        depth: false,
        lineWidth: true,
        length: false,
      },
    },

    // Axis arrows - scale both thickness and length
    AXIS_ARROW: {
      enabled: true,
      baseScale: 1.0,
      referenceDistance: 1000,
      scaleProperties: {
        thickness: true,
        headSize: false,
        width: false,
        height: false,
        depth: false,
        lineWidth: true,
        length: true,
      },
    },

    // Default - scale all properties
    DEFAULT: {
      enabled: true,
      baseScale: 1.0,
      referenceDistance: 1000,
      scaleProperties: {
        thickness: true,
        headSize: true,
        width: true,
        height: true,
        depth: true,
        lineWidth: true,
        length: false,
      },
    },
  };

  // Update mouse position and handle interactions using raycast
  updateMouse(
    mouseX,
    mouseY,
    isClicked = false,
    camera = null,
    viewportWidth = 1920,
    viewportHeight = 1080
  ) {
    this.mouseX = mouseX;
    this.mouseY = mouseY;

    let newHoveredGizmo = null;

    // Only proceed if we have camera info for raycasting
    if (camera) {
      const cameraPos = camera.getCameraPosition();
      const forward = camera.getLookVector();
      const up = camera.getUpVector();
      const fov = camera.fieldOfView;

      // Get ray from screen coordinates
      const rayDirection = screenToWorldRay(
        mouseX,
        mouseY,
        viewportWidth,
        viewportHeight,
        forward,
        up,
        fov
      );

      // Find the closest gizmo that intersects with the ray
      const closestGizmo = this.getFirstGizmoFromRaycast(
        cameraPos,
        rayDirection,
        camera
      );

      // Reset hover state for all gizmos first
      for (const gizmo of this.gizmos.values()) {
        if (!gizmo.visible || !gizmo.interactible) continue;

        const wasHovered = gizmo.hovered;
        gizmo.hovered = false;

        // Trigger hover end for previously hovered gizmos that are no longer the closest
        if (wasHovered && (!closestGizmo || closestGizmo.id !== gizmo.id)) {
          if (this.onGizmoHoverEnd) {
            this.onGizmoHoverEnd(gizmo.id, gizmo);
          }
        }
      }

      // Handle interaction with the closest gizmo only
      if (closestGizmo) {
        const wasHovered = closestGizmo.hovered;
        closestGizmo.hovered = true;
        newHoveredGizmo = closestGizmo;

        // Hover start
        if (!wasHovered) {
          if (this.onGizmoHover) {
            this.onGizmoHover(closestGizmo.id, closestGizmo);
          }
        }

        // Click
        if (isClicked) {
          this.clickedGizmo = closestGizmo;
          if (this.onGizmoClick) {
            this.onGizmoClick(closestGizmo.id, closestGizmo);
          }
        }
      }
    } else {
      // Fallback to 2D point-in-gizmo checking if no camera provided
      // For 2D, we'll also find the first intersecting gizmo to maintain consistency
      let firstIntersectingGizmo = null;

      for (const gizmo of this.gizmos.values()) {
        if (!gizmo.visible || !gizmo.interactible) continue;

        const wasHovered = gizmo.hovered;
        const intersects = this.isPointInGizmo(mouseX, mouseY, gizmo);

        if (intersects && !firstIntersectingGizmo) {
          firstIntersectingGizmo = gizmo;
        }

        gizmo.hovered = intersects && gizmo === firstIntersectingGizmo;

        if (gizmo.hovered) {
          newHoveredGizmo = gizmo;

          // Hover start
          if (!wasHovered) {
            if (this.onGizmoHover) {
              this.onGizmoHover(gizmo.id, gizmo);
            }
          }

          // Click
          if (isClicked) {
            this.clickedGizmo = gizmo;
            if (this.onGizmoClick) {
              this.onGizmoClick(gizmo.id, gizmo);
            }
          }
        } else if (wasHovered) {
          if (this.onGizmoHoverEnd) {
            this.onGizmoHoverEnd(gizmo.id, gizmo);
          }
        }
      }
    }

    this.hoveredGizmo = newHoveredGizmo;
  }

  // Find the closest gizmo that intersects with the ray (similar to getFirstRayIntersection)
  getFirstGizmoFromRaycast(rayOrigin, rayDirection, camera = null) {
    const gizmoIntersections = [];

    // Check all interactible gizmos for ray intersection
    for (const gizmo of this.gizmos.values()) {
      if (!gizmo.visible || !gizmo.interactible) continue;

      // Check if ray intersects this gizmo
      if (this.isRayIntersectingGizmo(rayOrigin, rayDirection, gizmo, camera)) {
        // Find the closest intersection point for this gizmo
        const closestPoint = this.getClosestIntersectionPoint(
          rayOrigin,
          rayDirection,
          gizmo,
          camera
        );
        if (closestPoint) {
          const dx = closestPoint[0] - rayOrigin[0];
          const dy = closestPoint[1] - rayOrigin[1];
          const dz = closestPoint[2] - rayOrigin[2];
          const distanceSquared = dx * dx + dy * dy + dz * dz;

          gizmoIntersections.push({
            gizmo,
            distanceSquared,
            point: closestPoint,
          });
        }
      }
    }

    // Return the closest gizmo (if any)
    if (gizmoIntersections.length === 0) {
      return null;
    }

    // Sort by distance and return the closest
    gizmoIntersections.sort((a, b) => a.distanceSquared - b.distanceSquared);
    return gizmoIntersections[0].gizmo;
  }

  // Get the closest intersection point for a gizmo
  getClosestIntersectionPoint(rayOrigin, rayDirection, gizmo, camera = null) {
    const tris = this.getScaledInteractionTriangles(gizmo, camera);
    if (!tris || tris.length === 0) return null;

    let closestPoint = null;
    let closestDistance = Infinity;

    for (const triangle of tris) {
      const intersections = castRay(
        [{ triangles: [triangle] }],
        rayOrigin,
        rayDirection,
        PICK_MAX_DISTANCE
      );

      if (intersections.length > 0) {
        for (const point of intersections[0].points) {
          const dx = point[0] - rayOrigin[0];
          const dy = point[1] - rayOrigin[1];
          const dz = point[2] - rayOrigin[2];
          const distanceSquared = dx * dx + dy * dy + dz * dz;

          if (distanceSquared < closestDistance) {
            closestDistance = distanceSquared;
            closestPoint = point;
          }
        }
      }
    }

    return closestPoint;
  }

  // Check if point is inside gizmo (2D only for now)
  isPointInGizmo(x, y, gizmo) {
    const params = gizmo.params;

    switch (gizmo.type) {
      case "line2D":
        return this.isPointOnLine2D(
          x,
          y,
          params.x1,
          params.y1,
          params.x2,
          params.y2,
          params.lineWidth || 2
        );

      case "box2D":
      case "plane2D":
        return this.isPointInRect(
          x,
          y,
          params.x,
          params.y,
          params.width,
          params.height
        );

      case "triangle2D":
        return this.isPointInTriangle(
          x,
          y,
          params.x1,
          params.y1,
          params.x2,
          params.y2,
          params.x3,
          params.y3
        );

      case "arrow2D":
        // Check both line and arrow head
        const onLine = this.isPointOnLine2D(
          x,
          y,
          params.x1,
          params.y1,
          params.x2,
          params.y2,
          params.lineWidth || 2
        );
        if (onLine) return true;

        // Check arrow head triangle
        const angle = Math.atan2(params.y2 - params.y1, params.x2 - params.x1);
        const arrowAngle = Math.PI / 6;
        const headSize = params.headSize || 10;

        const headX1 = params.x2 - headSize * Math.cos(angle - arrowAngle);
        const headY1 = params.y2 - headSize * Math.sin(angle - arrowAngle);
        const headX2 = params.x2 - headSize * Math.cos(angle + arrowAngle);
        const headY2 = params.y2 - headSize * Math.sin(angle + arrowAngle);

        return this.isPointInTriangle(
          x,
          y,
          params.x2,
          params.y2,
          headX1,
          headY1,
          headX2,
          headY2
        );

      default:
        return false;
    }
  }

  // Geometry hit testing functions
  isPointInRect(x, y, rectX, rectY, width, height) {
    return (
      x >= rectX && x <= rectX + width && y >= rectY && y <= rectY + height
    );
  }

  isPointOnLine2D(x, y, x1, y1, x2, y2, thickness) {
    const A = x - x1;
    const B = y - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;

    if (lenSq === 0) return Math.sqrt(A * A + B * B) <= thickness;

    const param = dot / lenSq;

    let xx, yy;
    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = x - xx;
    const dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy) <= thickness;
  }

  isPointInTriangle(x, y, x1, y1, x2, y2, x3, y3) {
    const denom = (y2 - y3) * (x1 - x3) + (x3 - x2) * (y1 - y3);
    if (Math.abs(denom) < 1e-10) return false;

    const a = ((y2 - y3) * (x - x3) + (x3 - x2) * (y - y3)) / denom;
    const b = ((y3 - y1) * (x - x3) + (x1 - x3) * (y - y3)) / denom;
    const c = 1 - a - b;

    return a >= 0 && b >= 0 && c >= 0;
  }

  getScaledInteractionTriangles(gizmo, camera) {
    const triangles = gizmo.interactionTriangles;
    if (!triangles || triangles.length === 0) return triangles;

    const shouldScale = gizmo.scalingConfig
      ? gizmo.scalingConfig.enabled
      : this.scalingEnabled;
    if (!shouldScale || !camera || !gizmo.params) return triangles;

    let cx, cy, cz;
    const p = gizmo.params;
    if (gizmo.type === "arrow3D" || gizmo.type === "arrow3DFromLength" || gizmo.type === "line3D") {
      cx = p.x1 ?? 0;
      cy = p.y1 ?? 0;
      cz = p.z1 ?? 0;
    } else {
      cx = p.x ?? 0;
      cy = p.y ?? 0;
      cz = p.z ?? 0;
    }

    const config = gizmo.scalingConfig || {
      baseScale: this.baseScale,
      referenceDistance: this.scaleDistance,
    };
    const sf = this.calculateGizmoScaleWithConfig(
      cx, cy, cz, camera, config.baseScale, config.referenceDistance
    );
    if (Math.abs(sf - 1) < 0.001) return triangles;

    return triangles.map((tri) =>
      tri.map((v) => ({
        x: cx + (v.x - cx) * sf,
        y: cy + (v.y - cy) * sf,
        zElevation: cz + (v.zElevation - cz) * sf,
      }))
    );
  }

  // Check if ray intersects with gizmo using interaction triangles
  isRayIntersectingGizmo(rayOrigin, rayDirection, gizmo, camera = null) {
    const tris = this.getScaledInteractionTriangles(gizmo, camera);
    if (!tris || tris.length === 0) return false;

    const intersections = castRay(
      [{ triangles: tris }],
      rayOrigin,
      rayDirection,
      PICK_MAX_DISTANCE
    );

    return intersections.length > 0;
  }

  // Generate invisible interaction triangles for gizmos
  generateInteractionTriangles(type, params) {
    const triangles = [];

    switch (type) {
      case "line2D":
        // Create a thin rectangle around the line for interaction
        const thickness = (params.lineWidth || 2) + 5; // Add some padding
        const dx = params.x2 - params.x1;
        const dy = params.y2 - params.y1;
        const length = Math.sqrt(dx * dx + dy * dy);

        if (length > 0) {
          const nx = -dy / length; // Normal perpendicular to line
          const ny = dx / length;

          const halfThickness = thickness * 0.5;

          // Four corners of the rectangle
          const x1 = params.x1 + nx * halfThickness;
          const y1 = params.y1 + ny * halfThickness;
          const x2 = params.x1 - nx * halfThickness;
          const y2 = params.y1 - ny * halfThickness;
          const x3 = params.x2 + nx * halfThickness;
          const y3 = params.y2 + ny * halfThickness;
          const x4 = params.x2 - nx * halfThickness;
          const y4 = params.y2 - ny * halfThickness;

          // Two triangles forming the rectangle
          triangles.push([
            { x: x1, y: y1, zElevation: 0 },

            { x: x2, y: y2, zElevation: 0 },
            { x: x3, y: y3, zElevation: 0 },
          ]);
          triangles.push([
            { x: x2, y: y2, zElevation: 0 },
            { x: x4, y: y4, zElevation: 0 },
            { x: x3, y: y3, zElevation: 0 },
          ]);
        }
        break;

      case "tube3D":
      case "line3D":
        // Create a thick 3D line collision box (properly oriented). Match the
        // rendered width per type: line3D billboards are thickness*4/pi wide,
        // tube3D boxes are `thickness`; add 2 units of click tolerance either way.
        const renderWidth3D =
          type === "line3D"
            ? (params.thickness || 2) * (4 / Math.PI)
            : params.thickness || 2;
        const thickness3D = renderWidth3D + 2;
        const dx3D = params.x2 - params.x1;
        const dy3D = params.y2 - params.y1;
        const dz3D = params.z2 - params.z1;
        const length3D = Math.sqrt(dx3D * dx3D + dy3D * dy3D + dz3D * dz3D);

        if (length3D > 0) {
          // Use a simpler approach: create a box at the line center oriented along the line
          const centerX = (params.x1 + params.x2) * 0.5;
          const centerY = (params.y1 + params.y2) * 0.5;
          const centerZ = (params.z1 + params.z2) * 0.5;

          // Create oriented bounding box triangles
          this.addOrientedBoxTriangles(
            triangles,
            centerX,
            centerY,
            centerZ,
            thickness3D,
            thickness3D,
            length3D,
            params.x1,
            params.y1,
            params.z1,
            params.x2,
            params.y2,
            params.z2
          );
        }
        break;

      case "box2D":
      case "plane2D":
        // Rectangle triangles
        triangles.push([
          { x: params.x, y: params.y, zElevation: 0 },
          { x: params.x + params.width, y: params.y, zElevation: 0 },
          { x: params.x, y: params.y + params.height, zElevation: 0 },
        ]);
        triangles.push([
          { x: params.x + params.width, y: params.y, zElevation: 0 },
          {
            x: params.x + params.width,
            y: params.y + params.height,
            zElevation: 0,
          },
          { x: params.x, y: params.y + params.height, zElevation: 0 },
        ]);
        break;

      case "plane3D":
        // 3D Plane triangles with quaternion-based rotation (gimbal-lock free)
        const halfW = params.width * 0.5;
        const halfH = params.height * 0.5;
        const angleX = params.angleX || 0;
        const angleY = params.angleY || 0;
        const angleZ = params.angleZ || 0;

        // Use quaternion rotation for consistency with drawPlane3D
        const quaternion = this.gizmoRenderer.eulerToQuaternion(
          angleX,
          angleY,
          angleZ
        );
        const normalizedQuaternion =
          this.gizmoRenderer.normalizeQuaternion(quaternion);

        // Helper function to apply quaternion rotation to points
        const rotatePoint = (px, py, pz) => {
          const rotatedPoint = this.gizmoRenderer.rotatePointByQuaternion(
            [px, py, pz],
            normalizedQuaternion
          );
          return [
            params.x + rotatedPoint[0],
            params.y + rotatedPoint[1],
            params.z + rotatedPoint[2],
          ];
        };

        // Calculate the four corners of the rotated plane
        const corners = [
          rotatePoint(-halfW, -halfH, 0), // Bottom-left
          rotatePoint(halfW, -halfH, 0), // Bottom-right
          rotatePoint(halfW, halfH, 0), // Top-right
          rotatePoint(-halfW, halfH, 0), // Top-left
        ];

        // Create two triangles for the plane
        triangles.push([
          { x: corners[0][0], y: corners[0][1], zElevation: corners[0][2] },
          { x: corners[1][0], y: corners[1][1], zElevation: corners[1][2] },
          { x: corners[2][0], y: corners[2][1], zElevation: corners[2][2] },
        ]);
        triangles.push([
          { x: corners[0][0], y: corners[0][1], zElevation: corners[0][2] },
          { x: corners[2][0], y: corners[2][1], zElevation: corners[2][2] },
          { x: corners[3][0], y: corners[3][1], zElevation: corners[3][2] },
        ]);
        break;

      case "box3D":
        this.addBoxTriangles(
          triangles,
          params.x,
          params.y,
          params.z,
          params.width,
          params.height,
          params.depth
        );
        break;

      case "triangle2D":
        triangles.push([
          { x: params.x1, y: params.y1, zElevation: 0 },
          { x: params.x2, y: params.y2, zElevation: 0 },
          { x: params.x3, y: params.y3, zElevation: 0 },
        ]);
        break;

      case "triangle3D":
        triangles.push([
          { x: params.x1, y: params.y1, zElevation: params.z1 },
          { x: params.x2, y: params.y2, zElevation: params.z2 },
          { x: params.x3, y: params.y3, zElevation: params.z3 },
        ]);
        break;

      case "arrow2D":
        // Line part + arrow head triangle
        const lineThickness = (params.lineWidth || 2) + 5;
        const lineDx = params.x2 - params.x1;
        const lineDy = params.y2 - params.y1;
        const lineLength = Math.sqrt(lineDx * lineDx + lineDy * lineDy);

        if (lineLength > 0) {
          // Line part (same as line2D)
          const lineNx = -lineDy / lineLength;
          const lineNy = lineDx / lineLength;
          const lineHalfThickness = lineThickness * 0.5;

          const lineX1 = params.x1 + lineNx * lineHalfThickness;
          const lineY1 = params.y1 + lineNy * lineHalfThickness;
          const lineX2 = params.x1 - lineNx * lineHalfThickness;
          const lineY2 = params.y1 - lineNy * lineHalfThickness;
          const lineX3 = params.x2 + lineNx * lineHalfThickness;
          const lineY3 = params.y2 + lineNy * lineHalfThickness;
          const lineX4 = params.x2 - lineNx * lineHalfThickness;
          const lineY4 = params.y2 - lineNy * lineHalfThickness;

          triangles.push([
            { x: lineX1, y: lineY1, zElevation: 0 },
            { x: lineX2, y: lineY2, zElevation: 0 },
            { x: lineX3, y: lineY3, zElevation: 0 },
          ]);
          triangles.push([
            { x: lineX2, y: lineY2, zElevation: 0 },
            { x: lineX4, y: lineY4, zElevation: 0 },
            { x: lineX3, y: lineY3, zElevation: 0 },
          ]);

          // Arrow head triangle
          const angle = Math.atan2(
            params.y2 - params.y1,
            params.x2 - params.x1
          );
          const arrowAngle = Math.PI / 6;
          const headSize = (params.headSize || 10) + 5; // Add padding

          const headX1 = params.x2 - headSize * Math.cos(angle - arrowAngle);
          const headY1 = params.y2 - headSize * Math.sin(angle - arrowAngle);
          const headX2 = params.x2 - headSize * Math.cos(angle + arrowAngle);
          const headY2 = params.y2 - headSize * Math.sin(angle + arrowAngle);

          triangles.push([
            { x: params.x2, y: params.y2, zElevation: 0 },
            { x: headX1, y: headY1, zElevation: 0 },
            { x: headX2, y: headY2, zElevation: 0 },
          ]);
        }
        break;

      case "arrow3D":
        // Create proper interaction triangles for 3D arrow (shaft + head)
        const headSizeArrow = params.headSize || 0.2;
        const shaftThickness = (params.thickness || 2) + 2;
        const arrowDx = params.x2 - params.x1;
        const arrowDy = params.y2 - params.y1;
        const arrowDz = params.z2 - params.z1;
        const arrowLength = Math.sqrt(
          arrowDx * arrowDx + arrowDy * arrowDy + arrowDz * arrowDz
        );

        if (arrowLength > 0) {
          // Normalize direction
          const ndx = arrowDx / arrowLength;
          const ndy = arrowDy / arrowLength;
          const ndz = arrowDz / arrowLength;

          // Calculate head length and base position
          const headLength = headSizeArrow * 20;
          const headBaseX = params.x2 - ndx * headLength;
          const headBaseY = params.y2 - ndy * headLength;
          const headBaseZ = params.z2 - ndz * headLength;

          // Create shaft interaction box (from start to head base)
          const shaftCenterX = (params.x1 + headBaseX) * 0.5;
          const shaftCenterY = (params.y1 + headBaseY) * 0.5;
          const shaftCenterZ = (params.z1 + headBaseZ) * 0.5;

          this.addOrientedBoxTriangles(
            triangles,
            shaftCenterX,
            shaftCenterY,
            shaftCenterZ,
            shaftThickness,
            shaftThickness,
            arrowLength - headLength,
            params.x1,
            params.y1,
            params.z1,
            headBaseX,
            headBaseY,
            headBaseZ
          );

          // Create head interaction triangles (simplified cone as larger box)
          const headRadius = headSizeArrow * 10; // Make head interaction area larger
          const headCenterX = (headBaseX + params.x2) * 0.5;
          const headCenterY = (headBaseY + params.y2) * 0.5;
          const headCenterZ = (headBaseZ + params.z2) * 0.5;

          this.addOrientedBoxTriangles(
            triangles,
            headCenterX,
            headCenterY,
            headCenterZ,
            headRadius * 2,
            headRadius * 2,
            headLength,
            headBaseX,
            headBaseY,
            headBaseZ,
            params.x2,
            params.y2,
            params.z2
          );
        }
        break;

      case "arrow3DFromLength":
        // Create proper interaction triangles for 3D arrow (shaft + head)
        const headSizeArrow2 = params.headSize || 0.2;
        const shaftThickness2 = (params.thickness || 2) + 2;
        const arrowDx2 = params.dx;
        const arrowDy2 = params.dy;
        const arrowDz2 = params.dz;
        const arrowLength2 = params.length || 100;

        if (arrowLength2 > 0) {
          // Normalize direction
          const ndx = arrowDx2 / arrowLength2;
          const ndy = arrowDy2 / arrowLength2;
          const ndz = arrowDz2 / arrowLength2;

          // Calculate head length and base position
          const headLength = headSizeArrow2 * 20;
          const headBaseX = params.x2 - ndx * headLength;
          const headBaseY = params.y2 - ndy * headLength;
          const headBaseZ = params.z2 - ndz * headLength;

          // Create shaft interaction box (from start to head base)
          const shaftCenterX = (params.x1 + headBaseX) * 0.5;
          const shaftCenterY = (params.y1 + headBaseY) * 0.5;
          const shaftCenterZ = (params.z1 + headBaseZ) * 0.5;

          this.addOrientedBoxTriangles(
            triangles,
            shaftCenterX,
            shaftCenterY,
            shaftCenterZ,
            shaftThickness2,
            shaftThickness2,
            arrowLength2 - headLength,
            params.x1,
            params.y1,
            params.z1,
            headBaseX,
            headBaseY,
            headBaseZ
          );

          // Create head interaction triangles (simplified cone as larger box)
          const headRadius = headSizeArrow2 * 10; // Make head interaction area larger
          const headCenterX = (headBaseX + params.x2) * 0.5;
          const headCenterY = (headBaseY + params.y2) * 0.5;
          const headCenterZ = (headBaseZ + params.z2) * 0.5;

          const arrowX2 = params.x1 + arrowDx2 * arrowLength2;
          const arrowY2 = params.y1 + arrowDy2 * arrowLength2;
          const arrowZ2 = params.z1 + arrowDz2 * arrowLength2;

          this.addOrientedBoxTriangles(
            triangles,
            headCenterX,
            headCenterY,
            headCenterZ,
            headRadius * 2,
            headRadius * 2,
            headLength,
            headBaseX,
            headBaseY,
            headBaseZ,
            arrowX2,
            arrowY2,
            arrowZ2
          );
        }
        break;

      case "rotationRing":
        // Create interaction triangles for rotation ring (proper torus geometry)
        const ringRadius = params.radius || 50;
        const ringThickness = (params.thickness || 2) + 3; // Add padding for interaction
        const ringSegments = Math.max(8, Math.min(32, params.segments || 16)); // Reasonable segment count
        const tubeSegments = Math.max(
          4,
          Math.min(12, params.tubeSegments || 6)
        ); // Segments around the tube

        this.addTorusTriangles(
          triangles,
          params.x,
          params.y,
          params.z,
          ringRadius,
          ringThickness,
          ringSegments,
          tubeSegments,
          params.normal || [0, 0, 1] // Default to Z-axis normal
        );
        break;

      case "scaleHandle":
        // Create interaction triangles for scale handle (line + cube)
        const handleDirection = params.direction || [1, 0, 0];
        const handleLength = params.lineLength || 50;
        const handleThickness = (params.thickness || 2) + 2;
        const handleSize = (params.handleSize || 8) + 2;

        // Normalize direction
        const dirLen = Math.sqrt(
          handleDirection[0] * handleDirection[0] +
            handleDirection[1] * handleDirection[1] +
            handleDirection[2] * handleDirection[2]
        );
        const normDir =
          dirLen > 0
            ? [
                handleDirection[0] / dirLen,
                handleDirection[1] / dirLen,
                handleDirection[2] / dirLen,
              ]
            : [1, 0, 0];

        const endX = params.x + normDir[0] * handleLength;
        const endY = params.y + normDir[1] * handleLength;
        const endZ = params.z + normDir[2] * handleLength;

        // Line interaction triangles
        const lineCenterX = (params.x + endX) * 0.5;
        const lineCenterY = (params.y + endY) * 0.5;
        const lineCenterZ = (params.z + endZ) * 0.5;

        this.addOrientedBoxTriangles(
          triangles,
          lineCenterX,
          lineCenterY,
          lineCenterZ,
          handleThickness,
          handleThickness,
          handleLength,
          params.x,
          params.y,
          params.z,
          endX,
          endY,
          endZ
        );

        // Handle cube interaction triangles
        this.addBoxTriangles(
          triangles,
          endX,
          endY,
          endZ,
          handleSize,
          handleSize,
          handleSize
        );
        break;

      case "cornerScaleHandle":
        // Create interaction triangles for corner scale handle (just a cube).
        // Make the hit cube noticeably larger than the visual cube so the
        // handles are easy to grab (they were nearly impossible to hit at +2).
        const cornerSize = (params.handleSize || 12) * 1.8 + 4;
        this.addBoxTriangles(
          triangles,
          params.x,
          params.y,
          params.z,
          cornerSize,
          cornerSize,
          cornerSize
        );
        break;

      default:
        // No interaction triangles for unknown types
        break;
    }

    return triangles;
  }

  // Helper method to add box triangles
  addBoxTriangles(triangles, centerX, centerY, centerZ, width, height, depth) {
    const halfW = width * 0.5;
    const halfH = height * 0.5;
    const halfD = depth * 0.5;

    // Define 8 vertices of the box
    const vertices = [
      { x: centerX - halfW, y: centerY - halfH, zElevation: centerZ - halfD }, // 0
      { x: centerX + halfW, y: centerY - halfH, zElevation: centerZ - halfD }, // 1
      { x: centerX + halfW, y: centerY + halfH, zElevation: centerZ - halfD }, // 2
      { x: centerX - halfW, y: centerY + halfH, zElevation: centerZ - halfD }, // 3
      { x: centerX - halfW, y: centerY - halfH, zElevation: centerZ + halfD }, // 4
      { x: centerX + halfW, y: centerY - halfH, zElevation: centerZ + halfD }, // 5
      { x: centerX + halfW, y: centerY + halfH, zElevation: centerZ + halfD }, // 6
      { x: centerX - halfW, y: centerY + halfH, zElevation: centerZ + halfD }, // 7
    ];

    // 12 triangles (2 per face, 6 faces)
    const faces = [
      [0, 1, 2],
      [0, 2, 3], // Bottom face
      [4, 7, 6],
      [4, 6, 5], // Top face
      [0, 4, 5],
      [0, 5, 1], // Front face
      [2, 6, 7],
      [2, 7, 3], // Back face
      [0, 3, 7],
      [0, 7, 4], // Left face
      [1, 5, 6],
      [1, 6, 2], // Right face
    ];

    faces.forEach((face) => {
      triangles.push([vertices[face[0]], vertices[face[1]], vertices[face[2]]]);
    });
  }

  // Helper method to add oriented box triangles along a direction
  addOrientedBoxTriangles(
    triangles,
    centerX,
    centerY,
    centerZ,
    width,
    height,
    length,
    x1,
    y1,
    z1,
    x2,
    y2,
    z2
  ) {
    // Calculate direction vector and normalize it
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dz = z2 - z1;
    const dirLength = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (dirLength === 0) {
      // Fallback to axis-aligned box if no direction
      this.addBoxTriangles(
        triangles,
        centerX,
        centerY,
        centerZ,
        width,
        height,
        length
      );
      return;
    }

    const dirX = dx / dirLength;
    const dirY = dy / dirLength;
    const dirZ = dz / dirLength;

    // Find two perpendicular vectors to the direction
    let perpX1, perpY1, perpZ1;
    let perpX2, perpY2, perpZ2;

    // Choose a vector that's not parallel to direction
    if (Math.abs(dirX) < 0.9) {
      // Cross product with X axis
      perpX1 = 0;
      perpY1 = dirZ;
      perpZ1 = -dirY;
    } else {
      // Cross product with Y axis
      perpX1 = dirZ;
      perpY1 = 0;
      perpZ1 = -dirX;
    }

    // Normalize first perpendicular vector
    const perpLen1 = Math.sqrt(
      perpX1 * perpX1 + perpY1 * perpY1 + perpZ1 * perpZ1
    );
    if (perpLen1 > 0) {
      perpX1 /= perpLen1;
      perpY1 /= perpLen1;
      perpZ1 /= perpLen1;
    }

    // Second perpendicular vector = direction × first perpendicular
    perpX2 = dirY * perpZ1 - dirZ * perpY1;
    perpY2 = dirZ * perpX1 - dirX * perpZ1;
    perpZ2 = dirX * perpY1 - dirY * perpX1;

    // Scale by dimensions
    const halfWidth = width * 0.5;
    const halfHeight = height * 0.5;
    const halfLength = length * 0.5;

    perpX1 *= halfWidth;
    perpY1 *= halfWidth;
    perpZ1 *= halfWidth;
    perpX2 *= halfHeight;
    perpY2 *= halfHeight;
    perpZ2 *= halfHeight;

    const lengthOffsetX = dirX * halfLength;
    const lengthOffsetY = dirY * halfLength;
    const lengthOffsetZ = dirZ * halfLength;

    // Calculate 8 corners of the oriented box
    const corners = [
      // Back face (negative length direction)
      [
        centerX - lengthOffsetX - perpX1 - perpX2,
        centerY - lengthOffsetY - perpY1 - perpY2,
        centerZ - lengthOffsetZ - perpZ1 - perpZ2,
      ], // 0
      [
        centerX - lengthOffsetX + perpX1 - perpX2,
        centerY - lengthOffsetY + perpY1 - perpY2,
        centerZ - lengthOffsetZ + perpZ1 - perpZ2,
      ], // 1
      [
        centerX - lengthOffsetX + perpX1 + perpX2,
        centerY - lengthOffsetY + perpY1 + perpY2,
        centerZ - lengthOffsetZ + perpZ1 + perpZ2,
      ], // 2
      [
        centerX - lengthOffsetX - perpX1 + perpX2,
        centerY - lengthOffsetY - perpY1 + perpY2,
        centerZ - lengthOffsetZ - perpZ1 + perpZ2,
      ], // 3
      // Front face (positive length direction)
      [
        centerX + lengthOffsetX - perpX1 - perpX2,
        centerY + lengthOffsetY - perpY1 - perpY2,
        centerZ + lengthOffsetZ - perpZ1 - perpZ2,
      ], // 4
      [
        centerX + lengthOffsetX + perpX1 - perpX2,
        centerY + lengthOffsetY + perpY1 - perpY2,
        centerZ + lengthOffsetZ + perpZ1 - perpZ2,
      ], // 5
      [
        centerX + lengthOffsetX + perpX1 + perpX2,
        centerY + lengthOffsetY + perpY1 + perpY2,
        centerZ + lengthOffsetZ + perpZ1 + perpZ2,
      ], // 6
      [
        centerX + lengthOffsetX - perpX1 + perpX2,
        centerY + lengthOffsetY - perpY1 + perpY2,
        centerZ + lengthOffsetZ - perpZ1 + perpZ2,
      ], // 7
    ];

    // Convert corners to vertices with proper zElevation field
    const vertices = corners.map((corner) => ({
      x: corner[0],
      y: corner[1],
      zElevation: corner[2],
    }));

    // Define the 12 triangular faces of the box
    const faces = [
      [0, 1, 2],
      [0, 2, 3], // Back face
      [4, 7, 6],
      [4, 6, 5], // Front face
      [0, 4, 5],
      [0, 5, 1], // Bottom face
      [2, 6, 7],
      [2, 7, 3], // Top face
      [0, 3, 7],
      [0, 7, 4], // Left face
      [1, 5, 6],
      [1, 6, 2], // Right face
    ];

    faces.forEach((face) => {
      triangles.push([vertices[face[0]], vertices[face[1]], vertices[face[2]]]);
    });
  }

  // Helper method to add torus triangles for rotation rings
  addTorusTriangles(
    triangles,
    centerX,
    centerY,
    centerZ,
    majorRadius,
    minorRadius,
    majorSegments,
    minorSegments,
    normal = [0, 0, 1]
  ) {
    // Normalize the normal vector
    const normalLength = Math.sqrt(
      normal[0] * normal[0] + normal[1] * normal[1] + normal[2] * normal[2]
    );
    const nx = normal[0] / normalLength;
    const ny = normal[1] / normalLength;
    const nz = normal[2] / normalLength;

    // Create two perpendicular vectors to the normal
    let u1X, u1Y, u1Z; // First tangent vector
    let u2X, u2Y, u2Z; // Second tangent vector

    // Choose a vector that's not parallel to normal
    if (Math.abs(nx) < 0.9) {
      // Cross product with X axis
      u1X = 0;
      u1Y = nz;
      u1Z = -ny;
    } else {
      // Cross product with Y axis
      u1X = nz;
      u1Y = 0;
      u1Z = -nx;
    }

    // Normalize first tangent vector
    const u1Length = Math.sqrt(u1X * u1X + u1Y * u1Y + u1Z * u1Z);
    if (u1Length > 0) {
      u1X /= u1Length;
      u1Y /= u1Length;
      u1Z /= u1Length;
    }

    // Second tangent vector = normal × first tangent
    u2X = ny * u1Z - nz * u1Y;
    u2Y = nz * u1X - nx * u1Z;
    u2Z = nx * u1Y - ny * u1X;

    // Generate torus vertices
    const vertices = [];
    for (let i = 0; i <= majorSegments; i++) {
      const majorAngle = (i / majorSegments) * Math.PI * 2;
      const cosMajor = Math.cos(majorAngle);
      const sinMajor = Math.sin(majorAngle);

      // Point on the major circle
      const majorPointX =
        centerX + majorRadius * (u1X * cosMajor + u2X * sinMajor);
      const majorPointY =
        centerY + majorRadius * (u1Y * cosMajor + u2Y * sinMajor);
      const majorPointZ =
        centerZ + majorRadius * (u1Z * cosMajor + u2Z * sinMajor);

      // Tangent to the major circle at this point
      const tangentX = -u1X * sinMajor + u2X * cosMajor;
      const tangentY = -u1Y * sinMajor + u2Y * cosMajor;
      const tangentZ = -u1Z * sinMajor + u2Z * cosMajor;

      // Binormal = normal × tangent
      const binormalX = ny * tangentZ - nz * tangentY;
      const binormalY = nz * tangentX - nx * tangentZ;
      const binormalZ = nx * tangentY - ny * tangentX;

      const row = [];
      for (let j = 0; j <= minorSegments; j++) {
        const minorAngle = (j / minorSegments) * Math.PI * 2;
        const cosMinor = Math.cos(minorAngle);
        const sinMinor = Math.sin(minorAngle);

        // Calculate vertex position
        const vertexX =
          majorPointX + minorRadius * (nx * cosMinor + binormalX * sinMinor);
        const vertexY =
          majorPointY + minorRadius * (ny * cosMinor + binormalY * sinMinor);
        const vertexZ =
          majorPointZ + minorRadius * (nz * cosMinor + binormalZ * sinMinor);

        row.push({
          x: vertexX,
          y: vertexY,
          zElevation: vertexZ,
        });
      }
      vertices.push(row);
    }

    // Generate triangles
    for (let i = 0; i < majorSegments; i++) {
      for (let j = 0; j < minorSegments; j++) {
        const v1 = vertices[i][j];
        const v2 = vertices[i + 1][j];
        const v3 = vertices[i + 1][j + 1];
        const v4 = vertices[i][j + 1];

        // Two triangles per quad
        triangles.push([v1, v2, v3]);
        triangles.push([v1, v3, v4]);
      }
    }
  }
}
