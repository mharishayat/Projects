import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';

export default function StudentForm({ initialName = '', onSubmit }) {
  const [name, setName] = useState(initialName);

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Please enter a name');
      return;
    }
    onSubmit(name.trim());
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Student Name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <Button title={initialName ? 'Update Student' : 'Add Student'} onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: {
    borderWidth:1,
    borderColor:'#ccc',
    padding:12,
    marginBottom:15,
    borderRadius:6,
  }
});
