export type MenuLink = {
  label: string;
  href: string;
  description: string;
};

export type ReservationItem = {
  title: string;
  duration: string;
  price: string;
  description: string;
  href: string;
};

export type TrainerProfile = {
  username: string;
  name: string;
  initials: string;
  role: string;
  intro: string;
  location: string;
  availability: string;
  responseTime: string;
  highlightTags: string[];
  menuLinks: MenuLink[];
  reservations: ReservationItem[];
  footerNote: string;
  instagramHandle: string;
};

export const trainerProfiles: Record<string, TrainerProfile> = {
  "coach-jiyun": {
    username: "coach-jiyun",
    name: "김지윤 코치",
    initials: "JY",
    role: "여성 맞춤 PT / 바디리컴포지션",
    intro:
      "운동을 오래 못 이어간 사람도 시작할 수 있게, 현재 체력과 라이프스타일에 맞춘 루틴으로 코칭합니다.",
    location: "서울 성수",
    availability: "평일 06:00 - 22:00",
    responseTime: "문의 평균 응답 10분",
    highlightTags: ["초보 환영", "체형 교정", "다이어트 집중"],
    menuLinks: [
      {
        label: "인스타그램",
        href: "https://instagram.com",
        description: "운동 루틴, 전후 변화, 수업 분위기 보기",
      },
      {
        label: "카카오톡 상담",
        href: "https://open.kakao.com",
        description: "수업 가능 시간과 목표에 맞춘 1:1 상담",
      },
      {
        label: "오시는 길",
        href: "https://map.naver.com",
        description: "성수역 도보 5분, 주차 가능 여부 안내",
      },
    ],
    reservations: [
      {
        title: "체험 PT",
        duration: "50분",
        price: "39,000원",
        description: "체형 체크와 목표 상담, 1회 체험 수업이 포함됩니다.",
        href: "https://forms.gle",
      },
      {
        title: "1:1 집중 PT",
        duration: "주 2회 / 4주",
        price: "별도 문의",
        description: "식단 피드백과 홈트 루틴까지 함께 관리합니다.",
        href: "https://calendar.google.com",
      },
      {
        title: "온라인 코칭",
        duration: "4주 프로그램",
        price: "별도 문의",
        description: "헬스장 방문이 어려운 분들을 위한 비대면 코칭입니다.",
        href: "mailto:coach@savemept.com",
      },
    ],
    footerNote: "모든 예약은 상담 후 최종 확정되며, 일정 변경은 최소 하루 전에 요청해 주세요.",
    instagramHandle: "@saveme.pt",
  },
};

export function getTrainerProfile(username: string) {
  return trainerProfiles[username];
}

export const defaultUsername = "coach-jiyun";