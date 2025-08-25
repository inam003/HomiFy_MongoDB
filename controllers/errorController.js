exports.pageNotFound = (req, res) => {
  res
    .status(404)
    .render("404", { title: "404 Not Found - Airbnb", currentPage: "404" });
};
