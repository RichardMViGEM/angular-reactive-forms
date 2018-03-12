export class Hero {
    id = 0;
    name = '';
    addresses: Address[];
    automotives: Automotive[];
  }
  
  export class Address {
    street = '';
    city   = '';
    state  = '';
    zip    = '';
  }

  export class Automotive {
      type:string   = '';
      label:string  = '';
      year: number;
      works: boolean;
  }
  
  export const heroes: Hero[] = [
    {
      id: 1,
      name: 'Whirlwind',
      addresses: [
        {street: '123 Main',  city: 'Anywhere', state: 'CA',  zip: '94801'},
        {street: '456 Maple', city: 'Somewhere', state: 'VA', zip: '23226'},
      ],
      automotives: [
          {type: 'helicopter', label: 'Fichtenelch', year: 1995, works: false },
          {type: 'plane', label: 'Superente 3000', year: 2008, works: true }
      ]
    },
    {
      id: 2,
      name: 'Bombastic',
      addresses: [
        {street: '789 Elm',  city: 'Smallville', state: 'OH',  zip: '04501'},
      ],
      automotives: []
    },
    {
      id: 3,
      name: 'Magneta',
      addresses: [ ],
      automotives: [
        {type: 'car', label: 'Bugatti Sauteuer', year: 2018, works: true }
      ]
    },
  ];
  
  export const STATES = ['CA', 'MD', 'OH', 'VA'];
  export const TYPES = ['car', 'motorcycle', 'helicopter', 'plane'];