// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import { rest } from "msw";
import { setupServer } from "msw/node";
import "@testing-library/jest-dom";

const server = setupServer(
	rest.post("https://tangoland-api.herokuapp.com/add", (req, res, ctx) => {
		const { expression } = req.body;

		if (expression === "error") {
			return res(ctx.json({ status: "failed", message: "failed" }));
		}

		return res(ctx.json({ status: "success", message: "123456" }));
	})
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
