var express = require("express");
var router  = express.Router();
var Art = require("../models/artcraft");
var middleware = require("../middleware");
var multer = require('multer');
var cloudinary = require('cloudinary');
// var request = require("request");


var storage = multer.diskStorage({
	filename: function(req, file, callback) {
		callback(null, Date.now() + file.originalname);
	}
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter});


cloudinary.config({ 
  cloud_name: 'rickyich', 
  api_key: 685182919123641, 
  api_secret: "QF7I2PBVQ0H7VjajHeUr86FFUZk"
});

router.get("/", function(req, res){
    Art.find({}, function(err, artcraft){
        if(err){
            console.log(err);
        } else  {
            res.render("artcraft/index", {artcraft: artcraft});
        }
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("artcraft/new");
});

router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res){
	cloudinary.uploader.upload(req.file.path, function(result) {
		req.body.artcraft.image = result.secure_url;
		req.body.artcraft.author = {
			id: req.user._id,
			username: req.user.username
		}
		Art.create(req.body.artcraft, function(err, artcraft) {
			if (err) {
				req.flash('error', err.message);
				return res.redirect('back');
			}
			res.redirect('/artcraft');
		});
	});
});

router.get("/:id", function(req, res){
    Art.findById(req.params.id).populate("comments").exec(function(err, artdetails){
        if(err){
            console.log(err);
        }   else    {
            res.render("artcraft/show", {artdetails: artdetails});
        }
    }); 
});

router.get("/:id/edit", middleware.checkArtCraftOwnership, function(req, res){
    Art.findById(req.params.id, function(err, editedart){
		if(err){
			console.log(err);
		}   else    {
			res.render("artcraft/edit", {editedart: editedart});
		}
    });
});

router.put("/:id", middleware.checkArtCraftOwnership, function(req, res){
    Art.findByIdAndUpdate(req.params.id, req.body.editart, function(err, editedart){
		if(err){
			console.log(err);
		}   else    {
			res.redirect("/artcraft/" + editedart._id);
		}
    });
});

router.delete("/:id", middleware.checkArtCraftOwnership, function(req, res){
    Art.findByIdAndRemove(req.params.id, function(err, removed){
        if(err){
            console.log(err);
        }   else    {
            res.redirect("/artcraft");
        }
    });
});


module.exports = router;