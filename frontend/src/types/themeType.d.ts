/* eslint-disable @typescript-eslint/no-unused-vars */
import { MantineThemeOther } from "@mantine/core";
type ColorGroup = {
  background: string;
  foreground: string;
};
type ColorType =
  | "main"
  | "card"
  | "primary"
  | "primaryDark"
  | "secondary"
  | "accent";
declare module "@mantine/core" {
  export interface MantineThemeOther {
    radius: {
      primary: string;
    };
    colors: Record<ColorType, ColorGroup>;
  }
}
