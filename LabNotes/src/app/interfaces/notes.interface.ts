import labelFormat from './labels.interface';
export default interface NotesFormat {
    id?: string,
    idUser: string,
    category: {
        id: string,
        nameLabel: string,
        colorLabel: string,
    },
    title: string,
    contNote: string,
    status: {
        archived: false,
        trash: false,
    },
};