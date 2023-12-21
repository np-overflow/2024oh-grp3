import { initializeApp } from 'firebase/app'
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyAlFms6lhQc_y_nR79GFfhiWnE7aMJs1SI",
    authDomain: "overflow-oh-grp3.firebaseapp.com",
    projectId: "overflow-oh-grp3",
    storageBucket: "overflow-oh-grp3.appspot.com",
    messagingSenderId: "230727779685",
    appId: "1:230727779685:web:72443ba343e6e7ed084d8c"
}

initializeApp(firebaseConfig)
const db = getFirestore()

export default db