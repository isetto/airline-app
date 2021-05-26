import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FlightService } from 'src/app/services/flight-status.service';
import { FlightStatus } from '../../model/flight-status';
import { Pagination } from '../../model/pagination';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  flightData: any[]
  flightDataOriginal: any[]
  pageNumber = 0
  pageSize = 10
  totalRecords: number
  pagination: Pagination
  resultsCount: number
  sortDirection = 1
  sortKey: string = null
  flightId = new FormControl('');
  private formSubscription: Subscription
  constructor(public flightService: FlightService) { }


  ngOnInit() {
    this.loadFlights()
    this.initSearch()
  }

  initSearch(){
    this.formSubscription = this.flightId.valueChanges.pipe(debounceTime(500)).subscribe(value=>{
      if(value === '') this.flightData = this.flightDataOriginal
      else this.loadFlightsById(value)
    })
  }

  loadFlights(recordsPerPageChanged = false): void{
    this.flightService.getFlights(this.pageNumber, this.pageSize, recordsPerPageChanged).subscribe((response: FlightStatus)=>{
      this.flightData = response.operationalFlights
      this.flightDataOriginal = response.operationalFlights
      this.pagination = response.page
      this.sortBy('flightNumber')
    })
  }

  loadFlightsById(flightId: number){
    this.flightData = this.flightDataOriginal.filter(flight=> {
      const idString = flight.id.substr(flight.id.length - 4)
      return idString.includes(flightId.toString())
     })

  }

  setColorStatus(status: string): string{
    if(status === 'CANCELLED') return 'red'
    if(status === 'PARTIALLY_CANCELLED') return 'orangered'
    if(status === 'DELAYED_DEPARTURE') return 'yellow'
    if(status === 'DELAYED_ARRIVAL') return 'yellow'
    else return 'green'
  }

  sortBy(key: string){
    this.sortKey = key
    this.sortDirection = this.sortDirection * -1
    this.sort()
  }

  sort(){
    this.flightData = this.flightData.sort((a, b)=>{
      const valA = a[this.sortKey]
      const valB = b[this.sortKey]
      return this.compare(valA, valB, this.sortDirection)
    })
  }

  compare(a: number | string, b: number | string, sortDirection: number) {
    return (a < b ? -1 : 1) * sortDirection;
  }

  pageChanged(event: any): void{
    this.pageNumber = event.page - 1 
    if(this.pageNumber > this.pagination.totalPages - 1) return
    this.loadFlights()
  }

  nextPage(){
    if(this.pageNumber >= this.pagination.totalPages-1) return
    this.pageNumber++
    this.loadFlights()
  }

  prevPage(){
    this.pageNumber--
    this.loadFlights()
  }

  goFirst(){
    this.pageNumber = 0
    this.loadFlights()
  }

  goLast(){
    this.pageNumber = this.pagination.totalPages -1
    this.loadFlights()
  }

  ngOnDestroy(): void {
    if(this.formSubscription) this.formSubscription.unsubscribe()
  }

}
