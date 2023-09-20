import { trigger, transition, style, animate } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app-conocenos',
  templateUrl: './conocenos.component.html',
  styleUrls: ['./conocenos.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'scale(0.6)',
        }),
        animate(500, style({
          opacity: 1,
          transform: 'scale(1)',
        })),
      ]),
      transition('* => void', [
        animate(500, style({
          opacity: 0,
          transform: 'scale(0.6)'
        }))
      ])
    ])
  ]
})
export class ConocenosComponent {
  
}
