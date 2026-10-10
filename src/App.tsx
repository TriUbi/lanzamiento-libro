import { useState } from 'react'
import './App.css'

function App() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <main className="invitation">
      {!isOpen ? (
        <section className="envelope-screen">
          <p className="eyebrow">Una carta para ti</p>

          <button
            className="envelope"
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Abrir mi carta"
          >
            <img
              className="envelope-image"
              src={`${import.meta.env.BASE_URL}sobre.png`}
              alt="Sobre cerrado con una invitación para ti"
            />
          </button>

          <h1>Hay palabras que quiero compartir contigo.</h1>
        </section>
      ) : (
        <section className="letter-view">
          <img
            className="letter"
            src={`${import.meta.env.BASE_URL}pergamino.png`}
            alt="Carta de Trinidad invitándote al lanzamiento de su segundo libro el sábado 7 de noviembre de 2026, de 15:00 a 20:00."
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