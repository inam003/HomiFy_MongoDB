const Home = require("../models/home");
const User = require("../models/user");

exports.getIndex = (req, res) => {
  Home.find().then((registeredHomes) => {
    res.render("store/index", {
      registeredHomes: registeredHomes,
      title: "Index - Airbnb",
      currentPage: "index",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
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
      user: req.session.user,
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
        user: req.session.user,
      });
    }
  });
};

exports.getBookings = (req, res) => {
  res.render("store/bookings", {
    title: "Bookings - Airbnb",
    currentPage: "bookings",
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
  });
};

exports.getFavouritesList = async (req, res) => {
  const userId = req.session.user._id;
  const user = await User.findById(userId).populate("favourites");

  res.render("store/favourite-list", {
    favouriteHomes: user.favourites,
    title: "Favourites - Airbnb",
    currentPage: "favourites",
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
  });
};

exports.postAddToFavourites = async (req, res) => {
  const homeId = req.body.id;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if (!user.favourites.includes(homeId)) {
    user.favourites.push(homeId);
    await user.save();
  }
  res.redirect("/favourites");
};

exports.postDeleteFavourite = async (req, res) => {
  const homeId = req.params.id;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if (user.favourites.includes(homeId)) {
    user.favourites = user.favourites.filter((favId) => favId != homeId);
    await user.save();
  }
  res.redirect("/favourites");
};
