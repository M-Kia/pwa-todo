const port = 5000,
  mail = "kiahosseini.smh@gmail.com",
  publicKey =
    "BHM0VeVBZ9AMxseYwz4qCVBggcb07DiwwsfxEpP17efENzyRYabaY6dnaIX8HysyAtkKkbT8U6IXwEkIHQDeTUc",
  privateKey = "AFy674CFJL2nYg3RWJ39T0JSnS7kNJR7gBSkiXmwGkU";

const express = require("express"),
  bodyParser = require("body-parser"),
  // fs = require("fs"),
  path = require("path"),
  webpush = require("web-push"),
  cors = require("cors"),
  // https = require("https"),
  mongoose = require("mongoose");

// const key = fs.readFileSync("./key.pem~");

// const cert = fs.readFileSync("./cert.pem");

const app = express();

webpush.setVapidDetails("mailto:" + mail, publicKey, privateKey);

app.use(cors({ origin: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

app.post("/mypush", (req, res) => {
  res.status(201).json({});
  // webpush
  //   .sendNotification(
  //     req.body,
  //     JSON.stringify({
  //       title: "Kia Todo",
  //       body: "Yes, it works!",
  //       icon:
  //     })
  //   )
  //   .catch((err) => console.log(err));
});

app.use("/api", require("./routes/api"));

mongoose
  .connect("mongodb://localhost:27017")
  .then(() => {
    app.listen(port, () => console.log("Server listening on port " + port));
    // https
    //   .createServer({ key, cert }, app)
    //   .listen(port, () => console.log("Server listening on port " + port));
  })
  .catch((err) => console.log(err));
