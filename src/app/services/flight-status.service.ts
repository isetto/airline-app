import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import * as moment from 'moment';
import { FlightStatus } from '../components/dashboard/model/flight-status';


@Injectable({
  providedIn: 'root'
})
export class FlightStatusService {
  flightCache = new Map()
  baseUrl = 'https://api.airfranceklm.com/'
  token = environment.apiUrl

  constructor(private httpClient: HttpClient) { }

  getFlightStatuses(pageNumber: number, pageSize: number): Observable<FlightStatus>{
    const today = moment().utc().format().toString()
    const tomorrow = moment().utc().add(1, 'days').format().toString()

    const url = `${this.baseUrl}opendata/flightstatus/?origin=AMS&movementType=D&pageSize=${pageSize}&pageNumber=${pageNumber}&startRange=${today}&endRange=${tomorrow}`
    const headers =  {'Accept': 'application/hal+json;version=com.afkl.operationalflight.v3', 'api-key': this.token}

    let cachedResponse = this.flightCache.get(pageNumber)
    if(cachedResponse) return of(cachedResponse)

    return this.httpClient.get<FlightStatus>(url, {headers: headers})
    .pipe(
      map(response=>{
      this.flightCache.set(pageNumber, response)
      return response
    })
    )
    
  }
}
