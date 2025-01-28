export function WinnerModal({ winner, onClose }) {
  if (winner === null) {
    return null
    
  }
    return (
    <div className='winner'>
      <div className='text'>
        <h2>Felicitaciones eres un crack</h2>
        <header className="win">
            {winner && <h1>El ganador es {winner}</h1>}
        </header>
        <footer>
        <button onClick={onClose}>Reiniciar</button>
        </footer>
       
      </div>
    </div>
  )
    
}
