import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
  FlatList,
  ActivityIndicator,
  Image,
  Keyboard,
  Animated,
  Dimensions
} from 'react-native';
import {useState, useEffect, useContext, useRef,} from 'react';
import dataOrg from '../data/project2-197c0-default-rtdb-export.json';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {RefForHome} from '../App';
import {dataLaw} from '../App';
import {RefLoading} from '../App'
import { useSelector, useDispatch } from 'react-redux';

import {useNetInfo} from '@react-native-community/netinfo';
import {loader,handle,noLoading} from '../redux/fetchData'

export default function Home({navigation}) {
  const [Content, setContent] = useState('');
  // sử dụng để đọc realtime database, data được xuất ra ở dưới dạng object rồi không cần JSON.parse

  
  
  const [showContent, setShowContent] = useState([]);

  const [inputSearchLaw, setInputSearchLaw] = useState('');
  const [searchLawResult, setSearchLawResult] = useState([]);
  const [currentPaper, setCurrentPaper] = useState(1);
  const [totalPaper, setTotalPaper] = useState(2);

  const HomeFlatlist = useContext(RefForHome);


  const dataLawContent = useContext(dataLaw);

  const Loading1 = useContext(RefLoading);


  const [showWanringInternet, setShowWanringInternet] = useState(false);

  const list1 = useRef(null);


  const dispatch = useDispatch()


  const animated = useRef(new Animated.Value(0)).current;

  let Opacity = animated.interpolate({
    inputRange: [-100,0,25,50,100],
    outputRange: [0,1,0,0, 0],
  });

  let TranslateY = animated.interpolate({
    inputRange: [-100,0, 100],
    outputRange: [0,0, 100],
  });


  const {width, height} = Dimensions.get('window');
  let heightDevice = height;
  let widthDevice = width;
  Dimensions.addEventListener('change', ({window: {width, height}}) => {
    // console.log(`Width: ${width}, Height: ${height}`);
    widthDevice = width;
    heightDevice = height;
  });


  HomeFlatlist.updateHome(list1);



  // console.log("dataLawContent.dataLawForApp['LawInfo']",dataLawContent.dataLawForApp);

  const Render = ({item}) => {

    return (
      <TouchableOpacity
      style={{
        paddingBottom:20,
        paddingTop:20,
        justifyContent:'center',
        backgroundColor: 'green',
        marginBottom: 6,

      }}
      onPress={() => navigation.navigate(`${item}`)}>
        <View style={styles.item}>
        <Text style={styles.itemDisplay}>{dataLawContent.dataLawForApp && dataLawContent.dataLawForApp['LawInfo'][item]['lawNameDisplay']}</Text>
        {!dataLawContent.dataLawForApp['LawInfo'][item]['lawNameDisplay'].match(/^(luật|bộ luật)/img) 
        && <Text style={styles.itemDescription}>{dataLawContent.dataLawForApp && dataLawContent.dataLawForApp['LawInfo'][item]['lawDescription']}</Text>}
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

            return (data['LawInfo'][item]['lawNameDisplay'].match(new RegExp(inputSearchLawReg, 'igm')) 
            || data['LawInfo'][item]['lawDescription'].match(new RegExp(inputSearchLawReg, 'igm'))
            || data['LawInfo'][item]['lawNumber'].match(new RegExp(inputSearchLawReg, 'igm')));
          }
        }),
    );
  }, [inputSearchLaw]);

  const netInfo = useNetInfo();
  let internetConnected = netInfo.isConnected;
  const hasBeenRerender = useRef(false);      // nếu true có nghĩa là warning sẽ không xuất hiện thêm lần nào nữa

  const [alreadyInternetWarning, setAlreadyInternetWarning] = useState(false);      // dùng để biết đã từng có internet chưa

  const {loading,data} = useSelector(state => state['read']);

  Loading1.updateLoading(loading)


  useEffect(() => {

    if(!hasBeenRerender.current && (internetConnected==false) ){
      setShowWanringInternet(true);
      setAlreadyInternetWarning(true)
  
    }
    else if(!hasBeenRerender.current && internetConnected && alreadyInternetWarning){
      setShowWanringInternet(true);
      // dispatch({type:'run'})
      setTimeout(()=>{
        hasBeenRerender.current = true
      setShowWanringInternet(false);
      },3000)
    }

    if (internetConnected &&!hasBeenRerender.current) {
            hasBeenRerender.current = true
            dispatch({type:'run'})

      
    } else if(internetConnected==false) {      
       dispatch(noLoading())
    }

    setTimeout(()=>{
      Animated.timing(animated, {
        toValue: internetConnected ?100:0,
        duration: 2000,
        useNativeDriver: true,
      }).start();
    },2000)
  }, [internetConnected]);


// console.log(dataOrg['LawContent']);

  useEffect(() => {
    
    if(data){
    setContent(Object.keys(data['LawContent']));
    setShowContent(Object.keys(data['LawContent']).slice(0, 7));
    setTotalPaper(Math.floor(Object.keys(data['LawContent']).length / 7) + 1);
    dataLawContent.updateData(data)
    
  }
}, [data])



  const loadMoreItem = () => {
    if (currentPaper < totalPaper) {
      // bị lỗi: tuy totalPaper đã dc thêm mới nhưng trong if() vẫn false
      setCurrentPaper(currentPaper + 1);
    }
    setShowContent(Content.slice(0, 7 * currentPaper));
  };

  return (
    <>
                    { (loading) && (
        <View style={{position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        opacity: 0.7,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex:100
        }}>
        <ActivityIndicator size='large' color="white" >

        </ActivityIndicator>
        </View>
        )}

      <View
        style={{
          flexDirection: 'row',
          height: 50,
          paddingLeft: 10,
          paddingRight: 10,
          display: 'flex',
          alignItems: 'center',
          // backgroundColor:'#EEEFE4',
          justifyContent:'space-between'

        }}>
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
          placeholder="Nhập tên, Số văn bản, Trích yếu . . ."
          placeholderTextColor={'gray'}
          
          keyboardAppearance=""></TextInput>
        <TouchableOpacity
          onPress={() => {
            setInputSearchLaw('');
            Keyboard.dismiss();
          }}
          style={{width: '10%', 
          display: 'flex',
          // backgroundColor:'red',
          }}>
          {inputSearchLaw && (
            <Ionicons
              name="close-circle-outline"
              style={{color: 'black', 
              fontSize: 25,
              justifyContent:'center',
              textAlign:'right',
              // backgroundColor:'black';
              paddingRight:10

            }}></Ionicons>
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
        style={{          backgroundColor:'#EEEFE4',
        }}
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
              setContent(Object.keys(dataOrg['LawContent']));
              setShowContent(Object.keys(dataOrg['LawContent']).slice(0, 7));
              setTotalPaper(Math.floor(Object.keys(dataOrg['LawContent']).length / 7) + 1);
              dataLawContent.updateData(dataOrg)

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
              transform:[{translateY:TranslateY}],
              zIndex:100

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
    minHeight:100,
    // height: 120,
    // backgroundColor: 'green',
    display: 'flex',
    justifyContent: 'center',
    paddingLeft:20,
    paddingRight:20,
    flexDirection:'column'
  },
  itemDisplay: {
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    fontSize:17
  },
  itemDescription:{
    color:'#EEEEEE',
    textAlign: 'center',
    fontSize:15

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
