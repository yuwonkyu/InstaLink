export default function ProfileLoading() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-(--secondary) px-4 py-6 sm:px-6">
      <div className="w-full max-w-md animate-pulse">
        <div className="rounded-2xl bg-(--card) p-2 shadow-[0_4px_20px_rgba(17,24,39,0.06)]">
          <div className="rounded-xl p-6 sm:p-8">

            {/* 프로필 헤더 */}
            <div className="flex items-center gap-4">
              <div className="h-18 w-18 shrink-0 rounded-full bg-black/8 sm:h-20 sm:w-20" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 w-20 rounded-full bg-black/8" />
                <div className="h-5 w-36 rounded-full bg-black/8" />
                <div className="h-3 w-28 rounded-full bg-black/5" />
              </div>
            </div>

            {/* 소개 */}
            <div className="mt-5 space-y-2 rounded-xl bg-black/[0.035] px-4 py-3.5">
              <div className="h-3 w-full rounded-full bg-black/8" />
              <div className="h-3 w-5/6 rounded-full bg-black/8" />
              <div className="h-3 w-4/6 rounded-full bg-black/8" />
            </div>

            {/* CTA 버튼 */}
            <div className="mt-5 flex flex-col gap-2">
              <div className="h-12 w-full rounded-xl bg-black/8" />
              <div className="h-12 w-full rounded-xl bg-black/5" />
            </div>

            {/* 구분선 */}
            <div className="my-6 h-px bg-black/20" />

            {/* 갤러리 */}
            <div className="mb-3 h-3 w-24 rounded-full bg-black/8" />
            <div className="grid grid-cols-3 gap-1.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="aspect-square rounded-xl bg-black/8" />
              ))}
            </div>

            {/* 구분선 */}
            <div className="my-6 h-px bg-black/20" />

            {/* 서비스 */}
            <div className="mb-3 h-3 w-20 rounded-full bg-black/8" />
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex justify-between rounded-xl bg-black/[0.035] px-4 py-3">
                  <div className="h-3.5 w-28 rounded-full bg-black/8" />
                  <div className="h-3.5 w-16 rounded-full bg-black/8" />
                </div>
              ))}
            </div>

            {/* 구분선 */}
            <div className="my-6 h-px bg-black/20" />

            {/* 후기 */}
            <div className="mb-3 h-3 w-16 rounded-full bg-black/8" />
            <div className="space-y-2">
              {[0, 1].map((i) => (
                <div key={i} className="rounded-xl bg-black/[0.035] px-4 py-4 space-y-2">
                  <div className="h-3 w-full rounded-full bg-black/8" />
                  <div className="h-3 w-4/5 rounded-full bg-black/8" />
                  <div className="h-2.5 w-24 rounded-full bg-black/5" />
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
