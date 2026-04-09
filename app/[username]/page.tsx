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

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 py-6 sm:px-6">
      <div className="rounded-2xl bg-(--card) p-2 shadow-[0_4px_20px_rgba(17,24,39,0.06)] backdrop-blur-sm">
        <Profile
          brandName={profile.brandName}
          name={profile.name}
          role={profile.role}
          intro={profile.intro}
          location={profile.location}
          availability={profile.availability}
          ctaLabel={profile.ctaLabel}
          instagramUrl={profile.instagramUrl}
          instagramHandle={profile.instagramHandle}
          imageSrc={profile.imageSrc}
          services={profile.services}
          reviews={profile.reviews}
        />
      </div>
    </main>
  );
}
