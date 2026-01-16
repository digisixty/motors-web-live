"use client";
import { createContext } from "react";

export interface SlideContextType {
  isActive: boolean;
  slideIndex: number;
}

export const SlideContext = createContext<SlideContextType>({
  isActive: false,
  slideIndex: 0,
});
