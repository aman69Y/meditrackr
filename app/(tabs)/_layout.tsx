import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import DashboardScreen from './dashboard';
import StudentsScreen from './students';
import AnalyticsScreen from './analytics';
import AddStudentScreen from './add-student';
import GlassBottomBar from '../../components/GlassBottomBar';

export default function TabLayout() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddStudent, setShowAddStudent] = useState(false);

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    setShowAddStudent(false);
  };

  const handleAddPress = () => {
    setShowAddStudent(true);
  };

  const handleBackFromAdd = () => {
    setShowAddStudent(false);
  };

  const renderActiveScreen = () => {
    if (showAddStudent) {
      return <AddStudentScreen onBack={handleBackFromAdd} />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <DashboardScreen onAddPress={handleAddPress} />;
      case 'students':
        return <StudentsScreen />;
      case 'analytics':
        return <AnalyticsScreen />;
      default:
        return <DashboardScreen onAddPress={handleAddPress} />;
    }
  };

  return (
    <View style={styles.container}>
      {renderActiveScreen()}
      <GlassBottomBar
        activeTab={showAddStudent ? 'add' : activeTab}
        onTabPress={handleTabPress}
        onAddPress={handleAddPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});