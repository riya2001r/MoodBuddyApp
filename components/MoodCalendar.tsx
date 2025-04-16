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
import {format, eachDayOfInterval, startOfDay, subYears, startOfMonth, endOfMonth, subMonths, isToday} from 'date-fns';

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

    const getModalTitle = () => {
        if (!selectedDate) return 'How were you?';
        return isToday(new Date(selectedDate)) ? 'How are you?' : 'How were you?';
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
                        <View style={styles.emojiContainer}>
                            <Text style={[
                                styles.emojiShadow,
                                styles.emoji,
                                isOtherMonth && styles.otherMonthEmoji
                            ]}>{mood}</Text>
                            <Text style={[
                                styles.emojiBase,
                                styles.emoji,
                                isOtherMonth && styles.otherMonthEmoji
                            ]}>{mood}</Text>
                        </View>
                    </View>
                ) : future ? (
                    <View style={styles.placeholderContainer}>
                        <Text style={[
                            styles.placeholderEmoji,
                            styles.emojiShadow
                        ]}>⚪️</Text>
                    </View>
                ) : past ? (
                    <View style={styles.plusContainer}>
                        <Text style={[
                            styles.plusSign,
                            styles.plusSignShadow,
                            isOtherMonth && styles.otherMonthPlus
                        ]}>＋</Text>
                        <Text style={[
                            styles.plusSign,
                            isOtherMonth && styles.otherMonthPlus
                        ]}>＋</Text>
                    </View>
                ) : null}
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

            <Modal isVisible={isModalVisible}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{getModalTitle()}</Text>
                        <TouchableOpacity
                            onPress={() => setIsModalVisible(false)}
                            style={styles.closeButtonContainer}
                        >
                            <Text style={styles.closeButton}>×</Text>
                        </TouchableOpacity>
                    </View>
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
                                <View style={styles.emojiContainer}>
                                    <Text style={[styles.emoji, styles.emojiShadow]}>{item}</Text>
                                    <Text style={[styles.emoji, styles.emojiBase]}>{item}</Text>
                                </View>
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
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>
                            {moodMap[selectedDate]?.mood ? 'Journal Entry' : 'Add a quick note'}
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                setNoteModalVisible(false);
                                setIsEditingNote(false);
                                setNote('');
                            }}
                            style={styles.closeButtonContainer}
                        >
                            <Text style={styles.closeButton}>×</Text>
                        </TouchableOpacity>
                    </View>

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

            <Modal isVisible={isDatePickerVisible}>
                <View style={styles.datePickerModal}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Select a Date</Text>
                        <TouchableOpacity
                            onPress={() => setIsDatePickerVisible(false)}
                            style={styles.closeButtonContainer}
                        >
                            <Text style={styles.closeButton}>×</Text>
                        </TouchableOpacity>
                    </View>
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
                                        <View style={styles.emojiContainer}>
                                            <Text style={[styles.dateItemMood, styles.emojiShadow]}>
                                                {moodMap[dateString].mood}
                                            </Text>
                                            <Text style={styles.dateItemMood}>
                                                {moodMap[dateString].mood}
                                            </Text>
                                        </View>
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
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: 72,
        width: '100%',
        paddingTop: 8,
    },
    dayText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 10,
    },
    disabledText: {
        color: '#ccc',
    },
    otherMonthText: {
        color: '#e0e0e0',
    },
    moodCircle: {
        backgroundColor: '#f1f1f1',
        borderRadius: 20,
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 8,
        borderWidth: 2,
        borderTopColor: '#fff',
        borderLeftColor: '#fff',
        borderRightColor: '#ccc',
        borderBottomColor: '#ccc',
    },
    emojiContainer: {
        position: 'relative',
    },
    emoji: {
        fontSize: 20,
        lineHeight: 36,
    },
    emojiBase: {
        position: 'relative',
        top: -1,
        left: -1,
    },
    emojiShadow: {
        position: 'absolute',
        color: 'rgba(0,0,0,0.15)',
        top: 1,
        left: 1,
    },
    otherMonthEmoji: {
        color: '#e0e0e0',
    },
    placeholderContainer: {
        width: 38,
        height: 38,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderEmoji: {
        fontSize: 32,
        color: '#ccc',
    },
    plusContainer: {
        width: 38,
        height: 38,
        justifyContent: 'center',
        alignItems: 'center',
    },
    plusSign: {
        fontSize: 26,
        color: '#ccc',
        lineHeight: 42,
        position: 'relative',
        top: -1,
        left: -1,
    },
    plusSignShadow: {
        position: 'absolute',
        color: 'rgba(0,0,0,0.15)',
        top: 1,
        left: 1,
    },
    otherMonthPlus: {
        color: '#e0e0e0',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 20,
        alignItems: 'center',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginBottom: 15,
        position: 'relative',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
    },
    closeButtonContainer: {
        position: 'absolute',
        right: 0,
    },
    closeButton: {
        fontSize: 28,
        color: '#666',
        paddingHorizontal: 10,
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