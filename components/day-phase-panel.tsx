"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Lock, Timer, Gavel, RotateCcw, Moon } from "lucide-react"

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

interface DayPhasePanelProps {
  players: GamePlayer[]
  setPlayers: (players: GamePlayer[]) => void
  onEliminatePlayer: (playerId: string) => void
  onResetTimer: (seconds: number) => void
  onTogglePhase: () => void
}

export function DayPhasePanel({
  players,
  setPlayers,
  onEliminatePlayer,
  onResetTimer,
  onTogglePhase,
}: DayPhasePanelProps) {
  const [votesLocked, setVotesLocked] = useState(false)

  const nominees = players.filter((p) => p.isNominated && p.isAlive)
  const totalVotes = nominees.reduce((sum, p) => sum + p.votes, 0)

  const executePlayer = () => {
    if (nominees.length === 0) return

    // Find player with most votes
    const maxVotes = Math.max(...nominees.map((p) => p.votes))

    if (maxVotes > 0) {
      const playersWithMaxVotes = nominees.filter((p) => p.votes === maxVotes)

      let playerToExecute
      if (playersWithMaxVotes.length === 1) {
        playerToExecute = playersWithMaxVotes[0]
      } else {
        // In case of tie, eliminate the last nominated
        playerToExecute = playersWithMaxVotes[playersWithMaxVotes.length - 1]
      }

      // Execute the player
      onEliminatePlayer(playerToExecute.id)

      // Reset nominations and votes for all players
      setPlayers((prev) => prev.map((p) => ({ ...p, isNominated: false, votes: 0 })))
      setVotesLocked(false)
    }
  }

  const clearNominations = () => {
    setPlayers(players.map((p) => ({ ...p, isNominated: false, votes: 0 })))
    setVotesLocked(false)
  }

  const startDefenseTimer = () => {
    onResetTimer(30)
  }

  return (
    <div className="space-y-4">
      <Card className="mafia-card vintage-overlay">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 mafia-text">
            <Gavel className="w-5 h-5 text-yellow-600" />
            Day Phase - The Trial
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Nominees List */}
          <div>
            <h3 className="font-medium mb-3 mafia-text">Accused ({nominees.length})</h3>
            {nominees.length === 0 ? (
              <p className="text-gray-400 text-sm mafia-text">No one stands accused</p>
            ) : (
              <div className="space-y-2">
                {nominees.map((player) => (
                  <div key={player.id} className="flex items-center justify-between p-3 mafia-card rounded">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-yellow-600 text-black rounded-full flex items-center justify-center text-xs font-bold">
                        {player.seatNumber}
                      </span>
                      <span className="text-sm mafia-text">{player.name}</span>
                    </div>
                    <Badge variant="outline" className="text-red-400 border-red-400">
                      {player.votes} votes
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator className="bg-yellow-600/30" />

          {/* Defense Timer */}
          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2 mafia-text">
              <Timer className="w-4 h-4 text-yellow-600" />
              Defense Time
            </h3>
            <Button onClick={startDefenseTimer} className="w-full mafia-btn-secondary">
              Start 30s Defense Timer
            </Button>
          </div>

          <Separator className="bg-yellow-600/30" />

          {/* Voting Panel */}
          <div>
            <h3 className="font-medium mb-3 mafia-text">The Verdict</h3>
            <div className="space-y-3">
              <div className="text-sm text-gray-400 mafia-text">Total votes cast: {totalVotes}</div>

              <Button
                onClick={() => setVotesLocked(!votesLocked)}
                variant={votesLocked ? "default" : "outline"}
                className={votesLocked ? "w-full mafia-btn-primary" : "w-full mafia-btn-secondary"}
              >
                <Lock className="w-4 h-4 mr-2" />
                {votesLocked ? "Votes Sealed" : "Seal the Votes"}
              </Button>

              {nominees.length > 0 && (
                <>
                  <Button
                    onClick={executePlayer}
                    disabled={!votesLocked || nominees.every((p) => p.votes === 0)}
                    variant="destructive"
                    className="w-full bg-red-800 hover:bg-red-700"
                  >
                    Execute the Condemned
                  </Button>
                  <p className="text-xs text-gray-400 mafia-text text-center">
                    The family has spoken. Justice will be served.
                  </p>

                  <Button onClick={clearNominations} className="w-full mafia-btn-secondary">
                    Dismiss All Charges
                  </Button>
                </>
              )}
            </div>
          </div>

          <Separator className="bg-yellow-600/30" />

          {/* Phase Controls */}
          <div>
            <h3 className="font-medium mb-3 mafia-text">Phase Control</h3>
            <div className="space-y-2">
              <Button onClick={() => onResetTimer(60)} className="w-full mafia-btn-secondary">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Day Timer
              </Button>
              <Button onClick={onTogglePhase} className="w-full mafia-btn-primary">
                <Moon className="w-4 h-4 mr-2" />
                Begin the Night
              </Button>
            </div>
          </div>

          {/* Rules */}
          <div className="text-xs text-gray-400 p-3 mafia-card rounded vintage-overlay">
            <strong className="mafia-text text-yellow-600">The Code:</strong>
            <ul className="mt-2 space-y-1 mafia-text">
              <li>• The family votes on the accused</li>
              <li>• Silence equals consent to the last accusation</li>
              <li>• In ties, the last accused pays the price</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
