import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import ModernHeader from '../../components/ModernHeader';
import { useStudents } from '../../hooks/useStudents';
import { Student, calculateBMI, getBMICategory } from '../../types/Student';

interface AddStudentScreenProps {
  onBack: () => void;
}

export default function AddStudentScreen({ onBack }: AddStudentScreenProps) {
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

    Alert.alert('Success', 'Student added successfully!', [
      { text: 'OK', onPress: onBack }
    ]);
  };

  return (
    <View style={styles.container}>
      <ModernHeader 
        title="Add Student" 
        subtitle="Enter student information"
        showBackButton
        onBackPress={onBack}
      />
      
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      >
        <Animated.View entering={FadeInUp.delay(100)}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Student Identity</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                placeholder="Enter student's full name"
                placeholderTextColor="#C7C7CC"
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
                  placeholderTextColor="#C7C7CC"
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
                  placeholderTextColor="#C7C7CC"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200)}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Health Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Age (years)</Text>
              <TextInput
                style={styles.input}
                value={formData.age}
                onChangeText={(value) => handleInputChange('age', value)}
                placeholder="Enter age"
                placeholderTextColor="#C7C7CC"
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
                  placeholderTextColor="#C7C7CC"
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
                  placeholderTextColor="#C7C7CC"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300)}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Add Student</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1D1D1F',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1D1D1F',
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
    backgroundColor: '#007AFF',
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  submitText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 120,
  },
});