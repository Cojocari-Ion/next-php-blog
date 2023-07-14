import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD7wjSGCfm9fijE5VggLX3WW6oDZBZqwDw",
  authDomain: "blog-next-php.firebaseapp.com",
  projectId: "blog-next-php",
  storageBucket: "blog-next-php.appspot.com",
  messagingSenderId: "980910887795",
  appId: "1:980910887795:web:7d480d619f913689b82b06",
  measurementId: "G-F8QQM2B1K0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let analytics;
let storage;

if (typeof window !== 'undefined') {
  // Code inside this block will only be executed in the browser environment
  analytics = getAnalytics(app);
  storage = getStorage(app);
}

export { analytics, storage };