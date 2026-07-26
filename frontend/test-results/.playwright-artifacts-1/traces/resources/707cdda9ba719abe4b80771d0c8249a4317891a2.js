import.meta.env = {"BASE_URL": "/", "DEV": true, "MODE": "development", "PROD": false, "SSR": false, "VITE_API_BASE_URL": "http://localhost:8080", "VITE_FIREBASE_API_KEY": "AIzaSyDSrS3zywg8ao1lvK9NWmy1RDR33Nim2h8", "VITE_FIREBASE_APP_ID": "1:565024605742:web:0452b9b88a65be9d67c1bf", "VITE_FIREBASE_AUTH_DOMAIN": "the-ethnic-touch.firebaseapp.com", "VITE_FIREBASE_MEASUREMENT_ID": "G-KP2NETS58F", "VITE_FIREBASE_MESSAGING_SENDER_ID": "565024605742", "VITE_FIREBASE_PROJECT_ID": "the-ethnic-touch", "VITE_FIREBASE_STORAGE_BUCKET": "the-ethnic-touch.firebasestorage.app"};const React = __vite__cjsImport0_react; const useState = __vite__cjsImport0_react["useState"]; const useEffect = __vite__cjsImport0_react["useEffect"]; const useRef = __vite__cjsImport0_react["useRef"]; const useMemo = __vite__cjsImport0_react["useMemo"]; const useCallback = __vite__cjsImport0_react["useCallback"];import __vite__cjsImport0_react from "/node_modules/.vite/deps/react.js?v=42a9b196";
import { useNavigate, Link, useLocation, useParams, Routes, Route, Navigate, BrowserRouter } from "/node_modules/.vite/deps/react-router-dom.js?v=42a9b196";
import { initializeApp, getApps, getApp } from "/node_modules/.vite/deps/firebase_app.js?v=42a9b196";
import { getAuth } from "/node_modules/.vite/deps/firebase_auth.js?v=42a9b196";
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
// --- DUMMY FALLBACK DATA ---
const fallbackProducts = [
	{
		id: "1",
		name: "Pastel Peach Anarkali",
		description: "A delicate premium silk Kurthi in soft peach, featuring intricate silver zari work.",
		price: 10999,
		imageUrl: "./images/kurthi_peach.png"
	},
	{
		id: "2",
		name: "Mint Breeze Straight Cut",
		description: "Minimalist mint green kurthi perfect for a fresh, elegant everyday look.",
		price: 5499,
		imageUrl: "./images/kurthi_mint.png"
	},
	{
		id: "3",
		name: "Lavender Dream Tunic",
		description: "Indo-western fusion tunic in soft lavender. Premium georgette fabric.",
		price: 8999,
		imageUrl: "./images/kurthi_lavender.png"
	},
	{
		id: "4",
		name: "Powder Blue Elegance",
		description: "A sophisticated powder blue kurthi with minimal floral embroidery.",
		price: 12499,
		imageUrl: "./images/kurthi_blue.png"
	}
];
// --- API BASE URL ---
const rawApiUrl = import.meta.env.VITE_API_BASE_URL || "";
export const API_BASE_URL = rawApiUrl.replace(/\/+$/, "");
export { fallbackProducts, auth, firebaseConfig };

