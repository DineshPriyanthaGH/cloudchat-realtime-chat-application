import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { 
  MessageCircle, 
  Shield, 
  Zap, 
  Users, 
  FileImage, 
  Smartphone,
  Star,
  Quote
} from "lucide-react";
import { AuthModal } from "../components/AuthModal";

const Index = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');

  const features = [
    {
      icon: Zap,
      title: "Real-time Messaging",
      description: "Instant message delivery with live notifications"
    },
    {
      icon: Users,
      title: "Group & Private Chats",
      description: "Create channels, groups, or private conversations"
    },
    {
      icon: FileImage,
      title: "Secure File Sharing",
      description: "Share files, images, and documents safely"
    },
    {
      icon: Smartphone,
      title: "Accessible Anywhere",
      description: "Chat from any device, anywhere in the world"
    },
    {
      icon: Shield,
      title: "End-to-End Encryption",
      description: "Your conversations are private and secure"
    },
    {
      icon: MessageCircle,
      title: "Rich Messaging",
      description: "Emojis, reactions, threads, and more"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Manager",
      content: "CloudChat transformed how our team communicates. The security features give us peace of mind.",
      rating: 5
    },
    {
      name: "Marcus Rodriguez",
      role: "Startup Founder",
      content: "Finally, a chat app that just works. Clean, fast, and incredibly reliable.",
      rating: 5
    },
    {
      name: "Emily Watson",
      role: "Remote Team Lead",
      content: "The best messaging platform we've used. Our productivity has increased significantly.",
      rating: 5
    }
  ];

  const handleAuthClick = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-subtle-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/2 rounded-full blur-3xl animate-subtle-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">CloudChat</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => handleAuthClick('signin')}
              className="hover:bg-secondary transition-colors"
            >
              Sign In
            </Button>
            <Button 
              onClick={() => handleAuthClick('signup')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-20 md:py-32">
        <div className="container mx-auto px-6 text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-foreground">Your Secure, Cloud-Based Chat—</span>
              <span className="gradient-text block mt-2">
                Instant, Private, Effortless
              </span>
            </h1>
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Experience the future of communication with our next-generation chat platform. 
              Built for teams, designed for everyone.
            </p>
          </div>
          
          <div className="animate-fade-in flex flex-col sm:flex-row gap-4 justify-center" style={{ animationDelay: '0.6s' }}>
            <Button 
              size="lg"
              onClick={() => handleAuthClick('signup')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg animate-glow"
            >
              Sign Up Free
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 text-lg transition-all duration-300"
            >
              Explore Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 bg-card/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to chat better</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to make communication seamless, secure, and enjoyable.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="bg-card border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group"
              >
                <CardContent className="p-6">
                  <feature.icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Testimonials</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by teams worldwide</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what our users have to say about their CloudChat experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index} 
                className="bg-card border-border hover:border-primary/30 transition-all duration-300 group"
              >
                <CardContent className="p-6">
                  <Quote className="h-8 w-8 text-primary mb-4" />
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 bg-primary/5">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to transform your communication?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of teams already using CloudChat to collaborate better.
          </p>
          <Button 
            size="lg"
            onClick={() => handleAuthClick('signup')}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg animate-glow"
          >
            Start Chatting Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <MessageCircle className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold gradient-text">CloudChat</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <span>© 2024 CloudChat. All rights reserved.</span>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Enterprise Security</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </div>
  );
};

export default Index;
