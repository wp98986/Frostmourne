import {
  list,
  find,
  update,
  add,
  select,
  check,
  updateCust,
  custNo,
  addbypad,
  updatebyPad,
  del,
  fetchDesign,
  fetchRecords,
  fetchPlans,
  addRecord,
  delRecord,
  updateRecord,
  fetchBuildings,
  fetchSrcList,
  fetchOrders,
  exportCustomer,
} from '@/services/customerAPI';

// import { selectStores } from '@/services/storeAPI';
import { selectChannels } from '@/services/channelAPI';
import { custPropertys } from '@/services/propertyBagAPI';

let custListController;

export default {
  namespace: 'customer',

  state: {
    list: [],
    view: {},
    designers: [],
    records: [],
    plans: [],
    buildings: [],
    stores: [],
    propertys: [],
    srctypes: [],
    channels: [],
    customerList: [],
    orders: [],
    code: '',
    cust: {},
    customerState: {
      isNewCust: false,
      showCustomerModal: false,
    },
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      let signal;
      if (!payload.noThrottle) {
        if (custListController) {
          custListController.abort();
          custListController = null;
          return;
        }
        custListController = new AbortController();
        signal = custListController.signal;
      }

      const response = yield call(list, payload, {
        signal,
      });
      if (!response) return;
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *customerList({ payload }, { call, put }) {
      const response = yield call(list, payload);
      if (!response) return;
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *select({ payload }, { call, put }) {
      const response = yield call(select, payload);
      if (!response) return;
      yield put({
        type: 'saveCustomer',
        payload: response,
      });
    },
    *fetchView({ payload, callback }, { call, put }) {
      const response = yield call(find, payload);
      if (!response) return;
      yield put({
        type: 'saveView',
        payload: response,
      });
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call }) {
      const response = yield call(update, payload);
      if (!response) return;
      if (typeof callback === 'function') callback(response);
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(add, payload);
      if (!response) return;
      if (typeof callback === 'function') callback(response);
    },
    *updatebyPad({ payload, callback }, { call }) {
      const response = yield call(updatebyPad, payload);
      if (!response) return;
      if (typeof callback === 'function') callback(response);
    },
    *addbypad({ payload, callback }, { call }) {
      const response = yield call(addbypad, payload);
      if (!response) return;
      if (typeof callback === 'function') callback(response);
    },
    *checkCust({ payload }, { put }) {
      yield put({
        type: 'saveCust',
        payload,
      });
    },
    *custNo({ payload, callback }, { call, put }) {
      const response = yield call(custNo, payload);
      if (!response) return;
      yield put({
        type: 'saveNewNo',
        payload: response,
      });
      if (typeof callback === 'function') callback(response);
    },
    *updateCust({ payload, callback }, { call }) {
      const response = yield call(updateCust, payload);
      if (!response) return;
      if (typeof callback === 'function') callback(response);
    },
    *check({ payload, callback }, { call }) {
      const response = yield call(check, payload);
      if (typeof callback === 'function') callback(response);
    },
    *delete({ payload, callback }, { call }) {
      const response = yield call(del, payload);
      if (!response) return;
      if (callback) callback(response);
    },
    *fetchRecords({ payload }, { put, call }) {
      const response = yield call(fetchRecords, payload);
      if (!response) return;
      yield put({
        type: 'saveRecords',
        payload: response,
      });
    },
    *addRecord({ payload, callback }, { call }) {
      const response = yield call(addRecord, payload);
      if (!response) return;
      if (typeof callback === 'function') callback(response);
    },
    *updateRecord({ payload, callback }, { call }) {
      const response = yield call(updateRecord, payload);
      if (!response) return;
      if (typeof callback === 'function') callback(response);
    },
    *delRecord({ payload, callback }, { call }) {
      const response = yield call(delRecord, payload);
      if (!response) return;
      if (callback) callback(response);
    },
    *fetchPlans({ payload }, { put, call }) {
      const response = yield call(fetchPlans, payload);
      if (!response) return;
      yield put({
        type: 'savePlans',
        payload: response,
      });
    },
    *fetchOrders({ payload }, { put, call }) {
      const response = yield call(fetchOrders, payload);
      if (!response) return;
      yield put({
        type: 'saveOrders',
        payload: response,
      });
    },
    *fetchBuildings({ payload }, { put, call }) {
      const response = yield call(fetchBuildings, payload);
      if (!response) return;
      yield put({
        type: 'saveBuildings',
        payload: response,
      });
    },
    *fetchDesign({ payload }, { put, call }) {
      const response = yield call(fetchDesign, payload);
      if (!response) return;
      yield put({
        type: 'saveDesign',
        payload: response,
      });
    },
    // *fetchStores({ payload }, { put, call }) {
    //   const response = yield call(selectStores, payload);
    //   if (!response) return;
    //   yield put({
    //     type: 'saveStores',
    //     payload: response,
    //   });
    // },
    *fetchPropertys({ payload }, { put, call }) {
      const response = yield call(custPropertys, payload);
      if (!response) return;
      yield put({
        type: 'savePropertys',
        payload: response,
      });
    },
    *fetchSrcTypes({ payload }, { put, call }) {
      const response = yield call(fetchSrcList, payload);
      if (!response) return;
      yield put({
        type: 'saveSrcTypes',
        payload: response,
      });
    },
    *fetchChannels({ payload }, { put, call }) {
      const response = yield call(selectChannels, payload);
      if (!response) return;
      yield put({
        type: 'saveChannels',
        payload: response,
      });
    },

    *toggleCustomerModal({ payload }, { put }) {
      const param = payload;
      yield put({
        type: 'changeCustomerModal',
        payload: { ...param },
      });
    },

    *exportData({ payload, callback }, { call }) {
      const response = yield call(exportCustomer, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    saveList(state, action) {
      let data;
      if (action.payload) data = action.payload.data;
      return {
        ...state,
        list: data,
      };
    },
    saveView(state, action) {
      let data;
      if (action.payload) data = action.payload.data;
      return {
        ...state,
        view: data,
      };
    },
    saveDesign(state, action) {
      let data;
      if (action.payload) data = action.payload.data;
      return {
        ...state,
        designers: data,
      };
    },
    saveRecords(state, action) {
      let data;
      if (action.payload) data = action.payload.data;
      return {
        ...state,
        records: data,
      };
    },
    savePlans(state, action) {
      let data;
      if (action.payload) data = action.payload.data;
      return {
        ...state,
        plans: data,
      };
    },
    saveOrders(state, action) {
      let data;
      if (action.payload) data = action.payload.data;
      return {
        ...state,
        orders: data,
      };
    },
    saveBuildings(state, action) {
      let data;
      if (action.payload) data = action.payload.data;
      return {
        ...state,
        buildings: data,
      };
    },
    // saveStores(state, action) {
    //   let data;
    //   if (action.payload) data = action.payload.data;
    //   return {
    //     ...state,
    //     stores: data,
    //   };
    // },
    savePropertys(state, action) {
      let data;
      if (action.payload) data = action.payload.data;
      return {
        ...state,
        propertys: data,
      };
    },
    saveSrcTypes(state, action) {
      let data;
      if (action.payload) data = action.payload.data;
      return {
        ...state,
        srctypes: data,
      };
    },
    saveChannels(state, action) {
      let data;
      if (action.payload) data = action.payload.data;
      return {
        ...state,
        channels: data,
      };
    },
    saveNewNo(state, action) {
      let data;
      if (action.payload) data = action.payload.data;
      return {
        ...state,
        code: data,
      };
    },

    changeCustomerModal(state, { payload }) {
      const { customerState } = state;
      return {
        ...state,
        customerState: {
          ...customerState,
          ...payload,
        },
      };
    },
    saveCustomer(state, action) {
      let data;
      if (action.payload) data = action.payload.data;
      return {
        ...state,
        customerList: data,
      };
    },
  },
};
