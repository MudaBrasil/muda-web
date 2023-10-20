import { db, docRef } from '@/services/firebase'
import { collection, setDoc, getDocs, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore'

const saveUser = async (user) => {
	try {
		await setDoc(doc(db, `users/${user.uid}`), user)
	} catch (error) {
		console.error(error)
	}
}

const getUsers = async () => {
	try {
		const querySnapshot = await getDocs(collection(db, 'users'))
		const users = querySnapshot.docs.map((doc) => doc.data())
		return users
	} catch (error) {
		console.error(error)
	}
}

const getUserById = async (userId) => {
	try {
		const docSnap = await getDoc(docRef.user(userId))
		if (docSnap.exists()) {
			const data = docSnap.data()
			return data
		} else {
			console.error('User not found')
			return null
		}
	} catch (error) {
		console.error(error)
	}
}

const updateUser = async (userId, updatedUser) => {
	try {
		const userRef = doc(db, 'users', userId)
		await updateDoc(userRef, updatedUser)
	} catch (error) {
		console.error(error)
	}
}

const deleteUser = async (userId) => {
	try {
		const userRef = doc(db, 'users', userId)
		await deleteDoc(userRef)
	} catch (error) {
		console.error(error)
	}
}

export { saveUser, getUsers, getUserById, updateUser, deleteUser }
