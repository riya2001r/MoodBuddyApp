// import React, { useEffect, useState } from 'react';
// import {
//     View,
//     Text,
//     Modal,
//     TextInput,
//     Button,
//     StyleSheet,
//     TouchableOpacity,
// } from 'react-native';
// import { Calendar, CalendarList } from 'react-native-calendars';
// import { getMoods, addMood } from '@/api/api';
// import { moodEmojiMap } from '@/utils/moodMap';
//
// interface MoodEntry {
//     id: number;
//     user_id: string;
//     mood: string;
//     note: string;
//     timestamp: string;
//     date: string; // assuming this is returned by the backend
// }
//
// interface CustomDateStyle {
//     selected?: boolean;
//     marked?: boolean;
//     selectedTextColor?: string;
//     selectedColor?: string;
//     textColor?: string;
//     dotColor?: string;
//     disabled?: boolean;
//     disabledTextColor?: string;
//     customText?: string; // Custom text to display emoji
// }
//
// interface MarkedDates {
//     [date: string]: CustomDateStyle;
// }
//
// const CalendarScreen: React.FC = () => {
//     const [selectedDate, setSelectedDate] = useState<string>('');
//     const [note, setNote] = useState<string>('');
//     const [mood, setMood] = useState<string>('');
//     const [moods, setMoods] = useState<MarkedDates>({});
//     const [modalVisible, setModalVisible] = useState<boolean>(false);
//
//     const userId = 'user1';
//
//     useEffect(() => {
//         fetchMoods().catch(console.error);
//     }, []);
//
//     const fetchMoods = async () => {
//         const today = new Date();
//         const res = await getMoods(userId, new Date(today.getFullYear(), today.getMonth(), 1).toISOString(), today.toISOString());
//         const mapped: MarkedDates = {};
//         (res as MoodEntry[]).forEach(entry => {
//             mapped[entry.date] = {
//                 marked: true,
//                 customText: moodEmojiMap[entry.mood].emoji, // Set the emoji as custom text
//                 selectedTextColor: moodEmojiMap[entry.mood].color,
//             };
//         });
//         setMoods(mapped);
//     };
//
//     const handleDayPress = (day: { dateString: string }) => {
//         setSelectedDate(day.dateString);
//         setModalVisible(true);
//     };
//
//     const handleSave = async () => {
//         await addMood({ userId, timestamp: selectedDate, mood, note });
//         setModalVisible(false);
//         await fetchMoods();
//         setNote('');
//         setMood('');
//     };
//
//     return (
//         <View style={{ flex: 1 }}>
//             <Calendar
//                 onDayPress={handleDayPress}
//                 markingType={'custom'}
//                 markedDates={moods}
//                 style={styles.calendar}
//                 theme={{
//                     selectedDayBackgroundColor: '#00adf5',
//                     todayTextColor: '#00adf5',
//                     dayTextColor: '#2d4150',
//                     textDisabledColor: '#dce4ee',
//                     dotColor: '#00adf5',
//                     selectedDotColor: '#ffffff',
//                     arrowColor: '#00adf5',
//                     monthTextColor: '#00adf5',
//                     textMonthFontSize: 16,
//                     textDayFontSize: 16,
//                     textDayHeaderFontSize: 16,
//                 }}
//                 renderDay={(day: { dateString: string | number; day: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }, isToday: any) => {
//                     const marked = moods[day.dateString]?.marked;
//                     const customText = moods[day.dateString]?.customText;
//                     return (
//                         <View style={[styles.dayContainer, marked && styles.markedDay]}>
//                             {customText ? (
//                                 <Text style={[styles.dayText, marked && { color: moods[day.dateString]?.selectedTextColor }]}>
//                                     {customText}
//                                 </Text>
//                             ) : (
//                                 <Text style={styles.dayText}>{day.day}</Text>
//                             )}
//                         </View>
//                     );
//                 }}
//             />
//
//             <Modal visible={modalVisible} transparent animationType="slide">
//                 <View style={styles.modalView}>
//                     <Text>Select Mood:</Text>
//                     {Object.keys(moodEmojiMap).map(m => (
//                         <TouchableOpacity
//                             key={m}
//                             onPress={() => setMood(m)}
//                             style={[
//                                 styles.moodOption,
//                                 mood === m && { backgroundColor: moodEmojiMap[m].color },
//                             ]}
//                         >
//                             <Text>{moodEmojiMap[m].emoji} {m}</Text>
//                         </TouchableOpacity>
//                     ))}
//                     <TextInput
//                         placeholder="Add a note..."
//                         style={styles.input}
//                         value={note}
//                         onChangeText={setNote}
//                     />
//                     <Button title="Save" onPress={handleSave} />
//                     <Button title="Cancel" onPress={() => setModalVisible(false)} />
//                 </View>
//             </Modal>
//         </View>
//     );
// };
//
// const styles = StyleSheet.create({
//     calendar: {
//         borderWidth: 1,
//         borderColor: '#e6e6e6',
//         borderRadius: 10,
//         marginHorizontal: 20,
//         marginTop: 20,
//     },
//     modalView: {
//         marginTop: 100,
//         backgroundColor: 'white',
//         padding: 20,
//         borderRadius: 10,
//         marginHorizontal: 20,
//     },
//     input: {
//         borderWidth: 1,
//         marginVertical: 10,
//         padding: 10,
//     },
//     moodOption: {
//         fontSize: 18,
//         marginVertical: 4,
//     },
//     dayContainer: {
//         width: 36,
//         height: 36,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     markedDay: {
//         backgroundColor: '#ccc',
//         borderRadius: 18,
//     },
//     dayText: {
//         fontSize: 16,
//         color: '#2d4150',
//     },
// });
//
// export default CalendarScreen;

// app/CalendarScreen.tsx
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import MoodCalendar from '@/components/MoodCalendar'; // use alias if you've configured it in tsconfig

export default function CalendarScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <MoodCalendar />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
