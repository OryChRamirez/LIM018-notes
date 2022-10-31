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
import { collection, doc, setDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {


  constructor(
    private auth: Auth,
    private firestore: Firestore,
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
    console.log(this.auth);
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

$takeData = new EventEmitter<any>();
$showModelStickyNote = new EventEmitter<any>();
}


