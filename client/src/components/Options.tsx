import React from "react";
import { Button } from "./ui/button";

function Options() {
  const options: string[] = ["Kebab", "Italian", "Chinese", "Indian", "Sushi", "Burgers", "Pizza", "Vegan", "Vegetarian", "Gluten free", "Halal"];

  const arrangeIntoRows = (items: string[]) => {
    return [
      items.slice(0, 3), // First 3 items for top row
      items.slice(3, 7), // Next 4 items for middle row
      items.slice(7, 10), // Last 3 items for bottom row
    ];
  };

  // Arrange food items into rows
  const foodRows = arrangeIntoRows(options);

  return (
    <section className="w-full max-w-fit mx-auto p-20 bg-[#f8f5f2] rounded-lg">
      {/* Container for all rows */}
      <div className="flex flex-col items-center gap-6">
        {/* Map through each row */}
        {foodRows.map((row, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className={`flex justify-center gap-4 w-full ${
              // Add curved alignment by adjusting width
              rowIndex === 1 ? "px-0" : "px-8"
            }`}
          >
            {/* Map through food buttons in this row */}
            {row.map((food, btnIndex) => (
              <Button key={`btn-${rowIndex}-${btnIndex}`} className="w-fit bg-[#078080] text-white" size="lg">
                {food}
              </Button>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Options;
