// Enemy archetypes. Levels reference these by id and may override any field.
// hat: drawn by render.js drawHat. helmet: {armour: head damage multiplier while worn, hp: head damage before it flies off}
// dmgMult: multiplier on damage this enemy deals. toughness: incoming damage is divided by this.

export const ENEMIES = {
  rookie:    { name: 'Rookie',     hp: 60,  weapon: 'fists',        color: '#e9e4da', hat: 'rookie_band',            ai: 'dummy',   dmgMult: 0.8 },
  brawler:   { name: 'Brawler',    hp: 80,  weapon: 'fists',        color: '#e6d3c3', hat: 'mohawk', ai: 'rookie',  dmgMult: 0.95 },
  line_cook: { name: 'Line Cook',  hp: 80,  weapon: 'staff',        color: '#f4f1ea', hat: 'cook_cap',      ai: 'rookie',  dmgMult: 1.0 },
  delivery:  { name: 'Delivery',   hp: 90,  weapon: 'bat',          color: '#ece6db', hat: 'moped_helmet',       ai: 'brawler', dmgMult: 1.05 },
  bandit:    { name: 'Bandit',     hp: 90,  weapon: 'machete',      color: '#dcd3c6', hat: 'bandit_kerchief', ai: 'brawler', dmgMult: 1.1 },
  knight:    { name: 'Knight',     hp: 110, weapon: 'cleaver',      color: '#d9dde3', hat: 'knight_helm',    ai: 'brawler', dmgMult: 1.15, helmet: { armour: 0.35, hp: 30 } },
  samurai:   { name: 'Samurai',    hp: 115, weapon: 'katana',       color: '#e8e2d6', hat: 'kabuto',            ai: 'skilled', dmgMult: 1.1 },
  viking:    { name: 'Viking',     hp: 130, weapon: 'poleaxe',      color: '#e3cfbf', hat: 'horned_helm',   ai: 'skilled', dmgMult: 0.85, helmet: { armour: 0.4, hp: 35 } },
  ninja:     { name: 'Ninja',      hp: 100, weapon: 'nunchaku',     color: '#5d6576', hat: 'ninja_mask',            ai: 'skilled', dmgMult: 1.1 },
  gladiator: { name: 'Gladiator',  hp: 130, weapon: 'yari',         color: '#e6d6c2', hat: 'gladiator_helm',     ai: 'skilled', dmgMult: 0.7, helmet: { armour: 0.3, hp: 45 } },

  // ---- Act 5 · freezer
  frost_cook:     { name: 'Frost Cook',     hp: 110, weapon: 'machete',      color: '#e6f1f7', hat: 'frost_beanie',   ai: 'skilled', dmgMult: 0.9 },
  ice_brute:      { name: 'Ice Brute',      hp: 150, weapon: 'mace',         color: '#dfe9ef', hat: 'ice_hood',       ai: 'brawler', dmgMult: 0.8, helmet: { armour: 0.5, hp: 40 } },
  penguin_waiter: { name: 'Penguin Waiter', hp: 105, weapon: 'nunchaku',     color: '#4a5261', hat: 'penguin_hood',   ai: 'skilled', dmgMult: 1.0 },
  // ---- Act 6 · docks
  deckhand:       { name: 'Deckhand',       hp: 120, weapon: 'bat',          color: '#eadfce', hat: 'deck_beanie',    ai: 'brawler', dmgMult: 1.0 },
  pirate_chef:    { name: 'Pirate Chef',    hp: 130, weapon: 'sword',        color: '#e8dccb', hat: 'tricorn',        ai: 'skilled', dmgMult: 0.9 },
  diver:          { name: 'Diver',          hp: 140, weapon: 'yari',         color: '#d6dde2', hat: 'dive_helmet',    ai: 'skilled', dmgMult: 0.85, helmet: { armour: 0.35, hp: 55 } },
  // ---- Act 7 · volcano
  grill_master:   { name: 'Grill Master',   hp: 135, weapon: 'cleaver',      color: '#e9d2c2', hat: 'grill_mask',     ai: 'skilled', dmgMult: 1.0, helmet: { armour: 0.5, hp: 40 } },
  fire_dancer:    { name: 'Fire Dancer',    hp: 120, weapon: 'staff',        color: '#f3dcc8', hat: 'flame_crown',    ai: 'skilled', dmgMult: 1.1 },
  magma_brute:    { name: 'Magma Brute',    hp: 175, weapon: 'hammer',       color: '#7d635a', hat: 'magma_rock',     ai: 'brawler', dmgMult: 0.7 },
  // ---- Act 8 · sky
  sky_monk:       { name: 'Sky Monk',       hp: 125, weapon: 'staff',        color: '#f1e9d8', hat: 'monk_hat',       ai: 'skilled', dmgMult: 1.0 },
  wind_knight:    { name: 'Wind Knight',    hp: 155, weapon: 'halberd',      color: '#dde3ea', hat: 'winged_helm',    ai: 'skilled', dmgMult: 0.75, helmet: { armour: 0.35, hp: 60 } },
  cloud_ninja:    { name: 'Cloud Ninja',    hp: 125, weapon: 'katana',       color: '#c9d3e6', hat: 'cloud_mask',     ai: 'skilled', dmgMult: 1.0 },
  // ---- Act 9 · neon
  neon_punk:      { name: 'Neon Punk',      hp: 135, weapon: 'chain_mace',   color: '#ecdfd6', hat: 'neon_mohawk',    ai: 'brawler', dmgMult: 0.95 },
  robo_waiter:    { name: 'Robo Waiter',    hp: 165, weapon: 'great_axe',    color: '#b9c2cc', hat: 'robo_head',      ai: 'skilled', dmgMult: 0.7, helmet: { armour: 0.4, hp: 60 } },
  arcade_champ:   { name: 'Arcade Champ',   hp: 140, weapon: 'double_sword', color: '#f0e6dc', hat: 'vr_visor',       ai: 'skilled', dmgMult: 0.9 },
  // ---- Act 10 · space
  astro_cook:     { name: 'Astro Cook',     hp: 150, weapon: 'morning_star', color: '#f2f2f2', hat: 'space_helmet',   ai: 'skilled', dmgMult: 0.7, helmet: { armour: 0.35, hp: 65 } },
  alien_grunt:    { name: 'Alien Grunt',    hp: 165, weapon: 'halberd',      color: '#9fd59a', hat: 'alien_antennae', ai: 'brawler', dmgMult: 0.75 },
  cyborg_chef:    { name: 'Cyborg Chef',    hp: 180, weapon: 'meteor_flail', color: '#cfd6dd', hat: 'cyborg_eye',     ai: 'skilled', dmgMult: 0.65, helmet: { armour: 0.4, hp: 70 } },

  // special: signature attack run by bosses.js (cheese lobs / giant-hammer slams / laser eyes / phase mix). eyes: head-frame laser origins
  // Boss curve (user: bosses too easy vs dual spears; every boss harder than the last, not too hard):
  // toughness climbs in level order; hp and dmgMult were then calibrated per boss from measured fights (scripted
  // dual-spear player): time-to-kill rises 14 s → 45 s and the share of a reckless player's HP lost over the fight
  // rises 0.8 → 1.8 (bosses have different reach / specials, so equal stats don't give equal difficulty).
  big_cheese:    { name: 'The Big Cheese', hp: 830, weapon: 'kanabo',       color: '#ffe7a3', hat: 'big_cheese', ai: 'boss', scale: 1.8, spinMult: 0.6, boss: true, dmgMult: 0.93, toughness: 1.2, special: 'cheese' },
  sir_pepperoni: { name: 'Sir Pepperoni',  hp: 600, weapon: 'giant_hammer', color: '#f0cfc4', hat: 'pepperoni_helm',  ai: 'boss', scale: 1.8, spinMult: 0.6, boss: true, dmgMult: 0.37, toughness: 1.25, helmet: { armour: 0.5, hp: 80 }, special: 'slam' },
  oven_lord:     { name: 'Oven Lord',      hp: 650, weapon: 'cleaver',      color: '#bcab9c', hat: 'oven_lord',    ai: 'boss', scale: 1.8, spinMult: 0.6, boss: true, dmgMult: 0.73, toughness: 1.3, helmet: { armour: 0.45, hp: 100 }, special: 'laser', eyes: [[0.32, 0.3], [0.74, 0.3]] },
  mamma_mia:     { name: 'Mamma Mia',      hp: 1900, weapon: 'scythe',       color: '#fbf7ef', hat: 'mamma_tower',     ai: 'boss', scale: 1.9, spinMult: 0.58, boss: true, dmgMult: 0.33, toughness: 1.35 },   // plain boss: no special attack (user request)

  // ---- bosses of the original Ragdoll Hit levels (converted; they sit between our bosses in the 10/10 interleave:
  // final levels 10, 30, 50, … 150). Weapons match the originals; stats start between their neighbouring bosses.
  hit_boss_1: { name: 'The Bruiser',     hp: 720,  weapon: 'fists',       color: '#e6d3c3', hat: 'mohawk',         ai: 'boss', scale: 2.0, spinMult: 0.6,  boss: true, dmgMult: 3.0,  toughness: 1.15 },
  hit_boss_2: { name: 'The Decapitator', hp: 995,  weapon: 'executioner', color: '#d9dde3', hat: 'knight_helm',    ai: 'boss', scale: 2.0, spinMult: 0.6,  boss: true, dmgMult: 0.36, toughness: 1.22 },
  hit_boss_3: { name: 'Spear Sentinel',  hp: 1060, weapon: 'yari',        color: '#e8e2d6', hat: 'kabuto',         ai: 'boss', scale: 2.0, spinMult: 0.6,  boss: true, dmgMult: 0.78, toughness: 1.28 },
  hit_boss_4: { name: 'Poleaxe Brute',   hp: 1400, weapon: 'poleaxe',     color: '#e3cfbf', hat: 'horned_helm',    ai: 'boss', scale: 2.0, spinMult: 0.58, boss: true, dmgMult: 0.46, toughness: 1.33 },
  hit_boss_5: { name: 'The Lancer',      hp: 1925, weapon: 'yari',        color: '#e6d6c2', hat: 'gladiator_helm', ai: 'boss', scale: 2.0, spinMult: 0.58, boss: true, dmgMult: 0.65, toughness: 1.36 },
  hit_boss_6: { name: 'Spear Warden',    hp: 1560, weapon: 'yari',        color: '#dde3ea', hat: 'winged_helm',    ai: 'boss', scale: 2.0, spinMult: 0.56, boss: true, dmgMult: 0.58, toughness: 1.41 },
  hit_boss_7: { name: 'Chain Warlord',   hp: 1905, weapon: 'chain_mace',  color: '#d9cfc6', hat: 'grill_mask',     ai: 'boss', scale: 2.0, spinMult: 0.56, boss: true, dmgMult: 0.55, toughness: 1.46 },
  hit_boss_8: { name: 'Giant Machete',   hp: 2100, weapon: 'machete',     color: '#5d6576', hat: 'ninja_mask',     ai: 'boss', scale: 2.0, spinMult: 0.55, boss: true, dmgMult: 1.36, toughness: 1.51 },

  // ---- mini-bosses (levels 45/55/…/95) and act bosses (50/60/…/100): hat id = boss id, drawn by src/art/characters.js
  snowball_sam:    { name: 'Snowball Sam',     hp: 600, weapon: 'mace',         color: '#eef5fa', hat: 'snowball_sam',    ai: 'boss', scale: 1.45, spinMult: 0.7,  boss: true, dmgMult: 0.25, toughness: 1.38,  special: 'snowball' },
  brain_freeze:    { name: 'Brain Freeze',     hp: 1325, weapon: 'great_axe',    color: '#e3f0f7', hat: 'brain_freeze',    ai: 'boss', scale: 1.85, spinMult: 0.6,  boss: true, dmgMult: 0.22, toughness: 1.4,  special: 'icicles' },
  captain_anchovy: { name: 'Captain Anchovy',  hp: 700, weapon: 'sword',        color: '#e8dccb', hat: 'captain_anchovy', ai: 'boss', scale: 1.5,  spinMult: 0.7,  boss: true, dmgMult: 0.22,  toughness: 1.42, special: 'anchor' },
  calamari_king:   { name: 'Calamari King',    hp: 800, weapon: 'halberd',      color: '#f0d6e4', hat: 'calamari_king',   ai: 'boss', scale: 1.9,  spinMult: 0.58, boss: true, dmgMult: 0.12, toughness: 1.45, special: 'tentacles' },
  hot_sauce:       { name: 'Hot Sauce',        hp: 775, weapon: 'cleaver',      color: '#f4d3c4', hat: 'hot_sauce',       ai: 'boss', scale: 1.5,  spinMult: 0.7,  boss: true, dmgMult: 0.42, toughness: 1.47,  special: 'flame' },
  chili_colossus:  { name: 'Chili Colossus',   hp: 640, weapon: 'morning_star', color: '#d9b3a3', hat: 'chili_colossus',  ai: 'boss', scale: 2.0,  spinMult: 0.55, boss: true, dmgMult: 0.15, toughness: 1.5,  special: 'meteors' },
  windbag:         { name: 'Windbag',          hp: 2060, weapon: 'yari',         color: '#e9eef3', hat: 'windbag',         ai: 'boss', scale: 1.5,  spinMult: 0.7,  boss: true, dmgMult: 0.55, toughness: 1.52,  special: 'gust' },
  thunder_crust:   { name: 'Thunder Crust',    hp: 1145, weapon: 'poleaxe',      color: '#e8e0cf', hat: 'thunder_crust',   ai: 'boss', scale: 1.9,  spinMult: 0.58, boss: true, dmgMult: 0.19, toughness: 1.55,  special: 'lightning' },
  glitch:          { name: 'Glitch',           hp: 2900, weapon: 'katana',       color: '#d9d2f0', hat: 'glitch',          ai: 'boss', scale: 1.5,  spinMult: 0.72, boss: true, dmgMult: 0.47, toughness: 1.57,  special: 'teleport' },
  mecha_mozza:     { name: 'Mecha Mozzarella', hp: 1590, weapon: 'executioner',  color: '#c3cad2', hat: 'mecha_mozza',     ai: 'boss', scale: 2.0,  spinMult: 0.55, boss: true, dmgMult: 0.28, toughness: 1.6, special: 'rockets' },
  zero_g:          { name: 'Zero-G',           hp: 2750, weapon: 'meteor_flail', color: '#e6ecf5', hat: 'zero_g',          ai: 'boss', scale: 1.55, spinMult: 0.7,  boss: true, dmgMult: 0.24, toughness: 1.62, special: 'gravity' },
  emperor_crust:   { name: 'Emperor Crust',    hp: 1000, weapon: 'dual_scythe',  color: '#f3e4c4', hat: 'emperor_crust',   ai: 'boss', scale: 2.1,  spinMult: 0.52, boss: true, dmgMult: 0.15, toughness: 1.65,  special: 'emperor' },

  // ---- remixed bosses, levels 190-250 (src/levels-remix.js REMIX_BOSSES). Each is a stronger remix of an existing boss:
  // another boss's hat on a recoloured body, and a phase cycle of combined specials (bosses.js REMIX_BOSS_TUNE).
  // specialDmg multiplies special-attack damage. Toughness keeps climbing past Emperor Crust.
  forge_tyrant:    { name: 'Forge Tyrant',     hp: 1830, weapon: 'giant_hammer', color: '#a39286', hat: 'oven_lord',       ai: 'boss', scale: 1.9,  spinMult: 0.58, boss: true, dmgMult: 0.4,  toughness: 1.67, special: 'forge', eyes: [[0.32, 0.3], [0.74, 0.3]], specialDmg: 1.0 },
  permafrost:      { name: 'Permafrost',       hp: 2330, weapon: 'great_axe',    color: '#b7d3e6', hat: 'snowball_sam',    ai: 'boss', scale: 1.9,  spinMult: 0.6,  boss: true, dmgMult: 0.6,  toughness: 1.69, special: 'blizzard', specialDmg: 1.6 },
  kraken_admiral:  { name: 'Kraken Admiral',   hp: 1970, weapon: 'halberd',      color: '#e3a9c4', hat: 'captain_anchovy', ai: 'boss', scale: 1.95, spinMult: 0.58, boss: true, dmgMult: 0.72, toughness: 1.71, special: 'kraken', specialDmg: 2.3 },
  magma_maestro:   { name: 'Magma Maestro',    hp: 2120, weapon: 'morning_star', color: '#c98e7c', hat: 'hot_sauce',       ai: 'boss', scale: 2.0,  spinMult: 0.55, boss: true, dmgMult: 0.9,  toughness: 1.73, special: 'inferno', specialDmg: 1.9 },
  tempest_king:    { name: 'Tempest King',     hp: 2700, weapon: 'poleaxe',      color: '#c9d4e6', hat: 'windbag',         ai: 'boss', scale: 1.95, spinMult: 0.58, boss: true, dmgMult: 0.68, toughness: 1.75, special: 'tempest', specialDmg: 1.9 },
  overclock:       { name: 'Overclock',        hp: 3200, weapon: 'executioner',  color: '#9fb0c2', hat: 'glitch',          ai: 'boss', scale: 2.0,  spinMult: 0.57, boss: true, dmgMult: 0.62, toughness: 1.77, special: 'overclock', specialDmg: 1.5 },
  void_emperor:    { name: 'Void Emperor',     hp: 2350, weapon: 'dual_scythe',  color: '#d2c3ec', hat: 'zero_g',          ai: 'boss', scale: 2.15, spinMult: 0.52, boss: true, dmgMult: 0.66, toughness: 1.8,  special: 'void', specialDmg: 2.0 },
};

/** Resolve a level's enemy entry ({type, ...overrides}) into a full spec. */
export function enemySpec(entry) {
  const base = ENEMIES[entry.type] || ENEMIES.rookie;
  return { ...base, ...entry, helmet: entry.helmet !== undefined ? entry.helmet : base.helmet };
}
