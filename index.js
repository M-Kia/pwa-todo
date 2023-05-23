const port = 3000,
  mail = "kiahosseini.smh@gmail.com",
  publicKey =
    "BHM0VeVBZ9AMxseYwz4qCVBggcb07DiwwsfxEpP17efENzyRYabaY6dnaIX8HysyAtkKkbT8U6IXwEkIHQDeTUc",
  privateKey = "AFy674CFJL2nYg3RWJ39T0JSnS7kNJR7gBSkiXmwGkU";

const express = require("express"),
  bodyParser = require("body-parser"),
  path = require("path"),
  webpush = require("web-push"),
  cors = require("cors"),
  mongoose = require("mongoose");

webpush.setVapidDetails("mailto:" + mail, publicKey, privateKey);
const app = express();

app.use(cors({ origin: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

app.post("/mypush", (req, res) => {
  res.status(201).json({});
  webpush
    .sendNotification(
      req.body,
      JSON.stringify({
        title: "Welcome!",
        body: "Yes, it works!",
        icon: "i-loud.png",
        image: "i-zap.png",
      })
    )
    .catch((err) => console.log(err));
});

app.use("/api", require("./routes/api"));

mongoose
  .connect("mongodb://localhost:27017")
  .then(() => {
    app.listen(port);
  })
  .catch((err) => console.log(err));
