"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Trash2, Plus, Edit2, Check, X } from "lucide-react"

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

interface PlayerManagementModalProps {
  open: boolean
  onClose: () => void
  players: GamePlayer[]
  onUpdatePlayers: (players: GamePlayer[]) => void
  roles?: { name: string; color: string; faction: string }[]
}

export function PlayerManagementModal({ open, onClose, players, onUpdatePlayers, roles = [] }: PlayerManagementModalProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [newPlayerName, setNewPlayerName] = useState("")

  const startEdit = (player: GamePlayer) => {
    setEditingId(player.id)
    setEditName(player.name)
  }

  const saveEdit = () => {
    if (editName.trim()) {
      const updatedPlayers = players.map((p) => (p.id === editingId ? { ...p, name: editName.trim() } : p))
      onUpdatePlayers(updatedPlayers)
    }
    setEditingId(null)
    setEditName("")
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditName("")
  }

  const deletePlayer = (id: string) => {
    const newPlayers = players
      .filter((p) => p.id !== id)
      .map((p, index) => ({
        ...p,
        seatNumber: index + 1,
      }))
    onUpdatePlayers(newPlayers)
  }

  const addPlayer = () => {
    if (newPlayerName.trim()) {
      const newPlayer: GamePlayer = {
        id: `player-${Date.now()}`,
        name: newPlayerName.trim(),
        seatNumber: players.length + 1,
        role: "Citizen", // Default role
        roleColor: "bg-yellow-600 text-black",
        faction: "city",
        isAlive: true,
        isNominated: false,
        isSpeaking: false,
        votes: 0,
      }
      onUpdatePlayers([...players, newPlayer])
      setNewPlayerName("")
    }
  }

  const updateRole = (playerId: string, roleName: string) => {
    const roleInfo = roles.find((r) => r.name === roleName)
    onUpdatePlayers(
      players.map((p) =>
        p.id === playerId
          ? {
              ...p,
              role: roleName,
              roleColor: roleInfo?.color || p.roleColor,
              faction: roleInfo?.faction || p.faction,
            }
          : p,
      ),
    )
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Players</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Add New Player */}
          <div className="border-b border-gray-600 pb-4">
            <Label htmlFor="new-player">Add New Player</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="new-player"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                placeholder="Enter player name"
                className="bg-gray-700 border-gray-600"
                onKeyDown={(e) => e.key === "Enter" && addPlayer()}
              />
              <Button onClick={addPlayer} disabled={!newPlayerName.trim()}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Player List */}
          <div className="space-y-2">
            <Label>Current Players ({players.length})</Label>
            {players.map((player) => (
              <div key={player.id} className="flex items-center gap-2 p-2 bg-gray-700 rounded">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs">
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
                      <Check className="w-3 h-3 text-green-400" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={cancelEdit}>
                      <X className="w-3 h-3 text-red-400" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <span className="flex-1 text-sm">{player.name}</span>
                    <Select
                      value={player.role}
                      onValueChange={(val) => updateRole(player.id, val)}
                    >
                      <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600 text-xs">
                        {roles.map((r) => (
                          <SelectItem key={r.name} value={r.name}>
                            {r.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button size="sm" variant="ghost" onClick={() => startEdit(player)}>
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => deletePlayer(player.id)}>
                      <Trash2 className="w-3 h-3 text-red-400" />
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={onClose} className="flex-1">
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
