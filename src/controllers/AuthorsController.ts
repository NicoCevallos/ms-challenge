import { Request, Response } from "express";
import httpStatus from "http-status";
import { ModelType } from "typegoose";
import mongoose from "mongoose";
import Author from "../models/Author";

export default class AuthorsController {
	private Model: ModelType<Author>;

	public constructor(Model: ModelType<Author>) {
		this.Model = Model;
	}

	public create = async (req: Request, res: Response): Promise<void> => {
		try {
			const model = new this.Model(req.body);

			const result = await model.save();

			res.status(httpStatus.OK).json(result);
		} catch (e) {
			if (e instanceof mongoose.Error.ValidationError) {
				res.status(httpStatus.BAD_REQUEST).json(e.errors);

				return;
			} else if (e.code === 11000) {
				res.status(httpStatus.BAD_REQUEST).json({
					message: "name already taken",
				});

				return;
			}
			throw e;
		}
	};

	public getAll = async (req: Request, res: Response): Promise<void> => {
		const result = await this.Model.find();

		if (result) {
			res.status(httpStatus.OK).json(result);
		} else {
			res.sendStatus(httpStatus.NOT_FOUND);
		}
	};

	public getById = async (req: Request, res: Response): Promise<void> => {
		try {
			const result = await this.Model.findById(req.params.id);

			if (result) {
				res.status(httpStatus.OK).json(result);

				return;
			}
		} catch (e) {
			if (!(e instanceof mongoose.Error.CastError)) {
				throw e;
			}
		}

		res.sendStatus(httpStatus.NOT_FOUND);
	};

	public updateById = async (req: Request, res: Response): Promise<void> => {
		try {
			const model = await this.Model.findByIdAndUpdate(req.params.id, req.body);

			if (model) {
				const result = await this.Model.findById(req.params.id);

				res.status(httpStatus.OK).json(result);

				return;
			}
		} catch (e) {
			if (e instanceof mongoose.Error.ValidationError) {
				res.status(httpStatus.BAD_REQUEST).json(e.errors);

				return;
			} else if (!(e instanceof mongoose.Error.CastError)) {
				throw e;
			}
		}

		res.sendStatus(httpStatus.NOT_FOUND);
	};

	public deleteById = async (req: Request, res: Response): Promise<void> => {
		try {
			const result = await this.Model.findByIdAndDelete(req.params.id);

			if (result) {
				res.sendStatus(httpStatus.OK);

				return;
			}
		} catch (e) {
			if (e instanceof mongoose.Error.ValidationError) {
				res.status(httpStatus.BAD_REQUEST).json(e.errors);

				return;
			} else if (!(e instanceof mongoose.Error.CastError)) {
				throw e;
			}
		}

		res.sendStatus(httpStatus.NOT_FOUND);
	};
}
