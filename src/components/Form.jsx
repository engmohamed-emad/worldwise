// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"
/*eslint-disable no-unused-vars */
/*eslint-disable react/prop-types*/
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "./Button";
import styles from "./Form.module.css";
import BackButton from "./BackButton";
import { useCities } from "../contexts/CitiesContext";
import { useEffect } from "react";
import Message from "./Message";
import Spinner from "./Spinner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useUrlPosition } from "../hooks/useUrlPosition";




export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const navigate = useNavigate();
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [lat,lng] = useUrlPosition();
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [isLoadingGeoCoding, setIsLoadingGeoCoding] = useState(false);
  const [emoji, setEmoji] = useState("");
  const [geoError, setGeoError] = useState("");
  const { createCity, isLoading } = useCities();
  

  useEffect(function(){
  if(!lat && !lng) {
  return;
  }
    async function fetchCity() {
      try{
        setIsLoadingGeoCoding(true);
        setGeoError("");
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
        );
        const data = await response.json();
        if(!data.countryCode) {
          throw new Error("it seems that you are not in a country, click on another place "); 
        }
        setCityName(data.city || data.locality || "");
        setCountry(data.countryName || "");
        setEmoji(convertToEmoji(data.countryCode || ""));
      }
      catch (error) {
        console.error("Error fetching city data:", error);
        setGeoError(error.message);

      } finally {
        setIsLoadingGeoCoding(false);
      }
  }
    fetchCity();
},[lat, lng]);


  async function handleSubmit(e) {
    e.preventDefault();
    if (!cityName || !country || !date ) {
      alert("Please fill in all fields");
      return;
    }
    
    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat, lng },
      id: crypto.randomUUID(),
    };
    await createCity(newCity);
    navigate("/app/cities");
   
  }

  if (!lat && !lng) {
    return (
      <Message message="Start by clicking on the map to select a location." />
    );
  }
  if(isLoadingGeoCoding) {
    return <Spinner />
  }

  if(geoError) {
   return <Message message={geoError}/>
  }
  return (
    <form className={`${styles.form} ${isLoading ? styles.loading : ""}`}  onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName} 
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        
        <DatePicker  onChange={date => setDate(date)}  selected= {date} dateFormat='dd/MM/yyyy' />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button
          type="primary"
        >
          Add
        </Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
