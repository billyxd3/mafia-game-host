"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertTriangle } from "lucide-react"

interface ReshuffleModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

export function ReshuffleModal({ open, onClose, onConfirm }: ReshuffleModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            Reshuffle Roles
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to reshuffle all player roles? This action cannot be undone and will randomly reassign
            roles to all players.
          </p>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={onConfirm} variant="destructive" className="flex-1">
              Reshuffle
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
