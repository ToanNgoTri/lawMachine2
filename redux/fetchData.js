import { createSlice } from '@reduxjs/toolkit'
import {combineReducers} from 'redux'
import database from '@react-native-firebase/database';
// import {call,put,takeEvery} from 'redux-saga'
import dataOrg from '../data/project2-197c0-default-rtdb-export.json';       ////////////////////////////////////////////// xài tạm
import { call,put,takeEvery,take,takeLatest } from 'redux-saga/effects';


export const read = createSlice({
  name: 'read',     
  initialState: {
    data:null,
    loading: true
  },
  reducers: {
    
    loader: (state,action) => {
      // state.data=action.payload;
      state.loading= true;
      // console.log('state.loading',state.loading);
    },

    handle: (state,action) => {
      state.data=action.payload;
      // console.log('12345');
    },
    noLoading: (state,action) => {
      state.loading= false;
      // console.log('12345');
    },

}
})



export const search = createSlice({
  name: 'search',     
  initialState: {
    data1:dataOrg,
    loading1: true,
    input1:'thuyền',
    result:null
  },
  reducers: {

    // setData1(state,action) {
    //   // state.data1=action.payload;
    //   state.loading1= true;
    // },



    // type1(state,action) {
    //   // state.input1=action.payload;
    //   // console.log(state.data1);
    //   state.loading1= true;
    //   console.log('state.loading1');
    // },








    loader1: (state,action) => {
      // state.data1=action.payload;
      state.loading1= true;
// state= {...state,'loading1':true}
      // console.log('state.loading1',state.loading1);
    },

    handle1: (state,action) => {
      state.result=action.payload;
      state.loading1= false;
      // state= {...state,'loading1':false}
      // console.log('state.loading1',state.loading1);
    },
}
})



    async function search1 (input1,data1) {
      let searchArray = {};

      function a(key, key1) {
        Object.values(key1)[0].map((key2, i1) => {
          // chọn từng điều

          // Object.keys(key2).map((key5, i5) => {
          let replace = `(.*)${input1}(.*)`;
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

      Object.keys(data1).map((key, i) => {
        //key là tên của luật
        // tham nhap luat (array chuong)

        searchArray[key] = [];
          data1[key].map((key1, i1) => {
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

                });

              } else {
                a(key, key1);
              }
            } else {
              // nếu không có phần thứ...
              a(key, key1);
            }
          });
      });

      return  searchArray
       

    }





export function* mySaga(action){
  try{
    yield put(loader())
    const b = yield call( async ()=> await database().ref('/').once('value') )
    const a =   b.val()      
 

    yield put(handle(a))

    yield put(noLoading())
    noLoading
  }catch(e){

  }
}

export function* mySaga1(state,action){
  try{
    // yield put(setData1())

    // yield put(type1())
    yield put(loader1())

    const b = yield call(search1,'tốt nhất',dataOrg)
    let a = b

    

    yield put(handle1(a))
  }catch(e){

  }
}


export function* saga(){
  yield takeEvery('run',mySaga) 
  // yield takeEvery(handle.type,mySaga)    //xài cái này cũng được

}

export function* saga1(){
  yield takeEvery('search',mySaga1)
  // yield takeEvery(handle1.type,mySaga1)

}

  
export const {loader,handle,noLoading} = read.actions;
export const {loader1,handle1} = search.actions;
