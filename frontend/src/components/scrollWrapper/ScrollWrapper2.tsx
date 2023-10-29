import { CompWithChildren } from "@/types/defaultTypes";
import { Box, ScrollArea } from "@mantine/core";

const ScrollWrapper2: React.FC<{
  children: React.ReactNode;
  withRadius?: boolean;
}> = ({ children, withRadius = true }) => {
  return (
    <Box sx={{ position: "relative", width: "100%", height: "100%", flex: 1 }}>
      <Box sx={{ position: "absolute", inset: 0 }}>
        <ScrollArea
          type="auto"
          offsetScrollbars
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

              '&[data-orientation="horizontal"] .mantine-ScrollArea-thumb': {
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
            borderRadius: withRadius ? t.other.radius.primary : "0",
            flex: 1,
          })}
        >
          {children}
        </ScrollArea>
      </Box>
    </Box>
  );
};

export default ScrollWrapper2;
