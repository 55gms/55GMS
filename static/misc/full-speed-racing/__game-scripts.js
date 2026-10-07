var AlphaConVelocidad = pc.createScript("alphaConVelocidad");
AlphaConVelocidad.attributes.add("tiempoEspera", {
    type: "number",
    default: 0,
    title: "tiempoEspera"
}), AlphaConVelocidad.attributes.add("duracionIn", {
    type: "number",
    default: 0,
    title: "duracionIn"
}), AlphaConVelocidad.attributes.add("duracionOut", {
    type: "number",
    default: 0,
    title: "duracionOut"
}), AlphaConVelocidad.attributes.add("hijos", {
    type: "entity",
    array: !0
}), AlphaConVelocidad.prototype.initialize = function() {}, AlphaConVelocidad.prototype.update = function(t) {}, AlphaConVelocidad.prototype.fadeIn = function(t) {
    for (var e = {
            x: 0
        }, i = 0; i < this.hijos.length; i++) null != this.hijos[i].element ? this.hijos[i].element.opacity = 0 : (this.hijos[i].model.material.opacity = 0, this.hijos[i].model.material.update());
    null != this.entity.element ? this.entity.element.opacity = 0 : (this.entity.model.material.opacity = 0, this.entity.model.material.update()), this.hiloDisco = this.app.tween(e).to({
        x: 1
    }, this.duracionIn, pc.SineOut).onComplete((() => {
        null != t && t()
    })).onUpdate((() => {
        null != this.entity.element ? this.entity.element.opacity = e.x : (this.entity.model.material.opacity = e.x, this.entity.model.material.update());
        for (var t = 0; t < this.hijos.length; t++) null != this.hijos[t].element ? this.hijos[t].element.opacity = e.x : (this.hijos[t].model.material.opacity = e.x, this.hijos[t].model.material.update())
    })).delay(this.tiempoEspera).start()
}, AlphaConVelocidad.prototype.fadeOut = function(t) {
    for (var e = {
            x: 1
        }, i = 0; i < this.hijos.length; i++) null != this.hijos[i].element ? this.hijos[i].element.opacity = 1 : (this.hijos[i].model.material.opacity = 1, this.hijos[i].model.material.update());
    null != this.entity.element ? this.entity.element.opacity = 1 : (this.entity.model.material.opacity = 1, this.entity.model.material.update()), this.hiloDisco = this.app.tween(e).to({
        x: 0
    }, this.duracionIn, pc.SineOut).onComplete((() => {
        null != t && t()
    })).onUpade((() => {
        null != this.entity.element ? this.entity.element.opacity = e.x : (this.entity.model.material.opacity = e.x, this.entity.model.material.update());
        for (var t = 0; t < this.hijos.length; t++) null != this.hijos[t].element ? this.hijos[t].element.opacity = e.x : (this.hijos[t].model.material.opacity = e.x, this.hijos[t].model.material.update())
    })).start()
};
var AnimaAlfa3d = pc.createScript("animaAlfa3d");
AnimaAlfa3d.attributes.add("material", {
    type: "asset",
    assetType: "material",
    array: !1
}), AnimaAlfa3d.attributes.add("speed", {
    type: "number",
    default: .01,
    title: "speed"
}), AnimaAlfa3d.attributes.add("desde", {
    type: "number",
    default: 0,
    title: "desde"
}), AnimaAlfa3d.attributes.add("hasta", {
    type: "number",
    default: 1,
    title: "hasta"
}), AnimaAlfa3d.attributes.add("delay", {
    type: "number",
    default: 0,
    title: "delay"
}), AnimaAlfa3d.attributes.add("loop", {
    type: "number",
    default: 1,
    title: "LOOP"
}), AnimaAlfa3d.attributes.add("apagaAlTerminar", {
    type: "number",
    default: 1,
    title: "apagaAlTerminar"
}), AnimaAlfa3d.attributes.add("tipoMaterial", {
    type: "string",
    default: "opacity",
    title: "opacity"
}), AnimaAlfa3d.attributes.add("finAnim", {
    type: "number",
    default: 1,
    title: "finAnim"
}), AnimaAlfa3d.prototype.initialize = function() {
    this.sentido = 0, this.contadorDelay = 0, this.materialCargado = this.material.resource, this.desde < this.hasta ? this.sentido = 1 : this.sentido = -1, this.resetMaterial()
}, AnimaAlfa3d.prototype.empiezaAnim = function(t, a, i, e) {
    this.entity.enabled = !0, this.desde = t, this.hasta = a, null != i && (this.delay = i), null != e && (this.speed = e), this.desde < this.hasta ? this.sentido = 1 : this.sentido = -1, this.contadorDelay = 0, this.resetMaterial(), this.finAnim = 0
}, AnimaAlfa3d.prototype.resetMaterial = function(t) {
    this.materialCargado[this.tipoMaterial] = this.desde, this.materialCargado.update()
}, AnimaAlfa3d.prototype.update = function(t) {
    if (1 != this.finAnim)
        if (this.contadorDelay < this.delay) this.contadorDelay = this.contadorDelay + t;
        else {
            var a, i = this.materialCargado.opacity,
                e = !1;
            (a = -1 == this.sentido ? i - t * this.speed : i + t * this.speed) <= 0 ? (e = !0, a = 0) : a >= 1 && (e = !0, a = 1), this.materialCargado[this.tipoMaterial] = a, this.materialCargado.update(), e && 1 == this.loop && this.empiezaAnim(this.desde, this.hasta)
        }
}, AnimaAlfa3d.prototype.apagaObjeto = function() {
    1 == this.finAnim && (this.entity.enabled = !1)
}, AnimaAlfa3d.prototype.terminaAnim = function() {
    this.finAnim = 1
};
var AnimaTextoMsg = pc.createScript("animaTextoMsg");
AnimaTextoMsg.attributes.add("destinox", {
    type: "number",
    default: 0,
    title: "destinox"
}), AnimaTextoMsg.attributes.add("destinoy", {
    type: "number",
    default: 0,
    title: "destinoy"
}), AnimaTextoMsg.attributes.add("destinoz", {
    type: "number",
    default: 0,
    title: "destinoz"
}), AnimaTextoMsg.attributes.add("tiempo", {
    type: "number",
    default: .6,
    title: "tiempo"
}), AnimaTextoMsg.attributes.add("esElement", {
    type: "number",
    default: 0,
    title: "esElement"
}), AnimaTextoMsg.attributes.add("delaySaca", {
    type: "number",
    default: 1.8,
    title: "delaySaca"
}), AnimaTextoMsg.attributes.add("boton", {
    type: "string",
    array: !0,
    title: "boton"
}), AnimaTextoMsg.attributes.add("tipoTween", {
    type: "string",
    default: "BounceOut",
    title: "tipoTween"
}), AnimaTextoMsg.prototype.elijeTween = function(t) {
    switch (t) {
        case "BounceOut":
            t = pc.BounceOut;
            break;
        case "SineIn":
            t = pc.SineIn;
            break;
        case "SineOut":
            t = pc.SineOut;
            break;
        case "SineInOut":
            t = pc.SineInOut
    }
    return t
}, AnimaTextoMsg.prototype.initialize = function() {
    this.mc = this.entity, this.tween = null;
    var t = this.entity.getLocalPosition();
    this.origen = new pc.Vec3(t.x, t.y, t.z), this.tipoTween = this.elijeTween(this.tipoTween), this.entity.enabled = !1
}, AnimaTextoMsg.prototype.clickBoton = function(t, e, i) {
    null != e ? null != this.boton && null != this.boton[i] && (this.entity.element.text = this.boton[i]) : this.boton.length > 0 && null != this.boton[1] && (this.entity.element.text = this.boton[1], setTimeout(this.restauraBoton.bind(this, t), 180))
}, AnimaTextoMsg.prototype.restauraBoton = function(t) {
    null != this.boton[0] && (this.entity.element.text = this.boton[0], t())
}, AnimaTextoMsg.prototype.pone = function(t, e) {
    var i = this.tiempo;
    null != e && (i = e), this.entity.setLocalPosition(this.origen.x, this.origen.y, this.origen.z);
    var n = this.entity.getLocalPosition(),
        s = new pc.Vec3(this.destinox, this.destinoy, this.destinoz),
        o = new pc.Vec3(n.x + s.x, n.y + s.y, n.z + s.z);
    this.entity.setLocalPosition(o.x, o.y, o.z), this.entity.enabled = !0, n = this.entity.getLocalPosition(), this.tween = this.mc.tween(n).to(this.origen, i, this.tipoTween), this.tween.onComplete((() => {
        this.terminaPone(t)
    })), this.tween.start()
}, AnimaTextoMsg.prototype.poneYalfa = function(t, e) {
    this.entity.children[0].element.opacity = 1, this.entity.children[1].element.opacity = 1, this.entity.children[2].element.opacity = 1, this.entity.children[3].element.opacity = 1, this.entity.children[0].element.outlineThickness = 1, this.entity.children[1].element.outlineThickness = 1, this.entity.children[2].element.outlineThickness = 1, this.entity.children[3].element.outlineThickness = 1;
    var i = this.tiempo;
    null != e && (i = e);
    var n = this.entity.getLocalPosition(),
        s = new pc.Vec3(this.destinox, this.destinoy, this.destinoz),
        o = new pc.Vec3(n.x + s.x, n.y + s.y, n.z + s.z);
    this.entity.enabled = !0, this.tween = this.mc.tween(n).to(o, i, this.tipoTween), this.tween.onComplete((() => {
        this.terminaPone(t)
    })), this.tween.start();
    var a = {
        x: 1
    };
    this.app.tween(a).to({
        x: 0
    }, .34, pc.SineOut).onUpdate((() => {
        this.entity.children[0].element.opacity = a.x, this.entity.children[1].element.opacity = a.x, this.entity.children[2].element.opacity = a.x, this.entity.children[3].element.opacity = a.x, this.entity.children[0].element.outlineThickness = a.x, this.entity.children[1].element.outlineThickness = a.x, this.entity.children[2].element.outlineThickness = a.x, this.entity.children[3].element.outlineThickness = a.x
    })).delay(.55).start()
}, AnimaTextoMsg.prototype.poneScale = function(t, e, i) {
    var n = this.tiempo;
    null != e && (n = e);
    var s = this.tipoTween;
    null != i && (s = i), s = this.elijeTween(s), this.entity.setLocalScale(0, 0, 0);
    var o = new pc.Vec3(1, 1, 1),
        a = this.entity.getLocalScale();
    this.entity.enabled = !0, this.tween = this.mc.tween(a).to(o, n, s), this.tween.onComplete((() => {
        this.terminaPone(t)
    })), this.tween.start()
}, AnimaTextoMsg.prototype.sacaScale = function(t, e, i, n) {
    var s = this.tiempo;
    null != i && (s = i);
    var o = this.tipoTween;
    null != n && (o = n), o = this.elijeTween(o), this.entity.setLocalScale(1, 1, 1);
    var a = new pc.Vec3(0, 0, 0),
        h = this.entity.getLocalScale();
    this.entity.enabled = !0, this.tween = this.mc.tween(h).to(a, s, o), this.tween.onComplete((() => {
        this.terminaSaca(t, e)
    })), this.tween.start()
}, AnimaTextoMsg.prototype.saca = function(t, e, i) {
    var n = this.tiempo;
    null != i && (n = i), this.entity.setLocalPosition(this.origen.x, this.origen.y, this.origen.z);
    var s = this.entity.getLocalPosition(),
        o = new pc.Vec3(this.destinox, this.destinoy, this.destinoz);
    o = new pc.Vec3(s.x + o.x, s.y + o.y, s.z + o.z), this.entity.enabled = !0, this.tween = this.mc.tween(s).to(o, n, this.tipoTween), this.tween.onComplete((() => {
        this.terminaSaca(t, e)
    })), this.tween.start()
}, AnimaTextoMsg.prototype.sacaInverso = function(t, e, i) {
    var n = this.tiempo;
    null != i && (n = i), this.entity.setLocalPosition(this.origen.x, this.origen.y, this.origen.z);
    var s = this.entity.getLocalPosition(),
        o = new pc.Vec3(this.destinox, this.destinoy, this.destinoz);
    o = new pc.Vec3(s.x - o.x, s.y - o.y, s.z - o.z), this.entity.enabled = !0, this.tween = this.mc.tween(s).to(o, n, this.tipoTween), this.tween.onComplete((() => {
        this.terminaSaca(t, e)
    })), this.tween.start()
}, AnimaTextoMsg.prototype.terminaPone = function(t) {
    null != t && t()
}, AnimaTextoMsg.prototype.terminaSaca = function(t, e) {
    t && (this.entity.enabled = !1), null != e && e()
}, AnimaTextoMsg.prototype.poneSaca = function(t) {};
var AnimaTexturas = pc.createScript("animaTexturas");
AnimaTexturas.attributes.add("texturas", {
    type: "asset",
    assetType: "texture",
    array: !0,
    title: "texturas"
}), AnimaTexturas.attributes.add("material", {
    type: "asset",
    assetType: "material",
    array: !1
}), AnimaTexturas.attributes.add("loop", {
    type: "number",
    default: 0,
    title: "loop"
}), AnimaTexturas.attributes.add("autoAnim", {
    type: "number",
    default: 0,
    title: "autoAnim"
}), AnimaTexturas.attributes.add("texture3D", {
    type: "number",
    default: 0,
    title: "texture3D"
}), AnimaTexturas.attributes.add("frames", {
    type: "number",
    default: 60,
    title: "frames"
}), AnimaTexturas.prototype.initialize = function() {
    this.entity;
    var a = [this.entity, this.texturas, 0, this.texturas.length, !1, 0, 0, 0, !1];
    this.cont = 0, this.arrayAnimaciones = [], this.arrayAnimaciones[0] = a, this.callBack = null, 1 == this.autoAnim && (1 == this.loop && (this.arrayAnimaciones[0][8] = !0), this.arrayAnimaciones[0][4] = !0)
}, AnimaTexturas.prototype.inicioAnim = function(a, i, t) {
    this.callBack = a, this.cont = 0;
    var e = [this.entity, this.texturas, 0, this.texturas.length, !1, 0, 0, 0, !1];
    if (this.cont = 0, null != i && null != t) this.arrayAnimaciones[0][2] = i, this.arrayAnimaciones[0][3] = t;
    else {
        e = [this.entity, this.texturas, 0, this.texturas.length, !1, 0, 0, 0, !1];
        this.arrayAnimaciones = [], this.arrayAnimaciones[0] = e
    }
    this.cont = 0, 0 == this.texture3D ? this.entity.element.texture = this.texturas[this.arrayAnimaciones[0][2]].resource : this.cambiaTextura3D(this.texturas[this.arrayAnimaciones[0][2]].resource), this.arrayAnimaciones[0][4] = !0
}, AnimaTexturas.prototype.stopAnim = function() {
    this.arrayAnimaciones[0][4] = !1
}, AnimaTexturas.prototype.update = function(a) {
    var i = a,
        t = 1 / i;
    this.cont = this.cont + i;
    var e = t / this.frames;
    if (e /= t, this.cont >= e) {
        this.cont = 0;
        for (var r = 0; r < this.arrayAnimaciones.length; r++)
            if (1 == this.arrayAnimaciones[r][4]) {
                var s;
                if (0 == this.arrayAnimaciones[r][7]) 0 == (s = this.arrayAnimaciones[r][5]) && (s = this.arrayAnimaciones[r][2]), 0 == this.texture3D ? this.arrayAnimaciones[r][0].element.texture = this.arrayAnimaciones[r][1][s].resource : this.cambiaTextura3D(this.arrayAnimaciones[r][1][s].resource), this.arrayAnimaciones[r][5] = this.arrayAnimaciones[r][5] + 1, (s = this.arrayAnimaciones[r][5]) == this.arrayAnimaciones[r][3] && (0 == this.arrayAnimaciones[r][6] ? this.arrayAnimaciones[r][8] ? this.arrayAnimaciones[r][5] = 1 : (this.arrayAnimaciones[r][4] = !1, this.arrayAnimaciones[r][5] = 0, null != this.callBack && this.callBack()) : 2 == this.arrayAnimaciones[r][6] && (this.arrayAnimaciones[r][7] = 1));
                if (1 == this.arrayAnimaciones[r][7])(s = this.arrayAnimaciones[r][5]) == this.arrayAnimaciones[r][3] && (s = this.arrayAnimaciones[r][3] - 2, this.arrayAnimaciones[r][5] = s), 0 == this.texture3D ? this.arrayAnimaciones[r][0].element.texture = this.arrayAnimaciones[r][1][s].resource : this.cambiaTextura3D(this.arrayAnimaciones[r][1][s].resource), this.arrayAnimaciones[r][5] = this.arrayAnimaciones[r][5] - 1, (s = this.arrayAnimaciones[r][5]) == this.arrayAnimaciones[r][2] - 1 && (this.arrayAnimaciones[r][4] = !1, this.arrayAnimaciones[r][5] = 0, 2 == this.arrayAnimaciones[r][6] && (this.arrayAnimaciones[r][7] = 0))
            }
    }
}, AnimaTexturas.prototype.cambiaTextura3D = function(a) {
    if (null != this.material) return this.material.resource.diffuseMap = a, this.material.resource.emissiveMap = a, this.material.resource.opacityMap = a, void this.material.resource.update();
    for (var i = this.entity.model.meshInstances, t = 0; t < i.length; ++t) {
        var e = i[t];
        e.material.diffuseMap = a, e.material.opacityMap = a, e.material.update()
    }
};
var AnimaUvsPlus = pc.createScript("animaUvsPlus");
AnimaUvsPlus.attributes.add("material", {
    type: "asset",
    assetType: "material",
    array: !1
}), AnimaUvsPlus.attributes.add("speed", {
    type: "number",
    default: .01,
    title: "speed"
}), AnimaUvsPlus.attributes.add("eje", {
    type: "number",
    default: 0,
    title: "ejeX_o_Y"
}), AnimaUvsPlus.attributes.add("loop", {
    type: "number",
    default: 1,
    title: "LOOP"
}), AnimaUvsPlus.attributes.add("desde", {
    type: "number",
    default: 0,
    title: "desde"
}), AnimaUvsPlus.attributes.add("hasta", {
    type: "number",
    default: 1,
    title: "hasta"
}), AnimaUvsPlus.attributes.add("tipoMaterial", {
    type: "string",
    array: !0,
    title: "opacityMapOffset"
}), AnimaUvsPlus.prototype.initialize = function() {
    this.materialCargado = this.material.resource
}, AnimaUvsPlus.prototype.resetMaterial = function(t) {
    for (var a = 0; a < this.tipoMaterial.length; a++) this.materialCargado[this.tipoMaterial[a]] = new pc.Vec2(0, 0);
    this.materialCargado.update(), this.entity.enabled = !0, this.eje = t
}, AnimaUvsPlus.prototype.play = function(t, a, e) {
    this.desde = t, this.hasta = a, this.resetMaterial(e)
}, AnimaUvsPlus.prototype.update = function(t) {
    for (var a = 0; a < this.tipoMaterial.length; a++) {
        var e;
        switch (this.tipoMaterial[a]) {
            case "opacityMapOffset":
                e = this.materialCargado.opacityMapOffset;
                break;
            case "diffuseMapOffset":
                e = this.materialCargado.diffuseMapOffset;
                break;
            case "emissiveMapOffset":
                e = this.materialCargado.emissiveMapOffset
        }
        if (0 == this.eje) {
            var i = e.y,
                s = e.x;
            (r = i - t * this.speed) < 0 && (0 == this.loop ? (r = 0, this.eje = -99) : r = 1), this.materialCargado[this.tipoMaterial[a]] = new pc.Vec2(s, r), this.materialCargado.update()
        } else if (1 == this.eje) {
            var r;
            i = e.x, s = e.y;
            (r = i + t * this.speed) > this.hasta && (0 == this.loop ? (r = this.hasta, this.eje = -99, setTimeout(this.apagaObjeto.bind(this), 20)) : r = this.desde), this.materialCargado[this.tipoMaterial[a]] = new pc.Vec2(r, s), this.materialCargado.update()
        }
    }
}, AnimaUvsPlus.prototype.apagaObjeto = function() {
    this.entity.enabled = !1
};
var ArrowMovement = pc.createScript("arrowMovement");
ArrowMovement.attributes.add("speed", {
    type: "number",
    default: 5
}), ArrowMovement.attributes.add("distanceX", {
    type: "number",
    default: 22
}), ArrowMovement.attributes.add("sentido", {
    type: "number",
    default: -1
}), ArrowMovement.prototype.initialize = function() {
    this.deltaX = 0, this.initialPos = this.entity.getLocalPosition().clone()
}, ArrowMovement.prototype.update = function(t) {
    this.deltaX = this.speed * t;
    var e = this.entity.getLocalPosition();
    this.entity.setLocalPosition(e.x + this.sentido * this.deltaX, e.y, e.z), (e = this.entity.getLocalPosition()).x <= this.initialPos.x - this.distanceX ? (this.sentido = 1, this.deltaX = 0) : e.x >= this.initialPos.x + this.distanceX && (this.sentido = -1, this.deltaX = 0)
};
var AsignaGlobal = pc.createScript("asignaGlobal");
AsignaGlobal.attributes.add("tipo", {
    type: "string",
    title: "tipo"
}), AsignaGlobal.prototype.initialize = function() {
    if ("sonido" === this.tipo) _sonidos = this.entity.sound, _sound = _sonidos
};
var AnimaMsg = pc.createScript("animaMsg");
AnimaMsg.attributes.add("destinox", {
    type: "number",
    default: 0,
    title: "destinox"
}), AnimaMsg.attributes.add("destinoy", {
    type: "number",
    default: 0,
    title: "destinoy"
}), AnimaMsg.attributes.add("destinoz", {
    type: "number",
    default: 0,
    title: "destinoz"
}), AnimaMsg.attributes.add("tiempo", {
    type: "number",
    default: .6,
    title: "tiempo"
}), AnimaMsg.attributes.add("delaySaca", {
    type: "number",
    default: 1.8,
    title: "delaySaca"
}), AnimaMsg.attributes.add("traducir", {
    type: "number",
    default: 1,
    title: "traducir"
}), AnimaMsg.attributes.add("esconder", {
    type: "number",
    default: 0,
    title: "esconder"
}), AnimaMsg.attributes.add("boton", {
    type: "asset",
    assetType: "texture",
    array: !0,
    title: "boton"
}), AnimaMsg.attributes.add("tipoTween", {
    type: "string",
    default: "BounceOut",
    title: "tipoTween"
}), AnimaMsg.prototype.initialize = function() {
    this.tween = null, this.mc = this.entity;
    var t = this.entity.getLocalPosition();
    switch (this.origen = new pc.Vec3(t.x, t.y, t.z), this.destino = new pc.Vec3(this.destinox, this.destinoy, this.destinoz), this.tipoTween) {
        case "BounceOut":
            this.tipoTween = pc.BounceOut;
            break;
        case "SineIn":
            this.tipoTween = pc.SineIn;
            break;
        case "SineOut":
            this.tipoTween = pc.SineOut;
            break;
        case "SineInOut":
            this.tipoTween = pc.SineInOut
    }
    3 == this.boton.length && 1 == this.traducir && this.traduce(0), 1 == this.esconder && (this.entity.enabled = !1)
}, AnimaMsg.prototype.clickBoton = function(t, e, i) {
    null != e ? this.entity.element.texture = this.boton[i].resource : (this.entity.element.texture = this.boton[1].resource, setTimeout(this.restauraBoton.bind(this, t), 180))
}, AnimaMsg.prototype.restauraBoton = function(t) {
    this.entity.element.texture = this.boton[0].resource, t()
}, AnimaMsg.prototype.Alpha = function(t, e, i) {
    this.entity.enabled = !0;
    var n = {
        x: e
    };
    this.entity.element.opacity = e, this.app.tween(n).to({
        x: i
    }, this.tiempo, pc.Linear).onUpdate((() => {
        this.entity.element.opacity = n.x
    })).onComplete((() => {
        t()
    })).start()
}, AnimaMsg.prototype.pone1Vez = function(t) {
    this.entity.setLocalScale(1, 0, 1), this.entity.enabled = !0, this.tween = this.entity.tween(this.entity.getLocalScale()).to(new pc.Vec3(1, 1, 1), this.tiempo, this.tipoTween), null != t && this.tween.onComplete((() => {
        t()
    })), this.tween.start()
}, AnimaMsg.prototype.pone1VezMSG = function(t) {
    this.entity.setLocalScale(.15, 0, .1), this.entity.enabled = !0, this.tween = this.entity.tween(this.entity.getLocalScale()).to(new pc.Vec3(.15, .1, .1), this.tiempo, this.tipoTween), null != t && this.tween.onComplete((() => {
        t()
    })), this.tween.start()
}, AnimaMsg.prototype.pone = function(t) {
    this.entity.enabled = !0, this.entity.setLocalScale(1, 0, 1), this.tween = this.entity.tween(this.entity.getLocalScale()).to(new pc.Vec3(1, 1, 1), this.tiempo, this.tipoTween).onComplete((() => {
        this.saca(t)
    })), this.tween.start()
}, AnimaMsg.prototype.saca = function(t) {
    this.tween = this.entity.tween(this.entity.getLocalScale()).to(new pc.Vec3(1, 0, 1), this.tiempo - .1, this.tipoTween), null != t && this.tween.onComplete((() => {
        t()
    })), this.tween.delay(this.delaySaca), this.tween.start()
}, AnimaMsg.prototype.mueve = function(t) {
    this.entity.enabled = !0, null != this.tween && this.tween.stop(), this.entity.setLocalPosition(this.origen), this.tween = this.entity.tween(this.entity.getLocalPosition()).to(this.destino, this.tiempo, this.tipoTween).onComplete((() => {
        this.sacaMueve(t)
    })), this.tween.start()
}, AnimaMsg.prototype.mueve1Vez = function(t) {
    this.entity.enabled = !0, this.tween = this.entity.tween(this.entity.getLocalPosition()).to(this.destino, this.tiempo, this.tipoTween).onComplete((() => {
        t()
    })), this.tween.start()
}, AnimaMsg.prototype.sacaMueve = function(t) {
    null != t && t(), null != this.tween && this.tween.stop(), this.tween = this.entity.tween(this.entity.getLocalPosition()).to(this.origen, this.tiempo - .1, this.tipoTween), this.tween.delay(this.delaySaca), this.tween.start()
}, AnimaMsg.prototype.mueve2 = function(t) {
    this.entity.enabled = !0;
    var e = new pc.Vec3((this.destino.x + this.origen.x) / 2, (this.destino.y + this.origen.y) / 2, (this.destino.z + this.origen.z) / 2);
    this.tween = this.entity.tween(this.entity.getLocalPosition()).to(e, this.tiempo, this.tipoTween).onComplete((() => {
        this.sacaMueve2(t)
    })), this.tween.start()
}, AnimaMsg.prototype.sacaMueve2 = function(t) {
    null != t && t(), this.tween = this.entity.tween(this.entity.getLocalPosition()).to(this.destino, this.tiempo - .1, this.tipoTween), this.tween.delay(this.delaySaca), this.tween.onComplete((() => {
        this.entity.setLocalPosition(this.origen), this.entity.enabled = !1
    })), this.tween.start()
}, AnimaMsg.prototype.animaMano = function(t) {
    var e = this.tiempo,
        i = this.entity.getLocalPosition();
    if (0 == t) var n = new pc.Vec3(i.x + this.destinox, i.y, i.z);
    else if (1 == t) {
        n = new pc.Vec3(i.x - 2 * this.destinox, i.y, i.z);
        e *= 2
    } else if (2 == t) {
        n = new pc.Vec3(i.x + 2 * this.destinox, i.y, i.z);
        e *= 2
    }
    3 == (t += 1) && (t = 1), this.entity.enabled = !0, this.tween = this.mc.tween(i).to(n, e, this.tipoTween), this.tween.onComplete((() => {
        this.animaMano(t)
    })), this.tween.start()
}, AnimaMsg.prototype.detieneMano = function(t) {
    this.tween.stop()
}, AnimaMsg.prototype.traduce = function(t, e) {
    var i = x = window.navigator.language || navigator.browserLanguage;
    t *= idiomas.length;
    var n = 0;
    if (lenguajeManual ? n = lenguajeEl : -1 !== i.indexOf("de") ? n = 1 : -1 !== i.indexOf("nl") && (n = 2), !0 === e)
        for (var s = this.entity.model.meshInstances, o = 0; o < s.length; ++o) {
            var a = s[o];
            a.material.diffuseMap = this.boton[t + n].resource, a.material.opacityMap = this.boton[t + n].resource, a.material.update()
        } else this.entity.element.texture = this.boton[t + n].resource
};
var Ball2dRot = pc.createScript("ball2dRot");
Ball2dRot.attributes.add("radius", {
    type: "number",
    default: .19,
    title: "ball radius"
}), Ball2dRot.attributes.add("fakeEntity", {
    type: "entity",
    title: "fake entity for aux quat"
}), Ball2dRot.attributes.add("axes", {
    type: "number",
    enum: [{
        XY: 1
    }, {
        XZ: 2
    }, {
        YZ: 3
    }],
    default: 1,
    title: "Axes",
    description: "The axes for fake 3d rotate"
}), Ball2dRot.prototype.initialize = function() {
    null == this.fakeEntity && (this.fakeEntity = this.app.root.findByName("fakeEntity")), this.lastPosition = this.entity.getPosition().clone()
}, Ball2dRot.prototype.rotateBall = function() {
    if (0 != this.radius) {
        var t = this.entity.getPosition().clone(),
            e = new pc.Vec3;
        e.sub2(this.lastPosition, t);
        var i = e.length();
        if (0 != i) {
            var a;
            switch (i > .01 && (i = .01), this.axes) {
                case 1:
                    a = new pc.Vec3(0, 0, -30);
                    break;
                case 2:
                    a = new pc.Vec3(0, -50, 0);
                    break;
                case 3:
                    a = new pc.Vec3(-30, 0, 0)
            }
            var s = (new pc.Vec3).cross(a, e);
            if (s != pc.Vec3.ZERO) {
                var n = 180 * (i / this.radius) / Math.PI,
                    o = new pc.Quat;
                o.setFromAxisAngle(s, n);
                var l = new pc.Quat;
                l.mul2(o, this.entity.getRotation()), this.fakeEntity.setRotation(l), this.entity.setLocalEulerAngles(this.fakeEntity.getLocalEulerAngles())
            }
        }
    }
}, Ball2dRot.prototype.update = function(t) {
    this.rotateBall(), this.lastPosition = this.entity.getPosition().clone()
};
var Billboard = pc.createScript("billboard");
Billboard.prototype.initialize = function() {
    this.camera = this.app.root.findByName("Camera")
}, Billboard.prototype.update = function(t) {
    this.entity.setRotation(this.camera.getRotation()), this.entity.rotateLocal(90, 0, 0)
};
var Bezier = function(t) {
    function n(a) {
        if (r[a]) return r[a].exports;
        var u = r[a] = {
            exports: {},
            id: a,
            loaded: !1
        };
        return t[a].call(u.exports, u, u.exports, n), u.loaded = !0, u.exports
    }
    var r = {};
    return n.m = t, n.c = r, n.p = "", n(0)
}([function(t, r, a) {
    "use strict";
    t.exports = a(1)
}, function(t, r, a) {
    "use strict";
    var u = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
        return typeof t
    } : function(t) {
        return t && "function" == typeof Symbol && t.constructor === Symbol ? "symbol" : typeof t
    };
    ! function() {
        function n(t, r, a, u, c) {
            void 0 === c && (c = .5);
            var h = z.projectionratio(c, t),
                x = 1 - h,
                p = {
                    x: h * r.x + x * u.x,
                    y: h * r.y + x * u.y
                },
                y = z.abcratio(c, t);
            return {
                A: {
                    x: a.x + (a.x - p.x) / y,
                    y: a.y + (a.y - p.y) / y
                },
                B: a,
                C: p
            }
        }
        var r = Math.abs,
            c = Math.min,
            h = Math.max,
            x = Math.cos,
            p = Math.sin,
            y = Math.acos,
            d = Math.sqrt,
            m = Math.PI,
            g = {
                x: 0,
                y: 0,
                z: 0
            },
            z = a(2),
            b = a(3),
            l = function(t) {
                var a = t && t.forEach ? t : [].slice.call(arguments),
                    c = !1;
                if ("object" === u(a[0])) {
                    c = a.length;
                    var h = [];
                    a.forEach((function(t) {
                        ["x", "y", "z"].forEach((function(r) {
                            void 0 !== t[r] && h.push(t[r])
                        }))
                    })), a = h
                }
                var x = !1,
                    p = a.length;
                if (c) {
                    if (c > 4) {
                        if (1 !== arguments.length) throw new Error("Only new Bezier(point[]) is accepted for 4th and higher order curves");
                        x = !0
                    }
                } else if (6 !== p && 8 !== p && 9 !== p && 12 !== p && 1 !== arguments.length) throw new Error("Only new Bezier(point[]) is accepted for 4th and higher order curves");
                var y = !x && (9 === p || 12 === p) || t && t[0] && void 0 !== t[0].z;
                this._3d = y;
                for (var d = [], m = 0, g = y ? 3 : 2; p > m; m += g) {
                    var b = {
                        x: a[m],
                        y: a[m + 1]
                    };
                    y && (b.z = a[m + 2]), d.push(b)
                }
                this.order = d.length - 1, this.points = d;
                var _ = ["x", "y"];
                y && _.push("z"), this.dims = _, this.dimlen = _.length,
                    function(t) {
                        for (var a = t.order, u = t.points, c = z.align(u, {
                                p1: u[0],
                                p2: u[a]
                            }), h = 0; h < c.length; h++)
                            if (r(c[h].y) > 1e-4) return void(t._linear = !1);
                        t._linear = !0
                    }(this), this._t1 = 0, this._t2 = 1, this.update()
            };
        l.fromSVG = function(t) {
            var r = t.match(/[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?/g).map(parseFloat);
            return /[cq]/.test(t) ? (r = r.map((function(t, a) {
                return 2 > a ? t : t + r[a % 2]
            })), new l(r)) : new l(r)
        }, l.quadraticFromPoints = function(t, r, a, u) {
            if (void 0 === u && (u = .5), 0 === u) return new l(r, r, a);
            if (1 === u) return new l(t, r, r);
            var c = n(2, t, r, a, u);
            return new l(t, c.A, a)
        }, l.cubicFromPoints = function(t, r, a, u, c) {
            void 0 === u && (u = .5);
            var h = n(3, t, r, a, u);
            void 0 === c && (c = z.dist(r, h.C));
            var x = c * (1 - u) / u,
                p = z.dist(t, a),
                y = (a.x - t.x) / p,
                d = (a.y - t.y) / p,
                m = c * y,
                g = c * d,
                b = x * y,
                _ = x * d,
                w = r.x - m,
                E = r.y - g,
                S = r.x + b,
                M = r.y + _,
                k = h.A,
                O = k.x + (w - k.x) / (1 - u),
                T = k.y + (E - k.y) / (1 - u),
                N = k.x + (S - k.x) / u,
                j = k.y + (M - k.y) / u,
                I = {
                    x: t.x + (O - t.x) / u,
                    y: t.y + (T - t.y) / u
                },
                A = {
                    x: a.x + (N - a.x) / (1 - u),
                    y: a.y + (j - a.y) / (1 - u)
                };
            return new l(t, I, A, a)
        };
        var v = function() {
            return z
        };
        l.getUtils = v, l.prototype = {
            getUtils: v,
            valueOf: function() {
                return this.toString()
            },
            toString: function() {
                return z.pointsToString(this.points)
            },
            toSVG: function(t) {
                if (this._3d) return !1;
                for (var r = this.points, a = ["M", r[0].x, r[0].y, 2 === this.order ? "Q" : "C"], u = 1, c = r.length; c > u; u++) a.push(r[u].x), a.push(r[u].y);
                return a.join(" ")
            },
            update: function() {
                this.dpoints = [];
                for (var t = this.points, r = t.length, a = r - 1; r > 1; r--, a--) {
                    for (var u, c = [], h = 0; a > h; h++) u = {
                        x: a * (t[h + 1].x - t[h].x),
                        y: a * (t[h + 1].y - t[h].y)
                    }, this._3d && (u.z = a * (t[h + 1].z - t[h].z)), c.push(u);
                    this.dpoints.push(c), t = c
                }
                this.computedirection()
            },
            computedirection: function() {
                var t = this.points,
                    r = z.angle(t[0], t[this.order], t[1]);
                this.clockwise = r > 0
            },
            length: function() {
                return z.length(this.derivative.bind(this))
            },
            _lut: [],
            getLUT: function(t) {
                if (t = t || 100, this._lut.length === t) return this._lut;
                this._lut = [];
                for (var r = 0; t >= r; r++) this._lut.push(this.compute(r / t));
                return this._lut
            },
            on: function(t, r) {
                r = r || 5;
                for (var a, u = this.getLUT(), c = [], h = 0, x = 0; x < u.length; x++) a = u[x], z.dist(a, t) < r && (c.push(a), h += x / u.length);
                return !!c.length && (h /= c.length)
            },
            project: function(t) {
                var r = this.getLUT(),
                    a = r.length - 1,
                    u = z.closest(r, t),
                    c = u.mdist,
                    h = u.mpos;
                if (0 === h || h === a) {
                    var x = h / a,
                        p = this.compute(x);
                    return p.t = x, p.d = c, p
                }
                var y, d, m, g = (h + 1) / a,
                    b = .1 / a;
                for (c += 1, y = x = (h - 1) / a; g + b > x; x += b) d = this.compute(x), c > (m = z.dist(t, d)) && (c = m, y = x);
                return (d = this.compute(y)).t = y, d.d = c, d
            },
            get: function(t) {
                return this.compute(t)
            },
            point: function(t) {
                return this.points[t]
            },
            compute: function(t) {
                if (0 === t) return this.points[0];
                if (1 === t) return this.points[this.order];
                var r = this.points,
                    a = 1 - t;
                if (1 === this.order) return d = {
                    x: a * r[0].x + t * r[1].x,
                    y: a * r[0].y + t * r[1].y
                }, this._3d && (d.z = a * r[0].z + t * r[1].z), d;
                if (this.order < 4) {
                    var u, c, h, x = a * a,
                        p = t * t,
                        y = 0;
                    2 === this.order ? (r = [r[0], r[1], r[2], g], u = x, c = a * t * 2, h = p) : 3 === this.order && (u = x * a, c = x * t * 3, h = a * p * 3, y = t * p);
                    var d = {
                        x: u * r[0].x + c * r[1].x + h * r[2].x + y * r[3].x,
                        y: u * r[0].y + c * r[1].y + h * r[2].y + y * r[3].y
                    };
                    return this._3d && (d.z = u * r[0].z + c * r[1].z + h * r[2].z + y * r[3].z), d
                }
                for (var m = JSON.parse(JSON.stringify(this.points)); m.length > 1;) {
                    for (var z = 0; z < m.length - 1; z++) m[z] = {
                        x: m[z].x + (m[z + 1].x - m[z].x) * t,
                        y: m[z].y + (m[z + 1].y - m[z].y) * t
                    }, void 0 !== m[z].z && (m[z] = m[z].z + (m[z + 1].z - m[z].z) * t);
                    m.splice(m.length - 1, 1)
                }
                return m[0]
            },
            raise: function() {
                for (var t, r, a = this.points, u = [a[0]], c = a.length, h = 1; c > h; h++) t = a[h], r = a[h - 1], u[h] = {
                    x: (c - h) / c * t.x + h / c * r.x,
                    y: (c - h) / c * t.y + h / c * r.y
                };
                return u[c] = a[c - 1], new l(u)
            },
            derivative: function(t) {
                var r, a, u = 1 - t,
                    c = 0,
                    h = this.dpoints[0];
                2 === this.order && (h = [h[0], h[1], g], r = u, a = t), 3 === this.order && (r = u * u, a = u * t * 2, c = t * t);
                var x = {
                    x: r * h[0].x + a * h[1].x + c * h[2].x,
                    y: r * h[0].y + a * h[1].y + c * h[2].y
                };
                return this._3d && (x.z = r * h[0].z + a * h[1].z + c * h[2].z), x
            },
            inflections: function() {
                return z.inflections(this.points)
            },
            normal: function(t) {
                return this._3d ? this.__normal3(t) : this.__normal2(t)
            },
            __normal2: function(t) {
                var r = this.derivative(t),
                    a = d(r.x * r.x + r.y * r.y);
                return {
                    x: -r.y / a,
                    y: r.x / a
                }
            },
            __normal3: function(t) {
                var r = this.derivative(t),
                    a = this.derivative(t + .01),
                    u = d(r.x * r.x + r.y * r.y + r.z * r.z),
                    c = d(a.x * a.x + a.y * a.y + a.z * a.z);
                r.x /= u, r.y /= u, r.z /= u, a.x /= c, a.y /= c, a.z /= c;
                var h = {
                        x: a.y * r.z - a.z * r.y,
                        y: a.z * r.x - a.x * r.z,
                        z: a.x * r.y - a.y * r.x
                    },
                    x = d(h.x * h.x + h.y * h.y + h.z * h.z);
                h.x /= x, h.y /= x, h.z /= x;
                var p = [h.x * h.x, h.x * h.y - h.z, h.x * h.z + h.y, h.x * h.y + h.z, h.y * h.y, h.y * h.z - h.x, h.x * h.z - h.y, h.y * h.z + h.x, h.z * h.z];
                return {
                    x: p[0] * r.x + p[1] * r.y + p[2] * r.z,
                    y: p[3] * r.x + p[4] * r.y + p[5] * r.z,
                    z: p[6] * r.x + p[7] * r.y + p[8] * r.z
                }
            },
            hull: function(t) {
                var r, a = this.points,
                    u = [],
                    c = [],
                    h = 0,
                    x = 0,
                    p = 0;
                for (c[h++] = a[0], c[h++] = a[1], c[h++] = a[2], 3 === this.order && (c[h++] = a[3]); a.length > 1;) {
                    for (u = [], x = 0, p = a.length - 1; p > x; x++) r = z.lerp(t, a[x], a[x + 1]), c[h++] = r, u.push(r);
                    a = u
                }
                return c
            },
            split: function(t, r) {
                if (0 === t && r) return this.split(r).left;
                if (1 === r) return this.split(t).right;
                var a = this.hull(t),
                    u = {
                        left: new l(2 === this.order ? [a[0], a[3], a[5]] : [a[0], a[4], a[7], a[9]]),
                        right: new l(2 === this.order ? [a[5], a[4], a[2]] : [a[9], a[8], a[6], a[3]]),
                        span: a
                    };
                return u.left._t1 = z.map(0, 0, 1, this._t1, this._t2), u.left._t2 = z.map(t, 0, 1, this._t1, this._t2), u.right._t1 = z.map(t, 0, 1, this._t1, this._t2), u.right._t2 = z.map(1, 0, 1, this._t1, this._t2), r ? (r = z.map(r, t, 1, 0, 1), u.right.split(r).left) : u
            },
            extrema: function() {
                var t, r, a = this.dims,
                    u = {},
                    c = [];
                return a.forEach(function(a) {
                    r = function(t) {
                        return t[a]
                    }, t = this.dpoints[0].map(r), u[a] = z.droots(t), 3 === this.order && (t = this.dpoints[1].map(r), u[a] = u[a].concat(z.droots(t))), u[a] = u[a].filter((function(t) {
                        return t >= 0 && 1 >= t
                    })), c = c.concat(u[a].sort())
                }.bind(this)), c = c.sort().filter((function(t, r) {
                    return c.indexOf(t) === r
                })), u.values = c, u
            },
            bbox: function() {
                var t = this.extrema(),
                    r = {};
                return this.dims.forEach(function(a) {
                    r[a] = z.getminmax(this, a, t[a])
                }.bind(this)), r
            },
            overlaps: function(t) {
                var r = this.bbox(),
                    a = t.bbox();
                return z.bboxoverlap(r, a)
            },
            offset: function(t, r) {
                if (void 0 !== r) {
                    var a = this.get(t),
                        u = this.normal(t),
                        c = {
                            c: a,
                            n: u,
                            x: a.x + u.x * r,
                            y: a.y + u.y * r
                        };
                    return this._3d && (c.z = a.z + u.z * r), c
                }
                if (this._linear) {
                    var h = this.normal(0),
                        x = this.points.map((function(r) {
                            var a = {
                                x: r.x + t * h.x,
                                y: r.y + t * h.y
                            };
                            return r.z && u.z && (a.z = r.z + t * h.z), a
                        }));
                    return [new l(x)]
                }
                return this.reduce().map((function(r) {
                    return r.scale(t)
                }))
            },
            simple: function() {
                if (3 === this.order) {
                    var t = z.angle(this.points[0], this.points[3], this.points[1]),
                        a = z.angle(this.points[0], this.points[3], this.points[2]);
                    if (t > 0 && 0 > a || 0 > t && a > 0) return !1
                }
                var u = this.normal(0),
                    c = this.normal(1),
                    h = u.x * c.x + u.y * c.y;
                this._3d && (h += u.z * c.z);
                var x = r(y(h));
                return m / 3 > x
            },
            reduce: function() {
                var t, a, u = 0,
                    c = 0,
                    h = .01,
                    x = [],
                    p = [],
                    y = this.extrema().values;
                for (-1 === y.indexOf(0) && (y = [0].concat(y)), -1 === y.indexOf(1) && y.push(1), u = y[0], t = 1; t < y.length; t++) c = y[t], (a = this.split(u, c))._t1 = u, a._t2 = c, x.push(a), u = c;
                return x.forEach((function(t) {
                    for (u = 0, c = 0; 1 >= c;)
                        for (c = u + h; 1 + h >= c; c += h)
                            if (!(a = t.split(u, c)).simple()) {
                                if (r(u - (c -= h)) < h) return [];
                                (a = t.split(u, c))._t1 = z.map(u, 0, 1, t._t1, t._t2), a._t2 = z.map(c, 0, 1, t._t1, t._t2), p.push(a), u = c;
                                break
                            } 1 > u && ((a = t.split(u, 1))._t1 = z.map(u, 0, 1, t._t1, t._t2), a._t2 = t._t2, p.push(a))
                })), p
            },
            scale: function(t) {
                var r = this.order,
                    a = !1;
                if ("function" == typeof t && (a = t), a && 2 === r) return this.raise().scale(a);
                var u = this.clockwise,
                    c = a ? a(0) : t,
                    h = a ? a(1) : t,
                    x = [this.offset(0, 10), this.offset(1, 10)],
                    p = z.lli4(x[0], x[0].c, x[1], x[1].c);
                if (!p) throw new Error("cannot scale this curve. Try reducing it first.");
                var y = this.points,
                    m = [];
                return [0, 1].forEach(function(t) {
                    var a = m[t * r] = z.copy(y[t * r]);
                    a.x += (t ? h : c) * x[t].n.x, a.y += (t ? h : c) * x[t].n.y
                }.bind(this)), a ? ([0, 1].forEach(function(c) {
                    if (2 !== this.order || !c) {
                        var h = y[c + 1],
                            x = {
                                x: h.x - p.x,
                                y: h.y - p.y
                            },
                            g = a ? a((c + 1) / r) : t;
                        a && !u && (g = -g);
                        var z = d(x.x * x.x + x.y * x.y);
                        x.x /= z, x.y /= z, m[c + 1] = {
                            x: h.x + g * x.x,
                            y: h.y + g * x.y
                        }
                    }
                }.bind(this)), new l(m)) : ([0, 1].forEach(function(t) {
                    if (2 !== this.order || !t) {
                        var a = m[t * r],
                            u = this.derivative(t),
                            c = {
                                x: a.x + u.x,
                                y: a.y + u.y
                            };
                        m[t + 1] = z.lli4(a, c, p, y[t + 1])
                    }
                }.bind(this)), new l(m))
            },
            outline: function(t, r, a, u) {
                function e(t, r, a, u, c) {
                    return function(h) {
                        var x = u / a,
                            p = (u + c) / a,
                            y = r - t;
                        return z.map(h, 0, 1, t + x * y, t + p * y)
                    }
                }
                r = void 0 === r ? t : r;
                var c, h = this.reduce(),
                    x = h.length,
                    p = [],
                    y = [],
                    d = 0,
                    m = this.length(),
                    g = void 0 !== a && void 0 !== u;
                h.forEach((function(c) {
                    T = c.length(), g ? (p.push(c.scale(e(t, a, m, d, T))), y.push(c.scale(e(-r, -u, m, d, T)))) : (p.push(c.scale(t)), y.push(c.scale(-r))), d += T
                })), y = y.map((function(t) {
                    return (c = t.points)[3] ? t.points = [c[3], c[2], c[1], c[0]] : t.points = [c[2], c[1], c[0]], t
                })).reverse();
                var _ = p[0].points[0],
                    w = p[x - 1].points[p[x - 1].points.length - 1],
                    E = y[x - 1].points[y[x - 1].points.length - 1],
                    S = y[0].points[0],
                    M = z.makeline(E, _),
                    k = z.makeline(w, S),
                    O = [M].concat(p).concat([k]).concat(y),
                    T = O.length;
                return new b(O)
            },
            outlineshapes: function(t, r, a) {
                r = r || t;
                for (var u = this.outline(t, r).curves, c = [], h = 1, x = u.length; x / 2 > h; h++) {
                    var p = z.makeshape(u[h], u[x - h], a);
                    p.startcap.virtual = h > 1, p.endcap.virtual = x / 2 - 1 > h, c.push(p)
                }
                return c
            },
            intersects: function(t, r) {
                return t ? t.p1 && t.p2 ? this.lineIntersects(t) : (t instanceof l && (t = t.reduce()), this.curveintersects(this.reduce(), t, r)) : this.selfintersects(r)
            },
            lineIntersects: function(t) {
                var r = c(t.p1.x, t.p2.x),
                    a = c(t.p1.y, t.p2.y),
                    u = h(t.p1.x, t.p2.x),
                    x = h(t.p1.y, t.p2.y),
                    p = this;
                return z.roots(this.points, t).filter((function(t) {
                    var c = p.get(t);
                    return z.between(c.x, r, u) && z.between(c.y, a, x)
                }))
            },
            selfintersects: function(t) {
                var r, a, u, c, h = this.reduce(),
                    x = h.length - 2,
                    p = [];
                for (r = 0; x > r; r++) u = h.slice(r, r + 1), c = h.slice(r + 2), a = this.curveintersects(u, c, t), p = p.concat(a);
                return p
            },
            curveintersects: function(t, r, a) {
                var u = [];
                t.forEach((function(t) {
                    r.forEach((function(r) {
                        t.overlaps(r) && u.push({
                            left: t,
                            right: r
                        })
                    }))
                }));
                var c = [];
                return u.forEach((function(t) {
                    var r = z.pairiteration(t.left, t.right, a);
                    r.length > 0 && (c = c.concat(r))
                })), c
            },
            arcs: function(t) {
                t = t || .5;
                return this._iterate(t, [])
            },
            _error: function(t, a, u, c) {
                var h = (c - u) / 4,
                    x = this.get(u + h),
                    p = this.get(c - h),
                    y = z.dist(t, a),
                    d = z.dist(t, x),
                    m = z.dist(t, p);
                return r(d - y) + r(m - y)
            },
            _iterate: function(t, r) {
                var a, u = 0,
                    c = 1;
                do {
                    a = 0, c = 1;
                    var h, y, d, m, g, b = this.get(u),
                        _ = !1,
                        w = !1,
                        E = c,
                        S = 1;
                    do {
                        if (w = _, m = d, E = (u + c) / 2, h = this.get(E), y = this.get(c), (d = z.getccenter(b, h, y)).interval = {
                                start: u,
                                end: c
                            }, _ = t >= this._error(d, b, u, c), (g = w && !_) || (S = c), _) {
                            if (c >= 1) {
                                if (d.interval.end = S = 1, m = d, c > 1) {
                                    var M = {
                                        x: d.x + d.r * x(d.e),
                                        y: d.y + d.r * p(d.e)
                                    };
                                    d.e += z.angle({
                                        x: d.x,
                                        y: d.y
                                    }, M, this.get(1))
                                }
                                break
                            }
                            c += (c - u) / 2
                        } else c = E
                    } while (!g && a++ < 100);
                    if (a >= 100) break;
                    m = m || d, r.push(m), u = S
                } while (1 > c);
                return r
            }
        }, t.exports = l
    }()
}, function(t, r, a) {
    "use strict";
    ! function() {
        var r = Math.abs,
            u = Math.cos,
            c = Math.sin,
            h = Math.acos,
            x = Math.atan2,
            p = Math.sqrt,
            y = Math.pow,
            f = function(t) {
                return 0 > t ? -y(-t, 1 / 3) : y(t, 1 / 3)
            },
            d = Math.PI,
            m = 2 * d,
            g = d / 2,
            z = Number.MAX_SAFE_INTEGER,
            b = Number.MIN_SAFE_INTEGER,
            _ = {
                Tvalues: [-.06405689286260563, .06405689286260563, -.1911188674736163, .1911188674736163, -.3150426796961634, .3150426796961634, -.4337935076260451, .4337935076260451, -.5454214713888396, .5454214713888396, -.6480936519369755, .6480936519369755, -.7401241915785544, .7401241915785544, -.820001985973903, .820001985973903, -.8864155270044011, .8864155270044011, -.9382745520027328, .9382745520027328, -.9747285559713095, .9747285559713095, -.9951872199970213, .9951872199970213],
                Cvalues: [.12793819534675216, .12793819534675216, .1258374563468283, .1258374563468283, .12167047292780339, .12167047292780339, .1155056680537256, .1155056680537256, .10744427011596563, .10744427011596563, .09761865210411388, .09761865210411388, .08619016153195327, .08619016153195327, .0733464814110803, .0733464814110803, .05929858491543678, .05929858491543678, .04427743881741981, .04427743881741981, .028531388628933663, .028531388628933663, .0123412297999872, .0123412297999872],
                arcfn: function(t, r) {
                    var a = r(t),
                        u = a.x * a.x + a.y * a.y;
                    return void 0 !== a.z && (u += a.z * a.z), p(u)
                },
                between: function(t, r, a) {
                    return t >= r && a >= t || _.approximately(t, r) || _.approximately(t, a)
                },
                approximately: function(t, a, u) {
                    return r(t - a) <= (u || 1e-6)
                },
                length: function(t) {
                    var r, a, u = 0,
                        c = _.Tvalues.length;
                    for (r = 0; c > r; r++) a = .5 * _.Tvalues[r] + .5, u += _.Cvalues[r] * _.arcfn(a, t);
                    return .5 * u
                },
                map: function(t, r, a, u, c) {
                    return u + (c - u) * ((t - r) / (a - r))
                },
                lerp: function(t, r, a) {
                    var u = {
                        x: r.x + t * (a.x - r.x),
                        y: r.y + t * (a.y - r.y)
                    };
                    return r.z && a.z && (u.z = r.z + t * (a.z - r.z)), u
                },
                pointToString: function(t) {
                    var r = t.x + "/" + t.y;
                    return void 0 !== t.z && (r += "/" + t.z), r
                },
                pointsToString: function(t) {
                    return "[" + t.map(_.pointToString).join(", ") + "]"
                },
                copy: function(t) {
                    return JSON.parse(JSON.stringify(t))
                },
                angle: function(t, r, a) {
                    var u = r.x - t.x,
                        c = r.y - t.y,
                        h = a.x - t.x,
                        p = a.y - t.y;
                    return x(u * p - c * h, u * h + c * p)
                },
                round: function(t, r) {
                    var a = "" + t,
                        u = a.indexOf(".");
                    return parseFloat(a.substring(0, u + 1 + r))
                },
                dist: function(t, r) {
                    var a = t.x - r.x,
                        u = t.y - r.y;
                    return p(a * a + u * u)
                },
                closest: function(t, r) {
                    var a, u, c = y(2, 63);
                    return t.forEach((function(t, h) {
                        u = _.dist(r, t), c > u && (c = u, a = h)
                    })), {
                        mdist: c,
                        mpos: a
                    }
                },
                abcratio: function(t, a) {
                    if (2 !== a && 3 !== a) return !1;
                    if (void 0 === t) t = .5;
                    else if (0 === t || 1 === t) return t;
                    var u = y(t, a) + y(1 - t, a);
                    return r((u - 1) / u)
                },
                projectionratio: function(t, r) {
                    if (2 !== r && 3 !== r) return !1;
                    if (void 0 === t) t = .5;
                    else if (0 === t || 1 === t) return t;
                    var a = y(1 - t, r);
                    return a / (y(t, r) + a)
                },
                lli8: function(t, r, a, u, c, h, x, p) {
                    var y = (t - a) * (h - p) - (r - u) * (c - x);
                    return 0 != y && {
                        x: ((t * u - r * a) * (c - x) - (t - a) * (c * p - h * x)) / y,
                        y: ((t * u - r * a) * (h - p) - (r - u) * (c * p - h * x)) / y
                    }
                },
                lli4: function(t, r, a, u) {
                    var c = t.x,
                        h = t.y,
                        x = r.x,
                        p = r.y,
                        y = a.x,
                        d = a.y,
                        m = u.x,
                        g = u.y;
                    return _.lli8(c, h, x, p, y, d, m, g)
                },
                lli: function(t, r) {
                    return _.lli4(t, t.c, r, r.c)
                },
                makeline: function(t, r) {
                    var u = a(1),
                        c = t.x,
                        h = t.y,
                        x = r.x,
                        p = r.y,
                        y = (x - c) / 3,
                        d = (p - h) / 3;
                    return new u(c, h, c + y, h + d, c + 2 * y, h + 2 * d, x, p)
                },
                findbbox: function(t) {
                    var r = z,
                        a = z,
                        u = b,
                        c = b;
                    return t.forEach((function(t) {
                        var h = t.bbox();
                        r > h.x.min && (r = h.x.min), a > h.y.min && (a = h.y.min), u < h.x.max && (u = h.x.max), c < h.y.max && (c = h.y.max)
                    })), {
                        x: {
                            min: r,
                            mid: (r + u) / 2,
                            max: u,
                            size: u - r
                        },
                        y: {
                            min: a,
                            mid: (a + c) / 2,
                            max: c,
                            size: c - a
                        }
                    }
                },
                shapeintersections: function(t, r, a, u, c) {
                    if (!_.bboxoverlap(r, u)) return [];
                    var h = [],
                        x = [t.startcap, t.forward, t.back, t.endcap],
                        p = [a.startcap, a.forward, a.back, a.endcap];
                    return x.forEach((function(r) {
                        r.virtual || p.forEach((function(u) {
                            if (!u.virtual) {
                                var x = r.intersects(u, c);
                                x.length > 0 && (x.c1 = r, x.c2 = u, x.s1 = t, x.s2 = a, h.push(x))
                            }
                        }))
                    })), h
                },
                makeshape: function(t, r, a) {
                    var u = r.points.length,
                        c = t.points.length,
                        h = _.makeline(r.points[u - 1], t.points[0]),
                        x = _.makeline(t.points[c - 1], r.points[0]),
                        p = {
                            startcap: h,
                            forward: t,
                            back: r,
                            endcap: x,
                            bbox: _.findbbox([h, t, r, x])
                        },
                        y = _;
                    return p.intersections = function(t) {
                        return y.shapeintersections(p, p.bbox, t, t.bbox, a)
                    }, p
                },
                getminmax: function(t, r, a) {
                    if (!a) return {
                        min: 0,
                        max: 0
                    };
                    var u, c, h = z,
                        x = b; - 1 === a.indexOf(0) && (a = [0].concat(a)), -1 === a.indexOf(1) && a.push(1);
                    for (var p = 0, y = a.length; y > p; p++) u = a[p], (c = t.get(u))[r] < h && (h = c[r]), c[r] > x && (x = c[r]);
                    return {
                        min: h,
                        mid: (h + x) / 2,
                        max: x,
                        size: x - h
                    }
                },
                align: function(t, r) {
                    var a = r.p1.x,
                        h = r.p1.y,
                        p = -x(r.p2.y - h, r.p2.x - a);
                    return t.map((function(t) {
                        return {
                            x: (t.x - a) * u(p) - (t.y - h) * c(p),
                            y: (t.x - a) * c(p) + (t.y - h) * u(p)
                        }
                    }))
                },
                roots: function(t, r) {
                    r = r || {
                        p1: {
                            x: 0,
                            y: 0
                        },
                        p2: {
                            x: 1,
                            y: 0
                        }
                    };
                    var a = t.length - 1,
                        c = _.align(t, r),
                        s = function(t) {
                            return t >= 0 && 1 >= t
                        };
                    if (2 === a) {
                        if (0 !== (g = (z = c[0].y) - 2 * (b = c[1].y) + (w = c[2].y))) {
                            var x = -p(b * b - z * w),
                                y = -z + b;
                            return [-(x + y) / g, -(-x + y) / g].filter(s)
                        }
                        return b !== w && 0 === g ? [(2 * b - w) / 2 * (b - w)].filter(s) : []
                    }
                    var d, g, z, b, w, E = c[0].y,
                        S = c[1].y,
                        M = c[2].y,
                        k = (c = (3 * (b = (-3 * E + 3 * S) / (g = 3 * S - E - 3 * M + c[3].y)) - (z = (3 * E - 6 * S + 3 * M) / g) * z) / 3) / 3,
                        O = (2 * z * z * z - 9 * z * b + 27 * (w = E / g)) / 27,
                        T = O / 2,
                        N = T * T + k * k * k;
                    if (0 > N) {
                        var j = -c / 3,
                            I = p(j * j * j),
                            A = -O / (2 * I),
                            C = h(-1 > A ? -1 : A > 1 ? 1 : A),
                            F = 2 * f(I);
                        return [F * u(C / 3) - z / 3, F * u((C + m) / 3) - z / 3, F * u((C + 2 * m) / 3) - z / 3].filter(s)
                    }
                    if (0 === N) return [2 * (d = 0 > T ? f(-T) : -f(T)) - z / 3, -d - z / 3].filter(s);
                    var q = p(N);
                    return [(d = f(-T + q)) - f(T + q) - z / 3].filter(s)
                },
                droots: function(t) {
                    if (3 === t.length) {
                        var r = t[0],
                            a = t[1],
                            u = t[2],
                            c = r - 2 * a + u;
                        if (0 !== c) {
                            var h = -p(a * a - r * u),
                                x = -r + a;
                            return [-(h + x) / c, -(-h + x) / c]
                        }
                        return a !== u && 0 === c ? [(2 * a - u) / (2 * (a - u))] : []
                    }
                    if (2 === t.length) return (r = t[0]) !== (a = t[1]) ? [r / (r - a)] : []
                },
                inflections: function(t) {
                    if (t.length < 4) return [];
                    var r = _.align(t, {
                            p1: t[0],
                            p2: t.slice(-1)[0]
                        }),
                        a = r[2].x * r[1].y,
                        u = r[3].x * r[1].y,
                        c = r[1].x * r[2].y,
                        h = 18 * (-3 * a + 2 * u + 3 * c - (g = r[3].x * r[2].y)),
                        x = 18 * (3 * a - u - 3 * c),
                        p = 18 * (c - a);
                    if (_.approximately(h, 0)) {
                        if (!_.approximately(x, 0)) {
                            var y = -p / x;
                            if (y >= 0 && 1 >= y) return [y]
                        }
                        return []
                    }
                    var d = x * x - 4 * h * p,
                        m = Math.sqrt(d),
                        g = 2 * h;
                    return _.approximately(g, 0) ? [] : [(m - x) / g, -(x + m) / g].filter((function(t) {
                        return t >= 0 && 1 >= t
                    }))
                },
                bboxoverlap: function(t, a) {
                    var u, c, h, x, p, y = ["x", "y"],
                        d = y.length;
                    for (u = 0; d > u; u++)
                        if (h = t[c = y[u]].mid, x = a[c].mid, p = (t[c].size + a[c].size) / 2, r(h - x) >= p) return !1;
                    return !0
                },
                expandbox: function(t, r) {
                    r.x.min < t.x.min && (t.x.min = r.x.min), r.y.min < t.y.min && (t.y.min = r.y.min), r.z && r.z.min < t.z.min && (t.z.min = r.z.min), r.x.max > t.x.max && (t.x.max = r.x.max), r.y.max > t.y.max && (t.y.max = r.y.max), r.z && r.z.max > t.z.max && (t.z.max = r.z.max), t.x.mid = (t.x.min + t.x.max) / 2, t.y.mid = (t.y.min + t.y.max) / 2, t.z && (t.z.mid = (t.z.min + t.z.max) / 2), t.x.size = t.x.max - t.x.min, t.y.size = t.y.max - t.y.min, t.z && (t.z.size = t.z.max - t.z.min)
                },
                pairiteration: function(t, r, a) {
                    var u = t.bbox(),
                        c = r.bbox(),
                        h = 1e5,
                        x = a || .5;
                    if (u.x.size + u.y.size < x && c.x.size + c.y.size < x) return [(h * (t._t1 + t._t2) / 2 | 0) / h + "/" + (h * (r._t1 + r._t2) / 2 | 0) / h];
                    var p = t.split(.5),
                        y = r.split(.5),
                        d = [{
                            left: p.left,
                            right: y.left
                        }, {
                            left: p.left,
                            right: y.right
                        }, {
                            left: p.right,
                            right: y.right
                        }, {
                            left: p.right,
                            right: y.left
                        }];
                    d = d.filter((function(t) {
                        return _.bboxoverlap(t.left.bbox(), t.right.bbox())
                    }));
                    var m = [];
                    return 0 === d.length ? m : (d.forEach((function(t) {
                        m = m.concat(_.pairiteration(t.left, t.right, x))
                    })), m = m.filter((function(t, r) {
                        return m.indexOf(t) === r
                    })))
                },
                getccenter: function(t, r, a) {
                    var h, p = r.x - t.x,
                        y = r.y - t.y,
                        d = a.x - r.x,
                        z = a.y - r.y,
                        b = p * u(g) - y * c(g),
                        w = p * c(g) + y * u(g),
                        E = d * u(g) - z * c(g),
                        S = d * c(g) + z * u(g),
                        M = (t.x + r.x) / 2,
                        k = (t.y + r.y) / 2,
                        O = (r.x + a.x) / 2,
                        T = (r.y + a.y) / 2,
                        N = M + b,
                        j = k + w,
                        I = O + E,
                        A = T + S,
                        C = _.lli8(M, k, N, j, O, T, I, A),
                        F = _.dist(C, t),
                        q = x(t.y - C.y, t.x - C.x),
                        U = x(r.y - C.y, r.x - C.x),
                        B = x(a.y - C.y, a.x - C.x);
                    return B > q ? ((q > U || U > B) && (q += m), q > B && (h = B, B = q, q = h)) : U > B && q > U ? (h = B, B = q, q = h) : B += m, C.s = q, C.e = B, C.r = F, C
                }
            };
        t.exports = _
    }()
}, function(t, r, a) {
    "use strict";
    ! function() {
        var r = a(2),
            i = function(t) {
                this.curves = [], this._3d = !1, t && (this.curves = t, this._3d = this.curves[0]._3d)
            };
        i.prototype = {
            valueOf: function() {
                return this.toString()
            },
            toString: function() {
                return "[" + this.curves.map((function(t) {
                    return r.pointsToString(t.points)
                })).join(", ") + "]"
            },
            addCurve: function(t) {
                this.curves.push(t), this._3d = this._3d || t._3d
            },
            length: function() {
                return this.curves.map((function(t) {
                    return t.length()
                })).reduce((function(t, r) {
                    return t + r
                }))
            },
            curve: function(t) {
                return this.curves[t]
            },
            bbox: function e() {
                for (var t = this.curves, e = t[0].bbox(), a = 1; a < t.length; a++) r.expandbox(e, t[a].bbox());
                return e
            },
            offset: function o(t) {
                var o = [];
                return this.curves.forEach((function(r) {
                    o = o.concat(r.offset(t))
                })), new i(o)
            }
        }, t.exports = i
    }()
}]);
var CambiaTextura = pc.createScript("cambiaTextura");
CambiaTextura.attributes.add("material", {
    type: "asset",
    assetType: "material",
    array: !1
}), CambiaTextura.attributes.add("texturas", {
    type: "asset",
    assetType: "texture",
    array: !0,
    title: "texturas"
}), CambiaTextura.attributes.add("transparente", {
    type: "number",
    default: 0,
    title: "transparente"
}), CambiaTextura.attributes.add("emisivo", {
    type: "number",
    default: 0,
    title: "emisivo"
}), CambiaTextura.attributes.add("esElement", {
    type: "number",
    default: 0,
    title: "esElement"
}), CambiaTextura.prototype.initialize = function() {}, CambiaTextura.prototype.cambio = function(e) {
    var t = this.texturas[e];
    if (0 == this.esElement) {
        var a = this.material.resource;
        a.diffuseMap = t.resource, 1 == this.transparente && (a.opacityMap = t.resource), 1 == this.emisivo && (a.emissiveMap = t.resource), a.update()
    } else this.entity.element.texture = t.resource
};
var DetectAspectRatio = pc.createScript("detectAspectRatio");
DetectAspectRatio.attributes.add("camara", {
    type: "entity"
}), DetectAspectRatio.attributes.add("powerBar", {
    type: "entity"
}), DetectAspectRatio.prototype.initialize = function() {
    if (_2dScreen = this.entity, this.powerBar.enabled = !1, window.innerWidth < window.innerHeight) setTimeout(this.initialize.bind(this), 100);
    else if (isMobile.any()) {
        var t = window.innerWidth / window.innerHeight;
        if (t > 1.78) {
            this.camara.camera.orthoHeight = 3.9;
            i = this.camara.getPosition();
            this.camara.setPosition(-.313, i.y, i.z)
        } else if (t <= 1.35) {
            this.camara.camera.orthoHeight = 5.25;
            i = this.camara.getPosition();
            this.camara.setPosition(-.313, i.y, i.z)
        } else {
            this.camara.camera.orthoHeight = 3.95;
            i = this.camara.getPosition();
            this.camara.setPosition(-.313, i.y, i.z)
        }
    } else {
        this.camara.camera.orthoHeight = 3.97;
        var i = this.camara.getPosition();
        this.camara.setPosition(0, i.y, i.z)
    }
};
var Colisiones = pc.createScript("colisiones");
Colisiones.attributes.add("mcPisoHit", {
    type: "entity"
}), Colisiones.attributes.add("tipo", {
    type: "string",
    default: ""
}), Colisiones.prototype.initialize = function() {
    espera = 0, this.espera = !1, this.posMuerte = null, this.bola = null, this.coliderUsado = !1, this.tiempoUsado = 0, this.entity.collision.on("triggerenter", this.onTriggerEnter, this)
}, Colisiones.prototype.onTriggerEnter = function(t) {
    if (!gameOver && !pause && _coreSystem.start && _coreSystem.startMusic && !_coreSystem.finCancion && !enMenu) switch (this.tipo) {
        case "normal":
            if (this.coliderUsado) return;
            var e = t.getPosition(),
                a = this.entity.parent,
                i = a.script.nota.tipoNota,
                o = a.getPosition();
            if (e.x >= o.x - anchoPlataforma && e.x <= o.x + anchoPlataforma && e.z <= o.z + largoPlataforma && e.z >= o.z - largoPlataforma) {
                espera = -1;
                var s = i;
                this.mcPisoHit.enabled = !1, 1 == s && _rebote.matarBola(!0), e.x >= o.x - anchoPlataforma / toleranciaPerfect && e.x <= o.x + anchoPlataforma / toleranciaPerfect && e.z <= o.z + largoPlataforma && e.z >= o.z - largoPlataforma ? a.script.nota.mataNota("perfect") : a.script.nota.mataNota("hit")
            }
            break;
        case "piso":
            this.mcPisoHit.enabled = !1, this.espera = !0, this.bola = t, espera = 0;
            break;
        case "marca":
            e = t.getPosition().clone();
            e = new pc.Vec3(e.x, e.y - .6, e.z), this.mcPisoHit.enabled = !0, this.mcPisoHit.setPosition(e)
    }
}, Colisiones.prototype.update = function(t) {
    if (!pause) {
        if (this.coliderUsado && (this.tiempoUsado = this.tiempoUsado + t, this.tiempoUsado >= 2 && (this.tiempoUsado = 0, this.coliderUsado = !1)), gameOver) return this.espera = !1, void(espera = 0);
        this.espera && (-1 == espera && (this.espera = !1, espera = 0), espera += t, espera >= .13 && (this.espera = !1, espera = 0, _coreSystem.finCancion || _rebote.matarBola(!0)))
    }
};
var ColorMaterial = pc.createScript("colorMaterial");
ColorMaterial.attributes.add("material", {
    type: "asset",
    assetType: "material",
    array: !1
}), ColorMaterial.attributes.add("colours", {
    type: "string",
    array: !0
}), ColorMaterial.prototype.initialize = function() {}, ColorMaterial.prototype.colorChange = function(r) {
    var a = this.material.resource;
    a.diffuse = (new pc.Color).fromString(this.colours[r]), a.update()
};
var DragHelper = pc.createScript("dragHelper");
DragHelper.prototype.initialize = function() {
    this.dragHelper = new pc.ElementDragHelper(this.entity.element, "y")
}, DragHelper.prototype.update = function(e) {};
var ElementAlphaAnim = pc.createScript("elementAlphaAnim");
ElementAlphaAnim.attributes.add("speed", {
    type: "number",
    default: 1
}), ElementAlphaAnim.attributes.add("delayFadeIN", {
    type: "number",
    default: 1
}), ElementAlphaAnim.attributes.add("delayFadeOUT", {
    type: "number",
    default: 1
}), ElementAlphaAnim.prototype.initialize = function() {
    this.objeto = [], this.tipo = []
}, ElementAlphaAnim.prototype.fadeOut = function(t) {
    var e = this.entity.children[t];
    setTimeout(function() {
        if (this.objeto.includes(e)) {
            var t = this.objeto.indexOf(e);
            this.tipo[t] = -1
        } else this.objeto.push(e), this.tipo.push(-1)
    }.bind(this), 1e3 * this.delayFadeOUT)
}, ElementAlphaAnim.prototype.fadeIn = function(t) {
    var e = this.entity.children[t];
    setTimeout(function() {
        if (this.objeto.includes(e)) {
            var t = this.objeto.indexOf(e);
            this.tipo[t] = 1
        } else this.objeto.push(e), this.tipo.push(1)
    }.bind(this), 1e3 * this.delayFadeIN)
}, ElementAlphaAnim.prototype.reset = function(t, e) {
    var i = this.entity.children[t];
    if (i.enabled = !0, this.objeto.includes(i)) {
        var n = this.objeto.indexOf(i);
        this.tipo[n] = 0
    } else this.objeto.push(i), this.tipo.push(0);
    i.element.opacity = e
}, ElementAlphaAnim.prototype.update = function(t) {
    for (var e = 0; e < this.objeto.length; e++) {
        var i = this.objeto[e],
            n = this.tipo[e],
            o = this.objeto[e].element.opacity;
        1 == n && o < 1 ? ((o += t * this.speed) > 1 && (o = 1), i.element.opacity = o) : -1 == n && o > 0 && ((o -= t * this.speed) < 0 && (o = 0), i.element.opacity = o)
    }
};
"undefined" != typeof document && (
    /*! FPSMeter 0.3.1 - 9th May 2013 | https://github.com/Darsain/fpsmeter */
    function(t, e) {
        function s(t, e) {
            for (var n in e) try {
                t.style[n] = e[n]
            } catch (t) {}
            return t
        }

        function H(t) {
            return null == t ? String(t) : "object" == typeof t || "function" == typeof t ? Object.prototype.toString.call(t).match(/\s([a-z]+)/i)[1].toLowerCase() || "object" : typeof t
        }

        function R(t, e) {
            if ("array" !== H(e)) return -1;
            if (e.indexOf) return e.indexOf(t);
            for (var n = 0, i = e.length; n < i; n++)
                if (e[n] === t) return n;
            return -1
        }

        function I() {
            var t, e = arguments;
            for (t in e[1])
                if (e[1].hasOwnProperty(t)) switch (H(e[1][t])) {
                    case "object":
                        e[0][t] = I({}, e[0][t], e[1][t]);
                        break;
                    case "array":
                        e[0][t] = e[1][t].slice(0);
                        break;
                    default:
                        e[0][t] = e[1][t]
                }
            return 2 < e.length ? I.apply(null, [e[0]].concat(Array.prototype.slice.call(e, 2))) : e[0]
        }

        function N(t) {
            return 1 === (t = Math.round(255 * t).toString(16)).length ? "0" + t : t
        }

        function S(t, e, n, i) {
            t.addEventListener ? t[i ? "removeEventListener" : "addEventListener"](e, n, !1) : t.attachEvent && t[i ? "detachEvent" : "attachEvent"]("on" + e, n)
        }

        function D(t, e) {
            function g(t, e, n, i) {
                return h[0 | t][Math.round(Math.min((e - n) / (i - n) * C, C))]
            }

            function r() {
                O.legend.fps !== q && (O.legend.fps = q, O.legend[l] = q ? "FPS" : "ms"), v = q ? y.fps : y.duration, O.count[l] = 999 < v ? "999+" : v.toFixed(99 < v ? 0 : F.decimals)
            }

            function m() {
                for (p = n(), A < p - F.threshold && (y.fps -= y.fps / Math.max(1, 60 * F.smoothing / F.interval), y.duration = 1e3 / y.fps), w = F.history; w--;) j[w] = 0 === w ? y.fps : j[w - 1], T[w] = 0 === w ? y.duration : T[w - 1];
                if (r(), F.heat) {
                    if (M.length)
                        for (w = M.length; w--;) M[w].el.style[i[M[w].name].heatOn] = q ? g(i[M[w].name].heatmap, y.fps, 0, F.maxFps) : g(i[M[w].name].heatmap, y.duration, F.threshold, 0);
                    if (O.graph && i.column.heatOn)
                        for (w = P.length; w--;) P[w].style[i.column.heatOn] = q ? g(i.column.heatmap, j[w], 0, F.maxFps) : g(i.column.heatmap, T[w], F.threshold, 0)
                }
                if (O.graph)
                    for (b = 0; b < F.history; b++) P[b].style.height = (q ? j[b] ? Math.round(x / F.maxFps * Math.min(j[b], F.maxFps)) : 0 : T[b] ? Math.round(x / F.threshold * Math.min(T[b], F.threshold)) : 0) + "px"
            }

            function k() {
                20 > F.interval ? (c = o(k), m()) : (c = setTimeout(k, F.interval), f = o(m))
            }

            function G(t) {
                (t = t || window.event).preventDefault ? (t.preventDefault(), t.stopPropagation()) : (t.returnValue = !1, t.cancelBubble = !0), y.toggle()
            }

            function U() {
                F.toggleOn && S(O.container, F.toggleOn, G, 1), t.removeChild(O.container)
            }

            function V() {
                if (O.container && U(), i = D.theme[F.theme], !(h = i.compiledHeatmaps || []).length && i.heatmaps.length) {
                    for (b = 0; b < i.heatmaps.length; b++)
                        for (h[b] = [], w = 0; w <= C; w++) {
                            var e, n = h[b],
                                a = w;
                            e = .33 / C * w;
                            var o = i.heatmaps[b].saturation,
                                p = i.heatmaps[b].lightness,
                                c = void 0,
                                l = void 0,
                                d = void 0,
                                u = d = void 0,
                                f = c = l = void 0;
                            f = void 0;
                            0 === (d = .5 >= p ? p * (1 + o) : p + o - p * o) ? e = "#000" : (l = (d - (u = 2 * p - d)) / d, f = (e *= 6) - (c = Math.floor(e)), f *= d * l, 0 === c || 6 === c ? (c = d, l = u + f, d = u) : 1 === c ? (c = d - f, l = d, d = u) : 2 === c ? (c = u, l = d, d = u + f) : 3 === c ? (c = u, l = d - f) : 4 === c ? (c = u + f, l = u) : (c = d, l = u, d -= f), e = "#" + N(c) + N(l) + N(d)), n[a] = e
                        }
                    i.compiledHeatmaps = h
                }
                for (var v in O.container = s(document.createElement("div"), i.container), O.count = O.container.appendChild(s(document.createElement("div"), i.count)), O.legend = O.container.appendChild(s(document.createElement("div"), i.legend)), O.graph = F.graph ? O.container.appendChild(s(document.createElement("div"), i.graph)) : 0, M.length = 0, O) O[v] && i[v].heatOn && M.push({
                    name: v,
                    el: O[v]
                });
                if (P.length = 0, O.graph)
                    for (O.graph.style.width = F.history * i.column.width + (F.history - 1) * i.column.spacing + "px", w = 0; w < F.history; w++) P[w] = O.graph.appendChild(s(document.createElement("div"), i.column)), P[w].style.position = "absolute", P[w].style.bottom = 0, P[w].style.right = w * i.column.width + w * i.column.spacing + "px", P[w].style.width = i.column.width + "px", P[w].style.height = "0px";
                s(O.container, F), r(), t.appendChild(O.container), O.graph && (x = O.graph.clientHeight), F.toggleOn && ("click" === F.toggleOn && (O.container.style.cursor = "pointer"), S(O.container, F.toggleOn, G))
            }
            "object" === H(t) && undefined === t.nodeType && (e = t, t = document.body), t || (t = document.body);
            var i, h, p, c, f, x, v, w, b, y = this,
                F = I({}, D.defaults, e || {}),
                O = {},
                P = [],
                C = 100,
                M = [],
                z = F.threshold,
                E = 0,
                A = n() - z,
                j = [],
                T = [],
                q = "fps" === F.show;
            y.options = F, y.fps = 0, y.duration = 0, y.isPaused = 0, y.tickStart = function() {
                E = n()
            }, y.tick = function() {
                p = n(), z += (p - A - z) / F.smoothing, y.fps = 1e3 / z, y.duration = E < A ? z : p - E, A = p
            }, y.pause = function() {
                return c && (y.isPaused = 1, clearTimeout(c), a(c), a(f), c = f = 0), y
            }, y.resume = function() {
                return c || (y.isPaused = 0, k()), y
            }, y.set = function(t, e) {
                return F[t] = e, q = "fps" === F.show, -1 !== R(t, d) && V(), -1 !== R(t, u) && s(O.container, F), y
            }, y.showDuration = function() {
                return y.set("show", "ms"), y
            }, y.showFps = function() {
                return y.set("show", "fps"), y
            }, y.toggle = function() {
                return y.set("show", q ? "ms" : "fps"), y
            }, y.hide = function() {
                return y.pause(), O.container.style.display = "none", y
            }, y.show = function() {
                return y.resume(), O.container.style.display = "block", y
            }, y.destroy = function() {
                y.pause(), U(), y.tick = y.tickStart = function() {}
            }, V(), k()
        }
        var n, i = t.performance;
        n = i && (i.now || i.webkitNow) ? i[i.now ? "now" : "webkitNow"].bind(i) : function() {
            return +new Date
        };
        for (var a = t.cancelAnimationFrame || t.cancelRequestAnimationFrame, o = t.requestAnimationFrame, h = 0, p = 0, c = (i = ["moz", "webkit", "o"]).length; p < c && !a; ++p) o = (a = t[i[p] + "CancelAnimationFrame"] || t[i[p] + "CancelRequestAnimationFrame"]) && t[i[p] + "RequestAnimationFrame"];
        a || (o = function(e) {
            var i = n(),
                a = Math.max(0, 16 - (i - h));
            return h = i + a, t.setTimeout((function() {
                e(i + a)
            }), a)
        }, a = function(t) {
            clearTimeout(t)
        });
        var l = "string" === H(document.createElement("div").textContent) ? "textContent" : "innerText";
        D.extend = I, window.FPSMeter = D, D.defaults = {
            interval: 100,
            smoothing: 10,
            show: "fps",
            toggleOn: "click",
            decimals: 1,
            maxFps: 60,
            threshold: 100,
            position: "absolute",
            zIndex: 10,
            left: "5px",
            top: "5px",
            right: "auto",
            bottom: "auto",
            margin: "0 0 0 0",
            theme: "dark",
            heat: 0,
            graph: 0,
            history: 20
        };
        var d = ["toggleOn", "theme", "heat", "graph", "history"],
            u = "position zIndex left top right bottom margin".split(" ")
    }(window),
    function(t, e) {
        e.theme = {};
        var n = e.theme.base = {
            heatmaps: [],
            container: {
                heatOn: null,
                heatmap: null,
                padding: "5px",
                minWidth: "95px",
                height: "30px",
                lineHeight: "30px",
                textAlign: "right",
                textShadow: "none"
            },
            count: {
                heatOn: null,
                heatmap: null,
                position: "absolute",
                top: 0,
                right: 0,
                padding: "5px 10px",
                height: "30px",
                fontSize: "24px",
                fontFamily: "Consolas, Andale Mono, monospace",
                zIndex: 2
            },
            legend: {
                heatOn: null,
                heatmap: null,
                position: "absolute",
                top: 0,
                left: 0,
                padding: "5px 10px",
                height: "30px",
                fontSize: "12px",
                lineHeight: "32px",
                fontFamily: "sans-serif",
                textAlign: "left",
                zIndex: 2
            },
            graph: {
                heatOn: null,
                heatmap: null,
                position: "relative",
                boxSizing: "padding-box",
                MozBoxSizing: "padding-box",
                height: "100%",
                zIndex: 1
            },
            column: {
                width: 4,
                spacing: 1,
                heatOn: null,
                heatmap: null
            }
        };
        e.theme.dark = e.extend({}, n, {
            heatmaps: [{
                saturation: .8,
                lightness: .8
            }],
            container: {
                background: "#222",
                color: "#fff",
                border: "1px solid #1a1a1a",
                textShadow: "1px 1px 0 #222"
            },
            count: {
                heatOn: "color"
            },
            column: {
                background: "#3f3f3f"
            }
        }), e.theme.light = e.extend({}, n, {
            heatmaps: [{
                saturation: .5,
                lightness: .5
            }],
            container: {
                color: "#666",
                background: "#fff",
                textShadow: "1px 1px 0 rgba(255,255,255,.5), -1px -1px 0 rgba(255,255,255,.5)",
                boxShadow: "0 0 0 1px rgba(0,0,0,.1)"
            },
            count: {
                heatOn: "color"
            },
            column: {
                background: "#eaeaea"
            }
        }), e.theme.colorful = e.extend({}, n, {
            heatmaps: [{
                saturation: .5,
                lightness: .6
            }],
            container: {
                heatOn: "backgroundColor",
                background: "#888",
                color: "#fff",
                textShadow: "1px 1px 0 rgba(0,0,0,.2)",
                boxShadow: "0 0 0 1px rgba(0,0,0,.1)"
            },
            column: {
                background: "#777",
                backgroundColor: "rgba(0,0,0,.2)"
            }
        }), e.theme.transparent = e.extend({}, n, {
            heatmaps: [{
                saturation: .8,
                lightness: .5
            }],
            container: {
                padding: 0,
                color: "#fff",
                textShadow: "1px 1px 0 rgba(0,0,0,.5)"
            },
            count: {
                padding: "0 5px",
                height: "40px",
                lineHeight: "40px"
            },
            legend: {
                padding: "0 5px",
                height: "40px",
                lineHeight: "42px"
            },
            graph: {
                height: "40px"
            },
            column: {
                width: 5,
                background: "#999",
                heatOn: "backgroundColor",
                opacity: .5
            }
        })
    }(window, FPSMeter));
var Fps = pc.createScript("fps");
Fps.prototype.initialize = function() {
    _fps = this, this.fps = new FPSMeter({
        heat: !1,
        graph: !1
    }), this.fps.hide(), this.tiempo = 0, this.tiempoMax = 1.2, this.sumFps = 0, this.cantFps = 0, this.iniciarCalculos = !1, this.primerIntento = !0, this.rectificadores = 0, this.maxRectificadores = 1
}, Fps.prototype.ini = function() {
    this.iniciarCalculos = !0
}, Fps.prototype.update = function(t) {
    if (this.iniciarCalculos && this.rectificadores != this.maxRectificadores)
        if (this.fps.tick(), this.tiempo = this.tiempo + t, this.tiempo < this.tiempoMax) this.sumFps = this.sumFps + this.fps.fps, this.cantFps = this.cantFps + 1;
        else {
            var e = this.sumFps / this.cantFps;
            if (this.primerIntento) console.log("el promedio de fps 1 intento fue de " + e), this.primerIntento = !1, this.tiempoMax = 2;
            else {
                console.log("el promedio de fps fue de " + e), this.rectificadores = this.rectificadores + 1;
                var n = "";
                if (n = e > 45 ? "alta" : e > 33 ? "media" : e > 14 ? "mediaBaja" : "baja", calidad != n) switch (calidad = n, calidad) {
                    case "alta":
                        this.app.graphicsDevice.maxPixelRatio = window.devicePixelRatio;
                        break;
                    case "media":
                        window.devicePixelRatio > 2 ? this.app.graphicsDevice.maxPixelRatio = 2 : window.devicePixelRatio > 1.5 ? this.app.graphicsDevice.maxPixelRatio = 1.5 : this.app.graphicsDevice.maxPixelRatio = 1;
                        break;
                    case "mediaBaja":
                        window.devicePixelRatio, this.app.graphicsDevice.maxPixelRatio = 1;
                        break;
                    case "baja":
                        this.app.graphicsDevice.maxPixelRatio = .5
                }
            }
            this.sumFps = 0, this.tiempo = 0, this.cantFps = 0
        }
};
var GiroEntidad = pc.createScript("giroEntidad");
GiroEntidad.attributes.add("speed", {
    type: "number",
    default: 10
}), GiroEntidad.attributes.add("axis", {
    type: "number",
    default: 0
}), GiroEntidad.prototype.initialize = function() {}, GiroEntidad.prototype.update = function(t) {
    0 == this.axis ? this.entity.rotateLocal(t * this.speed, 0, 0) : 1 == this.axis ? this.entity.rotateLocal(0, t * this.speed, 0) : 2 == this.axis && this.entity.rotateLocal(0, 0, t * this.speed)
};
var MueveScoreHud = pc.createScript("mueveScoreHud");
MueveScoreHud.attributes.add("tipo", {
    type: "string",
    default: "",
    title: "tipo"
}), MueveScoreHud.prototype.initialize = function() {
    this.tween = null;
    var e = this.entity.getLocalPosition();
    this.origen = new pc.Vec3(e.x, e.y, e.z);
    window.innerWidth, window.innerHeight;
    isMobile.any() || (this.app.graphicsDevice.width, this.app.graphicsDevice.height);
    var t = _control.screen2D.screen.scaleBlend;
    _control.screen2D.screen.scaleBlend, _control.screen2D.screen.referenceResolution.x, _control.screen2D.screen.resolution.x, _control.screen2D.screen.referenceResolution.y, _control.screen2D.screen.resolution.y;
    this.destino = new pc.Vec3(0, 0, 0), this.entity.translateLocal(0, 0, 0)
}, MueveScoreHud.prototype.update = function(e) {}, MueveScoreHud.prototype.pone = function() {
    this.tween = this.entity.tween(this.entity.getLocalPosition()).to(this.destino, .6, pc.SineOut), this.tween.start()
}, MueveScoreHud.prototype.saca = function() {
    this.tween = this.entity.tween(this.entity.getLocalPosition()).to(this.origen, .5, pc.SineIn), this.tween.start()
};
pc.extend(pc, function() {
    var FxaaEffect = function(e) {
        var o = {
                aPosition: pc.SEMANTIC_POSITION
            },
            r = ["attribute vec2 aPosition;", "", "void main(void)", "{", "    gl_Position = vec4(aPosition, 0.0, 1.0);", "}"].join("\n"),
            a = ["precision " + e.precision + " float;", "", "uniform sampler2D uColorBuffer;", "uniform vec2 uResolution;", "", "#define FXAA_REDUCE_MIN   (1.0/128.0)", "#define FXAA_REDUCE_MUL   (1.0/8.0)", "#define FXAA_SPAN_MAX     8.0", "", "void main()", "{", "    vec3 rgbNW = texture2D( uColorBuffer, ( gl_FragCoord.xy + vec2( -1.0, -1.0 ) ) * uResolution ).xyz;", "    vec3 rgbNE = texture2D( uColorBuffer, ( gl_FragCoord.xy + vec2( 1.0, -1.0 ) ) * uResolution ).xyz;", "    vec3 rgbSW = texture2D( uColorBuffer, ( gl_FragCoord.xy + vec2( -1.0, 1.0 ) ) * uResolution ).xyz;", "    vec3 rgbSE = texture2D( uColorBuffer, ( gl_FragCoord.xy + vec2( 1.0, 1.0 ) ) * uResolution ).xyz;", "    vec4 rgbaM  = texture2D( uColorBuffer,  gl_FragCoord.xy  * uResolution );", "    vec3 rgbM  = rgbaM.xyz;", "    float opacity  = rgbaM.w;", "", "    vec3 luma = vec3( 0.299, 0.587, 0.114 );", "", "    float lumaNW = dot( rgbNW, luma );", "    float lumaNE = dot( rgbNE, luma );", "    float lumaSW = dot( rgbSW, luma );", "    float lumaSE = dot( rgbSE, luma );", "    float lumaM  = dot( rgbM,  luma );", "    float lumaMin = min( lumaM, min( min( lumaNW, lumaNE ), min( lumaSW, lumaSE ) ) );", "    float lumaMax = max( lumaM, max( max( lumaNW, lumaNE) , max( lumaSW, lumaSE ) ) );", "", "    vec2 dir;", "    dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));", "    dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));", "", "    float dirReduce = max( ( lumaNW + lumaNE + lumaSW + lumaSE ) * ( 0.25 * FXAA_REDUCE_MUL ), FXAA_REDUCE_MIN );", "", "    float rcpDirMin = 1.0 / ( min( abs( dir.x ), abs( dir.y ) ) + dirReduce );", "    dir = min( vec2( FXAA_SPAN_MAX, FXAA_SPAN_MAX), max( vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX), dir * rcpDirMin)) * uResolution;", "", "    vec3 rgbA = 0.5 * (", "        texture2D( uColorBuffer, gl_FragCoord.xy  * uResolution + dir * ( 1.0 / 3.0 - 0.5 ) ).xyz +", "        texture2D( uColorBuffer, gl_FragCoord.xy  * uResolution + dir * ( 2.0 / 3.0 - 0.5 ) ).xyz );", "", "    vec3 rgbB = rgbA * 0.5 + 0.25 * (", "        texture2D( uColorBuffer, gl_FragCoord.xy  * uResolution + dir * -0.5 ).xyz +", "        texture2D( uColorBuffer, gl_FragCoord.xy  * uResolution + dir * 0.5 ).xyz );", "", "    float lumaB = dot( rgbB, luma );", "", "    if ( ( lumaB < lumaMin ) || ( lumaB > lumaMax ) )", "    {", "        gl_FragColor = vec4( rgbA, opacity );", "    }", "    else", "    {", "        gl_FragColor = vec4( rgbB, opacity );", "    }", "}"].join("\n");
        this.fxaaShader = new pc.Shader(e, {
            attributes: o,
            vshader: r,
            fshader: a
        }), this.resolution = new Float32Array(2)
    };
    return (FxaaEffect = pc.inherits(FxaaEffect, pc.PostEffect)).prototype = pc.extend(FxaaEffect.prototype, {
        render: function(e, o, r) {
            var a = this.device,
                t = a.scope;
            this.resolution[0] = 1 / e.width, this.resolution[1] = 1 / e.height, t.resolve("uResolution").setValue(this.resolution), t.resolve("uColorBuffer").setValue(e.colorBuffer), pc.drawFullscreenQuad(a, o, this.vertexBuffer, this.fxaaShader, r)
        }
    }), {
        FxaaEffect: FxaaEffect
    }
}());
var Fxaa = pc.createScript("fxaa");
Fxaa.prototype.initialize = function() {
    this.effect = new pc.FxaaEffect(this.app.graphicsDevice);
    var e = this.entity.camera.postEffects;
    e.addEffect(this.effect), this.on("state", (function(o) {
        o ? e.addEffect(this.effect) : e.removeEffect(this.effect)
    })), this.on("destroy", (function() {
        e.removeEffect(this.effect)
    }))
};
var Parpadear = pc.createScript("parpadear");
Parpadear.attributes.add("tiempoDesaparicion", {
    type: "number",
    default: .85,
    title: "tiempoDesaparicion"
}), Parpadear.attributes.add("tiempoAparicion", {
    type: "number",
    default: .45,
    title: "tiempoAparicion"
}), Parpadear.attributes.add("autoStart", {
    type: "number",
    default: 1,
    title: "autoStart"
}), Parpadear.prototype.initialize = function() {
    this.contador = 0
}, Parpadear.prototype.update = function(t) {
    0 != this.autoStart && (this.contador = this.contador + t, this.entity.element.enabled ? this.contador > this.tiempoDesaparicion && (this.contador = 0, this.entity.element.enabled = !1) : this.entity.element.enabled || this.contador > this.tiempoAparicion && (this.contador = 0, this.entity.element.enabled = !0, 2 == this.autoStart && (this.autoStart = 0)))
};
var Ribbon = pc.createScript("ribbon");
Ribbon.attributes.add("lifetime", {
    type: "number",
    default: .5
}), Ribbon.attributes.add("xoffset", {
    type: "number",
    default: -.8
}), Ribbon.attributes.add("yoffset", {
    type: "number",
    default: 1
}), Ribbon.attributes.add("height", {
    type: "number",
    default: .4
});
var MAX_VERTICES = 600,
    VERTEX_SIZE = 4;
Ribbon.prototype.create = function(e) {
    this.timer = 0, this.node = null, this.vertices = [], this.vertexData = new Float32Array(MAX_VERTICES * VERTEX_SIZE), this.entity.model = null
}, Ribbon.prototype.initialize = function() {
    this.create();
    var e = {
            attributes: {
                aPositionAge: pc.SEMANTIC_POSITION
            },
            vshader: ["attribute vec4 aPositionAge;", "", "uniform mat4 matrix_viewProjection;", "uniform float trail_time;", "", "varying float vAge;", "", "void main(void)", "{", "    vAge = trail_time - aPositionAge.w;", "    gl_Position = matrix_viewProjection * vec4(aPositionAge.xyz, 1.0);", "}"].join("\n"),
            fshader: ["precision mediump float;", "", "varying float vAge;", "", "uniform float trail_lifetime;", "", "vec3 rainbow(float x)", "{", "float level = floor(x * 6.0);", "float r = float(level <= 2.0) + float(level > 4.0) * 0.5;", "float g = max(1.0 - abs(level - 2.0) * 0.5, 0.0);", "float b = (1.0 - (level - 4.0) * 0.5) * float(level >= 4.0);", "return vec3(255, 255, 255);", "}", "void main(void)", "{", "    gl_FragColor = vec4(rainbow(vAge / trail_lifetime), (1.0 - (vAge / trail_lifetime)) * 0.5);", "}"].join("\n")
        },
        t = new pc.Shader(this.app.graphicsDevice, e),
        i = new pc.scene.Material;
    i.shader = t, i.setParameter("trail_time", 0), i.setParameter("trail_lifetime", this.lifetime), i.cull = pc.CULLFACE_NONE, i.blend = !0, i.blendSrc = pc.BLENDMODE_SRC_ALPHA, i.blendDst = pc.BLENDMODE_ONE_MINUS_SRC_ALPHA, i.blendEquation = pc.BLENDEQUATION_ADD, i.depthWrite = !0;
    var r = new pc.VertexFormat(this.app.context.graphicsDevice, [{
            semantic: pc.SEMANTIC_POSITION,
            components: 4,
            type: pc.ELEMENTTYPE_FLOAT32
        }]),
        a = new pc.VertexBuffer(this.app.context.graphicsDevice, r, MAX_VERTICES * VERTEX_SIZE, pc.USAGE_DYNAMIC),
        o = new pc.scene.Mesh;
    o.vertexBuffer = a, o.indexBuffer[0] = null, o.primitive[0].type = pc.PRIMITIVE_TRISTRIP, o.primitive[0].base = 0, o.primitive[0].count = 0, o.primitive[0].indexed = !1;
    var s = new pc.scene.GraphNode,
        n = new pc.scene.MeshInstance(s, o, i);
    n.cull = !1, n.layer = pc.scene.LAYER_WORLD, n.updateKey(), this.entity.model = new pc.scene.Model, this.entity.model.graph = s, this.entity.model.meshInstances.push(n), this.model = this.entity.model, this.setNode(this.entity)
}, Ribbon.prototype.reset = function() {
    this.timer = 0, this.vertices = []
}, Ribbon.prototype.spawn = function() {
    var e = this.node,
        t = e.getPosition(),
        i = e.up.clone().scale(this.height),
        r = this.xoffset,
        a = this.yoffset;
    this.vertices.unshift({
        spawnTime: this.timer,
        vertexPair: [t.x + i.x * r, t.y + i.y * r, t.z + i.z * r, t.x + i.x * a, t.y + i.y * a, t.z + i.z * a]
    })
}, Ribbon.prototype.clearOld = function() {
    for (var e = this.vertices.length - 1; e >= 0; e--) {
        var t = this.vertices[e];
        if (!(this.timer - t.spawnTime >= this.lifetime)) return;
        this.vertices.pop()
    }
}, Ribbon.prototype.copyToArrayBuffer = function() {
    for (var e = 0; e < this.vertices.length; e++) {
        var t = this.vertices[e];
        this.vertexData[8 * e + 0] = t.vertexPair[0], this.vertexData[8 * e + 1] = t.vertexPair[1], this.vertexData[8 * e + 2] = t.vertexPair[2], this.vertexData[8 * e + 3] = t.spawnTime, this.vertexData[8 * e + 4] = t.vertexPair[3], this.vertexData[8 * e + 5] = t.vertexPair[4], this.vertexData[8 * e + 6] = t.vertexPair[5], this.vertexData[8 * e + 7] = t.spawnTime
    }
}, Ribbon.prototype.updateNumActive = function() {
    this.model.meshInstances[0].mesh.primitive[0].count = 2 * this.vertices.length
}, Ribbon.prototype.update = function(e) {
    if (this.timer += e, this.model.meshInstances[0].material.setParameter("trail_time", this.timer), this.clearOld(), this.spawn(), this.vertices.length > 1) {
        this.copyToArrayBuffer(), this.updateNumActive();
        var t = this.model.meshInstances[0].mesh.vertexBuffer;
        new Float32Array(t.lock()).set(this.vertexData), t.unlock(), this.app.scene.containsModel(this.model) || (console.log("Added model"), this.app.scene.addModel(this.model))
    } else this.app.scene.containsModel(this.model) && (console.log("Removed model"), this.app.scene.removeModel(this.model))
}, Ribbon.prototype.setNode = function(e) {
    this.node = e
};
var RotaObjecto = pc.createScript("rotaObjecto");
RotaObjecto.attributes.add("speed", {
    type: "number",
    default: 5
}), RotaObjecto.prototype.initialize = function() {}, RotaObjecto.prototype.update = function(t) {
    this.entity.rotateLocal(0, this.speed, 0)
};
var Shake = pc.createScript("shake");
Shake.attributes.add("cameraFake", {
    type: "entity",
    title: "cameraFake"
}), Shake.prototype.initialize = function() {
    this.timer = 0, this.shaking = !1, this.amplitude = 1, this.duration = 0, this.frequency = 10, this.x = 0, this.y = 0, this.z = 0, this.offset = new pc.Vec3, this.position = new pc.Vec3
}, Shake.prototype.reset = function() {
    this.shaking = !1, this.offset.set(0, 0, 0), vibrar = -1
}, Shake.prototype.shake = function(t, i) {
    this.shaking || (this.amplitude = t, this.duration = i, this.timer = 0, this.x = Math.random(), this.y = Math.random(), this.z = Math.random(), this.lastTargetPosition = this.entity.getLocalPosition().clone(), this.position.copy(this.entity.getLocalPosition()), this.shaking = !0)
}, Shake.prototype.update = function(t) {
    if (this.shaking) {
        var i = new pc.Vec3,
            e = this.cameraFake.getPosition().clone();
        i.copy(e);
        var s = this.getShake(t);
        if (!s) return;
        i.add(s), this.entity.setPosition(i)
    }
}, Shake.prototype.getShake = function(t) {
    if (this.shaking) {
        var i = 1 - this.timer / this.duration;
        if (this.offset.x = this.getNoise(this.x) * this.amplitude * i, this.offset.y = this.getNoise(this.y) * this.amplitude * i, this.offset.z = this.getNoise(this.z) * this.amplitude * i, this.timer += t, this.timer > this.duration) return this.reset(), !1;
        i = this.frequency * t;
        this.x += i, this.y += i, this.z += i
    } else this.offset.set(0, 0, 0);
    return this.offset
}, Shake.prototype.fade = function(t) {
    return t * t * t * (t * (6 * t - 15) + 10)
}, Shake.prototype.lerp = function(t, i, e) {
    return i + t * (e - i)
}, Shake.prototype.getNoise = function(t) {
    var i = Math.floor(t);
    t -= i;
    var e = this.fade(t),
        s = 1 & perm[i] ? t : -t,
        h = 1 & perm[i + 1] ? t - 1 : 1 - t;
    return this.lerp(e, s, h)
};
var Text = pc.createScript("text");
Text.attributes.add("text", {
    type: "string",
    default: "Hello World"
}), Text.prototype.initialize = function() {
    this.canvas = document.createElement("canvas"), this.canvas.height = 128, this.canvas.width = 512, this.context = this.canvas.getContext("2d"), this.texture = new pc.Texture(this.app.graphicsDevice, {
        format: pc.PIXELFORMAT_R8_G8_B8,
        autoMipmap: !0
    }), this.texture.setSource(this.canvas), this.texture.minFilter = pc.FILTER_LINEAR_MIPMAP_LINEAR, this.texture.magFilter = pc.FILTER_LINEAR, this.texture.addressU = pc.ADDRESS_CLAMP_TO_EDGE, this.texture.addressV = pc.ADDRESS_CLAMP_TO_EDGE, this.updateText();
    var t = this.entity.model.material;
    t.emissiveMap = this.texture, t.opacityMap = this.texture, t.blendType = pc.BLEND_NORMAL, t.update(), this.on("attr", (function(t, e, i) {
        this.updateText()
    }))
}, Text.prototype.updateText = function() {
    var t = this.context,
        e = t.canvas.width,
        i = t.canvas.height;
    t.fillStyle = "black", t.fillRect(0, 0, e, i), t.fillStyle = "white", t.font = "bold 70px Verdana", t.textAlign = "center", t.textBaseline = "middle", t.fillText(this.text, e / 2, i / 2), this.texture.upload()
};
var UISlider = pc.createScript("uiSlider");
UISlider.attributes.add("handle", {
    type: "entity",
    default: null,
    title: "Handle"
}), UISlider.attributes.add("axis", {
    type: "string",
    default: "y",
    title: "Axis",
    description: "lock drag to axis: x, y or xy"
}), UISlider.attributes.add("guiButton", {
    type: "entity"
}), UISlider.prototype.initialize = function() {
    _masse = this, this.screenX = 0, this.screenY = 0, this.forze = null, this.hitForze = 0, this.angle = 0
}, UISlider.prototype.postInitialize = function() {
    if (this.handle || (this.handle = this.entity.parent.findByName("UISliderHandle")), !this.handle) throw new Error("UISlider has no handle");
    this.addHandleListeners(), this.isDragging = !1, this.touchId = -1, this.mousePos = new pc.Vec3, this.anchorPos = this.handle.getLocalPosition().clone(), this.screen = this.getUIScreenComponent()
}, UISlider.prototype.getUIScreenComponent = function() {
    return this.handle.element.screen.screen
}, UISlider.prototype.addHandleListeners = function() {
    this.handle.element.useInput = !0, this.handle.element.on(pc.EVENT_MOUSEDOWN, this.onPressDown, this), this.app.mouse.on(pc.EVENT_MOUSEUP, this.onPressUp, this), this.app.mouse.on(pc.EVENT_MOUSEMOVE, this.onPressMove, this), isMobile.any() && (console.log("initing touches"), this.handle.element.on(pc.EVENT_TOUCHSTART, this.onTouchStart, this), this.app.touch.on(pc.EVENT_TOUCHEND, this.onTouchEnd, this), this.app.touch.on(pc.EVENT_TOUCHCANCEL, this.onTouchEnd, this), this.app.touch.on(pc.EVENT_TOUCHMOVE, this.onTouchMove, this)), this.on("destroy", (function() {
        this.handle.element.off(pc.EVENT_MOUSEDOWN, this.onPressDown, this), this.app.mouse.off(pc.EVENT_MOUSEUP, this.onPressUp, this), this.app.mouse.off(pc.EVENT_MOUSEMOVE, this.onPressMove, this), isMobile.any() && (this.handle.element.off(pc.EVENT_TOUCHSTART, this.onTouchStart, this), this.app.touch.off(pc.EVENT_TOUCHEND, this.onTouchEnd, this), this.app.touch.off(pc.EVENT_TOUCHCANCEL, this.onTouchEnd, this), this.app.touch.off(pc.EVENT_TOUCHMOVE, this.onTouchMove, this))
    }))
}, UISlider.prototype.onTouchStart = function(t) {
    var e = t.changedTouches[0];
    this.touchId = e.identifier, this.startDrag(t.x, t.y), t.event.stopPropagation()
}, UISlider.prototype.onTouchMove = function(t) {
    for (var e = 0; e < t.changedTouches.length; e++) {
        var i = t.changedTouches[e];
        if (i.id == this.touchId) return t.event.stopPropagation(), void this.updateMove(i.x, i.y)
    }
}, UISlider.prototype.onTouchEnd = function(t) {
    for (var e = 0; e < t.changedTouches.length; e++) {
        var i = t.changedTouches[e];
        if (i.id == this.touchId) return t.event.stopImmediatePropagation(), this.touchId = -1, void this.endDrag(i.x, i.y)
    }
}, UISlider.prototype.onPressDown = function(t) {
    t.event.stopImmediatePropagation(), this.startDrag(t.x, t.y)
}, UISlider.prototype.onPressUp = function(t) {
    t.event.stopImmediatePropagation(), this.endDrag(t.x, t.y)
}, UISlider.prototype.onPressMove = function(t) {
    this.updateMove(t.x, t.y), t.event.stopImmediatePropagation()
}, UISlider.prototype.startDrag = function(t, e) {
    this.isDragging = !0, this.setMouseXY(t, e), this.entity.setLocalScale(2.5, 2.5, 2.5), tocaSonido("tapWhite")
}, UISlider.prototype.updateMove = function(t, e) {
    this.isDragging && this.setMouseXY(t, e)
}, UISlider.prototype.endDrag = function(t, e) {
    this.isDragging && tocaSonido("endWhite"), this.isDragging = !1, this.setMouseXY(t, e), this.entity.setLocalScale(1, 1, 1)
}, UISlider.prototype.setMouseXY = function(t, e) {
    this.mousePos.x = t, this.mousePos.y = e
}, UISlider.prototype.update = function(t) {
    this.updateDrag()
}, UISlider.prototype.updateDrag = function() {
    if (this.isDragging) {
        var t = this.app.graphicsDevice,
            e = this.handle.element.anchor.x * t.width / window.devicePixelRatio,
            i = this.handle.element.anchor.y * t.height / window.devicePixelRatio,
            s = 1 / (this.screen.scale / window.devicePixelRatio),
            o = "x" == this.axis || "xy" == this.axis ? (this.mousePos.x - e) * s : this.anchorPos.x,
            h = "y" == this.axis || "xy" == this.axis ? (-this.mousePos.y + i) * s : this.anchorPos.y;
        console.log(o + "  ; " + h), Math.sqrt(Math.pow(o, 2) + Math.pow(h, 2)) <= 236 && (this.handle.setLocalPosition(o, h, 0), this.screenX = o, this.screenY = h, this.guiButton.setLocalPosition(.2 * o, .2 * h, 0))
    }
}, UISlider.prototype.doMasse = function(t, e) {
    if (!this.alreadyApply) {
        this.alreadyApply = !0;
        var i = this.angle,
            s = 1,
            o = 2;
        if ("ball" == e) {
            if (s = 1.8, this.screenY > 0 && (o = 1), i >= 45 && i <= 135) {
                var h = (2.7 * s - (a = 0)) / (235 - (r = 0)) * (this.screenX - r) + a,
                    n = (2.7 * o - (a = 0)) / (235 - (r = 0)) * (this.screenY - r) + a;
                setTimeout(function() {
                    t.script.p2Body.body.applyImpulseLocal([h * this.hitForze, n * this.hitForze])
                }.bind(this), 30)
            } else if (i <= -45 && i >= -135) {
                h = (-2.7 * s - (a = 0)) / (235 - (r = 0)) * (this.screenX - r) + a, n = (-2.7 * o - (a = 0)) / (235 - (r = 0)) * (this.screenY - r) + a;
                setTimeout(function() {
                    t.script.p2Body.body.applyImpulseLocal([h * this.hitForze, n * this.hitForze])
                }.bind(this), 30)
            } else if (i <= 180 && i >= 135 || i <= -135 && i >= -180) {
                h = (2.7 * s - (a = 0)) / (235 - (r = 0)) * (this.screenX - r) + a, n = (-2.7 * o - (a = 0)) / (235 - (r = 0)) * (this.screenY - r) + a;
                setTimeout(function() {
                    t.script.p2Body.body.applyImpulseLocal([n * this.hitForze, h * this.hitForze])
                }.bind(this), 30)
            } else if (i <= 45 && i >= -45) {
                h = (-2.7 * s - (a = 0)) / (235 - (r = 0)) * (this.screenX - r) + a, n = (2.7 * o - (a = 0)) / (235 - (r = 0)) * (this.screenY - r) + a;
                setTimeout(function() {
                    t.script.p2Body.body.applyImpulseLocal([n * this.hitForze, h * this.hitForze])
                }.bind(this), 30)
            }
        } else if (i >= 45 && i <= 135) {
            h = (2.7 * s - (a = 0)) / (235 - (r = 0)) * (this.screenX - r) + a, n = (-2.7 * s - (a = 0)) / (235 - (r = 0)) * (this.screenY - r) + a;
            t.script.p2Body.body.applyImpulseLocal([h * this.hitForze, n * this.hitForze])
        } else if (i <= -45 && i >= -135) {
            h = (-2.7 * s - (a = 0)) / (235 - (r = 0)) * (this.screenX - r) + a, n = (2.7 * s - (a = 0)) / (235 - (r = 0)) * (this.screenY - r) + a;
            t.script.p2Body.body.applyImpulseLocal([h * this.hitForze, n * this.hitForze])
        } else if (i <= 180 && i >= 135 || i <= -135 && i >= -180) {
            h = (2.7 * s - (a = 0)) / (235 - (r = 0)) * (this.screenX - r) + a, n = (2.7 * s - (a = 0)) / (235 - (r = 0)) * (this.screenY - r) + a;
            t.script.p2Body.body.applyImpulseLocal([n * this.hitForze, h * this.hitForze])
        } else if (i <= 45 && i >= -45) {
            var r, a;
            h = (-2.7 * s - (a = 0)) / (235 - (r = 0)) * (this.screenX - r) + a, n = (-2.7 * s - (a = 0)) / (235 - (r = 0)) * (this.screenY - r) + a;
            t.script.p2Body.body.applyImpulseLocal([n * this.hitForze, h * this.hitForze])
        }
        this.resetMasse()
    }
}, UISlider.prototype.configMasse = function(t, e) {
    this.alreadyApply = !1, this.hitForze = e, this.forze = t, this.forze.normalize(), this.angle = Math.atan2(this.forze.y, this.forze.x), this.angle = 180 * this.angle / Math.PI, console.log(this.angle)
}, UISlider.prototype.resetMasse = function() {
    this.handle.setLocalPosition(0, 0, 0), this.screenX = 0, this.screenY = 0, this.guiButton.setLocalPosition(0, 0, 0)
};
pc.extend(pc, function() {
        var TweenManager = function(t) {
            this._app = t, this._tweens = [], this._add = []
        };
        TweenManager.prototype = {
            add: function(t) {
                return this._add.push(t), t
            },
            update: function(t) {
                for (var i = 0, e = this._tweens.length; i < e;) this._tweens[i].update(t) ? i++ : (this._tweens.splice(i, 1), e--);
                if (this._add.length) {
                    for (let t = 0; t < this._add.length; t++) this._tweens.indexOf(this._add[t]) > -1 || this._tweens.push(this._add[t]);
                    this._add.length = 0
                }
            }
        };
        var Tween = function(t, i, e) {
                pc.events.attach(this), this.manager = i, e && (this.entity = null), this.time = 0, this.complete = !1, this.playing = !1, this.stopped = !0, this.pending = !1, this.target = t, this.duration = 0, this._currentDelay = 0, this.timeScale = 1, this._reverse = !1, this._delay = 0, this._yoyo = !1, this._count = 0, this._numRepeats = 0, this._repeatDelay = 0, this._from = !1, this._slerp = !1, this._fromQuat = new pc.Quat, this._toQuat = new pc.Quat, this._quat = new pc.Quat, this.easing = pc.Linear, this._sv = {}, this._ev = {}
            },
            _parseProperties = function(t) {
                var i;
                return t instanceof pc.Vec2 ? i = {
                    x: t.x,
                    y: t.y
                } : t instanceof pc.Vec3 ? i = {
                    x: t.x,
                    y: t.y,
                    z: t.z
                } : t instanceof pc.Vec4 || t instanceof pc.Quat ? i = {
                    x: t.x,
                    y: t.y,
                    z: t.z,
                    w: t.w
                } : t instanceof pc.Color ? (i = {
                    r: t.r,
                    g: t.g,
                    b: t.b
                }, void 0 !== t.a && (i.a = t.a)) : i = t, i
            };
        Tween.prototype = {
            to: function(t, i, e, s, n, r) {
                return this._properties = _parseProperties(t), this.duration = i, e && (this.easing = e), s && this.delay(s), n && this.repeat(n), r && this.yoyo(r), this
            },
            from: function(t, i, e, s, n, r) {
                return this._properties = _parseProperties(t), this.duration = i, e && (this.easing = e), s && this.delay(s), n && this.repeat(n), r && this.yoyo(r), this._from = !0, this
            },
            rotate: function(t, i, e, s, n, r) {
                return this._properties = _parseProperties(t), this.duration = i, e && (this.easing = e), s && this.delay(s), n && this.repeat(n), r && this.yoyo(r), this._slerp = !0, this
            },
            start: function() {
                var t, i, e, s;
                if (this.playing = !0, this.complete = !1, this.stopped = !1, this._count = 0, this.pending = this._delay > 0, this._reverse && !this.pending ? this.time = this.duration : this.time = 0, this._from) {
                    for (t in this._properties) this._properties.hasOwnProperty(t) && (this._sv[t] = this._properties[t], this._ev[t] = this.target[t]);
                    this._slerp && (this._toQuat.setFromEulerAngles(this.target.x, this.target.y, this.target.z), i = void 0 !== this._properties.x ? this._properties.x : this.target.x, e = void 0 !== this._properties.y ? this._properties.y : this.target.y, s = void 0 !== this._properties.z ? this._properties.z : this.target.z, this._fromQuat.setFromEulerAngles(i, e, s))
                } else {
                    for (t in this._properties) this._properties.hasOwnProperty(t) && (this._sv[t] = this.target[t], this._ev[t] = this._properties[t]);
                    this._slerp && (i = void 0 !== this._properties.x ? this._properties.x : this.target.x, e = void 0 !== this._properties.y ? this._properties.y : this.target.y, s = void 0 !== this._properties.z ? this._properties.z : this.target.z, void 0 !== this._properties.w ? (this._fromQuat.copy(this.target), this._toQuat.set(i, e, s, this._properties.w)) : (this._fromQuat.setFromEulerAngles(this.target.x, this.target.y, this.target.z), this._toQuat.setFromEulerAngles(i, e, s)))
                }
                return this._currentDelay = this._delay, this.manager.add(this), this
            },
            pause: function() {
                this.playing = !1
            },
            resume: function() {
                this.playing = !0
            },
            stop: function() {
                this.playing = !1, this.stopped = !0
            },
            delay: function(t) {
                return this._delay = t, this.pending = !0, this
            },
            repeat: function(t, i) {
                return this._count = 0, this._numRepeats = t, this._repeatDelay = i || 0, this
            },
            loop: function(t) {
                return t ? (this._count = 0, this._numRepeats = 1 / 0) : this._numRepeats = 0, this
            },
            yoyo: function(t) {
                return this._yoyo = t, this
            },
            reverse: function() {
                return this._reverse = !this._reverse, this
            },
            chain: function() {
                for (var t = arguments.length; t--;) t > 0 ? arguments[t - 1]._chained = arguments[t] : this._chained = arguments[t];
                return this
            },
            onUpdate: function(t) {
                return this.on("update", t), this
            },
            onComplete: function(t) {
                return this.on("complete", t), this
            },
            onLoop: function(t) {
                return this.on("loop", t), this
            },
            update: function(t) {
                if (this.stopped) return !1;
                if (!this.playing) return !0;
                if (!this._reverse || this.pending ? this.time += t * this.timeScale : this.time -= t * this.timeScale, this.pending) {
                    if (!(this.time > this._currentDelay)) return !0;
                    this._reverse ? this.time = this.duration - (this.time - this._currentDelay) : this.time -= this._currentDelay, this.pending = !1
                }
                var i = 0;
                (!this._reverse && this.time > this.duration || this._reverse && this.time < 0) && (this._count++, this.complete = !0, this.playing = !1, this._reverse ? (i = this.duration - this.time, this.time = 0) : (i = this.time - this.duration, this.time = this.duration));
                var e, s, n = 0 === this.duration ? 1 : this.time / this.duration,
                    r = this.easing(n);
                for (var h in this._properties) this._properties.hasOwnProperty(h) && (e = this._sv[h], s = this._ev[h], this.target[h] = e + (s - e) * r);
                if (this._slerp && this._quat.slerp(this._fromQuat, this._toQuat, r), this.entity && (this.entity._dirtifyLocal(), this.element && this.entity.element && (this.entity.element[this.element] = this.target), this._slerp && this.entity.setLocalRotation(this._quat)), this.fire("update", t), this.complete) {
                    var a = this._repeat(i);
                    return a ? this.fire("loop") : (this.fire("complete", i), this.entity && this.entity.off("destroy", this.stop, this), this._chained && this._chained.start()), a
                }
                return !0
            },
            _repeat: function(t) {
                if (this._count < this._numRepeats) {
                    if (this._reverse ? this.time = this.duration - t : this.time = t, this.complete = !1, this.playing = !0, this._currentDelay = this._repeatDelay, this.pending = !0, this._yoyo) {
                        for (var i in this._properties) {
                            var e = this._sv[i];
                            this._sv[i] = this._ev[i], this._ev[i] = e
                        }
                        this._slerp && (this._quat.copy(this._fromQuat), this._fromQuat.copy(this._toQuat), this._toQuat.copy(this._quat))
                    }
                    return !0
                }
                return !1
            }
        };
        var BounceOut = function(t) {
                return t < 1 / 2.75 ? 7.5625 * t * t : t < 2 / 2.75 ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : t < 2.5 / 2.75 ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375
            },
            BounceIn = function(t) {
                return 1 - BounceOut(1 - t)
            };
        return {
            TweenManager: TweenManager,
            Tween: Tween,
            Linear: function(t) {
                return t
            },
            QuadraticIn: function(t) {
                return t * t
            },
            QuadraticOut: function(t) {
                return t * (2 - t)
            },
            QuadraticInOut: function(t) {
                return (t *= 2) < 1 ? .5 * t * t : -.5 * (--t * (t - 2) - 1)
            },
            CubicIn: function(t) {
                return t * t * t
            },
            CubicOut: function(t) {
                return --t * t * t + 1
            },
            CubicInOut: function(t) {
                return (t *= 2) < 1 ? .5 * t * t * t : .5 * ((t -= 2) * t * t + 2)
            },
            QuarticIn: function(t) {
                return t * t * t * t
            },
            QuarticOut: function(t) {
                return 1 - --t * t * t * t
            },
            QuarticInOut: function(t) {
                return (t *= 2) < 1 ? .5 * t * t * t * t : -.5 * ((t -= 2) * t * t * t - 2)
            },
            QuinticIn: function(t) {
                return t * t * t * t * t
            },
            QuinticOut: function(t) {
                return --t * t * t * t * t + 1
            },
            QuinticInOut: function(t) {
                return (t *= 2) < 1 ? .5 * t * t * t * t * t : .5 * ((t -= 2) * t * t * t * t + 2)
            },
            SineIn: function(t) {
                return 0 === t ? 0 : 1 === t ? 1 : 1 - Math.cos(t * Math.PI / 2)
            },
            SineOut: function(t) {
                return 0 === t ? 0 : 1 === t ? 1 : Math.sin(t * Math.PI / 2)
            },
            SineInOut: function(t) {
                return 0 === t ? 0 : 1 === t ? 1 : .5 * (1 - Math.cos(Math.PI * t))
            },
            ExponentialIn: function(t) {
                return 0 === t ? 0 : Math.pow(1024, t - 1)
            },
            ExponentialOut: function(t) {
                return 1 === t ? 1 : 1 - Math.pow(2, -10 * t)
            },
            ExponentialInOut: function(t) {
                return 0 === t ? 0 : 1 === t ? 1 : (t *= 2) < 1 ? .5 * Math.pow(1024, t - 1) : .5 * (2 - Math.pow(2, -10 * (t - 1)))
            },
            CircularIn: function(t) {
                return 1 - Math.sqrt(1 - t * t)
            },
            CircularOut: function(t) {
                return Math.sqrt(1 - --t * t)
            },
            CircularInOut: function(t) {
                return (t *= 2) < 1 ? -.5 * (Math.sqrt(1 - t * t) - 1) : .5 * (Math.sqrt(1 - (t -= 2) * t) + 1)
            },
            BackIn: function(t) {
                var i = 1.70158;
                return t * t * ((i + 1) * t - i)
            },
            BackOut: function(t) {
                var i = 1.70158;
                return --t * t * ((i + 1) * t + i) + 1
            },
            BackInOut: function(t) {
                var i = 2.5949095;
                return (t *= 2) < 1 ? t * t * ((i + 1) * t - i) * .5 : .5 * ((t -= 2) * t * ((i + 1) * t + i) + 2)
            },
            BounceIn: BounceIn,
            BounceOut: BounceOut,
            BounceInOut: function(t) {
                return t < .5 ? .5 * BounceIn(2 * t) : .5 * BounceOut(2 * t - 1) + .5
            },
            ElasticIn: function(t) {
                var i, e = .1;
                return 0 === t ? 0 : 1 === t ? 1 : (!e || e < 1 ? (e = 1, i = .1) : i = .4 * Math.asin(1 / e) / (2 * Math.PI), -e * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - i) * (2 * Math.PI) / .4))
            },
            ElasticOut: function(t) {
                var i, e = .1;
                return 0 === t ? 0 : 1 === t ? 1 : (!e || e < 1 ? (e = 1, i = .1) : i = .4 * Math.asin(1 / e) / (2 * Math.PI), e * Math.pow(2, -10 * t) * Math.sin((t - i) * (2 * Math.PI) / .4) + 1)
            },
            ElasticInOut: function(t) {
                var i, e = .1,
                    s = .4;
                return 0 === t ? 0 : 1 === t ? 1 : (!e || e < 1 ? (e = 1, i = .1) : i = s * Math.asin(1 / e) / (2 * Math.PI), (t *= 2) < 1 ? e * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - i) * (2 * Math.PI) / s) * -.5 : e * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - i) * (2 * Math.PI) / s) * .5 + 1)
            }
        }
    }()),
    function() {
        pc.AppBase.prototype.addTweenManager = function() {
            this._tweenManager = new pc.TweenManager(this), this.on("update", (function(t) {
                this._tweenManager.update(t)
            }))
        }, pc.AppBase.prototype.tween = function(t) {
            return new pc.Tween(t, this._tweenManager)
        }, pc.Entity.prototype.tween = function(t, i) {
            var e = this._app.tween(t);
            return e.entity = this, this.once("destroy", e.stop, e), i && i.element && (e.element = i.element), e
        };
        var t = pc.AppBase.getApplication();
        t && t.addTweenManager()
    }();
var TriggerGol = pc.createScript("triggerGol");
TriggerGol.attributes.add("tipo", {
    type: "string",
    default: ""
}), TriggerGol.attributes.add("arco", {
    type: "entity",
    title: "arco"
}), TriggerGol.prototype.initialize = function() {
    this.entity.collision.on("triggerenter", this.onTriggerEnter, this), this.pelota = this.app.root.findByName("pelota")
}, TriggerGol.prototype.onTriggerEnter = function(e) {
    switch (this.tipo) {
        case "redAtrasT":
        case "redArribaT":
        case "redDerT":
        case "redIzqT":
            switch (efecto = !1, permitirTrail = !1, this.pelota.script.bolaControl.mataTrail(), this.tipo) {
                case "redAtrasT":
                    reproduceAnim(this.arco, 2);
                    break;
                case "redDerT":
                    reproduceAnim(this.arco, 3);
                    break;
                case "redIzqT":
                    reproduceAnim(this.arco, 1)
            }
            if ("redDerT" != this.tipo && "redIzqT" != this.tipo || (this.pelota.rigidbody.linearVelocity = new pc.Vec3(0, 0, 0)), 1 == (i = _control.screen2D.findByName("lifesAnim")).script.animaMsg.enReproduccion || turnoAcabado) return;
            if (esGol && !aplausos) {
                if (sinBlancos) {
                    if (null == (a = _control.screen2D.findByName("extraLifeAnim")).script.animaMsg.enReproduccion || !a.script.animaMsg.enReproduccion)(i = _control.screen2D.findByName("goalAnimStar")).enabled = !0, i.script.animaTexturas.inicioAnim(), i.script.animaMsg.poneYSaca();
                    _control.shaker.shake(.3, .4)
                } else {
                    if (_control.poneMensaje(3), _control.setScore(golSCore), sinBlancos = !0, null == (a = _control.screen2D.findByName("extraLifeAnim")).script.animaMsg.enReproduccion || !a.script.animaMsg.enReproduccion)(i = _control.screen2D.findByName("goalAnim")).enabled = !0, i.script.animaTexturas.inicioAnim(), i.script.animaMsg.poneYSaca();
                    _control.shaker.shake(.3, .4)
                }
                tocaSonido("publico"), aplausos = !0, tocaSonido("gol"), sonidoGol = !0
            } else if (!sonidoGol && (tocaSonido("gol"), sinBlancos = !0, sonidoGol = !0, esGol))
                if (sinBlancos) {
                    if (null == (a = _control.screen2D.findByName("extraLifeAnim")).script.animaMsg.enReproduccion || !a.script.animaMsg.enReproduccion)(i = _control.screen2D.findByName("goalAnimStar")).enabled = !0, i.script.animaTexturas.inicioAnim(), i.script.animaMsg.poneYSaca();
                    _control.shaker.shake(.3, .4)
                } else {
                    var a, i;
                    if (_control.poneMensaje(3), _control.setScore(golSCore), sinBlancos = !0, null == (a = _control.screen2D.findByName("extraLifeAnim")).script.animaMsg.enReproduccion || !a.script.animaMsg.enReproduccion)(i = _control.screen2D.findByName("goalAnim")).enabled = !0, i.script.animaTexturas.inicioAnim(), i.script.animaMsg.poneYSaca();
                    _control.shaker.shake(.3, .4)
                } break;
        case "paloIzqT":
        case "paloDerT":
        case "travesanoT":
            if (0 == bolaLanzada) return;
            if (esGol) return;
            efecto = !1, tocaSonido("palo"), permitirTrail = !1, this.pelota.script.bolaControl.mataTrail(), _control.shaker.shake(.33, .45), vibrar = !0, palo = !0;
            break;
        case "arqueroColiderT":
            if (1 == bolaLanzada) {
                if (!_control.arquero.enabled) return;
                efecto = !1;
                var r = Math.ceil(3 * Math.random());
                tocaSonido("arqueroAtaja" + r), this.app.systems.rigidbody.gravity = new pc.Vec3(0, -9.8, 0), this.pelota.rigidbody.angularVelocity = new pc.Vec3(0, 0, 0), this.pelota.rigidbody.linearVelocity = new pc.Vec3(0, 0, 0), this.pelota.rigidbody.applyImpulse(0, 0, 2), arqueroAtajo = !0, permitirTrail = !1, this.pelota.script.bolaControl.mataTrail()
            }
            break;
        case "canchaT":
            1 == bolaLanzada && efecto && (efecto = !1, permitirTrail = !1, this.pelota.script.bolaControl.mataTrail(), tocaSonido("arqueroAtaja3"), this.app.systems.rigidbody.gravity = new pc.Vec3(0, -9.8, 0));
            break;
        case "izq":
        case "izq2":
        case "der":
        case "der2":
        case "centro":
            "" == arqueroAtaja && (arqueroAtaja = this.tipo);
            break;
        case "blanco":
            this.entity.parent.script.blanco.tocado();
            break;
        case "barrera":
            r = Math.ceil(3 * Math.random());
            tocaSonido("arqueroAtaja" + r), efecto = !1, this.app.systems.rigidbody.gravity = new pc.Vec3(0, -2, 0), this.pelota.rigidbody.angularVelocity = new pc.Vec3(0, 0, 0), this.pelota.rigidbody.linearVelocity = new pc.Vec3(0, 0, 0), this.pelota.rigidbody.applyImpulse(0, 0, 2), hitBarrera = !0, permitirTrail = !1, this.pelota.script.bolaControl.mataTrail()
    }
};
var _sound, isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i)
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i)
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i)
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i)
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i)
        },
        any: function() {
            return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()
        }
    },
    bajarVelocidadChico = !1,
    bajarVelocidadMedio = !1,
    bajarVelocidadGrande = !1,
    esTunel = !1,
    noLimitar = !1,
    muteValMusic = 0,
    muteValSound = 0,
    _app = null,
    tutorialEnabled = !0,
    currentMusic = null,
    currentMusicVolume = [],
    tutorialMostrado = 0,
    gemas = 0,
    musicaAsset = null,
    musicaAssetx2 = null,
    musicaAssetx3 = null,
    musicaJugada = -1,
    hiloParticulas = [],
    prefix = "google_fullSpeedRacerV3_2";
currentMusicVolume.Music1 = .5, currentMusicVolume.menuMusic = .6, currentMusicVolume.pocoTiempo = 1, currentMusicVolume.loopPlaya = 1, currentMusicVolume.Music2 = .5, currentMusicVolume.Music3 = .5, currentMusicVolume.prev5 = 1, currentMusicVolume.prev6 = 1, currentMusicVolume.prev7 = 1, currentMusicVolume.prev8 = 1, currentMusicVolume.song1 = .7, currentMusicVolume.song2 = .7, currentMusicVolume.song3 = .7, currentMusicVolume.song4 = .7, currentMusicVolume.song5 = .7, currentMusicVolume.song6 = .7, currentMusicVolume.song7 = .7, currentMusicVolume.song8 = .7, currentMusicVolume.song9 = .7, currentMusicVolume.song10 = .7, currentMusicVolume.song11 = .7, currentMusicVolume.song12 = .7;
var delays = [500, 1e3, 2e3, 2500, 3e3, 3500];

function RayCast(e, o, s) {
    var a = o.screenToWorld(e.x, e.y, o.nearClip),
        r = o.screenToWorld(e.x, e.y, o.farClip),
        t = s.systems.rigidbody.raycastFirst(a, r);
    return t ? t.entity : null
}

function GetMouseGlobalPosition(e, o, s) {
    var a = o.screenToWorld(e.x, e.y, o.nearClip),
        r = o.screenToWorld(e.x, e.y, o.farClip),
        t = s.systems.rigidbody.raycastFirst(a, r);
    return t || null
}

function GetMouseFloorPosition(e, o, s) {
    var a = o.screenToWorld(e.x, e.y, o.nearClip),
        r = o.screenToWorld(e.x, e.y, o.farClip);
    return result = s.systems.rigidbody.raycastFiltered(a, r, PhysicsFilter.A, PhysicsFilter.A), result || null
}

function reproduceAnim(e, o, s, a, r, t) {
    null != s && (e.animation.speed = s);
    var u = e.animation.assets[o],
        n = e.animation.animationsIndex[u];
    e.animation.play(n), e.animation.loop = !!t, a && setTimeout((function() {
        e.enabled = !1
    }), r)
}

function reproduceParticulas(e, o) {
    clearInterval(hiloParticulas[e.name]);
    var s = e;
    s.enabled = !0, s.particlesystem.reset(), s.particlesystem.play(), hiloParticulas[e.name] = setInterval((function() {
        s.enabled = !1
    }), o)
}

function addEventFunction(e, o, s, a) {
    var r = [];
    switch (null != e.element && (e = e.element), s) {
        case 1:
            r[0] = "touchstart", r[1] = "mousedown";
            break;
        case 2:
            r[0] = "touchend", r[1] = "mouseup";
            break;
        case 3:
            r[0] = "touchmove", r[1] = "mousemove"
    }
    o ? isMobile.any() ? e.on(r[0], a) : e.on(r[1], a) : isMobile.any() ? e.off(r[0], a) : e.off(r[1], a)
}

function setTexto(e, o) {
    e.text = o
}

function guarda_vars(e, o, s, a, r, t, u, n) {
    s ? 1 == a ? e[r] = o : 2 == a ? e[r][t] = o : 3 == a ? e[r][t][u] = o : 4 == a && (e[r][t][u][n] = o) : e = o
}

function cargaTextura(e, o, s) {
    _app.loader.getHandler("texture").crossOrigin = "anonymous";
    var a = new pc.Asset("foto" + Math.round(1e3 * Math.random()), "texture", {
        url: e
    });
    _app.assets.add(a), _app.assets.load(a), a.on("load", (function(e) {
        if (s)
            for (var a = o.model.meshInstances, r = 0; r < a.length; ++r) {
                var t = a[r];
                t.material.diffuseMap = e.resource, t.material.emissiveMap = e.resource, t.material.update()
            } else o.element.textureAsset = e, o.enabled = !0
    }))
}

function getTexture(e) {
    var o = new pc.gfx.Texture(_app.graphicsDevice),
        s = new Image;
    return s.onload = function() {
        o.minFilter = pc.gfx.FILTER_LINEAR, o.magFilter = pc.gfx.FILTER_LINEAR, o.addressU = pc.ADDRESS_REPEAT, o.addressV = pc.ADDRESS_REPEAT, o.setSource(s)
    }, s.src = e, o
}

function cambiaTextura3D(e, o) {
    for (var s = o.model.meshInstances, a = 0; a < s.length; ++a) {
        var r = s[a];
        r.material.diffuseMap = e, r.material.emissiveMap = e, r.material.update()
    }
}

function cargaMusica(e, o, s) {
    if (null == musicaAsset || musicaJugada != o)
        if (null != musicaAsset && (musicaAsset.unload(), musicaAsset = null, musicaJugada = -1, null != musicaAssetx2 && (musicaAssetx2.unload(), musicaAssetx2 = null), null != musicaAssetx3 && (musicaAssetx3.unload(), musicaAssetx3 = null)), o <= 4) e = e + "song" + o + ".mp3", console.log("intentando cargar URL " + e), _app.assets.loadFromUrl(e, "audio", (function(e, a) {
            console.log("cargado!"), musicaAsset = a, _musicas.slot("song" + o).asset = a, musicaJugada = o, null != s && s()
        }));
        else {
            var a = 0,
                r = e + "song" + o + ".mp3";
            console.log("intentando cargar URL " + r), _app.assets.loadFromUrl(r, "audio", (function(e, r) {
                musicaAsset = r, _musicas.slot("song" + o).asset = r, musicaJugada = o, a += 1, console.log("cargada la muscia " + r.name), 3 == a && null != s && s()
            }));
            var t = e + "song" + (o - 4) + ".mp3";
            console.log("intentando cargar URL " + t), _app.assets.loadFromUrl(t, "audio", (function(e, r) {
                musicaAsset = r, _musicas.slot("song" + (o - 4)).asset = r, a += 1, console.log("cargada la muscia " + r.name), 3 == a && null != s && s()
            }));
            var u = e + "song" + (o + 4) + ".mp3";
            console.log("intentando cargar URL " + u), _app.assets.loadFromUrl(u, "audio", (function(e, r) {
                musicaAsset = r, _musicas.slot("song" + (o + 4)).asset = r, a += 1, console.log("cargada la muscia " + r.name), 3 == a && null != s && s()
            }))
        }
    else s()
}

function playSound(e, o) {
    o ? (currentMusic = e, _sound.play(e), 1 == muteValMusic && (_sonidos.slot("menuMusic").volume = 1e-4, _sonidos.slot("Music1").volume = 1e-4, _sonidos.slot("Music2").volume = 1e-4, _sonidos.slot("Music3").volume = 1e-4)) : "cassete" == e ? 0 == muteValMusic && _sound.play(e) : 0 == muteValSound && _sound.play(e)
}

function stopSound(e) {
    _sound.slot(e).stop()
}

function soundIsPlaying(e) {
    return _sound.slot(e).isPlaying
}

function muteMusic() {
    null != currentMusic && (console.log("le pondre volumen 0 al slot " + currentMusic), _sound.slot(currentMusic).volume = 0)
}

function unmuteMusic() {
    null != currentMusic && (_sound.slot(currentMusic).volume = currentMusicVolume[currentMusic], console.log("le pondre volumen " + currentMusicVolume[currentMusic] + " al slot " + currentMusic))
}

function mutear(e, o) {
    "music" == o ? (muteValMusic = e, 1 == e ? (_sonidos.slot("menuMusic").volume = 1e-4, _sonidos.slot("Music1").volume = 1e-4, _sonidos.slot("Music2").volume = 1e-4, _sonidos.slot("Music3").volume = 1e-4, _sonidos.slot("pocoTiempo").volume = 1e-4, _sonidos.slot("loopPlaya").volume = 1e-4) : (_sonidos.slot("menuMusic").volume = currentMusicVolume.menuMusic, _sonidos.slot("Music1").volume = currentMusicVolume.Music1, _sonidos.slot("Music2").volume = currentMusicVolume.Music2, _sonidos.slot("Music3").volume = currentMusicVolume.Music3, _sonidos.slot("pocoTiempo").volume = currentMusicVolume.pocoTiempo, _sonidos.slot("loopPlaya").volume = currentMusicVolume.loopPlaya)) : "sound" == o && (muteValSound = e)
}

function guardaVars(e, o) {
    if (enGoogle) GameSnacks.storage.setItem(prefix + o, e);
    else {
        if (!supports_html5_storage()) return !1;
        localStorage.setItem(prefix + o, e)
    }
}

function cargaVars(e) {
    return enGoogle || supports_html5_storage() ? enGoogle ? GameSnacks.storage.getItem(prefix + e) : localStorage.getItem(prefix + e) : 0
}

function existeVars(e) {
    if (e = prefix + e, !enGoogle) return !!supports_html5_storage() && localStorage.hasOwnProperty(e);
    var o = GameSnacks.storage.getItem(e);
    return null != o && null != o && "" != o
}

function guardaAllVars() {
    guardaVars(JSON.stringify(autosData), "autosData"), guardaVars(JSON.stringify(colorData), "colorData"), guardaVars(JSON.stringify(colorElegido), "colorElegido"), guardaVars(bestScore, "bestScore"), guardaVars(controlDefaultType, "controlDefaultType"), guardaVars(monedas, "monedas"), guardaVars(autoElegido, "autoElegido"), guardaVars(tutorialMostrado, "tutorialMostrado")
}

function getAllVars() {
    existeVars("autosData") && (autosData = JSON.parse(cargaVars("autosData"))), existeVars("colorData") && (colorData = JSON.parse(cargaVars("colorData"))), existeVars("monedas") ? monedas = parseInt(cargaVars("monedas")) : monedas = 0, existeVars("bestScore") ? bestScore = parseInt(cargaVars("bestScore")) : bestScore = 0, existeVars("autoElegido") ? autoElegido = parseInt(cargaVars("autoElegido")) : autoElegido = 0, existeVars("colorElegido") ? colorElegido = JSON.parse(cargaVars("colorElegido")) : colorElegido = [0, 0, 0, 0, 0, 0], tutorialMostrado = existeVars("tutorialMostrado") ? parseInt(cargaVars("tutorialMostrado")) : 0, existeVars("controlDefaultType") ? controlDefaultType = parseInt(cargaVars("controlDefaultType")) : controlDefaultType = 0, cheat && (monedas = 99999)
}

function shake(e) {
    window.navigator && window.navigator.vibrate && navigator.vibrate(e)
}

function supports_html5_storage() {
    try {
        return "localStorage" in window && null !== window.localStorage
    } catch (e) {
        return !1
    }
}

function noEsNull(e) {
    return "transparente" != e && (null != e && "" != e)
}

function fromToRotation(e, o) {
    var s = new pc.Quat,
        a = e.dot(o);
    if (k = Math.sqrt(e.lengthSq() * o.lengthSq()), a / k == -1) {
        s.w = 0;
        var r = orthogonal(e).normalize();
        return s.x = r.x, s.y = r.y, s.z = r.z, s
    }
    s.w = a + k;
    var t = (new pc.Vec3).cross(e, o);
    return s.x = t.x, s.y = t.y, s.z = t.z, s.normalize()
}

function orthogonal(e) {
    var o = Math.abs(e.x),
        s = Math.abs(e.y),
        a = Math.abs(e.z),
        r = o < s ? o < a ? pc.Vec3.RIGHT : pc.Vec3.FORWARD : s < a ? pc.Vec3.UP : pc.Vec3.FORWARD;
    return (new pc.Vec3).cross(e, r)
}
var AutoControl = pc.createScript("autoControl");
AutoControl.attributes.add("alturaMax", {
    type: "number",
    default: 5
}), AutoControl.attributes.add("distanceCarGround", {
    type: "number",
    default: 0
}), AutoControl.attributes.add("rayoT", {
    type: "entity"
}), AutoControl.attributes.add("ruedaTDer", {
    type: "entity"
}), AutoControl.attributes.add("ruedaTBackDer", {
    type: "entity"
}), AutoControl.attributes.add("ruedaTIzq", {
    type: "entity"
}), AutoControl.attributes.add("ruedaTBackIzq", {
    type: "entity"
}), AutoControl.attributes.add("ruedaTDerGiro", {
    type: "entity"
}), AutoControl.attributes.add("ruedaTIzqGiro", {
    type: "entity"
}), AutoControl.attributes.add("luzFreno", {
    type: "entity"
}), AutoControl.attributes.add("colider", {
    type: "entity"
}), AutoControl.attributes.add("skybox", {
    type: "entity"
}), AutoControl.attributes.add("carroseria", {
    type: "entity"
}), AutoControl.attributes.add("glow_auto", {
    type: "entity"
}), AutoControl.attributes.add("arrayPuntos", {
    type: "entity",
    array: !0
}), AutoControl.attributes.add("sombraAuto", {
    type: "entity"
}), AutoControl.attributes.add("maxSpeed", {
    type: "number",
    default: 62.5
}), AutoControl.attributes.add("gravedad", {
    type: "number",
    default: 9.8
}), AutoControl.attributes.add("speed", {
    type: "number",
    default: 0
}), AutoControl.attributes.add("speedGiro", {
    type: "number",
    default: 32.033
}), AutoControl.attributes.add("speedGiroStunt", {
    type: "number",
    default: 35
}), AutoControl.attributes.add("speedEnDerrape", {
    type: "number",
    default: .3
}), AutoControl.attributes.add("contenedorCamara", {
    type: "entity"
}), AutoControl.attributes.add("camara", {
    type: "entity"
}), AutoControl.attributes.add("camaraSkyBox", {
    type: "entity"
}), AutoControl.attributes.add("pivoteCamaraAdAt", {
    type: "entity"
}), AutoControl.attributes.add("pivoteCamara", {
    type: "entity"
}), AutoControl.attributes.add("aceleradaIni", {
    type: "number",
    default: 3.43
}), AutoControl.attributes.add("aceleradaMid", {
    type: "number",
    default: 1.75
}), AutoControl.attributes.add("aceleradaEnd", {
    type: "number",
    default: .84
}), AutoControl.attributes.add("speedFrenado", {
    type: "number",
    default: -6.2
}), AutoControl.attributes.add("autoMotoDerrape", {
    type: "entity"
}), AutoControl.attributes.add("autoMotoGiro", {
    type: "entity"
}), AutoControl.attributes.add("vibrato", {
    type: "entity"
}), AutoControl.attributes.add("vibratoFlag", {
    type: "number",
    default: 1
}), AutoControl.attributes.add("vibratoLimite", {
    type: "number",
    default: 1.5
}), AutoControl.attributes.add("limiteRuedaGiro", {
    type: "number",
    default: 40
}), AutoControl.attributes.add("inclinacionNormalMaxima", {
    type: "number",
    default: 12
}), AutoControl.attributes.add("inclinacionDerrapeMaxima", {
    type: "number",
    default: 0
}), AutoControl.attributes.add("giroDerrapeMaximo", {
    type: "number",
    default: 35
}), AutoControl.attributes.add("giroDobladaCamaraMaximo", {
    type: "number",
    default: 4
}), AutoControl.attributes.add("giroDobladaCamaraDerrapeMaximo", {
    type: "number",
    default: 8
}), AutoControl.attributes.add("speedGiroDerrape", {
    type: "number",
    default: 56.35
}), AutoControl.attributes.add("speedGiroLevantada", {
    type: "number",
    default: 15
}), AutoControl.attributes.add("carroseriaLevantada", {
    type: "entity"
}), AutoControl.attributes.add("anguloLevantada", {
    type: "number",
    default: 0
}), AutoControl.attributes.add("speedLevantada", {
    type: "number",
    default: 0
}), AutoControl.attributes.add("piloto", {
    type: "entity"
}), AutoControl.attributes.add("motoCaida", {
    type: "entity"
}), AutoControl.attributes.add("camaraDobla", {
    type: "entity"
}), AutoControl.attributes.add("pistaChecks", {
    type: "entity"
}), AutoControl.attributes.add("totalChecks", {
    type: "number",
    default: 0
}), AutoControl.attributes.add("pilotoAnim", {
    type: "entity"
}), AutoControl.attributes.add("motoAnim", {
    type: "entity"
}), AutoControl.attributes.add("vidrios", {
    type: "entity"
}), AutoControl.attributes.add("turbo", {
    type: "number",
    default: 0
}), AutoControl.attributes.add("tiempo", {
    type: "number",
    default: 0
}), AutoControl.attributes.add("tiempoExt", {
    type: "number",
    default: 0
}), AutoControl.attributes.add("llenaTurbo", {
    type: "number",
    default: 0
}), AutoControl.attributes.add("gastoTurbo", {
    type: "number",
    default: 0
}), AutoControl.attributes.add("limitePermitirTurbo", {
    type: "number",
    default: 0
}), AutoControl.attributes.add("limitePermitirStunt", {
    type: "number",
    default: 0
}), AutoControl.attributes.add("efectoViento", {
    type: "entity"
}), AutoControl.attributes.add("efectoVientoFov", {
    type: "entity"
}), AutoControl.attributes.add("particulasDerrapeIzq", {
    type: "entity"
}), AutoControl.attributes.add("particulasDerrapeDer", {
    type: "entity"
}), AutoControl.attributes.add("particulasDerrapeTierraIzq", {
    type: "entity"
}), AutoControl.attributes.add("particulasDerrapeTierraDer", {
    type: "entity"
}), AutoControl.attributes.add("particulasChoqueIzq", {
    type: "entity"
}), AutoControl.attributes.add("particulasChoqueDer", {
    type: "entity"
}), AutoControl.attributes.add("particulasChoqueIzq2", {
    type: "entity"
}), AutoControl.attributes.add("particulasChoqueDer2", {
    type: "entity"
}), AutoControl.attributes.add("efectoTurboLeft", {
    type: "entity"
}), AutoControl.attributes.add("efectoTurboRight", {
    type: "entity"
}), AutoControl.attributes.add("particulasNitroLeft", {
    type: "entity"
}), AutoControl.attributes.add("particulasNitroRight", {
    type: "entity"
}), AutoControl.attributes.add("exploFX", {
    type: "entity"
}), AutoControl.attributes.add("corazonFX", {
    type: "entity"
}), AutoControl.prototype.init = function() {
    this.derrapeButtonApretado = !1, this.derrapeMarcado = !1, this.auto = this.entity, this.enLeft = 0, this.enRight = 0, this.lastTouchPosition = null, this.soltarTeclaDer = !1, this.soltarTeclaIzq = !1, this.soltarTeclaDerrape = !1, this.frenada = 1, this.acelerada = 0, this.pivoteCamaraATADIni = new pc.Vec3, this.oldPosition = new pc.Vec3, this.oldForward = new pc.Vec3, this.volante = 0, this.volanteInicial = 0, this.enGiroIzq = 0, this.enGiroDer = 0, this.esMoto = !1, this.sentido = 0, this.lado = "", this.enChoque = !1, this.speedGiroCar = 0, this.factorNewVolante = 1, this.vibratoCont = 0, this.ruedaGiro = 0, this.enDerrape = !1, this.realSpeedGiro = 0, this.sinDerrape = !1, this.enLevantada = !1, this.enCaida = !1, this.oldSpeed = 0, this.denegarDerrape = !1, this.pivoteCamaraRotation = new pc.Vec3, this.porcentajePista = 0, this.enPartida = !1, this.finalCarrera = !1, this.pauseGame = !1, this.enStunt = !1, this.permitirStunt = !0, this.superficie = 0, this.score = 0, this.alturaAux = 0, this.alturaActivacion = 0, this.deltaPivoteCamara = [0, -.01, 3.441833, .01, 0, 0, .472], this.rayoPosAux = this.arrayPuntos[1].getLocalPosition().clone(), this.pivoteCamaraRotation = this.pivoteCamara.getLocalEulerAngles().clone(), this.volanteInicial = 180 + this.entity.parent.getEulerAngles().y, this.sentido = 0, this.realSpeedGiro = this.speedGiro, this.speedGiroCar = this.speedGiro, this.volante = this.volanteInicial, this.oldPosition = this.rayoT.getPosition().clone(), this.oldSpeed = this.speed, this.deltaPivoteCamara[6] = this.camara.getLocalPosition().z, this.pivoteCamaraATADIni = this.pivoteCamaraAdAt.getLocalPosition().clone(), this.estadoJuego = 0, this.hiloReiniciarDerrape = null, this.hiloSeteaDenegarDerrape = null, this.elYOld = 0, this.activarChoqueParticulas = !1, this.contadorEnChoque = 0, this.tipoChoque = "", this.tiempoChoque = .15, this.hiloDesactivarChoque = null, this.enChoqueConAuto = !1, this.enVoltereta = !1, this.enVolteretaPoza = !1, this.turboManual = !1, this.hiloPosibleFinLevantada = null, this.hiloReiniciaLevantada = null, this.hiloFinLevantada = null, this.ladoDerrape = "", this.hiloCasoSoltarDerecha = null, this.hiloCasoSoltarIzquierda = null, this.hiloEnFrenado = null
}, AutoControl.prototype.preparaAuto = function() {
    this.enPartida = !1, this.finalCarrera = !1, this.entity.enabled = !0, this.speed = .011, _carSoundManager.iniciar(), currentTematica = "playa", this.vidrios.script.vidrioControl.setTematica(0), maxTurbo = autosData[autoElegido].turbo, this.maxSpeed = maxSpeed, this.maxSpeed = this.maxSpeed + 1.85 * autosData[autoElegido].maxSpeed, this.speedGiro = speedGiro, this.speedGiro = this.speedGiro + 1.22 * autosData[autoElegido].steering, this.aceleradaIni = aceleradaIni, this.aceleradaMid = aceleradaMid, this.aceleradaEnd = aceleradaEnd, this.aceleradaIni = aceleradaIni + .41 * autosData[autoElegido].aceleration, this.aceleradaMid = aceleradaMid + .31 * autosData[autoElegido].aceleration, this.aceleradaEnd = aceleradaEnd + .23 * autosData[autoElegido].aceleration, this.derrapeButtonApretado = !1, this.derrapeMarcado = !1, turbo = initialTurbo, turboBar = 1, delays = [500, 1e3, 2e3, 2500, 3e3, 3500], _menu.setTurbo(0), this.setSkyBox(0), distanceScore = 0, currentCheckpoint = 0, checkPointCant = 0, zoneClearedCant = 0, _globalScore = 0, _raceScore = 0, _menu.GUI_check.findByName("barra").setLocalScale(0, 1, 1), distanciaCheckIni = _tramos.checkPoints[currentCheckpoint].getPosition().clone().distance(this.entity.getPosition().clone())
}, AutoControl.prototype.setSkyBox = function(t) {
    for (var e = 0; e < this.skybox.children[0].children.length; e++) this.skybox.children[0].children[e].enabled = !1;
    this.skybox.children[0].children[t].enabled = !0;
    for (e = 1; e < this.pivoteCamaraAdAt.children.length; e++) this.pivoteCamaraAdAt.children[e].enabled = !1;
    this.pivoteCamaraAdAt.children[t + 1].enabled = !0
}, AutoControl.prototype.comienzaCarrera = function() {
    this.enPartida = !0, playSound("Music1", !0), playSound("loopPlaya", !0), this.app.scene.fogColor = (new pc.Color).fromString("00FFEA"), this.poneEventos()
}, AutoControl.prototype.update = function(t) {
    if (!_autoControl.pauseGame && (0 == controlDefaultType && (1 != this.enGiroIzq || this.app.keyboard.isPressed(pc.KEY_LEFT) || this.app.keyboard.isPressed(pc.KEY_A) || this.soltarTeclaIzq || (this.soltarTeclaIzq = !0, this.soltarTecla(37, !0), setTimeout(function() {
            this.soltarTeclaIzq = !1
        }.bind(this), 600)), 1 != this.enGiroDer || this.app.keyboard.isPressed(pc.KEY_RIGHT) || this.app.keyboard.isPressed(pc.KEY_D) || this.soltarTeclaDer || (this.soltarTeclaDer = !0, this.soltarTecla(39, !0), setTimeout(function() {
            this.soltarTeclaDer = !1
        }.bind(this), 600)), !this.derrapeButtonApretado || this.app.keyboard.isPressed(pc.KEY_SHIFT) || this.soltarTeclaDerrape || (this.soltarTeclaDerrape = !0, this.soltarTecla(16, !0), setTimeout(function() {
            this.soltarTeclaDerrape = !1
        }.bind(this), 600))), !this.finalCarrera)) {
        if (this.enPartida) {
            if (this.calculaSpeedGiro(), this.configuraVolante(t), this.calculaCamaraATAD(this.speed), this.revisaChoque(), this.configuraParticulas(), 1 == this.enDerrape ? this.tiempoDerrape = this.tiempoDerrape + t : this.tiempoDerrape > 0 && (this.tiempoDerrape > this.toleranciaCuentaDerrape && (this.numDerrapes = this.numDerrapes + 1, this.derrapeMaximo < this.tiempoDerrape && (this.derrapeMaximo = this.tiempoDerrape)), this.tiempoDerrape = 0), !this.enCaida && !this.enChoque) {
                this.speed;
                this.enStunt ? this.factor = .04 * this.speed : this.enDerrape ? this.factor = .02 * this.speed : this.enLevantada && (this.factor = .03 * this.speed)
            }
            this.esMoto || this.calculoFisico(t), null != this.vidrios && null != this.vidrios.script && null != this.vidrios.script.animaUvsPlus && (this.speed < .1 * this.maxSpeed ? this.vidrios.script.animaUvsPlus.speed = -this.speed * t * 7 : this.speed < .3 * this.maxSpeed ? this.vidrios.script.animaUvsPlus.speed = -this.speed * t * 5 : this.speed < .5 * this.maxSpeed ? this.vidrios.script.animaUvsPlus.speed = -this.speed * t * 3 : this.speed < .7 * this.maxSpeed ? this.vidrios.script.animaUvsPlus.speed = -this.speed * t * 2 : this.vidrios.script.animaUvsPlus.speed = .8 * -this.maxSpeed * t * 2)
        } else this.vibratoIni(t), this.contenedorCamara.setPosition(this.entity.getPosition());
        var e = _tramos.checkPoints[currentCheckpoint].getPosition().distance(this.entity.getPosition()),
            a = (1 - (o = 0)) / (0 - (i = distanciaCheckIni)) * (e - i) + o;
        _menu.GUI_check.findByName("barra").getLocalScale().x < a && _menu.GUI_check.findByName("barra").setLocalScale(a, 1, 1);
        var i, o;
        a = (3971 - (o = 0)) / (0 - (i = distanciaCheckIni)) * (e - i) + o;
        distanceScore < a && (distanceScore = a), distanceScore = Math.round(distanceScore), this.sentido = 1
    }
}, AutoControl.prototype.recargaTurbo = function() {
    0 != maxTurbo && (playSound("turboRecarga"), this.glow_auto.enabled = !0, this.glow_auto.script.animaUvsPlus.play(0, 1, 1), _menu.setTurbo(.5))
}, AutoControl.prototype.calculaSpeedGiro = function() {
    var t = 1;
    this.speedGiroCar < 1 && (t = -1);
    var e = this.speedGiro,
        a = this.maxSpeed,
        i = (.7 * this.speedGiro - e) / (a - 0) * (this.speed - 0) + e;
    this.speedGiroCar = i * t / 1.3
}, AutoControl.prototype.calculaFactorInclinada = function() {
    var t = (.7 - 1) / (this.maxSpeed - 0) * (this.speed - 0) + 1;
    return (t = t * this.factorNewVolante * 2) > 1.9 && (t = 1.9), t
}, AutoControl.prototype.vibratoIni = function(t) {
    if (!this.vibrato.playing) {
        var e = .5 / 80;
        this.vibratoCont >= e ? this.vibratoFlag = 1 : this.vibratoCont <= -.00625 && (this.vibratoFlag = 0), 0 == this.vibratoFlag && this.vibratoCont <= e ? this.vibratoCont = this.vibratoCont + .25 * t : 1 == this.vibratoFlag && this.vibratoCont >= -.00625 && (this.vibratoCont = this.vibratoCont - .25 * t), this.vibratoCont > e ? this.vibratoCont = .007500000000000001 : this.vibratoCont < -.00625 && (this.vibratoCont = -.00625 - .1 / 80), this.vibrato.tweenVar = this.vibrato.tween(this.vibrato.getLocalRotation()).to(new pc.Vec3(this.vibratoCont, 0, 0), .2, pc.SineOut), this.vibrato.tweenVar.start()
    }
}, AutoControl.prototype.elTiempo = function(t) {
    return t <= 5 ? .25 : t < 20 ? .22 : t < 30 ? .18 : .129
}, AutoControl.prototype.seteaAcelerada = function(t) {
    t < .45 * this.maxSpeed ? this.acelerada = this.aceleradaIni : t < .8 * this.maxSpeed ? this.acelerada = this.aceleradaMid : this.acelerada = this.aceleradaEnd
}, AutoControl.prototype.calculaSpeed = function(t) {
    if (time <= 0) return this.speed > 0 ? this.frenada < 0 ? this.speed = this.speed + t * this.acelerada * 2 * this.frenada : this.speed = this.speed + t * -this.acelerada * 2 * this.frenada : this.speed = 0, this.speed;
    if (this.enVoltereta) return this.speed = 0, this.speed;
    if (this.enCaida) this.speed = this.speed + t * -this.acelerada / 1.3 * this.frenada;
    else if (1 == this.enStunt) this.speed > .8 * this.maxSpeed && (this.speed = .8 * this.maxSpeed);
    else if (this.enDerrape)
        if (0 == this.superficie) {
            if (this.speed > .72 * this.maxSpeed) {
                var e = 0;
                e = this.frenada < 0 ? t * this.acelerada * 3.5 * this.frenada : t * this.acelerada * .2 * this.frenada, e = this.frenada < 0 ? Math.abs(e) : -1 * Math.abs(e), this.speed = this.speed - e
            } else this.speed = this.speed + t * this.acelerada * .5 * this.frenada;
            this.speed > .85 * this.maxSpeed && (this.speed = .85 * this.maxSpeed)
        } else 1 == this.superficie && (this.speed = this.speed + t * this.acelerada / 5 * this.frenada, this.speed > .35 * this.maxSpeed ? this.frenada < 0 ? this.speed = this.speed + t * this.acelerada * 5 * this.frenada : this.speed = this.speed + t * -this.acelerada * 5 * this.frenada : this.speed = this.speed + t * this.acelerada / 5.5 * this.frenada);
    else this.enLevantada ? 0 == this.superficie ? this.speed > 1.18 * this.maxSpeed ? this.speed = 1.18 * this.maxSpeed : this.speed = this.speed + t * this.acelerada * 2.6 * this.frenada : 1 == this.superficie && (this.speed > .85 * this.maxSpeed * 1.15 ? this.speed = .85 * this.maxSpeed * 1.15 : this.speed = this.speed + t * this.acelerada / 4.5 * this.frenada) : 0 == this.superficie ? this.speed > this.maxSpeed + 1 ? this.frenada < 0 ? this.speed = this.speed + t * this.acelerada * 2 * this.frenada : this.speed = this.speed + t * -this.acelerada * 2 * this.frenada : this.speed > this.maxSpeed ? this.speed = this.maxSpeed : this.speed = this.speed + t * this.acelerada * this.frenada : 1 == this.superficie && (this.speed > .65 * this.maxSpeed + 1 ? this.frenada < 0 ? this.speed = this.speed + t * acelerada * 3 * this.frenada : this.speed = this.speed + t * -this.acelerada * 3 * this.frenada : this.speed > .85 * this.maxSpeed ? this.speed = .85 * this.maxSpeed : this.speed = this.speed + t * this.acelerada / 4.5 * this.frenada);
    return 1 == this.enDerrape && 0 == this.enCaida && this.speed < this.maxSpeed * this.speedEnDerrape && (this.enDerrape = !1, _carSoundManager.StopSkid(), this.speedGiro = this.realSpeedGiro, null != this.autoMotoDerrape.tweenVar && this.autoMotoDerrape.tweenVar.stop(), this.autoMotoDerrape.tweenVar = this.autoMotoDerrape.tween(this.autoMotoDerrape.getLocalEulerAngles()).rotate(new pc.Vec3(0, 0, 0), .4, pc.SineOut).start(), clearInterval(this.hiloReiniciarDerrape)), this.speed < 0 && (this.speed = 0), 1 == this.esMoto ? (this.ruedaTBackDer.rotateLocal(-this.speed * t * 35, 0, 0), this.ruedaTDer.rotateLocal(-this.speed * t * 35, 0, 0)) : (this.ruedaTBackDer.rotateLocal(-this.speed * t * 35, 0, 0), this.ruedaTDer.rotateLocal(-this.speed * t * 35, 0, 0), this.ruedaTIzq.rotateLocal(-this.speed * t * 35, 0, 0), 1 == this.enGiroIzq ? (this.ruedaGiro = this.ruedaGiro + 400 * t, this.ruedaGiro >= this.limiteRuedaGiro / 1.8 && (this.ruedaGiro = this.limiteRuedaGiro / 1.8)) : 1 == this.enGiroDer ? (this.ruedaGiro = this.ruedaGiro - 400 * t, this.ruedaGiro <= -this.limiteRuedaGiro / 1.8 && (this.ruedaGiro = -this.limiteRuedaGiro / 1.8)) : Math.abs(0 - this.ruedaGiro) <= 1 ? this.ruedaGiro = 0 : this.ruedaGiro < 0 ? this.ruedaGiro = this.ruedaGiro + 400 * t : this.ruedaGiro > 0 && (this.ruedaGiro = this.ruedaGiro - 400 * t), this.ruedaTDerGiro.setLocalEulerAngles(new pc.Vec3(0, this.ruedaGiro, 0)), this.ruedaTIzqGiro.setLocalEulerAngles(new pc.Vec3(0, this.ruedaGiro, 0))), this.speed
}, AutoControl.prototype.calculaCamaraATAD = function(t) {
    if (null != this.pivoteCamaraATADIni) {
        var e, a, i, o, r, s, n = 0,
            h = 0,
            l = 1;
        t > 2 ? (e = 2 / (l = 1.1), r = (-.97 / l - (a = .268 / l)) / ((i = this.maxSpeed / l / 2 - 15 / l) - e), (s = t / l) > i && (s = i), this.oldSpeed = t, o = 2 / l, 0, h = r * (s - e) + a, (n = (.48 / l - 0) / (this.maxSpeed / l / 2 - 15 / l - o) * (s - o) + 0) > .13 && (n = .13, h = this.elYOld)) : (e = 0, r = (.268 / (l = 1.1) - (a = this.pivoteCamaraATADIni.z)) / ((i = 2 / l) - e), (s = t / l) > i && (s = i), this.oldSpeed, n = 0, this.oldSpeed = t, h = r * (s - e) + a), this.elYOld = h, this.pivoteCamaraAdAt.tween(this.pivoteCamaraAdAt.getLocalPosition()).to(new pc.Vec3(0, n, h), .2, pc.SineOut).start()
    }
}, AutoControl.prototype.configuraVolante = function(t) {
    1 != this.enChoque && 0 != this.speed && (1 == this.enGiroIzq && 1 == this.enGiroDer || 1 != this.enGiroIzq && 1 != this.enGiroDer || (this.volante = this.volante + t * -this.speedGiroCar * this.factorNewVolante))
}, AutoControl.prototype.calculoFisico = function(t) {
    var e = null,
        a = null,
        i = !0,
        o = "";
    if ((l = new pc.Vec3).add2(this.arrayPuntos[2].getPosition(), this.arrayPuntos[2].right.scale(-1)), a = this.app.systems.rigidbody.raycastFirst(this.arrayPuntos[2].getPosition(), l)) {
        if (conDebugRay) {
            var r = this.arrayPuntos[2].getPosition(),
                s = l,
                n = new pc.Color(1, 0, 0);
            this.app.renderLine(r, s, n)
        }
        a.point.distance(this.arrayPuntos[2].getPosition()) > .035 && (a = null)
    }
    if (null == a && ((l = new pc.Vec3).add2(this.arrayPuntos[3].getPosition(), this.arrayPuntos[3].right), a = this.app.systems.rigidbody.raycastFirst(this.arrayPuntos[3].getPosition(), l))) {
        if (conDebugRay) {
            r = this.arrayPuntos[3].getPosition(), s = l, n = new pc.Color(1, 0, 0);
            this.app.renderLine(r, s, n)
        }
        a.point.distance(this.arrayPuntos[3].getPosition()) > .035 && (a = null)
    }
    if (null == a)
        for (var h = 6; h <= 8; h++) {
            if ((l = new pc.Vec3).add2(this.arrayPuntos[h].getPosition(), this.arrayPuntos[h].forward), a = this.app.systems.rigidbody.raycastFirst(this.arrayPuntos[h].getPosition(), l)) {
                if (conDebugRay) {
                    r = this.arrayPuntos[h].getPosition(), s = l, n = new pc.Color(1, 0, 0);
                    this.app.renderLine(r, s, n)
                }
                if (!(a.point.distance(this.arrayPuntos[h].getPosition()) > .055)) break;
                a = null
            }
        }
    if (null == a && ((l = new pc.Vec3).add2(this.arrayPuntos[12].getPosition(), this.arrayPuntos[12].right.scale(-1)), a = this.app.systems.rigidbody.raycastFirst(this.arrayPuntos[12].getPosition(), l))) {
        if (conDebugRay) {
            r = this.arrayPuntos[12].getPosition(), s = l, n = new pc.Color(1, 0, 0);
            this.app.renderLine(r, s, n)
        }
        a.point.distance(this.arrayPuntos[12].getPosition()) > .03 && (a = null)
    }
    if (null == a && ((l = new pc.Vec3).add2(this.arrayPuntos[13].getPosition(), this.arrayPuntos[13].right), a = this.app.systems.rigidbody.raycastFirst(this.arrayPuntos[13].getPosition(), l))) {
        if (conDebugRay) {
            r = this.arrayPuntos[13].getPosition(), s = l, n = new pc.Color(1, 0, 0);
            this.app.renderLine(r, s, n)
        }
        a.point.distance(this.arrayPuntos[13].getPosition()) > .03 && (a = null)
    }
    var l = new pc.Vec3,
        p = [this.arrayPuntos[1], this.arrayPuntos[0], this.arrayPuntos[14], this.arrayPuntos[15], this.arrayPuntos[16]];
    for (h = 0; h < p.length; h++)
        if (l.add2(this.arrayPuntos[h].getPosition(), this.arrayPuntos[h].up.scale(-3)), (e = this.app.systems.rigidbody.raycastFirst(this.arrayPuntos[h].getPosition(), l)) && ("camino" == e.entity.name || "caminoArena" == e.entity.name || "caminoPuente" == e.entity.name)) {
            o = e.entity.name;
            break
        } if (a) {
        var c = a.entity.name;
        if (0 == this.activarChoqueParticulas) {
            this.contadorEnChoque = 0, i = !1;
            var u = this.maxSpeed,
                d = 0 / (1 - u) * (this.speed - u) + 40;
            d = 25, 1 == this.sentido ? "bordeIzq" == c ? this.enterChoque("bordeIzq", -1 * d, "", a.entity.parent.name) : "bordeDer" == c ? this.enterChoque("bordeDer", d, "", a.entity.parent.name) : "bordeBack" == c && this.enterChoque("bordeBack", 0, "", a.entity.parent.name) : -1 == this.sentido && ("bordeDer" == c ? this.enterChoque("bordeIzq", -1 * d, "", a.entity.parent.name) : "bordeIzq" == c ? this.enterChoque("bordeDer", d, "", a.entity.parent.name) : "bordeBack" == c && this.enterChoque("bordeBack", 0, "", a.entity.parent.name))
        }
    }
    if (!e || "camino" != o && "caminoArena" != o && "caminoPuente" != e.entity.name) {
        console.log("SIN COLISION?!?! ", o), this.finLevantadaInsta();
        var b = .1;
        return this.volante = 180, this.speed = 0, void this.entity.setPosition(new pc.Vec3(currentPosition.x, currentPosition.y + 1, currentPosition.z))
    }
    switch (0 == this.enCaida && (this.contadorEnChoque = 0), this.ajustarDeltaPivoteCamara(this.entity.forward), i = !1, e.entity.name) {
        case "camino":
            this.superficie = 0, _carSoundManager.puenteLoop(!1);
            break;
        case "caminoArena":
            this.superficie = 1, _carSoundManager.puenteLoop(!1);
            break;
        case "caminoPuente":
            this.superficie = 0, _autoControl.finalCarrera || _carSoundManager.puenteLoop(!0)
    }
    if (i) console.log("entre al sin hit");
    else {
        b = this.elTiempo(this.speed);
        var m = fromToRotation(pc.Vec3.UP, e.normal),
            D = new pc.Quat;
        if (D.setFromEulerAngles(0, this.volante + 180, 0), this.entity.setRotation(D), this.entity.setRotation(m.mul(this.entity.getRotation().clone())), !this.enCaida) {
            var y = this.entity.getLocalEulerAngles().clone();
            this.carroseria.tween(this.carroseria.getLocalEulerAngles()).rotate(y, b / 6, pc.Linear).start()
        }
        this.seteaAcelerada(this.speed), this.speed = this.calculaSpeed(t), this.speed <= 0 && time <= 0 && 0 == this.estadoJuego && (this.estadoJuego = 1), this.oldPosition = this.rayoT.getPosition(), this.oldForward = -this.rayoT.forward;
        var C = new pc.Vec3,
            v = this.speed * t,
            f = this.entity.forward.scale(v / 7);
        C.add2(this.entity.getPosition(), f), C = new pc.Vec3(C.x, e.point.y + this.distanceCarGround, C.z), this.entity.setPosition(C);
        var A = this.vibratoLimite / 80;
        1 == this.superficie && (A = this.vibratoLimite / 80 * 1.5), this.vibratoCont >= A ? this.vibratoFlag = 1 : this.vibratoCont <= -1 * A && (this.vibratoFlag = 0);
        var g = 80,
            w = this.speed / g;
        w < .4375 && (w = .4375), 0 == this.vibratoFlag && this.vibratoCont <= A ? this.vibratoCont = this.vibratoCont + w * t : 1 == this.vibratoFlag && this.vibratoCont >= -1 * A && (this.vibratoCont = this.vibratoCont - w * t), this.vibratoCont > A ? this.vibratoCont = A + .00125 : this.vibratoCont < -1 * A && (this.vibratoCont = -1 * A - .00125), this.speed >= -.0025 && this.speed <= .0025 && (this.vibratoCont = 0), this.vibrato.tween(this.vibrato.getLocalRotation()).to(new pc.Vec3(this.vibratoCont, 0, 0), .2, pc.SineOut).start(), this.carroseria.setPosition(this.entity.getPosition()), this.carroseria.translateLocal(0, 0, .8 * -.1), this.contenedorCamara.setPosition(this.entity.getPosition()), this.skybox.setLocalPosition(new pc.Vec3(this.entity.getLocalPosition().x, this.skybox.getLocalPosition().y, this.entity.getLocalPosition().z)), this.contenedorCamara.tween(this.contenedorCamara.getLocalEulerAngles()).rotate(new pc.Vec3(this.carroseria.getLocalEulerAngles().x, this.carroseria.getLocalEulerAngles().y, this.carroseria.getLocalEulerAngles().z), b / 2, pc.SineOut).start();
        var S = pc.Vec3.DOWN.clone(),
            V = e.point.clone();
        S = S.normalize(), V = V.normalize();
        var M = S.dot(V),
            L = Math.acos(M) * pc.math.RAD_TO_DEG;
        if (0 == this.alturaAux) this.alturaAux = L;
        else if (L < this.alturaAux && L > 91.2) {
            d = 0;
            var P = .172;
            if (this.alturaActivacion = this.alturaActivacion + 1, 16 == this.alturaActivacion) {
                var E = this.camara.getLocalPosition();
                this.camara.tween(this.camara.getLocalPosition()).to(new pc.Vec3(E.x, d, P), .25, pc.SineOut).start()
            }
        } else if (L > this.alturaAux) {
            if (0 != this.alturaActivacion) {
                d = -.117, P = .472, E = this.camara.getLocalPosition();
                this.camara.tween(this.camara.getLocalPosition()).to(new pc.Vec3(E.x, d, P), .25, pc.SineOut).start()
            }
            this.alturaActivacion = 0
        }
        this.alturaAux = L
    }
}, AutoControl.prototype.ajustarDeltaPivoteCamara = function(t) {}, AutoControl.prototype.enterChoque = function(t, e, a, i) {
    if (!("choqueAuto" == a && this.enChoque || this.enVoltereta || "bordeDer" != t && "bordeIzq" != t && "bordeBack" != t)) {
        var o = parseInt(_menu.getKM()),
            r = 150;
        if ("bordeBack" == t && (r = 130), !i.includes("skin") || i.includes("skin") && o < r) {
            var s = this.calculaFuerzaChoque(this.speed);
            this.speed;
            return this.speed = .2 * this.speed, this.speed < 2 && (this.speed = 2), this.esMoto ? this.volante = this.volante + 3.25 * e : this.volante = this.volante + 1.3 * e, this.enChoque = !0, this.activarChoqueParticulas = !0, clearInterval(this.hiloDesactivarChoque), this.hiloDesactivarChoque = setInterval(this.desactivarChoque.bind(this), 1e3 * this.tiempoChoque), _carSoundManager.PlayCrash(), this.prendeChoques(!0, t), this.tipoChoque = t, this.pivoteCamara.setLocalEulerAngles(this.pivoteCamaraRotation.clone()), this.pivoteCamara.script.shake.shake(s / 50, .3), this.esMoto ? 1 == this.enLevantada ? (null != this.hiloFinLevantada && this.hiloFinLevantada.stop(), this.finLevantada(), this.enCaida = !0, this.ejecutaCaida(t)) : 1 == this.enStunt && (clearInterval(this.hiloFinStunt), this.finStunt()) : 1 == this.enLevantada && (null != this.hiloFinLevantada && this.hiloFinLevantada.stop(), this.finLevantada()), null != this.autoMotoDerrape.tweenVar && this.autoMotoDerrape.tweenVar.stop(), this.autoMotoDerrape.tween(this.autoMotoDerrape.getLocalEulerAngles()).rotate(new pc.Vec3(0, 0, 0), .6, pc.SineOut).start(), clearInterval(this.hiloReiniciarDerrape), this.reiniciarDerrape(), this.denegarDerrape = !0, clearInterval(this.hiloSeteaDenegarDerrape), this.hiloSeteaDenegarDerrape = setInterval(this.seteaDenegarDerrape.bind(this), 500), (new pc.Quat).setFromEulerAngles(this.entity.getEulerAngles().x, this.volante - 180, this.entity.getEulerAngles().x), void(this.contadorEnChoque >= 90 && (this.contadorEnChoque = 0))
        }
        s = this.calculaFuerzaChoque(this.speed), this.speed;
        this.speed = .2 * this.speed, this.speed < 2 && (this.speed = 2), this.esMoto ? this.volante = this.volante + 3.25 * e : this.volante = this.volante + 1.7 * e, this.enChoque = !0, this.activarChoqueParticulas = !0, clearInterval(this.hiloDesactivarChoque), _carSoundManager.PlayCrash(), this.prendeChoques(!0, t), this.tipoChoque = t, this.pivoteCamara.setLocalEulerAngles(this.pivoteCamaraRotation.clone()), this.pivoteCamara.script.shake.shake(s / 50, .3), this.esMoto ? 1 == this.enLevantada ? (null != this.hiloFinLevantada && this.hiloFinLevantada.stop(), this.finLevantada(), this.enCaida = !0, this.ejecutaCaida(t)) : 1 == this.enStunt && (clearInterval(this.hiloFinStunt), this.finStunt()) : 1 == this.enLevantada && (null != this.hiloFinLevantada && this.hiloFinLevantada.stop(), this.finLevantada()), null != this.autoMotoDerrape.tweenVar && this.autoMotoDerrape.tweenVar.stop(), this.autoMotoDerrape.tween(this.autoMotoDerrape.getLocalEulerAngles()).rotate(new pc.Vec3(0, 0, 0), .6, pc.SineOut).start(), clearInterval(this.hiloReiniciarDerrape), this.reiniciarDerrape(), this.denegarDerrape = !0, clearInterval(this.hiloSeteaDenegarDerrape), this.hiloSeteaDenegarDerrape = setInterval(this.seteaDenegarDerrape.bind(this), 500), (new pc.Quat).setFromEulerAngles(this.entity.getEulerAngles().x, this.volante - 180, this.entity.getEulerAngles().x), this.contadorEnChoque >= 90 && (this.contadorEnChoque = 0), null != this.autoMotoDerrape.tweenVar && this.autoMotoDerrape.tweenVar.stop(), this.autoMotoDerrape.tween(this.autoMotoDerrape.getLocalEulerAngles()).rotate(new pc.Vec3(0, 0, 0), .06, pc.SineOut).start();
        var n = {
            x: 0
        };
        return setTimeout(function() {
            this.enVoltereta = !0
        }.bind(this), 110), this.app.tween(n).to({
            x: 680
        }, .8, pc.SineOut).onUpdate((() => {
            this.autoMotoDerrape.setLocalEulerAngles(0, n.x, 0)
        })).delay(.1).onComplete((() => {
            this.autoMotoDerrape.tween(this.autoMotoDerrape.getLocalEulerAngles()).rotate(new pc.Vec3(0, 0, 0), .1, pc.SineOut).start(), this.enVoltereta = !1, this.desactivarChoque()
        })).start(), void playSound("voltereta")
    }
}, AutoControl.prototype.desactivarChoque = function() {
    clearInterval(this.hiloDesactivarChoque), this.activarChoqueParticulas = !1
}, AutoControl.prototype.seteaDenegarDerrape = function() {
    clearInterval(this.hiloSeteaDenegarDerrape), this.denegarDerrape = !1
}, AutoControl.prototype.calculaFuerzaChoque = function(t) {
    return 12.5 / (1.15 * this.maxSpeed - 0) * (t - 0) + .5
}, AutoControl.prototype.reiniciarDerrape = function() {
    clearInterval(this.hiloReiniciarDerrape), this.enDerrape = !1, this.speedGiro = this.realSpeedGiro, _carSoundManager.StopSkid()
}, AutoControl.prototype.finLevantada = function() {
    this.carroseriaLevantada.setLocalEulerAngles(new pc.Vec3(0, 0, 0));
    var t = {
        x: this.camara.camera.fov
    };
    this.camara.tweenVar = this.app.tween(t).to({
        x: 70
    }, .4, pc.SineOut), this.camara.tweenVar.onUpdate((() => {
        this.camara.camera.fov = t.x
    })).start();
    var e = {
        x: this.camaraSkyBox.camera.fov
    };
    this.camaraSkyBox.tweenVar = this.app.tween(e).to({
        x: 70
    }, .4, pc.SineOut), this.camaraSkyBox.tweenVar.onUpdate((() => {
        this.camaraSkyBox.camera.fov = e.x
    })).start(), null != this.hiloPosibleFinLevantada && this.hiloPosibleFinLevantada.stop(), null != this.hiloFinLevantada && this.hiloFinLevantada.stop(), null != this.hiloReiniciaLevantada && this.hiloReiniciaLevantada.stop();
    this.hiloReiniciaLevantada = this.app.tween({
        x: 0
    }).to({
        x: 10
    }, .2, pc.Linear).onComplete((() => {
        this.reiniciaLevantada()
    })).start(), this.turboManual = !1
}, AutoControl.prototype.finLevantadaInsta = function() {
    this.carroseriaLevantada.setLocalEulerAngles(new pc.Vec3(0, 0, 0));
    var t = {
        x: this.camara.camera.fov
    };
    this.camara.tweenVar = this.app.tween(t).to({
        x: 70
    }, .4, pc.SineOut), this.camara.tweenVar.onUpdate((() => {
        this.camara.camera.fov = t.x
    })).start();
    var e = {
        x: this.camaraSkyBox.camera.fov
    };
    this.camaraSkyBox.tweenVar = this.app.tween(e).to({
        x: 70
    }, .4, pc.SineOut), this.camaraSkyBox.tweenVar.onUpdate((() => {
        this.camaraSkyBox.camera.fov = e.x
    })).start(), null != this.hiloPosibleFinLevantada && this.hiloPosibleFinLevantada.stop(), null != this.hiloFinLevantada && this.hiloFinLevantada.stop(), null != this.hiloReiniciaLevantada && this.hiloReiniciaLevantada.stop();
    this.hiloReiniciaLevantada = this.app.tween({
        x: 0
    }).to({
        x: 10
    }, .2, pc.Linear).onComplete((() => {
        this.reiniciaLevantada()
    })).start(), this.turboManual = !1
}, AutoControl.prototype.posiblefinLevantada = function() {
    if (null != this.hiloPosibleFinLevantada && this.hiloPosibleFinLevantada.stop(), this.speed < .03 * this.maxSpeed) null != this.hiloFinLevantada && this.hiloFinLevantada.stop(), this.finLevantada();
    else {
        this.hiloPosibleFinLevantada = this.app.tween({
            x: 0
        }).to({
            x: 10
        }, .2, pc.Linear).onComplete((() => {
            this.posiblefinLevantada()
        })).start()
    }
}, AutoControl.prototype.reiniciaLevantada = function() {
    null != this.hiloReiniciaLevantada && this.hiloReiniciaLevantada.stop(), this.enLevantada = !1
}, AutoControl.prototype.reiniciaDeVoltereta = function() {}, AutoControl.prototype.finVoltereta = function() {
    this.resetPlayer(), this.enVoltereta = !1
}, AutoControl.prototype.metodoLevantada = function() {
    if (!this.enLevantada) {
        null != this.carroseriaLevantada.tweenVar && this.carroseriaLevantada.tweenVar.stop(), null != this.camara.tweenVar && this.camara.tweenVar.stop(), null != this.camaraSkyBox.tweenVar && this.camaraSkyBox.tweenVar.stop(), this.carroseriaLevantada.tweenVar = this.carroseriaLevantada.tween(this.carroseriaLevantada.getLocalEulerAngles()).rotate(new pc.Vec3(this.anguloLevantada, 0, 0), .3, pc.SineOut), this.carroseriaLevantada.tweenVar.start();
        var t = {
            x: this.camara.camera.fov
        };
        this.camara.tweenVar = this.app.tween(t).to({
            x: 90
        }, .3, pc.SineOut), this.camara.tweenVar.onUpdate((() => {
            this.camara.camera.fov = t.x
        })).start();
        var e = {
            x: this.camaraSkyBox.camera.fov
        };
        this.camaraSkyBox.tweenVar = this.app.tween(e).to({
            x: 90
        }, .3, pc.SineOut), this.camaraSkyBox.tweenVar.onUpdate((() => {
            this.camaraSkyBox.camera.fov = e.x
        })).start(), this.speed = this.speed + this.speedLevantada, this.enLevantada = !0, playSound("turbo"), null != this.hiloPosibleFinLevantada && this.hiloPosibleFinLevantada.stop(), null != this.hiloFinLevantada && this.hiloFinLevantada.stop();
        this.hiloPosibleFinLevantada = this.app.tween({
            x: 0
        }).to({
            x: 10
        }, .2, pc.Linear).onComplete((() => {
            this.posiblefinLevantada()
        })).start();
        this.hiloFinLevantada = this.app.tween({
            x: 0
        }).to({
            x: 10
        }, 1.2, pc.Linear).onComplete((() => {
            this.finLevantada()
        })).start()
    }
}, AutoControl.prototype.pauseTweens = function() {
    this.pauseGame ? (null != this.hiloPosibleFinLevantada && this.hiloPosibleFinLevantada.pause(), null != this.hiloFinLevantada && this.hiloFinLevantada.pause(), null != this.hiloReiniciaLevantada && this.hiloReiniciaLevantada.pause()) : (null != this.hiloPosibleFinLevantada && this.hiloPosibleFinLevantada.resume(), null != this.hiloFinLevantada && this.hiloFinLevantada.resume(), null != this.hiloReiniciaLevantada && this.hiloReiniciaLevantada.resume())
}, AutoControl.prototype.buscarDireccion = function() {
    this.sentido = 1
}, AutoControl.prototype.rotPiloto = function() {
    this.esMoto
}, AutoControl.prototype.revisaChoque = function() {
    this.enChoque && Math.abs(this.carroseria.getLocalEulerAngles().y - this.entity.getLocalEulerAngles().y) <= 20 && Math.abs(this.carroseria.getLocalEulerAngles().y - this.entity.getLocalEulerAngles().y) >= 0 && (this.enChoque = !1)
}, AutoControl.prototype.explosion = function() {
    this.enVoltereta = !0, this.exploFX.enabled = !0, this.exploFX.sprite.play("Clip 1"), this.exploFX.children[0].sprite.play("Clip 1");
    var t = Math.ceil(2 * Math.random());
    playSound("explo" + t), setTimeout(function() {
        this.motoCaida.enabled = !1
    }.bind(this), 150), this.exploFX.sprite.on("end", function() {
        stopSound("pocoTiempo"), this.exploFX.enabled = !1, _menu.gameOver("explo")
    }.bind(this))
}, AutoControl.prototype.casoApretarDerecha = function(t) {
    if (!this.finalCarrera && 1 != this.enCaida && 1 != this.pauseGame)
        if (this.hiloCasoSoltarDerecha = clearInterval(this.hiloCasoSoltarDerecha), null != this.hiloCasoSoltarIzquierda && (this.hiloCasoSoltarIzquierda = clearInterval(this.hiloCasoSoltarIzquierda), this.casoSoltarIzquierda()), 1 == this.enGiroDer && t && (this.factorNewVolante > 1.02 || pcControl) && "derecha" == this.ladoDerrape && (this.casoDerrape(), this.ladoDerrape = ""), this.enGiroDer = 1, this.speedGiroCar < 0 && (this.speedGiroCar = -1 * this.speedGiroCar), 1 == this.enGiroIzq) 1 == this.enDerrape ? (null != this.autoMotoDerrape.tweenVar && this.autoMotoDerrape.tweenVar.stop(), this.autoMotoDerrape.tweenVar = this.autoMotoDerrape.tween(this.autoMotoDerrape.getLocalEulerAngles()).rotate(new pc.Vec3(0, 0, 0), .4, pc.SineOut).onUpdate((() => {
            this.rotPiloto()
        })).start(), null != this.camaraDobla.tweenVar && this.camaraDobla.tweenVar.stop(), this.camaraDobla.tweenVar = this.camaraDobla.tween(this.camaraDobla.getLocalEulerAngles()).rotate(new pc.Vec3(0, 0, 0), .3, pc.SineOut).start(), clearInterval(this.hiloReiniciarDerrape), this.hiloReiniciarDerrape = setInterval(function() {
            clearInterval(this.hiloReiniciarDerrape), 1 == this.enGiroDer && 1 == this.enGiroIzq && this.enDerrape && (this.hiloReiniciarDerrape = setInterval(this.reiniciarDerrape.bind(this), 250), this.autoMotoGiro.tween(this.autoMotoGiro.getLocalEulerAngles()).rotate(new pc.Vec3(0, 0, 0), .3, pc.SineOut).start())
        }.bind(this), 300)) : (null != this.autoMotoGiro.tweenVar && this.autoMotoGiro.tweenVar.stop(), this.autoMotoGiro.tweenVar = this.autoMotoGiro.tween(this.autoMotoGiro.getLocalEulerAngles()).rotate(new pc.Vec3(0, 0, 0), .3, pc.SineOut).onUpdate((() => {
            this.rotPiloto()
        })).start(), null != this.camaraDobla.tweenVar && this.camaraDobla.tweenVar.stop(), this.camaraDobla.tweenVar = this.camaraDobla.tween(this.camaraDobla.getLocalEulerAngles()).rotate(new pc.Vec3(0, 0, 0), .3, pc.SineOut).start());
        else if (0 == this.enDerrape)
        if (this.ladoDerrape = "derecha", 0 == this.enLevantada) {
            var e = .35;
            this.doblaCarroseria("derecha"), null != this.camaraDobla.tweenVar && this.camaraDobla.tweenVar.stop();
            var a = this.giroDobladaCamaraMaximo * e * 2;
            a >= 5.7 && (a = 5.7), this.camaraDobla.tweenVar = this.camaraDobla.tween(this.camaraDobla.getLocalEulerAngles()).rotate(new pc.Vec3(0, 0, -1 * a), .3, pc.SineOut).start()
        } else {
            e = .35;
            this.esMoto ? this.autoMotoGiro.tween(this.autoMotoGiro.getLocalEulerAngles()).rotate(new pc.Vec3(0, 0 * e, -this.inclinacionNormalMaxima * e), .3, pc.SineOut).onUpdate((() => {
                this.rotPiloto()
            })).start() : this.autoMotoGiro.tween(this.autoMotoGiro.getLocalEulerAngles()).rotate(new pc.Vec3(0, -this.inclinacionNormalMaxima * e, 0 * e), .3, pc.SineOut).start(), null != this.camaraDobla.tweenVar && this.camaraDobla.tweenVar.stop(), this.camaraDobla.tweenVar = this.camaraDobla.tween(this.camaraDobla.getLocalEulerAngles()).rotate(new pc.Vec3(0, 0, -this.giroDobladaCamaraMaximo / 2), .3, pc.SineOut).start()
        }
    else pcControl && 0 == controlDefaultType ? this.derrapeButtonApretado ? (this.doblaCarroseria("derecha"), _carSoundManager.PlaySkid()) : (this.reiniciarDerrape(), this.doblaCarroseria("derecha")) : (this.doblaCarroseria("derecha"), _carSoundManager.PlaySkid())
}, AutoControl.prototype.doblaCarroseria = function(t) {
    if ("derecha" == t) {
        var e = this.calculaFactorInclinada();
        this.esMoto ? this.autoMotoGiro.tween(this.autoMotoGiro.getLocalEulerAngles()).rotate(new pc.Vec3(0, -this.inclinacionNormalMaxima * e, 0 * e), .3, pc.SineOut).onUpdate((() => {
            this.rotPiloto()
        })).start() : this.autoMotoGiro.tween(this.autoMotoGiro.getLocalEulerAngles()).rotate(new pc.Vec3(0, -this.inclinacionNormalMaxima * e, 0 * e), .3, pc.SineOut).start()
    } else if ("izquierda" == t) {
        e = this.calculaFactorInclinada();
        this.esMoto ? this.autoMotoGiro.tween(this.autoMotoGiro.getLocalEulerAngles()).rotate(new pc.Vec3(0, this.inclinacionNormalMaxima * e, 0 * e), .3, pc.SineOut).onUpdate((() => {
            this.rotPiloto.bind()
        })).start() : this.autoMotoGiro.tween(this.autoMotoGiro.getLocalEulerAngles()).rotate(new pc.Vec3(0, this.inclinacionNormalMaxima * e, 0 * e), .3, pc.SineOut).start()
    }
    if (this.enDerrape)
        if ("derecha" == t) {
            e = this.calculaNewDerrape();
            null != this.autoMotoDerrape.tweenVar && this.autoMotoDerrape.tweenVar.stop(), this.autoMotoDerrape.tweenVar = this.autoMotoDerrape.tween(this.autoMotoDerrape.getLocalEulerAngles()).rotate(new pc.Vec3(0, -e, this.inclinacionDerrapeMaxima), .5, pc.SineOut).onUpdate((() => {
                this.rotPiloto()
            })).start(), clearInterval(this.hiloReiniciarDerrape), null != this.camaraDobla.tweenVar && this.camaraDobla.tweenVar.stop(), this.camaraDobla.tweenVar = this.camaraDobla.tween(this.camaraDobla.getLocalEulerAngles()).rotate(new pc.Vec3(0, 0, -this.giroDobladaCamaraDerrapeMaximo), .3, pc.SineOut).start()
        } else if ("izquierda" == t) {
        e = this.calculaNewDerrape();
        null != this.autoMotoDerrape.tweenVar && this.autoMotoDerrape.tweenVar.stop(), this.autoMotoDerrape.tweenVar = this.autoMotoDerrape.tween(this.autoMotoDerrape.getLocalEulerAngles()).rotate(new pc.Vec3(0, e, -this.inclinacionDerrapeMaxima), .5, pc.SineOut).onUpdate((() => {
            this.rotPiloto()
        })).start(), clearInterval(this.hiloReiniciarDerrape), null != this.camaraDobla.tweenVar && this.camaraDobla.tweenVar.stop(), this.camaraDobla.tweenVar = this.camaraDobla.tween(this.camaraDobla.getLocalEulerAngles()).rotate(new pc.Vec3(0, 0, this.giroDobladaCamaraDerrapeMaximo), .3, pc.SineOut).start()
    }
}, AutoControl.prototype.posibleCasoSoltarDerecha = function() {
    this.hiloCasoSoltarDerecha = clearInterval(this.hiloCasoSoltarDerecha), this.hiloCasoSoltarDerecha = setInterval(this.casoSoltarDerecha.bind(this), 1e3 * toleranciaDobleTap)
}, AutoControl.prototype.casoSoltarDerecha = function() {
    this.enGiroDer = 0, this.hiloCasoSoltarDerecha = clearInterval(this.hiloCasoSoltarDerecha), 0 == this.enGiroIzq ? 1 == this.enDerrape ? (null != this.autoMotoDerrape.tweenVar && this.autoMotoDerrape.tweenVar.stop(), this.autoMotoDerrape.tweenVar = this.autoMotoDerrape.tween(this.autoMotoDerrape.getLocalEulerAngles()).rotate(new pc.Vec3(0, 0, 0), .4, pc.SineOut).onUpdate((() => {
        this.rotPiloto()
    })).start(), clearInterval(this.hiloReiniciarDerrape), null != this.camaraDobla.tweenVar && this.camaraDobla.tweenVar.stop(), this.camaraDobla.tweenVar = this.camaraDobla.tween(this.camaraDobla.getLocalEulerAngles()).rotate(new pc.Vec3(0, 0, 0), .3, pc.SineOut).start(), this.hiloReiniciarDerrape = setInterval(this.reiniciarDerrape.bind(this), 250), this.autoMotoGiro.tween(this.autoMotoGiro.getLocalEulerAngles()).rotate(new pc.Vec3(0, 0, 0), .3, pc.SineOut).start()) : (this.autoMotoGiro.tween(this.autoMotoGiro.getLocalEulerAngles()).rotate(new pc.Vec3(0, 0, 0), .3, pc.SineOut).start(), null != this.camaraDobla.tweenVar && this.camaraDobla.tweenVar.stop(), this.camaraDobla.tweenVar = this.camaraDobla.tween(this.camaraDobla.getLocalEulerAngles()).rotate(new pc.Vec3(0, 0, 0), .3, pc.SineOut).start()) : null == this.hiloCasoSoltarIzquierda && this.casoApretarIzquierda(!1)
}, AutoControl.prototype.casoApretarIzquierda = function(t) {
    if (!this.finalCarrera && 1 != this.enCaida && 1 != this.pauseGame)
        if (this.hiloCasoSoltarIzquierda = clearInterval(this.hiloCasoSoltarIzquierda), null != this.hiloCasoSoltarDerecha && (this.hiloCasoSoltarDerecha = clearInterval(this.hiloCasoSoltarDerecha), this.casoSoltarDerecha()), 1 == this.enGiroIzq && t && (this.factorNewVolante > 1.02 || pcControl) && "izquierda" == this.ladoDerrape && (this.casoDerrape(), this.ladoDerrape = ""), this.enGiroIzq = 1, this.speedGiroCar > 0 && (this.speedGiroCar = -1 * this.speedGiroCar), 1 == this.enGiroDer) 1 == this.enDerrape ? (null != this.autoMotoDerrape.tweenVar && this.autoMotoDerrape.tweenVar.stop(), this.autoMotoDerrape.tweenVar = this.autoMotoDerrape.tween(this.autoMotoDerrape.getLocalEulerAngles()).rotate(new pc.Vec3(0, 0, 0), .4, pc.SineOut).onUpdate((() => {
            this.rotPiloto()
        })).start(), null != this.camaraDobla.tweenVar && this.camaraDobla.tweenVar.stop(), this.camaraDobla.tweenVar = this.camaraDobla.tween(this.camaraDobla.getLocalEulerAngles()).rotate(new pc.Vec3(0, 0, 0), .3, pc.SineOut).start(), clearInterval(this.hiloReiniciarDerrape), this.hiloReiniciarDerrape = setInterval(function() {
            clearInterval(this.hiloReiniciarDerrape), 1 == this.enGiroDer && 1 == this.enGiroIzq && this.enDerrape && (this.hiloReiniciarDerrape = setInterval(this.reiniciarDerrape.bind(this), 250), this.autoMotoGiro.tween(this.autoMotoGiro.getLocalEulerAngles()).rotate(new pc.Vec3(0, 0, 0), .3, pc.SineOut).start())
        }.bind(this), 300)) : (null != this.autoMotoGiro.tweenVar && this.autoMotoGiro.tweenVar.stop(), this.autoMotoGiro.tweenVar = this.autoMotoGiro.tween(this.autoMotoGiro.getLocalEulerAngles()).rotate(new pc.Vec3(0, 0, 0), .3, pc.SineOut).onUpdate((() => {
            this.rotPiloto()
        })).start(), null != this.camaraDobla.tweenVar && this.camaraDobla.tweenVar.stop(), this.camaraDobla.tweenVar = this.camaraDobla.tween(this.camaraDobla.getLocalEulerAngles()).rotate(new pc.Vec3(0, 0, 0), .3, pc.SineOut).start());
        else if (0 == this.enDerrape)
        if (this.ladoDerrape = "izquierda", 0 == this.enLevantada) {
            var e = .35;
            this.doblaCarroseria("izquierda"), null != this.camaraDobla.tweenVar && this.camaraDobla.tweenVar.stop();
            var a = this.giroDobladaCamaraMaximo * e * 2;
            a >= 5.7 && (a = 5.7), this.camaraDobla.tweenVar = this.camaraDobla.tween(this.camaraDobla.getLocalEulerAngles()).rotate(new pc.Vec3(0, 0, a), .3, pc.SineOut).start()
        } else {
            e = .35;
            this.esMoto ? this.autoMotoGiro.tween(this.autoMotoGiro.getLocalEulerAngles()).rotate(new pc.Vec3(0, 0 * e, this.inclinacionNormalMaxima * e), .3, pc.SineOut).onUpdate((() => {
                this.rotPiloto()
            })).start() : this.autoMotoGiro.tween(this.autoMotoGiro.getLocalEulerAngles()).rotate(new pc.Vec3(0, this.inclinacionNormalMaxima * e, 0 * e), .3, pc.SineOut).start(), null != this.camaraDobla.tweenVar && this.camaraDobla.tweenVar.stop()
        }
    else pcControl && 0 == controlDefaultType ? this.derrapeButtonApretado ? (this.doblaCarroseria("izquierda"), _carSoundManager.PlaySkid()) : (this.reiniciarDerrape(), this.doblaCarroseria("izquierda")) : (this.doblaCarroseria("izquierda"), _carSoundManager.PlaySkid())
}, AutoControl.prototype.posibleCasoSoltarIzquierda = function() {
    this.hiloCasoSoltarIzquierda = clearInterval(this.hiloCasoSoltarIzquierda), this.hiloCasoSoltarIzquierda = setInterval(this.casoSoltarIzquierda.bind(this), 1e3 * toleranciaDobleTap)
}, AutoControl.prototype.casoSoltarIzquierda = function() {
    this.hiloCasoSoltarIzquierda = clearInterval(this.hiloCasoSoltarIzquierda), this.enGiroIzq = 0, 0 == this.enGiroDer ? 1 == this.enDerrape ? (null != this.autoMotoDerrape.tweenVar && this.autoMotoDerrape.tweenVar.stop(), this.autoMotoDerrape.tweenVar = this.autoMotoDerrape.tween(this.autoMotoDerrape.getLocalEulerAngles()).rotate(new pc.Vec3(0, 0, 0), .4, pc.SineOut).onUpdate((() => {
        this.rotPiloto()
    })).start(), clearInterval(this.hiloReiniciarDerrape), null != this.camaraDobla.tweenVar && this.camaraDobla.tweenVar.stop(), this.camaraDobla.tweenVar = this.camaraDobla.tween(this.camaraDobla.getLocalEulerAngles()).rotate(new pc.Vec3(0, 0, 0), .3, pc.SineOut).start(), this.hiloReiniciarDerrape = setInterval(this.reiniciarDerrape.bind(this), 250), this.autoMotoGiro.tween(this.autoMotoGiro.getLocalEulerAngles()).rotate(new pc.Vec3(0, 0, 0), .3, pc.SineOut).start()) : (this.autoMotoGiro.tween(this.autoMotoGiro.getLocalEulerAngles()).rotate(new pc.Vec3(0, 0, 0), .3, pc.SineOut).start(), null != this.camaraDobla.tweenVar && this.camaraDobla.tweenVar.stop(), this.camaraDobla.tweenVar = this.camaraDobla.tween(this.camaraDobla.getLocalEulerAngles()).rotate(new pc.Vec3(0, 0, 0), .3, pc.SineOut).start()) : null == this.hiloCasoSoltarDerecha && this.casoApretarDerecha(!1)
}, AutoControl.prototype.calculaNewDerrape = function() {
    var t = this.giroDerrapeMaximo,
        e = (0 - t) / -1.02 * (this.factorNewVolante - 1.02) + t;
    return e < 0 && (e = 0), e > this.giroDerrapeMaximo && (e = this.giroDerrapeMaximo), e
}, AutoControl.prototype.casoApretarFreno = function() {
    this.finalCarrera || 1 != this.enCaida && 1 != this.pauseGame && time > 0 && (this.frenada = this.speedFrenado)
}, AutoControl.prototype.enFrenado = function() {
    clearInterval(this.hiloEnFrenado), this.sinDerrape = !0
}, AutoControl.prototype.casoSoltarFreno = function() {
    time > 0 && (this.enStunt || (this.frenada = 1, clearInterval(this.hiloEnFrenado)))
}, AutoControl.prototype.casoDerrape = function() {
    var t = !0;
    (1 == this.enGiroIzq && 1 == this.enGiroDer && (t = !1), t) && (this.frenada = 1, clearInterval(this.hiloEnFrenado), 1 == this.enDerrape ? this.speed < this.maxSpeed * this.speedEnDerrape && (this.enDerrape = !1, _carSoundManager.StopSkid(), this.speedGiro = this.realSpeedGiro, clearInterval(this.hiloReiniciarDerrape), null != this.autoMotoDerrape.tweenVar && this.autoMotoDerrape.tweenVar.stop(), (1 == this.enGiroIzq || 1 == this.enGiroDer) && (this.autoMotoDerrape.tweenVar = this.autoMotoDerrape.tween(this.autoMotoDerrape.getLocalEulerAngles()).rotate(new pc.Vec3(0, 0, 0), .4, pc.SineOut).start(), null != this.camaraDobla.tweenVar && this.camaraDobla.tweenVar.stop(), this.camaraDobla.tweenVar = this.camaraDobla.tween(this.camaraDobla.getLocalEulerAngles()).rotate(new pc.Vec3(0, 0, 0), .3, pc.SineOut).start())) : !this.sinDerrape && this.speed >= this.maxSpeed * this.speedEnDerrape ? (clearInterval(this.hiloReiniciarDerrape), this.enDerrape = !0, parseInt(_menu.getKM()) > 180 && (this.speed = .9 * this.speed), this.speedGiro = this.speedGiroDerrape, null != this.autoMotoDerrape.tweenVar && this.autoMotoDerrape.tweenVar.stop(), this.autoMotoDerrape.tweenVar = this.autoMotoGiro.tween(this.autoMotoGiro.getLocalEulerAngles()).rotate(new pc.Vec3(0, 0, 0), .3, pc.SineOut).start(), 1 == this.enGiroIzq ? (this.autoMotoDerrape.tweenVar = this.autoMotoDerrape.tween(this.autoMotoDerrape.getLocalEulerAngles()).rotate(new pc.Vec3(0, this.giroDerrapeMaximo, -this.inclinacionDerrapeMaxima), .5, pc.SineOut).start(), null != this.camaraDobla.tweenVar && this.camaraDobla.tweenVar.stop(), this.camaraDobla.tweenVar = this.camaraDobla.tween(this.camaraDobla.getLocalEulerAngles()).rotate(new pc.Vec3(0, 0, this.giroDobladaCamaraDerrapeMaximo), .3, pc.SineOut).start(), _carSoundManager.PlaySkid()) : 1 == this.enGiroDer ? (this.autoMotoDerrape.tweenVar = this.autoMotoDerrape.tween(this.autoMotoDerrape.getLocalEulerAngles()).rotate(new pc.Vec3(0, -this.giroDerrapeMaximo, this.inclinacionDerrapeMaxima), .5, pc.SineOut).start(), null != this.camaraDobla.tweenVar && this.camaraDobla.tweenVar.stop(), this.camaraDobla.tweenVar = this.camaraDobla.tween(this.camaraDobla.getLocalEulerAngles()).rotate(new pc.Vec3(0, 0, -this.giroDobladaCamaraDerrapeMaximo), .3, pc.SineOut).start(), _carSoundManager.PlaySkid()) : this.hiloReiniciarDerrape = setInterval(this.reiniciarDerrape.bind(this), 250)) : (this.sinDerrape = !1, this.speedGiro = this.realSpeedGiro))
}, AutoControl.prototype.casoApretarTurbo = function() {
    this.finalCarrera || 1 != this.enCaida && 1 != this.pauseGame && (this.enLevantada || 0 != turbo && time > 0 && 0 == this.enLevantada && 0 == this.enStunt && turbo > 0 && this.speed >= this.maxSpeed * this.limitePermitirTurbo && (this.metodoLevantada(), turbo -= 1, turboBar = 0, _menu.setTurbo(0), this.turboManual = !0))
}, AutoControl.prototype.onKeyDown = function(t) {
    if (pcControl && (!pcControl || 1 != controlDefaultType)) {
        t.key == pc.KEY_SHIFT && this.app.keyboard.wasPressed(pc.KEY_SHIFT) && (this.derrapeButtonApretado = !0, 1 == this.enGiroIzq ? (this.ladoDerrape = "izquierda", this.casoApretarIzquierda(this.derrapeButtonApretado)) : 1 == this.enGiroDer ? (this.ladoDerrape = "derecha", this.casoApretarDerecha(this.derrapeButtonApretado)) : this.derrapeMarcado = !0), (t.key == pc.KEY_LEFT && this.app.keyboard.wasPressed(pc.KEY_LEFT) || t.key == pc.KEY_A && this.app.keyboard.wasPressed(pc.KEY_A)) && (this.casoApretarIzquierda(this.derrapeButtonApretado), this.derrapeMarcado && this.casoApretarIzquierda(this.derrapeButtonApretado)), (t.key == pc.KEY_RIGHT && this.app.keyboard.wasPressed(pc.KEY_RIGHT) || t.key == pc.KEY_D && this.app.keyboard.wasPressed(pc.KEY_D)) && (this.casoApretarDerecha(this.derrapeButtonApretado), this.derrapeMarcado && this.casoApretarDerecha(this.derrapeButtonApretado)), (t.key == pc.KEY_W && this.app.keyboard.wasPressed(pc.KEY_W) || t.key == pc.KEY_UP && this.app.keyboard.wasPressed(pc.KEY_UP)) && this.casoApretarTurbo(), t.key == pc.KEY_P && (_menu.pausePanel.enabled || _menu.clickPause())
    }
}, AutoControl.prototype.onKeyUp = function(t) {
    pcControl && (pcControl && 1 == controlDefaultType || this.soltarTecla(t.key, !1))
}, AutoControl.prototype.soltarTecla = function(t, e) {
    pcControl && (pcControl && 1 == controlDefaultType || (t == pc.KEY_SHIFT && (this.derrapeButtonApretado = !1, this.derrapeMarcado = !1, 1 == this.enDerrape && (null != this.autoMotoDerrape.tweenVar && this.autoMotoDerrape.tweenVar.stop(), this.autoMotoDerrape.tweenVar = this.autoMotoDerrape.tween(this.autoMotoDerrape.getLocalEulerAngles()).rotate(new pc.Vec3(0, 0, 0), .4, pc.SineOut).onUpdate((() => {
        this.rotPiloto()
    })).start(), clearInterval(this.hiloReiniciarDerrape), null != this.camaraDobla.tweenVar && this.camaraDobla.tweenVar.stop(), this.camaraDobla.tweenVar = this.camaraDobla.tween(this.camaraDobla.getLocalEulerAngles()).rotate(new pc.Vec3(0, 0, 0), .3, pc.SineOut).start(), this.reiniciarDerrape(), this.autoMotoGiro.tween(this.autoMotoGiro.getLocalEulerAngles()).rotate(new pc.Vec3(0, 0, 0), .3, pc.SineOut).start())), t != pc.KEY_LEFT && t != pc.KEY_A || (ladoAnterior = "izq", this.posibleCasoSoltarIzquierda(), this.derrapeButtonApretado && (this.derrapeMarcado = !0)), t != pc.KEY_RIGHT && t != pc.KEY_D || (ladoAnterior = "der", this.posibleCasoSoltarDerecha(), this.derrapeButtonApretado && (this.derrapeMarcado = !0))))
}, AutoControl.prototype.poneEventos = function() {
    isMobile.any() ? (this.app.touch.on(pc.EVENT_TOUCHSTART, this.onTouchStart, this), this.app.touch.on(pc.EVENT_TOUCHMOVE, this.onTouchMove, this), this.app.touch.on(pc.EVENT_TOUCHEND, this.onTouchEnd, this)) : (this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this), this.app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this), this.app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this), document.removeEventListener("mouseout", this.onMouseOut.bind(this))), addEventFunction(_menu.GUI_pause, !0, 1, _menu.clickPause.bind(_menu)), this.app.keyboard.on(pc.EVENT_KEYDOWN, this.onKeyDown, this), this.app.keyboard.on(pc.EVENT_KEYUP, this.onKeyUp, this)
}, AutoControl.prototype.prendeDerrapes = function(t, e) {
    if (t) {
        if ("tierra" == e) {
            if (this.particulasDerrapeTierraIzq.enabled) return
        } else if (this.particulasDerrapeIzq.enabled) return
    } else if ("tierra" == e) {
        if (!this.particulasDerrapeTierraIzq.enabled) return
    } else if (!this.particulasDerrapeIzq.enabled) return;
    "tierra" == e ? (t && (this.particulasDerrapeIzq.enabled = !1, this.particulasDerrapeDer.enabled = !1), this.particulasDerrapeTierraIzq.enabled = t, this.particulasDerrapeTierraDer.enabled = t) : (t && (this.particulasDerrapeTierraIzq.enabled = !1, this.particulasDerrapeTierraDer.enabled = !1), this.particulasDerrapeIzq.enabled = t, this.particulasDerrapeDer.enabled = t)
}, AutoControl.prototype.prendeTurbos = function(t, e) {
    if (t) {
        if ("izq" == e) {
            if (this.efectoTurboLeft.enabled) return
        } else if (this.efectoTurboRight.enabled) return
    } else if ("izq" == e) {
        if (!this.efectoTurboLeft.enabled) return
    } else if (!this.efectoTurboRight.enabled) return;
    "izq" == e ? (this.efectoTurboLeft.enabled = t, this.particulasNitroLeft.enabled = t) : (this.efectoTurboRight.enabled = t, this.particulasNitroRight.enabled = t)
}, AutoControl.prototype.prendeChoques = function(t, e) {
    "bordeIzq" == e ? t && (reproduceParticulas(this.particulasChoqueIzq, 1300), reproduceParticulas(this.particulasChoqueIzq2, 1300)) : "bordeDer" == e && t && (reproduceParticulas(this.particulasChoqueDer, 1300), reproduceParticulas(this.particulasChoqueDer2, 1300))
}, AutoControl.prototype.configuraParticulas = function() {
    if (this.speed >= .5 * this.maxSpeed) {
        var t = .5 * this.maxSpeed,
            e = 1 / (.9 * this.maxSpeed - t) * (this.speed - t) + 0,
            a = this.app.graphicsDevice.width > this.app.graphicsDevice.height ? 2.2 : 1;
        this.enLevantada ? (this.efectoViento.enabled && (this.efectoViento.enabled = !1), this.efectoVientoFov.enabled || (this.efectoVientoFov.enabled = !0), this.efectoVientoFov.sprite.opacity = e, this.efectoVientoFov.setLocalScale(.317 * a, .317, .33)) : (this.efectoViento.enabled || (this.efectoViento.enabled = !0), this.efectoVientoFov.enabled && (this.efectoVientoFov.enabled = !1), this.efectoViento.sprite.opacity = e, this.efectoViento.setLocalScale(.232 * a, .226, .22))
    } else this.efectoViento.enabled && (this.efectoViento.enabled = !1), this.efectoVientoFov.enabled && (this.efectoVientoFov.enabled = !1);
    1 == this.superficie ? this.speed > 0 ? (this.prendeDerrapes(!0, "tierra"), this.prendeDerrapes(!1, "humo")) : (this.prendeDerrapes(!1, "tierra"), this.prendeDerrapes(!1, "humo")) : 0 == this.superficie && (this.prendeDerrapes(!1, "tierra"), this.prendeDerrapes(!1, "humo")), 1 == this.enDerrape ? 0 == this.superficie ? (this.prendeDerrapes(!1, "tierra"), this.prendeDerrapes(!0, "humo")) : 1 == this.superficie && (this.prendeDerrapes(!0, "tierra"), this.prendeDerrapes(!1, "humo")) : (0 == this.superficie && this.prendeDerrapes(!1, "tierra"), this.prendeDerrapes(!1, "humo")), 1 == this.enLevantada ? (this.prendeTurbos(!0, "izq"), this.prendeTurbos(!0, "der")) : (this.prendeTurbos(!1, "izq"), this.prendeTurbos(!1, "der"))
}, AutoControl.prototype.mataEventos = function() {
    isMobile.any() ? (this.app.touch.off(pc.EVENT_TOUCHSTART, this.onTouchStart, this), this.app.touch.off(pc.EVENT_TOUCHMOVE, this.onTouchMove, this), this.app.touch.off(pc.EVENT_TOUCHEND, this.onTouchEnd, this)) : (this.app.mouse.off(pc.EVENT_MOUSEDOWN, this.onMouseDown, this), this.app.mouse.off(pc.EVENT_MOUSEMOVE, this.onMouseMove, this), this.app.mouse.off(pc.EVENT_MOUSEUP, this.onMouseUp, this), document.removeEventListener("mouseout", this.onMouseOut.bind(this))), addEventFunction(_menu.GUI_pause, !1), this.app.keyboard.off(pc.EVENT_KEYDOWN, this.onKeyDown, this), this.app.keyboard.off(pc.EVENT_KEYUP, this.onKeyUp, this)
}, AutoControl.prototype.clickIzquierdo = function(t) {}, AutoControl.prototype.clickDerecho = function(t) {}, AutoControl.prototype.onMouseDown = function(t) {
    var e = t.x,
        a = t.y;
    this.Click(e, a)
}, AutoControl.prototype.onTouchStart = function(t) {
    var e = t.touches[0].x,
        a = t.touches[0].y;
    this.Click(e, a)
}, AutoControl.prototype.onMouseMove = function(t) {
    var e = t.x,
        a = t.y;
    this.Move(e, a, t)
}, AutoControl.prototype.onTouchMove = function(t) {
    var e = t.touches[0].x,
        a = t.touches[0].y;
    this.lastTouchPosition = {
        x: e,
        y: a
    }, this.Move(e, a, t)
}, AutoControl.prototype.onMouseUp = function(t) {
    var e = t.x,
        a = t.y;
    this.Up(e, a)
}, AutoControl.prototype.onTouchEnd = function(t) {
    null == this.lastTouchPosition ? this.Up() : this.Up(this.lastTouchPosition.x, this.lastTouchPosition.y)
}, AutoControl.prototype.Click = function(t, e) {}, AutoControl.prototype.contadorTiempo = function() {}, AutoControl.prototype.Move = function(t, e, a) {}, AutoControl.prototype.Up = function(t, e) {}, AutoControl.prototype.onMouseOut = function() {}, AutoControl.prototype.destruyeTodo = function(t) {
    this.casoSoltarDerecha(), this.casoSoltarIzquierda(), this.speed = 0, _traficoSystem.matar(), clearInterval(_menu.hiloTiempo), _sonidos.slot("pocoTiempo").stop(), t && (_sonidos.slot("Music1").stop(), _sonidos.slot("Music2").stop(), _sonidos.slot("Music3").stop(), _sonidos.slot("loopPlaya").stop()), this.finLevantadaInsta(), this.seteaDenegarDerrape(), this.reiniciarDerrape(), this.prendeTurbos("izq", !1), this.prendeTurbos("der", !1), this.prendeDerrapes("tierra", !1), this.prendeDerrapes("humo", !1), this.configuraParticulas(), null != this.hiloPosibleFinLevantada && this.hiloPosibleFinLevantada.stop(), null != this.hiloFinLevantada && this.hiloFinLevantada.stop(), null != this.hiloReiniciaLevantada && this.hiloReiniciaLevantada.stop(), this.mataEventos(), this.enPartida = !1, _menu.sacaEventosHud(), this.carroseria.setPosition(this.entity.getPosition()), this.carroseria.translateLocal(0, 0, .8 * -.1), this.contenedorCamara.setPosition(this.entity.getPosition()), this.calculaCamaraATAD(this.speed), this.skybox.setLocalPosition(new pc.Vec3(this.entity.getLocalPosition().x, this.skybox.getLocalPosition().y, this.entity.getLocalPosition().z)), permitirPause = !1
};
var _sonidos, _autoControl, _traficoSystem, _menu, _tramos, _carSoundManager, fps, toleranciaDobleTap = .1,
    conDebugRay = !1,
    totalVidas = 3,
    vidas = 0,
    _globalScore = 0,
    _raceScore = 0,
    time = 0,
    totalTime = 60,
    colorParpadeo = "#ff0000",
    colorNormal = "#FFFF67",
    ladoAnterior = "",
    turbo = 0,
    initialTurbo = 1,
    maxTurbo = 0,
    turboBar = 0,
    turboBarTween = null,
    turboBarTweenMax = null,
    totalAutos = 6,
    autoElegido = 0,
    colorElegido = [0, 0, 0, 0, 0, 0],
    currentPosition = null,
    currentPorcentaje = 0,
    currentTramo = 0,
    maxSpeed = 60,
    speedGiro = 30,
    aceleradaIni = 3.43,
    aceleradaMid = 1.75,
    aceleradaEnd = .84,
    checkPointCant = 0,
    checkPointScore = 1e3,
    zoneClearedCant = 0,
    zoneClearedScore = 5e3,
    distanceScore = 0,
    currentCheckpoint = 0,
    distanciaCheckIni = 0,
    pcControl = !1,
    currentTematica = "playa",
    tramoInicialTematica = null,
    tutorialMostrado = !1,
    enGoogle = !0,
    volumeMaster = !0,
    rewardAd = null,
    rewardType = null,
    rewardCallback = null,
    rewardPanelAd = null,
    hiloReward = null,
    controlDefaultType = 0,
    cheat = !1,
    perm = [151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180, 151];

function esColiderBordes(e) {
    return "bordeIzq" == e.entity.name || "bordeDer" == e.entity.name
}

function esCamino(e) {
    return "camino" == e.entity.name || "caminoArena" == e.entity.name
}
var autosCost = [100, 100, 300, 500, 700, 999],
    colorCost = [
        [100, 100, 100, 200],
        [100, 100, 100, 200],
        [100, 100, 100, 200],
        [100, 100, 100, 200],
        [100, 100, 100, 200],
        [100, 100, 100, 200]
    ],
    upgradeCost = [
        [50, 75, 100, 150, 200],
        [75, 100, 150, 200, 250],
        [75, 100, 150, 200, 300],
        [100, 150, 200, 300, 400]
    ],
    upgradeMax = [
        [5, 5, 5, 5],
        [5, 5, 5, 5],
        [5, 5, 5, 5],
        [5, 5, 5, 5],
        [5, 5, 5, 5],
        [5, 5, 5, 5]
    ],
    autosData = [{
        maxSpeed: 1,
        aceleration: 1,
        steering: 1,
        turbo: 1,
        locked: 0
    }, {
        maxSpeed: 1,
        aceleration: 1,
        steering: 1,
        turbo: 1,
        locked: 1
    }, {
        maxSpeed: 1,
        aceleration: 1,
        steering: 1,
        turbo: 1,
        locked: 1
    }, {
        maxSpeed: 1,
        aceleration: 1,
        steering: 1,
        turbo: 1,
        locked: 1
    }, {
        maxSpeed: 1,
        aceleration: 1,
        steering: 1,
        turbo: 1,
        locked: 1
    }, {
        maxSpeed: 1,
        aceleration: 1,
        steering: 1,
        turbo: 1,
        locked: 1
    }],
    colorData = [{
        color1: {
            cost: 100,
            locked: 0
        },
        color2: {
            cost: 100,
            locked: 1
        },
        color3: {
            cost: 100,
            locked: 1
        },
        color4: {
            cost: 200,
            locked: 1
        }
    }, {
        color1: {
            cost: 100,
            locked: 0
        },
        color2: {
            cost: 100,
            locked: 1
        },
        color3: {
            cost: 100,
            locked: 1
        },
        color4: {
            cost: 200,
            locked: 1
        }
    }, {
        color1: {
            cost: 100,
            locked: 0
        },
        color2: {
            cost: 100,
            locked: 1
        },
        color3: {
            cost: 100,
            locked: 1
        },
        color4: {
            cost: 200,
            locked: 1
        }
    }, {
        color1: {
            cost: 100,
            locked: 0
        },
        color2: {
            cost: 100,
            locked: 1
        },
        color3: {
            cost: 100,
            locked: 1
        },
        color4: {
            cost: 200,
            locked: 1
        }
    }, {
        color1: {
            cost: 100,
            locked: 0
        },
        color2: {
            cost: 100,
            locked: 1
        },
        color3: {
            cost: 100,
            locked: 1
        },
        color4: {
            cost: 200,
            locked: 1
        }
    }, {
        color1: {
            cost: 100,
            locked: 0
        },
        color2: {
            cost: 100,
            locked: 1
        },
        color3: {
            cost: 100,
            locked: 1
        },
        color4: {
            cost: 200,
            locked: 1
        }
    }],
    bestScore = 0,
    monedas = 0,
    pauseFlag = !1,
    pantalla = "",
    permitirPause = !1,
    currentMuteMusic = 0,
    currentMuteSound = 0,
    currentAudioGameSnack = !0,
    currencyAux = 0,
    typeAux = "",
    callBackAux = null,
    intervalCheck = null;

function PrepareRewardAd(e) {
    return new Promise(((o, a) => {
        enGoogle ? (console.log("Preparing ad rewawd " + e), GameSnacks.ad.break({
            type: "reward",
            name: "button_doubleReward",
            beforeAd: () => {
                BeforeVideoAd()
            },
            beforeReward: a => {
                console.log("reward ad function created, stored in rewardAd variable, and booster name is: " + e), console.log(a), rewardAd = a, o(!0)
            },
            adDismissed: () => {
                console.log("AD WAS CLOSED NOT VIEWED")
            },
            adViewed: () => {
                console.log("AD WAS VIEWED and CLOSED")
            },
            adBreakDone: e => {
                null == rewardAd ? (console.log("reward ad is not prepared because some api error, here's the placementInfo:"), console.log(e), o(!1)) : (console.log("reward ad is OK and showed, here's the placement info:"), console.log(e), AfterVideoAd(e))
            }
        })) : o(!0)
    })).then()
}
var desmutearDespuesDeAdSound = !1,
    desmutearDespuesDeAdMusic = !1;

function BeforeVideoAd() {
    console.log("ANTES DE VER EL AD!!! "), (enGoogle ? GameSnacks.audio.isEnabled() : volumeMaster) && (0 == muteValSound && (mutear(1, "sound"), desmutearDespuesDeAdSound = !0), 0 == muteValMusic && (mutear(1, "music"), desmutearDespuesDeAdMusic = !0))
}

function AfterVideoAd(e) {
    (rewardAd = null, console.log("Reward Ad Just saw with placement info details"), console.log(e), desmutearDespuesDeAdSound) && ((enGoogle ? GameSnacks.audio.isEnabled() : volumeMaster) && 1 == muteValSound && (mutear(0, "sound"), desmutearDespuesDeAdSound = !1));
    desmutearDespuesDeAdMusic && ((enGoogle ? GameSnacks.audio.isEnabled() : volumeMaster) && 1 == muteValMusic && (mutear(0, "music"), desmutearDespuesDeAdMusic = !1));
    var o = rewardType;
    rewardType = null, "viewed" == e.breakStatus ? (console.log("Ad reward viewed fully, reward apply"), "doubleReward" == o && AfterAd(2, o, e.breakStatus)) : (console.log("Ad reward not viewed, reward NOT apply"), AfterAd(1, o, e.breakStatus))
}

function PrepareInterstitital(e) {
    e()
}

function AfterInterstitialAd(e, o) {
    (console.log("DESPUES  DE VER EL INTERSTITIAL AD!!! "), console.log(e), desmutearDespuesDeAdSound) && ((enGoogle ? GameSnacks.audio.isEnabled() : volumeMaster) && 1 == muteValSound && (mutear(0, "sound"), desmutearDespuesDeAdSound = !1));
    desmutearDespuesDeAdMusic && ((enGoogle ? GameSnacks.audio.isEnabled() : volumeMaster) && 1 == muteValMusic && (mutear(0, "music"), desmutearDespuesDeAdMusic = !1));
    o()
}

function isAdReady() {
    return null != rewardAd
}
async function ShowRewardPanel(e, o, a) {
    console.log("SE PONE EL PANEL REWARD con currency " + e), currencyAux = e, typeAux = o, callBackAux = a, rewardAd = null, rewardPanelAd.enabled = !1, _menu.tapador.enabled = !0;
    var r = await PrepareRewardAd(o);
    if (rewardCallback = a, r) {
        if (enGoogle && !isAdReady()) return console.log("promise is ready but reward is not prepared"), _menu.tapador.enabled = !1, void AfterAd(1, o, "none");
        var l = rewardPanelAd.children[3],
            d = rewardPanelAd.children[2];
        rewardPanelAd.children[1].children[0].element.text = "+" + e, rewardPanelAd.enabled = !0, _menu.tapador.enabled = !1, addEventFunction(l, !1), addEventFunction(l, !0, 1, (() => {
            playSound("click"), addEventFunction(l, !1), addEventFunction(d, !1), rewardType = o, console.log("llamaremos a rewardAd con type " + rewardType), enGoogle ? rewardAd() : AfterAd(2, rewardType, "none")
        })), addEventFunction(d, !1), addEventFunction(d, !0, 1, (() => {
            console.log("se cancela  rewardAd con type " + rewardType), playSound("click"), addEventFunction(l, !1), addEventFunction(d, !1), AfterAd(1, rewardType, "none")
        }))
    } else _menu.tapador.enabled = !1, AfterAd(1, o, "none")
}

function AfterAd(e, o, a) {
    console.log("Ejecutaremos callback del tipo " + o + " y el status " + a + " y fue multi? " + e), rewardPanelAd.enabled = !1, 2 == e ? (rewardCallback(e), rewardCallback = null, clearTimeout(hiloReward)) : (null != rewardCallback && rewardCallback(e), rewardCallback = null)
}
var minimizado = !1;
document.addEventListener("visibilitychange", (function() {
    document.hidden ? (console.log("pause"), minimizado = !0, "race" != pantalla || null == _menu || _menu.GUI_tutorial3D.enabled || _menu.clickPause()) : (isMobile.iOS() && alert("Press OK to return to the game"), console.log("unpause"), setTimeout((() => {
        minimizado = !1
    }), 60))
})), window.addEventListener("resize", (function() {
    null != rewardPanelAd && rewardPanelAd.enabled && null != rewardAd && (clearTimeout(intervalCheck), intervalCheck = setTimeout((() => {
        console.log("the ad is already made, but resize event will bug the video, creating a new reward ad"), rewardAd(), setTimeout((() => {
            ShowRewardPanel(currencyAux, typeAux, callBackAux)
        }), 30)
    }), 120))
}));
var Menu = pc.createScript("menu");
Menu.attributes.add("botonIzq", {
    type: "entity"
}), Menu.attributes.add("botonDer", {
    type: "entity"
}), Menu.attributes.add("boton", {
    type: "entity"
}), Menu.attributes.add("botonTurbo", {
    type: "entity"
}), Menu.attributes.add("metaInicial", {
    type: "entity"
}), Menu.attributes.add("checkPointMSG", {
    type: "entity"
}), Menu.attributes.add("timeOutMSG", {
    type: "entity"
}), Menu.attributes.add("gameOverMSG", {
    type: "entity"
}), Menu.attributes.add("zoneCompleteMSG", {
    type: "entity"
}), Menu.attributes.add("GUI_MSG_carpass", {
    type: "entity"
}), Menu.attributes.add("GUI_MSG_turboGet", {
    type: "entity"
}), Menu.attributes.add("GUI_time", {
    type: "entity"
}), Menu.attributes.add("GUI_score", {
    type: "entity"
}), Menu.attributes.add("GUI_vidas", {
    type: "entity"
}), Menu.attributes.add("GUI_KM", {
    type: "entity"
}), Menu.attributes.add("GUI_turbo", {
    type: "entity"
}), Menu.attributes.add("GUI_check", {
    type: "entity"
}), Menu.attributes.add("GUI_turboAnim", {
    type: "entity"
}), Menu.attributes.add("GUI_checkAnim", {
    type: "entity"
}), Menu.attributes.add("GUI_pause", {
    type: "entity"
}), Menu.attributes.add("GUI_colores", {
    type: "entity"
}), Menu.attributes.add("GUI_GO", {
    type: "entity"
}), Menu.attributes.add("GUI_IZQ", {
    type: "entity"
}), Menu.attributes.add("GUI_DER", {
    type: "entity"
}), Menu.attributes.add("GUI_tapador", {
    type: "entity"
}), Menu.attributes.add("GUI_main", {
    type: "entity"
}), Menu.attributes.add("GUI_bolas", {
    type: "entity"
}), Menu.attributes.add("GUI_monedas", {
    type: "entity"
}), Menu.attributes.add("GUI_GarageBars", {
    type: "entity"
}), Menu.attributes.add("GUI_mainBuyCar", {
    type: "entity"
}), Menu.attributes.add("main3D", {
    type: "entity"
}), Menu.attributes.add("autosManager", {
    type: "entity"
}), Menu.attributes.add("pausePanel", {
    type: "entity"
}), Menu.attributes.add("endPanel_obscurecedor", {
    type: "entity"
}), Menu.attributes.add("endPanel_titulo", {
    type: "entity"
}), Menu.attributes.add("endPanel_data", {
    type: "entity"
}), Menu.attributes.add("endPanel_reward", {
    type: "entity"
}), Menu.attributes.add("endPanel_restart", {
    type: "entity"
}), Menu.attributes.add("endPanel_garage", {
    type: "entity"
}), Menu.attributes.add("endPanel_garageGlow", {
    type: "entity"
}), Menu.attributes.add("endPanel3D", {
    type: "entity"
}), Menu.attributes.add("GUI_bestScore", {
    type: "entity"
}), Menu.attributes.add("GUI_Logo", {
    type: "entity"
}), Menu.attributes.add("GUI_Garage", {
    type: "entity"
}), Menu.attributes.add("GUI_tutob", {
    type: "entity"
}), Menu.attributes.add("GUI_camaraGarage", {
    type: "entity"
}), Menu.attributes.add("GUI_tutorial3D", {
    type: "entity"
}), Menu.attributes.add("GUI_tutorialUp", {
    type: "entity"
}), Menu.attributes.add("GUI_tutorialDown", {
    type: "entity"
}), Menu.attributes.add("GUI_tutorialCenter", {
    type: "entity"
}), Menu.attributes.add("rewardPanelAd", {
    type: "entity"
}), Menu.attributes.add("countDown", {
    type: "entity"
}), Menu.attributes.add("tapToStart", {
    type: "entity"
}), Menu.attributes.add("startCount", {
    type: "entity"
}), Menu.attributes.add("tapador", {
    type: "entity"
}), Menu.prototype.initialize = function() {
    _menu = this, rewardPanelAd = this.rewardPanelAd, enGoogle && GameSnacks.game.firstFrameReady(), this.currentColor = "normal", this.plataforma = this.main3D.findByName("plataformas"), this._screen2D = this.app.root.findByName("2DScreen"), this.garageTecho = this.GUI_camaraGarage.parent.findByName("garage-piso2_techo"), this.app.graphicsDevice.width > this.app.graphicsDevice.height ? .87 != this._screen2D.screen.scaleBlend && (this._screen2D.screen.scaleBlend = .87, this.GUI_camaraGarage.camera.fov = 34, this.GUI_camaraGarage.setLocalPosition(.002, .254, .38), this.garageTecho.enabled = !0) : .5 != this._screen2D.screen.scaleBlend && (this._screen2D.screen.scaleBlend = .5, this.GUI_camaraGarage.camera.fov = 45, this.GUI_camaraGarage.setLocalPosition(.002, .329, .38), this.garageTecho.enabled = !1), getAllVars(), this.indexPlataforma = autoElegido, this.GUI_colores.children[autoElegido].enabled = !0, this.selectAuto(autoElegido), this.anguloPlataforma = 0, this.tweenPlataforma = null, this.ladoAux = 0, this.poneEventosMain(), this.setPlataforma(!0), this.setGameGUI(!1), this.setMainGUI(!0, !1), playSound("menuMusic", !0), this.enGarage = !1, this.pintarMonedas(), this.pintarBestScore(), permitirPause = !1, isMobile.any() ? pcControl = !1 : pcControl = !0, pantalla = "menu", enGoogle && (console.log("SE llamara a gamesnack READY"), GameSnacks.game.ready(), GameSnacks.audio.subscribe((e => {
        console.log("dentro del subcribe audio de google tenemos el audio enabled?? " + e);
        var t = e,
            a = this.pausePanel.findByName("muteSound"),
            n = this.pausePanel.findByName("muteMusic");
        t ? (muteValSound = 0, muteValMusic = 0, mutear(0, "sound"), a.children[0].enabled = !0, a.children[1].enabled = !1, mutear(0, "music"), n.children[0].enabled = !0, n.children[1].enabled = !1) : (muteValSound = 1, muteValMusic = 1, mutear(1, "sound"), a.children[1].enabled = !0, a.children[0].enabled = !1, mutear(1, "music"), n.children[1].enabled = !0, n.children[0].enabled = !1)
    }))), this.audioChange(), this.tap = 0, this.press = !1, this.hiloTap = null, this.toleranciaTap = 300, this.GUI_tapador.enabled = !0, this.GUI_tapador.element.opacity = 1;
    var e = {
        x: 1
    };
    this.app.tween(e).to({
        x: 0
    }, 1.1, pc.SineOut).onUpdate((() => {
        this.GUI_tapador.element.opacity = e.x
    })).onComplete((() => {
        this.GUI_tapador.enabled = !1, fps.bench()
    })).start()
}, Menu.prototype.setPlataforma = function(e) {
    this.anguloPlataforma = -60 * autoElegido;
    var t = this.plataforma;
    e ? setTimeout((() => {
        t.setLocalEulerAngles(0, this.anguloPlataforma, 0), this.GUI_colores.children[this.ladoAux].enabled = !1, this.GUI_colores.children[autoElegido].enabled = !0, this.GUI_Garage.element.opacity = 1, this.GUI_tutob.element.opacity = 1, this.GUI_main.element.opacity = 1, this.GUI_DER.enabled = !0, this.GUI_IZQ.enabled = !0, this.selectAuto(autoElegido)
    }), 120) : this.tweenPlataforma = t.tween(t.getLocalEulerAngles()).rotate(new pc.Vec3(0, this.anguloPlataforma, 0), .6, pc.SineOut).start().onComplete((() => {
        this.GUI_colores.children[this.ladoAux].enabled = !1, this.GUI_colores.children[autoElegido].enabled = !0, this.GUI_Garage.element.opacity = 1, this.GUI_tutob.element.opacity = 1, this.GUI_main.element.opacity = 1, this.GUI_DER.enabled = !0, this.GUI_IZQ.enabled = !0, this.selectAuto(autoElegido)
    }))
}, Menu.prototype.CountDownMethod = function(e, t) {
    switch (this.countDown.element.text = e, this.startCount, e) {
        case 3:
            playSound("tres");
            break;
        case 2:
            playSound("dos");
            break;
        case 1:
            playSound("uno");
            break;
        case 0:
            playSound("go")
    }
    if (this.countDown.enabled = !0, 0 == e) return this.countDown.enabled = !1, void t();
    this.countDown.tween(this.countDown.getLocalPosition()).to(this.countDown.getLocalPosition(), 1, pc.Linear).onComplete((() => {
        this.CountDownMethod(e - 1, t)
    })).start()
}, Menu.prototype.clickLado = function(e) {
    if (null == this.tweenPlataforma || !this.tweenPlataforma.playing) {
        this.setMainGUI(!0, this.enGarage), this.GUI_DER.enabled = !1, this.GUI_IZQ.enabled = !1, this.GUI_GO.element.opacity = .5, this.GUI_Garage.element.opacity = .5, this.GUI_tutob.element.opacity = .5, this.GUI_main.element.opacity = .5, playSound("pauseEntrar"), this.indexPlataforma = this.indexPlataforma + e, this.indexPlataforma == totalAutos ? this.indexPlataforma = 0 : -1 == this.indexPlataforma && (this.indexPlataforma = totalAutos - 1), this.ladoAux = autoElegido, autoElegido = this.indexPlataforma, this.setPlataforma();
        var t = colorElegido[autoElegido];
        this.GUI_colores.children[autoElegido].children[t].children[2].enabled = !0;
        for (var a = 0; a < this.GUI_bolas.children.length - 1; a++) this.GUI_bolas.children[a].children[0].enabled = !1;
        this.GUI_bolas.children[autoElegido].children[0].enabled = !0, guardaAllVars()
    }
}, Menu.prototype.clickTutobMain = function() {
    null != this.tweenPlataforma && this.tweenPlataforma.playing || 1 == this.GUI_tutob.element.opacity && (playSound("click"), this.setMainGUI(!1, this.enGarage), this.setGameGUI(!1), this.poneTutorial("mainButton"))
}, Menu.prototype.poneEventosMain = function() {
    addEventFunction(this.GUI_GO, !0, 1, this.clickGO.bind(this)), addEventFunction(this.GUI_Garage, !0, 1, this.clickGarage.bind(this)), addEventFunction(this.GUI_main, !0, 1, this.clickMain.bind(this, !1)), addEventFunction(this.GUI_tutob, !0, 1, this.clickTutobMain.bind(this));
    for (var e = 0; e < this.GUI_bolas.children.length - 1; e++) this.GUI_bolas.children[e].children[0].enabled = !1;
    this.GUI_bolas.children[autoElegido].children[0].enabled = !0;
    for (e = 0; e < this.GUI_colores.children.length - 1; e++)
        for (var t = 0; t < this.GUI_colores.children[e].children.length - 1 - 4; t++) addEventFunction(this.GUI_colores.children[e].children[t], !0, 1, this.clickColor.bind(this, e, t));
    for (e = 0; e < this.GUI_GarageBars.children.length - 1; e++) {
        var a = this.GUI_GarageBars.children[e];
        addEventFunction(a.findByName("comprar"), !0, 1, this.clickUpgrade.bind(this, e))
    }
    var n = colorElegido[autoElegido];
    this.GUI_colores.children[autoElegido].children[n].children[2].enabled = !0, addEventFunction(this.GUI_IZQ, !0, 1, this.clickLado.bind(this, -1)), addEventFunction(this.GUI_DER, !0, 1, this.clickLado.bind(this, 1))
}, Menu.prototype.sacaEventosMain = function() {
    addEventFunction(this.GUI_GO, !1), addEventFunction(this.GUI_IZQ, !1), addEventFunction(this.GUI_DER, !1), addEventFunction(this.GUI_Garage, !1), addEventFunction(this.GUI_main, !1), addEventFunction(this.GUI_tutob, !1);
    for (var e = 0; e < this.GUI_GarageBars.children.length - 1; e++) {
        var t = this.GUI_GarageBars.children[e];
        addEventFunction(t.findByName("comprar"), !1)
    }
    for (e = 0; e < this.GUI_colores.children.length - 1; e++)
        for (var a = 0; a < this.GUI_colores.children[e].children.length - 1 - 4; a++) addEventFunction(this.GUI_colores.children[e].children[a], !1);
    addEventFunction(this.GUI_colores.children[e], !1)
}, Menu.prototype.clickGarage = function() {
    if (null == this.tweenPlataforma || !this.tweenPlataforma.playing) {
        playSound("click"), this.enGarage = !0, this.setMainGUI(!0, this.enGarage), this.selectAuto(autoElegido), this.GUI_camaraGarage.script.tweenCamara.animMainToGarage();
        for (var e = 0; e < totalAutos; e++) this.plataforma.findByName("Auto0" + (e + 1)).children[0].script.giroEntidad.enabled = !0, this.plataforma.findByName("Auto0" + (e + 1)).children[1].script.giroEntidad.enabled = !0, this.plataforma.findByName("Auto0" + (e + 1) + "ref").children[0].script.giroEntidad.enabled = !0
    }
}, Menu.prototype.clickMain = function(e) {
    if (null == this.tweenPlataforma || !this.tweenPlataforma.playing) {
        e || playSound("click"), this.enGarage = !1, this.setMainGUI(!0, this.enGarage), this.selectAuto(autoElegido), this.GUI_camaraGarage.script.tweenCamara.animGarageToMain();
        for (var t = 0; t < totalAutos; t++) {
            this.plataforma.findByName("Auto0" + (t + 1)).children[0].script.giroEntidad.enabled = !1, this.plataforma.findByName("Auto0" + (t + 1)).children[1].script.giroEntidad.enabled = !1, this.plataforma.findByName("Auto0" + (t + 1) + "ref").children[0].script.giroEntidad.enabled = !1;
            var a = this.plataforma.findByName("Auto0" + (t + 1)).children[0];
            a.tween(a.getLocalEulerAngles()).rotate(new pc.Vec3(0, 0, 0), .25, pc.SineInOut).start(), (a = this.plataforma.findByName("Auto0" + (t + 1)).children[1]).tween(a.getLocalEulerAngles()).rotate(new pc.Vec3(0, 0, 0), .25, pc.SineInOut).start(), (a = this.plataforma.findByName("Auto0" + (t + 1) + "ref").children[0]).tween(a.getLocalEulerAngles()).rotate(new pc.Vec3(0, 0, 0), .25, pc.SineInOut).start()
        }
    }
}, Menu.prototype.clickGO = function() {
    null != this.tweenPlataforma && this.tweenPlataforma.playing || 1 == this.GUI_GO.element.opacity && (this.sacaEventosMain(), 0 == tutorialMostrado ? (playSound("click"), this.setMainGUI(!1, this.enGarage), this.setGameGUI(!1), this.poneTutorial("main")) : (playSound("clickStart"), stopSound("menuMusic"), this.startGame()))
}, Menu.prototype.poneTutorial = function(e) {
    var t = this.GUI_tutorialUp.findByName("cerrar"),
        a = this.GUI_tutorialCenter.findByName("GUI_mainIzq"),
        n = this.GUI_tutorialCenter.findByName("GUI_mainDer"),
        o = this.GUI_tutorialDown.findByName("GUI_mainGO"),
        i = this.GUI_tutorialDown.findByName("bolas");
    o.enabled = !1, t.enabled = !1, this.GUI_tutorialCenter.enabled = !0, this.GUI_tutorialUp.enabled = !0, this.GUI_tutorialDown.enabled = !0, a.enabled = !1, n.enabled = !0;
    var r = 0;
    "main" == e || "mainButton" == e ? this.GUI_camaraGarage.enabled = !1 : (t.enabled = !0, _autoControl.camara.enabled = !1), this.GUI_tutorial3D.enabled = !0;
    var l = this.getAnimTuto(0),
        s = this.GUI_tutorial3D.children[0],
        d = this.GUI_tutorial3D.children[1],
        c = s;
    s.enabled = !1, d.enabled = !1, 4 == l && (c = d, l = 0), c.enabled = !0, reproduceAnim(d, l, 1, !1, null, !0);
    for (var u = 0; u < i.children.length - 1; u++) i.children[u].children[0].enabled = !1;
    i.children[0].children[0].enabled = !0, addEventFunction(a, !0, 1, function() {
        playSound("pauseEntrar"), (r -= 1) < 0 && (r = 0);
        var e = this.getAnimTuto(r),
            t = s;
        4 == e && (e = 0, t = d), s.enabled = !1, d.enabled = !1, t.enabled = !0, reproduceAnim(t, e, 1, !1, null, !0), o.enabled = !1, a.enabled = 0 != r, n.enabled = 3 != r;
        for (var l = 0; l < i.children.length - 1; l++) i.children[l].children[0].enabled = !1;
        i.children[r].children[0].enabled = !0
    }.bind(this)), addEventFunction(n, !0, 1, function() {
        playSound("pauseEntrar"), (r += 1) > 3 && (r = 3);
        var t = s;
        4 == l && (l = 0, t = d), s.enabled = !1, d.enabled = !1, t.enabled = !0;
        var l = this.getAnimTuto(r);
        reproduceAnim(t, l, 1, !1, null, !0), o.enabled = 3 == r && ("main" == e || "mainButton" == e), a.enabled = 0 != r, n.enabled = 3 != r;
        for (var c = 0; c < i.children.length - 1; c++) i.children[c].children[0].enabled = !1;
        i.children[r].children[0].enabled = !0
    }.bind(this)), "main" == e ? addEventFunction(o, !0, 1, function() {
        addEventFunction(o, !1), addEventFunction(a, !1), addEventFunction(n, !1), this.GUI_tutorialCenter.enabled = !1, this.GUI_tutorialUp.enabled = !1, this.GUI_tutorialDown.enabled = !1, this.GUI_tutorial3D.enabled = !1, this.GUI_camaraGarage.enabled = !0, tutorialMostrado = 1, guardaAllVars(), this.clickGO()
    }.bind(this)) : "mainButton" == e ? addEventFunction(o, !0, 1, function() {
        tutorialMostrado = 1, guardaAllVars(), playSound("click"), this.GUI_tutorialCenter.enabled = !1, this.GUI_tutorialUp.enabled = !1, this.GUI_tutorialDown.enabled = !1, this.GUI_tutorial3D.enabled = !1, this.GUI_camaraGarage.enabled = !0, this.setMainGUI(!0, this.enGarage), this.setPlataforma(!0)
    }.bind(this)) : addEventFunction(t, !0, 1, function() {
        playSound("click"), addEventFunction(t, !1), addEventFunction(a, !1), addEventFunction(n, !1), this.GUI_tutorialCenter.enabled = !1, this.GUI_tutorialUp.enabled = !1, this.GUI_tutorialDown.enabled = !1, this.GUI_tutorial3D.enabled = !1, this.pausePanel.enabled = !0, _autoControl.camara.enabled = !0, this.setGameGUI(!0)
    }.bind(this))
}, Menu.prototype.getAnimTuto = function(e) {
    if (!pcControl) return e;
    var t = 0;
    switch (e) {
        case 0:
            t = 0 == controlDefaultType ? 4 : 6;
            break;
        case 1:
            t = 0 == controlDefaultType ? 5 : 7;
            break;
        case 2:
            t = 2;
            break;
        case 3:
            t = 3
    }
    return t
}, Menu.prototype.update = function(e) {
    var t = this.app.graphicsDevice.width,
        a = this.app.graphicsDevice.height;
    t > a ? .87 != this._screen2D.screen.scaleBlend && (this._screen2D.screen.scaleBlend = .87, this.GUI_camaraGarage.camera.fov = 34, this.GUI_camaraGarage.setLocalPosition(.002, .254, .38), this.garageTecho.enabled = !0, this.GUI_camaraGarage.script.tweenCamara.UpdateParams(this.enGarage, t, a)) : .5 != this._screen2D.screen.scaleBlend && (this._screen2D.screen.scaleBlend = .5, this.GUI_camaraGarage.camera.fov = 45, this.GUI_camaraGarage.setLocalPosition(.002, .329, .38), this.garageTecho.enabled = !1, this.GUI_camaraGarage.script.tweenCamara.UpdateParams(this.enGarage, t, a))
}, Menu.prototype.startGame = function() {
    this.GUI_tapador.enabled = !0, this.GUI_tapador.element.opacity = 0;
    var e = {
        x: 0
    };
    this.app.tween(e).to({
        x: 1
    }, .6, pc.SineOut).onUpdate((() => {
        this.GUI_tapador.element.opacity = e.x
    })).onComplete((() => {
        this.main3D.enabled = !1, this.setMainGUI(!1, this.enGarage), this.setGameGUI(!1), this.autosManager.script.autosManager.getAuto(), this.tapToStart.enabled = !0, console.log("ENTRE AQUI MIERDAS!! "), pantalla = "preRACE", clearInterval(this.hiloTiempo), currentPorcentaje = 0, currentTramo = 0, _tramos.init(), _autoControl.preparaAuto(), currentPosition = _autoControl.entity.getPosition().clone(), e.x = 1, this.app.tween(e).to({
            x: 0
        }, .5, pc.SineOut).onUpdate((() => {
            this.GUI_tapador.element.opacity = e.x
        })).onComplete((() => {
            this.GUI_tapador.enabled = !1
        })).start(), this.tapToStart.enabled = !1, this.empezarCarrera("tres")
    })).start()
}, Menu.prototype.clickColor = function(e, t) {
    null != this.tweenPlataforma && this.tweenPlataforma.playing || (0 == colorData[e]["color" + (t + 1)].locked ? (playSound("click"), this.selectColor(e, t)) : monedas >= colorData[e]["color" + (t + 1)].cost ? (monedas -= colorData[e]["color" + (t + 1)].cost, colorData[e]["color" + (t + 1)].locked = 0, this.pintarMonedas(), guardaAllVars(), playSound("comprar"), this.selectColor(e, t)) : playSound("noComprar"))
}, Menu.prototype.clickUpgrade = function(e) {
    if (null == this.tweenPlataforma || !this.tweenPlataforma.playing) {
        var t = this.getUpgrade(e);
        if (!this.GUI_GarageBars.children[e].findByName("MAX").enabled)
            if (console.log(upgradeCost[e][t]), monedas >= upgradeCost[e][t]) {
                switch (monedas -= upgradeCost[e][t], e) {
                    case 0:
                        autosData[autoElegido].maxSpeed = autosData[autoElegido].maxSpeed + 1;
                        break;
                    case 1:
                        autosData[autoElegido].aceleration = autosData[autoElegido].aceleration + 1;
                        break;
                    case 2:
                        autosData[autoElegido].steering = autosData[autoElegido].steering + 1;
                        break;
                    case 3:
                        autosData[autoElegido].turbo = autosData[autoElegido].turbo + 1
                }
                this.pintarMonedas(), guardaAllVars(), playSound("comprar"), this.selectAuto(autoElegido)
            } else playSound("noComprar")
    }
}, Menu.prototype.selectColor = function(e, t) {
    this.autosManager.children[autoElegido].script.autoColorManager.setColor(t), colorElegido[autoElegido] = t;
    for (var a = 0; a < this.GUI_colores.children.length - 1; a++) this.GUI_colores.children[a].enabled = !1;
    this.GUI_colores.children[e].enabled = !0;
    for (a = 0; a < this.GUI_colores.children[e].children.length - 1 - 4; a++) this.GUI_colores.children[e].children[a].children[2].enabled = !1;
    var n = colorElegido[autoElegido];
    this.GUI_colores.children[e].children[n].children[2].enabled = !0;
    for (a = this.GUI_colores.children[e].children.length - 1 - 4; a < this.GUI_colores.children[e].children.length - 1; a++) this.GUI_colores.children[e].children[a].children[0].element.text = colorData[e]["color" + (a - 4 + 1)].cost, 0 == colorData[e]["color" + (a - 4 + 1)].locked && (this.GUI_colores.children[e].children[a].enabled = !1);
    guardaAllVars()
}, Menu.prototype.selectAuto = function(e) {
    if (null == this.tweenPlataforma || !this.tweenPlataforma.playing) {
        var t = colorElegido[autoElegido];
        this.autosManager.children[autoElegido].script.autoColorManager.setColor(t), 0 == autosData[e].locked ? (this.enGarage ? (this.GUI_mainBuyCar.enabled = !1, this.GUI_GarageBars.enabled = !0, this.GUI_colores.enabled = !0, this.selectColor(e, colorElegido[e]), this.selectParams(e)) : (this.GUI_mainBuyCar.enabled = !1, this.GUI_GarageBars.enabled = !1, this.GUI_colores.enabled = !1), this.GUI_GO.element.opacity = 1) : (this.GUI_GarageBars.enabled = !1, this.GUI_mainBuyCar.enabled = !0, this.GUI_colores.enabled = !1, this.GUI_mainBuyCar.children[0].element.text = autosCost[e], addEventFunction(this.GUI_mainBuyCar, !1), addEventFunction(this.GUI_mainBuyCar, !0, 1, this.clickComprarAuto.bind(this, e)), this.GUI_GO.element.opacity = .5)
    }
}, Menu.prototype.selectParams = function(e) {
    for (var t = 0; t < this.GUI_GarageBars.children.length - 1; t++) {
        var a = this.getUpgrade(t),
            n = this.GUI_GarageBars.children[t];
        n.findByName("MAX").enabled = !1, n.findByName("comprar").children[0].element.text = upgradeCost[t][a];
        for (var o = 0; o < upgradeMax[e][t]; o++) n.findByName("L" + (o + 1)).enabled = !1;
        var i = 0;
        for (o = 0; o < a; o++) n.findByName("L" + (o + 1)).enabled = !0, i += 1;
        i == upgradeMax[e][t] && (n.findByName("MAX").enabled = !0)
    }
}, Menu.prototype.clickComprarAuto = function(e) {
    null != this.tweenPlataforma && this.tweenPlataforma.playing || (monedas >= autosCost[e] ? (monedas -= autosCost[e], this.pintarMonedas(), autosData[e].locked = 0, guardaAllVars(), playSound("comprar"), this.selectAuto(e)) : playSound("noComprar"))
}, Menu.prototype.getUpgrade = function(e) {
    var t = 0;
    switch (e) {
        case 0:
            t = autosData[autoElegido].maxSpeed;
            break;
        case 1:
            t = autosData[autoElegido].aceleration;
            break;
        case 2:
            t = autosData[autoElegido].steering;
            break;
        case 3:
            t = autosData[autoElegido].turbo
    }
    return t
}, Menu.prototype.pintarMonedas = function() {
    this.GUI_monedas.children[0].element.text = monedas
}, Menu.prototype.pintarBestScore = function() {
    this.GUI_bestScore.children[0].element.text = bestScore
}, Menu.prototype.pintarScore = function(e) {
    this.GUI_score.children[0].element.text = e
}, Menu.prototype.setMessages = function(e) {
    this.checkPointMSG.enabled = e, this.timeOutMSG.enabled = e, this.zoneCompleteMSG.enabled = e, this.GUI_MSG_carpass.enabled = e, this.GUI_MSG_turboGet.enabled = e
}, Menu.prototype.setGameGUI = function(e) {
    this.GUI_time.enabled = e, this.GUI_score.enabled = e, this.GUI_vidas.enabled = !1, this.GUI_KM.enabled = e, this.GUI_turbo.enabled = e, this.GUI_check.enabled = e, this.GUI_pause.enabled = e, this.GUI_checkAnim.enabled = !1, this.GUI_turboAnim.enabled = !1
}, Menu.prototype.setMainGUI = function(e, t) {
    this.GUI_colores.enabled = !1, this.GUI_main.enabled = !1, this.GUI_GarageBars.enabled = !1, this.GUI_mainBuyCar.enabled = !1, this.GUI_Logo.enabled = !1, this.GUI_bestScore.enabled = !1, this.GUI_Garage.enabled = !1, this.GUI_tutob.enabled = !1, this.GUI_IZQ.enabled = e, this.GUI_DER.enabled = e, this.GUI_monedas.enabled = e, this.GUI_bolas.enabled = e, this.GUI_GO.enabled = e, this.GUI_tutob.enabled = e, t ? (this.GUI_GO.enabled = e, this.GUI_main.enabled = e, this.GUI_tutob.enabled = e) : (this.GUI_Logo.enabled = e, this.GUI_bestScore.enabled = e, this.GUI_Garage.enabled = e)
}, Menu.prototype.clickPause = function() {
    time < 2 || _menu.zoneCompleteMSG.enabled || (permitirPause = !1, playSound("pauseEntrar"), this.pausePanel.enabled = !0, _autoControl.pauseGame = !0, _autoControl.pauseTweens(), this.eventosPause(!0))
}, Menu.prototype.clickTutorial = function() {
    this.poneTutorial("inGame"), this.pausePanel.enabled = !1, this.setGameGUI(!1)
}, Menu.prototype.closePause = function(e) {
    e || playSound("pauseSalir"), this.eventosPause(!1), this.pausePanel.enabled = !1, _autoControl.pauseGame = !1, _autoControl.pauseTweens(), this.app.timeScale = 1, permitirPause = !0
}, Menu.prototype.eventosPause = function(e) {
    var t = this.pausePanel.findByName("muteSound"),
        a = this.pausePanel.findByName("muteMusic"),
        n = this.pausePanel.findByName("help"),
        o = this.pausePanel.findByName("restart"),
        i = this.pausePanel.findByName("resume"),
        r = this.pausePanel.findByName("resumeX"),
        l = this.pausePanel.findByName("home"),
        s = this.pausePanel.findByName("controlType"),
        d = this.pausePanel.findByName("pcNoPc");
    d.setLocalPosition(0, 0, 0), s.enabled = !0, pcControl || (s.enabled = !1, d.setLocalPosition(0, 128, 0)), 0 == muteValSound ? (t.children[0].enabled = !0, t.children[1].enabled = !1) : (t.children[1].enabled = !0, t.children[0].enabled = !1), 0 == muteValMusic ? (a.children[0].enabled = !0, a.children[1].enabled = !1) : (a.children[1].enabled = !0, a.children[0].enabled = !1), 0 == controlDefaultType ? (s.children[0].enabled = !0, s.children[1].enabled = !1) : (s.children[1].enabled = !0, s.children[0].enabled = !1), e ? (addEventFunction(t, !0, 1, function() {
        (enGoogle ? GameSnacks.audio.isEnabled() : volumeMaster) && (0 == muteValSound ? (mutear(1, "sound"), t.children[1].enabled = !0, t.children[0].enabled = !1) : (mutear(0, "sound"), t.children[0].enabled = !0, t.children[1].enabled = !1), playSound("click"))
    }.bind(this)), addEventFunction(a, !0, 1, function() {
        (enGoogle ? GameSnacks.audio.isEnabled() : volumeMaster) && (0 == muteValMusic ? (mutear(1, "music"), a.children[1].enabled = !0, a.children[0].enabled = !1) : (mutear(0, "music"), a.children[0].enabled = !0, a.children[1].enabled = !1), playSound("click"))
    }.bind(this)), addEventFunction(s, !0, 1, function() {
        0 == controlDefaultType ? (s.children[1].enabled = !0, s.children[0].enabled = !1, controlDefaultType = 1, guardaAllVars(), this.setPCcontrol()) : (s.children[0].enabled = !0, s.children[1].enabled = !1, controlDefaultType = 0, guardaAllVars(), this.setPCcontrol()), playSound("click")
    }.bind(this)), addEventFunction(n, !0, 1, function() {
        playSound("click"), this.clickTutorial()
    }.bind(this)), addEventFunction(o, !0, 1, function() {
        playSound("click"), this.closePause(!0);
        PrepareInterstitital((() => {
            _autoControl.destruyeTodo(!0), this.startGame()
        }))
    }.bind(this)), addEventFunction(i, !0, 1, function() {
        this.closePause(!1)
    }.bind(this)), addEventFunction(r, !0, 1, function() {
        this.closePause(!1)
    }.bind(this)), addEventFunction(l, !0, 1, function() {
        playSound("click"), this.closePause(!0);
        PrepareInterstitital((() => {
            enGoogle && (console.log("Se setea Gamesnack gameOver "), GameSnacks.game.gameOver()), _autoControl.destruyeTodo(!0), this.setGameGUI(!1), this.backToMain(!1)
        }))
    }.bind(this))) : (addEventFunction(t, !1), addEventFunction(a, !1), addEventFunction(s, !1), addEventFunction(n, !1), addEventFunction(o, !1), addEventFunction(i, !1), addEventFunction(r, !1), addEventFunction(l, !1))
}, Menu.prototype.backToMain = function(e) {
    this.GUI_tapador.enabled = !0, this.GUI_tapador.element.opacity = 0;
    var t = {
        x: 0
    };
    this.app.tween(t).to({
        x: 1
    }, .6, pc.SineOut).onUpdate((() => {
        this.GUI_tapador.element.opacity = t.x
    })).onComplete((() => {
        this.autosManager.script.autosManager.apagaAuto(), this.main3D.enabled = !0, this.enGarage = e, this.setMainGUI(!0, this.enGarage), this.indexPlataforma = autoElegido, this.GUI_colores.children[autoElegido].enabled = !0, this.anguloPlataforma = 0, this.tweenPlataforma = null, this.ladoAux = 0, this.poneEventosMain(), this.setPlataforma(!0), playSound("menuMusic", !0), this.pintarMonedas(), this.pintarBestScore(), e ? this.clickGarage() : this.clickMain(!0), t.x = 1, this.app.tween(t).to({
            x: 0
        }, .5, pc.SineOut).onUpdate((() => {
            this.GUI_tapador.element.opacity = t.x
        })).onComplete((() => {
            this.GUI_tapador.enabled = !1
        })).start()
    })).start()
}, Menu.prototype.setVidas = function(e) {
    vidas += e;
    for (var t = 0; t < totalVidas; t++) this.GUI_vidas.children[t].enabled = !1;
    for (t = 0; t < vidas; t++) this.GUI_vidas.children[t].enabled = !0;
    0 == vidas && (clearInterval(this.hiloTiempo), _autoControl.explosion())
}, Menu.prototype.setScore = function(e) {
    _globalScore += e, this.GUI_score.findByName("txt").element.text = _globalScore
}, Menu.prototype.setTime = function(e) {
    time += e, this.GUI_time.findByName("txt").element.text = time
}, Menu.prototype.setKM = function(e) {
    this.GUI_KM.findByName("km_txt").element.text = e
}, Menu.prototype.getKM = function() {
    return this.GUI_KM.findByName("km_txt").element.text
}, Menu.prototype.setPCcontrol = function() {
    0 == controlDefaultType && (_autoControl.factorNewVolante = 1)
}, Menu.prototype.setTurbo = function(e) {
    if (!(turbo == maxTurbo && e > 0)) {
        var t = this.GUI_turbo.findByName("nitro").findByName("vacio"),
            a = this.GUI_turbo.findByName("nitro").findByName("normal"),
            n = this.GUI_turbo.findByName("nitro").findByName("max"),
            o = this.GUI_turbo.findByName("nitro").findByName("txt").element,
            i = this.GUI_turbo.findByName("barra"),
            r = this.GUI_turbo.findByName("barraMax");
        t.enabled = !1, a.enabled = !1, n.enabled = !1, i.enabled = !1, r.enabled = !1;
        var l = turboBar;
        turboBar += e, 0 != e && (this.GUI_turboAnim.enabled = !0, this.GUI_turboAnim.script.reproduceAnimSprite.play()), turboBar >= 1 && 0 != e ? (turbo += 1, turbo < maxTurbo ? turboBar = 0 : turboBar = 1, i.setLocalScale(l, 1, 1), r.setLocalScale(l, 1, 1), null != turboBarTween && turboBarTween.stop(), turboBarTween = i.tween(i.getLocalScale()).to(new pc.Vec3(1, 1, 1), .25, pc.SineOut).onComplete((() => {
            i.setLocalScale(turboBar, 1, 1)
        })).start(), null != turboBarTweenMax && turboBarTweenMax.stop(), turboBarTweenMax = r.tween(r.getLocalScale()).to(new pc.Vec3(1, 1, 1), .25, pc.SineOut).onComplete((() => {
            r.setLocalScale(turboBar, 1, 1)
        })).start()) : (i.setLocalScale(l, 1, 1), r.setLocalScale(l, 1, 1), null != turboBarTween && turboBarTween.stop(), turboBarTween = i.tween(i.getLocalScale()).to(new pc.Vec3(turboBar, 1, 1), .25, pc.SineOut).start(), null != turboBarTweenMax && turboBarTweenMax.stop(), turboBarTweenMax = r.tween(r.getLocalScale()).to(new pc.Vec3(turboBar, 1, 1), .25, pc.SineOut).start()), 0 == turbo ? (t.enabled = !0, i.enabled = !0) : turbo == maxTurbo ? (n.enabled = !0, r.enabled = !0) : (a.enabled = !0, i.enabled = !0), o.text = "" + turbo
    }
}, Menu.prototype.empezarCarrera = function(e) {
    switch (console.log("ENTRE AQUI MIERDAS!! "), pantalla = "321GO", playSound(e), e) {
        case "tres":
            this.hiloTiempo = null, this.startCount.enabled = !0, this.startCount.element.text = "3", setTimeout(this.empezarCarrera.bind(this, "dos"), 1e3);
            break;
        case "dos":
            this.startCount.element.text = "2", setTimeout(this.empezarCarrera.bind(this, "uno"), 1e3);
            break;
        case "uno":
            this.startCount.element.text = "1", setTimeout(this.empezarCarrera.bind(this, "go"), 1e3);
            break;
        case "go":
            this.startCount.element.text = "GO", this.startCount.tween(this.startCount.getLocalScale()).to(new pc.Vec3(1, 0, 1), .35, pc.SineOut).delay(.4).onComplete((() => {
                this.startCount.setLocalScale(1, 1, 1), this.startCount.enabled = !1
            })).start(), _autoControl.comienzaCarrera(), _traficoSystem.iniciar(_tramos.pista), this.poneEventosHud(), vidas = totalVidas, time = totalTime;
            var t = this.GUI_time.findByName("txt");
            t.script.parpadear.enabled = !1, t.enabled = !0;
            var a = new pc.Color;
            t.element.color = a.fromString(colorNormal), _globalScore = 0, _raceScore = 0, turbo = initialTurbo, this.setGameGUI(!0), this.setVidas(0), this.setScore(0), this.setKM(0), this.setTime(0), this.setTurbo(0), clearInterval(this.hiloTiempo), this.hiloTiempo = setInterval(this.gameTime.bind(this), 1e3), permitirPause = !0, this.GUI_pause.enabled && !this.pausePanel.enabled ? pauseFlag && (pauseFlag = !1, this.clickPause()) : pauseFlag = !1, pantalla = "race", this.currentColor = "normal"
    }
}, Menu.prototype.gameTime = function() {
    if (!_autoControl.pauseGame)
        if (time > 0) {
            if (_menu.setTime(-1), 9 == time) {
                (t = this.GUI_time.findByName("txt")).script.parpadear.enabled = !0, playSound("pocoTiempo");
                var e = new pc.Color;
                t.element.color = e.fromString(colorParpadeo), this.currentColor = "parpadeo"
            } else if (time > 9 && (soundIsPlaying("pocoTiempo") && stopSound("pocoTiempo"), "parpadeo" == this.currentColor)) {
                (t = this.GUI_time.findByName("txt")).script.parpadear.enabled = !1, t.element.enabled = !0;
                e = new pc.Color;
                t.element.color = e.fromString(colorNormal), this.currentColor = "normal"
            }
        } else {
            if (_menu.setTime(0), soundIsPlaying("pocoTiempo")) {
                var t;
                stopSound("pocoTiempo"), (t = this.GUI_time.findByName("txt")).script.parpadear.enabled = !1, t.element.enabled = !0;
                e = new pc.Color;
                t.element.color = e.fromString(colorNormal)
            }
            0 == _autoControl.speed && (clearInterval(this.hiloTiempo), _carSoundManager.puenteLoop(!1), this.gameOver("timeOut"))
        }
}, Menu.prototype.poneEventosHud = function() {
    addEventFunction(this.boton, !0, 1, this.clickBoton.bind(this, 1)), addEventFunction(this.boton, !0, 2, this.clickBoton.bind(this, 2)), addEventFunction(this.boton, !0, 3, this.clickBoton.bind(this, 3))
}, Menu.prototype.sacaEventosHud = function() {
    addEventFunction(this.boton, !1);
    var e = this.GUI_time.findByName("txt");
    e.script.parpadear.enabled = !1, e.element.enabled = !0;
    var t = new pc.Color;
    e.element.color = t.fromString(colorNormal)
}, Menu.prototype.clickIzq = function(e, t) {
    1 == e ? _autoControl.casoApretarIzquierda(t) : 2 == e && _autoControl.posibleCasoSoltarIzquierda()
}, Menu.prototype.clickDer = function(e, t) {
    1 == e ? _autoControl.casoApretarDerecha(t) : 2 == e && _autoControl.posibleCasoSoltarDerecha()
}, Menu.prototype.clickTurbo = function(e) {
    1 == e && _autoControl.casoApretarTurbo()
}, Menu.prototype.poneMSG = function(e) {
    switch (e) {
        case "checkPoint":
            this.checkPointMSG.script.animaMsg.pone(null);
            break;
        case "timeOut":
            this.timeOutMSG.script.animaMsg.pone(null);
            break;
        case "gameOver":
            this.gameOverMSG.script.animaMsg.pone(null);
            break;
        case "zoneComplete":
            this.zoneCompleteMSG.enabled = !0, playSound("zoneComplete");
            break;
        case "carPass":
            this.GUI_MSG_carpass.enabled = !0, this.GUI_MSG_turboGet.enabled = !1, this.GUI_MSG_carpass.script.animaMsg.mueve();
            break;
        case "getTurbo":
            this.GUI_MSG_turboGet.enabled = !0, this.GUI_MSG_carpass.enabled = !1, this.GUI_MSG_turboGet.script.animaMsg.mueve()
    }
}, Menu.prototype.gameOver = function(e) {
    "timeOut" == e ? (this.poneMSG("timeOut"), playSound("timeOut")) : "explo" == e && this.poneMSG("gameOver"), pantalla = "endrace", _autoControl.finalCarrera = !0;
    this.app.tween({
        x: 0
    }).to({
        x: 1
    }, 2.3, pc.SineOut).onComplete((() => {
        this.comienzaFin()
    })).start()
}, Menu.prototype.comienzaFin = function() {
    this.setGameGUI(!1), _autoControl.destruyeTodo(!1), this.autosManager.script.autosManager.apagaAuto(), this.setEnding(!0), this.endPanel_restart.enabled = !1, this.endPanel_garage.enabled = !1;
    var e = this.endPanel_data,
        t = this.endPanel_reward;
    t.children[1].enabled = !1, t.children[2].enabled = !1, e.children[2].enabled = !1, e.children[4].enabled = !1, e.children[7].enabled = !1, e.children[9].enabled = !1, e.children[12].enabled = !1, e.children[16].enabled = !1, e.children[19].enabled = !1, _globalScore += distanceScore;
    var a = {
        x: 0
    };
    this.app.tween(a).to({
        x: 1
    }, .3, pc.SineOut).onComplete((() => {
        playSound("premio1"), e.children[19].enabled = !0, e.children[19].element.text = _raceScore + "", console.log("q mierda " + _raceScore)
    })).start();
    a = {
        x: 0
    };
    this.app.tween(a).to({
        x: 1
    }, .7, pc.SineOut).onComplete((() => {
        playSound("premio1"), e.children[2].enabled = !0, e.children[2].element.text = checkPointCant
    })).start();
    a = {
        x: 0
    };
    this.app.tween(a).to({
        x: 1
    }, 1.1, pc.SineOut).onComplete((() => {
        playSound("premio1"), e.children[4].enabled = !0, e.children[4].element.text = checkPointScore
    })).start();
    a = {
        x: 0
    };
    this.app.tween(a).to({
        x: 1
    }, 1.5, pc.SineOut).onComplete((() => {
        playSound("premio1"), e.children[7].enabled = !0, e.children[7].element.text = zoneClearedCant
    })).start();
    a = {
        x: 0
    };
    this.app.tween(a).to({
        x: 1
    }, 1.9, pc.SineOut).onComplete((() => {
        playSound("premio1"), e.children[9].enabled = !0, e.children[9].element.text = zoneClearedScore
    })).start();
    a = {
        x: 0
    };
    this.app.tween(a).to({
        x: 1
    }, 2.3, pc.SineOut).onComplete((() => {
        playSound("premio1"), e.children[12].enabled = !0, e.children[12].element.text = _globalScore
    })).start();
    a = {
        x: 0
    };
    this.app.tween(a).to({
        x: 1
    }, 2.6, pc.SineOut).onComplete((() => {
        playSound("sumaScoreLoop"), e.children[16].enabled = !0, e.children[16].element.text = "0";
        checkPointCant, checkPointScore, zoneClearedCant, zoneClearedScore, _globalScore, _raceScore;
        this.app.tween({
            x: 0
        }).to({
            x: 1
        }, .016, pc.SineOut).onComplete((() => {
            this.sumaLoop(0)
        })).start()
    })).start(), enGoogle && (console.log("Se setea Gamesnack score " + (checkPointCant * checkPointScore + zoneClearedCant * zoneClearedScore + _globalScore + _raceScore)), GameSnacks.score.update(checkPointCant * checkPointScore + zoneClearedCant * zoneClearedScore + _globalScore + _raceScore))
}, Menu.prototype.sumaLoop = function(e) {
    var t = this.endPanel_data,
        a = checkPointCant * checkPointScore + zoneClearedCant * zoneClearedScore + _globalScore + _raceScore;
    e += 321, t.children[16].element.text = e, e >= a ? (_sonidos.slot("sumaScoreLoop").stop(), e = a, t.children[16].element.text = e, playSound("sumaScoreFin"), this.finEndScreen(a)) : this.app.tween({
        x: 0
    }).to({
        x: 1
    }, .016, pc.SineOut).onComplete((() => {
        this.sumaLoop(e)
    })).start()
}, Menu.prototype.finEndScreen = function(e) {
    var t = this.endPanel_reward;
    t.children[1].enabled = !0, t.children[2].enabled = !0;
    var a = this.determinaPremio(e);
    t.children[1].element.text = a, e > bestScore && (bestScore = e), monedas += a, this.pintarMonedas(), this.pintarBestScore(), guardaAllVars(), playSound("premioFin");
    var funcionDeTerminar = e => {
        this.endPanel_restart.enabled = !0, this.endPanel_garage.enabled = !0, 2 == e && (t.children[1].element.text = 2 * a, monedas += a, this.pintarMonedas(), guardaAllVars()), enGoogle && setTimeout((() => {
            console.log("Se setea Gamesnack gameOver "), GameSnacks.game.gameOver()
        }), 400), addEventFunction(this.endPanel_restart, !0, 1, function() {
            playSound("click");
            var funcionClick = () => {
                addEventFunction(this.endPanel_restart, !1), addEventFunction(this.endPanel_garage, !1), _sonidos.slot("Music1").stop(), _sonidos.slot("Music2").stop(), _sonidos.slot("Music3").stop(), this.startGame(), setTimeout(function() {
                    this.setEnding(!1)
                }.bind(this), 450)
            };
            funcionClick()
        }.bind(this)), addEventFunction(this.endPanel_garage, !0, 1, function() {
            playSound("click");
            var funcionClick = () => {
                addEventFunction(this.endPanel_garage, !1), addEventFunction(this.endPanel_restart, !1), _sonidos.slot("Music1").stop(), _sonidos.slot("Music2").stop(), _sonidos.slot("Music3").stop(), this.backToMain(!0), setTimeout(function() {
                    this.setEnding(!1)
                }.bind(this), 450)
            };
            funcionClick()
        }.bind(this))
    };
    console.log("el objecto rewardAd"), console.log(rewardAd), a > 0 ? ShowRewardPanel(a, "doubleReward", funcionDeTerminar) : funcionDeTerminar(1)
}, Menu.prototype.determinaPremio = function(e) {
    var t = 1e5,
        a = .007 * (e - t) + 700;
    return console.log("el score q sque " + e), a = Math.round(a)
}, Menu.prototype.setEnding = function(e) {
    this.endPanel_obscurecedor.enabled = e, this.endPanel_titulo.enabled = e, this.endPanel_data.enabled = e, this.endPanel_reward.enabled = e, this.endPanel_restart.enabled = e, this.endPanel_garage.enabled = e, this.endPanel_garageGlow.enabled = e, this.endPanel3D.enabled = e
}, Menu.prototype.stopTap = function() {
    clearInterval(this.hiloTap), this.tap = 0
}, Menu.prototype.clickBoton = function(e, t) {
    if ((!pcControl || 0 != controlDefaultType) && (3 != e || this.press) && (null == _autoControl || !_autoControl.enVoltereta)) {
        1 == e && (this.tap = this.tap + 1, clearInterval(this.hiloTap), this.hiloTap = setInterval(this.stopTap.bind(this), this.toleranciaTap), 2 == this.tap && (_autoControl.casoApretarTurbo(), this.tap = 0));
        var a = this.app.graphicsDevice.width / window.devicePixelRatio / 2,
            n = this.app.graphicsDevice.width / window.devicePixelRatio;
        if (t.x < a) {
            var o = (0 - (r = 1.4)) / (a - (i = 0));
            _autoControl.factorNewVolante = o * (t.x - i) + r
        } else {
            var i, r;
            o = (1.4 - (r = 0)) / (n - (i = a));
            _autoControl.factorNewVolante = o * (t.x - i) + r, this.mouseXY = t
        }
        1 == e ? (this.press = !0, t.x < a ? (this.clickIzq(1), _autoControl.doblaCarroseria("izquierda"), _autoControl.enDerrape ? _autoControl.enDerrape && _autoControl.factorNewVolante >= 0 && _autoControl.factorNewVolante <= 1.01 ? (_autoControl.casoSoltarIzquierda(), _autoControl.enDerrape = !1, this.clickIzq(1, !1)) : _autoControl.doblaCarroseria("izquierda") : _autoControl.factorNewVolante > 1.02 && (this.clickIzq(2), this.clickIzq(1, !0))) : (this.clickDer(1), _autoControl.doblaCarroseria("derecha"), _autoControl.enDerrape ? _autoControl.enDerrape && _autoControl.factorNewVolante >= 0 && _autoControl.factorNewVolante <= 1.01 ? (_autoControl.casoSoltarDerecha(), _autoControl.enDerrape = !1, this.clickDer(1, !1)) : _autoControl.doblaCarroseria("derecha") : _autoControl.factorNewVolante > 1.02 && (this.clickDer(2), this.clickDer(1, !0)))) : 3 == e ? t.x < a ? 1 == _autoControl.enGiroDer ? (this.clickDer(2), this.clickIzq(1, !0), _autoControl.doblaCarroseria("izquierda")) : _autoControl.enDerrape ? _autoControl.enDerrape && _autoControl.factorNewVolante >= 0 && _autoControl.factorNewVolante <= 1.01 ? (_autoControl.casoSoltarIzquierda(), _autoControl.enDerrape = !1, this.clickIzq(1, !1)) : _autoControl.doblaCarroseria("izquierda") : _autoControl.factorNewVolante > 1.02 ? (this.clickIzq(2), this.clickIzq(1, !0)) : _autoControl.doblaCarroseria("izquierda") : 1 == _autoControl.enGiroIzq ? (this.clickIzq(2), this.clickDer(1), _autoControl.doblaCarroseria("derecha")) : _autoControl.enDerrape ? _autoControl.enDerrape && _autoControl.factorNewVolante >= 0 && _autoControl.factorNewVolante <= 1.01 ? (_autoControl.casoSoltarDerecha(), _autoControl.enDerrape = !1, this.clickDer(1, !1)) : _autoControl.doblaCarroseria("derecha") : _autoControl.factorNewVolante > 1.02 ? (this.clickDer(2), this.clickDer(1, !0)) : _autoControl.doblaCarroseria("derecha") : 2 == e && (this.press = !1, 1 == _autoControl.enGiroDer ? this.clickDer(2) : 1 == _autoControl.enGiroIzq && this.clickIzq(2))
    }
}, Menu.prototype.audioChange = function() {
    var e = enGoogle ? GameSnacks.audio.isEnabled() : volumeMaster,
        t = this.pausePanel.findByName("muteSound"),
        a = this.pausePanel.findByName("muteMusic");
    e ? (muteValSound = 0, muteValMusic = 0, mutear(0, "sound"), t.children[0].enabled = !0, t.children[1].enabled = !1, mutear(0, "music"), a.children[0].enabled = !0, a.children[1].enabled = !1) : (muteValSound = 1, muteValMusic = 1, mutear(1, "sound"), t.children[1].enabled = !0, t.children[0].enabled = !1, mutear(1, "music"), a.children[1].enabled = !0, a.children[0].enabled = !1)
};
var CarSoundManager = pc.createScript("carSoundManager");
CarSoundManager.attributes.add("MinPitchEngine", {
    type: "number",
    default: .5
}), CarSoundManager.attributes.add("MaxPitchEngine", {
    type: "number",
    default: 1.65
}), CarSoundManager.attributes.add("topGear", {
    type: "number",
    default: 6
}), CarSoundManager.attributes.add("currentGear", {
    type: "number",
    default: 0
}), CarSoundManager.attributes.add("frameBar", {
    type: "number",
    default: 1
}), CarSoundManager.prototype.initialize = function() {
    _carSoundManager = this
}, CarSoundManager.prototype.iniciar = function() {
    var t = Math.ceil(5 * Math.random());
    this.skids = _sonidos.slot("derrape" + t), this.puenteLoopS = _sonidos.slot("puente"), this.puenteLoopS.loop = !0, this.crashes = [_sonidos.slot("choqueA"), _sonidos.slot("choqueB"), _sonidos.slot("choqueC")], this.mainEngine = _sonidos.slot("engine"), this.toStop = [], this.FADE_OUT_SECONDS = .2, this.inicio = !0, this.rangoMaximo = 0, this.deltaTime = 0, this.diff = 0, this.mainEngine.pitch = this.MinPitchEngine, this.setVolumeSound()
}, CarSoundManager.prototype.setVolumeSound = function() {}, CarSoundManager.prototype.puenteLoop = function(t) {
    t ? this.puenteLoopS.isPlaying || playSound("puente") : this.puenteLoopS.stop()
}, CarSoundManager.prototype.update = function(t) {
    null != this.mainEngine && (this.deltaTime = t, 1 == muteValSound || _menu.pausePanel.enabled || _menu.GUI_tutorial3D.enabled || _menu.zoneCompleteMSG.enabled || _menu.countDown.enabled || "preRACE" == pantalla ? 1e-4 != _sonidos.slot("engine").volume && (_sonidos.slot("engine").volume = 1e-4) : 0 == muteValSound && 1 != _sonidos.slot("engine").volume && (_sonidos.slot("engine").volume = 1), this.AudiosToFadeOut(), this.GearControl(), _autoControl.speed < .01 ? this.mainEngine.stop() : this.mainEngine.isPlaying || (playSound("engine"), this.setVolumeSound()))
}, CarSoundManager.prototype.GearControl = function() {
    var t = Math.round(this.topGear * (_autoControl.speed / _autoControl.maxSpeed));
    this.currentGear == t ? (this.mainEngine.pitch = _autoControl.speed / _autoControl.maxSpeed * (this.MaxPitchEngine - this.MinPitchEngine) + this.MinPitchEngine - this.diff, this.diff > 0 && (this.diff -= .05 * this.deltaTime)) : t != this.topGear && t > this.currentGear && (this.diff = t / this.topGear * .4, this.diff > .4 && (this.diff = .4)), this.currentGear = t, t = Math.round(this.topGear * (_autoControl.speed / _autoControl.maxSpeed));
    var o = this.topGear * (_autoControl.speed / _autoControl.maxSpeed);
    if (this.currentGear < 6) var e = (40 - (a = 1)) / (1 - (i = 0)) * ((o -= t) - i) + a,
        n = Math.round(e);
    var a, i = 0;
    e = (299 - (a = 0)) / (_autoControl.maxSpeed - i) * (_autoControl.speed - i) + a, n = Math.round(e);
    _menu.setKM(n)
}, CarSoundManager.prototype.demoraBar = function(t) {
    this.frameBar = t, this.frameBar < 1 ? this.frameBar = 1 : this.frameBar > 40 && (this.frameBar = 40)
}, CarSoundManager.prototype.PlaySkid = function() {
    if (!this.skids.isPlaying) {
        this.skids.loop = !0;
        var t = Math.ceil(5 * Math.random());
        this.skids = _sonidos.slot("derrape" + t), playSound("derrape" + t)
    }
}, CarSoundManager.prototype.StopSkid = function() {
    this.skids.stop()
}, CarSoundManager.prototype.StopSkid = function() {
    this.skids.stop()
}, CarSoundManager.prototype.PlayCrash = function() {
    playSound("choqueC")
}, CarSoundManager.prototype.StopCrash = function() {
    for (var t = 0; t < this.crashes.length; t++) this.crashes[t].isPlaying && this.toStop.push([this.crashes[t], this.crashes[t].volume])
}, CarSoundManager.prototype.AudiosToFadeOut = function() {
    if (0 != this.toStop.length) {
        for (var t = [], o = 0; o < this.toStop.length; o++) this.toStop[o][0].volume -= this.deltaTime * this.toStop[o][1] / FADE_OUT_SECONDS, this.toStop[o][0].volume <= 0 && (this.toStop[o][0].stop(), this.toStop[o][0].volume = this.toStop[0][1], t.push(o));
        for (o = 0; o < t.length; o++) this.toStop.splice(t[o], 1)
    }
};
var conexionPista0 = [],
    vientoPista0 = [];
vientoPista0[0] = 25, vientoPista0[1] = 124;
var pista0Spline_playa = [];
pista0Spline_playa[0] = new pc.Vec3(0, 0, 0), pista0Spline_playa[1] = new pc.Vec3(0, 0, 0), pista0Spline_playa[2] = new pc.Vec3(.001157701, -.0007602125, -.5999893), pista0Spline_playa[3] = new pc.Vec3(.002696991, -.001573321, -1.200009), pista0Spline_playa[4] = new pc.Vec3(.004098773, -.002359879, -1.799997), pista0Spline_playa[5] = new pc.Vec3(.005012512, -.0030619, -2.400002), pista0Spline_playa[6] = new pc.Vec3(.005117416, -.003600113, -2.999994), pista0Spline_playa[7] = new pc.Vec3(.00348258, -.003790374, -3.599972), pista0Spline_playa[8] = new pc.Vec3(-.001401901, -.003767883, -4.199956), pista0Spline_playa[9] = new pc.Vec3(-.008606434, -.003743799, -4.799928), pista0Spline_playa[10] = new pc.Vec3(-.01666498, -.003509908, -5.399871), pista0Spline_playa[11] = new pc.Vec3(-.02435732, -.00285768, -5.999814), pista0Spline_playa[12] = new pc.Vec3(-.03034067, -.001579444, -6.599801), pista0Spline_playa[13] = new pc.Vec3(-.03319597, 533564e-9, -7.199784), pista0Spline_playa[14] = new pc.Vec3(-.03309107, .003601902, -7.79978), pista0Spline_playa[15] = new pc.Vec3(-.03107929, .007456877, -8.399742), pista0Spline_playa[16] = new pc.Vec3(-.02748013, .01187398, -8.999735), pista0Spline_playa[17] = new pc.Vec3(-.02278233, .01662684, -9.599665), pista0Spline_playa[18] = new pc.Vec3(-.01739788, .02148914, -10.19962), pista0Spline_playa[19] = new pc.Vec3(-.01166248, .02623483, -10.79963), pista0Spline_playa[20] = new pc.Vec3(.004814148, .03189481, -11.39928), pista0Spline_playa[21] = new pc.Vec3(.02423668, .03911171, -11.99895), pista0Spline_playa[22] = new pc.Vec3(.04889202, .04696008, -12.59836), pista0Spline_playa[23] = new pc.Vec3(.08978176, .05474079, -13.19692), pista0Spline_playa[24] = new pc.Vec3(.1563177, .06163774, -13.79311), pista0Spline_playa[25] = new pc.Vec3(.255806, .06698249, -14.38469), pista0Spline_playa[26] = new pc.Vec3(.3789082, .07112862, -14.97186), pista0Spline_playa[27] = new pc.Vec3(.5155563, .07469295, -15.55607), pista0Spline_playa[28] = new pc.Vec3(.6703415, .07756601, -16.13576), pista0Spline_playa[29] = new pc.Vec3(.848568, .07961953, -16.7086), pista0Spline_playa[30] = new pc.Vec3(1.05632, .08066785, -17.27137), pista0Spline_playa[31] = new pc.Vec3(1.302303, .0804504, -17.81846), pista0Spline_playa[32] = new pc.Vec3(1.594229, .07844664, -18.34241), pista0Spline_playa[33] = new pc.Vec3(1.929144, .07437363, -18.84002), pista0Spline_playa[34] = new pc.Vec3(2.299696, .06874776, -19.31175), pista0Spline_playa[35] = new pc.Vec3(2.698351, .06229936, -19.76002), pista0Spline_playa[36] = new pc.Vec3(3.117624, .05568339, -20.18907), pista0Spline_playa[37] = new pc.Vec3(3.550045, .04957519, -20.60495), pista0Spline_playa[38] = new pc.Vec3(3.995659, .0441383, -21.00666), pista0Spline_playa[39] = new pc.Vec3(4.459278, .03878821, -21.38744), pista0Spline_playa[40] = new pc.Vec3(4.936939, .03340301, -21.75038), pista0Spline_playa[41] = new pc.Vec3(5.423891, .02813104, -22.10092), pista0Spline_playa[42] = new pc.Vec3(5.916462, .02306615, -22.44342), pista0Spline_playa[43] = new pc.Vec3(6.412062, .0183022, -22.78163), pista0Spline_playa[44] = new pc.Vec3(6.906429, .01391376, -23.12157), pista0Spline_playa[45] = new pc.Vec3(7.411072, .0111624, -23.4461), pista0Spline_playa[46] = new pc.Vec3(7.916874, .008558396, -23.7688), pista0Spline_playa[47] = new pc.Vec3(8.423222, .006033152, -24.09069), pista0Spline_playa[48] = new pc.Vec3(8.929874, .003573183, -24.41211), pista0Spline_playa[49] = new pc.Vec3(9.436466, .001164405, -24.73353), pista0Spline_playa[50] = new pc.Vec3(9.942924, -.001206651, -25.05519), pista0Spline_playa[51] = new pc.Vec3(10.44927, -.002423288, -25.37707), pista0Spline_playa[52] = new pc.Vec3(10.95232, -.003135061, -25.70417), pista0Spline_playa[53] = new pc.Vec3(11.45722, -.003485313, -26.02826), pista0Spline_playa[54] = new pc.Vec3(11.96907, -.003634581, -26.34131), pista0Spline_playa[55] = new pc.Vec3(12.4917, -.00374195, -26.63594), pista0Spline_playa[56] = new pc.Vec3(13.02607, -.003912661, -26.9087), pista0Spline_playa[57] = new pc.Vec3(13.56569, -.00403025, -27.17109), pista0Spline_playa[58] = new pc.Vec3(14.10926, -.004045609, -27.42503), pista0Spline_playa[59] = new pc.Vec3(14.65954, -.004004121, -27.66414), pista0Spline_playa[60] = new pc.Vec3(15.21845, -.003937025, -27.8821), pista0Spline_playa[61] = new pc.Vec3(15.78791, -.003875263, -28.07092), pista0Spline_playa[62] = new pc.Vec3(16.36866, -.003849868, -28.22122), pista0Spline_playa[63] = new pc.Vec3(16.95722, -.003851406, -28.33745), pista0Spline_playa[64] = new pc.Vec3(17.5506, -.003851552, -28.42599), pista0Spline_playa[65] = new pc.Vec3(18.14802, -.003851429, -28.48096), pista0Spline_playa[66] = new pc.Vec3(18.74763, -.003851071, -28.49737), pista0Spline_playa[67] = new pc.Vec3(19.34687, -.003851175, -28.47076), pista0Spline_playa[68] = new pc.Vec3(19.94221, -.003851168, -28.39754), pista0Spline_playa[69] = new pc.Vec3(20.52949, -.003851414, -28.27539), pista0Spline_playa[70] = new pc.Vec3(21.10689, -.003851537, -28.11255), pista0Spline_playa[71] = new pc.Vec3(21.67481, -.003851421, -27.91907), pista0Spline_playa[72] = new pc.Vec3(22.23371, -.003851406, -27.70103), pista0Spline_playa[73] = new pc.Vec3(22.78413, -.00385166, -27.4623), pista0Spline_playa[74] = new pc.Vec3(23.32637, -.003851414, -27.20546), pista0Spline_playa[75] = new pc.Vec3(23.85864, -.003851548, -26.92866), pista0Spline_playa[76] = new pc.Vec3(24.37354, -.003851432, -26.62085), pista0Spline_playa[77] = new pc.Vec3(24.86798, -.003851434, -26.28118), pista0Spline_playa[78] = new pc.Vec3(25.34539, -.003851311, -25.9178), pista0Spline_playa[79] = new pc.Vec3(25.81121, -.003851548, -25.53961), pista0Spline_playa[80] = new pc.Vec3(26.2727, -.0038519, -25.15619), pista0Spline_playa[81] = new pc.Vec3(26.73198, -.003851674, -24.77016), pista0Spline_playa[82] = new pc.Vec3(27.18163, -.003851919, -24.37293), pista0Spline_playa[83] = new pc.Vec3(27.622, -.00385179, -23.96539), pista0Spline_playa[84] = new pc.Vec3(28.05657, -.003851876, -23.55167), pista0Spline_playa[85] = new pc.Vec3(28.48858, -.003852017, -23.1354), pista0Spline_playa[86] = new pc.Vec3(28.92168, -.003852122, -22.72009), pista0Spline_playa[87] = new pc.Vec3(29.35577, -.003851887, -22.3059), pista0Spline_playa[88] = new pc.Vec3(29.78881, -.003852112, -21.89062), pista0Spline_playa[89] = new pc.Vec3(30.22167, -.003852099, -21.47511), pista0Spline_playa[90] = new pc.Vec3(30.65473, -.003852103, -21.0598), pista0Spline_playa[91] = new pc.Vec3(31.08833, -.00385212, -20.64513), pista0Spline_playa[92] = new pc.Vec3(31.52288, -.003852002, -20.23144), pista0Spline_playa[93] = new pc.Vec3(31.96875, -.00385214, -19.83008), pista0Spline_playa[94] = new pc.Vec3(32.41926, -.003852351, -19.43384), pista0Spline_playa[95] = new pc.Vec3(32.87423, -.003852248, -19.04259), pista0Spline_playa[96] = new pc.Vec3(33.33727, -.003852511, -18.66115), pista0Spline_playa[97] = new pc.Vec3(33.81232, -.003852271, -18.29465), pista0Spline_playa[98] = new pc.Vec3(34.30291, -.00385239, -17.94936), pista0Spline_playa[99] = new pc.Vec3(34.80525, -.003852377, -17.62127), pista0Spline_playa[100] = new pc.Vec3(35.31446, -.003852973, -17.30402), pista0Spline_playa[101] = new pc.Vec3(35.83406, -.003852632, -17.00405), pista0Spline_playa[102] = new pc.Vec3(36.36744, -.003852615, -16.72943), pista0Spline_playa[103] = new pc.Vec3(36.91669, -.0038526, -16.48828), pista0Spline_playa[104] = new pc.Vec3(37.48225, -.003852494, -16.28839), pista0Spline_playa[105] = new pc.Vec3(38.06184, -.003852835, -16.13367), pista0Spline_playa[106] = new pc.Vec3(38.65018, -.003852958, -16.01655), pista0Spline_playa[107] = new pc.Vec3(39.24372, -.003852613, -15.92862), pista0Spline_playa[108] = new pc.Vec3(39.84013, -.003852725, -15.8636), pista0Spline_playa[109] = new pc.Vec3(40.4383, -.003852606, -15.81659), pista0Spline_playa[110] = new pc.Vec3(41.0373, -.003852624, -15.78302), pista0Spline_playa[111] = new pc.Vec3(41.63704, -.003852624, -15.76674), pista0Spline_playa[112] = new pc.Vec3(42.23693, -.003852848, -15.77587), pista0Spline_playa[113] = new pc.Vec3(42.83606, -.003852736, -15.80774), pista0Spline_playa[114] = new pc.Vec3(43.43391, -.003852621, -15.85779), pista0Spline_playa[115] = new pc.Vec3(44.03059, -.003852613, -15.92071), pista0Spline_playa[116] = new pc.Vec3(44.62647, -.003852729, -15.99103), pista0Spline_playa[117] = new pc.Vec3(45.22162, -.003852496, -16.06738), pista0Spline_playa[118] = new pc.Vec3(45.81549, -.003852872, -16.15294), pista0Spline_playa[119] = new pc.Vec3(46.40754, -.003852699, -16.24987), pista0Spline_playa[120] = new pc.Vec3(46.99726, -.0038526, -16.3606), pista0Spline_playa[121] = new pc.Vec3(47.58362, -.003852624, -16.4875), pista0Spline_playa[122] = new pc.Vec3(48.16559, -.003852621, -16.63337), pista0Spline_playa[123] = new pc.Vec3(48.74322, -.003852844, -16.79561), pista0Spline_playa[124] = new pc.Vec3(49.31683, -.003852841, -16.97157), pista0Spline_playa[125] = new pc.Vec3(49.88519, -.003852617, -17.16364), pista0Spline_playa[126] = new pc.Vec3(50.44697, -.003852515, -17.37432), pista0Spline_playa[127] = new pc.Vec3(51.00032, -.00385236, -17.60622), pista0Spline_playa[128] = new pc.Vec3(51.54309, -.003852492, -17.86186), pista0Spline_playa[129] = new pc.Vec3(52.07576, -.003852602, -18.13794), pista0Spline_playa[130] = new pc.Vec3(52.59843, -.00385236, -18.43244), pista0Spline_playa[131] = new pc.Vec3(53.10881, -.003852351, -18.74779), pista0Spline_playa[132] = new pc.Vec3(53.60411, -.003851984, -19.08633), pista0Spline_playa[133] = new pc.Vec3(54.08134, -.00385212, -19.44991), pista0Spline_playa[134] = new pc.Vec3(54.53753, -.003852345, -19.83945), pista0Spline_playa[135] = new pc.Vec3(54.97259, -.003852125, -20.25265), pista0Spline_playa[136] = new pc.Vec3(55.38786, -.003851887, -20.68565), pista0Spline_playa[137] = new pc.Vec3(55.78413, -.003852135, -21.1361), pista0Spline_playa[138] = new pc.Vec3(56.16095, -.003851874, -21.60292), pista0Spline_playa[139] = new pc.Vec3(56.51707, -.003852131, -22.08577), pista0Spline_playa[140] = new pc.Vec3(56.84991, -.003852127, -22.58495), pista0Spline_playa[141] = new pc.Vec3(57.15496, -.003851919, -23.10149), pista0Spline_playa[142] = new pc.Vec3(57.4312, -.003851904, -23.63405), pista0Spline_playa[143] = new pc.Vec3(57.68009, -.003851907, -24.17989), pista0Spline_playa[144] = new pc.Vec3(57.9041, -.003851904, -24.73647), pista0Spline_playa[145] = new pc.Vec3(58.10706, -.003851784, -25.30109), pista0Spline_playa[146] = new pc.Vec3(58.28781, -.003851658, -25.87316), pista0Spline_playa[147] = new pc.Vec3(58.44112, -.003851548, -26.45318), pista0Spline_playa[148] = new pc.Vec3(58.57172, -.003851637, -27.03875), pista0Spline_playa[149] = new pc.Vec3(58.68555, -.003851198, -27.62784), pista0Spline_playa[150] = new pc.Vec3(58.78741, -.003851179, -28.21912), pista0Spline_playa[151] = new pc.Vec3(58.88202, -.003851064, -28.81162), pista0Spline_playa[152] = new pc.Vec3(58.97272, -.003850937, -29.40472), pista0Spline_playa[153] = new pc.Vec3(59.05696, -.003850952, -29.99878), pista0Spline_playa[154] = new pc.Vec3(59.13055, -.003850948, -30.59425), pista0Spline_playa[155] = new pc.Vec3(59.19014, -.003850956, -31.19126), pista0Spline_playa[156] = new pc.Vec3(59.232, -.00385081, -31.78976), pista0Spline_playa[157] = new pc.Vec3(59.25347, -.003850691, -32.38934), pista0Spline_playa[158] = new pc.Vec3(59.25867, -.003850732, -32.9893), pista0Spline_playa[159] = new pc.Vec3(59.25346, -.003850829, -33.58931), pista0Spline_playa[160] = new pc.Vec3(59.23302, -.003850609, -34.1889), pista0Spline_playa[161] = new pc.Vec3(59.1928, -.003850576, -34.78754), pista0Spline_playa[162] = new pc.Vec3(59.12718, -.003850248, -35.38389), pista0Spline_playa[163] = new pc.Vec3(59.02996, -.003850095, -35.97585), pista0Spline_playa[164] = new pc.Vec3(58.89801, -.00385024, -36.56107), pista0Spline_playa[165] = new pc.Vec3(58.73578, -.003850095, -37.13866), pista0Spline_playa[166] = new pc.Vec3(58.54607, -.003850102, -37.70782), pista0Spline_playa[167] = new pc.Vec3(58.33244, -.003850214, -38.26846), pista0Spline_playa[168] = new pc.Vec3(58.09795, -.003850132, -38.82071), pista0Spline_playa[169] = new pc.Vec3(57.84636, -.003850099, -39.36543), pista0Spline_playa[170] = new pc.Vec3(57.57611, -.003849994, -39.90104), pista0Spline_playa[171] = new pc.Vec3(57.28425, -.003849983, -40.42525), pista0Spline_playa[172] = new pc.Vec3(56.97552, -.003849767, -40.93971), pista0Spline_playa[173] = new pc.Vec3(56.65486, -.00384976, -41.44675), pista0Spline_playa[174] = new pc.Vec3(56.32538, -.003849749, -41.94822), pista0Spline_playa[175] = new pc.Vec3(55.9903, -.003849745, -42.4459), pista0Spline_playa[176] = new pc.Vec3(55.65208, -.003849391, -42.94154), pista0Spline_playa[177] = new pc.Vec3(55.31024, -.003849503, -43.43459), pista0Spline_playa[178] = new pc.Vec3(54.96003, -.0038496, -43.92176), pista0Spline_playa[179] = new pc.Vec3(54.59956, -.003849261, -44.40141), pista0Spline_playa[180] = new pc.Vec3(54.22795, -.003849018, -44.87243), pista0Spline_playa[181] = new pc.Vec3(53.84393, -.003849495, -45.33332), pista0Spline_playa[182] = new pc.Vec3(53.43665, -.003849264, -45.77386), pista0Spline_playa[183] = new pc.Vec3(53.02318, -.003849279, -46.20869), pista0Spline_playa[184] = new pc.Vec3(52.60942, -.003849395, -46.64323), pista0Spline_playa[185] = new pc.Vec3(52.195, -.003849264, -47.07713), pista0Spline_playa[186] = new pc.Vec3(51.7796, -.00384903, -47.51007), pista0Spline_playa[187] = new pc.Vec3(51.36292, -.003849033, -47.94171), pista0Spline_playa[188] = new pc.Vec3(50.94454, -.003849022, -48.37176), pista0Spline_playa[189] = new pc.Vec3(50.52361, -.003848884, -48.79937), pista0Spline_playa[190] = new pc.Vec3(50.10052, -.003849026, -49.22482), pista0Spline_playa[191] = new pc.Vec3(49.67608, -.003848914, -49.64893), pista0Spline_playa[192] = new pc.Vec3(49.2514, -.003848791, -50.07272), pista0Spline_playa[193] = new pc.Vec3(48.82722, -.003848538, -50.49707), pista0Spline_playa[194] = new pc.Vec3(48.4046, -.003848549, -50.923), pista0Spline_playa[195] = new pc.Vec3(47.98333, -.003848661, -51.3502), pista0Spline_playa[196] = new pc.Vec3(47.56248, -.003848437, -51.77794), pista0Spline_playa[197] = new pc.Vec3(47.14221, -.003848545, -52.20611), pista0Spline_playa[198] = new pc.Vec3(46.72228, -.003848311, -52.63468), pista0Spline_playa[199] = new pc.Vec3(46.30279, -.003848314, -53.06359), pista0Spline_playa[200] = new pc.Vec3(45.88347, -.003848314, -53.49282), pista0Spline_playa[201] = new pc.Vec3(45.46586, -.003848441, -53.92358), pista0Spline_playa[202] = new pc.Vec3(45.05598, -.003848568, -54.36175), pista0Spline_playa[203] = new pc.Vec3(44.64595, -.003848314, -54.79977), pista0Spline_playa[204] = new pc.Vec3(44.23943, -.003848091, -55.24107), pista0Spline_playa[205] = new pc.Vec3(43.83913, -.003847972, -55.68798), pista0Spline_playa[206] = new pc.Vec3(43.44776, -.003848076, -56.14276), pista0Spline_playa[207] = new pc.Vec3(43.06831, -.00384783, -56.60747), pista0Spline_playa[208] = new pc.Vec3(42.69868, -.003847845, -57.0801), pista0Spline_playa[209] = new pc.Vec3(42.33565, -.003847845, -57.55775), pista0Spline_playa[210] = new pc.Vec3(41.98127, -.003847599, -58.04193), pista0Spline_playa[211] = new pc.Vec3(41.63885, -.003847487, -58.53466), pista0Spline_playa[212] = new pc.Vec3(41.3117, -.003847376, -59.03759), pista0Spline_playa[213] = new pc.Vec3(41.00389, -.003847353, -59.55256), pista0Spline_playa[214] = new pc.Vec3(40.71855, -.003847495, -60.08033), pista0Spline_playa[215] = new pc.Vec3(40.45514, -.003847599, -60.61937), pista0Spline_playa[216] = new pc.Vec3(40.21196, -.003847376, -61.16782), pista0Spline_playa[217] = new pc.Vec3(39.9885, -.003847376, -61.72464), pista0Spline_playa[218] = new pc.Vec3(39.78416, -.003847495, -62.28875), pista0Spline_playa[219] = new pc.Vec3(39.59796, -.003847502, -62.85905), pista0Spline_playa[220] = new pc.Vec3(39.43153, -.003847599, -63.43548), pista0Spline_playa[221] = new pc.Vec3(39.28973, -.003847599, -64.01844), pista0Spline_playa[222] = new pc.Vec3(39.17034, -.003847256, -64.60641), pista0Spline_playa[223] = new pc.Vec3(39.06976, -.003847361, -65.1979), pista0Spline_playa[224] = new pc.Vec3(38.98344, -.003847137, -65.79163), pista0Spline_playa[225] = new pc.Vec3(38.90636, -.003846176, -66.38669), pista0Spline_playa[226] = new pc.Vec3(38.83994, -.003856413, -66.98298), pista0Spline_playa[227] = new pc.Vec3(38.78905, -.003885739, -67.5808), pista0Spline_playa[228] = new pc.Vec3(38.75078, -.003917925, -68.17957), pista0Spline_playa[229] = new pc.Vec3(38.72174, -.003936663, -68.77888), pista0Spline_playa[230] = new pc.Vec3(38.69904, -.003924236, -69.37843), pista0Spline_playa[231] = new pc.Vec3(38.67768, -.003875852, -69.97802), pista0Spline_playa[232] = new pc.Vec3(38.67272, -.003703944, -70.578), pista0Spline_playa[233] = new pc.Vec3(38.67016, -.003539659, -71.17799), pista0Spline_playa[234] = new pc.Vec3(38.66839, -.003373131, -71.77798), pista0Spline_playa[235] = new pc.Vec3(38.66692, -.003186211, -72.37798), pista0Spline_playa[236] = new pc.Vec3(38.66534, -.002960816, -72.97801), pista0Spline_playa[237] = new pc.Vec3(38.66302, -.002678521, -73.57802), pista0Spline_playa[238] = new pc.Vec3(38.66003, -.002343304, -74.17799), pista0Spline_playa[239] = new pc.Vec3(38.65704, -.001991622, -74.77795), pista0Spline_playa[240] = new pc.Vec3(38.65405, -.001624458, -75.37796), pista0Spline_playa[241] = new pc.Vec3(38.65092, -.001238696, -75.97793), pista0Spline_playa[242] = new pc.Vec3(38.64751, -.0008257478, -76.57794), pista0Spline_playa[243] = new pc.Vec3(38.64752, -1.490116e-8, -77.11954);
var pista0Spline_playa_angulos = [];
pista0Spline_playa_angulos[0] = new pc.Vec3(0, 0, 0), pista0Spline_playa_angulos[1] = new pc.Vec3(270.0685, 269.8481, 0), pista0Spline_playa_angulos[2] = new pc.Vec3(270.074, 269.7846, 0), pista0Spline_playa_angulos[3] = new pc.Vec3(270.0791, 269.7842, 0), pista0Spline_playa_angulos[4] = new pc.Vec3(270.0656, 269.8135, 0), pista0Spline_playa_angulos[5] = new pc.Vec3(270.0593, 269.879, 0), pista0Spline_playa_angulos[6] = new pc.Vec3(270.0343, 270.009, 0), pista0Spline_playa_angulos[7] = new pc.Vec3(270, 270.3117, 0), pista0Spline_playa_angulos[8] = new pc.Vec3(270, 270.5955, 0), pista0Spline_playa_angulos[9] = new pc.Vec3(270, 270.7561, 0), pista0Spline_playa_angulos[10] = new pc.Vec3(270.0396, 270.8164, 0), pista0Spline_playa_angulos[11] = new pc.Vec3(270.0839, 270.7576, 0), pista0Spline_playa_angulos[12] = new pc.Vec3(270.1583, .4393039, 270.0012), pista0Spline_playa_angulos[13] = new pc.Vec3(270.2471, .09662177, 270), pista0Spline_playa_angulos[14] = new pc.Vec3(270.3334, 359.8916, 269.9997), pista0Spline_playa_angulos[15] = new pc.Vec3(270.3976, 359.7296, 269.999), pista0Spline_playa_angulos[16] = new pc.Vec3(270.4406, 359.6014, 270.0009), pista0Spline_playa_angulos[17] = new pc.Vec3(270.4627, 359.5121, 269.9999), pista0Spline_playa_angulos[18] = new pc.Vec3(270.461, 359.4641, 269.9997), pista0Spline_playa_angulos[19] = new pc.Vec3(270.4392, 359.452, 269.9998), pista0Spline_playa_angulos[20] = new pc.Vec3(270.6483, 357.7767, 269.9998), pista0Spline_playa_angulos[21] = new pc.Vec3(270.7269, 358.0479, 270.0001), pista0Spline_playa_angulos[22] = new pc.Vec3(270.7598, 357.0167, 270.0001), pista0Spline_playa_angulos[23] = new pc.Vec3(270.7133, 355.0292, 270.0005), pista0Spline_playa_angulos[24] = new pc.Vec3(270.5925, 352.1198, 270.0007), pista0Spline_playa_angulos[25] = new pc.Vec3(270.4432, 349.1353, 270.0001), pista0Spline_playa_angulos[26] = new pc.Vec3(270.368, 347.5166, 270.0001), pista0Spline_playa_angulos[27] = new pc.Vec3(270.309, 346.0142, 269.9995), pista0Spline_playa_angulos[28] = new pc.Vec3(270.2374, 343.9736, 269.9996), pista0Spline_playa_angulos[29] = new pc.Vec3(270.1519, 341.3655, 270), pista0Spline_playa_angulos[30] = new pc.Vec3(270.0443, 248.0259, 0), pista0Spline_playa_angulos[31] = new pc.Vec3(270.0928, 243.3749, 0), pista0Spline_playa_angulos[32] = new pc.Vec3(270.2901, 148.3471, 89.99992), pista0Spline_playa_angulos[33] = new pc.Vec3(270.4723, 143.8783, 90), pista0Spline_playa_angulos[34] = new pc.Vec3(270.5855, 139.9813, 90.00029), pista0Spline_playa_angulos[35] = new pc.Vec3(270.634, 136.875, 89.99958), pista0Spline_playa_angulos[36] = new pc.Vec3(270.6199, 134.5823, 90.0002), pista0Spline_playa_angulos[37] = new pc.Vec3(270.5453, 133.1724, 90.00009), pista0Spline_playa_angulos[38] = new pc.Vec3(270.5016, 130.8521, 90.00007), pista0Spline_playa_angulos[39] = new pc.Vec3(270.5143, 128.1556, 89.99995), pista0Spline_playa_angulos[40] = new pc.Vec3(270.5109, 126.3812, 89.99964), pista0Spline_playa_angulos[41] = new pc.Vec3(270.4946, 125.1975, 89.99988), pista0Spline_playa_angulos[42] = new pc.Vec3(270.4706, 124.4802, 90.00015), pista0Spline_playa_angulos[43] = new pc.Vec3(270.4348, 124.238, 90.00003), pista0Spline_playa_angulos[44] = new pc.Vec3(270.3286, 123.6203, 89.9996), pista0Spline_playa_angulos[45] = new pc.Vec3(270.2526, 122.6025, 90.00005), pista0Spline_playa_angulos[46] = new pc.Vec3(270.2431, 122.4888, 89.9999), pista0Spline_playa_angulos[47] = new pc.Vec3(270.2374, 122.4107, 89.99948), pista0Spline_playa_angulos[48] = new pc.Vec3(270.2307, 122.3802, 90.00026), pista0Spline_playa_angulos[49] = new pc.Vec3(270.2281, 122.3957, 90.00097), pista0Spline_playa_angulos[50] = new pc.Vec3(270.1978, 122.3931, 90.00062), pista0Spline_playa_angulos[51] = new pc.Vec3(270.0906, 212.7913, 0), pista0Spline_playa_angulos[52] = new pc.Vec3(270.0485, 212.9805, 0), pista0Spline_playa_angulos[53] = new pc.Vec3(270, 212.1748, 0), pista0Spline_playa_angulos[54] = new pc.Vec3(270, 210.5372, 0), pista0Spline_playa_angulos[55] = new pc.Vec3(270.0198, 208.019, 0), pista0Spline_playa_angulos[56] = new pc.Vec3(270, 206.2521, 0), pista0Spline_playa_angulos[57] = new pc.Vec3(270, 205.6278, 0), pista0Spline_playa_angulos[58] = new pc.Vec3(270, 204.3601, 0), pista0Spline_playa_angulos[59] = new pc.Vec3(270, 202.5106, 0), pista0Spline_playa_angulos[60] = new pc.Vec3(270, 199.9485, 0), pista0Spline_playa_angulos[61] = new pc.Vec3(270, 196.4884, 0), pista0Spline_playa_angulos[62] = new pc.Vec3(270, 192.7118, 0), pista0Spline_playa_angulos[63] = new pc.Vec3(270, 189.9347, 0), pista0Spline_playa_angulos[64] = new pc.Vec3(270, 186.9509, 0), pista0Spline_playa_angulos[65] = new pc.Vec3(270, 183.4959, 0), pista0Spline_playa_angulos[66] = new pc.Vec3(270, 179.5542, 0), pista0Spline_playa_angulos[67] = new pc.Vec3(270, 175.2534, 0), pista0Spline_playa_angulos[68] = new pc.Vec3(270, 170.5535, 0), pista0Spline_playa_angulos[69] = new pc.Vec3(270, 166.0982, 0), pista0Spline_playa_angulos[70] = new pc.Vec3(270, 162.6204, 0), pista0Spline_playa_angulos[71] = new pc.Vec3(270, 159.8923, 0), pista0Spline_playa_angulos[72] = new pc.Vec3(270, 157.59, 0), pista0Spline_playa_angulos[73] = new pc.Vec3(270, 155.5769, 0), pista0Spline_playa_angulos[74] = new pc.Vec3(270, 153.8175, 0), pista0Spline_playa_angulos[75] = new pc.Vec3(270, 151.0367, 0), pista0Spline_playa_angulos[76] = new pc.Vec3(270, 147.1754, 0), pista0Spline_playa_angulos[77] = new pc.Vec3(270, 143.9807, 0), pista0Spline_playa_angulos[78] = new pc.Vec3(270, 141.6855, 0), pista0Spline_playa_angulos[79] = new pc.Vec3(270, 140.405, 0), pista0Spline_playa_angulos[80] = new pc.Vec3(270, 140.3148, 0), pista0Spline_playa_angulos[81] = new pc.Vec3(270, 139.4471, 0), pista0Spline_playa_angulos[82] = new pc.Vec3(270, 137.7912, 0), pista0Spline_playa_angulos[83] = new pc.Vec3(270, 136.7679, 0), pista0Spline_playa_angulos[84] = new pc.Vec3(270, 136.1799, 0), pista0Spline_playa_angulos[85] = new pc.Vec3(270, 136.035, 0), pista0Spline_playa_angulos[86] = new pc.Vec3(270, 136.4612, 0), pista0Spline_playa_angulos[87] = new pc.Vec3(270, 136.2439, 0), pista0Spline_playa_angulos[88] = new pc.Vec3(270, 136.1843, 0), pista0Spline_playa_angulos[89] = new pc.Vec3(270, 136.1714, 0), pista0Spline_playa_angulos[90] = new pc.Vec3(270, 136.2225, 0), pista0Spline_playa_angulos[91] = new pc.Vec3(270, 136.3417, 0), pista0Spline_playa_angulos[92] = new pc.Vec3(270, 136.4994, 0), pista0Spline_playa_angulos[93] = new pc.Vec3(270, 138.8747, 0), pista0Spline_playa_angulos[94] = new pc.Vec3(270, 138.9087, 0), pista0Spline_playa_angulos[95] = new pc.Vec3(270, 139.8188, 0), pista0Spline_playa_angulos[96] = new pc.Vec3(270, 141.3167, 0), pista0Spline_playa_angulos[97] = new pc.Vec3(270, 143.4819, 0), pista0Spline_playa_angulos[98] = new pc.Vec3(270, 145.9925, 0), pista0Spline_playa_angulos[99] = new pc.Vec3(270, 147.4461, 0), pista0Spline_playa_angulos[100] = new pc.Vec3(270, 148.902, 0), pista0Spline_playa_angulos[101] = new pc.Vec3(270, 151.239, 0), pista0Spline_playa_angulos[102] = new pc.Vec3(270, 154.386, 0), pista0Spline_playa_angulos[103] = new pc.Vec3(270, 158.3362, 0), pista0Spline_playa_angulos[104] = new pc.Vec3(270, 162.8663, 0), pista0Spline_playa_angulos[105] = new pc.Vec3(270, 167.0523, 0), pista0Spline_playa_angulos[106] = new pc.Vec3(270, 170.2793, 0), pista0Spline_playa_angulos[107] = new pc.Vec3(270, 172.7823, 0), pista0Spline_playa_angulos[108] = new pc.Vec3(270, 174.7222, 0), pista0Spline_playa_angulos[109] = new pc.Vec3(270, 176.2445, 0), pista0Spline_playa_angulos[110] = new pc.Vec3(270, 177.4811, 0), pista0Spline_playa_angulos[111] = new pc.Vec3(270, 179.6145, 0), pista0Spline_playa_angulos[112] = new pc.Vec3(270, 182.0183, 0), pista0Spline_playa_angulos[113] = new pc.Vec3(270, 183.9972, 0), pista0Spline_playa_angulos[114] = new pc.Vec3(270, 185.502, 0), pista0Spline_playa_angulos[115] = new pc.Vec3(270, 186.4473, 0), pista0Spline_playa_angulos[116] = new pc.Vec3(270, 187.0047, 0), pista0Spline_playa_angulos[117] = new pc.Vec3(270, 187.7271, 0), pista0Spline_playa_angulos[118] = new pc.Vec3(270, 188.7018, 0), pista0Spline_playa_angulos[119] = new pc.Vec3(270, 189.9277, 0), pista0Spline_playa_angulos[120] = new pc.Vec3(270, 191.3749, 0), pista0Spline_playa_angulos[121] = new pc.Vec3(270, 193.1129, 0), pista0Spline_playa_angulos[122] = new pc.Vec3(270, 194.9275, 0), pista0Spline_playa_angulos[123] = new pc.Vec3(270, 196.3334, 0), pista0Spline_playa_angulos[124] = new pc.Vec3(270, 197.814, 0), pista0Spline_playa_angulos[125] = new pc.Vec3(270, 199.557, 0), pista0Spline_playa_angulos[126] = new pc.Vec3(270, 201.6046, 0), pista0Spline_playa_angulos[127] = new pc.Vec3(270, 203.9674, 0), pista0Spline_playa_angulos[128] = new pc.Vec3(270, 206.3683, 0), pista0Spline_playa_angulos[129] = new pc.Vec3(270, 208.3325, 0), pista0Spline_playa_angulos[130] = new pc.Vec3(270, 210.5041, 0), pista0Spline_playa_angulos[131] = new pc.Vec3(270, 212.99, 0), pista0Spline_playa_angulos[132] = new pc.Vec3(270, 215.7988, 0), pista0Spline_playa_angulos[133] = new pc.Vec3(270, 218.8931, 0), pista0Spline_playa_angulos[134] = new pc.Vec3(270, 222.0808, 0), pista0Spline_playa_angulos[135] = new pc.Vec3(270.0198, 224.9106, 0), pista0Spline_playa_angulos[136] = new pc.Vec3(270, 227.4456, 0), pista0Spline_playa_angulos[137] = new pc.Vec3(270, 229.8698, 0), pista0Spline_playa_angulos[138] = new pc.Vec3(270, 232.3205, 0), pista0Spline_playa_angulos[139] = new pc.Vec3(270, 234.8881, 0), pista0Spline_playa_angulos[140] = new pc.Vec3(270, 237.8305, 0), pista0Spline_playa_angulos[141] = new pc.Vec3(270.0198, 241.0449, 0), pista0Spline_playa_angulos[142] = new pc.Vec3(270, 244.0789, 0), pista0Spline_playa_angulos[143] = new pc.Vec3(270, 246.8259, 0), pista0Spline_playa_angulos[144] = new pc.Vec3(270, 249.2232, 0), pista0Spline_playa_angulos[145] = new pc.Vec3(270, 251.2223, 0), pista0Spline_playa_angulos[146] = new pc.Vec3(270, 253.7717, 0), pista0Spline_playa_angulos[147] = new pc.Vec3(270, 256.4108, 0), pista0Spline_playa_angulos[148] = new pc.Vec3(270, 258.318, 0), pista0Spline_playa_angulos[149] = new pc.Vec3(270.028, 259.7048, 0), pista0Spline_playa_angulos[150] = new pc.Vec3(270, 260.6703, 0), pista0Spline_playa_angulos[151] = new pc.Vec3(270, 261.1458, 0), pista0Spline_playa_angulos[152] = new pc.Vec3(270.0198, 261.5428, 0), pista0Spline_playa_angulos[153] = new pc.Vec3(270, 262.3937, 0), pista0Spline_playa_angulos[154] = new pc.Vec3(270, 263.5773, 0), pista0Spline_playa_angulos[155] = new pc.Vec3(270, 265.1089, 0), pista0Spline_playa_angulos[156] = new pc.Vec3(270, 266.9204, 0), pista0Spline_playa_angulos[157] = new pc.Vec3(270, 268.8373, 0), pista0Spline_playa_angulos[158] = new pc.Vec3(270, 270.0121, 0), pista0Spline_playa_angulos[159] = new pc.Vec3(270, 271.1688, 0), pista0Spline_playa_angulos[160] = new pc.Vec3(270, 272.8142, 0), pista0Spline_playa_angulos[161] = new pc.Vec3(270, 274.9638, 0), pista0Spline_playa_angulos[162] = new pc.Vec3(270, 277.6726, 0), pista0Spline_playa_angulos[163] = new pc.Vec3(270, 281.0063, 0), pista0Spline_playa_angulos[164] = new pc.Vec3(270, 284.2744, 0), pista0Spline_playa_angulos[165] = new pc.Vec3(270, 287.1014, 0), pista0Spline_playa_angulos[166] = new pc.Vec3(270, 289.6712, 0), pista0Spline_playa_angulos[167] = new pc.Vec3(270, 292.005, 0), pista0Spline_playa_angulos[168] = new pc.Vec3(270, 293.9564, 0), pista0Spline_playa_angulos[169] = new pc.Vec3(270, 295.6734, 0), pista0Spline_playa_angulos[170] = new pc.Vec3(270, 297.9095, 0), pista0Spline_playa_angulos[171] = new pc.Vec3(270, 300.1155, 0), pista0Spline_playa_angulos[172] = new pc.Vec3(270, 301.6983, 0), pista0Spline_playa_angulos[173] = new pc.Vec3(270, 302.8463, 0), pista0Spline_playa_angulos[174] = new pc.Vec3(270, 303.665, 0), pista0Spline_playa_angulos[175] = new pc.Vec3(270, 304.1545, 0), pista0Spline_playa_angulos[176] = new pc.Vec3(270, 304.4669, 0), pista0Spline_playa_angulos[177] = new pc.Vec3(270, 305.1771, 0), pista0Spline_playa_angulos[178] = new pc.Vec3(270, 306.2736, 0), pista0Spline_playa_angulos[179] = new pc.Vec3(270, 307.5977, 0), pista0Spline_playa_angulos[180] = new pc.Vec3(270, 308.8592, 0), pista0Spline_playa_angulos[181] = new pc.Vec3(270, 311.1763, 0), pista0Spline_playa_angulos[182] = new pc.Vec3(270, 313.5432, 0), pista0Spline_playa_angulos[183] = new pc.Vec3(270, 313.5729, 0), pista0Spline_playa_angulos[184] = new pc.Vec3(270, 313.6283, 0), pista0Spline_playa_angulos[185] = new pc.Vec3(270, 313.7435, 0), pista0Spline_playa_angulos[186] = new pc.Vec3(270, 313.9011, 0), pista0Spline_playa_angulos[187] = new pc.Vec3(270, 314.097, 0), pista0Spline_playa_angulos[188] = new pc.Vec3(270, 314.3568, 0), pista0Spline_playa_angulos[189] = new pc.Vec3(270, 314.7146, 0), pista0Spline_playa_angulos[190] = new pc.Vec3(270, 314.9446, 0), pista0Spline_playa_angulos[191] = new pc.Vec3(270, 315.0724, 0), pista0Spline_playa_angulos[192] = new pc.Vec3(270, 315.0468, 0), pista0Spline_playa_angulos[193] = new pc.Vec3(270, 314.8978, 0), pista0Spline_playa_angulos[194] = new pc.Vec3(270, 314.6465, 0), pista0Spline_playa_angulos[195] = new pc.Vec3(270, 314.5612, 0), pista0Spline_playa_angulos[196] = new pc.Vec3(270, 314.4974, 0), pista0Spline_playa_angulos[197] = new pc.Vec3(270, 314.4463, 0), pista0Spline_playa_angulos[198] = new pc.Vec3(270, 314.3909, 0), pista0Spline_playa_angulos[199] = new pc.Vec3(270, 314.344, 0), pista0Spline_playa_angulos[200] = new pc.Vec3(270, 314.3014, 0), pista0Spline_playa_angulos[201] = new pc.Vec3(270, 313.3172, 0), pista0Spline_playa_angulos[202] = new pc.Vec3(270, 313.2405, 0), pista0Spline_playa_angulos[203] = new pc.Vec3(270, 312.9424, 0), pista0Spline_playa_angulos[204] = new pc.Vec3(270, 312.3284, 0), pista0Spline_playa_angulos[205] = new pc.Vec3(270, 311.3475, 0), pista0Spline_playa_angulos[206] = new pc.Vec3(270, 310.0315, 0), pista0Spline_playa_angulos[207] = new pc.Vec3(270, 308.5761, 0), pista0Spline_playa_angulos[208] = new pc.Vec3(270.0198, 307.6193, 0), pista0Spline_playa_angulos[209] = new pc.Vec3(270, 306.7555, 0), pista0Spline_playa_angulos[210] = new pc.Vec3(270, 305.5398, 0), pista0Spline_playa_angulos[211] = new pc.Vec3(270, 303.9942, 0), pista0Spline_playa_angulos[212] = new pc.Vec3(270, 302.0392, 0), pista0Spline_playa_angulos[213] = new pc.Vec3(270, 299.659, 0), pista0Spline_playa_angulos[214] = new pc.Vec3(270, 297.1604, 0), pista0Spline_playa_angulos[215] = new pc.Vec3(270, 294.9674, 0), pista0Spline_playa_angulos[216] = new pc.Vec3(270, 292.8719, 0), pista0Spline_playa_angulos[217] = new pc.Vec3(270, 290.874, 0), pista0Spline_playa_angulos[218] = new pc.Vec3(270, 288.9645, 0), pista0Spline_playa_angulos[219] = new pc.Vec3(270, 287.21, 0), pista0Spline_playa_angulos[220] = new pc.Vec3(270, 284.9392, 0), pista0Spline_playa_angulos[221] = new pc.Vec3(270, 282.5197, 0), pista0Spline_playa_angulos[222] = new pc.Vec3(270, 280.5042, 0), pista0Spline_playa_angulos[223] = new pc.Vec3(270, 278.884, 0), pista0Spline_playa_angulos[224] = new pc.Vec3(270, 277.728, 0), pista0Spline_playa_angulos[225] = new pc.Vec3(270, 276.956, 0), pista0Spline_playa_angulos[226] = new pc.Vec3(270, 275.6271, 0), pista0Spline_playa_angulos[227] = new pc.Vec3(270, 274.2112, 0), pista0Spline_playa_angulos[228] = new pc.Vec3(270, 273.1674, 0), pista0Spline_playa_angulos[229] = new pc.Vec3(270, 272.4157, 0), pista0Spline_playa_angulos[230] = new pc.Vec3(270, 271.9673, 0), pista0Spline_playa_angulos[231] = new pc.Vec3(270, 271.3787, 0), pista0Spline_playa_angulos[232] = new pc.Vec3(270, 270.3174, 0), pista0Spline_playa_angulos[233] = new pc.Vec3(270, 270.2143, 0), pista0Spline_playa_angulos[234] = new pc.Vec3(270.0198, 270.1613, 0), pista0Spline_playa_angulos[235] = new pc.Vec3(270, 270.158, 0), pista0Spline_playa_angulos[236] = new pc.Vec3(270.028, 270.2047, 0), pista0Spline_playa_angulos[237] = new pc.Vec3(270, 270.3013, 0), pista0Spline_playa_angulos[238] = new pc.Vec3(270.0198, 270.316, 0), pista0Spline_playa_angulos[239] = new pc.Vec3(270.028, 270.3235, 0), pista0Spline_playa_angulos[240] = new pc.Vec3(270, 270.3311, 0), pista0Spline_playa_angulos[241] = new pc.Vec3(270.0396, 270.3452, 0), pista0Spline_playa_angulos[242] = new pc.Vec3(270.028, 270.3716, 0), pista0Spline_playa_angulos[243] = new pc.Vec3(270.028, 270.3716, 0);
var conexionPista1 = [],
    vientoPista1 = [];
vientoPista1[0] = 25, vientoPista1[1] = 124;
var pista1Spline_playa = [];
pista1Spline_playa[0] = new pc.Vec3(0, 0, 0), pista1Spline_playa[1] = new pc.Vec3(.001370014, .002618313, -.5999818), pista1Spline_playa[2] = new pc.Vec3(.002381568, .002618313, -1.200003), pista1Spline_playa[3] = new pc.Vec3(.003232726, .002539158, -1.799986), pista1Spline_playa[4] = new pc.Vec3(.004091753, .002030134, -2.4), pista1Spline_playa[5] = new pc.Vec3(.004515666, .001805544, -2.999977), pista1Spline_playa[6] = new pc.Vec3(.004542853, .002768517, -3.599985), pista1Spline_playa[7] = new pc.Vec3(.004241976, .005002499, -4.199988), pista1Spline_playa[8] = new pc.Vec3(.003925842, .007898092, -4.799966), pista1Spline_playa[9] = new pc.Vec3(.003296905, .01107979, -5.399961), pista1Spline_playa[10] = new pc.Vec3(.002691331, .01417112, -5.999949), pista1Spline_playa[11] = new pc.Vec3(.002062393, .01679444, -6.599959), pista1Spline_playa[12] = new pc.Vec3(.001578413, .01857447, -7.199962), pista1Spline_playa[13] = new pc.Vec3(.001185985, .01932478, -7.799942), pista1Spline_playa[14] = new pc.Vec3(.0008240733, .01933098, -8.399945), pista1Spline_playa[15] = new pc.Vec3(.0004550125, .01882553, -8.999946), pista1Spline_playa[16] = new pc.Vec3(100255e-9, .0180366, -9.599938), pista1Spline_playa[17] = new pc.Vec3(-.0001238529, .01719308, -10.19996), pista1Spline_playa[18] = new pc.Vec3(-257358e-9, .01652431, -10.79994), pista1Spline_playa[19] = new pc.Vec3(.0002509616, .01642752, -11.39993), pista1Spline_playa[20] = new pc.Vec3(.00280394, .01753688, -11.99992), pista1Spline_playa[21] = new pc.Vec3(.005188122, .01846862, -12.59992), pista1Spline_playa[22] = new pc.Vec3(.007382527, .01940131, -13.19992), pista1Spline_playa[23] = new pc.Vec3(.009637007, .02033472, -13.79991), pista1Spline_playa[24] = new pc.Vec3(.01186956, .02126956, -14.3999), pista1Spline_playa[25] = new pc.Vec3(.01382745, .02192473, -14.99988), pista1Spline_playa[26] = new pc.Vec3(.01965248, .02625728, -15.59982), pista1Spline_playa[27] = new pc.Vec3(.02648553, .03152943, -16.19978), pista1Spline_playa[28] = new pc.Vec3(.03332526, .03673077, -16.79969), pista1Spline_playa[29] = new pc.Vec3(.04009633, .04193282, -17.39964), pista1Spline_playa[30] = new pc.Vec3(.04683688, .04713702, -17.99958), pista1Spline_playa[31] = new pc.Vec3(.05404472, .0523603, -18.5995), pista1Spline_playa[32] = new pc.Vec3(.05436898, .05742168, -19.19939), pista1Spline_playa[33] = new pc.Vec3(.03429804, .06183886, -19.79902), pista1Spline_playa[34] = new pc.Vec3(.01627368, .06618428, -20.39874), pista1Spline_playa[35] = new pc.Vec3(-.001712531, .07048965, -20.99847), pista1Spline_playa[36] = new pc.Vec3(-.01993526, .07483958, -21.59816), pista1Spline_playa[37] = new pc.Vec3(-.03848604, .07931709, -22.19785), pista1Spline_playa[38] = new pc.Vec3(-.05780929, .08400656, -22.79754), pista1Spline_playa[39] = new pc.Vec3(-.08409053, .09064102, -23.39687), pista1Spline_playa[40] = new pc.Vec3(-.1120884, .09910607, -23.99614), pista1Spline_playa[41] = new pc.Vec3(-.1407805, .1082366, -24.5954), pista1Spline_playa[42] = new pc.Vec3(-.1779259, .1185639, -25.19411), pista1Spline_playa[43] = new pc.Vec3(-.2308089, .1305094, -25.7916), pista1Spline_playa[44] = new pc.Vec3(-.3068316, .144398, -26.38655), pista1Spline_playa[45] = new pc.Vec3(-.4118364, .1606016, -26.977), pista1Spline_playa[46] = new pc.Vec3(-.5404141, .1796594, -27.56273), pista1Spline_playa[47] = new pc.Vec3(-.687575, .2011003, -28.14393), pista1Spline_playa[48] = new pc.Vec3(-.8548105, .2241516, -28.71965), pista1Spline_playa[49] = new pc.Vec3(-1.043128, .2481856, -29.28877), pista1Spline_playa[50] = new pc.Vec3(-1.253702, .2724447, -29.85003), pista1Spline_playa[51] = new pc.Vec3(-1.48775, .296169, -30.40192), pista1Spline_playa[52] = new pc.Vec3(-1.744295, .3194405, -30.94374), pista1Spline_playa[53] = new pc.Vec3(-2.02088, .3427677, -31.47565), pista1Spline_playa[54] = new pc.Vec3(-2.316898, .3661859, -31.99695), pista1Spline_playa[55] = new pc.Vec3(-2.632084, .3897097, -32.50692), pista1Spline_playa[56] = new pc.Vec3(-2.966563, .4133341, -33.00441), pista1Spline_playa[57] = new pc.Vec3(-3.320874, .4370475, -33.48798), pista1Spline_playa[58] = new pc.Vec3(-3.695564, .4607887, -33.95594), pista1Spline_playa[59] = new pc.Vec3(-4.089601, .4844382, -34.40771), pista1Spline_playa[60] = new pc.Vec3(-4.501438, .507941, -34.84337), pista1Spline_playa[61] = new pc.Vec3(-4.930219, .5313933, -35.26235), pista1Spline_playa[62] = new pc.Vec3(-5.375305, .5548623, -35.66394), pista1Spline_playa[63] = new pc.Vec3(-5.836317, .57847, -36.04719), pista1Spline_playa[64] = new pc.Vec3(-6.312934, .6022875, -36.41077), pista1Spline_playa[65] = new pc.Vec3(-6.805277, .6261261, -36.75278), pista1Spline_playa[66] = new pc.Vec3(-7.312259, .6498549, -37.07269), pista1Spline_playa[67] = new pc.Vec3(-7.832101, .6735079, -37.37124), pista1Spline_playa[68] = new pc.Vec3(-8.363452, .6971462, -37.64883), pista1Spline_playa[69] = new pc.Vec3(-8.904967, .7208602, -37.90597), pista1Spline_playa[70] = new pc.Vec3(-9.45579, .7446935, -38.14269), pista1Spline_playa[71] = new pc.Vec3(-10.01498, .7686946, -38.35872), pista1Spline_playa[72] = new pc.Vec3(-10.58195, .7926013, -38.55343), pista1Spline_playa[73] = new pc.Vec3(-11.15595, .8163879, -38.72645), pista1Spline_playa[74] = new pc.Vec3(-11.73616, .840162, -38.87727), pista1Spline_playa[75] = new pc.Vec3(-12.32185, .8639648, -39.00505), pista1Spline_playa[76] = new pc.Vec3(-12.91229, .8878801, -39.10873), pista1Spline_playa[77] = new pc.Vec3(-13.50666, .9119766, -39.18676), pista1Spline_playa[78] = new pc.Vec3(-14.10392, .9360826, -39.23844), pista1Spline_playa[79] = new pc.Vec3(-14.7028, .9600084, -39.26478), pista1Spline_playa[80] = new pc.Vec3(-15.3023, .9838665, -39.26647), pista1Spline_playa[81] = new pc.Vec3(-15.90135, 1.007732, -39.24393), pista1Spline_playa[82] = new pc.Vec3(-16.49899, 1.031685, -39.19722), pista1Spline_playa[83] = new pc.Vec3(-17.09422, 1.055832, -39.12595), pista1Spline_playa[84] = new pc.Vec3(-17.68581, 1.080099, -39.02903), pista1Spline_playa[85] = new pc.Vec3(-18.2725, 1.104265, -38.90606), pista1Spline_playa[86] = new pc.Vec3(-18.85352, 1.128322, -38.75846), pista1Spline_playa[87] = new pc.Vec3(-19.42814, 1.152372, -38.58756), pista1Spline_playa[88] = new pc.Vec3(-19.99563, 1.176475, -38.39436), pista1Spline_playa[89] = new pc.Vec3(-20.5553, 1.200693, -38.17958), pista1Spline_playa[90] = new pc.Vec3(-21.10645, 1.225084, -37.94378), pista1Spline_playa[91] = new pc.Vec3(-21.64845, 1.249424, -37.68767), pista1Spline_playa[92] = new pc.Vec3(-22.18039, 1.273588, -37.41127), pista1Spline_playa[93] = new pc.Vec3(-22.70097, 1.297739, -37.11395), pista1Spline_playa[94] = new pc.Vec3(-23.20865, 1.321928, -36.7952), pista1Spline_playa[95] = new pc.Vec3(-23.70184, 1.346241, -36.45448), pista1Spline_playa[96] = new pc.Vec3(-24.17874, 1.370764, -36.09128), pista1Spline_playa[97] = new pc.Vec3(-24.63859, 1.395244, -35.70674), pista1Spline_playa[98] = new pc.Vec3(-25.08193, 1.419611, -35.30323), pista1Spline_playa[99] = new pc.Vec3(-25.50865, 1.44387, -34.88219), pista1Spline_playa[100] = new pc.Vec3(-25.91828, 1.468136, -34.44451), pista1Spline_playa[101] = new pc.Vec3(-26.30994, 1.492489, -33.99074), pista1Spline_playa[102] = new pc.Vec3(-26.68223, 1.517038, -33.5209), pista1Spline_playa[103] = new pc.Vec3(-27.03324, 1.541729, -33.03498), pista1Spline_playa[104] = new pc.Vec3(-27.36198, 1.56632, -32.53374), pista1Spline_playa[105] = new pc.Vec3(-27.66901, 1.590816, -32.01889), pista1Spline_playa[106] = new pc.Vec3(-27.9545, 1.615265, -31.49177), pista1Spline_playa[107] = new pc.Vec3(-28.21867, 1.639736, -30.95367), pista1Spline_playa[108] = new pc.Vec3(-28.46121, 1.664346, -30.40548), pista1Spline_playa[109] = new pc.Vec3(-28.68174, 1.689199, -29.84809), pista1Spline_playa[110] = new pc.Vec3(-28.87907, 1.71401, -29.28206), pista1Spline_playa[111] = new pc.Vec3(-29.05293, 1.738683, -28.70838), pista1Spline_playa[112] = new pc.Vec3(-29.20369, 1.763313, -28.12821), pista1Spline_playa[113] = new pc.Vec3(-29.33101, 1.787925, -27.54244), pista1Spline_playa[114] = new pc.Vec3(-29.43453, 1.812616, -26.95201), pista1Spline_playa[115] = new pc.Vec3(-29.51347, 1.837526, -26.3578), pista1Spline_playa[116] = new pc.Vec3(-29.5673, 1.862501, -25.76079), pista1Spline_playa[117] = new pc.Vec3(-29.59674, 1.887306, -25.1621), pista1Spline_playa[118] = new pc.Vec3(-29.60185, 1.912019, -24.56266), pista1Spline_playa[119] = new pc.Vec3(-29.58222, 1.936676, -23.96354), pista1Spline_playa[120] = new pc.Vec3(-29.53716, 1.961433, -23.36581), pista1Spline_playa[121] = new pc.Vec3(-29.46538, 1.986374, -22.7707), pista1Spline_playa[122] = new pc.Vec3(-29.36552, 2.011474, -22.17967), pista1Spline_playa[123] = new pc.Vec3(-29.23733, 2.036543, -21.59417), pista1Spline_playa[124] = new pc.Vec3(-29.08237, 2.06146, -21.01511), pista1Spline_playa[125] = new pc.Vec3(-28.90187, 2.086262, -20.44352), pista1Spline_playa[126] = new pc.Vec3(-28.69691, 2.111156, -19.88021), pista1Spline_playa[127] = new pc.Vec3(-28.46843, 2.136173, -19.32604), pista1Spline_playa[128] = new pc.Vec3(-28.2172, 2.161382, -18.7818), pista1Spline_playa[129] = new pc.Vec3(-27.94361, 2.186695, -18.24846), pista1Spline_playa[130] = new pc.Vec3(-27.64873, 2.211841, -17.72659), pista1Spline_playa[131] = new pc.Vec3(-27.33349, 2.236885, -17.21677), pista1Spline_playa[132] = new pc.Vec3(-26.99835, 2.261955, -16.71973), pista1Spline_playa[133] = new pc.Vec3(-26.64356, 2.287134, -16.23663), pista1Spline_playa[134] = new pc.Vec3(-26.26861, 2.312467, -15.76896), pista1Spline_playa[135] = new pc.Vec3(-25.8733, 2.337951, -15.3184), pista1Spline_playa[136] = new pc.Vec3(-25.4585, 2.363319, -14.88567), pista1Spline_playa[137] = new pc.Vec3(-25.02585, 2.388576, -14.47082), pista1Spline_playa[138] = new pc.Vec3(-24.57636, 2.413774, -14.07428), pista1Spline_playa[139] = new pc.Vec3(-24.11079, 2.438989, -13.69669), pista1Spline_playa[140] = new pc.Vec3(-23.62986, 2.464351, -13.33896), pista1Spline_playa[141] = new pc.Vec3(-23.13394, 2.489944, -13.00227), pista1Spline_playa[142] = new pc.Vec3(-22.62381, 2.515516, -12.68754), pista1Spline_playa[143] = new pc.Vec3(-22.10081, 2.540891, -12.39469), pista1Spline_playa[144] = new pc.Vec3(-21.56598, 2.566166, -12.12403), pista1Spline_playa[145] = new pc.Vec3(-21.02011, 2.591467, -11.87633), pista1Spline_playa[146] = new pc.Vec3(-20.46394, 2.616882, -11.65281), pista1Spline_playa[147] = new pc.Vec3(-19.89807, 2.642517, -11.45509), pista1Spline_playa[148] = new pc.Vec3(-19.32324, 2.668291, -11.28535), pista1Spline_playa[149] = new pc.Vec3(-18.74072, 2.693928, -11.14412), pista1Spline_playa[150] = new pc.Vec3(-18.15228, 2.719433, -11.03), pista1Spline_playa[151] = new pc.Vec3(-17.55939, 2.744898, -10.94181), pista1Spline_playa[152] = new pc.Vec3(-16.96329, 2.77042, -10.87884), pista1Spline_playa[153] = new pc.Vec3(-16.36512, 2.79611, -10.84073), pista1Spline_playa[154] = new pc.Vec3(-15.76585, 2.822032, -10.82748), pista1Spline_playa[155] = new pc.Vec3(-15.16658, 2.847927, -10.83972), pista1Spline_playa[156] = new pc.Vec3(-14.56838, 2.87366, -10.8776), pista1Spline_playa[157] = new pc.Vec3(-13.97236, 2.899344, -10.94116), pista1Spline_playa[158] = new pc.Vec3(-13.37965, 2.925057, -11.03052), pista1Spline_playa[159] = new pc.Vec3(-12.79151, 2.950903, -11.14599), pista1Spline_playa[160] = new pc.Vec3(-12.20917, 2.976991, -11.28794), pista1Spline_playa[161] = new pc.Vec3(-11.63389, 3.003137, -11.45618), pista1Spline_playa[162] = new pc.Vec3(-11.06625, 3.029096, -11.64875), pista1Spline_playa[163] = new pc.Vec3(-10.50715, 3.054978, -11.86475), pista1Spline_playa[164] = new pc.Vec3(-9.95734, 3.080838, -12.10349), pista1Spline_playa[165] = new pc.Vec3(-9.41797, 3.106795, -12.36497), pista1Spline_playa[166] = new pc.Vec3(-8.890555, 3.132939, -12.64972), pista1Spline_playa[167] = new pc.Vec3(-8.376873, 3.159246, -12.95851), pista1Spline_playa[168] = new pc.Vec3(-7.877939, 3.185471, -13.29066), pista1Spline_playa[169] = new pc.Vec3(-7.394137, 3.211538, -13.64451), pista1Spline_playa[170] = new pc.Vec3(-6.92607, 3.237538, -14.01887), pista1Spline_playa[171] = new pc.Vec3(-6.474472, 3.263567, -14.413), pista1Spline_playa[172] = new pc.Vec3(-6.040379, 3.289743, -14.82628), pista1Spline_playa[173] = new pc.Vec3(-5.62522, 3.316115, -15.2586), pista1Spline_playa[174] = new pc.Vec3(-5.230234, 3.343725, -15.7093), pista1Spline_playa[175] = new pc.Vec3(-4.855752, 3.372804, -16.17712), pista1Spline_playa[176] = new pc.Vec3(-4.502111, 3.40199, -16.66087), pista1Spline_playa[177] = new pc.Vec3(-4.169927, 3.430093, -17.15967), pista1Spline_playa[178] = new pc.Vec3(-3.860322, 3.455822, -17.67289), pista1Spline_playa[179] = new pc.Vec3(-3.574763, 3.477707, -18.20007), pista1Spline_playa[180] = new pc.Vec3(-3.316102, 3.494924, -18.74109), pista1Spline_playa[181] = new pc.Vec3(-3.086617, 3.508467, -19.2952), pista1Spline_playa[182] = new pc.Vec3(-2.884946, 3.518919, -19.86013), pista1Spline_playa[183] = new pc.Vec3(-2.708658, 3.526265, -20.43353), pista1Spline_playa[184] = new pc.Vec3(-2.555459, 3.530587, -21.01361), pista1Spline_playa[185] = new pc.Vec3(-2.42299, 3.531921, -21.59875), pista1Spline_playa[186] = new pc.Vec3(-2.3103, 3.530317, -22.18801), pista1Spline_playa[187] = new pc.Vec3(-2.225313, 3.526266, -22.78183), pista1Spline_playa[188] = new pc.Vec3(-2.169783, 3.519819, -23.37919), pista1Spline_playa[189] = new pc.Vec3(-2.135441, 3.510516, -23.97809), pista1Spline_playa[190] = new pc.Vec3(-2.114756, 3.497922, -24.57756), pista1Spline_playa[191] = new pc.Vec3(-2.100806, 3.481387, -25.17719), pista1Spline_playa[192] = new pc.Vec3(-2.084292, 3.461947, -25.77662), pista1Spline_playa[193] = new pc.Vec3(-2.079043, 3.428935, -26.37564), pista1Spline_playa[194] = new pc.Vec3(-2.077523, 3.392709, -26.97455), pista1Spline_playa[195] = new pc.Vec3(-2.076941, 3.35572, -27.57341), pista1Spline_playa[196] = new pc.Vec3(-2.076788, 3.318148, -28.17223), pista1Spline_playa[197] = new pc.Vec3(-2.076664, 3.280178, -28.77104), pista1Spline_playa[198] = new pc.Vec3(-2.076176, 3.241988, -29.36981), pista1Spline_playa[199] = new pc.Vec3(-2.075537, 3.191919, -29.96768), pista1Spline_playa[200] = new pc.Vec3(-2.075818, 3.125431, -30.56395), pista1Spline_playa[201] = new pc.Vec3(-2.07581, 3.057573, -31.16011), pista1Spline_playa[202] = new pc.Vec3(-2.075963, 2.989356, -31.75623), pista1Spline_playa[203] = new pc.Vec3(-2.076029, 2.92053, -32.35226), pista1Spline_playa[204] = new pc.Vec3(-2.076113, 2.850841, -32.94819), pista1Spline_playa[205] = new pc.Vec3(-2.076208, 2.773729, -33.54318), pista1Spline_playa[206] = new pc.Vec3(-2.076124, 2.68359, -34.13632), pista1Spline_playa[207] = new pc.Vec3(-2.075903, 2.578381, -34.72701), pista1Spline_playa[208] = new pc.Vec3(-2.075629, 2.471811, -35.31749), pista1Spline_playa[209] = new pc.Vec3(-2.075453, 2.364599, -35.90782), pista1Spline_playa[210] = new pc.Vec3(-2.075228, 2.257485, -36.49819), pista1Spline_playa[211] = new pc.Vec3(-2.074839, 2.151851, -37.0888), pista1Spline_playa[212] = new pc.Vec3(-2.076365, 2.04404, -37.679), pista1Spline_playa[213] = new pc.Vec3(-2.080229, 1.931756, -38.2684), pista1Spline_playa[214] = new pc.Vec3(-2.083742, 1.820314, -38.85793), pista1Spline_playa[215] = new pc.Vec3(-2.08753, 1.708925, -39.4475), pista1Spline_playa[216] = new pc.Vec3(-2.091192, 1.597446, -40.03703), pista1Spline_playa[217] = new pc.Vec3(-2.094851, 1.48574, -40.62653), pista1Spline_playa[218] = new pc.Vec3(-2.100024, 1.372738, -41.2157), pista1Spline_playa[219] = new pc.Vec3(-2.138498, 1.274317, -41.8063), pista1Spline_playa[220] = new pc.Vec3(-2.183595, 1.175736, -42.39641), pista1Spline_playa[221] = new pc.Vec3(-2.237836, 1.081095, -42.98638), pista1Spline_playa[222] = new pc.Vec3(-2.30243, .9895911, -43.57583), pista1Spline_playa[223] = new pc.Vec3(-2.378823, .9017954, -44.1644), pista1Spline_playa[224] = new pc.Vec3(-2.468666, .817986, -44.75164), pista1Spline_playa[225] = new pc.Vec3(-2.571266, .7380371, -45.33734), pista1Spline_playa[226] = new pc.Vec3(-2.68357, .6616173, -45.92175), pista1Spline_playa[227] = new pc.Vec3(-2.806129, .5888565, -46.50456), pista1Spline_playa[228] = new pc.Vec3(-2.940619, .5196865, -47.08514), pista1Spline_playa[229] = new pc.Vec3(-3.088842, .4543853, -47.66285), pista1Spline_playa[230] = new pc.Vec3(-3.252603, .3930686, -48.23677), pista1Spline_playa[231] = new pc.Vec3(-3.433781, .3361902, -48.80587), pista1Spline_playa[232] = new pc.Vec3(-3.63819, .2836936, -49.36747), pista1Spline_playa[233] = new pc.Vec3(-3.866068, .2349017, -49.92033), pista1Spline_playa[234] = new pc.Vec3(-4.110029, .1901257, -50.46661), pista1Spline_playa[235] = new pc.Vec3(-4.363533, .1497753, -51.0089), pista1Spline_playa[236] = new pc.Vec3(-4.619975, .1140573, -51.55015), pista1Spline_playa[237] = new pc.Vec3(-4.872423, .08318973, -52.09357), pista1Spline_playa[238] = new pc.Vec3(-5.118085, .05810237, -52.64035), pista1Spline_playa[239] = new pc.Vec3(-5.37147, .04065347, -53.1839), pista1Spline_playa[240] = new pc.Vec3(-5.636183, .03017783, -53.72224), pista1Spline_playa[241] = new pc.Vec3(-5.899358, .02470136, -54.2614), pista1Spline_playa[242] = new pc.Vec3(-6.148628, .02239728, -54.80712), pista1Spline_playa[243] = new pc.Vec3(-6.371314, .02127528, -55.36417), pista1Spline_playa[244] = new pc.Vec3(-6.553904, .0191772, -55.93552), pista1Spline_playa[245] = new pc.Vec3(-6.687147, .01657033, -56.52036), pista1Spline_playa[246] = new pc.Vec3(-6.780129, .01544023, -57.11299), pista1Spline_playa[247] = new pc.Vec3(-6.844861, .01548219, -57.70945), pista1Spline_playa[248] = new pc.Vec3(-6.889855, .0162375, -58.3077), pista1Spline_playa[249] = new pc.Vec3(-6.922467, .01732516, -58.90684), pista1Spline_playa[250] = new pc.Vec3(-6.949734, .01833797, -59.50616), pista1Spline_playa[251] = new pc.Vec3(-6.980103, .01875186, -60.10537), pista1Spline_playa[252] = new pc.Vec3(-7.008011, .01872659, -60.70472), pista1Spline_playa[253] = new pc.Vec3(-7.022671, .01872754, -61.3045), pista1Spline_playa[254] = new pc.Vec3(-7.020676, .01898646, -61.90444), pista1Spline_playa[255] = new pc.Vec3(-6.997059, .01282048, -62.50383), pista1Spline_playa[256] = new pc.Vec3(-6.977768, .0007560253, -63.10305), pista1Spline_playa[257] = new pc.Vec3(-6.976696, .0007731915, -63.70304), pista1Spline_playa[258] = new pc.Vec3(-6.977859, .0020082, -64.30303), pista1Spline_playa[259] = new pc.Vec3(-6.978836, .002678156, -64.90303), pista1Spline_playa[260] = new pc.Vec3(-6.978172, .002688646, -65.50303), pista1Spline_playa[261] = new pc.Vec3(-6.977867, .002666235, -66.10302), pista1Spline_playa[262] = new pc.Vec3(-6.977859, .002666712, -66.32037);
var pista1Spline_playa_angulos = [];
pista1Spline_playa_angulos[0] = new pc.Vec3(0, 0, 0), pista1Spline_playa_angulos[1] = new pc.Vec3(270, 269.8941, 0), pista1Spline_playa_angulos[2] = new pc.Vec3(270, 269.9052, 0), pista1Spline_playa_angulos[3] = new pc.Vec3(270, 269.8841, 0), pista1Spline_playa_angulos[4] = new pc.Vec3(270.0485, 269.9014, 0), pista1Spline_playa_angulos[5] = new pc.Vec3(270, 269.9885, 0), pista1Spline_playa_angulos[6] = new pc.Vec3(270.1678, .01054621, 270.0012), pista1Spline_playa_angulos[7] = new pc.Vec3(270.2495, .04451734, 270.0004), pista1Spline_playa_angulos[8] = new pc.Vec3(270.2961, .04994724, 270.0003), pista1Spline_playa_angulos[9] = new pc.Vec3(270.3052, .06668896, 270), pista1Spline_playa_angulos[10] = new pc.Vec3(270.2784, .05549686, 270.0004), pista1Spline_playa_angulos[11] = new pc.Vec3(270.2167, .04985591, 270), pista1Spline_playa_angulos[12] = new pc.Vec3(270.117, .03735246, 270.0016), pista1Spline_playa_angulos[13] = new pc.Vec3(270, 270.0773, 0), pista1Spline_playa_angulos[14] = new pc.Vec3(270.0343, 270.0006, 0), pista1Spline_playa_angulos[15] = new pc.Vec3(270.0626, 269.9738, 0), pista1Spline_playa_angulos[16] = new pc.Vec3(270.0839, 269.9354, 0), pista1Spline_playa_angulos[17] = new pc.Vec3(270.0713, 269.9412, 0), pista1Spline_playa_angulos[18] = new pc.Vec3(270.0343, 269.9632, 0), pista1Spline_playa_angulos[19] = new pc.Vec3(270.0713, 269.8779, 0), pista1Spline_playa_angulos[20] = new pc.Vec3(270.0839, 269.8773, 0), pista1Spline_playa_angulos[21] = new pc.Vec3(270.0839, 269.8604, 0), pista1Spline_playa_angulos[22] = new pc.Vec3(270.0839, 269.8773, 0), pista1Spline_playa_angulos[23] = new pc.Vec3(270.0885, 269.8718, 0), pista1Spline_playa_angulos[24] = new pc.Vec3(270.0885, 269.8719, 0), pista1Spline_playa_angulos[25] = new pc.Vec3(270.1312, 359.7435, 269.9996), pista1Spline_playa_angulos[26] = new pc.Vec3(270.5417, 359.3088, 269.9998), pista1Spline_playa_angulos[27] = new pc.Vec3(270.4965, 359.3311, 270), pista1Spline_playa_angulos[28] = new pc.Vec3(270.4969, 359.3645, 270), pista1Spline_playa_angulos[29] = new pc.Vec3(270.4969, 359.3533, 269.9999), pista1Spline_playa_angulos[30] = new pc.Vec3(270.4969, 359.3531, 270.0003), pista1Spline_playa_angulos[31] = new pc.Vec3(270.5067, 359.0966, 270.0001), pista1Spline_playa_angulos[32] = new pc.Vec3(270.4325, 1.728634, 269.9998), pista1Spline_playa_angulos[33] = new pc.Vec3(270.4187, 1.750922, 270), pista1Spline_playa_angulos[34] = new pc.Vec3(270.4112, 1.711856, 269.9998), pista1Spline_playa_angulos[35] = new pc.Vec3(270.4121, 1.723205, 270), pista1Spline_playa_angulos[36] = new pc.Vec3(270.4206, 1.750621, 270.0005), pista1Spline_playa_angulos[37] = new pc.Vec3(270.4361, 1.800665, 270.0005), pista1Spline_playa_angulos[38] = new pc.Vec3(270.4605, 1.885139, 269.9996), pista1Spline_playa_angulos[39] = new pc.Vec3(270.8287, 3.11286, 269.9999), pista1Spline_playa_angulos[40] = new pc.Vec3(270.829, 2.55986, 270.0001), pista1Spline_playa_angulos[41] = new pc.Vec3(270.9245, 3.057252, 269.9998), pista1Spline_playa_angulos[42] = new pc.Vec3(271.0583, 4.208464, 269.9998), pista1Spline_playa_angulos[43] = new pc.Vec3(271.2296, 6.061878, 269.9999), pista1Spline_playa_angulos[44] = new pc.Vec3(271.4266, 8.728277, 270.0001), pista1Spline_playa_angulos[45] = new pc.Vec3(271.6882, 11.37496, 270.0002), pista1Spline_playa_angulos[46] = new pc.Vec3(271.9511, 13.24374, 269.9999), pista1Spline_playa_angulos[47] = new pc.Vec3(272.1351, 15.16801, 269.9999), pista1Spline_playa_angulos[48] = new pc.Vec3(272.2612, 17.23194, 270), pista1Spline_playa_angulos[49] = new pc.Vec3(272.3195, 19.42487, 269.9999), pista1Spline_playa_angulos[50] = new pc.Vec3(272.3023, 21.75532, 270), pista1Spline_playa_angulos[51] = new pc.Vec3(272.2405, 24.17898, 269.9999), pista1Spline_playa_angulos[52] = new pc.Vec3(272.2221, 26.41352, 269.9999), pista1Spline_playa_angulos[53] = new pc.Vec3(272.2323, 28.52608, 269.9999), pista1Spline_playa_angulos[54] = new pc.Vec3(272.2424, 30.63702, 269.9999), pista1Spline_playa_angulos[55] = new pc.Vec3(272.2519, 32.79549, 270.0001), pista1Spline_playa_angulos[56] = new pc.Vec3(272.2617, 35.04113, 270), pista1Spline_playa_angulos[57] = new pc.Vec3(272.2678, 37.44764, 270.0001), pista1Spline_playa_angulos[58] = new pc.Vec3(272.2665, 39.92256, 269.9999), pista1Spline_playa_angulos[59] = new pc.Vec3(272.2501, 42.23209, 270.0001), pista1Spline_playa_angulos[60] = new pc.Vec3(272.2401, 44.54624, 270.0001), pista1Spline_playa_angulos[61] = new pc.Vec3(272.2399, 46.80119, 270.0001), pista1Spline_playa_angulos[62] = new pc.Vec3(272.2454, 49.10061, 270.0001), pista1Spline_playa_angulos[63] = new pc.Vec3(272.2642, 51.45599, 270.0001), pista1Spline_playa_angulos[64] = new pc.Vec3(272.2791, 53.92137, 270), pista1Spline_playa_angulos[65] = new pc.Vec3(272.2729, 56.48211, 270), pista1Spline_playa_angulos[66] = new pc.Vec3(272.2623, 58.95628, 270.0001), pista1Spline_playa_angulos[67] = new pc.Vec3(272.2579, 61.27719, 270), pista1Spline_playa_angulos[68] = new pc.Vec3(272.2616, 63.51222, 270.0001), pista1Spline_playa_angulos[69] = new pc.Vec3(272.2668, 65.68756, 270), pista1Spline_playa_angulos[70] = new pc.Vec3(272.2891, 67.79987, 270.0001), pista1Spline_playa_angulos[71] = new pc.Vec3(272.2939, 69.94674, 270.0001), pista1Spline_playa_angulos[72] = new pc.Vec3(272.2741, 72.13403, 270.0001), pista1Spline_playa_angulos[73] = new pc.Vec3(272.2702, 74.33147, 270.0001), pista1Spline_playa_angulos[74] = new pc.Vec3(272.2712, 76.55648, 269.9999), pista1Spline_playa_angulos[75] = new pc.Vec3(272.2778, 78.85558, 270), pista1Spline_playa_angulos[76] = new pc.Vec3(272.2934, 81.26009, 270), pista1Spline_playa_angulos[77] = new pc.Vec3(272.3049, 83.79049, 270.0001), pista1Spline_playa_angulos[78] = new pc.Vec3(272.2929, 86.2799, 270.0001), pista1Spline_playa_angulos[79] = new pc.Vec3(272.2813, 88.66641, 269.9999), pista1Spline_playa_angulos[80] = new pc.Vec3(272.2778, 90.99747, 270), pista1Spline_playa_angulos[81] = new pc.Vec3(272.2821, 93.3108, 270), pista1Spline_playa_angulos[82] = new pc.Vec3(272.2946, 95.6418, 270), pista1Spline_playa_angulos[83] = new pc.Vec3(272.3156, 98.03452, 269.9999), pista1Spline_playa_angulos[84] = new pc.Vec3(272.3161, 100.5714, 269.9999), pista1Spline_playa_angulos[85] = new pc.Vec3(272.302, 103.0661, 269.9999), pista1Spline_playa_angulos[86] = new pc.Vec3(272.2969, 105.4206, 270.0001), pista1Spline_playa_angulos[87] = new pc.Vec3(272.2997, 107.6925, 270.0001), pista1Spline_playa_angulos[88] = new pc.Vec3(272.3063, 109.8997, 270), pista1Spline_playa_angulos[89] = new pc.Vec3(272.3246, 112.0877, 270), pista1Spline_playa_angulos[90] = new pc.Vec3(272.3326, 114.2275, 270), pista1Spline_playa_angulos[91] = new pc.Vec3(272.3143, 116.3504, 270.0001), pista1Spline_playa_angulos[92] = new pc.Vec3(272.3034, 118.5704, 270.0001), pista1Spline_playa_angulos[93] = new pc.Vec3(272.3091, 120.9074, 270.0001), pista1Spline_playa_angulos[94] = new pc.Vec3(272.3149, 123.3658, 270.0001), pista1Spline_playa_angulos[95] = new pc.Vec3(272.3322, 125.9447, 270.0001), pista1Spline_playa_angulos[96] = new pc.Vec3(272.3433, 128.6312, 270), pista1Spline_playa_angulos[97] = new pc.Vec3(272.3338, 131.1312, 270.0001), pista1Spline_playa_angulos[98] = new pc.Vec3(272.3203, 133.463, 269.9999), pista1Spline_playa_angulos[99] = new pc.Vec3(272.3163, 135.7587, 269.9999), pista1Spline_playa_angulos[100] = new pc.Vec3(272.3207, 138.0384, 270), pista1Spline_playa_angulos[101] = new pc.Vec3(272.3321, 140.38, 269.9999), pista1Spline_playa_angulos[102] = new pc.Vec3(272.3582, 142.8575, 269.9999), pista1Spline_playa_angulos[103] = new pc.Vec3(272.3565, 145.4586, 270.0001), pista1Spline_playa_angulos[104] = new pc.Vec3(272.342, 147.9823, 270.0001), pista1Spline_playa_angulos[105] = new pc.Vec3(272.3374, 150.379, 270), pista1Spline_playa_angulos[106] = new pc.Vec3(272.3353, 152.7095, 269.9999), pista1Spline_playa_angulos[107] = new pc.Vec3(272.3424, 154.973, 269.9999), pista1Spline_playa_angulos[108] = new pc.Vec3(272.3639, 157.2727, 270), pista1Spline_playa_angulos[109] = new pc.Vec3(272.3744, 159.5945, 269.9999), pista1Spline_playa_angulos[110] = new pc.Vec3(272.3615, 161.9758, 269.9999), pista1Spline_playa_angulos[111] = new pc.Vec3(272.355, 164.2857, 270), pista1Spline_playa_angulos[112] = new pc.Vec3(272.3499, 166.5805, 270), pista1Spline_playa_angulos[113] = new pc.Vec3(272.3524, 168.8706, 270), pista1Spline_playa_angulos[114] = new pc.Vec3(272.3653, 171.233, 269.9999), pista1Spline_playa_angulos[115] = new pc.Vec3(272.3889, 173.6309, 270), pista1Spline_playa_angulos[116] = new pc.Vec3(272.3803, 176.0182, 269.9999), pista1Spline_playa_angulos[117] = new pc.Vec3(272.3633, 178.3481, 270), pista1Spline_playa_angulos[118] = new pc.Vec3(272.3573, 180.6864, 269.9999), pista1Spline_playa_angulos[119] = new pc.Vec3(272.3588, 183.093, 269.9999), pista1Spline_playa_angulos[120] = new pc.Vec3(272.3734, 185.5779, 269.9999), pista1Spline_playa_angulos[121] = new pc.Vec3(272.3927, 188.22, 270.0001), pista1Spline_playa_angulos[122] = new pc.Vec3(272.3998, 190.9995, 269.9999), pista1Spline_playa_angulos[123] = new pc.Vec3(272.3871, 193.684, 270), pista1Spline_playa_angulos[124] = new pc.Vec3(272.3733, 196.2715, 270), pista1Spline_playa_angulos[125] = new pc.Vec3(272.3682, 198.7644, 270.0001), pista1Spline_playa_angulos[126] = new pc.Vec3(272.3851, 201.2108, 270), pista1Spline_playa_angulos[127] = new pc.Vec3(272.3976, 203.5965, 270), pista1Spline_playa_angulos[128] = new pc.Vec3(272.4156, 205.9761, 269.9999), pista1Spline_playa_angulos[129] = new pc.Vec3(272.4105, 208.3218, 269.9998), pista1Spline_playa_angulos[130] = new pc.Vec3(272.3954, 210.6087, 270), pista1Spline_playa_angulos[131] = new pc.Vec3(272.3917, 212.8643, 270), pista1Spline_playa_angulos[132] = new pc.Vec3(272.4006, 215.1203, 269.9999), pista1Spline_playa_angulos[133] = new pc.Vec3(272.4086, 217.4885, 269.9999), pista1Spline_playa_angulos[134] = new pc.Vec3(272.4328, 219.9717, 269.9998), pista1Spline_playa_angulos[135] = new pc.Vec3(272.4332, 222.5567, 270), pista1Spline_playa_angulos[136] = new pc.Vec3(272.4142, 224.9991, 270), pista1Spline_playa_angulos[137] = new pc.Vec3(272.4107, 227.3909, 269.9999), pista1Spline_playa_angulos[138] = new pc.Vec3(272.4063, 229.7621, 270.0001), pista1Spline_playa_angulos[139] = new pc.Vec3(272.4136, 232.1535, 270), pista1Spline_playa_angulos[140] = new pc.Vec3(272.4337, 234.589, 270), pista1Spline_playa_angulos[141] = new pc.Vec3(272.4464, 237.0895, 270), pista1Spline_playa_angulos[142] = new pc.Vec3(272.432, 239.5552, 269.9999), pista1Spline_playa_angulos[143] = new pc.Vec3(272.4171, 241.9525, 270), pista1Spline_playa_angulos[144] = new pc.Vec3(272.4139, 244.3672, 269.9999), pista1Spline_playa_angulos[145] = new pc.Vec3(272.4214, 246.8272, 270), pista1Spline_playa_angulos[146] = new pc.Vec3(272.4347, 249.3943, 270), pista1Spline_playa_angulos[147] = new pc.Vec3(272.4619, 252.106, 270), pista1Spline_playa_angulos[148] = new pc.Vec3(272.4597, 254.977, 270.0001), pista1Spline_playa_angulos[149] = new pc.Vec3(272.4413, 257.7194, 270), pista1Spline_playa_angulos[150] = new pc.Vec3(272.434, 260.2964, 270), pista1Spline_playa_angulos[151] = new pc.Vec3(272.4339, 262.7651, 269.9999), pista1Spline_playa_angulos[152] = new pc.Vec3(272.4443, 265.1632, 270), pista1Spline_playa_angulos[153] = new pc.Vec3(272.4679, 267.5352, 270.0001), pista1Spline_playa_angulos[154] = new pc.Vec3(272.4785, 269.9456, 270.0001), pista1Spline_playa_angulos[155] = new pc.Vec3(272.4628, 272.3974, 269.9999), pista1Spline_playa_angulos[156] = new pc.Vec3(272.4538, 274.8511, 270.0001), pista1Spline_playa_angulos[157] = new pc.Vec3(272.4537, 277.3236, 270), pista1Spline_playa_angulos[158] = new pc.Vec3(272.4613, 279.8316, 269.9999), pista1Spline_playa_angulos[159] = new pc.Vec3(272.4788, 282.3914, 270.0001), pista1Spline_playa_angulos[160] = new pc.Vec3(272.4984, 285.0109, 270), pista1Spline_playa_angulos[161] = new pc.Vec3(272.4889, 287.5399, 269.9999), pista1Spline_playa_angulos[162] = new pc.Vec3(272.4748, 289.9369, 269.9999), pista1Spline_playa_angulos[163] = new pc.Vec3(272.4695, 292.2911, 270), pista1Spline_playa_angulos[164] = new pc.Vec3(272.4737, 294.6554, 270.0001), pista1Spline_playa_angulos[165] = new pc.Vec3(272.4873, 297.0891, 270), pista1Spline_playa_angulos[166] = new pc.Vec3(272.5087, 299.6723, 270.0001), pista1Spline_playa_angulos[167] = new pc.Vec3(272.515, 302.3628, 269.9999), pista1Spline_playa_angulos[168] = new pc.Vec3(272.4943, 304.9353, 270), pista1Spline_playa_angulos[169] = new pc.Vec3(272.486, 307.4233, 270.0001), pista1Spline_playa_angulos[170] = new pc.Vec3(272.4835, 309.8903, 270), pista1Spline_playa_angulos[171] = new pc.Vec3(272.4922, 312.3572, 270), pista1Spline_playa_angulos[172] = new pc.Vec3(272.5096, 314.8659, 269.9999), pista1Spline_playa_angulos[173] = new pc.Vec3(272.5674, 317.4692, 269.9999), pista1Spline_playa_angulos[174] = new pc.Vec3(272.7172, 320.0516, 270.0001), pista1Spline_playa_angulos[175] = new pc.Vec3(272.7974, 322.5772, 270), pista1Spline_playa_angulos[176] = new pc.Vec3(272.753, 325.0782, 270.0001), pista1Spline_playa_angulos[177] = new pc.Vec3(272.593, 327.6104, 269.9999), pista1Spline_playa_angulos[178] = new pc.Vec3(272.3018, 330.2129, 270), pista1Spline_playa_angulos[179] = new pc.Vec3(271.8622, 332.9372, 270.0001), pista1Spline_playa_angulos[180] = new pc.Vec3(271.4361, 335.9791, 270.0001), pista1Spline_playa_angulos[181] = new pc.Vec3(271.1481, 338.9996, 269.9999), pista1Spline_playa_angulos[182] = new pc.Vec3(270.849, 341.6904, 270.0002), pista1Spline_playa_angulos[183] = new pc.Vec3(270.556, 344.0897, 270.0002), pista1Spline_playa_angulos[184] = new pc.Vec3(270.2691, 346.2357, 270.0007), pista1Spline_playa_angulos[185] = new pc.Vec3(270, 258.1171, 0), pista1Spline_playa_angulos[186] = new pc.Vec3(270.2727, 170.445, 89.99928), pista1Spline_playa_angulos[187] = new pc.Vec3(270.4934, 173.4007, 90), pista1Spline_playa_angulos[188] = new pc.Vec3(270.7444, 175.8477, 90.00013), pista1Spline_playa_angulos[189] = new pc.Vec3(271.0367, 177.49, 89.99995), pista1Spline_playa_angulos[190] = new pc.Vec3(271.3743, 178.483, 90), pista1Spline_playa_angulos[191] = new pc.Vec3(271.7879, 178.8062, 90.00003), pista1Spline_playa_angulos[192] = new pc.Vec3(272.2291, 178.4767, 89.99994), pista1Spline_playa_angulos[193] = new pc.Vec3(273.4191, 179.8045, 90), pista1Spline_playa_angulos[194] = new pc.Vec3(273.5006, 179.8995, 89.99999), pista1Spline_playa_angulos[195] = new pc.Vec3(273.565, 179.9721, 90), pista1Spline_playa_angulos[196] = new pc.Vec3(273.6118, 179.9888, 90), pista1Spline_playa_angulos[197] = new pc.Vec3(273.6416, 179.9776, 90.00007), pista1Spline_playa_angulos[198] = new pc.Vec3(273.8371, 179.9161, 90.00005), pista1Spline_playa_angulos[199] = new pc.Vec3(275.7639, 180.0224, 89.99999), pista1Spline_playa_angulos[200] = new pc.Vec3(276.4851, 180.0112, 90), pista1Spline_playa_angulos[201] = new pc.Vec3(276.5073, 180.0112, 90.00001), pista1Spline_playa_angulos[202] = new pc.Vec3(276.554, 180.0168, 90), pista1Spline_playa_angulos[203] = new pc.Vec3(276.6245, 180.0056, 89.99998), pista1Spline_playa_angulos[204] = new pc.Vec3(276.7199, 180.0112, 89.99998), pista1Spline_playa_angulos[205] = new pc.Vec3(278.2807, 180.0169, 89.99998), pista1Spline_playa_angulos[206] = new pc.Vec3(279.7255, 179.983, 90.00001), pista1Spline_playa_angulos[207] = new pc.Vec3(280.1761, 179.983, 89.99999), pista1Spline_playa_angulos[208] = new pc.Vec3(280.2728, 179.9773, 89.99999), pista1Spline_playa_angulos[209] = new pc.Vec3(280.2994, 179.9717, 89.99999), pista1Spline_playa_angulos[210] = new pc.Vec3(280.2554, 179.983, 90), pista1Spline_playa_angulos[211] = new pc.Vec3(279.9313, 179.9377, 90), pista1Spline_playa_angulos[212] = new pc.Vec3(280.8709, 180.3803, 90.00002), pista1Spline_playa_angulos[213] = new pc.Vec3(280.7117, 180.3518, 89.99999), pista1Spline_playa_angulos[214] = new pc.Vec3(280.6993, 180.3518, 90), pista1Spline_playa_angulos[215] = new pc.Vec3(280.7013, 180.3631, 90), pista1Spline_playa_angulos[216] = new pc.Vec3(280.7163, 180.3518, 90), pista1Spline_playa_angulos[217] = new pc.Vec3(280.8452, 180.1987, 89.99999), pista1Spline_playa_angulos[218] = new pc.Vec3(280.0224, 182.3336, 90.00001), pista1Spline_playa_angulos[219] = new pc.Vec3(279.5267, 184.0114, 89.99998), pista1Spline_playa_angulos[220] = new pc.Vec3(279.2366, 184.7956, 89.99998), pista1Spline_playa_angulos[221] = new pc.Vec3(278.9383, 185.721, 90), pista1Spline_playa_angulos[222] = new pc.Vec3(278.5985, 186.7879, 90), pista1Spline_playa_angulos[223] = new pc.Vec3(278.2272, 187.9972, 90), pista1Spline_playa_angulos[224] = new pc.Vec3(277.8339, 189.3841, 90), pista1Spline_playa_angulos[225] = new pc.Vec3(277.4834, 190.4723, 89.99999), pista1Spline_playa_angulos[226] = new pc.Vec3(277.1474, 191.3455, 90), pista1Spline_playa_angulos[227] = new pc.Vec3(276.7888, 192.4442, 90), pista1Spline_playa_angulos[228] = new pc.Vec3(276.4407, 193.691, 89.99998), pista1Spline_playa_angulos[229] = new pc.Vec3(276.057, 195.151, 90.00002), pista1Spline_playa_angulos[230] = new pc.Vec3(275.659, 196.7485, 90), pista1Spline_playa_angulos[231] = new pc.Vec3(275.227, 198.7771, 90.00002), pista1Spline_playa_angulos[232] = new pc.Vec3(274.84, 201.2299, 90), pista1Spline_playa_angulos[233] = new pc.Vec3(274.4769, 203.3033, 90), pista1Spline_playa_angulos[234] = new pc.Vec3(274.0709, 204.6231, 90), pista1Spline_playa_angulos[235] = new pc.Vec3(273.6365, 205.2814, 90), pista1Spline_playa_angulos[236] = new pc.Vec3(273.1868, 205.2314, 90.00003), pista1Spline_playa_angulos[237] = new pc.Vec3(272.7095, 204.2986, 89.99996), pista1Spline_playa_angulos[238] = new pc.Vec3(272.0309, 204.3715, 89.99995), pista1Spline_playa_angulos[239] = new pc.Vec3(271.293, 205.8893, 89.99993), pista1Spline_playa_angulos[240] = new pc.Vec3(270.7298, 206.3494, 89.99987), pista1Spline_playa_angulos[241] = new pc.Vec3(270.3345, 205.5473, 90.00059), pista1Spline_playa_angulos[242] = new pc.Vec3(270.1267, 203.4229, 90.00077), pista1Spline_playa_angulos[243] = new pc.Vec3(270.1136, 289.8565, 0), pista1Spline_playa_angulos[244] = new pc.Vec3(270.2423, 195.3601, 90), pista1Spline_playa_angulos[245] = new pc.Vec3(270.2008, 190.7009, 89.99951), pista1Spline_playa_angulos[246] = new pc.Vec3(270.0485, 277.3734, 0), pista1Spline_playa_angulos[247] = new pc.Vec3(270.0343, 275.2009, 0), pista1Spline_playa_angulos[248] = new pc.Vec3(270.0928, 273.7182, 0), pista1Spline_playa_angulos[249] = new pc.Vec3(270.1009, 272.8831, 0), pista1Spline_playa_angulos[250] = new pc.Vec3(270.074, 272.7824, 0), pista1Spline_playa_angulos[251] = new pc.Vec3(270, 273.0037, 0), pista1Spline_playa_angulos[252] = new pc.Vec3(270, 272.0522, 0), pista1Spline_playa_angulos[253] = new pc.Vec3(270, 270.669, 0), pista1Spline_playa_angulos[254] = new pc.Vec3(270.0443, 268.9299, 0), pista1Spline_playa_angulos[255] = new pc.Vec3(271.928, 176.4437, 89.99992), pista1Spline_playa_angulos[256] = new pc.Vec3(270.1119, 269.5993, 0), pista1Spline_playa_angulos[257] = new pc.Vec3(270.0885, 270.1256, 0), pista1Spline_playa_angulos[258] = new pc.Vec3(270.1154, 270.2502, 0), pista1Spline_playa_angulos[259] = new pc.Vec3(270, 269.9866, 0), pista1Spline_playa_angulos[260] = new pc.Vec3(270, 269.9429, 0), pista1Spline_playa_angulos[261] = new pc.Vec3(270, 269.9809, 0), pista1Spline_playa_angulos[262] = new pc.Vec3(270, 269.9809, 0);
var CameraPath = pc.createScript("cameraPath");
CameraPath.attributes.add("velocidad", {
    type: "number",
    title: "velocidad"
}), CameraPath.attributes.add("posInicial", {
    type: "number"
}), CameraPath.attributes.add("carroseriaArray", {
    type: "entity",
    array: !0
}), CameraPath.attributes.add("activo", {
    type: "boolean",
    default: !1,
    description: "si se movera o no el auto"
}), CameraPath.attributes.add("color", {
    type: "number",
    enum: [{
        color1: 1
    }, {
        color2: 2
    }, {
        color3: 3
    }, {
        color4: 4
    }],
    default: 1,
    description: "Color del auto"
}), CameraPath.attributes.add("carril", {
    type: "number",
    enum: [{
        carril1: 0
    }, {
        carril2: 1
    }, {
        carril3: 2
    }, {
        carril4: 3
    }, {
        carril5: 4
    }],
    default: 2,
    description: "Carril del auto"
}), CameraPath.attributes.add("currentTramo", {
    type: "number",
    default: 0
}), CameraPath.prototype.initialize = function() {
    _app = this.app, this.currentCarril = -1, this.carroseria = null, this.carrilPosX = [.8 * -.46, .8 * -.23, 0, .23 * .8, .46 * .8]
}, CameraPath.prototype.setSkin = function(t) {
    for (var e = 0; e < this.carroseriaArray.length; e++) this.carroseriaArray[e].enabled = !1;
    this.carroseria = this.carroseriaArray[t], this.carroseria.enabled = !0
}, CameraPath.prototype.setColor = function(t) {
    this.carroseria.script.autoColorManager.setColorTrafico(t)
}, CameraPath.prototype.setCarril = function(t) {
    this.currentCarril = t
}, CameraPath.prototype.apagaPistas = function() {
    for (var t = 0; t < this.pistas.children.length; t++) this.pistas.children[t].enabled = !1
}, CameraPath.prototype.start = function(t) {
    null != t && (this.pistas = t), this.recienCambiado = !1, this.entity.enabled = !0, this.currentTramo = 0, this.porcentaje = currentPorcentaje + this.posInicial, this.setVelocidad(), this.setSkin(Math.floor(3 * Math.random())), this.setColor(Math.floor(4 * Math.random())), this.setCarril(Math.floor(5 * Math.random())), this.createPath(), this.entity.setPosition(this.px.value(this.porcentaje), this.py.value(this.porcentaje), this.pz.value(this.porcentaje)), this.entity.lookAt(this.px.value(.01), this.py.value(.01), this.pz.value(.01)), this.pathListo = !0
}, CameraPath.prototype.reStart = function(t) {
    null != t && (this.pistas = t), this.entity.enabled = !0;
    var e = Math.floor(Math.random() * delays.length),
        a = delays[e];
    delays.splice(e, 1), 0 == delays.length && (delays = [500, 1e3, 2e3, 2500, 3e3, 3500]), setTimeout(function() {
        this.reposicionar()
    }.bind(this), a)
}, CameraPath.prototype.setVelocidad = function() {
    var t = this.pistas[this.currentTramo][1].length;
    this.velocidad = 4.84 / t
}, CameraPath.prototype.detener = function() {
    this.pathListo = !1, this.carroseria.enabled = !1
}, CameraPath.prototype.reposicionar = function() {
    this.porcentaje = currentPorcentaje + .25, this.porcentaje >= 1 || 0 == this.currentTramo ? (this.porcentaje = this.porcentaje - 1, 0 == this.currentTramo && (this.porcentaje = .1), this.currentTramo = currentTramo, this.currentTramo = this.currentTramo + 1, this.setVelocidad(), this.setSkin(Math.floor(3 * Math.random())), this.setColor(Math.floor(4 * Math.random())), this.setCarril(Math.floor(5 * Math.random())), this.createPath(), this.pathListo = !0) : (this.currentTramo = currentTramo, this.setVelocidad(), this.setColor(Math.floor(4 * Math.random())), this.setCarril(Math.floor(5 * Math.random())), this.createPath(), this.pathListo = !0)
}, CameraPath.prototype.update = function(t) {
    if (this.pathListo && this.activo && !_autoControl.pauseGame) {
        this.porcentaje = this.porcentaje + this.velocidad * t;
        var e = this.porcentaje;
        this.entity.setLocalEulerAngles(0, 0, 0), this.entity.setLocalPosition(0, 0, 0), this.entity.setPosition(this.px.value(e), this.py.value(e) + .25, this.pz.value(e)), this.carroseria.enabled || (this.carroseria.enabled = !0);
        var a = this.entity.getPosition().clone(),
            i = a.clone().add(this.entity.up.clone().scale(-.5)),
            r = this.app.systems.rigidbody.raycastAll(a, i),
            o = !1,
            s = null;
        if (r)
            for (var n = 0; n < r.length; n++) {
                var h = r[n];
                if (h && ("camino" == h.entity.name || "caminoPuente" == h.entity.name || "caminoArena" == h.entity.name)) {
                    this.entity.setPosition(h.point.x, h.point.y + .0028, h.point.z), s = h;
                    break
                }
            }
        var c = new pc.Vec3(this.px.value(e + .01), this.py.value(e + .01), this.pz.value(e + .01));
        if (null != s) {
            var l = this.entity.getPosition().clone();
            if (this.entity.setPosition(l.x, c.y, l.z), this.entity.lookAt(c), this.entity.setPosition(l), s && ("camino" == s.entity.name || "caminoPuente" == s.entity.name || "caminoArena" == s.entity.name)) {
                o = !0;
                var p = s.normal.clone().normalize(),
                    u = fromToRotation(pc.Vec3.UP, p),
                    d = this.entity.getRotation().clone(),
                    m = u.mul(d);
                this.entity.setRotation(m), this.carroseria.setLocalPosition(0, 0, 0);
                var y = this.carroseria.getLocalPosition();
                this.carroseria.setLocalPosition(this.carrilPosX[this.currentCarril], y.y, y.z)
            }
        }
        o || (this.entity.setPosition(this.px.value(e), this.py.value(e) + .0028, this.pz.value(e)), console.log("soy el auto " + this.entity.name + " en el percent " + e), console.log(r)), e >= 1 ? (this.porcentaje = 0, this.currentTramo = this.currentTramo + 1, this.setVelocidad(), this.createPath(), this.pathListo = !0, console.log("me reinicie por fin de percent")) : currentTramo == this.currentTramo && e >= currentPorcentaje + .99 ? (this.porcentaje = currentPorcentaje + .3, this.setVelocidad(), this.setColor(Math.floor(4 * Math.random())), this.setCarril(Math.floor(5 * Math.random())), this.createPath(), this.pathListo = !0, console.log("me reinicie por  tramos iguales")) : currentTramo < this.currentTramo && e + 1 >= currentPorcentaje + .99 && (currentPorcentaje + .4 >= 1 ? (this.porcentaje = currentPorcentaje + .4 - 1, this.setVelocidad(), this.setColor(Math.floor(4 * Math.random())), this.setCarril(Math.floor(5 * Math.random())), this.createPath(), this.pathListo = !0, console.log("auto queda en tramo adelantado")) : (this.porcentaje = currentPorcentaje + .4, this.currentTramo = this.currentTramo - 1, this.setVelocidad(), this.setColor(Math.floor(4 * Math.random())), this.setCarril(Math.floor(5 * Math.random())), this.createPath(), this.pathListo = !0, console.log("auto retrocede un tramo")))
    }
}, CameraPath.prototype.createPath = function() {
    this.pathListo = !1;
    var t = pc.CURVE_CARDINAL;
    this.px = new pc.Curve, this.px.type = t, this.py = new pc.Curve, this.py.type = t, this.pz = new pc.Curve, this.pz.type = t, this.tx = new pc.Curve, this.tx.type = t, this.ty = new pc.Curve, this.ty.type = t, this.tz = new pc.Curve, this.tz.type = t, this.ux = new pc.Curve, this.ux.type = t, this.uy = new pc.Curve, this.uy.type = t, this.uz = new pc.Curve, this.uz.type = t;
    var e = this.pistas[this.currentTramo][0],
        a = this.pistas[this.currentTramo][1],
        r = (new pc.Vec3, e.getPosition()),
        o = 0,
        s = [],
        n = new pc.Vec3;
    s.push(0);
    for (i = 2; i < a.length; i++) {
        var h = new pc.Vec3,
            c = new pc.Vec3(-1 * a[i - 1].x, a[i - 1].y, a[i - 1].z);
        h.add2(r, c);
        var l = new pc.Vec3,
            p = new pc.Vec3(-1 * a[i].x, a[i].y, a[i].z);
        l.add2(r, p), n.sub2(h, l), o += n.length(), s.push(o)
    }
    window["pista" + this.currentTramo + "Spline_angulos"];
    for (i = 1; i < a.length; i++) {
        var u = s[i - 1] / o,
            d = new pc.Vec3;
        p = new pc.Vec3(-1 * a[i].x, a[i].y, a[i].z);
        d.add2(r, p);
        var m = d;
        this.px.add(u, m.x), this.py.add(u, m.y), this.pz.add(u, m.z)
    }
}, CameraPath.prototype.stop = function() {
    this.entity.enabled = !1, this.currentTramo = 0, this.pathListo = !1
};
var conexionPista2 = [],
    vientoPista2 = [];
vientoPista2[0] = 25, vientoPista2[1] = 124;
var pista2Spline_playa = [];
pista2Spline_playa[0] = new pc.Vec3(0, 0, 0), pista2Spline_playa[1] = new pc.Vec3(.001520394, -.001604718, -.6000365), pista2Spline_playa[2] = new pc.Vec3(.002601857, -.004586467, -1.199991), pista2Spline_playa[3] = new pc.Vec3(.003664367, -.007345586, -1.800006), pista2Spline_playa[4] = new pc.Vec3(.004982465, -.008676534, -2.399971), pista2Spline_playa[5] = new pc.Vec3(.006906985, -.007094014, -2.999943), pista2Spline_playa[6] = new pc.Vec3(.01006366, .0001797774, -3.599937), pista2Spline_playa[7] = new pc.Vec3(.01490979, .01543508, -4.199703), pista2Spline_playa[8] = new pc.Vec3(.02084264, .03619772, -4.799335), pista2Spline_playa[9] = new pc.Vec3(.02737392, .06036706, -5.398798), pista2Spline_playa[10] = new pc.Vec3(.03401918, .08584533, -5.998239), pista2Spline_playa[11] = new pc.Vec3(.04028726, .1105341, -6.597747), pista2Spline_playa[12] = new pc.Vec3(.04390077, .1315374, -7.197359), pista2Spline_playa[13] = new pc.Vec3(.04741512, .1522209, -7.796946), pista2Spline_playa[14] = new pc.Vec3(.05142061, .1762388, -8.396435), pista2Spline_playa[15] = new pc.Vec3(.0473323, .2009737, -8.995928), pista2Spline_playa[16] = new pc.Vec3(.02670927, .2242246, -9.59504), pista2Spline_playa[17] = new pc.Vec3(-.01907158, .2436819, -10.19298), pista2Spline_playa[18] = new pc.Vec3(-.08629382, .2594685, -10.7889), pista2Spline_playa[19] = new pc.Vec3(-.1666271, .2734796, -11.38341), pista2Spline_playa[20] = new pc.Vec3(-.2633149, .2856082, -11.97531), pista2Spline_playa[21] = new pc.Vec3(-.3807727, .2955302, -12.56365), pista2Spline_playa[22] = new pc.Vec3(-.5238984, .3027685, -13.14619), pista2Spline_playa[23] = new pc.Vec3(-.6979918, .3068083, -13.7203), pista2Spline_playa[24] = new pc.Vec3(-.8988136, .3067167, -14.28565), pista2Spline_playa[25] = new pc.Vec3(-1.122218, .3028653, -14.8425), pista2Spline_playa[26] = new pc.Vec3(-1.37203, .2964216, -15.38787), pista2Spline_playa[27] = new pc.Vec3(-1.651533, .2885344, -15.91862), pista2Spline_playa[28] = new pc.Vec3(-1.963901, .2803655, -16.43072), pista2Spline_playa[29] = new pc.Vec3(-2.313873, .272428, -16.91781), pista2Spline_playa[30] = new pc.Vec3(-2.701957, .263828, -17.37495), pista2Spline_playa[31] = new pc.Vec3(-3.118118, .254195, -17.80693), pista2Spline_playa[32] = new pc.Vec3(-3.555132, .2444201, -18.21795), pista2Spline_playa[33] = new pc.Vec3(-4.005014, .2349834, -18.61482), pista2Spline_playa[34] = new pc.Vec3(-4.461578, .2264757, -19.00392), pista2Spline_playa[35] = new pc.Vec3(-4.921493, .2191257, -19.38921), pista2Spline_playa[36] = new pc.Vec3(-5.388467, .2124386, -19.76593), pista2Spline_playa[37] = new pc.Vec3(-5.865211, .2063546, -20.13014), pista2Spline_playa[38] = new pc.Vec3(-6.353537, .2009554, -20.47863), pista2Spline_playa[39] = new pc.Vec3(-6.854813, .1962857, -20.80827), pista2Spline_playa[40] = new pc.Vec3(-7.369796, .1923699, -21.11602), pista2Spline_playa[41] = new pc.Vec3(-7.898098, .1893282, -21.40035), pista2Spline_playa[42] = new pc.Vec3(-8.437402, .1871185, -21.66326), pista2Spline_playa[43] = new pc.Vec3(-8.985229, .1855631, -21.90792), pista2Spline_playa[44] = new pc.Vec3(-9.53968, .1844902, -22.13712), pista2Spline_playa[45] = new pc.Vec3(-10.09925, .183754, -22.35359), pista2Spline_playa[46] = new pc.Vec3(-10.66276, .1832085, -22.55965), pista2Spline_playa[47] = new pc.Vec3(-11.23179, .1830378, -22.74982), pista2Spline_playa[48] = new pc.Vec3(-11.80683, .1833954, -22.9211), pista2Spline_playa[49] = new pc.Vec3(-12.38561, .1840858, -23.07917), pista2Spline_playa[50] = new pc.Vec3(-12.96635, .1849251, -23.22991), pista2Spline_playa[51] = new pc.Vec3(-13.54753, .1857271, -23.37903), pista2Spline_playa[52] = new pc.Vec3(-14.12746, .1862965, -23.53291), pista2Spline_playa[53] = new pc.Vec3(-14.70833, .1866131, -23.68314), pista2Spline_playa[54] = new pc.Vec3(-15.29261, .1868315, -23.81956), pista2Spline_playa[55] = new pc.Vec3(-15.87765, .1869822, -23.95269), pista2Spline_playa[56] = new pc.Vec3(-16.46049, .1870861, -24.09515), pista2Spline_playa[57] = new pc.Vec3(-17.03737, .1871529, -24.2598), pista2Spline_playa[58] = new pc.Vec3(-17.60295, .1872101, -24.45976), pista2Spline_playa[59] = new pc.Vec3(-18.15686, .1872368, -24.69037), pista2Spline_playa[60] = new pc.Vec3(-18.70285, .1872139, -24.93905), pista2Spline_playa[61] = new pc.Vec3(-19.23881, .1871605, -25.20869), pista2Spline_playa[62] = new pc.Vec3(-19.76151, .1870956, -25.50313), pista2Spline_playa[63] = new pc.Vec3(-20.26691, .1870403, -25.82637), pista2Spline_playa[64] = new pc.Vec3(-20.74978, .1870117, -26.18226), pista2Spline_playa[65] = new pc.Vec3(-21.20761, .1870174, -26.5699), pista2Spline_playa[66] = new pc.Vec3(-21.64255, .1870384, -26.98309), pista2Spline_playa[67] = new pc.Vec3(-22.05442, .187067, -27.41926), pista2Spline_playa[68] = new pc.Vec3(-22.44216, .1871033, -27.87707), pista2Spline_playa[69] = new pc.Vec3(-22.80364, .1871433, -28.35589), pista2Spline_playa[70] = new pc.Vec3(-23.13566, .1871853, -28.85555), pista2Spline_playa[71] = new pc.Vec3(-23.4326, .1872272, -29.37675), pista2Spline_playa[72] = new pc.Vec3(-23.69349, .1872749, -29.91692), pista2Spline_playa[73] = new pc.Vec3(-23.92074, .1873283, -30.47211), pista2Spline_playa[74] = new pc.Vec3(-24.11648, .1873817, -31.03929), pista2Spline_playa[75] = new pc.Vec3(-24.28241, .1874352, -31.61579), pista2Spline_playa[76] = new pc.Vec3(-24.41951, .1874847, -32.19987), pista2Spline_playa[77] = new pc.Vec3(-24.52279, .1875381, -32.79081), pista2Spline_playa[78] = new pc.Vec3(-24.58954, .1875973, -33.387), pista2Spline_playa[79] = new pc.Vec3(-24.62326, .1876583, -33.98598), pista2Spline_playa[80] = new pc.Vec3(-24.62764, .1877041, -34.5859), pista2Spline_playa[81] = new pc.Vec3(-24.60624, .1877308, -35.1855), pista2Spline_playa[82] = new pc.Vec3(-24.56224, .1877365, -35.78382), pista2Spline_playa[83] = new pc.Vec3(-24.49511, .1877384, -36.38001), pista2Spline_playa[84] = new pc.Vec3(-24.40442, .1877365, -36.97309), pista2Spline_playa[85] = new pc.Vec3(-24.29071, .1877098, -37.56219), pista2Spline_playa[86] = new pc.Vec3(-24.15342, .1876526, -38.1462), pista2Spline_playa[87] = new pc.Vec3(-23.99093, .187542, -38.7237), pista2Spline_playa[88] = new pc.Vec3(-23.8017, .1873569, -39.29302), pista2Spline_playa[89] = new pc.Vec3(-23.58813, .1870556, -39.8537), pista2Spline_playa[90] = new pc.Vec3(-23.35089, .1866703, -40.4047), pista2Spline_playa[91] = new pc.Vec3(-23.08748, .1862583, -40.94379), pista2Spline_playa[92] = new pc.Vec3(-22.79526, .1858768, -41.4677), pista2Spline_playa[93] = new pc.Vec3(-22.47132, .1855907, -41.97256), pista2Spline_playa[94] = new pc.Vec3(-22.11423, .1853886, -42.45464), pista2Spline_playa[95] = new pc.Vec3(-21.72807, .1851311, -42.91376), pista2Spline_playa[96] = new pc.Vec3(-21.31504, .1848984, -43.34882), pista2Spline_playa[97] = new pc.Vec3(-20.8762, .1848164, -43.75788), pista2Spline_playa[98] = new pc.Vec3(-20.41248, .1850185, -44.13842), pista2Spline_playa[99] = new pc.Vec3(-19.92472, .1856518, -44.48762), pista2Spline_playa[100] = new pc.Vec3(-19.41374, .1865883, -44.80196), pista2Spline_playa[101] = new pc.Vec3(-18.88304, .1876354, -45.08161), pista2Spline_playa[102] = new pc.Vec3(-18.33695, .1889534, -45.33004), pista2Spline_playa[103] = new pc.Vec3(-17.77854, .1906948, -45.54926), pista2Spline_playa[104] = new pc.Vec3(-17.21003, .1930389, -45.74092), pista2Spline_playa[105] = new pc.Vec3(-16.6331, .1961746, -45.90549), pista2Spline_playa[106] = new pc.Vec3(-16.04862, .2002792, -46.0407), pista2Spline_playa[107] = new pc.Vec3(-15.45792, .2052183, -46.14547), pista2Spline_playa[108] = new pc.Vec3(-14.8628, .2107277, -46.22127), pista2Spline_playa[109] = new pc.Vec3(-14.26479, .2165642, -46.269), pista2Spline_playa[110] = new pc.Vec3(-13.66522, .2225103, -46.28937), pista2Spline_playa[111] = new pc.Vec3(-13.06534, .2283211, -46.28243), pista2Spline_playa[112] = new pc.Vec3(-12.46678, .2341537, -46.24265), pista2Spline_playa[113] = new pc.Vec3(-11.87124, .2402134, -46.17024), pista2Spline_playa[114] = new pc.Vec3(-11.27936, .2463284, -46.07231), pista2Spline_playa[115] = new pc.Vec3(-10.69111, .2523346, -45.9544), pista2Spline_playa[116] = new pc.Vec3(-10.10607, .2580872, -45.82141), pista2Spline_playa[117] = new pc.Vec3(-9.523556, .2634106, -45.67781), pista2Spline_playa[118] = new pc.Vec3(-8.945653, .2678537, -45.5167), pista2Spline_playa[119] = new pc.Vec3(-8.375029, .2714329, -45.33141), pista2Spline_playa[120] = new pc.Vec3(-7.810425, .2746964, -45.1284), pista2Spline_playa[121] = new pc.Vec3(-7.249547, .2782288, -44.91539), pista2Spline_playa[122] = new pc.Vec3(-6.689486, .2826557, -44.70013), pista2Spline_playa[123] = new pc.Vec3(-6.129389, .2889919, -44.48519), pista2Spline_playa[124] = new pc.Vec3(-5.57176, .2972865, -44.26385), pista2Spline_playa[125] = new pc.Vec3(-5.014111, .3051805, -44.04253), pista2Spline_playa[126] = new pc.Vec3(-4.456474, .3130474, -43.82123), pista2Spline_playa[127] = new pc.Vec3(-3.898658, .3211656, -43.6004), pista2Spline_playa[128] = new pc.Vec3(-3.340443, .329812, -43.38052), pista2Spline_playa[129] = new pc.Vec3(-2.778578, .3435247, -43.17062), pista2Spline_playa[130] = new pc.Vec3(-2.219941, .3608649, -42.95243), pista2Spline_playa[131] = new pc.Vec3(-1.659441, .3801407, -42.73918), pista2Spline_playa[132] = new pc.Vec3(-1.090811, .4000146, -42.54901), pista2Spline_playa[133] = new pc.Vec3(-.5095611, .4193919, -42.40239), pista2Spline_playa[134] = new pc.Vec3(.08463155, .4367601, -42.32376), pista2Spline_playa[135] = new pc.Vec3(.6841219, .4515822, -42.31065), pista2Spline_playa[136] = new pc.Vec3(1.282912, .4650335, -42.34381), pista2Spline_playa[137] = new pc.Vec3(1.877353, .4774367, -42.42316), pista2Spline_playa[138] = new pc.Vec3(2.463396, .4889246, -42.55043), pista2Spline_playa[139] = new pc.Vec3(3.035897, .4996507, -42.72903), pista2Spline_playa[140] = new pc.Vec3(3.58772, .5096228, -42.96359), pista2Spline_playa[141] = new pc.Vec3(4.110392, .5176461, -43.25727), pista2Spline_playa[142] = new pc.Vec3(4.610921, .5243542, -43.58759), pista2Spline_playa[143] = new pc.Vec3(5.084353, .5302243, -43.9559), pista2Spline_playa[144] = new pc.Vec3(5.532558, .5359926, -44.35463), pista2Spline_playa[145] = new pc.Vec3(5.954648, .5423656, -44.78084), pista2Spline_playa[146] = new pc.Vec3(6.346772, .5501995, -45.23466), pista2Spline_playa[147] = new pc.Vec3(6.694955, .5596991, -45.72289), pista2Spline_playa[148] = new pc.Vec3(6.99579, .5700336, -46.24178), pista2Spline_playa[149] = new pc.Vec3(7.258992, .5806947, -46.78069), pista2Spline_playa[150] = new pc.Vec3(7.494477, .5913162, -47.33248), pista2Spline_playa[151] = new pc.Vec3(7.71242, .6013403, -47.8913), pista2Spline_playa[152] = new pc.Vec3(7.91971, .6105528, -48.45427), pista2Spline_playa[153] = new pc.Vec3(8.101727, .6196585, -49.02583), pista2Spline_playa[154] = new pc.Vec3(8.253524, .6284986, -49.60622), pista2Spline_playa[155] = new pc.Vec3(8.386251, .6365809, -50.19124), pista2Spline_playa[156] = new pc.Vec3(8.51003, .6434441, -50.77833), pista2Spline_playa[157] = new pc.Vec3(8.636789, .6486592, -51.36473), pista2Spline_playa[158] = new pc.Vec3(8.760899, .6521335, -51.95167), pista2Spline_playa[159] = new pc.Vec3(8.866796, .6541796, -52.54232), pista2Spline_playa[160] = new pc.Vec3(8.964971, .6550417, -53.13422), pista2Spline_playa[161] = new pc.Vec3(9.069258, .6549072, -53.72503), pista2Spline_playa[162] = new pc.Vec3(9.192341, .6539059, -54.3123), pista2Spline_playa[163] = new pc.Vec3(9.348775, .6521711, -54.89133), pista2Spline_playa[164] = new pc.Vec3(9.545373, .6496258, -55.45803), pista2Spline_playa[165] = new pc.Vec3(9.771826, .6460676, -56.01363), pista2Spline_playa[166] = new pc.Vec3(10.02152, .6416388, -56.55923), pista2Spline_playa[167] = new pc.Vec3(10.29131, .6364756, -57.09503), pista2Spline_playa[168] = new pc.Vec3(10.57746, .6306801, -57.6224), pista2Spline_playa[169] = new pc.Vec3(10.89083, .6248856, -58.13376), pista2Spline_playa[170] = new pc.Vec3(11.24256, .6175146, -58.61966), pista2Spline_playa[171] = new pc.Vec3(11.60032, .6095219, -59.10136), pista2Spline_playa[172] = new pc.Vec3(11.95949, .601428, -59.58185), pista2Spline_playa[173] = new pc.Vec3(12.31899, .5931997, -60.06215), pista2Spline_playa[174] = new pc.Vec3(12.67775, .5848055, -60.54302), pista2Spline_playa[175] = new pc.Vec3(13.0347, .5762119, -61.02516), pista2Spline_playa[176] = new pc.Vec3(13.37282, .5645294, -61.52056), pista2Spline_playa[177] = new pc.Vec3(13.68773, .5517063, -62.03114), pista2Spline_playa[178] = new pc.Vec3(13.99063, .5377226, -62.54887), pista2Spline_playa[179] = new pc.Vec3(14.27361, .5228586, -63.07766), pista2Spline_playa[180] = new pc.Vec3(14.52731, .5070887, -63.62103), pista2Spline_playa[181] = new pc.Vec3(14.7385, .4904003, -64.18217), pista2Spline_playa[182] = new pc.Vec3(14.90032, .4724178, -64.75949), pista2Spline_playa[183] = new pc.Vec3(15.0198, .4525957, -65.347), pista2Spline_playa[184] = new pc.Vec3(15.09744, .431921, -65.94148), pista2Spline_playa[185] = new pc.Vec3(15.1344, .4115734, -66.53981), pista2Spline_playa[186] = new pc.Vec3(15.13188, .392601, -67.13946), pista2Spline_playa[187] = new pc.Vec3(15.09122, .3761339, -67.73774), pista2Spline_playa[188] = new pc.Vec3(15.00475, .3618622, -68.33111), pista2Spline_playa[189] = new pc.Vec3(14.87519, .3491306, -68.91668), pista2Spline_playa[190] = new pc.Vec3(14.71542, .3377781, -69.49493), pista2Spline_playa[191] = new pc.Vec3(14.53463, .3275995, -70.06693), pista2Spline_playa[192] = new pc.Vec3(14.34257, .3186646, -70.63531), pista2Spline_playa[193] = new pc.Vec3(14.11337, .3105097, -71.18953), pista2Spline_playa[194] = new pc.Vec3(13.87205, .3067999, -71.7388), pista2Spline_playa[195] = new pc.Vec3(13.62973, .3035269, -72.2877), pista2Spline_playa[196] = new pc.Vec3(13.38727, .3004704, -72.83648), pista2Spline_playa[197] = new pc.Vec3(13.14578, .2975464, -73.3858), pista2Spline_playa[198] = new pc.Vec3(12.90638, .2946653, -73.93597), pista2Spline_playa[199] = new pc.Vec3(12.6748, .2919369, -74.48929), pista2Spline_playa[200] = new pc.Vec3(12.4918, .2900248, -75.06062), pista2Spline_playa[201] = new pc.Vec3(12.33565, .2879343, -75.63998), pista2Spline_playa[202] = new pc.Vec3(12.19573, .286335, -76.22333), pista2Spline_playa[203] = new pc.Vec3(12.07398, .2856007, -76.81086), pista2Spline_playa[204] = new pc.Vec3(11.97253, .2861776, -77.40215), pista2Spline_playa[205] = new pc.Vec3(11.89387, .2886906, -77.99697), pista2Spline_playa[206] = new pc.Vec3(11.83368, .294055, -78.59393), pista2Spline_playa[207] = new pc.Vec3(11.79207, .3018637, -79.19238), pista2Spline_playa[208] = new pc.Vec3(11.77767, .3109074, -79.79207), pista2Spline_playa[209] = new pc.Vec3(11.79888, .3198919, -80.39156), pista2Spline_playa[210] = new pc.Vec3(11.86323, .3274736, -80.98787), pista2Spline_playa[211] = new pc.Vec3(11.97346, .3329926, -81.57748), pista2Spline_playa[212] = new pc.Vec3(12.12043, .3377266, -82.15913), pista2Spline_playa[213] = new pc.Vec3(12.29998, .3418341, -82.73151), pista2Spline_playa[214] = new pc.Vec3(12.5133, .3449125, -83.29219), pista2Spline_playa[215] = new pc.Vec3(12.76263, .3465548, -83.83775), pista2Spline_playa[216] = new pc.Vec3(13.05151, .3462543, -84.36349), pista2Spline_playa[217] = new pc.Vec3(13.38992, .3433466, -84.85859), pista2Spline_playa[218] = new pc.Vec3(13.78132, .3377352, -85.31291), pista2Spline_playa[219] = new pc.Vec3(14.20933, .3301649, -85.73318), pista2Spline_playa[220] = new pc.Vec3(14.65882, .3214254, -86.13045), pista2Spline_playa[221] = new pc.Vec3(15.11758, .312089, -86.51701), pista2Spline_playa[222] = new pc.Vec3(15.57246, .3030272, -86.9082), pista2Spline_playa[223] = new pc.Vec3(16.03701, .2934237, -87.2878), pista2Spline_playa[224] = new pc.Vec3(16.50405, .2836781, -87.66432), pista2Spline_playa[225] = new pc.Vec3(16.97172, .2738934, -88.04008), pista2Spline_playa[226] = new pc.Vec3(17.43952, .2640858, -88.41566), pista2Spline_playa[227] = new pc.Vec3(17.90693, .254261, -88.79171), pista2Spline_playa[228] = new pc.Vec3(18.37341, .2444286, -89.16894), pista2Spline_playa[229] = new pc.Vec3(18.83102, .2343388, -89.5568), pista2Spline_playa[230] = new pc.Vec3(19.28977, .2243824, -89.94337), pista2Spline_playa[231] = new pc.Vec3(19.74345, .2142448, -90.33593), pista2Spline_playa[232] = new pc.Vec3(20.18589, .2039204, -90.74104), pista2Spline_playa[233] = new pc.Vec3(20.61055, .1932659, -91.16467), pista2Spline_playa[234] = new pc.Vec3(21.01409, .182312, -91.60851), pista2Spline_playa[235] = new pc.Vec3(21.40837, .1711464, -92.06062), pista2Spline_playa[236] = new pc.Vec3(21.79237, .159687, -92.52154), pista2Spline_playa[237] = new pc.Vec3(22.15574, .1480904, -92.99875), pista2Spline_playa[238] = new pc.Vec3(22.48691, .1364098, -93.49875), pista2Spline_playa[239] = new pc.Vec3(22.77058, .1248646, -94.02692), pista2Spline_playa[240] = new pc.Vec3(22.98628, .1132793, -94.58622), pista2Spline_playa[241] = new pc.Vec3(23.12901, .101368, -95.16853), pista2Spline_playa[242] = new pc.Vec3(23.2171, .08971786, -95.7617), pista2Spline_playa[243] = new pc.Vec3(23.27005, .07883835, -96.35927), pista2Spline_playa[244] = new pc.Vec3(23.30602, .06925583, -96.95811), pista2Spline_playa[245] = new pc.Vec3(23.34329, .0615387, -97.55682), pista2Spline_playa[246] = new pc.Vec3(23.38165, .05618286, -98.15559), pista2Spline_playa[247] = new pc.Vec3(23.40346, .05307198, -98.75519), pista2Spline_playa[248] = new pc.Vec3(23.41184, .04794121, -99.35503), pista2Spline_playa[249] = new pc.Vec3(23.41249, .02941513, -99.95479), pista2Spline_playa[250] = new pc.Vec3(23.41095, .01256943, -100.5545), pista2Spline_playa[251] = new pc.Vec3(23.41267, .0007324219, -101.1543), pista2Spline_playa[252] = new pc.Vec3(23.41298, -.0005340576, -101.7544), pista2Spline_playa[253] = new pc.Vec3(23.41314, -.0009231567, -102.3544), pista2Spline_playa[254] = new pc.Vec3(23.41322, -.0009250641, -102.9544), pista2Spline_playa[255] = new pc.Vec3(23.41328, -749588e-9, -103.5544), pista2Spline_playa[256] = new pc.Vec3(23.41335, -579834e-9, -104.1544), pista2Spline_playa[257] = new pc.Vec3(23.41335, -579834e-9, -104.6214);
var pista2Spline_playa_angulos = [];
pista2Spline_playa_angulos[0] = new pc.Vec3(0, 0, 0), pista2Spline_playa_angulos[1] = new pc.Vec3(270.2502, 179.8843, 89.99902), pista2Spline_playa_angulos[2] = new pc.Vec3(270.2921, 179.9023, 89.99967), pista2Spline_playa_angulos[3] = new pc.Vec3(270.2149, 179.8909, 90), pista2Spline_playa_angulos[4] = new pc.Vec3(270, 269.836, 0), pista2Spline_playa_angulos[5] = new pc.Vec3(270.3632, 359.7708, 269.9997), pista2Spline_playa_angulos[6] = new pc.Vec3(271.1071, 359.6084, 270.0005), pista2Spline_playa_angulos[7] = new pc.Vec3(271.751, 359.478, 269.9998), pista2Spline_playa_angulos[8] = new pc.Vec3(272.1771, 359.397, 270.0002), pista2Spline_playa_angulos[9] = new pc.Vec3(272.4023, 359.3634, 269.9998), pista2Spline_playa_angulos[10] = new pc.Vec3(272.4272, 359.3754, 270.0001), pista2Spline_playa_angulos[11] = new pc.Vec3(272.2513, 359.4342, 270.0001), pista2Spline_playa_angulos[12] = new pc.Vec3(271.7263, .03253559, 270), pista2Spline_playa_angulos[13] = new pc.Vec3(272.181, 359.4788, 269.9997), pista2Spline_playa_angulos[14] = new pc.Vec3(272.3578, 359.89, 269.9999), pista2Spline_playa_angulos[15] = new pc.Vec3(272.3289, 1.062812, 269.9999), pista2Spline_playa_angulos[16] = new pc.Vec3(272.0777, 3.008458, 270.0001), pista2Spline_playa_angulos[17] = new pc.Vec3(271.662, 5.548365, 270), pista2Spline_playa_angulos[18] = new pc.Vec3(271.4153, 7.06983, 269.9999), pista2Spline_playa_angulos[19] = new pc.Vec3(271.2502, 8.426694, 269.9999), pista2Spline_playa_angulos[20] = new pc.Vec3(271.0616, 10.19454, 269.9998), pista2Spline_playa_angulos[21] = new pc.Vec3(270.8261, 12.47515, 270.0001), pista2Spline_playa_angulos[22] = new pc.Vec3(270.5482, 15.28145, 270), pista2Spline_playa_angulos[23] = new pc.Vec3(270.1938, 18.31485, 269.9985), pista2Spline_playa_angulos[24] = new pc.Vec3(270.2094, 200.6231, 90.00047), pista2Spline_playa_angulos[25] = new pc.Vec3(270.5098, 203.1665, 90.0002), pista2Spline_playa_angulos[26] = new pc.Vec3(270.7003, 206.1333, 90.00042), pista2Spline_playa_angulos[27] = new pc.Vec3(270.7833, 209.5161, 90), pista2Spline_playa_angulos[28] = new pc.Vec3(270.7486, 213.3379, 90.00039), pista2Spline_playa_angulos[29] = new pc.Vec3(270.7803, 218.0668, 89.99975), pista2Spline_playa_angulos[30] = new pc.Vec3(270.865, 221.7419, 90.00034), pista2Spline_playa_angulos[31] = new pc.Vec3(270.9357, 225.481, 89.99958), pista2Spline_playa_angulos[32] = new pc.Vec3(270.9247, 227.7912, 90.00011), pista2Spline_playa_angulos[33] = new pc.Vec3(270.8671, 229.2258, 90), pista2Spline_playa_angulos[34] = new pc.Vec3(270.7535, 229.8047, 89.99948), pista2Spline_playa_angulos[35] = new pc.Vec3(270.6614, 230.4538, 90.00014), pista2Spline_playa_angulos[36] = new pc.Vec3(270.611, 231.8129, 89.99968), pista2Spline_playa_angulos[37] = new pc.Vec3(270.5493, 233.4958, 89.99982), pista2Spline_playa_angulos[38] = new pc.Vec3(270.4805, 235.5369, 89.9998), pista2Spline_playa_angulos[39] = new pc.Vec3(270.4097, 237.8607, 90), pista2Spline_playa_angulos[40] = new pc.Vec3(270.3322, 240.4447, 90.00089), pista2Spline_playa_angulos[41] = new pc.Vec3(270.2487, 242.9149, 90.00039), pista2Spline_playa_angulos[42] = new pc.Vec3(270.1736, 245.0308, 90.00056), pista2Spline_playa_angulos[43] = new pc.Vec3(270.1219, 246.7862, 89.99921), pista2Spline_playa_angulos[44] = new pc.Vec3(270.0816, 338.1563, 0), pista2Spline_playa_angulos[45] = new pc.Vec3(270.0523, 339.3492, 0), pista2Spline_playa_angulos[46] = new pc.Vec3(270.028, 340.603, 0), pista2Spline_playa_angulos[47] = new pc.Vec3(270, 342.5468, 0), pista2Spline_playa_angulos[48] = new pc.Vec3(270.056, 344.2234, 0), pista2Spline_playa_angulos[49] = new pc.Vec3(270.0713, 345.2538, 0), pista2Spline_playa_angulos[50] = new pc.Vec3(270.0839, 345.7166, 0), pista2Spline_playa_angulos[51] = new pc.Vec3(270.0713, 345.581, 0), pista2Spline_playa_angulos[52] = new pc.Vec3(270.0396, 345.1425, 0), pista2Spline_playa_angulos[53] = new pc.Vec3(270, 346.1969, 0), pista2Spline_playa_angulos[54] = new pc.Vec3(270, 347.2054, 0), pista2Spline_playa_angulos[55] = new pc.Vec3(270, 346.9491, 0), pista2Spline_playa_angulos[56] = new pc.Vec3(270, 345.4082, 0), pista2Spline_playa_angulos[57] = new pc.Vec3(270, 342.5237, 0), pista2Spline_playa_angulos[58] = new pc.Vec3(270, 338.8105, 0), pista2Spline_playa_angulos[59] = new pc.Vec3(270, 336.4323, 0), pista2Spline_playa_angulos[60] = new pc.Vec3(270, 334.4688, 0), pista2Spline_playa_angulos[61] = new pc.Vec3(270, 332.0261, 0), pista2Spline_playa_angulos[62] = new pc.Vec3(270, 329.0941, 0), pista2Spline_playa_angulos[63] = new pc.Vec3(270, 325.5964, 0), pista2Spline_playa_angulos[64] = new pc.Vec3(270, 321.6304, 0), pista2Spline_playa_angulos[65] = new pc.Vec3(270, 318.0585, 0), pista2Spline_playa_angulos[66] = new pc.Vec3(270, 314.9018, 0), pista2Spline_playa_angulos[67] = new pc.Vec3(270, 311.8156, 0), pista2Spline_playa_angulos[68] = new pc.Vec3(270, 308.6954, 0), pista2Spline_playa_angulos[69] = new pc.Vec3(270, 305.3788, 0), pista2Spline_playa_angulos[70] = new pc.Vec3(270, 301.7056, 0), pista2Spline_playa_angulos[71] = new pc.Vec3(270, 297.6755, 0), pista2Spline_playa_angulos[72] = new pc.Vec3(270, 293.9734, 0), pista2Spline_playa_angulos[73] = new pc.Vec3(270, 290.6122, 0), pista2Spline_playa_angulos[74] = new pc.Vec3(270, 287.5204, 0), pista2Spline_playa_angulos[75] = new pc.Vec3(270, 284.6303, 0), pista2Spline_playa_angulos[76] = new pc.Vec3(270, 281.6397, 0), pista2Spline_playa_angulos[77] = new pc.Vec3(270, 278.1021, 0), pista2Spline_playa_angulos[78] = new pc.Vec3(270, 274.7522, 0), pista2Spline_playa_angulos[79] = new pc.Vec3(270, 271.7683, 0), pista2Spline_playa_angulos[80] = new pc.Vec3(270, 269.1442, 0), pista2Spline_playa_angulos[81] = new pc.Vec3(270, 266.8734, 0), pista2Spline_playa_angulos[82] = new pc.Vec3(270, 264.7242, 0), pista2Spline_playa_angulos[83] = new pc.Vec3(270, 262.4279, 0), pista2Spline_playa_angulos[84] = new pc.Vec3(270, 260.1908, 0), pista2Spline_playa_angulos[85] = new pc.Vec3(270, 257.9279, 0), pista2Spline_playa_angulos[86] = new pc.Vec3(270, 255.5506, 0), pista2Spline_playa_angulos[87] = new pc.Vec3(270, 252.9293, 0), pista2Spline_playa_angulos[88] = new pc.Vec3(270.028, 250.2969, 0), pista2Spline_playa_angulos[89] = new pc.Vec3(270, 247.9475, 0), pista2Spline_playa_angulos[90] = new pc.Vec3(270.028, 245.3328, 0), pista2Spline_playa_angulos[91] = new pc.Vec3(270.028, 242.4128, 0), pista2Spline_playa_angulos[92] = new pc.Vec3(270.0198, 239.1259, 0), pista2Spline_playa_angulos[93] = new pc.Vec3(270, 235.3517, 0), pista2Spline_playa_angulos[94] = new pc.Vec3(270, 231.6043, 0), pista2Spline_playa_angulos[95] = new pc.Vec3(270.028, 228.1972, 0), pista2Spline_playa_angulos[96] = new pc.Vec3(270, 224.7324, 0), pista2Spline_playa_angulos[97] = new pc.Vec3(270, 221.2079, 0), pista2Spline_playa_angulos[98] = new pc.Vec3(270.0198, 217.5641, 0), pista2Spline_playa_angulos[99] = new pc.Vec3(270.0791, 213.6921, 0), pista2Spline_playa_angulos[100] = new pc.Vec3(270.0928, 209.7149, 0), pista2Spline_playa_angulos[101] = new pc.Vec3(270.1083, 206.1815, 0), pista2Spline_playa_angulos[102] = new pc.Vec3(270.1426, 292.9056, 269.9969), pista2Spline_playa_angulos[103] = new pc.Vec3(270.1908, 290.0032, 269.9968), pista2Spline_playa_angulos[104] = new pc.Vec3(270.2587, 287.2664, 270.0017), pista2Spline_playa_angulos[105] = new pc.Vec3(270.3444, 284.5003, 270.0005), pista2Spline_playa_angulos[106] = new pc.Vec3(270.4357, 281.5186, 270), pista2Spline_playa_angulos[107] = new pc.Vec3(270.502, 278.6353, 270.001), pista2Spline_playa_angulos[108] = new pc.Vec3(270.5457, 275.8946, 270.001), pista2Spline_playa_angulos[109] = new pc.Vec3(270.5651, 273.249, 269.9989), pista2Spline_playa_angulos[110] = new pc.Vec3(270.5641, 270.6531, 269.9996), pista2Spline_playa_angulos[111] = new pc.Vec3(270.5521, 267.8153, 269.9991), pista2Spline_playa_angulos[112] = new pc.Vec3(270.5692, 264.5328, 269.9994), pista2Spline_playa_angulos[113] = new pc.Vec3(270.5835, 261.7372, 269.9996), pista2Spline_playa_angulos[114] = new pc.Vec3(270.5815, 259.5449, 270.0003), pista2Spline_playa_angulos[115] = new pc.Vec3(270.5634, 257.8499, 269.9998), pista2Spline_playa_angulos[116] = new pc.Vec3(270.5316, 256.6102, 269.9997), pista2Spline_playa_angulos[117] = new pc.Vec3(270.4711, 255.4277, 270.0011), pista2Spline_playa_angulos[118] = new pc.Vec3(270.3753, 253.1535, 269.9997), pista2Spline_playa_angulos[119] = new pc.Vec3(270.3165, 250.9965, 269.9979), pista2Spline_playa_angulos[120] = new pc.Vec3(270.314, 249.584, 270), pista2Spline_playa_angulos[121] = new pc.Vec3(270.3733, 248.9718, 269.9985), pista2Spline_playa_angulos[122] = new pc.Vec3(270.4648, 249.2849, 270.0012), pista2Spline_playa_angulos[123] = new pc.Vec3(270.7853, 248.3907, 269.9998), pista2Spline_playa_angulos[124] = new pc.Vec3(270.7636, 248.3792, 269.9994), pista2Spline_playa_angulos[125] = new pc.Vec3(270.7484, 248.3476, 270), pista2Spline_playa_angulos[126] = new pc.Vec3(270.759, 248.3657, 270.0006), pista2Spline_playa_angulos[127] = new pc.Vec3(270.7957, 248.4443, 270.001), pista2Spline_playa_angulos[128] = new pc.Vec3(270.87, 248.6032, 270.0009), pista2Spline_playa_angulos[129] = new pc.Vec3(271.575, 249.3195, 270.0006), pista2Spline_playa_angulos[130] = new pc.Vec3(271.7685, 248.6623, 270.0001), pista2Spline_playa_angulos[131] = new pc.Vec3(271.8871, 250.0195, 269.9999), pista2Spline_playa_angulos[132] = new pc.Vec3(271.8934, 253.3027, 270.0003), pista2Spline_playa_angulos[133] = new pc.Vec3(271.7785, 258.8271, 270.0005), pista2Spline_playa_angulos[134] = new pc.Vec3(271.5269, 265.8859, 270), pista2Spline_playa_angulos[135] = new pc.Vec3(271.3429, 270.9594, 270), pista2Spline_playa_angulos[136] = new pc.Vec3(271.2329, 275.3599, 270.0009), pista2Spline_playa_angulos[137] = new pc.Vec3(271.138, 279.8808, 269.9996), pista2Spline_playa_angulos[138] = new pc.Vec3(271.0587, 284.7148, 270.0007), pista2Spline_playa_angulos[139] = new pc.Vec3(270.9968, 290.0461, 270.0005), pista2Spline_playa_angulos[140] = new pc.Vec3(270.8818, 296.2725, 270.0006), pista2Spline_playa_angulos[141] = new pc.Vec3(270.6555, 301.783, 269.9994), pista2Spline_playa_angulos[142] = new pc.Vec3(270.5908, 305.8354, 269.9985), pista2Spline_playa_angulos[143] = new pc.Vec3(270.541, 309.843, 269.9987), pista2Spline_playa_angulos[144] = new pc.Vec3(270.571, 313.4577, 270.0012), pista2Spline_playa_angulos[145] = new pc.Vec3(270.6682, 317.1061, 270), pista2Spline_playa_angulos[146] = new pc.Vec3(270.837, 321.6993, 270.0005), pista2Spline_playa_angulos[147] = new pc.Vec3(270.9555, 327.4336, 269.9999), pista2Spline_playa_angulos[148] = new pc.Vec3(271.0107, 332.1608, 270.0004), pista2Spline_playa_angulos[149] = new pc.Vec3(271.0201, 335.5959, 270.0006), pista2Spline_playa_angulos[150] = new pc.Vec3(270.9933, 337.947, 270.0012), pista2Spline_playa_angulos[151] = new pc.Vec3(270.91, 339.1213, 269.9997), pista2Spline_playa_angulos[152] = new pc.Vec3(270.8684, 340.7353, 269.9994), pista2Spline_playa_angulos[153] = new pc.Vec3(270.8686, 344.0328, 269.9995), pista2Spline_playa_angulos[154] = new pc.Vec3(270.8132, 346.4349, 270.001), pista2Spline_playa_angulos[155] = new pc.Vec3(270.7201, 347.8126, 270.0005), pista2Spline_playa_angulos[156] = new pc.Vec3(270.5822, 348.1548, 270.0003), pista2Spline_playa_angulos[157] = new pc.Vec3(270.4121, 347.5611, 270.002), pista2Spline_playa_angulos[158] = new pc.Vec3(270.2572, 348.8046, 270.0027), pista2Spline_playa_angulos[159] = new pc.Vec3(270.1342, 350.3983, 269.9986), pista2Spline_playa_angulos[160] = new pc.Vec3(270, 260.4838, 0), pista2Spline_playa_angulos[161] = new pc.Vec3(270.0485, 259.2382, 0), pista2Spline_playa_angulos[162] = new pc.Vec3(270.1312, 166.8097, 89.99634), pista2Spline_playa_angulos[163] = new pc.Vec3(270.1988, 162.873, 89.99853), pista2Spline_playa_angulos[164] = new pc.Vec3(270.288, 159.118, 90.00118), pista2Spline_playa_angulos[165] = new pc.Vec3(270.3836, 156.5719, 89.99974), pista2Spline_playa_angulos[166] = new pc.Vec3(270.4597, 154.3077, 90.00117), pista2Spline_playa_angulos[167] = new pc.Vec3(270.5211, 152.3009, 89.99991), pista2Spline_playa_angulos[168] = new pc.Vec3(270.5915, 150.8522, 89.99992), pista2Spline_playa_angulos[169] = new pc.Vec3(270.5381, 145.923, 89.99805), pista2Spline_playa_angulos[170] = new pc.Vec3(270.759, 143.5217, 90.00093), pista2Spline_playa_angulos[171] = new pc.Vec3(270.7672, 143.2913, 90.00048), pista2Spline_playa_angulos[172] = new pc.Vec3(270.7783, 143.1868, 90.00076), pista2Spline_playa_angulos[173] = new pc.Vec3(270.7928, 143.2072, 89.99944), pista2Spline_playa_angulos[174] = new pc.Vec3(270.8106, 143.3625, 89.99991), pista2Spline_playa_angulos[175] = new pc.Vec3(270.8614, 143.804, 90.00008), pista2Spline_playa_angulos[176] = new pc.Vec3(271.2022, 147.2941, 89.99994), pista2Spline_playa_angulos[177] = new pc.Vec3(271.2842, 148.9002, 89.99991), pista2Spline_playa_angulos[178] = new pc.Vec3(271.378, 150.6077, 89.9994), pista2Spline_playa_angulos[179] = new pc.Vec3(271.4597, 153.2237, 90.00043), pista2Spline_playa_angulos[180] = new pc.Vec3(271.5533, 156.9019, 89.99994), pista2Spline_playa_angulos[181] = new pc.Vec3(271.6461, 161.8698, 90.0006), pista2Spline_playa_angulos[182] = new pc.Vec3(271.8069, 166.4971, 90.00033), pista2Spline_playa_angulos[183] = new pc.Vec3(271.9547, 170.5551, 90.00018), pista2Spline_playa_angulos[184] = new pc.Vec3(271.9692, 174.5214, 89.99993), pista2Spline_playa_angulos[185] = new pc.Vec3(271.8998, 178.3918, 89.99982), pista2Spline_playa_angulos[186] = new pc.Vec3(271.7015, 182.0607, 90), pista2Spline_playa_angulos[187] = new pc.Vec3(271.458, 186.043, 90), pista2Spline_playa_angulos[188] = new pc.Vec3(271.2885, 190.6014, 90), pista2Spline_playa_angulos[189] = new pc.Vec3(271.1447, 194.1343, 90.00008), pista2Spline_playa_angulos[190] = new pc.Vec3(271.0256, 196.6474, 90.0002), pista2Spline_playa_angulos[191] = new pc.Vec3(270.9164, 198.3527, 90.00021), pista2Spline_playa_angulos[192] = new pc.Vec3(270.797, 199.6597, 90), pista2Spline_playa_angulos[193] = new pc.Vec3(270.541, 203.8744, 90), pista2Spline_playa_angulos[194] = new pc.Vec3(270.3257, 203.7708, 90.0006), pista2Spline_playa_angulos[195] = new pc.Vec3(270.2987, 203.8454, 89.9987), pista2Spline_playa_angulos[196] = new pc.Vec3(270.2825, 203.8014, 89.99966), pista2Spline_playa_angulos[197] = new pc.Vec3(270.2755, 203.6426, 90.00071), pista2Spline_playa_angulos[198] = new pc.Vec3(270.2741, 203.3697, 89.99965), pista2Spline_playa_angulos[199] = new pc.Vec3(270.1824, 200.2119, 90), pista2Spline_playa_angulos[200] = new pc.Vec3(270.2131, 195.8925, 90.00046), pista2Spline_playa_angulos[201] = new pc.Vec3(270.1791, 194.3481, 90.00054), pista2Spline_playa_angulos[202] = new pc.Vec3(270.1154, 282.4887, 0), pista2Spline_playa_angulos[203] = new pc.Vec3(270, 280.7474, 0), pista2Spline_playa_angulos[204] = new pc.Vec3(270.1342, 8.61911, 270), pista2Spline_playa_angulos[205] = new pc.Vec3(270.3743, 6.580915, 269.9998), pista2Spline_playa_angulos[206] = new pc.Vec3(270.6525, 5.013588, 270), pista2Spline_playa_angulos[207] = new pc.Vec3(270.8214, 2.817405, 270.0002), pista2Spline_playa_angulos[208] = new pc.Vec3(270.8794, 359.7806, 270.0007), pista2Spline_playa_angulos[209] = new pc.Vec3(270.8106, 356.0031, 269.9993), pista2Spline_playa_angulos[210] = new pc.Vec3(270.6094, 351.5347, 270.0002), pista2Spline_playa_angulos[211] = new pc.Vec3(270.4622, 347.4257, 270.0002), pista2Spline_playa_angulos[212] = new pc.Vec3(270.4298, 344.2082, 270), pista2Spline_playa_angulos[213] = new pc.Vec3(270.3472, 340.9062, 270.0005), pista2Spline_playa_angulos[214] = new pc.Vec3(270.2307, 337.3637, 269.9979), pista2Spline_playa_angulos[215] = new pc.Vec3(270.0713, 243.4964, 0), pista2Spline_playa_angulos[216] = new pc.Vec3(270.1399, 148.8297, 90.00366), pista2Spline_playa_angulos[217] = new pc.Vec3(270.4121, 142.4265, 90.0006), pista2Spline_playa_angulos[218] = new pc.Vec3(270.641, 136.5867, 90.0008), pista2Spline_playa_angulos[219] = new pc.Vec3(270.7878, 132.7312, 89.99969), pista2Spline_playa_angulos[220] = new pc.Vec3(270.8691, 130.5272, 90.00034), pista2Spline_playa_angulos[221] = new pc.Vec3(270.9061, 129.9531, 89.99955), pista2Spline_playa_angulos[222] = new pc.Vec3(270.8641, 130.5297, 90.00044), pista2Spline_playa_angulos[223] = new pc.Vec3(270.9279, 128.9488, 90.00039), pista2Spline_playa_angulos[224] = new pc.Vec3(270.9321, 128.8158, 90.00089), pista2Spline_playa_angulos[225] = new pc.Vec3(270.9357, 128.7584, 90.0004), pista2Spline_playa_angulos[226] = new pc.Vec3(270.9373, 128.7805, 89.99921), pista2Spline_playa_angulos[227] = new pc.Vec3(270.938, 128.8757, 89.99965), pista2Spline_playa_angulos[228] = new pc.Vec3(270.9492, 129.4912, 89.99953), pista2Spline_playa_angulos[229] = new pc.Vec3(270.9485, 130.0397, 89.99927), pista2Spline_playa_angulos[230] = new pc.Vec3(270.9594, 130.3412, 90.00033), pista2Spline_playa_angulos[231] = new pc.Vec3(270.9764, 131.5451, 89.99967), pista2Spline_playa_angulos[232] = new pc.Vec3(270.9998, 133.5774, 90.00027), pista2Spline_playa_angulos[233] = new pc.Vec3(271.0363, 136.5598, 90.0009), pista2Spline_playa_angulos[234] = new pc.Vec3(271.052, 138.5906, 89.99995), pista2Spline_playa_angulos[235] = new pc.Vec3(271.0805, 139.3132, 90.00046), pista2Spline_playa_angulos[236] = new pc.Vec3(271.1034, 141.3021, 90.00005), pista2Spline_playa_angulos[237] = new pc.Vec3(271.1135, 144.4032, 90.00044), pista2Spline_playa_angulos[238] = new pc.Vec3(271.1103, 148.8605, 90.00013), pista2Spline_playa_angulos[239] = new pc.Vec3(271.0929, 155.0008, 90.00076), pista2Spline_playa_angulos[240] = new pc.Vec3(271.1219, 162.7763, 89.99935), pista2Spline_playa_angulos[241] = new pc.Vec3(271.134, 169.1971, 90.00052), pista2Spline_playa_angulos[242] = new pc.Vec3(271.0823, 173.5009, 89.99941), pista2Spline_playa_angulos[243] = new pc.Vec3(270.986, 176.0322, 90.00065), pista2Spline_playa_angulos[244] = new pc.Vec3(270.8356, 176.8457, 89.99935), pista2Spline_playa_angulos[245] = new pc.Vec3(270.6306, 176.1901, 89.99946), pista2Spline_playa_angulos[246] = new pc.Vec3(270.4016, 176.9666, 89.99976), pista2Spline_playa_angulos[247] = new pc.Vec3(270.0839, 268.549, 0), pista2Spline_playa_angulos[248] = new pc.Vec3(271.5811, 179.6417, 89.99991), pista2Spline_playa_angulos[249] = new pc.Vec3(271.6808, 180.1505, 89.99997), pista2Spline_playa_angulos[250] = new pc.Vec3(271.4523, 180.0757, 89.99983), pista2Spline_playa_angulos[251] = new pc.Vec3(270.4502, 179.8701, 90.00011), pista2Spline_playa_angulos[252] = new pc.Vec3(270.0685, 269.9141, 0), pista2Spline_playa_angulos[253] = new pc.Vec3(270, 269.9751, 0), pista2Spline_playa_angulos[254] = new pc.Vec3(270, 270.0046, 0), pista2Spline_playa_angulos[255] = new pc.Vec3(270, 270.014, 0), pista2Spline_playa_angulos[256] = new pc.Vec3(270, 270.0063, 0), pista2Spline_playa_angulos[257] = new pc.Vec3(270, 270.0063, 0);
var conexionPista3 = [],
    vientoPista3 = [];
vientoPista3[0] = 25, vientoPista3[1] = 124;
var pista3Spline_playa = [];
pista3Spline_playa[0] = new pc.Vec3(0, 0, 0), pista3Spline_playa[1] = new pc.Vec3(-.0001106262, .003456668, -.6000404), pista3Spline_playa[2] = new pc.Vec3(-.0004196167, .003682482, -1.200016), pista3Spline_playa[3] = new pc.Vec3(-.0007287264, .003889245, -1.800026), pista3Spline_playa[4] = new pc.Vec3(-.0009078979, .004146551, -2.400032), pista3Spline_playa[5] = new pc.Vec3(-.0008392334, .004527339, -3.000011), pista3Spline_playa[6] = new pc.Vec3(-.0003092289, .005135143, -3.600051), pista3Spline_playa[7] = new pc.Vec3(.0007781982, .00598703, -4.200007), pista3Spline_playa[8] = new pc.Vec3(.0009231567, .006063609, -4.800007), pista3Spline_playa[9] = new pc.Vec3(.0009613037, .005950179, -5.40002), pista3Spline_playa[10] = new pc.Vec3(.002315521, .006615401, -5.999999), pista3Spline_playa[11] = new pc.Vec3(.006412029, .009029662, -6.599981), pista3Spline_playa[12] = new pc.Vec3(.01467466, .014164, -7.199898), pista3Spline_playa[13] = new pc.Vec3(.02770185, .02296941, -7.79969), pista3Spline_playa[14] = new pc.Vec3(.04441071, .03505063, -8.399367), pista3Spline_playa[15] = new pc.Vec3(.06418228, .04910199, -8.99885), pista3Spline_playa[16] = new pc.Vec3(.08639908, .06381039, -9.598269), pista3Spline_playa[17] = new pc.Vec3(.1104393, .07786478, -10.19763), pista3Spline_playa[18] = new pc.Vec3(.1357803, .09001938, -10.79693), pista3Spline_playa[19] = new pc.Vec3(.1634674, .1008432, -11.39625), pista3Spline_playa[20] = new pc.Vec3(.1935186, .1110259, -11.99536), pista3Spline_playa[21] = new pc.Vec3(.2252302, .1207974, -12.59448), pista3Spline_playa[22] = new pc.Vec3(.2579145, .1303869, -13.19348), pista3Spline_playa[23] = new pc.Vec3(.2908621, .1400232, -13.7925), pista3Spline_playa[24] = new pc.Vec3(.3318968, .1489414, -14.39097), pista3Spline_playa[25] = new pc.Vec3(.3736486, .1566194, -14.98949), pista3Spline_playa[26] = new pc.Vec3(.4161406, .1637554, -15.58796), pista3Spline_playa[27] = new pc.Vec3(.4666672, .1707579, -16.18576), pista3Spline_playa[28] = new pc.Vec3(.5324478, .1780155, -16.78208), pista3Spline_playa[29] = new pc.Vec3(.6207809, .1858974, -17.37544), pista3Spline_playa[30] = new pc.Vec3(.7303734, .1943405, -17.96528), pista3Spline_playa[31] = new pc.Vec3(.8557148, .2030236, -18.55194), pista3Spline_playa[32] = new pc.Vec3(.9970341, .2119752, -19.135), pista3Spline_playa[33] = new pc.Vec3(1.154497, .2212461, -19.71387), pista3Spline_playa[34] = new pc.Vec3(1.328165, .2308686, -20.28809), pista3Spline_playa[35] = new pc.Vec3(1.517443, .2408842, -20.85733), pista3Spline_playa[36] = new pc.Vec3(1.719931, .2513007, -21.422), pista3Spline_playa[37] = new pc.Vec3(1.936739, .2620397, -21.98134), pista3Spline_playa[38] = new pc.Vec3(2.170004, .2730532, -22.534), pista3Spline_playa[39] = new pc.Vec3(2.421875, .2842817, -23.07843), pista3Spline_playa[40] = new pc.Vec3(2.694504, .2956414, -23.61274), pista3Spline_playa[41] = new pc.Vec3(2.986824, .3072021, -24.13658), pista3Spline_playa[42] = new pc.Vec3(3.295094, .3189769, -24.65119), pista3Spline_playa[43] = new pc.Vec3(3.619825, .3308969, -25.15553), pista3Spline_playa[44] = new pc.Vec3(3.962343, .3428755, -25.64796), pista3Spline_playa[45] = new pc.Vec3(4.324427, .3548238, -26.12617), pista3Spline_playa[46] = new pc.Vec3(4.708359, .3666193, -26.58703), pista3Spline_playa[47] = new pc.Vec3(5.116909, .3781626, -27.02619), pista3Spline_playa[48] = new pc.Vec3(5.548124, .3894904, -27.44315), pista3Spline_playa[49] = new pc.Vec3(5.997608, .4006894, -27.84038), pista3Spline_playa[50] = new pc.Vec3(6.461016, .4118674, -28.22128), pista3Spline_playa[51] = new pc.Vec3(6.93442, .4231651, -28.58973), pista3Spline_playa[52] = new pc.Vec3(7.415977, .4345758, -28.94741), pista3Spline_playa[53] = new pc.Vec3(7.910341, .445853, -29.28718), pista3Spline_playa[54] = new pc.Vec3(8.415821, .4570935, -29.61017), pista3Spline_playa[55] = new pc.Vec3(8.928198, .4684417, -29.92219), pista3Spline_playa[56] = new pc.Vec3(9.444008, .4800985, -30.22842), pista3Spline_playa[57] = new pc.Vec3(9.959219, .4921806, -30.53572), pista3Spline_playa[58] = new pc.Vec3(10.47759, .5054166, -30.83755), pista3Spline_playa[59] = new pc.Vec3(10.99565, .5186183, -31.13993), pista3Spline_playa[60] = new pc.Vec3(11.51372, .5318363, -31.44228), pista3Spline_playa[61] = new pc.Vec3(12.03292, .545284, -31.74269), pista3Spline_playa[62] = new pc.Vec3(12.55432, .5591724, -32.03925), pista3Spline_playa[63] = new pc.Vec3(13.07897, .573714, -32.32999), pista3Spline_playa[64] = new pc.Vec3(13.60703, .5891693, -32.61444), pista3Spline_playa[65] = new pc.Vec3(14.13767, .6053941, -32.89397), pista3Spline_playa[66] = new pc.Vec3(14.67041, .6220262, -33.16948), pista3Spline_playa[67] = new pc.Vec3(15.20475, .6387002, -33.44193), pista3Spline_playa[68] = new pc.Vec3(15.74021, .6550558, -33.71215), pista3Spline_playa[69] = new pc.Vec3(16.2765, .6708143, -33.98071), pista3Spline_playa[70] = new pc.Vec3(16.81482, .6865413, -34.24522), pista3Spline_playa[71] = new pc.Vec3(17.35478, .7021911, -34.50638), pista3Spline_playa[72] = new pc.Vec3(17.8955, .7174881, -34.76595), pista3Spline_playa[73] = new pc.Vec3(18.43615, .7321537, -35.02577), pista3Spline_playa[74] = new pc.Vec3(18.97585, .7459133, -35.28752), pista3Spline_playa[75] = new pc.Vec3(19.51432, .7585819, -35.55188), pista3Spline_playa[76] = new pc.Vec3(20.05274, .7703578, -35.81641), pista3Spline_playa[77] = new pc.Vec3(20.59079, .7813575, -36.0817), pista3Spline_playa[78] = new pc.Vec3(21.12803, .7916782, -36.34861), pista3Spline_playa[79] = new pc.Vec3(21.66402, .8014209, -36.61816), pista3Spline_playa[80] = new pc.Vec3(22.19828, .810683, -36.89106), pista3Spline_playa[81] = new pc.Vec3(22.73048, .8190868, -37.16798), pista3Spline_playa[82] = new pc.Vec3(23.26091, .8264816, -37.44831), pista3Spline_playa[83] = new pc.Vec3(23.79, .8333499, -37.73119), pista3Spline_playa[84] = new pc.Vec3(24.31816, .8401744, -38.0158), pista3Spline_playa[85] = new pc.Vec3(24.84583, .8474414, -38.30132), pista3Spline_playa[86] = new pc.Vec3(25.37077, .8569705, -38.59157), pista3Spline_playa[87] = new pc.Vec3(25.8841, .8737113, -38.90174), pista3Spline_playa[88] = new pc.Vec3(26.39509, .8924358, -39.21564), pista3Spline_playa[89] = new pc.Vec3(26.89983, .9131134, -39.53936), pista3Spline_playa[90] = new pc.Vec3(27.39577, .9351547, -39.87633), pista3Spline_playa[91] = new pc.Vec3(27.87955, .9579742, -40.23042), pista3Spline_playa[92] = new pc.Vec3(28.35014, .9812877, -40.60186), pista3Spline_playa[93] = new pc.Vec3(28.80988, 1.00562, -40.98656), pista3Spline_playa[94] = new pc.Vec3(29.25814, 1.031028, -41.38456), pista3Spline_playa[95] = new pc.Vec3(29.69345, 1.057351, -41.79662), pista3Spline_playa[96] = new pc.Vec3(30.11427, 1.084548, -42.22339), pista3Spline_playa[97] = new pc.Vec3(30.51855, 1.112447, -42.66574), pista3Spline_playa[98] = new pc.Vec3(30.89573, 1.140013, -43.13132), pista3Spline_playa[99] = new pc.Vec3(31.27505, 1.16952, -43.59441), pista3Spline_playa[100] = new pc.Vec3(31.62299, 1.198533, -44.08232), pista3Spline_playa[101] = new pc.Vec3(31.962, 1.229041, -44.57644), pista3Spline_playa[102] = new pc.Vec3(32.29061, 1.261286, -45.0774), pista3Spline_playa[103] = new pc.Vec3(32.6115, 1.295773, -45.58319), pista3Spline_playa[104] = new pc.Vec3(32.92548, 1.332825, -46.09313), pista3Spline_playa[105] = new pc.Vec3(33.2297, 1.37185, -46.60883), pista3Spline_playa[106] = new pc.Vec3(33.52062, 1.412179, -47.132), pista3Spline_playa[107] = new pc.Vec3(33.79457, 1.453126, -47.66418), pista3Spline_playa[108] = new pc.Vec3(34.0472, 1.49397, -48.20681), pista3Spline_playa[109] = new pc.Vec3(34.27554, 1.533719, -48.7602), pista3Spline_playa[110] = new pc.Vec3(34.48122, 1.572003, -49.32252), pista3Spline_playa[111] = new pc.Vec3(34.66631, 1.610108, -49.89191), pista3Spline_playa[112] = new pc.Vec3(34.83246, 1.649293, -50.46711), pista3Spline_playa[113] = new pc.Vec3(34.98134, 1.690804, -51.04681), pista3Spline_playa[114] = new pc.Vec3(35.11458, 1.736047, -51.63007), pista3Spline_playa[115] = new pc.Vec3(35.22762, 1.786027, -52.21718), pista3Spline_playa[116] = new pc.Vec3(35.31857, 1.839619, -52.8078), pista3Spline_playa[117] = new pc.Vec3(35.39297, 1.8952, -53.40055), pista3Spline_playa[118] = new pc.Vec3(35.45611, 1.951401, -53.99456), pista3Spline_playa[119] = new pc.Vec3(35.51369, 2.006608, -54.58925), pista3Spline_playa[120] = new pc.Vec3(35.56226, 2.059842, -55.18478), pista3Spline_playa[121] = new pc.Vec3(35.60111, 2.112382, -55.78123), pista3Spline_playa[122] = new pc.Vec3(35.63988, 2.165013, -56.37766), pista3Spline_playa[123] = new pc.Vec3(35.67706, 2.217404, -56.97419), pista3Spline_playa[124] = new pc.Vec3(35.71113, 2.269234, -57.57097), pista3Spline_playa[125] = new pc.Vec3(35.74056, 2.320168, -58.16809), pista3Spline_playa[126] = new pc.Vec3(35.76396, 2.36992, -58.76556), pista3Spline_playa[127] = new pc.Vec3(35.78158, 2.418607, -59.36332), pista3Spline_playa[128] = new pc.Vec3(35.79485, 2.46647, -59.96123), pista3Spline_playa[129] = new pc.Vec3(35.80524, 2.513768, -60.5593), pista3Spline_playa[130] = new pc.Vec3(35.81425, 2.560738, -61.15741), pista3Spline_playa[131] = new pc.Vec3(35.82336, 2.607644, -61.75549), pista3Spline_playa[132] = new pc.Vec3(35.83282, 2.655061, -62.35352), pista3Spline_playa[133] = new pc.Vec3(35.84161, 2.702954, -62.95153), pista3Spline_playa[134] = new pc.Vec3(35.8493, 2.750581, -63.54963), pista3Spline_playa[135] = new pc.Vec3(35.85549, 2.797166, -64.14777), pista3Spline_playa[136] = new pc.Vec3(35.85982, 2.841962, -64.74609), pista3Spline_playa[137] = new pc.Vec3(35.86185, 2.884228, -65.3446), pista3Spline_playa[138] = new pc.Vec3(35.86037, 2.925992, -65.94313), pista3Spline_playa[139] = new pc.Vec3(35.85577, 2.967446, -66.5417), pista3Spline_playa[140] = new pc.Vec3(35.84951, 3.006577, -67.14038), pista3Spline_playa[141] = new pc.Vec3(35.84303, 3.041367, -67.73934), pista3Spline_playa[142] = new pc.Vec3(35.83782, 3.069806, -68.33863), pista3Spline_playa[143] = new pc.Vec3(35.83508, 3.089825, -68.93831), pista3Spline_playa[144] = new pc.Vec3(35.83392, 3.100659, -69.53815), pista3Spline_playa[145] = new pc.Vec3(35.83369, 3.1046, -70.13815), pista3Spline_playa[146] = new pc.Vec3(35.83403, 3.104249, -70.73816), pista3Spline_playa[147] = new pc.Vec3(35.83456, 3.102212, -71.33815), pista3Spline_playa[148] = new pc.Vec3(35.83492, 3.101079, -71.93815), pista3Spline_playa[149] = new pc.Vec3(35.83505, 3.101102, -72.53815), pista3Spline_playa[150] = new pc.Vec3(35.83534, 3.099587, -73.13818), pista3Spline_playa[151] = new pc.Vec3(35.83571, 3.097123, -73.73819), pista3Spline_playa[152] = new pc.Vec3(35.83609, 3.094369, -74.33813), pista3Spline_playa[153] = new pc.Vec3(35.83641, 3.091988, -74.93814), pista3Spline_playa[154] = new pc.Vec3(35.83661, 3.090634, -75.53812), pista3Spline_playa[155] = new pc.Vec3(35.8367, 3.090127, -76.13812), pista3Spline_playa[156] = new pc.Vec3(35.83673, 3.090066, -76.73808), pista3Spline_playa[157] = new pc.Vec3(35.83673, 3.090279, -77.33814), pista3Spline_playa[158] = new pc.Vec3(35.8367, 3.090596, -77.93812), pista3Spline_playa[159] = new pc.Vec3(35.83668, 3.090852, -78.53816), pista3Spline_playa[160] = new pc.Vec3(35.83667, 3.090905, -79.13813), pista3Spline_playa[161] = new pc.Vec3(35.83667, 3.090928, -79.73814), pista3Spline_playa[162] = new pc.Vec3(35.83666, 3.090951, -80.33812), pista3Spline_playa[163] = new pc.Vec3(35.83664, 3.090974, -80.9381), pista3Spline_playa[164] = new pc.Vec3(35.83663, 3.090997, -81.53809), pista3Spline_playa[165] = new pc.Vec3(35.83662, 3.091016, -82.13809), pista3Spline_playa[166] = new pc.Vec3(35.83661, 3.091019, -82.73812), pista3Spline_playa[167] = new pc.Vec3(35.83659, 3.090977, -83.33812), pista3Spline_playa[168] = new pc.Vec3(35.83657, 3.090932, -83.9381), pista3Spline_playa[169] = new pc.Vec3(35.83654, 3.09092, -84.53812), pista3Spline_playa[170] = new pc.Vec3(35.83652, 3.090981, -85.13811), pista3Spline_playa[171] = new pc.Vec3(35.83649, 3.091149, -85.73812), pista3Spline_playa[172] = new pc.Vec3(35.83648, 3.091061, -86.33812), pista3Spline_playa[173] = new pc.Vec3(35.83647, 3.090729, -86.9381), pista3Spline_playa[174] = new pc.Vec3(35.83647, 3.090516, -87.53814), pista3Spline_playa[175] = new pc.Vec3(35.83644, 3.090775, -88.13811), pista3Spline_playa[176] = new pc.Vec3(35.83638, 3.091874, -88.73811), pista3Spline_playa[177] = new pc.Vec3(35.83629, 3.094197, -89.33813), pista3Spline_playa[178] = new pc.Vec3(35.83609, 3.098805, -89.93811), pista3Spline_playa[179] = new pc.Vec3(35.83585, 3.105149, -90.53809), pista3Spline_playa[180] = new pc.Vec3(35.83558, 3.111954, -91.13804), pista3Spline_playa[181] = new pc.Vec3(35.83534, 3.117963, -91.738), pista3Spline_playa[182] = new pc.Vec3(35.83519, 3.121896, -92.33802), pista3Spline_playa[183] = new pc.Vec3(35.83511, 3.123181, -92.93798), pista3Spline_playa[184] = new pc.Vec3(35.83496, 3.124165, -93.53798), pista3Spline_playa[185] = new pc.Vec3(35.83483, 3.124013, -94.13799), pista3Spline_playa[186] = new pc.Vec3(35.83483, 3.121346, -94.73798), pista3Spline_playa[187] = new pc.Vec3(35.83506, 3.114785, -95.33795), pista3Spline_playa[188] = new pc.Vec3(35.83563, 3.102959, -95.9378), pista3Spline_playa[189] = new pc.Vec3(35.83662, 3.085702, -96.5376), pista3Spline_playa[190] = new pc.Vec3(35.83794, 3.064187, -97.13721), pista3Spline_playa[191] = new pc.Vec3(35.8395, 3.038777, -97.73663), pista3Spline_playa[192] = new pc.Vec3(35.84119, 3.009824, -98.33593), pista3Spline_playa[193] = new pc.Vec3(35.84291, 2.977696, -98.93505), pista3Spline_playa[194] = new pc.Vec3(35.84457, 2.94275, -99.53407), pista3Spline_playa[195] = new pc.Vec3(35.84651, 2.905125, -100.1329), pista3Spline_playa[196] = new pc.Vec3(35.84868, 2.864445, -100.7315), pista3Spline_playa[197] = new pc.Vec3(35.8508, 2.820275, -101.3298), pista3Spline_playa[198] = new pc.Vec3(35.85258, 2.772156, -101.9279), pista3Spline_playa[199] = new pc.Vec3(35.85374, 2.719643, -102.5256), pista3Spline_playa[200] = new pc.Vec3(35.85404, 2.661916, -103.1228), pista3Spline_playa[201] = new pc.Vec3(35.85356, 2.597867, -103.7194), pista3Spline_playa[202] = new pc.Vec3(35.85252, 2.529084, -104.3154), pista3Spline_playa[203] = new pc.Vec3(35.85117, 2.457417, -104.9111), pista3Spline_playa[204] = new pc.Vec3(35.8497, 2.384694, -105.5067), pista3Spline_playa[205] = new pc.Vec3(35.84837, 2.31276, -106.1024), pista3Spline_playa[206] = new pc.Vec3(35.84734, 2.241185, -106.6981), pista3Spline_playa[207] = new pc.Vec3(35.84647, 2.168504, -107.2937), pista3Spline_playa[208] = new pc.Vec3(35.84551, 2.095116, -107.8892), pista3Spline_playa[209] = new pc.Vec3(35.84428, 2.021435, -108.4846), pista3Spline_playa[210] = new pc.Vec3(35.84253, 1.947873, -109.0801), pista3Spline_playa[211] = new pc.Vec3(35.84004, 1.874833, -109.6757), pista3Spline_playa[212] = new pc.Vec3(35.83611, 1.802064, -110.2712), pista3Spline_playa[213] = new pc.Vec3(35.83105, 1.729337, -110.8668), pista3Spline_playa[214] = new pc.Vec3(35.82567, 1.65672, -111.4623), pista3Spline_playa[215] = new pc.Vec3(35.82084, 1.584294, -112.0579), pista3Spline_playa[216] = new pc.Vec3(35.81739, 1.512135, -112.6536), pista3Spline_playa[217] = new pc.Vec3(35.81614, 1.440251, -113.2492), pista3Spline_playa[218] = new pc.Vec3(35.817, 1.368424, -113.8449), pista3Spline_playa[219] = new pc.Vec3(35.81915, 1.296773, -114.4406), pista3Spline_playa[220] = new pc.Vec3(35.82174, 1.225484, -115.0364), pista3Spline_playa[221] = new pc.Vec3(35.82394, 1.154736, -115.6321), pista3Spline_playa[222] = new pc.Vec3(35.82489, 1.084702, -116.228), pista3Spline_playa[223] = new pc.Vec3(35.82446, 1.015065, -116.824), pista3Spline_playa[224] = new pc.Vec3(35.82331, .9455612, -117.42), pista3Spline_playa[225] = new pc.Vec3(35.82169, .8765762, -118.016), pista3Spline_playa[226] = new pc.Vec3(35.81979, .8084762, -118.6121), pista3Spline_playa[227] = new pc.Vec3(35.81787, .7416351, -119.2084), pista3Spline_playa[228] = new pc.Vec3(35.81614, .6764343, -119.8048), pista3Spline_playa[229] = new pc.Vec3(35.81456, .6122024, -120.4014), pista3Spline_playa[230] = new pc.Vec3(35.81295, .5487716, -120.998), pista3Spline_playa[231] = new pc.Vec3(35.81131, .486882, -121.5948), pista3Spline_playa[232] = new pc.Vec3(35.80959, .4272735, -122.1918), pista3Spline_playa[233] = new pc.Vec3(35.80779, .370671, -122.7891), pista3Spline_playa[234] = new pc.Vec3(35.80585, .3173378, -123.3868), pista3Spline_playa[235] = new pc.Vec3(35.80376, .2651489, -123.9845), pista3Spline_playa[236] = new pc.Vec3(35.80154, .2149627, -124.5824), pista3Spline_playa[237] = new pc.Vec3(35.7993, .1682174, -125.1805), pista3Spline_playa[238] = new pc.Vec3(35.79708, .1263664, -125.7791), pista3Spline_playa[239] = new pc.Vec3(35.79496, .09085917, -126.3781), pista3Spline_playa[240] = new pc.Vec3(35.79291, .06322551, -126.9774), pista3Spline_playa[241] = new pc.Vec3(35.79078, .04339671, -127.577), pista3Spline_playa[242] = new pc.Vec3(35.78869, .0295074, -128.1769), pista3Spline_playa[243] = new pc.Vec3(35.78675, .01964641, -128.7768), pista3Spline_playa[244] = new pc.Vec3(35.78514, .01189876, -129.3767), pista3Spline_playa[245] = new pc.Vec3(35.78394, .004475355, -129.9767), pista3Spline_playa[246] = new pc.Vec3(35.78342, .0005652905, -130.5767), pista3Spline_playa[247] = new pc.Vec3(35.78336, -.0001480579, -131.1767), pista3Spline_playa[248] = new pc.Vec3(35.78351, .0006873608, -131.7767), pista3Spline_playa[249] = new pc.Vec3(35.78372, .002117872, -132.3766), pista3Spline_playa[250] = new pc.Vec3(35.78388, .003208876, -132.9767), pista3Spline_playa[251] = new pc.Vec3(35.78388, .003208876, -133.2184);
var pista3Spline_playa_angulos = [];
pista3Spline_playa_angulos[0] = new pc.Vec3(0, 0, 0), pista3Spline_playa_angulos[1] = new pc.Vec3(270.028, 270.0488, 0), pista3Spline_playa_angulos[2] = new pc.Vec3(270, 270.0508, 0), pista3Spline_playa_angulos[3] = new pc.Vec3(270, 270.0464, 0), pista3Spline_playa_angulos[4] = new pc.Vec3(270.0343, 270.037, 0), pista3Spline_playa_angulos[5] = new pc.Vec3(270.0443, 270.0203, 0), pista3Spline_playa_angulos[6] = new pc.Vec3(270.0685, 269.9915, 0), pista3Spline_playa_angulos[7] = new pc.Vec3(270.0396, 269.9826, 0), pista3Spline_playa_angulos[8] = new pc.Vec3(270.028, 269.9965, 0), pista3Spline_playa_angulos[9] = new pc.Vec3(270, 269.9667, 0), pista3Spline_playa_angulos[10] = new pc.Vec3(270.1342, 359.7623, 269.9982), pista3Spline_playa_angulos[11] = new pc.Vec3(270.346, 359.4314, 270), pista3Spline_playa_angulos[12] = new pc.Vec3(270.6525, 358.9684, 269.9999), pista3Spline_playa_angulos[13] = new pc.Vec3(271.0168, 358.5694, 270.0001), pista3Spline_playa_angulos[14] = new pc.Vec3(271.2673, 358.2483, 269.9999), pista3Spline_playa_angulos[15] = new pc.Vec3(271.3928, 357.9854, 269.9999), pista3Spline_playa_angulos[16] = new pc.Vec3(271.393, 357.7812, 269.9999), pista3Spline_playa_angulos[17] = new pc.Vec3(271.2676, 357.6353, 270.0002), pista3Spline_playa_angulos[18] = new pc.Vec3(271.0715, 357.4898, 270.0001), pista3Spline_playa_angulos[19] = new pc.Vec3(270.9996, 357.2313, 270.0002), pista3Spline_playa_angulos[20] = new pc.Vec3(270.9489, 357.0386, 270.0002), pista3Spline_playa_angulos[21] = new pc.Vec3(270.9211, 356.9129, 270.0003), pista3Spline_playa_angulos[22] = new pc.Vec3(270.9145, 356.8543, 269.9999), pista3Spline_playa_angulos[23] = new pc.Vec3(270.93, 356.8615, 269.9997), pista3Spline_playa_angulos[24] = new pc.Vec3(270.7574, 355.5498, 269.9999), pista3Spline_playa_angulos[25] = new pc.Vec3(270.7025, 356.0818, 270.0001), pista3Spline_playa_angulos[26] = new pc.Vec3(270.6685, 355.6652, 270.0002), pista3Spline_playa_angulos[27] = new pc.Vec3(270.6749, 354.5628, 269.9999), pista3Spline_playa_angulos[28] = new pc.Vec3(270.7177, 352.7102, 270.0003), pista3Spline_playa_angulos[29] = new pc.Vec3(270.7833, 350.4221, 270.0002), pista3Spline_playa_angulos[30] = new pc.Vec3(270.8173, 348.7166, 270.0001), pista3Spline_playa_angulos[31] = new pc.Vec3(270.8402, 347.1601, 270.0002), pista3Spline_playa_angulos[32] = new pc.Vec3(270.8695, 345.5832, 270.0001), pista3Spline_playa_angulos[33] = new pc.Vec3(270.9014, 343.9836, 270.0001), pista3Spline_playa_angulos[34] = new pc.Vec3(270.9369, 342.3421, 269.9998), pista3Spline_playa_angulos[35] = new pc.Vec3(270.9768, 340.9092, 269.9999), pista3Spline_playa_angulos[36] = new pc.Vec3(271.0112, 339.5868, 270.0002), pista3Spline_playa_angulos[37] = new pc.Vec3(271.0393, 337.9994, 270.0001), pista3Spline_playa_angulos[38] = new pc.Vec3(271.0624, 336.1767, 269.9999), pista3Spline_playa_angulos[39] = new pc.Vec3(271.0799, 334.1319, 270), pista3Spline_playa_angulos[40] = new pc.Vec3(271.0915, 331.8464, 270.0003), pista3Spline_playa_angulos[41] = new pc.Vec3(271.1149, 329.9272, 270.0001), pista3Spline_playa_angulos[42] = new pc.Vec3(271.1321, 328.1696, 270.0003), pista3Spline_playa_angulos[43] = new pc.Vec3(271.1436, 326.2449, 270.0002), pista3Spline_playa_angulos[44] = new pc.Vec3(271.1426, 324.0752, 269.9999), pista3Spline_playa_angulos[45] = new pc.Vec3(271.1361, 321.5978, 270.0003), pista3Spline_playa_angulos[46] = new pc.Vec3(271.1149, 318.6712, 270.0002), pista3Spline_playa_angulos[47] = new pc.Vec3(271.0915, 315.4938, 270.0001), pista3Spline_playa_angulos[48] = new pc.Vec3(271.0728, 312.6618, 269.9999), pista3Spline_playa_angulos[49] = new pc.Vec3(271.0672, 310.3642, 269.9999), pista3Spline_playa_angulos[50] = new pc.Vec3(271.0712, 308.5726, 270.0004), pista3Spline_playa_angulos[51] = new pc.Vec3(271.0902, 307.3847, 270), pista3Spline_playa_angulos[52] = new pc.Vec3(271.0846, 305.6906, 269.9999), pista3Spline_playa_angulos[53] = new pc.Vec3(271.0721, 303.4174, 270.0003), pista3Spline_playa_angulos[54] = new pc.Vec3(271.0765, 301.8724, 270.0001), pista3Spline_playa_angulos[55] = new pc.Vec3(271.095, 300.9275, 270.0002), pista3Spline_playa_angulos[56] = new pc.Vec3(271.1356, 300.5807, 269.9998), pista3Spline_playa_angulos[57] = new pc.Vec3(271.1988, 300.7637, 270.0001), pista3Spline_playa_angulos[58] = new pc.Vec3(271.2667, 300.2032, 270.0002), pista3Spline_playa_angulos[59] = new pc.Vec3(271.2582, 300.3042, 270.0001), pista3Spline_playa_angulos[60] = new pc.Vec3(271.2698, 300.1961, 270.0001), pista3Spline_playa_angulos[61] = new pc.Vec3(271.3019, 299.8747, 269.9998), pista3Spline_playa_angulos[62] = new pc.Vec3(271.3542, 299.3455, 270.0001), pista3Spline_playa_angulos[63] = new pc.Vec3(271.4286, 298.6217, 270.0001), pista3Spline_playa_angulos[64] = new pc.Vec3(271.518, 298.0286, 270.0002), pista3Spline_playa_angulos[65] = new pc.Vec3(271.5743, 297.549, 269.9998), pista3Spline_playa_angulos[66] = new pc.Vec3(271.5959, 297.1656, 269.9999), pista3Spline_playa_angulos[67] = new pc.Vec3(271.5823, 296.8781, 270), pista3Spline_playa_angulos[68] = new pc.Vec3(271.5347, 296.6916, 270.0002), pista3Spline_playa_angulos[69] = new pc.Vec3(271.4962, 296.4111, 270), pista3Spline_playa_angulos[70] = new pc.Vec3(271.5022, 295.9574, 270.0001), pista3Spline_playa_angulos[71] = new pc.Vec3(271.4819, 295.6982, 270.0001), pista3Spline_playa_angulos[72] = new pc.Vec3(271.4348, 295.6234, 270.0001), pista3Spline_playa_angulos[73] = new pc.Vec3(271.3611, 295.7416, 269.9999), pista3Spline_playa_angulos[74] = new pc.Vec3(271.2616, 296.0453, 269.9996), pista3Spline_playa_angulos[75] = new pc.Vec3(271.1647, 296.1544, 269.9999), pista3Spline_playa_angulos[76] = new pc.Vec3(271.0861, 296.1916, 270.0001), pista3Spline_playa_angulos[77] = new pc.Vec3(271.0162, 296.3209, 270.0001), pista3Spline_playa_angulos[78] = new pc.Vec3(270.9563, 296.5445, 270.0002), pista3Spline_playa_angulos[79] = new pc.Vec3(270.9059, 296.8608, 269.9999), pista3Spline_playa_angulos[80] = new pc.Vec3(270.8584, 297.275, 270.0001), pista3Spline_playa_angulos[81] = new pc.Vec3(270.7468, 297.6847, 269.9999), pista3Spline_playa_angulos[82] = new pc.Vec3(270.6738, 298.0094, 270.0002), pista3Spline_playa_angulos[83] = new pc.Vec3(270.6465, 298.2402, 270.0004), pista3Spline_playa_angulos[84] = new pc.Vec3(270.665, 298.3799, 269.9998), pista3Spline_playa_angulos[85] = new pc.Vec3(270.7303, 298.4305, 269.9994), pista3Spline_playa_angulos[86] = new pc.Vec3(271.4405, 300.8301, 270.0001), pista3Spline_playa_angulos[87] = new pc.Vec3(271.6699, 301.1568, 269.9999), pista3Spline_playa_angulos[88] = new pc.Vec3(271.8911, 302.0581, 269.9999), pista3Spline_playa_angulos[89] = new pc.Vec3(272.047, 303.3687, 270), pista3Spline_playa_angulos[90] = new pc.Vec3(272.1543, 305.1078, 270), pista3Spline_playa_angulos[91] = new pc.Vec3(272.201, 307.3064, 270), pista3Spline_playa_angulos[92] = new pc.Vec3(272.2677, 309.1578, 269.9999), pista3Spline_playa_angulos[93] = new pc.Vec3(272.378, 310.7407, 269.9999), pista3Spline_playa_angulos[94] = new pc.Vec3(272.4716, 312.4889, 269.9999), pista3Spline_playa_angulos[95] = new pc.Vec3(272.5561, 314.3893, 270), pista3Spline_playa_angulos[96] = new pc.Vec3(272.6381, 316.4259, 270), pista3Spline_playa_angulos[97] = new pc.Vec3(272.6038, 320.1467, 270), pista3Spline_playa_angulos[98] = new pc.Vec3(272.8719, 318.1712, 270.0001), pista3Spline_playa_angulos[99] = new pc.Vec3(272.6863, 324.4083, 270.0001), pista3Spline_playa_angulos[100] = new pc.Vec3(272.8555, 324.7676, 270), pista3Spline_playa_angulos[101] = new pc.Vec3(272.9898, 326.1926, 270), pista3Spline_playa_angulos[102] = new pc.Vec3(273.1797, 327.2147, 270), pista3Spline_playa_angulos[103] = new pc.Vec3(273.4215, 327.9498, 270.0001), pista3Spline_playa_angulos[104] = new pc.Vec3(273.6495, 328.8541, 270), pista3Spline_playa_angulos[105] = new pc.Vec3(273.7993, 330.1363, 270), pista3Spline_playa_angulos[106] = new pc.Vec3(273.8947, 331.7829, 270), pista3Spline_playa_angulos[107] = new pc.Vec3(273.9138, 333.8262, 270), pista3Spline_playa_angulos[108] = new pc.Vec3(273.8798, 336.2983, 270), pista3Spline_playa_angulos[109] = new pc.Vec3(273.7212, 338.7918, 269.9999), pista3Spline_playa_angulos[110] = new pc.Vec3(273.632, 340.978, 270), pista3Spline_playa_angulos[111] = new pc.Vec3(273.6741, 342.9747, 270), pista3Spline_playa_angulos[112] = new pc.Vec3(273.8345, 344.7676, 270), pista3Spline_playa_angulos[113] = new pc.Vec3(274.1249, 346.3841, 270), pista3Spline_playa_angulos[114] = new pc.Vec3(274.5543, 348.047, 270.0001), pista3Spline_playa_angulos[115] = new pc.Vec3(274.976, 350.2577, 270), pista3Spline_playa_angulos[116] = new pc.Vec3(275.2473, 352.1414, 270), pista3Spline_playa_angulos[117] = new pc.Vec3(275.3619, 353.4644, 270), pista3Spline_playa_angulos[118] = new pc.Vec3(275.3427, 354.2993, 270.0001), pista3Spline_playa_angulos[119] = new pc.Vec3(275.2202, 354.252, 269.9999), pista3Spline_playa_angulos[120] = new pc.Vec3(275.0085, 356.3216, 270), pista3Spline_playa_angulos[121] = new pc.Vec3(275.0327, 356.2535, 270), pista3Spline_playa_angulos[122] = new pc.Vec3(275.0258, 356.3347, 270), pista3Spline_playa_angulos[123] = new pc.Vec3(274.9877, 356.5601, 270.0001), pista3Spline_playa_angulos[124] = new pc.Vec3(274.9175, 356.9321, 270), pista3Spline_playa_angulos[125] = new pc.Vec3(274.8154, 357.4501, 269.9999), pista3Spline_playa_angulos[126] = new pc.Vec3(274.7014, 358.0553, 269.9999), pista3Spline_playa_angulos[127] = new pc.Vec3(274.6111, 358.5425, 270.0001), pista3Spline_playa_angulos[128] = new pc.Vec3(274.5445, 358.8879, 269.9999), pista3Spline_playa_angulos[129] = new pc.Vec3(274.5018, 359.0923, 270), pista3Spline_playa_angulos[130] = new pc.Vec3(274.4832, 359.155, 270), pista3Spline_playa_angulos[131] = new pc.Vec3(274.4928, 359.085, 270), pista3Spline_playa_angulos[132] = new pc.Vec3(274.5669, 359.1199, 270), pista3Spline_playa_angulos[133] = new pc.Vec3(274.5771, 359.206, 270), pista3Spline_playa_angulos[134] = new pc.Vec3(274.5143, 359.3301, 270), pista3Spline_playa_angulos[135] = new pc.Vec3(274.379, 359.4915, 270), pista3Spline_playa_angulos[136] = new pc.Vec3(274.1703, 359.6893, 270), pista3Spline_playa_angulos[137] = new pc.Vec3(273.9507, 359.949, 270), pista3Spline_playa_angulos[138] = new pc.Vec3(274.0066, .3120931, 270), pista3Spline_playa_angulos[139] = new pc.Vec3(273.8806, .5424904, 270), pista3Spline_playa_angulos[140] = new pc.Vec3(273.5618, .6310453, 270.0001), pista3Spline_playa_angulos[141] = new pc.Vec3(273.0509, .580671, 269.9999), pista3Spline_playa_angulos[142] = new pc.Vec3(272.3463, .3901649, 270), pista3Spline_playa_angulos[143] = new pc.Vec3(271.449, .1677087, 270.0003), pista3Spline_playa_angulos[144] = new pc.Vec3(270.6667, .06045249, 269.9993), pista3Spline_playa_angulos[145] = new pc.Vec3(270.1312, 359.9911, 269.9985), pista3Spline_playa_angulos[146] = new pc.Vec3(270.1532, 179.9539, 89.99904), pista3Spline_playa_angulos[147] = new pc.Vec3(270.1877, 179.9512, 90.00078), pista3Spline_playa_angulos[148] = new pc.Vec3(270, 269.9999, 0), pista3Spline_playa_angulos[149] = new pc.Vec3(270.074, 269.9015, 0), pista3Spline_playa_angulos[150] = new pc.Vec3(270.1998, 179.9687, 90), pista3Spline_playa_angulos[151] = new pc.Vec3(270.2594, 179.9634, 90), pista3Spline_playa_angulos[152] = new pc.Vec3(270.2549, 179.9647, 90.00039), pista3Spline_playa_angulos[153] = new pc.Vec3(270.1877, 179.975, 90), pista3Spline_playa_angulos[154] = new pc.Vec3(270.0791, 269.9113, 0), pista3Spline_playa_angulos[155] = new pc.Vec3(270, 269.9696, 0), pista3Spline_playa_angulos[156] = new pc.Vec3(270, 270.0084, 0), pista3Spline_playa_angulos[157] = new pc.Vec3(270.028, 270.03, 0), pista3Spline_playa_angulos[158] = new pc.Vec3(270.0343, 270.0328, 0), pista3Spline_playa_angulos[159] = new pc.Vec3(270, 270.017, 0), pista3Spline_playa_angulos[160] = new pc.Vec3(270, 270.0027, 0), pista3Spline_playa_angulos[161] = new pc.Vec3(270, 270.0022, 0), pista3Spline_playa_angulos[162] = new pc.Vec3(270, 270.0036, 0), pista3Spline_playa_angulos[163] = new pc.Vec3(270, 270.0029, 0), pista3Spline_playa_angulos[164] = new pc.Vec3(270, 270.0035, 0), pista3Spline_playa_angulos[165] = new pc.Vec3(270, 270.0026, 0), pista3Spline_playa_angulos[166] = new pc.Vec3(270, 269.9992, 0), pista3Spline_playa_angulos[167] = new pc.Vec3(270.028, 269.9968, 0), pista3Spline_playa_angulos[168] = new pc.Vec3(270, 269.9981, 0), pista3Spline_playa_angulos[169] = new pc.Vec3(270, 270.004, 0), pista3Spline_playa_angulos[170] = new pc.Vec3(270, 270.0135, 0), pista3Spline_playa_angulos[171] = new pc.Vec3(270, 270.0164, 0), pista3Spline_playa_angulos[172] = new pc.Vec3(270, 269.9745, 0), pista3Spline_playa_angulos[173] = new pc.Vec3(270.0198, 269.9677, 0), pista3Spline_playa_angulos[174] = new pc.Vec3(270, 269.9982, 0), pista3Spline_playa_angulos[175] = new pc.Vec3(270.0593, 270.0624, 0), pista3Spline_playa_angulos[176] = new pc.Vec3(270.1558, .006873481, 270.0019), pista3Spline_playa_angulos[177] = new pc.Vec3(270.3165, .01113945, 270.0012), pista3Spline_playa_angulos[178] = new pc.Vec3(270.541, .02220777, 269.9987), pista3Spline_playa_angulos[179] = new pc.Vec3(270.6474, .02555316, 269.9992), pista3Spline_playa_angulos[180] = new pc.Vec3(270.6306, .02496528, 269.9989), pista3Spline_playa_angulos[181] = new pc.Vec3(270.4934, .02081673, 269.9986), pista3Spline_playa_angulos[182] = new pc.Vec3(270.2341, .008752442, 270.0016), pista3Spline_playa_angulos[183] = new pc.Vec3(270.1028, 270.1136, 0), pista3Spline_playa_angulos[184] = new pc.Vec3(270.0626, 270.0749, 0), pista3Spline_playa_angulos[185] = new pc.Vec3(270.1154, 269.8939, 0), pista3Spline_playa_angulos[186] = new pc.Vec3(270.4187, 179.9905, 89.99989), pista3Spline_playa_angulos[187] = new pc.Vec3(270.8575, 179.9631, 89.99989), pista3Spline_playa_angulos[188] = new pc.Vec3(271.4168, 179.9251, 89.99997), pista3Spline_playa_angulos[189] = new pc.Vec3(271.8567, 179.8879, 90.00002), pista3Spline_playa_angulos[190] = new pc.Vec3(272.2465, 179.8603, 89.99995), pista3Spline_playa_angulos[191] = new pc.Vec3(272.6019, 179.8427, 90), pista3Spline_playa_angulos[192] = new pc.Vec3(272.9226, 179.8354, 89.99998), pista3Spline_playa_angulos[193] = new pc.Vec3(273.2098, 179.8368, 89.99998), pista3Spline_playa_angulos[194] = new pc.Vec3(273.464, 179.8345, 90.00005), pista3Spline_playa_angulos[195] = new pc.Vec3(273.7344, 179.7981, 89.99999), pista3Spline_playa_angulos[196] = new pc.Vec3(274.0482, 179.7914, 89.99999), pista3Spline_playa_angulos[197] = new pc.Vec3(274.4045, 179.8089, 90.00001), pista3Spline_playa_angulos[198] = new pc.Vec3(274.8035, 179.8548, 89.99997), pista3Spline_playa_angulos[199] = new pc.Vec3(275.2461, 179.927, 89.99998), pista3Spline_playa_angulos[200] = new pc.Vec3(275.8402, 180.0118, 89.99992), pista3Spline_playa_angulos[201] = new pc.Vec3(276.383, 180.0761, 90), pista3Spline_playa_angulos[202] = new pc.Vec3(276.7492, 180.1187, 89.99997), pista3Spline_playa_angulos[203] = new pc.Vec3(276.9386, 180.1391, 90.0001), pista3Spline_playa_angulos[204] = new pc.Vec3(276.9515, 180.1377, 90.00006), pista3Spline_playa_angulos[205] = new pc.Vec3(276.8105, 180.1142, 90.00004), pista3Spline_playa_angulos[206] = new pc.Vec3(276.9099, 180.0887, 89.99994), pista3Spline_playa_angulos[207] = new pc.Vec3(276.9984, 180.085, 89.99998), pista3Spline_playa_angulos[208] = new pc.Vec3(277.0462, 180.1025, 90.00008), pista3Spline_playa_angulos[209] = new pc.Vec3(277.0544, 180.1407, 90.00006), pista3Spline_playa_angulos[210] = new pc.Vec3(277.0238, 180.1994, 89.99997), pista3Spline_playa_angulos[211] = new pc.Vec3(276.9662, 180.2952, 90.0001), pista3Spline_playa_angulos[212] = new pc.Vec3(276.9651, 180.4449, 89.99992), pista3Spline_playa_angulos[213] = new pc.Vec3(276.9579, 180.5152, 89.99994), pista3Spline_playa_angulos[214] = new pc.Vec3(276.9428, 180.5042, 89.99997), pista3Spline_playa_angulos[215] = new pc.Vec3(276.9218, 180.4102, 90.00012), pista3Spline_playa_angulos[216] = new pc.Vec3(276.8915, 180.2374, 89.99997), pista3Spline_playa_angulos[217] = new pc.Vec3(276.8785, 180.0074, 89.99996), pista3Spline_playa_angulos[218] = new pc.Vec3(276.8697, 179.8417, 90.00002), pista3Spline_playa_angulos[219] = new pc.Vec3(276.8434, 179.759, 90), pista3Spline_playa_angulos[220] = new pc.Vec3(276.7999, 179.756, 90.00003), pista3Spline_playa_angulos[221] = new pc.Vec3(276.7399, 179.8352, 90), pista3Spline_playa_angulos[222] = new pc.Vec3(276.668, 179.9912, 89.99998), pista3Spline_playa_angulos[223] = new pc.Vec3(276.6635, 180.0791, 89.99997), pista3Spline_playa_angulos[224] = new pc.Vec3(276.6327, 180.136, 90.00016), pista3Spline_playa_angulos[225] = new pc.Vec3(276.5657, 180.1729, 89.99987), pista3Spline_playa_angulos[226] = new pc.Vec3(276.4622, 180.1874, 90.00003), pista3Spline_playa_angulos[227] = new pc.Vec3(276.3232, 180.1792, 90.00012), pista3Spline_playa_angulos[228] = new pc.Vec3(276.1671, 180.1537, 89.99999), pista3Spline_playa_angulos[229] = new pc.Vec3(276.1184, 180.1528, 90.00004), pista3Spline_playa_angulos[230] = new pc.Vec3(276.0056, 180.1558, 90.00001), pista3Spline_playa_angulos[231] = new pc.Vec3(275.822, 180.1616, 89.99998), pista3Spline_playa_angulos[232] = new pc.Vec3(275.5686, 180.1682, 89.99994), pista3Spline_playa_angulos[233] = new pc.Vec3(275.2449, 180.1789, 90.00012), pista3Spline_playa_angulos[234] = new pc.Vec3(275.038, 180.1935, 89.99999), pista3Spline_playa_angulos[235] = new pc.Vec3(274.9157, 180.206, 89.99992), pista3Spline_playa_angulos[236] = new pc.Vec3(274.6549, 180.2144, 90.00014), pista3Spline_playa_angulos[237] = new pc.Vec3(274.2557, 180.2146, 89.99981), pista3Spline_playa_angulos[238] = new pc.Vec3(273.7178, 180.2086, 89.99987), pista3Spline_playa_angulos[239] = new pc.Vec3(273.0416, 180.1967, 89.99995), pista3Spline_playa_angulos[240] = new pc.Vec3(272.2405, 180.2017, 89.99998), pista3Spline_playa_angulos[241] = new pc.Vec3(271.5811, 180.204, 89.99975), pista3Spline_playa_angulos[242] = new pc.Vec3(271.1053, 180.1933, 90.00013), pista3Spline_playa_angulos[243] = new pc.Vec3(270.812, 180.1717, 89.99922), pista3Spline_playa_angulos[244] = new pc.Vec3(270.7017, 180.1361, 90.00125), pista3Spline_playa_angulos[245] = new pc.Vec3(270.6249, 180.0831, 89.99992), pista3Spline_playa_angulos[246] = new pc.Vec3(270.1845, 180.019, 90.00368), pista3Spline_playa_angulos[247] = new pc.Vec3(270, 270.0172, 0), pista3Spline_playa_angulos[248] = new pc.Vec3(270.1187, 359.9806, 270.0008), pista3Spline_playa_angulos[249] = new pc.Vec3(270.1371, 359.9779, 270.0007), pista3Spline_playa_angulos[250] = new pc.Vec3(270.0839, 270.0685, 0), pista3Spline_playa_angulos[251] = new pc.Vec3(270.0839, 270.0685, 0);
var conexionpista_inicial0 = [],
    vientopista_inicial0 = [];
vientopista_inicial0[0] = 25, vientopista_inicial0[1] = 124;
var pista_inicial0Spline = [];
pista_inicial0Spline[0] = new pc.Vec3(0, 0, 0), pista_inicial0Spline[1] = new pc.Vec3(-142511e-10, .002331357, -2428306e-12), pista_inicial0Spline[2] = new pc.Vec3(4678406e-11, .002331834, -.4932885), pista_inicial0Spline[3] = new pc.Vec3(-7528625e-11, .002333026, -.9865442), pista_inicial0Spline[4] = new pc.Vec3(4678406e-11, .002333503, -1.47983), pista_inicial0Spline[5] = new pc.Vec3(-7528625e-11, .002334695, -1.973086), pista_inicial0Spline[6] = new pc.Vec3(-142511e-10, .00233541, -2.466341), pista_inicial0Spline[7] = new pc.Vec3(.0001078192, .002336364, -2.959628), pista_inicial0Spline[8] = new pc.Vec3(.0001078192, .002337079, -3.452914), pista_inicial0Spline[9] = new pc.Vec3(4678406e-11, .002338748, -3.946169), pista_inicial0Spline[10] = new pc.Vec3(.0001688544, .002339701, -4.439425), pista_inicial0Spline[11] = new pc.Vec3(.0001078192, .002341132, -4.932711), pista_inicial0Spline[12] = new pc.Vec3(.0001078192, .002342324, -5.425967), pista_inicial0Spline[13] = new pc.Vec3(.0001688544, .002343755, -5.919253), pista_inicial0Spline[14] = new pc.Vec3(.0001688544, .002345185, -6.412508), pista_inicial0Spline[15] = new pc.Vec3(.0001688544, .002346854, -6.905764), pista_inicial0Spline[16] = new pc.Vec3(4678406e-11, .002348523, -7.39905), pista_inicial0Spline[17] = new pc.Vec3(.0001688544, .002350192, -7.892306), pista_inicial0Spline[18] = new pc.Vec3(.0001688544, .002352576, -8.385592), pista_inicial0Spline[19] = new pc.Vec3(4678406e-11, .002354483, -8.878878), pista_inicial0Spline[20] = new pc.Vec3(4678406e-11, .002356868, -9.372103), pista_inicial0Spline[21] = new pc.Vec3(4678406e-11, .002359252, -9.865389), pista_inicial0Spline[22] = new pc.Vec3(.0001688544, .002361636, -10.35868), pista_inicial0Spline[23] = new pc.Vec3(.0001078192, .002364497, -10.85193), pista_inicial0Spline[24] = new pc.Vec3(.0001078192, .002367358, -11.34522), pista_inicial0Spline[25] = new pc.Vec3(.0001078192, .002370696, -11.83847), pista_inicial0Spline[26] = new pc.Vec3(.0001078192, .002373795, -12.33173), pista_inicial0Spline[27] = new pc.Vec3(.0001688544, .00237761, -12.82501), pista_inicial0Spline[28] = new pc.Vec3(.0001688544, .002381663, -13.3183), pista_inicial0Spline[29] = new pc.Vec3(.0001688544, .002386193, -13.81156), pista_inicial0Spline[30] = new pc.Vec3(.0001078192, .002391438, -14.30481), pista_inicial0Spline[31] = new pc.Vec3(.0001688544, .002397876, -14.7981), pista_inicial0Spline[32] = new pc.Vec3(.0001688544, .002405743, -15.29135), pista_inicial0Spline[33] = new pc.Vec3(.0002298895, .002417426, -15.78464), pista_inicial0Spline[34] = new pc.Vec3(.0002298895, .002436261, -16.27793), pista_inicial0Spline[35] = new pc.Vec3(.0001688544, .002469163, -16.77118), pista_inicial0Spline[36] = new pc.Vec3(.0002298895, .002496104, -17.26444), pista_inicial0Spline[37] = new pc.Vec3(.0002298895, .002516131, -17.75772), pista_inicial0Spline[38] = new pc.Vec3(.0002298895, .002536635, -18.25098), pista_inicial0Spline[39] = new pc.Vec3(.0002909247, .002559285, -18.74427), pista_inicial0Spline[40] = new pc.Vec3(.0001688544, .002582412, -19.23752), pista_inicial0Spline[41] = new pc.Vec3(.0002298895, .002606015, -19.73078), pista_inicial0Spline[42] = new pc.Vec3(.0002298895, .002629857, -20.22406), pista_inicial0Spline[43] = new pc.Vec3(.0002298895, .002653937, -20.71732), pista_inicial0Spline[44] = new pc.Vec3(.0001688544, .002751212, -21.20445), pista_inicial0Spline[45] = new pc.Vec3(.0002298895, .002781729, -21.69771), pista_inicial0Spline[46] = new pc.Vec3(.0001688544, .002795081, -22.191), pista_inicial0Spline[47] = new pc.Vec3(.0002298895, .002804618, -22.68428), pista_inicial0Spline[48] = new pc.Vec3(.0002298895, .002812247, -23.17751), pista_inicial0Spline[49] = new pc.Vec3(.0002298895, .002818446, -23.67079), pista_inicial0Spline[50] = new pc.Vec3(.0002298895, .00282393, -24.16408), pista_inicial0Spline[51] = new pc.Vec3(.0002298895, .002828698, -24.65734), pista_inicial0Spline[52] = new pc.Vec3(.0001688544, .002833466, -25.15062), pista_inicial0Spline[53] = new pc.Vec3(.0002298895, .002837996, -25.64388), pista_inicial0Spline[54] = new pc.Vec3(.0002298895, .002842288, -26.13713), pista_inicial0Spline[55] = new pc.Vec3(.0002298895, .002846341, -26.63042), pista_inicial0Spline[56] = new pc.Vec3(.0002298895, .002849679, -27.1237), pista_inicial0Spline[57] = new pc.Vec3(.0002298895, .002853732, -27.61696), pista_inicial0Spline[58] = new pc.Vec3(.0002298895, .002857547, -28.11022), pista_inicial0Spline[59] = new pc.Vec3(.0002909247, .002860408, -28.6035), pista_inicial0Spline[60] = new pc.Vec3(.0003519598, .002864222, -29.09676), pista_inicial0Spline[61] = new pc.Vec3(.0002909247, .002867083, -29.59004), pista_inicial0Spline[62] = new pc.Vec3(.0002909247, .002870183, -30.08333), pista_inicial0Spline[63] = new pc.Vec3(.0002909247, .002873282, -30.57659), pista_inicial0Spline[64] = new pc.Vec3(.0002909247, .002876143, -31.06984), pista_inicial0Spline[65] = new pc.Vec3(.0003519598, .002879481, -31.56313), pista_inicial0Spline[66] = new pc.Vec3(.0003519598, .002882104, -32.05639), pista_inicial0Spline[67] = new pc.Vec3(.0003519598, .002885203, -32.54967), pista_inicial0Spline[68] = new pc.Vec3(.0003519598, .002887826, -33.04293), pista_inicial0Spline[69] = new pc.Vec3(.0003519598, .002890448, -33.53618), pista_inicial0Spline[70] = new pc.Vec3(.0003519598, .002893071, -34.02947), pista_inicial0Spline[71] = new pc.Vec3(.0003519598, .002895694, -34.52272), pista_inicial0Spline[72] = new pc.Vec3(412995e-9, .002898078, -35.01601), pista_inicial0Spline[73] = new pc.Vec3(.0003519598, .002900939, -35.5093), pista_inicial0Spline[74] = new pc.Vec3(.0003519598, .002903085, -36.00252), pista_inicial0Spline[75] = new pc.Vec3(.0003519598, .002905469, -36.49581), pista_inicial0Spline[76] = new pc.Vec3(.0003519598, .002907853, -36.98909), pista_inicial0Spline[77] = new pc.Vec3(.0003519598, .002910237, -37.48235), pista_inicial0Spline[78] = new pc.Vec3(.0003519598, .002912383, -37.97564), pista_inicial0Spline[79] = new pc.Vec3(.0003519598, .002914529, -38.46889), pista_inicial0Spline[80] = new pc.Vec3(.0003519598, .002916674, -38.96215), pista_inicial0Spline[81] = new pc.Vec3(412995e-9, .00291882, -39.45543), pista_inicial0Spline[82] = new pc.Vec3(412995e-9, .002921204, -39.94872), pista_inicial0Spline[83] = new pc.Vec3(412995e-9, .002923112, -40.44197), pista_inicial0Spline[84] = new pc.Vec3(412995e-9, .002925019, -40.93523), pista_inicial0Spline[85] = new pc.Vec3(412995e-9, .002926926, -41.42852), pista_inicial0Spline[86] = new pc.Vec3(412995e-9, .002929072, -41.92177), pista_inicial0Spline[87] = new pc.Vec3(.0005350653, .002963404, -42.49475);
var pista_inicial0Spline_angulos = [];
pista_inicial0Spline_angulos[0] = new pc.Vec3(0, 0, 0), pista_inicial0Spline_angulos[1] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[2] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[3] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[4] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[5] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[6] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[7] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[8] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[9] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[10] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[11] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[12] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[13] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[14] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[15] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[16] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[17] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[18] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[19] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[20] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[21] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[22] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[23] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[24] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[25] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[26] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[27] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[28] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[29] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[30] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[31] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[32] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[33] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[34] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[35] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[36] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[37] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[38] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[39] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[40] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[41] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[42] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[43] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[44] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[45] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[46] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[47] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[48] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[49] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[50] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[51] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[52] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[53] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[54] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[55] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[56] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[57] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[58] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[59] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[60] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[61] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[62] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[63] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[64] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[65] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[66] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[67] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[68] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[69] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[70] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[71] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[72] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[73] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[74] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[75] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[76] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[77] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[78] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[79] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[80] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[81] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[82] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[83] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[84] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[85] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[86] = new pc.Vec3(270.2625, 359.8838, 270), pista_inicial0Spline_angulos[87] = new pc.Vec3(270.2625, 359.8838, 270);
var conexionPista4 = [],
    vientoPista4 = [];
vientoPista4[0] = 25, vientoPista4[1] = 124;
var pista4Spline_playa = [];
pista4Spline_playa[0] = new pc.Vec3(0, 0, 0), pista4Spline_playa[1] = new pc.Vec3(.009974885, .04876013, -.5981956), pista4Spline_playa[2] = new pc.Vec3(.01839777, .09025814, -1.196654), pista4Spline_playa[3] = new pc.Vec3(.02615355, .1289944, -1.79536), pista4Spline_playa[4] = new pc.Vec3(.03406352, .16658, -2.394157), pista4Spline_playa[5] = new pc.Vec3(.04304031, .2046213, -2.992867), pista4Spline_playa[6] = new pc.Vec3(.05946125, .2425075, -3.591396), pista4Spline_playa[7] = new pc.Vec3(.08668242, .2786108, -4.189664), pista4Spline_playa[8] = new pc.Vec3(.1173825, .3137223, -4.787873), pista4Spline_playa[9] = new pc.Vec3(.1545179, .3457679, -5.385831), pista4Spline_playa[10] = new pc.Vec3(.1997375, .3726412, -5.983526), pista4Spline_playa[11] = new pc.Vec3(.2553541, .3921297, -6.580605), pista4Spline_playa[12] = new pc.Vec3(.3210901, .4027871, -7.17691), pista4Spline_playa[13] = new pc.Vec3(.3948082, .4058074, -7.772342), pista4Spline_playa[14] = new pc.Vec3(.4773878, .4030575, -8.366624), pista4Spline_playa[15] = new pc.Vec3(.5698598, .3964808, -8.959401), pista4Spline_playa[16] = new pc.Vec3(.6729832, .3879814, -9.550369), pista4Spline_playa[17] = new pc.Vec3(.7847483, .3788204, -10.13983), pista4Spline_playa[18] = new pc.Vec3(.8918262, .3667492, -10.73006), pista4Spline_playa[19] = new pc.Vec3(.9998153, .3515311, -11.32003), pista4Spline_playa[20] = new pc.Vec3(1.124625, .3347684, -11.90665), pista4Spline_playa[21] = new pc.Vec3(1.281312, .3178532, -12.48543), pista4Spline_playa[22] = new pc.Vec3(1.48629, .3024889, -13.04886), pista4Spline_playa[23] = new pc.Vec3(1.747861, .2894205, -13.58843), pista4Spline_playa[24] = new pc.Vec3(2.053124, .277481, -14.10463), pista4Spline_playa[25] = new pc.Vec3(2.392462, .2663795, -14.59923), pista4Spline_playa[26] = new pc.Vec3(2.759556, .2559465, -15.07364), pista4Spline_playa[27] = new pc.Vec3(3.149036, .246009, -15.52981), pista4Spline_playa[28] = new pc.Vec3(3.557028, .2364084, -15.96965), pista4Spline_playa[29] = new pc.Vec3(3.985991, .2271839, -16.3889), pista4Spline_playa[30] = new pc.Vec3(4.437449, .2184383, -16.78393), pista4Spline_playa[31] = new pc.Vec3(4.90687, .2102796, -17.15753), pista4Spline_playa[32] = new pc.Vec3(5.390668, .2027475, -17.51227), pista4Spline_playa[33] = new pc.Vec3(5.885695, .1959478, -17.85114), pista4Spline_playa[34] = new pc.Vec3(6.38979, .1899277, -18.17643), pista4Spline_playa[35] = new pc.Vec3(6.904215, .1847249, -18.48526), pista4Spline_playa[36] = new pc.Vec3(7.428736, .1802379, -18.7764), pista4Spline_playa[37] = new pc.Vec3(7.962093, .1764232, -19.05118), pista4Spline_playa[38] = new pc.Vec3(8.503201, .173236, -19.31035), pista4Spline_playa[39] = new pc.Vec3(9.051395, .1706706, -19.55424), pista4Spline_playa[40] = new pc.Vec3(9.606562, .168789, -19.78164), pista4Spline_playa[41] = new pc.Vec3(10.17008, .1679212, -19.98748), pista4Spline_playa[42] = new pc.Vec3(10.74097, .1679593, -20.1722), pista4Spline_playa[43] = new pc.Vec3(11.31688, .1685487, -20.34035), pista4Spline_playa[44] = new pc.Vec3(11.89604, .1693307, -20.49723), pista4Spline_playa[45] = new pc.Vec3(12.47656, .1699182, -20.64845), pista4Spline_playa[46] = new pc.Vec3(13.05762, .1702901, -20.79837), pista4Spline_playa[47] = new pc.Vec3(13.63926, .1707498, -20.94567), pista4Spline_playa[48] = new pc.Vec3(14.22256, .1712819, -21.08633), pista4Spline_playa[49] = new pc.Vec3(14.80827, .1718179, -21.21631), pista4Spline_playa[50] = new pc.Vec3(15.39715, .1723014, -21.33129), pista4Spline_playa[51] = new pc.Vec3(15.98953, .1726695, -21.42631), pista4Spline_playa[52] = new pc.Vec3(16.58575, .1728774, -21.49323), pista4Spline_playa[53] = new pc.Vec3(17.18456, .1729461, -21.52909), pista4Spline_playa[54] = new pc.Vec3(17.78436, .1729289, -21.54305), pista4Spline_playa[55] = new pc.Vec3(18.38436, .1728622, -21.54605), pista4Spline_playa[56] = new pc.Vec3(18.98437, .1727954, -21.5494), pista4Spline_playa[57] = new pc.Vec3(19.58417, .1727782, -21.56523), pista4Spline_playa[58] = new pc.Vec3(20.18374, .1728011, -21.58726), pista4Spline_playa[59] = new pc.Vec3(20.78361, .172803, -21.59987), pista4Spline_playa[60] = new pc.Vec3(21.38351, .1728069, -21.61107), pista4Spline_playa[61] = new pc.Vec3(21.98306, .1728355, -21.63168), pista4Spline_playa[62] = new pc.Vec3(22.58163, .1729251, -21.6729), pista4Spline_playa[63] = new pc.Vec3(23.17666, .1731216, -21.74847), pista4Spline_playa[64] = new pc.Vec3(23.76391, .1732246, -21.87104), pista4Spline_playa[65] = new pc.Vec3(24.34122, .1725494, -22.03403), pista4Spline_playa[66] = new pc.Vec3(24.90748, .1714889, -22.23203), pista4Spline_playa[67] = new pc.Vec3(25.46049, .1709911, -22.46473), pista4Spline_playa[68] = new pc.Vec3(25.99846, .1719581, -22.73016), pista4Spline_playa[69] = new pc.Vec3(26.52099, .1752788, -23.02487), pista4Spline_playa[70] = new pc.Vec3(27.0267, .18143, -23.34753), pista4Spline_playa[71] = new pc.Vec3(27.51406, .1897918, -23.6973), pista4Spline_playa[72] = new pc.Vec3(27.98363, .1996738, -24.07059), pista4Spline_playa[73] = new pc.Vec3(28.43568, .2105895, -24.46491), pista4Spline_playa[74] = new pc.Vec3(28.86967, .2220794, -24.87901), pista4Spline_playa[75] = new pc.Vec3(29.2841, .2335845, -25.31258), pista4Spline_playa[76] = new pc.Vec3(29.67667, .2457553, -25.76607), pista4Spline_playa[77] = new pc.Vec3(30.0453, .2595874, -26.2392), pista4Spline_playa[78] = new pc.Vec3(30.38936, .2741195, -26.73044), pista4Spline_playa[79] = new pc.Vec3(30.70862, .2880527, -27.23824), pista4Spline_playa[80] = new pc.Vec3(31.00316, .3000919, -27.76071), pista4Spline_playa[81] = new pc.Vec3(31.27372, .3090068, -28.29613), pista4Spline_playa[82] = new pc.Vec3(31.51925, .3147365, -28.84352), pista4Spline_playa[83] = new pc.Vec3(31.73944, .318307, -29.4016), pista4Spline_playa[84] = new pc.Vec3(31.93606, .3200122, -29.96844), pista4Spline_playa[85] = new pc.Vec3(32.11092, .3200542, -30.54231), pista4Spline_playa[86] = new pc.Vec3(32.26505, .3185817, -31.12218), pista4Spline_playa[87] = new pc.Vec3(32.39922, .3157588, -31.70695), pista4Spline_playa[88] = new pc.Vec3(32.5103, .311185, -32.29652), pista4Spline_playa[89] = new pc.Vec3(32.59577, .3044635, -32.8903), pista4Spline_playa[90] = new pc.Vec3(32.65969, .2961475, -33.48679), pista4Spline_playa[91] = new pc.Vec3(32.70634, .2868358, -34.08494), pista4Spline_playa[92] = new pc.Vec3(32.73901, .2770015, -34.68393), pista4Spline_playa[93] = new pc.Vec3(32.76067, .2672092, -35.28341), pista4Spline_playa[94] = new pc.Vec3(32.77317, .2577754, -35.88322), pista4Spline_playa[95] = new pc.Vec3(32.77318, .2479373, -36.4831), pista4Spline_playa[96] = new pc.Vec3(32.75642, .2375385, -37.08282), pista4Spline_playa[97] = new pc.Vec3(32.72136, .2271014, -37.68166), pista4Spline_playa[98] = new pc.Vec3(32.66776, .2171108, -38.27913), pista4Spline_playa[99] = new pc.Vec3(32.59577, .2081577, -38.87473), pista4Spline_playa[100] = new pc.Vec3(32.50808, .2001354, -39.46823), pista4Spline_playa[101] = new pc.Vec3(32.40585, .192609, -40.05935), pista4Spline_playa[102] = new pc.Vec3(32.28844, .1856548, -40.64773), pista4Spline_playa[103] = new pc.Vec3(32.15458, .1793491, -41.23253), pista4Spline_playa[104] = new pc.Vec3(32.00261, .1738483, -41.81289), pista4Spline_playa[105] = new pc.Vec3(31.82926, .1693317, -42.38725), pista4Spline_playa[106] = new pc.Vec3(31.63385, .1660625, -42.95451), pista4Spline_playa[107] = new pc.Vec3(31.41789, .1640064, -43.51425), pista4Spline_playa[108] = new pc.Vec3(31.18181, .1628963, -44.06581), pista4Spline_playa[109] = new pc.Vec3(30.92604, .1624271, -44.60856), pista4Spline_playa[110] = new pc.Vec3(30.65134, .1623203, -45.14193), pista4Spline_playa[111] = new pc.Vec3(30.35868, .162347, -45.66572), pista4Spline_playa[112] = new pc.Vec3(30.05183, .1628619, -46.18122), pista4Spline_playa[113] = new pc.Vec3(29.72853, .1639377, -46.68674), pista4Spline_playa[114] = new pc.Vec3(29.38554, .1653186, -47.17893), pista4Spline_playa[115] = new pc.Vec3(29.01988, .166793, -47.65457), pista4Spline_playa[116] = new pc.Vec3(28.63042, .1681072, -48.11085), pista4Spline_playa[117] = new pc.Vec3(28.21759, .1693355, -48.54621), pista4Spline_playa[118] = new pc.Vec3(27.78581, .1707507, -48.96276), pista4Spline_playa[119] = new pc.Vec3(27.33872, .1722194, -49.36284), pista4Spline_playa[120] = new pc.Vec3(26.87871, .1735622, -49.748), pista4Spline_playa[121] = new pc.Vec3(26.40697, .1746074, -50.1187), pista4Spline_playa[122] = new pc.Vec3(25.92411, .1751605, -50.47484), pista4Spline_playa[123] = new pc.Vec3(25.43011, .1749622, -50.81533), pista4Spline_playa[124] = new pc.Vec3(24.92488, .1738483, -51.13884), pista4Spline_playa[125] = new pc.Vec3(24.40823, .1720554, -51.44387), pista4Spline_playa[126] = new pc.Vec3(23.88058, .1699458, -51.7295), pista4Spline_playa[127] = new pc.Vec3(23.34256, .1678706, -51.99502), pista4Spline_playa[128] = new pc.Vec3(22.79515, .1662055, -52.24054), pista4Spline_playa[129] = new pc.Vec3(22.23953, .1650478, -52.46691), pista4Spline_playa[130] = new pc.Vec3(21.67729, .163911, -52.67625), pista4Spline_playa[131] = new pc.Vec3(21.10908, .1627742, -52.86896), pista4Spline_playa[132] = new pc.Vec3(20.53522, .1619197, -53.0441), pista4Spline_playa[133] = new pc.Vec3(19.95572, .1615878, -53.19954), pista4Spline_playa[134] = new pc.Vec3(19.37063, .1620914, -53.33196), pista4Spline_playa[135] = new pc.Vec3(18.77983, .1637908, -53.43644), pista4Spline_playa[136] = new pc.Vec3(18.18513, .1664935, -53.51551), pista4Spline_playa[137] = new pc.Vec3(17.58756, .1700412, -53.56892), pista4Spline_playa[138] = new pc.Vec3(16.98795, .1747218, -53.58789), pista4Spline_playa[139] = new pc.Vec3(16.38847, .1807414, -53.56667), pista4Spline_playa[140] = new pc.Vec3(15.79202, .1881267, -53.50372), pista4Spline_playa[141] = new pc.Vec3(15.20123, .1968585, -53.40005), pista4Spline_playa[142] = new pc.Vec3(14.61834, .206853, -53.25841), pista4Spline_playa[143] = new pc.Vec3(14.04353, .2177898, -53.08701), pista4Spline_playa[144] = new pc.Vec3(13.47581, .2293788, -52.89323), pista4Spline_playa[145] = new pc.Vec3(12.91439, .2414666, -52.6819), pista4Spline_playa[146] = new pc.Vec3(12.35844, .2538577, -52.4565), pista4Spline_playa[147] = new pc.Vec3(11.80693, .2664205, -52.22055), pista4Spline_playa[148] = new pc.Vec3(11.26195, .2792884, -51.97006), pista4Spline_playa[149] = new pc.Vec3(10.72651, .2925483, -51.69974), pista4Spline_playa[150] = new pc.Vec3(10.19962, .3061343, -51.41305), pista4Spline_playa[151] = new pc.Vec3(9.678922, .3199636, -51.11523), pista4Spline_playa[152] = new pc.Vec3(9.162365, .3339826, -50.81026), pista4Spline_playa[153] = new pc.Vec3(8.647741, .3480874, -50.50209), pista4Spline_playa[154] = new pc.Vec3(8.131515, .3622533, -50.19675), pista4Spline_playa[155] = new pc.Vec3(7.620893, .3769428, -49.88201), pista4Spline_playa[156] = new pc.Vec3(7.111099, .391678, -49.56591), pista4Spline_playa[157] = new pc.Vec3(6.601664, .4064466, -49.2493), pista4Spline_playa[158] = new pc.Vec3(6.092377, .4212409, -48.93246), pista4Spline_playa[159] = new pc.Vec3(5.583093, .4360505, -48.6157), pista4Spline_playa[160] = new pc.Vec3(5.073299, .4509364, -48.29958), pista4Spline_playa[161] = new pc.Vec3(4.563684, .46622, -47.98317), pista4Spline_playa[162] = new pc.Vec3(4.055704, .4815165, -47.66427), pista4Spline_playa[163] = new pc.Vec3(3.546359, .4969679, -47.3475), pista4Spline_playa[164] = new pc.Vec3(3.033334, .5127164, -47.03684), pista4Spline_playa[165] = new pc.Vec3(2.514206, .5288473, -46.73643), pista4Spline_playa[166] = new pc.Vec3(1.986464, .5454932, -46.45132), pista4Spline_playa[167] = new pc.Vec3(1.451881, .5623854, -46.17959), pista4Spline_playa[168] = new pc.Vec3(.9125762, .5792445, -45.91714), pista4Spline_playa[169] = new pc.Vec3(.3679787, .5964955, -45.66611), pista4Spline_playa[170] = new pc.Vec3(-.1828124, .6145703, -45.42888), pista4Spline_playa[171] = new pc.Vec3(-.7404536, .6338736, -45.20824), pista4Spline_playa[172] = new pc.Vec3(-1.305525, .6549278, -45.00753), pista4Spline_playa[173] = new pc.Vec3(-1.876414, .6785663, -44.82475), pista4Spline_playa[174] = new pc.Vec3(-2.452351, .7044958, -44.65848), pista4Spline_playa[175] = new pc.Vec3(-3.033901, .7316805, -44.51335), pista4Spline_playa[176] = new pc.Vec3(-3.621071, .7589761, -44.39354), pista4Spline_playa[177] = new pc.Vec3(-4.213503, .7851988, -44.30249), pista4Spline_playa[178] = new pc.Vec3(-4.809906, .8095366, -44.24233), pista4Spline_playa[179] = new pc.Vec3(-5.408602, .8328103, -44.21146), pista4Spline_playa[180] = new pc.Vec3(-6.008148, .8553909, -44.20642), pista4Spline_playa[181] = new pc.Vec3(-6.607406, .8771065, -44.22482), pista4Spline_playa[182] = new pc.Vec3(-7.205662, .897844, -44.2651), pista4Spline_playa[183] = new pc.Vec3(-7.802179, .9174463, -44.32626), pista4Spline_playa[184] = new pc.Vec3(-8.396315, .9357992, -44.40782), pista4Spline_playa[185] = new pc.Vec3(-8.987255, .9530364, -44.50987), pista4Spline_playa[186] = new pc.Vec3(-9.574286, .9691516, -44.63279), pista4Spline_playa[187] = new pc.Vec3(-10.15645, .9840585, -44.77715), pista4Spline_playa[188] = new pc.Vec3(-10.73276, .9976531, -44.94345), pista4Spline_playa[189] = new pc.Vec3(-11.30195, 1.009802, -45.1325), pista4Spline_playa[190] = new pc.Vec3(-11.86326, 1.020496, -45.34429), pista4Spline_playa[191] = new pc.Vec3(-12.41621, 1.029866, -45.57671), pista4Spline_playa[192] = new pc.Vec3(-12.96054, 1.037925, -45.82898), pista4Spline_playa[193] = new pc.Vec3(-13.49514, 1.04459, -46.10131), pista4Spline_playa[194] = new pc.Vec3(-14.01864, 1.04974, -46.39432), pista4Spline_playa[195] = new pc.Vec3(-14.52935, 1.053225, -46.7091), pista4Spline_playa[196] = new pc.Vec3(-15.0246, 1.054987, -47.04777), pista4Spline_playa[197] = new pc.Vec3(-15.50195, 1.055297, -47.41122), pista4Spline_playa[198] = new pc.Vec3(-15.96203, 1.054073, -47.79625), pista4Spline_playa[199] = new pc.Vec3(-16.4062, 1.051011, -48.19948), pista4Spline_playa[200] = new pc.Vec3(-16.83624, 1.045834, -48.61784), pista4Spline_playa[201] = new pc.Vec3(-17.25386, 1.038203, -49.04855), pista4Spline_playa[202] = new pc.Vec3(-17.65987, 1.027912, -49.49018), pista4Spline_playa[203] = new pc.Vec3(-18.05245, 1.015179, -49.94363), pista4Spline_playa[204] = new pc.Vec3(-18.43025, 1.000129, -50.40954), pista4Spline_playa[205] = new pc.Vec3(-18.79177, .9828359, -50.88804), pista4Spline_playa[206] = new pc.Vec3(-19.13547, .963298, -51.37939), pista4Spline_playa[207] = new pc.Vec3(-19.45907, .941497, -51.88411), pista4Spline_playa[208] = new pc.Vec3(-19.76056, .9173061, -52.4023), pista4Spline_playa[209] = new pc.Vec3(-20.04001, .890546, -52.93251), pista4Spline_playa[210] = new pc.Vec3(-20.29726, .8615409, -53.47372), pista4Spline_playa[211] = new pc.Vec3(-20.53202, .8303558, -54.02497), pista4Spline_playa[212] = new pc.Vec3(-20.74388, .7971507, -54.58527), pista4Spline_playa[213] = new pc.Vec3(-20.9327, .7621623, -55.15368), pista4Spline_playa[214] = new pc.Vec3(-21.09336, .7245952, -55.73053), pista4Spline_playa[215] = new pc.Vec3(-21.22524, .6843044, -56.31436), pista4Spline_playa[216] = new pc.Vec3(-21.33395, .6424857, -56.90293), pista4Spline_playa[217] = new pc.Vec3(-21.42583, .6002933, -57.49433), pista4Spline_playa[218] = new pc.Vec3(-21.50656, .5588714, -58.08746), pista4Spline_playa[219] = new pc.Vec3(-21.57907, .5183059, -58.68165), pista4Spline_playa[220] = new pc.Vec3(-21.63692, .4774181, -59.27743), pista4Spline_playa[221] = new pc.Vec3(-21.68155, .4362212, -59.87437), pista4Spline_playa[222] = new pc.Vec3(-21.71688, .3957263, -60.47197), pista4Spline_playa[223] = new pc.Vec3(-21.74631, .3567458, -61.06993), pista4Spline_playa[224] = new pc.Vec3(-21.77367, .3198825, -61.66819), pista4Spline_playa[225] = new pc.Vec3(-21.79478, .2891418, -62.26702), pista4Spline_playa[226] = new pc.Vec3(-21.81076, .26114, -62.86612), pista4Spline_playa[227] = new pc.Vec3(-21.82653, .232999, -63.46523), pista4Spline_playa[228] = new pc.Vec3(-21.84146, .2056476, -64.06444), pista4Spline_playa[229] = new pc.Vec3(-21.85456, .1800052, -64.66373), pista4Spline_playa[230] = new pc.Vec3(-21.86519, .1570064, -65.26321), pista4Spline_playa[231] = new pc.Vec3(-21.8725, .1375152, -65.86285), pista4Spline_playa[232] = new pc.Vec3(-21.87642, .1214648, -66.46262), pista4Spline_playa[233] = new pc.Vec3(-21.87777, .1079608, -67.06248), pista4Spline_playa[234] = new pc.Vec3(-21.87754, .09608757, -67.66232), pista4Spline_playa[235] = new pc.Vec3(-21.87667, .08492577, -68.26225), pista4Spline_playa[236] = new pc.Vec3(-21.87623, .07355797, -68.86214), pista4Spline_playa[237] = new pc.Vec3(-21.87672, .06158745, -69.46202), pista4Spline_playa[238] = new pc.Vec3(-21.87703, .05051148, -70.0619), pista4Spline_playa[239] = new pc.Vec3(-21.87718, .03998864, -70.66184), pista4Spline_playa[240] = new pc.Vec3(-21.87717, .02944863, -71.26175), pista4Spline_playa[241] = new pc.Vec3(-21.87715, .01833451, -71.8616), pista4Spline_playa[242] = new pc.Vec3(-21.87721, .003005147, -72.61523);
var pista4Spline_playa_angulos = [];
pista4Spline_playa_angulos[0] = new pc.Vec3(0, 0, 0), pista4Spline_playa_angulos[1] = new pc.Vec3(274.1525, 359.1375, 270), pista4Spline_playa_angulos[2] = new pc.Vec3(273.8093, 359.2344, 270), pista4Spline_playa_angulos[3] = new pc.Vec3(273.6225, 359.253, 269.9996), pista4Spline_playa_angulos[4] = new pc.Vec3(273.5888, 359.1986, 269.9998), pista4Spline_playa_angulos[5] = new pc.Vec3(273.7105, 359.0719, 269.9998), pista4Spline_playa_angulos[6] = new pc.Vec3(273.3423, 357.3301, 269.9999), pista4Spline_playa_angulos[7] = new pc.Vec3(273.4503, 357.2997, 269.9999), pista4Spline_playa_angulos[8] = new pc.Vec3(273.2353, 356.7814, 269.9998), pista4Spline_playa_angulos[9] = new pc.Vec3(272.8485, 356.0948, 269.9998), pista4Spline_playa_angulos[10] = new pc.Vec3(272.2517, 355.2031, 269.9998), pista4Spline_playa_angulos[11] = new pc.Vec3(271.4467, 354.166, 269.9998), pista4Spline_playa_angulos[12] = new pc.Vec3(270.6281, 353.3328, 269.9996), pista4Spline_playa_angulos[13] = new pc.Vec3(270, 262.5133, 0), pista4Spline_playa_angulos[14] = new pc.Vec3(270.4756, 171.6339, 89.9999), pista4Spline_playa_angulos[15] = new pc.Vec3(270.746, 170.6343, 90.0002), pista4Spline_playa_angulos[16] = new pc.Vec3(270.8207, 169.4736, 90.00036), pista4Spline_playa_angulos[17] = new pc.Vec3(270.9699, 169.357, 90.00031), pista4Spline_playa_angulos[18] = new pc.Vec3(271.3329, 169.9613, 90.00022), pista4Spline_playa_angulos[19] = new pc.Vec3(271.5466, 169.0179, 90.00019), pista4Spline_playa_angulos[20] = new pc.Vec3(271.6287, 166.6467, 90.00006), pista4Spline_playa_angulos[21] = new pc.Vec3(271.5727, 162.7474, 90.00028), pista4Spline_playa_angulos[22] = new pc.Vec3(271.3484, 157.0889, 90.00011), pista4Spline_playa_angulos[23] = new pc.Vec3(271.177, 151.5414, 90.00029), pista4Spline_playa_angulos[24] = new pc.Vec3(271.0982, 147.3862, 89.99995), pista4Spline_playa_angulos[25] = new pc.Vec3(271.0262, 143.8015, 90), pista4Spline_playa_angulos[26] = new pc.Vec3(270.9675, 140.8205, 90.00005), pista4Spline_playa_angulos[27] = new pc.Vec3(270.9312, 138.2642, 90.00029), pista4Spline_playa_angulos[28] = new pc.Vec3(270.8998, 135.8376, 90.00035), pista4Spline_playa_angulos[29] = new pc.Vec3(270.8593, 132.6916, 90.00031), pista4Spline_playa_angulos[30] = new pc.Vec3(270.8077, 129.7777, 90.00009), pista4Spline_playa_angulos[31] = new pc.Vec3(270.7491, 127.316, 90.00021), pista4Spline_playa_angulos[32] = new pc.Vec3(270.6847, 125.2657, 90.00034), pista4Spline_playa_angulos[33] = new pc.Vec3(270.6129, 123.6282, 90.00018), pista4Spline_playa_angulos[34] = new pc.Vec3(270.5341, 121.9775, 89.99982), pista4Spline_playa_angulos[35] = new pc.Vec3(270.4597, 119.9541, 89.99974), pista4Spline_playa_angulos[36] = new pc.Vec3(270.3951, 118.1288, 89.99926), pista4Spline_playa_angulos[37] = new pc.Vec3(270.3334, 116.4092, 89.99978), pista4Spline_playa_angulos[38] = new pc.Vec3(270.2741, 114.781, 90.00047), pista4Spline_playa_angulos[39] = new pc.Vec3(270.2158, 113.2193, 90.00017), pista4Spline_playa_angulos[40] = new pc.Vec3(270.1356, 111.2366, 89.99995), pista4Spline_playa_angulos[41] = new pc.Vec3(270.028, 198.8879, 0), pista4Spline_playa_angulos[42] = new pc.Vec3(270.028, 197.0688, 0), pista4Spline_playa_angulos[43] = new pc.Vec3(270.0713, 195.706, 0), pista4Spline_playa_angulos[44] = new pc.Vec3(270.0713, 194.8452, 0), pista4Spline_playa_angulos[45] = new pc.Vec3(270.0396, 194.5205, 0), pista4Spline_playa_angulos[46] = new pc.Vec3(270.0198, 194.4218, 0), pista4Spline_playa_angulos[47] = new pc.Vec3(270.0485, 193.9823, 0), pista4Spline_playa_angulos[48] = new pc.Vec3(270.0396, 193.1395, 0), pista4Spline_playa_angulos[49] = new pc.Vec3(270.0443, 191.9074, 0), pista4Spline_playa_angulos[50] = new pc.Vec3(270.0198, 190.2124, 0), pista4Spline_playa_angulos[51] = new pc.Vec3(270.028, 187.9812, 0), pista4Spline_playa_angulos[52] = new pc.Vec3(270, 184.9025, 0), pista4Spline_playa_angulos[53] = new pc.Vec3(270, 182.2401, 0), pista4Spline_playa_angulos[54] = new pc.Vec3(270, 180.6508, 0), pista4Spline_playa_angulos[55] = new pc.Vec3(270, 180.1102, 0), pista4Spline_playa_angulos[56] = new pc.Vec3(270, 180.6627, 0), pista4Spline_playa_angulos[57] = new pc.Vec3(270, 182.1248, 0), pista4Spline_playa_angulos[58] = new pc.Vec3(270, 181.8276, 0), pista4Spline_playa_angulos[59] = new pc.Vec3(270, 181.0044, 0), pista4Spline_playa_angulos[60] = new pc.Vec3(270, 181.4029, 0), pista4Spline_playa_angulos[61] = new pc.Vec3(270, 182.8121, 0), pista4Spline_playa_angulos[62] = new pc.Vec3(270, 185.3672, 0), pista4Spline_playa_angulos[63] = new pc.Vec3(270, 189.55, 0), pista4Spline_playa_angulos[64] = new pc.Vec3(270, 194.0487, 0), pista4Spline_playa_angulos[65] = new pc.Vec3(270.0949, 197.378, 0), pista4Spline_playa_angulos[66] = new pc.Vec3(270.0816, 200.9676, 0), pista4Spline_playa_angulos[67] = new pc.Vec3(270, 204.5808, 0), pista4Spline_playa_angulos[68] = new pc.Vec3(270.1866, 297.9005, 269.9992), pista4Spline_playa_angulos[69] = new pc.Vec3(270.4485, 300.955, 270.0004), pista4Spline_playa_angulos[70] = new pc.Vec3(270.7036, 304.1309, 269.9997), pista4Spline_playa_angulos[71] = new pc.Vec3(270.8785, 307.1141, 270), pista4Spline_playa_angulos[72] = new pc.Vec3(270.9994, 309.8031, 270.0001), pista4Spline_playa_angulos[73] = new pc.Vec3(271.0772, 312.3762, 270.0003), pista4Spline_playa_angulos[74] = new pc.Vec3(271.1096, 314.9471, 269.9998), pista4Spline_playa_angulos[75] = new pc.Vec3(271.1032, 317.6686, 269.9996), pista4Spline_playa_angulos[76] = new pc.Vec3(271.2357, 320.597, 270), pista4Spline_playa_angulos[77] = new pc.Vec3(271.3712, 323.5404, 270), pista4Spline_playa_angulos[78] = new pc.Vec3(271.3794, 326.4242, 270), pista4Spline_playa_angulos[79] = new pc.Vec3(271.2607, 329.2434, 269.9996), pista4Spline_playa_angulos[80] = new pc.Vec3(271.0215, 331.9069, 269.9997), pista4Spline_playa_angulos[81] = new pc.Vec3(270.6921, 334.5118, 269.9992), pista4Spline_playa_angulos[82] = new pc.Vec3(270.4343, 337.182, 269.9989), pista4Spline_playa_angulos[83] = new pc.Vec3(270.2471, 339.7141, 269.9982), pista4Spline_playa_angulos[84] = new pc.Vec3(270.0791, 252.0594, 0), pista4Spline_playa_angulos[85] = new pc.Vec3(270.074, 254.0423, 0), pista4Spline_playa_angulos[86] = new pc.Vec3(270.2065, 166.1057, 90.00257), pista4Spline_playa_angulos[87] = new pc.Vec3(270.3392, 168.1096, 90.00058), pista4Spline_playa_angulos[88] = new pc.Vec3(270.5367, 170.5576, 90.00072), pista4Spline_playa_angulos[89] = new pc.Vec3(270.726, 172.9075, 90.00027), pista4Spline_playa_angulos[90] = new pc.Vec3(270.8479, 174.7554, 90.00058), pista4Spline_playa_angulos[91] = new pc.Vec3(270.9203, 176.2464, 90.00011), pista4Spline_playa_angulos[92] = new pc.Vec3(270.9442, 177.4331, 90.00026), pista4Spline_playa_angulos[93] = new pc.Vec3(270.9076, 178.3422, 90.00033), pista4Spline_playa_angulos[94] = new pc.Vec3(270.9035, 179.3014, 90.00076), pista4Spline_playa_angulos[95] = new pc.Vec3(270.9752, 180.757, 90.00105), pista4Spline_playa_angulos[96] = new pc.Vec3(271.0017, 182.4644, 89.99971), pista4Spline_playa_angulos[97] = new pc.Vec3(270.9836, 184.2298, 89.9999), pista4Spline_playa_angulos[98] = new pc.Vec3(270.9156, 186.0311, 90.0015), pista4Spline_playa_angulos[99] = new pc.Vec3(270.8026, 187.6913, 90.00146), pista4Spline_playa_angulos[100] = new pc.Vec3(270.7391, 189.1053, 90.00106), pista4Spline_playa_angulos[101] = new pc.Vec3(270.6913, 190.5441, 90), pista4Spline_playa_angulos[102] = new pc.Vec3(270.6367, 192.0486, 90.00154), pista4Spline_playa_angulos[103] = new pc.Vec3(270.5665, 193.7468, 89.99966), pista4Spline_playa_angulos[104] = new pc.Vec3(270.4818, 195.672, 89.9998), pista4Spline_playa_angulos[105] = new pc.Vec3(270.3733, 197.9004, 90.00365), pista4Spline_playa_angulos[106] = new pc.Vec3(270.2495, 200.0605, 90.00156), pista4Spline_playa_angulos[107] = new pc.Vec3(270.1426, 202.1358, 90.00737), pista4Spline_playa_angulos[108] = new pc.Vec3(270.0626, 294.1345, 0), pista4Spline_playa_angulos[109] = new pc.Vec3(270, 296.2217, 0), pista4Spline_playa_angulos[110] = new pc.Vec3(270, 298.2763, 0), pista4Spline_playa_angulos[111] = new pc.Vec3(270, 300.0189, 0), pista4Spline_playa_angulos[112] = new pc.Vec3(270.0791, 301.6631, 0), pista4Spline_playa_angulos[113] = new pc.Vec3(270.1187, 33.68037, 269.9935), pista4Spline_playa_angulos[114] = new pc.Vec3(270.1385, 36.1782, 269.993), pista4Spline_playa_angulos[115] = new pc.Vec3(270.1385, 38.95477, 270.0021), pista4Spline_playa_angulos[116] = new pc.Vec3(270.1119, 312.1243, 0), pista4Spline_playa_angulos[117] = new pc.Vec3(270.1187, 44.8407, 269.9929), pista4Spline_playa_angulos[118] = new pc.Vec3(270.1413, 47.14589, 269.9986), pista4Spline_playa_angulos[119] = new pc.Vec3(270.1356, 49.14744, 269.9943), pista4Spline_playa_angulos[120] = new pc.Vec3(270.1136, 321.073, 0), pista4Spline_playa_angulos[121] = new pc.Vec3(270.0766, 322.7901, 0), pista4Spline_playa_angulos[122] = new pc.Vec3(270.028, 324.508, 0), pista4Spline_playa_angulos[123] = new pc.Vec3(270.0626, 326.3211, 0), pista4Spline_playa_angulos[124] = new pc.Vec3(270.1426, 238.3828, 89.99797), pista4Spline_playa_angulos[125] = new pc.Vec3(270.1898, 240.4978, 90.0041), pista4Spline_playa_angulos[126] = new pc.Vec3(270.2017, 242.6593, 89.99952), pista4Spline_playa_angulos[127] = new pc.Vec3(270.1845, 244.7934, 90.00159), pista4Spline_playa_angulos[128] = new pc.Vec3(270.1219, 246.877, 90.00465), pista4Spline_playa_angulos[129] = new pc.Vec3(270.0949, 338.6331, 0), pista4Spline_playa_angulos[130] = new pc.Vec3(270.1083, 340.3008, 0), pista4Spline_playa_angulos[131] = new pc.Vec3(270.0969, 342.0281, 0), pista4Spline_playa_angulos[132] = new pc.Vec3(270.0626, 343.9148, 0), pista4Spline_playa_angulos[133] = new pc.Vec3(270, 346.0657, 0), pista4Spline_playa_angulos[134] = new pc.Vec3(270.1028, 348.6803, 0), pista4Spline_playa_angulos[135] = new pc.Vec3(270.2112, 81.24602, 269.9991), pista4Spline_playa_angulos[136] = new pc.Vec3(270.2914, 83.5024, 269.9993), pista4Spline_playa_angulos[137] = new pc.Vec3(270.3887, 86.41699, 269.9987), pista4Spline_playa_angulos[138] = new pc.Vec3(270.5094, 90.05742, 269.9998), pista4Spline_playa_angulos[139] = new pc.Vec3(270.6404, 94.04335, 269.9994), pista4Spline_playa_angulos[140] = new pc.Vec3(270.7682, 97.95393, 270.0001), pista4Spline_playa_angulos[141] = new pc.Vec3(270.8974, 101.8972, 269.9997), pista4Spline_playa_angulos[142] = new pc.Vec3(271.0058, 105.2953, 270.0001), pista4Spline_playa_angulos[143] = new pc.Vec3(271.0788, 107.8223, 270), pista4Spline_playa_angulos[144] = new pc.Vec3(271.133, 109.8149, 270.0003), pista4Spline_playa_angulos[145] = new pc.Vec3(271.172, 111.4118, 269.9998), pista4Spline_playa_angulos[146] = new pc.Vec3(271.1934, 112.6955, 270.0002), pista4Spline_playa_angulos[147] = new pc.Vec3(271.2097, 113.7662, 269.9996), pista4Spline_playa_angulos[148] = new pc.Vec3(271.2469, 115.6391, 270.0005), pista4Spline_playa_angulos[149] = new pc.Vec3(271.2831, 117.7837, 270.0002), pista4Spline_playa_angulos[150] = new pc.Vec3(271.3098, 119.2486, 270.0001), pista4Spline_playa_angulos[151] = new pc.Vec3(271.3303, 120.2437, 269.9993), pista4Spline_playa_angulos[152] = new pc.Vec3(271.3457, 120.8151, 269.9995), pista4Spline_playa_angulos[153] = new pc.Vec3(271.3503, 120.9197, 270.0002), pista4Spline_playa_angulos[154] = new pc.Vec3(271.3798, 121.0686, 269.9998), pista4Spline_playa_angulos[155] = new pc.Vec3(271.4063, 121.7567, 270.0005), pista4Spline_playa_angulos[156] = new pc.Vec3(271.4089, 121.8387, 269.9996), pista4Spline_playa_angulos[157] = new pc.Vec3(271.4111, 121.8779, 270.0005), pista4Spline_playa_angulos[158] = new pc.Vec3(271.4133, 121.8873, 269.9995), pista4Spline_playa_angulos[159] = new pc.Vec3(271.4151, 121.8593, 270.0006), pista4Spline_playa_angulos[160] = new pc.Vec3(271.4482, 121.6684, 269.9995), pista4Spline_playa_angulos[161] = new pc.Vec3(271.4578, 122.1063, 269.9999), pista4Spline_playa_angulos[162] = new pc.Vec3(271.4649, 122.0759, 270.0002), pista4Spline_playa_angulos[163] = new pc.Vec3(271.4877, 121.6146, 269.9998), pista4Spline_playa_angulos[164] = new pc.Vec3(271.521, 120.6943, 269.9996), pista4Spline_playa_angulos[165] = new pc.Vec3(271.5646, 119.2754, 270.0004), pista4Spline_playa_angulos[166] = new pc.Vec3(271.606, 117.5983, 270.0001), pista4Spline_playa_angulos[167] = new pc.Vec3(271.6067, 116.4759, 270.0004), pista4Spline_playa_angulos[168] = new pc.Vec3(271.6203, 115.3892, 269.9998), pista4Spline_playa_angulos[169] = new pc.Vec3(271.6797, 114.0666, 270.0004), pista4Spline_playa_angulos[170] = new pc.Vec3(271.7781, 112.4924, 270.0002), pista4Spline_playa_angulos[171] = new pc.Vec3(271.9192, 110.6112, 270.0005), pista4Spline_playa_angulos[172] = new pc.Vec3(272.1296, 108.612, 269.9999), pista4Spline_playa_angulos[173] = new pc.Vec3(272.3818, 106.9985, 270), pista4Spline_playa_angulos[174] = new pc.Vec3(272.5546, 105.1286, 270.0001), pista4Spline_playa_angulos[175] = new pc.Vec3(272.6192, 102.8303, 269.9995), pista4Spline_playa_angulos[176] = new pc.Vec3(272.5728, 100.172, 270), pista4Spline_playa_angulos[177] = new pc.Vec3(272.4078, 97.24641, 270.0003), pista4Spline_playa_angulos[178] = new pc.Vec3(272.2514, 94.28429, 269.9999), pista4Spline_playa_angulos[179] = new pc.Vec3(272.1943, 91.67393, 269.9999), pista4Spline_playa_angulos[180] = new pc.Vec3(272.1168, 89.33474, 270.0001), pista4Spline_playa_angulos[181] = new pc.Vec3(272.0296, 87.17915, 269.9999), pista4Spline_playa_angulos[182] = new pc.Vec3(271.929, 85.14314, 270.0002), pista4Spline_playa_angulos[183] = new pc.Vec3(271.8107, 83.16254, 269.9998), pista4Spline_playa_angulos[184] = new pc.Vec3(271.6958, 81.1974, 270.0002), pista4Spline_playa_angulos[185] = new pc.Vec3(271.5948, 79.19549, 269.9997), pista4Spline_playa_angulos[186] = new pc.Vec3(271.4819, 77.13311, 269.9997), pista4Spline_playa_angulos[187] = new pc.Vec3(271.3626, 75.00362, 269.9998), pista4Spline_playa_angulos[188] = new pc.Vec3(271.2303, 72.7851, 270.0004), pista4Spline_playa_angulos[189] = new pc.Vec3(271.0884, 70.45369, 269.9994), pista4Spline_playa_angulos[190] = new pc.Vec3(270.9561, 68.21835, 270.0003), pista4Spline_playa_angulos[191] = new pc.Vec3(270.8323, 66.17567, 269.999), pista4Spline_playa_angulos[192] = new pc.Vec3(270.7039, 64.08466, 269.9986), pista4Spline_playa_angulos[193] = new pc.Vec3(270.5651, 61.89867, 270), pista4Spline_playa_angulos[194] = new pc.Vec3(270.4159, 59.59018, 270.0005), pista4Spline_playa_angulos[195] = new pc.Vec3(270.2455, 57.07281, 269.9956), pista4Spline_playa_angulos[196] = new pc.Vec3(270.0862, 324.2621, 0), pista4Spline_playa_angulos[197] = new pc.Vec3(270.0343, 321.2936, 0), pista4Spline_playa_angulos[198] = new pc.Vec3(270.2017, 228.8841, 90.0039), pista4Spline_playa_angulos[199] = new pc.Vec3(270.3882, 226.7363, 90.00126), pista4Spline_playa_angulos[200] = new pc.Vec3(270.6055, 224.8969, 90.00098), pista4Spline_playa_angulos[201] = new pc.Vec3(270.8566, 223.3642, 90), pista4Spline_playa_angulos[202] = new pc.Vec3(271.1052, 221.7973, 90.00009), pista4Spline_playa_angulos[203] = new pc.Vec3(271.3265, 219.975, 90.00037), pista4Spline_playa_angulos[204] = new pc.Vec3(271.5451, 218.0716, 89.99994), pista4Spline_playa_angulos[205] = new pc.Vec3(271.7565, 216.0487, 90.00027), pista4Spline_playa_angulos[206] = new pc.Vec3(271.979, 213.8582, 90.0005), pista4Spline_playa_angulos[207] = new pc.Vec3(272.1886, 211.4456, 90.00022), pista4Spline_playa_angulos[208] = new pc.Vec3(272.4346, 208.979, 90.00037), pista4Spline_playa_angulos[209] = new pc.Vec3(272.664, 206.6037, 90.00044), pista4Spline_playa_angulos[210] = new pc.Vec3(272.8798, 204.241, 90.00034), pista4Spline_playa_angulos[211] = new pc.Vec3(273.0769, 201.8941, 90.00013), pista4Spline_playa_angulos[212] = new pc.Vec3(273.2591, 199.5607, 90.00033), pista4Spline_playa_angulos[213] = new pc.Vec3(273.4527, 197.0254, 90.0002), pista4Spline_playa_angulos[214] = new pc.Vec3(273.7475, 194.0397, 90.00018), pista4Spline_playa_angulos[215] = new pc.Vec3(273.9349, 191.5086, 90), pista4Spline_playa_angulos[216] = new pc.Vec3(274.0324, 189.5596, 89.99983), pista4Spline_playa_angulos[217] = new pc.Vec3(274.0048, 188.1917, 90.00024), pista4Spline_playa_angulos[218] = new pc.Vec3(273.9009, 187.4667, 90.00008), pista4Spline_playa_angulos[219] = new pc.Vec3(273.8668, 186.3671, 90), pista4Spline_playa_angulos[220] = new pc.Vec3(273.934, 184.8289, 90.00005), pista4Spline_playa_angulos[221] = new pc.Vec3(273.9159, 183.789, 89.99999), pista4Spline_playa_angulos[222] = new pc.Vec3(273.8079, 183.0573, 90.00024), pista4Spline_playa_angulos[223] = new pc.Vec3(273.6217, 182.6346, 89.99995), pista4Spline_playa_angulos[224] = new pc.Vec3(273.4671, 182.8028, 90.00028), pista4Spline_playa_angulos[225] = new pc.Vec3(272.6379, 181.4994, 90.00004), pista4Spline_playa_angulos[226] = new pc.Vec3(272.6953, 181.5295, 90.00013), pista4Spline_playa_angulos[227] = new pc.Vec3(272.6643, 181.4816, 89.99986), pista4Spline_playa_angulos[228] = new pc.Vec3(272.5451, 181.349, 89.99977), pista4Spline_playa_angulos[229] = new pc.Vec3(272.3367, 181.1495, 90.00032), pista4Spline_playa_angulos[230] = new pc.Vec3(272.0405, 180.8664, 90.00039), pista4Spline_playa_angulos[231] = new pc.Vec3(271.6844, 180.5232, 90.00024), pista4Spline_playa_angulos[232] = new pc.Vec3(271.397, 180.2345, 90.00011), pista4Spline_playa_angulos[233] = new pc.Vec3(271.1981, 180.0363, 89.99972), pista4Spline_playa_angulos[234] = new pc.Vec3(271.0866, 179.9333, 90.0004), pista4Spline_playa_angulos[235] = new pc.Vec3(271.0616, 179.9221, 89.99967), pista4Spline_playa_angulos[236] = new pc.Vec3(271.1259, 180.005, 90.00092), pista4Spline_playa_angulos[237] = new pc.Vec3(271.1032, 180.0486, 89.99965), pista4Spline_playa_angulos[238] = new pc.Vec3(271.0222, 180.0188, 89.99928), pista4Spline_playa_angulos[239] = new pc.Vec3(270.997, 180.0052, 90.00073), pista4Spline_playa_angulos[240] = new pc.Vec3(271.0253, 179.993, 90.00105), pista4Spline_playa_angulos[241] = new pc.Vec3(271.1082, 179.9994, 90.00062), pista4Spline_playa_angulos[242] = new pc.Vec3(271.2084, 180.0112, 90.00069);
var conexionpista0_tunel = [],
    vientopista0_tunel = [];
vientopista0_tunel[0] = 25, vientopista0_tunel[1] = 124;
var pista0_tunelSpline_playa = [];
pista0_tunelSpline_playa[0] = new pc.Vec3(0, 0, 0), pista0_tunelSpline_playa[1] = new pc.Vec3(3433228e-11, .002445533, -.6000118), pista0_tunelSpline_playa[2] = new pc.Vec3(3051757e-11, .002238007, -1.200014), pista0_tunelSpline_playa[3] = new pc.Vec3(3051757e-11, .002032509, -1.800013), pista0_tunelSpline_playa[4] = new pc.Vec3(3433227e-11, .001845844, -2.400015), pista0_tunelSpline_playa[5] = new pc.Vec3(2670288e-11, .001695063, -3.000013), pista0_tunelSpline_playa[6] = new pc.Vec3(3433228e-11, .001597091, -3.600012), pista0_tunelSpline_playa[7] = new pc.Vec3(305176e-10, .001553, -4.200016), pista0_tunelSpline_playa[8] = new pc.Vec3(3051761e-11, .001548608, -4.800014), pista0_tunelSpline_playa[9] = new pc.Vec3(2670293e-11, .001568414, -5.400016), pista0_tunelSpline_playa[10] = new pc.Vec3(2670295e-11, .001597042, -6.000015), pista0_tunelSpline_playa[11] = new pc.Vec3(3051767e-11, .001619113, -6.600018), pista0_tunelSpline_playa[12] = new pc.Vec3(3051768e-11, .001622946, -7.200016), pista0_tunelSpline_playa[13] = new pc.Vec3(1525891e-11, .001622965, -7.800015), pista0_tunelSpline_playa[14] = new pc.Vec3(1144423e-11, .001622863, -8.400015), pista0_tunelSpline_playa[15] = new pc.Vec3(1144424e-11, .00162312, -9.000015), pista0_tunelSpline_playa[16] = new pc.Vec3(1525896e-11, .001623137, -9.600017), pista0_tunelSpline_playa[17] = new pc.Vec3(1525897e-11, .001623036, -10.20002), pista0_tunelSpline_playa[18] = new pc.Vec3(1525899e-11, .001623054, -10.80001), pista0_tunelSpline_playa[19] = new pc.Vec3(1144431e-11, .001623071, -11.40002), pista0_tunelSpline_playa[20] = new pc.Vec3(1144433e-11, .00162297, -12.00002), pista0_tunelSpline_playa[21] = new pc.Vec3(1525904e-11, .001622987, -12.60002), pista0_tunelSpline_playa[22] = new pc.Vec3(1525905e-11, .001623006, -13.20002), pista0_tunelSpline_playa[23] = new pc.Vec3(1525907e-11, .001622905, -13.80001), pista0_tunelSpline_playa[24] = new pc.Vec3(1144439e-11, .001622922, -14.40002), pista0_tunelSpline_playa[25] = new pc.Vec3(1144441e-11, .001622941, -15.00002), pista0_tunelSpline_playa[26] = new pc.Vec3(1144442e-11, .001623078, -15.60001), pista0_tunelSpline_playa[27] = new pc.Vec3(1525914e-11, .001623096, -16.20002), pista0_tunelSpline_playa[28] = new pc.Vec3(9537106e-12, .001622994, -16.80002), pista0_tunelSpline_playa[29] = new pc.Vec3(1144447e-11, .001623251, -17.40001), pista0_tunelSpline_playa[30] = new pc.Vec3(1144449e-11, .001623269, -18.00001), pista0_tunelSpline_playa[31] = new pc.Vec3(1335185e-11, .001623168, -18.60001), pista0_tunelSpline_playa[32] = new pc.Vec3(1525922e-11, .001623185, -19.20001), pista0_tunelSpline_playa[33] = new pc.Vec3(1525923e-11, .001623204, -19.80001), pista0_tunelSpline_playa[34] = new pc.Vec3(1144455e-11, .001623102, -20.40002), pista0_tunelSpline_playa[35] = new pc.Vec3(1335192e-11, .001643623, -21.00002), pista0_tunelSpline_playa[36] = new pc.Vec3(1335195e-11, .001811011, -21.60001), pista0_tunelSpline_playa[37] = new pc.Vec3(1525933e-11, .002039553, -22.20002), pista0_tunelSpline_playa[38] = new pc.Vec3(953732e-11, .002198118, -22.80002), pista0_tunelSpline_playa[39] = new pc.Vec3(1716673e-11, .002156176, -23.40001), pista0_tunelSpline_playa[40] = new pc.Vec3(1144466e-11, .001781995, -24.00002), pista0_tunelSpline_playa[41] = new pc.Vec3(8010911e-11, .0004215972, -24.60001), pista0_tunelSpline_playa[42] = new pc.Vec3(.0002536776, -.002338315, -25.2), pista0_tunelSpline_playa[43] = new pc.Vec3(.0003757477, -.005117304, -25.8), pista0_tunelSpline_playa[44] = new pc.Vec3(.0006904602, -.005095469, -26.4), pista0_tunelSpline_playa[45] = new pc.Vec3(.0008068085, -.004603594, -27), pista0_tunelSpline_playa[46] = new pc.Vec3(.0007991792, -.004674983, -27.6), pista0_tunelSpline_playa[47] = new pc.Vec3(.0008106233, -.004705244, -28.2), pista0_tunelSpline_playa[48] = new pc.Vec3(.0008010865, -.004710233, -28.8), pista0_tunelSpline_playa[49] = new pc.Vec3(770569e-9, -.004716296, -29.4), pista0_tunelSpline_playa[50] = new pc.Vec3(770569e-9, -.004715798, -29.99999), pista0_tunelSpline_playa[51] = new pc.Vec3(770569e-9, -.004713399, -30.6), pista0_tunelSpline_playa[52] = new pc.Vec3(.0007781984, -.004726373, -31.2), pista0_tunelSpline_playa[53] = new pc.Vec3(.0007724764, -.004735894, -31.8), pista0_tunelSpline_playa[54] = new pc.Vec3(.0007705691, -.004739688, -32.4), pista0_tunelSpline_playa[55] = new pc.Vec3(.0007781985, -.004744558, -32.99999), pista0_tunelSpline_playa[56] = new pc.Vec3(.0007705691, -.004749546, -33.59999), pista0_tunelSpline_playa[57] = new pc.Vec3(.0007705691, -.004754299, -34.2), pista0_tunelSpline_playa[58] = new pc.Vec3(.0007781985, -.00476036, -34.8), pista0_tunelSpline_playa[59] = new pc.Vec3(.0007705691, -.004762725, -35.39999), pista0_tunelSpline_playa[60] = new pc.Vec3(.0007781985, -.004758178, -35.99999), pista0_tunelSpline_playa[61] = new pc.Vec3(.0007705692, -.004767578, -36.59999), pista0_tunelSpline_playa[62] = new pc.Vec3(.0008697513, -.004779717, -37.19999), pista0_tunelSpline_playa[63] = new pc.Vec3(.001411438, -.004784348, -37.79999), pista0_tunelSpline_playa[64] = new pc.Vec3(.0006256107, -.004786596, -38.39999), pista0_tunelSpline_playa[65] = new pc.Vec3(-.01039886, -.004787365, -38.99983), pista0_tunelSpline_playa[66] = new pc.Vec3(-.05120087, -.004787259, -39.59839), pista0_tunelSpline_playa[67] = new pc.Vec3(-.122673, -.004787356, -40.19403), pista0_tunelSpline_playa[68] = new pc.Vec3(-.2282944, -.004787803, -40.78458), pista0_tunelSpline_playa[69] = new pc.Vec3(-.369194, -.0047791, -41.36769), pista0_tunelSpline_playa[70] = new pc.Vec3(-.5545578, -.004777312, -41.93817), pista0_tunelSpline_playa[71] = new pc.Vec3(-.7832565, -.004786372, -42.49268), pista0_tunelSpline_playa[72] = new pc.Vec3(-1.063835, -.004787505, -43.02275), pista0_tunelSpline_playa[73] = new pc.Vec3(-1.384331, -.004786432, -43.52986), pista0_tunelSpline_playa[74] = new pc.Vec3(-1.735222, -.004786432, -44.01653), pista0_tunelSpline_playa[75] = new pc.Vec3(-2.096672, -.004786074, -44.49541), pista0_tunelSpline_playa[76] = new pc.Vec3(-2.491814, -.004786551, -44.9464), pista0_tunelSpline_playa[77] = new pc.Vec3(-2.931877, -.004786074, -45.3541), pista0_tunelSpline_playa[78] = new pc.Vec3(-3.389694, -.004776537, -45.74188), pista0_tunelSpline_playa[79] = new pc.Vec3(-3.855301, -.004776299, -46.1203), pista0_tunelSpline_playa[80] = new pc.Vec3(-4.325798, -.004784882, -46.49263), pista0_tunelSpline_playa[81] = new pc.Vec3(-4.797844, -.004787743, -46.86301), pista0_tunelSpline_playa[82] = new pc.Vec3(-5.270927, -.004786313, -47.23206), pista0_tunelSpline_playa[83] = new pc.Vec3(-5.742645, -.004785836, -47.60284), pista0_tunelSpline_playa[84] = new pc.Vec3(-6.211418, -.004785836, -47.97735), pista0_tunelSpline_playa[85] = new pc.Vec3(-6.67469, -.004785359, -48.3586), pista0_tunelSpline_playa[86] = new pc.Vec3(-7.11837, -.004785836, -48.76229), pista0_tunelSpline_playa[87] = new pc.Vec3(-7.536369, -.004783928, -49.19268), pista0_tunelSpline_playa[88] = new pc.Vec3(-7.942932, -.004774868, -49.63391), pista0_tunelSpline_playa[89] = new pc.Vec3(-8.336571, -.004778683, -50.08672), pista0_tunelSpline_playa[90] = new pc.Vec3(-8.706474, -.004786313, -50.55891), pista0_tunelSpline_playa[91] = new pc.Vec3(-9.035431, -.004786313, -51.06039), pista0_tunelSpline_playa[92] = new pc.Vec3(-9.29998, -.004786313, -51.59848), pista0_tunelSpline_playa[93] = new pc.Vec3(-9.499214, -.004786313, -52.16407), pista0_tunelSpline_playa[94] = new pc.Vec3(-9.628212, -.004785359, -52.74975), pista0_tunelSpline_playa[95] = new pc.Vec3(-9.706581, -.004787266, -53.34441), pista0_tunelSpline_playa[96] = new pc.Vec3(-9.745766, -.004786313, -53.9431), pista0_tunelSpline_playa[97] = new pc.Vec3(-9.762535, -.004775822, -54.54284), pista0_tunelSpline_playa[98] = new pc.Vec3(-9.767296, -.004774868, -55.14281), pista0_tunelSpline_playa[99] = new pc.Vec3(-9.765533, -.004778683, -55.74281), pista0_tunelSpline_playa[100] = new pc.Vec3(-9.765541, -.004774868, -56.34281), pista0_tunelSpline_playa[101] = new pc.Vec3(-9.765533, -.004771054, -56.94281), pista0_tunelSpline_playa[102] = new pc.Vec3(-9.765541, -.004767239, -57.5428), pista0_tunelSpline_playa[103] = new pc.Vec3(-9.765549, -.004762471, -58.14281), pista0_tunelSpline_playa[104] = new pc.Vec3(-9.765556, -.00475961, -58.7428), pista0_tunelSpline_playa[105] = new pc.Vec3(-9.765556, -.004755795, -59.34281), pista0_tunelSpline_playa[106] = new pc.Vec3(-9.765556, -.004745305, -59.9428), pista0_tunelSpline_playa[107] = new pc.Vec3(-9.765549, -.004737675, -60.5428), pista0_tunelSpline_playa[108] = new pc.Vec3(-9.765549, -.004743397, -61.14281), pista0_tunelSpline_playa[109] = new pc.Vec3(-9.765556, -.00474149, -61.74281), pista0_tunelSpline_playa[110] = new pc.Vec3(-9.765556, -.004736722, -62.34281), pista0_tunelSpline_playa[111] = new pc.Vec3(-9.765549, -.004732907, -62.94281), pista0_tunelSpline_playa[112] = new pc.Vec3(-9.765572, -.004729092, -63.54281), pista0_tunelSpline_playa[113] = new pc.Vec3(-9.765572, -.004724324, -64.14281), pista0_tunelSpline_playa[114] = new pc.Vec3(-9.765564, -.004721463, -64.74281), pista0_tunelSpline_playa[115] = new pc.Vec3(-9.765572, -.00471288, -65.3428), pista0_tunelSpline_playa[116] = new pc.Vec3(-9.765572, -.004702389, -65.9428), pista0_tunelSpline_playa[117] = new pc.Vec3(-9.765564, -.004706204, -66.54281), pista0_tunelSpline_playa[118] = new pc.Vec3(-9.765572, -.004707158, -67.14281), pista0_tunelSpline_playa[119] = new pc.Vec3(-9.765564, -.004702389, -67.74281), pista0_tunelSpline_playa[120] = new pc.Vec3(-9.765564, -.005017102, -68.34282), pista0_tunelSpline_playa[121] = new pc.Vec3(-9.765587, -.003918469, -68.94282), pista0_tunelSpline_playa[122] = new pc.Vec3(-9.765602, -.0007303357, -69.5428), pista0_tunelSpline_playa[123] = new pc.Vec3(-9.765587, .001609981, -70.1428), pista0_tunelSpline_playa[124] = new pc.Vec3(-9.765602, .002916515, -70.74279), pista0_tunelSpline_playa[125] = new pc.Vec3(-9.765602, .002777278, -71.3428), pista0_tunelSpline_playa[126] = new pc.Vec3(-9.765594, .002777278, -71.50848);
var pista0_tunelSpline_playa_angulos = [];
pista0_tunelSpline_playa_angulos[0] = new pc.Vec3(0, 0, 0), pista0_tunelSpline_playa_angulos[1] = new pc.Vec3(270, 269.9807, 0), pista0_tunelSpline_playa_angulos[2] = new pc.Vec3(270, 269.98, 0), pista0_tunelSpline_playa_angulos[3] = new pc.Vec3(270, 269.981, 0), pista0_tunelSpline_playa_angulos[4] = new pc.Vec3(270, 269.9836, 0), pista0_tunelSpline_playa_angulos[5] = new pc.Vec3(270, 269.9879, 0), pista0_tunelSpline_playa_angulos[6] = new pc.Vec3(270, 269.9934, 0), pista0_tunelSpline_playa_angulos[7] = new pc.Vec3(270, 269.9979, 0), pista0_tunelSpline_playa_angulos[8] = new pc.Vec3(270, 270.001, 0), pista0_tunelSpline_playa_angulos[9] = new pc.Vec3(270, 270.0026, 0), pista0_tunelSpline_playa_angulos[10] = new pc.Vec3(270, 270.0027, 0), pista0_tunelSpline_playa_angulos[11] = new pc.Vec3(270, 270.0013, 0), pista0_tunelSpline_playa_angulos[12] = new pc.Vec3(270, 270, 0), pista0_tunelSpline_playa_angulos[13] = new pc.Vec3(270, 270, 0), pista0_tunelSpline_playa_angulos[14] = new pc.Vec3(270, 270, 0), pista0_tunelSpline_playa_angulos[15] = new pc.Vec3(270, 270, 0), pista0_tunelSpline_playa_angulos[16] = new pc.Vec3(270, 270, 0), pista0_tunelSpline_playa_angulos[17] = new pc.Vec3(270, 270, 0), pista0_tunelSpline_playa_angulos[18] = new pc.Vec3(270, 270, 0), pista0_tunelSpline_playa_angulos[19] = new pc.Vec3(270, 270, 0), pista0_tunelSpline_playa_angulos[20] = new pc.Vec3(270, 270, 0), pista0_tunelSpline_playa_angulos[21] = new pc.Vec3(270, 270, 0), pista0_tunelSpline_playa_angulos[22] = new pc.Vec3(270, 270, 0), pista0_tunelSpline_playa_angulos[23] = new pc.Vec3(270, 270, 0), pista0_tunelSpline_playa_angulos[24] = new pc.Vec3(270, 270, 0), pista0_tunelSpline_playa_angulos[25] = new pc.Vec3(270, 270, 0), pista0_tunelSpline_playa_angulos[26] = new pc.Vec3(270, 270, 0), pista0_tunelSpline_playa_angulos[27] = new pc.Vec3(270, 270, 0), pista0_tunelSpline_playa_angulos[28] = new pc.Vec3(270, 270, 0), pista0_tunelSpline_playa_angulos[29] = new pc.Vec3(270, 270, 0), pista0_tunelSpline_playa_angulos[30] = new pc.Vec3(270, 270, 0), pista0_tunelSpline_playa_angulos[31] = new pc.Vec3(270, 270, 0), pista0_tunelSpline_playa_angulos[32] = new pc.Vec3(270, 270, 0), pista0_tunelSpline_playa_angulos[33] = new pc.Vec3(270, 270, 0), pista0_tunelSpline_playa_angulos[34] = new pc.Vec3(270, 270, 0), pista0_tunelSpline_playa_angulos[35] = new pc.Vec3(270, 270.0089, 0), pista0_tunelSpline_playa_angulos[36] = new pc.Vec3(270.028, 270.021, 0), pista0_tunelSpline_playa_angulos[37] = new pc.Vec3(270.028, 270.0206, 0), pista0_tunelSpline_playa_angulos[38] = new pc.Vec3(270, 270.0076, 0), pista0_tunelSpline_playa_angulos[39] = new pc.Vec3(270, 269.9822, 0), pista0_tunelSpline_playa_angulos[40] = new pc.Vec3(270.056, 269.9443, 0), pista0_tunelSpline_playa_angulos[41] = new pc.Vec3(270.2185, 179.983, 89.99955), pista0_tunelSpline_playa_angulos[42] = new pc.Vec3(270.2839, 179.9822, 90.00034), pista0_tunelSpline_playa_angulos[43] = new pc.Vec3(270.1813, 179.9881, 89.99973), pista0_tunelSpline_playa_angulos[44] = new pc.Vec3(270.028, 270.0278, 0), pista0_tunelSpline_playa_angulos[45] = new pc.Vec3(270.028, 270.0218, 0), pista0_tunelSpline_playa_angulos[46] = new pc.Vec3(270, 269.986, 0), pista0_tunelSpline_playa_angulos[47] = new pc.Vec3(270, 269.9995, 0), pista0_tunelSpline_playa_angulos[48] = new pc.Vec3(270, 269.9995, 0), pista0_tunelSpline_playa_angulos[49] = new pc.Vec3(270, 269.9996, 0), pista0_tunelSpline_playa_angulos[50] = new pc.Vec3(270, 270.0005, 0), pista0_tunelSpline_playa_angulos[51] = new pc.Vec3(270, 269.9995, 0), pista0_tunelSpline_playa_angulos[52] = new pc.Vec3(270, 269.9986, 0), pista0_tunelSpline_playa_angulos[53] = new pc.Vec3(270, 269.9995, 0), pista0_tunelSpline_playa_angulos[54] = new pc.Vec3(270, 269.9996, 0), pista0_tunelSpline_playa_angulos[55] = new pc.Vec3(270, 269.9995, 0), pista0_tunelSpline_playa_angulos[56] = new pc.Vec3(270, 269.9995, 0), pista0_tunelSpline_playa_angulos[57] = new pc.Vec3(270, 269.9995, 0), pista0_tunelSpline_playa_angulos[58] = new pc.Vec3(270, 269.9995, 0), pista0_tunelSpline_playa_angulos[59] = new pc.Vec3(270, 270.0003, 0), pista0_tunelSpline_playa_angulos[60] = new pc.Vec3(270, 270, 0), pista0_tunelSpline_playa_angulos[61] = new pc.Vec3(270, 269.9985, 0), pista0_tunelSpline_playa_angulos[62] = new pc.Vec3(270, 269.9354, 0), pista0_tunelSpline_playa_angulos[63] = new pc.Vec3(270, 270.0928, 0), pista0_tunelSpline_playa_angulos[64] = new pc.Vec3(270, 270.0173, 0), pista0_tunelSpline_playa_angulos[65] = new pc.Vec3(270, 272.6354, 0), pista0_tunelSpline_playa_angulos[66] = new pc.Vec3(270, 275.2532, 0), pista0_tunelSpline_playa_angulos[67] = new pc.Vec3(270, 278.4692, 0), pista0_tunelSpline_playa_angulos[68] = new pc.Vec3(270, 281.8617, 0), pista0_tunelSpline_playa_angulos[69] = new pc.Vec3(270, 285.5685, 0), pista0_tunelSpline_playa_angulos[70] = new pc.Vec3(270, 290.1568, 0), pista0_tunelSpline_playa_angulos[71] = new pc.Vec3(270, 294.938, 0), pista0_tunelSpline_playa_angulos[72] = new pc.Vec3(270, 300.5047, 0), pista0_tunelSpline_playa_angulos[73] = new pc.Vec3(270, 304.2595, 0), pista0_tunelSpline_playa_angulos[74] = new pc.Vec3(270, 306.7141, 0), pista0_tunelSpline_playa_angulos[75] = new pc.Vec3(270, 308.1239, 0), pista0_tunelSpline_playa_angulos[76] = new pc.Vec3(270, 314.9556, 0), pista0_tunelSpline_playa_angulos[77] = new pc.Vec3(270, 318.5498, 0), pista0_tunelSpline_playa_angulos[78] = new pc.Vec3(270, 320.5548, 0), pista0_tunelSpline_playa_angulos[79] = new pc.Vec3(270, 321.3413, 0), pista0_tunelSpline_playa_angulos[80] = new pc.Vec3(270, 321.7882, 0), pista0_tunelSpline_playa_angulos[81] = new pc.Vec3(270, 322.0589, 0), pista0_tunelSpline_playa_angulos[82] = new pc.Vec3(270, 321.903, 0), pista0_tunelSpline_playa_angulos[83] = new pc.Vec3(270, 321.7575, 0), pista0_tunelSpline_playa_angulos[84] = new pc.Vec3(270.0198, 320.9126, 0), pista0_tunelSpline_playa_angulos[85] = new pc.Vec3(270, 319.6676, 0), pista0_tunelSpline_playa_angulos[86] = new pc.Vec3(270, 315.4532, 0), pista0_tunelSpline_playa_angulos[87] = new pc.Vec3(270, 313.3853, 0), pista0_tunelSpline_playa_angulos[88] = new pc.Vec3(270, 311.8109, 0), pista0_tunelSpline_playa_angulos[89] = new pc.Vec3(270, 310.1449, 0), pista0_tunelSpline_playa_angulos[90] = new pc.Vec3(270, 305.6573, 0), pista0_tunelSpline_playa_angulos[91] = new pc.Vec3(270, 300.0278, 0), pista0_tunelSpline_playa_angulos[92] = new pc.Vec3(270, 292.7967, 0), pista0_tunelSpline_playa_angulos[93] = new pc.Vec3(270, 285.7553, 0), pista0_tunelSpline_playa_angulos[94] = new pc.Vec3(270.028, 279.7711, 0), pista0_tunelSpline_playa_angulos[95] = new pc.Vec3(270, 275.0195, 0), pista0_tunelSpline_playa_angulos[96] = new pc.Vec3(270, 272.8457, 0), pista0_tunelSpline_playa_angulos[97] = new pc.Vec3(270, 270.821, 0), pista0_tunelSpline_playa_angulos[98] = new pc.Vec3(270, 269.9239, 0), pista0_tunelSpline_playa_angulos[99] = new pc.Vec3(270, 269.9884, 0), pista0_tunelSpline_playa_angulos[100] = new pc.Vec3(270, 270.0005, 0), pista0_tunelSpline_playa_angulos[101] = new pc.Vec3(270, 270.0004, 0), pista0_tunelSpline_playa_angulos[102] = new pc.Vec3(270, 270.0004, 0), pista0_tunelSpline_playa_angulos[103] = new pc.Vec3(270, 270.0062, 0), pista0_tunelSpline_playa_angulos[104] = new pc.Vec3(270, 270.0002, 0), pista0_tunelSpline_playa_angulos[105] = new pc.Vec3(270, 270.0006, 0), pista0_tunelSpline_playa_angulos[106] = new pc.Vec3(270, 270.0014, 0), pista0_tunelSpline_playa_angulos[107] = new pc.Vec3(270, 269.9998, 0), pista0_tunelSpline_playa_angulos[108] = new pc.Vec3(270, 269.9996, 0), pista0_tunelSpline_playa_angulos[109] = new pc.Vec3(270, 270.0005, 0), pista0_tunelSpline_playa_angulos[110] = new pc.Vec3(270, 270.0004, 0), pista0_tunelSpline_playa_angulos[111] = new pc.Vec3(270, 270.0004, 0), pista0_tunelSpline_playa_angulos[112] = new pc.Vec3(270, 270.0004, 0), pista0_tunelSpline_playa_angulos[113] = new pc.Vec3(270, 270.0003, 0), pista0_tunelSpline_playa_angulos[114] = new pc.Vec3(270, 270.0004, 0), pista0_tunelSpline_playa_angulos[115] = new pc.Vec3(270, 270.0014, 0), pista0_tunelSpline_playa_angulos[116] = new pc.Vec3(270, 270.0003, 0), pista0_tunelSpline_playa_angulos[117] = new pc.Vec3(270, 269.9994, 0), pista0_tunelSpline_playa_angulos[118] = new pc.Vec3(270, 270.0003, 0), pista0_tunelSpline_playa_angulos[119] = new pc.Vec3(270, 269.9997, 0), pista0_tunelSpline_playa_angulos[120] = new pc.Vec3(270, 269.9831, 0), pista0_tunelSpline_playa_angulos[121] = new pc.Vec3(270.2556, .0007620437, 269.9992), pista0_tunelSpline_playa_angulos[122] = new pc.Vec3(270.2727, .0007163853, 269.9993), pista0_tunelSpline_playa_angulos[123] = new pc.Vec3(270.1908, .001020924, 269.999), pista0_tunelSpline_playa_angulos[124] = new pc.Vec3(270.028, 270.0371, 0), pista0_tunelSpline_playa_angulos[125] = new pc.Vec3(270.028, 269.9713, 0), pista0_tunelSpline_playa_angulos[126] = new pc.Vec3(270.028, 269.9713, 0);
var CheckPoint = pc.createScript("checkPoint");
CheckPoint.attributes.add("tiempo", {
    type: "number",
    default: 30
}), CheckPoint.prototype.initialize = function() {
    this.entity.collision.on("triggerenter", this.onTriggerEnter, this), this.activado = !1
}, CheckPoint.prototype.onTriggerEnter = function(e) {
    "carroceria" != e.name || this.activado || (this.activado = !0, setTimeout(function() {
        this.activado = !1
    }.bind(this), 4e3), playSound("checkPoint"), _menu.poneMSG("checkPoint"), _raceScore += 50 * time, _menu.pintarScore(_raceScore), time += this.tiempo, currentCheckpoint += 1, checkPointCant += 1, checkPointCant % 3 == 0 && console.log("EXCEPCION!! REGALMOS 10 SEGUNDOS MAS"), _globalScore += distanceScore, distanceScore = 0, distanciaCheckIni = _tramos.checkPoints[currentCheckpoint].getPosition().clone().distance(this.entity.getPosition().clone()), _menu.GUI_check.findByName("barra").setLocalScale(0, 1, 1), _menu.GUI_checkAnim.enabled = !0, _menu.GUI_check.findByName("icon").enabled = !1, _menu.GUI_checkAnim.script.reproduceAnimSprite.play(function() {
        _menu.GUI_check.findByName("icon").enabled = !0
    }.bind(this)))
};
var AnimaMeta = pc.createScript("animaMeta");
AnimaMeta.attributes.add("material", {
    type: "asset",
    assetType: "material",
    array: !1
}), AnimaMeta.prototype.initialize = function() {
    this.anim1 = null, this.anim2 = null
}, AnimaMeta.prototype.animGO = function() {
    this.material.resource.opacityMapOffset = new pc.Vec2(0, .25), this.material.resource.diffuseMapOffset = new pc.Vec2(0, .25), this.material.resource.emissiveMapOffset = new pc.Vec2(0, .25), this.material.resource.update()
}, AnimaMeta.prototype.animGO2 = function() {
    this.material.resource.opacityMapOffset = new pc.Vec2(0, .5), this.material.resource.diffuseMapOffset = new pc.Vec2(0, .5), this.material.resource.emissiveMapOffset = new pc.Vec2(0, .5), this.material.resource.update()
}, AnimaMeta.prototype.playGO = function() {
    this.animGO(), this.anim1 = setTimeout(function() {
        this.animGO2(), this.anim2 = setTimeout(function() {
            this.playGO()
        }.bind(this), 220)
    }.bind(this), 220)
}, AnimaMeta.prototype.stopGO = function() {
    clearTimeout(this.anim1), clearTimeout(this.anim2)
};
var TramosManager = pc.createScript("tramosManager");
TramosManager.attributes.add("triggerSCript", {
    type: "asset"
}), TramosManager.attributes.add("tramos_iniciales", {
    type: "entity"
}), TramosManager.attributes.add("tramos_tunel", {
    type: "entity"
}), TramosManager.attributes.add("tramos_playa", {
    type: "entity"
}), TramosManager.attributes.add("tramos_ciudad", {
    type: "entity"
}), TramosManager.attributes.add("tramos_desierto", {
    type: "entity"
}), TramosManager.attributes.add("tramos_por_tematica", {
    type: "number",
    default: 3
}), TramosManager.prototype.initialize = function() {
    this.app.assets.load(this.triggerSCript), this.pista = null, this.checkPoints = [], _tramos = this
}, TramosManager.prototype.init = function() {
    currentTematica = "playa", tramoInicialTematica = null;
    for (var t = 0; t < this.tramos_playa.children.length; t++) this.tramos_playa.children[t].enabled = !1;
    for (t = 0; t < this.tramos_ciudad.children.length; t++) this.tramos_ciudad.children[t].enabled = !1;
    for (t = 0; t < this.tramos_iniciales.children.length; t++) this.tramos_iniciales.children[t].enabled = !1;
    for (t = 0; t < this.tramos_tunel.children.length; t++) this.tramos_tunel.children[t].enabled = !1;
    this.checkPoints = [], this.tramoPartida = [], this.tramoPartida[0] = this.tramos_iniciales.children[0], this.tramoPartida[1] = pista_inicial0Spline, this.tramoPartida[2] = pista_inicial0Spline_angulos, this.tramoPartida[3] = !1, this.pista = [], this.pista.push(this.tramoPartida), this.addTematica("playa"), this.addTematica("ciudad"), this.addTematica("desierto"), this.pista[0][0].enabled = !0;
    for (t = 0; t < this.pista.length - 1; t++) {
        var a = this.pista[t][1],
            i = this.pista[t + 1][0];
        (r = this.pista[t][0]).enabled = !0;
        var s = r.getPosition(),
            e = new pc.Vec3(s.x - a[a.length - 2].x, s.y + a[a.length - 2].y, s.z + a[a.length - 2].z);
        i.setPosition(e), i.enabled = !0, console.log(i.name), console.log(i.enabled)
    }
    this.setTriggersPista();
    for (t = 2; t < this.pista.length; t++) {
        var r = this.pista[t][0];
        setTimeout(this.apagaTramo.bind(this, r), 60)
    }
}, TramosManager.prototype.apagaTramo = function(t) {
    t.enabled = !1, console.log("apagando el tramo " + t.name)
}, TramosManager.prototype.nuevaTematica = function(t) {
    console.log("CREANDO NUEVA TEMATICA");
    var a = this.pista.length - 1;
    this.addTematica(t);
    for (var i = a; i < this.pista.length - 1; i++) {
        var s = this.pista[i][1],
            e = this.pista[i + 1][0];
        (o = this.pista[i][0]).enabled = !0;
        var r = o.getPosition(),
            n = new pc.Vec3(r.x - s[s.length - 2].x, r.y + s[s.length - 2].y, r.z + s[s.length - 2].z);
        e.setPosition(n), e.enabled = !0
    }
    this.setTriggersPista();
    for (i = a + 1; i < this.pista.length; i++) {
        var o = this.pista[i][0];
        setTimeout(this.apagaTramo.bind(this, o), 60)
    }
}, TramosManager.prototype.addTematica = function(t) {
    for (var a = [], i = 0; i < this["tramos_" + t].children.length; i++) a.push(i);
    for (i = 0; i < this.tramos_por_tematica; i++) {
        var s = Math.floor(Math.random() * a.length),
            e = a[s],
            r = this["tramos_" + t].children[e],
            n = window["pista" + e + "Spline_" + t],
            o = window["pista" + e + "Spline_" + t + "_" + o];
        this.checkPoints.push(r.findByName("checkPoint")), console.log("tramo q agregamos es  " + r.name), this.pista.push([r, n, o]), a.splice(s, 1)
    }
    this.tramoTunel = [], this.tramoTunel[0] = this.tramos_tunel.findByName("tramo-tunelfinal_" + t), this.tramoTunel[1] = window["pista0_tunelSpline_" + t], this.tramoTunel[2] = window["pista0_tunelSpline_" + t + "_angulos"], this.tramoTunel[3] = !1, console.log("tramo q agregamos es  " + this.tramoTunel[0].name), this.pista.push(this.tramoTunel)
}, TramosManager.prototype.setTriggersPista = function() {
    for (var t = 0, a = 0; a < this.pista.length; a++)
        for (var i = 0; i < this.pista[a][1].length - 1; i++)
            if (i % 2 != 0) {
                var s = null;
                null == this.pista[a][0].findByName("punto_" + i) ? ((s = new pc.Entity).name = "punto_" + i, this.pista[a][0].addChild(s), s.setLocalPosition(new pc.Vec3(-this.pista[a][1][i].x, this.pista[a][1][i].y - .5, this.pista[a][1][i].z)), s.setLocalEulerAngles(0, 0, 0), s.lookAt(new pc.Vec3(-this.pista[a][1][i + 1].x, this.pista[a][1][i + 1].y - .1, this.pista[a][1][i + 1].z)), s.setLocalEulerAngles(0, s.getLocalEulerAngles().y, 0), s.addComponent("collision", {
                    type: "box",
                    halfExtents: new pc.Vec3(2.5, .2, .2)
                }), s.addComponent("script"), s.script.create("triggerPuntos")) : s = this.pista[a][0].findByName("punto_" + i), s.script.triggerPuntos.punto = t, t += 1, s.script.triggerPuntos.puntosTotales = this.pista[a][1].length, s.script.triggerPuntos.currentPunto = i, s.script.triggerPuntos.tramo = a, "tramo-tunelfinal_playa" == this.pista[a][0].name ? 45 == i || 47 == i || 49 == i || 51 == i ? s.script.triggerPuntos.cambioDomo = !0 : 111 != i && 113 != i && 115 != i && 117 != i || (s.script.triggerPuntos.nuevaMusica = !0) : "tramo-tunelfinal_ciudad" == this.pista[a][0].name ? 27 == i || 29 == i || 31 == i || 33 == i ? s.script.triggerPuntos.cambioDomo = !0 : 91 != i && 93 != i && 95 != i && 97 != i || (s.script.triggerPuntos.nuevaMusica = !0) : "tramo-tunelfinal_desierto" == this.pista[a][0].name && (27 == i || 29 == i || 31 == i || 33 == i ? s.script.triggerPuntos.cambioDomo = !0 : 111 != i && 113 != i && 115 != i && 117 != i || (s.script.triggerPuntos.nuevaMusica = !0))
            }
};
var AutoColorManager = pc.createScript("autoColorManager");
AutoColorManager.attributes.add("materialAutoCarroseria", {
    type: "asset",
    assetType: "material",
    array: !1
}), AutoColorManager.attributes.add("materialAutoRuedas", {
    type: "asset",
    assetType: "material",
    array: !1
}), AutoColorManager.attributes.add("materialAutoVidrios", {
    type: "asset",
    assetType: "material",
    array: !1
}), AutoColorManager.prototype.initialize = function() {}, AutoColorManager.prototype.setColor = function(e) {
    switch (e) {
        case 0:
            this.materialAutoCarroseria.resource.diffuseMapOffset = new pc.Vec2(0, 0), this.materialAutoCarroseria.resource.emissiveMapOffset = new pc.Vec2(0, 0), this.materialAutoRuedas.resource.diffuseMapOffset = new pc.Vec2(0, 0), this.materialAutoRuedas.resource.emissiveMapOffset = new pc.Vec2(0, 0);
            var a = this.materialAutoVidrios.resource.opacityMapOffset;
            this.materialAutoVidrios.resource.diffuseMapOffset = new pc.Vec2(a.x, 0), this.materialAutoVidrios.resource.emissiveMapOffset = new pc.Vec2(a.x, 0), this.materialAutoVidrios.resource.opacityMapOffset = new pc.Vec2(a.x, 0);
            break;
        case 1:
            this.materialAutoCarroseria.resource.diffuseMapOffset = new pc.Vec2(.5, 0), this.materialAutoCarroseria.resource.emissiveMapOffset = new pc.Vec2(.5, 0), this.materialAutoRuedas.resource.diffuseMapOffset = new pc.Vec2(.5, 0), this.materialAutoRuedas.resource.emissiveMapOffset = new pc.Vec2(.5, 0);
            a = this.materialAutoVidrios.resource.opacityMapOffset;
            this.materialAutoVidrios.resource.diffuseMapOffset = new pc.Vec2(a.x, .25), this.materialAutoVidrios.resource.emissiveMapOffset = new pc.Vec2(a.x, .25), this.materialAutoVidrios.resource.opacityMapOffset = new pc.Vec2(a.x, .25);
            break;
        case 2:
            this.materialAutoCarroseria.resource.diffuseMapOffset = new pc.Vec2(0, .5), this.materialAutoCarroseria.resource.emissiveMapOffset = new pc.Vec2(0, .5), this.materialAutoRuedas.resource.diffuseMapOffset = new pc.Vec2(0, .5), this.materialAutoRuedas.resource.emissiveMapOffset = new pc.Vec2(0, .5);
            a = this.materialAutoVidrios.resource.opacityMapOffset;
            this.materialAutoVidrios.resource.diffuseMapOffset = new pc.Vec2(a.x, .5), this.materialAutoVidrios.resource.emissiveMapOffset = new pc.Vec2(a.x, .5), this.materialAutoVidrios.resource.opacityMapOffset = new pc.Vec2(a.x, .5);
            break;
        case 3:
            this.materialAutoCarroseria.resource.diffuseMapOffset = new pc.Vec2(.5, .5), this.materialAutoCarroseria.resource.emissiveMapOffset = new pc.Vec2(.5, .5), this.materialAutoRuedas.resource.diffuseMapOffset = new pc.Vec2(.5, .5), this.materialAutoRuedas.resource.emissiveMapOffset = new pc.Vec2(.5, .5);
            a = this.materialAutoVidrios.resource.opacityMapOffset;
            this.materialAutoVidrios.resource.diffuseMapOffset = new pc.Vec2(a.x, .75), this.materialAutoVidrios.resource.emissiveMapOffset = new pc.Vec2(a.x, .75), this.materialAutoVidrios.resource.opacityMapOffset = new pc.Vec2(a.x, .75)
    }
    this.materialAutoCarroseria.resource.update(), this.materialAutoRuedas.resource.update(), this.materialAutoVidrios.resource.update()
}, AutoColorManager.prototype.setColorTrafico = function(e) {
    switch (e) {
        case 0:
            this.materialAutoCarroseria.resource.diffuseMapOffset = new pc.Vec2(0, 0), this.materialAutoCarroseria.resource.emissiveMapOffset = new pc.Vec2(0, 0);
            break;
        case 1:
            this.materialAutoCarroseria.resource.diffuseMapOffset = new pc.Vec2(.5, 0), this.materialAutoCarroseria.resource.emissiveMapOffset = new pc.Vec2(.5, 0);
            break;
        case 2:
            this.materialAutoCarroseria.resource.diffuseMapOffset = new pc.Vec2(0, .5), this.materialAutoCarroseria.resource.emissiveMapOffset = new pc.Vec2(0, .5);
            break;
        case 3:
            this.materialAutoCarroseria.resource.diffuseMapOffset = new pc.Vec2(.5, .5), this.materialAutoCarroseria.resource.emissiveMapOffset = new pc.Vec2(.5, .5)
    }
    this.materialAutoCarroseria.resource.update()
};
var TweenCamara = pc.createScript("tweenCamara");
TweenCamara.prototype.initialize = function() {
    this.inicioD = this.entity.getLocalPosition().clone(), this.destinoD = new pc.Vec3(.02, .499, .194), this.inicioR = this.entity.getLocalEulerAngles().clone(), this.destinoR = new pc.Vec3(-14.44, 0, 0), this.inicioF = 45, this.destinoF = 49
}, TweenCamara.prototype.rotaCamara = function(t) {
    this.entity.tween(this.entity.getLocalEulerAngles()).rotate(new pc.Vec3(-2.9, t, 0), 8, pc.SineInOut).onComplete((() => {
        this.rotaCamara(-1 * t)
    })).start()
}, TweenCamara.prototype.mueveCamara = function(t) {
    var i = this.entity.getLocalPosition().clone();
    this.entity.tween(this.entity.getLocalPosition()).to(new pc.Vec3(i.x, i.y, i.z + t), 6, pc.SineInOut).onComplete((() => {
        this.mueveCamara(-1 * t)
    })).start()
}, TweenCamara.prototype.animMainToGarage = function() {
    this.entity.tween(this.entity.getLocalEulerAngles()).rotate(this.destinoR, .5, pc.SineInOut).start(), this.entity.tween(this.entity.getLocalPosition()).to(this.destinoD, .5, pc.SineInOut).start();
    var t = {
        x: 45
    };
    this.app.tween(t).to({
        x: 49
    }, .5, pc.SineOut).onUpdate((() => {
        this.entity.camera.fov = t.x
    })).start()
}, TweenCamara.prototype.animGarageToMain = function() {
    this.entity.tween(this.entity.getLocalEulerAngles()).rotate(this.inicioR, .5, pc.SineInOut).start(), this.entity.tween(this.entity.getLocalPosition()).to(this.inicioD, .5, pc.SineInOut).start();
    var t = {
        x: 49
    };
    this.app.tween(t).to({
        x: 45
    }, .5, pc.SineOut).onUpdate((() => {
        this.entity.camera.fov = t.x
    })).start()
}, TweenCamara.prototype.UpdateParams = function(t, i, e) {
    t ? (i > e ? (this.entity.setLocalPosition(.002, .254, .38), this.inicioD = this.entity.getLocalPosition().clone(), this.destinoD = new pc.Vec3(.02, .399, .194), this.entity.camera.fov = 34, this.fovInit = this.entity.camera.fov, this.inicioF = this.fovInit, this.destinoF = this.fovInit + 4) : i <= e && (this.entity.setLocalPosition(.002, .329, .38), this.inicioD = this.entity.getLocalPosition().clone(), this.destinoD = new pc.Vec3(.02, .499, .194), this.entity.camera.fov = 45, this.fovInit = this.entity.camera.fov, this.inicioF = this.fovInit, this.destinoF = this.fovInit + 4), this.animMainToGarage()) : (this.inicioD = this.entity.getLocalPosition().clone(), this.fovInit = this.entity.camera.fov, this.destinoD = new pc.Vec3(.02, 45 == this.fovInit ? .499 : .399, .194), this.inicioF = this.fovInit, this.destinoF = this.fovInit + 4)
};
var AutosManager = pc.createScript("autosManager");
AutosManager.prototype.initialize = function() {}, AutosManager.prototype.getAuto = function() {
    var t = this.entity.children[autoElegido].findByName("AutoContainer");
    _autoControl = t.script.autoControl, this.entity.children[autoElegido].enabled = !0, this.entity.children[autoElegido].findByName("playcanvasFixPivot").setLocalEulerAngles(0, 180, 0), this.entity.children[autoElegido].findByName("playcanvasFixPivot").setLocalPosition(0, 0, 0), this.entity.children[autoElegido].findByName("contenedorCamara").setLocalEulerAngles(0, 0, 0), this.entity.children[autoElegido].findByName("contenedorCamara").setLocalPosition(0, 0, 0), this.entity.children[autoElegido].findByName("pivoteCamara").setLocalEulerAngles(6.63, 0, 0), this.entity.children[autoElegido].findByName("pivoteCamara").setLocalPosition(0, .35, -1), this.entity.children[autoElegido].findByName("pivoteAtAd").setLocalEulerAngles(0, 0, 0), this.entity.children[autoElegido].findByName("pivoteAtAd").setLocalPosition(0, 0, .268), this.entity.children[autoElegido].findByName("camaraDobla").setLocalEulerAngles(0, 0, 0), this.entity.children[autoElegido].findByName("camaraDobla").setLocalPosition(0, 0, 0), this.entity.children[autoElegido].findByName("Camera").setLocalEulerAngles(0, 180, 0), this.entity.children[autoElegido].findByName("Camera").setLocalPosition(0, -.117, .472), this.entity.children[autoElegido].findByName("AutoContainer").setLocalEulerAngles(0, 0, 0), this.entity.children[autoElegido].findByName("AutoContainer").setLocalPosition(0, 0, 0), this.entity.children[autoElegido].findByName("AutoGiro").setLocalEulerAngles(0, 0, 0), this.entity.children[autoElegido].findByName("AutoGiro").setLocalPosition(0, .001, -.08), this.entity.children[autoElegido].findByName("domo").setLocalEulerAngles(0, 180, 0), this.entity.children[autoElegido].findByName("domo").setLocalPosition(0, 4.388, .08), this.entity.children[autoElegido].setLocalPosition(0, .01, 8.977), this.entity.children[autoElegido].setLocalEulerAngles(0, 0, 0), this.entity.setPosition(0, 0, 0), this.entity.setEulerAngles(0, 0, 0), setTimeout(function() {
        _autoControl.init()
    }.bind(this), .16)
}, AutosManager.prototype.apagaAuto = function() {
    this.entity.children[autoElegido].findByName("AutoContainer");
    this.entity.children[autoElegido].enabled = !1
};
var TriggerPuntos = pc.createScript("triggerPuntos");
TriggerPuntos.attributes.add("punto", {
    type: "number",
    default: 0
}), TriggerPuntos.attributes.add("puntosTotales", {
    type: "number",
    default: 0
}), TriggerPuntos.attributes.add("currentPunto", {
    type: "number",
    default: 0
}), TriggerPuntos.attributes.add("tramo", {
    type: "number",
    default: 0
}), TriggerPuntos.attributes.add("cambioDomo", {
    type: "boolean",
    default: !1
}), TriggerPuntos.attributes.add("nuevaMusica", {
    type: "boolean",
    default: !1
}), TriggerPuntos.prototype.initialize = function() {
    this.hiloCambioTramo = null, this.entity.collision.on("triggerenter", this.onTriggerEnter, this)
}, TriggerPuntos.prototype.onTriggerEnter = function(e) {
    if ("carroceria" == e.name) {
        if (currentPosition = this.entity.getPosition().clone(), currentPorcentaje = this.currentPunto / this.puntosTotales, currentTramo = this.tramo, this.cambioDomo) {
            if (null == tramoInicialTematica || tramoInicialTematica.enabled) return;
            switch (currentTematica) {
                case "playa":
                    _autoControl.setSkyBox(0), _sonidos.slot("Music3").stop(), _autoControl.vidrios.script.vidrioControl.setTematica(0), this.app.scene.fogColor = (new pc.Color).fromString("00FFEA");
                    break;
                case "ciudad":
                    _autoControl.setSkyBox(1), _sonidos.slot("Music1").stop(), _sonidos.slot("loopPlaya").stop(), _autoControl.vidrios.script.vidrioControl.setTematica(1), this.app.scene.fogColor = (new pc.Color).fromString("00FFEA");
                    break;
                case "desierto":
                    _autoControl.setSkyBox(2), _sonidos.slot("Music2").stop(), _autoControl.vidrios.script.vidrioControl.setTematica(2), this.app.scene.fogColor = (new pc.Color).fromString("FFF400")
            }
            console.log("prendere el tramo pasando por el tunel " + tramoInicialTematica.name), tramoInicialTematica.enabled = !0, zoneClearedCant += 1, permitirPause = !1, _autoControl.pauseGame = !0, _autoControl.pauseTweens(), _raceScore += 60 * time, _menu.pintarScore(_raceScore), tramoInicialTematica = null, _menu.zoneCompleteMSG.children[1].enabled = !1;
            PrepareInterstitital((() => {
                enGoogle && (console.log("Se llama gamesnack level complete "), GameSnacks.game.levelComplete(zoneClearedCant)), _menu.poneMSG("zoneComplete"), _menu.zoneCompleteMSG.children[1].enabled = !0, addEventFunction(_menu.zoneCompleteMSG.children[1], !0, 1, (() => {
                    playSound("click"), _menu.zoneCompleteMSG.enabled = !1, addEventFunction(_menu.zoneCompleteMSG.children[1], !1), _menu.CountDownMethod(3, (() => {
                        _autoControl.pauseGame = !1, _autoControl.pauseTweens(), permitirPause = !0
                    }))
                }))
            }))
        }
        if (this.nuevaMusica) switch (currentTematica) {
            case "playa":
                _sonidos.slot("Music1").isPlaying || (playSound("Music1", !0), _traficoSystem.newCar(), clearInterval(this.hiloCambioTramo), this.hiloCambioTramo = setInterval(function() {
                    var e = _tramos.pista[currentTramo][0].name;
                    console.log("tratando de cambiar de tramo desde  " + e + " a tematica desierto"), e.includes("tunel") || (_tramos.nuevaTematica("desierto"), clearInterval(this.hiloCambioTramo))
                }.bind(this), 200));
                break;
            case "ciudad":
                _sonidos.slot("Music2").isPlaying || (playSound("Music2", !0), _traficoSystem.newCar(), clearInterval(this.hiloCambioTramo), this.hiloCambioTramo = setInterval(function() {
                    var e = _tramos.pista[currentTramo][0].name;
                    console.log("tratando de cambiar de tramo desde  " + e + " a tematica playa"), e.includes("tunel") || (_tramos.nuevaTematica("playa"), clearInterval(this.hiloCambioTramo))
                }.bind(this), 200));
                break;
            case "desierto":
                _sonidos.slot("Music3").isPlaying || (playSound("Music3", !0), _traficoSystem.newCar(), clearInterval(this.hiloCambioTramo), this.hiloCambioTramo = setInterval(function() {
                    var e = _tramos.pista[currentTramo][0].name;
                    console.log("tratando de cambiar de tramo desde  " + e + " a tematica ciudad"), e.includes("tunel") || (_tramos.nuevaTematica("ciudad"), clearInterval(this.hiloCambioTramo), console.log("cambiado exitoso!"))
                }.bind(this), 200))
        }
        if (currentTramo + 1 < _tramos.pista.length) {
            _tramos.pista[currentTramo + 1][0].enabled || _tramos.pista[currentTramo][0].name.includes("tunel") || tramoInicialTematica != _tramos.pista[currentTramo + 1][0] && null != tramoInicialTematica || (console.log("prendere el tramo " + _tramos.pista[currentTramo + 1][0].name), _tramos.pista[currentTramo + 1][0].enabled = !0);
            var a = this.averiguarTematica(_tramos.pista[currentTramo + 1][0]);
            currentTematica == a || _tramos.pista[currentTramo + 1][0].name.includes("tunel") || (currentTematica = a, _tramos.pista[currentTramo + 1][0].enabled = !1, console.log("apagare el tramo " + _tramos.pista[currentTramo + 1][0].name), tramoInicialTematica = _tramos.pista[currentTramo + 1][0])
        }
    }
}, TriggerPuntos.prototype.averiguarTematica = function(e) {
    return e.name.includes("playa") ? "playa" : e.name.includes("ciudad") ? "ciudad" : e.name.includes("desierto") ? "desierto" : "error"
};
var TraficoSystem = pc.createScript("traficoSystem");
TraficoSystem.attributes.add("autos", {
    type: "entity",
    array: !0
}), TraficoSystem.prototype.initialize = function() {
    _traficoSystem = this, this.pista = null
}, TraficoSystem.prototype.iniciar = function(t) {
    this.pista = t;
    for (var a = 0; a < 4; a++) this.autos[a].enabled = !0;
    for (a = 0; a < this.autos.length; a++) this.autos[a].enabled && (this.autos[a].script.cameraPath.pistas = t, this.autos[a].script.cameraPath.activo = !0, this.autos[a].script.cameraPath.start())
}, TraficoSystem.prototype.newCar = function() {
    console.log("ne car llamado " + this.autos.length), this.pista = _tramos.pista;
    for (var t = 0; t < this.autos.length; t++)
        if (!this.autos[t].enabled) {
            console.log("agregare nuevo auto " + t), this.autos[t].enabled = !0, this.autos[t].script.cameraPath.pistas = this.pista, this.autos[t].script.cameraPath.activo = !0, this.autos[t].script.cameraPath.reStart();
            break
        }
}, TraficoSystem.prototype.matar = function() {
    for (var t = 0; t < this.autos.length; t++) this.autos[t].enabled && (this.autos[t].script.cameraPath.activo = !1, this.autos[t].script.cameraPath.stop())
};
var TriggerPasarAuto = pc.createScript("triggerPasarAuto");
TriggerPasarAuto.attributes.add("punto", {
    type: "number",
    default: 0
}), TriggerPasarAuto.attributes.add("puntosTotales", {
    type: "number",
    default: 0
}), TriggerPasarAuto.attributes.add("currentPunto", {
    type: "number",
    default: 0
}), TriggerPasarAuto.attributes.add("tramo", {
    type: "number",
    default: 0
}), TriggerPasarAuto.prototype.initialize = function() {
    this.activar = !0, this.peligroso = !1, this.entity.collision.on("triggerenter", this.onTriggerEnter, this)
}, TriggerPasarAuto.prototype.onTriggerEnter = function(t) {
    if ("carroceria" == t.name && this.activar) {
        this.activar = !1, console.log("pase al auto rq!");
        var e = Math.floor(Math.random() * delays.length),
            r = delays[e];
        if (delays.splice(e, 1), 0 == delays.length && (delays = [500, 1e3, 2e3, 2500, 3e3, 3500]), this.entity.parent.script.cameraPath.detener(), setTimeout(function() {
                this.entity.parent.script.cameraPath.reposicionar(), setTimeout(function() {
                    this.activar = !0
                }.bind(this), 2e3)
            }.bind(this), r), this.peligroso) {
            this.peligroso = !1;
            var a = 2;
            playSound("pass" + a), _autoControl.recargaTurbo(), _menu.poneMSG("getTurbo"), _raceScore += 250, _menu.pintarScore(_raceScore)
        } else {
            a = 3;
            playSound("pass" + a), _menu.poneMSG("carPass"), _raceScore += 100, _menu.pintarScore(_raceScore)
        }
    }
};
var TriggerPeligroso = pc.createScript("triggerPeligroso");
TriggerPeligroso.attributes.add("pasarAuto", {
    type: "entity"
}), TriggerPeligroso.prototype.initialize = function() {
    this.hilo = null, this.entity.collision.on("triggerenter", this.onTriggerEnter, this)
}, TriggerPeligroso.prototype.onTriggerEnter = function(r) {
    "turboPeligroso" == r.name && (clearInterval(this.hilo), this.pasarAuto.script.triggerPasarAuto.peligroso = !0, this.hilo = setInterval(function() {
        clearInterval(this.hilo), this.pasarAuto.script.triggerPasarAuto.peligroso = !1
    }.bind(this), 1500))
};
var conexionPista1 = [],
    vientoPista1 = [];
vientoPista1[0] = 25, vientoPista1[1] = 124;
var pista1Spline_ciudad = [];
pista1Spline_ciudad[0] = new pc.Vec3(0, 0, 0), pista1Spline_ciudad[1] = new pc.Vec3(0, 0, -.5779418), pista1Spline_ciudad[2] = new pc.Vec3(0, 0, -1.155868), pista1Spline_ciudad[3] = new pc.Vec3(0, 0, -1.73381), pista1Spline_ciudad[4] = new pc.Vec3(0, 0, -2.311752), pista1Spline_ciudad[5] = new pc.Vec3(0, 0, -2.889679), pista1Spline_ciudad[6] = new pc.Vec3(-.005614107, 0, -3.467514), pista1Spline_ciudad[7] = new pc.Vec3(.05468886, .001922607, -4.041946), pista1Spline_ciudad[8] = new pc.Vec3(.1771256, .005500793, -4.606444), pista1Spline_ciudad[9] = new pc.Vec3(.3627949, .01003265, -5.153426), pista1Spline_ciudad[10] = new pc.Vec3(.596926, .01511383, -5.681624), pista1Spline_ciudad[11] = new pc.Vec3(.8824487, .02064466, -6.183638), pista1Spline_ciudad[12] = new pc.Vec3(1.229251, .02645111, -6.64546), pista1Spline_ciudad[13] = new pc.Vec3(1.632205, .03356886, -7.059049), pista1Spline_ciudad[14] = new pc.Vec3(2.083255, .0421977, -7.419903), pista1Spline_ciudad[15] = new pc.Vec3(2.568973, .05262756, -7.732449), pista1Spline_ciudad[16] = new pc.Vec3(3.082645, .06479645, -7.9965), pista1Spline_ciudad[17] = new pc.Vec3(3.618168, .07867432, -8.2129), pista1Spline_ciudad[18] = new pc.Vec3(4.169072, .09439754, -8.386299), pista1Spline_ciudad[19] = new pc.Vec3(4.731084, .1119766, -8.519385), pista1Spline_ciudad[20] = new pc.Vec3(5.300664, .131424, -8.614889), pista1Spline_ciudad[21] = new pc.Vec3(5.875006, .1530228, -8.674123), pista1Spline_ciudad[22] = new pc.Vec3(6.451666, .1768799, -8.70406), pista1Spline_ciudad[23] = new pc.Vec3(7.028937, .2030945, -8.710344), pista1Spline_ciudad[24] = new pc.Vec3(7.606209, .2321091, -8.712631), pista1Spline_ciudad[25] = new pc.Vec3(8.183113, .2648926, -8.713058), pista1Spline_ciudad[26] = new pc.Vec3(8.759774, .3033142, -8.714657), pista1Spline_ciudad[27] = new pc.Vec3(9.336435, .3429794, -8.716349), pista1Spline_ciudad[28] = new pc.Vec3(9.912974, .382576, -8.718085), pista1Spline_ciudad[29] = new pc.Vec3(10.48964, .4197006, -8.719914), pista1Spline_ciudad[30] = new pc.Vec3(11.06642, .4572906, -8.721683), pista1Spline_ciudad[31] = new pc.Vec3(11.64308, .4957886, -8.723313), pista1Spline_ciudad[32] = new pc.Vec3(12.21962, .535202, -8.724837), pista1Spline_ciudad[33] = new pc.Vec3(12.79616, .5747604, -8.726483), pista1Spline_ciudad[34] = new pc.Vec3(13.37282, .6141195, -8.728342), pista1Spline_ciudad[35] = new pc.Vec3(13.94936, .6533585, -8.729897), pista1Spline_ciudad[36] = new pc.Vec3(14.52602, .6924286, -8.73145), pista1Spline_ciudad[37] = new pc.Vec3(15.10268, .7313538, -8.733188), pista1Spline_ciudad[38] = new pc.Vec3(15.67922, .7703323, -8.734925), pista1Spline_ciudad[39] = new pc.Vec3(16.25588, .8092804, -8.736692), pista1Spline_ciudad[40] = new pc.Vec3(16.83254, .8482361, -8.738323), pista1Spline_ciudad[41] = new pc.Vec3(17.40932, .883316, -8.744166), pista1Spline_ciudad[42] = new pc.Vec3(17.98623, .9160528, -8.752266), pista1Spline_ciudad[43] = new pc.Vec3(18.56326, .948288, -8.759635), pista1Spline_ciudad[44] = new pc.Vec3(19.14004, .9821548, -8.772557), pista1Spline_ciudad[45] = new pc.Vec3(19.71658, 1.017624, -8.79111), pista1Spline_ciudad[46] = new pc.Vec3(20.29287, 1.054619, -8.815628), pista1Spline_ciudad[47] = new pc.Vec3(20.86917, 1.091652, -8.837829), pista1Spline_ciudad[48] = new pc.Vec3(21.44522, 1.128852, -8.864529), pista1Spline_ciudad[49] = new pc.Vec3(22.01822, 1.167839, -8.927912), pista1Spline_ciudad[50] = new pc.Vec3(22.59097, 1.207168, -8.994072), pista1Spline_ciudad[51] = new pc.Vec3(23.16372, 1.245956, -9.060339), pista1Spline_ciudad[52] = new pc.Vec3(23.73038, 1.281029, -9.168369), pista1Spline_ciudad[53] = new pc.Vec3(24.28897, 1.312691, -9.31238), pista1Spline_ciudad[54] = new pc.Vec3(24.83865, 1.341042, -9.488816), pista1Spline_ciudad[55] = new pc.Vec3(25.39163, 1.369888, -9.653045), pista1Spline_ciudad[56] = new pc.Vec3(25.93228, 1.396087, -9.853925), pista1Spline_ciudad[57] = new pc.Vec3(26.44351, 1.417304, -10.12252), pista1Spline_ciudad[58] = new pc.Vec3(26.96024, 1.439195, -10.38024), pista1Spline_ciudad[59] = new pc.Vec3(27.47061, 1.461159, -10.65017), pista1Spline_ciudad[60] = new pc.Vec3(27.9606, 1.482773, -10.95568), pista1Spline_ciudad[61] = new pc.Vec3(28.4368, 1.504288, -11.28242), pista1Spline_ciudad[62] = new pc.Vec3(28.90189, 1.525322, -11.62493), pista1Spline_ciudad[63] = new pc.Vec3(29.36466, 1.545586, -11.97043), pista1Spline_ciudad[64] = new pc.Vec3(29.7902, 1.562248, -12.36035), pista1Spline_ciudad[65] = new pc.Vec3(30.18485, 1.576485, -12.7823), pista1Spline_ciudad[66] = new pc.Vec3(30.58878, 1.592392, -13.19533), pista1Spline_ciudad[67] = new pc.Vec3(30.96622, 1.610992, -13.6322), pista1Spline_ciudad[68] = new pc.Vec3(31.31388, 1.632278, -14.09341), pista1Spline_ciudad[69] = new pc.Vec3(31.65946, 1.655098, -14.55609), pista1Spline_ciudad[70] = new pc.Vec3(31.97868, 1.677482, -15.03706), pista1Spline_ciudad[71] = new pc.Vec3(32.26249, 1.698424, -15.54002), pista1Spline_ciudad[72] = new pc.Vec3(32.52287, 1.718496, -16.0555), pista1Spline_ciudad[73] = new pc.Vec3(32.76469, 1.739538, -16.58001), pista1Spline_ciudad[74] = new pc.Vec3(32.9915, 1.762886, -17.11095), pista1Spline_ciudad[75] = new pc.Vec3(33.17912, 1.790342, -17.65674), pista1Spline_ciudad[76] = new pc.Vec3(33.34575, 1.81999, -18.20935), pista1Spline_ciudad[77] = new pc.Vec3(33.51249, 1.850183, -18.76183), pista1Spline_ciudad[78] = new pc.Vec3(33.62797, 1.879347, -19.32703), pista1Spline_ciudad[79] = new pc.Vec3(33.70976, 1.907578, -19.89845), pista1Spline_ciudad[80] = new pc.Vec3(33.79179, 1.934883, -20.46984), pista1Spline_ciudad[81] = new pc.Vec3(33.83708, 1.965796, -21.04501), pista1Spline_ciudad[82] = new pc.Vec3(33.84795, 2.000153, -21.62178), pista1Spline_ciudad[83] = new pc.Vec3(33.83708, 2.036674, -22.1984), pista1Spline_ciudad[84] = new pc.Vec3(33.80938, 2.074898, -22.7744), pista1Spline_ciudad[85] = new pc.Vec3(33.76116, 2.114883, -23.34885), pista1Spline_ciudad[86] = new pc.Vec3(33.66069, 2.158676, -23.91614), pista1Spline_ciudad[87] = new pc.Vec3(33.55328, 2.203514, -24.48213), pista1Spline_ciudad[88] = new pc.Vec3(33.44976, 2.248688, -25.04876), pista1Spline_ciudad[89] = new pc.Vec3(33.26983, 2.297325, -25.59529), pista1Spline_ciudad[90] = new pc.Vec3(33.0667, 2.34713, -26.13398), pista1Spline_ciudad[91] = new pc.Vec3(32.87176, 2.396955, -26.67574), pista1Spline_ciudad[92] = new pc.Vec3(32.63494, 2.448364, -27.20024), pista1Spline_ciudad[93] = new pc.Vec3(32.3692, 2.500771, -27.71074), pista1Spline_ciudad[94] = new pc.Vec3(32.08612, 2.553881, -28.21176), pista1Spline_ciudad[95] = new pc.Vec3(31.78876, 2.606285, -28.70449), pista1Spline_ciudad[96] = new pc.Vec3(31.46832, 2.657265, -29.18261), pista1Spline_ciudad[97] = new pc.Vec3(31.10651, 2.705286, -29.63054), pista1Spline_ciudad[98] = new pc.Vec3(30.74616, 2.753677, -30.07974), pista1Spline_ciudad[99] = new pc.Vec3(30.37592, 2.802414, -30.52036), pista1Spline_ciudad[100] = new pc.Vec3(29.94697, 2.849714, -30.90442), pista1Spline_ciudad[101] = new pc.Vec3(29.51362, 2.896963, -31.28372), pista1Spline_ciudad[102] = new pc.Vec3(29.08015, 2.943832, -31.66296), pista1Spline_ciudad[103] = new pc.Vec3(28.61213, 2.986589, -31.99895), pista1Spline_ciudad[104] = new pc.Vec3(28.13069, 3.027649, -32.31607), pista1Spline_ciudad[105] = new pc.Vec3(27.64167, 3.067852, -32.62135), pista1Spline_ciudad[106] = new pc.Vec3(27.13484, 3.106453, -32.89614), pista1Spline_ciudad[107] = new pc.Vec3(26.61543, 3.143669, -33.14672), pista1Spline_ciudad[108] = new pc.Vec3(26.08638, 3.179569, -33.37637), pista1Spline_ciudad[109] = new pc.Vec3(25.54609, 3.215843, -33.5782), pista1Spline_ciudad[110] = new pc.Vec3(24.99641, 3.25222, -33.75262), pista1Spline_ciudad[111] = new pc.Vec3(24.43843, 3.28862, -33.89872), pista1Spline_ciudad[112] = new pc.Vec3(23.87532, 3.325424, -34.02323), pista1Spline_ciudad[113] = new pc.Vec3(23.30696, 3.362335, -34.12047), pista1Spline_ciudad[114] = new pc.Vec3(22.73299, 3.398888, -34.17714), pista1Spline_ciudad[115] = new pc.Vec3(22.15743, 3.43573, -34.2126), pista1Spline_ciudad[116] = new pc.Vec3(21.58089, 3.472786, -34.22558), pista1Spline_ciudad[117] = new pc.Vec3(21.0046, 3.509796, -34.20272), pista1Spline_ciudad[118] = new pc.Vec3(20.42989, 3.546989, -34.1552), pista1Spline_ciudad[119] = new pc.Vec3(19.85763, 3.584328, -34.08413), pista1Spline_ciudad[120] = new pc.Vec3(19.29122, 3.621735, -33.97605), pista1Spline_ciudad[121] = new pc.Vec3(18.72958, 3.659332, -33.8454), pista1Spline_ciudad[122] = new pc.Vec3(18.17233, 3.697151, -33.69728), pista1Spline_ciudad[123] = new pc.Vec3(17.62948, 3.73481, -33.50284), pista1Spline_ciudad[124] = new pc.Vec3(17.09518, 3.772606, -33.28608), pista1Spline_ciudad[125] = new pc.Vec3(16.56222, 3.810966, -33.06596), pista1Spline_ciudad[126] = new pc.Vec3(16.05551, 3.848923, -32.7914), pista1Spline_ciudad[127] = new pc.Vec3(15.5643, 3.886814, -32.48933), pista1Spline_ciudad[128] = new pc.Vec3(15.06613, 3.925663, -32.19898), pista1Spline_ciudad[129] = new pc.Vec3(14.6047, 3.963751, -31.85429), pista1Spline_ciudad[130] = new pc.Vec3(14.17148, 4.00144, -31.47361), pista1Spline_ciudad[131] = new pc.Vec3(13.72494, 4.040876, -31.10895), pista1Spline_ciudad[132] = new pc.Vec3(13.31625, 4.079826, -30.70304), pista1Spline_ciudad[133] = new pc.Vec3(12.9476, 4.117979, -30.25962), pista1Spline_ciudad[134] = new pc.Vec3(12.56711, 4.157339, -29.82634), pista1Spline_ciudad[135] = new pc.Vec3(12.22104, 4.196604, -29.36578), pista1Spline_ciudad[136] = new pc.Vec3(11.92282, 4.235146, -28.87236), pista1Spline_ciudad[137] = new pc.Vec3(11.6196, 4.274733, -28.38197), pista1Spline_ciudad[138] = new pc.Vec3(11.34592, 4.314468, -27.87489), pista1Spline_ciudad[139] = new pc.Vec3(11.12314, 4.353722, -27.34311), pista1Spline_ciudad[140] = new pc.Vec3(10.90512, 4.393654, -26.80939), pista1Spline_ciudad[141] = new pc.Vec3(10.71311, 4.429771, -26.2657), pista1Spline_ciudad[142] = new pc.Vec3(10.57151, 4.456505, -25.7061), pista1Spline_ciudad[143] = new pc.Vec3(10.44407, 4.481733, -25.14299), pista1Spline_ciudad[144] = new pc.Vec3(10.3408, 4.506126, -24.57503), pista1Spline_ciudad[145] = new pc.Vec3(10.28611, 4.530602, -24.00032), pista1Spline_ciudad[146] = new pc.Vec3(10.25217, 4.55422, -23.4239), pista1Spline_ciudad[147] = new pc.Vec3(10.24168, 4.575439, -22.84657), pista1Spline_ciudad[148] = new pc.Vec3(10.27634, 4.589455, -22.26995), pista1Spline_ciudad[149] = new pc.Vec3(10.33701, 4.599634, -21.69532), pista1Spline_ciudad[150] = new pc.Vec3(10.42087, 4.606348, -21.12363), pista1Spline_ciudad[151] = new pc.Vec3(10.54075, 4.607338, -20.55834), pista1Spline_ciudad[152] = new pc.Vec3(10.68772, 4.604355, -19.99944), pista1Spline_ciudad[153] = new pc.Vec3(10.85837, 4.598091, -19.44743), pista1Spline_ciudad[154] = new pc.Vec3(11.06577, 4.586348, -18.9082), pista1Spline_ciudad[155] = new pc.Vec3(11.30478, 4.571016, -18.38232), pista1Spline_ciudad[156] = new pc.Vec3(11.57175, 4.553574, -17.87014), pista1Spline_ciudad[157] = new pc.Vec3(11.86533, 4.534988, -17.37269), pista1Spline_ciudad[158] = new pc.Vec3(12.1876, 4.51454, -16.89348), pista1Spline_ciudad[159] = new pc.Vec3(12.54123, 4.491386, -16.43712), pista1Spline_ciudad[160] = new pc.Vec3(12.91501, 4.466941, -15.99699), pista1Spline_ciudad[161] = new pc.Vec3(13.31101, 4.440604, -15.57709), pista1Spline_ciudad[162] = new pc.Vec3(13.73825, 4.410688, -15.18921), pista1Spline_ciudad[163] = new pc.Vec3(14.17587, 4.379935, -14.81302), pista1Spline_ciudad[164] = new pc.Vec3(14.62704, 4.348648, -14.45348), pista1Spline_ciudad[165] = new pc.Vec3(15.11935, 4.316177, -14.15302), pista1Spline_ciudad[166] = new pc.Vec3(15.62533, 4.283256, -13.8758), pista1Spline_ciudad[167] = new pc.Vec3(16.1384, 4.250924, -13.61192), pista1Spline_ciudad[168] = new pc.Vec3(16.66952, 4.229087, -13.38542), pista1Spline_ciudad[169] = new pc.Vec3(17.20822, 4.211311, -13.17701), pista1Spline_ciudad[170] = new pc.Vec3(17.74936, 4.194037, -12.97494), pista1Spline_ciudad[171] = new pc.Vec3(18.30795, 4.175445, -12.82942), pista1Spline_ciudad[172] = new pc.Vec3(18.87325, 4.156502, -12.71066), pista1Spline_ciudad[173] = new pc.Vec3(19.4371, 4.138222, -12.58533), pista1Spline_ciudad[174] = new pc.Vec3(20.00179, 4.119614, -12.46362), pista1Spline_ciudad[175] = new pc.Vec3(20.5693, 4.099777, -12.35635), pista1Spline_ciudad[176] = new pc.Vec3(21.14242, 4.077027, -12.28618), pista1Spline_ciudad[177] = new pc.Vec3(21.71651, 4.053857, -12.22396), pista1Spline_ciudad[178] = new pc.Vec3(22.29147, 4.029954, -12.16974), pista1Spline_ciudad[179] = new pc.Vec3(22.86764, 4.003579, -12.13421), pista1Spline_ciudad[180] = new pc.Vec3(23.44454, 3.974769, -12.11625), pista1Spline_ciudad[181] = new pc.Vec3(24.02157, 3.943542, -12.11567), pista1Spline_ciudad[182] = new pc.Vec3(24.59847, 3.910493, -12.12858), pista1Spline_ciudad[183] = new pc.Vec3(25.17403, 3.875794, -12.16561), pista1Spline_ciudad[184] = new pc.Vec3(25.74715, 3.839629, -12.23072), pista1Spline_ciudad[185] = new pc.Vec3(26.31697, 3.802924, -12.31993), pista1Spline_ciudad[186] = new pc.Vec3(26.88326, 3.765473, -12.42894), pista1Spline_ciudad[187] = new pc.Vec3(27.44612, 3.727263, -12.55402), pista1Spline_ciudad[188] = new pc.Vec3(28.00582, 3.688271, -12.69295), pista1Spline_ciudad[189] = new pc.Vec3(28.56184, 3.648369, -12.8451), pista1Spline_ciudad[190] = new pc.Vec3(29.11433, 3.607558, -13.00967), pista1Spline_ciudad[191] = new pc.Vec3(29.66279, 3.565574, -13.18704), pista1Spline_ciudad[192] = new pc.Vec3(30.20662, 3.522255, -13.37756), pista1Spline_ciudad[193] = new pc.Vec3(30.74556, 3.477462, -13.58151), pista1Spline_ciudad[194] = new pc.Vec3(31.27827, 3.43087, -13.80072), pista1Spline_ciudad[195] = new pc.Vec3(31.80305, 3.382033, -14.03766), pista1Spline_ciudad[196] = new pc.Vec3(32.31782, 3.330513, -14.29528), pista1Spline_ciudad[197] = new pc.Vec3(32.81208, 3.273949, -14.58897), pista1Spline_ciudad[198] = new pc.Vec3(33.28095, 3.212051, -14.92088), pista1Spline_ciudad[199] = new pc.Vec3(33.72565, 3.145926, -15.28375), pista1Spline_ciudad[200] = new pc.Vec3(34.15058, 3.076744, -15.66936), pista1Spline_ciudad[201] = new pc.Vec3(34.55793, 3.005112, -16.07297), pista1Spline_ciudad[202] = new pc.Vec3(34.95002, 2.931633, -16.4911), pista1Spline_ciudad[203] = new pc.Vec3(35.32697, 2.856438, -16.9226), pista1Spline_ciudad[204] = new pc.Vec3(35.68915, 2.779732, -17.36642), pista1Spline_ciudad[205] = new pc.Vec3(36.03607, 2.701607, -17.82192), pista1Spline_ciudad[206] = new pc.Vec3(36.36688, 2.622078, -18.28905), pista1Spline_ciudad[207] = new pc.Vec3(36.68048, 2.54129, -18.76767), pista1Spline_ciudad[208] = new pc.Vec3(36.9743, 2.4592, -19.25854), pista1Spline_ciudad[209] = new pc.Vec3(37.24505, 2.375748, -19.76217), pista1Spline_ciudad[210] = new pc.Vec3(37.48931, 2.291082, -20.27897), pista1Spline_ciudad[211] = new pc.Vec3(37.6906, 2.204832, -20.81356), pista1Spline_ciudad[212] = new pc.Vec3(37.85027, 2.117617, -21.36206), pista1Spline_ciudad[213] = new pc.Vec3(37.97856, 2.030401, -21.91868), pista1Spline_ciudad[214] = new pc.Vec3(38.09184, 1.94339, -22.47869), pista1Spline_ciudad[215] = new pc.Vec3(38.19231, 1.856567, -23.04112), pista1Spline_ciudad[216] = new pc.Vec3(38.26164, 1.770164, -23.60826), pista1Spline_ciudad[217] = new pc.Vec3(38.30302, 1.684204, -24.17822), pista1Spline_ciudad[218] = new pc.Vec3(38.31852, 1.598732, -24.74956), pista1Spline_ciudad[219] = new pc.Vec3(38.32413, 1.513414, -25.32114), pista1Spline_ciudad[220] = new pc.Vec3(38.32365, 1.428049, -25.89271), pista1Spline_ciudad[221] = new pc.Vec3(38.32169, 1.342445, -26.46426), pista1Spline_ciudad[222] = new pc.Vec3(38.31937, 1.256905, -27.03584), pista1Spline_ciudad[223] = new pc.Vec3(38.31705, 1.172455, -27.60755), pista1Spline_ciudad[224] = new pc.Vec3(38.31522, 1.089798, -28.17954), pista1Spline_ciudad[225] = new pc.Vec3(38.31351, 1.016434, -28.75279), pista1Spline_ciudad[226] = new pc.Vec3(38.31179, .9497375, -29.32689), pista1Spline_ciudad[227] = new pc.Vec3(38.31009, .8843918, -29.90111), pista1Spline_ciudad[228] = new pc.Vec3(38.30838, .818634, -30.47527), pista1Spline_ciudad[229] = new pc.Vec3(38.30655, .7542801, -31.04958), pista1Spline_ciudad[230] = new pc.Vec3(38.30495, .6988831, -31.62487), pista1Spline_ciudad[231] = new pc.Vec3(38.30312, .6487198, -32.20063), pista1Spline_ciudad[232] = new pc.Vec3(38.30141, .6026917, -32.77673), pista1Spline_ciudad[233] = new pc.Vec3(38.29971, .5583954, -33.35295), pista1Spline_ciudad[234] = new pc.Vec3(38.298, .516655, -33.92937), pista1Spline_ciudad[235] = new pc.Vec3(38.29616, .4777451, -34.50597), pista1Spline_ciudad[236] = new pc.Vec3(38.29445, .4426117, -35.08285), pista1Spline_ciudad[237] = new pc.Vec3(38.29274, .408989, -35.65982), pista1Spline_ciudad[238] = new pc.Vec3(38.29103, .3750916, -36.23675), pista1Spline_ciudad[239] = new pc.Vec3(38.2892, .3411102, -36.81369), pista1Spline_ciudad[240] = new pc.Vec3(38.28749, .310585, -37.39079), pista1Spline_ciudad[241] = new pc.Vec3(38.28578, .2889709, -37.96832), pista1Spline_ciudad[242] = new pc.Vec3(38.28408, .2682648, -38.54587), pista1Spline_ciudad[243] = new pc.Vec3(38.28237, .246685, -39.1234), pista1Spline_ciudad[244] = new pc.Vec3(38.28054, .2205276, -39.70073), pista1Spline_ciudad[245] = new pc.Vec3(38.27882, .1981506, -40.27823), pista1Spline_ciudad[246] = new pc.Vec3(38.27712, .1797333, -40.85588), pista1Spline_ciudad[247] = new pc.Vec3(38.27528, .1619644, -41.43353), pista1Spline_ciudad[248] = new pc.Vec3(38.27357, .1444588, -42.01122), pista1Spline_ciudad[249] = new pc.Vec3(38.27174, .1268616, -42.58886), pista1Spline_ciudad[250] = new pc.Vec3(38.27003, .1088638, -43.16653), pista1Spline_ciudad[251] = new pc.Vec3(38.26833, .08950043, -43.74414), pista1Spline_ciudad[252] = new pc.Vec3(38.26649, .06845856, -44.32168), pista1Spline_ciudad[253] = new pc.Vec3(38.26479, .04924011, -44.89933), pista1Spline_ciudad[254] = new pc.Vec3(38.26308, .0326767, -45.47704), pista1Spline_ciudad[255] = new pc.Vec3(38.26137, .01967239, -46.05479), pista1Spline_ciudad[256] = new pc.Vec3(38.25954, .009544373, -46.63266), pista1Spline_ciudad[257] = new pc.Vec3(38.25771, .002838135, -47.21054), pista1Spline_ciudad[258] = new pc.Vec3(38.25612, 0, -47.78847), pista1Spline_ciudad[259] = new pc.Vec3(38.25441, 0, -48.36641), pista1Spline_ciudad[260] = new pc.Vec3(38.25258, 0, -48.94432), pista1Spline_ciudad[261] = new pc.Vec3(38.25063, 0, -49.52226), pista1Spline_ciudad[262] = new pc.Vec3(38.25002, 0, -50.1002), pista1Spline_ciudad[263] = new pc.Vec3(38.25014, 0, -50.67815);
var pista1Spline_ciudad_angulos = [];
pista1Spline_ciudad_angulos[0] = new pc.Vec3(0, 0, 0), pista1Spline_ciudad_angulos[1] = new pc.Vec3(270.0198, 179.9988, 0), pista1Spline_ciudad_angulos[2] = new pc.Vec3(270, 179.9988, 0), pista1Spline_ciudad_angulos[3] = new pc.Vec3(270, 179.9988, 0), pista1Spline_ciudad_angulos[4] = new pc.Vec3(270, 180.0449, 0), pista1Spline_ciudad_angulos[5] = new pc.Vec3(270, 180.6661, 0), pista1Spline_ciudad_angulos[6] = new pc.Vec3(270.0626, 177.9732, 0), pista1Spline_ciudad_angulos[7] = new pc.Vec3(270.2974, 351.0541, 179.8184), pista1Spline_ciudad_angulos[8] = new pc.Vec3(270.3991, 344.5577, 179.8817), pista1Spline_ciudad_angulos[9] = new pc.Vec3(270.485, 338.4779, 179.9151), pista1Spline_ciudad_angulos[10] = new pc.Vec3(270.5249, 333.75, 179.932), pista1Spline_ciudad_angulos[11] = new pc.Vec3(270.5634, 326.6916, 179.9488), pista1Spline_ciudad_angulos[12] = new pc.Vec3(270.6187, 319.589, 179.9625), pista1Spline_ciudad_angulos[13] = new pc.Vec3(270.7798, 311.9203, 179.9779), pista1Spline_ciudad_angulos[14] = new pc.Vec3(270.9479, 305.7911, 179.9879), pista1Spline_ciudad_angulos[15] = new pc.Vec3(271.1177, 299.8586, 179.9918), pista1Spline_ciudad_angulos[16] = new pc.Vec3(271.2942, 294.4799, 179.9955), pista1Spline_ciudad_angulos[17] = new pc.Vec3(271.4685, 289.7858, 179.997), pista1Spline_ciudad_angulos[18] = new pc.Vec3(271.6466, 285.2321, 179.9988), pista1Spline_ciudad_angulos[19] = new pc.Vec3(271.8378, 281.4041, 179.999), pista1Spline_ciudad_angulos[20] = new pc.Vec3(272.0364, 277.7679, 179.9996), pista1Spline_ciudad_angulos[21] = new pc.Vec3(272.2449, 274.1305, 180.0002), pista1Spline_ciudad_angulos[22] = new pc.Vec3(272.4825, 271.7217, 179.9998), pista1Spline_ciudad_angulos[23] = new pc.Vec3(272.7411, 270.2245, 179.9999), pista1Spline_ciudad_angulos[24] = new pc.Vec3(273.0095, 270.0374, 180), pista1Spline_ciudad_angulos[25] = new pc.Vec3(273.562, 270.1354, 180), pista1Spline_ciudad_angulos[26] = new pc.Vec3(273.9266, 270.1672, 180), pista1Spline_ciudad_angulos[27] = new pc.Vec3(273.9838, 270.1701, 180), pista1Spline_ciudad_angulos[28] = new pc.Vec3(273.7944, 270.1787, 180), pista1Spline_ciudad_angulos[29] = new pc.Vec3(273.6553, 270.1845, 180), pista1Spline_ciudad_angulos[30] = new pc.Vec3(273.7845, 270.173, 179.9999), pista1Spline_ciudad_angulos[31] = new pc.Vec3(273.8604, 270.1586, 180), pista1Spline_ciudad_angulos[32] = new pc.Vec3(273.9366, 270.15, 180), pista1Spline_ciudad_angulos[33] = new pc.Vec3(273.9135, 270.1845, 179.9999), pista1Spline_ciudad_angulos[34] = new pc.Vec3(273.8992, 270.1731, 179.9999), pista1Spline_ciudad_angulos[35] = new pc.Vec3(273.882, 270.1413, 179.9999), pista1Spline_ciudad_angulos[36] = new pc.Vec3(273.8719, 270.1701, 180), pista1Spline_ciudad_angulos[37] = new pc.Vec3(273.8604, 270.1759, 179.9999), pista1Spline_ciudad_angulos[38] = new pc.Vec3(273.8676, 270.173, 179.9999), pista1Spline_ciudad_angulos[39] = new pc.Vec3(273.895, 270.1414, 179.9999), pista1Spline_ciudad_angulos[40] = new pc.Vec3(273.7227, 270.3113, 179.9999), pista1Spline_ciudad_angulos[41] = new pc.Vec3(273.2888, 270.7804, 180.0003), pista1Spline_ciudad_angulos[42] = new pc.Vec3(273.2344, 270.7258, 180.0001), pista1Spline_ciudad_angulos[43] = new pc.Vec3(273.2428, 270.9274, 180.0002), pista1Spline_ciudad_angulos[44] = new pc.Vec3(273.4472, 271.5847, 180.0001), pista1Spline_ciudad_angulos[45] = new pc.Vec3(273.5925, 272.1357, 179.9998), pista1Spline_ciudad_angulos[46] = new pc.Vec3(273.7018, 272.5567, 180.0001), pista1Spline_ciudad_angulos[47] = new pc.Vec3(273.6478, 271.7756, 179.9999), pista1Spline_ciudad_angulos[48] = new pc.Vec3(273.7806, 274.4783, 180), pista1Spline_ciudad_angulos[49] = new pc.Vec3(273.9041, 277.2138, 179.9998), pista1Spline_ciudad_angulos[50] = new pc.Vec3(273.9315, 275.7517, 180.0002), pista1Spline_ciudad_angulos[51] = new pc.Vec3(273.6691, 278.6642, 180), pista1Spline_ciudad_angulos[52] = new pc.Vec3(273.3124, 282.5891, 179.9997), pista1Spline_ciudad_angulos[53] = new pc.Vec3(272.9343, 286.6537, 179.9992), pista1Spline_ciudad_angulos[54] = new pc.Vec3(272.8036, 287.7411, 179.9991), pista1Spline_ciudad_angulos[55] = new pc.Vec3(272.8313, 286.7061, 179.9992), pista1Spline_ciudad_angulos[56] = new pc.Vec3(272.2798, 295.2132, 179.9974), pista1Spline_ciudad_angulos[57] = new pc.Vec3(272.0931, 297.9541, 179.9961), pista1Spline_ciudad_angulos[58] = new pc.Vec3(272.1903, 296.1461, 179.9968), pista1Spline_ciudad_angulos[59] = new pc.Vec3(272.1617, 300.2399, 179.9958), pista1Spline_ciudad_angulos[60] = new pc.Vec3(272.1307, 303.2797, 179.9951), pista1Spline_ciudad_angulos[61] = new pc.Vec3(272.1255, 305.7128, 179.9944), pista1Spline_ciudad_angulos[62] = new pc.Vec3(272.0491, 306.3904, 179.9937), pista1Spline_ciudad_angulos[63] = new pc.Vec3(271.8983, 308.5719, 179.9926), pista1Spline_ciudad_angulos[64] = new pc.Vec3(271.4164, 316.1207, 179.9859), pista1Spline_ciudad_angulos[65] = new pc.Vec3(271.517, 316.118, 179.9866), pista1Spline_ciudad_angulos[66] = new pc.Vec3(271.6672, 316.5185, 179.9874), pista1Spline_ciudad_angulos[67] = new pc.Vec3(272.0148, 321.8161, 179.9878), pista1Spline_ciudad_angulos[68] = new pc.Vec3(272.1759, 323.2344, 179.9884), pista1Spline_ciudad_angulos[69] = new pc.Vec3(272.3014, 324.1401, 179.9882), pista1Spline_ciudad_angulos[70] = new pc.Vec3(272.126, 328.8688, 179.9853), pista1Spline_ciudad_angulos[71] = new pc.Vec3(272.0506, 331.8728, 179.9829), pista1Spline_ciudad_angulos[72] = new pc.Vec3(271.9703, 334.5041, 179.9811), pista1Spline_ciudad_angulos[73] = new pc.Vec3(272.1979, 335.7915, 179.9829), pista1Spline_ciudad_angulos[74] = new pc.Vec3(272.4885, 338.6341, 179.9836), pista1Spline_ciudad_angulos[75] = new pc.Vec3(272.9014, 342.9243, 179.984), pista1Spline_ciudad_angulos[76] = new pc.Vec3(272.9634, 342.7296, 179.9847), pista1Spline_ciudad_angulos[77] = new pc.Vec3(272.971, 345.1021, 179.9836), pista1Spline_ciudad_angulos[78] = new pc.Vec3(272.8257, 351.2304, 179.9805), pista1Spline_ciudad_angulos[79] = new pc.Vec3(272.7504, 351.5591, 179.9797), pista1Spline_ciudad_angulos[80] = new pc.Vec3(272.8084, 353.1388, 179.9794), pista1Spline_ciudad_angulos[81] = new pc.Vec3(273.2788, 357.6446, 179.981), pista1Spline_ciudad_angulos[82] = new pc.Vec3(273.5109, 359.9264, 179.9814), pista1Spline_ciudad_angulos[83] = new pc.Vec3(273.7242, 2.139856, 179.9819), pista1Spline_ciudad_angulos[84] = new pc.Vec3(273.8464, 3.270953, 179.9821), pista1Spline_ciudad_angulos[85] = new pc.Vec3(274.1513, 7.234964, 179.9824), pista1Spline_ciudad_angulos[86] = new pc.Vec3(274.4623, 11.6358, 179.9825), pista1Spline_ciudad_angulos[87] = new pc.Vec3(274.4088, 9.28791, 179.9829), pista1Spline_ciudad_angulos[88] = new pc.Vec3(274.6442, 13.65454, 179.9827), pista1Spline_ciudad_angulos[89] = new pc.Vec3(274.9418, 21.14169, 179.9821), pista1Spline_ciudad_angulos[90] = new pc.Vec3(274.9179, 19.38917, 179.9824), pista1Spline_ciudad_angulos[91] = new pc.Vec3(275.012, 21.61224, 179.9823), pista1Spline_ciudad_angulos[92] = new pc.Vec3(275.1653, 26.42571, 179.9818), pista1Spline_ciudad_angulos[93] = new pc.Vec3(275.2452, 28.40205, 179.9817), pista1Spline_ciudad_angulos[94] = new pc.Vec3(275.2493, 30.47869, 179.9814), pista1Spline_ciudad_angulos[95] = new pc.Vec3(275.1594, 31.90379, 179.9808), pista1Spline_ciudad_angulos[96] = new pc.Vec3(274.9083, 36.61403, 179.9788), pista1Spline_ciudad_angulos[97] = new pc.Vec3(274.7251, 39.91171, 179.9774), pista1Spline_ciudad_angulos[98] = new pc.Vec3(274.8588, 37.8539, 179.9784), pista1Spline_ciudad_angulos[99] = new pc.Vec3(274.7751, 44.26789, 179.9769), pista1Spline_ciudad_angulos[100] = new pc.Vec3(274.6468, 50.00938, 179.9753), pista1Spline_ciudad_angulos[101] = new pc.Vec3(274.7401, 47.64752, 179.9762), pista1Spline_ciudad_angulos[102] = new pc.Vec3(274.4663, 51.50767, 179.9741), pista1Spline_ciudad_angulos[103] = new pc.Vec3(274.097, 56.2167, 179.971), pista1Spline_ciudad_angulos[104] = new pc.Vec3(274.0533, 56.94328, 179.9705), pista1Spline_ciudad_angulos[105] = new pc.Vec3(273.9135, 59.7074, 179.9691), pista1Spline_ciudad_angulos[106] = new pc.Vec3(273.7505, 63.14296, 179.9672), pista1Spline_ciudad_angulos[107] = new pc.Vec3(273.6137, 65.30256, 179.9656), pista1Spline_ciudad_angulos[108] = new pc.Vec3(273.5631, 68.02786, 179.9648), pista1Spline_ciudad_angulos[109] = new pc.Vec3(273.6038, 71.00677, 179.965), pista1Spline_ciudad_angulos[110] = new pc.Vec3(273.6126, 73.90709, 179.9647), pista1Spline_ciudad_angulos[111] = new pc.Vec3(273.6212, 76.6254, 179.9646), pista1Spline_ciudad_angulos[112] = new pc.Vec3(273.6663, 78.60646, 179.9649), pista1Spline_ciudad_angulos[113] = new pc.Vec3(273.6468, 82.44742, 179.9645), pista1Spline_ciudad_angulos[114] = new pc.Vec3(273.6282, 85.8007, 179.9642), pista1Spline_ciudad_angulos[115] = new pc.Vec3(273.6713, 87.3261, 179.9646), pista1Spline_ciudad_angulos[116] = new pc.Vec3(273.6765, 90.53116, 179.9646), pista1Spline_ciudad_angulos[117] = new pc.Vec3(273.6748, 93.77858, 179.9646), pista1Spline_ciudad_angulos[118] = new pc.Vec3(273.7039, 95.69871, 179.965), pista1Spline_ciudad_angulos[119] = new pc.Vec3(273.7088, 98.88425, 179.9652), pista1Spline_ciudad_angulos[120] = new pc.Vec3(273.7119, 102.3956, 179.9654), pista1Spline_ciudad_angulos[121] = new pc.Vec3(273.7465, 103.6119, 179.9657), pista1Spline_ciudad_angulos[122] = new pc.Vec3(273.7512, 107.0055, 179.966), pista1Spline_ciudad_angulos[123] = new pc.Vec3(273.7211, 111.7934, 179.9663), pista1Spline_ciudad_angulos[124] = new pc.Vec3(273.7881, 111.6874, 179.9669), pista1Spline_ciudad_angulos[125] = new pc.Vec3(273.8037, 114.692, 179.9674), pista1Spline_ciudad_angulos[126] = new pc.Vec3(273.7332, 121.4658, 179.9677), pista1Spline_ciudad_angulos[127] = new pc.Vec3(273.8218, 120.353, 179.9683), pista1Spline_ciudad_angulos[128] = new pc.Vec3(273.8476, 122.2225, 179.9688), pista1Spline_ciudad_angulos[129] = new pc.Vec3(273.7096, 130.731, 179.9692), pista1Spline_ciudad_angulos[130] = new pc.Vec3(273.8359, 130.029, 179.97), pista1Spline_ciudad_angulos[131] = new pc.Vec3(273.9331, 130.5707, 179.9709), pista1Spline_ciudad_angulos[132] = new pc.Vec3(273.7845, 139.0058, 179.9715), pista1Spline_ciudad_angulos[133] = new pc.Vec3(273.8443, 139.6625, 179.9721), pista1Spline_ciudad_angulos[134] = new pc.Vec3(273.9293, 139.5355, 179.9727), pista1Spline_ciudad_angulos[135] = new pc.Vec3(273.8355, 147.0846, 179.9738), pista1Spline_ciudad_angulos[136] = new pc.Vec3(273.8683, 148.9891, 179.9745), pista1Spline_ciudad_angulos[137] = new pc.Vec3(273.9556, 148.8012, 179.9751), pista1Spline_ciudad_angulos[138] = new pc.Vec3(273.9176, 155.1981, 179.9764), pista1Spline_ciudad_angulos[139] = new pc.Vec3(273.8777, 158.0697, 179.977), pista1Spline_ciudad_angulos[140] = new pc.Vec3(273.9634, 158.2865, 179.9775), pista1Spline_ciudad_angulos[141] = new pc.Vec3(273.0331, 163.6042, 179.9725), pista1Spline_ciudad_angulos[142] = new pc.Vec3(272.4971, 167.071, 179.9681), pista1Spline_ciudad_angulos[143] = new pc.Vec3(272.4395, 167.8501, 179.9677), pista1Spline_ciudad_angulos[144] = new pc.Vec3(272.4398, 172.3146, 179.9697), pista1Spline_ciudad_angulos[145] = new pc.Vec3(272.3805, 176.1113, 179.9708), pista1Spline_ciudad_angulos[146] = new pc.Vec3(272.3257, 177.3342, 179.9707), pista1Spline_ciudad_angulos[147] = new pc.Vec3(271.7404, 181.2338, 179.9634), pista1Spline_ciudad_angulos[148] = new pc.Vec3(271.1333, 185.1681, 179.9477), pista1Spline_ciudad_angulos[149] = new pc.Vec3(270.8847, 186.9849, 179.9353), pista1Spline_ciudad_angulos[150] = new pc.Vec3(270.3927, 190.2434, 179.8639), pista1Spline_ciudad_angulos[151] = new pc.Vec3(270.148, 13.25403, .3331341), pista1Spline_ciudad_angulos[152] = new pc.Vec3(270.4233, 15.63917, .1118588), pista1Spline_ciudad_angulos[153] = new pc.Vec3(270.8684, 18.93753, .05050948), pista1Spline_ciudad_angulos[154] = new pc.Vec3(271.4108, 22.83126, .02808538), pista1Spline_ciudad_angulos[155] = new pc.Vec3(271.6164, 25.94799, .02257627), pista1Spline_ciudad_angulos[156] = new pc.Vec3(271.8062, 29.06688, .01844531), pista1Spline_ciudad_angulos[157] = new pc.Vec3(271.9057, 32.068, .01607181), pista1Spline_ciudad_angulos[158] = new pc.Vec3(272.1731, 35.93726, .01229312), pista1Spline_ciudad_angulos[159] = new pc.Vec3(272.3863, 39.26474, .01004704), pista1Spline_ciudad_angulos[160] = new pc.Vec3(272.4751, 41.5001, .009132843), pista1Spline_ciudad_angulos[161] = new pc.Vec3(272.8008, 45.59198, .006639144), pista1Spline_ciudad_angulos[162] = new pc.Vec3(273.0586, 49.17732, .005216472), pista1Spline_ciudad_angulos[163] = new pc.Vec3(273.0545, 49.36196, .004902772), pista1Spline_ciudad_angulos[164] = new pc.Vec3(273.1664, 54.95492, .00346236), pista1Spline_ciudad_angulos[165] = new pc.Vec3(273.2459, 60.9296, .002683903), pista1Spline_ciudad_angulos[166] = new pc.Vec3(273.3701, 61.53129, .002120355), pista1Spline_ciudad_angulos[167] = new pc.Vec3(272.7521, 64.66376, .002347103), pista1Spline_ciudad_angulos[168] = new pc.Vec3(271.7866, 68.53638, .002081189), pista1Spline_ciudad_angulos[169] = new pc.Vec3(271.7573, 68.59857, .002171832), pista1Spline_ciudad_angulos[170] = new pc.Vec3(271.7503, 71.78452, .001620968), pista1Spline_ciudad_angulos[171] = new pc.Vec3(271.8994, 78.09267, .0009273087), pista1Spline_ciudad_angulos[172] = new pc.Vec3(271.8274, 77.4249, .00133862), pista1Spline_ciudad_angulos[173] = new pc.Vec3(271.8295, 77.71637, .0008023016), pista1Spline_ciudad_angulos[174] = new pc.Vec3(271.8638, 77.96513, 787371e-9), pista1Spline_ciudad_angulos[175] = new pc.Vec3(272.123, 81.32944, .0003226493), pista1Spline_ciudad_angulos[176] = new pc.Vec3(272.3214, 83.89183, -4215198e-11), pista1Spline_ciudad_angulos[177] = new pc.Vec3(272.2834, 83.91142, 8571355e-11), pista1Spline_ciudad_angulos[178] = new pc.Vec3(272.5033, 85.58125, .0003518394), pista1Spline_ciudad_angulos[179] = new pc.Vec3(272.7311, 87.32063, -3583581e-11), pista1Spline_ciudad_angulos[180] = new pc.Vec3(272.9886, 89.12118, .0001964946), pista1Spline_ciudad_angulos[181] = new pc.Vec3(273.187, 90.67684, .0001535649), pista1Spline_ciudad_angulos[182] = new pc.Vec3(273.37, 92.18463, -.0002033397), pista1Spline_ciudad_angulos[183] = new pc.Vec3(273.5243, 95.2029, .0001111103), pista1Spline_ciudad_angulos[184] = new pc.Vec3(273.6193, 97.64496, .0002975503), pista1Spline_ciudad_angulos[185] = new pc.Vec3(273.6778, 100.0657, .0002395748), pista1Spline_ciudad_angulos[186] = new pc.Vec3(273.7519, 101.7029, .0004957961), pista1Spline_ciudad_angulos[187] = new pc.Vec3(273.8314, 103.2531, .0003321982), pista1Spline_ciudad_angulos[188] = new pc.Vec3(273.914, 104.6512, .0004502787), pista1Spline_ciudad_angulos[189] = new pc.Vec3(274.0034, 105.944, .0006114566), pista1Spline_ciudad_angulos[190] = new pc.Vec3(274.1076, 107.257, .0006674742), pista1Spline_ciudad_angulos[191] = new pc.Vec3(274.23, 108.5838, .0006713368), pista1Spline_ciudad_angulos[192] = new pc.Vec3(274.3711, 110.0261, .0005600873), pista1Spline_ciudad_angulos[193] = new pc.Vec3(274.5319, 111.5165, .0009724756), pista1Spline_ciudad_angulos[194] = new pc.Vec3(274.71, 113.1605, .0009357759), pista1Spline_ciudad_angulos[195] = new pc.Vec3(274.9937, 115.5312, .001137761), pista1Spline_ciudad_angulos[196] = new pc.Vec3(275.311, 118.1814, .001512721), pista1Spline_ciudad_angulos[197] = new pc.Vec3(275.9125, 123.2399, .001740525), pista1Spline_ciudad_angulos[198] = new pc.Vec3(276.358, 127.1875, .001911969), pista1Spline_ciudad_angulos[199] = new pc.Vec3(276.7571, 131.0093, .002205888), pista1Spline_ciudad_angulos[200] = new pc.Vec3(277.002, 133.4913, .002395221), pista1Spline_ciudad_angulos[201] = new pc.Vec3(277.2139, 135.8051, .002637991), pista1Spline_ciudad_angulos[202] = new pc.Vec3(277.3998, 137.8896, .002810737), pista1Spline_ciudad_angulos[203] = new pc.Vec3(277.5487, 139.8073, .003002562), pista1Spline_ciudad_angulos[204] = new pc.Vec3(277.703, 141.7649, .00317208), pista1Spline_ciudad_angulos[205] = new pc.Vec3(277.841, 143.6551, .003341886), pista1Spline_ciudad_angulos[206] = new pc.Vec3(277.9709, 145.7168, .003435539), pista1Spline_ciudad_angulos[207] = new pc.Vec3(278.105, 147.9228, .003657591), pista1Spline_ciudad_angulos[208] = new pc.Vec3(278.2303, 150.2469, .003846843), pista1Spline_ciudad_angulos[209] = new pc.Vec3(278.3673, 153.2435, .004206698), pista1Spline_ciudad_angulos[210] = new pc.Vec3(278.4991, 156.6505, .004586726), pista1Spline_ciudad_angulos[211] = new pc.Vec3(278.6577, 161.9407, .00509889), pista1Spline_ciudad_angulos[212] = new pc.Vec3(278.6838, 165.2848, .005598292), pista1Spline_ciudad_angulos[213] = new pc.Vec3(278.6754, 168.2755, .00598578), pista1Spline_ciudad_angulos[214] = new pc.Vec3(278.6465, 168.8221, .006022562), pista1Spline_ciudad_angulos[215] = new pc.Vec3(278.6216, 171.4212, .006336022), pista1Spline_ciudad_angulos[216] = new pc.Vec3(278.5761, 174.4468, .006877461), pista1Spline_ciudad_angulos[217] = new pc.Vec3(278.5255, 177.3861, .007244874), pista1Spline_ciudad_angulos[218] = new pc.Vec3(278.498, 178.9455, .007484719), pista1Spline_ciudad_angulos[219] = new pc.Vec3(278.4821, 179.9458, .007531383), pista1Spline_ciudad_angulos[220] = new pc.Vec3(278.5114, 180.1086, .007635188), pista1Spline_ciudad_angulos[221] = new pc.Vec3(278.5052, 180.2482, .007627304), pista1Spline_ciudad_angulos[222] = new pc.Vec3(278.5081, 180.2249, .007621519), pista1Spline_ciudad_angulos[223] = new pc.Vec3(278.3293, 180.2014, .00778438), pista1Spline_ciudad_angulos[224] = new pc.Vec3(277.8937, 180.1775, .008216769), pista1Spline_ciudad_angulos[225] = new pc.Vec3(276.7832, 180.1526, .009574047), pista1Spline_ciudad_angulos[226] = new pc.Vec3(276.5956, 180.1522, .009848969), pista1Spline_ciudad_angulos[227] = new pc.Vec3(276.4429, 180.1519, .01008458), pista1Spline_ciudad_angulos[228] = new pc.Vec3(276.6383, 180.1523, .009785017), pista1Spline_ciudad_angulos[229] = new pc.Vec3(275.928, 180.1509, .01096766), pista1Spline_ciudad_angulos[230] = new pc.Vec3(275.1894, 180.1491, .01253951), pista1Spline_ciudad_angulos[231] = new pc.Vec3(274.735, 180.1478, .01374971), pista1Spline_ciudad_angulos[232] = new pc.Vec3(274.4778, 180.17, .01454822), pista1Spline_ciudad_angulos[233] = new pc.Vec3(274.2846, 180.1693, .01520696), pista1Spline_ciudad_angulos[234] = new pc.Vec3(274.0039, 180.1451, .01627135), pista1Spline_ciudad_angulos[235] = new pc.Vec3(273.6995, 180.1437, .01761412), pista1Spline_ciudad_angulos[236] = new pc.Vec3(273.3278, 180.1647, .01959471), pista1Spline_ciudad_angulos[237] = new pc.Vec3(273.3755, 180.165, .01931813), pista1Spline_ciudad_angulos[238] = new pc.Vec3(273.3306, 180.1417, .01956978), pista1Spline_ciudad_angulos[239] = new pc.Vec3(273.3683, 180.1419, .01935164), pista1Spline_ciudad_angulos[240] = new pc.Vec3(272.5085, 180.1582, .02600786), pista1Spline_ciudad_angulos[241] = new pc.Vec3(272.0121, 180.1517, .03243198), pista1Spline_ciudad_angulos[242] = new pc.Vec3(272.0265, 180.1519, .03220227), pista1Spline_ciudad_angulos[243] = new pc.Vec3(272.3879, 180.1339, .02731295), pista1Spline_ciudad_angulos[244] = new pc.Vec3(272.5634, 180.1357, .02544053), pista1Spline_ciudad_angulos[245] = new pc.Vec3(271.9243, 180.1272, .03389898), pista1Spline_ciudad_angulos[246] = new pc.Vec3(271.8061, 180.148, .0361282), pista1Spline_ciudad_angulos[247] = new pc.Vec3(271.7303, 180.1464, .03772262), pista1Spline_ciudad_angulos[248] = new pc.Vec3(271.7314, 180.1234, .03767746), pista1Spline_ciudad_angulos[249] = new pc.Vec3(271.7701, 180.1472, .03686577), pista1Spline_ciudad_angulos[250] = new pc.Vec3(271.8221, 180.1483, .03581506), pista1Spline_ciudad_angulos[251] = new pc.Vec3(272.058, 180.1294, .0316924), pista1Spline_ciudad_angulos[252] = new pc.Vec3(272.0019, 180.1286, .03258202), pista1Spline_ciudad_angulos[253] = new pc.Vec3(271.8205, 180.1253, .03582836), pista1Spline_ciudad_angulos[254] = new pc.Vec3(271.4466, 180.139, .04511679), pista1Spline_ciudad_angulos[255] = new pc.Vec3(271.1387, 180.1038, .05728957), pista1Spline_ciudad_angulos[256] = new pc.Vec3(270.863, 180.0854, .07563087), pista1Spline_ciudad_angulos[257] = new pc.Vec3(270.4196, 180.0285, .1554879), pista1Spline_ciudad_angulos[258] = new pc.Vec3(270.1083, 180.1829, 0), pista1Spline_ciudad_angulos[259] = new pc.Vec3(270, 180.1599, 0), pista1Spline_ciudad_angulos[260] = new pc.Vec3(270, 180.1829, 0), pista1Spline_ciudad_angulos[261] = new pc.Vec3(270.0198, 180.1599, 0), pista1Spline_ciudad_angulos[262] = new pc.Vec3(270.0198, 179.9988, 0), pista1Spline_ciudad_angulos[263] = new pc.Vec3(270, 179.9758, 0);
var conexionPista2 = [],
    vientoPista2 = [];
vientoPista2[0] = 25, vientoPista2[1] = 124;
var pista2Spline_ciudad = [];
pista2Spline_ciudad[0] = new pc.Vec3(0, 0, 0), pista2Spline_ciudad[1] = new pc.Vec3(0, 0, 0), pista2Spline_ciudad[2] = new pc.Vec3(0, 0, -.5788116), pista2Spline_ciudad[3] = new pc.Vec3(0, 0, -1.157623), pista2Spline_ciudad[4] = new pc.Vec3(0, 0, -1.73642), pista2Spline_ciudad[5] = new pc.Vec3(0, 0, -2.315231), pista2Spline_ciudad[6] = new pc.Vec3(0, 0, -2.894043), pista2Spline_ciudad[7] = new pc.Vec3(0, 0, -3.472839), pista2Spline_ciudad[8] = new pc.Vec3(0, 0, -4.051636), pista2Spline_ciudad[9] = new pc.Vec3(0, 0, -4.630463), pista2Spline_ciudad[10] = new pc.Vec3(0, 0, -5.209244), pista2Spline_ciudad[11] = new pc.Vec3(.01892313, -.001426427, -5.78775), pista2Spline_ciudad[12] = new pc.Vec3(.06274658, -.003013336, -6.364777), pista2Spline_ciudad[13] = new pc.Vec3(.1433132, -.004501271, -6.937866), pista2Spline_ciudad[14] = new pc.Vec3(.2579375, -.005935644, -7.505127), pista2Spline_ciudad[15] = new pc.Vec3(.4056427, -.007347118, -8.064667), pista2Spline_ciudad[16] = new pc.Vec3(.5861847, -.008781385, -8.614532), pista2Spline_ciudad[17] = new pc.Vec3(.7955355, -.01012421, -9.154053), pista2Spline_ciudad[18] = new pc.Vec3(1.03162, -.01146716, -9.682495), pista2Spline_ciudad[19] = new pc.Vec3(1.290409, -.01274103, -10.20013), pista2Spline_ciudad[20] = new pc.Vec3(1.57642, -.01399226, -10.70325), pista2Spline_ciudad[21] = new pc.Vec3(1.891239, -.01521296, -11.18883), pista2Spline_ciudad[22] = new pc.Vec3(2.239018, -.0163956, -11.65135), pista2Spline_ciudad[23] = new pc.Vec3(2.623295, -.01751704, -12.08398), pista2Spline_ciudad[24] = new pc.Vec3(3.042852, -.01860804, -12.48245), pista2Spline_ciudad[25] = new pc.Vec3(3.494267, -.01964566, -12.84445), pista2Spline_ciudad[26] = new pc.Vec3(3.969731, -.02063745, -13.17437), pista2Spline_ciudad[27] = new pc.Vec3(4.464116, -.02156824, -13.47512), pista2Spline_ciudad[28] = new pc.Vec3(4.973882, -.0224078, -13.74917), pista2Spline_ciudad[29] = new pc.Vec3(5.497563, -.0232391, -13.99559), pista2Spline_ciudad[30] = new pc.Vec3(6.033331, -.0239944, -14.2144), pista2Spline_ciudad[31] = new pc.Vec3(6.582037, -.02465055, -14.39819), pista2Spline_ciudad[32] = new pc.Vec3(7.142584, -.02519986, -14.54188), pista2Spline_ciudad[33] = new pc.Vec3(7.713018, -.02554318, -14.63931), pista2Spline_ciudad[34] = new pc.Vec3(8.288578, -.02581785, -14.69705), pista2Spline_ciudad[35] = new pc.Vec3(8.866825, -.02608491, -14.72289), pista2Spline_ciudad[36] = new pc.Vec3(9.44556, -.02641295, -14.72945), pista2Spline_ciudad[37] = new pc.Vec3(10.02442, -.02679442, -14.73032), pista2Spline_ciudad[38] = new pc.Vec3(10.60315, -.02732112, -14.72807), pista2Spline_ciudad[39] = new pc.Vec3(11.18201, -.02801531, -14.72343), pista2Spline_ciudad[40] = new pc.Vec3(11.76075, -.02883909, -14.71656), pista2Spline_ciudad[41] = new pc.Vec3(12.33948, -.029793, -14.70803), pista2Spline_ciudad[42] = new pc.Vec3(12.91822, -.03071586, -14.70008), pista2Spline_ciudad[43] = new pc.Vec3(13.49695, -.0316241, -14.69385), pista2Spline_ciudad[44] = new pc.Vec3(14.07581, -.03249351, -14.69019), pista2Spline_ciudad[45] = new pc.Vec3(14.65454, -.03325651, -14.69045), pista2Spline_ciudad[46] = new pc.Vec3(15.2334, -.033905, -14.69479), pista2Spline_ciudad[47] = new pc.Vec3(15.81214, -.03436273, -14.70349), pista2Spline_ciudad[48] = new pc.Vec3(16.39075, -.03488182, -14.71544), pista2Spline_ciudad[49] = new pc.Vec3(16.96937, -.03580477, -14.73197), pista2Spline_ciudad[50] = new pc.Vec3(17.54774, -.03752138, -14.75388), pista2Spline_ciudad[51] = new pc.Vec3(18.1255, -.03921504, -14.78945), pista2Spline_ciudad[52] = new pc.Vec3(18.70179, -.04046631, -14.84276), pista2Spline_ciudad[53] = new pc.Vec3(19.2754, -.04071802, -14.91912), pista2Spline_ciudad[54] = new pc.Vec3(19.84437, -.03925319, -15.02514), pista2Spline_ciudad[55] = new pc.Vec3(20.40638, -.03582761, -15.16298), pista2Spline_ciudad[56] = new pc.Vec3(20.9585, -.02991481, -15.33632), pista2Spline_ciudad[57] = new pc.Vec3(21.49769, -.02127833, -15.54625), pista2Spline_ciudad[58] = new pc.Vec3(22.02149, -.009880008, -15.79207), pista2Spline_ciudad[59] = new pc.Vec3(22.52699, .004425069, -16.07346), pista2Spline_ciudad[60] = new pc.Vec3(23.01319, .02146884, -16.38689), pista2Spline_ciudad[61] = new pc.Vec3(23.47889, .04107672, -16.72977), pista2Spline_ciudad[62] = new pc.Vec3(23.92457, .06311042, -17.09854), pista2Spline_ciudad[63] = new pc.Vec3(24.34705, .0870209, -17.49335), pista2Spline_ciudad[64] = new pc.Vec3(24.74451, .1124115, -17.91312), pista2Spline_ciudad[65] = new pc.Vec3(25.11292, .139183, -18.35867), pista2Spline_ciudad[66] = new pc.Vec3(25.44935, .1672439, -18.82861), pista2Spline_ciudad[67] = new pc.Vec3(25.7516, .1964951, -19.32123), pista2Spline_ciudad[68] = new pc.Vec3(26.01832, .2267837, -19.83394), pista2Spline_ciudad[69] = new pc.Vec3(26.24879, .2579499, -20.3638), pista2Spline_ciudad[70] = new pc.Vec3(26.44386, .2898636, -20.90771), pista2Spline_ciudad[71] = new pc.Vec3(26.60548, .322113, -21.46246), pista2Spline_ciudad[72] = new pc.Vec3(26.73524, .3546601, -22.02551), pista2Spline_ciudad[73] = new pc.Vec3(26.83717, .3876038, -22.59428), pista2Spline_ciudad[74] = new pc.Vec3(26.91493, .4208756, -23.16685), pista2Spline_ciudad[75] = new pc.Vec3(26.97036, .4542617, -23.74199), pista2Spline_ciudad[76] = new pc.Vec3(27.006, .4873807, -24.31869), pista2Spline_ciudad[77] = new pc.Vec3(27.02553, .5204393, -24.89623), pista2Spline_ciudad[78] = new pc.Vec3(27.02834, .5530469, -25.47407), pista2Spline_ciudad[79] = new pc.Vec3(27.00881, .5836255, -26.05171), pista2Spline_ciudad[80] = new pc.Vec3(26.95107, .6091156, -26.62686), pista2Spline_ciudad[81] = new pc.Vec3(26.84707, .6277463, -27.19578), pista2Spline_ciudad[82] = new pc.Vec3(26.70254, .6401294, -27.75599), pista2Spline_ciudad[83] = new pc.Vec3(26.51931, .6462327, -28.30487), pista2Spline_ciudad[84] = new pc.Vec3(26.29873, .646011, -28.83987), pista2Spline_ciudad[85] = new pc.Vec3(26.0425, .6390606, -29.3587), pista2Spline_ciudad[86] = new pc.Vec3(25.75344, .6258318, -29.85986), pista2Spline_ciudad[87] = new pc.Vec3(25.43374, .6068192, -30.34195), pista2Spline_ciudad[88] = new pc.Vec3(25.08401, .5809247, -30.80227), pista2Spline_ciudad[89] = new pc.Vec3(24.70583, .5481412, -31.23909), pista2Spline_ciudad[90] = new pc.Vec3(24.3008, .5084683, -31.65051), pista2Spline_ciudad[91] = new pc.Vec3(23.86941, .4609834, -32.03335), pista2Spline_ciudad[92] = new pc.Vec3(23.41225, .4055327, -32.38368), pista2Spline_ciudad[93] = new pc.Vec3(22.92983, .3402787, -32.69632), pista2Spline_ciudad[94] = new pc.Vec3(22.41921, .2760237, -32.96091), pista2Spline_ciudad[95] = new pc.Vec3(21.886, .2168808, -33.17802), pista2Spline_ciudad[96] = new pc.Vec3(21.33681, .1706235, -33.3541), pista2Spline_ciudad[97] = new pc.Vec3(20.77773, .1329806, -33.49879), pista2Spline_ciudad[98] = new pc.Vec3(20.21193, .1025773, -33.61705), pista2Spline_ciudad[99] = new pc.Vec3(19.64211, .07767493, -33.71498), pista2Spline_ciudad[100] = new pc.Vec3(19.06923, .05756386, -33.79483), pista2Spline_ciudad[101] = new pc.Vec3(18.49416, .04155739, -33.85887), pista2Spline_ciudad[102] = new pc.Vec3(17.91774, .02892302, -33.90997), pista2Spline_ciudad[103] = new pc.Vec3(17.34035, .01929477, -33.94936), pista2Spline_ciudad[104] = new pc.Vec3(16.76234, .01224499, -33.97854), pista2Spline_ciudad[105] = new pc.Vec3(16.18398, .007324275, -33.99863), pista2Spline_ciudad[106] = new pc.Vec3(15.60524, .004325862, -34.01006), pista2Spline_ciudad[107] = new pc.Vec3(15.0265, .003066989, -34.01292), pista2Spline_ciudad[108] = new pc.Vec3(14.44765, .002319371, -34.01379), pista2Spline_ciudad[109] = new pc.Vec3(13.86891, .001647974, -34.01653), pista2Spline_ciudad[110] = new pc.Vec3(13.29017, 0, -34.02731), pista2Spline_ciudad[111] = new pc.Vec3(12.71181, -.001098578, -34.04951), pista2Spline_ciudad[112] = new pc.Vec3(12.13417, -.002876244, -34.08488), pista2Spline_ciudad[113] = new pc.Vec3(11.55751, -.004608169, -34.13567), pista2Spline_ciudad[114] = new pc.Vec3(10.98292, -.006004598, -34.20435), pista2Spline_ciudad[115] = new pc.Vec3(10.4109, -.006920027, -34.29254), pista2Spline_ciudad[116] = new pc.Vec3(9.842787, -.006988798, -34.40308), pista2Spline_ciudad[117] = new pc.Vec3(9.280043, -.005836505, -34.53828), pista2Spline_ciudad[118] = new pc.Vec3(8.724134, -.003311074, -34.69945), pista2Spline_ciudad[119] = new pc.Vec3(8.176405, 0, -34.88628), pista2Spline_ciudad[120] = new pc.Vec3(7.633558, .003936769, -35.08719), pista2Spline_ciudad[121] = new pc.Vec3(7.092909, .004768443, -35.2937), pista2Spline_ciudad[122] = new pc.Vec3(6.55702, .004463204, -35.51231), pista2Spline_ciudad[123] = new pc.Vec3(6.028578, .004135176, -35.7484), pista2Spline_ciudad[124] = new pc.Vec3(5.511122, .004974382, -36.00758), pista2Spline_ciudad[125] = new pc.Vec3(5.010147, .008758556, -36.2973), pista2Spline_ciudad[126] = new pc.Vec3(4.52919, .01613599, -36.6189), pista2Spline_ciudad[127] = new pc.Vec3(4.073135, .02812198, -36.97504), pista2Spline_ciudad[128] = new pc.Vec3(3.646133, .04553225, -37.36516), pista2Spline_ciudad[129] = new pc.Vec3(3.249894, .06836683, -37.78622), pista2Spline_ciudad[130] = new pc.Vec3(2.88637, .09872442, -38.23544), pista2Spline_ciudad[131] = new pc.Vec3(2.549823, .1248856, -38.70549), pista2Spline_ciudad[132] = new pc.Vec3(2.234881, .1440964, -39.1908), pista2Spline_ciudad[133] = new pc.Vec3(1.923236, .1577682, -39.6783), pista2Spline_ciudad[134] = new pc.Vec3(1.614765, .1686172, -40.1679), pista2Spline_ciudad[135] = new pc.Vec3(1.308002, .1778717, -40.65869), pista2Spline_ciudad[136] = new pc.Vec3(1.002706, .186058, -41.15031), pista2Spline_ciudad[137] = new pc.Vec3(.6982624, .1933439, -41.64256), pista2Spline_ciudad[138] = new pc.Vec3(.3946737, .1999588, -42.13533), pista2Spline_ciudad[139] = new pc.Vec3(.09181757, .2060395, -42.62851), pista2Spline_ciudad[140] = new pc.Vec3(-.2105503, .2116545, -43.12203), pista2Spline_ciudad[141] = new pc.Vec3(-.5123077, .21685, -43.6159), pista2Spline_ciudad[142] = new pc.Vec3(-.8138212, .2217329, -44.10998), pista2Spline_ciudad[143] = new pc.Vec3(-1.114846, .2263029, -44.60429), pista2Spline_ciudad[144] = new pc.Vec3(-1.415627, .2306287, -45.09881), pista2Spline_ciudad[145] = new pc.Vec3(-1.716042, .2347487, -45.59353), pista2Spline_ciudad[146] = new pc.Vec3(-2.016212, .2386169, -46.0884), pista2Spline_ciudad[147] = new pc.Vec3(-2.316139, .2423325, -46.58341), pista2Spline_ciudad[148] = new pc.Vec3(-2.615943, .2459185, -47.07855), pista2Spline_ciudad[149] = new pc.Vec3(-2.915382, .2493363, -47.57381), pista2Spline_ciudad[150] = new pc.Vec3(-3.214698, .2526169, -48.06921), pista2Spline_ciudad[151] = new pc.Vec3(-3.513892, .2557983, -48.56471), pista2Spline_ciudad[152] = new pc.Vec3(-3.812842, .2588425, -49.0603), pista2Spline_ciudad[153] = new pc.Vec3(-4.11167, .2618332, -49.55597), pista2Spline_ciudad[154] = new pc.Vec3(-4.410376, .26474, -50.05176), pista2Spline_ciudad[155] = new pc.Vec3(-4.70896, .2675627, -50.54764), pista2Spline_ciudad[156] = new pc.Vec3(-5.0073, .2703249, -51.04356), pista2Spline_ciudad[157] = new pc.Vec3(-5.305637, .2730252, -51.53957), pista2Spline_ciudad[158] = new pc.Vec3(-5.603856, .2757187, -52.03564), pista2Spline_ciudad[159] = new pc.Vec3(-5.901829, .2783658, -52.53182), pista2Spline_ciudad[160] = new pc.Vec3(-6.199802, .2809601, -53.02805), pista2Spline_ciudad[161] = new pc.Vec3(-6.497655, .2835463, -53.52429), pista2Spline_ciudad[162] = new pc.Vec3(-6.795506, .2861634, -54.02063), pista2Spline_ciudad[163] = new pc.Vec3(-7.093113, .2887878, -54.51701), pista2Spline_ciudad[164] = new pc.Vec3(-7.39072, .2913895, -55.01347), pista2Spline_ciudad[165] = new pc.Vec3(-7.688206, .2940598, -55.50996), pista2Spline_ciudad[166] = new pc.Vec3(-7.985444, .296768, -56.0065), pista2Spline_ciudad[167] = new pc.Vec3(-8.28281, .2995682, -56.50308), pista2Spline_ciudad[168] = new pc.Vec3(-8.580173, .3024827, -56.99973), pista2Spline_ciudad[169] = new pc.Vec3(-8.877415, .3054731, -57.49641), pista2Spline_ciudad[170] = new pc.Vec3(-9.174528, .30867, -57.99313), pista2Spline_ciudad[171] = new pc.Vec3(-9.471525, .3121338, -58.48988), pista2Spline_ciudad[172] = new pc.Vec3(-9.768524, .3159102, -58.98666), pista2Spline_ciudad[173] = new pc.Vec3(-10.06552, .3201142, -59.48341), pista2Spline_ciudad[174] = new pc.Vec3(-10.36264, .3252335, -59.98012), pista2Spline_ciudad[175] = new pc.Vec3(-10.65915, .3315202, -60.47716), pista2Spline_ciudad[176] = new pc.Vec3(-10.94101, .3389741, -60.98265), pista2Spline_ciudad[177] = new pc.Vec3(-11.2037, .3472825, -61.49825), pista2Spline_ciudad[178] = new pc.Vec3(-11.44284, .3561856, -62.02525), pista2Spline_ciudad[179] = new pc.Vec3(-11.65378, .3658524, -62.5641), pista2Spline_ciudad[180] = new pc.Vec3(-11.83481, .3761899, -63.11368), pista2Spline_ciudad[181] = new pc.Vec3(-11.98471, .3872069, -63.67256), pista2Spline_ciudad[182] = new pc.Vec3(-12.10177, .3988267, -64.23917), pista2Spline_ciudad[183] = new pc.Vec3(-12.18588, .4108429, -64.81165), pista2Spline_ciudad[184] = new pc.Vec3(-12.23703, .422989, -65.388), pista2Spline_ciudad[185] = new pc.Vec3(-12.25924, .4352647, -65.9662), pista2Spline_ciudad[186] = new pc.Vec3(-12.25412, .4475708, -66.5448), pista2Spline_ciudad[187] = new pc.Vec3(-12.22396, .4597546, -67.12263), pista2Spline_ciudad[188] = new pc.Vec3(-12.17526, .4715501, -67.69922), pista2Spline_ciudad[189] = new pc.Vec3(-12.11117, .482727, -68.27437), pista2Spline_ciudad[190] = new pc.Vec3(-12.03781, .4932176, -68.8484), pista2Spline_ciudad[191] = new pc.Vec3(-11.95943, .5032578, -69.42179), pista2Spline_ciudad[192] = new pc.Vec3(-11.87875, .5124051, -69.99487), pista2Spline_ciudad[193] = new pc.Vec3(-11.79525, .5140458, -70.56762), pista2Spline_ciudad[194] = new pc.Vec3(-11.70821, .5084305, -71.13982), pista2Spline_ciudad[195] = new pc.Vec3(-11.61727, .4952165, -71.71126), pista2Spline_ciudad[196] = new pc.Vec3(-11.5195, .4752729, -72.28136), pista2Spline_ciudad[197] = new pc.Vec3(-11.41463, .4493104, -72.85003), pista2Spline_ciudad[198] = new pc.Vec3(-11.30221, .417923, -73.41694), pista2Spline_ciudad[199] = new pc.Vec3(-11.1816, .382324, -73.98189), pista2Spline_ciudad[200] = new pc.Vec3(-11.05099, .3428952, -74.54437), pista2Spline_ciudad[201] = new pc.Vec3(-10.90841, .3001329, -75.10374), pista2Spline_ciudad[202] = new pc.Vec3(-10.75058, .255188, -75.65875), pista2Spline_ciudad[203] = new pc.Vec3(-10.57504, .2089386, -76.20831), pista2Spline_ciudad[204] = new pc.Vec3(-10.3796, .1625137, -76.75106), pista2Spline_ciudad[205] = new pc.Vec3(-10.15121, .1199949, -77.28111), pista2Spline_ciudad[206] = new pc.Vec3(-9.88742, .0822525, -77.79474), pista2Spline_ciudad[207] = new pc.Vec3(-9.584198, .04993446, -78.28656), pista2Spline_ciudad[208] = new pc.Vec3(-9.244841, .02285774, -78.75449), pista2Spline_ciudad[209] = new pc.Vec3(-8.870819, 0, -79.19544), pista2Spline_ciudad[210] = new pc.Vec3(-8.458955, -.01642612, -79.60155), pista2Spline_ciudad[211] = new pc.Vec3(-8.012176, -.02980044, -79.96897), pista2Spline_ciudad[212] = new pc.Vec3(-7.534027, -.03993987, -80.29469), pista2Spline_ciudad[213] = new pc.Vec3(-7.031221, -.04874417, -80.58076), pista2Spline_ciudad[214] = new pc.Vec3(-6.508514, -.05710596, -80.82892), pista2Spline_ciudad[215] = new pc.Vec3(-5.970428, -.06596373, -81.04189), pista2Spline_ciudad[216] = new pc.Vec3(-5.416718, -.07267762, -81.20955), pista2Spline_ciudad[217] = new pc.Vec3(-4.852144, -.07755306, -81.33635), pista2Spline_ciudad[218] = new pc.Vec3(-4.280611, -.08081049, -81.42793), pista2Spline_ciudad[219] = new pc.Vec3(-3.705658, -.08290095, -81.49408), pista2Spline_ciudad[220] = new pc.Vec3(-3.12851, -.08403775, -81.53769), pista2Spline_ciudad[221] = new pc.Vec3(-2.550384, -.08443449, -81.56339), pista2Spline_ciudad[222] = new pc.Vec3(-1.97165, -.08426668, -81.57397), pista2Spline_ciudad[223] = new pc.Vec3(-1.392914, -.08369441, -81.57065), pista2Spline_ciudad[224] = new pc.Vec3(-.814301, -.08290094, -81.55505), pista2Spline_ciudad[225] = new pc.Vec3(-.2360539, -.08203128, -81.53003), pista2Spline_ciudad[226] = new pc.Vec3(.341827, -.08116145, -81.4975), pista2Spline_ciudad[227] = new pc.Vec3(.9195859, -.08033748, -81.46231), pista2Spline_ciudad[228] = new pc.Vec3(1.497345, -.07960507, -81.42714), pista2Spline_ciudad[229] = new pc.Vec3(2.075226, -.07907861, -81.394), pista2Spline_ciudad[230] = new pc.Vec3(2.653351, -.07875828, -81.36668), pista2Spline_ciudad[231] = new pc.Vec3(3.231842, -.07872766, -81.34789), pista2Spline_ciudad[232] = new pc.Vec3(3.810577, -.07901023, -81.33992), pista2Spline_ciudad[233] = new pc.Vec3(4.389311, -.07974236, -81.34834), pista2Spline_ciudad[234] = new pc.Vec3(4.967314, -.08108512, -81.37625), pista2Spline_ciudad[235] = new pc.Vec3(5.543852, -.08315277, -81.42755), pista2Spline_ciudad[236] = new pc.Vec3(6.118561, -.0845002, -81.49637), pista2Spline_ciudad[237] = new pc.Vec3(6.690948, -.08744455, -81.58211), pista2Spline_ciudad[238] = new pc.Vec3(7.260649, -.0910066, -81.68407), pista2Spline_ciudad[239] = new pc.Vec3(7.826567, -.09585433, -81.8053), pista2Spline_ciudad[240] = new pc.Vec3(8.387604, -.1003344, -81.94749), pista2Spline_ciudad[241] = new pc.Vec3(8.942166, -.1055729, -82.11263), pista2Spline_ciudad[242] = new pc.Vec3(9.486112, -.1085495, -82.31019), pista2Spline_ciudad[243] = new pc.Vec3(10.01517, -.1135499, -82.54444), pista2Spline_ciudad[244] = new pc.Vec3(10.52127, -.1203813, -82.82484), pista2Spline_ciudad[245] = new pc.Vec3(10.99844, -.1227723, -83.152), pista2Spline_ciudad[246] = new pc.Vec3(11.4418, -.1269605, -83.52369), pista2Spline_ciudad[247] = new pc.Vec3(11.84781, -.1292409, -83.93585), pista2Spline_ciudad[248] = new pc.Vec3(12.21671, -.1297594, -84.38158), pista2Spline_ciudad[249] = new pc.Vec3(12.548, -.1306209, -84.85587), pista2Spline_ciudad[250] = new pc.Vec3(12.83243, -.1284743, -85.35973), pista2Spline_ciudad[251] = new pc.Vec3(13.0651, -.1246649, -85.88937), pista2Spline_ciudad[252] = new pc.Vec3(13.24222, -.1153619, -86.44012), pista2Spline_ciudad[253] = new pc.Vec3(13.36599, -.08758762, -87.00529), pista2Spline_ciudad[254] = new pc.Vec3(13.4357, -.06268672, -87.57966), pista2Spline_ciudad[255] = new pc.Vec3(13.44839, -.04804371, -88.1582), pista2Spline_ciudad[256] = new pc.Vec3(13.45059, -.03453622, -88.73685), pista2Spline_ciudad[257] = new pc.Vec3(13.44803, -.02033866, -89.31514), pista2Spline_ciudad[258] = new pc.Vec3(13.44791, -.004912581, -89.89218), pista2Spline_ciudad[259] = new pc.Vec3(13.44791, 0, -90.46967), pista2Spline_ciudad[260] = new pc.Vec3(13.44791, 0, -91.04702);
var pista2Spline_ciudad_angulos = [];
pista2Spline_ciudad_angulos[0] = new pc.Vec3(0, 0, 0), pista2Spline_ciudad_angulos[1] = new pc.Vec3(270.0198, 179.9988, 0), pista2Spline_ciudad_angulos[2] = new pc.Vec3(270.0198, 179.9988, 0), pista2Spline_ciudad_angulos[3] = new pc.Vec3(270, 179.9988, 0), pista2Spline_ciudad_angulos[4] = new pc.Vec3(270, 179.9988, 0), pista2Spline_ciudad_angulos[5] = new pc.Vec3(270.0198, 179.9988, 0), pista2Spline_ciudad_angulos[6] = new pc.Vec3(270, 179.9755, 0), pista2Spline_ciudad_angulos[7] = new pc.Vec3(270, 180.0222, 0), pista2Spline_ciudad_angulos[8] = new pc.Vec3(270, 180.0688, 0), pista2Spline_ciudad_angulos[9] = new pc.Vec3(270, 180.0922, 0), pista2Spline_ciudad_angulos[10] = new pc.Vec3(270.056, 179.0191, 0), pista2Spline_ciudad_angulos[11] = new pc.Vec3(270.1558, 176.9883, .3980464), pista2Spline_ciudad_angulos[12] = new pc.Vec3(270.1413, 173.3024, .4095176), pista2Spline_ciudad_angulos[13] = new pc.Vec3(270.1454, 169.9244, .3712347), pista2Spline_ciudad_angulos[14] = new pc.Vec3(270.1413, 166.5355, .3555279), pista2Spline_ciudad_angulos[15] = new pc.Vec3(270.1371, 163.18, .3330512), pista2Spline_ciudad_angulos[16] = new pc.Vec3(270.1385, 159.9596, .3114543), pista2Spline_ciudad_angulos[17] = new pc.Vec3(270.1297, 156.9715, .3016151), pista2Spline_ciudad_angulos[18] = new pc.Vec3(270.1282, 154.4087, .2837034), pista2Spline_ciudad_angulos[19] = new pc.Vec3(270.1251, 151.6984, .2754108), pista2Spline_ciudad_angulos[20] = new pc.Vec3(270.1219, 148.6046, .2595245), pista2Spline_ciudad_angulos[21] = new pc.Vec3(270.1187, 144.7847, .2323791), pista2Spline_ciudad_angulos[22] = new pc.Vec3(270.1136, 140.928, 0), pista2Spline_ciudad_angulos[23] = new pc.Vec3(270.1065, 135.8719, 0), pista2Spline_ciudad_angulos[24] = new pc.Vec3(270.1065, 131.1988, 0), pista2Spline_ciudad_angulos[25] = new pc.Vec3(270.1009, 126.4731, 0), pista2Spline_ciudad_angulos[26] = new pc.Vec3(270.0928, 123.0242, 0), pista2Spline_ciudad_angulos[27] = new pc.Vec3(270.0885, 119.7693, 0), pista2Spline_ciudad_angulos[28] = new pc.Vec3(270.0766, 116.7057, 0), pista2Spline_ciudad_angulos[29] = new pc.Vec3(270.074, 113.7762, 0), pista2Spline_ciudad_angulos[30] = new pc.Vec3(270.0656, 110.3976, 0), pista2Spline_ciudad_angulos[31] = new pc.Vec3(270.0626, 106.6428, 0), pista2Spline_ciudad_angulos[32] = new pc.Vec3(270.028, 101.931, 0), pista2Spline_ciudad_angulos[33] = new pc.Vec3(270.028, 97.71523, 0), pista2Spline_ciudad_angulos[34] = new pc.Vec3(270.028, 93.68984, 0), pista2Spline_ciudad_angulos[35] = new pc.Vec3(270.028, 91.69735, 0), pista2Spline_ciudad_angulos[36] = new pc.Vec3(270.0396, 90.08746, 0), pista2Spline_ciudad_angulos[37] = new pc.Vec3(270.0396, 89.93876, 0), pista2Spline_ciudad_angulos[38] = new pc.Vec3(270.0626, 89.67044, 0), pista2Spline_ciudad_angulos[39] = new pc.Vec3(270.0791, 89.42264, 0), pista2Spline_ciudad_angulos[40] = new pc.Vec3(270.0885, 89.18935, 0), pista2Spline_ciudad_angulos[41] = new pc.Vec3(270.0928, 89.19812, 0), pista2Spline_ciudad_angulos[42] = new pc.Vec3(270.0928, 89.25642, 0), pista2Spline_ciudad_angulos[43] = new pc.Vec3(270.0839, 89.49261, 0), pista2Spline_ciudad_angulos[44] = new pc.Vec3(270.0816, 89.83084, 0), pista2Spline_ciudad_angulos[45] = new pc.Vec3(270.074, 90.21575, 0), pista2Spline_ciudad_angulos[46] = new pc.Vec3(270.0485, 90.65899, 0), pista2Spline_ciudad_angulos[47] = new pc.Vec3(270.0396, 91.04383, 0), pista2Spline_ciudad_angulos[48] = new pc.Vec3(270.056, 91.35627, 0), pista2Spline_ciudad_angulos[49] = new pc.Vec3(270.1342, 91.84804, .001442664), pista2Spline_ciudad_angulos[50] = new pc.Vec3(270.1725, 92.8006, 0), pista2Spline_ciudad_angulos[51] = new pc.Vec3(270.1667, 94.19734, .0005833799), pista2Spline_ciudad_angulos[52] = new pc.Vec3(270.0685, 96.46516, 0), pista2Spline_ciudad_angulos[53] = new pc.Vec3(270.0485, 98.96562, 0), pista2Spline_ciudad_angulos[54] = new pc.Vec3(270.2307, 282.0495, 179.9945), pista2Spline_ciudad_angulos[55] = new pc.Vec3(270.466, 285.6375, 179.9948), pista2Spline_ciudad_angulos[56] = new pc.Vec3(270.71, 289.2997, 179.9949), pista2Spline_ciudad_angulos[57] = new pc.Vec3(270.9943, 293.2192, 179.9947), pista2Spline_ciudad_angulos[58] = new pc.Vec3(271.2756, 297.1055, 179.9944), pista2Spline_ciudad_angulos[59] = new pc.Vec3(271.5544, 301.0267, 179.9941), pista2Spline_ciudad_angulos[60] = new pc.Vec3(271.8198, 304.6351, 179.9937), pista2Spline_ciudad_angulos[61] = new pc.Vec3(272.0609, 308.0043, 179.9933), pista2Spline_ciudad_angulos[62] = new pc.Vec3(272.2929, 311.3203, 179.993), pista2Spline_ciudad_angulos[63] = new pc.Vec3(272.443, 314.7785, 179.9923), pista2Spline_ciudad_angulos[64] = new pc.Vec3(272.5863, 318.4932, 179.9916), pista2Spline_ciudad_angulos[65] = new pc.Vec3(272.7147, 322.3708, 179.9908), pista2Spline_ciudad_angulos[66] = new pc.Vec3(272.8432, 326.474, 179.9898), pista2Spline_ciudad_angulos[67] = new pc.Vec3(272.9493, 330.4807, 179.9888), pista2Spline_ciudad_angulos[68] = new pc.Vec3(273.0474, 334.5847, 179.9878), pista2Spline_ciudad_angulos[69] = new pc.Vec3(273.1288, 338.3842, 179.9869), pista2Spline_ciudad_angulos[70] = new pc.Vec3(273.184, 342.0354, 179.9859), pista2Spline_ciudad_angulos[71] = new pc.Vec3(273.2036, 345.5624, 179.9848), pista2Spline_ciudad_angulos[72] = new pc.Vec3(273.2459, 348.4174, 179.984), pista2Spline_ciudad_angulos[73] = new pc.Vec3(273.2765, 351.1489, 179.9833), pista2Spline_ciudad_angulos[74] = new pc.Vec3(273.313, 353.4601, 179.9826), pista2Spline_ciudad_angulos[75] = new pc.Vec3(273.2938, 355.4569, 179.9819), pista2Spline_ciudad_angulos[76] = new pc.Vec3(273.2678, 357.4011, 179.981), pista2Spline_ciudad_angulos[77] = new pc.Vec3(273.2966, 358.7341, 179.9807), pista2Spline_ciudad_angulos[78] = new pc.Vec3(273.1071, .9557719, 179.9788), pista2Spline_ciudad_angulos[79] = new pc.Vec3(272.8721, 3.342823, 179.976), pista2Spline_ciudad_angulos[80] = new pc.Vec3(272.1627, 8.23384, 179.9652), pista2Spline_ciudad_angulos[81] = new pc.Vec3(271.534, 12.47138, 179.948), pista2Spline_ciudad_angulos[82] = new pc.Vec3(270.9145, 16.58102, 179.9092), pista2Spline_ciudad_angulos[83] = new pc.Vec3(270.2974, 20.7202, 179.7053), pista2Spline_ciudad_angulos[84] = new pc.Vec3(270.3489, 204.0703, .2639232), pista2Spline_ciudad_angulos[85] = new pc.Vec3(271.0207, 208.097, .09350469), pista2Spline_ciudad_angulos[86] = new pc.Vec3(271.5808, 211.6651, .06331887), pista2Spline_ciudad_angulos[87] = new pc.Vec3(272.2154, 215.336, .04598404), pista2Spline_ciudad_angulos[88] = new pc.Vec3(272.9026, 219.0317, .03665434), pista2Spline_ciudad_angulos[89] = new pc.Vec3(273.5849, 222.6633, .03009337), pista2Spline_ciudad_angulos[90] = new pc.Vec3(274.3082, 226.4569, .02584462), pista2Spline_ciudad_angulos[91] = new pc.Vec3(275.0894, 230.305, .02279059), pista2Spline_ciudad_angulos[92] = new pc.Vec3(275.9971, 234.7951, .0196122), pista2Spline_ciudad_angulos[93] = new pc.Vec3(276.6006, 239.5916, .01830151), pista2Spline_ciudad_angulos[94] = new pc.Vec3(276.2636, 245.4888, .02001733), pista2Spline_ciudad_angulos[95] = new pc.Vec3(275.2182, 249.9074, .024332), pista2Spline_ciudad_angulos[96] = new pc.Vec3(274.0845, 254.1451, .03150111), pista2Spline_ciudad_angulos[97] = new pc.Vec3(273.3413, 256.8885, .038438), pista2Spline_ciudad_angulos[98] = new pc.Vec3(272.7432, 259.1441, .04677305), pista2Spline_ciudad_angulos[99] = new pc.Vec3(272.1947, 261.215, .05858918), pista2Spline_ciudad_angulos[100] = new pc.Vec3(271.7805, 262.7961, .07304013), pista2Spline_ciudad_angulos[101] = new pc.Vec3(271.4175, 264.196, .09167323), pista2Spline_ciudad_angulos[102] = new pc.Vec3(271.0879, 265.46, .119436), pista2Spline_ciudad_angulos[103] = new pc.Vec3(270.8214, 266.4412, .1599343), pista2Spline_ciudad_angulos[104] = new pc.Vec3(270.5908, 267.3506, .2198852), pista2Spline_ciudad_angulos[105] = new pc.Vec3(270.3826, 268.1253, .3406079), pista2Spline_ciudad_angulos[106] = new pc.Vec3(270.2056, 268.6834, .6284875), pista2Spline_ciudad_angulos[107] = new pc.Vec3(270.0791, 269.8782, 0), pista2Spline_ciudad_angulos[108] = new pc.Vec3(270.056, 270.0181, 0), pista2Spline_ciudad_angulos[109] = new pc.Vec3(270.0969, 269.2746, 0), pista2Spline_ciudad_angulos[110] = new pc.Vec3(270.1399, 267.5134, .9371653), pista2Spline_ciudad_angulos[111] = new pc.Vec3(270.1678, 266.4427, .7675187), pista2Spline_ciudad_angulos[112] = new pc.Vec3(270.1713, 264.9488, .7545254), pista2Spline_ciudad_angulos[113] = new pc.Vec3(270.1631, 263.3532, .7952325), pista2Spline_ciudad_angulos[114] = new pc.Vec3(270.1154, 262.2623, 0), pista2Spline_ciudad_angulos[115] = new pc.Vec3(270.0485, 260.0847, 0), pista2Spline_ciudad_angulos[116] = new pc.Vec3(270.0343, 257.8431, 0), pista2Spline_ciudad_angulos[117] = new pc.Vec3(270.1918, 75.76974, 179.3332), pista2Spline_ciudad_angulos[118] = new pc.Vec3(270.3026, 73.02514, 179.5819), pista2Spline_ciudad_angulos[119] = new pc.Vec3(270.4357, 70.28627, 179.7091), pista2Spline_ciudad_angulos[120] = new pc.Vec3(270.1725, 70.30685, 179.2629), pista2Spline_ciudad_angulos[121] = new pc.Vec3(270.028, 248.4206, 0), pista2Spline_ciudad_angulos[122] = new pc.Vec3(270.0791, 247.1393, 0), pista2Spline_ciudad_angulos[123] = new pc.Vec3(270.028, 244.648, 0), pista2Spline_ciudad_angulos[124] = new pc.Vec3(270.2103, 62.35488, 179.419), pista2Spline_ciudad_angulos[125] = new pc.Vec3(270.5128, 58.49426, 179.7649), pista2Spline_ciudad_angulos[126] = new pc.Vec3(270.9694, 54.20779, 179.8789), pista2Spline_ciudad_angulos[127] = new pc.Vec3(271.439, 49.9385, 179.9207), pista2Spline_ciudad_angulos[128] = new pc.Vec3(271.9951, 45.40235, 179.9443), pista2Spline_ciudad_angulos[129] = new pc.Vec3(272.6096, 41.21352, 179.9585), pista2Spline_ciudad_angulos[130] = new pc.Vec3(273.0569, 37.17286, 179.9657), pista2Spline_ciudad_angulos[131] = new pc.Vec3(272.1816, 33.89308, 179.954), pista2Spline_ciudad_angulos[132] = new pc.Vec3(271.6434, 32.8917, 179.9391), pista2Spline_ciudad_angulos[133] = new pc.Vec3(271.1326, 32.40662, 179.9116), pista2Spline_ciudad_angulos[134] = new pc.Vec3(270.9974, 32.20172, 179.8995), pista2Spline_ciudad_angulos[135] = new pc.Vec3(270.8673, 32.04359, 179.8864), pista2Spline_ciudad_angulos[136] = new pc.Vec3(270.7535, 31.92399, 179.8669), pista2Spline_ciudad_angulos[137] = new pc.Vec3(270.6898, 31.80709, 179.857), pista2Spline_ciudad_angulos[138] = new pc.Vec3(270.6268, 31.75859, 179.8429), pista2Spline_ciudad_angulos[139] = new pc.Vec3(270.5754, 31.69174, 179.8288), pista2Spline_ciudad_angulos[140] = new pc.Vec3(270.5367, 31.649, 179.8162), pista2Spline_ciudad_angulos[141] = new pc.Vec3(270.4969, 31.61163, 179.7987), pista2Spline_ciudad_angulos[142] = new pc.Vec3(270.4631, 31.59435, 179.7839), pista2Spline_ciudad_angulos[143] = new pc.Vec3(270.4437, 31.54972, 179.7782), pista2Spline_ciudad_angulos[144] = new pc.Vec3(270.4168, 31.53296, 179.7643), pista2Spline_ciudad_angulos[145] = new pc.Vec3(270.3907, 31.50099, 179.7474), pista2Spline_ciudad_angulos[146] = new pc.Vec3(270.3743, 31.4828, 179.7381), pista2Spline_ciudad_angulos[147] = new pc.Vec3(270.3572, 31.49073, 179.7242), pista2Spline_ciudad_angulos[148] = new pc.Vec3(270.346, 31.47168, 179.7161), pista2Spline_ciudad_angulos[149] = new pc.Vec3(270.331, 31.45965, 179.7017), pista2Spline_ciudad_angulos[150] = new pc.Vec3(270.3159, 31.44578, 179.6879), pista2Spline_ciudad_angulos[151] = new pc.Vec3(270.3115, 31.42687, 179.6839), pista2Spline_ciudad_angulos[152] = new pc.Vec3(270.2968, 31.41801, 179.6682), pista2Spline_ciudad_angulos[153] = new pc.Vec3(270.2887, 31.42023, 179.6597), pista2Spline_ciudad_angulos[154] = new pc.Vec3(270.2825, 31.40452, 179.6514), pista2Spline_ciudad_angulos[155] = new pc.Vec3(270.2741, 31.4113, 179.6402), pista2Spline_ciudad_angulos[156] = new pc.Vec3(270.2661, 31.39611, 179.6324), pista2Spline_ciudad_angulos[157] = new pc.Vec3(270.2647, 31.39699, 179.628), pista2Spline_ciudad_angulos[158] = new pc.Vec3(270.2639, 31.37446, 179.6263), pista2Spline_ciudad_angulos[159] = new pc.Vec3(270.2518, 31.38652, 179.6113), pista2Spline_ciudad_angulos[160] = new pc.Vec3(270.2609, 31.35275, 179.6218), pista2Spline_ciudad_angulos[161] = new pc.Vec3(270.2572, 31.35131, 179.6218), pista2Spline_ciudad_angulos[162] = new pc.Vec3(270.2579, 31.33297, 179.6175), pista2Spline_ciudad_angulos[163] = new pc.Vec3(270.2594, 31.32379, 179.6221), pista2Spline_ciudad_angulos[164] = new pc.Vec3(270.2587, 31.30258, 179.62), pista2Spline_ciudad_angulos[165] = new pc.Vec3(270.2654, 31.2922, 179.6308), pista2Spline_ciudad_angulos[166] = new pc.Vec3(270.2727, 31.27938, 179.6406), pista2Spline_ciudad_angulos[167] = new pc.Vec3(270.2825, 31.26452, 179.651), pista2Spline_ciudad_angulos[168] = new pc.Vec3(270.2907, 31.23024, 179.6621), pista2Spline_ciudad_angulos[169] = new pc.Vec3(270.3058, 31.21305, 179.6779), pista2Spline_ciudad_angulos[170] = new pc.Vec3(270.3232, 31.19517, 179.6953), pista2Spline_ciudad_angulos[171] = new pc.Vec3(270.3572, 31.14399, 179.7239), pista2Spline_ciudad_angulos[172] = new pc.Vec3(270.3996, 31.11299, 179.7532), pista2Spline_ciudad_angulos[173] = new pc.Vec3(270.445, 31.0882, 179.7782), pista2Spline_ciudad_angulos[174] = new pc.Vec3(270.5706, 31.25312, 179.8274), pista2Spline_ciudad_angulos[175] = new pc.Vec3(270.6778, 30.16964, 179.8544), pista2Spline_ciudad_angulos[176] = new pc.Vec3(270.7876, 28.41466, 179.8788), pista2Spline_ciudad_angulos[177] = new pc.Vec3(270.8532, 25.78689, 179.8898), pista2Spline_ciudad_angulos[178] = new pc.Vec3(270.9166, 23.0338, 179.9028), pista2Spline_ciudad_angulos[179] = new pc.Vec3(270.9887, 19.92031, 179.9113), pista2Spline_ciudad_angulos[180] = new pc.Vec3(271.0613, 16.69081, 179.9205), pista2Spline_ciudad_angulos[181] = new pc.Vec3(271.1184, 13.4455, 179.9286), pista2Spline_ciudad_angulos[182] = new pc.Vec3(271.1767, 10.05594, 179.9348), pista2Spline_ciudad_angulos[183] = new pc.Vec3(271.1955, 6.772398, 179.9398), pista2Spline_ciudad_angulos[184] = new pc.Vec3(271.2087, 3.629359, 179.943), pista2Spline_ciudad_angulos[185] = new pc.Vec3(271.2237, .8238121, 179.9463), pista2Spline_ciudad_angulos[186] = new pc.Vec3(271.2113, 358.3251, 179.9479), pista2Spline_ciudad_angulos[187] = new pc.Vec3(271.1913, 355.9874, 179.9492), pista2Spline_ciudad_angulos[188] = new pc.Vec3(271.1414, 354.3485, 179.9487), pista2Spline_ciudad_angulos[189] = new pc.Vec3(271.0714, 353.2711, 179.9465), pista2Spline_ciudad_angulos[190] = new pc.Vec3(271.0015, 352.3571, 179.9437), pista2Spline_ciudad_angulos[191] = new pc.Vec3(271.0496, 352.2123, 179.9467), pista2Spline_ciudad_angulos[192] = new pc.Vec3(270.5493, 351.9322, 179.8985), pista2Spline_ciudad_angulos[193] = new pc.Vec3(270.1813, 171.2408, .3070914), pista2Spline_ciudad_angulos[194] = new pc.Vec3(270.9463, 171.1108, .05826167), pista2Spline_ciudad_angulos[195] = new pc.Vec3(271.6406, 170.5893, .03320604), pista2Spline_ciudad_angulos[196] = new pc.Vec3(272.3058, 169.9324, .02326822), pista2Spline_ciudad_angulos[197] = new pc.Vec3(272.8399, 169.1495, .01860225), pista2Spline_ciudad_angulos[198] = new pc.Vec3(273.3304, 168.3376, .01555603), pista2Spline_ciudad_angulos[199] = new pc.Vec3(273.7379, 167.4981, .01361365), pista2Spline_ciudad_angulos[200] = new pc.Vec3(274.0667, 166.294, .01219548), pista2Spline_ciudad_angulos[201] = new pc.Vec3(274.3563, 164.9369, .01102648), pista2Spline_ciudad_angulos[202] = new pc.Vec3(274.5695, 163.3284, .01013769), pista2Spline_ciudad_angulos[203] = new pc.Vec3(274.5817, 161.214, .009597948), pista2Spline_ciudad_angulos[204] = new pc.Vec3(274.4893, 158.6771, .009184172), pista2Spline_ciudad_angulos[205] = new pc.Vec3(273.9792, 154.8467, .009399204), pista2Spline_ciudad_angulos[206] = new pc.Vec3(273.472, 150.5514, .009487774), pista2Spline_ciudad_angulos[207] = new pc.Vec3(272.9377, 146.1495, .00982902), pista2Spline_ciudad_angulos[208] = new pc.Vec3(272.4126, 142.0027, .01034297), pista2Spline_ciudad_angulos[209] = new pc.Vec3(271.9568, 137.146, .01059937), pista2Spline_ciudad_angulos[210] = new pc.Vec3(271.4899, 132.0483, .01129374), pista2Spline_ciudad_angulos[211] = new pc.Vec3(271.1361, 126.7418, .01128146), pista2Spline_ciudad_angulos[212] = new pc.Vec3(270.9392, 121.9676, .01052327), pista2Spline_ciudad_angulos[213] = new pc.Vec3(270.8104, 117.315, .00893156), pista2Spline_ciudad_angulos[214] = new pc.Vec3(270.8829, 113.5952, .00609182), pista2Spline_ciudad_angulos[215] = new pc.Vec3(270.7947, 109.363, .004676935), pista2Spline_ciudad_angulos[216] = new pc.Vec3(270.5644, 104.4709, .003814528), pista2Spline_ciudad_angulos[217] = new pc.Vec3(270.4011, 100.8877, .002683255), pista2Spline_ciudad_angulos[218] = new pc.Vec3(270.2609, 97.71284, .002249407), pista2Spline_ciudad_angulos[219] = new pc.Vec3(270.1545, 95.28886, .001899423), pista2Spline_ciudad_angulos[220] = new pc.Vec3(270.074, 93.47155, 0), pista2Spline_ciudad_angulos[221] = new pc.Vec3(270, 91.74106, 0), pista2Spline_ciudad_angulos[222] = new pc.Vec3(270.0396, 90.31783, 0), pista2Spline_ciudad_angulos[223] = new pc.Vec3(270.0626, 89.0815, 0), pista2Spline_ciudad_angulos[224] = new pc.Vec3(270.0839, 87.92587, 0), pista2Spline_ciudad_angulos[225] = new pc.Vec3(270.0885, 87.05251, 0), pista2Spline_ciudad_angulos[226] = new pc.Vec3(270.0816, 86.67101, 0), pista2Spline_ciudad_angulos[227] = new pc.Vec3(270.0766, 86.41785, 0), pista2Spline_ciudad_angulos[228] = new pc.Vec3(270.0656, 86.56333, 0), pista2Spline_ciudad_angulos[229] = new pc.Vec3(270.0396, 87.02462, 0), pista2Spline_ciudad_angulos[230] = new pc.Vec3(270, 87.60818, 0), pista2Spline_ciudad_angulos[231] = new pc.Vec3(270, 88.62384, 0), pista2Spline_ciudad_angulos[232] = new pc.Vec3(270.0485, 90.01747, 0), pista2Spline_ciudad_angulos[233] = new pc.Vec3(270.0949, 91.64488, 0), pista2Spline_ciudad_angulos[234] = new pc.Vec3(270.1678, 94.00002, .001750416), pista2Spline_ciudad_angulos[235] = new pc.Vec3(270.2374, 96.00664, .001646927), pista2Spline_ciudad_angulos[236] = new pc.Vec3(270.3039, 97.68179, .001926367), pista2Spline_ciudad_angulos[237] = new pc.Vec3(270.3594, 99.31282, .002988726), pista2Spline_ciudad_angulos[238] = new pc.Vec3(270.4196, 101.0924, .00302878), pista2Spline_ciudad_angulos[239] = new pc.Vec3(270.4652, 103.04, .003366157), pista2Spline_ciudad_angulos[240] = new pc.Vec3(270.4973, 105.4204, .004513642), pista2Spline_ciudad_angulos[241] = new pc.Vec3(270.5316, 108.0914, .005697899), pista2Spline_ciudad_angulos[242] = new pc.Vec3(270.5539, 111.6503, .008654311), pista2Spline_ciudad_angulos[243] = new pc.Vec3(270.6052, 116.4752, .0114793), pista2Spline_ciudad_angulos[244] = new pc.Vec3(270.6638, 121.563, .01459836), pista2Spline_ciudad_angulos[245] = new pc.Vec3(270.7177, 127.2549, .0186823), pista2Spline_ciudad_angulos[246] = new pc.Vec3(270.7512, 132.6293, .02305925), pista2Spline_ciudad_angulos[247] = new pc.Vec3(270.7639, 138.0455, .02830186), pista2Spline_ciudad_angulos[248] = new pc.Vec3(270.7146, 142.5505, .0358766), pista2Spline_ciudad_angulos[249] = new pc.Vec3(270.6781, 147.744, .04473097), pista2Spline_ciudad_angulos[250] = new pc.Vec3(270.6337, 153.2558, .056534), pista2Spline_ciudad_angulos[251] = new pc.Vec3(270.5922, 159.2292, .07114255), pista2Spline_ciudad_angulos[252] = new pc.Vec3(270.5585, 164.8313, .08619028), pista2Spline_ciudad_angulos[253] = new pc.Vec3(270.4702, 11.30935, 159.0814), pista2Spline_ciudad_angulos[254] = new pc.Vec3(270.5595, 176.0387, .1084112), pista2Spline_ciudad_angulos[255] = new pc.Vec3(270.028, 179.8122, 0), pista2Spline_ciudad_angulos[256] = new pc.Vec3(271.6914, .2249176, 179.9618), pista2Spline_ciudad_angulos[257] = new pc.Vec3(273.4503, .08913645, 179.981), pista2Spline_ciudad_angulos[258] = new pc.Vec3(272.6689, .0244413, 179.9756), pista2Spline_ciudad_angulos[259] = new pc.Vec3(270, 179.999, 0), pista2Spline_ciudad_angulos[260] = new pc.Vec3(270, 179.999, 0);
var conexionPista0 = [],
    vientoPista0 = [];
vientoPista0[0] = 25, vientoPista0[1] = 124;
var pista0Spline_ciudad = [];
pista0Spline_ciudad[0] = new pc.Vec3(0, 0, 0), pista0Spline_ciudad[1] = new pc.Vec3(0, 0, -.5791931), pista0Spline_ciudad[2] = new pc.Vec3(0, 0, -1.158417), pista0Spline_ciudad[3] = new pc.Vec3(0, 0, -1.737625), pista0Spline_ciudad[4] = new pc.Vec3(0, 0, -2.316833), pista0Spline_ciudad[5] = new pc.Vec3(0, 0, -2.896057), pista0Spline_ciudad[6] = new pc.Vec3(0, 0, -3.475266), pista0Spline_ciudad[7] = new pc.Vec3(0, 0, -4.054474), pista0Spline_ciudad[8] = new pc.Vec3(0, 0, -4.633698), pista0Spline_ciudad[9] = new pc.Vec3(0, 0, -5.212921), pista0Spline_ciudad[10] = new pc.Vec3(0, 0, -5.792114), pista0Spline_ciudad[11] = new pc.Vec3(0, 0, -6.371338), pista0Spline_ciudad[12] = new pc.Vec3(0, 0, -6.950562), pista0Spline_ciudad[13] = new pc.Vec3(0, 0, -7.529755), pista0Spline_ciudad[14] = new pc.Vec3(0, 0, -8.108978), pista0Spline_ciudad[15] = new pc.Vec3(0, 0, -8.688202), pista0Spline_ciudad[16] = new pc.Vec3(0, .001976967, -9.267395), pista0Spline_ciudad[17] = new pc.Vec3(0, .009186745, -9.846558), pista0Spline_ciudad[18] = new pc.Vec3(0, .02128696, -10.42569), pista0Spline_ciudad[19] = new pc.Vec3(0, .03633976, -11.0047), pista0Spline_ciudad[20] = new pc.Vec3(0, .05339146, -11.58366), pista0Spline_ciudad[21] = new pc.Vec3(0, .07171059, -12.16257), pista0Spline_ciudad[22] = new pc.Vec3(0, .09101295, -12.74148), pista0Spline_ciudad[23] = new pc.Vec3(0, .1109934, -13.32032), pista0Spline_ciudad[24] = new pc.Vec3(0, .1314106, -13.89917), pista0Spline_ciudad[25] = new pc.Vec3(0, .1520634, -14.47801), pista0Spline_ciudad[26] = new pc.Vec3(0, .1728001, -15.05688), pista0Spline_ciudad[27] = new pc.Vec3(0, .1933613, -15.63574), pista0Spline_ciudad[28] = new pc.Vec3(0, .2135849, -16.21459), pista0Spline_ciudad[29] = new pc.Vec3(0, .2333088, -16.79346), pista0Spline_ciudad[30] = new pc.Vec3(0, .2522221, -17.37235), pista0Spline_ciudad[31] = new pc.Vec3(0, .2699528, -17.9513), pista0Spline_ciudad[32] = new pc.Vec3(0, .2862034, -18.53028), pista0Spline_ciudad[33] = new pc.Vec3(0, .2999363, -19.10933), pista0Spline_ciudad[34] = new pc.Vec3(0, .3100986, -19.68845), pista0Spline_ciudad[35] = new pc.Vec3(.002332146, .3130074, -20.26764), pista0Spline_ciudad[36] = new pc.Vec3(-.003038731, .3145237, -20.84683), pista0Spline_ciudad[37] = new pc.Vec3(-.0238515, .3164158, -21.42557), pista0Spline_ciudad[38] = new pc.Vec3(-.1078356, .3196735, -21.99832), pista0Spline_ciudad[39] = new pc.Vec3(-.2449814, .3241997, -22.56088), pista0Spline_ciudad[40] = new pc.Vec3(-.4248518, .3297291, -23.11136), pista0Spline_ciudad[41] = new pc.Vec3(-.6310893, .3342934, -23.65249), pista0Spline_ciudad[42] = new pc.Vec3(-.8576517, .3373585, -24.18556), pista0Spline_ciudad[43] = new pc.Vec3(-1.098923, .3384342, -24.7121), pista0Spline_ciudad[44] = new pc.Vec3(-1.346604, .3379993, -25.23568), pista0Spline_ciudad[45] = new pc.Vec3(-1.606492, .3358727, -25.75328), pista0Spline_ciudad[46] = new pc.Vec3(-1.883713, .3318138, -26.26178), pista0Spline_ciudad[47] = new pc.Vec3(-2.186814, .3265343, -26.75525), pista0Spline_ciudad[48] = new pc.Vec3(-2.514634, .320797, -27.23264), pista0Spline_ciudad[49] = new pc.Vec3(-2.867051, .3157005, -27.69223), pista0Spline_ciudad[50] = new pc.Vec3(-3.231736, .3123512, -28.14218), pista0Spline_ciudad[51] = new pc.Vec3(-3.608567, .3105297, -28.582), pista0Spline_ciudad[52] = new pc.Vec3(-3.998276, .3097439, -29.01048), pista0Spline_ciudad[53] = new pc.Vec3(-4.415146, .3086433, -29.41236), pista0Spline_ciudad[54] = new pc.Vec3(-4.858872, .3068218, -29.78452), pista0Spline_ciudad[55] = new pc.Vec3(-5.322312, .3040485, -30.13178), pista0Spline_ciudad[56] = new pc.Vec3(-5.80156, .3005409, -30.45696), pista0Spline_ciudad[57] = new pc.Vec3(-6.293931, .2962589, -30.762), pista0Spline_ciudad[58] = new pc.Vec3(-6.796739, .2907829, -31.04938), pista0Spline_ciudad[59] = new pc.Vec3(-7.305833, .2836952, -31.32557), pista0Spline_ciudad[60] = new pc.Vec3(-7.818895, .2748356, -31.59415), pista0Spline_ciudad[61] = new pc.Vec3(-8.338794, .2654781, -31.84925), pista0Spline_ciudad[62] = new pc.Vec3(-8.870165, .2576332, -32.07938), pista0Spline_ciudad[63] = new pc.Vec3(-9.41527, .2530785, -32.27482), pista0Spline_ciudad[64] = new pc.Vec3(-9.9713, .2511215, -32.43681), pista0Spline_ciudad[65] = new pc.Vec3(-10.53533, .2507057, -32.56837), pista0Spline_ciudad[66] = new pc.Vec3(-11.10491, .2506828, -32.6732), pista0Spline_ciudad[67] = new pc.Vec3(-11.67803, .2507133, -32.75669), pista0Spline_ciudad[68] = new pc.Vec3(-12.25371, .2507324, -32.82023), pista0Spline_ciudad[69] = new pc.Vec3(-12.83104, .2507591, -32.86723), pista0Spline_ciudad[70] = new pc.Vec3(-13.40966, .2508011, -32.88942), pista0Spline_ciudad[71] = new pc.Vec3(-13.98876, .250824, -32.89216), pista0Spline_ciudad[72] = new pc.Vec3(-14.56798, .2508698, -32.89311), pista0Spline_ciudad[73] = new pc.Vec3(-15.14721, .2509575, -32.89441), pista0Spline_ciudad[74] = new pc.Vec3(-15.72643, .2510338, -32.89714), pista0Spline_ciudad[75] = new pc.Vec3(-16.30565, .2511406, -32.90013), pista0Spline_ciudad[76] = new pc.Vec3(-16.88488, .251255, -32.90333), pista0Spline_ciudad[77] = new pc.Vec3(-17.4641, .2513466, -32.90662), pista0Spline_ciudad[78] = new pc.Vec3(-18.04332, .2514381, -32.91038), pista0Spline_ciudad[79] = new pc.Vec3(-18.62243, .2515144, -32.9142), pista0Spline_ciudad[80] = new pc.Vec3(-19.20165, .2515984, -32.91786), pista0Spline_ciudad[81] = new pc.Vec3(-19.78087, .2516327, -32.92128), pista0Spline_ciudad[82] = new pc.Vec3(-20.3601, .2516556, -32.92453), pista0Spline_ciudad[83] = new pc.Vec3(-20.93932, .2516327, -32.92768), pista0Spline_ciudad[84] = new pc.Vec3(-21.51854, .2515755, -32.93049), pista0Spline_ciudad[85] = new pc.Vec3(-22.09764, .2514534, -32.93266), pista0Spline_ciudad[86] = new pc.Vec3(-22.67687, .2512779, -32.9339), pista0Spline_ciudad[87] = new pc.Vec3(-23.25609, .2509956, -32.93361), pista0Spline_ciudad[88] = new pc.Vec3(-23.83532, .2511864, -32.9381), pista0Spline_ciudad[89] = new pc.Vec3(-24.4143, .2529488, -32.95445), pista0Spline_ciudad[90] = new pc.Vec3(-24.98962, .2575951, -33.0186), pista0Spline_ciudad[91] = new pc.Vec3(-25.55578, .264431, -33.1391), pista0Spline_ciudad[92] = new pc.Vec3(-26.10485, .2706032, -33.32267), pista0Spline_ciudad[93] = new pc.Vec3(-26.62438, .275341, -33.57725), pista0Spline_ciudad[94] = new pc.Vec3(-27.1057, .2789307, -33.89889), pista0Spline_ciudad[95] = new pc.Vec3(-27.54967, .2854958, -34.27043), pista0Spline_ciudad[96] = new pc.Vec3(-27.95568, .294529, -34.68315), pista0Spline_ciudad[97] = new pc.Vec3(-28.32323, .3055649, -35.13041), pista0Spline_ciudad[98] = new pc.Vec3(-28.64745, .313221, -35.61002), pista0Spline_ciudad[99] = new pc.Vec3(-28.9154, .3172035, -36.12313), pista0Spline_ciudad[100] = new pc.Vec3(-29.11657, .3170166, -36.66585), pista0Spline_ciudad[101] = new pc.Vec3(-29.24852, .3166084, -37.22942), pista0Spline_ciudad[102] = new pc.Vec3(-29.3236, .3161354, -37.80361), pista0Spline_ciudad[103] = new pc.Vec3(-29.35509, .3161278, -38.38186), pista0Spline_ciudad[104] = new pc.Vec3(-29.35936, .3157578, -38.96101), pista0Spline_ciudad[105] = new pc.Vec3(-29.33495, .3142509, -39.53965), pista0Spline_ciudad[106] = new pc.Vec3(-29.28124, .3104973, -40.11628), pista0Spline_ciudad[107] = new pc.Vec3(-29.18761, .3045349, -40.68769), pista0Spline_ciudad[108] = new pc.Vec3(-29.05541, .29702, -41.25151), pista0Spline_ciudad[109] = new pc.Vec3(-28.89049, .2893715, -41.80659), pista0Spline_ciudad[110] = new pc.Vec3(-28.69237, .2824135, -42.35072), pista0Spline_ciudad[111] = new pc.Vec3(-28.46202, .2768898, -42.88203), pista0Spline_ciudad[112] = new pc.Vec3(-28.19896, .2752457, -43.39798), pista0Spline_ciudad[113] = new pc.Vec3(-27.91527, .2759895, -43.90294), pista0Spline_ciudad[114] = new pc.Vec3(-27.61632, .2785645, -44.399), pista0Spline_ciudad[115] = new pc.Vec3(-27.3109, .2815323, -44.89117), pista0Spline_ciudad[116] = new pc.Vec3(-27.00023, .2849083, -45.37993), pista0Spline_ciudad[117] = new pc.Vec3(-26.68529, .2885284, -45.86596), pista0Spline_ciudad[118] = new pc.Vec3(-26.36717, .2922745, -46.35011), pista0Spline_ciudad[119] = new pc.Vec3(-26.04674, .2960472, -46.83262), pista0Spline_ciudad[120] = new pc.Vec3(-25.72435, .2998276, -47.31381), pista0Spline_ciudad[121] = new pc.Vec3(-25.4005, .3034554, -47.79402), pista0Spline_ciudad[122] = new pc.Vec3(-25.07555, .3068047, -48.27348), pista0Spline_ciudad[123] = new pc.Vec3(-24.74986, .3098602, -48.75242), pista0Spline_ciudad[124] = new pc.Vec3(-24.42455, .3121986, -49.23165), pista0Spline_ciudad[125] = new pc.Vec3(-24.09923, .3136482, -49.71085), pista0Spline_ciudad[126] = new pc.Vec3(-23.77464, .3138046, -50.19054), pista0Spline_ciudad[127] = new pc.Vec3(-23.43968, .3138084, -50.66309), pista0Spline_ciudad[128] = new pc.Vec3(-23.08958, .313797, -51.12446), pista0Spline_ciudad[129] = new pc.Vec3(-22.71666, .3137817, -51.5675), pista0Spline_ciudad[130] = new pc.Vec3(-22.31431, .3137817, -51.98399), pista0Spline_ciudad[131] = new pc.Vec3(-21.88255, .3137741, -52.36982), pista0Spline_ciudad[132] = new pc.Vec3(-21.42222, .3139305, -52.72114), pista0Spline_ciudad[133] = new pc.Vec3(-20.94029, .314003, -53.04241), pista0Spline_ciudad[134] = new pc.Vec3(-20.44114, .3132935, -53.33604), pista0Spline_ciudad[135] = new pc.Vec3(-19.93052, .3076859, -53.60947), pista0Spline_ciudad[136] = new pc.Vec3(-19.40757, .2948761, -53.85789), pista0Spline_ciudad[137] = new pc.Vec3(-18.87266, .2735748, -54.07869), pista0Spline_ciudad[138] = new pc.Vec3(-18.32408, .2476997, -54.26252), pista0Spline_ciudad[139] = new pc.Vec3(-17.76402, .2204323, -54.40721), pista0Spline_ciudad[140] = new pc.Vec3(-17.19481, .1945839, -54.51056), pista0Spline_ciudad[141] = new pc.Vec3(-16.61998, .1746559, -54.57767), pista0Spline_ciudad[142] = new pc.Vec3(-16.04185, .1613388, -54.61029), pista0Spline_ciudad[143] = new pc.Vec3(-15.46275, .1559372, -54.61079), pista0Spline_ciudad[144] = new pc.Vec3(-14.88414, .1555061, -54.58556), pista0Spline_ciudad[145] = new pc.Vec3(-14.30675, .1579971, -54.54016), pista0Spline_ciudad[146] = new pc.Vec3(-13.73009, .1595726, -54.48621), pista0Spline_ciudad[147] = new pc.Vec3(-13.15526, .1617203, -54.41533), pista0Spline_ciudad[148] = new pc.Vec3(-12.5833, .1645317, -54.32468), pista0Spline_ciudad[149] = new pc.Vec3(-12.01561, .1681099, -54.21), pista0Spline_ciudad[150] = new pc.Vec3(-11.45469, .1723175, -54.06599), pista0Spline_ciudad[151] = new pc.Vec3(-10.90287, .1769524, -53.89035), pista0Spline_ciudad[152] = new pc.Vec3(-10.36332, .1816483, -53.68005), pista0Spline_ciudad[153] = new pc.Vec3(-9.835613, .1858597, -53.44139), pista0Spline_ciudad[154] = new pc.Vec3(-9.319683, .1892166, -53.17819), pista0Spline_ciudad[155] = new pc.Vec3(-8.809795, .1910629, -52.9035), pista0Spline_ciudad[156] = new pc.Vec3(-8.302715, .1914978, -52.62357), pista0Spline_ciudad[157] = new pc.Vec3(-7.79594, .1906509, -52.34314), pista0Spline_ciudad[158] = new pc.Vec3(-7.304363, .1963196, -52.03704), pista0Spline_ciudad[159] = new pc.Vec3(-6.815655, .2057991, -51.72638), pista0Spline_ciudad[160] = new pc.Vec3(-6.317852, .2170792, -51.43049), pista0Spline_ciudad[161] = new pc.Vec3(-5.80833, .2286377, -51.15539), pista0Spline_ciudad[162] = new pc.Vec3(-5.286967, .2401848, -50.90348), pista0Spline_ciudad[163] = new pc.Vec3(-4.753581, .2514648, -50.67815), pista0Spline_ciudad[164] = new pc.Vec3(-4.208353, .2622528, -50.48304), pista0Spline_ciudad[165] = new pc.Vec3(-3.652812, .2723503, -50.31992), pista0Spline_ciudad[166] = new pc.Vec3(-3.088175, .2816544, -50.19147), pista0Spline_ciudad[167] = new pc.Vec3(-2.516213, .2899857, -50.10112), pista0Spline_ciudad[168] = new pc.Vec3(-1.939431, .2971916, -50.0503), pista0Spline_ciudad[169] = new pc.Vec3(-1.360451, .3032532, -50.04129), pista0Spline_ciudad[170] = new pc.Vec3(-.7823265, .3079147, -50.0748), pista0Spline_ciudad[171] = new pc.Vec3(-.2081685, .3111038, -50.15016), pista0Spline_ciudad[172] = new pc.Vec3(.3593976, .3128738, -50.2651), pista0Spline_ciudad[173] = new pc.Vec3(.9181137, .3136787, -50.41735), pista0Spline_ciudad[174] = new pc.Vec3(1.466332, .3137856, -50.60422), pista0Spline_ciudad[175] = new pc.Vec3(2.005517, .3140182, -50.81559), pista0Spline_ciudad[176] = new pc.Vec3(2.533593, .3143539, -51.05341), pista0Spline_ciudad[177] = new pc.Vec3(3.04873, .3148499, -51.31802), pista0Spline_ciudad[178] = new pc.Vec3(3.548547, .3155289, -51.61062), pista0Spline_ciudad[179] = new pc.Vec3(4.03097, .3163872, -51.93107), pista0Spline_ciudad[180] = new pc.Vec3(4.494043, .3174744, -52.27882), pista0Spline_ciudad[181] = new pc.Vec3(4.936609, .3188248, -52.65236), pista0Spline_ciudad[182] = new pc.Vec3(5.357935, .3204155, -53.04968), pista0Spline_ciudad[183] = new pc.Vec3(5.757959, .3223, -53.46849), pista0Spline_ciudad[184] = new pc.Vec3(6.139247, .3244934, -53.90446), pista0Spline_ciudad[185] = new pc.Vec3(6.503566, .3270035, -54.35472), pista0Spline_ciudad[186] = new pc.Vec3(6.854579, .3298454, -54.81541), pista0Spline_ciudad[187] = new pc.Vec3(7.199306, .3331032, -55.28086), pista0Spline_ciudad[188] = new pc.Vec3(7.542446, .3367081, -55.74747), pista0Spline_ciudad[189] = new pc.Vec3(7.892728, .3404961, -56.20871), pista0Spline_ciudad[190] = new pc.Vec3(8.263211, .3450699, -56.65382), pista0Spline_ciudad[191] = new pc.Vec3(8.659085, .3504677, -57.07642), pista0Spline_ciudad[192] = new pc.Vec3(9.08212, .3558426, -57.4719), pista0Spline_ciudad[193] = new pc.Vec3(9.526272, .361248, -57.84355), pista0Spline_ciudad[194] = new pc.Vec3(9.98831, .3666763, -58.19279), pista0Spline_ciudad[195] = new pc.Vec3(10.4653, .371933, -58.52123), pista0Spline_ciudad[196] = new pc.Vec3(10.95639, .3768692, -58.82817), pista0Spline_ciudad[197] = new pc.Vec3(11.46066, .3813858, -59.11307), pista0Spline_ciudad[198] = new pc.Vec3(11.97781, .3853226, -59.37374), pista0Spline_ciudad[199] = new pc.Vec3(12.50778, .3884888, -59.60724), pista0Spline_ciudad[200] = new pc.Vec3(13.05002, .390728, -59.81047), pista0Spline_ciudad[201] = new pc.Vec3(13.6069, .3915253, -59.96914), pista0Spline_ciudad[202] = new pc.Vec3(14.17264, .3909912, -60.09309), pista0Spline_ciudad[203] = new pc.Vec3(14.74246, .3893127, -60.19689), pista0Spline_ciudad[204] = new pc.Vec3(15.30887, .3875122, -60.31787), pista0Spline_ciudad[205] = new pc.Vec3(15.86893, .3857536, -60.46504), pista0Spline_ciudad[206] = new pc.Vec3(16.41891, .3841286, -60.6465), pista0Spline_ciudad[207] = new pc.Vec3(16.95377, .3827591, -60.86839), pista0Spline_ciudad[208] = new pc.Vec3(17.46921, .3816681, -61.13222), pista0Spline_ciudad[209] = new pc.Vec3(17.95908, .3809853, -61.44094), pista0Spline_ciudad[210] = new pc.Vec3(18.41989, .3806915, -61.79152), pista0Spline_ciudad[211] = new pc.Vec3(18.84879, .3807831, -62.18057), pista0Spline_ciudad[212] = new pc.Vec3(19.24594, .3813095, -62.60199), pista0Spline_ciudad[213] = new pc.Vec3(19.61222, .3822021, -63.05055), pista0Spline_ciudad[214] = new pc.Vec3(19.94852, .3834877, -63.52202), pista0Spline_ciudad[215] = new pc.Vec3(20.25882, .3856277, -64.01102), pista0Spline_ciudad[216] = new pc.Vec3(20.54502, .3869934, -64.51454), pista0Spline_ciudad[217] = new pc.Vec3(20.80966, .3861542, -65.02969), pista0Spline_ciudad[218] = new pc.Vec3(21.05417, .380394, -65.5547), pista0Spline_ciudad[219] = new pc.Vec3(21.27841, .3693848, -66.08861), pista0Spline_ciudad[220] = new pc.Vec3(21.48306, .3527832, -66.63017), pista0Spline_ciudad[221] = new pc.Vec3(21.66764, .3314819, -67.17874), pista0Spline_ciudad[222] = new pc.Vec3(21.83249, .3057861, -67.73335), pista0Spline_ciudad[223] = new pc.Vec3(21.97849, .2761383, -68.29305), pista0Spline_ciudad[224] = new pc.Vec3(22.10611, .2431793, -68.85706), pista0Spline_ciudad[225] = new pc.Vec3(22.2153, .2073288, -69.42476), pista0Spline_ciudad[226] = new pc.Vec3(22.30643, .1694412, -69.99547), pista0Spline_ciudad[227] = new pc.Vec3(22.3804, .1305618, -70.56857), pista0Spline_ciudad[228] = new pc.Vec3(22.43747, .0914917, -71.14362), pista0Spline_ciudad[229] = new pc.Vec3(22.47812, .05348969, -71.72015), pista0Spline_ciudad[230] = new pc.Vec3(22.50253, .02307129, -72.29802), pista0Spline_ciudad[231] = new pc.Vec3(22.51169, .003349304, -72.87679), pista0Spline_ciudad[232] = new pc.Vec3(22.51358, 0, -73.45596), pista0Spline_ciudad[233] = new pc.Vec3(22.51266, 0, -74.03517), pista0Spline_ciudad[234] = new pc.Vec3(22.51309, 0, -74.61438), pista0Spline_ciudad[235] = new pc.Vec3(22.51303, 0, -75.1936), pista0Spline_ciudad[236] = new pc.Vec3(22.51291, 0, -75.77281), pista0Spline_ciudad[237] = new pc.Vec3(22.51303, 0, -76.35202), pista0Spline_ciudad[238] = new pc.Vec3(22.51346, 0, -76.93123), pista0Spline_ciudad[239] = new pc.Vec3(22.51388, 0, -77.51045), pista0Spline_ciudad[240] = new pc.Vec3(22.5137, 0, -78.08966), pista0Spline_ciudad[241] = new pc.Vec3(22.51395, 0, -78.66887), pista0Spline_ciudad[242] = new pc.Vec3(22.51437, 0, -79.2481), pista0Spline_ciudad[243] = new pc.Vec3(22.51443, 0, -79.8273), pista0Spline_ciudad[244] = new pc.Vec3(22.51431, 0, -80.40652), pista0Spline_ciudad[245] = new pc.Vec3(22.51407, 0, -80.98573), pista0Spline_ciudad[246] = new pc.Vec3(22.51407, 0, -81.56496), pista0Spline_ciudad[247] = new pc.Vec3(22.51425, 0, -82.14415), pista0Spline_ciudad[248] = new pc.Vec3(22.5145, 0, -82.72337), pista0Spline_ciudad[249] = new pc.Vec3(22.51431, 0, -83.30259), pista0Spline_ciudad[250] = new pc.Vec3(22.51413, 0, -83.88181), pista0Spline_ciudad[251] = new pc.Vec3(22.51413, 0, -84.46101), pista0Spline_ciudad[252] = new pc.Vec3(22.51444, 0, -85.04025), pista0Spline_ciudad[253] = new pc.Vec3(22.51462, 0, -85.61945), pista0Spline_ciudad[254] = new pc.Vec3(22.51431, 0, -86.19865), pista0Spline_ciudad[255] = new pc.Vec3(22.51419, 0, -86.77788), pista0Spline_ciudad[256] = new pc.Vec3(22.51431, 0, -87.35709), pista0Spline_ciudad[257] = new pc.Vec3(22.51462, 0, -87.93629), pista0Spline_ciudad[258] = new pc.Vec3(22.51468, 0, -88.51552), pista0Spline_ciudad[259] = new pc.Vec3(22.51462, 0, -89.09473);
var pista0Spline_ciudad_angulos = [];
pista0Spline_ciudad_angulos[0] = new pc.Vec3(0, 0, 0), pista0Spline_ciudad_angulos[1] = new pc.Vec3(270, 179.9988, 0), pista0Spline_ciudad_angulos[2] = new pc.Vec3(270, 179.9988, 0), pista0Spline_ciudad_angulos[3] = new pc.Vec3(270, 179.9988, 0), pista0Spline_ciudad_angulos[4] = new pc.Vec3(270, 179.9988, 0), pista0Spline_ciudad_angulos[5] = new pc.Vec3(270, 179.9988, 0), pista0Spline_ciudad_angulos[6] = new pc.Vec3(270, 179.9988, 0), pista0Spline_ciudad_angulos[7] = new pc.Vec3(270, 179.9988, 0), pista0Spline_ciudad_angulos[8] = new pc.Vec3(270, 179.9988, 0), pista0Spline_ciudad_angulos[9] = new pc.Vec3(270, 179.9988, 0), pista0Spline_ciudad_angulos[10] = new pc.Vec3(270, 179.9988, 0), pista0Spline_ciudad_angulos[11] = new pc.Vec3(270, 179.9988, 0), pista0Spline_ciudad_angulos[12] = new pc.Vec3(270, 179.9988, 0), pista0Spline_ciudad_angulos[13] = new pc.Vec3(270, 179.9988, 0), pista0Spline_ciudad_angulos[14] = new pc.Vec3(270.0198, 179.9988, 0), pista0Spline_ciudad_angulos[15] = new pc.Vec3(270, 179.9988, 0), pista0Spline_ciudad_angulos[16] = new pc.Vec3(270.5051, .1287209, 179.8713), pista0Spline_ciudad_angulos[17] = new pc.Vec3(270.9442, .06894986, 179.9311), pista0Spline_ciudad_angulos[18] = new pc.Vec3(271.3928, .04673891, 179.9533), pista0Spline_ciudad_angulos[19] = new pc.Vec3(271.5924, .04087944, 179.9591), pista0Spline_ciudad_angulos[20] = new pc.Vec3(271.7471, .03726401, 179.9627), pista0Spline_ciudad_angulos[21] = new pc.Vec3(271.8738, .03474333, 179.9653), pista0Spline_ciudad_angulos[22] = new pc.Vec3(271.9423, .03351537, 179.9665), pista0Spline_ciudad_angulos[23] = new pc.Vec3(271.9992, .03256541, 179.9674), pista0Spline_ciudad_angulos[24] = new pc.Vec3(272.0372, .03195842, 179.968), pista0Spline_ciudad_angulos[25] = new pc.Vec3(272.0488, .03177517, 179.9682), pista0Spline_ciudad_angulos[26] = new pc.Vec3(272.0457, .0318219, 179.9682), pista0Spline_ciudad_angulos[27] = new pc.Vec3(272.0212, .03221159, 179.9678), pista0Spline_ciudad_angulos[28] = new pc.Vec3(271.9759, .03294916, 179.9671), pista0Spline_ciudad_angulos[29] = new pc.Vec3(271.9145, .03400177, 179.966), pista0Spline_ciudad_angulos[30] = new pc.Vec3(271.8314, .03554404, 179.9645), pista0Spline_ciudad_angulos[31] = new pc.Vec3(271.6768, .03882124, 179.9612), pista0Spline_ciudad_angulos[32] = new pc.Vec3(271.4978, .04346263, 179.9566), pista0Spline_ciudad_angulos[33] = new pc.Vec3(271.2443, .05231825, 179.9477), pista0Spline_ciudad_angulos[34] = new pc.Vec3(270.6588, .02949692, 179.9006), pista0Spline_ciudad_angulos[35] = new pc.Vec3(270.0906, 179.9872, 0), pista0Spline_ciudad_angulos[36] = new pc.Vec3(270.1713, 1.008892, 179.6205), pista0Spline_ciudad_angulos[37] = new pc.Vec3(270.2479, 5.115091, 179.7168), pista0Spline_ciudad_angulos[38] = new pc.Vec3(270.3831, 11.53781, 179.7967), pista0Spline_ciudad_angulos[39] = new pc.Vec3(270.5316, 16.29155, 179.8436), pista0Spline_ciudad_angulos[40] = new pc.Vec3(270.4993, 19.65191, 179.8262), pista0Spline_ciudad_angulos[41] = new pc.Vec3(270.3991, 22.44534, 179.776), pista0Spline_ciudad_angulos[42] = new pc.Vec3(270.1958, 24.29574, 179.5355), pista0Spline_ciudad_angulos[43] = new pc.Vec3(270, 205.1089, 0), pista0Spline_ciudad_angulos[44] = new pc.Vec3(270.1203, 204.9637, .7634302), pista0Spline_ciudad_angulos[45] = new pc.Vec3(270.3071, 207.3129, .3080392), pista0Spline_ciudad_angulos[46] = new pc.Vec3(270.4627, 209.7251, .2106344), pista0Spline_ciudad_angulos[47] = new pc.Vec3(270.5848, 212.8848, .1715376), pista0Spline_ciudad_angulos[48] = new pc.Vec3(270.5279, 215.8013, .1960659), pista0Spline_ciudad_angulos[49] = new pc.Vec3(270.4415, 218.2607, .2389064), pista0Spline_ciudad_angulos[50] = new pc.Vec3(270.2307, 219.2117, .4603091), pista0Spline_ciudad_angulos[51] = new pc.Vec3(270.1342, 220.683, .794959), pista0Spline_ciudad_angulos[52] = new pc.Vec3(270.0593, 223.7018, 0), pista0Spline_ciudad_angulos[53] = new pc.Vec3(270.1399, 227.4847, .7967844), pista0Spline_ciudad_angulos[54] = new pc.Vec3(270.222, 231.0186, .5167014), pista0Spline_ciudad_angulos[55] = new pc.Vec3(270.3153, 234.2687, .3744273), pista0Spline_ciudad_angulos[56] = new pc.Vec3(270.3712, 236.7769, .3215151), pista0Spline_ciudad_angulos[57] = new pc.Vec3(270.483, 238.9224, .2495865), pista0Spline_ciudad_angulos[58] = new pc.Vec3(270.6052, 240.9603, .2012964), pista0Spline_ciudad_angulos[59] = new pc.Vec3(270.8113, 241.6236, .1508247), pista0Spline_ciudad_angulos[60] = new pc.Vec3(270.8904, 243.0723, .1384895), pista0Spline_ciudad_angulos[61] = new pc.Vec3(270.9338, 244.6213, .1325324), pista0Spline_ciudad_angulos[62] = new pc.Vec3(270.5835, 248.3489, .2149941), pista0Spline_ciudad_angulos[63] = new pc.Vec3(270.331, 251.5879, .3836413), pista0Spline_ciudad_angulos[64] = new pc.Vec3(270.0656, 255.4922, 0), pista0Spline_ciudad_angulos[65] = new pc.Vec3(270.028, 258.2009, 0), pista0Spline_ciudad_angulos[66] = new pc.Vec3(270.0198, 260.7136, 0), pista0Spline_ciudad_angulos[67] = new pc.Vec3(270, 262.7816, 0), pista0Spline_ciudad_angulos[68] = new pc.Vec3(270, 264.4936, 0), pista0Spline_ciudad_angulos[69] = new pc.Vec3(270, 266.3763, 0), pista0Spline_ciudad_angulos[70] = new pc.Vec3(270, 269.2402, 0), pista0Spline_ciudad_angulos[71] = new pc.Vec3(270, 269.7208, 0), pista0Spline_ciudad_angulos[72] = new pc.Vec3(270, 270.0123, 0), pista0Spline_ciudad_angulos[73] = new pc.Vec3(270, 269.7588, 0), pista0Spline_ciudad_angulos[74] = new pc.Vec3(270, 269.718, 0), pista0Spline_ciudad_angulos[75] = new pc.Vec3(270, 269.6889, 0), pista0Spline_ciudad_angulos[76] = new pc.Vec3(270, 269.6801, 0), pista0Spline_ciudad_angulos[77] = new pc.Vec3(270, 269.6481, 0), pista0Spline_ciudad_angulos[78] = new pc.Vec3(270, 269.6159, 0), pista0Spline_ciudad_angulos[79] = new pc.Vec3(270, 269.6248, 0), pista0Spline_ciudad_angulos[80] = new pc.Vec3(270, 269.6452, 0), pista0Spline_ciudad_angulos[81] = new pc.Vec3(270, 269.6743, 0), pista0Spline_ciudad_angulos[82] = new pc.Vec3(270, 269.6714, 0), pista0Spline_ciudad_angulos[83] = new pc.Vec3(270, 269.7005, 0), pista0Spline_ciudad_angulos[84] = new pc.Vec3(270, 269.747, 0), pista0Spline_ciudad_angulos[85] = new pc.Vec3(270, 269.8316, 0), pista0Spline_ciudad_angulos[86] = new pc.Vec3(270.028, 269.8783, 0), pista0Spline_ciudad_angulos[87] = new pc.Vec3(270.028, 270.1667, 0), pista0Spline_ciudad_angulos[88] = new pc.Vec3(270.1047, 268.8877, 0), pista0Spline_ciudad_angulos[89] = new pc.Vec3(270.2784, 87.14771, 179.5336), pista0Spline_ciudad_angulos[90] = new pc.Vec3(270.641, 81.1788, 179.7986), pista0Spline_ciudad_angulos[91] = new pc.Vec3(270.6321, 74.87651, 179.7978), pista0Spline_ciudad_angulos[92] = new pc.Vec3(270.575, 68.27509, 179.7823), pista0Spline_ciudad_angulos[93] = new pc.Vec3(270.334, 60.05456, 179.6384), pista0Spline_ciudad_angulos[94] = new pc.Vec3(270.4997, 53.45777, 179.7657), pista0Spline_ciudad_angulos[95] = new pc.Vec3(270.7603, 47.19889, 179.8517), pista0Spline_ciudad_angulos[96] = new pc.Vec3(271.0723, 42.16461, 179.8988), pista0Spline_ciudad_angulos[97] = new pc.Vec3(270.938, 36.77065, 179.8893), pista0Spline_ciudad_angulos[98] = new pc.Vec3(270.6026, 31.38955, 179.836), pista0Spline_ciudad_angulos[99] = new pc.Vec3(270.1385, 24.48491, 179.3474), pista0Spline_ciudad_angulos[100] = new pc.Vec3(270.0523, 196.9144, 0), pista0Spline_ciudad_angulos[101] = new pc.Vec3(270.0593, 189.6967, 0), pista0Spline_ciudad_angulos[102] = new pc.Vec3(270, 185.3219, 0), pista0Spline_ciudad_angulos[103] = new pc.Vec3(270.0198, 181.5376, 0), pista0Spline_ciudad_angulos[104] = new pc.Vec3(270.056, 179.0664, 0), pista0Spline_ciudad_angulos[105] = new pc.Vec3(270.2661, 175.9239, .2264805), pista0Spline_ciudad_angulos[106] = new pc.Vec3(270.4711, 172.749, .1216705), pista0Spline_ciudad_angulos[107] = new pc.Vec3(270.7122, 168.5218, .07226139), pista0Spline_ciudad_angulos[108] = new pc.Vec3(270.7415, 165.0809, .0650359), pista0Spline_ciudad_angulos[109] = new pc.Vec3(270.7386, 161.6803, .05979593), pista0Spline_ciudad_angulos[110] = new pc.Vec3(270.6594, 158.2017, .06276798), pista0Spline_ciudad_angulos[111] = new pc.Vec3(270.3494, 154.7278, .1084122), pista0Spline_ciudad_angulos[112] = new pc.Vec3(270, 151.5238, 0), pista0Spline_ciudad_angulos[113] = new pc.Vec3(270.1877, 329.8172, 179.8306), pista0Spline_ciudad_angulos[114] = new pc.Vec3(270.272, 328.6722, 179.8882), pista0Spline_ciudad_angulos[115] = new pc.Vec3(270.3165, 327.8881, 179.9024), pista0Spline_ciudad_angulos[116] = new pc.Vec3(270.3494, 327.3797, 179.9147), pista0Spline_ciudad_angulos[117] = new pc.Vec3(270.3626, 326.9426, 179.9167), pista0Spline_ciudad_angulos[118] = new pc.Vec3(270.3717, 326.6218, 179.9192), pista0Spline_ciudad_angulos[119] = new pc.Vec3(270.3748, 326.3723, 179.9216), pista0Spline_ciudad_angulos[120] = new pc.Vec3(270.3648, 326.1527, 179.9211), pista0Spline_ciudad_angulos[121] = new pc.Vec3(270.346, 325.983, 179.9196), pista0Spline_ciudad_angulos[122] = new pc.Vec3(270.3196, 325.9259, 179.9118), pista0Spline_ciudad_angulos[123] = new pc.Vec3(270.2654, 325.8897, 179.8932), pista0Spline_ciudad_angulos[124] = new pc.Vec3(270.1928, 326.0107, 179.8562), pista0Spline_ciudad_angulos[125] = new pc.Vec3(270.074, 145.894, 0), pista0Spline_ciudad_angulos[126] = new pc.Vec3(270, 145.472, 0), pista0Spline_ciudad_angulos[127] = new pc.Vec3(270, 144.0493, 0), pista0Spline_ciudad_angulos[128] = new pc.Vec3(270, 141.2815, 0), pista0Spline_ciudad_angulos[129] = new pc.Vec3(270, 138.2073, 0), pista0Spline_ciudad_angulos[130] = new pc.Vec3(270, 133.8643, 0), pista0Spline_ciudad_angulos[131] = new pc.Vec3(270, 129.6172, 0), pista0Spline_ciudad_angulos[132] = new pc.Vec3(270, 125.3149, 0), pista0Spline_ciudad_angulos[133] = new pc.Vec3(270.028, 121.9508, 0), pista0Spline_ciudad_angulos[134] = new pc.Vec3(270.3226, 119.254, .02510783), pista0Spline_ciudad_angulos[135] = new pc.Vec3(270.8197, 116.8767, .008826342), pista0Spline_ciudad_angulos[136] = new pc.Vec3(271.7629, 114.0215, .003052474), pista0Spline_ciudad_angulos[137] = new pc.Vec3(272.3204, 110.4992, .002193076), pista0Spline_ciudad_angulos[138] = new pc.Vec3(272.7603, 106.5858, .001063698), pista0Spline_ciudad_angulos[139] = new pc.Vec3(272.6392, 102.3036, .0005562222), pista0Spline_ciudad_angulos[140] = new pc.Vec3(272.3056, 98.45292, .0005942066), pista0Spline_ciudad_angulos[141] = new pc.Vec3(271.6799, 94.8364, -174716e-9), pista0Spline_ciudad_angulos[142] = new pc.Vec3(270.8987, 91.63258, 0), pista0Spline_ciudad_angulos[143] = new pc.Vec3(270.2727, 88.73849, -.0003590659), pista0Spline_ciudad_angulos[144] = new pc.Vec3(270.2112, 266.1917, 180.0009), pista0Spline_ciudad_angulos[145] = new pc.Vec3(270.1769, 265.1537, 180.0028), pista0Spline_ciudad_angulos[146] = new pc.Vec3(270.1702, 263.9068, 179.9971), pista0Spline_ciudad_angulos[147] = new pc.Vec3(270.2455, 262.1144, 179.9972), pista0Spline_ciudad_angulos[148] = new pc.Vec3(270.3159, 259.7415, 179.9988), pista0Spline_ciudad_angulos[149] = new pc.Vec3(270.3856, 257.2349, 179.9982), pista0Spline_ciudad_angulos[150] = new pc.Vec3(270.4485, 254.0235, 179.995), pista0Spline_ciudad_angulos[151] = new pc.Vec3(270.4589, 250.5589, 179.9932), pista0Spline_ciudad_angulos[152] = new pc.Vec3(270.4554, 247.0678, 179.9897), pista0Spline_ciudad_angulos[153] = new pc.Vec3(270.381, 244.1233, 179.9818), pista0Spline_ciudad_angulos[154] = new pc.Vec3(270.2609, 242.3764, 179.9743), pista0Spline_ciudad_angulos[155] = new pc.Vec3(270.1119, 61.08594, 0), pista0Spline_ciudad_angulos[156] = new pc.Vec3(270.0949, 61.39893, 0), pista0Spline_ciudad_angulos[157] = new pc.Vec3(270.1655, 240.0265, 179.9474), pista0Spline_ciudad_angulos[158] = new pc.Vec3(270.8379, 236.8688, 179.9876), pista0Spline_ciudad_angulos[159] = new pc.Vec3(271.0226, 238.6008, 179.9906), pista0Spline_ciudad_angulos[160] = new pc.Vec3(271.1464, 240.3543, 179.9926), pista0Spline_ciudad_angulos[161] = new pc.Vec3(271.1494, 242.8232, 179.9939), pista0Spline_ciudad_angulos[162] = new pc.Vec3(271.1306, 245.675, 179.9946), pista0Spline_ciudad_angulos[163] = new pc.Vec3(271.0956, 248.6627, 179.9954), pista0Spline_ciudad_angulos[164] = new pc.Vec3(271.0397, 251.9112, 179.9976), pista0Spline_ciudad_angulos[165] = new pc.Vec3(270.9594, 255.4263, 179.9973), pista0Spline_ciudad_angulos[166] = new pc.Vec3(270.8724, 259.0462, 179.9975), pista0Spline_ciudad_angulos[167] = new pc.Vec3(270.772, 262.9624, 179.9992), pista0Spline_ciudad_angulos[168] = new pc.Vec3(270.6558, 267.0374, 180.0006), pista0Spline_ciudad_angulos[169] = new pc.Vec3(270.533, 271.1821, 180.0011), pista0Spline_ciudad_angulos[170] = new pc.Vec3(270.3907, 275.4576, 180.0003), pista0Spline_ciudad_angulos[171] = new pc.Vec3(270.2487, 279.4435, 179.9937), pista0Spline_ciudad_angulos[172] = new pc.Vec3(270.1083, 103.403, 0), pista0Spline_ciudad_angulos[173] = new pc.Vec3(270.0396, 107.1676, 0), pista0Spline_ciudad_angulos[174] = new pc.Vec3(270, 110.1617, 0), pista0Spline_ciudad_angulos[175] = new pc.Vec3(270, 112.7695, 0), pista0Spline_ciudad_angulos[176] = new pc.Vec3(270.0396, 115.71, 0), pista0Spline_ciudad_angulos[177] = new pc.Vec3(270.056, 118.7524, 0), pista0Spline_ciudad_angulos[178] = new pc.Vec3(270.074, 121.9372, 0), pista0Spline_ciudad_angulos[179] = new pc.Vec3(270.0949, 125.2725, 0), pista0Spline_ciudad_angulos[180] = new pc.Vec3(270.1154, 128.518, 0), pista0Spline_ciudad_angulos[181] = new pc.Vec3(270.1399, 311.9242, 179.8844), pista0Spline_ciudad_angulos[182] = new pc.Vec3(270.1725, 314.9282, 179.8883), pista0Spline_ciudad_angulos[183] = new pc.Vec3(270.1998, 317.732, 179.8959), pista0Spline_ciudad_angulos[184] = new pc.Vec3(270.2299, 320.2008, 179.901), pista0Spline_ciudad_angulos[185] = new pc.Vec3(270.2669, 321.8894, 179.9094), pista0Spline_ciudad_angulos[186] = new pc.Vec3(270.2987, 323.3544, 179.9122), pista0Spline_ciudad_angulos[187] = new pc.Vec3(270.3438, 323.9385, 179.922), pista0Spline_ciudad_angulos[188] = new pc.Vec3(270.3685, 323.1708, 179.9318), pista0Spline_ciudad_angulos[189] = new pc.Vec3(270.3937, 322.0674, 179.9371), pista0Spline_ciudad_angulos[190] = new pc.Vec3(270.5105, 318.5775, 179.9564), pista0Spline_ciudad_angulos[191] = new pc.Vec3(270.5345, 315.0497, 179.9647), pista0Spline_ciudad_angulos[192] = new pc.Vec3(270.5316, 311.3558, 179.9695), pista0Spline_ciudad_angulos[193] = new pc.Vec3(270.5399, 308.5244, 179.9754), pista0Spline_ciudad_angulos[194] = new pc.Vec3(270.5256, 305.8214, 179.976), pista0Spline_ciudad_angulos[195] = new pc.Vec3(270.5051, 303.287, 179.9787), pista0Spline_ciudad_angulos[196] = new pc.Vec3(270.4694, 300.7832, 179.979), pista0Spline_ciudad_angulos[197] = new pc.Vec3(270.4168, 298.1066, 179.9834), pista0Spline_ciudad_angulos[198] = new pc.Vec3(270.3583, 295.4128, 179.9817), pista0Spline_ciudad_angulos[199] = new pc.Vec3(270.2661, 292.2066, 179.9828), pista0Spline_ciudad_angulos[200] = new pc.Vec3(270.1558, 288.5487, 179.9784), pista0Spline_ciudad_angulos[201] = new pc.Vec3(270, 103.4595, 0), pista0Spline_ciudad_angulos[202] = new pc.Vec3(270.1028, 101.4511, 0), pista0Spline_ciudad_angulos[203] = new pc.Vec3(270.1908, 100.4964, .009226332), pista0Spline_ciudad_angulos[204] = new pc.Vec3(270.1747, 103.1881, .008880055), pista0Spline_ciudad_angulos[205] = new pc.Vec3(270.1631, 106.5442, .02002927), pista0Spline_ciudad_angulos[206] = new pc.Vec3(270.1507, 110.1775, .02302127), pista0Spline_ciudad_angulos[207] = new pc.Vec3(270.1187, 114.695, .05036112), pista0Spline_ciudad_angulos[208] = new pc.Vec3(270.0839, 119.6579, 0), pista0Spline_ciudad_angulos[209] = new pc.Vec3(270.0396, 124.7268, 0), pista0Spline_ciudad_angulos[210] = new pc.Vec3(270, 129.8411, 0), pista0Spline_ciudad_angulos[211] = new pc.Vec3(270.028, 134.4165, 0), pista0Spline_ciudad_angulos[212] = new pc.Vec3(270.0626, 138.8888, 0), pista0Spline_ciudad_angulos[213] = new pc.Vec3(270.1083, 142.6925, 0), pista0Spline_ciudad_angulos[214] = new pc.Vec3(270.1507, 326.2407, 179.8102), pista0Spline_ciudad_angulos[215] = new pc.Vec3(270.2357, 329.2802, 179.8678), pista0Spline_ciudad_angulos[216] = new pc.Vec3(270, 151.5834, 0), pista0Spline_ciudad_angulos[217] = new pc.Vec3(270.2947, 153.8112, .1213958), pista0Spline_ciudad_angulos[218] = new pc.Vec3(270.8202, 156.1067, .04806527), pista0Spline_ciudad_angulos[219] = new pc.Vec3(271.3682, 158.2191, .03035598), pista0Spline_ciudad_angulos[220] = new pc.Vec3(271.8826, 160.3165, .02315497), pista0Spline_ciudad_angulos[221] = new pc.Vec3(272.3388, 162.4431, .01930812), pista0Spline_ciudad_angulos[222] = new pc.Vec3(272.7312, 164.3874, .01737843), pista0Spline_ciudad_angulos[223] = new pc.Vec3(273.1092, 166.3136, .01600001), pista0Spline_ciudad_angulos[224] = new pc.Vec3(273.4302, 168.1779, .01521061), pista0Spline_ciudad_angulos[225] = new pc.Vec3(273.6405, 170.0075, .01456873), pista0Spline_ciudad_angulos[226] = new pc.Vec3(273.8244, 171.7921, .01455412), pista0Spline_ciudad_angulos[227] = new pc.Vec3(273.9061, 173.4758, .01461342), pista0Spline_ciudad_angulos[228] = new pc.Vec3(273.7721, 175.142, .0159495), pista0Spline_ciudad_angulos[229] = new pc.Vec3(273.5719, 176.746, .01733719), pista0Spline_ciudad_angulos[230] = new pc.Vec3(272.4892, 178.4461, .02531127), pista0Spline_ciudad_angulos[231] = new pc.Vec3(271.2863, 179.3792, .04951951), pista0Spline_ciudad_angulos[232] = new pc.Vec3(270.1938, .4740069, 179.6659), pista0Spline_ciudad_angulos[233] = new pc.Vec3(270.0443, 179.9639, 0), pista0Spline_ciudad_angulos[234] = new pc.Vec3(270, 179.9755, 0), pista0Spline_ciudad_angulos[235] = new pc.Vec3(270, 180.0222, 0), pista0Spline_ciudad_angulos[236] = new pc.Vec3(270, 179.9988, 0), pista0Spline_ciudad_angulos[237] = new pc.Vec3(270, 179.9639, 0), pista0Spline_ciudad_angulos[238] = new pc.Vec3(270, 179.9406, 0), pista0Spline_ciudad_angulos[239] = new pc.Vec3(270, 179.9988, 0), pista0Spline_ciudad_angulos[240] = new pc.Vec3(270, 180.0105, 0), pista0Spline_ciudad_angulos[241] = new pc.Vec3(270, 179.9522, 0), pista0Spline_ciudad_angulos[242] = new pc.Vec3(270, 179.9755, 0), pista0Spline_ciudad_angulos[243] = new pc.Vec3(270, 179.9988, 0), pista0Spline_ciudad_angulos[244] = new pc.Vec3(270, 180.0222, 0), pista0Spline_ciudad_angulos[245] = new pc.Vec3(270, 180.0105, 0), pista0Spline_ciudad_angulos[246] = new pc.Vec3(270, 179.9988, 0), pista0Spline_ciudad_angulos[247] = new pc.Vec3(270, 179.9639, 0), pista0Spline_ciudad_angulos[248] = new pc.Vec3(270, 179.9988, 0), pista0Spline_ciudad_angulos[249] = new pc.Vec3(270, 180.0338, 0), pista0Spline_ciudad_angulos[250] = new pc.Vec3(270, 179.9988, 0), pista0Spline_ciudad_angulos[251] = new pc.Vec3(270, 179.9872, 0), pista0Spline_ciudad_angulos[252] = new pc.Vec3(270, 179.9522, 0), pista0Spline_ciudad_angulos[253] = new pc.Vec3(270, 180.0105, 0), pista0Spline_ciudad_angulos[254] = new pc.Vec3(270, 180.0222, 0), pista0Spline_ciudad_angulos[255] = new pc.Vec3(270, 179.9988, 0), pista0Spline_ciudad_angulos[256] = new pc.Vec3(270, 179.9755, 0), pista0Spline_ciudad_angulos[257] = new pc.Vec3(270, 179.9755, 0), pista0Spline_ciudad_angulos[258] = new pc.Vec3(270, 179.9988, 0), pista0Spline_ciudad_angulos[259] = new pc.Vec3(270, 180.0105, 0);
var ReproduceAnimSprite = pc.createScript("reproduceAnimSprite");
ReproduceAnimSprite.attributes.add("frames", {
    type: "number",
    title: "frames"
}), ReproduceAnimSprite.attributes.add("spriteNumber", {
    type: "number",
    title: "spriteNumber"
}), ReproduceAnimSprite.attributes.add("loop", {
    type: "boolean",
    title: "loop"
}), ReproduceAnimSprite.attributes.add("desde", {
    type: "number",
    title: "desde"
}), ReproduceAnimSprite.attributes.add("hasta", {
    type: "number",
    title: "hasta"
}), ReproduceAnimSprite.attributes.add("autoStart", {
    type: "boolean",
    title: "autoStart"
}), ReproduceAnimSprite.attributes.add("hideOnFinish", {
    type: "boolean",
    title: "hideOnFinish"
}), ReproduceAnimSprite.prototype.initialize = function() {
    this.index = this.desde, this.cont = 0, this.callBack = null
}, ReproduceAnimSprite.prototype.play = function(t, e, i) {
    this.cont = 0, this.desde = e, null == e && (this.desde = 0), this.hasta = i, null == i && (this.hasta = this.spriteNumber), this.index = this.desde, this.callBack = t, this.autoStart = !0
}, ReproduceAnimSprite.prototype.update = function(t) {
    if (this.autoStart) {
        var e = t,
            i = 1 / e;
        this.cont = this.cont + e;
        var s = i / this.frames;
        s /= i, this.cont >= s && (this.cont = 0, this.entity.element.spriteFrame = this.index, this.index = this.index + 1, this.index == this.hasta && (this.loop ? this.index = 0 : (this.autoStart = !1, null != this.callBack && this.callBack(), this.hideOnFinish && (this.entity.enabled = !1))))
    }
};
var AmmoCcd = pc.createScript("ammoCcd");
AmmoCcd.attributes.add("motionThreshold", {
    type: "number",
    default: 1,
    title: "Motion Threshold",
    description: "Number of meters moved in one frame before CCD is enabled"
}), AmmoCcd.attributes.add("sweptSphereRadius", {
    type: "number",
    default: .2,
    title: "Swept Sphere Radius",
    description: "This should be below the half extent of the collision volume. E.g For an object of dimensions 1 meter, try 0.2"
}), AmmoCcd.prototype.initialize = function() {
    this.entity.rigidbody && (this.entity.rigidbody.body.setCcdMotionThreshold(this.motionThreshold), this.entity.rigidbody.body.setCcdSweptSphereRadius(this.sweptSphereRadius))
};
var conexionPista0 = [],
    vientoPista0 = [];
vientoPista0[0] = 25, vientoPista0[1] = 124;
var pista0_tunelSpline_ciudad = [];
pista0_tunelSpline_ciudad[0] = new pc.Vec3(0, 0, 0), pista0_tunelSpline_ciudad[1] = new pc.Vec3(0, 0, 0), pista0_tunelSpline_ciudad[2] = new pc.Vec3(0, 0, -.5999756), pista0_tunelSpline_ciudad[3] = new pc.Vec3(0, 0, -1.199982), pista0_tunelSpline_ciudad[4] = new pc.Vec3(0, 0, -1.799988), pista0_tunelSpline_ciudad[5] = new pc.Vec3(0, 0, -2.399994), pista0_tunelSpline_ciudad[6] = new pc.Vec3(0, 0, -3), pista0_tunelSpline_ciudad[7] = new pc.Vec3(0, 0, -3.599976), pista0_tunelSpline_ciudad[8] = new pc.Vec3(0, 0, -4.199982), pista0_tunelSpline_ciudad[9] = new pc.Vec3(0, 0, -4.799988), pista0_tunelSpline_ciudad[10] = new pc.Vec3(0, 0, -5.399994), pista0_tunelSpline_ciudad[11] = new pc.Vec3(0, 0, -6), pista0_tunelSpline_ciudad[12] = new pc.Vec3(0, 0, -6.599976), pista0_tunelSpline_ciudad[13] = new pc.Vec3(0, 0, -7.199982), pista0_tunelSpline_ciudad[14] = new pc.Vec3(0, 0, -7.799988), pista0_tunelSpline_ciudad[15] = new pc.Vec3(0, 0, -8.399994), pista0_tunelSpline_ciudad[16] = new pc.Vec3(0, 0, -9), pista0_tunelSpline_ciudad[17] = new pc.Vec3(0, 0, -9.599976), pista0_tunelSpline_ciudad[18] = new pc.Vec3(0, 0, -10.19998), pista0_tunelSpline_ciudad[19] = new pc.Vec3(0, 0, -10.79999), pista0_tunelSpline_ciudad[20] = new pc.Vec3(0, 0, -11.39999), pista0_tunelSpline_ciudad[21] = new pc.Vec3(0, 0, -12), pista0_tunelSpline_ciudad[22] = new pc.Vec3(0, 0, -12.59998), pista0_tunelSpline_ciudad[23] = new pc.Vec3(0, -.001201129, -13.19998), pista0_tunelSpline_ciudad[24] = new pc.Vec3(0, -.003960991, -13.79996), pista0_tunelSpline_ciudad[25] = new pc.Vec3(0, -.006739807, -14.39996), pista0_tunelSpline_ciudad[26] = new pc.Vec3(0, -.006718159, -14.99997), pista0_tunelSpline_ciudad[27] = new pc.Vec3(0, -.006225991, -15.59998), pista0_tunelSpline_ciudad[28] = new pc.Vec3(0, -.006297565, -16.19998), pista0_tunelSpline_ciudad[29] = new pc.Vec3(0, -.006327534, -16.79996), pista0_tunelSpline_ciudad[30] = new pc.Vec3(0, -.006332827, -17.39996), pista0_tunelSpline_ciudad[31] = new pc.Vec3(0, -.006338596, -17.99997), pista0_tunelSpline_ciudad[32] = new pc.Vec3(0, -.006338048, -18.59998), pista0_tunelSpline_ciudad[33] = new pc.Vec3(0, -.006335712, -19.19998), pista0_tunelSpline_ciudad[34] = new pc.Vec3(0, -.006348514, -19.79999), pista0_tunelSpline_ciudad[35] = new pc.Vec3(0, -.006358099, -20.39996), pista0_tunelSpline_ciudad[36] = new pc.Vec3(0, -.006361961, -20.99997), pista0_tunelSpline_ciudad[37] = new pc.Vec3(0, -.006366658, -21.59998), pista0_tunelSpline_ciudad[38] = new pc.Vec3(0, -.006371951, -22.19995), pista0_tunelSpline_ciudad[39] = new pc.Vec3(0, -.006376648, -22.79996), pista0_tunelSpline_ciudad[40] = new pc.Vec3(0, -.006382418, -23.39996), pista0_tunelSpline_ciudad[41] = new pc.Vec3(0, -.00638485, -23.99997), pista0_tunelSpline_ciudad[42] = new pc.Vec3(0, -.006380486, -24.59998), pista0_tunelSpline_ciudad[43] = new pc.Vec3(0, -.006389594, -25.19995), pista0_tunelSpline_ciudad[44] = new pc.Vec3(0, -.00640192, -25.79999), pista0_tunelSpline_ciudad[45] = new pc.Vec3(.001340866, -.00640626, -26.39996), pista0_tunelSpline_ciudad[46] = new pc.Vec3(0, -.006408691, -26.99997), pista0_tunelSpline_ciudad[47] = new pc.Vec3(-.01046944, -.006409335, -27.59979), pista0_tunelSpline_ciudad[48] = new pc.Vec3(-.0512104, -.006409144, -28.19836), pista0_tunelSpline_ciudad[49] = new pc.Vec3(-.1227436, -.006409308, -28.79401), pista0_tunelSpline_ciudad[50] = new pc.Vec3(-.2283344, -.006409829, -29.38455), pista0_tunelSpline_ciudad[51] = new pc.Vec3(-.3692036, -.006401285, -29.96765), pista0_tunelSpline_ciudad[52] = new pc.Vec3(-.5546284, -.006399054, -30.53815), pista0_tunelSpline_ciudad[53] = new pc.Vec3(-.7832661, -.006408378, -31.09265), pista0_tunelSpline_ciudad[54] = new pc.Vec3(-1.063875, -.006409346, -31.62271), pista0_tunelSpline_ciudad[55] = new pc.Vec3(-1.384401, -.006408396, -32.12982), pista0_tunelSpline_ciudad[56] = new pc.Vec3(-1.735262, -.006408389, -32.61649), pista0_tunelSpline_ciudad[57] = new pc.Vec3(-2.096712, -.006408141, -33.09537), pista0_tunelSpline_ciudad[58] = new pc.Vec3(-2.491854, -.006408594, -33.54636), pista0_tunelSpline_ciudad[59] = new pc.Vec3(-2.931917, -.006407954, -33.95407), pista0_tunelSpline_ciudad[60] = new pc.Vec3(-3.389772, -.006398841, -34.34186), pista0_tunelSpline_ciudad[61] = new pc.Vec3(-3.855379, -.006398664, -34.72028), pista0_tunelSpline_ciudad[62] = new pc.Vec3(-4.32584, -.006406948, -35.09262), pista0_tunelSpline_ciudad[63] = new pc.Vec3(-4.797886, -.006409627, -35.46298), pista0_tunelSpline_ciudad[64] = new pc.Vec3(-5.270939, -.006408134, -35.83203), pista0_tunelSpline_ciudad[65] = new pc.Vec3(-5.74271, -.006408192, -36.20282), pista0_tunelSpline_ciudad[66] = new pc.Vec3(-6.211491, -.006407894, -36.57733), pista0_tunelSpline_ciudad[67] = new pc.Vec3(-6.674717, -.006408195, -36.95859), pista0_tunelSpline_ciudad[68] = new pc.Vec3(-7.118412, -.006408387, -37.36227), pista0_tunelSpline_ciudad[69] = new pc.Vec3(-7.536442, -.006406209, -37.79266), pista0_tunelSpline_ciudad[70] = new pc.Vec3(-7.942936, -.006397955, -38.23389), pista0_tunelSpline_ciudad[71] = new pc.Vec3(-8.336643, -.006400793, -38.68671), pista0_tunelSpline_ciudad[72] = new pc.Vec3(-8.706547, -.006409125, -39.15887), pista0_tunelSpline_ciudad[73] = new pc.Vec3(-9.035465, -.006408649, -39.66037), pista0_tunelSpline_ciudad[74] = new pc.Vec3(-9.300022, -.006408428, -40.19846), pista0_tunelSpline_ciudad[75] = new pc.Vec3(-9.49921, -.00640834, -40.76404), pista0_tunelSpline_ciudad[76] = new pc.Vec3(-9.628208, -.006408143, -41.34973), pista0_tunelSpline_ciudad[77] = new pc.Vec3(-9.706638, -.006409142, -41.9444), pista0_tunelSpline_ciudad[78] = new pc.Vec3(-9.745762, -.006408116, -42.54309), pista0_tunelSpline_ciudad[79] = new pc.Vec3(-9.762547, -.006397673, -43.14282), pista0_tunelSpline_ciudad[80] = new pc.Vec3(-9.767307, -.006396529, -43.7428), pista0_tunelSpline_ciudad[81] = new pc.Vec3(-9.765583, -.006400749, -44.34277), pista0_tunelSpline_ciudad[82] = new pc.Vec3(-9.765568, -.006396981, -44.94278), pista0_tunelSpline_ciudad[83] = new pc.Vec3(-9.765598, -.006392619, -45.54279), pista0_tunelSpline_ciudad[84] = new pc.Vec3(-9.765568, -.006388851, -46.14279), pista0_tunelSpline_ciudad[85] = new pc.Vec3(-9.765614, -.006385085, -46.7428), pista0_tunelSpline_ciudad[86] = new pc.Vec3(-9.765568, -.006381675, -47.34277), pista0_tunelSpline_ciudad[87] = new pc.Vec3(-9.765598, -.006378385, -47.94278), pista0_tunelSpline_ciudad[88] = new pc.Vec3(-9.765629, -.006366393, -48.54279), pista0_tunelSpline_ciudad[89] = new pc.Vec3(-9.765583, -.006359288, -49.14276), pista0_tunelSpline_ciudad[90] = new pc.Vec3(-9.765614, -.006364581, -49.7428), pista0_tunelSpline_ciudad[91] = new pc.Vec3(-9.765568, -.006363078, -50.34277), pista0_tunelSpline_ciudad[92] = new pc.Vec3(-9.765598, -.006358358, -50.94278), pista0_tunelSpline_ciudad[93] = new pc.Vec3(-9.765629, -.006354472, -51.54279), pista0_tunelSpline_ciudad[94] = new pc.Vec3(-9.765598, -.006350704, -52.14279), pista0_tunelSpline_ciudad[95] = new pc.Vec3(-9.765568, -.006346938, -52.7428), pista0_tunelSpline_ciudad[96] = new pc.Vec3(-9.765537, -.006344005, -53.34277), pista0_tunelSpline_ciudad[97] = new pc.Vec3(-9.765598, -.006334993, -53.94278), pista0_tunelSpline_ciudad[98] = new pc.Vec3(-9.765629, -.006323477, -54.54279), pista0_tunelSpline_ciudad[99] = new pc.Vec3(-9.765598, -.006327339, -55.14279), pista0_tunelSpline_ciudad[100] = new pc.Vec3(-9.765568, -.006328818, -55.7428), pista0_tunelSpline_ciudad[101] = new pc.Vec3(-9.765583, -.006323739, -56.34277), pista0_tunelSpline_ciudad[102] = new pc.Vec3(-9.765614, -.006638261, -56.94281), pista0_tunelSpline_ciudad[103] = new pc.Vec3(-9.765659, -.005540034, -57.54279), pista0_tunelSpline_ciudad[104] = new pc.Vec3(-9.765629, -.002352425, -58.14279), pista0_tunelSpline_ciudad[105] = new pc.Vec3(-9.765629, 0, -58.74277), pista0_tunelSpline_ciudad[106] = new pc.Vec3(-9.765598, .001294449, -59.34277), pista0_tunelSpline_ciudad[107] = new pc.Vec3(-9.765629, .001156119, -59.94278), pista0_tunelSpline_ciudad[108] = new pc.Vec3(-9.765659, .001156159, -60.10846);
var pista0_tunelSpline_ciudad_angulos = [];
pista0_tunelSpline_ciudad_angulos[0] = new pc.Vec3(0, 0, 0), pista0_tunelSpline_ciudad_angulos[1] = new pc.Vec3(270, 270, 0), pista0_tunelSpline_ciudad_angulos[2] = new pc.Vec3(270, 270, 0), pista0_tunelSpline_ciudad_angulos[3] = new pc.Vec3(270, 270, 0), pista0_tunelSpline_ciudad_angulos[4] = new pc.Vec3(270, 270, 0), pista0_tunelSpline_ciudad_angulos[5] = new pc.Vec3(270, 270, 0), pista0_tunelSpline_ciudad_angulos[6] = new pc.Vec3(270, 270, 0), pista0_tunelSpline_ciudad_angulos[7] = new pc.Vec3(270, 270, 0), pista0_tunelSpline_ciudad_angulos[8] = new pc.Vec3(270, 270, 0), pista0_tunelSpline_ciudad_angulos[9] = new pc.Vec3(270, 270, 0), pista0_tunelSpline_ciudad_angulos[10] = new pc.Vec3(270, 270, 0), pista0_tunelSpline_ciudad_angulos[11] = new pc.Vec3(270, 270, 0), pista0_tunelSpline_ciudad_angulos[12] = new pc.Vec3(270, 270, 0), pista0_tunelSpline_ciudad_angulos[13] = new pc.Vec3(270, 270, 0), pista0_tunelSpline_ciudad_angulos[14] = new pc.Vec3(270, 270, 0), pista0_tunelSpline_ciudad_angulos[15] = new pc.Vec3(270, 270, 0), pista0_tunelSpline_ciudad_angulos[16] = new pc.Vec3(270, 270, 0), pista0_tunelSpline_ciudad_angulos[17] = new pc.Vec3(270, 270.0089, 0), pista0_tunelSpline_ciudad_angulos[18] = new pc.Vec3(270.028, 270.0209, 0), pista0_tunelSpline_ciudad_angulos[19] = new pc.Vec3(270.028, 270.0205, 0), pista0_tunelSpline_ciudad_angulos[20] = new pc.Vec3(270, 270.0076, 0), pista0_tunelSpline_ciudad_angulos[21] = new pc.Vec3(270, 269.9822, 0), pista0_tunelSpline_ciudad_angulos[22] = new pc.Vec3(270.0523, 269.9443, 0), pista0_tunelSpline_ciudad_angulos[23] = new pc.Vec3(270.2185, 179.9839, 89.99866), pista0_tunelSpline_ciudad_angulos[24] = new pc.Vec3(270.2853, 179.9839, 89.99863), pista0_tunelSpline_ciudad_angulos[25] = new pc.Vec3(270.1813, 179.9903, 89.99757), pista0_tunelSpline_ciudad_angulos[26] = new pc.Vec3(270.0485, 270.0278, 0), pista0_tunelSpline_ciudad_angulos[27] = new pc.Vec3(270.028, 270.0218, 0), pista0_tunelSpline_ciudad_angulos[28] = new pc.Vec3(270, 269.986, 0), pista0_tunelSpline_ciudad_angulos[29] = new pc.Vec3(270, 269.9995, 0), pista0_tunelSpline_ciudad_angulos[30] = new pc.Vec3(270, 269.9995, 0), pista0_tunelSpline_ciudad_angulos[31] = new pc.Vec3(270, 269.9996, 0), pista0_tunelSpline_ciudad_angulos[32] = new pc.Vec3(270, 270.0005, 0), pista0_tunelSpline_ciudad_angulos[33] = new pc.Vec3(270, 269.9995, 0), pista0_tunelSpline_ciudad_angulos[34] = new pc.Vec3(270, 269.9986, 0), pista0_tunelSpline_ciudad_angulos[35] = new pc.Vec3(270, 269.9995, 0), pista0_tunelSpline_ciudad_angulos[36] = new pc.Vec3(270, 269.9996, 0), pista0_tunelSpline_ciudad_angulos[37] = new pc.Vec3(270, 269.9995, 0), pista0_tunelSpline_ciudad_angulos[38] = new pc.Vec3(270, 269.9995, 0), pista0_tunelSpline_ciudad_angulos[39] = new pc.Vec3(270, 269.9995, 0), pista0_tunelSpline_ciudad_angulos[40] = new pc.Vec3(270, 269.9994, 0), pista0_tunelSpline_ciudad_angulos[41] = new pc.Vec3(270, 270.0003, 0), pista0_tunelSpline_ciudad_angulos[42] = new pc.Vec3(270, 270, 0), pista0_tunelSpline_ciudad_angulos[43] = new pc.Vec3(270, 269.9985, 0), pista0_tunelSpline_ciudad_angulos[44] = new pc.Vec3(270, 269.9353, 0), pista0_tunelSpline_ciudad_angulos[45] = new pc.Vec3(270, 270.0927, 0), pista0_tunelSpline_ciudad_angulos[46] = new pc.Vec3(270, 270.0174, 0), pista0_tunelSpline_ciudad_angulos[47] = new pc.Vec3(270, 272.6354, 0), pista0_tunelSpline_ciudad_angulos[48] = new pc.Vec3(270, 275.2532, 0), pista0_tunelSpline_ciudad_angulos[49] = new pc.Vec3(270, 278.4692, 0), pista0_tunelSpline_ciudad_angulos[50] = new pc.Vec3(270, 281.8616, 0), pista0_tunelSpline_ciudad_angulos[51] = new pc.Vec3(270, 285.5686, 0), pista0_tunelSpline_ciudad_angulos[52] = new pc.Vec3(270, 290.1568, 0), pista0_tunelSpline_ciudad_angulos[53] = new pc.Vec3(270, 294.938, 0), pista0_tunelSpline_ciudad_angulos[54] = new pc.Vec3(270, 300.5047, 0), pista0_tunelSpline_ciudad_angulos[55] = new pc.Vec3(270, 304.2595, 0), pista0_tunelSpline_ciudad_angulos[56] = new pc.Vec3(270, 306.7141, 0), pista0_tunelSpline_ciudad_angulos[57] = new pc.Vec3(270, 308.124, 0), pista0_tunelSpline_ciudad_angulos[58] = new pc.Vec3(270, 314.9555, 0), pista0_tunelSpline_ciudad_angulos[59] = new pc.Vec3(270, 318.5498, 0), pista0_tunelSpline_ciudad_angulos[60] = new pc.Vec3(270, 320.5548, 0), pista0_tunelSpline_ciudad_angulos[61] = new pc.Vec3(270, 321.3413, 0), pista0_tunelSpline_ciudad_angulos[62] = new pc.Vec3(270, 321.7883, 0), pista0_tunelSpline_ciudad_angulos[63] = new pc.Vec3(270, 322.0589, 0), pista0_tunelSpline_ciudad_angulos[64] = new pc.Vec3(270, 321.903, 0), pista0_tunelSpline_ciudad_angulos[65] = new pc.Vec3(270, 321.7576, 0), pista0_tunelSpline_ciudad_angulos[66] = new pc.Vec3(270, 320.9126, 0), pista0_tunelSpline_ciudad_angulos[67] = new pc.Vec3(270, 319.6676, 0), pista0_tunelSpline_ciudad_angulos[68] = new pc.Vec3(270, 315.4533, 0), pista0_tunelSpline_ciudad_angulos[69] = new pc.Vec3(270, 313.3853, 0), pista0_tunelSpline_ciudad_angulos[70] = new pc.Vec3(270, 311.8109, 0), pista0_tunelSpline_ciudad_angulos[71] = new pc.Vec3(270, 310.1449, 0), pista0_tunelSpline_ciudad_angulos[72] = new pc.Vec3(270, 305.6573, 0), pista0_tunelSpline_ciudad_angulos[73] = new pc.Vec3(270, 300.0277, 0), pista0_tunelSpline_ciudad_angulos[74] = new pc.Vec3(270, 292.7967, 0), pista0_tunelSpline_ciudad_angulos[75] = new pc.Vec3(270, 285.7553, 0), pista0_tunelSpline_ciudad_angulos[76] = new pc.Vec3(270, 279.7711, 0), pista0_tunelSpline_ciudad_angulos[77] = new pc.Vec3(270, 275.0195, 0), pista0_tunelSpline_ciudad_angulos[78] = new pc.Vec3(270, 272.8457, 0), pista0_tunelSpline_ciudad_angulos[79] = new pc.Vec3(270, 270.8209, 0), pista0_tunelSpline_ciudad_angulos[80] = new pc.Vec3(270, 269.9239, 0), pista0_tunelSpline_ciudad_angulos[81] = new pc.Vec3(270, 269.9884, 0), pista0_tunelSpline_ciudad_angulos[82] = new pc.Vec3(270, 270.0005, 0), pista0_tunelSpline_ciudad_angulos[83] = new pc.Vec3(270, 270.0004, 0), pista0_tunelSpline_ciudad_angulos[84] = new pc.Vec3(270, 270.0004, 0), pista0_tunelSpline_ciudad_angulos[85] = new pc.Vec3(270, 270.0062, 0), pista0_tunelSpline_ciudad_angulos[86] = new pc.Vec3(270, 270.0002, 0), pista0_tunelSpline_ciudad_angulos[87] = new pc.Vec3(270, 270.0006, 0), pista0_tunelSpline_ciudad_angulos[88] = new pc.Vec3(270, 270.0014, 0), pista0_tunelSpline_ciudad_angulos[89] = new pc.Vec3(270, 269.9997, 0), pista0_tunelSpline_ciudad_angulos[90] = new pc.Vec3(270, 269.9996, 0), pista0_tunelSpline_ciudad_angulos[91] = new pc.Vec3(270, 270.0005, 0), pista0_tunelSpline_ciudad_angulos[92] = new pc.Vec3(270, 270.0004, 0), pista0_tunelSpline_ciudad_angulos[93] = new pc.Vec3(270, 270.0004, 0), pista0_tunelSpline_ciudad_angulos[94] = new pc.Vec3(270, 270.0004, 0), pista0_tunelSpline_ciudad_angulos[95] = new pc.Vec3(270, 270.0003, 0), pista0_tunelSpline_ciudad_angulos[96] = new pc.Vec3(270, 270.0004, 0), pista0_tunelSpline_ciudad_angulos[97] = new pc.Vec3(270, 270.0014, 0), pista0_tunelSpline_ciudad_angulos[98] = new pc.Vec3(270, 270.0003, 0), pista0_tunelSpline_ciudad_angulos[99] = new pc.Vec3(270, 269.9994, 0), pista0_tunelSpline_ciudad_angulos[100] = new pc.Vec3(270, 270.0003, 0), pista0_tunelSpline_ciudad_angulos[101] = new pc.Vec3(270, 269.9997, 0), pista0_tunelSpline_ciudad_angulos[102] = new pc.Vec3(270, 269.9831, 0), pista0_tunelSpline_ciudad_angulos[103] = new pc.Vec3(270.2564, .0007620741, 269.9992), pista0_tunelSpline_ciudad_angulos[104] = new pc.Vec3(270.2727, .0003582083, 269.9996), pista0_tunelSpline_ciudad_angulos[105] = new pc.Vec3(270.1898, -.0005104756, 270.0005), pista0_tunelSpline_ciudad_angulos[106] = new pc.Vec3(270.0396, 270.0371, 0), pista0_tunelSpline_ciudad_angulos[107] = new pc.Vec3(270.028, 269.9713, 0), pista0_tunelSpline_ciudad_angulos[108] = new pc.Vec3(270.028, 269.9713, 0);
var conexionPista2 = [],
    vientoPista2 = [];
vientoPista2[0] = 25, vientoPista2[1] = 124;
var pista2Spline_desierto = [];
pista2Spline_desierto[0] = new pc.Vec3(0, 0, 0), pista2Spline_desierto[1] = new pc.Vec3(0, .003125787, -.6000062), pista2Spline_desierto[2] = new pc.Vec3(0, .003113985, -1.199982), pista2Spline_desierto[3] = new pc.Vec3(0, .003035903, -1.799958), pista2Spline_desierto[4] = new pc.Vec3(0, .002594948, -2.399994), pista2Spline_desierto[5] = new pc.Vec3(0, .003951073, -3.000031), pista2Spline_desierto[6] = new pc.Vec3(-.004303548, .01389408, -3.599883), pista2Spline_desierto[7] = new pc.Vec3(-.01091736, .03954148, -4.199245), pista2Spline_desierto[8] = new pc.Vec3(-.007618702, .06301093, -4.798791), pista2Spline_desierto[9] = new pc.Vec3(.005949622, .08591151, -5.398214), pista2Spline_desierto[10] = new pc.Vec3(.02419472, .1088636, -5.997455), pista2Spline_desierto[11] = new pc.Vec3(.04517806, .1326444, -6.596665), pista2Spline_desierto[12] = new pc.Vec3(.05523302, .1599758, -7.195935), pista2Spline_desierto[13] = new pc.Vec3(.05064444, .1904609, -7.795053), pista2Spline_desierto[14] = new pc.Vec3(.03284804, .2224805, -8.393927), pista2Spline_desierto[15] = new pc.Vec3(0, .2552621, -8.992159), pista2Spline_desierto[16] = new pc.Vec3(-.04934674, .2883775, -9.589199), pista2Spline_desierto[17] = new pc.Vec3(-.1166894, .3214595, -10.18447), pista2Spline_desierto[18] = new pc.Vec3(-.2067595, .3539245, -10.77675), pista2Spline_desierto[19] = new pc.Vec3(-.3233484, .3853109, -11.36443), pista2Spline_desierto[20] = new pc.Vec3(-.4730244, .4147995, -11.94453), pista2Spline_desierto[21] = new pc.Vec3(-.6684363, .441448, -12.511), pista2Spline_desierto[22] = new pc.Vec3(-.9110485, .4651315, -13.05903), pista2Spline_desierto[23] = new pc.Vec3(-1.200511, .4859741, -13.58402), pista2Spline_desierto[24] = new pc.Vec3(-1.5274, .5044591, -14.0867), pista2Spline_desierto[25] = new pc.Vec3(-1.882929, .5212257, -14.56961), pista2Spline_desierto[26] = new pc.Vec3(-2.259255, .5369051, -15.03665), pista2Spline_desierto[27] = new pc.Vec3(-2.647437, .552264, -15.49386), pista2Spline_desierto[28] = new pc.Vec3(-3.039563, .5680244, -15.94772), pista2Spline_desierto[29] = new pc.Vec3(-3.431134, .584583, -16.40201), pista2Spline_desierto[30] = new pc.Vec3(-3.81638, .6025369, -16.86166), pista2Spline_desierto[31] = new pc.Vec3(-4.192381, .6217592, -17.32876), pista2Spline_desierto[32] = new pc.Vec3(-4.556077, .6424959, -17.80559), pista2Spline_desierto[33] = new pc.Vec3(-4.912023, .6641958, -18.28804), pista2Spline_desierto[34] = new pc.Vec3(-5.265565, .6864278, -18.77235), pista2Spline_desierto[35] = new pc.Vec3(-5.619665, .7089326, -19.25611), pista2Spline_desierto[36] = new pc.Vec3(-5.977038, .7314737, -19.73765), pista2Spline_desierto[37] = new pc.Vec3(-6.341322, .7541749, -20.21384), pista2Spline_desierto[38] = new pc.Vec3(-6.714847, .7772558, -20.68277), pista2Spline_desierto[39] = new pc.Vec3(-7.100083, .8004892, -21.14218), pista2Spline_desierto[40] = new pc.Vec3(-7.497883, .8304403, -21.5903), pista2Spline_desierto[41] = new pc.Vec3(-7.910802, .8666456, -22.02401), pista2Spline_desierto[42] = new pc.Vec3(-8.341862, .908241, -22.43922), pista2Spline_desierto[43] = new pc.Vec3(-8.797276, .9516008, -22.82728), pista2Spline_desierto[44] = new pc.Vec3(-9.278491, .995157, -23.18278), pista2Spline_desierto[45] = new pc.Vec3(-9.784731, 1.037191, -23.50186), pista2Spline_desierto[46] = new pc.Vec3(-10.31116, 1.076862, -23.78671), pista2Spline_desierto[47] = new pc.Vec3(-10.85412, 1.111822, -24.03945), pista2Spline_desierto[48] = new pc.Vec3(-11.41025, 1.140154, -24.26274), pista2Spline_desierto[49] = new pc.Vec3(-11.97618, 1.160774, -24.46077), pista2Spline_desierto[50] = new pc.Vec3(-12.54964, 1.173139, -24.63673), pista2Spline_desierto[51] = new pc.Vec3(-13.12864, 1.176958, -24.79384), pista2Spline_desierto[52] = new pc.Vec3(-13.71131, 1.172163, -24.9369), pista2Spline_desierto[53] = new pc.Vec3(-14.29617, 1.159343, -25.07015), pista2Spline_desierto[54] = new pc.Vec3(-14.88223, 1.139066, -25.19707), pista2Spline_desierto[55] = new pc.Vec3(-15.46815, 1.112577, -25.32363), pista2Spline_desierto[56] = new pc.Vec3(-16.05283, 1.08164, -25.45462), pista2Spline_desierto[57] = new pc.Vec3(-16.63648, 1.047773, -25.58963), pista2Spline_desierto[58] = new pc.Vec3(-17.22065, 1.012655, -25.72208), pista2Spline_desierto[59] = new pc.Vec3(-17.80538, .9804437, -25.85258), pista2Spline_desierto[60] = new pc.Vec3(-18.39097, .950527, -25.9799), pista2Spline_desierto[61] = new pc.Vec3(-18.97783, .9194524, -26.10073), pista2Spline_desierto[62] = new pc.Vec3(-19.56615, .885864, -26.21361), pista2Spline_desierto[63] = new pc.Vec3(-20.15599, .8502347, -26.31772), pista2Spline_desierto[64] = new pc.Vec3(-20.7473, .814821, -26.413), pista2Spline_desierto[65] = new pc.Vec3(-21.3402, .7814043, -26.4987), pista2Spline_desierto[66] = new pc.Vec3(-21.93472, .7508943, -26.57353), pista2Spline_desierto[67] = new pc.Vec3(-22.5309, .7243326, -26.6356), pista2Spline_desierto[68] = new pc.Vec3(-23.12874, .7021139, -26.6812), pista2Spline_desierto[69] = new pc.Vec3(-23.72783, .6842706, -26.70854), pista2Spline_desierto[70] = new pc.Vec3(-24.32756, .6704233, -26.71816), pista2Spline_desierto[71] = new pc.Vec3(-24.92738, .6604612, -26.70913), pista2Spline_desierto[72] = new pc.Vec3(-25.52666, .6537874, -26.6813), pista2Spline_desierto[73] = new pc.Vec3(-26.1248, .6498239, -26.63461), pista2Spline_desierto[74] = new pc.Vec3(-26.72127, .6473062, -26.56967), pista2Spline_desierto[75] = new pc.Vec3(-27.31557, .6448343, -26.48745), pista2Spline_desierto[76] = new pc.Vec3(-27.90736, .6409986, -26.38876), pista2Spline_desierto[77] = new pc.Vec3(-28.49646, .6341684, -26.27517), pista2Spline_desierto[78] = new pc.Vec3(-29.08242, .6205633, -26.14712), pista2Spline_desierto[79] = new pc.Vec3(-29.66428, .5988996, -26.00235), pista2Spline_desierto[80] = new pc.Vec3(-30.24094, .5683992, -25.83957), pista2Spline_desierto[81] = new pc.Vec3(-30.81364, .537008, -25.66349), pista2Spline_desierto[82] = new pc.Vec3(-31.38211, .5047586, -25.47422), pista2Spline_desierto[83] = new pc.Vec3(-31.94596, .4718435, -25.27177), pista2Spline_desierto[84] = new pc.Vec3(-32.50436, .4384668, -25.05498), pista2Spline_desierto[85] = new pc.Vec3(-33.05626, .4047182, -24.82195), pista2Spline_desierto[86] = new pc.Vec3(-33.59971, .3707101, -24.5701), pista2Spline_desierto[87] = new pc.Vec3(-34.132, .3368413, -24.29544), pista2Spline_desierto[88] = new pc.Vec3(-34.64305, .3027647, -23.98319), pista2Spline_desierto[89] = new pc.Vec3(-35.13187, .2683942, -23.63725), pista2Spline_desierto[90] = new pc.Vec3(-35.58076, .2333887, -23.24119), pista2Spline_desierto[91] = new pc.Vec3(-35.97911, .1991003, -22.79442), pista2Spline_desierto[92] = new pc.Vec3(-36.32431, .1666963, -22.30499), pista2Spline_desierto[93] = new pc.Vec3(-36.62925, .1369932, -21.78921), pista2Spline_desierto[94] = new pc.Vec3(-36.90916, .1091478, -21.25924), pista2Spline_desierto[95] = new pc.Vec3(-37.14847, .08224273, -20.71005), pista2Spline_desierto[96] = new pc.Vec3(-37.3339, .05572486, -20.14017), pista2Spline_desierto[97] = new pc.Vec3(-37.49347, .03049064, -19.56236), pista2Spline_desierto[98] = new pc.Vec3(-37.64383, .006812811, -18.98197), pista2Spline_desierto[99] = new pc.Vec3(-37.79557, -.015095, -18.4019), pista2Spline_desierto[100] = new pc.Vec3(-37.96388, -.03473115, -17.8264), pista2Spline_desierto[101] = new pc.Vec3(-38.16424, -.0515101, -17.26128), pista2Spline_desierto[102] = new pc.Vec3(-38.40515, -.0646174, -16.71197), pista2Spline_desierto[103] = new pc.Vec3(-38.67846, -.07334352, -16.17803), pista2Spline_desierto[104] = new pc.Vec3(-38.95946, -.0775826, -15.64788), pista2Spline_desierto[105] = new pc.Vec3(-39.24889, -.07777524, -15.12236), pista2Spline_desierto[106] = new pc.Vec3(-39.55904, -.07530046, -14.60882), pista2Spline_desierto[107] = new pc.Vec3(-39.90097, -.07142568, -14.1159), pista2Spline_desierto[108] = new pc.Vec3(-40.28024, -.06708741, -13.6513), pista2Spline_desierto[109] = new pc.Vec3(-40.69889, -.06312108, -13.22185), pista2Spline_desierto[110] = new pc.Vec3(-41.16048, -.06063962, -12.83904), pista2Spline_desierto[111] = new pc.Vec3(-41.65157, -.05950189, -12.49443), pista2Spline_desierto[112] = new pc.Vec3(-42.16775, -.05969644, -12.18877), pista2Spline_desierto[113] = new pc.Vec3(-42.69805, -.05949712, -11.90819), pista2Spline_desierto[114] = new pc.Vec3(-43.24092, -.05935788, -11.65276), pista2Spline_desierto[115] = new pc.Vec3(-43.79403, -.05927396, -11.42034), pista2Spline_desierto[116] = new pc.Vec3(-44.35555, -.05924058, -11.20897), pista2Spline_desierto[117] = new pc.Vec3(-44.92391, -.05921769, -11.01689), pista2Spline_desierto[118] = new pc.Vec3(-45.49795, -.05951524, -10.8424), pista2Spline_desierto[119] = new pc.Vec3(-46.07668, -.05985093, -10.68413), pista2Spline_desierto[120] = new pc.Vec3(-46.65909, -.06004548, -10.53997), pista2Spline_desierto[121] = new pc.Vec3(-47.24503, -.05535436, -10.41106), pista2Spline_desierto[122] = new pc.Vec3(-47.83408, -.04317212, -10.29766), pista2Spline_desierto[123] = new pc.Vec3(-48.42886, -.02443814, -10.22228), pista2Spline_desierto[124] = new pc.Vec3(-49.02662, 0, -10.17717), pista2Spline_desierto[125] = new pc.Vec3(-49.62491, .03185153, -10.14457), pista2Spline_desierto[126] = new pc.Vec3(-50.22364, .06709743, -10.12906), pista2Spline_desierto[127] = new pc.Vec3(-50.82239, .1054332, -10.13123), pista2Spline_desierto[128] = new pc.Vec3(-51.42067, .1455562, -10.15155), pista2Spline_desierto[129] = new pc.Vec3(-52.01797, .1859758, -10.19079), pista2Spline_desierto[130] = new pc.Vec3(-52.61381, .2255657, -10.24919), pista2Spline_desierto[131] = new pc.Vec3(-53.20749, .2629993, -10.32731), pista2Spline_desierto[132] = new pc.Vec3(-53.79844, .2962253, -10.42539), pista2Spline_desierto[133] = new pc.Vec3(-54.38602, .3239505, -10.54349), pista2Spline_desierto[134] = new pc.Vec3(-54.96944, .3448932, -10.68189), pista2Spline_desierto[135] = new pc.Vec3(-55.54786, .3577754, -10.84076), pista2Spline_desierto[136] = new pc.Vec3(-56.12099, .3614032, -11.01797), pista2Spline_desierto[137] = new pc.Vec3(-56.68906, .3555, -11.21112), pista2Spline_desierto[138] = new pc.Vec3(-57.25248, .3397777, -11.41681), pista2Spline_desierto[139] = new pc.Vec3(-57.81027, .3158758, -11.63639), pista2Spline_desierto[140] = new pc.Vec3(-58.36185, .2858551, -11.87065), pista2Spline_desierto[141] = new pc.Vec3(-58.90629, .2527406, -12.12059), pista2Spline_desierto[142] = new pc.Vec3(-59.44219, .2202241, -12.38836), pista2Spline_desierto[143] = new pc.Vec3(-59.96803, .1901672, -12.67559), pista2Spline_desierto[144] = new pc.Vec3(-60.48165, .1655223, -12.98468), pista2Spline_desierto[145] = new pc.Vec3(-60.97949, .1482208, -13.31903), pista2Spline_desierto[146] = new pc.Vec3(-61.45718, .1395814, -13.68182), pista2Spline_desierto[147] = new pc.Vec3(-61.90852, .1407773, -14.07684), pista2Spline_desierto[148] = new pc.Vec3(-62.32405, .1518371, -14.50922), pista2Spline_desierto[149] = new pc.Vec3(-62.68971, .1721771, -14.98407), pista2Spline_desierto[150] = new pc.Vec3(-62.99884, .1997192, -15.49718), pista2Spline_desierto[151] = new pc.Vec3(-63.25484, .2317388, -16.03863), pista2Spline_desierto[152] = new pc.Vec3(-63.46346, .2683561, -16.59984), pista2Spline_desierto[153] = new pc.Vec3(-63.6293, .3071649, -17.17503), pista2Spline_desierto[154] = new pc.Vec3(-63.75569, .3460386, -17.7602), pista2Spline_desierto[155] = new pc.Vec3(-63.84649, .3804796, -18.35224), pista2Spline_desierto[156] = new pc.Vec3(-63.90401, .407625, -18.94873), pista2Spline_desierto[157] = new pc.Vec3(-63.92947, .4251173, -19.54785), pista2Spline_desierto[158] = new pc.Vec3(-63.92411, .4313715, -20.1477), pista2Spline_desierto[159] = new pc.Vec3(-63.88773, .4242761, -20.74652), pista2Spline_desierto[160] = new pc.Vec3(-63.81942, .4020917, -21.3421), pista2Spline_desierto[161] = new pc.Vec3(-63.7207, .3665807, -21.93271), pista2Spline_desierto[162] = new pc.Vec3(-63.56723, .3198659, -22.51045), pista2Spline_desierto[163] = new pc.Vec3(-63.34646, .2651021, -23.06536), pista2Spline_desierto[164] = new pc.Vec3(-63.07061, .2083127, -23.59496), pista2Spline_desierto[165] = new pc.Vec3(-62.75909, .1560495, -24.10492), pista2Spline_desierto[166] = new pc.Vec3(-62.42204, .1116846, -24.59928), pista2Spline_desierto[167] = new pc.Vec3(-62.06738, .07809615, -25.0821), pista2Spline_desierto[168] = new pc.Vec3(-61.70393, .05473876, -25.55888), pista2Spline_desierto[169] = new pc.Vec3(-61.33662, .04276443, -26.03312), pista2Spline_desierto[170] = new pc.Vec3(-60.97053, .0436914, -26.50847), pista2Spline_desierto[171] = new pc.Vec3(-60.61387, .05808425, -26.9907), pista2Spline_desierto[172] = new pc.Vec3(-60.27285, .08548331, -27.48359), pista2Spline_desierto[173] = new pc.Vec3(-59.95621, .125118, -27.99152), pista2Spline_desierto[174] = new pc.Vec3(-59.68051, .1723707, -28.52215), pista2Spline_desierto[175] = new pc.Vec3(-59.45035, .2208822, -29.0739), pista2Spline_desierto[176] = new pc.Vec3(-59.2592, .2651136, -29.64086), pista2Spline_desierto[177] = new pc.Vec3(-59.08937, .2954748, -30.21544), pista2Spline_desierto[178] = new pc.Vec3(-58.94255, .3144853, -30.79685), pista2Spline_desierto[179] = new pc.Vec3(-58.81897, .3233907, -31.38383), pista2Spline_desierto[180] = new pc.Vec3(-58.71734, .3231542, -31.97514), pista2Spline_desierto[181] = new pc.Vec3(-58.63718, .3145788, -32.56968), pista2Spline_desierto[182] = new pc.Vec3(-58.57753, .2989919, -33.16649), pista2Spline_desierto[183] = new pc.Vec3(-58.53703, .2809904, -33.76482), pista2Spline_desierto[184] = new pc.Vec3(-58.51426, .2654111, -34.36419), pista2Spline_desierto[185] = new pc.Vec3(-58.50811, .2545011, -34.96404), pista2Spline_desierto[186] = new pc.Vec3(-58.516, .2489622, -35.5639), pista2Spline_desierto[187] = new pc.Vec3(-58.54544, .2445104, -36.16314), pista2Spline_desierto[188] = new pc.Vec3(-58.59593, .2411497, -36.76098), pista2Spline_desierto[189] = new pc.Vec3(-58.66813, .2394254, -37.35662), pista2Spline_desierto[190] = new pc.Vec3(-58.76035, .2403905, -37.94939), pista2Spline_desierto[191] = new pc.Vec3(-58.87199, .2438695, -38.53887), pista2Spline_desierto[192] = new pc.Vec3(-59.00272, .2496145, -39.12444), pista2Spline_desierto[193] = new pc.Vec3(-59.15219, .2581899, -39.70537), pista2Spline_desierto[194] = new pc.Vec3(-59.32036, .2682798, -40.2813), pista2Spline_desierto[195] = new pc.Vec3(-59.50736, .2784231, -40.85125), pista2Spline_desierto[196] = new pc.Vec3(-59.71317, .288532, -41.41471), pista2Spline_desierto[197] = new pc.Vec3(-59.94241, .2952001, -41.9691), pista2Spline_desierto[198] = new pc.Vec3(-60.19473, .296932, -42.51341), pista2Spline_desierto[199] = new pc.Vec3(-60.47146, .2920263, -43.0457), pista2Spline_desierto[200] = new pc.Vec3(-60.77048, .2819211, -43.56572), pista2Spline_desierto[201] = new pc.Vec3(-61.09086, .2680852, -44.0728), pista2Spline_desierto[202] = new pc.Vec3(-61.43124, .2558134, -44.5667), pista2Spline_desierto[203] = new pc.Vec3(-61.79043, .2459142, -45.04717), pista2Spline_desierto[204] = new pc.Vec3(-62.16772, .2395322, -45.5136), pista2Spline_desierto[205] = new pc.Vec3(-62.56175, .2381094, -45.96599), pista2Spline_desierto[206] = new pc.Vec3(-62.97467, .243057, -46.40129), pista2Spline_desierto[207] = new pc.Vec3(-63.40879, .254154, -46.81517), pista2Spline_desierto[208] = new pc.Vec3(-63.86628, .2711408, -47.2028), pista2Spline_desierto[209] = new pc.Vec3(-64.34505, .291702, -47.5637), pista2Spline_desierto[210] = new pc.Vec3(-64.84375, .3143079, -47.8965), pista2Spline_desierto[211] = new pc.Vec3(-65.36066, .3380125, -48.20003), pista2Spline_desierto[212] = new pc.Vec3(-65.89426, .3668973, -48.47258), pista2Spline_desierto[213] = new pc.Vec3(-66.4434, .4001844, -48.71186), pista2Spline_desierto[214] = new pc.Vec3(-67.00565, .436733, -48.91791), pista2Spline_desierto[215] = new pc.Vec3(-67.57774, .471256, -49.09515), pista2Spline_desierto[216] = new pc.Vec3(-68.15414, .5039861, -49.2586), pista2Spline_desierto[217] = new pc.Vec3(-68.73381, .5335767, -49.41045), pista2Spline_desierto[218] = new pc.Vec3(-69.31788, .557987, -49.54555), pista2Spline_desierto[219] = new pc.Vec3(-69.90653, .5756986, -49.66023), pista2Spline_desierto[220] = new pc.Vec3(-70.49904, .5856245, -49.75398), pista2Spline_desierto[221] = new pc.Vec3(-71.09441, .5874708, -49.82832), pista2Spline_desierto[222] = new pc.Vec3(-71.69172, .5805814, -49.88424), pista2Spline_desierto[223] = new pc.Vec3(-72.28996, .566139, -49.92732), pista2Spline_desierto[224] = new pc.Vec3(-72.88873, .5435598, -49.95818), pista2Spline_desierto[225] = new pc.Vec3(-73.48692, .5151021, -49.99554), pista2Spline_desierto[226] = new pc.Vec3(-74.08414, .4813306, -50.04205), pista2Spline_desierto[227] = new pc.Vec3(-74.68016, .4437864, -50.09967), pista2Spline_desierto[228] = new pc.Vec3(-75.27464, .405113, -50.17115), pista2Spline_desierto[229] = new pc.Vec3(-75.86704, .3669393, -50.2581), pista2Spline_desierto[230] = new pc.Vec3(-76.45667, .3313406, -50.36312), pista2Spline_desierto[231] = new pc.Vec3(-77.04216, .300163, -50.49051), pista2Spline_desierto[232] = new pc.Vec3(-77.62156, .2740095, -50.64373), pista2Spline_desierto[233] = new pc.Vec3(-78.19197, .2538221, -50.82849), pista2Spline_desierto[234] = new pc.Vec3(-78.74796, .2390058, -51.05316), pista2Spline_desierto[235] = new pc.Vec3(-79.28179, .2288282, -51.32635), pista2Spline_desierto[236] = new pc.Vec3(-79.77818, .2216375, -51.66205), pista2Spline_desierto[237] = new pc.Vec3(-80.22243, .2139966, -52.06476), pista2Spline_desierto[238] = new pc.Vec3(-80.60249, .2022588, -52.52784), pista2Spline_desierto[239] = new pc.Vec3(-80.90363, .1842878, -53.0459), pista2Spline_desierto[240] = new pc.Vec3(-81.12437, .1577909, -53.60266), pista2Spline_desierto[241] = new pc.Vec3(-81.27677, .121639, -54.18144), pista2Spline_desierto[242] = new pc.Vec3(-81.37327, .07537436, -54.77168), pista2Spline_desierto[243] = new pc.Vec3(-81.42747, .02044272, -55.36663), pista2Spline_desierto[244] = new pc.Vec3(-81.45683, -.004539728, -55.96527), pista2Spline_desierto[245] = new pc.Vec3(-81.46912, -.009269953, -56.56512), pista2Spline_desierto[246] = new pc.Vec3(-81.4716, -.001514673, -57.16504), pista2Spline_desierto[247] = new pc.Vec3(-81.47225, .002429724, -57.76507), pista2Spline_desierto[248] = new pc.Vec3(-81.47227, .003803015, -58.36505), pista2Spline_desierto[249] = new pc.Vec3(-81.47227, .00323081, -58.96502), pista2Spline_desierto[250] = new pc.Vec3(-81.47226, .003253698, -59.565), pista2Spline_desierto[251] = new pc.Vec3(-81.47226, .003104925, -60.16504), pista2Spline_desierto[252] = new pc.Vec3(-81.47226, .002925634, -60.76501), pista2Spline_desierto[253] = new pc.Vec3(-81.47226, .003040075, -61.36505), pista2Spline_desierto[254] = new pc.Vec3(-81.47226, .00304389, -61.53888);
var pista2Spline_desierto_angulos = [];
pista2Spline_desierto_angulos[0] = new pc.Vec3(0, 0, 0), pista2Spline_desierto_angulos[1] = new pc.Vec3(270.0443, 180.0481, 0), pista2Spline_desierto_angulos[2] = new pc.Vec3(270.0443, 180.0424, 0), pista2Spline_desierto_angulos[3] = new pc.Vec3(270.0523, 180.0294, 0), pista2Spline_desierto_angulos[4] = new pc.Vec3(270.0593, 180.0611, 0), pista2Spline_desierto_angulos[5] = new pc.Vec3(270.2471, 348.6315, 191.5107), pista2Spline_desierto_angulos[6] = new pc.Vec3(272.0484, 359.384, 181.4066), pista2Spline_desierto_angulos[7] = new pc.Vec3(272.2787, 358.815, 181.2487), pista2Spline_desierto_angulos[8] = new pc.Vec3(272.2209, 357.9387, 181.2614), pista2Spline_desierto_angulos[9] = new pc.Vec3(272.167, 357.0813, 181.2738), pista2Spline_desierto_angulos[10] = new pc.Vec3(272.2335, 356.9649, 181.2318), pista2Spline_desierto_angulos[11] = new pc.Vec3(272.3838, 357.0717, 181.1549), pista2Spline_desierto_angulos[12] = new pc.Vec3(272.8154, 358.7328, 181.0039), pista2Spline_desierto_angulos[13] = new pc.Vec3(272.9893, .1061219, 180.9684), pista2Spline_desierto_angulos[14] = new pc.Vec3(273.0994, 1.497909, 180.9557), pista2Spline_desierto_angulos[15] = new pc.Vec3(273.1642, 2.879405, 180.9578), pista2Spline_desierto_angulos[16] = new pc.Vec3(273.1624, 4.595518, 180.9857), pista2Spline_desierto_angulos[17] = new pc.Vec3(273.1374, 6.481011, 181.0234), pista2Spline_desierto_angulos[18] = new pc.Vec3(273.0713, 8.677396, 181.0817), pista2Spline_desierto_angulos[19] = new pc.Vec3(272.9091, 11.61106, 181.1928), pista2Spline_desierto_angulos[20] = new pc.Vec3(272.7015, 15.1613, 181.3508), pista2Spline_desierto_angulos[21] = new pc.Vec3(272.3926, 19.86096, 181.623), pista2Spline_desierto_angulos[22] = new pc.Vec3(272.1302, 24.47792, 181.9274), pista2Spline_desierto_angulos[23] = new pc.Vec3(271.8814, 28.6642, 182.288), pista2Spline_desierto_angulos[24] = new pc.Vec3(271.6631, 32.28413, 182.6896), pista2Spline_desierto_angulos[25] = new pc.Vec3(271.5349, 34.84674, 182.9878), pista2Spline_desierto_angulos[26] = new pc.Vec3(271.4881, 36.43689, 183.1274), pista2Spline_desierto_angulos[27] = new pc.Vec3(271.4746, 37.57537, 183.1877), pista2Spline_desierto_angulos[28] = new pc.Vec3(271.5292, 37.92577, 183.0798), pista2Spline_desierto_angulos[29] = new pc.Vec3(271.657, 37.46027, 182.8246), pista2Spline_desierto_angulos[30] = new pc.Vec3(271.7726, 36.9247, 182.6246), pista2Spline_desierto_angulos[31] = new pc.Vec3(271.9204, 35.55535, 182.3909), pista2Spline_desierto_angulos[32] = new pc.Vec3(272.0289, 34.62365, 182.2414), pista2Spline_desierto_angulos[33] = new pc.Vec3(272.1043, 34.06159, 182.1494), pista2Spline_desierto_angulos[34] = new pc.Vec3(272.1465, 33.92242, 182.1032), pista2Spline_desierto_angulos[35] = new pc.Vec3(272.1492, 34.27859, 182.1074), pista2Spline_desierto_angulos[36] = new pc.Vec3(272.164, 34.87046, 182.1038), pista2Spline_desierto_angulos[37] = new pc.Vec3(272.178, 35.73201, 182.1059), pista2Spline_desierto_angulos[38] = new pc.Vec3(272.1841, 37.15345, 182.1254), pista2Spline_desierto_angulos[39] = new pc.Vec3(272.4526, 38.86722, 181.9161), pista2Spline_desierto_angulos[40] = new pc.Vec3(273.207, 40.92688, 181.4839), pista2Spline_desierto_angulos[41] = new pc.Vec3(273.7233, 43.52092, 181.301), pista2Spline_desierto_angulos[42] = new pc.Vec3(274.1008, 46.47051, 181.205), pista2Spline_desierto_angulos[43] = new pc.Vec3(274.2138, 50.22099, 181.2015), pista2Spline_desierto_angulos[44] = new pc.Vec3(274.0897, 54.48293, 181.2686), pista2Spline_desierto_angulos[45] = new pc.Vec3(273.8981, 58.31182, 181.3579), pista2Spline_desierto_angulos[46] = new pc.Vec3(273.6522, 61.96998, 181.4742), pista2Spline_desierto_angulos[47] = new pc.Vec3(273.0241, 64.831, 181.803), pista2Spline_desierto_angulos[48] = new pc.Vec3(272.3428, 67.05651, 182.3494), pista2Spline_desierto_angulos[49] = new pc.Vec3(271.5979, 68.49308, 183.4719), pista2Spline_desierto_angulos[50] = new pc.Vec3(270.7736, 66.72462, 187.2273), pista2Spline_desierto_angulos[51] = new pc.Vec3(270.1047, 255.5835, 0), pista2Spline_desierto_angulos[52] = new pc.Vec3(270.8634, 263.3388, 353.4914), pista2Spline_desierto_angulos[53] = new pc.Vec3(271.6106, 261.0669, 356.5099), pista2Spline_desierto_angulos[54] = new pc.Vec3(272.2205, 260.3038, 357.469), pista2Spline_desierto_angulos[55] = new pc.Vec3(272.7908, 259.7647, 357.9856), pista2Spline_desierto_angulos[56] = new pc.Vec3(273.1478, 258.7798, 358.2172), pista2Spline_desierto_angulos[57] = new pc.Vec3(273.2841, 258.8459, 358.2912), pista2Spline_desierto_angulos[58] = new pc.Vec3(273.3122, 259.0273, 358.3047), pista2Spline_desierto_angulos[59] = new pc.Vec3(272.8696, 259.4476, 358.0422), pista2Spline_desierto_angulos[60] = new pc.Vec3(272.9334, 259.984, 358.0832), pista2Spline_desierto_angulos[61] = new pc.Vec3(273.0455, 260.5616, 358.1514), pista2Spline_desierto_angulos[62] = new pc.Vec3(273.3742, 261.2432, 358.329), pista2Spline_desierto_angulos[63] = new pc.Vec3(273.3826, 262.0778, 358.3316), pista2Spline_desierto_angulos[64] = new pc.Vec3(273.3272, 263.0007, 358.3016), pista2Spline_desierto_angulos[65] = new pc.Vec3(273.0788, 264.1028, 358.162), pista2Spline_desierto_angulos[66] = new pc.Vec3(272.7282, 265.4935, 357.9228), pista2Spline_desierto_angulos[67] = new pc.Vec3(272.3322, 267.2695, 357.5668), pista2Spline_desierto_angulos[68] = new pc.Vec3(271.9209, 269.3937, 357.0427), pista2Spline_desierto_angulos[69] = new pc.Vec3(271.5053, 272.0471, 356.2218), pista2Spline_desierto_angulos[70] = new pc.Vec3(271.1528, 274.875, 355.0627), pista2Spline_desierto_angulos[71] = new pc.Vec3(270.7738, 279.1484, 352.6363), pista2Spline_desierto_angulos[72] = new pc.Vec3(270.5013, 284.9655, 348.5986), pista2Spline_desierto_angulos[73] = new pc.Vec3(270.331, 292.6814, 342.6419), pista2Spline_desierto_angulos[74] = new pc.Vec3(270.222, 303.2857, 333.7917), pista2Spline_desierto_angulos[75] = new pc.Vec3(270.2683, 300.1777, 338.5256), pista2Spline_desierto_angulos[76] = new pc.Vec3(270.5211, 291.0653, 349.1143), pista2Spline_desierto_angulos[77] = new pc.Vec3(270.9384, 287.6573, 353.994), pista2Spline_desierto_angulos[78] = new pc.Vec3(271.6349, 286.4673, 356.5667), pista2Spline_desierto_angulos[79] = new pc.Vec3(272.5835, 287.1241, 357.8362), pista2Spline_desierto_angulos[80] = new pc.Vec3(273.0199, 288.3121, 358.1565), pista2Spline_desierto_angulos[81] = new pc.Vec3(273.0472, 289.5682, 358.1788), pista2Spline_desierto_angulos[82] = new pc.Vec3(273.1121, 290.8548, 358.2232), pista2Spline_desierto_angulos[83] = new pc.Vec3(273.1713, 292.2055, 358.2641), pista2Spline_desierto_angulos[84] = new pc.Vec3(273.2123, 293.6966, 358.2948), pista2Spline_desierto_angulos[85] = new pc.Vec3(273.2383, 295.5104, 358.3196), pista2Spline_desierto_angulos[86] = new pc.Vec3(273.252, 297.7265, 358.3413), pista2Spline_desierto_angulos[87] = new pc.Vec3(273.2355, 300.6405, 358.3529), pista2Spline_desierto_angulos[88] = new pc.Vec3(273.2672, 304.7444, 358.4016), pista2Spline_desierto_angulos[89] = new pc.Vec3(273.3148, 309.6228, 358.468), pista2Spline_desierto_angulos[90] = new pc.Vec3(273.3403, 316.1988, 358.5449), pista2Spline_desierto_angulos[91] = new pc.Vec3(273.2113, 323.478, 358.5709), pista2Spline_desierto_angulos[92] = new pc.Vec3(272.9571, 328.6481, 358.5179), pista2Spline_desierto_angulos[93] = new pc.Vec3(272.7506, 332.6275, 358.4671), pista2Spline_desierto_angulos[94] = new pc.Vec3(272.5791, 335.2358, 358.4093), pista2Spline_desierto_angulos[95] = new pc.Vec3(272.5758, 341.2497, 358.5153), pista2Spline_desierto_angulos[96] = new pc.Vec3(272.4685, 344.7377, 358.5169), pista2Spline_desierto_angulos[97] = new pc.Vec3(272.3463, 346.9901, 358.4848), pista2Spline_desierto_angulos[98] = new pc.Vec3(272.1869, 347.3295, 358.3799), pista2Spline_desierto_angulos[99] = new pc.Vec3(271.981, 346.2255, 358.1797), pista2Spline_desierto_angulos[100] = new pc.Vec3(271.7585, 344.7328, 357.9008), pista2Spline_desierto_angulos[101] = new pc.Vec3(271.4445, 340.8537, 357.2998), pista2Spline_desierto_angulos[102] = new pc.Vec3(271.04, 338.5671, 356.0961), pista2Spline_desierto_angulos[103] = new pc.Vec3(270.6343, 338.4639, 353.3993), pista2Spline_desierto_angulos[104] = new pc.Vec3(270.1824, 355.4521, 336.6629), pista2Spline_desierto_angulos[105] = new pc.Vec3(270.1282, 115.0005, 214.9903), pista2Spline_desierto_angulos[106] = new pc.Vec3(270.3208, 133.4313, 193.7278), pista2Spline_desierto_angulos[107] = new pc.Vec3(270.4321, 132.8405, 190.5289), pista2Spline_desierto_angulos[108] = new pc.Vec3(270.4102, 126.6459, 191.5977), pista2Spline_desierto_angulos[109] = new pc.Vec3(270.3263, 117.5983, 195.2652), pista2Spline_desierto_angulos[110] = new pc.Vec3(270.1918, 99.54896, 207.3757), pista2Spline_desierto_angulos[111] = new pc.Vec3(270.0906, 302.8176, 0), pista2Spline_desierto_angulos[112] = new pc.Vec3(270.0885, 299.3746, 0), pista2Spline_desierto_angulos[113] = new pc.Vec3(270.0928, 296.5832, 0), pista2Spline_desierto_angulos[114] = new pc.Vec3(270.0969, 294.0569, 0), pista2Spline_desierto_angulos[115] = new pc.Vec3(270.0928, 291.7753, 0), pista2Spline_desierto_angulos[116] = new pc.Vec3(270.0928, 289.7084, 0), pista2Spline_desierto_angulos[117] = new pc.Vec3(270.0949, 287.8577, 0), pista2Spline_desierto_angulos[118] = new pc.Vec3(270.1119, 286.1747, 0), pista2Spline_desierto_angulos[119] = new pc.Vec3(270.0969, 284.6536, 0), pista2Spline_desierto_angulos[120] = new pc.Vec3(270.1219, 50.88942, 232.2975), pista2Spline_desierto_angulos[121] = new pc.Vec3(270.8532, 95.21035, 186.6093), pista2Spline_desierto_angulos[122] = new pc.Vec3(271.4709, 95.59203, 183.8415), pista2Spline_desierto_angulos[123] = new pc.Vec3(272.1257, 92.53447, 182.6695), pista2Spline_desierto_angulos[124] = new pc.Vec3(272.6776, 91.74387, 182.1212), pista2Spline_desierto_angulos[125] = new pc.Vec3(273.2055, 90.52975, 181.7728), pista2Spline_desierto_angulos[126] = new pc.Vec3(273.5574, 89.0508, 181.5974), pista2Spline_desierto_angulos[127] = new pc.Vec3(273.7411, 87.41681, 181.5191), pista2Spline_desierto_angulos[128] = new pc.Vec3(273.8712, 85.6796, 181.4674), pista2Spline_desierto_angulos[129] = new pc.Vec3(273.8692, 83.85996, 181.4666), pista2Spline_desierto_angulos[130] = new pc.Vec3(273.6854, 81.91958, 181.5371), pista2Spline_desierto_angulos[131] = new pc.Vec3(273.3896, 79.87297, 181.668), pista2Spline_desierto_angulos[132] = new pc.Vec3(272.958, 77.69443, 181.9059), pista2Spline_desierto_angulos[133] = new pc.Vec3(272.3439, 75.25269, 182.397), pista2Spline_desierto_angulos[134] = new pc.Vec3(271.6139, 72.18702, 183.4697), pista2Spline_desierto_angulos[135] = new pc.Vec3(270.8195, 66.87402, 186.8076), pista2Spline_desierto_angulos[136] = new pc.Vec3(270.1327, 297.5521, 314.4033), pista2Spline_desierto_angulos[137] = new pc.Vec3(271.0594, 255.8059, 354.7802), pista2Spline_desierto_angulos[138] = new pc.Vec3(271.8984, 252.1417, 357.1017), pista2Spline_desierto_angulos[139] = new pc.Vec3(272.6796, 249.8518, 357.9566), pista2Spline_desierto_angulos[140] = new pc.Vec3(272.9948, 247.9658, 358.183), pista2Spline_desierto_angulos[141] = new pc.Vec3(273.2056, 246.132, 358.3132), pista2Spline_desierto_angulos[142] = new pc.Vec3(273.0591, 244.2421, 358.2471), pista2Spline_desierto_angulos[143] = new pc.Vec3(272.5996, 242.1931, 357.9584), pista2Spline_desierto_angulos[144] = new pc.Vec3(272.056, 240.1803, 357.4485), pista2Spline_desierto_angulos[145] = new pc.Vec3(271.2562, 238.7054, 355.8898), pista2Spline_desierto_angulos[146] = new pc.Vec3(270.3743, 244.4641, 346.3837), pista2Spline_desierto_angulos[147] = new pc.Vec3(270.5733, 37.88723, 188.573), pista2Spline_desierto_angulos[148] = new pc.Vec3(271.5468, 38.00409, 183.0458), pista2Spline_desierto_angulos[149] = new pc.Vec3(272.3446, 32.28484, 181.8932), pista2Spline_desierto_angulos[150] = new pc.Vec3(272.8479, 26.59526, 181.4674), pista2Spline_desierto_angulos[151] = new pc.Vec3(273.2679, 21.55563, 181.2059), pista2Spline_desierto_angulos[152] = new pc.Vec3(273.6825, 17.09263, 181.0111), pista2Spline_desierto_angulos[153] = new pc.Vec3(273.7635, 13.15199, 180.9381), pista2Spline_desierto_angulos[154] = new pc.Vec3(273.4954, 9.466005, 180.9592), pista2Spline_desierto_angulos[155] = new pc.Vec3(273.0524, 6.000338, 181.0446), pista2Spline_desierto_angulos[156] = new pc.Vec3(272.1384, 2.542001, 181.4208), pista2Spline_desierto_angulos[157] = new pc.Vec3(271.129, 358.3973, 182.5602), pista2Spline_desierto_angulos[158] = new pc.Vec3(270.0593, 178.0482, 0), pista2Spline_desierto_angulos[159] = new pc.Vec3(271.4418, 176.8248, 358.1999), pista2Spline_desierto_angulos[160] = new pc.Vec3(272.7273, 172.7843, 359.1057), pista2Spline_desierto_angulos[161] = new pc.Vec3(273.9972, 169.0967, 359.4318), pista2Spline_desierto_angulos[162] = new pc.Vec3(275.0074, 161.919, 359.6137), pista2Spline_desierto_angulos[163] = new pc.Vec3(275.3488, 155.4953, 359.6935), pista2Spline_desierto_angulos[164] = new pc.Vec3(275.2557, 150.6677, 359.7283), pista2Spline_desierto_angulos[165] = new pc.Vec3(274.756, 147.0785, 359.731), pista2Spline_desierto_angulos[166] = new pc.Vec3(273.6867, 144.9799, 359.6763), pista2Spline_desierto_angulos[167] = new pc.Vec3(272.7093, 143.5657, 359.5809), pista2Spline_desierto_angulos[168] = new pc.Vec3(271.7434, 142.825, 359.3694), pista2Spline_desierto_angulos[169] = new pc.Vec3(270.5147, 144.4859, 357.8524), pista2Spline_desierto_angulos[170] = new pc.Vec3(270.7033, 321.253, 181.6007), pista2Spline_desierto_angulos[171] = new pc.Vec3(272.0535, 323.5381, 180.5716), pista2Spline_desierto_angulos[172] = new pc.Vec3(273.2021, 326.2583, 180.3985), pista2Spline_desierto_angulos[173] = new pc.Vec3(274.16, 329.7065, 180.3409), pista2Spline_desierto_angulos[174] = new pc.Vec3(274.8237, 334.6138, 180.3384), pista2Spline_desierto_angulos[175] = new pc.Vec3(274.5105, 339.2874, 180.4099), pista2Spline_desierto_angulos[176] = new pc.Vec3(273.6336, 341.9571, 180.5456), pista2Spline_desierto_angulos[177] = new pc.Vec3(272.2913, 343.7946, 180.9129), pista2Spline_desierto_angulos[178] = new pc.Vec3(271.3321, 345.3268, 181.6526), pista2Spline_desierto_angulos[179] = new pc.Vec3(270.4252, 343.7364, 185.4239), pista2Spline_desierto_angulos[180] = new pc.Vec3(270.4589, 176.5987, 354.7384), pista2Spline_desierto_angulos[181] = new pc.Vec3(271.231, 175.3684, 357.9589), pista2Spline_desierto_angulos[182] = new pc.Vec3(271.5809, 176.8366, 358.3531), pista2Spline_desierto_angulos[183] = new pc.Vec3(271.7444, 178.5717, 358.455), pista2Spline_desierto_angulos[184] = new pc.Vec3(271.2633, 180.8489, 357.802), pista2Spline_desierto_angulos[185] = new pc.Vec3(270.7736, 183.7465, 356.32), pista2Spline_desierto_angulos[186] = new pc.Vec3(270.4173, 188.7179, 352.9884), pista2Spline_desierto_angulos[187] = new pc.Vec3(270.3996, 191.4049, 352.4009), pista2Spline_desierto_angulos[188] = new pc.Vec3(270.2479, 198.5324, 347.3489), pista2Spline_desierto_angulos[189] = new pc.Vec3(270.074, 187.9457, 0), pista2Spline_desierto_angulos[190] = new pc.Vec3(270.229, 355.1689, 194.6358), pista2Spline_desierto_angulos[191] = new pc.Vec3(270.4401, 3.862782, 187.7809), pista2Spline_desierto_angulos[192] = new pc.Vec3(270.6688, 8.259217, 185.2436), pista2Spline_desierto_angulos[193] = new pc.Vec3(270.952, 11.58576, 183.7786), pista2Spline_desierto_angulos[194] = new pc.Vec3(270.9637, 13.37197, 183.8233), pista2Spline_desierto_angulos[195] = new pc.Vec3(270.9479, 15.16414, 183.9826), pista2Spline_desierto_angulos[196] = new pc.Vec3(270.9024, 16.84117, 184.2854), pista2Spline_desierto_angulos[197] = new pc.Vec3(270.4178, 14.09403, 189.5852), pista2Spline_desierto_angulos[198] = new pc.Vec3(270.157, 232.7585, 333.4003), pista2Spline_desierto_angulos[199] = new pc.Vec3(270.7426, 214.3881, 354.329), pista2Spline_desierto_angulos[200] = new pc.Vec3(271.2457, 214.5774, 356.5382), pista2Spline_desierto_angulos[201] = new pc.Vec3(271.2356, 216.982, 356.4296), pista2Spline_desierto_angulos[202] = new pc.Vec3(271.0954, 219.817, 355.8889), pista2Spline_desierto_angulos[203] = new pc.Vec3(270.8171, 223.5273, 354.3741), pista2Spline_desierto_angulos[204] = new pc.Vec3(270.38, 232.3717, 347.6102), pista2Spline_desierto_angulos[205] = new pc.Vec3(270.1725, 13.35965, 208.9296), pista2Spline_desierto_angulos[206] = new pc.Vec3(270.7745, 38.43032, 186.2617), pista2Spline_desierto_angulos[207] = new pc.Vec3(271.3709, 44.49504, 183.6185), pista2Spline_desierto_angulos[208] = new pc.Vec3(271.7982, 48.5378, 182.8153), pista2Spline_desierto_angulos[209] = new pc.Vec3(272.1225, 52.2046, 182.4318), pista2Spline_desierto_angulos[210] = new pc.Vec3(272.1521, 55.48694, 182.4407), pista2Spline_desierto_angulos[211] = new pc.Vec3(272.4994, 59.11973, 182.134), pista2Spline_desierto_angulos[212] = new pc.Vec3(272.9772, 62.81862, 181.8171), pista2Spline_desierto_angulos[213] = new pc.Vec3(273.4269, 66.73873, 181.6004), pista2Spline_desierto_angulos[214] = new pc.Vec3(273.4004, 69.53893, 181.6268), pista2Spline_desierto_angulos[215] = new pc.Vec3(273.2163, 72.21539, 181.7328), pista2Spline_desierto_angulos[216] = new pc.Vec3(273.0423, 72.71511, 181.8347), pista2Spline_desierto_angulos[217] = new pc.Vec3(272.5907, 73.95958, 182.1625), pista2Spline_desierto_angulos[218] = new pc.Vec3(272.0012, 75.19694, 182.8101), pista2Spline_desierto_angulos[219] = new pc.Vec3(271.3557, 75.79366, 184.1644), pista2Spline_desierto_angulos[220] = new pc.Vec3(270.6023, 72.5291, 189.4297), pista2Spline_desierto_angulos[221] = new pc.Vec3(270.3013, 282.965, 340.862), pista2Spline_desierto_angulos[222] = new pc.Vec3(271.0157, 270.9311, 354.4041), pista2Spline_desierto_angulos[223] = new pc.Vec3(271.7953, 269.8087, 356.8353), pista2Spline_desierto_angulos[224] = new pc.Vec3(272.4363, 269.2179, 357.6675), pista2Spline_desierto_angulos[225] = new pc.Vec3(273.032, 267.9719, 358.1275), pista2Spline_desierto_angulos[226] = new pc.Vec3(273.4196, 266.6592, 358.3408), pista2Spline_desierto_angulos[227] = new pc.Vec3(273.6568, 265.3729, 358.4502), pista2Spline_desierto_angulos[228] = new pc.Vec3(273.7487, 264.0027, 358.4901), pista2Spline_desierto_angulos[229] = new pc.Vec3(273.5125, 262.3832, 358.3925), pista2Spline_desierto_angulos[230] = new pc.Vec3(273.2242, 260.6227, 358.2532), pista2Spline_desierto_angulos[231] = new pc.Vec3(272.7517, 258.6424, 357.9621), pista2Spline_desierto_angulos[232] = new pc.Vec3(272.2191, 256.1763, 357.4896), pista2Spline_desierto_angulos[233] = new pc.Vec3(271.6792, 253.4331, 356.7135), pista2Spline_desierto_angulos[234] = new pc.Vec3(271.1522, 250.4524, 355.281), pista2Spline_desierto_angulos[235] = new pc.Vec3(270.76, 247.0913, 353.0009), pista2Spline_desierto_angulos[236] = new pc.Vec3(270.7352, 238.0682, 353.1045), pista2Spline_desierto_angulos[237] = new pc.Vec3(270.8568, 229.7228, 354.3682), pista2Spline_desierto_angulos[238] = new pc.Vec3(271.357, 217.7385, 356.7197), pista2Spline_desierto_angulos[239] = new pc.Vec3(272.1413, 207.8541, 358.0916), pista2Spline_desierto_angulos[240] = new pc.Vec3(272.9744, 199.2915, 358.7488), pista2Spline_desierto_angulos[241] = new pc.Vec3(273.9007, 192.3676, 359.127), pista2Spline_desierto_angulos[242] = new pc.Vec3(275.2857, 187.6929, 359.3974), pista2Spline_desierto_angulos[243] = new pc.Vec3(274.0335, 184.7665, 359.247), pista2Spline_desierto_angulos[244] = new pc.Vec3(271.2208, 184.095, 357.6033), pista2Spline_desierto_angulos[245] = new pc.Vec3(270.4502, 354.1911, 186.3811), pista2Spline_desierto_angulos[246] = new pc.Vec3(270.5238, 354.7278, 185.4446), pista2Spline_desierto_angulos[247] = new pc.Vec3(270.2921, 350.2309, 189.746), pista2Spline_desierto_angulos[248] = new pc.Vec3(270.0593, 180.0554, 0), pista2Spline_desierto_angulos[249] = new pc.Vec3(270.0443, 180.0525, 0), pista2Spline_desierto_angulos[250] = new pc.Vec3(270.0443, 180.0495, 0), pista2Spline_desierto_angulos[251] = new pc.Vec3(270.0523, 180.0467, 0), pista2Spline_desierto_angulos[252] = new pc.Vec3(270.0443, 180.0496, 0), pista2Spline_desierto_angulos[253] = new pc.Vec3(270.0443, 180.0496, 0), pista2Spline_desierto_angulos[254] = new pc.Vec3(270, 270.0125, 0);
var conexionPista1 = [],
    vientoPista1 = [];
vientoPista1[0] = 25, vientoPista1[1] = 124;
var pista1Spline_desierto = [];
pista1Spline_desierto[0] = new pc.Vec3(0, 0, 0), pista1Spline_desierto[1] = new pc.Vec3(0, .003078461, -.5999985), pista1Spline_desierto[2] = new pc.Vec3(0, .003079414, -1.200005), pista1Spline_desierto[3] = new pc.Vec3(0, .003080845, -1.800011), pista1Spline_desierto[4] = new pc.Vec3(0, .003081799, -2.400017), pista1Spline_desierto[5] = new pc.Vec3(-.004879713, .003092289, -2.999962), pista1Spline_desierto[6] = new pc.Vec3(.003542185, .004024506, -3.599815), pista1Spline_desierto[7] = new pc.Vec3(.04107761, .01330662, -4.198509), pista1Spline_desierto[8] = new pc.Vec3(.09320068, .02241325, -4.796165), pista1Spline_desierto[9] = new pc.Vec3(.1503439, .03182697, -5.393364), pista1Spline_desierto[10] = new pc.Vec3(.2253556, .04033804, -5.988579), pista1Spline_desierto[11] = new pc.Vec3(.3277259, .04763031, -6.579644), pista1Spline_desierto[12] = new pc.Vec3(.4747586, .052876, -7.160974), pista1Spline_desierto[13] = new pc.Vec3(.7051959, .0536046, -7.714379), pista1Spline_desierto[14] = new pc.Vec3(1.017177, .05171919, -8.226007), pista1Spline_desierto[15] = new pc.Vec3(1.349665, .05286932, -8.725458), pista1Spline_desierto[16] = new pc.Vec3(1.705056, .05526686, -9.208819), pista1Spline_desierto[17] = new pc.Vec3(2.089424, .05794048, -9.669331), pista1Spline_desierto[18] = new pc.Vec3(2.50428, .06041384, -10.10265), pista1Spline_desierto[19] = new pc.Vec3(2.952643, .06202936, -10.50069), pista1Spline_desierto[20] = new pc.Vec3(3.428869, .06342936, -10.86541), pista1Spline_desierto[21] = new pc.Vec3(3.945044, .06289816, -11.17089), pista1Spline_desierto[22] = new pc.Vec3(4.476384, .06235313, -11.44939), pista1Spline_desierto[23] = new pc.Vec3(5.028844, .06199646, -11.68313), pista1Spline_desierto[24] = new pc.Vec3(5.591496, .06293774, -11.89153), pista1Spline_desierto[25] = new pc.Vec3(6.156895, .06529236, -12.09228), pista1Spline_desierto[26] = new pc.Vec3(6.726627, .06909037, -12.2803), pista1Spline_desierto[27] = new pc.Vec3(7.297031, .07406473, -12.4664), pista1Spline_desierto[28] = new pc.Vec3(7.865878, .08008385, -12.65707), pista1Spline_desierto[29] = new pc.Vec3(8.430453, .08698797, -12.85998), pista1Spline_desierto[30] = new pc.Vec3(8.986362, .09450579, -13.08554), pista1Spline_desierto[31] = new pc.Vec3(9.528505, .1024003, -13.34213), pista1Spline_desierto[32] = new pc.Vec3(10.05347, .1104627, -13.63248), pista1Spline_desierto[33] = new pc.Vec3(10.56305, .1184058, -13.94895), pista1Spline_desierto[34] = new pc.Vec3(11.06054, .126677, -14.28426), pista1Spline_desierto[35] = new pc.Vec3(11.54598, .135448, -14.63671), pista1Spline_desierto[36] = new pc.Vec3(12.01934, .1448884, -15.00524), pista1Spline_desierto[37] = new pc.Vec3(12.48061, .1552796, -15.38874), pista1Spline_desierto[38] = new pc.Vec3(12.92953, .1668305, -15.78663), pista1Spline_desierto[39] = new pc.Vec3(13.3659, .17979, -16.19817), pista1Spline_desierto[40] = new pc.Vec3(13.78972, .1944299, -16.6226), pista1Spline_desierto[41] = new pc.Vec3(14.19988, .2113576, -17.06014), pista1Spline_desierto[42] = new pc.Vec3(14.59594, .2311082, -17.51041), pista1Spline_desierto[43] = new pc.Vec3(14.97423, .2547936, -17.97547), pista1Spline_desierto[44] = new pc.Vec3(15.33342, .2814202, -18.45527), pista1Spline_desierto[45] = new pc.Vec3(15.67272, .3100286, -18.94926), pista1Spline_desierto[46] = new pc.Vec3(15.99269, .3392711, -19.45593), pista1Spline_desierto[47] = new pc.Vec3(16.29543, .3676763, -19.97316), pista1Spline_desierto[48] = new pc.Vec3(16.58342, .3944116, -20.49882), pista1Spline_desierto[49] = new pc.Vec3(16.85899, .418736, -21.03123), pista1Spline_desierto[50] = new pc.Vec3(17.12687, .4401689, -21.56767), pista1Spline_desierto[51] = new pc.Vec3(17.38972, .4594102, -22.10669), pista1Spline_desierto[52] = new pc.Vec3(17.65223, .4778581, -22.64589), pista1Spline_desierto[53] = new pc.Vec3(17.91569, .4957795, -23.18464), pista1Spline_desierto[54] = new pc.Vec3(18.17317, .5130525, -23.72632), pista1Spline_desierto[55] = new pc.Vec3(18.41924, .529572, -24.27329), pista1Spline_desierto[56] = new pc.Vec3(18.65538, .5453401, -24.82462), pista1Spline_desierto[57] = new pc.Vec3(18.87938, .5602803, -25.38102), pista1Spline_desierto[58] = new pc.Vec3(19.08842, .5742822, -25.94324), pista1Spline_desierto[59] = new pc.Vec3(19.27768, .5871243, -26.51241), pista1Spline_desierto[60] = new pc.Vec3(19.44001, .5985246, -27.08982), pista1Spline_desierto[61] = new pc.Vec3(19.56228, .6079583, -27.67709), pista1Spline_desierto[62] = new pc.Vec3(19.64535, .6144586, -28.27102), pista1Spline_desierto[63] = new pc.Vec3(19.6807, .6188989, -28.86961), pista1Spline_desierto[64] = new pc.Vec3(19.67641, .6197801, -29.46951), pista1Spline_desierto[65] = new pc.Vec3(19.62756, .6177182, -30.06738), pista1Spline_desierto[66] = new pc.Vec3(19.54104, .6134057, -30.661), pista1Spline_desierto[67] = new pc.Vec3(19.41927, .607224, -31.24841), pista1Spline_desierto[68] = new pc.Vec3(19.26706, .5998406, -31.82865), pista1Spline_desierto[69] = new pc.Vec3(19.08821, .5918527, -32.40127), pista1Spline_desierto[70] = new pc.Vec3(18.88556, .5837235, -32.96592), pista1Spline_desierto[71] = new pc.Vec3(18.66348, .5760636, -33.52323), pista1Spline_desierto[72] = new pc.Vec3(18.40973, .5698743, -34.06659), pista1Spline_desierto[73] = new pc.Vec3(18.11855, .5640702, -34.59087), pista1Spline_desierto[74] = new pc.Vec3(17.77673, .5588822, -35.08381), pista1Spline_desierto[75] = new pc.Vec3(17.40343, .5534902, -35.55346), pista1Spline_desierto[76] = new pc.Vec3(17.01728, .5474133, -36.01263), pista1Spline_desierto[77] = new pc.Vec3(16.62178, .5401978, -36.46376), pista1Spline_desierto[78] = new pc.Vec3(16.23043, .5311818, -36.91846), pista1Spline_desierto[79] = new pc.Vec3(15.85319, .5199122, -37.38485), pista1Spline_desierto[80] = new pc.Vec3(15.49775, .5059724, -37.86791), pista1Spline_desierto[81] = new pc.Vec3(15.17738, .4882483, -38.37477), pista1Spline_desierto[82] = new pc.Vec3(14.88428, .4664741, -38.89781), pista1Spline_desierto[83] = new pc.Vec3(14.61298, .4410462, -39.43231), pista1Spline_desierto[84] = new pc.Vec3(14.35436, .4134231, -39.97298), pista1Spline_desierto[85] = new pc.Vec3(14.10226, .3844151, -40.51665), pista1Spline_desierto[86] = new pc.Vec3(13.85262, .3545499, -41.06145), pista1Spline_desierto[87] = new pc.Vec3(13.59835, .3247437, -41.60408), pista1Spline_desierto[88] = new pc.Vec3(13.33269, .295856, -42.14128), pista1Spline_desierto[89] = new pc.Vec3(13.0483, .2688212, -42.66881), pista1Spline_desierto[90] = new pc.Vec3(12.73112, .2452531, -43.17744), pista1Spline_desierto[91] = new pc.Vec3(12.38002, .2270017, -43.66356), pista1Spline_desierto[92] = new pc.Vec3(12.00508, .2125497, -44.13169), pista1Spline_desierto[93] = new pc.Vec3(11.60381, .2024121, -44.5775), pista1Spline_desierto[94] = new pc.Vec3(11.17097, .1954045, -44.99272), pista1Spline_desierto[95] = new pc.Vec3(10.70575, .1905026, -45.37132), pista1Spline_desierto[96] = new pc.Vec3(10.21035, .1863027, -45.70948), pista1Spline_desierto[97] = new pc.Vec3(9.689632, .1807675, -46.00715), pista1Spline_desierto[98] = new pc.Vec3(9.137142, .175673, -46.23946), pista1Spline_desierto[99] = new pc.Vec3(8.562374, .1715951, -46.41135), pista1Spline_desierto[100] = new pc.Vec3(7.977596, .1687274, -46.54447), pista1Spline_desierto[101] = new pc.Vec3(7.386959, .16611, -46.65009), pista1Spline_desierto[102] = new pc.Vec3(6.798153, .1633992, -46.76532), pista1Spline_desierto[103] = new pc.Vec3(6.213497, .1601, -46.89984), pista1Spline_desierto[104] = new pc.Vec3(5.635921, .1557937, -47.06195), pista1Spline_desierto[105] = new pc.Vec3(5.061153, .1506658, -47.23376), pista1Spline_desierto[106] = new pc.Vec3(4.479397, .1452451, -47.38046), pista1Spline_desierto[107] = new pc.Vec3(3.901608, .139411, -47.54207), pista1Spline_desierto[108] = new pc.Vec3(3.330715, .1332817, -47.72601), pista1Spline_desierto[109] = new pc.Vec3(2.783749, .1266699, -47.97177), pista1Spline_desierto[110] = new pc.Vec3(2.269829, .1199021, -48.28057), pista1Spline_desierto[111] = new pc.Vec3(1.800171, .1129971, -48.65323), pista1Spline_desierto[112] = new pc.Vec3(1.362373, .1060967, -49.06331), pista1Spline_desierto[113] = new pc.Vec3(.9497757, .09916639, -49.49881), pista1Spline_desierto[114] = new pc.Vec3(.5594864, .09222984, -49.95436), pista1Spline_desierto[115] = new pc.Vec3(.1893387, .08529854, -50.42647), pista1Spline_desierto[116] = new pc.Vec3(-.1624107, .07838154, -50.91249), pista1Spline_desierto[117] = new pc.Vec3(-.4974632, .071486, -51.41014), pista1Spline_desierto[118] = new pc.Vec3(-.8168907, .06462002, -51.91795), pista1Spline_desierto[119] = new pc.Vec3(-1.123165, .05777693, -52.43387), pista1Spline_desierto[120] = new pc.Vec3(-1.416351, .05090427, -52.95726), pista1Spline_desierto[121] = new pc.Vec3(-1.687439, .04452944, -53.49236), pista1Spline_desierto[122] = new pc.Vec3(-1.931641, .0401001, -54.04039), pista1Spline_desierto[123] = new pc.Vec3(-2.177765, .03494167, -54.58751), pista1Spline_desierto[124] = new pc.Vec3(-2.465485, .0298481, -55.11354), pista1Spline_desierto[125] = new pc.Vec3(-2.789433, .02518988, -55.61851), pista1Spline_desierto[126] = new pc.Vec3(-3.123631, .02051973, -56.11682), pista1Spline_desierto[127] = new pc.Vec3(-3.438236, .01623535, -56.62754), pista1Spline_desierto[128] = new pc.Vec3(-3.713078, .01363564, -57.16044), pista1Spline_desierto[129] = new pc.Vec3(-3.937534, .01678276, -57.71684), pista1Spline_desierto[130] = new pc.Vec3(-4.146797, .02023602, -58.27909), pista1Spline_desierto[131] = new pc.Vec3(-4.346992, .02362728, -58.84467), pista1Spline_desierto[132] = new pc.Vec3(-4.561653, .02761269, -59.40495), pista1Spline_desierto[133] = new pc.Vec3(-4.764091, .03152657, -59.96964), pista1Spline_desierto[134] = new pc.Vec3(-4.914516, .0352807, -60.55006), pista1Spline_desierto[135] = new pc.Vec3(-5.000759, .03811979, -61.14368), pista1Spline_desierto[136] = new pc.Vec3(-4.989864, .04005146, -61.74268), pista1Spline_desierto[137] = new pc.Vec3(-4.917812, .04060936, -62.33808), pista1Spline_desierto[138] = new pc.Vec3(-4.788437, .03954363, -62.92388), pista1Spline_desierto[139] = new pc.Vec3(-4.641205, .03622055, -63.5055), pista1Spline_desierto[140] = new pc.Vec3(-4.464447, .03183174, -64.07877), pista1Spline_desierto[141] = new pc.Vec3(-4.252533, .02715731, -64.6399), pista1Spline_desierto[142] = new pc.Vec3(-3.995361, .02289629, -65.18183), pista1Spline_desierto[143] = new pc.Vec3(-3.691711, .0200491, -65.69865), pista1Spline_desierto[144] = new pc.Vec3(-3.331146, .01794243, -66.17738), pista1Spline_desierto[145] = new pc.Vec3(-2.90844, .01903868, -66.60309), pista1Spline_desierto[146] = new pc.Vec3(-2.440544, .02090836, -66.9772), pista1Spline_desierto[147] = new pc.Vec3(-1.937965, .02314043, -67.30482), pista1Spline_desierto[148] = new pc.Vec3(-1.416969, .02374697, -67.60228), pista1Spline_desierto[149] = new pc.Vec3(-.8829117, .02425432, -67.87566), pista1Spline_desierto[150] = new pc.Vec3(-.3377457, .02525043, -68.12607), pista1Spline_desierto[151] = new pc.Vec3(.217247, .02711391, -68.35402), pista1Spline_desierto[152] = new pc.Vec3(.7810287, .03032541, -68.55907), pista1Spline_desierto[153] = new pc.Vec3(1.353233, .03542519, -68.73943), pista1Spline_desierto[154] = new pc.Vec3(1.933075, .04275846, -68.89323), pista1Spline_desierto[155] = new pc.Vec3(2.520042, .05298281, -69.01682), pista1Spline_desierto[156] = new pc.Vec3(3.113182, .06687021, -69.1055), pista1Spline_desierto[157] = new pc.Vec3(3.710838, .08515549, -69.15353), pista1Spline_desierto[158] = new pc.Vec3(4.310143, .1092558, -69.15115), pista1Spline_desierto[159] = new pc.Vec3(4.904564, .1391635, -69.07916), pista1Spline_desierto[160] = new pc.Vec3(5.486366, .1741385, -68.93771), pista1Spline_desierto[161] = new pc.Vec3(6.052895, .2126522, -68.74429), pista1Spline_desierto[162] = new pc.Vec3(6.606407, .2533612, -68.51664), pista1Spline_desierto[163] = new pc.Vec3(7.149361, .2956624, -68.26479), pista1Spline_desierto[164] = new pc.Vec3(7.684227, .3391161, -67.9965), pista1Spline_desierto[165] = new pc.Vec3(8.215385, .3832774, -67.72095), pista1Spline_desierto[166] = new pc.Vec3(8.745399, .4279141, -67.44328), pista1Spline_desierto[167] = new pc.Vec3(9.277016, .4728017, -67.16874), pista1Spline_desierto[168] = new pc.Vec3(9.814613, .5175576, -66.90611), pista1Spline_desierto[169] = new pc.Vec3(10.361, .5618711, -66.6623), pista1Spline_desierto[170] = new pc.Vec3(10.91907, .6052814, -66.44662), pista1Spline_desierto[171] = new pc.Vec3(11.49358, .6468759, -66.27937), pista1Spline_desierto[172] = new pc.Vec3(12.08008, .6866555, -66.16), pista1Spline_desierto[173] = new pc.Vec3(12.67296, .7250896, -66.07658), pista1Spline_desierto[174] = new pc.Vec3(13.26891, .7629476, -66.01875), pista1Spline_desierto[175] = new pc.Vec3(13.86685, .8000283, -65.98621), pista1Spline_desierto[176] = new pc.Vec3(14.46567, .836247, -65.97763), pista1Spline_desierto[177] = new pc.Vec3(15.06444, .8715653, -65.99044), pista1Spline_desierto[178] = new pc.Vec3(15.66255, .90593, -66.02318), pista1Spline_desierto[179] = new pc.Vec3(16.2594, .9393001, -66.07434), pista1Spline_desierto[180] = new pc.Vec3(16.85475, .9716439, -66.14144), pista1Spline_desierto[181] = new pc.Vec3(17.44843, 1.002923, -66.22238), pista1Spline_desierto[182] = new pc.Vec3(18.04027, 1.033091, -66.31631), pista1Spline_desierto[183] = new pc.Vec3(18.63029, 1.062209, -66.42101), pista1Spline_desierto[184] = new pc.Vec3(19.21622, 1.090582, -66.54699), pista1Spline_desierto[185] = new pc.Vec3(19.79696, 1.117949, -66.69498), pista1Spline_desierto[186] = new pc.Vec3(20.37086, 1.143816, -66.86803), pista1Spline_desierto[187] = new pc.Vec3(20.93642, 1.167464, -67.06672), pista1Spline_desierto[188] = new pc.Vec3(21.49241, 1.188395, -67.2912), pista1Spline_desierto[189] = new pc.Vec3(22.03739, 1.20608, -67.54144), pista1Spline_desierto[190] = new pc.Vec3(22.5705, 1.219964, -67.81631), pista1Spline_desierto[191] = new pc.Vec3(23.09132, 1.229737, -68.11395), pista1Spline_desierto[192] = new pc.Vec3(23.59916, 1.235262, -68.43338), pista1Spline_desierto[193] = new pc.Vec3(24.09281, 1.236914, -68.77429), pista1Spline_desierto[194] = new pc.Vec3(24.57233, 1.235238, -69.13489), pista1Spline_desierto[195] = new pc.Vec3(25.03744, 1.230486, -69.51381), pista1Spline_desierto[196] = new pc.Vec3(25.48789, 1.222781, -69.91006), pista1Spline_desierto[197] = new pc.Vec3(25.92265, 1.212193, -70.32337), pista1Spline_desierto[198] = new pc.Vec3(26.34037, 1.198679, -70.75382), pista1Spline_desierto[199] = new pc.Vec3(26.73927, 1.182187, -71.20164), pista1Spline_desierto[200] = new pc.Vec3(27.11665, 1.16264, -71.66758), pista1Spline_desierto[201] = new pc.Vec3(27.46763, 1.139044, -72.15353), pista1Spline_desierto[202] = new pc.Vec3(27.78834, 1.110386, -72.65969), pista1Spline_desierto[203] = new pc.Vec3(28.07893, 1.076487, -73.18345), pista1Spline_desierto[204] = new pc.Vec3(28.34108, 1.0385, -73.72175), pista1Spline_desierto[205] = new pc.Vec3(28.57682, .9975801, -74.2719), pista1Spline_desierto[206] = new pc.Vec3(28.78849, .9552217, -74.83167), pista1Spline_desierto[207] = new pc.Vec3(28.97676, .9123902, -75.39973), pista1Spline_desierto[208] = new pc.Vec3(29.14247, .8701291, -75.9748), pista1Spline_desierto[209] = new pc.Vec3(29.28644, .8299851, -76.55585), pista1Spline_desierto[210] = new pc.Vec3(29.40934, .7923474, -77.14188), pista1Spline_desierto[211] = new pc.Vec3(29.51011, .7568974, -77.73225), pista1Spline_desierto[212] = new pc.Vec3(29.57724, .7218423, -78.32734), pista1Spline_desierto[213] = new pc.Vec3(29.60061, .688292, -78.9258), pista1Spline_desierto[214] = new pc.Vec3(29.58443, .6564202, -79.52467), pista1Spline_desierto[215] = new pc.Vec3(29.54002, .625958, -80.12222), pista1Spline_desierto[216] = new pc.Vec3(29.47791, .5964456, -80.71825), pista1Spline_desierto[217] = new pc.Vec3(29.40867, .5676484, -81.31355), pista1Spline_desierto[218] = new pc.Vec3(29.33467, .5395951, -81.9083), pista1Spline_desierto[219] = new pc.Vec3(29.27281, .5139871, -82.50454), pista1Spline_desierto[220] = new pc.Vec3(29.2256, .4907346, -83.10221), pista1Spline_desierto[221] = new pc.Vec3(29.19422, .4692655, -83.701), pista1Spline_desierto[222] = new pc.Vec3(29.18092, .4489617, -84.30048), pista1Spline_desierto[223] = new pc.Vec3(29.18727, .429503, -84.90012), pista1Spline_desierto[224] = new pc.Vec3(29.21577, .4105287, -85.49911), pista1Spline_desierto[225] = new pc.Vec3(29.27063, .39152, -86.09622), pista1Spline_desierto[226] = new pc.Vec3(29.35574, .3721108, -86.68977), pista1Spline_desierto[227] = new pc.Vec3(29.47778, .3517556, -87.27679), pista1Spline_desierto[228] = new pc.Vec3(29.65038, .3297429, -87.85052), pista1Spline_desierto[229] = new pc.Vec3(29.86358, .306149, -88.40954), pista1Spline_desierto[230] = new pc.Vec3(30.12334, .2807641, -88.94971), pista1Spline_desierto[231] = new pc.Vec3(30.40478, .2586484, -89.47914), pista1Spline_desierto[232] = new pc.Vec3(30.68603, .2394795, -90.0088), pista1Spline_desierto[233] = new pc.Vec3(30.96325, .2229905, -90.54066), pista1Spline_desierto[234] = new pc.Vec3(31.23309, .2084107, -91.07635), pista1Spline_desierto[235] = new pc.Vec3(31.49065, .1950707, -91.61806), pista1Spline_desierto[236] = new pc.Vec3(31.73222, .1825547, -92.16709), pista1Spline_desierto[237] = new pc.Vec3(31.95238, .1702638, -92.72505), pista1Spline_desierto[238] = new pc.Vec3(32.14293, .1573567, -93.29375), pista1Spline_desierto[239] = new pc.Vec3(32.2968, .1432519, -93.87341), pista1Spline_desierto[240] = new pc.Vec3(32.4011, .1268487, -94.46378), pista1Spline_desierto[241] = new pc.Vec3(32.43468, .1044831, -95.06217), pista1Spline_desierto[242] = new pc.Vec3(32.44157, .0798173, -95.66159), pista1Spline_desierto[243] = new pc.Vec3(32.43756, .05349588, -96.26099), pista1Spline_desierto[244] = new pc.Vec3(32.42725, .02519846, -96.86024), pista1Spline_desierto[245] = new pc.Vec3(32.41953, .008257389, -97.45992), pista1Spline_desierto[246] = new pc.Vec3(32.41465, .002073765, -98.05988), pista1Spline_desierto[247] = new pc.Vec3(32.4124, .002382755, -98.65989), pista1Spline_desierto[248] = new pc.Vec3(32.41037, .002836704, -99.25987), pista1Spline_desierto[249] = new pc.Vec3(32.40818, .00276804, -99.85986), pista1Spline_desierto[250] = new pc.Vec3(32.4061, .002745152, -100.4599), pista1Spline_desierto[251] = new pc.Vec3(32.40401, .002611637, -101.0599), pista1Spline_desierto[252] = new pc.Vec3(32.40231, .002554417, -101.6598), pista1Spline_desierto[253] = new pc.Vec3(32.40176, .003096104, -102.2598), pista1Spline_desierto[254] = new pc.Vec3(32.40176, .003096104, -102.3799);
var pista1Spline_desierto_angulos = [];
pista1Spline_desierto_angulos[0] = new pc.Vec3(0, 0, 0), pista1Spline_desierto_angulos[1] = new pc.Vec3(270, 270.0002, 0), pista1Spline_desierto_angulos[2] = new pc.Vec3(270, 270.0002, 0), pista1Spline_desierto_angulos[3] = new pc.Vec3(270, 269.9714, 0), pista1Spline_desierto_angulos[4] = new pc.Vec3(270, 270.052, 0), pista1Spline_desierto_angulos[5] = new pc.Vec3(270, 270.6815, 0), pista1Spline_desierto_angulos[6] = new pc.Vec3(270.7184, 357.7779, 270.0001), pista1Spline_desierto_angulos[7] = new pc.Vec3(270.828, 355.2952, 270.0002), pista1Spline_desierto_angulos[8] = new pc.Vec3(270.91, 355.0124, 270.0001), pista1Spline_desierto_angulos[9] = new pc.Vec3(270.8555, 353.6592, 269.9996), pista1Spline_desierto_angulos[10] = new pc.Vec3(270.7667, 351.8168, 269.9999), pista1Spline_desierto_angulos[11] = new pc.Vec3(270.6281, 348.5188, 269.9977), pista1Spline_desierto_angulos[12] = new pc.Vec3(270.3, 341.9119, 269.9954), pista1Spline_desierto_angulos[13] = new pc.Vec3(270.056, 243.5979, 0), pista1Spline_desierto_angulos[14] = new pc.Vec3(270.0816, 236.0908, 0), pista1Spline_desierto_angulos[15] = new pc.Vec3(270.1948, 325.2495, 269.9827), pista1Spline_desierto_angulos[16] = new pc.Vec3(270.2617, 322.3577, 269.9876), pista1Spline_desierto_angulos[17] = new pc.Vec3(270.2431, 317.9233, 269.9877), pista1Spline_desierto_angulos[18] = new pc.Vec3(270.2131, 314.8023, 269.9842), pista1Spline_desierto_angulos[19] = new pc.Vec3(270.1187, 308.8387, 269.9611), pista1Spline_desierto_angulos[20] = new pc.Vec3(270.0198, 214.1897, 0), pista1Spline_desierto_angulos[21] = new pc.Vec3(270.056, 208.9057, 0), pista1Spline_desierto_angulos[22] = new pc.Vec3(270, 205.4172, 0), pista1Spline_desierto_angulos[23] = new pc.Vec3(270.0485, 200.9386, 0), pista1Spline_desierto_angulos[24] = new pc.Vec3(270.1655, 290.058, 269.9716), pista1Spline_desierto_angulos[25] = new pc.Vec3(270.2934, 288.8832, 269.984), pista1Spline_desierto_angulos[26] = new pc.Vec3(270.4201, 288.0659, 269.9888), pista1Spline_desierto_angulos[27] = new pc.Vec3(270.5312, 288.0322, 269.9916), pista1Spline_desierto_angulos[28] = new pc.Vec3(270.6174, 289.1042, 269.9924), pista1Spline_desierto_angulos[29] = new pc.Vec3(270.6887, 290.9191, 269.9937), pista1Spline_desierto_angulos[30] = new pc.Vec3(270.7433, 293.3873, 269.9936), pista1Spline_desierto_angulos[31] = new pc.Vec3(270.7657, 297.3114, 269.9939), pista1Spline_desierto_angulos[32] = new pc.Vec3(270.7639, 300.4495, 269.9937), pista1Spline_desierto_angulos[33] = new pc.Vec3(270.7664, 303.0403, 269.9938), pista1Spline_desierto_angulos[34] = new pc.Vec3(270.8079, 305.0025, 269.9944), pista1Spline_desierto_angulos[35] = new pc.Vec3(270.8709, 306.939, 269.9948), pista1Spline_desierto_angulos[36] = new pc.Vec3(270.9423, 308.8399, 269.9948), pista1Spline_desierto_angulos[37] = new pc.Vec3(271.0393, 310.6722, 269.9954), pista1Spline_desierto_angulos[38] = new pc.Vec3(271.171, 312.4306, 269.9973), pista1Spline_desierto_angulos[39] = new pc.Vec3(271.3171, 314.1886, 269.9974), pista1Spline_desierto_angulos[40] = new pc.Vec3(271.4841, 315.9325, 269.9977), pista1Spline_desierto_angulos[41] = new pc.Vec3(271.7473, 317.7287, 269.9982), pista1Spline_desierto_angulos[42] = new pc.Vec3(272.0593, 319.7409, 269.9983), pista1Spline_desierto_angulos[43] = new pc.Vec3(272.4315, 322.006, 269.9986), pista1Spline_desierto_angulos[44] = new pc.Vec3(272.6699, 324.379, 269.9988), pista1Spline_desierto_angulos[45] = new pc.Vec3(272.7589, 326.6268, 269.9988), pista1Spline_desierto_angulos[46] = new pc.Vec3(272.773, 328.74, 269.9989), pista1Spline_desierto_angulos[47] = new pc.Vec3(272.6661, 330.5558, 269.9989), pista1Spline_desierto_angulos[48] = new pc.Vec3(272.4278, 331.9968, 269.9987), pista1Spline_desierto_angulos[49] = new pc.Vec3(272.2055, 333.0791, 269.9992), pista1Spline_desierto_angulos[50] = new pc.Vec3(271.8922, 333.9116, 269.9991), pista1Spline_desierto_angulos[51] = new pc.Vec3(271.8104, 333.9779, 269.9991), pista1Spline_desierto_angulos[52] = new pc.Vec3(271.7296, 334.0752, 269.9992), pista1Spline_desierto_angulos[53] = new pc.Vec3(271.6866, 333.9696, 269.999), pista1Spline_desierto_angulos[54] = new pc.Vec3(271.612, 335.252, 269.9991), pista1Spline_desierto_angulos[55] = new pc.Vec3(271.541, 336.326, 269.9989), pista1Spline_desierto_angulos[56] = new pc.Vec3(271.4701, 337.3349, 269.9989), pista1Spline_desierto_angulos[57] = new pc.Vec3(271.3828, 338.8279, 269.9989), pista1Spline_desierto_angulos[58] = new pc.Vec3(271.2836, 340.5809, 269.999), pista1Spline_desierto_angulos[59] = new pc.Vec3(271.168, 342.6473, 269.9987), pista1Spline_desierto_angulos[60] = new pc.Vec3(270.9947, 346.3994, 269.9986), pista1Spline_desierto_angulos[61] = new pc.Vec3(270.8137, 349.433, 269.998), pista1Spline_desierto_angulos[62] = new pc.Vec3(270.6065, 353.8939, 270), pista1Spline_desierto_angulos[63] = new pc.Vec3(270.1938, 358.9587, 269.9995), pista1Spline_desierto_angulos[64] = new pc.Vec3(270.0396, 272.4194, 0), pista1Spline_desierto_angulos[65] = new pc.Vec3(270.3202, 186.6031, 89.99847), pista1Spline_desierto_angulos[66] = new pc.Vec3(270.5117, 190.0737, 89.99828), pista1Spline_desierto_angulos[67] = new pc.Vec3(270.6435, 193.1736, 89.99818), pista1Spline_desierto_angulos[68] = new pc.Vec3(270.7496, 196.1281, 89.99818), pista1Spline_desierto_angulos[69] = new pc.Vec3(270.7836, 198.6436, 89.998), pista1Spline_desierto_angulos[70] = new pc.Vec3(270.7507, 200.7094, 89.99766), pista1Spline_desierto_angulos[71] = new pc.Vec3(270.6983, 202.7359, 89.99706), pista1Spline_desierto_angulos[72] = new pc.Vec3(270.5374, 207.2287, 89.99526), pista1Spline_desierto_angulos[73] = new pc.Vec3(270.5036, 212.3663, 89.99418), pista1Spline_desierto_angulos[74] = new pc.Vec3(270.5059, 216.9019, 89.99362), pista1Spline_desierto_angulos[75] = new pc.Vec3(270.5271, 219.3519, 89.99387), pista1Spline_desierto_angulos[76] = new pc.Vec3(270.6268, 220.9558, 89.9947), pista1Spline_desierto_angulos[77] = new pc.Vec3(270.7771, 220.92, 89.99585), pista1Spline_desierto_angulos[78] = new pc.Vec3(270.9541, 220.2647, 89.99672), pista1Spline_desierto_angulos[79] = new pc.Vec3(271.1855, 217.8265, 89.99736), pista1Spline_desierto_angulos[80] = new pc.Vec3(271.5139, 214.3819, 89.99806), pista1Spline_desierto_angulos[81] = new pc.Vec3(271.8731, 210.5727, 89.99859), pista1Spline_desierto_angulos[82] = new pc.Vec3(272.2888, 207.8658, 89.99897), pista1Spline_desierto_angulos[83] = new pc.Vec3(272.5279, 206.2944, 89.99903), pista1Spline_desierto_angulos[84] = new pc.Vec3(272.7278, 205.0263, 89.99924), pista1Spline_desierto_angulos[85] = new pc.Vec3(272.8276, 204.6199, 89.99928), pista1Spline_desierto_angulos[86] = new pc.Vec3(272.8443, 204.9094, 89.99924), pista1Spline_desierto_angulos[87] = new pc.Vec3(272.831, 205.4785, 89.99921), pista1Spline_desierto_angulos[88] = new pc.Vec3(272.6975, 207.0633, 89.99916), pista1Spline_desierto_angulos[89] = new pc.Vec3(272.4261, 210.0557, 89.99903), pista1Spline_desierto_angulos[90] = new pc.Vec3(272.0015, 214.0422, 89.99854), pista1Spline_desierto_angulos[91] = new pc.Vec3(271.5504, 217.2561, 89.99792), pista1Spline_desierto_angulos[92] = new pc.Vec3(271.1888, 220.2096, 89.99712), pista1Spline_desierto_angulos[93] = new pc.Vec3(270.8048, 223.9721, 89.99526), pista1Spline_desierto_angulos[94] = new pc.Vec3(270.5178, 228.4838, 89.99188), pista1Spline_desierto_angulos[95] = new pc.Vec3(270.4238, 233.274, 89.98963), pista1Spline_desierto_angulos[96] = new pc.Vec3(270.4498, 238.1167, 89.99023), pista1Spline_desierto_angulos[97] = new pc.Vec3(270.5504, 242.9454, 89.99146), pista1Spline_desierto_angulos[98] = new pc.Vec3(270.4266, 251.6169, 89.98878), pista1Spline_desierto_angulos[99] = new pc.Vec3(270.3298, 254.3943, 89.98577), pista1Spline_desierto_angulos[100] = new pc.Vec3(270.2669, 259.8905, 89.98203), pista1Spline_desierto_angulos[101] = new pc.Vec3(270.2357, 259.6857, 89.97902), pista1Spline_desierto_angulos[102] = new pc.Vec3(270.2907, 257.9048, 89.98215), pista1Spline_desierto_angulos[103] = new pc.Vec3(270.3511, 256.0482, 89.98637), pista1Spline_desierto_angulos[104] = new pc.Vec3(270.4677, 252.6682, 89.98997), pista1Spline_desierto_angulos[105] = new pc.Vec3(270.4993, 255.1487, 89.99021), pista1Spline_desierto_angulos[106] = new pc.Vec3(270.5363, 255.3403, 89.99052), pista1Spline_desierto_angulos[107] = new pc.Vec3(270.5733, 253.6411, 89.99114), pista1Spline_desierto_angulos[108] = new pc.Vec3(270.6065, 249.2019, 89.99243), pista1Spline_desierto_angulos[109] = new pc.Vec3(270.6429, 242.4826, 89.99346), pista1Spline_desierto_angulos[110] = new pc.Vec3(270.6561, 235.4385, 89.99344), pista1Spline_desierto_angulos[111] = new pc.Vec3(270.6582, 228.6162, 89.9942), pista1Spline_desierto_angulos[112] = new pc.Vec3(270.6609, 225.1569, 89.99482), pista1Spline_desierto_angulos[113] = new pc.Vec3(270.662, 221.9374, 89.99468), pista1Spline_desierto_angulos[114] = new pc.Vec3(270.6614, 219.3, 89.99527), pista1Spline_desierto_angulos[115] = new pc.Vec3(270.6606, 216.9629, 89.99497), pista1Spline_desierto_angulos[116] = new pc.Vec3(270.6591, 214.8845, 89.99555), pista1Spline_desierto_angulos[117] = new pc.Vec3(270.657, 213.0649, 89.99569), pista1Spline_desierto_angulos[118] = new pc.Vec3(270.6537, 211.2878, 89.99611), pista1Spline_desierto_angulos[119] = new pc.Vec3(270.6549, 210.2464, 89.99612), pista1Spline_desierto_angulos[120] = new pc.Vec3(270.6594, 208.361, 89.99644), pista1Spline_desierto_angulos[121] = new pc.Vec3(270.4558, 204.9988, 89.99464), pista1Spline_desierto_angulos[122] = new pc.Vec3(270.4379, 203.3674, 89.99554), pista1Spline_desierto_angulos[123] = new pc.Vec3(270.5143, 205.6843, 89.99564), pista1Spline_desierto_angulos[124] = new pc.Vec3(270.4507, 211.7409, 89.9935), pista1Spline_desierto_angulos[125] = new pc.Vec3(270.4432, 213.6421, 89.99383), pista1Spline_desierto_angulos[126] = new pc.Vec3(270.4593, 213.3799, 89.99342), pista1Spline_desierto_angulos[127] = new pc.Vec3(270.2324, 209.6409, 89.98911), pista1Spline_desierto_angulos[128] = new pc.Vec3(270.1454, 203.3304, 89.98738), pista1Spline_desierto_angulos[129] = new pc.Vec3(270.3669, 21.47181, 270.0048), pista1Spline_desierto_angulos[130] = new pc.Vec3(270.3096, 19.3189, 270.0057), pista1Spline_desierto_angulos[131] = new pc.Vec3(270.3561, 20.30775, 270.0052), pista1Spline_desierto_angulos[132] = new pc.Vec3(270.3892, 20.96239, 270.0048), pista1Spline_desierto_angulos[133] = new pc.Vec3(270.3483, 17.51346, 270.0048), pista1Spline_desierto_angulos[134] = new pc.Vec3(270.3153, 10.77175, 270.0031), pista1Spline_desierto_angulos[135] = new pc.Vec3(270.2974, 5.44285, 270.0013), pista1Spline_desierto_angulos[136] = new pc.Vec3(270.1219, 355.6884, 270.0004), pista1Spline_desierto_angulos[137] = new pc.Vec3(270, 259.8788, 0), pista1Spline_desierto_angulos[138] = new pc.Vec3(270.2037, 166.5202, 90.00789), pista1Spline_desierto_angulos[139] = new pc.Vec3(270.3912, 164.4725, 90.00413), pista1Spline_desierto_angulos[140] = new pc.Vec3(270.4528, 161.4504, 90.00366), pista1Spline_desierto_angulos[141] = new pc.Vec3(270.422, 156.7691, 90.00347), pista1Spline_desierto_angulos[142] = new pc.Vec3(270.3722, 152.8061, 90.00785), pista1Spline_desierto_angulos[143] = new pc.Vec3(270.1998, 145.9099, 90.01591), pista1Spline_desierto_angulos[144] = new pc.Vec3(270.0198, 227.7315, 0), pista1Spline_desierto_angulos[145] = new pc.Vec3(270.0485, 224.1032, 0), pista1Spline_desierto_angulos[146] = new pc.Vec3(270.2825, 304.9714, 269.9835), pista1Spline_desierto_angulos[147] = new pc.Vec3(270.0989, 211.4321, 0), pista1Spline_desierto_angulos[148] = new pc.Vec3(270.0485, 208.3835, 0), pista1Spline_desierto_angulos[149] = new pc.Vec3(270.0485, 205.9351, 0), pista1Spline_desierto_angulos[150] = new pc.Vec3(270.1154, 203.651, 0), pista1Spline_desierto_angulos[151] = new pc.Vec3(270.2487, 291.1359, 269.9815), pista1Spline_desierto_angulos[152] = new pc.Vec3(270.3831, 288.7982, 269.9872), pista1Spline_desierto_angulos[153] = new pc.Vec3(270.5791, 286.2535, 269.9924), pista1Spline_desierto_angulos[154] = new pc.Vec3(270.8437, 283.3573, 269.9943), pista1Spline_desierto_angulos[155] = new pc.Vec3(271.1281, 280.325, 269.9958), pista1Spline_desierto_angulos[156] = new pc.Vec3(271.5186, 276.6996, 269.9967), pista1Spline_desierto_angulos[157] = new pc.Vec3(272.0131, 272.2404, 269.9976), pista1Spline_desierto_angulos[158] = new pc.Vec3(272.5813, 266.8861, 269.9982), pista1Spline_desierto_angulos[159] = new pc.Vec3(273.136, 259.2855, 269.9985), pista1Spline_desierto_angulos[160] = new pc.Vec3(273.5239, 253.6065, 269.9987), pista1Spline_desierto_angulos[161] = new pc.Vec3(273.7948, 249.3015, 269.9988), pista1Spline_desierto_angulos[162] = new pc.Vec3(273.9824, 246.0598, 269.9988), pista1Spline_desierto_angulos[163] = new pc.Vec3(274.1017, 244.169, 269.9989), pista1Spline_desierto_angulos[164] = new pc.Vec3(274.1881, 242.9497, 269.9989), pista1Spline_desierto_angulos[165] = new pc.Vec3(274.2536, 242.2103, 269.9988), pista1Spline_desierto_angulos[166] = new pc.Vec3(274.2781, 242.5226, 269.9988), pista1Spline_desierto_angulos[167] = new pc.Vec3(274.2876, 243.2426, 269.9989), pista1Spline_desierto_angulos[168] = new pc.Vec3(274.2695, 244.6492, 269.9989), pista1Spline_desierto_angulos[169] = new pc.Vec3(274.195, 247.346, 269.999), pista1Spline_desierto_angulos[170] = new pc.Vec3(274.079, 251.0322, 269.9988), pista1Spline_desierto_angulos[171] = new pc.Vec3(273.8776, 256.3247, 269.9988), pista1Spline_desierto_angulos[172] = new pc.Vec3(273.7256, 260.4703, 269.9988), pista1Spline_desierto_angulos[173] = new pc.Vec3(273.6435, 263.2128, 269.9988), pista1Spline_desierto_angulos[174] = new pc.Vec3(273.5817, 265.7551, 269.9987), pista1Spline_desierto_angulos[175] = new pc.Vec3(273.5027, 268.0479, 269.9987), pista1Spline_desierto_angulos[176] = new pc.Vec3(273.4189, 270.1888, 269.9986), pista1Spline_desierto_angulos[177] = new pc.Vec3(273.3289, 272.2618, 269.9986), pista1Spline_desierto_angulos[178] = new pc.Vec3(273.2363, 274.044, 269.9986), pista1Spline_desierto_angulos[179] = new pc.Vec3(273.1409, 275.6389, 269.9986), pista1Spline_desierto_angulos[180] = new pc.Vec3(273.0386, 277.1821, 269.9984), pista1Spline_desierto_angulos[181] = new pc.Vec3(272.9353, 278.3826, 269.9984), pista1Spline_desierto_angulos[182] = new pc.Vec3(272.8291, 279.537, 269.9983), pista1Spline_desierto_angulos[183] = new pc.Vec3(272.74, 280.9771, 269.9982), pista1Spline_desierto_angulos[184] = new pc.Vec3(272.6779, 283.1522, 269.9982), pista1Spline_desierto_angulos[185] = new pc.Vec3(272.5441, 285.5319, 269.9982), pista1Spline_desierto_angulos[186] = new pc.Vec3(272.372, 288.0518, 269.998), pista1Spline_desierto_angulos[187] = new pc.Vec3(272.1458, 290.6741, 269.9979), pista1Spline_desierto_angulos[188] = new pc.Vec3(271.8483, 293.3252, 269.9977), pista1Spline_desierto_angulos[189] = new pc.Vec3(271.5074, 295.9784, 269.9971), pista1Spline_desierto_angulos[190] = new pc.Vec3(271.1418, 298.553, 269.996), pista1Spline_desierto_angulos[191] = new pc.Vec3(270.7206, 300.9506, 269.9933), pista1Spline_desierto_angulos[192] = new pc.Vec3(270.3415, 303.4229, 269.9851), pista1Spline_desierto_angulos[193] = new pc.Vec3(270, 215.797, 0), pista1Spline_desierto_angulos[194] = new pc.Vec3(270.3071, 128.0426, 90.01543), pista1Spline_desierto_angulos[195] = new pc.Vec3(270.5951, 130.2601, 90.00755), pista1Spline_desierto_angulos[196] = new pc.Vec3(270.874, 132.4315, 90.00364), pista1Spline_desierto_angulos[197] = new pc.Vec3(271.1491, 134.6668, 90.00258), pista1Spline_desierto_angulos[198] = new pc.Vec3(271.432, 137.0745, 90.0021), pista1Spline_desierto_angulos[199] = new pc.Vec3(271.7245, 139.6151, 90.00162), pista1Spline_desierto_angulos[200] = new pc.Vec3(272.0145, 142.4037, 90.00149), pista1Spline_desierto_angulos[201] = new pc.Vec3(272.5125, 145.991, 90.00114), pista1Spline_desierto_angulos[202] = new pc.Vec3(272.9753, 149.2888, 90.00103), pista1Spline_desierto_angulos[203] = new pc.Vec3(273.479, 152.6167, 90.00098), pista1Spline_desierto_angulos[204] = new pc.Vec3(273.7751, 155.4276, 90.00038), pista1Spline_desierto_angulos[205] = new pc.Vec3(273.9862, 158.0532, 90.00038), pista1Spline_desierto_angulos[206] = new pc.Vec3(274.1108, 160.5439, 90.00034), pista1Spline_desierto_angulos[207] = new pc.Vec3(274.0739, 162.7914, 90.00036), pista1Spline_desierto_angulos[208] = new pc.Vec3(273.9492, 164.9735, 90.00041), pista1Spline_desierto_angulos[209] = new pc.Vec3(273.7288, 167.1972, 90.00037), pista1Spline_desierto_angulos[210] = new pc.Vec3(273.4491, 169.0597, 90.00051), pista1Spline_desierto_angulos[211] = new pc.Vec3(273.3817, 171.806, 90.00005), pista1Spline_desierto_angulos[212] = new pc.Vec3(273.2849, 175.6, 90.00008), pista1Spline_desierto_angulos[213] = new pc.Vec3(273.127, 179.7696, 89.99992), pista1Spline_desierto_angulos[214] = new pc.Vec3(272.9706, 183.1366, 89.99997), pista1Spline_desierto_angulos[215] = new pc.Vec3(272.8595, 185.1931, 89.99987), pista1Spline_desierto_angulos[216] = new pc.Vec3(272.7801, 186.4266, 89.99979), pista1Spline_desierto_angulos[217] = new pc.Vec3(272.7343, 187.0499, 89.99979), pista1Spline_desierto_angulos[218] = new pc.Vec3(272.5876, 186.669, 89.99977), pista1Spline_desierto_angulos[219] = new pc.Vec3(272.3114, 185.2748, 89.99983), pista1Spline_desierto_angulos[220] = new pc.Vec3(272.1364, 183.749, 89.99987), pista1Spline_desierto_angulos[221] = new pc.Vec3(271.9896, 182.1514, 89.99995), pista1Spline_desierto_angulos[222] = new pc.Vec3(271.884, 180.4148, 89.99987), pista1Spline_desierto_angulos[223] = new pc.Vec3(271.838, 178.3446, 89.99995), pista1Spline_desierto_angulos[224] = new pc.Vec3(271.8082, 176.0644, 89.99995), pista1Spline_desierto_angulos[225] = new pc.Vec3(271.817, 173.442, 90), pista1Spline_desierto_angulos[226] = new pc.Vec3(271.9033, 170.001, 90.0009), pista1Spline_desierto_angulos[227] = new pc.Vec3(271.9868, 166.8526, 90.00079), pista1Spline_desierto_angulos[228] = new pc.Vec3(272.1188, 162.6355, 90.00083), pista1Spline_desierto_angulos[229] = new pc.Vec3(272.4498, 153.9303, 90.00068), pista1Spline_desierto_angulos[230] = new pc.Vec3(272.2228, 152.9452, 90.00143), pista1Spline_desierto_angulos[231] = new pc.Vec3(271.9978, 151.7813, 90.0015), pista1Spline_desierto_angulos[232] = new pc.Vec3(271.6768, 152.1389, 90.00181), pista1Spline_desierto_angulos[233] = new pc.Vec3(271.4878, 152.9036, 90.00102), pista1Spline_desierto_angulos[234] = new pc.Vec3(271.3217, 153.8238, 90.00122), pista1Spline_desierto_angulos[235] = new pc.Vec3(271.2153, 155.2505, 90.00124), pista1Spline_desierto_angulos[236] = new pc.Vec3(271.1884, 157.3652, 90.0014), pista1Spline_desierto_angulos[237] = new pc.Vec3(271.1913, 159.8413, 90.00136), pista1Spline_desierto_angulos[238] = new pc.Vec3(271.2686, 163.1163, 90.00131), pista1Spline_desierto_angulos[239] = new pc.Vec3(271.4155, 167.3376, 90.00114), pista1Spline_desierto_angulos[240] = new pc.Vec3(271.8438, 173.2464, 89.99992), pista1Spline_desierto_angulos[241] = new pc.Vec3(272.293, 178.6349, 90.00007), pista1Spline_desierto_angulos[242] = new pc.Vec3(272.4209, 180.0549, 89.99996), pista1Spline_desierto_angulos[243] = new pc.Vec3(272.7278, 180.7462, 89.99998), pista1Spline_desierto_angulos[244] = new pc.Vec3(272.3577, 180.9793, 89.99996), pista1Spline_desierto_angulos[245] = new pc.Vec3(270.9396, 180.5787, 89.99985), pista1Spline_desierto_angulos[246] = new pc.Vec3(270.3214, 180.3422, 90), pista1Spline_desierto_angulos[247] = new pc.Vec3(270.1583, .1592513, 269.9982), pista1Spline_desierto_angulos[248] = new pc.Vec3(270.028, 270.2021, 0), pista1Spline_desierto_angulos[249] = new pc.Vec3(270, 270.202, 0), pista1Spline_desierto_angulos[250] = new pc.Vec3(270, 270.1928, 0), pista1Spline_desierto_angulos[251] = new pc.Vec3(270, 270.175, 0), pista1Spline_desierto_angulos[252] = new pc.Vec3(270.0343, 270.1116, 0), pista1Spline_desierto_angulos[253] = new pc.Vec3(270.0485, 270.1031, 0), pista1Spline_desierto_angulos[254] = new pc.Vec3(270.0485, 270.1031, 0);
var conexionPista0 = [],
    vientoPista0 = [];
vientoPista0[0] = 25, vientoPista0[1] = 124;
var pista0Spline_desierto = [];
pista0Spline_desierto[0] = new pc.Vec3(0, 0, 0), pista0Spline_desierto[1] = new pc.Vec3(0, .003062904, -.6000061), pista0Spline_desierto[2] = new pc.Vec3(0, .002426505, -1.199982), pista0Spline_desierto[3] = new pc.Vec3(0, .003818393, -1.799957), pista0Spline_desierto[4] = new pc.Vec3(-.001107089, .01260042, -2.399931), pista0Spline_desierto[5] = new pc.Vec3(-.002429154, .02391291, -2.999784), pista0Spline_desierto[6] = new pc.Vec3(-.003844199, .03687406, -3.599635), pista0Spline_desierto[7] = new pc.Vec3(-.004404649, .04970145, -4.199549), pista0Spline_desierto[8] = new pc.Vec3(.001840155, .06274629, -4.799371), pista0Spline_desierto[9] = new pc.Vec3(.02465585, .07609344, -5.398709), pista0Spline_desierto[10] = new pc.Vec3(.0527202, .08990312, -5.997926), pista0Spline_desierto[11] = new pc.Vec3(.08282875, .1042907, -6.59699), pista0Spline_desierto[12] = new pc.Vec3(.1065584, .1194746, -7.196328), pista0Spline_desierto[13] = new pc.Vec3(.1209792, .1357267, -7.795969), pista0Spline_desierto[14] = new pc.Vec3(.1231612, .1534016, -8.395668), pista0Spline_desierto[15] = new pc.Vec3(.1114559, .1731207, -8.995213), pista0Spline_desierto[16] = new pc.Vec3(.08677801, .1959937, -9.594264), pista0Spline_desierto[17] = new pc.Vec3(.05071137, .225652, -10.19243), pista0Spline_desierto[18] = new pc.Vec3(.005540726, .2668984, -10.78931), pista0Spline_desierto[19] = new pc.Vec3(-.04149588, .3133385, -11.38564), pista0Spline_desierto[20] = new pc.Vec3(-.0853904, .3611758, -11.98206), pista0Spline_desierto[21] = new pc.Vec3(-.1198837, .4067023, -12.57937), pista0Spline_desierto[22] = new pc.Vec3(-.1414001, .4439662, -13.17778), pista0Spline_desierto[23] = new pc.Vec3(-.1472206, .4696362, -13.7772), pista0Spline_desierto[24] = new pc.Vec3(-.1364565, .4796689, -14.37699), pista0Spline_desierto[25] = new pc.Vec3(-.1102112, .479583, -14.97636), pista0Spline_desierto[26] = new pc.Vec3(-.07019573, .4718382, -15.57498), pista0Spline_desierto[27] = new pc.Vec3(-.01940347, .4596407, -16.1727), pista0Spline_desierto[28] = new pc.Vec3(.03557087, .4461901, -16.77003), pista0Spline_desierto[29] = new pc.Vec3(.09249883, .4322054, -17.36716), pista0Spline_desierto[30] = new pc.Vec3(.1432931, .4177859, -17.96483), pista0Spline_desierto[31] = new pc.Vec3(.1949726, .4029028, -18.5624), pista0Spline_desierto[32] = new pc.Vec3(.2607215, .3875964, -19.15864), pista0Spline_desierto[33] = new pc.Vec3(.3434085, .371958, -19.75259), pista0Spline_desierto[34] = new pc.Vec3(.4475501, .3560565, -20.34325), pista0Spline_desierto[35] = new pc.Vec3(.5791894, .3400481, -20.92833), pista0Spline_desierto[36] = new pc.Vec3(.7464443, .3242152, -21.50421), pista0Spline_desierto[37] = new pc.Vec3(.9587157, .3084414, -22.06495), pista0Spline_desierto[38] = new pc.Vec3(1.233123, .2971785, -22.59793), pista0Spline_desierto[39] = new pc.Vec3(1.542838, .2906382, -23.11185), pista0Spline_desierto[40] = new pc.Vec3(1.849806, .2861674, -23.62736), pista0Spline_desierto[41] = new pc.Vec3(2.156863, .2829382, -24.14277), pista0Spline_desierto[42] = new pc.Vec3(2.460533, .2798941, -24.66023), pista0Spline_desierto[43] = new pc.Vec3(2.760875, .2772887, -25.1797), pista0Spline_desierto[44] = new pc.Vec3(3.056242, .2751162, -25.70192), pista0Spline_desierto[45] = new pc.Vec3(3.345473, .2734358, -26.22764), pista0Spline_desierto[46] = new pc.Vec3(3.625945, .2722399, -26.75797), pista0Spline_desierto[47] = new pc.Vec3(3.894758, .2714808, -27.2944), pista0Spline_desierto[48] = new pc.Vec3(4.147577, .2711356, -27.83852), pista0Spline_desierto[49] = new pc.Vec3(4.378574, .2710669, -28.39219), pista0Spline_desierto[50] = new pc.Vec3(4.580212, .2710249, -28.95717), pista0Spline_desierto[51] = new pc.Vec3(4.743181, .2706339, -29.53451), pista0Spline_desierto[52] = new pc.Vec3(4.858755, .2693865, -30.12306), pista0Spline_desierto[53] = new pc.Vec3(4.920372, .2663901, -30.71964), pista0Spline_desierto[54] = new pc.Vec3(4.93066, .2628119, -31.31937), pista0Spline_desierto[55] = new pc.Vec3(4.95129, .2635577, -31.9188), pista0Spline_desierto[56] = new pc.Vec3(5.012594, .2702143, -32.51552), pista0Spline_desierto[57] = new pc.Vec3(5.118146, .2820666, -33.10587), pista0Spline_desierto[58] = new pc.Vec3(5.25937, .2985957, -33.68872), pista0Spline_desierto[59] = new pc.Vec3(5.431355, .319382, -34.2631), pista0Spline_desierto[60] = new pc.Vec3(5.627722, .343838, -34.82948), pista0Spline_desierto[61] = new pc.Vec3(5.841756, .3713343, -35.38933), pista0Spline_desierto[62] = new pc.Vec3(6.068575, .4014208, -35.944), pista0Spline_desierto[63] = new pc.Vec3(6.302903, .4336398, -36.49541), pista0Spline_desierto[64] = new pc.Vec3(6.537838, .4673769, -37.04642), pista0Spline_desierto[65] = new pc.Vec3(6.768408, .5022204, -37.59929), pista0Spline_desierto[66] = new pc.Vec3(6.989243, .5377276, -38.15602), pista0Spline_desierto[67] = new pc.Vec3(7.192252, .573231, -38.71947), pista0Spline_desierto[68] = new pc.Vec3(7.370603, .608124, -39.29123), pista0Spline_desierto[69] = new pc.Vec3(7.516605, .6417353, -39.87212), pista0Spline_desierto[70] = new pc.Vec3(7.621683, .6731913, -40.46183), pista0Spline_desierto[71] = new pc.Vec3(7.674301, .7007105, -41.05861), pista0Spline_desierto[72] = new pc.Vec3(7.695429, .7252924, -41.65776), pista0Spline_desierto[73] = new pc.Vec3(7.70719, .7481768, -42.25723), pista0Spline_desierto[74] = new pc.Vec3(7.718615, .7706835, -42.8567), pista0Spline_desierto[75] = new pc.Vec3(7.730558, .7927363, -43.45613), pista0Spline_desierto[76] = new pc.Vec3(7.743876, .8142512, -44.05563), pista0Spline_desierto[77] = new pc.Vec3(7.760003, .8337824, -44.65505), pista0Spline_desierto[78] = new pc.Vec3(7.779824, .8509448, -45.25457), pista0Spline_desierto[79] = new pc.Vec3(7.805171, .8662875, -45.85381), pista0Spline_desierto[80] = new pc.Vec3(7.837691, .8801692, -46.45273), pista0Spline_desierto[81] = new pc.Vec3(7.878757, .8928759, -47.05118), pista0Spline_desierto[82] = new pc.Vec3(7.93081, .9050906, -47.64888), pista0Spline_desierto[83] = new pc.Vec3(7.996077, .9171946, -48.24508), pista0Spline_desierto[84] = new pc.Vec3(8.077367, .9294817, -48.8394), pista0Spline_desierto[85] = new pc.Vec3(8.178126, .9422343, -49.43069), pista0Spline_desierto[86] = new pc.Vec3(8.301592, .9557612, -50.01769), pista0Spline_desierto[87] = new pc.Vec3(8.451913, .9701884, -50.59832), pista0Spline_desierto[88] = new pc.Vec3(8.632844, .9856226, -51.17007), pista0Spline_desierto[89] = new pc.Vec3(8.849299, 1.00195, -51.72929), pista0Spline_desierto[90] = new pc.Vec3(9.105371, 1.016827, -52.27163), pista0Spline_desierto[91] = new pc.Vec3(9.385615, 1.032067, -52.80184), pista0Spline_desierto[92] = new pc.Vec3(9.688108, 1.050305, -53.3196), pista0Spline_desierto[93] = new pc.Vec3(10.0177, 1.074639, -53.82034), pista0Spline_desierto[94] = new pc.Vec3(10.38061, 1.104321, -54.29703), pista0Spline_desierto[95] = new pc.Vec3(10.78198, 1.13731, -54.74153), pista0Spline_desierto[96] = new pc.Vec3(11.22398, 1.17099, -55.14543), pista0Spline_desierto[97] = new pc.Vec3(11.70593, 1.202011, -55.50108), pista0Spline_desierto[98] = new pc.Vec3(12.22267, 1.226815, -55.80447), pista0Spline_desierto[99] = new pc.Vec3(12.76725, 1.241307, -56.05519), pista0Spline_desierto[100] = new pc.Vec3(13.33209, 1.242848, -56.25711), pista0Spline_desierto[101] = new pc.Vec3(13.91041, 1.232132, -56.41629), pista0Spline_desierto[102] = new pc.Vec3(14.49719, 1.210205, -56.53879), pista0Spline_desierto[103] = new pc.Vec3(15.08948, 1.182194, -56.63054), pista0Spline_desierto[104] = new pc.Vec3(15.68502, 1.151585, -56.69648), pista0Spline_desierto[105] = new pc.Vec3(16.28278, 1.124954, -56.7404), pista0Spline_desierto[106] = new pc.Vec3(16.88173, 1.101727, -56.7654), pista0Spline_desierto[107] = new pc.Vec3(17.48145, 1.084946, -56.76612), pista0Spline_desierto[108] = new pc.Vec3(18.08068, 1.074887, -56.73781), pista0Spline_desierto[109] = new pc.Vec3(18.67786, 1.070702, -56.68068), pista0Spline_desierto[110] = new pc.Vec3(19.2716, 1.071182, -56.59493), pista0Spline_desierto[111] = new pc.Vec3(19.86064, 1.072151, -56.48109), pista0Spline_desierto[112] = new pc.Vec3(20.44377, 1.070534, -56.33998), pista0Spline_desierto[113] = new pc.Vec3(21.01992, 1.062657, -56.17265), pista0Spline_desierto[114] = new pc.Vec3(21.5876, 1.041672, -55.97989), pista0Spline_desierto[115] = new pc.Vec3(22.14566, 1.013596, -55.76132), pista0Spline_desierto[116] = new pc.Vec3(22.69276, .9842722, -55.51699), pista0Spline_desierto[117] = new pc.Vec3(23.22778, .9561846, -55.24693), pista0Spline_desierto[118] = new pc.Vec3(23.74887, .9287913, -54.95105), pista0Spline_desierto[119] = new pc.Vec3(24.2549, .9020197, -54.6299), pista0Spline_desierto[120] = new pc.Vec3(24.74404, .875973, -54.28338), pista0Spline_desierto[121] = new pc.Vec3(25.21484, .8517878, -53.91233), pista0Spline_desierto[122] = new pc.Vec3(25.66343, .8282855, -53.51475), pista0Spline_desierto[123] = new pc.Vec3(26.08462, .8040431, -53.08832), pista0Spline_desierto[124] = new pc.Vec3(26.47099, .7815897, -52.62997), pista0Spline_desierto[125] = new pc.Vec3(26.82618, .7595866, -52.14707), pista0Spline_desierto[126] = new pc.Vec3(27.15266, .737221, -51.64418), pista0Spline_desierto[127] = new pc.Vec3(27.45475, .7132189, -51.12636), pista0Spline_desierto[128] = new pc.Vec3(27.73659, .6880991, -50.5974), pista0Spline_desierto[129] = new pc.Vec3(28.00116, .6620219, -50.05952), pista0Spline_desierto[130] = new pc.Vec3(28.25251, .6352618, -49.51535), pista0Spline_desierto[131] = new pc.Vec3(28.49487, .6074221, -48.96719), pista0Spline_desierto[132] = new pc.Vec3(28.73121, .5781748, -48.41646), pista0Spline_desierto[133] = new pc.Vec3(28.96487, .5477374, -47.86466), pista0Spline_desierto[134] = new pc.Vec3(29.20162, .5089953, -47.31473), pista0Spline_desierto[135] = new pc.Vec3(29.445, .4639285, -46.76815), pista0Spline_desierto[136] = new pc.Vec3(29.69814, .4172289, -46.22625), pista0Spline_desierto[137] = new pc.Vec3(29.96727, .3681681, -45.69231), pista0Spline_desierto[138] = new pc.Vec3(30.25844, .31514, -45.17043), pista0Spline_desierto[139] = new pc.Vec3(30.56996, .2576678, -44.66092), pista0Spline_desierto[140] = new pc.Vec3(30.88588, .1964762, -44.15446), pista0Spline_desierto[141] = new pc.Vec3(31.20302, .1370623, -43.64861), pista0Spline_desierto[142] = new pc.Vec3(31.52248, .08012795, -43.14396), pista0Spline_desierto[143] = new pc.Vec3(31.84652, .02573037, -42.64186), pista0Spline_desierto[144] = new pc.Vec3(32.17753, -.02570701, -42.14407), pista0Spline_desierto[145] = new pc.Vec3(32.51736, -.07442451, -41.65202), pista0Spline_desierto[146] = new pc.Vec3(32.86754, -.1205671, -41.16705), pista0Spline_desierto[147] = new pc.Vec3(33.23071, -.164089, -40.69142), pista0Spline_desierto[148] = new pc.Vec3(33.60865, -.2037427, -40.22722), pista0Spline_desierto[149] = new pc.Vec3(34.00275, -.2393796, -39.77621), pista0Spline_desierto[150] = new pc.Vec3(34.41452, -.273483, -39.34121), pista0Spline_desierto[151] = new pc.Vec3(34.84557, -.3035009, -38.92495), pista0Spline_desierto[152] = new pc.Vec3(35.29646, -.3302457, -38.53019), pista0Spline_desierto[153] = new pc.Vec3(35.76719, -.3559301, -38.15925), pista0Spline_desierto[154] = new pc.Vec3(36.25706, -.3834188, -37.8139), pista0Spline_desierto[155] = new pc.Vec3(36.76924, -.4115789, -37.50296), pista0Spline_desierto[156] = new pc.Vec3(37.30859, -.4393308, -37.24233), pista0Spline_desierto[157] = new pc.Vec3(37.87495, -.4704397, -37.04757), pista0Spline_desierto[158] = new pc.Vec3(38.45727, -.5003278, -36.9067), pista0Spline_desierto[159] = new pc.Vec3(39.04869, -.5272977, -36.81033), pista0Spline_desierto[160] = new pc.Vec3(39.64528, -.5502431, -36.75125), pista0Spline_desierto[161] = new pc.Vec3(40.24426, -.5692594, -36.7225), pista0Spline_desierto[162] = new pc.Vec3(40.84401, -.5825231, -36.71988), pista0Spline_desierto[163] = new pc.Vec3(41.44362, -.5877302, -36.74002), pista0Spline_desierto[164] = new pc.Vec3(42.04236, -.5858037, -36.77921), pista0Spline_desierto[165] = new pc.Vec3(42.6396, -.5769613, -36.83548), pista0Spline_desierto[166] = new pc.Vec3(43.2351, -.561218, -36.90685), pista0Spline_desierto[167] = new pc.Vec3(43.82867, -.5391881, -36.99142), pista0Spline_desierto[168] = new pc.Vec3(44.42014, -.5112073, -37.08806), pista0Spline_desierto[169] = new pc.Vec3(45.00948, -.4777181, -37.1959), pista0Spline_desierto[170] = new pc.Vec3(45.59606, -.4394224, -37.31613), pista0Spline_desierto[171] = new pc.Vec3(46.18343, -.395828, -37.43008), pista0Spline_desierto[172] = new pc.Vec3(46.77385, -.3478086, -37.5251), pista0Spline_desierto[173] = new pc.Vec3(47.36831, -.2962492, -37.58732), pista0Spline_desierto[174] = new pc.Vec3(47.96571, -.2514799, -37.61942), pista0Spline_desierto[175] = new pc.Vec3(48.56464, -.2163808, -37.62161), pista0Spline_desierto[176] = new pc.Vec3(49.16322, -.1855161, -37.59637), pista0Spline_desierto[177] = new pc.Vec3(49.76058, -.1564176, -37.54833), pista0Spline_desierto[178] = new pc.Vec3(50.35598, -.1283376, -37.47991), pista0Spline_desierto[179] = new pc.Vec3(50.94872, -.100929, -37.39143), pista0Spline_desierto[180] = new pc.Vec3(51.53429, -.07518363, -37.26362), pista0Spline_desierto[181] = new pc.Vec3(52.11362, -.05241752, -37.10947), pista0Spline_desierto[182] = new pc.Vec3(52.68862, -.03311515, -36.93924), pista0Spline_desierto[183] = new pc.Vec3(53.26221, -.01752067, -36.76369), pista0Spline_desierto[184] = new pc.Vec3(53.83765, -.006061316, -36.59407), pista0Spline_desierto[185] = new pc.Vec3(54.41684, 0, -36.43803), pista0Spline_desierto[186] = new pc.Vec3(55.00186, .002674341, -36.30509), pista0Spline_desierto[187] = new pc.Vec3(55.59401, .002914667, -36.20914), pista0Spline_desierto[188] = new pc.Vec3(56.19185, .00263238, -36.16092), pista0Spline_desierto[189] = new pc.Vec3(56.7914, .002681971, -36.17239), pista0Spline_desierto[190] = new pc.Vec3(57.38498, .002723932, -36.25736), pista0Spline_desierto[191] = new pc.Vec3(57.96078, .002720118, -36.42398), pista0Spline_desierto[192] = new pc.Vec3(58.51033, .002666712, -36.6642), pista0Spline_desierto[193] = new pc.Vec3(59.03463, .00262475, -36.95523), pista0Spline_desierto[194] = new pc.Vec3(59.5359, .002620935, -37.28492), pista0Spline_desierto[195] = new pc.Vec3(60.00671, .002647638, -37.65639), pista0Spline_desierto[196] = new pc.Vec3(60.43098, .002659082, -38.08009), pista0Spline_desierto[197] = new pc.Vec3(60.80139, .002643824, -38.55166), pista0Spline_desierto[198] = new pc.Vec3(61.12658, .00263238, -39.05582), pista0Spline_desierto[199] = new pc.Vec3(61.42237, .00262475, -39.57779), pista0Spline_desierto[200] = new pc.Vec3(61.70311, .002620935, -40.10799), pista0Spline_desierto[201] = new pc.Vec3(61.97876, .00262475, -40.64095), pista0Spline_desierto[202] = new pc.Vec3(62.25282, .002628565, -41.17473), pista0Spline_desierto[203] = new pc.Vec3(62.52954, .00263238, -41.70704), pista0Spline_desierto[204] = new pc.Vec3(62.80904, .002636194, -42.23801), pista0Spline_desierto[205] = new pc.Vec3(63.09302, .002483606, -42.76652), pista0Spline_desierto[206] = new pc.Vec3(63.38076, .002418756, -43.29306), pista0Spline_desierto[207] = new pc.Vec3(63.6748, .003235102, -43.81601), pista0Spline_desierto[208] = new pc.Vec3(63.97816, .005405664, -44.33365), pista0Spline_desierto[209] = new pc.Vec3(64.28942, .009910822, -44.84659), pista0Spline_desierto[210] = new pc.Vec3(64.60554, .01703668, -45.35648), pista0Spline_desierto[211] = new pc.Vec3(64.92274, .02715707, -45.86567), pista0Spline_desierto[212] = new pc.Vec3(65.23193, .04048562, -46.37968), pista0Spline_desierto[213] = new pc.Vec3(65.52269, .05707192, -46.90427), pista0Spline_desierto[214] = new pc.Vec3(65.78296, .07654595, -47.44436), pista0Spline_desierto[215] = new pc.Vec3(66.00124, .09813333, -48.00266), pista0Spline_desierto[216] = new pc.Vec3(66.17097, .1207201, -48.57747), pista0Spline_desierto[217] = new pc.Vec3(66.29151, .1432307, -49.16473), pista0Spline_desierto[218] = new pc.Vec3(66.36803, .1645663, -49.75935), pista0Spline_desierto[219] = new pc.Vec3(66.40699, .1852648, -50.35762), pista0Spline_desierto[220] = new pc.Vec3(66.41161, .205498, -50.95717), pista0Spline_desierto[221] = new pc.Vec3(66.39074, .2303965, -51.55619), pista0Spline_desierto[222] = new pc.Vec3(66.34058, .2644045, -52.15304), pista0Spline_desierto[223] = new pc.Vec3(66.2934, .300072, -52.75016), pista0Spline_desierto[224] = new pc.Vec3(66.24516, .3329356, -53.34735), pista0Spline_desierto[225] = new pc.Vec3(66.19789, .3594973, -53.94484), pista0Spline_desierto[226] = new pc.Vec3(66.15564, .3769534, -54.5431), pista0Spline_desierto[227] = new pc.Vec3(66.11902, .3853076, -55.1419), pista0Spline_desierto[228] = new pc.Vec3(66.09264, .3826678, -55.74136), pista0Spline_desierto[229] = new pc.Vec3(66.07594, .3704112, -56.34099), pista0Spline_desierto[230] = new pc.Vec3(66.07116, .3502047, -56.94057), pista0Spline_desierto[231] = new pc.Vec3(66.07925, .322674, -57.53982), pista0Spline_desierto[232] = new pc.Vec3(66.09993, .2912219, -58.13865), pista0Spline_desierto[233] = new pc.Vec3(66.12852, .2581599, -58.73708), pista0Spline_desierto[234] = new pc.Vec3(66.1627, .2258952, -59.3352), pista0Spline_desierto[235] = new pc.Vec3(66.19958, .1973193, -59.93342), pista0Spline_desierto[236] = new pc.Vec3(66.23672, .1767199, -60.53194), pista0Spline_desierto[237] = new pc.Vec3(66.2721, .1632082, -61.13067), pista0Spline_desierto[238] = new pc.Vec3(66.30412, .1559069, -61.7298), pista0Spline_desierto[239] = new pc.Vec3(66.33131, .1523097, -62.32914), pista0Spline_desierto[240] = new pc.Vec3(66.35305, .1488345, -62.92878), pista0Spline_desierto[241] = new pc.Vec3(66.36919, .142132, -63.52852), pista0Spline_desierto[242] = new pc.Vec3(66.37958, .1258891, -64.12822), pista0Spline_desierto[243] = new pc.Vec3(66.3884, .105366, -64.72778), pista0Spline_desierto[244] = new pc.Vec3(66.39683, .0828135, -65.32734), pista0Spline_desierto[245] = new pc.Vec3(66.40589, .06058145, -65.92683), pista0Spline_desierto[246] = new pc.Vec3(66.41543, .03750253, -66.52625), pista0Spline_desierto[247] = new pc.Vec3(66.42491, .01759744, -67.12586), pista0Spline_desierto[248] = new pc.Vec3(66.43288, .004040003, -67.72561), pista0Spline_desierto[249] = new pc.Vec3(66.43291, .002605677, -68.32558), pista0Spline_desierto[250] = new pc.Vec3(66.43288, .002613306, -68.67153);
var pista0Spline_desierto_angulos = [];
pista0Spline_desierto_angulos[0] = new pc.Vec3(0, 0, 0), pista0Spline_desierto_angulos[1] = new pc.Vec3(270.0396, 180.0496, 0), pista0Spline_desierto_angulos[2] = new pc.Vec3(270.1413, 200.0399, 339.9484), pista0Spline_desierto_angulos[3] = new pc.Vec3(270.5592, 354.9707, 185.0932), pista0Spline_desierto_angulos[4] = new pc.Vec3(271.0138, 357.2942, 182.8104), pista0Spline_desierto_angulos[5] = new pc.Vec3(271.182, 357.763, 182.4117), pista0Spline_desierto_angulos[6] = new pc.Vec3(271.2399, 357.7291, 182.2937), pista0Spline_desierto_angulos[7] = new pc.Vec3(271.2323, 357.6761, 182.3058), pista0Spline_desierto_angulos[8] = new pc.Vec3(271.2616, 356.3546, 182.1963), pista0Spline_desierto_angulos[9] = new pc.Vec3(271.2941, 355.2981, 182.0959), pista0Spline_desierto_angulos[10] = new pc.Vec3(271.3436, 355.093, 182.0084), pista0Spline_desierto_angulos[11] = new pc.Vec3(271.4117, 355.5061, 181.9225), pista0Spline_desierto_angulos[12] = new pc.Vec3(271.4959, 356.2354, 181.8362), pista0Spline_desierto_angulos[13] = new pc.Vec3(271.6115, 357.4716, 181.7392), pista0Spline_desierto_angulos[14] = new pc.Vec3(271.7754, 358.8186, 181.6129), pista0Spline_desierto_angulos[15] = new pc.Vec3(272.0075, .23614, 181.4574), pista0Spline_desierto_angulos[16] = new pc.Vec3(272.4907, 1.746273, 181.1993), pista0Spline_desierto_angulos[17] = new pc.Vec3(273.3863, 3.03008, 180.896), pista0Spline_desierto_angulos[18] = new pc.Vec3(274.2801, 3.812853, 180.7154), pista0Spline_desierto_angulos[19] = new pc.Vec3(274.6328, 3.892688, 180.6611), pista0Spline_desierto_angulos[20] = new pc.Vec3(274.4245, 3.001608, 180.6823), pista0Spline_desierto_angulos[21] = new pc.Vec3(274.0831, 2.068002, 180.7291), pista0Spline_desierto_angulos[22] = new pc.Vec3(273.0775, .376058, 180.9442), pista0Spline_desierto_angulos[23] = new pc.Vec3(271.6924, 358.0874, 181.6723), pista0Spline_desierto_angulos[24] = new pc.Vec3(270.402, 351.3619, 186.8627), pista0Spline_desierto_angulos[25] = new pc.Vec3(270.4652, 182.51, 354.2365), pista0Spline_desierto_angulos[26] = new pc.Vec3(270.944, 178.4296, 357.2163), pista0Spline_desierto_angulos[27] = new pc.Vec3(271.2881, 176.8499, 357.9927), pista0Spline_desierto_angulos[28] = new pc.Vec3(271.3055, 176.5383, 358.0288), pista0Spline_desierto_angulos[29] = new pc.Vec3(271.3577, 176.5956, 358.1), pista0Spline_desierto_angulos[30] = new pc.Vec3(271.4021, 177.325, 358.133), pista0Spline_desierto_angulos[31] = new pc.Vec3(271.4397, 176.1053, 358.2212), pista0Spline_desierto_angulos[32] = new pc.Vec3(271.4805, 174.6885, 358.3152), pista0Spline_desierto_angulos[33] = new pc.Vec3(271.5103, 172.7133, 358.4088), pista0Spline_desierto_angulos[34] = new pc.Vec3(271.5238, 170.2494, 358.4996), pista0Spline_desierto_angulos[35] = new pc.Vec3(271.5242, 167.1046, 358.5962), pista0Spline_desierto_angulos[36] = new pc.Vec3(271.4946, 163.0176, 358.6956), pista0Spline_desierto_angulos[37] = new pc.Vec3(271.4731, 157.6417, 358.841), pista0Spline_desierto_angulos[38] = new pc.Vec3(270.7718, 151.6897, 358.1679), pista0Spline_desierto_angulos[39] = new pc.Vec3(270.5159, 151.6802, 357.3271), pista0Spline_desierto_angulos[40] = new pc.Vec3(270.3489, 153.1315, 356.0277), pista0Spline_desierto_angulos[41] = new pc.Vec3(270.2928, 154.121, 355.2557), pista0Spline_desierto_angulos[42] = new pc.Vec3(270.2712, 154.9457, 354.8107), pista0Spline_desierto_angulos[43] = new pc.Vec3(270.2281, 156.4285, 353.7904), pista0Spline_desierto_angulos[44] = new pc.Vec3(270.1834, 158.7498, 352.0468), pista0Spline_desierto_angulos[45] = new pc.Vec3(270.1399, 162.1372, 349.4986), pista0Spline_desierto_angulos[46] = new pc.Vec3(270.0928, 152.7124, 0), pista0Spline_desierto_angulos[47] = new pc.Vec3(270.056, 154.1705, 0), pista0Spline_desierto_angulos[48] = new pc.Vec3(270, 156.1625, 0), pista0Spline_desierto_angulos[49] = new pc.Vec3(270, 158.7614, 0), pista0Spline_desierto_angulos[50] = new pc.Vec3(270.028, 162.2014, 0), pista0Spline_desierto_angulos[51] = new pc.Vec3(270.0766, 166.4818, 0), pista0Spline_desierto_angulos[52] = new pc.Vec3(270.1824, 184.6867, 346.7563), pista0Spline_desierto_angulos[53] = new pc.Vec3(270.3477, 184.2903, 352.3039), pista0Spline_desierto_angulos[54] = new pc.Vec3(270.2987, 190.0322, 350.4174), pista0Spline_desierto_angulos[55] = new pc.Vec3(270.3976, 349.2568, 186.6408), pista0Spline_desierto_angulos[56] = new pc.Vec3(270.882, 349.2441, 182.7758), pista0Spline_desierto_angulos[57] = new pc.Vec3(271.3654, 346.3204, 181.6476), pista0Spline_desierto_angulos[58] = new pc.Vec3(271.7983, 343.531, 181.1625), pista0Spline_desierto_angulos[59] = new pc.Vec3(272.1571, 341.2354, 180.9128), pista0Spline_desierto_angulos[60] = new pc.Vec3(272.4926, 339.1093, 180.7471), pista0Spline_desierto_angulos[61] = new pc.Vec3(272.7668, 337.5786, 180.6452), pista0Spline_desierto_angulos[62] = new pc.Vec3(272.9743, 336.8011, 180.5868), pista0Spline_desierto_angulos[63] = new pc.Vec3(273.1565, 336.3292, 180.5459), pista0Spline_desierto_angulos[64] = new pc.Vec3(273.2931, 336.3936, 180.5236), pista0Spline_desierto_angulos[65] = new pc.Vec3(273.3654, 337.2766, 180.5246), pista0Spline_desierto_angulos[66] = new pc.Vec3(273.3926, 338.7319, 180.5399), pista0Spline_desierto_angulos[67] = new pc.Vec3(273.3815, 340.6418, 180.5689), pista0Spline_desierto_angulos[68] = new pc.Vec3(273.2928, 343.462, 180.6253), pista0Spline_desierto_angulos[69] = new pc.Vec3(273.1089, 347.1956, 180.7216), pista0Spline_desierto_angulos[70] = new pc.Vec3(272.8474, 351.3148, 180.8615), pista0Spline_desierto_angulos[71] = new pc.Vec3(272.4449, 356.1965, 181.1073), pista0Spline_desierto_angulos[72] = new pc.Vec3(272.265, 357.1155, 181.2179), pista0Spline_desierto_angulos[73] = new pc.Vec3(272.1485, 357.7462, 181.3005), pista0Spline_desierto_angulos[74] = new pc.Vec3(272.139, 357.5919, 181.3028), pista0Spline_desierto_angulos[75] = new pc.Vec3(272.0759, 357.4384, 181.3395), pista0Spline_desierto_angulos[76] = new pc.Vec3(271.9945, 357.2355, 181.3905), pista0Spline_desierto_angulos[77] = new pc.Vec3(271.7369, 356.7287, 181.5879), pista0Spline_desierto_angulos[78] = new pc.Vec3(271.5576, 356.0708, 181.7553), pista0Spline_desierto_angulos[79] = new pc.Vec3(271.3841, 355.3268, 181.9557), pista0Spline_desierto_angulos[80] = new pc.Vec3(271.2597, 354.3973, 182.1194), pista0Spline_desierto_angulos[81] = new pc.Vec3(271.1932, 353.348, 182.1973), pista0Spline_desierto_angulos[82] = new pc.Vec3(271.1493, 352.2151, 182.2337), pista0Spline_desierto_angulos[83] = new pc.Vec3(271.1591, 350.895, 182.1556), pista0Spline_desierto_angulos[84] = new pc.Vec3(271.1968, 349.2689, 182.0133), pista0Spline_desierto_angulos[85] = new pc.Vec3(271.2512, 347.4238, 181.8488), pista0Spline_desierto_angulos[86] = new pc.Vec3(271.3326, 345.247, 181.6498), pista0Spline_desierto_angulos[87] = new pc.Vec3(271.4255, 342.6138, 181.4467), pista0Spline_desierto_angulos[88] = new pc.Vec3(271.5404, 339.4954, 181.2361), pista0Spline_desierto_angulos[89] = new pc.Vec3(271.4929, 335.5378, 181.1504), pista0Spline_desierto_angulos[90] = new pc.Vec3(271.4292, 332.08, 181.0908), pista0Spline_desierto_angulos[91] = new pc.Vec3(271.4893, 330.0744, 180.9852), pista0Spline_desierto_angulos[92] = new pc.Vec3(272.062, 327.6351, 180.6532), pista0Spline_desierto_angulos[93] = new pc.Vec3(272.5648, 324.2954, 180.4674), pista0Spline_desierto_angulos[94] = new pc.Vec3(273.034, 320.1262, 180.3395), pista0Spline_desierto_angulos[95] = new pc.Vec3(273.2639, 315.0565, 180.2574), pista0Spline_desierto_angulos[96] = new pc.Vec3(273.1787, 309.2887, 180.2028), pista0Spline_desierto_angulos[97] = new pc.Vec3(272.7024, 303.1854, 180.1721), pista0Spline_desierto_angulos[98] = new pc.Vec3(271.8619, 297.3059, 180.1709), pista0Spline_desierto_angulos[99] = new pc.Vec3(270.819, 291.8388, 180.2532), pista0Spline_desierto_angulos[100] = new pc.Vec3(270.4428, 107.7091, 359.7065), pista0Spline_desierto_angulos[101] = new pc.Vec3(271.6239, 103.5419, 359.9532), pista0Spline_desierto_angulos[102] = new pc.Vec3(272.4088, 100.2281, 359.9827), pista0Spline_desierto_angulos[103] = new pc.Vec3(272.9616, 97.50529, 359.9932), pista0Spline_desierto_angulos[104] = new pc.Vec3(272.6914, 95.21259, -.003345339), pista0Spline_desierto_angulos[105] = new pc.Vec3(272.4224, 93.25682, -.0001615939), pista0Spline_desierto_angulos[106] = new pc.Vec3(271.9516, 91.46061, -5013226e-11), pista0Spline_desierto_angulos[107] = new pc.Vec3(271.2746, 88.66185, .0007674428), pista0Spline_desierto_angulos[108] = new pc.Vec3(270.6312, 85.93136, 359.9895), pista0Spline_desierto_angulos[109] = new pc.Vec3(270.1791, 83.27392, 359.8849), pista0Spline_desierto_angulos[110] = new pc.Vec3(270.1119, 80.427, 0), pista0Spline_desierto_angulos[111] = new pc.Vec3(270.0969, 77.69146, 0), pista0Spline_desierto_angulos[112] = new pc.Vec3(270.4524, 75.31613, 359.7908), pista0Spline_desierto_angulos[113] = new pc.Vec3(271.2531, 72.62952, 359.896), pista0Spline_desierto_angulos[114] = new pc.Vec3(272.5934, 70.0146, 359.935), pista0Spline_desierto_angulos[115] = new pc.Vec3(272.7325, 67.35242, 359.9204), pista0Spline_desierto_angulos[116] = new pc.Vec3(272.7556, 64.68948, 359.9011), pista0Spline_desierto_angulos[117] = new pc.Vec3(272.6422, 61.94798, 359.8742), pista0Spline_desierto_angulos[118] = new pc.Vec3(272.5912, 59.16872, 359.8446), pista0Spline_desierto_angulos[119] = new pc.Vec3(272.524, 56.33969, 359.81), pista0Spline_desierto_angulos[120] = new pc.Vec3(272.4251, 53.42555, 359.7679), pista0Spline_desierto_angulos[121] = new pc.Vec3(272.2147, 50.5914, 359.705), pista0Spline_desierto_angulos[122] = new pc.Vec3(272.3167, 46.9255, 359.6658), pista0Spline_desierto_angulos[123] = new pc.Vec3(272.2475, 42.84003, 359.5896), pista0Spline_desierto_angulos[124] = new pc.Vec3(272.0896, 38.59213, 359.4795), pista0Spline_desierto_angulos[125] = new pc.Vec3(272.0981, 35.12877, 359.4142), pista0Spline_desierto_angulos[126] = new pc.Vec3(272.2192, 32.24952, 359.3922), pista0Spline_desierto_angulos[127] = new pc.Vec3(272.351, 29.65204, 359.3787), pista0Spline_desierto_angulos[128] = new pc.Vec3(272.4495, 27.63208, 359.3674), pista0Spline_desierto_angulos[129] = new pc.Vec3(272.523, 26.16058, 359.3597), pista0Spline_desierto_angulos[130] = new pc.Vec3(272.6032, 24.87899, 359.3571), pista0Spline_desierto_angulos[131] = new pc.Vec3(272.7113, 24.0423, 359.3696), pista0Spline_desierto_angulos[132] = new pc.Vec3(272.8464, 23.71068, 359.3943), pista0Spline_desierto_angulos[133] = new pc.Vec3(273.1694, 23.5734, 359.4548), pista0Spline_desierto_angulos[134] = new pc.Vec3(274.1698, 23.93578, 359.5921), pista0Spline_desierto_angulos[135] = new pc.Vec3(274.3461, 24.87595, 359.6185), pista0Spline_desierto_angulos[136] = new pc.Vec3(274.5858, 26.20418, 359.6522), pista0Spline_desierto_angulos[137] = new pc.Vec3(274.8288, 28.0246, 359.6868), pista0Spline_desierto_angulos[138] = new pc.Vec3(275.3169, 31.0042, 359.7405), pista0Spline_desierto_angulos[139] = new pc.Vec3(275.6789, 31.87805, 359.7641), pista0Spline_desierto_angulos[140] = new pc.Vec3(275.8542, 32.36189, 359.7747), pista0Spline_desierto_angulos[141] = new pc.Vec3(275.563, 32.35007, 359.7628), pista0Spline_desierto_angulos[142] = new pc.Vec3(275.3236, 32.82953, 359.7556), pista0Spline_desierto_angulos[143] = new pc.Vec3(275.0654, 33.46971, 359.7483), pista0Spline_desierto_angulos[144] = new pc.Vec3(274.7784, 34.29876, 359.74), pista0Spline_desierto_angulos[145] = new pc.Vec3(274.5391, 35.45887, 359.7365), pista0Spline_desierto_angulos[146] = new pc.Vec3(274.2788, 36.87486, 359.7335), pista0Spline_desierto_angulos[147] = new pc.Vec3(274.0134, 38.4414, 359.731), pista0Spline_desierto_angulos[148] = new pc.Vec3(273.548, 40.36855, 359.7162), pista0Spline_desierto_angulos[149] = new pc.Vec3(273.3347, 42.58481, 359.7224), pista0Spline_desierto_angulos[150] = new pc.Vec3(273.1157, 44.92274, 359.7303), pista0Spline_desierto_angulos[151] = new pc.Vec3(272.6329, 47.60027, 359.7151), pista0Spline_desierto_angulos[152] = new pc.Vec3(272.5088, 50.56167, 359.7401), pista0Spline_desierto_angulos[153] = new pc.Vec3(272.4957, 53.5605, 359.7755), pista0Spline_desierto_angulos[154] = new pc.Vec3(272.7097, 56.57069, 359.8253), pista0Spline_desierto_angulos[155] = new pc.Vec3(272.6191, 61.42039, 359.8681), pista0Spline_desierto_angulos[156] = new pc.Vec3(272.8044, 67.67368, 359.9247), pista0Spline_desierto_angulos[157] = new pc.Vec3(272.9882, 74.00517, 359.9644), pista0Spline_desierto_angulos[158] = new pc.Vec3(272.756, 78.80476, 359.9816), pista0Spline_desierto_angulos[159] = new pc.Vec3(272.3737, 82.58963, 359.9911), pista0Spline_desierto_angulos[160] = new pc.Vec3(271.9854, 85.8689, -.002759694), pista0Spline_desierto_angulos[161] = new pc.Vec3(271.6298, 88.62165, -.0001200852), pista0Spline_desierto_angulos[162] = new pc.Vec3(270.8532, 90.83535, -.0003439422), pista0Spline_desierto_angulos[163] = new pc.Vec3(270.1507, 92.8951, 359.9789), pista0Spline_desierto_angulos[164] = new pc.Vec3(270.5226, 274.624, 180.017), pista0Spline_desierto_angulos[165] = new pc.Vec3(271.1677, 276.0718, 180.0131), pista0Spline_desierto_angulos[166] = new pc.Vec3(271.8097, 277.4973, 180.0124), pista0Spline_desierto_angulos[167] = new pc.Vec3(272.4157, 278.7403, 180.013), pista0Spline_desierto_angulos[168] = new pc.Vec3(272.9211, 279.7803, 180.0126), pista0Spline_desierto_angulos[169] = new pc.Vec3(273.4406, 280.8254, 180.0131), pista0Spline_desierto_angulos[170] = new pc.Vec3(273.9, 281.958, 180.0141), pista0Spline_desierto_angulos[171] = new pc.Vec3(274.4287, 280.1522, 180.0081), pista0Spline_desierto_angulos[172] = new pc.Vec3(274.7043, 277.6173, 180.0033), pista0Spline_desierto_angulos[173] = new pc.Vec3(274.8952, 274.4997, 179.9997), pista0Spline_desierto_angulos[174] = new pc.Vec3(273.6542, 271.5755, 179.9986), pista0Spline_desierto_angulos[175] = new pc.Vec3(273.171, 268.9074, 179.9991), pista0Spline_desierto_angulos[176] = new pc.Vec3(272.8214, 266.4253, 180.0006), pista0Spline_desierto_angulos[177] = new pc.Vec3(272.7124, 264.3525, 180.0038), pista0Spline_desierto_angulos[178] = new pc.Vec3(272.6689, 262.7023, 180.0074), pista0Spline_desierto_angulos[179] = new pc.Vec3(272.5354, 259.6949, 180.0164), pista0Spline_desierto_angulos[180] = new pc.Vec3(272.3497, 256.0811, 180.0343), pista0Spline_desierto_angulos[181] = new pc.Vec3(272.0152, 253.9487, 180.0537), pista0Spline_desierto_angulos[182] = new pc.Vec3(271.6622, 253.2321, 180.0714), pista0Spline_desierto_angulos[183] = new pc.Vec3(271.298, 253.0059, 180.094), pista0Spline_desierto_angulos[184] = new pc.Vec3(270.8959, 253.8, 180.1239), pista0Spline_desierto_angulos[185] = new pc.Vec3(270.3991, 255.8588, 180.2074), pista0Spline_desierto_angulos[186] = new pc.Vec3(270.0523, 78.88338, 0), pista0Spline_desierto_angulos[187] = new pc.Vec3(270.0198, 82.6936, 0), pista0Spline_desierto_angulos[188] = new pc.Vec3(270.028, 88.12529, 0), pista0Spline_desierto_angulos[189] = new pc.Vec3(270, 94.65954, 0), pista0Spline_desierto_angulos[190] = new pc.Vec3(270.0198, 101.745, 0), pista0Spline_desierto_angulos[191] = new pc.Vec3(270, 110.5291, 0), pista0Spline_desierto_angulos[192] = new pc.Vec3(270, 115.8963, 0), pista0Spline_desierto_angulos[193] = new pc.Vec3(270, 121.8204, 0), pista0Spline_desierto_angulos[194] = new pc.Vec3(270, 125.3771, 0), pista0Spline_desierto_angulos[195] = new pc.Vec3(270, 131.4922, 0), pista0Spline_desierto_angulos[196] = new pc.Vec3(270.0198, 138.6155, 0), pista0Spline_desierto_angulos[197] = new pc.Vec3(270.0198, 144.9348, 0), pista0Spline_desierto_angulos[198] = new pc.Vec3(270, 149.1285, 0), pista0Spline_desierto_angulos[199] = new pc.Vec3(270.0198, 151.3846, 0), pista0Spline_desierto_angulos[200] = new pc.Vec3(270.0198, 152.5608, 0), pista0Spline_desierto_angulos[201] = new pc.Vec3(270, 152.877, 0), pista0Spline_desierto_angulos[202] = new pc.Vec3(270, 152.6522, 0), pista0Spline_desierto_angulos[203] = new pc.Vec3(270, 152.4824, 0), pista0Spline_desierto_angulos[204] = new pc.Vec3(270.0198, 151.9754, 0), pista0Spline_desierto_angulos[205] = new pc.Vec3(270.0343, 151.6094, 0), pista0Spline_desierto_angulos[206] = new pc.Vec3(270.0343, 151.0969, 0), pista0Spline_desierto_angulos[207] = new pc.Vec3(270.1282, 319.1893, 190.9046), pista0Spline_desierto_angulos[208] = new pc.Vec3(270.3065, 324.7475, 184.5139), pista0Spline_desierto_angulos[209] = new pc.Vec3(270.5539, 325.846, 182.4301), pista0Spline_desierto_angulos[210] = new pc.Vec3(270.819, 326.4189, 181.6337), pista0Spline_desierto_angulos[211] = new pc.Vec3(271.1091, 327.2928, 181.2235), pista0Spline_desierto_angulos[212] = new pc.Vec3(271.4322, 328.752, 180.9841), pista0Spline_desierto_angulos[213] = new pc.Vec3(271.7392, 331.4346, 180.8739), pista0Spline_desierto_angulos[214] = new pc.Vec3(271.9844, 335.3928, 180.8542), pista0Spline_desierto_angulos[215] = new pc.Vec3(272.1224, 340.2279, 180.906), pista0Spline_desierto_angulos[216] = new pc.Vec3(272.1554, 345.1075, 181.0015), pista0Spline_desierto_angulos[217] = new pc.Vec3(272.1183, 349.5042, 181.123), pista0Spline_desierto_angulos[218] = new pc.Vec3(271.9742, 353.1808, 181.3008), pista0Spline_desierto_angulos[219] = new pc.Vec3(271.9679, 356.6752, 181.3958), pista0Spline_desierto_angulos[220] = new pc.Vec3(272.0182, 359.3258, 181.4269), pista0Spline_desierto_angulos[221] = new pc.Vec3(272.9647, 3.316467, 181.0306), pista0Spline_desierto_angulos[222] = new pc.Vec3(273.4435, 3.536517, 180.8884), pista0Spline_desierto_angulos[223] = new pc.Vec3(273.3506, 3.713944, 180.9155), pista0Spline_desierto_angulos[224] = new pc.Vec3(272.7704, 3.42726, 181.1064), pista0Spline_desierto_angulos[225] = new pc.Vec3(272.2059, 2.993021, 181.3863), pista0Spline_desierto_angulos[226] = new pc.Vec3(271.2188, 1.311813, 182.4862), pista0Spline_desierto_angulos[227] = new pc.Vec3(270.3103, 353.4381, 189.6227), pista0Spline_desierto_angulos[228] = new pc.Vec3(270.7723, 185.8757, 356.1864), pista0Spline_desierto_angulos[229] = new pc.Vec3(271.4984, 183.0438, 358.0666), pista0Spline_desierto_angulos[230] = new pc.Vec3(272.4117, 180.9462, 358.8268), pista0Spline_desierto_angulos[231] = new pc.Vec3(272.772, 179.6749, 358.9992), pista0Spline_desierto_angulos[232] = new pc.Vec3(273.1248, 178.438, 359.1301), pista0Spline_desierto_angulos[233] = new pc.Vec3(273.2242, 177.7332, 359.1671), pista0Spline_desierto_angulos[234] = new pc.Vec3(272.9078, 177.5214, 359.0814), pista0Spline_desierto_angulos[235] = new pc.Vec3(272.3972, 177.5631, 358.8885), pista0Spline_desierto_angulos[236] = new pc.Vec3(271.5994, 178.1374, 358.3332), pista0Spline_desierto_angulos[237] = new pc.Vec3(270.9549, 179.5714, 357.1921), pista0Spline_desierto_angulos[238] = new pc.Vec3(270.5407, 182.1739, 354.9992), pista0Spline_desierto_angulos[239] = new pc.Vec3(270.2479, 188.6875, 348.9592), pista0Spline_desierto_angulos[240] = new pc.Vec3(270.3642, 185.7572, 352.4442), pista0Spline_desierto_angulos[241] = new pc.Vec3(271.1236, 181.2064, 357.5267), pista0Spline_desierto_angulos[242] = new pc.Vec3(271.815, 180.6961, 358.4576), pista0Spline_desierto_angulos[243] = new pc.Vec3(272.1372, 180.5178, 358.6884), pista0Spline_desierto_angulos[244] = new pc.Vec3(272.1176, 180.4759, 358.6778), pista0Spline_desierto_angulos[245] = new pc.Vec3(272.1281, 180.4333, 358.6853), pista0Spline_desierto_angulos[246] = new pc.Vec3(272.2067, 180.3441, 358.7336), pista0Spline_desierto_angulos[247] = new pc.Vec3(271.5541, 180.8055, 358.2021), pista0Spline_desierto_angulos[248] = new pc.Vec3(270.8575, 183.0996, 356.6964), pista0Spline_desierto_angulos[249] = new pc.Vec3(270.0685, 180.0496, 0), pista0Spline_desierto_angulos[250] = new pc.Vec3(270.0396, 270.0496, 0);
var conexionPista0 = [],
    vientoPista0 = [];
vientoPista0[0] = 25, vientoPista0[1] = 124;
var pista0_tunelSpline_desierto = [];
pista0_tunelSpline_desierto[0] = new pc.Vec3(0, 0, 0), pista0_tunelSpline_desierto[1] = new pc.Vec3(0, .002639429, -.5999756), pista0_tunelSpline_desierto[2] = new pc.Vec3(0, .002639062, -1.199951), pista0_tunelSpline_desierto[3] = new pc.Vec3(0, .002639416, -1.799927), pista0_tunelSpline_desierto[4] = new pc.Vec3(0, .002639417, -2.399902), pista0_tunelSpline_desierto[5] = new pc.Vec3(0, .00263905, -2.999878), pista0_tunelSpline_desierto[6] = new pc.Vec3(0, .002639295, -3.599976), pista0_tunelSpline_desierto[7] = new pc.Vec3(0, .002639168, -4.199951), pista0_tunelSpline_desierto[8] = new pc.Vec3(0, .002639039, -4.799927), pista0_tunelSpline_desierto[9] = new pc.Vec3(0, .002639391, -5.399902), pista0_tunelSpline_desierto[10] = new pc.Vec3(0, .002639267, -5.999878), pista0_tunelSpline_desierto[11] = new pc.Vec3(0, .002639269, -6.599976), pista0_tunelSpline_desierto[12] = new pc.Vec3(0, .002639381, -7.199829), pista0_tunelSpline_desierto[13] = new pc.Vec3(0, .002639254, -7.799927), pista0_tunelSpline_desierto[14] = new pc.Vec3(0, .002639368, -8.399902), pista0_tunelSpline_desierto[15] = new pc.Vec3(0, .003120679, -8.999756), pista0_tunelSpline_desierto[16] = new pc.Vec3(0, .002619877, -9.599731), pista0_tunelSpline_desierto[17] = new pc.Vec3(0, .002639428, -10.19971), pista0_tunelSpline_desierto[18] = new pc.Vec3(0, .002639063, -10.79968), pista0_tunelSpline_desierto[19] = new pc.Vec3(0, .002639416, -11.39966), pista0_tunelSpline_desierto[20] = new pc.Vec3(0, .002639419, -11.99976), pista0_tunelSpline_desierto[21] = new pc.Vec3(0, .002639052, -12.59973), pista0_tunelSpline_desierto[22] = new pc.Vec3(0, .002639295, -13.19971), pista0_tunelSpline_desierto[23] = new pc.Vec3(0, .002639168, -13.79968), pista0_tunelSpline_desierto[24] = new pc.Vec3(0, .00263904, -14.39966), pista0_tunelSpline_desierto[25] = new pc.Vec3(0, .002639392, -14.99963), pista0_tunelSpline_desierto[26] = new pc.Vec3(0, .002639267, -15.59961), pista0_tunelSpline_desierto[27] = new pc.Vec3(0, .00263927, -16.19971), pista0_tunelSpline_desierto[28] = new pc.Vec3(0, .002639384, -16.79968), pista0_tunelSpline_desierto[29] = new pc.Vec3(0, .002639255, -17.39966), pista0_tunelSpline_desierto[30] = new pc.Vec3(0, .002639368, -17.99963), pista0_tunelSpline_desierto[31] = new pc.Vec3(0, .002639426, -18.59961), pista0_tunelSpline_desierto[32] = new pc.Vec3(0, .002639134, -19.19971), pista0_tunelSpline_desierto[33] = new pc.Vec3(0, .002639433, -19.79968), pista0_tunelSpline_desierto[34] = new pc.Vec3(0, .002639543, -20.39966), pista0_tunelSpline_desierto[35] = new pc.Vec3(0, .002639065, -20.99963), pista0_tunelSpline_desierto[36] = new pc.Vec3(0, .002639417, -21.59973), pista0_tunelSpline_desierto[37] = new pc.Vec3(0, .001400749, -22.19971), pista0_tunelSpline_desierto[38] = new pc.Vec3(0, .001616872, -22.79968), pista0_tunelSpline_desierto[39] = new pc.Vec3(-.004522324, 0, -23.39966), pista0_tunelSpline_desierto[40] = new pc.Vec3(-.00851059, -.001466839, -23.99951), pista0_tunelSpline_desierto[41] = new pc.Vec3(-.008153915, -.00336236, -24.59961), pista0_tunelSpline_desierto[42] = new pc.Vec3(-.007537842, -.005131076, -25.19959), pista0_tunelSpline_desierto[43] = new pc.Vec3(-.007862091, -.005272921, -25.79944), pista0_tunelSpline_desierto[44] = new pc.Vec3(-.00744629, -.005088833, -26.39954), pista0_tunelSpline_desierto[45] = new pc.Vec3(-.007383347, -.005093839, -26.99951), pista0_tunelSpline_desierto[46] = new pc.Vec3(-.007442475, -.005098604, -27.59961), pista0_tunelSpline_desierto[47] = new pc.Vec3(-.00743866, -.005104218, -28.19958), pista0_tunelSpline_desierto[48] = new pc.Vec3(-.007434845, -.005109355, -28.79956), pista0_tunelSpline_desierto[49] = new pc.Vec3(-.007434845, -.005106858, -29.39954), pista0_tunelSpline_desierto[50] = new pc.Vec3(-.007490159, -.005108051, -29.99951), pista0_tunelSpline_desierto[51] = new pc.Vec3(-.007429123, -.005122118, -30.59961), pista0_tunelSpline_desierto[52] = new pc.Vec3(-.007425309, -.00512892, -31.19958), pista0_tunelSpline_desierto[53] = new pc.Vec3(-.007450104, -.005133053, -31.79944), pista0_tunelSpline_desierto[54] = new pc.Vec3(-.007450104, -.005137705, -32.39941), pista0_tunelSpline_desierto[55] = new pc.Vec3(-.007480622, -.005142763, -32.99951), pista0_tunelSpline_desierto[56] = new pc.Vec3(-.007415772, -.00514777, -33.59961), pista0_tunelSpline_desierto[57] = new pc.Vec3(-.00753212, -.005153856, -34.19958), pista0_tunelSpline_desierto[58] = new pc.Vec3(-.00756073, -.005153453, -34.79956), pista0_tunelSpline_desierto[59] = new pc.Vec3(-.007436753, -.005150958, -35.39954), pista0_tunelSpline_desierto[60] = new pc.Vec3(-.007495881, -.005163594, -35.99951), pista0_tunelSpline_desierto[61] = new pc.Vec3(-.007198334, -.005173588, -36.59961), pista0_tunelSpline_desierto[62] = new pc.Vec3(-.007137299, -.005176938, -37.19946), pista0_tunelSpline_desierto[63] = new pc.Vec3(-.007974625, -.005178523, -37.79944), pista0_tunelSpline_desierto[64] = new pc.Vec3(-.0261116, -.005179511, -38.39917), pista0_tunelSpline_desierto[65] = new pc.Vec3(-.07360458, -.005178967, -38.99719), pista0_tunelSpline_desierto[66] = new pc.Vec3(-.1533566, -.005179645, -39.5918), pista0_tunelSpline_desierto[67] = new pc.Vec3(-.2679806, -.005178468, -40.18054), pista0_tunelSpline_desierto[68] = new pc.Vec3(-.4195709, -.00516914, -40.76099), pista0_tunelSpline_desierto[69] = new pc.Vec3(-.6167107, -.005171763, -41.32751), pista0_tunelSpline_desierto[70] = new pc.Vec3(-.859623, -.005179511, -41.87598), pista0_tunelSpline_desierto[71] = new pc.Vec3(-1.155071, -.005179035, -42.39795), pista0_tunelSpline_desierto[72] = new pc.Vec3(-1.48632, -.005178558, -42.89808), pista0_tunelSpline_desierto[73] = new pc.Vec3(-1.842316, -.005178319, -43.3811), pista0_tunelSpline_desierto[74] = new pc.Vec3(-2.208534, -.005178081, -43.8562), pista0_tunelSpline_desierto[75] = new pc.Vec3(-2.621857, -.005179035, -44.29041), pista0_tunelSpline_desierto[76] = new pc.Vec3(-3.07016, -.005175458, -44.68933), pista0_tunelSpline_desierto[77] = new pc.Vec3(-3.531826, -.00516759, -45.07251), pista0_tunelSpline_desierto[78] = new pc.Vec3(-3.999287, -.005171167, -45.44873), pista0_tunelSpline_desierto[79] = new pc.Vec3(-4.470436, -.005178319, -45.82032), pista0_tunelSpline_desierto[80] = new pc.Vec3(-4.943085, -.005178319, -46.1897), pista0_tunelSpline_desierto[81] = new pc.Vec3(-5.415707, -.005177842, -46.55945), pista0_tunelSpline_desierto[82] = new pc.Vec3(-5.887112, -.005177842, -46.93067), pista0_tunelSpline_desierto[83] = new pc.Vec3(-6.354038, -.005177842, -47.30738), pista0_tunelSpline_desierto[84] = new pc.Vec3(-6.812943, -.005177842, -47.69386), pista0_tunelSpline_desierto[85] = new pc.Vec3(-7.246326, -.005178796, -48.10853), pista0_tunelSpline_desierto[86] = new pc.Vec3(-7.66053, -.005173551, -48.54261), pista0_tunelSpline_desierto[87] = new pc.Vec3(-8.06245, -.005166875, -48.98805), pista0_tunelSpline_desierto[88] = new pc.Vec3(-8.450893, -.005173551, -49.4452), pista0_tunelSpline_desierto[89] = new pc.Vec3(-8.808075, -.005179273, -49.92714), pista0_tunelSpline_desierto[90] = new pc.Vec3(-9.11879, -.005178319, -50.43995), pista0_tunelSpline_desierto[91] = new pc.Vec3(-9.363739, -.005178319, -50.98744), pista0_tunelSpline_desierto[92] = new pc.Vec3(-9.544197, -.005178319, -51.55922), pista0_tunelSpline_desierto[93] = new pc.Vec3(-9.659302, -.005178319, -52.14784), pista0_tunelSpline_desierto[94] = new pc.Vec3(-9.726334, -.005179273, -52.74391), pista0_tunelSpline_desierto[95] = new pc.Vec3(-9.760265, -.005176412, -53.34291), pista0_tunelSpline_desierto[96] = new pc.Vec3(-9.772705, -.005165922, -53.94276), pista0_tunelSpline_desierto[97] = new pc.Vec3(-9.775127, -.005167829, -54.54274), pista0_tunelSpline_desierto[98] = new pc.Vec3(-9.773743, -.00517069, -55.14283), pista0_tunelSpline_desierto[99] = new pc.Vec3(-9.773739, -.005165922, -55.74281), pista0_tunelSpline_desierto[100] = new pc.Vec3(-9.773758, -.005162107, -56.34278), pista0_tunelSpline_desierto[101] = new pc.Vec3(-9.773758, -.005158292, -56.94276), pista0_tunelSpline_desierto[102] = new pc.Vec3(-9.77375, -.005154477, -57.54274), pista0_tunelSpline_desierto[103] = new pc.Vec3(-9.773811, -.005150663, -58.14271), pista0_tunelSpline_desierto[104] = new pc.Vec3(-9.773808, -.005146848, -58.74269), pista0_tunelSpline_desierto[105] = new pc.Vec3(-9.773804, -.00513445, -59.34278), pista0_tunelSpline_desierto[106] = new pc.Vec3(-9.7738, -.005130636, -59.94276), pista0_tunelSpline_desierto[107] = new pc.Vec3(-9.773796, -.005135404, -60.54274), pista0_tunelSpline_desierto[108] = new pc.Vec3(-9.773758, -.005131589, -61.14283), pista0_tunelSpline_desierto[109] = new pc.Vec3(-9.773762, -.005126821, -61.74268), pista0_tunelSpline_desierto[110] = new pc.Vec3(-9.773819, -.00512396, -62.34278), pista0_tunelSpline_desierto[111] = new pc.Vec3(-9.773811, -.005120145, -62.94276), pista0_tunelSpline_desierto[112] = new pc.Vec3(-9.77393, -.00511633, -63.54285), pista0_tunelSpline_desierto[113] = new pc.Vec3(-9.773872, -.005113469, -64.14296), pista0_tunelSpline_desierto[114] = new pc.Vec3(-9.77393, -.005101072, -64.74281), pista0_tunelSpline_desierto[115] = new pc.Vec3(-9.77383, -.005093442, -65.3429), pista0_tunelSpline_desierto[116] = new pc.Vec3(-9.773922, -.005099164, -65.94289), pista0_tunelSpline_desierto[117] = new pc.Vec3(-9.773922, -.005097257, -66.54286), pista0_tunelSpline_desierto[118] = new pc.Vec3(-9.773861, -.005114423, -67.14296), pista0_tunelSpline_desierto[119] = new pc.Vec3(-9.773998, -.005403386, -67.74281), pista0_tunelSpline_desierto[120] = new pc.Vec3(-9.774048, -.00359522, -68.34291), pista0_tunelSpline_desierto[121] = new pc.Vec3(-9.773838, 0, -68.94288), pista0_tunelSpline_desierto[122] = new pc.Vec3(-9.773945, .001514567, -69.54285), pista0_tunelSpline_desierto[123] = new pc.Vec3(-9.774036, .002618922, -70.14283), pista0_tunelSpline_desierto[124] = new pc.Vec3(-9.774025, .002992762, -70.7638);
var pista0_tunelSpline_desierto_angulos = [];
pista0_tunelSpline_desierto_angulos[0] = new pc.Vec3(0, 0, 0), pista0_tunelSpline_desierto_angulos[1] = new pc.Vec3(270, 270.0001, 0), pista0_tunelSpline_desierto_angulos[2] = new pc.Vec3(270, 269.9999, 0), pista0_tunelSpline_desierto_angulos[3] = new pc.Vec3(270, 270, 0), pista0_tunelSpline_desierto_angulos[4] = new pc.Vec3(270, 270, 0), pista0_tunelSpline_desierto_angulos[5] = new pc.Vec3(270, 270, 0), pista0_tunelSpline_desierto_angulos[6] = new pc.Vec3(270, 270.0001, 0), pista0_tunelSpline_desierto_angulos[7] = new pc.Vec3(270, 269.9998, 0), pista0_tunelSpline_desierto_angulos[8] = new pc.Vec3(270, 269.9999, 0), pista0_tunelSpline_desierto_angulos[9] = new pc.Vec3(270, 270.0001, 0), pista0_tunelSpline_desierto_angulos[10] = new pc.Vec3(270, 269.9999, 0), pista0_tunelSpline_desierto_angulos[11] = new pc.Vec3(270, 270, 0), pista0_tunelSpline_desierto_angulos[12] = new pc.Vec3(270, 270.0001, 0), pista0_tunelSpline_desierto_angulos[13] = new pc.Vec3(270, 269.9999, 0), pista0_tunelSpline_desierto_angulos[14] = new pc.Vec3(270, 270.0001, 0), pista0_tunelSpline_desierto_angulos[15] = new pc.Vec3(270.1047, 269.8939, 0), pista0_tunelSpline_desierto_angulos[16] = new pc.Vec3(270, 270.0006, 0), pista0_tunelSpline_desierto_angulos[17] = new pc.Vec3(270, 270.0001, 0), pista0_tunelSpline_desierto_angulos[18] = new pc.Vec3(270, 269.9999, 0), pista0_tunelSpline_desierto_angulos[19] = new pc.Vec3(270, 270, 0), pista0_tunelSpline_desierto_angulos[20] = new pc.Vec3(270, 270, 0), pista0_tunelSpline_desierto_angulos[21] = new pc.Vec3(270, 270, 0), pista0_tunelSpline_desierto_angulos[22] = new pc.Vec3(270, 270.0001, 0), pista0_tunelSpline_desierto_angulos[23] = new pc.Vec3(270, 269.9998, 0), pista0_tunelSpline_desierto_angulos[24] = new pc.Vec3(270, 269.9999, 0), pista0_tunelSpline_desierto_angulos[25] = new pc.Vec3(270, 270.0001, 0), pista0_tunelSpline_desierto_angulos[26] = new pc.Vec3(270, 269.9999, 0), pista0_tunelSpline_desierto_angulos[27] = new pc.Vec3(270, 270, 0), pista0_tunelSpline_desierto_angulos[28] = new pc.Vec3(270, 270.0001, 0), pista0_tunelSpline_desierto_angulos[29] = new pc.Vec3(270, 269.9999, 0), pista0_tunelSpline_desierto_angulos[30] = new pc.Vec3(270, 270.0001, 0), pista0_tunelSpline_desierto_angulos[31] = new pc.Vec3(270, 270, 0), pista0_tunelSpline_desierto_angulos[32] = new pc.Vec3(270, 270, 0), pista0_tunelSpline_desierto_angulos[33] = new pc.Vec3(270, 270.0001, 0), pista0_tunelSpline_desierto_angulos[34] = new pc.Vec3(270, 270.0001, 0), pista0_tunelSpline_desierto_angulos[35] = new pc.Vec3(270, 269.9999, 0), pista0_tunelSpline_desierto_angulos[36] = new pc.Vec3(270, 269.9999, 0), pista0_tunelSpline_desierto_angulos[37] = new pc.Vec3(270, 269.9999, 0), pista0_tunelSpline_desierto_angulos[38] = new pc.Vec3(270.0198, 270.0297, 0), pista0_tunelSpline_desierto_angulos[39] = new pc.Vec3(270.239, 181.0495, 89.99796), pista0_tunelSpline_desierto_angulos[40] = new pc.Vec3(270.1887, 180.082, 90.00105), pista0_tunelSpline_desierto_angulos[41] = new pc.Vec3(270.1758, 179.8921, 90.00056), pista0_tunelSpline_desierto_angulos[42] = new pc.Vec3(270.1399, 180.2151, 90), pista0_tunelSpline_desierto_angulos[43] = new pc.Vec3(270.0485, 269.9548, 0), pista0_tunelSpline_desierto_angulos[44] = new pc.Vec3(270, 269.9997, 0), pista0_tunelSpline_desierto_angulos[45] = new pc.Vec3(270, 269.9995, 0), pista0_tunelSpline_desierto_angulos[46] = new pc.Vec3(270, 269.9996, 0), pista0_tunelSpline_desierto_angulos[47] = new pc.Vec3(270, 269.9995, 0), pista0_tunelSpline_desierto_angulos[48] = new pc.Vec3(270, 269.9999, 0), pista0_tunelSpline_desierto_angulos[49] = new pc.Vec3(270, 270.0007, 0), pista0_tunelSpline_desierto_angulos[50] = new pc.Vec3(270, 269.9989, 0), pista0_tunelSpline_desierto_angulos[51] = new pc.Vec3(270, 269.9988, 0), pista0_tunelSpline_desierto_angulos[52] = new pc.Vec3(270, 269.9998, 0), pista0_tunelSpline_desierto_angulos[53] = new pc.Vec3(270, 269.9997, 0), pista0_tunelSpline_desierto_angulos[54] = new pc.Vec3(270, 269.9995, 0), pista0_tunelSpline_desierto_angulos[55] = new pc.Vec3(270, 269.9997, 0), pista0_tunelSpline_desierto_angulos[56] = new pc.Vec3(270, 269.9996, 0), pista0_tunelSpline_desierto_angulos[57] = new pc.Vec3(270, 269.9996, 0), pista0_tunelSpline_desierto_angulos[58] = new pc.Vec3(270, 270.0006, 0), pista0_tunelSpline_desierto_angulos[59] = new pc.Vec3(270, 269.9997, 0), pista0_tunelSpline_desierto_angulos[60] = new pc.Vec3(270, 269.9986, 0), pista0_tunelSpline_desierto_angulos[61] = new pc.Vec3(270, 269.8975, 0), pista0_tunelSpline_desierto_angulos[62] = new pc.Vec3(270, 270.2457, 0), pista0_tunelSpline_desierto_angulos[63] = new pc.Vec3(270, 270.3234, 0), pista0_tunelSpline_desierto_angulos[64] = new pc.Vec3(270, 273.2312, 0), pista0_tunelSpline_desierto_angulos[65] = new pc.Vec3(270, 275.9901, 0), pista0_tunelSpline_desierto_angulos[66] = new pc.Vec3(270, 279.2962, 0), pista0_tunelSpline_desierto_angulos[67] = new pc.Vec3(270, 282.7408, 0), pista0_tunelSpline_desierto_angulos[68] = new pc.Vec3(270, 286.851, 0), pista0_tunelSpline_desierto_angulos[69] = new pc.Vec3(270, 291.3232, 0), pista0_tunelSpline_desierto_angulos[70] = new pc.Vec3(270, 296.8064, 0), pista0_tunelSpline_desierto_angulos[71] = new pc.Vec3(270, 301.6897, 0), pista0_tunelSpline_desierto_angulos[72] = new pc.Vec3(270, 305.4612, 0), pista0_tunelSpline_desierto_angulos[73] = new pc.Vec3(270, 306.6803, 0), pista0_tunelSpline_desierto_angulos[74] = new pc.Vec3(270, 309.7318, 0), pista0_tunelSpline_desierto_angulos[75] = new pc.Vec3(270, 316.993, 0), pista0_tunelSpline_desierto_angulos[76] = new pc.Vec3(270, 319.5172, 0), pista0_tunelSpline_desierto_angulos[77] = new pc.Vec3(270, 320.7571, 0), pista0_tunelSpline_desierto_angulos[78] = new pc.Vec3(270, 321.5904, 0), pista0_tunelSpline_desierto_angulos[79] = new pc.Vec3(270, 321.7782, 0), pista0_tunelSpline_desierto_angulos[80] = new pc.Vec3(270, 322.0959, 0), pista0_tunelSpline_desierto_angulos[81] = new pc.Vec3(270, 321.8428, 0), pista0_tunelSpline_desierto_angulos[82] = new pc.Vec3(270.0198, 321.5437, 0), pista0_tunelSpline_desierto_angulos[83] = new pc.Vec3(270, 320.8095, 0), pista0_tunelSpline_desierto_angulos[84] = new pc.Vec3(270, 318.4264, 0), pista0_tunelSpline_desierto_angulos[85] = new pc.Vec3(270, 314.4833, 0), pista0_tunelSpline_desierto_angulos[86] = new pc.Vec3(270, 312.9631, 0), pista0_tunelSpline_desierto_angulos[87] = new pc.Vec3(270, 311.0975, 0), pista0_tunelSpline_desierto_angulos[88] = new pc.Vec3(270, 308.9622, 0), pista0_tunelSpline_desierto_angulos[89] = new pc.Vec3(270.0198, 304.3469, 0), pista0_tunelSpline_desierto_angulos[90] = new pc.Vec3(270, 297.3329, 0), pista0_tunelSpline_desierto_angulos[91] = new pc.Vec3(270, 290.942, 0), pista0_tunelSpline_desierto_angulos[92] = new pc.Vec3(270, 283.8472, 0), pista0_tunelSpline_desierto_angulos[93] = new pc.Vec3(270.0198, 278.9539, 0), pista0_tunelSpline_desierto_angulos[94] = new pc.Vec3(270, 274.2052, 0), pista0_tunelSpline_desierto_angulos[95] = new pc.Vec3(270, 272.1161, 0), pista0_tunelSpline_desierto_angulos[96] = new pc.Vec3(270, 270.7201, 0), pista0_tunelSpline_desierto_angulos[97] = new pc.Vec3(270, 269.7904, 0), pista0_tunelSpline_desierto_angulos[98] = new pc.Vec3(270, 270.0007, 0), pista0_tunelSpline_desierto_angulos[99] = new pc.Vec3(270, 270.0009, 0), pista0_tunelSpline_desierto_angulos[100] = new pc.Vec3(270, 270.0004, 0), pista0_tunelSpline_desierto_angulos[101] = new pc.Vec3(270, 270.0008, 0), pista0_tunelSpline_desierto_angulos[102] = new pc.Vec3(270, 270.0008, 0), pista0_tunelSpline_desierto_angulos[103] = new pc.Vec3(270, 270.0002, 0), pista0_tunelSpline_desierto_angulos[104] = new pc.Vec3(270, 270.0009, 0), pista0_tunelSpline_desierto_angulos[105] = new pc.Vec3(270, 270.0011, 0), pista0_tunelSpline_desierto_angulos[106] = new pc.Vec3(270, 269.9995, 0), pista0_tunelSpline_desierto_angulos[107] = new pc.Vec3(270, 270.0004, 0), pista0_tunelSpline_desierto_angulos[108] = new pc.Vec3(270, 270.0005, 0), pista0_tunelSpline_desierto_angulos[109] = new pc.Vec3(270, 270.0008, 0), pista0_tunelSpline_desierto_angulos[110] = new pc.Vec3(270, 270.0003, 0), pista0_tunelSpline_desierto_angulos[111] = new pc.Vec3(270, 270.0004, 0), pista0_tunelSpline_desierto_angulos[112] = new pc.Vec3(270, 270.0002, 0), pista0_tunelSpline_desierto_angulos[113] = new pc.Vec3(270, 270.0001, 0), pista0_tunelSpline_desierto_angulos[114] = new pc.Vec3(270, 270.0014, 0), pista0_tunelSpline_desierto_angulos[115] = new pc.Vec3(270, 269.9998, 0), pista0_tunelSpline_desierto_angulos[116] = new pc.Vec3(270, 269.9995, 0), pista0_tunelSpline_desierto_angulos[117] = new pc.Vec3(270, 270.0005, 0), pista0_tunelSpline_desierto_angulos[118] = new pc.Vec3(270, 269.9771, 0), pista0_tunelSpline_desierto_angulos[119] = new pc.Vec3(270.0198, 270.0257, 0), pista0_tunelSpline_desierto_angulos[120] = new pc.Vec3(270.302, .0009683602, 269.9997), pista0_tunelSpline_desierto_angulos[121] = new pc.Vec3(270.2247, .0008689671, 269.9991), pista0_tunelSpline_desierto_angulos[122] = new pc.Vec3(270.1678, .001161338, 269.9988), pista0_tunelSpline_desierto_angulos[123] = new pc.Vec3(270.028, 270.0413, 0), pista0_tunelSpline_desierto_angulos[124] = new pc.Vec3(270.0198, 270.0309, 0);
var LimitFps = pc.createScript("limitFps");
LimitFps.attributes.add("targetFps", {
    type: "number",
    default: 30
}), LimitFps.prototype.initialize = function() {
    this.app;
    this.limit(this.targetFps), this.on("attr:targetFps", (function(t, i) {
        this.limit(t)
    }))
}, LimitFps.prototype.limit = function(t) {
    var i = this.app;
    this.intervalId && (clearInterval(this.intervalId), this.intervalId = null), t >= 60 ? i.autoRender = !0 : (i.autoRender = !1, this.intervalId = setInterval((function() {
        i.renderNextFrame = !0
    }), 1e3 / t))
};
var VidrioControl = pc.createScript("vidrioControl");
VidrioControl.attributes.add("material", {
    type: "asset",
    assetType: "material",
    array: !1,
    title: "material"
}), VidrioControl.attributes.add("skyboxes", {
    type: "asset",
    assetType: "texture",
    array: !0,
    title: "skyboxes"
}), VidrioControl.prototype.initialize = function() {}, VidrioControl.prototype.setTematica = function(t) {
    this.material.resource.sphereMap = this.skyboxes[t].resource, this.material.resource.update()
}, VidrioControl.prototype.update = function(t) {};
var Fps = pc.createScript("fpsController");
! function(i, e) {
    function I() {
        var i, e = arguments;
        for (i in e[1]) e[0][i] = e[1][i];
        return e[0]
    }

    function D(i, e) {
        var o = this,
            s = I({}, D.defaults, e || {}),
            a = s.threshold,
            l = t() - a,
            n = [];
        o.fps = 0, o.tick = function() {
            n = t(), a += (n - l - a) / s.smoothing, o.fps = 1e3 / a, l = n
        }, o.getFPS = function() {
            return o.fps
        }
    }
    var t, o = window.performance;
    t = o.now.bind(o), D.extend = I, window.FPSMeter = D, D.defaults = {
        smoothing: 10,
        threshold: 100
    }
}(), window, FPSMeter, Fps.prototype.initialize = function() {
    fps = this, this.fps = new FPSMeter, this.hilo = null, this.fpsProm = 0, this.benchHecho = !1
}, Fps.prototype.update = function() {
    this.fps.tick()
}, Fps.prototype.getFPS = function() {
    return this.fps.getFPS()
}, Fps.prototype.bench = function() {
    this.benchHecho || (this.hilo = setInterval(this.calcularFPSpromedio.bind(this, 1), 500))
}, Fps.prototype.calcularFPSpromedio = function(i) {
    this.fpsProm = this.fpsProm + this.getFPS(), clearInterval(this.hilo), 6 == i ? (this.fpsProm = this.fpsProm / i, this.setCalidad()) : this.hilo = setInterval(this.calcularFPSpromedio.bind(this, i + 1), 500)
}, Fps.prototype.setCalidad = function() {
    if (console.log("los fps promedios fueron de " + this.fpsProm), this.fpsProm >= 50) this.app.graphicsDevice.maxPixelRatio = window.devicePixelRatio, console.log("la calidad elegida fue MAXIMA");
    else if (this.fpsProm >= 40) {
        (i = .7 * window.devicePixelRatio) < 1 && (i = 1), this.app.graphicsDevice.maxPixelRatio = i, console.log("la calidad elegida fue media alta")
    } else if (this.fpsProm >= 25) {
        var i;
        (i = .5 * window.devicePixelRatio) < 1 && (i = 1), this.app.graphicsDevice.maxPixelRatio = i, console.log("la calidad elegida fue media ")
    } else this.app.graphicsDevice.maxPixelRatio = 1, console.log("la calidad elegida fue baja");
    this.benchHecho = !0
};
