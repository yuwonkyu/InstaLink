import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "InstaLink — 6월 한정 Pro 평생 무료 이벤트";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* 배경 장식 원 */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            right: "-120px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "-80px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
          }}
        />

        {/* 이벤트 배지 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "linear-gradient(90deg, #f59e0b, #ef4444)",
            borderRadius: "100px",
            padding: "10px 28px",
            marginBottom: "32px",
          }}
        >
          <span style={{ fontSize: "22px", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>
            ⭐ 6월 한정 얼리어답터 이벤트
          </span>
        </div>

        {/* 메인 헤드라인 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            marginBottom: "36px",
          }}
        >
          <span style={{ fontSize: "28px", color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>
            지금 가입하면
          </span>
          <span
            style={{
              fontSize: "80px",
              fontWeight: 900,
              color: "#fff",
              letterSpacing: "-3px",
              lineHeight: 1,
            }}
          >
            Pro 평생 무료
          </span>
          <span
            style={{
              fontSize: "26px",
              color: "#fbbf24",
              fontWeight: 700,
              marginTop: "4px",
            }}
          >
            월 29,900원 → 영구 0원
          </span>
        </div>

        {/* 서비스 설명 */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          {["서비스·가격 안내", "카카오 상담 연결", "방문자 통계", "갤러리·후기"].map((item) => (
            <div
              key={item}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "12px",
                padding: "8px 18px",
                fontSize: "18px",
                color: "rgba(255,255,255,0.75)",
                fontWeight: 500,
              }}
            >
              {item}
            </div>
          ))}
        </div>

        {/* 하단 마감일 + 브랜드 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "900px",
          }}
        >
          <span style={{ fontSize: "20px", color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>
            instalink.kkustudio.com
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(239,68,68,0.15)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "12px",
              padding: "8px 20px",
            }}
          >
            <span style={{ fontSize: "20px", color: "#ef4444", fontWeight: 700 }}>
              🗓 6월 30일 마감
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
