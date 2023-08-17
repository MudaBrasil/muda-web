import { db } from '@/firebaseConfig'
import { collection, setDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'

const saveUser = async (user) => {
  try {
    await setDoc(doc(db, `users/${user.uid}`), user)
  } catch (error) {
    console.log(error)
  }
}

const getUsers = async () => {
  try {
    console.log('getUsers')
    const querySnapshot = await getDocs(collection(db, 'users'))
    const users = querySnapshot.docs.map((doc) => doc.data())
    return users
  } catch (error) {
    console.log(error)
  }
}

const getUserById = async (userId) => {
  try {
    const userDoc = await doc(db, 'users', userId).get()
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() }
    } else {
      console.log('User not found')
      return null
    }
  } catch (error) {
    console.log(error)
  }
}

const updateUser = async (userId, updatedUser) => {
  try {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, updatedUser)
    console.log('User updated successfully')
  } catch (error) {
    console.log(error)
  }
}

const deleteUser = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId)
    await deleteDoc(userRef)
    console.log('User deleted successfully')
  } catch (error) {
    console.log(error)
  }
}

export { saveUser, getUsers, getUserById, updateUser, deleteUser }