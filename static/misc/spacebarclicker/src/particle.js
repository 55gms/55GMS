class ParticleSystem {
    constructor(lifetime, func) {
        this.lifetime = lifetime;
        this.func = func;
        this.particles = [];
        setInterval(this.update.bind(this), 16);
    }

    pushParticle(domElement, pos) {
        this.particles.push({
            life: this.lifetime,
            element: domElement,
            x: pos.x,
            y: pos.y,
            ix: pos.x,
            iy: pos.y,
            alpha: 0,
            rot: 0
        });
        domElement.style['opacity'] = "0";
    }

    update() {
        let remove = [];
        for (let i in this.particles) {
            let p = this.particles[i];
            p.life -= 0.016;
            p.normalized_time = 1.0 - p.life / this.lifetime;
            this.func(p);
            p.element.style['transform'] = "translateX(" + p.x + "px) translateY(" + p.y + "px) rotateZ(" + p.rot + "deg)";
            p.element.style['opacity'] = "" + (1.0 - p.alpha);
            
            if (p.life <= 0) remove.push(i);
        }
        
        for (let j in remove) {
            this.particles[remove[j]].element.remove();
            this.particles.splice(remove[j], 1);
        }
    }
}