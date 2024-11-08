import {NavigationContainer} from '@react-navigation/native';
import {createStaticNavigation,useIsFocused} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import database from '@react-native-firebase/database';
import {useState, useEffect, useContext} from 'react';
import Home from '../screens/Home';
import {Detail1} from '../screens/Detail1';
import {Detail2} from '../screens/Detail2';
// import Detail4 from '../screens/Detail4';
import Detail5 from '../screens/Detail5';
import {InfoDownloaded} from '../App';
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

const renderScene = SceneMap({
  Home: Home,
  SearchLaw: Detail2,
  SearchContent: Detail1,
});

const routes = [
  {key: 'Home', title: 'Home'},
  {key: 'SearchLaw', title: 'SearchLaw'},
  {key: 'SearchContent', title: 'Search Content'},
];

const AppNavigators = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  

  // const RefLawSearch = useContext(RefOfSearchLaw);

  return (
    <TabView
      tabBarPosition="bottom"
      navigationState={{index, routes}}
    
      renderTabBar={props => (
        <TabBar
          {...props}
          bounces={true}
          indicatorStyle={{backgroundColor:'red',height:50,bottom:0,zIndex:10,opacity:1,borderTopWidth:3,borderTopColor:'black'}}
          indicatorContainerStyle={{
            // backgroundColor: 'green',
            height: 50,
            position: 'absolute',
            zIndex:10,
            opacity:.2
          }}
//           renderTabBar={({route})=>{

// console.log('props',props);


//             return (
//               <View>
//                 {props.navigationState.routes.map((key,i)=>(
//               <Pressable
//               onPress={() => {
//                 props.jumpTo(route.key);
//               }}>
//               <View
//                 style={{
//                   alignItems: 'center',
//                   width: layout.width/3,
//                   height: '100%',
//                   backgroundColor: 'gray',
//                   paddingBottom:5,
//                   paddingTop:5
//                 }}>
//                 <Ionicons
//                   name={
//                     route.key == 'Home'
//                       ? 'home-outline'
//                       : route.key == 'SearchLaw'
//                       ? 'albums-outline'
//                       : 'search-outline'
//                   }
//                   style={
//                     styles.IconActive
//                   }></Ionicons>
//                 <Text
//                   style={{
//                     ...(styles.IconActive),
//                     fontSize: 10,
//                   }}>
//                   {route.key == 'Home'
//                     ? 'Downloaded'
//                     : route.key == 'SearchLaw'
//                     ? 'Search Law'
//                     : 'Search'}
//                 </Text>
//               </View>
//             </Pressable>

//                 ))}

//               </View>
//             );


//           }}
          renderTabBarItem={({route}) => {
            
            let focus = props.navigationState.routes[index].key == route.key

            return (
              <Pressable
                onPress={() => {
                  props.jumpTo(route.key);
                }}>
                <View
                  style={{
                    alignItems: 'center',
                    width: layout.width/3,
                    height: 50,
                    backgroundColor: 'white',
                    paddingBottom:5,
                    paddingTop:5,
                    backgroundColor:'orange',
                    alignContent:'center',
                    justifyContent:'center',
                    display:'flex'
                  }}>
                  <Ionicons
                    name={
                      route.key == 'Home'
                        ? 'home-outline'
                        : route.key == 'SearchLaw'
                        ? 'albums-outline'
                        : 'search-outline'
                    }
                    style={
                      focus  ?  styles.IconActive :  styles.IconInActive
                    }></Ionicons>
                  <Text
                    style={{
                      ...( focus  ?  styles.IconActive :  styles.IconInActive
                      ),
                      fontSize: 10,
                    }}>
                    {route.key == 'Home'
                      ? 'Downloaded'
                      : route.key == 'SearchLaw'
                      ? 'Search Law'
                      : 'Search Content'}
                  </Text>
                </View>
              </Pressable>
            );
          }}
          pressColor="orange"
        />
      )}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{width: layout.width}}
     
    />
  );
};

// const Tab = createBottomTabNavigator();

// const AppNavigators = () => {
//   return (
//     <Tab.Navigator
//       screenOptions={({route}) => ({
//         animation: 'shift',
//         lazy: true,
//         tabBarStyle: {
//           postion: 'absolute',
//           // animation: 'fade',
//         },
//       })}
//     >
//       <Tab.Screen
//         name="Home"
//         component={Home}
//         options={{
//           header: () => null,
//           tabBarIcon: ({focused, color, size}) => {
//             return (
//               <Animated.View
//                 style={{alignItems: 'center', minWidth: 80,height:'100%'}}>
//                 <Ionicons
//                   name="home-outline"
//                   style={
//                     focused ? styles.IconActive : styles.IconInActive
//                   }></Ionicons>
//                 <Text
//                   style={{
//                     ...(focused ? styles.IconActive : styles.IconInActive),
//                     fontSize: 10,
//                   }}>
//                   Downloaded
//                 </Text>
//               </Animated.View>
//             );
//           },

