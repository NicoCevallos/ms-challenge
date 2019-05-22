import express from "express";
import { authorsController } from "../../controllers";

const router = express.Router({
	mergeParams: true,
});

router
	.route("")
	.post(authorsController.create)
	.get(authorsController.getAll);

router
	.route("/:id")
	.get(authorsController.getById)
	.put(authorsController.updateById)
	.delete(authorsController.deleteById);

export default router;
