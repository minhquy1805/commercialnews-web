import { LockOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import {
  App,
  Avatar,
  Button,
  Card,
  Descriptions,
  Divider,
  Form,
  Input,
  Popconfirm,
  Skeleton,
  Space,
  Tag,
  Typography,
} from "antd";
import { useEffect } from "react";
import { useChangePassword } from "../hooks/useChangePassword";
import { useMyProfile } from "../hooks/useMyProfile";
import { useUpdateMyProfile } from "../hooks/useUpdateMyProfile";
import {
  USER_ACCOUNT_STATUSES,
  type ChangePasswordRequest,
  type UpdateMyProfileRequest,
} from "../types/identity.types";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useLogoutAllSessions } from "../hooks/useLogoutAllSessions";
import { useAuthStore } from "../stores/authStore";
import { ROUTES } from "../../../shared/constants/routes";

type ProfileFormValues = {
  fullName: string;
  avatarUrl?: string | null;
};

type ChangePasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

function getStatusColor(status: string) {
  switch (status) {
    case USER_ACCOUNT_STATUSES.ACTIVE:
      return "success";
    case USER_ACCOUNT_STATUSES.UNVERIFIED:
      return "warning";
    case USER_ACCOUNT_STATUSES.LOCKED:
      return "error";
    case USER_ACCOUNT_STATUSES.DISABLED:
      return "default";
    default:
      return "default";
  }
}

