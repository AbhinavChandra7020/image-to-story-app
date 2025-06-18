// app/caption-test/page.tsx

import CaptionTester from "@/app/_components/CaptionTester";

export default function Page() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Caption Generator Test</h1>
      <CaptionTester />
    </main>
  );
}
