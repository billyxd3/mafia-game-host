"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlayerList } from "@/components/player-list"
import { RoleConfigurator } from "@/components/role-configurator"
import { CustomRoleModal } from "@/components/custom-role-modal"
import { Users, Settings, Play, Info, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Player {
  id: string
  name: string
  seatNumber: number
}

interface Role {
  id: string
  name: string
  faction: "mafia" | "city" | "neutral"
  color: string
  count: number
  isCustom?: boolean
}

const defaultRoles: Role[] = [
  { id: "don", name: "Don Mafia", faction: "mafia", color: "bg-black text-white", count: 1 },
  { id: "mafia", name: "Mafia", faction: "mafia", color: "bg-red-600 text-white", count: 2 },
  { id: "detective", name: "Detective", faction: "city", color: "bg-blue-600 text-white", count: 1 },
  { id: "doctor", name: "Doctor", faction: "city", color: "bg-green-600 text-white", count: 1 },
  { id: "citizen", name: "Citizen", faction: "city", color: "bg-yellow-600 text-black", count: 3 },
]

export default function LobbyPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [players, setPlayers] = useState<Player[]>([])
  const [playerInput, setPlayerInput] = useState("")
  const [roles, setRoles] = useState<Role[]>(defaultRoles)
  const [speechTimer, setSpeechTimer] = useState("60")
  const [nightTimer, setNightTimer] = useState("30")
  const [customSpeechTimer, setCustomSpeechTimer] = useState("")
  const [customNightTimer, setCustomNightTimer] = useState("")
  const [maxSelfHeals, setMaxSelfHeals] = useState(2)
  const [showCustomRoleModal, setShowCustomRoleModal] = useState(false)

  const handlePlayerInputChange = (value: string) => {
    setPlayerInput(value)
    const names = value.split("\n").filter((name) => name.trim())
    const newPlayers = names.map((name, index) => ({
      id: `player-${index}`,
      name: name.trim(),
      seatNumber: index + 1,
    }))
    setPlayers(newPlayers)
  }

  const totalRoles = roles.reduce((sum, role) => sum + role.count, 0)
  const isValidSetup = players.length > 0 && totalRoles === players.length && totalRoles >= 5

  const handleStartGame = () => {
    if (isValidSetup) {
      // Store game configuration in localStorage for the game page
      const gameConfig = {
        players,
        roles,
        speechTimer: speechTimer === "custom" ? customSpeechTimer : speechTimer,
        nightTimer: nightTimer === "custom" ? customNightTimer : nightTimer,
        maxSelfHeals,
      }
      localStorage.setItem(`game-${params.id}`, JSON.stringify(gameConfig))
      router.push(`/game/${params.id}/play`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold">Mafia Game Setup</h1>
            <div className="text-right">
              <p className="text-sm text-gray-400">Game ID</p>
              <p className="text-2xl font-mono font-bold text-blue-400">{params.id}</p>
            </div>
          </div>
          <p className="text-gray-400">Configure players, roles, and game settings</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Player List */}
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Player List
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="player-input">Paste player names (one per line)</Label>
                  <Textarea
                    id="player-input"
                    placeholder="John Doe&#10;Jane Smith&#10;Bob Johnson"
                    value={playerInput}
                    onChange={(e) => handlePlayerInputChange(e.target.value)}
                    className="mt-2 bg-gray-700 border-gray-600 text-white min-h-[120px]"
                  />
                </div>

                {players.length > 0 && (
                  <div>
                    <Label>Players ({players.length})</Label>
                    <PlayerList players={players} setPlayers={setPlayers} />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Configuration */}
          <div className="space-y-6">
            {/* Role Configurator */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>Role Configurator</CardTitle>
              </CardHeader>
              <CardContent>
                <RoleConfigurator
                  roles={roles}
                  setRoles={setRoles}
                  onAddCustomRole={() => setShowCustomRoleModal(true)}
                />

                <div className="mt-4 p-3 bg-gray-700 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>Total Roles: {totalRoles}</span>
                    <span>Players: {players.length}</span>
                  </div>
                  {totalRoles !== players.length && players.length > 0 && (
                    <p className="text-red-400 text-sm mt-1">Role count must equal player count</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Game Settings */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Game Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Speech Timer</Label>
                  <Select value={speechTimer} onValueChange={setSpeechTimer}>
                    <SelectTrigger className="bg-gray-700 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="30">30 seconds</SelectItem>
                      <SelectItem value="60">60 seconds</SelectItem>
                      <SelectItem value="90">90 seconds</SelectItem>
                      <SelectItem value="120">120 seconds</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  {speechTimer === "custom" && (
                    <Input
                      type="number"
                      placeholder="Enter seconds"
                      value={customSpeechTimer}
                      onChange={(e) => setCustomSpeechTimer(e.target.value)}
                      className="mt-2 bg-gray-700 border-gray-600"
                    />
                  )}
                </div>

                <div>
                  <Label>Night Action Timer</Label>
                  <Select value={nightTimer} onValueChange={setNightTimer}>
                    <SelectTrigger className="bg-gray-700 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="30">30 seconds</SelectItem>
                      <SelectItem value="60">60 seconds</SelectItem>
                      <SelectItem value="90">90 seconds</SelectItem>
                      <SelectItem value="120">120 seconds</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  {nightTimer === "custom" && (
                    <Input
                      type="number"
                      placeholder="Enter seconds"
                      value={customNightTimer}
                      onChange={(e) => setCustomNightTimer(e.target.value)}
                      className="mt-2 bg-gray-700 border-gray-600"
                    />
                  )}
                </div>

                <div>
                  <Label className="flex items-center gap-2">
                    Max Self-Heals for Doctor
                    <Info className="w-4 h-4 text-gray-400" />
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    value={maxSelfHeals}
                    onChange={(e) => setMaxSelfHeals(Number.parseInt(e.target.value) || 0)}
                    className="bg-gray-700 border-gray-600"
                  />
                  <p className="text-xs text-gray-400 mt-1">Doctor cannot heal the same player 2 nights in a row</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-4">
          <div className="container mx-auto">
            <Button
              onClick={handleStartGame}
              disabled={!isValidSetup}
              className="w-full h-12 text-lg font-semibold bg-green-600 hover:bg-green-700 disabled:bg-gray-600"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Game
            </Button>
          </div>
        </div>
      </div>

      <CustomRoleModal
        open={showCustomRoleModal}
        onClose={() => setShowCustomRoleModal(false)}
        onAddRole={(role) => {
          setRoles([...roles, { ...role, id: `custom-${Date.now()}`, count: 1, isCustom: true }])
          setShowCustomRoleModal(false)
        }}
      />
    </div>
  )
}
