const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const deleteButton = document.querySelector("#delete-btn");

const userId = Date.now().toString();
let userText = null;
let isProcessing = false;

const examplePrompts = [
  "Breakup text from a toaster.",
  "Plan a road trip.",
  "Give me some pick up lines.",
  "Poem about a cat.",
  "Story about a talking dog.",
  "New ice cream flavor.",
  "Letter to future self.",
  "10 things for a deserted island.",
  "Story about a haunted house.",
  "Create a superhero.",
  "Day in the life of a pirate.",
  "Recipe for a magical potion.",
  "Dialogue between a robot and an alien.",
  "How to build a time machine.",
  "News article about a dragon sighting.",
  "Describe the perfect vacation.",
  "Advice for starting high school.",
  "Invent a new holiday.",
  "Story set in a futuristic city.",
  "Conversation between two animals.",
  "Create a new planet.",
  "Letter to a pen pal.",
  "10 things to do on a rainy day.",
  "Invent a new sport.",
  "Create a new language.",
  "How to train a dragon.",
  "Create a new board game.",
  "Invent a new technology.",
  "Advice for a new teacher.",
  "Create a new animal.",
  "How to become a wizard.",
  "Create a new currency.",
  "Invent a new food.",
  "Advice for a new parent.",
  "Create a new toy.",
  "How to become a superhero.",
  "Create a new school subject.",
];

const initializeMarked = () => {
  if (typeof marked !== "undefined") {
    marked.use({
      breaks: true,
      gfm: true,
      headerIds: false,
      mangle: false,
    });
  }
};

document.addEventListener("DOMContentLoaded", initializeMarked);

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const loadDataFromLocalstorage = () => {
  messageHistory = [];
  shuffleArray(examplePrompts);
  const defaultText = `<div class="default-text">
                            <h1>GMS-GPT</h1>
                            <p>Start a conversation and use AI.<br> Your chat history will be displayed here.</p>
                            <div class="example-prompts"><br><br>
                                <button class="prompt-btn">${examplePrompts[0]}</button>
                                <button class="prompt-btn">${examplePrompts[1]}</button>
                                <button class="prompt-btn">${examplePrompts[2]}</button>
                                <button class="prompt-btn">${examplePrompts[3]}</button>
                            </div>
                        </div>`;

  chatContainer.innerHTML = defaultText;
  chatContainer.scrollTo(0, chatContainer.scrollHeight);

  document.querySelectorAll(".prompt-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      chatInput.value = btn.textContent;
      handleOutgoingChat();
    });
  });
};

const createChatElement = (content, className) => {
  const chatDiv = document.createElement("div");
  chatDiv.classList.add("chat", className);
  chatDiv.innerHTML = content;
  return chatDiv;
};

const formatMarkdown = (text) => {
  try {
    if (typeof marked !== "undefined") {
      return marked.parse(text);
    }
    return text;
  } catch (error) {
    console.error("Error parsing markdown:", error);
    return text;
  }
};
const getChatResponse = async (incomingChatDiv) => {
  const pElement = document.createElement("p");
  let html;
  try {
    const data = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userText, userId }),
    });
    const response = await data.json();
    html = response.response.replace(
      /<pre><code class="language-(.*?)">([\s\S]*?)<\/code><\/pre>/g,
      (match, lang, code) => {
        const language = Prism.languages[lang] ? lang : "plaintext";
        const highlightedCode = Prism.highlight(
          code,
          Prism.languages[language],
          language
        );
        return `<pre><code class="language-${language}">${highlightedCode}</code></pre>`;
      }
    );
    html = marked.parse(response.response);
    pElement.appendChild(document.createRange().createContextualFragment(html));
  } catch (error) {
    if (data.response.status === 429) {
      pElement.classList.add("error");
      pElement.textContent =
        "Too many requests have been sent in 1 minute, please try again later.";
    } else if (error.response.status === 503) {
      pElement.classList.add("error");
      pElement.textContent = "AI is currently overloaded, please try again.";
    } else {
      pElement.classList.add("error");
      pElement.textContent =
        "Oops! Something went wrong while retrieving the response. Please try again.";
      console.log(error);
    }
  }

  incomingChatDiv.querySelector(".typing-animation").remove();
  incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
  isProcessing = false;
  sendButton.classList.replace("fa-stop", "fa-paper-plane");
};

const copyResponse = (copyBtn) => {
  const responseTextElement = copyBtn.parentElement.querySelector("p");
  navigator.clipboard.writeText(responseTextElement.textContent);
  copyBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  setTimeout(
    () => (copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i>'),
    1000
  );
};

const showTypingAnimation = () => {
  const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="/img/gmsai.jpg" class='avatar' alt="chatbot-img">
                        <div class="typing-animation">
                            <div class="typing-dot" style="--delay: 0.2s"></div>
                            <div class="typing-dot" style="--delay: 0.3s"></div>
                            <div class="typing-dot" style="--delay: 0.4s"></div>
                        </div>
                    </div>
                    <span onclick="copyResponse(this)" class="material-symbols-rounded">
                        <i class="fa-regular fa-copy"></i>
                    </span>
                </div>`;
  const incomingChatDiv = createChatElement(html, "incoming");
  chatContainer.appendChild(incomingChatDiv);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
  getChatResponse(incomingChatDiv);
};

const handleOutgoingChat = () => {
  if (isProcessing) {
    return;
  }

  userText = chatInput.value.trim();
  if (!userText) return;

  chatInput.value = "";
  chatInput.style.height = `${initialInputHeight}px`;

  const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="img/user.webp" class='avatar' alt="user-img">
                        <p>${userText}</p>
                    </div>
                </div>`;

  const outgoingChatDiv = createChatElement(html, "outgoing");
  chatContainer.querySelector(".default-text")?.remove();
  chatContainer.appendChild(outgoingChatDiv);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
  isProcessing = true;
  sendButton.classList.replace("fa-paper-plane", "fa-stop");
  setTimeout(showTypingAnimation, 500);
};

deleteButton.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all the chats?")) {
    location.reload();
  }
});

const initialInputHeight = chatInput.scrollHeight;

chatInput.addEventListener("input", () => {
  chatInput.style.height = `${initialInputHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
    e.preventDefault();
    handleOutgoingChat();
  }
});

sendButton.addEventListener("click", handleOutgoingChat);

document.addEventListener("keydown", (e) => {
  if (
    [
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "Control",
      "Alt",
    ].includes(e.key) ||
    e.metaKey
  )
    return;

  chatInput.focus();
});
loadDataFromLocalstorage();
