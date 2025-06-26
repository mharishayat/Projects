import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';

const AttendanceScreen = ({ navigation }) => {
  const [attendance, setAttendance] = useState([]);

  const fetchAttendance = async () => {
    try {
      const response = await fetch('http://192.168.236.145:3000/attendance');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setAttendance(data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch attendance');
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchAttendance);
    return unsubscribe;
  }, [navigation]);

  const toggleStatus = async (record) => {
    const newStatus = record.status === 'present' ? 'absent' : 'present';
    try {
      const response = await fetch(`http://192.168.236.145:3000/attendance/${record.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error('Failed to update');

      setAttendance((prev) =>
        prev.map((att) =>
          att.id === record.id ? { ...att, status: newStatus } : att
        )
      );
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update attendance');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.studentId}</Text>
      <Text style={styles.cell}>{item.date}</Text>
      <TouchableOpacity
        style={[
          styles.cell,
          item.status === 'present' ? styles.present : styles.absent,
        ]}
        onPress={() => toggleStatus(item)}
      >
        <Text style={styles.statusText}>{item.status}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance</Text>
      <View style={styles.tableHeader}>
        <Text style={styles.headerCell}>Student ID</Text>
        <Text style={styles.headerCell}>Date</Text>
        <Text style={styles.headerCell}>Status (Tap to toggle)</Text>
      </View>
      <FlatList
        data={attendance}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No attendance records</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingBottom: 5,
    marginBottom: 10,
  },
  headerCell: { flex: 1, fontWeight: 'bold', fontSize: 16 },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  cell: { flex: 1, fontSize: 14, justifyContent: 'center' },
  present: { backgroundColor: '#c8e6c9', borderRadius: 5, padding: 5 },
  absent: { backgroundColor: '#ffcdd2', borderRadius: 5, padding: 5 },
  statusText: { textAlign: 'center', fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#999' },
});

export default AttendanceScreen;
