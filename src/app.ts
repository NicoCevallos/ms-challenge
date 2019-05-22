import express, { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import routes from "./router";

const app = express();

app.use(routes);

// Error handler
app.use(
	(
		err: { status: number },
		req: Request,
		res: Response,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		next: NextFunction
	): void => {
		const status = err.status || httpStatus.INTERNAL_SERVER_ERROR;

		res.sendStatus(status);
	}
);

export default app;
