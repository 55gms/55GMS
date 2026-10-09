const DEFAULT_ENDPOINTS = [
  'https://149-28-36-73.colyseus.dev/', // New Jersey
  'https://158-247-241-242.colyseus.dev/', // Seoul
];

let cachedEndpoints = null;
let cachedPingResults = null;

async function ping(endpoint) {
  const start = Date.now();
  try {
    await fetch(`${endpoint}ping`, { method: 'GET', mode: 'no-cors' });
    return Date.now() - start;
  } catch {
    return Infinity;
  }
}

async function averagePing(endpoint, count = 3) {
  let total = 0;
  for (let i = 0; i < count; i++) {
    total += await ping(endpoint);
  }
  return { endpoint, latency: total / count };
}

async function fetchEndpoints() {
  if (cachedEndpoints) return cachedEndpoints;

  try {
    const response = await fetch(`${DEFAULT_ENDPOINTS[0]}endpoints`, { method: 'GET' });
    if (response.ok) {
      cachedEndpoints = await response.json();
      return cachedEndpoints;
    }
  } catch {
    // Fall through to defaults
  }

  cachedEndpoints = DEFAULT_ENDPOINTS;
  return cachedEndpoints;
}

export async function getBestEndpoint(includeLocal = false) {
  const endpoints = await fetchEndpoints();
  const testPoints = includeLocal ? [...endpoints, 'http://localhost:2567/'] : endpoints;

  if (cachedPingResults && cachedPingResults.length > 0) {
    const relevantCached = cachedPingResults.filter(r => testPoints.includes(r.endpoint));

    if (relevantCached.length > 0) {
      const previousBest = relevantCached[0];
      const newPing = await averagePing(previousBest.endpoint);

      const betterCached = relevantCached.find(r => 
        r.endpoint !== previousBest.endpoint && r.latency < newPing.latency
      );

      if (!betterCached) {
        relevantCached[0] = newPing;
        cachedPingResults = relevantCached;
        return newPing.endpoint;
      }

      for (const candidate of relevantCached) {
        if (candidate.endpoint === previousBest.endpoint) continue;
        if (candidate.latency >= newPing.latency) break;

        const candidatePing = await averagePing(candidate.endpoint);

        if (candidatePing.latency < newPing.latency) {
          const updatedResults = relevantCached.map(r => {
            if (r.endpoint === previousBest.endpoint) return newPing;
            if (r.endpoint === candidate.endpoint) return candidatePing;
            return r;
          });
          updatedResults.sort((a, b) => a.latency - b.latency);
          cachedPingResults = updatedResults;
          return candidatePing.endpoint;
        }
      }

      relevantCached[0] = newPing;
      relevantCached.sort((a, b) => a.latency - b.latency);
      cachedPingResults = relevantCached;
      return newPing.endpoint;
    }
  }

  const results = await Promise.all(testPoints.map(ep => averagePing(ep)));
  results.sort((a, b) => a.latency - b.latency);
  cachedPingResults = results;
  return results[0].endpoint;
}

export function clearEndpointCache() {
  cachedEndpoints = null;
  cachedPingResults = null;
}