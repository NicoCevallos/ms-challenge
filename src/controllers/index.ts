import AuthorsController from "./AuthorsController";
import PostsController from "./PostsController";
import * as models from "../models";

export const authorsController = new AuthorsController(models.AuthorModel);
export const postsController = new PostsController(models.PostModel);
