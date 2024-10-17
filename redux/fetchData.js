import { createSlice } from '@reduxjs/toolkit'
import {combineReducers} from 'redux'
import database from '@react-native-firebase/database';
// import {call,put,takeEvery} from 'redux-saga'
import dataOrg from '../data/project2-197c0-default-rtdb-export.json';       ////////////////////////////////////////////// xài tạm
import { call,put,takeEvery,take,takeLatest } from 'redux-saga/effects';
import { Dirs, FileSystem } from 'react-native-file-access';


export const read = createSlice({
  name: 'read',     
  initialState: {
    data:null,
    info:null,
    loading: false
  },
  reducers: {
    
    loader: (state,action) => {
      state.loading= true;
    },

    handle: (state,action) => {
      state.data=action.payload.a;
      state.loading= false;
    },

}
})

export const searchContent = createSlice({
  name: 'searchContent',     
  initialState: {
    data1:dataOrg,
    loading1: false,
    input1:'thuyền',
    result:false
  },
  reducers: {
    loader1: (state,action) => {
      state.loading1= true;
    },

    handle1: (state,action) => {
      state.result=action.payload;
      state.loading1= false;
    },
}
})

export const searchLaw = createSlice({
  name: 'searchLaw',     
  initialState: {
    loading2: false,
    input2:'',
    info:null,
  },
  reducers: {
    loader2: (state,action) => {
      state.loading2= true;
    },

    handle2: (state,action) => {
      state.info=action.payload.b;
      state.loading2= false;
    },
}
})


export const offline = createSlice({    // không càn nữa
  name: 'offline',     
  initialState: {
    loading3: false,
    // info3:null,
    // content3:null,
    info3:dataOrg['LawInfo'],
    content3:dataOrg['LawContent'],
  },
  reducers: {
    loader3: (state,action) => {
      state.loading3= true;

    },

    handle3: (state,action) => {
      state.info3=action.payload.infoObject;
      state.content3=action.payload.contentObject;
      state.loading3= false;
      console.log(123);

    },
}
})



export function* mySaga(state,action){
  try{
    yield put(loader())
    // console.log('state',state.lawName);
    
       const c = yield call( async ()=> await database().ref(`/LawInfo/${state.lawName}`).once('value') )
       const d =   c.val()      

    const b = yield call( async ()=> await database().ref(`/LawContent/${state.lawName}`).once('value') )
    const a =   b.val()      

    yield put(handle({a}))

    
  }catch(e){

  }
}

export function* mySaga1(state,action){
  try{
    yield put(loader1())

    let info = yield  fetch(`https://searchcontentfunction-pshgpplquq-uc.a.run.app?input=${state.input}`,{
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      // body:JSON.stringify({input:state.input})
    })
    let a = yield info.json()

yield put(handle1(a))
  }catch(e){
  }
}

export function* mySaga2(state,action){
  try{
    yield put(loader2())

        let info = yield  fetch(`https://searchlawfunction-pshgpplquq-uc.a.run.app?input=${state.input}`,{
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          // body:JSON.stringify({input:state.input})
        })
      
      
        let b = yield info.json()
        
    // const content = yield call( async ()=> await database().ref(`/LawContent/${lawNumber}`).once('value') )
    // const a =   content.val()

    // const info = yield call( async ()=> await database().ref(`/LawInfo/${lawNumber}`).once('value') )
    // const b =   info.val()


    yield put(handle2({b}))
  }catch(e){
  }
}



export function* mySaga3(state,action){
  try{
    yield put(loader3())
    // console.log('state',state.lawName);
    
    const FileInfoStringContent = yield ( async ()=> await FileSystem.readFile(Dirs.CacheDir+'/Content.txt','utf8'))
    let contentObject = {...JSON.parse(FileInfoStringContent),...dataOrg['LawContent']}
    
    const FileInfoStringInfo = yield ( async ()=> await FileSystem.readFile(Dirs.CacheDir+'/Info.txt','utf8'))
    let infoObject = {...JSON.parse(FileInfoStringInfo),...dataOrg['LawInfo']}
    
    yield put(handle3({contentObject,infoObject}))

    
  }catch(e){

  }
}


export function* saga(){
  yield takeEvery('read',mySaga) 
  // yield takeEvery(handle.type,mySaga)    //xài cái này cũng được

}

export function* saga1(){
  yield takeEvery('searchContent',mySaga1)
  // yield takeEvery(handle1.type,mySaga1)

}

export function* saga2(){
  yield takeEvery('searchLaw',mySaga2)

}

export function* saga3(){
  yield takeEvery('offline',mySaga3)

}

  
export const {loader,handle} = read.actions;
export const {loader1,handle1} = searchContent.actions;
export const {loader2,handle2} = searchLaw.actions;
export const {loader3,handle3} = offline.actions;
