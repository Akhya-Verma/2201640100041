const fs = require("fs");
const path = require("path");

const logFile = path.join(__dirname, "../logs/requests.log");

function logger(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const logEntry = `[${new Date().toISOString()}] ${req.method} ${
      req.originalUrl
    } ${res.statusCode} - ${duration}ms\n`;

    fs.appendFileSync(logFile, logEntry);
  });

  next();
}

module.exports = logger;
