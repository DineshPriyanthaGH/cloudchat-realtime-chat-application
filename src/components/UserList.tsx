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
      <div className="flex flex-col h-full bg-white border-r shadow-lg rounded-l-lg overflow-hidden">
        {/* Header */}
        <div className="bg-green-700 text-white px-5 py-4 flex items-center gap-4 rounded-t-lg shadow-md">
          <img
              src={currentUser?.photoURL || "/default-avatar.png"}
              alt="avatar"
              className="w-12 h-12 rounded-full border-2 border-white object-cover"
          />
          <div>
            <h2 className="font-semibold text-lg leading-tight">{currentUser?.displayName || currentUser?.email}</h2>
            <p className="text-sm opacity-80">Online</p>
          </div>
          <Button
              onClick={handleLogout}
              className="ml-auto bg-white text-green-700 font-semibold hover:bg-green-100 px-4 py-1 rounded-lg shadow-sm transition"
              size="sm"
          >
            Logout
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-5">
          <div className="flex justify-between items-center">
            <h3 className="text-green-800 font-bold text-lg">Groups</h3>
            <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-1 rounded-lg shadow"
                onClick={() => setShowGroupModal(true)}
            >
              + Create Group
            </Button>
          </div>
          <ul className="divide-y divide-gray-200 rounded-lg bg-gray-50 shadow-inner">
            {groups.map((group) => (
                <li
                    key={group.id}
                    onClick={() => onSelectGroup && onSelectGroup(group)}
                    className="cursor-pointer px-4 py-3 hover:bg-green-100 transition rounded"
                >
                  <span className="text-green-900 font-medium">{group.name}</span>
                </li>
            ))}
          </ul>

          <h3 className="text-green-800 font-bold text-lg mt-6 mb-2">Users</h3>
          <ul className="divide-y divide-gray-200 rounded-lg bg-gray-50 shadow-inner">
            {users.map((user) => (
                <li
                    key={user.uid}
                    onClick={() => onSelectUser(user)}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-green-100 transition rounded"
                >
                  <img
                      src={user.photoURL || "/default-avatar.png"}
                      alt="avatar"
                      className="w-9 h-9 rounded-full object-cover"
                  />
                  <span className="text-gray-900 font-semibold">{user.displayName || user.email}</span>
                </li>
            ))}
          </ul>
        </div>

        {/* Group Modal */}
        {showGroupModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 space-y-6">
                <h2 className="text-2xl font-bold text-green-700">Create Group</h2>
                <form onSubmit={handleCreateGroup} className="space-y-4">
                  <input
                      type="text"
                      className="w-full border border-green-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                      placeholder="Group name"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      required
                  />
                  <div>
                    <p className="font-semibold mb-2 text-gray-700">Select members:</p>
                    <div className="max-h-48 overflow-y-auto border border-green-200 rounded-lg p-2">
                      {users.map((user) => (
                          <label
                              key={user.uid}
                              className="flex items-center gap-3 mb-2 cursor-pointer hover:bg-green-50 rounded px-2 py-1"
                          >
                            <input
                                type="checkbox"
                                checked={selectedMembers.includes(user.uid)}
                                onChange={(e) => {
                                  if (e.target.checked) setSelectedMembers((prev) => [...prev, user.uid]);
                                  else setSelectedMembers((prev) => prev.filter((uid) => uid !== user.uid));
                                }}
                                className="form-checkbox h-5 w-5 text-green-600"
                            />
                            <span className="text-gray-900">{user.displayName || user.email}</span>
                          </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        className="border-green-600 text-green-600 hover:bg-green-50"
                        onClick={() => setShowGroupModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg px-5 py-2 shadow-lg">
                      Create
                    </Button>
                  </div>
                </form>
              </div>
            </div>
        )}
      </div>

  );
};

export default UserList; 