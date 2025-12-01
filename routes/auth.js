import axios from "axios";

export default async function (fastify, opts) {
  fastify.post("/signUp", async (req, reply) => {
    let { password, username, premium = false, captchaResponse } = req.body;

    if (!password || !username || !captchaResponse) {
      return reply.code(400).send({ error: "Not enough arguments" });
    }
    if (password.length < 6) {
      return reply.code(400).send({ error: "Password too short" });
    }
    if (username.length < 3) {
      return reply.code(400).send({ error: "Username too short" });
    }

    try {
      const captchaVerifyResponse = await axios.post(
        "https://hcaptcha.com/siteverify",
        new URLSearchParams({
          secret: process.env.hcaptchaSecret,
          response: captchaResponse,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      if (!captchaVerifyResponse.data.success) {
        console.log(captchaVerifyResponse.data["error-codes"]);
        return reply.code(400).send({ error: "Invalid CAPTCHA" });
      }

      const response = await axios.post(
        "https://db.55gms.com/api/signup",
        {
          username,
          password,
          premium,
        },
        {
          headers: {
            Authorization: process.env.workerAUTH,
            "Content-Type": "application/json",
          },
        },
      );

      reply.code(200).send(response.data);
    } catch (error) {
      console.log(error);
      reply
        .code(500)
        .send({ error: "An error occurred while processing your request." });
    }
  });

  fastify.post("/login", async (req, reply) => {
    let { username, password } = req.body;

    if (!username || !password) {
      return reply.code(400).send({ error: "Not enough arguments" });
    }

    try {
      const response = await axios.post(
        "https://db.55gms.com/api/login",
        {
          username,
          password,
        },
        {
          headers: {
            Authorization: process.env.workerAUTH,
            "Content-Type": "application/json",
          },
        },
      );

      reply.code(200).send(response.data);
    } catch (error) {
      reply.code(500).send({ error: "Invalid Email or password" });
    }
  });
}
