export type RepoMetadata = {
  name: string;
  fullName: string;
  description: string | null;
  stars: number;
  forks: number;
  watchers: number;
  language: string | null;
  topics: string[];
  license: string | null;
  defaultBranch: string;
  isFork: boolean;
  isArchived: boolean;
  isTemplate: boolean;
  openIssues: number;
  sizeKB: number;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
};

export type PackageJson = {
  name?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  engines?: Record<string, string>;
};
