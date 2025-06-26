import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text } from 'react-native';

const EditStudentScreen = ({ route, navigation }) => {
  const { student } = route.params;
  const [name, setName] = useState(student.name);
  const [age, setAge] = useState(String(student.age));

  const handleUpdate = async () => {
    if (!name.trim() || !age.trim()) {
      Alert.alert('Validation Error', 'Please enter both name and age');
      return;
    }

    if (isNaN(age) || Number(age) <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid age');
      return;
    }

    try {
      const response = await fetch(`http://192.168.236.145:3000/students/${student.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), age: Number(age) }),
      });

      if (!response.ok) throw new Error('Failed to update');

      Alert.alert('Success', 'Student updated successfully', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(), // Go back to Home after update
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update student');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter student name"
      />
      <Text style={styles.label}>Age:</Text>
      <TextInput
        style={styles.input}
        value={age}
        onChangeText={setAge}
        placeholder="Enter student age"
        keyboardType="numeric"
      />
      <Button title="Update Student" onPress={handleUpdate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 15,
    fontSize: 16,
  },
});

export default EditStudentScreen;
