//hacer login con Passport
import express, { Request, Response, NextFunction } from "express";
import passport from "passport";
import localStrategy from "./strategies/local";
import { InstanceType } from "typegoose";
import httpStatus from "http-status";
import { AuthorModel } from "../../../models";
import Author from "../../../models/Author";

const router = express.Router({
	mergeParams: true,
});

passport.use(localStrategy);

passport.serializeUser(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(user: { id: string }, done: (err: any, id?: string) => void): void => {
		done(null, user.id);
	}
);

passport.deserializeUser(
	async (
		id: string,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		done: (err: any, user?: InstanceType<Author>) => void
	): Promise<void> => {
		try {
			const user = await AuthorModel.findById(id);

			if (user) {
				done(null, user);
			} else {
				done("error");
			}
		} catch (e) {
			done(e);
		}
	}
);

router.route("/login").post(
	passport.authenticate("local", {
		successRedirect: "/api/auth/me",
		failureRedirect: "/api/auth/me",
	})
);

router.route("/logout").post(
	(req: Request, res: Response): void => {
		req.logout();
		res.sendStatus(httpStatus.OK);
	}
);

router.route("/me").get(
	(req: Request, res: Response): void => {
		if (req.user) {
			res.status(httpStatus.OK).json(req.user);
		} else {
			res.sendStatus(httpStatus.NOT_FOUND);
		}
	}
);

export default router;
