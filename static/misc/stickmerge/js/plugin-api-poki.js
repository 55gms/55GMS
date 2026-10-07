class PokiApiPlugin extends Phaser.Plugins.BasePlugin {
    constructor(pluginManager) {
        super(pluginManager);

        this.api_GamePause = null;
        this.api_GameContinue = null;
        this.api_isAdblock = false;

        this.bannerContainer = document.getElementById('banner');
        this.isBannerAdded = false;
    }

    initAPI(api_GamePause, api_GameContinue) {
        PokiSDK.init().then(
            () => {
                // successfully initialized
                // console.log("PokiSDK initialized");
                // continue to game
            }
        ).catch(
            () => {
                this.api_isAdblock = true;
                // initialized but the user has an adblock
                // console.log("Adblock enabled");
                // feel free to kindly ask the user to disable AdBlock, like forcing weird usernames or showing a sad face; be creative!
                // continue to the game
            }
        );

        this.api_GamePause = api_GamePause;
        this.api_GameContinue = api_GameContinue;

        // if(MainGame.isDebug) PokiSDK.setDebug(true);
    }

    gameLoadingStart(){
        PokiSDK.gameLoadingStart();
    }

    gameLoadingFinished(){
        PokiSDK.gameLoadingFinished();
    }

    gameLoadingProgress(data){
        PokiSDK.gameLoadingProgress(data);
    }

    gameplayStart(){
        // console.log('=== gameplayStart');
        PokiSDK.gameplayStart();
    }

    gameplayStop(){
        // console.log('=== gameplayStop');
        PokiSDK.gameplayStop();

    }

    happyTime(value){
        PokiSDK.happyTime(value);
    }

    commercialBreak(){
        // console.log('=== commercialBreak');

        this.api_GamePause();

        PokiSDK.commercialBreak().then(
            () => {
                // console.log("Commercial Break finished");
                this.api_GameContinue();
            }
        );
    }

    rewardedBreak(){
        // console.log('=== rewardedBreak');

        this.api_GamePause();

        PokiSDK.rewardedBreak().then(
            (withReward) => {
                // console.log(`Should the user get a reward? ${withReward}`);
                this.api_GameContinue(withReward);
                MainGame.getReward(withReward);
            }
        );
    }

    displayAd(){
        if(this.isBannerAdded) return;
        // console.log('=== displayAd');
        // if(game.device.os.desktop){
        //     PokiSDK.displayAd(this.bannerContainer, '728x90');
        // }else{
        //     PokiSDK.displayAd(this.bannerContainer, '320x50');
        // }
        PokiSDK.displayAd(this.bannerContainer, '320x50');

        this.isBannerAdded = true;
    }

    destroyAd(){
        if(!this.isBannerAdded) return;
        // console.log('=== destroyAd');
        PokiSDK.destroyAd(this.bannerContainer);
        this.isBannerAdded = false;
    }


}
