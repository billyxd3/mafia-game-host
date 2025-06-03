"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Mic, UserX, Plus, Minus, Skull } from "lucide-react"

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

interface PlayerCardProps {
  player: GamePlayer
  gamePhase: "day" | "night"
  onToggleNominated: () => void
  onToggleSpeaking: () => void
  onAddVote: () => void
  onRemoveVote: () => void
  onEliminate: () => void
  onRevive?: () => void
  maxVotes?: number
  totalVotesUsed?: number
  totalAlivePlayers?: number
}

export function PlayerCard({
  player,
  gamePhase,
  onToggleNominated,
  onToggleSpeaking,
  onAddVote,
  onRemoveVote,
  onEliminate,
  onRevive,
  maxVotes = 10,
  totalVotesUsed,
  totalAlivePlayers,
}: PlayerCardProps) {
  const getRoleClass = (role: string | undefined) => {
    if (!role) return "bg-gray-600 text-white"
    const lower = role.toLowerCase()
    if (lower.includes("don")) return "role-don text-white"
    if (lower.includes("mafia")) return "role-mafia text-white"
    if (lower.includes("detective")) return "role-detective text-white"
    if (lower.includes("doctor")) return "role-doctor text-white"
    if (lower.includes("citizen")) return "role-citizen text-black"
    return "bg-gray-600 text-white"
  }

  const cardClasses = [
    "mafia-player-card",
    player.isSpeaking && "speaking",
    player.isNominated && "nominated",
    !player.isAlive && "eliminated",
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <Card className={cardClasses}>
      <CardContent className="p-4">
        {/* Seat Number & Status */}
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-600 to-yellow-500 text-black rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
            {player.seatNumber}
          </div>
          {!player.isAlive && <Skull className="w-6 h-6 text-red-400" />}
        </div>

        <h3 className="font-semibold text-lg mb-3 truncate mafia-text">{player.name}</h3>

        {/* Role Badge */}
        <Badge className={`${getRoleClass(player.role)} text-xs mb-4 w-full justify-center font-semibold`}>
          {player.role}
        </Badge>

        {/* Status Chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {player.isSpeaking && (
            <Badge variant="outline" className="text-green-400 border-green-400 bg-green-400/10">
              <Mic className="w-3 h-3 mr-1" />
              Speaking
            </Badge>
          )}
          {player.isNominated && (
            <Badge variant="outline" className="text-orange-400 border-orange-400 bg-orange-400/10">
              Accused
            </Badge>
          )}
          {player.votes > 0 && (
            <Badge variant="outline" className="text-red-400 border-red-400 bg-red-400/10">
              {player.votes} votes
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {player.isAlive ? (
            <>
              {gamePhase === "day" && (
                <>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={onToggleNominated}
                      className={
                        player.isNominated ? "flex-1 mafia-btn-primary text-xs" : "flex-1 mafia-btn-secondary text-xs"
                      }
                    >
                      {player.isNominated ? "Accused" : "Accuse"}
                    </Button>
                    <Button
                      size="sm"
                      onClick={onToggleSpeaking}
                      className={
                        player.isSpeaking ? "flex-1 mafia-btn-primary text-xs" : "flex-1 mafia-btn-secondary text-xs"
                      }
                    >
                      <Mic className="w-3 h-3" />
                    </Button>
                  </div>

                  {player.isNominated && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Button size="sm" onClick={onRemoveVote} className="px-3 mafia-btn-secondary">
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="flex-1 text-center text-sm mafia-text font-medium">Votes: {player.votes}</span>
                        <Button
                          size="sm"
                          onClick={onAddVote}
                          className="px-3 mafia-btn-secondary"
                          disabled={(totalVotesUsed || 0) >= (totalAlivePlayers || 0)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      {totalVotesUsed !== undefined && totalAlivePlayers !== undefined && (
                        <p className="text-xs text-gray-400 text-center mafia-text">
                          Total: {totalVotesUsed}/{totalAlivePlayers}
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}

              <Button size="sm" onClick={onEliminate} className="w-full text-xs bg-red-800 hover:bg-red-700 text-white">
                <UserX className="w-3 h-3 mr-2" />
                Eliminate
              </Button>
            </>
          ) : (
            onRevive && (
              <Button
                size="sm"
                onClick={onRevive}
                className="w-full text-xs mafia-btn-secondary border-green-600 text-green-400"
              >
                Revive
              </Button>
            )
          )}
        </div>
      </CardContent>
    </Card>
  )
}
