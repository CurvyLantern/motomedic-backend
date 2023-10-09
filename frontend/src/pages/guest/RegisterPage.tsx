import { fetchCSRF } from "@/fetchers/fetchCSRF";
import { register } from "@/hooks/auth";
import useCustomForm from "@/hooks/useCustomForm";
import axiosClient from "@/lib/axios";
import {
  Anchor,
  Box,
  Button,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
  rem,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { AxiosError, AxiosResponse } from "axios";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

export async function registerLoader() {
  return true;
}
const validationSchema = z
  .object({
    name: z.string().nonempty("Name cannot be empty"),
    email: z.string().email("Email is not valid"),
    password: z.string().min(8),
    password_confirmation: z.string().min(8),
  })
  .superRefine((data, ctx) => {
    const notMatched = data.password !== data.password_confirmation;
    if (notMatched) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["password_confirmation"],
      });
    }
  });
const RegisterPage = () => {
  const form = useCustomForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
    validate: zodResolver(validationSchema),
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const registerForm = useRef<HTMLFormElement>(null);
  const submitForm = async () => {
    setLoading(true);
    try {
      const formData = new FormData(registerForm.current ?? undefined);

      await register(formData);

      notifications.show({
        message: "Successfully created account",
        color: "green",
        autoClose: 1000,
        onClose: () => {
          navigate("/auth/login");
        },
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(axiosError);
      form.setErrors(axiosError.data.errors);
      notifications.show({
        message: error.data.message,
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  // return <GuestLayout></GuestLayout>;

  const loginLink = "/auth/login";
  const forgotPassword = "/auth/forgot-password";
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: rem(50),
      }}
    >
      <Box>
        <Title align="center" size="h1" weight={600}>
          Register to{" "}
          <Text span sx={{ display: "inline-block" }} color={"blue"}>
            MotoMedic
          </Text>
        </Title>
        <Text color="dimmed" size="sm" align="center" mt={5}>
          Already have an account?{" "}
          <Anchor size="sm" to={loginLink} component={Link}>
            Log in
          </Anchor>
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
        }}
      >
        <form ref={registerForm} onSubmit={form.onSubmit(submitForm)}>
          <Stack>
            <TextInput
              required
              label="Name"
              placeholder="Please enter your name"
              {...form.getInputProps("name")}
            />
            <TextInput
              required
              label="Email"
              placeholder="Please enter your email"
              type="email"
              autoComplete="email"
              {...form.getInputProps("email")}
            />

            <PasswordInput
              {...form.getInputProps("password")}
              required
              autoComplete="current-password"
              label="Password"
              placeholder="mypasswordisstrong"
            />
            <PasswordInput
              {...form.getInputProps("password_confirmation")}
              required
              label="Confirm password"
            />
          </Stack>

          <Group position="apart" mt="xl">
            <Anchor component={Link} to={forgotPassword} size="xs">
              Forgot your password?
            </Anchor>

            <Button loading={loading} type="submit" disabled={false}>
              Register
            </Button>
          </Group>
        </form>
      </Box>
    </Box>
  );
};

export default RegisterPage;
