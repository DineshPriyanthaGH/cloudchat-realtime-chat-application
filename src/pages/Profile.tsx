
import { useEffect, useState } from "react";
import UserList from "../components/UserList";
import ProfileSidebar from "../components/ProfileSidebar";
import { getAuth } from "firebase/auth";
import ChatRoom from "../components/ChatRoom";
import GroupChatRoom from "../components/GroupChatRoom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { MessageCircle, Users, User, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { useMessageNotifications } from "../hooks/useNotifications";
import { Toaster } from "../components/ui/toaster";

// For now, let's create a simple notifications component inline
const NotificationsPanel = ({ open, onClose, onGoToGroup }: any) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">✕</button>
        </div>
        <p className="text-center text-muted-foreground py-8">No notifications yet</p>
      </div>
    </div>
  );
};

interface UserProfile {
  uid: string;
  displayName?: string;
  email: string;
  photoURL?: string;
}

interface Group {
  id: string;
  name: string;
  members: string[];
}

const Profile = () => {
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [profileSidebarOpen, setProfileSidebarOpen] = useState(false);

  // Get current chat ID
  const currentChatId = selectedUser ? getChatId(currentUser?.uid || "", selectedUser.uid) : null;
  
  // Enable message notifications
  useMessageNotifications(
    currentChatId,
    selectedGroup?.id || null,
    {
      enabled: true,
      sound: true,
      desktop: true
    }
  );

  useEffect(() => {
    const auth = getAuth();
    setCurrentUser(auth.currentUser);
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setSelectedUser(null);
      setSelectedGroup(null);
    });
    
    // Listen for notifications
    let unsubNoti: (() => void) | undefined;
    if (auth.currentUser) {
      unsubNoti = onSnapshot(collection(db, "users", auth.currentUser.uid, "notifications"), (snap) => {
        setNotificationsCount(snap.size);
      });
    }
    
    return () => {
      unsubscribe();
      if (unsubNoti) unsubNoti();
    };
  }, []);

  function getChatId(uid1: string, uid2: string) {
    return [uid1, uid2].sort().join("_");
  }

  const handleSelectUser = (user: UserProfile) => {
    setSelectedUser(user);
    setSelectedGroup(null);
  };
  
  const handleSelectGroup = (group: Group) => {
    setSelectedGroup(group);
    setSelectedUser(null);
  };

  // For notifications
  const handleShowNotifications = () => setNotificationsOpen(true);
  const handleGoToGroup = (groupId: string) => {
    setNotificationsOpen(false);
    // Find group & select it
    setSelectedGroup({ id: groupId, name: "Group", members: [] });
    setSelectedUser(null);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="h-16 w-16 text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Welcome to CloudChat</h2>
          <p className="text-muted-foreground">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-subtle-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/2 rounded-full blur-3xl animate-subtle-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header with Profile Toggle */}
      <div className="relative z-10 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <MessageCircle className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold gradient-text">CloudChat</span>
          </div>
          
          <Button
            onClick={() => setProfileSidebarOpen(!profileSidebarOpen)}
            variant="ghost"
            size="sm"
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <span className="hidden md:inline">Profile</span>
          </Button>
        </div>
      </div>

      <div className="relative z-10 h-[calc(100vh-73px)] flex">
        {/* Profile Sidebar - Conditional */}
        {profileSidebarOpen && (
          <div className="w-80 h-full p-4 border-r border-border bg-card/30 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Profile Settings</h2>
              <Button
                onClick={() => setProfileSidebarOpen(false)}
                variant="ghost"
                size="sm"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ProfileSidebar user={currentUser} />
          </div>
        )}

        {/* User List Sidebar - Made bigger */}
        <div className={`${profileSidebarOpen ? 'w-96' : 'w-96'} h-full p-4 ${profileSidebarOpen ? 'pl-0' : ''}`}>
          <UserList
            onSelectUser={handleSelectUser}
            onSelectGroup={handleSelectGroup}
            onShowNotifications={handleShowNotifications}
            notificationsCount={notificationsCount}
          />
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 h-full p-4 pl-0">
          <div className="h-full bg-card/30 backdrop-blur-sm border border-border rounded-lg overflow-hidden">
            {selectedUser ? (
              <ChatRoom 
                chatId={getChatId(currentUser.uid, selectedUser.uid)} 
                selectedUser={selectedUser}
              />
            ) : selectedGroup ? (
              <GroupChatRoom group={selectedGroup} />
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Start a Conversation</h3>
                  <p className="text-muted-foreground">
                    Select a user or group to start chatting
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notifications Panel */}
      <NotificationsPanel
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        onGoToGroup={handleGoToGroup}
      />

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
};

export default Profile; 
