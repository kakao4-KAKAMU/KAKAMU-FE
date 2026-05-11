declare module "@expo/next-adapter" {
  import type { NextConfig } from "next";
  export function withExpo(config: NextConfig): NextConfig;
}
