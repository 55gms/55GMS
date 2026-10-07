
window.mulberry32=function(a){

    let ret=function(){

        let t=a+=0x6D2B79F5
        t=Math.imul(t^t>>>15,t|1)
        t^=t+Math.imul(t^t>>>7,t|61)
        return ((t^t>>>14)>>>0)/4294967296
    }

    ret()
    ret()
    ret()
    ret()
    ret()
    ret()
    ret()
    ret()
    ret()
    ret()
    ret()
    ret()
    ret()
    ret()
    ret()
    ret()
    ret()
    ret()
    ret()
    ret()
    ret()
    ret()
    ret()
    ret()

    return ret
}

window.dialogue_blackBear=function(player,items){
    
    let addCommas=(s)=>{for(let i=s.length-3;i>0;i-=3){s=s.substring(0,i)+','+s.substr(i,s.length)}return s},doGrammar=(s)=>{let str=s.slice(),_s='';for(let i in str){if(str[i].toLowerCase()!==str[i]){_s=_s+' '+str[i]}else{_s=_s+str[i]}}return _s[0].toUpperCase()+_s.substring(1,_s.length)},addReward=(arr)=>{
        
        for(let i in player.quests){
            
            if(player.quests[i].NPC==='blackBear'&&!player.quests[i].isBeesmasQuest) player.quests.splice(i,1)
            
        }
        
        for(let i in arr){
            
            if(arr[i][0]==='honey'){
                
                player.honey+=arr[i][1]
                
            } else {
                
                items[arr[i][0]].amount+=arr[i][1]
            }
            
            player.addMessage('+'+addCommas(arr[i][1]+'')+' '+doGrammar(arr[i][0])+' (from Black Bear)')
        }
        
        player.updateInventory()
    }

    return ["Hi, I'm Black Bear, and I'm a bear(if you couldn't tell)! I give you quests, rewards, and information about the game so you can progress!","Here's your first quest! Once you're done, come back and we'll talk!",function(){player.addQuest('Sunflower Start',[['pollenFromSunflowerField',100]],'blackBear');},"Wow! You did it! Now here's your rewards:",function(){addReward([['honey',200]])},"With your brand-new honey, go buy a basic egg from the shop near the dandelion field over there!","Hatch it to get more bees and increase your honey making!","Here's your next quest:",function(){player.addQuest('Dandelion Deed',[['pollenFromDandelionField',200]],'blackBear');},"Great! Now here's more honey and a Royal Jelly! Use the jelly on a basic bee to transform it into a better type of bee!",function(){addReward([['honey',250],['royalJelly',1]])},"Here's another quest:",function(){player.addQuest('Pollen Fetcher',[['pollen',500]],'blackBear');},"Cool! Here's a lot more honey:",function(){addReward([['honey',400]])},"It's time to upgrade your tools! Go into the green shop over there, and buy a new collector or backpack! After you do that, complete this quest:",function(){player.addQuest('Red Request',[['redPollen',500]],'blackBear');},"Cool! Try buying more bee eggs using honey when you can afford them!",function(){addReward([['honey',800],['royalJelly',1],['sunflowerSeed',1]])},"Why not try exploring and talking to other bears while completing this quest?",function(){player.addQuest('Hiding in the Blue',[['bluePollen',900]],'blackBear');},"Awesome! Here's more Royal Jelly and honey!",function(){addReward([['honey',900],['royalJelly',1],['blueberry',1]])},"Remember, keep getting more bees and using Royal Jelly on them. Try to not use Royal Jelly on the transformed bees, and make your basic bees better first!","If you have more than 5 bees already, try going into the 5 bee zone! It has many more flowers, but beware of the monsters! Anyways, here's a new quest:",function(){player.addQuest('Variety Fetcher',[['bluePollen',1000],['redPollen',1000],['whitePollen',1000]],'blackBear');},"Nice! Here's your first special reward, a Silver Egg!",function(){addReward([['honey',1150],['silverEgg',1],['gumdrops',3]])},"You're done with the beginner quests! Now, you can complete questlines to recieve special rewards!","This is the start of the Gold Egg questlines! After 3 more quests, you will recieve a new type of egg, hatching improved bees! Ready for more?",function(){player.addQuest('Bamboo Boogie',[['pollenFromBambooField',2500]],'blackBear');},"Great! Many of the special bees have better stats and abilities! They can boost you pollen collection by large amounts.","Here are your rewards:",function(){addReward([['honey',1250],['royalJelly',1],['treat',1]])},"You have 2 more quest to complete before earning the Gold Egg! Here's the next quest:",function(){player.addQuest('Cobweb Sweeper',[['pollenFromSpiderField',3250]],'blackBear');},"Great job! Keep unlocking more gear and bees!",function(){addReward([['honey',2000],['sunflowerSeed',3],['pineapple',3]])},"Many fields have different colors of flowers, and those give different pollen types. Bees perform better in their own color's field!","Try collecting more red pollen:",function(){player.addQuest('Red Request 2',[['redPollen',4000]],'blackBear');},"Epic! It's good to have a nice with different types of bees to better collect pollen from all the fields!",function(){addReward([['honey',2500],['strawberry',1]])},"There are many rarities of bees, like: common, rare, epic, legendary, and mythic! Legendary and mythic bees are some of the rarest, and only good beekeepers like me own them.","Anyways, it's your last quest until the prized Gold Egg! Get to work!",function(){player.addQuest('Red + Blue = Gold',[['redPollen',6000],['bluePollen',6000]],'blackBear');},"Wow! Not a lot of players are able to get their hands on the Gold Egg, but you're special! Hatch it for an epic bee!",function(){addReward([['honey',4000],['goldEgg',1],['royalJelly',1]])},"It's the start of a new questline: The Diamond Egg!","Remember the special legendary bees I showed you? Hatch one with the Diamond Egg! Complete 7 more quests to discover a new legendary bee!",function(){player.addQuest('Lucky Landscaping',[['pollenFromCloverField',10000]],'blackBear');},"Good job! Here's a lot of honey!",function(){addReward([['honey',7500],['moonCharm',3]])},"While progressing through the game, make sure to keep upgrading your tools and hive!","If you haven't, hatch 10 bees to explore the 10 bee zone. Discover new fields and shops around the map!","Also, remember to complete other bear's quests, too. They may give even better rewards than mine!",function(){player.addQuest('Pineapple Picking',[['pollenFromPineapplePatch',15000]],'blackBear');},"Cool! Keep expanding and improving your hive and gear for more honey!",function(){addReward([['honey',10000],['royalJelly',1],['ticket',1]])},"5 more quests to go until the Diamond Egg! Here's the next one:",function(){player.addQuest('Azure Adventure',[['bluePollen',17500]],'blackBear');},"Good! From now on, the quests will ramp up in difficulty, but the rewards will be worth it!",function(){addReward([['honey',15000],['blueExtract',1]])},'4 more quests until the Diamond Egg!',function(){player.addQuest('Blue Mushrooms',[['pollenFromBlueFlowerField',20000],['pollenFromMushroomField',20000]],'blackBear');},"Great! Was that hard? 3 more quests to the Diamond Egg!",function(){addReward([['honey',30000],['treat',5]])},"Have you been progressing through the game? If so, you should have at least 15 bees by now!","As you get more bees, the fields you get access to have better flowers and give more pollen. But beware! In those fields live dangerous monsters!",function(){player.addQuest('The 15 Bee Zone',[['pollenFromCactusField',25000],['pollenFromPumpkinPatch',25000],['pollenFromPineTreeForest',25000],['pollenFromRoseField',25000]],'blackBear');},"Good job! Those scary monsters stand no chance!",function(){addReward([['honey',50000],['royalJelly',1],['stinger',1]])},"Just 2 more quests until the legendary Diamond Egg!",function(){player.addQuest('Collecting Cliffside',[['pollenFromStrawberryField',40000],['pollenFromSpiderField',40000],['pollenFromBambooField',40000]],'blackBear');},"Noice! Here is some more honey to help you prepare for the next quest!",function(){addReward([['honey',100000],['microConverter',1],['gumdrops',3]])},"Ready for the Diamond Egg? Collect 75,000 pollen of all colors!",function(){player.addQuest('Quest of Legends',[['redPollen',75000],['bluePollen',75000],['whitePollen',75000]],'blackBear');},"Wow! I didn't think you'll make it this far! You are one of the best players in this game!","Here's the legendary Diamond Egg I promised:",function(){addReward([['honey',250000],['diamondEgg',1],['treat',100],['ticket',3]])},"Have you ever heard of gifted bees? They are special versions of bees with better stats!","Having a gifted bee in your hive also applies a special 'Gifted Hive Bonus' that gives you buffs!","They don't stack with multiple gifted bees, but some are very good! It's good to have many different types of gifted bees in your hive.","Now's your chance to earn a gifted bee! If you didn't get lucky and get one, you can transform one with a Star Jelly!","Complete the next 6 quests for my Star Jelly!",function(){player.addQuest('Pink Pineapples',[['redPollen',100000],['pollenFromPineapplePatch',100000]],'blackBear');},"Good! Now the rewards and quests requirements go much higher!",function(){addReward([['honey',300000],['enzymes',1]])},"Ready? 5 more quests until your Star Jelly!",function(){player.addQuest('White As Snow',[['whitePollen',1000000],['pollenFromPumpkinPatch',400000],['pollenFromPineapplePatch',300000],['pollenFromSpiderField',200000],['pollenFromDandelionField',100000]],'blackBear');},"Nice job!",function(){addReward([['honey',500000],['royalJelly',1],['glue',1],['magicBean',1]])},"How many bees do you have now? Get 25 bees to unlock the 25 bee zone!","4 more quests for the Star Jelly!",function(){player.addQuest('Blinding Sunlight',[['pollenFromMountainTopField',700000],['pollenFromCloverField',400000],['pollenFromSunflowerField',300000]],'blackBear');},"Awesome! The mountain top field gives so much more pollen and has bigger flowers!",function(){addReward([['honey',750000],['oil',1],['treat',50]])},"If you've been in the stump field, you've probably seen the Stump Snail boss!","While your bees try to defeat it, collect 100,000 pollen!",function(){player.addQuest('Solo Stump',[['pollenFromStumpField',200000]],'blackBear');},"Cool! Was it hard to collect pollen without your bee's help?",function(){addReward([['honey',900000],['stinger',1],['ticket',1],['jellyBeans',1]])},"As you progress through the game, make sure to use your resources wisely and craft better gear.","2 more quests until I give you my Star Jelly!!!",function(){player.addQuest('Blissfully Blue',[['bluePollen',1250000],['pollenFromPineTreeForest',700000],['pollenFromBambooField',450000],['pollenFromBlueFlowerField',200000]],'blackBear');},"Nice! Here are extra rewards for the last quest in the Star Jelly questlines.",function(){addReward([['honey',1000000],['blueExtract',1],['glitter',1],['royalJelly',1],['blueberry',50],['magicBean',1]])},
    "After this quest, you'll get the rare Star Jelly!","But beware, this quest is the most difficult yet!",function(){player.addQuest('To My Star',[['whitePollen',4000000],['redPollen',3000000],['pollenFromRoseField',1000000],['pollenFromCactusField',800000],['pollenFromPumpkinPatch',800000],['pollenFromPineapplePatch',600000],['pollenFromStrawberryField',500000]],'blackBear');},"I can't believe you've made it this far! Here's the Star Jelly, as promised:",function(){addReward([['honey',1500000],['starJelly',1],['royalJelly',1],['treat',35],['glitter',1],['microConverter',1]])},"Next up: The Mythic Egg questline! It rewards the magical Mythic Egg, which will hatch into the rarest, strongest, and most powerful of bees to exist!","The difficulty will start to pick up soon! You have 12 more difficult quests to go through if you want a mythic bee!",function(){player.addQuest('Bamboo Boogie 2: Bamboo Boogaloo',[['pollenFromBambooField',7500000]],'blackBear');},"You did it!",function(){addReward([['honey',5000000]])},"11 quests until the Mythic Egg!",function(){player.addQuest('Rocky Red Mountain',[['redPollen',10000000],['pollenFromMountainTopField',4000000],['pollenFromDandelionField',1000000]],'blackBear');},"Epic! Now that the quests are ramping up, I'll give you better rewards!",function(){addReward([['honey',8000000],['royalJelly',1],['redExtract',1]])},"10 more quests to go!",function(){player.addQuest("Can't Without Ants",[['pollen',10000000],['pollenFromAntField',1000000]],'blackBear');},"Cool!",function(){addReward([['honey',10000000],['stinger',1],['magicBean',1]])},"Did you know that this Mythic Egg questline is also the last questline from me? Just 9 more quests and you're done!",function(){player.addQuest('Rare Red Clover',[['pollenFromStrawberryField',6000000],['pollenFromCloverField',5000000],['pollenFromMushroomField',4000000]],'blackBear');},"Awesome! Make sure to upgrade your gear whenever you can!",function(){addReward([['honey',12500000],['strawberry',35],['jellyBeans',3]])},"As you continue to level up and upgrade your gear, make sure to keep buying now hive slots to expand your hive!","This quest requires pollen from the 35 bee zone!",function(){player.addQuest('Mountain Mix',[['pollenFromMountainTopField',10000000],['pollenFromPepperPatch',9000000],['pollenFromCactusField',7500000],['pollenFromSpiderField',6000000]],'blackBear');},"Terrific!",function(){addReward([['honey',17500000],['royalJelly',3],['coconut',15],['redExtract',1],['blueExtract',1],['gumdrops',5]])},"7 more quests to go!",function(){player.addQuest('Getting Stumped',[['redPollen',15000000],['pollenFromStumpField',5000000]],'blackBear');},"Magnificent!",function(){addReward([['honey',25000000],['sunflowerSeed',50],['stinger',1],['treat',175],['moonCharm',10]])},"6 more quests!",function(){player.addQuest('Da Ba Dee',[['bluePollen',40000000],['pollenFromPineTreeForest',15000000]],'blackBear');},"Amazing!",function(){addReward([['honey',35000000],['blueberry',10],['blueExtract',1],['microConverter',3]])},"Have you been leveling up your bees? If your bees are low level, you'll have trouble defeating bosses around the map.","Prepare you and your bees for my final quests coming soon! hehe >:D","These final 5 quests are going to be very hard, so be ready!",function(){player.addQuest('Capsaicin Collector',[['pollenFromPepperPatch',40000000],['pollenFromSpiderField',20000000],['pollenFromDandelionField',20000000]],'blackBear');},"I can't believe it! You made the quests look so easy!","Here are better rewards:",function(){addReward([['honey',50000000],['redExtract',1],['pineapple',10]])},"Just 4 quests left!",function(){player.addQuest('Smorgasborg',[['pollenFromRoseField',40000000],['pollenFromPineTreeForest',40000000],['pollenFromPineapplePatch',40000000],['pollenFromBambooField',40000000],['pollenFromStrawberryField',40000000],['pollenFromSunflowerField',40000000]],'blackBear');},"Excellent!",function(){addReward([['honey',100000000],['royalJelly',5],['pineapple',75],['tropicalDrink',3]])},"These are the last 3 quests, so prepare for them, cuz they won't be easy :)",function(){player.addQuest('All-Whitey Then',[['whitePollen',250000000],['pollenFromPumpkinPatch',100000000],['pollenFromSpiderField',75000000],['pollenFromDandelionField',30000000]],'blackBear');},"How did you manage do to that??? I made sure to make them impossible!!!","Welp here are your rewards:",function(){addReward([['honey',300000000],['oil',3],['glue',3],['treat',25],['jellyBeans',3]])},"This is the second to last quest you'll have to deal with!","Try collecting pollen while being attacked!",function(){player.addQuest('Boss Battles',[['pollenFromStumpField',75000000],['pollenFromCoconutField',50000000],['pollenFromAntField',20000000]],'blackBear');},"Woah! You're so close to the Mythic Egg!","Here is some stuffs to help with the quest!",function(){addReward([['honey',200000000],['stinger',3],['glue',2],['royalJelly',2],['glitter',1],['treat',250]])},"This is it...the final quest. Complete this big task and you'll earn the rare and mysterious Mythic Egg!",function(){player.addQuest('Myth in the Making',[['redPollen',1000000000],['bluePollen',1000000000],['pollenFromSunflowerField',50000000],['pollenFromDandelionField',50000000],['pollenFromMushroomField',50000000],['pollenFromBlueFlowerField',50000000],['pollenFromCloverField',50000000],['pollenFromStrawberryField',50000000],['pollenFromSpiderField',50000000],['pollenFromBambooField',50000000],['pollenFromPineapplePatch',50000000],['pollenFromRoseField',50000000],['pollenFromPineTreeForest',50000000],['pollenFromCactusField',50000000],['pollenFromPumpkinPatch',50000000],['pollenFromMountainTopField',50000000],['pollenFromCoconutField',50000000],['pollenFromPepperPatch',50000000]],'blackBear');},"WOW! YOU DID IT!","Here's the ultimate Mythic Egg!",function(){addReward([['honey',1000000000],['mythicEgg',1],['royalJelly',5],['glitter',1],['glue',1],['treat',1000],['redExtract',1],['blueExtract',1],['enzymes',1],['oil',1]])},"You have completed my final quest!","You've become such a good beekeeper and progressed so far!","Goodbye!"]
  
}

window.dialogue_blackBear_beesmas=function(player,items){
    
    let addCommas=(s)=>{for(let i=s.length-3;i>0;i-=3){s=s.substring(0,i)+','+s.substr(i,s.length)}return s},doGrammar=(s)=>{let str=s.slice(),_s='';for(let i in str){if(str[i].toLowerCase()!==str[i]){_s=_s+' '+str[i]}else{_s=_s+str[i]}}return _s[0].toUpperCase()+_s.substring(1,_s.length)},addReward=(arr)=>{
        
        for(let i in player.quests){
            
            if(player.quests[i].NPC==='blackBear'&&player.quests[i].isBeesmasQuest) player.quests.splice(i,1)
            
        }
        
        for(let i in arr){
            
            if(arr[i][0]==='honey'){
                
                player.honey+=arr[i][1]
                
            } else {
                
                items[arr[i][0]].amount+=arr[i][1]
            }
            
            player.addMessage('+'+addCommas(arr[i][1]+'')+' '+doGrammar(arr[i][0])+' (from Black Bear)')
        }
        
        player.updateInventory()
    }

    return ['Hey there!',"It\'s that wonderful time of the year again! The joy of Beesmas has struck down on this mountain!","Take a look at my wonderful Beesmas masterpiece!FOCUSON[31,6,-3.5,1.2,-0.25]","It's lacking quite a few beautifully sweet honey droplets.","Help me collect ingredients to finish my Honey Wreath, and I'll be sure to give you festive Beesmas rewards!FOCUSON",'While you help me finish the Honey Wreath, be sure to also be working on my main questline!',"If you don't already have one of my quests, you can claim it after I give you my Beesmas quest.","During the Beesmas season, you'll find some snowflakes falling through the air. Find a big chunky one which will drop a snowflake token when it lands. Collect it!",function(){player.addQuest("Black Bear's Honey Wreath",[['pollenFromMushroomField',250],['pollenFromBlueFlowerField',250],['snowflakeTokens',1]],'blackBear*');},"Great work out there!","Now I can finally complete my Honey Wreath!FOCUSON[31,6,-3.5,1.2,-0.25]","*magical whooshing*COMPLETEMACHINE","WONDERFUL!! You can use the Honey Wreath once every 15 minutes to convert all the pollen inside your bag into much more valueable Honey Tokens!","Here are your rewards!FOCUSON",function(){addReward([['honey',1000],['snowflake',5],['microConverter',1]])},"Thanks for all your help with my Honey Wreath! Be sure to help the other bears on this mountain with their Beesmas adventures!"]
}



