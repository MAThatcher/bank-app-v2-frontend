import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import App from "../src/App";
jest.mock('axios');


jest.mock("../src/Components/LoginPage", () => () => <div>Login Page</div>);
jest.mock("../src/Components/Register", () => () => <div>Register Page</div>);
jest.mock("../src/Components/ForgotPassword", () => () => <div>Forgot Password Page</div>);
jest.mock("../src/Components/Dashboard", () => () => <div>Dashboard Page</div>);

describe("App Routing", () => {
  it("should render the Login Page by default", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("should render the Register Page when the path is '/Register'", () => {
    render(
      <MemoryRouter initialEntries={["/Register"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("Register Page")).toBeInTheDocument();
  });

  it("should render the Forgot Password Page when the path is '/ForgotPassword'", () => {
    render(
      <MemoryRouter initialEntries={["/ForgotPassword"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("Forgot Password Page")).toBeInTheDocument();
  });

  it("should render the Dashboard Page when the path is '/Dashboard'", () => {
    render(
      <MemoryRouter initialEntries={["/Dashboard"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("Dashboard Page")).toBeInTheDocument();
  });
});
