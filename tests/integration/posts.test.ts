import test from "ava";
import request, { Response } from "supertest";
import httpStatus from "http-status";
import app from "../../src/app";

const tick = Date.now();
const USER_NAME = `username_${tick}`;
const USER_PWD = `password_${tick}`;
const POST_TITLE = `title_${tick}`;
const POST_BODY = `body_${tick}`;
const POST_STATUS = `draft`;
const UPDATED_POST_TITLE = `Cowabunga!`;
const UPDATED_POST_STATUS = `public`;

test("Post endpoint", async (t): Promise<void> => {
	//Create a new author/user
	const createUserResponse = await request(app)
		.post(`/api/authors`)
		.set("Content-Type", "application/json")
		.send({ name: USER_NAME, password: USER_PWD })
		.expect(httpStatus.OK)
		.expect("Content-Type", /json/)
		.expect(
			(res: Response): void => {
				const author = res.body;

				t.not(author, undefined);
				t.is(author.name, USER_NAME);
				t.is(author.password, USER_PWD);
				t.not(author._id, undefined);
			}
		);

	//Pick User/Author ID
	const authorId = createUserResponse.body._id;

	//Log in with the user we created
	const loginResponse = await request(app)
		.post(`/api/auth/login`)
		.set("Content-Type", "application/x-www-form-urlencoded")
		.send(`username=${USER_NAME}&password=${USER_PWD}`)
		.expect(httpStatus.FOUND)
		.expect("location", "/api/auth/me")
		.expect(
			(res: Response): void => {
				t.not(res.header["set-cookie"], undefined);
			}
		);

	//Pick Login Cookie
	const loginCookie = loginResponse.header["set-cookie"];

	//Check the new user doesn't have any post yet
	await request(app)
		.get(`/api/posts`)
		.set("Cookie", loginCookie)
		.expect(httpStatus.OK)
		.expect("Content-Type", /json/)
		.expect(
			(res: Response): void => {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				t.is((res.body as any[]).length, 0);
			}
		);

	//Check we can create a new post
	const createPostResponse = await request(app)
		.post(`/api/posts`)
		.set("Content-Type", "application/json")
		.set("Cookie", loginCookie)
		.send({ title: POST_TITLE, body: POST_BODY, status: POST_STATUS })
		.expect(httpStatus.OK)
		.expect("Content-Type", /json/)
		.expect(
			(res: Response): void => {
				const post = res.body;

				t.not(post, undefined);
				t.is(post.title, POST_TITLE);
				t.is(post.body, POST_BODY);
				t.is(post.status, POST_STATUS);
				t.is(post.author, authorId);
				t.not(post._id, undefined);
			}
		);

	//Pick Post ID
	const postId = createPostResponse.body._id;

	//Check the new user only has 1 post
	await request(app)
		.get(`/api/posts`)
		.set("Cookie", loginCookie)
		.expect(httpStatus.OK)
		.expect("Content-Type", /json/)
		.expect(
			(res: Response): void => {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				t.is((res.body as any[]).length, 1);
			}
		);

	//Check we can get the author's post by id
	await request(app)
		.get(`/api/posts/${postId}`)
		.set("Cookie", loginCookie)
		.expect(httpStatus.OK)
		.expect("Content-Type", /json/)
		.expect(
			(res: Response): void => {
				const post = res.body;

				t.not(post, undefined);
				t.is(post.title, POST_TITLE);
				t.is(post.body, POST_BODY);
				t.is(post.status, POST_STATUS);
				t.is(post.author, authorId);
				t.is(post._id, postId);
			}
		);

	//Check we can update the author's post by id
	await request(app)
		.put(`/api/posts/${postId}`)
		.set("Cookie", loginCookie)
		.send({ title: UPDATED_POST_TITLE, status: UPDATED_POST_STATUS })
		.expect(httpStatus.OK)
		.expect("Content-Type", /json/)
		.expect(
			(res: Response): void => {
				const post = res.body;

				t.not(post, undefined);
				t.is(post.title, UPDATED_POST_TITLE);
				t.is(post.body, POST_BODY);
				t.is(post.status, UPDATED_POST_STATUS);
				t.is(post.author, authorId);
				t.is(post._id, postId);
			}
		);

	//Check we can delete the author's post by id
	await request(app)
		.delete(`/api/posts/${postId}`)
		.set("Cookie", loginCookie)
		.expect(httpStatus.OK);

	//Check the author's post we updated does not exists when get by Id
	await request(app)
		.get(`/api/posts/${postId}`)
		.set("Cookie", loginCookie)
		.expect(httpStatus.NOT_FOUND);

	//Check we cannot update the author's post we deleted
	await request(app)
		.put(`/api/posts/${postId}`)
		.set("Cookie", loginCookie)
		.set("Content-Type", "application/json")
		.send({ title: UPDATED_POST_TITLE, status: UPDATED_POST_STATUS })
		.expect(httpStatus.NOT_FOUND);

	//Check we cannot delete the author's post we deleted
	await request(app)
		.delete(`/api/posts/${postId}`)
		.set("Cookie", loginCookie)
		.expect(httpStatus.NOT_FOUND);

	t.pass("everything is fine");
});
