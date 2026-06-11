import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
    saveDecision,
    recordDeviceDecision,
    getRecentDecisions,
} from '@/lib/decisions';
import { getDeviceId } from '@/lib/device';

export default async function Home() {
    const deviceId = await getDeviceId();
    const recent = deviceId ? await getRecentDecisions(deviceId) : [];

    async function createDecision(formData: FormData) {
        'use server';
        const creator = formData.get('creator') as string;
        const prompt = formData.get('prompt') as string;
        const { id } = await saveDecision({ creator, prompt });

        const deviceId = await getDeviceId();
        if (deviceId) await recordDeviceDecision(deviceId, id);

        redirect(`/decision/${id}`);
    }
    return (
        <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center gap-6 py-32 px-16 bg-white dark:bg-black sm:items-start">
                <h1 className="text-2xl font-semibold">Start a decision</h1>
                <form
                    action={createDecision}
                    className="flex w-full flex-col gap-4"
                >
                    <label className="flex flex-col gap-1">
                        <span className="text-sm text-zinc-500">Your name</span>
                        <input
                            type="text"
                            name="creator"
                            required
                            className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
                        />
                    </label>
                    <label className="flex flex-col gap-1">
                        <span className="text-sm text-zinc-500">
                            What are we deciding?
                        </span>
                        <textarea
                            name="prompt"
                            required
                            rows={3}
                            placeholder="e.g. Where should we go for the team offsite?"
                            className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
                        />
                    </label>
                    <button
                        type="submit"
                        className="rounded bg-zinc-900 px-4 py-2 text-white dark:bg-white dark:text-black"
                    >
                        Create Decision
                    </button>
                </form>
                {recent.length > 0 && (
                    <section className="flex w-full flex-col gap-2">
                        <h2 className="text-sm font-semibold text-zinc-500">
                            Recent decisions
                        </h2>
                        <ul className="flex flex-col gap-1">
                            {recent.map((d) => (
                                <li key={d.id}>
                                    <Link
                                        href={`/decision/${d.id}`}
                                        className="flex items-center justify-between gap-3 rounded border border-zinc-200 px-3 py-2 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                                    >
                                        <span className="truncate">
                                            {d.prompt}
                                        </span>
                                        <span className="shrink-0 text-xs text-zinc-500">
                                            {d.revealed
                                                ? `Round ${d.round} · revealed`
                                                : `Round ${d.round}`}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </main>
        </div>
    );
}
