import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';

export interface StateItem {
  name: string;
  stateCode?: string;
}

export interface CountriesNowStateResponse {
  error: boolean;
  msg: string;
  data?: {
    name: string;
    iso3: string;
    states: Array<{ name: string; state_code?: string }>;
  };
}

export interface CountriesNowCityResponse {
  error: boolean;
  msg: string;
  data?: string[];
}

const FALLBACK_INDIAN_STATES: string[] = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi (NCT)', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

const FALLBACK_CITIES_BY_STATE: Record<string, string[]> = {
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Gandhinagar', 'Anand', 'Navsari', 'Morbi', 'Bharuch'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Pimpri-Chinchwad', 'Nashik', 'Kalyan-Dombivli', 'Vasai-Virar', 'Aurangabad', 'Navi Mumbai', 'Solapur', 'Kolhapur'],
  'Karnataka': ['Bengaluru', 'Mysuru', 'Hubballi-Dharwad', 'Mangaluru', 'Belagavi', 'Kalaburagi', 'Ballari', 'Vijayapura', 'Shivamogga', 'Tumakuru'],
  'Delhi (NCT)': ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi', 'Central Delhi'],
  'Delhi': ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi', 'Central Delhi'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tiruppur', 'Erode', 'Vellore', 'Tirunelveli', 'Thothukudi'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Khammam', 'Karimnagar', 'Ramagundam', 'Mahbubnagar', 'Nalgonda'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi', 'Meerut', 'Prayagraj', 'Noida', 'Bareilly', 'Aligarh', 'Moradabad'],
  'West Bengal': ['Kolkata', 'Howrah', 'Siliguri', 'Asansol', 'Durgapur', 'Bardhaman', 'Malda', 'Baharampur'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur', 'Bhilwara', 'Alwar', 'Bharatpur'],
  'Haryana': ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak', 'Hisar', 'Karnal', 'Sonipat'],
  'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Kollam', 'Thrissur', 'Kannur', 'Alappuzha', 'Kottayam', 'Palakkad'],
  'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Pathankot', 'Hoshiarpur']
};

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private readonly http = inject(HttpClient);
  private readonly statesApiUrl = 'https://countriesnow.space/api/v0.1/countries/states';
  private readonly citiesApiUrl = 'https://countriesnow.space/api/v0.1/countries/state/cities';

  private statesCache$: Observable<string[]> | null = null;
  private readonly citiesCache = new Map<string, Observable<string[]>>();

  /**
   * Fetches the list of states dynamically from 3rd party REST API for a given country (default: India).
   */
  getStates(country = 'India'): Observable<string[]> {
    if (!this.statesCache$) {
      this.statesCache$ = this.http.post<CountriesNowStateResponse>(this.statesApiUrl, { country }).pipe(
        map(res => {
          if (!res.error && res.data?.states && res.data.states.length > 0) {
            const list = res.data.states.map(s => s.name.trim()).filter(Boolean);
            return Array.from(new Set(list)).sort((a, b) => a.localeCompare(b));
          }
          return Array.from(new Set(FALLBACK_INDIAN_STATES)).sort((a, b) => a.localeCompare(b));
        }),
        catchError(() => of(Array.from(new Set(FALLBACK_INDIAN_STATES)).sort((a, b) => a.localeCompare(b)))),
        shareReplay(1)
      );
    }
    return this.statesCache$;
  }

  /**
   * Fetches cities dynamically for a specific state from 3rd party REST API.
   */
  getCities(stateName: string, country = 'India'): Observable<string[]> {
    if (!stateName) {
      return of([]);
    }

    const key = `${country}_${stateName.trim().toLowerCase()}`;
    if (!this.citiesCache.has(key)) {
      const fetch$ = this.http.post<CountriesNowCityResponse>(this.citiesApiUrl, {
        country,
        state: stateName.trim()
      }).pipe(
        map(res => {
          if (!res.error && res.data && res.data.length > 0) {
            const unique = Array.from(new Set(res.data.map(c => c.trim()))).filter(Boolean);
            return unique.sort((a, b) => a.localeCompare(b));
          }
          const fallback = FALLBACK_CITIES_BY_STATE[stateName] || [];
          return Array.from(new Set(fallback.map(c => c.trim()))).filter(Boolean).sort((a, b) => a.localeCompare(b));
        }),
        catchError(() => {
          const fallback = FALLBACK_CITIES_BY_STATE[stateName] || [];
          return of(Array.from(new Set(fallback.map(c => c.trim()))).filter(Boolean).sort((a, b) => a.localeCompare(b)));
        }),
        shareReplay(1)
      );

      this.citiesCache.set(key, fetch$);
    }

    return this.citiesCache.get(key)!;
  }
}
