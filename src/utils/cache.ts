import NodeCache from "node-cache";

export const stockCache = new NodeCache({ stdTTL: 1800 }); // TTL = 30 minutes
