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

// Sign up DOM elements
const signUpDivElement = document.getElementById('sign-up-form-wrapper');
const signUpFormElement = document.getElementById('sign-up-form');
const signUpButtonElement = document.getElementById('sign-up-button');
const signUpUsernameElement = document.getElementById('sign-up-username');
const signUpEmailElement = document.getElementById('sign-up-email');
const signUpPasswordElement = document.getElementById('sign-up-password');
const signUpConfPassElement = document.getElementById('sign-up-conf-pass');

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

// Database write

// Write users data to the database
function writeNewUserData(email, username, password) {
    const newUserRef = push(dataRef);
    const userId = newUserRef.key;
    set(ref(database, "users/" + userId), {
        "email": email,
        "username": username,
        "password": password,
        "gender": {
        },
        "birthdate": {

        },
        "eyes-color": {

        },
        "hair-color": {

        }
    }).then(() => {
        // console.log("Data saved successfully");
    }).catch((error) => {
        // console.log("Data not saved");
    });
    return newUserRef.key;
}

// Sign up functionality

// Email address validation

// Regex email address checking function
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Check for user with the same email address
async function existingSignUpgEmailAddress() {
    const signUpEmail = signUpEmailElement.value.trim();
    const usersPromise = getUsers();
    return usersPromise.then(function (users) {
        for (var userId in users) {
            if (users[userId].email === signUpEmail) {
                return true; // existing such email
            }
        }
        return false; // not existing email
    });
}

// Email address validation and visuals for correctness
function checkSignUpEmail() {
    const inputEmail = signUpEmailElement.value.trim();
    if ((validateEmail(inputEmail) === false) || (inputEmail === "")) {
        setErrorFor(signUpEmailElement, "Email address is not valid");
    }
    else {
        existingSignUpgEmailAddress().then(function (existingEmail) {
            if (existingEmail === true) {
                setErrorFor(signUpEmailElement, "This email address is already used");
            }
            else {
                setSuccessFor(signUpEmailElement);
            }
        });
    }
}

// Username validation

// Check for user with the same username
function existingUsername(username) {
    const usersPromise = getUsers();
    return usersPromise.then(function (users) {
        for (var userId in users) {
            if (users[userId].username === username) {
                return true; // existing such username
            }
        }
        return false; // not existing username
    });
}

// Username validation and visuals for correctness
function checkSignUpUsername() {
    const inputUsername = signUpUsernameElement.value.trim();
    if (inputUsername === "") {
        setErrorFor(signUpUsernameElement, "Username cannot be blank"); // add error message and red styling for input
    }
    else {
        existingUsername(inputUsername).then(function (existingUsername) {
            if (!existingUsername) {
                setSuccessFor(signUpUsernameElement); // add green styling for input
            }
            else {
                setErrorFor(signUpUsernameElement, "Username is already taken"); // add error message and red styling for input
            }
        });
    }
}

// Password validation

function checkSignUpPassword() {
    const inputPassword = signUpPasswordElement.value.trim();
    if (inputPassword.length < 6) {
        setErrorFor(signUpPasswordElement, "Password cannot be less than 6 characters");
    }
    else {
        setSuccessFor(signUpPasswordElement);
    }
}

// Confirm password validation and visuals for correctness
function checkSignUpConfPass() {
    const inputPassword = signUpPasswordElement.value.trim();
    const inputConfPass = signUpConfPassElement.value.trim();
    if (inputPassword !== inputConfPass) {
        setErrorFor(signUpConfPassElement, "Passwords do not match");
    }
    else {
        setSuccessFor(signUpConfPassElement);
    }
}

signUpPasswordElement.addEventListener("change", event => {
    event.preventDefault();
    if (signUpPasswordElement.value.trim() != "") {
        if (signUpConfPassElement.value !== "") {
            checkSignUpConfPass(); // validatation and style
        }
    }
    checkSignUpPassword(); // validatation and style
});

signUpConfPassElement.addEventListener("change", event => {
    event.preventDefault();
    checkSignUpConfPass(); // validatation and style
});

signUpUsernameElement.addEventListener("change", event => {
    event.preventDefault();
    checkSignUpUsername(); // validatation and style
});

signUpEmailElement.addEventListener("change", event => {
    event.preventDefault();
    checkSignUpEmail(); // validatation and style
});

signUpConfPassElement.addEventListener("change", event => {
    event.preventDefault();
    checkSignUpConfPass(); // validatation and style
});

// End-to-end validation
function checkSignUpInputs() {
    checkSignUpUsername();
    checkSignUpEmail();
    checkSignUpPassword();
    const inputControl = signUpPasswordElement.parentElement;
    if (inputControl.classList.contains("error") === true) {
        setErrorFor(signUpConfPassElement, "Passwords do not match");
    }
    else {
        checkSignUpConfPass();
    }
}

// Session storage
var sessionStorage = window.sessionStorage;

// Default onload page state
window.addEventListener("load", (event) => {
    // Setting inputs to default values
    signUpUsernameElement.value = "";
    signUpEmailElement.value = "";
    signUpPasswordElement.value = "";
    signUpConfPassElement.value = "";
});

// Loop through inputs to check for errors
function successInputControl() {
    const inputControlList = document.getElementById("sign-up-user-info").querySelectorAll(".input-control"); // divs
    var counter = 0;
    for (let index = 0; index < inputControlList.length; index++) {
        if (inputControlList[index].classList.contains("success") === true) {
            counter++;
        }
    }
    return counter === inputControlList.length; // check number of successful validations
}

// Sign up validation and submition
signUpButtonElement.addEventListener("click", event => {
    event.preventDefault();
    if (successInputControl() === true) {
        const username = signUpUsernameElement.value.trim();
        const email = signUpEmailElement.value.trim();
        const password = signUpPasswordElement.value.trim();

        // Writing user to storage
        const key = writeNewUserData(email, username, password);
        sessionStorage.setItem("current-user", JSON.stringify(signUpEmailElement.value.trim()));

        signUpFormElement.submit();

        // Setting inputs to default values
        signUpUsernameElement.value = "";
        signUpEmailElement.value = "";
        signUpPasswordElement.value = "";
        signUpConfPassElement.value = "";
        window.location.href = "./index_logged.html";
    }
    else {
        checkSignUpInputs();
    }
});