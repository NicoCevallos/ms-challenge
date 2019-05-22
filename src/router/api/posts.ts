import express from "express";
import { postsController } from "../../controllers";

const router = express.Router({
	mergeParams: true,
});

router
	.route("")
	.post(postsController.create)
	.get(postsController.getAll);

router
	.route("/:id")
	.get(postsController.getById)
	.put(postsController.updateById)
	.delete(postsController.deleteById);

export default router;
