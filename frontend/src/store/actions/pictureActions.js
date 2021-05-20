import types from './types'

export function initialPicture() {
  return {
    type: types.INITIAL_PICTURE
  }
}

export function emptyList() {
  return {
    type: types.EMPTY_LIST
  }
}

export function selectPicture(picture){
    return {
      type: types.SELECT_PICTURE,
      payload: picture
    };
  }

export function unselectPicture(picture_id) {
  return {
    type: types.UNSELECT_PICTURE,
    payload: picture_id
  }
}

export function modePicture(mode) {
  return {
    type: types.MODE_PICTURE,
    payload: mode
  }
}

export function savePictures() {
  return {
    type: types.SAVE_PICTURES
  }
}

export function sendTotalPictures(count) {
  return {
    type: types.SEND_TOTAL_PICTURES,
    payload: count
  }
}