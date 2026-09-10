import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./App.css";

const REF_BASE = "https://raw.githubusercontent.com/b-1-o/refs/main";
const MAIN_BG = `${REF_BASE}/more.jpg`;
const BG_POOL = [
  `${REF_BASE}/more.jpg`,
  `${REF_BASE}/assa.jpg`,
  `${REF_BASE}/luja.jpg`,
  `${REF_BASE}/chhc.jpg`,
  `${REF_BASE}/snow.jpg`,
  `${REF_BASE}/blfr.jpg`,
];
const TRACK = `${REF_BASE}/Kai-Angel-lovesong-Official-Music-Video.mp3`;
const TRACK_NAME = "lovesong";
const ARTIST = "Kai Angel";

const LINKS = [
  { label: "TikTok", username: "@psycho_b1o", href: "https://www.tiktok.com/@psycho_b1o", glyph: "♪", image: `${REF_BASE}/kksd.jpg` },
  { label: "Instagram", username: "@__._saint", href: "https://www.instagram.com/__._saint", glyph: "◎", image: `${REF_BASE}/alal.jpg` },
  { label: "Music", username: "@blood_on_music", href: "https://t.me/blood_on_music", glyph: "◈", image: `${REF_BASE}/provo.jpg` },
  { label: "Discord", username: "discord.gg/Rbu3h4US", href: "https://discord.gg/Rbu3h4US", glyph: "◌", image: `${REF_BASE}/anhy.jpg` },
  { label: "GitHub", username: "b-1-o", href: "https://github.com/b-1-o", glyph: "⌘", image: `${REF_BASE}/snow.jpg` },
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
    <svg viewBox="0 0 24 24"><path d="M7.5 5.5h3v13h-3zm6 0h3v13h-3z" /></svg>
  ) : (
    <svg viewBox="0 0 24 24"><path d="m8.5 5.8 10 6.2-10 6.2z" /></svg>
  );
}
function Chevron({ direction = "right" }: { direction?: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24">
      <path d={direction === "right" ? "m9 5 7 7-7 7" : "m15 5-7 7 7 7"} />
    </svg>
  );
}
function ShuffleIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M4 7h2.2c2.4 0 3.8 1.8 5.1 5s2.7 5 5.2 5H20m-3-3 3 3-3 3M4 17h2.2c1.6 0 2.8-.8 3.8-2.1M14.3 9.1C15.5 7.7 16.5 7 18 7H20m-3-3 3 3-3 3" />
    </svg>
  );
}

function Visualizer({ analyser, playing }: { analyser: AnalyserNode | null; playing: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !ctx) return;
    let raf = 0;
    let width = 1;
    let height = 1;
    const data = new Uint8Array(analyser?.frequencyBinCount || 128);
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      width = Math.max(1, r.width);
      height = Math.max(1, r.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 1.2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });
    if (!playing) {
      ctx.clearRect(0, 0, width, height);
      window.removeEventListener("resize", resize);
      return () => window.removeEventListener("resize", resize);
    }
    const count = 24;
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

