var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");


router.get("/", function(req, res){
    res.render("landing");
});

router.get("/register", function(req, res){
    res.render("register"); 
});

router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	if(req.body.admincode === process.env.ADMINCODE){
    	newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
		if(err){
				req.flash("error", err.message);
				return res.redirect("/register");
		}                 
		passport.authenticate("local")(req, res, function(){
				req.flash("success", "Welcome to Ecotourism");
				res.redirect("/ecotourism");
		});
    });
});

router.get("/login", function(req, res){
    res.render("login"); 
});

router.post("/login", function (req, res, next) {
  passport.authenticate("local",
    {
      successRedirect: "/ecotourism",
      failureRedirect: "/login",
      failureFlash: true,
      successFlash: "Welcome , " + req.body.username + "!"
    })(req, res);
});

router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Succesfully logged out");
    res.redirect("/ecotourism");
});


module.exports = router;