interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  profilePhoto: string | null;
}

interface ApiResponse {
  items: User[];
  totalRecords: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export enum Role {
  Admin = 'Admin',
  User = 'User',
  Manager = 'Manager'
}