const fs = require('fs');
const { getStorage, ref, uploadBytesResumable, getDownloadURL } = require('firebase/storage');
var firebase = require("firebase/app");

const firebaseConfig = {
    apiKey: "AIzaSyAV2vZcLWF3CtHzcFRZdWUhuThB8Xk9OKI",
    authDomain: "tabscare-4c80e.firebaseapp.com",
    projectId: "tabscare-4c80e",
    storageBucket: "tabscare-4c80e.appspot.com",
    messagingSenderId: "342064941068",
    appId: "1:342064941068:web:38f8f49cc4a726c0c04629"
};

const firebaseConn = firebase.initializeApp(firebaseConfig);

async function uploadFile(imagePath, imageOriginalName, userId) {
    try {
        let image = fs.readFileSync(imagePath);
        const fileName = new Date().getTime() + imageOriginalName;

        const storage = getStorage(firebaseConn, 'gs://tabscare-4c80e.appspot.com/');
        const storageRef = ref(storage, '/images/' + fileName);
        const uploadTask = uploadBytesResumable(storageRef, image, {
            contentType: 'image/png'
        });

        return new Promise(async (resolve, reject) => {
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const uploaded = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                },
                (error) => {
                    console.error(error);
                    reject(error);
                },
                async () => {
                    let url = await getDownloadURL(uploadTask.snapshot.ref);
                    console.log(url);
                    resolve(url);
                }
            );
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports = { uploadFile };
