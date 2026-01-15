import { openDB } from 'idb';

const DB_NAME = 'math-whiz-db';
const STORE_NAME = 'questions';
const CURRICULUM_STORE = 'curriculum';
const VERSION = 2; // Bump version for new store

export const initDB = async () => {
    return openDB(DB_NAME, VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
                store.createIndex('grade', 'grade');
                store.createIndex('topic', 'topic');
                store.createIndex('used', 'used');
            }
            if (!db.objectStoreNames.contains(CURRICULUM_STORE)) {
                const store = db.createObjectStore(CURRICULUM_STORE, { keyPath: 'id', autoIncrement: true });
                store.createIndex('status', 'status'); // draft, assigned, completed
            }
        },
    });
};

export const saveQuestions = async (questions) => {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    // Add 'used: false' to all new questions
    for (const q of questions) {
        await store.add({ ...q, used: false, createdAt: Date.now() });
    }

    await tx.done;
    return questions.length;
};

export const getQuestions = async (grade, count = 5) => {
    const db = await initDB();
    // Get all unused questions for the grade
    // Note: optimization would be to usage a compound index or smarter query, but filter is fine for personal use
    const allQuestions = await db.getAllFromIndex(STORE_NAME, 'grade', grade);

    const available = allQuestions.filter(q => !q.used && (!q.difficulty || true)); // Add difficulty filter later if needed

    // Shuffle and slice
    const shuffled = available.sort(() => 0.5 - Math.random()).slice(0, count);

    return shuffled;
};

export const markAsUsed = async (ids) => {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    for (const id of ids) {
        const q = await store.get(id);
        if (q) {
            q.used = true;
            await store.put(q);
        }
    }
    await tx.done;
};

export const getStats = async () => {
    const db = await initDB();
    const all = await db.getAll(STORE_NAME);

    const stats = {
        total: all.length,
        used: all.filter(q => q.used).length,
        available: all.filter(q => !q.used).length,
        byGrade: {}
    };

    all.forEach(q => {
        if (!stats.byGrade[q.grade]) stats.byGrade[q.grade] = 0;
        stats.byGrade[q.grade]++;
    });

    return stats;
};

// --- Curriculum Methods ---

export const saveCurriculumSet = async (set) => {
    const db = await initDB();
    const tx = db.transaction(CURRICULUM_STORE, 'readwrite');
    // Ensure status is at least draft
    const newItem = {
        ...set,
        status: set.status || 'draft',
        createdAt: new Date().toISOString()
    };
    await tx.store.add(newItem);
    await tx.done;
};

export const getCurriculumSets = async (statusFilter = null) => {
    const db = await initDB();
    if (statusFilter) {
        return await db.getAllFromIndex(CURRICULUM_STORE, 'status', statusFilter);
    }
    return await db.getAll(CURRICULUM_STORE);
};

export const updateCurriculumStatus = async (id, status) => {
    const db = await initDB();
    const tx = db.transaction(CURRICULUM_STORE, 'readwrite');
    const store = tx.objectStore(CURRICULUM_STORE);
    const item = await store.get(id);
    if (item) {
        item.status = status;
        await store.put(item);
    }
    await tx.done;
};

export const deleteCurriculumSet = async (id) => {
    const db = await initDB();
    await db.delete(CURRICULUM_STORE, id);
};
