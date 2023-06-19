import React from 'react';
import {
    SafeAreaView,
    View,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    Dimensions
} from 'react-native';
// import { Agenda } from 'react-native-calendars';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';


function CalenderScreen() {

    const currentDate = moment();
    const date = new Date();
    const renderYearCalendar = () => {
        const year = currentDate.year();
        const months = [];

        for (let month = 0; month < 12; month += 4) {
            const rowMonths = [];

            for (let i = 0; i < 4; i++) {
                const currentMonth = month + i;

                if (currentMonth < 12) {
                    const startDate = moment().year(year).month(currentMonth).date(1);
                    const endDate = moment(startDate).endOf('month');
                    const monthDates = {};

                    while (startDate.isSameOrBefore(endDate)) {
                        monthDates[startDate.format('YYYY-MM-DD')] = { selected: false };
                        startDate.add(1, 'day');
                    }

                    rowMonths.push(
                        <View style={styles.calendarContainer} key={currentMonth}>
                            <Text style={styles.calendarHeader}>
                                {moment().year(year).month(currentMonth).format('MMMM YYYY')}
                            </Text>
                            <Calendar
                                current={moment().year(year).month(currentMonth).format('YYYY-MM-DD')}
                                markedDates={monthDates}
                                theme={{
                                    calendarBackground: '#ffffff',
                                    todayTextColor: '#00adf5',
                                    dayTextColor: '#2d4150',
                                    textDisabledColor: '#d9e1e8',
                                    monthTextColor: '#2d4150',
                                    textDayFontSize: 12,
                                    textMonthFontSize: 14,
                                    textDayHeaderFontSize: 12,
                                }}
                                style={{
                                }}
                                hideExtraDays
                                hideArrows={true}
                                renderHeader={() => null}
                            />
                        </View>
                    );
                }
            }

            months.push(
                <View style={styles.rowContainer} key={month}>
                    {rowMonths}
                </View>
            );
        }

        return months;
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                {renderYearCalendar()}
            </ScrollView>
        </View>
    )
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#ffffff',
    },
    rowContainer: {
        flexDirection: 'row',

        height: 320
    },
    calendarContainer: {
        flex: 1,
        marginRight: 8,
        borderRadius: 20,
        borderColor: 'black',
        height: 20,
        justifyContent: 'space-between'
    },
    calendarHeader: {
        paddingBottom: 10,

    }
});

// return (
//     <SafeAreaView style={styles.container}>
//         <Agenda
//             selected="2022-12-01"
//             items={{
//                 '2022-12-01': [{ name: 'Cycling' }, { name: 'Walking' }, { name: 'Running' }],
//                 '2022-12-02': [{ name: 'Writing' }]
//             }}
//             renderItem={(item, isFirst) => (
//                 <TouchableOpacity style={styles.item}>
//                     <Text style={styles.itemText}>{item.name}</Text>
//                 </TouchableOpacity>
//             )}
//         />
//     </SafeAreaView>
// );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center'
//     },
//     item: {
//         backgroundColor: 'white',
//         flex: 1,
//         borderRadius: 5,
//         padding: 10,
//         marginRight: 10,
//         marginTop: 17,
//     },
//     itemText: {
//         color: '#888',
//         fontSize: 16,
//     }
// });

export default CalenderScreen;