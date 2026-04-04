import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import fm from "front-matter";

type BlogPostMeta = {
  slug: string;
  title: string;
  date?: string;
};

export default function Blog() {
  const [posts, setPosts] = useState<BlogPostMeta[]>([]);

  useEffect(() => {
    const modules = import.meta.glob("../blog/**/*.md", { as: "raw" });

    const loadPosts = async () => {
      const loadedPosts: BlogPostMeta[] = [];

      for (const path in modules) {
        const loader = modules[path] as () => Promise<string>;
        const raw = await loader();

        const parsed = fm<{ title?: string; date?: string }>(raw);

        const slug = path.split("/").pop()!.replace(".md", "");

        loadedPosts.push({
          slug,
          title: parsed.attributes.title ?? slug,
          date: parsed.attributes.date,
        });
      }

      // Safely sort: only use localeCompare if both dates are strings
      loadedPosts.sort((a, b) => {
        if (typeof a.date === "string" && typeof b.date === "string") {
          return b.date.localeCompare(a.date); // newest first
        }
        return 0; // leave unsorted if no valid date
      });

      setPosts(loadedPosts);
    };

    loadPosts();
  }, []);

  return (
    <Layout>
      <h1>Blog</h1>
      <p>Welcome to the Koine Greek Project blog.</p>

      <h2>Recent Posts</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link to={`/blog/${post.slug}`}>
              {post.title} {post.date && `(${post.date})`}
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
}