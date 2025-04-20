// @ts-ignore
import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    FlatList,
    SafeAreaView,
    ToastAndroid, // For Android
    Platform,
    Alert, // For iOS
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import Modal from 'react-native-modal';
import {format, eachDayOfInterval, startOfDay, subYears, startOfMonth, endOfMonth, subMonths, isToday} from 'date-fns';
import styles from '../assets/MoodCalendarStyles';

type Mood = '😲' | '😢' | '😐' | '😀' | '😨' | '🤢' | '😠';

type MoodEntry = {
    id?: string;
    date: string;
    mood?: Mood;
    note?: string;
};

const moodToEmoji: Record<string, Mood> = {
    surprise: '😲',
    sad: '😢',
    neutral: '😐',
    happy: '😀',
    fear: '😨',
    disgust: '🤢',
    angry: '😠'
};

const emojiToMood: Record<Mood, string> = {
    '😲': 'surprise',
    '😢': 'sad',
    '😐': 'neutral',
    '😀': 'happy',
    '😨': 'fear',
    '🤢': 'disgust',
    '😠': 'angry'
};

const emojis: Mood[] = ['😲', '😢', '😐', '😀', '😨', '🤢', '😠'];

// Function to show toast message across platforms
// Cross-platform toast function that works on Android, iOS, and Web
const showToast = (message: string) => {
    if (Platform.OS === 'android') {
        // Android native toast
        ToastAndroid.show(message, ToastAndroid.SHORT);
    } else if (Platform.OS === 'ios') {
        // iOS alert as toast alternative
        Alert.alert('', message, [{text: 'OK'}], {cancelable: true});
    } else {
        // Web implementation - create a temporary div element
        const webToast = document.createElement('div');
        webToast.innerText = message;
        webToast.style.position = 'fixed';
        webToast.style.bottom = '60px';
        webToast.style.left = '50%';
        webToast.style.transform = 'translateX(-50%)';
        webToast.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        webToast.style.color = 'white';
        webToast.style.padding = '12px 24px';
        webToast.style.borderRadius = '4px';
        webToast.style.fontSize = '16px';
        webToast.style.zIndex = '9999';

        document.body.appendChild(webToast);

        // Remove the toast after 2 seconds
        setTimeout(() => {
            if (document.body.contains(webToast)) {
                document.body.removeChild(webToast);
            }
        }, 2000);
    }
};

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
    const [showEntryListPage, setShowEntryListPage] = useState(false);
    const [entries, setEntries] = useState<MoodEntry[]>([]);

    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');

    const dates = eachDayOfInterval({
        start: subYears(today, 5),
        end: today,
    }).reverse();

    useEffect(() => {
        fetchMoodData();
    }, [currentMonth]);

    useEffect(() => {
        if (showEntryListPage && selectedDate) {
            // Filter entries for selected date only
            const entryForSelectedDate = moodMap[selectedDate] ? [moodMap[selectedDate]] : [];
            setEntries(entryForSelectedDate);
        }
    }, [showEntryListPage, selectedDate, moodMap]);

    const fetchMoodData = async () => {
        try {
            const startDate = format(subMonths(startOfMonth(currentMonth), 3), 'yyyy-MM-dd');
            const endDate = format(endOfMonth(currentMonth), 'yyyy-MM-dd');

            const response = await fetch(
                `http://localhost:3000/api/moods/filter?userId=user1&startDate=${startDate}&endDate=${endDate}`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch mood data');
            }

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
            showToast('Something went wrong!!!');
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
            // Go to list view for this specific date
            setShowEntryListPage(true);
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

    const handleEntryPress = (entry: MoodEntry) => {
        setSelectedDate(entry.date);
        setNote(entry.note || '');
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

            if (!response.ok) {
                throw new Error('Failed to create mood');
            }

            await fetchMoodData();
        } catch (error) {
            console.error('Error creating mood:', error);
            showToast('Something went wrong!!!');
        }
    };

    const updateNote = async () => {
        if (!selectedDate || !moodMap[selectedDate]?.id) return;

        try {
            const response = await fetch(`http://localhost:3000/api/moods/${moodMap[selectedDate].id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({note}),
            });

            if (!response.ok) {
                throw new Error('Failed to update note');
            }

            await fetchMoodData();
        } catch (error) {
            console.error('Error updating note:', error);
            showToast('Something went wrong!!!');
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
            showToast('Something went wrong!!!');
        }
    };

    const getModalTitle = () => {
        if (!selectedDate) return 'How were you?';
        return isToday(new Date(selectedDate)) ? 'How are you?' : 'How were you?';
    };

    const formatDateForDisplay = (date: string) => {
        if (!date) return '';
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) return '';

        return isToday(dateObj)
            ? `Today, ${format(dateObj, 'MMMM d')}`
            : `${format(dateObj, 'EEEE')}, ${format(dateObj, 'MMMM d')}`;
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

    const renderEntryItem = ({item}: { item: MoodEntry }) => {
        return (
            <TouchableOpacity
                style={styles.entryItem}
                onPress={() => handleEntryPress(item)}
                activeOpacity={0.7}
            >
                <View style={styles.journalTable}>
                    <View style={styles.journalRow}>
                        <View style={styles.journalEmoticonCell}>
                            <Text style={styles.journalEmoticonText}>
                                {item.mood}
                            </Text>
                        </View>
                        <View style={styles.journalInfoCell}>
                            <Text style={styles.journalDateText}>
                                {formatDateForDisplay(item.date)}
                            </Text>
                            <Text
                                style={styles.journalNoteText}
                                numberOfLines={2}
                                ellipsizeMode="tail"
                            >
                                {item.note}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    // Main calendar view
    if (!showEntryListPage) {
        // @ts-ignore
        return (
            <View style={styles.container}>
                <Calendar
                    markingType="custom"
                    dayComponent={({date, state}: { date: any, state: any }) => renderDay(date.dateString, state)}
                    onMonthChange={(month: {
                        dateString: string | number | Date;
                    }) => setCurrentMonth(new Date(month.dateString))}
                    theme={{
                        calendarBackground: '#e3f2fd',
                        textSectionTitleColor: '#1976d2',
                        textMonthFontFamily: 'Roboto',
                        textMonthFontSize: 20,
                        textMonthFontWeight: 'bold',
                        textMonthFontColor: '#0d47a1',
                        'stylesheet.calendar.header': {
                            header: {
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: 10,
                                backgroundColor: '#bbdefb',
                                marginBottom: 10,
                            },
                        },
                        'stylesheet.calendar.main': {
                            week: {
                                marginTop: 0,
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                                backgroundColor: '#e3f2fd',
                            }
                        },
                        textDisabledColor: '#90a4ae',
                        arrowColor: '#1976d2',
                    }}
                    hideExtraDays={false}
                />

                <Modal
                    isVisible={isModalVisible}
                    onBackdropPress={() => setIsModalVisible(false)}
                    style={styles.bottomModal}
                    swipeDirection={['down']}
                    onSwipeComplete={() => setIsModalVisible(false)}
                >
                    <View style={styles.compactModalContent}>
                        <View style={styles.dragIndicator}/>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{getModalTitle()}</Text>
                            <TouchableOpacity
                                onPress={() => setIsModalVisible(false)}
                                style={styles.closeButtonContainer}
                            >
                                <Text style={styles.closeButton}>×</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            onPress={() => setIsDatePickerVisible(true)}
                            style={styles.dateContainer}
                        >
                            <Text style={styles.dateText}>{selectedDate}</Text>
                        </TouchableOpacity>
                        <View style={styles.centeredContent}>
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
                    </View>
                </Modal>

                <Modal
                    isVisible={noteModalVisible}
                    onBackdropPress={() => {
                        setNoteModalVisible(false);
                        setIsEditingNote(false);
                        setNote('');
                    }}
                    style={styles.bottomModal}
                    swipeDirection={['down']}
                    onSwipeComplete={() => {
                        setNoteModalVisible(false);
                        setIsEditingNote(false);
                        setNote('');
                    }}
                >
                    <View style={styles.compactModalContent}>
                        <View style={styles.dragIndicator}/>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                Edit Note
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
                            style={styles.compactTextInput}
                            value={note}
                            onChangeText={setNote}
                            placeholder="Write a note..."
                            multiline
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
    }

    // Entry list page for selected date only
    return (
        <SafeAreaView style={styles.entryListContainer}>
            <View style={styles.entryListHeader}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => setShowEntryListPage(false)}
                >
                    <Text style={styles.backButtonText}>← Calendar</Text>
                </TouchableOpacity>
                <Text style={styles.entryListTitle}>
                    {format(selectedDate || '', 'EEEE, MMMM do yyyy')}
                </Text>
                <View style={styles.placeholder}/>
            </View>

            <FlatList
                data={entries}
                renderItem={renderEntryItem}
                keyExtractor={(item) => item.date}
                contentContainerStyle={styles.entryListContent}
                ItemSeparatorComponent={() => <View style={styles.entrySeparator}/>}
                ListEmptyComponent={
                    <View style={styles.journalTable}>
                        <Text style={{textAlign: 'center', padding: 20, color: '#7f8c8d'}}>
                            No entry for this date
                        </Text>
                    </View>
                }
            />

            <Modal
                isVisible={noteModalVisible}
                onBackdropPress={() => {
                    setNoteModalVisible(false);
                    setIsEditingNote(false);
                    setNote('');
                }}
                style={styles.bottomModal}
                swipeDirection={['down']}
                onSwipeComplete={() => {
                    setNoteModalVisible(false);
                    setIsEditingNote(false);
                    setNote('');
                }}
            >
                <View style={styles.compactModalContent}>
                    <View style={styles.dragIndicator}/>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>
                            {isEditingNote ? 'Edit Note' : 'Add a quick note'}
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
                        style={styles.compactTextInput}
                        value={note}
                        onChangeText={setNote}
                        placeholder="Write a note..."
                        multiline
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
        </SafeAreaView>
    );
};

export default MoodCalendar;