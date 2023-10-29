import ScrollWrapper2 from "@/components/scrollWrapper/ScrollWrapper2";
import { ScrollWrapper } from "@/components/scroller";
import { CompWithChildren } from "@/types/defaultTypes";
import { Box, ScrollArea } from "@mantine/core";
const state = false;
export const ContentWrapper: CompWithChildren = ({ children }) => {
  if (state) {
    return (
      <Box
        className="contentWrapper"
        p={"xs"}
        sx={{ position: "relative", flex: 1, display: "hidden" }}
      >
        <Box sx={{ position: "relative", flex: 1 }}>
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              overflow: "hidden",
            }}
          >
            <ScrollArea
              offsetScrollbars
              type="auto"
              h={"100%"}
              styles={(theme) => ({
                viewport: {
                  display: "flex",
                  "& > div": {
                    height: "100%",
                    maxWidth: "100px",
                    position: "relative",
                    display: "block",
                  },
                },

                scrollbar: {
                  "&, &:hover": {
                    background: theme.fn.lighten(theme.colors.gray[6], 0.7),
                  },

                  '&[data-orientation="vertical"] .mantine-ScrollArea-thumb': {
                    backgroundColor: theme.colors.blue[6],
                  },

                  '&[data-orientation="horizontal"] .mantine-ScrollArea-thumb':
                    {
                      backgroundColor: theme.colors.blue[6],
                    },
                },

                corner: {
                  opacity: 1,
                  background:
                    theme.colorScheme === "dark"
                      ? theme.colors.dark[6]
                      : theme.colors.gray[0],
                },
              })}
              sx={(t) => ({
                // display: "flex",
                borderRadius: t.other.radius.primary,
                flex: 1,
              })}
            >
              <Box
                maw={"100%"}
                w={"100%"}
                sx={{ position: "absolute", inset: 0 }}
              >
                {children}
              </Box>
            </ScrollArea>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={(t) => ({ flex: 1, paddingLeft: t.spacing.xs })}>
      {/* <Box sx={{ flex: 1, position: "relative" }}>{children}</Box> */}
      <ScrollWrapper2>{children}</ScrollWrapper2>
    </Box>
  );
};
