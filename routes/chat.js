import axios from "axios";

let modelManager = null;
let activeConversations = null;

function initializeChatRoute(modelMgr, conversations) {
  modelManager = modelMgr;
  activeConversations = conversations;
}

async function chatPlugin(fastify, opts) {
  fastify.post("/chat", async (req, reply) => {
    const { message, userId } = req.body;

    if (!userId) {
      return reply.code(400).send({ error: "Not enough arguments" });
    }

    let conversation = activeConversations.get(userId) || [];
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
        }
      );

      if (response.status === 429) {
        // Retry logic is a bit weird in original code (using undefined randomAPIKey?), preserving as close as possible but assuming intention
        // Actually, looking at original code: `Authorization: Bearer ${randomAPIKey}` where randomAPIKey is not defined in the scope.
        // I will assume this was a bug in the original code or a missing variable.
        // However, the instruction is "direct translation".
        // Since randomAPIKey is not defined in the original file, it would throw ReferenceError.
        // I will keep it as is, so it fails same way if hit, or if it was globally defined (unlikely for module).
        // Wait, if I want to be helpful I should probably note this, but I'll stick to translation.
        // Actually, if it throws ReferenceError in runtime, maybe I should comment it out or leave it to fail.
        // I'll leave it to fail to preserve behavior (or maybe the user wants me to fix it? No, "migrate").

        modelManager.switchModel();
        // The original code uses `randomAPIKey` here which is not defined.
        // I will leave it as is.
        const responseRetry = await axios.post(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            model: modelManager.getCurrentModel(),
            messages: conversation,
            temperature: 0.7,
            max_tokens: 1024,
          },
          {
            headers: {
              Authorization: `Bearer ${randomAPIKey}`, // undefined variable
              "Content-Type": "application/json",
            },
          }
        );
        const aiResponse = responseRetry.data.choices[0].message.content;
        conversation.push({ role: "assistant", content: aiResponse });

        modelManager.addTokenUsage(responseRetry.data.usage.total_tokens);
        if (conversation.length > 5) {
          conversation = conversation.slice(-5);
        }
        if (modelManager.shouldSwitchModel()) {
          modelManager.switchModel();
        }

        activeConversations.set(userId, conversation);

        return reply.send({ response: aiResponse });
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

      activeConversations.set(userId, conversation);

      reply.send({ response: aiResponse });
    } catch (error) {
      if (error.response && error.response.status === 429) {
        modelManager.switchModel();
        reply.code(429).send({ error: "Too many requests" });
      } else if (error.response && error.response.status === 503) {
        reply.code(503).send({ error: "Service unavailable" });
      } else {
        console.log(error);
        reply
          .code(500)
          .send({ error: "An error occurred while processing your request." });
      }
    }
  });

  fastify.get("/usedTokens", (req, reply) => {
    reply.send({
      usedTokens: modelManager.getTokenUsage(),
      model: modelManager.getCurrentModel(),
    });
  });
}

export { chatPlugin as router, initializeChatRoute };
