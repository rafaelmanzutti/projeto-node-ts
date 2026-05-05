import express from 'express';

class Main {
  private _server;

  constructor() {
    this._server = express();
    this._middleware();
  }

  private _middleware() {
    this._server.use(express.json());
  }

  get server() {
    return this._server;
  }
}

export const main = new Main();
