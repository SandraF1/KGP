import { Link } from "react-router-dom";
import React from "react";
import Layout from "../layout/Layout";

export default function Blog() {
  return (
    <Layout>
      <h1>Blog</h1>
      <p>Welcome to the Koine Greek Project blog.</p>

      <h2>Recent Posts</h2>

      <ul>
        <li>
          <Link to="/blog/2026-04-04-01-Welcome">Welcome</Link>
        </li>
      </ul>
    </Layout>
  );
}
