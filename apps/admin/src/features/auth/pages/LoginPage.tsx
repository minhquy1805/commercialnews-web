import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, Card, Form, Input, Typography } from "antd";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  getApiErrorMessage,
  getApiErrorStatus,
} from "../../../shared/api/apiError";
import { ROUTES } from "../../../shared/constants/routes";
import { useLogin } from "../hooks/useLogin";
import { loginSchema, type LoginFormValues } from "../schemas/loginSchema";
import { useAuthStore } from "../stores/authStore";

const { Title, Text } = Typography;

export function LoginPage() {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    try {
      const result = await loginMutation.mutateAsync(values);

      setAccessToken(result.accessToken);

      navigate(ROUTES.DASHBOARD);
    } catch {
      // Error is handled by loginMutation.error below.
    }
  }

  const loginErrorMessage =
    getApiErrorStatus(loginMutation.error) === 401
      ? "Invalid email or password."
      : getApiErrorMessage(
          loginMutation.error,
          "Login failed. Please try again."
        );

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#f5f5f5",
        padding: 24,
      }}
    >
      <Card style={{ width: "100%", maxWidth: 420 }}>
        <Title level={3} style={{ marginBottom: 4 }}>
          Admin Login
        </Title>

        <Text type="secondary">Sign in to Commercial News Admin</Text>

        {loginMutation.error && (
          <Alert
            type="error"
            showIcon
            description={loginErrorMessage}
            style={{ marginTop: 24 }}
          />
        )}

        <Form
          layout="vertical"
          onFinish={handleSubmit(onSubmit)}
          style={{ marginTop: 24 }}
        >
          <Form.Item
            label="Email"
            validateStatus={errors.email ? "error" : ""}
            help={errors.email?.message}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="admin@example.com"
                  autoComplete="email"
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            validateStatus={errors.password ? "error" : ""}
            help={errors.password?.message}
          >
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
              )}
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loginMutation.isPending}
          >
            Login
          </Button>
        </Form>
      </Card>
    </main>
  );
}