//# sourceMappingURL=data:application/json;base64,eyJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLFVBQVUsV0FBVyxRQUFRLFNBQVMsbUJBQW1CO0FBQ3pFLFNBQVMsYUFBYSxNQUFNLGFBQWEsV0FBVyxRQUFRLE9BQU8sVUFBVSxxQkFBcUI7QUFFbEcsU0FBUyxlQUFlLFNBQVMsY0FBYztBQUMvQyxTQUFTLGVBQWU7QUFFeEIsTUFBTSxpQkFBaUI7Q0FDbkIsUUFBUSxPQUFPLEtBQUssSUFBSSx5QkFBeUI7Q0FDakQsWUFBWSxPQUFPLEtBQUssSUFBSSw2QkFBNkI7Q0FDekQsV0FBVyxPQUFPLEtBQUssSUFBSSw0QkFBNEI7Q0FDdkQsZUFBZSxPQUFPLEtBQUssSUFBSSxnQ0FBZ0M7Q0FDL0QsbUJBQW1CLE9BQU8sS0FBSyxJQUFJLHFDQUFxQztDQUN4RSxPQUFPLE9BQU8sS0FBSyxJQUFJLHdCQUF3QjtDQUMvQyxlQUFlLE9BQU8sS0FBSyxJQUFJLGdDQUFnQztBQUNuRTtBQUVBLE1BQU0sTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFNBQVMsY0FBYyxjQUFjLElBQUksT0FBTztBQUN2RSxNQUFNLE9BQU8sUUFBUSxHQUFHOztBQUd4QixNQUFNLG1CQUFtQjtDQUNyQjtFQUFFLElBQUk7RUFBSyxNQUFNO0VBQXlCLGFBQWE7RUFBdUYsT0FBTztFQUFPLFVBQVU7Q0FBNEI7Q0FDbE07RUFBRSxJQUFJO0VBQUssTUFBTTtFQUE0QixhQUFhO0VBQTRFLE9BQU87RUFBTSxVQUFVO0NBQTJCO0NBQ3hMO0VBQUUsSUFBSTtFQUFLLE1BQU07RUFBd0IsYUFBYTtFQUF5RSxPQUFPO0VBQU0sVUFBVTtDQUErQjtDQUNyTDtFQUFFLElBQUk7RUFBSyxNQUFNO0VBQXdCLGFBQWE7RUFBc0UsT0FBTztFQUFPLFVBQVU7Q0FBMkI7QUFDbkw7O0FBR0EsTUFBTSxZQUFZLE9BQU8sS0FBSyxJQUFJLHFCQUFxQjtBQUN2RCxPQUFPLE1BQU0sZUFBZSxVQUFVLFFBQVEsUUFBUSxFQUFFO0FBRXhELFNBQVMsa0JBQWtCLE1BQU0iLCJuYW1lcyI6W10sInNvdXJjZXMiOlsiY29uZmlnLmpzeCJdLCJ2ZXJzaW9uIjozLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUsIHVzZUVmZmVjdCwgdXNlUmVmLCB1c2VNZW1vLCB1c2VDYWxsYmFjayB9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgdXNlTmF2aWdhdGUsIExpbmssIHVzZUxvY2F0aW9uLCB1c2VQYXJhbXMsIFJvdXRlcywgUm91dGUsIE5hdmlnYXRlLCBCcm93c2VyUm91dGVyIH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XHJcblxyXG5pbXBvcnQgeyBpbml0aWFsaXplQXBwLCBnZXRBcHBzLCBnZXRBcHAgfSBmcm9tICdmaXJlYmFzZS9hcHAnO1xyXG5pbXBvcnQgeyBnZXRBdXRoIH0gZnJvbSAnZmlyZWJhc2UvYXV0aCc7XHJcblxyXG5jb25zdCBmaXJlYmFzZUNvbmZpZyA9IHtcclxuICAgIGFwaUtleTogaW1wb3J0Lm1ldGEuZW52LlZJVEVfRklSRUJBU0VfQVBJX0tFWSB8fCBcIkFJemFTeURTclMzenl3ZzhhbzFsdks5TldteTFSRFIzM05pbTJoOFwiLFxyXG4gICAgYXV0aERvbWFpbjogaW1wb3J0Lm1ldGEuZW52LlZJVEVfRklSRUJBU0VfQVVUSF9ET01BSU4gfHwgXCJ0aGUtZXRobmljLXRvdWNoLmZpcmViYXNlYXBwLmNvbVwiLFxyXG4gICAgcHJvamVjdElkOiBpbXBvcnQubWV0YS5lbnYuVklURV9GSVJFQkFTRV9QUk9KRUNUX0lEIHx8IFwidGhlLWV0aG5pYy10b3VjaFwiLFxyXG4gICAgc3RvcmFnZUJ1Y2tldDogaW1wb3J0Lm1ldGEuZW52LlZJVEVfRklSRUJBU0VfU1RPUkFHRV9CVUNLRVQgfHwgXCJ0aGUtZXRobmljLXRvdWNoLmZpcmViYXNlc3RvcmFnZS5hcHBcIixcclxuICAgIG1lc3NhZ2luZ1NlbmRlcklkOiBpbXBvcnQubWV0YS5lbnYuVklURV9GSVJFQkFTRV9NRVNTQUdJTkdfU0VOREVSX0lEIHx8IFwiNTY1MDI0NjA1NzQyXCIsXHJcbiAgICBhcHBJZDogaW1wb3J0Lm1ldGEuZW52LlZJVEVfRklSRUJBU0VfQVBQX0lEIHx8IFwiMTo1NjUwMjQ2MDU3NDI6d2ViOjA0NTJiOWI4OGE2NWJlOWQ2N2MxYmZcIixcclxuICAgIG1lYXN1cmVtZW50SWQ6IGltcG9ydC5tZXRhLmVudi5WSVRFX0ZJUkVCQVNFX01FQVNVUkVNRU5UX0lEIHx8IFwiRy1LUDJORVRTNThGXCJcclxufTtcclxuXHJcbmNvbnN0IGFwcCA9ICFnZXRBcHBzKCkubGVuZ3RoID8gaW5pdGlhbGl6ZUFwcChmaXJlYmFzZUNvbmZpZykgOiBnZXRBcHAoKTtcclxuY29uc3QgYXV0aCA9IGdldEF1dGgoYXBwKTtcclxuXHJcbi8vIC0tLSBEVU1NWSBGQUxMQkFDSyBEQVRBIC0tLVxyXG5jb25zdCBmYWxsYmFja1Byb2R1Y3RzID0gW1xyXG4gICAgeyBpZDogXCIxXCIsIG5hbWU6IFwiUGFzdGVsIFBlYWNoIEFuYXJrYWxpXCIsIGRlc2NyaXB0aW9uOiBcIkEgZGVsaWNhdGUgcHJlbWl1bSBzaWxrIEt1cnRoaSBpbiBzb2Z0IHBlYWNoLCBmZWF0dXJpbmcgaW50cmljYXRlIHNpbHZlciB6YXJpIHdvcmsuXCIsIHByaWNlOiAxMDk5OSwgaW1hZ2VVcmw6IFwiLi9pbWFnZXMva3VydGhpX3BlYWNoLnBuZ1wiIH0sXHJcbiAgICB7IGlkOiBcIjJcIiwgbmFtZTogXCJNaW50IEJyZWV6ZSBTdHJhaWdodCBDdXRcIiwgZGVzY3JpcHRpb246IFwiTWluaW1hbGlzdCBtaW50IGdyZWVuIGt1cnRoaSBwZXJmZWN0IGZvciBhIGZyZXNoLCBlbGVnYW50IGV2ZXJ5ZGF5IGxvb2suXCIsIHByaWNlOiA1NDk5LCBpbWFnZVVybDogXCIuL2ltYWdlcy9rdXJ0aGlfbWludC5wbmdcIiB9LFxyXG4gICAgeyBpZDogXCIzXCIsIG5hbWU6IFwiTGF2ZW5kZXIgRHJlYW0gVHVuaWNcIiwgZGVzY3JpcHRpb246IFwiSW5kby13ZXN0ZXJuIGZ1c2lvbiB0dW5pYyBpbiBzb2Z0IGxhdmVuZGVyLiBQcmVtaXVtIGdlb3JnZXR0ZSBmYWJyaWMuXCIsIHByaWNlOiA4OTk5LCBpbWFnZVVybDogXCIuL2ltYWdlcy9rdXJ0aGlfbGF2ZW5kZXIucG5nXCIgfSxcclxuICAgIHsgaWQ6IFwiNFwiLCBuYW1lOiBcIlBvd2RlciBCbHVlIEVsZWdhbmNlXCIsIGRlc2NyaXB0aW9uOiBcIkEgc29waGlzdGljYXRlZCBwb3dkZXIgYmx1ZSBrdXJ0aGkgd2l0aCBtaW5pbWFsIGZsb3JhbCBlbWJyb2lkZXJ5LlwiLCBwcmljZTogMTI0OTksIGltYWdlVXJsOiBcIi4vaW1hZ2VzL2t1cnRoaV9ibHVlLnBuZ1wiIH1cclxuXTtcclxuXHJcbi8vIC0tLSBBUEkgQkFTRSBVUkwgLS0tXHJcbmNvbnN0IHJhd0FwaVVybCA9IGltcG9ydC5tZXRhLmVudi5WSVRFX0FQSV9CQVNFX1VSTCB8fCAnJztcclxuZXhwb3J0IGNvbnN0IEFQSV9CQVNFX1VSTCA9IHJhd0FwaVVybC5yZXBsYWNlKC9cXC8rJC8sICcnKTtcclxuXHJcbmV4cG9ydCB7IGZhbGxiYWNrUHJvZHVjdHMsIGF1dGgsIGZpcmViYXNlQ29uZmlnIH07XHJcbiJdfQ==