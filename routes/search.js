export default async function (fastify, opts) {
  fastify.get("/autocomplete", async (req, reply) => {
    const q = req.query.q || "";
    const duckUrl = `https://duckduckgo.com/ac/?q=${encodeURIComponent(q)}`;

    try {
      const response = await fetch(duckUrl);
      const data = await response.json();

      reply.header("Access-Control-Allow-Origin", "*");
      reply.send(data);
    } catch (err) {
      reply.code(500).send({ error: "Failed to fetch suggestions" });
    }
  });
}
