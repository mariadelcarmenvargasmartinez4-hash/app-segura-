export class Task {
  id?: number;              // Opcional si Prisma lo genera automáticamente
  name!: string;
  priority!: boolean;
  description!: string;
}