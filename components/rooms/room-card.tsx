"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { Room } from "@/lib/rooms"
import { Users, Square, MapPin } from "lucide-react"

interface RoomCardProps {
  room: Room
  onSelect?: (room: Room) => void
  onEdit?: (room: Room) => void
  showActions?: boolean
  variant?: "customer" | "admin"
}

export function RoomCard({ room, onSelect, onEdit, showActions = true, variant = "customer" }: RoomCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "occupied":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "cleaning":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "standard":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
      case "deluxe":
        return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-300"
      case "suite":
        return "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-300"
      case "presidential":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={room.images[0] || "/placeholder.svg"}
          alt={`Room ${room.number}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <Badge className={getStatusColor(room.status)}>{room.status}</Badge>
          <Badge className={getTypeColor(room.type)}>{room.type}</Badge>
        </div>
      </div>

      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Room {room.number}</CardTitle>
            <CardDescription className="capitalize">{room.type} Room</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">${room.price}</div>
            <div className="text-sm text-muted-foreground">per night</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{room.description}</p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{room.capacity} guests</span>
          </div>
          <div className="flex items-center gap-1">
            <Square className="h-4 w-4" />
            <span>{room.size} sq ft</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>Floor {room.floor}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {room.amenities.slice(0, 3).map((amenity) => (
            <Badge key={amenity} variant="secondary" className="text-xs">
              {amenity}
            </Badge>
          ))}
          {room.amenities.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{room.amenities.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>

      {showActions && (
        <CardFooter className="flex gap-2">
          {variant === "customer" && room.status === "available" && (
            <Button onClick={() => onSelect?.(room)} className="flex-1">
              Book Now
            </Button>
          )}
          {variant === "admin" && (
            <>
              <Button variant="outline" onClick={() => onEdit?.(room)} className="flex-1">
                Edit Room
              </Button>
              <Button onClick={() => onSelect?.(room)} className="flex-1">
                View Details
              </Button>
            </>
          )}
        </CardFooter>
      )}
    </Card>
  )
}
