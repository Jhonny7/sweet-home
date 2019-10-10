export class SuiteModel {
    constructor(
        public bathrooms:number,
        public bedrooms: number,
        public date_at: string,
        public description: string,
        public garages: number,
        public is_premium: number,
        public photos: any,//arreglo de strings
        public premium_at: string,
        public price: string,
        public size: number,
        public title: string,
        public favorite: boolean,
        public id_suite:number
    ) { }

}