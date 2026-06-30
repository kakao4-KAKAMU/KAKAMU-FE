import type { TFunction } from 'i18next';
import { API_ERROR_CODES } from '@kakamu/types';

import { parseApiError } from '@/lib/auth/parse-api-error';

type ErrorView = {
  title: string;
  description: string;
};

export function mapCommentCreateError(error: unknown, t: TFunction): ErrorView {
  const fallback = t('shared.feedDetail.error.createComment.description');
  let title = t('shared.feedDetail.error.createComment.title');
  const { message, code } = parseApiError(error, fallback);

  switch (code) {
    case API_ERROR_CODES.POST_NOT_FOUND:
      title = t('account.post.like.error.notFound.title');
      return {
        title,
        description: t('account.post.like.error.notFound.description'),
      };
    default:
      break;
  }

  return { title, description: message };
}

export function mapCommentUpdateError(error: unknown, t: TFunction): ErrorView {
  const fallback = t('shared.feedDetail.error.updateComment.description');
  let title = t('shared.feedDetail.error.updateComment.title');
  let { message, code } = parseApiError(error, fallback);

  switch (code) {
    case API_ERROR_CODES.FORBIDDEN_COMMENT_UPDATE:
    case API_ERROR_CODES.COMMENT_NOT_FOUND:
      message = t('shared.feedDetail.error.updateComment.description');
      break;
    default:
      break;
  }

  return { title, description: message };
}

export function mapCommentDeleteError(error: unknown, t: TFunction): ErrorView {
  const fallback = t('shared.feedDetail.error.deleteComment.description');
  let title = t('shared.feedDetail.error.deleteComment.title');
  let { message, code } = parseApiError(error, fallback);

  switch (code) {
    case API_ERROR_CODES.FORBIDDEN_COMMENT_DELETE:
    case API_ERROR_CODES.COMMENT_NOT_FOUND:
      message = t('shared.feedDetail.error.deleteComment.description');
      break;
    default:
      break;
  }

  return { title, description: message };
}

export function mapCommentLikeError(error: unknown, t: TFunction): ErrorView {
  const fallback = t('shared.feedDetail.error.commentLike.description');
  const title = t('shared.feedDetail.error.commentLike.title');
  const { message } = parseApiError(error, fallback);
  return { title, description: message };
}

export function mapCommentSpoilerError(error: unknown, t: TFunction): ErrorView {
  const fallback = t('shared.feedDetail.error.spoiler.description');
  const title = t('shared.feedDetail.error.spoiler.title');
  const { message } = parseApiError(error, fallback);
  return { title, description: message };
}

export function mapCommentListError(error: unknown, t: TFunction): ErrorView {
  const fallback = t('shared.feedDetail.error.loadComments.description');
  const title = t('shared.feedDetail.error.loadComments.title');
  const { message } = parseApiError(error, fallback);
  return { title, description: message };
}