export function MyProfilePage() {
  const [profileForm] = Form.useForm<ProfileFormValues>();
  const [passwordForm] = Form.useForm<ChangePasswordFormValues>();
  const { notification } = App.useApp();

  const { data: profile, isLoading } = useMyProfile();
  const updateProfileMutation = useUpdateMyProfile();
  const changePasswordMutation = useChangePassword();

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const logoutAllSessionsMutation = useLogoutAllSessions();

  useEffect(() => {
    if (!profile) {
      return;
    }

    profileForm.setFieldsValue({
      fullName: profile.fullName,
      avatarUrl: profile.avatarUrl,
    });
  }, [profileForm, profile]);

  const handleUpdateProfile = async (values: ProfileFormValues) => {
    const request: UpdateMyProfileRequest = {
      fullName: values.fullName.trim(),
      avatarUrl: values.avatarUrl?.trim() || null,
    };

    try {
      await updateProfileMutation.mutateAsync(request);

      notification.success({
        message: "Profile updated",
        description: "Your profile information has been updated successfully.",
        placement: "topRight",
      });
    } catch {
      notification.error({
        message: "Update failed",
        description: "Could not update your profile. Please try again.",
        placement: "topRight",
      });
    }
  };

  const handleChangePassword = async (values: ChangePasswordFormValues) => {
    const request: ChangePasswordRequest = {
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    };

    try {
      const result = await changePasswordMutation.mutateAsync(request);

      if (result.passwordChanged) {
        passwordForm.resetFields();

        notification.success({
          message: "Password changed",
          description: "Your password has been changed successfully.",
          placement: "topRight",
        });

        return;
      }

      notification.warning({
        message: "Password not changed",
        description: "The server did not confirm the password change.",
        placement: "topRight",
      });
    } catch {
      notification.error({
        message: "Change password failed",
        description:
          "Could not change your password. Please check your current password and try again.",
        placement: "topRight",
      });
    }
  };

  const handleLogoutAllSessions = async () => {
    try {
      const result = await logoutAllSessionsMutation.mutateAsync();

      if (result.loggedOutAllSessions) {
        notification.success({
          message: "Logged out all sessions",
          description: "All sessions for your account have been logged out.",
          placement: "topRight",
        });
      } else {
        notification.warning({
          message: "Logout all sessions not confirmed",
          description: "The server did not confirm logging out all sessions.",
          placement: "topRight",
        });
      }
    } catch {
      notification.error({
        message: "Logout all sessions failed",
        description: "Could not logout all sessions. Please try again.",
        placement: "topRight",
      });

      return;
    }

    clearAuth();
    queryClient.clear();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  if (isLoading) {
    return (
      <Card>
        <Skeleton active avatar paragraph={{ rows: 8 }} />
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card>
        <Typography.Text type="secondary">
          Profile information is not available.
        </Typography.Text>
      </Card>
    );
  }

  return (
    <section>
      <Typography.Title level={2} style={{ marginTop: 0 }}>
        My Profile
      </Typography.Title>

      <Typography.Text type="secondary">
        View and update your account information.
      </Typography.Text>

      <Card style={{ marginTop: 24 }}>
        <Space align="center" size={16} style={{ marginBottom: 24 }}>
          <Avatar
            size={72}
            src={profile.avatarUrl ?? undefined}
            icon={!profile.avatarUrl ? <UserOutlined /> : undefined}
          />

          <div>
            <Typography.Title level={4} style={{ margin: 0 }}>
              {profile.fullName}
            </Typography.Title>

            <Typography.Text type="secondary">{profile.email}</Typography.Text>
          </div>
        </Space>

        <Divider>Editable information</Divider>

        <Form
          form={profileForm}
          layout="vertical"
          onFinish={handleUpdateProfile}
          style={{ maxWidth: 720 }}
        >
          <Form.Item
            label="Full name"
            name="fullName"
            rules={[
              {
                required: true,
                message: "Full name is required.",
              },
              {
                max: 200,
                message: "Full name must not exceed 200 characters.",
              },
            ]}
          >
            <Input placeholder="Enter your full name" />
          </Form.Item>

          <Form.Item
            label="Avatar URL"
            name="avatarUrl"
            rules={[
              {
                type: "url",
                message: "Avatar URL must be a valid URL.",
              },
              {
                max: 1000,
                message: "Avatar URL must not exceed 1000 characters.",
              },
            ]}
          >
            <Input placeholder="https://example.com/avatar.png" allowClear />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={updateProfileMutation.isPending}
            >
              Update Profile
            </Button>
          </Form.Item>
        </Form>

        <Divider>Change password</Divider>

        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handleChangePassword}
          style={{ maxWidth: 720 }}
        >
          <Form.Item
            label="Current password"
            name="currentPassword"
            rules={[
              {
                required: true,
                message: "Current password is required.",
              },
              {
                max: 200,
                message: "Current password must not exceed 200 characters.",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter your current password"
            />
          </Form.Item>

          <Form.Item
            label="New password"
            name="newPassword"
            rules={[
              {
                required: true,
                message: "New password is required.",
              },
              {
                min: 8,
                message: "New password must be at least 8 characters.",
              },
              {
                max: 200,
                message: "New password must not exceed 200 characters.",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter your new password"
            />
          </Form.Item>

          <Form.Item
            label="Confirm new password"
            name="confirmNewPassword"
            dependencies={["newPassword"]}
            rules={[
              {
                required: true,
                message: "Please confirm your new password.",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    new Error("The two passwords do not match."),
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm your new password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={changePasswordMutation.isPending}
            >
              Change Password
            </Button>
          </Form.Item>
        </Form>

        <Typography.Title level={5} style={{ marginTop: 24 }}>
          Security
        </Typography.Title>
        <Divider />

        <Card
          size="small"
          style={{
            maxWidth: 720,
            borderColor: "#ffccc7",
            background: "#fff2f0",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div>
              <Typography.Text strong>Logout all sessions</Typography.Text>
              <br />
              <Typography.Text type="secondary">
                This will sign out your account from all devices and browsers.
              </Typography.Text>
            </div>

            <Popconfirm
              title="Logout all sessions?"
              description="This action will sign out your account from all sessions, including this one."
              okText="Logout all"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
              onConfirm={handleLogoutAllSessions}
            >
              <Button
                danger
                icon={<LogoutOutlined />}
                loading={logoutAllSessionsMutation.isPending}
              >
                Logout all sessions
              </Button>
            </Popconfirm>
          </div>
        </Card>

        <Divider>Account information</Divider>

        <Descriptions bordered column={1}>
          <Descriptions.Item label="User ID">
            {profile.userId}
          </Descriptions.Item>

          <Descriptions.Item label="Public ID">
            {profile.publicId}
          </Descriptions.Item>

          <Descriptions.Item label="Email">
            {profile.email}
          </Descriptions.Item>

          <Descriptions.Item label="Email verified">
            {profile.isEmailVerified ? (
              <Tag color="success">Verified</Tag>
            ) : (
              <Tag color="warning">Unverified</Tag>
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Status">
            <Tag color={getStatusColor(profile.status)}>{profile.status}</Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Created at">
            {profile.createdAt}
          </Descriptions.Item>

          <Descriptions.Item label="Updated at">
            {profile.updatedAt ?? "N/A"}
          </Descriptions.Item>

          <Descriptions.Item label="Last login at">
            {profile.lastLoginAt ?? "N/A"}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </section>
  );
}