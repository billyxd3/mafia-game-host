"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus, UserPlus } from "lucide-react"

interface Role {
  id: string
  name: string
  faction: "mafia" | "city" | "neutral"
  color: string
  count: number
  isCustom?: boolean
}

interface RoleConfiguratorProps {
  roles: Role[]
  setRoles: (roles: Role[]) => void
  onAddCustomRole: () => void
}

export function RoleConfigurator({ roles, setRoles, onAddCustomRole }: RoleConfiguratorProps) {
  const updateRoleCount = (roleId: string, delta: number) => {
    setRoles(roles.map((role) => (role.id === roleId ? { ...role, count: Math.max(0, role.count + delta) } : role)))
  }

  const removeCustomRole = (roleId: string) => {
    setRoles(roles.filter((role) => role.id !== roleId))
  }

  return (
    <div className="space-y-3">
      {roles.map((role) => (
        <div key={role.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
          <div className="flex items-center gap-3">
            <Badge className={`${role.color} text-xs`}>{role.name}</Badge>
            <span className="text-sm text-gray-300 capitalize">{role.faction}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateRoleCount(role.id, -1)}
              disabled={role.count === 0}
              className="w-8 h-8 p-0 border-gray-600"
            >
              <Minus className="w-3 h-3" />
            </Button>

            <span className="w-8 text-center font-mono">{role.count}</span>

            <Button
              size="sm"
              variant="outline"
              onClick={() => updateRoleCount(role.id, 1)}
              className="w-8 h-8 p-0 border-gray-600"
            >
              <Plus className="w-3 h-3" />
            </Button>

            {role.isCustom && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeCustomRole(role.id)}
                className="text-red-400 hover:text-red-300"
              >
                ×
              </Button>
            )}
          </div>
        </div>
      ))}

      <Button
        variant="outline"
        onClick={onAddCustomRole}
        className="w-full border-gray-600 border-dashed hover:border-gray-500"
      >
        <UserPlus className="w-4 h-4 mr-2" />
        Add Custom Role
      </Button>
    </div>
  )
}
