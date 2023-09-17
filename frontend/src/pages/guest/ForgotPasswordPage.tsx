import {
  Anchor,
  Box,
  Button,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
  rem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Link } from "react-router-dom";

export async function forgotPasswordLoader() {
  return true;
}

const ForgotPasswordPage = () => {
  const form = useForm({
    initialValues: {
      email: "",
    },
    validate: {
      email: () => null,
    },
  });

  const submitForm = () => {
    const data = form.getTransformedValues();
    console.log({ data });
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: rem(50),
      }}>
      <Box>
        <Title
          align="center"
          size="h4"
          weight={600}>
          Forgot your password ???
        </Title>
        <Text
          color="dimmed"
          size="sm"
          align="center"
          mt={5}>
          Worry not, enter your email address below and you will receive
          password reset instructions in your email?
        </Text>
      </Box>
      <Box
        maw={400}
        w={"90%"}
        mx={"auto"}
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}>
        <form onSubmit={form.onSubmit(submitForm)}>
          <Stack>
            <TextInput
              required
              label="Email"
              placeholder="Please enter your email"
              type="email"
              autoComplete="email"
              {...form.getInputProps("email")}
            />
          </Stack>

          <Group
            position="apart"
            mt="xl">
            <Stack spacing={"xs"}>
              <Anchor
                component={Link}
                to={"/login"}
                size="xs">
                Try loggin in again ?
              </Anchor>
              <Anchor
                component={Link}
                to={"/register"}
                size="xs">
                Create a new account ?
              </Anchor>
            </Stack>

            <Button
              type="submit"
              disabled={false}>
              Confirm
            </Button>
          </Group>
        </form>
      </Box>
    </Box>
  );
};

export default ForgotPasswordPage;
