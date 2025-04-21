import {getApp, getApps, initializeApp} from '@react-native-firebase/app';
import {get, getDatabase, ref, set} from "@react-native-firebase/database";


const FIREBASE_URL = "https://fir-auth-article-b6631-default-rtdb.asia-southeast1.firebasedatabase.app/";
const FIREBASE_AUTH = "AIzaSyAhDeTcy_8vgBCq5hZnF-Wrl0R6nVnRcfg";

const firebaseConfig = {
  apiKey: "AIzaSyCtUIfr4L6VudUOHHxcM47UtcoRrVcxO1U",
  authDomain: "protocoldatameter.firebaseapp.com",
  databaseURL: "https://protocoldatameter-default-rtdb.firebaseio.com",
  projectId: "protocoldatameter",
  storageBucket: "protocoldatameter.firebasestorage.app",
  messagingSenderId: "61750527799",
  appId: "1:61750527799:web:ff532a5714112ae20dbcb2",
  measurementId: "G-Q1FLDV1NDT"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const database = getDatabase(app);

console.log('🔥 Firebase đã khởi tạo:', app.name);

export const CLOCK1 = 'dongho/dongho_1'
export const CLOCK2 = 'dongho/dongho_2'



export const readData = async () => {
  const dbRef = ref(database, RANDOM_VALUE_PATH);

  const snapshot = await get(dbRef);
  if (snapshot.exists()) {
    console.log('📥 Dữ liệu từ Firebase:', snapshot.val());
  } else {
    console.log('❌ Không có dữ liệu trong Firebase.');
  }
};

export const writeData = async (jsonName: string, data: any) => {
  const dbRef = ref(database, jsonName);
  const randomValue = Math.floor(Math.random() * 100);

  await set(dbRef, data);
  console.log('✅ Dữ liệu đã được gửi lên Firebase:', randomValue);
};

/**
 * REST API
 */
// export const fetchData = async () => {
//   const response = await fetch(`${FIREBASE_URL}/randomValue.json?auth=${FIREBASE_AUTH}`);
//   return await response.json();
// };
//
// export const sendData = async () => {
//   const newValue = Math.floor(Math.random() * 100);
//   const response = await fetch(`${FIREBASE_URL}/randomValue.json?auth=${FIREBASE_AUTH}`, {
//     method: "PUT",
//     headers: {"Content-Type": "application/json"},
//     body: JSON.stringify({value: newValue}),
//   });
//   return await response.json();
// };