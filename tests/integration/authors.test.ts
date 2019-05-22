import test from "ava";
import request, { Response } from "supertest";
import httpStatus from "http-status";
import app from "../../src/app";

const tick = Date.now();
const USER_NAME = `username_${tick}`;
const USER_PWD = `password_${tick}`;
const UPDATED_USER_NAME = `${USER_NAME}_test`;
const UPDATED_USER_PWD = `${USER_PWD}_test`;

test("Author endpoint and login", async (t): Promise<void> => {
	//Check we are logged out
	await request(app)
		.get(`/api/auth/me`)
		.expect(httpStatus.NOT_FOUND);

	//Check the user we want to create doesn't exists
	await request(app)
		.get(`/api/authors`)
		.expect(httpStatus.OK)
		.expect("Content-Type", /json/)
		.expect(
			(res: Response): void => {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const author = (res.body as any[]).find(
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					(e: any): boolean => e.name === USER_NAME
				);

				t.is(author, undefined);
			}
		);

	//Check we can create a new author/user
	const createResponse = await request(app)
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
	const userId = createResponse.body._id;

	//Check we cannot create a new author/user with the same name
	await request(app)
		.post(`/api/authors`)
		.set("Content-Type", "application/json")
		.send({ name: USER_NAME, password: "asdfasd" })
		.expect(httpStatus.BAD_REQUEST);

	//Check the user we created exists when get all
	await request(app)
		.get(`/api/authors`)
		.expect(httpStatus.OK)
		.expect("Content-Type", /json/)
		.expect(
			(res: Response): void => {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const author = (res.body as any[]).find(
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					(e: any): boolean => e.name === USER_NAME
				);

				t.not(author, undefined);
				t.is(author.name, USER_NAME);
				t.is(author.password, USER_PWD);
				t.is(author._id, userId);
			}
		);

	//Check the user we created exists when get by Id
	await request(app)
		.get(`/api/authors/${userId}`)
		.expect(httpStatus.OK)
		.expect("Content-Type", /json/)
		.expect(
			(res: Response): void => {
				const author = res.body;

				t.not(author, undefined);
				t.is(author.name, USER_NAME);
				t.is(author.password, USER_PWD);
				t.is(author._id, userId);
			}
		);

	//Check we can update the user we created
	await request(app)
		.put(`/api/authors/${userId}`)
		.set("Content-Type", "application/json")
		.send({ name: UPDATED_USER_NAME, password: UPDATED_USER_PWD })
		.expect(httpStatus.OK)
		.expect("Content-Type", /json/)
		.expect(
			(res: Response): void => {
				const author = res.body;

				t.not(author, undefined);
				t.is(author.name, UPDATED_USER_NAME);
				t.is(author.password, UPDATED_USER_PWD);
				t.is(author._id, userId);
			}
		);

	//Check the user we updated exists when get all
	await request(app)
		.get(`/api/authors`)
		.expect(httpStatus.OK)
		.expect("Content-Type", /json/)
		.expect(
			(res: Response): void => {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const author = (res.body as any[]).find(
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					(e: any): boolean => e.name === UPDATED_USER_NAME
				);

				t.not(author, undefined);
				t.is(author.name, UPDATED_USER_NAME);
				t.is(author.password, UPDATED_USER_PWD);
				t.is(author._id, userId);
			}
		);

	//Check the user we updated exists when get by Id
	await request(app)
		.get(`/api/authors/${userId}`)
		.expect(httpStatus.OK)
		.expect("Content-Type", /json/)
		.expect(
			(res: Response): void => {
				const author = res.body;

				t.not(author, undefined);
				t.is(author.name, UPDATED_USER_NAME);
				t.is(author.password, UPDATED_USER_PWD);
				t.is(author._id, userId);
			}
		);

	//Check we can log in with the user we created and updated
	const loginResponse = await request(app)
		.post(`/api/auth/login`)
		.set("Content-Type", "application/x-www-form-urlencoded")
		.send(`username=${UPDATED_USER_NAME}&password=${UPDATED_USER_PWD}`)
		.expect(httpStatus.FOUND)
		.expect("location", "/api/auth/me")
		.expect(
			(res: Response): void => {
				t.not(res.header["set-cookie"], undefined);
			}
		);

	//Pick Login Cookie
	const loginCookie = loginResponse.header["set-cookie"];

	//Check we are logged in
	await request(app)
		.get(`/api/auth/me`)
		.set("Cookie", loginCookie)
		.expect(httpStatus.OK)
		.expect("Content-Type", /json/)
		.expect(
			(res: Response): void => {
				const author = res.body;

				t.not(author, undefined);
				t.is(author.name, UPDATED_USER_NAME);
				t.is(author.password, UPDATED_USER_PWD);
				t.is(author._id, userId);
			}
		);

	//Check we can log out
	await request(app)
		.post(`/api/auth/logout`)
		.set("Cookie", loginCookie)
		.expect(httpStatus.OK);

	//Check we are logged out, so Cookie doesn't work
	await request(app)
		.get(`/api/auth/me`)
		.set("Cookie", loginCookie)
		.expect(httpStatus.NOT_FOUND);

	//Check we can delete the user we created and updated can be deleted
	await request(app)
		.delete(`/api/authors/${userId}`)
		.expect(httpStatus.OK);

	//Check the user we deleted does not exists when get all
	await request(app)
		.get(`/api/authors`)
		.expect(httpStatus.OK)
		.expect("Content-Type", /json/)
		.expect(
			(res: Response): void => {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const author = (res.body as any[]).find(
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					(e: any): boolean => e.name === UPDATED_USER_NAME
				);

				t.is(author, undefined);
			}
		);

	//Check the user we updated does not exists when get by Id
	await request(app)
		.get(`/api/authors/${userId}`)
		.expect(httpStatus.NOT_FOUND);

	//Check we cannot update the user we deleted
	await request(app)
		.put(`/api/authors/${userId}`)
		.set("Content-Type", "application/json")
		.send({ name: UPDATED_USER_NAME, password: UPDATED_USER_PWD })
		.expect(httpStatus.NOT_FOUND);

	//Check we cannot delete the user we deleted
	await request(app)
		.delete(`/api/authors/${userId}`)
		.expect(httpStatus.NOT_FOUND);

	//Check we cannot login with the user we deleted
	await request(app)
		.post(`/api/auth/login`)
		.set("Content-Type", "application/x-www-form-urlencoded")
		.send(`username=${UPDATED_USER_NAME}&password=${UPDATED_USER_PWD}`)
		.expect(httpStatus.FOUND)
		.expect("location", "/api/auth/me")
		.expect(
			(res: Response): void => {
				t.is(res.header["set-cookie"], undefined);
			}
		);

	t.pass("everything is fine");
});
