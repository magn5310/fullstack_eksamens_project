import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CreateRestaurantForm } from "@/components/CreateRestaurantForm";

// Mock fetch globally
global.fetch = jest.fn();

describe("CreateRestaurantForm", () => {
  it("calls onSuccess when form submits successfully", async () => {
    const mockOnSuccess = jest.fn();

    // Mock fetch response
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        restaurant: { name: "My Kebab Place" },
      }),
    });

    render(<CreateRestaurantForm onSuccess={mockOnSuccess} />);

    fireEvent.change(screen.getByPlaceholderText("Restaurants name"), {
      target: { value: "My Kebab Place" },
    });
    fireEvent.change(screen.getByPlaceholderText("e.g. Torvet 1"), {
      target: { value: "Torvet 1" },
    });
    fireEvent.change(screen.getByPlaceholderText("1208"), {
      target: { value: "1208" },
    });
    fireEvent.change(screen.getByPlaceholderText("København K"), {
      target: { value: "Copenhagen" },
    });
    fireEvent.change(screen.getByPlaceholderText("Descripe"), {
      target: { value: "Great kebab spot" },
    });
    fireEvent.change(screen.getByPlaceholderText("12345678"), {
      target: { value: "12345678" },
    });
    fireEvent.change(screen.getByPlaceholderText("example.com"), {
      target: { value: "https://example.com" },
    });

    // Selects
    fireEvent.change(screen.getByLabelText("Opening Hour"), {
      target: { value: "10" },
    });
    fireEvent.change(screen.getByLabelText("Opening Minute"), {
      target: { value: "0" },
    });
    fireEvent.change(screen.getByLabelText("Closing Hour"), {
      target: { value: "22" },
    });
    fireEvent.change(screen.getByLabelText("Closing Minute"), {
      target: { value: "0" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create restaurant/i }));



    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith(
        expect.objectContaining({ name: "My Kebab Place" })
      );
    });

    
  });
});
