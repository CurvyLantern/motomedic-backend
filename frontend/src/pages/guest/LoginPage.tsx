import { fetchCSRF } from "@/fetchers/fetchCSRF";
import { login } from "@/hooks/auth";
import useCustomForm from "@/hooks/useCustomForm";
import axiosClient from "@/lib/axios";
import {
    Text,
    Box,
    rem,
    Title,
    Anchor,
    Stack,
    TextInput,
    PasswordInput,
    Select,
    Checkbox,
    Group,
    Button,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { Axios, AxiosError, AxiosResponse } from "axios";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export async function loginLoader() {
    return true;
}

const LoginPage = () => {
    const form = useCustomForm({
        initialValues: {
            email: "",
            password: "",
            remember: false,
            role: "staff",
        },
        validate: {
            email: () => null,
            password: () => null,
            remember: () => null,
            role: () => null,
        },
    });

    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const loginForm = useRef<HTMLFormElement>(null);

    const submitForm = async () => {
        setSubmitting(true);
        try {
            const formData = new FormData(loginForm.current ?? undefined);

            await login(formData);

            notifications.show({
                message: "Successfully logged in",
                autoClose: 1000,
                color: "green",
                onClose: () => {
                    navigate("/");
                },
            });
        } catch (error) {
            const axiosErr = error as AxiosResponse;
            if (axiosErr.status === 422) {
                notifications.show({
                    message: "Invalid email or password",
                    color: "red",
                    autoClose: 4000,
                });
                form.setErrors({
                    email: "Invalid email or password",
                    password: "Invalid email or password",
                });
            } else {
                const axiosError = error as AxiosError;
                console.error(axiosError);
                form.setErrors(axiosError.data.errors);
            }
        } finally {
            setSubmitting(false);
        }
    };

    // return <GuestLayout></GuestLayout>;

    const registerLink = "/auth/register";
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
                    Login to{" "}
                    <Text span sx={{ display: "inline-block" }} color={"blue"}>
                        MotoMedic
                    </Text>
                </Title>
                <Text color="dimmed" size="sm" align="center" mt={5}>
                    Do not have an account yet?{" "}
                    <Anchor size="sm" to={registerLink} component={Link}>
                        Create account
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
                <form ref={loginForm} onSubmit={form.onSubmit(submitForm)}>
                    <Stack>
                        <TextInput
                            required
                            label="Email"
                            placeholder="Please enter your email"
                            type="email"
                            autoComplete="email"
                            name="email"
                            {...form.getInputProps("email")}
                        />

                        <PasswordInput
                            {...form.getInputProps("password")}
                            required
                            autoComplete="current-password"
                            label="Password"
                            placeholder="mypasswordisstrong"
                        />

                        <Select
                            {...form.getInputProps("role")}
                            label="Role"
                            data={[
                                { label: "admin", value: "0" },
                                { label: "staff", value: "1" },
                                { label: "biller", value: "2" },
                            ]}
                            size="sm"
                        ></Select>

                        <Checkbox
                            {...form.getInputProps("remember", {
                                type: "checkbox",
                            })}
                            label="Keep me logged in"
                            size="sm"
                        ></Checkbox>
                    </Stack>

                    <Group position="apart" mt="xl">
                        <Anchor component={Link} to={forgotPassword} size="xs">
                            Forgot your password?
                        </Anchor>

                        <Button
                            loading={submitting}
                            type="submit"
                            disabled={false}
                        >
                            Log in
                        </Button>
                    </Group>
                </form>
            </Box>
        </Box>
    );
};

export default LoginPage;
