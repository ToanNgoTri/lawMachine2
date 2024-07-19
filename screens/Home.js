import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  TextInput,
  FlatList,
  ActivityIndicator,
  Image,
  Keyboard,
  Animated,
} from 'react-native';
import database from '@react-native-firebase/database';
import {useState, useEffect, useContext, useRef,} from 'react';
import data from '../data/project2-197c0-default-rtdb-export.json';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {RefForHome} from '../App';
import {useNetInfo} from '@react-native-community/netinfo';

export default function Home({navigation}) {
  const [Content, setContent] = useState('');
  // sử dụng để đọc realtime database, data được xuất ra ở dưới dạng object rồi không cần JSON.parse

  const [showContent, setShowContent] = useState([]);

  const [inputSearchLaw, setInputSearchLaw] = useState('');
  const [searchLawResult, setSearchLawResult] = useState([]);
  const [currentPaper, setCurrentPaper] = useState(1);
  const [totalPaper, setTotalPaper] = useState(2);

  const HomeFlatlist = useContext(RefForHome);

  const [showWanringInternet, setShowWanringInternet] = useState(false);

  const list1 = useRef(null);



  const animated = useRef(new Animated.Value(0)).current;

  let Opacity = animated.interpolate({
    inputRange: [0,25,50,100],
    outputRange: [1,0,0, 0],
  });

  let TranslateY = animated.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 100],
  });

  HomeFlatlist.updateHome(list1);

  const reference = database().ref('/Law1');
  const Render = ({item}) => {

    let name =item.replace(/\\/img,'\/')
    
    return (
      <TouchableOpacity onPress={() => navigation.navigate(`${item}`)}>
        <View style={styles.item}>
          <Text style={styles.text}>{name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderLoader = () => {
    return (
      <View>
        <ActivityIndicator size="large" color="#aaa" />
      </View>
    );
  };

  useEffect(() => {
    setSearchLawResult(
      Content &&
        Content.filter(item => {
          if (
            inputSearchLaw.match(/(\w+|\(|\)|\.|\+|\-|\,|\&|\?|\;|\!|\s?)/gim)
          ) {
            let inputSearchLawReg = inputSearchLaw;
            if (inputSearchLaw.match(/\(/gim)) {
              inputSearchLawReg = inputSearchLaw.replace(/\(/gim, '\\(');
            }

            if (inputSearchLaw.match(/\)/gim)) {
              inputSearchLawReg = inputSearchLawReg.replace(/\)/gim, '\\)');
            }
            if (inputSearchLaw.match(/\//gim)) {
              inputSearchLawReg = inputSearchLawReg.replace(/\//gim, '.');
            }
            if (inputSearchLaw.match(/\\/gim)) {
              inputSearchLawReg = inputSearchLawReg.replace(/\\/gim, '.');
            }
            if (inputSearchLaw.match(/\./gim)) {
              inputSearchLawReg = inputSearchLawReg.replace(/\./gim, '\\.');
            }
            if (inputSearchLaw.match(/\+/gim)) {
              inputSearchLawReg = inputSearchLawReg.replace(/\+/gim, '\\+');
            }
            if (inputSearchLaw.match(/\?/gim)) {
              inputSearchLawReg = inputSearchLawReg.replace(/\?/gim, '\\?');
            }

            return item.match(new RegExp(inputSearchLawReg, 'igm'));
          }
        }),
    );
  }, [inputSearchLaw]);

  const netInfo = useNetInfo();
  let internetConnected = netInfo.isConnected;

  const hasBeenRerender = useRef(false);


    // if(internetConnected){
  //   setTimeout(()=>{
  //     hasBeenRerender.current = true

  //   },2000)
  // }else if (internetConnected == false){
  //   hasBeenRerender.current = true
  // }

  const [m, setm] = useState(false);


  useEffect(() => {

  //   if(internetConnected){
  //   setTimeout(()=>{
  //     hasBeenRerender.current = true

  //   },2000)
  // }else if (internetConnected == false){
  //   hasBeenRerender.current = true
  // }

    
    if(!hasBeenRerender.current && (internetConnected==false) ){
      // setShowWanringInternet(true);
      setShowWanringInternet(true);
      setm(true)
      // setTimeout(()=>{
      //   hasBeenRerender.current = true
      // },2000)
  
    }
    else if(!hasBeenRerender.current && internetConnected && m){
      setShowWanringInternet(true);
      
      setTimeout(()=>{
        hasBeenRerender.current = true
      setShowWanringInternet(false);
      },3000)
    }

        // if(internetConnected){
  //   setTimeout(()=>{
  //     hasBeenRerender.current = true

  //   },2000)


    if (internetConnected) {
            hasBeenRerender.current = true

      reference.on('value', snapshot => {
        setContent(Object.keys(snapshot.val()));
        setShowContent(Object.keys(snapshot.val()).slice(0, 7));
        setTotalPaper(Math.floor(Object.keys(snapshot.val()).length / 7) + 1);
      });
    } else {
      // setContent(Object.keys(data));
      // setShowContent(Object.keys(data).slice(0, 7));
      // setTotalPaper(Math.floor(Object.keys(data).length / 7) + 1);
    }

    setTimeout(()=>{
      Animated.timing(animated, {
        toValue: internetConnected ?100:0,
        duration: 2000,
        useNativeDriver: true,
      }).start();
    },2000)

    // if (internetConnected ) {
    //   setTimeout(() => {
    //     setShowWanringInternet(false);
    //   }, 4000);
    // }


  }, [internetConnected]);



  const loadMoreItem = () => {
    console.log('totalPaper', totalPaper);
    console.log('currentPaper', currentPaper);
    if (currentPaper < totalPaper) {
      // bị lỗi: tuy totalPaper đã dc thêm mới nhưng trong if() vẫn false
      setCurrentPaper(currentPaper + 1);
      // console.log('được cộng');
    }
    setShowContent(Content.slice(0, 7 * currentPaper));
  };

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          height: 50,
          paddingLeft: 10,
          paddingRight: 10,
          display: 'flex',
          alignItems: 'center',
        }}>
        {/* <Text 
                style={{
                    display:'flex',
                color:'black',
                fontWeight:'bold',
                alignItems:'center',
                textAlign:'center',
                fontSize:20,
                justifyContent:'center'
                // paddingLeft:30,
                // paddingRight:30

              }}>
                    Search
                </Text> */}
        {/* <Image source={require('../assets/abc.png')}
                style= {{
                        width:30, height:10,color:'red',position: 'absolute',
                marginLeft:8,
            }}>
              </Image> */}
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Ionicons
            name="book-outline"
            style={{
              color: internetConnected ? 'green' : 'red',
              fontSize: 25,
            }}></Ionicons>
        </View>
        <TextInput
          onChangeText={text => setInputSearchLaw(text)}
          value={inputSearchLaw}
          style={inputSearchLaw ? styles.inputSearchArea : styles.placeholder}
          placeholder="Search Law ..."
          placeholderTextColor={'gray'}
          keyboardAppearance=""></TextInput>
        <TouchableOpacity
          onPress={() => {
            setInputSearchLaw('');
            Keyboard.dismiss();
          }}
          style={{width: '10%', display: 'flex'}}>
          {inputSearchLaw && (
            <Ionicons
              name="close-circle-outline"
              style={{color: 'black', fontSize: 25}}></Ionicons>
          )}
        </TouchableOpacity>
      </View>

      {/* <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <View style={styles.item}>
                <Text style={styles.text}>
                Tìm kiếm
                </Text>
            </View>
        </TouchableOpacity> */}

      {/* { Content && (searchLawResult || Content).map( (key,i) => (

<TouchableOpacity key={i} onPress={() => navigation.navigate(`${key}`)}>
            <View style={styles.item}>
                <Text style={styles.text}>
                {key}
                </Text>
            </View>
        </TouchableOpacity>
)
)
  } */}

      <FlatList
        ref={list1}
        keyboardShouldPersistTaps="handled"
        data={Content && (searchLawResult || Content)}
        renderItem={Render}
        //   ListFooterComponent={(totalPaper > currentPaper) && renderLoader} //(totalPaper > currentPaper) &&
        //   onEndReached={ loadMoreItem}
      ></FlatList>

      { (!internetConnected && showWanringInternet) ? (
        <View
          style={{
            position: 'absolute',
            bottom: 40,
            paddingBottom: 10,
            paddingTop: 10,
            left: 30,
            right: 30,
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            flexDirection: 'row',
            backgroundColor: 'black',
            borderRadius: 10,
          }}>
          <View
            style={{
              width: '12%',
              alignItems: 'right',
              justifyContent: 'flex-end',
              display: 'flex',
              position: 'relative',
              // backgroundColor:'red',
              flexDirection: 'row',
            }}>
            <Ionicons
              name="wifi-outline"
              style={{
                color: 'red',
                fontSize: 27,
                alignItems: 'right',
                justifyContent: 'center',
                // backgroundColor:'white',
              }}></Ionicons>
          </View>
          <Text
            style={{
              color: 'white',
              textAlign: 'center',
              justifyContent: 'center',
              width: '60%',
              // backgroundColor:'green'
            }}>
            {'Mất kết nối Internet \n Muốn xem chế độ Offline?'}
          </Text>
          <TouchableOpacity
            onPress={() => {setShowWanringInternet(false)

              if(!internetConnected){
              setContent(Object.keys(data));
              setShowContent(Object.keys(data).slice(0, 7));
              setTotalPaper(Math.floor(Object.keys(data).length / 7) + 1);
              }
            
            }}
            style={{
              width: '20%',
              // backgroundColor:'white',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              // backgroundColor:'green'
              borderLeftWidth: 2,
              borderLeftColor: 'white',
            }}>
            <Text
              style={{
                textAlign: 'center',
                justifyContent: 'center',
                // backgroundColor:'yellow',
                width: '100%',
                color: 'white',
                fontWeight: 'bold',
              }}>
              Đóng
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        ((internetConnected && showWanringInternet) &&
        (
          <Animated.View
            style={{
              position: 'absolute',
              bottom: 40,
              paddingBottom: 10,
              paddingTop: 10,
              left: 30,
              right: 30,
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              flexDirection: 'row',
              backgroundColor: 'black',
              borderRadius: 10,
              opacity:Opacity,
              transform:[{translateY:TranslateY}]
            }}>
            <View
              style={{
                width: '12%',
                alignItems: 'right',
                justifyContent: 'flex-end',
                display: 'flex',
                position: 'relative',
                // backgroundColor:'red',
                flexDirection: 'row',
              }}>
              <Ionicons
                name="wifi-outline"
                style={{
                  color: 'green',
                  fontSize: 27,
                  alignItems: 'right',
                  justifyContent: 'center',
                  // backgroundColor:'white',
                }}></Ionicons>
            </View>
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                justifyContent: 'center',
                width: '60%',
                // backgroundColor:'green'
              }}>
              {'Đã kết nối Internet'}
            </Text>
            <TouchableOpacity
              onPress={() => setShowWanringInternet(false)}
              style={{
                width: '20%',
                // backgroundColor:'white',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                // backgroundColor:'green'
                borderLeftWidth: 2,
                borderLeftColor: 'white',
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  justifyContent: 'center',
                  // backgroundColor:'yellow',
                  width: '100%',
                  color: 'white',
                  fontWeight: 'bold',
                }}>
                Đóng
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ))
      )
      }
    </>
  );
}

const styles = StyleSheet.create({
  item: {
    height: 100,
    backgroundColor: 'green',
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 6,
    paddingLeft:20,
    paddingRight:20
  },
  text: {
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  inputSearchArea: {
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 18,
    color: 'black',
    width: '85%',
    alignItems: 'center',
    height: 50,
  },
  placeholder: {
    fontSize: 15,
    paddingLeft: 10,
    paddingRight: 10,
    color: 'black',
    width: '85%',
    alignItems: 'center',
    height: 50,
  },
});
