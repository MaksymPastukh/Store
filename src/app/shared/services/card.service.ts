import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, Subject, tap} from "rxjs";
import {CardProductType} from "../../../types/card-product.type";
import {environment} from "../../../environments/environment";
import {DefaultResponseType} from "../../../types/default-response.type";
import {CardServiceType} from "../../../types/card-service.type";

@Injectable({
  providedIn: 'root'
})
export class CardService {

  private count: number = 0
  count$: Subject<number> = new Subject<number>()


  constructor(private http: HttpClient) {
    console.log(this.count$)
  }

  setCount(count: number) {
    this.count = count
    this.count$.next(count)
  }

  // {withCredentials: true} - Этот флаг нужно устанавливать при всех запросах которые работают сессиями
  getCard(): Observable<CardProductType | DefaultResponseType> {
    return this.http.get<CardProductType | DefaultResponseType>(environment.api + 'cart', {withCredentials: true})
  }

  getCardCount(): Observable<CardServiceType | DefaultResponseType> {
    return this.http.get<CardServiceType | DefaultResponseType>(environment.api + 'cart/count', {withCredentials: true})
      .pipe(
        tap(data => {
          if (!data.hasOwnProperty('error')) {
            this.setCount((data as CardServiceType).count)
          }
        })
      )

  }

  updateCard(productId: string, quantity: number): Observable<CardProductType | DefaultResponseType> {
    return this.http.post<CardProductType | DefaultResponseType>(environment.api + 'cart', {
      productId,
      quantity
    }, {withCredentials: true})
      .pipe(
        tap((data: CardProductType | DefaultResponseType) => {
          let count: number = 0
          if (!data.hasOwnProperty('error')) {

            (data as CardProductType).items.forEach((item) => {
              count += item.quantity
            })

            this.setCount(count)
          }
        })
      )
  }
}