window.dialogue_polarBear=function(player,items,NPCs){

    let addCommas=(s)=>{for(let i=s.length-3;i>0;i-=3){s=s.substring(0,i)+','+s.substr(i,s.length)}return s},doGrammar=(s)=>{let str=s.slice(),_s='';for(let i in str){if(str[i].toLowerCase()!==str[i]){_s=_s+' '+str[i]}else{_s=_s+str[i]}}return _s[0].toUpperCase()+_s.substring(1,_s.length)},addReward=(arr)=>{
        
        player.addEffect('polarPower')
        
        for(let i in player.quests){
            
            if(player.quests[i].NPC==='polarBear') player.quests.splice(i,1)
            
        }
        
        for(let i in arr){
            
            if(arr[i][0]==='honey'){
                
                player.honey+=arr[i][1]
                
            } else {
                
                items[arr[i][0]].amount+=arr[i][1]
            }
            
            player.addMessage('+'+addCommas(arr[i][1]+'')+' '+doGrammar(arr[i][0])+' (from Polar Bear)')
        }
        
        player.updateInventory()
        NPCs.polarBear.portionsDone++
    }

    return function(diff){

        let rand=mulberry32(NPCs.polarBear.seed+diff)

        let rew=[['honey',100000+((rand()*12-2)|0)*10000],['treat',10+(rand()*4|0)*5]]
        
        if(rand()<0.5) rew.push(['ticket',1])
        if(rand()<0.2) rew.push([['glitter','magicBean','oil','enzymes','glue'][(rand()*5)|0],1])

        return ["Hey there! You hungry? If you collect the ingredients, I'll cook us up something good.","So good it'll permanently increase the maximum energy of your bees by 5%! I'll even throw in some honey for dessert!","Now, if you'll excuse me, I'm going back to coding. I don't do this in the real game, but I heard polar bears are nerds at coding.",

            function(){

                switch((player.discoveredBees.length>24&&rand()<0.5?rand()*8:rand()*7+1)|0){

                    case 0:

                        player.addQuest('Keep Calm and Eat Chicken',[['mondoChick',1],['moonCharmTokens',3],['moonCharm',5]],'polarBear')
                        rew.push(['moonCharm',5])
                        rew.push(['neonberry',1])
                        
                    break;
                    
                    case 1:

                        player.addQuest('Choco Milk Shake',[['pollenFromSpiderField',160000],['werewolf',1]],'polarBear')
                        rew.push(['gumdrops',3])
                        
                    break;
                    
                    case 2:
                        
                        player.addQuest('Microwaved Sweets',[['redPollen',120000],['pollenFromPineTreeForest',80000],['gumdropsTokens',3]],'polarBear')
                        rew.push(['jellyBeans',1])
                        
                    break;
                    
                    case 3:

                        player.addQuest('Spiky Stew',[['pollenFromCactusField',100000],['whitePollen',75000]],'polarBear')
                        
                    break;
                    
                    case 4:

                        player.addQuest('Pumpkin Pie',[['pollenFromPumpkinPatch',150000],['pollenFromSunflowerField',60000],['ladybug',1]],'polarBear')
                        
                    break;
                    
                    case 5:

                        player.addQuest('Beetle Brew',[['pollenFromPineapplePatch',120000],['pollenFromDandelionField',50000],['ladybug',1],['rhinoBeetle',1]],'polarBear')
                        
                    break;
                    
                    case 6:

                        player.addQuest('Candied Beetles',[['pollenFromStrawberryField',150000],['pollenFromBlueFlowerField',25000],['rhinoBeetle',2]],'polarBear')
                        
                    break;
                    
                    case 7:

                        player.addQuest('Scorpion Salad',[['pollenFromRoseField',300000],['scorpion',1]],'polarBear')
                        
                    break;
                }
            }

        ,"That's all the ingredients I need! Ok, let me whip something up...","...(chop)...(chop)... ...(sizzle)...","A dash of honey... ...(stir)...","All done! Enjoy!","Well, I'm always ready to eat. I'll be waiting when you're ready for more cooking!",function(){addReward(rew)}
        
        ]
    }

    return 
}

window.dialogue_polarBear_beesmas=function(player,items){
    
    let addCommas=(s)=>{for(let i=s.length-3;i>0;i-=3){s=s.substring(0,i)+','+s.substr(i,s.length)}return s},doGrammar=(s)=>{let str=s.slice(),_s='';for(let i in str){if(str[i].toLowerCase()!==str[i]){_s=_s+' '+str[i]}else{_s=_s+str[i]}}return _s[0].toUpperCase()+_s.substring(1,_s.length)},addReward=(arr)=>{
        
        for(let i in player.quests){
            
            if(player.quests[i].NPC==='polarBear'&&player.quests[i].isBeesmasQuest) player.quests.splice(i,1)
            
        }
        
        for(let i in arr){
            
            if(arr[i][0]==='honey'){
                
                player.honey+=arr[i][1]
                
            } else {
                
                items[arr[i][0]].amount+=arr[i][1]
            }
            
            player.addMessage('+'+addCommas(arr[i][1]+'')+' '+doGrammar(arr[i][0])+' (from Polar Bear)')
        }
        
        player.updateInventory()
    }

    return ["It's that time of the year again!! Yay!!!!!","In an attempt to *not* die to starvation, I've created a scrumptious meal that'll impress even Bordan Hamsey.","Nearby, you'll see...an empty plate. Very exciting.FOCUSON[2.4,25.5,68,3.8,-0.5]","Help me prepare my ingredients to assemble the Beesmas feast, and I'll let you and your bees have a little nibble!","To work!",function(){player.addQuest("Polar Bear's Beesmas Feast",[['whitePollen',1000000],['pollenFromPumpkinPatch',500000],['pollenFromStrawberryField',250000],['treatTokens',15],['honeysuckle',5]],'polarBear*');},"Great!","*chop chop squish squish*FOCUSON[2.4,25.5,68,3.8,-0.5]","Look! It's now actually food!COMPLETEMACHINE","I think I really cooked with this one.","Come to my little icy home for a taste every 90 minutes. The feast will give you some treats and help your bees bond, increasing based on your Polar Power.FOCUSON","Now, have some more items!",function(){addReward([['honey',1500000],['honeysuckle',10],['ticket',5],['bitterberry',5],['gingerbreadBear',3],['hardWax',1]])},"I'm always standing here! Continue doing my quests for even more Polar Power!","Have a great Beesmas! Happy holidays!!! <3"]
}

window.dialogue_brownBear=function(player,items,NPCs){
    
    let addCommas=(s)=>{for(let i=s.length-3;i>0;i-=3){s=s.substring(0,i)+','+s.substr(i,s.length)}return s},doGrammar=(s)=>{let str=s.slice(),_s='';for(let i in str){if(str[i].toLowerCase()!==str[i]){_s=_s+' '+str[i]}else{_s=_s+str[i]}}return _s[0].toUpperCase()+_s.substring(1,_s.length)},addReward=(arr)=>{
        
        for(let i in player.quests){
            
            if(player.quests[i].NPC==='brownBear') player.quests.splice(i,1)
            
        }
        
        for(let i in arr){
            
            if(arr[i][0]==='honey'){
                
                player.honey+=arr[i][1]
                
            } else {
                
                items[arr[i][0]].amount+=arr[i][1]
            }
            
            player.addMessage('+'+addCommas(arr[i][1]+'')+' '+doGrammar(arr[i][0])+' (from Brown Bear)')
        }
        
        player.updateInventory()
        NPCs.brownBear.portionsDone++
    }
    
    return function(diff){

        let rand=mulberry32(NPCs.brownBear.seed+diff)
        
        let am=Math.floor(4.75*diff*diff*diff*diff+500)
        
        let rew=[['honey',Math.floor(am*1.35)]]
        
        if(!(diff%2)) rew.push(['royalJelly',1])
        
        if(diff){
            
            if(!(diff%3)) rew.push(['treat',3])
            
            if(!(diff%4)) rew.push(['ticket',1])
            
            if(!(diff%5)) rew.push(['fieldDice',1])
            
            if(!(diff%6)) rew.push(['gumdrops',2])
            
            if(!(diff%7)) rew.push(['enzymes',1])
            
            if(!(diff%8)) rew.push(['oil',1])
            
            if(diff===15) rew.push(['silverEgg',1])
            
            if(diff===25) rew.push(['bearBeeEgg',1])

            if(diff===30) rew.push(['goldEgg',1])
            
            if(diff===50) rew.push(['diamondEgg',1])
            
            if(diff===75) rew.push(['mythicEgg',1])

            if(diff===125) rew.push(['giftedSilverEgg',1])
            
            if(diff===150) rew.push(['giftedGoldEgg',1])

            if(diff===175) rew.push(['giftedDiamondEgg',1])

            if(diff===225) rew.push(['giftedMythicEgg',1])
            
            if(!(diff%100)) rew.push(['starEgg',1])
        }
        
        return ["Welcome! I'm Brown Bear!","Ready for one of my repeatable quests? You've completed "+diff+' quests.',"I'll give honey and rewards for every quest, but special prizes at certain milestones!","Obtain a Bear Bee egg at 25 quests!","Check your quest menu to see what you need.",
    
            function(){
                
                let name='',req=[]
                
                let types=['pollenFromSunflowerField','pollenFromDandelionField','pollenFromMushroomField','pollenFromBlueFlowerField','pollenFromCloverField']

                if(player.discoveredBees.length>=3) types.push('pollenFromSpiderField','pollenFromStrawberryField','pollenFromBambooField')

                if(player.discoveredBees.length>=7) types.push('pollenFromPineapplePatch','pollenFromStumpField')
                
                if(player.discoveredBees.length>=12) types.push('pollenFromCactusField','pollenFromPumpkinPatch','pollenFromPineTreeForest','pollenFromRoseField')

                if(player.discoveredBees.length>=17) types.push('pollenFromMountainTopField')
                
                if(player.discoveredBees.length>=29) types.push('pollenFromPepperPatch','pollenFromCoconutField')

                
                if(rand()<0.5){
                    
                    let n=['redPollen','bluePollen','whitePollen'][(rand()*3)|0]
                    req.push([n,Math.floor(am*(rand()*0.25+0.8))])
                    
                    n=n[0].toUpperCase()+n.substring(1)

                    name+=n.replace('Pollen','')+'-'
                    
                }
                
                for(let i=0,r=Math.round(rand())+2;i<r;i++){
                    
                    let n=types[(rand()*types.length)|0]
                    
                    types.splice(types.indexOf(n),1)
                    
                    req.push([n,Math.floor(am*0.5*(n==='pollenFromStumpField'||n==='pollenFromCoconutField'?0.35:1)*(rand()*0.25+0.8)*(1/((r-1)*0.25+1)))])
                    
                    n=n.replace('pollenFrom','').replace('Field','').replace('Patch','').replace('Field','').replace('Forest','').toLowerCase()
                    
                    n={sunflower:'Sun',dandelion:'Dand',mushroom:'Mush',blueflower:'Bluf',clover:'Clov',spider:'Spide',strawberry:'Straw',bamboo:'Bamb',pineapple:'Pinap',stump:'Stump',cactus:'Cact',pumpkin:'Pump',pinetree:'Pine',rose:'Rose',mountaintop:'Mount',pepper:'Pepp',coconut:'Coco'}[n]
                    
                    name+=n+'-'
                }
                
                player.addQuest(name[name.length-1]==='-'?name.substring(0,name.length-1):name,req,'brownBear')
                
            }
            
        ,"Great! Here are some rewards!","Come back to me for a new quest!",function(){addReward(rew)}
        
        ]
    }
}

window.dialogue_brownBear_beesmas=function(player,items){
    
    let addCommas=(s)=>{for(let i=s.length-3;i>0;i-=3){s=s.substring(0,i)+','+s.substr(i,s.length)}return s},doGrammar=(s)=>{let str=s.slice(),_s='';for(let i in str){if(str[i].toLowerCase()!==str[i]){_s=_s+' '+str[i]}else{_s=_s+str[i]}}return _s[0].toUpperCase()+_s.substring(1,_s.length)},addReward=(arr)=>{
        
        for(let i in player.quests){
            
            if(player.quests[i].NPC==='brownBear'&&player.quests[i].isBeesmasQuest) player.quests.splice(i,1)
            
        }
        
        for(let i in arr){
            
            if(arr[i][0]==='honey'){
                
                player.honey+=arr[i][1]
                
            } else {
                
                items[arr[i][0]].amount+=arr[i][1]
            }
            
            player.addMessage('+'+addCommas(arr[i][1]+'')+' '+doGrammar(arr[i][0])+' (from Brown Bear)')
        }
        
        player.updateInventory()
    }

    return ["Henlo! It's me, Brown Bear!","This year, I have a master plan to build a fake chimney to trap Santa.FOCUSON[-55.5,7,16,0,-0.25]","Clearly, this boring chimney needs some final touches. Maybe some nice socks...or whatever those things are called. It's not very 'rizz' as the children say.","Help me fetch supplies and resources for some long socks things to hang over the fireplace. If you do, I'll give you some nice rewards.FOCUSON",function(){player.addQuest("Brown Bear's Stockings",[['pollenFromCloverField',2500],['pollenFromDandelionField',2500],['honeyTokens',5],['microConverter',1]],'brownBear*');},"Awesome! hehehehehe","Now it's time to complete the fireplace/chimney/fire hazard/whatever contraption! FOCUSON[-55.5,7,16,0,-0.25]","Look!COMPLETEMACHINE","You can visit me and my stockings every hour to pick up some mystery items inside of them. They're worth it!","Have some rewards!FOCUSON",function(){addReward([['honey',5000],['royalJelly',1],['atomicTreat',1],['whirligig',3],['gingerbreadBear',1]])},"Thanks for helping me! Time to prosecute Santa of breaking and entering.","In the meanwhile, feel free to help other bears build their creative Beesmas contraptions or explore the mountain for Gift Boxes to open."]
}

window.dialogue_datsocool=function(player,items){
    
    let addCommas=(s)=>{for(let i=s.length-3;i>0;i-=3){s=s.substring(0,i)+','+s.substr(i,s.length)}return s},doGrammar=(s)=>{let str=s.slice(),_s='';for(let i in str){if(str[i].toLowerCase()!==str[i]){_s=_s+' '+str[i]}else{_s=_s+str[i]}}return _s[0].toUpperCase()+_s.substring(1,_s.length)},addReward=(arr)=>{
        
        for(let i in player.quests){
            
            if(player.quests[i].NPC==='datsocool') player.quests.splice(i,1)
            
        }
        
        for(let i in arr){
            
            if(arr[i][0]==='honey'){
                
                player.honey+=arr[i][1]
                
            } else {
                
                items[arr[i][0]].amount+=arr[i][1]
            }
            
            player.addMessage('+'+addCommas(arr[i][1]+'')+' '+doGrammar(arr[i][0])+' (from Datsocool)')
        }
        
        player.updateInventory()
    }
    
    return ["Hi! I'm Datsocool, the creator of this game!","In this questline, I'll reward some Star Eggs for every quest!","I'll also reward you with a Star Treat at the last quest!","So here's the first quest:",function(){player.addQuest('Programs',[['redPollen',30000000],['pollenFromRoseField',10000000],['pollenFromStrawberryField',10000000],['pollenFromMushroomField',10000000],['flames',30],['strawberryTokens',25],['strawberry',50],['redExtractTokens',2],['redExtract',3],['timesUsingTheRedCannon',25],['redAbilityTokens',250],['scorpion',15],['werewolf',3]],'datsocool');},"Great! Here's your Star Egg!","Hatch it to get a gifted bee you don't have in your hive!",function(){addReward([['honey',75000000],['starEgg',1],['redExtract',3],['ticket',5],['treat',1000],['royalJelly',25],['invigoratingVial',1]])},"Here's your next quest, good luck!",function(){player.addQuest('Locations',[['pollen',75000000],['goo',10000000],['pollenFromPumpkinPatch',15000000],['pollenFromCactusField',15000000],['pollenFromCloverField',10000000],['pollenFromSunflowerField',7500000],['royalJellyTokens',5],['boostTokens',500],['tokensFromPlanters',30],['rhinoBeetle',15],['ladybug',15]],'datsocool');},"Good!",function(){addReward([['honey',100000000],['starEgg',1],['fieldDice',5],['glitter',3],['treat',2500],['ticket',5],['royalJelly',50]])},"Here's the next quest!",function(){player.addQuest('Buffers',[['whitePollen',100000000],['pollenFromPineapplePatch',30000000],['pollenFromDandelionField',10000000],['pollenFromSunflowerField',10000000],['bombTokens',500],['markTokens',250],['tokensFromSprouts',50],['sunflowerSeedTokens',25],['pineappleTokens',25],['timesUsingTheSlingshot',25],['spider',5]],'datsocool');},"Impressive!",function(){addReward([['honey',100000000],['starEgg',1],['enzymes',5],['oil',5],['jellyBeans',10],['glue',10]])},"Just 2 more quests to go!",function(){player.addQuest('Pointers',[['pollenFromAntField',10000000],['ant',500],['armyAnt',50],['fireAnt',50],['flyingAnt',50],['giantAnt',10],['tunnelBear',1],['kingBeetle',2],['rogueViciousBee',3],['werewolf',5],['spider',10],['mantis',20],['scorpion',20],['battleTokens',500]],'datsocool');},"Great! Your next quest will be harder, so good luck!",function(){addReward([['honey',250000000],['starEgg',1],['stinger',10],['purplePotion',1],['loadedDice',1],['treat',3500]])},"This is the last quest, complete it for a star treat!",function(){player.addQuest('Draw Call',[['pollen',1000000000],['bluePollen',750000000],['bubbles',150],['blueAbilityTokens',1000],['hasteTokens',500],['tokensFromSprouts',100],['timesUsingTheBlueCannon',40],['tropicalDrink',3],['fallingCoconuts',35],['mantis',15],['rhinoBeetle',30],['rogueViciousBee',3]],'datsocool');},"Epic! You're the best beekeeper I've ever met! You deserve this Star Treat!",function(){addReward([['honey',2500000000],['starTreat',1],['blueExtract',5],['royalJelly',250],['ticket',15],['treat',5270],['blueberry',2],['magicBean',10]])},"You did it!","All my quests are done and you've earned your star treat!","sad that i only fit 8 references into my NPC's short questlines :(","ok bye"]
}

window.dialogue_datsocool_beesmas=function(player,items){
    
    let addCommas=(s)=>{for(let i=s.length-3;i>0;i-=3){s=s.substring(0,i)+','+s.substr(i,s.length)}return s},doGrammar=(s)=>{let str=s.slice(),_s='';for(let i in str){if(str[i].toLowerCase()!==str[i]){_s=_s+' '+str[i]}else{_s=_s+str[i]}}return _s[0].toUpperCase()+_s.substring(1,_s.length)},addReward=(arr)=>{
        
        for(let i in player.quests){
            
            if(player.quests[i].NPC==='datsocool'&&player.quests[i].isBeesmasQuest) player.quests.splice(i,1)
            
        }
        
        for(let i in arr){
            
            if(arr[i][0]==='honey'){
                
                player.honey+=arr[i][1]
                
            } else {
                
                items[arr[i][0]].amount+=arr[i][1]
            }
            
            player.addMessage('+'+addCommas(arr[i][1]+'')+' '+doGrammar(arr[i][0])+' (from Datsocool)')
        }
        
        player.updateInventory()
    }

    return ["jingle bells jingle bells 🎵🎶<br><br>🍪nearrrrlllyyyy beesmas!! (or i think it is already beesmas) <b style='font-size:6px'>*copyright kiaantolia corportation he said that</b>","O hi-","So um, as you can tell, it's Beesmas!","I don't have a lot to say- except HELP ME with my art!","Here is it. Not every exciting. It obviously doesn't compare to a sophisticated set on a big lid...it's a wall.FOCUSON[-27,39,124,3.1416,0]","All you need to do is gather supplies so I can create a masterpiece by completing my Beesmas quest.","GOGOGO!!!FOCUSON",function(){player.addQuest("Dat's Wall Art",[['pollenFromMountainTopField',50000000],['minutesOfNectar',30],['tokensFromSprouts',25],['tokensFromPlanters',25],['snowflakeTokens',25],['puffshrooms',25],['whirligig',15],['fallingBeesmasLights',15],['fieldDice',1]],'datsocool*');},"slay!!!!!","Let's have a look!FOCUSON[-27,39,124,3.1416,0]","TADAAAAAAAA!!COMPLETEMACHINE","It's definitely *something*. It's not much but it's honest work.","You can come admire my bootiful art every 6 hours to get some rewards, produce some temporary bees for 30 mins, and summon a Guiding Star in a random field!FOCUSON","Have some items!!",function(){addReward([['honey',50000000],['festiveBean',1],['ticket',5],['glue',3],['gingerbreadBear',5],['purplePotion',1],['blackBalloon',1],['starJelly',1],['loadedDice',1]])},"That's it for my Beesmas project. Come back to complete my Star Journey quests or even give me a present!!(hint hint)"]
}

