import { ID, Models } from "appwrite";
import { databases } from "./appwrite";
import { APPWRITE_CONFIG } from "./config";
import { Calendar, Task, Event, EventGuest, FocusSession } from "../types/whisperrflow";

const { DATABASE_ID, TABLES } = APPWRITE_CONFIG;

// Generic Helper Functions
async function listDocuments<T extends Models.Document>(collectionId: string, queries?: string[]): Promise<Models.DocumentList<T>> {
    return await databases.listDocuments<T>(DATABASE_ID, collectionId, queries);
}

async function createDocument<T extends Models.Document>(collectionId: string, data: unknown, documentId: string = ID.unique()): Promise<T> {
    return await databases.createDocument<T>(DATABASE_ID, collectionId, documentId, data as object);
}

async function getDocument<T extends Models.Document>(collectionId: string, documentId: string): Promise<T> {
    return await databases.getDocument<T>(DATABASE_ID, collectionId, documentId);
}

async function updateDocument<T extends Models.Document>(collectionId: string, documentId: string, data: unknown): Promise<T> {
    return await databases.updateDocument<T>(DATABASE_ID, collectionId, documentId, data as object);
}

async function deleteDocument(collectionId: string, documentId: string): Promise<void> {
    await databases.deleteDocument(DATABASE_ID, collectionId, documentId);
}

// --- Calendars ---

export const calendars = {
    list: (queries?: string[]) => listDocuments<Calendar>(TABLES.CALENDARS, queries),
    create: (data: Omit<Calendar, keyof Models.Document>) => createDocument<Calendar>(TABLES.CALENDARS, data),
    get: (id: string) => getDocument<Calendar>(TABLES.CALENDARS, id),
    update: (id: string, data: Partial<Omit<Calendar, keyof Models.Document>>) => updateDocument<Calendar>(TABLES.CALENDARS, id, data),
    delete: (id: string) => deleteDocument(TABLES.CALENDARS, id),
};

// --- Tasks ---

export const tasks = {
    list: (queries?: string[]) => listDocuments<Task>(TABLES.TASKS, queries),
    create: (data: Omit<Task, keyof Models.Document>) => createDocument<Task>(TABLES.TASKS, data),
    get: (id: string) => getDocument<Task>(TABLES.TASKS, id),
    update: (id: string, data: Partial<Omit<Task, keyof Models.Document>>) => updateDocument<Task>(TABLES.TASKS, id, data),
    delete: (id: string) => deleteDocument(TABLES.TASKS, id),
};

// --- Events ---

export const events = {
    list: (queries?: string[]) => listDocuments<Event>(TABLES.EVENTS, queries),
    create: (data: Omit<Event, keyof Models.Document>) => createDocument<Event>(TABLES.EVENTS, data),
    get: (id: string) => getDocument<Event>(TABLES.EVENTS, id),
    update: (id: string, data: Partial<Omit<Event, keyof Models.Document>>) => updateDocument<Event>(TABLES.EVENTS, id, data),
    delete: (id: string) => deleteDocument(TABLES.EVENTS, id),
};

// --- Event Guests ---

export const eventGuests = {
    list: (queries?: string[]) => listDocuments<EventGuest>(TABLES.EVENT_GUESTS, queries),
    create: (data: Omit<EventGuest, keyof Models.Document>) => createDocument<EventGuest>(TABLES.EVENT_GUESTS, data),
    get: (id: string) => getDocument<EventGuest>(TABLES.EVENT_GUESTS, id),
    update: (id: string, data: Partial<Omit<EventGuest, keyof Models.Document>>) => updateDocument<EventGuest>(TABLES.EVENT_GUESTS, id, data),
    delete: (id: string) => deleteDocument(TABLES.EVENT_GUESTS, id),
};

// --- Focus Sessions ---

export const focusSessions = {
    list: (queries?: string[]) => listDocuments<FocusSession>(TABLES.FOCUS_SESSIONS, queries),
    create: (data: Omit<FocusSession, keyof Models.Document>) => createDocument<FocusSession>(TABLES.FOCUS_SESSIONS, data),
    get: (id: string) => getDocument<FocusSession>(TABLES.FOCUS_SESSIONS, id),
    update: (id: string, data: Partial<Omit<FocusSession, keyof Models.Document>>) => updateDocument<FocusSession>(TABLES.FOCUS_SESSIONS, id, data),
    delete: (id: string) => deleteDocument(TABLES.FOCUS_SESSIONS, id),
};
