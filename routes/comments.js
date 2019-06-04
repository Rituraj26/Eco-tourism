var express = require("express");
var router  = express.Router({mergeParams: true});
var Ecotourism = require("../models/ecotourism");
var Comment = require("../models/comment");
var middleware = require("../middleware");


router.get("/new", middleware.isLoggedIn, function(req, res){
    Ecotourism.findById(req.params.id, function(err, newdetails){
        if(err){
            console.log(err);
        } else {
            res.render("comment/new", {newdetails: newdetails});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
    Ecotourism.findById(req.params.id, function(err, ecotourism){
        if(err){
            console.log(err);
            res.redirect("/ecotourism");
        } else {
            Comment.create(req.body.newcomment, function(err, comment){
                if(err){
                    console.log(err);
                }   else    {
                  comment.name.id = req.user.id;
                  comment.name.username = req.user.username;
                  comment.save();
                  ecotourism.comments.push(comment);
                  ecotourism.save();
                  res.redirect("/ecotourism/" + ecotourism._id);
                }
            });
        }
    });
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, comment){
        if(err){
            console.log(err);
        }   else    {
            res.render("comment/edit", {ecotourism_id: req.params.id, comment: comment});
        }
    });
});

router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.editcomment, function(err, comment){
        if(err){
            console.log(err);
        }   else    {
            res.redirect("/ecotourism/" + req.params.id);
        }
    });
});

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err, comment){
        if(err){
            console.log(err);
        }   else    {
            res.redirect("/ecotourism/" + req.params.id);
        }
    });
});


module.exports = router;