import { useState, useEffect } from "react";
import axios from "axios";

export const useLotes = () => {
  const [lotes, setLotes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL

  const fetchLotes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/api/lotes`);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { lotes, error, loading, refetch: fetchLotes };
};