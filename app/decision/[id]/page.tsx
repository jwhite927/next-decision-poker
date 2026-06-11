import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { getDecision, getOpinions, saveOpinion } from '@/lib/decisions';
import { CopyLinkButton } from './CopyLinkButton';

export default async function DecisionPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const decision = await getDecision(id);

    if (!decision) notFound();

    const opinions = await getOpinions(id);
    const h = await headers();
    const host = h.get('host')!;
    const protocol = h.get('x-forwarded-proto') ?? 'http';
    const shareUrl = `${protocol}://${host}/decision/${id}`;

    async function addOpinion(formData: FormData) {
        'use server';
        const author = formData.get('author') as string;
        const opinion = formData.get('opinion') as string;

        await saveOpinion({ decisionId: id, author, opinion });
        revalidatePath(`/decision/${id}`);
    }

    return (
        <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex w-full max-w-3xl flex-col gap-8 py-24 px-16">
                <header className="flex flex-col gap-1">
                    <span className="text-sm text-zinc-500">
                        Started by {decision.creator}
                    </span>
                    <h1 className="text-2xl font-semibold">
                        {decision.prompt}
                    </h1>
                    <div className="flex flex-col gap-2 border border-zinc-300 rounded px-4 py-2">
                        Share this URL to invite others:
                        <div className="flex gap-2 items-center">
                        <a
                            href={shareUrl}
                            className="font-mono text-xs break-all underline"
                        >
                            {shareUrl}
                        </a>
                        <CopyLinkButton url={shareUrl} />
                        </div>
                    </div>
                </header>
                <form action={addOpinion} className="flex flex-col gap-3">
                    <input
                        type="text"
                        name="author"
                        required
                        placeholder="Your name"
                        className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
                    />
                    <textarea
                        name="opinion"
                        required
                        rows={3}
                        placeholder="Your opinion..."
                        className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
                    />
                    <button
                        type="submit"
                        className="rounded bg-zinc-900 px-4 py-2 text-white dark:bg-white dark:text-black"
                    >
                        Submit opinion
                    </button>
                </form>
                <p className="text-sm text-zinc-500">
                    {opinions.length} opinion{opinions.length === 1 ? '' : 's'}{' '}
                    submitted
                </p>
            </main>
        </div>
    );
}
