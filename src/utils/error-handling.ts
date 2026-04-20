import { HTTPException } from "hono/http-exception";
type Success<T> = {
  data: T;
  error: null;
};

type Failure<T> = {
  data: null;
  error: T;
};

export type Result<T, E = Error | HTTPException> = Success<T> | Failure<E>;
