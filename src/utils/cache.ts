import NodeCache from "node-cache";

export const stockCache = new NodeCache({ stdTTL: 3600 }); // TTL = 60 minutes
