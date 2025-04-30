"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"

interface Message {
  id: string
  username: string
  content: string
  timestamp: Date
}

export default function ChatInterface() {
  const { user } = useAuth()
  const [isLoggedIn] = useState(!!user)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Simulate receiving messages
  useEffect(() => {
    const mockMessages: Message[] = [
      {
        id: "1",
        username: "SportsFan42",
        content: "Great game so far!",
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
      },
      {
        id: "2",
        username: "BasketballLover",
        content: "That was an amazing play!",
        timestamp: new Date(Date.now() - 1000 * 60 * 3),
      },
      {
        id: "3",
        username: "CoachJones",
        content: "They need to improve their defense in the second half",
        timestamp: new Date(Date.now() - 1000 * 60 * 2),
      },
      {
        id: "4",
        username: "StatGeek",
        content: "Player #23 is shooting 60% from the field tonight",
        timestamp: new Date(Date.now() - 1000 * 60),
      },
    ]

    setMessages(mockMessages)

    // Simulate new messages coming in
    const interval = setInterval(() => {
      const randomUsernames = [
        "SportsFan42",
        "BasketballLover",
        "CoachJones",
        "StatGeek",
        "GameTime",
        "MVP_Watcher",
        "FieldhouseFan",
      ]
      const randomMessages = [
        "Great play!",
        "Let's go team!",
        "What a shot!",
        "Defense needs to step up",
        "Who's the referee tonight?",
        "This game is intense!",
        "Can't believe that call",
      ]

      const newMessage: Message = {
        id: Date.now().toString(),
        username: randomUsernames[Math.floor(Math.random() * randomUsernames.length)],
        content: randomMessages[Math.floor(Math.random() * randomMessages.length)],
        timestamp: new Date(),
      }

      setMessages((prevMessages) => [...prevMessages, newMessage])
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim()) return

    const newMessageObj: Message = {
      id: Date.now().toString(),
      username: "CurrentUser", // Replace with actual username
      content: newMessage,
      timestamp: new Date(),
    }

    setMessages((prevMessages) => [...prevMessages, newMessageObj])
    setNewMessage("")
  }

  return (
    <div className="flex flex-col h-full rounded-lg border border-fhsb-green/20 bg-card">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <div key={message.id} className="mb-2">
            <span className="font-medium text-fhsb-cream">{message.username}:</span>{" "}
            <span className="text-muted-foreground">{message.content}</span>
            <div className="text-xs text-muted-foreground">{message.timestamp.toLocaleTimeString()}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-fhsb-green/20">
        {isLoggedIn ? (
          <form onSubmit={handleSubmit} className="flex">
            <input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
            <button
              type="submit"
              className="ml-2 rounded-md bg-fhsb-green px-3 py-2 text-sm font-medium text-black hover:bg-fhsb-green/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send
            </button>
          </form>
        ) : (
          <p className="text-center text-muted-foreground">Log in to join the chat</p>
        )}
      </div>
    </div>
  )
}
