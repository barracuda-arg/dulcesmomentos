import DOMPurify from 'dompurify';
import parse from 'html-react-parser';

interface Props {
    html: string;
    className?: string;
}

export function SafeHtml({ html, className }: Props) {
    // 1. Sanitizamos el HTML (esto elimina <script>, onmouseover, etc.)
    const cleanHtml = DOMPurify.sanitize(html);

    // 2. Parseamos a componentes de React
    return (
        <div className={`prose prose-pink max-w-none ${className}`}>
            {parse(cleanHtml)}
        </div>
    );
}