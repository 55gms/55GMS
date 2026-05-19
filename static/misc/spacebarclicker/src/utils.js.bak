// DOM utils
const gId = t => document.getElementById(t);
const qSel = t => document.querySelector(t);
const qSelA = t => document.querySelectorAll(t);
const cEl = s => {
    let template = document.createElement("template");
    template.innerHTML = s;
    return template.content.firstChild;
};

// Text utils
const repltxt = (t, vs) => {
    vs.forEach((e, i) => t = t.replace("%" + (i+1), e));
    return t;
};

// Math utils
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
const clamp01 = (val) => clamp(val, 0, 1);
const lerp = (a, b, t) => a + (b - a) * clamp01(t);

// Number utils
const NUBMER_FORMATS = ['M', 'B', 'T', 'Q', 'Qui', 'S', 'Sp']

const fmt = (value, f) => { return (f + value).slice(-f.length); };
const nfmt = (v) => Math.floor(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const nfmt1 = (v) => v.toFixed(3).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const nfmt2 = (v) => {
    if (v < 1000000) {
        return nfmt(v);
    }

    let nv = 1000000;
    for (let i in NUBMER_FORMATS)
    {
        nv *= 1000;
        if (v < nv) {
            return nfmt1(v / (nv / 1000)) + NUBMER_FORMATS[i];
        }
    }
}

// Randoms
const randnum = (v = 1) => Math.random() * v;
const randint = (v) => Math.round(randnum(v));
const randsig = () => randint(10) % 2 == 0 ? 1 : -1;
const randweight = (c, p) => {
    let sum = c.map(p).reduce((l, r) => l + r);
    let rand = randint(sum);   
    return c.filter(e => {
        rand = rand - p(e);
        return rand <= 0;
    })[0];
};
const randweightsqrd = (c, p) => randweight(c, v => p(v) * p(v));

// Coroutine
const co = (f) => {
    let g = f();

    const next = () => {
        let result = g.next();
        if (!result.done) {
            setTimeout(next, result.value * 1000);
        }
    };

    next();
};

// Mobile
const mobile = () => navigator.userAgent.match("Mobile");

// Audio stuff
const audio_player = [new Audio(), new Audio()];
let audio_index = 0;
let AUDIO = true;
const playaudio = (a) => {
    if (AUDIO) {
        audio_index = (audio_index + 1) % audio_player.length;

        audio_player[audio_index].pause();
        audio_player[audio_index].src = a[Math.floor(Math.random() * a.length)];
        audio_player[audio_index].play();
    }
};
