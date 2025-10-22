// 🧠 Must define mocks BEFORE imports
const mockUser = { _id: "test-user-id", name: "Tarun Test" };

// ✅ Mock localStorage globally for all components
Object.defineProperty(window, "localStorage", {
  value: {
    getItem: jest.fn((key) => {
      if (key === "user") return JSON.stringify(mockUser);
      return null;
    }),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true,
});

// ✅ Mock fetch globally to prevent real API calls
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([]),
  })
);
// ✅ Fix for "window.alert not implemented"
global.alert = jest.fn();
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
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
  });

  
  test("renders Register page when navigated to /register", () => {
    window.history.pushState({}, "Register page", "/register");
    render(<App />);
    expect(
      screen.getByRole("heading", { name: /create account/i })
    ).toBeInTheDocument();
  });


  test("renders Doctors page when navigated to /doctors", () => {
    window.history.pushState({}, "Doctors page", "/doctors");
    render(<App />);
    expect(screen.getByText(/Available Doctors/i)).toBeInTheDocument();
  });

  
  test("renders Add Doctor page when navigated to /adddoctor", () => {
    window.history.pushState({}, "Add Doctor page", "/adddoctor");
    render(<App />);
    // there are multiple "Add Doctor" texts, get the first one
    expect(screen.getAllByText(/Add Doctor/i)[0]).toBeInTheDocument();
  });

  
  test("renders Booking Confirmation page when navigated to /bookingconfirmation", () => {
    window.history.pushState({}, "Booking Confirmation", "/bookingconfirmation");
    render(<App />);
    expect(screen.getByText(/Appointment Confirmed/i)).toBeInTheDocument();
  });


  test("renders Appointments page when navigated to /appointments", () => {
    window.history.pushState({}, "Appointments page", "/appointments");
    render(<App />);
    expect(screen.getByText(/My Appointments/i)).toBeInTheDocument();
  });

  
  test("renders Dashboard page when navigated to /user-dashboard", () => {
    window.history.pushState({}, "Dashboard page", "/user-dashboard");
    render(<App />);
    expect(screen.getAllByText(/Welcome/i)[0]).toBeInTheDocument();
  });
});
