import { useContext } from "react";
import { ColorContext } from "./ColorContext";

export const useColors = () => {
  const colors = useContext(ColorContext);
  if(!colors) {
    throw new Error('Colors not found');
  }
  return colors;
}