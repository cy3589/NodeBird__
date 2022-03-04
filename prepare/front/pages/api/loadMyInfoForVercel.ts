import { LOAD_MY_INFO_SUCCESS } from '@reducers/user';
import axios from 'axios';
import { Store, AnyAction } from 'redux';

const loadMyInfoForVercel = async (
  store: Store<any, AnyAction> & {
    dispatch: unknown;
  },
) => {
  const { data } = await axios.get('/user');
  if (data) {
    store.dispatch({ type: LOAD_MY_INFO_SUCCESS, data });
  }
};
export default loadMyInfoForVercel;
