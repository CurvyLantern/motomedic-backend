import { MantineThemeOverride } from "@mantine/core";

export const useTheme = ({
  colorScheme,
}: {
  colorScheme: "light" | "dark";
}) => {
  //   const isDark = colorScheme === "dark";

  /** import('@mantine/core').MantineThemeOverride */
  const globalTheme: MantineThemeOverride = {
    colorScheme,
    fontFamily: "MontSerrat",
    fontFamilyMonospace: "Disket Mono, Quicksand, monospace",
    headings: {
      fontFamily: "Quicksand",
      fontWeight: 600,
    },
    shadows: {
      card: "0 0 5px #22223b33",
    },
    other: {
      radius: {
        primary: "10px",
      },
      colors: {
        main: {
          background: "#f1f1f1",
          foreground: "#000",
        },
        card: {
          background: "#fefefe",
          foreground: "#22223b",
        },
        primary: {
          background: "#015190",
          foreground: "#ffffff",
        },
        primaryDark: {
          background: "#000024",
          foreground: "#ffffff",
        },
        secondary: {
          // background: "#457B9D",
          background: "#00bbf9",
          foreground: "#ffffff",
        },
        accent: {
          background: "#E63946",
          foreground: "#F1FAEE",
        },
      },
    },
    loader: "dots",
    defaultRadius: "primary",
    radius: {
      primary: ".3rem",
    },
    globalStyles: () => ({
      "*, *::before, *::after": {
        boxSizing: "border-box",
      },
      "html,body,#root": {
        height: "100%",
        minHeight: "100%",
        maxHeight: "100%",
      },
    }),
  } as const;

  return globalTheme;
};
