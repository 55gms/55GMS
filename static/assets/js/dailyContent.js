document.addEventListener('DOMContentLoaded', () => {
    const quoteTextElement = document.getElementById('quoteText');
    const quoteAuthorElement = document.getElementById('quoteAuthor');
    const wordTextElement = document.getElementById('wordText');

    async function fetchAndDisplayDailyContent() {
        try {
            const response = await fetch('/api/quote');
            const data = await response.json();

            const quoteContent = data[0].q;
            const quoteAuthor = data[0].a;

            quoteTextElement.textContent = `"${quoteContent}"`;
            quoteAuthorElement.textContent = `- ${quoteAuthor}`;

            const words = quoteContent.split(/\s+/).filter(word => word.length > 4);
            if (words.length > 0) {
                const date = new Date();
                const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
                const random = Math.sin(seed) * 10000;
                const randomIndex = Math.floor((random - Math.floor(random)) * words.length);
                const dailyWord = words[randomIndex];
                wordTextElement.textContent = dailyWord.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").toLowerCase();
            } else {
                wordTextElement.textContent = "No word found";
            }

        } catch (error) {
            console.error('Error fetching daily content:', error);
            quoteTextElement.textContent = "Failed to load quote.";
            quoteAuthorElement.textContent = "";
            wordTextElement.textContent = "Failed to load word.";
        }
    }

    fetchAndDisplayDailyContent();
});