window.dialogue_pandaBear=function(player,items){
    
    let addCommas=(s)=>{for(let i=s.length-3;i>0;i-=3){s=s.substring(0,i)+','+s.substr(i,s.length)}return s},doGrammar=(s)=>{let str=s.slice(),_s='';for(let i in str){if(str[i].toLowerCase()!==str[i]){_s=_s+' '+str[i]}else{_s=_s+str[i]}}return _s[0].toUpperCase()+_s.substring(1,_s.length)},addReward=(arr)=>{
        
        for(let i in player.quests){
            
            if(player.quests[i].NPC==='pandaBear') player.quests.splice(i,1)
            
        }
        
        for(let i in arr){
            
            if(arr[i][0]==='honey'){
                
                player.honey+=arr[i][1]
                
            } else {
                
                items[arr[i][0]].amount+=arr[i][1]
            }
            
            player.addMessage('+'+addCommas(arr[i][1]+'')+' '+doGrammar(arr[i][0])+' (from Panda Bear)')
        }
        
        player.updateInventory()
    }

    return ["Hello! I'm Panda Bear!","I stay safe in this dangerous mountain by learning to defeat the evil creatures!","I'll show you how to do the same with your bees by giving you quests. I'll give you rewards like treats and some rare items.","After you complete my training, you'll be rewarded with a special Star Treat! It makes any bee gifted when you feed it, and is very good!","Here's the start of your training!",function(){player.addQuest('Ladybug Learning',[['ladybug',1]],'pandaBear');},"Cool! As you go through my questline, you'll need to defeat lots of monsters and learn how to properly fight bugs!",function(){addReward([['honey',400]])},"Whenever you defeat a mob, it'll respawn within a couple minutes. Ladybugs and rhino beetles respawn every 3 minutes, but spiders respawn every 10 minutes!","However, mobs won't respawn when you're in their field. They'll wait for you to leave then wake up.","As you complete my quests, I'll tell you more info about the creatures here. Here's another quest:",function(){player.addQuest('8 Legged Dreams',[['spider',1]],'pandaBear');},"Did you have trouble defeating the spider?(and more importantly realize the cool song reference)?","Here are your rewards:",function(){addReward([['honey',900],['treat',5],['stinger',1]])},"As you progress and unlock more zones, you'll see higher level mobs.","Your bees may miss their attack when the mob's level is higher than their's.","That's why it's important to level up your bees. You can use the treats I give you or go through Mother Bear's quests about bee bonding.","Here's another quest:",function(){player.addQuest('Rhino Rumble',[['rhinoBeetle',3]],'pandaBear');},"Nice! I'll keep giving you some stuffs for bee leveing:",function(){addReward([['honey',1300],['blueberry',3]])},"Another good tool for defeating monsters are...stingers!","You can use them to boost your bee's attack for 45 seconds!","There are quite rare though. You can often get them from defeating Rogue Vicous Bees hiding in fields *at night*, but they are quite powerful.","Instead, you can also get them from me, since I have lots!","Get started!!!",function(){player.addQuest('Icebound Battleground',[['rhinoBeetle',2],['ladybug',2]],'pandaBear');},"Awesome! Rememeber, be wise with your items! You might need them later on, so it's best to save them for when you need them.",function(){addReward([['honey',1950],['royalJelly',1],['stinger',3],['strawberry',3],['blueberry',3]])},"Have you unlocked the 10 bee zone? You'll need to have 10 bees in your hive to enter.","In the pineapple patch, you'll find the dangerous mantis you need to defeat for this quest:",function(){player.addQuest('Preying Mantis',[['mantis',1]],'pandaBear');},"Good! Was it hard?",function(){addReward([['honey',2750],['treat',10]])},"Keep going through these quests to hatch and level up your bees!",function(){player.addQuest('Spider Spawner',[['spider',1],['ladybug',3],['rhinoBeetle',3]],'pandaBear');},"Great!",function(){addReward([['honey',4000],['treat',20],['sunflowerSeed',5],['ticket',1],['royalJelly',1]])},"If you haven't, now is a good time to buy the Helmet from the Noob Shop.","It improves pollen collection, and your defense!","With a higher defense percentage, you'll take less damage from mob hits.","Try doing this quest:",function(){player.addQuest('Rhino Rumble 2U',[['rhinoBeetle',5]],'pandaBear');},"Cool!",function(){addReward([['honey',7500],['treat',20],['pineapple',5],['royalJelly',1]])},"Here's another quest to help you get ready. I'll give you a Silver Egg to help you unlock the 15 bee zone!",function(){player.addQuest('Peaceful Place',[['ladybug',6]],'pandaBear');},"Great! Get ready for the next quest!",function(){addReward([['honey',15000],['stinger',1],['treat',25],['gumdrops',3],['moonCharm',3],['silverEgg',1]])},"Now, defeat the scary werewolf in the 15 bee zone!",function(){player.addQuest('Weirdwolf',[['werewolf',1]],'pandaBear');},"Amazing! Here are extra rewards:",function(){addReward([['honey',22500],['moonCharm',3],['gumdrops',3],['ticket',2],['royalJelly',1]])},"Great! Level up your bees to defeat creatures in new zones faster!","Here's the next quest:",function(){player.addQuest('Rainbow Connection',[['scorpion',2],['mantis',2],['ladybug',4],['rhinoBeetle',4]],'pandaBear');},"Awesome!",function(){addReward([['honey',60000],['redExtract',1],['blueExtract',1],['gumdrops',5],['ticket',2]])},"Keep expanding your hive! Soon you'll reach the 20 bee zone, where I like to have lots of fun!","Meanwhile, do another quest:",function(){player.addQuest('Bug Exterminator',[['ladybug',3],['rhinoBeetle',3],['spider',1],['mantis',1]],'pandaBear');},"Great!",function(){addReward([['honey',100000],['oil',1],['treat',30]])},"Ok, get ready for this hard quest!",function(){player.addQuest('Hunter X Mobs',[['werewolf',1],['spider',2],['scorpion',2],['mantis',2]],'pandaBear');},"Cool!",function(){addReward([['honey',150000],['ticket',2],['royalJelly',2],['gumdrops',5]])},"Have you been getting more bees for your hive? In a few quests, you'll need to get ready for the 20 bee zone!","Here's the next quest:",function(){player.addQuest('Rhino Rumble 3',[['rhinoBeetle',12],['ladybug',5]],'pandaBear');},"Nice job!",function(){addReward([['honey',225000],['treat',150],['royalJelly',3]])},"Ok, this is the last quest before you need to enter the 20 bee zone!","To help, I'll reward you with a Gold Egg!",function(){player.addQuest('Ready Or Not',[['werewolf',2],['spider',3],['mantis',2],['ladybug',7]],'pandaBear');},"Yay! Here are some good rewards!",function(){addReward([['honey',300000],['stinger',3],['oil',1],['jellyBeans',3],['goldEgg',1],['antPass',3]])},"In the 20 bee zone, you can complete the Ant Challenge for many rewards!","Collect pollen to fill up the meter and spawn ants.","Defeat ants to get points and rewards based on how well you did!","Get started!",function(){player.addQuest('Bad Buddies',[['ant',15],['giantAnt',1]],'pandaBear');},"Great! That was so easy!",function(){addReward([['honey',400000],['treat',100],['ticket',2],['gumdrops',5],['stinger',5]])},"You're getting the hang of this!","Did you know there's a secret lair underneath the clover field?","The scary king beetle lives there!","If your bees are strong enough, have a go at it!",function(){player.addQuest('A King Without His Crown',[['kingBeetle',1]],'pandaBear');},"Excellent!",function(){addReward([['honey',460000],['royalJelly',1],['glue',3],['antPass',1]])},
    "Since I love the ant challenge, many quests from now on will require you to defeat ants!","Here's one of them:",function(){player.addQuest('Microwaved',[['fireAnt',5]],'pandaBear');},"Good!",function(){addReward([['honey',530000],['royalJelly',5],['stinger',3],['antPass',1]])},"Since I haven't given you a special reward in a while, I'll do it now!","Complete this next quest for a special Star Jelly!",function(){player.addQuest('Green Ants',[['armyAnt',10],['ant',25],['werewolf',1],['stinger',1]],'pandaBear');},"Cool! Here's the Star Jelly!",function(){addReward([['honey',600000],['starJelly',1],['ticket',3]])},"Now, defeat a Rogue Vicious Bee!","They can spawn at night time, and hide in fields. They can be found in the Cactus, Rose, Clover, Spider, and the Mountain Top field or the Pepper Patch.","Look for a little spike poking out of a flower, and step on it to find the Rogue Vicious Bee!","Go go go!",function(){player.addQuest('Impaling',[['rogueViciousBee',1]],'pandaBear');},"Nice! Rogue Vicious Bees give lots of stingers and honey!",function(){addReward([['honey',650000],['ticket',3],['royalJelly',3],['treat',150]])},"Here's your next quest:",function(){player.addQuest('Just Being Friendly',[['flyingAnt',4],['giantAnt',4],['mantis',4],['scorpion',4],['spider',4]],'pandaBear');},"Coooool!",function(){addReward([['honey',810000],['treat',100],['pineapple',25],['sunflowerSeed',25]])},"Since I'm a great beekeeper, I'll give you a tip:","One of the best bees in the game are the legendary Music Bees!","They produce many great ability tokens that are good for collecting and attacking, so try to get 3 in your hive.","Ok, this next hard quest requires you to collect a melody token!",function(){player.addQuest('Monody',[['rogueViciousBee',1],['melodyTokens',1]],'pandaBear');},"Great! It was so easy!",function(){addReward([['honey',800000],['oil',1],['royalJelly',5],['strawberry',25],['blueberry',25]])},"You're getting closer to the Star Treat! Here's another quest:",function(){player.addQuest('Rhino Rumble 4',[['rhinoBeetle',25]],'pandaBear');},"Amazing! Did it take long???",function(){addReward([['honey',1000000],['blueExtract',1],['magicBean',1]])},"You're one of the best beekeppers I've ever meet! Keep going!",function(){player.addQuest('Road Trip',[['ant',30],['fireAnt',10],['flyingAnt',10],['armyAnt',10],['werewolf',2]],'pandaBear');},"Excellent! Here are very good rewards(totally not a subtle reference when combined with the name of the quest)",function(){addReward([['honey',1500000],['comfortingVial',1],['satisfyingVial',1],['motivatingVial',1],['refreshingVial',1]])},"Did you know there's a secret tunnel in the converter machine by Science Bear?","It's home to the big Tunnel Bear, one of the most dangerous mobs!","Defeat it to earn lots of loot!",function(){player.addQuest('Big Bosses',[['tunnelBear',1],['rogueViciousBee',1],['mondoChick',1],['kingBeetle',1]],'pandaBear');},"Epic!",function(){addReward([['honey',2250000],['glitter',1],['glue',3],['jellyBeans',3],['antPass',1]])},"I'm soooo proud! You're getting close to the end of my questline!","Just 3 more quests and you'll get a Star Treat!","Back to work!!!",function(){player.addQuest('Ant-nihilation',[['ant',100],['fireAnt',25],['flyingAnt',25],['armyAnt',25],['giantAnt',5]],'pandaBear');},"Greatttt!",function(){addReward([['honey',3000000],['royalJelly',3],['ticket',3],['antPass',1]])},"Just 2 more quests to go!",function(){player.addQuest('Paradox',[['rhinoBeetle',15],['ladybug',15],['mantis',5],['scorpion',5],['kingBeetle',1],['ant',50]],'pandaBear');},"Cool! Here are extra rewards for your last quest!",function(){addReward([['honey',4000000],['gumdrops',15],['jellyBeans',3],['strawberry',25],['blueberry',25],['pineapple',25],['redExtract',1],['blueExtract',1]])},"This is my very last quest! You'll be reward a Star Treat and more!","Good luck!",function(){player.addQuest('No One Else Like Me',[['tunnelBear',1],['rogueViciousBee',2],['kingBeetle',3],['werewolf',4],['spider',5],['mantis',10],['scorpion',10],['rhinoBeetle',25],['ladybug',25],['ant',100]],'pandaBear');},"Cool!",function(){addReward([['honey',5000334],['starTreat',1],['antPass',3],['ticket',3],['atomicTreat',4],['neonberry',3],['glitter',3]])},"You completed all my quests!!!","But you know what else you didn't complete? a list of all my references!","like half my quests, requirements, and rewards reference something in a veryyyyy subtle way","hehehehehe no one realized any"]
}

window.dialogue_pandaBear_beesmas=function(player,items){
    
    let addCommas=(s)=>{for(let i=s.length-3;i>0;i-=3){s=s.substring(0,i)+','+s.substr(i,s.length)}return s},doGrammar=(s)=>{let str=s.slice(),_s='';for(let i in str){if(str[i].toLowerCase()!==str[i]){_s=_s+' '+str[i]}else{_s=_s+str[i]}}return _s[0].toUpperCase()+_s.substring(1,_s.length)},addReward=(arr)=>{
        
        for(let i in player.quests){
            
            if(player.quests[i].NPC==='pandaBear'&&player.quests[i].isBeesmasQuest) player.quests.splice(i,1)
            
        }
        
        for(let i in arr){
            
            if(arr[i][0]==='honey'){
                
                player.honey+=arr[i][1]
                
            } else {
                
                items[arr[i][0]].amount+=arr[i][1]
            }
            
            player.addMessage('+'+addCommas(arr[i][1]+'')+' '+doGrammar(arr[i][0])+' (from Panda Bear)')
        }
        
        player.updateInventory()
    }

    return ["Hey! I'm Panda Bear!","Everybody knows that Beesmas is the best time to go around and bully random bugs! Level up your bees to deal more damage and defeat higher level monsters.","To help, I'm constructing a magical Snowbear statue.FOCUSON[-20,7.5,53,0,-0.4]","As you can see, he's not holding up very well.","Help me put him together while defeating mobs for practice, and I'll let you have some tries at defeating Snowbear...and also some rewards too- but nobody likes those.",function(){player.addQuest("Panda Bear's Snowbear",[['whitePollen',10000],['pollenFromBambooField',5000],['spider',1],['snowflakeTokens',5]],'pandaBear*');},"Nice!","Time to assemble the Snowbear!!FOCUSON[-20,7.5,53,0,-0.4]","grrr!!COMPLETEMACHINE","You can come to the Snowbear every 90 minutes and challenge him to a duel in the spider field.FOCUSON","He'll level up every time he loses and will drop plenty of snowflakes, which you can use to get buffs or to purchase from Bee Bear's Catalog. Hope you're ready!","And also, have some rewards for completing my Beesmas quest.",function(){addReward([['honey',15000],['stinger',5],['ticket',5],['snowflake',15],['oil',1]])},"Bye for now! Make sure you help everybody else with their Beesmas wishes.","(now if you'll excuse me i need to continue bingeing anime-)"]
}

