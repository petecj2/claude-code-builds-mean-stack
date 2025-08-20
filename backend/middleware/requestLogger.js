// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Override res.end to log after response is sent
  const originalEnd = res.end;
  res.end = function(...args) {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();
    
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
    
    originalEnd.apply(this, args);
  };
  
  next();
};

module.exports = requestLogger;