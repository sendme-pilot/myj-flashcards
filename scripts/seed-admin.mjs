// Run with: node scripts/seed-admin.mjs <email> <password>
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBWG0IHaywz0gjeUPQilGlX8C5YaBtVdbA",
  authDomain: "myj-flashcards.firebaseapp.com",
  projectId: "myj-flashcards",
  storageBucket: "myj-flashcards.firebasestorage.app",
  messagingSenderId: "729797181248",
  appId: "1:729797181248:web:afa369cb8fa85ac10bc4a5"
};

const [,, email, password] = process.argv;
if (!email || !password) {
  console.error('Usage: node scripts/seed-admin.mjs <email> <password>');
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

try {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const uid = cred.user.uid;

  await setDoc(doc(db, 'users', uid), {
    uid,
    email,
    displayName: 'Michelle',
    role: 'admin'
  });

  console.log(`✅ Done! Michelle (${uid}) is now admin in Firestore.`);
  process.exit(0);
} catch (e) {
  console.error('❌ Error:', e.message);
  process.exit(1);
}
