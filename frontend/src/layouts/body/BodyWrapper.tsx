import { CompWithChildren } from "@/types/defaultTypes";
import { Box } from "@mantine/core";

export const BodyWrapper: CompWithChildren = ({ children }) => {
  // calc(100vh - var(--mantine-header-height, 0rem) - var(--mantine-footer-height, 0rem));
  return (
    <Box
      className="bodyWrapper"
      sx={() => ({
        display: "flex",
        width: "100%",
        height: "100%",
        maxHeight: "100%",
        position: "relative",
      })}
    >
      {children}
    </Box>
  );
};
