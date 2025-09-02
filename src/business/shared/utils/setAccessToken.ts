import Cookies from 'js-cookie';

export const setAccessToken = (accessToken: string) => {
  const expiresDays = Number(import.meta.env.VITE_ACCESS_TOKEN_EXP);
  const expiresDate = new Date(Date.now() + expiresDays * 24 * 60 * 60 * 1000);

  Cookies.set('accessToken', accessToken, {
    expires: expiresDate,
    path: '/',
  });
};
