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
			const model = new this.Model({ ...req.body, author: req.user._id });

			const result = await model.save();

			res.status(httpStatus.OK).json(result);
		} catch (e) {
			if (e instanceof mongoose.Error.ValidationError) {
				res.status(httpStatus.BAD_REQUEST).json(e.errors);

				return;
			}

			throw e;
		}
	};

	public getAll = async (req: Request, res: Response): Promise<void> => {
		const regexp = new RegExp(req.query.search, "i");

		const result = await this.Model.find({ author: req.user._id }).or([
			{ title: regexp },
			{ body: regexp },
		]);

		if (result) {
			res.status(httpStatus.OK).json(result);
		} else {
			res.sendStatus(httpStatus.NOT_FOUND);
		}
	};

	public getById = async (req: Request, res: Response): Promise<void> => {
		try {
			const result = await this.Model.findOne({
				_id: req.params.id,
				author: req.user._id,
			});

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
			const model = await this.Model.findOneAndUpdate(
				{
					_id: req.params.id,
					author: req.user._id,
				},
				req.body
			);

			if (model) {
				const result = await this.Model.findOne({
					_id: req.params.id,
					author: req.user._id,
				});

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
			const result = await this.Model.findOneAndDelete({
				_id: req.params.id,
				author: req.user._id,
			});

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
