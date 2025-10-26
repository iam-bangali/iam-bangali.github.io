// --- Firebase Configuration ---
// Replace these values with your Firebase project info
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// --- Initialize Firebase ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- Add Post ---
document.getElementById("addPost").addEventListener("click", async () => {
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;
  if (title && content) {
    await addDoc(collection(db, "posts"), { title, content });
    location.reload();
  }
});

// --- Show Posts ---
async function loadPosts() {
  const querySnapshot = await getDocs(collection(db, "posts"));
  const postsContainer = document.getElementById("posts");
  postsContainer.innerHTML = "";
  querySnapshot.forEach((doc) => {
    const post = doc.data();
    postsContainer.innerHTML += `
      <div class="post">
        <h3>${post.title}</h3>
        <p>${post.content}</p>
      </div>`;
  });
}

loadPosts();
