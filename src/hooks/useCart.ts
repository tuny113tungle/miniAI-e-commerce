import { useQuery } from "@tanstack/react-query";
import API from "../apis/Api";

export function useCart() {
    const { data: carts, isFetching,refetch } = useQuery({
      queryKey: ['getCart'],
      queryFn: () => API.getCart(),
      refetchOnMount: false,
    });
    return {
        data: carts?.data?.data,
        isFetching,
        refetch,
    };
  }