import { prop, Typegoose, Ref } from "typegoose";
import Author from "./Author";

export default class Post extends Typegoose {
	@prop({ ref: Author, required: true })
	public author?: Ref<Author>;

	@prop({ required: true })
	public title?: string;

	@prop({ required: true })
	public body?: string;

	@prop({ required: true, enum: ["draft", "private", "public"] })
	public status?: string;
}
