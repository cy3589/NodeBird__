import { HYDRATE } from 'next-redux-wrapper';
import { AnyAction, combineReducers } from 'redux';
import user from '@reducers/user';
import post from '@reducers/post';

// HYDRATE를 위한 index리듀서문과 import한 user, post 리듀서를 combineReducers로 합친다.
// Server Side Rendering을 위해서 HYDRATE가 쓰임
const rootReducer = (state: any, action: AnyAction) => {
  switch (action.type) {
    case HYDRATE: {
      return action.payload;
    }
    default: {
      const combineReducer = combineReducers({
        user,
        post,
      });
      return combineReducer(state, action);
    }
  }
};

export default rootReducer;
