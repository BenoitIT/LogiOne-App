export interface LoginProps {
    email?: string;
    password?: string;
    confirmPassword?: string;
  }
 export interface ErrorProps {
    [key: string]: string | undefined; 
  }