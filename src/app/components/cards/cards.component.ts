import { trigger, transition, style, animate } from '@angular/animations';
import { Component, Input } from '@angular/core';
import { Casa } from 'src/app/services/casas.service';


@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css'],
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
export class CardsComponent {
  @Input() casas: Casa[] = [];
}
