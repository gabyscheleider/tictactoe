import { useEffect, useState } from 'react'
import './App.css'

type Players = "O" | "X"

function App() {
  const [turn, setTurn] = useState<Players>("O")  
  const [winner, setWinner] = useState<Players | null>(null)
  const [draw, setDraw] = useState<boolean | null>(null)

  const [marks,setMarks] = useState<{[Key: string ]: Players}>({})
  const gameOver = !!winner || !!draw;

  const getSquares = () => {
      return new Array(9).fill(true)
  }

  const play = (index: number) => {
    if (marks[index] || gameOver){
      return
    }
    setMarks(prev => ({...prev, [index]: turn}))
    setTurn(prev => prev === "O" ? "X" : "O")
  }

  const getCellPlayer = (index: number) => {
    if(!marks[index]){
      return;
    }

    return marks[index]
  }

  const getWinner = () => {
    const victoryLines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],

      [0, 4, 8],
      [2, 4, 6],
      [0, 3, 6],

      [1, 4, 7],
      [2, 5, 8]
    ]

    for (const line of victoryLines){
      const [a, b, c] = line

      /* Função que verifica o vencedor */
      if (marks[a] && marks[a] === marks[b] && marks[a] === marks[c]){
        return marks[a]
      } else {
        if (Object.keys(marks).length === 9){
          setDraw(true)
        }
      }
    }
  }

  /* Função que reseta o jogo */
  const reset = () => {
    setTurn(marks[0] === "O" ? "X" : "O") /* Indica quem começa na rodada */
    setMarks({})
    setWinner(null)
    setDraw(null)
  }

  useEffect(() => {
    const winner = getWinner()

    if (winner) {
      setWinner(winner)
    }
  }, [marks])

  return (
    <div className='container'>
      {draw && <h1>Empate</h1>}
      {winner && !draw && <h1>{winner} ganhou</h1>}
      {!gameOver && <p>É a vez de "{turn}"</p>}
      {gameOver && <button onClick={reset}>Jogar novamente</button>}

      <div className={`board ${gameOver ? "gameOver" : null}`}>
        {getSquares().map((_,i) => (
          <div className={`cell ${getCellPlayer(i)}`} onClick={() => play(i)}>
            {marks[i]}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
