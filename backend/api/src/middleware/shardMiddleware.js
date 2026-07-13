import shardManager from '../services/sharding/ShardManager.js';
import logger from './logger.js';

export const shardMiddleware = async (req, res, next) => {
  try {
    // Extract location from request
    const lat = parseFloat(req.query.lat) || parseFloat(req.body.lat) || null;
    const lng = parseFloat(req.query.lng) || parseFloat(req.body.lng) || null;

    if (lat && lng) {
      const shardName = shardManager.getShardForLocation(lat, lng);
      req.shard = shardName;
      req.shardConnection = await shardManager.getShardConnection(shardName);
      
      // Cache shard info for this request
      await shardManager.redis.setex(
        `request:${req.requestId}:shard`,
        300,
        shardName
      );
      
      logger.info(`Request ${req.requestId} routed to shard: ${shardName}`);
    } else {
      // Default shard
      req.shard = 'north';
      req.shardConnection = await shardManager.getShardConnection('north');
    }

    // Add shard info to response headers
    res.setHeader('X-Shard', req.shard);
    res.setHeader('X-Shard-Healthy', 'true');
    
    next();
  } catch (error) {
    logger.error('Shard middleware error:', error);
    // Fallback to north shard
    req.shard = 'north';
    req.shardConnection = await shardManager.getShardConnection('north');
    next();
  }
};

export const crossShardQuery = async (req, res, next) => {
  req.executeCrossShard = async (query, params) => {
    return await shardManager.executeCrossShardQuery({ query, params });
  };
  next();
};