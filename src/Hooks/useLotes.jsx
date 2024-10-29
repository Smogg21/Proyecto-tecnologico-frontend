import { useState, useEffect } from "react";
import axios from "axios";

export const useLotes = () => {
  const [lotes, setLotes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLotes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/lotes");
        setLotes(response.data);
      } catch (err) {
        setError("Hubo un error al obtener los datos");
        console.error("Hubo un error al obtener los datos", err);
      }
    };

    fetchLotes();
  }, []);

  return { lotes, error };
};
