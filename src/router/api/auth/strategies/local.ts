import { Strategy as LocalStrategy, IVerifyOptions } from "passport-local";
import { AuthorModel } from "../../../../models";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DoneFunction = (error: any, user?: any, options?: IVerifyOptions) => void;

export default new LocalStrategy(
	async (name: string, password: string, done: DoneFunction): Promise<void> => {
		try {
			const user = await AuthorModel.findOne({ name: name });

			if (!user) {
				return done(null, false, { message: "Incorrect username." });
			}

			if (user.password !== password) {
				return done(null, false, { message: "Incorrect password." });
			}

			return done(null, user);
		} catch (e) {
			done(e);
		}
	}
);
