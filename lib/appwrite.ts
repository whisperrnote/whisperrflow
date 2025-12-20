import { Client, TablesDB, Storage, Account } from "appwrite";
import { APPWRITE_CONFIG } from "./config";

const client = new Client();

if (APPWRITE_CONFIG.ENDPOINT) {
    client.setEndpoint(APPWRITE_CONFIG.ENDPOINT);
}
if (APPWRITE_CONFIG.PROJECT_ID) {
    client.setProject(APPWRITE_CONFIG.PROJECT_ID);
}

export const tablesDB = new TablesDB(client);
export const storage = new Storage(client);
export const account = new Account(client);
export { client };
