import React, { useState, useEffect } from 'react'
import { View, Text, Button, TouchableOpacity, ToastAndroid, Alert, StyleSheet } from 'react-native'
import { Calendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ScrollView, gestureHandlerRootHOC } from 'react-native-gesture-handler';
import DailyTasks from '../components/DailyTasks';
import MasterTasks from '../components/MasterTasks';
import Notes from '../components/Notes';
import { Ionicons } from '@expo/vector-icons';
import CalenderScreen from './CalenderScreen';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/auth';
import clientApi from '../api/clientApi';
import { useTasks } from '../context/Task';
import AttachmentBtn from '../components/AttachmentBtn';
import Contacts from '../components/Contacts';
import Draw from '../components/Draw';
import Zoom from '../components/Zoom';


const Hindex = () => {
    const [selected, setSelected] = useState('');
    const navigation = useNavigation();
    const currentDate = new Date();
    const [auth] = useAuth();
    const { userId } = auth;
    const [loading, setLoading] = useState(true);
    // const [Tasks, setTasks] = useState([]);
    const currentWeekday = currentDate.getDay();
    const daysArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = daysArray[currentWeekday];
    const currentDay = currentDate.getDate();
    const { tasks, updateTasks } = useTasks();

    const currentMonth = currentDate.toLocaleString('default', { month: 'long' });

    const Tab = createMaterialTopTabNavigator();
    const calendarScreen = () => {

        navigation.navigate('Calender');
    };


    useEffect(() => {
        const fetchUserTasks = async () => {
            try {
                const userId = auth.user?._id;
                if (!userId) {
                    setLoading(false);
                    return;
                }

                const res = await clientApi.get(
                    `/api/v1/tasks/user-tasks/${userId}`
                );

                updateTasks(res.data);
                setLoading(false);
            } catch (error) {
                console.log('Error fetching user Tasks:', error);
                setLoading(false);
                ToastAndroid.show("Error fetching user Tasks");
            }
        };

        fetchUserTasks();
    }, []);


    const openTabBasedOnCategory = ({ category, _id, text, title }) => {
        let tabName = '';
        // let props = { id: _id, desc: text };

        switch (category) {
            case 'DailyTasks':
                tabName = 'DailyTasks';
                break;
            case 'MasterTasks':
                tabName = 'MasterTasks';
                break;
            case 'Notes':
                tabName = 'Notes';
                break;
        }
        navigation.navigate(tabName, { id: _id, desc: text, head: title });
        // console.log(tabName, { id: _id, desc: text, head: title })
    }

    const EmptyScreen = () => {
        return (
            <View>
                <Text>Hello World</Text>
            </View>
        )
    }

    return (
        <View style={{ flexDirection: "row", width: "100%", height: '100%' }}>
            <View style={{ flexDirection: 'column', height: "100%", width: "40%", backgroundColor: 'white' }}>
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
                            <TouchableOpacity style={{ justifyContent: 'flex-end', paddingBottom: 10 }}
                                onPress={calendarScreen}
                            >
                                <Ionicons name="add-circle-outline" size={40} color="red" />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: "column", height: 250, justifyContent: 'center' }}>
                            <Calendar
                                theme={{
                                    calendarBackground: '#ffffff',
                                    todayTextColor: '#00adf5',
                                    dayTextColor: '#2d4150',
                                    textDisabledColor: '#d9e1e8',
                                    monthTextColor: '#2d4150',
                                    textDayFontSize: 10,
                                    textMonthFontSize: 14,
                                    textDayHeaderFontSize: 12,
                                    rowGap: 2,
                                }}
                                hideExtraDays
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
                                style={{

                                    // borderColor: 'black',
                                    // borderWidth: 1,
                                    rowGap: 0,
                                    borderRadius: 15,
                                    paddingBottom: 1,
                                    height: '100%',
                                    width: 250,
                                    marginBottom: 10,


                                }}
                            />
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: "row", height: "66.5%" }}>
                    <View style={{ flexDirection: "column", height: "100%", width: "100%" }}>
                        <SafeAreaView style={{ marginLeft: 10, paddingLeft: 8, paddingRight: 10, height: '100%' }}>
                            <View style={[styles.cont, { height: "100%" }]}>
                                <View style={styles.headingcontainer}>
                                    <Text style={styles.heading}>Appointments

                                    </Text>

                                </View>
                                <ScrollView style={styles.innerContainer}>
                                    {tasks.map((task) => (

                                        <View style={{ paddingBottom: 10 }} key={task._id}>
                                            <TouchableOpacity style={styles.button} onPress={() => openTabBasedOnCategory(task)}>
                                                <View style={styles.textContainer}>
                                                    <Text style={styles.taskName}>{task.title}</Text>
                                                    <Text style={styles.taskName}>{task.category}</Text>
                                                    <Text style={styles.time}>{new Date(task.updatedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>

                                    ))}
                                </ScrollView>
                            </View>
                        </SafeAreaView>
                    </View>
                </View >
            </View >

            <View style={
                { flexDirection: 'column', width: "60%", paddingRight: "1%" }
            }>
                <View>
                    <View style={styles.tabcont}>
                        <Tab.Navigator initialRouteName={"DailyTasks"}

                            screenOptions={{
                                tabBarScrollEnabled: true,
                                swipeEnabled: false,
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
                                tabBarItemStyle: {
                                    width: 180
                                }
                            }}
                            style={styles.heading}

                        >
                            <Tab.Screen name="DailyTasks" component={DailyTasks}
                                initialParams={{ id: '', desc: '' }}
                            />
                            <Tab.Screen name="MasterTasks" component={MasterTasks}
                                initialParams={{ id: '', desc: '' }}
                            />
                            <Tab.Screen name="Notes" component={Notes} />

                            <Tab.Screen name="Goals" component={AttachmentBtn} />
                            {/* <Tab.Screen name="ToDoList" component={Contacts} /> */}
                            <Tab.Screen name="Milage" component={Draw} />
                            <Tab.Screen name="ToDoList" component={Zoom} />
                        </Tab.Navigator>
                    </View>
                </View>
            </View>
        </View >
    )
}

export default Hindex

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
        // height: '79.5%'

    },
    tabcont: {
        borderWidth: 1, // Set the border width
        borderColor: 'black', // Set the border color
        borderRadius: 1, // Set the border radius
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: '100%',
        width: "100%"

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
        height: 40,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        justifyContent: 'center',
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        textAlign: "center",

    },
    innerContainer: {
        padding: 10,
        color: 'black',
    },
    containerright: {

    }
};
const calendarStyles = StyleSheet.create({
    dayText: {
        fontSize: 18.2,
        marginTop: 0,
    },
})