// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getAnalytics } from 'firebase/analytics'
import {
	getFirestore,
	doc,
	type FirestoreDataConverter,
	type PartialWithFieldValue,
	type DocumentData,
	type QueryDocumentSnapshot
} from 'firebase/firestore'
import { User } from '@/services/firestore/models/user'

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
	measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
}

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)
const analytics = getAnalytics(firebaseApp)
const auth = getAuth(firebaseApp)
const db = getFirestore(firebaseApp)

const converter = <T>(ModelClass: new (data) => T): FirestoreDataConverter<T> => ({
	toFirestore: (data: PartialWithFieldValue<T>): PartialWithFieldValue<DocumentData> =>
		data as PartialWithFieldValue<DocumentData>,
	fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>, options): T => {
		// const data = snapshot.data() TODO: Test without options to see difference
		const data = snapshot.data(options)
		return new ModelClass(data) as T
	}
})

const typedRef = <T>(ModelClass: new (data) => T, path: string, ...pathSegments: string[]) => {
	return doc(db, path, ...pathSegments).withConverter(converter<T>(ModelClass))
}

const docRef = {
	user: (uid: string) => typedRef<User>(User, 'users', uid)
}

export { firebaseApp, auth, analytics, db, docRef }
