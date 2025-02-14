import './App.css'
import { useState } from 'react'
import { WinnerModal } from './componentes/WinwerModal'
import confetti from 'canvas-confetti'
import { Turns, cobinations } from './logica/Constantes'
import { saveGameToStorage, resetGameStorage } from './logica/storage'
import { Square } from './componentes/Square'
import { ButtonReset } from './componentes/ButonReset'


function App() {
  const [board, setBoard] = useState (() => {
    const boardStorage = window.localStorage.getItem('board')
    if (boardStorage) {
      return JSON.parse(boardStorage)
    }
    return Array(9).fill(null)
  })
  const [turn, setTurn] = useState(() => {
    const turnStorage = window.localStorage.getItem('turn')
    if (turnStorage) {
      return turnStorage
    }
    return Turns.x
  })
  const [log, setLog] = useState([])
  const [winner, setWinner] = useState(null)

  const checkWinner = (board) => {
    for (let i = 0; i < cobinations.length; i++) {
      const [a, b, c] = cobinations[i]
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a]
      }
    }
    return null
  }

  const updateBoard = (index) => {
    // checar si el cuadro ya esta ocupado o si ya hay un ganador
    if (board[index] ||winner) {
      return
    }
    
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)
    //console.log(newBoard)

    const newLog = [...log, index]
    setLog(newLog)
    //console.log(newLog);
    
    const newTurn = turn === Turns.x ? Turns.o : Turns.x
    setTurn(newTurn) 
     // guardar aqui partida
    saveGameToStorage({
      board: newBoard,
      turn: newTurn
    })
    const Winner = checkWinner(newBoard)
    if (Winner) {
   // actualiza el estado pero de manera asincrona , no detiene la ejecucion
      confetti()
      setWinner(Winner)
    }
    if(newBoard.every(square => square !== null)) {
      const twoFirstpositions = newLog.slice(0, 2)
      newBoard[twoFirstpositions[0]] = null
      newBoard[twoFirstpositions[1]] = null
      newLog.shift()
      newLog.shift()    
      setBoard(newBoard)
      setLog(newLog)
      return
    }
  }
  return (
    <>
      < main className='board'>
      <h1> 3 en raya</h1>
       <ButtonReset Reset={() => {
        setBoard(Array(9).fill(null))
        setTurn(Turns.x)
        setWinner(null)
        setLog([]) 
        resetGameStorage()
      }}/>
      <section className='game'>
        {
          board.map((square, index) => {
            return (
                <Square key={index} index={index}  updateBoard={updateBoard}>
                  {square}
                </Square>
              )
        })
      }
        <section className='turn'>
          <Square isSelected= {turn === Turns.x} >
            {Turns.x}
          </Square>
          <Square isSelected= {turn === Turns.o}>
            {Turns.o}
          </Square>
        </section>
      </section>
      <section>
      </section>
      <WinnerModal winner={winner} onClose={() => {
        setBoard(Array(9).fill(null))
        setTurn(Turns.x)
        setWinner(null)
        setLog([]) 
        resetGameStorage()
      }}/>
      </main>
    </>
  )
}

export default App
