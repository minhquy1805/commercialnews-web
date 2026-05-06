import { Breadcrumb } from "antd";
import { useLocation } from "react-router-dom";

function toTitleCase(value: string): string {
  return value
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function buildBreadcrumbItems(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return [{ title: "Home" }];
  }

  return [
    { title: "Home" },
    ...segments.map((segment) => ({
      title: toTitleCase(segment),
    })),
  ];
}

export function AdminBreadcrumb() {
  const location = useLocation();

  return (
    <Breadcrumb
      style={{ margin: "16px 0" }}
      items={buildBreadcrumbItems(location.pathname)}
    />
  );
}