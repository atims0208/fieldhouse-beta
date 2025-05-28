import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { StreamGrid } from '@/components/stream-grid';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-r from-brand-dark via-brand to-brand-light text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-5xl font-bold mb-6">Watch and Stream Live Sports</h1>
              <p className="text-xl mb-8">
                Join the community of sports enthusiasts sharing their passion through live streaming.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="bg-white text-brand hover:bg-gray-100">
                  <Link href="/browse">
                    Watch Now
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Link href="/auth/register">
                    Start Streaming
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Streams */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">Featured Streams</h2>
            <StreamGrid featured limit={6} />
            <div className="mt-10 text-center">
              <Button asChild variant="outline" size="lg">
                <Link href="/browse">
                  View All Streams
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-background p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-brand text-white rounded-full flex items-center justify-center mb-4 text-xl font-bold">1</div>
                <h3 className="text-xl font-semibold mb-3">Create an Account</h3>
                <p className="text-muted-foreground">Sign up for free and join our community of sports enthusiasts.</p>
              </div>
              <div className="bg-background p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-brand text-white rounded-full flex items-center justify-center mb-4 text-xl font-bold">2</div>
                <h3 className="text-xl font-semibold mb-3">Set Up Your Stream</h3>
                <p className="text-muted-foreground">Connect your streaming software and customize your channel.</p>
              </div>
              <div className="bg-background p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-brand text-white rounded-full flex items-center justify-center mb-4 text-xl font-bold">3</div>
                <h3 className="text-xl font-semibold mb-3">Go Live</h3>
                <p className="text-muted-foreground">Start streaming your sports content and build your audience.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-brand text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Share Your Sports Journey?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Whether you're a professional athlete, amateur player, or sports enthusiast, Fieldhouse gives you the platform to share your passion.
            </p>
            <Button asChild size="lg" className="bg-white text-brand hover:bg-gray-100">
              <Link href="/auth/register">
                Get Started Now
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
