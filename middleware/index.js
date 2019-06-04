var Comment = require("../models/comment");
var Art = require("../models/ecotourism");


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
}

function checkecotourismOwnership(req, res, next){
	if(req.isAuthenticated()){
		Art.findById(req.params.id, function(err, ecotourism){
			if(err){
				req.flash("error", "Something went wrong!"); 
				res.redirect("back");
			}  else {
				if(ecotourism.author.id.equals(req.user._id) || req.user.isAdmin) {
					next();
				} else {
					req.flash("error", "You don't have permission to do that!");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that!");
		res.redirect("back");
	}
}

function checkCommentOwnership(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, comment){
			if(err){
				req.flash("error", "Something went wrong!");
				res.redirect("back");
			} else {
				if(comment.name.id.equals(req.user._id) || req.user.isAdmin){
					next();
				}   else    {
					req.flash("error", "You don't have permission to do that!");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that!");
		res.redirect("back");
	}
}


module.exports = {
	isLoggedIn,
	checkecotourismOwnership,
	checkCommentOwnership
}