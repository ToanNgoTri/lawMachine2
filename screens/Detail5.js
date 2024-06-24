import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from 'react-native';
import database from '@react-native-firebase/database';
import React, {useState, useEffect, useRef} from 'react';
import {useRoute} from '@react-navigation/native';
import data from '../data/project2-197c0-default-rtdb-export.json';
import {SafeAreaView} from 'react-native-safe-area-context';

let chapterCount;
let articleCount = 0
//lineHeight trong lines phải luôn nhỏ hơn trong highlight và View Hightlight

// search result bị xô lệch, đang xử lý theo hướng dúng onLayout trong Text
// chữ "hộ" search k được
 // hơi bị leak memory chỗ ScrollVIew nha
 // dưới mỗi điều có space to là do dữ liệu có dấu xuống hàng \n 
export default function Detail() {
  const [tittle, setTittle] = useState();     // để collapse chương nếu không có mục 'phần thứ...' hoặc mục' phần thứ...' nếu có 
  const [tittleArray, setTittleArray] = useState([]);

  const [tittle2, setTittle2] = useState();   // để collapse chương nếu có mục 'phần thứ...'          
  const [tittleArray2, setTittleArray2] = useState([]);
  
  const [searchCount, setSearchCount] = useState(0);
  const [positionYArr, setPositionYArr] = useState([]);   // tập hợp pos Y Search
  const [positionYArrArtical, setPositionYArrArtical] = useState([]);
  const [showArticle, setShowArticle] = useState(false);
  
  const [currentY, setCurrentY] = useState(0);    // để lấy vị trí mình đang scroll tới


  const [inputSearchArtical, setInputSearchArtical] = useState('');   // input phần tìm kiếm 'Điều'

  const [currentSearchPoint, setCurrentSearchPoint] = useState(1);    // thứ tự kết quả search đang trỏ tới

  const route = useRoute();

  const list = useRef(null);
  const [input, setInput] = useState(route.params ? route.params.input : '');
  const [find, setFind] = useState(route.params ? true : false);
  // const [find, setFind] = useState(true);
  const [go, setGo] = useState(route.params ? true : false);

  const [Content, setContent] = useState('');


  const reference = database().ref('/Law1');
  useEffect(() => {
    reference.on('value', snapshot => {
      setContent(snapshot.val()[route.name]);
      // setContent(data[route.name]);

    });
  }, []);

  function collapse(a) {      // để collapse chương nếu không có mục 'phần thứ...' hoặc mục' phần thứ...' nếu có 
    if (a == undefined) {
    } else if (tittleArray.includes(a)) {
      setTittleArray(tittleArray.filter(a1 => a1 !== a));
    } else {
      setTittleArray([...tittleArray, a]);
    }
    setTittle(null);
  }

  function collapse2(a) {       // để collapse chương nếu có mục 'phần thứ...'
    if (a == undefined) {
    } else if (tittleArray2.includes(a)) {
      setTittleArray2(tittleArray2.filter(a1 => a1 !== a));
    } else {
      setTittleArray2([...tittleArray2, a]);
    }
    setTittle(null);
  }


  let searchResultCount = 0;
  // let c = 0;
  function highlight(para, word, i2) {
    // if (typeof para == 'string' ) {
    if (word.match(/\w+/gim)) {
      // console.log('a');
      let inputRexgex = para[0].match(new RegExp(String(word), 'igmu'));
      // let inputRexgex = para[0].match(new RegExp('hội', 'igmu'));
      if (inputRexgex) {

        searchResultCount += inputRexgex.length;
      let searchedPara = para[0]
        .split(new RegExp(String(word), 'igmu'))
        // .split(new RegExp('hội', 'igmu'))
        .reduce((prev, current, i) => {
          if (!i) {

            return [current]
          }

          function setPositionYSearch({y}) {

            positionYArr.push(y+currentY);
            positionYArr.sort((a, b) => {
              if (a > b) {
                return 1;
              } else {
                if (a < b) return -1;
              }
            });

            if(go){
              setTimeout(() => {
                list.current.scrollTo({
                  y: positionYArr[0] - 100,//- 57
                  // animated: true
                });
                // console.log('3');
              }, 500);
          
            }
                  }

          return prev.concat(
          //   <Text 
          //   style=
          //   {{textAlign:'center', 
          //   lineHeight:22,
          //   display:'flex',
          //   flexDirection:'row',
          //   // height:23,
          //   overflow:'hidden',
          //   backgroundColor:'orange',
          //   padding:0,
          //   margin:0
          // >
          // }}
            <>
            
            <View
              style={{
                transform: [
                  // {translateY: 18},
                //   // {translateX: 3},
                // { scale: 0 }
                ],
                backgroundColor: 'blue',
                // bottom: 40,
                flex: 1,
                // textAlignVertical: 'center',
                alignSelf: 'center',
                padding: 0,
                margin: 0,
                overflow: 'visible',
                // height: 'auto',
                // lineHeight:22,
                // height:22,
                // width:15,
                right:-50
              }}
              onLayout={event => {
                event.target.measure((x, y, width, height, pageX, pageY) => {
                  setPositionYSearch({
                    y: y + pageY,
                  });
                });
              }}
              >
                {/* <Text style={{backgroundColor:'red',position:'absolute',
                lineHeight:22, 
                display: 'flex',
                right:-50              
              }}>g
                </Text> */}


            </View>
            
              <Text 
      //         onLayout={event => {
      //         const {y} = event.nativeEvent.layout;
      //         console.log('height: ' + y);
      // }}

              style={((searchResultCount - inputRexgex.length +i-1 <  currentSearchPoint) && (searchResultCount - inputRexgex.length +i >=  currentSearchPoint )) ? styles.highlight1 :styles.highlight} key={`${i2}d`}
              onp
              >
                {inputRexgex[i - 1]}
              </Text>
              {/* </Text> */}
              </>
            ,
           <Text 
           style={{
            // backgroundColor:'orange', 
           position:'relative',
           display:'flex',
          margin:0,
          lineHeight:23,
          // backgroundColor:'green'
          }}
           
           >{current}</Text> ,
          );
        }, []);
        
      // return !inputRexgex ? para[0] : searchedPara;
      return searchedPara;

    }else{
      return para[0];

    }

    } else {
      return para[0];
    }

    // }
  }

  let positionYArrArticalDemo = positionYArrArtical;
  function setPositionYArtical({y, key3}) {
if((!tittleArray.length  && !tittleArray2.length) || go) {
    var contains = positionYArrArtical.some( (elem,i) =>{
      // console.log('a');
      return key3 == (Object.keys(elem));
    });
    
    if ( contains ) {
      articleCount++

      positionYArrArticalDemo = positionYArrArticalDemo.map( (elem,i)=>{
        if(Object.keys(elem) == key3){
          return {[key3]:y+currentY}
          
        }else{
          return elem
        }
        
      })
  
    //  console.log(articleCount);

     if(articleCount >= positionYArrArtical.length){
      setPositionYArrArtical(positionYArrArticalDemo)
      articleCount = 0
     }
    
    } else {

      positionYArrArtical.push({[key3]: y+currentY});
      }

  }
  }

  useEffect(() => {
    collapse(tittle);
    chapterCount = Content && Object.keys(Content).length;
  }, [tittle]);

  useEffect(() => {
    collapse2(tittle2);

  }, [tittle2]);


  chapterCount = Content && Object.keys(Content).length;

  function Shrink() {
    for (let b = 0; b <= chapterCount - 1; b++) {
      if (tittleArray == []) {
        setTittleArray([b]);
      } else {
        setTittleArray(oldArray => [...oldArray, b]);
      }
    }
  }

  useEffect(() => {
    setGo(false);
    setSearchCount(0);
    setCurrentSearchPoint(0);
    // setPositionYArrArtical([])

  }, [input]);

  useEffect(() => {
    setSearchCount(searchResultCount);
    setPositionYArr([]);
    setCurrentSearchPoint(1)
    // list.current.scrollTo({
    //   y: positionYArr[1] - 57,
    // });
    // setPositionYArrArtical([]);

  }, [go]);

  useEffect(() => {
    // console.log('currentSearchPoint',currentSearchPoint);
    if((currentSearchPoint != 0) && searchCount){ ////////////////////////////////////////////////////////////////////////
    list.current.scrollTo({
      y: positionYArr[currentSearchPoint - 1] - 100,//- 57
    });
  }
  }, [currentSearchPoint]);


  let SearchArticalResult = positionYArrArtical.filter(item => {
    return Object.keys(item)[0].match(new RegExp(inputSearchArtical, 'igm'));
  });

  useEffect(() => {
    if(find == true){
    setTittleArray([]);
    setTittleArray2([]);
    }
  }, [find]);

  useEffect(() => {
    setTittleArray([]);
    setTittleArray2([]);
    setFind(false)
  }, [showArticle]);

  const a = (key, i, key1, i1a) => {
    // phần nếu không mục 'phần thứ' trong văn bản
    return Object.keys(key)[0] != '0' ? (
        <View
          key={`${i}b`}
          style={
            showArticle || find ||  (!tittleArray2.includes(`${i1a}a${i}`) && !tittleArray.includes(i)) || styles.content //////////////////////////////////////////////////////////////////
          }
          >
          {key[key1].map((key2, i2) => {
            // console.log('b',Object.keys(key2));
         return (
            <View
              onLayout={event => {
                event.target.measure((x, y, width, height, pageX, pageY) => {
                  setPositionYArtical({
                    y: y + pageY,
                    key3: Object.keys(key2)[0]
                    
                  });
                });
              }}
              style={go ? {width:'100%'}:{width:'99%'} }
              >
              <Text key={`${i2}c`} style={styles.dieu}>
                {go
                  ? highlight(Object.keys(key2), input, i2)
                  : Object.keys(key2)}
              </Text>
             <Text key={`${i2}d`} style={styles.lines}>
                {go
                  ? highlight(Object.values(key2), input, i2)
                  : Object.values(key2)[0]}
              </Text>
            </View>
          )})}
        </View>
    ) : (
      {
        /* <>
                    <View
                      key={`${i1}b`}
                      // style={(showArticle || find || !tittleArray.includes(i)) || styles.content}
                      >
                      {key.map((key2, i2) => (
                        <View
                          onLayout={event => {
                            event.target.measure(
                              (x, y, width, height, pageX, pageY) => {
                                setPositionYArtical({
                                  y: y + pageY,
                                  key3: Object.keys(key2),
                                });
                              },
                            );
                          }}>
                          <Text key={`${i2}c`} style={styles.dieu}>
                            {go
                              ? highlight(Object.keys(key2), input, i2)
                              : Object.keys(key2)}
                          </Text>
                          <Text key={`${i2}d`} style={styles.lines}>
                            {
                              go
                                ? highlight(Object.values(key2), input, i2)
                                : Object.values(key2)

                                }
                          </Text>
                        </View>
                      ))}
                    </View>
                  </> */
      }
    );
  };

  const b = (keyA, i, keyB) => {
    // phần nếu có mục 'phần' trong văn bản

    return (
      <>
        <View
          key={`${i}b`}
          style={
            showArticle || find || !tittleArray.includes(i) || styles.content
          }
          >
          {keyA[keyB].map((keyC, iC) => {
            // keyC ra object là từng chương hoặc ra điều luôn

            if (Object.keys(keyC)[0].match(/^Chương.*$/gim)) {
              //nếu có chương
              return (
                <>
            <TouchableOpacity     // đây là chương
                key={i}
                // style={styles.chapter}
                onPress={() => {
                  setTittle2(`${iC}a${i}`);
                }}>

                  <Text
                    key={`${i}a`}
                    style={{
                      fontSize: 15,
                      color: 'white',
                      fontWeight: 'bold',
                      padding: 4,
                      textAlign: 'center',
                      backgroundColor: 'black',
                      marginBottom:1
                    }}>
                    {Object.keys(keyC)[0].toUpperCase()}
                  </Text>
                  </TouchableOpacity>

                  {a(keyC, i, Object.keys(keyC)[0], iC)}
                </>
              );
            } else {
              //nếu không có chương
              return (
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
                    style={go ? {width:'100%'}:{width:'99%'} }
                    >
                    <Text key={`${iC}c`} style={styles.dieu}>
                      {go
                        ? highlight(Object.keys(keyC), input, iC)
                        : Object.keys(keyC)}
                    </Text>
                    <Text key={`${iC}d`} style={styles.lines}>
                      {go
                        ? highlight(Object.values(keyC), input, iC)
                        : Object.values(keyC)}
                    </Text>
                  </View>
              );
              //  a( keyC,i,Object.keys(keyC)[0],iC)
            }

          })}
        </View>
      </>
    );
  };

  return (
    <>
      <ScrollView
      onScroll={ event =>{       
       {const {y} = event.nativeEvent.contentOffset;
                // console.log('wRef: ' + y);
                setCurrentY(y)
       }
      }}

        ref={list}
        style={find ? {marginBottom: 130} : {marginBottom: 50}}>
        <Text style={styles.titleText}>{`${route.name}`}</Text>
        {Content &&
          Content.map((key, i) => (
            <>
              <TouchableOpacity
                key={i}
                style={styles.chapter}
                onPress={() => {
                  setTittle(i);
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
                  { Object.keys(key)[0].toUpperCase()}
                </Text>
              </TouchableOpacity>

              {Object.keys(key)[0].match(/phần thứ .*/gim)
                ? b(key, i, Object.keys(key)[0])
                : a(key, i, Object.keys(key)[0])}
            </>
          ))}
      </ScrollView>
      <View style={styles.functionTab}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => {
            setFind(false)
            setTittleArray([]);
            Shrink();
          }}>
          <Text style={styles.innerTab}>S</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => {
            setTittleArray([]);
            setTittleArray2([])
          }}>
          <Text style={styles.innerTab}>E</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => {
            list.current.scrollTo({y: 0});
          }}>
          <Text style={styles.innerTab}>Top</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => {
            setFind(!find);
          }}>
          <Text style={styles.innerTab}>Find</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => {
            setShowArticle(!showArticle);
          }}>
          <Text style={styles.innerTab}>Menu</Text>
        </TouchableOpacity>
      </View>

      {find && (
        <View style={styles.findArea}>
          <View style={styles.searchView}>
            <TouchableOpacity
              style={styles.tabSearch}
              onPress={() => {
                currentSearchPoint == positionYArr.length
                  ? setCurrentSearchPoint(1)
                  : setCurrentSearchPoint(currentSearchPoint + 1);
              }}>
              <Text
                style={{
                  transform: [{rotate: '90deg'}],
                  color: 'yellow',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: 30,
                }}>{`>`}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.tabSearch}
              onPress={() => {
                currentSearchPoint == 1
                  ? setCurrentSearchPoint(positionYArr.length)
                  : setCurrentSearchPoint(currentSearchPoint - 1);
              }}>
              <Text
                style={{
                  transform: [{rotate: '90deg'}],
                  color: 'yellow',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: 30,
                }}>{`<`}</Text>
            </TouchableOpacity>
            <View style={styles.inputArea}>
              <TextInput
                style={{width: '85%', color: 'white'}}
                onChangeText={text => setInput(text)}
                autoFocus={false}
                value={input}
                placeholder=" Input to Search ..."
                placeholderTextColor={'gray'}></TextInput>
              <TouchableOpacity
                style={{color: 'white', fontSize: 16, width: '15%'}}
                onPress={() => {
                  setInput('');
                }}>
                <Text
                  style={{color: 'white', fontSize: 16, textAlign: 'center'}}>
                  X
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.searchBtb}
              onPress={() => {
                setGo(true);
                Keyboard.dismiss();
              }}>
              <Text style={{color: 'white', fontWeight: 'bold'}}> Go </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.tabSearch}
              onPress={() => {
                setFind(!find);
              }}>
              <Text style={styles.innerTab}>X</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.searchCount}>
            {go &&
              (

                !input.match(/\w+/gim) ? 'Vui lòng nhâp từ khóa' : (searchCount ? `có tổng cộng ${currentSearchPoint}/${searchCount} từ`: `Không tìm thấy từ ${input}`)
                // searchCount
                // ? `có tổng cộng ${currentSearchPoint}/${searchCount} từ`
                // : `Không tìm thấy từ ${input}`
              )
                
                }{' '}
          </Text>
        </View>
      )}
      {showArticle && (
        <>
          <TouchableOpacity //ovrlay
            style={{
              opacity: 0.3,
              backgroundColor: 'rgb(245,245,247)',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              display: 'flex',
              position: 'absolute',
            }}
            onPress={() => {
              setShowArticle(false);
            }}></TouchableOpacity>
          <View style={styles.listArticle}>
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
                placeholderTextColor={'gray'}>
                </TextInput>
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
            <ScrollView>
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
                    list.current.scrollTo({y: Object.values(key) - 57});//
                  }}>
                  <Text style={styles.listItemText}>{Object.keys(key)}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 30,
    textAlign: 'center',
  },
  chapter: {
    height: 60,
    justifyContent: 'center',
    backgroundColor: 'orange',
    color: 'black',
    alignItems: 'center',
    marginBottom: 1,
  },
  chapterText: {
    textAlign: 'center',
    color: 'yellow',
    fontSize: 15,
    fontWeight: 'bold',
  },
  dieu: {
    fontWeight: 'bold',
    // marginBottom: 5,
    marginTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    lineHeight:22,
    // backgroundColor:'blue',
    alignItems:'center',
    justifyContent:'center'
  },
  lines: {
    display: 'flex',
    position:'relative',
    textAlign: 'justify',
    paddingLeft: 5,
    paddingRight: 5,
    fontSize:14,
    // height:'auto',
    // position:'relative',
    // justifyContent: 'center',
    // alignItems:'center',
    // textAlign:'center',
    color:'black',
    // margin:5,
    // backgroundColor:'yellow',
    lineHeight:22,
    overflow:'hidden',
    
  },
  highlight: {
    color: 'black',
    backgroundColor: 'yellow',
    // position:'re',
    display: 'flex',
    textAlign: 'center',
    lineHeight:22,
    // position:'absolute',
    position:'relative',

  },
  highlight1:{
    color: 'black',
    display: 'flex',
    textAlign: 'center',
    position:'relative',
    backgroundColor: 'orange',
    lineHeight:22,

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
    justifyContent: 'center',
    bottom: 0,
    backgroundColor: 'gray',
    height: 50,
  },
  tab: {
    backgroundColor: 'red',
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
    color: 'yellow',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  findArea: {
    display: 'flex',
    backgroundColor: 'red',
    flexDirection: 'column',
    bottom: 50,
    position: 'absolute',
    right: 0,
    left: 0,
  },
  searchView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 6,
    marginBottom: 0,
  },
  tabSearch: {
    width: '10%',
  },
  inputArea: {
    width: '50%',
    backgroundColor: 'black',
    color: 'white',
    alignItems: 'center',
    borderRadius: 13,
    paddingLeft: 15,
    paddingRight: 5,
    fontSize: 15,
    flexDirection: 'row',
  },
  searchBtb: {
    backgroundColor: 'brown',
    color: 'white',
    borderRadius: 30,
    width: 60,
    height: 30,
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
  },
  searchCount: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 5,
  },
  listArticle: {
    position: 'absolute',
    width: 200,
    top: 0,
    bottom: 0,
    backgroundColor: 'white',
    display: 'flex',
    right: 0,
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
