import React, { useEffect, useState } from "react";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { X, Bell, Clock, MessageSquare } from "lucide-react";

interface Notification {
  id: string;
  groupId: string;
  groupName: string;
  sender: string;
  createdAt: any;
}

interface NotificationsPanelProps {
  open: boolean;
  onClose: () => void;
  onGoToGroup: (groupId: string) => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ open, onClose, onGoToGroup }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const unsub = auth.currentUser
      ? onSnapshot(collection(db, "users", auth.currentUser.uid, "notifications"), (snap) => {
          const notis: Notification[] = [];
          snap.forEach(d => notis.push({ id: d.id, ...(d.data() as any) }));
          setNotifications(notis.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
        })
      : undefined;
    return () => { unsub && unsub(); };
  }, []);

  const handleClear = async (notiId: string) => {
    if (!auth.currentUser) return;
    await deleteDoc(doc(db, "users", auth.currentUser.uid, "notifications", notiId));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Notifications</h2>
            {notifications.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {notifications.length}
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No notifications</p>
              <p className="text-sm text-muted-foreground mt-1">
                You'll see group invitations and updates here
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {notifications.map((noti) => (
                <div key={noti.id} className="bg-background rounded-lg border border-border p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-medium text-sm">
                          Added to <span className="text-primary">{noti.groupName || noti.groupId}</span>
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        by <span className="font-medium">{noti.sender}</span>
                      </p>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground mb-3">
                        <Clock className="h-3 w-3" />
                        <span>
                          {noti.createdAt?.toDate ? noti.createdAt.toDate().toLocaleString() : ""}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => {
                            onGoToGroup(noti.groupId);
                            handleClear(noti.id);
                          }}
                          size="sm"
                          className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          Join Group
                        </Button>
                        <Button
                          onClick={() => handleClear(noti.id)}
                          size="sm"
                          variant="outline"
                        >
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPanel;
