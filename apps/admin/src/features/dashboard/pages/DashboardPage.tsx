import { Card, Typography } from "antd";

export function DashboardPage() {
  return (
    <section>
      <Typography.Title level={2} style={{ marginTop: 0 }}>
        Dashboard
      </Typography.Title>

      <Typography.Text type="secondary">
        Commercial News Admin is working.
      </Typography.Text>

      <Card style={{ marginTop: 24 }}>
        Dashboard page is now rendered inside Ant Design Admin Layout.
      </Card>
    </section>
  );
}