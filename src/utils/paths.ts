const urlBase:any = "http://localhost:8080/api_sweet_home/"; //dev

const suite: string = "suite";
const settlements: string = "settlements";
const login: string = "login";

export const paths = {
    types: `${urlBase}${suite}/getSuiteTypes`,
    propertyTypes: `${urlBase}${suite}/getPropertyTypes`,
    states: `${urlBase}${settlements}/getStates?idCountry=`,
    zipCode: `${urlBase}${settlements}/getDataFromPostalCode?postalCode=`,
    cities: `${urlBase}${settlements}/getCities?idState=`,
    searchSuites: `${urlBase}${suite}/getSuites`,
    searchSuitesByUser: `${urlBase}${suite}/getSuitesByUser`,
    deleteSuite: `${urlBase}${suite}/deleteSuite`,
    createSuite: `${urlBase}${suite}/createSuiteApp`,
    createUser: `${urlBase}${login}/createUser`,
    getUser: `${urlBase}${login}/getAuthenticate`,
    createUserTemporal: `${urlBase}${login}/createUserTemporal`,
    addFavorite: `${urlBase}${suite}/addFavorite`,
    deleteFavorite: `${urlBase}${suite}/deleteFavorite`,
}