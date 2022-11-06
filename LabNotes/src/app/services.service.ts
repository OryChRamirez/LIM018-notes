import { EventEmitter, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
} from '@angular/fire/auth';
import { collectionData, Firestore } from '@angular/fire/firestore';
import UserFormat from 'src/app/interfaces/user.interface';
import { addDoc, collection, doc, setDoc, updateDoc, where } from 'firebase/firestore';
import { Observable } from 'rxjs';
import labelFormat from './interfaces/labels.interface';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { idToken } from '@angular/fire/auth';


@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  Router: any;


  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private of: AngularFirestore,
    ) {  }
    
  /* ------------------ FUNCIONES DE AUTENTICACIÓN --------------------------------- */

  register(email: string, password: string) { //FUNCIÓN PARA REGISTRAR 
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  signInWithEmailAndPass(email: string, password: string) { //FUNCIÓN PARA INICIAR SESIÓN
    return signInWithEmailAndPassword(this.auth, email, password);
  }
  loginWithGoogle() { // FUNCIÓN PARA INICIAR SESIÓN CON GOOGLE
    return signInWithPopup(this.auth, new GoogleAuthProvider);
  }

  resetPassword(email: string) { // FUNCIÓN PARA ENVIAR EMAIL DE RECUPERACIÓN DE CONTRASEÑA
    return sendPasswordResetEmail(this.auth, email);
  }

  sendEmailVerif(user: any){ // FUNCIÓN PARA ENVIAR EMAIL DE VALIDACIÓN DE CORREO
    return sendEmailVerification(user);
  }

  singOutUser() { // FUNCIÓN PARA CERRAR SESIÓN
    return signOut(this.auth);
  }

/* --------------------------------- FUNCIONES PARA OBTENER COLECCIONES DE FIRESTORE ---------------------------------*/

addDataUser(user: UserFormat, id: string) { // AGREGAR UN NUEVO USUARIO A LA COLECCIÓN CUANDO SE REGISTRA
  const dbRef = doc(this.firestore, 'dataUser', id);
  return setDoc(dbRef, user);
};

getDataUser(): Observable<UserFormat[]> { //OBTENER LOS DATOS DE LA BASE PARA MOSTRAR LA INFO DEL USUARIO
  const dbRef = collection(this.firestore, 'dataUser');
  return collectionData(dbRef, { idField: 'id' }) as Observable<UserFormat[]>
}

getCurrUser() { // OBTIENE EL USUARIO LOGUEADO ACTUALMENTE
  return this.auth.currentUser?.uid;
}

changeNicknameOrName(currUser: any, newValor:string) {
  const orderRef = doc(this.firestore, `dataUser/${currUser}`);
  return updateDoc(orderRef, {nickname: newValor})
} 

addDataLabels(label: labelFormat) {
  const dbRef = collection(this.firestore, 'dataLabels');
  return addDoc(dbRef, label);
}

getDataLabelsByUser(idUser: string) {
  const dbRef = this.of.collection('dataLabels', ref => ref.where('idUser', '==', idUser)); 
  return dbRef.valueChanges({ idField: 'id' });
}

updateLabel(idLabel: string, newNameLabel: string, newColorLabel: string) {
  return this.of.collection('dataLabels').doc(idLabel).update({
    nameLabel: newNameLabel,
    colorLabel: newColorLabel,
  })
}

$takeData = new EventEmitter<any>();
$showModelStickyNote = new EventEmitter<any>();
$showModalChangeNickname = new EventEmitter<any>();
}


