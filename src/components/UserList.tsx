import React, { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  query,
  where,
  serverTimestamp,
  onSnapshot,
  doc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  Users, 
  Plus, 
  LogOut, 
  MessageSquare,
  Bell,
  Search,
  UserPlus,
  Clock,
  User
} from "lucide-react";

interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  isOnline?: boolean;
  lastSeen?: any;
}

interface Group {
  id: string;
  name: string;
  members: string[];
  createdAt?: any;
}

interface UserListProps {
  onSelectUser: (user: UserProfile) => void;
  onSelectGroup?: (group: Group) => void;
  onShowNotifications?: () => void;
  notificationsCount?: number;
}

const UserList: React.FC<UserListProps> = ({ 
  onSelectUser, 
  onSelectGroup,
  onShowNotifications,
  notificationsCount = 0 
}) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const navigate = useNavigate();

  // Update user presence
  useEffect(() => {
    if (!currentUser) return;

    const updatePresence = async () => {
      await setDoc(doc(db, "users", currentUser.uid), {
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName || currentUser.email,
        photoURL: currentUser.photoURL || "",
        isOnline: true,
        lastSeen: serverTimestamp(),
      }, { merge: true });
    };

    updatePresence();

    // Update presence every 30 seconds
    const interval = setInterval(updatePresence, 30000);

    // Set offline when component unmounts
    return () => {
      clearInterval(interval);
      updateDoc(doc(db, "users", currentUser.uid), {
        isOnline: false,
        lastSeen: serverTimestamp(),
      }).catch(console.error);
    };
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;

    // Listen to users with real-time updates
    const unsubscribeUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      const userList: UserProfile[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.uid !== currentUser?.uid) {
          userList.push(data as UserProfile);
        }
      });
      setUsers(userList);
      setLoading(false);
    });

    // Listen to groups with real-time updates
    const unsubscribeGroups = onSnapshot(
      query(collection(db, "groups"), where("members", "array-contains", currentUser.uid)),
      (snapshot) => {
        const groupList: Group[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as any),
        }));
        setGroups(groupList);
      }
    );

    return () => {
      unsubscribeUsers();
      unsubscribeGroups();
    };
  }, [currentUser]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!groupName.trim() || selectedMembers.length === 0 || !currentUser) {
      alert("Please provide a group name and select members.");
      return;
    }

    try {
      const groupRef = await addDoc(collection(db, "groups"), {
        name: groupName,
        members: [currentUser.uid, ...selectedMembers],
        createdAt: serverTimestamp(),
      });

      // Send notifications to added users
      for (const memberId of selectedMembers) {
        await addDoc(collection(db, "users", memberId, "notifications"), {
          groupId: groupRef.id,
          groupName: groupName,
          sender: currentUser.displayName || currentUser.email,
          createdAt: serverTimestamp(),
        });
      }

      console.log("Group created with ID:", groupRef.id);
      setShowGroupModal(false);
      setGroupName("");
      setSelectedMembers([]);

    } catch (error) {
      console.error("Error creating group:", error);
      alert("Failed to create group.");
    }
  };

  const formatLastSeen = (lastSeen: any) => {
    if (!lastSeen) return "Never";
    
    const now = new Date();
    const lastSeenDate = lastSeen.toDate ? lastSeen.toDate() : new Date(lastSeen);
    const diffMs = now.getTime() - lastSeenDate.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return lastSeenDate.toLocaleDateString();
  };

  const filteredUsers = users.filter(user =>
    (user.displayName || user.email).toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="h-full w-full flex items-center justify-center bg-card">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
        <p className="text-muted-foreground">Loading users...</p>
      </div>
    </div>
  );

  return (
    <div className="h-full w-full flex flex-col bg-card/50 backdrop-blur-sm border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h2 className="text-white font-semibold text-sm">
              {currentUser?.displayName || currentUser?.email}
            </h2>
            <p className="text-white/80 text-xs">Online</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {onShowNotifications && (
            <Button
              onClick={onShowNotifications}
              variant="ghost"
              size="sm"
              className="relative text-white hover:bg-white/10"
            >
              <Bell className="h-4 w-4" />
              {notificationsCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-red-500 text-white">
                  {notificationsCount}
                </Badge>
              )}
            </Button>
          )}
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Groups Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium text-sm">Groups ({groups.length})</h3>
            </div>
            <Button
              size="sm"
              onClick={() => setShowGroupModal(true)}
              className="h-7 px-2 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="h-3 w-3 mr-1" />
              Create
            </Button>
          </div>
          <div className="space-y-1">
            {groups.map((group) => (
              <div
                key={group.id}
                onClick={() => onSelectGroup && onSelectGroup(group)}
                className="cursor-pointer p-3 rounded-lg bg-background hover:bg-accent/10 transition-all duration-200 border border-transparent hover:border-accent/20"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{group.name}</p>
                    <p className="text-xs text-muted-foreground">{group.members.length} members</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Users Section */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-medium text-sm">Users ({filteredUsers.length})</h3>
          </div>
          <div className="space-y-1">
            {filteredUsers.map((user) => (
              <div
                key={user.uid}
                onClick={() => onSelectUser(user)}
                className="cursor-pointer p-3 rounded-lg bg-background hover:bg-accent/10 transition-all duration-200 border border-transparent hover:border-accent/20"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-muted to-muted-foreground rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${
                      user.isOnline ? 'bg-green-400' : 'bg-gray-400'
                    }`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{user.displayName || user.email}</p>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      {user.isOnline ? (
                        <span className="text-green-400">Online</span>
                      ) : (
                        <>
                          <Clock className="h-3 w-3" />
                          <span>{formatLastSeen(user.lastSeen)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Group Modal */}
      {showGroupModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <UserPlus className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Create Group</h2>
              </div>
              
              <form onSubmit={handleCreateGroup} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Group Name</label>
                  <input
                    type="text"
                    placeholder="Enter group name..."
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Select Members ({selectedMembers.length} selected)
                  </label>
                  <div className="max-h-48 overflow-y-auto border border-border rounded-lg p-2 bg-background">
                    {users.map((user) => (
                      <label
                        key={user.uid}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent/10 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedMembers.includes(user.uid)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedMembers((prev) => [...prev, user.uid]);
                            } else {
                              setSelectedMembers((prev) => prev.filter((uid) => uid !== user.uid));
                            }
                          }}
                          className="w-4 h-4 text-primary focus:ring-primary border-border rounded"
                        />
                        <div className="w-6 h-6 bg-gradient-to-br from-muted to-muted-foreground rounded-full flex items-center justify-center">
                          <User className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-sm">{user.displayName || user.email}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowGroupModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    Create Group
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
