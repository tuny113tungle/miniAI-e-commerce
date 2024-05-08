import { useQuery } from "@tanstack/react-query";
import API from "../apis/Api";

export function useShopSetting() {
    const { data: shopSetting, isFetching,refetch } = useQuery({
      queryKey: ['getShopSetting'],
      queryFn: () => API.getShopSetting(),
      refetchOnMount: false,
    });
    return {
        data: shopSetting?.data?.data,
        isFetching,
        refetch,
    };
  }