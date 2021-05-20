import ActionCreator from '../actions'

import { takeLatest, put, call } from 'redux-saga/effects';
import { login, startTrip, getRecordList, changeStatus, getTripInfo, startDay, endDay, 
          getCurrentInfo, sendLocationInfo, saveMemo, addConsumption, deleteConsumption,
          getRecoPlace, changePlaceName } from '../../api/account'

import CookieManager from '@react-native-cookies/cookies'

export function* loginAsync() {
  try {
    const { status, data } = yield call(login)
    console.log("로그인응답", status)
    // console.log("로그인데이터", data)
    yield put(ActionCreator.login(data))

  } catch (error) {
    console.log(error)
  }
}

export function* getRecordListAsync() {
  try {
    const res = yield call(getRecordList)
    console.log("여행리스트응답코드", res.status)
    // console.log("여행리스트데이터",res.data)
    if ( res.status === "201" ) {
      CookieManager.clearByName('http://k4a105.p.ssafy.io:8080', 'access_token')
        .then( (success) => {
          console.log("access-token 지우기", success)
          CookieManager.set('http://k4a105.p.ssafy.io:8080', {
            name: 'access_token',
            value: res.config.headers.Cookies.access_token.value,
          }).then( (success) => {
            console.log("access-token 갱신", success)
          }) 
        })
    }


    yield put(ActionCreator.getRecordList(res.data))

  } catch (error) {
    console.log("토큰",error)
  }
}

export function* startTravelAsync(action) {
  try {

    const { status, data } = yield call(startTrip, action.payload)

    console.log("여행시작 응답", status)
    console.log("여행시작 데이터", data)

    yield put(ActionCreator.setTravelName(data))

  } catch (error) {
    console.log(error)
  }
}

export function* changeStatusAsync(action) {
  try {
    const { status,data } = yield call(changeStatus, action.payload)

    yield put(ActionCreator.changeStatus(action.payload))
  } catch (error) {
    console.log(error)
  }
}

export function* endDayAsync(action) {
  try{
    const { status, data } = yield call(endDay, action.payload) 
    console.log( "하루가 끝나고 ",  status )
    // console.log("하루가 끝나는", data)

    yield put(ActionCreator.endDay(data))

  } catch (error) {
    console.log("하루가 끝나는", error)
  }
}

export function* startDayAsync(action) {
  try{
    const { status, data } = yield call(startDay, action.payload) 
    console.log( "하루가 시작 ",  status)
    console.log( "하루가 시작 ",  data)

    yield put(ActionCreator.startDay(data))

  } catch (error) {
    console.log("하루가 시작하는", error)
  }
}

export function* getCurrentInfoAsync(action) {
  try{
    const { status, data } = yield call(getCurrentInfo, action.payload) 
    console.log("현재 여행 상태", status)
    // console.log( "getCurrentInfoAsync의 여행중 현재 상태\n",  status, JSON.stringify(data, null, 2) )
    yield put(ActionCreator.startDay(data))

  } catch (error) {
    console.log("getCurrentInfoAsync의 여행중 현재 상태", error)
  }
}

export function* sendLocationInfoAsync(action) {
  try{
    const { status, data } = yield call(sendLocationInfo, action.payload) 
    console.log("======================================================================================")
    console.log("send data", action.payload)
    console.log( "위치 성공",  status,data)
    // console.log( "위치 성공",   data )
    if (data.rr !== null || data.place !== undefined) {       // data.isUserMoving (만약 이동중이면 추가) 그런데 지금 이부분 에러있는것 같아서 안넣었음
      console.log("추가 또는 이름 갱신")
      const { status, data } = yield call(getCurrentInfo, action.payload.dr_id) 
      console.log("추가 또는 이름 갱신 후 현재 상태 갱신", status)
      yield put(ActionCreator.startDay(data))
    }

  } catch (error) {
    console.log("위치 에러", error)
  }
}

export function* saveMemoAsync(action) {
  try{
    const { status, data } = yield call( saveMemo, action.payload ) 
    console.log("메모저장성공",  status )
    console.log("메모저장성공",  data )

    yield put(ActionCreator.updateMemo(data))

  } catch (error) {
    console.log("메모저장에러", error)
  }
}

export function* addMoneyAsync(action) {
  try{
    const { status, data } = yield call( addConsumption, action.payload ) 
    console.log("가계부저장성공",  status,  JSON.stringify(data, null, 2) )

    yield put(ActionCreator.addMoneyItem(data))

  } catch (error) {
    console.log("가계부저장 에러", error)
  }
}

export function* deleteMoneyAsync(action) {
  try{
    console.log("action.payload",action.payload )
    const { status, data } = yield call( deleteConsumption, action.payload ) 
    console.log("가계부삭ㅈ[ㅔ성공",  status, JSON.stringify(data, null, 2) )

    yield put(ActionCreator.deleteMoneyItem(data))

  } catch (error) {
    console.log("가계부삭ㅈ[ㅔ 에러", error)
  }
}


export function* getRecoPlaceAsync(action) {
  try{
    console.log("payload", action.payload)
    const { status, data } = yield call( getRecoPlace, action.payload ) 
    console.log("추천여행지 받아오기 성공 saga에서찍음",  status,  JSON.stringify(data, null, 2) )
    yield put(ActionCreator.getRecoPlace(data))
  } catch (error) {
    console.log("추천여행지 받아오기 실패", error)
  }
}


export function* changePlaceNameAsync(action) {
  try{
    const { status, data } = yield call( changePlaceName, action.payload ) 
    console.log("[saga에서찍음] 바뀐 장소 이름 ",  status,  data )
    yield put(ActionCreator.changePlaceName(data))
  } catch (error) {
    console.log("[saga에서찍음] 장소 이름바꾸기 실패", error)
  }
}


export const accountSagas = [
  takeLatest('LOGIN_ASYNC', loginAsync),
  takeLatest('GET_RECORD_LIST_ASYNC', getRecordListAsync),
  takeLatest('SET_TRAVEL_NAME_ASYNC', startTravelAsync),
  takeLatest('CHANGE_STATUS_ASYNC', changeStatusAsync),
  takeLatest('END_DAY_ASYNC', endDayAsync),
  takeLatest('START_DAY_ASYNC', startDayAsync),
  takeLatest('GET_CURRENT_INFO_ASYNC', getCurrentInfoAsync),
  takeLatest('SEND_LOCATION_INFO_ASYNC', sendLocationInfoAsync),
  takeLatest('SAVE_MEMO_ASYNC', saveMemoAsync),
  takeLatest('ADD_MONEY_ASYNC', addMoneyAsync),
  takeLatest('DELETE_MONEY_ASYNC', deleteMoneyAsync),
  takeLatest('GET_RECO_PLACE_ASYNC', getRecoPlaceAsync),
  takeLatest('CHANGE_PLACE_NAME_ASYNC', changePlaceNameAsync),
]