import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("App", () => {
	test("renders App component", () => {
		render(<App />);

		expect(screen.getByRole("heading")).toBeInTheDocument();
		expect(screen.getByLabelText(/expression/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/kana/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/romaji/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/meaning/i)).toBeInTheDocument();
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

	test("renders alert after submit", async () => {
		render(<App />);
		expect(screen.queryByRole("alert")).toBeNull();
		expect(await screen.findByRole("alert")).toBeInTheDocument();
	});
});
