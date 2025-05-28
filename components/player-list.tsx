"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GripVertical, Trash2, Edit2, Check, X } from "lucide-react"

interface Player {
  id: string
  name: string
  seatNumber: number
}

interface PlayerListProps {
  players: Player[]
  setPlayers: (players: Player[]) => void
}

export function PlayerList({ players, setPlayers }: PlayerListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")

  const startEdit = (player: Player) => {
    setEditingId(player.id)
    setEditName(player.name)
  }

  const saveEdit = () => {
    if (editName.trim()) {
      setPlayers(players.map((p) => (p.id === editingId ? { ...p, name: editName.trim() } : p)))
    }
    setEditingId(null)
    setEditName("")
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditName("")
  }

  const deletePlayer = (id: string) => {
    const newPlayers = players.filter((p) => p.id !== id).map((p, index) => ({ ...p, seatNumber: index + 1 }))
    setPlayers(newPlayers)
  }

  const movePlayer = (fromIndex: number, toIndex: number) => {
    const newPlayers = [...players]
    const [movedPlayer] = newPlayers.splice(fromIndex, 1)
    newPlayers.splice(toIndex, 0, movedPlayer)

    // Reassign seat numbers
    const reorderedPlayers = newPlayers.map((p, index) => ({
      ...p,
      seatNumber: index + 1,
    }))

    setPlayers(reorderedPlayers)
  }

  return (
    <div className="space-y-2 max-h-64 overflow-y-auto">
      {players.map((player, index) => (
        <div key={player.id} className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg border border-gray-600">
          <GripVertical className="w-4 h-4 text-gray-400 cursor-grab" />

          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
            {player.seatNumber}
          </div>

          {editingId === player.id ? (
            <div className="flex-1 flex items-center gap-2">
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="bg-gray-600 border-gray-500 text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveEdit()
                  if (e.key === "Escape") cancelEdit()
                }}
                autoFocus
              />
              <Button size="sm" variant="ghost" onClick={saveEdit}>
                <Check className="w-4 h-4 text-green-400" />
              </Button>
              <Button size="sm" variant="ghost" onClick={cancelEdit}>
                <X className="w-4 h-4 text-red-400" />
              </Button>
            </div>
          ) : (
            <>
              <span className="flex-1 text-sm">{player.name}</span>
              <Button size="sm" variant="ghost" onClick={() => startEdit(player)}>
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => deletePlayer(player.id)}>
                <Trash2 className="w-4 h-4 text-red-400" />
              </Button>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
