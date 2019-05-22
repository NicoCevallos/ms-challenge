import mongoose from "mongoose";
import Author from "./Author";
import Post from "./Post";

mongoose.connect("mongodb://localhost/test", {
	useCreateIndex: true,
	useNewUrlParser: true,
	useFindAndModify: false,
});

export const AuthorModel = new Author().getModelForClass(Author);
export const PostModel = new Post().getModelForClass(Post);
