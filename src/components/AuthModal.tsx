import * as React from "react";
import { useState } from "react";
import { auth, googleProvider } from "../firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { Eye, EyeOff, Mail, Lock, User, Chrome } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import {useNavigate} from "react-router-dom";
import {saveUserProfile} from "../lib/userProfile.ts";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'signin' | 'signup';
  onModeChange: (mode: 'signin' | 'signup') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen, onClose, mode, onModeChange
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (mode === 'signup' && !formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (mode === 'signup' && formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      if (mode === "signup") {
        await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        if (auth.currentUser) await updateProfile(auth.currentUser, { displayName: formData.name });
        if (auth.currentUser) await saveUserProfile(auth.currentUser);
        toast({ title: "Account created!", description: "Your CloudChat account has been created." });
      } else {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        toast({ title: "Welcome back!", description: "You've been signed in." });
      }
      onClose();
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
      setErrors({});
      navigate("/profile");
    } catch (error: any) {
      setErrors({ email: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      toast({ title: "Google sign-in successful!", description: "You've been signed in with Google." });
      onClose();
      navigate("/profile");
    } catch (error: any) {
      toast({ title: "Sign-in failed", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center gradient-text">Welcome to CloudChat</DialogTitle>
        </DialogHeader>
        <Tabs value={mode} onValueChange={(value) => onModeChange(value as 'signin' | 'signup')}>
          <TabsList className="grid w-full grid-cols-2 bg-secondary">
            <TabsTrigger value="signin" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Sign In</TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Sign Up</TabsTrigger>
          </TabsList>
          {/* Sign In Tab */}
          <TabsContent value="signin" className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="signin-email" className="flex items-center gap-2"><Mail className="h-4 w-4" />Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                  className={`transition-all duration-200 ${errors.email ? 'border-red-500' : 'focus:border-primary'}`}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>
              <div>
                <Label htmlFor="signin-password" className="flex items-center gap-2"><Lock className="h-4 w-4" />Password</Label>
                <div className="relative">
                  <Input
                    id="signin-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={e => handleInputChange('password', e.target.value)}
                    className={`pr-10 transition-all duration-200 ${errors.password ? 'border-red-500' : 'focus:border-primary'}`}
                  />
                  <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                  </Button>
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
              <Separator />
              <Button type="button" variant="outline" className="w-full flex items-center justify-center" onClick={handleGoogleAuth} disabled={isLoading}>
                <Chrome className="h-4 w-4 mr-2" />{isLoading ? 'Connecting...' : 'Sign in with Google'}
              </Button>
            </form>
          </TabsContent>
          {/* Sign Up Tab */}
          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="signup-name" className="flex items-center gap-2"><User className="h-4 w-4" />Full Name</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  className={`transition-all duration-200 ${errors.name ? 'border-red-500' : 'focus:border-primary'}`}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>
              <div>
                <Label htmlFor="signup-email" className="flex items-center gap-2"><Mail className="h-4 w-4" />Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                  className={`transition-all duration-200 ${errors.email ? 'border-red-500' : 'focus:border-primary'}`}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>
              <div>
                <Label htmlFor="signup-password" className="flex items-center gap-2"><Lock className="h-4 w-4" />Password</Label>
                <div className="relative">
                  <Input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={e => handleInputChange('password', e.target.value)}
                    className={`pr-10 transition-all duration-200 ${errors.password ? 'border-red-500' : 'focus:border-primary'}`}
                  />
                  <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                  </Button>
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>
              <div>
                <Label htmlFor="signup-confirm-password" className="flex items-center gap-2"><Lock className="h-4 w-4" />Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="signup-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={e => handleInputChange('confirmPassword', e.target.value)}
                    className={`pr-10 transition-all duration-200 ${errors.confirmPassword ? 'border-red-500' : 'focus:border-primary'}`}
                  />
                  <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                  </Button>
                </div>
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
              <Separator />
              <Button type="button" variant="outline" className="w-full flex items-center justify-center" onClick={handleGoogleAuth} disabled={isLoading}>
                <Chrome className="h-4 w-4 mr-2" />{isLoading ? 'Connecting...' : 'Sign up with Google'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
