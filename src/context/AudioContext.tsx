"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { soundEngine, SOUND_TRACKS, SoundTrack } from "@/lib/soundEngine";

interface AudioContextType {
  currentTrack: SoundTrack;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  tracks: SoundTrack[];
  playTrack: (track: SoundTrack) => Promise<void>;
  togglePlay: () => Promise<void>;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  nextTrack: () => Promise<void>;
  prevTrack: () => Promise<void>;
}

const AudioContext = createContext<AudioContextType | null>(null);

export interface AudioProviderProps {
  children: React.ReactNode;
  initialTracks?: SoundTrack[];
  defaultVolume?: number;
}

export function AudioProvider({
  children,
  initialTracks = SOUND_TRACKS,
  defaultVolume = 0.8,
}: AudioProviderProps) {
  const [tracks, setTracks] = useState<SoundTrack[]>(initialTracks);
  const [currentTrack, setCurrentTrack] = useState<SoundTrack>(
    initialTracks[0] || SOUND_TRACKS[0]
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolumeState] = useState<number>(() =>
    Math.max(0, Math.min(1, defaultVolume))
  );

  // Cập nhật khi nguồn dữ liệu từ Markdown thay đổi
  React.useEffect(() => {
    if (initialTracks && initialTracks.length > 0) {
      setTracks(initialTracks);
      setCurrentTrack((prev) => {
        const exists = initialTracks.some((t) => t.id === prev?.id);
        return exists ? prev : initialTracks[0];
      });
    }
  }, [initialTracks]);

  const playTrack = useCallback(async (track: SoundTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    await soundEngine.playTrack(track.src);
  }, []);

  const togglePlay = useCallback(async () => {
    if (isPlaying) {
      soundEngine.pause();
      setIsPlaying(false);
    } else {
      if (!currentTrack && tracks.length > 0) {
        await playTrack(tracks[0]);
      } else {
        soundEngine.resume();
        setIsPlaying(true);
      }
    }
  }, [isPlaying, currentTrack, tracks, playTrack]);

  const toggleMute = useCallback(() => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEngine.setMuted(nextMuted);
  }, [isMuted]);

  const setVolume = useCallback((val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolumeState(clamped);
    soundEngine.setVolume(clamped);
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
      soundEngine.setMuted(false);
    }
  }, [isMuted]);

  const nextTrack = useCallback(async () => {
    if (tracks.length === 0) return;
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack?.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    await playTrack(tracks[nextIndex]);
  }, [tracks, currentTrack, playTrack]);

  const prevTrack = useCallback(async () => {
    if (tracks.length === 0) return;
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack?.id);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    await playTrack(tracks[prevIndex]);
  }, [tracks, currentTrack, playTrack]);

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        isMuted,
        volume,
        tracks,
        playTrack,
        togglePlay,
        toggleMute,
        setVolume,
        nextTrack,
        prevTrack,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio(): AudioContextType {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
