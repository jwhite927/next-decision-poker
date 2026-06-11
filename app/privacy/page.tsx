import Link from 'next/link';

export default function PrivacyPage() {
    return (
        <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex w-full max-w-3xl flex-col gap-6 py-24 px-16">
                <Link
                    href="/"
                    className="text-sm text-zinc-800 dark:text-zinc-300"
                >
                    {'<- Home'}
                </Link>

                <header className="flex flex-col gap-1">
                    <h1 className="text-2xl font-semibold">Privacy</h1>
                    <p className="text-sm text-zinc-500">
                        Plain-language summary of what this app stores and why.
                    </p>
                </header>

                <section className="flex flex-col gap-2">
                    <h2 className="font-semibold">What we store</h2>
                    <ul className="flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400 list-disc pl-5">
                        <li>
                            <strong>Decisions</strong> — the question you pose and
                            the name you enter as its creator.
                        </li>
                        <li>
                            <strong>Opinions</strong> — the text and name each
                            participant submits to a decision.
                        </li>
                        <li>
                            <strong>Device memory (optional)</strong> — only if
                            you choose &ldquo;Remember my decisions,&rdquo; a
                            random id linking this browser to the decisions you
                            create or open.
                        </li>
                    </ul>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Anything you type into a decision or opinion is visible to
                        anyone who has its share link. Don&apos;t put sensitive
                        information in it.
                    </p>
                </section>

                <section className="flex flex-col gap-2">
                    <h2 className="font-semibold">The device cookie</h2>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        We do not store anything on your device by default. If you
                        opt in, we set a single first-party cookie named{' '}
                        <code className="font-mono">device_id</code> holding a
                        random identifier. It lasts up to one year, is not shared
                        with third parties, and is used only to show you your own
                        recent decisions. It is not used for advertising,
                        analytics, or cross-site tracking.
                    </p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        You can withdraw consent at any time with{' '}
                        <strong>Forget on this device</strong> on the home page,
                        which deletes the device-to-decision links and clears the
                        cookie. (The decisions and opinions themselves remain, as
                        others may still be using them.)
                    </p>
                </section>

                <section className="flex flex-col gap-2">
                    <h2 className="font-semibold">Where it lives</h2>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Data is stored in our database provider (Supabase), which
                        processes it solely to run this app. We don&apos;t sell
                        data or share it with advertisers.
                    </p>
                </section>
            </main>
        </div>
    );
}
