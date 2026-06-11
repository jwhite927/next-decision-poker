'use client';

import { useState } from 'react';

export function CopyLinkButton({ url }: { url: string }) {
    const [copied, setCopied] = useState(false);

    async function copy() {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <button
            type="button"
            onClick={copy}
            className="rounded border border-zinc-300 px-2 py-1 dark:border-zinc-700"
        >
            {copied ? 'Copied!' : '⧉'}
        </button>
    );
}
