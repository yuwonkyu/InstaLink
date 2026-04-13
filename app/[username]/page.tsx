import { notFound } from "next/navigation";
import Profile from "@/components/Profile";
import { getTrainerProfile } from "@/data/mockData";

type PageProps = {
  params: Promise<{
    username: string;
  }>;
};

export default async function UsernamePage({ params }: PageProps) {
  const { username } = await params;
  const profile = getTrainerProfile(username);

  if (!profile) {
    notFound();
  }

  const showReviews = profile.options?.showReviews ?? true;
  const showLocation = profile.options?.showLocation ?? true;
  const showEditableFrame = profile.options?.showEditableFrame ?? true;
  const serviceFooterLabel = profile.options?.serviceFooterLabel ?? false;
  const ctaLabel = profile.options?.customCTA ?? profile.ctaLabel;
  const highlightColor = profile.options?.highlightColor ?? "#FEE500";
  const isDarkTheme = profile.options?.theme === "dark";

  return (
    <main
      className={`flex min-h-screen w-full flex-col items-center px-4 py-6 sm:px-6 ${isDarkTheme ? "theme-dark bg-[#121212]" : "bg-(--secondary)"}`}
    >
      <div className="w-full max-w-md">
      <div className="rounded-2xl bg-(--card) p-2 shadow-[0_4px_20px_rgba(17,24,39,0.06)] backdrop-blur-sm">
        <Profile
          brandName={profile.brandName}
          name={profile.name}
          role={profile.role}
          intro={profile.intro}
          location={profile.location}
          availability={profile.availability}
          ctaLabel={ctaLabel}
          ctaBackgroundColor={highlightColor}
          showReviews={showReviews}
          showLocation={showLocation}
          showEditableFrame={showEditableFrame}
          serviceFooterLabel={serviceFooterLabel}
          instagramUrl={profile.instagramUrl}
          instagramHandle={profile.instagramHandle}
          imageSrc={profile.imageSrc}
          services={profile.services}
          reviews={profile.reviews}
        />
      </div>
      </div>
    </main>
  );
}
