/**
 * Cloudinary URL에 변환 파라미터를 삽입해 소스 이미지 크기를 줄입니다.
 * next/image가 Cloudinary에서 다운로드하는 원본 파일 자체를 경량화하여 LCP를 개선합니다.
 *
 * 입력:  https://res.cloudinary.com/xxx/image/upload/v123/photo.jpg
 * 출력:  https://res.cloudinary.com/xxx/image/upload/w_400,q_auto/v123/photo.jpg
 */
export function getCloudinaryUrl(url: string, width: number): string {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  return url.replace(
    /\/image\/upload\//,
    `/image/upload/w_${width},q_auto/`,
  );
}
