import { DashboardOutlined } from "@ant-design/icons";
import { ROUTES } from "./routes";

export const adminNavigation = [
  {
    section: "Overview",
    items: [
      {
        label: "Dashboard",
        path: ROUTES.DASHBOARD,
        icon: DashboardOutlined,
      },
    ],
  },
] as const;