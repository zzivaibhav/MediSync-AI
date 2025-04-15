// import pino from 'pino';
// const logger = pino({
//   level: 'info',
//   transport: {
//     target: 'pino-pretty',
//     options: {
//       colorize: true,
//       levelFirst: true,
//       translateTime: 'yyyy-mm-dd HH:MM:ss',
//     }
//   },
//   name: 'MediSync-AI'
// });

// const logError = (error) => {
//     console.log("🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫");
//     logger.error({
//         message: error.message,
//         stack: error.stack,
//     });
//     console.log("🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫");
// }
 
// const logInfo = (message) => {
//     console.log("✅✅✅✅✅✅✅✅✅✅✅");
//     logger.info(message);
//     console.log("✅✅✅✅✅✅✅✅✅✅✅");
// }


// export { logger, logError, logInfo };