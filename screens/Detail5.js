import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Alert,
  Animated,
  ActivityIndicator
} from 'react-native';
import database from '@react-native-firebase/database';
import React, {useState, useEffect, useRef,useContext} from 'react';
import {useRoute} from '@react-navigation/native';
import data from '../data/project2-197c0-default-rtdb-export.json';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNetInfo} from "@react-native-community/netinfo";
// import { useSelector, useDispatch } from 'react-redux';

import {dataLaw} from '../App';

let TopUnitCount; // là đơn vị lớn nhất vd là 'phần thứ' hoặc chương
let articleCount = 0;
let sumChapterArray = []; // array mà mỗi phần tử là 'phần thứ...' có tổng bn chương
sumChapterArray[0] = 0;
let sumChapterPrevious; // sum cộng dồn các phần trư của các chương trong luật có phần thứ

let eachSectionWithChapter = [];
//lineHeight trong lines phải luôn nhỏ hơn trong highlight và View Hightlight

// để searchArticle transition vào cho đẹp

// search result bị xô lệch, đang xử lý theo hướng dúng onLayout trong Text
// hơi bị leak memory chỗ ScrollVIew nha
// chỗ chapter nếu bung được thì bung hết

export default function Detail() {
  // const [tittle, setTittle] = useState();     // để collapse chương nếu không có mục 'phần thứ...' hoặc mục' phần thứ...' nếu có
  const [tittleArray, setTittleArray] = useState([]); // đây là 'phần thứ...' hoặc chương (nói chung là section cao nhất)

  const [tittleArray2, setTittleArray2] = useState([]); // nếu có 'phần thứ...' thì đây sẽ là chương

  const [positionYArr, setPositionYArr] = useState([]); // tập hợp pos Y Search
  const [positionYArrArtical, setPositionYArrArtical] = useState([]);
  const [showArticle, setShowArticle] = useState(false);

  const [currentY, setCurrentY] = useState(0); // để lấy vị trí mình đang scroll tới

  const [inputSearchArtical, setInputSearchArtical] = useState(''); // input phần tìm kiếm 'Điều'

  const [currentSearchPoint, setCurrentSearchPoint] = useState(1); // thứ tự kết quả search đang trỏ tới

  const route = useRoute();

  let LawName = route.name;

  if(LawName.match(/\\/img,'\/')){
    LawName = LawName.replace(/\\/img,'\/')
  }

  const animatedForNavi = useRef(new Animated.Value(0)).current;

  const list = useRef(null);

  const [input, setInput] = useState(route.params ? route.params.input : '');
  const [valueInput, setValueInput] = useState('');
  const [find, setFind] = useState(false);

  const [go, setGo] = useState(route.params ? true : false);

  const [Content, setContent] = useState('');

  const netInfo = useNetInfo();
  let internetConnected = netInfo.isConnected


  function pushToSearch() {
    setGo(true);

    if (input) {
      if (input.match(/(\w+|\(|\)|\.|\+|\-|\,|\&|\?|\;|\!|\/)/gim)) {
        let inputSearchLawReg = input;
        if (input.match(/\(/gim)) {
          inputSearchLawReg = input.replace(/\(/gim, '\\(');
        }
        if (input.match(/\)/gim)) {
          inputSearchLawReg = inputSearchLawReg.replace(/\)/gim, '\\)');
        }
        if (input.match(/\./gim)) {
          inputSearchLawReg = inputSearchLawReg.replace(/\./gim, '\\.');
        }
        if (input.match(/\+/gim)) {
          inputSearchLawReg = inputSearchLawReg.replace(/\+/gim, '\\+');
        }
        // if(input.match(/\//img)){
        //   inputSearchLawReg = inputSearchLawReg.replace(/\//img,'\\/')
        // }
        if(input.match(/\\/img)){
          inputSearchLawReg = inputSearchLawReg.replace(/\\/img,'.')
        }



        setValueInput(inputSearchLawReg);
      } else {
        Alert.alert('Thông báo', 'Vui lòng nhập từ khóa hợp lệ');
      }
      // setSearchCount(searchResultCount);

      setCurrentSearchPoint(1);
      Keyboard.dismiss();
    } else {
      Alert.alert('Thông báo', 'Vui lòng nhập từ khóa hợp lệ');
    }
  }
  // const dispatch = useDispatch()

  // const {data,loading} = useSelector(state => state);
  // console.log('data',data);
  // console.log('loading',loading);

  // useEffect(() => {
  //   dispatch({type:'run'})
  
  // }, [])
  
  const dataLawContent = useContext(dataLaw);

  useEffect(() => {

    if(internetConnected){
      // const reference = database().ref('/Law1');
      // reference.on('value', snapshot => {
        // setContent(snapshot.val()[route.name]);
        if(data){
          // setContent(data[route.name]);
setContent(dataLawContent.dataLawForApp[route.name])
        }
      // });
        }else{
          setContent(data[route.name]);
        }

        
    // reference.on('value', snapshot => {
    //   setContent(snapshot.val()[route.name]);
    //   // setContent(data[route.name]);
    // });

    if (route.params) {
      setTimeout(() => {
        pushToSearch();
      }, 1000);
    }

    return () => {
      eachSectionWithChapter = [];
      sumChapterArray = [];
      sumChapterArray[0] = 0;
    };
  }, [internetConnected]);

  function collapse(a) {
    // để collapse chương nếu không có mục 'phần thứ...' hoặc mục' phần thứ...' nếu có
    if (a == undefined) {
    } else if (tittleArray.includes(a)) {
      setTittleArray(tittleArray.filter(a1 => a1 !== a));
    } else {
      setTittleArray([...tittleArray, a]);
    }

    let contain = false;
    if (eachSectionWithChapter[a]) {
      for (let m = 0; m < eachSectionWithChapter[a].length; m++) {
        if (tittleArray2.includes(eachSectionWithChapter[a][m])) {
          contain = true;
        } else {
          contain = false;
          break;
        }
      }


      let tittleArray2Copy = tittleArray2;
      for (let m = 0; m < eachSectionWithChapter[a].length; m++) {
        if (!contain) {
          if (!tittleArray2.includes(eachSectionWithChapter[a][m])) {
            tittleArray2.push(eachSectionWithChapter[a][m]);
          }
        } else {
          tittleArray2Copy = tittleArray2Copy.filter(
            item => item != eachSectionWithChapter[a][m],
          );
          setTittleArray2(tittleArray2Copy);
        }
      }
    }
  }

  function collapse2(a) {
    // để collapse chương nếu có mục 'phần thứ...'

    if (a == undefined) {
    } else if (tittleArray2.includes(a)) {
      setTittleArray2(tittleArray2.filter(a1 => a1 !== a));
    } else {
      setTittleArray2([...tittleArray2, a]);
    }
    // setTittle(null);
  }


  let searchResultCount = 0;
  // let c = 0;
  function highlight(para, word, i2) {

    if(para[0]){
    if(para[0].match(/(?<=\w*)\\(?=\w*)/img)){
    para[0] = para[0].replace(/(?<=\w*)\\(?=\w*)/img,'\/')
    }
  }

    // if (word.match(/\w+/gim) || word.match(/\(/gim)|| word.match(/\)/gim) || word.match(/\./img) || word.match(/\+/img)) {
    if (word.match(/(\w+|\(|\)|\.|\+|\-|\,|\&|\?|\;|\!|\/)/gim)) {
      let inputRexgex = para[0].match(new RegExp(String(word), 'igmu'));
      // let inputRexgex = para[0].match(new RegExp('hội', 'igmu'));
      if (inputRexgex) {
        searchResultCount += inputRexgex.length;
        let searchedPara = para[0]
          .split(new RegExp(String(word), 'igmu'))
          // .split(new RegExp('hội', 'igmu'))
          .reduce((prev, current, i) => {
            if (!i) {
              return [current];
            }

            function setPositionYSearch({y}) {
              positionYArr.push(y + currentY);
              positionYArr.sort((a, b) => {
                if (a > b) {
                  return 1;
                } else {
                  if (a < b) return -1;
                }
              });

              if (go) {
                setTimeout(() => {
                  list.current.scrollTo({
                    y: positionYArr[0] - 100, //- 57
                  });
                }, 500);
              }
            }

            return prev.concat(
              <>
                <View
                  style={{
                    backgroundColor: 'blue',
                    flex: 1,
                    alignSelf: 'center',
                    padding: 0,
                    margin: 0,
                    overflow: 'visible',
                    right: -50,
                    height: go ? 9 : 1,
                  }}
                  onLayout={event => {
                    event.target.measure(
                      (x, y, width, height, pageX, pageY) => {
                        setPositionYSearch({
                          y: y + pageY,
                        });
                      },
                    );
                  }}></View>

                <Text
                  //         onLayout={event => {
                  //         const {y} = event.nativeEvent.layout;
                  //         console.log('height: ' + y);
                  // }}

                  style={
                    searchResultCount - inputRexgex.length + i - 1 <
                      currentSearchPoint &&
                    searchResultCount - inputRexgex.length + i >=
                      currentSearchPoint
                      ? styles.highlight1
                      : styles.highlight
                  }
                  key={`${i2}d`}
                  onp>
                  {inputRexgex[i - 1]}
                </Text>
                {/* </Text> */}
              </>,
              <Text
                style={{
                  position: 'relative',
                  display: 'flex',
                  margin: 0,
                  lineHeight: 23,
                }}>
                {current}
              </Text>,
            );
          }, []);

        return searchedPara;
      } else {
        return para[0];
      }
    } else {
      return para[0];
    }

    // }
  }

  let positionYArrArticalDemo = positionYArrArtical;

  function setPositionYArtical({y, key3}) {
    if ((!tittleArray.length && !tittleArray2.length) || go) {
      var contains = positionYArrArtical.some((elem, i) => {
        return key3 == Object.keys(elem);
      });

      if (contains) {
        articleCount++;

        positionYArrArticalDemo = positionYArrArticalDemo.map((elem, i) => {
          if (Object.keys(elem) == key3) {
            return {[key3]: y + currentY};
          } else {
            return elem;
          }
        });

        if (articleCount >= positionYArrArtical.length) {
          setPositionYArrArtical(positionYArrArticalDemo);
          articleCount = 0;
        }
      } else {
        positionYArrArtical.push({[key3]: y + currentY});
      }
    }
  }

  TopUnitCount = Content && Object.keys(Content).length;

  function Shrink() {
    for (let b = 0; b <= TopUnitCount - 1; b++) {
      if (tittleArray == []) {
        setTittleArray([b]);
      } else {
        setTittleArray(oldArray => [...oldArray, b]);
      }
    }
    // console.log('sumChapter',sumChapter);
    // console.log('sumChapterArray',sumChapterArray);

      let sumChapter = sumChapterArray.reduce((total, currentValue) => {
    // tổng chapter nếu có phần thứ
    if (currentValue) {
      return total + currentValue;
    }
  });

    for (let b = 0; b <= sumChapter - 1; b++) {
      if (tittleArray2 == []) {
        setTittleArray2([b]);
      } else {
        setTittleArray2(oldArray => [...oldArray, b + 1]);
      }
    }
  }

  // useEffect(() => {
  //   setGo(false);
  //   setSearchCount(0);
  //   setCurrentSearchPoint(0);

  // }, [input]);

  // useEffect(() => {
  //   setSearchCount(searchResultCount);
  //   setPositionYArr([]);
  //   setCurrentSearchPoint(1)

  // }, [go]);

  useEffect(() => {
    setGo(false);
  }, [input]);

  useEffect(() => {
    setPositionYArr([]);
  }, [go]);

  useEffect(() => {
    if (currentSearchPoint != 0 && searchResultCount) {
      list.current.scrollTo({
        y: positionYArr[currentSearchPoint - 1] - 100, //- 57
      });
    }
  }, [currentSearchPoint]);

  let SearchArticalResult = positionYArrArtical.filter(item => {
    let abc = inputSearchArtical;
    if (inputSearchArtical.match(/\(/gim)) {
      abc = inputSearchArtical.replace(/\(/gim, '\\(');
    }

    if (inputSearchArtical.match(/\)/gim)) {
      abc = abc.replace(/\)/gim, '\\)');
    }

    return Object.keys(item)[0].match(new RegExp(abc, 'igm'));
  });

  let transY = animatedForNavi.interpolate({
    inputRange: [-100,0, 80, 90, 100],
    outputRange: [0,0, -60, 0, 0],
  });

  let transX = animatedForNavi.interpolate({
    inputRange: [-100, 0],
    outputRange: [0, 200],
  });

  let Opacity = animatedForNavi.interpolate({
    inputRange: [-100, 0],
    outputRange: [.7, 0],
  });


  let MagginBottom = animatedForNavi.interpolate({
    inputRange: [-100,0, 80, 90, 100],
    outputRange: [50,50, 110, 0, 0],
  });

  useEffect(() => {
    if (find == true) {
      setTittleArray([]);
      setTittleArray2([]);
    }
    // Animated.timing(animatedForNavi, {
    //   toValue:find ? 50 : 0,
    //   duration: 1000,
    //   useNativeDriver: false,
    // }).start();
    // setShowArticle(false)
    Keyboard.dismiss()

  }, [find]);

  const a = (key, i, key1, i1a, t) => {
    // phần nếu không mục 'phần thứ' trong văn bản



    return Object.keys(key)[0] != '0' ? (
      <View
        key={`${i}b`}
        style={
          showArticle ||
          find ||
          (t == undefined
            ? !tittleArray.includes(i)
            : !tittleArray2.includes(t)) ||
          styles.content //////////////////////////////////////////////////////////////////
        }>
        {key[key1].map((key2, i2) => {


          return (
            <View
              onLayout={event => {
                event.target.measure((x, y, width, height, pageX, pageY) => {
                  setPositionYArtical({
                    y: y + pageY,
                    key3: Object.keys(key2)[0],
                  });
                });
              }}
              style={go ? {width: '100%'} : {width: '99%'}}>
              <Text key={`${i2}c`} style={styles.dieu}>
                {highlight(Object.keys(key2), valueInput, i2)}
              </Text>
              <Text key={`${i2}d`} style={styles.lines}>
                {highlight(Object.values(key2), valueInput, i2)}
              </Text>
            </View>
          );
        })}
      </View>
    ) : (
      {}
    );
  };

  // let sumChapter = sumChapterArray.reduce((total, currentValue) => {
  //   // tổng chapter nếu có phần thứ
  //   if (currentValue) {
  //     return total + currentValue;
  //   }
  // });

  const b = (keyA, i, keyB) => {
    // phần nếu có mục 'phần' trong văn bản
    return (
      <>
        <View
          key={`${i}b`}
          // style={
          //   showArticle || find || !tittleArray.includes(i) || styles.content
          // }
        >
          {keyA[keyB].map((keyC, iC) => {
            // keyC ra object là từng chương hoặc ra điều luôn

            let chapterOrdinal = 0;
            if (Object.keys(keyC)[0].match(/^Chương.*$/gim)) {
              //nếu có chương

              sumChapterArray[i + 1] = keyA[keyB].length
                ? keyA[keyB].length
                : 0;
              sumChapterPrevious = sumChapterArray
                .slice(0, i + 1)
                .reduce((total, currentValue) => {
                  if (currentValue) {
                    return total + currentValue;
                  }
                });

              chapterOrdinal = sumChapterPrevious + iC + 1;
              if (!eachSectionWithChapter[i]) {
                eachSectionWithChapter[i] = [chapterOrdinal];
              } else if (!eachSectionWithChapter[i].includes(chapterOrdinal)) {
                eachSectionWithChapter[i].push(chapterOrdinal);
              }
              return (
                <>
                  <TouchableOpacity // đây là chương
                    key={i}
                    onPress={() => {
                      collapse2(chapterOrdinal);
                    }}>
                    <Text
                      key={`${i}a`}
                      style={{
                        fontSize: 14,
                        color: 'white',
                        fontWeight: 'bold',
                        padding: 4,
                        textAlign: 'center',
                        backgroundColor: 'black',
                        marginBottom: 1,
                      }}>
                      {Object.keys(keyC)[0].toUpperCase()}
                    </Text>
                  </TouchableOpacity>

                  {a(keyC, i, Object.keys(keyC)[0], iC, chapterOrdinal)}
                </>
              );
            } else {
              //nếu không có chương
              return (
                <View
                  style={
                    showArticle ||
                    find ||
                    !tittleArray.includes(i) ||
                    styles.content //////////////////////////////////////////////////////////////////
                  }>
                  <View
                    onLayout={event => {
                      event.target.measure(
                        (x, y, width, height, pageX, pageY) => {
                          setPositionYArtical({
                            y: y + pageY,
                            key3: Object.keys(keyC)[0],
                          });
                        },
                      );
                    }}
                    style={go ? {width: '100%'} : {width: '99%'}}>
                    <Text key={`${iC}c`} style={styles.dieu}>
                      {highlight(Object.keys(keyC), valueInput, iC)}
                    </Text>
                    <Text key={`${iC}d`} style={styles.lines}>
                      {highlight(Object.values(keyC), valueInput, iC)}
                    </Text>
                  </View>
                </View>
              );
            }
          })}
        </View>
      </>
    );
  };

  return (
    <>
                        {/* { loading && (
        <View style={{position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        opacity: 0.7,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex:10
        }}>
        <ActivityIndicator size='large' color="#cc3333" >

        </ActivityIndicator>
        </View>
        )} */}

      <Animated.View style={{marginBottom: MagginBottom}}>
        <ScrollView
          onScroll={event => {
            {
              const {y} = event.nativeEvent.contentOffset;
              setCurrentY(y);
            }
          }}
          ref={list}
          // style={  find ? {marginBottom: 60} : {marginBottom: 0}}
          // style={  find ? {setTimeout( ()=>{ return {'marginBottom': 60}},400)} : {marginBottom: 0}}

          showsVerticalScrollIndicator={true}>
          <Text style={styles.titleText}>{`${LawName}`}</Text>
          {Content &&
            Content.map((key, i) => (
              <>
                <TouchableOpacity
                  key={i}
                  style={styles.chapter}
                  onPress={() => {
                    collapse(i);
                    // setTittle(i);
                  }}>
                  <Text
                    key={`${i}a`}
                    style={{
                      fontSize: 18,
                      color: 'black',
                      fontWeight: 'bold',
                      padding: 9,
                      textAlign: 'center',
                    }}>
                    {Object.keys(key)[0].toUpperCase()}
                  </Text>
                </TouchableOpacity>

                {Object.keys(key)[0].match(/phần thứ .*/gim)
                  ? b(key, i, Object.keys(key)[0])
                  : a(key, i, Object.keys(key)[0])}
              </>
            ))}
        </ScrollView>
      </Animated.View>
      {Boolean(searchResultCount) &&
        !Boolean(tittleArray.length) &&
        !Boolean(tittleArray2.length) &&
        searchResultCount > 1 && (
          <Animated.View
            style={{
              right: 25,
              display: 'flex',
              flexDirection: 'column',
              position: 'absolute',
              justifyContent: 'space-between',
              height: 130,
              opacity: 0.6,
              transform: [{translateY: transY}],
              bottom: 80,
            }}>
            <TouchableOpacity
              style={styles.tabSearch}
              onPress={() => {
                currentSearchPoint == 1
                  ? setCurrentSearchPoint(positionYArr.length)
                  : setCurrentSearchPoint(currentSearchPoint - 1);
              }}>
              <Ionicons
                name="caret-up-outline"
                style={{
                  color: 'rgb(240,240,208)',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: 25,
                }}></Ionicons>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.tabSearch}
              onPress={() => {
                currentSearchPoint == positionYArr.length
                  ? setCurrentSearchPoint(1)
                  : setCurrentSearchPoint(currentSearchPoint + 1);
              }}>
              <Ionicons
                name="caret-down-outline"
                style={{
                  color: 'rgb(240,240,208)',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: 25,
                }}></Ionicons>
            </TouchableOpacity>
          </Animated.View>
        )}

      {
        // <Animated.View style={styles.findArea}>
        <Animated.View
          style={{...styles.findArea, transform: [{translateY: transY}]}}>
          <View style={styles.searchView}>
            <View style={styles.inputArea}>
              <TextInput
                style={{width: '65%', color: 'white'}}
                onChangeText={text => setInput(text)}
                autoFocus={false}
                value={input}
                placeholder=" Vui lòng nhập từ khóa ..."
                placeholderTextColor={'gray'}></TextInput>
              <Text
                style={{
                  width: '23%',
                  color: 'white',
                  fontSize: 9,
                  textAlign: 'right',
                  paddingRight: 3,
                }}>
                {searchResultCount
                  ? `${currentSearchPoint}/${searchResultCount}`
                  : searchResultCount}
              </Text>
              <TouchableOpacity
                style={{color: 'white', fontSize: 16, width: '12%'}}
                onPress={() => {
                  setInput('');
                }}>
                {input && (
                  <Ionicons
                    name="close-circle-outline"
                    style={{
                      color: 'white',
                      fontSize: 20,
                      textAlign: 'center',
                      width: '100%',
                      height: 20,
                    }}></Ionicons>
                )}
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.searchBtb}
              onPress={() => {
                pushToSearch();
              }}>
              <Ionicons
                name="return-down-forward-outline"
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 18,
                }}></Ionicons>
            </TouchableOpacity>
          </View>
        </Animated.View>
      }

      <View style={styles.functionTab}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => {
            setFind(false);

            let timeOut = setTimeout(() => {
              setShowArticle(false)
              return()=>{
                 

              }
            },  600);

              

            setTittleArray([]);
            Shrink();

            Animated.timing(animatedForNavi, {
              toValue: 0,
              // toValue:100,
              duration:  600,
              useNativeDriver: false,
            }).start();

            // console.log(showArticle);
          }}>
          {/* <Text style={styles.innerTab}>S</Text> */}
          <Ionicons
            name="chevron-collapse-outline"
            style={styles.innerTab}></Ionicons>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => {
            setTittleArray([]);
            setTittleArray2([]);
            setFind(false);
            let timeOut = setTimeout(() => {
              setShowArticle(false)
              return()=>{
                 

              }
            },  600);

            Animated.timing(animatedForNavi, {
              toValue: 0,
              duration:  600,
              useNativeDriver: false,
            }).start();

          }}>
          {/* <Text style={styles.innerTab}>E</Text> */}
          <Ionicons
            name="chevron-expand-outline"
            style={styles.innerTab}></Ionicons>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => {
            list.current.scrollTo({y: 0});
            let timeOut = setTimeout(() => {
              setShowArticle(false)
              return()=>{
              }
            },  600);

          }}>
          <Ionicons name="arrow-up-outline" style={styles.innerTab}></Ionicons>
        </TouchableOpacity>

        <TouchableOpacity
          style={find ? styles.ActiveTab : styles.tab}
          onPress={() => {
            setFind(!find);
            let timeOut = setTimeout(() => {
              setShowArticle(false)
              return()=>{
                 

              }
            },  600);
            Animated.timing(animatedForNavi, {
              toValue: !find ? 80 : 0,
              duration:  600,
              useNativeDriver: false,
            }).start();
          }}>
          {/* <Text style={styles.innerTab}>Find</Text> */}
          <Ionicons
            name="search-outline"
            style={find ? styles.ActiveInner : styles.innerTab}></Ionicons>
        </TouchableOpacity>
        <TouchableOpacity
          style={showArticle && !find ? styles.ActiveTab : styles.tab}
          onPress={() => {

            if(showArticle){
              let timeOut = setTimeout(() => {
                setShowArticle(false)
                return()=>{
                }
              },  600);
            }else{
            setShowArticle(true);

          }
            setFind(false);
            Keyboard.dismiss()
            Animated.timing(animatedForNavi, {
              toValue: !showArticle ? -100 : 0,
              duration:  600,
              useNativeDriver: false,
            }).start();

            setTittleArray([]);
            setTittleArray2([]);
        
          }}>

          <Ionicons
            name="menu-outline"
            style={
              showArticle ? styles.ActiveInner : styles.innerTab
            }></Ionicons>
        </TouchableOpacity>
      </View>

        <>
      {showArticle && (
        <>
        <Animated.View 
        style={{
          backgroundColor: 'rgb(245,245,247)',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          display: 'flex',
          position: 'absolute',
          opacity:Opacity,
          
        }}
>
          <TouchableOpacity //overlay
                    style={{
                      left: 0,
                      right: 0,
                      top: 0,
                      bottom: 0,
                      display: 'flex',
                      position: 'absolute',
                    }}
            
            onPress={() => {
              // Keyboard.dismiss()
            let timeOut = setTimeout(() => {
              setShowArticle(false)
              return()=>{
              }

            },  600);
              Animated.timing(animatedForNavi, {
                toValue: !showArticle ? -100 : 0,
                duration:  600,
                useNativeDriver: false,
              }).start();
  
            }}></TouchableOpacity>
            </Animated.View>

          <Animated.View
            style={{...styles.listArticle, transform: [{translateX: transX}]}}>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: 'black',
                height: 50,
              }}>
              <TextInput
                onChangeText={text => setInputSearchArtical(text)}
                value={inputSearchArtical}
                style={{
                  paddingLeft: 10,
                  paddingRight: 10,
                  color: 'white',
                  width: '85%',
                  alignItems: 'center',
                }}
                placeholder=" Input to Search ..."
                placeholderTextColor={'gray'}></TextInput>
              <TouchableOpacity
                onPress={() => setInputSearchArtical('')}
                style={{
                  width: '15%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {inputSearchArtical && (
                  <Text
                    style={{
                      height: 20,
                      width: 20,
                      color: 'white',
                      textAlign: 'center',
                      verticalAlign: 'middle',
                      backgroundColor: 'gray',
                      borderRadius: 25,
                    }}>
                    X
                  </Text>
                )}
              </TouchableOpacity>
            </View>
            <ScrollView
            keyboardShouldPersistTaps='handled' 
            >
              <View style={{height: 7}}>
                {
                  // đây là hàng ảo để thêm margin
                }
              </View>
              {(SearchArticalResult || positionYArrArtical).map((key, i) => (
                <TouchableOpacity
                  style={styles.listItem}
                  onPress={() => {
                    setShowArticle(false);
                    list.current.scrollTo({y: Object.values(key) - 57}); 
                    Animated.timing(animatedForNavi, {
                      toValue: !showArticle ? -100 : 0,
                      duration:  600,
                      useNativeDriver: false,
                    }).start();
        

                  }}>
                  <Text style={styles.listItemText}>{Object.keys(key)}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
          </>
          )}

        </>
    </>
  );
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 28,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 30,
    textAlign: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    color: 'rgb(68,68,68)',
    // backgroundColor:'rgb(230,230,230)',
    fontWeight:'bold'
  },
  chapter: {
    height: 60,
    justifyContent: 'center',
    backgroundColor: 'orange',
    color: 'black',
    alignItems: 'center',
    marginBottom: 1,
  },
  dieu: {
    fontWeight: 'bold',
    // marginBottom: 5,
    marginTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    lineHeight: 22,
    // backgroundColor:'blue',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'black',
  },
  lines: {
    display: 'flex',
    position: 'relative',
    textAlign:'justify',
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom:'0',
    fontSize: 14,
    color: 'black',
    lineHeight: 22,
    overflow: 'hidden',

},
  highlight: {
    color: 'black',
    backgroundColor: 'yellow',
    // position:'re',
    display: 'flex',
    textAlign: 'center',
    lineHeight: 22,
    // position:'absolute',
    position: 'relative',
  },
  highlight1: {
    color: 'black',
    display: 'flex',
    textAlign: 'center',
    position: 'relative',
    backgroundColor: 'orange',
    lineHeight: 22,
  },
  content: {
    height: 0,
  },
  functionTab: {
    position: 'absolute',
    left: 0,
    right: 0,
    // top:'60%',
    // left: '80%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    bottom: 0,
    backgroundColor: 'black',
    height: 52,
    paddingTop: 2,
    zIndex: 10,
  },
  tab: {
    backgroundColor: 'white',
    borderRadius: 30,
    width: 50,
    height: 50,
    // marginBottom:10,
    textAlign: 'center',
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
  },
  ActiveTab: {
    backgroundColor: 'yellow',
    borderRadius: 30,
    width: 50,
    height: 50,
    // marginBottom:10,
    textAlign: 'center',
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
  },
  innerTab: {
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  ActiveInner: {
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  findArea: {
    display: 'flex',
    backgroundColor: 'red',
    flexDirection: 'column',
    // bottom:50,
    bottom: -10,
    position: 'absolute',
    right: 0,
    left: 0,
  },
  searchView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 6,
    marginBottom: 6,
  },
  tabSearch: {
    display: 'flex',
    width: 55,
    height: 55,
    // marginTop:20,
    borderRadius: 30,
    backgroundColor: 'gray',
    justifyContent: 'center',
  },
  inputArea: {
    width: '75%',
    backgroundColor: 'black',
    color: 'white',
    alignItems: 'center',
    borderRadius: 13,
    paddingLeft: 15,
    // paddingRight: 5,
    fontSize: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  searchBtb: {
    backgroundColor: 'brown',
    color: 'white',
    borderRadius: 30,
    width: '18%',
    height: 35,
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
  },
  listArticle: {
    position: 'absolute',
    width: 200,
    top: 0,
    bottom: 0,
    backgroundColor: 'white',
    display: 'flex',
    right: 0,
    marginBottom:50
    // transform:[{translateX:200}]
    // right:'100%'
    // paddingTop: 10,
  },
  listItem: {
    // height:100,
    // width:100,
    // backgroundColor:'yellow',
    display: 'flex',
    paddingBottom: 8,
    paddingTop: 10,

    borderBottomWidth: 1,
    borderBottomColor: 'rgb(245,245,247)',
  },
  listItemText: {
    color: 'black',
    textAlign: 'justify',
    marginRight: 5,
    marginLeft: 5,
  },
});
