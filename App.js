// App.js

import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { auth } from './config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import DashboardScreen from './screens/DashboardScreen';
import WeightInputScreen from './screens/WeightInputScreen';

import WeightDetailScreen from './screens/WeightDetailScreen';
import GoalDetailScreen from './screens/GoalDetailScreen';
import EditWeightScreen from './screens/EditWeightScreen';
import EditGoalScreen from './screens/EditGoalScreen';
import WeightChartScreen from './screens/WeightChartScreen';
import ContentListScreen from './screens/ContentListScreen';
import ContentDetailScreen from './screens/ContentDetailScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import ValuesSelectionScreen from './screens/ValuesSelectionScreen';
import InterestAreasScreen from './screens/InterestAreasScreen';
import AreaFocusScreen from './screens/AreaFocusScreen';
import GoalObjectiveScreen from './screens/GoalObjectiveScreen';
import GoalValuesScreen from './screens/GoalValuesScreen';
import GoalImportanceScreen from './screens/GoalImportanceScreen';
import GoalBarriersScreen from './screens/GoalBarriersScreen';
import GoalSolutionsScreen from './screens/GoalSolutionsScreen';
import GoalActionPlanScreen from './screens/GoalActionPlanScreen';
import GoalSummaryScreen from './screens/GoalSummaryScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isAuthenticated ? 'Dashboard' : 'Home'}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            headerShown: false,
            gestureEnabled: false
          }}
        />
        <Stack.Screen name="WeightInput" component={WeightInputScreen} options={{ headerShown: false }} />

        <Stack.Screen name="WeightChart" component={WeightChartScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ContentList" component={ContentListScreen} options={{ headerShown: false }} />
        <Stack.Screen name="WeightDetail" component={WeightDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="GoalDetail" component={GoalDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EditWeight" component={EditWeightScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EditGoal" component={EditGoalScreen} options={{ headerShown: false }} />

        <Stack.Screen name="ContentDetail" component={ContentDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ValuesSelection" component={ValuesSelectionScreen} options={{ headerShown: false }} />
        <Stack.Screen name="InterestAreas" component={InterestAreasScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AreaFocus" component={AreaFocusScreen} options={{ headerShown: false }} />
        <Stack.Screen name="GoalObjective" component={GoalObjectiveScreen} options={{ headerShown: false }} />
        <Stack.Screen name="GoalValues" component={GoalValuesScreen} options={{ headerShown: false }} />
        <Stack.Screen name="GoalImportance" component={GoalImportanceScreen} options={{ headerShown: false }} />
        <Stack.Screen name="GoalBarriers" component={GoalBarriersScreen} options={{ headerShown: false }} />
        <Stack.Screen name="GoalSolutions" component={GoalSolutionsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="GoalActionPlan" component={GoalActionPlanScreen} options={{ headerShown: false }} />
        <Stack.Screen name="GoalSummary" component={GoalSummaryScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
