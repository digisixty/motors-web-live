"use client";

import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { parseColorValue } from "@/lib/colorUtils";

interface ColorInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  placeholder?: string;
}

export function ColorInput({
  value,
  onChange,
  label,
  description,
  disabled = false,
  placeholder = "Color name (e.g., Violent Red)",
}: ColorInputProps) {
  const colorPairs = parseColorValue(value);

  const handleColorChange = (
    index: number,
    field: "hex" | "text",
    newValue: string
  ) => {
    const updatedPairs = [...colorPairs];
    if (!updatedPairs[index]) {
      updatedPairs[index] = { hex: "", text: "" };
    }
    updatedPairs[index][field] = newValue;

    // Convert back to string format: hex,text;hex,text
    const result = updatedPairs
      .filter((pair) => pair.hex || pair.text)
      .map((pair) => `${pair.hex},${pair.text}`)
      .join(";");

    onChange(result);
  };

  const handleTextInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent typing comma or semicolon
    if (e.key === "," || e.key === ";" || e.key === "#") {
      e.preventDefault();
    }
  };

  const handleAddRow = () => {
    const updatedPairs = [...colorPairs, { hex: "#000000", text: "" }];
    const result = updatedPairs
      .map((pair) => `${pair.hex},${pair.text}`)
      .join(";");
    onChange(result);
  };

  const handleRemoveRow = (index: number) => {
    if (colorPairs.length <= 1) return; // Keep at least one row
    const updatedPairs = colorPairs.filter((_, i) => i !== index);
    const result = updatedPairs
      .map((pair) => `${pair.hex},${pair.text}`)
      .join(";");
    onChange(result);
  };

  // Always ensure we have at least 1 color row
  const displayPairs =
    colorPairs.length >= 1 ? colorPairs : [{ hex: "", text: "" }];

  return (
    <FormItem>
      {label && (
        <FormLabel className="text-sm font-medium">
          {label}
          {description && (
            <span className="text-muted-foreground font-normal ml-2">
              {description}
            </span>
          )}
        </FormLabel>
      )}
      <div className="flex flex-col gap-1">
        {displayPairs.map((pair, index) => (
          <div key={index} className="flex gap-2 items-center">
            <FormControl>
              <div className="flex items-center justify-center">
                <Input
                  type="color"
                  className="w-16 h-9 pr-0! py-0.5 pl-1 border-r-0 rounded-r-none"
                  value={pair.hex || "#000000"}
                  onChange={(e) =>
                    handleColorChange(index, "hex", e.target.value)
                  }
                  disabled={disabled}
                />

                <Input
                  type="text"
                  placeholder={placeholder}
                  value={pair.text}
                  className="border-l-0 rounded-l-none"
                  onChange={(e) =>
                    handleColorChange(index, "text", e.target.value)
                  }
                  onKeyDown={handleTextInputKeyDown}
                  disabled={disabled}
                />
              </div>
            </FormControl>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveRow(index)}
              disabled={disabled || displayPairs.length <= 1}
              className="size-8"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddRow}
          disabled={disabled}
          className="w-fit"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Color
        </Button>
      </div>
      <FormMessage />
    </FormItem>
  );
}

export default ColorInput;
