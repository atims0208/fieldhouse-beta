"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function ForgotPasswordPage() {
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // In a real app, this would call an API to send a password reset email
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setIsSubmitted(true)
      toast({
        title: "Success",
        description: "Password reset instructions have been sent to your email",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send password reset email. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-200px)] px-4 py-8">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <Image src="/logo.png" alt="Fieldhouse Stadium Beta" width={80} height={80} className="mx-auto rounded" />
          <h1 className="text-3xl font-bold text-fhsb-cream">Reset your password</h1>
          <p className="text-muted-foreground">
            Enter your email address and we'll send you instructions to reset your password
          </p>
        </div>

        {isSubmitted ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-fhsb-green/30 p-4 text-center">
              <p className="text-fhsb-cream">
                We've sent password reset instructions to <span className="font-medium">{email}</span>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">Please check your email inbox and spam folder</p>
            </div>

            <div className="text-center">
              <Link href="/login" className="text-fhsb-green hover:underline">
                Return to login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-muted/10 border-fhsb-green/30 focus-visible:ring-fhsb-green/50"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-fhsb-green text-black hover:bg-fhsb-green/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send reset instructions"}
            </Button>

            <div className="text-center text-sm">
              <p className="text-muted-foreground">
                Remember your password?{" "}
                <Link href="/login" className="text-fhsb-green hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
