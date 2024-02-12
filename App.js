import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { Home } from './components/Home';
import { StatusBar } from 'react-native';

const Drawer = createDrawerNavigator()

export default function App() {
  return (
    
    <NavigationContainer>
      <StatusBar false />
      <Drawer.Navigator
        screenOptions={{
          drawerActiveTintColor: "#fff",
          swipeEdgeWidth: 100,
          drawerLabelStyle: { color: "white" },
          headerStyle: { backgroundColor: "#6c757d" },
          headerTitleStyle: { color: "white" },
          drawerIcon : ()=>{color:"white"},
          headerTintColor: "white",
          drawerStyle: { backgroundColor: "#6c757d" }
        }}>
        <Drawer.Screen name='Home' component={Home} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}