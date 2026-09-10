import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./App.css";

const ASSET_BASE = "https://raw.githubusercontent.com/b-1-o/wqnui/main/assets";
const MUSIC_BASE = "https://raw.githubusercontent.com/b-1-o/wqnui/main/music";

// Backgrounds only (not button images)
const MAIN_BG = `${ASSET_BASE}/more.jpg`;
const PLAY_BG = `${ASSET_BASE}/blfr.jpg`;
const BG_CYCLE = [
  `${ASSET_BASE}/assa.jpg`,
  `${ASSET_BASE}/luja.jpg`,
  `${ASSET_BASE}/chhc.jpg`,
  `${ASSET_BASE}/snow.jpg`,
  `${ASSET_BASE}/blfr.jpg`,
];

const TRACK = `${MUSIC_BASE}/Kai-Angel-lovesong-Official-Music-Video.mp3`;
const TRACK_NAME = "lovesong";
const ARTIST = "Kai Angel";

const LINKS = [
  {
    label: "TikTok",
    username: "@wqnui1",
    href: "https://www.tiktok.com/@wqnui1",
    glyph: "♪",
    image: `${ASSET_BASE}/alal.jpg`,
    bg: `${ASSET_BASE}/assa.jpg`,
  },
  {
    label: "Telegram",
    username: "@wqnui",
    href: "https://t.me/wqnui",
    glyph: "◈",
    image: `${ASSET_BASE}/anhy.jpg`,
    bg: `${ASSET_BASE}/luja.jpg`,
  },
  {
    label: "VK",
    username: "vk.ru/wqnui",
    href: "https://vk.ru/wqnui",
    glyph: "◎",
    image: `${ASSET_BASE}/provo.jpg`,
    bg: `${ASSET_BASE}/chhc.jpg`,
  },
  {
    label: "Discord",
    username: "discord.gg/Rbu3h4US",
    href: "https://discord.gg/Rbu3h4US",
    glyph: "◌",
    image: `${ASSET_BASE}/pixi.jpg`,
    bg: `${ASSET_BASE}/snow.jpg`,
  },
];

const LYRICS: { time: number; text: string }[] = [
  { time: 0.74, text: "Huh, hit it right on time (uh-huh), run it back" },
  { time: 4.16, text: "Cash (wow) multiply, she all fragile" },
  { time: 7.29, text: "We drank too much wine, we drank too much wine" },
  { time: 10.78, text: "We drank too much wine, too much wine (uh-huh, uh, come on)" },
  { time: 14.2, text: "Ты думала, я про тебя пишу песни?" },
  { time: 17.59, text: "Ты позвонишь, но я даже не отвечу (ooh-ooh)" },
  { time: 20.86, text: "Я знаю, ты хочешь делать это всё лето (прямо весь summer)" },
  { time: 24.14, text: "Ты типа закрыта, но ты сейчас раздета (oh my God)" },
  { time: 27.49, text: "Не знаю, доживём ли мы до рассвета (ooh)" },
  { time: 30.79, text: "Ты сделала так много, так много, uh" },
  { time: 33.73, text: "Так много непонятно, будто это set up" },
  { time: 37.01, text: "Мне уже непонятно, huh, ты ли это" },
  { time: 40.16, text: "Uh, right now, прямо сейчас (right now, right now)" },
  { time: 42.79, text: "Смотрю на твоё фото и так хочу написать (tell me why?)" },
  { time: 46.07, text: "Мы будем делать это, пока не pass out" },
  { time: 49.19, text: "Если кто-то посмотрит, я его положу спать (я, я, uh-uh)" },
  { time: 54.14, text: "У меня такой капитал, huh" },
  { time: 56.5, text: "Такой fame, что я типа должен забыть страх, huh" },
  { time: 59.91, text: "Но ещё так много times, когда это не так" },
  { time: 63.29, text: "Давай, напиши в New York Times, что я мудак (ангел)" },
  { time: 67.21, text: "Ты думала, я про тебя пишу песни?" },
  { time: 70.52, text: "Ты позвонишь, но я даже не отвечу (ooh-ooh)" },
  { time: 73.81, text: "Я знаю, ты хочешь делать это всё лето (прямо весь summer)" },
  { time: 77.13, text: "Ты типа закрыта, но ты сейчас раздета (oh my God)" },
  { time: 80.46, text: "Не знаю, доживём ли мы до рассвета (ooh)" },
  { time: 83.7, text: "Ты сделала так много, так много, uh" },
  { time: 86.62, text: "Так много непонятно, будто это set up" },
  { time: 89.92, text: "Мне уже непонятно, huh, ты ли это" },
  { time: 93.15, text: "Я не хотел думать о тебе (pow, pow, pow)" },
  { time: 96.42, text: "Но ты будто медицина в моей аптеке" },
  { time: 99.76, text: "Every night the moon does fly around my head" },
  { time: 102.8, text: "I'm in your head, up in your head, uhh" },
];

