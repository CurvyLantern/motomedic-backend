import { createStyles } from "@mantine/core";
// .root {
//   position: relative;
// }

// .input {
//   /* height: rem(54px); */
//   /* padding-top: rem(18px); */
// }

// .label {
//   position: absolute;
//   pointer-events: none;
//   font-size: var(--mantine-font-size-xs);
//   padding-left: var(--mantine-spacing-sm);
//   padding-top: calc(var(--mantine-spacing-sm) / 2);
//   z-index: 1;
// }

export const useCustomInputStyles = createStyles((theme) => ({
  root: {
    position: "relative",
  },
  label: {
    position: "absolute",
    pointerEvents: "none",
    fontSize: 10,
    top: 0,
    left: 0,
    background: "#ffffff88",
    backdropFilter: "blur(2px)",
    border: "1px solid #ced4da",
    borderBottom: 0,
    borderColor: "",
    borderRadius: 5,
    paddingInline: 2,
    color: "black",
    fontWeight: 500,
    textTransform: "uppercase",

    marginLeft: 10,
    transform: " translateY(-40%)",
    zIndex: 1,
  },
  input: {
    paddingTop: 5,
  },
}));
