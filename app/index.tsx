// import React from 'react';
// import {NavigationContainer} from '@react-navigation/native';
// import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import CalendarScreen from '@/app/(screens)/CalendarScreen';
// import StatsScreen from '@/app/(screens)/StatsScreen';
// import {Ionicons} from '@expo/vector-icons';
//
// const Tab = createBottomTabNavigator();
//
// export default function App() {
//     return (
//         <NavigationContainer>
//             <Tab.Navigator
//                 screenOptions={({route}) => ({
//                     tabBarIcon: ({color, size}) => {
//                         let iconName: string = route.name === 'Calendar' ? 'calendar' : 'bar-chart';
//                         return <Ionicons name={iconName as any} size={size} color={color}/>;
//                     },
//                 })}
//             >
//                 <Tab.Screen name="Calendar" component={CalendarScreen}/>
//                 <Tab.Screen name="Stats" component={StatsScreen}/>
//             </Tab.Navigator>
//         </NavigationContainer>
//     );
// }
