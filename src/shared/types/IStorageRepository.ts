export interface IStorageRepository {
  createFolder(segments: string[]): boolean;
  deleteFolder(segments: string[]): void;
  existsFolder(segments: string[]): boolean;
}
