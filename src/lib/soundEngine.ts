export interface SoundTrack {
  id: string;
  title: string;
  subtitle?: string;
  artist: string;
  src: string;
  stage?: "intro" | "body" | "outro" | string;
}

export const SOUND_TRACKS: SoundTrack[] = [
  {
    id: "track-1",
    title: "Màn 1: Hoài Niệm Disco",
    subtitle: "Intro – Giấc mơ ánh đèn vũ hội",
    artist: "ABBA Nostalgia Tape",
    src: "/media/audio/intro-abba.mp3",
    stage: "intro",
  },
  {
    id: "track-2",
    title: "Màn 2: Dạ Vũ Phố Đèn Dầu",
    subtitle: "Body – Tiếng mưa bóng đèn huỳnh quang",
    artist: "Nhạc Việt Thập Niên 90",
    src: "/media/audio/body-viet90s.mp3",
    stage: "body",
  },
  {
    id: "track-3",
    title: "Màn 3: Trầm Tích Đêm Ba Miền",
    subtitle: "Outro – Lãng đãng khói sương",
    artist: "TCS – Huế · Sài Gòn · Hà Nội",
    src: "/media/audio/outro-hue-sg-hn.mp3",
    stage: "outro",
  },
];

interface AudioChannel {
  audio: HTMLAudioElement;
  sourceNode: MediaElementAudioSourceNode;
  gainNode: GainNode;
}

/**
 * Web Audio Engine quản lý phát nhạc đa kênh và xử lý cross-fade 1.5 giây.
 * Hỗ trợ chuyển bài mượt mà giữa 3 màn âm thanh: Intro -> Body -> Outro.
 */
class SoundEngine {
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeChannelIndex: 0 | 1 = 0;
  private channels: [AudioChannel | null, AudioChannel | null] = [null, null];
  private volume: number = 0.8;
  private isMuted: boolean = false;
  private crossfadeDuration: number = 1.5;

  private initContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
      this.masterGain.connect(this.audioCtx.destination);
    }

    if (this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }

    return this.audioCtx;
  }

  private createChannel(src: string): AudioChannel {
    const ctx = this.initContext();
    const audio = new Audio(src);
    audio.crossOrigin = "anonymous";
    audio.loop = true;
    audio.preload = "auto";

    const sourceNode = ctx.createMediaElementSource(audio);
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, ctx.currentTime);

    sourceNode.connect(gainNode);
    gainNode.connect(this.masterGain!);

    return { audio, sourceNode, gainNode };
  }

  /**
   * Phát track với hiệu ứng cross-fade 1.5 giây giữa bài cũ và bài mới.
   */
  public async playTrack(trackSrc: string): Promise<void> {
    if (typeof window === "undefined") return;

    const ctx = this.initContext();
    const currentTime = ctx.currentTime;
    const currentChannel = this.channels[this.activeChannelIndex];

    // Tạo kênh mới trên slot đối ứng (ping-pong giữa 0 và 1)
    const nextSlot: 0 | 1 = this.activeChannelIndex === 0 ? 1 : 0;

    // Hủy kênh cũ của slot tiếp theo nếu tồn tại
    if (this.channels[nextSlot]) {
      try {
        this.channels[nextSlot]!.audio.pause();
        this.channels[nextSlot]!.audio.src = "";
      } catch {
        // Safe cleanup
      }
      this.channels[nextSlot] = null;
    }

    const nextChannel = this.createChannel(trackSrc);
    this.channels[nextSlot] = nextChannel;

    try {
      await nextChannel.audio.play();

      // Thực hiện Cross-fade tuyến tính 1.5 giây
      nextChannel.gainNode.gain.setValueAtTime(0, currentTime);
      nextChannel.gainNode.gain.linearRampToValueAtTime(
        1,
        currentTime + this.crossfadeDuration
      );

      if (currentChannel) {
        currentChannel.gainNode.gain.setValueAtTime(
          currentChannel.gainNode.gain.value,
          currentTime
        );
        currentChannel.gainNode.gain.linearRampToValueAtTime(
          0.0001,
          currentTime + this.crossfadeDuration
        );

        setTimeout(() => {
          currentChannel.audio.pause();
        }, this.crossfadeDuration * 1000);
      }

      this.activeChannelIndex = nextSlot;
    } catch {
      // Trình duyệt có thể chặn autoplay nếu chưa có user gesture
    }
  }

  public pause(): void {
    const active = this.channels[this.activeChannelIndex];
    if (active) {
      active.audio.pause();
    }
  }

  public resume(): void {
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
    const active = this.channels[this.activeChannelIndex];
    if (active) {
      active.audio.play().catch(() => {});
    }
  }

  public setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.masterGain && this.audioCtx && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
    }
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (this.masterGain && this.audioCtx) {
      const target = muted ? 0 : this.volume;
      this.masterGain.gain.setValueAtTime(target, this.audioCtx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }
}

export const soundEngine = new SoundEngine();

