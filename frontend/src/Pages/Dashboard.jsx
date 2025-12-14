import React from "react"
import RoomCard from "../components/Room/RoomCard"

export default function Dashboard() {
  return (
    <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <RoomCard 
        roomName="Algorithm Study Group"
        owner="Gaurav"
        createdAt="2025-10-15T14:30:00"
        roomCode="X7K-9P2"
      />
      <RoomCard 
        roomName="Project TheAntelope12"
        owner="Ishika"
        createdAt="2025-12-02T09:15:00"
        roomCode="ANT-12Z"
      />
    </div>
  )
}