import fs from 'fs';
import path from 'path';
import { IStorageRepository } from '../../types/IStorageRepository.js';

export class FileStorageRepository implements IStorageRepository {
  constructor(private readonly basePath: string[]) {}

  private _getPath(segments: string[]): string {
    return path.resolve(process.cwd(), ...this.basePath, ...segments);
  }

  public existsFolder(segments: string[]): boolean {
    return fs.existsSync(this._getPath(segments));
  }

  public createFolder(segments: string[]): boolean {
    try {
      if (!this.existsFolder(segments)) {
        fs.mkdirSync(this._getPath(segments), { recursive: true });
      }
      return true;
    } catch {
      return false;
    }
  }

  public deleteFolder(segments: string[]): void {
    fs.rmSync(this._getPath(segments), { recursive: true, force: true });
  }
}
