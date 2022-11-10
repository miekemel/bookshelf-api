const { nanoid } = require('nanoid');
const books = require('./books');

// menambahkan buku
const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = readPage === pageCount;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  // eslint-disable-next-line no-use-before-define
  if (newBook.name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

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
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};
// akhir menambahkan buku

// menampilkan seluruh buku
const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  if (name !== undefined || reading !== undefined || finished !== undefined) {
    /* Check whether query by name is set */
    if (name !== undefined) {
      const newBook = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));

      if (newBook.length > 0) {
        const queryBook = newBook.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        }));

        const response = h.response({
          status: 'success',
          data: {
            books: queryBook,
          },
        });
        response.code(200);
        return response;
      }

      const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
      });
      response.code(404);
      return response;
    }

    /* Check whether query by reading flag is set */
    if (reading !== undefined) {
      const flagRead = reading === '1';

      const newBook = books.filter((book) => book.reading === flagRead);

      if (newBook.length > 0) {
        const queryBook = newBook.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        }));

        const response = h.response({
          status: 'success',
          data: {
            books: queryBook,
          },
        });
        response.code(200);
        return response;
      }

      const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
      });
      response.code(404);
      return response;
    }

    /* Check whether query by finished flag is set */
    if (finished !== undefined) {
      const flagFinish = finished === '1';

      const newBook = books.filter((book) => book.finished === flagFinish);

      if (newBook.length > 0) {
        const queryBook = newBook.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        }));

        const response = h.response({
          status: 'success',
          data: {
            books: queryBook,
          },
        });
        response.code(200);
        return response;
      }

      const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
      });
      response.code(404);
      return response;
    }
  }

  const response = h.response({
    status: 'success',
    data: {
      books: books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};
// akhir menampilkan seluruh buku

// menampilkan buku dengan Id
const getBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const book = books.filter((nId) => nId.id === id)[0];

  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};
// akhir menampilkan buku dengan Id

// Mengubah data buku dengan Id
const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    if (!name) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }

    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// Akhir merubah data buku dengan Id

// Menghapus Buku
const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
