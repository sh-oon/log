export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  published: boolean;
  tags?: string[];
  series?: string;
  seriesOrder?: number;
}

export interface PostMeta {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  published: boolean;
  tags?: string[];
  series?: string;
  seriesOrder?: number;
}
