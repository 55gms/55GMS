// Shared item catalog. Physics (weapons.js) and UI (shop/skins) both read from here.
// Lengths in metres, mass in kg. kind: 'fist' | 'blunt' | 'blade' | 'pole' | 'chain'
// special: 'scabbard' (katana is drawn from a sheath on the first swing)
//          'return'   (hammer flies off on a hard hit and comes back to its owner)
//          'butterfly'(knife with loose jointed handle halves)
// knock: knockback multiplier on top of the kind's default.

export const WEAPONS = [
  { id: 'fists',           name: 'Fists',           price: 0,    kind: 'fist',  damage: 6,  length: 0,    mass: 0,   crit: 0.10 },
  { id: 'bat',             name: 'Bat',             price: 100,  kind: 'blunt', damage: 9,  length: 0.95, mass: 1.2, crit: 0.12 },
  { id: 'staff',           name: 'Staff',           price: 150,  kind: 'pole',  damage: 9,  length: 1.70, mass: 1.3, crit: 0.12 },
  { id: 'kanabo',          name: 'Kanabo',          price: 200,  kind: 'blunt', damage: 12, length: 1.10, mass: 2.0, crit: 0.12, knock: 1.1 },
  { id: 'nunchaku',        name: 'Nunchaku',        price: 250,  kind: 'chain', damage: 10, length: 0.90, mass: 0.9, crit: 0.22 },
  { id: 'butterfly_knife', name: 'Butterfly Knife', price: 300,  kind: 'blade', damage: 11, length: 0.55, mass: 0.5, crit: 0.30, special: 'butterfly' },
  { id: 'cleaver',         name: 'Cleaver',         price: 350,  kind: 'blade', damage: 13, length: 0.65, mass: 1.4, crit: 0.18 },
  { id: 'machete',         name: 'Machete',         price: 400,  kind: 'blade', damage: 13, length: 0.90, mass: 1.0, crit: 0.20 },
  { id: 'katana',          name: 'Katana',          price: 450,  kind: 'blade', damage: 15, length: 1.15, mass: 1.1, crit: 0.25, special: 'scabbard' },
  { id: 'mace',            name: 'Mace',            price: 500,  kind: 'blunt', damage: 15, length: 1.00, mass: 2.4, crit: 0.12, knock: 1.15 },
  { id: 'thunder_hammer',  name: 'Thunder Hammer',  price: 550,  kind: 'blunt', damage: 17, length: 0.70, mass: 2.6, crit: 0.20, knock: 1.4, special: 'return' },
  { id: 'chain_mace',      name: 'Chain Mace',      price: 600,  kind: 'chain', damage: 17, length: 1.30, mass: 2.4, crit: 0.20 },
  { id: 'sword',           name: 'Sword',           price: 650,  kind: 'blade', damage: 16, length: 1.20, mass: 1.4, crit: 0.22 },
  { id: 'double_sword',    name: 'Double Sword',    price: 700,  kind: 'blade', damage: 17, length: 1.80, mass: 2.0, crit: 0.22 },
  { id: 'yari',            name: 'Yari',            price: 750,  kind: 'pole',  damage: 17, length: 2.00, mass: 1.8, crit: 0.22 },
  { id: 'hammer',          name: 'Hammer',          price: 800,  kind: 'blunt', damage: 20, length: 1.50, mass: 3.4, crit: 0.12, knock: 1.3 },
  { id: 'poleaxe',         name: 'Poleaxe',         price: 850,  kind: 'pole',  damage: 19, length: 2.00, mass: 2.6, crit: 0.20 },
  { id: 'executioner',     name: 'Executioner',     price: 900,  kind: 'blade', damage: 21, length: 1.40, mass: 2.8, crit: 0.25 },
  { id: 'scythe',          name: 'Scythe',          price: 1000, kind: 'blade', damage: 22, length: 2.00, mass: 2.6, crit: 0.28 },
  { id: 'great_axe',       name: 'Great Axe',       price: 1500, kind: 'blade', damage: 23, length: 1.55, mass: 3.0, crit: 0.22, knock: 1.3 },
  { id: 'morning_star',    name: 'Morning Star',    price: 2000, kind: 'blunt', damage: 24, length: 1.30, mass: 3.1, crit: 0.15, knock: 1.4 },
  { id: 'halberd',         name: 'Halberd',         price: 3000, kind: 'pole',  damage: 25, length: 1.95, mass: 2.8, crit: 0.24 },
  // insane tier (src/specials.js): every weapon from here on has a signature ability
  { id: 'buzz_saw',        name: 'Buzzsaw Pike',    price: 3500, kind: 'pole',  damage: 23, length: 1.95, mass: 2.6, crit: 0.20, knock: 1.1,  special: 'saw' },     // grinding disc + ricochet sparks
  { id: 'meteor_flail',    name: 'Meteor Flail',    price: 4000, kind: 'chain', damage: 27, length: 1.50, mass: 3.4, crit: 0.22, knock: 1.45 },
  { id: 'dual_scythe',     name: 'Dual Scythe',     price: 5000, kind: 'pole',  damage: 30, length: 1.30, mass: 3.0, crit: 0.32 },   // red, blade at each end, 2 spikes
  { id: 'frost_scythe',    name: 'Frost Scythe',    price: 7000, kind: 'blade', damage: 27, length: 2.00, mass: 2.5, crit: 0.30, knock: 1.1,  special: 'frost' },   // chills, freezes solid, shatters
  // premium tier: each has a unique special (src/specials.js)
  { id: 'dragon_blade',    name: 'Dragon Blade',    price: 10000, kind: 'blade', damage: 33, length: 1.62, mass: 2.6, crit: 0.34, knock: 1.35, special: 'fire' },    // sets what it hits on fire
  { id: 'gravity_mace',    name: 'Gravity Mace',    price: 12500, kind: 'blunt', damage: 37, length: 1.52, mass: 3.0, crit: 0.24, knock: 1.3,  special: 'gravity' }, // launches foes skyward, slams them down
  { id: 'void_maul',       name: 'Void Maul',       price: 15000, kind: 'blunt', damage: 38, length: 1.92, mass: 3.0, crit: 0.36, knock: 1.6,  special: 'void' },    // black-hole head pulls foes in, implodes on big hits
  { id: 'meteor_staff',    name: 'Meteor Staff',    price: 17500, kind: 'pole',  damage: 38, length: 2.12, mass: 2.4, crit: 0.30, knock: 1.35, special: 'meteor' },  // hits call down a meteor volley
  { id: 'storm_glaive',    name: 'Storm Glaive',    price: 20000, kind: 'pole',  damage: 42, length: 2.30, mass: 2.8, crit: 0.40, knock: 1.5,  special: 'storm' },   // crackling electricity, chain lightning
  // god tier
  { id: 'sun_hammer',      name: 'Sun Hammer',      price: 30000, kind: 'blunt', damage: 54, length: 1.75, mass: 3.2, crit: 0.32, knock: 1.6,  special: 'sun' },     // spinning charges a supernova
  { id: 'plasma_katana',   name: 'Plasma Katana',   price: 50000, kind: 'blade', damage: 48, length: 1.30, mass: 1.3, crit: 0.45, knock: 1.2,  special: 'plasma' },  // beam extends while spinning + echo slashes
];

