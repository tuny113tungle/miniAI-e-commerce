

import { useQuery } from '@tanstack/react-query';
import { floor } from 'lodash';
import API from '../apis/Api';

const useUserPoint = () => {
  const { data: userPoint } = useQuery({
    queryKey: ['userPoint'],
    queryFn: API.getUserPoint,
    refetchOnWindowFocus: false,
  });

  return {
    userPoint: floor(userPoint?.data.data ?? 0),
  };
};

const useUserPointAccumulationHistory = () => {
  const { data: userPointAccumulationHistory } = useQuery({
    queryKey: ['userPointAccumulationHistory'],
    queryFn: API.getPointAccumulationHistory,
    refetchOnWindowFocus: false,
  });

  return {
    userPointAccumulationHistory: userPointAccumulationHistory?.data.data,
  };
};

const useUserRefferalHistory = ({ startDate, endDate }: { startDate?: Date; endDate?: Date }) => {
  const { data: userRefferalHistory, isFetching } = useQuery({
    queryKey: ['userRefferalHistory', startDate, endDate],
    queryFn: () => {
      return API.getUserRefferalHistory({
        startDate,
        endDate,
      });
    },
    refetchOnWindowFocus: false,
  });

  return {
    userRefferalHistory: userRefferalHistory?.data.data,
    isFetching,
  };
};

export { useUserPoint, useUserPointAccumulationHistory, useUserRefferalHistory };
