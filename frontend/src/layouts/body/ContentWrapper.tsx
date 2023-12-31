import { ScrollWrapper } from "@/components/scroller";
import { CompWithChildren } from "@/types/defaultTypes";
import { Box, ScrollArea } from "@mantine/core";

export const ContentWrapper: CompWithChildren = ({ children }) => {
  // calc(100vh - var(--mantine-header-height, 0rem) - var(--mantine-footer-height, 0rem));
  return (
    <ScrollWrapper>
      <Box
        p={"xs"}
        sx={() => ({
          position: "relative",
          height: "100%",
          display: "flex",
          overflow: "hidden",
        })}
      >
        <ScrollArea
          styles={{
            viewport: {
              display: "flex",
              "& > div": {
                height: "100%",
                position: "relative",
              },
            },
          }}
          sx={(t) => ({
            // display: "flex",
            borderRadius: t.other.radius.primary,
            flex: 1,
          })}
        >
          {children}
        </ScrollArea>
      </Box>
    </ScrollWrapper>
  );
};
