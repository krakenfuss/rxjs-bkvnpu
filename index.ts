import { fromEvent, merge, zip,of } from 'rxjs'; 
import {  map, throttleTime, mapTo, buffer, mergeAll, filter, mergeMap, debounceTime, switchMap, takeUntil, tap} from 'rxjs/operators';

const move = fromEvent(document, 'mousemove').pipe(
  mapTo('M'),
  tap(console.log)
);

const mouseDown = fromEvent(document, 'mousedown');
const mouseUp = fromEvent(document, 'mouseup');

const click = zip(mouseDown, mouseUp).pipe(mapTo('C')); 

//const click = fromEvent(document, 'click').pipe(
//  mapTo('C'),
//);


//const drag = mouseDown.pipe(
//    mergeMap(_ => move.pipe(
//       mapTo('DR'),
//      takeUntil(mouseUp),
//    )
//  ) 
//)

const drag = mouseDown.pipe(
	map(md => move.pipe(
     mapTo('DR'),
     takeUntil(mouseUp),
  )),
  mergeAll()
);

const doubleClick = click.pipe(
	 buffer(click.pipe(debounceTime(250))),
  	 map(clicks => clicks.length),
     filter(x => x > 1),
     mapTo('D'),
);

merge(click, doubleClick, drag).subscribe(console.log);