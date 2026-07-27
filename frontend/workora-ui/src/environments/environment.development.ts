/**
 * Development environment configuration for Workora UI.
 */
export const environment = {
  /**
   * Flag indicating if the application is running in production mode.
   */
  production: false,

  /**
   * Base API endpoint URL for Workora ASP.NET Core backend running locally via dev server proxy.
   */
  apiUrl: '/api/v1',

  /**
   * Domain name for token authorization scoping.
   */
  apiDomain: 'localhost:5041'
};
