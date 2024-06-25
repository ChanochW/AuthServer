import {MongoClient, ServerApiVersion, Db} from 'mongodb';
import {config} from "dotenv";

const dbName = 'MyApp';

config();

const client = new MongoClient(process.env.URI!, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let db: Db;

async function connectDB() {

    if (!db) {
        await client.connect();
        db = client.db(dbName);
        console.log('Connected successfully to Database');
    }
    return db;
}

export {connectDB};