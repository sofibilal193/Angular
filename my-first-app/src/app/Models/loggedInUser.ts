export interface LoggedInUser {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  roles: any[];
  isLoggedIn: boolean;
}
