// config/firebase.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Adicionado

// Seu objeto de configuração do Firebase.
const firebaseConfig = {
    apiKey: "AIzaSyDkJ6HXACbEFhPjAU5kZRpV5ckypQu4UTI",
    authDomain: "projetoic-149ab.firebaseapp.com",
    projectId: "projetoic-149ab",
    storageBucket: "projetoic-149ab.firebasestorage.app",
    messagingSenderId: "281492999735",
    appId: "1:281492999735:web:7833f395499544fa4379b2",
    measurementId: "G-HZTJNHPY13"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // Adicionado: exportamos o banco de dados