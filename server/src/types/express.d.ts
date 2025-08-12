import * as express from 'express';

declare global {
  namespace Express {
    export interface Request{
      user?: any;
    }
  }
}

// declare module 'express-serve-static-core' {
//   interface Request {
//     user?: any; // or specify a more specific type for 'user'
//   }
// }


// declare global {
//   namespace Express {
//     export interface Request {
//       user: any;
//     }
//     export interface Response {
//       user: any;
//     }
//   }
// }