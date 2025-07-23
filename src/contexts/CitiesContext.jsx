/*eslint-disable react/prop-types */
/*eslint-disable no-unused-vars */
import React, { useCallback } from 'react';
import { createContext } from 'react';
import { useContext, useEffect, useState } from 'react';
import { useReducer } from 'react';

const initialState={
  cities:[],
  isLoading: false,
  currentCity: {},
  error:"",
}
function reducer(state,action){
  switch(action.type)
  {
    case "loading":
      return{
        ...state,
        isLoading: true,
      }
    case "cities/loaded":
      return{
        ...state,
        cities: action.payload,
        isLoading: false,
      }
    case "cities/created":
      return{
        ...state,
        cities: [...state.cities, action.payload],
        isLoading: false,
      }
    case "cities/deleted":
      return{
        ...state,
        cities: state.cities.filter(city => city.id !== action.payload),
        currentCity: state.currentCity.id === action.payload ? {} : state.currentCity,
        isLoading: false,
      }
    case "city/detected":
      return{
        ...state,
        currentCity: action.payload,
        isLoading: false,
      }
    case "rejected":
      return{
        ...state,
        isLoading: false,
        error: action.payload,
      }
  }
}
const BASE_URL = "http://localhost:8000";
const CitiesContext = createContext();
function CitiesProvider({children}) {

    // const [cities, setCities] = useState([]);
    // const [isLoading, setIsLoading] = useState(true);
    // const [currentCity, setCurrentCity] = useState({});
    const [{cities, isLoading, currentCity, error},dispatch] = useReducer(reducer,initialState);
    useEffect(function () {
        async function fetchCities() {
          dispatch({type: "loading"});
          try {
            const res = await fetch(`${BASE_URL}/cities`);
            const data = await res.json();
            dispatch({type: "cities/loaded", payload: data});
          } catch {
            dispatch({type: "rejected", payload: "An error occurred while fetching the cities"});
            alert(error);
          } 
        }
        fetchCities();
      }, []);

     const getCity = useCallback( async function (id) {
        if (currentCity.id === Number(id)) {
            return;
        }
           dispatch({type: "loading"}); 
        try {
            const res = await fetch(`${BASE_URL}/cities/${id}`);
            const data = await res.json();
            dispatch({type: "city/detected", payload: data});
          } catch {
            dispatch({type: "rejected", payload: "An error occurred while fetching the city"});
            alert(error);
          } 
        },[currentCity.id]);

      async function createCity(newCity) {
           dispatch({type: "loading"});
        try {
           
            const res = await fetch(`${BASE_URL}/cities`, {
                method: "POST",
                body: JSON.stringify(newCity),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();

            dispatch({type: "cities/created", payload: data});
            dispatch({type: "city/detected", payload: data});
        } catch (error) {
            dispatch({type: "rejected", payload: "An error occurred while creating the city"});
            alert(error);
        } 
      }

      async function deleteCity(id) {
        try {
            if (!window.confirm("Are you sure you want to delete this city?")) {
                return;
            }
            dispatch({type: "loading"});
            const res = await fetch(`${BASE_URL}/cities/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                throw new Error("Failed to delete city");
            }
            dispatch({type: "cities/deleted", payload: id});
        } catch (error) {
            dispatch({type: "rejected", payload: "An error occurred while deleting the city"});
            alert(error);
        } 
      }
    return (
        <CitiesContext.Provider value={{ cities,  isLoading, currentCity, getCity, createCity, deleteCity, error }}>
            {children}
        </ CitiesContext.Provider>
    );
}


        
   


function useCities() {
    const context = useContext(CitiesContext);
    if (!context) {
        throw new Error("useCities must be used within a CitiesProvider");
    }
    return context;
}

export  {CitiesProvider, useCities};
