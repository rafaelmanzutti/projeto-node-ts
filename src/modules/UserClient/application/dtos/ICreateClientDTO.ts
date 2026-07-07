export interface ICreateClientDTO {
  userId: string;
  name: string;
  email?: string | null;
  phone?: string | null;
}
