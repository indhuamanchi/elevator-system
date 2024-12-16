// DOM 

const currentFloorDisplay = document.getElementById('current-floor');
const directionDisplay = document.getElementById('direction');
const queueDisplay = document.getElementById('queue');
const doorStatusDisplay = document.getElementById('door-status');

const callButtons = document.querySelectorAll('.call-btn');
const floorButtons = document.querySelectorAll('.floor-btn');
const openDoorButton = document.getElementById('open-door');
const closeDoorButton = document.getElementById('close-door');

// elevator state

let currentFloor = 1;
let direction = 'up';
let queue = [];
let doorStatus = 'Closed';

// when button is clicked outside

callButtons.forEach(button => {
  button.addEventListener('click', () => {
    const floor = parseInt(button.dataset.floor);
    const dir = button.dataset.direction;
    addToQueue(floor,dir);
  });
});

// when button is clicked from inside

floorButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    addToQueue(index + 1,'inside');
  });
});

// Add event listeners to door control buttons
openDoorButton.addEventListener('click', openDoor);
closeDoorButton.addEventListener('click', closeDoor);



//let direction = 'up'; // Initial direction

function addToQueue(floor, dir) {
  if (!queue.includes(floor) && floor !== currentFloor) {
    queue.push({ floor, dir });
    queue.sort((a, b) => (direction === 'up' ? a.floor - b.floor : b.floor - a.floor)); // Sort based on direction
    updateDisplay();
    processQueue();
  }
}

function processQueue() {
  if (queue.length === 0) {
    direction = 'idle'; // Reset direction if the queue is empty
    updateDisplay();
    return;
  }

  const nextRequest = queue.find(req => (direction === 'up' ? req.floor > currentFloor : req.floor < currentFloor));

  if (!nextRequest) {
    // If no requests in the current direction, reverse direction
    direction = direction === 'up' ? 'down' : 'up';
    queue.sort((a, b) => (direction === 'up' ? a.floor - b.floor : b.floor - a.floor)); // Re-sort based on new direction
    processQueue();
    return;
  }

  moveToFloor(nextRequest.floor);
}

function moveToFloor(floor) {
  if (currentFloor === floor) return; // No movement if already at the requested floor

  const floorsToTravel = Math.abs(floor - currentFloor); // Number of floors to travel
  const travelTime = floorsToTravel * 5000; // 5 seconds per floor

  console.log(`Moving to Floor ${floor}...`);
  direction = floor > currentFloor ? 'up' : 'down';
  updateDisplay();

  setTimeout(() => {
    currentFloor = floor;
    console.log(`Arrived at Floor ${floor}`);
    queue = queue.filter(req => req.floor !== floor); // Remove the floor from the queue
    updateDisplay();

    setTimeout(() => {
      openDoor();
      setTimeout(() => {
        closeDoor();
        processQueue(); // Process the next request
      }, 5000); // Door remains open for 5 seconds
    }, 1000); // Delay before opening door
  }, travelTime); // Total time to move between floors
}

function openDoor() {
  doorStatus = 'Open';
  updateDisplay();
}

// Close the elevator door
function closeDoor() {
  doorStatus = 'Closed';
  updateDisplay();
}

// Update the display board
function updateDisplay() {
  currentFloorDisplay.textContent = currentFloor;
  directionDisplay.textContent = direction;
  //queueDisplay.textContent = queue.length > 0 ? queue.join(', ') : 'None';
  doorStatusDisplay.textContent = doorStatus;
}