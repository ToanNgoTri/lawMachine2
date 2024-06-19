import {
    Text,StyleSheet,TouchableOpacity,View,ScrollView,TextInput,FlatList,ActivityIndicator
  } from 'react-native';
import database from '@react-native-firebase/database';
import { useState, useEffect } from 'react';
import data from '../data/project2-197c0-default-rtdb-export.json'


  export default function Home({ navigation }) {  
      const [Content,setContent] = useState('');
      // sử dụng để đọc realtime database, data được xuất ra ở dưới dạng object rồi không cần JSON.parse
      // console.log('API',API);
      const [showContent,setShowContent] = useState([]);

      const [inputSearchLaw,setInputSearchLaw] = useState('');
      const [searchLawResult,setSearchLawResult] = useState([]);
      const [currentPaper,setCurrentPaper] = useState(0);
      const [totalPaper,setTotalPaper] = useState(2);

      const reference = database().ref('/Law1');

    const Render = ({item})=>{
        return(
            <TouchableOpacity onPress={() => navigation.navigate(`${item}`)}>
            <View style={styles.item}>
                <Text style={styles.text}>
                {item}
                </Text>
            </View>
        </TouchableOpacity>
        )
    }

    const renderLoader = ()=>{
        return(
            <View>
                <ActivityIndicator size='large' color='#aaa'/>
            </View>
        )
    }
    

      useEffect( ()=>{
        setSearchLawResult(Content && Content.filter( (item)=>{
            return item.match(new RegExp(inputSearchLaw, 'igm'));
        }))
    }
    ,[inputSearchLaw])
    

    //   let totalPaper
    useEffect( ()=>{
        reference.on('value', snapshot => {
            // console.log(snapshot.val());
          setContent(Object.keys(snapshot.val()))
          setShowContent(Object.keys(snapshot.val()).slice(0,7))
        //   console.log(Object.keys(snapshot.val()).length)
        //   totalPaper= Object.keys(snapshot.val()).length
        setTotalPaper(Math.floor(Object.keys(snapshot.val()).length/7)+1)

        });

    }
    ,[])
    // totalPaper =Math.floor(Content.length/7)+1
    // console.log(totalPaper);
    
    const loadMoreItem = ()=>{
        // console.log('totalPaper',totalPaper);
        if(currentPaper<totalPaper){            // bị lỗi: tuy totalPaper đã dc thêm mới nhưng trong if() vẫn false
            setCurrentPaper(currentPaper+1)
        }
        setShowContent(Content.slice(0,7*currentPaper));
        // console.log('currentPaper',currentPaper);
    }


    return(
        <>

            <View
              style={{
                flexDirection: 'row',
                // backgroundColor: 'black',
                height: 50,
              }}>
              <TextInput
                onChangeText={text => setInputSearchLaw(text)}
                value={inputSearchLaw}
                style={styles.inputSearchArea}
                placeholder="Search Law ..."
                placeholderTextColor={'gray'}>
                </TextInput>
              <TouchableOpacity
                onPress={() => setInputSearchLaw('')}
                style={{width: '10%', display: 'flex',alignItems: 'center',justifyContent: 'center',
                }}>
                {inputSearchLaw && (
                  <Text
                    style={styles.inputXIcon}>
                    X
                  </Text>
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
  data={showContent && (searchLawResult || showContent)}
  renderItem={Render}
  ListFooterComponent={(totalPaper > currentPaper) && renderLoader} //(totalPaper > currentPaper) && 
  onEndReached={ loadMoreItem}
  >

    
  </FlatList>






        {/* <TouchableOpacity onPress={() => navigation.navigate('Luật Cư Trú 2020')}>
            <View style={styles.item}>
                <Text style={styles.text}>
                    Luật Cư trú 2020
                </Text>
            </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Luật Tín ngưỡng, tôn giáo 2016')}>
            <View style={styles.item}>
                <Text style={styles.text}>
                    Luật Tín ngưỡng, tôn giáo 2016
                </Text>
            </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Luật Viễn Thông 2023')}>
            <View style={styles.item}>
                <Text style={styles.text}>
                Luật Viễn thông 2023
                </Text>
            </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('FireBase')}>
            <View style={styles.item}>
                <Text style={styles.text}>
                FireBase Test
                </Text>
            </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('addFirebase')}>
            <View style={styles.item}>
                <Text style={styles.text}>
                addFirebase
                </Text>
            </View>
        </TouchableOpacity> */}
      
      </>
    )
  }
  
  const styles = StyleSheet.create({
    item: {
        height:100,
        backgroundColor:'green',
        display:'flex',
        justifyContent: 'center',
        marginBottom:6
    },
    text:{
        fontWeight:'bold',
        color:'white',
        textAlign:'center',
    },
    inputSearchArea:{
        paddingLeft: 10,
        paddingRight: 10,
        color: 'black',
        width: '90%',
        alignItems: 'center',
    },
    inputXIcon:{
        height: 20,
        width: 20,
        color: 'white',
        textAlign: 'center',
        verticalAlign: 'middle',
        backgroundColor: 'gray',
        borderRadius: 25,
    }
  });
  