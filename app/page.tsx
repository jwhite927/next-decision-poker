import { redirect } from 'next/navigation';
import { saveDecision } from '@/lib/decisions';

export default function Home() {
    async function createDecision(formData: FormData) {
        'use server';
        const creator = formData.get('creator') as string;
        const prompt = formData.get('prompt') as string;
        const { id } = await saveDecision({ creator, prompt });
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
            </main>
        </div>
    );
}
