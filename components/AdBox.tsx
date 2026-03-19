"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

type Props = {
  slot: string;
  size?: "small" | "medium";
};

export default function AdBox({ slot, size = "medium" }: Props) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  }, []);

  return (
    <div
      className={`w-full flex justify-center my-4 ${
        size === "small" ? "min-h-[60px]" : "min-h-[100px]"
      }`}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%" }}
        data-ad-client="ca-pub-6799731194644219"
        data-ad-slot="8997590677"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}