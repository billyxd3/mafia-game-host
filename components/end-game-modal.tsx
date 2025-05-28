"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Trophy, Users, Skull } from "lucide-react"

interface EndGameModalProps {
  open: boolean
  winner: "mafia" | "city" | null
  onClose: () => void
  onNewGame: () => void
}

export function EndGameModal({ open, winner, onClose, onNewGame }: EndGameModalProps) {
  const getWinnerInfo = () => {
    if (winner === "mafia") {
      return {
        title: "Mafia Wins!",
        icon: <Skull className="w-16 h-16 text-red-400" />,
        description: "The Mafia has eliminated enough citizens to take control of the town.",
        color: "text-red-400",
      }
    } else if (winner === "city") {
      return {
        title: "City Wins!",
        icon: <Users className="w-16 h-16 text-blue-400" />,
        description: "The citizens have successfully eliminated all Mafia members.",
        color: "text-blue-400",
      }
    }
    return {
      title: "Game Over",
      icon: <Trophy className="w-16 h-16 text-gray-400" />,
      description: "The game has ended.",
      color: "text-gray-400",
    }
  }

  const winnerInfo = getWinnerInfo()

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white text-center">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="flex flex-col items-center gap-4">
              {winnerInfo.icon}
              <h2 className={`text-3xl font-bold ${winnerInfo.color}`}>{winnerInfo.title}</h2>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-gray-300 text-lg">{winnerInfo.description}</p>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
            <Button onClick={onNewGame} className="flex-1 bg-green-600 hover:bg-green-700">
              New Game
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
