import React, { useEffect, useState } from "react";
import {addDoc, collection, getDocs, query,where, serverTimestamp} from "firebase/firestore";
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
interface Group {
  id: string;
  name: string;
  members: string[];
}

interface UserListProps {
  onSelectUser: (user: UserProfile) => void;
  onSelectGroup?: (group: Group) => void;
}

const UserList: React.FC<UserListProps> = ({ onSelectUser ,onSelectGroup}) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
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
      if (currentUser) {
        const groupQuery = query(collection(db, "groups"), where("members", "array-contains", currentUser.uid));
        const groupSnapshot = await getDocs(groupQuery);
        const groupList: Group[] = groupSnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
        setGroups(groupList);
      }
      setLoading(false);
    };
    fetchUsersAndGroups();
  }, [currentUser]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || selectedMembers.length === 0 || !currentUser) return;
    await addDoc(collection(db, "groups"), {
      name: groupName,
      members: [currentUser.uid, ...selectedMembers],
      createdAt: serverTimestamp(),
    });
    setShowGroupModal(false);
    setGroupName("");
    setSelectedMembers([]);
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
            <Button size="sm" className="bg-whatsapp-green text-white" onClick={() => setShowGroupModal(true)}>+ Create Group</Button>
          </div>
          <ul className="bg-white rounded-lg mb-4">
            {groups.map((group) => (
                <li
                    key={group.id}
                    className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-green-100 border-b transition"
                    onClick={() => onSelectGroup && onSelectGroup(group)}
                >
                  <span className="font-medium">{group.name}</span>
                </li>
            ))}
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
        {/* Group creation modal */}
        {showGroupModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Create Group</h2>
                <form onSubmit={handleCreateGroup} className="space-y-4">
                  <input
                      type="text"
                      className="w-full border rounded px-3 py-2"
                      placeholder="Group name"
                      value={groupName}
                      onChange={e => setGroupName(e.target.value)}
                      required
                  />
                  <div>
                    <div className="font-semibold mb-2">Select members:</div>
                    <div className="max-h-40 overflow-y-auto">
                      {users.map(user => (
                          <label key={user.uid} className="flex items-center gap-2 mb-1">
                            <input
                                type="checkbox"
                                checked={selectedMembers.includes(user.uid)}
                                onChange={e => {
                                  if (e.target.checked) setSelectedMembers(prev => [...prev, user.uid]);
                                  else setSelectedMembers(prev => prev.filter(uid => uid !== user.uid));
                                }}
                            />
                            <span>{user.displayName || user.email}</span>
                          </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={() => setShowGroupModal(false)}>Cancel</Button>
                    <Button type="submit" className="bg-whatsapp-green text-white">Create</Button>
                  </div>
                </form>
              </div>
            </div>
        )}
      </div>
  );
};

export default UserList; 