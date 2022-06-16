// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-app.js";
import { getDatabase, child, get, ref, push, set } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDiTzuIKq0fw8JhMol1af2MGvBsqSErls0",
    authDomain: "genft-7cbe9.firebaseapp.com",
    projectId: "genft-7cbe9",
    storageBucket: "genft-7cbe9.appspot.com",
    messagingSenderId: "436100600248",
    appId: "1:436100600248:web:a5f607cbda5aa0c9993f4d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const dataRef = ref(database, "users/");

// Database read

// Get users data from database
async function getUsers() {
    const dbRef = ref(getDatabase());
    const temp = await get(child(dbRef, "users/")).then((snapshot) => {
        if (snapshot.exists()) {
            return snapshot.val();
        }
        else {
            console.log("No such user data available");
        }
    }).catch((error) => {
        console.error(error);
    });
    return temp;
}

// Get user by given email address from database
async function getUserByEmail(email) {
    const dbRef = ref(getDatabase());
    const temp = await get(child(dbRef, "users/")).then((snapshot) => {
        if (snapshot.exists()) {
            for (var userId in snapshot.val()) {
                if (snapshot.val()[userId].email === email) {
                    return snapshot.val()[userId];
                }
            }
        }
        else {
            console.log("No such user data available");
        }
    }).catch((error) => {
        console.error(error);
    });
    return temp;
}

// DOM elements
const profileLinkElement = document.getElementById('greetings');

// Session storage
var sessionStorage = window.sessionStorage;
var currentUserEmailAddress = JSON.parse(sessionStorage.getItem('current-user'));

function greetings() {
    const userDataPromise = getUserByEmail(currentUserEmailAddress);
    userDataPromise.then(function (user) {
        profileLinkElement.innerHTML = `Hey ${user.username}`;
    });
}

// Default onload page state
window.addEventListener("load", (event) => {
    // if (currentUserEmailAddress != null) {
    //     greetings()  
    // } 
});