import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../../components/Header';
import Card from '../../components/Card';
import { useStudents } from '../../hooks/useStudents';
import { Student, calculateBMI, getBMICategory } from '../../types/Student';

export default function AddStudentScreen() {
  const { addStudent } = useStudents();
  const [formData, setFormData] = useState({
    name: '',
    class: '',
    rollNo: '',
    weight: '',
    height: '',
    age: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter student name');
      return;
    }

    const classNum = parseInt(formData.class);
    if (!classNum || classNum < 1 || classNum > 10) {
      Alert.alert('Error', 'Please enter a valid class (1-10)');
      return;
    }

    const rollNo = parseInt(formData.rollNo);
    if (!rollNo || rollNo < 1) {
      Alert.alert('Error', 'Please enter a valid roll number');
      return;
    }

    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    const age = parseInt(formData.age);

    if (!weight || weight <= 0) {
      Alert.alert('Error', 'Please enter a valid weight');
      return;
    }

    if (!height || height <= 0) {
      Alert.alert('Error', 'Please enter a valid height');
      return;
    }

    if (!age || age <= 0) {
      Alert.alert('Error', 'Please enter a valid age');
      return;
    }

    const bmi = calculateBMI(weight, height);
    const bmiCategory = getBMICategory(bmi);

    const newStudent: Student = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      class: classNum,
      rollNo: rollNo,
      weight: weight,
      height: height,
      age: age,
      bmi: bmi,
      bmiCategory: bmiCategory,
      createdAt: new Date(),
    };

    await addStudent(newStudent);
    
    // Reset form
    setFormData({
      name: '',
      class: '',
      rollNo: '',
      weight: '',
      height: '',
      age: '',
    });

    Alert.alert('Success', 'Student added successfully!');
  };

  return (
    <View style={styles.container}>
      <Header title="MediTrackr" subtitle="Add Student Information" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Card>
          <Text style={styles.sectionTitle}>Student Identity</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              placeholder="Enter student's full name"
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Class</Text>
              <TextInput
                style={styles.input}
                value={formData.class}
                onChangeText={(value) => handleInputChange('class', value)}
                placeholder="1-10"
                placeholderTextColor="#94a3b8"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Roll Number</Text>
              <TextInput
                style={styles.input}
                value={formData.rollNo}
                onChangeText={(value) => handleInputChange('rollNo', value)}
                placeholder="Roll No."
                placeholderTextColor="#94a3b8"
                keyboardType="numeric"
              />
            </View>
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Health Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Age (years)</Text>
            <TextInput
              style={styles.input}
              value={formData.age}
              onChangeText={(value) => handleInputChange('age', value)}
              placeholder="Enter age"
              placeholderTextColor="#94a3b8"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Weight (kg)</Text>
              <TextInput
                style={styles.input}
                value={formData.weight}
                onChangeText={(value) => handleInputChange('weight', value)}
                placeholder="Weight"
                placeholderTextColor="#94a3b8"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Height (cm)</Text>
              <TextInput
                style={styles.input}
                value={formData.height}
                onChangeText={(value) => handleInputChange('height', value)}
                placeholder="Height"
                placeholderTextColor="#94a3b8"
                keyboardType="numeric"
              />
            </View>
          </View>
        </Card>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <LinearGradient
            colors={['#3b82f6', '#1d4ed8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.submitGradient}
          >
            <Text style={styles.submitText}>Add Student</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1e293b',
    backgroundColor: '#ffffff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  submitButton: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  submitGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 20,
  },
});