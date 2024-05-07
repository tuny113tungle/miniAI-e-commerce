// Custom hook for getting profile info from the API
// and check if the profile is logged in or not



import { useEffect } from 'react';
import { useProfile } from './useProfile';
import CookiesService from '../apis/CookiesService';

export const useAuth = () => {
  const {data: profile, isFetching, refetch} = useProfile()
  console.log("🚀 ~ useAuth ~ profile:", profile)
  const token = CookiesService.getClientCookies('token');

  useEffect(() => {
    if (token) {
      refetch();
    }
  }, [token]);

  const isGuest = profile?.guest;
  const isLoggedIn = isGuest ? false : !!profile?.id;
  return { profile, isLoggedIn, isFetching };
};
