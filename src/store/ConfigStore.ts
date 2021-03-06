import { createStore, applyMiddleware, compose } from 'redux';
import { KialiAppState } from './Store';
import { persistStore, persistReducer } from 'redux-persist';
import rootReducer from '../reducers';
import thunk from 'redux-thunk';

// defaults to localStorage for web and AsyncStorage for react-native
import storage from 'redux-persist/lib/storage';
import { INITIAL_GLOBAL_STATE } from '../reducers/GlobalState';
import { INITIAL_NAMESPACE_STATE } from '../reducers/Namespaces';
import { INITIAL_LOGIN_STATE } from '../reducers/LoginState';
import { INITIAL_GRAPH_STATE } from '../reducers/GraphDataState';
import { INITIAL_USER_SETTINGS_STATE } from '../reducers/UserSettingsState';
import { INITIAL_MESSAGE_CENTER_STATE } from '../reducers/MessageCenter';
import { INITIAL_STATUS_STATE } from '../reducers/HelpDropdownState';

declare const window;

const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['authentication', 'statusState', 'userSettings']
};

const composeEnhancers =
  (process.env.NODE_ENV === 'development' && window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const configureStore = (initialState: KialiAppState) => {
  // configure middlewares
  const middlewares = [thunk];
  // compose enhancers
  const enhancer = composeEnhancers(applyMiddleware(...middlewares));
  // persist reducers
  const persistentReducer = persistReducer(persistConfig, rootReducer);

  return createStore(persistentReducer, initialState, enhancer);
};

// Setup the initial state of the Redux store with defaults
// (instead of having things be undefined until they are populated by query)
// Redux 4.0 actually required this
let initialStore: KialiAppState = {
  globalState: INITIAL_GLOBAL_STATE,
  statusState: INITIAL_STATUS_STATE,
  namespaces: INITIAL_NAMESPACE_STATE,
  authentication: INITIAL_LOGIN_STATE,
  messageCenter: INITIAL_MESSAGE_CENTER_STATE,
  graph: INITIAL_GRAPH_STATE,
  userSettings: INITIAL_USER_SETTINGS_STATE
};

// pass an optional param to rehydrate state on app start
export const store = configureStore(initialStore);
export const persistor = persistStore(store);
