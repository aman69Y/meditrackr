export interface Student {
  id: string;
  name: string;
  class: number;
  rollNo: number;
  weight: number; // in kg
  height: number; // in cm
  age: number;
  bmi: number;
  bmiCategory: string;
  createdAt: Date;
}

export const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi >= 18.5 && bmi < 25) return 'Normal';
  if (bmi >= 25 && bmi < 30) return 'Overweight';
  return 'Obese';
};

export const calculateBMI = (weight: number, height: number): number => {
  const heightInMeters = height / 100;
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
};