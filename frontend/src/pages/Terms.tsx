import React from "react";
import Layout from "../layout/Layout";

export default function Terms() {
  return (
    <Layout>
      <h1>Terms & Conditions</h1>

      <p>
        This site and its code are licensed under{" "}
        <a
          href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
          target="_blank"
          rel="noopener noreferrer"
        >
          CC BY-NC-SA 4.0
        </a>
        .
      </p>

      <p>
        You may use and adapt the content for personal study, classroom use, or
        other educational purposes. Please credit “The Koine Greek Project” and
        link to this site. You may not sell the original or adapted content, and
        any adaptations must be shared under the same licence.
      </p>

      <p>By using this site, you agree to these terms.</p>
    </Layout>
  );
}
