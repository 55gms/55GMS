# 101-game import — draft, verification incomplete

This branch stages **101 distinct game additions: 11 non-Flash games and 90 Flash classics**. The eleven non-Flash entries have opening-gameplay smoke evidence. The classic SWFs have download/header/hash validation; existing browser records cover part of that set, but **full gameplay is not verified for all 101 games**. This draft must not be represented as 101 completely functional, playtested games.

All entries were filtered against baseline catalog names, existing asset blobs, duplicate payload hashes, and known aliases/site locks. Existing Granny, Red Vs. Bluez, Bank Robbery 2 and Deadly Descent aliases were excluded. The source offers no public play counts; ranking is editorial.

New pages use the 55GMS loading UI. Flash classics share a pinned local Ruffle runtime, with complete SWFs in the companion assets branch. Site save and ads tags are installed. The source/asset/evidence manifest is [2026-10-29.json](2026-10-29.json).

| Game                              | Original source URL                                                                 | Verification               |
| --------------------------------- | ----------------------------------------------------------------------------------- | -------------------------- |
| Two Ball 3D                       | https://sites.google.com/view/drive-u-7-home/two-ball-3d                            | gameplay-verified          |
| Blocky Snakes                     | https://sites.google.com/view/drive-u-7-home/blocky-snakes                          | gameplay-verified          |
| Search for the Needle!            | https://sites.google.com/view/drive-u-7-home/search-for-the-needle                  | gameplay-verified          |
| Obby Snowboard                    | https://sites.google.com/view/drive-u-7-home/new-games/obby-snowboard               | gameplay-verified          |
| Crazy Roll                        | https://sites.google.com/view/drive-u-7-home/new-games/crazy-roll                   | gameplay-verified          |
| Granny 2                          | https://sites.google.com/view/drive-u-7-home/granny-2                               | gameplay-verified          |
| VaVeX                             | https://sites.google.com/view/drive-u-7-home/new-games/vavex                        | gameplay-verified          |
| Fly the Plane                     | https://sites.google.com/view/drive-u-7-home/new-games/fly-the-plane                | gameplay-verified          |
| Slap Aura                         | https://sites.google.com/view/drive-u-7-home/new-games/slap-aura                    | gameplay-verified          |
| Ragdoll Freefall                  | https://sites.google.com/view/drive-u-7-home/ragdoll-freefall                       | gameplay-verified          |
| Jacksmith                         | https://sites.google.com/view/drive-u-7-home/jacksmith                              | runtime-input-smoke-passed |
| Swords and souls                  | https://sites.google.com/view/drive-u-7-home/flash-games/swords-and-souls           | runtime-input-smoke-passed |
| Cactus McCoy                      | https://sites.google.com/view/drive-u-7-home/flash-games/cactus-mccoy               | runtime-input-smoke-passed |
| Cactus McCoy 2                    | https://sites.google.com/view/drive-u-7-home/flash-games/cactusmccoy2               | runtime-input-smoke-passed |
| Super Mario 63                    | https://sites.google.com/view/drive-u-7-home/super-mario-63                         | runtime-input-smoke-passed |
| Achievement Unlocked              | https://sites.google.com/view/drive-u-7-home/achievement-unlocked                   | failed                     |
| Don't Escape                      | https://sites.google.com/view/drive-u-7-home/flash-games/dont-escape                | runtime-input-smoke-passed |
| Don't Escape 2                    | https://sites.google.com/view/drive-u-7-home/flash-games/dont-escape-2              | runtime-input-smoke-passed |
| Don't Escape 3                    | https://sites.google.com/view/drive-u-7-home/flash-games/dont-escape-3              | runtime-input-smoke-passed |
| Warfare 1917                      | https://sites.google.com/view/drive-u-7-home/flash-games/warfare-1917               | runtime-input-smoke-passed |
| The Enchanted Cave 2              | https://sites.google.com/view/drive-u-7-home/the-enchanted-cave                     | runtime-input-smoke-passed |
| Gun Mayhem                        | https://sites.google.com/view/drive-u-7-home/flash-games/gun-mayhem                 | runtime-input-smoke-passed |
| Swords and Sandals 2              | https://sites.google.com/view/drive-u-7-home/flash-games/swords-and-sandals-2       | runtime-input-smoke-passed |
| The Last Stand                    | https://sites.google.com/view/drive-u-7-home/flash-games/the-last-stand             | runtime-input-smoke-passed |
| Strike Force Heroes 2             | https://sites.google.com/view/drive-u-7-home/flash-games/strike-force-heroes-2      | runtime-input-smoke-passed |
| Bloons Super Monkey               | https://sites.google.com/view/drive-u-7-home/flash-games/bloons-supermonkey         | runtime-input-smoke-passed |
| City Siege                        | https://sites.google.com/view/drive-u-7-home/flash-games/city-siege                 | runtime-input-smoke-passed |
| City Siege 2                      | https://sites.google.com/view/drive-u-7-home/flash-games/city-siege-2               | runtime-input-smoke-passed |
| City Siege 3                      | https://sites.google.com/view/drive-u-7-home/flash-games/city-siege-3               | runtime-input-smoke-passed |
| City Siege 4                      | https://sites.google.com/view/drive-u-7-home/flash-games/city-siege-4               | runtime-input-smoke-passed |
| Shopping Cart Hero                | https://sites.google.com/view/drive-u-7-home/flash-games/shopping-cart-hero         | runtime-input-smoke-passed |
| Grow Island                       | https://sites.google.com/view/drive-u-7-home/flash-games/grow-island                | runtime-input-smoke-passed |
| Grow Valley                       | https://sites.google.com/view/drive-u-7-home/flash-games/grow-valley                | runtime-input-smoke-passed |
| Armor Mayhem                      | https://sites.google.com/view/drive-u-7-home/armor-mayhem                           | runtime-input-smoke-passed |
| Electric Box 2                    | https://sites.google.com/view/drive-u-7-home/electric-box-2                         | runtime-input-smoke-passed |
| Civiballs                         | https://sites.google.com/view/drive-u-7-home/civiballs                              | runtime-input-smoke-passed |
| Papa’s Bakeria                    | https://sites.google.com/view/drive-u-7-home/papas-bakeria                          | runtime-input-smoke-passed |
| Papa Louie 2: When Burgers Attack | https://sites.google.com/view/drive-u-7-home/papa-louie-2-when-burgers-attack       | runtime-input-smoke-passed |
| Diggy                             | https://sites.google.com/view/drive-u-7-home/diggy                                  | runtime-input-smoke-passed |
| Murloc                            | https://sites.google.com/view/drive-u-7-home/murloc                                 | runtime-input-smoke-passed |
| Madness Accelerant                | https://sites.google.com/view/drive-u-7-home/flash-games/madness-accelerant         | runtime-input-smoke-passed |
| Boxhead 2Play Rooms               | https://sites.google.com/view/drive-u-7-home/flash-games/boxhead-2play-rooms        | runtime-input-smoke-passed |
| Endless War 3                     | https://sites.google.com/view/drive-u-7-home/flash-games/endless-war-3              | runtime-input-smoke-passed |
| Armed with Wings 2                | https://sites.google.com/view/drive-u-7-home/flash-games/armed-with-wings           | runtime-input-smoke-passed |
| Stick War 2                       | https://sites.google.com/view/drive-u-7-home/flash-games/stick-war-2                | runtime-input-smoke-passed |
| Dragon Fist 3                     | https://sites.google.com/view/drive-u-7-home/flash-games/dragon-fist-3              | runtime-input-smoke-passed |
| Miami Shark                       | https://sites.google.com/view/drive-u-7-home/flash-games/miami-shark                | runtime-input-smoke-passed |
| Rage 3                            | https://sites.google.com/view/drive-u-7-home/flash-games/rage-3                     | runtime-input-smoke-passed |
| Flood Runner 2                    | https://sites.google.com/view/drive-u-7-home/flood-runner-2                         | runtime-input-smoke-passed |
| Dad 'n Me                         | https://sites.google.com/view/drive-u-7-home/flash-games/dads-me                    | runtime-input-smoke-passed |
| Plazma Burst                      | https://sites.google.com/view/drive-u-7-home/flash-games/plazma-burst               | runtime-input-smoke-passed |
| Strike Force Kitty                | https://sites.google.com/view/drive-u-7-home/flash-games/strike-force-kitty         | runtime-input-smoke-passed |
| Strike Force Kitty 2              | https://sites.google.com/view/drive-u-7-home/flash-games/strike-force-kitty-2       | runtime-input-smoke-passed |
| StrikeForce Kitty: Last Stand     | https://sites.google.com/view/drive-u-7-home/flash-games/strike-force-kitty-3       | runtime-input-smoke-passed |
| Bowman 2                          | https://sites.google.com/view/drive-u-7-home/flash-games/browman                    | runtime-input-smoke-passed |
| Ricochet Kills                    | https://sites.google.com/view/drive-u-7-home/flash-games/ricochet-kills             | runtime-input-smoke-passed |
| Interactive Buddy                 | https://sites.google.com/view/drive-u-7-home/flash-games/interactive-buddy          | runtime-input-smoke-passed |
| Dead Zed                          | https://sites.google.com/view/drive-u-7-home/dead-zed                               | runtime-input-smoke-passed |
| 3 Slices                          | https://sites.google.com/view/drive-u-7-home/3-slices                               | runtime-input-smoke-passed |
| Effing Worms                      | https://sites.google.com/view/drive-u-7-home/flash-games/effing-worms               | runtime-input-smoke-passed |
| Effing Hail                       | https://sites.google.com/view/drive-u-7-home/effing-hail                            | runtime-input-smoke-passed |
| Dragon ball Devolution            | https://sites.google.com/view/drive-u-7-home/flash-games/dragon-ball-devolution     | runtime-input-smoke-passed |
| Bomb it 4                         | https://sites.google.com/view/drive-u-7-home/flash-games/bomb-it-4                  | runtime-input-smoke-passed |
| Bounzy 2                          | https://sites.google.com/view/drive-u-7-home/flash-games/bounzy-2                   | runtime-input-smoke-passed |
| Commando                          | https://sites.google.com/view/drive-u-7-home/flash-games/commando                   | runtime-input-smoke-passed |
| Intrusion                         | https://sites.google.com/view/drive-u-7-home/flash-games/intrusion                  | runtime-input-smoke-passed |
| GunMaster Onslaught               | https://sites.google.com/view/drive-u-7-home/flash-games/gunmaster-onslaught        | runtime-input-smoke-passed |
| Giants And Dwarves TD             | https://sites.google.com/view/drive-u-7-home/flash-games/giants-and-dwarves-td      | runtime-input-smoke-passed |
| Gretel and Hansel                 | https://sites.google.com/view/drive-u-7-home/flash-games/gretel-and-hansel-1        | runtime-input-smoke-passed |
| Obey The Game                     | https://sites.google.com/view/drive-u-7-home/flash-games/obey-the-game              | runtime-input-smoke-passed |
| The Black Knight                  | https://sites.google.com/view/drive-u-7-home/flash-games/black-knight               | runtime-input-smoke-passed |
| Crazy Penguin Catapult            | https://sites.google.com/view/drive-u-7-home/flash-games/crazy-penguin-catapult     | runtime-input-smoke-passed |
| Achilles                          | https://sites.google.com/view/drive-u-7-home/flash-games/achilles                   | runtime-input-smoke-passed |
| Thing Thing 4                     | https://sites.google.com/view/drive-u-7-home/flash-games/thing-thing-4              | runtime-input-smoke-passed |
| Sift Heads World: Act 1           | https://sites.google.com/view/drive-u-7-home/flash-games/sift-heads-world-ultimatum | runtime-input-smoke-passed |
| Animal Raceway                    | https://sites.google.com/view/drive-u-7-home/animal-raceway                         | runtime-input-smoke-passed |
| Drag Racer V3                     | https://sites.google.com/view/drive-u-7-home/drag-racer-v3                          | runtime-input-smoke-passed |
| Ragdoll Achievement               | https://sites.google.com/view/drive-u-7-home/ragdoll-achievement                    | runtime-input-smoke-passed |
| Gold Miner 2                      | https://sites.google.com/view/drive-u-7-home/flash-games/gold-miner-2               | runtime-input-smoke-passed |
| Crazy Flasher 3                   | https://sites.google.com/view/drive-u-7-home/flash-games/crazy-flasher-3            | runtime-input-smoke-passed |
| Gravity Driver                    | https://sites.google.com/view/drive-u-7-home/flash-games/gravity-driver             | runtime-input-smoke-passed |
| Weapon                            | https://sites.google.com/view/drive-u-7-home/flash-games/weapon                     | runtime-input-smoke-passed |
| Smileys War                       | https://sites.google.com/view/drive-u-7-home/flash-games/smileys-war                | runtime-input-smoke-passed |
| Batman The Cobblebot Caper        | https://sites.google.com/view/drive-u-7-home/flash-games/batman-the-cobblebot-caper | runtime-input-smoke-passed |
| Acid Bunny 2                      | https://sites.google.com/view/drive-u-7-home/flash-games/acid-bunny                 | runtime-input-smoke-passed |
| Dead Samurai                      | https://sites.google.com/view/drive-u-7-home/flash-games/dead-samurai               | runtime-input-smoke-passed |
| Dog vs Cat                        | https://sites.google.com/view/drive-u-7-home/flash-games/dog-vs-cat                 | runtime-input-smoke-passed |
| Alone in The Madness              | https://sites.google.com/view/drive-u-7-home/flash-games/alone-in-the-madness       | runtime-input-smoke-passed |
| Dragon Ball Kart                  | https://sites.google.com/view/drive-u-7-home/dragon-ball-kart                       | runtime-input-smoke-passed |
| Endless War 7                     | https://sites.google.com/view/drive-u-7-home/endless-war-7                          | runtime-input-smoke-passed |
| Storm Ops 4                       | https://sites.google.com/view/drive-u-7-home/storm-ops-4                            | runtime-input-smoke-passed |
| Effing Worms 2                    | https://sites.google.com/view/drive-u-7-home/effing-worms-2                         | runtime-input-smoke-passed |
| Super Mario World Flash           | https://sites.google.com/view/drive-u-7-home/supermario-world-flash                 | runtime-input-smoke-passed |
| 1 On 1 Basketball                 | https://sites.google.com/view/drive-u-7-home/1-on-1-basketball                      | runtime-input-smoke-passed |
| Santa Run 2                       | https://sites.google.com/view/drive-u-7-home/flash-games/santa-run-2                | runtime-input-smoke-passed |
| Axis Football League              | https://sites.google.com/view/drive-u-7-home/flash-games/axis-football-league       | runtime-input-smoke-passed |
| Siegius                           | https://sites.google.com/view/drive-u-7-home/flash-games/siegius                    | runtime-input-smoke-passed |
| Aqua Turret                       | https://sites.google.com/view/drive-u-7-home/flash-games/aqua-turret                | runtime-input-smoke-passed |
| Ownage Burst                      | https://sites.google.com/view/drive-u-7-home/flash-games/ownage-burst               | runtime-input-smoke-passed |
| Overkill Apache                   | https://sites.google.com/view/drive-u-7-home/flash-games/overkill-apache            | runtime-input-smoke-passed |
| Real Kart                         | https://sites.google.com/view/drive-u-7-home/real-kart                              | gameplay-verified          |

Remaining gate: complete gameplay and CDN verification for every staged classic, filter any failure, and replace it before marking this ready for merge.

Real Kart now includes the missing Unity Addressables settings, catalog, and track bundle. Its unescaped StreamingAssets path prevents Unity from double-escaping `@` in bundle requests. The source Drive-U-7 loading hooks are hidden behind the shared 55GMS loader. [Kart gameplay evidence](real-kart-gameplay.webp).
