const { getDb } = require("../utils/databaseUtil");

module.exports = class Favourite {
  constructor(houseId) {
    if (houseId) {
      this.houseId = houseId;
    }
  }

  save() {
    const db = getDb();
    return db
      .collection("favourites")
      .findOne({ houseId: this.houseId })
      .then((existing) => {
        if (existing) {
          console.log("Already in favourites");
          return Promise.resolve();
        }
        return db.collection("favourites").insertOne(this);
      });
  }

  static getFavourites() {
    const db = getDb();
    return db.collection("favourites").find().toArray();
  }

  static deleteById(id) {
    const db = getDb();
    return db.collection("favourites").deleteOne({ houseId: id });
  }
};
