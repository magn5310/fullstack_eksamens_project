import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import UpdateProfile from "@/components/updateProfile";

// Mock useRouter from next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

test("renders the UpdateProfile form", () => {
  render(<UpdateProfile />);
  
  // Assert the formlabel is rendered
  expect(screen.getByRole("heading", { name: "Update Profile" })).toBeInTheDocument();

  // Assert the submit button is rendered
  expect(screen.getByRole("button", { name: "Update Profile" })).toBeInTheDocument();

  // Assert a form field is present
  expect(screen.getByPlaceholderText("Enter your first name")).toBeInTheDocument();
});
