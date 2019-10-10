var express = require("express");
var app = express();


app.set("view engine", "ejs");

app.get("/", function(req, res){
  res.render("landing");
});

app.get("/campgrounds", function(req, res){
  var campgrounds = [
    {name: "Salmon Creek", image: "https://live.staticflickr.com/4040/34931985723_362519561d_b.jpg"},
    {name: "Bear Creek", image: "https://natlands.org/wp-content/uploads/2017/05/Bear-Creek_Nicholas-A-Tonelli-3-2560x1160.jpg"},
    {name: "Joffre Lake", image: "https://wanderlustmegan.files.wordpress.com/2015/09/b49ec-joffrelakehike.jpg"}
  ]

  res.render("campgrounds", {campgrounds: campgrounds});
});

app.listen(3000, function(){
  console.log("YelpCamp server has started!");
});