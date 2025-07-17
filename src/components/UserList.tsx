import React, { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
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

const UserList: React.FC<UserListProps> = ({ onSelectUser, onSelectGroup }) => {
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
      const querySnapshot = await getDocs(collection(db, "users"));
      const userList: UserProfile[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.uid !== currentUser?.uid) {
          userList.push(data as UserProfile);
        }
      });
      setUsers(userList);

      if (currentUser) {
        const groupQuery = query(
            collection(db, "groups"),
            where("members", "array-contains", currentUser.uid)
        );
        const groupSnapshot = await getDocs(groupQuery);
        const groupList: Group[] = groupSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as any),
        }));
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

      console.log("Group created with ID:", groupRef.id);
      setShowGroupModal(false);
      setGroupName("");
      setSelectedMembers([]);

      const updatedGroups = await getDocs(
          query(collection(db, "groups"), where("members", "array-contains", currentUser.uid))
      );
      const groupList: Group[] = updatedGroups.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
      setGroups(groupList);

    } catch (error) {
      console.error("Error creating group:", error);
      alert("Failed to create group.");
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
      <div className="flex flex-col h-full w-full flex-1 border rounded-3xl bg-background shadow-lg font-sans overflow-hidden">
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-4 rounded-t-3xl flex items-center gap-3 shadow">
          <div>
            <h2 className="text-lg font-semibold">{currentUser?.displayName || currentUser?.email}</h2>
            <p className="text-sm opacity-80">Online</p>
          </div>
          <Button
              onClick={handleLogout}
              className="
    inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium
    ring-offset-background
    transition-colors
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-primary
    focus-visible:ring-offset-2
    disabled:pointer-events-none disabled:opacity-50
    h-11 rounded-md
    bg-white hover:bg-gray-100
    text-slate-800
    px-8 py-4
    text-lg
  "
              size="sm"
          >
            Logout
          </Button>

        </div>

        {/* Group List */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Groups</h3>
            <Button
                size="sm"
                onClick={() => setShowGroupModal(true)}
                className="
    inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium
    ring-offset-background
    transition-colors
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-primary
    focus-visible:ring-offset-2
    disabled:pointer-events-none disabled:opacity-50
    h-11 rounded-md
    bg-primary hover:bg-primary/90
    text-primary-foreground
    px-8 py-4
    text-lg
    animate-glow
  "
            >
              + Create Group
            </Button>

          </div>
          <ul className="space-y-2">
            {groups.map((group) => (
                <li
                    key={group.id}
                    onClick={() => onSelectGroup && onSelectGroup(group)}
                    className="cursor-pointer px-4 py-2 bg-gray-900 hover:bg-white transition rounded-md"
                >
      <span className="text-blue-300 hover:text-blue-600 font-medium transition">
        {group.name}
      </span>
                </li>
            ))}
          </ul>

          {/* User List */}
          <h3 className="text-lg font-semibold">Users</h3>
          <ul className="space-y-2">
            {users.map((user) => (
                <li
                    key={user.uid}
                    onClick={() => onSelectUser(user)}
                    className="cursor-pointer px-4 py-2 bg-gray-900 hover:bg-white transition rounded-md"
                >
      <span className="text-blue-300 hover:text-blue-600 font-medium transition">
        {user.displayName || user.email}
      </span>
                </li>
            ))}
          </ul>

        </div>

        {/* Group Modal */}
        {showGroupModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 space-y-5">
                <h2 className="text-2xl font-bold text-slate-800">Create Group</h2>
                <form onSubmit={handleCreateGroup} className="space-y-4">
                  <input
                      type="text"
                      placeholder="Group name"
                      className="w-full border border-slate-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      required
                  />
                  <div>
                    <p className="font-semibold mb-2 text-slate-700">Select members:</p>
                    <div className="max-h-48 overflow-y-auto border border-slate-200 rounded p-2">
                      {users.map((user) => (
                          <label
                              key={user.uid}
                              className="flex items-center gap-3 mb-2 cursor-pointer hover:bg-indigo-50 px-2 py-1 rounded"
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
                                className="form-checkbox h-5 w-5 text-indigo-600"
                            />
                            <span className="text-slate-800">{user.displayName || user.email}</span>
                          </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        className="border-slate-400 text-slate-700 hover:bg-slate-100"
                        onClick={() => setShowGroupModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2 rounded-md">
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