window.dialogue_scienceBear=function(player,items){
    
    let addCommas=(s)=>{for(let i=s.length-3;i>0;i-=3){s=s.substring(0,i)+','+s.substr(i,s.length)}return s},doGrammar=(s)=>{let str=s.slice(),_s='';for(let i in str){if(str[i].toLowerCase()!==str[i]){_s=_s+' '+str[i]}else{_s=_s+str[i]}}return _s[0].toUpperCase()+_s.substring(1,_s.length)},addReward=(arr)=>{
        
        player.addEffect('scienceEnhancement')
        player.addMessage('Activated "Science Enhancement"')
        
        for(let i in player.quests){
            
            if(player.quests[i].NPC==='scienceBear') player.quests.splice(i,1)
            
        }
        
        for(let i in arr){
            
            if(arr[i][0]==='honey'){
                
                player.honey+=arr[i][1]
                
            } else {
                
                items[arr[i][0]].amount+=arr[i][1]
            }
            
            player.addMessage('+'+addCommas(arr[i][1]+'')+' '+doGrammar(arr[i][0])+' (from Science Bear)')
        }
        
        player.updateInventory()
    }

    return ["Hey! I'm Science Bear!","I'm quite the smartest guy around here, and will improve your scientific knowledge through my awesome quests!","Throughout my quests, I'll give you 3 Translators to talk to other creatures here!","You can give a translator to Gifted Riley Bee, Gifted Bucko Bee, or Stickbug!","The bees give you quests, and talking to Stickbug allows you to start the Stickbug Challenge!","Get started!",function(){player.addQuest('Hook',[['beeTypes',5],['whitePollen',20000],['pollenFromStrawberryField',10000],['pollenFromBambooField',10000]],'scienceBear');},"Nice! You're already doing great!",function(){addReward([['honey',31415],['treat',9],['gumdrops',2]])},"As you do my quests, make sure to also complete other bear's quests too!","You can also complete multiple quests at the same time!","Take this quest:",function(){player.addQuest('Complicated',[['beeTypes',6],['bluePollen',25700],['pollenFromCloverField',10000],['pollenFromMushroomField',80000],['royalJelly',1]],'scienceBear');},"Great!",function(){addReward([['honey',45000],['ticket',2],['gumdrops',3],['treat',10],['microConverter',1]])},"You're off to a great start! You can earn your first Translator in 5 more quests!","Here's a new quest:",function(){player.addQuest('Astrology',[['beeTypes',7],['pollen',424242],['pollenFromPineapplePatch',22222],['pollenFromSunflowerField',11011],['moonCharm',1]],'scienceBear');},"Cool!",function(){addReward([['honey',60000],['moonCharm',5],['pineapple',5],['royalJelly',3]])},"If you have lots of Royal Jelly, it's good to try to get better types of bees!","I recommend having some Epic bees for your hive!","Next quest:",function(){player.addQuest('Have You Found',[['beeTypes',9],['redPollen',40900],['goo',4090],['pollenFromBlueFlowerField',12500],['pollenFromSpiderField',17409],['timesUsingTheSlingshot',3]],'scienceBear');},"Epic!",function(){addReward([['honey',90409],['royalJelly',5],['treat',25],['jellyBeans',1],['microConverter',1]])},"Many bees have special abilities!","Most bees produce ability tokens, while some have passives.","Fire Bee has a chance to spawn a flame whenever it collects!","Flames can collect pollen and give extra pollen boosts!","You'll need to summon flames and collect 100 ability tokens for this quest!",function(){player.addQuest('The 100',[['beeTypes',10],['pollen',100000],['redPollen',44444],['pollenFromDandelionField',18000],['flames',4],['abilityTokens',100]],'scienceBear');},"Ok!",function(){addReward([['honey',125000],['strawberry',10],['glue',1],['microConverter',1]])},"This next quest requires you to have 15 bees! Try to defeat the scary werewolf in the 15 bee zone!",function(){player.addQuest('Electrici-tea',[['beeTypes',12],['bluePollen',90000],['pollenFromBambooField',40000],['pollenFromCactusField',25000],['pollenFromCloverField',12500],['pineapple',3],['werewolf',1]],'scienceBear');},"Good job!",function(){addReward([['honey',220000],['magicBean',1],['sunflowerSeed',10],['royalJelly',3]])},"This is the next quest:",function(){player.addQuest('Spider Study',[['beeTypes',13],['whitePollen',100000],['redPollen',1],['bluePollen',1],['spider',3]],'scienceBear');},"Awesome!",function(){addReward([['honey',295000],['treat',75],['oil',1],['microConverter',1]])},"Here's the next quest:",function(){player.addQuest('Dark Blue',[['beeTypes',15],['bluePollen',125000],['pollenFromPineTreeForest',50000],['pollenFromBlueFlowerField',25000],['blueAbilityTokens',25],['blueberryTokens',5]],'scienceBear');},"Cool!",function(){addReward([['honey',380000],['blueExtract',1],['whirligig',3],['ticket',3],['gumdrops',5]])},"You're advancing quite fast!","The following quests will be much harder, but you'll soon get your first Translator!",function(){player.addQuest('Loading, Response, Score',[['beeTypes',17],['redPollen',185000],['goo',20353],['pollenFromRoseField',90317],['pollenFromMushroomField',40359],['strawberry',5],['ladybug',7]],'scienceBear');},"Brilliant!",function(){addReward([['honey',460000],['redExtract',1],['stinger',1],['microConverter',1],['strawberry',25],['sunflowerSeed',25],['royalJelly',10]])},"You'll get your first Translator after 3 more quests! Get to work!",function(){player.addQuest('Terror From Tommorow',[['beeTypes',18],['pollen',400350],['pollenFromCloverField',50000],['pollenFromSunflowerField',40000],['pollenFromPineapplePatch',35000],['boostTokens',35],['mantis',3]],'scienceBear');},"Excellent!",function(){addReward([['honey',500350],['royalJelly',10],['enzymes',1],['ticket',3],['microConverter',1]])},"Just 2 more quests until you recieve your first Translator!","And because I'm nice, I'll give you a special Star Jelly after you complete this quest!",function(){player.addQuest('MAYDAY',[['beeTypes',19],['bluePollen',250000],['whitePollen',250000],['bombTokens',50],['pollenFromPumpkinPatch',60000],['pollenFromDandelionField',40000],['werewolf',1],['spider',2]],'scienceBear');},"Nice!",function(){addReward([['honey',600407],['starJelly',1],['treat',1000],['royalJelly',10],['moonCharm',5],['magicBean',1]])},"Complete this quest for your first Translator!",
    function(){player.addQuest('Xenogenesis',[['beeTypes',20],['pollen',600000],['redPollen',300000],['abilityTokens',356],['timesUsingTheSlingshot',15],['kingBeetle',1]],'scienceBear');},"Great! Here's the Translator! You've earned it!","Give it to your favorite character, Gifted Bucko Bee, Gifted Riley Bee, or Stickbug!",function(){addReward([['honey',750000],['translator',1],['royalJelly',15],['purplePotion',1],['microConverter',1],['fieldDice',1],['gumdrops',10]])},"Ready for more???","This quest requires you to defeat some ants in the Ant Challenge!",function(){player.addQuest('Shipment',[['beeTypes',22],['whitePollen',500000],['pollenFromAntField',30000],['royalJelly',5],['ant',25]],'scienceBear');},"Epic!",function(){addReward([['honey',800000],['royalJelly',15],['ticket',3],['gumdrops',10],['microConverter',1]])},"Make sure to use your resources wisely! Many can be used to craft better gear.","Some can also be used to boost your honey making and more!","You can make many resources by using the Blender, located in the sprinkler shop building in the 15 bee zone.","Here's your next quest, which requires you to use the Blender:",function(){player.addQuest('Earth Skills',[['beeTypes',23],['pollen',900000],['goo',35000],['itemsUsingTheBlender',5],['pollenFromDandelionField',50000],['pollenFromSunflowerField',50000],['pollenFromStumpField',25000],['ladybug',8],['rhinoBeetle',8]],'scienceBear');},"Good!",function(){addReward([['honey',1000000],['redExtract',1],['blueExtract',1],['glue',1],['glitter',1],['oil',1],['enzymes',1]])},"As you expand your hive, make sure to have a good variety of bees that have many different abilities!","Certain ability tokens help you do different things and can combine with other buffs, so it's good to have them all!","You'll need to collect lots for this quest:",function(){player.addQuest('Gotta Collect Them All',[['beeTypes',24],['pollenFromMountainTopField',500000],['hasteTokens',35],['linkTokens',25],['focusTokens',25],['boostTokens',25],['bombTokens',25],['markTokens',25],['melodyTokens',15],['rageTokens',15]],'scienceBear');},"Cool!",function(){addReward([['honey',2500000],['magicBean',1],['jellyBeans',3],['fieldDice',1],['microConverter',1],['royalJelly',25]])},"Next quest:",function(){player.addQuest('Parallax',[['beeTypes',25],['redPollen',750000],['bluePollen',750000],['goo',40000],['kingBeetle',1],['werewolf',2],['spider',3],['ant',15]],'scienceBear');},"Amazing!",function(){addReward([['honey',1600000],['treat',1500],['royalJelly',25],['whirligig',3]])},"Here's the next quest!",function(){player.addQuest('Far Future',[['beeTypes',26],['bluePollen',2000000],['redPollen',750000],['pollenFromRoseField',300000],['pollenFromCloverField',200000],['pollenFromBlueFlowerField',100000],['itemsUsingTheBlender',5],['timesUsingTheBlueCannon',5],['treat',150]],'scienceBear');},"Terrific!",function(){addReward([['honey',4000000],['moonCharm',5],['ticket',5],['smoothDice',1]])},"You'll get your next Translator in just 4 quests!","However, the difficulty will ramp up! Get ready!",function(){player.addQuest('Closer',[['beeTypes',27],['redPollen',5050000],['bluePollen',5050000],['whitePollen',3380000],['goo',200000],['abilityTokens',500],['kingBeetle',2],['werewolf',5],['ant',100]],'scienceBear');},"Great! That was fast!",function(){addReward([['honey',7000000],['glue',1],['glitter',1],['treat',1000]])},"3 even more painful quests until your next Translator!",function(){player.addQuest('The Calling',[['beeTypes',28],['whitePollen',9000354],['pollenFromPineapplePatch',2000000],['pollenFromSpiderField',1500000],['pollenFromDandelionField',1000000],['pollenFromSunflowerField',1000000],['spider',5]],'scienceBear');},"Cool!",function(){addReward([['honey',10000000],['oil',3],['enzymes',3],['microConverter',1],['whirligig',3],['royalJelly',30]])},"Just 2 more quests for your next Translator!","This next quest requires you to have at least 35 bees.","Also, if you didn't know, there's a secret tunnel hidden inside the Instant Converter nearby...only Panda Bear knows what lies inside...",function(){player.addQuest('Fire',[['beeTypes',30],['redPollen',25000329],['pollenFromPepperPatch',10000000],['flames',15],['redAbilityTokens',150],['bombTokens',75],['rageTokens',20],['fallingCoconuts',1],['tunnelBear',1]],'scienceBear');},"Awesome!",function(){addReward([['honey',30000000],['tropicalDrink',1],['coconut',5],['ticket',10],['gumdrops',10],['treat',1000]])},"Complete this quest for another Translator! Go give it to someone!",function(){player.addQuest('Only One',[['beeTypes',31],['pollen',50000000],['itemsUsingTheBlender',10],['starJelly',1]],'scienceBear');},"Here's your Translator!",
    function(){addReward([['honey',75000000],['translator',1],['royalJelly',50],['treat',1500]])},"These are your final few quests!","Soon, you'll get your final Translator in only 4 harder quests!",function(){player.addQuest('Back One Day',[['beeTypes',32],['pollenFromMountainTopField',25000000],['pollenFromCactusField',20000000],['pollenFromBambooField',17500000],['pollenFromRoseField',20000000],['pollenFromPineTreeForest',20000000],['pollenFromStrawberryField',17500000]],'scienceBear');},"Amazing!",function(){addReward([['honey',100000000],['magicBean',5],['jellyBeans',5],['microConverter',3],['royalJelly',30]])},"Here's the next painstaking quest:",function(){player.addQuest('Mooshroom Stew',[['beeTypes',33],['pollenFromMushroomField',70000000],['pollenFromStumpField',1000000]],'scienceBear');},"Excellent!",function(){addReward([['honey',123456789],['strawberry',50],['blueberry',50],['pineapple',50],['sunflowerSeed',50]])},"This is my second to last quest ever! Keep going!",function(){player.addQuest('Let Me Tell You',[['beeTypes',34],['pollenFromPumpkinPatch',35000000],['pollenFromPepperPatch',30000000],['pollenFromCoconutField',2500000],['melodyTokens',3],['linkTokens',3],['rageTokens',9],['bitterberry',11],['fieldDice',4]],'scienceBear');},"Epic!",function(){addReward([['honey',1750340],['bitterberry',4],['loadedDice',1],['gumdrops',15],['ticket',15],['treat',4444]])},"This is my last quest! After completing it, you'll get your final Translator!","It'll be hard, so get ready!",function(){player.addQuest('Final Wave',[['beeTypes',35],['pollen',100000308],['melodyTokens',100],['boostTokens',308],['bombTokens',308],['hasteTokens',308],['focusTokens',308],['redAbilityTokens',500],['blueAbilityTokens',500],['tunnelBear',1],['rogueViciousBee',1]],'scienceBear');},"Greatttttttttttt!",function(){addReward([['honey',200000000],['translator',1],['starJelly',1]])},'You completed all my quests!',"As Science Bear, I'm quite a smart fellow, and so I put many references to things in my quests like every other NPCs!","My huge brain size and large IQ allowed me to hide several references in EVERY quest I gave, and you probably never realized anything muawhahahahahaahahahaha","ok bye"]
}

window.dialogue_scienceBear_beesmas=function(player,items){
    
    let addCommas=(s)=>{for(let i=s.length-3;i>0;i-=3){s=s.substring(0,i)+','+s.substr(i,s.length)}return s},doGrammar=(s)=>{let str=s.slice(),_s='';for(let i in str){if(str[i].toLowerCase()!==str[i]){_s=_s+' '+str[i]}else{_s=_s+str[i]}}return _s[0].toUpperCase()+_s.substring(1,_s.length)},addReward=(arr)=>{
        
        for(let i in player.quests){
            
            if(player.quests[i].NPC==='scienceBear'&&player.quests[i].isBeesmasQuest) player.quests.splice(i,1)
            
        }
        
        for(let i in arr){
            
            if(arr[i][0]==='honey'){
                
                player.honey+=arr[i][1]
                
            } else {
                
                items[arr[i][0]].amount+=arr[i][1]
            }
            
            player.addMessage('+'+addCommas(arr[i][1]+'')+' '+doGrammar(arr[i][0])+' (from Science Bear)')
        }
        
        player.updateInventory()
    }

    return ["Hey there bud!","Like the other bears, I've designed a complex piece of machinery for Beesmas: the massive Beesmas Lights!FOCUSON[-9,21,48,3.35,0.1]","Yet, it's not done.","I'll need your help to power it on!FOCUSON","Go complete my Beesmas quest! Once you're back, I'll have what I need to turn it on!",function(){player.addQuest("Science Bear's Beesmas Lights",[['pollenFromSpiderField',55555],['pollenFromSunflowerField',22222],['boostTokens',25],['bombTokens',25],['moonCharmTokens',3],['snowflake',5]],'scienceBear*');},"Hooray!","Let's go light it up!FOCUSON[-9,21,48,3.35,0.1]","Woah!!! It's giving...blinding rays! light diamond! solar storm! spreading fire! dancing flames! neon splice! flame spiral! light spectrum! solar halo! sun dance! dazzling spiral!COMPLETEMACHINE","So many cheeky ways I could describe the lights!","Well anyways, I got want I needed done and off my mind.FOCUSON","When you're in a field, occasionally the Beesmas Lights will fall! They'll collect pollen. Catching one also converts some pollen out of your container.","Now, have my rewards:",function(){addReward([['honey',111111],['snowflake',20],['neonberry',5],['glue',1],['microConverter',5]])},"You're done! Now go help the others with their Beesmas endeavors!"]
}

window.dialogue_spiritBear=function(player,items){
    
    let addCommas=(s)=>{for(let i=s.length-3;i>0;i-=3){s=s.substring(0,i)+','+s.substr(i,s.length)}return s},doGrammar=(s)=>{let str=s.slice(),_s='';for(let i in str){if(str[i].toLowerCase()!==str[i]){_s=_s+' '+str[i]}else{_s=_s+str[i]}}return _s[0].toUpperCase()+_s.substring(1,_s.length)},addReward=(arr)=>{
        
        for(let i in player.quests){
            
            if(player.quests[i].NPC==='spiritBear') player.quests.splice(i,1)
            
        }
        
        for(let i in arr){
            
            if(arr[i][0]==='honey'){
                
                player.honey+=arr[i][1]
                
            } else {
                
                items[arr[i][0]].amount+=arr[i][1]
            }
            
            player.addMessage('+'+addCommas(arr[i][1]+'')+' '+doGrammar(arr[i][0])+' (from Spirit Bear)')
        }
        
        player.updateInventory()
    }

    return ["Hi! I'm Spirit Bear!","I'm a calm bear that constantly sleeps and meditates.","I'll teach you everything you need to know about this place, like the wind shrine and items!","Most of my quests will be wind/sky/star/moon/cloud themed because the 35 bee zone is all about the wind shrine!","Every few quests you'll get a star egg (very rare) or some star jellies (more common)!","I have 15 tasks for you to complete.","At the very end, I'll have 5 more very advanced quests that are extra rewarding.","Every 5th quest, you'll get a Spirit Petal, which can be used to craft the Petal Wand, the Petal Belt, or you can use one to tame a powerful Windy Bee.","By the end of my adventurous quests, you'll get all 3 petals and become one with the wind!","Your first quest starts now!",function(){player.addQuest('Openings',[['pollen',30000000],['pollenFromSunflowerField',7000000],['pollenFromCactusField',9000000],['sunflowerSeedTokens',15],['kingBeetle',1]],'spiritBear');},"How's that for your first quest?",function(){addReward([['honey',20000000],['glitter',1],['microConverter',1],['royalJelly',15]])},"Here's your next quest! It requires you to donate to the cool Wind Shrine!","Donating items to the Wind Shrine can give you field wind buffs, or sometimes special items!",function(){player.addQuest('Feel The Wind Blows',[['whitePollen',35000000],['pollenFromMountainTopField',20000000],['pollenFromSunflowerField',10000338],['pollenFromDandelionField',10000338],['pineapple',25],['treatToTheWindShrine',250]],'spiritBear');},"Cool! You should often donate items to the wind shrine for field winds before collecting to boost your pollen!",function(){addReward([['honey',30000000],['glitter',1],['fieldDice',3],['moonCharm',5]])},"Have you ever seen a Wild Windy Bee?","It's the powerful creature behind the myth and lore of the Wind Shrine.","You can summon it by donating some common items to the Wind Shrine, such as treats or fruits.","You can fight it by finding it hiding in cloud in a field, and touching it. After it's defeated, it'll upgrade to a higher level and move somewhere else.","Get lots of loot by chasing it around before the timer ends! Try to defeat one in this quest:",function(){player.addQuest('Blame It On The Wind',[['redPollen',50200311],['bluePollen',50200311],['pollenFromSpiderField',20000000],['pollenFromBambooField',10000332],['abilityTokens',502],['starJellyToTheWindShrine',1],['tokensFromWildWindyBee',10],['cloudVialTokens',1],['oilTokens',1]],'spiritBear');},"Nice! Here's a star jelly!",function(){addReward([['honey',75000000],['glitter',1],['starEgg',1],['oil',1],['magicBean',3],['pineapple',50]])},"This is your 4th quest so far! They're going to get wayyy harder!",function(){player.addQuest('Empire Stood Through The Clouds',[['goo',7500000],['pollenFromRoseField',24600000],['pollenFromBlueFlowerField',24600000],['pollenFromPineapplePatch',24600000],['pollenFromSpiderField',10000512],['markTokens',246],['magicBeanToTheWindShrine',1],['tokensFromSprouts',75]],'spiritBear');},"Great! Your next quest will be special!",function(){addReward([['honey',90000000],['glitter',1],['royalJelly',50],['jellyBeans',3],['microConverter',3]])},"This is your first milestone! I'll give you a Star Jelly and Spirir Petal after this intense quest!",function(){player.addQuest('Star In My Mind',[['whitePollen',150000000],['pollenFromCactusField',3000000],['pollenFromMountainTopField',3000000],['pollenFromDandelionField',2000000],['tokensFromWildWindyBee',100],['redExtractToTheWindShrine',3],['blueExtractToTheWindShrine',3],['bubbles',25]],'spiritBear');},"You did it! Here are your rewards!",function(){addReward([['honey',12500000],['spiritPetal',1],['starEgg',1],['purplePotion',1]])},"It's part 2 of my questline! You now have 5 more quests until the next Spirit Petal and Star Egg!",function(){player.addQuest('Hurrikane',[['bluePollen',125000000],['pollenFromBambooField',50000000],['pollenFromPineTreeForest',40000000],['pollenFromCloverField',35000000],['blueberryTokens',25],['blueberryToTheWindShrine',100],['tokensFromWildWindyBee',50]],'spiritBear');},"Great!",function(){addReward([['honey',175000000],['glitter',2],['coconut',10],['whirligig',5],['cloudVial',1]])},"I'm feeling generous, I'll give you some star jellies after this quest!","*spirit bear falls asleep, dreaming about how clouds are similar to ghosts...*",function(){player.addQuest('Our Untold Stories',[['pollen',750000000],['pollenFromStrawberryField',70000000],['pollenFromPepperPatch',50000000],['enzymesTokens',3],['fieldDice',5],['cloudVial',3],['tokensFromWildWindyBee',75]],'spiritBear');},"Awesome!",function(){addReward([['honey',500000000],['starJelly',2],['glitter',2],['magicBean',3],['royalJelly',50],['smoothDice',1]])},"3 more quests until your next milestone!",function(){player.addQuest('Windfall',[['redPollen',500000351],['pollenFromMushroomField',100000351],['pollenFromSpiderField',50000351],['pollenFromBlueFlowerField',30000351],['pollenFromStumpField',3510000],['honeyTokens',25],['redAbilityTokens',351],['cloudVialToTheWindShrine',3],['fallingCoconuts',5]],'spiritBear');},"Great!",function(){addReward([['honey',500000000],['glitter',2],['jellyBeans',3],['gumdrops',35],['microConverter',3]])},"2 more quests! This one will be harder!",function(){player.addQuest('The Moon Represents My Heart',[['bluePollen',750000329],['redPollen',500000329],['pollenFromPineapplePatch',125000323],['pollenFromStrawberryField',50242424],['moonCharmTokens',50],['moonCharm',100],['mondoChick',1],['purplePotionToTheWindShrine',1]],'spiritBear');},"Cool!",function(){addReward([['honey',750000000],['glitter',3],['moonCharm',125],['strawberry',100],['loadedDice',1],['neonberry',15],['microConverter',3],['purplePotion',1]])},"This is your 2nd very special quest! More Star Eggs and Spirit Petals!","It's really harddddddd! I'm warning you, it's so hard you wish a star can hear your prayers lol",function(){player.addQuest('Counting 1,000 Stars',[['pollen',1500000443],['pollenFromMountainTopField',750000458],['pollenFromPineTreeForest',120000000],['pollenFromCoconutField',5000000],['abilityTokens',1000],['starJellyTokens',1],['treatToTheWindShrine',1000],['tokensFromWildWindyBee',250],['armyAnt',50]],'spiritBear');},"Amazing! That was so difficult!",function(){addReward([['honey',1000000000],['spiritPetal',1],['starEgg',1],['glitter',3],['microConverter',3],['cloudVial',5],['royalJelly',100]])},
    "These are your finale quests! Only 5 remaining!",function(){player.addQuest('The Eclipse',[['whitePollen',2000000000],['redPollen',1111111111],['pollenFromSunflowerField',250000000],['pollenFromCloverField',200000000],['pollenFromSpiderField',200000000],['pollenFromPumpkinPatch',200000000],['moonCharmToTheWindShrine',357],['tokensFromWildWindyBee',200]],'spiritBear');},"Excellent!",function(){addReward([['honey',3000000000],['glitter',3],['whirligig',5],['glue',15],['tropicalDrink',15],['coconut',50],['sunflowerSeed',500]])},"Here's your next quest! You might need to defeat the big scary Coconut Crab!",function(){player.addQuest('Field Upon The Sky',[['whitePollen',4000000000],['goo',50000000],['pollenFromMountainTopField',1000000000],['pollenFromPepperPatch',250000000],['pollenFromCoconutField',100000000],['tokensFromSprouts',100],['tokensFromPlanters',25],['fallingCoconuts',50],['tokensFromWildWindyBee',250],['tropicalDrinkToTheWindShrine',10]],'spiritBear');},"Cool!",function(){addReward([['honey',6000000000],['glitter',3],['tropicalDrink',5],['microConverter',5],['enzymes',15],['oil',15],['redExtract',15],['blueExtract',15]])},"Next quest! Only 3 more!",function(){player.addQuest('Sky In Your Heart',[['pollen',15000000000],['redPollen',5000000000],['bluePollen',2500000000],['starJellyTokens',1],['pollenFromBlueFlowerField',200000000],['pollenFromMushroomField',200000000],['pollenFromDandelionField',200000000],['tokensFromWildWindyBee',250],['blueberryToTheWindShrine',750],['kingBeetle',1]],'spiritBear');},"Terrific!",function(){addReward([['honey',12500000000],['glitter',3],['starJelly',3],['fieldDice',15],['microConverter',5],['magicBean',5],['whirligig',10],['jellyBeans',3]])},"This is the 2nd last quest in my questline!",function(){player.addQuest('Our Sky',[['whitePollen',9000000000],['bluePollen',5000000000],['pollenFromPineTreeForest',1000000000],['pollenFromCactusField',600000000],['pollenFromRoseField',500000000],['pollenFromStumpField',100000000],['flames',75],['timesUsingTheSlingshot',100],['cloudVialTokens',15],['gumdropsTokens',25]],'spiritBear');},"Nice! Get ready for the finale quest!",function(){addReward([['honey',17500000000],['glitter',3],['starJelly',5],['loadedDice',1],['microConverter',5],['glue',5],['superSmoothie',1]])},"This is the ultimate finale of the petal questlines! It'll be the hardest quest yet!",function(){player.addQuest('My Starlight',[['whitePollen',15000000000],['redPollen',15000000000],['bluePollen',15000000000],['goo',1000000000],['pollenFromMountainTopField',5000000000],['pollenFromRoseField',3000000000],['pollenFromSpiderField',1000000000],['bubbles',150],['moonCharmTokens',75],['starJellyTokens',5],['tokensFromSprouts',500],['neonberry',25],['tokensFromWildWindyBee',300],['starJellyToTheWindShrine',15]],'spiritBear');},"Nice job! You did it! Here's your last Sprit Petal and a Star Egg!",function(){addReward([['honey',25000000000],['glitter',15],['spiritPetal',1],['starEgg',1],['starJelly',10],['superSmoothie',1],['fieldDice',5],['tropicalDrink',15],['cloudVial',3]])},"Now it's time for the 5 extra quests!","There will be 4 very hard but rewarding quests, and a star-related quest rewarding another Star Egg at the end!","(i had so many fun references to put so i had to make extra quests lol)","It begins now!",function(){player.addQuest('Hear You in the Breeze',[['bluePollen',20000000000],['whitePollen',20000000450],['whitePollen',20000000450],['pollenFromSunflowerField',750000000],['pollenFromDandelionField',500000000],['hasteTokens',450],['timesUsingTheYellowCannon',45],['fieldDice',10],['timesUsingTheSlingshot',35],['pollenFromMountainTopField',2500000000],['bubbles',250],['pollenFromPineTreeForest',1500000000],['whirligig',5],['giantAnt',45],['melodyTokens',45],['pollenFromStumpField',500000000],['glue',5]],'spiritBear');},"Nice! That's your first advanced quest done!",function(){addReward([['honey',3500000000],['glitter',3],['cloudVial',1],['jellyBeans',5],['tropicalDrink',3],['glue',3]])},"From now on, I'll give you lots of Star Jellies!","Start this next quest:",function(){player.addQuest('Doubled Winds',[['redPollen',4400000440],['pollenFromPineTreeForest',4400000024],['redExtract',2],['magicBeanTokens',4],['cloudVialTokens',24],['timesUsingTheRedCannon',24],['tokensFromWildWindyBee',440],['glueToTheWindShrine',3],['flames',33],['loadedDice',1]],'spiritBear');},"Cool!",function(){addReward([['honey',50000000000],['glitter',5],['starJelly',3],['enzymes',5],['smoothDice',2],['softWax',5],['spuerSmoothie',1]])},
    "Keep going!",function(){player.addQuest('Everlasting Bright Blue Sky',[['pollen',100040900409],['whitePollen',70040900409],['goo',300000409],['satisfyingVial',1],['pollenFromSunflowerField',8000000000],['pollenFromCoconutField',6000000000],['pollenFromPepperPatch',3000000000],['pollenFromStumpField',1000000000],['boostTokens',1000],['itemsUsingTheBlender',50],['hardWaxToTheWindShrine',3]],'spiritBear');},"Awesome!",function(){addReward([['honey',125000000000],['glitter',10],['magicBean',5],['redExtract',5],['blueExtract',5],['oil',3],['treat',10000]])},"This is your 2nd last quest from me!",function(){player.addQuest('Looking at the Same Star/Sky',[['bluePollen',125000000436],['pollenFromBambooField',4360000327],['pollenFromBlueFlowerField',4360000327],['pollenFromPineTreeForest',3270000436],['pollenFromPineapplePatch',3270000436],['moonCharmTokens',147],['tokensFromSprouts',147],['starJelly',14],['bubbles',147]],'spiritBear');},"Cool!",function(){addReward([['honey',175000000000],['glitter',10],['purplePotion',1],['starJelly',5],['enzymes',3],['pineapple',763],['cloudVial',3],['comfortingVial',1]])},"This is your last quest from me! It's not gonna be easy!",function(){player.addQuest('Rock & Star',[['pollen',744444444444],['whitePollen',205320000532],['bluePollen',124242424242],['redPollen',124242424242],['pollenFromMountainTopField',22424242424],['pollenFromSunflowerField',15222222222],['pollenFromStumpField',1444444444],['pollenFromPumpkinPatch',5656565656560],['inspireTokens',242],['timesUsingTheYellowCannon',56],['goldEgg',1],['honeysuckle',24],['honeyTokens',532],['moonCharm',44],['pineappleTokens',242],['ticketToTheWindShrine',22],['cloudVialTokens',4],['mythicPuffshrooms',1]],'spiritBear');},"My my, you've done very well.",function(){addReward([['honey',1000000000000],['glitter',15],['starEgg',1],['starJelly',15],['coconut',125],['superSmoothie',1],['magicBean',12],['swirledWax',12],['pineapple',1212]])},"That's all for now!","You're such a great beekeeper!","Goodbye!"]
}

