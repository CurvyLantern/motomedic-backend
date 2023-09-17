import { Box } from "@mantine/core";

export const ScrollWrapper: CompWithChildren = ({ children }) => {
  // calc(100vh - var(--mantine-header-height, 0rem) - var(--mantine-footer-height, 0rem));
  return (
    <Box
      sx={() => ({
        flex: 1,
        position: "relative",
        overflow: "hidden",
      })}>
      <Box
        sx={() => ({
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          // flex: 1,
          borderRadius: "10px",
        })}>
        {children}
      </Box>
    </Box>
  );
};
