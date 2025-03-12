export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  thumbnailUrl?: string;
  authorId?: string;
  // author: Applicatio;
  isPublished: boolean;
  categoryId: number;
  // category: BlogCategory;
  // tags: BlogTagDTO[];
}
