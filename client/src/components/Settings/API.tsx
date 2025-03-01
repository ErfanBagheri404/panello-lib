import React from 'react'

const API = () => {
  return (
    <div className="space-y-4">
    <div className="space-y-2">
      <label className="block font-medium">MongoDB API Key</label>
      <input
        type="text"
        value="****************"
        readOnly
        className="w-full p-2 border rounded-lg bg-gray-100"
      />
    </div>
    <div className="space-y-2">
      <label className="block font-medium">
        OpenRouter API Key
      </label>
      <input
        type="text"
        value="****************"
        readOnly
        className="w-full p-2 border rounded-lg bg-gray-100"
      />
    </div>
    <button className="px-4 py-2 bg-blue-500 text-white rounded-full">
      Regenerate API Keys
    </button>
  </div>
  )
}

export default API