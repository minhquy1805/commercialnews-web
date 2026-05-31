import { PlusOutlined } from "@ant-design/icons";
import {
  App,
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  type TableProps,
  Typography,
} from "antd";
import { type CSSProperties, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";
import { createTablePagination } from "../../../shared/pagination";
import { getApiErrorDescription } from "../../../shared/api/apiError";
import {
  AuthorizationAuditUser,
  type AuthorizationAuditUsersById,
} from "../../authorization/components/AuthorizationAuditUser";
import { useAdminUsers } from "../../identity/hooks/useAdminUsers";
import {
  ArticleStatusColors,
  ArticleStatusLabels,
  ArticleStatusOptions,
  type ArticleStatus,
} from "../constants/articleStatuses";
import { ContentFieldLimits } from "../constants/contentFieldLimits";
import { useAdminArticles } from "../hooks/article/useAdminArticles";
import { useCreateAdminArticle } from "../hooks/article/useCreateAdminArticle";
import { useAdminCategories } from "../hooks/category/useAdminCategories";
import { useAdminTags } from "../hooks/tag/useAdminTags";
import type { AdminArticleListItem } from "../types/adminArticle.types";

type DeletedFilter = "visible" | "deleted" | "all";

type CreateArticleFormValues = {
  categoryId?: number | null;
  authorUserId: number;
  title: string;
  summary?: string;
  body: string;
  coverMediaId?: number | null;
  tagIds?: number[];
};

const wrappingTextStyle: CSSProperties = {
  display: "block",
  whiteSpace: "normal",
  overflowWrap: "anywhere",
  wordBreak: "break-word",
  lineHeight: 1.35,
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

function getIsDeletedFilterValue(filter: DeletedFilter) {
  if (filter === "all") {
    return undefined;
  }

  return filter === "deleted";
}

function getArticleColumns(
  categoriesById: Map<number, string>,
  usersById: AuthorizationAuditUsersById,
  isFetchingUsers: boolean,
): TableProps<AdminArticleListItem>["columns"] {
  return [
    {
      title: "Article",
      key: "article",
      fixed: "left",
      width: 380,
      render: (_, article) => (
        <div style={{ minWidth: 0, maxWidth: 330 }}>
          <Typography.Text strong style={wrappingTextStyle}>
            {article.title}
          </Typography.Text>
          <Typography.Text type="secondary" style={wrappingTextStyle}>
            {article.summary || "No summary"}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (status: ArticleStatus) => (
        <Tag color={ArticleStatusColors[status]}>
          {ArticleStatusLabels[status]}
        </Tag>
      ),
    },
    {
      title: "Category",
      dataIndex: "categoryId",
      key: "categoryId",
      width: 190,
      render: (categoryId: number | null) =>
        categoryId ? (
          <Tag color="blue">{categoriesById.get(categoryId) ?? `#${categoryId}`}</Tag>
        ) : (
          <Tag color="default">Uncategorized</Tag>
        ),
    },
    {
      title: "Author",
      dataIndex: "authorUserId",
      key: "authorUserId",
      width: 240,
      render: (userId: number) => (
        <AuthorizationAuditUser
          userId={userId}
          usersById={usersById}
          isFetchingUsers={isFetchingUsers}
          fallbackLabel={`User #${userId}`}
        />
      ),
    },
    {
      title: "Deleted",
      dataIndex: "isDeleted",
      key: "isDeleted",
      width: 120,
      render: (isDeleted: boolean) =>
        isDeleted ? (
          <Tag color="error">Deleted</Tag>
        ) : (
          <Tag color="success">Visible</Tag>
        ),
    },
    {
      title: "Cover media",
      dataIndex: "coverMediaId",
      key: "coverMediaId",
      width: 130,
      render: (coverMediaId: number | null) => coverMediaId ?? "N/A",
    },
    {
      title: "Version",
      dataIndex: "version",
      key: "version",
      width: 110,
    },
    {
      title: "Created at",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 190,
      render: formatDateTime,
    },
    {
      title: "Updated at",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 190,
      render: formatDateTime,
    },
    {
      title: "Published at",
      dataIndex: "publishedAt",
      key: "publishedAt",
      width: 190,
      render: formatDateTime,
    },
    {
      title: "Public ID",
      dataIndex: "articlePublicId",
      key: "articlePublicId",
      width: 260,
      render: (publicId: string) => (
        <Typography.Text style={wrappingTextStyle}>{publicId}</Typography.Text>
      ),
    },
  ];
}

export function ArticlesPage() {
  const navigate = useNavigate();
  const { notification } = App.useApp();
  const [createForm] = Form.useForm<CreateArticleFormValues>();
  const [keyword, setKeyword] = useState("");
  const [submittedKeyword, setSubmittedKeyword] = useState("");
  const [status, setStatus] = useState<ArticleStatus>();
  const [categoryId, setCategoryId] = useState<number>();
  const [authorUserId, setAuthorUserId] = useState<number>();
  const [deletedFilter, setDeletedFilter] = useState<DeletedFilter>("visible");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const articlesQuery = useAdminArticles({
    page,
    pageSize,
    keyword: submittedKeyword || null,
    status: status ?? null,
    categoryId,
    authorUserId,
    isDeleted: getIsDeletedFilterValue(deletedFilter),
  });
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
  const usersQuery = useAdminUsers({
    page: 1,
    pageSize: 100,
  });
  const createArticleMutation = useCreateAdminArticle();
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
  const userOptions = useMemo(
    () =>
      (usersQuery.data?.items ?? []).map((user) => ({
        label: `${user.fullName || user.email} (${user.email})`,
        value: user.userId,
      })),
    [usersQuery.data?.items],
  );
  const usersById = useMemo(
    () =>
      new Map(
        (usersQuery.data?.items ?? []).map((user) => [user.userId, user]),
      ),
    [usersQuery.data?.items],
  );
  const articleColumns = getArticleColumns(
    categoriesById,
    usersById,
    usersQuery.isFetching,
  );

  function openCreateModal() {
    createForm.setFieldsValue({
      categoryId: undefined,
      authorUserId: undefined,
      title: "",
      summary: "",
      body: "",
      coverMediaId: undefined,
      tagIds: [],
    });
    setIsCreateModalOpen(true);
  }

  function closeCreateModal() {
    setIsCreateModalOpen(false);
    createForm.resetFields();
  }

  async function handleCreateArticle() {
    const values = await createForm.validateFields();

    try {
      await createArticleMutation.mutateAsync({
        categoryId: values.categoryId ?? null,
        authorUserId: values.authorUserId,
        title: values.title.trim(),
        summary: values.summary?.trim() || null,
        body: values.body.trim(),
        coverMediaId: values.coverMediaId ?? null,
        tagIds: values.tagIds ?? [],
      });

      notification.success({
        title: "Article created",
        placement: "topRight",
      });
      setPage(1);
      closeCreateModal();
    } catch (error) {
      notification.error({
        title: "Could not create article.",
        description: getApiErrorDescription(error),
        placement: "topRight",
      });
    }
  }

  return (
    <section>
      <Typography.Title level={2} style={{ marginTop: 0 }}>
        News
      </Typography.Title>

      <Card style={{ marginTop: 24 }}>
        <div
          style={{
            alignItems: "flex-start",
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <Space size={12} wrap>
            <Input.Search
              allowClear
              placeholder="Search articles"
              value={keyword}
              onChange={(event) => {
                const nextKeyword = event.target.value;
                setKeyword(nextKeyword);

                if (!nextKeyword) {
                  setSubmittedKeyword("");
                  setPage(1);
                }
              }}
              onSearch={(value) => {
                setSubmittedKeyword(value.trim());
                setPage(1);
              }}
              style={{ width: 280 }}
            />

            <Select<ArticleStatus>
              allowClear
              placeholder="Status"
              value={status}
              onChange={(value) => {
                setStatus(value);
                setPage(1);
              }}
              options={[...ArticleStatusOptions]}
              style={{ width: 160 }}
            />

            <Select<number>
              allowClear
              showSearch
              optionFilterProp="label"
              placeholder="Category"
              value={categoryId}
              loading={categoriesQuery.isFetching}
              onChange={(value) => {
                setCategoryId(value);
                setPage(1);
              }}
              options={categoryOptions}
              style={{ width: 220 }}
            />

            <Select<number>
              allowClear
              showSearch
              optionFilterProp="label"
              placeholder="Author"
              value={authorUserId}
              loading={usersQuery.isFetching}
              onChange={(value) => {
                setAuthorUserId(value);
                setPage(1);
              }}
              options={userOptions}
              style={{ width: 240 }}
            />

            <Select<DeletedFilter>
              value={deletedFilter}
              onChange={(value) => {
                setDeletedFilter(value);
                setPage(1);
              }}
              options={[
                { label: "Visible", value: "visible" },
                { label: "Deleted", value: "deleted" },
                { label: "All records", value: "all" },
              ]}
              style={{ width: 160 }}
            />
          </Space>

          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
            Create article
          </Button>
        </div>

        <Table<AdminArticleListItem>
          bordered
          rowKey={(article) => String(article.articleId)}
          columns={articleColumns}
          dataSource={articlesQuery.data?.items ?? []}
          loading={articlesQuery.isFetching || usersQuery.isFetching}
          scroll={{ x: 2250 }}
          locale={{
            emptyText: articlesQuery.isError
              ? "Could not load articles."
              : "No articles found.",
          }}
          pagination={createTablePagination(
            articlesQuery.data,
            { page, pageSize },
            (nextPage, nextPageSize) => {
              setPage(nextPage);
              setPageSize(nextPageSize);
            },
            (total) => `${total} articles`,
          )}
          style={{
            border: "1px solid #f0f0f0",
            borderRadius: 8,
            overflow: "hidden",
          }}
          onRow={(article) => ({
            onClick: () =>
              navigate(`${ROUTES.CONTENT_NEWS}/${article.articleId}`, {
                state: { article },
              }),
            style: { cursor: "pointer" },
          })}
        />
      </Card>

      <Modal
        title="Create article"
        open={isCreateModalOpen}
        okText="Create"
        width={760}
        confirmLoading={createArticleMutation.isPending}
        onOk={handleCreateArticle}
        onCancel={closeCreateModal}
        forceRender
        destroyOnHidden
      >
        <Form form={createForm} layout="vertical" requiredMark={false}>
          <Space size={12} style={{ width: "100%" }} align="start">
            <Form.Item label="Category" name="categoryId" style={{ flex: 1 }}>
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
              label="Author"
              name="authorUserId"
              rules={[{ required: true, message: "Author is required." }]}
              style={{ flex: 1 }}
            >
              <Select<number>
                showSearch
                optionFilterProp="label"
                placeholder="Select author"
                loading={usersQuery.isFetching}
                options={userOptions}
              />
            </Form.Item>
          </Space>

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
        </Form>
      </Modal>
    </section>
  );
}
