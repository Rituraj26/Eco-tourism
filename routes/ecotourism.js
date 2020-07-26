var express = require("express");
var router = express.Router();
var Ecotourism = require("../models/ecotourism");
var middleware = require("../middleware");
var multer = require('multer');
var cloudinary = require('cloudinary');
// var request = require("request");


var storage = multer.diskStorage({
	filename: function (req, file, callback) {
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
var upload = multer({ storage: storage, fileFilter: imageFilter });


cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
});

router.get("/", function (req, res) {
	Ecotourism.find({}, function (err, ecotourism) {
		if (err) {
			console.log(err);
		} else {
			res.render("ecotourism/index", { ecotourism: ecotourism });
		}
	});
});

router.get("/new", middleware.isLoggedIn, function (req, res) {
	res.render("ecotourism/new");
});

router.post("/", middleware.isLoggedIn, upload.single('image'), function (req, res) {
	cloudinary.uploader.upload(req.file.path, function (result) {
		req.body.ecotourism.image = result.secure_url;
		req.body.ecotourism.author = {
			id: req.user._id,
			username: req.user.username
		}
		Ecotourism.create(req.body.ecotourism, function (err, ecotourism) {
			if (err) {
				req.flash('error', err.message);
				return res.redirect('back');
			}
			res.redirect('/ecotourism');
		});
	});
});

router.get("/:id", function (req, res) {
	Ecotourism.findById(req.params.id).populate("comments").exec(function (err, Ecotourismdetails) {
		if (err) {
			console.log(err);
		} else {
			res.render("ecotourism/show", { Ecotourismdetails: Ecotourismdetails });
		}
	});
});

router.get("/:id/edit", middleware.checkecotourismOwnership, function (req, res) {
	Ecotourism.findById(req.params.id, function (err, editedEcotourism) {
		if (err) {
			console.log(err);
		} else {
			res.render("ecotourism/edit", { editedEcotourism: editedEcotourism });
		}
	});
});

router.put("/:id", middleware.checkecotourismOwnership, function (req, res) {
	Ecotourism.findByIdAndUpdate(req.params.id, req.body.editEcotourism, function (err, editedEcotourism) {
		if (err) {
			console.log(err);
		} else {
			res.redirect("/ecotourism/" + editedEcotourism._id);
		}
	});
});

router.delete("/:id", middleware.checkecotourismOwnership, function (req, res) {
	Ecotourism.findByIdAndRemove(req.params.id, function (err, removed) {
		if (err) {
			console.log(err);
		} else {
			res.redirect("/ecotourism");
		}
	});
});


module.exports = router;