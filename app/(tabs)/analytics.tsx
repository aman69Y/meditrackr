import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import ModernHeader from '../../components/ModernHeader';
import { useStudents } from '../../hooks/useStudents';

const screenWidth = Dimensions.get('window').width;

export default function AnalyticsScreen() {
  const { students } = useStudents();

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.6,
    useShadowColorFromDataset: false,
    decimalPlaces: 1,
    propsForLabels: {
      fontSize: 12,
      fontWeight: '500',
    },
  };

  // BMI Category Distribution
  const bmiCategories = students.reduce((acc, student) => {
    acc[student.bmiCategory] = (acc[student.bmiCategory] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const bmiPieData = Object.entries(bmiCategories).map(([category, count], index) => ({
    name: category,
    population: count,
    color: ['#34C759', '#FF9500', '#FF9500', '#FF3B30'][index] || '#8E8E93',
    legendFontColor: '#1D1D1F',
    legendFontSize: 12,
  }));

  // Class-wise student distribution
  const classDistribution = students.reduce((acc, student) => {
    acc[student.class] = (acc[student.class] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const classBarData = {
    labels: Object.keys(classDistribution).map(cls => `${cls}`),
    datasets: [
      {
        data: Object.values(classDistribution),
        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
      },
    ],
  };

  // Average BMI by class
  const classBMIData = students.reduce((acc, student) => {
    if (!acc[student.class]) {
      acc[student.class] = { total: 0, count: 0 };
    }
    acc[student.class].total += student.bmi;
    acc[student.class].count += 1;
    return acc;
  }, {} as Record<number, { total: number; count: number }>);

  const avgBMIByClass = Object.entries(classBMIData).map(([cls, data]) => ({
    class: parseInt(cls),
    avgBMI: data.total / data.count,
  })).sort((a, b) => a.class - b.class);

  const bmiLineData = {
    labels: avgBMIByClass.map(item => `${item.class}`),
    datasets: [
      {
        data: avgBMIByClass.map(item => item.avgBMI),
        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const getHealthStats = () => {
    if (students.length === 0) return { avg: 0, min: 0, max: 0 };
    
    const bmis = students.map(s => s.bmi);
    const avg = bmis.reduce((a, b) => a + b, 0) / bmis.length;
    const min = Math.min(...bmis);
    const max = Math.max(...bmis);
    
    return { avg: avg.toFixed(1), min: min.toFixed(1), max: max.toFixed(1) };
  };

  const healthStats = getHealthStats();

  return (
    <View style={styles.container}>
      <ModernHeader title="Analytics" subtitle="Health insights and statistics" />
      
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={styles.overviewCard}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{students.length}</Text>
              <Text style={styles.statLabel}>Total Students</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{healthStats.avg}</Text>
              <Text style={styles.statLabel}>Avg BMI</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{Object.keys(classDistribution).length}</Text>
              <Text style={styles.statLabel}>Classes</Text>
            </View>
          </View>
        </View>

        {students.length > 0 && (
          <>
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>BMI Category Distribution</Text>
              <PieChart
                data={bmiPieData}
                width={screenWidth - 64}
                height={200}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </View>

            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Students by Class</Text>
              <BarChart
                data={classBarData}
                width={screenWidth - 64}
                height={200}
                chartConfig={chartConfig}
                verticalLabelRotation={0}
                showValuesOnTopOfBars={true}
                fromZero={true}
              />
            </View>

            {avgBMIByClass.length > 1 && (
              <View style={styles.chartCard}>
                <Text style={styles.chartTitle}>Average BMI by Class</Text>
                <LineChart
                  data={bmiLineData}
                  width={screenWidth - 64}
                  height={200}
                  chartConfig={chartConfig}
                  bezier
                  style={styles.chart}
                />
              </View>
            )}

            <View style={styles.healthStatsCard}>
              <Text style={styles.sectionTitle}>Health Statistics</Text>
              <View style={styles.healthStatsGrid}>
                <View style={styles.healthStatItem}>
                  <Text style={styles.healthStatValue}>{healthStats.min}</Text>
                  <Text style={styles.healthStatLabel}>Lowest BMI</Text>
                </View>
                <View style={styles.healthStatItem}>
                  <Text style={styles.healthStatValue}>{healthStats.max}</Text>
                  <Text style={styles.healthStatLabel}>Highest BMI</Text>
                </View>
                <View style={styles.healthStatItem}>
                  <Text style={styles.healthStatValue}>
                    {((bmiCategories['Normal'] || 0) / students.length * 100).toFixed(1)}%
                  </Text>
                  <Text style={styles.healthStatLabel}>Normal BMI</Text>
                </View>
                <View style={styles.healthStatItem}>
                  <Text style={styles.healthStatValue}>
                    {((bmiCategories['Underweight'] || 0) / students.length * 100).toFixed(1)}%
                  </Text>
                  <Text style={styles.healthStatLabel}>Underweight</Text>
                </View>
              </View>
            </View>
          </>
        )}

        {students.length === 0 && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No data to display</Text>
            <Text style={styles.emptySubtext}>Add students to see analytics</Text>
          </View>
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
  overviewCard: {
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#8E8E93',
  },
  chartCard: {
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
  chartTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 16,
    textAlign: 'center',
  },
  chart: {
    borderRadius: 16,
  },
  healthStatsCard: {
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
  healthStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  healthStatItem: {
    backgroundColor: '#F2F2F7',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '48%',
  },
  healthStatValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 4,
  },
  healthStatLabel: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
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