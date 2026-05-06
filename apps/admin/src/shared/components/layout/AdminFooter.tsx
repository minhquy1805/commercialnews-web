import { Layout } from "antd";

const { Footer } = Layout;

export function AdminFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <Footer style={{ textAlign: "center" }}>
      CommercialNews Admin ©{currentYear}
    </Footer>
  );
}