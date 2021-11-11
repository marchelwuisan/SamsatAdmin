import {createStore} from 'redux';
import firebase from '../config/firebase';

const initialState = {
    vehicles: [],
    users: [],
    vehiclesStatus: false,
    usersStatus: false,
    loggedIn: false,
    totalVehicle: 0,
    search: '',
}

const reducer = (state = initialState, action) => {

    switch(action.type){
        case 'LOAD_VEHICLES':
            if(state.vehicles = []){
                return {
                    ...state,
                    vehicles: [...state.vehicles, ...action.value],
                    vehiclesStatus: true
                }
                
            }
        case 'LOAD_USERS':
            if(state.users === []){
                return (
                    firebase
                    .database()
                        .ref(`/users/`)
                        .once('value')
                            .then(res => {
                            const obj = res.val()
                            let arr = Object.keys(obj).map((k) => obj[k])
                            console.log('users: ', arr)
                            return {
                                ...state,
                                users: arr
                            }
                            })
                )
            }
        case 'LOGIN':
            return {
                ...state,
                loggedIn: true
            }
            case 'LOGOUT':
                return {
                    ...state,
                    loggedIn: false
                }
        case 'ADD_VEHICLE':
            return {
                ...state,
                vehicles: [...state.vehicles, action.value],
            }
        case 'DELETE_VEHICLE':
            return {
                ...state,
                vehicles: state.vehicles.filter(item => item.NO !== action.value),
            }
        case 'TOTAL_VEHICLE':
            return {
                ...state,
                totalVehicle: action.value,
            }
        case 'PLUS_TOTAL_VEHICLE':
            return {
                ...state,
                totalVehicle: state.totalVehicle + 1,
            }
        case 'MINUS_TOTAL_VEHICLE':
            return {
                ...state,
                totalVehicle: state.totalVehicle - 1,
            }
        case 'SEARCH':
            return {
                ...state,
                search: action.value,
            }
        default:
            return state;
    }
}

const store = createStore(reducer)

// store.subscribe(() => {
//     console.log('store change: ', store.getState())
// })

export default store;