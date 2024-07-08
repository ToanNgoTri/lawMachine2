import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Alert,
} from 'react-native';
import database from '@react-native-firebase/database';
import React, {useState, useEffect, useRef} from 'react';
import {useRoute} from '@react-navigation/native';
import data from '../data/project2-197c0-default-rtdb-export.json';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

let TopUnitCount;   // là đơn vị lớn nhất vd là 'phần thứ' hoặc chương
let articleCount = 0
let sumChapterArray = [] // array mà mỗi phần tử là 'phần thứ...' có tổng bn chương
sumChapterArray[0] = 0  
let sum // sum của các chương trong luật có phần thứ

let eachSectionWithChapter = []
//lineHeight trong lines phải luôn nhỏ hơn trong highlight và View Hightlight

// để searchArticle transition vào cho đẹp

// search result bị xô lệch, đang xử lý theo hướng dúng onLayout trong Text
 // hơi bị leak memory chỗ ScrollVIew nha
// chỗ chapter nếu bung được thì bung hết
 
 export default function Detail() {
  // const [tittle, setTittle] = useState();     // để collapse chương nếu không có mục 'phần thứ...' hoặc mục' phần thứ...' nếu có 
  const [tittleArray, setTittleArray] = useState([]);   // đây là 'phần thứ...' hoặc chương (nói chung là section cao nhất)

  const [tittleArray2, setTittleArray2] = useState([]);   // nếu có 'phần thứ...' thì đây sẽ là chương 
  
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
  const [valueInput, setValueInput] = useState('');
  const [find, setFind] = useState(route.params ? true : false);

  const [go, setGo] = useState(route.params ?  true : false);

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

let contain = false
    if(eachSectionWithChapter[a]){
      for( let m = 0 ; m < eachSectionWithChapter[a].length; m++){
        if(tittleArray2.includes(eachSectionWithChapter[a][m])){
      contain = true
    }else{
      contain = false
      break
    }
  }
    

    let tittleArray2Copy = tittleArray2
  for( let m = 0 ; m < eachSectionWithChapter[a].length; m++){
    if(!contain){
      if(!tittleArray2.includes(eachSectionWithChapter[a][m])){
      tittleArray2.push(eachSectionWithChapter[a][m])  
}
}else{
  tittleArray2Copy = tittleArray2Copy.filter(item => item != eachSectionWithChapter[a][m])
  setTittleArray2(tittleArray2Copy)
}
}

    }
}

  function collapse2(a) {       // để collapse chương nếu có mục 'phần thứ...'
    
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
    // if (typeof para == 'string' ) {
    if (word.match(/\w+/gim)) {
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
                right:-50,
                height:go ? 9: 1
              }}
              onLayout={event => {
                event.target.measure((x, y, width, height, pageX, pageY) => {
                  setPositionYSearch({
                    y: y + pageY,
                  });
                });
              }}
              >
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
           position:'relative',
           display:'flex',
          margin:0,
          lineHeight:23,
          }}
           
           >{current}</Text> ,
          );
        }, []);
        
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
  

     if(articleCount >= positionYArrArtical.length){
      setPositionYArrArtical(positionYArrArticalDemo)
      articleCount = 0
     }
    
    } else {

      positionYArrArtical.push({[key3]: y+currentY});
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

    for (let b = 0; b <= sum2 - 1; b++) {
      if (tittleArray2 == []) {
        setTittleArray2([b]);
      } else {
        setTittleArray2(oldArray => [...oldArray, b+1]);
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
    setSearchCount(searchResultCount);
    setPositionYArr([]);
  }, [go]);

  useEffect(() => {
    if((currentSearchPoint != 0) && searchCount){ 
    list.current.scrollTo({
      y: positionYArr[currentSearchPoint - 1] - 100,//- 57
    });
  }
  }, [currentSearchPoint]);


  let SearchArticalResult = positionYArrArtical.filter(item => {
    let abc =inputSearchArtical
    if(inputSearchArtical.match(/\(/img)){
      abc = inputSearchArtical.replace(/\(/img,'\\(')
    }

    if(inputSearchArtical.match(/\)/img)){
      abc = abc.replace(/\)/img,'\\)')
    }


    return Object.keys(item)[0].match(new RegExp(abc, 'igm'));
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
    setFind(false);
  }, [showArticle]);

  let t
  const a = (key, i, key1, i1a,t) => {
    // phần nếu không mục 'phần thứ' trong văn bản


    return Object.keys(key)[0] != '0' ? (
        <View
          key={`${i}b`}
          style={
            showArticle || find || 
          (  t == undefined ? ( !tittleArray.includes(i) )
            :   (!tittleArray2.includes(t)  ) )
            
            
            ||  styles.content //////////////////////////////////////////////////////////////////

            
          }
          >
          {key[key1].map((key2, i2) => {
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
                {
                  highlight(Object.keys(key2), valueInput, i2)
                  }
              </Text>
             <Text key={`${i2}d`} style={styles.lines}>
                {
                  highlight(Object.values(key2), valueInput, i2)
                  }
              </Text>
            </View>
          )})}
        </View>
    ) : (
      {
      }
    );
  };



  let sum2 = sumChapterArray.reduce((total,currentValue) => {
    if(currentValue){
    return total + currentValue;
    }
  });


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
            
            if (Object.keys(keyC)[0].match(/^Chương.*$/gim)) {
              //nếu có chương
              let t = 0

              sumChapterArray[i+1] = keyA[keyB].length ? keyA[keyB].length :0
            sum = sumChapterArray.slice(0,i+1).reduce((total,currentValue) => {
              if(currentValue){
              return total + currentValue;
              }
            });


t = sum + iC+1
if(!eachSectionWithChapter[i]){
  eachSectionWithChapter[i] = [t]
}else if(!eachSectionWithChapter[i].includes(t)){
  eachSectionWithChapter[i].push(t)
}
 
              return (
                <>
            <TouchableOpacity     // đây là chương
                key={i}
                // style={styles.chapter}
                onPress={() => {
                  // setTittle2(`${iC}a${i}`);
                  // collapse2(`${iC}a${i}`);
                  collapse2(t);

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
                      marginBottom:1
                    }}>
                    {Object.keys(keyC)[0].toUpperCase()}
                  </Text>
                  </TouchableOpacity>

                  {a(keyC, i, Object.keys(keyC)[0], iC,t)}
                  
                </>
              );
            } else {
              //nếu không có chương
              return (
                <View
                style={
                  showArticle || find ||  !tittleArray.includes(i) || styles.content //////////////////////////////////////////////////////////////////
                }
      >
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
                      {
                        highlight(Object.keys(keyC), valueInput, iC)
                      }
                    </Text>
                    <Text key={`${iC}d`} style={styles.lines}>
                      {
                        highlight(Object.values(keyC), valueInput, iC)
                        }
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
      <ScrollView
      onScroll={ event =>{       
       {const {y} = event.nativeEvent.contentOffset;
                setCurrentY(y)
       }
      }}

        ref={list}
        style={find ? {marginBottom: 100} : {marginBottom: 50}}
        showsVerticalScrollIndicator={true}
        >
        <Text style={styles.titleText}>{`${route.name}`}</Text>
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
                  { Object.keys(key)[0].toUpperCase()}
                </Text>
              </TouchableOpacity>

              {Object.keys(key)[0].match(/phần thứ .*/gim)
                ? b(key, i, Object.keys(key)[0])
                : a(key, i, Object.keys(key)[0])}
            </>
          ))}
      </ScrollView>

