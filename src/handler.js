const { nanoid } = require('nanoid');
const books = require('./books');

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
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    id,
    insertedAt,
    updatedAt,
};

if (newBook.name === undefined) {
    const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;

} else if (newBook.pageCount < newBook.readPage) {
    const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
} else if (!(newBook.name === undefined) && (newBook.pageCount >= newBook.readPage)) {
    const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
            bookId: id,
        },
    });

    books.push(newBook);

    response.code(201);
    return response;

} else {
    const response = h.response({
        status: 'error',
      message: 'Buku Gagal ditambahkan',
    });

    response.code(500);
    return response;

};
const getAllBooksHandler = (request, h) => {
    const {name, reading, finished} = request.query;

    let book;
    if (reading === '1') {
        const read = books.filter((book) => book.reading === (reading === '1')).map((book) => {
                'id': book.id,
                'name': book.name,
                'publisher': book.publisher,
    });
        
        book = read;
        return h.response({
            status: 'success',
            data: {
                'books': book,
            },
        });
    }
    if (reading === '0') {
        const unread = books.filter((book) => book.reading === (reading !== '1')).map((book) => ({
            'id': book.id,
            'name': book.name,
            'publisher': book.publisher,
        }));

        book = unread;
        return h.response({
            status: 'success',
            data: {
                'books': book,
            },
        });
    }

    if (finished === '0') {
        const unfinish = books.filter((book) => book.finished === false).map((book) => ({
            'id': book.id,
            'name': book.name,
            'publisher': book.publisher,
        }));

        book = unfinish;
        return h.response({
            status: 'success',
            data: {
                'books': book,
            },
        });
    }
    if (finished === '1') {
        const finish = books.filter((book) => book.finished === (finished === '1').map((book) => ({
            'id': book.id,
            'name': book.name,
            'publisher': book.publisher,
        })))
        book = finish;
        return h.response({
            status: 'success',
            data: {
                'books': book,
            },
        });
    }

    if (name) {
        const filterByName = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase())).map((book) => ({
            'id': book.id,
            'name': book.name,
            'publisher': book.publisher,
        }));
        book = filterByName;
        return h.response({
            status: 'success',
            data: {
                'books': book,
            },
        });
    }
    if (name === undefined) {
        const randomBook = books.map((book) => {
            return {
                'id': book.id,
                'name': book.name,
                'publisher': book.publisher,
            };
        });
        book = randomBook;
        return h.response({
            status: 'success',
            data: {
                'books': book,
            },
        });
    }
};

let checkName = false;
if ((name === undefined)  || (name ==='') || !name) {
    checkName = true;
}
if (checkName) {
const response = h.response({
    status: 'fail',
    message: "Gagal memperbarui buku. Mohon isi nama buku",
});
response.code(400);
return response;
}
     
let checkReadPage = false;
if (readPage > pageCount) {
    checkReadPage = true;
}

if (checkReadPage) {
    const response = h.response({
        status: 'fail',
        message: ' Gagal memperbarui buku.readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
}
const response = h.response({
    status: 'success',
    message: 'success',
    message: 'Buku berhasil diperbarui'
});

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
};
response.code(200);
return response;
};

const deleteBookByIdHandler = (request, h) => {
    const {id} = request.params;

    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;

    };
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