window.dialogue_spiritBear_beesmas=function(player,items){
    
    let addCommas=(s)=>{for(let i=s.length-3;i>0;i-=3){s=s.substring(0,i)+','+s.substr(i,s.length)}return s},doGrammar=(s)=>{let str=s.slice(),_s='';for(let i in str){if(str[i].toLowerCase()!==str[i]){_s=_s+' '+str[i]}else{_s=_s+str[i]}}return _s[0].toUpperCase()+_s.substring(1,_s.length)},addReward=(arr)=>{
        
        for(let i in player.quests){
            
            if(player.quests[i].NPC==='spiritBear'&&player.quests[i].isBeesmasQuest) player.quests.splice(i,1)
            
        }
        
        for(let i in arr){
            
            if(arr[i][0]==='honey'){
                
                player.honey+=arr[i][1]
                
            } else {
                
                items[arr[i][0]].amount+=arr[i][1]
            }
            
            player.addMessage('+'+addCommas(arr[i][1]+'')+' '+doGrammar(arr[i][0])+' (from Spirit Bear)')
        }
        
        player.updateInventory()
    }

    return ["Oh, hello dear-","I'll get straight to the point since I need to go back to sleep(and Datsocool also needs to not be mentally insane from writing dialogues)!","See that?FOCUSON[66,27,-22,1.5708,-0.1]","Well if you've played this game before you might have. It's the Wind Shrine.","Donate items to it and it'll do things: like summon a Wild Windy Bee or give wind boosts on fields.","Donate it one of my Spirit Petals(from completing my primary questline) to tame a Windy Bee.","But that's not the point. For Beesmas, I need to decorate it...for Galentine's Day!FOCUSON","I don't know why, I just do. Stick with me.","With that said, go complete my Beesmas quest! I'll be able to decorate it by then.",function(){player.addQuest("Spirit Bear's Galentine Shrine",[['whitePollen',100000000],['pollenFromRoseField',25000000],['pollenFromBlueFlowerField',10000000],['goo',2500000],['tokensFromPlanters',35],['tokensFromWildWindyBee',25],['glitter',3],['jellyBeans',3],['strawberryTokens',100],['cloudVialTokens',5],['starJellyToTheWindShrine',1],['softWaxToTheWindShrine',3],['redExtractToTheWindShrine',5]],'spiritBear*');},"Nicely done!","Over there!FOCUSON[66,27,-22,1.5708,-0.1]","Beautiful!COMPLETEMACHINE","Certainly looks like a girly child's room.","Anyways, you can donate some strawberries to the Galentine Shrine and you'll recieve some bonus gifts and Galentine Blessing!","Now, have my rewards:",function(){addReward([['honey',200000000],['ticket',10],['gingerbreadBear',5],['glitter',5],['swirledWax',3],['whiteBalloon',3]]);player.addMessage('❄️Spirit Bear has summoned a Snow Storm!❄️',[200,200,255]);player.startSnowStorm()},"You're all set! Meanwhile, you can do the other NPC's Beesmas quests!","Come back to give everyone presents!"]
}


window.dialogue_motherBear=function(player,items){
    
    let addCommas=(s)=>{for(let i=s.length-3;i>0;i-=3){s=s.substring(0,i)+','+s.substr(i,s.length)}return s},doGrammar=(s)=>{let str=s.slice(),_s='';for(let i in str){if(str[i].toLowerCase()!==str[i]){_s=_s+' '+str[i]}else{_s=_s+str[i]}}return _s[0].toUpperCase()+_s.substring(1,_s.length)},addReward=(arr)=>{
        
        for(let i in player.quests){
            
            if(player.quests[i].NPC==='motherBear') player.quests.splice(i,1)
            
        }
        
        for(let i in arr){
            
            if(arr[i][0]==='honey'){
                
                player.honey+=arr[i][1]
                
            } else {
                
                items[arr[i][0]].amount+=arr[i][1]
            }
            
            player.addMessage('+'+addCommas(arr[i][1]+'')+' '+doGrammar(arr[i][0])+' (from Mother Bear)')
        }
        
        player.updateInventory()
    }

    return ["Hello, I'm Mother Bear!","While I take care of my cubs, I'll give you quests about bee bonding and leveling!","Feeding your bees is very important as they will be able to level up and perform tasks better.","You can buy some treats using honey with my useful Treat Shop next to me!","Why don't you buy a treat and feed a bee for this first quest:",function(){player.addQuest('Treat Tutorial',[['treat',1]],'motherBear');},"Nice job! Throughout my quests, I'll also give you some Royal Jellies!","Here's some honey!",function(){addReward([['honey',300]])},"Royal jellies are useful items because they can transform bees into different types!","They are many types of rare bees that can only be discovered by using jellies or hatching eggs.","You can earn a Royal Jelly from my next quest:",function(){player.addQuest('Selfless',[['pollen',356],['treat',1]],'motherBear');},"Good! Use this Royal Jelly on a bee to transform it into a better type of bee!",function(){addReward([['honey',600],['royalJelly',1]])},"Each bee has an amount of bond with you. When you feed a bee, its bond increases. If the bond goes past a certain amount, the bee will level up!","It takes more treats for a bee to level up each time, so don't spend all your treats on one specific bee.","When you transform a bee, it's bond won't change.","Here's your next quest:",function(){player.addQuest('Leveling Up',[['beesToLevel2',2],['treat',2]],'motherBear');},"Cool! Here is some honey and a treat!",function(){addReward([['honey',1000],['treat',1]])},"There are many types of things you can feed your bees!","You can find some strawberries by defeating mobs like ladybugs, which live in red flower fields.","If your bee's levels are not higher than the mob's level, it has a chance to MISS its attack!","If you stay in a field for a while, you can sometimes find treats!","Different fields give different fruits. Red fields give more strawberries than blue fields.","In this quest, obtain a strawberry and feed it to your bees!",function(){player.addQuest('Searching for Strawberries',[['beesToLevel2',3],['strawberry',1]],'motherBear');},"Did you notice that strawberries give more bond than treats??","Strawberries and othre fruits give 25 bond, while treats give 10!",function(){addReward([['honey',1800],['royalJelly',1]])},"Whenever you feed a bee's a favorite type of treat, the bond it gets is doubled! It also has a chance to become gifted!","Gifted bees perform tasks better, and also give you a special gifted hive bonus!","You can look at types of bees and what they can do in the Bee Menu, by clicking the bee icon on the top left.","Here's the next quest:",function(){player.addQuest('Bring On Blueberries',[['beesToLevel3',1],['treat',3],['blueberry',1]],'motherBear');},"Awesome!",function(){addReward([['honey',2500],['treat',5],['strawberry',2]])},"As you go through my quests I'll give many rare prizes.","I'll give you a Star Egg when you complete half my quests, and then a Star Treat for the final quest!","Get to work!",function(){player.addQuest('Three to Three',[['beesToLevel3',3]],'motherBear');},"Great job!",function(){addReward([['honey',3000],['blueberry',3],['royalJelly',1]])},"Another type of food is the sunflower seed!","However, it's rarer as it doesn't drop from common bugs. You can sometimes find it in the sunflower field.","Here's the quest:",function(){player.addQuest('Some Seeds',[['beesToLevel2',5],['sunflowerSeed',1]],'motherBear');},"Great!",function(){addReward([['honey',4000],['sunflowerSeed',3],['treat',5]])},"Collect a variety of treats for the next quest!",function(){player.addQuest('Scavenger Hunt',[['treat',10],['strawberryTokens',3],['blueberryTokens',3],['sunflowerSeed',3]],'motherBear');},"Nice! Was that hard??",function(){addReward([['honey',8000],['treat',10],['royalJelly',1]])},"Next quest:",function(){player.addQuest('Leveling Four',[['pollenFromSpiderField',1326],['beesToLevel4',1]],'motherBear');},"Amazing!",function(){addReward([['honey',10500],['royalJelly',1],['sunflowerSeed',3]])},"Keep leveling up your bees and also hatching new ones!!",function(){player.addQuest('Ton of Chocolate',[['beesToLevel3',5],['beesToLevel2',7],['treat',15]],'motherBear');},"You did it!",function(){addReward([['honey',18000],['royalJelly',1],['treat',10]])},"As you start to make lots of honey, keep buying eggs to expand your hive!","After this quest, you'll need 10 bees to enter the 10 bee zone!",function(){player.addQuest('Listen',[['beesToLevel4',2],['treat',10]],'motherBear');},"Good!",function(){addReward([['honey',23000]])},"This is your first quest in the 10 bee zone!",function(){player.addQuest('T x R^10',[['beesToLevel2',10],['sunflowerSeed',1],['beeTypes',5]],'motherBear');},"Nice!",function(){addReward([['honey',35000],['pineapple',5],['sunflowerSeed',3],['strawberry',3],['blueberry',3]])},"You're getting close to the Star Egg! Complete just a few more quests!",function(){player.addQuest('Our Song',[['beesToLevel4',3],['treat',11],['sunflowerSeed',3],['strawberry',5],['blueberry',9]],'motherBear');},"Cool! Keep expanding your hive! You'll need to enter the 15 bee zone soon!",function(){addReward([['honey',60000],['royalJelly',1]])},"About 3 more quests until your Star Egg!","However, quests now will get much harder!",function(){player.addQuest('Stronger',[['pineapple',3],['beesToLevel5',2],['beesToLevel4',5]],'motherBear');},"Great!",function(){addReward([['honey',85000],['pineapple',5],['sunflowerSeed',5],['jellyBeans',1]])},"Have you entered the 15 bee zone yet??","Beware of the dangerous monsters like the werewolf, and defeat them for lots of loot!","Here's the next quest:",function(){player.addQuest('15 Cute Bees',[['sunflowerSeed',4],['beesToLevel2',15]],'motherBear');},"Cool!",function(){addReward([['honey',100000]])},"After this quest, you'll get your first Star Egg!","It'll get much harder though!",function(){player.addQuest('Seeing Stars',[['beesToLevel5',3],['strawberry',5],['blueberry',5],['pineapple',5],['sunflowerSeed',5]],'motherBear');},"Awesome!",function(){addReward([['honey',115000],['starEgg',1],['oil',1],['enzymes',1]])},"Keep progressing and leving up your hive.","Make sure to upgrade and buy new gear from shops to make the most honey!","To test your bee's attack, we're going bug hunting now!",function(){player.addQuest('Chop the Eye',[['beeTypes',10],['spider',1],['ladybug',3],['beesToLevel6',1],['rhinoBeetle',6]],'motherBear');},"Good job!",
    function(){addReward([['honey',130000],['magicBean',1],['stinger',3]])},"For the next few quests, you'll need to level up your bees a lot!",function(){player.addQuest('Five to Five',[['beesToLevel5',5],['treat',25]],'motherBear');},"Terrific!",function(){addReward([['honey',150000],['royalJelly',1],['pineapple',5]])},"Here's the next quest:",function(){player.addQuest('Leveling Up',[['beesToLevel7',1],['beesToLevel5',6],['beesToLevel4',7],['beesToLevel3',16],['beesToLevel2',19]],'motherBear');},"Amazing!",function(){addReward([['honey',300000],['gumdrops',5],['redExtract',1],['blueExtract',1]])},"Keep going!",function(){player.addQuest('Upgrading',[['treat',50],['beesToLevel7',3],['beesToLevel6',5],['beesToLevel2',22]],'motherBear');},"Impressive!",function(){addReward([['honey',900000],['pineapple',15],['sunflowerSeed',20]])},"Did you know there's a rare item called a Moon Charm?","It's very rare and can be used to craft special items, but can also be feed to your bees.","Remember, try to save your rare items in case you need them later.","In this quest, obtain a Moon Charm and feed 1 to your bees.","They can be often obtained from fireflies at night time. Just chase the little bugs around and step on all of them.","If you run fast enough, you can earn around 9-15 moon charms during the night!",function(){player.addQuest('Dark Blue Sky',[['beesToLevel7',5],['moonCharm',1]],'motherBear');},"Epic!",function(){addReward([['honey',1800000],['moonCharm',5],['royalJelly',5],['treat',150]])},"Now, continue leveling up your bees! You're getting close to the Star Treat!",function(){player.addQuest('Eighth Level',[['beesToLevel8',1],['beesToLevel7',8],['treat',175]],'motherBear');},"Awesome!",function(){addReward([['honey',3000000],['pineapple',25],['sunflowerSeed',25],['strawberry',25],['blueberry',25]])},"Quests will get much harder now! You now need to level up 8 bees to level 8!",function(){player.addQuest('Eight to Eight',[['beesToLevel8',8]],'motherBear');},"Great! Have a Star Jelly!",function(){addReward([['honey',10000000],['starJelly',1],['royalJelly',10]])},"Here's your next quest:",function(){player.addQuest('Ninth Level',[['beesToLevel9',3],['beesToLevel8',20],['strawberry',15],['blueberry',15],['sunflowerSeed',15],['pineapple',15]],'motherBear');},"Amazing! The next quest will the the final quest!",function(){addReward([['honey',3000000]])},"Here's your last quest! I'll reward a star treat at the end!",function(){player.addQuest('The Family Final',[['beesToLevel10',1],['beesToLevel9',10],['beesToLevel8',15],['beesToLevel7',20],['beesToLevel6',30],['treat',500],['treatTokens',25]],'motherBear');},"Great job!",function(){addReward([['honey',50000000],['loadedDice',1],['royalJelly',25],['glitter',3],['treat',1000]])},"Sadly, you've completed all of my quests!","You're a great beekeeper with great bees!","Keep making progress, leveling up bees, obtaining rare bees, and craft better gear!","Bye!"]
    
}

window.dialogue_motherBear_beesmas=function(player,items){
    
    let addCommas=(s)=>{for(let i=s.length-3;i>0;i-=3){s=s.substring(0,i)+','+s.substr(i,s.length)}return s},doGrammar=(s)=>{let str=s.slice(),_s='';for(let i in str){if(str[i].toLowerCase()!==str[i]){_s=_s+' '+str[i]}else{_s=_s+str[i]}}return _s[0].toUpperCase()+_s.substring(1,_s.length)},addReward=(arr)=>{
        
        for(let i in player.quests){
            
            if(player.quests[i].NPC==='motherBear'&&player.quests[i].isBeesmasQuest) player.quests.splice(i,1)
            
        }
        
        for(let i in arr){
            
            if(arr[i][0]==='honey'){
                
                player.honey+=arr[i][1]
                
            } else {
                
                items[arr[i][0]].amount+=arr[i][1]
            }
            
            player.addMessage('+'+addCommas(arr[i][1]+'')+' '+doGrammar(arr[i][0])+' (from Mother Bear)')
        }
        
        player.updateInventory()
    }

    return ['Welcome to Beesmas! As you can see, the Bee Swarm mountain is looking a bit snowy and festive!',"To celebrate the Beesmas sprit, I've started working on a wonderful Gingerbread House.FOCUSON[15.5,1.5,28,3.5,-0.3]","Obviously, it's looking a bit dull. Help me finish it by completing a quest, and also earn rewards when I'm done!","Get ready!FOCUSON",function(){player.addQuest("Mother Bear's Gingerbread House",[['beeTypes',4],['pollenFromDandelionField',1000],['pollenFromSunflowerField',1000],['treatTokens',5],['strawberryTokens',5],['blueberryTokens',5],['royalJelly',3]],'motherBear*');},"Nice job!!!","Now it's time to construct the Gingerbread House!FOCUSON[15.5,1.5,28,3.5,-0.3]","Yay!COMPLETEMACHINE","You can visit the Gingerbread House every hour to collect some Gingerbread Bears! Gingerbread Bears can be fed to your bees or used as currency in shops!","Here are your rewards!!!FOCUSON",function(){addReward([['honey',2500],['ticket',3],['royalJelly',1],['gumdrops',25],['honeysuckle',10],['gingerbreadBear',1]])},"That's it, bye! Go and enjoy your Beesmas!","Spread the Beesmas cheer by helping the other bears on the mountain!"]
}

