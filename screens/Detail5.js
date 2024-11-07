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
  Dimensions,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {Dirs, FileSystem} from 'react-native-file-access';
import React, {useState, useEffect, useRef, useContext} from 'react';
import {useRoute} from '@react-navigation/native';
import dataOrg from '../data/project2-197c0-default-rtdb-export.json';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Shadow} from 'react-native-shadow-2';
import {ModalStatus} from '../App';
import {useSelector, useDispatch} from 'react-redux';
import {InfoDownloaded} from '../App';

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

export default function Detail({navigation}) {
  const inf = useContext(InfoDownloaded);
  // console.log('inf.info',inf.info);

  // const [tittle, setTittle] = useState();     // để collapse chương nếu không có mục 'phần thứ...' hoặc mục' phần thứ...' nếu có
  const [tittleArray, setTittleArray] = useState([true]); // đây là 'phần thứ...' hoặc chương (nói chung là section cao nhất)

  const [tittleArray2, setTittleArray2] = useState([true]); // nếu có 'phần thứ...' thì đây sẽ là chương

  const [positionYArr, setPositionYArr] = useState([]); // tập hợp pos Y Search
  const [positionYArrArtical, setPositionYArrArtical] = useState([]);
  const [showArticle, setShowArticle] = useState(false);

  const [currentY, setCurrentY] = useState(0); // để lấy vị trí mình đang scroll tới

  const [inputSearchArtical, setInputSearchArtical] = useState(''); // input phần tìm kiếm 'Điều'

  const [currentSearchPoint, setCurrentSearchPoint] = useState(1); // thứ tự kết quả search đang trỏ tới

  const [exists, setExists] = useState(false);

  const dispatch = useDispatch();

  const route = useRoute();

  async function StoreInternal() {
    async function k() {
      if (await FileSystem.exists(Dirs.CacheDir + '/Info.txt', 'utf8')) {
        const FileInfoString = await FileSystem.readFile(
          Dirs.CacheDir + '/Info.txt',
          'utf8',
        );
        console.log('FileContentString', JSON.parse(FileInfoString));
        return JSON.parse(FileInfoString);
      }
    }

    let m = await k();
    if (m) {
      const FileInfoStringContent = await FileSystem.readFile(
        Dirs.CacheDir + '/Content.txt',
        'utf8',
      );
      let contentObject = JSON.parse(FileInfoStringContent);
      contentObject[route.params.screen] = Content;

      const addContent = await FileSystem.writeFile(
        Dirs.CacheDir + '/Content.txt',
        JSON.stringify(contentObject),
        'utf8',
      );
      console.log('addContent1', addContent);

      const FileInfoStringInfo = await FileSystem.readFile(
        Dirs.CacheDir + '/Info.txt',
        'utf8',
      );
      let infoObject = JSON.parse(FileInfoStringInfo);
      infoObject[route.params.screen] = Info;

      const addInfo = await FileSystem.writeFile(
        Dirs.CacheDir + '/Info.txt',
        JSON.stringify(infoObject),
        'utf8',
      );
      console.log('addInfo1', addInfo);
    } else {
      const addContent = await FileSystem.writeFile(
        Dirs.CacheDir + '/Content.txt',
        JSON.stringify({[route.params.screen]: Content}),
        'utf8',
      );
      console.log('addContent2', addContent);

      const addInfo = await FileSystem.writeFile(
        Dirs.CacheDir + '/Info.txt',
        JSON.stringify({[route.params.screen]: Info}),
        'utf8',
      );
      console.log('addInfo2', addInfo);
    }

    const FileInfoStringContent1 = await FileSystem.readFile(
      Dirs.CacheDir + '/Content.txt',
      'utf8',
    );
    let contentObject = JSON.parse(FileInfoStringContent1);

    const FileInfoStringInfo1 = await FileSystem.readFile(
      Dirs.CacheDir + '/Info.txt',
      'utf8',
    );
    let infoObject = JSON.parse(FileInfoStringInfo1);
    console.log('infoObject', infoObject);

    // con.updateContent({...dataOrg['LawContent'], ...contentObject});
    // inf.updateInfo({...dataOrg['LawInfo'], ...infoObject});
  }

  async function DeleteInternal() {
    console.log('Delete');
    const FileInfoStringContent = await FileSystem.readFile(
      Dirs.CacheDir + '/Content.txt',
      'utf8',
    );
    let contentObject = JSON.parse(FileInfoStringContent);
    delete contentObject[route.params.screen];

    const addContent = await FileSystem.writeFile(
      Dirs.CacheDir + '/Content.txt',
      JSON.stringify(contentObject),
      'utf8',
    );
    console.log('addContent1', addContent);

    const FileInfoStringInfo = await FileSystem.readFile(
      Dirs.CacheDir + '/Info.txt',
      'utf8',
    );
    let infoObject = JSON.parse(FileInfoStringInfo);
    delete infoObject[route.params.screen];

    const addInfo = await FileSystem.writeFile(
      Dirs.CacheDir + '/Info.txt',
      JSON.stringify(infoObject),
      'utf8',
    );
    console.log('addInfo1', addInfo);
    // else {
    //   const addContent = await FileSystem.writeFile(
    //     Dirs.CacheDir + '/Content.txt',
    //     JSON.stringify({[route.params.screen]: Content}),
    //     'utf8',
    //   );
    //   console.log('addContent2', addContent);

    //   const addInfo = await FileSystem.writeFile(
    //     Dirs.CacheDir + '/Info.txt',
    //     JSON.stringify({[route.params.screen]: Info}),
    //     'utf8',
    //   );
    //   console.log('addInfo2', addInfo);
    // }
  }

  const animatedForNavi = useRef(new Animated.Value(0)).current;

  const list = useRef(null);
  const textInputFind = useRef(null);
  const textInputArticle = useRef(null);
  const PositionYArrArticalForDev = useRef(null);
  PositionYArrArticalForDev.current = [];
  const [input, setInput] = useState(route.params ? route.params.input : '');
  const [valueInput, setValueInput] = useState('');
  const [find, setFind] = useState(route.params ? route.params.input? true : false: true);

  const [go, setGo] = useState(route.params ? true : false);

  const [Content, setContent] = useState([]);
  const [Info, setInfo] = useState({});

  const {width, height} = Dimensions.get('window');
  let heightDevice = height;
  let widthDevice = width;
  Dimensions.addEventListener('change', ({window: {width, height}}) => {
    // console.log(`Width: ${width}, Height: ${height}`);
    widthDevice = width;
    heightDevice = height;
  });

  function pushToSearch() {
    setGo(true);

    if (input) {
      if (input.match(/(\w+|\(|\)|\.|\+|\-|\,|\&|\?|\;|\!|\/)/gim)) {
        let inputSearchLawReg = input;

        inputSearchLawReg = input.replace(/\(/gim, '\\(');

        inputSearchLawReg = inputSearchLawReg.replace(/\)/gim, '\\)');

        inputSearchLawReg = inputSearchLawReg.replace(/\./gim, '\\.');

        inputSearchLawReg = inputSearchLawReg.replace(/\+/gim, '\\+');

        // if(input.match(/\//img)){
        //   inputSearchLawReg = inputSearchLawReg.replace(/\//img,'\\/')
        // }

        inputSearchLawReg = inputSearchLawReg.replace(/\\/gim, '.');

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
  const ModalVisibleStatus = useContext(ModalStatus);


  const {loading, content, info} = useSelector(state => state['read']);

// console.log(Content);

// console.log(route.params.screen);

async function callOneLaw() {
  let info = await fetch(`http://192.168.0.101:5000/getonelaw`,{
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body:JSON.stringify({input:route.params.screen})
  })

  
  let respond = await info.json()
  return respond

}

// console.log('Content',Content);

  useEffect(() => {
    // if(info && content){

    callOneLaw().then(res=>{
      
      setContent(res['content'])
      setInfo(res['info'])

    })
    // }

      // return function cleanUp(){content=[]}

  }, [info])
  

  async function getContentExist() {
    if (await FileSystem.exists(Dirs.CacheDir + '/Content.txt', 'utf8')) {
      const FileInfoStringContent = await FileSystem.readFile(
        Dirs.CacheDir + '/Content.txt',
        'utf8',
      );
      const FileInfoStringInfo = await FileSystem.readFile(
        Dirs.CacheDir + '/Info.txt',
        'utf8',
      );
      if (FileInfoStringContent) {
        return {
          content: JSON.parse(FileInfoStringContent),
          info: JSON.parse(FileInfoStringInfo),
        };
        // f = JSON.parse(FileInfoStringInfo)
      }
    }
  }

  useEffect(() => {
    getContentExist().then(cont => {
      if (
        cont &&
        Object.keys({...dataOrg['LawInfo'], ...cont.info}).includes(route.params.screen)
      ) {
        setInfo({...dataOrg['LawInfo'], ...cont.info}[route.params.screen]);
        setContent({...dataOrg['LawContent'], ...cont.content}[route.params.screen]);
      } else if (Object.keys(dataOrg['LawInfo']).includes(route.params.screen)) {
        setInfo(dataOrg['LawInfo'][route.params.screen]);
        setContent(dataOrg['LawContent'][route.params.screen]);
      } else {
        setExists(true);
        dispatch({type: 'read', lawName: route.params.screen});
      }
    });

    Animated.timing(animatedForNavi, {
      toValue: find ? 80 : 0,
      duration: 600,
      useNativeDriver: false,
    }).start();

  }, []);

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
    // console.log('para',para);
    
    if(para[0][[0]]){     // đôi khi Điều ... không có khoản (nội dung chính trong điều) thì điều này giúp không load ['']
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
                  style={
                    searchResultCount - inputRexgex.length + i - 1 <
                      currentSearchPoint &&
                    searchResultCount - inputRexgex.length + i >=
                      currentSearchPoint
                      ? styles.highlight1
                      : styles.highlight
                  }
                  key={`${i2}d`}>
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
  }

  let positionYArrArticalDemo = positionYArrArtical;

  function setPositionYArtical({y, key3}) {
    // key3 = key3.replace(/(?<=\w*)\\(?=\w*)/gim, '/');

    // console.log('key3',key3);
    // console.log('tittleArray.length',tittleArray.length);

    if (
      // true
      tittleArray.length ||
      tittleArray2.length ||
      go ||
      tittleArray[0] ||
      tittleArray2[0]
    ) {
      var contains = positionYArrArtical.some((elem, i) => {
        return key3 == Object.keys(elem);
      });

      if (!showArticle) {
        // nếu showArticle đang đóng
        if (contains) {
          // nếu positionYArrArtical chưa có "điều" gì đó
          articleCount++;

          for (let g = 0; g <= positionYArrArtical.length; g++) {
            if (positionYArrArticalDemo[g][key3]) {
              positionYArrArticalDemo[g][key3] = y + currentY;
              break;
            }
          }

          if (articleCount >= positionYArrArtical.length) {
            // nếu positionYArrArtical đã đủ số lượng điều
            setPositionYArrArtical(positionYArrArticalDemo);
            // setPositionYArrArtical(q.current);
            PositionYArrArticalForDev.current = [];

            articleCount = 0;
          }
        } else {
          // nếu positionYArrArtical chưa đủ số lượng điều
          positionYArrArtical.push({[key3]: y + currentY});
          // console.log(567);
        }
      } else {
        // nếu showArticle đang mở
        articleCount++;

        // positionYArrArtical.map((elem, i) => {
        PositionYArrArticalForDev.current[articleCount - 1] = {
          [key3]: y + currentY,
        };

        // });
        if (articleCount >= positionYArrArtical.length) {
          setPositionYArrArtical(PositionYArrArticalForDev.current);
          articleCount = 0;
          PositionYArrArticalForDev.current = [];
        }

        // console.log('q.current',q.current);
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

    abc = inputSearchArtical.replace(/\(/gim, '\\(');

    abc = abc.replace(/\)/gim, '\\)');

    return Object.keys(item)[0].match(new RegExp(abc, 'igm'));
  });

  let transY = animatedForNavi.interpolate({
    inputRange: [-100, 0, 80, 90, 100],
    outputRange: [5, 5, -53, 0, 0],
  });

  let transX = animatedForNavi.interpolate({
    inputRange: [-100, 0],
    outputRange: [0, (widthDevice / 100) * 60],
  });

  let Opacity = animatedForNavi.interpolate({
    inputRange: [-100, 0],
    outputRange: [0.7, 0],
  });

  let MagginBottom = animatedForNavi.interpolate({
    inputRange: [-100, 0, 80, 90, 100],
    outputRange: [45, 45, 100, 0, 0],
  });

  useEffect(() => {
    if (find == true) {
      setTittleArray([]);
      setTittleArray2([]);
      Shrink();
    }
    // Animated.timing(animatedForNavi, {
    //   toValue:find ? 50 : 0,
    //   duration: 1000,
    //   useNativeDriver: false,
    // }).start();
    // setShowArticle(false)
    Keyboard.dismiss();
  }, [find]);

  const a = (key, i, key1, i1a, t) => {
    // phần nếu có mục 'chương' trong văn bản

    return Object.keys(key)[0] != '0' ? (
      <View
        key={`${i}b`}
        // style={
        //   showArticle ||
        //   find ||
        //   (t == undefined
        //     ? !tittleArray.includes(i)
        //     : !tittleArray2.includes(t)) ||
        //   styles.content //////////////////////////////////////////////////////////////////
        // }
        style={
          showArticle ||
          find ||
          ((t == undefined
            ? !tittleArray.includes(i)
            : !tittleArray2.includes(t)) &&
            styles.content) //////////////////////////////////////////////////////////////////
        }>
        {key[key1].map((key2, i2) => {
          // console.log('key2',key2);
          // console.log('Object.keys(key2)',Object.keys(key2));
          
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
              style={
                go
                  ? {width: '100%', marginBottom: 20}
                  : {width: '99%', marginBottom: 20}
              }>
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
                        backgroundColor: '#66CCFF',
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
                    (!tittleArray.includes(i) && styles.content) //////////////////////////////////////////////////////////////////
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

  let onlyArticle = false; // dùng để hiển thị collapse và expand
  const c = (key, i, ObjKeys) => {
    // phần nếu chỉ có Điều ...
    onlyArticle = true;

    return Object.keys(key)[0] != '0' ? (
      <View key={`${i}b`}>
        <View
          onLayout={event => {
            event.target.measure((x, y, width, height, pageX, pageY) => {
              setPositionYArtical({
                y: y + pageY,
                key3: ObjKeys,
              });
            });
          }}
          style={
            go
              ? {width: '100%', marginBottom: 20}
              : {width: '99%', marginBottom: 20}
          }>
          <Text key={`${i}c`} style={styles.dieu}>
            {highlight([ObjKeys], valueInput, i)}
          </Text>
          <Text key={`${i}d`} style={styles.lines}>
            {highlight([key[ObjKeys]], valueInput, i)}
          </Text>
        </View>
      </View>
    ) : (
      {}
    );
  };

  // const d = (key, i) => {
  //   // dành cho phụ lục, danh mục
  //   return (
  //     <View
  //       style={
  //         showArticle || find || (!tittleArray.includes(i) && styles.content)
  //       }>
  //       {Object.values(key)[0].map((key1, i) => (
  //         <Text style={styles.lines}>{`${key1}\n`}</Text>
  //       ))}
  //     </View>
  //   );
  // };

  return (
    <>
      {loading && (
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            opacity: 0.7,
            backgroundColor: 'black',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
          }}>
          <Text
            style={{
              color: 'white',
              marginBottom: 15,
              fontWeight: 'bold',
            }}>
            Xin vui lòng đợi trong giây lát ...
          </Text>
          <ActivityIndicator size="large" color="white"></ActivityIndicator>
        </View>
      )}

      <Modal
        presentationStyle="pageSheet"
        animationType="slide"
        visible={ModalVisibleStatus.modalStatus}
        onRequestClose={() => ModalVisibleStatus.updateModalStatus(false)}
        style={{}}>
        <ScrollView
          style={{
            backgroundColor: '#EEEFE4',
          }}>
          <View style={{paddingBottom: 30}}>
            <View
              style={{
                // marginTop:20,
                backgroundColor: '#CCCCCC',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: 60,
                // borderBottomWidth:3,
                borderColor: '#2F4F4F',
                shadowColor: 'black',
                shadowOpacity: 1,
                shadowOffset: {
                  width: 10,
                  height: 10,
                },
                shadowRadius: 4,
                elevation: 10,
              }}>
              <TouchableOpacity
                onPress={() => {
                  ModalVisibleStatus.updateModalStatus(false);
                }}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 60,
                  width: 60,
                  // borderWidth:4,
                  borderColor: 'black',
                  // borderRadius:10,
                  // backgroundColor:'#528B8B',
                }}>
                <Ionicons
                  name="close-outline"
                  style={{
                    color: 'black',
                    fontSize: 30,
                    textAlign: 'center',
                    // width: '100%',
                    fontWeight: 'bold',
                  }}></Ionicons>
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: '#CCCCCC',
                  alignItems: 'center',
                  flex: 1,
                  justifyContent: 'flex-end',
                }}>
                {exists && !dataOrg['LawInfo'][route.params.screen] && (
                  <TouchableOpacity
                    onPress={() => {
                      StoreInternal();
                      setExists(false);
                    }}
                    style={{
                      // backgroundColor: '#00CC33',
                      // padding: 20,
                      alignItems: 'center',
                      width: 70,
                      height: 60,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Ionicons
                      name="cloud-download-outline"
                      style={{
                        color: '#009933',
                        fontSize: 25,
                        textAlign: 'center',
                        width: '100%',
                        fontWeight: 'bold',
                      }}></Ionicons>
                  </TouchableOpacity>
                )}
                {!exists && !dataOrg['LawInfo'][route.params.screen] && (
                  <TouchableOpacity
                    onPress={async () => {
                      Alert.alert(
                        'thông báo',
                        'Bạn có muốn xóa văn bản ra khỏi bộ nhớ không?',
                        [
                          {
                            text: 'Cancel',
                            style: 'cancel',
                          },
                          {
                            text: 'OK',
                            onPress: () => {
                              DeleteInternal();
                              setExists(true);
                            },
                          },
                        ],
                      );
                    }}
                    style={{
                      // backgroundColor: '#00CC33',
                      // padding: 20,
                      alignItems: 'center',
                      width: 70,
                      height: 60,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {/* <Text
                    style={{
                      // backgroundColor: 'red',
                      paddingLeft: 10,
                      paddingRight: 5,
                      fontSize: 15,
                      color: 'white',
                    }}>
                    Xóa
                  </Text> */}
                    <Ionicons
                      name="trash-outline"
                      style={{
                        color: 'red',
                        fontSize: 25,
                        textAlign: 'center',
                        fontWeight: 'bold',
                      }}></Ionicons>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <View
              style={{
                padding: 20,
                paddingTop: 30,
                paddingBottom: 20,
                // backgroundColor: 'blue',
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 23,
                  fontWeight: 'bold',
                  color: 'black',
                }}>
                THÔNG TIN CHI TIẾT
              </Text>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                paddingTop: 10,
                justifyContent: 'space-evenly',
                alignItems: 'center',
                // backgroundColor: 'green',
                paddingLeft: '5%',
                paddingRight: '5%',
              }}>
              <View style={{...styles.ModalInfoContainer, borderTopWidth: 2}}>
                <View style={{width: '40%', justifyContent: 'center'}}>
                  <Text style={styles.ModalInfoTitle}>Tên gọi:</Text>
                </View>
                <View style={{flex: 1}}>
                  <Text style={styles.ModalInfoContent}>
                    {Info && Info['lawNameDisplay']}
                  </Text>
                </View>
              </View>
              <View style={styles.ModalInfoContainer}>
                <View style={{width: '40%', justifyContent: 'center'}}>
                  <Text style={styles.ModalInfoTitle}>Trích yếu nội dung:</Text>
                </View>
                <View style={{flex: 1}}>
                  <Text style={styles.ModalInfoContent}>
                    {Info && Info['lawDescription']}
                  </Text>
                </View>
              </View>
              <View style={styles.ModalInfoContainer}>
                <View style={{width: '40%'}}>
                  <Text style={styles.ModalInfoTitle}>Ngày ký:</Text>
                </View>
                <View style={{flex: 1}}>
                  <Text style={styles.ModalInfoContent}>
                    {Info && Info['lawDaySign']}
                  </Text>
                </View>
              </View>
              <View style={styles.ModalInfoContainer}>
                <View style={{width: '40%'}}>
                  <Text style={styles.ModalInfoTitle}>Ngày có hiệu lực:</Text>
                </View>
                <View style={{flex: 1}}>
                  <Text style={styles.ModalInfoContent}>
                    {Info && Info['lawDayActive']}
                  </Text>
                </View>
              </View>
              {Info['lawNumber'] && (
                <View style={styles.ModalInfoContainer}>
                  <View style={{width: '40%'}}>
                    <Text style={styles.ModalInfoTitle}>Số văn bản:</Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={styles.ModalInfoContent}>
                      {Info && !Info['lawNumber'].match(/^0001\\HP/gim)
                        ? Info['lawNumber']
                        : ''}
                    </Text>
                  </View>
                </View>
              )}

              <View style={styles.ModalInfoContainer}>
                <View style={{width: '40%'}}>
                  <Text style={styles.ModalInfoTitle}>Họ Tên người ký:</Text>
                </View>
                <View style={{flex: 1, paddingBottom: 10, paddingTop: 10}}>
                  {Info && !Array.isArray(Info['nameSign']) ? (
                    <Text style={styles.ModalInfoContent}>
                      {Info['nameSign']}
                    </Text>
                  ) : (
                    Info['nameSign'] &&
                    Info['nameSign'].map(key => (
                      <View>
                        <Text style={{...styles.ModalInfoContentLawRelated}}>
                          {`- ${key}`}
                        </Text>
                      </View>
                    ))
                  )}
                </View>
              </View>

              <View style={styles.ModalInfoContainer}>
                <View style={{width: '40%'}}>
                  <Text style={styles.ModalInfoTitle}>Chức vụ người ký:</Text>
                </View>
                <View style={{flex: 1, paddingBottom: 10, paddingTop: 10}}>
                  {Info && !Array.isArray(Info['roleSign']) ? (
                    <Text style={styles.ModalInfoContent}>
                      {Info['roleSign']}
                    </Text>
                  ) : (
                    Info['roleSign'] &&
                    Info['roleSign'].map(key => (
                      <View>
                        <Text style={{...styles.ModalInfoContentLawRelated}}>
                          {`- ${key}`}
                        </Text>
                      </View>
                    ))
                  )}
                </View>
              </View>
              <View style={{...styles.ModalInfoContainer}}>
                <View style={{width: '40%'}}>
                  <Text style={{...styles.ModalInfoTitle}}>
                    Cơ quan ban hành:
                  </Text>
                </View>
                <View style={{flex: 1, paddingBottom: 10, paddingTop: 10}}>
                  {Info && !Array.isArray(Info['unitPublish']) ? (
                    <Text style={styles.ModalInfoContent}>
                      {Info['unitPublish']}
                    </Text>
                  ) : (
                    Info['unitPublish'] &&
                    Info['unitPublish'].map(key => (
                      <View>
                        <Text style={{...styles.ModalInfoContentLawRelated}}>
                          {`- ${key}`}
                        </Text>
                      </View>
                    ))
                  )}
                </View>
              </View>
              {Info && Object.keys(Info).includes('lawRelated') && (
                <View
                  style={{...styles.ModalInfoContainer, borderBottomWidth: 2}}>
                  <View style={{width: '40%'}}>
                    <Text style={styles.ModalInfoTitle}>
                      Văn bản liên quan:
                    </Text>
                  </View>
                  <View style={{flex: 1, paddingBottom: 10, paddingTop: 10}}>
                    {Info &&
                      Info['lawRelated'].map((key, i) => {
                        let nameLaw = key

                        let nameLaw2;
                        // for (let a = 0; a < (inf.info).length; a++) {
                        //   if (
                        //     Object.values(inf.info)[a]['lawNameDisplay'].match(
                        //       new RegExp(`^${key}`, 'gim'),
                        //     )
                        //   ) {
                        //     nameLaw2 = (inf.info)[a];
                        //     break;
                        //   }else if(Object.values(inf.info)[a]['lawDescription'].match(
                        //     new RegExp(`^${key}`, 'gim'),
                        //   )){
                        //     nameLaw2 = (inf.info)[a];
                        //   }
                        // }
                        return (
                          <TouchableOpacity
                            onPress={() => {
                              if (Object.keys(inf.info).includes(nameLaw)) {
                                navigation.navigate(nameLaw);
                                ModalVisibleStatus.updateModalStatus(false);
                              } else if (nameLaw2) {
                                navigation.navigate(nameLaw2);
                                ModalVisibleStatus.updateModalStatus(false);
                              }
                            }}>
                            <Text
                              style={{
                                ...styles.ModalInfoContentLawRelated,
                                fontWeight:
                                  Object.keys(inf.info).includes(nameLaw) ||
                                  nameLaw2
                                    ? 'bold'
                                    : '300',
                              }}>
                              -{' '}
                              {
                                // (inf.info).includes(nameLaw)
                                //   ? inf.info[nameLaw]['lawNameDisplay']
                                //   : nameLaw2
                                //   ? inf.info[nameLaw2]['lawNameDisplay']
                                //   : key
                                inf.info[nameLaw] ? inf.info[nameLaw] : nameLaw
                              }
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                  </View>
                </View>
              )}
              <TouchableOpacity
                onPress={async () => {
                  ModalVisibleStatus.updateModalStatus(false);
                  // const exists = await FileSystem.exists(
                  //   Dirs.CacheDir + '/Info.txt',
                  //   'utf8',
                  // );
                  // console.log('exists', exists);
                }}
                style={{
                  padding: 5,
                  marginTop: 30,
                  backgroundColor: '#778899',
                  // backgroundColor: '#00CC33',
                  alignItems: 'center',
                  width: 110,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 10,
                  // borderColor:'#555555',
                  // borderWidth:1,

                  shadowColor: 'black',
                  shadowOpacity: 1,
                  shadowOffset: {
                    width: 10,
                    height: 10,
                  },
                  shadowRadius: 4,
                  elevation: 10,
                }}>
                <Text
                  style={{
                    // backgroundColor: 'red',
                    paddingLeft: 10,
                    paddingRight: 5,
                    fontSize: 15,
                    color: 'white',
                  }}>
                  Đóng
                </Text>
                <Ionicons
                  name="log-out-outline"
                  style={{
                    color: 'white',
                    fontSize: 25,
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}></Ionicons>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Modal>

      <Animated.View style={{marginBottom: MagginBottom}}>
        <ScrollView
          onScroll={event => {
            {
              const {y} = event.nativeEvent.contentOffset;
              setCurrentY(y);
              // console.log('y',y);
            }
          }}
          ref={list}
          showsVerticalScrollIndicator={true}>
          <Text style={styles.titleText}>
            {Info && Info['lawNameDisplay'] && `${Info['lawNameDisplay']}`}
          </Text>
          {Content &&
            Content.map((key, i) => (
              <>
                {!Object.keys(key)[0].match(/^(Điều|Điều)/gim) && (
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
                )}

                {Object.keys(key)[0].match(/^phần thứ .*/gim)
                  ? b(key, i, Object.keys(key)[0])
                  : Object.keys(key)[0].match(/^chương .*/gim)
                  ? a(key, i, Object.keys(key)[0])
                  : Object.keys(key)[0].match(/^điều .*/gim)
                  ? c(key, i, Object.keys(key)[0])
                  : ''}
              </>
            ))}
        </ScrollView>
      </Animated.View>
      {Boolean(searchResultCount) && find && searchResultCount > 1 && (
        <Animated.View
          style={{
            right: 25,
            display: 'flex',
            flexDirection: 'column',
            position: 'absolute',
            justifyContent: 'space-between',
            height: 130,
            opacity: 0.5,
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
        <Animated.View
          style={{...styles.findArea, transform: [{translateY: transY}]}}>
          <Shadow
            distance={17}
            startColor={'#A0A0A0'}
            sides={'top'}
            style={{...styles.searchView, width: widthDevice}}>
            {/* <View style={styles.searchView}> */}
            <View style={styles.inputArea}>
              <TextInput
                ref={textInputFind}
                selectTextOnFocus={true}
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
                  textInputFind.current.focus();
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
            {/* </View> */}
          </Shadow>
        </Animated.View>
      }
      <View style={styles.functionTab}>
        {!onlyArticle && (
          <TouchableOpacity
            style={styles.tab}
            onPress={() => {
              setFind(false);

              let timeOut = setTimeout(() => {
                setShowArticle(false);
                return () => {};
              }, 600);

              setTittleArray([]);
              Shrink();

              Animated.timing(animatedForNavi, {
                toValue: 0,
                // toValue:100,
                duration: 600,
                useNativeDriver: false,
              }).start();
            }}>
            {/* <Text style={styles.innerTab}>S</Text> */}
            <Ionicons
              name="chevron-expand-outline"
              style={styles.innerTab}></Ionicons>
          </TouchableOpacity>
        )}
        {!onlyArticle && (
          <TouchableOpacity
            style={styles.tab}
            onPress={() => {
              setTittleArray([]);
              setTittleArray2([]);
              setFind(false);
              let timeOut = setTimeout(() => {
                setShowArticle(false);
                return () => {};
              }, 600);

              Animated.timing(animatedForNavi, {
                toValue: 0,
                duration: 600,
                useNativeDriver: false,
              }).start();
            }}>
            {/* <Text style={styles.innerTab}>E</Text> */}
            <Ionicons
              name="chevron-collapse-outline"
              style={styles.innerTab}></Ionicons>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.tab}
          onPress={() => {
            list.current.scrollTo({y: 0});
            let timeOut = setTimeout(() => {
              setShowArticle(false);
              return () => {};
            }, 600);
          }}>
          <Ionicons name="arrow-up-outline" style={styles.innerTab}></Ionicons>
        </TouchableOpacity>

        <TouchableOpacity
          // style={find ? styles.ActiveTab : styles.tab}
          style={styles.tab}
          onPress={() => {
            setFind(!find);
            let timeOut = setTimeout(() => {
              setShowArticle(false);
              return () => {};
            }, 600);
            Animated.timing(animatedForNavi, {
              toValue: !find ? 80 : 0,
              duration: 600,
              useNativeDriver: false,
            }).start();

            setTittleArray([]);
            setTittleArray2([]);
            Shrink();
            setGo(false);
          }}>
          {/* <Text style={styles.innerTab}>Find</Text> */}
          <Ionicons
            name="search-outline"
            style={find ? styles.ActiveInner : styles.innerTab}></Ionicons>
        </TouchableOpacity>
        <TouchableOpacity
          // style={showArticle && !find ? styles.ActiveTab : styles.tab}
          style={styles.tab}
          onPress={() => {
            if (showArticle) {
              let timeOut = setTimeout(() => {
                setShowArticle(false);
                return () => {};
              }, 600);
            } else {
              setShowArticle(true);
            }
            setFind(false);
            Keyboard.dismiss();
            Animated.timing(animatedForNavi, {
              toValue: !showArticle ? -100 : 0,
              duration: 600,
              useNativeDriver: false,
            }).start();

            setTittleArray([]);
            setTittleArray2([]);
            Shrink();
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
                opacity: Opacity,
              }}>
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
                    setShowArticle(false);
                    return () => {};
                  }, 600);
                  Animated.timing(animatedForNavi, {
                    toValue: !showArticle ? -100 : 0,
                    duration: 600,
                    useNativeDriver: false,
                  }).start();
                }}></TouchableOpacity>
            </Animated.View>

            <Animated.View
              style={{
                ...styles.listArticle,
                width: (widthDevice / 100) * 60,
                transform: [{translateX: transX}],
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: 'black',
                  height: 50,
                }}>
                <TextInput
                  ref={textInputArticle}
                  onChangeText={text => setInputSearchArtical(text)}
                  selectTextOnFocus={true}
                  value={inputSearchArtical}
                  style={{
                    paddingLeft: 10,
                    paddingRight: 10,
                    color: 'white',
                    width: '85%',
                    alignItems: 'center',
                  }}
                  placeholder=" Nhập từ điều luật ..."
                  placeholderTextColor={'gray'}></TextInput>
                <TouchableOpacity
                  onPress={() => {
                    setInputSearchArtical('');
                    textInputArticle.current.focus();
                  }}
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
              <ScrollView keyboardShouldPersistTaps="handled">
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
                      list.current.scrollTo({y: Object.values(key) - 70});
                      Animated.timing(animatedForNavi, {
                        toValue: !showArticle ? -100 : 0,
                        duration: 600,
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
    fontWeight: 'bold',
  },
  chapter: {
    // height: 60,
    justifyContent: 'center',
    backgroundColor: '#F9CC76',
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
    textAlign: 'justify',
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: '0',
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
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    bottom: 0,
    backgroundColor: 'white',
    height: 45,
    paddingTop: 2,
    zIndex: 10,
    borderTopWidth: 2,
    borderTopColor: 'black',
    alignItems: 'center',

    // shadowColor:'black',
    // shadowOpacity:1,
    // shadowOffset: {
    //   width: 0,
    //   height: -10,
    // },
    // elevation: 20,
  },
  tab: {
    // backgroundColor: 'red',
    borderRadius: 30,
    width: '15%',
    height: 40,
    textAlign: 'center',
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
  },
  // ActiveTab: {
  //   backgroundColor: 'black',
  //   borderRadius: 40,
  //   width: 50,
  //   height: 50,
  //   // marginBottom:10,
  //   textAlign: 'center',
  //   justifyContent: 'center',
  //   display: 'flex',
  //   alignItems: 'center',
  // },
  innerTab: {
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  ActiveInner: {
    color: 'green',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  findArea: {
    display: 'flex',
    // backgroundColor: '#AAAAAA',
    flexDirection: 'column',
    bottom: -10,
    position: 'absolute',
    right: 0,
    left: 0,
    // borderTopLeftRadius:10,
    // borderTopRightRadius:10,
    backgroundColor: '#A0A0A0',
    // overflow:'hidden'
    borderTopWidth: 2,
    borderTopColor: 'yellow',
  },
  searchView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    // marginTop: 3,
    // marginBottom: 6,
    backgroundColor: '#FAEBD7',
    // width:'100%',
    overflow: 'hidden',
    margin: 0,
    paddingTop: 3,
    paddingBottom: 4,
  },
  tabSearch: {
    display: 'flex',
    width: 55,
    height: 55,
    // marginTop:20,
    borderRadius: 30,
    backgroundColor: '#777777',
    justifyContent: 'center',
  },
  inputArea: {
    width: '75%',
    backgroundColor: 'black',
    color: 'white',
    alignItems: 'center',
    borderRadius: 13,
    paddingLeft: 15,
    paddingRight: 5,
    fontSize: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  searchBtb: {
    backgroundColor: '#111111',
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
    width: '55%',
    top: 0,
    bottom: 0,
    backgroundColor: 'white',
    display: 'flex',
    right: 0,
    marginBottom: 44,
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
  ModalInfoContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: '2%',
    paddingRight: '2%',
    flexWrap: 'wrap',
    borderWidth: 2,
    // paddingTop: 10,
    // borderBottomWidth: 1,
    borderTopWidth: 2,
    borderBottomWidth: 0,
    marginLeft: 5,
    justifyContent: 'center',
    alignItems: 'center',
    // paddingBottom:10
  },
  ModalInfoTitle: {
    paddingBottom: 10,
    paddingTop: 10,
    // flex: 1,
    fontWeight: 'bold',
    fontSize: 15,
    color: 'black',
    paddingRight: 5,
    top: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ModalInfoContent: {
    paddingBottom: 10,
    paddingTop: 10,
    flex: 1,
    color: 'black',
    fontSize: 14,
    paddingLeft: '4%',
    // backgroundColor:'yellow',
    textAlignVertical: 'center',
  },
  ModalInfoContentLawRelated: {
    paddingBottom: 5,
    paddingTop: 5,
    flex: 1,
    color: 'black',
    fontSize: 14,
    paddingLeft: '4%',
  },
});
