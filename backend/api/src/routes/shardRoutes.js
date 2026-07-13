import express from 'express';
import shardManager from '../services/sharding/ShardManager.js';
import { shardMiddleware, crossShardQuery } from '../middleware/shardMiddleware.js';

const router = express.Router();

// Get shard status
router.get('/shards/status', async (req, res) => {
  try {
    const status = await shardManager.healthCheck();
    res.json({
      success: true,
      data: status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get shard for location
router.get('/shards/location', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        error: 'lat and lng required'
      });
    }
    const shardName = shardManager.getShardForLocation(
      parseFloat(lat),
      parseFloat(lng)
    );
    res.json({
      success: true,
      data: {
        shard: shardName,
        lat: parseFloat(lat),
        lng: parseFloat(lng)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get orders from specific shard
router.get('/shards/:shardName/orders', shardMiddleware, async (req, res) => {
  try {
    const { shardName } = req.params;
    const connection = await shardManager.getShardConnection(shardName);
    const [rows] = await connection.execute(
      'SELECT * FROM orders ORDER BY created_at DESC LIMIT 100'
    );
    res.json({
      success: true,
      data: rows,
      shard: shardName
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Cross-shard query
router.get('/shards/all/orders', crossShardQuery, async (req, res) => {
  try {
    const results = await req.executeCrossShard(
      'SELECT COUNT(*) as total FROM orders'
    );
    const total = results.reduce((sum, r) => sum + parseInt(r.data[0]?.total || 0), 0);
    res.json({
      success: true,
      data: {
        total,
        shards: results
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;