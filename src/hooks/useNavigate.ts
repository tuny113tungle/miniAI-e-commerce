import { useNavigate } from 'zmp-ui';

interface Navigate {
  url: string;
}

export const useNavigation = () => {
  const _navigate = useNavigate();

  const navigate = (url: string) => {
    _navigate(url, {
      animate: false,
    });
  };

  return { navigate };
};
