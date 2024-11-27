declare module FullScreenMario {
    export interface IMapScreenr extends MapScreenr.IMapScreenr {
        bottomPlatformMax: number;
        canscroll: boolean;
        floor: number;
        gravity: number;
        jumpmod: number;
        lakitu?: ILakitu;
        maxyvel: number;
        maxyvelinv: number;
        nokeys: boolean;
        notime: boolean;
        sectionPassed?: boolean;
        spawningCheeps?: boolean;
        spawningBulletBills?: boolean;
        underwater?: boolean;
    }

    export interface IMap extends MapsCreatr.IMapsCreatrMap {
        locationDefault?: string;
        seed?: number | number[];
        time?: number;
    }

    export interface IArea extends MapsCreatr.IMapsCreatrArea {
        attributes?: {
            [i: string]: any;
        }
        exit?: string;
        background: string;
        onGameOver(FSM: IFullScreenMario): void;
        onGameOverTimeout: number;
        onPlayerDeath(FSM: IFullScreenMario): void;
        onPlayerDeathTimeout: number;
        sections?: any[];
        setBackground: (area: IArea) => void;
        time?: number;
    }

    export interface ILocation extends MapsCreatr.IMapsCreatrLocation {
        xloc: number;
        entrance?: IThing;
    }

    export interface IDeviceMotionStatus {
        motionDown: boolean;
        motionLeft: boolean;
        motionRight: boolean;
        x: number;
        y: number;
        dy: number;
    }

    export interface IPreThingSettings extends MapsCreatr.IPreThingSettings { }

    export interface IPreThing extends MapsCreatr.IPreThing {
        thing: IThing;
    }

    export interface IThing extends GameStartr.IThing {
        FSM: FullScreenMario;
        alive: boolean;
        collectionPartnerNames?: string[];
        dead?: boolean;
        flickering?: boolean;
        numquads: number;
        outerok: boolean | number;
        partners?: { [i: string]: IThing };
        position?: string;
        tolx: number;
        toly: number;
        x: number;
        y: number;
    }

    export interface IThingFloating extends IThing {
        begin: number;
        end: number;
        maxvel: number;
    }

    export interface IThingSliding extends IThing {
        begin: number;
        end: number;
        maxvel: number;
    }

    export interface ICustomText extends IThing {
        children: IText[];
        size: number;
        spacingHorizontal: number;
        spacingVertical: number;
        spacingVerticalBlank: number;
        textAttributes?: any;
        texts: ICustomTextInfo[];
    }

    export interface ICustomTextInfo {
        text: string;
        offset: number;
    }

    export interface IText extends IThing { }

    export interface ISolid extends IThing {
        actionLeft? (thing: ICharacter, other: ISolid, transport?: any): void;
        actionTop? (thing: ICharacter, other: ISolid, transport?: any): void;
        attachedCharacter?: ICharacter;
        bottomBump? (thing: ISolid, other: ICharacter): void;
        collide(thing: ICharacter, other: ISolid): void;
        collideHidden?: boolean;
        killonend?: boolean | { (thing: ISolid, group: ISolid[], i: number): void };
        onRestedUpon? (thing: ISolid, other: ICharacter): void;
        solid: boolean;
        transport?: any;
        up?: ICharacter;
    }

    export interface IBrick extends ISolid {
        breakable: boolean;
        contents?: string;
        lastcoin?: boolean;
        used: boolean;
    }

    export interface IBlock extends ISolid {
        contents: string;
        used: boolean;
    }

    export interface ICastleAxe extends ISolid { }

    export interface ICastleBlock extends ISolid {
        angle?: number;
        direction: number;
        dt?: number;
        fireballs: number;
        speed: number;
    }

    export interface IDetector extends ISolid {
        activate(thing: IThing): void;
    }

    export interface IDetectCollision extends IDetector {
        activateFail? (thing: ICharacter): void;
        activate(thing: ICharacter, other?: IDetectCollision): void;
        noActivateDeath?: boolean;
    }

    export interface IDetectWindow extends IDetector { }

    export interface ISectionDetector extends IDetectWindow {
        section: number;
    }

    export interface IRandomSpawner extends IDetector {
        randomization: string;
        randomTop: number;
        randomRight: number;
        randomBottom: number;
        randomLeft: number;
        randomWidth: number;
    }

    export interface IScrollBlocker extends IDetector {
        setEdge: boolean;
    }

    export interface IPipe extends ISolid { }

    export interface IPlatform extends ISolid {
        acceleration?: number;
        freefall?: boolean;
        fallThresholdStart?: number;
        fallThresholdEnd?: number;
        tension?: number;
        partners: {
            ownString: IThing;
            partnerString: IThing;
            partnerPlatform: IPlatform;
            [i: string]: IThing;
        }
    }

    export interface IRestingStone extends ISolid {
        activated: boolean;
    }

    export interface ISpringboard extends ISolid {
        heightNormal: number;
        tension: number;
        tensionSave?: number;
    }

    export interface IVine extends ISolid {
        attachedSolid: ISolid;
        speed: number;
    }

    export interface ICharacter extends IThing {
        allowUpSolids?: boolean;
        blockparent?: ISolid;
        animate? (thing: ICharacter, other?: ISolid): void;
        checkOverlaps?: boolean;
        collide? (thing: IThing, other: IThing): void;
        collidePrimary?: boolean;
        counter?: number;
        death(thing: IThing, severity?: number): void;
        direction: boolean | number;
        emergeOut? (thing: ICharacter, other: ISolid): void;
        gravity?: number;
        group: string;
        hopping?: boolean;
        jumpheight?: number;
        lookleft: boolean;
        killonend? (thing: IThing): void;
        player?: boolean;
        moveleft: boolean;
        nocollidechar?: boolean;
        nocollideplayer?: boolean;
        nocollidesolid?: boolean;
        nofire?: number;
        nofiredeath?: boolean;
        noflip?: boolean;
        nokillend?: boolean;
        nomove?: boolean;
        onCollideUp? (thing: ICharacter, other: ISolid): void;
        onResting? (thing: ICharacter, other: ISolid): void;
        overlaps?: ISolid[];
        resting?: ISolid;
        scoreBelow: number;
        scoreFire: number;
        scoreStar: number;
        shell?: boolean;
        shellspawn?: boolean;
        shelltype?: string;
        smart?: boolean;
        spawnType?: string;
        spawnSettings?: any;
        speed: number;
        type: string;
        undermid?: ISolid;
        onRestingOff? (character: ICharacter, other: ISolid): void;
        under?: ISolid[];
    }

    export interface ICharacterOverlapping extends ICharacter {
        overlapCheck: number;
        overlapGoal: number;
        overlapGoRight: boolean;
    }

    export interface IBrickShard extends ICharacter { }

    export interface ICastleFireball extends ICharacter { }

    export interface IEnemy extends ICharacter {
        deadly?: boolean;
        nostar?: boolean;
        shell?: boolean;
    }

    export interface IBlooper extends IEnemy {
        squeeze: number;
        counter: number;
    }

    export interface IBowserFire extends IEnemy {
        ylev: number;
    }

    export interface IBulletBill extends IEnemy { }

    export interface ICannon extends IEnemy {
        frequency: number;
        noBullets?: boolean;
    }

    export interface ICheepCheep extends IEnemy {
        flying: boolean;
    }

    export interface IFireball extends IEnemy {

    }

    export interface IGoomba extends IEnemy { }

    export interface IHammerBro extends IEnemy {
        counter: number;
        falling: boolean;
    }

    export interface IBowser extends IHammerBro {
        deathcount: number;
        fireTimes: number[];
        jumpTimes: number[];
        nothrow: boolean;
        throwAmount?: number;
        throwBetween?: number;
        throwDelay?: number;
        throwPeriod?: number;
        throwing: boolean;
    }

    export interface IKoopa extends IEnemy {
        jumping: boolean;
        floating: boolean;
    }

    export interface ILakitu extends IEnemy {
        fleeing?: boolean;
    }

    export interface IPiranha extends IEnemy {
        counter: number;
        countermax: number;
        direction: number;
        onPipe: boolean;
    }

    export interface IPodoboo extends IEnemy {
        acceleration: number;
        frequency: number;
        jumpHeight: number;
        starty: number;
    }

    export interface ISpinyEgg extends IEnemy {

    }

    export interface ISpiny extends IEnemy {

    }

    export interface IItem extends ICharacter {
        action? (thing: IPlayer, other: IItem): void;
    }

    export interface ICoin extends IItem {
        animate(thing: ICoin, other: ISolid): void;
        blockparent?: ISolid;
    }

    export interface IShell extends IItem {
        counting: number;
        enemyhitcount: number;
        hitcount: number;
        landing: number;
        peeking: number;
        shelltoleft: boolean;
        smart?: boolean;
        spawnSettings?: {
            smart?: boolean;
        }
    }

    export interface IStar extends IItem {
        star: boolean;
    }

    export interface IPlayer extends ICharacter {
        animatedClimbing?: boolean;
        attachedDirection?: number;
        attachedLeft?: boolean;
        attachedSolid?: ISolid;
        attachedOff?: number;
        canjump?: boolean;
        climbing?: boolean;
        crouching: boolean;
        dying?: boolean;
        fire(player: IPlayer): void;
        getKeys(): IPlayerKeys;
        jumpcount: number;
        jumpers?: number; // wat
        jumping?: boolean;
        keys: IPlayerKeys;
        maxspeed: number;
        maxspeedsave?: number;
        numballs: number;
        paddling?: boolean;
        paddlingCycle?: boolean;
        piping?: boolean;
        power: number;
        run: number;
        running: boolean;
        scrollspeed: number;
        skidding?: boolean;
        shrooming?: boolean;
        spring?: ISpringboard;
        star: number;
        swimming?: boolean;
        tolxOld?: number;
        tolyOld?: number;
        walkspeed: number;
    }

    export interface IPlayerKeys {
        crouch: boolean;
        jump: boolean;
        jumplev: number;
        leftDown?: boolean;
        piping: boolean;
        rightDown?: boolean;
        run: number;
        sprint: boolean;
        up: boolean;
    }

    export interface IScenery extends IThing { }

    export interface IFirework extends IScenery {
        animate(thing: IFirework): void;
    }

    export interface IFullScreenMario extends GameStartr.IGameStartr {
        MapScreener: IMapScreenr;
        settings: GameStartr.IGameStartrStoredSettings;
        unitsize: number;
        pointLevels: number[];
        customTextMappings: { [i: string]: string };
        player: IPlayer;
        deviceMotionStatus: IDeviceMotionStatus;
        gameStart(): void;
        gameOver(): void;
        thingProcess(thing: IThing, title: string, settings: any, defaults: any): void;
        addPreThing(prething: IPreThing): void;
        addPlayer(left?: number, bottom?: number): IPlayer;
        scrollPlayer(dx: number, dy?: number): void;
        onGamePause(FSM: FullScreenMario): void;
        onGamePlay(FSM: FullScreenMario): void;
        keyDownLeft(FSM: FullScreenMario, event?: Event): void;
        keyDownRight(FSM: FullScreenMario, event?: Event): void;
        keyDownUp(FSM: FullScreenMario, event?: Event): void;
        keyDownDown(FSM: FullScreenMario, event?: Event): void;
        keyDownSprint(FSM: FullScreenMario, event?: Event): void;
        keyDownPause(FSM: FullScreenMario, event?: Event): void;
        keyDownMute(FSM: FullScreenMario, event?: Event): void;
        keyUpLeft(FSM: FullScreenMario, event?: Event): void;
        keyUpRight(FSM: FullScreenMario, event?: Event): void;
        keyUpUp(FSM: FullScreenMario, event?: Event): void;
        keyUpDown(FSM: FullScreenMario, event?: Event): void;
        keyUpSprint(FSM: FullScreenMario, event?: Event): void;
        keyUpPause(FSM: FullScreenMario, event?: Event): void;
        mouseDownRight(FSM: FullScreenMario, event?: Event): void;
        deviceMotion(FSM: FullScreenMario, event: DeviceMotionEvent): void;
        canInputsTrigger(FSM: FullScreenMario): boolean;
        maintainTime(FSM: FullScreenMario): void;
        maintainScenery(FSM: FullScreenMario, scenery: IScenery[]): void;
        maintainSolids(FSM: FullScreenMario, solids: ISolid[]): void;
        maintainCharacters(FSM: FullScreenMario, characters: ICharacter[]): void;
        maintainOverlaps(character: ICharacterOverlapping): void;
        setOverlapBoundaries(thing: ICharacterOverlapping): boolean;
        maintainPlayer(FSM: FullScreenMario): void;
        generateCanThingCollide(): (thing: IThing) => boolean;
        isThingAlive(thing: IThing): boolean;
        isThingTouchingThing(thing: IThing, other: IThing): boolean;
        isThingOnThing(thing: IThing, other: IThing): boolean;
        isThingOnSolid(thing: IThing, other: IThing): boolean;
        isCharacterOnSolid(thing: ICharacter, other: ISolid): boolean;
        isCharacterOnResting(thing: ICharacter, other: ISolid): boolean;
        generateIsCharacterTouchingCharacter(): (thing: ICharacter, other: ICharacter) => boolean;
        generateIsCharacterTouchingSolid(): (thing: ICharacter, other: ISolid) => boolean;
        isCharacterAboveEnemy(thing: ICharacter, other: ICharacter): boolean;
        isCharacterBumpingSolid(thing: ICharacter, other: ISolid): boolean;
        isCharacterOverlappingSolid(thing: ICharacter, other: ISolid): boolean;
        isSolidOnCharacter(thing: ISolid, other: ICharacter): boolean;
        gainLife(amount: number, nosound?: boolean): void;
        itemJump(thing: IThing): void;
        jumpEnemy(thing: IPlayer, other: IEnemy): void;
        playerShroom(thing: IPlayer, other: IItem): void;
        playerShroom1Up(thing: ICharacter, other: IItem): void;
        playerStarUp(thing: IPlayer, timeout?: number): void;
        playerStarDown(thing: IPlayer): void;
        playerStarOffCycle(thing: IPlayer): void;
        playerStarOffFinal(thing: IPlayer): void;
        playerGetsBig(thing: IPlayer, noAnimation?: boolean): void;
        playerGetsBigAnimation(thing: IPlayer): void;
        playerGetsSmall(thing: IPlayer): void;
        playerGetsFire(thing: IPlayer): void;
        setPlayerSizeSmall(thing: IPlayer): void;
        setPlayerSizeLarge(thing: IPlayer): void;
        animatePlayerRemoveCrouch(thing: IPlayer): void;
        unattachPlayer(thing: IPlayer, other: ISolid): void;
        playerAddRestingStone(thing: IPlayer): void;
        markOverlap(thing: ICharacterOverlapping, other: ISolid): void;
        spawnDeadGoomba(thing: IThing): void;
        spawnHammerBro(thing: IHammerBro): void;
        spawnBowser(thing: IBowser): void;
        spawnPiranha(thing: IPiranha): void;
        spawnBlooper(thing: IBlooper): void;
        spawnPodoboo(thing: IPodoboo): void;
        spawnLakitu(thing: ILakitu): void;
        spawnCannon(thing: ICannon): void;
        spawnCastleBlock(thing: ICastleBlock): void
        spawnMoveFloating(thing: IThingFloating): void;
        spawnMoveSliding(thing: IThingSliding): void;
        spawnScalePlatform(thing: IPlatform): void;
        spawnRandomCheep(FSM: FullScreenMario): boolean;
        spawnRandomBulletBill(FSM: FullScreenMario): boolean;
        spawnCustomText(thing: ICustomText): void;
        spawnDetector(thing: IDetector): void;
        spawnScrollBlocker(thing: IScrollBlocker): void;
        spawnCollectionComponent(collection: any, thing: IThing): void;
        spawnCollectionPartner(collection: any, thing: IThing): void;
        spawnRandomSpawner(thing: IRandomSpawner): void;
        activateCheepsStart(thing: IDetector): void;
        activateCheepsStop(thing: IDetector): void;
        activateBulletBillsStart(thing: IDetector): void;
        activateBulletBillsStop(thing: IDetector): void;
        activateLakituStop(thing: IDetector): void;
        activateWarpWorld(thing: ICharacter, other: IDetectCollision): void;
        activateRestingStone(thing: IRestingStone, other: IPlayer): void;
        activateWindowDetector(thing: IDetectWindow): void;
        activateScrollBlocker(thing: IScrollBlocker): void;
        activateScrollEnabler(thing: IDetectCollision): void;
        activateSectionBefore(thing: ISectionDetector): void;
        activateSectionStretch(thing: ISectionDetector): void;
        activateSectionAfter(thing: ISectionDetector): void;
        generateHitCharacterSolid(): (thing: ICharacter, other: ISolid) => void;
        generateHitCharacterCharacter(): (thing: ICharacter, other: ICharacter) => void;
        collideFriendly(thing: ICharacter, other: IItem): void;
        collideCharacterSolid(thing: ICharacter, other: ISolid): void;
        collideCharacterSolidUp(thing: ICharacter, other: ISolid): void;
        collideUpItem(thing: IItem, other: ISolid): void;
        collideUpCoin(thing: ICoin, other: ISolid): void;
        collideCoin(thing: IPlayer, other: ICoin): void;
        collideStar(thing: IPlayer, other: IStar): void;
        collideFireball(thing: ICharacter, other: IFireball): void;
        collideCastleFireball(thing: ICharacter, other: ICastleFireball): void;
        collideShell(thing: ICharacter, other: IShell): void;
        collideShellSolid(thing: ISolid, other: IShell): void;
        collideShellPlayer(thing: IPlayer, other: IShell): void;
        collideShellShell(thing: IShell, other: IShell): void;
        collideEnemy(thing: ICharacter, other: IEnemy): void;
        collideBottomBrick(thing: IBrick, other: ICharacter): void;
        collideBottomBlock(thing: IBlock, other: IPlayer): void;
        collideVine(thing: IPlayer, other: ISolid): void;
        collideSpringboard(thing: ICharacter, other: ISpringboard): void;
        collideWaterBlocker(thing: ICharacter, other: ISolid): void;
        collideFlagpole(thing: IPlayer, other: IDetectCollision): void;
        collideCastleAxe(thing: IPlayer, other: ICastleAxe): void;
        collideCastleDoor(thing: IPlayer, other: IDetectCollision): void;
        collideCastleNPC(thing: IPlayer, other: IDetectCollision): void;
        collideTransport(thing: IPlayer, other: ISolid): void;
        collideDetector(thing: ICharacter, other: IDetectCollision): void;
        collideLevelTransport(thing: IPlayer, other: ISolid): void;
        moveSimple(thing: ICharacter): void;
        moveSmart(thing: ICharacter): void;
        moveJumping(thing: ICharacter): void;
        movePacing(thing: ICharacter): void;
        moveHammerBro(thing: IHammerBro): void;
        moveBowser(thing: IBowser): void;
        moveBowserFire(thing: IBowserFire): void;
        moveFloating(thing: IThingFloating): void;
        moveSliding(thing: IThingSliding): void;
        setMovementEndpoints(thing: IThingFloating | IThingSliding): void;
        movePlatform(thing: IPlatform): void;
        movePlatformSpawn(thing: IPlatform): void;
        moveFalling(thing: IPlatform): void;
        moveFreeFalling(thing: IPlatform): void;
        movePlatformScale(thing: IPlatform): void;
        moveVine(thing: IVine): void;
        moveSpringboardUp(thing: ISpringboard): void;
        moveShell(thing: IShell): void;
        movePiranha(thing: IPiranha): void;
        movePiranhaLatent(thing: IPiranha): void;
        moveBubble(thing: IThing): void;
        moveCheepCheep(thing: IThing): void;
        moveCheepCheepFlying(thing: IThing): void;
        moveBlooper(thing: IBlooper): void;
        moveBlooperSqueezing(thing: IBlooper): void;
        movePodobooFalling(thing: IPodoboo): void;
        moveLakitu(thing: ILakitu): void;
        moveLakituInitial(thing: ILakitu): void;
        moveLakituFleeing(thing: ILakitu): void;
        moveCoinEmerge(thing: ICoin, parent?: ISolid): void;
        movePlayer(thing: IPlayer): void;
        movePlayerVine(thing: IPlayer): void;
        movePlayerSpringboardDown(thing: IPlayer): void;
        animateSolidBump(thing: ISolid): void;
        animateBlockBecomesUsed(thing: IBlock): void;
        animateSolidContents(thing: IBrick | IBlock, other: IPlayer): ICharacter;
        animateBrickShards(thing: IBrick): void;
        animateEmerge(thing: ICharacter, other: ISolid): void;
        animateEmergeCoin(thing: ICoin, other: ISolid): void;
        animateEmergeVine(thing: IVine, solid: ISolid): void;
        animateFlicker(thing: IThing, cleartime?: number, interval?: number): void;
        animateThrowingHammer(thing: IHammerBro, count: number): boolean;
        animateBowserJump(thing: IBowser): boolean;
        animateBowserFire(thing: IBowser): boolean;
        animateBowserFireOpen(thing: IBowser): boolean;
        animateBowserThrow(thing: IBowser): boolean;
        animateBowserFreeze(thing: IBowser): void;
        animateJump(thing: IHammerBro): void;
        animateBlooperUnsqueezing(thing: IBlooper): void;
        animatePodobooJumpUp(thing: IPodoboo): void;
        animatePodobooJumpDown(thing: IPodoboo): void;
        animateLakituThrowingSpiny(thing: ILakitu): boolean;
        animateSpinyEggHatching(thing: ISpinyEgg): void;
        animateFireballEmerge(thing): void;
        animateFireballExplode(thing: IFireball, big?: number): void;
        animateFirework(thing: IFirework): void;
        animateCannonFiring(thing: ICannon): void;
        animatePlayerFire(thing: IPlayer): void;
        animateCastleBlock(thing: ICastleBlock, balls: ICastleFireball[]): void;
        animateCastleBridgeOpen(thing: ISolid): void;
        animateCastleChainOpen(thing: ISolid): void;
        animatePlayerPaddling(thing: IPlayer): void;
        animatePlayerLanding(thing: IPlayer): void;
        animatePlayerRestingOff(thing: IPlayer): void;
        animatePlayerBubbling(thing: IPlayer): void;
        animatePlayerRunningCycle(thing: IPlayer): void;
        animateCharacterHop(thing: IPlayer): void;
        animatePlayerPipingStart(thing: IPlayer): void;
        animatePlayerPipingEnd(thing: IPlayer): void;
        animatePlayerOffPole(thing: IPlayer, doRun?: boolean): void;
        animatePlayerOffVine(thing: IPlayer): void;
        lookTowardsThing(thing: ICharacter, other: IThing): void;
        lookTowardsPlayer(thing: ICharacter, big?: boolean): void;
        killNormal(thing: IThing): void;
        killFlip(thing: ICharacter, extra?: number): void;
        killSpawn(thing: ICharacter, big?: boolean): IThing;
        killReplace(thing: IThing, title: string, attributes: any, attributesCopied?: string[]): void;
        killGoomba(thing: IGoomba, big?: boolean): void;
        killKoopa(thing: IKoopa, big?: boolean): ICharacter;
        killLakitu(thing: IKoopa): void;
        killBowser(thing: IBowser, big?: boolean): void;
        killToShell(thing: ICharacter, big?: number): void;
        killNPCs(): void;
        killBrick(thing: IBrick, other?: ICharacter): void;
        killPlayer(thing: IPlayer, big?: number): void;
        findScore(level: number): number;
        score(value: number, continuation?: boolean): void;
        scoreOn(value: number, thing: IThing, continuation?: boolean): void;
        scoreAnimateOn(text: IText, thing: IThing): void;
        scoreAnimate(thing: IThing, timeout?: number): void;
        scorePlayerShell(thing: IPlayer, other: IShell): void;
        scorePlayerFlag(thing: IThing, difference: number): number;
        getVolumeLocal(FSM: FullScreenMario, xloc: number): number;
        getAudioThemeDefault(FSM: FullScreenMario): string;
        setMap(name?: string | IFullScreenMario, location?: string | number): void;
        setLocation(name?: string | number): void;
        mapEntranceNormal(FSM: FullScreenMario, location?: ILocation): void;
        mapEntrancePlain(FSM: FullScreenMario, location?: ILocation): void;
        mapEntranceWalking(FSM: FullScreenMario, location?: ILocation): void;
        mapEntranceCastle(FSM: FullScreenMario): void;
        mapEntranceVine(FSM: FullScreenMario): void;
        mapEntranceVinePlayer(FSM: FullScreenMario, vine: IVine): void;
        mapEntrancePipeVertical(FSM: FullScreenMario, location?: ILocation): void;
        mapEntrancePipeHorizontal(FSM: FullScreenMario, location?: ILocation): void;
        mapEntranceRespawn(FSM: FullScreenMario): void;
        mapExitPipeVertical(thing: IPlayer, other: IPipe): void;
        mapExitPipeHorizontal(thing: IPlayer, other: IPipe, shouldTransport?: boolean): void;
        initializeArea(): void;
        setAreaBackground(area: IArea): void;
        getAbsoluteHeight(yloc: number, correctUnitsize?: boolean): number;
        mapAddStretched(prething: string | IPreThingSettings): IThing;
        mapAddAfter(prething: string | IPreThingSettings): void;
        cutsceneFlagpoleStartSlidingDown(settings: any, FSM: IFullScreenMario): void;
        cutsceneFlagpoleHitBottom(settings: any, FSM: IFullScreenMario): void;
        cutsceneFlagpoleCountdown(settings: any, FSM: IFullScreenMario): void;
        cutsceneFlagpoleFireworks(settings: any, FSM: IFullScreenMario): void;
        cutsceneBowserVictoryCollideCastleAxe(settings: any, FSM: IFullScreenMario): void;
        cutsceneBowserVictoryCastleBridgeOpen(settings: any, FSM: IFullScreenMario): void;
        cutsceneBowserVictoryBowserFalls(settings: any, FSM: IFullScreenMario): void;
        macroExample(reference: any, prethings: any[], area: MapsCreatr.IMapsCreatrArea, map: MapsCreatr.IMapsCreatrMap, scope: any): any;
        macroFillPreThings(reference: any, prethings: any[], area: MapsCreatr.IMapsCreatrArea, map: MapsCreatr.IMapsCreatrMap, scope: any): any;
        macroFillPrePattern(reference: any, prethings: any[], area: MapsCreatr.IMapsCreatrArea, map: MapsCreatr.IMapsCreatrMap, scope: any): any;
        macroFloor(reference: any, prethings: any[], area: MapsCreatr.IMapsCreatrArea, map: MapsCreatr.IMapsCreatrMap, scope: any): any;
        macroPipe(reference: any, prethings: any[], area: MapsCreatr.IMapsCreatrArea, map: MapsCreatr.IMapsCreatrMap, scope: any): any;
        macroPipeCorner(reference: any, prethings: any[], area: MapsCreatr.IMapsCreatrArea, map: MapsCreatr.IMapsCreatrMap, scope: any): any;
        macroTree(reference: any, prethings: any[], area: MapsCreatr.IMapsCreatrArea, map: MapsCreatr.IMapsCreatrMap, scope: any): any;
        macroShroom(reference: any, prethings: any[], area: MapsCreatr.IMapsCreatrArea, map: MapsCreatr.IMapsCreatrMap, scope: any): any;
        macroWater(reference: any, prethings: any[], area: MapsCreatr.IMapsCreatrArea, map: MapsCreatr.IMapsCreatrMap, scope: any): any;
        macroCeiling(reference: any): any;
        macroBridge(reference: any): any;
        macroScale(reference: any, prethings: any[], area: MapsCreatr.IMapsCreatrArea, map: MapsCreatr.IMapsCreatrMap, scope: any): any;
        macroPlatformGenerator(reference: any, prethings: any[], area: MapsCreatr.IMapsCreatrArea, map: MapsCreatr.IMapsCreatrMap, scope: any): any;
        macroWarpWorld(reference: any, prethings: any[], area: MapsCreatr.IMapsCreatrArea, map: MapsCreatr.IMapsCreatrMap, scope: any): any;
        macroCheepsStart(reference: any, prethings: any[], area: MapsCreatr.IMapsCreatrArea, map: MapsCreatr.IMapsCreatrMap, scope: any): any;
        macroCheepsStop(reference: any, prethings: any[], area: MapsCreatr.IMapsCreatrArea, map: MapsCreatr.IMapsCreatrMap, scope: any): any;
        macroBulletBillsStart(reference: any, prethings: any[], area: MapsCreatr.IMapsCreatrArea, map: MapsCreatr.IMapsCreatrMap, scope: any): any;
        macroBulletBillsStop(reference: any, prethings: any[], area: MapsCreatr.IMapsCreatrArea, map: MapsCreatr.IMapsCreatrMap, scope: any): any;
        macroLakituStop(reference: any, prethings: any[], area: MapsCreatr.IMapsCreatrArea, map: MapsCreatr.IMapsCreatrMap, scope: any): any;
        macroCastleSmall(reference: any): any;
        macroCastleLarge(reference: any): any;
        macroStartInsideCastle(reference: any, prethings: any[], area: MapsCreatr.IMapsCreatrArea, map: MapsCreatr.IMapsCreatrMap, scope: any): any;
        macroEndOutsideCastle(reference: any): any;
        macroEndInsideCastle(reference: any, prethings: any[], area: MapsCreatr.IMapsCreatrArea, map: MapsCreatr.IMapsCreatrMap, scope: any): any;
        macroSection(reference: any, prethings: any[], area: MapsCreatr.IMapsCreatrArea, map: MapsCreatr.IMapsCreatrMap, scope: any): any;
        macroSectionPass(reference: any, prethings: any[], area: MapsCreatr.IMapsCreatrArea, map: MapsCreatr.IMapsCreatrMap, scope: any): any;
        macroSectionFail(reference: any, prethings: any[], area: MapsCreatr.IMapsCreatrArea, map: MapsCreatr.IMapsCreatrMap, scope: any): any;
        macroSectionDecider(reference: any, prethings: any[], area: MapsCreatr.IMapsCreatrArea, map: MapsCreatr.IMapsCreatrMap, scope: any): any;
        ensureCorrectCaller(current: any): FullScreenMario;
    }
}