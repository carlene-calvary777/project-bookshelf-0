const { nanoid } = require('nanoid');
const books = require('./books');

//KRITERIA 3: API dapat menyimpan buku

const addBookHandler = (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,} = request.payload;

    
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = readPage === pageCount;

    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,};

    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        }).code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response =  h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        }).code(400);
        return response;
    }


    books.push(newBook);
    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
          status: 'success',
          message: 'Buku berhasil ditambahkan',
          data: {
            bookId: id,
          },
        }).code(201);
        return response;
    }
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal ditambahkan',
    }).code(500);
    return response;

    
};

//KRITERIA 4: API dapat menampilkan seluruh buku

const getAllBooksHandler = () => ({
    status: 'success',
    data: {
      books,
    },
  });

//KRITERIA 5: API dapat menampilkan detail buku

const getBookByIdHandler = (request, h) => {
    const {id} = request.params;

  const book = books.filter((n) => n.id === id)[0];

  if (book) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  }).code(404);
  return response;
};

//kriteria 6: API dapat mengubah data buku
const updateBookHandler = (request, h) => {
    const { id } = request.params;
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
    } = request.payload;

    if (!name) {
        const response =  h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        }).code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        }).code(400);
        return response;
    }

    const updatedAt = new Date().toISOString();
    const bookIndex = books.findIndex(book => book.id === id);

    if (bookIndex !== -1) {
        books[bookIndex] = {
            ...books[bookIndex],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt,
            finsihed: pageCount===readPage,
        };
        const response = h.response({
          status: 'success',
          message: 'Buku berhasil diperbarui',
        }).code(200);
        return response;
      }

      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
      }).code(404);
        return response;
};

//kriteria 7
const deleteBookHandler = (request, h) => {
    const { id } = request.params;
    const bookIndex = books.findIndex((book) => book.id === id);

    if (bookIndex !== -1) {
        books.splice(bookIndex, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus'
        }).code(200);
        return response;
    }    

    const response =  h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    }).code(404);
    return response;
};


module.exports = { 
    addBookHandler, 
    getAllBooksHandler, 
    getBookByIdHandler, 
    updateBookHandler, 
    deleteBookHandler
};

