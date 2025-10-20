import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

function Demo() {
  return <h1 data-testid="greet">Hello Tarun 🎯</h1>;
}

test("renders greeting text", () => {
  render(<Demo />);
  expect(screen.getByTestId("greet")).toHaveTextContent("Hello Tarun");
});
