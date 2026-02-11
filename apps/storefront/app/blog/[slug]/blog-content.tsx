"use client";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './blog-prose-styles.css';

interface BlogContentProps {
  content: string;
}

export function BlogContent({ content }: BlogContentProps) {
  return (
    <div className="blog-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ node, ...props }) => (
            <h2 className="blog-prose-h2" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="blog-prose-h3" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="blog-prose-p" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="blog-prose-ul" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="blog-prose-ol" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="blog-prose-li" {...props} />
          ),
          a: ({ node, href, ...props }) => (
            <a
              href={href}
              className="blog-prose-link"
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              {...props}
            />
          ),
          strong: ({ node, ...props }) => (
            <strong className="blog-prose-strong" {...props} />
          ),
          table: ({ node, ...props }) => (
            <div className="blog-prose-table-wrapper">
              <table className="blog-prose-table" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="blog-prose-thead" {...props} />
          ),
          tbody: ({ node, ...props }) => (
            <tbody className="blog-prose-tbody" {...props} />
          ),
          tr: ({ node, ...props }) => (
            <tr className="blog-prose-tr" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="blog-prose-th" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="blog-prose-td" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
