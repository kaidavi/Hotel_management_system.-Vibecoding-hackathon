export type RoomType = "standard" | "deluxe" | "suite" | "presidential"
export type RoomStatus = "available" | "occupied" | "maintenance" | "cleaning"

export interface Room {
  id: string
  number: string
  type: RoomType
  status: RoomStatus
  price: number
  capacity: number
  amenities: string[]
  description: string
  images: string[]
  floor: number
  size: number // in square feet
  createdAt: Date
  updatedAt: Date
}

export interface RoomTypeInfo {
  type: RoomType
  name: string
  description: string
  basePrice: number
  features: string[]
}

// Room type configurations
export const roomTypes: RoomTypeInfo[] = [
  {
    type: "standard",
    name: "Standard Room",
    description: "Comfortable accommodation with essential amenities",
    basePrice: 150,
    features: ["Free WiFi", "Air Conditioning", "Private Bathroom", "TV", "Mini Fridge"],
  },
  {
    type: "deluxe",
    name: "Deluxe Room",
    description: "Spacious room with premium amenities and city view",
    basePrice: 250,
    features: ["Free WiFi", "Air Conditioning", "Private Bathroom", "Smart TV", "Mini Bar", "City View", "Work Desk"],
  },
  {
    type: "suite",
    name: "Executive Suite",
    description: "Luxurious suite with separate living area and premium services",
    basePrice: 450,
    features: [
      "Free WiFi",
      "Air Conditioning",
      "Separate Living Area",
      "Premium Bathroom",
      "Smart TV",
      "Mini Bar",
      "Ocean View",
      "Concierge Service",
    ],
  },
  {
    type: "presidential",
    name: "Presidential Suite",
    description: "Ultimate luxury with panoramic views and exclusive services",
    basePrice: 800,
    features: [
      "Free WiFi",
      "Air Conditioning",
      "Multiple Bedrooms",
      "Luxury Bathroom",
      "Entertainment System",
      "Full Bar",
      "Panoramic View",
      "Butler Service",
      "Private Balcony",
    ],
  },
]

// Mock room data
export const mockRooms: Room[] = [
  {
    id: "1",
    number: "101",
    type: "standard",
    status: "available",
    price: 150,
    capacity: 2,
    amenities: ["Free WiFi", "Air Conditioning", "Private Bathroom", "TV", "Mini Fridge"],
    description: "Comfortable standard room perfect for business travelers",
    images: ["/modern-hotel-standard-room.png"],
    floor: 1,
    size: 300,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    number: "201",
    type: "deluxe",
    status: "available",
    price: 250,
    capacity: 3,
    amenities: ["Free WiFi", "Air Conditioning", "Private Bathroom", "Smart TV", "Mini Bar", "City View", "Work Desk"],
    description: "Spacious deluxe room with stunning city views",
    images: ["/luxury-hotel-deluxe-room-city-view.png"],
    floor: 2,
    size: 450,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "3",
    number: "301",
    type: "suite",
    status: "occupied",
    price: 450,
    capacity: 4,
    amenities: [
      "Free WiFi",
      "Air Conditioning",
      "Separate Living Area",
      "Premium Bathroom",
      "Smart TV",
      "Mini Bar",
      "Ocean View",
      "Concierge Service",
    ],
    description: "Executive suite with separate living area and ocean views",
    images: ["/hotel-executive-suite-ocean-view.png"],
    floor: 3,
    size: 700,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "4",
    number: "401",
    type: "presidential",
    status: "available",
    price: 800,
    capacity: 6,
    amenities: [
      "Free WiFi",
      "Air Conditioning",
      "Multiple Bedrooms",
      "Luxury Bathroom",
      "Entertainment System",
      "Full Bar",
      "Panoramic View",
      "Butler Service",
      "Private Balcony",
    ],
    description: "Presidential suite with panoramic views and exclusive butler service",
    images: ["/presidential-suite-luxury-hotel-panoramic-view.png"],
    floor: 4,
    size: 1200,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "5",
    number: "102",
    type: "standard",
    status: "maintenance",
    price: 150,
    capacity: 2,
    amenities: ["Free WiFi", "Air Conditioning", "Private Bathroom", "TV", "Mini Fridge"],
    description: "Standard room currently under maintenance",
    images: ["/hotel-standard-room-maintenance.png"],
    floor: 1,
    size: 300,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "6",
    number: "202",
    type: "deluxe",
    status: "cleaning",
    price: 250,
    capacity: 3,
    amenities: ["Free WiFi", "Air Conditioning", "Private Bathroom", "Smart TV", "Mini Bar", "City View", "Work Desk"],
    description: "Deluxe room currently being cleaned",
    images: ["/hotel-deluxe-room-cleaning.png"],
    floor: 2,
    size: 450,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
]

// Room management functions
export const getRooms = (): Room[] => {
  return mockRooms
}

export const getRoomById = (id: string): Room | undefined => {
  return mockRooms.find((room) => room.id === id)
}

export const getAvailableRooms = (): Room[] => {
  return mockRooms.filter((room) => room.status === "available")
}

export const getRoomsByType = (type: RoomType): Room[] => {
  return mockRooms.filter((room) => room.type === type)
}

export const updateRoomStatus = (roomId: string, status: RoomStatus): boolean => {
  const roomIndex = mockRooms.findIndex((room) => room.id === roomId)
  if (roomIndex !== -1) {
    mockRooms[roomIndex].status = status
    mockRooms[roomIndex].updatedAt = new Date()
    return true
  }
  return false
}

export const createRoom = (roomData: Omit<Room, "id" | "createdAt" | "updatedAt">): Room => {
  const newRoom: Room = {
    ...roomData,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  mockRooms.push(newRoom)
  return newRoom
}

export const updateRoom = (roomId: string, updates: Partial<Room>): Room | null => {
  const roomIndex = mockRooms.findIndex((room) => room.id === roomId)
  if (roomIndex !== -1) {
    mockRooms[roomIndex] = {
      ...mockRooms[roomIndex],
      ...updates,
      updatedAt: new Date(),
    }
    return mockRooms[roomIndex]
  }
  return null
}

export const deleteRoom = (roomId: string): boolean => {
  const roomIndex = mockRooms.findIndex((room) => room.id === roomId)
  if (roomIndex !== -1) {
    mockRooms.splice(roomIndex, 1)
    return true
  }
  return false
}
