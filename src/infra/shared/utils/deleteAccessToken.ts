import Cookies from 'js-cookie';

export const deleteAccessToken = () => {
  Cookies.remove('accessToken', { path: '/' });
};
