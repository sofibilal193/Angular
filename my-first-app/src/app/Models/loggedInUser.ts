export interface LoggedInUser {
  name: string;
  surname: string;
  userName: string;
  role: any;
  roles: any[];
  token: any;
  isLoggedIn: boolean;
  userId: number;
  email: string;
}