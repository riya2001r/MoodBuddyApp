// api.ts
import { Mood } from '@/components/MoodCalendar';

const API_URL = process.env.BACKEND_API_URL || 'http://localhost:3000/api';

export type MoodEntry = {
    id?: string;
    date: string;
    mood?: Mood;
    note?: string;
};

export const emojiToMood: Record<Mood, string> = {
    '😲': 'surprise',
    '😢': 'sad',
    '😐': 'neutral',
    '😀': 'happy',
    '😨': 'fear',
    '🤢': 'disgust',
    '😠': 'angry'
};

export const moodToEmoji: Record<string, Mood> = {
    surprise: '😲',
    sad: '😢',
    neutral: '😐',
    happy: '😀',
    fear: '😨',
    disgust: '🤢',
    angry: '😠'
};

// Fetch mood data for a date range
export const fetchMoodData = async (startDate: string, endDate: string): Promise<Record<string, MoodEntry>> => {
    try {
        const response = await fetch(
            `${API_URL}/moods/filter?userId=user1&startDate=${startDate}&endDate=${endDate}`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch mood data');
        }

        const apiData = await response.json();

        return apiData.reduce((acc: Record<string, MoodEntry>, entry: any) => {
            acc[entry.date] = {
                id: entry.id,
                date: entry.date,
                mood: moodToEmoji[entry.mood],
                note: entry.note
            };
            return acc;
        }, {});
    } catch (error) {
        console.error('Error fetching moods:', error);
        throw error;
    }
};

// Create a new mood entry
export const createMoodEntry = async (
    date: string,
    mood: Mood,
    note: string
): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/moods`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: 'user1',
                mood: emojiToMood[mood],
                note: note,
                timestamp: date
            })
        });

        if (!response.ok) {
            throw new Error('Failed to create mood');
        }
    } catch (error) {
        console.error('Error creating mood:', error);
        throw error;
    }
};

// Update an existing mood entry's note
export const updateNote = async (
    entryId: string,
    note: string
): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/moods/${entryId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ note }),
        });

        if (!response.ok) {
            throw new Error('Failed to update note');
        }
    } catch (error) {
        console.error('Error updating note:', error);
        throw error;
    }
};