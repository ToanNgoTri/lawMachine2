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
import {Alert, Button, Text, View,Image} from 'react-native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AppNavigators = () => {
  return (
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{header: () => null,
            tabBarIcon: () => (
              <Image source={require('../assets/home.png')}
                style= {{width:25, height:25,color:'red',backgroundColor:'transparent',position: 'absolute',}}>
              </Image>
            ),
  }}
        />
        <Tab.Screen
          name="Search"
          component={Detail1}
          options={{header: () => null,
          tabBarIcon: () => (
            <Image source={require('../assets/search.png')}
              style= {{width:25, height:25}}>

              </Image>)
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
        // initialRouteName="Home"
        // screenOptions={
        //   {
        //     header: ({route}) => <Text>{route.name}</Text>
        //   }
        // }
        >
         
                <Stack.Screen name="Home" component={AppNavigators} options={{animationEnabled: false, header: () => null}}/>

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
                        <Button
                          title="alert"
                          onPress={() => {
                            Alert.alert('Waring', 'Giai đoạn 2 đang cập nhật...');
                          }}></Button>
                      </>
                    ),
                  })}
                />
              ))
          }
      </Stack.Navigator>
      </NavigationContainer>
  );
};

export default StackNavigator;
