export interface NewStaff {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  gender?: string;
  role?: string;
  workCountry?: string;
}
export interface newStaffErrors {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  gender?: string | null;
  role?: string | null;
  workCountry?: string | null;
}
export interface passwordUpdate {
  userId?: number;
  oldpassword?: string;
  newPassword?: string;
  newPasswordConfirmation?: string;
}
