// YouTube IFrame Player API — plays full songs, no API key needed
// The player is hidden; audio comes through the browser

declare global {
  interface Window {
    YT: {
      Player: new (el: string | HTMLElement, opts: YTPlayerOptions) => YTPlayer;
      PlayerState: { PLAYING: number; PAUSED: number; ENDED: number; BUFFERING: number };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YTPlayerOptions {
  width: number;
  height: number;
  videoId?: string;
  playerVars?: Record<string, number | string>;
  events?: {
    onReady?: (e: { target: YTPlayer }) => void;
    onStateChange?: (e: { data: number }) => void;
    onError?: (e: { data: number }) => void;
  };
}

export interface YTPlayer {
  loadVideoById(opts: { videoId: string; startSeconds?: number }): void;
  cueVideoById(opts: { videoId: string; startSeconds?: number }): void;
  loadPlaylist(opts: { listType: "search"; list: string; index?: number; startSeconds?: number }): void;
  playVideo(): void;
  pauseVideo(): void;
  stopVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  setVolume(vol: number): void;
  getVolume(): number;
  getCurrentTime(): number;
  getDuration(): number;
  getPlayerState(): number;
  destroy(): void;
}

let apiLoaded = false;
let apiReady = false;
const readyCallbacks: (() => void)[] = [];

export function loadYouTubeAPI(): Promise<void> {
  if (apiReady) return Promise.resolve();
  return new Promise((resolve) => {
    readyCallbacks.push(resolve);
    if (apiLoaded) return;
    apiLoaded = true;
    window.onYouTubeIframeAPIReady = () => {
      apiReady = true;
      readyCallbacks.forEach(cb => cb());
      readyCallbacks.length = 0;
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(script);
  });
}

export function createYTPlayer(
  container: HTMLElement,
  onReady: (p: YTPlayer) => void,
  onStateChange: (state: number) => void,
): YTPlayer {
  return new window.YT.Player(container, {
    width: 200,
    height: 200,
    videoId: "Umqb9KENgmk", // initial video required so player fully initialises
    playerVars: {
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      fs: 0,
      iv_load_policy: 3,
      modestbranding: 1,
      playsinline: 1,
      rel: 0,
      origin: window.location.origin,
    },
    events: {
      onReady: (e) => onReady(e.target),
      onStateChange: (e) => onStateChange(e.data),
    },
  });
}

// Search YouTube via the no-auth oEmbed + noembed trick isn't reliable.
// Instead we use the open `youtube-search-api` style embed:
// https://www.youtube.com/results?search_query=... scraping is blocked,
// so we use the reliable approach: embed a search query directly via
// YouTube's list/search playerVar.
export function playYouTubeSearch(player: YTPlayer, query: string): void {
  // YouTube doesn't expose a search API in the IFrame player directly,
  // but we can use the `list` + `listType=search` playerVars by reloading
  // the iframe src. The cleanest way is to use loadVideoById with a known videoId.
  // Since we have curated IDs per song, we use those directly.
  void query; // suppress lint — callers use ytId directly
}

export function msToTime(ms: number): string {
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function secsToTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}
