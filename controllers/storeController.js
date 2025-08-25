const Home = require("../models/home");
const Favourite = require("../models/favourite");

exports.getIndex = (req, res) => {
  Home.fetchAll().then((registeredHomes) => {
    res.render("store/index", {
      registeredHomes: registeredHomes,
      title: "Index - Airbnb",
      currentPage: "index",
    });
  });
};

exports.getHomes = (req, res) => {
  Home.fetchAll().then((registeredHomes) => {
    res.render("store/home-list", {
      registeredHomes: registeredHomes,
      title: "Homes List",
      currentPage: "homes",
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
      });
    }
  });
};

exports.getBookings = (req, res) => {
  res.render("store/bookings", {
    title: "Bookings - Airbnb",
    currentPage: "bookings",
  });
};

exports.getFavouritesList = (req, res) => {
  Favourite.getFavourites().then((favourites) => {
    favourites = favourites.map((fav) => fav.houseId);
    Home.fetchAll().then((registeredHomes) => {
      console.log(favourites, registeredHomes);
      const favouriteHomes = registeredHomes.filter((home) =>
        favourites.includes(home._id.toString())
      );

      res.render("store/favourite-list", {
        favouriteHomes: favouriteHomes,
        title: "Favourites - Airbnb",
        currentPage: "favourites",
      });
    });
  });
};

exports.postAddToFavourites = (req, res) => {
  const homeId = req.body.id;
  const favObj = new Favourite(homeId);
  favObj
    .save()
    .then((result) => {
      console.log("Favourite added: ", result);
    })
    .catch((error) => {
      console.error("Error adding to favourites:", error);
    })
    .finally(() => {
      res.redirect("/favourites");
    });
};

exports.postDeleteFavourite = (req, res) => {
  const id = req.params.id;
  Favourite.deleteById(id)
    .then((result) => {
      console.log("Favourite deleted:", result);
      res.redirect("/favourites");
    })
    .catch((err) => {
      console.error("Error deleting from favourites:", err);
      res.redirect("/favourites");
    });
};
