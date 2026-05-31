import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Card, Descriptions, Skeleton, Space, Statistic, Typography } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";
import { useAdminArticleInteractionStats } from "../hooks/article-interaction/useAdminArticleInteractionStats";
import { formatDateTime, wrappingTextStyle } from "../utils/interactionUi";

export function InteractionArticleStatsPage() {
  const { articlePublicId } = useParams();
  const navigate = useNavigate();
  const statsQuery = useAdminArticleInteractionStats(articlePublicId);
  const stats = statsQuery.data;

  if (!articlePublicId) {
    return (
      <Card>
        <Typography.Text type="secondary">Invalid article public id.</Typography.Text>
      </Card>
    );
  }

  if (statsQuery.isLoading) {
    return (
      <Card>
        <Skeleton active paragraph={{ rows: 6 }} />
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <Typography.Text type="secondary">
          Article interaction stats are not available.
        </Typography.Text>
      </Card>
    );
  }

  return (
    <section>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(ROUTES.INTERACTION_COMMENTS)}>
        Back to comments
      </Button>

      <Card style={{ marginTop: 16 }}>
        <Typography.Title level={2} style={{ marginTop: 0 }}>
          Article interaction stats
        </Typography.Title>
        <Typography.Text type="secondary" style={wrappingTextStyle}>
          {stats.articlePublicId}
        </Typography.Text>

        <Space size={16} wrap style={{ marginTop: 24 }}>
          <Card>
            <Statistic title="Views" value={stats.viewCount} />
          </Card>
          <Card>
            <Statistic title="Likes" value={stats.likeCount} />
          </Card>
          <Card>
            <Statistic title="Visible comments" value={stats.visibleCommentCount} />
          </Card>
        </Space>

        <Descriptions bordered column={{ xs: 1, sm: 1, md: 2 }} style={{ marginTop: 24 }}>
          <Descriptions.Item label="Article public ID">
            <Typography.Text style={wrappingTextStyle}>{stats.articlePublicId}</Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Stats version">{stats.statsVersion}</Descriptions.Item>
          <Descriptions.Item label="Last materialized">
            {formatDateTime(stats.lastMaterializedAtUtc)}
          </Descriptions.Item>
          <Descriptions.Item label="Last published">
            {formatDateTime(stats.lastPublishedAtUtc)}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </section>
  );
}
