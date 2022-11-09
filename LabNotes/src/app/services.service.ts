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
import {
  addDoc,
  collection,
  doc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { Observable } from 'rxjs';
import labelFormat from './interfaces/labels.interface';
import { AngularFirestore, CollectionReference } from '@angular/fire/compat/firestore';
import NotesFormat from './interfaces/notes.interface';

@Injectable({
  providedIn: 'root',
})
export class ServicesService {
  Router: any;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private of: AngularFirestore
  ) {}

  /* ------------------ FUNCIONES DE AUTENTICACIÓN --------------------------------- */

  register(email: string, password: string) {
    //FUNCIÓN PARA REGISTRAR
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  signInWithEmailAndPass(email: string, password: string) {
    //FUNCIÓN PARA INICIAR SESIÓN
    return signInWithEmailAndPassword(this.auth, email, password);
  }
  loginWithGoogle() {
    // FUNCIÓN PARA INICIAR SESIÓN CON GOOGLE
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  resetPassword(email: string) {
    // FUNCIÓN PARA ENVIAR EMAIL DE RECUPERACIÓN DE CONTRASEÑA
    return sendPasswordResetEmail(this.auth, email);
  }

  sendEmailVerif(user: any) {
    // FUNCIÓN PARA ENVIAR EMAIL DE VALIDACIÓN DE CORREO
    return sendEmailVerification(user);
  }

  singOutUser() {
    // FUNCIÓN PARA CERRAR SESIÓN
    return signOut(this.auth);
  }

  /* --------------------------------- FUNCIONES PARA OBTENER COLECCIONES DE FIRESTORE ---------------------------------*/

  /* -------------------- AGREGAR Y BUSCAR USUARIOS -------------------- */

  addDataUser(user: UserFormat, id: string) {
    // AGREGAR UN NUEVO USUARIO A LA COLECCIÓN CUANDO SE REGISTRA
    const dbRef = doc(this.firestore, 'dataUser', id);
    return setDoc(dbRef, user);
  }

  getDataUser(): Observable<UserFormat[]> {
    //OBTENER LOS DATOS DE LA BASE PARA MOSTRAR LA INFO DEL USUARIO
    const dbRef = collection(this.firestore, 'dataUser');
    return collectionData(dbRef, { idField: 'id' }) as Observable<UserFormat[]>;
  }

  getCurrUser() {
    // OBTIENE EL USUARIO LOGUEADO ACTUALMENTE
    return this.auth.currentUser?.uid;
  }

  changeNicknameOrName(currUser: any, newValor: string) {
    //ACTUALIZA EL NICK DEL USUARIO
    const orderRef = doc(this.firestore, `dataUser/${currUser}`);
    return updateDoc(orderRef, { nickname: newValor });
  }

  /* -------------------- AGREGAR, EDITAR, ELIMINAR Y BUSCAR ETIQUETAS -------------------- */

  addDataLabels(label: labelFormat) {
    //PERMITE AGREGAR UNA NUEVA ETIQUETA
    const dbRef = collection(this.firestore, 'dataLabels');
    return addDoc(dbRef, label);
  }

  getDataLabelsByUser(idUser: string) {
    // TRAE LAS ETIQUETAS SOLO DEL USUARIO LOGUEADO
    const dbRef = this.of.collection('dataLabels', (ref) =>
      ref.where('idUser', '==', idUser)
    );
    return dbRef.valueChanges({ idField: 'id' });
  }

  updateLabel(idLabel: string, newNameLabel: string, newColorLabel: string) {
    // ACTUALIZA LA ETIQUETA
    return this.of.collection('dataLabels').doc(idLabel).update({
      nameLabel: newNameLabel,
      colorLabel: newColorLabel,
    });
  }

  deleteLabel(idLabel: string) {
    //ELIMINA LA ETIQUETA DE LA COLECCIÓN
    return this.of.collection('dataLabels').doc(idLabel).delete();
  }

  /* -------------------- AGREGAR, EDITAR, ELIMINAR Y BUSCAR NOTAS -------------------- */

  addDataNotes(note: NotesFormat) {
    //PERMITE AGREGAR UNA NUEVA NOTA

    const dbRef = collection(this.firestore, 'dataNotes');
    return addDoc(dbRef, note);
  }

  getDataNotesByUser(idUser: string) {
    // TRAE LAS ETIQUETAS SOLO DEL USUARIO LOGUEADO
    const dbRef = this.of.collection('dataNotes', (ref) =>
      ref
      .where('status.archived', '==', false)
      .where('status.trash', '==', false)
      .where('idUser', '==', idUser)
    );
    return dbRef.valueChanges({ idField: 'id' });
  }

  getNotesArchivedByUser(idUser: string) {
    const dbRef = this.of.collection('dataNotes', (ref) =>
      ref
        .where('status.archived', '==', true)
        .where('idUser', '==', idUser)
    );
    return dbRef.valueChanges({ idField: 'id' });
  }
  
  getNotesTrashByUser(idUser: string){
    const dbRef = this.of.collection('dataNotes', (ref) =>
    ref
      .where('status.trash', '==', true)
      .where('idUser', '==', idUser)
  );
  return dbRef.valueChanges({ idField: 'id' });
}

  updateNoteContent(idNote: string, newContentNote: NotesFormat) {
    // ACTUALIZA LA NOTA
    return this.of
      .collection('dataNotes')
      .doc(idNote)
      .update({
        category: {
          id: newContentNote.category.id,
          nameLabel: newContentNote.category.nameLabel,
          colorLabel: newContentNote.category.colorLabel,
        },
        title: newContentNote.title,
        contNote: newContentNote.contNote,
      });
  }

  updateLabelInNote(idNote: string, label: labelFormat) {
    return this.of
      .collection('dataNotes')
      .doc(idNote)
      .update({
        category: {
          id: label.id,
          nameLabel: label.nameLabel,
          colorLabel: label.colorLabel,
        },
      });
  }

  sendNoteToTrash(idNote: string) {
    return this.of
      .collection('dataNotes')
      .doc(idNote)
      .update({
        status: {
          archived: false,
          trash: true,
        },
      });
  }

  sendNoteToArchive(idNote: string) {
    return this.of
      .collection('dataNotes')
      .doc(idNote)
      .update({
        status: {
          archived: true,
          trasn: false,
        },
      });
  }

  restoreNotes(idNote: string) {
    return this.of
      .collection('dataNotes')
      .doc(idNote)
      .update({
        status: {
          archived: false,
          trash: false,
        },
      });
  }

  deleteNote(idNote: string) {
    //ELIMINA LA ETIQUETA DE LA COLECCIÓN
    return this.of.collection('dataNotes').doc(idNote).delete();
  }

  filterNotesByLabel(idLabel: string, idUser:string) {
      const dbRef = this.of.collection('dataNotes', (ref) =>
        ref
          .where('category.id', '==', idLabel)
          .where('idUser', '==', idUser)
      );
      return dbRef.valueChanges({ idField: 'id' });
  }
  /* -------------------- EVENT EMMITER -------------------- */

  $takeData = new EventEmitter<any>();
  $showModelStickyNoteFromHeader = new EventEmitter<any>();
  $showModelStickyNoteFromDropdown = new EventEmitter<any>();
  $closeModalsOfDropdown = new EventEmitter<any>();
  $closeModalsOfHeader = new EventEmitter<any>();
  $showFilterNotes = new EventEmitter<any>();
  $changeColorWhite = new EventEmitter<any>();
  $changeColorBlack = new EventEmitter<any>();
  $notesFilterByLabel = new EventEmitter<any>();
}
