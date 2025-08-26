exports.getLogin = (req, res) => {
  res.render("auth/login", {
    title: "Login",
    currentPage: "login",
    isLoggedIn: false,
  });
};

exports.postLogin = (req, res) => {
  console.log(req.body);
  // req.isLoggedIn = true;
  res.cookie("isLoggedIn", true);
  res.redirect("/");
};

exports.postLogout = (req, res) => {
  console.log(req.body);
  // req.isLoggedIn = true;
  res.cookie("isLoggedIn", false);
  res.redirect("/login");
};
