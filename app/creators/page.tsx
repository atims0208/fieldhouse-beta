import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Zap, Users, BarChart, Globe, Shield } from "lucide-react"

export default function CreatorsPage() {
  return (
    <div className="container px-4 py-6 md:px-6 space-y-8">
      {/* Hero Section */}
      <section className="py-12 md:py-24 text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold text-fhsb-cream">Become a Creator</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Share your sports content with fans around the world on Fieldhouse Stadium Beta
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Link href="/register">
            <Button className="w-full sm:w-auto bg-fhsb-green text-black hover:bg-fhsb-green/90">Get Started</Button>
          </Link>
          <Link href="#learn-more">
            <Button
              variant="outline"
              className="w-full sm:w-auto border-fhsb-green/50 text-fhsb-cream hover:bg-fhsb-green hover:text-black"
            >
              Learn More
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="learn-more" className="py-12 space-y-8">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-fhsb-cream">Why Choose Fieldhouse Stadium Beta?</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Our platform is designed specifically for sports content creators and fans
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-card border-fhsb-green/20">
            <CardHeader>
              <Zap className="h-10 w-10 text-fhsb-green mb-2" />
              <CardTitle className="text-fhsb-cream">Low Latency Streaming</CardTitle>
              <CardDescription>
                Our platform is optimized for sports with ultra-low latency streaming technology
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-fhsb-green" />
                  <span className="text-fhsb-cream">Sub-second latency</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-fhsb-green" />
                  <span className="text-fhsb-cream">High-definition quality</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-fhsb-green" />
                  <span className="text-fhsb-cream">Adaptive bitrate streaming</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card border-fhsb-green/20">
            <CardHeader>
              <Users className="h-10 w-10 text-fhsb-green mb-2" />
              <CardTitle className="text-fhsb-cream">Engaged Community</CardTitle>
              <CardDescription>Connect with a passionate community of sports fans and creators</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-fhsb-green" />
                  <span className="text-fhsb-cream">Interactive chat features</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-fhsb-green" />
                  <span className="text-fhsb-cream">Fan subscriptions</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-fhsb-green" />
                  <span className="text-fhsb-cream">Community events</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card border-fhsb-green/20">
            <CardHeader>
              <BarChart className="h-10 w-10 text-fhsb-green mb-2" />
              <CardTitle className="text-fhsb-cream">Creator Analytics</CardTitle>
              <CardDescription>Detailed insights to help you grow your audience and content</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-fhsb-green" />
                  <span className="text-fhsb-cream">Real-time viewer metrics</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-fhsb-green" />
                  <span className="text-fhsb-cream">Audience demographics</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-fhsb-green" />
                  <span className="text-fhsb-cream">Content performance tracking</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card border-fhsb-green/20">
            <CardHeader>
              <Globe className="h-10 w-10 text-fhsb-green mb-2" />
              <CardTitle className="text-fhsb-cream">Global Reach</CardTitle>
              <CardDescription>Broadcast your content to sports fans worldwide</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-fhsb-green" />
                  <span className="text-fhsb-cream">Multi-language support</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-fhsb-green" />
                  <span className="text-fhsb-cream">Global CDN infrastructure</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-fhsb-green" />
                  <span className="text-fhsb-cream">Time zone scheduling tools</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card border-fhsb-green/20">
            <CardHeader>
              <Shield className="h-10 w-10 text-fhsb-green mb-2" />
              <CardTitle className="text-fhsb-cream">Content Protection</CardTitle>
              <CardDescription>Protect your content with advanced security features</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-fhsb-green" />
                  <span className="text-fhsb-cream">DRM protection</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-fhsb-green" />
                  <span className="text-fhsb-cream">Anti-piracy measures</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-fhsb-green" />
                  <span className="text-fhsb-cream">Content ownership verification</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card border-fhsb-green/20">
            <CardHeader>
              <Zap className="h-10 w-10 text-fhsb-green mb-2" />
              <CardTitle className="text-fhsb-cream">Monetization Options</CardTitle>
              <CardDescription>Multiple ways to earn revenue from your content</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-fhsb-green" />
                  <span className="text-fhsb-cream">Subscriptions</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-fhsb-green" />
                  <span className="text-fhsb-cream">Virtual gifts and donations</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-fhsb-green" />
                  <span className="text-fhsb-cream">Ad revenue sharing</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 space-y-8">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-fhsb-cream">How It Works</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">Getting started as a creator is simple</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-fhsb-green text-black flex items-center justify-center mx-auto text-2xl font-bold">
              1
            </div>
            <h3 className="text-xl font-bold text-fhsb-cream">Create an Account</h3>
            <p className="text-muted-foreground">Sign up for a free account and complete your creator profile</p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-fhsb-green text-black flex items-center justify-center mx-auto text-2xl font-bold">
              2
            </div>
            <h3 className="text-xl font-bold text-fhsb-cream">Set Up Your Stream</h3>
            <p className="text-muted-foreground">Configure your streaming settings and customize your channel</p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-fhsb-green text-black flex items-center justify-center mx-auto text-2xl font-bold">
              3
            </div>
            <h3 className="text-xl font-bold text-fhsb-cream">Go Live</h3>
            <p className="text-muted-foreground">Start streaming and connect with your audience</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-24 text-center space-y-6">
        <h2 className="text-2xl md:text-4xl font-bold text-fhsb-cream">Ready to Start Streaming?</h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Join Fieldhouse Stadium Beta today and share your content with fans around the world
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Link href="/register">
            <Button className="w-full sm:w-auto bg-fhsb-green text-black hover:bg-fhsb-green/90">Create Account</Button>
          </Link>
          <Link href="/contact">
            <Button
              variant="outline"
              className="w-full sm:w-auto border-fhsb-green/50 text-fhsb-cream hover:bg-fhsb-green hover:text-black"
            >
              Contact Sales
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
