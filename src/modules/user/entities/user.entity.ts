export class User {
  id !: number;
  name !: string;
  lastname !: string;
  username !: string;
  password !: string;
  refreshToken?: string;
  hash?: string |null |undefined;// Campo para almacenar el hash del refresh token
  createdAt !: Date;
}