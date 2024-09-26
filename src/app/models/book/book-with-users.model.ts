export interface BookWithUsers {
  bookId: string,
  author: string,
  name: string,
  users: UserInfos[]
}

interface UserInfos {
  dueDate: string,
  email: string,
  fullname: string,
  rentedDate: string,
  userId: string
}
