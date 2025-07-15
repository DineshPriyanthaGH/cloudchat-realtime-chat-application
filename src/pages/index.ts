import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Shield, 
  Zap, 
  Users, 
  FileImage, 
  Smartphone,
  Star,
  Quote,
  Check
} from "lucide-react";
import { AuthModal } from "@/components/AuthModal";

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
      {/* Enhanced background decoration with more animations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-primary/3 rounded-full blur-2xl animate-ripple" style={{ animationDelay: '1s' }}></div>
        
        {/* Animated flowing lines */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-shimmer"></div>
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-accent/20 to-transparent animate-shimmer" style={{ animationDelay: '1.5s' }}></div>
        
        {/* Flowing corner accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/10 to-transparent animate-wave"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-accent/10 to-transparent animate-wave" style={{ animationDelay: '2.5s' }}></div>
      </div>

      {/* Header with enhanced animations */}
      <header className="relative z-10 border-b border-border animate-border-run">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-8 w-8 text-primary animate-text-glow" />
            <span className="text-2xl font-bold flowing-text">CloudChat</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => handleAuthClick('signin')}
              className="hover:bg-secondary hover:text-primary transition-all duration-300 animate-shimmer shimmer-overlay"
            >
              Sign In
            </Button>
            <Button 
              onClick={() => handleAuthClick('signup')}
              className="animate-flowing-gradient text-primary-foreground animate-glow hover:scale-105 transition-transform"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section with enhanced animations */}
      <section className="relative z-10 py-20 md:py-32">
        <div className="container mx-auto px-6 text-center">
          <div className="animate-slide-up">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="animate-text-glow">Your Secure, Cloud-Based Chat—</span>
              <span className="highlight-underline animate-pulse-glow flowing-text block mt-2">
                Instant, Private, Effortless
              </span>
            </h1>
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-color-shift">
              Experience the future of communication with our next-generation chat platform. 
              Built for teams, designed for everyone.
            </p>
          </div>
          
          <div className="animate-fade-in flex flex-col sm:flex-row gap-4 justify-center" style={{ animationDelay: '1s' }}>
            <Button 
              size="lg"
              onClick={() => handleAuthClick('signup')}
              className="animate-flowing-gradient text-primary-foreground px-8 py-4 text-lg animate-glow hover:scale-110 transition-all duration-300 border-2 animate-border-run"
            >
              <span className="animate-text-glow">Sign Up Free</span>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 text-lg animate-border-run hover:animate-glow transition-all duration-300"
            >
              Explore Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section with enhanced card animations */}
      <section className="relative z-10 py-20 bg-card/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 animate-glow">Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-text-glow">Everything you need to chat better</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-color-shift">
              Powerful features designed to make communication seamless, secure, and enjoyable.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 animate-border-run hover:animate-glow group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <feature.icon className="h-12 w-12 text-primary mb-4 animate-text-glow group-hover:animate-wave" />
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                  <p className="text-muted-foreground group-hover:animate-color-shift">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section with enhanced animations */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-accent/10 text-accent border-accent/20 animate-glow">Testimonials</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-text-glow">Loved by teams worldwide</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-color-shift">
              See what our users have to say about their CloudChat experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index} 
                className="bg-card border-border hover:border-accent/50 transition-all duration-300 animate-border-run hover:animate-glow group"
              >
                <CardContent className="p-6">
                  <Quote className="h-8 w-8 text-accent mb-4 animate-text-glow group-hover:animate-wave" />
                  <p className="text-muted-foreground mb-4 italic group-hover:animate-color-shift">"{testimonial.content}"</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold group-hover:text-accent transition-colors duration-300">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current animate-text-glow" style={{ animationDelay: `${i * 0.1}s` }} />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with enhanced animations */}
      <section className="relative z-10 py-20 bg-gradient-to-r from-primary/10 to-accent/10 animate-flowing-gradient">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-text-glow flowing-text">Ready to transform your communication?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-color-shift">
            Join thousands of teams already using CloudChat to collaborate better.
          </p>
          <Button 
            size="lg"
            onClick={() => handleAuthClick('signup')}
            className="animate-flowing-gradient text-primary-foreground px-8 py-4 text-lg animate-glow hover:scale-110 transition-all duration-300 border-2 animate-border-run"
          >
            <span className="animate-text-glow">Start Chatting Now</span>
          </Button>
        </div>
      </section>

      {/* Footer with enhanced styling */}
      <footer className="relative z-10 border-t border-border py-12 animate-border-run">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <MessageCircle className="h-6 w-6 text-primary animate-text-glow" />
              <span className="text-lg font-semibold flowing-text">CloudChat</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <span className="animate-color-shift">© 2024 CloudChat. All rights reserved.</span>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 animate-text-glow" />
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
