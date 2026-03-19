"use client";

import { useEffect, useRef } from "react";

type Props = {
  slot: string; // AdSense 광고 단위 ID
  size?: "small" | "medium";
};

export default function AdBox({ slot, size = "medium" }: Props) {
  const adRef = useRef<any>(null); // <- 여기 수정

  useEffect(() => {
    try {
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      (window as any).adsbygoogle.push({});
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div className={`w-full flex justify-center my-4 ${size === "small" ? "h-20" : "h-32"}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-6799731194644219" // 본인 AdSense 클라이언트 ID
        data-ad-slot="8997590677" // 본인 광고 단위
        data-ad-format="auto"
        data-full-width-responsive="true"
        ref={adRef} // 안전하게 any 타입으로 처리
      ></ins>
    </div>
  );
}