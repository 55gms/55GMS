// uploadSpinner.js — self-contained animated "runner" for the upload-progress dialog.
//
// A tiny forward-kinematics skeletal player. It runs a fixed clip sequence
// (baked below from the animation editor) using the game's shortest-path angle
// tween + transition-duration logic, and draws a stick figure with the Steam
// logo as its head onto a canvas. No external deps.
//
//   const handle = mountUploadSpinner(container, { primary, background });
//   handle.stop();   // cancels the loop and removes the canvas
//
// To retune: open the animation editor, tweak, "Copy config", and paste the
// JSON into CONFIG below (and add any newly-referenced clips to CLIPS).

// ── baked animation clips (only the ones the sequence uses) ──────────────────
const CLIPS = {"sprint":{"duration":0.3,"loop":true,"tracks":{"hip":[{"time":0,"value":0,"easing":"linear"},{"time":0.2498,"value":0,"easing":"linear"},{"time":0.5004,"value":0,"easing":"linear"},{"time":0.7518,"value":0,"easing":"linear"}],"spine":[{"time":0,"value":-0.895,"easing":"linear"},{"time":0.1003,"value":-1.0582,"easing":"linear"},{"time":0.2989,"value":-0.8901,"easing":"linear"}],"neck":[{"time":0,"value":0.2301,"easing":"linear"},{"time":0.1003,"value":0.4213,"easing":"linear"},{"time":0.2989,"value":0.2269,"easing":"linear"}],"head":[{"time":0,"value":0.0617,"easing":"linear"},{"time":0.1003,"value":-0.0318,"easing":"linear"},{"time":0.2989,"value":0.0698,"easing":"linear"}],"upperArmL":[{"time":0,"value":1.8788,"easing":"linear"},{"time":0.1003,"value":1.805,"easing":"linear"},{"time":0.2989,"value":-1.9854,"easing":"linear"},{"time":0.6,"value":-0.192,"easing":"linear"}],"lowerArmL":[{"time":0,"value":-0.6375,"easing":"linear"},{"time":0.1003,"value":-1.0899,"easing":"linear"},{"time":0.2989,"value":-0.6458,"easing":"linear"}],"upperArmR":[{"time":0,"value":-1.9132,"easing":"linear"},{"time":0.1003,"value":-1.6727,"easing":"linear"},{"time":0.2989,"value":1.885,"easing":"linear"}],"lowerArmR":[{"time":0,"value":-0.3447,"easing":"linear"},{"time":0.1003,"value":-1.0568,"easing":"linear"},{"time":0.2989,"value":-0.3491,"easing":"linear"}],"upperLegL":[{"time":0,"value":-0.0065,"easing":"linear"},{"time":0.1003,"value":0.6172,"easing":"linear"},{"time":0.2006,"value":2.0258,"easing":"linear"},{"time":0.2989,"value":2.2864,"easing":"linear"}],"lowerLegL":[{"time":0,"value":0.5111,"easing":"linear"},{"time":0.1003,"value":0.8907,"easing":"linear"},{"time":0.2006,"value":0.0655,"easing":"linear"},{"time":0.2989,"value":0.5061,"easing":"linear"}],"upperLegR":[{"time":0,"value":2.2844,"easing":"linear"},{"time":0.1003,"value":2.1951,"easing":"linear"},{"time":0.2006,"value":0.5323,"easing":"linear"},{"time":0.2989,"value":0,"easing":"linear"}],"lowerLegR":[{"time":0,"value":0.4,"easing":"linear"},{"time":0.1003,"value":2.217,"easing":"linear"},{"time":0.2006,"value":2.4139,"easing":"linear"},{"time":0.2989,"value":0.4014,"easing":"linear"}]}},"vault":{"duration":0.3,"loop":false,"tracks":{"spine":[{"time":0,"value":-1.0466,"easing":"linear"},{"time":0.0572,"value":-0.6992,"easing":"linear"},{"time":0.1017,"value":-0.7004,"easing":"linear"},{"time":0.1934,"value":-0.74,"easing":"linear"},{"time":0.2984,"value":-1.3093,"easing":"linear"}],"neck":[{"time":0,"value":0.2823,"easing":"linear"},{"time":0.1017,"value":0.3681,"easing":"linear"},{"time":0.1934,"value":0.3012,"easing":"linear"},{"time":0.2984,"value":0.3109,"easing":"linear"}],"head":[{"time":0,"value":0.1316,"easing":"linear"},{"time":0.1017,"value":0.5245,"easing":"linear"},{"time":0.1934,"value":-0.5444,"easing":"linear"},{"time":0.2984,"value":-0.1277,"easing":"linear"}],"upperArmL":[{"time":0,"value":1.695,"easing":"linear"},{"time":0.0572,"value":1.1563,"easing":"linear"},{"time":0.1016,"value":1.3215,"easing":"linear"},{"time":0.1934,"value":2.4714,"easing":"linear"},{"time":0.2984,"value":-2.5689,"easing":"linear"}],"lowerArmL":[{"time":0,"value":-0.181,"easing":"linear"},{"time":0.1016,"value":-0.2985,"easing":"linear"},{"time":0.2984,"value":-0.6681,"easing":"linear"}],"upperArmR":[{"time":0,"value":2.0991,"easing":"linear"},{"time":0.0572,"value":1.5801,"easing":"linear"},{"time":0.1016,"value":1.8351,"easing":"linear"},{"time":0.1934,"value":1.756,"easing":"linear"},{"time":0.2984,"value":2.3532,"easing":"linear"}],"lowerArmR":[{"time":0,"value":-0.2871,"easing":"linear"},{"time":0.1016,"value":-0.2349,"easing":"linear"},{"time":0.1934,"value":0.0929,"easing":"linear"},{"time":0.2984,"value":-0.4499,"easing":"linear"}],"upperLegL":[{"time":0,"value":2.0723,"easing":"linear"},{"time":0.1016,"value":2.1409,"easing":"linear"},{"time":0.1934,"value":2.2261,"easing":"linear"},{"time":0.2984,"value":2.24,"easing":"linear"}],"lowerLegL":[{"time":0,"value":0.1157,"easing":"linear"},{"time":0.1016,"value":0.1172,"easing":"linear"},{"time":0.1934,"value":0.294,"easing":"linear"},{"time":0.2984,"value":0.9008,"easing":"linear"}],"upperLegR":[{"time":0,"value":-0.0652,"easing":"linear"},{"time":0.1016,"value":0.2836,"easing":"linear"},{"time":0.1934,"value":-0.3083,"easing":"linear"},{"time":0.2984,"value":0.1489,"easing":"linear"}],"lowerLegR":[{"time":0,"value":2.3755,"easing":"linear"},{"time":0.1016,"value":2.1588,"easing":"linear"},{"time":0.1934,"value":2.3655,"easing":"linear"},{"time":0.2984,"value":1.9711,"easing":"linear"}]}},"jumpVault":{"duration":0.5,"loop":false,"tracks":{"spine":[{"time":0,"value":-0.9775,"easing":"linear"},{"time":0.047,"value":-1.0157,"easing":"easeOutBack"},{"time":0.2019,"value":-1.7893,"easing":"easeIn"},{"time":0.4043,"value":-1.504,"easing":"linear"}],"neck":[{"time":0,"value":0.848,"easing":"linear"},{"time":0.047,"value":0.7684,"easing":"easeOutBack"},{"time":0.2019,"value":-0.2203,"easing":"easeIn"},{"time":0.4043,"value":0.1892,"easing":"linear"}],"head":[{"time":0,"value":0.5986,"easing":"linear"},{"time":0.047,"value":0.5216,"easing":"easeOutBack"},{"time":0.2019,"value":-0.1055,"easing":"easeIn"},{"time":0.4043,"value":-0.0385,"easing":"linear"}],"upperArmL":[{"time":0,"value":1.2727,"easing":"linear"},{"time":0.047,"value":1.4712,"easing":"easeOutBack"},{"time":0.2019,"value":-2.0181,"easing":"easeIn"},{"time":0.4043,"value":2.9164,"easing":"linear"}],"lowerArmL":[{"time":0,"value":-1.1894,"easing":"linear"},{"time":0.047,"value":-1.1463,"easing":"easeOutBack"},{"time":0.2019,"value":-0.4627,"easing":"easeIn"},{"time":0.4043,"value":-0.8324,"easing":"linear"}],"upperArmR":[{"time":0,"value":3.0139,"easing":"linear"},{"time":0.047,"value":3.107,"easing":"easeOutBack"},{"time":0.2019,"value":-1.4118,"easing":"easeIn"},{"time":0.4043,"value":-2.4989,"easing":"linear"}],"lowerArmR":[{"time":0,"value":-0.6135,"easing":"linear"},{"time":0.047,"value":-0.6135,"easing":"easeOutBack"},{"time":0.2019,"value":-0.6135,"easing":"easeIn"},{"time":0.4043,"value":-0.6135,"easing":"linear"}],"upperLegL":[{"time":0,"value":-0.4348,"easing":"linear"},{"time":0.047,"value":-0.3357,"easing":"easeOutBack"},{"time":0.2019,"value":1.688,"easing":"easeIn"},{"time":0.4043,"value":0.3852,"easing":"linear"}],"lowerLegL":[{"time":0,"value":1.7593,"easing":"linear"},{"time":0.047,"value":1.6364,"easing":"easeOutBack"},{"time":0.2019,"value":0.6496,"easing":"easeIn"},{"time":0.4043,"value":0.7418,"easing":"linear"}],"upperLegR":[{"time":0,"value":-0.185,"easing":"linear"},{"time":0.047,"value":-0.0731,"easing":"easeOutBack"},{"time":0.2019,"value":2.2955,"easing":"easeIn"},{"time":0.4043,"value":0.7414,"easing":"linear"}],"lowerLegR":[{"time":0,"value":2.7947,"easing":"linear"},{"time":0.047,"value":2.5546,"easing":"easeOutBack"},{"time":0.2019,"value":0.1272,"easing":"easeIn"},{"time":0.4043,"value":0.8071,"easing":"linear"}]}},"longFall":{"duration":0.5,"loop":true,"tracks":{"spine":[{"time":0.0005,"value":-1.5708,"easing":"linear"},{"time":0.0916,"value":-1.4744,"easing":"linear"},{"time":0.3057,"value":-1.7681,"easing":"linear"},{"time":0.4997,"value":-1.5708,"easing":"linear"}],"neck":[{"time":0.0005,"value":0.1971,"easing":"linear"},{"time":0.0916,"value":0.4629,"easing":"linear"},{"time":0.3057,"value":0.2187,"easing":"linear"},{"time":0.4997,"value":0.1971,"easing":"linear"}],"head":[{"time":0.0005,"value":0,"easing":"linear"},{"time":0.0916,"value":0.6366,"easing":"linear"},{"time":0.3057,"value":0.1343,"easing":"linear"},{"time":0.4997,"value":0,"easing":"linear"}],"upperArmL":[{"time":0.0005,"value":-2.7965,"easing":"linear"},{"time":0.1087,"value":-1.4187,"easing":"linear"},{"time":0.278,"value":0.8583,"easing":"linear"},{"time":0.3057,"value":1.2274,"easing":"linear"},{"time":0.422,"value":2.2461,"easing":"linear"},{"time":0.4997,"value":-2.8235,"easing":"linear"}],"lowerArmL":[{"time":0.0005,"value":-0.3623,"easing":"linear"},{"time":0.1087,"value":-0.0727,"easing":"linear"},{"time":0.278,"value":0.4398,"easing":"linear"},{"time":0.3057,"value":0.4287,"easing":"linear"},{"time":0.422,"value":0.5126,"easing":"linear"},{"time":0.4997,"value":-0.0117,"easing":"linear"}],"upperArmR":[{"time":0.0005,"value":-2.1999,"easing":"linear"},{"time":0.1087,"value":-0.8105,"easing":"linear"},{"time":0.278,"value":1.463,"easing":"linear"},{"time":0.3057,"value":2.0086,"easing":"linear"},{"time":0.422,"value":2.8661,"easing":"linear"},{"time":0.4997,"value":-2.7368,"easing":"linear"}],"lowerArmR":[{"time":0.0005,"value":-0.3637,"easing":"linear"},{"time":0.1087,"value":-0.0836,"easing":"linear"},{"time":0.278,"value":-0.4378,"easing":"linear"},{"time":0.3057,"value":-0.5224,"easing":"linear"},{"time":0.422,"value":-0.3697,"easing":"linear"},{"time":0.4997,"value":0.0351,"easing":"linear"}],"upperLegL":[{"time":0.0005,"value":0.3297,"easing":"linear"},{"time":0.0916,"value":-0.001,"easing":"linear"},{"time":0.278,"value":0.768,"easing":"linear"},{"time":0.3057,"value":0.7636,"easing":"linear"},{"time":0.422,"value":0.785,"easing":"linear"},{"time":0.4997,"value":0.3297,"easing":"linear"}],"lowerLegL":[{"time":0.0005,"value":0.4639,"easing":"linear"},{"time":0.0916,"value":0.8971,"easing":"linear"},{"time":0.3057,"value":0.5808,"easing":"linear"},{"time":0.4997,"value":0.4639,"easing":"linear"}],"upperLegR":[{"time":0.0005,"value":0.9597,"easing":"linear"},{"time":0.0916,"value":0.7211,"easing":"linear"},{"time":0.278,"value":1.471,"easing":"linear"},{"time":0.3057,"value":1.4536,"easing":"linear"},{"time":0.422,"value":1.2751,"easing":"linear"},{"time":0.4997,"value":0.9597,"easing":"linear"}],"lowerLegR":[{"time":0.0005,"value":0.8711,"easing":"linear"},{"time":0.0916,"value":0.6412,"easing":"linear"},{"time":0.3057,"value":0.2272,"easing":"linear"},{"time":0.422,"value":0.4288,"easing":"linear"},{"time":0.4997,"value":0.8711,"easing":"linear"}]}},"roll":{"duration":0.5,"loop":false,"tracks":{"spine":[{"time":0,"value":-1.2701,"easing":"linear"},{"time":0.0715,"value":-0.9007,"easing":"linear"},{"time":0.1345,"value":1.5041,"easing":"linear"},{"time":0.203,"value":2.8588,"easing":"linear"},{"time":0.2905,"value":-2.7716,"easing":"easeOutBack"},{"time":0.4989,"value":-1.5985,"easing":"linear"}],"neck":[{"time":0,"value":0.8243,"easing":"linear"},{"time":0.0715,"value":1.1591,"easing":"linear"},{"time":0.1345,"value":2.0463,"easing":"linear"},{"time":0.2905,"value":0.9964,"easing":"easeOutBack"},{"time":0.4989,"value":0.3664,"easing":"linear"}],"head":[{"time":0,"value":0,"easing":"linear"},{"time":0.0715,"value":1.0832,"easing":"linear"},{"time":0.2905,"value":0.4982,"easing":"easeOutBack"},{"time":0.4989,"value":0.4226,"easing":"linear"}],"upperArmL":[{"time":0,"value":0.6292,"easing":"linear"},{"time":0.2905,"value":1.897,"easing":"easeOutBack"},{"time":0.4989,"value":1.4179,"easing":"linear"}],"lowerArmL":[{"time":0,"value":2.5475,"easing":"linear"},{"time":0.1345,"value":0.8366,"easing":"linear"},{"time":0.2905,"value":-1.9207,"easing":"easeOutBack"}],"upperArmR":[{"time":0,"value":-2.7771,"easing":"linear"},{"time":0.0715,"value":2.4463,"easing":"linear"},{"time":0.4989,"value":-2.387,"easing":"linear"}],"lowerArmR":[{"time":0,"value":-2.4174,"easing":"linear"},{"time":0.0715,"value":-2.2581,"easing":"linear"},{"time":0.1345,"value":-2.6479,"easing":"linear"},{"time":0.2905,"value":-2.3877,"easing":"easeOutBack"},{"time":0.4989,"value":-2.3322,"easing":"linear"}],"upperLegL":[{"time":0,"value":0.2173,"easing":"linear"},{"time":0.0715,"value":0.5659,"easing":"linear"},{"time":0.1345,"value":2.6981,"easing":"linear"},{"time":0.2905,"value":-1.6672,"easing":"easeOutBack"},{"time":0.4989,"value":-0.6711,"easing":"linear"}],"lowerLegL":[{"time":0,"value":2.4792,"easing":"linear"},{"time":0.2905,"value":0.5736,"easing":"easeOutBack"},{"time":0.4989,"value":1.4693,"easing":"linear"}],"upperLegR":[{"time":0,"value":-0.2896,"easing":"linear"},{"time":0.0715,"value":0.2828,"easing":"linear"},{"time":0.1345,"value":2.5645,"easing":"linear"},{"time":0.2905,"value":-0.8628,"easing":"easeOutBack"},{"time":0.4989,"value":0.073,"easing":"linear"}],"lowerLegR":[{"time":0,"value":2.2427,"easing":"linear"},{"time":0.2905,"value":0.6994,"easing":"easeOutBack"},{"time":0.4989,"value":0.6992,"easing":"linear"}]}}};

