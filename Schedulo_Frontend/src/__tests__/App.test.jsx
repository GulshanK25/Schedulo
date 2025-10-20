import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App";

describe("App Component Routing", () => {
  test("renders MainPage by default at /", () => {
    render(<App />);
    expect(
      screen.getByText(/Book Your Doctor Appointment Today/i)
    ).toBeInTheDocument();
  });

  test("renders Login page when navigated to /login", () => {
    window.history.pushState({}, "Login page", "/login");
    render(<App />);
    expect(
      screen.getByRole("heading", { name: /login/i })
    ).toBeInTheDocument();
  });

  test("renders Register page when navigated to /register", () => {
    window.history.pushState({}, "Register page", "/register");
    render(<App />);
    // match actual heading
    expect(
      screen.getByRole("heading", { name: /create account/i })
    ).toBeInTheDocument();
  });
});
