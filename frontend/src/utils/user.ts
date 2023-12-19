interface User {
  email: string | null;
  password: string | undefined;
}

type DetailedUser = User & {
  firstName: string;
  lastName: string;
};

export type { DetailedUser, User };
