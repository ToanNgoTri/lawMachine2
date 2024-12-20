import {NavigationContainer} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// import database from '@react-native-firebase/database';
import {useState, useEffect, useContext} from 'react';
import Home from '../screens/Home';
import {Detail1} from '../screens/Detail1';
import {Detail2} from '../screens/Detail2';
// import Detail4 from '../screens/Detail4';
import Detail5 from '../screens/Detail5';
import {useNetInfo} from '@react-native-community/netinfo';
import {ModalStatus} from '../App';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Dimensions,
  Image,
  useWindowDimensions,
} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';

import Ionicons from 'react-native-vector-icons/Ionicons';
// import {RefOfSearchLaw} from '../App';

// const renderScene = SceneMap({
//   Home: Home,
//   SearchLaw: Detail2,
//   SearchContent: Detail1,
// });

// const routes = [
//   {key: 'Home', title: 'Home'},
//   {key: 'SearchLaw', title: 'SearchLaw'},
//   {key: 'SearchContent', title: 'Search Content'},
//   // {key: 'SearchContent', title: 'Search Content'},
// ];

// const AppNavigators = () => {
//   const layout = useWindowDimensions();
//   const [index, setIndex] = useState(0);
  
// // let index = 1
//   // const RefLawSearch = useContext(RefOfSearchLaw);

//   return (
//     <TabView
//     animationEnabled={false}
//       tabBarPosition="bottom"
//       navigationState={{index, routes}}
//       renderTabBar={props => (
//         <TabBar
//           {...props}
//           // bounces={true}
//           indicatorStyle={{backgroundColor:'red',height:50,bottom:0,zIndex:10,opacity:1,borderTopWidth:3,borderTopColor:'black'}}
//           indicatorContainerStyle={{
//             // backgroundColor: 'green',
//             height: 50,
//             position: 'absolute',
//             zIndex:10,
//             opacity:.2
//           }}
// //           renderTabBar={({route})=>{

// // console.log('props',props);


// //             return (
// //               <View>
// //                 {props.navigationState.routes.map((key,i)=>(
// //               <Pressable
// //               onPress={() => {
// //                 props.jumpTo(route.key);
// //               }}>
// //               <View
// //                 style={{
// //                   alignItems: 'center',
// //                   width: layout.width/3,
// //                   height: '100%',
// //                   backgroundColor: 'gray',
// //                   paddingBottom:5,
// //                   paddingTop:5
// //                 }}>
// //                 <Ionicons
// //                   name={
// //                     route.key == 'Home'
// //                       ? 'home-outline'
// //                       : route.key == 'SearchLaw'
// //                       ? 'albums-outline'
// //                       : 'search-outline'
// //                   }
// //                   style={
// //                     styles.IconActive
// //                   }></Ionicons>
// //                 <Text
// //                   style={{
// //                     ...(styles.IconActive),
// //                     fontSize: 10,
// //                   }}>
// //                   {route.key == 'Home'
// //                     ? 'Downloaded'
// //                     : route.key == 'SearchLaw'
// //                     ? 'Search Law'
// //                     : 'Search'}
// //                 </Text>
// //               </View>
// //             </Pressable>

// //                 ))}

// //               </View>
// //             );


// //           }}
//           renderTabBarItem={({route}) => {
            
//             let focus = props.navigationState.routes[index].key == route.key

//             return (
//               <Pressable
//                 onPress={() => {
//                   props.jumpTo(route.key);
//                 }}>
//                 <View
//                   style={{
//                     alignItems: 'center',
//                     width: layout.width/3,
//                     height: 50,
//                     backgroundColor: 'white',
//                     paddingBottom:5,
//                     paddingTop:5,
//                     backgroundColor:'orange',
//                     alignContent:'center',
//                     justifyContent:'center',
//                     display:'flex'
//                   }}>
//                   <Ionicons
//                     name={
//                       route.key == 'Home'
//                         ? 'home-outline'
//                         : route.key == 'SearchLaw'
//                         ? 'albums-outline'
//                         : 'search-outline'
//                     }
//                     style={
//                       focus  ?  styles.IconActive :  styles.IconInActive
//                     }></Ionicons>
//                   <Text
//                     style={{
//                       ...( focus  ?  styles.IconActive :  styles.IconInActive
//                       ),
//                       fontSize: 10,
//                     }}>
//                     {route.key == 'Home'
//                       ? 'Downloaded'
//                       : route.key == 'SearchLaw'
//                       ? 'Search Law'
//                       : 'Search Content'}
//                   </Text>
//                 </View>
//               </Pressable>
//             );
//           }}
//           pressColor="orange"
//         />
//       )}
//       renderScene={renderScene}
//       onIndexChange={setIndex}
//       initialLayout={{width: layout.width}}
     
//     />
//   );
// };

const Tab = createMaterialTopTabNavigator();

