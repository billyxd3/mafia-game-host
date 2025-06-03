"use client"

import { useState, useEffect } from "react"
import { GameHeader } from "@/components/game-header"
import { PlayerGrid } from "@/components/player-grid"
import { NightWizard } from "@/components/night-wizard"
import { DayPhasePanel } from "@/components/day-phase-panel"
import { EndGameModal } from "@/components/end-game-modal"
import { ReshuffleModal } from "@/components/reshuffle-modal"

interface GamePlayer {
  id: string
  name: string
  seatNumber: number
  role: string
  roleColor: string
  faction: "mafia" | "city" | "neutral"
  isAlive: boolean
  isNominated: boolean
  isSpeaking: boolean
  votes: number
}

type GamePhase = "day" | "night"
type NightStep = "mafia-kill" | "don-check" | "detective-check" | "doctor-heal" | "review"

export default function GameDashboard({ params }: { params: { id: string } }) {
  const [gamePhase, setGamePhase] = useState<GamePhase>("day")
  const [dayNumber, setDayNumber] = useState(1)
  const [timeRemaining, setTimeRemaining] = useState(60)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [nightStep, setNightStep] = useState<NightStep>("mafia-kill")
  const [showEndGameModal, setShowEndGameModal] = useState(false)
  const [showReshuffleModal, setShowReshuffleModal] = useState(false)
  const [gameWinner, setGameWinner] = useState<"mafia" | "city" | null>(null)

  const [players, setPlayers] = useState<GamePlayer[]>([])
  const [gameConfig, setGameConfig] = useState<any>(null)
  const [nightActions, setNightActions] = useState<Record<string, string>>({})
  const [currentSpeakerIndex, setCurrentSpeakerIndex] = useState(0)

  // Load game configuration and shuffle roles
  useEffect(() => {
    const savedConfig = localStorage.getItem(`game-${params.id}`)
    if (savedConfig) {
      const config = JSON.parse(savedConfig)
      setGameConfig(config)

      // Create role array based on configuration
      const roleArray: string[] = []
      config.roles.forEach((role: any) => {
        for (let i = 0; i < role.count; i++) {
          roleArray.push(role.name)
        }
      })

      // Shuffle roles
      const shuffledRoles = [...roleArray].sort(() => Math.random() - 0.5)

      // Assign roles to players
      const playersWithRoles = config.players.map((player: any, index: number) => ({
        ...player,
        role: shuffledRoles[index],
        roleColor: config.roles.find((r: any) => r.name === shuffledRoles[index])?.color || "bg-gray-600 text-white",
        faction: config.roles.find((r: any) => r.name === shuffledRoles[index])?.faction || "city",
        isAlive: true,
        isNominated: false,
        isSpeaking: false,
        votes: 0,
      }))

      setPlayers(playersWithRoles)
    }
  }, [params.id])

  // Add reshuffle function
  const reshuffleRoles = () => {
    if (!gameConfig) return

    const roleArray: string[] = []
    gameConfig.roles.forEach((role: any) => {
      for (let i = 0; i < role.count; i++) {
        roleArray.push(role.name)
      }
    })

    // Shuffle roles
    const shuffledRoles = [...roleArray].sort(() => Math.random() - 0.5)

    // Shuffle players (but keep their original data)
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5)

    // Assign shuffled players to seats 1, 2, 3... in order with shuffled roles
    setPlayers(
      shuffledPlayers.map((player, index) => ({
        ...player,
        seatNumber: index + 1, // Seats always stay in order 1, 2, 3, 4...
        role: shuffledRoles[index],
        roleColor:
          gameConfig.roles.find((r: any) => r.name === shuffledRoles[index])?.color || "bg-gray-600 text-white",
        faction: gameConfig.roles.find((r: any) => r.name === shuffledRoles[index])?.faction || "city",
        isAlive: true,
        isNominated: false,
        isSpeaking: false,
        votes: 0,
      })),
    )

    // Reset game state
    setGamePhase("day")
    setDayNumber(1)
    setNightActions({})
  }

  // Add revive player function
  const revivePlayer = (playerId: string) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === playerId ? { ...p, isAlive: true, isNominated: false, votes: 0 } : p)),
    )
  }

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, timeRemaining])

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning)
  }

  const resetTimer = (seconds = 60) => {
    setTimeRemaining(seconds)
    setIsTimerRunning(true) // Auto-start timer when reset
  }

  const moveToNextSpeaker = () => {
    const alivePlayers = players.filter((p) => p.isAlive)
    if (alivePlayers.length === 0) return

    // Clear current speaker
    setPlayers((prev) => prev.map((p) => ({ ...p, isSpeaking: false })))

    // Find next alive player
    let nextIndex = currentSpeakerIndex
    do {
      nextIndex = (nextIndex + 1) % players.length
    } while (!players[nextIndex]?.isAlive && nextIndex !== currentSpeakerIndex)

    setCurrentSpeakerIndex(nextIndex)

    // Set new speaker
    setPlayers((prev) =>
      prev.map((p, index) => (index === nextIndex ? { ...p, isSpeaking: true } : { ...p, isSpeaking: false })),
    )
  }

  const moveToPreviousSpeaker = () => {
    const alivePlayers = players.filter((p) => p.isAlive)
    if (alivePlayers.length === 0) return

    // Clear current speaker
    setPlayers((prev) => prev.map((p) => ({ ...p, isSpeaking: false })))

    // Find previous alive player
    let prevIndex = currentSpeakerIndex
    do {
      prevIndex = prevIndex === 0 ? players.length - 1 : prevIndex - 1
    } while (!players[prevIndex]?.isAlive && prevIndex !== currentSpeakerIndex)

    setCurrentSpeakerIndex(prevIndex)

    // Set new speaker
    setPlayers((prev) =>
      prev.map((p, index) => (index === prevIndex ? { ...p, isSpeaking: true } : { ...p, isSpeaking: false })),
    )
  }

  const togglePhase = () => {
    if (gamePhase === "day") {
      setGamePhase("night")
      setNightStep("mafia-kill")
      resetTimer(30)
    } else {
      setGamePhase("day")
      setDayNumber((prev) => prev + 1)
      resetTimer(60)
      // Move to next speaker for new day
      moveToNextSpeaker()
    }
  }

  const checkWinCondition = () => {
    const alivePlayers = players.filter((p) => p.isAlive)
    const aliveMafia = alivePlayers.filter((p) => p.faction === "mafia")
    const aliveCity = alivePlayers.filter((p) => p.faction === "city")

    if (aliveMafia.length === 0) {
      setGameWinner("city")
      setShowEndGameModal(true)
    } else if (aliveMafia.length >= aliveCity.length) {
      setGameWinner("mafia")
      setShowEndGameModal(true)
    }
  }

  const eliminatePlayer = (playerId: string, isNightKill = false) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === playerId ? { ...p, isAlive: false, isNominated: false, votes: 0 } : p)),
    )

    if (isNightKill) {
      // Store night kill for doctor healing check
      setNightActions((prev) => ({ ...prev, "mafia-kill": playerId }))
    }

    setTimeout(checkWinCondition, 100)
  }

  useEffect(() => {
    if (players.length > 0 && dayNumber === 1) {
      const firstAliveIndex = players.findIndex((p) => p.isAlive)
      if (firstAliveIndex !== -1) {
        setCurrentSpeakerIndex(firstAliveIndex)
        setPlayers((prev) =>
          prev.map((p, index) =>
            index === firstAliveIndex ? { ...p, isSpeaking: true } : { ...p, isSpeaking: false },
          ),
        )
      }
    }
  }, [players.length])

  return (
    <div className="min-h-screen mafia-bg">
      <GameHeader
        gameId={params.id}
        gamePhase={gamePhase}
        dayNumber={dayNumber}
        timeRemaining={timeRemaining}
        isTimerRunning={isTimerRunning}
        onToggleTimer={toggleTimer}
        onResetTimer={resetTimer}
        onTogglePhase={togglePhase}
        onEndGame={() => setShowEndGameModal(true)}
        onReshuffleRoles={() => setShowReshuffleModal(true)}
        onPreviousStep={moveToPreviousSpeaker}
        onNextStep={moveToNextSpeaker}
        currentSpeaker={players.find((p) => p.isSpeaking)?.name}
      />

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Player Grid */}
          <div className="lg:col-span-3">
            <PlayerGrid
              players={players}
              setPlayers={setPlayers}
              gamePhase={gamePhase}
              onEliminatePlayer={eliminatePlayer}
              onRevivePlayer={revivePlayer}
            />
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-1">
            {gamePhase === "night" ? (
              <NightWizard
                step={nightStep}
                onStepChange={setNightStep}
                players={players}
                setPlayers={setPlayers}
                onPhaseComplete={togglePhase}
                onResetTimer={resetTimer}
                onTogglePhase={togglePhase}
                onCheckWinCondition={checkWinCondition}
              />
            ) : (
              <DayPhasePanel
                players={players}
                setPlayers={setPlayers}
                onEliminatePlayer={eliminatePlayer}
                onResetTimer={resetTimer}
                onTogglePhase={togglePhase}
              />
            )}
          </div>
        </div>
      </div>

      <EndGameModal
        open={showEndGameModal}
        winner={gameWinner}
        onClose={() => setShowEndGameModal(false)}
        onNewGame={() => window.location.reload()}
      />

      <ReshuffleModal
        open={showReshuffleModal}
        onClose={() => setShowReshuffleModal(false)}
        onConfirm={() => {
          reshuffleRoles()
          setShowReshuffleModal(false)
        }}
      />
    </div>
  )
}
