import {
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import {
  App,
  Avatar,
  Button,
  Layout,
  Menu,
  Space,
  Tooltip,
} from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useMyProfile } from "../../../features/auth/hooks/useMyProfile";
import { useLogout } from "../../../features/auth/hooks/useLogout";
import { ROUTES } from "../../constants/routes";
import { useAuthStore } from "../../../features/auth/stores/authStore";
import { useQueryClient } from "@tanstack/react-query";

const { Header } = Layout;

type HeaderNavItem = {
  key: string;
  label: string;
  path: string;
  isActive: (pathname: string) => boolean;
};

const isSectionPath = (pathname: string, sectionPath: string) =>
  pathname === sectionPath || pathname.startsWith(`${sectionPath}/`);

const headerNavItems: HeaderNavItem[] = [
  {
    key: "homepage",
    label: "Homepage",
    path: ROUTES.DASHBOARD,
    isActive: (pathname) => pathname === ROUTES.DASHBOARD,
  },
  {
    key: "content",
    label: "Content",
    path: ROUTES.CONTENT_NEWS,
    isActive: (pathname) => isSectionPath(pathname, "/content"),
  },
  {
    key: "media",
    label: "Media",
    path: ROUTES.MEDIA_ASSETS,
    isActive: (pathname) => isSectionPath(pathname, ROUTES.MEDIA),
  },
  {
    key: "seo",
    label: "SEO",
    path: ROUTES.SEO_METADATA,
    isActive: (pathname) => isSectionPath(pathname, ROUTES.SEO),
  },
  {
    key: "moderation-action",
    label: "Moderation action",
    path: ROUTES.INTERACTION_MODERATION_CASES,
    isActive: (pathname) =>
      isSectionPath(pathname, ROUTES.INTERACTION_MODERATION_CASES),
  },
];

const headerItems: MenuProps["items"] = headerNavItems.map((item) => ({
  key: item.key,
  label: item.label,
}));

export function AdminHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: profile, isLoading } = useMyProfile();

  const { notification } = App.useApp();
  const queryClient = useQueryClient();

  const clearAuth = useAuthStore((state) => state.clearAuth);
  const logoutMutation = useLogout();

  const selectedHeaderKey = headerNavItems.find((item) =>
    item.isActive(location.pathname),
  )?.key;

  const handleHeaderMenuClick: MenuProps["onClick"] = ({ key }) => {
    const item = headerNavItems.find((navItem) => navItem.key === key);

    if (item) {
      navigate(item.path);
    }
  };

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
        selectedKeys={selectedHeaderKey ? [selectedHeaderKey] : []}
        items={headerItems}
        onClick={handleHeaderMenuClick}
        style={{ flex: 1, minWidth: 0 }}
      />

      <Space size={12} style={{ paddingInline: 16 }}>
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
