import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate, Link, useLocation, useParams, Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDSrS3zywg8ao1lvK9NWmy1RDR33Nim2h8",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "the-ethnic-touch.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "the-ethnic-touch",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "the-ethnic-touch.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "565024605742",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:565024605742:web:0452b9b88a65be9d67c1bf",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-KP2NETS58F"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// Enforce strict local persistence to prevent random logouts on idle
setPersistence(auth, browserLocalPersistence).catch(err => {
    console.error("Failed to set Firebase Auth persistence:", err);
});


// --- DUMMY FALLBACK DATA ---
const fallbackProducts = [
    { id: "1", name: "Pastel Peach Anarkali", description: "A delicate premium silk Kurthi in soft peach, featuring intricate silver zari work.", price: 10999, imageUrl: "./images/kurthi_peach.png" },
    { id: "2", name: "Mint Breeze Straight Cut", description: "Minimalist mint green kurthi perfect for a fresh, elegant everyday look.", price: 5499, imageUrl: "./images/kurthi_mint.png" },
    { id: "3", name: "Lavender Dream Tunic", description: "Indo-western fusion tunic in soft lavender. Premium georgette fabric.", price: 8999, imageUrl: "./images/kurthi_lavender.png" },
    { id: "4", name: "Powder Blue Elegance", description: "A sophisticated powder blue kurthi with minimal floral embroidery.", price: 12499, imageUrl: "./images/kurthi_blue.png" }
];

// --- API BASE URL ---
const rawApiUrl = import.meta.env.VITE_API_BASE_URL || '';
export const API_BASE_URL = rawApiUrl.replace(/\/+$/, '');

export { fallbackProducts, auth, firebaseConfig };
