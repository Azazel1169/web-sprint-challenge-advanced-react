// Write your tests here
import React from "react"; // React is necessary for rendering components
import { render, fireEvent, waitFor } from "@testing-library/react"; // Functions to render components and simulate events
import "@testing-library/jest-dom/extend-expect"; // Extends Jest to include DOM-specific matchers like `toBeInTheDocument`
import AppFunctional from "./AppFunctional"; // Import the component you're testing
test("sanity", () => {
  expect(true).toBe(true);
});

test("renders initial state correctly", () => {
  const { getByText, getByPlaceholderText } = render(<AppFunctional />);

  expect(getByText(/coordinates \(2, 2\)/i)).toBeInTheDocument();
  expect(getByText(/you moved 0 times/i)).toBeInTheDocument();
  expect(getByPlaceholderText(/type email/i)).toHaveValue("");
});

test("moves left and updates state correctly", () => {
  const { getByText, getByRole } = render(<AppFunctional />);

  fireEvent.click(getByRole("button", { name: /left/i }));

  expect(getByText(/coordinates \(1, 2\)/i)).toBeInTheDocument();
  expect(getByText(/you moved 1 time/i)).toBeInTheDocument();
});

test("displays error message when trying to move up from the top row", async () => {
  const { getByText, getByRole } = render(<AppFunctional />);

  fireEvent.click(getByRole("button", { name: /up/i }));

  // Wait for the error message to appear
  await waitFor(() => {
    expect(getByText(/you can't go up/i)).toBeInTheDocument();
  });
});

test("resets the state correctly", () => {
  const { getByText, getByRole } = render(<AppFunctional />);

  fireEvent.click(getByRole("button", { name: /right/i }));
  fireEvent.click(getByRole("button", { name: /reset/i }));

  expect(getByText(/coordinates \(2, 2\)/i)).toBeInTheDocument();
  expect(getByText(/you moved 0 times/i)).toBeInTheDocument();
});

test("submits form and resets email field", async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ message: "Success!" }),
    })
  );

  const { getByText, getByPlaceholderText, getByRole } = render(
    <AppFunctional />
  );

  fireEvent.change(getByPlaceholderText(/type email/i), {
    target: { value: "test@example.com" },
  });
  fireEvent.click(getByRole("button", { name: /submit/i }));

  await waitFor(() => expect(getByText(/Success!/i)).toBeInTheDocument());
  expect(getByPlaceholderText(/type email/i)).toHaveValue("");
});
