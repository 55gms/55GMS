(() => {
  const PAGES = new Set(['/', '/g', '/a', '/-', '/s', '/d', '/chat', '/profile'])
  const DURATION = 1500
  let changing = false

  document.addEventListener('click', async (event) => {
    const link = event.target.closest('a[href]')
    if (!link || event.defaultPrevented || event.button !== 0 ||
        event.ctrlKey || event.metaKey || event.shiftKey || event.altKey ||
        link.hasAttribute('download') ||
        (link.target && link.target !== '_self')) return

    const url = new URL(link.href, location.href)
    const path = url.pathname.replace(/\/$/, '') || '/'

    if (url.origin !== location.origin || !PAGES.has(path) ||
        (url.pathname === location.pathname &&
         url.search === location.search)) return

    event.preventDefault()
    if (changing) return
    changing = true

    const next = document.createElement('iframe')
    next.setAttribute('aria-hidden', 'true')
    next.tabIndex = -1
    next.style.cssText =
      'position:fixed;inset:0;width:100vw;height:100vh;' +
      'border:0;background:#5e7594;z-index:2147483645;' +
      'pointer-events:none;clip-path:inset(0 0 100% 0)'

    const canvas = document.createElement('canvas')
    canvas.style.cssText =
      'position:fixed;inset:0;width:100vw;height:100vh;' +
      'z-index:2147483646;pointer-events:none'

    document.body.append(next, canvas)

    const ctx = canvas.getContext('2d')
    let w, h

    function resize() {
      const scale = Math.min(devicePixelRatio || 1, 2)
      w = innerWidth
      h = innerHeight
      canvas.width = Math.round(w * scale)
      canvas.height = Math.round(h * scale)
      ctx.setTransform(scale, 0, 0, scale, 0, 0)
    }

    resize()
    addEventListener('resize', resize)

    const loaded = new Promise((resolve) => {
      next.onload = () => {
        try {
          resolve(Boolean(next.contentDocument?.body))
        } catch {
          resolve(false)
        }
      }
      next.onerror = () => resolve(false)
      setTimeout(() => resolve(false), 6000)
    })

    next.src = url.href

    if (!await loaded) {
      location.assign(url.href)
      return
    }

    const dots = Array.from({ length: 23 }, (_, i) => ({
      x: (i * .6180339887) % 1,
      offset: ((i * 37) % 107) / 107,
      size: 2 + ((i * 17) % 11)
    }))

    function lightning(y, time) {
      ctx.clearRect(0, 0, w, h)

      const glow = ctx.createLinearGradient(0, y - 72, 0, y + 56)
      glow.addColorStop(0, 'rgba(40,155,255,0)')
      glow.addColorStop(.47, 'rgba(41,136,255,.12)')
      glow.addColorStop(.8, 'rgba(98,209,255,.2)')
      glow.addColorStop(1, 'rgba(99,190,255,0)')

      ctx.fillStyle = glow
      ctx.fillRect(0, y - 90, w, 165)

      const points = []

      for (let x = 0; x <= w + 14; x += 14) {
        points.push([
          x,
          y + Math.sin(x * .025 + time * 11) * 10 +
          Math.sin(x * .08 + time * 20) * 8 +
          Math.sin(x * .32 + time * 52) * 5
        ])
      }

      ctx.beginPath()

      points.forEach((p, i) =>
        i ? ctx.lineTo(...p) : ctx.moveTo(...p)
      )

      ctx.shadowColor = '#4dbbff'
      ctx.shadowBlur = 22
      ctx.strokeStyle = 'rgba(38,143,255,.65)'
      ctx.lineWidth = 14
      ctx.stroke()

      ctx.shadowBlur = 12
      ctx.strokeStyle = '#c4f5ff'
      ctx.lineWidth = 2.5
      ctx.stroke()
      ctx.shadowBlur = 0

      for (let i = 1; i < points.length - 1; i += 5 + (i % 5)) {
        const p = points[i]
        const dir = i % 2 ? 1 : -1

        ctx.beginPath()
        ctx.moveTo(...p)
        ctx.lineTo(p[0] + (i % 4 - 2) * 7, p[1] + dir * 26)
        ctx.lineTo(p[0] + (i % 6 - 3) * 11, p[1] + dir * 42)

        ctx.strokeStyle = 'rgba(143,218,255,.77)'
        ctx.lineWidth = 1.5
        ctx.stroke()
      }

      dots.forEach((p) => {
        ctx.beginPath()
        ctx.arc(
          (p.x * w + time * 150) % w,
          y - p.offset * 80,
          .7 + p.size * .1,
          0,
          Math.PI * 2
        )
        ctx.fillStyle = 'rgba(200,243,255,.75)'
        ctx.fill()
      })
    }

    const start = performance.now()

    function animate(now) {
      const raw = Math.min(1, (now - start) / DURATION)

      const progress = raw < .5
        ? 2 * raw * raw
        : 1 - Math.pow(-2 * raw + 2, 2) / 2

      next.style.clipPath =
        `inset(0 0 ${100 - progress * 100}% 0)`

      lightning(progress * h, now / 1000)

      if (raw < 1) {
        requestAnimationFrame(animate)
      } else {
        location.assign(url.href)
      }
    }

    requestAnimationFrame(animate)
  }, true)
})()
