// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyCmKrBXrG2-W7zJlj0Uu0j8I0I2JY17F_0',
	authDomain: 'iot-project-b433d.firebaseapp.com',
	projectId: 'iot-project-b433d',
	storageBucket: 'iot-project-b433d.appspot.com',
	messagingSenderId: '233400450183',
	appId: '1:233400450183:web:2a0382cd6c75fdb969cc22',
	measurementId: 'G-0CSRKNZE85',
	databaseURL:
		'https://iot-project-b433d-default-rtdb.europe-west1.firebasedatabase.app',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase();
