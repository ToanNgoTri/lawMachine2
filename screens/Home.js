import {
    Text,StyleSheet,TouchableOpacity,View,ScrollView
  } from 'react-native';
import database from '@react-native-firebase/database';
import { useState, useEffect } from 'react';
import data from '../data/project2-197c0-default-rtdb-export.json'


  export default function Home({ navigation }) {  
      const [Content,setContent] = useState('');
      // sử dụng để đọc realtime database, data được xuất ra ở dưới dạng object rồi không cần JSON.parse
      // console.log('API',API);
      
      const reference = database().ref('/Law1');
      useEffect( ()=>{
          
        reference.on('value', snapshot => {
            // console.log(snapshot.val());
          setContent(snapshot.val())
        });

    }
    ,[])
      
    
    return(
      <ScrollView>
<TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <View style={styles.item}>
                <Text style={styles.text}>
                Tìm kiếm
                </Text>
            </View>
        </TouchableOpacity>
{Content && (Object.keys(Content).map( (key,i) => (

<TouchableOpacity key={i} onPress={() => navigation.navigate(`${key}`)}>
            <View style={styles.item}>
                <Text style={styles.text}>
                {key}
                </Text>
            </View>
        </TouchableOpacity>

))
)
  }






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
      </ScrollView>
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
    }
  });
  