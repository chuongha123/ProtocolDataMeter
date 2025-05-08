import { initializeApp, getApp, getApps } from '@react-native-firebase/app';
import { getDatabase, ref, set, onValue, get } from '@react-native-firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCtUIfr4L6VudUOHHxcM47UtcoRrVcxO1U",
  authDomain: "protocoldatameter.firebaseapp.com",
  databaseURL: "https://protocoldatameter-default-rtdb.firebaseio.com",
  projectId: "protocoldatameter",
  storageBucket: "protocoldatameter.firebasestorage.app",
  messagingSenderId: "61750527799",
  appId: "1:61750527799:web:ff532a5714112ae20dbcb2",
  measurementId: "G-Q1FLDV1NDT",
};

// Initialize Firebase if it hasn't been initialized yet
if (getApps().length === 0) {
  initializeApp(firebaseConfig);
}

// Get the Firebase app instance
const app = getApp();
const database = getDatabase(app);

// Log Firebase initialization
console.log("🔥 Firebase đã khởi tạo:", app.name);

export const CLOCK1 = "messages/D1";
export const CLOCK2 = "messages/D2";

export const readData = async (path: string) => {
  try {
    const snapshot = await get(ref(database, path));
    if (snapshot.exists()) {
      console.log("📥 Dữ liệu từ Firebase:", snapshot.val());
      return snapshot.val();
    } else {
      console.log("❌ Không có dữ liệu trong Firebase.");
      return null;
    }
  } catch (error) {
    console.error("🚫 Lỗi khi đọc dữ liệu:", error);
    return null;
  }
};

export const writeData = async (jsonName: string, data: any) => {
  try {
    await set(ref(database, jsonName), data);
    console.log("✅ Dữ liệu đã được gửi lên Firebase:", data);
    return true;
  } catch (error) {
    console.error("🚫 Lỗi khi ghi dữ liệu:", error);
    return false;
  }
};

export const onValueChange = (path: string, callback: (data: any) => void) => {
  const dbRef = ref(database, path);
  
  const unsubscribe = onValue(dbRef, (snapshot) => {
    callback(snapshot.val());
  }, (error) => {
    console.error("🚫 Lỗi khi theo dõi dữ liệu:", error);
  });
  
  return unsubscribe;
};
