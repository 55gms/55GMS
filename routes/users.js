import axios from "axios";

export default async function (fastify, opts) {
  fastify.post("/checkPremium", async (req, reply) => {
    let { uuid } = req.body;

    if (!uuid) {
      return reply.code(400).send({ error: "Not enough arguments" });
    }

    try {
      const response = await axios.post(
        "https://db.55gms.com/api/users/premium",
        {
          uuid,
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
      reply.code(500).send({ error: error });
    }
  });

  fastify.post("/uploadSave", async (req, reply) => {
    let saveData = req.body;
    let uuid = req.headers["uuid"];

    if (!saveData || !uuid) {
      return reply.code(400).send({ error: "Not enough arguments" });
    }

    try {
      const response = await axios.post(
        "https://db.55gms.com/api/users/uploadSave",
        {
          uuid,
          saveData,
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
      reply.code(500).send({ error: error });
    }
  });

  fastify.post("/readSave", async (req, reply) => {
    let { uuid } = req.body;

    if (!uuid) {
      return reply.code(400).send({ error: "Not enough arguments" });
    }

    try {
      const response = await axios.post(
        "https://db.55gms.com/api/users/readSave",
        {
          uuid: uuid,
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
      reply.code(500).send({ error: error });
    }
  });
}
