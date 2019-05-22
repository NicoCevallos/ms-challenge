import test from "ava";
import sinon from "sinon";
import { ModelType } from "typegoose";
import { Request, Response } from "express";
import httpStatus from "http-status";
import AuthorsController from "../../src/controllers/AuthorsController";
import Author from "../../src/models/Author";

test("AuthorsController", async (t): Promise<void> => {
	const body = {
		name: "test-name",
		password: "ocus-pocus",
	};

	const result = {
		...body,
		_id: "1234567890",
	};

	const saveFake = sinon.fake.returns(result);
	const resJsonSpy = sinon.spy();
	const resStatusSpy = sinon.spy();

	const modelFactoryStub = sinon.stub();

	modelFactoryStub.withArgs(body).returns({
		save: saveFake,
	});

	const controller = new AuthorsController(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(modelFactoryStub as any) as ModelType<Author>
	);

	const req = {
		body,
	};

	const res = {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		status: function(code: number): any {
			resStatusSpy(code);
			return this;
		},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		json: function(obj: object): any {
			resJsonSpy(obj);
			return this;
		},
	};

	await controller.create(req as Request, res as Response);

	t.is(saveFake.calledOnce, true);
	t.is(saveFake.firstCall.args.length, 0);

	t.is(resStatusSpy.calledOnce, true);
	t.deepEqual(resStatusSpy.firstCall.args, [httpStatus.OK]);

	t.is(resJsonSpy.calledOnce, true);
	t.deepEqual(resJsonSpy.firstCall.args, [result]);
});
