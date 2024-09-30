import { MongoClient } from 'mongodb';

let db;

async function connectToDb(cb){
    // const client = new MongoClient('mongodb://127.0.0.1:27017'); // local
    const client = new MongoClient(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.esbpl.mongodb.net/`);
    await client.connect();
    // db = client.db('react-blog-db'); // local
    db = client.db('react_blog');
    cb();
}

export {
    db,
    connectToDb,
}
