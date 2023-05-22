const { nanoid } = require('nanoid');
const books = require('./books');

const addBookAllHandler = (request, h) => {
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

  const id = nanoid(10);
  const finished = pageCount === readPage ? true : false;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

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

  if (name === '' || name === undefined) {
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
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahakan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
};

const getAllBookHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  console.log('name', name);
  console.log('reading', reading);
  console.log('finished', finished);

  if (name) {
    const getName = books
      .filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
      .map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      }));

    const response = h.response({
      status: 'success',
      data: {
        books: getName,
      },
    });
    response.code(200);
    return response;
  }

  if (reading === '0') {
    const getReadingFalse = books
      .filter((book) => book.reading === false)
      .map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      }));

    const response = h.response({
      status: 'success',
      data: {
        books: getReadingFalse,
      },
    });
    response.code(200);
    return response;
  }

  if (reading === '1') {
    const getReadingTrue = books
      .filter((book) => book.reading === true)
      .map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      }));

    const response = h.response({
      status: 'success',
      data: {
        books: getReadingTrue,
      },
    });
    response.code(200);
    return response;
  }

  if (finished === '0') {
    const getFinishedFalse = books
      .filter((book) => book.finished === false)
      .map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      }));

    const response = h.response({
      status: 'success',
      data: {
        books: getFinishedFalse,
      },
    });
    response.code(200);
    return response;
  }

  if (finished === '1') {
    const getFinishedTrue = books
      .filter((book) => book.finished === true)
      .map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      }));

    const response = h.response({
      status: 'success',
      data: {
        books: getFinishedTrue,
      },
    });
    response.code(200);
    return response;
  }

  if (
    (reading !== '0' && reading !== '1') ||
    (finished !== '0' && finished !== '1')
  ) {
    const isTrueFalse = books.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));

    const response = h.response({
      status: 'success',
      data: {
        books: isTrueFalse,
      },
    });
    response.code(200);
    return response;
  }

  if (!name && !reading && !finished) {
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
  }
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const book = books.filter((n) => n.id === id)[0];

  if (book !== undefined) {
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
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { id } = request.params;

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

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    if (name === '' || name === undefined) {
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
        message:
          'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }

    console.log('indexEdit', index);
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

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = books.findIndex((book) => book.id === id);
  console.log('index', index);

  if (index !== -1) {
    books.splice(index, 1);
    console.log('indexslice', index);

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
  addBookAllHandler,
  getAllBookHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
