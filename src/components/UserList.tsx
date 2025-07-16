import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
}

interface UserListProps {
  onSelectUser: (user: UserProfile) => void;

}

const UserList: React.FC<UserListProps> = ({ onSelectUser }) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsersAndGroups = async () => {
      // Fetch users
      const querySnapshot = await getDocs(collection(db, "users"));
      const userList: UserProfile[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.uid !== currentUser?.uid) {
          userList.push(data as UserProfile);
        }
      });
      setUsers(userList);
      // Fetch groups
      setLoading(false);
    };
    fetchUsersAndGroups();
  }, [currentUser]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };



  if (loading) return <div>Loading users...</div>;

  return (
    <div className="h-full flex flex-col bg-white border-r shadow-md rounded-l-lg">
      {/* WhatsApp-style green header */}
      <div className="bg-whatsapp-dark text-white px-4 py-3 flex items-center gap-3 rounded-t-lg shadow">
        <img src={currentUser?.photoURL || '/default-avatar.png'} alt="avatar" className="w-10 h-10 rounded-full border-2 border-white" />
        <div>
          <div className="font-bold">{currentUser?.displayName || currentUser?.email}</div>
          <div className="text-xs opacity-80">Online</div>
        </div>
        <Button onClick={handleLogout} className="ml-auto bg-whatsapp-dark hover:bg-whatsapp-green text-white" size="sm">Logout</Button>
      </div>
      <div className="px-2 pt-2 pb-4 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold text-whatsapp-dark">Groups</h2>

        </div>
        <ul className="bg-white rounded-lg mb-4">

        </ul>
        <h2 className="font-bold mb-2 text-whatsapp-dark">Users</h2>
        <ul className="bg-white rounded-lg">
          {users.map((user) => (
            <li
              key={user.uid}
              className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-green-100 border-b transition"
              onClick={() => onSelectUser(user)}
            >
              <img src={user.photoURL || '/default-avatar.png'} alt="avatar" className="w-8 h-8 rounded-full" />
              <span className="font-medium">{user.displayName || user.email}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
};

export default UserList; 