// Minimal transition table (only entries the sequence resolves against; same
// wildcard-lookup rules as the game). Everything else falls back to DEFAULT.
const TRANSITIONS = { "any->vault": 0.05, "any->jumpVault": 0.2, "any->longFall": 0.2, "roll->any": 0.2 };
const DEFAULT_TRANSITION = 0.1;

// ── baked look (from the animation editor "Copy config") ─────────────────────
const CONFIG = {
  scale: 2.3, limbThickness: 5, headSize: 57, logoRotationDeg: -33, headOffset: 15,
  verticalPos: -35, floorY: 148, backing: "bg", outline: true,
  boneLengths: { spine: 8, neck: 4, head: 5, upperArm: 6, lowerArm: 5, upperLeg: 7, lowerLeg: 7 },
  sequence: ["sprint 1", "vault 0.2 -30", "jumpVault 0.5 20", "longFall 1 10", "roll 0.5 -50 0.7", "sprint 0.7"],
};
// ROOT_Y0 keeps the figure anchored to the same spot regardless of canvas height.
const CANVAS_W = 230, CANVAS_H = 200, ROOT_Y0 = 100;

// ── rig ──────────────────────────────────────────────────────────────────────
const BONES = {
  hip:{parent:null,len:"hip"}, spine:{parent:"hip",len:"spine"}, neck:{parent:"spine",len:"neck"},
  head:{parent:"neck",len:"head"},
  upperArmL:{parent:"neck",len:"upperArm"}, lowerArmL:{parent:"upperArmL",len:"lowerArm"},
  upperArmR:{parent:"neck",len:"upperArm"}, lowerArmR:{parent:"upperArmR",len:"lowerArm"},
  upperLegL:{parent:"hip",len:"upperLeg"},  lowerLegL:{parent:"upperLegL",len:"lowerLeg"},
  upperLegR:{parent:"hip",len:"upperLeg"},  lowerLegR:{parent:"upperLegR",len:"lowerLeg"},
};
const ORDER = ["spine","neck","head","upperArmL","lowerArmL","upperArmR","lowerArmR",
               "upperLegL","lowerLegL","upperLegR","lowerLegR"];
