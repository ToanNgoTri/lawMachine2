import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import database from '@react-native-firebase/database';
import {useState, useEffect, useContext} from 'react';
import Home from '../screens/Home';
import {Detail1} from '../screens/Detail1';
import {Detail2} from '../screens/Detail2';
// import Detail4 from '../screens/Detail4';
import Detail5 from '../screens/Detail5';
import {Dirs, FileSystem} from 'react-native-file-access';
import {InfoDownloaded} from '../App';
import {ModalStatus} from '../App';
import {
  Alert,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
  Button
} from 'react-native';
import dataOrg from '../data/project2-197c0-default-rtdb-export.json';

import Ionicons from 'react-native-vector-icons/Ionicons';
// import {useNetInfo} from "@react-native-community/netinfo";
import {useSelector, useDispatch} from 'react-redux';

const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

const AppNavigators = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        lazy: true,
        tabBarStyle: {
          postion: 'absolute',
          // backgroundColor:'blue',
        },
        // khi app chạy thì sẽ sẽ chạy hết tất cả các tab đồng loạt chứ không phải nhấn vô mới load
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          header: () => null,
          tabBarIcon: ({focused, color, size}) => {
            return (
              <Animated.View
                style={{alignItems: 'center', minWidth: 80}}>
                <Ionicons
                  name="home-outline"
                  style={
                    focused ? styles.IconActive : styles.IconInActive
                  }></Ionicons>
                <Text
                  style={{
                    ...(focused ? styles.IconActive : styles.IconInActive),
                    fontSize: 10,
                  }}>
                  Downloaded
                </Text>
              </Animated.View>
            );
          },

          tabBarLabel: () => {
            return null;
          },
        }}
        listeners={{
          tabPress: props => {
            // HomeFlatlist.forHome.current.scrollToOffset({ animated: true, offset: 0 });
          },
        }}
        an
      />
      <Tab.Screen
        name="SearchLaw"
        component={Detail2}
        options={{
          header: () => null,
          tabBarIcon: ({focused, color, size}) => {
            return (
              <View
                // style={focused ? {...styles.tabItemActive,width:widthTab,height:(widthTab>heightTab?'108%':'104%')} : styles.tabItemInactive}
                style={{alignItems: 'center', minWidth: 80}}>
                <Ionicons
                  name="albums-outline"
                  style={
                    focused ? styles.IconActive : styles.IconInActive
                  }></Ionicons>
                <Text
                  style={{
                    ...(focused ? styles.IconActive : styles.IconInActive),
                    fontSize: 10,
                  }}>
                  Search Law
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
                style={{alignItems: 'center', minWidth: 80}}>
                <Ionicons
                  name="search-outline"
                  style={
                    focused ? styles.IconActive : styles.IconInActive
                  }></Ionicons>
                <Text
                  style={{
                    ...(focused ? styles.IconActive : styles.IconInActive),
                    fontSize: 10,
                  }}>
                  Search Content
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

const StackNavigator = () => {
  const [Content, setContent] = useState(Object.keys(dataOrg['LawInfo']));
  // const [Content, setContent] = useState(['01/2022/NQ-HĐTP']);
  const ModalVisibleStatus = useContext(ModalStatus);
  const info = useContext(InfoDownloaded);

  async function getContentExist() {
    if (await FileSystem.exists(Dirs.CacheDir + '/Content.txt', 'utf8')) {
      const FileInfoStringInfo = await FileSystem.readFile(
        Dirs.CacheDir + '/Info.txt',
        'utf8',
      );
      if (FileInfoStringInfo) {
        return [...Object.keys(dataOrg['LawInfo']), ...Object.keys(JSON.parse(FileInfoStringInfo))];
      }
      // f = JSON.parse(FileInfoStringInfo)
    }
  }


  async function getStackScreen() {
    let info =  await fetch(`http://192.168.0.101:5000/stackscreen`,{
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      // body:JSON.stringify({input:state.input})
    })
    
    
    let b = await info.json()
return b
  }


  useEffect(() => {
    getContentExist().then(cont => {
      if(cont){        
        setContent(cont);
        info.updateInfo(cont);
      }
      // console.log('cont',cont);
    });

    // database()
    //   .ref(`/LawInfo`)
    //   .once('value')
    //   .then(snapshot => {
    //     if(Boolean(snapshot.val())){
          
    //       // info.updateInfo(Object.keys(snapshot.val()));
          
    //       setContent(Object.keys(snapshot.val())); /////////////////////////////////////////////////////////////////  nên sửa

    //     }
    //   });

  getStackScreen().then(id=>setContent(id))
  }, []);
useEffect(() => {// kiem tra xem k co mang xai dc k

let b ={}
if(!Array.isArray(Content)){
  Object.keys(Content).map((key,i)=>{
    b[key] = Content[key]['lawNameDisplay']
    
  })
  info.updateInfo(b);
}
  // console.log('b',b);
  // console.log('Content',Content);

}, [Content])


  function TopBarNav({route}) {
    <Text>{route.name}</Text>;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="HomeStack"
          component={AppNavigators}
          options={{animationEnabled: false, header: () => null,}}
        />

        {/* {(Content) &&
          (Content).map((id, i) => ( */}
            <Stack.Screen
              // key={i}
              // name={`${id._id}`}
              name={`accessLaw`}
              component={Detail5}
              options={({navigation, route}) => ({
                headerBackVisible: false ,
                headerLeft: () =>   <TouchableOpacity onPress={()=>navigation.goBack()}><Ionicons
                name="chevron-back-outline"
                style={styles.IconInfo}></Ionicons></TouchableOpacity>,                // headerStyle: { backgroundColor: 'black',alignItems:'center',justifyContent:'flex-end',display:'flex',padding:100 },
                headerTitleAlign: 'center',
                animation: 'slide_from_right',
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