function Background({ playing, bgIndex }: { playing: boolean; bgIndex: number }) {
  const source = playing ? BG_POOL[bgIndex % BG_POOL.length] : MAIN_BG;
  return (
    <div className="background">
      <AnimatePresence initial={false} mode="sync">
        <motion.img
          key={source}
          className="background-image"
          src={source}
          alt=""
          initial={{ opacity: 0, scale: 1.025 }}
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
    <div className={`portal-shell ${armed ? "armed" : ""}`}>
      <div className="portal-card glass" onPointerDown={(e) => e.stopPropagation()}>
        <div className="portal-face">
          <span className="portal-glyph">{link.glyph}</span>
          <span className="portal-label">{link.label}</span>
          <span className="portal-orbit">↗</span>
        </div>
        <div className="portal-open">
          <div className="social-art">
            <img src={link.image} alt="" loading="eager" decoding="async" />
            <span className="social-art-shine" />
          </div>
          <div className="portal-copy">
            <strong>{link.label}</strong>
            <span>{link.username}</span>
            <small>ENTER THE PORTAL</small>
          </div>
          <a className="portal-go" href={link.href} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} aria-label={`Open ${link.label}`}>
            <Chevron />
          </a>
          <button className="portal-close" onClick={onReset} aria-label={`Close ${link.label}`}>
            ×
          </button>
        </div>
        {!armed && <button className="portal-hit" onClick={onArm} aria-label={`Open ${link.label}`} />}
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
  const playingRef = useRef(false);
  const armedRef = useRef<number | null>(null);

  useEffect(() => { playingRef.current = playing; }, [playing]);
  useEffect(() => { armedRef.current = armedLink; }, [armedLink]);

  const setupAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audioContextRef.current) {
      const Ctor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
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
      } catch { /* already connected */ }
    }
    if (audioContextRef.current.state === "suspended") void audioContextRef.current.resume();
  }, []);

  useEffect(() => {
    const audio = new Audio(TRACK);
    audio.crossOrigin = "anonymous";
    audio.preload = "auto";
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
    const onEnded = () => { setPlaying(false); setLyricsOpen(false); };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.pause();
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

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setBgIndex((i) => (i + 1) % BG_POOL.length), 12000);
    return () => clearInterval(id);
  }, [playing]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setupAudio();
    if (audio.paused) {
      void audio.play().then(() => {
        setPlaying(true);
        setLyricsOpen(true);
      }).catch(() => setPlaying(false));
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

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
  const nextLyric = activeLyricIndex >= 0 && activeLyricIndex + 1 < LYRICS.length ? LYRICS[activeLyricIndex + 1] : null;

  const expanded = playing || lyricsOpen;

  return (
    <div className="app" onPointerDown={() => armedLink !== null && setArmedLink(null)}>
      <Background playing={playing} bgIndex={bgIndex} />
      <main className={`page ${armedLink !== null ? "portal-open-page" : ""}`}>
        <motion.header
          className="identity"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="identity-mark">wqnui</span>
          <span className="identity-name">psycho_b1o</span>
        </motion.header>

        <section
          className={`player glass ${playing ? "playing" : ""} ${armedLink !== null ? "collapsed" : ""} ${expanded ? "lyrics-mode" : ""}`}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div className="player-collapsed">
            <button className="mini-play" onClick={togglePlay} aria-label={playing ? "Pause" : "Play"}>
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
              <span className="live-indicator"><i />{playing ? "live" : "idle"}</span>
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
                  animate={playing ? { scale: [1, 1.16, 1], opacity: [0.28, 0.66, 0.28] } : { scale: 1, opacity: 0.2 }}
                  transition={playing ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" } : { duration: 0.25 }}
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
              <button className="control-button" aria-label="Shuffle" disabled><ShuffleIcon /></button>
              <button className="control-button" aria-label="Previous" disabled><Chevron direction="left" /></button>
              <motion.button className="play-button" onClick={togglePlay} whileTap={{ scale: 0.92 }} aria-label={playing ? "Pause" : "Play"}>
                <PlayIcon playing={playing} />
              </motion.button>
              <button className="control-button" aria-label="Next" disabled><Chevron /></button>
            </div>

            <div className="progress-track" onPointerDown={seek} role="slider" aria-label="Track progress">
              <div className="progress-fill" style={{ transform: `scaleX(${progress})` }} />
              <div className="progress-thumb" style={{ left: `${progress * 100}%` }} />
            </div>

            <div className="time-row">
              <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
              <button type="button" onClick={() => setLyricsOpen((v) => !v)}>
                {lyricsOpen ? "COLLAPSE" : "LYRICS"}
              </button>
            </div>

            <div className={`lyrics-panel ${lyricsOpen ? "open" : ""}`}>
              <div className="lyrics-scroll">
                {LYRICS.map((line, i) => {
                  const isActive = i === activeLyricIndex;
                  const isPast = i < activeLyricIndex;
                  return (
                    <div key={`${line.time}-${i}`} className={`lyric-line ${isActive ? "active" : ""} ${isPast ? "past" : ""}`}>
                      {line.text}
                    </div>
                  );
                })}
              </div>
              {activeLyric && (
                <div className="lyric-spotlight">
                  <motion.div
                    key={activeLyric.time}
                    initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.35 }}
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

        <motion.nav
          className="links"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.055, delayChildren: 0.2 } } }}
        >
          {LINKS.map((link, index) => (
            <motion.div
              key={link.label}
              className={`link-row ${armedLink === index ? "active-row" : ""}`}
              variants={{ hidden: { opacity: 1 }, show: { opacity: 1 } }}
            >
              <PortalLink link={link} armed={armedLink === index} onArm={() => setArmedLink(index)} onReset={() => setArmedLink(null)} />
            </motion.div>
          ))}
        </motion.nav>

        <motion.footer className="footer" initial={{ opacity: 0 }} animate={{ opacity: 0.42 }} transition={{ delay: 0.7, duration: 0.5 }}>
          wqnui · blue glass
        </motion.footer>
      </main>
    </div>
  );
}
