// components/MoodCalendar.tsx
// @ts-nocheck
import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    FlatList,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import Modal from 'react-native-modal';
import {format, eachDayOfInterval, subYears, startOfMonth, endOfMonth, subMonths} from 'date-fns';

type Mood = '😄' | '🙂' | '😐' | '😞' | '😡';

type MoodEntry = {
    id?: string;
    date: string;
    mood?: Mood;
    note?: string;
};

const moodToEmoji: Record<string, Mood> = {
    happy: '😄',
    good: '🙂',
    neutral: '😐',
    bad: '😞',
    awful: '😡',
};

const emojiToMood: Record<Mood, string> = {
    '😄': 'happy',
    '🙂': 'good',
    '😐': 'neutral',
    '😞': 'bad',
    '😡': 'awful'
};

const emojis: Mood[] = ['😄', '🙂', '😐', '😞', '😡'];

const MoodCalendar = () => {
    const [moodMap, setMoodMap] = useState<Record<string, MoodEntry>>({});
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [noteModalVisible, setNoteModalVisible] = useState(false);
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
    const [note, setNote] = useState('');
    const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [isEditingNote, setIsEditingNote] = useState(false);

    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');

    const dates = eachDayOfInterval({
        start: subYears(today, 5),
        end: today,
    }).reverse();

    useEffect(() => {
        fetchMoodData();
    }, [currentMonth]);

    const fetchMoodData = async () => {
        try {
            const startDate = format(subMonths(startOfMonth(currentMonth), 3), 'yyyy-MM-dd');
            const endDate = format(endOfMonth(currentMonth), 'yyyy-MM-dd');

            const response = await fetch(
                `http://localhost:3000/api/moods/filter?userId=user1&startDate=${startDate}&endDate=${endDate}`
            );
            const apiData = await response.json();

            const newEntries = apiData.reduce((acc: Record<string, MoodEntry>, entry: any) => {
                acc[entry.date] = {
                    id: entry.id,
                    date: entry.date,
                    mood: moodToEmoji[entry.mood],
                    note: entry.note
                };
                return acc;
            }, {});

            setMoodMap(prev => ({...prev, ...newEntries}));
        } catch (error) {
            console.error('Error fetching moods:', error);
        }
    };

    const isPastDate = (date: string) => new Date(date) < new Date(todayStr);
    const isFutureDate = (date: string) => new Date(date) > new Date(todayStr);

    const handleDayPress = (date: string) => {
        if (isFutureDate(date)) return;

        setNote('');
        setIsEditingNote(false);
        setSelectedMood(null);
        setSelectedDate(date);

        const entry = moodMap[date];
        if (entry?.mood) {
            setNote(entry.note || '');
            setNoteModalVisible(true);
        } else {
            setIsModalVisible(true);
        }
    };

    const handleDateSelect = (date: Date) => {
        const dateString = format(date, 'yyyy-MM-dd');
        setSelectedDate(dateString);
        setIsDatePickerVisible(false);
    };

    const handleMoodSelect = (mood: Mood) => {
        setSelectedMood(mood);
        setIsModalVisible(false);
        setNoteModalVisible(true);
        setIsEditingNote(true);
    };

    const createMoodEntry = async () => {
        if (!selectedDate || !selectedMood) return;

        try {
            const response = await fetch('http://localhost:3000/api/moods', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: 'user1',
                    mood: emojiToMood[selectedMood],
                    note: note,
                    timestamp: selectedDate
                })
            });

            if (!response.ok) throw new Error('Failed to create mood');
            await fetchMoodData();
        } catch (error) {
            console.error('Error creating mood:', error);
        }
    };

    const updateNote = async () => {
        if (!selectedDate || !moodMap[selectedDate]?.id) return;

        try {
            await fetch(`http://localhost:3000/api/moods/${moodMap[selectedDate].id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({note}),
            });
            await fetchMoodData();
        } catch (error) {
            console.error('Error updating note:', error);
        }
    };

    const saveMoodAndNote = async () => {
        if (!selectedDate) return;

        try {
            if (selectedMood) {
                await createMoodEntry();
            } else if (moodMap[selectedDate]?.id) {
                await updateNote();
            }

            setNote('');
            setSelectedMood(null);
            setIsModalVisible(false);
            setNoteModalVisible(false);
            setIsEditingNote(false);
        } catch (error) {
            console.error('Error saving mood:', error);
        }
    };

    const renderDay = (date: string, state: string) => {
        const entry = moodMap[date];
        const mood = entry?.mood;
        const past = isPastDate(date);
        const future = isFutureDate(date);
        const isOtherMonth = state === 'disabled';

        return (
            <TouchableOpacity
                onPress={() => handleDayPress(date)}
                disabled={future}
                style={styles.dayCell}
            >
                <Text style={[
                    styles.dayText,
                    (future || isOtherMonth) && styles.disabledText,
                    isOtherMonth && styles.otherMonthText
                ]}>
                    {String(new Date(date).getDate()).padStart(2, '0')}
                </Text>
                {mood ? (
                    <View style={styles.moodCircle}>
                        <Text style={styles.emoji}>{mood}</Text>
                    </View>
                ) : isOtherMonth ? null : past ? (
                    <Text style={styles.plusSign}>＋</Text>
                ) : (
                    <Text style={styles.placeholderEmoji}>⚪️</Text>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Calendar
                markingType="custom"
                dayComponent={({date, state}) => renderDay(date.dateString, state)}
                onMonthChange={(month) => setCurrentMonth(new Date(month.dateString))}
                theme={{
                    calendarBackground: '#fff',
                    textSectionTitleColor: '#333',
                    'stylesheet.calendar.main': {
                        week: {
                            marginTop: 0,
                            flexDirection: 'row',
                            justifyContent: 'space-around'
                        }
                    },
                    textDisabledColor: '#ccc',
                }}
                hideExtraDays={false}
            />

            <Modal isVisible={isModalVisible} onBackdropPress={() => setIsModalVisible(false)}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>How were you?</Text>
                    <TouchableOpacity onPress={() => setIsDatePickerVisible(true)}>
                        <Text style={styles.dateText}>{selectedDate}</Text>
                    </TouchableOpacity>
                    <FlatList
                        data={emojis}
                        horizontal
                        contentContainerStyle={styles.emojiList}
                        keyExtractor={(item) => item}
                        renderItem={({item}) => (
                            <TouchableOpacity style={styles.emojiOption} onPress={() => handleMoodSelect(item)}>
                                <Text style={styles.emoji}>{item}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </Modal>

            <Modal isVisible={noteModalVisible} onBackdropPress={() => {
                setNoteModalVisible(false);
                setIsEditingNote(false);
                setNote('');
            }}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>
                        {moodMap[selectedDate]?.mood ? 'Journal Entry' : 'Add a quick note'}
                    </Text>

                    <TextInput
                        style={styles.textInput}
                        value={note}
                        onChangeText={setNote}
                        placeholder="Write a note..."
                        multiline
                        editable={!moodMap[selectedDate]?.note || isEditingNote}
                    />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => {
                            setNoteModalVisible(false);
                            setIsEditingNote(false);
                            setNote('');
                        }}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.saveButton} onPress={saveMoodAndNote}>
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal isVisible={isDatePickerVisible} onBackdropPress={() => setIsDatePickerVisible(false)}>
                <View style={styles.datePickerModal}>
                    <Text style={styles.modalTitle}>Select a Date</Text>
                    <FlatList
                        data={dates}
                        keyExtractor={(date) => date.toISOString()}
                        renderItem={({item: date}) => {
                            const dateString = format(date, 'yyyy-MM-dd');
                            const isSelected = dateString === selectedDate;
                            return (
                                <TouchableOpacity
                                    style={[styles.dateItem, isSelected && styles.selectedDateItem]}
                                    onPress={() => handleDateSelect(date)}
                                >
                                    <Text style={styles.dateItemText}>
                                        {format(date, 'EEEE, MMMM do yyyy')}
                                    </Text>
                                    {moodMap[dateString]?.mood && (
                                        <Text style={styles.dateItemMood}>
                                            {moodMap[dateString].mood}
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            );
                        }}
                    />
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 10,
        borderRadius: 10,
        overflow: 'hidden',
    },
    dayCell: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
        width: '100%',
    },
    dayText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    disabledText: {
        color: '#ccc',
    },
    otherMonthText: {
        color: '#e0e0e0',
    },
    emoji: {
        fontSize: 26,
    },
    placeholderEmoji: {
        fontSize: 24,
        color: '#ccc',
    },
    plusSign: {
        fontSize: 26,
        color: '#ccc',
    },
    moodCircle: {
        backgroundColor: '#f1f1f1',
        borderRadius: 30,
        padding: 6,
        marginTop: 2,
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 15,
    },
    dateText: {
        marginBottom: 15,
        fontSize: 16,
        color: '#666',
        textDecorationLine: 'underline',
    },
    emojiList: {
        paddingHorizontal: 16,
    },
    emojiOption: {
        paddingHorizontal: 8,
    },
    textInput: {
        width: '100%',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
        marginBottom: 20,
        textAlignVertical: 'top',
        minHeight: 80,
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    },
    cancelButton: {
        backgroundColor: '#eee',
        padding: 12,
        borderRadius: 10,
        width: '45%',
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: '#007bff',
        padding: 12,
        borderRadius: 10,
        width: '45%',
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#333',
        fontWeight: 'bold',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    datePickerModal: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 20,
        maxHeight: '80%',
    },
    dateItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectedDateItem: {
        backgroundColor: '#e3f2fd',
    },
    dateItemText: {
        fontSize: 16,
        color: '#333',
    },
    dateItemMood: {
        fontSize: 24,
    },
});

export default MoodCalendar;