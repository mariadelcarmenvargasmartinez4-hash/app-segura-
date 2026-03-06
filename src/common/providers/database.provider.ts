//export const pgProvider = {
    //provide: 'POSTGRES_CONNECTION',
    //useFactory: async () => {
      //  const { Client } = await import('pg');
       // const client = new Client({
         //   user: 'postgres',
          //  host: 'localhost',
          //  database: 'taskdb',  }    );   
    //        await client.connect();
   //         return client;
//}}
///codigo relizado para hacer la conexion 

import { Pool } from 'pg';

export const PostgresProvider = {
  provide: 'PG',
  useFactory: async () => {
    const pool = new Pool({
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: 'carmenvargas',
      database: 'tasks_db',
    });

    return pool;
  },
};