// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  URL_BIO : "https://aplicacionesweb.epmmop.gob.ec:8445/ServiciosBiometrico",
  URL_DIS : "https://aplicacionesweb.epmmop.gob.ec:8445/RecursosHumanosWS/rest/RecursosHumanosDistributivoWS",
  //URL_DIS : "http://10.52.66.135:8080/RecursosHumanosWS/rest/RecursosHumanosDistributivoWS",
  //URL_DIS : "http://localhost:8080/RecursosHumanosWS/rest/RecursosHumanosDistributivoWS",
  path_bio: "",
  path_mail: "/getMail",
  noExists: "No existe",
  path_createAsis: "/procesos/create",
  URL_MONGO: "http://epmmopmovil.epmmop.gob.ec:3000/",
  URL_USR : "http://epmmopmovil.epmmop.gob.ec:3000/user",
  URL_ASIST : "http://epmmopmovil.epmmop.gob.ec:3000/asistencia"

 /*URL_MONGO: "http://localhost:3000/",
 URL_USR : "http://localhost:3000/user",
 URL_ASIST : "http://localhost:3000/asistencia"*/

  /*URL_MONGO: "http://192.168.94.15:3000/",
  URL_USR : "http://192.168.94.15:3000/user",
  URL_ASIST : "http://192.168.94.15:3000/asistencia"*/
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
