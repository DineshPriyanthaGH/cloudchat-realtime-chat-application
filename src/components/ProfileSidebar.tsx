import React, { useRef, useState, useEffect } from "react";
import { updateProfile } from "firebase/auth";
import { db, storage } from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { Button } from "./ui/button";
import { 
  Camera, 
  Edit3, 
  Save, 
  X, 
  User, 
  Shield, 
  Eye, 
  EyeOff,
  Info,
  Settings,
  Sun,
  Moon,
  Monitor
} from "lucide-react";

interface UserProfileSidebarProps {
  user: any;
  onAvatarUpdated?: (url: string) => void;
}

const ProfileSidebar: React.FC<UserProfileSidebarProps> = ({ user, onAvatarUpdated }) => {
  const [uploading, setUploading] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [editingAbout, setEditingAbout] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [about, setAbout] = useState("");
  const [isOnline, setIsOnline] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load user profile data and theme
    const loadUserData = async () => {
      if (user?.uid) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setAbout(userData.about || "Hey there! I'm using CloudChat.");
            setShowOnlineStatus(userData.showOnlineStatus !== false);
            setTheme(userData.theme || 'system');
          }
        } catch (error) {
          console.error("Error loading user data:", error);
        }
      }
      
      // Load theme from localStorage if no user
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' || 'system';
      setTheme(savedTheme);
      applyTheme(savedTheme);
    };
    loadUserData();
  }, [user]);

  const applyTheme = (newTheme: 'light' | 'dark' | 'system') => {
    const root = document.documentElement;
    
    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.toggle('dark', systemTheme === 'dark');
      root.classList.toggle('light', systemTheme === 'light');
    } else {
      root.classList.toggle('dark', newTheme === 'dark');
      root.classList.toggle('light', newTheme === 'light');
    }
  };

  const handleThemeChange = async (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (user?.uid) {
      try {
        await updateDoc(doc(db, "users", user.uid), { theme: newTheme });
      } catch (error) {
        console.error("Error updating theme:", error);
      }
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    setUploading(true);
    try {
      const storageRef = ref(storage, `avatars/${user.uid}`);
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);
      
      await updateProfile(user, { photoURL });
      await updateDoc(doc(db, "users", user.uid), { photoURL });
      
      if (onAvatarUpdated) onAvatarUpdated(photoURL);
    } catch (error) {
      console.error("Error updating avatar:", error);
    }
    setUploading(false);
  };

  const handleNameSave = async () => {
    if (!user || !displayName.trim()) return;
    
    try {
      await updateProfile(user, { displayName });
      await updateDoc(doc(db, "users", user.uid), { displayName });
      setEditingName(false);
    } catch (error) {
      console.error("Error updating name:", error);
    }
  };

  const handleAboutSave = async () => {
    if (!user) return;
    
    try {
      await updateDoc(doc(db, "users", user.uid), { about });
      setEditingAbout(false);
    } catch (error) {
      console.error("Error updating about:", error);
    }
  };

  const handlePrivacyUpdate = async (field: string, value: boolean) => {
    if (!user) return;
    
    try {
      await updateDoc(doc(db, "users", user.uid), { [field]: value });
      if (field === 'showOnlineStatus') {
        setShowOnlineStatus(value);
      }
    } catch (error) {
      console.error("Error updating privacy:", error);
    }
  };

  return (
    <div className="w-80 h-full bg-card/50 backdrop-blur-sm border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Profile</h2>
          <Button
            onClick={() => setShowSettings(!showSettings)}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Profile Picture */}
        <div className="flex flex-col items-center">
          <div className="relative group">
            <img
              src={user?.photoURL || "/default-avatar.png"}
              className="w-24 h-24 rounded-full border-4 border-white/20 object-cover"
              alt="profile"
            />
            <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                 onClick={() => fileInput.current?.click()}>
              <Camera className="h-6 w-6 text-white" />
            </div>
            {isOnline && showOnlineStatus && (
              <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-400 rounded-full border-3 border-white"></div>
            )}
          </div>
          
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
            disabled={uploading}
          />
          
          {uploading && (
            <div className="mt-2 text-sm opacity-80">Uploading...</div>
          )}
        </div>
      </div>

   
      <div className="p-6 space-y-6">
        
        <div>
          <label className="flex items-center text-sm font-medium text-muted-foreground mb-2">
            <User className="h-4 w-4 mr-2" />
            Display Name
          </label>
          {editingName ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your name..."
              />
              <Button onClick={handleNameSave} size="sm" variant="outline">
                <Save className="h-3 w-3" />
              </Button>
              <Button onClick={() => setEditingName(false)} size="sm" variant="outline">
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
              <span className="text-sm">{user?.displayName || user?.email}</span>
              <Button
                onClick={() => {
                  setDisplayName(user?.displayName || "");
                  setEditingName(true);
                }}
                size="sm"
                variant="ghost"
              >
                <Edit3 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>

        {/* About Section */}
        <div>
          <label className="flex items-center text-sm font-medium text-muted-foreground mb-2">
            <Info className="h-4 w-4 mr-2" />
            About
          </label>
          {editingAbout ? (
            <div className="space-y-2">
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Tell us about yourself..."
                rows={3}
              />
              <div className="flex justify-end space-x-2">
                <Button onClick={handleAboutSave} size="sm" variant="outline">
                  <Save className="h-3 w-3 mr-1" />
                  Save
                </Button>
                <Button onClick={() => setEditingAbout(false)} size="sm" variant="outline">
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between p-3 bg-background rounded-lg border border-border">
              <span className="text-sm text-muted-foreground flex-1">{about}</span>
              <Button
                onClick={() => setEditingAbout(true)}
                size="sm"
                variant="ghost"
                className="ml-2"
              >
                <Edit3 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>

        {/* Privacy Settings */}
        {showSettings && (
          <div className="space-y-6">
            <div>
              <label className="flex items-center text-sm font-medium text-muted-foreground mb-3">
                <Shield className="h-4 w-4 mr-2" />
                Privacy Settings
              </label>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
                  <div className="flex items-center space-x-2">
                    {showOnlineStatus ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    <span className="text-sm">Show Online Status</span>
                  </div>
                  <button
                    onClick={() => handlePrivacyUpdate('showOnlineStatus', !showOnlineStatus)}
                    className={`w-11 h-6 rounded-full transition-colors ${
                      showOnlineStatus ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      showOnlineStatus ? 'translate-x-5' : 'translate-x-0'
                    }`}></div>
                  </button>
                </div>
              </div>
            </div>

            {/* Theme Settings */}
            <div>
              <label className="flex items-center text-sm font-medium text-muted-foreground mb-3">
                <Settings className="h-4 w-4 mr-2" />
                Theme
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleThemeChange('light')}
                  className={`flex flex-col items-center p-3 rounded-lg border transition-all ${
                    theme === 'light' 
                      ? 'border-primary bg-primary/10 text-primary' 
                      : 'border-border bg-background hover:bg-muted/50'
                  }`}
                >
                  <Sun className="h-4 w-4 mb-1" />
                  <span className="text-xs">Light</span>
                </button>
                
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`flex flex-col items-center p-3 rounded-lg border transition-all ${
                    theme === 'dark' 
                      ? 'border-primary bg-primary/10 text-primary' 
                      : 'border-border bg-background hover:bg-muted/50'
                  }`}
                >
                  <Moon className="h-4 w-4 mb-1" />
                  <span className="text-xs">Dark</span>
                </button>
                
                <button
                  onClick={() => handleThemeChange('system')}
                  className={`flex flex-col items-center p-3 rounded-lg border transition-all ${
                    theme === 'system' 
                      ? 'border-primary bg-primary/10 text-primary' 
                      : 'border-border bg-background hover:bg-muted/50'
                  }`}
                >
                  <Monitor className="h-4 w-4 mb-1" />
                  <span className="text-xs">System</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Status */}
        <div>
          <label className="flex items-center text-sm font-medium text-muted-foreground mb-2">
            Status
          </label>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-sm text-green-400">Online</span>
          </div>
        </div>

        {/* User ID */}
        <div>
          <label className="text-xs text-muted-foreground">User ID</label>
          <div className="text-xs font-mono bg-background px-2 py-1 rounded border border-border mt-1">
            {user?.uid?.slice(0, 8)}...
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
