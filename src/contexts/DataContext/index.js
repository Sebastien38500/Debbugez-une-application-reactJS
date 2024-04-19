import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch("/events.json");
    return json.json();
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [last, setLast] = useState(null);
  const getData = useCallback(async () => {
    try {
      const response = await api.loadData();
      // Trier les événements par date
      const sortedEvents = response.events.sort((a, b) => new Date(a.date) - new Date(b.date));
      const sortedResponse = { ...response, events: sortedEvents };
      setData(sortedResponse);
      setLast(sortedEvents[sortedEvents.length - 1]);
    } catch (err) {
      setError(err);
    }
  }, []);
  
  useEffect(() => {
    if (data) return; // Prévient le rechargement si les données sont déjà chargées
    getData();
  }, [data, getData]); // Ajout de getData dans les dépendances pour garantir la mise à jour

  return (
    <DataContext.Provider
      value={{
        data,
        error,
        last,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useData = () => useContext(DataContext);

export default DataContext;

