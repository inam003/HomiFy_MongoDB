const { ObjectId } = require("mongodb");
const { getDb } = require("../utils/databaseUtil");

module.exports = class Home {
  constructor(houseName, price, location, rating, photo, description, _id) {
    this.houseName = houseName;
    this.price = price;
    this.location = location;
    this.rating = rating;
    this.photo = photo;
    this.description = description;
    if (_id) {
      this._id = _id;
    }
  }

  save() {
    const db = getDb();
    if (this._id) {
      const updatedFields = {
        houseName: this.houseName,
        price: this.price,
        location: this.location,
        rating: this.rating,
        photo: this.photo,
        description: this.description,
      };
      return db
        .collection("homes")
        .updateOne(
          { _id: new ObjectId(String(this._id)) },
          { $set: updatedFields }
        );
    } else {
      return db.collection("homes").insertOne(this);
    }
  }

  static fetchAll() {
    const db = getDb();
    return db.collection("homes").find().toArray();
  }

  static findById(id) {
    const db = getDb();
    return db
      .collection("homes")
      .find({ _id: new ObjectId(String(id)) })
      .next();
  }

  static deleteById(id) {
    const db = getDb();
    return db.collection("homes").deleteOne({ _id: new ObjectId(String(id)) });
  }
};