window.dialogue_dapperBear=function(player,items){
    
    let addCommas=(s)=>{for(let i=s.length-3;i>0;i-=3){s=s.substring(0,i)+','+s.substr(i,s.length)}return s},doGrammar=(s)=>{let str=s.slice(),_s='';for(let i in str){if(str[i].toLowerCase()!==str[i]){_s=_s+' '+str[i]}else{_s=_s+str[i]}}return _s[0].toUpperCase()+_s.substring(1,_s.length)},addReward=(arr)=>{
        
        for(let i in player.quests){
            
            if(player.quests[i].NPC==='dapperBear') player.quests.splice(i,1)
            
        }
        
        for(let i in arr){
            
            if(arr[i][0]==='honey'){
                
                player.honey+=arr[i][1]
                
            } else {
                
                items[arr[i][0]].amount+=arr[i][1]
            }
            
            player.addMessage('+'+addCommas(arr[i][1]+'')+' '+doGrammar(arr[i][0])+' (from Dapper Bear)')
        }
        
        player.updateInventory()
    }

    return ["Grrrrreetings, I am... the dapper bear!","I own the finest planters in the land, which you can purchase from my shop. My planters are much higher quality than the puny clay and paper planters sold in the nearby shops.","You can plant a planter in a field, and it'll grow! Harvest it to get GREAT rewards and nectar buffs!","Just plant a planter, wait a few minutes, and I'll be done! Make sure to harvest it after it's done 100% to get the maximun rewards.","Nectars boost your bees and give extra benefits, so they're great to have.","If you don't have any planters yet, you can buy a Paper Planter from the shop by the pineapple field. First quest!",function(){player.addQuest('Once Upon A Time',[['minutesOfNectar',10],['redPollen',500000],['pollenFromPineapplePatch',500424],['boostTokens',10],['tokensFromPlanters',5]],'dapperBear');},"My, my... you've done very well, haven't you? *simpering chuckle*","When harvesting planters, it can give you 1 of 5 types of nectar! The type of nectar and also rewards depends on the field it grew in.","I guess I can give this to you, I don't need it anymore...",function(){addReward([['honey',2500000],['honeysuckle',20],['whirligig',5],['royalJelly',5]])},"I, the almighty dapper bear, will give you 10 quests in total. They will be quite diffucult, but will guide you all the way through to the end game.","At the end of my quests, I'll reward you with an expensive Star Egg.","As you progress, make sure to buy many planters and use them, as they are very good(at least in this version of the game)!","Also, if you see little puffshrooms, make sure to chase them around and pop them! They'll give many treats, waxes, other fun items, and multiply!","Puffshrooms grow in random fields every few minutes.","You'll need many waxes to craft planters, so stock up on them!","In this quest, you'll need to collect Motivating Nectar! It can be obtained from planters that grew in the spider, rose, mushroom, and stump fields!",function(){player.addQuest('Seeing Puffs & Fumes',[['puffshrooms',3],['minutesOfMotivatingNectar',10],['pollen',6000000],['pollenFromSpiderField',750000],['werewolf',1]],'dapperBear');},"Splendid job, chap.","Puffshrooms can level up to require more pollen to pop and give much better rewards!","High leveled puffshrooms can also gain rare, epic, legendary, and mythic rarity! These also give much better rewards!","Have a star jelly and this random junk:",function(){addReward([['honey',10000000],['magicBean',1],['royalJelly',10],['jellyBeans',5],['starJelly',1]])},"How many waxes do you have? Try to buy my plastic planter!","It's a *reuseable* planter, meaning you can plant it again after you harvest it!","The plastic planter takes longer to grow, but will give MUCH more nectar and loot!","Refreshing nectar can be obtained from the strawberry and blue flower fields.","Satisfying nectar can be obtained from the pineapple, pumpkin, and sunflower fields.","Now just take this quest and be done with it:",function(){player.addQuest('My Luck',[['minutesOfSatisfyingNectar',15],['minutesOfRefreshingNectar',10],['bluePollen',10000000],['pollenFromCloverField',2000305],['pollenFromPineapplePatch',2000000],['fieldDiceTokens',1],['tokensFromPlanters',25],['puffshrooms',10]],'dapperBear');},"*gasp* You've done it... I didn't expect you to actually complete it...",function(){addReward([['honey',25000000],['smoothDice',1],['honeysuckle',25],['royalJelly',10],['softWax',3],['oil',1],['cloadVial',1],['ticket',5]])},"I also own a Beequip shop! I sell many beequips you can purchase.","Beequips can be put onto bees to improve them. Some beequips can also apply bonuses to your player.","Each beequip has a potential, color, and level. It can only be put on bees with the same color, and an equal or higher level.","The potenial measures how good it is and much more it will be improved when waxes are used.","You can only hold a certain number of beequips, though. However, from now on, I will reward you with extra beequip slots!","Invigorating nectar can be obtained from the clover, cactus, and mountain top fields. Think you can take this quest as well?",function(){player.addQuest('Healing',[['hoursOfNectar',1],['minutesOfRefreshingNectar',20],['minutesOfInvigoratingNectar',20],['pollen',30240240],['pollenFromMountainTopField',5000459],['melodyTokens',24],['tokensFromPlanters',35],['puffshrooms',15]],'dapperBear');},"Great! If you didn't know, another great way to get waxes is to craft them!","You can use the blender in that weird yellow building in the 15 bee zone.","Anyways, y-you did it... ponduberous, excellent, splendaculous, whatever... have some things.",function(){addReward([['honey',50000000],['hardWax',1],['softWax',3],['honeysuckle',30],['whirligig',10],['magicBean',5]])},"*aHeM* Anyways, on to the next quest...","I suppose you've bought my colorful Candy Planter by now. It'll help lots with collecting gumdrops and jelly beans!","Comforting nectar can be obtained from planters in the dandelion, pine tree, and bamboo fields.","Think you can take this quest as well?",function(){player.addQuest('Goo Raccoon',[['hoursOfComfortingNectar',1],['hoursOfInvigoratingNectar',1],['whitePollen',55555555],['pollenFromPumpkinPatch',10000331],['goo',555555],['gumdrops',25],['gumdropsTokens',30],['glueTokens',3],['rarePuffshrooms',1],['moonAmulets',1]],'dapperBear');},"Oh my... I didn't expect you to actually be able to do that...",function(){addReward([['honey',90000000],['loadedDice',1],['glitter',3],['redExtract',1],['blueExtract',1],['ticket',10]])},"A tip on puffshroom farming: Puffshrooms level up when they spread to new fields!","That means that you should follow them around the map instead of staying in 1 field. They might level down when they move back and forth between the same fields.","Also, higher rarity puffshrooms tend to spawn with more higher level puffshrooms and in new fields.","Welp... another chore- er, job for you to complete before the store opens...","I fancy some spices from the pepper patch this time. How about you go in the 35 bee zone and fetch some?",function(){player.addQuest('Enchantéd',[['hoursOfNectar',2],['pollenFromPepperPatch',50000447],['pollenFromBambooField',38000331],['pollenFromRoseField',24000447],['pollenFromSunflowerField',9000331],['pollenFromStumpField',1500447],['focusTokens',150],['glitterTokens',1],['puffshrooms',35],['rarePuffshrooms',3]],'dapperBear');},"Yes, yes, well done and all that. I suppose you need another reward now.",function(){addReward([['honey',150000000],['royalJelly',25],['honeysuckle',25],['swirledWax',1],['magicBean',3],['ticket',10]])},"Maybe if you can complete the next quest as well, I can give you even more tchotchkes... I certainly don't need them, I have everything I need *simpering chuckle*",function(){player.addQuest('Blooming',[['hoursOfComfortingNectar',1],['hoursOfMotivatingNectar',1],['bluePollen',150000000],['pollenFromSunflowerField',25000000],['pollenFromRoseField',25000000],['tokensFromSprouts',100],['blueExtractTokens',3],['magicBeanTokens',3],['magicBean',5],['glitter',3],['itemsUsingTheBlender',15],['rarePuffshrooms',10]],'dapperBear');},"Here, m'lad, take this garbágee...",function(){addReward([['honey',200000000],['oil',3],['enzymes',5],['glitter',5],['magicBean',3],['jellyBeans',5],['causticWax',1]])},"Muahahahwaahahahaw, you're on my 8th quest now, just 3 more torturous quests left! heheheh",function(){player.addQuest('Oblivion',[['epicPuffshrooms',1],['hoursOfRefreshingNectar',2],['pollen',600000000],['abilityTokens',1750],['boostTokens',332],['bombTokens',332],['melodyTokens',83],['tokensFromPlanters',50]],'dapperBear');},"Did you like that quest???",function(){addReward([['honey',90000000],['glitter',5],['starJelly',3],['tropicalDrink',5],['ticket',15],['purplePotion',1]])},"Ano'er painful quest comin yar way!",function(){player.addQuest('Color Rush',[['loadedDice',1],['invigoratingVial',1],['satisfyingVial',1],['refreshingVial',1],['comfortingVial',1],['motivatingVial',1],['redPollen',750000000],['bluePollen',750000000],['goo',25000000],['superSmoothie',1],['epicPuffshrooms',1]],'dapperBear');},
    "Ah yes, you did it. I'm not really impressed but have this stuff:",function(){addReward([['honey',1250000000],['superSmoothie',1],['redExtract',5],['blueExtract',5],['glue',5],['glitter',5],['oil',5],['enzymes',5],['tropicalDrink',5]])},"This is your last quest!!!","I'll give you a star egg after this!","...","...Erm, what's that, Mother?","...","...terribly sorry, I will have you scrub it for me after all. Mother says she won't be doing my laundry anymore :(","...oh, Mother, why must you be like this....","I have a new addition to your quest! Now you must help me wash my tuxedo! muawhahaha jk(or am i)",function(){player.addQuest('Scary Gloomy Hypnotizing Doom Shrooms',[['hoursOfNectar',10],['whitePollen',2500000000],['goo',5000000],['abilityTokens',3000],['bitterberryTokens',15],['tokensFromPlanters',100],['tokensFromSprouts',250],['puffshrooms',150],['rarePuffshrooms',15],['epicPuffshrooms',5],['legendaryPuffshrooms',1]],'dapperBear');},"Woah! Ya did it!",function(){addReward([['honey',10000000000],['starEgg',1],['causticWax',3],['swirledWax',3],['hardWax',5],['softWax',15],['whirligig',10],['honeysuckle',100],['superSmoothie',1]])},"I have no more quests for you!","Bye!","buttt wait did ya notice all the references in my quests?? all my quests have a reference in them!","*gasp* oh noes my puffshroom was eaten by a zombie!!","excuse me while i go back to playing PvZ, it's a great game and it even has all the mushrooms!","NOooooOOooOOoo!! The zombies ate my brains! I rage quit!","[Dapper Bear now changes to playing PvZ2]","yay the hypno shroom worked and the zombie did an uno reverse card muahahahaw","[Dapper Bear wins, for the first time in his life]",'oki bye']
    
    // "PRE",function(){player.addQuest('N',[['hoursOfNectar',1],['pollen',1000000]],'dapperBear');},"POST",function(){addReward([['honey',1000000]])}
    
    // return ["here",function(){player.addQuest('*very* specific quest requirements',[['hasteTokens',1],['redExtract',1],['goo',1],['flames',8],['bubbles',8],['fallingCoconuts',1],['fireAnt',1],['itemsUsingTheBlender',1],['timesUsingTheRedCannon',1],['tokensFromSprouts',10],['tokensFromPlanters',5],['hoursOfInvigoratingNectar',1]],'blackBear');},"a",function(){addReward([['honey',1000000]])},'bye']
}
window.dialogue_dapperBear_beesmas=function(player,items){
    
    let addCommas=(s)=>{for(let i=s.length-3;i>0;i-=3){s=s.substring(0,i)+','+s.substr(i,s.length)}return s},doGrammar=(s)=>{let str=s.slice(),_s='';for(let i in str){if(str[i].toLowerCase()!==str[i]){_s=_s+' '+str[i]}else{_s=_s+str[i]}}return _s[0].toUpperCase()+_s.substring(1,_s.length)},addReward=(arr)=>{
        
        for(let i in player.quests){
            
            if(player.quests[i].NPC==='dapperBear'&&player.quests[i].isBeesmasQuest) player.quests.splice(i,1)
            
        }
        
        for(let i in arr){
            
            if(arr[i][0]==='honey'){
                
                player.honey+=arr[i][1]
                
            } else {
                
                items[arr[i][0]].amount+=arr[i][1]
            }
            
            player.addMessage('+'+addCommas(arr[i][1]+'')+' '+doGrammar(arr[i][0])+' (from Dapper Bear)')
        }
        
        player.updateInventory()
    }

    return ["Hellorr!!! *russian accent*","This Beesmas, I've been cooking up some chic tea with my antique Samovar conveniently placed outside. But...FOCUSON[-86,26,114,3.1416,-0.35]","The horrendous oxidization is not helping. It's giving \"You remind me of...a horse manure brown.\"","All you need to do is help me with my quest which will repair the Samovar. It involves nectars, planters, honeysuckles, and all those stuffs.FOCUSON","Quickly!!! My tea is waiting!",function(){player.addQuest("Dapper Bear's Samovar",[['bluePollen',2000000],['pollenFromCactusField',1000000],['minutesOfRefreshingNectar',30],['minutesOfMotivatingNectar',30],['puffshrooms',10],['tokensFromPlanters',35],['gumdropsTokens',5]],'dapperBear*');},"That was quick!","Over here!FOCUSON[-86,26,114,3.1416,-0.35]","*shiny sparkling noises*COMPLETEMACHINE","Beautiful! It's shimmering!!","You can come over to the Samovar every 3 hours to get a random type of nectar and some honeysuckles.FOCUSON","Every time you use the Samovar, the brew gets stronger.","Now, have some of my rewards:",function(){addReward([['honey',3000000],['satisfyingVial',1],['smoothDice',3],['snowflake',25],['paperPlanter',5]])},"Thanks to you, my tea tastes much more exquisite. Now, off you go to help the other dwellers on this mountain with their Beesmas wishes."]
}

window.dialogue_giftedBuckoBee=function(player,items,NPCs){
    
    let addCommas=(s)=>{for(let i=s.length-3;i>0;i-=3){s=s.substring(0,i)+','+s.substr(i,s.length)}return s},doGrammar=(s)=>{let str=s.slice(),_s='';for(let i in str){if(str[i].toLowerCase()!==str[i]){_s=_s+' '+str[i]}else{_s=_s+str[i]}}return _s[0].toUpperCase()+_s.substring(1,_s.length)},addReward=(arr)=>{
        
        for(let i in player.quests){
            
            if(player.quests[i].NPC==='giftedBuckoBee') player.quests.splice(i,1)
            
        }
        
        for(let i in arr){
            
            if(arr[i][0]==='honey'){
                
                player.honey+=arr[i][1]
                
            } else {
                
                items[arr[i][0]].amount+=arr[i][1]
            }
            
            player.addMessage('+'+addCommas(arr[i][1]+'')+' '+doGrammar(arr[i][0])+' (from Gifted Bucko Bee)')
        }
        
        player.updateInventory()
        NPCs.giftedBuckoBee.portionsDone++
    }
    
    return function(diff){

        if(!NPCs.giftedBuckoBee.translatored){

            return ['Buzz buzz','Buzz!','Buzzy buzz?','??','Buzz buzz','...','(You struggle to understand Gifted Bucko Bee)',[['Give a translator to Gifted Bucko Bee',function(){if(items.translator.amount>0){items.translator.amount--;player.updateInventory();player.addMessage('-1 Translator');NPCs.giftedBuckoBee.translatored=true;player.justUsedATranslator=2;NPCs.giftedBuckoBee.dialogue.push('','Yay!! :D')}else{player.addMessage('You don\'t have a Translator!',[255,0,0]);NPCs.giftedBuckoBee.dialogue.push('','boop buzz boop :C')}NPCs.giftedBuckoBee.dialogueIndex++}],['Leave...',function(){NPCs.giftedBuckoBee.dialogue.push('','buzz buzz :(');NPCs.giftedBuckoBee.dialogueIndex++}]]]
        }

        let rand=mulberry32(NPCs.giftedBuckoBee.seed+diff)
        
        let rew=[['honey',diff*diff*70000+100000],['blueExtract',1]]
        
        if(diff){
            
            if(!(diff%3)) rew.push(['royalJelly',1])
            
            if(!(diff%2)) rew.push(['blueberry',5])
            
            if(diff===10){
                
                rew.push(['giftedSilverEgg',1])
                
            } else if(diff===20){
                
                rew.push(['giftedGoldEgg',1])
                
            } else if(diff===50){
                
                rew.push(['giftedDiamondEgg',1])
                
            } else if(diff===100){
                
                rew.push(['giftedMythicEgg',1])
            }
        }
        return ['!!!',"Welcome to/back to the Blue HQ!","Be sure you complete my quests often for bluey rewards!","Buzz buzz...","Here's your quest!",
    
            function(){
                
                switch((rand()*8)|0){
                    
                    case 0:
                        
                        player.addQuest('Bucko Bee: Pollen',[['bluePollen',diff*diff*100000+100000]],'giftedBuckoBee')
                        
                    break;
                    
                    case 1:
                        
                        player.addQuest('Bucko Bee: Picnic',[['pollenFromBlueFlowerField',diff*diff*35000+35000],['blueberry',5],['ant',20]],'giftedBuckoBee')
                        
                    break;
                    
                    case 2:
                        
                        player.addQuest('Bucko Bee: Cleanup',[['pollenFromBambooField',diff*diff*40000+40000],['goo',diff*diff*4000+5000],['gumdropsTokens',2]],'giftedBuckoBee')
                        
                    break;
                    
                    case 3:
                        
                        player.addQuest('Bucko Bee: Pinecones',[['pollenFromPineTreeForest',diff*diff*75000+75000]],'giftedBuckoBee')
                        
                    break;
                    
                    case 4:
                        
                        player.addQuest('Bucko Bee: Abilities',[['blueAbilityTokens',diff*3+25],['blueBoostTokens',diff*2+10],['blueBombTokens',diff*2+10]],'giftedBuckoBee')
                        
                    break;
                    
                    case 5:
                        
                        player.addQuest('Bucko Bee: Attack',[['battleTokens',(diff*0.5|0)+5],['hasteTokens',15],['rhinoBeetle',Math.min(((diff*0.1)|0)+2,10)],['mantis',Math.min(((diff*0.1)|0)+1,6)]],'giftedBuckoBee')
                        
                    break;
                    
                    case 6:
                        
                        player.addQuest('Bucko Bee: Scrubb',[['bubbles',((diff*diff*0.015)|0)+3],['bluePollen',(diff+1)*(diff+1)*75000+414],['flyingAnt',5]],'giftedBuckoBee')
                        
                    break;
                    
                    case 7:
                        
                        player.addQuest('Bucko Bee: Variety',[['pollenFromPineTreeForest',diff*diff*30000+30000],['pollenFromBambooField',diff*diff*22500+22500],['pollenFromBlueFlowerField',diff*diff*15000+15000]],'giftedBuckoBee')
                        
                    break;
                }
            }
    
        ,"Buzz!","Here are some rewards!","Come back for another quest!","Buzz...buzz...",function(){addReward(rew)}
        
        ]
    }
}