const LEN = { hip: 0, ...CONFIG.boneLengths };
const JB = { lowerArmL:{size:1,inv:true}, lowerArmR:{size:1,inv:true},
             lowerLegL:{size:3,inv:false}, lowerLegR:{size:3,inv:false} };

const STEAM_D = "M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C7.4,22 3.55,18.92 2.36,14.73L6.19,16.31C6.45,17.6 7.6,18.58 8.97,18.58C10.53,18.58 11.8,17.31 11.8,15.75V15.62L15.2,13.19H15.28C17.36,13.19 19.05,11.5 19.05,9.42C19.05,7.34 17.36,5.65 15.28,5.65C13.2,5.65 11.5,7.34 11.5,9.42V9.47L9.13,12.93L8.97,12.92C8.38,12.92 7.83,13.1 7.38,13.41L2,11.2C2.43,6.05 6.73,2 12,2M8.28,17.17C9.08,17.5 10,17.13 10.33,16.33C10.66,15.53 10.28,14.62 9.5,14.29L8.22,13.76C8.71,13.58 9.26,13.57 9.78,13.79C10.31,14 10.72,14.41 10.93,14.94C11.15,15.46 11.15,16.04 10.93,16.56C10.5,17.64 9.23,18.16 8.15,17.71C7.65,17.5 7.27,17.12 7.06,16.67L8.28,17.17M17.8,9.42C17.8,10.81 16.67,11.94 15.28,11.94C13.9,11.94 12.77,10.81 12.77,9.42A2.5,2.5 0 0,1 15.28,6.91C16.67,6.91 17.8,8.04 17.8,9.42M13.4,9.42C13.4,10.46 14.24,11.31 15.29,11.31C16.33,11.31 17.17,10.46 17.17,9.42C17.17,8.38 16.33,7.53 15.29,7.53C14.24,7.53 13.4,8.38 13.4,9.42Z";

