pc.script.createLoadingScreen(function (app) {
    var showSplash = function () {
        // splash wrapper
        var wrapper = document.createElement('div');
        wrapper.id = 'application-splash-wrapper';
        document.body.appendChild(wrapper);

        // splash
        var splash = document.createElement('div');
        splash.id = 'application-splash';
        wrapper.appendChild(splash);
        splash.style.display = 'none';

        var logo = document.createElement('img');
        logo.src = 'data:image/png;base64,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';
        splash.appendChild(logo);
        logo.onload = function () {
            splash.style.display = 'block';
        };

        var container = document.createElement('div');
        container.id = 'progress-bar-container';
        splash.appendChild(container);

        var bar = document.createElement('div');
        bar.id = 'progress-bar';
        container.appendChild(bar);

    };

    var hideSplash = function () {
        var splash = document.getElementById('application-splash-wrapper');
        splash.parentElement.removeChild(splash);
    };

    var setProgress = function (value) {
        var bar = document.getElementById('progress-bar');
        if(bar) {
            value = Math.min(1, Math.max(0, value));
            bar.style.width = value * 100 + '%';
        }
    };

    var createCss = function () {
        var css = [
            'body {',
            '   background: rgb(15,15,15);',
            '   background: linear-gradient(0deg, rgba(15,15,15,1) 0%, rgba(35,46,48,1) 100%);',
            '}',
            '',
            '#application-splash-wrapper {',
            '    position: absolute;',
            '    top: 0;',
            '    left: 0;',
            '    height: 100%;',
            '    width: 100%;',
            '   background: rgb(15,15,15);',
            '   background: linear-gradient(0deg, rgba(15,15,15,1) 0%, rgba(35,46,48,1) 100%);',
            '}',
            '',
            '#application-splash {',
            '    position: absolute;',
            '    top: calc(50% - 40px);',
            '    width: 264px;',
            '    left: calc(50% - 132px);',
            '}',
            '',
            '#application-splash img {',
            '    width: 100%;',
            '}',
            '',
            '#progress-bar-container {',
            '    margin: 40px auto 0 auto;',
            '    height: 30px;',
            '    width: 100%;',
            '    border-radius:15px;',
            '    background-color: #414141;',
            '}',
            '',
            '#progress-bar {',
            '    width: 0%;',
            '    height: 100%;',
            '    border-radius:15px;',
            '    background-color: #aeaeae;',
            '}',
            '',
            '@media (max-width: 480px) {',
            '    #application-splash {',
            '        width: 170px;',
            '        left: calc(50% - 85px);',
            '    }',
            '}'
        ].join('\n');

        var style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        document.head.appendChild(style);
    };

    createCss();
    showSplash();

    app.on('preload:end', function () {
        app.off('preload:progress');
    });
    app.on('preload:progress', setProgress);
    app.on('start', hideSplash);
});