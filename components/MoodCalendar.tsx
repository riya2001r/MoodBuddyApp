// MoodCalendar.tsx
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
    StatusBar,
    Dimensions,
    Alert, // For iOS
    Animated, ScrollView,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import Modal from 'react-native-modal';
import {format, eachDayOfInterval, subYears, startOfMonth, endOfMonth, subMonths, isToday} from 'date-fns';
import styles from '../assets/MoodCalendarStyles';
import EmojiSVG from './EmojiSVG';
import * as moodApi from '../api/api';
import {GestureHandlerRootView, PanGestureHandler} from 'react-native-gesture-handler';

// Define types for moods
export type Mood = '😲' | '😢' | '😐' | '😀' | '😨' | '🤢' | '😠';

const emojis: Mood[] = ['😲', '😢', '😐', '😀', '😨', '🤢', '😠'];

// Function to show toast message across platforms
const showToast = (message: string) => {
    if (Platform.OS === 'android') {
        // Android native toast
        ToastAndroid.show(message, ToastAndroid.SHORT);
    } else if (Platform.OS === 'ios') {
        // iOS alert as toast alternative
        Alert.alert('', message, [{text: 'OK'}], {cancelable: true});
    } else {
        // For Web (Testing)
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
    const [moodMap, setMoodMap] = useState<Record<string, moodApi.MoodEntry>>({});
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [noteModalVisible, setNoteModalVisible] = useState(false);
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
    const [note, setNote] = useState('');
    const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [isEditingNote, setIsEditingNote] = useState(false);
    const [showEntryListPage, setShowEntryListPage] = useState(false);
    const [entries, setEntries] = useState<moodApi.MoodEntry[]>([]);
    const [emojiScale] = useState(new Animated.Value(1));

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

            const newEntries = await moodApi.fetchMoodData(startDate, endDate);
            setMoodMap(prev => ({...prev, ...newEntries}));
        } catch (error) {
            showToast('Something went wrong!!!');
        }
    };

    const isPastDate = (dateString: string): boolean => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to beginning of the day

        const checkDate = new Date(dateString);
        checkDate.setHours(0, 0, 0, 0);

        return checkDate < today;
    };

    const isFutureDate = (dateString: string): boolean => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to beginning of the day

        const checkDate = new Date(dateString);
        checkDate.setHours(0, 0, 0, 0);

        return checkDate > today;
    };

    // Handle click on any date cell (background)
    const handleDayPress = (date: string) => {
        if (isFutureDate(date)) return;

        setSelectedDate(date);

        const entry = moodMap[date];
        if (entry?.mood) {
            // If this date already has a mood entry, show its details
            setNote(entry.note || '');
            setSelectedMood(entry.mood);
            setIsEditingNote(true);
            setShowEntryListPage(true);
        } else {
            // If this date doesn't have a mood yet, open the mood selection modal
            setNote('');
            setSelectedMood(null);
            setIsEditingNote(false);
            setIsModalVisible(true);
        }
    };

    const handleEmojiPress = (date: string) => {
        if (isFutureDate(date)) return;

        const entry = moodMap[date];
        if (entry?.mood) {
            setSelectedDate(date);

            setNote(entry.note || '');
            setSelectedMood(entry.mood);

            setIsEditingNote(true);
            setShowEntryListPage(true);
        }
    };

    const handleDateSelect = (date: Date) => {
        const dateString = format(date, 'yyyy-MM-dd');
        setSelectedDate(dateString);
        setIsDatePickerVisible(false);
    };

    const handleMoodSelect = (mood: Mood) => {
        Animated.sequence([
            Animated.timing(emojiScale, {toValue: 1.2, duration: 150, useNativeDriver: true}),
            Animated.timing(emojiScale, {toValue: 1, duration: 150, useNativeDriver: true})
        ]).start();

        setSelectedMood(mood);
        setIsModalVisible(false);

        setTimeout(() => {
            setNoteModalVisible(true);
            setIsEditingNote(false);
        }, 300);
    };

    const handleEntryPress = (entry: moodApi.MoodEntry) => {
        setSelectedDate(entry.date);
        setNote(entry.note || '');
        setSelectedMood(entry.mood || null);
        setNoteModalVisible(true);
        setIsEditingNote(true);
    };

    const saveMoodAndNote = async () => {
        if (!selectedDate) return;

        try {
            if (selectedMood && !moodMap[selectedDate]?.id) {
                await moodApi.createMoodEntry(selectedDate, selectedMood, note);
            } else if (moodMap[selectedDate]?.id) {
                await moodApi.updateNote(moodMap[selectedDate].id!, note);

                // Immediately update the local state for better UI response
                const updatedEntry = {
                    ...moodMap[selectedDate],
                    note: note
                };

                // Update the moodMap with the new note
                setMoodMap(prev => ({
                    ...prev,
                    [selectedDate]: updatedEntry
                }));

                // Update entries array if we're viewing the entry list
                if (showEntryListPage) {
                    setEntries([updatedEntry]);
                }
            }

            // Now fetch the latest data from API to ensure everything is synced
            await fetchMoodData();

            setNoteModalVisible(false);

            // Show success message
            showToast(moodMap[selectedDate]?.id ? 'Note updated successfully!' : 'Mood saved successfully!');

            // Keep the note value in the state if we're staying on the same page
            if (!showEntryListPage) {
                setNote('');
                setSelectedMood(null);
                setIsEditingNote(false);
            }
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

    // Day cell rendering with clickable emoji
    const renderDay = (date: string, state: string) => {
        const entry = moodMap[date];
        const mood = entry?.mood;
        const past = isPastDate(date);
        const future = isFutureDate(date);
        const isOtherMonth = state === 'disabled';

        // Track if emoji was pressed to prevent double event firing
        const emojiPressedRef = React.useRef(false);

        return (
            <TouchableOpacity
                onPress={() => {
                    // Only process the day press if emoji wasn't pressed
                    if (!emojiPressedRef.current) {
                        handleDayPress(date);
                    }
                    // Reset the ref for next press
                    emojiPressedRef.current = false;
                }}
                disabled={future}
                style={styles.dayCell}
                activeOpacity={0.7}
            >
                {mood ? (
                    <View style={{
                        height: 36,
                        width: 36,
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 5,
                        marginBottom: 10
                    }}>
                        <TouchableOpacity
                            onPress={() => {
                                // Mark that emoji was pressed
                                emojiPressedRef.current = true;
                                // Add slight delay to ensure parent's onPress doesn't fire
                                setTimeout(() => {
                                    handleEmojiPress(date);
                                }, 10);
                            }}
                            style={{
                                padding: 8,
                                borderRadius: 20,
                                backgroundColor: 'transparent',
                            }}
                            activeOpacity={0.6}
                            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                        >
                            <EmojiSVG
                                type={mood}
                                size={36}
                                style={isOtherMonth ? {opacity: 0.5} : {}}
                                animated={false}
                            />
                        </TouchableOpacity>
                    </View>
                ) : future ? (
                    <View style={{height: 36, marginBottom: 10}}>
                        <Text style={styles.plusCircle}></Text>
                    </View>
                ) : past ? (
                    <TouchableOpacity
                        style={[styles.plusCircle, {marginBottom: 10}]}
                        onPress={() => {
                            // Mark that plus was pressed
                            emojiPressedRef.current = true;
                            setTimeout(() => {
                                handleDayPress(date);
                            }, 10);
                        }}
                        activeOpacity={0.7}
                    >
                        <Text style={[
                            styles.plusSign,
                            isOtherMonth && styles.otherMonthPlus
                        ]}>＋</Text>
                    </TouchableOpacity>
                ) : null}

                <Text style={[
                    styles.dayText,
                    (future || isOtherMonth) && styles.disabledText,
                    isOtherMonth && styles.otherMonthText
                ]}>
                    {String(new Date(date).getDate()).padStart(2, '0')}
                </Text>
            </TouchableOpacity>
        );
    };

    const renderEntryItem = ({item}: { item: moodApi.MoodEntry }) => {
        return (
            <TouchableOpacity
                style={styles.entryItem}
                onPress={() => handleEntryPress(item)}
                activeOpacity={0.7}
            >
                <View style={styles.journalTable}>
                    <View style={styles.journalRow}>
                        <View style={styles.journalEmoticonCell}>
                            <EmojiSVG type={item.mood} size={40} animated={true}/>
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
        return (
            <View style={styles.container}>
                <Text style={[
                    styles.pageTitle,
                    Platform.OS === 'android' && { paddingTop: StatusBar.currentHeight || 20 }
                ]}>Mood Calendar</Text>
                <View style={styles.calendarWrapper}>
                    <Calendar
                        markingType="custom"
                        dayComponent={({date, state}: { date: any, state: any }) => renderDay(date.dateString, state)}
                        onMonthChange={(month: {
                            dateString: string | number | Date;
                        }) => setCurrentMonth(new Date(month.dateString))}
                        theme={{
                            calendarBackground: '#ffffff',
                            textSectionTitleColor: '#000000',
                            textDayFontColor: '#000000',
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
                                    paddingTop: 15,
                                    backgroundColor: '#ffffff',
                                },
                                dayHeader: {
                                    color: '#000000',
                                    fontWeight: '600',
                                    marginTop: 10,
                                    marginBottom: 10,
                                    fontSize: 14
                                }
                            },
                            'stylesheet.calendar.main': {
                                week: {
                                    marginVertical: 2,
                                    flexDirection: 'row',
                                    justifyContent: 'space-around',
                                    backgroundColor: '#ffffff',
                                }
                            },
                            textDisabledColor: '#90a4ae',
                            arrowColor: '#1976d2',
                        }}
                        hideExtraDays={false}
                        style={{height: 'auto'}}
                    />
                </View>
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
                            <ScrollView
                                contentContainerStyle={[
                                    styles.emojiList,
                                    {
                                        flexDirection: 'row',
                                        flexWrap: 'wrap',
                                        justifyContent: 'center',
                                    }
                                ]}
                                showsVerticalScrollIndicator={false}
                            >
                                {emojis.map((item) => (
                                    <Animated.View
                                        key={item}
                                        style={{
                                            transform: [{scale: emojiScale}],
                                            margin: Dimensions.get('window').width < 375 ? 4 : 6,
                                            // Adjust width based on screen size for better responsiveness
                                            width: Dimensions.get('window').width < 375 ?
                                                (Dimensions.get('window').width / 4 - 20) :
                                                (Dimensions.get('window').width / 5 - 20)
                                        }}
                                    >
                                        <TouchableOpacity
                                            style={[
                                                styles.emojiOption,
                                                Dimensions.get('window').width < 375 && styles.emojiOptionSmall
                                            ]}
                                            onPress={() => handleMoodSelect(item)}
                                            activeOpacity={0.7}
                                        >
                                            <EmojiSVG
                                                type={item}
                                                size={Dimensions.get('window').width < 375 ? 38 : 45}
                                            />
                                        </TouchableOpacity>
                                    </Animated.View>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </Modal>

                <Modal
                    isVisible={noteModalVisible}
                    onBackdropPress={() => {
                        setNoteModalVisible(false);
                        setTimeout(() => {
                            setIsEditingNote(false);
                            setNote('');
                        }, 300);
                    }}
                    style={styles.bottomModal}
                    swipeDirection={['down']}
                    onSwipeComplete={() => {
                        setNoteModalVisible(false);
                        setTimeout(() => {
                            setIsEditingNote(false);
                            setNote('');
                        }, 300);
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
                                    setTimeout(() => {
                                        setIsEditingNote(false);
                                        setNote('');
                                    }, 300);
                                }}
                                style={styles.closeButtonContainer}
                            >
                                <Text style={styles.closeButton}>×</Text>
                            </TouchableOpacity>
                        </View>

                        {selectedMood && (
                            <View style={styles.selectedMoodContainer}>
                                <EmojiSVG type={selectedMood} size={40} animated={true}/>
                            </View>
                        )}

                        <TextInput
                            style={styles.compactTextInput}
                            value={note}
                            onChangeText={setNote}
                            placeholder="Write a note..."
                            multiline
                        />

                        <View style={styles.buttonContainer}>
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
                                            <EmojiSVG type={moodMap[dateString].mood} size={30}/>
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
        <GestureHandlerRootView style={{flex: 1}}>
            <PanGestureHandler
                onGestureEvent={(event) => {
                    // Only trigger on right-to-left swipe with sufficient distance
                    if (event.nativeEvent.translationX > 100) {
                        setShowEntryListPage(false);
                    }
                }}
            >
                <SafeAreaView style={styles.entryListContainer}>
                    {/* Add status bar padding for Android */}
                    <View style={[
                        styles.entryListHeader,
                        Platform.OS === 'android' && {paddingTop: StatusBar.currentHeight || 20}
                    ]}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => setShowEntryListPage(false)}
                            hitSlop={{top: 15, bottom: 15, left: 15, right: 15}}
                        >
                            <Text style={styles.backButtonText}>← Back</Text>
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
                            setTimeout(() => {
                                setIsEditingNote(false);
                                setNote('');
                            }, 300);
                        }}
                        style={styles.bottomModal}
                        swipeDirection={['down']}
                        onSwipeComplete={() => {
                            setNoteModalVisible(false);
                            setTimeout(() => {
                                setIsEditingNote(false);
                                setNote('');
                            }, 300);
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
                                        setTimeout(() => {
                                            setIsEditingNote(false);
                                            setNote('');
                                        }, 300);
                                    }}
                                    style={styles.closeButtonContainer}
                                >
                                    <Text style={styles.closeButton}>×</Text>
                                </TouchableOpacity>
                            </View>

                            {entries[0]?.mood && (
                                <View style={styles.selectedMoodContainer}>
                                    <EmojiSVG type={entries[0].mood} size={40} animated={true}/>
                                </View>
                            )}

                            <TextInput
                                style={styles.compactTextInput}
                                value={note}
                                onChangeText={setNote}
                                placeholder="Write a note..."
                                multiline
                            />

                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.saveButton} onPress={saveMoodAndNote}>
                                    <Text style={styles.saveButtonText}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </SafeAreaView>
            </PanGestureHandler>
        </GestureHandlerRootView>
    );
};

export default MoodCalendar;
