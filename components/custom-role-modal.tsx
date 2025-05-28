"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface CustomRoleModalProps {
  open: boolean
  onClose: () => void
  onAddRole: (role: { name: string; faction: "mafia" | "city" | "neutral"; color: string }) => void
}

const colorOptions = [
  { value: "bg-purple-600 text-white", label: "Purple" },
  { value: "bg-orange-600 text-white", label: "Orange" },
  { value: "bg-pink-600 text-white", label: "Pink" },
  { value: "bg-indigo-600 text-white", label: "Indigo" },
  { value: "bg-teal-600 text-white", label: "Teal" },
  { value: "bg-gray-600 text-white", label: "Gray" },
]

export function CustomRoleModal({ open, onClose, onAddRole }: CustomRoleModalProps) {
  const [name, setName] = useState("")
  const [faction, setFaction] = useState<"mafia" | "city" | "neutral">("city")
  const [color, setColor] = useState(colorOptions[0].value)

  const handleSubmit = () => {
    if (name.trim()) {
      onAddRole({ name: name.trim(), faction, color })
      setName("")
      setFaction("city")
      setColor(colorOptions[0].value)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Add Custom Role</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="role-name">Role Name</Label>
            <Input
              id="role-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter role name"
              className="bg-gray-700 border-gray-600"
            />
          </div>

          <div>
            <Label>Faction</Label>
            <Select value={faction} onValueChange={(value: "mafia" | "city" | "neutral") => setFaction(value)}>
              <SelectTrigger className="bg-gray-700 border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="city">City</SelectItem>
                <SelectItem value="mafia">Mafia</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Badge Color</Label>
            <Select value={color} onValueChange={setColor}>
              <SelectTrigger className="bg-gray-700 border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                {colorOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded ${option.value}`} />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!name.trim()} className="flex-1">
              Add Role
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
