"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { userAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function UpgradeToStreamerPage() {
  const router = useRouter()
  const { user, updateUser } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [dateOfBirth, setDateOfBirth] = useState("")

  const handleUpgrade = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!dateOfBirth) {
      toast({
        title: "Error",
        description: "Please enter your date of birth",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await userAPI.upgradeToStreamer()
      
      updateUser({
        isStreamer: true,
        streamKey: response.streamKey,
      })

      toast({
        title: "Success",
        description: "Your account has been upgraded to streamer status!",
      })

      router.push("/dashboard/broadcast")
    } catch (error) {
      console.error("Upgrade error:", error)
      toast({
        title: "Error",
        description: "Failed to upgrade to streamer status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (user?.isStreamer) {
    return (
      <div className="container px-4 py-6 md:px-6">
        <Card className="bg-card border-fhsb-green/20">
          <CardHeader>
            <CardTitle className="text-fhsb-cream">Already a Streamer</CardTitle>
            <CardDescription>
              Your account already has streamer privileges.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => router.push("/dashboard/broadcast")}>
              Go to Broadcast Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container px-4 py-6 md:px-6">
      <Card className="bg-card border-fhsb-green/20">
        <CardHeader>
          <CardTitle className="text-fhsb-cream">Upgrade to Streamer</CardTitle>
          <CardDescription>
            Become a streamer on Fieldhouse Stadium Beta and start broadcasting your sports content.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleUpgrade}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
                className="bg-muted/10 border-fhsb-green/30 focus-visible:ring-fhsb-green/50"
              />
              <p className="text-xs text-muted-foreground">
                You must be at least 18 years old to become a streamer.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-fhsb-cream">Streamer Guidelines</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Stream high-quality sports content</li>
                <li>Maintain a professional and respectful environment</li>
                <li>Follow our community guidelines and terms of service</li>
                <li>Engage with your audience responsibly</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Upgrading...
                </>
              ) : (
                "Upgrade to Streamer"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 