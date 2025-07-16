import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { ArrowLeft, Download } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface ModernHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  showDownloadButton?: boolean;
  onBackPress?: () => void;
  onDownloadPress?: () => void;
}

export default function ModernHeader({ 
  title, 
  subtitle, 
  showBackButton, 
  showDownloadButton,
  onBackPress,
  onDownloadPress 
}: ModernHeaderProps) {
  return (
    <LinearGradient
      colors={['#f8fafc', '#e2e8f0']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}
    >
      <View style={styles.headerContent}>
        <View style={styles.leftSection}>
          {showBackButton && (
            <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
              <ArrowLeft size={20} color="#3b82f6" strokeWidth={2} />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.centerSection}>
          <Animated.Text 
            entering={FadeInDown.delay(100)} 
            style={styles.title}
          >
            {title}
          </Animated.Text>
          {subtitle && (
            <Animated.Text 
              entering={FadeInDown.delay(200)} 
              style={styles.subtitle}
            >
              {subtitle}
            </Animated.Text>
          )}
        </View>
        
        <View style={styles.rightSection}>
          {showDownloadButton && (
            <TouchableOpacity style={styles.downloadButton} onPress={onDownloadPress}>
              <Download size={18} color="#3b82f6" strokeWidth={2} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  leftSection: {
    width: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSection: {
    width: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1d1d1f',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#8e8e93',
    marginTop: 2,
    textAlign: 'center',
  },
});