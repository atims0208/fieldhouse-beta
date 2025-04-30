"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Upload } from "lucide-react"
import { format } from "date-fns"

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { register } = useAuth()

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined)
  const [idDocumentFile, setIdDocumentFile] = useState<File | null>(null)
  const [idDocumentUrl, setIdDocumentUrl] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)

  const handleIdUpload = async (file: File | null) => {
    if (!file) return
    setIdDocumentFile(file)
    setIsUploading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    const uploadedUrl = `/uploads/mock-id-${Date.now()}.pdf`
    console.log("Simulated ID Upload URL:", uploadedUrl)
    setIdDocumentUrl(uploadedUrl)
    setIsUploading(false)
    toast({ title: "Success", description: "ID document uploaded (simulated)." })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!username || !email || !password || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    if (!agreeTerms) {
      toast({
        title: "Error",
        description: "You must agree to the terms and conditions",
        variant: "destructive",
      })
      return
    }

    if (!dateOfBirth) {
      toast({ title: "Error", description: "Please enter your date of birth", variant: "destructive" })
      return
    }

    try {
      await register(username, email, password, new Date(dateOfBirth), idDocumentUrl)
      toast({
        title: "Success",
        description: "Your account has been created successfully",
      })
      router.push("/")
    } catch {
      toast({
        title: "Error",
        description: "Registration failed. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-200px)] px-4 py-8">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <Image src="/logo.png" alt="Fieldhouse Stadium Beta" width={80} height={80} className="mx-auto rounded" />
          <h1 className="text-3xl font-bold text-fhsb-cream">Create an account</h1>
          <p className="text-muted-foreground">Enter your information to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="bg-muted/10 border-fhsb-green/30 focus-visible:ring-fhsb-green/50"
            />
          </div>

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

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-muted/10 border-fhsb-green/30 focus-visible:ring-fhsb-green/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="bg-muted/10 border-fhsb-green/30 focus-visible:ring-fhsb-green/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={`w-full justify-start text-left font-normal bg-muted/10 border-fhsb-green/30 hover:bg-muted/20 ${!dateOfBirth && "text-muted-foreground"}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateOfBirth ? format(dateOfBirth, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateOfBirth}
                  onSelect={setDateOfBirth}
                  captionLayout="dropdown-buttons"
                  fromYear={1950}
                  toYear={new Date().getFullYear() - 16}
                  initialFocus
                  className="bg-card border border-border"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="idDocument">ID Document (Optional)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="idDocument"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleIdUpload(e.target.files ? e.target.files[0] : null)}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('idDocument')?.click()}
                className="flex-grow justify-start text-left font-normal bg-muted/10 border-fhsb-green/30 hover:bg-muted/20"
                disabled={isUploading}
              >
                <Upload className="mr-2 h-4 w-4" />
                {idDocumentFile ? idDocumentFile.name : <span>{isUploading ? 'Uploading...' : 'Choose ID Document'}</span>}
              </Button>
            </div>
            {idDocumentUrl && <p className="text-xs text-muted-foreground">Uploaded: {idDocumentUrl.split('/').pop()}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={agreeTerms}
              onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
              className="border-fhsb-green/30 data-[state=checked]:bg-fhsb-green data-[state=checked]:text-black"
            />
            <Label htmlFor="terms" className="text-sm">
              I agree to the{" "}
              <Link href="/terms" className="text-fhsb-green hover:underline">
                terms of service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-fhsb-green hover:underline">
                privacy policy
              </Link>
            </Label>
          </div>

          <Button type="submit" className="w-full bg-fhsb-green text-black hover:bg-fhsb-green/90" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <div className="text-center text-sm">
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-fhsb-green hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
