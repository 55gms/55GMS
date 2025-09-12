pc.script.createLoadingScreen(function (app) {
    app.p = true;

    window.addEventListener('keydown', ev => {
    if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', ' '].includes(ev.key)) {
        ev.preventDefault();
    }
    });
    window.addEventListener('wheel', ev => ev.preventDefault(), { passive: false });

    if (app.p) {
        PokiSDK.init().then(
            () => {
                app.ab = false;
            }
        ).catch(
            () => {
                app.ab = true;
            }
        );

        PokiSDK.gameLoadingStart();
    }

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
        logo.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAB2CAYAAAB4SpVuAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAYHSURBVHja7J17bBVFFIdXK4gPFAiBIhLRKhq1FcVXJIpUG7UqUGlUKkVqDSi+EAUMok0UX5QErY3WB1Z5RLANPmIxUWlMVBRBwdCKVMCCGF8oiqgYxM8/Zm682d7d+5qZe2f3/pL7T+/uzDlfd2dnzjk71wGcDH7uBKZm0oZMOl/B/6oIG4CxdFV5WAAU462SoAM4lvgqCDKAjgQAbAa6BRHAiySupUEDUE7yqgwKgMOB31IAsAc4IggAniV1vWA7gALS1/E2A3hJAYCFtgI4GnUaZCOAWQoB3GsjgA6FADpsAzAU9SqyCcA9GgDMtAnAuxoAvGMLgG7AjxoAfA8cZAOA09CnQhsAlGoEcJkNAG7VCKDaBgCPagQwxwYA8zUCmGcDgOc1AmiwAcAzGgE8ZQOAWo0AHrMBwIMaAcy2AcCNGgGMtwHAxRoBFNsAoADYr8H5/cBgW1aD2zQA2GrTcrhZA4BlNgG4WQOAm2wCMFjD/T/QtqDoRwoBvKczKFoInAmcDZwKDAD6Ad2z6DaYnKYthwD9Za7iDOBc6W+REyN89SfwO9AJfCDT2ncDFwF9kuj0SNlOutoN9Eyi3/7AFXLWuFheiTukLX+7w2wO8E0SxvwKvAXcBhyXgDHzDM3/TwamyWDsniTa3uEA7Skatg94FVHw5GXYgDQnRf8A+T7tjwNa0mj/Swf4RMF/6VO8S90e1hABqgbaFNjd7gCtCgerVcAIl7E9gJ9TaGsncLCrrRJgrUJ72xxggYZJSx1wQJTho1Joo9SVa3hag52rHOB+TSu3z4GTopxYmMS5jVHnnZLGOBVPrzhAlcbl6x/AaOlIHqIELp42RV0918R4dKnUXAcYhn5FAhknyEepl36JerxWGbDrFkdOMnYZhDDF55hJBp0HuDByn7Ua6nAgcJTP9/0QRVEmtBfIjwB4wFCnG4B6n+/rga8M2bI6ejU4kvCpPhpAd+C7kAEY444HPBEi53cDh7oBDA8RgCaviNAXIQFQ6gWgOgTOb8QnJnignI0FWdXECYpODbDzP+GKdXpFWjYFFMDVJBgWD+LEaDVJ5gVeDhiAE5MF0APYHhDn7yLFzFAh8K/lzi8hzdTYKIudX4Oi3GCFhc6vi8z3UZQcLbfI+eVyDFOeHR4JfJvlztehOT3eF3gzS2d512KwPmAyIuuaDVqAiCemVB8wE5iLqPB8CJgOTACuROTQe/s00BOoQc8bIoloGSKs75ecHS6jP5MQ7zI9gsha1wIznAQ62YVIfjYC1wNDYnTUR4Jcb8DpLYiUeaHHvGUKsAiRmdobr7FUFz7vI4omYtUIjJBX1GcKnW4DnpSBjDy61gbMBj5Ood3NjiSVqvbJNcMleBdNlsnbpAlRreGXKd4pj2mS55Qjskmx2r4ceD3d4IgDfKjov7QCOC+Bgccv65PIpgnFwEpFNrc7Gh5pdfhvfDDW59wxPuf1Bp5TbOt6B3hcw0DVCVzq4Uilz3kVPusRHY/cVgeYoXHEnqYAQI1G+xojg4lONbocGp8EgMWabatJdHMjFROWiFMTfY6bEHXccgN2XRep3NhmoLOlUY8vL0Uep82Y0ekR2osMdTgRUarqaRB6X7mJ1g/AYSbe83HLb+K1waAdLdGrwSGET/e5l8NrQgZgqBvA9BA5vzFWQGRQiADM8YoINYcEQIEXgGEhcP4N4sQEgz4YnhMPwFkBdr7LVjxea+8lQb/34wHohZ73fzOpmNtvZOo1eNPaisdrgPHib40BAeC5AVMi2ZN1ljs/jjRTY70wV8GtWrejKDeYj9oNEk3oDhQnR3uRWvYlE6pCY3a4IYsd3wJcgIH0eCWZywh7qUFepcbqA/oiskCZ1krS2F1GxSYEhYgtrv4y7PjbKPhVCpW7MRyD2Et4reZ7vNa9oiMLt9AoQlSdv0Z6OYftiOTtLOB8utYGWLG7fJ68TcrkxGSFj8Mt8pirJETtvzSRiR9ZKfEBUGzankwASCY5mgMQRACVuSsgByAHIDcG5K6AHIDcLZC7AsIKwC/hckMYAJQhtuvoBL6Wn075t9Gm7flvAA/6B3PU1BZ3AAAAAElFTkSuQmCC'
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
            '    background-color: #70a1eb;',
            '}',
            '',
 '#application-splash-wrapper {',
            '    position: absolute;',
            '    top: 0;',
            '    left: 0;',
            '    height: 100%;',
            '    width: 100%;',
          //  '    background: rgb(147,237,255);',
          //  '    background: linear-gradient(0deg, rgba(147,237,255,1) 0%, rgba(0,116,255,1) 100%);',
           'background: ',
'conic-gradient(',
'from 0deg,',
'transparent 0deg,',
'transparent 15deg,',
'rgba(0,116,255,1) 15deg,',
'rgba(0,116,255,1) 30deg,',
'transparent 30deg,',
'transparent 45deg,',
'rgba(0,116,255,1) 45deg,',
'rgba(0,116,255,1) 60deg,',
'transparent 60deg,',
'transparent 75deg,',
'rgba(0,116,255,1) 75deg,',
'rgba(0,116,255,1) 90deg,',
'transparent 90deg,',
'transparent 105deg,',
'rgba(0,116,255,1) 105deg,',
'rgba(0,116,255,1) 120deg,',
'transparent 120deg,',
'transparent 135deg,',
'rgba(0,116,255,1) 135deg,',
'rgba(0,116,255,1) 150deg,',
'transparent 150deg,',
'transparent 165deg,',
'rgba(0,116,255,1) 165deg,',
'rgba(0,116,255,1) 180deg,',
'transparent 180deg,',
'transparent 195deg,',
'rgba(0,116,255,1) 195deg,',
'rgba(0,116,255,1) 210deg,',
'transparent 210deg,',
'transparent 225deg,',
'rgba(0,116,255,1) 225deg,',
'rgba(0,116,255,1) 240deg,',
'transparent 240deg,',
'transparent 255deg,',
'rgba(0,116,255,1) 255deg,',
'rgba(0,116,255,1) 270deg,',
'transparent 270deg,',
'transparent 285deg,',
'rgba(0,116,255,1) 285deg,',
'rgba(0,116,255,1) 300deg,',
'transparent 300deg,',
'transparent 315deg,',
'rgba(0,116,255,1) 315deg,',
'rgba(0,116,255,1) 330deg,',
'transparent 330deg,',
'transparent 345deg,',
'rgba(0,116,255,1) 345deg,',
'rgba(0,116,255,1) 360deg',
'),',
'radial-gradient(circle, rgba(147,237,255,1), rgba(0,116,255,1));',
'background-blend-mode: screen;',
            '}',
            '',
            '#application-splash {',
            '    position: absolute;',
            '    top: calc(45% - 28px);',
            '    width: 64px;',
            '    left: calc(50% - 32px);',
            '}',
            '',
            '#application-splash img {',
            '    width: 100%;',
            '}',
            '',
            '#progress-bar-container {',
            '    margin: 20px auto 0 auto;',
            '    height: 2px;',
            '    width: 100%;',
            '    background-color: #AABBFF;',
            '}',
            '',
            '#progress-bar {',
            '    width: 0%;',
            '    height: 100%;',
            '    background-color: #fff;',
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
        if (app.p) {
            PokiSDK.gameLoadingFinished();
        }
        app.off('preload:progress');
    });

    app.on('preload:progress', setProgress);
    app.on('start', hideSplash);
});