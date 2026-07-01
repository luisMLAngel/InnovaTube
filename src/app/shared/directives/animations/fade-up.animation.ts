import { trigger, transition, style, animate } from '@angular/animations';

export const fadeUp = trigger('fadeUp', [
  transition(':enter', [
    style({
      opacity: 0,
      transform: 'translateY(20px) scale(0.98)',
    }),
    animate(
      '2000ms cubic-bezier(0.22, 1, 0.36, 1)',
      style({
        opacity: 1,
        transform: 'translateY(0) scale(1)',
      }),
    ),
  ]),
]);
