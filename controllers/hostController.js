const Home = require("../models/home");
const fs = require("fs");

exports.getHostHomes = (req, res) => {
  Home.find().then((registeredHomes) => {
    res.render("host/host-home-list", {
      registeredHomes: registeredHomes,
      title: "Host Homes List",
      currentPage: "host-homes",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  });
};

exports.getAddHome = (req, res) => {
  res.render("host/add-home", {
    title: "Add Home - Airbnb",
    currentPage: "add-home",
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
  });
};

exports.getEditHome = (req, res) => {
  const homeId = req.params.id;
  const editing = req.query.editing === "true";

  Home.findById(homeId).then((home) => {
    if (!home) {
      console.log("Home not found");
      return res.redirect("/host/host-home-list");
    }
    res.render("host/edit-home", {
      home: home,
      title: "Edit Home - Airbnb",
      currentPage: "host-homes",
      editing: editing,
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  });
};

exports.postAddHome = (req, res) => {
  const { houseName, price, location, rating, description } = req.body;
  if (!req.file) {
    return res.status(422).send("No file uploaded");
  }

  const photo = req.file.path;

  const homes = new Home({
    houseName,
    price,
    location,
    rating,
    photo,
    description,
  });
  homes.save().then(() => {
    console.log("Home added successfully");
  });
  res.redirect("/host/host-home-list");
};

exports.postEditHome = (req, res) => {
  const { id, houseName, price, location, rating, description } = req.body;

  Home.findById(id)
    .then((home) => {
      home.houseName = houseName;
      home.price = price;
      home.location = location;
      home.rating = rating;
      home.description = description;

      if (req.file) {
        fs.unlink(home.photo, (err) => {
          if (err) {
            console.log("Error deleting old photo:", err);
          }
        });
        home.photo = req.file.path;
      }

      home
        .save()
        .then(() => {
          console.log("Home updated successfully");
        })
        .catch((error) => {
          console.log("Error updating home:", error);
        });
      res.redirect("/host/host-home-list");
    })
    .catch((error) => {
      console.log("Error fetching home for editing:", error);
      res.redirect("/host/host-home-list");
    });
};

exports.postDeleteHome = (req, res) => {
  const homeId = req.params.id;
  Home.findByIdAndDelete(homeId)
    .then(() => {
      console.log("Home deleted successfully");
      res.redirect("/host/host-home-list");
    })
    .catch((error) => {
      console.log("Error deleting home:", error);
      res.redirect("/host/host-home-list");
    });
};
