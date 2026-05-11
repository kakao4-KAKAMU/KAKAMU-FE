import { createContext } from "react";

export type ThemeVariables = Record<`--${string}`, string>

export const ColorContext = createContext<ThemeVariables>({});