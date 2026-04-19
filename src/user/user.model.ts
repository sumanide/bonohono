export type UserResponse = {
  email: string;
  first_name: string;
  poster: number | null;
};
export type AllUserResponse = {
  email: string;
  first_name: string;
  poster: number | null;
};

export type Pageable<T> = {
  data: Array<T>;
};
