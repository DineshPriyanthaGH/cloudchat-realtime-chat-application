import { useState, useEffect } from "react";
import UserList from "../components/UserList";
import { getAuth, signOut } from "firebase/auth";
import ChatRoom from "../components/ChatRoom";
import { useNavigate } from "react-router-dom";
import GroupChatRoom from "../components/GroupChatRoom.tsx";

interface UserProfile {
  uid: string;
  displayName: string;
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
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    setCurrentUser(auth.currentUser);
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setSelectedUser(null);
      setSelectedGroup(null);
    });
    return () => unsubscribe();
  }, []);

  function getChatId(uid1: string, uid2: string) {
    return [uid1, uid2].sort().join("_");
  }

  const handleLogout = async () => {
    await signOut(getAuth());
    navigate("/");
  };

  const handleSelectUser = (user: UserProfile) => {
    setSelectedUser(user);
    setSelectedGroup(null);
  };
  const handleSelectGroup = (group: Group) => {
    setSelectedGroup(group);
    setSelectedUser(null);
  };
  if (!currentUser) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
      <div className="min-h-screen flex bg-black">
        <div className="w-full max-w-xs md:max-w-sm h-screen flex flex-col">
          <UserList onSelectUser={handleSelectUser} onSelectGroup={handleSelectGroup} />
        </div>
        <div className="flex-1 h-screen flex items-center justify-center bg-black">
          {selectedUser ? (
              <div className="flex-1 h-screen flex items-center justify-center">
                <ChatRoom chatId={getChatId(currentUser.uid, selectedUser.uid)} />
              </div>
          ) : selectedGroup ? (
              <div className="flex-1 h-screen flex items-center justify-center">
                <GroupChatRoom group={selectedGroup} />
              </div>
          ) : (
              <div className="text-gray-400">Select a user or group to start chatting</div>
          )}
        </div>
      </div>
  );

};

export default Profile; 