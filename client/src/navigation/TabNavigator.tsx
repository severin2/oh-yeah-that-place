import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MapScreen from "@/screens/MapScreen";
import NoteListScreen from "@/screens/NoteListScreen";
import Ionicons from "@expo/vector-icons/Ionicons";
import AddNoteScreen from "@/screens/AddNoteScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { NoteDetailsScreen } from "@/screens/NoteDetailsScreen";
import { PlaceNote } from "@shared/api/placeNote";

export type NotesStackParamList = {
  List: undefined;
  Details: { note: PlaceNote };
  Add: undefined;
};

export type RootTabParamList = {
  Map: undefined;
  Notes: undefined;
};

const Stack = createNativeStackNavigator<NotesStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

function NotesNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="List"
        component={NoteListScreen}
        options={{ title: "Your Notes" }}
      />
      <Stack.Screen name="Details" component={NoteDetailsScreen} />
      <Stack.Screen name="Add" component={AddNoteScreen} />
    </Stack.Navigator>
  );
}

export function Navigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Map"
          component={MapScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="map" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Notes"
          component={NotesNavigator}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="list" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
