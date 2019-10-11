var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

var campgrounds = [
  {name: "Salmon Creek", image: "https://live.staticflickr.com/4040/34931985723_362519561d_b.jpg"},
  {name: "Bear Creek", image: "https://natlands.org/wp-content/uploads/2017/05/Bear-Creek_Nicholas-A-Tonelli-3-2560x1160.jpg"},
  {name: "Joffre Lake", image: "https://wanderlustmegan.files.wordpress.com/2015/09/b49ec-joffrelakehike.jpg"}
]

app.get("/", function(req, res){
  res.render("landing");
});

app.get("/campgrounds", function(req, res){

  res.render("campgrounds", {campgrounds: campgrounds});
});

app.post("/campgrounds", function(req, res){
  // Get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var newCampground = {name: name, image: image}

  campgrounds.push(newCampground);
  // Redirect back to campgrounds page

  res.redirect("/campgrounds");
})

app.get("/campgrounds/new", function(req, res){
  res.render("new.ejs");
})

app.listen(3000, function(){
  console.log("YelpCamp server has started!");
});