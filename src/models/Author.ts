import { prop, Typegoose } from "typegoose";

export default class Author extends Typegoose {
	@prop({ required: true, unique: true })
	public name?: string;

	@prop({ required: true })
	public password?: string;
}
