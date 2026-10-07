/**
 * PlopTheBlob — Custom SFX Module
 * Pure Web Audio synthesis, no DSP machines.
 * Hooks into RCHIPL Events for automatic triggering.
 *
 * Sons editables : modifier les params dans chaque fonction.
 * Pour remplacer un son : remplacer le contenu de la fonction.
 * Pour desactiver un son : mettre le volume a 0 ou commenter le hook.
 */
const GameSFX = {
    _ctx: null,
    _master: null,
    _cooldowns: {},
    _enabled: true,
    _hooked: false,
    _suspendedForLifecycle: false,

    init() {
        // Hook into RCHIPL Events once the system is ready
        if (this._hooked) return;
        this._hooked = true;
        const self = this;

        // Wait for events system, then bind
        const tryHook = () => {
            const E = RCHIPL.Events;
            if (!E?.on) { setTimeout(tryHook, 200); return; }

            // Intercept Sampler.playSFX for "custom" machine patches.
            // When a binding triggers a sfx_custom_xxx patch, we play the Web Audio sound
            // instead of trying to bake it through a DSP machine.
            // If you replace a [Custom] patch with a regular machine patch in the inspector,
            // it will play through the normal Sampler pipeline automatically.
            const origPlaySFX = RCHIPL.Sampler?.playSFX?.bind(RCHIPL.Sampler);
            if (origPlaySFX && RCHIPL.Sampler) {
                RCHIPL.Sampler.playSFX = function(patchId, options) {
                    const patch = RCHIPL.Sampler._audioData?.sfxPatches?.[patchId];
                    if (patch?.machine === 'custom' && patch.customFn && self[patch.customFn]) {
                        self[patch.customFn](options?.volume || 1);
                        return;
                    }
                    return origPlaySFX(patchId, options);
                };
            }

            // Disable the engine's built-in collision synthesis (we handle sound ourselves)
            // But keep the squash detection + event emit — just kill the internal synth.
            // Use interval to ensure it applies AFTER project data loads (which resets _enabled)
            const patchCollision = () => {
                if (!RCHIPL.CollisionSound) return;
                RCHIPL.CollisionSound._trigger = () => {}; // noop the synth
                RCHIPL.CollisionSound._enabled = true;     // keep detection running
                // Raise thresholds to only fire on significant impacts
                const cfg = RCHIPL.CollisionSound._config;
                cfg.blobSquashThr = 0.035;   // was 0.015 — ignores gentle rolling
                cfg.bombSquashThr = 0.012;   // was 0.006 — bomb is heavier, still sensitive
                cfg.cooldownMs = 200;        // was 120 — less spam
                cfg.maxVoices = 3;           // was 6 — less simultaneous
            };
            patchCollision();
            // Re-apply after layout loads (project data may reset settings)
            E.on('OnLevelStart', () => setTimeout(patchCollision, 50));

            console.log('[GameSFX] Hooked to events');
        };
        tryHook();
    },

    _ensureCtx() {
        if (this._ctx) {
            if (this._ctx.state === 'suspended') this._ctx.resume();
            return this._ctx;
        }
        const c = new (window.AudioContext || window.webkitAudioContext)();
        this._ctx = c;
        this._master = c.createGain();
        this._master.gain.value = 0.45;
        // Soft lowpass — nothing harsh above 5kHz
        const lp = c.createBiquadFilter();
        lp.type = 'lowpass'; lp.frequency.value = 5000; lp.Q.value = 0.5;
        // Limiter — prevents clipping when multiple sounds stack
        const limiter = c.createDynamicsCompressor();
        limiter.threshold.value = -6;   // start limiting at -6 dBFS
        limiter.knee.value = 6;         // soft knee
        limiter.ratio.value = 12;       // aggressive limiting above threshold
        limiter.attack.value = 0.002;   // fast attack
        limiter.release.value = 0.05;   // quick release
        this._master.connect(lp).connect(limiter).connect(c.destination);
        return c;
    },

    pauseForLifecycle() {
        if (!this._ctx) return;
        this._suspendedForLifecycle = true;
        if (this._ctx.state === 'running') this._ctx.suspend().catch(() => {});
    },

    resumeFromLifecycle() {
        if (!this._ctx || !this._suspendedForLifecycle) return;
        if (!this._enabled) return;
        if (RCHIPL.Platform?._adInProgress) return;
        this._suspendedForLifecycle = false;
        if (this._ctx.state === 'suspended') this._ctx.resume().catch(() => {});
    },

    _cd(id, ms) {
        const now = performance.now();
        if (this._cooldowns[id] && now - this._cooldowns[id] < ms) return false;
        this._cooldowns[id] = now;
        return true;
    },

    _noise(c, dur) {
        const n = c.sampleRate * dur | 0;
        const b = c.createBuffer(1, n, c.sampleRate);
        const d = b.getChannelData(0);
        for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
        return b;
    },

    _verb(c, src, wet, dur) {
        const n = c.sampleRate * dur | 0;
        const ir = c.createBuffer(2, n, c.sampleRate);
        for (let ch = 0; ch < 2; ch++) {
            const d = ir.getChannelData(ch);
            for (let i = 0; i < n; i++) d[i] = (Math.random()*2-1) * Math.pow(1-i/n, 2.5) * 0.3;
        }
        const dry = c.createGain(); dry.gain.value = 1;
        const wg = c.createGain(); wg.gain.value = wet;
        const conv = c.createConvolver(); conv.buffer = ir;
        src.connect(dry).connect(this._master);
        src.connect(conv).connect(wg).connect(this._master);
    },

    // ═══════════════════════════════════════════════════════════
    // AIM TICK — called from game code (not event), needs progress param
    // ═══════════════════════════════════════════════════════════
    aimTick(progress) {
        if (!this._enabled) return;
        if (RCHIPL.Platform?._adInProgress) return;
        const c = this._ensureCtx(), t = c.currentTime + 0.01;
        // Exponential curve: more contrast, higher at max
        const basePitch = 400 + Math.pow(progress, 1.5) * 1200;

        const car = c.createOscillator(); car.type = 'sine';
        car.frequency.setValueAtTime(basePitch, t);
        car.frequency.exponentialRampToValueAtTime(basePitch * 0.5, t + 0.04);
        const mod = c.createOscillator(); mod.type = 'sine';
        mod.frequency.setValueAtTime(basePitch * 1.4, t);
        mod.frequency.exponentialRampToValueAtTime(basePitch * 0.7, t + 0.04);
        const fm = c.createGain();
        fm.gain.setValueAtTime(200 + progress * 200, t);
        fm.gain.exponentialRampToValueAtTime(1, t + 0.035);
        mod.connect(fm).connect(car.frequency);

        const bp = c.createBiquadFilter(); bp.type = 'bandpass';
        bp.frequency.setValueAtTime(basePitch * 1.2, t);
        bp.frequency.exponentialRampToValueAtTime(400, t + 0.04);
        bp.Q.value = 5;

        const vol = 0.15 + progress * 0.25;
        const g = c.createGain();
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(vol, t + 0.003);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
        car.connect(bp).connect(g).connect(this._master);
        car.start(t); car.stop(t + 0.06);
        mod.start(t); mod.stop(t + 0.06);
    },

    // ═══════════════════════════════════════════════════════════
    // LAUNCH BOING — spring release, elastic oscillation
    // ═══════════════════════════════════════════════════════════
    launch() {
        if (!this._enabled) return;
        if (!this._cd('launch', 200)) return;
        const c = this._ensureCtx(), t = c.currentTime + 0.01;
        const bus = c.createGain(); bus.gain.value = 1;
        const dur = 0.45;
        const N = c.sampleRate * dur | 0;

        // Spring oscillation — pitch starts high, oscillates down
        const osc = c.createOscillator(); osc.type = 'sine';
        const curve = new Float32Array(N);
        for (let i = 0; i < N; i++) {
            const tt = i / c.sampleRate;
            const base = 600 * Math.exp(-4 * tt) + 80;
            const spring = Math.sin(2 * Math.PI * 14 * tt) * 200 * Math.exp(-6 * tt);
            curve[i] = Math.max(20, base + spring);
        }
        osc.frequency.setValueCurveAtTime(curve, t, dur);
        const g = c.createGain();
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.30, t + 0.003);
        g.gain.exponentialRampToValueAtTime(0.001, t + dur);
        osc.connect(g).connect(bus);
        osc.start(t); osc.stop(t + dur + 0.05);

        // Detuned second spring for thickness
        const osc2 = c.createOscillator(); osc2.type = 'triangle';
        const curve2 = new Float32Array(N);
        for (let i = 0; i < N; i++) {
            const tt = i / c.sampleRate;
            curve2[i] = Math.max(20, 610*Math.exp(-4*tt)+82 + Math.sin(2*Math.PI*14.3*tt)*190*Math.exp(-6*tt));
        }
        osc2.frequency.setValueCurveAtTime(curve2, t, dur);
        const g2 = c.createGain();
        g2.gain.setValueAtTime(0, t);
        g2.gain.linearRampToValueAtTime(0.15, t + 0.003);
        g2.gain.exponentialRampToValueAtTime(0.001, t + dur * 0.8);
        osc2.connect(g2).connect(bus);
        osc2.start(t); osc2.stop(t + dur + 0.05);

        this._verb(c, bus, 0.18, 0.4);
    },

    // ═══════════════════════════════════════════════════════════
    // BOUNCE / PLOP — pitch drop + rubber wobble + FM body + splat noise
    // ═══════════════════════════════════════════════════════════
    bounce(force) {
        if (!this._enabled) return;
        if (!this._cd('bounce', 100)) return;
        const normForce = Math.min(1, Math.max(0, force || 0.5));
        if (normForce < 0.05) return;
        const c = this._ensureCtx(), t = c.currentTime + 0.01;
        const bus = c.createGain(); bus.gain.value = 1;
        // Random variations for each hit
        const dur = 0.20 + Math.random() * 0.15;           // 200-350ms
        const pitchMult = Math.pow(2, (Math.random() * 8 - 4) / 12); // +/-4 semitones
        const wobbleRate = 6 + Math.random() * 6;          // 6-12Hz wobble speed
        const wobbleAmt = 15 + Math.random() * 20;         // wobble depth varies
        const fmAmount = 200 + Math.random() * 400;        // FM depth varies
        const basePitch = 180 + Math.random() * 80;        // base freq varies 180-260Hz

        // Main sine with pitch drop + rubber wobble (randomized per hit)
        const osc = c.createOscillator(); osc.type = 'sine';
        const N = c.sampleRate * dur | 0;
        const curve = new Float32Array(N);
        for (let i = 0; i < N; i++) {
            const tt = i / c.sampleRate;
            const drop = basePitch * Math.exp(-15 * tt) + 75;
            const wobble = Math.sin(2 * Math.PI * wobbleRate * tt) * wobbleAmt * Math.exp(-5 * tt);
            curve[i] = Math.max(20, (drop + wobble) * pitchMult);
        }
        osc.frequency.setValueCurveAtTime(curve, t, dur);
        const vol = 0.06 + normForce * 0.12;
        const g = c.createGain();
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(vol, t + 0.005);
        g.gain.exponentialRampToValueAtTime(0.001, t + dur);
        osc.connect(g).connect(bus);
        osc.start(t); osc.stop(t + dur + 0.05);

        // FM body — wet organic undertone (randomized FM depth)
        const car = c.createOscillator(); car.type = 'sine';
        const baseF = (basePitch * 0.6) * pitchMult;
        car.frequency.setValueAtTime(baseF, t);
        car.frequency.exponentialRampToValueAtTime(baseF * 0.46, t + 0.15);
        const mod2 = c.createOscillator(); mod2.type = 'sine';
        mod2.frequency.setValueAtTime(baseF * 1.4, t);
        mod2.frequency.exponentialRampToValueAtTime(baseF * 0.65, t + 0.15);
        const fmG = c.createGain();
        fmG.gain.setValueAtTime(fmAmount, t);
        fmG.gain.exponentialRampToValueAtTime(2, t + 0.12);
        mod2.connect(fmG).connect(car.frequency);
        const cG = c.createGain();
        cG.gain.setValueAtTime(0, t);
        cG.gain.linearRampToValueAtTime(vol * 0.5, t + 0.004);
        cG.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        car.connect(cG).connect(bus);
        car.start(t); car.stop(t + 0.2);
        mod2.start(t); mod2.stop(t + 0.2);

        // Noise transient — the "splat" top
        const ns = c.createBufferSource(); ns.buffer = this._noise(c, 0.03);
        const nsBp = c.createBiquadFilter(); nsBp.type = 'bandpass';
        nsBp.frequency.setValueAtTime(1200, t);
        nsBp.frequency.exponentialRampToValueAtTime(300, t + 0.025);
        nsBp.Q.value = 4;
        const nsG = c.createGain();
        nsG.gain.setValueAtTime(vol * 0.4, t);
        nsG.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
        ns.connect(nsBp).connect(nsG).connect(bus);
        ns.start(t);

        this._verb(c, bus, 0.15, 0.3);
    },

    // ═══════════════════════════════════════════════════════════
    // EXPLOSION — spring explosion + sub + noise + bubble debris
    // ═══════════════════════════════════════════════════════════
    explosion() {
        if (!this._enabled) return;
        if (!this._cd('explosion', 300)) return;
        const c = this._ensureCtx(), t = c.currentTime + 0.01;
        const bus = c.createGain(); bus.gain.value = 1;
        const dur = 0.5;
        const N = c.sampleRate * dur | 0;

        // Big spring — lower and bigger than launch
        const osc = c.createOscillator(); osc.type = 'sine';
        const curve = new Float32Array(N);
        for (let i = 0; i < N; i++) {
            const tt = i / c.sampleRate;
            curve[i] = Math.max(20, 500*Math.exp(-5*tt)+40 + Math.sin(2*Math.PI*10*tt)*250*Math.exp(-4*tt));
        }
        osc.frequency.setValueCurveAtTime(curve, t, dur);
        const g = c.createGain();
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.35, t + 0.004);
        g.gain.exponentialRampToValueAtTime(0.001, t + dur);
        osc.connect(g).connect(bus);
        osc.start(t); osc.stop(t + dur + 0.05);

        // Detuned second spring
        const osc2 = c.createOscillator(); osc2.type = 'triangle';
        const curve2 = new Float32Array(N);
        for (let i = 0; i < N; i++) {
            const tt = i / c.sampleRate;
            curve2[i] = Math.max(20, 510*Math.exp(-5*tt)+42 + Math.sin(2*Math.PI*10.4*tt)*240*Math.exp(-4*tt));
        }
        osc2.frequency.setValueCurveAtTime(curve2, t, dur);
        const g2 = c.createGain();
        g2.gain.setValueAtTime(0, t);
        g2.gain.linearRampToValueAtTime(0.18, t + 0.004);
        g2.gain.exponentialRampToValueAtTime(0.001, t + dur * 0.7);
        osc2.connect(g2).connect(bus);
        osc2.start(t); osc2.stop(t + dur + 0.05);

        // Sub boom
        const sub = c.createOscillator(); sub.type = 'sine';
        sub.frequency.setValueAtTime(100, t);
        sub.frequency.exponentialRampToValueAtTime(25, t + 0.08);
        const sg = c.createGain();
        sg.gain.setValueAtTime(0, t);
        sg.gain.linearRampToValueAtTime(0.35, t + 0.005);
        sg.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        sub.connect(sg).connect(bus);
        sub.start(t); sub.stop(t + 0.3);

        // Noise burst
        const nSrc = c.createBufferSource(); nSrc.buffer = this._noise(c, 0.3);
        const nLp = c.createBiquadFilter(); nLp.type = 'lowpass';
        nLp.frequency.setValueAtTime(2500, t);
        nLp.frequency.exponentialRampToValueAtTime(200, t + 0.15);
        nLp.Q.value = 2;
        const ng = c.createGain();
        ng.gain.setValueAtTime(0, t);
        ng.gain.linearRampToValueAtTime(0.22, t + 0.005);
        ng.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        nSrc.connect(nLp).connect(ng).connect(bus);
        nSrc.start(t);

        // Bubble debris
        for (let i = 0; i < 12; i++) {
            const delay = 0.02 + Math.random() * 0.18;
            const pitch = 200 + Math.random() * 500;
            const bOsc = c.createOscillator(); bOsc.type = 'sine';
            bOsc.frequency.setValueAtTime(pitch, t + delay);
            bOsc.frequency.exponentialRampToValueAtTime(pitch * 0.35, t + delay + 0.07);
            const bg = c.createGain();
            bg.gain.setValueAtTime(0, t + delay);
            bg.gain.linearRampToValueAtTime(0.07, t + delay + 0.003);
            bg.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.08);
            bOsc.connect(bg).connect(bus);
            bOsc.start(t + delay); bOsc.stop(t + delay + 0.1);
        }

        this._verb(c, bus, 0.2, 0.5);
    },

    // ═══════════════════════════════════════════════════════════
    // BOMB SPAWN — shimmer magique, chimes cristallins
    // ═══════════════════════════════════════════════════════════
    bombSpawn() {
        if (!this._enabled) return;
        if (!this._cd('bombSpawn', 200)) return;
        const c = this._ensureCtx(), t = c.currentTime + 0.01;
        const bus = c.createGain(); bus.gain.value = 1;

        // === LAYER 1: Rising shimmer body — triangle sweep ascending (materialization) ===
        const body = c.createOscillator(); body.type = 'triangle';
        body.frequency.setValueAtTime(350, t);
        body.frequency.exponentialRampToValueAtTime(1400, t + 0.5);
        const body2 = c.createOscillator(); body2.type = 'triangle';
        body2.frequency.setValueAtTime(354, t); // +7 cents detune = warm chorus
        body2.frequency.exponentialRampToValueAtTime(1414, t + 0.5);
        const bodyLp = c.createBiquadFilter(); bodyLp.type = 'lowpass';
        bodyLp.frequency.setValueAtTime(800, t);
        bodyLp.frequency.exponentialRampToValueAtTime(3500, t + 0.5);
        bodyLp.Q.value = 3;
        const bodyG = c.createGain();
        bodyG.gain.setValueAtTime(0, t);
        bodyG.gain.linearRampToValueAtTime(0.10, t + 0.08);
        bodyG.gain.setValueAtTime(0.10, t + 0.3);
        bodyG.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
        body.connect(bodyLp).connect(bodyG).connect(bus);
        body2.connect(bodyLp);
        body.start(t); body.stop(t + 0.65);
        body2.start(t); body2.stop(t + 0.65);

        // === LAYER 2: Sparkle — pentatonic sine plinks (glass, not metal) ===
        const pentatonic = [2093, 2349, 2637, 3136, 3520]; // C pentatonic octave 7
        for (let i = 0; i < 10; i++) {
            const delay = 0.05 + Math.random() * 0.4;
            const pitch = pentatonic[Math.floor(Math.random() * pentatonic.length)];
            const o = c.createOscillator(); o.type = 'sine';
            o.frequency.setValueAtTime(pitch, t + delay);
            const g = c.createGain();
            const vol = 0.02 + Math.random() * 0.04;
            g.gain.setValueAtTime(0, t + delay);
            g.gain.linearRampToValueAtTime(vol, t + delay + 0.002);
            g.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.03 + Math.random() * 0.05);
            o.connect(g).connect(bus);
            o.start(t + delay); o.stop(t + delay + 0.1);
        }

        // === LAYER 3: Fairy dust — bandpass noise sweeping up ===
        const dustSrc = c.createBufferSource(); dustSrc.buffer = this._noise(c, 0.5);
        const dustBp = c.createBiquadFilter(); dustBp.type = 'bandpass';
        dustBp.frequency.setValueAtTime(2000, t);
        dustBp.frequency.exponentialRampToValueAtTime(5000, t + 0.4);
        dustBp.Q.value = 6;
        const dustG = c.createGain();
        dustG.gain.setValueAtTime(0, t);
        dustG.gain.linearRampToValueAtTime(0.05, t + 0.05);
        dustG.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
        dustSrc.connect(dustBp).connect(dustG).connect(bus);
        dustSrc.start(t);

        this._verb(c, bus, 0.4, 0.7);
    },

    // ═══════════════════════════════════════════════════════════
    // WATER ENTRY — splash noise + bubbles + fizz
    // ═══════════════════════════════════════════════════════════
    waterEntry(speed) {
        if (!this._enabled) return;
        if (!this._cd('water', 200)) return;
        const c = this._ensureCtx(), t = c.currentTime + 0.01;
        const bus = c.createGain(); bus.gain.value = 1;
        const vol = Math.min(1, Math.max(0.3, (speed || 5) / 15));

        // Splash noise burst
        const splSrc = c.createBufferSource(); splSrc.buffer = this._noise(c, 0.12);
        const splBp = c.createBiquadFilter(); splBp.type = 'bandpass';
        splBp.frequency.setValueAtTime(2500, t);
        splBp.frequency.exponentialRampToValueAtTime(400, t + 0.06);
        splBp.Q.value = 3;
        const splG = c.createGain();
        splG.gain.setValueAtTime(0, t);
        splG.gain.linearRampToValueAtTime(0.3 * vol, t + 0.003);
        splG.gain.exponentialRampToValueAtTime(0.001, t + 0.10);
        splSrc.connect(splBp).connect(splG).connect(bus);
        splSrc.start(t);

        // Sub
        const sub = c.createOscillator(); sub.type = 'sine';
        sub.frequency.setValueAtTime(180, t);
        sub.frequency.exponentialRampToValueAtTime(50, t + 0.05);
        const subG = c.createGain();
        subG.gain.setValueAtTime(0, t);
        subG.gain.linearRampToValueAtTime(0.22 * vol, t + 0.004);
        subG.gain.exponentialRampToValueAtTime(0.001, t + 0.10);
        sub.connect(subG).connect(bus);
        sub.start(t); sub.stop(t + 0.12);

        // Bubbles
        const bCount = 5 + Math.round(vol * 4);
        for (let i = 0; i < bCount; i++) {
            const delay = 0.02 + i * 0.025 + Math.random() * 0.025;
            const pitch = 500 + Math.random() * 700;
            const bOsc = c.createOscillator(); bOsc.type = 'sine';
            bOsc.frequency.setValueAtTime(pitch * 0.8, t + delay);
            bOsc.frequency.exponentialRampToValueAtTime(pitch * 1.2, t + delay + 0.025);
            bOsc.frequency.exponentialRampToValueAtTime(pitch * 0.5, t + delay + 0.05);
            const bg = c.createGain();
            bg.gain.setValueAtTime(0, t + delay);
            bg.gain.linearRampToValueAtTime(0.09 * vol, t + delay + 0.003);
            bg.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.055);
            bOsc.connect(bg).connect(bus);
            bOsc.start(t + delay); bOsc.stop(t + delay + 0.07);
        }

        // Fizz
        const fSrc = c.createBufferSource(); fSrc.buffer = this._noise(c, 0.35);
        const fHp = c.createBiquadFilter(); fHp.type = 'highpass';
        fHp.frequency.value = 2000;
        const fLp = c.createBiquadFilter(); fLp.type = 'lowpass';
        fLp.frequency.setValueAtTime(4500, t);
        fLp.frequency.exponentialRampToValueAtTime(2500, t + 0.25);
        const fg = c.createGain();
        fg.gain.setValueAtTime(0, t);
        fg.gain.linearRampToValueAtTime(0.10 * vol, t + 0.02);
        fg.gain.exponentialRampToValueAtTime(0.001, t + 0.30);
        fSrc.connect(fHp).connect(fLp).connect(fg).connect(bus);
        fSrc.start(t);

        this._verb(c, bus, 0.22, 0.4);
    },

    // ═══════════════════════════════════════════════════════════
    // VICTORY — explosion + fanfare TA-DA + crackle + sparkle
    // ═══════════════════════════════════════════════════════════
    victory() {
        if (!this._enabled) return;
        const c = this._ensureCtx(), t = c.currentTime + 0.01;
        const bus = c.createGain(); bus.gain.value = 1;

        // Explosion noise burst (confetti cannon)
        const boomSrc = c.createBufferSource(); boomSrc.buffer = this._noise(c, 0.25);
        const boomLp = c.createBiquadFilter(); boomLp.type = 'lowpass';
        boomLp.frequency.setValueAtTime(3000, t);
        boomLp.frequency.exponentialRampToValueAtTime(300, t + 0.12);
        const boomG = c.createGain();
        boomG.gain.setValueAtTime(0, t);
        boomG.gain.linearRampToValueAtTime(0.30, t + 0.004);
        boomG.gain.exponentialRampToValueAtTime(0.001, t + 0.20);
        boomSrc.connect(boomLp).connect(boomG).connect(bus);
        boomSrc.start(t);

        // Sub boom
        const subBoom = c.createOscillator(); subBoom.type = 'sine';
        subBoom.frequency.setValueAtTime(200, t);
        subBoom.frequency.exponentialRampToValueAtTime(40, t + 0.07);
        const subBG = c.createGain();
        subBG.gain.setValueAtTime(0, t);
        subBG.gain.linearRampToValueAtTime(0.30, t + 0.005);
        subBG.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        subBoom.connect(subBG).connect(bus);
        subBoom.start(t); subBoom.stop(t + 0.22);

        // Crackle trail (confetti falling)
        for (let i = 0; i < 20; i++) {
            const delay = 0.03 + Math.random() * 0.35;
            const crSrc = c.createBufferSource();
            crSrc.buffer = this._noise(c, 0.012 + Math.random() * 0.015);
            const crBp = c.createBiquadFilter(); crBp.type = 'bandpass';
            crBp.frequency.value = 1500 + Math.random() * 3000;
            crBp.Q.value = 2 + Math.random() * 4;
            const crG = c.createGain();
            crG.gain.setValueAtTime(0.08 * (1 - delay / 0.4), t + delay);
            crG.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.02);
            crSrc.connect(crBp).connect(crG).connect(bus);
            crSrc.start(t + delay);
        }

        // Fanfare TA-DA — ascending major chord
        [
            { freq: 523, delay: 0.05, dur: 0.25 },
            { freq: 659, delay: 0.12, dur: 0.25 },
            { freq: 784, delay: 0.19, dur: 0.30 },
            { freq: 1047, delay: 0.28, dur: 0.40 },
        ].forEach(note => {
            const o1 = c.createOscillator(); o1.type = 'triangle';
            o1.frequency.setValueAtTime(note.freq * 0.6, t + note.delay);
            o1.frequency.exponentialRampToValueAtTime(note.freq * 1.05, t + note.delay + 0.025);
            o1.frequency.exponentialRampToValueAtTime(note.freq, t + note.delay + 0.06);
            const o2 = c.createOscillator(); o2.type = 'sine';
            o2.frequency.setValueAtTime(note.freq * 0.6 * 1.005, t + note.delay);
            o2.frequency.exponentialRampToValueAtTime(note.freq * 1.005, t + note.delay + 0.04);
            const ng = c.createGain();
            ng.gain.setValueAtTime(0, t + note.delay);
            ng.gain.linearRampToValueAtTime(0.12, t + note.delay + 0.008);
            ng.gain.exponentialRampToValueAtTime(0.001, t + note.delay + note.dur);
            o1.connect(ng).connect(bus); o2.connect(ng);
            o1.start(t + note.delay); o1.stop(t + note.delay + note.dur + 0.05);
            o2.start(t + note.delay); o2.stop(t + note.delay + note.dur + 0.05);
        });

        // Sparkle micro-bubbles
        for (let i = 0; i < 10; i++) {
            const delay = 0.08 + Math.random() * 0.25;
            const pitch = 800 + Math.random() * 1200;
            const sOsc = c.createOscillator(); sOsc.type = 'sine';
            sOsc.frequency.setValueAtTime(pitch, t + delay);
            sOsc.frequency.exponentialRampToValueAtTime(pitch * 1.3, t + delay + 0.03);
            const sg = c.createGain();
            sg.gain.setValueAtTime(0, t + delay);
            sg.gain.linearRampToValueAtTime(0.04, t + delay + 0.003);
            sg.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.06);
            sOsc.connect(sg).connect(bus);
            sOsc.start(t + delay); sOsc.stop(t + delay + 0.07);
        }

        this._verb(c, bus, 0.25, 0.5);
    },

    // ═══════════════════════════════════════════════════════════
    // CONFETTI — shimmer chimes + metallic sparkle
    // ═══════════════════════════════════════════════════════════
    confetti() {
        if (!this._enabled) return;
        if (!this._cd('confetti', 300)) return;
        const c = this._ensureCtx(), t = c.currentTime + 0.01;
        const bus = c.createGain(); bus.gain.value = 1;

        // Crystalline chimes with shimmer
        [1200, 1500, 1800, 2200, 1400, 1700, 2000, 1600].forEach((freq, i) => {
            const delay = i * 0.02 + Math.random() * 0.03;
            const f = freq * (0.95 + Math.random() * 0.1);
            const o1 = c.createOscillator(); o1.type = 'sine';
            o1.frequency.setValueAtTime(f, t + delay);
            const o2 = c.createOscillator(); o2.type = 'sine';
            o2.frequency.setValueAtTime(f * 1.007, t + delay);
            const g = c.createGain();
            g.gain.setValueAtTime(0, t + delay);
            g.gain.linearRampToValueAtTime(0.04, t + delay + 0.002);
            g.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.15);
            o1.connect(g).connect(bus); o2.connect(g);
            o1.start(t + delay); o1.stop(t + delay + 0.18);
            o2.start(t + delay); o2.stop(t + delay + 0.18);
        });

        // Metallic shimmer
        const shimSrc = c.createBufferSource(); shimSrc.buffer = this._noise(c, 0.3);
        const shimBp = c.createBiquadFilter(); shimBp.type = 'bandpass';
        shimBp.frequency.setValueAtTime(3500, t);
        shimBp.frequency.exponentialRampToValueAtTime(2000, t + 0.2);
        shimBp.Q.value = 8;
        const shimG = c.createGain();
        shimG.gain.setValueAtTime(0, t);
        shimG.gain.linearRampToValueAtTime(0.08, t + 0.01);
        shimG.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        shimSrc.connect(shimBp).connect(shimG).connect(bus);
        shimSrc.start(t);

        // Tiny sparkle pops
        for (let i = 0; i < 15; i++) {
            const delay = Math.random() * 0.2;
            const pitch = 1500 + Math.random() * 2000;
            const o = c.createOscillator(); o.type = 'sine';
            o.frequency.setValueAtTime(pitch, t + delay);
            o.frequency.exponentialRampToValueAtTime(pitch * 1.5, t + delay + 0.015);
            const g = c.createGain();
            g.gain.setValueAtTime(0, t + delay);
            g.gain.linearRampToValueAtTime(0.025, t + delay + 0.001);
            g.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.04);
            o.connect(g).connect(bus);
            o.start(t + delay); o.stop(t + delay + 0.05);
        }

        this._verb(c, bus, 0.3, 0.5);
    },

    // ═══════════════════════════════════════════════════════════
    // LEVEL START — 3 ascending bubble notes
    // ═══════════════════════════════════════════════════════════
    levelStart() {
        if (!this._enabled) return;
        const c = this._ensureCtx(), t = c.currentTime + 0.01;
        const bus = c.createGain(); bus.gain.value = 1;

        [330, 440, 550].forEach((freq, i) => {
            const delay = i * 0.11;
            const osc = c.createOscillator(); osc.type = 'sine';
            osc.frequency.setValueAtTime(freq * 0.7, t + delay);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.1, t + delay + 0.02);
            osc.frequency.exponentialRampToValueAtTime(freq, t + delay + 0.06);
            const bp = c.createBiquadFilter(); bp.type = 'bandpass';
            bp.frequency.value = freq * 1.5; bp.Q.value = 3;
            const g = c.createGain();
            g.gain.setValueAtTime(0, t + delay);
            g.gain.linearRampToValueAtTime(0.18, t + delay + 0.005);
            g.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.25);
            osc.connect(bp).connect(g).connect(bus);
            osc.start(t + delay); osc.stop(t + delay + 0.28);
        });

        this._verb(c, bus, 0.2, 0.4);
    },

    // ═══════════════════════════════════════════════════════════
    // PORTAL ENTER — aspirant, descending pitch, sucked in
    // ═══════════════════════════════════════════════════════════
    portalEnter() {
        if (!this._enabled) return;
        if (!this._cd('portalEnter', 200)) return;
        const c = this._ensureCtx(), t = c.currentTime + 0.01;
        const bus = c.createGain(); bus.gain.value = 1;

        // Descending pitch sweep — getting sucked in
        const osc = c.createOscillator(); osc.type = 'sine';
        osc.frequency.setValueAtTime(800, t);
        osc.frequency.exponentialRampToValueAtTime(150, t + 0.25);
        const osc2 = c.createOscillator(); osc2.type = 'sine';
        osc2.frequency.setValueAtTime(805, t);
        osc2.frequency.exponentialRampToValueAtTime(152, t + 0.25);
        const g = c.createGain();
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.15, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        osc.connect(g).connect(bus); osc2.connect(g);
        osc.start(t); osc.stop(t + 0.35);
        osc2.start(t); osc2.stop(t + 0.35);

        // Woosh noise — air being pulled
        const nSrc = c.createBufferSource(); nSrc.buffer = this._noise(c, 0.3);
        const nBp = c.createBiquadFilter(); nBp.type = 'bandpass';
        nBp.frequency.setValueAtTime(2000, t);
        nBp.frequency.exponentialRampToValueAtTime(300, t + 0.25);
        nBp.Q.value = 2;
        const ng = c.createGain();
        ng.gain.setValueAtTime(0, t);
        ng.gain.linearRampToValueAtTime(0.12, t + 0.03);
        ng.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
        nSrc.connect(nBp).connect(ng).connect(bus);
        nSrc.start(t);

        this._verb(c, bus, 0.25, 0.4);
    },

    // ═══════════════════════════════════════════════════════════
    // PORTAL EXIT — ascending pitch pop, popping out
    // ═══════════════════════════════════════════════════════════
    portalExit() {
        if (!this._enabled) return;
        if (!this._cd('portalExit', 200)) return;
        const c = this._ensureCtx(), t = c.currentTime + 0.01;
        const bus = c.createGain(); bus.gain.value = 1;

        // Ascending pitch — popping out
        const osc = c.createOscillator(); osc.type = 'sine';
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.exponentialRampToValueAtTime(700, t + 0.12);
        osc.frequency.exponentialRampToValueAtTime(400, t + 0.25);
        const g = c.createGain();
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.18, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        osc.connect(g).connect(bus);
        osc.start(t); osc.stop(t + 0.35);

        // Pop burst — noise
        const nSrc = c.createBufferSource(); nSrc.buffer = this._noise(c, 0.04);
        const nBp = c.createBiquadFilter(); nBp.type = 'bandpass';
        nBp.frequency.value = 1500; nBp.Q.value = 3;
        const ng = c.createGain();
        ng.gain.setValueAtTime(0.12, t);
        ng.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
        nSrc.connect(nBp).connect(ng).connect(bus);
        nSrc.start(t);

        // Sparkle micro-pops at exit
        for (let i = 0; i < 4; i++) {
            const delay = 0.05 + i * 0.03;
            const pitch = 800 + Math.random() * 600;
            const o = c.createOscillator(); o.type = 'sine';
            o.frequency.setValueAtTime(pitch * 0.8, t + delay);
            o.frequency.exponentialRampToValueAtTime(pitch * 1.2, t + delay + 0.02);
            const sg = c.createGain();
            sg.gain.setValueAtTime(0, t + delay);
            sg.gain.linearRampToValueAtTime(0.05, t + delay + 0.002);
            sg.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.04);
            o.connect(sg).connect(bus);
            o.start(t + delay); o.stop(t + delay + 0.06);
        }

        this._verb(c, bus, 0.25, 0.4);
    },

    // ═══════════════════════════════════════════════════════════
    // BOUNCY HIT — elastic trampoline boing, joyful
    // ═══════════════════════════════════════════════════════════
    bouncyHit(force) {
        if (!this._enabled) return;
        if (!this._cd('bouncy', 100)) return;
        const c = this._ensureCtx(), t = c.currentTime + 0.01;
        const bus = c.createGain(); bus.gain.value = 1;
        const dur = 0.35;
        const N = c.sampleRate * dur | 0;

        // Spring boing — higher and bouncier than the bomb launch
        const osc = c.createOscillator(); osc.type = 'sine';
        const curve = new Float32Array(N);
        for (let i = 0; i < N; i++) {
            const tt = i / c.sampleRate;
            const base = 500 * Math.exp(-5 * tt) + 200;
            const spring = Math.sin(2 * Math.PI * 18 * tt) * 150 * Math.exp(-7 * tt);
            curve[i] = Math.max(20, base + spring);
        }
        osc.frequency.setValueCurveAtTime(curve, t, dur);
        const g = c.createGain();
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.20, t + 0.003);
        g.gain.exponentialRampToValueAtTime(0.001, t + dur);
        osc.connect(g).connect(bus);
        osc.start(t); osc.stop(t + dur + 0.05);

        // Short sub punch
        const sub = c.createOscillator(); sub.type = 'sine';
        sub.frequency.setValueAtTime(200, t);
        sub.frequency.exponentialRampToValueAtTime(80, t + 0.04);
        const sg = c.createGain();
        sg.gain.setValueAtTime(0, t);
        sg.gain.linearRampToValueAtTime(0.15, t + 0.003);
        sg.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
        sub.connect(sg).connect(bus);
        sub.start(t); sub.stop(t + 0.1);

        this._verb(c, bus, 0.15, 0.3);
    },

    // ═══════════════════════════════════════════════════════════
    // DESTRUCTIBLE BREAK — glass/ice shatter, crispy fragments
    // ═══════════════════════════════════════════════════════════
    destructibleBreak(count) {
        if (!this._enabled) return;
        if (!this._cd('destBreak', 100)) return;
        const c = this._ensureCtx(), t = c.currentTime + 0.01;
        const bus = c.createGain(); bus.gain.value = 1;
        const fragCount = count || 5;

        // Initial crack — sharp filtered noise burst
        const crackSrc = c.createBufferSource(); crackSrc.buffer = this._noise(c, 0.03);
        const crackBp = c.createBiquadFilter(); crackBp.type = 'bandpass';
        crackBp.frequency.setValueAtTime(3000, t);
        crackBp.frequency.exponentialRampToValueAtTime(800, t + 0.02);
        crackBp.Q.value = 4;
        const crackG = c.createGain();
        crackG.gain.setValueAtTime(0.20, t);
        crackG.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        crackSrc.connect(crackBp).connect(crackG).connect(bus);
        crackSrc.start(t);

        // Falling shards — high pitched micro-tinkles scattered
        const shardCount = Math.min(12, fragCount + 3);
        for (let i = 0; i < shardCount; i++) {
            const delay = 0.01 + Math.random() * 0.15;
            const pitch = 1500 + Math.random() * 2500;
            const o = c.createOscillator(); o.type = 'sine';
            o.frequency.setValueAtTime(pitch, t + delay);
            o.frequency.exponentialRampToValueAtTime(pitch * 0.6, t + delay + 0.04);
            const sg = c.createGain();
            const vol = 0.02 + Math.random() * 0.04;
            sg.gain.setValueAtTime(0, t + delay);
            sg.gain.linearRampToValueAtTime(vol, t + delay + 0.001);
            sg.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.05 + Math.random() * 0.04);
            o.connect(sg).connect(bus);
            o.start(t + delay); o.stop(t + delay + 0.1);
        }

        // Crumble noise tail — filtered noise decaying
        const crumbleSrc = c.createBufferSource(); crumbleSrc.buffer = this._noise(c, 0.2);
        const crumbleLp = c.createBiquadFilter(); crumbleLp.type = 'lowpass';
        crumbleLp.frequency.setValueAtTime(4000, t);
        crumbleLp.frequency.exponentialRampToValueAtTime(500, t + 0.15);
        crumbleLp.Q.value = 1;
        const crumbleG = c.createGain();
        crumbleG.gain.setValueAtTime(0, t + 0.01);
        crumbleG.gain.linearRampToValueAtTime(0.08, t + 0.02);
        crumbleG.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        crumbleSrc.connect(crumbleLp).connect(crumbleG).connect(bus);
        crumbleSrc.start(t);

        this._verb(c, bus, 0.2, 0.35);
    },

    // ═══════════════════════════════════════════════════════════
    // WORLD MAP ARRIVE — soft landing chime
    // ═══════════════════════════════════════════════════════════
    worldMapArrive() {
        if (!this._enabled) return;
        const c = this._ensureCtx(), t = c.currentTime + 0.01;
        const bus = c.createGain(); bus.gain.value = 1;

        // Two warm notes: settling arrival
        [440, 660].forEach((freq, i) => {
            const delay = i * 0.08;
            const osc = c.createOscillator(); osc.type = 'sine';
            osc.frequency.setValueAtTime(freq * 0.8, t + delay);
            osc.frequency.exponentialRampToValueAtTime(freq, t + delay + 0.03);
            const g = c.createGain();
            g.gain.setValueAtTime(0, t + delay);
            g.gain.linearRampToValueAtTime(0.12, t + delay + 0.005);
            g.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.25);
            osc.connect(g).connect(bus);
            osc.start(t + delay); osc.stop(t + delay + 0.3);
        });

        this._verb(c, bus, 0.25, 0.4);
    },

    // ═══════════════════════════════════════════════════════════
    // CONTACT GRAIN — continuous micro-clicks driven by bomb deformation
    // Called every frame from game update. Produces ASMR bubble/click
    // texture mapped to squash ratio (pitch) and velocity (interval).
    // ═══════════════════════════════════════════════════════════
    _grainLastNotch: -1,
    _grainLastTime: 0,

    contactGrain(squashRatio, velocity) {
        if (!this._enabled) return;
        if (RCHIPL.Platform?._adInProgress) return;

        // Deformation = distance from rest shape (1.0). Works for both squash (<1) and stretch (>1)
        const deformation = Math.abs(squashRatio - 1.0);

        // Track deformation change — only play when ACTIVELY deforming (shape changing)
        const deformDelta = Math.abs(deformation - (this._grainLastDeform || 0));
        this._grainLastDeform = deformation;

        // Must be actively deforming (shape changing frame to frame) AND significantly deformed
        if (deformation < 0.03 || deformDelta < 0.003) {
            this._grainLastNotch = -1;
            return;
        }

        // Minimum velocity
        if (velocity < 1.0) {
            this._grainLastNotch = -1;
            return;
        }

        // Notch system: interval based on velocity (faster = more frequent clicks)
        // At low speed: ~150ms between clicks, at high speed: ~30ms
        const minInterval = 30;
        const maxInterval = 150;
        const speedNorm = Math.min(1, velocity / 12);
        const interval = maxInterval - speedNorm * (maxInterval - minInterval);

        const now = performance.now();
        if (now - this._grainLastTime < interval) return;
        this._grainLastTime = now;

        const c = this._ensureCtx();
        const t = c.currentTime + 0.005;

        // Deformation drives pitch: wide range, exponential curve for max contrast
        const pitch = 250 + Math.pow(deformation * 6, 1.6) * 3000; // 250Hz calm → 3000Hz+ intense

        // Randomly pick between two grain types for variation

        if (Math.random() > 0.4) {
            // === TYPE A: ASMR bubble pop — sine with fast pitch bend ===
            const osc = c.createOscillator(); osc.type = 'sine';
            const p = pitch * (0.9 + Math.random() * 0.2); // slight random
            osc.frequency.setValueAtTime(p * 0.7, t);
            osc.frequency.exponentialRampToValueAtTime(p * 1.1, t + 0.008);
            osc.frequency.exponentialRampToValueAtTime(p * 0.6, t + 0.025);
            const g = c.createGain();
            const vol = 0.02 + speedNorm * 0.03; // very quiet: 0.02–0.05
            g.gain.setValueAtTime(0, t);
            g.gain.linearRampToValueAtTime(vol, t + 0.002);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
            osc.connect(g).connect(this._master);
            osc.start(t); osc.stop(t + 0.035);
        } else {
            // === TYPE B: tiny tap click — filtered noise micro-burst ===
            const ns = c.createBufferSource();
            ns.buffer = this._noise(c, 0.008);
            const bp = c.createBiquadFilter(); bp.type = 'bandpass';
            bp.frequency.value = pitch * 1.5;
            bp.Q.value = 6 + Math.random() * 4;
            const g = c.createGain();
            const vol = 0.015 + speedNorm * 0.025;
            g.gain.setValueAtTime(vol, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.01);
            ns.connect(bp).connect(g).connect(this._master);
            ns.start(t);
        }
    },

    // ═══════════════════════════════════════════════════════════
    // MAGNET ZONE — continuous hum, pitch/volume driven by distance
    // Called from game update when bomb is near a magnet
    // ═══════════════════════════════════════════════════════════
    _magnetOsc: null,
    _magnetGain: null,

    magnetUpdate(distNorm) {
        // distNorm: 0 = at center, 1 = at edge of radius, >1 = outside
        if (!this._enabled) return;
        if (distNorm > 1.05) {
            this.magnetStop();
            return;
        }
        const c = this._ensureCtx();
        const proximity = 1 - Math.min(1, distNorm); // 1 = center, 0 = edge

        if (!this._magnetOsc) {
            // Create continuous oscillator
            this._magnetOsc = c.createOscillator(); this._magnetOsc.type = 'sine';
            this._magnetOsc.frequency.value = 80;
            const osc2 = c.createOscillator(); osc2.type = 'sine';
            osc2.frequency.value = 83; // slight detune for warmth
            this._magnetGain = c.createGain();
            this._magnetGain.gain.value = 0;
            const lp = c.createBiquadFilter(); lp.type = 'lowpass';
            lp.frequency.value = 400; lp.Q.value = 2;
            this._magnetOsc.connect(lp).connect(this._magnetGain).connect(this._master);
            osc2.connect(lp);
            this._magnetOsc.start();
            osc2.start();
            this._magnetOsc._osc2 = osc2;
            RCHIPL.Events?.emit?.('OnMagnetZone', { distance: distNorm, radius: 1 });
        }

        // Pitch and volume gradient: closer = higher pitch + louder
        const targetFreq = 60 + proximity * 200; // 60Hz edge → 260Hz center
        const targetVol = 0.02 + proximity * 0.10; // very quiet → modest
        this._magnetOsc.frequency.value = targetFreq;
        if (this._magnetOsc._osc2) this._magnetOsc._osc2.frequency.value = targetFreq * 1.04;
        this._magnetGain.gain.value = targetVol;
    },

    magnetStop() {
        if (this._magnetOsc) {
            try { this._magnetOsc.stop(); } catch(e) {}
            try { this._magnetOsc._osc2?.stop(); } catch(e) {}
            try { this._magnetOsc.disconnect(); } catch(e) {}
            try { this._magnetOsc._osc2?.disconnect(); } catch(e) {}
            try { this._magnetGain?.disconnect(); } catch(e) {}
            this._magnetOsc = null;
            this._magnetGain = null;
        }
    },

    // ═══════════════════════════════════════════════════════════
    // WIND ZONE — continuous breath/whoosh, volume by presence
    // ═══════════════════════════════════════════════════════════
    _windSource: null,
    _windGain: null,

    windStart(force) {
        if (!this._enabled) return;
        if (this._windSource) return;
        const c = this._ensureCtx();

        // Filtered noise = wind
        const bufDur = 2;
        const n = c.sampleRate * bufDur | 0;
        const buf = c.createBuffer(1, n, c.sampleRate);
        const d = buf.getChannelData(0);
        // Pink-ish noise
        let prev = 0;
        for (let i = 0; i < n; i++) {
            const w = Math.random() * 2 - 1;
            prev = prev * 0.6 + w * 0.4;
            d[i] = prev;
        }
        this._windSource = c.createBufferSource();
        this._windSource.buffer = buf;
        this._windSource.loop = true;

        const bp = c.createBiquadFilter(); bp.type = 'bandpass';
        bp.frequency.value = 500 + (force || 1) * 200;
        bp.Q.value = 1.5;
        const lp = c.createBiquadFilter(); lp.type = 'lowpass';
        lp.frequency.value = 2000;

        this._windGain = c.createGain();
        this._windGain.gain.setValueAtTime(0, c.currentTime);
        this._windGain.gain.linearRampToValueAtTime(0.06, c.currentTime + 0.3);

        this._windSource.connect(bp).connect(lp).connect(this._windGain).connect(this._master);
        this._windSource.start();
        RCHIPL.Events?.emit?.('OnWindZoneEnter', { force: force || 1 });
    },

    windStop() {
        if (this._windSource) {
            const c = this._ctx;
            if (c && this._windGain) {
                this._windGain.gain.linearRampToValueAtTime(0.001, c.currentTime + 0.3);
                const src = this._windSource;
                setTimeout(() => { try { src.stop(); src.disconnect(); } catch(e) {} }, 350);
            } else {
                try { this._windSource.stop(); this._windSource.disconnect(); } catch(e) {}
            }
            this._windSource = null;
            this._windGain = null;
            RCHIPL.Events?.emit?.('OnWindZoneExit', {});
        }
    },

    // ═══════════════════════════════════════════════════════════
    // ZERO G — deep space drone, very subtle
    // ═══════════════════════════════════════════════════════════
    _zeroGDrone: null,
    _zeroGGain: null,

    zeroGStart() {
        if (!this._enabled) return;
        if (this._zeroGDrone) return;
        const c = this._ensureCtx();

        // Deep sine drone
        const osc = c.createOscillator(); osc.type = 'sine';
        osc.frequency.value = 45;
        const osc2 = c.createOscillator(); osc2.type = 'triangle';
        osc2.frequency.value = 47; // detuned for depth

        // Very gentle noise bed
        const nBuf = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
        const nd = nBuf.getChannelData(0);
        let p = 0;
        for (let i = 0; i < nd.length; i++) { p = p * 0.7 + (Math.random()*2-1) * 0.3; nd[i] = p; }
        const nSrc = c.createBufferSource(); nSrc.buffer = nBuf; nSrc.loop = true;
        const nBp = c.createBiquadFilter(); nBp.type = 'bandpass';
        nBp.frequency.value = 200; nBp.Q.value = 3;
        const nGain = c.createGain(); nGain.gain.value = 0.03;

        this._zeroGGain = c.createGain();
        this._zeroGGain.gain.setValueAtTime(0, c.currentTime);
        this._zeroGGain.gain.linearRampToValueAtTime(0.08, c.currentTime + 0.8);

        const lp = c.createBiquadFilter(); lp.type = 'lowpass';
        lp.frequency.value = 300;

        osc.connect(lp).connect(this._zeroGGain).connect(this._master);
        osc2.connect(lp);
        nSrc.connect(nBp).connect(nGain).connect(this._zeroGGain);

        osc.start(); osc2.start(); nSrc.start();
        this._zeroGDrone = { osc, osc2, nSrc };
        RCHIPL.Events?.emit?.('OnZeroGEnter', {});
    },

    zeroGStop() {
        if (this._zeroGDrone) {
            const c = this._ctx;
            if (c && this._zeroGGain) {
                this._zeroGGain.gain.linearRampToValueAtTime(0.001, c.currentTime + 0.5);
                const drone = this._zeroGDrone;
                setTimeout(() => {
                    try { drone.osc.stop(); drone.osc.disconnect(); } catch(e) {}
                    try { drone.osc2.stop(); drone.osc2.disconnect(); } catch(e) {}
                    try { drone.nSrc.stop(); drone.nSrc.disconnect(); } catch(e) {}
                }, 600);
            }
            this._zeroGDrone = null;
            this._zeroGGain = null;
            RCHIPL.Events?.emit?.('OnZeroGExit', {});
        }
    },

    // ═══════════════════════════════════════════════════════════
    // EXPORT HELPERS — used only by audio prebake export
    // Produce stable loop/grain source material without ramps intended
    // for live gameplay transitions.
    // ═══════════════════════════════════════════════════════════
    exportMagnetLoop(distNorm = 0.24) {
        if (!this._enabled) return;
        this.magnetStop();
        const c = this._ensureCtx();
        const proximity = 1 - Math.max(0, Math.min(1, Number(distNorm) || 0.24));
        this._magnetOsc = c.createOscillator();
        this._magnetOsc.type = 'sine';
        const osc2 = c.createOscillator();
        osc2.type = 'sine';
        const targetFreq = 80 + proximity * 110;
        this._magnetOsc.frequency.value = targetFreq;
        osc2.frequency.value = targetFreq * 1.04;
        this._magnetGain = c.createGain();
        this._magnetGain.gain.value = 0.045 + proximity * 0.05;
        const lp = c.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = 360 + proximity * 320;
        lp.Q.value = 1.8;
        this._magnetOsc.connect(lp).connect(this._magnetGain).connect(this._master);
        osc2.connect(lp);
        this._magnetOsc._osc2 = osc2;
        this._magnetOsc.start();
        osc2.start();
    },

    exportWindLoop(force = 1) {
        if (!this._enabled) return;
        this.windStop();
        const c = this._ensureCtx();
        const bufDur = 2;
        const n = c.sampleRate * bufDur | 0;
        const buf = c.createBuffer(1, n, c.sampleRate);
        const d = buf.getChannelData(0);
        let prev = 0;
        for (let i = 0; i < n; i++) {
            const w = Math.random() * 2 - 1;
            prev = prev * 0.6 + w * 0.4;
            d[i] = prev;
        }
        this._windSource = c.createBufferSource();
        this._windSource.buffer = buf;
        this._windSource.loop = true;
        const bp = c.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = 520 + (Number(force) || 1) * 180;
        bp.Q.value = 1.4;
        const lp = c.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = 2000;
        this._windGain = c.createGain();
        this._windGain.gain.value = 0.055;
        this._windSource.connect(bp).connect(lp).connect(this._windGain).connect(this._master);
        this._windSource.start();
    },

    exportZeroGLoop() {
        if (!this._enabled) return;
        this.zeroGStop();
        const c = this._ensureCtx();
        const osc = c.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 46;
        const osc2 = c.createOscillator();
        osc2.type = 'triangle';
        osc2.frequency.value = 48;
        const nBuf = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
        const nd = nBuf.getChannelData(0);
        let p = 0;
        for (let i = 0; i < nd.length; i++) {
            p = p * 0.7 + (Math.random() * 2 - 1) * 0.3;
            nd[i] = p;
        }
        const nSrc = c.createBufferSource();
        nSrc.buffer = nBuf;
        nSrc.loop = true;
        const nBp = c.createBiquadFilter();
        nBp.type = 'bandpass';
        nBp.frequency.value = 190;
        nBp.Q.value = 2.5;
        const nGain = c.createGain();
        nGain.gain.value = 0.025;
        this._zeroGGain = c.createGain();
        this._zeroGGain.gain.value = 0.055;
        const lp = c.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = 280;
        osc.connect(lp).connect(this._zeroGGain).connect(this._master);
        osc2.connect(lp);
        nSrc.connect(nBp).connect(nGain).connect(this._zeroGGain);
        osc.start();
        osc2.start();
        nSrc.start();
        this._zeroGDrone = { osc, osc2, nSrc };
    },

    exportContactGrainLoop(variant = 'a') {
        if (!this._enabled) return;
        const c = this._ensureCtx();
        const flavor = String(variant || 'a').toLowerCase();
        const variants = {
            a: {
                pitch: 980,
                peak: 0.046,
                noisePeak: 0.020,
                q: 7.5,
                wobble: 1.08,
                tail: 0.050,
                noiseRatio: 1.55,
                triangleMix: 0.36
            },
            b: {
                pitch: 1380,
                peak: 0.034,
                noisePeak: 0.026,
                q: 9.8,
                wobble: 1.14,
                tail: 0.034,
                noiseRatio: 1.95,
                triangleMix: 0.16
            },
            c: {
                pitch: 760,
                peak: 0.052,
                noisePeak: 0.017,
                q: 6.2,
                wobble: 1.03,
                tail: 0.060,
                noiseRatio: 1.36,
                triangleMix: 0.44,
                extraBubble: true
            }
        };
        const cfg = variants[flavor] || variants.a;
        const t = c.currentTime + 0.02;
        const pitch = cfg.pitch;

        const osc = c.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(pitch * 0.72, t);
        osc.frequency.exponentialRampToValueAtTime(pitch * cfg.wobble, t + 0.008);
        osc.frequency.exponentialRampToValueAtTime(pitch * 0.58, t + cfg.tail);

        const osc2 = c.createOscillator();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(pitch * 0.50, t);
        osc2.frequency.exponentialRampToValueAtTime(pitch * 0.73, t + 0.014);
        osc2.frequency.exponentialRampToValueAtTime(pitch * 0.42, t + cfg.tail * 0.85);

        const toneMix = c.createGain();
        toneMix.gain.value = 1;
        const triMix = c.createGain();
        triMix.gain.value = cfg.triangleMix;
        osc.connect(toneMix);
        osc2.connect(triMix).connect(toneMix);

        const toneGain = c.createGain();
        toneGain.gain.setValueAtTime(0.0001, t);
        toneGain.gain.linearRampToValueAtTime(cfg.peak, t + 0.0025);
        toneGain.gain.exponentialRampToValueAtTime(0.0001, t + cfg.tail);
        toneMix.connect(toneGain).connect(this._master);

        osc.start(t);
        osc.stop(t + cfg.tail + 0.01);
        osc2.start(t);
        osc2.stop(t + cfg.tail + 0.01);

        const ns = c.createBufferSource();
        ns.buffer = this._noise(c, 0.014);
        const bp = c.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = pitch * cfg.noiseRatio;
        bp.Q.value = cfg.q;
        const noiseGain = c.createGain();
        noiseGain.gain.setValueAtTime(cfg.noisePeak, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.012);
        ns.connect(bp).connect(noiseGain).connect(this._master);
        ns.start(t);

        if (cfg.extraBubble) {
            const bubble = c.createOscillator();
            bubble.type = 'sine';
            bubble.frequency.setValueAtTime(pitch * 0.88, t + 0.016);
            bubble.frequency.exponentialRampToValueAtTime(pitch * 0.46, t + 0.055);
            const bubbleGain = c.createGain();
            bubbleGain.gain.setValueAtTime(0.0001, t + 0.016);
            bubbleGain.gain.linearRampToValueAtTime(cfg.peak * 0.34, t + 0.021);
            bubbleGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.060);
            bubble.connect(bubbleGain).connect(this._master);
            bubble.start(t + 0.016);
            bubble.stop(t + 0.065);
        }
    },

    // ═══════════════════════════════════════════════════════════
    // PIVOT ROTATE — cliquetis per angle notch
    // ═══════════════════════════════════════════════════════════
    _pivotLastAngles: {},

    pivotTick(pivotId, angleDeg) {
        if (!this._enabled) return;
        if (RCHIPL.Platform?._adInProgress) return;
        const notchDeg = 8; // one click per 8 degrees
        const currentNotch = Math.floor(angleDeg / notchDeg);
        const lastNotch = this._pivotLastAngles[pivotId];
        if (currentNotch === lastNotch) return;
        this._pivotLastAngles[pivotId] = currentNotch;
        if (lastNotch === undefined) return; // skip first frame

        if (!this._cd('pivot', 40)) return;
        const c = this._ensureCtx(), t = c.currentTime + 0.005;

        // Mechanical click — short, dry
        const osc = c.createOscillator(); osc.type = 'sine';
        const pitch = 600 + Math.random() * 200;
        osc.frequency.setValueAtTime(pitch, t);
        osc.frequency.exponentialRampToValueAtTime(pitch * 0.5, t + 0.02);
        const g = c.createGain();
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.06, t + 0.001);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.025);
        osc.connect(g).connect(this._master);
        osc.start(t); osc.stop(t + 0.03);

        RCHIPL.Events?.emit?.('OnPivotRotate', { angleDeg });
    },

    // ═══════════════════════════════════════════════════════════
    // CLEANUP — stop all continuous sounds (on layout exit)
    // ═══════════════════════════════════════════════════════════
    stopAll() {
        this.magnetStop();
        this.windStop();
        this.zeroGStop();
        this._pivotLastAngles = {};
        this._grainLastDeform = 0;
    },
};

window.GameSFX = GameSFX;
