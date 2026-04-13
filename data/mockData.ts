export type ServiceItem = {
  name: string;
  price: string;
  vat?: boolean;
};

export type ReviewItem = {
  author: string;
  content: string;
};

/**
 * ProfileOptions - UI 커스터마이징 옵션
 * 모든 필드는 선택적이며, 설정하지 않으면 기본값이 적용됩니다.
 * 
 * 기본값:
 * - showReviews: true (후기 섹션 표시)
 * - showLocation: true (위치/운영시간 표시)
 * - customCTA: profile.ctaLabel 사용
 * - theme: "light" (라이트 모드)
 * - highlightColor: "#FEE500" (CTA 버튼 배경색)
 * - showEditableFrame: true (반짝이는 테두리 표시)
 * - serviceFooterLabel: false (서비스 푸터 미표시)
 */
export type ProfileOptions = {
  showReviews?: boolean;
  showLocation?: boolean;
  customCTA?: string;
  theme?: "light" | "dark";
  highlightColor?: string;
  showEditableFrame?: boolean;
  serviceFooterLabel?: string | false;
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
  options?: ProfileOptions;
};

export const trainerProfiles: Record<string, TrainerProfile> = {
  sample: {
    username: "sample",
    name: "뀨 PT",
    brandName: "Sample gym",
    role: "체형교정 · 다이어트 · 1:1 PT",
    intro:
      "✔ 체형교정 + 다이어트 전문 \n✔ 초보자도 부담 없이 시작 가능",
    location: "서울 성수동 샘플빌딩 Sample gym",
    availability: "평일 06:00 ~ 22:00",
    ctaLabel: "무료 상담 받기 (카카오톡)",
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
    ],
    instagramHandle: "@kku._.ui",
    // 기본 옵션: 모든 요소 표시, 라이트 모드, 반짝이는 테두리 활성화
    options: {
      showReviews: true,
      showLocation: true,
      theme: "light",
      highlightColor: "#FEE500",
      showEditableFrame: true,
      serviceFooterLabel: false,
    },
  },
  sample2: {
    username: "sample2",
    name: "원규PT쌤",
    brandName: "프리드로잉 태권도",
    role: "1:1태권도수업 · 다이어트 · 자세교정",
    intro:
      "전문 태권도 수업을 통한 자세 교정 및 신체능력 강화\n 성인 맞춤 교육",
    location: "서울 목2동 00태권도장",
    availability: "15:00~22:00",
    ctaLabel: "무료 상담 가능(카카오톡 오픈채팅)",
    instagramUrl: "https://instagram.com/glichlich",
    imageSrc: "/pt_trainer.png",
    services: [
      {
        name: "1달(10회)",
        price: "50,000원",
        vat: true,
      },
      {
        name: "일일체험",
        price: "10,000원",
        vat: true,
      },
    ],
    reviews: [],
    instagramHandle: "@glichlich",
    options: {
      showReviews: false,
      showEditableFrame: false,
      serviceFooterLabel: "VAT포함",
      theme: "dark",
      highlightColor: "#FEE500",
    },
  },
};

export function getTrainerProfile(username: string) {
  return trainerProfiles[username];
}

export const defaultUsername = "sample";