// ── easings / sampling (ported from easings.js + animator.js) ────────────────
const EASE = {
  linear: t => t, easeIn: t => t*t, easeOut: t => t*(2-t),
  easeInOut: t => t<0.5 ? 2*t*t : -1+(4-2*t)*t,
  easeInBack: t => 2.70158*t*t*t - 1.70158*t*t,
  easeOutBack: t => 1 + 2.70158*Math.pow(t-1,3) + 1.70158*Math.pow(t-1,2),
  easeInOutBack: t => { const c = 1.70158*1.525;
    return t<0.5 ? (Math.pow(2*t,2)*((c+1)*2*t-c))/2 : (Math.pow(2*t-2,2)*((c+1)*(2*t-2)+c)+2)/2; },
};
const wrapAngle = a => a - Math.PI*2*Math.floor((a+Math.PI)/(Math.PI*2));
const lerpAngle = (a,b,t) => a + wrapAngle(b-a)*t;

function sampleTrack(track, time, duration, loop) {
  if (!track || !track.length) return 0;
  if (track.length === 1) return track[0].value;
  let t = time;
  if (loop && duration > 0) t = ((t % duration) + duration) % duration; else t = Math.min(t, duration);
  let prev = track[0], next = track[track.length - 1];
  for (let i = 0; i < track.length - 1; i++) {
    if (t >= track[i].time && t <= track[i + 1].time) { prev = track[i]; next = track[i + 1]; break; }
  }
  const span = next.time - prev.time, raw = span > 0 ? (t - prev.time) / span : 0;
  return lerpAngle(prev.value, next.value, (EASE[prev.easing] || EASE.linear)(raw));
}
function poseOf(name, t) {
  const c = CLIPS[name], p = {};
  for (const b in c.tracks) p[b] = sampleTrack(c.tracks[b], t, c.duration, c.loop !== false);
  return p;
}
function transDur(from, to) {
  if (TRANSITIONS[from + "->" + to] != null) return TRANSITIONS[from + "->" + to];
  if (TRANSITIONS["any->" + to] != null) return TRANSITIONS["any->" + to];
  if (TRANSITIONS[from + "->any"] != null) return TRANSITIONS[from + "->any"];
  if (TRANSITIONS["any->any"] != null) return TRANSITIONS["any->any"];
  return DEFAULT_TRANSITION;
}

