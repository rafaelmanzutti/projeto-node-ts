import 'dotenv/config';
import { app } from './infra/http/server.js';

app.server.listen(3000);
