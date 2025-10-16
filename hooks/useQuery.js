import { useState } from "react";

const useQuery = (initial) => {
  const [query, setQuery] = useState(initial);

  const updateQuery = (newQuery) => {
    if (typeof newQuery === "function") {
      // Cho phép truyền callback như (prev) => ...
      setQuery((prev) => newQuery(prev));
    } else {
      setQuery((prev) => ({
        ...prev,
        ...newQuery,
      }));
    }
  };

  const resetQuery = () => {
    setQuery(initial);
  };
  return { query, updateQuery, resetQuery };
};

export default useQuery;
