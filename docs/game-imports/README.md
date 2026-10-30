# Curated game import — in progress

The catalog currently includes **5 of the 100 targeted games**. All five are non-Flash imports absent from the baseline catalog. Each passed an opening-gameplay/control smoke test, uses the existing 55GMS loader, and has its payload in a pinned `55gms/assets` commit. This does not establish compatibility of every level or optional online service.

| Added game             | Original source page                                               |
| ---------------------- | ------------------------------------------------------------------ |
| Two Ball 3D            | https://sites.google.com/view/drive-u-7-home/two-ball-3d           |
| Blocky Snakes          | https://sites.google.com/view/drive-u-7-home/blocky-snakes         |
| Search for the Needle! | https://sites.google.com/view/drive-u-7-home/search-for-the-needle |
| Obby Snowboard         | https://sites.google.com/view/drive-u-7-home/obby-snowboard        |
| Crazy Roll             | https://sites.google.com/view/drive-u-7-home/crazy-roll            |

The [manifest](2026-10-29.json) records sources, baseline duplicate checks, asset hashes and sizes, and observed gameplay/input evidence. [Grouped screenshots](first-batch.webp) show the checked states. Public most-played counts were unavailable; no measured popularity ranking is claimed.

The earlier WIP commit also contains **unlisted candidate pages**. They are not approvals or part of the five-game count. Failed and unverified candidates remain excluded from the catalog. Further work uses batch checks to accept working games first rather than repairing candidates individually. The final PR and 100-game list remain pending.
