import { useEffect, useRef, useState } from 'react'
import './App.css'

// 7 de noviembre de 2026, 15:00 en Suecia (UTC+1).
const launchDate = new Date('2026-11-07T15:00:00+01:00').getTime()

function getTimeLeft() {
  const remaining = Math.max(0, launchDate - Date.now())

  return {
    remaining,
    days: Math.floor(remaining / 86_400_000),
    hours: Math.floor((remaining / 3_600_000) % 24),
    minutes: Math.floor((remaining / 60_000) % 60),
    seconds: Math.floor((remaining / 1_000) % 60),
  }
}

const stars = Array.from({ length: 180 }, (_, index) => {
  const number = index + 1

  return {
    id: index,
    x: ((number * 0.61803398875) % 1) * 100,
    y: ((number * 0.754877666) % 1) * 100,
    size: index % 9 === 0 ? 3 : index % 3 === 0 ? 2 : 1,
    duration: 2 + (index % 7) * 0.65,
    delay: -(index % 13) * 0.7,
  }
})

function App() {
  const [isOpen, setIsOpen] = useState(false)
  const [timeLeft, setTimeLeft] = useState(getTimeLeft)

  const pianoRef = useRef<HTMLAudioElement>(null)
  const voiceRef = useRef<HTMLAudioElement>(null)

  const pianoStartedRef = useRef(false)
  const voiceStartedRef = useRef(false)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft(getTimeLeft())
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  function openLetter() {
    setIsOpen(true)

    const piano = pianoRef.current
    const voice = voiceRef.current

    if (piano && !pianoStartedRef.current) {
      piano.volume = 0.02
      pianoStartedRef.current = true

      void piano.play().catch(() => {
        pianoStartedRef.current = false
      })
    }

    if (voice && !voiceStartedRef.current) {
      voice.volume = 1
      voiceStartedRef.current = true

      void voice.play().catch(() => {
        voiceStartedRef.current = false
      })
    }
  }

  const countdown = [
    { label: 'Días', value: timeLeft.days },
    { label: 'Horas', value: timeLeft.hours },
    { label: 'Minutos', value: timeLeft.minutes },
    { label: 'Segundos', value: timeLeft.seconds },
  ]

  return (
    <main className="invitation">
      <audio
        ref={pianoRef}
        src={`${import.meta.env.BASE_URL}piano.mp3`}
        loop
        preload="none"
      />

      <audio
        ref={voiceRef}
        src={`${import.meta.env.BASE_URL}trinidad-voice.mp3`}
        preload="auto"
      />

      <div className="starfield" aria-hidden="true">
        {stars.map((star) => (
          <span
            key={star.id}
            className="star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}

        <img
          className={`moon ${isOpen ? 'moon-letter' : 'moon-envelope'}`}
          src={`${import.meta.env.BASE_URL}luna.png`}
          alt=""
        />
      </div>

      {!isOpen ? (
        <section className="envelope-screen">
          <p className="eyebrow">Una carta para ti</p>

          <button
            className="envelope"
            type="button"
            onClick={openLetter}
            aria-label="Abrir mi carta"
          >
            <img
              className="envelope-image"
              src={`${import.meta.env.BASE_URL}sobre.png`}
              alt="Sobre cerrado con una invitación para ti"
            />
          </button>

          <div className="envelope-footer">
            <h1>Hay palabras que quiero compartir contigo.</h1>

            <div className="countdown">
              {timeLeft.remaining > 0 ? (
                <div className="countdown-values" role="timer">
                  {countdown.map((item) => (
                    <div className="countdown-unit" key={item.label}>
                      <span className="countdown-number">
                        {String(item.value).padStart(2, '0')}
                      </span>

                      <span className="countdown-label">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="countdown-title">
                  Ha llegado el momento de encontrarnos.
                </p>
              )}
            </div>
          </div>
        </section>
      ) : (
        <section className="letter-view">
          <img
            className="letter"
            src={`${import.meta.env.BASE_URL}pergamino.png`}
            alt="Invitación al lanzamiento del segundo libro de Trinidad."
          />

          <button
            className="open-button"
            type="button"
            onClick={() => setIsOpen(false)}
          >
            Volver al sobre
          </button>
        </section>
      )}
    </main>
  )
}

export default App