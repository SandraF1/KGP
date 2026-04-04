import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import matter from "gray-matter";
import React from "react";


interface BlogMeta {
  title: string;
  date: string;
}

export default function BlogPost() {
  const { slug } = useParams();
  const [content, setContent] = useState("");
  const [meta, setMeta] = useState<BlogMeta>({
    title: "",
    date: "",
  });

  useEffect(() => {
    fetch(`/src/blog/${slug}.md`)
      .then((res) => res.text())
      .then((text) => {
        const { content, data } = matter(text);

        setContent(content);

        // FIX: safely map unknown data into your typed metadata
        setMeta({
          title: data.title ?? "Untitled Post",
          date: data.date ?? "",
        });
      });
  }, [slug]);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{meta.title}</h1>
      <p>
        <em>{meta.date}</em>
      </p>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
