// The difference sets: one entry per difference, in panel-local coordinates (560 x 440).
// The scene draw functions in scenes.js place each element exactly at its listed spot, so
// a click inside the circle always lands on the thing it names. `label` is the friendly
// name shown in the "found it" toast.
export const LEVELS = [
  {
    id: 'warung',
    name: 'Warung Kopi Pagi',
    subtitle: 'Morning at the coffee stall',
    time: 150,
    differences: [
      { id: 'sun', x: 492, y: 52, r: 34, label: 'the morning sun' },
      { id: 'sign', x: 128, y: 148, r: 30, label: 'the stall sign' },
      { id: 'cat', x: 472, y: 372, r: 36, label: 'the sleeping cat' },
      { id: 'cup', x: 232, y: 292, r: 26, label: 'the coffee cup' },
      { id: 'krupuk', x: 382, y: 258, r: 28, label: 'the cracker jar' },
      { id: 'lamp', x: 300, y: 118, r: 24, label: 'the hanging lamp' },
      { id: 'basket', x: 100, y: 386, r: 28, label: 'the bread basket' },
    ],
  },
  {
    id: 'pasar',
    name: 'Pasar Pagi',
    subtitle: 'The morning market',
    time: 120,
    differences: [
      { id: 'hat', x: 282, y: 118, r: 30, label: "the vendor's hat" },
      { id: 'bananas', x: 88, y: 152, r: 28, label: 'the hanging bananas' },
      { id: 'oranges', x: 150, y: 302, r: 30, label: 'the orange basket' },
      { id: 'price', x: 418, y: 252, r: 24, label: 'the price sign' },
      { id: 'rooster', x: 498, y: 382, r: 30, label: 'the rooster' },
      { id: 'cat', x: 62, y: 382, r: 28, label: 'the market cat' },
      { id: 'bird', x: 470, y: 58, r: 22, label: 'the bird on the roof' },
      { id: 'scale', x: 330, y: 292, r: 24, label: 'the weighing scale' },
      { id: 'chilies', x: 238, y: 322, r: 26, label: 'the chili basket' },
      { id: 'umbrella', x: 200, y: 62, r: 30, label: 'the stall umbrella' },
    ],
  },
  {
    id: 'teras',
    name: 'Sarapan di Teras',
    subtitle: 'Breakfast on the terrace',
    time: 100,
    differences: [
      { id: 'clock', x: 88, y: 82, r: 26, label: 'the wall clock' },
      { id: 'picture', x: 470, y: 92, r: 28, label: 'the wall picture' },
      { id: 'teapot', x: 180, y: 218, r: 22, label: 'the teapot lid' },
      { id: 'steam', x: 300, y: 200, r: 24, label: 'the steaming cup' },
      { id: 'toast', x: 255, y: 300, r: 24, label: 'the jam on the toast' },
      { id: 'eggs', x: 350, y: 305, r: 24, label: 'the boiled eggs' },
      { id: 'paper', x: 420, y: 320, r: 26, label: 'the newspaper' },
      { id: 'flowers', x: 120, y: 300, r: 24, label: 'the flower vase' },
      { id: 'cat', x: 500, y: 400, r: 26, label: "the cat's tail" },
      { id: 'spoon', x: 215, y: 340, r: 20, label: 'the spoon' },
      { id: 'sugar', x: 390, y: 270, r: 20, label: 'the sugar cubes' },
      { id: 'curtain', x: 280, y: 60, r: 28, label: 'the window curtain' },
    ],
  },
];
