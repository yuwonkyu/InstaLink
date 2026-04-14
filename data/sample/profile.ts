import { TrainerProfile } from "../mockData";

const profile: TrainerProfile = {
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
  options: {
    showReviews: true,
    showLocation: true,
    theme: "light",
    highlightColor: "#FEE500",
    showEditableFrame: true,
    serviceFooterLabel: false,
  },
};

export default profile;
