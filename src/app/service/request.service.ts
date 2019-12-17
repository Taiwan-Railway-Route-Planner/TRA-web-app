import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  HOME_IP = 'taiwan-railway-route-planner.github.io';
  BASE_URL: string = 'https://' + this.HOME_IP + '/TRATimetableData/';

  EXTERNAL_IP = 'taiwanrailwayapp.com';
  BACKEND: string = 'https://www.' + this.EXTERNAL_IP + '/api/';

  url = {
    station: this.BASE_URL + 'stationInfo.json',
    easyToSearchStationInfo: this.BASE_URL + 'easyToSearchStationInfo.json',
    schedulesDay: this.BACKEND + 'route'
  };

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient
  ) {
  }

  getSearchFileWithStations(): Observable<any> {
    return this.getRequest(this.url.easyToSearchStationInfo, 'getSearchFileWithStations');
  }

  getStation(): Observable<any> {
    return this.getRequest(this.url.station, 'getStation');
  }

  getTheRoute(travel: any): Observable<any> {
    return this.postRequest(this.url.schedulesDay, travel, 'getTheRoute');
  }

  /**
   * Handle Get Http operation.
   * @param url - url of the http request
   * @param funcName - name of the function
   */
  private getRequest(url: string, funcName: string): Observable<any> {
    return this.http.get<any>(url)
      .pipe(
        catchError(this.handleError<any>(funcName))
      );
  }

  /**
   * Handle Post Http operation.
   * @param url - url of the http request
   * @param funcName - name of the function
   * @param travel - the travel object
   */
  private postRequest(url: string, funcName: string, travel: any): Observable<any> {
    return this.http.put(url, travel, this.httpOptions)
      .pipe(
        catchError(this.handleError<any>(funcName))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /**
   * Handle warn logging to the console of the browser
   * @param msg - msg
   */
  private log(msg: string) {
    console.warn(msg);
  }
}
