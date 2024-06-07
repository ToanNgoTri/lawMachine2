import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import database from '@react-native-firebase/database';
import { useState, useEffect } from 'react';

import Home from '../screens/Home';
import Detail1 from '../screens/Detail1';
import Firebase from '../screens/Detail4';
import Detail5 from '../screens/Detail5';
import data from '../data/project2-197c0-default-rtdb-export.json'
import { Text } from 'react-native';

    const Stack = createNativeStackNavigator();
    const AppNavigators = () => {

    const [Content,setContent] = useState(null);

    useEffect( ()=>{
          
      const reference = database().ref('/Law1');
    reference.on('value', snapshot => {
      setContent(snapshot.val())
    });

}
,[])

    function TopBarNav({route}){
      <Text>{route.name}</Text>
    }



    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home" 
            // screenOptions={{
            //   header: ({route}) => <Text>{route.name}</Text>
            //       }}
                  >            
                <Stack.Screen name="Home" component={Home} options={{animationEnabled: false, header: () => null}}/>
                <Stack.Screen name={`Search`} component={Detail1} options={{animationEnabled: true}}/>
                {Content && (Object.keys(Content).map( (key,i) => (

                <Stack.Screen  
                
                key={i} name={`${key}`} component={Detail5} options={{animationEnabled: true}}/>       

))
)
  }


                {/* <Stack.Screen name="Luật Cư Trú 2020" component={Detail1} options={{animationEnabled: true}}/>
                <Stack.Screen name="Luật Tín ngưỡng, tôn giáo 2016" component={Detail2} options={{animationEnabled: true}}/>
                <Stack.Screen name="Luật Viễn Thông 2023" component={Detail3} options={{animationEnabled: true}}/>
                <Stack.Screen name="FireBase" component={Firebase} options={{animationEnabled: true}}/>
                <Stack.Screen name="addFirebase" component={addFirebase} options={{animationEnabled: true}}/> */}
           </Stack.Navigator>
        </NavigationContainer>
        )}
export default AppNavigators;