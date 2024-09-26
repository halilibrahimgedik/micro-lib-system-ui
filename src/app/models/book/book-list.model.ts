export interface BookList {
  books: Book[];
}

interface Book {
  bookId: string,
  name: string,
  author: string,
}
