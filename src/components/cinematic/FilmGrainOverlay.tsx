import React from "react";

/**
 * Overlay hạt nhiễu phim 35mm tĩnh (Film Grain).
 * Sử dụng thuần CSS tĩnh trên texture noise.png để không tiêu tốn chu kỳ tính toán CPU/GPU,
 * duy trì tốc độ khung hình chuẩn 60fps.
 */
export function FilmGrainOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 h-screen w-screen select-none bg-repeat opacity-[0.04] mix-blend-overlay gpu-layer"
      style={{
        backgroundImage: "url('/noise.png')",
        backgroundRepeat: "repeat",
        contain: "strict",
        transform: "translate3d(0, 0, 0)",
      }}
    />
  );
}

export default FilmGrainOverlay;

