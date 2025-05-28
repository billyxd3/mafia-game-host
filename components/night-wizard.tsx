"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, ChevronLeft, Check, RotateCcw, Sun } from "lucide-react"

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

type NightStep = "mafia-kill" | "don-check" | "detective-check" | "doctor-heal" | "review"

interface NightWizardProps {
  step: NightStep
  onStepChange: (step: NightStep) => void
  players: GamePlayer[]
  setPlayers: (players: GamePlayer[]) => void
  onPhaseComplete: () => void
  onResetTimer: (seconds: number) => void
  onTogglePhase: () => void
}

const steps: { id: NightStep; title: string; description: string; icon: string }[] = [
  { id: "mafia-kill", title: "The Hit", description: "Choose the target", icon: "🔫" },
  { id: "don-check", title: "Don's Investigation", description: "Investigate a suspect", icon: "👑" },
  { id: "detective-check", title: "Police Investigation", description: "Gather intelligence", icon: "🕵️" },
  { id: "doctor-heal", title: "Medical Protection", description: "Save a life", icon: "⚕️" },
  { id: "review", title: "Dawn Approaches", description: "Confirm the night's work", icon: "📋" },
]

export function NightWizard({
  step,
  onStepChange,
  players,
  setPlayers,
  onPhaseComplete,
  onResetTimer,
  onTogglePhase,
}: NightWizardProps) {
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null)
  const [nightActions, setNightActions] = useState<Record<string, string>>({})

  const currentStepIndex = steps.findIndex((s) => s.id === step)
  const currentStep = steps[currentStepIndex]
  const alivePlayers = players.filter((p) => p.isAlive)

  const handlePlayerSelect = (playerId: string) => {
    setSelectedTarget(playerId)
  }

  const confirmAction = () => {
    if (selectedTarget) {
      setNightActions((prev) => ({ ...prev, [step]: selectedTarget }))
      setSelectedTarget(null)

      if (currentStepIndex < steps.length - 1) {
        onStepChange(steps[currentStepIndex + 1].id)
      }
    }
  }

  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      onStepChange(steps[currentStepIndex - 1].id)
    }
  }

  const completeNight = () => {
    // Apply night actions
    const killedPlayerId = nightActions["mafia-kill"]
    const healedPlayerId = nightActions["doctor-heal"]

    // Only kill if not healed by doctor
    if (killedPlayerId && killedPlayerId !== healedPlayerId) {
      setPlayers(players.map((p) => (p.id === killedPlayerId ? { ...p, isAlive: false } : p)))
    }

    // Reset for next night
    setNightActions({})
    onPhaseComplete()
  }

  const getStepIcon = (stepId: NightStep) => {
    if (nightActions[stepId]) return <Check className="w-4 h-4 text-green-400" />
    if (stepId === step) return <div className="w-3 h-3 bg-yellow-600 rounded-full animate-pulse" />
    return <div className="w-3 h-3 bg-gray-600 rounded-full" />
  }

  return (
    <div className="space-y-4">
      <Card className="mafia-card vintage-overlay">
        <CardHeader>
          <CardTitle className="text-lg mafia-text">Night Operations</CardTitle>

          {/* Step Progress */}
          <div className="space-y-3 mt-4">
            {steps.map((s, index) => (
              <div key={s.id} className="flex items-center gap-3">
                {getStepIcon(s.id)}
                <span className="text-lg mr-2">{s.icon}</span>
                <span
                  className={`text-sm ${s.id === step ? "text-yellow-600 font-medium" : "text-gray-400"} mafia-text`}
                >
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {step !== "review" ? (
            <>
              <div className="mafia-card p-4 rounded">
                <h3 className="font-medium mb-2 mafia-text text-yellow-600 flex items-center gap-2">
                  <span className="text-2xl">{currentStep.icon}</span>
                  {currentStep.title}
                </h3>
                <p className="text-sm text-gray-400 mb-4 mafia-text italic">{currentStep.description}</p>
              </div>

              {/* Player Selection */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium mafia-text">Select Target:</h4>
                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                  {alivePlayers.map((player) => (
                    <Button
                      key={player.id}
                      variant={selectedTarget === player.id ? "default" : "outline"}
                      onClick={() => handlePlayerSelect(player.id)}
                      className={
                        selectedTarget === player.id
                          ? "mafia-btn-primary justify-start"
                          : "mafia-btn-secondary justify-start"
                      }
                    >
                      <span className="w-6 h-6 bg-yellow-600 text-black rounded-full flex items-center justify-center text-xs mr-3 font-bold">
                        {player.seatNumber}
                      </span>
                      <span className="mafia-text">{player.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={goToPreviousStep}
                  disabled={currentStepIndex === 0}
                  className="flex-1 mafia-btn-secondary"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
                <Button onClick={confirmAction} disabled={!selectedTarget} className="flex-1 mafia-btn-primary">
                  Confirm
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="mafia-card p-4 rounded">
                <h3 className="font-medium mb-4 mafia-text text-yellow-600">Night's Summary</h3>
                <div className="space-y-3">
                  {Object.entries(nightActions).map(([action, targetId]) => {
                    const target = players.find((p) => p.id === targetId)
                    const actionStep = steps.find((s) => s.id === action)
                    return (
                      <div key={action} className="flex justify-between items-center p-2 mafia-card rounded">
                        <span className="text-sm mafia-text flex items-center gap-2">
                          <span>{actionStep?.icon}</span>
                          {actionStep?.title}
                        </span>
                        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                          {target?.name}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={goToPreviousStep} className="flex-1 mafia-btn-secondary">
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
                <Button onClick={completeNight} className="flex-1 mafia-btn-primary">
                  Dawn Breaks
                  <Check className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </>
          )}

          {/* Phase Controls */}
          <div className="border-t border-gray-600 pt-4 space-y-2">
            <Button onClick={() => onResetTimer(30)} className="w-full mafia-btn-secondary">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Night Timer
            </Button>
            <Button onClick={onTogglePhase} className="w-full mafia-btn-primary">
              <Sun className="w-4 h-4 mr-2" />
              Force Dawn
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
