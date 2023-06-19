import React, { useState, useEffect } from 'react'
import { View, Text, Button, TouchableOpacity, ToastAndroid, Alert } from 'react-native'
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import DailyTasks from '../components/DailyTasks';
import MasterTasks from '../components/MasterTasks';
import Notes from '../components/Notes';
import { Ionicons } from '@expo/vector-icons';
import CalenderScreen from './CalenderScreen';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/auth';
import clientApi from '../api/clientApi';



const Hindex = () => {
    const [selected, setSelected] = useState('');
    const navigation = useNavigation();
    const currentDate = new Date();
    const [auth] = useAuth();
    const { userId } = auth;
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState([]);
    const currentWeekday = currentDate.getDay();
    const daysArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = daysArray[currentWeekday];
    const currentDay = currentDate.getDate();

    const currentMonth = currentDate.toLocaleString('default', { month: 'long' });

    const Tab = createMaterialTopTabNavigator();
    const calendarScreen = () => {

        navigation.navigate('Calender');
    };
    // const handlegetusertasks = async () => {
    //     const [auth] = useAuth();
    //     const { userId } = auth;
    //     try {
    //         const res = await clientApi.post('/api/v1/tasks/create',
    //             { title, category, text, userId }
    //         )
    //         setModalVisible(!modalVisible)
    //         if (res && res.data.success) {
    //             ToastAndroid.show(res.data.message, ToastAndroid.SHORT);
    //         } else {
    //             ToastAndroid.show(res.data.message, ToastAndroid.SHORT);
    //         }
    //         setModalVisible(false);
    //     } catch (error) {
    //         setModalVisible(!modalVisible)
    //         console.log(error);
    //         ToastAndroid.show("Something went wrong");
    //         setModalVisible(false);
    //     }
    // }

    // useEffect(() => {
    //     const fetchUserTasks = async () => {
    //         try {
    //             const userId = auth.user?._id;
    //             if (!userId) {
    //                 setLoading(false);
    //                 return;
    //             }

    //             const res = await clientApi.get(
    //                 `/api/v1/tasks/user-tasks/${userId}`
    //             );
    //             setTasks(res.data);
    //             setLoading(false);
    //         } catch (error) {
    //             console.log('Error fetching user Tasks:', error);
    //             setLoading(false);
    //             ToastAndroid.show("Error fetching user Tasks");
    //         }
    //     };

    //     fetchUserTasks();
    // }, [auth]);

    return (
        <View style={{ flexDirection: "row", width: "100%", height: '100%', marginTop: 10, backgroundColor: 'white' }}>
            <View style={{ width: "40%" }}>
                <View style={{ flexDirection: "row", justifyContent: 'space-evenly' }}>
                    <View style={{}}>
                        <Text style={{ fontSize: 150, textAlign: 'center', fontWeight: '700' }}>{currentDay}</Text>
                        <Text style={{ fontSize: 30, fontWeight: '700', textAlign: 'center' }}>
                            {dayName}
                        </Text>
                        <Text style={{ fontSize: 38, fontWeight: '700', textAlign: 'center' }}>{currentMonth} {currentDate.getFullYear()}</Text>
                    </View>
                    <View style={{ height: '25%', flexDirection: 'row' }}>
                        <View style={{ flexDirection: "column", height: 320, justifyContent: 'flex-end' }}>
                            <TouchableOpacity style={{ justifyContent: 'flex-end', marginTop: 50 }}
                                onPress={calendarScreen}
                            >
                                <Ionicons name="add-circle-outline" size={40} color="red" />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: "column", height: 300, justifyContent: 'center' }}>
                            <Calendar
                                onDayPress={day => {
                                    setSelected(day.dateString);
                                }}
                                headerStyle={{
                                    height: '24%',
                                    rowGap: 0,
                                    columnGap: 1,


                                }}
                                markedDates={{
                                    [selected]: { selected: true, disableTouchEvent: true, selectedDotColor: 'orange' }
                                }}
                                // theme={{
                                //     textDayFontSize: 5,
                                //     textMonthFontSize: 14,
                                //     textDayHeaderFontSize: 8,
                                // }}
                                style={{

                                    borderColor: 'black',
                                    borderWidth: 1, // Set the border width
                                    borderColor: 'black', // Set the border color
                                    borderRadius: 15,
                                    paddingBottom: 1, // Set the border radius
                                    height: '100%',
                                    // borderTopLeftRadius: 20,
                                    // borderTopRightRadius: 20,
                                    marginBottom: 10,

                                }}
                            />
                        </View>
                    </View>
                </View>
                <View>
                    <SafeAreaView style={{ marginLeft: 10, paddingLeft: 8, paddingRight: 10 }}>
                        <View style={styles.cont}>
                            <View style={styles.headingcontainer}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                    <View style={{ flexDirection: 'column', alignItems: 'center', marginLeft: '35%' }}>
                                        <Text style={styles.heading}>Appointments

                                        </Text>
                                    </View>
                                    {/* <View style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
                                        <TouchableOpacity style={{ marginRight: '10%' }}>
                                            <Ionicons name="md-add-circle-outline" size={35} color="red" />
                                        </TouchableOpacity>
                                    </View> */}
                                </View>
                            </View>
                            <View style={styles.innerContainer}>
                                {tasks.map((task) => (
                                    <View key={task._id} style={{ paddingBottom: 10 }}>
                                        <TouchableOpacity style={styles.button} onPress={this.onPress}>
                                            <View style={styles.textContainer}>
                                                <Text style={styles.taskName}>{task.title}</Text>
                                                <Text style={styles.time}>{new Date(task.updatedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </SafeAreaView>
                </View>
            </View >

            <View style={
                { width: "60%", paddingLeft: 20, paddingRight: 20 }
            }>
                <View>
                    <View style={styles.tabcont}>
                        <Tab.Navigator initialRouteName={"DailyTasks"}
                            // tabBarOptions={customTabBarStyle}
                            screenOptions={{
                                tabBarActiveTintColor: 'white',
                                tabBarLabelStyle: { fontSize: 10 },
                                tabBarStyle: {
                                    backgroundColor: 'grey',
                                    // borderRadius: 2,
                                    borderTopLeftRadius: 10,
                                    borderTopRightRadius: 10,
                                    borderTopWidth: 1,
                                    borderTopColor: 'black',
                                },
                                // tabBarInactiveBackgroundColor: 'white',
                            }}
                            style={styles.heading}
                        >
                            <Tab.Screen name="DailyTasks" component={DailyTasks} />
                            <Tab.Screen name="MasterTasks" component={MasterTasks} />
                            <Tab.Screen name="Notes" component={Notes} />
                            <Tab.Screen name="Contacts" component={DailyTasks} />
                            <Tab.Screen name="Goals" component={MasterTasks} />
                            <Tab.Screen name="ToDoList" component={DailyTasks} />
                            <Tab.Screen name="Milage" component={MasterTasks} />
                        </Tab.Navigator>
                    </View>
                </View>
            </View>
        </View >
    )
}

export default gestureHandlerRootHOC(Hindex)

const styles = {
    container: {
        flex: 2, // the number of columns you want to devide the screen into
        marginHorizontal: "auto",
        // width: '40%',
        backgroundColor: 'white'
    }, textContainer: {
        opacity: 1,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingHorizontal: 20,
        paddingTop: 16,
        flex: 1,
    },
    container1: {
        flex: 1.2, // the number of columns you want to devide the screen into
        marginHorizontal: "auto",
        // width: '60%',
        backgroundColor: 'white',
        justifyContent: 'center'
    },
    containerrt: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: "auto",
        width: '100%',
        backgroundColor: 'white'
    },
    row: {
        flexDirection: "row"
    },
    "1col": {
        // backgroundColor: "red",
        // borderColor: "#fff",
        // borderWidth: 1,
        flex: 1,
    },
    "2col": {
        // borderColor: "black",
        // borderWidth: 1,
        flex: 2,
    },
    button: {
        borderWidth: 1,
        borderColor: 'black',
        padding: 10,
        borderRadius: 5,
    },
    textContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textContainer1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    taskName: {
        fontWeight: 'bold',
        marginRight: 10, // Add some spacing between the texts
    },
    time: {
        fontStyle: 'italic',
    },
    cont: {
        borderWidth: 1, // Set the border width
        borderColor: 'black', // Set the border color
        borderRadius: 5, // Set the border radius
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: '79.3%'

    },
    tabcont: {
        borderWidth: 1, // Set the border width
        borderColor: 'black', // Set the border color
        borderRadius: 1, // Set the border radius
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: '99%',
        width: 730

    },
    can: {
        borderWidth: 1, // Set the border width
        borderColor: 'black', // Set the border color
        borderRadius: 5, // Set the border radius
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: 300
    },
    headingcontainer: {
        backgroundColor: 'grey',
        height: '13%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        // justifyContent: 'center'
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        textAlign: "center"

    },
    innerContainer: {
        padding: 10,
        color: 'black',
    },
    containerright: {

    }
};
