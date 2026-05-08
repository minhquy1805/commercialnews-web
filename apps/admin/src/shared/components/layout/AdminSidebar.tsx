import type { Key, ReactNode } from "react";
import { useState } from "react";
import {
  AuditOutlined,
  DashboardOutlined,
  FileTextOutlined,
  IdcardOutlined,
  LockOutlined,
  NotificationOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

const { Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

const siderStyle: React.CSSProperties = {
  overflow: "auto",
  height: "100vh",
  position: "sticky",
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: "thin",
  scrollbarGutter: "stable",
};

function getItem(
  label: ReactNode,
  key: Key,
  icon?: ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const sidebarItems: MenuItem[] = [
  getItem("Dashboard", ROUTES.DASHBOARD, <DashboardOutlined />),

  getItem("My Profile", ROUTES.PROFILE, <UserOutlined />),

  getItem("Identity", "identity", <IdcardOutlined />, [
    getItem("Users", ROUTES.IDENTITY_USERS),
    getItem("Roles", "/identity/roles"),
    getItem("Permissions", "/identity/permissions"),
  ]),

  getItem("Authorization", "authorization", <SafetyCertificateOutlined />, [
    getItem("Role Permissions", "/authorization/role-permissions"),
    getItem("User Roles", "/authorization/user-roles"),
  ]),

  getItem("Content", "content", <FileTextOutlined />, [
    getItem("News", "/content/news"),
    getItem("Categories", "/content/categories"),
  ]),

  getItem("Notifications", "/notifications", <NotificationOutlined />),
  getItem("Audit Logs", "/audit/logs", <AuditOutlined />),
  getItem("Security", "/security", <LockOutlined />),
  getItem("Team", "/team", <TeamOutlined />),
  getItem("Settings", "/settings", <SettingOutlined />),
];

function getOpenKeys(pathname: string): string[] {
  if (pathname.startsWith("/identity")) return ["identity"];
  if (pathname.startsWith("/authorization")) return ["authorization"];
  if (pathname.startsWith("/content")) return ["content"];

  return [];
}

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      style={siderStyle}
    >
      <div className="demo-logo-vertical" />

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        defaultOpenKeys={getOpenKeys(location.pathname)}
        items={sidebarItems}
        onClick={({ key }) => {
          const route = String(key);

          if (route.startsWith("/")) {
            navigate(route);
            return;
          }

          // Nhóm menu như "identity", "authorization", "content" chỉ dùng để mở/đóng submenu.
          console.log("Sidebar group clicked:", route);
        }}
      />
    </Sider>
  );
}
