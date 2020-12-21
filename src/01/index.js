import { createMachine } from "xstate";

const elBox = document.querySelector('#box');

const machine = {
  initial: 'inactive',
  states: {
    inactive: {
      on: {
        CLICK: 'active'
      }
    },
    active: {
      on: {
        CLICK: 'inactive'
      }
    }
  }
}

// Pure function that returns the next state,
// given the current state and sent event
function transition(state, event) {
  return machine.states[state].on[event] || state;
}

// Keep track of your current state
let currentState = machine.initial;

function send(event) {
  currentState = transition(currentState, event)
  elBox.dataset.state = currentState;
}

send()
elBox.addEventListener('click', () => {
  send("CLICK")
});
