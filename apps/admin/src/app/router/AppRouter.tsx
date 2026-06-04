import { Navigate, Route, Routes } from "react-router-dom";
import { AdminLayout } from "../layouts/AdminLayout";
import { DashboardPage } from "../../features/dashboard/pages/DashboardPage";
import { LoginPage } from "../../features/auth/pages/LoginPage";
import { ProtectedRoute } from "../../shared/components/ProtectedRoute";
import { PublicOnlyRoute } from "../../shared/components/PublicOnlyRoute";
import { ROUTES } from "../../shared/constants/routes";
import { MyProfilePage } from "../../features/auth/pages/MyProfilePage";
import { PermissionDetailPage } from "../../features/authorization/pages/PermissionDetailPage";
import { PermissionsPage } from "../../features/authorization/pages/PermissionsPage";
import { RoleDetailPage } from "../../features/authorization/pages/RoleDetailPage";
import { RolesPage } from "../../features/authorization/pages/RolesPage";
import { ArticleDetailPage } from "../../features/content/pages/ArticleDetailPage";
import { ArticlesPage } from "../../features/content/pages/ArticlesPage";
import { CategoriesPage } from "../../features/content/pages/CategoriesPage";
import { CategoryDetailPage } from "../../features/content/pages/CategoryDetailPage";
import { TagDetailPage } from "../../features/content/pages/TagDetailPage";
import { TagsPage } from "../../features/content/pages/TagsPage";
import { UserDetailPage } from "../../features/identity/pages/UserDetailPage";
import { UsersPage } from "../../features/identity/pages/UsersPage";
import { ArticleMediaPage } from "../../features/media/pages/ArticleMediaPage";
import { MediaAssetDetailPage } from "../../features/media/pages/MediaAssetDetailPage";
import { MediaAssetsPage } from "../../features/media/pages/MediaAssetsPage";
import { ArticleSeoSettingsPage } from "../../features/seo/pages/ArticleSeoSettingsPage";
import { SeoMetadataDetailPage } from "../../features/seo/pages/SeoMetadataDetailPage";
import { SeoMetadataPage } from "../../features/seo/pages/SeoMetadataPage";
import { SlugRouteDetailPage } from "../../features/seo/pages/SlugRouteDetailPage";
import { SlugRoutesPage } from "../../features/seo/pages/SlugRoutesPage";
import { InteractionArticleStatsPage } from "../../features/interaction/pages/InteractionArticleStatsPage";
import { InteractionCommentDetailPage } from "../../features/interaction/pages/InteractionCommentDetailPage";
import { InteractionCommentsPage } from "../../features/interaction/pages/InteractionCommentsPage";
import { InteractionModerationCaseDetailPage } from "../../features/interaction/pages/InteractionModerationCaseDetailPage";
import { InteractionModerationCasesPage } from "../../features/interaction/pages/InteractionModerationCasesPage";
import { AuditDashboardPage } from "../../features/audit/pages/AuditDashboardPage";
import { AuditIngestionDetailPage } from "../../features/audit/pages/AuditIngestionDetailPage";
import { AuditIngestionsPage } from "../../features/audit/pages/AuditIngestionsPage";
import { AuditLogDetailPage } from "../../features/audit/pages/AuditLogDetailPage";
import { AuditLogsPage } from "../../features/audit/pages/AuditLogsPage";

