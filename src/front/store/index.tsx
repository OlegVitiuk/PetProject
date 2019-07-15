/*  Imports from Redux:
 applyMiddleware: Applies middleware to the dispatch method of the Redux store
 combineReducers: Merges reducers into one
 createStore: Creates a Redux store that holds the state tree
 Store: The TS Type used for the store, or state tree
 */
// Import reducers and state type
import { authReducer, IAuthState } from "front/reducers/authReducer";
import {
  characterReducer,
  ICharacterState
} from "front/reducers/characterReducer";
import { applyMiddleware, combineReducers, createStore, Store } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
/*  Thunk
Redux Thunk middleware allows you to write action creators that return a function instead of an action. The thunk can be used to delay the dispatch of an action, or to dispatch only if a certain condition is met. The inner function receives the store methods dispatch and getState as parameters.
*/
import thunk from "redux-thunk";

// Create an interface for the application state
export interface IAppState {
  authState: IAuthState;
  characterState: ICharacterState;
}

// Create the root reducer
const rootReducer = combineReducers<IAppState>({
  authState: authReducer,
  characterState: characterReducer
});

// Create a configure store function of type `IAppState`
export default function configureStore(): Store<IAppState, any> {
  const store = createStore(
    rootReducer,
    undefined,
    composeWithDevTools(applyMiddleware(thunk))
  );
  return store;
}