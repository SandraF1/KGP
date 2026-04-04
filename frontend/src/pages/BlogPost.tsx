import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import fm from "front-matter";
import Layout from "../layout/Layout";

// Load markdown files relative to this file
const posts = import.meta.glob("../blog/**/*.md", { as: "raw" });

console.log("POST KEYS:", Object.keys(posts));

interface BlogMeta {
  title: string;
  date: string;
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [content, setContent] = useState("");
  const [meta, setMeta] = useState<BlogMeta>({ title: "", date: "" });

  useEffect(() => {
    if (!slug) return;

    // Find the markdown file whose filename ends with `${slug}.md`
    const entry = Object.entries(posts).find(([path]) =>
      path.endsWith(`${slug}.md`)
    );

    if (!entry) {
      setMeta({ title: "Post not found", date: "" });
      setContent("Post not found.");
      return;
    }

    // TypeScript: tell it what loader returns
    const loader = entry[1] as () => Promise<string>;

    loader().then((raw) => {
      const parsed = fm<{ title?: string; date?: string | Date }>(raw);

      const title = parsed.attributes.title ?? slug;

      // Normalize date to a safe string
      const rawDate = parsed.attributes.date;
      const date =
        rawDate instanceof Date
          ? rawDate.toISOString().slice(0, 10)
          : typeof rawDate === "string"
          ? rawDate
          : "";

      setMeta({ title, date });
      setContent(parsed.body);
    });
  }, [slug]);

  return (
    <Layout>
      <h1>{meta.title}</h1>

      {meta.date && (
        <p>
          <em>{meta.date}</em>
        </p>
      )}

      <ReactMarkdown>{content}</ReactMarkdown>
    </Layout>
  );
}
