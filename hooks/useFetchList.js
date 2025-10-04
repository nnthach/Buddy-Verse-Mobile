import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";

const useFetchList = (api, params = null) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAPI = useCallback(async () => {
    try {
      setLoading(true);
      const res = params ? await api(params) : await api();
      console.log("res fetch list", res.data);
      setData(res.data);
    } catch (err) {
      console.error("useFetchList error", err);
    } finally {
      setLoading(false);
    }
  }, [api, params]);

  useFocusEffect(
    useCallback(() => {
      fetchAPI();
    }, [fetchAPI])
  );

  return { data, loading, refresh: fetchAPI };
};

export default useFetchList;
