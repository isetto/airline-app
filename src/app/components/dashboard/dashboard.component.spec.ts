import { ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed, tick, waitForAsync } from '@angular/core/testing';
import {DebugElement} from '@angular/core';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {FlightService} from '../../services/flight-status.service'
import {HttpClient} from '@angular/common/http';
import {By} from '@angular/platform-browser';
import {of} from 'rxjs';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard.component';
import { flightData } from 'src/app/mock/flights-data';
import { AppModule } from 'src/app/app.module';
import { render, screen, fireEvent } from '@testing-library/angular'
import { flightsDataSecondPage } from 'src/app/mock/flights-data-2';




describe('DashboardComponent', () => {

  let fixture: ComponentFixture<DashboardComponent>;
  let component:DashboardComponent;
  let el: DebugElement;
  let flightService: FlightService;

  beforeEach(waitForAsync(() => {

    jasmine.getEnv().allowRespy(true);


      TestBed.configureTestingModule({
          imports: [
              NoopAnimationsModule,
              AppModule
          ],
          providers: [
            FlightService,
            { provide: HttpClient, useValue: {} }
          ]
      }).compileComponents()
          .then(() => {
              fixture = TestBed.createComponent(DashboardComponent);
              component = fixture.componentInstance;
              el = fixture.debugElement;
              flightService = TestBed.inject(FlightService);
          });
          
          
  }));

  it("should create the component", () => {

    expect(component).toBeTruthy();

  });


  it("should display flight records", () => {
      spyOn(flightService, 'getFlights').and.returnValue(of(flightData));
      fixture.detectChanges();
      const row = el.queryAll(By.css(".grid--data-row"));  
      expect(row.length).toBe(10, "Unexpected number of tabs found");
  });

  it("when type id in search should display proper record", waitForAsync(() => {
    spyOn(flightService, 'getFlights').and.returnValue(of(flightData));
    fixture.detectChanges();
     const searchInput  = el.queryAll(By.css(".search"));  
     searchInput[0].nativeNode.value = '1175'

     fixture.whenStable().then(()=>{
      fixture.detectChanges();
      const row = el.queryAll(By.css(".grid--data-row"));  
      expect(row.length).toBe(1)
     })
}));

it("data should change when next button clicked", waitForAsync(() => {
  spyOn(flightService, 'getFlights').and.returnValue(of(flightData));
  fixture.detectChanges();
  const rowData1 = el.queryAll(By.css(".id-hook"));  
  const forwardButton = screen.getByTestId('forward-hook')
  spyOn(flightService, 'getFlights').and.returnValue(of(flightsDataSecondPage));
  forwardButton.click()
  fixture.detectChanges();
  const rowData2 = el.queryAll(By.css(".id-hook"));  
  expect(rowData1[0].nativeElement).not.toBe(rowData2[0].nativeElement)
}));

it("should change order when id header clicked", () => {
  spyOn(flightService, 'getFlights').and.returnValue(of(flightData));
  fixture.detectChanges();
  const descentOrder = el.queryAll(By.css(".id-hook"));
  const orderButton =  screen.getByTestId('id-header-hook')
  orderButton.click()
  fixture.detectChanges();
  const ascendOrder = el.queryAll(By.css(".id-hook"));
  expect(ascendOrder[0].nativeElement).toBe(descentOrder[9].nativeElement)
});

});





















