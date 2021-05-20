import { takeLatest, put, call } from 'redux-saga/effects';
import { upload } from '../../api/picture'


import ImageResizer from 'react-native-image-resizer';


export function* savePictureAsync(action) {
  try {

    for ( var picture of action.payload) {

      var newuri = ''
      yield ImageResizer.createResizedImage(picture.uri, picture.imageSize.width/2, picture.imageSize.height/2, 'JPEG', 80, 0, undefined )
        .then((res) => {
          newuri = res.uri
        })
        .catch( (err) => {
          console.log(err)
        })

      const form = new FormData()
      const name = picture.filename;
      const [, type] = name.split(".");
      form.append('file',{
        name,
        type: picture.type, 
        uri: newuri
      })
      const sendData= {
        "rr_id" : picture.rr_id,
        "width" : picture.imageSize.width/2,
        "height": picture.imageSize.height/2,
        picture : form
      }
      const { status,data } = yield call(upload, sendData)
      console.log("사진 저장 응답", status)
    }
  } catch (error) {
    console.log("사진 저장 에러", error)
  }
}

export const pictureSagas = [
  takeLatest('SAVE_PICTURE_ASYNC', savePictureAsync),
]