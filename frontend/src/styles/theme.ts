import { MantineThemeOverride } from "@mantine/core";

const globalTheme: MantineThemeOverride = {
  fontFamily: "Rubik",
  fontFamilyMonospace: "Disket Mono, Quicksand, monospace",
  headings: {
    fontFamily: "Montserrat",
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
        // f1f1f1
        background: "#f3f3f3",
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

const themeComponents: MantineThemeOverride = {
  components: {
    Button: {
      variants: {
        danger: (t) => ({
          root: {
            backgroundColor: t.colors.red[8],
            color: t.white,
            ...t.fn.hover({ backgroundColor: t.colors.red[7] }),
          },
        }),

        success: (t) => ({
          root: {
            backgroundColor: t.colors.green[7],
            color: t.white,
            ...t.fn.hover({ backgroundColor: t.colors.green[8] }),
          },
        }),
      },
      styles: (t, __, { variant }) => ({
        root: {
          backgroundColor:
            variant === "filled"
              ? t.other?.colors.primary.background
              : undefined,
        },
        label: {
          fontWeight: 500,
        },
      }),
    },
    ActionIcon: {
      variants: {
        danger: (t) => ({
          root: {
            backgroundColor: t.colors.red[8],
            color: t.white,
            ...t.fn.hover({ backgroundColor: t.colors.red[7] }),
          },
        }),
      },
    },
    Input: {
      styles: () => ({
        input: {
          fontWeight: 500,
        },
      }),
    },
    NumberInput: {
      defaultProps: {
        type: "number",
      },
    },
    Select: {
      defaultProps: {
        dropdownComponent: "div",
        clearable: true,
        allowDeselect: true,
        searchable: true,
      },
      styles: (t) => ({
        item: {
          "&[data-hovered]": {
            background: t.other.colors.secondary.background,
          },
        },
        separatorLabel: {
          color: t.black,
          fontWeight: "bold",
        },
        dropdown: {
          border: "1px solid",
        },
      }),
    },
    MultiSelect: {
      defaultProps: {
        dropdownComponent: "div",
      },
      styles: (t) => ({
        item: {
          "&[data-hovered]": {
            background: t.other.colors.secondary.background,
          },
        },
        separatorLabel: {
          color: t.black,
          fontWeight: "bold",
        },
        dropdown: {
          border: "1px solid",
        },
      }),
    },
    TabsList: {
      defaultProps: {
        grow: true,
      },
    },
    Tabs: {
      defaultProps: {
        variant: "pills",
      },
      styles: (t) => ({
        tab: {
          ...t.fn.focusStyles(),
          backgroundColor: t.other.colors.main.background,
          color: t.colors.gray[9],
          border: `1px solid ${t.colors.dark[6]}`,
          padding: `${t.spacing.xs} ${t.spacing.md}`,
          cursor: "pointer",
          fontSize: t.fontSizes.sm,
          display: "flex",
          alignItems: "center",
          borderRadius: t.radius.md,

          "&:disabled": {
            opacity: 0.5,
            cursor: "not-allowed",
          },

          // "&:first-of-type": {
          //   borderTopLeftRadius: theme.radius.md,
          //   borderBottomLeftRadius: theme.radius.md,
          // },

          // "&:last-of-type": {
          //   borderTopRightRadius: theme.radius.md,
          //   borderBottomRightRadius: theme.radius.md,
          // },

          "&[data-active]": {
            // backgroundColor: theme.colors.blue[7],
            backgroundColor: t.other.colors.primary.background,
            borderColor: t.colors.blue[7],
            color: t.white,
          },
        },

        tabIcon: {
          marginRight: t.spacing.xs,
          display: "flex",
          alignItems: "center",
        },

        tabsList: {
          paddingTop: t.spacing.xs,
          paddingBottom: t.spacing.xs,
        },
      }),
    },
  },
} as const;

export const theme = Object.assign(globalTheme, themeComponents);
