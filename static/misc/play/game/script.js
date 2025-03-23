document.addEventListener('DOMContentLoaded', function() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const title = urlParams.get('title') || 'No title provided';
    const author = urlParams.get('author') || 'No author provided';
    const link = urlParams.get('link') || '';
    const image = urlParams.get('image') || '';
    const titleElement = document.getElementById('titletext');
    const byTextElement = document.querySelector('.bytext');
    const iframeElement = document.getElementById('iframe');
    const gameIconElement = document.querySelector('.gameicon');

   
    titleElement.textContent = title;
    byTextElement.textContent = 'By ' + author;
    iframeElement.src = link;
    gameIconElement.src = image;
});