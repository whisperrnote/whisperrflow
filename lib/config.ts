function requiredEnv(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing environment variable: ${key}`);
    }
    return value;
}

export const APPWRITE_CONFIG = {
    ENDPOINT: requiredEnv("NEXT_PUBLIC_APPWRITE_ENDPOINT"),
    PROJECT_ID: requiredEnv("NEXT_PUBLIC_APPWRITE_PROJECT_ID"),
    DATABASE_ID: requiredEnv("NEXT_PUBLIC_APPWRITE_DATABASE_ID"),
    TABLES: {
        CALENDARS: requiredEnv("NEXT_PUBLIC_APPWRITE_TABLE_CALENDARS"),
        TASKS: requiredEnv("NEXT_PUBLIC_APPWRITE_TABLE_TASKS"),
        EVENTS: requiredEnv("NEXT_PUBLIC_APPWRITE_TABLE_EVENTS"),
        EVENT_GUESTS: requiredEnv("NEXT_PUBLIC_APPWRITE_TABLE_EVENT_GUESTS"),
        FOCUS_SESSIONS: requiredEnv("NEXT_PUBLIC_APPWRITE_TABLE_FOCUS_SESSIONS")
    },
    BUCKETS: {
        TASK_ATTACHMENTS: requiredEnv("NEXT_PUBLIC_APPWRITE_BUCKET_TASK_ATTACHMENTS"),
        EVENT_COVERS: requiredEnv("NEXT_PUBLIC_APPWRITE_BUCKET_EVENT_COVERS")
    }
};