function PlayIcon({ playing }: { playing: boolean }) {
  return playing ? (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 5.5h3v13h-3zm6 0h3v13h-3z" /></svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8.5 5.8 10 6.2-10 6.2z" /></svg>
  );
}

function Chevron() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m9 5 7 7-7 7" />
    </svg>
  );
}

function Visualizer({ analyser, playing }: { analyser: AnalyserNode | null; playing: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let width = 1;
    let height = 1;
    const data = new Uint8Array(analyser?.frequencyBinCount || 128);

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      width = Math.max(1, r.width);
      height = Math.max(1, r.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    if (!playing) {
      ctx.clearRect(0, 0, width, height);
      return () => window.removeEventListener("resize", resize);
    }

    const count = 22;
    const bw = width / count;
    const center = height / 2;
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "rgba(255,255,255,.04)");
    gradient.addColorStop(0.45, "rgba(180,245,255,.7)");
    gradient.addColorStop(0.62, "rgba(70,180,255,.9)");
    gradient.addColorStop(1, "rgba(255,255,255,.02)");
    ctx.fillStyle = gradient;

    const draw = () => {
      analyser?.getByteFrequencyData(data);
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < count; i++) {
        const t = i / count;
        const idx = Math.min(data.length - 1, Math.floor(t ** 1.65 * data.length * 0.78));
        const live = (data[idx] || 0) / 255;
        const env = 0.34 + Math.sin(Math.PI * t) * 0.66;
        const h = Math.max(2, Math.pow(live, 1.15) * height * 0.9 * env);
        ctx.globalAlpha = 0.44 + env * 0.42;
        ctx.fillRect(i * bw + 1, center - h / 2, Math.max(1, bw - 2), h);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [analyser, playing]);

  return <canvas ref={canvasRef} className="visualizer" />;
}

function Background({ source }: { source: string }) {
  return (
    <div className="background">
      <AnimatePresence initial={false} mode="sync">
        <motion.img
          key={source}
          className="background-image"
          src={source}
          alt=""
          decoding="async"
          loading="eager"
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        />
      </AnimatePresence>
      <div className="background-colorwash" />
      <div className="background-fog" />
      <div className="background-vignette" />
    </div>
  );
}

function PortalLink({
  link,
  armed,
  onArm,
  onReset,
}: {
  link: (typeof LINKS)[number];
  armed: boolean;
  onArm: () => void;
  onReset: () => void;
}) {
  return (
    <div
      className={`portal-shell ${armed ? "armed" : ""}`}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div className="portal-card glass" onPointerDown={(e) => e.stopPropagation()}>
        <div className="portal-face">
          <span className="portal-glyph">{link.glyph}</span>
          <span className="portal-label">{link.label}</span>
          <span className="portal-orbit">↗</span>
        </div>

        <div className="portal-open">
          <div className="social-art">
            <img src={link.image} alt="" loading="lazy" decoding="async" />
            <span className="social-art-shine" />
          </div>
          <div className="portal-copy">
            <strong>{link.label}</strong>
            <span>{link.username}</span>
            <small>ENTER THE PORTAL</small>
          </div>
          <a
            className="portal-go"
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${link.label}`}
            onClick={(e) => e.stopPropagation()}
          >
            <Chevron />
          </a>
          <button type="button" className="portal-close" onClick={onReset} aria-label={`Close ${link.label}`}>
            ×
          </button>
        </div>

        {!armed && (
          <button
            type="button"
            className="portal-hit"
            onClick={(e) => {
              e.stopPropagation();
              onArm();
            }}
            aria-label={`Open ${link.label}`}
          />
        )}
      </div>
    </div>
  );
}

function formatTime(s: number) {
  if (!Number.isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
}

export default function App() {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [armedLink, setArmedLink] = useState<number | null>(null);
  const [lyricsOpen, setLyricsOpen] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const setupAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audioContextRef.current) {
      const Ctor =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;
      const ctx = new Ctor();
      const node = ctx.createAnalyser();
      node.fftSize = 256;
      node.smoothingTimeConstant = 0.86;
      node.connect(ctx.destination);
      audioContextRef.current = ctx;
      analyserRef.current = node;
      setAnalyser(node);
    }
    if (!sourceRef.current) {
      try {
        sourceRef.current = audioContextRef.current!.createMediaElementSource(audio);
        sourceRef.current.connect(analyserRef.current!);
      } catch {
        /* already connected */
      }
    }
    if (audioContextRef.current.state === "suspended") void audioContextRef.current.resume();
  }, []);

  useEffect(() => {
    const audio = new Audio(TRACK);
    audio.crossOrigin = "anonymous";
    audio.preload = "metadata";
    audio.volume = 1;
    audioRef.current = audio;
    sourceRef.current = null;
    setProgress(0);
    setCurrentTime(0);

    const onTime = () => {
      setCurrentTime(audio.currentTime);
      setProgress(audio.duration ? audio.currentTime / audio.duration : 0);
    };
    const onMeta = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      setPlaying(false);
      setLyricsOpen(false);
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => {
      setPlaying(false);
      setLyricsOpen(false);
    };

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.pause();
      audio.src = "";
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = armedLink === null ? 1 : 0.18;
  }, [armedLink]);

  // Cycle backgrounds while playing and no portal is open
  useEffect(() => {
    if (!playing || armedLink !== null) return;
    const id = window.setInterval(() => setBgIndex((i) => (i + 1) % BG_CYCLE.length), 12000);
    return () => clearInterval(id);
  }, [playing, armedLink]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setupAudio();
    if (audio.paused) {
      void audio
        .play()
        .then(() => {
          setPlaying(true);
          setLyricsOpen(true);
          setBgIndex(0);
        })
        .catch(() => setPlaying(false));
    } else {
      audio.pause();
      setPlaying(false);
      setLyricsOpen(false);
    }
  }, [setupAudio]);

  const seek = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const a = audioRef.current;
    if (!a?.duration) return;
    const r = e.currentTarget.getBoundingClientRect();
    a.currentTime = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * a.duration;
  };

  const activeLyricIndex = useMemo(() => {
    let idx = -1;
    for (let i = 0; i < LYRICS.length; i++) {
      if (currentTime >= LYRICS[i].time) idx = i;
      else break;
    }
    return idx;
  }, [currentTime]);

  const activeLyric = activeLyricIndex >= 0 ? LYRICS[activeLyricIndex] : null;
  const nextLyric =
    activeLyricIndex >= 0 && activeLyricIndex + 1 < LYRICS.length ? LYRICS[activeLyricIndex + 1] : null;

  const expanded = playing || lyricsOpen;
  const portalOpen = armedLink !== null;

  // Background priority: portal bg > playing cycle > default idle
  const bgSource = useMemo(() => {
    if (armedLink !== null) return LINKS[armedLink].bg;
    if (playing) return BG_CYCLE[bgIndex % BG_CYCLE.length] || PLAY_BG;
    return MAIN_BG;
  }, [armedLink, playing, bgIndex]);

  const onPlayerPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    if (portalOpen) setArmedLink(null);
  };

  return (
    <div
      className="app"
      onPointerDown={() => {
        if (portalOpen) setArmedLink(null);
      }}
    >
      <Background source={bgSource} />
      <main className={`page ${portalOpen ? "portal-open-page" : ""}`}>
        <motion.header
          className="identity"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="identity-mark">wqnui</span>
          <span className="identity-name">psycho_b1o</span>
        </motion.header>

        <section
          className={`player glass ${playing ? "playing" : ""} ${portalOpen ? "collapsed" : ""} ${expanded ? "lyrics-mode" : ""}`}
          onPointerDown={onPlayerPointerDown}
        >
          <div className="player-collapsed">
            <button type="button" className="mini-play" onClick={togglePlay} aria-label={playing ? "Pause" : "Play"}>
              <PlayIcon playing={playing} />
            </button>
            <div className="mini-track">
              <span>{TRACK_NAME}</span>
              <i style={{ transform: `scaleX(${progress})` }} />
            </div>
            <span className="mini-index">01</span>
          </div>

          <div className="player-expanded">
            <div className="player-header">
              <span className="live-indicator">
                <i />
                {playing ? "live" : "idle"}
              </span>
              <span className="track-count">01 / 01</span>
            </div>

            <div className="visual-stage">
              <div className="visual-aura" />
              <div className="visual-ring ring-one" />
              <div className="visual-ring ring-two" />
              <div className="visual-ring ring-three" />
              <div className="glass-core">
                <div className="core-reflection" />
                <motion.div
                  className="core-pulse"
                  animate={playing ? { scale: [1, 1.14, 1], opacity: [0.28, 0.62, 0.28] } : { scale: 1, opacity: 0.2 }}
                  transition={playing ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
                />
                <div className="core-line" />
              </div>
              <Visualizer analyser={analyser} playing={playing} />
            </div>

            <div className="track-meta">
              <strong>{TRACK_NAME}</strong>
              <span>{ARTIST}</span>
            </div>

            <div className="player-controls">
              <motion.button
                type="button"
                className="play-button"
                onClick={togglePlay}
                whileTap={{ scale: 0.92 }}
                aria-label={playing ? "Pause" : "Play"}
              >
                <PlayIcon playing={playing} />
              </motion.button>
            </div>

            <div className="progress-track" onPointerDown={seek} role="slider" aria-label="Track progress">
              <div className="progress-fill" style={{ transform: `scaleX(${progress})` }} />
              <div className="progress-thumb" style={{ left: `${progress * 100}%` }} />
            </div>

            <div className="time-row">
              <span>
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
              <button type="button" onClick={() => setLyricsOpen((v) => !v)}>
                {lyricsOpen ? "COLLAPSE" : "LYRICS"}
              </button>
            </div>

            <div className={`lyrics-panel ${lyricsOpen ? "open" : ""}`}>
              {activeLyric && (
                <div className="lyric-spotlight">
                  <motion.div
                    key={activeLyric.time}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="lyric-current"
                  >
                    {activeLyric.text}
                  </motion.div>
                  {nextLyric && <div className="lyric-next">{nextLyric.text}</div>}
                </div>
              )}
            </div>
          </div>
        </section>

        <nav className="links" onPointerDown={(e) => e.stopPropagation()}>
          {LINKS.map((link, index) => (
            <div key={link.label} className={`link-row ${armedLink === index ? "active-row" : ""`}>
              <PortalLink
                link={link}
                armed={armedLink === index}
                onArm={() => setArmedLink(index)}
                onReset={() => setArmedLink(null)}
              />
            </div>
          ))}
        </nav>

        <footer className="footer">wqnui · blue glass</footer>
      </main>
    </div>
  );
}
