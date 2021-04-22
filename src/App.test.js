import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("App", () => {
	test("renders App component", () => {
		render(<App />);

		expect(screen.getByRole("heading")).toBeInTheDocument();
		expect(screen.getAllByRole("textbox")).toHaveLength(4);
		expect(screen.getByLabelText(/expression/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/kana/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/romaji/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/meaning/i)).toBeInTheDocument();
		screen
			.getAllByRole("textbox")
			.forEach((textbox) => expect(textbox).toBeRequired());
		expect(screen.getByRole("button")).toBeInTheDocument();
	});

	test("typing in textbox", async () => {
		render(<App />);

		expect(screen.getByLabelText(/expression/i)).toHaveTextContent("");
		expect(screen.getByLabelText(/kana/i)).toHaveTextContent("");
		expect(screen.getByLabelText(/romaji/i)).toHaveTextContent("");
		expect(screen.getByLabelText(/meaning/i)).toHaveTextContent("");

		await userEvent.type(screen.getByLabelText(/expression/i), "test2.1");
		await userEvent.type(screen.getByLabelText(/kana/i), "test2.2");
		await userEvent.type(screen.getByLabelText(/romaji/i), "test2.3");
		await userEvent.type(screen.getByLabelText(/meaning/i), "test2.4");

		expect(screen.getByLabelText(/expression/i)).toHaveValue("test2.1");
		expect(screen.getByLabelText(/kana/i)).toHaveValue("test2.2");
		expect(screen.getByLabelText(/romaji/i)).toHaveValue("test2.3");
		expect(screen.getByLabelText(/meaning/i)).toHaveValue("test2.4");
	});

	test("submit no input fields", async () => {
		render(<App />);
		expect(screen.queryByRole("alert")).toBeNull();

		await userEvent.click(screen.getByRole("button"));
		await waitFor(() => screen.queryByRole("alert"));

		screen
			.getAllByRole("textbox")
			.forEach((textbox) => expect(textbox).toBeInvalid);
		expect(screen.queryByRole("alert")).toBeNull();
	});

	test("submit incomplete input fields", async () => {
		render(<App />);
		expect(screen.queryByRole("alert")).toBeNull();

		await userEvent.type(screen.getByLabelText(/kana/i), "test4.2");
		await userEvent.type(screen.getByLabelText(/romaji/i), "test4.3");
		await userEvent.click(screen.getByRole("button"));

		await waitFor(() => screen.queryByRole(alert));

		expect(screen.getByLabelText(/expression/i)).toBeInvalid();
		expect(screen.getByLabelText(/kana/i)).toBeValid();
		expect(screen.getByLabelText(/romaji/i)).toBeValid();
		expect(screen.getByLabelText(/meaning/i)).toBeInvalid();
		expect(screen.queryByRole("alert")).toBeNull();
	});

	test("success after submit", async () => {
		render(<App />);

		expect(screen.queryByRole("alert")).toBeNull();

		await userEvent.type(screen.getByLabelText(/expression/i), "test5.1");
		await userEvent.type(screen.getByLabelText(/kana/i), "test5.2");
		await userEvent.type(screen.getByLabelText(/romaji/i), "test5.3");
		await userEvent.type(screen.getByLabelText(/meaning/i), "test5.4");
		await userEvent.click(screen.getByRole("button"));

		screen
			.getAllByRole("textbox")
			.forEach((textbox) => expect(textbox).toBeValid);
		expect(await screen.findByRole("alert")).toBeInTheDocument();

		expect(await screen.findByRole("alert")).toHaveTextContent(/success/i);
	});

	test("error after submit", async () => {
		render(<App />);

		expect(screen.queryByRole("alert")).toBeNull();

		await userEvent.type(screen.getByLabelText(/expression/i), "error");
		await userEvent.type(screen.getByLabelText(/kana/i), "error");
		await userEvent.type(screen.getByLabelText(/romaji/i), "error");
		await userEvent.type(screen.getByLabelText(/meaning/i), "error");
		await userEvent.click(screen.getByRole("button"));

		screen
			.getAllByRole("textbox")
			.forEach((textbox) => expect(textbox).toBeValid);
		expect(await screen.findByRole("alert")).toBeInTheDocument();

		expect(await screen.findByRole("alert")).toHaveTextContent(/error/i);
	});
});
