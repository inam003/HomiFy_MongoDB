const express = require("express");
const path = require("path");
const storeRouter = require("./routes/storeRouter");
const hostRouter = require("./routes/hostRouter");
const { pageNotFound } = require("./controllers/errorController");
const { mongoConnect } = require("./utils/databaseUtil");
require("dotenv").config();

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded());
app.use(storeRouter);
app.use("/host", hostRouter);

app.use(pageNotFound);

const port = 3002;
mongoConnect(() => {
  app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
  });
});
