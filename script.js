// === Messenger Pro Chat v4 ===

// 🔹 তোমার Firebase Config বসাও
const firebaseConfig = {
  apiKey: "AIzaSyAeC_qcXhUeXBeGDSPr-ODJMWnG8ykD5B4",
  authDomain: "csm-bolg-site.firebaseapp.com",
  projectId: "csm-bolg-site",
  storageBucket: "csm-bolg-site.firebasestorage.app",
  messagingSenderId: "931917499515",
  appId: "1:931917499515:web:dc9890e7e990e55d7e66de",
  measurementId: "G-13HVSL6BE4"
};

// Firebase initialize
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

const adminEmail = "csmmohasinalam@gmail.com";

const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const photoBtn = document.getElementById("photoBtn");
const messagesContainer = document.getElementById("messages");
const typingIndicator = document.getElementById("typingIndicator");
const logoutBtn = document.getElementById("logoutBtn");

// === LOGIN WITH GOOGLE ===
function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).catch(err => alert(err.message));
}

auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById("chatContainer").style.display = "flex";
    loadMessages();
  } else {
    const ok = confirm("You are not logged in! Login with Google?");
    if (ok) googleLogin();
  }
});

logoutBtn.addEventListener("click", () => {
  auth.signOut();
});

// === LOAD MESSAGES ===
function loadMessages() {
  db.collection("messages").orderBy("timestamp", "asc").onSnapshot(snapshot => {
    messagesContainer.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      displayMessage(doc.id, data);
    });
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  });
}

// === DISPLAY MESSAGE ===
function displayMessage(id, data) {
  const user = auth.currentUser;
  if (!user) return;

  const msgDiv = document.createElement("div");
  msgDiv.classList.add("msg");
  msgDiv.classList.add(data.email === adminEmail ? "admin" : "user");

  const name = data.name || "Guest";
  const verified = data.email === adminEmail
    ? `<img src="https://dl8.wapkizfile.info/download/c4275ed00b49e8d2f586ffbd4dc6c25f/csm-mohasin-alam+wapkizs+com/2-jpg-(csm-mohasin-alam.wapkizs.com).jpg" class="verified">`
    : `<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Black_check.svg/1024px-Black_check.svg.png" class="verified">`;

  msgDiv.innerHTML = `
    <div class="meta">${name} ${verified}</div>
    <div class="text">${data.text || ""}</div>
    ${data.photoURL ? `<img src="${data.photoURL}" style="max-width:200px;border-radius:10px;margin-top:5px;">` : ""}
    <div class="seen">${data.seen ? "Seen ✅✅" : "Delivered ✅"}</div>
  `;

  messagesContainer.appendChild(msgDiv);

  // Mark as seen if viewer is admin or current user
  if (user.email === adminEmail || user.email === data.email) {
    db.collection("messages").doc(id).update({ seen: true });
  }
}

// === SEND MESSAGE ===
sendBtn.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const user = auth.currentUser;
  if (!user) return alert("Login first!");
  const text = messageInput.value.trim();
  if (text === "") return;

  db.collection("messages").add({
    name: user.displayName || "Guest",
    email: user.email,
    text: text,
    photoURL: null,
    seen: false,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });
  messageInput.value = "";
}

// === PHOTO SEND ===
photoBtn.addEventListener("click", () => {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.onchange = e => {
    const file = e.target.files[0];
    uploadPhoto(file);
  };
  fileInput.click();
});

function uploadPhoto(file) {
  const user = auth.currentUser;
  if (!user) return alert("Login first!");

  const storageRef = firebase.storage().ref(`chat_photos/${Date.now()}_${file.name}`);
  storageRef.put(file).then(snapshot => {
    snapshot.ref.getDownloadURL().then(url => {
      db.collection("messages").add({
        name: user.displayName || "Guest",
        email: user.email,
        text: "",
        photoURL: url,
        seen: false,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
    });
  });
}

// === TYPING INDICATOR ===
let typingTimeout;
messageInput.addEventListener("input", () => {
  const user = auth.currentUser;
  if (!user) return;
  db.collection("typing").doc("status").set({ user: user.displayName, active: true });
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    db.collection("typing").doc("status").set({ active: false });
  }, 2000);
});

db.collection("typing").doc("status").onSnapshot(doc => {
  const data = doc.data();
  if (data && data.active) {
    typingIndicator.textContent = `${data.user} is typing...`;
    typingIndicator.classList.remove("hidden");
  } else {
    typingIndicator.classList.add("hidden");
  }
});
