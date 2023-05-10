import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Subject, Subscription, debounceTime } from 'rxjs';
@Component({
  selector: 'shared-search-box',
  templateUrl: './search-box.component.html',
  styles: [],
})
export class SearchBoxComponent implements OnInit, OnDestroy {
  //Subject es apra crear un Observable personalizados que creamos nosotros mismos para pdoer acceder a emtodos de rxjs
  private debouncer: Subject<string> = new Subject<string>();
  private debouncerSuscription?: Subscription;

  @Input()
  public placeholder: string = '';

  @Input()
  public initialValue: string = '';

  @Output()
  public onValue = new EventEmitter<string>();

  @Output()
  public onDebounce = new EventEmitter<string>();

  //metodo debounce time esperara 400 milisegunods para mostrar el valor del input
  ngOnInit(): void {
    this.debouncerSuscription = this.debouncer.subscribe();
    this.debouncer.pipe(debounceTime(400)).subscribe((value) => {
      this.onDebounce.emit(value);
    });
  }

  ngOnDestroy(): void {
    //console.log('Destruido el componente');
    //Desuscribirte del componente para que deje de escuchar cuando el componente sea destruido, de lo contrario seguira escuchando al observable siempre
    this.debouncerSuscription?.unsubscribe();
  }

  emitValue(value: string): void {
    this.onValue.emit(value);
  }

  onKeyPress(searchTerm: string) {
    this.debouncer.next(searchTerm);
  }
}
