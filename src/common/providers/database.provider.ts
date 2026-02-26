export const pgProvider = {
    provide: 'POSTGRES_CONNECTION',
    useFactory: async () => {
        const { Client } = await import('pg');
        const client = new Client({
            user: 'postgres',
            host: 'localhost',
            database: 'taskdb',  }    );   
            await client.connect();
            return client;
}}