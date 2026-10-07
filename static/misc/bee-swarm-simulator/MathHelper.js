window.MATH = (function (MATH) {

    MATH.ORIGIN=[0,0,0]
    MATH.Z = [0, 0, 1]
    MATH.TO_DEG = 180 / Math.PI
    MATH.TO_RAD = Math.PI / 180
    MATH.HALF_TO_RAD = MATH.TO_RAD * 0.5
    MATH.HALF_PI = Math.PI * 0.5
    MATH.THIRD_PI = Math.PI / 3
    MATH.Y_AXIS = [0, 1, 0]
    MATH.TWO_PI = Math.PI * 2
    MATH.INV_255 = 1 / 255
    MATH.INV_13 = 1 / 13
    MATH.INV_9 = 1 / 9
    MATH.INV_11 = 1 / 11
    MATH.EIGHTth_PI = Math.PI / 8
    MATH.QUATER_PI = Math.PI * 0.25
    MATH.PI_SUB_QUATER = Math.PI - MATH.QUATER_PI
    MATH.IDENTITY_MATRIX=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])

    MATH.random = (a, b) => Math.random() * (b - a) + a
    MATH.constrain = (x, a, b) => x < a ? a : x > b ? b : x

    MATH.map = (value, istart, istop, ostart, ostop) => {
        return ostart + (ostop - ostart) * ((value - istart) / (istop - istart))
    }

    MATH.generateBezierCurve = function (a, b, c1, c2, t) {

        let l = vec3.lerp

        let a_c1 = l([], a, c1, t),
            c1_c2 = l([], c1, c2, t),
            b_c2 = l([], b, c2, t),
            p1 = l([], a_c1, c1_c2, t),
            p2 = l([], b_c2, c1_c2, t)

        return l(p1, p1, p2, t)

    }

    MATH.mult = function (m, a, b) {
        //optimized to multiply view and projection matrix
        //a=proj,b=view

        b = b.slice()

        m[0] = b[0] * a[0]
        m[1] = b[1] * a[5]
        m[2] = b[2] * a[10] + b[3] * a[14]
        m[3] = -b[2]
        m[4] = b[4] * a[0]
        m[5] = b[5] * a[5]
        m[6] = b[6] * a[10] + b[7] * a[14]
        m[7] = -b[6]
        m[8] = b[8] * a[0]
        m[9] = b[9] * a[5]
        m[10] = b[10] * a[10] + b[11] * a[14]
        m[11] = -b[10]
        m[12] = b[12] * a[0]
        m[13] = b[13] * a[5]
        m[14] = b[12] * a[2] + b[13] * a[6] + b[14] * a[10] + b[15] * a[14]
        m[15] = -b[14] + b[15] * a[15]

        return m
    }

    MATH.translate = function (m, x, y, z) {

        let a = m

        a[12] = x * a[0] + y * a[4] + z * a[8] + a[12]
        a[13] = x * a[1] + y * a[5] + z * a[9] + a[13]
        a[14] = x * a[2] + y * a[6] + z * a[10] + a[14]
        a[15] = x * a[3] + y * a[7] + z * a[11] + a[15]

        return a
    }

    MATH.xRotate = function (m, c, s) {

        let a = m
        let t = a[1]
        a[1] = t * c + a[2] * s
        a[2] = t * -s + a[2] * c
        t = a[5]
        a[5] = t * c + a[6] * s
        a[6] = t * -s + a[6] * c
        t = a[9]
        a[9] = t * c + a[10] * s
        a[10] = t * -s + a[10] * c
        t = a[13]
        a[13] = t * c + a[14] * s
        a[14] = t * -s + a[14] * c

        return a
    }

    MATH.yRotate = function (m, c, s) {

        m[0] = c
        m[1] = 0
        m[2] = -s
        m[3] = 0
        m[4] = 0
        m[5] = 1
        m[6] = 0
        m[7] = 0
        m[8] = s
        m[9] = 0
        m[10] = c
        m[11] = 0
        m[12] = 0
        m[13] = 0
        m[14] = 0
        m[15] = 1

        return m
    }

    MATH.lerpMatrix = function (out, m, t) {

        out[0] = (m[0] - out[0]) * t + out[0]
        out[1] = (m[1] - out[1]) * t + out[1]
        out[2] = (m[2] - out[2]) * t + out[2]
        out[3] = (m[3] - out[3]) * t + out[3]
        out[4] = (m[4] - out[4]) * t + out[4]
        out[5] = (m[5] - out[5]) * t + out[5]
        out[6] = (m[6] - out[6]) * t + out[6]
        out[7] = (m[7] - out[7]) * t + out[7]
        out[8] = (m[8] - out[8]) * t + out[8]
        out[9] = (m[9] - out[9]) * t + out[9]
        out[10] = (m[10] - out[10]) * t + out[10]
        out[11] = (m[11] - out[11]) * t + out[11]
        out[12] = (m[12] - out[12]) * t + out[12]
        out[13] = (m[13] - out[13]) * t + out[13]
        out[14] = (m[14] - out[14]) * t + out[14]
        out[15] = (m[15] - out[15]) * t + out[15]

    }

    MATH.addCommas = function (s) {

        for (let i = s.length - 3; i > 0; i -= 3) {

            s = s.substr(0, i) + ',' + s.substr(i, s.length)
        }

        return s
    }

    MATH.lerp = function (a, b, x) {

        return x * (b - a) + a
    }

    MATH.icosphere = function (order = 0) {

        let f = (1 + 5 ** 0.5) * 0.5;
        let T = 4 ** order;

        let vertices = new Float32Array((10 * T + 2) * 3);
        vertices.set(Float32Array.of(
            -1, f, 0, 1, f, 0, -1, -f, 0, 1, -f, 0,
            0, -1, f, 0, 1, f, 0, -1, -f, 0, 1, -f,
            f, 0, -1, f, 0, 1, -f, 0, -1, -f, 0, 1));
        let triangles = Uint32Array.of(
            0, 11, 5, 0, 5, 1, 0, 1, 7, 0, 7, 10, 0, 10, 11,
            11, 10, 2, 5, 11, 4, 1, 5, 9, 7, 1, 8, 10, 7, 6,
            3, 9, 4, 3, 4, 2, 3, 2, 6, 3, 6, 8, 3, 8, 9,
            9, 8, 1, 4, 9, 5, 2, 4, 11, 6, 2, 10, 8, 6, 7);

        let v = 12
        let midCache = order ? new Map() : null;

        function addMidPoint(a, b) {

            let key = Math.floor((a + b) * (a + b + 1) * 0.5) + Math.min(a, b)
            let i = midCache.get(key)
            if (i !== undefined) { midCache.delete(key); return i }
            midCache.set(key, v)
            for (let k = 0; k < 3; k++) vertices[3 * v + k] = (vertices[3 * a + k] + vertices[3 * b + k]) * 0.5
            i = v++
            return i
        }

        let trianglesPrev = triangles

        for (let i = 0; i < order; i++) {

            triangles = new Uint32Array(trianglesPrev.length << 2)

            for (let k = 0; k < trianglesPrev.length; k += 3) {

                let v1 = trianglesPrev[k]
                let v2 = trianglesPrev[k + 1]
                let v3 = trianglesPrev[k + 2]
                let a = addMidPoint(v1, v2)
                let b = addMidPoint(v2, v3)
                let c = addMidPoint(v3, v1)
                let t = k << 2
                triangles[t++] = v1; triangles[t++] = a; triangles[t++] = c;
                triangles[t++] = v2; triangles[t++] = b; triangles[t++] = a;
                triangles[t++] = v3; triangles[t++] = c; triangles[t++] = b;
                triangles[t++] = a; triangles[t++] = b; triangles[t++] = c;
            }

            trianglesPrev = triangles
        }

        for (let i = 0; i < vertices.length; i += 3) {

            let m = 0.5 / Math.hypot(vertices[i], vertices[i + 1], vertices[i + 2])
            vertices[i] *= m
            vertices[i + 1] *= m
            vertices[i + 2] *= m
        }

        return { verts: vertices, index: triangles }
    }

    MATH.doGrammar = function (s) {

        let str = s.slice(), _s = ''

        for (let i in str) {

            if (str[i].toLowerCase()!==str[i]) {

                _s = _s + ' ' + str[i]

            } else {

                _s = _s + str[i]
            }
        }

        return _s[0].toUpperCase() + _s.substr(1, _s.length)
    }

    MATH.doTime = function (s) {

        return (s>=3600?((0.00027777777*s)|0)+'h ':'')+(s>=60?(((0.0166666667*s)%60)|0)+'m ':'')+(s|0)%60+'s'
    }
    MATH.doTime_withDays = function (s) {

        return (s>=86400?((0.00001157407*s)|0)+'d ':'')+(s>=3600?(((0.00027777777*s)%24)|0)+'h ':'')+(s>=60?(((0.0166666667*s)%60)|0)+'m ':'')+(s|0)%60+'s'
    }

    MATH.doPlural = function (s) {

        if (s[s.length - 1] === 's') {

            return s
        }

        if (s[s.length - 1] === 'y') {

            return s.substr(0, s.length - 1) + 'ies'
        }

        if(s[s.length-1]==='x'){

            return s + 'es'
        }

        return s+'s'
    
    }

    MATH.pointInTriangle = function (x, y, ax, ay, bx, by, cx, cy) {

        let tri = [[ax, ay], [bx, by], [cx, cy]], pt = [x, y]

        let a = 1 / (-tri[1][1] * tri[2][0] + tri[0][1] * (-tri[1][0] + tri[2][0]) + tri[0][0] * (tri[1][1] - tri[2][1]) + tri[1][0] * tri[2][1]),
            s = a * (tri[2][0] * tri[0][1] - tri[0][0] * tri[2][1] + (tri[2][1] - tri[0][1]) * pt[0] + (tri[0][0] - tri[2][0]) * pt[1])

        if (s < 0) {

            return

        } else {

            let t = a * (tri[0][0] * tri[1][1] - tri[1][0] * tri[0][1] + (tri[0][1] - tri[1][1]) * pt[0] + (tri[1][0] - tri[0][0]) * pt[1])

            return ((t > 0) && (1 - s - t > 0))

        }
    }

    MATH.doStatGrammar = function (s) {
        
        return s.indexOf('beesToLevel')>-1?'Raise':s.indexOf('WindShrine')>-1?'Donate':s==='beeTypes'?'Discover':s.indexOf('Cannon')>-1||s==='timesUsingTheSlingshot'?'Fly':s==='itemsUsingTheBlender'?'Craft':s.indexOf('falling')>-1?'Catch':s==='bubbles'?'Pop':s==='flames'?'Spawn':['rhinoBeetle','ladybug','spider','werewolf','mantis','scorpion','kingBeetle','tunnelBear','ant','fireAnt','armyAnt','flyingAnt','giantAnt','mondoChick','rogueViciousBee','mechsquito','megaMechsquito','cogmower','goldenCogmower','cogTurret'].indexOf(s)>-1||s.indexOf('ffshrooms')>-1?'Defeat':s.toLowerCase().indexOf('token')>-1||s.toLowerCase().indexOf('pollen')>-1||s.toLowerCase().indexOf('goo')>-1||s.toLowerCase().indexOf('nectar')>-1?'Collect':'Use'
    }

    MATH.indexOfArrays = function (arr, val) {

        let s = JSON.stringify(val)
        let a = arr.map(JSON.stringify)

        return a.indexOf(s)
    }

    MATH.abvNumber = function (n) {

        let l = ((n.length - 1) / 3) | 0, suf = ' KMBTQ'[l] || '', i = (n.length) % 3, pre = n.substr(0, 3)

        pre = pre.substr(0, i) + '.' + pre.substr(i, 3)
        pre = pre[0] === '.' ? pre.substr(1, 3) : pre
        pre = pre[pre.length - 1] === '0' && pre.includes('.') && suf !== ' ' ? pre.substr(0, pre.length - 1) : pre
        pre = pre[pre.length - 1] === '.' ? pre.substr(0, pre.length - 1) : pre
        return pre + suf.trim()
    }

    MATH._log=function (a,b) {

        return Math.log(b)/Math.log(a)
    }

    MATH.simulateProbabilityTries=function (p) {

        return Math.round(MATH._log(1-p,Math.random()))+1
    }

    MATH.selectFromArray=function(arr,count){

        let res=[]

        for(let i=0,j=(Math.random()*arr.length)|0;i<count&&arr.length;i++,j=(Math.random()*arr.length)|0){

            res.push(arr[j])
            arr.splice(j,1)
        }

        return res
    }

    MATH.applyPercentage=function(x,m){
    
        return (x-1)*(1-m)+1
    }
    
    let tmq=MATH.TWO_PI-MATH.QUATER_PI,qptmq=MATH.QUATER_PI+tmq

    MATH.dupedTokenLoadingArcRotation=function(x){

        return (1-x)*(1-x)*tmq-qptmq
    }

    MATH.closestPointOnLine=function(a,b,p){
    
        let del=vec3.sub([],b,a),
            t=vec3.dot(vec3.sub([],p,a),del)/vec3.dot(del,del)
        vec3.scale(del,del,MATH.constrain(t,0,1))
        vec3.add(del,del,a)
        return del
    }

    return MATH

})({})
