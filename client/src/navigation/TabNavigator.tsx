import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapScreen from '@/screens/MapScreen';
import NoteListScreen from '@/screens/NoteListScreen';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NoteStack } from '../navigation/NoteStack';

const Tab = createBottomTabNavigator();

export function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name='Map'
        component={MapScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'map' : 'map-outline'} // Example: different icon for focused state
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name='Notes'
        component={NoteStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'list' : 'list-outline'} // Example: different icon for focused state
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
