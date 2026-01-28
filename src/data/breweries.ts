import axios from "axios";

export interface IBrewery {
  address1: string;
  address2: string | null;
  address3: string | null;
  breweryType: string;
  city: string;
  country: string;
  id: string;
  latitude: number;
  longitude: number
  name: string;
  phone: string;
  postalCode: string;
  state: string;
  stateProvince: string;
  street: string;
  websiteUrl: string;
}

export class Brewery implements IBrewery {
  address1: string;
  address2: string | null;
  address3: string | null;
  breweryType: string;
  city: string;
  country: string;
  id: string;
  latitude: number;
  longitude: number;
  name: string;
  phone: string;
  postalCode: string;
  state: string;
  stateProvince: string;
  street: string;
  websiteUrl: string;

  constructor(brewery: IBrewery) {
    this.address1 = brewery.address1;
    this.address2 = brewery.address2;
    this.address3 = brewery.address3;
    this.breweryType = brewery.breweryType;
    this.city = brewery.city;
    this.country = brewery.country;
    this.id = brewery.id;
    this.latitude = brewery.latitude;
    this.longitude = brewery.longitude;
    this.name = brewery.name;
    this.phone = brewery.phone;
    this.postalCode = brewery.postalCode;
    this.state = brewery.state;
    this.stateProvince = brewery.stateProvince;
    this.street = brewery.street;
    this.websiteUrl = brewery.websiteUrl;
  }

  static fromApi(result: any): Brewery {
    return new Brewery({
      address1: result.address_1,
      address2: result.address_2,
      address3: result.address_3,
      breweryType: result.brewery_type,
      city: result.city,
      country: result.country,
      id: result.id,
      latitude: result.latitude,
      longitude: result.longitude,
      name: result.name,
      phone: result.phone,
      postalCode: result.postal_code,
      state: result.state,
      stateProvince: result.state_province,
      street: result.street,
      websiteUrl: result.website_url,
    });
  }
}

export const getBreweries = (page = 1, perPage = 20) => {
  return axios.get(`https://api.openbrewerydb.org/v1/breweries?page=${page}&per_page=${perPage}`)
    .then((res) => {
      return res.data.map((el:any) => Brewery.fromApi(el));
    })
    .catch((err) => console.log(err));
};

export const getLocalBreweries = (location: {lat: number; lng: number}, page = 1, perPage = 20) => {
  return axios.get(`https://api.openbrewerydb.org/v1/breweries?by_dist=${location.lat},${location.lng}&page=${page}&per_page=${perPage}`)
      .then((res) => {
        return res.data.map((el:any) => Brewery.fromApi(el));
      })
      .catch((err) => console.log(err));
};

export const getBrewery = (id: string) => axios.get(`https://api.openbrewerydb.org/v1/breweries/${id}`)
  .then((res) => {
    return Brewery.fromApi(res.data);
  })
  .catch((err) => console.log(err));

export const searchBreweries = (query: string, page = 1, perPage = 20) => axios.get(`https://api.openbrewerydb.org/v1/breweries/search?query=${query}&page=${page}&per_page=${perPage}`)
  .then((res) => {
    return res.data.map((el:any) => Brewery.fromApi(el));
  })
  .catch((err) => console.log(err));