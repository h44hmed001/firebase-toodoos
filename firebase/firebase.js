import {getFirestore} from "firebase/firestore"
import {getAuth} from "firebase/auth"
import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyBtrG2q0qXnwndK4c_GfC_Zq-qR0u6AXRQ",
  authDomain: "toodoos-fff2c.firebaseapp.com",
  projectId: "toodoos-fff2c",
  storageBucket: "toodoos-fff2c.appspot.com",
  messagingSenderId: "809978985909",
  appId: "1:809978985909:web:ecc30127672d83eaf3adfc"
};
const app = initializeApp(firebaseConfig);
export const auth =getAuth(app)
export const db=getFirestore(app)