//           tabBarLabel: () => {
//             return null;
//           },
//         }}
//         listeners={{
//           tabPress: props => {
//           },
//         }}
//         an
//       />
//       <Tab.Screen
//         name="SearchLaw"
//         component={Detail2}
//         options={{
//           header: () => null,
//           tabBarIcon: ({focused, color, size}) => {
//             return (
//               <View
//                 style={{alignItems: 'center', minWidth: 80,height:'100%'}}>
//                 <Ionicons
//                   name="albums-outline"
//                   style={
//                     focused ? styles.IconActive : styles.IconInActive
//                   }></Ionicons>
//                 <Text
//                   style={{
//                     ...(focused ? styles.IconActive : styles.IconInActive),
//                     fontSize: 10,
//                   }}>
//                   Search Law
//                 </Text>
//               </View>
//             );
//           },
//           tabBarLabel: () => {
//             return null;
//           },
//         }}
//         listeners={{
//           tabPress: props => {
//             // SearchScrollview.forSearch.current.scrollTo({y: 0});
//           },
//         }}
//       />
//       <Tab.Screen
//         name="Search"
//         component={Detail1}
//         options={{
//           header: () => null,
//           tabBarIcon: ({focused, color, size}) => {
//             return (
//               <View
//                 // style={focused ? {...styles.tabItemActive,width:widthTab,height:(widthTab>heightTab?'108%':'104%')} : styles.tabItemInactive}
//                 style={{alignItems: 'center', minWidth: 80,height:'100%'}}>
//                 <Ionicons
//                   name="search-outline"
//                   style={
//                     focused ? styles.IconActive : styles.IconInActive
//                   }></Ionicons>
//                 <Text
//                   style={{
//                     ...(focused ? styles.IconActive : styles.IconInActive),
//                     fontSize: 10,
//                   }}>
//                   Search Content
//                 </Text>
//               </View>
//             );
//           },
//           tabBarLabel: () => {
//             return null;
//           },
//         }}
//         listeners={{
//           tabPress: props => {
//             // SearchScrollview.forSearch.current.scrollTo({y: 0});
//           },
//         }}
//       />
//     </Tab.Navigator>
//   );
// };

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  // const [Content, setContent] = useState(Object.keys(dataOrg['LawInfo']));
  const ModalVisibleStatus = useContext(ModalStatus);
  // const info = useContext(InfoDownloaded);

  // async function getContentExist() {
  //   if (await FileSystem.exists(Dirs.CacheDir + '/Content.txt', 'utf8')) {
  //     const FileInfoStringInfo = await FileSystem.readFile(
  //       Dirs.CacheDir + '/Info.txt',
  //       'utf8',
  //     );
  //     if (FileInfoStringInfo) {
  //       return [...Object.keys(dataOrg['LawInfo']), ...Object.keys(JSON.parse(FileInfoStringInfo))];
  //     }
  //     // f = JSON.parse(FileInfoStringInfo)
  //   }
  // }

  //   async function getStackScreen() {
  //     let info =  await fetch(`http://192.168.0.101:5000/stackscreen`,{
  //       method: 'GET',
  //       headers: {
  //         Accept: 'application/json',
  //         'Content-Type': 'application/json',
  //       },
  //       // body:JSON.stringify({input:state.input})
  //     })

  //     let b = await info.json()
  // return b
  //   }

  //   useEffect(() => {
  //     getContentExist().then(cont => {
  //       if(cont){
  //         setContent(cont);
  //         info.updateInfo(cont);
  //       }
  //     });

  //   getStackScreen().then(id=>setContent(id))
  //   }, []);
  // useEffect(() => {// kiem tra xem k co mang xai dc k

  // let b ={}
  // if(!Array.isArray(Content)){
  //   Object.keys(Content).map((key,i)=>{
  //     b[key] = Content[key]['lawNameDisplay']

  //   })
  //   info.updateInfo(b);
  // }
  // }, [Content])

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
                  backgroundColor: 'yellow',
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
                    name="information-circle-outline"
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
  tabItemActive: {
    // backgroundColor:'red',
    width: '100%',
    // right:0,
    // left:100,
    height: '104%',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopColor: 'red',
    borderTopWidth: 4,
    overflow: 'hidden',
  },
  tabItemInactive: {
    position: 'relative',
    // width: '100%',
    height: '102%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  IconActive: {
    fontSize: 23,
    color: 'red',
    // transform:animatedValue
  },
  IconInActive: {
    fontSize: 23,
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
