import { Request } from 'express';
import { Worker } from 'cluster';

interface ExtRequest extends Request {
  workers?: Worker[]
}

export default ExtRequest;