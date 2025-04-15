// import React, {useEffect, useState} from 'react';
// import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';
// import {BarChart, LineChart} from 'react-native-chart-kit';
// import {getMoods, getMonthlyStats, MoodEntry, MonthlyStatsEntry} from '@/api/api';
// import {moodEmojiMap} from '@/utils/moodMap';
// import dayjs from 'dayjs';
//
// interface MoodStats {
//     [key: string]: number;
// }
//
// const StatsScreen: React.FC = () => {
//     const [moodStats, setMoodStats] = useState<MoodStats>({});
//     const [lineChartData, setLineChartData] = useState<{ labels: string[]; datasets: any[] }>({
//         labels: [],
//         datasets: []
//     });
//     const [barChartData, setBarChartData] = useState<{ labels: string[]; datasets: any[] }>({labels: [], datasets: []});
//     const [error, setError] = useState<string | null>(null);
//
//     const user_id = 'user1';
//
//     useEffect(() => {
//         fetchMoodStats().catch((err) => console.error(err));
//     }, []);
//
//     const fetchMoodStats = async () => {
//         try {
//             const today = new Date();
//             const moodData = await getMoods(user_id, new Date(today.getFullYear(), today.getMonth(), 1).toISOString(), today.toISOString());
//             const stats = await getMonthlyStats(user_id);
//
//             const moodCounts: MoodStats = {};
//             (moodData as MoodEntry[]).forEach(entry => {
//                 const month = dayjs(entry.timestamp).format('MMM');
//                 moodCounts[month] = (moodCounts[month] || 0) + 1;
//             });
//
//             setMoodStats(moodCounts);
//
//             const lineChartLabels = stats.map(entry => `${entry.month}/${entry.year}`);
//             const lineChartDatasets = [
//                 {
//                     data: stats.map(entry => entry.count),
//                     color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
//                     strokeWidth: 2,
//                 },
//             ];
//
//             const barChartLabels = Object.keys(moodCounts);
//             const barChartDatasets = [
//                 {
//                     data: Object.values(moodCounts),
//                     color: (opacity = 0.4) => `rgba(75, 192, 192, ${opacity})`,
//                 },
//             ];
//
//             setLineChartData({labels: lineChartLabels, datasets: lineChartDatasets});
//             setBarChartData({labels: barChartLabels, datasets: barChartDatasets});
//         } catch (error: any) {
//             setError(error.message);
//             Alert.alert('Error', error.message);
//         }
//     };
//
//     if (error) {
//         return (
//             <View style={styles.errorContainer}>
//                 <Text style={styles.errorText}>{error}</Text>
//             </View>
//         );
//     }
//
//     return (
//         <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>
//             <View style={styles.header}>
//                 <Text style={styles.headerText}>STATS</Text>
//             </View>
//             {/*<View style={styles.chartContainer}>*/}
//             {/*    <LineChart*/}
//             {/*        data={lineChartData}*/}
//             {/*        width={350}*/}
//             {/*        height={200}*/}
//             {/*        chartConfig={{*/}
//             {/*            backgroundColor: '#fff',*/}
//             {/*            backgroundGradientFrom: '#fff',*/}
//             {/*            backgroundGradientTo: '#fff',*/}
//             {/*            color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,*/}
//             {/*            strokeWidth: 2,*/}
//             {/*        }}*/}
//             {/*        bezier*/}
//             {/*    />*/}
//             {/*</View>*/}
//             {/*<View style={styles.chartContainer}>*/}
//             {/*    <BarChart*/}
//             {/*        data={barChartData}*/}
//             {/*        width={350}*/}
//             {/*        height={200}*/}
//             {/*        yAxisLabel=""*/}
//             {/*        yAxisSuffix=""*/}
//             {/*        chartConfig={{*/}
//             {/*            backgroundColor: '#fff',*/}
//             {/*            backgroundGradientFrom: '#fff',*/}
//             {/*            backgroundGradientTo: '#fff',*/}
//             {/*            color: (opacity = 0.4) => `rgba(75, 192, 192, ${opacity})`,*/}
//             {/*        }}*/}
//             {/*    />*/}
//             {/*</View>*/}
//         </ScrollView>
//     );
// };
//
// const styles = StyleSheet.create({
//     header: {
//         padding: 20,
//         backgroundColor: '#fff',
//         alignItems: 'center',
//     },
//     headerText: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         color: '#000',
//     },
//     chartContainer: {
//         marginVertical: 20,
//         alignItems: 'center',
//     },
//     errorContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#fff',
//     },
//     errorText: {
//         fontSize: 18,
//         color: 'red',
//     },
// });
//
// export default StatsScreen;