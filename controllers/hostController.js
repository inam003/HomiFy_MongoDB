const Home = require("../models/home");

exports.getHostHomes = (req, res) => {
  Home.fetchAll().then((registeredHomes) => {
    res.render("host/host-home-list", {
      registeredHomes: registeredHomes,
      title: "Host Homes List",
      currentPage: "host-homes",
    });
  });
};

exports.getAddHome = (req, res) => {
  res.render("host/add-home", {
    title: "Add Home - Airbnb",
    currentPage: "add-home",
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
    });
  });
};

exports.postAddHome = (req, res) => {
  const { houseName, price, location, rating, photo, description } = req.body;
  const homes = new Home(
    houseName,
    price,
    location,
    rating,
    photo,
    description
  );
  homes.save().then(() => {
    console.log("Home added successfully");
  });
  res.redirect("/host/host-home-list");
};

exports.postEditHome = (req, res) => {
  const { id, houseName, price, location, rating, photo, description } =
    req.body;
  const home = new Home(
    houseName,
    price,
    location,
    rating,
    photo,
    description,
    id
  );
  home
    .save()
    .then((result) => {
      console.log("Home updated successfully:", result);
      res.redirect("/host/host-home-list");
    })
    .catch((err) => {
      console.log("Error updating home:", err);
      res.redirect("/host/host-home-list");
    });
};

exports.postDeleteHome = (req, res) => {
  const homeId = req.params.id;
  Home.deleteById(homeId)
    .then(() => {
      res.redirect("/host/host-home-list");
    })
    .catch((error) => {
      console.log("Error deleting home:", error);
      res.redirect("/host/host-home-list");
    });
};
