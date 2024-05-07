import React from 'react';
import { useLocation } from 'react-router-dom';
import qs from 'qs';

function useQuery() {
  const { search } = useLocation();
  const _search = search.startsWith('?') ? search.slice(1) : search;
  return React.useMemo(() => {
    return qs.parse(_search);
  }, [_search]);
}

export default useQuery;
