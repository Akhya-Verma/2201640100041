const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const logger = require("./middleware/logger");

dotenv.config();

const app = express();

app.use(logger);

// Body parser
app.use(express.json());

// DB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

// Routes
app.use("/api/url", require("./routes/url"));
app.use("/", require("./routes/url"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
