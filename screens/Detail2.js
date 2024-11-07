import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Keyboard,
  ActivityIndicator,
  Animated
} from 'react-native';
// import {handle2, searchLaw} from '../redux/fetchData';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector, useDispatch} from 'react-redux';
import { useScrollToTop } from '@react-navigation/native';
import React, {useEffect, useState, useRef, useContext} from 'react';
import {useNetInfo} from '@react-native-community/netinfo';
import CheckBox from 'react-native-check-box';

export function Detail2({navigation}) {
  const [input, setInput] = useState(undefined);

  const [warning, setWanring] = useState(false);

  const [SearchResult, setSearchResult] = useState([]); // đây Object là các luật, điểm, khoản có kết quả tìm kiếm

  const [inputFilter, setInputFilter] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  const [checkedAllFilter, setCheckedAllFilter] = useState(true);
  const [choosenLaw, setChoosenLaw] = useState([]);
  const [LawFilted, setLawFilted] = useState(false)


  const {loading2, info, input2} = useSelector(
    state => state['searchLaw'],
  );

  const list = useRef(null);
  const textInput = useRef(null);

  const dispatch = useDispatch();

  const animated = useRef(new Animated.Value(0)).current;



  let Opacity = animated.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 0.5],
  });

  let Scale = animated.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
  });


  function LawFilterContent(array, obj) {
    let contentFilted = {}
    Object.keys(obj).filter(key=>{
    if(array.includes(key)){
      contentFilted[key] = obj[key]
    }
    })
    setLawFilted(contentFilted)
  }

  useEffect(() => {
    if(info){
      let lawObject = {}
      info.map(law=>{
        lawObject[law._id] = {'lawNameDisplay':law.info['lawNameDisplay'],'lawDescription':law.info['lawDescription']}
      })
      setSearchResult(lawObject)
    }
  }, [info])

  useEffect(() => {
    setInputFilter('');

    if (
      choosenLaw.length ==
      Object.keys(SearchResult || {}).length
    ) {
      setCheckedAllFilter(true);
    } else {
      setCheckedAllFilter(false);
    }
  }, [showFilter]);

  useEffect(() => {
    setChoosenLaw(
      Object.keys(SearchResult).length
        ? Object.keys(SearchResult)
        : [],
    );
  }, [SearchResult]);


  useEffect(() => {
    setWanring(false);
  }, [input]);




  useScrollToTop(list);

  const netInfo = useNetInfo();
  let internetConnected = netInfo.isConnected;


  const NoneOfResutl = () => {
    return (
      <View
        style={{height: 250, alignItems: 'center', justifyContent: 'flex-end'}}>
        <Text style={{fontSize: 40, textAlign: 'center', color: 'black'}}>
          {' '}
          Không có kết quả nào{' '}
        </Text>
      </View>
    );
  };

  return (
    <>
      {(loading2 || !internetConnected) && (
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
            {internetConnected ? "Xin vui lòng đợi trong giây lát ..." :"Vui lòng kiểm tra kết nối mạng ..."}
          </Text>
          <ActivityIndicator size="large" color="white"></ActivityIndicator>
        </View>
      )}

      <ScrollView
        keyboardShouldPersistTaps="handled"
        ref={list}
        style={{backgroundColor: '#EEEFE4'}}>
        <View style={{backgroundColor: 'green'}}>
          <Text style={styles.titleText}>{`Tìm kiếm nội dung`}</Text>

          <View style={styles.inputContainer}>
            <View style={styles.containerBtb}>
              <TouchableOpacity
                style={{
                  ...styles.inputBtb,
                  // right: -5,
                  backgroundColor: 'white',
                  // width: 50,
                }}
                onPress={() => {
                  setShowFilter(true);
                  Keyboard.dismiss();
                  Animated.timing(animated, {
                    toValue: !showFilter ? 100 : 0,
                    // toValue:100,
                    duration: 500,
                    useNativeDriver: false,
                  }).start();
                }}
                >
                <Ionicons
                  name="funnel-outline"
                  style={{...styles.inputBtbText, color: 'black'}}></Ionicons>
                <View
                  style={{
                    position: 'absolute',
                    height: 25,
                    width: 25,
                    backgroundColor: 'red',
                    borderRadius: 20,
                    right: -10,
                    bottom: -10,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      textAlign: 'center',
                      fontSize: 10,
                      fontWeight: 'bold',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    {choosenLaw.length}

                  </Text>
                  
                </View>
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: 'column',
                width: '60%',
                // backgroundColor:'red'
              }}>
              <View
                style={{
                  position: 'relative',
                  flexDirection: 'row',
                  backgroundColor: 'white',
                  // height: 50,
                  borderRadius: 15,
                }}>
                <TextInput
                  ref={textInput}
                  style={styles.inputArea}
                  onChangeText={text => {
                    setInput(text);
                    // ;dispatch(type1(text))
                  }}
                  value={input}
                  selectTextOnFocus={true}
                  placeholder="Nhập từ khóa..."
                  onSubmitEditing={()=>dispatch({type:'searchContent',input:input})
                }></TextInput>
                <TouchableOpacity
                  onPress={() => {setInput('');textInput.current.focus()}}
                  style={{
                    width: '15%',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    left: -3,
                    // backgroundColor:'yellow'
                  }}>
                  {input && (
                    <Ionicons
                      name="close-circle-outline"
                      style={{
                        color: 'black',
                        fontSize: 20,
                        paddingRight: 8,
                        // textAlign: 'center',
                        // width: 20,
                        // height: 20,

                        // textAlign:'right'
                      }}></Ionicons>
                  )}
                </TouchableOpacity>
              </View>
              <Text
                style={{
                  color: 'orange',
                  fontSize: 14,
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}>
                {warning ? 'Vui lòng nhập từ khóa hợp lệ' : ' '}
              </Text>
            </View>
            <View style={styles.containerBtb}>
              <TouchableOpacity
                style={{
                  ...styles.inputBtb,
                  borderRadius: 100,
                  height: 40,
                  top: 5,
                }}
                  onPress={async () => {
                    Keyboard.dismiss();
  
                    dispatch({type: 'searchLaw', input: input});
                  }}>
                <Ionicons
                  name="search-outline"
                  style={styles.inputBtbText}></Ionicons>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{marginTop: 1}}>
          {info == null ? (
            <></>
          ) : (info).length ? (
            Object.values(LawFilted || SearchResult).map((detailInfo, i) => {  
              console.log('detailInfo',detailInfo);
                          
              return (
                <TouchableOpacity
                  style={{
                    paddingBottom: 10,
                    paddingTop: 10,
                    justifyContent: 'center',
                    backgroundColor: '#F9CC76',
                    marginBottom: 6,
                  }}
                  onPress={() =>
                    // navigation.navigate(`${detailInfo._id}`)
                    navigation.navigate(`accessLaw`, {screen: detailInfo._id})
                  }>
                  <View style={styles.item}>
                    <Text style={styles.chapterText} key={`${i}a`}>
                      {detailInfo['lawNameDisplay']}
                    </Text>
                    {!detailInfo['lawNameDisplay'].match(/^(luật|bộ luật|Hiến)/gim) && (
                      <Text style={styles.descriptionText}>
                        {detailInfo && detailInfo['lawDescription']}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <NoneOfResutl />
          )}
        </View>
      </ScrollView>
      {showFilter && (
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
                let timeOut = setTimeout(() => {
                  setShowFilter(false);
                  return () => {};
                }, 500);

                Animated.timing(animated, {
                  toValue: !showFilter ? 100 : 0,
                  // toValue:100,
                  duration: 300,
                  useNativeDriver: false,
                }).start();
              }}></TouchableOpacity>
          </Animated.View>

          <Animated.View
            style={{
              position: 'absolute',
              top: 80,
              bottom: 60,
              minHeight: 500,
              right: 50,
              left: 50,
              backgroundColor: 'white',
              display: 'flex',
              borderRadius: 20,
              transform: [{scale: Scale}],
              overflow: 'hidden',
              // borderWidth:1,
              // borderColor:'brown',
              shadowColor: 'black',
              shadowOpacity: 1,
              shadowOffset: {
                width: 10,
                height: 10,
              },
              shadowRadius: 4,
              elevation: 20,
            }}>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: 'black',
                height: 50,
              }}>
              <TextInput
                onChangeText={text => setInputFilter(text)}
                value={inputFilter}
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
                onPress={() => setInputFilter('')}
                style={{
                  width: '15%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {inputFilter && (
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

            <TouchableOpacity
              style={{
                display: 'flex',
                flexDirection: 'row',
                paddingBottom: 10,
                width: '100%',
                paddingLeft: '5%',
                paddingTop: 10,
                alignItems: 'center',
                backgroundColor: 'rgb(240,240,240)',
                shadowColor: 'black',
                shadowOpacity: 0.5,
                shadowOffset: {
                  width: 5,
                  height: 5,
                },
                shadowRadius: 4,
                elevation: 10,
              }}
              onPress={() => {
                if (
                  choosenLaw.length ==
                  Object.keys(SearchResult).length
                ) {
                  setCheckedAllFilter(false);
                  setChoosenLaw([]);
                } else {
                  setChoosenLaw(
                    Object.keys(SearchResult),
                  );
                  setCheckedAllFilter(true);
                }
                // console.log(choosenLaw);
              }}>
              <CheckBox
                onClick={() => {
                  if (
                    choosenLaw.length ==
                    Object.keys(SearchResult)
                      .length
                  ) {
                    setCheckedAllFilter(false);
                    setChoosenLaw([]);
                  } else {
                    setChoosenLaw(
                      Object.keys(SearchResult),
                    );
                    setCheckedAllFilter(true);
                  }
                }}
                isChecked={checkedAllFilter}
              />

              <Text
                style={{
                  color: 'black',
                  fontWeight: 'bold',
                  marginLeft: 5,
                  // backgroundColor:'green'
                }}>
                Tất cả
              </Text>
            </TouchableOpacity>

            <ScrollView keyboardShouldPersistTaps="handled">
              <View
                style={{
                  paddingTop: 10,
                  paddingLeft: '10%',
                  paddingRight: '5%',
                  display: 'flex',
                  // flexDirection:'row'
                }}>
                {SearchResult &&
                  Object.keys(SearchResult).map(
                    (key, i) => {
                      let nameLaw =
                        SearchResult[key]['lawNameDisplay']
                      let lawDescription =
                      SearchResult[key]['lawDescription']

                      let inputSearchLawReg = inputFilter;
                      if (
                        inputFilter.match(
                          /(\w+|\(|\)|\.|\+|\-|\,|\&|\?|\;|\!|\/|\s?)/gim,
                        )
                      ) {

                        inputSearchLawReg = inputFilter.replace(
                            /\(/gim,
                            '\\(',
                          );

                          

                          inputSearchLawReg = inputSearchLawReg.replace(
                            /\)/gim,
                            '\\)',
                          );


                          inputSearchLawReg = inputSearchLawReg.replace(
                            /\\/gim,
                            '.',
                          );


                          inputSearchLawReg = inputSearchLawReg.replace(
                            /\./gim,
                            '\\.',
                          );


                          inputSearchLawReg = inputSearchLawReg.replace(
                            /\+/gim,
                            '\\+',
                          );

                          

                          inputSearchLawReg = inputSearchLawReg.replace(
                            /\?/gim,
                            '\\?',
                          );

                        }
                      if (
                        nameLaw.match(new RegExp(inputSearchLawReg, 'igm')) ||
                        lawDescription.match(
                          new RegExp(inputSearchLawReg, 'igm'),
                        )
                      ) {
                        return (
                          <TouchableOpacity
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              paddingBottom: 10,
                              width: '90%',
                              alignItems: 'center',
                            }}
                            onPress={() => {
                              if (key == undefined) {
                              } else if (choosenLaw.includes(key)) {
                                setChoosenLaw(
                                  choosenLaw.filter(a1 => a1 !== key),
                                  setCheckedAllFilter(false),
                                );
                              } else {
                                setChoosenLaw([...choosenLaw, key]);
                                if (
                                  choosenLaw.length ==
                                  Object.keys(
                                    SearchResult
                                  ).length -
                                    1
                                ) {
                                  setCheckedAllFilter(true);
                                }
                              }
                            }}
                            >
                            <CheckBox
                              onClick={() => {
                                if (key == undefined) {
                                } else if (choosenLaw.includes(key)) {
                                  setChoosenLaw(
                                    choosenLaw.filter(a1 => a1 !== key),
                                  );
                                  setCheckedAllFilter(false);
                                } else {
                                  setChoosenLaw([...choosenLaw, key]);
                                  if (
                                    choosenLaw.length ==
                                    Object.keys(
                                      SearchResult,
                                    ).length -
                                      1
                                  ) {
                                    setCheckedAllFilter(true);
                                  }
                                }
                              }}
                              isChecked={choosenLaw.includes(key)}
                              style={{}}
                            />

                            <Text style={{marginLeft: 5, color: 'black'}}>
                              {nameLaw}
                            </Text>
                          </TouchableOpacity>
                        );
                      }
                    },
                  )}
              </View>
            </ScrollView>
            <TouchableOpacity
              style={{
                backgroundColor: 'green',
              }}
              onPress={() => {
                LawFilterContent(choosenLaw,SearchResult)
                let timeOut = setTimeout(() => {
                  setShowFilter(false);
                  return () => {};
                }, 500);

                Animated.timing(animated, {
                  toValue: !showFilter ? 100 : 0,
                  // toValue:100,
                  duration: 300,
                  useNativeDriver: false,
                }).start();
              }}>
              <Text
                style={{
                  paddingBottom: 10,
                  paddingTop: 10,
                  textAlign: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 16,
                }}>
                OK
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </>
      )}

    </>
  );
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  inputArea: {
    width: '85%',
    backgroundColor: 'white',
    color: 'black',
    paddingLeft: 12,
    borderRadius: 15,
  },
  containerBtb: {
    width: '15%',
    alignItems: 'center',
  },
  inputBtb: {
    width: '80%',
    height: 30,
    backgroundColor: 'black',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    // right: 5,
    top: 10,
  },
  inputBtbText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  content: {
    height: 0,
    display: 'flex',
    position: 'relative',
    // paddingRight: 10,
    // paddingLeft: 10,
    margin: 0,
    overflow: 'hidden',
  },
  chapter: {
    minHeight: 50,
    justifyContent: 'space-around',
    backgroundColor: '#F9CC76',
    color: 'black',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  item: {
    minHeight: 80,
    // height: 120,
    // backgroundColor: 'green',
    display: 'flex',
    justifyContent: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'column',
    alignItems: 'center',
  },

  chapterText: {
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 17,
  },
  descriptionText: {
    textAlign: 'center',
    color: 'black',
    fontSize: 14,
  },
  chapterArrow: {
    backgroundColor: 'black',
    borderRadius: 25,
    // alignItems:'flex-end',
    display: 'flex',
    right: 10,
    position: 'absolute',
    width: 30,
    height: 30,
    textAlign: 'center',
    justifyContent: 'center',
  },
  articleContainer: {
    fontWeight: 'bold',
    paddingBottom: 6,
    paddingTop: 6,
    color: 'white',
    backgroundColor: '#66CCFF',
    justifyContent: 'center',
    // alignItems:'center',
    display: 'flex',
    textAlign: 'center',
    borderBottomColor: 'white',
    borderBottomWidth: 1,
  },
  article: {
    color: 'white',
    overflow: 'hidden',
    paddingRight: 10,
    paddingLeft: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  blackBackground: {
    backgroundColor: 'white',
    color: 'black',
    flexWrap: 'wrap',
    // width:200,
    overflow: 'hidden',
    flex: 1,
    display: 'flex',
    paddingRight: 10,
    paddingLeft: 10,
    textAlign: 'justify',
    paddingTop: 5,
    paddingBottom: 10,
  },
  highlight: {
    color: 'red',
    backgroundColor: 'yellow',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
