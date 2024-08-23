export const SET_IS_PLAYING = 'SET_IS_PLAYING';
export const SET_FROM_CATEGORY = 'SET_FROM_CATEGORY';
export const CUSTOM_STOP = 'CUSTOM_STOP';
export const CHANGE_THEME_MODAL = 'CHANGE_THEME_MODAL';
export const FIRST = 'FIRST';
export const SECOND = 'SECOND';
export const DOUBLE = 'DOUBLE';
export const SOLID = 'SOLID';
export const FIRSTDARK = 'FIRSTDARK';
export const SECONDDARK = 'SECONDDARK';
export const DOUBLEDARK = 'DOUBLEDARK';
export const SOLIDDARK = 'SOLIDDARK';
export const DARKMODETEXT = 'DARKMODETEXT';
export const ISDARKMODE = 'ISDARKMODE';

export const MUSIC = 'MUSIC';

export const setIsplaying = isplaying => dispatch => {
  dispatch({
    type: SET_IS_PLAYING,
    payload: isplaying,
  });
};
export const setFromcategory = fromcategory => dispatch => {
  dispatch({
    type: SET_FROM_CATEGORY,
    payload: fromcategory,
  });
};

export const setCustomstopstate = customstopstate => dispatch => {
  dispatch({
    type: CUSTOM_STOP,
    payload: customstopstate,
  });
};

export const setFirst = first => dispatch => {
  dispatch({
    type: FIRST,
    payload: first,
  });
};

export const setSecond = second => dispatch => {
  dispatch({
    type: SECOND,
    payload: second,
  });
};
export const setDouble = double => dispatch => {
  dispatch({
    type: DOUBLE,
    payload: double,
  });
};
export const setSolid = solid => dispatch => {
  dispatch({
    type: SOLID,
    payload: solid,
  });
};

export const setFirstDark = firstdark => dispatch => {
  dispatch({
    type: FIRSTDARK,
    payload: firstdark,
  });
};

export const setSecondDark = seconddark => dispatch => {
  dispatch({
    type: SECONDDARK,
    payload: seconddark,
  });
};
export const setDoubleDark = doubledark => dispatch => {
  dispatch({
    type: DOUBLEDARK,
    payload: doubledark,
  });
};
export const setSolidDark = soliddark => dispatch => {
  dispatch({
    type: SOLIDDARK,
    payload: soliddark,
  });
};

export const setDarkModeText = darkmodetext => dispatch => {
  dispatch({
    type: DARKMODETEXT,
    payload: darkmodetext,
  });
};

export const setIsDarkMode = isdarkmode => dispatch => {
  dispatch({
    type: ISDARKMODE,
    payload: isdarkmode,
  });
};
export const setMusic = data => dispatch => {
  dispatch({
    type: MUSIC,
    payload: data,
  });
};
