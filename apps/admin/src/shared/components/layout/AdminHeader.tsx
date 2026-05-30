import {
  BellOutlined,
  GlobalOutlined,
  LogoutOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import {
  App,
  Avatar,
  Badge,
  Button,
  Input,
  Layout,
  Menu,
  Space,
  Tooltip,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useMyProfile } from "../../../features/auth/hooks/useMyProfile";
import { useLogout } from "../../../features/auth/hooks/useLogout";
import { ROUTES } from "../../constants/routes";
import { useAuthStore } from "../../../features/auth/stores/authStore";
import { useQueryClient } from "@tanstack/react-query";

const { Header } = Layout;

const headerItems: MenuProps["items"] = [
  {
    key: "overview",
    label: "Overview",
  },
  {
    key: "operations",
    label: "Operations",
  },
  {
    key: "reports",
    label: "Reports",
  },
];



export function AdminHeader() {
  const navigate = useNavigate();
  const { data: profile, isLoading } = useMyProfile();

  const { notification } = App.useApp();
  const queryClient = useQueryClient();

  
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();

      notification.success({
        title: "Logged out",
        description: "You have been logged out successfully.",
        placement: "topRight",
      });
    } catch {
      notification.warning({
        title: "Local session cleared",
        description:
          "Could not complete server logout, but your local session has been cleared.",
        placement: "topRight",
      });
    } finally {
      clearAuth();
      queryClient.clear();
      navigate(ROUTES.LOGIN, { replace: true });
    }
  };

  return (
    <Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        width: "100%",
        display: "flex",
        alignItems: "center",
        padding: 0,
      }}
    >
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={["overview"]}
        items={headerItems}
        style={{ flex: 1, minWidth: 0 }}
      />

      <Space size={12} style={{ paddingInline: 16 }}>
        <Input
          allowClear
          size="middle"
          prefix={<SearchOutlined />}
          placeholder="Search..."
          style={{ width: 220 }}
        />

        <Tooltip title="Language">
          <Button
            type="text"
            shape="circle"
            icon={<GlobalOutlined />}
            style={{ color: "#ffffff" }}
          />
        </Tooltip>

        <Tooltip title="Notifications">
          <Badge count={3} size="small" offset={[-2, 4]}>
            <Button
              type="text"
              shape="circle"
              icon={<BellOutlined />}
              style={{ color: "#ffffff" }}
            />
          </Badge>
        </Tooltip>

        <Space size={8}>
          <Tooltip title="My Profile">
            <Avatar
              src={profile?.avatarUrl ?? undefined}
              icon={!profile?.avatarUrl ? <UserOutlined /> : undefined}
              onClick={() => navigate(ROUTES.PROFILE)}
              style={{
                cursor: "pointer",
                backgroundColor: "#111827",
                border: "1px solid rgba(255,255,255,0.25)",
              }}
            />
          </Tooltip>

          <span style={{ color: "#ffffff", fontWeight: 500 }}>
            {isLoading
              ? "Loading..."
              : profile?.fullName || profile?.email || "Admin"}
          </span>
        </Space>

        <Tooltip title="Logout">
          <Button
            type="text"
            shape="circle"
            icon={<LogoutOutlined />}
            style={{ color: "#ffffff" }}
            loading={logoutMutation.isPending}
            onClick={handleLogout}
          />
        </Tooltip>
      </Space>
    </Header>
  );
}
