import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapScreen from '@/screens/MapScreen';
import NoteListScreen from '@/screens/NoteListScreen';
import Ionicons from '@expo/vector-icons/Ionicons';
import AddNoteScreen from '@/screens/AddNoteScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStaticNavigation } from '@react-navigation/native';
import { NoteDetailsScreen } from '@/screens/NoteDetailsScreen';
import type { StaticParamList } from '@react-navigation/native';

const NotesStack = createNativeStackNavigator({
  screens: {
    List: {
      screen: NoteListScreen,
      title: 'Your Notes',
    },
    Details: {
      screen: NoteDetailsScreen,
    },
    Add: {
      screen: AddNoteScreen,
    },
  },
});

const HomeTabs = createBottomTabNavigator({
  screens: {
    Map: {
      screen: MapScreen,
      options: {
        tabBarIcon: ({ color, size }) => <Ionicons name='map' size={size} color={color} />,
      },
    },
    Notes: {
      screen: NotesStack,
      options: {
        headerShown: false,
        tabBarIcon: ({ color, size }) => <Ionicons name='list' size={size} color={color} />,
      },
    },
  },
});

const RootStack = createNativeStackNavigator({
  screens: {
    Home: {
      screen: HomeTabs,
      options: {
        headerShown: false,
      },
    },
  },
});

export type RootStackParamList = StaticParamList<typeof RootStack>;

export const Navigation = createStaticNavigation(RootStack);