// ── forward kinematics ───────────────────────────────────────────────────────
function resolve(pose, rootX, rootY, scale) {
  const J = {};
  (function compute(name, sx, sy, pang) {
    const ang = pang + (pose[name] || 0), L = LEN[BONES[name].len] * scale;
    J[name] = { x: sx, y: sy, ang, ex: sx + Math.cos(ang) * L, ey: sy + Math.sin(ang) * L };
    for (const c in BONES) if (BONES[c].parent === name) compute(c, J[name].ex, J[name].ey, ang);
  })("hip", rootX, rootY, 0);
  return J;
}

const steamPath = new Path2D(STEAM_D);

// Parse "name duration [verticalPos] [speedMult]" lines.
const STEPS = CONFIG.sequence.map((l) => {
  const p = String(l).trim().split(/\s+/);
  const dur = parseFloat(p[1]);
  return {
    clip: p[0],
    dur: isNaN(dur) ? 2 : dur,
    vpos: p.length >= 3 && !isNaN(parseFloat(p[2])) ? parseFloat(p[2]) : null,
    speed: p.length >= 4 && !isNaN(parseFloat(p[3])) ? parseFloat(p[3]) : 1,
  };
}).filter((s) => CLIPS[s.clip]);

/**
 * Mount the animated spinner into `container`. Returns { stop() }.
 * opts: { primary, background } — colors (default UTRS blue on #1a1a1a).
 */
