import Cookies from 'js-cookie';

export const getAccessToken = () => {
  const accessToken = Cookies.get('accessToken');

  if (!accessToken) {
    return '';
  }

  return accessToken;
};
