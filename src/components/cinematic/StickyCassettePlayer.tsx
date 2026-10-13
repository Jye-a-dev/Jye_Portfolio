"use client";

import React from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Disc3 } from "lucide-react";
import { useAudio } from "@/context/AudioContext";

/**
 * Trình phát nhạc Cassette cố định góc dưới màn hình (Sticky Cassette Widget).
 * Tái hiện hộp băng từ Analog cổ điển với bánh răng xoay, đèn LED neon chỉ báo trạng thái.
 */
export function StickyCassettePlayer() {
  const {
    currentTrack,
    isPlaying,
    isMuted,
    volume,
    togglePlay,
    toggleMute,
    setVolume,
    nextTrack,
    prevTrack,
  } = useAudio();

  return (
    <aside
      aria-label="Trình phát băng từ Neon Noir"
      className="fixed bottom-4 right-4 z-40 w-80 max-w-[calc(100vw-2rem)] select-none rounded-lg border border-zinc-800/80 bg-zinc-950/90 p-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.85)] backdrop-blur-md transition-all duration-300 sm:bottom-6 sm:right-6"
    >
      {/* Vỏ băng từ mặt trước với 2 trục quay bánh răng */}
      <div className="relative mb-3 flex items-center justify-between rounded border border-zinc-900 bg-zinc-900/60 px-3 py-2">
        {/* Trục quay trái */}
        <div
          className={`flex h-7 w-7 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 text-zinc-500 shadow-inner ${
            isPlaying ? "animate-[spin_3s_linear_infinite]" : ""
          }`}
        >
          <Disc3 className="h-4 w-4 text-zinc-400" />
        </div>

        {/* Cửa sổ nhìn dải băng từ */}
        <div className="flex flex-col items-center justify-center px-2">
          <div className="flex items-center gap-1.5 font-mono text-[9px] tracking-widest text-zinc-400 uppercase">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isPlaying ? "animate-ping bg-rose-500" : "bg-zinc-600"
              }`}
            />
            <span>{currentTrack?.stage ? currentTrack.stage.toUpperCase() : "MAGNETIC"} TAPE</span>
          </div>
          <span className="font-mono text-[8px] text-zinc-600">MAGNETIC C-90</span>
        </div>

        {/* Trục quay phải */}
        <div
          className={`flex h-7 w-7 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 text-zinc-500 shadow-inner ${
            isPlaying ? "animate-[spin_3s_linear_infinite]" : ""
          }`}
        >
          <Disc3 className="h-4 w-4 text-zinc-400" />
        </div>
      </div>

      {/* Thông tin bài nhạc đang phát */}
      <div className="mb-3">
        <h4 className="truncate font-sans text-xs font-semibold tracking-wide text-zinc-100">
          {currentTrack?.title ?? "Chưa chọn bài hát"}
        </h4>
        <p className="truncate font-mono text-[10px] text-zinc-400">
          {currentTrack?.artist ?? "Băng từ Analog"}
        </p>
      </div>

      {/* Bộ điều khiển Playback & Volume */}
      <div className="flex items-center justify-between gap-2 border-t border-zinc-900 pt-2.5">
        <div className="flex items-center gap-1">
          {/* Lùi bài */}
          <button
            type="button"
            onClick={prevTrack}
            title="Màn trước"
            aria-label="Màn trước"
            className="flex h-7 w-7 items-center justify-center rounded text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-200"
          >
            <SkipBack className="h-3.5 w-3.5" />
          </button>

          {/* Nút Play / Pause Neon */}
          <button
            type="button"
            onClick={togglePlay}
            title={isPlaying ? "Tạm dừng" : "Phát nhạc"}
            aria-label={isPlaying ? "Tạm dừng" : "Phát nhạc"}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-rose-500/40 bg-rose-500/10 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.3)] transition-all hover:border-rose-400 hover:bg-rose-500/20 hover:text-rose-300 active:scale-95"
          >
            {isPlaying ? (
              <Pause className="h-3.5 w-3.5 fill-current" />
            ) : (
              <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />
            )}
          </button>

          {/* Chuyển bài */}
          <button
            type="button"
            onClick={nextTrack}
            title="Màn tiếp theo"
            aria-label="Màn tiếp theo"
            className="flex h-7 w-7 items-center justify-center rounded text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-200"
          >
            <SkipForward className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Bộ điều khiển âm lượng */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleMute}
            title={isMuted ? "Bật âm" : "Tắt tiếng"}
            aria-label={isMuted ? "Bật âm" : "Tắt tiếng"}
            className="text-zinc-400 transition-colors hover:text-zinc-200"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="h-3.5 w-3.5 text-zinc-500" />
            ) : (
              <Volume2 className="h-3.5 w-3.5" />
            )}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            aria-label="Âm lượng"
            className="h-1 w-16 cursor-pointer appearance-none rounded-full bg-zinc-800 accent-rose-500 transition-colors hover:bg-zinc-700"
          />
        </div>
      </div>
    </aside>
  );
}

export default StickyCassettePlayer;

