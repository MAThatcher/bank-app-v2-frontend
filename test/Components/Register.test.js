import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import Register from "../../src/Components/Register";

jest.mock("../../src//Misc/ApiBaseUrl", () => ({
  getBaseUrl: jest.fn(() => "http://mockapi.com"),
}));

jest.mock("axios");

describe("Register Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders all form fields and buttons", () => {
    render(<Register />);

    expect(screen.getByText("Register")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Register/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Back/i })).toBeInTheDocument();
  });

  test("displays error messages for empty fields on submission", () => {
    render(<Register />);

    fireEvent.click(screen.getByRole("button", { name: /Register/i }));

    expect(screen.getByText("Email is required")).toBeInTheDocument();
    expect(screen.getByText("Password is required")).toBeInTheDocument();
  });

  test("displays error for invalid email", () => {
    render(<Register />);

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "invalid-email" } });
    fireEvent.click(screen.getByRole("button", { name: /Register/i }));

    expect(screen.getByText("Email address is invalid")).toBeInTheDocument();
  });

  test("displays error for mismatched passwords", () => {
    render(<Register />);

    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText("Confirm Password"), { target: { value: "password456" } });
    fireEvent.click(screen.getByRole("button", { name: /Register/i }));

    expect(screen.getByText("Password must match")).toBeInTheDocument();
  });

  test("submits the form successfully when inputs are valid", async () => {
    axios.post.mockResolvedValueOnce({ data: { message: "Registration successful!" } });

    render(<Register />);

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText("Confirm Password"), { target: { value: "password123" } });

    fireEvent.click(screen.getByRole("button", { name: /Register/i }));

    await waitFor(() => {
      expect(screen.getByText("Registration successful!")).toBeInTheDocument();
    });

    expect(axios.post).toHaveBeenCalledWith(
      "http://mockapi.com/api/users/register",
      { email: "test@example.com", password: "password123" }
    );
  });

  test("does not call API when inputs are invalid", () => {
    render(<Register />);

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: /Register/i }));

    expect(axios.post).not.toHaveBeenCalled();
  });
});
