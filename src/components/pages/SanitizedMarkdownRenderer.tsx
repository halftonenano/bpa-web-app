import '@/components/pages/markdown.css';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

export default function SanitizedMarkdownRenderer({
  content,
}: {
  content: string;
}) {
  return (
    <div
      className="markdown-content"
      dangerouslySetInnerHTML={{
        __html: sanitizeHtml(marked.parse(content.replace(/(\\n)/g, '\n'))),
      }}
    ></div>
  );
}
