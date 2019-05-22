import express, { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import auth from "./auth";
import authors from "./authors";
import posts from "./posts";

var router = express.Router({ mergeParams: true });

var validateUser = function(
	req: Request,
	res: Response,
	next: NextFunction
): void {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	if (!(req as any).user && req.method !== "OPTIONS") {
		res.sendStatus(httpStatus.UNAUTHORIZED);
	} else {
		next();
	}
};

router.use("/auth", auth);

router.use("/authors", authors);

router.use("/posts", validateUser, posts);

export default router;
