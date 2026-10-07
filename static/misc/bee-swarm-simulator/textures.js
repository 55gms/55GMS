(function(){
    window.textures_default=function(){
    
        let data=new Uint8Array(512*512<<2),smoothstep=(a,b,t)=>(b-a)*t*t*(3-(t+t))+a,hash2=(x,y)=>{
            let n=(x*527.53851+y*439.522341-(x*y*257.611))*(x+y)*0.0012294+0.5
            return n-Math.floor(n)
        },flr=Math.floor,noise_base=(x,y)=>{
            let _x=flr(x),_y=flr(y),lt=hash2(_x,_y),lb=hash2(_x,_y+1),rt=hash2(_x+1,_y),rb=hash2(_x+1,_y+1),l=smoothstep(lt,lb,y-_y),r=smoothstep(rt,rb,y-_y)
            return smoothstep(l,r,x-_x)
        },octaves=2,decay=0.5,upscale=0.5,noise2=(x,y)=>{
            let n=0,d=1,u=1,_x=x,_y=y,t=0
            for(let i=0;i<octaves;i++){
                n+=(noise_base(_x,_y)+noise_base(_y*0.707107-_x*0.707107-100,_y*0.707107+_x*0.707107-100)+noise_base(_y*-0.707107+_x*0.707107-200,_y*-0.707107-_x*0.707107-200))*d
                t+=d
                d*=decay
                _x*=upscale
                _y*=upscale
            }
            return (n/(t*3))
        },inv_h=1/512
    
        for(let i=0,l=data.length;i<l;i+=4){
            let x=(i>>2)%512,y=(i>>2)*inv_h,v=(0.5-noise2(x*0.125+205,y*0.125-323)*0.5)*255
            data[i+3]=v
        }
        data[3]=0
        return data
    }
    
    window.textures_effects=function(tex_ctx){
    
        tex_ctx.textBaseline='middle'
        tex_ctx.clearRect(0,0,2048,2048)
        tex_ctx.fillStyle='rgb(235,235,235)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.fillStyle='rgb(130,130,130)'
        tex_ctx.strokeStyle='rgb(130,130,130)'
        tex_ctx.lineWidth=5
        tex_ctx.beginPath()
        tex_ctx.arc(64+8,9*128/30,3.5*128/30,0,8)
        tex_ctx.moveTo(53+8,96)
        tex_ctx.lineTo(61+8,53)
        tex_ctx.moveTo(53+8,96)
        tex_ctx.lineTo(39+8,116)
        tex_ctx.moveTo(53+8,96)
        tex_ctx.lineTo(71+8,116)
        tex_ctx.moveTo(36+8,54)
        tex_ctx.lineTo(59+8,64)
        tex_ctx.moveTo(86+8,61)
        tex_ctx.lineTo(59+8,64)
        tex_ctx.closePath()
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.moveTo(45,33)
        tex_ctx.lineTo(15,33)
        tex_ctx.moveTo(35,62)
        tex_ctx.lineTo(7,62)
        tex_ctx.moveTo(35,91)
        tex_ctx.lineTo(12,91)
        tex_ctx.closePath()
        tex_ctx.strokeStyle='rgba(130,130,130,0.5)'
        tex_ctx.stroke()
        
        tex_ctx.fillStyle='rgb(0,200,0)'
        tex_ctx.fillRect(128,0,128,128)
        tex_ctx.fillStyle='rgb(0,0,0)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(118+128/6,128/2)
        tex_ctx.bezierCurveTo(128-20+128/2,0,20+128+128/2,0,138+128*5/6,128/2)
        tex_ctx.moveTo(118+128/6,128/2)
        tex_ctx.bezierCurveTo(128-20+128/2,128,20+128+128/2,128,138+128*5/6,128/2)
        tex_ctx.closePath()
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(0,200,0)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(128+128/2,20+128/2)
        tex_ctx.bezierCurveTo(108+128/2,(128/2)+10,108+128/2,(128/2)-10,128+128/2,(128/2)-20)
        tex_ctx.moveTo(128+128/2,20+128/2)
        tex_ctx.bezierCurveTo(148+128/2,(128/2)+10,148+128/2,(128/2)-10,128+128/2,(128/2)-20)
        tex_ctx.closePath()
        tex_ctx.fill()
        
        tex_ctx.lineCap='round'
        tex_ctx.lineJoin='round'
        tex_ctx.fillStyle='rgb(245,245,245)'
        tex_ctx.fillRect(256,0,128,128)
        tex_ctx.translate(-5,0)
        tex_ctx.fillStyle='rgb(0,0,0)'
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.lineWidth=10
        tex_ctx.beginPath()
        tex_ctx.ellipse(290,93,15,9,-0.2,0,7)
        tex_ctx.ellipse(349,84,15,9,-0.2,0,7)
        tex_ctx.closePath()
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.moveTo(300,90)
        tex_ctx.lineTo(305,34)
        tex_ctx.moveTo(306,33)
        tex_ctx.lineTo(361,25)
        tex_ctx.moveTo(364,25)
        tex_ctx.lineTo(359,78)
        tex_ctx.closePath()
        tex_ctx.stroke()
        tex_ctx.translate(5,0)
        
        tex_ctx.fillStyle='rgb(245,245,245)'
        tex_ctx.fillRect(256+128,0,128,128)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.lineWidth=7
        tex_ctx.beginPath()
        
        for(let i=0,inc=Math.PI*2;i<inc;i+=inc/6){
            
            tex_ctx.moveTo(256+128*1.5+Math.sin(i)*25,128*0.5+Math.cos(i)*25*0.8)
            tex_ctx.lineTo(256+128*1.5+Math.sin(i)*55,128*0.5+Math.cos(i)*55*0.8)
            
        }
        
        tex_ctx.closePath()
        tex_ctx.stroke()
        
        tex_ctx.fillStyle='rgb(0,0,0)'
        tex_ctx.fillRect(256+256,0,128,128)
        tex_ctx.strokeStyle='rgb(255,255,255)'
        tex_ctx.fillStyle='rgb(255,255,255)'
        tex_ctx.lineWidth=4
        tex_ctx.beginPath()
        tex_ctx.translate(256*2+128/2,128/2)
        
        for(let i=0,_i=0;i<=Math.PI*2;i+=Math.PI*2/16,_i++){
            
            let r=_i%2===0?20:60
            tex_ctx.lineTo(Math.cos(i)*r,Math.sin(i)*r)
        }
        
        tex_ctx.setTransform(1,0,0,1,0,0)
        tex_ctx.fill()
        
        tex_ctx.fillStyle='rgb(0,0,0)'
        tex_ctx.fillRect(256+256+128,0,128,128)
        tex_ctx.strokeStyle='rgb(255,255,255)'
        tex_ctx.fillStyle='rgb(255,0,0)'
        tex_ctx.lineWidth=4
        tex_ctx.beginPath()
        tex_ctx.translate(256*2.5+128/2,128/2)
        
        for(let i=0,_i=0;i<=Math.PI*2;i+=Math.PI*2/16,_i++){
            
            let r=_i%2===0?20:60
            tex_ctx.lineTo(Math.cos(i)*r,Math.sin(i)*r)
        }
        
        tex_ctx.setTransform(1,0,0,1,0,0)
        tex_ctx.fill()
        
        tex_ctx.fillStyle='rgb(0,0,0)'
        tex_ctx.fillRect(256+256+256,0,128,128)
        tex_ctx.strokeStyle='rgb(255,255,255)'
        tex_ctx.fillStyle='rgb(0,0,255)'
        tex_ctx.lineWidth=4
        tex_ctx.beginPath()
        tex_ctx.translate(256*3+128/2,128/2)
        
        for(let i=0,_i=0;i<=Math.PI*2;i+=Math.PI*2/16,_i++){
            
            let r=_i%2===0?20:60
            tex_ctx.lineTo(Math.cos(i)*r,Math.sin(i)*r)
        }
        
        tex_ctx.setTransform(1,0,0,1,0,0)
        tex_ctx.fill()
        
        tex_ctx.fillStyle='rgb(0,0,0)'
        tex_ctx.fillRect(256+256+256+128,0,128,128)
        tex_ctx.strokeStyle='rgb(255,255,255)'
        tex_ctx.fillStyle='rgb(255,255,255)'
        tex_ctx.lineWidth=4
        tex_ctx.beginPath()
        tex_ctx.translate(256*3.5+128/2,128/2)
        
        for(let i=0,_i=0;i<=Math.PI*2;i+=Math.PI*2/16,_i++){
            
            let r=_i%2===0?20:60
            tex_ctx.lineTo(Math.cos(i)*r,Math.sin(i)*r)
        }
        
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.moveTo(36,27)
        tex_ctx.lineTo(36,47)
        tex_ctx.moveTo(26,37)
        tex_ctx.lineTo(46,37)
        for(let i=0,_i=0;i<=Math.PI*2;i+=Math.PI*4/16,_i++){
            
            if(_i===1) continue
            
            let r=42,r2=55
            tex_ctx.moveTo(Math.cos(i)*r2,Math.sin(i)*r2)
            tex_ctx.lineTo(Math.cos(i)*r,Math.sin(i)*r)
        }
        tex_ctx.lineWidth=6
        tex_ctx.strokeStyle='rgb(255,255,255)'
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(0,0,0)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.strokeStyle='rgb(255,255,255)'
        tex_ctx.fillStyle='rgb(255, 0, 0)'
        tex_ctx.lineWidth=4
        tex_ctx.beginPath()
        tex_ctx.translate(128*0.5,128+128/2)
        
        for(let i=0,_i=0;i<=Math.PI*2;i+=Math.PI*2/16,_i++){
            
            let r=_i%2===0?20:60
            tex_ctx.lineTo(Math.cos(i)*r,Math.sin(i)*r)
        }
        
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.moveTo(36,27)
        tex_ctx.lineTo(36,47)
        tex_ctx.moveTo(26,37)
        tex_ctx.lineTo(46,37)
        for(let i=0,_i=0;i<=Math.PI*2;i+=Math.PI*4/16,_i++){
            
            if(_i===1) continue
            
            let r=42,r2=55
            tex_ctx.moveTo(Math.cos(i)*r2,Math.sin(i)*r2)
            tex_ctx.lineTo(Math.cos(i)*r,Math.sin(i)*r)
        }
        tex_ctx.lineWidth=6
        tex_ctx.strokeStyle='rgb(255,0,0)'
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(0,0,0)'
        tex_ctx.fillRect(128,128,128,128)
        tex_ctx.strokeStyle='rgb(255,255,255)'
        tex_ctx.fillStyle='rgb(0,0,255)'
        tex_ctx.lineWidth=4
        tex_ctx.beginPath()
        tex_ctx.translate(128+128*0.5,128+128/2)
        
        for(let i=0,_i=0;i<=Math.PI*2;i+=Math.PI*2/16,_i++){
            
            let r=_i%2===0?20:60
            tex_ctx.lineTo(Math.cos(i)*r,Math.sin(i)*r)
        }
        
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.moveTo(36,27)
        tex_ctx.lineTo(36,47)
        tex_ctx.moveTo(26,37)
        tex_ctx.lineTo(46,37)
        
        for(let i=0,_i=0;i<=Math.PI*2;i+=Math.PI*4/16,_i++){
            
            if(_i===1) continue
            
            let r=42,r2=55
            tex_ctx.moveTo(Math.cos(i)*r2,Math.sin(i)*r2)
            tex_ctx.lineTo(Math.cos(i)*r,Math.sin(i)*r)
        }
        
        tex_ctx.lineWidth=6
        tex_ctx.strokeStyle='rgb(0,0,255)'
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(150,255,150)'
        tex_ctx.fillRect(128*2,128,128,128)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(78, 135, 242)'
        tex_ctx.lineWidth=4
        tex_ctx.beginPath()
        tex_ctx.translate(256+128*0.5,128+128/2)
        tex_ctx.scale(1.2,1.2)
        
        for(let i=0;i<4;i++){
            
            tex_ctx.rotate(Math.PI*0.5)
            tex_ctx.moveTo(-8,0)
            tex_ctx.bezierCurveTo(-40,-60,40,-60,8,0)
        }
        
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-10)
        tex_ctx.lineTo(0,10)
        tex_ctx.moveTo(-10,0)
        tex_ctx.lineTo(10,0)
        tex_ctx.lineWidth=4
        tex_ctx.strokeStyle='rgb(255,255,255)'
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(150,255,150)'
        tex_ctx.fillRect(128*3,128,128,128)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(237, 82, 73)'
        tex_ctx.lineWidth=4
        tex_ctx.beginPath()
        tex_ctx.translate(256*1.5+128*0.5,128+128/2)
        tex_ctx.scale(1.2,1.2)
        
        for(let i=0;i<4;i++){
            
            tex_ctx.rotate(Math.PI*0.5)
            tex_ctx.moveTo(-8,0)
            tex_ctx.bezierCurveTo(-40,-60,40,-60,8,0)
        }
        
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-10)
        tex_ctx.lineTo(0,10)
        tex_ctx.moveTo(-10,0)
        tex_ctx.lineTo(10,0)
        tex_ctx.lineWidth=4
        tex_ctx.strokeStyle='rgb(255,255,255)'
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(150,255,150)'
        tex_ctx.fillRect(128*4,128,128,128)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(200,200,200)'
        tex_ctx.lineWidth=4
        tex_ctx.beginPath()
        tex_ctx.translate(256*2+128*0.5,128+128/2)
        tex_ctx.scale(1.2,1.2)
        
        for(let i=0;i<4;i++){
            
            tex_ctx.rotate(Math.PI*0.5)
            tex_ctx.moveTo(-8,0)
            tex_ctx.bezierCurveTo(-40,-60,40,-60,8,0)
        }
        
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-10)
        tex_ctx.lineTo(0,10)
        tex_ctx.moveTo(-10,0)
        tex_ctx.lineTo(10,0)
        tex_ctx.lineWidth=4
        tex_ctx.strokeStyle='rgb(255,255,255)'
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(224, 0, 0)'
        tex_ctx.fillRect(128*5,128,128,128)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(255, 98, 0)'
        tex_ctx.lineWidth=4
        tex_ctx.beginPath()
        tex_ctx.translate(256*2.5+128*0.5,128+128/2)
        tex_ctx.moveTo(0,-40)
        tex_ctx.bezierCurveTo(-35,0,-32,42,0,45)
        tex_ctx.moveTo(0,-40)
        tex_ctx.bezierCurveTo(35,0,32,42,0,45)
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(247, 56, 3)'
        tex_ctx.beginPath()
        tex_ctx.scale(0.6,0.6)
        tex_ctx.translate(0,20)
        tex_ctx.moveTo(0,-40)
        tex_ctx.bezierCurveTo(-35,0,-32,42,0,45)
        tex_ctx.moveTo(0,-40)
        tex_ctx.bezierCurveTo(35,0,32,42,0,45)
        tex_ctx.fill()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(232, 232, 232)'
        tex_ctx.fillRect(128*6,128,128,128)
        tex_ctx.strokeStyle='rgb(0,0,0,0.8)'
        tex_ctx.fillStyle='rgb(255, 234, 117)'
        tex_ctx.lineWidth=4
        tex_ctx.translate(128*6,128)
        tex_ctx.beginPath()
        tex_ctx.arc(128/2,128/2,45,0,6)
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.translate(128/2,128/2)
        
        for(let i=Math.PI*0.25;i<Math.PI;i+=Math.PI*2/4){
            
            tex_ctx.moveTo(Math.sin(i)*45,Math.cos(i)*45)
            tex_ctx.lineTo(Math.sin(i)*-45,Math.cos(i)*-45)
        }
        
        tex_ctx.stroke()
        tex_ctx.scale(0.46,0.46)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.closePath()
        tex_ctx.strokeStyle='rgb(0,0,0,0.3)'
        tex_ctx.lineWidth=5
        tex_ctx.strokeStyle='rgb(0,0,0,0.4)'
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle='rgb(255,255,255)'
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.arc(0,0,25,0,6)
        tex_ctx.closePath()
        tex_ctx.strokeStyle='rgb(157, 242, 100)'
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle='rgb(226, 255, 138)'
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(232, 232, 232)'
        tex_ctx.fillRect(128*7,128,128,128)
        tex_ctx.strokeStyle='rgb(0,0,0,0.8)'
        tex_ctx.fillStyle='rgb(255, 234, 117)'
        tex_ctx.lineWidth=4
        tex_ctx.translate(128*7,128)
        tex_ctx.beginPath()
        tex_ctx.arc(128/2,128/2,45,0,6)
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.translate(128/2,128/2)
        
        for(let i=Math.PI*0.25;i<Math.PI;i+=Math.PI*2/4){
            
            tex_ctx.moveTo(Math.sin(i)*45,Math.cos(i)*45)
            tex_ctx.lineTo(Math.sin(i)*-45,Math.cos(i)*-45)
        }
        
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.arc(0,0,25,0,6)
        tex_ctx.closePath()
        tex_ctx.fillStyle='rgb(255, 206, 8)'
        tex_ctx.fill()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(224, 0, 0)'
        tex_ctx.fillRect(0,128*2,128,128)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(255, 98, 0)'
        tex_ctx.lineWidth=4
        tex_ctx.beginPath()
        tex_ctx.scale(0.4,0.4)
        tex_ctx.translate(85,782)
        tex_ctx.moveTo(0,-40)
        tex_ctx.bezierCurveTo(-35,0,-32,42,0,45)
        tex_ctx.moveTo(0,-40)
        tex_ctx.bezierCurveTo(35,0,32,42,0,45)
        tex_ctx.translate(134,0)
        tex_ctx.moveTo(0,-40)
        tex_ctx.bezierCurveTo(-35,0,-32,42,0,45)
        tex_ctx.moveTo(0,-40)
        tex_ctx.bezierCurveTo(35,0,32,42,0,45)
        tex_ctx.translate(-65,-68)
        tex_ctx.moveTo(0,-40)
        tex_ctx.bezierCurveTo(-35,0,-32,42,0,45)
        tex_ctx.moveTo(0,-40)
        tex_ctx.bezierCurveTo(35,0,32,42,0,45)
        tex_ctx.translate(0,129)
        tex_ctx.moveTo(0,-40)
        tex_ctx.bezierCurveTo(-35,0,-32,42,0,45)
        tex_ctx.moveTo(0,-40)
        tex_ctx.bezierCurveTo(35,0,32,42,0,45)
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(247, 56, 3)'
        tex_ctx.beginPath()
        tex_ctx.scale(0.6,0.6)
        tex_ctx.translate(0,20)
        tex_ctx.moveTo(0,-40)
        tex_ctx.bezierCurveTo(-35,0,-32,42,0,45)
        tex_ctx.moveTo(0,-40)
        tex_ctx.bezierCurveTo(35,0,32,42,0,45)
        tex_ctx.translate(-115,-102)
        tex_ctx.moveTo(0,-40)
        tex_ctx.bezierCurveTo(-35,0,-32,42,0,45)
        tex_ctx.moveTo(0,-40)
        tex_ctx.bezierCurveTo(35,0,32,42,0,45)
        tex_ctx.translate(115,-110)
        tex_ctx.moveTo(0,-40)
        tex_ctx.bezierCurveTo(-35,0,-32,42,0,45)
        tex_ctx.moveTo(0,-40)
        tex_ctx.bezierCurveTo(35,0,32,42,0,45)
        tex_ctx.translate(105,106)
        tex_ctx.moveTo(0,-40)
        tex_ctx.bezierCurveTo(-35,0,-32,42,0,45)
        tex_ctx.moveTo(0,-40)
        tex_ctx.bezierCurveTo(35,0,32,42,0,45)
        tex_ctx.fill()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(214, 0, 0)'
        tex_ctx.fillRect(128,256,128,128)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(20,0,0)'
        tex_ctx.lineWidth=4
        tex_ctx.beginPath()
        tex_ctx.translate(128+128*0.5,256+128/2)
        tex_ctx.moveTo(0,-40)
        tex_ctx.bezierCurveTo(-35,0,-32,42,0,45)
        tex_ctx.moveTo(0,-40)
        tex_ctx.bezierCurveTo(35,0,32,42,0,45)
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(100,0,0)'
        tex_ctx.beginPath()
        tex_ctx.scale(0.6,0.6)
        tex_ctx.translate(0,20)
        tex_ctx.moveTo(0,-40)
        tex_ctx.bezierCurveTo(-35,0,-32,42,0,45)
        tex_ctx.moveTo(0,-40)
        tex_ctx.bezierCurveTo(35,0,32,42,0,45)
        tex_ctx.fill()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(130,130,130)'
        tex_ctx.fillRect(128*2,256,128,128)
        tex_ctx.strokeStyle='rgb(130,130,130)'
        tex_ctx.fillStyle='rgb(200,200,200)'
        tex_ctx.lineWidth=4
        tex_ctx.translate(128*2+128*0.5,256+128/2)
        tex_ctx.beginPath()
        tex_ctx.arc(0,0,30,0,6)
        tex_ctx.rect(-5,0,10,64)
        tex_ctx.rect(-10,-50,20,7)
        tex_ctx.rect(-3,-56,7,20)
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.moveTo(-20,-20)
        tex_ctx.lineTo(20,20)
        tex_ctx.moveTo(20,-20)
        tex_ctx.lineTo(-20,20)
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(47, 201, 75)'
        tex_ctx.fillRect(128*3,256,128,128)
        tex_ctx.fillStyle='rgb(22, 94, 25)'
        tex_ctx.translate(128*3+128*0.5,256+128/2)
        tex_ctx.beginPath()
        tex_ctx.rect(-44,4,32,30)
        tex_ctx.rect(-3,11,32,17)
        tex_ctx.rect(-33,-28,51,49)
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(255,255,255)'
        tex_ctx.fillRect(10,-35,15,15)
        tex_ctx.fillStyle='rgb(0,0,0)'
        tex_ctx.fillRect(19,-33,5,5)
        tex_ctx.rotate(-0.5)
        tex_ctx.fillStyle='rgb(255,40,40)'
        tex_ctx.fillRect(18,3,28,5)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(255,255,0)'
        tex_ctx.fillRect(128*4,256,128,128)
        tex_ctx.fillStyle='rgb(0,0,255)'
        tex_ctx.translate(128*4+128*0.5,256+128*0.5)
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,10)
        tex_ctx.bezierCurveTo(-36,-1,-36,-45,-9,-50)
        tex_ctx.moveTo(0,10)
        tex_ctx.bezierCurveTo(35,-1,21,-54,-9,-50)
        tex_ctx.fill()
        tex_ctx.strokeStyle='rgb(200,200,200)'
        tex_ctx.lineWidth=9
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,10)
        tex_ctx.bezierCurveTo(-11,22,-5,41,9,30)
        tex_ctx.bezierCurveTo(57,22,-5,61,9,51)
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(255,255,0)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-5,-38)
        tex_ctx.lineTo(8,-25)
        tex_ctx.lineTo(-17,-25)
        tex_ctx.rect(-9,-25,10,20)
        tex_ctx.fill()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(255,255,0)'
        tex_ctx.fillRect(128*5,256,128,128)
        tex_ctx.fillStyle='rgb(0,100,255)'
        tex_ctx.translate(128*5+128*0.5,256+128*0.5)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-40,35)
        tex_ctx.lineTo(36,18)
        tex_ctx.lineTo(20,-20)
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(10,255,100)'
        tex_ctx.beginPath()
        tex_ctx.arc(14,0,6,0,6)
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(190, 10, 255)'
        tex_ctx.beginPath()
        tex_ctx.arc(-1,12,5,0,6)
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(255, 190, 10)'
        tex_ctx.beginPath()
        tex_ctx.arc(-15,22,3,0,6)
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(10, 255, 239)'
        tex_ctx.beginPath()
        tex_ctx.arc(17,17,3,0,6)
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(222, 60, 95)'
        tex_ctx.fillRect(-32,-28,8,8)
        tex_ctx.fillStyle='rgb(37, 222, 145)'
        tex_ctx.fillRect(39,-49,8,8)
        tex_ctx.fillStyle='rgb(20, 102, 168)'
        tex_ctx.fillRect(39,-10,8,8)
        tex_ctx.fillStyle='rgb(255, 3, 3)'
        tex_ctx.fillRect(-6,-44,8,8)
        tex_ctx.fillStyle='rgb(216, 216, 232)'
        tex_ctx.fillRect(-35,-1,8,8)
        tex_ctx.fillStyle='rgb(173, 60, 181)'
        tex_ctx.fillRect(21,34,8,8)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(30,255,100)'
        tex_ctx.fillRect(128*6,256,128,128)
        tex_ctx.fillStyle='rgb(255,50,255)'
        tex_ctx.translate(128*6+128*0.5,256+128*0.5)
        tex_ctx.beginPath()
        tex_ctx.arc(0,0,21,0,6)
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.arc(-18,-18,13,0,6)
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.arc(-3,-18,8,0,6)
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.arc(20,-6,13,0,6)
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.arc(15,11,10,0,6)
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.arc(-9,14,15,0,6)
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.arc(17,-18,13,0,6)
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.arc(-24,-1,13,0,6)
        tex_ctx.fill()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(30,255,100)'
        tex_ctx.fillRect(128*7,256,128,128)
        tex_ctx.fillStyle='rgb(255,50,255)'
        tex_ctx.strokeStyle='rgb(255,50,255)'
        tex_ctx.lineWidth=3
        tex_ctx.translate(128*7+128*0.5,256+128*0.5)
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,0)
        tex_ctx.arc(0,20,22,0,7)
        tex_ctx.moveTo(-15,-10)
        tex_ctx.lineTo(-15,-47)
        tex_ctx.moveTo(0,-10)
        tex_ctx.lineTo(0,-58)
        tex_ctx.moveTo(15,-10)
        tex_ctx.lineTo(15,-47)
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fillRect(0,256+128,128,128)
        tex_ctx.fillStyle='rgb(255,150,0)'
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.translate(+128*0.5,256+128*1.5)
        tex_ctx.rotate(15*Math.PI/180)
        tex_ctx.lineWidth=5
        tex_ctx.strokeRect(-3,-37,10,20)
        tex_ctx.fillRect(-3,-37,10,20)
        tex_ctx.lineWidth=25
        tex_ctx.strokeRect(-9,-10,20,40)
        tex_ctx.strokeStyle='rgb(255,255,255)'
        tex_ctx.strokeRect(-7,-8,16,36)
        tex_ctx.fillStyle='rgb(255,50,255)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(11,-10)
        tex_ctx.lineTo(-11,-10)
        tex_ctx.lineTo(-11,25)
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(30,255,100)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(11,-10)
        tex_ctx.lineTo(11,25)
        tex_ctx.lineTo(-11,25)
        tex_ctx.fill()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fillRect(128,256+128,128,128)
        tex_ctx.fillStyle='rgb(0,0,0,0.3)'
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.translate(128+128*0.5,256+128*1.5+12)
        tex_ctx.scale(1.195,1.15)
        // tex_ctx.rotate(15*Math.PI/180)
        tex_ctx.lineWidth=3
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,20)
        tex_ctx.bezierCurveTo(-23,20,-20,0,-21,-2)
        tex_ctx.bezierCurveTo(-24,-24,-7,-14,-5,-37)
        tex_ctx.scale(-1,1)
        tex_ctx.moveTo(0,20)
        tex_ctx.bezierCurveTo(-23,20,-20,0,-21,-2)
        tex_ctx.bezierCurveTo(-24,-24,-7,-14,-5,-37)
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,20)
        tex_ctx.lineTo(-5,-37)
        tex_ctx.lineTo(5,-37)
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,20)
        tex_ctx.bezierCurveTo(-23,20,-20,0,-19,-2)
        tex_ctx.lineTo(19,-2)
        tex_ctx.bezierCurveTo(20,20,3,19,0,20)
        tex_ctx.fillStyle='rgb(225,225,150)'
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(100,55,0)'
        tex_ctx.lineWidth=5
        tex_ctx.strokeRect(-6,-45,12,7)
        tex_ctx.fillRect(-6,-45,12,7)
        tex_ctx.fillStyle='rgb(200,100,40)'
        tex_ctx.fillRect(-21,-9,40,7)
        tex_ctx.fillStyle='rgb(255,255,255)'
        tex_ctx.beginPath()
        tex_ctx.arc(0,-4,9,0,7)
        tex_ctx.fill()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fillRect(128*2,256+128,128,128)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.translate(128*2+128*0.5,256+128*1.5+12)
        tex_ctx.lineWidth=3
        tex_ctx.fillStyle='rgb(100,255,100)'
        tex_ctx.translate(-3,-13)
        tex_ctx.rotate(35)
        tex_ctx.beginPath()
        tex_ctx.translate(-25,0)
        tex_ctx.moveTo(-25,10)
        tex_ctx.bezierCurveTo(-25,-5,25,-5,25,10)
        tex_ctx.lineTo(25,17)
        tex_ctx.bezierCurveTo(25,35,-25,35,-25,17)
        tex_ctx.lineTo(-25,10)
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(255,255,80)'
        tex_ctx.rotate(-35)
        tex_ctx.beginPath()
        tex_ctx.translate(-34,-18)
        tex_ctx.moveTo(-25,10)
        tex_ctx.bezierCurveTo(-25,-5,25,-5,25,10)
        tex_ctx.lineTo(25,17)
        tex_ctx.bezierCurveTo(25,35,-25,35,-25,17)
        tex_ctx.lineTo(-25,10)
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(0,0,0,0.3)'
        tex_ctx.translate(20,11)
        tex_ctx.scale(0.6,0.4)
        tex_ctx.beginPath()
        tex_ctx.translate(-34,-18)
        tex_ctx.moveTo(-25,10)
        tex_ctx.bezierCurveTo(-25,-5,25,-5,25,10)
        tex_ctx.lineTo(25,17)
        tex_ctx.bezierCurveTo(25,35,-25,35,-25,17)
        tex_ctx.lineTo(-25,10)
        tex_ctx.fill()
        tex_ctx.translate(44,-32)
        tex_ctx.rotate(35.235)
        tex_ctx.beginPath()
        tex_ctx.translate(-34,-18)
        tex_ctx.moveTo(-25,10)
        tex_ctx.bezierCurveTo(-25,-5,25,-5,25,10)
        tex_ctx.lineTo(25,17)
        tex_ctx.bezierCurveTo(25,35,-25,35,-25,17)
        tex_ctx.lineTo(-25,10)
        tex_ctx.fill()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fillRect(128*3,256+128,128,128)
        tex_ctx.fillStyle='rgb(0,0,0,0.3)'
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.translate(128*3+128*0.5,256+128*1.5+12)
        tex_ctx.scale(1.195,1.15)
        // tex_ctx.rotate(15*Math.PI/180)
        tex_ctx.lineWidth=3
        tex_ctx.beginPath()
        tex_ctx.moveTo(1,26)
        tex_ctx.lineTo(-15,16)
        tex_ctx.lineTo(-1,-29)
        tex_ctx.lineTo(24,-23)
        tex_ctx.lineTo(19,21)
        tex_ctx.lineTo(1,26)
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(200,0,0)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(1,25)
        tex_ctx.lineTo(-13,16)
        tex_ctx.lineTo(-7,-5)
        tex_ctx.lineTo(21,2)
        tex_ctx.lineTo(18,21)
        tex_ctx.lineTo(1,25)
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(100,100,100)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-2,-31)
        tex_ctx.lineTo(1,-41)
        tex_ctx.lineTo(27,-35)
        tex_ctx.lineTo(26,-23)
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(0,0,0,0.3)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(1,25)
        tex_ctx.lineTo(15,-38)
        tex_ctx.lineTo(27,-34)
        tex_ctx.lineTo(21,2)
        tex_ctx.lineTo(18,21)
        tex_ctx.lineTo(1,25)
        tex_ctx.fill()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fillRect(128*4,256+128,128,128)
        tex_ctx.fillStyle='rgb(0,0,0,0.3)'
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.translate(128*4+128*0.5,256+128*1.5+12)
        tex_ctx.scale(1.195,1.15)
        // tex_ctx.rotate(15*Math.PI/180)
        tex_ctx.lineWidth=3
        tex_ctx.beginPath()
        tex_ctx.moveTo(1,26)
        tex_ctx.lineTo(-15,16)
        tex_ctx.lineTo(-1,-29)
        tex_ctx.lineTo(24,-23)
        tex_ctx.lineTo(19,21)
        tex_ctx.lineTo(1,26)
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(0,0,200)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(1,25)
        tex_ctx.lineTo(-13,16)
        tex_ctx.lineTo(-7,-5)
        tex_ctx.lineTo(21,2)
        tex_ctx.lineTo(18,21)
        tex_ctx.lineTo(1,25)
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(100,100,100)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-2,-31)
        tex_ctx.lineTo(1,-41)
        tex_ctx.lineTo(27,-35)
        tex_ctx.lineTo(26,-23)
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(0,0,0,0.3)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(1,25)
        tex_ctx.lineTo(15,-38)
        tex_ctx.lineTo(27,-34)
        tex_ctx.lineTo(21,2)
        tex_ctx.lineTo(18,21)
        tex_ctx.lineTo(1,25)
        tex_ctx.fill()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fillRect(128*5,256+128,128,128)
        tex_ctx.fillStyle='rgb(163, 90, 18)'
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.translate(128*5+128*0.5,256+128*1.5+12)
        tex_ctx.lineWidth=3
        tex_ctx.beginPath()
        tex_ctx.moveTo(-40,-5)
        tex_ctx.bezierCurveTo(-40,45,40,45,40,-5)
        tex_ctx.bezierCurveTo(40,-35,-40,-35,-40,-5)
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.lineWidth=1.75
        tex_ctx.fillStyle='rgb(255,255,200)'
        tex_ctx.translate(0,-2.5)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-32,-5)
        tex_ctx.bezierCurveTo(-32,15,32,15,32,-5)
        tex_ctx.bezierCurveTo(32,-25,-32,-25,-32,-5)
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(227, 82, 208)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(21,6)
        tex_ctx.lineTo(28,-45)
        tex_ctx.lineTo(45,-55)
        tex_ctx.lineTo(42,-59)
        tex_ctx.lineTo(23,-47)
        tex_ctx.lineTo(15,8)
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fillRect(128*6,256+128,128,128)
        tex_ctx.fillStyle='rgb(0,0,0,0.3)'
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.translate(128*6+128*0.5,256+128*1.5+12)
        tex_ctx.rotate(15*Math.PI/180)
        tex_ctx.lineWidth=3
        tex_ctx.beginPath()
        tex_ctx.moveTo(-25,22)
        tex_ctx.lineTo(25,22)
        tex_ctx.lineTo(5,-35)
        tex_ctx.lineTo(5,-50)
        tex_ctx.lineTo(-5,-50)
        tex_ctx.lineTo(-5,-35)
        tex_ctx.lineTo(-25,22)
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(200,0,200)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-24,21)
        tex_ctx.lineTo(24,21)
        tex_ctx.lineTo(14,-4)
        tex_ctx.lineTo(-14,-4)
        tex_ctx.fill()
        tex_ctx.lineWidth=3.5
        tex_ctx.fillStyle='rgb(94, 50, 13)'
        tex_ctx.strokeRect(-8,-56,15,8)
        tex_ctx.fillRect(-8,-56,15,8)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fillRect(128*7,256+128,128,128)
        let s=tex_ctx.createLinearGradient(0,-25,0,25)
        s.addColorStop(0,'rgb(0,0,0,0.3)')
        s.addColorStop(0.4,'rgb(0,0,0,0.3)')
        s.addColorStop(0.4,'rgb(255,0,50)')
        s.addColorStop(0.6,'rgb(255,0,50)')
        s.addColorStop(0.6,'rgb(50,255,50)')
        tex_ctx.fillStyle=s
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.translate(128*7+128*0.5-10,256+128*1.5+9)
        tex_ctx.lineWidth=3
        tex_ctx.beginPath()
        tex_ctx.moveTo(-20,30)
        tex_ctx.bezierCurveTo(-20,40,20,40,20,30)
        tex_ctx.bezierCurveTo(60,30,60,-30,20,-30)
        tex_ctx.bezierCurveTo(20,-40,-20,-40,-20,-30)
        tex_ctx.bezierCurveTo(-30,-30,-30,30,-20,30)
        tex_ctx.moveTo(-20,-30)
        tex_ctx.bezierCurveTo(-20,-20,20,-20,20,-30)
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.moveTo(25,20)
        tex_ctx.bezierCurveTo(50,20,50,-20,25,-20)
        tex_ctx.lineTo(25,20)
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.rotate(-0.4)
        s=tex_ctx.createLinearGradient(0,-52,0,-6)
        s.addColorStop(0,'rgb(255,0,0)')
        s.addColorStop(0.15,'rgb(255,0,0)')
        s.addColorStop(0.15,'rgb(255,255,255)')
        s.addColorStop(0.3,'rgb(255,255,255)')
        s.addColorStop(0.3,'rgb(255,0,0)')
        s.addColorStop(0.45,'rgb(255,0,0)')
        s.addColorStop(0.45,'rgb(255,255,255)')
        s.addColorStop(0.6,'rgb(255,255,255)')
        s.addColorStop(0.6,'rgb(255,0,0)')
        s.addColorStop(0.75,'rgb(255,0,0)')
        s.addColorStop(0.75,'rgb(255,255,255)')
        s.addColorStop(0.9,'rgb(255,255,255)')
        s.addColorStop(0.9,'rgb(255,0,0)')
        tex_ctx.fillStyle=s
        tex_ctx.fillRect(-3,-60,5,55)
        tex_ctx.rotate(0.4)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-20,-30)
        tex_ctx.bezierCurveTo(-20,-20,20,-20,20,-30)
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(255,0,50)'
        tex_ctx.beginPath()
        tex_ctx.arc(0,0,10,0,7)
        tex_ctx.fill()
        tex_ctx.strokeStyle='rgb(255,255,255)'
        tex_ctx.lineWidth=3
        tex_ctx.beginPath()
        tex_ctx.moveTo(2,-5)
        tex_ctx.bezierCurveTo(-4,-5,-4,0,0,0)
        tex_ctx.bezierCurveTo(2,0,2,5,-2,5)
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fillRect(128*0,256+256,128,128)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(138, 88, 18)'
        tex_ctx.translate(128*0+128*0.5,256+128*2.5+9)
        tex_ctx.scale(0.9*1.5,1.5)
        tex_ctx.lineWidth=3
        tex_ctx.beginPath()
        tex_ctx.moveTo(-30,2)
        tex_ctx.bezierCurveTo(-46,-23,-33,-30,-20,-15)
        tex_ctx.bezierCurveTo(-7,-38,-11,-38,9,-15)
        tex_ctx.bezierCurveTo(37,-36,32,-6,20,4)
        tex_ctx.bezierCurveTo(23,19,15,31,-7,12)
        tex_ctx.bezierCurveTo(-35,31,-29,12,-30,-5)
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.strokeStyle='rgb(255,255,255)'
        tex_ctx.lineWidth=3
        tex_ctx.beginPath()
        tex_ctx.moveTo(-12,-12)
        tex_ctx.lineTo(-10,-5)
        tex_ctx.moveTo(-2,-12)
        tex_ctx.lineTo(0,-5)
        tex_ctx.moveTo(-9,2)
        tex_ctx.lineTo(-2,5)
        tex_ctx.lineTo(4,1)
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fillRect(128*1,256+256,128,128)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(95, 49, 232)'
        tex_ctx.translate(128*1+128*0.5,256+128*2.5+9)
        tex_ctx.scale(0.9*1.5,1.5)
        tex_ctx.lineWidth=3
        tex_ctx.beginPath()
        tex_ctx.ellipse(0,0,30,25,-0.2,0,7)
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(78, 48, 171)'
        tex_ctx.beginPath()
        tex_ctx.ellipse(-3,-12,15,8,-0.2,0,7)
        tex_ctx.fill()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fillRect(128*2,256+256,128,128)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(255,0,25)'
        tex_ctx.translate(128*2+128*0.5,256+128*2.5+9)
        tex_ctx.scale(0.9*1.5,1.5)
        tex_ctx.lineWidth=3
        tex_ctx.beginPath()
        tex_ctx.moveTo(-20,-14)
        tex_ctx.lineTo(13,-20)
        tex_ctx.bezierCurveTo(28,-23,21,13,9,20)
        tex_ctx.bezierCurveTo(-54,-20,-4,-14,-20,-14)
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.strokeStyle='rgb(0,200,0)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-1,-17)
        tex_ctx.bezierCurveTo(-9,-28,-6,-29,-14,-31)
        tex_ctx.moveTo(-1,-17)
        tex_ctx.bezierCurveTo(2,-28,2,-29,-1,-33)
        tex_ctx.moveTo(-1,-17)
        tex_ctx.bezierCurveTo(12,-28,0,-29,10,-31)
        tex_ctx.moveTo(-1,-17)
        tex_ctx.bezierCurveTo(-9,-17,-6,-29,-20,-24)
        tex_ctx.stroke()
        tex_ctx.lineWidth=1.9
        tex_ctx.strokeStyle='rgb(250,170,100)'
        tex_ctx.beginPath()
        tex_ctx.arc(-11,-9,1,0,7)
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.arc(10,-9,1,0,7)
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.arc(15,-1,1,0,7)
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.arc(0,-6,1,0,7)
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.arc(2,3,1,0,7)
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.arc(10,11,1,0,7)
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(247, 204, 32)'
        tex_ctx.fillRect(128*3,256+256,128,128)
        tex_ctx.fillStyle='rgb(222, 186, 42)'
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.translate(128*3+128*0.5,256+128*2.5+9)
        tex_ctx.lineWidth=5
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,30)
        tex_ctx.bezierCurveTo(-36,31,-21,-5,-14,-12)
        tex_ctx.bezierCurveTo(10,-32,-19,-41,-9,-39)
        tex_ctx.bezierCurveTo(40,-17,18,31,0,30)
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(143, 0, 232)'
        tex_ctx.fillRect(128*4,256+256,128,128)
        tex_ctx.fillStyle='rgb(222, 186, 42)'
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.translate(128*4+128*0.5,256+128*2.5)
        tex_ctx.lineWidth=9
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-20)
        tex_ctx.lineTo(0,25)
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.ellipse(0,-7,30,20,0,3.5,5.9)
        tex_ctx.stroke()
        tex_ctx.strokeStyle='rgb(255,200,0)'
        tex_ctx.beginPath()
        tex_ctx.arc(0,0,56,0.2,Math.PI*0.5-0.2)
        tex_ctx.stroke()
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.beginPath()
        tex_ctx.arc(0,0,56,0.2,Math.PI*0.5-0.2)
        tex_ctx.stroke()
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.beginPath()
        tex_ctx.arc(0,0,56,0.2,Math.PI*0.5-0.2)
        tex_ctx.stroke()
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.beginPath()
        tex_ctx.arc(0,0,56,0.2,Math.PI*0.5-0.2)
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(143, 0, 232)'
        tex_ctx.fillRect(128*5,256+256,128,128)
        tex_ctx.fillStyle='rgb(222, 186, 42)'
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.translate(128*5+128*0.5,256+128*2.5)
        tex_ctx.lineWidth=9
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-20)
        tex_ctx.lineTo(0,25)
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.ellipse(0,-7,30,20,0,3.5,5.9)
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(143, 0, 232)'
        tex_ctx.fillRect(128*6,256+256,128,128)
        tex_ctx.fillStyle='rgb(222, 186, 42)'
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.translate(128*6+128*0.5,256+128*2.5)
        tex_ctx.lineWidth=9
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-20)
        tex_ctx.lineTo(0,25)
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.ellipse(0,-7,30,20,0,3.5,5.9)
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*6,256*2)
        tex_ctx.fillStyle='rgb(255, 149, 125)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.strokeStyle='rgb(255, 20, 0)'
        tex_ctx.fillStyle='rgb(255, 20, 0)'
        tex_ctx.lineWidth=6
        tex_ctx.translate(128/2,128/2)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-45,-30)
        tex_ctx.bezierCurveTo(-45,-40,-20,-40,-13,-23)
        tex_ctx.moveTo(-19,40)
        tex_ctx.bezierCurveTo(-34,7,32,8,32,40)
        tex_ctx.scale(-1,1)
        tex_ctx.moveTo(-45,-30)
        tex_ctx.bezierCurveTo(-45,-40,-20,-40,-13,-23)
        tex_ctx.stroke()
        tex_ctx.scale(-1,1)
        tex_ctx.beginPath()
        tex_ctx.ellipse(-24,-11,7,10,0,0,7)
        tex_ctx.ellipse(24,-11,7,10,0,0,7)
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(255, 149, 125)'
        tex_ctx.beginPath()
        tex_ctx.ellipse(-28,-5,2,4,0,0,7)
        tex_ctx.ellipse(21,-5,2,4,0,0,7)
        tex_ctx.fill()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*7,256*2)
        tex_ctx.fillStyle='rgb(200,200,200)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.strokeStyle='rgb(0, 0, 0)'
        s=tex_ctx.createLinearGradient(0,48,0,-39)
        s.addColorStop(0,'rgb(255,255,0)')
        s.addColorStop(1,'rgb(255,255,255)')
        tex_ctx.fillStyle=s
        tex_ctx.lineWidth=6
        tex_ctx.translate(128/2,128/2)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-40,-40)
        tex_ctx.lineTo(40,-40)
        tex_ctx.lineTo(0,40)
        tex_ctx.lineTo(-40,-40)
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(0,128*5)
        tex_ctx.fillStyle='rgb(166, 114, 30)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.strokeStyle='rgb(235, 208, 89)'
        tex_ctx.lineWidth=10
        tex_ctx.translate(128/2,128/2)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-50,-40)
        tex_ctx.bezierCurveTo(-28,0,20,-58,50,-40)
        tex_ctx.translate(0,30)
        tex_ctx.moveTo(-50,-40)
        tex_ctx.bezierCurveTo(-28,0,20,-58,50,-40)
        tex_ctx.translate(0,30)
        tex_ctx.moveTo(-50,-40)
        tex_ctx.bezierCurveTo(-28,0,20,-58,50,-40)
        tex_ctx.translate(0,-60)
        tex_ctx.stroke()
        tex_ctx.strokeStyle='rgb(255,255,255)'
        tex_ctx.beginPath()
        tex_ctx.lineWidth=8
        
        for(let i=0;i<10;i++){
            
            let x=(i*120410.12425+122.099)%1000,y=(i*42930.95050+628.852)%1000
            
            x*=0.001
            y*=0.001
            
            x-=0.5
            y-=0.5
            
            x*=120
            y*=120
            tex_ctx.moveTo(x-10,y+20)
            tex_ctx.lineTo(x-10,y+20)
        }
        
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillRect(128,256*2+128,128,128)
        tex_ctx.strokeStyle='rgb(255,255,255)'
        tex_ctx.fillStyle='rgb(122, 52, 2)'
        tex_ctx.lineWidth=4
        tex_ctx.beginPath()
        tex_ctx.translate(128+128/2,256*2.5+128/2)
        
        for(let i=0,_i=0;i<=Math.PI*2;i+=Math.PI*2/16,_i++){
            
            let r=_i%2===0?20:60
            tex_ctx.lineTo(Math.cos(i)*r,Math.sin(i)*r)
        }
        
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.arc(0,0,40,0,7)
        tex_ctx.fill()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fillRect(128*2,256+256*1.5,128,128)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(255,255,25)'
        tex_ctx.translate(128*2+128*0.5,256+128*3.5)
        tex_ctx.scale(1.2,1.3)
        tex_ctx.lineWidth=3
        tex_ctx.beginPath()
        tex_ctx.moveTo(-9,-25)
        tex_ctx.lineTo(15,-15)
        tex_ctx.lineTo(35,10)
        tex_ctx.bezierCurveTo(20,30,0,30,-6,29)
        tex_ctx.lineTo(-30,20)
        tex_ctx.lineTo(-9,-25)
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(0,0,0,0.1)'    
        tex_ctx.beginPath()
        tex_ctx.moveTo(15,-15)
        tex_ctx.lineTo(35,10)
        tex_ctx.bezierCurveTo(20,30,0,30,-6,29)
        tex_ctx.fill()
        tex_ctx.strokeStyle='rgb(0,0,0,0.2)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-3,-15)
        tex_ctx.lineTo(-7,-6)
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.moveTo(-13,24)
        tex_ctx.lineTo(-13+3,24-6)
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.moveTo(21,24)
        tex_ctx.lineTo(19,18)
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.moveTo(12,26)
        tex_ctx.lineTo(13,18)
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.moveTo(29,16)
        tex_ctx.lineTo(26,14)
        tex_ctx.stroke()
        tex_ctx.strokeStyle='rgb(255,255,255)'
        tex_ctx.lineWidth=5
        tex_ctx.beginPath()
        tex_ctx.moveTo(-8,-19)
        tex_ctx.lineTo(-18,1)
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fillRect(128*3,256+256*1.5,128,128)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(252,231,202)'
        tex_ctx.translate(128*3+128*0.5+16,256+128*3.5+10)
        tex_ctx.scale(1.5,1.6)
        tex_ctx.rotate(0.4)
        tex_ctx.lineWidth=3
        tex_ctx.beginPath()
        tex_ctx.moveTo(-9,-25)
        tex_ctx.bezierCurveTo(-33,-7,-38,19,-20,20)
        tex_ctx.bezierCurveTo(16,27,-4,-17,-9,-25)
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.lineWidth=3
        tex_ctx.beginPath()
        tex_ctx.strokeStyle='rgb(98,99,90)'
        tex_ctx.moveTo(-9,-25)
        tex_ctx.bezierCurveTo(-21,-7,-25,19,-20,20)
        tex_ctx.moveTo(-9,-25)
        tex_ctx.bezierCurveTo(-6,-7,-17,19,-20,20)
        tex_ctx.moveTo(-9,-25)
        tex_ctx.bezierCurveTo(-28,-7,-25,19,-20,20)
        tex_ctx.moveTo(-9,-25)
        tex_ctx.bezierCurveTo(-6,-7,6,19,-20,20)
        tex_ctx.moveTo(-9,-25)
        tex_ctx.bezierCurveTo(-33,-7,-31,19,-20,20)
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fillRect(128*4,256+256*1.5,128,128)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(255,255,0)'
        tex_ctx.translate(128*4+128*0.5,256+128*3.5)
        tex_ctx.lineWidth=5
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-30)
        tex_ctx.bezierCurveTo(-29,-32,-45,43,0,40)
        tex_ctx.moveTo(0,-30)
        tex_ctx.bezierCurveTo(29,-32,45,43,0,40)
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(0,0,0,0.7)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-28,0)
        tex_ctx.bezierCurveTo(-28,15,28,15,28,0)
        tex_ctx.lineTo(28,15)
        tex_ctx.bezierCurveTo(28,25,-28,25,-28,15)
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(0,0,0,0.15)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(20,-20)
        tex_ctx.bezierCurveTo(28,15,-28,27,-23,30)
        tex_ctx.bezierCurveTo(15,64,33,22,28,-3)
        tex_ctx.fill()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fillRect(128*5,256+256*1.5,128,128)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(220,220,220)'
        tex_ctx.translate(128*5+128*0.5,256+128*3.5)
        tex_ctx.lineWidth=5
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-30)
        tex_ctx.bezierCurveTo(-29,-32,-45,43,0,40)
        tex_ctx.moveTo(0,-30)
        tex_ctx.bezierCurveTo(29,-32,45,43,0,40)
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.strokeStyle='rgb(235,235,235)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-21,-12)
        tex_ctx.bezierCurveTo(-14,-11,2,-14,-3,-28)
        tex_ctx.moveTo(14,-19)
        tex_ctx.bezierCurveTo(6,6,-8,3,-24,0)
        tex_ctx.moveTo(24,1)
        tex_ctx.bezierCurveTo(6,27,-8,16,-25,15)
        tex_ctx.moveTo(22,20)
        tex_ctx.bezierCurveTo(6,36,-8,36,-20,30)
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(0,0,0,0.1)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(20,-20)
        tex_ctx.bezierCurveTo(36,46,-28,32,-23,30)
        tex_ctx.bezierCurveTo(15,64,33,22,28,-3)
        tex_ctx.fill()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fillRect(128*6,256+256*1.5,128,128)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(255,220,70)'
        tex_ctx.translate(128*6+128*0.5,256+128*3.5)
        tex_ctx.lineWidth=5
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-30)
        tex_ctx.bezierCurveTo(-29,-32,-45,43,0,40)
        tex_ctx.moveTo(0,-30)
        tex_ctx.bezierCurveTo(29,-32,45,43,0,40)
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.strokeStyle='rgb(235,205,0)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-21,-12)
        tex_ctx.bezierCurveTo(-14,-11,2,-14,-3,-28)
        tex_ctx.moveTo(14,-19)
        tex_ctx.bezierCurveTo(6,6,-8,3,-24,0)
        tex_ctx.moveTo(24,1)
        tex_ctx.bezierCurveTo(6,27,-8,16,-25,15)
        tex_ctx.moveTo(22,20)
        tex_ctx.bezierCurveTo(6,36,-8,36,-20,30)
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(0,0,0,0.1)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(20,-20)
        tex_ctx.bezierCurveTo(36,46,-28,32,-23,30)
        tex_ctx.bezierCurveTo(15,64,33,22,28,-3)
        tex_ctx.fill()
        tex_ctx.strokeStyle='white'
        function shinyCross(x,y,r,s){
            tex_ctx.translate(x,y)
            tex_ctx.rotate(r)
            tex_ctx.scale(s,s)
            tex_ctx.moveTo(-5,-25)
            tex_ctx.bezierCurveTo(-11,-25,-20,-15,-18,-10)
            tex_ctx.moveTo(-26,-25)
            tex_ctx.bezierCurveTo(-2,-25,-11,-15,-5,-12)
            tex_ctx.translate(-x,-y)
            tex_ctx.rotate(-r)
            tex_ctx.scale(1/s,1/s)
        }
        tex_ctx.beginPath()
        tex_ctx.moveTo(-5,-25)
        tex_ctx.bezierCurveTo(-11,-25,-20,-15,-18,-10)
        tex_ctx.stroke()
        tex_ctx.lineWidth='3'
        tex_ctx.beginPath()
        shinyCross(16,0,0,0.5)
        shinyCross(-20,0,10,0.5)
        shinyCross(20,40,1.5,0.6)
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fillRect(128*7,256+256*1.5,128,128)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(200,255,255)'
        tex_ctx.translate(128*7+128*0.5,256+128*3.5)
        tex_ctx.lineWidth=5
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-30)
        tex_ctx.bezierCurveTo(-29,-32,-45,43,0,40)
        tex_ctx.moveTo(0,-30)
        tex_ctx.bezierCurveTo(29,-32,45,43,0,40)
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(0,0,0,0.1)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(20,-20)
        tex_ctx.bezierCurveTo(36,46,-28,32,-23,30)
        tex_ctx.bezierCurveTo(15,64,33,22,28,-3)
        tex_ctx.fill()
        tex_ctx.strokeStyle='white'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-5,-25)
        tex_ctx.bezierCurveTo(-11,-25,-20,-15,-18,-10)
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(0,0,0,0.125)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-10)
        tex_ctx.bezierCurveTo(-10,-10,-10,20,0,20)
        tex_ctx.moveTo(0,-10)
        tex_ctx.bezierCurveTo(10,-10,10,20,0,20)
        tex_ctx.fill()
        tex_ctx.lineWidth='3'
        tex_ctx.beginPath()
        shinyCross(16,0,0,0.5)
        shinyCross(-20,0,10,0.5)
        shinyCross(26,36,102,0.5)
        shinyCross(-25,20,0,0.25)
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fillRect(128*0,256+256*2,128,128)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(163, 91, 218)'
        tex_ctx.translate(128*0+128*0.5,256+128*4.5)
        tex_ctx.lineWidth=5
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-30)
        tex_ctx.bezierCurveTo(-29,-32,-45,43,0,40)
        tex_ctx.moveTo(0,-30)
        tex_ctx.bezierCurveTo(29,-32,45,43,0,40)
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(0,0,0,0.7)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-28,0)
        tex_ctx.bezierCurveTo(-28,15,28,15,28,0)
        tex_ctx.lineTo(28,15)
        tex_ctx.bezierCurveTo(28,25,-28,25,-28,15)
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(0,0,0,0.15)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(20,-20)
        tex_ctx.bezierCurveTo(28,15,-28,27,-23,30)
        tex_ctx.bezierCurveTo(15,64,33,22,28,-3)
        tex_ctx.fill()
        tex_ctx.strokeStyle='rgb(255,255,255,0.5)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-5,-25)
        tex_ctx.bezierCurveTo(-11,-25,-20,-15,-18,-10)
        tex_ctx.stroke()
        tex_ctx.lineWidth='2'
        tex_ctx.strokeStyle='rgb(255,255,255)'
        tex_ctx.beginPath()
        shinyCross(16,0,0,0.2)
        shinyCross(-20,0,10,0.22)
        shinyCross(20,40,1.5,0.26)
        shinyCross(-28,-46,15,0.22)
        shinyCross(17,45,-1.5,0.21)
        shinyCross(-5,-30,1,0.2)
        shinyCross(25,-20,1.5,0.26)
        tex_ctx.stroke()
        tex_ctx.scale(1,0.8)
        tex_ctx.textAlign='center'
        tex_ctx.font='25px cursive'
        tex_ctx.lineWidth='6'
        tex_ctx.strokeStyle='black'
        tex_ctx.strokeText('M',4,44)
        tex_ctx.strokeStyle='white'
        tex_ctx.font='25px cursive'
        tex_ctx.fillStyle='white'
        tex_ctx.fillText('M',4,44)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(255,0,0)'
        tex_ctx.fillRect(128*1,256+256*2,128,128)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(163, 91, 218)'
        tex_ctx.translate(128*1+128*0.5,256+128*4.5)
        tex_ctx.beginPath()
        tex_ctx.moveTo(14,43)
        tex_ctx.lineTo(-29,14)
        tex_ctx.lineTo(0,-2)
        tex_ctx.lineTo(-25,-15)
        tex_ctx.bezierCurveTo(-52,-34,-15,-56,3,-35)
        tex_ctx.lineTo(32,-5)
        tex_ctx.lineTo(1,16)
        tex_ctx.lineTo(14,43)
        tex_ctx.strokeStyle='white'
        tex_ctx.lineWidth=10
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(0,0,255)'
        tex_ctx.fillRect(128*2,256+256*2,128,128)
        tex_ctx.strokeStyle='rgb(0,0,255)'
        tex_ctx.fillStyle='rgb(163, 91, 218)'
        tex_ctx.translate(128*2+128*0.5,256+128*4.5)
        tex_ctx.beginPath()
        tex_ctx.moveTo(14,43)
        tex_ctx.lineTo(-29,14)
        tex_ctx.lineTo(0,-2)
        tex_ctx.lineTo(-25,-15)
        tex_ctx.bezierCurveTo(-52,-34,-15,-56,3,-35)
        tex_ctx.lineTo(32,-5)
        tex_ctx.lineTo(1,16)
        tex_ctx.lineTo(14,43)
        tex_ctx.strokeStyle='white'
        tex_ctx.lineWidth=10
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(0,0,0)'
        tex_ctx.fillRect(128*3,256+256*2,128,128)
        tex_ctx.strokeStyle='rgb(255,0,0)'
        tex_ctx.fillStyle='rgb(163, 91, 218)'
        tex_ctx.translate(128*3+128*0.5,256+128*4.5)
        tex_ctx.beginPath()
        tex_ctx.arc(0,15,36,0,7)
        tex_ctx.rect(-20,-24,40,10)
        tex_ctx.fillStyle=tex_ctx.strokeStyle='red'
        tex_ctx.lineWidth=5
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-25)
        tex_ctx.bezierCurveTo(0,-50,23,-23,30,-44)
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.moveTo(10,-24)
        tex_ctx.bezierCurveTo(-20,0,23,28,-16,47)
        tex_ctx.bezierCurveTo(27,69,54,7,20,-15)
        tex_ctx.lineTo(20,-24)
        tex_ctx.fillStyle='white'
        tex_ctx.fill()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(0,0,0)'
        tex_ctx.fillRect(128*4,256+256*2,128,128)
        tex_ctx.strokeStyle='rgb(255,0,0)'
        tex_ctx.fillStyle='rgb(163, 91, 218)'
        tex_ctx.translate(128*4+128*0.5,256+128*4.5)
        tex_ctx.beginPath()
        tex_ctx.arc(0,15,36,0,7)
        tex_ctx.rect(-20,-24,40,10)
        tex_ctx.fillStyle=tex_ctx.strokeStyle='blue'
        tex_ctx.lineWidth=5
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-25)
        tex_ctx.bezierCurveTo(0,-50,23,-23,30,-44)
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.moveTo(10,-24)
        tex_ctx.bezierCurveTo(-20,0,23,28,-16,47)
        tex_ctx.bezierCurveTo(27,69,54,7,20,-15)
        tex_ctx.lineTo(20,-24)
        tex_ctx.fillStyle='white'
        tex_ctx.fill()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(0,0,0)'
        tex_ctx.fillRect(128*5,256+256*2,128,128)
        tex_ctx.strokeStyle='rgb(255,255,0)'
        tex_ctx.translate(128*5+128*0.5,256+128*4.5)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-34,-57)
        tex_ctx.lineTo(-34,24)
        tex_ctx.moveTo(-16,-57)
        tex_ctx.lineTo(-16,12)
        tex_ctx.moveTo(-1,-57)
        tex_ctx.lineTo(-1,21)
        tex_ctx.moveTo(16,-57)
        tex_ctx.lineTo(16,-3)
        tex_ctx.moveTo(34,-57)
        tex_ctx.lineTo(34,29)
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(150,150,200)'
        tex_ctx.fillRect(128*6,256+256*2,128,128)
        tex_ctx.strokeStyle='rgb(255,255,255)'
        tex_ctx.fillStyle='rgb(255,255,255)'
        tex_ctx.lineWidth=3
        tex_ctx.translate(128*6+128*0.5,256+128*4.5)
        tex_ctx.beginPath()
        tex_ctx.ellipse(0-5,-30+5,20,20,0,0,7)
        tex_ctx.ellipse(-20-5,-25+5,15,15,0,0,7)
        tex_ctx.ellipse(18-5,-40+5,15,15,0,0,7)
        tex_ctx.ellipse(25-5,-25+5,20,20,0,0,7)
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.translate(-19,6)
        tex_ctx.moveTo(0,0)
        tex_ctx.lineTo(-3,12)
        tex_ctx.translate(20,-3)
        tex_ctx.moveTo(0,0)
        tex_ctx.lineTo(-3,12)
        tex_ctx.translate(21,6)
        tex_ctx.moveTo(0,0)
        tex_ctx.lineTo(-3,12)
        tex_ctx.translate(-18,19)
        tex_ctx.moveTo(0,0)
        tex_ctx.lineTo(-3,12)
        tex_ctx.translate(-38,-2)
        tex_ctx.moveTo(0,0)
        tex_ctx.lineTo(-4,12)
        tex_ctx.translate(15,13)
        tex_ctx.moveTo(0,0)
        tex_ctx.lineTo(-3,12)
        tex_ctx.translate(35,6)
        tex_ctx.moveTo(0,0)
        tex_ctx.lineTo(-3,12)
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(150,150,200)'
        tex_ctx.fillRect(128*7,256+256*2,128,128)
        tex_ctx.strokeStyle='rgb(255,255,255)'
        tex_ctx.fillStyle='rgb(255,255,255)'
        tex_ctx.lineWidth=3
        tex_ctx.translate(128*7+128*0.5,256+128*4.5)
        function e(x,y,w,h){
            tex_ctx.beginPath()
            tex_ctx.ellipse(x,y,w,h,0,0,7)
            tex_ctx.fill()
        }
        for(let i=9;i>=0;i--){
            tex_ctx.fillStyle=i%2===0?'rgb(150,150,200)':'rgb(255,255,255)'
            e(Math.sin(i*0.5)*10,i*8-35,20+(8-i)*4,13)
        }
        
        tex_ctx.fillStyle='rgb(255,255,255)'
        e(0,-37,35,7)
        
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fillRect(128*0,256+256*2.5,128,128)
        tex_ctx.lineWidth=3
        tex_ctx.translate(128*0+128*0.5,256+128*5.5)
        let a=new Path2D('M 35 39 C 68 14 77 80 33 48')
        tex_ctx.fillStyle='rgb(251, 237, 255)'
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.translate(-59,-69)
        tex_ctx.scale(1.8*0.9,2.04*0.9)
        tex_ctx.fill(a)
        tex_ctx.fillStyle='rgb(204, 228, 255)'
        tex_ctx.translate(-25,29)
        tex_ctx.rotate(5.6)
        a=new Path2D('M 29 21 C 55 23 41 39 50 50C 53 68 33 51 37 54C 33 44 8 37 29 21')
        tex_ctx.stroke(a)
        tex_ctx.fill(a)
        tex_ctx.fillStyle='rgb(251, 237, 255)'
        tex_ctx.rotate(-5.6)
        tex_ctx.translate(18,-29)
        a=new Path2D('M 43 43 C 68 14 77 80 43 48')
        tex_ctx.fill(a)
        tex_ctx.setTransform(1,0,0,1,0,0)
        tex_ctx.fillStyle='rgb(247, 222, 111)'
        tex_ctx.translate(128*0+128*0.5,256+128*5.5)
        e(23,0,2,2)
        e(33,15,2,2)
        e(11,12,2,2)
        e(20,27,2,2)
        tex_ctx.fillStyle='rgb(225, 177, 242)'
        e(22,12,2,2)
        e(34,23,2,2)
        e(7,21,2,2)
        e(29,0,2,2)
        tex_ctx.strokeStyle='rgb(181, 139, 49)'
        tex_ctx.lineWidth=6
        tex_ctx.beginPath()
        tex_ctx.moveTo(4,-12)
        tex_ctx.bezierCurveTo(-6,-11,-9,29,-25,27)
        tex_ctx.stroke()
        tex_ctx.strokeStyle='rgb(250, 239, 142)'
        tex_ctx.lineWidth=8
        tex_ctx.beginPath()
        tex_ctx.moveTo(-20,-22)
        tex_ctx.bezierCurveTo(-46,-12,-31,6,-29,5)
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fillRect(128*1,256+256*2.5,128,128)
        tex_ctx.lineWidth=2
        tex_ctx.translate(128*1+128*0.5,256+128*5.5)
        a=new Path2D('M30 60C 26 25 64 25 60 60C55 67 35 67 30 60')
        tex_ctx.fillStyle='rgb(255,100,255)'
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.translate(-43,-74)
        tex_ctx.scale(1.3,1.3)
        tex_ctx.fill(a)
        tex_ctx.stroke(a)
        a=new Path2D('M30 60C 26 25 64 25 60 60C55 67 35 67 30 60')
        tex_ctx.fillStyle='rgb(0,255,100)'
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.translate(-21,10)
        tex_ctx.fillStyle='rgb(0,255,100)'
        tex_ctx.fill(a)
        tex_ctx.stroke(a)
        tex_ctx.fillStyle='rgb(255,255,255)'
        tex_ctx.setTransform(1,0,0,1,0,0)
        tex_ctx.translate(128*1+128*0.5,256+128*5.5)
        e(-3,0,2,2)
        e(-20,16,2,2)
        e(-5,13,2,2)
        e(-14,5,2,2)
        e(-17,-8,2,2)
        e(17,2,2,2)
        e(7,-18,2,2)
        e(23,-11,2,2)
        e(19,-21,2,2)
        e(28,0,2,2)
        e(9,-8,2,2)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fillRect(128*2,256+256*2.5,128,128)
        tex_ctx.lineWidth=3
        tex_ctx.translate(128*2+128*0.5,256+128*5.5)
        tex_ctx.fillStyle='rgb(160,80,20)'
        tex_ctx.strokeStyle='rgb(0,0,0)'
        e(0,0,30,30)
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(70,20,0)'
        e(19,-6,4,4)
        e(3,-20,4,4)
        e(1,-1,4,4)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fillRect(128*3,256+256*2.5,128,128)
        tex_ctx.lineWidth=2
        tex_ctx.translate(128*3+128*0.5,256+128*5.5)
        a=new Path2D('M30 20L50 50C 73 53 13 71 30 54z')
        tex_ctx.fillStyle='rgb(255,255,255)'
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.translate(-46,-59)
        tex_ctx.scale(1.4,1.4)
        tex_ctx.fill(a)
        tex_ctx.stroke(a)
        tex_ctx.lineWidth=1
        a=new Path2D('M 48 51 C 42 56 39 55 33 56')
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.stroke(a)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(252, 186, 3)'
        tex_ctx.fillRect(128*4,256+256*2.5,128,128)
        tex_ctx.lineWidth=4
        tex_ctx.translate(128*4+128*0.4,256+128*5.6)
        tex_ctx.fillStyle='rgb(17, 32, 43)'
        tex_ctx.beginPath()
        tex_ctx.ellipse(0,0,23,25,0.5,0,7)
        tex_ctx.translate(-7,10)
        tex_ctx.scale(1.2,1.2)
        tex_ctx.moveTo(-10,-36)
        tex_ctx.bezierCurveTo(-20,-47,-14,-55,-8,-64)
        tex_ctx.bezierCurveTo(-3,-51,2,-38,-10,-36)
        tex_ctx.rotate(0.5)
        tex_ctx.moveTo(-10,-36)
        tex_ctx.bezierCurveTo(-20,-47,-14,-55,-8,-64)
        tex_ctx.bezierCurveTo(-3,-51,2,-38,-10,-36)
        tex_ctx.rotate(0.5)
        tex_ctx.moveTo(-10,-36)
        tex_ctx.bezierCurveTo(-20,-47,-14,-55,-8,-64)
        tex_ctx.bezierCurveTo(-3,-51,2,-38,-10,-36)
        tex_ctx.rotate(0.5)
        tex_ctx.moveTo(-10,-36)
        tex_ctx.bezierCurveTo(-20,-47,-14,-55,-8,-64)
        tex_ctx.bezierCurveTo(-3,-51,2,-38,-10,-36)
        tex_ctx.fill()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(252, 186, 3)'
        tex_ctx.fillRect(128*5,256+256*2.5,128,128)
        tex_ctx.lineWidth=4
        tex_ctx.translate(128*5+128*0.5,256+128*5.5)
        tex_ctx.fillStyle='rgb(99, 73, 39)'
        tex_ctx.beginPath()
        tex_ctx.translate(-25,0)
        tex_ctx.moveTo(-8,-64)
        tex_ctx.bezierCurveTo(0,-30,0,-30,8,-64)
        tex_ctx.translate(25,0)
        tex_ctx.moveTo(-8,-64)
        tex_ctx.bezierCurveTo(0,-20,0,-20,8,-64)
        tex_ctx.translate(25,0)
        tex_ctx.moveTo(-8,-64)
        tex_ctx.bezierCurveTo(0,-30,0,-30,8,-64)
        tex_ctx.translate(-25,0)
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(17, 32, 43)'
        tex_ctx.strokeStyle='rgb(17, 32, 43)'
        tex_ctx.beginPath()
        tex_ctx.translate(-25,-10)
        tex_ctx.scale(1.2,1.5)
        tex_ctx.rotate(0.15)
        tex_ctx.moveTo(-10,0)
        tex_ctx.bezierCurveTo(-8,7,8,7,10,0)
        tex_ctx.bezierCurveTo(8,-7,-8,-7,-10,0)
        tex_ctx.setTransform(1,0,0,1,0,0)
        tex_ctx.translate(128*5+128*0.5,256+128*5.5)
        tex_ctx.translate(25,-10)
        tex_ctx.scale(1.2,1.5)
        tex_ctx.rotate(-0.15)
        tex_ctx.moveTo(-10,0)
        tex_ctx.bezierCurveTo(-8,7,8,7,10,0)
        tex_ctx.bezierCurveTo(8,-7,-8,-7,-10,0)
        tex_ctx.setTransform(1,0,0,1,0,0)
        tex_ctx.translate(128*5+128*0.5,256+128*5.5)
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.moveTo(-7,10)
        tex_ctx.bezierCurveTo(-5,13,5,13,7,10)
        tex_ctx.moveTo(0,13)
        tex_ctx.lineTo(0,22)
        tex_ctx.moveTo(-20,20)
        tex_ctx.bezierCurveTo(-10,28,-5,28,0,20)
        tex_ctx.moveTo(20,20)
        tex_ctx.bezierCurveTo(10,28,5,28,0,20)
        tex_ctx.moveTo(-31,14)
        tex_ctx.lineTo(-62,0)
        tex_ctx.moveTo(-31,22)
        tex_ctx.lineTo(-62,27)
        tex_ctx.moveTo(31,14)
        tex_ctx.lineTo(62,0)
        tex_ctx.moveTo(31,22)
        tex_ctx.lineTo(62,27)
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fillRect(128*6,256+256*2.5,128,128)
        tex_ctx.lineWidth=2
        tex_ctx.translate(128*6+128*0.5,256+128*5.5+14)
        a=new Path2D('M35 16C 66 23 45 50 24 50C 12 57 19 55 18 48C 9 15 27 15 35 16z')
        tex_ctx.fillStyle='rgb(179, 162, 34)'
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.translate(-46,-59)
        tex_ctx.scale(1.4,1.4)
        tex_ctx.fill(a)
        tex_ctx.stroke(a)
        tex_ctx.translate(6,2)
        a=new Path2D('M 35 12C 64 13 49 27 36 16C -2 11 38 3 36 12z')
        tex_ctx.fillStyle='rgb(129, 57, 82)'
        tex_ctx.fill(a)
        tex_ctx.stroke(a)
        tex_ctx.translate(-2,-1)
        a=new Path2D('M 37 13C 39 12 43 7 48 5C 50 12 48 7 43 13z')
        tex_ctx.fillStyle='rgb(129, 57, 82)'
        tex_ctx.fill(a)
        tex_ctx.stroke(a)
        tex_ctx.fillStyle='rgb(130, 87, 23,0.5)'
        e(38,27,1.5,1.5)
        e(36,35,1.5,1.5)
        e(29,41,1.5,1.5)
        e(30,32,1.5,1.5)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fillRect(128*7,256+256*2.5,128,128)
        tex_ctx.lineWidth=2.5
        tex_ctx.translate(128*7+128*0.5,256+128*5.5+5)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(88, 227, 88)'
        e(0,0,30,30)
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(225,255,225,0.5)'
        e(0,0,10,10)
        tex_ctx.lineWidth=1
        a=new Path2D('M 24 30C 28 12 41 22 40 20M 24 41C 24 49 37 50 36 48M 42 30C 47 28 46 43 39 43')
        tex_ctx.fillStyle='rgb(179, 162, 34)'
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.translate(-57,-48)
        tex_ctx.scale(1.7,1.4)
        tex_ctx.stroke(a)
        tex_ctx.lineWidth=2
        a=new Path2D('M 37 13C 39 12 43 7 42 5C 50 12 48 7 40 14')
        tex_ctx.fillStyle='rgb(138, 78, 18)'
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.translate(12,-2)
        tex_ctx.scale(1.4/1.7,1.4)
        tex_ctx.stroke(a)
        tex_ctx.fill(a)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(232, 232, 232)'
        tex_ctx.fillRect(128*0,128*8,128,128)
        tex_ctx.strokeStyle='rgb(0,0,0,0.8)'
        tex_ctx.fillStyle='rgb(255, 234, 117)'
        tex_ctx.lineWidth=4
        tex_ctx.translate(128*0,128*8)
        tex_ctx.beginPath()
        tex_ctx.arc(128/2,128/2,45,0,6)
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.translate(128/2,128/2)
        
        for(let i=0;i<Math.PI*2;i+=Math.PI*2/4){
            
            tex_ctx.moveTo(Math.sin(i+Math.PI*0.25)*45,Math.cos(i+Math.PI*0.25)*45)
            tex_ctx.lineTo(Math.sin(i+Math.PI*0.25)*-45,Math.cos(i+Math.PI*0.25)*-45)
        }
        
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.arc(0,0,25,0,6)
        tex_ctx.closePath()
        tex_ctx.fillStyle='rgb(143,0,236)'
        tex_ctx.fill()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(140, 227, 244)'
        tex_ctx.fillRect(128*1,128*8,128,128)
        tex_ctx.strokeStyle='rgb(50,50,50)'
        tex_ctx.fillStyle='rgb(240, 177, 226)'
        tex_ctx.lineWidth=6
        tex_ctx.translate(128*1+64,128*8+64)
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-28)
        tex_ctx.bezierCurveTo(15,-59,51,-37,44,-5)
        tex_ctx.bezierCurveTo(37,17,10,21,0,47)
        tex_ctx.bezierCurveTo(-18,4,-26,31,-39,-8)
        tex_ctx.bezierCurveTo(-44,-25,-24,-58,0,-28)
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(70,70,70)'
        e(-13,-14,4,4)
        e(15,-19,4,3.5)
        e(1,-12,2,2)
        tex_ctx.fillStyle='rgb(220,220,220)'
        tex_ctx.strokeStyle='rgb(70,70,70)'
        tex_ctx.lineWidth=3
        tex_ctx.beginPath()
        tex_ctx.moveTo(-6,0)
        tex_ctx.bezierCurveTo(2,5,9,-1,11,-3)
        tex_ctx.bezierCurveTo(9,13,-2,8,-6,0)
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(234, 34, 105)'
        e(-19,-2,6,3)
        e(25,-7,6,3)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(100,100,100)'
        tex_ctx.fillRect(128*2,128*8,128,128)
        tex_ctx.strokeStyle='rgb(255, 241, 43)'
        tex_ctx.fillStyle='rgb(255, 241, 43)'
        tex_ctx.lineWidth=6
        tex_ctx.translate(128*2+64,128*8+67)
        tex_ctx.beginPath()
        for(let i=0,_i=0;i<=Math.PI*2;i+=Math.PI*2/10,_i++){
            
            let r=_i%2===0?25:50,j=i+0.314159
            tex_ctx.lineTo(Math.cos(j)*r,Math.sin(j)*r)
        }
        
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fillRect(128*3,128*8,128,128)
        tex_ctx.fillStyle='rgb(0,0,0,0.3)'
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.translate(128*3+128*0.5,128*8+128*0.5)
        tex_ctx.scale(1.25,1.25)
        tex_ctx.lineWidth=2.5
        tex_ctx.fillStyle='rgb(94, 235, 214)'
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.beginPath()
        
        if(tex_ctx.roundRect){
            
            tex_ctx.roundRect(-22,-8,45,45,9)
            
        } else {
            
            tex_ctx.rect(-22,-6,45,45,0)
        }
        
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.font='29px Brush Script MT'
        tex_ctx.fillStyle='rgb(168, 50, 201)'
        tex_ctx.fillText('R',0,17)
        tex_ctx.fillStyle='rgb(245, 202, 12)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-19,-6)
        tex_ctx.lineTo(-20,-26)
        tex_ctx.lineTo(-10,-14)
        tex_ctx.lineTo(0,-27)
        tex_ctx.lineTo(10,-14)
        tex_ctx.lineTo(20,-26)
        tex_ctx.lineTo(19,-6)
        tex_ctx.closePath()
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(245, 229, 12)'
        tex_ctx.lineWidth=2
        e(-20,-23,4,4)
        tex_ctx.stroke()
        e(20,-23,4,4)
        tex_ctx.stroke()
        e(0,-27,5,5)
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fillRect(128*4,128*8,128,128)
        tex_ctx.fillStyle='rgb(0,0,0,0.3)'
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.translate(128*4+128*0.5,128*8+128*0.5)
        tex_ctx.scale(1.25,1.25)
        tex_ctx.lineWidth=2.5
        tex_ctx.fillStyle='rgb(94, 235, 214)'
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.beginPath()
        
        if(tex_ctx.roundRect){
            
            tex_ctx.roundRect(-22,-8,45,45,9)
            
        } else {
            
            tex_ctx.rect(-22,-6,45,45,0)
        }
        
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.font='29px Brush Script MT'
        tex_ctx.fillStyle='rgb(255, 255, 89)'
        tex_ctx.beginPath()
        for(let i=0,j=0;i<6.2831853;i+=6.2831853/10,j++){
            
            let r=j%2===0?6:14
            if(j===0){
                
                tex_ctx.moveTo(Math.cos(i+6.2831853/20)*r,Math.sin(i+6.2831853/20)*r+15)
            } else {
                
                tex_ctx.lineTo(Math.cos(i+6.2831853/20)*r,Math.sin(i+6.2831853/20)*r+15)
            }
        }
        tex_ctx.fill()
        tex_ctx.lineWidth=2
        tex_ctx.stroke()
        tex_ctx.lineWidth=2.5
        tex_ctx.fillStyle='rgb(245, 202, 12)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-19,-6)
        tex_ctx.lineTo(-20,-26)
        tex_ctx.lineTo(-10,-14)
        tex_ctx.lineTo(0,-27)
        tex_ctx.lineTo(10,-14)
        tex_ctx.lineTo(20,-26)
        tex_ctx.lineTo(19,-6)
        tex_ctx.closePath()
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(245, 229, 12)'
        tex_ctx.lineWidth=2
        e(-20,-23,4,4)
        tex_ctx.stroke()
        e(20,-23,4,4)
        tex_ctx.stroke()
        e(0,-27,5,5)
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fillRect(128*5,128*8,128,128)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(220,220,220)'
        tex_ctx.translate(128*5+128*0.5-2,128*8.5)
        tex_ctx.lineWidth=5
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-30)
        tex_ctx.bezierCurveTo(-29,-32,-45,43,0,40)
        tex_ctx.moveTo(0,-30)
        tex_ctx.bezierCurveTo(29,-32,45,43,0,40)
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.strokeStyle='rgb(235,235,235)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-21,-12)
        tex_ctx.bezierCurveTo(-14,-11,2,-14,-3,-28)
        tex_ctx.moveTo(14,-19)
        tex_ctx.bezierCurveTo(6,6,-8,3,-24,0)
        tex_ctx.moveTo(24,1)
        tex_ctx.bezierCurveTo(6,27,-8,16,-25,15)
        tex_ctx.moveTo(22,20)
        tex_ctx.bezierCurveTo(6,36,-8,36,-20,30)
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(0,0,0,0.1)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(20,-20)
        tex_ctx.bezierCurveTo(36,46,-28,32,-23,30)
        tex_ctx.bezierCurveTo(15,64,33,22,28,-3)
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(255, 255, 48)'
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.beginPath()
        for(let i=0,j=0;i<6.2831853;i+=6.2831853/10,j++){
            
            let r=j%2===0?9:18
            if(j===0){
                
                tex_ctx.moveTo(Math.cos(i+6.2831853/20)*r,Math.sin(i+6.2831853/20)*r+10)
            } else {
                
                tex_ctx.lineTo(Math.cos(i+6.2831853/20)*r,Math.sin(i+6.2831853/20)*r+10)
            }
        }
        tex_ctx.fill()
        tex_ctx.lineWidth=2
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fillRect(128*6,256+256*3,128,128)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(255,220,70)'
        tex_ctx.translate(128*6+128*0.5,256+128*6.5)
        tex_ctx.lineWidth=5
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-30)
        tex_ctx.bezierCurveTo(-29,-32,-45,43,0,40)
        tex_ctx.moveTo(0,-30)
        tex_ctx.bezierCurveTo(29,-32,45,43,0,40)
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.strokeStyle='rgb(235,205,0)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-21,-12)
        tex_ctx.bezierCurveTo(-14,-11,2,-14,-3,-28)
        tex_ctx.moveTo(14,-19)
        tex_ctx.bezierCurveTo(6,6,-8,3,-24,0)
        tex_ctx.moveTo(24,1)
        tex_ctx.bezierCurveTo(6,27,-8,16,-25,15)
        tex_ctx.moveTo(22,20)
        tex_ctx.bezierCurveTo(6,36,-8,36,-20,30)
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(0,0,0,0.1)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(20,-20)
        tex_ctx.bezierCurveTo(36,46,-28,32,-23,30)
        tex_ctx.bezierCurveTo(15,64,33,22,28,-3)
        tex_ctx.fill()
        tex_ctx.strokeStyle='white'
        function shinyCross(x,y,r,s){
            tex_ctx.translate(x,y)
            tex_ctx.rotate(r)
            tex_ctx.scale(s,s)
            tex_ctx.moveTo(-5,-25)
            tex_ctx.bezierCurveTo(-11,-25,-20,-15,-18,-10)
            tex_ctx.moveTo(-26,-25)
            tex_ctx.bezierCurveTo(-2,-25,-11,-15,-5,-12)
            tex_ctx.translate(-x,-y)
            tex_ctx.rotate(-r)
            tex_ctx.scale(1/s,1/s)
        }
        tex_ctx.beginPath()
        tex_ctx.moveTo(-5,-25)
        tex_ctx.bezierCurveTo(-11,-25,-20,-15,-18,-10)
        tex_ctx.stroke()
        tex_ctx.lineWidth='3'
        tex_ctx.beginPath()
        shinyCross(16,0,0,0.5)
        shinyCross(-20,0,10,0.5)
        shinyCross(20,40,1.5,0.6)
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(255, 255, 48)'
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.translate(-22,-20)
        tex_ctx.beginPath()
        for(let i=0,j=0;i<6.2831853;i+=6.2831853/10,j++){
            
            let r=j%2===0?9:18
            if(j===0){
                
                tex_ctx.moveTo(Math.cos(i+6.2831853/20)*r,Math.sin(i+6.2831853/20)*r+10)
            } else {
                
                tex_ctx.lineTo(Math.cos(i+6.2831853/20)*r,Math.sin(i+6.2831853/20)*r+10)
            }
        }
        tex_ctx.fill()
        tex_ctx.lineWidth=2
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fillRect(128*7,256+256*3,128,128)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(200,255,255)'
        tex_ctx.translate(128*7+128*0.5,256+128*6.5)
        tex_ctx.lineWidth=5
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-30)
        tex_ctx.bezierCurveTo(-29,-32,-45,43,0,40)
        tex_ctx.moveTo(0,-30)
        tex_ctx.bezierCurveTo(29,-32,45,43,0,40)
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(0,0,0,0.1)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(20,-20)
        tex_ctx.bezierCurveTo(36,46,-28,32,-23,30)
        tex_ctx.bezierCurveTo(15,64,33,22,28,-3)
        tex_ctx.fill()
        tex_ctx.strokeStyle='white'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-5,-25)
        tex_ctx.bezierCurveTo(-11,-25,-20,-15,-18,-10)
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(0,0,0,0.125)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-10)
        tex_ctx.bezierCurveTo(-10,-10,-10,20,0,20)
        tex_ctx.moveTo(0,-10)
        tex_ctx.bezierCurveTo(10,-10,10,20,0,20)
        tex_ctx.fill()
        tex_ctx.lineWidth='3'
        tex_ctx.beginPath()
        shinyCross(16,0,0,0.5)
        shinyCross(-20,0,10,0.5)
        shinyCross(26,36,102,0.5)
        shinyCross(-25,20,0,0.25)
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(255, 255, 48)'
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.translate(-3,-30)
        tex_ctx.beginPath()
        for(let i=0,j=0;i<6.2831853;i+=6.2831853/10,j++){
            
            let r=j%2===0?9:18
            if(j===0){
                
                tex_ctx.moveTo(Math.cos(i+6.2831853/20)*r,Math.sin(i+6.2831853/20)*r+10)
            } else {
                
                tex_ctx.lineTo(Math.cos(i+6.2831853/20)*r,Math.sin(i+6.2831853/20)*r+10)
            }
        }
        tex_ctx.fill()
        tex_ctx.lineWidth=2
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fillRect(128*0,256+256*3.5,128,128)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(163, 91, 218)'
        tex_ctx.translate(128*0+128*0.5,256+128*7.5)
        tex_ctx.lineWidth=5
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-30)
        tex_ctx.bezierCurveTo(-29,-32,-45,43,0,40)
        tex_ctx.moveTo(0,-30)
        tex_ctx.bezierCurveTo(29,-32,45,43,0,40)
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(0,0,0,0.7)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-28,0)
        tex_ctx.bezierCurveTo(-28,15,28,15,28,0)
        tex_ctx.lineTo(28,15)
        tex_ctx.bezierCurveTo(28,25,-28,25,-28,15)
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(0,0,0,0.15)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(20,-20)
        tex_ctx.bezierCurveTo(28,15,-28,27,-23,30)
        tex_ctx.bezierCurveTo(15,64,33,22,28,-3)
        tex_ctx.fill()
        tex_ctx.strokeStyle='rgb(255,255,255,0.5)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-5,-25)
        tex_ctx.bezierCurveTo(-11,-25,-20,-15,-18,-10)
        tex_ctx.stroke()
        tex_ctx.lineWidth='2'
        tex_ctx.strokeStyle='rgb(255,255,255)'
        tex_ctx.beginPath()
        shinyCross(16,0,0,0.2)
        shinyCross(-20,0,10,0.22)
        shinyCross(20,40,1.5,0.26)
        shinyCross(-28,-46,15,0.22)
        shinyCross(17,45,-1.5,0.21)
        shinyCross(-5,-30,1,0.2)
        shinyCross(25,-20,1.5,0.26)
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(255, 255, 48)'
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.translate(4,24)
        tex_ctx.beginPath()
        for(let i=0,j=0;i<6.2831853;i+=6.2831853/10,j++){
            
            let r=j%2===0?9:18
            if(j===0){
                
                tex_ctx.moveTo(Math.cos(i+6.2831853/20)*r,Math.sin(i+6.2831853/20)*r+10)
            } else {
                
                tex_ctx.lineTo(Math.cos(i+6.2831853/20)*r,Math.sin(i+6.2831853/20)*r+10)
            }
        }
        tex_ctx.fill()
        tex_ctx.lineWidth=2
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fillRect(128*1,256+256*3.5,128,128)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(250,250,250)'
        tex_ctx.translate(128*1+128*0.5,256+128*7.5)
        tex_ctx.lineWidth=5
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-30)
        tex_ctx.bezierCurveTo(-29,-32,-45,43,0,40)
        tex_ctx.moveTo(0,-30)
        tex_ctx.bezierCurveTo(29,-32,45,43,0,40)
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(0,0,0,0.15)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(20,-20)
        tex_ctx.bezierCurveTo(28,15,-28,27,-23,30)
        tex_ctx.bezierCurveTo(15,64,33,22,28,-3)
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(255, 255, 48)'
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.translate(1,0)
        tex_ctx.beginPath()
        for(let i=0,j=0;i<6.2831853;i+=6.2831853/10,j++){
            
            let r=j%2===0?9:18
            if(j===0){
                
                tex_ctx.moveTo(Math.cos(i+6.2831853/20)*r,Math.sin(i+6.2831853/20)*r+10)
            } else {
                
                tex_ctx.lineTo(Math.cos(i+6.2831853/20)*r,Math.sin(i+6.2831853/20)*r+10)
            }
        }
        tex_ctx.fill()
        tex_ctx.lineWidth=2
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fillRect(128*2,256+256*3.5,128,128)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(250,250,250)'
        tex_ctx.translate(128*2+128*0.5,256+128*7.5)
        tex_ctx.scale(1.7,1.7)
        tex_ctx.translate(-38,-36)
        a=new Path2D('M 54 54 C 48 64 23 58 23 52C 20 45 28 49 25 42C 23 40 27 32 29 33C 31 33 27 27 32 25C 45 21 25 23 47 25C 54 30 49 26 53 32C 48 39 57 34 52 42C 58 49 53 44 54 54')
        tex_ctx.strokeStyle='black'
        tex_ctx.lineWidth='3.5'
        tex_ctx.stroke(a)
        tex_ctx.fillStyle='#fbefb8'
        tex_ctx.fill(a)
        a=new Path2D('M 47 47 C 48 50 42 53 38 50M 32 49 C 26 52 43 53 37 50M 42 42 C 48 40 42 48 33 41M 39 35 C 41 40 34 39 33 34')
        tex_ctx.strokeStyle='rgb(0,0,0,0.3)'
        tex_ctx.lineWidth='2'
        tex_ctx.stroke(a)
        tex_ctx.fillStyle='rgb(0,0,0,0.3)'
        e(40,29,6,3)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.translate(0,-3)
        tex_ctx.lineWidth='6'
        a=new Path2D('M 36 20 C 32 19 42 22 40 30')
        tex_ctx.stroke(a)
        tex_ctx.strokeStyle='rgb(255,255,255)'
        tex_ctx.lineWidth='3'
        a=new Path2D('M 36 20 C 32 19 42 22 40 30')
        tex_ctx.stroke(a)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fillRect(128*1,256+256*3.5,128,128)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(250,250,250)'
        tex_ctx.translate(128*1+128*0.5,256+128*7.5)
        tex_ctx.lineWidth=5
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-30)
        tex_ctx.bezierCurveTo(-29,-32,-45,43,0,40)
        tex_ctx.moveTo(0,-30)
        tex_ctx.bezierCurveTo(29,-32,45,43,0,40)
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(0,0,0,0.15)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(20,-20)
        tex_ctx.bezierCurveTo(28,15,-28,27,-23,30)
        tex_ctx.bezierCurveTo(15,64,33,22,28,-3)
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(255, 255, 48)'
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.translate(1,0)
        tex_ctx.beginPath()
        for(let i=0,j=0;i<6.2831853;i+=6.2831853/10,j++){
            
            let r=j%2===0?9:18
            if(j===0){
                
                tex_ctx.moveTo(Math.cos(i+6.2831853/20)*r,Math.sin(i+6.2831853/20)*r+10)
            } else {
                
                tex_ctx.lineTo(Math.cos(i+6.2831853/20)*r,Math.sin(i+6.2831853/20)*r+10)
            }
        }
        tex_ctx.fill()
        tex_ctx.lineWidth=2
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fillRect(128*3,256+256*3.5,128,128)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(250,250,250)'
        tex_ctx.translate(128*3+128*0.5,256+128*7.5)
        tex_ctx.scale(1.65,1.65)
        tex_ctx.translate(-38,-34)
        tex_ctx.scale(0.9,0.9)
        tex_ctx.translate(4,4)
        a=new Path2D('M 56 54 L 49 58L 33 58L 25 54L 25 42L 28 35L 28 23L 38 15L 46 18L 52 24L 52 35L 56 47L 56 53')
        tex_ctx.strokeStyle='black'
        tex_ctx.lineWidth='3.5'
        tex_ctx.stroke(a)
        tex_ctx.fillStyle='#e26a3a'
        tex_ctx.fill(a)
        tex_ctx.translate(-4,-4)
        tex_ctx.scale(1/0.9,1/0.9)
        a=new Path2D('M 33 56 L 33 44M 46 48 L 46 33M 38 40 L 38 30')
        tex_ctx.strokeStyle='rgb(0,0,0,0.2)'
        tex_ctx.lineWidth='2'
        tex_ctx.stroke(a)
        tex_ctx.fillStyle='rgb(0,0,0,0.3)'
        e(40,24,7,3.5)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.translate(0,-8)
        tex_ctx.lineWidth='6'
        a=new Path2D('M 36 20 C 32 19 42 22 40 30')
        tex_ctx.stroke(a)
        tex_ctx.strokeStyle='rgb(255,255,255)'
        tex_ctx.lineWidth='3'
        a=new Path2D('M 36 20 C 32 19 42 22 40 30')
        tex_ctx.stroke(a)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fillRect(128*4,256+256*3.5,128,128)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(250,250,250)'
        tex_ctx.translate(128*4+128*0.5,256+128*7.5)
        tex_ctx.scale(1.65,1.65)
        tex_ctx.translate(-35,-34)
        tex_ctx.scale(0.9,0.9)
        tex_ctx.translate(4,4)
        a=new Path2D('M 54 54 C 48 64 23 58 23 52C 23 45 28 49 25 37C 23 31 28 28 27 26C 23 18 49 16 50 26C 48 36 54 31 53 40C 53 50 58 44 54 54')
        tex_ctx.strokeStyle='black'
        tex_ctx.lineWidth='3.5'
        tex_ctx.stroke(a)
        tex_ctx.fillStyle='#7cec88'
        tex_ctx.fill(a)
        tex_ctx.translate(-6,-2)
        tex_ctx.scale(1/0.9,1/0.9)
        tex_ctx.fillStyle='rgb(0,0,0,0.3)'
        e(40,24,7,3.5)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.translate(0,-8)
        tex_ctx.lineWidth='6'
        a=new Path2D('M 36 20 C 32 19 42 22 40 30')
        tex_ctx.stroke(a)
        tex_ctx.strokeStyle='rgb(255,255,255)'
        tex_ctx.lineWidth='3'
        a=new Path2D('M 36 20 C 32 19 42 22 40 30')
        tex_ctx.stroke(a)
        tex_ctx.fillStyle='rgb(205, 242, 41)'
        e(33,55,3,3)
        e(42,48,3,3)
        e(48,57,3,3)
        e(33,40,2,2)
        e(47,38,2,2)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fillRect(128*5,256+256*3.5,128,128)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(250,250,250)'
        tex_ctx.translate(128*5+128*0.5,256+128*7.5)
        tex_ctx.scale(1.55,1.55)
        tex_ctx.translate(-35,-35)
        a=new Path2D('M 54 54 C 31 64 23 58 24 52C 24 43 28 49 25 37C 23 31 28 28 27 26C 23 18 49 16 50 26C 48 36 54 31 51 40C 53 50 57 44 54 54')
        tex_ctx.strokeStyle='black'
        tex_ctx.lineWidth='3.5'
        tex_ctx.stroke(a)
        tex_ctx.fillStyle='rgb(255,255,120)'
        tex_ctx.fill(a)
        tex_ctx.fillStyle='rgb(0,0,0,0.3)'
        e(38,24,7,3.5)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.translate(-2,-8)
        tex_ctx.lineWidth='6'
        a=new Path2D('M 36 20 C 32 19 42 22 40 30')
        tex_ctx.stroke(a)
        tex_ctx.strokeStyle='rgb(255,255,255)'
        tex_ctx.lineWidth='3'
        a=new Path2D('M 36 20 C 32 19 42 22 40 30')
        tex_ctx.stroke(a)
        tex_ctx.fillStyle='rgb(205, 242, 41)'
        tex_ctx.translate(2,13)
        a=new Path2D('M 33 54 C 26 51 30 44 32 46C 40 48 31 51 33 50')
        tex_ctx.strokeStyle='rgb(0,0,0,0.3)'
        tex_ctx.lineWidth='2'
        tex_ctx.stroke(a)
        tex_ctx.scale(1.5,1.5)
        tex_ctx.translate(-26,41)
        tex_ctx.rotate(-1.3)
        a=new Path2D('M 33 54 C 26 51 30 44 32 46C 40 48 31 51 33 50')
        tex_ctx.strokeStyle='rgb(0,0,0,0.3)'
        tex_ctx.lineWidth='1.5'
        tex_ctx.stroke(a)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='#050407'
        tex_ctx.fillRect(128*6,256+256*3.5,128,128)
        tex_ctx.fillStyle='#c5fffd'
        tex_ctx.translate(128*6+128*0.5,256+128*7.5)
        tex_ctx.scale(0.75,1)
        tex_ctx.beginPath()
        tex_ctx.scale(2.3,2.3)
        tex_ctx.translate(2,-16)
        tex_ctx.moveTo(0,0)
        tex_ctx.lineTo(10,30)
        tex_ctx.bezierCurveTo(10,37,-10,37,-10,30)
        tex_ctx.scale(0.5,0.5)
        tex_ctx.translate(37,-11)
        tex_ctx.moveTo(0,0)
        tex_ctx.lineTo(10,30)
        tex_ctx.bezierCurveTo(10,37,-10,37,-10,30)
        tex_ctx.scale(1.5,1.5)
        tex_ctx.translate(-54,2)
        tex_ctx.moveTo(0,0)
        tex_ctx.lineTo(10,30)
        tex_ctx.bezierCurveTo(10,37,-10,37,-10,30)
        tex_ctx.fill()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(0,0,0)'
        tex_ctx.fillRect(128*7,256+256*3.5,128,128)
        tex_ctx.fillStyle='rgb(255, 0, 200)'
        tex_ctx.translate(128*7+128*0.5,256+128*7.5)
        tex_ctx.font='204px arial'
        tex_ctx.fillText('☺',0.5,-5)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(0,0,0)'
        tex_ctx.fillRect(128*0,256+256*4,128,128)
        tex_ctx.fillStyle='rgb(255, 0, 0)'
        tex_ctx.translate(128*0+128*0.5,256+128*8.5)
        tex_ctx.font='204px arial'
        tex_ctx.fillText('☺',0.5,-5)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(22, 2, 201)'
        tex_ctx.fillRect(128*1,256+256*4,128,128)
        tex_ctx.fillStyle='rgb(255, 0, 251)'
        tex_ctx.translate(128*1+128*0.5,256+128*8.5)
        tex_ctx.font='204px arial'
        tex_ctx.fillText('☺',0.5,-5)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(255,255,255)'
        tex_ctx.fillRect(128*2,256+256*4,128,128)
        tex_ctx.fillStyle='rgb(0,0,0)'
        tex_ctx.translate(128*2+128*0.5,256+128*8.5)
        tex_ctx.font='204px arial'
        tex_ctx.fillText('☺',0.5,-5)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fillRect(128*3,256+256*4,128,128)
        tex_ctx.translate(128*3+128*0.5,256+128*8.5)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.lineWidth=8
        tex_ctx.fillStyle='rgb(255, 200, 5)'
        tex_ctx.scale(1,0.6)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-30,-40)
        tex_ctx.bezierCurveTo(-32,-32,-32,-32,-40,-30)
        tex_ctx.lineTo(-40,30)
        tex_ctx.bezierCurveTo(-32,32,-32,32,-30,40)
        tex_ctx.lineTo(30,40)
        tex_ctx.bezierCurveTo(32,32,32,32,40,30)
        tex_ctx.lineTo(40,-30)
        tex_ctx.bezierCurveTo(32,-32,32,-32,30,-40)
        tex_ctx.lineTo(-30,-40)
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.strokeStyle='rgb(255,10,0)'
        tex_ctx.lineWidth=1
        function rect(x,y,w,h){tex_ctx.fillRect(x-w*0.5,y-h*0.5,w,h);tex_ctx.strokeRect(x-w*0.5,y-h*0.5,w,h)}
        rect(0,0,65,50)
        rect(0,0,50,50)
        tex_ctx.lineWidth=4
        tex_ctx.beginPath()
        tex_ctx.moveTo(-8,-4)
        tex_ctx.lineTo(-8,-15)
        tex_ctx.moveTo(8,-4)
        tex_ctx.lineTo(8,-15)
        tex_ctx.moveTo(-5,6)
        tex_ctx.lineTo(0,16)
        tex_ctx.lineTo(5,6)
        tex_ctx.stroke()
        tex_ctx.strokeStyle='rgb(100,100,100)'
        rect(-29,17,0.5,3)
        rect(-29,-17,0.5,3)
        rect(29,17,0.5,3)
        rect(29,-17,0.5,3)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fillRect(128*4,256+256*4,128,128)
        tex_ctx.translate(128*4+128*0.5,256+128*8.5)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.lineWidth=6
        tex_ctx.fillStyle='rgb(255, 255, 160)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-35,-25)
        tex_ctx.lineTo(25,-25)
        tex_ctx.lineTo(35,-15)
        tex_ctx.lineTo(35,15)
        tex_ctx.lineTo(25,25)
        tex_ctx.lineTo(-35,25)
        tex_ctx.lineTo(-35,-25)
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.strokeStyle='rgb(0,150,0)'
        tex_ctx.lineWidth=7
        tex_ctx.beginPath()
        tex_ctx.moveTo(-32,-22)
        tex_ctx.lineTo(-32,22)
        tex_ctx.moveTo(23,-22)
        tex_ctx.lineTo(32,-13)
        tex_ctx.lineTo(32,13)
        tex_ctx.lineTo(23,22)
        tex_ctx.moveTo(-14,-7)
        tex_ctx.lineTo(7,-7)
        tex_ctx.lineTo(2,-13)
        tex_ctx.lineTo(-9,-13)
        tex_ctx.lineTo(-14,-7)
        tex_ctx.stroke()
        tex_ctx.strokeStyle='rgb(50,50,50,0)'
        tex_ctx.fillStyle='rgb(50,50,50)'
        rect(-3,4,26,22)
        tex_ctx.fillStyle='rgb(255,40,40)'
        e(-9,0,3,3)
        e(5,0,3,3)
        tex_ctx.strokeStyle='rgb(50,50,50)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-11,-12)
        tex_ctx.lineTo(-16,-18)
        tex_ctx.moveTo(4,-12)
        tex_ctx.lineTo(9,-18)
        tex_ctx.lineWidth=3
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fillRect(128*5,256+256*4,128,128)
        tex_ctx.translate(128*5+128*0.5,256+128*8.5)
        tex_ctx.scale(1.6,1.5)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.lineWidth=1.75
        tex_ctx.fillStyle='rgb(250,250,250)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-30)
        tex_ctx.lineTo(20,-20)
        tex_ctx.lineTo(20,10)
        tex_ctx.lineTo(0,20)
        tex_ctx.lineTo(-20,10)
        tex_ctx.lineTo(-20,-20)
        tex_ctx.lineTo(0,-30)
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(0,0,0,0.075)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-10)
        tex_ctx.lineTo(-20,-20)
        tex_ctx.lineTo(-20,10)
        tex_ctx.lineTo(0,20)
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(0,0,0,0.2)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-10)
        tex_ctx.lineTo(20,-20)
        tex_ctx.lineTo(20,10)
        tex_ctx.lineTo(0,20)
        tex_ctx.fill()
        let matrix=tex_ctx.getTransform()
        tex_ctx.translate(1,-20)
        tex_ctx.rotate(0.76)
        tex_ctx.scale(0.7,0.9)
        tex_ctx.scale(0.7,0.7)
        tex_ctx.fillStyle='rgb(171, 90, 24)'
        tex_ctx.fillRect(-2,4,4,8)
        tex_ctx.fillStyle='rgb(0,150,0)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-10)
        tex_ctx.lineTo(5,-5)
        tex_ctx.lineTo(-5,-5)
        tex_ctx.moveTo(0,-7)
        tex_ctx.lineTo(8,1)
        tex_ctx.lineTo(-8,1)
        tex_ctx.moveTo(0,-1)
        tex_ctx.lineTo(10,7)
        tex_ctx.lineTo(-10,7)
        tex_ctx.fill()
        tex_ctx.setTransform(matrix)
        tex_ctx.translate(-9,-2)
        tex_ctx.rotate(0.2)
        tex_ctx.scale(0.6,0.8)
        tex_ctx.strokeStyle='rgb(0,150,0)'
        tex_ctx.lineWidth=2
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,0)
        tex_ctx.lineTo(-2,-3)
        tex_ctx.moveTo(0,0)
        tex_ctx.lineTo(5,-3)
        tex_ctx.moveTo(0,0)
        tex_ctx.lineTo(1,-6)
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(255,40,40)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,0)
        tex_ctx.bezierCurveTo(-11,-1,-8,5,0,13)
        tex_ctx.moveTo(0,0)
        tex_ctx.bezierCurveTo(11,-1,8,5,0,13)
        tex_ctx.fill()
        tex_ctx.setTransform(matrix)
        tex_ctx.translate(9,1)
        tex_ctx.rotate(-0.1)
        tex_ctx.scale(0.6,0.7)
        tex_ctx.fillStyle='rgb(0,85,255)'
        tex_ctx.beginPath()
        
        for(let i=0;i<Math.PI*2;i+=Math.PI*2/5){
            
            tex_ctx.rotate(Math.PI*2/5)
            tex_ctx.moveTo(-3,0)
            tex_ctx.bezierCurveTo(-7,-15,7,-15,3,0)
        }
        
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(255,255,20)'
        tex_ctx.beginPath()
        tex_ctx.ellipse(0,0,4,4,0,0,7)
        tex_ctx.fill()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fillRect(128*6,256+256*4,128,128)
        tex_ctx.translate(128*6+128*0.5,256+128*8.5)
        let matrix2=tex_ctx.getTransform()
        tex_ctx.translate(22,2)
        tex_ctx.rotate(-0.2)
        tex_ctx.scale(1.6,1.5)
        tex_ctx.scale(0.8,0.8)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.lineWidth=1.75
        tex_ctx.fillStyle='rgb(255,255,170)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-30)
        tex_ctx.lineTo(20,-20)
        tex_ctx.lineTo(20,10)
        tex_ctx.lineTo(0,20)
        tex_ctx.lineTo(-20,10)
        tex_ctx.lineTo(-20,-20)
        tex_ctx.lineTo(0,-30)
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(0,0,0,0.075)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-10)
        tex_ctx.lineTo(-20,-20)
        tex_ctx.lineTo(-20,10)
        tex_ctx.lineTo(0,20)
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(0,0,0,0.2)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-10)
        tex_ctx.lineTo(20,-20)
        tex_ctx.lineTo(20,10)
        tex_ctx.lineTo(0,20)
        tex_ctx.fill()
        matrix=tex_ctx.getTransform()
        tex_ctx.translate(1,-20)
        tex_ctx.rotate(0.76)
        tex_ctx.scale(0.7,0.9)
        tex_ctx.scale(0.7,0.7)
        tex_ctx.fillStyle='rgb(171, 90, 24)'
        tex_ctx.fillRect(-2,4,4,8)
        tex_ctx.fillStyle='rgb(0,150,0)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-10)
        tex_ctx.lineTo(5,-5)
        tex_ctx.lineTo(-5,-5)
        tex_ctx.moveTo(0,-7)
        tex_ctx.lineTo(8,1)
        tex_ctx.lineTo(-8,1)
        tex_ctx.moveTo(0,-1)
        tex_ctx.lineTo(10,7)
        tex_ctx.lineTo(-10,7)
        tex_ctx.fill()
        tex_ctx.setTransform(matrix)
        tex_ctx.translate(-9,-2)
        tex_ctx.rotate(0.2)
        tex_ctx.scale(0.6,0.8)
        tex_ctx.strokeStyle='rgb(0,150,0)'
        tex_ctx.lineWidth=2
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,0)
        tex_ctx.lineTo(-2,-3)
        tex_ctx.moveTo(0,0)
        tex_ctx.lineTo(5,-3)
        tex_ctx.moveTo(0,0)
        tex_ctx.lineTo(1,-6)
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(255,40,40)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,0)
        tex_ctx.bezierCurveTo(-11,-1,-8,5,0,13)
        tex_ctx.moveTo(0,0)
        tex_ctx.bezierCurveTo(11,-1,8,5,0,13)
        tex_ctx.fill()
        tex_ctx.setTransform(matrix)
        tex_ctx.translate(9,1)
        tex_ctx.rotate(-0.1)
        tex_ctx.scale(0.6,0.7)
        tex_ctx.fillStyle='rgb(0,85,255)'
        tex_ctx.beginPath()
        
        for(let i=0;i<Math.PI*2;i+=Math.PI*2/5){
            
            tex_ctx.rotate(Math.PI*2/5)
            tex_ctx.moveTo(-3,0)
            tex_ctx.bezierCurveTo(-7,-15,7,-15,3,0)
        }
        
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(255,255,20)'
        tex_ctx.beginPath()
        tex_ctx.ellipse(0,0,4,4,0,0,7)
        tex_ctx.fill()
        tex_ctx.setTransform(matrix2)
        tex_ctx.translate(-21,14)
        tex_ctx.rotate(0.1)
        tex_ctx.scale(1.6,1.5)
        tex_ctx.scale(0.8,0.8)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.lineWidth=1.75
        tex_ctx.fillStyle='rgb(186, 217, 255)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-30)
        tex_ctx.lineTo(20,-20)
        tex_ctx.lineTo(20,10)
        tex_ctx.lineTo(0,20)
        tex_ctx.lineTo(-20,10)
        tex_ctx.lineTo(-20,-20)
        tex_ctx.lineTo(0,-30)
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(0,0,0,0.075)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-10)
        tex_ctx.lineTo(-20,-20)
        tex_ctx.lineTo(-20,10)
        tex_ctx.lineTo(0,20)
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(0,0,0,0.2)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-10)
        tex_ctx.lineTo(20,-20)
        tex_ctx.lineTo(20,10)
        tex_ctx.lineTo(0,20)
        tex_ctx.fill()
        matrix=tex_ctx.getTransform()
        tex_ctx.translate(1,-20)
        tex_ctx.rotate(0.76)
        tex_ctx.scale(0.7,0.9)
        tex_ctx.scale(0.7,0.7)
        tex_ctx.fillStyle='rgb(171, 90, 24)'
        tex_ctx.fillRect(-2,4,4,8)
        tex_ctx.fillStyle='rgb(0,150,0)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-10)
        tex_ctx.lineTo(5,-5)
        tex_ctx.lineTo(-5,-5)
        tex_ctx.moveTo(0,-7)
        tex_ctx.lineTo(8,1)
        tex_ctx.lineTo(-8,1)
        tex_ctx.moveTo(0,-1)
        tex_ctx.lineTo(10,7)
        tex_ctx.lineTo(-10,7)
        tex_ctx.fill()
        tex_ctx.setTransform(matrix)
        tex_ctx.translate(-9,-2)
        tex_ctx.rotate(0.2)
        tex_ctx.scale(0.6,0.8)
        tex_ctx.strokeStyle='rgb(0,150,0)'
        tex_ctx.lineWidth=2
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,0)
        tex_ctx.lineTo(-2,-3)
        tex_ctx.moveTo(0,0)
        tex_ctx.lineTo(5,-3)
        tex_ctx.moveTo(0,0)
        tex_ctx.lineTo(1,-6)
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(255,40,40)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,0)
        tex_ctx.bezierCurveTo(-11,-1,-8,5,0,13)
        tex_ctx.moveTo(0,0)
        tex_ctx.bezierCurveTo(11,-1,8,5,0,13)
        tex_ctx.fill()
        tex_ctx.setTransform(matrix)
        tex_ctx.translate(9,1)
        tex_ctx.rotate(-0.1)
        tex_ctx.scale(0.6,0.7)
        tex_ctx.fillStyle='rgb(0,85,255)'
        tex_ctx.beginPath()
        
        for(let i=0;i<Math.PI*2;i+=Math.PI*2/5){
            
            tex_ctx.rotate(Math.PI*2/5)
            tex_ctx.moveTo(-3,0)
            tex_ctx.bezierCurveTo(-7,-15,7,-15,3,0)
        }
        
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(255,255,20)'
        tex_ctx.beginPath()
        tex_ctx.ellipse(0,0,4,4,0,0,7)
        tex_ctx.fill()
        tex_ctx.setTransform(matrix2)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fillRect(128*7,256+256*4,128,128)
        tex_ctx.translate(128*7+128*0.5,256+128*8.5)
        matrix2=tex_ctx.getTransform()
        tex_ctx.translate(24,-5)
        tex_ctx.rotate(-0.2)
        tex_ctx.scale(1.6,1.5)
        tex_ctx.scale(0.65,0.65)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.lineWidth=1.75
        tex_ctx.fillStyle='rgb(250,250,250)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-30)
        tex_ctx.lineTo(20,-20)
        tex_ctx.lineTo(20,10)
        tex_ctx.lineTo(0,20)
        tex_ctx.lineTo(-20,10)
        tex_ctx.lineTo(-20,-20)
        tex_ctx.lineTo(0,-30)
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(0,0,0,0.075)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-10)
        tex_ctx.lineTo(-20,-20)
        tex_ctx.lineTo(-20,10)
        tex_ctx.lineTo(0,20)
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(0,0,0,0.2)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-10)
        tex_ctx.lineTo(20,-20)
        tex_ctx.lineTo(20,10)
        tex_ctx.lineTo(0,20)
        tex_ctx.fill()
        matrix=tex_ctx.getTransform()
        tex_ctx.translate(1,-20)
        tex_ctx.rotate(0.76)
        tex_ctx.scale(0.7,0.9)
        tex_ctx.scale(0.7,0.7)
        tex_ctx.fillStyle='rgb(171, 90, 24)'
        tex_ctx.fillRect(-2,4,4,8)
        tex_ctx.fillStyle='rgb(0,150,0)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-10)
        tex_ctx.lineTo(5,-5)
        tex_ctx.lineTo(-5,-5)
        tex_ctx.moveTo(0,-7)
        tex_ctx.lineTo(8,1)
        tex_ctx.lineTo(-8,1)
        tex_ctx.moveTo(0,-1)
        tex_ctx.lineTo(10,7)
        tex_ctx.lineTo(-10,7)
        tex_ctx.fill()
        tex_ctx.setTransform(matrix)
        tex_ctx.translate(-9,-2)
        tex_ctx.rotate(0.2)
        tex_ctx.scale(0.6,0.8)
        tex_ctx.strokeStyle='rgb(0,150,0)'
        tex_ctx.lineWidth=2
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,0)
        tex_ctx.lineTo(-2,-3)
        tex_ctx.moveTo(0,0)
        tex_ctx.lineTo(5,-3)
        tex_ctx.moveTo(0,0)
        tex_ctx.lineTo(1,-6)
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(255,40,40)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,0)
        tex_ctx.bezierCurveTo(-11,-1,-8,5,0,13)
        tex_ctx.moveTo(0,0)
        tex_ctx.bezierCurveTo(11,-1,8,5,0,13)
        tex_ctx.fill()
        tex_ctx.setTransform(matrix)
        tex_ctx.translate(9,1)
        tex_ctx.rotate(-0.1)
        tex_ctx.scale(0.6,0.7)
        tex_ctx.fillStyle='rgb(0,85,255)'
        tex_ctx.beginPath()
        
        for(let i=0;i<Math.PI*2;i+=Math.PI*2/5){
            
            tex_ctx.rotate(Math.PI*2/5)
            tex_ctx.moveTo(-3,0)
            tex_ctx.bezierCurveTo(-7,-15,7,-15,3,0)
        }
        
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(255,255,20)'
        tex_ctx.beginPath()
        tex_ctx.ellipse(0,0,4,4,0,0,7)
        tex_ctx.fill()
        tex_ctx.setTransform(matrix2)
        tex_ctx.translate(-15,-1)
        tex_ctx.rotate(0.1)
        tex_ctx.scale(1.6,1.5)
        tex_ctx.scale(0.65,0.65)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.lineWidth=1.75
        tex_ctx.fillStyle='rgb(150,150,150)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-30)
        tex_ctx.lineTo(20,-20)
        tex_ctx.lineTo(20,10)
        tex_ctx.lineTo(0,20)
        tex_ctx.lineTo(-20,10)
        tex_ctx.lineTo(-20,-20)
        tex_ctx.lineTo(0,-30)
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(0,0,0,0.075)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-10)
        tex_ctx.lineTo(-20,-20)
        tex_ctx.lineTo(-20,10)
        tex_ctx.lineTo(0,20)
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(0,0,0,0.2)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-10)
        tex_ctx.lineTo(20,-20)
        tex_ctx.lineTo(20,10)
        tex_ctx.lineTo(0,20)
        tex_ctx.fill()
        matrix=tex_ctx.getTransform()
        tex_ctx.translate(1,-20)
        tex_ctx.rotate(0.76)
        tex_ctx.scale(0.7,0.9)
        tex_ctx.scale(0.7,0.7)
        tex_ctx.fillStyle='rgb(171, 90, 24)'
        tex_ctx.fillRect(-2,4,4,8)
        tex_ctx.fillStyle='rgb(0,150,0)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-10)
        tex_ctx.lineTo(5,-5)
        tex_ctx.lineTo(-5,-5)
        tex_ctx.moveTo(0,-7)
        tex_ctx.lineTo(8,1)
        tex_ctx.lineTo(-8,1)
        tex_ctx.moveTo(0,-1)
        tex_ctx.lineTo(10,7)
        tex_ctx.lineTo(-10,7)
        tex_ctx.fill()
        tex_ctx.setTransform(matrix)
        tex_ctx.translate(-9,-2)
        tex_ctx.rotate(0.2)
        tex_ctx.scale(0.6,0.8)
        tex_ctx.strokeStyle='rgb(0,150,0)'
        tex_ctx.lineWidth=2
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,0)
        tex_ctx.lineTo(-2,-3)
        tex_ctx.moveTo(0,0)
        tex_ctx.lineTo(5,-3)
        tex_ctx.moveTo(0,0)
        tex_ctx.lineTo(1,-6)
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(255,40,40)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,0)
        tex_ctx.bezierCurveTo(-11,-1,-8,5,0,13)
        tex_ctx.moveTo(0,0)
        tex_ctx.bezierCurveTo(11,-1,8,5,0,13)
        tex_ctx.fill()
        tex_ctx.setTransform(matrix)
        tex_ctx.translate(9,1)
        tex_ctx.rotate(-0.1)
        tex_ctx.scale(0.6,0.7)
        tex_ctx.fillStyle='rgb(0,85,255)'
        tex_ctx.beginPath()
        
        for(let i=0;i<Math.PI*2;i+=Math.PI*2/5){
            
            tex_ctx.rotate(Math.PI*2/5)
            tex_ctx.moveTo(-3,0)
            tex_ctx.bezierCurveTo(-7,-15,7,-15,3,0)
        }
        
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(255,255,20)'
        tex_ctx.beginPath()
        tex_ctx.ellipse(0,0,4,4,0,0,7)
        tex_ctx.fill()
        tex_ctx.setTransform(matrix2)
        tex_ctx.translate(10,14)
        tex_ctx.rotate(-0.15)
        tex_ctx.scale(1.6,1.5)
        tex_ctx.scale(0.675,0.675)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.lineWidth=1.75
        tex_ctx.fillStyle='rgb(30,30,30)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-30)
        tex_ctx.lineTo(20,-20)
        tex_ctx.lineTo(20,10)
        tex_ctx.lineTo(0,20)
        tex_ctx.lineTo(-20,10)
        tex_ctx.lineTo(-20,-20)
        tex_ctx.lineTo(0,-30)
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(0,0,0,0.075)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-10)
        tex_ctx.lineTo(-20,-20)
        tex_ctx.lineTo(-20,10)
        tex_ctx.lineTo(0,20)
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(0,0,0,0.2)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-10)
        tex_ctx.lineTo(20,-20)
        tex_ctx.lineTo(20,10)
        tex_ctx.lineTo(0,20)
        tex_ctx.fill()
        matrix=tex_ctx.getTransform()
        tex_ctx.translate(1,-20)
        tex_ctx.rotate(0.76)
        tex_ctx.scale(0.7,0.9)
        tex_ctx.scale(0.7,0.7)
        tex_ctx.fillStyle='rgb(171, 90, 24)'
        tex_ctx.fillRect(-2,4,4,8)
        tex_ctx.fillStyle='rgb(0,150,0)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-10)
        tex_ctx.lineTo(5,-5)
        tex_ctx.lineTo(-5,-5)
        tex_ctx.moveTo(0,-7)
        tex_ctx.lineTo(8,1)
        tex_ctx.lineTo(-8,1)
        tex_ctx.moveTo(0,-1)
        tex_ctx.lineTo(10,7)
        tex_ctx.lineTo(-10,7)
        tex_ctx.fill()
        tex_ctx.setTransform(matrix)
        tex_ctx.translate(-9,-2)
        tex_ctx.rotate(0.2)
        tex_ctx.scale(0.6,0.8)
        tex_ctx.strokeStyle='rgb(0,150,0)'
        tex_ctx.lineWidth=2
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,0)
        tex_ctx.lineTo(-2,-3)
        tex_ctx.moveTo(0,0)
        tex_ctx.lineTo(5,-3)
        tex_ctx.moveTo(0,0)
        tex_ctx.lineTo(1,-6)
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(255,40,40)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,0)
        tex_ctx.bezierCurveTo(-11,-1,-8,5,0,13)
        tex_ctx.moveTo(0,0)
        tex_ctx.bezierCurveTo(11,-1,8,5,0,13)
        tex_ctx.fill()
        tex_ctx.setTransform(matrix)
        tex_ctx.translate(9,1)
        tex_ctx.rotate(-0.1)
        tex_ctx.scale(0.6,0.7)
        tex_ctx.fillStyle='rgb(0,85,255)'
        tex_ctx.beginPath()
        
        for(let i=0;i<Math.PI*2;i+=Math.PI*2/5){
            
            tex_ctx.rotate(Math.PI*2/5)
            tex_ctx.moveTo(-3,0)
            tex_ctx.bezierCurveTo(-7,-15,7,-15,3,0)
        }
        
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(255,255,20)'
        tex_ctx.beginPath()
        tex_ctx.ellipse(0,0,4,4,0,0,7)
        tex_ctx.fill()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fillRect(128*0,256+256*4.5,128,128)
        tex_ctx.translate(128*0+128*0.5-36,256+128*9.5+16)
        tex_ctx.scale(0.825,0.825)
        tex_ctx.fillStyle='rgb(250,250,250)'
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.lineWidth=3.5
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-20)
        tex_ctx.bezierCurveTo(-10,-10,-10,10,0,20)
        tex_ctx.lineTo(15,20)
        tex_ctx.bezierCurveTo(5,10,5,-10,15,-20)
        tex_ctx.closePath()
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(220,220,220)'
        tex_ctx.lineWidth=1.5
        e(15,0,10,20)
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(0,240,0)'
        tex_ctx.lineWidth=3
        tex_ctx.scale(0.8,0.8)
        tex_ctx.translate(19,0)
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-20)
        tex_ctx.bezierCurveTo(-10,-10,-10,10,0,20)
        tex_ctx.translate(41,0)
        tex_ctx.lineTo(15,20)
        tex_ctx.bezierCurveTo(5,10,5,-10,15,-20)
        tex_ctx.closePath()
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.translate(15,0)
        tex_ctx.scale(1/0.8,1/0.8)
        tex_ctx.fillStyle='rgb(250,250,250)'
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.lineWidth=3
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-20)
        tex_ctx.bezierCurveTo(-10,-10,-10,10,0,20)
        tex_ctx.lineTo(15,20)
        tex_ctx.bezierCurveTo(5,10,5,-10,15,-20)
        tex_ctx.closePath()
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(220,220,220)'
        tex_ctx.lineWidth=2
        e(15,0,10,20)
        tex_ctx.stroke()
        tex_ctx.strokeStyle='rgb(90,90,90)'
        tex_ctx.lineWidth=5
        tex_ctx.beginPath()
        tex_ctx.moveTo(17,0)
        tex_ctx.lineTo(10,-45)
        tex_ctx.lineTo(-57,-45)
        tex_ctx.lineTo(-68,0)
        tex_ctx.stroke()
        tex_ctx.strokeStyle='rgb(0, 230, 255)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-57,-45)
        tex_ctx.lineTo(-57+5,-45-6)
        tex_ctx.lineTo(-57+10,-45+6)
        tex_ctx.lineTo(-57+15,-45-6)
        tex_ctx.lineTo(-57+20,-45+6)
        tex_ctx.lineTo(-57+25,-45-6)
        tex_ctx.lineTo(-57+30,-45+6)
        tex_ctx.lineTo(-57+35,-45-6)
        tex_ctx.lineTo(-57+40,-45+6)
        tex_ctx.lineTo(-57+45,-45-6)
        tex_ctx.lineTo(-57+50,-45+6)
        tex_ctx.lineTo(-57+55,-45-6)
        tex_ctx.lineTo(-57+60,-45+6)
        tex_ctx.lineTo(-57+65,-45-6)
        tex_ctx.lineTo(-57+70,-45)
        tex_ctx.stroke()
        tex_ctx.scale(0.4,0.4)
        tex_ctx.translate(-52,-106)
        tex_ctx.lineWidth=5
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(255,190,0)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,30)
        tex_ctx.bezierCurveTo(-36,31,-21,-5,-14,-12)
        tex_ctx.bezierCurveTo(10,-32,-19,-41,-9,-39)
        tex_ctx.bezierCurveTo(40,-17,18,31,0,30)
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fillRect(128*1,256+256*4.5,128,128)
        tex_ctx.translate(128*1+128*0.5+7,256+128*9.5+6)
        tex_ctx.scale(0.8,0.8)
        tex_ctx.strokeStyle='rgb(0,170,0)'
        tex_ctx.lineWidth=6
        tex_ctx.beginPath()
        tex_ctx.moveTo(20,30)
        tex_ctx.bezierCurveTo(18,5,13,-1,0,-10)
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(255,230,0)'
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.lineWidth=4
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-10)
        tex_ctx.bezierCurveTo(-18,0,-35,-9,-42,-20)
        tex_ctx.bezierCurveTo(-28,-26,-10,-25,0,-10)
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.rotate(0.5)
        tex_ctx.translate(-5,0)
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-10)
        tex_ctx.bezierCurveTo(-18,0,-35,-9,-42,-20)
        tex_ctx.bezierCurveTo(-28,-26,-10,-25,0,-10)
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.rotate(0.5)
        tex_ctx.translate(-5,0)
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-10)
        tex_ctx.bezierCurveTo(-18,0,-35,-9,-42,-20)
        tex_ctx.bezierCurveTo(-28,-26,-10,-25,0,-10)
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.strokeStyle='rgb(190,170,0)'
        tex_ctx.lineWidth=6
        tex_ctx.beginPath()
        tex_ctx.moveTo(-46,22)
        tex_ctx.bezierCurveTo(-32,23,-21,-2,-24,5)
        tex_ctx.moveTo(-52,-11)
        tex_ctx.bezierCurveTo(-54,-13,-21,-7,-24,5)
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fillRect(128*2,256+256*4.5,128,128)
        tex_ctx.translate(128*2+128*0.5+5,256+128*9.5)
        tex_ctx.strokeStyle='rgb(49, 133, 49)'
        tex_ctx.lineWidth=6
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,30)
        tex_ctx.bezierCurveTo(6,29,6,14,0,8)
        tex_ctx.stroke()
        tex_ctx.lineWidth=4
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(105, 67, 14)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,8)
        tex_ctx.bezierCurveTo(-60,-53,-36,14,0,8)
        tex_ctx.moveTo(0,8)
        tex_ctx.bezierCurveTo(11,-83,27,14,0,8)
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fillRect(128*3,256+256*4.5,128,128)
        tex_ctx.translate(128*3+128*0.5+-1,256+128*9.5+4)
        tex_ctx.scale(1.6,1.6)
        tex_ctx.rotate(-0.1)
        tex_ctx.translate(18,6)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(205, 212, 72)'
        tex_ctx.lineWidth=3
        a=new Path2D('M-15 -15 C -20 4 4 8 5 0C 9 -3 -8 -24 -15 -15')
        tex_ctx.stroke(a)
        tex_ctx.fill(a)
        tex_ctx.strokeStyle='rgb(255,255,255,0.7)'
        a=new Path2D('M-11 -7 C -15 -14 -5 -16 -8 -11M-5 0 C 1 1 4 0 0 -6')
        tex_ctx.stroke(a)
        tex_ctx.rotate(4.7)
        tex_ctx.translate(16,-17)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(255, 54, 54)'
        a=new Path2D('M-15 -15 C -20 4 4 8 5 0C 9 -3 -8 -24 -15 -15')
        tex_ctx.stroke(a)
        tex_ctx.fill(a)
        tex_ctx.strokeStyle='rgb(255,255,255,0.7)'
        a=new Path2D('M-11 -7 C -15 -14 -5 -16 -8 -11M-5 0 C 1 1 4 0 0 -6')
        tex_ctx.stroke(a)
        tex_ctx.rotate(1.4)
        tex_ctx.translate(5,23)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(56, 139, 255)'
        a=new Path2D('M-15 -15 C -20 4 4 8 5 0C 9 -3 -8 -24 -15 -15')
        tex_ctx.stroke(a)
        tex_ctx.fill(a)
        tex_ctx.strokeStyle='rgb(255,255,255,0.7)'
        a=new Path2D('M-11 -7 C -15 -14 -5 -16 -8 -11M-5 0 C 1 1 4 0 0 -6')
        tex_ctx.stroke(a)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(234,102,102)'
        tex_ctx.fillRect(128*4,256+256*4.5,128,128)
        tex_ctx.translate(128*4+128*0.5+-1,256+128*9.5+4)
        tex_ctx.scale(2.3,2.3)
        tex_ctx.translate(7,5)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(230, 32, 32)'
        a=new Path2D('M-15 -15 C -20 4 4 8 5 0C 9 -3 -8 -24 -15 -15')
        tex_ctx.stroke(a)
        tex_ctx.fill(a)
        tex_ctx.strokeStyle='rgb(255,255,255,0.3)'
        a=new Path2D('M-13 -7 C -15 -14 -9 -16 -8 -12M-5 0 C 1 1 4 0 0 -6')
        tex_ctx.stroke(a)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(234,102,102)'
        tex_ctx.fillRect(128*4,256+256*4.5,128,128)
        tex_ctx.translate(128*4+128*0.5+-1,256+128*9.5+4)
        tex_ctx.scale(2.3,2.3)
        tex_ctx.translate(7,5)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(230, 32, 32)'
        a=new Path2D('M-15 -15 C -20 4 4 8 5 0C 9 -3 -8 -24 -15 -15')
        tex_ctx.stroke(a)
        tex_ctx.fill(a)
        tex_ctx.strokeStyle='rgb(255,255,255,0.3)'
        a=new Path2D('M-13 -7 C -15 -14 -9 -16 -8 -12M-5 0 C 1 1 4 0 0 -6')
        tex_ctx.stroke(a)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(222,222,222)'
        tex_ctx.fillRect(128*5,256+256*4.5,128,128)
        tex_ctx.translate(128*5+128*0.5+-1,256+128*9.5+4)
        tex_ctx.scale(2.3,2.3)
        tex_ctx.translate(7,5)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(190,190,190)'
        a=new Path2D('M-15 -15 C -20 4 4 8 5 0C 9 -3 -8 -24 -15 -15')
        tex_ctx.stroke(a)
        tex_ctx.fill(a)
        tex_ctx.strokeStyle='rgb(255,255,255,0.3)'
        a=new Path2D('M-13 -7 C -15 -14 -9 -16 -8 -12M-5 0 C 1 1 4 0 0 -6')
        tex_ctx.stroke(a)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(222,222,222)'
        tex_ctx.fillRect(128*5,256+256*4.5,128,128)
        tex_ctx.translate(128*5+128*0.5+-1,256+128*9.5+4)
        tex_ctx.scale(2.3,2.3)
        tex_ctx.translate(7,5)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(190,190,190)'
        a=new Path2D('M-15 -15 C -20 4 4 8 5 0C 9 -3 -8 -24 -15 -15')
        tex_ctx.stroke(a)
        tex_ctx.fill(a)
        tex_ctx.strokeStyle='rgb(255,255,255,0.3)'
        a=new Path2D('M-13 -7 C -15 -14 -9 -16 -8 -12M-5 0 C 1 1 4 0 0 -6')
        tex_ctx.stroke(a)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(103, 174, 245)'
        tex_ctx.fillRect(128*6,256+256*4.5,128,128)
        tex_ctx.translate(128*6+128*0.5+-1,256+128*9.5+4)
        tex_ctx.scale(2.3,2.3)
        tex_ctx.translate(7,5)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(49, 82, 247)'
        a=new Path2D('M-15 -15 C -20 4 4 8 5 0C 9 -3 -8 -24 -15 -15')
        tex_ctx.stroke(a)
        tex_ctx.fill(a)
        tex_ctx.strokeStyle='rgb(255,255,255,0.3)'
        a=new Path2D('M-13 -7 C -15 -14 -9 -16 -8 -12M-5 0 C 1 1 4 0 0 -6')
        tex_ctx.stroke(a)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(255, 178, 238)'
        tex_ctx.fillRect(128*7,256+256*4.5,128,128)
        tex_ctx.translate(128*7+128*0.5+-1,256+128*9.5+4)
        tex_ctx.scale(2.3,2.3)
        tex_ctx.translate(7,5)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(227, 88, 195)'
        a=new Path2D('M-15 -15 C -20 4 4 8 5 0C 9 -3 -8 -24 -15 -15')
        tex_ctx.stroke(a)
        tex_ctx.fill(a)
        tex_ctx.strokeStyle='rgb(255,255,255,0.3)'
        a=new Path2D('M-13 -7 C -15 -14 -9 -16 -8 -12M-5 0 C 1 1 4 0 0 -6')
        tex_ctx.stroke(a)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(222, 144, 60)'
        tex_ctx.fillRect(128*0,256+256*5,128,128)
        tex_ctx.translate(128*0+128*0.5+-1,256+128*10.5+4)
        tex_ctx.scale(2.3,2.3)
        tex_ctx.translate(7,5)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(140, 83, 23)'
        a=new Path2D('M-15 -15 C -20 4 4 8 5 0C 9 -3 -8 -24 -15 -15')
        tex_ctx.stroke(a)
        tex_ctx.fill(a)
        tex_ctx.strokeStyle='rgb(255,255,255,0.3)'
        a=new Path2D('M-13 -7 C -15 -14 -9 -16 -8 -12M-5 0 C 1 1 4 0 0 -6')
        tex_ctx.stroke(a)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(118, 207, 93)'
        tex_ctx.fillRect(128*1,256+256*5,128,128)
        tex_ctx.translate(128*1+128*0.5+-1,256+128*10.5+4)
        tex_ctx.scale(2.3,2.3)
        tex_ctx.translate(7,5)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(48, 145, 19)'
        a=new Path2D('M-15 -15 C -20 4 4 8 5 0C 9 -3 -8 -24 -15 -15')
        tex_ctx.stroke(a)
        tex_ctx.fill(a)
        tex_ctx.strokeStyle='rgb(255,255,255,0.3)'
        a=new Path2D('M-13 -7 C -15 -14 -9 -16 -8 -12M-5 0 C 1 1 4 0 0 -6')
        tex_ctx.stroke(a)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(148, 148, 148)'
        tex_ctx.fillRect(128*2,256+256*5,128,128)
        tex_ctx.translate(128*2+128*0.5+-1,256+128*10.5+4)
        tex_ctx.scale(2.3,2.3)
        tex_ctx.translate(7,5)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(50,50,50)'
        a=new Path2D('M-15 -15 C -20 4 4 8 5 0C 9 -3 -8 -24 -15 -15')
        tex_ctx.stroke(a)
        tex_ctx.fill(a)
        tex_ctx.strokeStyle='rgb(255,255,255,0.3)'
        a=new Path2D('M-13 -7 C -15 -14 -9 -16 -8 -12M-5 0 C 1 1 4 0 0 -6')
        tex_ctx.stroke(a)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(245, 222, 108)'
        tex_ctx.fillRect(128*3,256+256*5,128,128)
        tex_ctx.translate(128*3+128*0.5+-1,256+128*10.5+4)
        tex_ctx.scale(2.3,2.3)
        tex_ctx.translate(7,5)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(255, 230, 0)'
        a=new Path2D('M-15 -15 C -20 4 4 8 5 0C 9 -3 -8 -24 -15 -15')
        tex_ctx.stroke(a)
        tex_ctx.fill(a)
        tex_ctx.strokeStyle='rgb(255,255,255,0.6)'
        a=new Path2D('M-13 -7 C -15 -14 -9 -16 -8 -12M-5 0 C 1 1 4 0 0 -6')
        tex_ctx.stroke(a)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fillRect(128*4,256+256*5,128,128)
        tex_ctx.translate(128*4+128*0.5+-1,256+128*10.5+4)
        tex_ctx.scale(-2.1,1.75)
        tex_ctx.translate(5,8)
        tex_ctx.lineWidth=3
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(40, 212, 71)'
        a=new Path2D('M-16 -11 C -15 -24 -18 -26 -14 -28C -5 -34 -1 -29 3 -21L -4 -24L 2 -19C -5 -15 -11 -19 -12 -21L -11 -10')
        tex_ctx.stroke(a)
        tex_ctx.fill(a)
        tex_ctx.translate(-1,5)
        a=new Path2D('M-15 -15 C -20 4 4 8 5 0C 8 -3 -1 -24 -15 -15')
        tex_ctx.stroke(a)
        tex_ctx.fill(a)
        tex_ctx.strokeStyle='rgb(255,255,255,0.6)'
        tex_ctx.fillStyle='rgb(255,255,255,0.6)'
        e(8,-11,2*0.75,2.5*0.75)
        e(-8,0,2*0.75,2.5*0.75)
        e(-17,-23,2*0.75,2.5*0.75)
        e(-3,-32,2*0.75,2.5*0.75)
        a=new Path2D('M-11 -7 C -15 -14 -5 -16 -8 -11M-5 0 C 1 1 4 0 0 -6')
        tex_ctx.stroke(a)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fillRect(128*5,256+256*5,128,128)
        tex_ctx.translate(128*5+128*0.5,256+128*10.5)
        tex_ctx.scale(1.6,1.6)
        tex_ctx.rotate(-0.1)
        tex_ctx.lineWidth=1.75
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(0,0,0,0.25)'
        a=new Path2D('M-10 -15L10 -15C10 -1 15 -14 15 15C15 25 -15 25 -15 15C-15 -15 -10 -1 -10 -15')
        tex_ctx.stroke(a)
        tex_ctx.fill(a)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(181, 120, 60)'
        tex_ctx.fillRect(-11,-20,22,6)
        tex_ctx.strokeRect(-11,-20,22,6)
        tex_ctx.translate(-3,8)
        tex_ctx.fillStyle='rgb(255,255,255)'
        e(0,0,5,5)
        tex_ctx.fillStyle='rgb(0,0,0,0.2)'
        e(0.5,1,4,4)
        tex_ctx.fillStyle='rgb(255,255,255)'
        e(-1,-1,3.5,3.5)
        tex_ctx.translate(7,-1)
        tex_ctx.fillStyle='rgb(255,255,255)'
        e(0,0,5,5)
        tex_ctx.fillStyle='rgb(0,0,0,0.2)'
        e(0.5,1,4,4)
        tex_ctx.fillStyle='rgb(255,255,255)'
        e(-1,-1,3.5,3.5)
        tex_ctx.translate(-7,-4)
        tex_ctx.scale(0.9,0.9)
        tex_ctx.fillStyle='rgb(255,255,255)'
        e(0,0,5,5)
        tex_ctx.fillStyle='rgb(0,0,0,0.2)'
        e(0.5,1,4,4)
        tex_ctx.fillStyle='rgb(255,255,255)'
        e(-1,-1,3.5,3.5)
        tex_ctx.translate(6,8)
        tex_ctx.fillStyle='rgb(255,255,255)'
        e(0,0,5,5)
        tex_ctx.fillStyle='rgb(0,0,0,0.2)'
        e(0.5,1,4,4)
        tex_ctx.fillStyle='rgb(255,255,255)'
        e(-1,-1,3.5,3.5)
        tex_ctx.translate(-1,-9)
        tex_ctx.fillStyle='rgb(255,255,255)'
        e(0,0,5,5)
        tex_ctx.fillStyle='rgb(0,0,0,0.2)'
        e(0.5,1,4,4)
        tex_ctx.fillStyle='rgb(255,255,255)'
        e(-1,-1,3.5,3.5)
        tex_ctx.translate(-2,-3)
        tex_ctx.lineWidth=2
        tex_ctx.strokeStyle='rgb(40, 74, 128)'
        a=new Path2D('M-12 -6C-12 -5 12 -5 12 -6M6 -6C 16 2 1 0 11 7')
        tex_ctx.stroke(a)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fillRect(128*6,256+256*5,128,128)
        tex_ctx.translate(128*6+128*0.5,256+128*10.5)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.lineWidth=6
        tex_ctx.fillStyle='rgb(255, 255, 160)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-35,-25)
        tex_ctx.lineTo(25,-25)
        tex_ctx.lineTo(35,-15)
        tex_ctx.lineTo(35,15)
        tex_ctx.lineTo(25,25)
        tex_ctx.lineTo(-35,25)
        tex_ctx.lineTo(-35,-25)
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.strokeStyle='rgb(130,160,130)'
        tex_ctx.fillStyle='rgb(130,160,130)'
        tex_ctx.lineWidth=7
        tex_ctx.beginPath()
        tex_ctx.moveTo(-32,-22)
        tex_ctx.lineTo(-32,22)
        tex_ctx.moveTo(23,-22)
        tex_ctx.lineTo(32,-13)
        tex_ctx.lineTo(32,13)
        tex_ctx.lineTo(23,22)
        tex_ctx.stroke()
        tex_ctx.scale(1.2,1.2)
        e(0,0,8,8)
        tex_ctx.fillRect(-3,-11,6,22)
        tex_ctx.rotate(Math.PI*0.25)
        tex_ctx.fillRect(-3,-11,6,22)
        tex_ctx.rotate(Math.PI*0.25)
        tex_ctx.fillRect(-3,-11,6,22)
        tex_ctx.rotate(Math.PI*0.25)
        tex_ctx.fillRect(-3,-11,6,22)
        tex_ctx.rotate(Math.PI*0.25)
        tex_ctx.fillStyle='rgb(255, 255, 160)'
        e(0,0,4,4)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(90, 255, 255)'
        tex_ctx.fillRect(128*7,256+256*5,128,128)
        tex_ctx.translate(128*7+128*0.5,256+128*10.5)
        tex_ctx.translate(-33,-26)
        tex_ctx.rotate(-0.4)
        tex_ctx.scale(2.25,2.25)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.lineWidth=2.5
        tex_ctx.fillStyle='rgb(255, 255, 160)'
        a=new Path2D('M 22 26C -7 39 -4 -3 19 8C 13 5 5 25 22 26')
        tex_ctx.stroke(a)
        tex_ctx.fill(a)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fillRect(128*0,256+256*5.5,128,128)
        tex_ctx.translate(128*0+128*0.5,256+128*11.5)
        tex_ctx.scale(1.6,1.6)
        tex_ctx.lineWidth=4
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(186, 128, 41)'
        tex_ctx.scale(0.9,1)
        a=new Path2D('M-10 -15L10 -15C 21 -9 19 -4 15 15C15 25 -15 25 -15 15C-19 -4 -21 -9 -10 -15')
        tex_ctx.stroke(a)
        tex_ctx.fill(a)
        tex_ctx.scale(1/0.9,1)
        tex_ctx.lineWidth=2
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(138, 138, 138)'
        tex_ctx.fillRect(-11,-24,22,8)
        tex_ctx.strokeRect(-11,-24,22,8)
        tex_ctx.lineWidth=5
        tex_ctx.strokeStyle='rgb(200,0,0)'
        a=new Path2D('M -15 0 C -10 3 10 3 15 0')
        tex_ctx.stroke(a)
        tex_ctx.lineWidth=3
        tex_ctx.strokeStyle='rgb(255,180,0)'
        a=new Path2D('M -5 -3 C -10 3 8 -8 5 -2M 0 -3 C 0 5 3 -2 -1 9')
        tex_ctx.stroke(a)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fillRect(128*1,256+256*5.5,128,128)
        tex_ctx.translate(128*1+128*0.5,256+128*11.5)
        tex_ctx.translate(-59,-52)
        tex_ctx.scale(1.4,1.4)
        tex_ctx.lineWidth=4
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(204, 163, 51)'
        a=new Path2D('M 26 40C 14 39 4 12 30 28C 35 1 45 12 50 26C 68 10 73 31 60 41C 67 58 51 74 41 52C 37 58 2 74 26 40')
        tex_ctx.stroke(a)
        tex_ctx.fill(a)
        tex_ctx.lineWidth=2
        tex_ctx.translate(41,24)
        tex_ctx.scale(0.9,0.9)
        tex_ctx.rotate(-0.075)
        tex_ctx.fillStyle='rgb(255, 212, 38)'
        a=new Path2D('M5.71,16.85L8.23,26.33L0.00,21.00L-8.23,26.33L-5.71,16.85L-13.31,10.67L-3.53,10.15L-0.00,1.00L3.53,10.15L13.31,10.67L5.71,16.85z')
        tex_ctx.stroke(a)
        tex_ctx.fill(a)
        tex_ctx.scale(1.2,1.2)
        tex_ctx.translate(-32,-22)
        tex_ctx.strokeStyle='rgb(230,230,100)'
        a=new Path2D('M 31 14L 32 21M 52 23L 46 28M 44 52L 42 45M 16 50L 22 43M 13 25L 19 29')
        tex_ctx.stroke(a)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fillRect(128*2,256+256*5.5,128,128)
        tex_ctx.translate(128*2+128*0.5,256+128*11.5)
        tex_ctx.translate(-59,-52)
        tex_ctx.scale(1.4,1.4)
        tex_ctx.lineWidth=4
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(123, 179, 88)'
        a=new Path2D('M 26 40C 14 39 4 12 30 28C 35 1 45 12 50 26C 68 10 73 31 60 41C 67 58 51 74 41 52C 37 58 2 74 26 40')
        tex_ctx.stroke(a)
        tex_ctx.fill(a)
        tex_ctx.strokeStyle='rgb(181, 33, 33)'
        tex_ctx.fillStyle='rgb(0,0,0,0)'
        tex_ctx.rotate(-0.1)
        tex_ctx.scale(1/1.3,1/1.3)
        tex_ctx.lineWidth=3
        tex_ctx.translate(50,55)
        e(0,0,17,7)
        tex_ctx.stroke()
        tex_ctx.rotate(60*(Math.PI/180))
        e(0,0,17,7)
        tex_ctx.stroke()
        tex_ctx.rotate(60*(Math.PI/180))
        e(0,0,17,7)
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(230,230,230)'
        e(-7,0,3,3)
        e(6,5,3,3)
        e(2,-10,3,3)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*3.5,256+256*5.75)
        tex_ctx.lineWidth=7
        tex_ctx.fillStyle='rgb(33, 35, 37)'
        tex_ctx.fillRect(-128*0.5,-128*0.5,128,128)
        tex_ctx.scale(0.95,0.95)
        tex_ctx.translate(0,-4)
        tex_ctx.fillStyle='rgb(123, 105, 65)'
        e(-13,-23,6,6)
        e(13,-23,6,6)
        tex_ctx.fillStyle='rgb(45, 50, 53)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-64,64)
        tex_ctx.lineTo(-64,20)
        tex_ctx.bezierCurveTo(-66,-49,-18,-56,-10,-1)
        tex_ctx.lineTo(-10,64)
        tex_ctx.moveTo(64,64)
        tex_ctx.lineTo(64,20)
        tex_ctx.bezierCurveTo(66,-49,18,-56,10,-1)
        tex_ctx.lineTo(10,64)
        tex_ctx.fill()
        g=tex_ctx.createLinearGradient(0,0,0,64)
        g.addColorStop(0,'rgb(33, 35, 37)')
        g.addColorStop(0.6,'rgb(123, 105, 65)')
        tex_ctx.fillStyle=g
        tex_ctx.beginPath()
        tex_ctx.moveTo(-11,-25)
        tex_ctx.bezierCurveTo(-11,49,-30,40,-11,64)
        tex_ctx.moveTo(11,-25)
        tex_ctx.bezierCurveTo(11,49,30,40,11,64)
        tex_ctx.fill()
        tex_ctx.fillRect(-12,-11,24,75)
        tex_ctx.fillStyle='rgb(45, 50, 53)'
        e(0,49,10,8)
        tex_ctx.fillStyle='rgb(33, 35, 37)'
        e(0,52,5,3)
        tex_ctx.fillStyle='rgb(20,20,20)'
        e(-19,-13,5,9)
        e(19,-13,5,9)
        tex_ctx.fillStyle='rgb(45, 50, 53)'
        e(16,-16,2,3)
        e(-22,-16,2,3)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(235,255,50)'
        tex_ctx.translate(128*4,256+256*5.5)
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.translate(128/2,128/2)
        tex_ctx.strokeStyle='white'
        tex_ctx.lineWidth=7
        tex_ctx.beginPath()
        tex_ctx.moveTo(-60,-20)
        tex_ctx.bezierCurveTo(0,-64,0,0,60,-60)
        tex_ctx.moveTo(-60,44)
        tex_ctx.bezierCurveTo(0,-5,13,46,60,33)
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        function ellipse(x,y,w,h,r=0){
            tex_ctx.beginPath()
            tex_ctx.ellipse(x,y,w,h,r,0,6)
            tex_ctx.fill()
        }
        tex_ctx.fillStyle='#FFE089'
        tex_ctx.translate(128*5,256+256*5.5)
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.translate(7+128/2,128/2)
        tex_ctx.scale(0.95,0.95)
        tex_ctx.lineWidth=7
        tex_ctx.fillStyle='#FFE089'
        tex_ctx.fillStyle='rgb(209, 167, 113)'
        tex_ctx.strokeStyle='rgb(209, 167, 113)'
        ellipse(-42,0-5,22,22)
        ellipse(-33,-8-5,20,20)
        ellipse(-27,-16-5,20,20)
        ellipse(-35,-9-5,24,24)
        tex_ctx.lineWidth=7
        tex_ctx.beginPath()
        tex_ctx.moveTo(13,-40)
        tex_ctx.bezierCurveTo(15,-42,29,-43,32,-35)
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(50,50,50)'
        tex_ctx.strokeStyle='rgb(50,50,50)'
        ellipse(-19,-19,6,7)
        ellipse(19,-19,6,7)
        tex_ctx.lineWidth=4
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,25+3)
        tex_ctx.bezierCurveTo(5,33,20,33,20,19+5)
        tex_ctx.moveTo(0,25+3)
        tex_ctx.bezierCurveTo(-5,33,-20,33,-20,19+5)
        tex_ctx.stroke()
        tex_ctx.lineWidth=5
        tex_ctx.beginPath()
        tex_ctx.moveTo(-5,3)
        tex_ctx.bezierCurveTo(-3,7,3,7,5,3)
        tex_ctx.closePath()
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*6,256+256*5.5)
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.scale(128/30,128/30)
        canvg(tex_ctx.canvas,"<svg><rect fill='rgb(0,255,0)' x='0' y='0' width='30' height='30'></rect><g transform='translate(4,3) scale(1,1)' fill='rgb(180,0,0)'><path d='M21.426,10.665l-1.062-0.25c1.281-2.281-0.222-3.743-1.687-4C16.039,5.953,14,7.71,11.993,7.682 c0.621-0.35,1.328-1.127,1.88-2.144c0.889-1.631,1.047-3.258,0.354-3.635c-0.606-0.331-1.666,0.41-2.516,1.695 c-0.055-0.164-0.104-0.327-0.173-0.492C10.616,0.91,8.81-0.425,7.503,0.124C6.199,0.672,5.889,2.896,6.812,5.093 c0.47,1.117,1.168,2.006,1.912,2.543C6.998,6.931,5.362,5.413,3.504,5.705C1.582,6.008,1.362,8.883,0.551,8.758l0.438,2.375 c1.812,0.03,1.875-3.032,3.688-3.25c2.526-0.305,4.315,1.04,5.906,0.315c0.227-0.103,0.387-0.17,0.467-0.221 c0.041,0,0.074,0.004,0.116,0.002c0.604,0.716,4.229-0.659,6.67-0.031c1.207,0.31,0.857,2.559,0.652,3.747L21.426,10.665z M10.621,7.537c-0.098,0.041-0.201,0.063-0.306,0.072c-0.006,0.001-0.013,0.002-0.019,0.004C9.513,7.665,8.57,6.864,8.058,5.644 c-0.586-1.395-0.389-2.808,0.44-3.156c0.829-0.348,1.977,0.499,2.563,1.895c0.034,0.081,0.056,0.16,0.084,0.241 c-0.544,1.173-0.697,2.272-0.418,2.847C10.69,7.491,10.661,7.52,10.621,7.537z M11.044,7.185c-0.175-0.375-0.068-1.092,0.294-1.85 C11.47,6.092,11.361,6.768,11.044,7.185z M11.587,7.434c0.473-0.706,0.597-1.824,0.341-3.046c0.484-0.596,1.017-0.908,1.343-0.729 c0.439,0.239,0.34,1.273-0.225,2.309C12.613,6.764,12.033,7.325,11.587,7.434z'/><rect x='6.519' y='13.446' width='2.438' height='8.531'/><rect x='4.957' y='13.446' width='1' height='8.531'/><rect x='9.519' y='13.446' width='2.875' height='8.531'/><rect x='15.957' y='13.446' width='1' height='8.531'/><rect x='12.957' y='13.446' width='2.438' height='8.531'/><rect x='4.457' y='8.977' width='13' height='4'/></g></svg>")
        tex_ctx.setTransform(1,0,0,1,0,0)
    
        tex_ctx.translate(128*7,256+256*5.5)
        tex_ctx.fillRect(0,0,128,128)
        canvg(tex_ctx.canvas,"<svg><rect fill='rgb(0,255,0)' x='0' y='0' width='128' height='128'></rect><g transform='translate(65,48) scale(2.5,2.5)'><path fill='rgb(255,0,0)' stroke='rgb(0,0,0)' stroke-width='1.5' d='M0 -13L15 -5L16 18L0 26L-16 18L-16 -5z'></path> <path fill='rgb(255,210,50)' d='M -7 -8L-3 -11L 11 -3L 12 19L 8 21L 7 0'></path> <path fill='rgb(255,210,50)' d='M 7 -8L3 -11L-11 -3L-12 19L-8 21L-7 0'></path> <path fill='rgb(0,0,0,0.2)' d='M15 -5L16 18L0 26L0 1'></path> <path fill='rgb(0,0,0,0.4)' d='M-15 -5L-16 18L0 26L0 1'></path> <g transform='translate(0,-8) scale(0.8,0.4)'> <g transform='rotate(0)'> <path stroke='rgb(255,230,20)' stroke-width='6' stroke-linecap='round' d='M0 3L0 10M0 -2L0 -10'></path> <path stroke='rgb(255,255,200)' stroke-width='2' stroke-linecap='round' d='M0 2L0 10M0 -3L0 -10'></path> </g> <g transform='rotate(45)'> <path stroke='rgb(255,230,20)' stroke-width='6' stroke-linecap='round' d='M0 3L0 10M0 -2L0 -10'></path> <path stroke='rgb(255,255,200)' stroke-width='2' stroke-linecap='round' d='M0 2L0 10M0 -3L0 -10'></path> </g> <g transform='rotate(90)'> <path stroke='rgb(255,230,20)' stroke-width='6' stroke-linecap='round' d='M0 3L0 10M0 -2L0 -10'></path> <path stroke='rgb(255,255,200)' stroke-width='2' stroke-linecap='round' d='M0 2L0 10M0 -3L0 -10'></path> </g> <g transform='rotate(135)'> <path stroke='rgb(255,230,20)' stroke-width='6' stroke-linecap='round' d='M0 3L0 10M0 -2L0 -10'></path> <path stroke='rgb(255,255,200)' stroke-width='2' stroke-linecap='round' d='M0 2L0 10M0 -3L0 -10'></path> </g> </g> </g></svg>")
        tex_ctx.setTransform(1,0,0,1,0,0)
    
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.fillRect(128*0,256+256*6,128,128)
        tex_ctx.translate(128*0+128*0.5+-1,256+128*12.5+4)
        tex_ctx.scale(-2.1,1.75)
        tex_ctx.translate(5,8)
        tex_ctx.lineWidth=3
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(250,250,250)'
        a=new Path2D('M-16 -11 C -15 -24 -18 -26 -14 -28C -5 -34 -1 -29 3 -21L -4 -24L 2 -19C -5 -15 -11 -19 -12 -21L -11 -10')
        tex_ctx.stroke(a)
        tex_ctx.fill(a)
        tex_ctx.translate(-1,5)
        a=new Path2D('M-15 -15 C -20 4 4 8 5 0C 8 -3 -1 -24 -15 -15')
        tex_ctx.stroke(a)
        tex_ctx.fill(a)
        tex_ctx.strokeStyle='rgb(0,0,0,0.2)'
        tex_ctx.fillStyle='rgb(0,0,0,0.2)'
        e(-8,0,2*0.75,2.5*0.75)
        e(-9,-29,2*0.75,2.5*0.75)
        a=new Path2D('M-11 -7 C -15 -14 -5 -16 -8 -11M-5 0 C 1 1 4 0 0 -6')
        tex_ctx.stroke(a)
        tex_ctx.strokeStyle='rgb(220,0,0)'
        a=new Path2D('M-10 -17 C-8 -11 -3 -16 -1 -7M-12 -16C -1 -33 -1 -11 -12 -16C -17 -33 -25 -11 -12 -16C -17 -6 -17 -14 -22 -5')
        tex_ctx.stroke(a)
        tex_ctx.setTransform(1,0,0,1,0,0)
    
        tex_ctx.translate(128*1,256+256*6)
        tex_ctx.fillRect(0,0,128,128)
        canvg(tex_ctx.canvas,"<svg><rect fill='rgb(100,200,255)' x='0' y='0' width='128' height='128'></rect><g transform='translate(65,62) scale(1.85,1.85) rotate(6)'><g fill='rgb(0,0,0,0)' stroke='black' stroke-width='4'> <path d='M0 0L0 15L6 21M0 15L-6 21L0 15L0 26M0 2L5 7L0 13L-5 7L0 2M0 11L6 16M0 11L-6 16' transform='rotate(0)'></path> <path d='M0 0L0 15L6 21M0 15L-6 21L0 15L0 26M0 2L5 7L0 13L-5 7L0 2M0 11L6 16M0 11L-6 16' transform='rotate(60)'></path> <path d='M0 0L0 15L6 21M0 15L-6 21L0 15L0 26M0 2L5 7L0 13L-5 7L0 2M0 11L6 16M0 11L-6 16' transform='rotate(120)'></path> <path d='M0 0L0 15L6 21M0 15L-6 21L0 15L0 26M0 2L5 7L0 13L-5 7L0 2M0 11L6 16M0 11L-6 16' transform='rotate(180)'></path> <path d='M0 0L0 15L6 21M0 15L-6 21L0 15L0 26M0 2L5 7L0 13L-5 7L0 2M0 11L6 16M0 11L-6 16' transform='rotate(240)'></path> <path d='M0 0L0 15L6 21M0 15L-6 21L0 15L0 26M0 2L5 7L0 13L-5 7L0 2M0 11L6 16M0 11L-6 16' transform='rotate(300)'></path> </g> <g fill='rgb(0,0,0,0)' stroke='rgb(149, 176, 207)' stroke-width='2'> <path d='M0 0L0 15L5 20M0 15L-5 20L0 15L0 24M0 2L5 7L0 13L-5 7L0 2M0 11L5 15M0 11L-5 15' transform='rotate(0)'></path> <path d='M0 0L0 15L5 20M0 15L-5 20L0 15L0 24M0 2L5 7L0 13L-5 7L0 2M0 11L5 15M0 11L-5 15' transform='rotate(60)'></path> <path d='M0 0L0 15L5 20M0 15L-5 20L0 15L0 24M0 2L5 7L0 13L-5 7L0 2M0 11L5 15M0 11L-5 15' transform='rotate(120)'></path> <path d='M0 0L0 15L5 20M0 15L-5 20L0 15L0 24M0 2L5 7L0 13L-5 7L0 2M0 11L5 15M0 11L-5 15' transform='rotate(180)'></path> <path d='M0 0L0 15L5 20M0 15L-5 20L0 15L0 24M0 2L5 7L0 13L-5 7L0 2M0 11L5 15M0 11L-5 15' transform='rotate(240)'></path> <path d='M0 0L0 15L5 20M0 15L-5 20L0 15L0 24M0 2L5 7L0 13L-5 7L0 2M0 11L5 15M0 11L-5 15' transform='rotate(300)'></path></g></g></svg>")
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*2,256+256*6)
        tex_ctx.fillRect(0,0,128,128)
        canvg(tex_ctx.canvas,"<svg><rect fill='rgb(100,200,255)' x='0' y='0' width='128' height='128'></rect><g transform='translate(65,63) scale(1.85,1.85) rotate(6)'><path stroke='rgb(0,0,0)' stroke-width='1.5' d='M3 -6L -9 -6C -29 -14 -28 8 -15 5C -9 5 -12 3 -15 12C -31 28 -12 29 -9 26C -4 25 0 14 0 18' fill='rgba(177,116,71)'></path> <path stroke='rgb(0,0,0)' stroke-width='1.5' d='M3 -6L -9 -6C -29 -14 -28 8 -15 5C -9 5 -12 3 -15 12C -31 28 -12 29 -9 26C -4 25 0 14 0 18' fill='rgba(177,116,71)' transform='scale(-1,1)'></path> <circle stroke='rgb(0,0,0)' stroke-width='1.5' fill='rgba(177,116,71)' cx='-10' cy='-22' r='5'></circle> <circle stroke='rgb(0,0,0)' stroke-width='1.5' fill='rgba(177,116,71)' cx='10' cy='-22' r='5'></circle> <rect stroke='rgb(0,0,0)' stroke-width='1.5' fill='rgba(177,116,71)' x='-10' y='-22' width='20' height='18' rx='2'></rect> <circle fill='rgba(177,116,71)' cx='-10' cy='-22' r='4'></circle> <circle fill='rgba(177,116,71)' cx='10' cy='-22' r='4'></circle> <path stroke='rgb(255, 255, 255)' stroke-width='1.5' d='M -18 -6L -19 4M -17 15L -9 26M 18 -6L 19 4M 17 15L 9 26' fill='rgba(0,0,0,0)'></path> <path stroke='rgb(255, 255, 255)' stroke-width='1.5' d='M -4 -16C -2 -12 -3 -14 -5 -13' fill='rgba(0,0,0,0)'></path> <path stroke='rgb(255, 255, 255)' stroke-width='1.5' d='M -4 -16C -2 -12 -3 -14 -5 -13' fill='rgba(0,0,0,0)' transform='translate(7,0)'></path><circle fill='rgb(255, 255, 255)' cx='0' cy='2' r='1.5'></circle> <circle fill='rgb(255, 255, 255)' cx='0' cy='10' r='1.5'></circle> <circle fill='rgb(255,60,60)' cx='0' cy='-9' r='2'></circle></g></svg>")
        tex_ctx.setTransform(1,0,0,1,0,0)
    
        tex_ctx.translate(128*3,256+256*6)
        tex_ctx.fillRect(0,0,128,128)
        canvg(tex_ctx.canvas,"<svg><rect fill='rgb(100,200,255)' x='0' y='0' width='128' height='128'></rect><g transform='translate(20,-4) scale(3.85,3.85)'><path stroke='rgb(0,0,0)' stroke-width='3' d='M13 18C 1 26 23 21 8.5 29' fill='rgba(0,0,0,0)'></path> <path stroke='rgb(200,200,200)' stroke-width='1' d='M13 18C 1 26 23 21 9 29' fill='rgba(0,0,0,0)'></path> <circle cx='12' cy='12' r='7' fill='rgb(245, 110, 227)' stroke='rgb(0,0,0)' stroke-width='1'></circle></g></svg>")
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*4,256+256*6)
        tex_ctx.fillRect(0,0,128,128)
        canvg(tex_ctx.canvas,"<svg><rect fill='rgb(100,200,255)' x='0' y='0' width='128' height='128'></rect><g transform='translate(20,-4) scale(3.85,3.85)'><path stroke='rgb(0,0,0)' stroke-width='3' d='M13 18C 1 26 23 21 8.5 29' fill='rgba(0,0,0,0)'></path> <path stroke='rgb(200,200,200)' stroke-width='1' d='M13 18C 1 26 23 21 9 29' fill='rgba(0,0,0,0)'></path> <circle cx='12' cy='12' r='7' fill='rgb(255,0,0)' stroke='rgb(0,0,0)' stroke-width='1'></circle></g></svg>")
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*5,256+256*6)
        tex_ctx.fillRect(0,0,128,128)
        canvg(tex_ctx.canvas,"<svg><rect fill='rgb(100,200,255)' x='0' y='0' width='128' height='128'></rect><g transform='translate(20,-4) scale(3.85,3.85)'><path stroke='rgb(0,0,0)' stroke-width='3' d='M13 18C 1 26 23 21 8.5 29' fill='rgba(0,0,0,0)'></path> <path stroke='rgb(200,200,200)' stroke-width='1' d='M13 18C 1 26 23 21 9 29' fill='rgba(0,0,0,0)'></path> <circle cx='12' cy='12' r='7' fill='rgb(232,232,232)' stroke='rgb(0,0,0)' stroke-width='1'></circle></g></svg>")
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*6,256+256*6)
        tex_ctx.fillRect(0,0,128,128)
        canvg(tex_ctx.canvas,"<svg><rect fill='rgb(100,200,255)' x='0' y='0' width='128' height='128'></rect><g transform='translate(20,-4) scale(3.85,3.85)'><path stroke='rgb(0,0,0)' stroke-width='3' d='M13 18C 1 26 23 21 8.5 29' fill='rgba(0,0,0,0)'></path> <path stroke='rgb(200,200,200)' stroke-width='1' d='M13 18C 1 26 23 21 9 29' fill='rgba(0,0,0,0)'></path> <circle cx='12' cy='12' r='7' fill='rgb(94, 94, 94)' stroke='rgb(0,0,0)' stroke-width='1'></circle></g></svg>")
        tex_ctx.setTransform(1,0,0,1,0,0)
    
        tex_ctx.translate(128*7,256+256*6)
        tex_ctx.fillStyle='rgb(0,255,0)'
        tex_ctx.fillRect(0,0,128,128)
        canvg(tex_ctx.canvas,"<svg><rect fill='rgb(0,255,0)' x='0' y='0' width='128' height='128'></rect><g transform='translate(66,36) scale(2,2)'> <path fill='rgb(255,0,0)' stroke='rgb(0,0,0)' stroke-width='2' d='M2 -7L-12 19L7 22z'></path> <path fill='rgb(0,0,0)' stroke='rgb(255,255,255)' stroke-width='8' stroke-linecap='round' d='M-12 19L7 22'></path> <circle cx='2' cy='-7' r='6' fill='rgb(255,255,255'></circle> <path fill='rgb(255,0,0)' stroke='rgb(120, 92, 49)' stroke-width='7' d='M -3 24L -3 47'></path> </g></svg>")
        tex_ctx.setTransform(1,0,0,1,0,0)
    
    }
    
    window.textures_bees=function(tex_ctx){
    
        tex_ctx.fillStyle='rgb(100,100,100,0)'
        tex_ctx.fillRect(0,0,2048,2048)
        
        tex_ctx.fillStyle='rgb(33, 20, 1)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.strokeStyle='rgb(220,220,220)'
        tex_ctx.lineWidth=9
        tex_ctx.lineCap='round'
        tex_ctx.lineJoin='round'
        tex_ctx.beginPath()
        tex_ctx.moveTo((128/2)-(128/5),30)
        tex_ctx.lineTo((128/2)-(128/5),50)
        tex_ctx.moveTo((128/2)+(128/5),30)
        tex_ctx.lineTo((128/2)+(128/5),50)
        tex_ctx.closePath()
        tex_ctx.moveTo(128/2,100)
        tex_ctx.lineTo((128/2)-(128/5),80)
        tex_ctx.moveTo(128/2,100)
        tex_ctx.lineTo((128/2)+(128/5),80)
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(237, 233, 9)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(33, 20, 1)'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        
        tex_ctx.fillStyle='rgb(0,200,60)'
        tex_ctx.fillRect(128,0,128,128)
        tex_ctx.strokeStyle='rgb(255,255,255)'
        tex_ctx.lineWidth=18
        tex_ctx.beginPath()
        tex_ctx.moveTo((128/2)-(128/5)+128,30)
        tex_ctx.lineTo((128/2)-(128/5)+128,50)
        tex_ctx.moveTo((128/2)+(128/5)+128,30)
        tex_ctx.lineTo((128/2)+(128/5)+128,50)
        tex_ctx.closePath()
        tex_ctx.stroke()
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.lineWidth=9
        tex_ctx.beginPath()
        tex_ctx.moveTo((128/2)-(128/5)+124,45)
        tex_ctx.lineTo((128/2)-(128/5)+124,53)
        tex_ctx.moveTo((128/2)-(128/5)+173,45)
        tex_ctx.lineTo((128/2)-(128/5)+173,53)
        tex_ctx.closePath()
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(0,0,0)'
        tex_ctx.fillRect(128,128,128,128)
        tex_ctx.fillStyle='rgb(0,200,60)'
        tex_ctx.fillRect(128,128-1,128,128/3|0)
        tex_ctx.fillRect(128,213,128,128/3|0+1)
        
        tex_ctx.fillStyle='rgb(10,10,10)'
        tex_ctx.fillRect(128*2,0,128,128)
        tex_ctx.strokeStyle='rgb(255,255,255)'
        tex_ctx.lineWidth=4
        tex_ctx.translate(0,-13)
        tex_ctx.beginPath()
        tex_ctx.moveTo((128/2)-(128/5)+123*2,86)
        tex_ctx.lineTo((128/2)-(128/5)+125*2,53)
        tex_ctx.moveTo((128/2)-(128/5)+125*2,53)
        tex_ctx.lineTo((128/2)-(128/5)+128*2,62)
        tex_ctx.moveTo((128/2)-(128/5)+159.5*2,59)
        tex_ctx.lineTo((128/2)-(128/5)+161*2,27)
        tex_ctx.moveTo((128/2)-(128/5)+161*2,27)
        tex_ctx.lineTo((128/2)-(128/5)+164*2,39)
        tex_ctx.moveTo((128/2)-(128/5)+128*2,94)
        tex_ctx.bezierCurveTo((128/2)-(128/5)+135*2,114,(128/2)-(128/5)+157*2,109,(128/2)-(128/5)+155*2,74)
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.ellipse(279,89,8,6,-0.2,0,7)
        tex_ctx.ellipse(352,59,8,6,-0.2,0,7)
        tex_ctx.moveTo(0,0)
        tex_ctx.ellipse(365,62,2,2,-0.2,0,7)
        tex_ctx.closePath()
        tex_ctx.translate(0,13)
        tex_ctx.fillStyle='rgb(255,255,255)'
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(220,220,220)'
        tex_ctx.fillRect(128*2,128,128,128)
        tex_ctx.fillStyle='rgb(10,10,10)'
        tex_ctx.fillRect(128*2,128-1,128,128/3|0)
        tex_ctx.fillRect(128*2,213,128,128/3|0+1)
        
        tex_ctx.translate(128*3,0)
        tex_ctx.fillStyle='rgb(190,0,0)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.strokeStyle='rgb(235, 66, 9)'
        tex_ctx.fillStyle='rgb(235, 66, 9)'
        tex_ctx.lineWidth=3
        tex_ctx.beginPath()
        tex_ctx.translate(63,-5)
        tex_ctx.moveTo(128/2-40+10,55-5)
        tex_ctx.lineTo(128/2-40-5+10,40-5)
        tex_ctx.moveTo(128/2-40-5-5+10,55-5)
        tex_ctx.lineTo(128/2-40-5+10,40-5)
        tex_ctx.moveTo(128/2-40-5-5,55-5)
        tex_ctx.bezierCurveTo(128/2-40-5-5,71-5,128/2-40-5-5+20,71-5,128/2-40-5-5+20,55-5)
        tex_ctx.arc(20,29,0,0,6)
        tex_ctx.scale(-1,1)
        tex_ctx.moveTo(128/2-40+10,55-5)
        tex_ctx.lineTo(128/2-40-5+10,40-5)
        tex_ctx.moveTo(128/2-40-5-5+10,55-5)
        tex_ctx.lineTo(128/2-40-5+10,40-5)
        tex_ctx.moveTo(128/2-40-5-5,55-5)
        tex_ctx.bezierCurveTo(128/2-40-5-5,71-5,128/2-40-5-5+20,71-5,128/2-40-5-5+20,55-5)
        tex_ctx.arc(20,29,0,0,6)
        tex_ctx.closePath()
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.scale(-1,1)
        tex_ctx.translate(-65,5)
        tex_ctx.beginPath()
        tex_ctx.moveTo(128*0.5-35,90)
        tex_ctx.lineTo(128*0.5-30,90+15)
        tex_ctx.moveTo(128*0.5-30,90+15)
        tex_ctx.lineTo(128*0.5-25,90)
        tex_ctx.translate(10,0)
        tex_ctx.moveTo(128*0.5-35,90)
        tex_ctx.lineTo(128*0.5-30,90+15)
        tex_ctx.moveTo(128*0.5-30,90+15)
        tex_ctx.lineTo(128*0.5-25,90)
        tex_ctx.translate(10,0)
        tex_ctx.moveTo(128*0.5-35,90)
        tex_ctx.lineTo(128*0.5-30,90+15)
        tex_ctx.moveTo(128*0.5-30,90+15)
        tex_ctx.lineTo(128*0.5-25,90)
        tex_ctx.translate(10,0)
        tex_ctx.moveTo(128*0.5-35,90)
        tex_ctx.lineTo(128*0.5-30,90+15)
        tex_ctx.moveTo(128*0.5-30,90+15)
        tex_ctx.lineTo(128*0.5-25,90)
        tex_ctx.translate(10,0)
        tex_ctx.moveTo(128*0.5-35,90)
        tex_ctx.lineTo(128*0.5-30,90+15)
        tex_ctx.moveTo(128*0.5-30,90+15)
        tex_ctx.lineTo(128*0.5-25,90)
        tex_ctx.translate(10,0)
        tex_ctx.moveTo(128*0.5-35,90)
        tex_ctx.lineTo(128*0.5-30,90+15)
        tex_ctx.moveTo(128*0.5-30,90+15)
        tex_ctx.lineTo(128*0.5-25,90)
        tex_ctx.translate(10,0)
        tex_ctx.moveTo(128*0.5-35,90)
        tex_ctx.lineTo(128*0.5-30,90+15)
        tex_ctx.moveTo(128*0.5-30,90+15)
        tex_ctx.lineTo(128*0.5-25,90)
        tex_ctx.stroke()
        tex_ctx.translate(-58,0)
        tex_ctx.fillStyle='rgb(235, 66, 9)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(190,0,0)'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*4,0)
        tex_ctx.fillStyle='rgb(70, 183, 240)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.strokeStyle='rgb(15, 136, 212)'
        tex_ctx.lineWidth=10
        tex_ctx.beginPath()
        tex_ctx.moveTo(128*0.5-35,59)
        tex_ctx.bezierCurveTo(56,62,44,39,128*0.5-35,28)
        tex_ctx.translate(55,0)
        tex_ctx.moveTo(128*0.5-35,59)
        tex_ctx.bezierCurveTo(56,62,44,39,128*0.5-35,28)
        tex_ctx.translate(-55,0)
        tex_ctx.moveTo(128*0.5+-10,104)
        tex_ctx.bezierCurveTo(89,110,69,86,128*0.5+-5,86)
        tex_ctx.bezierCurveTo(40,85,45,102,128*0.5+-11,104)
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(15, 136, 212)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(70, 183, 240)'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*5,0)
        tex_ctx.fillStyle='rgb(220,220,220)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.lineWidth=3.5
        tex_ctx.beginPath()
        tex_ctx.translate(4,0)
        tex_ctx.moveTo(36,30)
        tex_ctx.bezierCurveTo(25,17,15,47,30,56)
        tex_ctx.bezierCurveTo(50,55,36,32,33,45)
        tex_ctx.translate(50,0)
        tex_ctx.moveTo(36,30)
        tex_ctx.bezierCurveTo(25,17,15,47,30,56)
        tex_ctx.bezierCurveTo(50,55,36,32,33,45)
        tex_ctx.translate(-54,0)
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(215,215,0)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(220,220,220)'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*6,0)
        tex_ctx.fillStyle='rgb(220,220,220)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(0,0,0)'
        tex_ctx.lineWidth=3
        tex_ctx.beginPath()
        tex_ctx.ellipse(128*0.5-30,40,15,13,0,0,7)
        tex_ctx.rect(0,35,128,8)
        tex_ctx.ellipse(128*0.5+30,40,15,13,0,0,7)
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.strokeStyle='rgb(220,220,220)'
        tex_ctx.lineWidth=5
        tex_ctx.beginPath()
        tex_ctx.moveTo(128*0.5-30,32)
        tex_ctx.bezierCurveTo(128*0.5-36,35,128*0.5-35,32,128*0.5-40,40)
        tex_ctx.translate(61,0)
        tex_ctx.moveTo(128*0.5-30,32)
        tex_ctx.bezierCurveTo(128*0.5-36,35,128*0.5-35,32,128*0.5-40,40)
        tex_ctx.translate(-61,0)
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(20,20,20)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(220,220,220)'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*7,0)
        tex_ctx.fillStyle='rgb(176, 128, 74)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.strokeStyle='rgb(125, 78, 24)'
        tex_ctx.lineWidth=3
        tex_ctx.beginPath()
        tex_ctx.translate(32,20)
        
        for(let i=-0.71,j=0,inc=Math.PI*2/34;i<Math.PI*2*0.18;i+=inc,j++){
            
            let ri=(j-1)%2===0?25:28,r=j%2===0?22:31
            tex_ctx.moveTo(Math.sin(i-inc)*ri,Math.cos(i-inc)*ri)
            tex_ctx.lineTo(Math.sin(i)*r,Math.cos(i)*r)
        }
        
        tex_ctx.translate(60,0)
        
        for(let i=-0.71,j=0,inc=Math.PI*2/34;i<Math.PI*2*0.18;i+=inc,j++){
            
            let ri=(j-1)%2===0?25:28,r=j%2===0?22:31
            tex_ctx.moveTo(Math.sin(i-inc)*ri,Math.cos(i-inc)*ri)
            tex_ctx.lineTo(Math.sin(i)*r,Math.cos(i)*r)
        }
        
        tex_ctx.stroke()
        tex_ctx.translate(-32,60)
        tex_ctx.beginPath()
        
        for(let i=-0.74,j=0,inc=Math.PI*2/39;i<Math.PI*2*0.17;i+=inc,j++){
            
            let ri=(j-1)%2===0?25:28,r=j%2===0?22:31
            tex_ctx.moveTo(Math.sin(i-inc)*ri*1.5,Math.cos(i-inc)*ri)
            tex_ctx.lineTo(Math.sin(i)*r*1.5,Math.cos(i)*r)
        }
        
        tex_ctx.lineWidth=5
        tex_ctx.stroke()
        tex_ctx.translate(-32-28,-80)
        tex_ctx.fillStyle='rgb(176, 128, 74)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillRect(0,128-1,128,(128/3|0))
        tex_ctx.fillRect(0,213,128,(128/3|0)+1)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*8,0)
        tex_ctx.fillStyle='rgb(0,0,0)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.strokeStyle='rgb(205,205,205)'
        tex_ctx.lineWidth=4
        tex_ctx.beginPath()
        tex_ctx.moveTo(2,20)
        tex_ctx.bezierCurveTo(128/2,128/2-40,128/2,128/2-40,126,20)
        tex_ctx.moveTo(128/2-25,45)
        tex_ctx.lineTo(128/2-25,60)
        tex_ctx.moveTo(128/2+25,45)
        tex_ctx.lineTo(128/2+25,60)
        tex_ctx.moveTo(128/2-30,100)
        tex_ctx.bezierCurveTo(128/2,128/2+30,128/2,128/2+30,128/2+30,100)
        tex_ctx.moveTo(128/2-23-10,95)
        tex_ctx.lineTo(128/2-19-10,106)
        tex_ctx.moveTo(128/2+23+10,95)
        tex_ctx.lineTo(128/2+19+10,106)
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(175,175,175)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(0,0,0)'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*9,0)
        tex_ctx.fillStyle='rgb(200,0,0)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.strokeStyle='rgb(80,0,0)'
        tex_ctx.fillStyle='rgb(80,0,0)'
        tex_ctx.lineWidth=4
        tex_ctx.translate(128/2,128/2+-5)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-40,-41)
        tex_ctx.lineTo(-35,4)
        tex_ctx.lineTo(-26,20)
        tex_ctx.lineTo(-23,-32)
        tex_ctx.lineTo(-32,-23)
        tex_ctx.scale(-1,1)
        tex_ctx.moveTo(-40,-41)
        tex_ctx.lineTo(-35,4)
        tex_ctx.lineTo(-26,20)
        tex_ctx.lineTo(-23,-32)
        tex_ctx.lineTo(-32,-23)
        tex_ctx.fill()
        tex_ctx.translate(0,4)
        tex_ctx.beginPath()
        tex_ctx.moveTo(54,16)
        tex_ctx.lineTo(44,30)
        tex_ctx.moveTo(-54,16)
        tex_ctx.lineTo(-44,30)
        tex_ctx.moveTo(-19,37)
        tex_ctx.lineTo(-10,40)
        tex_ctx.lineTo(0,50)
        tex_ctx.lineTo(10,40)
        tex_ctx.lineTo(18,37)
        tex_ctx.stroke()
        tex_ctx.translate(0,2)
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='rgb(80,0,0)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(200,0,0)'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(1280,0)
        tex_ctx.fillStyle='rgb(220,220,220)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.fillStyle='rgb(120,120,120)'
        tex_ctx.lineWidth=4
        tex_ctx.translate(128/2,128/2)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-128/2,-128/2)
        tex_ctx.bezierCurveTo(-28,-58,0,0,0,10)
        tex_ctx.bezierCurveTo(0,0,-28+128/2,-58,128/2,-128/2)
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.moveTo(-20,-18)
        tex_ctx.lineTo(-13,-6)
        tex_ctx.moveTo(20,-18)
        tex_ctx.lineTo(13,-6)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.stroke()
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='rgb(220,220,220)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(120,120,120)'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*11,0)
        tex_ctx.fillStyle='rgb(27, 219, 145)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.fillStyle='rgb(58, 125, 166)'
        tex_ctx.strokeStyle='rgb(58, 125, 166)'
        tex_ctx.lineWidth=7
        tex_ctx.translate(128/2,128/2)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-30,-35)
        tex_ctx.bezierCurveTo(-40,-20,-40,-15,-30,-20)
        tex_ctx.bezierCurveTo(-20,-2,-20,-35,-30,-35)
        tex_ctx.moveTo(-30,-35)
        tex_ctx.lineTo(-34,-11)
        tex_ctx.lineTo(-25,-30)
        tex_ctx.lineTo(-37,-23)
        tex_ctx.moveTo(30,-35)
        tex_ctx.bezierCurveTo(40,-20,40,-15,30,-20)
        tex_ctx.bezierCurveTo(20,-2,20,-35,30,-35)
        tex_ctx.moveTo(30,-35)
        tex_ctx.lineTo(34,-11)
        tex_ctx.lineTo(25,-30)
        tex_ctx.lineTo(37,-23)
        for(let i=-0.74,j=0,inc=Math.PI*2/39;i<Math.PI*2*0.17;i+=inc,j++){
            
            let r=29+Math.sin(i*183)*3
            tex_ctx.moveTo(Math.sin(i-inc)*r,Math.cos(i-inc)*r)
            tex_ctx.lineTo(Math.sin(i)*r,Math.cos(i)*r)
        }
        tex_ctx.stroke()
        tex_ctx.strokeStyle='rgb(27, 219, 145)'
        tex_ctx.lineWidth=4
        tex_ctx.beginPath()
        tex_ctx.moveTo(-30,-30)
        tex_ctx.bezierCurveTo(-30,-33,-34,-20,-31,-20)
        tex_ctx.moveTo(30,-30)
        tex_ctx.bezierCurveTo(30,-33,34,-20,31,-20)
        tex_ctx.stroke()
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='rgb(29, 133, 72)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(27, 219, 145)'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*12,0)
        tex_ctx.fillStyle='rgb(23, 118, 235)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.fillStyle='rgb(23, 197, 255)'
        tex_ctx.strokeStyle='rgb(23, 197, 255)'
        tex_ctx.lineWidth=13
        tex_ctx.scale(0.3,0.3)
        tex_ctx.translate(-92,-62)
        function ellipse(x,y,w,h,r=0){
            tex_ctx.beginPath()
            tex_ctx.ellipse(x,y,w,h,r,0,6)
            tex_ctx.fill()
        }
        function bezier(a,b,c,d,e,f,g,h,fill,stroke){
            tex_ctx.beginPath()
            tex_ctx.moveTo(a,b)
            tex_ctx.bezierCurveTo(c,d,e,f,g,h)
            
            if(fill)
            tex_ctx.fill()
            if(stroke)
            tex_ctx.stroke()
        }
        function line(a,b,c,d){
            tex_ctx.beginPath()
            tex_ctx.moveTo(a,b)
            tex_ctx.lineTo(c,d)
            tex_ctx.stroke()
        }
        
        tex_ctx.fillStyle='rgb(12, 168, 240)'
        ellipse(186,172,18,18)
        ellipse(413,135,18,18)
        tex_ctx.fillStyle='rgb(23, 197, 255)'
        ellipse(315,261,33,33)
        bezier(159,238,181,223,187,216,233,227,false,true)
        bezier(178,212,225,223,187,216,233,227,false,true)
        tex_ctx.translate(0,25)
        bezier(406,211,496,190,382,104,431,198,true,true)
        tex_ctx.lineWidth=20
        bezier(273,325,276,416,422,355,369,299,true,true)
        bezier(250,311,289,343,378,301,373,295,false,true)
        tex_ctx.beginPath()
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(23, 118, 235)'
        ellipse(416,182,19*0.5,31*0.5)
        tex_ctx.translate(92,38)
        tex_ctx.scale(1/0.3,1/0.3)
        tex_ctx.fillStyle='rgb(242, 255, 0)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(23, 118, 235)'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*13,0)
        tex_ctx.fillStyle='rgb(255,50,255)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.strokeStyle='rgb(30,255,100)'
        tex_ctx.lineWidth=11
        tex_ctx.translate(128/2,128/2)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-30,-30)
        tex_ctx.bezierCurveTo(-28,-44,-12,-10,-32,-11)
        tex_ctx.moveTo(16,-34)
        tex_ctx.bezierCurveTo(39,-26,5,-17,25,-14)
        tex_ctx.moveTo(-29,23)
        tex_ctx.bezierCurveTo(-14,22,-19,37,0,32)
        tex_ctx.bezierCurveTo(25,22,-8,25,28,22)
        tex_ctx.stroke()
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='rgb(30,255,100)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(255,50,255)'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*14,0)
        tex_ctx.fillStyle='rgb(219, 72, 92)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.strokeStyle='rgb(100,0,0)'
        tex_ctx.fillStyle='rgb(100,0,0)'
        tex_ctx.lineWidth=6
        tex_ctx.translate(128/2,128/2)
        tex_ctx.fillRect(-128*0.5,-128*0.5,128*0.5,128)
        tex_ctx.beginPath()
        tex_ctx.moveTo(30,-10)
        tex_ctx.lineTo(30,-25)
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.ellipse(30,-24,10,5,0,-3.0,-12.7)
        tex_ctx.stroke()
        tex_ctx.strokeStyle='rgb(219,72,92)'
        tex_ctx.fillStyle='rgb(219,72,92)'
        tex_ctx.fillRect(-128*0.5,128*0.5,128,129)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-30,-10)
        tex_ctx.lineTo(-30,-25)
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.ellipse(-30,-24,10,5,0,-3.0,-12.7)
        tex_ctx.stroke()
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='rgb(100,0,0)'
        tex_ctx.translate(0,128)
        tex_ctx.beginPath()
        tex_ctx.moveTo(128*0.5,0)
        tex_ctx.lineTo(0,128*0.5)
        tex_ctx.lineTo(128*0.5,128)
        tex_ctx.lineTo(128,128*0.5)
        tex_ctx.fill()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*15,0)
        tex_ctx.fillStyle='rgb(255, 149, 125)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.strokeStyle='rgb(255, 20, 0)'
        tex_ctx.fillStyle='rgb(255, 20, 0)'
        tex_ctx.lineWidth=6
        tex_ctx.translate(128/2,128/2)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-45,-30)
        tex_ctx.bezierCurveTo(-45,-40,-20,-40,-13,-23)
        tex_ctx.moveTo(-19,40)
        tex_ctx.bezierCurveTo(-34,7,32,8,32,40)
        tex_ctx.scale(-1,1)
        tex_ctx.moveTo(-45,-30)
        tex_ctx.bezierCurveTo(-45,-40,-20,-40,-13,-23)
        tex_ctx.stroke()
        tex_ctx.scale(-1,1)
        tex_ctx.beginPath()
        tex_ctx.ellipse(-24,-11,7,10,0,0,7)
        tex_ctx.ellipse(24,-11,7,10,0,0,7)
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(255, 149, 125)'
        tex_ctx.beginPath()
        tex_ctx.ellipse(-28,-5,2,4,0,0,7)
        tex_ctx.ellipse(21,-5,2,4,0,0,7)
        tex_ctx.fill()
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='rgb(245, 123, 95)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(255, 149, 125)'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillStyle='rgb(214, 60, 26)'
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*0,256)
        tex_ctx.fillStyle='rgb(255,0,0)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.fillStyle='rgb(255, 255, 255)'
        tex_ctx.lineWidth=6
        tex_ctx.translate(128/2,128/2)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-64,64)
        tex_ctx.lineTo(-64,-32)
        tex_ctx.lineTo(-32,-64)
        tex_ctx.bezierCurveTo(5,0,-5,0,32,-64)
        tex_ctx.lineTo(64,-32)
        tex_ctx.lineTo(64,64)
        tex_ctx.bezierCurveTo(-25,0,25,0,-64,64)
        tex_ctx.moveTo(-20,45-8)
        tex_ctx.bezierCurveTo(-10,60-8,10,60-8,20,45-8)
        tex_ctx.bezierCurveTo(10,55-8,-10,55-8,-20,45-8)
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.ellipse(-25,0,4,3,0,0,7)
        tex_ctx.rect(-33,0,10,1)
        tex_ctx.moveTo(25,0)
        tex_ctx.ellipse(25,0,4,3,0,0,7)
        tex_ctx.rect(23,0,10,1)
        tex_ctx.fillStyle=tex_ctx.strokeStyle='rgb(255, 0, 0)'
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='rgb(255,255,255)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(255,0,0)'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*1,256)
        tex_ctx.fillStyle='rgb(0,0,255)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.fillStyle='rgb(255, 255, 255)'
        tex_ctx.lineWidth=5
        tex_ctx.translate(128/2,128/2)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-64,-64)
        tex_ctx.lineTo(0,-25)
        tex_ctx.lineTo(64,-64)
        tex_ctx.lineTo(64,-64+20)
        tex_ctx.lineTo(50,-64+30)
        tex_ctx.lineTo(64,-64+40)
        tex_ctx.lineTo(64,-64+60)
        tex_ctx.lineTo(50,-64+70)
        tex_ctx.lineTo(64,-64+90)
        tex_ctx.lineTo(15,-64+90)
        tex_ctx.bezierCurveTo(15,10,-15,10,-15,-64+90)
        tex_ctx.lineTo(-64,-64+90)
        tex_ctx.lineTo(-50,-64+70)
        tex_ctx.lineTo(-64,-64+60)
        tex_ctx.lineTo(-64,-64+40)
        tex_ctx.lineTo(-50,-64+30)
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.moveTo(-30,45)
        tex_ctx.lineTo(-20,55)
        tex_ctx.lineTo(20,55)
        tex_ctx.lineTo(30,45)
        tex_ctx.moveTo(-30+3,45-3)
        tex_ctx.lineTo(-30-3,45+3)
        tex_ctx.moveTo(30-3,45-3)
        tex_ctx.lineTo(30+3,45+3)
        tex_ctx.strokeStyle='rgb(255, 255, 255)'
        tex_ctx.stroke()
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='rgb(255,255,255)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(0,0,255)'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*2,256)
        tex_ctx.fillStyle='rgb(0,0,0)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.lineWidth=6
        tex_ctx.translate(128/2,128/2)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-45,-40)
        tex_ctx.lineTo(-45,40)
        tex_ctx.moveTo(-30,-40)
        tex_ctx.lineTo(-30,40)
        tex_ctx.moveTo(-15,-40)
        tex_ctx.lineTo(-15,40)
        tex_ctx.moveTo(0,-40)
        tex_ctx.lineTo(0,40)
        tex_ctx.moveTo(45,-40)
        tex_ctx.lineTo(45,40)
        tex_ctx.moveTo(30,-40)
        tex_ctx.lineTo(30,40)
        tex_ctx.moveTo(15,-40)
        tex_ctx.lineTo(15,40)
        tex_ctx.fillStyle='rgb(255,255,0)'
        tex_ctx.strokeStyle='rgb(255,255,0)'
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.moveTo(-64,-64)
        tex_ctx.lineTo(-64,-40)
        tex_ctx.bezierCurveTo(-39,-15,39,-15,64,-40)
        tex_ctx.lineTo(64,-64)
        tex_ctx.moveTo(-64,64)
        tex_ctx.lineTo(-64,10)
        tex_ctx.bezierCurveTo(-39,25,39,25,64,10)
        tex_ctx.lineTo(64,64)
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.moveTo(-15,40)
        tex_ctx.lineTo(0,55)
        tex_ctx.lineTo(15,40)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.stroke()
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='rgb(255,255,255)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(255,255,0)'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*3,256)
        tex_ctx.fillStyle='rgb(17, 32, 43)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.lineWidth=6
        tex_ctx.translate(128/2,128/2)
        tex_ctx.fillStyle='rgb(59, 142, 209)'
        tex_ctx.strokeStyle='rgb(59, 142, 209)'
        tex_ctx.beginPath()
        tex_ctx.ellipse(-26,-29,6,8,9.2,7,15)
        tex_ctx.ellipse(26,-29,7,9,-9.2,7,15)
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.ellipse(0,-2,5,5,-9.2,7,15)
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.moveTo(-26,23)
        tex_ctx.bezierCurveTo(-10,38,24,31,29,21)
        tex_ctx.moveTo(-25,13)
        tex_ctx.bezierCurveTo(-23,21,-29,30,-36,28)
        tex_ctx.moveTo(31,12)
        tex_ctx.bezierCurveTo(28,21,34,30,40,28)
        tex_ctx.stroke()
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='rgb(59, 142, 209)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(17, 32, 43)'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*4,256)
        tex_ctx.fillStyle='rgb(17, 32, 43)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.lineWidth=6
        tex_ctx.translate(128/2,128/2)
        tex_ctx.fillStyle='rgb(243, 73, 45)'
        tex_ctx.strokeStyle='rgb(243, 73, 45)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-43+7,-20)
        tex_ctx.bezierCurveTo(-35+7,-28,-22+7,-19,-25+7,-16)
        tex_ctx.moveTo(43-7,-20)
        tex_ctx.bezierCurveTo(35-7,-28,22-7,-19,25-7,-16)
        tex_ctx.stroke()
        tex_ctx.lineWidth=4
        tex_ctx.beginPath()
        tex_ctx.moveTo(-26,23)
        tex_ctx.bezierCurveTo(-11,40,16,32,26,21)
        tex_ctx.bezierCurveTo(13,58,-20,32,-26,23)
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='rgb(243, 73, 45)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(17, 32, 43)'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*5,256)
        tex_ctx.fillStyle='rgb(59, 94, 157)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.lineWidth=4
        tex_ctx.translate(128/2,128/2)
        tex_ctx.fillStyle='rgb(182, 220, 248)'
        tex_ctx.strokeStyle='rgb(182, 220, 248)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-13,-25)
        tex_ctx.bezierCurveTo(-16,-9,-41,-6,-39,-26)
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.moveTo(-39,-26)
        tex_ctx.bezierCurveTo(-24,-23,-13,-20,-8,-29)
        tex_ctx.stroke()
        tex_ctx.translate(51,0)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-13,-25)
        tex_ctx.bezierCurveTo(-16,-9,-41,-6,-39,-26)
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.moveTo(-39,-26)
        tex_ctx.bezierCurveTo(-24,-23,-13,-20,-8,-29)
        tex_ctx.stroke()
        tex_ctx.scale(1.45,1.45)
        tex_ctx.translate(-12,35)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-13,-25)
        tex_ctx.bezierCurveTo(-16,-9,-41,-6,-39,-26)
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.moveTo(-39,-26)
        tex_ctx.bezierCurveTo(-24,-23,-13,-20,-8,-29)
        tex_ctx.stroke()
        tex_ctx.translate(12,-35)
        tex_ctx.scale(1/1.45,1/1.45)
        tex_ctx.translate(-51,0)
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='rgb(59, 142, 209)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(59, 94, 157)'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*6,256)
        tex_ctx.fillStyle='rgb(241,241,241)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.lineWidth=6
        tex_ctx.translate(128/2,128/2)
        tex_ctx.fillStyle='rgb(243, 73, 45)'
        tex_ctx.strokeStyle='rgb(243, 73, 45)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-16,29)
        tex_ctx.bezierCurveTo(-5,42,0,37,10,35)
        tex_ctx.stroke()
        tex_ctx.lineWidth=4
        tex_ctx.beginPath()
        tex_ctx.moveTo(-49,-25)
        tex_ctx.bezierCurveTo(-11,-13,23,-25,45,-36)
        tex_ctx.bezierCurveTo(45,19,22,13,2,-11)
        tex_ctx.bezierCurveTo(-10,22,-36,13,-49,-25)
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='rgb(243, 73, 45)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(241,241,241)'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*7,256)
        tex_ctx.fillStyle='rgb(160,160,160)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.lineWidth=6
        tex_ctx.translate(128/2,128/2)
        tex_ctx.fillStyle='rgb(0,0,0)'
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-41,-35)
        tex_ctx.bezierCurveTo(-41,-32,-22,-25,-18,-28)
        tex_ctx.moveTo(41,-35)
        tex_ctx.bezierCurveTo(41,-32,22,-25,18,-28)
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.moveTo(-15,40-8)
        tex_ctx.bezierCurveTo(5,24-8,-5,24-8,15,40-8)
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.ellipse(-28,-14,7,9,0,0,7)
        tex_ctx.ellipse(28,-14,7,9,0,0,7)
        tex_ctx.fill()
        tex_ctx.fillRect(-53.5,11.4,23,9)
        tex_ctx.fillRect(53.5-23,11.4,23,9)
        tex_ctx.fillStyle='rgb(160,160,160)'
        tex_ctx.beginPath()
        tex_ctx.ellipse(-32,-12,3,5,0,0,7)
        tex_ctx.ellipse(24,-12,3,5,0,0,7)
        tex_ctx.fill()
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='rgb(240,240,240)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(160,160,160)'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*8,256)
        tex_ctx.fillStyle='rgb(242, 255, 255)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.lineWidth=6
        tex_ctx.translate(128/2,128/2)
        tex_ctx.strokeStyle='rgb(100,100,150)'
        tex_ctx.beginPath()
        tex_ctx.translate(-65,-52)
        tex_ctx.moveTo(35,15)
        tex_ctx.bezierCurveTo(25,22,15,41,30,49)
        tex_ctx.bezierCurveTo(52,54,43,18,33,37)
        tex_ctx.translate(65*2,-9)
        tex_ctx.scale(-1,1)
        tex_ctx.moveTo(35,15)
        tex_ctx.bezierCurveTo(25,22,15,41,30,49)
        tex_ctx.bezierCurveTo(52,54,43,18,33,37)
        tex_ctx.scale(-1,1)
        tex_ctx.translate(-65,9+53)
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.moveTo(7+4,11)
        tex_ctx.bezierCurveTo(4,40,-10+4,35,-12+4,31)
        tex_ctx.bezierCurveTo(-13+4,12,-1+4,22,7+4,11)
        tex_ctx.stroke()
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='rgb(242, 255, 255)'
        tex_ctx.fillRect(0,128-1,128,128.5)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*9,256)
        tex_ctx.fillStyle='rgb(242, 255, 255)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.lineWidth=6
        tex_ctx.translate(128/2,128/2)
        tex_ctx.strokeStyle='rgb(100,100,150)'
        tex_ctx.beginPath()
        tex_ctx.translate(-65,-52)
        tex_ctx.moveTo(35,15)
        tex_ctx.bezierCurveTo(25,22,15,41,30,49)
        tex_ctx.bezierCurveTo(52,54,43,18,33,37)
        tex_ctx.translate(65*2,-9)
        tex_ctx.scale(-1,1)
        tex_ctx.moveTo(35,15)
        tex_ctx.bezierCurveTo(25,22,15,41,30,49)
        tex_ctx.bezierCurveTo(52,54,43,18,33,37)
        tex_ctx.scale(-1,1)
        tex_ctx.translate(-65,9+53)
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.moveTo(7+4,11)
        tex_ctx.bezierCurveTo(4,40,-10+4,35,-12+4,31)
        tex_ctx.bezierCurveTo(-13+4,12,-1+4,22,7+4,11)
        tex_ctx.stroke()
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='rgb(59, 142, 209)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(17, 32, 43)'
        tex_ctx.fillRect(0,128-1,128,128.5)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*9,256)
        tex_ctx.fillStyle='rgb(17, 32, 43)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.lineWidth=6
        tex_ctx.translate(128/2,128/2)
        tex_ctx.fillStyle='rgb(59, 142, 209)'
        tex_ctx.strokeStyle='rgb(59, 142, 209)'
        tex_ctx.translate(0,10)
        tex_ctx.beginPath()
        tex_ctx.moveTo(64,0+5)
        tex_ctx.lineTo(48,10+2.5)
        tex_ctx.lineTo(60,20)
        tex_ctx.lineTo(48,30-2.5)
        tex_ctx.lineTo(64,40-5)
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.moveTo(-64,0+5)
        tex_ctx.lineTo(-48,10+2.5)
        tex_ctx.lineTo(-60,20)
        tex_ctx.lineTo(-48,30-2.5)
        tex_ctx.lineTo(-64,40-5)
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.moveTo(43,-45)
        tex_ctx.lineTo(14,-40)
        tex_ctx.moveTo(-39,-44)
        tex_ctx.lineTo(-11,-40)
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.ellipse(26,-30,10,13,0,0,7)
        tex_ctx.ellipse(-20,-30,10,13,0,0,7)
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(17, 32, 43)'
        tex_ctx.beginPath()
        tex_ctx.ellipse(19,-28,6,8,0,0,7)
        tex_ctx.ellipse(-26,-27,6,8,0,0,7)
        tex_ctx.fill()
        tex_ctx.translate(0,-10)
        tex_ctx.fillStyle='rgb(59, 142, 209)'
        tex_ctx.translate(-31,51)
        tex_ctx.scale(-1.4,1.4)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-13,-25)
        tex_ctx.bezierCurveTo(-16,-9,-41,-6,-39,-26)
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.moveTo(-39,-26)
        tex_ctx.bezierCurveTo(-24,-23,-13,-20,-8,-29)
        tex_ctx.stroke()
        tex_ctx.scale(1/-1.4,1/1.4)
        tex_ctx.translate(31,-51)
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='rgb(59, 142, 209)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(17, 32, 43)'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*10,256)
        tex_ctx.fillStyle='rgb(17, 32, 43)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.lineWidth=5
        tex_ctx.translate(128/2,128/2)
        tex_ctx.fillStyle='rgb(243,73,45)'
        tex_ctx.strokeStyle=' rgb(243,73,45)'
        tex_ctx.translate(0,10)
        tex_ctx.beginPath()
        tex_ctx.moveTo(64,0+5)
        tex_ctx.lineTo(48,10+2.5)
        tex_ctx.lineTo(60,20)
        tex_ctx.lineTo(48,30-2.5)
        tex_ctx.lineTo(64,40-5)
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.moveTo(-64,0+5)
        tex_ctx.lineTo(-48,10+2.5)
        tex_ctx.lineTo(-60,20)
        tex_ctx.lineTo(-48,30-2.5)
        tex_ctx.lineTo(-64,40-5)
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.moveTo(43,-45)
        tex_ctx.lineTo(14,-40)
        tex_ctx.moveTo(-39,-44)
        tex_ctx.lineTo(-11,-40)
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.ellipse(26,-30,10,13,0,0,7)
        tex_ctx.ellipse(-20,-30,10,13,0,0,7)
        tex_ctx.fill()
        tex_ctx.strokeStyle='rgb(17, 32, 43)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(39,-29)
        tex_ctx.lineTo(0,-22)
        tex_ctx.lineTo(-39,-29)
        tex_ctx.stroke()
        tex_ctx.translate(0,-10)
        tex_ctx.strokeStyle='rgb(243,73,45)'
        tex_ctx.translate(-31,51)
        tex_ctx.scale(-1.4,1.4)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-12,-21)
        tex_ctx.bezierCurveTo(-12,-14,-31,-12,-36,-17)
        tex_ctx.stroke()
        tex_ctx.scale(1/-1.4,1/1.4)
        tex_ctx.translate(31,-51)
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='rgb(243,73,45)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(17, 32, 43)'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*11,256)
        tex_ctx.fillStyle='rgb(50, 190, 71)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.lineWidth=6
        tex_ctx.translate(128/2,128/2)
        tex_ctx.fillStyle='rgb(17, 32, 43)'
        tex_ctx.strokeStyle='rgb(17, 32, 43)'
        tex_ctx.translate(0,10)
        tex_ctx.beginPath()
        tex_ctx.ellipse(22,-30,7,9,0,0,7)
        tex_ctx.ellipse(-22,-30,7,9,0,0,7)
        tex_ctx.fill()
        tex_ctx.fillRect(-41,-44,30,10)
        tex_ctx.fillRect(41-30,-44,30,10)
        tex_ctx.fillStyle='rgb(50, 190, 71)'
        tex_ctx.lineWidth=3
        tex_ctx.beginPath()
        tex_ctx.moveTo(-40,10)
        tex_ctx.lineTo(-36,14)
        tex_ctx.lineTo(-40,18)
        tex_ctx.moveTo(40,10)
        tex_ctx.lineTo(36,14)
        tex_ctx.lineTo(40,18)
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.ellipse(18,-28,4,5,0,0,7)
        tex_ctx.ellipse(-26,-28,4,5,0,0,7)
        tex_ctx.fill()
        tex_ctx.translate(0,-10)
        tex_ctx.lineWidth=6
        tex_ctx.beginPath()
        tex_ctx.moveTo(-15,20)
        tex_ctx.lineTo(0,30)
        tex_ctx.lineTo(15,20)
        tex_ctx.stroke()
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='rgb(17, 32, 43)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(50, 190, 71)'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*12,256)
        tex_ctx.fillStyle='rgb(240, 211, 24)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.lineWidth=6
        tex_ctx.translate(128/2,128/2)
        tex_ctx.fillStyle='rgb(17, 32, 43)'
        tex_ctx.strokeStyle='rgb(17, 32, 43)'
        tex_ctx.translate(0,7)
        tex_ctx.beginPath()
        tex_ctx.ellipse(-26-6,-29,9,9,0,0,7)
        tex_ctx.ellipse(26-5,-29,9,9,0,0,7)
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.moveTo(-39,-34)
        tex_ctx.bezierCurveTo(-28,-46,-19,-38,-14,-32)
        tex_ctx.moveTo(-42+55,-34)
        tex_ctx.bezierCurveTo(-28+55,-46,-19+55,-38,-14+55,-32)
        tex_ctx.translate(0,-16)
        tex_ctx.moveTo(-37,23)
        tex_ctx.bezierCurveTo(-10,38,24,31,42,21)
        tex_ctx.moveTo(-36,15)
        tex_ctx.bezierCurveTo(-36,21,-35,28,-44,29)
        tex_ctx.moveTo(44,12)
        tex_ctx.bezierCurveTo(40,21,46,30,48,28)
        tex_ctx.stroke()
        tex_ctx.translate(0,10)
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='rgb(17, 32, 43)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(240, 211, 24)'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*13,256)
        tex_ctx.fillStyle='rgb(252, 186, 3)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.lineWidth=4
        tex_ctx.translate(128/2,128/2)
        tex_ctx.fillStyle='rgb(99, 73, 39)'
        tex_ctx.beginPath()
        tex_ctx.translate(-25,0)
        tex_ctx.moveTo(-8,-64)
        tex_ctx.bezierCurveTo(0,-30,0,-30,8,-64)
        tex_ctx.translate(25,0)
        tex_ctx.moveTo(-8,-64)
        tex_ctx.bezierCurveTo(0,-20,0,-20,8,-64)
        tex_ctx.translate(25,0)
        tex_ctx.moveTo(-8,-64)
        tex_ctx.bezierCurveTo(0,-30,0,-30,8,-64)
        tex_ctx.translate(-25,0)
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(17, 32, 43)'
        tex_ctx.strokeStyle='rgb(17, 32, 43)'
        tex_ctx.beginPath()
        tex_ctx.translate(-25,-10)
        tex_ctx.scale(1.2,1.5)
        tex_ctx.rotate(0.15)
        tex_ctx.moveTo(-10,0)
        tex_ctx.bezierCurveTo(-8,7,8,7,10,0)
        tex_ctx.bezierCurveTo(8,-7,-8,-7,-10,0)
        tex_ctx.setTransform(1,0,0,1,0,0)
        tex_ctx.translate(128*13+128/2,256+128/2)
        tex_ctx.translate(25,-10)
        tex_ctx.scale(1.2,1.5)
        tex_ctx.rotate(-0.15)
        tex_ctx.moveTo(-10,0)
        tex_ctx.bezierCurveTo(-8,7,8,7,10,0)
        tex_ctx.bezierCurveTo(8,-7,-8,-7,-10,0)
        tex_ctx.setTransform(1,0,0,1,0,0)
        tex_ctx.translate(128*13+128/2,256+128/2)
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.moveTo(-7,10)
        tex_ctx.bezierCurveTo(-5,13,5,13,7,10)
        tex_ctx.moveTo(0,13)
        tex_ctx.lineTo(0,22)
        tex_ctx.moveTo(-20,20)
        tex_ctx.bezierCurveTo(-10,28,-5,28,0,20)
        tex_ctx.moveTo(20,20)
        tex_ctx.bezierCurveTo(10,28,5,28,0,20)
        tex_ctx.moveTo(-31,14)
        tex_ctx.lineTo(-62,0)
        tex_ctx.moveTo(-31,22)
        tex_ctx.lineTo(-62,27)
        tex_ctx.moveTo(31,14)
        tex_ctx.lineTo(62,0)
        tex_ctx.moveTo(31,22)
        tex_ctx.lineTo(62,27)
        tex_ctx.stroke()
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='rgb(99, 73, 39)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(252, 186, 3)'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*14,256)
        tex_ctx.fillStyle='rgb(117, 184, 235)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.lineWidth=8
        tex_ctx.translate(128/2,128/2)
        tex_ctx.fillStyle='rgb(255,255,255)'
        tex_ctx.strokeStyle='rgb(255,255,255)'
        tex_ctx.beginPath()
        tex_ctx.translate(0,17)
        tex_ctx.moveTo(-20,0)
        tex_ctx.lineTo(0,15)
        tex_ctx.lineTo(20,0)
        tex_ctx.translate(0,-14)
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.scale(0.4*0.9,0.6*0.9)
        tex_ctx.translate(-75,-37)
        tex_ctx.moveTo(0,40)
        tex_ctx.bezierCurveTo(10,10,10,10,40,0)
        tex_ctx.bezierCurveTo(10,-10,10,-10,0,-40)
        tex_ctx.bezierCurveTo(-10,-10,-10,-10,-40,0)
        tex_ctx.bezierCurveTo(-10,10,-10,10,0,40)
        tex_ctx.translate(75*2,0)
        tex_ctx.moveTo(0,40)
        tex_ctx.bezierCurveTo(10,10,10,10,40,0)
        tex_ctx.bezierCurveTo(10,-10,10,-10,0,-40)
        tex_ctx.bezierCurveTo(-10,-10,-10,-10,-40,0)
        tex_ctx.bezierCurveTo(-10,10,-10,10,0,40)
        tex_ctx.fill()
        tex_ctx.setTransform(1,0,0,1,0,0)
        tex_ctx.translate(128*14,256)
        tex_ctx.fillStyle='rgb(255,255,255)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(117, 184, 235)'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*15,256)
        tex_ctx.fillStyle='rgb(27, 42, 53)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.lineWidth=6
        tex_ctx.translate(128/2,128/2)
        tex_ctx.fillStyle='rgb(243, 73, 45)'
        tex_ctx.strokeStyle='rgb(243, 73, 45)'
        tex_ctx.beginPath()
        tex_ctx.translate(0,10)
        tex_ctx.moveTo(-37,-47)
        tex_ctx.bezierCurveTo(-26,-36,-12,-45,-20,-36)
        tex_ctx.moveTo(37,-47)
        tex_ctx.bezierCurveTo(26,-36,12,-45,20,-36)
        tex_ctx.moveTo(-25,-37)
        tex_ctx.ellipse(-21,-31,6,10,0,0,7)
        tex_ctx.moveTo(25,-37)
        tex_ctx.ellipse(21,-31,6,10,3.141592,0,7)
        tex_ctx.translate(0,-3)
        
        for(let i=-1.2,j=0,inc=Math.PI*2/15;i<Math.PI-1.0;i+=inc,j++){
            
            let ri=(j-1)%2===0?15:30,r=j%2===0?15:30
            
            tex_ctx.moveTo(Math.sin(i-inc)*ri*1.25,Math.cos(i-inc)*ri+10)
            tex_ctx.lineTo(Math.sin(i)*r*1.25,Math.cos(i)*r+10)
        }
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        tex_ctx.translate(128*15,256)
        tex_ctx.fillStyle='rgb(243, 73, 45)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(27, 42, 53)'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*0,256*2)
        tex_ctx.fillStyle='rgb(150, 106, 85)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.translate(128/2,128/2)
        tex_ctx.lineWidth=6
        tex_ctx.fillStyle='rgb(255,255,255)'
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-37,-10)
        tex_ctx.bezierCurveTo(-35,-55,-4,-29,-15,-10)
        tex_ctx.bezierCurveTo(-16,-5,-36,-5,-37,-10)
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(0,0,0)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-30,-7)
        tex_ctx.bezierCurveTo(-32,-22,-15,-22,-15,-10)
        tex_ctx.bezierCurveTo(-16,-5,-36,-5,-30,-7)
        tex_ctx.fill()
        tex_ctx.scale(-1,1)
        tex_ctx.fillStyle='rgb(255,255,255)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-37,-10)
        tex_ctx.bezierCurveTo(-35,-55,-4,-29,-15,-10)
        tex_ctx.bezierCurveTo(-16,-5,-36,-5,-37,-10)
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(0,0,0)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-30,-7)
        tex_ctx.bezierCurveTo(-32,-22,-15,-22,-15,-10)
        tex_ctx.bezierCurveTo(-16,-5,-36,-5,-30,-7)
        tex_ctx.fill()
        tex_ctx.fillRect(30.6,1.6,25,12)
        tex_ctx.beginPath()
        tex_ctx.ellipse(1,2,4,4,0,0,7)
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.moveTo(-19,21)
        tex_ctx.bezierCurveTo(-6,34,9,32,19,21)
        tex_ctx.lineWidth=4
        tex_ctx.stroke()
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='rgb(255, 200, 18)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(150, 106, 85)'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*1,256*2)
        tex_ctx.fillStyle='rgb(229, 178, 56)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.translate(128/2,128/2)
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle='rgb(0,0,0)'
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.beginPath()
        tex_ctx.ellipse(-26,-21,8,12,0,0,7)
        tex_ctx.ellipse(26,-21,8,12,0,0,7)
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.moveTo(-40,-38)
        tex_ctx.lineTo(-21,-33)
        tex_ctx.moveTo(40,-38)
        tex_ctx.lineTo(21,-33)
        tex_ctx.moveTo(0,3)
        tex_ctx.lineTo(0,32)
        tex_ctx.bezierCurveTo(0,40,-26,40,-26,32)
        tex_ctx.moveTo(0,32)
        tex_ctx.bezierCurveTo(0,40,26,40,26,32)
        tex_ctx.stroke()
        ellipse(0,3,8,5,0,0,7)
        ellipse(24,10,3,3,0,0,7)
        ellipse(32,21,3,3,0,0,7)
        ellipse(16,21,3,3,0,0,7)
        ellipse(0,3,8,5,0,0,7)
        ellipse(-24,10,3,3,0,0,7)
        ellipse(-32,21,3,3,0,0,7)
        ellipse(-16,21,3,3,0,0,7)
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='rgb(229, 207, 56)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(229, 178, 56)'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*2,256*2)
        tex_ctx.fillStyle='rgb(27, 42, 53)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.translate(128/2,128/2)
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle='rgb(68, 152, 213)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-64,-50)
        tex_ctx.bezierCurveTo(-34,-24,34,-24,64,-50)
        tex_ctx.lineTo(64,-8)
        tex_ctx.bezierCurveTo(44,20,-44,20,-64,-8)
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(27, 42, 53)'
        ellipse(-27,-13,12,7,0.3)
        ellipse(27,-13,12,7,-0.3)
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='rgb(27, 42, 53)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*3,256*2)
        tex_ctx.fillStyle='rgb(159, 159, 159)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.translate(128/2,128/2)
        tex_ctx.lineWidth=3
        tex_ctx.fillStyle='rgb(255,255,255)'
        tex_ctx.strokeStyle='rgb(255,0,0)'
        ellipse(-24,-23,5,5)
        ellipse(24,-23,5,5)
        tex_ctx.beginPath()
        tex_ctx.translate(-41,0)
        tex_ctx.moveTo(0,0)
        tex_ctx.lineTo(-5,5)
        tex_ctx.moveTo(0+7,0)
        tex_ctx.lineTo(-5+7,5)
        tex_ctx.moveTo(0+7+7,0)
        tex_ctx.lineTo(-5+7+7,5)
        tex_ctx.translate(70,0)
        tex_ctx.moveTo(0,0)
        tex_ctx.lineTo(-5,5)
        tex_ctx.moveTo(0+7,0)
        tex_ctx.lineTo(-5+7,5)
        tex_ctx.moveTo(0+7+7,0)
        tex_ctx.lineTo(-5+7+7,5)
        tex_ctx.translate(-29,0)
        tex_ctx.stroke()
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='rgb(159, 159, 159)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*4,256*2)
        tex_ctx.fillStyle='rgb(27, 42, 53)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.translate(128/2,128/2)
        tex_ctx.fillStyle='rgb(229, 207, 56)'
        tex_ctx.fillRect(-10,-20,20,10)
        tex_ctx.fillRect(-64,-40,35,50)
        ellipse(-64+35,-15,25,25)
        tex_ctx.fillRect(64-35,-40,35,50)
        ellipse(64-35,-15,25,25)
        tex_ctx.fillStyle='rgb(27, 42, 53)'
        ellipse(-27,-15,8,12)
        ellipse(27,-15,8,12)
        tex_ctx.fillStyle='rgb(229, 207, 56)'
        ellipse(21,-16,4,6)
        ellipse(-32,-16,4,6)
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='rgb(229, 207, 56)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(27, 42, 53)'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*5,256*2)
        tex_ctx.fillStyle='rgb(27, 42, 53)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.translate(128/2,128/2-8)
        tex_ctx.lineWidth=6
        tex_ctx.fillStyle='rgb(241, 241, 241)'
        tex_ctx.strokeStyle='rgb(241, 241, 241)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-11,-33)
        tex_ctx.bezierCurveTo(-19,-26,-18,-20,-38,-16)
        tex_ctx.moveTo(6,-33)
        tex_ctx.bezierCurveTo(9,-26,11,-20,30,-16)
        tex_ctx.stroke()
        tex_ctx.lineWidth=4
        tex_ctx.beginPath()
        tex_ctx.moveTo(-13,40)
        tex_ctx.bezierCurveTo(-3,39,6,39,13,40)
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(159, 159, 159)'
        tex_ctx.strokeStyle='rgb(159, 159, 159)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-12,-4)
        tex_ctx.bezierCurveTo(-15,23,-41,14,-37,-3)
        tex_ctx.lineTo(-12,-4)
        tex_ctx.moveTo(12,-4)
        tex_ctx.bezierCurveTo(8,27,40,12,34,-3)
        tex_ctx.lineTo(12,-4)
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(241, 241, 241)'
        tex_ctx.strokeStyle='rgb(241, 241, 241)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-12,-4)
        tex_ctx.bezierCurveTo(-22,13,-32,3,-37,-3)
        tex_ctx.lineTo(-12,-4)
        tex_ctx.moveTo(12,-4)
        tex_ctx.bezierCurveTo(19,13,32,3,34,-3)
        tex_ctx.lineTo(12,-4)
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.translate(-128/2,-128/2+8)
        tex_ctx.fillStyle='rgb(159, 159, 159)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(27, 42, 53)'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*6,256*2)
        tex_ctx.fillStyle='rgb(27, 42, 53)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.translate(128/2,128/2-15)
        tex_ctx.lineWidth=6
        tex_ctx.fillStyle='rgb(241, 241, 241)'
        tex_ctx.strokeStyle='rgb(241, 241, 241)'
        ellipse(-20,-13,5,10)
        ellipse(20,-13,5,10)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-20,-5)
        tex_ctx.bezierCurveTo(-25,-7,-29,-7,-34,-3)
        tex_ctx.moveTo(-20,-5)
        tex_ctx.bezierCurveTo(-25,1,-29,-7,-24,-3)
        tex_ctx.moveTo(20,-5)
        tex_ctx.bezierCurveTo(25,-7,29,-7,34,-3)
        tex_ctx.moveTo(20,-5)
        tex_ctx.bezierCurveTo(25,1,29,-7,24,-3)
        tex_ctx.moveTo(-10,50)
        tex_ctx.bezierCurveTo(-10,16,10,15,10,50)
        tex_ctx.bezierCurveTo(2,49,3,46,-10,50)
        tex_ctx.stroke()
        tex_ctx.lineWidth=3
        tex_ctx.beginPath()
        tex_ctx.moveTo(-2,24)
        tex_ctx.bezierCurveTo(-5,55,1,15,2,25)
        tex_ctx.moveTo(5,29)
        tex_ctx.bezierCurveTo(1,58,2,15,7,30)
        tex_ctx.stroke()
        tex_ctx.translate(-128/2,-128/2+15)
        tex_ctx.fillStyle='rgb(241, 241, 241)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(27, 42, 53)'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*7,256*2)
        tex_ctx.fillStyle='rgb(241, 241, 241)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.translate(128/2,128/2-5)
        tex_ctx.lineWidth=3.5
        tex_ctx.fillStyle='rgb(59, 142, 209)'
        tex_ctx.strokeStyle='rgb(241, 241, 241)'
        ellipse(-22,-20,9,12)
        ellipse(22,-20,9,12)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-32,-20)
        tex_ctx.lineTo(0,-18)
        tex_ctx.lineTo(32,-20)
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-2)
        tex_ctx.lineTo(0,13)
        tex_ctx.lineTo(32,5)
        tex_ctx.fill()
        for(let i=0.18;i<Math.PI;i+=Math.PI/8){
            
            ellipse(Math.cos(i)*40,Math.sin(i)*30+15,6,6)
        }
        tex_ctx.translate(-128/2,-128/2+4)
        tex_ctx.fillStyle='rgb(59, 142, 209)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(241, 241, 241)'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*8,256*2)
        tex_ctx.fillStyle='rgb(27, 42, 53)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.translate(128/2,128/2-5)
        tex_ctx.lineWidth=4
        tex_ctx.fillStyle='rgb(245, 139, 222)'
        ellipse(-30,6,8,6)
        ellipse(30,6,8,6)
        tex_ctx.fillStyle='rgb(230,230,230)'
        ellipse(-20,-11,5,5)
        ellipse(20,-11,5,5)
        ellipse(0,4,3,3)
        tex_ctx.strokeStyle='rgb(230,230,230)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-9,19)
        tex_ctx.bezierCurveTo(0,24,0,23,9,20)
        tex_ctx.stroke()
        tex_ctx.translate(-128/2,-128/2+4)
        tex_ctx.fillStyle='rgb(136, 220, 232)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(27, 42, 53)'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillStyle='rgb(241, 241, 241)'
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*9,256*2)
        tex_ctx.fillStyle='#0E141E'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.translate(128/2,128/2+7)
        tex_ctx.lineWidth=6
        tex_ctx.fillStyle='#bde5ea'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-53,-50)
        tex_ctx.bezierCurveTo(-47,-24,-28,1,-16,-5)
        tex_ctx.bezierCurveTo(-30,-12,-38,-29,-53,-50)
        tex_ctx.moveTo(56,-55)
        tex_ctx.bezierCurveTo(45,-7,29,-4,16,-1)
        tex_ctx.bezierCurveTo(30,-12,23,-5,56,-55)
        tex_ctx.scale(0.75,1)
        tex_ctx.moveTo(-22,23)
        tex_ctx.bezierCurveTo(-16,34,5,48,31,22)
        tex_ctx.bezierCurveTo(14,28,6,45,-16,23)
        tex_ctx.fill()
        ellipse(-24,23,9,3,0.1)
        tex_ctx.scale(1/0.75,1)
        tex_ctx.translate(-128/2,-128/2-7)
        tex_ctx.fillStyle='#2F4E66'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='#0E141E'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*10,256*2)
        tex_ctx.translate(128/2,128/2)
        tex_ctx.lineWidth=7
        tex_ctx.fillStyle='#e6a363'
        tex_ctx.fillRect(-128*0.5,-128*0.5,128,128)
        tex_ctx.fillStyle='rgb(0,0,0,0.3)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-64,64)
        tex_ctx.lineTo(-64,20)
        tex_ctx.bezierCurveTo(-66,-49,-18,-56,-10,-1)
        tex_ctx.lineTo(-10,64)
        tex_ctx.moveTo(64,64)
        tex_ctx.lineTo(64,20)
        tex_ctx.bezierCurveTo(66,-49,18,-56,10,-1)
        tex_ctx.lineTo(10,64)
        tex_ctx.fill()
        tex_ctx.fillStyle='#e6a363'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-12,-25)
        tex_ctx.bezierCurveTo(-11,49,-30,40,-12,64)
        tex_ctx.moveTo(12,-25)
        tex_ctx.bezierCurveTo(11,49,30,40,12,64)
        tex_ctx.fill()
        tex_ctx.fillRect(-12,-11,24,75)
        tex_ctx.fillStyle='rgb(45, 50, 53)'
        ellipse(0,49,10,8)
        tex_ctx.fillStyle='rgb(33, 35, 37)'
        ellipse(0,52,5,3)
        tex_ctx.fillStyle='rgb(20,20,20)'
        ellipse(-19,-9,5,12)
        ellipse(19,-9,5,12)
        tex_ctx.fillStyle='#e6a363'
        ellipse(16,-12,2,3)
        ellipse(-22,-12,2,3)
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='rgb(140, 84, 43)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='#e6a363'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*11,256*2)
        tex_ctx.translate(128/2,128/2)
        tex_ctx.lineWidth=7
        tex_ctx.fillStyle='#FFE089'
        tex_ctx.fillRect(-128*0.5,-128*0.5,128,128)
        tex_ctx.fillStyle='rgb(166, 138, 105)'
        tex_ctx.strokeStyle='rgb(166, 138, 105)'
        ellipse(-42,0-5,22,22)
        ellipse(-33,-8-5,20,20)
        ellipse(-27,-16-5,20,20)
        tex_ctx.lineWidth=7
        tex_ctx.beginPath()
        tex_ctx.moveTo(13,-40)
        tex_ctx.bezierCurveTo(15,-42,29,-43,32,-35)
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(50,50,50)'
        tex_ctx.strokeStyle='rgb(50,50,50)'
        ellipse(-19,-19,6,8)
        ellipse(19,-19,6,8)
        tex_ctx.fillStyle='rgb(166, 138, 105)'
        ellipse(-23,-22,3,3)
        tex_ctx.fillStyle='#FFE089'
        ellipse(16,-22,3,3)
        tex_ctx.fillStyle='rgb(50,50,50)'
        tex_ctx.lineWidth=4
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,25-2)
        tex_ctx.bezierCurveTo(5,33,25,39,25,19+5)
        tex_ctx.lineTo(29,19+7)
        tex_ctx.lineTo(23,19+3)
        tex_ctx.moveTo(0,25-2)
        tex_ctx.bezierCurveTo(-5,33,-25,39,-25,19+5)
        tex_ctx.lineTo(-29,19+7)
        tex_ctx.lineTo(-23,19+3)
        tex_ctx.stroke()
        tex_ctx.lineWidth=5
        tex_ctx.beginPath()
        tex_ctx.moveTo(-5,3)
        tex_ctx.bezierCurveTo(-3,7,3,7,5,3)
        tex_ctx.closePath()
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(255,100,100)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-7,32)
        tex_ctx.bezierCurveTo(-10,43,13,53,7,32)
        tex_ctx.lineTo(0,26)
        tex_ctx.fill()
        tex_ctx.strokeStyle='rgba(0,200,255,0.5)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(4,40)
        tex_ctx.bezierCurveTo(-10,43,13,47,8,40)
        tex_ctx.stroke()
        tex_ctx.lineWidth=2
        tex_ctx.strokeStyle='rgba(0,0,0,0.2)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-1,31)
        tex_ctx.bezierCurveTo(3,33,1,37,2,38)
        tex_ctx.stroke()
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='rgb(140, 84, 43)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='#FFE089'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*12,256*2)
        tex_ctx.fillStyle='#ad2222'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.translate(128/2,128/2+18)
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle='rgb(255,255,255,0.3)'
        tex_ctx.strokeStyle='rgb(250, 218, 218)'
        tex_ctx.beginPath()
        tex_ctx.translate(-25,-23)
        tex_ctx.moveTo(-1,-3)
        tex_ctx.bezierCurveTo(3,0,4,0,8,8)
        tex_ctx.bezierCurveTo(-2,5,-1,5,-6,8)
        tex_ctx.translate(50,0)
        tex_ctx.moveTo(-1,-3)
        tex_ctx.bezierCurveTo(3,0,4,0,8,8)
        tex_ctx.bezierCurveTo(-2,5,-1,5,-6,8)
        tex_ctx.stroke()
        tex_ctx.translate(-25,23)
        tex_ctx.lineWidth=5
        tex_ctx.beginPath()
        tex_ctx.moveTo(-10,15)
        tex_ctx.bezierCurveTo(-7,23,2,23,10,15)
        tex_ctx.stroke()
        ellipse(-36,3,6,6)
        ellipse(36,3,6,6)
        tex_ctx.fillStyle='#ad2222'
        ellipse(23,-21,5,4)
        ellipse(-27,-21,5,4)
        tex_ctx.translate(-128/2,-128/2-18)
        tex_ctx.fillStyle='#227d3d'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='#cd4242'
        tex_ctx.fillRect(0,0,5,5)
        tex_ctx.fillStyle='#ad2222'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*13,256*2)
        tex_ctx.fillStyle='#12471a'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.translate(128/2,128/2)
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle='#baf893'
        function rect(x,y,w,h){tex_ctx.fillRect(x-w*0.5,y-h*0.5,w,h)}
        
        for(let x=-2;x<2;x++){
            
            for(let y=-2;y<2;y++){
                
                if(!(x===-2&&y===-2||x===1&&y===1||x===-2&&y===1||x===1&&y===-2)){
                    
                    rect(x*7-25,y*7+-24,5,5)
                    rect(x*7+31,y*7+-24,5,5)
                }
            }
        }
        
        for(let x=-7;x<7;x++){
            
            for(let y=-3;y<3;y++){
                
                if(!(y<3-Math.abs(x+0.5)&&y<0||y>3-Math.abs((x+0.5)*0.5)||y===2)&&y!==-3){
                    
                    rect(x*7+5,y*7+28,5,5)
                }
            }
        }
        
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='#BAB088'
        tex_ctx.fillRect(0,127,128,128)
        tex_ctx.fillStyle='rgb(0,255,0)'
        tex_ctx.fillRect(0,128-1,128,128/3|0|0)
        tex_ctx.fillStyle='#717779'
        tex_ctx.fillRect(0,213,128,128/3|0|0+1)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        let pi2=Math.PI*2,side=pi2/10
        
        function star(c,x=0,y=0){
            
            let bx=64+x,by=128+64+y,ex=0
            tex_ctx.fillStyle=c
            tex_ctx.beginPath()
            
            for(let i=0,j=0;i<Math.PI*2;i+=side,j++){
                
                let srad=j%2===0?20:45
                
                if(j===0){
                    
                    tex_ctx.moveTo(Math.sin(i+ex)*srad+bx,Math.cos(i+ex)*srad*0.6666667+by)
                    
                } else {
                    
                    tex_ctx.lineTo(Math.sin(i+ex)*srad+bx,Math.cos(i+ex)*srad*0.6666667+by)
                }
            }
            
            tex_ctx.fill()
        }
        
        tex_ctx.translate(0,768)
        tex_ctx.fillStyle='rgb(21, 27, 43)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.strokeStyle='rgb(220,220,220)'
        tex_ctx.lineWidth=9
        tex_ctx.lineCap='round'
        tex_ctx.lineJoin='round'
        tex_ctx.beginPath()
        tex_ctx.moveTo((128/2)-(128/5),30)
        tex_ctx.lineTo((128/2)-(128/5),50)
        tex_ctx.moveTo((128/2)+(128/5),30)
        tex_ctx.lineTo((128/2)+(128/5),50)
        tex_ctx.closePath()
        tex_ctx.moveTo(128/2,100)
        tex_ctx.lineTo((128/2)-(128/5),80)
        tex_ctx.moveTo(128/2,100)
        tex_ctx.lineTo((128/2)+(128/5),80)
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(150, 145, 49)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(21, 27, 43)'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        star('rgb(255,255,0)')
        
        tex_ctx.fillStyle='rgb(26, 255, 0)'
        tex_ctx.fillRect(128,0,128,128)
        tex_ctx.strokeStyle='rgb(255,255,255)'
        tex_ctx.lineWidth=18
        tex_ctx.beginPath()
        tex_ctx.moveTo((128/2)-(128/5)+128,30)
        tex_ctx.lineTo((128/2)-(128/5)+128,50)
        tex_ctx.moveTo((128/2)+(128/5)+128,30)
        tex_ctx.lineTo((128/2)+(128/5)+128,50)
        tex_ctx.closePath()
        tex_ctx.stroke()
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.lineWidth=9
        tex_ctx.beginPath()
        tex_ctx.moveTo((128/2)-(128/5)+124,45)
        tex_ctx.lineTo((128/2)-(128/5)+124,53)
        tex_ctx.moveTo((128/2)-(128/5)+173,45)
        tex_ctx.lineTo((128/2)-(128/5)+173,53)
        tex_ctx.closePath()
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(22, 217, 0)'
        tex_ctx.fillRect(128,128,128,128)
        tex_ctx.fillStyle='rgb(26, 255, 0)'
        tex_ctx.fillRect(128,128-1,128,128/3|0)
        tex_ctx.fillRect(128,213,128,128/3|0+1)
        star('rgb(29, 133, 0)',128)
        
        tex_ctx.fillStyle='rgb(41, 40, 34)'
        tex_ctx.fillRect(128*2,0,128,128)
        tex_ctx.strokeStyle='rgb(232, 232, 232)'
        tex_ctx.lineWidth=4
        tex_ctx.translate(0,-13)
        tex_ctx.beginPath()
        tex_ctx.moveTo((128/2)-(128/5)+123*2,86)
        tex_ctx.lineTo((128/2)-(128/5)+125*2,53)
        tex_ctx.moveTo((128/2)-(128/5)+125*2,53)
        tex_ctx.lineTo((128/2)-(128/5)+128*2,62)
        tex_ctx.moveTo((128/2)-(128/5)+159.5*2,59)
        tex_ctx.lineTo((128/2)-(128/5)+161*2,27)
        tex_ctx.moveTo((128/2)-(128/5)+161*2,27)
        tex_ctx.lineTo((128/2)-(128/5)+164*2,39)
        tex_ctx.moveTo((128/2)-(128/5)+128*2,94)
        tex_ctx.bezierCurveTo((128/2)-(128/5)+135*2,114,(128/2)-(128/5)+157*2,109,(128/2)-(128/5)+155*2,74)
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.ellipse(279,89,8,6,-0.2,0,7)
        tex_ctx.ellipse(352,59,8,6,-0.2,0,7)
        tex_ctx.moveTo(0,0)
        tex_ctx.ellipse(365,62,2,2,-0.2,0,7)
        tex_ctx.closePath()
        tex_ctx.translate(0,13)
        tex_ctx.fillStyle='rgb(232, 232, 232)'
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(133, 133, 133)'
        tex_ctx.fillRect(128*2,128,128,128)
        tex_ctx.fillStyle='rgb(41, 40, 34)'
        tex_ctx.fillRect(128*2,128-1,128,128/3|0)
        tex_ctx.fillRect(128*2,213,128,128/3|0+1)
        star('rgb(232, 232, 232)',128*2)
        
        tex_ctx.translate(128*3,0)
        tex_ctx.fillStyle='#f64800'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.strokeStyle='rgb(235, 212, 35)'
        tex_ctx.fillStyle='rgb(235, 212, 35)'
        tex_ctx.lineWidth=3
        tex_ctx.beginPath()
        tex_ctx.translate(63,-5)
        tex_ctx.moveTo(128/2-40+10,55-5)
        tex_ctx.lineTo(128/2-40-5+10,40-5)
        tex_ctx.moveTo(128/2-40-5-5+10,55-5)
        tex_ctx.lineTo(128/2-40-5+10,40-5)
        tex_ctx.moveTo(128/2-40-5-5,55-5)
        tex_ctx.bezierCurveTo(128/2-40-5-5,71-5,128/2-40-5-5+20,71-5,128/2-40-5-5+20,55-5)
        tex_ctx.arc(20,29,0,0,6)
        tex_ctx.scale(-1,1)
        tex_ctx.moveTo(128/2-40+10,55-5)
        tex_ctx.lineTo(128/2-40-5+10,40-5)
        tex_ctx.moveTo(128/2-40-5-5+10,55-5)
        tex_ctx.lineTo(128/2-40-5+10,40-5)
        tex_ctx.moveTo(128/2-40-5-5,55-5)
        tex_ctx.bezierCurveTo(128/2-40-5-5,71-5,128/2-40-5-5+20,71-5,128/2-40-5-5+20,55-5)
        tex_ctx.arc(20,29,0,0,6)
        tex_ctx.closePath()
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.scale(-1,1)
        tex_ctx.translate(-65,5)
        tex_ctx.beginPath()
        tex_ctx.moveTo(128*0.5-35,90)
        tex_ctx.lineTo(128*0.5-30,90+15)
        tex_ctx.moveTo(128*0.5-30,90+15)
        tex_ctx.lineTo(128*0.5-25,90)
        tex_ctx.translate(10,0)
        tex_ctx.moveTo(128*0.5-35,90)
        tex_ctx.lineTo(128*0.5-30,90+15)
        tex_ctx.moveTo(128*0.5-30,90+15)
        tex_ctx.lineTo(128*0.5-25,90)
        tex_ctx.translate(10,0)
        tex_ctx.moveTo(128*0.5-35,90)
        tex_ctx.lineTo(128*0.5-30,90+15)
        tex_ctx.moveTo(128*0.5-30,90+15)
        tex_ctx.lineTo(128*0.5-25,90)
        tex_ctx.translate(10,0)
        tex_ctx.moveTo(128*0.5-35,90)
        tex_ctx.lineTo(128*0.5-30,90+15)
        tex_ctx.moveTo(128*0.5-30,90+15)
        tex_ctx.lineTo(128*0.5-25,90)
        tex_ctx.translate(10,0)
        tex_ctx.moveTo(128*0.5-35,90)
        tex_ctx.lineTo(128*0.5-30,90+15)
        tex_ctx.moveTo(128*0.5-30,90+15)
        tex_ctx.lineTo(128*0.5-25,90)
        tex_ctx.translate(10,0)
        tex_ctx.moveTo(128*0.5-35,90)
        tex_ctx.lineTo(128*0.5-30,90+15)
        tex_ctx.moveTo(128*0.5-30,90+15)
        tex_ctx.lineTo(128*0.5-25,90)
        tex_ctx.translate(10,0)
        tex_ctx.moveTo(128*0.5-35,90)
        tex_ctx.lineTo(128*0.5-30,90+15)
        tex_ctx.moveTo(128*0.5-30,90+15)
        tex_ctx.lineTo(128*0.5-25,90)
        tex_ctx.stroke()
        tex_ctx.translate(-58,0)
        tex_ctx.fillStyle='rgb(255, 153, 0)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='#f64800'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        star('rgb(255,255,0)')
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(0,768)
        tex_ctx.translate(128*4,0)
        tex_ctx.fillStyle='#65feec'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.strokeStyle='rgb(11, 183, 189)'
        tex_ctx.lineWidth=10
        tex_ctx.beginPath()
        tex_ctx.moveTo(128*0.5-35,59)
        tex_ctx.bezierCurveTo(56,62,44,39,128*0.5-35,28)
        tex_ctx.translate(55,0)
        tex_ctx.moveTo(128*0.5-35,59)
        tex_ctx.bezierCurveTo(56,62,44,39,128*0.5-35,28)
        tex_ctx.translate(-55,0)
        tex_ctx.moveTo(128*0.5+-10,104)
        tex_ctx.bezierCurveTo(89,110,69,86,128*0.5+-5,86)
        tex_ctx.bezierCurveTo(40,85,45,102,128*0.5+-11,104)
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(25, 189, 230)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='#65feec'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        star('rgb(18, 156, 161)')
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(0,768)
        tex_ctx.translate(128*5,0)
        tex_ctx.fillStyle='#fffeb1'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.strokeStyle='rgb(70, 71, 40)'
        tex_ctx.lineWidth=3.5
        tex_ctx.beginPath()
        tex_ctx.translate(4,0)
        tex_ctx.moveTo(36,30)
        tex_ctx.bezierCurveTo(25,17,15,47,30,56)
        tex_ctx.bezierCurveTo(50,55,36,32,33,45)
        tex_ctx.translate(50,0)
        tex_ctx.moveTo(36,30)
        tex_ctx.bezierCurveTo(25,17,15,47,30,56)
        tex_ctx.bezierCurveTo(50,55,36,32,33,45)
        tex_ctx.translate(-54,0)
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(176, 171, 113)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='#fffeb1'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        star('rgb(97, 96, 87)')
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(0,768)
        tex_ctx.translate(128*6,0)
        tex_ctx.fillStyle='rgb(247, 247, 247)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.strokeStyle='rgb(168, 168, 168)'
        tex_ctx.fillStyle='rgb(168, 168, 168)'
        tex_ctx.lineWidth=3
        tex_ctx.beginPath()
        tex_ctx.ellipse(128*0.5-30,40,15,13,0,0,7)
        tex_ctx.rect(0,35,128,8)
        tex_ctx.ellipse(128*0.5+30,40,15,13,0,0,7)
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.strokeStyle='rgb(247, 247, 247)'
        tex_ctx.lineWidth=5
        tex_ctx.beginPath()
        tex_ctx.moveTo(128*0.5-30,32)
        tex_ctx.bezierCurveTo(128*0.5-36,35,128*0.5-35,32,128*0.5-40,40)
        tex_ctx.translate(61,0)
        tex_ctx.moveTo(128*0.5-30,32)
        tex_ctx.bezierCurveTo(128*0.5-36,35,128*0.5-35,32,128*0.5-40,40)
        tex_ctx.translate(-61,0)
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(186, 186, 186)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(247, 247, 247)'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        star('rgb(97, 96, 87)')
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(0,768)
        tex_ctx.translate(128*7,0)
        tex_ctx.fillStyle='rgb(255, 250, 145)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.strokeStyle='rgb(186, 145, 98)'
        tex_ctx.lineWidth=3
        tex_ctx.beginPath()
        tex_ctx.translate(32,20)
        
        for(let i=-0.71,j=0,inc=Math.PI*2/34;i<Math.PI*2*0.18;i+=inc,j++){
            
            let ri=(j-1)%2===0?25:28,r=j%2===0?22:31
            tex_ctx.moveTo(Math.sin(i-inc)*ri,Math.cos(i-inc)*ri)
            tex_ctx.lineTo(Math.sin(i)*r,Math.cos(i)*r)
        }
        
        tex_ctx.translate(60,0)
        
        for(let i=-0.71,j=0,inc=Math.PI*2/34;i<Math.PI*2*0.18;i+=inc,j++){
            
            let ri=(j-1)%2===0?25:28,r=j%2===0?22:31
            tex_ctx.moveTo(Math.sin(i-inc)*ri,Math.cos(i-inc)*ri)
            tex_ctx.lineTo(Math.sin(i)*r,Math.cos(i)*r)
        }
        
        tex_ctx.stroke()
        tex_ctx.translate(-32,60)
        tex_ctx.beginPath()
        
        for(let i=-0.74,j=0,inc=Math.PI*2/39;i<Math.PI*2*0.17;i+=inc,j++){
            
            let ri=(j-1)%2===0?25:28,r=j%2===0?22:31
            tex_ctx.moveTo(Math.sin(i-inc)*ri*1.5,Math.cos(i-inc)*ri)
            tex_ctx.lineTo(Math.sin(i)*r*1.5,Math.cos(i)*r)
        }
        
        tex_ctx.lineWidth=5
        tex_ctx.stroke()
        tex_ctx.translate(-32-28,-80)
        tex_ctx.fillStyle='rgb(255, 250, 145)'
        tex_ctx.fillRect(0,128-1,128,(128/3|0)*3+3)
        star('rgb(89, 255, 233)')
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(0,768)
        tex_ctx.translate(128*8,0)
        tex_ctx.fillStyle='rgb(242, 142, 242)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.strokeStyle='rgb(163, 91, 163)'
        tex_ctx.lineWidth=4
        tex_ctx.beginPath()
        tex_ctx.moveTo(2,20)
        tex_ctx.bezierCurveTo(128/2,128/2-40,128/2,128/2-40,126,20)
        tex_ctx.moveTo(128/2-25,45)
        tex_ctx.lineTo(128/2-25,60)
        tex_ctx.moveTo(128/2+25,45)
        tex_ctx.lineTo(128/2+25,60)
        tex_ctx.moveTo(128/2-30,100)
        tex_ctx.bezierCurveTo(128/2,128/2+30,128/2,128/2+30,128/2+30,100)
        tex_ctx.moveTo(128/2-23-10,95)
        tex_ctx.lineTo(128/2-19-10,106)
        tex_ctx.moveTo(128/2+23+10,95)
        tex_ctx.lineTo(128/2+19+10,106)
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(189, 113, 189)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(242, 142, 242)'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        star('rgb(114, 64, 135)')
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(0,768)
        tex_ctx.translate(128*9,0)
        tex_ctx.fillStyle='rgb(255, 0, 0)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.strokeStyle='rgb(100,0,0)'
        tex_ctx.fillStyle='rgb(100,0,0)'
        tex_ctx.lineWidth=4
        tex_ctx.translate(128/2,128/2)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-40,-41)
        tex_ctx.lineTo(-35,4)
        tex_ctx.lineTo(-26,20)
        tex_ctx.lineTo(-23,-32)
        tex_ctx.lineTo(-32,-23)
        tex_ctx.scale(-1,1)
        tex_ctx.moveTo(-40,-41)
        tex_ctx.lineTo(-35,4)
        tex_ctx.lineTo(-26,20)
        tex_ctx.lineTo(-23,-32)
        tex_ctx.lineTo(-32,-23)
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.moveTo(54,16)
        tex_ctx.lineTo(44,30)
        tex_ctx.moveTo(-54,16)
        tex_ctx.lineTo(-44,30)
        tex_ctx.moveTo(-19,37)
        tex_ctx.lineTo(-10,40)
        tex_ctx.lineTo(0,50)
        tex_ctx.lineTo(10,40)
        tex_ctx.lineTo(18,37)
        tex_ctx.stroke()
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='rgb(242, 71, 56)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(255, 0, 0)'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        star('rgb(23, 255, 35)')
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(1280,768)
        tex_ctx.fillStyle='rgb(255,255,255)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.fillStyle='rgb(199, 199, 199)'
        tex_ctx.lineWidth=4
        tex_ctx.translate(128/2,128/2)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-128/2,-128/2)
        tex_ctx.bezierCurveTo(-28,-58,0,0,0,10)
        tex_ctx.bezierCurveTo(0,0,-28+128/2,-58,128/2,-128/2)
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.moveTo(-20,-18)
        tex_ctx.lineTo(-13,-6)
        tex_ctx.moveTo(20,-18)
        tex_ctx.lineTo(13,-6)
        tex_ctx.strokeStyle='rgb(199, 199, 199)'
        tex_ctx.stroke()
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='rgb(255, 255, 0)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(255,255,255)'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        star('rgb(0,255,0)')
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*11,768)
        tex_ctx.fillStyle='#79d29b'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.strokeStyle='rgb(29, 145, 128)'
        tex_ctx.lineWidth=7
        tex_ctx.translate(128/2,128/2)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-30,-35)
        tex_ctx.bezierCurveTo(-40,-20,-40,-15,-30,-20)
        tex_ctx.bezierCurveTo(-20,-2,-20,-35,-30,-35)
        tex_ctx.moveTo(-30,-35)
        tex_ctx.lineTo(-34,-11)
        tex_ctx.lineTo(-25,-30)
        tex_ctx.lineTo(-37,-23)
        tex_ctx.moveTo(30,-35)
        tex_ctx.bezierCurveTo(40,-20,40,-15,30,-20)
        tex_ctx.bezierCurveTo(20,-2,20,-35,30,-35)
        tex_ctx.moveTo(30,-35)
        tex_ctx.lineTo(34,-11)
        tex_ctx.lineTo(25,-30)
        tex_ctx.lineTo(37,-23)
        for(let i=-0.74,j=0,inc=Math.PI*2/39;i<Math.PI*2*0.17;i+=inc,j++){
            
            let r=29+Math.sin(i*183)*3
            tex_ctx.moveTo(Math.sin(i-inc)*r,Math.cos(i-inc)*r)
            tex_ctx.lineTo(Math.sin(i)*r,Math.cos(i)*r)
        }
        tex_ctx.stroke()
        tex_ctx.strokeStyle='rgb(27, 219, 145)'
        tex_ctx.lineWidth=4
        tex_ctx.beginPath()
        tex_ctx.moveTo(-30,-30)
        tex_ctx.bezierCurveTo(-30,-33,-34,-20,-31,-20)
        tex_ctx.moveTo(30,-30)
        tex_ctx.bezierCurveTo(30,-33,34,-20,31,-20)
        tex_ctx.stroke()
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='rgb(80, 171, 117)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='#79d29b'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        star('rgb(16, 89, 77)')
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*12,768)
        tex_ctx.fillStyle='rgb(108, 0, 255)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.strokeStyle='rgb(178, 133, 242)'
        tex_ctx.lineWidth=13
        tex_ctx.scale(0.3,0.3)
        tex_ctx.translate(-92,-62)
        function ellipse(x,y,w,h,r=0){
            tex_ctx.beginPath()
            tex_ctx.ellipse(x,y,w,h,r,0,6)
            tex_ctx.fill()
        }
        function bezier(a,b,c,d,e,f,g,h,fill,stroke){
            tex_ctx.beginPath()
            tex_ctx.moveTo(a,b)
            tex_ctx.bezierCurveTo(c,d,e,f,g,h)
            
            if(fill)
            tex_ctx.fill()
            if(stroke)
            tex_ctx.stroke()
        }
        function line(a,b,c,d){
            tex_ctx.beginPath()
            tex_ctx.moveTo(a,b)
            tex_ctx.lineTo(c,d)
            tex_ctx.stroke()
        }
        
        tex_ctx.fillStyle='rgb(155, 105, 255)'
        ellipse(186,172,18,18)
        ellipse(413,135,18,18)
        tex_ctx.fillStyle='rgb(178, 133, 242)'
        ellipse(315,261,33,33)
        bezier(159,238,181,223,187,216,233,227,false,true)
        bezier(178,212,225,223,187,216,233,227,false,true)
        tex_ctx.translate(0,25)
        bezier(406,211,496,190,382,104,431,198,true,true)
        tex_ctx.lineWidth=20
        bezier(273,325,276,416,422,355,369,299,true,true)
        bezier(250,311,289,343,378,301,373,295,false,true)
        tex_ctx.beginPath()
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(108, 0, 255)'
        ellipse(416,182,19*0.5,31*0.5)
        tex_ctx.translate(92,38)
        tex_ctx.scale(1/0.3,1/0.3)
        tex_ctx.fillStyle='rgb(134, 113, 227)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(108, 0, 255)'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        star('rgb(255,255,0)')
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*13,768)
        tex_ctx.fillStyle='rgb(32, 189, 160)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.strokeStyle='rgb(242, 145, 255)'
        tex_ctx.lineWidth=11
        tex_ctx.translate(128/2,128/2)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-30,-30)
        tex_ctx.bezierCurveTo(-28,-44,-12,-10,-32,-11)
        tex_ctx.moveTo(16,-34)
        tex_ctx.bezierCurveTo(39,-26,5,-17,25,-14)
        tex_ctx.moveTo(-29,23)
        tex_ctx.bezierCurveTo(-14,22,-19,37,0,32)
        tex_ctx.bezierCurveTo(25,22,-8,25,28,22)
        tex_ctx.stroke()
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='rgb(191, 94, 255)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(32, 189, 160)'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        star('rgb(242, 145, 255)')
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*14,768)
        tex_ctx.fillStyle='rgb(84, 0, 14)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.strokeStyle='rgb(227, 111, 111)'
        tex_ctx.fillStyle='rgb(245, 147, 147)'
        tex_ctx.lineWidth=6
        tex_ctx.translate(128/2,128/2)
        tex_ctx.fillRect(-128*0.5,-128*0.5,128*0.5,128)
        tex_ctx.beginPath()
        tex_ctx.moveTo(30,-10)
        tex_ctx.lineTo(30,-25)
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.ellipse(30,-24,10,5,0,-3.0,-12.7)
        tex_ctx.stroke()
        tex_ctx.strokeStyle='rgb(84, 0, 14)'
        tex_ctx.fillStyle='rgb(84, 0, 14)'
        tex_ctx.fillRect(-128*0.5,128*0.5,128,129)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-30,-10)
        tex_ctx.lineTo(-30,-25)
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.ellipse(-30,-24,10,5,0,-3.0,-12.7)
        tex_ctx.stroke()
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='rgb(245, 147, 147)'
        tex_ctx.translate(0,128)
        tex_ctx.beginPath()
        tex_ctx.moveTo(128*0.5,0)
        tex_ctx.lineTo(0,128*0.5)
        tex_ctx.lineTo(128*0.5,128)
        tex_ctx.lineTo(128,128*0.5)
        tex_ctx.fill()
        star('rgb(207, 72, 72)',0,-128)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*15,768)
        tex_ctx.fillStyle='#ff3326'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.strokeStyle='rgb(0,255,0)'
        tex_ctx.fillStyle='rgb(0,255,0)'
        tex_ctx.lineWidth=6
        tex_ctx.translate(128/2,128/2)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-45,-30)
        tex_ctx.bezierCurveTo(-45,-40,-20,-40,-13,-23)
        tex_ctx.moveTo(-19,40)
        tex_ctx.bezierCurveTo(-34,7,32,8,32,40)
        tex_ctx.scale(-1,1)
        tex_ctx.moveTo(-45,-30)
        tex_ctx.bezierCurveTo(-45,-40,-20,-40,-13,-23)
        tex_ctx.stroke()
        tex_ctx.scale(-1,1)
        tex_ctx.beginPath()
        tex_ctx.ellipse(-24,-11,7,10,0,0,7)
        tex_ctx.ellipse(24,-11,7,10,0,0,7)
        tex_ctx.fill()
        tex_ctx.fillStyle='#ff3326'
        tex_ctx.beginPath()
        tex_ctx.ellipse(-28,-5,2,4,0,0,7)
        tex_ctx.ellipse(21,-5,2,4,0,0,7)
        tex_ctx.fill()
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='#ff3326'
        tex_ctx.fillRect(0,128,128,128/3)
        tex_ctx.fillRect(0,214,128,128/3|0+1)
        tex_ctx.fillStyle='rgb(199, 0, 0)'
        tex_ctx.fillRect(0,128+128/3|0,128,128/3|0+5)
        star('rgb(97, 0, 0)')
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*0,256+768)
        tex_ctx.fillStyle='rgb(255,255,255)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.fillStyle='rgb(255, 0, 0)'
        tex_ctx.lineWidth=6
        tex_ctx.translate(128/2,128/2)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-64,64)
        tex_ctx.lineTo(-64,-32)
        tex_ctx.lineTo(-32,-64)
        tex_ctx.bezierCurveTo(5,0,-5,0,32,-64)
        tex_ctx.lineTo(64,-32)
        tex_ctx.lineTo(64,64)
        tex_ctx.bezierCurveTo(-25,0,25,0,-64,64)
        tex_ctx.moveTo(-20,45-8)
        tex_ctx.bezierCurveTo(-10,60-8,10,60-8,20,45-8)
        tex_ctx.bezierCurveTo(10,55-8,-10,55-8,-20,45-8)
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.ellipse(-25,0,4,3,0,0,7)
        tex_ctx.rect(-33,0,10,1)
        tex_ctx.moveTo(25,0)
        tex_ctx.ellipse(25,0,4,3,0,0,7)
        tex_ctx.rect(23,0,10,1)
        tex_ctx.fillStyle=tex_ctx.strokeStyle='rgb(255, 255, 255)'
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='rgb(255, 173, 173)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(255,255,255)'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        star('rgb(255, 0, 0)')
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*1,256+768)
        tex_ctx.fillStyle='rgb(255,255,255)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.fillStyle='rgb(0,0, 255)'
        tex_ctx.lineWidth=5
        tex_ctx.translate(128/2,128/2)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-64,-64)
        tex_ctx.lineTo(0,-25)
        tex_ctx.lineTo(64,-64)
        tex_ctx.lineTo(64,-64+20)
        tex_ctx.lineTo(50,-64+30)
        tex_ctx.lineTo(64,-64+40)
        tex_ctx.lineTo(64,-64+60)
        tex_ctx.lineTo(50,-64+70)
        tex_ctx.lineTo(64,-64+90)
        tex_ctx.lineTo(15,-64+90)
        tex_ctx.bezierCurveTo(15,10,-15,10,-15,-64+90)
        tex_ctx.lineTo(-64,-64+90)
        tex_ctx.lineTo(-50,-64+70)
        tex_ctx.lineTo(-64,-64+60)
        tex_ctx.lineTo(-64,-64+40)
        tex_ctx.lineTo(-50,-64+30)
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.moveTo(-30,45)
        tex_ctx.lineTo(-20,55)
        tex_ctx.lineTo(20,55)
        tex_ctx.lineTo(30,45)
        tex_ctx.moveTo(-30+3,45-3)
        tex_ctx.lineTo(-30-3,45+3)
        tex_ctx.moveTo(30-3,45-3)
        tex_ctx.lineTo(30+3,45+3)
        tex_ctx.strokeStyle='rgb(0, 0, 255)'
        tex_ctx.stroke()
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='rgb(161, 161, 255)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(255,255,255)'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        star('rgb(0,0, 255)')
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*2,256+769)
        tex_ctx.fillStyle='rgb(0,0,0)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.lineWidth=6
        tex_ctx.translate(128/2,128/2)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-45,-40)
        tex_ctx.lineTo(-45,40)
        tex_ctx.moveTo(-30,-40)
        tex_ctx.lineTo(-30,40)
        tex_ctx.moveTo(-15,-40)
        tex_ctx.lineTo(-15,40)
        tex_ctx.moveTo(0,-40)
        tex_ctx.lineTo(0,40)
        tex_ctx.moveTo(45,-40)
        tex_ctx.lineTo(45,40)
        tex_ctx.moveTo(30,-40)
        tex_ctx.lineTo(30,40)
        tex_ctx.moveTo(15,-40)
        tex_ctx.lineTo(15,40)
        tex_ctx.fillStyle='rgb(255,255,255)'
        tex_ctx.strokeStyle='rgb(255,255,255)'
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.moveTo(-64,-64)
        tex_ctx.lineTo(-64,-40)
        tex_ctx.bezierCurveTo(-39,-15,39,-15,64,-40)
        tex_ctx.lineTo(64,-64)
        tex_ctx.moveTo(-64,64)
        tex_ctx.lineTo(-64,10)
        tex_ctx.bezierCurveTo(-39,25,39,25,64,10)
        tex_ctx.lineTo(64,64)
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.moveTo(-15,40)
        tex_ctx.lineTo(0,55)
        tex_ctx.lineTo(15,40)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.stroke()
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='rgb(200,200,80)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(255,255,255)'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        star('rgb(117, 101, 0)')
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*3,256+768)
        tex_ctx.fillStyle='rgb(0, 72, 255)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.lineWidth=6
        tex_ctx.translate(128/2,128/2)
        tex_ctx.fillStyle='rgb(0, 219, 208)'
        tex_ctx.strokeStyle='rgb(0, 219, 208)'
        tex_ctx.beginPath()
        tex_ctx.ellipse(-26,-29,6,8,9.2,7,15)
        tex_ctx.ellipse(26,-29,7,9,-9.2,7,15)
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.ellipse(0,-2,5,5,-9.2,7,15)
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.moveTo(-26,23)
        tex_ctx.bezierCurveTo(-10,38,24,31,29,21)
        tex_ctx.moveTo(-25,13)
        tex_ctx.bezierCurveTo(-23,21,-29,30,-36,28)
        tex_ctx.moveTo(31,12)
        tex_ctx.bezierCurveTo(28,21,34,30,40,28)
        tex_ctx.stroke()
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='rgb(0, 155, 227)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(0, 72, 255)'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        star('rgb(0, 219, 208)')
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*4,256+768)
        tex_ctx.fillStyle='rgb(87, 10, 0)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.lineWidth=6
        tex_ctx.translate(128/2,128/2)
        tex_ctx.fillStyle='rgb(255, 153, 0)'
        tex_ctx.strokeStyle='rgb(255, 153, 0)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-43+7,-20)
        tex_ctx.bezierCurveTo(-35+7,-28,-22+7,-19,-25+7,-16)
        tex_ctx.moveTo(43-7,-20)
        tex_ctx.bezierCurveTo(35-7,-28,22-7,-19,25-7,-16)
        tex_ctx.stroke()
        tex_ctx.lineWidth=4
        tex_ctx.beginPath()
        tex_ctx.moveTo(-26,23)
        tex_ctx.bezierCurveTo(-11,40,16,32,26,21)
        tex_ctx.bezierCurveTo(13,58,-20,32,-26,23)
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='rgb(176, 62, 0)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(87, 10, 0)'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        star('rgb(255, 153, 0)')
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*5,256+768)
        tex_ctx.fillStyle='#2966ad'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.lineWidth=4
        tex_ctx.translate(128/2,128/2)
        tex_ctx.fillStyle='rgb(19, 0, 191)'
        tex_ctx.strokeStyle='rgb(19, 0, 191)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-13,-25)
        tex_ctx.bezierCurveTo(-16,-9,-41,-6,-39,-26)
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.moveTo(-39,-26)
        tex_ctx.bezierCurveTo(-24,-23,-13,-20,-8,-29)
        tex_ctx.stroke()
        tex_ctx.translate(51,0)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-13,-25)
        tex_ctx.bezierCurveTo(-16,-9,-41,-6,-39,-26)
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.moveTo(-39,-26)
        tex_ctx.bezierCurveTo(-24,-23,-13,-20,-8,-29)
        tex_ctx.stroke()
        tex_ctx.scale(1.45,1.45)
        tex_ctx.translate(-12,35)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-13,-25)
        tex_ctx.bezierCurveTo(-16,-9,-41,-6,-39,-26)
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.moveTo(-39,-26)
        tex_ctx.bezierCurveTo(-24,-23,-13,-20,-8,-29)
        tex_ctx.stroke()
        tex_ctx.translate(12,-35)
        tex_ctx.scale(1/1.45,1/1.45)
        tex_ctx.translate(-51,0)
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='rgb(0, 74, 158)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='#2966ad'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        star('rgb(19, 0, 191)')
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*6,256+768)
        tex_ctx.fillStyle='#f6bca6'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.lineWidth=6
        tex_ctx.translate(128/2,128/2)
        tex_ctx.fillStyle='rgb(107, 0, 0)'
        tex_ctx.strokeStyle='rgb(107, 0, 0)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-16,29)
        tex_ctx.bezierCurveTo(-5,42,0,37,10,35)
        tex_ctx.stroke()
        tex_ctx.lineWidth=4
        tex_ctx.beginPath()
        tex_ctx.moveTo(-49,-25)
        tex_ctx.bezierCurveTo(-11,-13,23,-25,45,-36)
        tex_ctx.bezierCurveTo(45,19,22,13,2,-11)
        tex_ctx.bezierCurveTo(-10,22,-36,13,-49,-25)
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='rgb(201, 84, 66)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='#f6bca6'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        star('rgb(107, 0, 0)')
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*7,256+768)
        tex_ctx.fillStyle='#6badae'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.lineWidth=6
        tex_ctx.translate(128/2,128/2)
        tex_ctx.fillStyle='rgb(0,0,0)'
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-41,-35)
        tex_ctx.bezierCurveTo(-41,-32,-22,-25,-18,-28)
        tex_ctx.moveTo(41,-35)
        tex_ctx.bezierCurveTo(41,-32,22,-25,18,-28)
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.moveTo(-15,40-8)
        tex_ctx.bezierCurveTo(5,24-8,-5,24-8,15,40-8)
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.ellipse(-28,-14,7,9,0,0,7)
        tex_ctx.ellipse(28,-14,7,9,0,0,7)
        tex_ctx.fill()
        tex_ctx.fillRect(-53.5,11.4,23,9)
        tex_ctx.fillRect(53.5-23,11.4,23,9)
        tex_ctx.fillStyle='#6badae'
        tex_ctx.beginPath()
        tex_ctx.ellipse(-32,-12,3,5,0,0,7)
        tex_ctx.ellipse(24,-12,3,5,0,0,7)
        tex_ctx.fill()
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='rgb(111, 206, 217)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='#6badae'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        star('rgb(204, 234, 255)')
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*8,256+768)
        tex_ctx.fillStyle='rgb(242, 255, 255)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.lineWidth=6
        tex_ctx.translate(128/2,128/2)
        tex_ctx.strokeStyle='rgb(100,100,150)'
        tex_ctx.beginPath()
        tex_ctx.translate(-65,-52)
        tex_ctx.moveTo(35,15)
        tex_ctx.bezierCurveTo(25,22,15,41,30,49)
        tex_ctx.bezierCurveTo(52,54,43,18,33,37)
        tex_ctx.translate(65*2,-9)
        tex_ctx.scale(-1,1)
        tex_ctx.moveTo(35,15)
        tex_ctx.bezierCurveTo(25,22,15,41,30,49)
        tex_ctx.bezierCurveTo(52,54,43,18,33,37)
        tex_ctx.scale(-1,1)
        tex_ctx.translate(-65,9+53)
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.moveTo(7+4,11)
        tex_ctx.bezierCurveTo(4,40,-10+4,35,-12+4,31)
        tex_ctx.bezierCurveTo(-13+4,12,-1+4,22,7+4,11)
        tex_ctx.stroke()
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='rgb(242, 255, 255)'
        tex_ctx.fillRect(0,128-1,128,128.5)
        star('rgb(255, 211, 196)')
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*9,256+768)
        tex_ctx.fillStyle='#04058b'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.lineWidth=6
        tex_ctx.translate(128/2,128/2)
        tex_ctx.fillStyle='rgb(64, 235, 235)'
        tex_ctx.strokeStyle='rgb(64, 235, 235)'
        tex_ctx.translate(0,10)
        tex_ctx.beginPath()
        tex_ctx.moveTo(64,0+5)
        tex_ctx.lineTo(48,10+2.5)
        tex_ctx.lineTo(60,20)
        tex_ctx.lineTo(48,30-2.5)
        tex_ctx.lineTo(64,40-5)
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.moveTo(-64,0+5)
        tex_ctx.lineTo(-48,10+2.5)
        tex_ctx.lineTo(-60,20)
        tex_ctx.lineTo(-48,30-2.5)
        tex_ctx.lineTo(-64,40-5)
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.moveTo(43,-45)
        tex_ctx.lineTo(14,-40)
        tex_ctx.moveTo(-39,-44)
        tex_ctx.lineTo(-11,-40)
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.ellipse(26,-30,10,13,0,0,7)
        tex_ctx.ellipse(-20,-30,10,13,0,0,7)
        tex_ctx.fill()
        tex_ctx.fillStyle='#04058b'
        tex_ctx.beginPath()
        tex_ctx.ellipse(19,-28,6,8,0,0,7)
        tex_ctx.ellipse(-26,-27,6,8,0,0,7)
        tex_ctx.fill()
        tex_ctx.translate(0,-10)
        tex_ctx.fillStyle='rgb(64, 235, 235)'
        tex_ctx.translate(-31,51)
        tex_ctx.scale(-1.4,1.4)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-13,-25)
        tex_ctx.bezierCurveTo(-16,-9,-41,-6,-39,-26)
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.moveTo(-39,-26)
        tex_ctx.bezierCurveTo(-24,-23,-13,-20,-8,-29)
        tex_ctx.stroke()
        tex_ctx.scale(1/-1.4,1/1.4)
        tex_ctx.translate(31,-51)
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='rgb(33, 154, 184)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='#04058b'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        star('rgb(64, 235, 235)')
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*10,256+768)
        tex_ctx.fillStyle='#8d0e00'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.lineWidth=5
        tex_ctx.translate(128/2,128/2)
        tex_ctx.fillStyle='rgb(255, 64, 0)'
        tex_ctx.strokeStyle='rgb(255, 64, 0)'
        tex_ctx.translate(0,10)
        tex_ctx.beginPath()
        tex_ctx.moveTo(64,0+5)
        tex_ctx.lineTo(48,10+2.5)
        tex_ctx.lineTo(60,20)
        tex_ctx.lineTo(48,30-2.5)
        tex_ctx.lineTo(64,40-5)
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.moveTo(-64,0+5)
        tex_ctx.lineTo(-48,10+2.5)
        tex_ctx.lineTo(-60,20)
        tex_ctx.lineTo(-48,30-2.5)
        tex_ctx.lineTo(-64,40-5)
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.moveTo(43,-45)
        tex_ctx.lineTo(14,-40)
        tex_ctx.moveTo(-39,-44)
        tex_ctx.lineTo(-11,-40)
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.ellipse(26,-30,10,13,0,0,7)
        tex_ctx.ellipse(-20,-30,10,13,0,0,7)
        tex_ctx.fill()
        tex_ctx.strokeStyle='#8d0e00'
        tex_ctx.beginPath()
        tex_ctx.moveTo(39,-29)
        tex_ctx.lineTo(0,-22)
        tex_ctx.lineTo(-39,-29)
        tex_ctx.stroke()
        tex_ctx.translate(0,-10)
        tex_ctx.strokeStyle='rgb(255, 64, 0)'
        tex_ctx.translate(-31,51)
        tex_ctx.scale(-1.4,1.4)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-12,-21)
        tex_ctx.bezierCurveTo(-12,-14,-31,-12,-36,-17)
        tex_ctx.stroke()
        tex_ctx.scale(1/-1.4,1/1.4)
        tex_ctx.translate(31,-51)
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='rgb(196, 54, 6)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='#8d0e00'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        star('rgb(255, 64, 0)')
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*11,256+768)
        tex_ctx.fillStyle='rgb(50, 190, 71)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.lineWidth=6
        tex_ctx.translate(128/2,128/2)
        tex_ctx.fillStyle='rgb(17, 32, 43)'
        tex_ctx.strokeStyle='rgb(17, 32, 43)'
        tex_ctx.translate(0,10)
        tex_ctx.beginPath()
        tex_ctx.ellipse(22,-30,7,9,0,0,7)
        tex_ctx.ellipse(-22,-30,7,9,0,0,7)
        tex_ctx.fill()
        tex_ctx.fillRect(-41,-44,30,10)
        tex_ctx.fillRect(41-30,-44,30,10)
        tex_ctx.fillStyle='rgb(50, 190, 71)'
        tex_ctx.lineWidth=3
        tex_ctx.beginPath()
        tex_ctx.moveTo(-40,10)
        tex_ctx.lineTo(-36,14)
        tex_ctx.lineTo(-40,18)
        tex_ctx.moveTo(40,10)
        tex_ctx.lineTo(36,14)
        tex_ctx.lineTo(40,18)
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.ellipse(18,-28,4,5,0,0,7)
        tex_ctx.ellipse(-26,-28,4,5,0,0,7)
        tex_ctx.fill()
        tex_ctx.translate(0,-10)
        tex_ctx.lineWidth=6
        tex_ctx.beginPath()
        tex_ctx.moveTo(-15,20)
        tex_ctx.lineTo(0,30)
        tex_ctx.lineTo(15,20)
        tex_ctx.stroke()
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='rgb(30, 133, 28)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(50, 190, 71)'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        star('rgb(2, 79, 15)')
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*12,256+768)
        tex_ctx.fillStyle='rgb(0,0,0)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.lineWidth=6
        tex_ctx.translate(128/2,128/2)
        tex_ctx.fillStyle='rgb(255,255,0)'
        tex_ctx.strokeStyle='rgb(255,255,0)'
        tex_ctx.translate(0,7)
        tex_ctx.beginPath()
        tex_ctx.ellipse(-26-6,-29,9,9,0,0,7)
        tex_ctx.ellipse(26-5,-29,9,9,0,0,7)
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.moveTo(-39,-34)
        tex_ctx.bezierCurveTo(-28,-46,-19,-38,-14,-32)
        tex_ctx.moveTo(-42+55,-34)
        tex_ctx.bezierCurveTo(-28+55,-46,-19+55,-38,-14+55,-32)
        tex_ctx.translate(0,-16)
        tex_ctx.moveTo(-37,23)
        tex_ctx.bezierCurveTo(-10,38,24,31,42,21)
        tex_ctx.moveTo(-36,15)
        tex_ctx.bezierCurveTo(-36,21,-35,28,-44,29)
        tex_ctx.moveTo(44,12)
        tex_ctx.bezierCurveTo(40,21,46,30,48,28)
        tex_ctx.stroke()
        tex_ctx.translate(0,10)
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='rgb(125,125,0)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(0,0,0)'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        star('rgb(255,255,0)')
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*13,256+768)
        tex_ctx.fillStyle='rgb(20,20,20)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.lineWidth=4
        tex_ctx.translate(128/2,128/2)
        tex_ctx.fillStyle='rgb(150,150,150)'
        tex_ctx.beginPath()
        tex_ctx.translate(-25,0)
        tex_ctx.moveTo(-8,-64)
        tex_ctx.bezierCurveTo(0,-30,0,-30,8,-64)
        tex_ctx.translate(25,0)
        tex_ctx.moveTo(-8,-64)
        tex_ctx.bezierCurveTo(0,-20,0,-20,8,-64)
        tex_ctx.translate(25,0)
        tex_ctx.moveTo(-8,-64)
        tex_ctx.bezierCurveTo(0,-30,0,-30,8,-64)
        tex_ctx.translate(-25,0)
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(255,255,255)'
        tex_ctx.strokeStyle='rgb(255,255,255)'
        tex_ctx.beginPath()
        tex_ctx.translate(-25,-10)
        tex_ctx.scale(1.2,1.5)
        tex_ctx.rotate(0.15)
        tex_ctx.moveTo(-10,0)
        tex_ctx.bezierCurveTo(-8,7,8,7,10,0)
        tex_ctx.bezierCurveTo(8,-7,-8,-7,-10,0)
        tex_ctx.setTransform(1,0,0,1,0,0)
        tex_ctx.translate(128*13+128/2,256+768+128/2)
        tex_ctx.translate(25,-10)
        tex_ctx.scale(1.2,1.5)
        tex_ctx.rotate(-0.15)
        tex_ctx.moveTo(-10,0)
        tex_ctx.bezierCurveTo(-8,7,8,7,10,0)
        tex_ctx.bezierCurveTo(8,-7,-8,-7,-10,0)
        tex_ctx.setTransform(1,0,0,1,0,0)
        tex_ctx.translate(128*13+128/2,256+768+128/2)
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.moveTo(-7,10)
        tex_ctx.bezierCurveTo(-5,13,5,13,7,10)
        tex_ctx.moveTo(0,13)
        tex_ctx.lineTo(0,22)
        tex_ctx.moveTo(-20,20)
        tex_ctx.bezierCurveTo(-10,28,-5,28,0,20)
        tex_ctx.moveTo(20,20)
        tex_ctx.bezierCurveTo(10,28,5,28,0,20)
        tex_ctx.moveTo(-31,14)
        tex_ctx.lineTo(-62,0)
        tex_ctx.moveTo(-31,22)
        tex_ctx.lineTo(-62,27)
        tex_ctx.moveTo(31,14)
        tex_ctx.lineTo(62,0)
        tex_ctx.moveTo(31,22)
        tex_ctx.lineTo(62,27)
        tex_ctx.stroke()
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='rgb(130,130,130)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(20,20,20)'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        star('rgb(255,255,255)')
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*14,256+768)
        tex_ctx.fillStyle='#0e78fd'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.lineWidth=8
        tex_ctx.translate(128/2,128/2)
        tex_ctx.fillStyle='rgb(255,255,255)'
        tex_ctx.strokeStyle='rgb(255,255,255)'
        tex_ctx.beginPath()
        tex_ctx.translate(0,17)
        tex_ctx.moveTo(-20,0)
        tex_ctx.lineTo(0,15)
        tex_ctx.lineTo(20,0)
        tex_ctx.translate(0,-14)
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.scale(0.4*0.9,0.6*0.9)
        tex_ctx.translate(-75,-37)
        tex_ctx.moveTo(0,40)
        tex_ctx.bezierCurveTo(10,10,10,10,40,0)
        tex_ctx.bezierCurveTo(10,-10,10,-10,0,-40)
        tex_ctx.bezierCurveTo(-10,-10,-10,-10,-40,0)
        tex_ctx.bezierCurveTo(-10,10,-10,10,0,40)
        tex_ctx.translate(75*2,0)
        tex_ctx.moveTo(0,40)
        tex_ctx.bezierCurveTo(10,10,10,10,40,0)
        tex_ctx.bezierCurveTo(10,-10,10,-10,0,-40)
        tex_ctx.bezierCurveTo(-10,-10,-10,-10,-40,0)
        tex_ctx.bezierCurveTo(-10,10,-10,10,0,40)
        tex_ctx.fill()
        tex_ctx.setTransform(1,0,0,1,0,0)
        tex_ctx.translate(128*14,256+768)
        tex_ctx.fillStyle='rgb(161, 206, 255)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='#0e78fd'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        star('rgb(255,255,255)')
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*15,256+768)
        tex_ctx.fillStyle='#563625'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.lineWidth=6
        tex_ctx.translate(128/2,128/2)
        tex_ctx.strokeStyle='rgb(255,0,0)'
        tex_ctx.beginPath()
        tex_ctx.translate(0,10)
        tex_ctx.moveTo(-37,-47)
        tex_ctx.bezierCurveTo(-26,-36,-12,-45,-20,-36)
        tex_ctx.moveTo(37,-47)
        tex_ctx.bezierCurveTo(26,-36,12,-45,20,-36)
        tex_ctx.moveTo(-25,-37)
        tex_ctx.ellipse(-21,-31,6,10,0,0,7)
        tex_ctx.moveTo(25,-37)
        tex_ctx.ellipse(21,-31,6,10,3.141592,0,7)
        tex_ctx.translate(0,-3)
        
        for(let i=-1.2,j=0,inc=Math.PI*2/15;i<Math.PI-1.0;i+=inc,j++){
            
            let ri=(j-1)%2===0?15:30,r=j%2===0?15:30
            
            tex_ctx.moveTo(Math.sin(i-inc)*ri*1.25,Math.cos(i-inc)*ri+10)
            tex_ctx.lineTo(Math.sin(i)*r*1.25,Math.cos(i)*r+10)
        }
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        tex_ctx.translate(128*15,256+768)
        tex_ctx.fillStyle='rgb(148, 59, 43)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='#563625'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        star('rgb(255,0,0)')
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*0,256*2+768)
        tex_ctx.fillStyle='#e9e7aa'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.translate(128/2,128/2)
        tex_ctx.lineWidth=6
        tex_ctx.fillStyle='rgb(255,255,255)'
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-37,-10)
        tex_ctx.bezierCurveTo(-35,-55,-4,-29,-15,-10)
        tex_ctx.bezierCurveTo(-16,-5,-36,-5,-37,-10)
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(0,0,0)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-30,-7)
        tex_ctx.bezierCurveTo(-32,-22,-15,-22,-15,-10)
        tex_ctx.bezierCurveTo(-16,-5,-36,-5,-30,-7)
        tex_ctx.fill()
        tex_ctx.scale(-1,1)
        tex_ctx.fillStyle='rgb(255,255,255)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-37,-10)
        tex_ctx.bezierCurveTo(-35,-55,-4,-29,-15,-10)
        tex_ctx.bezierCurveTo(-16,-5,-36,-5,-37,-10)
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(0,0,0)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-30,-7)
        tex_ctx.bezierCurveTo(-32,-22,-15,-22,-15,-10)
        tex_ctx.bezierCurveTo(-16,-5,-36,-5,-30,-7)
        tex_ctx.fill()
        tex_ctx.fillRect(30.6,1.6,25,12)
        tex_ctx.beginPath()
        tex_ctx.ellipse(1,2,4,4,0,0,7)
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.moveTo(-19,21)
        tex_ctx.bezierCurveTo(-6,34,9,32,19,21)
        tex_ctx.lineWidth=4
        tex_ctx.stroke()
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='rgb(181, 155, 69)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='#e9e7aa'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        star('rgb(82, 77, 41)')
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*1,256*2+768)
        tex_ctx.fillStyle='rgb(220,220,220)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.translate(128/2,128/2)
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle='rgb(0,0,0)'
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.beginPath()
        tex_ctx.ellipse(-26,-21,8,12,0,0,7)
        tex_ctx.ellipse(26,-21,8,12,0,0,7)
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.moveTo(-40,-38)
        tex_ctx.lineTo(-21,-33)
        tex_ctx.moveTo(40,-38)
        tex_ctx.lineTo(21,-33)
        tex_ctx.moveTo(0,3)
        tex_ctx.lineTo(0,32)
        tex_ctx.bezierCurveTo(0,40,-26,40,-26,32)
        tex_ctx.moveTo(0,32)
        tex_ctx.bezierCurveTo(0,40,26,40,26,32)
        tex_ctx.stroke()
        ellipse(0,3,8,5,0,0,7)
        ellipse(24,10,3,3,0,0,7)
        ellipse(32,21,3,3,0,0,7)
        ellipse(16,21,3,3,0,0,7)
        ellipse(0,3,8,5,0,0,7)
        ellipse(-24,10,3,3,0,0,7)
        ellipse(-32,21,3,3,0,0,7)
        ellipse(-16,21,3,3,0,0,7)
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='rgb(170,170,170)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(220,220,220)'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        star('rgb(90,90,90)')
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*2,256*2+768)
        tex_ctx.fillStyle='rgb(255,255,255)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.translate(128/2,128/2)
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle='rgb(0, 200, 255)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-64,-50)
        tex_ctx.bezierCurveTo(-34,-24,34,-24,64,-50)
        tex_ctx.lineTo(64,-8)
        tex_ctx.bezierCurveTo(44,20,-44,20,-64,-8)
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(255,255,255)'
        ellipse(-27,-13,12,7,0.3)
        ellipse(27,-13,12,7,-0.3)
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='rgb(255,255,255)'
        tex_ctx.fillRect(0,128,128,128)
        star('rgb(0, 200, 255)')
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*3,256*2+768)
        tex_ctx.fillStyle='#312f30'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.translate(128/2,128/2)
        tex_ctx.lineWidth=3
        tex_ctx.fillStyle='rgb(255,255,255)'
        tex_ctx.strokeStyle='#f65535'
        ellipse(-24,-23,5,5)
        ellipse(24,-23,5,5)
        tex_ctx.beginPath()
        tex_ctx.translate(-41,0)
        tex_ctx.moveTo(0,0)
        tex_ctx.lineTo(-5,5)
        tex_ctx.moveTo(0+7,0)
        tex_ctx.lineTo(-5+7,5)
        tex_ctx.moveTo(0+7+7,0)
        tex_ctx.lineTo(-5+7+7,5)
        tex_ctx.translate(70,0)
        tex_ctx.moveTo(0,0)
        tex_ctx.lineTo(-5,5)
        tex_ctx.moveTo(0+7,0)
        tex_ctx.lineTo(-5+7,5)
        tex_ctx.moveTo(0+7+7,0)
        tex_ctx.lineTo(-5+7+7,5)
        tex_ctx.translate(-29,0)
        tex_ctx.stroke()
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='#312f30'
        tex_ctx.fillRect(0,128,128,128)
        star('#f65535')
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*4,256*2+768)
        tex_ctx.fillStyle='rgb(240,240,240)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.translate(128/2,128/2)
        tex_ctx.fillStyle='rgb(40,40,40)'
        tex_ctx.fillRect(-10,-20,20,10)
        tex_ctx.fillRect(-64,-40,35,50)
        ellipse(-64+35,-15,25,25)
        tex_ctx.fillRect(64-35,-40,35,50)
        ellipse(64-35,-15,25,25)
        tex_ctx.fillStyle='rgb(240,240,240)'
        ellipse(-27,-15,8,12)
        ellipse(27,-15,8,12)
        tex_ctx.fillStyle='rgb(40,40,40)'
        ellipse(21,-16,4,6)
        ellipse(-32,-16,4,6)
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='rgb(138, 138, 138)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(240,240,240)'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        star('rgb(40,40,40)')
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*5,256*2+768)
        tex_ctx.fillStyle='#9f7aa9'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.translate(128/2,128/2-8)
        tex_ctx.lineWidth=6
        tex_ctx.fillStyle='rgb(40,40,40)'
        tex_ctx.strokeStyle='rgb(40,40,40)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-11,-33)
        tex_ctx.bezierCurveTo(-19,-26,-18,-20,-38,-16)
        tex_ctx.moveTo(6,-33)
        tex_ctx.bezierCurveTo(9,-26,11,-20,30,-16)
        tex_ctx.stroke()
        tex_ctx.lineWidth=4
        tex_ctx.beginPath()
        tex_ctx.moveTo(-13,40)
        tex_ctx.bezierCurveTo(-3,39,6,39,13,40)
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(0,0,0,0.5)'
        tex_ctx.strokeStyle='rgb(0,0,0,0.5)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-12,-4)
        tex_ctx.bezierCurveTo(-10,28,-45,14,-37,-3)
        tex_ctx.lineTo(-12,-4)
        tex_ctx.moveTo(12,-4)
        tex_ctx.bezierCurveTo(5,29,45,13,34,-3)
        tex_ctx.lineTo(12,-4)
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(40,40,40)'
        tex_ctx.strokeStyle='rgb(40,40,40)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-12,-4)
        tex_ctx.bezierCurveTo(-22,13,-32,3,-37,-3)
        tex_ctx.lineTo(-12,-4)
        tex_ctx.moveTo(12,-4)
        tex_ctx.bezierCurveTo(19,13,32,3,34,-3)
        tex_ctx.lineTo(12,-4)
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.translate(-128/2,-128/2+8)
        tex_ctx.fillStyle='rgb(118, 76, 130)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='#9f7aa9'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        star('rgb(40,40,40)')
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*6,256*2+768)
        tex_ctx.fillStyle='#765235'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.translate(128/2,128/2-15)
        tex_ctx.lineWidth=6
        tex_ctx.fillStyle='rgb(241, 241, 241)'
        tex_ctx.strokeStyle='rgb(241, 241, 241)'
        ellipse(-20,-13,5,10)
        ellipse(20,-13,5,10)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-20,-5)
        tex_ctx.bezierCurveTo(-25,-7,-29,-7,-34,-3)
        tex_ctx.moveTo(-20,-5)
        tex_ctx.bezierCurveTo(-25,1,-29,-7,-24,-3)
        tex_ctx.moveTo(20,-5)
        tex_ctx.bezierCurveTo(25,-7,29,-7,34,-3)
        tex_ctx.moveTo(20,-5)
        tex_ctx.bezierCurveTo(25,1,29,-7,24,-3)
        tex_ctx.moveTo(-10,50)
        tex_ctx.bezierCurveTo(-10,16,10,15,10,50)
        tex_ctx.bezierCurveTo(2,49,3,46,-10,50)
        tex_ctx.stroke()
        tex_ctx.lineWidth=3
        tex_ctx.beginPath()
        tex_ctx.moveTo(-2,24)
        tex_ctx.bezierCurveTo(-5,55,1,15,2,25)
        tex_ctx.moveTo(5,29)
        tex_ctx.bezierCurveTo(1,58,2,15,7,30)
        tex_ctx.stroke()
        tex_ctx.translate(-128/2,-128/2+15)
        tex_ctx.fillStyle='rgb(191, 160, 128)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='#765235'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        star('rgb(255,255,255)')
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*7,256*2+768)
        tex_ctx.fillStyle='#edfeda'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.translate(128/2,128/2-5)
        tex_ctx.lineWidth=3.5
        tex_ctx.fillStyle='rgb(59, 142, 209)'
        tex_ctx.strokeStyle='#edfeda'
        ellipse(-22,-20,9,12)
        ellipse(22,-20,9,12)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-32,-20)
        tex_ctx.lineTo(0,-18)
        tex_ctx.lineTo(32,-20)
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-2)
        tex_ctx.lineTo(0,13)
        tex_ctx.lineTo(32,5)
        tex_ctx.fill()
        for(let i=0.18;i<Math.PI;i+=Math.PI/8){
            
            ellipse(Math.cos(i)*40,Math.sin(i)*30+15,6,6)
        }
        tex_ctx.translate(-128/2,-128/2+4)
        tex_ctx.fillStyle='rgb(168, 217, 224)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='#edfeda'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        star('rgb(59, 142, 209)')
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*8,256*2+768)
        tex_ctx.fillStyle='rgb(27, 42, 53)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.translate(128/2,128/2-5)
        tex_ctx.lineWidth=4
        tex_ctx.fillStyle='rgb(245, 139, 222)'
        ellipse(-30,6,8,6)
        ellipse(30,6,8,6)
        tex_ctx.fillStyle='rgb(230,230,230)'
        ellipse(-20,-11,5,5)
        ellipse(20,-11,5,5)
        ellipse(0,4,3,3)
        tex_ctx.strokeStyle='rgb(230,230,230)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-9,19)
        tex_ctx.bezierCurveTo(0,24,0,23,9,20)
        tex_ctx.stroke()
        tex_ctx.translate(-128/2,-128/2+4)
        tex_ctx.fillStyle='rgb(139, 91, 140)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='rgb(27, 42, 53)'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillStyle='rgb(241, 241, 241)'
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        star('rgb(239, 120, 255)')
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*9,256*2+768)
        tex_ctx.fillStyle='#0E141E'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.translate(128/2,128/2+7)
        tex_ctx.lineWidth=6
        tex_ctx.fillStyle='#ebed7f'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-53,-50)
        tex_ctx.bezierCurveTo(-47,-24,-28,1,-16,-5)
        tex_ctx.bezierCurveTo(-30,-12,-38,-29,-53,-50)
        tex_ctx.moveTo(56,-55)
        tex_ctx.bezierCurveTo(45,-7,29,-4,16,-1)
        tex_ctx.bezierCurveTo(30,-12,23,-5,56,-55)
        tex_ctx.scale(0.75,1)
        tex_ctx.moveTo(-22,23)
        tex_ctx.bezierCurveTo(-16,34,5,48,31,22)
        tex_ctx.bezierCurveTo(14,28,6,45,-16,23)
        tex_ctx.fill()
        ellipse(-24,23,9,3,0.1)
        tex_ctx.scale(1/0.75,1)
        tex_ctx.translate(-128/2,-128/2-8)
        tex_ctx.fillStyle='#0f4d58'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='#0E141E'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        star('#196a6f')
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*10,256*2+768)
        tex_ctx.translate(128/2,128/2)
        tex_ctx.lineWidth=7
        tex_ctx.fillStyle='#d0b265'
        tex_ctx.fillRect(-128*0.5,-128*0.5,128,128)
        tex_ctx.fillStyle='rgb(0,0,0,0.3)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-64,64)
        tex_ctx.lineTo(-64,20)
        tex_ctx.bezierCurveTo(-66,-49,-18,-56,-10,-1)
        tex_ctx.lineTo(-10,64)
        tex_ctx.moveTo(64,64)
        tex_ctx.lineTo(64,20)
        tex_ctx.bezierCurveTo(66,-49,18,-56,10,-1)
        tex_ctx.lineTo(10,64)
        tex_ctx.fill()
        tex_ctx.fillStyle='#d0b265'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-12,-25)
        tex_ctx.bezierCurveTo(-11,49,-30,40,-12,64)
        tex_ctx.moveTo(12,-25)
        tex_ctx.bezierCurveTo(11,49,30,40,12,64)
        tex_ctx.fill()
        tex_ctx.fillRect(-12,-11,24,75)
        tex_ctx.fillStyle='rgb(45, 50, 53)'
        ellipse(0,49,10,8)
        tex_ctx.fillStyle='rgb(33, 35, 37)'
        ellipse(0,52,5,3)
        tex_ctx.fillStyle='rgb(20,20,20)'
        ellipse(-19,-9,5,12)
        ellipse(19,-9,5,12)
        tex_ctx.fillStyle='#d0b265'
        ellipse(16,-12,2,3)
        ellipse(-22,-12,2,3)
        tex_ctx.translate(-128/2,-128/2-1)
        tex_ctx.fillStyle='#a98a5c'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='#d0b265'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        star('#5f4424')
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*11,256*2+768)
        tex_ctx.translate(128/2,128/2)
        tex_ctx.lineWidth=7
        tex_ctx.fillStyle='#a1a4a1'
        tex_ctx.fillRect(-128*0.5,-128*0.5,128,128)
        tex_ctx.fillStyle='#717471'
        tex_ctx.strokeStyle='#717471'
        ellipse(-42,0-5,22,22)
        ellipse(-33,-8-5,20,20)
        ellipse(-27,-16-5,20,20)
        tex_ctx.lineWidth=7
        tex_ctx.beginPath()
        tex_ctx.moveTo(13,-40)
        tex_ctx.bezierCurveTo(15,-42,29,-43,32,-35)
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(50,50,50)'
        tex_ctx.strokeStyle='rgb(50,50,50)'
        ellipse(-19,-19,6,8)
        ellipse(19,-19,6,8)
        tex_ctx.fillStyle='#717471'
        ellipse(-23,-22,3,3)
        tex_ctx.fillStyle='#a1a4a1'
        ellipse(16,-22,3,3)
        tex_ctx.fillStyle='rgb(50,50,50)'
        tex_ctx.lineWidth=4
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,25-2)
        tex_ctx.bezierCurveTo(5,33,25,39,25,19+5)
        tex_ctx.lineTo(29,19+7)
        tex_ctx.lineTo(23,19+3)
        tex_ctx.moveTo(0,25-2)
        tex_ctx.bezierCurveTo(-5,33,-25,39,-25,19+5)
        tex_ctx.lineTo(-29,19+7)
        tex_ctx.lineTo(-23,19+3)
        tex_ctx.stroke()
        tex_ctx.lineWidth=5
        tex_ctx.beginPath()
        tex_ctx.moveTo(-5,3)
        tex_ctx.bezierCurveTo(-3,7,3,7,5,3)
        tex_ctx.closePath()
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(255,100,100)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-7,32)
        tex_ctx.bezierCurveTo(-10,43,13,53,7,32)
        tex_ctx.lineTo(0,26)
        tex_ctx.fill()
        tex_ctx.strokeStyle='rgba(0,200,255,0.5)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(4,40)
        tex_ctx.bezierCurveTo(-10,43,13,47,8,40)
        tex_ctx.stroke()
        tex_ctx.lineWidth=2
        tex_ctx.strokeStyle='rgba(0,0,0,0.2)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-1,31)
        tex_ctx.bezierCurveTo(3,33,1,37,2,38)
        tex_ctx.stroke()
        tex_ctx.translate(-128/2,-128/2-1)
        tex_ctx.fillStyle='rgb(61, 145, 93)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='#a1a4a1'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        star('rgb(0,255,100)')
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*12,256*2+768)
        tex_ctx.fillStyle='#ad2222'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.translate(128/2,128/2+18)
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle='rgb(255,255,255,0.3)'
        tex_ctx.strokeStyle='rgb(250, 218, 218)'
        tex_ctx.beginPath()
        tex_ctx.translate(-25,-23)
        tex_ctx.moveTo(-1,-3)
        tex_ctx.bezierCurveTo(3,0,4,0,8,8)
        tex_ctx.bezierCurveTo(-2,5,-1,5,-6,8)
        tex_ctx.translate(50,0)
        tex_ctx.moveTo(-1,-3)
        tex_ctx.bezierCurveTo(3,0,4,0,8,8)
        tex_ctx.bezierCurveTo(-2,5,-1,5,-6,8)
        tex_ctx.stroke()
        tex_ctx.translate(-25,23)
        tex_ctx.lineWidth=5
        tex_ctx.beginPath()
        tex_ctx.moveTo(-10,15)
        tex_ctx.bezierCurveTo(-7,23,2,23,10,15)
        tex_ctx.stroke()
        ellipse(-36,3,6,6)
        ellipse(36,3,6,6)
        tex_ctx.fillStyle='#ad2222'
        ellipse(23,-21,5,4)
        ellipse(-27,-21,5,4)
        tex_ctx.translate(-128/2,-128/2-18)
        tex_ctx.fillStyle='rgb(245, 144, 144)'
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillStyle='#ad2222'
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        tex_ctx.fillStyle='rgb(255,235,50)'
        tex_ctx.fillRect(0,0,5,5)
        star('rgb(252, 221, 221)')
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*13,256*2+768)
        tex_ctx.fillStyle='rgb(0,0,255)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.translate(128/2,128/2)
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle='rgb(0, 247, 255)'
        function rect(x,y,w,h){tex_ctx.fillRect(x-w*0.5,y-h*0.5,w,h)}
        
        for(let x=-2;x<2;x++){
            
            for(let y=-2;y<2;y++){
                
                if(!(x===-2&&y===-2||x===1&&y===1||x===-2&&y===1||x===1&&y===-2)){
                    
                    rect(x*7-25,y*7+-24,5,5)
                    rect(x*7+31,y*7+-24,5,5)
                }
            }
        }
        
        for(let x=-7;x<7;x++){
            
            for(let y=-3;y<3;y++){
                
                if(!(y<3-Math.abs(x+0.5)&&y<0||y>3-Math.abs((x+0.5)*0.5)||y===2)&&y!==-3){
                    
                    rect(x*7+5,y*7+28,5,5)
                }
            }
        }
        
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillStyle='rgb(100,100,100)'
        tex_ctx.fillRect(0,127,128,128)
        tex_ctx.fillStyle='rgb(255,0,255)'
        tex_ctx.fillRect(0,128-1,128,128/3|0|0)
        tex_ctx.fillStyle='rgb(0,0,0)'
        tex_ctx.fillRect(0,213,128,128/3|0|0+1)
        star('rgb(217, 28, 201)')
        tex_ctx.setTransform(1,0,0,1,0,0)
    
        tex_ctx.translate(128*14,256*2+768)
        tex_ctx.fillStyle='rgb(255, 255, 99)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.strokeStyle='rgb(0,0,0,0.2)'
        tex_ctx.lineWidth=11
        tex_ctx.translate(128/2,128/2)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-30,-30)
        tex_ctx.bezierCurveTo(-28,-44,-12,-10,-32,-11)
        tex_ctx.moveTo(16,-34)
        tex_ctx.bezierCurveTo(39,-26,5,-17,25,-14)
        tex_ctx.moveTo(-29,23)
        tex_ctx.bezierCurveTo(-14,22,-19,37,0,32)
        tex_ctx.bezierCurveTo(25,22,-8,25,28,22)
        tex_ctx.stroke()
        tex_ctx.translate(-128/2,-128/2)
        tex_ctx.fillRect(0,128,128,128)
        tex_ctx.fillRect(0,128-1,128,128/3|0)
        tex_ctx.fillRect(0,213,128,128/3|0+1)
        tex_ctx.setTransform(1,0,0,1,0,0)
    
        let drawing=[[[-256,2],[101,123],[102,126],[102,131],[102,139],[102,147],[102,158],[102,168],[102,178],[102,186],[102,193],[102,197],[102,198],[103,198],[104,198],[105,198],[107,198],[110,198],[114,198],[119,198],[128,198],[137,198],[144,198],[149,198],[154,198],[160,198],[167,198],[173,198],[178,197],[180,197],[181,197],[182,196],[184,196],[185,196],[186,196],[186,195],[187,195],[188,195],[188,194],[189,194],[190,194],[191,194],[192,194],[192,193],[193,193],[193,192],[195,192],[195,191],[196,190],[196,188],[196,185],[196,181],[196,175],[196,169],[197,162],[197,153],[197,144],[197,140],[197,138],[196,136],[196,135],[195,135],[194,135],[194,134],[193,133],[192,132],[191,131],[190,131],[189,130],[188,130],[187,129],[184,129],[181,129],[176,129],[172,128],[168,127],[165,127],[161,126],[156,125],[151,125],[146,123],[143,123],[141,123],[139,121],[137,121],[134,120],[131,120],[129,120],[127,120],[126,120],[125,120],[123,120],[120,120],[118,120],[116,120],[115,120],[114,120],[113,120],[112,120],[111,120],[110,120],[109,120],[108,120],[107,120],[106,120],[105,120],[104,121],[103,121],[103,122],[103,123],[103,124],[103,125],[102,125],[102,126],[102,127]],[[-256,16.328125],[110,125],[110,124],[110,125],[110,127],[110,132],[110,138],[110,145],[110,153],[110,162],[109,170],[109,179],[107,185],[107,186],[107,185],[107,180],[106,173],[106,165],[106,158],[107,151],[110,143],[111,139],[113,136],[113,137],[113,141],[113,148],[113,157],[111,168],[110,178],[109,187],[109,194],[110,197],[110,198],[111,198],[112,198],[112,195],[113,188],[115,177],[116,163],[118,147],[120,134],[121,128],[122,128],[122,129],[122,130],[122,136],[122,142],[121,152],[121,162],[121,174],[119,185],[117,195],[116,200],[116,201],[116,198],[116,189],[116,175],[116,159],[118,142],[121,129],[123,122],[123,120],[124,120],[124,125],[125,133],[125,144],[125,157],[124,169],[123,181],[122,192],[121,198],[121,200],[121,202],[122,199],[123,191],[124,179],[126,163],[130,144],[132,133],[133,128],[134,126],[134,127],[134,128],[134,135],[134,147],[133,160],[132,174],[131,187],[129,196],[129,201],[129,202],[129,201],[129,199],[129,190],[129,176],[130,160],[134,142],[137,133],[138,129],[138,130],[138,138],[138,152],[137,164],[137,177],[137,186],[137,193],[137,195],[138,196],[139,196],[139,192],[140,183],[142,169],[144,152],[147,140],[148,132],[149,131],[150,140],[150,153],[150,167],[150,178],[150,187],[150,193],[150,194],[151,194],[151,193],[152,188],[152,179],[152,168],[152,156],[152,146],[152,141],[152,140],[152,139],[152,143],[152,157],[151,173],[151,188],[151,196],[152,199],[153,199],[153,198],[153,195],[153,185],[154,171],[155,154],[156,143],[158,135],[158,134],[158,135],[159,143],[159,158],[159,176],[159,191],[159,200],[160,204],[161,204],[161,203],[161,200],[162,188],[163,170],[166,149],[168,133],[169,125],[169,122],[169,130],[169,143],[169,158],[168,172],[168,182],[168,188],[168,191],[169,191],[169,188],[169,180],[169,168],[172,153],[173,142],[174,138],[174,143],[175,155],[176,168],[177,181],[179,189],[182,194],[183,195],[183,194],[183,189],[182,175],[181,159],[181,147],[181,141],[181,139],[180,139],[180,140],[180,145],[180,155],[179,168],[179,182],[180,191],[183,195],[184,195],[185,195],[186,187],[187,176],[189,161],[189,147],[191,137],[191,134],[191,133],[191,134],[191,136],[191,144],[191,153],[190,164],[190,172],[191,177],[191,181],[191,184],[191,186],[192,186],[191,184],[190,182],[190,179],[190,178],[189,177],[188,177]],[[-256,16.328125],[180,121],[179,121],[177,120],[175,120],[173,120],[171,119],[167,118],[164,118],[162,118],[160,118],[158,118],[157,118],[156,118],[155,118],[153,118],[151,118],[149,118],[147,117],[145,117],[143,116],[141,116],[138,116],[135,116],[133,116],[132,116],[130,116],[129,116],[127,116],[125,116],[124,116],[123,116],[122,116],[121,116],[119,116],[119,117],[118,117],[117,119],[115,119],[114,120]],[[-256,16.328125],[122,202],[123,202],[124,202],[126,202],[128,202],[131,202],[133,202],[136,202],[137,202],[140,202],[143,202],[146,202],[149,202],[152,202],[154,202],[155,201],[157,201],[158,201],[159,201],[161,200],[162,200],[163,200],[165,200],[168,200],[170,200],[172,199],[174,199],[175,199],[176,199],[177,199],[178,199],[179,199],[180,199],[182,199],[184,199],[185,199],[187,199],[189,200],[191,201]],[[-256,16.328125],[234,18],[235,18],[234,18],[232,18],[228,16],[223,14],[221,14],[218,12],[216,10],[215,9],[213,8],[211,8],[210,8],[209,7],[208,7]],[[-256,16.328125],[187,120],[188,120],[190,121],[192,121],[196,121],[200,122],[205,122],[208,122],[211,122],[212,122],[214,122],[214,123],[216,123],[218,123],[219,123],[220,124],[221,124],[221,125],[222,128],[222,132],[222,137],[222,142],[222,148],[222,154],[221,162],[220,169],[219,177],[219,183],[219,187],[219,191],[219,193],[219,194],[219,195],[219,197],[219,199],[219,200],[219,201],[219,202],[219,204],[218,205],[218,206],[218,207],[217,207],[216,208],[213,208],[209,208],[204,207],[202,205],[200,205],[200,204],[199,203],[199,200],[199,197],[199,192],[199,184],[199,177],[200,170],[201,162],[202,156],[203,153],[203,152],[203,151],[203,148],[203,144],[203,142],[203,138],[203,135],[203,134],[204,134],[205,135],[205,138],[207,144],[208,153],[208,160],[209,167],[209,171],[209,177],[209,182],[209,186],[209,189],[209,190],[209,192],[209,194],[208,195],[208,194],[208,193],[208,190],[208,187],[207,185],[207,183],[207,182]],[[-16777216,8.25],[133,119],[133,124],[133,129],[133,136],[133,142],[133,149],[134,155],[135,161],[135,168],[135,173],[136,176],[136,179],[137,183],[138,185],[139,185],[139,186],[139,187],[139,189],[139,192],[139,194],[139,198],[139,202],[139,205],[139,208],[139,209],[139,210],[139,211],[139,210],[139,209],[140,208],[141,204],[141,201],[141,196],[141,192],[141,188],[141,184],[141,177],[141,169],[141,162],[140,158],[140,156],[140,152],[140,148],[140,143],[140,139],[140,134],[140,131],[140,128],[140,126],[140,124],[140,122],[140,120],[140,119],[140,118],[140,117],[140,115],[140,114],[140,113],[139,113]],[[-16777216,8.25],[188,121],[188,123],[189,127],[189,131],[189,137],[189,142],[189,149],[189,155],[189,161],[189,166],[189,173],[189,179],[190,185],[191,192],[191,198],[191,202],[191,206],[191,210],[191,213],[191,214],[191,215],[191,216],[192,217],[193,217],[193,216],[193,212],[193,207],[193,202],[194,197],[194,190],[194,182],[194,175],[194,170],[194,166],[194,160],[194,156],[194,151],[194,146],[194,142],[194,138],[194,134],[194,130],[194,127],[194,124],[194,121],[194,119],[194,116],[194,115],[193,115]],[[-16777216,8.25],[164,114],[164,115],[165,118],[165,122],[165,126],[165,129],[165,133],[165,138],[165,143],[165,148],[165,152],[164,156],[164,160],[164,164],[164,169],[164,174],[164,178],[164,180],[164,182],[164,185],[164,188],[164,192],[164,194],[164,196],[164,199],[164,201],[164,202],[164,204],[164,205],[165,206],[165,207],[166,207],[167,207],[167,206],[167,205],[167,203],[167,199],[167,193],[166,186],[166,177],[165,173],[164,170],[164,167],[164,163],[164,160],[164,156],[164,152],[164,148],[164,144],[164,141],[164,139],[164,136],[165,133],[165,131],[166,129],[166,127],[166,126],[167,124],[167,122],[167,121],[167,119]],[[-16777216,8.25],[214,139],[213,140],[213,141],[212,142],[211,143],[211,144],[211,145],[212,145],[213,145],[214,145],[214,144],[214,143],[214,142],[214,140],[214,139],[214,138],[213,138],[213,139],[213,140]],[[-16777216,8.25],[233,137],[233,138],[232,138],[232,139],[231,140],[231,141],[231,142],[233,142],[234,142],[236,142],[236,141],[237,140],[237,139],[237,137],[237,135],[235,135],[234,136],[233,138],[232,139],[232,140],[233,140],[234,140]],[[-16777216,8.25],[223,184],[222,184],[221,184],[220,184],[220,185],[219,185],[217,185],[216,185],[215,185],[214,185],[213,185],[212,185],[211,185]],[[-16777216,8.25],[325,12]],[[-16777216,3.78125],[147,113],[147,112],[147,108],[149,104],[149,99],[149,92],[149,84],[149,78],[149,72],[151,66],[152,64],[153,63],[155,62],[160,60],[164,59],[169,58],[172,58],[174,58],[177,58],[179,59],[183,61],[186,63],[189,66],[191,70],[192,74],[194,78],[196,82],[197,87],[198,92],[198,96],[199,100],[199,104],[199,108],[199,112],[199,115],[199,117],[199,119],[199,120],[198,120],[198,121]],[[-16777216,3.78125],[167,97],[167,96],[166,93],[165,90],[165,88],[165,85],[165,84]],[[-16777216,3.78125],[184,93],[184,90],[186,88]],[[-16777216,3.78125],[207,115],[207,114],[208,112],[209,109],[209,106],[209,103],[209,99],[209,94],[209,90],[208,88],[208,86],[206,84],[206,82],[204,81],[204,79],[202,77],[201,76],[200,75],[199,73],[197,72],[197,71],[196,69],[195,69],[195,68],[194,68]],[[-16777216,3.78125],[98,151],[97,151],[96,151],[94,151],[92,151],[88,152],[84,153],[81,155],[78,156],[79,156],[80,156],[81,156],[82,156],[84,155],[86,155],[88,155],[90,155],[92,155],[94,155],[95,155],[96,155],[96,156],[96,155],[96,154],[96,153],[97,153],[97,152],[98,151],[99,151],[98,151],[97,151],[96,151],[95,151],[94,151]],[[-16777216,3.78125],[336,16],[336,15]],[[-16777216,0.6875],[105,112],[107,112],[109,112],[112,112],[114,112],[116,112],[120,112],[122,112],[124,112],[125,112],[127,112],[129,112],[130,112],[132,112],[134,112],[135,112],[137,112],[139,112],[140,112],[142,112],[144,112],[146,112],[147,112],[150,112],[152,113],[156,113],[161,114],[165,114],[168,114],[173,114],[176,114],[180,114],[182,115],[185,115],[187,115],[189,115],[193,115],[196,116],[199,116],[200,116],[202,116],[204,116],[206,116],[207,116],[208,116],[209,116],[210,117],[211,117],[213,117],[215,117],[217,117],[219,117],[220,118],[221,118],[222,118],[223,118],[224,118],[225,118],[225,119],[226,119],[227,121],[228,122],[228,125],[229,126],[230,127],[230,129],[230,130],[230,132],[230,134],[230,135],[230,136],[230,138],[230,140],[230,142],[230,145],[230,147],[230,149],[230,151],[230,153],[230,155],[230,157],[230,159],[230,162],[230,164],[230,166],[230,168],[231,170],[231,172],[231,173],[231,175],[231,176],[231,177],[231,179],[231,181],[231,183],[231,185],[231,186],[231,188],[231,189],[231,190],[231,192],[231,195],[231,196],[231,198],[231,200],[232,201],[232,202],[232,203],[232,204],[232,205],[232,206],[231,206],[231,207],[231,208],[230,209],[229,209],[229,210],[228,210],[228,211],[226,211],[226,212],[225,213],[224,213],[223,213],[222,213],[221,214],[220,214],[219,215],[218,215],[217,215],[216,215],[214,215],[213,215],[211,215],[209,215],[207,215],[205,216],[203,216],[201,216],[199,216],[197,216],[196,216],[194,216],[192,216],[190,216],[188,216],[187,216],[185,216],[183,216],[180,216],[179,217],[177,217],[176,217],[174,217],[173,217],[170,217],[167,217],[165,216],[164,216],[162,215],[160,214],[158,214],[157,214],[156,214],[155,214],[153,214],[151,213],[149,213],[148,213],[147,212],[146,212],[145,212],[143,212],[142,212],[141,212],[140,212],[140,211],[138,211],[136,210],[134,210],[132,210],[129,210],[126,210],[123,210],[121,210],[119,210],[118,210],[117,210],[116,210],[115,210],[114,209],[113,209],[112,208],[111,207],[110,206],[110,205],[109,205],[109,204],[108,204],[108,203],[107,201],[106,200],[106,199],[105,198],[104,197],[104,196],[104,195],[103,193],[103,191],[102,190],[102,189],[102,187],[102,186],[102,185],[102,184],[102,183],[102,182],[102,181],[102,180],[102,178],[102,176],[102,174],[102,173],[102,171],[102,169],[102,168],[102,167],[102,165],[102,164],[102,163],[102,161],[102,159],[102,158],[102,156],[102,154],[102,152],[102,150],[102,148],[102,146],[102,144],[102,141],[102,139],[102,138],[102,137],[102,136],[102,135],[102,133],[102,130],[103,128],[103,126],[103,124],[103,123],[103,122],[103,121],[103,120],[103,119],[103,118],[103,117],[104,117],[104,116]],[[-16777216,5.328125],[22,358],[23,358],[23,354],[25,348],[29,340],[31,328],[33,311],[34,296],[35,284],[36,276],[37,273],[37,271],[39,271],[41,272],[43,275],[47,277],[52,281],[57,283],[60,284],[60,285],[59,286],[55,290],[49,293],[40,298],[33,303],[29,305],[28,306],[28,307],[31,308],[34,310],[39,311],[44,314],[47,315],[48,315],[48,316],[48,317],[48,318],[48,320],[43,324],[36,331],[29,337],[22,344],[16,352],[13,360],[12,365],[12,366],[11,366],[10,366]],[[-16777216,5.328125],[88,288],[87,292],[83,296],[79,299],[74,303],[72,305],[70,307],[70,309],[70,310],[71,312],[74,316],[78,323],[82,331],[85,338],[90,343],[94,347],[96,348]],[[-16777216,5.328125],[75,306],[76,306],[80,306],[86,306],[92,306],[97,306],[100,306],[101,306]],[[-16777216,5.328125],[142,285],[142,286],[139,288],[135,292],[130,296],[126,300],[124,301],[123,301],[122,302],[122,303],[122,305],[122,306],[122,307],[123,310],[125,315],[127,320],[132,325],[137,330],[142,335],[145,338],[147,339]],[[-16777216,5.328125],[122,304],[124,304],[126,304],[129,304],[132,304],[136,304],[137,304]],[[-16777216,5.328125],[197,267],[196,267],[194,267],[191,267],[189,267],[188,267],[187,267],[186,267],[185,267],[185,268],[185,269],[185,270],[185,271],[185,273],[185,276],[185,279],[185,280],[186,280],[186,281],[187,281],[188,281],[190,281],[193,281],[198,282],[201,282],[202,282],[202,283],[202,284],[202,286],[202,289],[202,291],[202,292],[201,292],[200,292],[197,292],[193,292],[190,292],[188,292],[187,292],[187,293]],[[-16777216,5.328125],[211,268],[212,270],[212,274],[212,279],[212,285],[212,290],[212,294],[212,296],[212,297],[212,296],[212,295],[214,293],[216,290],[218,287],[220,284],[222,282],[223,281],[223,280],[224,280],[225,280],[226,283],[229,286],[231,289],[233,291],[234,293],[235,294],[235,293],[235,291],[235,287],[235,282],[235,274],[235,269],[235,265],[234,263],[235,263]],[[-16777216,5.328125],[248,289],[248,288],[248,285],[247,280],[247,275],[247,269],[247,263],[247,258],[247,256],[248,256],[250,256],[254,257],[262,257],[270,257],[273,258],[274,258],[275,258],[275,259],[275,260],[275,263],[275,267],[275,272],[275,277],[275,283],[275,285],[275,287],[275,288],[275,289]],[[-16777216,5.328125],[254,278],[255,278],[258,278],[261,278],[263,279],[265,279],[268,280],[270,280],[272,280]],[[-16777216,5.328125],[288,295],[288,294],[288,291],[288,286],[288,282],[288,277],[288,272],[288,271],[287,269],[287,268],[288,268],[291,268],[295,268],[298,268],[300,268],[301,268],[301,269],[301,271],[301,273],[301,276],[301,279],[301,281],[301,282],[301,283],[301,284],[301,285],[300,285],[298,285],[296,285],[294,285],[293,285],[292,285],[291,285],[291,286],[292,287],[293,288],[296,290],[298,291],[301,293],[303,295],[304,296]],[[-16777216,5.328125],[314,297],[314,296],[314,295],[314,293],[314,289],[314,284],[315,276],[315,271],[315,268],[315,267],[316,268],[317,270],[319,272],[320,276],[322,278],[324,279],[324,281],[326,280],[328,278],[331,274],[334,271],[335,269],[336,268],[336,269],[337,272],[338,278],[339,285],[340,291],[342,296],[343,299],[344,299]],[[-16777216,5.328125],[188,329],[187,329],[186,329],[184,328],[182,328],[181,328],[181,329],[181,331],[181,335],[181,339],[181,341],[181,342],[183,342],[185,342],[187,342],[190,342],[192,341],[193,341],[194,341],[194,342],[194,344],[194,348],[194,352],[194,355],[194,357],[193,357],[192,357],[190,357],[187,357],[185,357],[182,358],[181,358],[180,358]],[[-16777216,5.328125],[210,341],[210,342],[210,345],[210,348],[210,351],[210,355],[210,357]],[[-16777216,5.328125],[208,325],[209,325]],[[-16777216,5.328125],[226,356],[226,355],[225,352],[224,348],[223,345],[223,342],[223,340],[223,339],[224,339],[225,339],[228,339],[232,340],[235,341],[238,341],[240,342],[241,342],[242,342],[243,342],[243,344],[244,346],[244,348],[244,352],[244,355],[244,357],[244,358],[244,359]],[[-16777216,5.328125],[233,344],[233,346],[233,348],[233,350],[233,352],[233,355],[233,357]],[[-16777216,5.328125],[254,348],[253,351],[253,354],[253,356],[253,358],[253,359],[254,359],[256,359],[257,359],[259,359],[262,358],[264,358],[266,358],[267,358],[267,357],[267,353],[267,349],[267,347]],[[-16777216,5.328125],[274,326],[274,331],[274,338],[274,344],[274,350],[274,355],[274,358],[274,360],[275,360]],[[-16777216,5.328125],[286,344],[288,345],[289,345],[290,345],[291,345],[292,345],[292,346],[293,346],[293,347],[293,348],[293,349],[293,350],[293,352],[293,354],[292,357],[291,359],[291,361],[291,362],[291,363],[289,363],[287,363],[285,363],[284,363],[283,363],[283,362],[282,362],[282,361],[282,360],[282,358],[282,357],[282,356],[283,356],[284,356],[285,356],[287,356],[289,355],[290,355],[291,354]],[[-16777216,5.328125],[309,317],[309,320],[309,327],[309,334],[309,341],[309,346],[309,350],[309,353],[309,354],[310,355]],[[-16777216,5.328125],[294,329],[297,329],[301,330],[308,331],[312,331],[316,331],[318,331],[320,331],[321,331]],[[-16777216,5.328125],[333,357],[333,355],[332,352],[332,349],[331,346],[330,342],[330,339],[328,339],[328,338],[329,338],[330,338],[331,338],[333,338],[335,338],[336,338],[338,338],[339,338],[340,339],[340,340],[340,342],[340,343],[340,345],[340,347],[340,350],[340,353],[340,354],[340,355],[339,355],[338,355],[337,355],[336,355],[334,355],[333,355],[332,355],[332,356],[333,356]],[[-16777216,5.328125],[353,357],[353,356],[353,354],[353,351],[353,347],[353,342],[353,338],[353,336],[354,336],[355,336],[361,337],[368,338],[374,338],[378,338],[380,337],[381,337],[383,337]],[[-7576526,5.328125],[310,176],[310,178],[310,180],[310,182],[310,185],[310,191],[309,196],[308,203],[306,211],[303,219],[300,227],[298,234],[296,242],[294,248],[291,255],[288,261],[285,265],[283,266],[283,267]],[[-7576526,5.328125],[341,182],[343,186],[343,191],[343,200],[343,212],[343,226],[344,239],[347,251],[350,259],[356,268],[361,275],[366,281],[369,286],[369,288]],[[-7576526,5.328125],[308,177],[308,180],[308,186],[309,194],[309,206],[309,218],[308,228],[306,235],[305,240],[304,241],[303,242],[303,243],[301,243],[300,243],[299,243],[299,244],[298,245],[298,246],[297,248],[297,249],[295,251],[293,254],[292,258],[291,259],[290,259],[291,258],[293,255],[296,249],[301,242],[305,233],[307,220],[310,205],[312,196],[313,190],[314,186],[314,185],[314,183],[314,184],[313,189],[313,197],[312,207],[311,219],[309,230],[308,242],[306,251],[305,258],[304,261],[304,260],[304,258],[304,251],[305,241],[306,227],[309,212],[312,202],[314,192],[314,188],[314,187],[314,188],[314,189],[316,197],[316,208],[316,222],[315,236],[315,247],[315,254],[315,256],[315,253],[315,246],[315,234],[315,219],[315,204],[315,195],[315,191],[315,194],[316,203],[317,217],[318,231],[318,243],[317,251],[317,253],[317,245],[317,233],[319,221],[319,204],[321,191],[321,183],[321,181],[322,187],[324,200],[326,217],[328,235],[330,248],[333,254],[334,256],[335,256],[335,255],[334,247],[333,238],[333,224],[333,205],[333,193],[333,187],[333,186],[333,187],[333,189],[334,201],[336,216],[337,232],[337,245],[338,254],[340,257],[340,252],[340,245],[339,233],[338,220],[337,210],[336,206],[337,211],[339,222],[342,237],[344,250],[348,260],[353,265],[355,267],[354,267],[352,266],[349,264]],[[-7576526,5.328125],[309,176],[309,175],[309,174],[310,173],[311,171],[311,169],[313,165],[313,161],[315,157],[315,152],[315,149],[315,146],[316,142],[316,140],[316,138],[317,136],[318,133],[319,133],[320,133],[323,133],[326,133],[328,133],[330,133],[331,134],[331,136],[331,137],[333,139],[333,141],[335,145],[336,150],[336,158],[337,166],[338,174],[339,182],[340,188],[340,191],[340,192],[340,191],[338,188],[336,183],[335,176],[334,166],[333,156],[332,146],[332,139],[330,135],[328,134],[327,134],[326,135],[325,143],[324,154],[324,166],[323,177],[323,185],[323,191],[323,190],[323,189],[323,181],[323,172],[323,162],[323,152],[323,150],[323,156],[324,168],[325,184],[328,195],[332,200],[334,201],[334,200],[334,195],[332,187],[329,176],[328,163],[327,151],[327,146],[327,144],[328,147],[330,156],[332,167],[333,179],[335,186],[337,190],[338,192],[339,192],[339,191],[337,185],[335,177],[333,167],[332,160],[331,159],[331,160],[331,161],[332,171],[334,183],[335,196],[335,205],[335,211],[335,213],[333,211],[331,207],[328,201],[325,193],[322,182],[320,174],[318,169],[317,166],[316,164],[316,162],[316,160],[317,157],[318,153],[320,149],[320,147],[321,146],[321,147],[321,151],[321,158],[321,168],[321,175],[321,180],[321,182],[320,182],[319,182],[318,180],[318,174],[318,166],[318,156],[320,148],[321,146],[322,145],[322,143],[323,143],[324,141],[324,140],[324,139]],[[-15422976,5.328125],[309,44],[309,46],[309,48],[309,51],[308,54],[307,59],[304,64],[301,70],[297,77],[294,83],[292,88],[292,90],[291,90],[291,91],[292,91],[293,91],[294,91],[296,91],[299,91],[305,91],[312,90],[318,90],[323,89],[330,89],[336,89],[342,89],[347,88],[351,88],[357,87],[361,86],[362,86],[361,86],[360,84],[358,82],[353,79],[347,74],[341,70],[335,65],[329,62],[325,58],[321,55],[318,52],[317,51],[316,50]],[[-15422976,5.328125],[309,94],[307,99],[305,107],[303,116],[299,128],[296,141],[294,150],[293,156],[293,158],[294,159],[295,159],[296,159],[297,159],[298,159],[300,159],[303,158],[308,158],[314,156],[322,156],[331,156],[338,156],[346,155],[351,154],[354,153],[358,153],[361,153],[365,153],[367,152],[369,151],[369,149],[369,146],[369,141],[368,134],[366,125],[363,115],[360,107],[357,100],[354,96],[351,95],[348,94],[347,94]],[[-15422976,5.328125],[309,158],[309,161],[307,165],[305,170],[303,176],[301,183],[298,188],[298,191],[298,194],[300,194],[301,194],[302,194],[304,194],[307,194],[313,194],[321,194],[328,194],[335,194],[341,195],[347,196],[352,196],[356,196],[360,196],[363,196],[366,196],[369,196],[371,196],[371,195],[372,194],[373,190],[373,186],[373,182],[373,175],[370,167],[368,160],[366,157],[365,157],[363,157]],[[-15422976,5.328125],[314,164],[313,170],[311,177],[308,186],[305,192],[305,193],[306,190],[306,186],[309,179],[313,170],[317,161],[319,157],[320,157],[321,157],[321,159],[321,163],[321,171],[319,178],[318,182],[318,183],[318,180],[319,175],[320,168],[321,160],[321,156],[320,156],[320,157],[319,164],[317,173],[315,182],[314,187],[315,182],[317,177],[318,169],[319,164],[319,160],[319,163],[319,169],[318,177],[318,183],[318,184],[319,184],[320,184],[321,183],[323,178],[325,172],[326,166],[326,162],[326,163],[325,169],[324,176],[324,180],[324,183],[324,184],[325,181],[326,177],[327,170],[328,162],[328,158],[328,157],[327,157],[327,160],[326,167],[324,177],[324,183],[324,186],[326,187],[326,186],[328,182],[328,177],[328,171],[328,167],[328,165],[328,170],[329,179],[329,187],[330,192],[331,193],[332,193],[332,192],[333,187],[334,180],[334,173],[334,165],[334,160],[334,159],[333,159],[333,160],[333,166],[333,174],[334,182],[336,187],[336,190],[338,190],[339,190],[339,189],[339,184],[339,177],[339,169],[339,160],[338,156],[337,155],[337,156],[337,162],[337,171],[338,183],[339,192],[341,196],[343,196],[344,196],[344,192],[344,186],[344,177],[344,166],[344,157],[344,150],[344,148],[344,147],[344,148],[344,155],[344,164],[345,175],[347,182],[349,184],[351,185],[352,185],[353,180],[353,174],[353,167],[353,159],[353,157],[353,158],[353,159],[354,165],[355,174],[356,183],[358,188],[360,190],[362,190],[362,189],[362,188],[362,181],[362,173],[362,165],[362,159],[362,158],[362,159],[362,160],[362,167],[363,175],[364,183],[367,186],[369,187],[369,186],[369,185],[369,179],[369,173],[367,164],[365,153],[363,142],[361,134],[358,129],[357,128],[355,127],[355,128],[354,131],[354,134],[354,139],[354,144],[354,146],[354,144],[355,138],[355,132],[355,125],[355,115],[355,109],[355,108],[355,109],[355,111],[355,119],[356,129],[357,137],[359,142],[361,145],[362,145],[362,144],[362,140],[361,134],[359,126],[357,118],[355,110],[353,106],[352,104],[350,104],[349,105],[348,111],[347,123],[346,137],[346,148],[347,152],[347,150],[347,146],[345,138],[341,129],[337,118],[332,107],[328,100],[324,98],[323,98],[321,103],[319,111],[318,120],[316,131],[314,139],[313,142],[312,142],[311,142],[309,139],[309,134],[307,126],[306,118],[305,115],[305,120],[305,128],[303,136],[300,144],[298,148],[299,140],[302,132],[306,123],[308,113],[310,105],[310,102],[310,110],[310,122],[310,137],[308,149],[307,155],[308,147],[309,135],[310,122],[311,110],[312,100],[312,107],[312,119],[312,133],[311,147],[310,154],[310,156],[310,155],[311,148],[312,138],[314,126],[316,113],[319,102],[320,101],[320,102],[321,106],[322,119],[322,134],[321,149],[320,160],[320,164],[320,163],[320,162],[320,154],[321,142],[322,128],[324,114],[324,104],[324,101],[324,100],[324,101],[324,105],[324,122],[321,149],[320,171],[320,178],[322,179],[324,175],[325,163],[327,146],[329,125],[330,108],[332,94],[333,88],[335,97],[336,115],[338,134],[341,149],[343,152],[345,152],[347,149],[347,141],[347,130],[346,114],[345,98],[344,86],[342,82],[340,81],[339,81],[337,80],[335,80],[333,80],[331,80],[329,80],[324,82],[320,82],[318,82],[315,80],[314,74],[314,69],[314,67],[313,65],[312,65],[311,65],[310,65],[309,65],[308,66],[306,69],[304,72],[304,74],[304,73],[304,71],[304,68],[305,64],[306,61],[307,65],[307,72],[307,79],[307,84],[307,86],[307,85],[307,81],[307,76],[307,69],[307,65],[307,64],[307,65],[307,68],[305,75],[303,81],[298,87],[297,88],[296,88],[296,87],[296,82],[298,76],[300,71],[302,65],[304,61],[305,56],[306,54],[307,54],[307,55],[307,61],[307,67],[308,73],[308,78],[308,81],[309,81],[310,81],[310,78],[311,72],[313,65],[313,60],[313,59],[314,58],[315,60],[316,67],[318,75],[321,81],[323,85],[323,87],[323,86],[323,85],[323,78],[322,71],[320,66],[318,62],[316,61],[316,64],[316,70],[316,79],[317,85],[319,87],[320,87],[320,86],[320,82],[318,77],[314,69],[312,61],[311,58],[310,57],[310,58],[311,60],[315,66],[320,73],[325,78],[330,81],[334,84],[337,85],[338,85],[338,84],[338,79],[338,74],[335,67],[333,65],[333,66],[333,70],[337,75],[340,80],[344,84],[346,86],[347,87],[347,86],[346,85],[343,81],[340,76],[337,71],[335,68],[337,72],[341,76],[345,79],[349,82],[351,83],[352,83],[352,81],[349,79],[346,76],[342,74],[341,73],[340,73],[338,73],[335,75],[331,79],[327,83],[324,90],[323,96],[323,100],[326,103],[328,105],[329,105],[330,103],[330,97],[329,92],[327,89],[325,89],[324,89],[322,94],[322,99],[324,101],[327,102],[331,103],[334,103],[337,100],[337,97],[337,95],[337,96],[337,97],[337,107],[339,116],[342,121],[345,123],[347,123],[349,118],[349,112],[349,108],[348,107],[347,107],[346,108],[344,109],[344,110]],[[-16777216,1.6328125],[309,37],[309,39],[307,43],[306,47],[305,51],[303,55],[301,60],[296,65],[293,71],[290,75],[288,77],[288,79],[288,80],[287,81],[286,83],[285,83],[285,84],[285,85],[287,86],[289,86],[291,87],[293,87],[295,88],[296,88],[297,88],[298,89],[299,90],[300,91],[301,92],[302,92],[304,92],[305,92],[307,92],[308,92],[308,93]],[[-16777216,1.6328125],[312,44],[312,45],[313,47],[315,49],[318,51],[321,54],[323,57],[328,61],[333,65],[338,68],[343,71],[346,73],[349,75],[351,77],[353,77],[355,79],[356,81],[358,83],[360,85],[362,86],[364,87],[366,87],[367,87],[367,88],[368,88],[367,88],[366,88],[365,88],[363,89],[361,89],[358,90],[355,90],[352,90],[350,90],[348,91],[347,91],[347,92],[348,92],[349,93],[351,95],[353,97],[355,101],[357,104],[359,107],[361,111],[362,115],[364,118],[364,121],[364,123],[364,125],[365,126],[365,127],[366,128],[366,129],[367,131],[368,133],[369,135],[370,137],[371,139],[371,141],[371,144],[371,148],[371,151],[371,154],[371,156],[371,158],[371,159],[371,160],[370,160],[369,160],[366,158],[363,158],[361,156],[359,156],[358,156],[359,156],[360,157],[362,159],[365,161],[368,163],[370,165],[372,168],[373,172],[375,176],[378,182],[381,186],[382,189],[383,190],[383,191],[384,191],[384,192],[384,193],[382,193],[380,195],[379,196],[378,197],[376,198],[374,199],[372,199],[370,199],[367,197],[365,196],[363,196],[361,195],[358,195],[355,194],[352,194],[350,194],[346,194],[341,194],[335,195],[331,196],[326,197],[322,197],[317,198],[313,198],[312,198],[311,198],[310,198],[309,198],[308,198],[307,198],[306,198],[305,198],[304,198],[303,198],[301,197],[299,197],[298,196],[298,195],[298,194],[298,192],[298,190],[298,188],[298,184],[299,181],[300,178],[300,175],[301,173],[302,171],[303,169],[304,168],[304,166],[305,164],[306,162],[308,161],[309,160],[308,160],[307,160],[306,160],[303,161],[300,161],[296,162],[295,162],[294,162],[293,162],[292,162],[290,162],[290,161],[290,160],[290,158],[290,154],[290,150],[290,145],[291,140],[292,135],[292,131],[293,126],[294,121],[295,117],[295,113],[296,111],[297,108],[298,105],[300,101],[301,97],[302,93],[304,88],[304,86],[304,85],[304,84],[305,83],[305,82]],[[-16777216,1.6328125],[305,196],[306,197],[306,200],[306,206],[304,213],[304,222],[302,231],[302,237],[301,243],[300,248],[300,252],[300,255],[300,257],[300,258],[299,259],[298,259],[296,262],[296,264],[295,264],[294,264],[293,265],[291,265],[291,264],[291,263]],[[-16777216,1.6328125],[343,200],[344,204],[344,210],[344,217],[345,226],[346,234],[346,242],[347,248],[348,253],[350,258],[351,263],[353,267],[355,272],[356,275],[358,278],[359,279],[360,280],[361,282],[362,283],[363,284],[365,285],[366,287],[368,288],[370,289],[370,290]],[[-16777216,1.6328125],[308,95],[309,96],[309,98],[311,100],[312,102],[313,102],[315,102],[319,102],[324,101]],[[-16777216,1.6328125],[339,94],[341,97],[343,98],[346,99],[347,99],[348,99],[350,98],[350,97]],[[-16777216,1.6328125],[303,117],[303,118],[304,118],[305,118],[305,121],[303,127],[303,128],[310,127],[313,127],[316,127],[321,123],[324,121],[324,119],[324,118]],[[-16777216,1.6328125],[340,115],[342,119],[344,123],[347,126],[351,129],[354,130],[355,130],[356,130],[356,128],[357,125],[357,123],[357,122]],[[-16777216,1.6328125],[320,158],[320,155],[320,153],[320,150],[321,146],[323,142],[325,140],[325,139],[326,138],[327,138],[328,138],[328,137],[328,136],[329,136],[330,136],[331,136],[331,137],[332,138],[332,139],[332,141],[333,144],[334,147],[334,149],[334,151],[335,152],[335,154],[335,155]],[[-16777216,1.6328125],[331,170],[332,171],[333,174],[335,176],[338,177],[340,180],[343,180],[346,181],[348,181],[351,180],[352,178]],[[-16777216,1.6328125],[312,180],[314,180],[315,180],[318,181],[321,182],[323,182]],[[-16777216,1.6328125],[51,87],[51,86],[51,84],[53,81],[55,78],[57,76],[61,73],[66,71]],[[-16777216,1.6328125],[63,101],[66,97],[70,91],[78,85],[87,81],[91,80]],[[-16777216,1.6328125],[245,228],[249,226],[253,225],[255,221],[258,217],[258,213]],[[-16777216,1.6328125],[264,231],[265,231],[268,230],[273,226],[275,220],[275,217]],[[-65533,1.6328125],[8,52],[10,52],[13,50],[18,47],[23,45],[29,44],[32,44],[34,44]],[[-65533,1.6328125],[21,44],[23,48],[25,52],[28,55],[28,57],[29,57]],[[-65533,1.6328125],[18,45],[19,50],[21,56],[21,62],[22,66],[22,68]],[[-65533,1.6328125],[28,46],[29,49],[29,53],[30,59],[30,62],[30,64]],[[-65533,1.6328125],[38,49],[40,53],[41,57],[42,59],[42,60]]]
        //Generated using Art Maker Pro by Timothy Smith
        //(~~but his code is horrible and i had to fix it~~)
        //drawn by cwalsh <3
        let translate=(x,y=x)=>tex_ctx.translate(x,y),
            strokeWeight=(n)=>tex_ctx.lineWidth=n,
            stroke=(r,g=r,b=r)=>{
                r=(r>>16)&255
                g=(g>>8)&255
                b=b&255
                tex_ctx.strokeStyle='rgb('+r+','+g+','+b+')'
            }
        translate(0,128*12)
        tex_ctx.clearRect(0,0,800*0.8,500*0.8)
        translate(119,13)
        let strknum = 0;
        let strkpos = 1;
        stroke(drawing[0][0][0]);
        strokeWeight(drawing[0][0][1]);
        while(1){
            let doneNothing=1;
            if (strkpos < drawing[strknum].length - 1) {
                line(drawing[strknum][strkpos][0], drawing[strknum][strkpos][1], drawing[strknum][strkpos + 1][0], drawing[strknum][strkpos + 1][1]);
                strkpos++;
                doneNothing=0;
            }
            if (strknum < drawing.length-1 && strkpos >= (drawing[strknum].length)-1) {
                strkpos = 1;
                strknum++;
                stroke(drawing[strknum][0][0]);
                strokeWeight(drawing[strknum][0][1]);
                doneNothing=0;
            }
            
            if(doneNothing){break;}
        }
        tex_ctx.setTransform(1,0,0,1,0,0)
    
        tex_ctx.textAlign='start'
        tex_ctx.translate(800*0.8,128*12)
        tex_ctx.fillStyle='rgb(214, 204, 165)'
        tex_ctx.fillRect(0,0,100*2.5,100*3)
        tex_ctx.fillStyle='rgb(0,0,0)'
        tex_ctx.font='22px times new roman'
        tex_ctx.fillText('TO DO beesmas',32,53)
        tex_ctx.fillText('list my chores:',56,73)
        tex_ctx.font='19px times new roman'
        tex_ctx.fillText('1. make naughty list',50,123)
        tex_ctx.fillText('2. do my launrdury',56,154)
        tex_ctx.fillText('3. bully mean kids really alot',16,187)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(800*0.8+100*2.5,128*12)
        tex_ctx.fillStyle='rgb(214, 204, 165)'
        tex_ctx.fillRect(0,0,100*2.5,100*3)
        tex_ctx.fillStyle='rgb(0,0,0)'
        tex_ctx.font='16px times new roman'
        //https://stackoverflow.com/questions/2936112/text-wrap-in-a-canvas-element
        function wrapText(context, text, x, y, line_width, line_height)
    {
        var line = '';
        var paragraphs = text.split('\n');
        for (var i = 0; i < paragraphs.length; i++)
        {
            var words = paragraphs[i].split(' ');
            for (var n = 0; n < words.length; n++)
            {
                var testLine = line + words[n] + ' ';
                var metrics = context.measureText(testLine);
                var testWidth = metrics.width;
                if (testWidth > line_width && n > 0)
                {
                    context.fillText(line, x, y);
                    line = words[n] + ' ';
                    y += line_height;
                }
                else
                {
                    line = testLine;
                }
            }
            context.fillText(line, x, y);
            y += line_height;
            line = '';
        }
    }
        wrapText(tex_ctx,"HOHOHO happy holidays, and merry beesmas. I am PATROCK CLAUS, and I only give gifts to good children. Have you been behaving yourself? If not NOWS THE TIME TO START. Don't you want that brand new xbox? Or that skibidi toilet fan merch? I'LL ASK YOUR MOMMY TO CHECK IF YOU'VE bEHAVED WELL. HOHOHO! Merry besmas. SEE YOU ON THE 25TH!!!",20,49,227,19)
        tex_ctx.setTransform(1,0,0,1,0,0)
    }
    
    window.textures_flowers=function(tex_ctx){
    
        let _COLORS={
            
            blue:'rgb(20,84,196)',
            red:'rgb(255, 35, 0)',
            white:'rgb(255,255,255)',
            blueArr:[20,84,186],
            redArr:[255,0,0],
            whiteArr:[255,255,255]
            
        }
        
        tex_ctx.fillStyle='rgb(0,153,0)'
        tex_ctx.fillRect(0,0,1024,1024)
        
        tex_ctx.translate(128,128)
        tex_ctx.scale(0.7,0.7)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.closePath()
        tex_ctx.strokeStyle='rgb(0,0,0,0.3)'
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle=_COLORS.red
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.arc(0,0,25,0,6)
        tex_ctx.closePath()
        tex_ctx.strokeStyle='rgb(157, 242, 100)'
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle='rgb(226, 255, 138)'
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*3,128)
        tex_ctx.scale(0.7,0.7)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.closePath()
        tex_ctx.strokeStyle='rgb(0,0,0,0.3)'
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle=_COLORS.blue
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.arc(0,0,25,0,6)
        tex_ctx.closePath()
        tex_ctx.strokeStyle='rgb(157, 242, 100)'
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle='rgb(226, 255, 138)'
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*5,128)
        tex_ctx.scale(0.7,0.7)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.closePath()
        tex_ctx.strokeStyle='rgb(0,0,0,0.3)'
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle=_COLORS.white
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.arc(0,0,25,0,6)
        tex_ctx.closePath()
        tex_ctx.strokeStyle='rgb(157, 242, 100)'
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle='rgb(226, 255, 138)'
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*7-51,108)
        tex_ctx.rotate(1)
        tex_ctx.scale(0.6,0.6)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.closePath()
        tex_ctx.strokeStyle='rgb(0,0,0,0.3)'
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle=_COLORS.red
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.arc(0,0,25,0,6)
        tex_ctx.closePath()
        tex_ctx.strokeStyle='rgb(157, 242, 100)'
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle='rgb(226, 255, 138)'
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        tex_ctx.translate(128*7+40,147)
        tex_ctx.rotate(-0.6)
        tex_ctx.scale(0.6,0.6)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.closePath()
        tex_ctx.strokeStyle='rgb(0,0,0,0.3)'
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle=_COLORS.red
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.arc(0,0,25,0,6)
        tex_ctx.closePath()
        tex_ctx.strokeStyle='rgb(157, 242, 100)'
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle='rgb(226, 255, 138)'
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128-51,87+256)
        tex_ctx.rotate(1)
        tex_ctx.scale(0.6,0.6)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.closePath()
        tex_ctx.strokeStyle='rgb(0,0,0,0.3)'
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle=_COLORS.blue
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.arc(0,0,25,0,6)
        tex_ctx.closePath()
        tex_ctx.strokeStyle='rgb(157, 242, 100)'
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle='rgb(226, 255, 138)'
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        tex_ctx.translate(40+128,128*2+129)
        tex_ctx.rotate(-0.6)
        tex_ctx.scale(0.6,0.6)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.closePath()
        tex_ctx.strokeStyle='rgb(0,0,0,0.3)'
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle=_COLORS.blue
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.arc(0,0,25,0,6)
        tex_ctx.closePath()
        tex_ctx.strokeStyle='rgb(157, 242, 100)'
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle='rgb(226, 255, 138)'
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*3-51,87+256)
        tex_ctx.rotate(1)
        tex_ctx.scale(0.6,0.6)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.closePath()
        tex_ctx.strokeStyle='rgb(0,0,0,0.3)'
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle=_COLORS.white
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.arc(0,0,25,0,6)
        tex_ctx.closePath()
        tex_ctx.strokeStyle='rgb(157, 242, 100)'
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle='rgb(226, 255, 138)'
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        tex_ctx.translate(40+128*3,128*2+129)
        tex_ctx.rotate(-0.6)
        tex_ctx.scale(0.6,0.6)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.closePath()
        tex_ctx.strokeStyle='rgb(0,0,0,0.3)'
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle=_COLORS.white
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.arc(0,0,25,0,6)
        tex_ctx.closePath()
        tex_ctx.strokeStyle='rgb(157, 242, 100)'
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle='rgb(226, 255, 138)'
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*5-55,87+263)
        tex_ctx.scale(0.65,0.65)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.closePath()
        tex_ctx.strokeStyle='rgb(0,0,0,0.3)'
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle=_COLORS.red
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.arc(0,0,25,0,6)
        tex_ctx.closePath()
        tex_ctx.strokeStyle='rgb(157, 242, 100)'
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle='rgb(226, 255, 138)'
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        tex_ctx.translate(-6+128*5,128*2+179)
        tex_ctx.rotate(-1.5)
        tex_ctx.scale(0.65,0.65)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.closePath()
        tex_ctx.strokeStyle='rgb(0,0,0,0.3)'
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle=_COLORS.red
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.arc(0,0,25,0,6)
        tex_ctx.closePath()
        tex_ctx.strokeStyle='rgb(157, 242, 100)'
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle='rgb(226, 255, 138)'
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        tex_ctx.translate(58+128*5,128*2+101)
        tex_ctx.rotate(-1.5)
        tex_ctx.scale(0.65,0.65)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.closePath()
        tex_ctx.strokeStyle='rgb(0,0,0,0.3)'
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle=_COLORS.red
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.arc(0,0,25,0,6)
        tex_ctx.closePath()
        tex_ctx.strokeStyle='rgb(157, 242, 100)'
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle='rgb(226, 255, 138)'
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*7-45,87+261)
        tex_ctx.scale(0.65,0.65)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.closePath()
        tex_ctx.strokeStyle='rgb(0,0,0,0.3)'
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle=_COLORS.blue
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.arc(0,0,25,0,6)
        tex_ctx.closePath()
        tex_ctx.strokeStyle='rgb(157, 242, 100)'
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle='rgb(226, 255, 138)'
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        tex_ctx.translate(12+128*7,128*2+177)
        tex_ctx.rotate(-1.5)
        tex_ctx.scale(0.65,0.65)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.closePath()
        tex_ctx.strokeStyle='rgb(0,0,0,0.3)'
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle=_COLORS.blue
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.arc(0,0,25,0,6)
        tex_ctx.closePath()
        tex_ctx.strokeStyle='rgb(157, 242, 100)'
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle='rgb(226, 255, 138)'
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        tex_ctx.translate(66+128*7,128*2+91)
        tex_ctx.rotate(0.1)
        tex_ctx.scale(0.65,0.65)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.closePath()
        tex_ctx.strokeStyle='rgb(0,0,0,0.3)'
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle=_COLORS.blue
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.arc(0,0,25,0,6)
        tex_ctx.closePath()
        tex_ctx.strokeStyle='rgb(157, 242, 100)'
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle='rgb(226, 255, 138)'
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128-63,128*3+235)
        tex_ctx.scale(0.65,0.65)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.closePath()
        tex_ctx.strokeStyle='rgb(0,0,0,0.3)'
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle=_COLORS.white
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.arc(0,0,25,0,6)
        tex_ctx.closePath()
        tex_ctx.strokeStyle='rgb(157, 242, 100)'
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle='rgb(226, 255, 138)'
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        tex_ctx.translate(2+121,128*4+189)
        tex_ctx.rotate(-1.6)
        tex_ctx.scale(0.65,0.65)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.closePath()
        tex_ctx.strokeStyle='rgb(0,0,0,0.3)'
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle=_COLORS.white
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.arc(0,0,25,0,6)
        tex_ctx.closePath()
        tex_ctx.strokeStyle='rgb(157, 242, 100)'
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle='rgb(226, 255, 138)'
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        tex_ctx.translate(17+166,128*4+111)
        tex_ctx.rotate(-1.5)
        tex_ctx.scale(0.65,0.65)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.rotate(Math.PI*0.5)
        tex_ctx.moveTo(-20,-20)
        tex_ctx.bezierCurveTo(-80,-100,80,-100,20,-20)
        tex_ctx.closePath()
        tex_ctx.strokeStyle='rgb(0,0,0,0.3)'
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle=_COLORS.white
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.arc(0,0,25,0,6)
        tex_ctx.closePath()
        tex_ctx.strokeStyle='rgb(157, 242, 100)'
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle='rgb(226, 255, 138)'
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128+256,128+256*2)
        tex_ctx.scale(0.92,0.92)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-20,-10)
        tex_ctx.bezierCurveTo(-95,-110,95,-110,20,-10)
        tex_ctx.rotate(Math.PI*2/5)
        tex_ctx.moveTo(-20,-10)
        tex_ctx.bezierCurveTo(-95,-110,95,-110,20,-10)
        tex_ctx.rotate(Math.PI*2/5)
        tex_ctx.moveTo(-20,-10)
        tex_ctx.bezierCurveTo(-95,-110,95,-110,20,-10)
        tex_ctx.rotate(Math.PI*2/5)
        tex_ctx.moveTo(-20,-10)
        tex_ctx.bezierCurveTo(-95,-110,95,-110,20,-10)
        tex_ctx.rotate(Math.PI*2/5)
        tex_ctx.moveTo(-20,-10)
        tex_ctx.bezierCurveTo(-95,-110,95,-110,20,-10)
        tex_ctx.rotate(Math.PI*2/5)
        tex_ctx.closePath()
        tex_ctx.strokeStyle='rgb(0,0,0,0.3)'
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle=_COLORS.red
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.scale(0.9,0.9)
        tex_ctx.beginPath()
        tex_ctx.arc(0,0,25,0,6)
        tex_ctx.closePath()
        tex_ctx.strokeStyle='rgb(157, 242, 100)'
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle='rgb(226, 255, 138)'
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128+256*2,128+256*2)
        tex_ctx.scale(0.92,0.92)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-20,-10)
        tex_ctx.bezierCurveTo(-95,-110,95,-110,20,-10)
        tex_ctx.rotate(Math.PI*2/5)
        tex_ctx.moveTo(-20,-10)
        tex_ctx.bezierCurveTo(-95,-110,95,-110,20,-10)
        tex_ctx.rotate(Math.PI*2/5)
        tex_ctx.moveTo(-20,-10)
        tex_ctx.bezierCurveTo(-95,-110,95,-110,20,-10)
        tex_ctx.rotate(Math.PI*2/5)
        tex_ctx.moveTo(-20,-10)
        tex_ctx.bezierCurveTo(-95,-110,95,-110,20,-10)
        tex_ctx.rotate(Math.PI*2/5)
        tex_ctx.moveTo(-20,-10)
        tex_ctx.bezierCurveTo(-95,-110,95,-110,20,-10)
        tex_ctx.rotate(Math.PI*2/5)
        tex_ctx.closePath()
        tex_ctx.strokeStyle='rgb(0,0,0,0.3)'
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle=_COLORS.blue
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.scale(0.9,0.9)
        tex_ctx.beginPath()
        tex_ctx.arc(0,0,25,0,6)
        tex_ctx.closePath()
        tex_ctx.strokeStyle='rgb(157, 242, 100)'
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle='rgb(226, 255, 138)'
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128+256*3,128+256*2)
        tex_ctx.scale(0.92,0.92)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-20,-10)
        tex_ctx.bezierCurveTo(-95,-110,95,-110,20,-10)
        tex_ctx.rotate(Math.PI*2/5)
        tex_ctx.moveTo(-20,-10)
        tex_ctx.bezierCurveTo(-95,-110,95,-110,20,-10)
        tex_ctx.rotate(Math.PI*2/5)
        tex_ctx.moveTo(-20,-10)
        tex_ctx.bezierCurveTo(-95,-110,95,-110,20,-10)
        tex_ctx.rotate(Math.PI*2/5)
        tex_ctx.moveTo(-20,-10)
        tex_ctx.bezierCurveTo(-95,-110,95,-110,20,-10)
        tex_ctx.rotate(Math.PI*2/5)
        tex_ctx.moveTo(-20,-10)
        tex_ctx.bezierCurveTo(-95,-110,95,-110,20,-10)
        tex_ctx.rotate(Math.PI*2/5)
        tex_ctx.closePath()
        tex_ctx.strokeStyle='rgb(0,0,0,0.3)'
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle=_COLORS.white
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.scale(0.9,0.9)
        tex_ctx.beginPath()
        tex_ctx.arc(0,0,25,0,6)
        tex_ctx.closePath()
        tex_ctx.strokeStyle='rgb(157, 242, 100)'
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle='rgb(226, 255, 138)'
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128,128+256*3)
        tex_ctx.scale(0.92,0.92)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-20,-10)
        tex_ctx.bezierCurveTo(-95,-110,95,-110,20,-10)
        tex_ctx.rotate(Math.PI*2/5)
        tex_ctx.moveTo(-20,-10)
        tex_ctx.bezierCurveTo(-95,-110,95,-110,20,-10)
        tex_ctx.rotate(Math.PI*2/5)
        tex_ctx.moveTo(-20,-10)
        tex_ctx.bezierCurveTo(-95,-110,95,-110,20,-10)
        tex_ctx.rotate(Math.PI*2/5)
        tex_ctx.moveTo(-20,-10)
        tex_ctx.bezierCurveTo(-95,-110,95,-110,20,-10)
        tex_ctx.rotate(Math.PI*2/5)
        tex_ctx.moveTo(-20,-10)
        tex_ctx.bezierCurveTo(-95,-110,95,-110,20,-10)
        tex_ctx.rotate(Math.PI*2/5)
        tex_ctx.closePath()
        tex_ctx.strokeStyle='rgb(0,0,0,0.3)'
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle=_COLORS.red
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.beginPath()
        
        for(let i=0,j=0;i<Math.PI*2;i+=Math.PI*2/10,j++){
            
            let r=j%2===0?20:50
            
            if(j===0){
                
                tex_ctx.moveTo(Math.sin(i)*r,Math.cos(i)*r)
                
            } else {
                
                tex_ctx.lineTo(Math.sin(i)*r,Math.cos(i)*r)
            }
        }
        
        tex_ctx.closePath()
        tex_ctx.strokeStyle='rgb(157, 242, 100)'
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle='rgb(255, 255,58)'
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128+256*1,128+256*3)
        tex_ctx.scale(0.92,0.92)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-20,-10)
        tex_ctx.bezierCurveTo(-95,-110,95,-110,20,-10)
        tex_ctx.rotate(Math.PI*2/5)
        tex_ctx.moveTo(-20,-10)
        tex_ctx.bezierCurveTo(-95,-110,95,-110,20,-10)
        tex_ctx.rotate(Math.PI*2/5)
        tex_ctx.moveTo(-20,-10)
        tex_ctx.bezierCurveTo(-95,-110,95,-110,20,-10)
        tex_ctx.rotate(Math.PI*2/5)
        tex_ctx.moveTo(-20,-10)
        tex_ctx.bezierCurveTo(-95,-110,95,-110,20,-10)
        tex_ctx.rotate(Math.PI*2/5)
        tex_ctx.moveTo(-20,-10)
        tex_ctx.bezierCurveTo(-95,-110,95,-110,20,-10)
        tex_ctx.rotate(Math.PI*2/5)
        tex_ctx.closePath()
        tex_ctx.strokeStyle='rgb(0,0,0,0.3)'
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle=_COLORS.blue
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.beginPath()
        
        for(let i=0,j=0;i<Math.PI*2;i+=Math.PI*2/10,j++){
            
            let r=j%2===0?20:50
            
            if(j===0){
                
                tex_ctx.moveTo(Math.sin(i)*r,Math.cos(i)*r)
                
            } else {
                
                tex_ctx.lineTo(Math.sin(i)*r,Math.cos(i)*r)
            }
        }
        
        tex_ctx.closePath()
        tex_ctx.strokeStyle='rgb(157, 242, 100)'
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle='rgb(255, 255,58)'
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128+256*2,128+256*3)
        tex_ctx.scale(0.92,0.92)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-20,-10)
        tex_ctx.bezierCurveTo(-95,-110,95,-110,20,-10)
        tex_ctx.rotate(Math.PI*2/5)
        tex_ctx.moveTo(-20,-10)
        tex_ctx.bezierCurveTo(-95,-110,95,-110,20,-10)
        tex_ctx.rotate(Math.PI*2/5)
        tex_ctx.moveTo(-20,-10)
        tex_ctx.bezierCurveTo(-95,-110,95,-110,20,-10)
        tex_ctx.rotate(Math.PI*2/5)
        tex_ctx.moveTo(-20,-10)
        tex_ctx.bezierCurveTo(-95,-110,95,-110,20,-10)
        tex_ctx.rotate(Math.PI*2/5)
        tex_ctx.moveTo(-20,-10)
        tex_ctx.bezierCurveTo(-95,-110,95,-110,20,-10)
        tex_ctx.rotate(Math.PI*2/5)
        tex_ctx.closePath()
        tex_ctx.strokeStyle='rgb(0,0,0,0.3)'
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle=_COLORS.white
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.beginPath()
        
        for(let i=0,j=0;i<Math.PI*2;i+=Math.PI*2/10,j++){
            
            let r=j%2===0?20:50
            
            if(j===0){
                
                tex_ctx.moveTo(Math.sin(i)*r,Math.cos(i)*r)
                
            } else {
                
                tex_ctx.lineTo(Math.sin(i)*r,Math.cos(i)*r)
            }
        }
        
        tex_ctx.closePath()
        tex_ctx.strokeStyle='rgb(157, 242, 100)'
        tex_ctx.lineWidth=5
        tex_ctx.fillStyle='rgb(255, 255,58)'
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
    }
    
    window.textures_decals=function(tex_ctx){
    
        function e(x,y,w,h,r=0,a=7){
            tex_ctx.beginPath()
            tex_ctx.ellipse(x,y,w,h,r,-Math.PI*0.5,a-Math.PI*0.5)
            tex_ctx.fill()
        }
        
        function r(x,y,w,h){
            tex_ctx.fillRect(x,y,w,h)
            tex_ctx.strokeRect(x,y,w,h)
        }
        
        tex_ctx.clearRect(0,0,1024,1024)
        // tex_ctx.fillStyle='rgb(100,100,100)'
        // tex_ctx.fillRect(0,0,1024,1024)
        
        tex_ctx.lineCap='butt'
        tex_ctx.lineJoin='butt'
        tex_ctx.translate(128*0+128*0.5,128*0+128*0.5)
        tex_ctx.lineWidth=7
        tex_ctx.fillStyle='rgb(255,80,40)'
        e(0,0,20,20)
        tex_ctx.fillStyle='rgb(255,255,255)'
        tex_ctx.strokeStyle='rgb(255,255,255)'
        e(0,0,4,4)
        let s=0.1
        tex_ctx.beginPath()
        tex_ctx.ellipse(0,0,13,13,0,-s,s+Math.PI*2/6)
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.rotate(Math.PI*2*2/6)
        tex_ctx.ellipse(0,0,13,13,0,-s,s+Math.PI*2/6)
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.rotate(Math.PI*2*2/6)
        tex_ctx.ellipse(0,0,13,13,0,-s,s+Math.PI*2/6)
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*1,128*0)
        tex_ctx.fillStyle='rgb(255,255,255)'
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*2+128*0.5,128*0+128*0.5)
        tex_ctx.font='44px arial'
        tex_ctx.fillText('🌺',-33,15)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*3,128*0)
        let g=tex_ctx.createRadialGradient(128*0.5,128*0.5,0,128*0.5,128*0.5,128*0.5)
        tex_ctx.globalAlpha=0.5
        g.addColorStop(0,'rgb(255,255,255)')
        g.addColorStop(1,'rgb(255,255,255,0)')
        tex_ctx.fillStyle=g
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.globalAlpha=1
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.fillStyle='rgb(100,200,255)'
        tex_ctx.lineWidth=2.5
        tex_ctx.translate(128*4+128*0.5,128*0.5)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.fillStyle='rgb(88, 227, 88)'
        tex_ctx.lineWidth=1.5
        a=new Path2D('M-14 7L10 6C15 6 15 -5 10 -5L 8 -3C12 -3 12 3 8 3z')
        let _s=tex_ctx.createLinearGradient(-9,-4,17,7)
        _s.addColorStop(0,'rgb(255,0,0)')
        _s.addColorStop(0.15,'rgb(255,0,0)')
        _s.addColorStop(0.15,'rgb(255,255,255)')
        _s.addColorStop(0.3,'rgb(255,255,255)')
        _s.addColorStop(0.3,'rgb(255,0,0)')
        _s.addColorStop(0.45,'rgb(255,0,0)')
        _s.addColorStop(0.45,'rgb(255,255,255)')
        _s.addColorStop(0.6,'rgb(255,255,255)')
        _s.addColorStop(0.6,'rgb(255,0,0)')
        _s.addColorStop(0.75,'rgb(255,0,0)')
        _s.addColorStop(0.75,'rgb(255,255,255)')
        _s.addColorStop(0.9,'rgb(255,255,255)')
        _s.addColorStop(0.9,'rgb(255,0,0)')
        tex_ctx.fillStyle=_s
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.translate(-5,-9)
        tex_ctx.scale(3,3)
        tex_ctx.rotate(-0.2)
        tex_ctx.stroke(a)
        tex_ctx.fill(a)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*5+128*0.5,128*0.5)
        tex_ctx.strokeStyle='rgb(0,180,0)'
        tex_ctx.lineWidth=5
        tex_ctx.strokeRect(-18,-18,40,30)
        tex_ctx.fillStyle='rgb(19, 93, 212)'
        tex_ctx.strokeStyle='black'
        tex_ctx.lineWidth=2.5
        r(-29,-6,60,35)
        tex_ctx.fillStyle='rgb(251, 255, 0)'
        e(-11,8,8,8)
        tex_ctx.stroke()
        e(13,8,8,8)
        tex_ctx.stroke()
        tex_ctx.fillStyle='black'
        e(13,8,2,2)
        e(-11,8,2,2)
        tex_ctx.fillStyle='rgb(255,0,255)'
        tex_ctx.fillRect(-9,19,7,4)
        tex_ctx.fillStyle='rgb(255,0,0)'
        tex_ctx.fillRect(3,19,7,4)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*6+128*0.5,128*0.5-7)
        tex_ctx.rotate(0.3)
        tex_ctx.fillStyle='rgb(86, 252, 136)'
        tex_ctx.strokeStyle='black'
        tex_ctx.lineWidth=2
        r(-5,-21,10,55)
        tex_ctx.fillStyle='rgb(250, 110, 147)'
        r(-5,-33,10,10)
        tex_ctx.fillStyle='rgb(170,170,170)'
        r(-5,-25,10,5)
        tex_ctx.fillStyle='rgb(214, 193, 101)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-5,35)
        tex_ctx.lineTo(5,35)
        tex_ctx.lineTo(0,48)
        tex_ctx.closePath()
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(0,0,0)'
        e(0,44,2,2)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*7+128*0.5,128*0.5+28)
        tex_ctx.fillStyle='rgb(255, 204, 0)'
        tex_ctx.strokeStyle='black'
        let aa=tex_ctx.textAlign
        tex_ctx.textAlign='center'
        tex_ctx.lineWidth=3
        tex_ctx.font='95px arial'
        tex_ctx.fillText('!',0,0)
        tex_ctx.strokeText('!',0,0)
        tex_ctx.textAlign=aa
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*0+128*0.5,128*1+128*0.5)
        tex_ctx.scale(1.2,1.2)
        g=tex_ctx.createRadialGradient(0,0,5,0,0,45)
        g.addColorStop(0.1,'rgb(255,255,255,0.2)')
        g.addColorStop(1,'rgb(255,255,255,0.05)')
        tex_ctx.fillStyle=g
        e(0,0,5,5)
        e(33,14,4,4)
        e(-17,24,2,2)
        e(7,-26,3,3)
        for(let i=0;i<6.2831853;i+=6.2831853/7){
            
            tex_ctx.rotate(i)
            e(35,0,16+Math.sin(i*3.6)*15,Math.cos(i*8.5)+2)
            tex_ctx.rotate(-i)
        }
        
        tex_ctx.strokeStyle='black'
        tex_ctx.lineWidth=3
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*1+128*0.5,128*1+128*0.5)
        tex_ctx.lineWidth=8
        tex_ctx.fillStyle='rgb(0,0,0,0)'
        tex_ctx.strokeStyle='rgb(255,255,255)'
        e(0,0,55,55)
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.lineCap='round'
        tex_ctx.translate(128*2+128*0.5,128*1+128*0.5)
        tex_ctx.lineWidth=8
        tex_ctx.strokeStyle='rgb(255,255,255)'
        e(0,0,55,55,0,Math.PI*0.25)
        tex_ctx.stroke()
        tex_ctx.lineCap='miter'
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*3+128*0.5,128*1+128*0.5)
        tex_ctx.fillStyle='rgb(255,255,255)'
        tex_ctx.font='175px arial'
        tex_ctx.textBaseline='middle'
        tex_ctx.textAlign='center'
        tex_ctx.fillText('☺',2,-5)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*4+128*0.5,128*1+128*0.5-10)
        tex_ctx.scale(1.6,1.6)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.lineWidth=3
        tex_ctx.fillStyle='rgb(100,100,100)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-20,0)
        tex_ctx.lineTo(0,-15)
        tex_ctx.lineTo(20,-0)
        tex_ctx.lineTo(0,15)
        tex_ctx.closePath()
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(85,85,85)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-20,0)
        tex_ctx.lineTo(-19,10)
        tex_ctx.lineTo(0,25)
        tex_ctx.lineTo(0,15)
        tex_ctx.closePath()
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(70,70,70)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(20,0)
        tex_ctx.lineTo(20,10)
        tex_ctx.lineTo(0,25)
        tex_ctx.lineTo(0,15)
        tex_ctx.closePath()
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(255,220,50,0.9)'
        tex_ctx.fillRect(-19,8,4,8)
        tex_ctx.fillRect(-13,11,4,8)
        tex_ctx.fillRect(-7,14,4,8)
        tex_ctx.lineWidth=7
        tex_ctx.strokeStyle='rgb(155,0,0)'
        tex_ctx.fillStyle='rgb(0,0,0,0)'
        e(0,-1,8,8*0.75)
        tex_ctx.stroke()
        tex_ctx.strokeStyle='rgb(255,0,0)'
        e(0,-4,8,8*0.75)
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*5+128*0.5,128*1+128*0.5-10)
        tex_ctx.scale(1.6,1.6)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.lineWidth=3
        tex_ctx.fillStyle='rgb(100,100,100)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-20,0)
        tex_ctx.lineTo(0,-15)
        tex_ctx.lineTo(20,-0)
        tex_ctx.lineTo(0,15)
        tex_ctx.closePath()
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(85,85,85)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-20,0)
        tex_ctx.lineTo(-20,10)
        tex_ctx.lineTo(0,25)
        tex_ctx.lineTo(0,15)
        tex_ctx.closePath()
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(70,70,70)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(20,0)
        tex_ctx.lineTo(20,10)
        tex_ctx.lineTo(0,25)
        tex_ctx.lineTo(0,15)
        tex_ctx.closePath()
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(255,220,50,0.9)'
        tex_ctx.fillRect(-19,8,4,8)
        tex_ctx.fillRect(-13,11,4,8)
        tex_ctx.fillRect(-7,14,4,8)
        tex_ctx.lineWidth=7
        tex_ctx.strokeStyle='rgb(175,175,175)'
        tex_ctx.fillStyle='rgb(0,0,0,0)'
        e(0,-1,8,8*0.75)
        tex_ctx.stroke()
        tex_ctx.strokeStyle='rgb(255,255,255)'
        e(0,-4,8,8*0.75)
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*6+128*0.5,128*1+128*0.5-10)
        tex_ctx.scale(1.6,1.6)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.lineWidth=3
        tex_ctx.fillStyle='rgb(100,100,100)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-20,0)
        tex_ctx.lineTo(0,-15)
        tex_ctx.lineTo(20,-0)
        tex_ctx.lineTo(0,15)
        tex_ctx.closePath()
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(85,85,85)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-20,0)
        tex_ctx.lineTo(-20,10)
        tex_ctx.lineTo(0,25)
        tex_ctx.lineTo(0,15)
        tex_ctx.closePath()
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(70,70,70)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(20,0)
        tex_ctx.lineTo(20,10)
        tex_ctx.lineTo(0,25)
        tex_ctx.lineTo(0,15)
        tex_ctx.closePath()
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(255,220,50,0.9)'
        tex_ctx.fillRect(-19,8,4,8)
        tex_ctx.fillRect(-13,11,4,8)
        tex_ctx.fillRect(-7,14,4,8)
        tex_ctx.lineWidth=7
        tex_ctx.strokeStyle='rgb(0,0,155)'
        tex_ctx.fillStyle='rgb(0,0,0,0)'
        e(0,-1,8,8*0.75)
        tex_ctx.stroke()
        tex_ctx.strokeStyle='rgb(0,0,255)'
        e(0,-4,8,8*0.75)
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*7+128*0.5,128*1+128*0.5-10)
        tex_ctx.scale(1.6,1.6)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.lineWidth=3
        tex_ctx.fillStyle='rgb(100,100,100)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-20,0)
        tex_ctx.lineTo(0,-15)
        tex_ctx.lineTo(20,-0)
        tex_ctx.lineTo(0,15)
        tex_ctx.closePath()
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(85,85,85)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-20,0)
        tex_ctx.lineTo(-20,10)
        tex_ctx.lineTo(0,25)
        tex_ctx.lineTo(0,15)
        tex_ctx.closePath()
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(70,70,70)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(20,0)
        tex_ctx.lineTo(20,10)
        tex_ctx.lineTo(0,25)
        tex_ctx.lineTo(0,15)
        tex_ctx.closePath()
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(255,220,50,0.9)'
        tex_ctx.fillRect(-19,8,4,8)
        tex_ctx.fillRect(-13,11,4,8)
        tex_ctx.fillRect(-7,14,4,8)
        tex_ctx.lineWidth=7
        tex_ctx.translate(-2,1)
        tex_ctx.strokeStyle='rgb(181, 181, 0,0.5)'
        tex_ctx.fillStyle='rgb(0,0,0,0)'
        e(0,-1,8,8*0.75)
        tex_ctx.stroke()
        tex_ctx.strokeStyle='rgb(255,255,0,0.5)'
        e(0,-4,8,8*0.75)
        tex_ctx.stroke()
        tex_ctx.translate(4,0)
        tex_ctx.strokeStyle='rgb(190,80,190,0.4)'
        tex_ctx.fillStyle='rgb(0,0,0,0)'
        e(0,-1,8,8*0.75)
        tex_ctx.stroke()
        tex_ctx.strokeStyle='rgb(237, 102, 237,0.4)'
        e(0,-4,8,8*0.75)
        tex_ctx.stroke()
        tex_ctx.translate(-2,-2)
        tex_ctx.strokeStyle='rgb(0,190,190,0.3)'
        tex_ctx.fillStyle='rgb(0,0,0,0)'
        e(0,-1,8,8*0.75)
        tex_ctx.stroke()
        tex_ctx.strokeStyle='rgb(0,255,255,0.3)'
        e(0,-4,8,8*0.75)
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(-3,128*2+24)
        tex_ctx.scale(1.75,1.75)
        canvg(tex_ctx.canvas,"<svg><path stroke='black' stroke-width='1.5' fill='rgb(209, 151, 57)' d='M 21 44L 37 50 L 53 44 L 53 11L 38 3L 21 11z'></path><path fill='rgb(0,0,0,0.1)' d='M 37 50 L 53 44 L 53 11L 38 3z'></path><path stroke='black' stroke-width='1' fill='rgb(89, 62, 19)' d='M 21 12L 38 3 L 53 11 L 38 19z'></path><circle stroke='black' stroke-width='1' cx='50' cy='4' r='9' fill='rgb(0,190,50)' transform='scale(0.75,1)'></circle><path stroke='rgb(153, 109, 38)' stroke-width='2' fill='rgb(0,0,0,0)' d='M 38 26L 22 20M 52 19L 38 26M 45 22L 39 48M 45 22L 52 44M 30 22L 38 50M 30 22L 22 45'></path></svg>")
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(117,128*2+4)
        tex_ctx.scale(1.85,1.9)
        canvg(tex_ctx.canvas,"<svg><path stroke='black' stroke-width='1.5' fill='rgb(240, 240, 45)' d='M 55 50 C 45 56 26 53 27 48L 24 30L 24 23C 31 16 47 13 58 22L 58 34z'></path><circle cx='42' cy='59' r='11' fill='rgb(0,0,0,0.3)' transform='scale(1,0.4)'></circle><path stroke='rgb(0,0,0,0.1)' fill='rgb(0,0,0,0)' stroke-width='3' d='M 25 33 C 36 37 38 40 57 35'></path></svg>")
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(117+128,128*2+4)
        tex_ctx.scale(1.85,1.9)
        canvg(tex_ctx.canvas,"<svg><path stroke='black' stroke-width='1.5' fill='rgb(255, 145, 250)' d='M 55 50 C 45 56 26 53 27 48L 24 30L 24 23C 31 16 47 13 58 22L 58 34z'></path><circle cx='42' cy='59' r='11' fill='rgb(0,0,0,0.3)' transform='scale(1,0.4)'></circle><path stroke='rgb(0,0,0,0.1)' fill='rgb(0,0,0,0)' stroke-width='3' d='M 25 33 C 36 37 38 40 57 35'></path><path stroke='rgb(255,255,255)' fill='rgb(0,0,0,0)' stroke-width='3.5' d='M 27 47 C 34 46 41 42 41 39M 34 52 C 56 44 49 42 51 38'></path><circle cx='30' cy='30' r='2.5' fill='rgb(0,205,0)'></circle><circle cx='38' cy='33' r='2.5' fill='rgb(255,255,0)'></circle><circle cx='48' cy='32' r='2.5' fill='rgb(0,105,255)'></circle><circle cx='54' cy='28' r='2' fill='rgb(255,0,0)'></circle></svg>")
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(117+128*2,128*2+4)
        tex_ctx.scale(1.85,1.9)
        canvg(tex_ctx.canvas,"<svg><path stroke='black' stroke-width='1.5' fill='rgb(255, 69, 69)' d='M 55 50 C 45 56 26 53 27 48L 24 30L 24 23C 31 16 47 13 58 22L 58 34z'></path><circle cx='42' cy='59' r='11' fill='rgb(0,0,0,0.3)' transform='scale(1,0.4)'></circle><path stroke='rgb(0,0,0,0.1)' fill='rgb(0,0,0,0)' stroke-width='3' d='M 25 33 C 36 37 38 40 57 35'></path><circle cx='33' cy='43' r='2' fill='rgb(0,0,0,0.3)'></circle><circle cx='42' cy='46' r='2' fill='rgb(0,0,0,0.3)'></circle><circle cx='51' cy='43' r='2' fill='rgb(0,0,0,0.3)'></circle></circle></svg>")
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(117+128*3,128*2+4)
        tex_ctx.scale(1.85,1.9)
        canvg(tex_ctx.canvas,"<svg><path stroke='black' stroke-width='1.5' fill='rgb(89, 71, 255)' d='M 55 50 C 45 56 26 53 27 48L 24 30L 24 23C 31 16 47 13 58 22L 58 34z'></path><circle cx='42' cy='59' r='11' fill='rgb(0,0,0,0.3)' transform='scale(1,0.4)'></circle><path stroke='rgb(0,0,0,0.1)' fill='rgb(0,0,0,0)' stroke-width='3' d='M 25 33 C 36 37 38 40 57 35'></path><circle cx='33' cy='43' r='2' fill='rgb(0,0,0,0.3)'></circle><circle cx='42' cy='46' r='2' fill='rgb(0,0,0,0.3)'></circle><circle cx='51' cy='43' r='2' fill='rgb(0,0,0,0.3)'></circle></svg>")
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128+128*4,128*2+-1)
        tex_ctx.scale(1.8,1.8)
        canvg(tex_ctx.canvas,"<svg><circle cx='35' cy='46' r='16' stroke='black' stroke-width='1.5' fill='rgb(188, 222, 153)' ></circle><path stroke='black' stroke-width='1.5' fill='rgb(250,250,250)' d='M 21 33 C 20 39 50 39 49 33L49 25C49 16 21 16 21 25z'></path><circle cx='35' cy='60' r='10' fill='rgb(0,0,0,0.4)' transform='scale(1,0.4)'></circle><path stroke='rgb(225,225,0)' stroke-width='4' fill='rgb(0,0,0,0)' d='M 26 36 L 26 27M 35 36 L 35 29M 44 36 L 44 27'></path><path stroke='rgb(255,120,0)' stroke-width='3' fill='rgb(0,0,0,0)' d='M 26 59 L 35 38M 44 59 L 35 38'></path><path stroke='rgb(0,100,240)' stroke-width='3' fill='rgb(0,0,0,0)' d='M 21 38 L 35 62M 35 62 L 49 38'></path><circle cx='35' cy='25' r='1.5' fill='rgb(220,0,0)' transform='scale(1,2)'></circle><circle cx='23' cy='25' r='1' fill='rgb(220,0,0)' transform='scale(1,2)'></circle><circle cx='47' cy='25' r='1' fill='rgb(220,0,0)' transform='scale(1,2)'></circle></svg>");
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(153+128*5,128*2+38)
        tex_ctx.scale(1.8,1.8)
        canvg(tex_ctx.canvas,"<svg><path stroke='black' stroke-width='1.5' fill='rgb(84, 222, 98)' d='M20 40 C 25 45 45 45 50 40L60 30L50 18C45 10 25 10 20 18L10 30z' transform='scale(0.6,1)'></path><path  fill='rgb(0,0,0,0.2)' d='M20 40 C 25 45 45 45 50 40L60 30C 44 38 30 41 10 30z' transform='scale(0.6,1)'></path><g transform='translate(2,-18) scale(0.9,0.9)'><path stroke='black' stroke-width='1.5' fill='rgb(84, 222, 98)' d='M20 40 C 25 45 45 45 50 40L60 30L50 18C45 10 25 10 20 18L10 30z' transform='scale(0.6,1)'></path><path  fill='rgb(0,0,0,0.2)' d='M20 40 C 25 45 45 45 50 40L60 30C 44 38 30 41 10 30z' transform='scale(0.6,1)'></path></g><path stroke='rgb(84, 222, 98)' stroke-width='3' fill='rgb(0,0,0,0)' d='M21 18 C 25 24 45 23 49 18' transform='scale(0.6,1)'></path><path stroke='black' stroke-width='1' fill='rgb(255,255,0)' d='M 22 23 L 28 32L 16 32z'></path><path stroke='black' stroke-width='1.5' fill='rgb(0,0,0,0)' d='M 22 26 L 22 28M 19 30.5 L 20.5 29.5M 25.5 30.5 L 23.5 29.5'></path><circle fill='rgb(0,0,0)' cx='22' cy='29.25' r='0.8'></circle><g transform='translate(2,-18) scale(0.9,0.9)'><path stroke='black' stroke-width='1' fill='rgb(255,255,0)' d='M 22 23 L 28 32L 16 32z'></path><path stroke='black' stroke-width='1.5' fill='rgb(0,0,0,0)' d='M 22 26 L 22 28M 19 30.5 L 20.5 29.5M 25.5 30.5 L 23.5 29.5'></path><circle fill='rgb(0,0,0)' cx='22' cy='29.25' r='0.8'></circle></g><circle fill='rgb(0,0,0,0.3)' cx='21' cy='-4' r='5' transform='scale(1,0.6)'></circle></svg>");
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(134+128*6,128*2+0)
        tex_ctx.scale(1.75,1.75)
        canvg(tex_ctx.canvas,"<svg><circle cx='35' cy='49' r='16' stroke='black' stroke-width='1.5' fill='rgb(240, 240, 178)' ></circle><path stroke='black' stroke-width='1.5' fill='rgb(240, 240, 178)' d='M 21 33 C 20 39 50 39 49 33L49 25C49 16 21 16 21 25z'></path><circle cx='35' cy='60' r='10' fill='rgb(0,0,0,0.4)' transform='scale(1,0.4)'></circle><circle cx='35' cy='42' r='3' fill='rgb(0,200,80)' transform='scale(1,1.25)'></circle><circle cx='25' cy='42' r='2' fill='rgb(255,255,0)' transform='scale(1,1.25)'></circle><circle cx='45' cy='42' r='2' fill='rgb(255,255,0)' transform='scale(1,1.25)'></circle><path stroke='black' stroke-width='1' fill='rgb(255,255,255)' d='M 30 30 C 22 45 30 37 35 47C 37 37 44 45 40 30' transform='translate(-7,-8) scale(1.2,1.2)'></path><path stroke='black' stroke-width='1' fill='rgb(255,255,255)' d='M 30 30 C 22 45 30 37 35 47C 37 37 44 45 40 30' transform='translate(8,-26) scale(1.2,1.2) rotate(30)'></path><path stroke='black' stroke-width='1' fill='rgb(255,255,255)' d='M 30 30 C 22 45 30 37 35 47C 37 37 44 45 40 30' transform='translate(-11,16) scale(1.2,1.2) rotate(-30)'></path></svg>")
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(8+128*0,128*3+9)
        tex_ctx.scale(1.75,1.75)
        canvg(tex_ctx.canvas,"<svg><path stroke='black' stroke-width='1.5' fill='rgb(255, 210, 0)' d='M 25 51 C 20 54 40 54 40 50C 37 46 35 42 37 33C 44 34 51 27 51 20C 42 9 14 14 13 20C 13 27 19 35 25 33C 31 36 28 51 24 52'></path><path stroke='black' stroke-width='1.5' fill='rgb(0,0,0,0)' d='M 14 23C 5 18 6 36 17 31M 50 23C 60 18 55 37 46 31'></path><path stroke='rgb(255,0,0)' stroke-width='3' fill='rgb(0,0,0,0)' d='M 15 27C 22 25 20 29 31 26'></path><path stroke='rgb(0,0,255)' stroke-width='3' fill='rgb(0,0,0,0)' d='M 49 26C 49 25 42 29 32 26'></path><text x='33' y='30' fill='rgb(255,255,255)' stroke='rgb(0,255,0)' stroke-width='0.9' style='font-family:cursive;font-size:17px;'>P</text><circle cx='32' cy='36' r='13' stroke-width='7' stroke='rgb(102, 179, 242)' fill='rgb(135, 110, 0)' transform='scale(1,0.4)'></circle></svg>")
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*1-5,128*3)
        tex_ctx.scale(2,2)
        canvg(tex_ctx.canvas,"<svg><path fill='rgb(255,255,0)' stroke='rgb(0,0,0)' stroke-width='1.5' d='M35 15C 20 17 10 55 35 55M35 15C 50 17 60 55 35 55'></path><path fill='rgb(0,0,0)' d='M20 30 C 20 40 50 40 50 30L50 40C50 50 20 50 20 40'></path><path fill='rgb(0,0,0,0.3)' d='M47 25C 57 56 35 60 23 50C 32 48 41 50 50 35'></path></svg>")
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*2-5,128*3)
        tex_ctx.scale(2,2)
        canvg(tex_ctx.canvas,"<svg><g transform='scale(1.1,1.1) translate(-6,-6)'><rect x='25' y='30' width='25' height='25' rx='6' fill='rgb(94, 235, 214)' stroke='black' stroke-width='1.5'></rect><path stroke='rgb(168, 50, 201)' stroke-width='2' fill='rgb(0,0,0,0)' d='M 33 49L 35 36C 45 39 39 44 34 43L40 48'></path><path stroke='black' stroke-width='1.5' fill='rgb(245, 202, 12)' d='M 26 32L 25 22L 33 27L 37 17L 41 27L 48 22L 48 32z'></path><circle cx='25' cy='23' r='3' fill='rgb(245, 229, 12)' stroke='black' stroke-width='1.5'></circle><circle cx='48' cy='23' r='3' fill='rgb(245, 229, 12)' stroke='black' stroke-width='1.5'></circle><circle cx='37' cy='15' r='3.5' fill='rgb(245, 229, 12)' stroke='black' stroke-width='1.5'></circle></g></svg>")
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*3-5,128*3)
        tex_ctx.scale(2,2)
        canvg(tex_ctx.canvas,"<svg><path fill='rgb(255,100,255)' stroke='black' stroke-width='2' d='M30 60C 26 25 64 25 60 60C55 67 35 67 30 60' transform='translate(10,-6) scale(0.75,0.75)'></path><path fill='rgb(0,255,100)' stroke='black' stroke-width='2' d='M30 60C 26 25 64 25 60 60C55 67 35 67 30 60' transform='translate(-7,3) scale(0.75,0.75)'></path></svg>")
        tex_ctx.fillStyle='white'
        e(41,33,1,1)
        e(49,38,1,1)
        e(50,28,1,1)
        e(44,25,1,1)
        e(26,33,1,1)
        e(21,40,1,1)
        e(24,47,1,1)
        e(31,39,1,1)
        e(34,47,1,1)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*4-5,128*3)
        tex_ctx.scale(2,2)
        canvg(tex_ctx.canvas,"<svg><g transform='translate(0,-2) scale(0.9,0.9)'><path stroke='black' stroke-width='2' fill='rgb(255,255,255)' d='M30 20L50 50C 73 53 13 71 30 54z'></path><path stroke='black' stroke-width='1' fill='rgb(0,0,0,0)' d='M 48 51 C 42 56 39 55 33 56'></path><path stroke='rgb(0,0,0,0.1)' stroke-width='6' fill='rgb(255,255,255,0)' d='M 31 24L33 55L26 60'></path><path stroke='black' stroke-width='1' fill='rgb(0,0,0,0)' d='M 48 51 C 42 56 39 55 33 56'></path></g></svg>")
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*5-5,128*3)
        tex_ctx.scale(2,2)
        canvg(tex_ctx.canvas,"<svg><g transform='translate(29,46) scale(-1.2,1.1) rotate(-8)'><path stroke='black' stroke-width='1.5' fill='rgb(40, 212, 71)' d='M-16 -11 C -15 -24 -18 -26 -14 -28C -5 -34 -1 -29 3 -21L -4 -24L 2 -19C -5 -15 -11 -19 -12 -21L -11 -10' transform='translate(4,-1) scale(1.2,1)'></path><path stroke='black' stroke-width='1.5' fill='rgb(40, 212, 71)' d='M-15 -15 C -20 4 4 8 5 0C 8 -3 -1 -24 -15 -15'></path><path stroke='rgb(255,255,255,0.8)' stroke-width='2.5' fill='rgb(0,0,0,0)' d='M-11 -7 C -15 -14 -5 -16 -8 -11M-5 0 C 1 1 4 0 0 -6'></path><circle cx='-7' cy='-3' r='1.8' fill='rgb(255,255,255,0.5)'></circle><circle cx='-2' cy='0' r='1.5' fill='rgb(0,0,0,0.2)'></circle><circle cx='-10' cy='-8' r='1.5' fill='rgb(0,0,0,0.2)'></circle><circle cx='-8' cy='-27' r='1.5' fill='rgb(255,255,255,0.8)'></circle><circle cx='-3' cy='-21' r='1.5' fill='rgb(255,255,255,0.8)'></circle><circle cx='-13' cy='-21' r='1.5' fill='rgb(255,255,255,0.8)'></circle></g></svg>")
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*6+14,128*3+9)
        tex_ctx.scale(1.6,1.6)
        canvg(tex_ctx.canvas,"<svg><path d='M 26 40C 14 39 4 12 30 28C 35 1 45 12 50 26C 68 10 73 31 60 41C 67 58 51 74 41 52C 37 58 2 74 26 40' stroke='rgb(0,0,0)' fill='rgb(138, 88, 18)' stroke-width='2' transform='scale(0.9,0.9) translate(-5,0)'></path><path d='M 27 27L 29 34M 37 27L 39 34M 30 39 L 35 42L40 37' stroke='rgb(255,255,255)' fill='rgb(0,0,0,0)' stroke-width='2'></path></svg>")
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*7+14,128*3+9)
        tex_ctx.scale(1.6,1.6)
        canvg(tex_ctx.canvas,"<svg><g transform='translate(35,35)'><path fill='rgb(255, 255, 160)' stroke='black' stroke-width='2' d='M -20 -15L 15 -15L 20 -10L 20 10L 15 15L-20 15L-20 -15'></path><path fill='rgb(0,0,0,0)' stroke='rgb(0,170,0)' stroke-width='4' d='M -17 -14L -17 14M 13 -14L 18 -8L 18 8L 13 14M -8 -4L7 -4L4 -8L-4 -8L-8 -2'></path><path fill='rgb(50,50,50)' d='M -8 -4L8 -4L8 8L-8 8'></path><path stroke='rgb(50,50,50)' fill='rgb(0,0,0,0)' stroke-width='2' d='M -3 -5L-7 -10M 3 -5L7 -10'></path><circle cx='-4' cy='0' r='2' fill='rgb(255,40,40)'></circle><circle cx='4' cy='0' r='2' fill='rgb(255,40,40)'></circle></g></svg>")
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*0+6,128*4+9)
        tex_ctx.scale(1.6,1.6)
        canvg(tex_ctx.canvas,"<svg><g transform='translate(35,35)'><path fill='rgb(255, 255, 160)' stroke='black' stroke-width='2' d='M -20 -15L 15 -15L 20 -10L 20 10L 15 15L-20 15L-20 -15'></path><path fill='rgb(0,0,0,0)' stroke='rgb(130,160,130)' stroke-width='4' d='M -17 -14L -17 14M 13 -14L 18 -8L 18 8L 13 14'></path><circle cx='0' cy='0' r='6' fill='rgb(100,150,100)'></circle><circle cx='0' cy='0' r='3' fill='rgb(255, 255, 160)'></circle><rect x='-2.5' y='-9' fill='rgb(100,150,100)' width='5' height='4' transform='rotate(0)'></rect><rect x='-2.5' y='-9' fill='rgb(100,150,100)' width='5' height='4' transform='rotate(45)'></rect><rect x='-2.5' y='-9' fill='rgb(100,150,100)' width='5' height='4' transform='rotate(90)'></rect><rect x='-2.5' y='-9' fill='rgb(100,150,100)' width='5' height='4' transform='rotate(135)'></rect><rect x='-2.5' y='-9' fill='rgb(100,150,100)' width='5' height='4' transform='rotate(180)'></rect><rect x='-2.5' y='-9' fill='rgb(100,150,100)' width='5' height='4' transform='rotate(220)'></rect><rect x='-2.5' y='-9' fill='rgb(100,150,100)' width='5' height='4' transform='rotate(265)'></rect><rect x='-2.5' y='-9' fill='rgb(100,150,100)' width='5' height='4' transform='rotate(310)'></rect></g></svg>")
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*1+2,128*4+9)
        tex_ctx.scale(1.75,1.75)
        canvg(tex_ctx.canvas,"<svg><g transform='translate(36,31) scale(0.85,0.85) rotate(-31)'><path stroke='black' stroke-width='2' fill='rgb(0,0,0,0.25)' d='M-6 -15L5 -15C 5 9 13 -1 15 11C 16 15 13 20 13 20C10 30 -10 30 -13 20C -13 20 -16 15 -15 11C -13 -1 -5 9 -5 -15'></path><rect stroke='black' stroke-width='2' fill='rgb(181, 120, 60)' x='-7' y='-22' width='14' height='9' rx='4'></rect><path fill='rgb(133, 206, 255)' d='M 7 2C 34 34 -34 34 -7 2'></path><circle cx='0' cy='3' r='6' transform='scale(1,0.55)' fill='rgb(104, 169, 212)'></circle><path stroke='black' stroke-width='2.5' fill='rgb(133, 206, 255)' d='M 15 9 C -6 36 37 34 15 9' transform='scale(0.5,0.7) translate(-22,-38) rotate(48)'></path><path stroke='black' stroke-width='2.5' fill='rgb(133, 206, 255)' d='M 15 9 C -6 36 37 34 15 9' transform='scale(0.5,0.6) translate(-43,-16) rotate(39)'></path><path fill='rgb(30,30,30)' d='M 22 26C -2 39 0 -1 19 8C 13 5 5 25 22 24' transform='translate(-5,6) scale(0.8,0.75) scale(0.65,0.65)'></path></g></svg>")
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*2+2,128*4+9)
        tex_ctx.scale(1.75,1.75)
        canvg(tex_ctx.canvas,"<svg><g transform='translate(36,31) scale(0.85,0.85) rotate(-31)'><path stroke='black' stroke-width='2' fill='rgb(0,0,0,0.25)' d='M-6 -15L5 -15C 5 9 13 -1 15 11C 16 15 13 20 13 20C10 30 -10 30 -13 20C -13 20 -16 15 -15 11C -13 -1 -5 9 -5 -15'></path><rect stroke='black' stroke-width='2' fill='rgb(181, 120, 60)' x='-7' y='-22' width='14' height='9' rx='4'></rect><path fill='rgb(250, 97, 97)' d='M 7 2C 34 34 -34 34 -7 2'></path><circle cx='0' cy='3' r='6' transform='scale(1,0.55)' fill='rgb(201, 78, 78)'></circle><path stroke='black' stroke-width='2.5' fill='rgb(250, 97, 97)' d='M 15 9 C -6 36 37 34 15 9' transform='scale(0.5,0.7) translate(-22,-38) rotate(48)'></path><path stroke='black' stroke-width='2.5' fill='rgb(250, 97, 97)' d='M 15 9 C -6 36 37 34 15 9' transform='scale(0.5,0.6) translate(-43,-16) rotate(39)'></path><path fill='rgb(30,30,30)' d='M15 25 C 1 26 5 10 8 8L 12 16L15 0L18 16L 22 8C 27 12 28 27 15 25' transform='translate(-8,7) scale(0.8,0.75) scale(0.75,0.75)'></path><path stroke='rgb(250, 97, 97)' stroke-width='3' d='M15 19 L15 30' transform='translate(-8,7) scale(0.8,0.75) scale(0.75,0.75)'></path></g></svg>")
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*3+2,128*4+9)
        tex_ctx.scale(1.75,1.75)
        canvg(tex_ctx.canvas,"<svg><g transform='translate(36,31) scale(0.85,0.85) rotate(-31)'><path stroke='black' stroke-width='2' fill='rgb(0,0,0,0.25)' d='M-6 -15L5 -15C 5 9 13 -1 15 11C 16 15 13 20 13 20C10 30 -10 30 -13 20C -13 20 -16 15 -15 11C -13 -1 -5 9 -5 -15'></path><rect stroke='black' stroke-width='2' fill='rgb(181, 120, 60)' x='-7' y='-22' width='14' height='9' rx='4'></rect><path fill='rgb(169, 86, 252)' d='M 7 2C 34 34 -34 34 -7 2'></path><circle cx='0' cy='3' r='6' transform='scale(1,0.55)' fill='rgb(131, 67, 196)'></circle><path stroke='black' stroke-width='2.5' fill='rgb(169, 86, 252)' d='M 15 9 C -6 36 37 34 15 9' transform='scale(0.5,0.7) translate(-22,-38) rotate(48)'></path><path stroke='black' stroke-width='2.5' fill='rgb(169, 86, 252)' d='M 15 9 C -6 36 37 34 15 9' transform='scale(0.5,0.6) translate(-43,-16) rotate(39)'></path><g transform='translate(-11,2) scale(0.75,0.75)'><path fill='rgb(30,30,30)' d='M 10 20 C 0 1 30 0 20 20'></path><rect fill='rgb(30,30,30)' x='10' y='22' width='10' height='4' rx='2'></rect><path stroke='rgb(169, 86, 252)' fill='rgb(0,0,0,0)' stroke-width='2' d='M 11 15 L 13 12L 15 15L 17 12L19 15'></path></g></g></svg>")
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*4+2,128*4+9)
        tex_ctx.scale(1.75,1.75)
        canvg(tex_ctx.canvas,"<svg><g transform='translate(36,31) scale(0.85,0.85) rotate(-31)'><path stroke='black' stroke-width='2' fill='rgb(0,0,0,0.25)' d='M-6 -15L5 -15C 5 9 13 -1 15 11C 16 15 13 20 13 20C10 30 -10 30 -13 20C -13 20 -16 15 -15 11C -13 -1 -5 9 -5 -15'></path><rect stroke='black' stroke-width='2' fill='rgb(181, 120, 60)' x='-7' y='-22' width='14' height='9' rx='4'></rect><path fill='rgb(87, 232, 76)' d='M 7 2C 34 34 -34 34 -7 2'></path><circle cx='0' cy='3' r='6' transform='scale(1,0.55)' fill='rgb(71, 179, 61)'></circle><path stroke='black' stroke-width='2.5' fill='rgb(87, 232, 76)' d='M 15 9 C -6 36 37 34 15 9' transform='scale(0.5,0.7) translate(-22,-38) rotate(48)'></path><path stroke='black' stroke-width='2.5' fill='rgb(87, 232, 76)' d='M 15 9 C -6 36 37 34 15 9' transform='scale(0.5,0.6) translate(-43,-16) rotate(39)'></path><g transform='scale(0.65,0.65) translate(-14,7)'><path fill='rgb(30,30,30)' d='M 15 9 C -6 36 37 34 15 9' transform='scale(1.25,1.25) translate(-3,-5)'></path><path fill='rgb(87, 232, 76)' d='M 15 9 C -6 36 37 34 15 9' transform='scale(0.3,0.3) translate(36,60)'></path><path fill='rgb(87, 232, 76)' d='M 15 9 C -6 36 37 34 15 9' transform='scale(0.3,-0.3) translate(36,-72)'></path></g></g></svg>")
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*5+2,128*4+9)
        tex_ctx.scale(1.75,1.75)
        canvg(tex_ctx.canvas,"<svg><g transform='translate(36,31) scale(0.85,0.85) rotate(-31)'><path stroke='black' stroke-width='2' fill='rgb(0,0,0,0.25)' d='M-6 -15L5 -15C 5 9 13 -1 15 11C 16 15 13 20 13 20C10 30 -10 30 -13 20C -13 20 -16 15 -15 11C -13 -1 -5 9 -5 -15'></path><rect stroke='black' stroke-width='2' fill='rgb(181, 120, 60)' x='-7' y='-22' width='14' height='9' rx='4'></rect><path fill='rgb(255, 135, 185)' d='M 7 2C 34 34 -34 34 -7 2'></path><circle cx='0' cy='3' r='6' transform='scale(1,0.55)' fill='rgb(199, 105, 144)'></circle><path stroke='black' stroke-width='2.5' fill='rgb(255, 135, 185)' d='M 15 9 C -6 36 37 34 15 9' transform='scale(0.5,0.7) translate(-22,-38) rotate(48)'></path><path stroke='black' stroke-width='2.5' fill='rgb(255, 135, 185)' d='M 15 9 C -6 36 37 34 15 9' transform='scale(0.5,0.6) translate(-43,-16) rotate(39)'></path><g transform='scale(0.65,0.65) translate(-14,7)'><circle cx='15' cy='15' r='10' fill='rgb(30,30,30)'></circle><path stroke='rgb(255, 135, 185)' stroke-width='3' fill='rgb(0,0,0,0)' d='M 19 4 C 4 25 26 3 11 27'></path></g></g></svg>")
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*6+-4,128*4+-9)
        tex_ctx.scale(2,2.2)
        canvg(tex_ctx.canvas,"<svg><g transform='translate(35,35) scale(1,0.6)'> <path fill='rgb(255, 200, 5)' stroke='black' stroke-width='2' d='M -15 -20L 15 -20C16 -15 15 -15 20 -15L20 15C15 15 15 15 15 20L-15 20C-15 15 -15 15 -20 15L-20 -15C-15 -15 -15 -15 -15 -20'></path> <path stroke='rgb(255,0,0)' fill='rgb(0,0,0,0)' stroke-width='1' d='M-15 -11L15 -11L15 11L-15 11L-15 -11M11 -11L11 11M-11 -11L-11 11'></path> <path stroke='rgb(255,0,0)' fill='rgb(0,0,0,0)' stroke-width='2' d='M-3 -7L-3 -0M3 -7L3 -0M-3 3L0 7L3 3'></path> </g></svg>")
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*7,128*4+-2)
        tex_ctx.scale(2,2)
        canvg(tex_ctx.canvas,"<svg><path fill='rgb(255,220,70)' stroke='rgb(0,0,0)' stroke-width='1.5' d='M35 15C 20 17 10 55 35 55M35 15C 50 17 60 55 35 55'></path><path stroke='rgb(235,205,0)' stroke-width='2' fill='rgb(0,0,0,0)' d='M 25 25C 25 25 40 25 40 18M 22 34C 25 35 40 35 47 28M 22 44C 25 45 40 45 49 38M 28 52C 25 53 40 53 47 47'></path><path stroke='rgb(255,255,255)' stroke-width='3' fill='rgb(0,0,0,0)' d='M 35 18C 30 20 28 22 27 26'></path><path stroke='rgb(255,255,255)' stroke-width='3' fill='rgb(0,0,0,0)' d='M 35 18C 30 20 28 22 27 26M 25 16C 30 20 28 22 37 26' transform='translate(52,17) rotate(100) scale(0.5,0.5)'></path><path stroke='rgb(255,255,255)' stroke-width='3' fill='rgb(0,0,0,0)' d='M 35 18C 30 20 28 22 27 26M 25 16C 30 20 28 22 37 26' transform='translate(20,22) rotate(28) scale(0.5,0.5)'></path><path stroke='rgb(255,255,255)' stroke-width='3' fill='rgb(0,0,0,0)' d='M 35 18C 30 20 28 22 27 26M 25 16C 30 20 28 22 37 26' transform='translate(57,52) rotate(168) scale(0.5,0.5)'></path><path fill='rgb(0,0,0,0.2)' d='M47 25C 57 56 35 60 23 50C 32 48 41 50 50 35'></path></svg>")
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*0+8,128*5+12)
        tex_ctx.scale(1.6,1.6)
        canvg(tex_ctx.canvas,"<svg><path d='M 26 40C 14 39 4 12 30 28C 35 1 45 12 50 26C 68 10 73 31 60 41C 67 58 51 74 41 52C 37 58 2 74 26 40' stroke='rgb(0,0,0)' fill='rgb(186, 157, 54)' stroke-width='2' transform='scale(0.9,0.9) translate(-2,0)'></path><path fill='rgb(255, 255, 110)' d='M5.71,16.85L8.23,26.33L0.00,21.00L-8.23,26.33L-5.71,16.85L-13.31,10.67L-3.53,10.15L-0.00,1.00L3.53,10.15L13.31,10.67L5.71,16.85z' transform='translate(34,23) scale(0.75,0.75) rotate(-7)' stroke='black' stroke-width='1.5'></path><path d='M 31 14L 32 21M 52 23L 46 28M 44 52L 42 45M 16 50L 22 43M 13 25L 19 29' stroke='rgb(240, 255, 145)' fill='rgb(0,0,0,0)' stroke-width='2' transform='translate(2,0)'></path></svg>")
        tex_ctx.setTransform(1,0,0,1,0,0)
    
        tex_ctx.translate(128*1+8,128*5+5)
        tex_ctx.scale(1.6,1.6)
        canvg(tex_ctx.canvas,"<svg><circle cx='38' cy='38' r='20' fill='black'></circle><circle cx='35' cy='35' r='20' fill='black'></circle><circle cx='38' cy='38' r='18' fill='rgb(207, 162, 48)'></circle><circle cx='35' cy='35' r='18' fill='rgb(255, 203, 61)'></circle><circle cx='28' cy='28' r='1.5' fill='black'></circle><circle cx='41' cy='28' r='1.5' fill='black'></circle><path fill='rgb(0,0,0,0)' stroke='black' stroke-width='1' d='M 42 37 C 41 39 30 41 29 37'></path><rect fill='white' x='35' y='39' width='3' height='4' stroke='black' stroke-width='1'></rect></svg>")
        tex_ctx.setTransform(1,0,0,1,0,0)
    
        tex_ctx.translate(128*2+8,128*5+5)
        tex_ctx.scale(1.6,1.6)
        canvg(tex_ctx.canvas,"<svg><path d='M20 45C20 55 50 55 50 45C65 45 65 20 50 20C50 10 20 10 20 20Z' fill='rgb(255,255,255)' stroke='rgb(0,0,0)' stroke-width='1.5' transform='translate(0,3)'></path><path d='M50 40 C 60 40 60 25 50 25M50 40 L 50 25' fill='rgb(225,225,225)' stroke='rgb(0,0,0)' stroke-width='1.5' transform='translate(0,3)'></path><path d='M50 20C50 25 20 25 20 20' fill='rgb(0,0,0,0)' stroke='rgb(0,0,0)' stroke-width='1.5' transform='translate(0,3)'></path><circle cx='35' cy='53' r='8' fill='rgb(0,0,0,0.2)' transform='scale(1,0.4)'></circle><path d='M 27 36L 30 40L 33 37L 35 41L 38 36L 42 42' fill='rgb(0,0,0,0)' stroke='rgb(0,0,0,0.7)' stroke-width='1.5'></path></svg>")
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*3+8,128*5+5)
        tex_ctx.scale(1.6,1.6)
        canvg(tex_ctx.canvas,"<svg><g transform='rotate(-15) translate(-30,-5)'><rect fill='rgb(242, 141, 119)' x='35' y='35' width='20' height='27' stroke='black' stroke-width='1.5' rx='2'></rect><path fill='rgb(0,0,0,0)' stroke='rgb(222, 199, 151)' stroke-width='7' d='M 35 47C 41 45 47 42 47 35'></path><path fill='rgb(0,0,0,0)' stroke='rgb(207, 119, 101)' stroke-width='2' d='M 38 47L 39 44L 43 44L 43 40L 48 40L 43 40'></path></g><g transform='rotate(20) translate(12,-27)'><rect fill='rgb(217, 159, 0)' x='35' y='35' width='20' height='27' stroke='black' stroke-width='1.5' rx='2'></rect><path fill='rgb(0,0,0,0)' stroke='rgb(0,0,0,0.1)' stroke-width='4' d='M 40 63L 45 47L 50 63'></path><path fill='rgb(0,0,0,0)' stroke='rgb(0,0,0,0.15)' stroke-width='1.5' d='M 39 42L 42 39L 44 41L 47 39L 51 42'></path></g></svg>")
        tex_ctx.setTransform(1,0,0,1,0,0)
    
        let matrixStack=[],
            firstInPath=0,
            translate=(x,y=x)=>tex_ctx.translate(x,y),
            rotate=(r)=>tex_ctx.rotate(r*Math.PI/180),
            scale=(x,y=x)=>tex_ctx.scale(x,y),
            noStroke=()=>tex_ctx.strokeStyle='rgba(0,0,0,0)',
            strokeWeight=(n)=>tex_ctx.lineWidth=n,
            stroke=(r,g=r,b=r,a=255)=>tex_ctx.strokeStyle='rgba('+r+','+g+','+b+','+(a/255)+')',
            fill=(r,g=r,b=r,a=255)=>tex_ctx.fillStyle='rgba('+r+','+g+','+b+','+(a/255)+')',
            noFill=()=>tex_ctx.fillStyle='rgba(0,0,0,0)',
            ROUND='round',
            MITER='miter',
            BEVEL='bevel',
            SQUARE='butt',
            PROJECT='square',
            strokeJoin=(m)=>tex_ctx.lineJoin=m,
            strokeCap=(m)=>tex_ctx.lineCap=m,
            _=strokeCap(ROUND),
            text=(n,x,y)=>tex_ctx.fillText(n,x,y),
            createFont=(x)=>x,
            textFont=(x,n,bold)=>tex_ctx.font=(bold?'bold ':'')+n+'px '+x,
            line=(a,b,c,d)=>{
                tex_ctx.beginPath()
                tex_ctx.moveTo(a,b)
                tex_ctx.lineTo(c,d)
                tex_ctx.stroke()
            },
            ellipse=(x,y,w,h)=>{
                tex_ctx.beginPath()
                tex_ctx.ellipse(x,y,w*0.5,h*0.5,0,0,7)
                tex_ctx.fill()
                tex_ctx.stroke()
            },
            arc=(x,y,w,h,a,b)=>{
                tex_ctx.beginPath()
                tex_ctx.ellipse(x,y,w*0.5,h*0.5,0,a*Math.PI/180,b*Math.PI/180)
                tex_ctx.fill()
                tex_ctx.stroke()
            },
            rect=(x,y,w,h)=>{
                tex_ctx.fillRect(x,y,w,h)
                tex_ctx.strokeRect(x,y,w,h)
            },
            beginShape=()=>tex_ctx.beginPath()+(firstInPath=1),
            vertex=function(){
                if(firstInPath)
                    tex_ctx.moveTo(...arguments)+(firstInPath=0)
                else
                    tex_ctx.lineTo(...arguments)
            },
            bezierVertex=function(){tex_ctx.bezierCurveTo(...arguments)},
            endShape=()=>{
                tex_ctx.fill()
                tex_ctx.stroke()
            },
            pushMatrix=()=>matrixStack.push(tex_ctx.getTransform()),
            popMatrix=()=>{
                let mat=matrixStack.pop()
                tex_ctx.setTransform(mat.a,mat.b,mat.c,mat.d,mat.e,mat.f)
            }
        
        translate(128*4-328,128*5+-150)
        scale(1.05,1.05)
        noStroke();
        fill(230);
        beginShape();
        vertex(345, 180);
        vertex(340, 176);
        vertex(343, 165);
        vertex(361, 163);
        vertex(361, 163);
        bezierVertex(366, 151, 378, 150, 385, 160);
        vertex(404, 160);
        vertex(407, 175);
        vertex(402, 177);
        vertex(407, 195);
        vertex(340, 194);
        vertex(345, 180);
        endShape();
        fill(255, 217, 0);
        beginShape();
        vertex(407, 191);
        bezierVertex(414, 199, 414, 211, 400, 241);
        bezierVertex(406, 249, 399, 255, 385, 250);
        bezierVertex(377, 253, 370, 251, 365, 251);
        bezierVertex(345, 257, 343, 245, 349, 241);
        bezierVertex(336, 223, 333, 201, 342, 193);
        vertex(407, 191);
        endShape();
        fill(235, 178, 21);
        beginShape();
        vertex(402, 202);
        bezierVertex(404, 233, 381, 247, 363, 244);
        bezierVertex(375, 235, 391, 225, 402, 202);
        endShape();
        fill(107, 107, 107);
        beginShape();
        vertex(389, 232);
        vertex(362, 234);
        bezierVertex(359, 230, 359, 223, 360, 220);
        bezierVertex(342, 211, 368, 191, 371, 212);
        bezierVertex(372, 211, 383, 211, 381, 212);
        bezierVertex(384, 190, 410, 213, 389, 219);
        bezierVertex(390, 220, 392, 228, 389, 232);
        endShape();
        fill(161, 161, 161);
        beginShape();
        vertex(387, 230);
        vertex(377, 230);
        bezierVertex(374, 210, 394, 219, 387, 230);
        endShape();
        fill(161, 161, 161);
        beginShape();
        vertex(364, 232);
        vertex(373, 231);
        bezierVertex(375, 212, 358, 217, 364, 232);
        endShape();
        fill(54, 54, 54);
        beginShape();
        vertex(370, 224);
        bezierVertex(370, 219, 367, 219, 367, 224);
        bezierVertex(367, 229, 370, 229, 370, 224);
        endShape();
        beginShape();
        vertex(382, 224);
        bezierVertex(382, 218, 379, 218, 379, 224);
        bezierVertex(379, 229, 382, 229, 382, 224);
        endShape();
        beginShape();
        vertex(375, 228);
        bezierVertex(380, 228, 380, 231, 375, 231);
        bezierVertex(370, 232, 370, 228, 375, 228);
        endShape();
        stroke(161, 161, 161);
        strokeWeight(3);
        line(347, 178, 401, 176);
        stroke(100, 90, 90);
        strokeWeight(5);
        noFill();
        strokeJoin(ROUND);
        beginShape();
        vertex(361, 163);
        bezierVertex(366, 151, 378, 150, 385, 160);
        vertex(404, 160);
        vertex(407, 175);
        vertex(402, 177);
        vertex(407, 191);
        bezierVertex(414, 199, 414, 211, 400, 241);
        bezierVertex(406, 249, 399, 255, 385, 250);
        bezierVertex(377, 253, 370, 251, 365, 251);
        bezierVertex(345, 257, 343, 245, 349, 241);
        bezierVertex(336, 223, 333, 201, 345, 180);
        vertex(340, 176);
        vertex(343, 165);
        vertex(361, 163);
        endShape();
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        
        translate(128*5-369,128*5+-97)
        scale(1.1,1.1)
        noStroke();
        var laces = [[390, 188], [390, 176], [387, 169], [379, 168], [377, 163], [367, 159], [361, 152], [356, 141], [357, 127], [361, 117], [370, 111], [374, 111], [386, 113], [395, 122], [401, 114], [410, 108], [420, 109], [429, 116], [432, 127], [431, 138], [428, 148], [423, 158], [417, 166], [410, 175], [401, 184]];
        
        for (var i = 0; i < laces.length; i ++) {
            fill(100, 90, 90);
            ellipse(laces[i][0], laces[i][1], 16, 16);
        }
        for (var i = 0; i < laces.length; i ++) {
            fill(255, 255, 255);
            ellipse(laces[i][0], laces[i][1], 10, 10);
        }
        noStroke();
        strokeJoin(ROUND);
        fill(248, 150, 255);
        beginShape();
        vertex(388, 192);
        bezierVertex(407, 162, 353, 172, 355, 131);
        bezierVertex(360, 106, 393, 101, 394, 127);
        bezierVertex(400, 99, 432, 101, 433, 127);
        bezierVertex(436, 150, 415, 176, 388, 192);
        endShape();
        fill(255, 255, 255);
        ellipse(390, 190, 5, 5);
        noFill();
        stroke(211, 144, 212);
        strokeWeight(10);
        beginShape();
        vertex(428, 132);
        bezierVertex(427, 150, 414, 167, 406, 172);
        bezierVertex(414, 162, 428, 142, 428, 132);
        endShape();
        stroke(255, 191, 254);
        beginShape();
        vertex(362, 130);
        bezierVertex(361, 126, 371, 116, 373, 118);
        endShape();
        beginShape();
        vertex(402, 125);
        bezierVertex(403, 122, 405, 117, 410, 116);
        endShape();
        noStroke();
        fill(211, 144, 212);
        beginShape();
        vertex(390, 120);
        bezierVertex(394, 123, 392, 127, 393, 130);
        bezierVertex(388, 130, 386, 123, 390, 120);
        endShape();
        pushMatrix();
        translate(22, -73);
        fill(245, 227, 157);
        beginShape();
        vertex(389, 232);
        vertex(362, 234);
        bezierVertex(359, 230, 359, 223, 360, 220);
        bezierVertex(342, 211, 368, 191, 371, 212);
        bezierVertex(372, 211, 383, 211, 381, 212);
        bezierVertex(384, 190, 410, 213, 389, 219);
        bezierVertex(390, 220, 392, 228, 389, 232);
        endShape();
        fill(207, 190, 127);
        beginShape();
        vertex(387, 230);
        vertex(377, 230);
        bezierVertex(374, 205, 394, 217, 387, 230);
        endShape();
        beginShape();
        vertex(364, 232);
        vertex(373, 231);
        bezierVertex(375, 207, 357, 216, 364, 232);
        endShape();
        fill(54, 54, 54);
        beginShape();
        vertex(371, 224);
        bezierVertex(371, 218, 368, 218, 368, 224);
        bezierVertex(368, 229, 371, 229, 371, 224);
        endShape();
        beginShape();
        vertex(381, 224);
        bezierVertex(381, 218, 378, 218, 378, 224);
        bezierVertex(378, 229, 381, 229, 381, 224);
        endShape();
        beginShape();
        vertex(375, 228);
        bezierVertex(380, 228, 380, 231, 375, 231);
        bezierVertex(370, 232, 370, 228, 375, 228);
        endShape();
        popMatrix();
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        
        translate(128*6-324,128*5+-155)
        scale(1.07,1.07)
        noStroke();
        strokeJoin(ROUND);
        fill(245, 81, 81);
        beginShape();
        vertex(343, 158);
        bezierVertex(370, 155, 368, 155, 397, 159);
        bezierVertex(400, 168, 400, 170, 397, 183);
        vertex(391, 186);
        bezierVertex(408, 209, 405, 270, 344, 250);
        bezierVertex(334, 245, 329, 235, 332, 224);
        bezierVertex(323, 221, 318, 202, 328, 194);
        vertex(344, 183);
        bezierVertex(335, 176, 337, 165, 343, 158);
        endShape();
        stroke(255,255,255,90);
        noFill();
        strokeWeight(6);
        beginShape();
        vertex(341, 226);
        bezierVertex(338, 227, 340, 244, 353, 242);
        endShape();
        fill(255, 210, 100);
        rect(353, 163, 32, 16, 5);
        textFont(createFont("comic sans ms"), 10);
        fill(0, 0, 0);
        text("POW", 370, 173);
        noFill();
        stroke(90, 90, 90);
        strokeWeight(4);
        beginShape();
        vertex(343, 158);
        bezierVertex(358, 156, 377, 156, 397, 159);
        bezierVertex(400, 168, 400, 170, 397, 183);
        vertex(391, 186);
        bezierVertex(408, 209, 405, 270, 344, 250);
        bezierVertex(334, 245, 329, 235, 332, 224);
        bezierVertex(323, 221, 318, 202, 328, 194);
        vertex(344, 183);
        bezierVertex(335, 176, 337, 165, 343, 158);
        endShape();
        strokeWeight(2);
        beginShape();
        vertex(333, 224);
        bezierVertex(335, 212, 340, 206, 340, 205);
        endShape();
        strokeWeight(1);
        beginShape();
        vertex(344, 183);
        bezierVertex(352, 180, 384, 178, 391, 186);
        endShape();
        noStroke();
        pushMatrix();
        translate(-9, -2);
        fill(237, 237, 237);
        beginShape();
        vertex(389, 232);
        vertex(362, 234);
        bezierVertex(351, 204, 399, 202, 389, 232);
        endShape();
        fill(50, 50, 50);
        ellipse(361, 212, 13, 13);
        ellipse(387, 210, 13, 13);
        fill(50, 50, 50);
        beginShape();
        vertex(387, 230);
        vertex(377, 230);
        bezierVertex(374, 210, 394, 219, 387, 230);
        endShape();
        fill(50, 50, 50);
        beginShape();
        vertex(364, 232);
        vertex(373, 231);
        bezierVertex(375, 212, 358, 217, 364, 232);
        endShape();
        fill(237, 237, 237);
        stroke(237, 237, 237);
        strokeWeight(1);
        beginShape();
        vertex(370, 225);
        bezierVertex(370, 221, 368, 221, 368, 225);
        bezierVertex(368, 229, 370, 229, 370, 225);
        endShape();
        beginShape();
        vertex(381, 224);
        bezierVertex(381, 220, 379, 220, 379, 224);
        bezierVertex(379, 228, 381, 229, 381, 224);
        endShape();
        noStroke();
        fill(150, 150, 150);
        beginShape();
        vertex(376, 228);
        bezierVertex(377, 228, 378, 231, 376, 231);
        bezierVertex(371, 232, 371, 228, 376, 228);
        endShape();
        popMatrix();
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        translate(128*7-322,128*5+-83)
        scale(1.1,1.1)
        noStroke();
        fill(255, 255, 255);
        beginShape();
        vertex(350, 97);
        bezierVertex(338, 86, 380, 83, 370, 98);
        vertex(371, 105);
        vertex(377, 103);
        vertex(374, 108);
        vertex(380, 110);
        vertex(374, 112);
        vertex(377, 116);
        vertex(371, 114);
        vertex(395, 167);
        bezierVertex(401, 183, 319, 183, 325, 167);
        vertex(349, 114);
        vertex(343, 116);
        vertex(346, 112);
        vertex(340, 110);
        vertex(346, 108);
        vertex(343, 103);
        vertex(349, 105);
        vertex(350, 97);
        endShape();
        stroke(100, 90, 90);
        strokeWeight(3);
        line(360, 130, 368, 130);
        line(360, 142, 376, 142);
        line(360, 154, 380, 154);
        line(360, 165, 385, 165);
        stroke(100, 90, 90);
        strokeWeight(4);
        noFill();
        strokeJoin(ROUND);
        beginShape();
        vertex(350, 97);
        bezierVertex(338, 86, 380, 83, 370, 98);
        vertex(371, 103);
        vertex(379, 102);
        vertex(376, 108);
        vertex(382, 110);
        vertex(375, 113);
        vertex(379, 117);
        vertex(373, 116);
        vertex(371, 114);
        vertex(395, 167);
        bezierVertex(401, 183, 319, 183, 325, 167);
        vertex(349, 114);
        vertex(341, 118);
        vertex(346, 112);
        vertex(338, 110);
        vertex(346, 108);
        vertex(341, 101);
        vertex(349, 105);
        vertex(350, 97);
        endShape();
        strokeWeight(10);
        beginShape();
        endShape();
        noStroke();
        fill(20, 186, 20);
        beginShape();
        vertex(357, 107);
        vertex(377, 103);
        vertex(374, 108);
        vertex(380, 110);
        vertex(374, 112);
        vertex(377, 116);
        vertex(371, 114);
        vertex(360, 110);
        vertex(343, 116);
        vertex(346, 112);
        vertex(340, 110);
        vertex(346, 108);
        vertex(343, 103);
        vertex(349, 105);
        endShape();
        fill(255, 0, 0);
        ellipse(359, 105, 8, 8);
        ellipse(362, 111, 8, 8);
        ellipse(355, 111, 8, 8);
        pushMatrix();
        translate(59, -25);
        scale(0.8);
        fill(255, 199, 69);
        beginShape();
        vertex(389, 232);
        vertex(362, 234);
        bezierVertex(359, 230, 359, 223, 360, 220);
        bezierVertex(342, 211, 368, 191, 371, 212);
        bezierVertex(372, 211, 383, 211, 381, 212);
        bezierVertex(384, 190, 410, 213, 389, 219);
        bezierVertex(390, 220, 392, 228, 389, 232);
        endShape();
        fill(240);
        beginShape();
        vertex(362, 219);
        vertex(385, 219);
        bezierVertex(390, 231, 379, 231, 375, 224);
        bezierVertex(370, 231, 361, 231, 362, 219);
        endShape();
        fill(54, 54, 54);
        beginShape();
        vertex(370, 224);
        bezierVertex(370, 220, 367, 221, 367, 224);
        bezierVertex(367, 228, 370, 227, 370, 224);
        endShape();
        beginShape();
        vertex(382, 224);
        bezierVertex(382, 221, 379, 220, 379, 224);
        bezierVertex(379, 227, 382, 228, 382, 224);
        endShape();
        beginShape();
        vertex(375, 228);
        bezierVertex(379, 228, 379, 231, 375, 231);
        bezierVertex(371, 231, 371, 228, 375, 228);
        endShape();
        popMatrix();
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        
        translate(128*0-275,128*6+-313)
        scale(0.9,0.9)
        noStroke();
        fill(86, 89, 88);
        beginShape();
        vertex(321, 456);
        bezierVertex(309, 435, 350, 373, 393, 390);
        vertex(423, 363);
        bezierVertex(432, 358, 441, 369, 433, 375);
        vertex(399, 399);
        vertex(407, 424);
        bezierVertex(406, 442, 380, 473, 346, 476);
        vertex(321, 456);
        endShape();
        fill(54, 52, 54);
        beginShape();
        vertex(321, 456);
        bezierVertex(309, 435, 350, 373, 393, 390);
        vertex(395, 407);
        bezierVertex(352, 399, 332, 452, 338, 460);
        endShape();
        noFill();
        stroke(54, 52, 54);
        strokeWeight(4);
        beginShape();
        vertex(342, 408);
        bezierVertex(375, 371, 423, 395, 378, 437);
        bezierVertex(322, 485, 305, 448, 342, 408);
        endShape();
        stroke(148, 143, 143);
        strokeWeight(4);
        line(426, 371, 421, 375);
        noFill();
        strokeJoin(ROUND);
        stroke(148, 143, 143);
        strokeWeight(5);
        beginShape();
        vertex(321, 456);
        bezierVertex(309, 435, 350, 373, 393, 390);
        vertex(423, 363);
        bezierVertex(432, 358, 441, 369, 433, 375);
        vertex(398, 399);
        vertex(407, 424);
        bezierVertex(406, 442, 380, 473, 346, 476);
        vertex(321, 456);
        endShape();
        pushMatrix();
        translate(31, 471);
        rotate(-34);
        scale(0.8);
        noStroke();
        fill(247, 247, 247);
        beginShape();
        vertex(389, 232);
        vertex(362, 234);
        bezierVertex(359, 230, 359, 223, 360, 220);
        bezierVertex(342, 211, 368, 191, 371, 212);
        bezierVertex(372, 211, 383, 211, 381, 212);
        bezierVertex(384, 190, 410, 213, 389, 219);
        bezierVertex(390, 220, 392, 228, 389, 232);
        endShape();
        fill(219, 219, 219);
        beginShape();
        vertex(387, 230);
        vertex(377, 230);
        bezierVertex(374, 210, 394, 219, 387, 230);
        endShape();
        fill(219, 219, 219);
        beginShape();
        vertex(364, 232);
        vertex(373, 231);
        bezierVertex(375, 212, 358, 217, 364, 232);
        endShape();
        fill(54, 54, 54);
        beginShape();
        vertex(370, 224);
        bezierVertex(370, 219, 367, 219, 367, 224);
        bezierVertex(367, 229, 370, 229, 370, 224);
        endShape();
        beginShape();
        vertex(382, 224);
        bezierVertex(382, 218, 379, 218, 379, 224);
        bezierVertex(379, 229, 382, 229, 382, 224);
        endShape();
        beginShape();
        vertex(375, 228);
        bezierVertex(380, 228, 380, 231, 375, 231);
        bezierVertex(370, 232, 370, 228, 375, 228);
        endShape();
        popMatrix();
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        
        translate(128*1-396,128*6+-49)
        scale(1.2,1.2)
        noStroke();
        fill(219, 85, 85);
        beginShape();
        vertex(370, 49);
        vertex(387, 52);
        vertex(385, 61);
        vertex(411, 70);
        vertex(421, 103);
        vertex(415, 125);
        vertex(394, 140);
        vertex(354, 130);
        vertex(349, 78);
        vertex(374, 63);
        vertex(370, 49);
        endShape();
        stroke(247, 230, 121);
        strokeWeight(3);
        line(361, 74, 407, 130);
        line(353, 101, 383, 137);
        line(385, 65, 418, 107);
        line(411, 70, 354, 130);
        line(385, 65, 353, 101);
        line(418, 93, 375, 137);
        stroke(100, 90, 90);
        strokeWeight(4);
        noFill();
        strokeJoin(ROUND);
        beginShape();
        vertex(370, 49);
        vertex(387, 52);
        vertex(385, 61);
        vertex(411, 70);
        vertex(421, 103);
        vertex(415, 125);
        vertex(394, 140);
        vertex(354, 130);
        vertex(349, 78);
        vertex(374, 63);
        vertex(370, 49);
        endShape();
        stroke(122, 240, 152);
        strokeWeight(7);
        beginShape();
        vertex(385, 61);
        bezierVertex(416, 49, 412, 91, 385, 67);
        vertex(376, 67);
        bezierVertex(355, 102, 345, 55, 376, 61);
        vertex(385, 61);
        endShape();
        noStroke();
        pushMatrix();
        translate(11, -116);
        stroke(122, 240, 152);
        strokeWeight(5);
        beginShape();
        vertex(389, 232);
        vertex(362, 234);
        bezierVertex(359, 230, 359, 223, 360, 220);
        bezierVertex(342, 211, 368, 191, 371, 212);
        bezierVertex(372, 200, 383, 209, 381, 212);
        bezierVertex(384, 190, 410, 213, 389, 219);
        bezierVertex(390, 220, 392, 228, 389, 232);
        endShape();
        noStroke();
        fill(214, 190, 135);
        beginShape();
        vertex(389, 232);
        vertex(362, 234);
        bezierVertex(359, 230, 359, 223, 360, 220);
        bezierVertex(342, 211, 368, 191, 371, 212);
        bezierVertex(372, 211, 383, 211, 381, 212);
        bezierVertex(384, 190, 410, 213, 389, 219);
        bezierVertex(390, 220, 392, 228, 389, 232);
        endShape();
        fill(189, 160, 99);
        beginShape();
        vertex(387, 230);
        vertex(377, 230);
        bezierVertex(374, 210, 394, 219, 387, 230);
        endShape();
        fill(189, 160, 99);
        beginShape();
        vertex(364, 232);
        vertex(373, 231);
        bezierVertex(375, 212, 358, 217, 364, 232);
        endShape();
        fill(135, 109, 58);
        beginShape();
        vertex(371, 212);
        bezierVertex(372, 211, 383, 211, 381, 212);
        bezierVertex(381, 215, 379, 221, 373, 219);
        bezierVertex(377, 216, 371, 212, 371, 212);
        endShape();
        fill(59, 59, 255);
        beginShape();
        vertex(369, 212);
        bezierVertex(372, 201, 383, 208, 383, 212);
        endShape();
        fill(107, 107, 255);
        beginShape();
        vertex(369, 212);
        bezierVertex(372, 209, 383, 208, 383, 212);
        endShape();
        fill(54, 54, 54);
        beginShape();
        vertex(370, 224);
        bezierVertex(370, 221, 367, 221, 367, 224);
        bezierVertex(367, 228, 370, 228, 370, 224);
        endShape();
        beginShape();
        vertex(382, 224);
        bezierVertex(382, 221, 379, 221, 379, 224);
        bezierVertex(379, 228, 382, 228, 382, 224);
        endShape();
        beginShape();
        vertex(375, 228);
        bezierVertex(380, 228, 380, 231, 375, 231);
        bezierVertex(370, 232, 370, 228, 375, 228);
        endShape();
        popMatrix();
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        
        translate(128*2-203,128*6+-148)
        scale(0.69,0.62)
        stroke(100, 90, 90);
        strokeWeight(13);
        noFill();
        arc(387, 300, 11, 11, -160, 20);
        arc(376, 298, 11, 11, 20, 200);
        arc(366, 296, 11, 11, -160, 20);
        arc(355, 294, 11, 11, 20, 200);
        arc(345, 292, 11, 11, -90, 20);
        arc(405, 293, 11, 11, -240, -60);
        arc(412, 284, 11, 11, -60, 120);
        arc(419, 276, 11, 11, -240, -60);
        arc(426, 267, 11, 11, -60, 120);
        arc(432, 258, 11, 11, -240, -150);
        strokeWeight(4);
        ellipse(421, 327, 25, 25);
        noStroke();
        fill(245, 245, 245);
        beginShape();
        vertex(367, 431);
        bezierVertex(353, 279, 408, 271, 430, 329);
        vertex(415, 338);
        bezierVertex(400, 288, 370, 321, 388, 427);
        vertex(367, 431);
        endShape();
        stroke(255, 0, 0);
        strokeWeight(5);
        line(385, 425, 369, 404);
        line(382, 398, 368, 376);
        line(380, 374, 370, 343);
        line(382, 343, 380, 313);
        line(393, 314, 402, 300);
        line(408, 317, 424, 325);
        stroke(100, 90, 90);
        strokeWeight(5);
        noFill();
        strokeJoin(ROUND);
        beginShape();
        vertex(367, 431);
        bezierVertex(353, 279, 408, 271, 430, 329);
        vertex(415, 338);
        bezierVertex(400, 288, 370, 321, 388, 427);
        vertex(367, 431);
        endShape();
        stroke(161, 95, 59);
        strokeWeight(5);
        noFill();
        arc(387, 300, 11, 11, -160, 20);
        arc(376, 298, 11, 11, 20, 200);
        arc(366, 296, 11, 11, -160, 20);
        arc(355, 294, 11, 11, 20, 200);
        arc(345, 292, 11, 11, -90, 20);
        arc(405, 293, 11, 11, -240, -60);
        arc(412, 284, 11, 11, -60, 120);
        arc(419, 276, 11, 11, -240, -60);
        arc(426, 267, 11, 11, -60, 120);
        arc(432, 258, 11, 11, -240, -150);
        stroke(0);
        fill(255);
        strokeWeight(3);
        ellipse(393, 306, 15, 16);
        ellipse(411, 302, 14, 15);
        noStroke();
        fill(0);
        beginShape();
        vertex(385, 303);
        bezierVertex(392, 306, 393, 306, 394, 314);
        bezierVertex(389, 314, 385, 307, 385, 303);
        endShape();
        beginShape();
        vertex(411, 295);
        bezierVertex(419, 298, 420, 298, 417, 305);
        bezierVertex(411, 304, 410, 300, 411, 295);
        endShape();
        fill(255, 255, 153);
        ellipse(422, 328, 20, 20);
        fill(255, 255, 240);
        ellipse(421, 325, 10, 10);
        stroke(100, 90, 90);
        strokeWeight(8);
        noFill();
        strokeJoin(ROUND);
        beginShape();
        vertex(385, 393);
        vertex(403, 387);
        vertex(425, 396);
        vertex(416, 416);
        vertex(393, 408);
        vertex(385, 393);
        endShape();
        noStroke();
        fill(245, 245, 245);
        beginShape();
        vertex(385, 393);
        vertex(403, 387);
        vertex(425, 396);
        vertex(416, 416);
        vertex(393, 408);
        vertex(385, 393);
        endShape();
        fill(100, 90, 90);
        ellipse(396, 397, 5, 5);
        stroke(0, 200, 0);
        strokeWeight(3);
        line(365, 388, 384, 387);
        line(365, 391, 384, 391);
        line(384, 391, 396, 397);
        pushMatrix();
        translate(409, 404);
        rotate(20);
        scale(0.12);
        translate(-350, -250);
        strokeWeight(5);
        fill(255);
        stroke(255);
        rect(300, 200, 100, 25);
        stroke(0);
        beginShape();
        vertex(300, 225);
        vertex(300, 300);
        vertex(400, 300);
        vertex(400, 225);
        endShape();
        arc(400, 200, 50, 50, -180, 90);
        line(325, 200, 374, 200);
        arc(300, 200, 50, 50, -270, 0);
        strokeWeight(3);
        arc(350, 260, 30, 30, -10, 190);
        line(335, 256, 364, 256);
        noStroke();
        fill(0);
        ellipse(330, 233, 6, 10);
        ellipse(370, 233, 6, 10);
        popMatrix();
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        
        translate(128*3-354,128*6+-43)
        scale(0.9,0.9)
        rotate(-6)
        noStroke();
        fill(140, 207, 255);
        ellipse(450, 175, 100, 100);
        noStroke();
        fill(255, 0, 251);
        beginShape();
        vertex(460, 187);
        bezierVertex(447, 159, 427, 172, 433, 198);
        bezierVertex(433, 204, 420, 201, 418, 182);
        bezierVertex(424, 197, 396, 198, 403, 170);
        bezierVertex(409, 112, 498, 112, 498, 178);
        vertex(479, 188);
        bezierVertex(478, 217, 448, 214, 460, 187);
        endShape();
        fill(143, 255, 214);
        beginShape();
        vertex(430, 211);
        bezierVertex(436, 197, 430, 195, 423, 193);
        bezierVertex(413, 185, 424, 169, 442, 180);
        bezierVertex(446, 185, 448, 198, 436, 215);
        bezierVertex(432, 216, 429, 213, 430, 211);
        endShape();
        beginShape();
        vertex(422, 180);
        bezierVertex(403, 173, 403, 157, 416, 141);
        bezierVertex(427, 136, 412, 153, 435, 147);
        bezierVertex(447, 157, 403, 159, 426, 177);
        endShape();
        beginShape();
        vertex(488, 203);
        bezierVertex(491, 179, 473, 181, 469, 179);
        bezierVertex(456, 170, 461, 151, 492, 151);
        bezierVertex(503, 170, 499, 189, 488, 203);
        endShape();
        pushMatrix();
        translate(-2, 2);
        beginShape();
        vertex(464, 156);
        bezierVertex(455, 143, 465, 142, 469, 143);
        vertex(472, 140);
        bezierVertex(471, 124, 495, 139, 489, 148);
        vertex(480, 144);
        vertex(471, 149);
        bezierVertex(471, 155, 464, 156, 464, 156);
        endShape();
        popMatrix();
        stroke(100, 90, 90);
        strokeWeight(5);
        noFill();
        ellipse(450, 175, 100, 100);
        pushMatrix();
        translate(0, -2);
        noStroke();
        fill(209, 209, 209);
        ellipse(434, 137, 10, 10);
        ellipse(442, 140, 10, 10);
        ellipse(450, 141, 10, 10);
        ellipse(458, 140, 10, 10);
        ellipse(466, 137, 10, 10);
        rect(434, 119, 32, 20);
        fill(235, 235, 235);
        ellipse(450, 119, 32, 10);
        noFill();
        stroke(166, 166, 166);
        strokeWeight(5);
        arc(450, 118, 14, 20, 180, 360);
        popMatrix();
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        
        translate(128*4-310,128*6+-147)
        scale(0.9,0.9)
        noStroke();
        rotate(9)
        fill(255, 255, 105);
        stroke(100, 90, 90);
        strokeWeight(5);
        ellipse(450, 175, 100, 100);
        pushMatrix();
        translate(0, -2);
        noStroke();
        fill(209, 209, 209);
        ellipse(434, 137, 10, 10);
        ellipse(442, 140, 10, 10);
        ellipse(450, 141, 10, 10);
        ellipse(458, 140, 10, 10);
        ellipse(466, 137, 10, 10);
        rect(434, 119, 32, 20);
        fill(235, 235, 235);
        ellipse(450, 119, 32, 10);
        noFill();
        stroke(166, 166, 166);
        strokeWeight(5);
        arc(450, 118, 14, 20, 180, 360);
        popMatrix();
        pushMatrix()
        translate(56,28)
        stroke(255, 255, 255);
        strokeWeight(12)
        beginShape();
        vertex(360, 130);
        bezierVertex(359, 126, 367, 115, 369, 118);
        endShape();
        stroke(0,0,0,30)
        translate(793,11)
        scale(-1,1)
        beginShape();
        vertex(360, 143);
        bezierVertex(359, 126, 367, 115, 369, 113);
        endShape();
        translate(793,287)
        scale(-1,-1)
        beginShape();
        vertex(360, 143);
        bezierVertex(359, 126, 367, 115, 379, 114);
        endShape();
        popMatrix()
        pushMatrix()
        textFont(createFont('comic sans ms'),36,1)
        rotate(0)
        scale(1,0.9)
        fill(100,60,255)
        text('m',475,179)
        rotate(-5)
        fill(100,200,255)
        text('m',433,210)
        popMatrix()
        textFont(createFont('comic sans ms'),12,1)
        rotate(-5)
        fill(150,100,0)
        text('1983',410,216)
        text('CHAMP',414,228)
        noStroke()
        pushMatrix();
        translate(227, 1);
        rotate(15)
        scale(0.75,0.75)
        fill(160,160,160);
        beginShape();
        vertex(389, 232);
        vertex(362, 234);
        bezierVertex(359, 230, 359, 223, 360, 220);
        bezierVertex(342, 211, 368, 191, 371, 212);
        bezierVertex(372, 211, 383, 211, 381, 212);
        bezierVertex(384, 190, 410, 213, 389, 219);
        bezierVertex(390, 220, 392, 228, 389, 232);
        endShape();
        fill(207, 190, 254);
        beginShape();
        vertex(387, 230);
        vertex(377, 230);
        bezierVertex(374, 205, 394, 217, 387, 230);
        endShape();
        beginShape();
        vertex(364, 232);
        vertex(373, 231);
        bezierVertex(375, 207, 357, 216, 364, 232);
        endShape();
        fill(54, 54, 54);
        beginShape();
        vertex(371, 224);
        bezierVertex(371, 218, 368, 218, 368, 224);
        bezierVertex(368, 229, 371, 229, 371, 224);
        endShape();
        beginShape();
        vertex(381, 224);
        bezierVertex(381, 218, 378, 218, 378, 224);
        bezierVertex(378, 229, 381, 229, 381, 224);
        endShape();
        beginShape();
        vertex(375, 228);
        bezierVertex(380, 228, 380, 231, 375, 231);
        bezierVertex(370, 232, 370, 228, 375, 228);
        endShape();
        stroke(0,0,0)
        strokeWeight(2)
        line(383, 220,380, 221)
        line(367, 220,368, 221)
        popMatrix();
        tex_ctx.setTransform(1,0,0,1,0,0)
    
        tex_ctx.translate(128*5-5,128*6-5)
        tex_ctx.scale(2.1,2.1)
        canvg(tex_ctx.canvas,"<svg><g transform='scale(1.2,1.2) translate(-6,-9) rotate(3)'><rect x='24' y='30' width='25' height='25' rx='6' fill='rgb(94, 235, 214)' stroke='rgb(100,100,100)' stroke-width='1.5'></rect><path transform='translate(0,-1)' stroke='rgb(100,100,100)' stroke-width='1.5' fill='rgb(245, 202, 12)' d='M 27 32L 25 22L 33 27L 37 17L 41 27L 48 22L 47 32z'></path><circle cx='24' cy='20' r='2' fill='rgb(245, 229, 12)' stroke='rgb(100,100,100)' stroke-width='1.5'></circle><circle cx='48' cy='20' r='2' fill='rgb(245, 229, 12)' stroke='rgb(100,100,100)' stroke-width='1.5'></circle><circle cx='37' cy='15' r='2.5' fill='rgb(245, 229, 12)' stroke='rgb(100,100,100)' stroke-width='1.5'></circle></g>")
        noStroke()
        translate(-111,-52)
        rotate(3)
        scale(0.4,0.4)
        fill(127, 83, 71);
        beginShape();
        vertex(389, 232);
        vertex(362, 234);
        bezierVertex(359, 230, 359, 223, 360, 220);
        bezierVertex(342, 211, 368, 191, 371, 212);
        bezierVertex(372, 211, 383, 211, 381, 212);
        bezierVertex(384, 190, 410, 213, 389, 219);
        bezierVertex(390, 220, 392, 228, 389, 232);
        endShape();
        fill(100, 63, 15);
        beginShape();
        vertex(387, 230);
        vertex(377, 230);
        bezierVertex(374, 210, 394, 219, 387, 230);
        endShape();
        beginShape();
        vertex(364, 232);
        vertex(373, 231);
        bezierVertex(375, 212, 358, 217, 364, 232);
        endShape();
        fill(54, 54, 54);
        beginShape();
        vertex(370, 224);
        bezierVertex(370, 219, 367, 219, 367, 224);
        bezierVertex(367, 229, 370, 229, 370, 224);
        endShape();
        beginShape();
        vertex(382, 224);
        bezierVertex(382, 218, 379, 218, 379, 224);
        bezierVertex(379, 229, 382, 229, 382, 224);
        endShape();
        beginShape();
        vertex(375, 228);
        bezierVertex(380, 228, 380, 231, 375, 231);
        bezierVertex(370, 232, 370, 228, 375, 228);
        endShape();
        stroke(255,255,255,170)
        strokeWeight(7)
        noFill()
        beginShape();
        vertex(357, 191);
        bezierVertex(349, 188, 340, 200, 346, 204);
        endShape()
        stroke(0,0,0,38)
        beginShape();
        vertex(402, 233);
        bezierVertex(406, 247, 390, 245, 388, 244);
        endShape()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*6,128*6-8)
        stroke(100,100,100)
        strokeWeight(4)
        fill(255,255,255)
        ellipse(60,100,60,60)
        ellipse(63,59,42,42)
        stroke(230,0,0)
        noFill()
        strokeWeight(7)
        beginShape()
        vertex(77,76)
        bezierVertex(74,85,39,78,42,72)
        bezierVertex(11,74,49,83,24,84)
        endShape()
        fill(50,50,50)
        stroke(50,50,50)
        line(49,40,79,40)
        rect(56,20,17,17)
        stroke(0,158,223)
        rect(55,31,19,0)
        translate(63,58)
        rotate(5)
        scale(0.3)
        tex_ctx.lineWidth=3.5
        tex_ctx.fillStyle='rgb(59, 142, 209)'
        tex_ctx.strokeStyle='rgb(255,255,255)'
        ellipse(-22,-20,9*2,12*2)
        ellipse(22,-20,9*2,12*2)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-32,-20)
        tex_ctx.lineTo(0,-18)
        tex_ctx.lineTo(32,-20)
        tex_ctx.stroke()
        scale(0.9)
        tex_ctx.lineWidth=5
        tex_ctx.strokeStyle='rgb(59, 142, 209)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(0,-2)
        tex_ctx.lineTo(0,13)
        tex_ctx.lineTo(32,5)
        tex_ctx.fill()
        for(let i=0.18;i<Math.PI;i+=Math.PI/8)
            ellipse(Math.cos(i)*40,Math.sin(i)*30+15,6,6)
        rotate(-5)
        translate(0,175)
        scale(0.5)
        tex_ctx.fillStyle='rgb(17, 32, 43)'
        tex_ctx.fillRect(-64,-64,128,128)
        tex_ctx.fillStyle='rgb(59, 142, 209)'
        tex_ctx.strokeStyle='rgb(100,100,150)'
        strokeWeight(30)
        line(-104,-9,-83,-5)
        line(104,-9,81,-5)
        strokeWeight(40)
        tex_ctx.strokeStyle='rgb(59, 142, 209)'
        line(10,-73,11,-106)
        strokeWeight(5)
        tex_ctx.translate(0,10)
        tex_ctx.beginPath()
        tex_ctx.moveTo(64,0+5)
        tex_ctx.lineTo(48,10+2.5)
        tex_ctx.lineTo(60,20)
        tex_ctx.lineTo(48,30-2.5)
        tex_ctx.lineTo(64,40-5)
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.moveTo(-64,0+5)
        tex_ctx.lineTo(-48,10+2.5)
        tex_ctx.lineTo(-60,20)
        tex_ctx.lineTo(-48,30-2.5)
        tex_ctx.lineTo(-64,40-5)
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.moveTo(43,-45)
        tex_ctx.lineTo(14,-40)
        tex_ctx.moveTo(-39,-44)
        tex_ctx.lineTo(-11,-40)
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.ellipse(26,-30,10,13,0,0,7)
        tex_ctx.ellipse(-20,-30,10,13,0,0,7)
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(17, 32, 43)'
        tex_ctx.beginPath()
        tex_ctx.ellipse(19,-28,6,8,0,0,7)
        tex_ctx.ellipse(-26,-27,6,8,0,0,7)
        tex_ctx.fill()
        tex_ctx.translate(0,-10)
        tex_ctx.fillStyle='rgb(59, 142, 209)'
        tex_ctx.translate(-31,51)
        tex_ctx.scale(-1.4,1.4)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-13,-25)
        tex_ctx.bezierCurveTo(-16,-9,-41,-6,-39,-26)
        tex_ctx.stroke()
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.moveTo(-39,-26)
        tex_ctx.bezierCurveTo(-24,-23,-13,-20,-8,-29)
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        
        tex_ctx.translate(128*7,128*6+5)
        stroke(100,100,100)
        strokeWeight(5);
        fill(255,0,0)
        beginShape()
        vertex(56,94)
        vertex(58,54)
        bezierVertex(58,25,60,48,85,27)
        vertex(89,94)
        endShape()
        stroke(255,150,0)
        fill(255,255,100)
        beginShape()
        vertex(68,7)
        bezierVertex(48,47,95,32,68,7)
        endShape()
        pushMatrix()
        translate(65,51)
        scale(0.12,0.12)
        fill(17, 32, 43)
        tex_ctx.fillRect(0,0,128,128)
        tex_ctx.lineWidth=5
        tex_ctx.translate(128/2,128/2)
        tex_ctx.fillStyle='rgb(243,73,45)'
        tex_ctx.strokeStyle=' rgb(243,73,45)'
        tex_ctx.translate(0,10)
        tex_ctx.beginPath()
        tex_ctx.moveTo(64,0+5)
        tex_ctx.lineTo(48,10+2.5)
        tex_ctx.lineTo(60,20)
        tex_ctx.lineTo(48,30-2.5)
        tex_ctx.lineTo(64,40-5)
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.moveTo(-64,0+5)
        tex_ctx.lineTo(-48,10+2.5)
        tex_ctx.lineTo(-60,20)
        tex_ctx.lineTo(-48,30-2.5)
        tex_ctx.lineTo(-64,40-5)
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.moveTo(43,-45)
        tex_ctx.lineTo(14,-40)
        tex_ctx.moveTo(-39,-44)
        tex_ctx.lineTo(-11,-40)
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.ellipse(26,-30,10,13,0,0,7)
        tex_ctx.ellipse(-20,-30,10,13,0,0,7)
        tex_ctx.fill()
        tex_ctx.strokeStyle='rgb(17, 32, 43)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(39,-29)
        tex_ctx.lineTo(0,-22)
        tex_ctx.lineTo(-39,-29)
        tex_ctx.stroke()
        tex_ctx.translate(0,-10)
        tex_ctx.strokeStyle='rgb(243,73,45)'
        tex_ctx.translate(-31,51)
        tex_ctx.scale(-1.4,1.4)
        tex_ctx.beginPath()
        tex_ctx.moveTo(-12,-21)
        tex_ctx.bezierCurveTo(-12,-14,-31,-12,-36,-17)
        tex_ctx.stroke()
        popMatrix()
        translate(-644,-118)
        strokeWeight(1.7);
        scale(2,2)
        stroke(100,100,100)
        fill(20, 186, 20);
        beginShape();
        vertex(357, 107);
        vertex(377, 103);
        vertex(374, 108);
        vertex(380, 110);
        vertex(374, 112);
        vertex(377, 116);
        vertex(371, 114);
        vertex(360, 110);
        vertex(343, 116);
        vertex(346, 112);
        vertex(340, 110);
        vertex(346, 108);
        vertex(343, 103);
        vertex(349, 105);
        tex_ctx.closePath()
        endShape();
        stroke(255,255,100)
        fill(255, 0, 0);
        ellipse(359, 105, 8, 8);
        noStroke
        ellipse(362, 111, 8, 8);
        ellipse(355, 111, 8, 8);
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        
        tex_ctx.translate(128*0+64,128*7+64)
        fill(0,100,0)
        stroke(60)
        translate(-12,-7)
        scale(1.3,1.3)
        strokeWeight(5)
        beginShape()
        vertex(20,19)
        bezierVertex(3,20,5,2,20,-5)
        vertex(25,-5)
        vertex(25,2)
        bezierVertex(33,-2,40,6,38,9)
        bezierVertex(47,3,43,2,46,-1)
        bezierVertex(49,-8,53,-4,52,-2)
        bezierVertex(49,13,48,19,29,19)
        endShape()
        ellipse(22,-5,14,14)
        strokeWeight(3.5)
        beginShape()
        vertex(0,-29)
        vertex(30,40)
        bezierVertex(20,53,-20,53,-30,40)
        tex_ctx.closePath()
        endShape()
        stroke(143,71,-3)
        line(0,-5,15,-20)
        line(0,-5,-15,-20)
        line(0,-5,0,29)
        line(0,29,-10,48)
        line(0,29,10,48)
        line(0,9,20,2)
        line(0,9,-20,2)
        line(0,19,15,16)
        line(0,19,-15,16)
        noStroke()
        fill(0)
        ellipse(3,-2,3,5)
        ellipse(-3,-2,3,5)
        fill(150,150,120)
        beginShape()
        vertex(20,19)
        bezierVertex(3,20,5,2,20,-5)
        vertex(25,-5)
        vertex(25,2)
        bezierVertex(33,-2,40,6,38,9)
        bezierVertex(47,3,43,2,46,-1)
        bezierVertex(49,-8,53,-4,52,-2)
        bezierVertex(49,13,48,19,29,19)
        endShape()
        ellipse(22,-5,14,14)
        fill(0)
        ellipse(24,-8,2,4)
        stroke(0,0,0,80)
        strokeWeight(3)
        noFill()
        beginShape()
        vertex(24,2)
        bezierVertex(17,8,23,7,18,-1)
        endShape()
        stroke(255,200,0)
        strokeWeight(5)
        line(30,-4,26,-3)
        strokeWeight(3)
        line(20,23,20,18)
        line(16,20,20,18)
        line(24,21,20,18)
        pushMatrix()
        translate(14,5)
        rotate(-13)
        line(20,23,20,18)
        line(16,20,20,18)
        line(24,21,20,18)
        popMatrix()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*1+56,128*7+61)
        fill(200,200,200)
        scale(1.6,1.6)
        stroke(80)
        strokeWeight(2.5)
        beginShape()
        vertex(18,-9)
        bezierVertex(5,6,38,-20,29,36)
        bezierVertex(23,43,-11,41,-10,35)
        bezierVertex(-21,-21,21,6,-1,-13)
        bezierVertex(-21,-21,21,6,-6,-23)
        bezierVertex(12,-21,6,6,7,-30)
        bezierVertex(-7,-29,14,-2,17,-27)
        bezierVertex(-3,-29,27,14,20,-28)
        bezierVertex(17,-12,9,-11,23,-14)
        tex_ctx.closePath()
        endShape()
        translate(-41,-79)
        stroke(0,230,150)
        noFill()
        strokeWeight(4)
        beginShape()
        vertex(55,75)
        bezierVertex(58,79,35,76,43,75)
        bezierVertex(11,74,49,83,24,84)
        endShape()
        stroke(0,150,90)
        strokeWeight(2)
        beginShape()
        vertex(55,75)
        bezierVertex(58,79,35,76,43,75)
        bezierVertex(11,74,49,83,24,84)
        endShape()
        noStroke()
        fill(255,200,0)
        beginShape()
        vertex(69,89)
        bezierVertex(58,97,39,96,32,88)
        bezierVertex(30,89,31,111,33,115)
        bezierVertex(30,115,59,122,68,114)
        bezierVertex(68,117,72,112,69,89)
        endShape()
        fill(255,230,100)
        beginShape()
        vertex(69,89)
        bezierVertex(66,96,39,98,32,88)
        bezierVertex(39,83,66,84,69,89)
        endShape()
        stroke(255,255,255,100)
        strokeWeight(3)
        noFill()
        beginShape()
        vertex(57,88)
        bezierVertex(59,85,19,87,46,92)
        endShape()
        stroke(0,0,0,20)
        strokeWeight(5)
        beginShape()
        vertex(66,99)
        bezierVertex(67,104,70,114,58,114)
        endShape()
        tex_ctx.translate(51,105)
        scale(0.15,0.15)
        tex_ctx.fillStyle='rgb(17, 32, 43)'
        tex_ctx.strokeStyle='rgb(17, 32, 43)'
        tex_ctx.translate(0,7)
        tex_ctx.beginPath()
        tex_ctx.ellipse(-26-6,-29,9,9,0,0,7)
        tex_ctx.ellipse(26-5,-29,9,9,0,0,7)
        tex_ctx.fill()
        tex_ctx.beginPath()
        tex_ctx.moveTo(-39,-34)
        tex_ctx.bezierCurveTo(-28,-46,-19,-38,-14,-32)
        tex_ctx.moveTo(-42+55,-34)
        tex_ctx.bezierCurveTo(-28+55,-46,-19+55,-38,-14+55,-32)
        tex_ctx.translate(0,-16)
        tex_ctx.moveTo(-37,23)
        tex_ctx.bezierCurveTo(-10,38,24,31,42,21)
        tex_ctx.moveTo(-36,15)
        tex_ctx.bezierCurveTo(-36,21,-35,28,-44,29)
        tex_ctx.moveTo(44,12)
        tex_ctx.bezierCurveTo(40,21,46,30,48,28)
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        
        tex_ctx.translate(128*2+64,128*7+76)
        strokeWeight(4)
        scale(1,0.8)
        rotate(30)
        stroke(80)
        fill(255)
        beginShape()
        vertex(-40,-40)
        vertex(40,-40)
        vertex(40,-23)
        vertex(36,-16)
        vertex(40,-11)
        vertex(40,20)
        vertex(34,22)
        vertex(40,30)
        vertex(40,40)
        vertex(6,40)
        vertex(3,21)
        bezierVertex(20,0,-20,0,-3,21)
        vertex(-6,40)
        vertex(-40,40)
        vertex(-40,22)
        bezierVertex(-45,22,-45,11,-40,11)
        vertex(-40,-10)
        bezierVertex(-35,-10,-35,-21,-40,-21)
        vertex(-40,-40)
        endShape()
        textFont(createFont("comic sans ms"), 9);
        fill(0)
        tex_ctx.lineWidth=1
        tex_ctx.strokeText('20-Jul',-12,-6)
        tex_ctx.strokeText('1991',-22,32)
        rotate(-90)
        scale(1.2)
        tex_ctx.strokeText('$2.99',-2,26)
        rotate(-90)
        scale(0.9)
        tex_ctx.strokeText('#02060062',-2,30)
        tex_ctx.setTransform(1,0,0,1,0,0)
    
        tex_ctx.translate(128*3,128*7)
        tex_ctx.scale(1.75,1.75)
        canvg(tex_ctx.canvas,"<svg><g transform='translate(34,27) scale(1.2,1.2)'> <path fill='rgb(50,50,50)' stroke='rgb(0,0,0)' stroke-width='4' d='M2 -7L-14 5L -12 24L 10 30L 23 19L 18 -3z'></path> <path fill='rgb(50,50,50,0)' stroke='rgb(255,0,0)' stroke-width='2' transform='translate(26,48) scale(2,2)' d='M-10 -17 C-8 -11 -3 -16 -1 -7M-12 -16C -1 -33 -1 -11 -12 -16C -17 -33 -25 -11 -12 -16C -17 -6 -17 -14 -22 -5'></path> </g></svg>")
        tex_ctx.setTransform(1,0,0,1,0,0)
    }
    
    window.textures_bear=function(tex_ctx){
    
        function e(x,y,w,h,r=0){
            tex_ctx.beginPath()
            tex_ctx.ellipse(x,y,w,h,r,0,7)
            tex_ctx.fill()
        }
        
        function r(x,y,w,h){
            tex_ctx.fillRect(x,y,w,h)
            tex_ctx.strokeRect(x,y,w,h)
        }
        
        tex_ctx.clearRect(0,0,1024,1024)
        
        tex_ctx.lineCap='butt'
        tex_ctx.lineJoin='butt'
        
        tex_ctx.translate(128*0+128*0.5,256*0+128*0.5)
        tex_ctx.lineWidth=7
        tex_ctx.fillStyle='rgb(33, 35, 37)'
        tex_ctx.fillRect(-128*0.5,-128*0.5,128,128)
        tex_ctx.fillStyle='rgb(123, 105, 65)'
        e(-13,-23,6,6)
        e(13,-23,6,6)
        tex_ctx.fillStyle='rgb(45, 50, 53)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-64,64)
        tex_ctx.lineTo(-64,20)
        tex_ctx.bezierCurveTo(-66,-49,-18,-56,-10,-1)
        tex_ctx.lineTo(-10,64)
        tex_ctx.moveTo(64,64)
        tex_ctx.lineTo(64,20)
        tex_ctx.bezierCurveTo(66,-49,18,-56,10,-1)
        tex_ctx.lineTo(10,64)
        tex_ctx.fill()
        let g=tex_ctx.createLinearGradient(0,0,0,64)
        g.addColorStop(0,'rgb(33, 35, 37)')
        g.addColorStop(0.6,'rgb(123, 105, 65)')
        tex_ctx.fillStyle=g
        tex_ctx.beginPath()
        tex_ctx.moveTo(-12,-25)
        tex_ctx.bezierCurveTo(-11,49,-30,40,-12,64)
        tex_ctx.moveTo(12,-25)
        tex_ctx.bezierCurveTo(11,49,30,40,12,64)
        tex_ctx.fill()
        tex_ctx.fillRect(-12,-11,24,75)
        tex_ctx.fillStyle='rgb(45, 50, 53)'
        e(0,49,10,8)
        tex_ctx.fillStyle='rgb(33, 35, 37)'
        e(0,52,5,3)
        tex_ctx.fillStyle='rgb(20,20,20)'
        e(-19,-13,5,9)
        e(19,-13,5,9)
        tex_ctx.fillStyle='rgb(45, 50, 53)'
        e(16,-16,2,3)
        e(-22,-16,2,3)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*1+128*0.5,256*0+128*0.5)
        tex_ctx.lineWidth=7
        tex_ctx.fillStyle='rgb(240,240,240)'
        tex_ctx.fillRect(-128*0.5,-128*0.5,128,128)
        tex_ctx.fillStyle='rgb(200,200,200)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-64,64)
        tex_ctx.lineTo(-64,20)
        tex_ctx.bezierCurveTo(-66,-49,-18,-56,-10,-1)
        tex_ctx.lineTo(-10,64)
        tex_ctx.moveTo(64,64)
        tex_ctx.lineTo(64,20)
        tex_ctx.bezierCurveTo(66,-49,18,-56,10,-1)
        tex_ctx.lineTo(10,64)
        tex_ctx.fill()
        g=tex_ctx.createLinearGradient(0,0,0,64)
        g.addColorStop(0,'rgb(240,240,240)')
        g.addColorStop(0.6,'rgb(170,170,170)')
        tex_ctx.fillStyle=g
        tex_ctx.beginPath()
        tex_ctx.moveTo(-12,-25)
        tex_ctx.bezierCurveTo(-11,49,-30,40,-12,64)
        tex_ctx.moveTo(12,-25)
        tex_ctx.bezierCurveTo(11,49,30,40,12,64)
        tex_ctx.fill()
        tex_ctx.fillRect(-12,-11,24,75)
        tex_ctx.fillStyle='rgb(45, 50, 53)'
        e(0,49,10,8)
        tex_ctx.fillStyle='rgb(33, 35, 37)'
        e(0,52,5,3)
        tex_ctx.fillStyle='rgb(20,20,20)'
        e(-19,-13,5,9)
        e(19,-13,5,9)
        tex_ctx.fillStyle='rgb(200,200,200)'
        e(16,-16,2,3)
        e(-22,-16,2,3)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*2+128*0.5,256*0+128*0.5)
        tex_ctx.lineWidth=7
        tex_ctx.fillStyle='rgb(115, 84, 48)'
        tex_ctx.fillRect(-128*0.5,-128*0.5,128,128)
        tex_ctx.fillStyle='rgb(97, 69, 39)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-64,64)
        tex_ctx.lineTo(-64,20)
        tex_ctx.bezierCurveTo(-66,-49,-18,-56,-10,-1)
        tex_ctx.lineTo(-10,64)
        tex_ctx.moveTo(64,64)
        tex_ctx.lineTo(64,20)
        tex_ctx.bezierCurveTo(66,-49,18,-56,10,-1)
        tex_ctx.lineTo(10,64)
        tex_ctx.fill()
        g=tex_ctx.createLinearGradient(0,0,0,64)
        g.addColorStop(0.1,'rgb(115, 84, 48)')
        g.addColorStop(1,'rgb(156, 118, 75)')
        tex_ctx.fillStyle=g
        tex_ctx.beginPath()
        tex_ctx.fill()
        tex_ctx.fillRect(-12,-11,24,75)
        tex_ctx.fillStyle='rgb(45, 50, 53)'
        e(0,49,10,8)
        tex_ctx.fillStyle='rgb(33, 35, 37)'
        e(0,52,5,3)
        tex_ctx.fillStyle='rgb(20,20,20)'
        e(-19,-13,5,9)
        e(19,-13,5,9)
        tex_ctx.fillStyle='rgb(99, 73, 41)'
        e(16,-16,2,3)
        e(-22,-16,2,3)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*3+128*0.5,256*0+128*0.5)
        tex_ctx.scale(0.9,0.9)
        tex_ctx.lineWidth=7
        tex_ctx.fillStyle='rgb(52, 135, 63)'
        tex_ctx.fillRect(-128*0.5,-128*0.5,128,128)
        tex_ctx.fillStyle='rgb(45, 99, 52)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-64,64)
        tex_ctx.lineTo(-64,20)
        tex_ctx.bezierCurveTo(-66,-49,-18,-56,-10,-1)
        tex_ctx.lineTo(-10,64)
        tex_ctx.moveTo(64,64)
        tex_ctx.lineTo(64,20)
        tex_ctx.bezierCurveTo(66,-49,18,-56,10,-1)
        tex_ctx.lineTo(10,64)
        tex_ctx.fill()
        g=tex_ctx.createLinearGradient(0,0,0,64)
        g.addColorStop(0,'rgb(52, 135, 63)')
        g.addColorStop(0.6,'rgb(70, 181, 83)')
        tex_ctx.fillStyle=g
        tex_ctx.beginPath()
        tex_ctx.moveTo(-11,-25)
        tex_ctx.bezierCurveTo(-11,49,-30,40,-11,64)
        tex_ctx.moveTo(11,-25)
        tex_ctx.bezierCurveTo(11,49,30,40,11,64)
        tex_ctx.fill()
        tex_ctx.fillRect(-12,-11,24,75)
        tex_ctx.fillStyle='rgb(56, 117, 55)'
        e(0,49,10,8)
        tex_ctx.fillStyle='rgb(24, 71, 23)'
        e(0,52,5,3)
        tex_ctx.fillStyle='rgb(120, 247, 108)'
        e(-19,-13,5,9)
        e(19,-13,5,9)
        tex_ctx.fillStyle='rgb(45, 99, 52)'
        e(16,-16,2,3)
        e(-22,-16,2,3)
        tex_ctx.scale(1/0.9,1/0.9)
        tex_ctx.fillStyle='rgb(100,100,100)'
        tex_ctx.fillRect(-64,-64,11,128)
        tex_ctx.fillRect(64-11,-64,11,128)
        tex_ctx.fillRect(-64,-64,128,11)
        tex_ctx.fillRect(-64,64-11,128,11)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*4+128*0.5,256*0+128*0.5)
        tex_ctx.lineWidth=7
        tex_ctx.fillStyle='rgb(230,230,230)'
        tex_ctx.fillRect(-128*0.5,-128*0.5,128,128)
        g=tex_ctx.createRadialGradient(-22,-14,27,-22,-14,28)
        g.addColorStop(0,'rgb(50,50,50)')
        g.addColorStop(1,'rgb(200,200,200)')
        tex_ctx.fillStyle=g
        tex_ctx.beginPath()
        tex_ctx.moveTo(-64,64)
        tex_ctx.lineTo(-64,-13)
        tex_ctx.bezierCurveTo(-36,18,-29,-72,-10,-20)
        tex_ctx.lineTo(-10,64)
        tex_ctx.fill()
        g=tex_ctx.createRadialGradient(22,-14,27,22,-14,28)
        g.addColorStop(0,'rgb(50,50,50)')
        g.addColorStop(1,'rgb(200,200,200)')
        tex_ctx.fillStyle=g
        tex_ctx.beginPath()
        tex_ctx.moveTo(64,64)
        tex_ctx.lineTo(64,-13)
        tex_ctx.bezierCurveTo(36,18,29,-72,10,-20)
        tex_ctx.lineTo(10,64)
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(230,230,230)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-9,-12)
        tex_ctx.bezierCurveTo(-11,5,-30,56,-9,64)
        tex_ctx.moveTo(9,-12)
        tex_ctx.bezierCurveTo(11,5,30,56,9,64)
        tex_ctx.fill()
        tex_ctx.fillRect(-10,-11,20,75)
        tex_ctx.fillStyle='rgb(45, 50, 53)'
        e(0,49,10,8)
        tex_ctx.fillStyle='rgb(33, 35, 37)'
        e(0,52,5,3)
        tex_ctx.fillStyle='rgb(0,0,0)'
        e(-16,-13,5,9)
        e(16,-13,5,9)
        tex_ctx.fillStyle='rgb(70,70,70)'
        e(13,-16,2,3)
        e(-19,-16,2,3)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*5+128*0.5,256*0+128*0.5)
        tex_ctx.lineWidth=7
        tex_ctx.fillStyle='rgb(199, 198, 177)'
        tex_ctx.fillRect(-128*0.5,-128*0.5,128,128)
        tex_ctx.fillStyle='rgb(173, 166, 173)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-64,64)
        tex_ctx.lineTo(-64,-13)
        tex_ctx.bezierCurveTo(-66,-24,-12,-64,-10,-1)
        tex_ctx.lineTo(-10,64)
        tex_ctx.moveTo(64,64)
        tex_ctx.lineTo(64,-13)
        tex_ctx.bezierCurveTo(66,-24,12,-64,10,-1)
        tex_ctx.lineTo(10,64)
        tex_ctx.fill()
        g=tex_ctx.createLinearGradient(0,0,0,64)
        g.addColorStop(0,'rgb(199, 198, 177)')
        g.addColorStop(0.6,'rgb(224, 221, 184)')
        tex_ctx.fillStyle=g
        tex_ctx.beginPath()
        tex_ctx.moveTo(-11,-25)
        tex_ctx.bezierCurveTo(-11,49,-30,40,-11,64)
        tex_ctx.moveTo(11,-25)
        tex_ctx.bezierCurveTo(11,49,30,40,11,64)
        tex_ctx.fill()
        tex_ctx.fillRect(-11,-11,22,75)
        tex_ctx.fillStyle='rgb(45, 50, 53)'
        e(0,49,10,8)
        tex_ctx.fillStyle='rgb(33, 35, 37)'
        e(0,52,5,3)
        tex_ctx.fillStyle='rgb(0,0,0,0.1)'
        e(-22,-11,9,7)
        e(22,-11,9,7)
        tex_ctx.strokeStyle='rgb(40,40,40)'
        tex_ctx.lineWidth=3
        tex_ctx.beginPath()
        tex_ctx.moveTo(-29,-11)
        tex_ctx.bezierCurveTo(-23,-14,-21,-15,-16,-13)
        tex_ctx.moveTo(29,-11)
        tex_ctx.bezierCurveTo(23,-14,21,-15,16,-13)
        tex_ctx.stroke()
        tex_ctx.beginPath()
        tex_ctx.moveTo(-64,64)
        tex_ctx.lineTo(-64+15,64-10)
        tex_ctx.lineTo(-64,64-20)
        tex_ctx.lineTo(-64+21,64-30)
        tex_ctx.lineTo(-64,64-40)
        tex_ctx.lineTo(-64+13,64-50)
        tex_ctx.lineTo(-64,64-60)
        tex_ctx.lineTo(-64+9,64-70)
        tex_ctx.lineTo(-64,64-80)
        tex_ctx.scale(-1,1)
        tex_ctx.moveTo(-64,64)
        tex_ctx.lineTo(-64+15,64-10)
        tex_ctx.lineTo(-64,64-20)
        tex_ctx.lineTo(-64+21,64-30)
        tex_ctx.lineTo(-64,64-40)
        tex_ctx.lineTo(-64+13,64-50)
        tex_ctx.lineTo(-64,64-60)
        tex_ctx.lineTo(-64+9,64-70)
        tex_ctx.lineTo(-64,64-80)
        tex_ctx.fill()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*6+128*0.5,256*0+128*0.5)
        tex_ctx.lineWidth=7
        tex_ctx.fillStyle='rgb(176, 147, 118)'
        tex_ctx.fillRect(-128*0.5,-128*0.5,128,128)
        tex_ctx.fillStyle='rgb(153, 125, 97)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-64,64)
        tex_ctx.lineTo(-64,-14)
        tex_ctx.bezierCurveTo(-50,2,-7,-69,-10,-1)
        tex_ctx.lineTo(-10,64)
        tex_ctx.moveTo(64,64)
        tex_ctx.lineTo(64,-14)
        tex_ctx.bezierCurveTo(50,2,7,-69,10,-1)
        tex_ctx.lineTo(10,64)
        tex_ctx.fill()
        g=tex_ctx.createLinearGradient(0,0,0,64)
        g.addColorStop(0,'rgb(176, 147, 118)')
        g.addColorStop(0.6,'rgb(189, 162, 134)')
        tex_ctx.fillStyle=g
        tex_ctx.beginPath()
        tex_ctx.moveTo(-10,-25)
        tex_ctx.bezierCurveTo(-11,49,-30,40,-10,64)
        tex_ctx.moveTo(10,-25)
        tex_ctx.bezierCurveTo(11,49,30,40,10,64)
        tex_ctx.fill()
        tex_ctx.fillRect(-10,-11,20,75)
        tex_ctx.fillStyle='rgb(45, 50, 53)'
        e(0,49,10,8)
        tex_ctx.fillStyle='rgb(33, 35, 37)'
        e(0,52,5,3)
        tex_ctx.fillStyle='rgb(20,20,20)'
        e(-19,-13,6,7)
        e(19,-13,6,7)
        e(19,-19,5,3)
        e(-19,-19,5,3)
        tex_ctx.fillStyle='rgb(153, 125, 97)'
        e(15,-16,2,3)
        e(-23,-16,2,3)
        tex_ctx.fillStyle='rgb(205,50,50,0.07)'
        e(-41,19,10,10)
        e(41,19,10,10)
        tex_ctx.fillStyle='rgb(69, 62, 51)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-9,-64)
        tex_ctx.bezierCurveTo(-5,-56,-13,-53,-19,-55)
        tex_ctx.bezierCurveTo(-6,-36,6,-45,10,-49)
        tex_ctx.bezierCurveTo(15,-52,16,-61,13,-64)
        tex_ctx.fill()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*7+128*0.5,256*0+128*0.5)
        tex_ctx.fillStyle='rgb(56, 75, 125)'
        tex_ctx.fillRect(-128*0.5,-128*0.5,128,128)
        tex_ctx.fillStyle='rgb(196, 114, 96)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-15,-64)
        tex_ctx.lineTo(-29,64)
        tex_ctx.lineTo(29,64)
        tex_ctx.lineTo(15,-64)
        tex_ctx.fill()
        tex_ctx.lineWidth=4
        tex_ctx.strokeStyle='rgb(0,0,0,0.2)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-15,-64)
        tex_ctx.lineTo(-29,64)
        tex_ctx.moveTo(15,-64)
        tex_ctx.lineTo(29,64)
        tex_ctx.stroke()
        tex_ctx.fillStyle='white'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-15,-64)
        tex_ctx.lineTo(-11,-50)
        tex_ctx.lineTo(-64,-64)
        tex_ctx.moveTo(15,-64)
        tex_ctx.lineTo(10,-50)
        tex_ctx.lineTo(64,-64)
        tex_ctx.fill()
        tex_ctx.stroke()
        tex_ctx.lineWidth=1.2
        tex_ctx.strokeStyle='white'
        tex_ctx.fillStyle='rgb(227, 227, 107)'
        e(-31,-27,6,6)
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(145, 194, 103)'
        e(-35,3,6,6)
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(252, 81, 81)'
        e(-38,33,6,6)
        tex_ctx.stroke()
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*0+128*0.5,256*0+128*1.5)
        tex_ctx.lineWidth=7
        tex_ctx.fillStyle='rgb(194, 149, 43)'
        tex_ctx.fillRect(-128*0.5,-128*0.5,128,128)
        tex_ctx.fillStyle='rgb(176, 126, 39)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-64,64)
        tex_ctx.lineTo(-64,20)
        tex_ctx.bezierCurveTo(-66,-49,-18,-56,-10,-1)
        tex_ctx.lineTo(-10,64)
        tex_ctx.moveTo(64,64)
        tex_ctx.lineTo(64,20)
        tex_ctx.bezierCurveTo(66,-49,18,-56,10,-1)
        tex_ctx.lineTo(10,64)
        tex_ctx.fill()
        g=tex_ctx.createLinearGradient(0,0,0,64)
        g.addColorStop(0,'rgb(194, 149, 43)')
        g.addColorStop(0.6,'rgb(214, 173, 79)')
        tex_ctx.fillStyle=g
        tex_ctx.beginPath()
        tex_ctx.moveTo(-12,-25)
        tex_ctx.bezierCurveTo(-11,49,-30,40,-12,64)
        tex_ctx.moveTo(12,-25)
        tex_ctx.bezierCurveTo(11,49,30,40,12,64)
        tex_ctx.fill()
        tex_ctx.fillRect(-12,-11,24,75)
        tex_ctx.fillStyle='rgb(190,190,190,0.6)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-50,-25)
        tex_ctx.bezierCurveTo(-50,-30,50,-30,50,-25)
        tex_ctx.lineTo(50,-20)
        tex_ctx.bezierCurveTo(50,10,5,10,5,-12)
        tex_ctx.lineTo(-5,-12)
        tex_ctx.bezierCurveTo(-5,10,-50,10,-50,-20)
        tex_ctx.lineTo(-50,-25)
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(45, 50, 53)'
        e(0,49,10,8)
        tex_ctx.fillStyle='rgb(33, 35, 37)'
        e(0,52,5,3)
        tex_ctx.fillStyle='rgb(20,20,20)'
        e(-19,-13,5,9)
        e(19,-13,5,9)
        tex_ctx.fillStyle='rgb(186, 161, 115)'
        e(16,-16,2,3)
        e(-22,-16,2,3)
        tex_ctx.fillStyle='rgb(255,255,255,0.5)'
        e(-45,-21,2,4)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*1+128*0.5,256*0.5+128*0.5)
        tex_ctx.lineWidth=7
        tex_ctx.fillStyle='rgb(235, 210, 96)'
        tex_ctx.fillRect(-128*0.5,-128*0.5,128,128)
        tex_ctx.fillStyle='rgb(209, 189, 102)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-64,64)
        tex_ctx.lineTo(-64,-10)
        tex_ctx.bezierCurveTo(-50,-31,-10,-55,-10,-8)
        tex_ctx.lineTo(-10,64)
        tex_ctx.moveTo(64,64)
        tex_ctx.lineTo(64,-10)
        tex_ctx.bezierCurveTo(50,-31,10,-55,10,-8)
        tex_ctx.lineTo(10,64)
        tex_ctx.fill()
        g=tex_ctx.createLinearGradient(0,0,0,64)
        g.addColorStop(0,'rgb(235, 210, 96)')
        g.addColorStop(0.6,'rgb(250, 233, 163)')
        tex_ctx.fillStyle=g
        tex_ctx.beginPath()
        tex_ctx.moveTo(-10,-25)
        tex_ctx.bezierCurveTo(-11,49,-30,40,-10,64)
        tex_ctx.moveTo(10,-25)
        tex_ctx.bezierCurveTo(11,49,30,40,10,64)
        tex_ctx.fill()
        tex_ctx.fillRect(-10,-11,20,75)
        tex_ctx.fillStyle='rgb(87, 59, 30)'
        e(0,49,10,8)
        tex_ctx.fillStyle='rgb(51, 34, 18)'
        e(0,52,5,3)
        tex_ctx.fillStyle='rgb(20,20,20)'
        e(-19,-13,6,7)
        e(19,-13,6,7)
        e(21,-19,5,2)
        e(-22,-19,5,2)
        tex_ctx.fillStyle='rgb(209, 189, 102)'
        e(15,-14,2,3)
        e(-23,-14,2,3)
        tex_ctx.fillStyle='rgb(255, 166, 166,0.4)'
        e(-41,19,10,10)
        e(41,19,10,10)
        tex_ctx.setTransform(1,0,0,1,0,0)
    
        tex_ctx.translate(128*2+128*0.5,256*0.5+128*0.5)
        tex_ctx.lineWidth=7
        tex_ctx.fillStyle='rgb(255,255,255)'
        tex_ctx.fillRect(-128*0.5,-128*0.5,128,128)
        tex_ctx.strokeStyle='rgb(0,0,0)'
        tex_ctx.lineWidth=3
        tex_ctx.beginPath()
        tex_ctx.moveTo(-16,10)
        tex_ctx.bezierCurveTo(-20,39,20,39,16,10)
        tex_ctx.closePath()
        tex_ctx.stroke()
        tex_ctx.fillStyle='rgb(0,0,0)'
        e(-22,-20,3,6)
        e(22,-20,3,6)
        tex_ctx.setTransform(1,0,0,1,0,0)
    
        tex_ctx.translate(128*3+128*0.5,256*0.5+128*0.5)
        tex_ctx.lineWidth=7
        tex_ctx.fillStyle='rgb(242, 102, 242)'
        tex_ctx.fillRect(-128*0.5,-128*0.5,128,128)
        e(13,-23,6,6)
        tex_ctx.fillStyle='rgb(119, 252, 183)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-64,64)
        tex_ctx.lineTo(-64,20)
        tex_ctx.bezierCurveTo(-66,-49,-18,-56,-10,-1)
        tex_ctx.lineTo(-10,64)
        tex_ctx.moveTo(64,64)
        tex_ctx.lineTo(64,20)
        tex_ctx.bezierCurveTo(66,-49,18,-56,10,-1)
        tex_ctx.lineTo(10,64)
        tex_ctx.fill()
        tex_ctx.fillStyle='rgb(242, 102, 242)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-12,-25)
        tex_ctx.bezierCurveTo(-11,49,-30,40,-12,64)
        tex_ctx.moveTo(12,-25)
        tex_ctx.bezierCurveTo(11,49,30,40,12,64)
        tex_ctx.fill()
        tex_ctx.fillRect(-12,-11,24,75)
        tex_ctx.fillStyle='rgb(50,255,150)'
        e(0,49,10,8)
        tex_ctx.fillStyle='rgb(49, 224, 134)'
        e(0,52,5,3)
        tex_ctx.fillStyle='rgb(255, 255, 255)'
        e(-19,-13,5,9)
        e(19,-13,5,9)
        tex_ctx.fillStyle='rgb(50,255,150)'
        e(16,-16,2,3)
        e(-22,-16,2,3)
        tex_ctx.setTransform(1,0,0,1,0,0)
    
        tex_ctx.translate(128*4+128*0.5,128*1+128*0.5)
        tex_ctx.lineWidth=7
        tex_ctx.fillStyle='rgb(240,240,240)'
        tex_ctx.fillRect(-128*0.5,-128*0.5,128,128)
        tex_ctx.fillStyle='rgb(200,200,200)'
        tex_ctx.beginPath()
        tex_ctx.moveTo(-64,64)
        tex_ctx.lineTo(-64,20)
        tex_ctx.bezierCurveTo(-66,-49,-18,-56,-10,-1)
        tex_ctx.lineTo(-10,64)
        tex_ctx.moveTo(64,64)
        tex_ctx.lineTo(64,20)
        tex_ctx.bezierCurveTo(66,-49,18,-56,10,-1)
        tex_ctx.lineTo(10,64)
        tex_ctx.fill()
        g=tex_ctx.createLinearGradient(0,0,0,64)
        g.addColorStop(0,'rgb(240,240,240)')
        g.addColorStop(0.6,'rgb(196, 176, 178)')
        tex_ctx.fillStyle=g
        tex_ctx.beginPath()
        tex_ctx.moveTo(-12,-25)
        tex_ctx.bezierCurveTo(-11,49,-30,40,-12,64)
        tex_ctx.moveTo(12,-25)
        tex_ctx.bezierCurveTo(11,49,30,40,12,64)
        tex_ctx.fill()
        tex_ctx.fillRect(-12,-11,24,75)
        tex_ctx.fillStyle='rgb(45, 50, 53)'
        e(0,49,10,8)
        tex_ctx.fillStyle='rgb(33, 35, 37)'
        e(0,52,5,3)
        tex_ctx.fillStyle='rgb(20,20,20)'
        e(-19,-13,5,9)
        e(19,-13,5,9)
        tex_ctx.fillStyle='rgb(200,200,200)'
        e(16,-16,2,3)
        e(-22,-16,2,3)
        tex_ctx.fillStyle='rgb(255,100,100,0.1)'
        e(-40,17,19,10)
        e(40,17,19,10)
        tex_ctx.setTransform(1,0,0,1,0,0)
        
        tex_ctx.translate(128*5+128*0.5,128*1+128*0.5)
        tex_ctx.fillStyle='rgb(50,50,50)'
        tex_ctx.fillRect(-128*0.5,-128*0.5,128,128)
        tex_ctx.fillStyle='rgb(212, 194, 81)'
        tex_ctx.fillRect(-128*0.5,-128*0.5+128/3,128,128/3)
        tex_ctx.setTransform(1,0,0,1,0,0)
    }
})()