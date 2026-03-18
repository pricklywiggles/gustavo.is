import { defineConfig, defineCollection, s } from "velite";

const blogPosts = defineCollection({
  name: "BlogPost",
  pattern: "blog/**/*.mdx",
  schema: s
    .object({
      title: s.string().max(120),
      slug: s.slug("blog"),
      date: s.isodate(),
      description: s.string().max(300),
      tags: s.array(s.string()).default([]),
      published: s.boolean().default(false),
      code: s.mdx(),
    })
    .transform((data) => ({
      ...data,
      permalink: `/blog/${data.slug}`,
    })),
});

const projects = defineCollection({
  name: "Project",
  pattern: "projects/**/*.mdx",
  schema: s
    .object({
      title: s.string().max(120),
      slug: s.slug("project"),
      company: s.string(),
      role: s.string(),
      period: s.string(),
      stack: s.array(s.string()).default([]),
      description: s.string().max(300),
      published: s.boolean().default(false),
      code: s.mdx(),
    })
    .transform((data) => ({
      ...data,
      permalink: `/work/${data.slug}`,
    })),
});

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: {
    blogPosts,
    projects,
  },
});
