const express = require("express");
const path = require("path");
const storeRouter = require("./routes/storeRouter");
const hostRouter = require("./routes/hostRouter");
const { authRouter } = require("./routes/authRouter");
const { pageNotFound } = require("./controllers/errorController");
const { default: mongoose } = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded());

app.use((req, res, next) => {
  console.log(req.get("Cookie"));
  req.isLoggedIn = req.get("Cookie")
    ? req.get("Cookie").split("=")[1] === "true"
    : false;
  next();
});

app.use(authRouter);
app.use(storeRouter);
app.use((req, res, next) => {
  if (req.isLoggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
});
app.use("/host", hostRouter);
app.use(authRouter);

app.use(pageNotFound);

const port = 3002;
const MONGODB_URL =
  "mongodb+srv://inamaslam003:inam_003@clusterone.l9tqz.mongodb.net/homify?retryWrites=true&w=majority&appName=ClusterOne";

mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server is running on port http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
