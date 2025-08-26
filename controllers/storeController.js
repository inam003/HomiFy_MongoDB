const Home = require("../models/home");
const Favourite = require("../models/favourite");

exports.getIndex = (req, res) => {
  Home.find().then((registeredHomes) => {
    res.render("store/index", {
      registeredHomes: registeredHomes,
      title: "Index - Airbnb",
      currentPage: "index",
      isLoggedIn: req.isLoggedIn,
    });
  });
};

exports.getHomes = (req, res) => {
  Home.find().then((registeredHomes) => {
    res.render("store/home-list", {
      registeredHomes: registeredHomes,
      title: "Homes List",
      currentPage: "homes",
      isLoggedIn: req.isLoggedIn,
    });
  });
};

exports.getHomeDetails = (req, res) => {
  const id = req.params.id;
  Home.findById(id).then((home) => {
    if (!home) {
      res.redirect("/homes");
      console.log("Home not found");
      return;
    } else {
      res.render("store/home-detail", {
        home: home,
        title: "Home Details",
        currentPage: "home-detail",
        isLoggedIn: req.isLoggedIn,
      });
    }
  });
};

exports.getBookings = (req, res) => {
  res.render("store/bookings", {
    title: "Bookings - Airbnb",
    currentPage: "bookings",
    isLoggedIn: req.isLoggedIn,
  });
};

exports.getFavouritesList = (req, res) => {
  Favourite.find()
    .populate("houseId")
    .then((favourites) => {
      const favouriteHomes = favourites.map((fav) => fav.houseId);

      res.render("store/favourite-list", {
        favouriteHomes: favouriteHomes,
        title: "Favourites - Airbnb",
        currentPage: "favourites",
        isLoggedIn: req.isLoggedIn,
      });
    });
};

exports.postAddToFavourites = (req, res) => {
  const homeId = req.body.id;
  Favourite.findOne({ houseId: homeId })
    .then((fav) => {
      if (fav) {
        console.log("Home already in favourites");
      } else {
        fav = new Favourite({ houseId: homeId });
        fav
          .save()
          .then(() => {
            console.log("Favourite added successfully");
          })
          .catch((error) => {
            console.error("Error adding to favourites:", error);
          });
      }
      res.redirect("/favourites");
    })
    .catch((error) => {
      console.error("Error checking favourites:", error);
    });
};

exports.postDeleteFavourite = (req, res) => {
  const homeId = req.params.id;
  Favourite.findOneAndDelete({ houseId: homeId })
    .then((result) => {
      console.log("Favourite deleted:", result);
      res.redirect("/favourites");
    })
    .catch((err) => {
      console.error("Error deleting from favourites:", err);
      res.redirect("/favourites");
    });
};
