let ITEMS = [
    {
        name: "Monkey",
        description: "A monkey to help you press space. It doesn't really know what a <i>spacebar</i> is, so it will just bash the whole keyboard and eventually hit it. It succeeds every <b>%v seconds</b>.",
        cost: 30,
        initial_value: .2,
        lvl: 0,
        cost_func: (x) => 1.1 * x,
        value_func: (x) => x,
        getDescription: (it) => it.description.replace("%v", 1.0 / it.initial_value),
    },
    {
        name: "Boomer Mom",
        description: "A boomer mom who can't barely open a Word document to help you press it. Every mom can press it <b>%vx a second</b>!",
        cost: 120,
        initial_value: 3,
        lvl: 0,
        cost_func: (x) => 1.3 * x,
        value_func: (x) => 1.0 * x,
        getDescription: (it) => it.description.replace("%v", nfmt(it.value)),
    },
    {
        name: "Gen Z Kid",
        description: "A Generation Z kid will help you press it. They haven't ever seen a keyboard before, but they're good at scrolling short vertical videos online, so they do it <b>%vx a second</b>!",
        cost: 500,
        initial_value: 20,
        lvl: 0,
        cost_func: (x) => 1.4 * x,
        value_func: (x) => 1.0 * x,
        getDescription: (it) => it.description.replace("%v", nfmt(it.value)),
    },
    {
        name: "Keyboard Upgrade",
        description: "Every upgrade will <b>DOUBLE</b> your own hits.",
        cost: 6000,
        multiplier: 2,
        lvl: 0,
        cost_func: (x) => 3.5 * x,
        getDescription: (it) => it.description,
    },
    {
        name: "Angry Influencer",
        description: "Angry influencer whose computer crashed and they're now bashing their heads against the keyboard. The more influencer you get, the faster they can hit it, because they can't stand competition. The next one will give <b>%vx per second</b>.",
        cost: 10000,
        initial_value: 150,
        lvl: 0,
        cost_func: (x) => 1.5 * x,
        value_func: (x) => 1.2 * x,
        getDescription: (it) => it.description.replace("%v", nfmt(it.value)),
    },
    {
        name: "MOBA Gamer",
        description: "MOBA gamers are fast at pressing keys and they play well in teams. New gamer will hit it <b>%vx per second</b>.",
        cost: 200000,
        initial_value: 600,
        lvl: 0,
        cost_func: (x) => 1.4 * x,
        value_func: (x) => 1.25 * x,
        getDescription: (it) => it.description.replace("%v", nfmt(it.value)),
    },
    {
        name: "Homemade Pressing Robot",
        description: "Just a simple robot made out of a broken robot vacuum cleaner that can press the key at the impressive rate of <b>%vx per second</b>!",
        cost: 800000,
        initial_value: 3500,
        lvl: 0,
        cost_func: (x) => 1.4 * x,
        value_func: (x) => 1.25 * x,
        getDescription: (it) => it.description.replace("%v", nfmt(it.value)),
    },
    {
        name: "Laser Machine Gun",
        description: "A machine gun that shoots a lot of laser blasts at the spacebar, at a rate of <b>%vx per second</b>!",
        cost: 2000000,
        initial_value: 25000,
        lvl: 0,
        cost_func: (x) => 1.4 * x,
        value_func: (x) => 1.3 * x,
        getDescription: (it) => it.description.replace("%v", nfmt(it.value)),
    },
    {
        name: "Nuclear Blast Gun",
        description: "No one knows how it works except for the girl that created it. But the rate is pretty high at <b>%vx per second</b>!",
        cost: 10000000,
        initial_value: 100000,
        lvl: 0,
        cost_func: (x) => 1.4 * x,
        value_func: (x) => 1.3 * x,
        getDescription: (it) => it.description.replace("%v", nfmt(it.value)),
    },
    {
        name: "Alien Tech Key Pressing Machine",
        description: "No one knows how it works except for the girl that created it. But the rate is pretty high at <b>%vx per second</b>!",
        cost: 80000000,
        initial_value: 1000000,
        lvl: 0,
        cost_func: (x) => 1.4 * x,
        value_func: (x) => 1.3 * x,
        getDescription: (it) => it.description.replace("%v", nfmt(it.value)),
    },
];

(function() {
    for (let i in ITEMS) {
        ITEMS[i].value = ITEMS[i].initial_value;
    }
})();

let total_item_value = (item) => {
    let c = 0;
    let v = item.initial_value;

    for (let i = 0; i < item.lvl; i++) {
        c += v;
        v = item.value_func(v);
    }

    return c;
}

let LEVELS = [
    {
        psvalue: 0,
        rain: 0,
    },
    {
        psvalue: 10,
        rain: 5,
    },
    {
        psvalue: 100,
        rain: 10,
    },
    {
        psvalue: 500,
        rain: 12,
    },
    {
        psvalue: 1000,
        rain: 15,
    },
    {
        psvalue: 5000,
        rain: 17,
    },
    {
        psvalue: 10000,
        rain: 18,
    },
    {
        psvalue: 50000,
        rain: 19,
    },
    {
        psvalue: 100000,
        rain: 20,
    },
    {
        psvalue: 300000,
        rain: 21,
    },
    {
        psvalue: 800000,
        rain: 22,
    },
    {
        psvalue: 1000000,
        rain: 23,
    },
];

const SOUNDS = {
    click: [
        jsfxr([0,0,0.07086974935991196,0.45065582613048494,0.12451125371771453,0.6610070860477287,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0.5]),
        jsfxr([0,0,0.07086974935991196,0.35,0.12451125371771453,0.7,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0.5]),
        jsfxr([0,0,0.1,0.35,0.12451125371771453,0.65,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0.5]),
    ],
    buy: [
        jsfxr([3,0,0.2914228463087029,0.39443991332966943,0.47848602130372286,0.08144714074126518,0,0.24222569085835757,0,0,0,-0.6369038513918057,0.7915717139323191,0,0,0,0,0,1,0,0,0,0,0.5]),
        jsfxr([3,0,0.2914228463087029,0.39443991332966943,0.55,0.15,0,0.24222569085835757,0,0,0,-0.6369038513918057,0.7915717139323191,0,0,0,0,0,1,0,0,0,0,0.5]),
        jsfxr([3,0,0.25,0.39443991332966943,0.45,0.25,0,0.24222569085835757,0,0,0,-0.6369038513918057,0.7915717139323191,0,0,0,0,0,1,0,0,0,0,0.5]),
    ],
};
