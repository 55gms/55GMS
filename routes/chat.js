import express from "express";
import axios from "axios";
const router = express.Router();

let modelManager = null;
let activeConversations = null;

function initializeChatRoute(modelMgr, conversations) {
  modelManager = modelMgr;
  activeConversations = conversations;
}

router.post("/chat", async (req, res) => {
  const { message, userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "Not enough arguments" });
  }

  let conversationData = activeConversations.get(userId) || {
    history: [],
    lastActive: Date.now(),
  };

  // If we fetched a raw array (legacy data from before restart), wrap it
  if (Array.isArray(conversationData)) {
    conversationData = { history: conversationData, lastActive: Date.now() };
  }

  let conversation = conversationData.history;
  conversation.push({ role: "user", content: message });

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: modelManager.getCurrentModel(),
        messages: conversation,
        temperature: 0.7,
        max_tokens: 1024,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );
    if (response.status === 429) {
      modelManager.switchModel();
      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: modelManager.getCurrentModel(),
          messages: conversation,
          temperature: 0.7,
          max_tokens: 1024,
        },
        {
          headers: {
            Authorization: `Bearer ${randomAPIKey}`,
            "Content-Type": "application/json",
          },
        },
      );
      const aiResponse = response.data.choices[0].message.content;
      conversation.push({ role: "assistant", content: aiResponse });

      modelManager.addTokenUsage(response.data.usage.total_tokens);
      if (conversation.length > 5) {
        conversation = conversation.slice(-5);
      }
      if (modelManager.shouldSwitchModel()) {
        modelManager.switchModel();
      }

      activeConversations.set(userId, {
        history: conversation,
        lastActive: Date.now(),
      });

      res.json({ response: aiResponse });
    }
    const aiResponse = response.data.choices[0].message.content;
    conversation.push({ role: "assistant", content: aiResponse });

    modelManager.addTokenUsage(response.data.usage.total_tokens);
    if (conversation.length > 5) {
      conversation = conversation.slice(-5);
    }
    if (modelManager.shouldSwitchModel()) {
      modelManager.switchModel();
    }

    activeConversations.set(userId, {
      history: conversation,
      lastActive: Date.now(),
    });

    res.json({ response: aiResponse });
  } catch (error) {
    if (error.response && error.response.status === 429) {
      res.status(429).json({ error: "Too many requests" });
      modelManager.switchModel();
    } else if (error.response && error.response.status === 503) {
      res.status(503).json({ error: "Service unavailable" });
    } else {
      res
        .status(500)
        .json({ error: "An error occurred while processing your request." });
      console.log(error);
    }
  }
});

router.get("/usedTokens", (req, res) => {
  res.json({
    usedTokens: modelManager.getTokenUsage(),
    model: modelManager.getCurrentModel(),
  });
});

export { router, initializeChatRoute };
