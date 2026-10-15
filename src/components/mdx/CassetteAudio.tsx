"use client";

import { useState, useRef, useEffect } from "react";

export interface CassetteAudioProps {
  src?: string;
  title?: string;
}

export function CassetteAudio({ src, title }: CassetteAudioProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration || 0);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !src) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "00:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="my-8 overflow-hidden rounded-xs border-2 border-[#3d342d] bg-[#141210]/95 p-4 shadow-[0_12px_30px_rgba(0,0,0,0.85)]">
      {src && <audio ref={audioRef} src={src} preload="metadata" />}

      {/* Header hộp băng */}
      <div className="mb-3 flex items-center justify-between border-b border-[#2a241f] pb-2 font-typewriter font-mono text-[10px] text-[#8c785b]">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full transition-colors ${
              isPlaying
                ? "bg-cyan-400 shadow-[0_0_8px_#00E5FF]"
                : "bg-[#44382c]"
            }`}
          />
          <span className="font-bold tracking-widest uppercase">
            CASSETTE CHROME C-90 • STEREO
          </span>
        </div>
        <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
      </div>

      {/* Thân băng Cassette cơ học */}
      <div className="relative flex flex-col gap-3 rounded-xs border border-dashed border-[#44382c] bg-[#1c1815] p-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Hai bánh xe cuộn băng cơ học quay khi phát */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={togglePlay}
            disabled={!src}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-baocap-yellow bg-baocap-yellow font-typewriter font-mono text-sm font-black text-baocap-ink transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
            aria-label={isPlaying ? "Tạm dừng băng" : "Phát băng"}
          >
            {isPlaying ? "❚❚" : "▶"}
          </button>

          <div className="flex items-center gap-3">
            {/* Bánh răng trái */}
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#5c4e3e] bg-[#0c0a09] transition-transform duration-1000 ${
                isPlaying ? "animate-[spin_2s_linear_infinite]" : ""
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-[#8c734e]" />
            </div>

            {/* Dải phim băng từ giữa 2 bánh răng */}
            <div className="h-1.5 w-12 rounded-full bg-[#0a0807] overflow-hidden">
              <div
                className="h-full bg-cyan-500/80 transition-all duration-200"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Bánh răng phải */}
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#5c4e3e] bg-[#0c0a09] transition-transform duration-1000 ${
                isPlaying ? "animate-[spin_2s_linear_infinite]" : ""
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-[#8c734e]" />
            </div>
          </div>
        </div>

        {/* Nhãn dán trên thân băng */}
        <div className="min-w-0 flex-1 sm:text-right">
          <p className="truncate font-typewriter font-mono text-xs font-bold text-baocap-paper">
            {title || "Băng Ghi Âm Tư Liệu"}
          </p>
          <p className="truncate font-typewriter font-mono text-[10px] text-[#8c734e]">
            {src || "Không tìm thấy nguồn âm thanh"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CassetteAudio;

