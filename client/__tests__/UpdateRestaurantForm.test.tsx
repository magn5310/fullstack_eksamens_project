import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import EditRestaurantForm from "@/components/EditRestaurantForm";

// Mock useRouter from next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));



const mockRestaurant = {
    id: "1",
    name: "Test Restaurant",
    slug: "test-restaurant",
    description: "A test restaurant",
    createdAt: new Date().toISOString(),
    reviews: [],
};

test("renders the UpdateRestaurantForm", () => {
    render(<EditRestaurantForm restaurant={mockRestaurant} />);
    expect(screen.getByDisplayValue("Test Rastaurant")).toBeInTheDocument();   
})