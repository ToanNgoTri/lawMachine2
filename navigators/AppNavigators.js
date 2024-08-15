import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import database from '@react-native-firebase/database';
import {useState, useEffect,useContext,useRef} from 'react';
import {dataLaw} from '../App';

import Home from '../screens/Home';
import {Detail1} from '../screens/Detail1';
import Detail4 from '../screens/Detail4';
import Detail5 from '../screens/Detail5';
import {RefForSearch} from '../App'
import {RefForHome} from '../App'
import data from '../data/project2-197c0-default-rtdb-export.json';
import {
  Alert,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions

} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNetInfo} from "@react-native-community/netinfo";


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AppNavigators = () => {
  // const [tabName, setTabName] = useState('home');

  const animatedValue = useRef(new Animated.Value(1)).current

  const SearchScrollview = useContext(RefForSearch)
  const HomeFlatlist = useContext(RefForHome)

  // console.log(context.value);

  // useEffect(()=>{
  //   Animated.timing(animatedValue, {
  //     toValue:10,
  //     duration: 500,
  //     useNativeDriver: false,
  //   }).start();
  // },[animatedValue])

  const { width, height } = Dimensions.get("window");
  let heightTab=height/2;
  let widthTab=width/2;
  Dimensions.addEventListener("change", ({ window: { width, height } }) => {
    // console.log(`Width: ${width}, Height: ${height}`);
    widthTab=width/2;
    heightTab=height/2
    
  });  


  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        lazy:false                                          // khi app chạy thì sẽ sẽ chạy hết tất cả các tab đồng loạt chứ không phải nhấn vô mới load
  })
}
      
      // screenOptions={
        
      //   ({route, navigation}) => ({
      //   tabBarIcon: ({focused, color, size}) => {
      //     return (
      //       <View
      //         style={{
      //           width: '1000%',
      //           height: 50,
      //           left: 0,
      //           display: 'flex',
      //           flexDirection: 'row',
      //           backgroundColor:'red'
      //         }}>
      //         <TouchableOpacity
      //           style={
      //             tabName == 'home'
      //               ? styles.tabItemActive
      //               : styles.tabItemInactive
      //           }
      //           onPress={() => {
      //             setTabName('home');
      //             navigation.navigate('Home');
      //           }}>
      //           <Ionicons
      //             name="home-outline"
      //             style={
      //               tabName == 'home' ? styles.IconActive : styles.IconInActive
      //             }></Ionicons>
      //         </TouchableOpacity>
      //         <TouchableOpacity
      //           style={
      //             tabName == 'search'
      //               ? styles.tabItemActive
      //               : styles.tabItemInactive
      //           }
      //           onPress={() => {
      //             setTabName('search');
      //             navigation.navigate('Search');
      //           }}>
      //           <Ionicons
      //             name="search-outline"
      //             style={
      //               tabName == 'search'
      //                 ? styles.IconActive
      //                 : styles.IconInActive
      //             }></Ionicons>
      //         </TouchableOpacity>
      //       </View>
      //     );
      //   },
      // })}
      // lazy={false}                                   ///////////////////// mới bỏ có sao hông
      >
        
      <Tab.Screen
      
        name="Home"
        component={Home}
        options={{
          header: () => null,
          tabBarIcon: ({focused, color, size}) => {
            return (
              <Animated.View
        //         style={focused ? {width: '100%',
        //         height: '102%',
        //         position: 'relative',
        //         display: 'flex',
        //         alignItems: 'center',
        //         justifyContent: 'center',
        //         borderTopColor:'red',
        //         borderTopWidth:animatedValue,
        //     } : {    position: 'relative',
        //     width: '100%',
        //     height: '102%',
        //     display: 'flex',
        //     alignItems: 'center',
        //     justifyContent: 'center',
        //     borderTopWidth:0,

        // }}
        style={focused ? {...styles.tabItemActive,width:widthTab,height:(widthTab>heightTab?'108%':'104%')} : styles.tabItemInactive}

        >
                <Ionicons
                  name="home-outline"
                  style={
                    focused ? styles.IconActive : styles.IconInActive
                  }></Ionicons>
              </Animated.View>
            );
          },

          tabBarLabel: () => {
            return null;
          },
          
        }}
        listeners={{
          tabPress: (props)=>{
              HomeFlatlist.forHome.current.scrollToOffset({ animated: true, offset: 0 });
          }
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
                style={focused ? {...styles.tabItemActive,width:widthTab,height:(widthTab>heightTab?'108%':'104%')} : styles.tabItemInactive}>
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
        listeners={{
          tabPress: (props)=>{
            // const { route, index, focused } = scene;
            // console.log(navigation);
            SearchScrollview.forSearch.current.scrollTo({y: 0});
          }
        }}

      />
    </Tab.Navigator>
  );
};

const StackNavigator = () => {
  const [Content, setContent] = useState(null);
  const dataLawContent = useContext(dataLaw);

  const netInfo = useNetInfo();
  let internetConnected = netInfo.isConnected

  useEffect(() => {

    // if(internetConnected){
    // const reference = database().ref('/Law1');
    // reference.on('value', snapshot => {
    //   setContent(snapshot.val());
    // });
    //   }else{
        // setContent(data);
        setContent(dataLawContent.dataLawForApp)

      // }

  }, [dataLawContent.dataLawForApp]);

  
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
          name="home"
          component={AppNavigators}
          options={{animationEnabled: false, header: () => null}}
          
        />

        {Content &&
          Object.keys(Content).map((key, i) => (
            <Stack.Screen
              key={i}
              name={`${key}`}
              component={Detail5}
              // options={{animationEnabled: true}}
              options={() => ({
                title: '',
                headerRight: () => (
                  <>
                    <TouchableOpacity
                      style={styles.iconInfoContainer}
                      onPress={() => {
                        // navigation.navigate('Search')
                        Alert.alert('Waring', 'Giai đoạn 2 đang cập nhật...');
                      }}>
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
    // backgroundColor:'red',
    width: '100%',
    // right:0,
    // left:100,
    height: '104%',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopColor:'red',
    borderTopWidth:4,
    overflow:'hidden',
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
