import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const HomeScreen = ({ navigation }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchStudents = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await fetch('http://192.168.236.145:3000/students');
      if (!response.ok) throw new Error('Failed to fetch students');
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      setErrorMessage('Failed to load students. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchStudents);
    return unsubscribe;
  }, [navigation]);

  const deleteStudent = (id) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this student?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (deletingId) return;
            setDeletingId(id);
            try {
              const response = await fetch(`http://192.168.236.145:3000/students/${id}`, {
                method: 'DELETE',
              });
              if (!response.ok) throw new Error('Delete failed');
              setStudents((prev) => prev.filter((s) => s.id !== id));
            } catch (error) {
              Alert.alert('Error', 'Failed to delete student. Please try again.');
            } finally {
              setDeletingId(null);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderStudent = ({ item }) => (
    <View style={styles.studentCard}>
      <View>
        <Text style={styles.studentName}>{item.name}</Text>
        <Text style={styles.studentDetail}>ID: {item.id}</Text>
        <Text style={styles.studentDetail}>Age: {item.age}</Text>
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditStudent', { student: item })}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.deleteButton, deletingId === item.id && { opacity: 0.5 }]}
          onPress={() => deleteStudent(item.id)}
          disabled={deletingId === item.id}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎓 Student List</Text>
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <FlatList
          data={students}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderStudent}
          contentContainerStyle={students.length === 0 && styles.emptyList}
          ListEmptyComponent={<Text style={styles.emptyText}>No students to display.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f4f8', padding: 20 },
  title: { fontSize: 26, fontWeight: '700', color: '#2c3e50', textAlign: 'center', marginBottom: 20 },
  studentCard: {
    flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff',
    padding: 15, marginBottom: 12, borderRadius: 10, elevation: 3,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3,
  },
  studentName: { fontSize: 18, fontWeight: '600', color: '#34495e' },
  studentDetail: { fontSize: 14, color: '#7f8c8d', marginTop: 3 },
  actionsContainer: { flexDirection: 'row', alignItems: 'center' },
  editButton: { backgroundColor: '#3498db', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 5, marginRight: 10 },
  deleteButton: { backgroundColor: '#e74c3c', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 5 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  loadingText: { textAlign: 'center', fontSize: 18, color: '#3498db' },
  emptyList: { flexGrow: 1, justifyContent: 'center' },
  emptyText: { textAlign: 'center', color: '#7f8c8d', fontSize: 18 },
  errorText: { color: '#e74c3c', textAlign: 'center', marginBottom: 10 },
});

export default HomeScreen;
