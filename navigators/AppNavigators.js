import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import database from '@react-native-firebase/database';
import {useState, useEffect} from 'react';

import Home from '../screens/Home';
import Detail1 from '../screens/Detail1';
import Detail4 from '../screens/Detail4';
import Detail5 from '../screens/Detail5';
import data from '../data/project2-197c0-default-rtdb-export.json';
import {
  Alert,
  Button,
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AppNavigators = () => {
  return (
    <Tab.Navigator
    // screenOptions={({ route }) => (
    //   console.log(route.name)

    // )}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          header: () => null,
          tabBarIcon: ({focused, color, size}) => {
            return (
              <View
                style={focused ? styles.tabItemActive : styles.tabItemInactive}>
                {/* <Image source={require('../assets/home.png')}
                style= {{width:35, height:35,color:'white'}}>
              </Image> */}
                <Ionicons
                  name="home-outline"
                  style={
                    focused ? styles.IconActive : styles.IconInActive
                  }></Ionicons>
              </View>
            );
          },

          tabBarLabel: () => {
            return null;
          },
        }}
      />
      <Tab.Screen
        name="Search"
        component={Detail1}
        options={{
          header: () => null,
          tabBarIcon: ({focused, color, size}) => {
            return (
              <View
                style={focused ? styles.tabItemActive : styles.tabItemInactive}>
                {/* <Image source={require('../assets/search.png')}
                  style= {{width:35, height:35,color:'white'}}>
                </Image> */}
                <Ionicons
                  name="search-outline"
                  style={
                    focused ? styles.IconActive : styles.IconInActive
                  }></Ionicons>
              </View>
            );
          },
          tabBarLabel: () => {
            return null;
          },
        }}
      />
    </Tab.Navigator>
  );
};

const StackNavigator = ({navigation}) => {
  const [Content, setContent] = useState(null);
  const [num, setNum] = useState(false);

  useEffect(() => {
    const reference = database().ref('/Law1');
    reference.on('value', snapshot => {
      setContent(snapshot.val());
    });
  }, []);

  function TopBarNav({route}) {
    <Text>{route.name}</Text>;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
      //       screenOptions={({ route }) => (
      //   console.log(route.name)

      // )}

      // initialRouteName="Home"
      // screenOptions={
      //   {
      //     header: ({route}) => <Text>{route.name}</Text>
      //   }
      // }
      >
        <Stack.Screen
          name="Home"
          component={AppNavigators}
          options={{animationEnabled: false, header: () => null}}
        />

        {/* <Stack.Screen name="Luật Cư Trú năm 2020" component={Detail5}  */}
        {/* /> */}

        {Content &&
          Object.keys(Content).map((key, i) => (
            <Stack.Screen
              key={i}
              name={`${key}`}
              component={Detail5}
              // options={{animationEnabled: true}}
              options={({navigation}) => ({
                title: '',
                headerRight: () => (
                  <>
                    <TouchableOpacity 
                    style={styles.iconInfoContainer} 
                    onPress={
                      () => {
                        // navigation.navigate('Search')
                            Alert.alert('Waring', 'Giai đoạn 2 đang cập nhật...');
                      }}
                      
                      >

                      <Ionicons
                        name="alert-outline"
                        style={styles.IconInfo}></Ionicons>
                    </TouchableOpacity>
                  </>
                ),
              })}
            />
          ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabItemActive: {
    width: '100%',
    height: '102%',
    // backgroundColor:'red',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'orange',
  },
  tabItemInactive: {
    width: '100%',
    height: '102%',
    backgroundColor: 'white',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  IconActive: {
    fontSize: 20,
    color: 'green',
  },
  IconInActive: {
    fontSize: 20,
    color: 'black',
  },
  IconInfo: {
    fontSize: 25,
    display: 'flex',
    color: 'white',
  },
  iconInfoContainer: {
    width: 50,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    borderRadius: 25,
  },
});
export default StackNavigator;
