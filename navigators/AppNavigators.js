import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import database from '@react-native-firebase/database';
import { useState, useEffect } from 'react';

import Home from '../screens/Home';
import Detail1 from '../screens/Detail1';
import Detail4 from '../screens/Detail4';
import Detail5 from '../screens/Detail5';
import data from '../data/project2-197c0-default-rtdb-export.json'
import { Alert, Button, Text, View } from 'react-native';

    const Stack = createNativeStackNavigator();
    const AppNavigators = ({navigation}) => {

    const [Content,setContent] = useState(null);
    const [num,setNum] = useState(false);

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
      <>
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home" 
            screenOptions={{
              // header: ({route}) => <Text>{route.name}</Text>
      
                  }}
                  >   
                <Stack.Screen name="Detail1" component={Detail1} options={{animationEnabled: false, header: () => null}}/>
         
                <Stack.Screen name="Home" component={Home} options={{animationEnabled: false, header: () => null}}/>
                {/* <Stack.Screen name={`Search`} component={Detail1} options={{animationEnabled: true}}/> */}
                {Content && (Object.keys(Content).map( (key,i) => {
                 if(!key.match(/Search/gim) ) {

              return  (<Stack.Screen  
                
                key={i} name={`${key}`} component={Detail5} 
                // options={{animationEnabled: true}}
                options={ ({navigation })=>({
                  title:'',
                  headerRight:()=>(
                    <>
                    <Button
                    title='alert'
                    onPress={()=>{ navigation.navigate('Search') }}

                    >

                    </Button>
                    
                    </>
                  )
                })
                }
                />  )
              }else{

                return  <Stack.Screen name={`Search`} component={Detail1} options={{animationEnabled: true}}/>
                    
              }
              })
)
  }

           </Stack.Navigator>
        </NavigationContainer>
        </>
        )}
export default AppNavigators;