window.dialogue_giftedBuckoBee_beesmas=function(player,items){
    
    let addCommas=(s)=>{for(let i=s.length-3;i>0;i-=3){s=s.substring(0,i)+','+s.substr(i,s.length)}return s},doGrammar=(s)=>{let str=s.slice(),_s='';for(let i in str){if(str[i].toLowerCase()!==str[i]){_s=_s+' '+str[i]}else{_s=_s+str[i]}}return _s[0].toUpperCase()+_s.substring(1,_s.length)},addReward=(arr)=>{
        
        for(let i in player.quests){
            
            if(player.quests[i].NPC==='giftedBuckoBee'&&player.quests[i].isBeesmasQuest) player.quests.splice(i,1)
            
        }
        
        for(let i in arr){
            
            if(arr[i][0]==='honey'){
                
                player.honey+=arr[i][1]
                
            } else {
                
                items[arr[i][0]].amount+=arr[i][1]
            }
            
            player.addMessage('+'+addCommas(arr[i][1]+'')+' '+doGrammar(arr[i][0])+' (from Gifted Bucko Bee)')
        }
        
        player.updateInventory()
    }

    return ["Hey hey!","It's winter! We blue bees need a more powerful weapon to fight the red bees at their little house over there.","You're gonna help us make a big snow generator, capable of creating a blizzard!FOCUSON[-58,19,28,-2.5,-0.4]","It's not finished yet- we nede your help!","Complete our quest and help us build our snow machine. In return, we'll let you use it while also giving you some expensive items.FOCUSON",function(){player.addQuest("Bucko Bee's Snow Machine",[['bluePollen',100000000],['hoursOfComfortingNectar',3],['bubbles',100],['snowflake',250],['blueExtractTokens',3]],'giftedBuckoBee*');},"GG!","Now, stand back and open your eyes!!FOCUSON[-58,19,28,-2.5,-0.4]","*destructive cold metal noises*COMPLETEMACHINE","Hahahahahahahaha","Now, the red bees will be so jealous!FOCUSON","Now that you've helped us, come back every 4 hours to use our snow machine to create a massive snow storm. Collect the little snowflakes for Bee Bear or whoever.","Have something:",function(){addReward([['honey',150000000],['ticket',10],['blueExtract',10],['motivatingVial',1],['snowflake',50],['softWax',5]])},"Now, go back to work! Complete my repeatable quests for more items.","Also, you *totally* should give me a Beesmas present. but ummmm not pressuring :)","Buzz buzz byeee!!"]
}

window.dialogue_giftedRileyBee=function(player,items,NPCs){
    
    let addCommas=(s)=>{for(let i=s.length-3;i>0;i-=3){s=s.substring(0,i)+','+s.substr(i,s.length)}return s},doGrammar=(s)=>{let str=s.slice(),_s='';for(let i in str){if(str[i].toLowerCase()!==str[i]){_s=_s+' '+str[i]}else{_s=_s+str[i]}}return _s[0].toUpperCase()+_s.substring(1,_s.length)},addReward=(arr)=>{
        
        for(let i in player.quests){
            
            if(player.quests[i].NPC==='giftedRileyBee') player.quests.splice(i,1)
            
        }
        
        for(let i in arr){
            
            if(arr[i][0]==='honey'){
                
                player.honey+=arr[i][1]
                
            } else {
                
                items[arr[i][0]].amount+=arr[i][1]
            }
            
            player.addMessage('+'+addCommas(arr[i][1]+'')+' '+doGrammar(arr[i][0])+' (from Gifted Riley Bee)')
        }
        
        player.updateInventory()
        NPCs.giftedRileyBee.portionsDone++
    }
    
    return function(diff){

        if(!NPCs.giftedRileyBee.translatored){

            return ['Buzz... buzz','Buzzy?','Buzz buzz!','...','Buzz buzz','..?','(You struggle to understand Gifted Riley Bee)',[['Give a translator to Gifted Riley Bee',function(){if(items.translator.amount>0){items.translator.amount--;player.updateInventory();player.addMessage('-1 Translator');NPCs.giftedRileyBee.translatored=true;player.justUsedATranslator=2;NPCs.giftedRileyBee.dialogue.push('','Hooray!! :D')}else{player.addMessage('You don\'t have a Translator!',[255,0,0]);NPCs.giftedRileyBee.dialogue.push('','boop buzz')}NPCs.giftedRileyBee.dialogueIndex++}],['Leave...',function(){NPCs.giftedRileyBee.dialogue.push('','buzz buzz');NPCs.giftedRileyBee.dialogueIndex++}]]]
        }

        let rand=mulberry32(NPCs.giftedRileyBee.seed+diff)
        
        let rew=[['honey',diff*diff*70000+100000],['redExtract',1]]
        
        if(diff){
            
            if(!(diff%3)) rew.push(['royalJelly',1])
            
            if(!(diff%2)) rew.push(['strawberry',5])
            
            if(diff===10){
                
                rew.push(['giftedSilverEgg',1])
                
            } else if(diff===20){
                
                rew.push(['giftedGoldEgg',1])
                
            } else if(diff===50){
                
                rew.push(['giftedDiamondEgg',1])
                
            } else if(diff===100){
                
                rew.push(['giftedMythicEgg',1])
            }
        }
        
        return ['!!!',"Hello! Welcome back to Red HQ!","Make sure to complete my quests often! I'll give out lots of rewards!","Buzz buzz...","Here's your quest! Make sure to spy on the blue bees while you're at it!",
    
            function(){
                
                switch((rand()*8)|0){
                    
                    case 0:
                        
                        player.addQuest('Riley Bee: Pollen',[['redPollen',diff*diff*100000+100000]],'giftedRileyBee')
                        
                    break;
                    
                    case 1:
                        
                        player.addQuest('Riley Bee: Picnic',[['pollenFromMushroomField',diff*diff*35000+35000],['strawberry',5],['ant',20]],'giftedRileyBee')
                        
                    break;
                    
                    case 2:
                        
                        player.addQuest('Riley Bee: Cleanup',[['pollenFromStrawberryField',diff*diff*40000+40000],['goo',diff*diff*4000+5000],['gumdropsTokens',2]],'giftedRileyBee')
                        
                    break;
                    
                    case 3:
                        
                        player.addQuest('Riley Bee: Roses',[['pollenFromRoseField',diff*diff*75000+75000]],'giftedRileyBee')
                        
                    break;
                    
                    case 4:
                        
                        player.addQuest('Riley Bee: Abilities',[['redAbilityTokens',diff*3+25],['redBoostTokens',diff*2+10],['redBombTokens',diff*2+10]],'giftedRileyBee')
                        
                    break;
                    
                    case 5:
                        
                        player.addQuest('Riley Bee: Attack',[['battleTokens',(diff*0.5|0)+5],['rageTokens',5],['ladybug',Math.min(((diff*0.1)|0)+2,10)],['scorpion',Math.min(((diff*0.1)|0)+1,6)]],'giftedRileyBee')
                        
                    break;
                    
                    case 6:
                        
                        player.addQuest('Riley Bee: Burning Bad',[['flames',((diff*diff*0.015)|0)+3],['redPollen',(diff+1)*(diff+1)*75000+329],['fireAnt',5]],'giftedRileyBee')
                        
                    break;
                    
                    case 7:
                        
                        player.addQuest('Riley Bee: Variety',[['pollenFromRoseField',diff*diff*30000+30000],['pollenFromStrawberryField',diff*diff*22500+22500],['pollenFromMushroomField',diff*diff*15000+15000]],'giftedRileyBee')
                        
                    break;
                }
            }
    
        ,"Buzz!","Here buzz are some buzzy buzz rewards!","Come back to buzz me for another quest!","Buzz...buzz...",function(){addReward(rew)}
        
        ]
    }
}

window.dialogue_giftedRileyBee_beesmas=function(player,items){
    
    let addCommas=(s)=>{for(let i=s.length-3;i>0;i-=3){s=s.substring(0,i)+','+s.substr(i,s.length)}return s},doGrammar=(s)=>{let str=s.slice(),_s='';for(let i in str){if(str[i].toLowerCase()!==str[i]){_s=_s+' '+str[i]}else{_s=_s+str[i]}}return _s[0].toUpperCase()+_s.substring(1,_s.length)},addReward=(arr)=>{
        
        for(let i in player.quests){
            
            if(player.quests[i].NPC==='giftedRileyBee'&&player.quests[i].isBeesmasQuest) player.quests.splice(i,1)
            
        }
        
        for(let i in arr){
            
            if(arr[i][0]==='honey'){
                
                player.honey+=arr[i][1]
                
            } else {
                
                items[arr[i][0]].amount+=arr[i][1]
            }
            
            player.addMessage('+'+addCommas(arr[i][1]+'')+' '+doGrammar(arr[i][0])+' (from Gifted Riley Bee)')
        }
        
        player.updateInventory()
    }

    return ["Beesmas is upon us!","We bees at the Red HQ need some more warmth and cozyness(if that's a word)","Them blue bees are going off with some crazy metal contraption :eyeroll: but we're not bullies like them.","Here's our Beesmas plan!FOCUSON[53,12,8.5,1.5708,-0.1]","It's supposed to be some warm and fuzzy candles...","Help us light the flames and you can use it too!FOCUSON",function(){player.addQuest("Riley Bee's Honeyday Candles",[['redPollen',100000000],['hoursOfInvigoratingNectar',3],['flames',100],['gingerbreadBear',10],['redExtractTokens',3]],'giftedRileyBee*');},"Yay!!","Now, let's light up this thang!FOCUSON[53,12,8.5,1.5708,-0.1]","*whoosing fire*COMPLETEMACHINE","So expensive and boujie!","This beats the cold scrap metal over there at the Blue HQ.FOCUSON","You can come over to use the candles every 4 hours to get waxes and create temporary bees with the power of Beesmas magic!","You earned it!",function(){addReward([['honey',150000000],['ticket',10],['redExtract',10],['refreshingVial',1],['gingerbreadBear',3],['redBalloon',2]])},"Continue doing my other boring quests and help the bears on this mountain!","Also, go try opening more gift boxes scattered around the map!"]
}

window.dialogue_stickbug=function(player,items,NPCs){
    
    let addCommas=(s)=>{for(let i=s.length-3;i>0;i-=3){s=s.substring(0,i)+','+s.substr(i,s.length)}return s},doGrammar=(s)=>{let str=s.slice(),_s='';for(let i in str){if(str[i].toLowerCase()!==str[i]){_s=_s+' '+str[i]}else{_s=_s+str[i]}}return _s[0].toUpperCase()+_s.substring(1,_s.length)},addReward=(arr)=>{
        
        for(let i in player.quests){
            
            if(player.quests[i].NPC==='stickbug') player.quests.splice(i,1)
            
        }
        
        for(let i in arr){
            
            if(arr[i][0]==='honey'){
                
                player.honey+=arr[i][1]
                
            } else {
                
                items[arr[i][0]].amount+=arr[i][1]
            }
            
            player.addMessage('+'+addCommas(arr[i][1]+'')+' '+doGrammar(arr[i][0])+' (from Stickbug)')
        }
        
        player.updateInventory()
        NPCs.stickbug.portionsDone++
    }
    
    return function(diff){

        if(!NPCs.stickbug.translatored){

            return ['Tsktsktsktsktsk','..?','tsk tsk vskvskvsk tsk','hydroflaskskskksksksksksk','teehheeskkheeskksk','(Stickbug is speaking in bug noises)',[['Give a translator to Stickbug',function(){if(items.translator.amount>0){items.translator.amount--;player.updateInventory();player.addMessage('-1 Translator');NPCs.stickbug.translatored=true;player.justUsedATranslator=2;NPCs.stickbug.dialogue.push('','AND I OOP-')}else{player.addMessage('You don\'t have a Translator!',[255,0,0]);NPCs.stickbug.dialogue.push('','skskskskskk🙄💅')}NPCs.stickbug.dialogueIndex++}],['Leave...',function(){NPCs.stickbug.dialogue.push('','tsksk tsks...');NPCs.stickbug.dialogueIndex++}]]]
        }

        return ['!!!',"Hey there flesh-bug. Feeling brave?","How about you and your friends join me in my dance? Once it starts. I'll hop into the fields. Deal as much damage to me as you can to me in 10 minutes to earn rewards.","The higher the score the better the rewards will be. Ready to get down?","Get ready!",

        [['Start the challenge (Free entry)',

            function(){if(Date.now()-player.extraInfo.freeStickbugPass<8*60*60*1000){NPCs.stickbug.dialogue.push('','You can have a free entry to the Stickbug Challenge in '+(function(s){return (s>=3600?((0.00027777777*s)|0)+'h ':'')+(s>=60?(((0.0166666667*s)%60)|0)+'m ':'')+(s|0)%60+'s'})((8*60*60-(Date.now()-player.extraInfo.freeStickbugPass)*0.001)+'')+'!');}else{NPCs.stickbug.dialogue.push('','Ok! You\'re on!',function(){player.startStickbugChallenge();player.extraInfo.freeStickbugPass=Math.ceil(Date.now())});}NPCs.stickbug.dialogueIndex++}

        ],['Start Robo Challenge(35 tickets)',

        function(){if(items.ticket.amount<35){NPCs.stickbug.dialogue.push('','You don\'t have 35 tickets, brokie!!');}else{items.ticket.amount-=35;player.updateInventory();player.addMessage('-35 Tickets');NPCs.stickbug.dialogue.push('','Ok! You\'re on!',function(){player.startStickbugChallenge();})}NPCs.stickbug.dialogueIndex++}

        ],['Leave...',
            function(){NPCs.stickbug.dialogue.push('','Come back later, chicken!');NPCs.stickbug.dialogueIndex++}
        ]]

        ]
    }
}

window.dialogue_stickbug_beesmas=function(player,items){
    
    let addCommas=(s)=>{for(let i=s.length-3;i>0;i-=3){s=s.substring(0,i)+','+s.substr(i,s.length)}return s},doGrammar=(s)=>{let str=s.slice(),_s='';for(let i in str){if(str[i].toLowerCase()!==str[i]){_s=_s+' '+str[i]}else{_s=_s+str[i]}}return _s[0].toUpperCase()+_s.substring(1,_s.length)},addReward=(arr)=>{
        
        for(let i in player.quests){
            
            if(player.quests[i].NPC==='stickbug'&&player.quests[i].isBeesmasQuest) player.quests.splice(i,1)
            
        }
        
        for(let i in arr){
            
            if(arr[i][0]==='honey'){
                
                player.honey+=arr[i][1]
                
            } else {
                
                items[arr[i][0]].amount+=arr[i][1]
            }
            
            player.addMessage('+'+addCommas(arr[i][1]+'')+' '+doGrammar(arr[i][0])+' (from Stickbug)')
        }
        
        player.updateInventory()
    }

    return ["TSKSKSK","Chilly Beesmas season!","To get fiesty and festive, I'm decorating my stick nymphs with little Beesmas hats.","If you don't know, stick nymphs are my little minions I create when you challenge me to fight.","I would point somewhere weird like the bears here, but I don't have a big fancy display to gloat about.","Well you'll see the hats on my nymphs...obviously. That or somebody was too lazy to make an actual Beesmas showcase thing for me.","But it's the thought that counts.","Anyways, I need you to complete my quest, so GET STARTED TTSSKKSKS",function(){player.addQuest("Stickbug's Nymph Hats",[['pollen',2500000000],['redPollen',1000000000],['pollenFromPineapplePatch',100000000],['tokensFromStickbug',100],['tokensFromStickNymphs',250],['honeyTokens',300],['epicPuffshrooms',1],['mechsquito',10],['cogmower',5]],'stickbug*');},"You're done!","How very cute. The little hats are so nice and festive.","Well it's not like you can see them, but just challenge me to a battle and I'll summon my stick nyphms eventually once I get sick of you.COMPLETEMACHINE","Have some festive things I pulled out of Bee Bear's trash can:",function(){addReward([['honey',3333333333],['ticket',15],['stinger',15],['starJelly',10],['gingerbreadBear',10],['bitterberry',250],['turpentine',1]])},"I still can't get over how cute my little stick nymphs are tsksksksk-","Speaking of sticks, I SEE ONE RIGHT THERE ITS YOU SO MOVE IT I HAVE NOTHING ELSE TO SAY BYE"]
}

window.dialogue_honeyBee=function(player,items,NPCs){
    
    let addCommas=(s)=>{for(let i=s.length-3;i>0;i-=3){s=s.substring(0,i)+','+s.substr(i,s.length)}return s},doGrammar=(s)=>{let str=s.slice(),_s='';for(let i in str){if(str[i].toLowerCase()!==str[i]){_s=_s+' '+str[i]}else{_s=_s+str[i]}}return _s[0].toUpperCase()+_s.substring(1,_s.length)},addReward=(arr)=>{
        
        player.addEffect('conversionBoost')
        player.addMessage('Activated "Conversion Boost"')

        for(let i in player.quests){
            
            if(player.quests[i].NPC==='honeyBee') player.quests.splice(i,1)
            
        }
        
        for(let i in arr){
            
            if(arr[i][0]==='honey'){
                
                player.honey+=arr[i][1]
                
            } else {
                
                items[arr[i][0]].amount+=arr[i][1]
            }
            
            player.addMessage('+'+addCommas(arr[i][1]+'')+' '+doGrammar(arr[i][0])+' (from Honey Bee)')
        }
        
        player.updateInventory()
        NPCs.honeyBee.portionsDone++
    }
    
    return function(diff){

        let rand=mulberry32(NPCs.honeyBee.seed+diff)
        
        let rew=[['honey',5*(diff+1)*(diff+1)+1000]]
        
        if(rand()<0.5){
            
            rew.push(['treat',Math.min((diff*0.5+10)|0,75)])
            
        } else {
            
            rew.push(['honeysuckle',Math.min((diff*0.5+3)|0,15)])
        }
        
        if(diff){
            
            if(!(diff%2)) rew.push(['royalJelly',1])
            
            if(!(diff%3)) rew.push(['whirligig',1])
            
            if(!(diff%4)) rew.push(['jellyBeans',1])
            
            if(!(diff%6)) rew.push(['ticket',5])
            
            if(!(diff%7)) rew.push(['magicBean',1])
            
            if(!(diff%10)) rew.push(['starJelly',1])
        }
        
        return ["Buzz buzz","Buzz buzz...buzz?","Buzz buzz!","(You can't tell what Honey Bee is trying to say.)","(Its desire for Honey Tokens is as clear as day.)","Buzz!","(It's trying to tell you something...)","(If you complete its quests, it'll boost your conversion rate for a while!)","Buzz buzz BUZZ!",
        
            function(){
                
                player.addQuest('Honey Bee\'s Honey Hunt',[['honeyTokens',2*(diff+1)+5]],'honeyBee')
                
            }
    
        ,"Buzz!","Buzz...buzz buzz!","Buzz buzz buzz?!","(Honey Bee will now bless you with 30 minutes of x2 conversion rate!)","Buzz...buzz...",function(){addReward(rew)}
        
        ]
    }
}

window.dialogue_honeyBee_beesmas=function(player,items){
    
    let addCommas=(s)=>{for(let i=s.length-3;i>0;i-=3){s=s.substring(0,i)+','+s.substr(i,s.length)}return s},doGrammar=(s)=>{let str=s.slice(),_s='';for(let i in str){if(str[i].toLowerCase()!==str[i]){_s=_s+' '+str[i]}else{_s=_s+str[i]}}return _s[0].toUpperCase()+_s.substring(1,_s.length)},addReward=(arr)=>{
        
        for(let i in player.quests){
            
            if(player.quests[i].NPC==='honeyBee'&&player.quests[i].isBeesmasQuest) player.quests.splice(i,1)
            
        }
        
        for(let i in arr){
            
            if(arr[i][0]==='honey'){
                
                player.honey+=arr[i][1]
                
            } else {
                
                items[arr[i][0]].amount+=arr[i][1]
            }
            
            player.addMessage('+'+addCommas(arr[i][1]+'')+' '+doGrammar(arr[i][0])+' (from Honey Bee)')
        }
        
        player.updateInventory()
    }

    return ["Buzz buzz!!","tzzz Bzzzmzzz buzzzzz buzzz","(As usual, Honey Bee doesn't make much sense)","Buzzz zzzz buzzzz *points to Black Bear*","buzzz buzz bBbBuzz!FOCUSON[31,6,-3.5,1.2,-0.25]","(Honey Bee wants to do something to Black Bear's wreath...)","buzz buzzz??FOCUSON","(Honey Bee gives you a quest...)",function(){player.addQuest("Honey Bee's Honey Wreath?",[['honeyTokens',2500],['markTokens',200],['linkTokens',200],['honeysuckle',125],['whirligig',35],['honeysuckleTokens',25],['fieldDiceTokens',10],['oil',5],['enzymes',5],['softWax',5],['goldenCogmower',3]],'honeyBee*');},"Buzz buzz!!!","...FOCUSON[31,6,-3.5,1.2,-0.25]","BUZZZZZzzzzz!COMPLETEMACHINE","Buzz buzzz buz buzzz","...?FOCUSON","(You sense that the Black Bear's Honey Wreath will give you bonus Honey and summon a temporary Honey Bee...)","Buzzzzy!",function(){addReward([['honey',444444444],['treat',777777],['gingerbreadBear',9],['ticket',11],['magicBean',9],['royalJelly',77],['purplePotion',3],['microConverter',9]]);player.addMessage('Honey Bee has summoned a Honey Storm!',[200,180,0]);player.startHoneyStorm()},"Buzz Bzzzmazz byezz!"]
}

