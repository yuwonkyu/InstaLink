import { z } from "zod";
import type {
  Service,
  CustomLink,
  GalleryImage,
  Review,
  Theme,
  BusinessHours,
  GalleryLayout,
} from "@/lib/types";
import { serviceFormSchema, type ServiceFormInput } from "@/lib/service-validation";

// ────────────────────────────────────────────────
// 필드별 길이 제한
// ────────────────────────────────────────────────
export const PROFILE_LIMITS = {
  name: 30,
  shop_name: 30,
  tagline: 50,
  description: 500,
  location: 50,
  hours: 100,
  parking_info: 100,
  instagram_id: 30,
  review_text: 300,
  review_author: 20,
  custom_link_label: 30,
  gallery_caption: 100,
} as const;

// ────────────────────────────────────────────────
// URL 검증
// ────────────────────────────────────────────────
const isUrlLike = (val: string) => {
  if (!val) return true;
  try {
    new URL(val);
    return true;
  } catch {
    return false;
  }
};

const urlSchema = z
  .string()
  .trim()
  .refine(isUrlLike, "올바른 URL 형식이 아닙니다.");

// ────────────────────────────────────────────────
// 카카오 URL 검증 (open.kakao.com, pf.kakao.com만 허용)
// ────────────────────────────────────────────────
const isKakaoUrl = (val: string) => {
  if (!val) return true;
  try {
    const u = new URL(val);
    const domain = u.hostname;
    return domain === "open.kakao.com" || domain === "pf.kakao.com";
  } catch {
    return false;
  }
};

const kakaoUrlSchema = z
  .string()
  .trim()
  .refine(isKakaoUrl, "카카오 URL은 open.kakao.com 또는 pf.kakao.com 주소만 가능합니다.");

// ────────────────────────────────────────────────
// 인스타그램 ID 검증
// ────────────────────────────────────────────────
const instagramIdRegex = /^[a-zA-Z0-9_.]{1,30}$/;
const instagramIdSchema = z
  .string()
  .trim()
  .min(1, "인스타그램 아이디를 입력해주세요.")
  .max(PROFILE_LIMITS.instagram_id, `${PROFILE_LIMITS.instagram_id}자 이하로 입력해주세요.`)
  .refine(instagramIdRegex.test.bind(instagramIdRegex), "영문, 숫자, 밑줄(_), 점(.)만 사용 가능합니다.");

// ────────────────────────────────────────────────
// Hex 색상 검증
// ────────────────────────────────────────────────
const hexColorRegex = /^#([A-Fa-f0-9]{6})$/;
const hexColorSchema = z
  .string()
  .trim()
  .or(z.literal(""))
  .refine(
    (val) => !val || hexColorRegex.test(val),
    "올바른 16진 색상 코드입니다. (예: #7c3aed)",
  );

// ────────────────────────────────────────────────
// 부분 스키마들
// ────────────────────────────────────────────────

export const customLinkSchema = z.object({
  label: z
    .string()
    .trim()
    .min(1, "링크 이름을 입력해주세요.")
    .max(PROFILE_LIMITS.custom_link_label),
  url: urlSchema.min(1, "URL을 입력해주세요."),
});

export const reviewSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, "후기 내용을 입력해주세요.")
    .max(PROFILE_LIMITS.review_text),
  author: z
    .string()
    .trim()
    .min(1, "작성자명을 입력해주세요.")
    .max(PROFILE_LIMITS.review_author),
  date: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}$/, "YYYY-MM 형식으로 입력해주세요.")
    .optional()
    .or(z.literal("")),
});

export const galleryImageSchema = z.object({
  url: urlSchema.min(1, "이미지 URL을 입력해주세요."),
  caption: z
    .string()
    .trim()
    .max(PROFILE_LIMITS.gallery_caption)
    .optional()
    .or(z.literal("")),
});

export const businessHoursSchema = z
  .object({
    mon: z.string().trim().optional().or(z.literal("")).or(z.null()),
    tue: z.string().trim().optional().or(z.literal("")).or(z.null()),
    wed: z.string().trim().optional().or(z.literal("")).or(z.null()),
    thu: z.string().trim().optional().or(z.literal("")).or(z.null()),
    fri: z.string().trim().optional().or(z.literal("")).or(z.null()),
    sat: z.string().trim().optional().or(z.literal("")).or(z.null()),
    sun: z.string().trim().optional().or(z.literal("")).or(z.null()),
  })
  .optional();

// ────────────────────────────────────────────────
// 전체 프로필 편집 폼 스키마
// ────────────────────────────────────────────────
export const profileFormSchema = z.object({
  // 기본 정보 (필수)
  name: z
    .string()
    .trim()
    .min(1, "이름을 입력해주세요.")
    .max(PROFILE_LIMITS.name),
  shop_name: z
    .string()
    .trim()
    .min(1, "브랜드명 / 상호를 입력해주세요.")
    .max(PROFILE_LIMITS.shop_name),
  tagline: z
    .string()
    .trim()
    .min(1, "한줄 소개를 입력해주세요.")
    .max(PROFILE_LIMITS.tagline),
  description: z
    .string()
    .trim()
    .max(PROFILE_LIMITS.description)
    .optional()
    .or(z.literal("")),
  location: z
    .string()
    .trim()
    .min(1, "위치를 입력해주세요.")
    .max(PROFILE_LIMITS.location),
  hours: z
    .string()
    .trim()
    .min(1, "운영시간을 입력해주세요.")
    .max(PROFILE_LIMITS.hours),
  parking_info: z
    .string()
    .trim()
    .max(PROFILE_LIMITS.parking_info)
    .optional()
    .or(z.literal("")),
  image_url: z.string().trim().min(1, "프로필 이미지가 필요합니다."),
  instagram_id: instagramIdSchema,

  // 연락처
  kakao_url: kakaoUrlSchema.min(1, "카카오 오픈채팅 URL을 입력해주세요."),
  kakao_booking_url: kakaoUrlSchema.optional().or(z.literal("")).or(z.null()),
  naver_booking_url: urlSchema.optional().or(z.literal("")).or(z.null()),
  phone_url: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .or(z.null()),
  instagram_dm_url: urlSchema.optional().or(z.literal("")).or(z.null()),
  kakao_channel_url: kakaoUrlSchema.optional().or(z.literal("")).or(z.null()),

  // 디자인
  theme: z.enum(["light", "dark", "ucc", "softsage", "warmlinen", "energysteel", "instagram"]),

  // 콘텐츠
  services: z.array(serviceFormSchema).default([]),
  reviews: z.array(reviewSchema).default([]),
  custom_links: z.array(customLinkSchema).default([]),
  gallery: z.array(galleryImageSchema).default([]),

  // Pro 전용
  section_order: z.array(z.string()).optional(),
  button_color: hexColorSchema.optional(),
  button_text_color: hexColorSchema.optional(),
  gallery_layout: z.enum(["grid2", "grid3"]).optional(),

  // Basic+ 전용
  business_hours: businessHoursSchema.optional(),
});

export type ProfileFormInput = z.input<typeof profileFormSchema>;
export type ProfileFormOutput = z.output<typeof profileFormSchema>;
