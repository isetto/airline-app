import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, debounceTime, distinctUntilChanged, map, retryWhen, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import * as moment from 'moment';
import { FlightStatus } from '../model/flight-status';


@Injectable({
  providedIn: 'root'
})
export class FlightService {
  flightCache = new Map()
  baseUrl = 'https://api.airfranceklm.com/'
  token = environment.apiUrl

  constructor(private httpClient: HttpClient) { }

  getFlights(pageNumber: number, pageSize: number, recordsPerPageChanged: boolean): Observable<any>{
    const today = moment().utc().format().toString()
    const tomorrow = moment().utc().add(1, 'days').format().toString()

    const url = `${this.baseUrl}opendata/flightstatus/?origin=AMS&movementType=D&pageSize=${pageSize}&pageNumber=${pageNumber}&carrierCode=KL&startRange=${today}&endRange=${tomorrow}`
    const headers =  {'Accept': 'application/hal+json;version=com.afkl.operationalflight.v3', 'api-key': this.token}

    if(recordsPerPageChanged) this.flightCache = new Map()
    let cachedResponse = this.flightCache.get(pageNumber)
    if(cachedResponse) return of(cachedResponse)

    return this.httpClient.get<any>(url, {headers: headers})
    .pipe(
      map(response=>{
      this.flightCache.set(pageNumber, response)
      return response
    })
    )
    
  }
}
