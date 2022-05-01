//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://Azunda:dondizzy12@cluster0.ril9b.mongodb.net/todolistDB")
const itemschema = {
  name:String

};
const Item = mongoose.model("item", itemschema)


const item1 = new Item({
  name: "welcome to your to do list "
})


const item2 = new Item({
  name: "Today is a great day "
})
const item3 = new Item({
  name: "Sunny day for a walk "
})
const defaultitems = [item1, item2, item3]
const listchema = {
  name: String,
  items:[itemschema]
}

const List = mongoose.model("list",listchema)

app.get("/", function(req, res) {
  Item.find({}, function(err, items) {
    if (items.length === 0) {
      Item.insertMany(defaultitems, function(err) {
        if (err) {
          console.log(err)
        } else {
          console.log("inserted");
        }
      })


    } else {
      res.render("list", {
        listTitle: "Today",
        newListItems: items
      })


    }




  })





});

app.post("/", function(req, res) {

  const item = req.body.newItem;
  const listname = req.body.list
  const newitem = new Item({
    name: item
  })
  if (listname==="Today"){
    newitem.save()

    res.redirect("/")
  }else{
    List.findOne({name:listname},function(err,found){
      found.items.push(newitem)
      found.save()
      res.redirect("/"+listname)
    })
  }





});
app.post("/delete", function(req, res) {
  const itemly = req.body.checkbox
  const name = req.body.listname
  if (name=== "Today"){
    Item.deleteOne({name:itemly},function(err){
      if(err){console.log(err);}else{
        console.log("removed object");
      }
      res.redirect("/")
    })

  }else{
    List.updateOne({name:name},{$pull:{items:{name:itemly}}},function(err){
      if(err){
        console.log(err);
      }else{
        res.redirect("/"+name)
      }
    })
  }

  })
  app.get("/:custom",function(req,res){
    const custom = req.params.custom;

    List.findOne({name:custom},function(err,founditems){
      if(err){
        console.log(err);
      }else if (founditems){
        res.render("list",{listTitle:custom,newListItems:founditems.items})

      }else if (!founditems){
        const list = new List({
          name:custom,
          items:defaultitems


        })
        list.save()
          res.render("list",{listTitle:list.name,newListItems:list.items})


      }
    })
  })










app.get("/work", function(req, res) {
  res.render("list", {
    listTitle: "Work List",
    newListItems: workItems
  });
});




app.get("/about", function(req, res) {
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
