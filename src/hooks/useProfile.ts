
import { useQuery } from "@tanstack/react-query";
import API from "../apis/Api";

export function useProfile() {
    const { data: profile, isFetching, refetch } = useQuery({
      queryKey: ['getProfile'],
      queryFn: () => API.getProfile(),
      refetchOnMount: false,
    });
    
    return {
        data: profile?.data?.data,
        isFetching,
        refetch,
    };
  }