/* eslint-disable linebreak-style */
/* eslint-disable spaced-comment */
/* eslint-disable space-before-blocks */
/* eslint-disable indent */
/* eslint-disable eol-last */
/* eslint-disable quotes */
/* eslint-disable no-trailing-spaces */

const {nanoid} = require("nanoid");
const notes = require("./notes");

const addNoteHandler = (request, h) => {
    const {tittle, tags, body} = request.payload;
    const id = nanoid(16); //generate id number
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    //add note with push methode
    const newNote = {
        tittle, tags, body, id, createdAt, updatedAt,
    };
    notes.push(newNote);
    //check notes
    const isSuccess = notes.filter((note)=>note.id === id).length > 0;
    //if success added
    if (isSuccess){
        const response = h.response({
            status: 'Success',
            message: 'Catatan berhasil disimpan',
            data: {
                noteId: id,
            },
        });
        response.code(201);
        return response;
    }
    //if fail
    const response = h.response({
        status: 'fail',
        message: 'Catatan gagal disimpan',
    });
    response.code(500);
    return response;
};

const getAllNotesHandler = () => ({
    status: 'success',
    data: {
        notes,
    },
});

const getNoteByIdHandler = (request, h) => {
    const {id} = request.params;
    //get notes from filtering the id
    const note = notes.filter((n) => n.id === id)[0];
    if (note !== undefined) {
        return {
            status: 'success',
            data: {
                note,
            },
        };
    }
    const response = h.response({
        status: 'fail',
        message: 'sorry, your note not found',
    });
    response.code(404);
    return response;
};

const editNoteByIdHandler = (request, h) => {
    const {id} = request.params;
    //get notes with body request
    const {tittle, tags, body} = request.payload;
    //dont forget to update date n time
    const updatedAt = new Date().toISOString();
    //edit notes memanfaatkan array indexing
    const index = notes.findIndex((note)=> note.id === id);
    //index tidak akan bernilai -1 apabila note dan id yang dicari ada
    if (index !== -1){
        notes[index] ={
            ...notes[index],
            tittle,
            tags,
            body,
            updatedAt,
        };
        const response = h.response({
            status: 'success',
            message: 'Note edited',
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Failed to edit note',
    });
    response.code(404);
    return response;
};

const deleteNoteByIdHandler = (request, h) => {
    const {id} = request.params;
    //find index
    const index = notes.findIndex((note)=> note.id === id);
    //delete notes (with splice methode) jika index tidak sama dengan -1
    if (index !== -1){
        notes.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Deleted',
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Failed to delete note',
    });
    response.code(404);
    return response;
};

module.exports = { 
    addNoteHandler, 
    getAllNotesHandler, 
    getNoteByIdHandler, 
    editNoteByIdHandler,
    deleteNoteByIdHandler,
};