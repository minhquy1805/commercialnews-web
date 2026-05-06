import { Layout, theme } from "antd";
import { Outlet } from "react-router-dom";
import { AdminBreadcrumb } from "../../shared/components/layout/AdminBreadcrumb";
import { AdminContent } from "../../shared/components/layout/AdminContent";
import { AdminFooter } from "../../shared/components/layout/AdminFooter";
import { AdminHeader } from "../../shared/components/layout/AdminHeader";
import { AdminSidebar } from "../../shared/components/layout/AdminSidebar";

const { Content } = Layout;

export function AdminLayout() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout hasSider style={{ minHeight: "100vh" }}>
      <AdminSidebar />

      <Layout>
        <AdminHeader />

        <Content style={{ margin: "0 16px", overflow: "initial" }}>
          <AdminBreadcrumb />

          <AdminContent
            background={colorBgContainer}
            borderRadius={borderRadiusLG}
          >
            <Outlet />
          </AdminContent>
        </Content>

        <AdminFooter />
      </Layout>
    </Layout>
  );
}