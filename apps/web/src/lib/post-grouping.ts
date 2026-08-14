import type { PostMeta } from '@/types/post';

export const GROUP_KEYS = ['none', 'category', 'tags', 'series'] as const;

export type GroupKey = (typeof GROUP_KEYS)[number];

/** 'none'을 제외한, 실제로 게시글을 묶는 기준. */
export type GroupableKey = Exclude<GroupKey, 'none'>;

export const GROUPABLE_KEYS: readonly GroupableKey[] = ['category', 'tags', 'series'];

export const GROUP_LABELS: Record<GroupKey, string> = {
  none: '최신순',
  category: '카테고리',
  tags: '태그',
  series: '시리즈',
};

/** 해당 기준 값이 없는 글을 모아두는 그룹의 이름. */
const FALLBACK_LABELS: Record<GroupableKey, string> = {
  category: '미분류',
  tags: '태그 없음',
  series: '단독 글',
};

export interface PostGroup {
  /** DOM key 및 앵커로 쓰는 안정적인 식별자. */
  key: string;
  label: string;
  posts: PostMeta[];
  /** 기준 값이 없는 글을 모은 그룹인지 여부. 항상 마지막에 배치된다. */
  isFallback: boolean;
}

/** 한 글이 속하는 그룹 라벨 목록. tags는 다중 소속이 가능하다. */
const labelsOf = (post: PostMeta, key: GroupableKey): string[] => {
  if (key === 'category') return post.category ? [post.category] : [];
  if (key === 'tags') return post.tags?.filter(Boolean) ?? [];
  return post.series ? [post.series] : [];
};

/** 시리즈는 연재 순서(오름차순), 나머지는 넘겨받은 순서(최신순)를 유지한다. */
const sortWithinGroup = (posts: PostMeta[], key: GroupableKey): PostMeta[] => {
  if (key !== 'series') return posts;
  return [...posts].sort(
    (a, b) =>
      (a.seriesOrder ?? Number.MAX_SAFE_INTEGER) - (b.seriesOrder ?? Number.MAX_SAFE_INTEGER)
  );
};

export const isGroupKey = (value: unknown): value is GroupKey =>
  typeof value === 'string' && (GROUP_KEYS as readonly string[]).includes(value);

/** 잘못된/없는 searchParam은 조용히 기본값('none')으로 떨어뜨린다. */
export const parseGroupKey = (value: string | string[] | undefined): GroupKey =>
  isGroupKey(value) ? value : 'none';

/** 글이 하나도 없는 기준은 선택지에서 제외해, 빈 화면이 나오지 않게 한다. */
export const getAvailableGroupKeys = (posts: PostMeta[]): GroupKey[] => [
  'none',
  ...GROUPABLE_KEYS.filter((key) => posts.some((post) => labelsOf(post, key).length > 0)),
];

export const groupPosts = (posts: PostMeta[], key: GroupKey): PostGroup[] => {
  if (key === 'none') {
    return [{ key: 'all', label: GROUP_LABELS.none, posts, isFallback: false }];
  }

  const buckets = new Map<string, PostMeta[]>();
  const fallback: PostMeta[] = [];

  for (const post of posts) {
    const labels = labelsOf(post, key);
    if (labels.length === 0) {
      fallback.push(post);
      continue;
    }
    for (const label of labels) {
      const bucket = buckets.get(label);
      if (bucket) bucket.push(post);
      else buckets.set(label, [post]);
    }
  }

  const groups: PostGroup[] = [...buckets.entries()]
    .sort(([a], [b]) => a.localeCompare(b, 'ko'))
    .map(([label, bucket]) => ({
      key: `${key}-${label}`,
      label,
      posts: sortWithinGroup(bucket, key),
      isFallback: false,
    }));

  if (fallback.length > 0) {
    groups.push({
      key: `${key}-fallback`,
      label: FALLBACK_LABELS[key],
      posts: fallback,
      isFallback: true,
    });
  }

  return groups;
};
