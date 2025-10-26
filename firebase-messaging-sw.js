// firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyAeC_qcXhUeXBeGDSPr-ODJMWnG8ykD5B4",
  authDomain: "csm-bolg-site.firebaseapp.com",
  databaseURL: "https://csm-bolg-site-default-rtdb.firebaseio.com",
  projectId: "csm-bolg-site",
  storageBucket: "csm-bolg-site.firebasestorage.app",
  messagingSenderId: "931917499515",
  appId: "1:931917499515:web:dc9890e7e990e55d7e66de",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log("📩 Received background message ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "https://cdn-icons-png.flaticon.com/512/10308/10308648.png"
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
