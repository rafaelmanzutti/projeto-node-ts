import express from 'express';
import { routes } from './router.js';

class Main {
  private _server;

  constructor() {
    this._server = express();
    this._middleware();
    this._router();
  }

  private _middleware() {
    this._server.use(express.json());
  }

  private _router() {
    this._server.use(...routes);
  }
  get server() {
    return this._server;
  }
}

export const main = new Main();
