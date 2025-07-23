/* eslint-disable react/prop-types */
import styles from "./CountryList.module.css";
import CountryItem from "./CountryItem";
import Message from "./Message";
import Spinner from "./Spinner";
import { useCities } from "../contexts/CitiesContext";
function CountryList() {
  const { cities, isLoading } = useCities();
  if (isLoading) {
    return <Spinner />;
  }
  if (!cities.length)
    return <Message message="add your first city by clicking on map" />;
  const countryMap = new Map(
    cities.map((city) => [
      city.country,
      { country: city.country, emoji: city.emoji, id: city.id },
    ])
  );
  const countries = Array.from(countryMap.values());
  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country.id} />
      ))}
    </ul>
  );
}

export default CountryList;
