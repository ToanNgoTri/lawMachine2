import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Keyboard,
  Animated,
} from 'react-native';

import CheckBox from 'react-native-check-box';
import database from '@react-native-firebase/database';
import Ionicons from 'react-native-vector-icons/Ionicons';

import data from '../data/project2-197c0-default-rtdb-export.json';

import React, {useEffect, useState, useRef, useContext} from 'react';

import {RefForSearch} from '../App';

import {useNetInfo} from '@react-native-community/netinfo';

// lúc ấn X để xóa hay nhập input hay bị đơ
export function Detail1({navigation}) {
  const [Content, setContent] = useState({});
  const [SearchResult, setSearchResult] = useState([]); // đây Object là các luật, điểm, khoản có kết quả tìm kiếm
  const [input, setInput] = useState(undefined);
  const [valueInput, setValueInput] = useState('');
  const [valueInputForNav, setValueInputForNav] = useState('');

  const [inputFilter, setInputFilter] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  const [checkedAllFilter, setCheckedAllFilter] = useState(true);

  const [name, setName] = useState(); // dùng để collapse (thu thập key của các law)
  const [nameArray, setNameArray] = useState([]); // arrray của các law đã expand

  const [article, setArticle] = useState(); // dùng để collapse (thu thập key của các 'điều')
  const [articleArray, setArticleArray] = useState([]); // arrray của các 'điều' đã expand

  const [choosenLaw, setChoosenLaw] = useState([]);

  const [warning, setWanring] = useState(false);
  const list = useRef(null);

  const animated = useRef(new Animated.Value(0)).current;

  let Opacity = animated.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 0.5],
  });

  let Scale = animated.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
  });

  const reference = database().ref('/Law1');
  // const route = useRoute();
  const SearchScrollview = useContext(RefForSearch);

  SearchScrollview.updateSearch(list);

  // const onTabPress = () => {
  //   list.current.scrollTo({
  //     y: 0,
  //     animated: true,
  //   });
  // };

  const netInfo = useNetInfo();
  let internetConnected = netInfo.isConnected;

  useEffect(() => {

    if(internetConnected){
      reference.on('value', snapshot => {
        setContent(snapshot.val());
        setChoosenLaw(Object.keys(snapshot.val()));
        });
          }else{
            setContent(data);
            setChoosenLaw(Object.keys(data));
                }

    navigation.setParams({
      query: 'someText',
    });

    // if(choosenLaw.length == Object.keys(Content).length){
      setCheckedAllFilter(true)
    // }else{
    //   setCheckedAllFilter(false)
    // }


    // navigation.setParams({
    //   scrollToTop: () => {
    //     onTabPress();
    //     console.log('m');
    //   }
    // })
  }, [internetConnected]);

  function Search(input) {
    let searchArray = {};

    if (input) {
      // if ( (input.match(/\w+/gim)) || input.match(/\(/img) || input.match(/\)/img) || input.match(/\./img) || input.match(/\+/img)) {
      if (input.match(/(\w+|\(|\)|\.|\+|\-|\,|\&|\?|\;|\!)/gim)) {
        function a(key, key1) {
          // Object.keys(key2).map((key3, i3) => {
          // thama nhap chuowng (array dieu)

          Object.values(key1)[0].map((key2, i1) => {
            // chọn từng điều

            // Object.keys(key2).map((key5, i5) => {
            let replace = `(.*)${input}(.*)`;
            let re = new RegExp(replace, 'gmi');
            if (Object.keys(key2)[0].match(re)) {
              searchArray[key].push({
                [Object.keys(key2)[0]]: Object.values(key2)[0],
              });
            } else if (Object.values(key2)[0] != '') {
              if (Object.values(key2)[0].match(re)) {
                searchArray[key].push({
                  [Object.keys(key2)[0]]: Object.values(key2)[0],
                });
              }
            }
            // }
          });
        }

        Object.keys(Content).map((key, i) => {
          //key là tên của luật
          // tham nhap luat (array chuong)

          searchArray[key] = [];
          if (choosenLaw.includes(key)) {
            Content[key].map((key1, i1) => {
              // ra Object Chuong hoặc (array phần thứ...)
              if (Object.keys(key1)[0].match(/phần thứ .*/gim)) {
                // nếu có 'phần thứ

                if (
                  Object.keys(Object.values(key1)[0][0])[0].match(
                    /^Chương .*/gim,
                  )
                ) {
                  //nếu có chương

                  Object.values(key1)[0].map((key2, i) => {
                    a(key, key2);

                    // Object.values(key2)[0].map((key3, i3) => {
                    //   // chọn từng điều

                    //     let replace = `(.*)${input}(.*)`;
                    //     let re = new RegExp(replace, 'gmi');
                    //     if(Object.keys(key3)[0].match(re)){
                    //       searchArray[key].push({[Object.keys(key3)[0]]: Object.values(key3)[0]});
                    //     }else if (Object.values(key3)[0].match(re)) {
                    //       searchArray[key].push({[Object.keys(key3)[0]]: Object.values(key3)[0]});
                    //     }
                    //   // }
                    // })
                  });

                  // console.log('searchArray',searchArray);
                } else {
                  //nếu không có chương

                  // Object.keys(key1).map((key2, i2) => {
                  //   // thama nhap chuowng (array dieu)

                  //   key1[key2].map((key3, i3) => {
                  //     // chọn từng điều

                  //     Object.keys(key3).map((key4, i4) => {
                  //       let replace = `(.*)${input}(.*)`;
                  //       let re = new RegExp(replace, 'gmi');
                  //       if(key4.match(re)){
                  //         searchArray[key].push({[key4]: key3[key4]});
                  //       }else if (key3[key4].match(re)) {
                  //         searchArray[key].push({[key4]: key3[key4]});
                  //       }
                  //     });
                  //   });
                  // });

                  a(key, key1);
                }
              } else {
                // nếu không có phần thứ...
                a(key, key1);
              }
            });
          }
        });

        let searchResult = {};

        Object.keys(searchArray).map((key, i) => {
          searchArray[key].map((key1, i) => {
            searchResult[key] = searchArray[key];
          });
        });

        setSearchResult(searchResult);
        // console.log('searchResult',searchResult);
        searchResult = [];
        setArticleArray([]);
        setNameArray([]);
      } else {
        setWanring(true);
      }
    } else {
      setWanring(true);
    }
  }

  function collapse(a) {
    if (a == undefined) {
    } else if (nameArray.includes(a)) {
      setNameArray(nameArray.filter(a1 => a1 !== a));
    } else {
      setNameArray([...nameArray, a]);
    }
    setName(null);
  }

  function collapseArticle(a) {
    if (a == undefined) {
    } else if (articleArray.includes(a)) {
      setArticleArray(articleArray.filter(a1 => a1 !== a));
    } else {
      setArticleArray([...articleArray, a]);
    }
    setArticle(null);
  }

  function highlight(para, word) {
    if (typeof para == 'string') {
      let inputRexgex = para.match(new RegExp(word, 'igm'));
      return (
        <Text>
          {para.split(new RegExp(word, 'igm')).reduce((prev, current, i) => {
            if (!i) {
              return [current];
            }
            // bị lỗi khi viết hoa và thường khi input
            return prev.concat(
              <Text style={styles.highlight}>{inputRexgex[i - 1]}</Text>,
              current,
            );
          }, [])}
        </Text>
      );
    }
  }

  useEffect(() => {
    collapse(name);
  }, [name]);

  useEffect(() => {
    collapseArticle(article);
  }, [article]);

  useEffect(() => {
    setWanring(false);
  }, [input]);

  useEffect(() => {
    setInputFilter('');

    if(choosenLaw.length == Object.keys(Content).length){
      setCheckedAllFilter(true)
    }else{
      setCheckedAllFilter(false)
    }
    console.log('choosenLaw.length',choosenLaw.length);
    console.log('Content.length',Object.keys(Content).length);
  }, [showFilter]);

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
      <ScrollView keyboardShouldPersistTaps="handled" ref={list}>
        <View style={{backgroundColor: 'green'}}>
          <Text style={styles.titleText}>{`Tìm kiếm văn bản`}</Text>

          <View style={styles.inputContainer}>
            {/* <View
            style={{width:"15%",backgroundColor:'yellow',alignItems:'center'}}
            > */}
            <TouchableOpacity
              style={{
                ...styles.inputBtb,
                right: -5,
                backgroundColor: 'white',
                width: '12%',
              }}
              onPress={() => {
                setShowFilter(true);

                Animated.timing(animated, {
                  toValue: !showFilter ? 100 : 0,
                  // toValue:100,
                  duration: 500,
                  useNativeDriver: false,
                }).start();
              }}>
              <Ionicons
                name="funnel-outline"
                style={{...styles.inputBtbText, color: 'black'}}></Ionicons>
            </TouchableOpacity>
            {/* </View> */}

            <View
              style={{
                flexDirection: 'column',
                width: '60%',
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
                  style={styles.inputArea}
                  onChangeText={text => setInput(text)}
                  value={input}
                  placeholder="Nhập từ khóa..."></TextInput>
                <TouchableOpacity
                  onPress={() => setInput('')}
                  style={{
                    width: '15%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    left: -3,
                  }}>
                  {input && (
                    <Ionicons
                      name="close-circle-outline"
                      style={{
                        color: 'black',
                        fontSize: 20,
                        textAlign: 'center',
                        width: 20,
                        height: 20,
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
            <TouchableOpacity
              style={styles.inputBtb}
              onPress={() => {
                Keyboard.dismiss();

                let inputSearchLawReg = input;
                if (input) {
                  if (input.match(/\(/gim)) {
                    inputSearchLawReg = input.replace(/\(/gim, '\\(');
                  }
                  if (input.match(/\)/gim)) {
                    inputSearchLawReg = inputSearchLawReg.replace(
                      /\)/gim,
                      '\\)',
                    );
                  }
                  if (input.match(/\./gim)) {
                    inputSearchLawReg = inputSearchLawReg.replace(
                      /\./gim,
                      '\\.',
                    );
                  }
                  if (input.match(/\+/gim)) {
                    inputSearchLawReg = inputSearchLawReg.replace(
                      /\+/gim,
                      '\\+',
                    );
                  }
                  if (input.match(/\?/gim)) {
                    inputSearchLawReg = inputSearchLawReg.replace(
                      /\?/gim,
                      '\\?',
                    );
                  }
                  if (input.match(/\//gim)) {
                    inputSearchLawReg = inputSearchLawReg.replace(/\//gim, '.');
                  }
                  if (input.match(/\\/gim)) {
                    inputSearchLawReg = inputSearchLawReg.replace(/\\/gim, '.');
                  }
                }
                setValueInput(inputSearchLawReg);
                setValueInputForNav(input);

                Search(inputSearchLawReg);

                // console.log(inputSearchLawReg);
              }}>
              <Ionicons
                name="search-outline"
                style={styles.inputBtbText}></Ionicons>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{marginTop: 1}}>
          {Array.isArray(SearchResult) ? null : !Object.keys(SearchResult)
              .length ? (
            <NoneOfResutl />
          ) : (
            Object.keys(SearchResult).map((key, i) => (
              <>
                <TouchableOpacity
                  key={i}
                  style={styles.chapter}
                  onPress={() => {
                    setName(i);
                  }}>
                  <Text style={styles.chapterText} key={`${i}a`}>
                    {key} có {0 || SearchResult[key].length} điều, khoản trùng
                    khớp
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate(`${key}`, {input: valueInputForNav})
                    }
                    style={styles.chapterArrow}>
                    <Ionicons
                      name="return-down-forward-outline"
                      style={{
                        fontWeight: 'bold',
                        color: 'white',
                        textAlign: 'center',
                        fontSize: 17,
                      }}></Ionicons>
                  </TouchableOpacity>
                </TouchableOpacity>
                {SearchResult[key].map((key1, i1) => (
                  <View
                    key={`${i1}b`}
                    style={nameArray.includes(i) || styles.content}>
                    {Object.keys(key1).map((key2, i2) => (
                      <>
                        <TouchableOpacity
                          style={styles.articleContainer}
                          onPress={() => {
                            setArticle(`${i}${i1}a${i2}c`);
                          }}>
                          <Text style={styles.article} key={`${i2}c`}>
                            {highlight(key2, valueInput)}
                          </Text>
                        </TouchableOpacity>
                        <Text
                          style={
                            articleArray.includes(`${i}${i1}a${i2}c`)
                              ? styles.blackBackground
                              : styles.content
                          }
                          key={`${i2}d`}>
                          {highlight(key1[key2], valueInput)}
                        </Text>
                      </>
                    ))}
                  </View>
                ))}
              </>
            ))
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
              minHeight:500,
              right: 50,
              left: 50,
              backgroundColor: 'white',
              display: 'flex',
              borderRadius: 10,
              transform: [{scale: Scale}],
              overflow: 'hidden',
          
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
                borderBottomWidth: 2,
                borderBottomColor: 'rgb(245,245,247)',
                alignItems: 'center',
              }}
              onPress={() => {
                if (choosenLaw.length == Object.keys(Content).length) {
                  setCheckedAllFilter(false);
                  setChoosenLaw([]);
                  // console.log('full');
                } else {
                  setChoosenLaw(Object.keys(Content));
                  setCheckedAllFilter(true);
                }
              }}>
              <CheckBox
                onClick={() => {
                  if (choosenLaw.length == Object.keys(Content).length) {
                    setCheckedAllFilter(false);
                    setChoosenLaw([]);
                    // console.log('full');
                  } else {
                    setChoosenLaw(Object.keys(Content));
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
                {Content &&
                  Object.keys(Content).map((key, i) => {
                    let inputSearchLawReg = inputFilter;
                    if (
                      inputFilter.match(
                        /(\w+|\(|\)|\.|\+|\-|\,|\&|\?|\;|\!|\s?)/gim,
                      )
                    ) {
                      if (inputFilter.match(/\(/gim)) {
                        inputSearchLawReg = inputFilter.replace(/\(/gim, '\\(');
                      }

                      if (inputFilter.match(/\)/gim)) {
                        inputSearchLawReg = inputSearchLawReg.replace(
                          /\)/gim,
                          '\\)',
                        );
                      }
                      if (inputFilter.match(/\//gim)) {
                        inputSearchLawReg = inputSearchLawReg.replace(
                          /\//gim,
                          '.',
                        );
                      }
                      if (inputFilter.match(/\\/gim)) {
                        inputSearchLawReg = inputSearchLawReg.replace(
                          /\\/gim,
                          '.',
                        );
                      }
                      if (inputFilter.match(/\./gim)) {
                        inputSearchLawReg = inputSearchLawReg.replace(
                          /\./gim,
                          '\\.',
                        );
                      }
                      if (inputFilter.match(/\+/gim)) {
                        inputSearchLawReg = inputSearchLawReg.replace(
                          /\+/gim,
                          '\\+',
                        );
                      }

                      if (inputFilter.match(/\?/gim)) {
                        inputSearchLawReg = inputSearchLawReg.replace(
                          /\?/gim,
                          '\\?',
                        );
                      }
                    }
                    if (key.match(new RegExp(inputSearchLawReg, 'igm'))) {
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
                                Object.keys(Content).length - 1
                              ) {
                                setCheckedAllFilter(true);
                              }
                            }

                            // if(choosenLaw.length > Object.keys(Content).length){
                            //   setCheckedAllFilter(true)
                            // // setChoosenLaw([])
                            // console.log('full',choosenLaw.length);
                            // }else{
                            //   // setChoosenLaw(Object.keys(Content))
                            //   setCheckedAllFilter(false)
                            //   console.log('none',choosenLaw.length);
                            //   console.log(Object.keys(Content).length);

                            // }
                          }}>
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
                                  Object.keys(Content).length - 1
                                ) {
                                  setCheckedAllFilter(true);
                                }
                              }
                            }}
                            isChecked={choosenLaw.includes(key)}
                            style={{}}
                          />

                          <Text style={{marginLeft: 5, color: 'black'}}>
                            {key}
                          </Text>
                        </TouchableOpacity>
                      );
                    }
                  })}
              </View>
            </ScrollView>
            <TouchableOpacity
              style={{
                backgroundColor: 'green',
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
              }}>
              <Text
                style={{
                  paddingBottom: 10,
                  paddingTop: 10,
                  textAlign: 'center',
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
    // alignItems: 'center',
    justifyContent: 'space-around',
    // backgroundColor:'red'
  },
  inputArea: {
    width: '85%',
    backgroundColor: 'white',
    color: 'black',
    paddingLeft: 12,
    borderRadius: 15,
  },
  inputBtb: {
    width: '15%',
    height: 30,
    backgroundColor: 'black',
    borderRadius: 14,
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
    height: 60,
    justifyContent: 'center',
    backgroundColor: 'orange',
    color: 'black',
    alignItems: 'center',
    marginBottom: 1,
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: 50,
    paddingRight: 50,
  },
  chapterText: {
    textAlign: 'center',
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    // backgroundColor:'red'
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
    paddingBottom: 10,
    paddingTop: 10,
    color: 'white',
    backgroundColor: 'black',
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
