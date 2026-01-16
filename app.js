// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";



// Initialize Firebase
const firebaseConfig = {
  apiKey: "YYAIzaSyCe2PIUXBclIhX6A5Vq7dzcdbCARMnGA0s",
  authDomain: "localproof-cc7ce.firebaseapp.com",
  projectId: "localproof-cc7ce",
  storageBucket: "localproof-cc7ce.firebasestorage.app",
  messagingSenderId: "238102748597",
  appId: "1:238102748597:web:9f2ea46c8f69a00e5e0dfc"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// DOM Elements
const posterInput = document.getElementById("posterInput");
const titleInput = document.getElementById("titleInput");
const organizerInput = document.getElementById("organizerInput");
const expiryInput = document.getElementById("expiryInput");
const verifiedInput = document.getElementById("verifiedInput");
const uploadBtn = document.getElementById("uploadBtn");
const preview = document.getElementById("preview");
const qrcodeDiv = document.getElementById("qrcode");

// 1️⃣ Preview poster immediately
posterInput.addEventListener("change", () => {
  const file = posterInput.files[0];
  if (file) {
    preview.src = URL.createObjectURL(file);
  }
});

// 2️⃣ Upload poster & generate QR
uploadBtn.addEventListener("click", async () => {
  const title = titleInput.value.trim();
  const organizer = organizerInput.value.trim();
  const expiry = expiryInput.value;
  const verified = verifiedInput.checked;

  if (!title || !organizer) {
    alert("Please fill in the title and organizer.");
    return;
  }

  try {
    uploadBtn.innerText = "Saving...";
    
    // ✅ SAVE TO FIRESTORE COLLECTION ONLY
    const docRef = await addDoc(collection(db, "posters"), {
      title,
      organizer,
      expiryDate: expiry,
      verified,
      createdAt: serverTimestamp()
    });

    // ✅ GENERATE QR CODE
    qrcodeDiv.innerHTML = "";
    new window.QRCode(qrcodeDiv, {
     text: `https://localproof-cc7ce.web.app/verify.html?id=${docRef.id}`,
      width: 200,
      height: 200
    });

    alert("Success! Data saved to Database and QR generated.");
    uploadBtn.innerText = "Upload Poster & Generate QR";

  } catch (error) {
    console.error("Database Error:", error);
    alert("Database Error: " + error.message);
  }
});