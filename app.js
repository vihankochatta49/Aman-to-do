//jshint eversion: 6
const express = require("express");
const bodyparser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();
mongoose.connect(
  "mongodb+srv://codex:5A46yEm8Q7rMfaTa@cluster0.txepu.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);
const itemsschema = {
  name: String,
};
const Item = mongoose.model("Item", itemsschema);

const buy = new Item({
  name: "Hit the right checkbox to delete the task.",
});
const sell = new Item({
  name: "Sell food",
});
const eat = new Item({
  name: "Eat food",
});
const defaultarray = [buy];
app.set("view engine", "ejs");

app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  const day = date.getDate();

  const p = Item.find({}, (err, founditems) => {
    if (founditems.length == 0) {
      Item.insertMany(defaultarray, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("sucessfully added");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { acday: day, newListItems: founditems });
    }
  });
});

app.post("/", (req, res) => {
  let item = req.body.newitem;
  let tempitem = new Item({
    name: item,
  });
  tempitem.save();
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  let tempid = req.body.checkbox;
  Item.findByIdAndRemove(tempid, (err) => {
    if (!err) {
      console.log("sucessfully deleted");
    }
  });
  res.redirect("/");
});
app.listen(3000, () => {
  console.log("You popped into the server");
});
