import { TrainerProfile } from "../mockData";

const profile: TrainerProfile = {
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
};

export default profile;
