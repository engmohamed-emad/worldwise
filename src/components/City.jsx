/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import styles from "./City.module.css";
import Button from "./Button";
import { useParams } from "react-router-dom";
import { use, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCities } from "../contexts/CitiesContext";
import Spinner from "./Spinner";
import BackButton from "./BackButton";
const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

function City() {
  
  const navigate = useNavigate();
  const {id} = useParams();


// const { cities } = useCities();
//  const [currentCity, setCurrentCity] = useState({});
//  const [found, setFound] = useState(false);
//   useEffect(function(){
//   function findCityById() {
  
//     const city = cities.find((city) => city.id == id);
//     if (city) {
//       setCurrentCity(city);
//     } else {
//       setFound(true);
//     }
//   }
//   findCityById();
//   },[id, cities]
// )
//   if (found) {
//     return (
//       <div className={styles.city}>
//         <h2>City not found</h2>
//         <Button type="back" onClick={() => navigate(-1)}>
//           &larr; Back
//         </Button>
//       </div>
//     );
//   }

  const { getCity, currentCity, isLoading } = useCities();


  useEffect(function(){
    getCity(id);
  },[id, getCity]);

    if (isLoading) {
    return <Spinner />;
  }
  
  const { cityName, emoji, date, notes } = currentCity;
  return (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>City name</h6>
        <h3>
          <span>{emoji}</span> {cityName}
        </h3>
      </div>

      <div className={styles.row}>
        <h6>You went to {cityName} on</h6>
        <p>{formatDate(date || null)}</p>
      </div>

      {notes && (
        <div className={styles.row}>
          <h6>Your notes</h6>
          <p>{notes}</p>
        </div>
      )}

      <div className={styles.row}>
        <h6>Learn more</h6>
        <a
          href={`https://en.wikipedia.org/wiki/${cityName}`}
          target="_blank"
          rel="noreferrer"
        >
          Check out {cityName} on Wikipedia &rarr;
        </a>
      </div>

      <div>
        <BackButton />

      </div>
    </div>
  );
}

export default City;
