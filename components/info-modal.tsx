"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Info } from "lucide-react"

interface InfoModalProps {
  open: boolean
  onClose: () => void
}

export function InfoModal({ open, onClose }: InfoModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            How to Use
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-sm">
          <p>Use the controls in the header to manage the game timer and phases.</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Play/Pause toggles the timer.</li>
            <li>Skip icons or ←/→ keys change the current speaker.</li>
            <li>Rotate arrow resets the timer.</li>
            <li>Shuffle reshuffles roles for all players.</li>
            <li>Rotate clockwise restarts the game and reshuffles positions.</li>
            <li>Moon/Sun toggles between day and night.</li>
            <li>Flag ends the game.</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  )
}
