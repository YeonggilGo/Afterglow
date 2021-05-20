import types from './types'

export function login(userData){
  return {
    type: types.LOGIN,
    payload: userData
  };
}

export function logout() {
  return {
    type: types.LOGOUT,
  }
}

export function getRecordList(recordList) {
  return {
    type: types.GET_RECORD_LIST,
    payload: recordList
  }
}

export function changeStatus(status){
  return {
    type: types.CHANGE_STATUS,
    payload: status
  }
}

export function setTravelName(data) {
  return {
    type: types.SET_TRAVEL_NAME,
    payload: data
  }
}



export function startDay(todayInfo) {
  return {
    type: types.START_DAY,
    payload: todayInfo
  }
}

export function endDay(todayInfo) {
  return {
    type: types.END_DAY,
    payload: todayInfo
  }
}

export function selectIndex(index) {
  return {
    type: types.SELECT_INDEX,
    payload: index
  }
}

// export function sendLocationInfo(data) {
//   return {
//     type: types.SEND_LOCATION,
//     payload: data
//   }
// }

// export function setRouteName(name) {
//   return {
//     type: types.SET_ROUTE_NAME,
//     payload: name
//   }
// }

export function saveVisitPlace(placeItem) {
  return {
    type: types.SAVE_VISIT_PLACE,
    payload: placeItem
  }
}

export function updateMemo(memoItem) {
  return {
    type: types.UPDATE_MEMO,
    payload: memoItem
  }
}


export function addMoneyItem(data) {
  return {
    type: types.ADD_MONEY_ITEM,
    payload: data
  }
}

export function deleteMoneyItem(data) {
  return {
    type: types.DELETE_MONEY_ITEM,
    payload: data
  }
}


export function selectPin(data) {
  return {
    type: types.SELECT_PIN,
    payload: data
  }
}


export function getRecoPlace(data) {
  return {
    type: types.GET_RECO_PLACE,
    payload: data
  }
}


export function changePlaceName(data) {
  return {
    type: types.CHANGE_PLACE_NAME,
    payload: data
  }
}

