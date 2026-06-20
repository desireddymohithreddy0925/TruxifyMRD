const logger = require('./logger');

class WebSocketTracker {
  constructor(socket) {
    this.socket = socket;
    this.initialize();
  }

  initialize() {
    logger.info('WebSocket connection initialized', { socketId: this.socket.id });

    this.socket.on('join_room', (data) => {
      try {
        logger.info('Driver joined telemetry room', { 
          socketId: this.socket.id, 
          roomId: data.roomId,
          driverId: data.driverId 
        });
      } catch (err) {
        logger.error('Failed to process room join telemetry', {
          socketId: this.socket.id,
          errorMessage: err.message,
          errorStack: err.stack,
          contextData: data
        });
      }
    });

    this.socket.on('telemetry_ping', (payload) => {
      try {
        logger.debug('Received high-frequency telemetry ping', {
          socketId: this.socket.id,
          driverId: payload.driverId,
          coords: payload.coordinates
        });
      } catch (err) {
        logger.error('Failed to ingest telemetry coordinate frame', {
          socketId: this.socket.id,
          errorMessage: err.message,
          errorStack: err.stack
        });
      }
    });

    this.socket.on('disconnect', (reason) => {
      logger.info('WebSocket pipeline disconnected', { 
        socketId: this.socket.id, 
        disconnectReason: reason 
      });
    });
  }
}

module.exports = WebSocketTracker;
