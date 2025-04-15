import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Search, HelpCircle, FileText, MessageSquare, Settings, Shield } from "lucide-react"

export default function HelpPage() {
  return (
    <div className="container px-4 py-6 md:px-6 space-y-8">
      <div className="text-center space-y-4 max-w-3xl mx-auto py-8">
        <h1 className="text-3xl md:text-5xl font-bold text-fhsb-cream">Help Center</h1>
        <p className="text-xl text-muted-foreground">Find answers to your questions about Fieldhouse Stadium Beta</p>
        <div className="relative mt-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search for help..."
            className="w-full pl-10 bg-muted/10 border-fhsb-green/30 focus-visible:ring-fhsb-green/50"
          />
        </div>
      </div>

      {/* Help Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card border-fhsb-green/20">
          <CardHeader className="flex flex-row items-start space-x-4 pb-2">
            <FileText className="h-8 w-8 text-fhsb-green mt-1" />
            <div>
              <CardTitle className="text-fhsb-cream">Getting Started</CardTitle>
              <CardDescription>Learn the basics of using our platform</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-fhsb-cream">
              <li>
                <Link href="#" className="hover:text-fhsb-green">
                  Creating an account
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-fhsb-green">
                  Setting up your profile
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-fhsb-green">
                  Finding content to watch
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-fhsb-green">
                  Following channels
                </Link>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-card border-fhsb-green/20">
          <CardHeader className="flex flex-row items-start space-x-4 pb-2">
            <Settings className="h-8 w-8 text-fhsb-green mt-1" />
            <div>
              <CardTitle className="text-fhsb-cream">Creator Resources</CardTitle>
              <CardDescription>Resources for content creators</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-fhsb-cream">
              <li>
                <Link href="#" className="hover:text-fhsb-green">
                  Streaming setup guide
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-fhsb-green">
                  Monetization options
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-fhsb-green">
                  Analytics and growth
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-fhsb-green">
                  Community guidelines
                </Link>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-card border-fhsb-green/20">
          <CardHeader className="flex flex-row items-start space-x-4 pb-2">
            <Shield className="h-8 w-8 text-fhsb-green mt-1" />
            <div>
              <CardTitle className="text-fhsb-cream">Account & Security</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-fhsb-cream">
              <li>
                <Link href="#" className="hover:text-fhsb-green">
                  Password reset
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-fhsb-green">
                  Account verification
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-fhsb-green">
                  Privacy settings
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-fhsb-green">
                  Two-factor authentication
                </Link>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Frequently Asked Questions */}
      <div className="py-8">
        <h2 className="text-2xl font-bold text-fhsb-cream mb-6">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1" className="border-fhsb-green/20">
            <AccordionTrigger className="text-fhsb-cream hover:text-fhsb-green">
              What is Fieldhouse Stadium Beta?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Fieldhouse Stadium Beta is a live streaming platform specifically designed for sports content. It allows
              creators to stream live sports events, analysis, coaching sessions, and more to a global audience of
              sports fans.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="border-fhsb-green/20">
            <AccordionTrigger className="text-fhsb-cream hover:text-fhsb-green">
              How do I start streaming on Fieldhouse Stadium Beta?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              To start streaming, you need to create an account, set up your creator profile, and configure your
              streaming software. Visit our Creator Resources section for detailed guides on getting started with
              streaming.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="border-fhsb-green/20">
            <AccordionTrigger className="text-fhsb-cream hover:text-fhsb-green">
              Is Fieldhouse Stadium Beta free to use?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Yes, Fieldhouse Stadium Beta is free to use for viewers. Creators have access to basic streaming features
              for free, with premium features available through our subscription plans.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="border-fhsb-green/20">
            <AccordionTrigger className="text-fhsb-cream hover:text-fhsb-green">
              How can I monetize my content?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Creators can monetize their content through channel subscriptions, viewer donations, ad revenue sharing,
              and sponsored content. You need to meet certain eligibility requirements to access these monetization
              features.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5" className="border-fhsb-green/20">
            <AccordionTrigger className="text-fhsb-cream hover:text-fhsb-green">
              What types of content are allowed on the platform?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Fieldhouse Stadium Beta welcomes sports-related content including live events, analysis, coaching,
              fitness, and educational content. All content must comply with our Community Guidelines and Terms of
              Service.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Contact Support */}
      <div className="bg-gradient-to-r from-black to-fhsb-darkgreen rounded-xl border border-fhsb-green/30 p-6 md:p-8">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-fhsb-cream">Still Need Help?</h2>
          <p className="text-muted-foreground md:text-lg">
            Our support team is ready to assist you with any questions or issues you may have.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link href="/contact">
              <Button className="w-full sm:w-auto bg-fhsb-green text-black hover:bg-fhsb-green/90">
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </Link>
            <Link href="#">
              <Button
                variant="outline"
                className="w-full sm:w-auto border-fhsb-green/50 text-fhsb-cream hover:bg-fhsb-green hover:text-black"
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                Live Chat
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
