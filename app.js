const express = require("express");
const path = require("path");
const storeRouter = require("./routes/storeRouter");
const hostRouter = require("./routes/hostRouter");
const { authRouter } = require("./routes/authRouter");
const { pageNotFound } = require("./controllers/errorController");
const { default: mongoose } = require("mongoose");
const session = require("express-session");
const multer = require("multer");
const MongoDBStore = require("connect-mongodb-session")(session);
require("dotenv").config();

const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
  console.error("MONGODB_URL environment variable is not set");
}

const store = new MongoDBStore({
  uri: MONGODB_URL,
  collection: "sessions",
});

store.on("error", function (error) {
  console.log("Session store error:", error);
});

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const randomString = (length) => {
  const characters = "abcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, randomString(10) + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

const multerOptions = {
  storage,
  fileFilter,
};

app.use(express.urlencoded());
app.use(multer(multerOptions).single("photo"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads/", express.static(path.join(__dirname, "uploads")));
app.use("/host/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/homes/uploads", express.static(path.join(__dirname, "uploads")));

app.use(
  session({
    secret: "intro-mongo",
    resave: false,
    saveUninitialized: true,
    store: store,
  })
);

app.use((req, res, next) => {
  req.isLoggedIn = req.session.isLoggedIn;
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

app.use(pageNotFound);

// Connect to MongoDB
mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// For local development
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 3002;
  app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
  });
}

// Export for Vercel
module.exports = app;
