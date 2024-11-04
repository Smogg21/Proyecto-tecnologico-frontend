import { useState, useEffect } from "react";
import axios from "axios";

export const useLotes = () => {
  const [lotes, setLotes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLotes = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/lotes");
      setLotes(response.data);
      setError(null);
    } catch (err) {
      setError("Hubo un error al obtener los datos");
      console.error("Hubo un error al obtener los datos", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLotes();
  }, []);

  return { lotes, error, loading, refetch: fetchLotes };
};