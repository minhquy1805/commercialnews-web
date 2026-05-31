import { useMemo, useState } from "react";
import { Column } from "@ant-design/charts";
import { useQuery } from "@tanstack/react-query";
import { Card, Empty, Select, Space, Statistic, Typography } from "antd";
import { adminArticlesApi } from "../../content/api/adminArticlesApi";
import { ArticleStatuses } from "../../content/constants/articleStatuses";
import type { AdminArticleListItem } from "../../content/types/adminArticle.types";

const CURRENT_YEAR = new Date().getFullYear();
const ARTICLE_PAGE_SIZE = 100;

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

type PublishedArticleMonth = {
  month: string;
  publishedArticles: number;
};

function parsePublishedYearMonth(value: string | null) {
  if (!value) {
    return null;
  }

  const match = /^(\d{4})-(\d{2})/.exec(value);

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;

  if (Number.isNaN(year) || monthIndex < 0 || monthIndex > 11) {
    return null;
  }

  return { year, monthIndex };
}

async function getAllPublishedArticles() {
  const items: AdminArticleListItem[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const response = await adminArticlesApi.getArticles({
      page,
      pageSize: ARTICLE_PAGE_SIZE,
      status: ArticleStatuses.Published,
      isDeleted: false,
    });

    items.push(...response.items);

    totalPages = response.pageInfo.totalPages;
    page += 1;
  } while (page <= totalPages);

  return items;
}

function buildMonthlyPublishedData(
  articles: AdminArticleListItem[],
  year: number,
): PublishedArticleMonth[] {
  const counts = Array.from({ length: 12 }, () => 0);

  for (const article of articles) {
    const publishedDate = parsePublishedYearMonth(article.publishedAt);

    if (!publishedDate || publishedDate.year !== year) {
      continue;
    }

    counts[publishedDate.monthIndex] += 1;
  }

  return MONTH_LABELS.map((month, index) => ({
    month,
    publishedArticles: counts[index],
  }));
}

function getPublishedYears(
  articles: AdminArticleListItem[],
  selectedYear: number,
) {
  const years = new Set<number>([CURRENT_YEAR, selectedYear]);

  for (const article of articles) {
    const publishedDate = parsePublishedYearMonth(article.publishedAt);

    if (publishedDate) {
      years.add(publishedDate.year);
    }
  }

  return Array.from(years)
    .sort((left, right) => right - left)
    .map((year) => ({
      label: String(year),
      value: year,
    }));
}

export function DashboardPage() {
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);

  const articlesQuery = useQuery({
    queryKey: ["admin", "dashboard", "published-articles-by-month"],
    queryFn: getAllPublishedArticles,
    retry: false,
  });

  const publishedArticles = articlesQuery.data ?? [];

  const yearOptions = useMemo(
    () => getPublishedYears(publishedArticles, selectedYear),
    [publishedArticles, selectedYear],
  );

  const chartData = useMemo(
    () => buildMonthlyPublishedData(publishedArticles, selectedYear),
    [publishedArticles, selectedYear],
  );

  const chartConfig = useMemo(
    () => ({
      data: chartData,
      xField: "month",
      yField: "publishedArticles",
      height: 340,
      autoFit: true,
      colorField: "month",
      legend: false,
      axis: {
        x: { title: false },
        y: {
          title: false,
          labelFormatter: (value: string | number) => String(value),
        },
      },
      style: {
        radiusTopLeft: 6,
        radiusTopRight: 6,
      },
      tooltip: {
        title: (datum: PublishedArticleMonth) =>
          `${datum.month} ${selectedYear}`,
        items: [
          {
            field: "publishedArticles",
            name: "Published articles",
          },
        ],
      },
    }),
    [chartData, selectedYear],
  );

  const totalPublishedArticles = chartData.reduce(
    (total, item) => total + item.publishedArticles,
    0,
  );

  return (
    <section>
      <Typography.Title level={2} style={{ marginTop: 0 }}>
        Homepage
      </Typography.Title>

      <Card
        title="Published articles by month"
        extra={
          <Select
            aria-label="Published article year"
            value={selectedYear}
            options={yearOptions}
            onChange={setSelectedYear}
            style={{ width: 120 }}
          />
        }
        loading={articlesQuery.isLoading}
      >
        <Space direction="vertical" size={24} style={{ width: "100%" }}>
          <Statistic
            title={`Published articles in ${selectedYear}`}
            value={totalPublishedArticles}
          />

          {articlesQuery.isError ? (
            <Empty description="Could not load published article data." />
          ) : (
            <Column {...chartConfig} />
          )}
        </Space>
      </Card>
    </section>
  );
}
