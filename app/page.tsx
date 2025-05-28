"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users, Play, Clock, Crown, Eye } from "lucide-react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()
  const [gameId, setGameId] = useState("")

  const createNewGame = () => {
    const newGameId = Math.random().toString(36).substring(2, 8).toUpperCase()
    router.push(`/game/${newGameId}/lobby`)
  }

  const joinExistingGame = () => {
    if (gameId.trim()) {
      router.push(`/game/${gameId.trim()}/lobby`)
    }
  }

  return (
    <div className="min-h-screen mafia-bg">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-7xl font-bold mb-6 mafia-title">THE MAFIA</h1>
          <h2 className="text-3xl mb-4 mafia-subtitle">Game Host Dashboard</h2>
          <p className="text-xl mafia-text max-w-3xl mx-auto leading-relaxed">
            Step into the shadows of organized crime. Manage your family's operations with precision and style. This
            digital consigliere replaces the old ways of pen and paper with modern sophistication.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="mafia-card vintage-overlay">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 mafia-text">
                <Users className="w-6 h-6 text-yellow-600" />
                Family Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mafia-text text-sm leading-relaxed">
                Organize your crew with military precision. Assign seats, manage territories, and keep track of every
                soldier in your organization.
              </p>
            </CardContent>
          </Card>

          <Card className="mafia-card vintage-overlay">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 mafia-text">
                <Clock className="w-6 h-6 text-yellow-600" />
                Strategic Timing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mafia-text text-sm leading-relaxed">
                Control the flow of operations with precision timing. Every second counts when lives hang in the
                balance.
              </p>
            </CardContent>
          </Card>

          <Card className="mafia-card vintage-overlay">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 mafia-text">
                <Crown className="w-6 h-6 text-yellow-600" />
                Hierarchy System
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mafia-text text-sm leading-relaxed">
                From the Don to the lowest soldier, maintain the sacred hierarchy. Custom roles for specialized
                operations.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="max-w-lg mx-auto space-y-8">
          <Card className="mafia-card vintage-overlay">
            <CardHeader>
              <CardTitle className="text-center mafia-text">Establish New Territory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button onClick={createNewGame} className="w-full h-14 text-lg mafia-btn-primary">
                <Play className="w-6 h-6 mr-3" />
                Create New Operation
              </Button>
              <p className="text-xs mafia-text text-center opacity-75">
                Generate a secure operation code and begin recruiting your family
              </p>
            </CardContent>
          </Card>

          <div className="text-center">
            <span className="mafia-subtitle text-lg">— or —</span>
          </div>

          <Card className="mafia-card vintage-overlay">
            <CardHeader>
              <CardTitle className="text-center mafia-text">Join Existing Family</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="game-id" className="mafia-text">
                  Operation Code
                </Label>
                <Input
                  id="game-id"
                  placeholder="Enter 6-character code"
                  value={gameId}
                  onChange={(e) => setGameId(e.target.value.toUpperCase())}
                  className="mafia-input text-center text-lg tracking-wider mt-2"
                  maxLength={6}
                />
              </div>
              <Button
                onClick={joinExistingGame}
                disabled={gameId.length !== 6}
                className="w-full h-14 text-lg mafia-btn-secondary"
              >
                <Eye className="w-6 h-6 mr-3" />
                Infiltrate Operation
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-20 mafia-text opacity-60">
          <p className="text-lg mb-2">Perfect for clandestine gatherings and family meetings</p>
          <p className="text-sm">Supports 5-20 members • No paper trails • Operates in the shadows</p>
        </div>
      </div>
    </div>
  )
}
