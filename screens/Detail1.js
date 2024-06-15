import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';

import database from '@react-native-firebase/database';
import data from '../data/project2-197c0-default-rtdb-export.json';

import React, {useEffect, useState} from 'react';

export default function Detail({navigation}) {
  const [Content, setContent] = useState({});
  const [SearchResult, setSearchResult] = useState([]); // đây Object là các luật, điểm, khoản có kết quả tìm kiếm 
  const [input, setInput] = useState(undefined);
  const [name, setName] = useState();

  const [nameArray, setNameArray] = useState([]);
  const [article, setArticle] = useState();
  const [articleArray, setArticleArray] = useState([]);
  const [conditional, setConditional] = useState(1);
  const [nameArray1, setNameArray1] = useState([]);

  
  
  const reference = database().ref('/Law1');
  
  useEffect(() => {
    reference.on('value', snapshot => {
      setContent(snapshot.val());
  
    });

  },[]);

  function Search(input) {
    if (conditional == 1) {
      let replace = `(.*)${input}(.*)`;
      let re = new RegExp(replace, 'gmi');
      let chapter = [];

      Object.keys(Content).map((key, i) => {
        if (key.match(re)) {
          chapter.push(key);
        }
      });
      setNameArray1(chapter);
    } else if (conditional == 2) {
      let searchArray = {};

      Object.keys(Content).map((key, i) => {
        // tham nhap luat (array chuong)

        searchArray[key] = [];
        Content[key].map((key1, i1) => {
          // ra Object Chuong

          Object.keys(key1).map((key2, i2) => {
            // thama nhap chuowng (array dieu)

            key1[key2].map((key3, i3) => {
              // chọn từng điều

              Object.keys(key3).map((key4, i4) => {
                let replace = `(.*)${input}(.*)`;
                let re = new RegExp(replace, 'gmi');
                if(key4.match(re)){
                  searchArray[key].push({[key4]: key3[key4]});
                }else if (key3[key4].match(re)) {
                  searchArray[key].push({[key4]: key3[key4]});
                }
              });
            });
          });
        });
      });

      let searchResult = {};

      Object.keys(searchArray).map((key, i) => {
        searchArray[key].map((key1, i) => {
          searchResult[key] = searchArray[key];
        });
      });

      setSearchResult(searchResult);
      // console.log('searchResult',searchResult);
    }
    setArticleArray([]);
    setNameArray([]);
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
      // let replace1 = `((.*\n)*.*)(${word})((.*\n)*.*)`
      // let re1 = new RegExp(replace1, "gm");
      // let s2 = para.replace(re1, "$2");  // khúc đầu
      // let s4 = para.replace(re1, "$4"); //khúc cần
      // let s5 = para.replace(re1, "$5");    // khúc sau

      // return <Text>{s2}<Text style={styles.highlight}>{s4}</Text>{s5}</Text>
      let inputRexgex = para.match(new RegExp(word,'igm'));
      return (
        <Text >
          {para.split(new RegExp(word,'igm')).reduce((prev, current, i) => {
            if (!i) {
              return [current];
            }
           // bị lỗi khi viết hoa và thường khi input
            return (prev.concat(<Text style={styles.highlight}>{inputRexgex[i-1]}</Text>,current))
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

  return (
    <ScrollView style={{backgroundColor: 'green'}}>
      <Text style={styles.titleText}>{`Tìm kiếm văn bản`}</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.inputText}>Tìm kiếm</Text>
        <TextInput
          style={styles.inputArea}
          onChangeText={text => setInput(text)}></TextInput>
        <TouchableOpacity
          style={styles.inputBtb}
          onPress={() => {
            Search(input);
          }}>
          <Text style={styles.inputBtbText}>Go!</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.category}>
        <TouchableOpacity
          style={
            conditional == 1 ? styles.ContainerChecked : styles.checkContainer
          }
          onPress={() => {
            {
              setConditional(1);
            }
          }}>
          <Text style={styles.checkConent}>Tìm tên</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={
            conditional == 2 ? styles.ContainerChecked : styles.checkContainer
          }
          onPress={() => {
            {
              setConditional(2);
            }
          }}>
          <Text style={styles.checkConent}>Tìm Content</Text>
        </TouchableOpacity>
      </View>
      <View style={{marginTop: 8}}>
        {conditional == 1 &&
          nameArray1.map((key, i) => (
            <TouchableOpacity
              style={styles.chapter}
              key={i}
              onPress={() => navigation.navigate(`${key}`)}>
              <Text style={styles.chapterText}>{key}</Text>
            </TouchableOpacity>
          ))}
        {conditional == 2 &&
          Object.keys(SearchResult).map((key, i) => (
            <>
              <TouchableOpacity
                key={i}
                style={styles.chapter}
                onPress={() => {
                  setName(i)
                }}
            
                  >
                <Text style={styles.chapterText} key={`${i}a`}>
                  {key} có {0 || SearchResult[key].length} kết quả
                </Text>
                <TouchableOpacity
              onPress={() => navigation.navigate(`${key}`,{input:input})}
              style={styles.chapterArrow}
              >
              <Text
              style={{fontWeight:'bold',color:'white', textAlign:'center',fontSize:17}}
              
              
              >
                  {'->'}
                  </Text>
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
                          { highlight(key2, input)}
                        </Text>
                      </TouchableOpacity>
                      <Text
                        style={
                          articleArray.includes(`${i}${i1}a${i2}c`)
                            ? styles.blackBackground
                            : styles.content
                        }
                        key={`${i2}d`}>
                        {
                          highlight(key1[key2], input)
                        }
                      </Text>
                    </>
                  ))}
                </View>
              ))}
            </>
          ))}
      </View>
    </ScrollView>
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
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  inputText: {
    width: '15%',
    fontSize: 12,
    color: 'white',
  },
  inputArea: {
    width: '60%',
    backgroundColor: 'white',
    color:'black'
  },
  inputBtb: {
    width: '15%',
    height: 30,
    backgroundColor: 'blue',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputBtbText: {
    color: 'white',
    fontWeight: 'bold',
  },
  content: {
    height: 0,
    display: 'flex',
    position: 'relative',
    padding: 0,
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
    display:'flex',
    flexDirection:'row',
  },
  chapterText: {
    textAlign: 'center',
    color: 'yellow',
    fontSize: 15,
    fontWeight: 'bold',
    backgroundColor:'red'
  },
  chapterArrow:{
    backgroundColor:'blue',
    borderRadius:25,
    // alignItems:'flex-end',
    display:'flex',
    right:10,
    position:'absolute',
    width:30,
    height:30,
    textAlign:'center',
    justifyContent:'center'
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
  },
  article: {
    color: 'white',
    overflow: 'hidden',
  },
  lines: {
    color: 'white',
  },
  category: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  checkContainer: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: 'blue',
    borderRadius: 20,
    marginRight: 10,
    marginLeft: 10,
  },
  ContainerChecked: {
    backgroundColor: 'red',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 20,
    marginRight: 10,
    marginLeft: 10,
  },
  blackBackground: {
    backgroundColor: 'white',
    color: 'black',
    flexWrap: 'wrap',
    // width:200,
    overflow: 'hidden',
    flex: 1,
    display: 'flex',
  },
  checkConent: {
    fontWeight: 'bold',
    color: 'yellow',
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
