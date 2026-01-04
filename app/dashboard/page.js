import Image from 'next/image';

export default function DashboardPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
            <h1 className="text-2xl font-semibold">Welcome to Dashboard</h1>
                            {/* Placeholder shown; you can replace with `public/jerry.jpg` later if you prefer JPEG */}
                            <div className="rounded-xl overflow-hidden shadow-lg">
                                <Image src="/jerry.svg" alt="Jerry" width={240} height={240} />
                            </div>
        </main>
    );
}
