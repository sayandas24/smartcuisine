import React from 'react'

export default function Sidebar() {
  return (
    <div className="flex flex-col w-64 h-screen bg-gray-800 text-white">
      <h1 className="text-xl font-bold p-4">Admin Sidebar</h1>
      <ul className="mt-4">
        <li className="p-2 hover:bg-gray-700">Dashboard</li>
        <li className="p-2 hover:bg-gray-700">Settings</li>
        <li className="p-2 hover:bg-gray-700">Users</li>
      </ul>
      
    </div>
  )
}
