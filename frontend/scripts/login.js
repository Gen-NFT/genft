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

// Login DOM elements
const loginDivElement = document.getElementById('login-form-wrapper');
const loginFormElement = document.getElementById('login-form');
const loginButtonElement = document.getElementById('login-button');
const loginEmailElement = document.getElementById('login-email');
const loginPasswordElement = document.getElementById('login-password');


// Display visual information for the given input in case denied validation - (add red styling)
function setErrorFor(input, message) {
    const inputControl = input.parentElement; // .input-control - div
    const small = inputControl.querySelector("small"); // small - tag

    // Add message inside small
    small.innerHTML = `${message}`;

    // Add error class and remove success class
    inputControl.classList.add("error");
    inputControl.classList.remove("success");
}

// Display visual information for the given input in case of passed validation - (add green styling)
function setSuccessFor(input) {
    const inputControl = input.parentElement; // .input-control - div
    const small = inputControl.querySelector("small"); // small - tag

    // Remove error message
    small.innerHTML = "";

    // Add success class and remove error class
    inputControl.classList.add("success");
    inputControl.classList.remove("error");
}

// Display default(onload) visual information for the given input (remove red/green styling)
function setNeutral(input) {
    const inputControl = input.parentElement; // .input-control - div
    const small = inputControl.querySelector("small"); // small - tag

    // Remove error message
    small.innerHTML = "";

    inputControl.classList.remove("success"); // remove pass validation styling
    inputControl.classList.remove("error");   // remove denied validation styling
}

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

// Login functionality

// Regex email address checking function
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Check for user with the same email address
async function existingLogingEmailAddress() {
    const loginEmail = loginEmailElement.value.trim();
    const usersPromise = getUsers();
    return usersPromise.then(function (users) {
        for (var userId in users) {
            if (users[userId].email === loginEmail) {
                return true; // existing such email
            }
        }
        return false; // not existing email
    });
}

function checkLoginEmail() {
    const inputEmail = loginEmailElement.value.trim();
    if ((validateEmail(inputEmail) === false) || (inputEmail === '')) {
        setErrorFor(loginEmailElement, "Incorrect email address");
    }
    else {
        existingLogingEmailAddress().then(function (existingEmail) {
            if (existingEmail === false) {
                setErrorFor(loginEmailElement, "Email address is not registered");
            }
            else {
                setSuccessFor(loginEmailElement);
            }
        });
    }
}

loginEmailElement.addEventListener("change", event => {
    event.preventDefault();
    checkLoginEmail(); // validatation and style
});

// Validate email uniquesness
function existingLoginEmailAddress() {
    const loginEmail = loginEmailElement.value.trim();
    const usersPromise = getUsers();
    return usersPromise.then(function (users) {
        for (var userId in users) {
            if (users[userId].email === loginEmail) {
                return true; // existing such email
            }
        }
        return false; // not existing email
    });
}

// Check localstorage's records for matching email address and password
function checkEmailAndPass() {
    const inputEmail = loginEmailElement.value.trim();
    const inputPassword = loginPasswordElement.value.trim();
    const userDataPromise = getUserByEmail(inputEmail);
    return userDataPromise.then(function (user) {
        if (user.email === inputEmail && user.password === inputPassword) {
            return true;
        }
        else {
            return false;
        }
    });
}

// Login validation and submition
loginButtonElement.addEventListener("click", event => {
    event.preventDefault();
    existingLoginEmailAddress().then(function (existingEmail) {
        if (existingEmail === true) {
            setSuccessFor(loginEmailElement);
            checkEmailAndPass().then(function (isCorrect) {
                if (isCorrect === true) {
                    loginFormElement.submit();
                    sessionStorage.setItem("current-user", JSON.stringify(loginEmailElement.value.trim()));
                    loginEmailElement.value = "";
                    loginPasswordElement.value = "";
                    window.location.href = "./index_logged.html";
                }
                else {
                    setErrorFor(loginPasswordElement, "Incorrect password");
                }
            });
        }
        else {
            loginPasswordElement.value = '';
            setNeutral(loginPasswordElement);
            setErrorFor(loginEmailElement, "Incorrect email address");
        }
    });
});

window.addEventListener("load", (event) => {
    sessionStorage.clear()
});
