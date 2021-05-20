import { createInstance } from "./index.js"

const instance = createInstance()

function upload( data ) {

  instance.defaults.headers["Content-Type"] = "multipart/form-data"

  return instance.post(`records/save/image?rr_id=${data.rr_id}&width=${data.width}&height=${data.height}`, data.picture)

}

function getRoutePicture(rr_id, success, fail) {
  console.log("라우트 아이디",rr_id)
  return instance.get(`records/picture?rr_id=${rr_id}`).then(success).catch(fail)

}

function getDayPicture(dr_id, success, fail) {

  console.log("데이아이디",dr_id)
  return instance.get(`records/daily/picture?drId=${dr_id}`).then(success).catch(fail)

}

function getRecordPicture(rec_id, success, fail) {

  console.log("레코드아이디",rec_id)
  return instance.get(`records/trip/picture?rec_id=${rec_id}`).then(success).catch(fail)

}

export { upload, getRoutePicture, getDayPicture, getRecordPicture }

