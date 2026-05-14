import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
  FileDoneOutlined,
  InboxOutlined,
  SendOutlined,
} from "@ant-design/icons";
import {
  App,
  Button,
  Card,
  Descriptions,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Skeleton,
  Space,
  Table,
  Tag,
  type TableProps,
  Typography,
} from "antd";
import { type CSSProperties, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";
import {
  AuthorizationAuditUser,
  type AuthorizationAuditUsersById,
} from "../../authorization/components/AuthorizationAuditUser";
import { getNumericUserIds } from "../../authorization/utils/authorizationAudit";
import {
  ArticleLifecycleActionTypeColors,
  ArticleLifecycleActionTypeLabels,
} from "../constants/articleLifecycleActionTypes";
import {
  ArticleStatuses,
  ArticleStatusColors,
  ArticleStatusLabels,
  type ArticleStatus,
} from "../constants/articleStatuses";
import { ContentFieldLimits } from "../constants/contentFieldLimits";
import { useAdminArticleDetail } from "../hooks/article/useAdminArticleDetail";
import { useAdminArticleLifecycleEvents } from "../hooks/article/useAdminArticleLifecycleEvents";
import { useAdminArticleRevisions } from "../hooks/article/useAdminArticleRevisions";
import { useAdminArticleTags } from "../hooks/article/useAdminArticleTags";
import { useArchiveAdminArticle } from "../hooks/article/useArchiveAdminArticlea";
import { usePublishAdminArticle } from "../hooks/article/usePublishAdminArticle";
import { useSoftDeleteAdminArticle } from "../hooks/article/useSoftDeleteAdminArticle";
import { useUnpublishAdminArticle } from "../hooks/article/useUnpublishAdminArticle";
import { useUpdateAdminArticle } from "../hooks/article/useUpdateAdminArticle";
import { useAdminCategories } from "../hooks/category/useAdminCategories";
import { useAdminTags } from "../hooks/tag/useAdminTags";
import type {
  AdminArticleLifecycleEventItem,
  AdminArticleRevisionListItem,
  AdminArticleTagItem,
} from "../types/adminArticle.types";
import { useAdminUserDetails } from "../../identity/hooks/useAdminUserDetails";

type EditArticleFormValues = {
  categoryId?: number | null;
  title: string;
  summary?: string;
  body: string;
  coverMediaId?: number | null;
  tagIds?: number[];
  changeSummary?: string;
};

type UnpublishArticleFormValues = {
  reason?: string;
};

const wrappingTextStyle: CSSProperties = {
  display: "block",
  whiteSpace: "normal",
  overflowWrap: "anywhere",
  wordBreak: "break-word",
  lineHeight: 1.35,
};

const preWrapTextStyle: CSSProperties = {
  ...wrappingTextStyle,
  whiteSpace: "pre-wrap",
};

function formatDateTime(value: string | null) {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

function renderArticleStatus(status: ArticleStatus) {
  return (
    <Tag color={ArticleStatusColors[status]}>{ArticleStatusLabels[status]}</Tag>
  );
}

function getArticleTagColumns(
  usersById: AuthorizationAuditUsersById,
  isFetchingUsers: boolean,
): TableProps<AdminArticleTagItem>["columns"] {
  return [
    {
      title: "Tag",
      key: "tag",
      fixed: "left",
      width: 280,
      render: (_, tag) => (
        <div style={{ minWidth: 0, maxWidth: 230 }}>
          <Typography.Text strong style={wrappingTextStyle}>
            {tag.tagName}
          </Typography.Text>
          <Typography.Text type="secondary" style={wrappingTextStyle}>
            {tag.tagNameNormalized}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: "Attached at",
      dataIndex: "attachedAt",
      key: "attachedAt",
      width: 190,
      render: formatDateTime,
    },
    {
      title: "Attached by",
      dataIndex: "attachedByUserId",
      key: "attachedByUserId",
      width: 240,
      render: (userId: number | null) => (
        <AuthorizationAuditUser
          userId={userId}
          usersById={usersById}
          isFetchingUsers={isFetchingUsers}
          fallbackLabel="System"
        />
      ),
    },
  ];
}

function getRevisionColumns(
  usersById: AuthorizationAuditUsersById,
  isFetchingUsers: boolean,
): TableProps<AdminArticleRevisionListItem>["columns"] {
  return [
    {
      title: "Revision",
      key: "revision",
      fixed: "left",
      width: 320,
      render: (_, revision) => (
        <div style={{ minWidth: 0, maxWidth: 270 }}>
          <Typography.Text strong style={wrappingTextStyle}>
            Version {revision.articleVersion}
          </Typography.Text>
          <Typography.Text type="secondary" style={wrappingTextStyle}>
            {revision.titleSnapshot}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "statusSnapshot",
      key: "statusSnapshot",
      width: 130,
      render: renderArticleStatus,
    },
    {
      title: "Category",
      dataIndex: "categoryIdSnapshot",
      key: "categoryIdSnapshot",
      width: 130,
      render: (categoryId: number | null) => categoryId ?? "N/A",
    },
    {
      title: "Change summary",
      dataIndex: "changeSummary",
      key: "changeSummary",
      width: 280,
      render: (changeSummary: string | null) => (
        <Typography.Text style={wrappingTextStyle}>
          {changeSummary || "N/A"}
        </Typography.Text>
      ),
    },
    {
      title: "Edited at",
      dataIndex: "editedAt",
      key: "editedAt",
      width: 190,
      render: formatDateTime,
    },
    {
      title: "Edited by",
      dataIndex: "editedByUserId",
      key: "editedByUserId",
      width: 240,
      render: (userId: number | null) => (
        <AuthorizationAuditUser
          userId={userId}
          usersById={usersById}
          isFetchingUsers={isFetchingUsers}
          fallbackLabel="System"
        />
      ),
    },
    {
      title: "Correlation ID",
      dataIndex: "correlationId",
      key: "correlationId",
      width: 260,
      render: (correlationId: string | null) => (
        <Typography.Text style={wrappingTextStyle}>
          {correlationId || "N/A"}
        </Typography.Text>
      ),
    },
  ];
}

function getLifecycleEventColumns(
  usersById: AuthorizationAuditUsersById,
  isFetchingUsers: boolean,
): TableProps<AdminArticleLifecycleEventItem>["columns"] {
  return [
    {
      title: "Action",
      dataIndex: "actionType",
      key: "actionType",
      fixed: "left",
      width: 150,
      render: (actionType: AdminArticleLifecycleEventItem["actionType"]) => (
        <Tag color={ArticleLifecycleActionTypeColors[actionType]}>
          {ArticleLifecycleActionTypeLabels[actionType]}
        </Tag>
      ),
    },
    {
      title: "Status change",
      key: "statusChange",
      width: 220,
      render: (_, event) => (
        <Space size={6} wrap>
          {event.fromStatus ? renderArticleStatus(event.fromStatus) : <Tag>N/A</Tag>}
          <Typography.Text type="secondary">to</Typography.Text>
          {event.toStatus ? renderArticleStatus(event.toStatus) : <Tag>N/A</Tag>}
        </Space>
      ),
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      width: 260,
      render: (reason: string | null) => (
        <Typography.Text style={wrappingTextStyle}>
          {reason || "N/A"}
        </Typography.Text>
      ),
    },
    {
      title: "Occurred at",
      dataIndex: "occurredAt",
      key: "occurredAt",
      width: 190,
      render: formatDateTime,
    },
    {
      title: "Actor",
      dataIndex: "actorUserId",
      key: "actorUserId",
      width: 240,
      render: (userId: number | null) => (
        <AuthorizationAuditUser
          userId={userId}
          usersById={usersById}
          isFetchingUsers={isFetchingUsers}
          fallbackLabel="System"
        />
      ),
    },
    {
      title: "Metadata",
      dataIndex: "metadataJson",
      key: "metadataJson",
      width: 300,
      render: (metadataJson: string | null) => (
        <Typography.Text style={wrappingTextStyle}>
          {metadataJson || "N/A"}
        </Typography.Text>
      ),
    },
  ];
}

export function ArticleDetailPage() {
  const { articleId } = useParams();
  const parsedArticleId = Number(articleId);
  const selectedArticleId =
    Number.isSafeInteger(parsedArticleId) && parsedArticleId > 0
      ? parsedArticleId
      : null;
  const navigate = useNavigate();
  const { notification } = App.useApp();
  const [editForm] = Form.useForm<EditArticleFormValues>();
  const [unpublishForm] = Form.useForm<UnpublishArticleFormValues>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUnpublishModalOpen, setIsUnpublishModalOpen] = useState(false);

  const articleDetailQuery = useAdminArticleDetail(selectedArticleId ?? 0);
  const article = articleDetailQuery.data;
  const articleTagsQuery = useAdminArticleTags(selectedArticleId ?? 0);
  const revisionsQuery = useAdminArticleRevisions(selectedArticleId ?? 0);
  const lifecycleEventsQuery = useAdminArticleLifecycleEvents(
    selectedArticleId ?? 0,
  );
  const categoriesQuery = useAdminCategories({
    page: 1,
    pageSize: 100,
    isActive: true,
    isDeleted: false,
  });
  const tagsQuery = useAdminTags({
    page: 1,
    pageSize: 100,
    isActive: true,
    isDeleted: false,
  });
  const auditUsersQuery = useAdminUserDetails(
    getNumericUserIds([
      article?.authorUserId,
      article?.createdByUserId,
      article?.updatedByUserId,
      article?.deletedByUserId,
      ...(articleTagsQuery.data?.map((tag) => tag.attachedByUserId) ?? []),
      ...(revisionsQuery.data?.map((revision) => revision.editedByUserId) ?? []),
      ...(lifecycleEventsQuery.data?.map((event) => event.actorUserId) ?? []),
    ]),
  );
  const updateArticleMutation = useUpdateAdminArticle();
  const publishArticleMutation = usePublishAdminArticle();
  const unpublishArticleMutation = useUnpublishAdminArticle();
  const archiveArticleMutation = useArchiveAdminArticle();
  const softDeleteArticleMutation = useSoftDeleteAdminArticle();
  const isActionPending =
    updateArticleMutation.isPending ||
    publishArticleMutation.isPending ||
    unpublishArticleMutation.isPending ||
    archiveArticleMutation.isPending ||
    softDeleteArticleMutation.isPending;
  const categoryOptions = useMemo(
    () =>
      (categoriesQuery.data?.items ?? []).map((category) => ({
        label: `${category.name} (#${category.categoryId})`,
        value: category.categoryId,
      })),
    [categoriesQuery.data?.items],
  );
  const categoriesById = useMemo(
    () =>
      new Map(
        (categoriesQuery.data?.items ?? []).map((category) => [
          category.categoryId,
          category.name,
        ]),
      ),
    [categoriesQuery.data?.items],
  );
  const tagOptions = useMemo(
    () =>
      (tagsQuery.data?.items ?? []).map((tag) => ({
        label: `${tag.name} (#${tag.tagId})`,
        value: tag.tagId,
      })),
    [tagsQuery.data?.items],
  );
  const articleTagColumns = getArticleTagColumns(
    auditUsersQuery.usersById,
    auditUsersQuery.isFetching,
  );
  const revisionColumns = getRevisionColumns(
    auditUsersQuery.usersById,
    auditUsersQuery.isFetching,
  );
  const lifecycleEventColumns = getLifecycleEventColumns(
    auditUsersQuery.usersById,
    auditUsersQuery.isFetching,
  );

  async function runArticleAction(
    action: () => Promise<unknown>,
    successMessage: string,
    errorMessage: string,
  ): Promise<boolean> {
    try {
      await action();

      notification.success({
        message: successMessage,
        placement: "topRight",
      });

      return true;
    } catch {
      notification.error({
        message: errorMessage,
        placement: "topRight",
      });

      return false;
    }
  }

  function openEditModal() {
    if (!article) {
      return;
    }

    editForm.setFieldsValue({
      categoryId: article.categoryId ?? undefined,
      title: article.title,
      summary: article.summary ?? "",
      body: article.body,
      coverMediaId: article.coverMediaId ?? undefined,
      tagIds: articleTagsQuery.data?.map((tag) => tag.tagId) ?? [],
      changeSummary: "",
    });
    setIsEditModalOpen(true);
  }

  function closeEditModal() {
    setIsEditModalOpen(false);
    editForm.resetFields();
  }

  function openUnpublishModal() {
    unpublishForm.setFieldsValue({ reason: "" });
    setIsUnpublishModalOpen(true);
  }

  function closeUnpublishModal() {
    setIsUnpublishModalOpen(false);
    unpublishForm.resetFields();
  }

  async function handleUpdateArticle() {
    if (!article) {
      return;
    }

    const values = await editForm.validateFields();
    const completed = await runArticleAction(
      () =>
        updateArticleMutation.mutateAsync({
          articleId: article.articleId,
          categoryId: values.categoryId ?? null,
          title: values.title.trim(),
          summary: values.summary?.trim() || null,
          body: values.body.trim(),
          coverMediaId: values.coverMediaId ?? null,
          tagIds: values.tagIds ?? [],
          changeSummary: values.changeSummary?.trim() || null,
          expectedVersion: article.version,
        }),
      "Article updated",
      "Could not update article.",
    );

    if (completed) {
      closeEditModal();
    }
  }

  async function handleUnpublishArticle() {
    if (!article) {
      return;
    }

    const values = await unpublishForm.validateFields();
    const completed = await runArticleAction(
      () =>
        unpublishArticleMutation.mutateAsync({
          articleId: article.articleId,
          expectedVersion: article.version,
          reason: values.reason?.trim() || null,
        }),
      "Article unpublished",
      "Could not unpublish article.",
    );

    if (completed) {
      closeUnpublishModal();
    }
  }

  if (!selectedArticleId) {
    return (
      <Card>
        <Typography.Text type="secondary">Invalid article id.</Typography.Text>
      </Card>
    );
  }

  if (articleDetailQuery.isLoading) {
    return (
      <Card>
        <Skeleton active paragraph={{ rows: 10 }} />
      </Card>
    );
  }

  if (!article) {
    return (
      <Card>
        <Typography.Text type="secondary">
          Article information is not available.
        </Typography.Text>
      </Card>
    );
  }

  return (
    <section>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(ROUTES.CONTENT_NEWS)}
      >
        Back to news
      </Button>

      <Card style={{ marginTop: 16 }}>
        <Space align="start" size={16} wrap>
          <div style={{ minWidth: 0 }}>
            <Typography.Title level={2} style={{ margin: 0 }}>
              {article.title}
            </Typography.Title>

            <Typography.Text type="secondary" style={wrappingTextStyle}>
              {article.summary || "No summary"}
            </Typography.Text>

            <Space size={8} wrap style={{ marginTop: 12 }}>
              {renderArticleStatus(article.status)}
              {article.categoryId ? (
                <Tag color="blue">
                  {categoriesById.get(article.categoryId) ??
                    `Category #${article.categoryId}`}
                </Tag>
              ) : (
                <Tag color="default">Uncategorized</Tag>
              )}
              {article.isDeleted ? (
                <Tag color="error">Deleted</Tag>
              ) : (
                <Tag color="success">Visible</Tag>
              )}
            </Space>
          </div>
        </Space>

        <Descriptions
          bordered
          column={{ xs: 1, sm: 1, md: 2 }}
          style={{ marginTop: 24 }}
        >
          <Descriptions.Item label="Article ID">
            {article.articleId}
          </Descriptions.Item>
          <Descriptions.Item label="Public ID">
            <Typography.Text style={wrappingTextStyle}>
              {article.articlePublicId}
            </Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Category">
            {article.categoryId ? (
              <Button
                type="link"
                onClick={() =>
                  navigate(`${ROUTES.CONTENT_CATEGORIES}/${article.categoryId}`)
                }
                style={{ height: "auto", padding: 0 }}
              >
                {categoriesById.get(article.categoryId) ??
                  `Category #${article.categoryId}`}
              </Button>
            ) : (
              <Tag color="default">Uncategorized</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Author">
            <AuthorizationAuditUser
              userId={article.authorUserId}
              usersById={auditUsersQuery.usersById}
              isFetchingUsers={auditUsersQuery.isFetching}
              fallbackLabel={`User #${article.authorUserId}`}
            />
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            {renderArticleStatus(article.status)}
          </Descriptions.Item>
          <Descriptions.Item label="Cover media">
            {article.coverMediaId ?? "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Deleted">
            {article.isDeleted ? (
              <Tag color="error">Deleted</Tag>
            ) : (
              <Tag color="success">Visible</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Version">{article.version}</Descriptions.Item>
          <Descriptions.Item label="Created at">
            {formatDateTime(article.createdAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Updated at">
            {formatDateTime(article.updatedAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Published at">
            {formatDateTime(article.publishedAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Unpublished at">
            {formatDateTime(article.unpublishedAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Archived at">
            {formatDateTime(article.archivedAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Deleted at">
            {formatDateTime(article.deletedAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Created by">
            <AuthorizationAuditUser
              userId={article.createdByUserId}
              usersById={auditUsersQuery.usersById}
              isFetchingUsers={auditUsersQuery.isFetching}
              fallbackLabel="System"
            />
          </Descriptions.Item>
          <Descriptions.Item label="Updated by">
            <AuthorizationAuditUser
              userId={article.updatedByUserId}
              usersById={auditUsersQuery.usersById}
              isFetchingUsers={auditUsersQuery.isFetching}
              fallbackLabel={article.updatedAt ? "System" : "N/A"}
            />
          </Descriptions.Item>
          <Descriptions.Item label="Deleted by">
            <AuthorizationAuditUser
              userId={article.deletedByUserId}
              usersById={auditUsersQuery.usersById}
              isFetchingUsers={auditUsersQuery.isFetching}
            />
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Actions" style={{ marginTop: 16 }}>
        <Space size={12} wrap>
          <Button
            icon={<EditOutlined />}
            onClick={openEditModal}
            loading={updateArticleMutation.isPending}
            disabled={article.isDeleted || isActionPending}
          >
            Edit article
          </Button>

          {article.status === ArticleStatuses.Draft && (
            <Popconfirm
              title="Publish article?"
              okText="Publish"
              cancelText="Cancel"
              onConfirm={() =>
                runArticleAction(
                  () =>
                    publishArticleMutation.mutateAsync({
                      articleId: article.articleId,
                      expectedVersion: article.version,
                    }),
                  "Article published",
                  "Could not publish article.",
                )
              }
            >
              <Button
                type="primary"
                icon={<SendOutlined />}
                loading={publishArticleMutation.isPending}
                disabled={article.isDeleted || isActionPending}
              >
                Publish
              </Button>
            </Popconfirm>
          )}

          {article.status === ArticleStatuses.Published && (
            <Button
              icon={<InboxOutlined />}
              onClick={openUnpublishModal}
              loading={unpublishArticleMutation.isPending}
              disabled={article.isDeleted || isActionPending}
            >
              Unpublish
            </Button>
          )}

          {article.status !== ArticleStatuses.Archived && (
            <Popconfirm
              title="Archive article?"
              okText="Archive"
              cancelText="Cancel"
              onConfirm={() =>
                runArticleAction(
                  () =>
                    archiveArticleMutation.mutateAsync({
                      articleId: article.articleId,
                      expectedVersion: article.version,
                    }),
                  "Article archived",
                  "Could not archive article.",
                )
              }
            >
              <Button
                icon={<FileDoneOutlined />}
                loading={archiveArticleMutation.isPending}
                disabled={article.isDeleted || isActionPending}
              >
                Archive
              </Button>
            </Popconfirm>
          )}

          {!article.isDeleted && (
            <Popconfirm
              title="Delete article?"
              okText="Delete"
              okButtonProps={{ danger: true }}
              cancelText="Cancel"
              onConfirm={() =>
                runArticleAction(
                  () =>
                    softDeleteArticleMutation.mutateAsync({
                      articleId: article.articleId,
                      expectedVersion: article.version,
                    }),
                  "Article deleted",
                  "Could not delete article.",
                )
              }
            >
              <Button
                danger
                icon={<DeleteOutlined />}
                loading={softDeleteArticleMutation.isPending}
                disabled={isActionPending}
              >
                Delete
              </Button>
            </Popconfirm>
          )}
        </Space>
      </Card>

      <Card title="Body" style={{ marginTop: 16 }}>
        <Typography.Text style={preWrapTextStyle}>{article.body}</Typography.Text>
      </Card>

      <Card title="Tags" style={{ marginTop: 16 }}>
        <Table<AdminArticleTagItem>
          bordered
          rowKey={(tag) => String(tag.tagId)}
          columns={articleTagColumns}
          dataSource={articleTagsQuery.data ?? []}
          loading={articleTagsQuery.isFetching || auditUsersQuery.isFetching}
          scroll={{ x: 710 }}
          locale={{
            emptyText: articleTagsQuery.isError
              ? "Could not load article tags."
              : "No tags attached.",
          }}
          pagination={false}
          style={{
            border: "1px solid #f0f0f0",
            borderRadius: 8,
            overflow: "hidden",
          }}
        />
      </Card>

      <Card title="Revisions" style={{ marginTop: 16 }}>
        <Table<AdminArticleRevisionListItem>
          bordered
          rowKey={(revision) => String(revision.revisionId)}
          columns={revisionColumns}
          dataSource={revisionsQuery.data ?? []}
          loading={revisionsQuery.isFetching || auditUsersQuery.isFetching}
          scroll={{ x: 1550 }}
          locale={{
            emptyText: revisionsQuery.isError
              ? "Could not load revisions."
              : "No revisions found.",
          }}
          pagination={false}
          style={{
            border: "1px solid #f0f0f0",
            borderRadius: 8,
            overflow: "hidden",
          }}
        />
      </Card>

      <Card title="Lifecycle events" style={{ marginTop: 16 }}>
        <Table<AdminArticleLifecycleEventItem>
          bordered
          rowKey={(event) => String(event.lifecycleEventId)}
          columns={lifecycleEventColumns}
          dataSource={lifecycleEventsQuery.data ?? []}
          loading={lifecycleEventsQuery.isFetching || auditUsersQuery.isFetching}
          scroll={{ x: 1360 }}
          locale={{
            emptyText: lifecycleEventsQuery.isError
              ? "Could not load lifecycle events."
              : "No lifecycle events found.",
          }}
          pagination={false}
          style={{
            border: "1px solid #f0f0f0",
            borderRadius: 8,
            overflow: "hidden",
          }}
        />
      </Card>

      <Modal
        title="Edit article"
        open={isEditModalOpen}
        okText="Save"
        width={760}
        confirmLoading={updateArticleMutation.isPending}
        onOk={handleUpdateArticle}
        onCancel={closeEditModal}
        destroyOnHidden
      >
        <Form form={editForm} layout="vertical" requiredMark={false}>
          <Form.Item label="Category" name="categoryId">
            <Select<number>
              allowClear
              showSearch
              optionFilterProp="label"
              placeholder="Uncategorized"
              loading={categoriesQuery.isFetching}
              options={categoryOptions}
            />
          </Form.Item>

          <Form.Item
            label="Title"
            name="title"
            rules={[
              { required: true, message: "Title is required." },
              { whitespace: true, message: "Title is required." },
              {
                max: ContentFieldLimits.articleTitleMaxLength,
                message: `Title must be at most ${ContentFieldLimits.articleTitleMaxLength} characters.`,
              },
            ]}
          >
            <Input autoComplete="off" maxLength={ContentFieldLimits.articleTitleMaxLength} />
          </Form.Item>

          <Form.Item
            label="Summary"
            name="summary"
            rules={[
              {
                max: ContentFieldLimits.articleSummaryMaxLength,
                message: `Summary must be at most ${ContentFieldLimits.articleSummaryMaxLength} characters.`,
              },
            ]}
          >
            <Input.TextArea
              autoSize={{ minRows: 3, maxRows: 6 }}
              maxLength={ContentFieldLimits.articleSummaryMaxLength}
              showCount
            />
          </Form.Item>

          <Form.Item
            label="Body"
            name="body"
            rules={[
              { required: true, message: "Body is required." },
              { whitespace: true, message: "Body is required." },
            ]}
          >
            <Input.TextArea autoSize={{ minRows: 8, maxRows: 18 }} />
          </Form.Item>

          <Space size={12} style={{ width: "100%" }} align="start">
            <Form.Item label="Cover media ID" name="coverMediaId" style={{ flex: 1 }}>
              <InputNumber min={1} precision={0} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item label="Tags" name="tagIds" style={{ flex: 2 }}>
              <Select<number[]>
                allowClear
                mode="multiple"
                optionFilterProp="label"
                placeholder="Select tags"
                loading={tagsQuery.isFetching}
                options={tagOptions}
              />
            </Form.Item>
          </Space>

          <Form.Item
            label="Change summary"
            name="changeSummary"
            rules={[
              {
                max: ContentFieldLimits.changeSummaryMaxLength,
                message: `Change summary must be at most ${ContentFieldLimits.changeSummaryMaxLength} characters.`,
              },
            ]}
          >
            <Input.TextArea
              autoSize={{ minRows: 2, maxRows: 4 }}
              maxLength={ContentFieldLimits.changeSummaryMaxLength}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Unpublish article"
        open={isUnpublishModalOpen}
        okText="Unpublish"
        confirmLoading={unpublishArticleMutation.isPending}
        onOk={handleUnpublishArticle}
        onCancel={closeUnpublishModal}
        destroyOnHidden
      >
        <Form form={unpublishForm} layout="vertical" requiredMark={false}>
          <Form.Item
            label="Reason"
            name="reason"
            rules={[
              {
                max: ContentFieldLimits.lifecycleReasonMaxLength,
                message: `Reason must be at most ${ContentFieldLimits.lifecycleReasonMaxLength} characters.`,
              },
            ]}
          >
            <Input.TextArea
              autoSize={{ minRows: 3, maxRows: 6 }}
              maxLength={ContentFieldLimits.lifecycleReasonMaxLength}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
}
