import type { NextConfig } from "next";
import { withExpo } from "@expo/next-adapter";

const nextConfig: NextConfig = {
  turbopack: {},
  transpilePackages: [
    "react-native",
    "react-native-web",
    "expo",
    "@kakamu/api",
    "@kakamu/i18n",
    "@kakamu/query",
    "@kakamu/schema",
    "@kakamu/store",
    "@kakamu/types",
    "@kakamu/ui",
  ],
  /* config options here */
};

export default withExpo(nextConfig);
