import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Student } from '../types/Student';

const STORAGE_KEY = '@meditrackr_students';

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const storedStudents = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedStudents) {
        const parsedStudents = JSON.parse(storedStudents);
        setStudents(parsedStudents);
      }
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveStudents = async (newStudents: Student[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newStudents));
      setStudents(newStudents);
    } catch (error) {
      console.error('Error saving students:', error);
    }
  };

  const addStudent = async (student: Student) => {
    const newStudents = [...students, student];
    await saveStudents(newStudents);
  };

  const updateStudent = async (updatedStudent: Student) => {
    const newStudents = students.map(s => 
      s.id === updatedStudent.id ? updatedStudent : s
    );
    await saveStudents(newStudents);
  };

  const deleteStudent = async (studentId: string) => {
    const newStudents = students.filter(s => s.id !== studentId);
    await saveStudents(newStudents);
  };

  const getStudentsByClass = (classNumber: number) => {
    return students.filter(s => s.class === classNumber);
  };

  const sortStudentsByClass = () => {
    return [...students].sort((a, b) => a.class - b.class);
  };

  return {
    students,
    loading,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentsByClass,
    sortStudentsByClass,
  };
};