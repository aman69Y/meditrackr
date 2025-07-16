import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Search, Filter } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import ModernHeader from '../../components/ModernHeader';
import StudentDetailModal from '../../components/StudentDetailModal';
import { useStudents } from '../../hooks/useStudents';
import { Student } from '../../types/Student';

export default function StudentsScreen() {
  const { students, loading } = useStudents();
  const [sortBy, setSortBy] = useState<'class' | 'name' | 'bmi'>('class');
  const [filterClass, setFilterClass] = useState<number | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const sortedAndFilteredStudents = useMemo(() => {
    let filtered = students;
    
    if (filterClass !== null) {
      filtered = students.filter(student => student.class === filterClass);
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'class':
          return a.class - b.class || a.name.localeCompare(b.name);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'bmi':
          return b.bmi - a.bmi;
        default:
          return 0;
      }
    });
  }, [students, sortBy, filterClass]);

  const handleStudentPress = (student: Student) => {
    setSelectedStudent(student);
    setModalVisible(true);
  };

  const getBMIColor = (bmi: number) => {
    if (bmi < 18.5) return '#FF9500';
    if (bmi >= 18.5 && bmi < 25) return '#34C759';
    if (bmi >= 25 && bmi < 30) return '#FF9500';
    return '#FF3B30';
  };

  const classes = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      <ModernHeader title="Students" subtitle={`${students.length} students registered`} />
      
      <View style={styles.controls}>
        <View style={styles.sortSection}>
          <Text style={styles.controlsTitle}>Sort by</Text>
          <View style={styles.sortButtons}>
            <TouchableOpacity
              style={[styles.sortButton, sortBy === 'class' && styles.activeSortButton]}
              onPress={() => setSortBy('class')}
            >
              <Text style={[styles.sortButtonText, sortBy === 'class' && styles.activeSortButtonText]}>
                Class
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.sortButton, sortBy === 'name' && styles.activeSortButton]}
              onPress={() => setSortBy('name')}
            >
              <Text style={[styles.sortButtonText, sortBy === 'name' && styles.activeSortButtonText]}>
                Name
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.sortButton, sortBy === 'bmi' && styles.activeSortButton]}
              onPress={() => setSortBy('bmi')}
            >
              <Text style={[styles.sortButtonText, sortBy === 'bmi' && styles.activeSortButtonText]}>
                BMI
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.controlsTitle}>Filter by class</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.classFilter}>
            <TouchableOpacity
              style={[styles.classButton, filterClass === null && styles.activeClassButton]}
              onPress={() => setFilterClass(null)}
            >
              <Text style={[styles.classButtonText, filterClass === null && styles.activeClassButtonText]}>
                All
              </Text>
            </TouchableOpacity>
            
            {classes.map(classNum => (
              <TouchableOpacity
                key={classNum}
                style={[styles.classButton, filterClass === classNum && styles.activeClassButton]}
                onPress={() => setFilterClass(classNum)}
              >
                <Text style={[styles.classButtonText, filterClass === classNum && styles.activeClassButtonText]}>
                  {classNum}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      >
        {sortedAndFilteredStudents.map((student, index) => (
          <Animated.View key={student.id} entering={FadeInUp.delay(index * 50)}>
            <TouchableOpacity onPress={() => handleStudentPress(student)}>
              <View style={styles.studentCard}>
                <View style={styles.studentHeader}>
                  <View style={styles.studentInfo}>
                    <Text style={styles.studentName}>{student.name}</Text>
                    <Text style={styles.studentDetails}>
                      Class {student.class} • Roll {student.rollNo} • {student.age} years
                    </Text>
                  </View>
                  <View style={[styles.bmiIndicator, { backgroundColor: getBMIColor(student.bmi) }]} />
                </View>
                
                <View style={styles.healthInfo}>
                  <View style={styles.healthItem}>
                    <Text style={styles.healthLabel}>Weight</Text>
                    <Text style={styles.healthValue}>{student.weight} kg</Text>
                  </View>
                  <View style={styles.healthItem}>
                    <Text style={styles.healthLabel}>Height</Text>
                    <Text style={styles.healthValue}>{student.height} cm</Text>
                  </View>
                  <View style={styles.healthItem}>
                    <Text style={styles.healthLabel}>BMI</Text>
                    <View style={styles.bmiContainer}>
                      <Text style={[styles.bmiValue, { color: getBMIColor(student.bmi) }]}>
                        {student.bmi}
                      </Text>
                      <Text style={styles.bmiCategory}>
                        {student.bmiCategory}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
        
        {sortedAndFilteredStudents.length === 0 && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No students found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
          </View>
        )}
        
        <View style={styles.bottomPadding} />
      </ScrollView>

      <StudentDetailModal
        visible={modalVisible}
        student={selectedStudent}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  controls: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  sortSection: {
    marginBottom: 16,
  },
  filterSection: {
    marginBottom: 0,
  },
  controlsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 8,
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
  },
  activeSortButton: {
    backgroundColor: '#007AFF',
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
  },
  activeSortButtonText: {
    color: '#ffffff',
  },
  classFilter: {
    flexDirection: 'row',
  },
  classButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    marginRight: 8,
    minWidth: 36,
    alignItems: 'center',
  },
  activeClassButton: {
    backgroundColor: '#007AFF',
  },
  classButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#8E8E93',
  },
  activeClassButtonText: {
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  studentCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  studentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 2,
  },
  studentDetails: {
    fontSize: 13,
    color: '#8E8E93',
  },
  bmiIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  healthInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  healthItem: {
    flex: 1,
    alignItems: 'center',
  },
  healthLabel: {
    fontSize: 11,
    color: '#8E8E93',
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  healthValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  bmiContainer: {
    alignItems: 'center',
  },
  bmiValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  bmiCategory: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 2,
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 32,
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 15,
    color: '#8E8E93',
  },
  bottomPadding: {
    height: 120,
  },
});