import { Component, OnInit } from '@angular/core';
import { FlightStatusService } from 'src/app/services/flight-status.service';
import { FlightStatus } from './model/flight-status';
import { Pagination } from './model/pagination';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  flightData: any[]
  pageNumber = 0
  pageSize = 13
  totalRecords: number
  pagination: Pagination
  constructor(public flightStatusService: FlightStatusService) { }

  ngOnInit() {
    this.loadFlights()
  }

  loadFlights(): void{
    this.flightStatusService.getFlightStatuses(this.pageNumber, this.pageSize).subscribe((response: FlightStatus)=>{
      this.flightData = response.operationalFlights
      this.pagination = response.page
    })
  }

  setColorStatus(status: string): string{
    if(status === 'CANCELLED') return 'red'
    if(status === 'PARTIALLY_CANCELLED') return 'orangered'
    if(status === 'DELAYED_DEPARTURE') return 'yellow'
    if(status === 'DELAYED_ARRIVAL') return 'yellow'
    else return 'green'
  }

  pageChanged(event: any): void{
    this.pageNumber = event.page - 1 
    if(this.pageNumber > this.pagination.totalPages - 1) return
    this.loadFlights()
  }

}
