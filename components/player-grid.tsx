"use client"

import { PlayerCard } from "@/components/player-card"
import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"
import { PlayerManagementModal } from "@/components/player-management-modal"
import { useState } from "react"

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

interface PlayerGridProps {
  players: GamePlayer[]
  setPlayers: (players: GamePlayer[]) => void
  gamePhase: "day" | "night"
  onEliminatePlayer: (playerId: string) => void
  onRevivePlayer?: (playerId: string) => void
  availableRoles?: { name: string; color: string; faction: string }[]
}

export function PlayerGrid({ players, setPlayers, gamePhase, onEliminatePlayer, onRevivePlayer, availableRoles }: PlayerGridProps) {
  const [showPlayerManagement, setShowPlayerManagement] = useState(false)

  const togglePlayerStatus = (playerId: string, status: "nominated" | "speaking") => {
    setPlayers(
      players.map((p) => {
        if (p.id === playerId) {
          if (status === "nominated") {
            return { ...p, isNominated: !p.isNominated }
          } else {
            return { ...p, isSpeaking: !p.isSpeaking }
          }
        }
        if (status === "speaking" && p.isSpeaking) {
          return { ...p, isSpeaking: false }
        }
        return p
      }),
    )
  }

  const addVote = (playerId: string) => {
    const alivePlayers = players.filter((p) => p.isAlive).length
    const totalVotesAcrossAllPlayers = players.reduce((sum, p) => sum + p.votes, 0)

    // Limit total votes to number of alive players
    if (totalVotesAcrossAllPlayers < alivePlayers) {
      setPlayers(players.map((p) => (p.id === playerId ? { ...p, votes: p.votes + 1 } : p)))
    }
  }

  const removeVote = (playerId: string) => {
    setPlayers(players.map((p) => (p.id === playerId ? { ...p, votes: Math.max(0, p.votes - 1) } : p)))
  }

  // Calculate total votes used
  const totalVotesUsed = players.reduce((sum, p) => sum + p.votes, 0)
  const totalAlivePlayers = players.filter((p) => p.isAlive).length

  return (
    <div className="space-y-4">
      {/* Header with player management button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Players ({players.filter((p) => p.isAlive).length} alive)</h2>
        <Button variant="outline" size="sm" onClick={() => setShowPlayerManagement(true)} className="border-gray-600">
          <Users className="w-4 h-4 mr-2" />
          Manage Players
        </Button>
      </div>

      {/* Player Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {players.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            gamePhase={gamePhase}
            onToggleNominated={() => togglePlayerStatus(player.id, "nominated")}
            onToggleSpeaking={() => togglePlayerStatus(player.id, "speaking")}
            onAddVote={() => addVote(player.id)}
            onRemoveVote={() => removeVote(player.id)}
            onEliminate={() => onEliminatePlayer(player.id)}
            onRevive={onRevivePlayer ? () => onRevivePlayer(player.id) : undefined}
            maxVotes={totalAlivePlayers}
            totalVotesUsed={totalVotesUsed}
            totalAlivePlayers={totalAlivePlayers}
          />
        ))}
      </div>

      <PlayerManagementModal
        open={showPlayerManagement}
        onClose={() => setShowPlayerManagement(false)}
        players={players}
        onUpdatePlayers={setPlayers}
        roles={availableRoles}
      />
    </div>
  )
}
