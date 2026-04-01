import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import GroupScreen from './screens/GroupScreen';
import DailyQuestionScreen from './screens/DailyQuestionScreen';
import AnswerScreen from './screens/AnswerScreen';
import ResultsScreen from './screens/ResultsScreen';

export type RootStackParamList = {
  Login: undefined;
  Group: { userId: number; userName: string };
  DailyQuestion: { userId: number; groupId: number; groupName: string };
  Answer: { userId: number; groupId: number; groupName: string; questionId: number; questionText: string; questionType: 'single' | 'multiple' | 'text' };
  Results: { userId: number; groupId: number; groupName: string; questionText?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Group" component={GroupScreen} />
        <Stack.Screen name="DailyQuestion" component={DailyQuestionScreen} />
        <Stack.Screen name="Answer" component={AnswerScreen} />
        <Stack.Screen name="Results" component={ResultsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
