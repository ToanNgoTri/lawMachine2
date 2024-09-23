import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { handle2 } from "../redux/fetchData";
import database from '@react-native-firebase/database';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';

import React, {useEffect, useState, useRef, useContext} from 'react';

import {RefForSearch} from '../App';
import {dataLaw} from '../App';
import {RefLoading} from '../App';

export function Detail2({navigation}) {

  const [SearchResult, setSearchResult] = useState([]); // đây Object là các luật, điểm, khoản có kết quả tìm kiếm
  const [input, setInput] = useState(undefined);
  const [valueInput, setValueInput] = useState('');
  const [valueInputForNav, setValueInputForNav] = useState('');


  const dataLawContent = useContext(dataLaw);


  const [warning, setWanring] = useState(false);
  const list = useRef(null);

  
  
  const dispatch = useDispatch()
  const {loading2, content,info,input2} = useSelector(state => state['searchLaw']);
  // console.log('content',content);
  // console.log('info',info);
  // console.log('input2',input2);

  useEffect(() => {

  }, [dataLawContent.dataLawForApp]);



  const SearchScrollview = useContext(RefForSearch);

  SearchScrollview.updateSearch(list);

  // function Search(input) {
  //   let searchArray = {};

  //   if (input) {
  //     if (input.match(/(\w+|\(|\)|\.|\+|\-|\,|\&|\?|\;|\!|\/)/gim)) {

  //       function a(key, key1) {
  //         // key ở đây là tên luật, key1 là Object 1 chương

  //         Object.values(key1)[0].map((key2, i1) => {
  //           // chọn từng điều

  //           let replace = `(.*)${input}(.*)`;
  //           let re = new RegExp(replace, 'gmi');
  //           let article = Object.keys(key2)[0].replace(/(?<=\w*)\\(?=\w*)/gim, '/')
  //           let point = Object.values(key2)[0].replace(/(?<=\w*)\\(?=\w*)/gim, '/')

  //           if (Object.keys(key2)[0].match(re)) {
  //             searchArray[key].push({
  //               [article]: point,
  //             });
  //           } else if (point != '') {
  //             if (point.match(re)) {
  //               searchArray[key].push({
  //                 [article]: point,
  //               });
  //             }
  //           }
  //         });

          
  //       }

  //       Object.keys(dataLawContent.dataLawForApp['LawContent']).map(
  //         (key, i) => {
  //           // key là tên luật
  //           //key là tên của luật
  //           // tham nhap luat (array chuong)

  //           searchArray[key] = [];
  //           if (choosenLaw.includes(key)) {
  //             dataLawContent.dataLawForApp['LawContent'][key].map(
  //               (key1, i1) => {
  //                 // ra Object Chuong hoặc (array phần thứ...)
  //                 if (Object.keys(key1)[0].match(/^phần thứ .*/gim)) {
  //                   // nếu có 'phần thứ
  //                   // console.log('phần thứ');
  //                   // console.log('Object.keys(key1)[0]',Object.keys(key1)[0]);
  //                   if (
  //                     Object.keys(Object.values(key1)[0][0])[0].match(
  //                       /^Chương .*/gim,
  //                     )
  //                   ) {
  //                     //nếu có chương trong phần thứ

  //                     Object.values(key1)[0].map((key2, i) => {
  //                       a(key, key2);
  //                     });
  //                   } else {
  //                     //nếu không có chương trong phần thứ
  //                     a(key, key1);
  //                   }
  //                 } else if (Object.keys(key1)[0].match(/^chương .*/gim)) {
  //                   a(key, key1);
  //                 } else {
  //                   //nếu chỉ có điều
  //                   if(i1==0){ //  đảm bảo chỉ chạy 1 lần
  //                     a(key, {
  //                       'chương Giả định':
  //                         dataLawContent.dataLawForApp['LawContent'][key],
  //                     });
  
  //                   }
  //                 }
  //               },
  //             );
  //           }
  //         },
  //       );

  //       let searchResult = {};

  //       Object.keys(searchArray).map((key, i) => {
  //         searchArray[key].map((key1, i) => {
  //           searchResult[key] = searchArray[key];
  //         });
  //       });

  //       setSearchResult(searchResult);
  //       // console.log('searchResult',searchResult);
  //       searchResult = [];
  //     } else {
  //       setWanring(true);
  //     }
  //   } else {
  //     setWanring(true);
  //   }
  // }


  useEffect(() => {
    setWanring(false);
  }, [input]);



  return (
    <>
      {loading2 && (
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
          <ActivityIndicator size="large" color="white"></ActivityIndicator>
        </View>
      )}

      <ScrollView
        keyboardShouldPersistTaps="handled"
        ref={list}
        style={{backgroundColor: '#EEEFE4'}}>
        <View style={{backgroundColor: 'green'}}>
          <Text style={styles.titleText}>{`Tìm kiếm văn bản`}</Text>

          <View style={styles.inputContainer}>

            <View
              style={{
                flexDirection: 'column',
                width: '75%',
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
                  style={styles.inputArea}
                  onChangeText={text => {
                    setInput(text);
                  }}
                  value={input}
                  selectTextOnFocus={true}
                  placeholder="Nhập từ tên luật, trích dẫn, ..."></TextInput>
                <TouchableOpacity
                  onPress={() => setInput('')}
                  style={{
                    width: '15%',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    left: -3,
                  }}>
                  {input && (
                    <Ionicons
                      name="close-circle-outline"
                      style={{
                        color: 'black',
                        fontSize: 20,
                        paddingRight: 8,
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
                onPress={() => {
                  Keyboard.dismiss();
                  let inputSearchLawReg = input;
                  if (input) {

                    inputSearchLawReg = input.replace(/\(/gim, '\\(');


                    inputSearchLawReg = inputSearchLawReg.replace(
                        /\)/gim,
                        '\\)',
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

                      if (input.match(/\//gim)) {
                      inputSearchLawReg = inputSearchLawReg.replace(/\//gim, '.');
                    }

                    inputSearchLawReg = inputSearchLawReg.replace(
                        /\\/gim,
                        '.',
                      );

                    }
                  Keyboard.dismiss();
                  setValueInput(inputSearchLawReg);
                  setValueInputForNav(input);
                  // Search(inputSearchLawReg);
                  dispatch({type:'searchLaw',input:input})
                }}>
                <Ionicons
                  name="search-outline"
                  style={styles.inputBtbText}></Ionicons>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{marginTop: 1}}>
          {Array.isArray(SearchResult) ? null : !Object.keys(SearchResult)
              .length ? (
            <NoneOfResutl />
          ) : (
            Object.keys(SearchResult).map((key, i) => {
              let nameLaw =
                dataLawContent.dataLawForApp['LawInfo'][key]['lawNameDisplay'];
              if (nameLaw) {
                if (nameLaw.match(/(?<=\w)\\(?=\w)/gim)) {
                  nameLaw = key.replace(/(?<=\w)\\(?=\w)/gim, '/');
                }
              }

              return (
                <>
                  <TouchableOpacity
                    key={i}
                    style={{
                      paddingBottom:10,
                      paddingTop:10,
                      justifyContent:'center',
                      backgroundColor: '#F9CC76',
                      marginBottom:1
                                  }}
                    onPress={() => {
                    }}>
                      <View
                                          style={styles.chapter}
>

                    <Text style={styles.chapterText} key={`${i}a`}>
                      {nameLaw}
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
                        </View>
                  </TouchableOpacity>
                </>
              );
            })
          )}
        </View>
      </ScrollView>

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
    justifyContent: 'space-evenly',
    // backgroundColor:'red'
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
    // backgroundColor:'yellow',
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
    minHeight:50,
    justifyContent: 'space-around',
    backgroundColor: '#F9CC76',
    color: 'black',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  chapterText: {
    textAlign: 'center',
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    // backgroundColor:'red',
    width:'75%'
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
