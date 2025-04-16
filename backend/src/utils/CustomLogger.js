import pino from 'pino';
const logger = pino({
  level: 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      levelFirst: true,
      translateTime: 'yyyy-mm-dd HH:MM:ss',
    }
  },
  name: 'MediSync-AI'
});

const logError = (error) => {
 
    logger.error({
        message: error,
        stack: error.stack,
    });
   
}
 
const logInfo = (message) => {
    
    logger.info(message);
    
}


export { logger, logError, logInfo };