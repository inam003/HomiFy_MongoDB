const express = require("express");
const storeRouter = express.Router();
const storeController = require("../controllers/storeController");

storeRouter.get("/", storeController.getIndex);
storeRouter.get("/homes", storeController.getHomes);
storeRouter.get("/homes/:id", storeController.getHomeDetails);
storeRouter.get("/bookings", storeController.getBookings);
storeRouter.get("/favourites", storeController.getFavouritesList);
storeRouter.post("/favourites", storeController.postAddToFavourites);
storeRouter.post("/favourites/delete/:id", storeController.postDeleteFavourite);

module.exports = storeRouter;
