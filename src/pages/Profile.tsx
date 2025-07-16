import { useState, useEffect } from "react";
import UserList from "../components/UserList";
import { getAuth, signOut } from "firebase/auth";
import ChatRoom from "../components/ChatRoom";
import { useNavigate } from "react-router-dom";

interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
}

const Profile = () => {
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    setCurrentUser(auth.currentUser);
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setSelectedUser(null);
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

  };
  if (!currentUser) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
      <div className="min-h-screen flex bg-black">
        <div className="w-full max-w-xs md:max-w-sm h-screen flex flex-col">
          <UserList onSelectUser={handleSelectUser}  />
        </div>
        <div className="flex-1 h-screen flex items-center justify-center bg-black">
          {selectedUser ? (
              <div className="flex-1 h-screen flex items-center justify-center">
                <ChatRoom chatId={getChatId(currentUser.uid, selectedUser.uid)} />
              </div>
          )  : (
              <div className="text-gray-400">Select a user or group to start chatting</div>
          )}
        </div>
      </div>
  );
};

export default Profile; 