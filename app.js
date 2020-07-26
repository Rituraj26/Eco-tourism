const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const passport = require("passport");
const passportLocal = require("passport-local");
const expressSession = require("express-session");
const User = require("./models/user");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const dotenv = require("dotenv");
const connectDB = require("./config/db")

// Env Var Configuration
dotenv.config({ path: './config/config.env' });

// Database Connection
connectDB();

const indexRoutes = require('./routes/index');
const ecotourismRoutes = require('./routes/ecotourism');
const commentRoutes = require('./routes/comments');

app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

app.use(expressSession({
	secret: "Ecotourism are really an interesting thing",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	next();
});

app.use("/", indexRoutes);
app.use("/ecotourism", ecotourismRoutes);
app.use("/ecotourism/:id/comments", commentRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server Started at ${PORT}`);
})
