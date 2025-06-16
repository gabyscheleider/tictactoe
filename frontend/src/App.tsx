import axios from "axios"
import { useEffect, useState } from 'react'
import './App.css'

type Players = "O" | "X"
type Game = {
  id: number;
  winner: string | null;
  draw: boolean;
};

function App() {
  const [turn, setTurn] = useState<Players>("O")
  const [firstPlayer, setFirstPlayer] = useState<Players>("O")
  const [winner, setWinner] = useState<Players | null>(null)
  const [draw, setDraw] = useState<boolean>(false)
  const [gameSaved, setGameSaved] = useState(false)

  const [marks, setMarks] = useState<{ [Key: string]: Players }>({})
  const gameOver = !!winner || draw

  const getSquares = () => new Array(9).fill(true)

  const play = (index: number) => {
    if (marks[index] || gameOver) return
    setMarks(prev => ({ ...prev, [index]: turn }))
    setTurn(prev => (prev === "O" ? "X" : "O"))
  }

  const getCellPlayer = (index: number) => marks[index]

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

    for (const [a, b, c] of victoryLines) {
      if (marks[a] && marks[a] === marks[b] && marks[a] === marks[c]) {
        return marks[a]
      }
    }

    return null
  }

  const saveGame = async (
    winnerParam: Players | null,
    drawParam: boolean,
    marksParam: { [key: string]: Players }
  ) => {
    try {
      const response = await axios.post("http://localhost:5206/api/game", {
        winner: winnerParam,
        draw: drawParam,
        marks: marksParam,
      })
      console.log("Dados enviados com sucesso:", response.data)
    } catch (error) {
      console.error("Erro ao salvar o jogo:", error)
    }
  }

  const reset = () => {
    const nextFirst = firstPlayer === "O" ? "X" : "O"
    setFirstPlayer(nextFirst)
    setTurn(nextFirst)
    setMarks({})
    setWinner(null)
    setDraw(false)
    setGameSaved(false)
  }

  const [savedWinners, setSavedWinners] = useState<Game[]>([])

  const fetchWinners = async () => {
    try {
      const response = await axios.get("http://localhost:5206/api/game/all")
      const winnersOnly = response.data.filter((game: Game) => game.winner)
      setSavedWinners(winnersOnly)
    } catch (error) {
      console.error("Erro ao buscar vencedores:", error)
    }
  }

  useEffect(() => {
    const winnerResult = getWinner()
    const isBoardFull = Object.keys(marks).length === 9

    if (!gameSaved && (winnerResult || isBoardFull)) {
      if (winnerResult) {
        setWinner(winnerResult)
        setDraw(false)
        saveGame(winnerResult, false, marks)
      } else {
        setWinner(null)
        setDraw(true)
        saveGame(null, true, marks)
      }
      setGameSaved(true)

      console.log("Dados do jogo:", JSON.stringify({
        marks: marks,
        winner: winnerResult ?? null,
        draw: !winnerResult
      }, null, 2))
    }

    fetchWinners()
  }, [marks])

  return (
    <div className='container'>
      {draw && <h1>Empate</h1>}
      {winner && !draw && <h1>"{winner}" ganhou</h1>}
      {!gameOver && <p>É a vez de "{turn}"</p>}
      {gameOver && <button onClick={reset}>Jogar novamente</button>}

      <div className={`board ${gameOver ? "gameOver" : ""}`}>
        {getSquares().map((_, i) => (
          <div
            key={i}
            className={`cell ${getCellPlayer(i)}`}
            onClick={() => play(i)}
          >
            {marks[i]}
          </div>
        ))}
      </div>

      <div className="saved-winners">
        <h2>Vencedores anteriores:</h2>
        {savedWinners.length === 0 ? (
          <p>Nenhum vencedor registrado ainda.</p>
        ) : (
          <ul>
            {savedWinners.map((game) => (
              <li key={game.id}>
                Jogo #{game.id}: {game.winner}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default App