export function mountUploadSpinner(container, opts = {}) {
  const PRIMARY = opts.primary || "#4A9EFF";
  const OUTLINE = "#0e0e0e";
  const BG = opts.background || "#1a1a1a";
  const dpr = Math.max(1, Math.min(3, window.devicePixelRatio || 1));

  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_W * dpr; canvas.height = CANVAS_H * dpr;
  canvas.style.width = CANVAS_W + "px"; canvas.style.height = CANVAS_H + "px";
  canvas.style.display = "block";
  container.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);

  // per-mount state machine (mirrors animator.js) + vertical-pos tween
  const defVpos = STEPS.length && STEPS[0].vpos != null ? STEPS[0].vpos : CONFIG.verticalPos;
  const SM = { current: STEPS[0] ? STEPS[0].clip : "sprint", curT: 0, next: null, nextT: 0,
               tDur: 0, tEl: 0, vpos: defVpos, vFrom: defVpos, vTo: defVpos,
               curSpeed: STEPS[0] ? STEPS[0].speed : 1, nextSpeed: 1 };
  let seqIdx = 0, seqEl = 0;

  function smTo(name, vTarget, speed) {
    if (!CLIPS[name] || name === SM.next) return;
    if (name === SM.current && !SM.next) { if (vTarget != null) { SM.vFrom = SM.vpos; SM.vTo = vTarget; } if (speed != null) SM.curSpeed = speed; return; }
    const from = SM.next || SM.current;
    if (SM.next) { SM.current = SM.next; SM.curT = SM.nextT; SM.curSpeed = SM.nextSpeed; }
    SM.next = name; SM.nextT = 0; SM.tDur = transDur(from, name); SM.tEl = 0;
    SM.nextSpeed = speed != null ? speed : 1;
    if (vTarget != null) { SM.vFrom = SM.vpos; SM.vTo = vTarget; }
  }
  function smUpdate(dt) {
    if (!CLIPS[SM.current]) return {};
    SM.curT += dt * (SM.curSpeed || 1);
    if (!SM.next) { SM.vpos = SM.vTo; return poseOf(SM.current, SM.curT); }
    SM.nextT += dt * (SM.nextSpeed || 1); SM.tEl += dt;
    const t = SM.tDur > 0 ? Math.min(SM.tEl / SM.tDur, 1) : 1;
    SM.vpos = SM.vFrom + (SM.vTo - SM.vFrom) * t;
    const pc = poseOf(SM.current, SM.curT), pn = poseOf(SM.next, SM.nextT), out = {};
    for (const k in pc) out[k] = pc[k];
    for (const k in pn) out[k] = lerpAngle(pc[k] || 0, pn[k] || 0, t);
    if (t >= 1) { SM.current = SM.next; SM.curT = SM.nextT; SM.curSpeed = SM.nextSpeed; SM.next = null; SM.nextT = 0; SM.vpos = SM.vTo; }
    return out;
  }

  function boxAt(cx, cy, ang, half, color) {
    const c = Math.cos(ang), s = Math.sin(ang);
    ctx.fillStyle = color; ctx.beginPath();
    ctx.moveTo(cx + (-half*c + half*s), cy + (-half*s - half*c));
    ctx.lineTo(cx + ( half*c + half*s), cy + ( half*s - half*c));
    ctx.lineTo(cx + ( half*c - half*s), cy + ( half*s + half*c));
    ctx.lineTo(cx + (-half*c - half*s), cy + (-half*s + half*c));
    ctx.closePath(); ctx.fill();
  }

  function draw(pose) {
    const scale = CONFIG.scale, fillW = CONFIG.limbThickness, outlineW = fillW + 4;
    const rootX = CANVAS_W / 2, rootY = ROOT_Y0 - SM.vpos;
    const J = resolve(pose, rootX, rootY, scale);

    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.lineCap = "round"; ctx.lineJoin = "round";

    // floor behind the figure
    ctx.strokeStyle = "#555"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(20, CONFIG.floorY); ctx.lineTo(CANVAS_W - 20, CONFIG.floorY); ctx.stroke();

    const stroke = (n) => { const j = J[n]; ctx.beginPath(); ctx.moveTo(j.x, j.y); ctx.lineTo(j.ex, j.ey); ctx.stroke(); };
    if (CONFIG.outline) { ctx.strokeStyle = OUTLINE; ctx.lineWidth = outlineW; ORDER.forEach(stroke); }
    ctx.strokeStyle = PRIMARY; ctx.lineWidth = fillW; ORDER.forEach(stroke);

    for (const jn in JB) {
      const j = J[jn]; if (!j) continue;
      const half = (JB[jn].size / 2) * fillW, inv = JB[jn].inv;
      if (CONFIG.outline) boxAt(j.ex, j.ey, j.ang, half + (outlineW - fillW) / 2, inv ? PRIMARY : OUTLINE);
      boxAt(j.ex, j.ey, j.ang, half, inv ? OUTLINE : PRIMARY);
    }

    // head: solid backing disc so the logo's cut-outs don't reveal the neck
    const h = J.head, hx = h.ex + Math.cos(h.ang) * CONFIG.headOffset, hy = h.ey + Math.sin(h.ang) * CONFIG.headOffset;
    if (CONFIG.backing !== "none") {
      ctx.fillStyle = CONFIG.backing === "white" ? "#ffffff" : BG;
      ctx.beginPath(); ctx.arc(hx, hy, CONFIG.headSize * 0.44, 0, 7); ctx.fill();
    }
    ctx.save();
    ctx.translate(hx, hy);
    ctx.rotate(h.ang + Math.PI / 2 + CONFIG.logoRotationDeg * Math.PI / 180);
    const s = CONFIG.headSize / 24; ctx.scale(s, s); ctx.translate(-12, -12);
    ctx.fillStyle = PRIMARY; ctx.fill(steamPath);
    ctx.restore();
  }

  let raf = 0, last = 0, stopped = false;
  function frame(now) {
    if (stopped) return;
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 0; last = now;
    if (STEPS.length) {
      seqEl += dt;
      if (seqEl >= STEPS[seqIdx].dur) {
        seqEl -= STEPS[seqIdx].dur; seqIdx = (seqIdx + 1) % STEPS.length;
        const ns = STEPS[seqIdx];
        smTo(ns.clip, ns.vpos != null ? ns.vpos : CONFIG.verticalPos, ns.speed);
      }
    }
    draw(smUpdate(dt));
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  return {
    stop() { stopped = true; if (raf) cancelAnimationFrame(raf); if (canvas.parentNode) canvas.parentNode.removeChild(canvas); },
  };
}