export function AppRouter() {
  return (
    <Routes>
      <Route
        path={ROUTES.ROOT}
        element={<Navigate to={ROUTES.DASHBOARD} replace />}
      />

      <Route
        path={ROUTES.LOGIN}
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
        <Route path={ROUTES.PROFILE} element={<MyProfilePage />} />
        <Route path={ROUTES.IDENTITY_USERS} element={<UsersPage />} />
        <Route
          path={ROUTES.IDENTITY_USER_DETAIL}
          element={<UserDetailPage />}
        />
        <Route path={ROUTES.AUTHORIZATION_ROLES} element={<RolesPage />} />
        <Route
          path={ROUTES.AUTHORIZATION_ROLE_DETAIL}
          element={<RoleDetailPage />}
        />
        <Route
          path={ROUTES.AUTHORIZATION_PERMISSIONS}
          element={<PermissionsPage />}
        />
        <Route
          path={ROUTES.AUTHORIZATION_PERMISSION_DETAIL}
          element={<PermissionDetailPage />}
        />
        <Route path={ROUTES.CONTENT_NEWS} element={<ArticlesPage />} />
        <Route
          path={ROUTES.CONTENT_NEWS_DETAIL}
          element={<ArticleDetailPage />}
        />
        <Route path={ROUTES.CONTENT_CATEGORIES} element={<CategoriesPage />} />
        <Route
          path={ROUTES.CONTENT_CATEGORY_DETAIL}
          element={<CategoryDetailPage />}
        />
        <Route path={ROUTES.CONTENT_TAGS} element={<TagsPage />} />
        <Route path={ROUTES.CONTENT_TAG_DETAIL} element={<TagDetailPage />} />
        <Route
          path={ROUTES.MEDIA}
          element={<Navigate to={ROUTES.MEDIA_ASSETS} replace />}
        />
        <Route path={ROUTES.MEDIA_ASSETS} element={<MediaAssetsPage />} />
        <Route
          path={ROUTES.MEDIA_ASSET_DETAIL}
          element={<MediaAssetDetailPage />}
        />
        <Route
          path={ROUTES.MEDIA_ARTICLE_ATTACHMENTS}
          element={<ArticleMediaPage />}
        />
        <Route
          path={ROUTES.SEO}
          element={<Navigate to={ROUTES.SEO_METADATA} replace />}
        />
        <Route path={ROUTES.SEO_METADATA} element={<SeoMetadataPage />} />
        <Route
          path={ROUTES.SEO_METADATA_DETAIL}
          element={<SeoMetadataDetailPage />}
        />
        <Route path={ROUTES.SEO_SLUG_ROUTES} element={<SlugRoutesPage />} />
        <Route
          path={ROUTES.SEO_SLUG_ROUTE_DETAIL}
          element={<SlugRouteDetailPage />}
        />
        <Route
          path={ROUTES.SEO_ARTICLE_SETTINGS}
          element={<ArticleSeoSettingsPage />}
        />
        <Route
          path={ROUTES.INTERACTION}
          element={<Navigate to={ROUTES.INTERACTION_COMMENTS} replace />}
        />
        <Route
          path={ROUTES.INTERACTION_COMMENTS}
          element={<InteractionCommentsPage />}
        />
        <Route
          path={ROUTES.INTERACTION_COMMENT_DETAIL}
          element={<InteractionCommentDetailPage />}
        />
        <Route
          path={ROUTES.INTERACTION_MODERATION_CASES}
          element={<InteractionModerationCasesPage />}
        />
        <Route
          path={ROUTES.INTERACTION_MODERATION_CASE_DETAIL}
          element={<InteractionModerationCaseDetailPage />}
        />
        <Route
          path={ROUTES.INTERACTION_ARTICLE_STATS}
          element={<InteractionArticleStatsPage />}
        />
        <Route
          path={ROUTES.AUDIT}
          element={<Navigate to={ROUTES.AUDIT_DASHBOARD} replace />}
        />
        <Route path={ROUTES.AUDIT_DASHBOARD} element={<AuditDashboardPage />} />
        <Route path={ROUTES.AUDIT_LOGS} element={<AuditLogsPage />} />
        <Route
          path={ROUTES.AUDIT_LOG_DETAIL}
          element={<AuditLogDetailPage />}
        />
        <Route path={ROUTES.AUDIT_INGESTIONS} element={<AuditIngestionsPage />} />
        <Route
          path={ROUTES.AUDIT_INGESTION_DETAIL}
          element={<AuditIngestionDetailPage />}
        />
      </Route>
    </Routes>
  );
}
