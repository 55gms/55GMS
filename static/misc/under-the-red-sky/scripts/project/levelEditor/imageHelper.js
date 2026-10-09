const ImageCache = new Map();

export async function getImageFromObject(objectType, animation = null) {
  let key = animation ? `${objectType}_${animation}` : objectType;

  if (ImageCache.has(key)) {
    return ImageCache.get(key);
  }

  const objectClass = globalThis.sdk_runtime._objectClassesByName.get(
    objectType.toLowerCase(),
  );
  if (!objectClass) return null;
  let imageInfo;
  if (objectClass._imageInfo) {
    imageInfo = objectClass._imageInfo;
  } else if (animation) {
    imageInfo = objectClass.GetAnimationByName(animation)._frames[0]._imageInfo;
  } else {
    imageInfo = objectClass._animations[0]._frames[0]._imageInfo;
  }
  const res = await imageInfo.ExtractImageToBlobURL();
  ImageCache.set(key, res);
  return res;
}

export async function getAllImagesFromObject(objectType) {
  const objectClass = globalThis.sdk_runtime._objectClassesByName.get(
    objectType.toLowerCase(),
  );
  if (!objectClass || !objectClass._animations) return [];

  return await Promise.all(
    objectClass._animations.map((x) =>
      x._frames[0]._imageInfo.ExtractImageToBlobURL(),
    ),
  );
}

// ============================================
// CSS CUBE UTILITY
// ============================================
/**
 * Creates a CSS 3D cube using six image sources for all faces
 * @param {string} topSrc - Image source for the top face
 * @param {string} leftSrc - Image source for the left face
 * @param {string} rightSrc - Image source for the right face
 * @param {number} size - Width of the cube in pixels (default: 48)
 * @param {number} height - Height ratio of the cube (default: 1, meaning same as size)
 * @param {string} frontSrc - Image source for the front face (optional, defaults to leftSrc)
 * @param {string} backSrc - Image source for the back face (optional, defaults to rightSrc)
 * @param {string} bottomSrc - Image source for the bottom face (optional, defaults to topSrc)
 * @param {number} depth - Depth ratio of the cube (default: 1, meaning same as size)
 * @param {number} topVisibility - Additional X rotation in degrees to show more of the top face (default: 0)
 * @returns {HTMLElement} The root element containing the CSS cube
 */
export function createCSSCube(
  topSrc,
  leftSrc,
  rightSrc,
  size = 48,
  height = null,
  frontSrc = null,
  backSrc = null,
  bottomSrc = null,
  depth = null,
  topVisibility = 0,
) {
  const cubeHeight = height !== null ? size * height : size;
  const cubeDepth = depth !== null ? size * depth : size;
  const baseXRotation = -15 - topVisibility; // More negative = more top visible
  const cube = document.createElement("div");
  cube.className = "css-cube";
  cube.style.width = size + "px";
  cube.style.height = size + "px";
  cube.style.position = "relative";
  cube.style.perspective = "none";
  cube.style.transformStyle = "preserve-3d";
  cube.style.transform = `rotateX(${baseXRotation}deg) rotateY(25deg)`;
  cube.style.setProperty("--cube-x-rotation", `${baseXRotation}deg`);
  cube.style.margin = "auto";

  const faceContainer = document.createElement("div");
  faceContainer.style.width = size + "px";
  faceContainer.style.height = size + "px";
  faceContainer.style.position = "relative";
  faceContainer.style.perspective = "none";
  faceContainer.style.transformStyle = "preserve-3d";
  faceContainer.style.transform = `translateY(${(size - cubeHeight) / 2}px)`;
  faceContainer.style.margin = "auto";

  const faces = [
    {
      name: "top",
      src: topSrc,
      transform: `rotateX(90deg) translateZ(${cubeDepth / 2}px)`,
      width: size,
      height: cubeDepth,
    },
    {
      name: "left",
      src: leftSrc,
      transform: `rotateY(-90deg) translateZ(${cubeDepth / 2}px)`,
      width: cubeDepth,
      height: cubeHeight,
    },
    {
      name: "right",
      src: rightSrc,
      transform: `rotateY(90deg) translateZ(${size - cubeDepth / 2}px)`,
      width: cubeDepth,
      height: cubeHeight,
    },
    {
      name: "front",
      src: frontSrc || leftSrc,
      transform: `translateZ(${cubeDepth / 2}px)`,
      width: size,
      height: cubeHeight,
    },
    {
      name: "back",
      src: backSrc || rightSrc,
      transform: `rotateY(180deg) translateZ(${cubeDepth / 2}px)`,
      width: size,
      height: cubeHeight,
    },
    {
      name: "bottom",
      src: bottomSrc || topSrc,
      transform: `rotateX(-90deg) translateZ(${cubeHeight - cubeDepth / 2}px)`,
      width: size,
      height: cubeDepth,
    },
  ];

  faces.forEach((face) => {
    const faceElement = document.createElement("div");
    faceElement.className = `cube-face cube-face-${face.name}`;
    faceElement.style.position = "absolute";
    faceElement.style.width = face.width + "px";
    faceElement.style.height = face.height + "px";
    faceElement.style.backgroundImage = `url(${face.src})`;
    faceElement.style.backgroundSize = "cover";
    faceElement.style.backgroundPosition = "center";
    faceElement.style.perspective = "none";
    faceElement.style.transform = face.transform;
    faceElement.style.border = "1px solid rgba(255,255,255,0.1)";
    faceElement.style.backfaceVisibility = "visible";
    faceElement.style.transformOrigin = "center center";

    faceContainer.appendChild(faceElement);
  });

  cube.appendChild(faceContainer);
  return cube;
}

// ============================================
// CUBE FACE LOADING UTILITY
// ============================================
/**
 * Loads all 6 faces for a CSS cube from a cube configuration object
 * @param {Object} cubeConfig - Configuration object containing cube face sources
 * @param {string|Function} cubeConfig.top - Image source or function for the top face
 * @param {string|Function} cubeConfig.left - Image source or function for the left face
 * @param {string|Function} cubeConfig.right - Image source or function for the right face
 * @param {string|Function} [cubeConfig.front] - Image source or function for the front face (optional, defaults to left)
 * @param {string|Function} [cubeConfig.back] - Image source or function for the back face (optional, defaults to right)
 * @param {string|Function} [cubeConfig.bottom] - Image source or function for the bottom face (optional, defaults to top)
 * @returns {Promise<Object>} Object containing all 6 face image sources
 */
export async function loadCubeFaces(cubeConfig) {
  const faces = {};

  // Load all 6 faces if available, otherwise use the 3 provided faces
  faces.top =
    typeof cubeConfig.top === "function"
      ? await cubeConfig.top()
      : cubeConfig.top;
  faces.left =
    typeof cubeConfig.left === "function"
      ? await cubeConfig.left()
      : cubeConfig.left;
  faces.right =
    typeof cubeConfig.right === "function"
      ? await cubeConfig.right()
      : cubeConfig.right;

  // Use additional faces if provided, otherwise reuse existing ones
  faces.front = cubeConfig.front
    ? typeof cubeConfig.front === "function"
      ? await cubeConfig.front()
      : cubeConfig.front
    : faces.left;
  faces.back = cubeConfig.back
    ? typeof cubeConfig.back === "function"
      ? await cubeConfig.back()
      : cubeConfig.back
    : faces.right;
  faces.bottom = cubeConfig.bottom
    ? typeof cubeConfig.bottom === "function"
      ? await cubeConfig.bottom()
      : cubeConfig.bottom
    : faces.top;

  return faces;
}
