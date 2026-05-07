import { useUnstableNativeVariable } from "nativewind" 
import { useClientOnlyValue } from "./useClientOnlyValue";
import { Platform } from 'react-native';
import Color from 'color'

export const useColors = () => {
  const isClient = useClientOnlyValue(false, true);
  let cssMethod = null;
  if(!isClient) {
    cssMethod = () => "#ffffff"
  } else if(Platform.OS === "web") {
    const css = getComputedStyle(document.documentElement);
    cssMethod = (name: string) => {
      const [l, a, b] = css.getPropertyValue(name).split('lab(')[1].split(')')[0].split(' ')
        return Color({l: l.replace('%', ''), a, b}).hex()
    };
  } else {
    cssMethod = useUnstableNativeVariable;
  }

  return {
    background: cssMethod("--background"),
    foreground: cssMethod("--foreground"),
    card: cssMethod("--card"),
    cardForeground: cssMethod("--card-foreground"),
    popover: cssMethod("--popover"),
    popoverForeground: cssMethod("--popover-foreground"),
    primary: cssMethod("--primary"),
    primaryForeground: cssMethod("--primary-foreground"),
    secondary: cssMethod("--secondary"),
    secondaryForeground: cssMethod("--secondary-foreground"),
    muted: cssMethod("--muted"),
    mutedForeground: cssMethod("--muted-foreground"),
    accent: cssMethod("--accent"),
    accentForeground: cssMethod("--accent-foreground"),
    destructive: cssMethod("--destructive"),
    border: cssMethod("--border"),
    input: cssMethod("--input"),
    ring: cssMethod("--ring"),
    chart1: cssMethod("--chart-1"),
    chart2: cssMethod("--chart-2"),
    chart3: cssMethod("--chart-3"),
    chart4: cssMethod("--chart-4"),
    chart5: cssMethod("--chart-5"),
    sidebar: cssMethod("--sidebar"),
    sidebarForeground: cssMethod("--sidebar-foreground"),
    sidebarPrimary: cssMethod("--sidebar-primary"),
    sidebarPrimaryForeground: cssMethod("--sidebar-primary-foreground"),
    sidebarAccent: cssMethod("--sidebar-accent"),
    sidebarAccentForeground: cssMethod("--sidebar-accent-foreground"),
    sidebarBorder: cssMethod("--sidebar-border"),
    sidebarRing: cssMethod("--sidebar-ring"),
  }
}