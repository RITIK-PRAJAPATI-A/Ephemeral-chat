import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import './ChatAppStyles.css';

import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  signInWithCustomToken
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import Header from './components/Header';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import './components/styles.css';

import { firebaseConfig, appId } from './firebaseConfig.js';

export default function App() {
  const [db, setDb] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const app = initializeApp(firebaseConfig);
      const firestoreDb = getFirestore(app);
      const firestoreAuth = getAuth(app);
      setDb(firestoreDb);

      const unsubscribe = onAuthStateChanged(firestoreAuth, (user) => {
        if (user) {
          setIsAuthReady(true);
        } else {
          setIsAuthReady(false);
          (async () => {
            try {
              if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                await signInWithCustomToken(firestoreAuth, __initial_auth_token);
              } else {
                await signInAnonymously(firestoreAuth);
              }
            } catch (authError) {
              console.error('Authentication failed:', authError);
              setError('Could not connect to the chat service.');
            }
          })();
        }
      });

      return () => unsubscribe();
    } catch (e) {
      console.error('Firebase initialization error:', e);
      setError('Failed to initialize the application.');
    }
  }, []);

  useEffect(() => {
    if (!isAuthReady || !db) return;

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const messagesRef = collection(db, 'artifacts', appId, 'publicMessages');
    const q = query(
      messagesRef,
      where('timestamp', '>=', twentyFourHoursAgo),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const msgs = [];
        querySnapshot.forEach((doc) => {
          msgs.push({ id: doc.id, ...doc.data() });
        });
        setMessages(msgs);
        setError(null);
      },
      (err) => {
        console.error('Error fetching messages:', err);
        setError('Failed to load messages.');
      }
    );

    return () => unsubscribe();
  }, [isAuthReady, db]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !db) return;

    const randomIdPart = Math.random().toString(36).substring(2, 8);
    const newUserId = `User-${randomIdPart}`;

    try {
      await addDoc(
        collection(db, 'artifacts', appId, 'publicMessages'),
        {
          text: newMessage,
          userId: newUserId,
          timestamp: serverTimestamp()
        }
      );
      setNewMessage('');
      await fetch(import.meta.env.VITE_WHATSAPP_AGENT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newMessage, user: newUserId }),
      

    });
    
     setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Message could not be sent.');
    }
  };

  return (
    <div className="app-container">


      <Header />
      <MessageList messages={messages} isAuthReady={isAuthReady} error={error} />
      <MessageInput
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onSubmit={handleSubmit}
        isAuthReady={isAuthReady}
      />
    </div>
  );
} 
