const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const { emailForm } = require("./controllers/email");
const { errorHandler } = require("./middlewares/errorHandler");

dotenv.config();
const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.post("/api/send", emailForm);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
  });
}

app.use(errorHandler);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port: ${port}.`);
});