{ (Boolean(searchCount) && !Boolean(tittleArray.length) && !Boolean(tittleArray2.length)) &&   ( <View style={{right:25,display:'flex',flexDirection:'column', 
      position:'absolute',justifyContent:'space-between',
      height:130,opacity:.6,bottom:find?140:80 ,
      }}>
            <TouchableOpacity
              style={styles.tabSearch}
              onPress={() => {
                currentSearchPoint == 1
                  ? setCurrentSearchPoint(positionYArr.length)
                  : setCurrentSearchPoint(currentSearchPoint - 1);
              }}>
              <Ionicons name="caret-up-outline" style={{
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
              <Ionicons name="caret-down-outline" style={{
                  color: 'rgb(240,240,208)',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: 25,
                }}></Ionicons>

            </TouchableOpacity>

      </View>)
 }

      <View style={styles.functionTab}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => {
            setFind(false)
            setTittleArray([]);
            Shrink();
          }}>
          {/* <Text style={styles.innerTab}>S</Text> */}
          <Ionicons name="chevron-collapse-outline" style={styles.innerTab}></Ionicons>

        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => {
            setTittleArray([]);
            setTittleArray2([])
          }}>
          {/* <Text style={styles.innerTab}>E</Text> */}
          <Ionicons name="chevron-expand-outline" style={styles.innerTab}></Ionicons>

        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => {
            list.current.scrollTo({y: 0});
          }}>
          {/* <Text style={styles.innerTab}>Top</Text> */}
          <Ionicons name="arrow-up-outline" style={styles.innerTab}></Ionicons>
        </TouchableOpacity>

        <TouchableOpacity
          style={find ? styles.ActiveTab : styles.tab}
          onPress={() => {
            setFind(!find);
          }}>
          {/* <Text style={styles.innerTab}>Find</Text> */}
          <Ionicons name="search-outline" style={find ? styles.ActiveInner :styles.innerTab}></Ionicons>
        </TouchableOpacity>
        <TouchableOpacity
          style={showArticle ? styles.ActiveTab : styles.tab}
          onPress={() => {
            setShowArticle(!showArticle);
          }}>
          {/* <Text style={styles.innerTab}>Menu</Text> */}
          <Ionicons name="menu-outline" style={showArticle ? styles.ActiveInner :styles.innerTab}></Ionicons>
        </TouchableOpacity>
      </View>

      {find && (
        <View style={styles.findArea}>
          <View style={styles.searchView}>
            <View style={styles.inputArea}>
              <TextInput
                style={{width: '65%', color: 'white', }}
                onChangeText={text => setInput(text)}
                autoFocus={false}
                value={input}
                placeholder=" Vui lòng nhập từ khóa ..."
                placeholderTextColor={'gray'}>

                </TextInput>
                <Text
       style={{width: '23%', color: 'white',fontSize:9,textAlign:'right',paddingRight:3}}
>
                  {searchCount ? `${currentSearchPoint}/${searchCount}`: searchCount}
                </Text>
              <TouchableOpacity
                style={{color: 'white', fontSize: 16, width: '12%'}}
                onPress={() => {
                  setInput('');
                }}>
                { input &&   <Ionicons name="close-circle-outline" style={{color: 'white', fontSize: 20, textAlign: 'center',    width:'100%',
                  height:20,
              }}></Ionicons>}
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.searchBtb}
              onPress={() => {
                setGo(true);
                if ((input && input.match(/\w+/gim)) || input.match(/\(/img) || input.match(/\)/img)) {
                  let inputSearchLawReg = input
                  if(input.match(/\(/img)){
                    inputSearchLawReg = input.replace(/\(/img,'\\(')
                  }
                  if(input.match(/\)/img)){
                    inputSearchLawReg = inputSearchLawReg.replace(/\)/img,'\\)')
                  }

                  setValueInput(inputSearchLawReg)
                  // console.log(inputSearchLawReg);
                }else{
                  Alert.alert('Thông báo','Bạn chưa nhập từ khóa')

                }

                setCurrentSearchPoint(1)
                Keyboard.dismiss();
              }}>
                <Ionicons name="return-down-forward-outline" style={{color: 'white', fontWeight: 'bold',fontSize:18}}></Ionicons>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {showArticle && (
        <>
          <TouchableOpacity //overlay
            style={{
              opacity: 0.6,
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
    fontSize: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 30,
    textAlign: 'center',
    paddingLeft:10,
    paddingRight:10,
    color:'gray'
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
    justifyContent:'center',
    color:'black'
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
    justifyContent:'space-evenly' ,
    bottom: 0,
    backgroundColor: 'black',
    height: 52,
    paddingTop:2
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
  ActiveTab:{
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
  ActiveInner:{
    color: 'black',
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
    marginBottom: 6,
  },
  tabSearch: {
    display:'flex',
    width:55,
    height:55,
    // marginTop:20,
    borderRadius:30,
    backgroundColor:'gray',
    justifyContent:'center'
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
    justifyContent:'space-around'
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
