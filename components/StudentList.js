import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, Alert, StyleSheet } from 'react-native';

export default function StudentList({ navigation }) {
  const [students, setStudents] = useState([]);

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://192.168.236.145:3000/students');
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      Alert.alert('Error', 'Unable to fetch students');
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchStudents);
    return unsubscribe;
  }, [navigation]);

  const deleteStudent = async (id) => {
    try {
      await fetch(`http://192.168.236.145:3000/students/${id}`, { method: 'DELETE' });
      setStudents(students.filter((s) => s.id !== id));
    } catch (error) {
      Alert.alert('Error', 'Unable to delete student');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.name}>{item.name}</Text>
      <View style={styles.buttons}>
        <Button
          title="Edit"
          onPress={() => navigation.navigate('EditStudent', { student: item })}
        />
        <View style={{ width: 10 }} />
        <Button
          color="red"
          title="Delete"
          onPress={() =>
            Alert.alert(
              'Confirm Delete',
              `Are you sure you want to delete ${item.name}?`,
              [
                { text: 'Cancel' },
                { text: 'Delete', onPress: () => deleteStudent(item.id) },
              ]
            )
          }
        />
      </View>
    </View>
  );

  return (
    <FlatList
      data={students}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      ListEmptyComponent={<Text style={styles.empty}>No students found.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    paddingVertical:12,
    borderBottomWidth:1,
    borderColor:'#ddd'
  },
  name: {
    fontSize:18,
    flex:1,
  },
  buttons: {
    flexDirection:'row',
  },
  empty: {
    textAlign:'center',
    marginTop:20,
    fontSize:16,
    color:'#666'
  }
});
