import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import AddStudentScreen from '../screens/AddStudentScreen';
import AttendanceScreen from '../screens/AttendanceScreen';
import MarksheetScreen from '../screens/MarksheetScreen';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="AddStudent" component={AddStudentScreen} />
      <Drawer.Screen name="Attendance" component={AttendanceScreen} />
      <Drawer.Screen name="Marksheet" component={MarksheetScreen} />
    </Drawer.Navigator>
  );
}