window.dialogue_antChallengeSign=function(player,items,NPCs){
    
    return function(diff){

        return ["The Ant Challenge is a minigame involving waves of ants.","As you collect pollen, the pollen meter fills up.","Filling up the pollen meter will cause ants to fly out and attack. This counts as 1 round.","Every ant defeated contributes as 1 point.","The challenge ends when the player dies or when the 5 minute timer ends.","In the later rounds, lawnmowers will run through the field, damaging the player.","End the challenge with a high score to earn better rewards and Ant Amulets.","A Bronze Ant Amulet will be rewarded if your score between 0-24. Silver: 25-49, Gold: 50-99, Diamond: 100-149, Supreme: 150+","That's it! Have fun!"]
    }
}

window.dialogue_bubbleHbeeMan_beesmas=function(player,items){
    
    let addCommas=(s)=>{for(let i=s.length-3;i>0;i-=3){s=s.substring(0,i)+','+s.substr(i,s.length)}return s},doGrammar=(s)=>{let str=s.slice(),_s='';for(let i in str){if(str[i].toLowerCase()!==str[i]){_s=_s+' '+str[i]}else{_s=_s+str[i]}}return _s[0].toUpperCase()+_s.substring(1,_s.length)},addReward=(arr)=>{
        
        for(let i in player.quests){
            
            if(player.quests[i].NPC==='bubbleHbeeMan'&&player.quests[i].isBeesmasQuest) player.quests.splice(i,1)
            
        }
        
        for(let i in arr){
            
            if(arr[i][0]==='honey'){
                
                player.honey+=arr[i][1]
                
            } else {
                
                items[arr[i][0]].amount+=arr[i][1]
            }
            
            player.addMessage('+'+addCommas(arr[i][1]+'')+' '+doGrammar(arr[i][0])+' (from Bubble Hbee Man)')
        }
        
        player.updateInventory()
    }

    return ["o hi there","well you might have some questions so ill yap at it b4 giving u my beesmas yap","so like im Bubble Hbee Man. ya u heard that right","i was supposed to be hb the pencil but i had a glow up for beesmas- because it'll just be so wrong without a naughty list here!","(hb the pencil is like gone now but if ur here IM TALKING TO U)","(um so now since HB is now the new bubble <s>bee</s> Hbee man ive retired his old questline(for moving out of ka and the other inspiring guy and my laziness))","(anyways end of tangent back to him and his beesmas machine)","right thats what my beesmas invention is- a naughty list!!","gosh it feels so good to talk like this without having to use proper grammar like the other puny npcs","anyways ignore my tangent(s)- so like im making a naughty list but its not doneFOCUSON[-25,51.8,129,3.1416,-0.2]","see i told u it wasnt done","so help my with my big quest!!FOCUSON","but beware my quest is the hardest ever!! ok have a go at it i dare you","(for fun reasons im making my quest much easier than the original bubble bee man cuz this game isnt supposed to be grindy)","so cmon I DARE U TEST ME",'this is your last chance to exit the game in order to escape talking to me. 1 more click and youll have a quest youll continue to stare at, unfinished for the rest of ur life','lasttt warning the quest also might lag ur game cuz its so long :skull:','this is the lasttt lastt warning its a very high level quest and requires huge mental capacity'
    ,'ok u asked for it-','(jk i(the developer) actually play this game cuz im bored so i cant make it toooo hard cuz ill try completing it at some point)',function(){player.addQuest("B.Hb.M.'s Naughty List",[['pollen',25252525225252],['bluePollen',2352352352350],['goo',222222222222],['pollenFromStumpField',202325248194],['abilityTokens',2062],['bubbles',1204],['blueberry',4321],['battleTokens',3141],['markTokens',456],['rageTokens',224],['tokensFromFestiveNymphs',999],['festiveNymph',235],['inspireTokens',222],['fallingCoconuts',255],['timesUsingTheSlingshot',379],['itemsUsingTheBlender',406],['mythicPuffshrooms',7],['fallingMythicMeteors',111],['glueToTheWindShrine',2],['tunnelBear',4],['stumpSnail',1]],'bubbleHbeeMan*');},"wait thats so crazy u actually went off","act like im excited","so take a look igFOCUSON[-25,51.8,129,3.1416,-0.2]","there!! its doneCOMPLETEMACHINE","well thats good enough for me","anywaysFOCUSON","so every 8 hrs u can use my naughty list to punish naughty kids(urself)","itll give you some weak buffs (that i didnt even know existed)","youll also might get a piece of coal to put on ur bees as a funcy beequip thing","im supposed to give u some stuff so here take it and leave",function(){addReward([['honey',1000000000000],['treat',5],['giftedMythicEgg',4],['blackBalloon',3],['jellyBeans',2],['starEgg',1]])},"ok byeee and make sure to give me a present because u...can"]
}

window.dialogue_gummyBear=function(player,items,NPCs){
    
    return function(diff){

        return ["What's sweeter than honey?","Glorious gumdrops... they're just the start!","A sweet and sour, ooey-gooey universe...","Can't you see it too?","...","What's that Gummy Bee?","(Gummy Bee's invisible ghostly presense whipsers from somewhere nearby)","They're not seeing clearly?","YOU'RE ALWAYS RIGHT!","GOO-dbye, beekeeper... HAH!",function(){player.body.position.y=-1000;window.setTimeout(()=>{player.updateHive()},2000)}]
    }
}

window.dialogue_gummyBear_beesmas=function(player,items){
    
    let addCommas=(s)=>{for(let i=s.length-3;i>0;i-=3){s=s.substring(0,i)+','+s.substr(i,s.length)}return s},doGrammar=(s)=>{let str=s.slice(),_s='';for(let i in str){if(str[i].toLowerCase()!==str[i]){_s=_s+' '+str[i]}else{_s=_s+str[i]}}return _s[0].toUpperCase()+_s.substring(1,_s.length)},addReward=(arr)=>{
        
        for(let i in player.quests){
            
            if(player.quests[i].NPC==='gummyBear'&&player.quests[i].isBeesmasQuest) player.quests.splice(i,1)
            
        }
        
        for(let i in arr){
            
            if(arr[i][0]==='honey'){
                
                player.honey+=arr[i][1]
                
            } else {
                
                items[arr[i][0]].amount+=arr[i][1]
            }
            
            player.addMessage('+'+addCommas(arr[i][1]+'')+' '+doGrammar(arr[i][0])+' (from Gummy Bear)')
        }
        
        player.updateInventory()
    }

    return ["Ho hoh ho ho!","I, Gummy Bear(not santa because i laughed like that), has formulated a master plan to take over the mountain.","Here it is!FOCUSON[-24,16,9.5,-0.1,-0.5]","Y'know how like in superhero movies the beacon things do cool stuff-","Yeah, mine will raid and cover the mountain in goo!FOCUSON","...Only if I can get it working. I'll need your help!",function(){player.addQuest("Gummy Bear's Goo Years Beacon",[['goo',50000000],['gumdropsTokens',1000],['gumdropsToTheWindShrine',999],['ant',999],['cogTurret',50],['rarePuffshrooms',35],['legendaryPuffshrooms',3],['hoursOfSatisfyingNectar',8],['tokensFromSprouts',333],['mondoChick',3],['timesUsingTheRedCannon',50],['timesUsingTheYellowCannon',50],['timesUsingTheBlueCannon',50],['timesUsingTheSlingshot',50]],'gummyBear*');},"Muahahahahah!!","Stare at it!!FOCUSON[-24,16,9.5,-0.1,-0.5]","*squish squish*COMPLETEMACHINE","Deliciously gooey and sweet!","Every 6 hours, you can call upon a Gummy Siege with my beacon and cover the fields with goo!FOCUSON","You'll also get some extra temporary gummy bee friends to help with pollen collecting.","Have my junk:",function(){addReward([['honey',150000000],['ticket',25],['snowflake',500],['pinkBalloon',8],['glue',15],['purplePotion',7],['atomicTreat',15],['superSmoothie',5],['causticWax',3]])},"I got all I wanted for Beesmas! But if you ever have one, feel free to visit me in my lair and give me a present!","Byee!!!"]
}

window.dialogue_beeBear=function(player,items){
    
    let addCommas=(s)=>{for(let i=s.length-3;i>0;i-=3){s=s.substring(0,i)+','+s.substr(i,s.length)}return s},doGrammar=(s)=>{let str=s.slice(),_s='';for(let i in str){if(str[i].toLowerCase()!==str[i]){_s=_s+' '+str[i]}else{_s=_s+str[i]}}return _s[0].toUpperCase()+_s.substring(1,_s.length)},addReward=(arr)=>{
        
        for(let i in player.quests){
            
            if(player.quests[i].NPC==='beeBear') player.quests.splice(i,1)
            
        }
        
        for(let i in arr){
            
            if(arr[i][0]==='honey'){
                
                player.honey+=arr[i][1]
                
            } else {
                
                items[arr[i][0]].amount+=arr[i][1]
            }
            
            player.addMessage('+'+addCommas(arr[i][1]+'')+' '+doGrammar(arr[i][0])+' (from Bee Bear)')
        }
        
        player.updateInventory()
    }

    return ["HELLO ALL!!","It's Bee Bear, your local <s>vlogger</s> Beesmas guider!!","If you haven't already done so, go hatch a bee into your hive and collect pollen. You turn the pollen into honey, which you use to buy now tools and more bee eggs!","Do quests from stingy bears and get rewards!","However, I'll let you know everything about Beesmas and give you presents and great rewards for completing my quests! In the form of yapping.","As you can obviously see, the mountain is quite festive.","And over there, you have your Beesmas Tree!FOCUSON[-8,8,-2,-0.5,-0.2]","The tree will hold all of the ornaments you collect from bears, bees, and people for the duration of Beesmas!!","Ornaments you collect give you bonusses like more pollen.","You can go to your tree any time and view what you have!FOCUSON","During Beesmas, everybody likes to get festive and celebrate. Everyone has their own unique Beesmas creation which can be built after you help them with a quest.","For my first quest, have a go at collecting some pollen!",function(){player.addQuest('Beesmas Beginnings',[['beeTypes',1],['pollen',300]],'beeBear');},"Great!!","Now, I'll give you some rewards for your vErY hard work.",function(){addReward([['honey',100],['snowflake',1]])},"You saw that?!!?? A snowflake!!","Since it's winter, falling snowflakes will appear. You might spot a rare big chunky one that'll drop into a field.","You can collect snowflakes to use them or you can save them up to by things from my shop!","Bee Bear's Catalogue can be found on your toolbar on the top left.","Beesmas is limited edition! Get the best deals before they run out!","Anyhooooooo, have another go at my quests!",function(){player.addQuest('Snowflake Spotter',[['snowflakeTokens',2],['pollenFromDandelionField',1000]],'beeBear');},"Yes!",function(){addReward([['honey',1000],['treat',3]])},'How far have you been progressing?? My quests will start to rapidly increase in difficulty as you go through my Beesmas questline.','Some poeple can collect billions of pollen in a second, and some struggle to collect a thousand.',"You might not even have access to the different Bee Zones yet. Who knows?!?","If you're not a pro, you'll definitely need to progress a while if you're going to complete all my quests.","Whatever, next quest:",function(){player.addQuest('Snow Scavenging',[['pollen',5000],['snowflake',5]],'beeBear');},"Nice job!",function(){addReward([['honey',7000],['gingerbreadBear',1]])},"Now that you know the basics of Beesmas, I'll let you go on your own for a while.","In the meantime, go check out my shop!!!!!!","Also, if you didn't know, there are many Gift Boxes scattered around the map!","Each require you to help/a certain amount of NPCs",function(){player.addQuest('Snowing Up',[['whitePollen',15000],['pollenFromSpiderField',10000],['gingerbreadBear',1],['treatTokens',5]],'beeBear');},'Awesome. You\'re totally getting used to the quests...I think.',function(){addReward([['honey',20000],['ticket',3],['royalJelly',3]])},"I think you're ready for the first surprise!","After the next quest, I'll give you a Present!","You can give the present to any quest-givers around the map and they'll give you an ornament and bonus items in return!","Obviously, you can't give me a present. We need to keep the tree from being too crowded sOmEhOw.",function(){player.addQuest('Present Day',[['pollen',50000],['redPollen',25000],['snowflakeTokens',3]],'beeBear');},'Hooray! It\'s time for a giveaway!',function(){addReward([['honey',50000],['present',1],['gingerbreadBear',3]])},'From now on, I\'ll give you a present after every quest. There will be 15 presents in total, but some can\'t be earned through my quests. You\'ll have to discover them on your own!',"Advertisement: Save up your gingerbread bears and snowflakes to purchase from Bee Bear's Catalogue!!",function(){player.addQuest('Cabin Fever',[['bluePollen',100000],['abilityTokens',50],['snowflakeTokens',10],['ladybug',6]],'beeBear');},"Nice! Surely you had no problem with the quest.",function(){addReward([['honey',100000],['present',1],['gingerbreadBear',3],['snowflake',25]])},'Next quest!',function(){player.addQuest('Jingle Bells Rock',[['pollenFromMountainTopField',1500000],['honeysuckle',5],['whirligig',1],['boostTokens',25],['bombTokens',25]],'beeBear');},'continue....',function(){addReward([['honey',2000000],['present',1],['ticket',5],['royalJelly',10],['gumdrops',20]])},'Ok next quest I guess.',"REMINDER GO SHOP AT BEE BEARS CATALOGUE NOW LIMITED EDITION BEESMAS ITEMS",function(){player.addQuest('Slay Bells',[['bluePollen',4000000],['linkTokens',35],['focusTokens',35],['snowflakeTokens',15],['royalJellyTokens',4],['gumdropsTokens',4]],'beeBear');},'Ok yes, as usual.',function(){addReward([['honey',5000000],['present',1],['redExtract',2],['blueExtract',2],['glitter',1]])},"You've earned 4 presents so far! Keep it up!",function(){player.addQuest('Icebound Battleground: Reprise',[['pollenFromAntField',2000000],['goo',750000],['honeyTokens',50],['rogueViciousBee',1],['stinger',3]],'beeBear');},'Yay!!! I don\'t know what else to say.',function(){addReward([['honey',5000000],['present',1],['gingerbreadBear',3],['oil',2],['fieldDice',5],['jellyBeans',5]])},"Ok...continue I guess-",function(){player.addQuest('Snow Shoveling',[['pollen',50000000],['snowflakeTokens',25]],'beeBear');},"Great!",function(){addReward([['honey',20000000],['present',1],['gingerbreadBear',3],['pinkBalloon',1],['pineapple',50],['royalJelly',15]])},'Ok next quest. Nothing new.',function(){player.addQuest('Dream Catcher',[['redPollen',75000000],['bluePollen',75000000],['fallingBeesmasLights',20],['pollenFromCloverField',25000000],['linkTokens',50]],'beeBear');},'This is your 7th present! I\ll also throw in a Star Jelly for fun!',function(){addReward([['honey',100000000],['present',1],['starJelly',1],['gumdrops',25],['sunflowerSeed',75]])},'...','Another quest. What\'d ya expect?!?',function(){player.addQuest('Silver Spear',[['pollen',300000000],['stinger',10],['werewolf',3],['rogueViciousBee',2],['snowflakeTokens',6],['itemsUsingTheBlender',17],['rageTokens',18],['flames',11],['pollenFromPineTreeForest',111111111],['melodyTokens',11],['bubbles',11],['glitchedDrive',1],['moonCharmTokens',11]],'beeBear');},'Yay!!!!!',function(){addReward([['honey',300000000],['present',1],['whirligig',5],['honeysuckle',15],['smoothDice',3],['cloudVial',5]])},'Your next present is the 9th! You\'re nearing the end!',"If you haven't already, go purchase a present from the best shop ever(mine)!!","There's a present kept hidden by one of the NPCs. You might stumble upon it eventually.","Next!",function(){player.addQuest('Hot Coco',[['pollenFromCoconutField',300000000],['fallingCoconuts',25],['coconutTokens',100],['magicBean',3],['tropicalDrink',1],['tokensFromWildWindyBee',50]],'beeBear');},'Crabulous! Act like this is a very exciting celebration.',function(){addReward([['honey',400000000],['present',1],['tropicalDrink',5],['jellyBeans',10],['ticket',15],['gingerbreadBear',5]])},'Onto your 10th present!',function(){player.addQuest('Snow Puff',[['puffshrooms',75],['rarePuffshrooms',10],['epicPuffshrooms',3],['hoursOfNectar',3],['tokensFromPlanters',25],['glitter',3],['snowflakeTokens',25]],'beeBear');},'Fantastic!!',function(){addReward([['honey',500000000],['present',1],['magicBean',5],['snowflake',50],['starJelly',1],['purplePotion',1]])},'3 more quests to go!!',function(){player.addQuest('Nighttime',[['pollen',2500000000],['purplePotionToTheWindShrine',1],['starJellyToTheWindShrine',4],['moonCharmTokens',100],['tokensFromSprouts',250],['bombTokens',444],['timesUsingTheRedCannon',25],['inspireTokens',25],['snowflake',25]],'beeBear');},'Slayyyyyyyyy!!!',"Surprise!! I'll also reward you with a Mythic Egg!!!",function(){addReward([['honey',2500000000],['present',1],['loadedDice',3],['gumdrops',50],['snowflake',150],['gingerbreadBear',10],['mythicEgg',1]])},'2nd to last quest!',function(){player.addQuest('Honeydays',[['redPollen',7500000000],['pollenFromRoseField',1000000000],['honeyTokens',250],['treat',10000],['rarePuffshrooms',12],['legendaryPuffshrooms',1],['softWaxTokens',3],['boostTokens',300],['fallingMythicMeteors',25],['gingerbreadBearTokens',25],['magicBeanTokens',5]],'beeBear');},'Awesome!! Here\'s my 12th present!',function(){addReward([['honey',5000000000],['present',1],['whiteBalloon',3],['redBalloon',6],['smoothDice',5],['honeysuckle',25],['gingerbreadBear',10],['snowflake',100]])},"Here's your final Beesmas quest!","Ready? It'll be my hardest quest ever!!!",function(){player.addQuest('The Meltdown',[['whitePollen',100000000000],['bluePollen',25000000000],['goo',1000000000],['mythicPuffshrooms',1],['superSmoothie',1],['stinger',15],['cloudVial',10],['tokensFromWildWindyBee',250],['gingerbreadBearTokens',10],['fallingBeesmasLights',50],['fallingMythicMeteors',75],['festiveNymph',100],['snowflakeTokens',300],['stumpSnail',1]],'beeBear');},'Woah!!!',"You managed to get through all my quests!","Here's your final present, along with a Star Treat!",function(){addReward([['honey',100000000000],['present',1],['blackBalloon',1],['turpentine',1],['superSmoothie',1],['loadedDice',3],['starTreat',1],['snowflake',250],['gingerbreadBear',25]])},"Excellent job this Beesmas!","Keep spreading the Beesmas spirit and joy to everyone!!!","If you have nothing else left to do.....complete the mythical Bubble Hbee Man's quest. He's a manace to society, weilding a weapon of mass destruction locked under an impossible Beesmas quest.","Anyways, story time is over. I have nothing else left to say, so bye for now and see you next Beesmas!"]
    
}