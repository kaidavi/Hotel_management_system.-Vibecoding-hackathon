"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { RoomType, RoomStatus } from "@/lib/rooms"
import { Search, Filter, X } from "lucide-react"

interface RoomFilters {
  search: string
  type: RoomType | "all"
  status: RoomStatus | "all"
  minPrice: string
  maxPrice: string
  capacity: string
}

interface RoomFiltersProps {
  filters: RoomFilters
  onFiltersChange: (filters: RoomFilters) => void
  showStatus?: boolean
}

export function RoomFiltersComponent({ filters, onFiltersChange, showStatus = false }: RoomFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleFilterChange = (key: keyof RoomFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      type: "all",
      status: "all",
      minPrice: "",
      maxPrice: "",
      capacity: "",
    })
  }

  const hasActiveFilters =
    filters.search ||
    filters.type !== "all" ||
    filters.status !== "all" ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.capacity

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? "Less" : "More"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search rooms..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Room Type */}
          <div className="space-y-2">
            <Label>Room Type</Label>
            <Select value={filters.type} onValueChange={(value) => handleFilterChange("type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="deluxe">Deluxe</SelectItem>
                <SelectItem value="suite">Suite</SelectItem>
                <SelectItem value="presidential">Presidential</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Room Status (Admin only) */}
          {showStatus && (
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Capacity */}
          <div className="space-y-2">
            <Label>Min Capacity</Label>
            <Select value={filters.capacity} onValueChange={(value) => handleFilterChange("capacity", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Any</SelectItem>
                <SelectItem value="1">1+ guests</SelectItem>
                <SelectItem value="2">2+ guests</SelectItem>
                <SelectItem value="3">3+ guests</SelectItem>
                <SelectItem value="4">4+ guests</SelectItem>
                <SelectItem value="6">6+ guests</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <Label>Min Price ($)</Label>
              <Input
                type="number"
                placeholder="0"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Max Price ($)</Label>
              <Input
                type="number"
                placeholder="1000"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
