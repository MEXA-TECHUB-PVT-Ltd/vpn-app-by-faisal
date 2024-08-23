import songs from '../assets/songs';
import {appImages} from '../assets/utilities';
import {
  SET_FROM_CATEGORY,
  SET_IS_PLAYING,
  CUSTOM_STOP,
  CHANGE_THEME_MODAL,
  SOLID,
  SECOND,
  FIRST,
  DOUBLE,
  SOLIDDARK,
  SECONDDARK,
  FIRSTDARK,
  DOUBLEDARK,
  DARKMODETEXT,
  ISDARKMODE,

  //
  MUSIC,
} from './actions';

const initialState = {
  isplaying: false,
  fromcategory: false,
  customstopstate: false,
  changethememodal: false,
  first: '#E60F4E',
  second: '#CA6FE4',
  solid: '#EC1D94',
  double: ['#E60F4E', '#CA6FE4'],
  firstdark: '#0A0A0A',
  seconddark: '#303030',
  soliddark: '#1C1C1C',
  doubledark: ['#0A0A0A', '#303030'],
  darkmodetext: '#fff',
  isdarkmode: false,
  musicList: [],
  // musicList: songs,
};

function userReducer(state = initialState, action) {
  switch (action.type) {
    case SET_FROM_CATEGORY:
      return {...state, fromcategory: action.payload};
    case SET_IS_PLAYING:
      return {...state, isplaying: action.payload};
    case CUSTOM_STOP:
      return {...state, customstopstate: action.payload};
    case FIRST:
      return {...state, first: action.payload};
    case SECOND:
      return {...state, second: action.payload};
    case DOUBLE:
      return {...state, double: action.payload};
    case SOLID:
      return {...state, solid: action.payload};
    case FIRSTDARK:
      return {...state, firstdark: action.payload};
    case SECONDDARK:
      return {...state, seconddark: action.payload};
    case DOUBLEDARK:
      return {...state, doubledark: action.payload};
    case SOLIDDARK:
      return {...state, soliddark: action.payload};
    case DARKMODETEXT:
      return {...state, darkmodetext: action.payload};
    case ISDARKMODE:
      return {...state, isdarkmode: action.payload};
    case MUSIC:
      return {...state, musicList: action.payload};
    default:
      return state;
  }
}

export default userReducer;
