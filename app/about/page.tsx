import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Globe, Award, Zap, Shield } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container px-4 py-6 md:px-6 space-y-12">
      {/* Hero Section */}
      <section className="py-12 md:py-24 text-center space-y-6">
        <h1 className="text-3xl md:text-5xl font-bold text-fhsb-cream">About Fieldhouse Stadium Beta</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          The premier livestreaming platform dedicated to sports content and community
        </p>
        <div className="flex justify-center">
          <Image src="/logo.png" alt="Fieldhouse Stadium Beta" width={120} height={120} className="rounded-lg" />
        </div>
      </section>

      {/* Our Mission */}
      <section className="max-w-4xl mx-auto">
        <div className="text-center space-y-4 mb-8">
          <h2 className="text-2xl md:text-4xl font-bold text-fhsb-cream">Our Mission</h2>
          <div className="h-1 w-20 bg-fhsb-green mx-auto"></div>
        </div>
        <p className="text-lg text-fhsb-cream text-center">
          At Fieldhouse Stadium Beta, our mission is to connect sports fans and content creators through a dedicated
          streaming platform that celebrates the passion, skill, and community of sports. We're building a space where
          athletes, coaches, analysts, and fans can share their knowledge, experiences, and love for the game.
        </p>
      </section>

      {/* Our Story */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-fhsb-cream">Our Story</h2>
          <p className="text-fhsb-cream">
            Fieldhouse Stadium Beta was founded in 2023 by a team of sports enthusiasts and technology experts who saw
            the need for a dedicated streaming platform for sports content. We recognized that while general streaming
            platforms existed, none were specifically designed with the unique needs of sports content creators and fans
            in mind.
          </p>
          <p className="text-fhsb-cream">
            Our founders combined their passion for sports with their expertise in technology to create a platform that
            offers low-latency streaming, specialized tools for sports broadcasting, and a community focused on the love
            of the game.
          </p>
          <p className="text-fhsb-cream">
            Today, we're in our beta phase, continuously improving our platform based on feedback from our growing
            community of creators and viewers. We're committed to building the best possible experience for sports
            content on the internet.
          </p>
        </div>
        <div className="relative aspect-video rounded-lg overflow-hidden border border-fhsb-green/30">
          <Image src="/placeholder.svg?height=720&width=1280" alt="Our team" fill className="object-cover" />
        </div>
      </section>

      {/* Our Values */}
      <section>
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-fhsb-cream">Our Values</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">The principles that guide everything we do</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card border-fhsb-green/20">
            <CardHeader>
              <Users className="h-10 w-10 text-fhsb-green mb-2" />
              <CardTitle className="text-fhsb-cream">Community First</CardTitle>
              <CardDescription>
                We believe in the power of community to bring people together through sports
              </CardDescription>
            </CardHeader>
            <CardContent className="text-fhsb-cream">
              We're building more than just a platform; we're creating a community where sports fans and creators can
              connect, share, and grow together. Every feature we develop is designed with our community in mind.
            </CardContent>
          </Card>

          <Card className="bg-card border-fhsb-green/20">
            <CardHeader>
              <Award className="h-10 w-10 text-fhsb-green mb-2" />
              <CardTitle className="text-fhsb-cream">Excellence</CardTitle>
              <CardDescription>
                We strive for excellence in everything we do, just like the athletes we admire
              </CardDescription>
            </CardHeader>
            <CardContent className="text-fhsb-cream">
              From our streaming technology to our user experience, we're committed to delivering the highest quality
              platform possible. We continuously improve and innovate to provide the best experience for our users.
            </CardContent>
          </Card>

          <Card className="bg-card border-fhsb-green/20">
            <CardHeader>
              <Shield className="h-10 w-10 text-fhsb-green mb-2" />
              <CardTitle className="text-fhsb-cream">Integrity</CardTitle>
              <CardDescription>
                We operate with honesty, transparency, and fairness in all our interactions
              </CardDescription>
            </CardHeader>
            <CardContent className="text-fhsb-cream">
              Trust is the foundation of our community. We're committed to creating a safe, inclusive environment where
              everyone is treated with respect. We make decisions based on what's best for our users, not just our
              bottom line.
            </CardContent>
          </Card>

          <Card className="bg-card border-fhsb-green/20">
            <CardHeader>
              <Globe className="h-10 w-10 text-fhsb-green mb-2" />
              <CardTitle className="text-fhsb-cream">Accessibility</CardTitle>
              <CardDescription>We believe sports content should be accessible to everyone, everywhere</CardDescription>
            </CardHeader>
            <CardContent className="text-fhsb-cream">
              We're building a platform that works for creators and viewers of all backgrounds and abilities. We're
              committed to making sports content more accessible globally, breaking down barriers to entry for creators.
            </CardContent>
          </Card>

          <Card className="bg-card border-fhsb-green/20">
            <CardHeader>
              <Zap className="h-10 w-10 text-fhsb-green mb-2" />
              <CardTitle className="text-fhsb-cream">Innovation</CardTitle>
              <CardDescription>
                We constantly push the boundaries of what's possible in sports streaming
              </CardDescription>
            </CardHeader>
            <CardContent className="text-fhsb-cream">
              We're not satisfied with the status quo. We're always looking for new ways to improve the experience for
              our users, whether that's through new features, better technology, or innovative content formats.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Team Section */}
      <section>
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-fhsb-cream">Our Team</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Meet the passionate people behind Fieldhouse Stadium Beta
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Team Member 1 */}
          <div className="text-center space-y-3">
            <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden border-2 border-fhsb-green">
              <Image src="/placeholder.svg?height=200&width=200" alt="Team Member" fill className="object-cover" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-fhsb-cream">Alex Johnson</h3>
              <p className="text-fhsb-green">CEO & Co-Founder</p>
              <p className="text-sm text-muted-foreground mt-2">
                Former college athlete with 15+ years in tech leadership
              </p>
            </div>
          </div>

          {/* Team Member 2 */}
          <div className="text-center space-y-3">
            <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden border-2 border-fhsb-green">
              <Image src="/placeholder.svg?height=200&width=200" alt="Team Member" fill className="object-cover" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-fhsb-cream">Sarah Chen</h3>
              <p className="text-fhsb-green">CTO & Co-Founder</p>
              <p className="text-sm text-muted-foreground mt-2">
                Streaming technology expert with background in sports broadcasting
              </p>
            </div>
          </div>

          {/* Team Member 3 */}
          <div className="text-center space-y-3">
            <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden border-2 border-fhsb-green">
              <Image src="/placeholder.svg?height=200&width=200" alt="Team Member" fill className="object-cover" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-fhsb-cream">Marcus Williams</h3>
              <p className="text-fhsb-green">Head of Content</p>
              <p className="text-sm text-muted-foreground mt-2">
                Former sports journalist with passion for storytelling
              </p>
            </div>
          </div>

          {/* Team Member 4 */}
          <div className="text-center space-y-3">
            <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden border-2 border-fhsb-green">
              <Image src="/placeholder.svg?height=200&width=200" alt="Team Member" fill className="object-cover" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-fhsb-cream">Olivia Rodriguez</h3>
              <p className="text-fhsb-green">Head of Community</p>
              <p className="text-sm text-muted-foreground mt-2">Community building expert with background in esports</p>
            </div>
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="bg-gradient-to-r from-black to-fhsb-darkgreen rounded-xl border border-fhsb-green/30 p-6 md:p-8">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-fhsb-cream">Join Our Journey</h2>
          <p className="text-muted-foreground md:text-lg">
            We're just getting started, and we'd love for you to be part of our story. Whether you're a creator, a
            viewer, or just passionate about sports, there's a place for you at Fieldhouse Stadium Beta.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link href="/register">
              <Button className="w-full sm:w-auto bg-fhsb-green text-black hover:bg-fhsb-green/90">
                Create Account
              </Button>
            </Link>
            <Link href="/careers">
              <Button
                variant="outline"
                className="w-full sm:w-auto border-fhsb-green/50 text-fhsb-cream hover:bg-fhsb-green hover:text-black"
              >
                Join Our Team
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
