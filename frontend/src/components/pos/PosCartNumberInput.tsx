import {
  ActionIcon,
  NumberInput,
  NumberInputHandlers,
  Stack,
  rem,
} from "@mantine/core";
import { useRef } from "react";

const PosCartNumberInput = ({
  max,
  min,
  onUpdate,
  defaultValue,
}: {
  max: number;
  min: number;
  onUpdate: (v: number) => void;
  defaultValue: number;
}) => {
  const handlers = useRef<NumberInputHandlers>();
  // const [count, setCount] = useState(0);
  // const increment = () => {
  //     setCount((p) => Math.min(p + 1, max));
  // };
  // const decrement = () => {
  //     setCount((p) => Math.max(p - 1, min));
  // };
  return (
    <Stack spacing={3} sx={{ userSelect: "none" }}>
      <ActionIcon
        // w={"100%"}
        mih={0}
        h={"auto"}
        variant={"gradient"}
        disabled={defaultValue >= max}
        onClick={() => handlers.current?.increment()}
      >
        +
      </ActionIcon>

      <NumberInput
        hideControls
        value={defaultValue}
        onChange={(val) => onUpdate(Math.min(Number(val), max))}
        handlersRef={handlers}
        max={max}
        min={min}
        step={1}
        styles={(theme) => ({
          root: {},
          input: {
            fontWeight: 600,
            width: 55,
            height: rem(20),
            minHeight: 0,
            border: "1px solid",
            borderColor: theme.other.colors.primary.background,
            padding: 0,
            textAlign: "center",
          },
        })}
      />
      <ActionIcon
        // w={"100%"}
        mih={0}
        h={"auto"}
        disabled={defaultValue <= min}
        variant={"gradient"}
        onClick={() => handlers.current?.decrement()}
      >
        –
      </ActionIcon>
    </Stack>
  );
};

export default PosCartNumberInput;
