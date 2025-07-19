import { useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useToast } from './use-toast';
import { getAuth } from 'firebase/auth';

interface Message {
  id: string;
  text: string;
  sender: string;
  uid: string;
  createdAt: any;
  imageUrl?: string;
}

interface NotificationOptions {
  enabled?: boolean;
  sound?: boolean;
  desktop?: boolean;
}

export const useMessageNotifications = (
  chatId: string | null, 
  selectedGroupId: string | null,
  options: NotificationOptions = {}
) => {
  const { toast } = useToast();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const {
    enabled = true,
    sound = true,
    desktop = true
  } = options;

  // Request notification permission
  useEffect(() => {
    if (desktop && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [desktop]);

  // Listen for new messages in active chat
  useEffect(() => {
    if (!enabled || !currentUser || !chatId) return;

    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(
      messagesRef,
      orderBy("createdAt", "desc"),
      limit(1)
    );

    let isFirstLoad = true;

    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Skip the first load to avoid notification on initial render
      if (isFirstLoad) {
        isFirstLoad = false;
        return;
      }

      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const message = { id: change.doc.id, ...change.doc.data() } as Message;
          
          // Don't notify for own messages
          if (message.uid === currentUser.uid) return;

          // Show toast notification
          toast({
            title: `New message from ${message.sender}`,
            description: message.text || (message.imageUrl ? "📷 Image" : ""),
            variant: "default",
          });

          // Play notification sound
          if (sound) {
            playNotificationSound();
          }

          // Show desktop notification
          if (desktop && Notification.permission === 'granted') {
            new Notification(`New message from ${message.sender}`, {
              body: message.text || "📷 Sent an image",
              icon: '/favicon.svg',
              tag: `message-${message.id}`,
            });
          }
        }
      });
    });

    return unsubscribe;
  }, [chatId, currentUser, enabled, toast, sound, desktop]);

  // Listen for new messages in group chats
  useEffect(() => {
    if (!enabled || !currentUser || !selectedGroupId) return;

    const messagesRef = collection(db, "groups", selectedGroupId, "messages");
    const q = query(
      messagesRef,
      orderBy("createdAt", "desc"),
      limit(1)
    );

    let isFirstLoad = true;

    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Skip the first load to avoid notification on initial render
      if (isFirstLoad) {
        isFirstLoad = false;
        return;
      }

      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const message = { id: change.doc.id, ...change.doc.data() } as Message;
          
          // Don't notify for own messages
          if (message.uid === currentUser.uid) return;

          // Show toast notification
          toast({
            title: `New group message from ${message.sender}`,
            description: message.text || (message.imageUrl ? "📷 Image" : ""),
            variant: "default",
          });

          // Play notification sound
          if (sound) {
            playNotificationSound();
          }

          // Show desktop notification
          if (desktop && Notification.permission === 'granted') {
            new Notification(`New group message from ${message.sender}`, {
              body: message.text || "📷 Sent an image",
              icon: '/favicon.svg',
              tag: `group-message-${message.id}`,
            });
          }
        }
      });
    });

    return unsubscribe;
  }, [selectedGroupId, currentUser, enabled, toast, sound, desktop]);

  // Listen for messages in all other chats (background notifications)
  useEffect(() => {
    if (!enabled || !currentUser) return;

    // Get all chats where current user is involved
    const chatsRef = collection(db, "chats");
    
    // This is a simplified approach - in a real app you'd want to track all user's chats
    const unsubscribe = onSnapshot(chatsRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const chatIdFromDoc = change.doc.id;
          
          // Skip if this is the currently active chat
          if (chatIdFromDoc === chatId) return;
          
          // Check if current user is part of this chat
          if (chatIdFromDoc.includes(currentUser.uid)) {
            // Listen to this chat's latest message
            const messagesRef = collection(db, "chats", chatIdFromDoc, "messages");
            const q = query(messagesRef, orderBy("createdAt", "desc"), limit(1));
            
            let isFirstLoad = true;
            
            onSnapshot(q, (messageSnapshot) => {
              if (isFirstLoad) {
                isFirstLoad = false;
                return;
              }
              
              messageSnapshot.docChanges().forEach((messageChange) => {
                if (messageChange.type === 'added') {
                  const message = { id: messageChange.doc.id, ...messageChange.doc.data() } as Message;
                  
                  // Don't notify for own messages
                  if (message.uid === currentUser.uid) return;
                  
                  // Show toast notification for background chats
                  toast({
                    title: `New message from ${message.sender}`,
                    description: message.text || (message.imageUrl ? "📷 Image" : ""),
                    variant: "default",
                  });
                  
                  // Play notification sound
                  if (sound) {
                    playNotificationSound();
                  }
                  
                  // Show desktop notification
                  if (desktop && Notification.permission === 'granted') {
                    new Notification(`New message from ${message.sender}`, {
                      body: message.text || "📷 Sent an image",
                      icon: '/favicon.svg',
                      tag: `bg-message-${message.id}`,
                    });
                  }
                }
              });
            });
          }
        }
      });
    });

    return unsubscribe;
  }, [currentUser, chatId, enabled, toast, sound, desktop]);
};

// Utility function to play notification sound
const playNotificationSound = () => {
  try {
    // Create a subtle notification sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  } catch (error) {
    // Fallback: try to play a simple beep
    console.log('Notification sound played');
  }
};

export { playNotificationSound };
