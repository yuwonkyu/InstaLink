export type ServiceItem = {
  name: string;
  price: string;
};

export type ReviewItem = {
  author: string;
  content: string;
};

export type TrainerProfile = {
  username: string;
  name: string;
  brandName: string;
  role: string;
  intro: string;
  location: string;
  availability: string;
  ctaLabel: string;
  instagramUrl: string;
  imageSrc: string;
  services: ServiceItem[];
  instagramHandle: string;
  reviews: ReviewItem[];
};

export const trainerProfiles: Record<string, TrainerProfile> = {
  sample: {
    username: "sample",
    name: "Trainer 뀨",
    brandName: "Sample gym",
    role: "체형교정 · 다이어트 · 1:1 PT",
    intro:
      "기초 체력부터 바디라인까지, 꾸준히 이어갈 수 있는 맞춤형 퍼스널 트레이닝을 제공합니다.",
    location: "서울",
    availability: "평일 06~22시",
    ctaLabel: "카톡으로 상담 예약하기",
    instagramUrl: "https://instagram.com/kku._.ui",
    imageSrc: "/pt_trainer.png",
    services: [
      {
        name: "PT 1회",
        price: "50,000원",
      },
      {
        name: "PT 10회",
        price: "450,000원",
      },
    ],
    reviews: [
      {
        author: "30대 여성 회원",
        content:
          "운동이 처음이었는데 자세를 정말 꼼꼼하게 봐주셔서 부담 없이 시작할 수 있었어요.",
      },
      {
        author: "직장인 회원",
        content:
          "퇴근 후에도 일정 조율이 편했고, 짧은 기간에도 몸이 가벼워진 게 느껴졌습니다.",
      },
      {
        author: "20대 회원",
        content:
          "식단이랑 루틴을 같이 잡아줘서 혼자 할 때보다 훨씬 꾸준히 하게 됐어요.",
      },
    ],
    instagramHandle: "@kku._.ui",
  },
};

export function getTrainerProfile(username: string) {
  return trainerProfiles[username];
}

export const defaultUsername = "sample";
