import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

const CalendarScreen = () => {
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    const marked = {
      '2025-04-08': { marked: true, dotColor: 'green' },
      '2025-04-07': { marked: true, dotColor: 'blue' },
      '2025-04-06': { marked: true, dotColor: 'red' },
    };
    setMarkedDates(marked);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mood Tracker Calendar</Text>
      <Calendar
        markedDates={markedDates}
        theme={{
          selectedDayBackgroundColor: '#00adf5',
          todayTextColor: '#00adf5',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default CalendarScreen;
