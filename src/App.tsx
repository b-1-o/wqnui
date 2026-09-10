import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import './App.css'

const REF = 'https://raw.githubusercontent.com/b-1-o/refs/main'
const images = ['more.jpg', 'assa.jpg', 'luja.jpg', 'chhc.jpg', 'snow.jpg', 'blfr.jpg']
const buttons = [
  { name: 'kksd', label: '01' },
  { name: 'alal', label: '02' },
  { name: 'provo', label: '03' },
  { name: 'anhy', label: '04' },
]
const tracks = [{ title: 'lovesong', artist: 'Kai Angel', src: `${REF}/Kai-Angel-lovesong-Official-Music-Video.mp3` }]
const links = [
  { title: 'Discord', sub: 'Rbu3h4US', href: 'https://discord.gg/Rbu3h4US', image: `${REF}/kksd.jpg` },
  { title: 'GitHub', sub: 'b-1-o', href: 'https://github.com/b-1-o', image: `${REF}/alal.jpg` },
]

function PlayIcon({ playing }: { playing: boolean }) {
  return playing ? <svg viewBox="0 0 24 24"><path d="M7 5h4v14H7zm6 0h4v14h-4z" /></svg> : <svg viewBox="0 0 24 24"><path d="m8 5 11 7-11 7z" /></svg>
}

function Visualizer({ playing }: { playing: boolean }) {
  return <div className={`visualizer ${playing ? 'active' : ''}`}>{Array.from({ length: 26 }, (_, i) => <i key={i} style={{ '--i': i } as React.CSSProperties} />)}</div>
}

export default function App() {
  const audio = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [image, setImage] = useState(0)
  const [armed, setArmed] = useState<number | null>(null)
  const track = tracks[0]
  const progress = duration ? time / duration : 0

  useEffect(() => {
    const a = audio.current
    if (!a) return
    const tick = () => setTime(a.currentTime)
    const loaded = () => setDuration(a.duration || 0)
    const ended = () => setPlaying(false)
    a.addEventListener('timeupdate', tick)
    a.addEventListener('loadedmetadata', loaded)
    a.addEventListener('ended', ended)
    return () => { a.removeEventListener('timeupdate', tick); a.removeEventListener('loadedmetadata', loaded); a.removeEventListener('ended', ended) }
  }, [])

  const toggle = () => {
    const a = audio.current
    if (!a) return
    if (a.paused) { void a.play().then(() => { setPlaying(true); setExpanded(true) }).catch(() => setPlaying(false)) }
    else { a.pause(); setPlaying(false) }
  }

  const seek = (value: number) => {
    const a = audio.current
    if (!a || !duration) return
    a.currentTime = value * duration
    setTime(a.currentTime)
  }

  const formatted = useMemo(() => {
    const f = (n: number) => `${Math.floor(n / 60)}:${String(Math.floor(n % 60)).padStart(2, '0')}`
    return `${f(time)} / ${f(duration)}`
  }, [time, duration])

  return <div className="app" onClick={() => armed !== null && setArmed(null)}>
    <div className="bg"><div className="fog one" /><div className="fog two" /><div className="vignette" /></div>
    <main className="page">
      <motion.header className="identity" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}>
        <span className="mark">wqnui</span><span className="handle">blue glass / b-1-o</span>
      </motion.header>

      <section className={`hero glass ${playing ? 'playing' : ''}`}>
        <div className="hero-glow" />
        <div className="orbit">{images.map((name, i) => <img key={name} src={`${REF}/${name}`} alt="" style={{ '--i': i } as React.CSSProperties} />)}</div>
        <motion.div className="hero-core" animate={{ rotate: playing ? 4 : -4, scale: playing ? 1.035 : 1 }} transition={{ duration: .7 }}>
          <img src={`${REF}/${images[image]}`} alt="" />
        </motion.div>
        <div className="hero-title"><small>b-1-o</small><h1>wqnui</h1><p>blue fog · translucent glass · rotating memories</p></div>
      </section>

      <section className={`player glass ${expanded ? 'expanded' : ''}`}>
        <audio ref={audio} src={track.src} preload="metadata" />
        <div className="player-top">
          <button className="play" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}><PlayIcon playing={playing} /></button>
          <div><div className="track-title">{track.title}</div><div className="track-sub">{track.artist} · official music video</div></div>
          <button className="expand" onClick={() => setExpanded(v => !v)}>{expanded ? '×' : '↗'}</button>
        </div>
        <Visualizer playing={playing} />
        <div className="progress-row"><span>{formatted}</span><input aria-label="Progress" type="range" min="0" max="1" step="0.001" value={progress} onChange={e => seek(Number(e.target.value))} /></div>
        <div className="lyrics"><div className="lyrics-title">LYRICS</div><div className="lyric active">Synced lyrics ready</div><div className="lyric-note">Add your licensed lyrics to the lyric data to display them here in sync with the track.</div></div>
      </section>

      <section className="buttons">{buttons.map((b, i) => <button key={b.name} className="image-button" onClick={() => setImage(i % images.length)}><img src={`${REF}/${b.name}.jpg`} alt="" /><span>{b.label}</span></button>)}</section>
      <section className="links">{links.map((link, i) => <div key={link.title} className={`portal ${armed === i ? 'armed' : ''}`} onClick={e => e.stopPropagation()}><div className="portal-face"><img src={link.image} alt="" /><span>{link.title}</span><small>{link.sub}</small><button onClick={() => setArmed(i)}>↗</button></div>{armed === i && <a className="portal-open" href={link.href} target="_blank" rel="noreferrer"><span>ENTER PORTAL</span> →</a>}</div>)}</section>
      <footer>made with react · typescript · framer motion</footer>
    </main>
  </div>
}
