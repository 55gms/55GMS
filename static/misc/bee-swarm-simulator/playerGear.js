(function(){
    window.applyPercentage=function(x,m){
    
    return (x-1)*(1-m)+1
}

window.playerGear={

    sprinkler:{

        none:{count:0},

        basicSprinkler:{

            count:1,
            diameter:10,
            power:0.2,
            rate:4,
            mesh:function(x,y,z,box,cylinder){

                cylinder(x,y,z,0.125,1.25,10,0.3,0.3,0.3,1,90,0,0)
                cylinder(x,y+1.25*0.5,z,0.16,0.15,10,0.3,0.3,0.3,1,90,0,0)
            },
            shopMesh:function(x,y,z,box,cylinder){

                cylinder(x,y,z,0.125,1.25,10,0.3,0.3,0.3,90,0,0)
                cylinder(x,y+1.25*0.5,z,0.16,0.15,10,0.3,0.3,0.3,90,0,0)
            },
            desc:'When planted in the ground, causes nearby flowers to regrow faster!<br><br>Count: 1<br>Diameter: 10<br>Power: 20<br>Rate: 4s<br><br>Press "R" to place a sprinkler.',
            cost:['1111111 honey'],
        },

        silverSoakers:{

            count:2,
            diameter:10,
            power:0.2,
            rate:3.5,
            mesh:function(x,y,z,box,cylinder){

                cylinder(x,y,z,0.125,1.25,10,0.7,0.7,0.7,1,90,0,0)
                cylinder(x,y+1.25*0.5,z,0.16,0.15,10,0.7,0.7,0.7,1,90,0,0)
            },
            shopMesh:function(x,y,z,box,cylinder){

                cylinder(x,y,z,0.125,1.25,10,0.7,0.7,0.7,90,0,0)
                cylinder(x,y+1.25*0.5,z,0.16,0.15,10,0.7,0.7,0.7,90,0,0)
            },
            desc:'Two sprinklers which fire faster!<br><br>Count: 2<br>Diameter: 10<br>Power: 20<br>Rate: 3.5s<br><br>Press "R" to place a sprinkler.',
            cost:['22222222 honey'],
        },

        goldenGushers:{

            count:3,
            diameter:11,
            power:0.25,
            rate:3.5,
            mesh:function(x,y,z,box,cylinder){

                cylinder(x,y,z,0.125,1.25,10,0.9,0.9,0.2,1,90,0,0)
                cylinder(x,y+1.25*0.5,z,0.16,0.15,10,0.9,0.9,0.2,1,90,0,0)
            },
            shopMesh:function(x,y,z,box,cylinder){

                cylinder(x,y,z,0.125,1.25,10,0.9,0.9,0.2,90,0,0)
                cylinder(x,y+1.25*0.5,z,0.16,0.15,10,0.9,0.9,0.2,90,0,0)
            },
            desc:'Three gorgeous sprinklers with enormous range.<br><br>Count: 3<br>Diameter: 11<br>Power: 25<br>Rate: 3.5s<br><br>Press "R" to place a sprinkler.',
            cost:['333333333 honey'],
        },

        diamondDiluters:{

            count:4,
            diameter:11,
            power:0.25,
            rate:3,
            mesh:function(x,y,z,box,cylinder){

                cylinder(x,y,z,0.125,1.25,10,0,0.9,0.9,1,90,0,0)
                cylinder(x,y+1.25*0.5,z,0.16,0.15,10,0,0.9,0.9,1,90,0,0)
            },
            shopMesh:function(x,y,z,box,cylinder){

                cylinder(x,y,z,0.125,1.25,10,0,0.9,0.9,90,0,0)
                cylinder(x,y+1.25*0.5,z,0.16,0.15,10,0,0.9,0.9,90,0,0)
            },
            desc:'Four enhanced sprinklers made of durable artificial diamond!<br><br>Count: 4<br>Diameter: 11<br>Power: 25<br>Rate: 3s<br><br>Press "R" to place a sprinkler.',
            cost:['4444444444 honey'],
        },
        
        superSaturator:{

            count:1,
            diameter:15,
            power:0.5,
            rate:1,
            mesh:function(x,y,z,box,cylinder){

                cylinder(x,y+0.25,z,0.15,2.5,10,0.9,0.9,0.5,1,90,0,0)
                cylinder(x,y+1.5,z,0.2,0.15,10,1,1,0.5,1,90,0,0)
                box(x,y+0.7,z,0.9,0.9,0.35,false,[0.2,10,10],false,false)
                cylinder(x+0.4,y+1.1,z,0.25,0.35,10,0.2,10,10,1,0,0,0,0.25,false)
                cylinder(x-0.4,y+1.1,z,0.25,0.35,10,0.2,10,10,1,0,0,0,0.25,false)
                cylinder(x,y+0.7,z,0.3,0.375,10,0.5,0.5,0.5,1,0,0,0,0.25,false)
                cylinder(x,y+0.7,z,0.1,0.5,10,0.2,10,10,1,0,0,0,0.1,false)
            },
            shopMesh:function(x,y,z,box,cylinder){

                cylinder(x,y+0.25,z,0.15,2.5,10,0.9,0.9,0.5,90,0,0)
                cylinder(x,y+1.5,z,0.2,0.15,10,1,1,0.5,90,0,0)
                box(x,y+0.7,z,0.9,0.9,0.35,false,[0.2,10,10])
                cylinder(x+0.4,y+1.1,z,0.25,0.35,10,0.2,10,10,0,0,0,0.25,false)
                cylinder(x-0.4,y+1.1,z,0.25,0.35,10,0.2,10,10,0,0,0,0.25,false)
                cylinder(x,y+0.7,z,0.3,0.375,10,0.5,0.5,0.5,0,0,0,0.25,false)
                cylinder(x,y+0.7,z,0.1,0.5,10,0.2,10,10,0,0,0,0.1,false)
            },
            desc:'The ultimate sprinkler. Nobody knows how it works or where it came from.<br><br>Count: 1<br>Diameter: 15<br>Power: 50<br>Rate: 1s<br><br>Press "R" to place a sprinkler.',
            cost:['55555555555 honey'],
        }
    },
    
    bronzeStarAmulet:{
        
        mesh:function(box,cylinder,sphere,star){
            
            star(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.075,0.15,0.025,0.05,0.5*6.5,0.25*6.5,0.07*6.5)
        }
    },

    silverStarAmulet:{
        
        mesh:function(box,cylinder,sphere,star){
            
            star(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.075,0.15,0.025,0.05,5.5,5.5,5.5)
        }
    },

    goldStarAmulet:{
        
        mesh:function(box,cylinder,sphere,star){
            
            star(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.075,0.15,0.025,0.05,9,8,0)
        }
    },

    diamondStarAmulet:{
        
        mesh:function(box,cylinder,sphere,star){
            
            star(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.075,0.15,0.025,0.05,0,10,10)
        }
    },

    supremeStarAmulet:{
        
        mesh:function(box,cylinder,sphere,star){
            
            star(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.075,0.15,0.025,0.05,0,10,0)
        }
    },

    bronzeCogAmulet:{
        
        mesh:function(box,cylinder,sphere,star){
            
            cylinder(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.14,0.075,10,0.7,0.35,0.12)
            box(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.09,0.37,0.075,false,[0.7,0.35,0.12])
            box(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.09,0.37,0.075,[0,0,60],[0.7,0.35,0.12])
            box(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.09,0.37,0.075,[0,0,120],[0.7,0.35,0.12])
        }
    },

    silverCogAmulet:{
        
        mesh:function(box,cylinder,sphere,star){
            
            cylinder(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.14,0.075,10,0.9,0.9,0.9)
            box(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.09,0.37,0.075,false,[0.9,0.9,0.9])
            box(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.09,0.37,0.075,[0,0,60],[0.9,0.9,0.9])
            box(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.09,0.37,0.075,[0,0,120],[0.9,0.9,0.9])
        }
    },

    goldCogAmulet:{
        
        mesh:function(box,cylinder,sphere,star){
            
            cylinder(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.14,0.075,10,1.7,1.6,0)
            box(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.09,0.37,0.075,false,[1.7,1.6,0])
            box(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.09,0.37,0.075,[0,0,60],[1.7,1.6,0])
            box(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.09,0.37,0.075,[0,0,120],[1.7,1.6,0])
        }
    },

    diamondCogAmulet:{
        
        mesh:function(box,cylinder,sphere,star){
            
            cylinder(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.14,0.075,10,0,1.6,1.7)
            box(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.09,0.37,0.075,false,[0,1.6,1.7])
            box(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.09,0.37,0.075,[0,0,60],[0,1.6,1.7])
            box(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.09,0.37,0.075,[0,0,120],[0,1.6,1.7])
        }
    },

    supremeCogAmulet:{
        
        mesh:function(box,cylinder,sphere,star){

            cylinder(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.14,0.075,10,0,1.5,0.3)
            box(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.09,0.37,0.075,false,[0,1.5,0.3])
            box(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.09,0.37,0.075,[0,0,60],[0,1.5,0.3])
            box(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.09,0.37,0.075,[0,0,120],[0,1.5,0.3])
        }
    },

    bronzeAntAmulet:{
        
        mesh:function(box,cylinder,sphere,star){

            box(window.amuletOffset[0],1.525+window.amuletOffset[1],0.075,0.13,0.13,0.13,false,[0.7,0.35,0.12])
            box(window.amuletOffset[0],1.475+window.amuletOffset[1],-0.06,0.12,0.12,0.2,false,[0.7,0.35,0.12])
            box(0.05+window.amuletOffset[0],1.585+window.amuletOffset[1],0.12,0.15,0.035,0.035,[0,-30,45],[0.7,0.35,0.12])
            box(-0.05+window.amuletOffset[0],1.585+window.amuletOffset[1],0.12,0.15,0.035,0.035,[0,30,-45],[0.7,0.35,0.12])
            box(-0.05+window.amuletOffset[0],1.43+window.amuletOffset[1],-0.01,0.15,0.035,0.035,[0,0,55],[0.7,0.35,0.12])
            box(-0.05+window.amuletOffset[0],1.43+window.amuletOffset[1],-0.11,0.15,0.035,0.035,[0,0,55],[0.7,0.35,0.12])
            box(0.05+window.amuletOffset[0],1.43+window.amuletOffset[1],-0.01,0.15,0.035,0.035,[0,0,-55],[0.7,0.35,0.12])
            box(0.05+window.amuletOffset[0],1.43+window.amuletOffset[1],-0.11,0.15,0.035,0.035,[0,0,-55],[0.7,0.35,0.12])
        }
    },

    silverAntAmulet:{
        
        mesh:function(box,cylinder,sphere,star){

            box(window.amuletOffset[0],1.525+window.amuletOffset[1],0.075,0.13,0.13,0.13,false,[0.9,0.9,0.9])
            box(window.amuletOffset[0],1.475+window.amuletOffset[1],-0.06,0.12,0.12,0.2,false,[0.9,0.9,0.9])
            box(0.05+window.amuletOffset[0],1.585+window.amuletOffset[1],0.12,0.15,0.035,0.035,[0,-30,45],[0.9,0.9,0.9])
            box(-0.05+window.amuletOffset[0],1.585+window.amuletOffset[1],0.12,0.15,0.035,0.035,[0,30,-45],[0.9,0.9,0.9])
            box(-0.05+window.amuletOffset[0],1.43+window.amuletOffset[1],-0.01,0.15,0.035,0.035,[0,0,55],[0.9,0.9,0.9])
            box(-0.05+window.amuletOffset[0],1.43+window.amuletOffset[1],-0.11,0.15,0.035,0.035,[0,0,55],[0.9,0.9,0.9])
            box(0.05+window.amuletOffset[0],1.43+window.amuletOffset[1],-0.01,0.15,0.035,0.035,[0,0,-55],[0.9,0.9,0.9])
            box(0.05+window.amuletOffset[0],1.43+window.amuletOffset[1],-0.11,0.15,0.035,0.035,[0,0,-55],[0.9,0.9,0.9])
        }
    },

    goldAntAmulet:{
        
        mesh:function(box,cylinder,sphere,star){

            box(window.amuletOffset[0],1.525+window.amuletOffset[1],0.075,0.13,0.13,0.13,false,[1.7,1.6,0])
            box(window.amuletOffset[0],1.475+window.amuletOffset[1],-0.06,0.12,0.12,0.2,false,[1.7,1.6,0])
            box(0.05+window.amuletOffset[0],1.585+window.amuletOffset[1],0.12,0.15,0.035,0.035,[0,-30,45],[1.7,1.6,0])
            box(-0.05+window.amuletOffset[0],1.585+window.amuletOffset[1],0.12,0.15,0.035,0.035,[0,30,-45],[1.7,1.6,0])
            box(-0.05+window.amuletOffset[0],1.43+window.amuletOffset[1],-0.01,0.15,0.035,0.035,[0,0,55],[1.7,1.6,0])
            box(-0.05+window.amuletOffset[0],1.43+window.amuletOffset[1],-0.11,0.15,0.035,0.035,[0,0,55],[1.7,1.6,0])
            box(0.05+window.amuletOffset[0],1.43+window.amuletOffset[1],-0.01,0.15,0.035,0.035,[0,0,-55],[1.7,1.6,0])
            box(0.05+window.amuletOffset[0],1.43+window.amuletOffset[1],-0.11,0.15,0.035,0.035,[0,0,-55],[1.7,1.6,0])
        }
    },

    diamondAntAmulet:{
        
        mesh:function(box,cylinder,sphere,star){

            box(window.amuletOffset[0],1.525+window.amuletOffset[1],0.075,0.13,0.13,0.13,false,[0,1.6,1.7])
            box(window.amuletOffset[0],1.475+window.amuletOffset[1],-0.06,0.12,0.12,0.2,false,[0,1.6,1.7])
            box(0.05+window.amuletOffset[0],1.585+window.amuletOffset[1],0.12,0.15,0.035,0.035,[0,-30,45],[0,1.6,1.7])
            box(-0.05+window.amuletOffset[0],1.585+window.amuletOffset[1],0.12,0.15,0.035,0.035,[0,30,-45],[0,1.6,1.7])
            box(-0.05+window.amuletOffset[0],1.43+window.amuletOffset[1],-0.01,0.15,0.035,0.035,[0,0,55],[0,1.6,1.7])
            box(-0.05+window.amuletOffset[0],1.43+window.amuletOffset[1],-0.11,0.15,0.035,0.035,[0,0,55],[0,1.6,1.7])
            box(0.05+window.amuletOffset[0],1.43+window.amuletOffset[1],-0.01,0.15,0.035,0.035,[0,0,-55],[0,1.6,1.7])
            box(0.05+window.amuletOffset[0],1.43+window.amuletOffset[1],-0.11,0.15,0.035,0.035,[0,0,-55],[0,1.6,1.7])
        }
    },

    supremeAntAmulet:{
        
        mesh:function(box,cylinder,sphere,star){

            box(window.amuletOffset[0],1.525+window.amuletOffset[1],0.075,0.13,0.13,0.13,false,[0,1.5,0.3])
            box(window.amuletOffset[0],1.475+window.amuletOffset[1],-0.06,0.12,0.12,0.2,false,[0,1.5,0.3])
            box(0.05+window.amuletOffset[0],1.585+window.amuletOffset[1],0.12,0.15,0.035,0.035,[0,-30,45],[0,1.5,0.3])
            box(-0.05+window.amuletOffset[0],1.585+window.amuletOffset[1],0.12,0.15,0.035,0.035,[0,30,-45],[0,1.5,0.3])
            box(-0.05+window.amuletOffset[0],1.43+window.amuletOffset[1],-0.01,0.15,0.035,0.035,[0,0,55],[0,1.5,0.3])
            box(-0.05+window.amuletOffset[0],1.43+window.amuletOffset[1],-0.11,0.15,0.035,0.035,[0,0,55],[0,1.5,0.3])
            box(0.05+window.amuletOffset[0],1.43+window.amuletOffset[1],-0.01,0.15,0.035,0.035,[0,0,-55],[0,1.5,0.3])
            box(0.05+window.amuletOffset[0],1.43+window.amuletOffset[1],-0.11,0.15,0.035,0.035,[0,0,-55],[0,1.5,0.3])
        }
    },

    moonAmulet:{
        
        mesh:function(box,cylinder,sphere,star){

            box(-0.08+window.amuletOffset[0],1.5+window.amuletOffset[1],0.075,0.12,0.19,0.07,false,[1.5,1.5,0.4])
            box(-0.06+window.amuletOffset[0],1.6+window.amuletOffset[1],0.075,0.09,0.16,0.07,[0,0,-35],[1.5,1.5,0.4])
            box(-0.06+window.amuletOffset[0],1.4+window.amuletOffset[1],0.075,0.09,0.16,0.07,[0,0,35],[1.5,1.5,0.4])
            box(window.amuletOffset[0],1.35+window.amuletOffset[1],0.075,0.1,0.08,0.07,[0,0,80],[1.5,1.5,0.4])
            box(window.amuletOffset[0],1.65+window.amuletOffset[1],0.075,0.1,0.08,0.07,[0,0,100],[1.5,1.5,0.4])
        }
    },

    bronzeShellAmulet:{
        
        mesh:function(box,cylinder,sphere,star){
            
            cylinder(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.12,0.11,10,0.8,0.42,0.17,0.01,90,0)
            cylinder(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.12*0.75,0.12,10,0.8*0.7,0.42*0.7,0.17*0.7,0.01,90,0)
            cylinder(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.12*0.65,0.13,10,0.8,0.42,0.17,0.01,90,0)
            cylinder(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.12*0.35,0.14,10,0.8*0.7,0.42*0.7,0.17*0.7,0.01,90,0)
            cylinder(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.12*0.25,0.15,10,0.8,0.42,0.17,0.01,90,0)
            box(window.amuletOffset[0],1.5+window.amuletOffset[1],-0.09,0.11,0.19,0.085,[35,0,0],[0.8,0.42,0.17])
        }
    },

    silverShellAmulet:{
        
        mesh:function(box,cylinder,sphere,star){
            
            cylinder(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.12,0.11,10,0.9,0.9,0.9,0.01,90,0)
            cylinder(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.12*0.75,0.12,10,0.6,0.6,0.6,0.01,90,0)
            cylinder(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.12*0.65,0.13,10,0.9,0.9,0.9,0.01,90,0)
            cylinder(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.12*0.35,0.14,10,0.6,0.6,0.6,0.01,90,0)
            cylinder(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.12*0.25,0.15,10,0.9,0.9,0.9,0.01,90,0)
            box(window.amuletOffset[0],1.5+window.amuletOffset[1],-0.09,0.11,0.19,0.085,[35,0,0],[0.9,0.9,0.9])
        }
    },

    goldShellAmulet:{
        
        mesh:function(box,cylinder,sphere,star){
            
            cylinder(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.12,0.11,10,1.7,1.6,0,0.01,90,0)
            cylinder(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.12*0.75,0.12,10,1.7*0.7,1.6*0.7,0,0.01,90,0)
            cylinder(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.12*0.65,0.13,10,1.7,1.6,0,0.01,90,0)
            cylinder(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.12*0.35,0.14,10,1.7*0.7,1.6*0.7,0,0.01,90,0)
            cylinder(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.12*0.25,0.15,10,1.7,1.6,0,0.01,90,0)
            box(window.amuletOffset[0],1.5+window.amuletOffset[1],-0.09,0.11,0.19,0.085,[35,0,0],[1.7,1.6,0])
        }
    },

    diamondShellAmulet:{
        
        mesh:function(box,cylinder,sphere,star){
            
            cylinder(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.12,0.11,10,0,1.6,1.7,0.01,90,0)
            cylinder(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.12*0.75,0.12,10,0,1.6*0.7,1.7*0.7,0.01,90,0)
            cylinder(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.12*0.65,0.13,10,0,1.6,1.7,0.01,90,0)
            cylinder(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.12*0.35,0.14,10,0,1.6*0.7,1.7*0.7,0.01,90,0)
            cylinder(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.12*0.25,0.15,10,0,1.6,1.7,0.01,90,0)
            box(window.amuletOffset[0],1.5+window.amuletOffset[1],-0.09,0.11,0.19,0.085,[35,0,0],[0,1.6,1.7])
        }
    },

    supremeShellAmulet:{
        
        mesh:function(box,cylinder,sphere,star){
            
            cylinder(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.12,0.11,10,0,1.5,0.3,0.01,90,0)
            cylinder(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.12*0.75,0.12,10,0,1.5*0.7,0.3*0.7,0.01,90,0)
            cylinder(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.12*0.65,0.13,10,0,1.5,0.3,0.01,90,0)
            cylinder(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.12*0.35,0.14,10,0,1.5*0.7,0.3*0.7,0.01,90,0)
            cylinder(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.12*0.25,0.15,10,0,1.5,0.3,0.01,90,0)
            box(window.amuletOffset[0],1.5+window.amuletOffset[1],-0.09,0.11,0.19,0.085,[35,0,0],[0,1.5,0.3])
        }
    },

    kingBeetleAmulet:{
        
        mesh:function(box,cylinder,sphere,star){
            
            sphere(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.3,1,1.5,1.5,1.5)

            box(window.amuletOffset[0],1.62+window.amuletOffset[1],0.07,0.04,0.12,0.12,[45,0,0],[0,1.3,0])
            box(window.amuletOffset[0],1.45+window.amuletOffset[1],0.1,0.08,0.1,0.1,[45,0,0],[1.3,0,0])
            box(window.amuletOffset[0]-0.07,1.55+window.amuletOffset[1],0.16,0.05,0.15,0.05,[45,0,45],[1.3,1.3,0])
            box(window.amuletOffset[0]+0.07,1.55+window.amuletOffset[1],0.16,0.05,0.15,0.05,[45,0,-45],[1.3,1.3,0])
        }
    },

    bronzeStickAmulet:{
        
        mesh:function(box,cylinder,sphere,star){
            
            box(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.04,0.3,0.04,false,[0.7,0.35,0.12])
            box(window.amuletOffset[0],1.5+window.amuletOffset[1]+0.05,0,0.27,0.04,0.04,false,[0.7,0.35,0.12])
            box(window.amuletOffset[0],1.5+window.amuletOffset[1]-0.03,0,0.27,0.04,0.04,false,[0.7,0.35,0.12])
            box(window.amuletOffset[0]+0.04,1.5+window.amuletOffset[1]+0.16,0,0.1,0.04,0.04,[0,0,45],[0.7,0.35,0.12])
            box(window.amuletOffset[0]-0.04,1.5+window.amuletOffset[1]+0.16,0,0.1,0.04,0.04,[0,0,-45],[0.7,0.35,0.12])
            box(window.amuletOffset[0]+0.04,1.5+window.amuletOffset[1]-0.16,0,0.1,0.04,0.04,[0,0,-45],[0.7,0.35,0.12])
            box(window.amuletOffset[0]-0.04,1.5+window.amuletOffset[1]-0.16,0,0.1,0.04,0.04,[0,0,45],[0.7,0.35,0.12])
        }
    },

    silverStickAmulet:{
        
        mesh:function(box,cylinder,sphere,star){
            
            box(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.04,0.3,0.04,false,[0.9,0.9,0.9])
            box(window.amuletOffset[0],1.5+window.amuletOffset[1]+0.05,0,0.27,0.04,0.04,false,[0.9,0.9,0.9])
            box(window.amuletOffset[0],1.5+window.amuletOffset[1]-0.03,0,0.27,0.04,0.04,false,[0.9,0.9,0.9])
            box(window.amuletOffset[0]+0.04,1.5+window.amuletOffset[1]+0.16,0,0.1,0.04,0.04,[0,0,45],[0.9,0.9,0.9])
            box(window.amuletOffset[0]-0.04,1.5+window.amuletOffset[1]+0.16,0,0.1,0.04,0.04,[0,0,-45],[0.9,0.9,0.9])
            box(window.amuletOffset[0]+0.04,1.5+window.amuletOffset[1]-0.16,0,0.1,0.04,0.04,[0,0,-45],[0.9,0.9,0.9])
            box(window.amuletOffset[0]-0.04,1.5+window.amuletOffset[1]-0.16,0,0.1,0.04,0.04,[0,0,45],[0.9,0.9,0.9])
        }
    },

    goldStickAmulet:{
        
        mesh:function(box,cylinder,sphere,star){
            
            box(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.04,0.3,0.04,false,[1.7,1.6,0])
            box(window.amuletOffset[0],1.5+window.amuletOffset[1]+0.05,0,0.27,0.04,0.04,false,[1.7,1.6,0])
            box(window.amuletOffset[0],1.5+window.amuletOffset[1]-0.03,0,0.27,0.04,0.04,false,[1.7,1.6,0])
            box(window.amuletOffset[0]+0.04,1.5+window.amuletOffset[1]+0.16,0,0.1,0.04,0.04,[0,0,45],[1.7,1.6,0])
            box(window.amuletOffset[0]-0.04,1.5+window.amuletOffset[1]+0.16,0,0.1,0.04,0.04,[0,0,-45],[1.7,1.6,0])
            box(window.amuletOffset[0]+0.04,1.5+window.amuletOffset[1]-0.16,0,0.1,0.04,0.04,[0,0,-45],[1.7,1.6,0])
            box(window.amuletOffset[0]-0.04,1.5+window.amuletOffset[1]-0.16,0,0.1,0.04,0.04,[0,0,45],[1.7,1.6,0])
        }
    },

    diamondStickAmulet:{
        
        mesh:function(box,cylinder,sphere,star){
            
            box(window.amuletOffset[0],1.5+window.amuletOffset[1],0,0.04,0.3,0.04,false,[0,1.6,1.7])
            box(window.amuletOffset[0],1.5+window.amuletOffset[1]+0.05,0,0.27,0.04,0.04,false,[0,1.6,1.7])
            box(window.amuletOffset[0],1.5+window.amuletOffset[1]-0.03,0,0.27,0.04,0.04,false,[0,1.6,1.7])
            box(window.amuletOffset[0]+0.04,1.5+window.amuletOffset[1]+0.16,0,0.1,0.04,0.04,[0,0,45],[0,1.6,1.7])
            box(window.amuletOffset[0]-0.04,1.5+window.amuletOffset[1]+0.16,0,0.1,0.04,0.04,[0,0,-45],[0,1.6,1.7])
            box(window.amuletOffset[0]+0.04,1.5+window.amuletOffset[1]-0.16,0,0.1,0.04,0.04,[0,0,-45],[0,1.6,1.7])
            box(window.amuletOffset[0]-0.04,1.5+window.amuletOffset[1]-0.16,0,0.1,0.04,0.04,[0,0,45],[0,1.6,1.7])
        }
    },
    
    glider:{
        
        none:{mesh:function(){},applyStats:function(){}},
        
        parachute:{
            
            mesh:function(box,cylinder,sphere,star,applyFinalRotation){
                
                cylinder(0,1.55,0,1,0.4,13,1.2,1.2,1.2,-90,0,0,1.15)
                cylinder(0,1.55+0.2+0.15,0,0.6,0.3,13,1.2,1.2,1.2,-90,0,0,1)

                box(-0.5,0.65,0.3,0.06,1.8,0.06,[12,0,25],[1.4,1.4,1.4])
                box(-0.5,0.65,-0.3,0.06,1.8,0.06,[-12,0,25],[1.4,1.4,1.4])
                box(0.5,0.65,0.3,0.06,1.8,0.06,[12,0,-25],[1.4,1.4,1.4])
                box(0.5,0.55,-0.3,0.06,1.8,0.06,[-12,0,-25],[1.4,1.4,1.4])
            },
            applyStats:function(stats,player){
                
                stats.gliderSpeed=18*0.7
                stats.gliderFall=-5*0.75
            },
            desc:'A parachute you can use to glide down the mountain and reach new places!<br><br>Press jump while in the air to open. ',
            cost:['500000 honey'],
        },

        glider:{
            
            mesh:function(box,cylinder,sphere,star,applyFinalRotation){
                
                box(0,2,0,1,0.2,1.501,false,[1.4,1.4,0])
                box(-0.9,1.85,0,1,0.2,1.5,[0,0,20],[0.15,0.15,0.15])
                box(0.9,1.85,0,1,0.2,1.5,[0,0,-20],[0.15,0.15,0.15])
                box(-1.675,1.3,0,1,0.2,1.501,[0,0,50],[1.4,1.4,0])
                box(1.675,1.3,0,1,0.2,1.501,[0,0,-50],[1.4,1.4,0])
                
                box(-0.8,0.55,0.3,0.06,2.2,0.06,[12,0,40],[1.4,1.4,1.4])
                box(-0.8,0.55,-0.3,0.06,2.2,0.06,[-12,0,40],[1.4,1.4,1.4])
                box(0.8,0.55,0.3,0.06,2.2,0.06,[12,0,-40],[1.4,1.4,1.4])
                box(0.8,0.55,-0.3,0.06,2.2,0.06,[-12,0,-40],[1.4,1.4,1.4])
            },
            applyStats:function(stats,player){
                
                stats.gliderSpeed=18
                stats.gliderFall=-5
            },
            desc:'Floats much faster than the Parachute, allowing you to fly through the sky!<br><br>Press jump while in the air to open. ',
            cost:['5000000 honey'],
        },
        
    },
    
    mask:{
        
        none:{
            
            mesh:function(box){
                
                box(-0.1,0.3,0.225,0.05,0.1,0.1,false,[0,0,0])
                box(0.1,0.3,0.225,0.05,0.1,0.1,false,[0,0,0])
                box(0,0.15,0.225,0.2,0.05,0.1,false,[0,0,0])
                box(0,0.5,0,0.55,0.1,0.55,false,[0,0,0])
            },applyStats:function(){}
        },

        helmet:{
            
            mesh:function(box,cylinder,sphere,a,b,putFace=true){
                
                if(putFace){

                    box(-0.1,0.3,0.225,0.05,0.1,0.1,false,[0,0,0])
                    box(0.1,0.3,0.225,0.05,0.1,0.1,false,[0,0,0])
                    box(0,0.15,0.225,0.2,0.05,0.1,false,[0,0,0])
                    box(0,0.5,0,0.55,0.1,0.55,false,[0,0,0])
                }

                cylinder(0,0.625,0.045,0.26*1.414,0.15,10,1.3,1.3,0,90,0,0,0.26*1.414*0.9)
                cylinder(0,0.625+0.15,0.045,0.26*1.414*0.9,0.15,10,1.3,1.3,0,90,0,0,0.26*1.414*0.6)
                cylinder(0,0.625+0.15+0.075*1.5,0.045,0.26*1.414*0.6,0.075,10,1.3,1.3,0,90,0,0,0.26*1.414*0.2)

                box(0.28,0.4,0.2,0.05,0.4,0.05,[-30,0,0],[1.3,1.3,0])
                box(-0.28,0.4,0.2,0.05,0.4,0.05,[-30,0,0],[1.3,1.3,0])
                box(0,0.4-Math.cos(-30*0.01745329251)*0.2,0.2-Math.sin(-30*0.01745329251)*0.2,0.28*2+0.05,0.05,0.05,[-30,0,0],[1.3,1.3,0])
            },
            
            applyStats:function(stats,player){
                
                stats.bluePollen*=1.15
                stats.whitePollen*=1.15
                stats.redPollen*=1.15
                stats.defense+=0.1

            },
            desc:'A hard hat that grants bonus pollen and helps prevent head injuries.<br><br>x1.15 pollen<br>+10% defense',
            cost:['30000 honey','1 pineapple'],
        },

        propellerHat:{
            
            mesh:function(box,cylinder,sphere){
                
                box(-0.1,0.3,0.225,0.05,0.1,0.1,false,[0,0,0])
                box(0.1,0.3,0.225,0.05,0.1,0.1,false,[0,0,0])
                box(0,0.15,0.225,0.2,0.05,0.1,false,[0,0,0])
                box(0,0.5,0,0.55,0.1,0.55,false,[0,0,0])

                cylinder(0+0.03,0.625,0.045+0.03,0.26*1.414,0.15,10,1.45,0.8,0.1,90,0,0,0.26*1.414*0.9)
                cylinder(0+0.03,0.625+0.15,0.045+0.03,0.26*1.414*0.9,0.15,10,1.45,0.8,0.1,90,0,0,0.26*1.414*0.6)
                cylinder(0+0.03,0.625+0.15+0.075*1.5,0.045+0.03,0.26*1.414*0.6,0.075,10,1.45,0.8,0.1,90,0,0,0.26*1.414*0.2)

                cylinder(0-0.03,0.625+0.01,0.045+0.03,0.26*1.414,0.15,10,1.45,0,0,90,0,0,0.26*1.414*0.9)
                cylinder(0-0.03,0.625+0.15+0.01,0.045+0.03,0.26*1.414*0.9,0.15,10,1.45,0,0,90,0,0,0.26*1.414*0.6)
                cylinder(0-0.03,0.625+0.15+0.075*1.5+0.01,0.045+0.03,0.26*1.414*0.6,0.075,10,1.45,0,0,90,0,0,0.26*1.414*0.2)
                
                cylinder(0+0.03,0.625+0.02,0.045-0.03,0.26*1.414,0.15,10,0,1.45,0,90,0,0,0.26*1.414*0.9)
                cylinder(0+0.03,0.625+0.15+0.02,0.045-0.03,0.26*1.414*0.9,0.15,10,0,1.45,0,90,0,0,0.26*1.414*0.6)
                cylinder(0+0.03,0.625+0.15+0.075*1.5+0.02,0.045-0.03,0.26*1.414*0.6,0.075,10,0,1.45,0,90,0,0,0.26*1.414*0.2)

                cylinder(0-0.03,0.625+0.03,0.045-0.03,0.26*1.414,0.15,10,0,0,1.45,90,0,0,0.26*1.414*0.9)
                cylinder(0-0.03,0.625+0.15+0.03,0.045-0.03,0.26*1.414*0.9,0.15,10,0,0,1.45,90,0,0,0.26*1.414*0.6)
                cylinder(0-0.03,0.625+0.15+0.075*1.5+0.03,0.045-0.03,0.26*1.414*0.6,0.075,10,0,0,1.45,90,0,0,0.26*1.414*0.2)
                
                cylinder(0,0.625+0.15+0.075*1.5+0.03,0.045,0.26*1.414*0.2,0.1,10,0.3,0.3,0.3,90,0,0,0.26*1.414*0.2)

                
                box(0,0.625+0.15+0.075*1.5+0.1,0.045,0.05,0.2,0.05,false,[0,0,0])

                box(0,0.625+0.15+0.075*1.5+0.2,0.045,0.4,0.03,0.04,[0,35,0],[0.7,0.7,0.7])
                box(0,0.625+0.15+0.075*1.5+0.2,0.045,0.4,0.03,0.04,[0,35+90,0],[0.7,0.7,0.7])

            },
            
            applyStats:function(stats,player){
                
                stats.bluePollen*=1.2
                stats.whitePollen*=1.2
                stats.redPollen*=1.2
                stats.jumpPower*=1.1
                stats.redBeeAbilityRate*=1.05
                stats.blueBeeAbilityRate*=1.05
                stats.whiteBeeAbilityRate*=1.05
                stats.defense+=0.1

            },
            desc:'A playful hat that keeps the sun out of your eyes.<br><br>x1.2 pollen<br>x1.05 bee ability rate<br>+10% defense<br>x1.1 jump power',
            cost:['2500000 honey','15 gumdrops','10 pineapple','1 moonCharm'],
        },

        beekeeperMask:{
            
            mesh:function(box,cylinder,sphere){
                
                sphere(0,0.57,0,0.5*1.414,2,1.1,1.1,1.1)
                cylinder(0,0.61,0,0.28*1.414,0.085,10,0.5,0.5,0.5,90,0,0)
                cylinder(0,0.35,0,0.52*0.5*1.415,0.45,10,1.1,1.1,1.1,90,0,0)
                box(-0.1,0.4,0.32,0.05,0.1,0.1,false,[0.2,0.2,0.2])
                box(0.1,0.4,0.32,0.05,0.1,0.1,false,[0.2,0.2,0.2])
                box(0,0.25,0.32,0.2,0.05,0.1,false,[0.2,0.2,0.2])
                
            },
            
            applyStats:function(stats,player){
                
                stats.bluePollen*=1.25
                stats.whitePollen*=1.25
                stats.redPollen*=1.25
                stats.pollenFromBees*=1.22
                stats.defense+=0.25
                stats.redBeeAbilityRate*=1.1
                stats.blueBeeAbilityRate*=1.1
                stats.whiteBeeAbilityRate*=1.1

            },
            desc:'A veiled hat only worn by real-deal beekeepers.<br><br>x1.25 pollen<br>x1.25 pollen from bees<br>x1.1 bee ability rate<br>+25% defense',
            cost:['10000000 honey','3 enzymes','1 glue','1 glitter'],
        },

        honeyMask:{
            
            mesh:function(box,cylinder,sphere){
                
                sphere(0,0.57,0,0.5*1.414,2,1.4,1.3,0)
                cylinder(0,0.61,0,0.28*1.414,0.085,10,0.1,0.1,0.1,90,0,0)
                cylinder(0,0.35,0,0.52*0.5*1.415,0.45,10,1.4,1.3,0,90,0,0)
                box(-0.1,0.4,0.32,0.05,0.1,0.1,false,[0.1,0.1,0.1])
                box(0.1,0.4,0.32,0.05,0.1,0.1,false,[0.1,0.1,0.1])
                box(0,0.25,0.32,0.2,0.05,0.1,false,[0.1,0.1,0.1])
                
            },
            
            applyStats:function(stats,player){
                
                stats.capacityMultiplier*=1.75
                stats.bluePollen*=1.4
                stats.whitePollen*=1.4
                stats.redPollen*=1.4
                stats.pollenFromBees*=1.35
                stats.defense+=0.3
                stats.redBeeAbilityRate*=1.15
                stats.blueBeeAbilityRate*=1.15
                stats.whiteBeeAbilityRate*=1.15
                stats.honeyFromTokens*=1.5
                stats.convertRate*=1.8
                player.addEffect('coinScatterPassive')

            },
            desc:'This handsome mask is guaranteed to bring satisfaction into your life.<br><br>x1.75 capacity<br>x1.4 pollen<br>x1.35 pollen from bees<br>x1.15 bee ability rate<br>x1.5 honey from tokens<br>x1.8 convert rate<br>+30% defense<br>+Passive: Coin Scatter',
            cost:['75000000 honey','35 oil','15 enzymes','1 goldEgg','999 treat'],
        },

        fireMask:{
            
            mesh:function(box,cylinder,sphere){
                
                sphere(0,0.57,0,0.5*1.414,2,1.4,0.1,0)
                cylinder(0,0.61,0,0.28*1.414,0.085,10,1.3,1.3,0.1,90,0,0)
                cylinder(0,0.35,0,0.52*0.5*1.415,0.45,10,1.4,0.1,0,90,0,0)
                box(-0.1,0.4,0.32,0.05,0.1,0.1,false,[1.3,1.3,0.1])
                box(0.1,0.4,0.32,0.05,0.1,0.1,false,[1.3,1.3,0.1])
                box(0,0.25,0.32,0.2,0.05,0.1,false,[1.3,1.3,0.1])
                
            },
            
            applyStats:function(stats,player){
                
                stats.capacityMultiplier*=1.75
                stats.redPollen*=1.6
                stats.instantRedConversion=window.applyPercentage(stats.instantRedConversion,0.2)
                stats.instantFlameConversion=window.applyPercentage(stats.instantFlameConversion,0.5)
                stats.defense+=0.35
                stats.redBeeAbilityRate*=1.15
                stats.blueBeeAbilityRate*=1.15
                stats.whiteBeeAbilityRate*=1.15
                stats.redBeeAttack+=2
                stats.whiteBeeAttack++
                stats.blueBeeAttack++
                player.addEffect('ignitePassive')

            },
            desc:'Ignite your mind to enhance your red bees.<br><br>x1.75 capacity<br>x1.6 red pollen<br>+20% instant red conversion<br>+50% instant flame conversion<br>+1 bee attack<br>+1 red bee attack<br>x1.15 bee ability rate<br>+35% defense<br>+Passive: Ignite',
            cost:['50000000 honey','30 redExtract','15 enzymes','5 glue','300 strawberry'],
        },

        bubbleMask:{
            
            mesh:function(box,cylinder,sphere){
                
                sphere(0,0.57,0,0.5*1.414,2,0.4,1.2,1.3)
                cylinder(0,0.61,0,0.28*1.414,0.085,10,0.4*0.7,1*0.7,1.3*0.7,90,0,0)
                cylinder(0,0.35,0,0.52*0.5*1.415,0.45,10,0.4,1.2,1.3,90,0,0)
                box(-0.1,0.4,0.32,0.05,0.1,0.1,false,[0.4*0.7,1*0.7,1.3*0.7])
                box(0.1,0.4,0.32,0.05,0.1,0.1,false,[0.4*0.7,1*0.7,1.3*0.7])
                box(0,0.25,0.32,0.2,0.05,0.1,false,[0.4*0.7,1*0.7,1.3*0.7])
                
            },
            
            applyStats:function(stats,player){
                
                stats.capacityMultiplier*=2
                stats.bluePollen*=1.6
                stats.instantBlueConversion=window.applyPercentage(stats.instantBlueConversion,0.2)
                stats.bubblePollen*=2
                stats.defense+=0.3
                stats.redBeeAbilityRate*=1.15
                stats.blueBeeAbilityRate*=1.15
                stats.whiteBeeAbilityRate*=1.15
                player.addEffect('bubbleBombsPassive')

            },
            desc:'Harness the power of the sea to enhance your blue pollen gathering.<br><br>x2 capacity<br>x1.6 blue pollen<br>+20% instant blue conversion<br>x2 bubble pollen<br>x1.15 bee ability rate<br>+30% defense<br>+Passive: Bubble Bombs',
            cost:['50000000 honey','30 blueExtract','15 oil','5 glue','300 blueberry'],
        },
        
        gummyMask:{
            
            mesh:function(box,cylinder,sphere){
                
                sphere(0,0.5,0,0.5*1.414,2,1.6,0.4,1.6)
                cylinder(0,0.65,0,0.26*1.414,0.075,10,0.6,20,2,90,0,0)
                cylinder(0,0.85,0,0.15,0.2,10,0.2,2,1,90,0,0)
                cylinder(0,0.35,0,0.52*0.5*1.415,0.45,10,1.6,0.4,1.6,90,0,0)
                box(-0.1,0.4,0.32,0.05,0.1,0.1,false,[0.2,2,1])
                box(0.1,0.4,0.32,0.05,0.1,0.1,false,[0.2,2,1])
                box(0,0.25,0.32,0.2,0.05,0.1,false,[0.2,2,1])
                
            },
            
            applyStats:function(stats,player){
                
                stats.capacityMultiplier*=2
                stats.whiteFieldCapacity*=1.75
                stats.goo*=1.75
                stats.instantWhiteConversion=window.applyPercentage(stats.instantWhiteConversion,0.25)
                stats.redBeeAbilityRate*=1.2
                stats.blueBeeAbilityRate*=1.2
                stats.whiteBeeAbilityRate*=1.2
                stats.bluePollen*=1.35
                stats.whitePollen*=1.35
                stats.redPollen*=1.35
                stats.whitePollen*=1.5
                stats.honeyFromTokens*=1.5
                stats.convertRate*=1.75
                stats.defense+=0.3
                player.addEffect('gummyMorphPassive')
                player.addEffect('coinScatterPassive')

            },
            desc:'The offical mask of a gummy soldier.<br><br>x1.75 goo<br>x2 capacity<br>x1.75 white field capacity<br>x1.5 white pollen<br>x1.35 pollen<br>+25% instant white conversion<br>x1.5 honey from tokens<br>x1.75 convert rate<br>+30% defense<br>x1.2 bee ability rate<br>+Passive: Gummy Morph<br>+Passive: Coin Scatter',
            cost:['5000000000 honey','150 glue','75 enzymes','75 oil','75 glitter'],
        },
        
        diamondMask:{
            
            mesh:function(box,cylinder,sphere){
                
                sphere(0,0.6,0,0.5*1.414,2,0.3*1.1,1*1.1,2*1.1)
                cylinder(0,0.65,0,0.28*1.414,0.095,10,100,100,100,90,0,0)
                cylinder(0,0.35,0,0.52*0.5*1.415,0.45,10,0.3*1.1,1*1.1,2*1.1,90,0,0)
                box(-0.1,0.4,0.32,0.05,0.1,0.1,false,[100,100,100])
                box(0.1,0.4,0.32,0.05,0.1,0.1,false,[100,100,100])
                box(0,0.25,0.32,0.2,0.05,0.1,false,[100,100,100])
                box(0.2,0.8,0.35,0.05,0.35,0.05,[0,0,15],[100,100,100])
                box(-0.2,0.8,0.35,0.05,0.35,0.05,[0,0,-15],[100,100,100])
                box(-0.1,0.8,0.35,0.05,0.35,0.05,[0,0,15],[100,100,100])
                box(0.1,0.8,0.35,0.05,0.35,0.05,[0,0,-15],[100,100,100])
                box(0,0.85,0.35,0.3,0.05,0.05,false,[100,100,100])
            },
            
            applyStats:function(stats,player){
                
                stats.capacityMultiplier*=3
                stats.blueFieldCapacity*=1.75
                stats.bluePollen*=1.5
                stats.bluePollen*=1.35
                stats.whitePollen*=1.35
                stats.redPollen*=1.35
                stats.convertRate*=2
                stats.convertRateAtHive*=2
                stats.bubblePollen*=2
                stats.redBeeAbilityRate*=1.2
                stats.blueBeeAbilityRate*=1.2
                stats.whiteBeeAbilityRate*=1.2
                stats.defense+=0.35
                player.addEffect('diamondDrainPassive')
                player.addEffect('bubbleBombsPassive')
            },
            desc:'Proudly show off your extreme wealth to the world. Shine so brightly that others will complain.<br><br>x3 capacity<br>x1.75 blue field capacity<br>x1.5 blue pollen<br>x1.35 pollen<br>x2 convert rate<br>x2 convert rate at hive<br>x2 bubble pollen<br>+35% defense<br>x1.2 bee ability rate<br>+Passive: Diamond Drain<br>+Passive: Bubble Bombs',
            cost:['5000000000 honey','250 blueExtract','1 diamondEgg','75 glitter','100 oil'],
        },
        
        demonMask:{
            
            mesh:function(box,cylinder,sphere){
                
                sphere(0,0.6,0,0.5*1.414,2,0.25,0,0)
                cylinder(0,0.65,0,0.28*1.414,0.095,10,1.1,0,0,90,0,0)
                cylinder(0,0.35,0,0.52*0.5*1.415,0.45,10,0.25,0,0,90,0,0)
                box(-0.1,0.4,0.32,0.05,0.1,0.1,false,[1.1,0,0])
                box(0.1,0.4,0.32,0.05,0.1,0.1,false,[1.1,0,0])
                box(0,0.25,0.32,0.2,0.05,0.1,false,[1.1,0,0])
                
                box(-0.3,0.9,0.1,0.13,0.4,0.13,[0,0,20],[1.1,0,0])
                box(0.3,0.9,0.1,0.13,0.4,0.13,[0,0,-20],[1.1,0,0])
            },
            
            applyStats:function(stats,player){
                
                stats.capacityMultiplier*=2
                stats.redFieldCapacity*=1.75
                stats.redPollen*=1.75
                stats.beeAttack*=1.25
                stats.instantFlameConversion=window.applyPercentage(stats.instantFlameConversion,0.5)
                stats.flamePollen*=2
                stats.redBeeAbilityRate*=1.2
                stats.blueBeeAbilityRate*=1.2
                stats.whiteBeeAbilityRate*=1.2
                stats.defense+=0.35
                player.addEffect('xFlamePassive')
                player.addEffect('ignitePassive')
            },
            desc:'Embrace hate to take on the form of a Demon Bee. Become both extremely unpleasant and powerful.<br><br>x2 capacity<br>x1.75 red field capacity<br>x1.75 red pollen<br>+50% instant flame conversion<br>x2 flame pollen<br>x1.25 bee attack<br>+35% defense<br>+20% bee ability rate<br>+Passive: X Flame<br>+Passive: Ignite',
            cost:['5000000000 honey','350 stinger','250 redExtract','100 enzymes','75 glue'],
        },
    },
    
    belt:{
        
        none:{mesh:function(){},applyStats:function(){}},

        beltPocket:{
            
            mesh:function(box,cylinder,sphere){
                
                box(0,-0.2,0.25,0.3,0.2,0.3,false,[0.7*1.2,0.5*1.2,0.2*1.2])
                box(0,-0.27,0.25,0.295,0.2,0.2,false,[0.7,0.5,0.2])
                box(0,-0.26,0.25,0.12,0.09,0.305,false,[0.4,0.4,0.4])
            },
            
            applyStats:function(stats,player){
                
                stats.capacity+=5000
                stats.lootLuck*=1.15
                stats.convertRate*=1.1
            },
            desc:'Attaches to your waist to expand the size of your container.<br><br>+5,000 capacity<br>x1.15 loot luck<br>x1.1 convert rate',
            cost:['14000 honey','1 sunflowerSeed'],
        },

        beltBag:{
            
            mesh:function(box,cylinder,sphere){
                
                box(0,-0.2,0.25,0.3*1.4,0.18,0.3,false,[1.3,1.3,1.3])
                box(0,-0.26,0.25,0.295*1.4,0.2,0.2,false,[1.1,1.1,1.1])
                box(0,-0.26,0.25,0.29*1.4,0.04,0.305,false,[0.4,0.4,0.4])
            },
            
            applyStats:function(stats,player){
                
                stats.capacity+=25000
                stats.lootLuck*=1.25
                stats.convertRate*=1.3
                stats.beeSpeed*=1.15
            },
            desc:'A convenient pouch designed for easy access.<br><br>+25,000 capacity<br>x1.25 loot luck<br>x1.3 convert rate<br>x1.15 bee speed',
            cost:['400000 honey','10 pineapple','10 sunflowerSeed','1 stinger'],
        },

        mondoBeltBag:{
            
            mesh:function(box,cylinder,sphere){
                
                box(0,-0.2,0.25,0.3*1.4,0.18,0.3,false,[1.3,1.3,1.3])
                box(0,-0.26,0.25,0.295*1.4,0.2,0.2,false,[1.1,1.1,1.1])
                box(0,-0.26,0.25,0.29*1.4,0.04,0.305,false,[0.4,0.4,0.4])
                
                box(0.27,-0.18,0.33,0.3,0.09,0.05,[0,15,10],[0,0,1.4])
                box(0.27,-0.26,0.33,0.2,0.06,0.05,[0,15,-15],[0,0,1.4])
                box(-0.27,-0.18,0.33,0.3,0.09,0.05,[0,-15,-10],[1.4,0,0])
                box(-0.27,-0.26,0.33,0.2,0.06,0.05,[0,-15,15],[1.4,0,0])
            },
            
            applyStats:function(stats,player){
                
                stats.capacity+=100000
                stats.lootLuck*=1.5
                stats.convertRate*=1.5
            },
            desc:'A highly-embellished belt bag imported from a lost land, as big as a tambourine.<br><br>+100,000 capacity<br>x1.5 loot luck<br>x1.5 convert rate',
            cost:['5000000 honey','50 pineapple','50 sunflowerSeed','3 stinger'],
        },
        
        honeycombBelt:{
            
            mesh:function(box,cylinder,sphere){
                
                box(0,-0.1,0,0.55,0.085,0.55,false,[1.5,1.4,0])
                box(0-0.075,-0.1+0.065,0.285,0.1,0.1,0.05,[0,0,20],[5,5,5])
                box(0+0.075,-0.1+0.065,0.285,0.1,0.1,0.05,[0,0,-20],[5,5,5])
                box(0,-0.1-0.065,0.285,0.1,0.1,0.05,false,[5,5,5])
                box(0-0.075,-0.1+0.065,0.265,0.15,0.15,0.05,[0,0,20],[5,5,0])
                box(0+0.075,-0.1+0.065,0.265,0.15,0.15,0.05,[0,0,-20],[5,5,0])
                box(0,-0.1-0.065,0.265,0.15,0.15,0.05,false,[5,5,0])
            },
            
            applyStats:function(stats,player){
                
                stats.capacity+=200000
                stats.capacityMultiplier*=1.75
                stats.lootLuck*=1.75
                stats.convertRate*=1.75
                stats.honeyFromTokens*=1.5
                stats.whiteBeeAttack++
                stats.whiteBombPollen*=1.3
                stats.beeEnergy*=1.15
            },
            desc:'A luxurious faux honeycomb you can wear as a belt to greatly enhance your pollen capacity.<br><br>+200,000 capacity<br>x1.75 capacity<br>x1.75 loot luck<br>x1.75 convert rate<br>x1.5 honey from tokens<br>+1 white bee attack<br>x1.3 white bomb pollen<br>x1.15 bee energy',
            cost:['50000000 honey','25 glue','25 enzymes','25 oil'],
        },
        
        petalBelt:{
            
            mesh:function(box,cylinder,sphere){
                
                box(-0.075*1.5,-0.1+0.05*1.5,0.3,0.2,0.2,0.05,[0,0,30],[1.25,1.25,1.25])
                box(0.075*1.5,-0.1+0.025*1.5,0.3,0.2,0.2,0.05,[0,0,60],[1.25,1.25,1.25])
                box(0,-0.1-0.05*1.5,0.3,0.2,0.2,0.05,false,[1.25,1.25,1.25])
                box(0,-0.1,0.35,0.1,0.1,0.1,[45,45,0],[1.5,1.5,0.2])
                box(-0.075*1.5,-0.1+0.04*1.5,0.25,0.25,0.25,0.05,[0,0,80],[0,1.25,0])
                box(0.075*1.5,-0.1+0.025*1.5,0.25,0.25,0.25,0.05,[0,0,20],[0,1.25,0])
                box(0,-0.1-0.05*1.5,0.25,0.25,0.25,0.05,[0,0,30],[0,1.25,0])
            },
            
            applyStats:function(stats,player){
                
                stats.capacity+=300000
                stats.capacityMultiplier*=2
                stats.lootLuck*=2
                stats.convertRate*=1.8
                stats.honeyFromTokens*=1.5
                stats.whiteBeeAttack+=2
                stats.whiteBombPollen*=1.5
                stats.beeEnergy*=1.25
                player.addEffect('petalStormPassive')
            },
            desc:'Drape these petals about your waist to harness unlimited flower power.<br><br>+300,000 capacity<br>x2 capacity<br>x2 loot luck<br>x1.8 convert rate<br>x1.5 honey from tokens<br>+2 white bee attack<br>x1.5 white bomb pollen<br>x1.25 bee energy<br>+Passive: Petal Storm',
            cost:['15000000000 honey','15 starJelly','50 glitter','75 glue','1 spiritPetal'],
        }
    },
    
    backpack:{
        
        none:{mesh:function(){},applyStats:function(){}},
        
        pouch:{
            
            mesh:function(box,cylinder,sphere){
                
                sphere(0,0,-0.5,0.6,2,0.9,0.7,0.3)
                sphere(0,0.3,-0.5,0.2,2,0.9*0.7,0.7*0.7,0.3*0.7)
            },
            
            applyStats:function(stats,player){
                
                stats.capacity+=200
            },
            desc:'A small bag.<br><br>+200 capacity',
            cost:['0 honey'],
        },

        jar:{
            
            mesh:function(box,cylinder,sphere){
                
                cylinder(0,0,-0.6,0.4,0.75,15,0.9*1.3,0.7*1.3,0.3*1.3,90,0,0)
                cylinder(0,0.33,-0.6,0.43,0.25,15,0.6,0.6,0.6,90,0,0)
            },
            
            applyStats:function(stats,player){
                
                stats.capacity+=750
            },
            desc:'A durable plastic jar. Holds much more than the Pouch!<br><br>+750 capacity',
            cost:['600 honey'],
        },

        backpack:{
            
            mesh:function(box,cylinder,sphere){
                
                box(0,0,-0.4,0.55,0.7,0.35,false,[0.2,0.8,0.2])
                box(0.13,0.1,-0.41,0.2,0.2,0.35,false,[0,0.5,0])
                box(-0.13,0.1,-0.41,0.2,0.2,0.35,false,[0,0.5,0])
                box(0,-0.15,-0.41,0.48,0.2,0.35,false,[1.3,1,0])
                cylinder(0,0.7*0.5,-0.4,0.35*0.5,0.55,15,0.2,0.8,0.2,90,0,90)
            },
            
            applyStats:function(stats,player){
                
                stats.capacity+=3500
            },
            desc:'A heavy-duty backpack.<br><br>+3,500 capacity',
            cost:['5000 honey'],
        },

        canister:{
            
            mesh:function(box,cylinder,sphere){
                
                cylinder(0,-0.15,-0.6,0.4,0.5,11,1.3,1.3,1.3,90,0,0)
                cylinder(0,0.1,-0.6,0.2,0.5,11,0.7,1,1.3,90,0,0)
                cylinder(0,0.3,-0.6,0.333,0.2,11,1.3,1.3,1.3,90,0,0)
            },
            
            applyStats:function(stats,player){
                
                stats.capacity+=10000
                stats.convertRate*=1.3
            },
            desc:'A high-tech container that improves honey conversion speed.<br><br>+10,000 capacity<br>x1.3 convert rate',
            cost:['22000 honey'],
        },

        megaJug:{
            
            mesh:function(box,cylinder,sphere){
                
                cylinder(0,-0.1,-0.7,0.45,0.85,11,0.9*1.4,0.7*1.4,0.4*1.4,90,0,0)
                cylinder(0,-0.1,-0.7,0.451,0.2,11,0,0.45,0,90,0,0)
                sphere(0,-0.1+0.85*0.5,-0.7,0.4*2,2,0,0.4,0)
                cylinder(0,0.6,-0.7,0.1,0.5,5,0,0.5,0,90,0,0)
            },
            
            applyStats:function(stats,player){
                
                stats.capacity+=25000
                stats.convertRate*=1.4
            },
            desc:'A humongous jug!<br><br>+25,000 capacity<br>x1.4 convert rate',
            cost:['50000 honey'],
        },

        compressor:{
            
            mesh:function(box,cylinder,sphere){
                
                cylinder(0.2,-0.1,-0.5,0.2,0.9,10,1.25,1.25,1.25,90,0,0)
                cylinder(-0.2,-0.1,-0.5,0.2,0.9,10,1.25,1.25,1.25,90,0,0)
                sphere(0.2,-0.1+0.9*0.5,-0.5,0.2*2,2,1.25,1.25,1.25)
                sphere(-0.2,-0.1+0.9*0.5,-0.5,0.2*2,2,1.25,1.25,1.25)
                box(0,0,-0.5,0.95,0.3,0.4,false,[0.4,0.4,0.4])
                box(0.35,-0.4,-0.6,0.25,0.5,0.2,[10,-30,0],[0.9,0.9,0.9])
                box(-0.35,-0.4,-0.6,0.25,0.5,0.2,[10,30,0],[0.9,0.9,0.9])
            },
            
            applyStats:function(stats,player){
                
                stats.capacity+=50000
                stats.convertRate*=1.55
            },
            desc:'A machine which packs pollen down to increase storage.<br><br>+50,000 capacity<br>x1.55 convert rate',
            cost:['160000 honey'],
        },

        eliteBarrel:{
            
            mesh:function(box,cylinder,sphere){
                
                cylinder(0,0.4*0.5,-0.6,0.4,0.4,15,0.9*0.5,0.6*0.5,0.3*0.5,90,0,0,0.3)
                cylinder(0,-0.4*0.5,-0.6,0.3,0.4,15,0.9*0.5,0.6*0.5,0.3*0.5,90,0,0,0.4)
                cylinder(0,0,-0.6,0.401,0.1,15,0.1,0.1,0.1,90,0,0)
                cylinder(0,0.2+0.2,-0.6,0.29,0.1,15,0.1,0.1,0.1,90,0,0)
                cylinder(0,-0.2-0.2,-0.6,0.29,0.1,15,0.1,0.1,0.1,90,0,0)
            },
            
            applyStats:function(stats,player){
                
                stats.capacity+=125000
                stats.convertRate*=1.7
            },
            desc:"The world's most advanced barrel.<br><br>+125,000 capacity<br>x1.7 convert rate",
            cost:['650000 honey'],
        },

        portOHive:{
            
            mesh:function(box,cylinder,sphere){
                
                cylinder(0,0,-0.7,0.5,0.15,10,1.5,1.4,1,90,0,0)
                cylinder(0,0.2,-0.675,0.43,0.10,15,1.5,1.4,1,90,0,0)
                cylinder(0,0.35,-0.6,0.25,0.15,10,1.5,1.4,1,90,0,0)
                cylinder(0,-0.2,-0.675,0.43,0.10,15,1.5,1.4,1,90,0,0)
                cylinder(0,-0.35,-0.6,0.25,0.10,15,1.5,1.4,1,90,0,0)
                sphere(0,0,-0.65,0.9,1,1.5,1.4,1)
            },
            
            applyStats:function(stats,player){
                
                stats.capacity+=250000
                stats.convertRate*=2
                stats.instantRedConversion=window.applyPercentage(stats.instantRedConversion,0.05)
                stats.instantBlueConversion=window.applyPercentage(stats.instantBlueConversion,0.05)
                stats.instantWhiteConversion=window.applyPercentage(stats.instantWhiteConversion,0.05)
            },
            desc:'A miniature hive you can wear on your back! Instantly converts some pollen to honey.<br>+250,000 capacity<br>x2 convert rate<br>+5% instant conversion',
            cost:['1250000 honey'],
        },

        redPortOHive:{
            
            mesh:function(box,cylinder,sphere){
                
                cylinder(0,0,-0.7,0.5,0.15,10,1.4,0,0,90,0,0)
                cylinder(0,0.2,-0.675,0.43,0.10,15,1.4,0,0,90,0,0)
                cylinder(0,0.35,-0.6,0.25,0.15,10,1.4,0,0,90,0,0)
                cylinder(0,-0.2,-0.675,0.43,0.10,15,1.4,0,0,90,0,0)
                cylinder(0,-0.35,-0.6,0.25,0.10,15,1.4,0,0,90,0,0)
                sphere(0,0,-0.65,0.9,1,1.4,0,0)
            },
            
            applyStats:function(stats,player){
                
                stats.capacity+=450000
                stats.convertRate*=2.5
                stats.instantRedConversion=window.applyPercentage(stats.instantRedConversion,0.1)
                stats.redPollen*=1.1
                stats.redBeeAttack+=1
            },
            desc:'A Port-O-Hive dipped in shiny red pain. Works best for red bees and red pollen.<br>+450,000 capacity<br>x2.5 convert rate<br>+10% instant red conversion<br>x1.1 red pollen<br>+1 red bee attack',
            cost:['7500000 honey'],
        },

        bluePortOHive:{
            
            mesh:function(box,cylinder,sphere){
                
                cylinder(0,0,-0.7,0.5,0.15,10,0,0,1.4,90,0,0)
                cylinder(0,0.2,-0.675,0.43,0.10,15,0,0,1.4,90,0,0)
                cylinder(0,0.35,-0.6,0.25,0.15,10,0,0,1.4,90,0,0)
                cylinder(0,-0.2,-0.675,0.43,0.10,15,0,0,1.4,90,0,0)
                cylinder(0,-0.35,-0.6,0.25,0.10,15,0,0,1.4,90,0,0)
                sphere(0,0,-0.65,0.9,1,0,0,1.4)
            },
            
            applyStats:function(stats,player){
                
                stats.capacity+=450000
                stats.convertRate*=2.5
                stats.instantBlueConversion=window.applyPercentage(stats.instantBlueConversion,0.1)
                stats.bluePollen*=1.1
                stats.blueBeeAttack+=1
            },
            desc:'A Port-O-Hive dipped in shiny blue paint. Works best for blue bees and blue pollen.<br>+450,000 capacity<br>x2.5 convert rate<br>+10% instant blue conversion<br>x1.1 blue pollen<br>+1 blue bee attack',
            cost:['7500000 honey'],
        },

        porcelainOHive:{
            
            mesh:function(box,cylinder,sphere){
                
                cylinder(0,0,-0.7,0.5,0.15,10,1.3,1.3,1.3,90,0,0)
                cylinder(0,0.2,-0.675,0.43,0.10,15,1.3,1.3,1.3,90,0,0)
                cylinder(0,0.35,-0.6,0.25,0.15,10,1.3,1.3,1.3,90,0,0)
                cylinder(0,-0.2,-0.675,0.43,0.10,15,1.3,1.3,1.3,90,0,0)
                cylinder(0,-0.35,-0.6,0.25,0.10,15,1.3,1.3,1.3,90,0,0)
                sphere(0,0,-0.65,0.9,1,1.3,1.3,1.3)
                box(0.4,0.1,-0.6,0.1,0.2,0.6,[0,25,20],[0,0,1.45])
                box(0.4,-0.1,-0.6,0.1,0.2,0.4,[0,25,-10],[0,0,1.45])
                box(-0.4,0.1,-0.6,0.1,0.2,0.6,[0,-25,20],[1.45,0,0])
                box(-0.4,-0.1,-0.6,0.1,0.2,0.4,[0,-25,-10],[1.45,0,0])
            },
            
            applyStats:function(stats,player){
                
                stats.capacity+=1000000
                stats.convertRate*=3
                stats.instantRedConversion=window.applyPercentage(stats.instantRedConversion,0.1)
                stats.instantBlueConversion=window.applyPercentage(stats.instantBlueConversion,0.1)
                stats.instantWhiteConversion=window.applyPercentage(stats.instantWhiteConversion,0.1)
                stats.whitePollen*=1.5
                stats.bluePollen*=1.1
                stats.redPollen*=1.1
                stats.redBeeAttack+=1
                stats.blueBeeAttack+=1
                stats.whiteBeeAttack+=1
            },
            desc:'A rare and precious Port-O-Hive that boosts white pollen.<br><br>+1,000,000 capacity<br>x3 convert rate<br>+10% instant conversion<br>x1.5 white pollen<br>x1.1 red pollen<br>x1.1 blue pollen<br>+1 bee attack',
            cost:['150000000 honey'],
        },
        
        coconutCanister:{
            
            mesh:function(box,cylinder,sphere){
                
                sphere(0,0,-0.6,1.3,2,0.4,0.2,0)
                sphere(-0.3,0.45,-0.6,0.4,1,0.1,0.05,0)
                sphere(-0.15,0.4,-0.9,0.4,1,0.1,0.05,0)
                sphere(0.05,0.5,-0.6,0.4,1,0.1,0.05,0)
                cylinder(0,0,-0.6,0.3,1.3,10,1.2,1.2,1.2,90,0,90)
                cylinder(-0.425,0,-0.6,0.2,0.57,10,100,0,0,90,0,90)
                cylinder(0.425,0,-0.6,0.2,0.57,10,0,0,100,90,0,90)
            },
            
            applyStats:function(stats,player){
                
                stats.capacity+=3500000
                stats.convertRate*=5
                stats.instantRedConversion=window.applyPercentage(stats.instantRedConversion,0.15)
                stats.instantBlueConversion=window.applyPercentage(stats.instantBlueConversion,0.15)
                stats.instantWhiteConversion=window.applyPercentage(stats.instantWhiteConversion,0.15)
                stats.instantWhiteConversion=window.applyPercentage(stats.instantWhiteConversion,0.1)
                stats.whitePollen*=1.25
                stats.whitePollen*=1.25
                stats.redPollen*=1.25
                stats.bluePollen*=1.25
                stats.whiteBeeAttack+=2
                stats.redBeeAttack+=2
                stats.blueBeeAttack+=2
                stats.defense+=0.1
                stats.honeyAtHive*=1.1
                player.addEffect('inspireCoconutsPassive')
                player.addEffect('emergencyCoconutShieldPassive')
            },
            desc:'A back-mounted coconut that protects you during emergencies.<br><br>+2,500,000 capacity<br>x5 convert rate<br>+15% instant conversion<br>+10% instant white conversion<br>x1.25 pollen<br>x1.25 white pollen<br>+2 bee attack<br>+10% defense<br>x1.1 honey at hive<br>+Passive: Emergengy Coconut Shield<br>+Passive: Inspire Coconuts',
            cost:['20000000000 honey','75 tropicalDrink','100 redExtract','100 blueExtract'],
        }
    },
    
    boots:{
        
        none:{mesh:function(){},applyStats:function(){}},
        
        gummyBoots:{
            
            mesh:function(box,cylinder,sphere){
                
                box(-0.2,-0.5,0.04,0.36,0.15,0.73,false,[0.1*1.75,1*1.75,0.5*1.75])
                box(0.2,-0.5,0.04,0.36,0.15,0.73,false,[0.1*1.75,1*1.75,0.5*1.75])
                box(-0.2,-0.35,0,0.325,0.2,0.6,false,[1*1.75,0.2*1.75,1*1.75])
                box(0.2,-0.35,0,0.325,0.2,0.6,false,[1*1.75,0.2*1.75,1*1.75])
                box(-0.2,-0.35,0.2,0.15,0.05,0.25,false,[0.1*1.75,1*1.75,0.5*1.75])
                box(0.2,-0.35,0.2,0.15,0.05,0.25,false,[0.1*1.75,1*1.75,0.5*1.75])
            },
            
            applyStats:function(stats,player){
                
                stats.movementCollection+=15
                stats.walkSpeed*=1.2
                stats.jumpPower*=1.4
                stats.pollenFromCoconuts*=2
                stats.goo*=1.25
                stats.beeSpeed*=1.3
                stats.honeyFromTokens*=1.25
                stats.redPollen*=1.1
                stats.bluePollen*=1.1
                stats.whitePollen*=1.1
                stats.beeAttack*=1.1
                stats.convertRateAtHive*=2
                player.addEffect('coconutHastePassive')
            },
            desc:'Squishy boots that leave a trail of Goo wherever you go.<br><br>+15 movement collection<br>x1.25 goo<br>x1.3 bee speed<br>x1.25 honey from tokens<br>x1.1 pollen<br>x1.1 bee attack<br>x2 pollen from coconuts<br>x2 convert rate at hive<br>x1.2 movespeed<br>x1.4 jump power<br>+Passive: Goo Trail<br>+Passive: Coconut Haste',
            cost:['50000000000 honey','350 glue','150 glitter','150 redExtract','150 blueExtract'],
        },

        coconutClogs:{
            
            mesh:function(box,cylinder,sphere){
                
                box(-0.2,-0.5,0.04,0.37,0.15,0.74,false,[0,0,1.5])
                box(0.2,-0.5,0.04,0.37,0.15,0.74,false,[1.5,0,0])
                box(-0.2,-0.4,0.04,0.36,0.15,0.73,false,[1.35,1.35,1.35])
                box(0.2,-0.4,0.04,0.36,0.15,0.73,false,[1.35,1.35,1.35])
                box(-0.2,-0.25,0,0.325,0.2,0.6,false,[0.4*1.3,0.3*1.3,0.2*1.3])
                box(0.2,-0.25,0,0.325,0.2,0.6,false,[0.4*1.3,0.3*1.3,0.2*1.3])
                box(-0.2,-0.25,0.2,0.15,0.05,0.25,false,[1.35,1.35,1.35])
                box(0.2,-0.25,0.2,0.15,0.05,0.25,false,[1.35,1.35,1.35])
                
                sphere(0.2,-0.35,0.4,0.25,1,0.4*1.3,0.3*1.3,0.2*1.3)
                sphere(-0.2,-0.35,0.4,0.25,1,0.4*1.3,0.3*1.3,0.2*1.3)

                sphere(-0.2+0.07,-0.3,0.4+0.08,0.07,0,0.4*0.7,0.3*0.7,0.2*0.7)
                sphere(-0.2-0.01,-0.3+0.02,0.4+0.1,0.07,0,0.4*0.7,0.3*0.7,0.2*0.7)
                sphere(-0.2+0.04,-0.3+0.05,0.4+0.02,0.07,0,0.4*0.7,0.3*0.7,0.2*0.7)
                sphere(0.2-0.07,-0.3,0.4+0.08,0.07,0,0.4*0.7,0.3*0.7,0.2*0.7)
                sphere(0.2+0.01,-0.3+0.02,0.4+0.1,0.07,0,0.4*0.7,0.3*0.7,0.2*0.7)
                sphere(0.2-0.04,-0.3+0.05,0.4+0.02,0.07,0,0.4*0.7,0.3*0.7,0.2*0.7)
            },
            
            applyStats:function(stats,player){
                
                stats.movementCollection+=12
                stats.walkSpeed*=1.175
                stats.jumpPower*=1.385
                stats.pollenFromCoconuts*=2
                stats.redPollen*=1.1
                stats.whitePollen*=1.1
                stats.bluePollen*=1.1
                stats.honeyFromTokens*=1.25
                stats.beeAttack*=1.05
                stats.convertRateAtHive*=1.5
                stats.beeSpeed*=1.25
                player.addEffect('coconutHastePassive')
            },
            desc:'Kick around coconuts with this pair of clunky kicks for a surge of speed.<br><br>+12 movement collection<br>x1.25 honey from tokens<br>x1.1 pollen<br>x1.25 bee speed<br>x1.05 bee attack<br>x2 pollen from coconuts<br>x1.5 convert rate at hive<br>x1.175 movespeed<br>x1.385 jump power<br>+Passive: Coconut Haste',
            cost:['5000000000 honey','100 coconut','25 tropicalDrink','35 glue','50 oil'],
        },
        
        mondoBoots:{
            
            mesh:function(box,cylinder,sphere){
                
                box(-0.2,-0.5,0.04,0.36,0.15,0.73,false,[0,0,1.5])
                box(0.2,-0.5,0.04,0.36,0.15,0.73,false,[1.5,0,0])
                box(-0.2,-0.35,0,0.325,0.2,0.6,false,[1.35,1.35,1.35])
                box(0.2,-0.35,0,0.325,0.2,0.6,false,[1.35,1.35,1.35])
                box(-0.2,-0.35,0.2,0.15,0.05,0.25,false,[1.2,1.2,0])
                box(0.2,-0.35,0.2,0.15,0.05,0.25,false,[1.2,1.2,0])
            },
            
            applyStats:function(stats,player){
                
                stats.movementCollection+=10
                stats.walkSpeed*=1.15
                stats.jumpPower*=1.375
                stats.pollenFromBees*=1.25
                stats.beeSpeed*=1.2
            },
            desc:'Practical and stylish boots that aid in the beekeeping process.<br><br>+10 movement collection<br>x1.25 pollen from bees<br>x1.2 bee speed<br>x1.15 movespeed<br>x1.375 jump power',
            cost:['7500000 honey','5 oil','3 redExtract','3 blueExtract'],
        },

        basicBoots:{
            
            mesh:function(box,cylinder,sphere){
                
                box(-0.2,-0.5,0.065,0.325,0.15,0.73,false,[1,1,0.2])
                box(0.2,-0.5,0.065,0.325,0.15,0.73,false,[1,1,0.2])
                box(-0.2,-0.35,0,0.325,0.2,0.6,false,[1,1,0.2])
                box(0.2,-0.35,0,0.325,0.2,0.6,false,[1,1,0.2])
            },
            
            applyStats:function(stats,player){
                
                stats.movementCollection+=1
                stats.walkSpeed*=1.1
                stats.beeSpeed*=1.05
            },
            desc:'Move faster and collect pollen as you walk through flowers!<br><br>+1 movement collection<br>x1.05 bee speed<br>x1.1 movespeed',
            cost:['5000 honey','3 sunflowerSeed','3 blueberry','3 strawberry'],
        },

        hikingBoots:{
            
            mesh:function(box,cylinder,sphere){
                
                box(-0.2,-0.5,0.065,0.325,0.15,0.73,false,[0.7*0.5,0.4*0.5,0.3*0.5])
                box(0.2,-0.5,0.065,0.325,0.15,0.73,false,[0.7*0.5,0.4*0.5,0.3*0.5])
                box(-0.2,-0.3425,0,0.325,0.175,0.6,false,[0.7,0.4,0.3])
                box(0.2,-0.3425,0,0.325,0.175,0.6,false,[0.7,0.4,0.3])
            },
            
            applyStats:function(stats,player){
                
                stats.movementCollection+=5
                stats.walkSpeed*=1.125
                stats.jumpPower*=1.3
                stats.beeSpeed*=1.1
            },
            desc:'A durable pair of boots helpful for traversing the mountain.<br><br>+5 movement collection<br>x1.1 bee speed<br>x1.125 movespeed<br>x1.3 jump power',
            cost:['2000000 honey','20 pineapple','20 blueberry','20 strawberry'],
        },
    },
    
    leftGuard:{
        
        none:{mesh:function(){},applyStats:function(){}},

        lookerGuard:{
            
            mesh:function(box,cylinder,sphere){
                
                box(0.35,0.05,0.1,0.2,0.2,0.2,[0,25,30],[0.2,1.2,0.2])
                box(0.35,0.05,0.1,0.22,0.22,0.1,[0,25,30],[0.1,0.1,0.1])
            },
            
            applyStats:function(stats,player){
                
                stats.capacity+=15000
                stats.criticalChance+=0.03
                stats.criticalPower+=0.25
            },
            desc:'A left shoulder pad crafted by a Looker Bee.<br><br>+15,000 capacity<br>+3% critical chance<br>+25% critical power',
            cost:['100000 honey','5 sunflowerSeed'],
        },

        bomberGuard:{
            
            mesh:function(box,cylinder,sphere){
                
                box(0.35,0.05,0.1,0.2,0.2,0.2,[0,25,30],[1.3,1.3,1.3])
                box(0.35,0.05,0.1,0.22,0.22,0.1,[0,25,30],[0.1,0.1,0.1])
            },
            
            applyStats:function(stats,player){
                
                stats.capacity+=15000
                stats.whitePollen*=1.1
                stats.whiteBombPollen*=1.15
                stats.redBombPollen*=1.15
                stats.blueBombPollen*=1.15
            },
            desc:'A left shoulder pad crafted by a Bomber Bee.<br><br>+15,000 capacity<br>x1.1 white pollen<br>x1.15 bomb pollen',
            cost:['100000 honey','5 pineapple'],
        },
        
        redGuard:{
            
            mesh:function(box,cylinder,sphere){
                
                box(0.35,0.05,0.1,0.2,0.2,0.2,[0,25,30],[1.3,0,0])
                box(0.35,0.05,0.1,0.22,0.22,0.1,[0,25,30],[0.1,0.1,0.1])
            },
            
            applyStats:function(stats,player){
                
                stats.convertRate*=1.1
                stats.blueBeeAttack+=1
                stats.capacity+=25000
                stats.redPollen*=1.1
                stats.instantRedConversion=window.applyPercentage(stats.instantRedConversion,0.03)
            },
            desc:'A durable pad worn on the left shoulder of red beekeepers.<br><br>+25,000 capacity<br>x1.1 red pollen<br>x1.1 convert rate<br>+3% instant red conversion<br>+1 red bee attack',
            cost:['1000000 honey','30 strawberry','1 royalJelly','1 stinger'],
        },

        eliteRedGuard:{
            
            mesh:function(box,cylinder,sphere){
                
                box(0.35,0.05,0.1,0.2,0.2,0.2,[0,25,30],[1.3,0,0])
                box(0.35,0.05,0.1,0.22,0.22,0.1,[0,25,30],[0.1,0.1,0.1])
                box(0.35,0.1,0.1,0.5,0.1,0.05,[0,25,40],[0.1,0.1,0.1])
                box(0.35,0,0.1,0.45,0.1,0.05,[0,25,20],[0.1,0.1,0.1])
            },
            
            applyStats:function(stats,player){
                
                stats.convertRate*=1.15
                stats.redBeeAttack+=1
                stats.capacity+=75000
                stats.redPollen*=1.15
                stats.instantRedConversion=window.applyPercentage(stats.instantRedConversion,0.05)
                stats.criticalChance+=0.05
            },
            desc:'A red guard reserved for the most dedicated red beekeepers.<br><br>+75,000 capacity<br>x1.15 red pollen<br>x1.15 convert rate<br>+5% instant red conversion<br>+5% critical chance<br>+1 red bee attack',
            cost:['3500000 honey','1 redExtract','50 strawberry','3 royalJelly','3 stinger'],
        },

        rileyGuard:{
            
            mesh:function(box,cylinder,sphere){
                
                box(0.35,0.05,0.1,0.2,0.2,0.2,[0,25,30],[1.3,1.3,0])
                box(0.35,0.05,0.1,0.27,0.27,0.1,[0,25,30],[1.3,0,0])
                box(0.35,0.1,0.1,0.5,0.1,0.05,[0,25,40],[1.3,0,0])
                box(0.35,0,0.1,0.45,0.1,0.05,[0,25,20],[1.3,0,0])
            },
            
            applyStats:function(stats,player){
                
                stats.convertRate*=1.25
                stats.redBeeAttack+=2
                stats.capacity+=150000
                stats.redPollen*=1.25
                stats.instantRedConversion=window.applyPercentage(stats.instantRedConversion,0.15)
                stats.criticalChance+=0.08
            },
            desc:'A piece of armor forged by the leader of red bees!<br><br>+150,000 capacity<br>x1.25 red pollen<br>x1.25 convert rate<br>+15% instant red conversion<br>+8% critical chance<br>+2 red bee attack',
            cost:['20000000 honey','5 redExtract','100 strawberry','1 glue','5 stinger'],
        },

        crimsonGuard:{
            
            mesh:function(box,cylinder,sphere){
                
                box(0.35,0.05,0.1,0.2,0.2,0.2,[0,25,30],[1.5,0,0])
                box(0.575,0.2,0,0.7,0.08,0.08,[0,25,36],[1.5,1.5,1.5])
                box(0.5,0.03,0.07,0.4,0.06,0.06,[0,25,-30],[1.5,1.5,1.5])
            },
            
            applyStats:function(stats,player){
                
                stats.convertRate*=1.4
                stats.redPollen*=1.35
                stats.capacity+=300000
                stats.instantRedConversion=window.applyPercentage(stats.instantRedConversion,0.2)
                stats.redBombPollen*=1.5
                stats.redBeeAttack+=3
                stats.whiteBeeAttack+=2
                stats.criticalChance+=0.1
                player.addEffect('focusPulserPassive')
            },
            desc:'A guard bestowed with the heroic power of Crimson Bee - Defender of the red bees.<br><br>+300,000 capacity<br>x1.35 red pollen<br>x1.4 convert rate<br>+20% instant red conversion<br>x1.5 red bomb pollen<br>+3 red bee attack<br>+2 white bee attack<br>+10% critical chance<br>+Passive: Focus Pulser',
            cost:['200000000 honey','100 redExtract','15 stinger','50 oil','25 glitter'],
        },
    },
    
    rightGuard:{
        
        none:{mesh:function(){},applyStats:function(){}},

        hastyGuard:{
            
            mesh:function(box,cylinder,sphere){
                
                box(-0.35,0.05,0.1,0.2,0.2,0.2,[0,-25,-30],[1.2,1.2,1.2])
                box(-0.35,0.05,0.1,0.22,0.22,0.1,[0,-25,-30],[1.3,1.3,0.1])
            },
            
            applyStats:function(stats,player){
                
                stats.capacity+=15000
                stats.walkSpeed*=1.07
                stats.beeSpeed*=1.07
            },
            desc:'A right shoulder pad crafted by a Hasty Bee.<br><br>+15,000 capacity<br>x1.07 movespeed<br>x1.07 bee speed',
            cost:['100000 honey','1 moonCharm'],
        },

        braveGuard:{
            
            mesh:function(box,cylinder,sphere){
                
                box(-0.35,0.05,0.1,0.2,0.2,0.2,[0,-25,-30],[0.7,0.7,0.7])
                box(-0.35,0.05,0.1,0.22,0.22,0.1,[0,-25,-30],[1.2,1.2,1.2])
            },
            
            applyStats:function(stats,player){
                
                stats.capacity+=15000
                stats.whitePollen*=1.1
                stats.whiteBeeAttack+=1
            },
            desc:'A right shoulder pad crafted by a Brave Bee.<br><br>+15,000 capacity<br>x1.1 white pollen<br>+1 white bee attack',
            cost:['100000 honey','1 stinger'],
        },

        blueGuard:{
            
            mesh:function(box,cylinder,sphere){
                
                box(-0.35,0.05,0.1,0.2,0.2,0.2,[0,-25,-30],[0,0,1.3])
                box(-0.35,0.05,0.1,0.22,0.22,0.1,[0,-25,-30],[0.1,0.1,0.1])
            },
            
            applyStats:function(stats,player){
                
                stats.convertRate*=1.1
                stats.blueBeeAttack+=1
                stats.capacity+=25000
                stats.bluePollen*=1.1
                stats.instantBlueConversion=window.applyPercentage(stats.instantBlueConversion,0.03)
            },
            desc:'A durable pad worn on the right shoulder of blue beekeepers.<br><br>+25,000 capacity<br>x1.1 blue pollen<br>x1.1 convert rate<br>+3% instant blue conversion<br>+1 blue bee attack',
            cost:['1000000 honey','30 blueberry','1 royalJelly','1 moonCharm'],
        },

        eliteBlueGuard:{
            
            mesh:function(box,cylinder,sphere){
                
                box(-0.35,0.05,0.1,0.2,0.2,0.2,[0,-25,-30],[0,0,1.3])
                box(-0.35,0.05,0.1,0.22,0.22,0.1,[0,-25,-30],[0.1,0.1,0.1])
                box(-0.35,0.1,0.1,0.5,0.1,0.05,[0,-25,-40],[0.1,0.1,0.1])
                box(-0.35,0,0.1,0.45,0.1,0.05,[0,-25,-20],[0.1,0.1,0.1])
            },
            
            applyStats:function(stats,player){
                
                stats.convertRate*=1.15
                stats.blueBeeAttack+=1
                stats.capacity+=75000
                stats.bluePollen*=1.15
                stats.instantBlueConversion=window.applyPercentage(stats.instantBlueConversion,0.05)
                stats.criticalPower+=0.5
            },
            desc:'A blue guard reserved for the most dedicated blue beekeepers.<br><br>+75,000 capacity<br>x1.15 blue pollen<br>x1.15 convert rate<br>+5% instant blue conversion<br>+50% critical power<br>+1 blue bee attack',
            cost:['3500000 honey','1 blueExtract','50 blueberry','3 royalJelly','3 moonCharm'],
        },

        buckoGuard:{
            
            mesh:function(box,cylinder,sphere){
                
                box(-0.35,0.05,0.1,0.2,0.2,0.2,[0,-25,-30],[1.3,1.3,0])
                box(-0.35,0.05,0.1,0.27,0.27,0.1,[0,-25,-30],[0,0,1.3])
                box(-0.35,0.1,0.1,0.5,0.1,0.05,[0,-25,-40],[0,0,1.3])
                box(-0.35,0,0.1,0.45,0.1,0.05,[0,-25,-20],[0,0,1.3])
            },
            
            applyStats:function(stats,player){
                
                stats.convertRate*=1.25
                stats.blueBeeAttack+=1
                stats.capacity+=150000
                stats.bluePollen*=1.25 
                stats.instantBlueConversion=window.applyPercentage(stats.instantBlueConversion,0.1)
                stats.criticalPower+=0.75
            },
            desc:'A piece of armor forged by the leader of blue bees!<br><br>+150,000 capacity<br>x1.25 blue pollen<br>x1.25 convert rate<br>+10% instant blue conversion<br>+75% critical power<br>+2 blue bee attack',
            cost:['20000000 honey','5 blueExtract','100 blueberry','1 glue','5 moonCharm'],
        },

        cobaltGuard:{
            
            mesh:function(box,cylinder,sphere){
                
                box(-0.35,0.05,0.1,0.2,0.2,0.2,[0,-25,-30],[0,0,1.5])
                box(-0.575,0.2,0,0.7,0.08,0.08,[0,-25,-36],[1.5,1.5,1.5])
                box(-0.5,0.03,0.07,0.4,0.06,0.06,[0,-25,30],[1.5,1.5,1.5])
            },
            
            applyStats:function(stats,player){
                
                stats.convertRate*=1.4
                stats.capacity+=300000
                stats.bluePollen*=1.35
                stats.instantBlueConversion=window.applyPercentage(stats.instantBlueConversion,0.2)
                stats.blueBombPollen*=1.5
                stats.blueBeeAttack+=3
                stats.whiteBeeAttack+=2
                stats.criticalPower+=1
                player.addEffect('hastePulserPassive')
            },
            desc:'A guard bestowed with the heroic power of Cobalt Bee - Defender of the blue bees.<br><br>+300,000 capacity<br>x1.35 blue pollen<br>x1.4 convert rate<br>+20% instant blue conversion<br>x1.5 blue bomb pollen<br>+3 blue bee attack<br>+2 white bee attack<br>+100% critical power<br>+Passive: Haste Pulser',
            cost:['200000000 honey','100 blueExtract','15 stinger','50 enzymes','25 glitter'],
        },
    }
}
})()