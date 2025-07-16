import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Chrome as Home, Users, ChartBar as BarChart3, Plus } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
} from 'react-native-reanimated';

interface GlassBottomBarProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
  onAddPress: () => void;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function GlassBottomBar({ activeTab, onTabPress, onAddPress }: GlassBottomBarProps) {
  const fabScale = useSharedValue(1);

  const handleFabPress = () => {
    fabScale.value = withSpring(0.9, { duration: 100 }, () => {
      fabScale.value = withSpring(1);
    });
    onAddPress();
  };

  const fabAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fabScale.value }],
  }));

  const getTabColor = (tab: string) => activeTab === tab ? '#007AFF' : '#8E8E93';

  return (
    <View style={styles.container}>
      <BlurView intensity={100} tint="light" style={styles.blurContainer}>
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => onTabPress('dashboard')}
          >
            <Home 
              size={24} 
              color={getTabColor('dashboard')} 
              strokeWidth={activeTab === 'dashboard' ? 2 : 1.5}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => onTabPress('students')}
          >
            <Users 
              size={24} 
              color={getTabColor('students')} 
              strokeWidth={activeTab === 'students' ? 2 : 1.5}
            />
          </TouchableOpacity>

          <View style={styles.fabContainer}>
            <AnimatedTouchableOpacity
              style={[styles.fab, fabAnimatedStyle]}
              onPress={handleFabPress}
            >
              <Plus size={24} color="#ffffff" strokeWidth={2.5} />
            </AnimatedTouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => onTabPress('analytics')}
          >
            <BarChart3 
              size={24} 
              color={getTabColor('analytics')} 
              strokeWidth={activeTab === 'analytics' ? 2 : 1.5}
            />
          </TouchableOpacity>

          <View style={styles.tabItem} />
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 90 : 80,
    paddingBottom: Platform.OS === 'ios' ? 34 : 10,
  },
  blurContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  tabBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
  },
  fabContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});