const AppNavigators = () => {
  return (
    <Tab.Navigator
    
    tabBarPosition='bottom'
      screenOptions={({route}) => ({
        tabBarPressColor:'#FFCC66',
        animationEnabled: false,
        animation: 'shift',
        lazy: true,
        tabBarIndicatorStyle:{backgroundColor:'#336600',top:-1,margin:0,padding:0},
        tabBarStyle: {
          postion: 'absolute',
          height:50,
          borderWidth:.5,
          borderColor:'#DDDDDD',
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          header: () => null,
          tabBarIcon: ({focused, color, size}) => {
            return (
              <View
                style={{alignItems: 'center',top:-5, minWidth: 80
                }}
                >
                <Ionicons
                  name="home-outline"
                  style={
                    focused ? styles.IconActive : styles.IconInActive
                  }></Ionicons>
                <Text
                  style={{
                    ...(focused ? styles.IconActive : styles.IconInActive),
                    fontSize: 13,fontWeight:'bold',bottom:2
                  }}>
                  Đã tải xuống
                </Text>
              </View>
            );
          },

          tabBarLabel: () => {
            return null;
          },
        }}
        listeners={{
          tabPress: props => {
          },
        }}
      />
      <Tab.Screen
        name="SearchLaw"
        component={Detail2}
        options={{
          header: () => null,
          tabBarIcon: ({focused, color, size}) => {
            return (
              <View
                style={{alignItems: 'center',top:-5, minWidth: 80}}>
                <Ionicons
                  name="albums-outline"
                  style={
                    focused ? styles.IconActive : styles.IconInActive
                  }></Ionicons>
                <Text
                  style={{
                    ...(focused ? styles.IconActive : styles.IconInActive),
                    fontSize: 13,fontWeight:'bold',bottom:2
                  }}>
                  Tìm văn bản
                </Text>
              </View>
            );
          },
          tabBarLabel: () => {
            return null;
          },
        }}
        listeners={{
          tabPress: props => {
            // SearchScrollview.forSearch.current.scrollTo({y: 0});
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
                // style={focused ? {...styles.tabItemActive,width:widthTab,height:(widthTab>heightTab?'108%':'104%')} : styles.tabItemInactive}
                style={{alignItems: 'center',top:-5, minWidth: 80}}>
                <Ionicons
                  name="search-outline"
                  style={
                    focused ? styles.IconActive : styles.IconInActive
                  }></Ionicons>
                <Text
                  style={{
                    ...(focused ? styles.IconActive : styles.IconInActive),
                    fontSize: 13,fontWeight:'bold',bottom:2
                  }}>
                  Tìm nội dung
                </Text>
              </View>
            );
          },
          tabBarLabel: () => {
            return null;
          },
        }}
        listeners={{
          tabPress: props => {
            // SearchScrollview.forSearch.current.scrollTo({y: 0});
          },
        }}
      />
    </Tab.Navigator>
  );
};

const Stack = createNativeStackNavigator();

const StackNavigator = () => {

  const ModalVisibleStatus = useContext(ModalStatus);

  const netInfo = useNetInfo();
  let internetConnected = netInfo.isConnected;

  const dispatch = useDispatch();


  // async function callAllSearchLaw() {
  //   let info = await fetch(`https://us-central1-project2-197c0.cloudfunctions.net/stackscreen`,{
  //     method: 'GET',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //     // body:JSON.stringify({screen:1})
  //   })
    
  //   let respond = await info.json()
  //   return respond
  // }
    
     useEffect(() => {
      if(internetConnected){

        // dispatch({type: 'stackscreen'})
      }

      // callAllSearchLaw().then(res=>inf.updateInfo(res))
    }, [internetConnected])
     
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="HomeStack"
          component={AppNavigators}
          options={{animationEnabled: false, header: () => null}}
        />

        <Stack.Screen
          name={`accessLaw`}
          component={Detail5}
          options={({navigation}) => ({
            headerBackVisible: false,
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  name="chevron-back-outline"
                  style={styles.IconInfo}></Ionicons>
              </TouchableOpacity>
            ), // headerStyle: { backgroundColor: 'black',alignItems:'center',justifyContent:'flex-end',display:'flex',padding:100 },
            headerTitleAlign: 'center',
            animation: 'fade_from_bottom',
            animationTypeForReplace: 'push',
            title: '',
            headerTitle: props => (
              <TouchableOpacity
                style={{
                  backgroundColor: 'green',
                  height: '60%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  borderRadius: 30,
                }}
                onPress={() => navigation.popToTop()}>
                <Image source={require('../assets/t.png')}></Image>
              </TouchableOpacity>
            ),
            headerRight: () => (
              <View style={{alignItems: 'center'}}>
                <TouchableOpacity
                  style={styles.iconInfoContainer}
                  onPress={() => {
                    // navigation.navigate('Search')
                    ModalVisibleStatus.updateModalStatus(true);
                  }}>
                  <Ionicons
                    name="document-text-outline"
                    style={styles.IconInfo}></Ionicons>
                </TouchableOpacity>
              </View>
            ),
          })}
        />
        {/* ))} */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  // tabItemActive: {
  //   // backgroundColor:'red',
  //   width: '100%',
  //   // right:0,
  //   // left:100,
  //   height: '104%',
  //   position: 'relative',
  //   display: 'flex',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   borderTopColor: 'red',
  //   borderTopWidth: 4,
  //   overflow: 'hidden',
  // },
  tabItemInactive: {
    position: 'relative',
    // width: '100%',
    height: '102%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  IconActive: {
    fontSize: 24,
    color: 'green',
    // transform:animatedValue
  },
  IconInActive: {
    fontSize: 24,
    color: 'black',
  },
  IconInfo: {
    fontSize: 30,
    display: 'flex',
    color: 'black',
  },
  iconInfoContainer: {
    // width: 50,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'black',
    borderRadius: 25,
  },
});
export default StackNavigator;
