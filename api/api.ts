import axios, {AxiosError, AxiosResponse} from 'axios';

const BASE_URL = 'http://localhost:3000/api';

// Generic error handling function
const handleError = (error: unknown): never => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
            throw new Error(`Error: ${axiosError.response.statusText}`);
        } else if (axiosError.request) {
            throw new Error('Error: No response received from the server');
        } else {
            throw new Error('Error: ' + axiosError.message);
        }
    } else {
        throw new Error('Unexpected error: ' + (error as Error).message);
    }
};


export interface MoodEntry {
    id: number;
    user_id: string;
    mood: string;
    note: string;
    timestamp: string;
    date: string; // Assuming this is returned by the backend
}

export interface MonthlyStatsEntry {
    month: number;
    year: number;
    mood: string;
    count: number;
}

export const getMoods = async (userId: string, start?: string, end?: string): Promise<MoodEntry[]> => {
    const params: Record<string, string> = {userId};
    if (start && end) {
        params.startDate = start;
        params.endDate = end;
    }

    try {
        const response: AxiosResponse<MoodEntry[]> = await axios.get(`${BASE_URL}/moods/filter`, {params});
        if (response.status !== 200) {
            throw new Error(`Error: ${response.statusText}`);
        }
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

export const addMood = async ({userId, timestamp, mood, note}: Record<string, string>): Promise<void> => {
    try {
        const response: AxiosResponse = await axios.post(`${BASE_URL}/moods/`, {
            userId,
            timestamp,
            mood,
            note,
        });
        if (response.status !== 201) {
            throw new Error(`Error: ${response.statusText}`);
        }
    } catch (error) {
        handleError(error);
    }
};

export const getMonthlyStats = async (userId: string): Promise<MonthlyStatsEntry[]> => {
    try {
        const response: AxiosResponse<MonthlyStatsEntry[]> = await axios.get(`${BASE_URL}/stats/monthly?userId=${userId}`);
        if (response.status !== 200) {
            throw new Error(`Error: ${response.statusText}`);
        }
        console.log(response?.data)
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};
