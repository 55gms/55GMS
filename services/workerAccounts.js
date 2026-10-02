import axios from "axios";

const WORKER_API = "https://db.55gms.com/api";

function isNotFound(error) {
  return error?.response?.status === 404;
}

// Accounts and saves stored behind the Cloudflare Worker (D1 + KV). Kept
// only until the Postgres cutover; same interface as postgresAccounts.js.
export function createWorkerAccounts({ httpClient = axios } = {}) {
  const jsonHeaders = () => ({
    Authorization: process.env.workerAUTH,
    "Content-Type": "application/json",
  });

  return {
    async createUser({ username, password }) {
      const response = await httpClient.post(
        `${WORKER_API}/signup`,
        { username, password },
        { headers: jsonHeaders() },
      );
      return response.data;
    },

    async verifyLogin({ username, password }) {
      try {
        const response = await httpClient.post(
          `${WORKER_API}/login`,
          { username, password },
          { headers: jsonHeaders() },
        );
        return response.data;
      } catch (error) {
        if (error?.response?.status === 401) return null;
        throw error;
      }
    },

    async getUserByUuid(uuid) {
      try {
        const response = await httpClient.get(
          `${WORKER_API}/user/${encodeURIComponent(uuid)}`,
          { headers: { Authorization: process.env.workerAUTH } },
        );
        return response.data;
      } catch (error) {
        if (isNotFound(error)) return null;
        throw error;
      }
    },

    async getUserByUsername(username) {
      try {
        const response = await httpClient.get(
          `${WORKER_API}/user/by-username/${encodeURIComponent(username)}`,
          { headers: { Authorization: process.env.workerAUTH } },
        );
        return response.data;
      } catch (error) {
        if (isNotFound(error)) return null;
        throw error;
      }
    },

    async isPremium(uuid) {
      try {
        const response = await httpClient.post(
          `${WORKER_API}/users/premium`,
          { uuid },
          { headers: jsonHeaders() },
        );
        return response.data;
      } catch (error) {
        if (isNotFound(error)) return null;
        throw error;
      }
    },

    async writeSave(uuid, saveData) {
      const response = await httpClient.post(
        `${WORKER_API}/users/uploadSave`,
        { uuid, saveData },
        { headers: jsonHeaders(), maxBodyLength: Infinity },
      );
      return response.data;
    },

    async readSave(uuid) {
      try {
        // Keep the body as the raw JSON string, as the Postgres backend does.
        const response = await httpClient.post(
          `${WORKER_API}/users/readSave`,
          { uuid },
          {
            headers: jsonHeaders(),
            responseType: "text",
            transformResponse: [(body) => body],
            maxContentLength: Infinity,
          },
        );
        return response.data;
      } catch (error) {
        if (isNotFound(error)) return null;
        throw error;
      }
    },
  };
}
