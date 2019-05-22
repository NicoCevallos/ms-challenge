import express from "express";
import bodyParser from "body-parser";
import expressSession from "express-session";
import passport from "passport";
import api from "./api";

var router = express.Router({ mergeParams: true });

router.use("/api", [
	bodyParser.json(),
	bodyParser.urlencoded({ extended: false }),
	expressSession({
		secret: "keyboard cat",
		resave: false,
		saveUninitialized: false,
	}),
	passport.initialize(),
	passport.session(),
	api,
]);

export default router;
