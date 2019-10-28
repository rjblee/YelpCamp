var express       = require("express");
var app           = express();
var bodyParser    = require("body-parser");
var mongoose      = require("mongoose");
var passport      = require("passport");
var LocalStrategy = require("passport-local");
var Campground    = require("./models/campground");
var Comment       = require("./models/comment");
var User          = require("./models/user");
var seedDB        = require("./seeds");

seedDB();

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));


// =========================
// PASSPORT CONFIGURATION
// =========================

app.use(require("express-session")({
	secret: "Once again Rusty wins cutest dog!",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/", function(req, res){
  res.render("landing");
});

app.get("/campgrounds", function(req, res){
  Campground.find({}, function(err, allCampgrounds){
	  res.render("campgrounds/index", {campgrounds: allCampgrounds})
  });
});

app.post("/campgrounds", function(req, res){
  // Get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var newCampground = {name: name, image: image, description: description}

Campground.create(newCampground, function(err, newlyCreated){
  // Redirect back to campgrounds page
    res.redirect("/campgrounds"); 
  })
});

app.get("/campgrounds/new", function(req, res){
  res.render("campgrounds/new.ejs");
})

// =========================
// SHOW - shows more info about one campground
// =========================

app.get("/campgrounds/:id", function(req, res){
  // Find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		res.render("campgrounds/show", {campground: foundCampground});
	});
})

// =========================
// COMMENT ROUTE
// =========================

app.get("/campgrounds/:id/comments/new", function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	})
})

app.post("/campgrounds/:id/comments", function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				} else {
					campground.comments.push(comment);
					campground.save();
					res.redirect('/campgrounds/' + campground._id);
				}
			})
		}
	})
})

// =========================
// AUTHENTICATION ROUTES
// =========================

// Show register form
app.get("/register", function(req, res){
	res.render("register");
})

// Handle sign up logic
app.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/campgrounds");
		});
	});
});

// Show login form
app.get("/login", function(req, res){
	res.render("login");
});

app.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}), function(req, res){
});



// app.listen(process.env.PORT, process.env.IP, function(){
//   console.log("YelpCamp server has started!");
// });

app.listen(3000, function(){
  console.log("YelpCamp server has started!");
});