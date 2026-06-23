// Firebase init for the Multiverse of Madness portal (Realtime Database).
// ponytail: client config is public by design for Firebase; access is gated by
// Realtime Database security rules, not by hiding these values.
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyD8G8f2Z3CKr2LaRXoBX30BPcY97r5PgQ0',
  authDomain: 'multiverseofmadness21-fefd9.firebaseapp.com',
  databaseURL: 'https://multiverseofmadness21-fefd9-default-rtdb.firebaseio.com/',
  projectId: 'multiverseofmadness21-fefd9',
  storageBucket: 'multiverseofmadness21-fefd9.firebasestorage.app',
  messagingSenderId: '90150896579',
  appId: '1:90150896579:web:d3918b8430c73c65cc7376',
  measurementId: 'G-KX0JXNBPGH',
};

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
