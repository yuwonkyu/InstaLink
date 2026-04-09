import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Menu from "@/components/Menu";
import Profile from "@/components/Profile";
import Reservation from "@/components/Reservation";
import { getTrainerProfile } from "@/data/mockData";

type PageProps = {
  params: Promise<{
    username: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const profile = getTrainerProfile(username);

  if (!profile) {
    return {
      title: "프로필을 찾을 수 없습니다 | SaveMe PT",
    };
  }

  return {
    title: `${profile.name} | SaveMe PT`,
    description: profile.intro,
  };
}

export default async function UsernamePage({ params }: PageProps) {
  const { username } = await params;
  const profile = getTrainerProfile(username);

  if (!profile) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 py-6 sm:px-6">
      <div className="rounded-[2.25rem] border border-white/55 bg-white/45 p-3 shadow-[0_30px_80px_rgba(92,61,34,0.12)] backdrop-blur-xl">
        <Profile
          initials={profile.initials}
          name={profile.name}
          role={profile.role}
          intro={profile.intro}
          location={profile.location}
          availability={profile.availability}
          responseTime={profile.responseTime}
          highlightTags={profile.highlightTags}
        />
        <Menu links={profile.menuLinks} />
        <Reservation items={profile.reservations} />
        <Footer
          instagramHandle={profile.instagramHandle}
          footerNote={profile.footerNote}
        />
      </div>
    </main>
  );
}