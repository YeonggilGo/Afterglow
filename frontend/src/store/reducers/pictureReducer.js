import types from '../actions/types'

const initialState = {
  mode: 'look',
  pictures : [],
  singlePicture : {},
  totalCount : 0,
};

export default (state = initialState, action) => {

  switch ( action.type ) {
    case types.INITIAL_PICTURE:
      return initialState
    case types.EMPTY_LIST:
      return {
        ...state,
        pictures : [],
      }
    case types.SELECT_PICTURE:
      return {
        ...state,
        pictures: [ ...state.pictures, action.payload ]
      }
    case types.UNSELECT_PICTURE:
      return {
        ...state,
        pictures: state.pictures.filter((item) => item.id != action.payload)
      }
    case types.MODE_PICTURE:
      return {
        ...state,
        mode: action.payload
      }
    case types.SAVE_PICTURES:
      return {
        ...state,
        pictures: [],
        totalCount: 0,
      }
    case types.SEND_TOTAL_PICTURES:
      return {
        ...state,
        totalCount: action.payload
      }
    default:
      return state;
  }
}