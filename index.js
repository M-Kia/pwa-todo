const port = 5000;

const express = require("express"),
  bodyParser = require("body-parser"),
  path = require("path"),
  cors = require("cors"),
  mongoose = require("mongoose");

const app = express();

app.use(cors({ origin: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

app.use("/kia-api", require("./routes/api"));

mongoose
  .connect("mongodb://localhost:27017")
  .then(() => {
    app.listen(port, () => console.log("Server listening on port " + port));
  })
  .catch((err) => console.log(err));
