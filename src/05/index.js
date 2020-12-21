import { createMachine, assign, interpret } from 'xstate';

const elBox = document.querySelector('#box');
const elBody = document.body;

const machine = createMachine({
  initial: 'idle',
  context: {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    px: 0,
    py: 0,
    drags: 0
  },
  states: {
    idle: {
      on: {
        mousedown: {
          actions: "assignStart",
          target: 'dragging',
          cond: 'dragIsAllowed'
        },
      },
    },
    dragging: {
      on: {
        mousemove: {
          actions: "assignDelta"
        },
        mouseup: {
          actions: "assignFinal",
          target: 'idle',
        },
        'keyup.escape': {
          target: 'idle',
          actions: "assignReset",
        },
      },
    },
  },
}, {
  actions: {
    "assignReset": assign({
      dx: 0,
      dy: 0,
      px: 0,
      py: 0,
    }),
    "assignStart": assign({
      px: (context, event) => event.clientX,
      py: (context, event) => event.clientY,
      drags: (context, event) => context.drags + 1
    }),
    "assignDelta": assign({
      dx: (context, event) => event.clientX - context.px,
      dy: (context, event) => event.clientY - context.py,
    }),
    "assignFinal": assign({
      x: (context, event) => context.x + context.dx,
      y: (context, event) => context.y + context.dy,
      dx: 0,
      dy: 0,
      px: 0,
      py: 0,
    })
  },
  guards: {
    "dragIsAllowed": (context, event) => context.drags < 3
  }
});

const service = interpret(machine);

service.onTransition((state) => {
  if (state.changed) {
    console.log(state.context);

    elBox.dataset.state = state.value;

    elBox.style.setProperty('--dx', state.context.dx);
    elBox.style.setProperty('--dy', state.context.dy);
    elBox.style.setProperty('--x', state.context.x);
    elBox.style.setProperty('--y', state.context.y);
  }
});

service.start();

// Add event listeners for:
// - mousedown on elBox
elBox.addEventListener('mousedown', service.send)
// - mousemove on elBody
elBody.addEventListener('mousemove', service.send)
// - mouseup on elBody
elBody.addEventListener('mouseup', service.send)

elBody.addEventListener('keyup', (e) => {
  if (e.key === 'Escape') {
    service.send('keyup.escape');
  }
});
