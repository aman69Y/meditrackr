import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Users, TrendingUp, Activity, Award } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import ModernHeader from '../../components/ModernHeader';
import DashboardCard from '../../components/DashboardCard';
import { useStudents } from '../../hooks/useStudents';

interface DashboardScreenProps {
  onAddPress: () => void;
}

export default function DashboardScreen({ onAddPress }: DashboardScreenProps) {
  const { students } = useStudents();

  const getHealthStats = () => {
    if (students.length === 0) return { avgBMI: 0, normalCount: 0, totalClasses: 0 };
    
    const bmis = students.map(s => s.bmi);
    const avgBMI = bmis.reduce((a, b) => a + b, 0) / bmis.length;
    const normalCount = students.filter(s => s.bmiCategory === 'Normal').length;
    const totalClasses = new Set(students.map(s => s.class)).size;
    
    return { 
      avgBMI: avgBMI.toFixed(1), 
      normalCount, 
      totalClasses 
    };
  };

  const { avgBMI, normalCount, totalClasses } = getHealthStats();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <View style={styles.container}>
      <ModernHeader title="MediTrackr" subtitle="Student Health Dashboard" />
      
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      >
        <Animated.View entering={FadeInDown.delay(100)} style={styles.greetingSection}>
          <View style={styles.greetingCard}>
            <Text style={styles.greetingText}>{getGreeting()}, Teacher!</Text>
            <Text style={styles.greetingSubtext}>
              {students.length > 0 
                ? `You have ${students.length} students registered across ${totalClasses} classes`
                : 'Start by adding your first student'
              }
            </Text>
          </View>
        </Animated.View>

        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Overview</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statsRow}>
              <DashboardCard
                title="Total Students"
                value={students.length}
                subtitle={`${totalClasses} classes`}
                colors={['#34C759', '#30D158']}
                icon={<Users size={20} color="rgba(255, 255, 255, 0.8)" />}
                delay={200}
              />
              <DashboardCard
                title="Average BMI"
                value={avgBMI}
                subtitle="Overall health"
                colors={['#007AFF', '#5AC8FA']}
                icon={<TrendingUp size={20} color="rgba(255, 255, 255, 0.8)" />}
                delay={300}
              />
            </View>
            
            <View style={styles.statsRow}>
              <DashboardCard
                title="Healthy Students"
                value={normalCount}
                subtitle="Normal BMI range"
                colors={['#FF9500', '#FFCC02']}
                icon={<Award size={20} color="rgba(255, 255, 255, 0.8)" />}
                delay={400}
              />
              <DashboardCard
                title="Health Rate"
                value={students.length > 0 ? `${Math.round((normalCount / students.length) * 100)}%` : '0%'}
                subtitle="Students in normal range"
                colors={['#AF52DE', '#BF5AF2']}
                icon={<Activity size={20} color="rgba(255, 255, 255, 0.8)" />}
                delay={500}
              />
            </View>
          </View>
        </View>

        {students.length === 0 && (
          <Animated.View entering={FadeInDown.delay(600)} style={styles.emptyState}>
            <View style={styles.emptyCard}>
              <Users size={48} color="#C7C7CC" />
              <Text style={styles.emptyTitle}>No Students Yet</Text>
              <Text style={styles.emptySubtext}>
                Tap the + button below to add your first student and start tracking their health data
              </Text>
              <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
                <Text style={styles.addButtonText}>Add First Student</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

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
  greetingSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greetingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
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
  greetingText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 4,
  },
  greetingSubtext: {
    fontSize: 15,
    color: '#8E8E93',
    lineHeight: 20,
  },
  statsSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 16,
  },
  statsGrid: {
    gap: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  emptyState: {
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
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
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 15,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 120,
  },
});