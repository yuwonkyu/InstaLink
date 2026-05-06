import type { Service } from "@/lib/types";
import { z } from "zod";

export const SERVICE_LIMITS = {
  name: 28,
  price: 14,
  note: 32,
} as const;

export const serviceFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "서비스명을 입력해주세요.")
      .max(
        SERVICE_LIMITS.name,
        `서비스명은 ${SERVICE_LIMITS.name}자 이하여야 합니다.`,
      ),
    price: z
      .string()
      .trim()
      .min(1, "가격을 입력해주세요.")
      .max(
        SERVICE_LIMITS.price,
        `가격은 ${SERVICE_LIMITS.price}자 이하여야 합니다.`,
      ),
    note: z
      .string()
      .trim()
      .max(
        SERVICE_LIMITS.note,
        `메모는 ${SERVICE_LIMITS.note}자 이하여야 합니다.`,
      )
      .optional()
      .or(z.literal("")),
  })
  .transform((value): Service => ({
    name: value.name,
    price: value.price,
    note: value.note ? value.note : undefined,
  }));

export type ServiceFormInput = z.input<typeof serviceFormSchema>;
const serviceListSchema = z.array(serviceFormSchema);

export function sanitizeService(service: Service): Service | null {
  const parsed = serviceFormSchema.safeParse(service);
  return parsed.success ? parsed.data : null;
}

export function sanitizeServices(services: Service[]): Service[] {
  return services
    .map((service) => sanitizeService(service))
    .filter((service): service is Service => service !== null);
}

export function validateServicesOrThrow(services: Service[]): Service[] {
  const parsed = serviceListSchema.safeParse(services);
  if (parsed.success) return parsed.data;

  const firstIssue = parsed.error.issues[0];
  const index = typeof firstIssue.path[0] === "number" ? firstIssue.path[0] + 1 : null;
  const target = index ? `서비스 ${index}번` : "서비스 항목";
  throw new Error(
    `${target}에 길이 초과 또는 필수값 누락이 있어 저장할 수 없습니다. 서비스 & 가격에서 수정 후 다시 저장해주세요.`,
  );
}
