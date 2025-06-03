"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  RotateCw,
  Shuffle,
  Sun,
  Moon,
  Flag,
  Home,
} from "lucide-react"
import Link from "next/link"

interface GameHeaderProps {
  gameId: string
  gamePhase: "day" | "night"
  dayNumber: number
  timeRemaining: number
  isTimerRunning: boolean
  onToggleTimer: () => void
  onResetTimer: (seconds?: number) => void
  onTogglePhase: () => void
  onEndGame: () => void
  onReshuffleRoles: () => void
  onReshuffleAll: () => void
  onPreviousStep?: () => void
  onNextStep?: () => void
  currentSpeaker?: string
}

export function GameHeader({
  gameId,
  gamePhase,
  dayNumber,
  timeRemaining,
  isTimerRunning,
  onToggleTimer,
  onResetTimer,
  onTogglePhase,
  onEndGame,
  onReshuffleRoles,
  onReshuffleAll,
  onPreviousStep,
  onNextStep,
  currentSpeaker,
}: GameHeaderProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getPhaseColor = () => {
    return gamePhase === "day"
      ? "bg-gradient-to-r from-yellow-600 to-yellow-500"
      : "bg-gradient-to-r from-blue-800 to-blue-700"
  }

  const getPhaseIcon = () => {
    return gamePhase === "day" ? "☀️" : "🌙"
  }

  return (
    <div className="sticky top-0 z-50 mafia-header">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Phase Label & Game Info */}
        <div className="flex items-center gap-6">
          <Link href="/" className="text-gray-400 hover:text-yellow-600 transition-colors">
            <Home className="w-6 h-6" />
          </Link>
          <div className="border-l border-yellow-600 pl-6">
            <Badge className={`${getPhaseColor()} text-white text-xl px-4 py-2 font-bold`}>
              <span className="mr-2">{getPhaseIcon()}</span>
              {gamePhase === "day" ? `Day ${dayNumber}` : `Night ${dayNumber}`}
            </Badge>
            <p className="text-xs text-gray-400 mt-2 mafia-text">Operation: {gameId}</p>
            {currentSpeaker && gamePhase === "day" && (
              <p className="text-sm text-yellow-600 mt-1 mafia-text">
                🎤 Speaking: <span className="font-semibold">{currentSpeaker}</span>
              </p>
            )}
          </div>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="mafia-timer w-20 h-20 rounded-full flex items-center justify-center">
              <span className="text-xl font-mono font-bold text-yellow-600">{formatTime(timeRemaining)}</span>
            </div>
            {/* Pulse effect when timer is running */}
            {isTimerRunning && (
              <div className="absolute inset-0 rounded-full border-2 border-yellow-600 animate-ping opacity-30"></div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            onClick={onToggleTimer}
            className={isTimerRunning ? "mafia-btn-primary" : "mafia-btn-secondary"}
          >
            {isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </Button>

          {onPreviousStep && (
            <Button size="sm" onClick={onPreviousStep} className="mafia-btn-secondary">
              <SkipBack className="w-5 h-5" />
            </Button>
          )}

          {onNextStep && (
            <Button size="sm" onClick={onNextStep} className="mafia-btn-secondary">
              <SkipForward className="w-5 h-5" />
            </Button>
          )}

          <Button size="sm" onClick={() => onResetTimer()} className="mafia-btn-secondary">
            <RotateCcw className="w-5 h-5" />
          </Button>

          <Button size="sm" onClick={onReshuffleRoles} className="mafia-btn-secondary">
            <Shuffle className="w-5 h-5" />
          </Button>

          <Button size="sm" onClick={onReshuffleAll} className="mafia-btn-secondary">
            <RotateCw className="w-5 h-5" />
          </Button>

          <Button size="sm" onClick={onTogglePhase} className="mafia-btn-secondary">
            {gamePhase === "day" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </Button>

          <Button size="sm" onClick={onEndGame} className="bg-red-800 hover:bg-red-700 text-white">
            <Flag className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
