import fs from 'fs';
import path from 'path';

export class UtilsFileUser {
  private static _userPath = ['assets', 'files'];

  private static _validateFolderUser(userId: string) {
    return fs.existsSync(path.resolve(...this._userPath, userId));
  }

  public static existsFolderUser(userId: string): boolean {
    return this._validateFolderUser(userId);
  }

  public static createFolderUser(userId: string) {
    if (!this._validateFolderUser(userId)) {
      fs.mkdirSync(path.resolve(...this._userPath, userId), { recursive: true });
    }
  }

  public static deleteFolderUser(userId: string) {
    fs.rmSync(path.resolve(...this._userPath, userId), { recursive: true });
  }
}