// Old / themed ids still referenced by data files map onto the roster above.
export const WEAPON_ALIASES = {
  rolling_pin: 'bat', ladle: 'staff', baguette: 'staff', pizza_cutter: 'butterfly_knife', spear: 'yari',
  axe: 'poleaxe', flail: 'chain_mace', trident: 'yari', double_blade: 'double_sword', giant_fork: 'yari', peel: 'hammer',
};

// hat: cosmetic id drawn by render.js; body: fighter base colour
export const SKINS = [
  { id: 'classic',     name: 'Classic',       price: 0,    body: '#f2eee6', hat: null },
  { id: 'chef',        name: 'Head Chef',     price: 300,  body: '#f7f4ee', hat: 'chef_hat' },
  { id: 'delivery',    name: 'Delivery',      price: 400,  body: '#f2eee6', hat: 'cap_red' },
  { id: 'basil',       name: 'Basil',         price: 500,  body: '#cfe8c6', hat: 'bandana_green' },
  { id: 'pepperoni',   name: 'Pepperoni',     price: 650,  body: '#f2d7cf', hat: 'salami_helm' },
  { id: 'crust',       name: 'Crust Knight',  price: 800,  body: '#ecd9b0', hat: 'crust_helm' },
  { id: 'mozzarella',  name: 'Mozzarella',    price: 1000, body: '#fffdf6', hat: 'cheese_crown' },
  { id: 'charcoal',    name: 'Wood-Fired',    price: 1500, body: '#9aa0a8', hat: 'oven_helm' },
];

// Boss-only weapons: never in the shop.
export const BOSS_WEAPONS = [
  { id: 'giant_hammer', name: 'Giant Hammer', price: 0, kind: 'blunt', damage: 26, length: 2.30, mass: 4.4, crit: 0.10, knock: 1.7 },
];

// Arena-only weapons (loose items in the original levels, never in the shop).
// Ninja star: meant to be KICKED — a kick launches it and it hurts whoever it hits for a moment (specials: 'kick').
export const ENV_WEAPONS = [
  { id: 'shuriken', name: 'Ninja Star', price: 0, kind: 'blade', damage: 30, length: 0.5, mass: 0.4, crit: 0.35, special: 'kick' },
];

export const weaponById = (id) => {
  const key = WEAPON_ALIASES[id] || id;
  return WEAPONS.find((w) => w.id === key) || BOSS_WEAPONS.find((w) => w.id === key) || ENV_WEAPONS.find((w) => w.id === key) || WEAPONS[0];
};
export const skinById = (id) => SKINS.find((s) => s.id === id) || SKINS[0];
