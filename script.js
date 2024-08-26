document.getElementById("submit").addEventListener("click", function () {
  const numberOfFloor = parseInt(document.getElementById("floor").value);
  const numberOfLift = parseInt(document.getElementById("lift").value);
  const building = document.getElementById("building");

  if (numberOfFloor > 0 && numberOfLift > 0) {
    document.getElementById("nextSection").classList.remove("hidden");

    // Clear previous building content
    building.innerHTML = "";

    // Create floors
    for (let i = numberOfFloor; i > 0; i--) {
      const floorDiv = document.createElement("div");
      floorDiv.className = "floor";

      const floorNumber = document.createElement("div");
      floorNumber.className = "floor-number";
      floorNumber.innerHTML = `Floor ${i}`;
      floorDiv.appendChild(floorNumber);

      if (i < numberOfFloor) {
        const up = document.createElement("button");
        up.className = "upButton";
        up.id = "upButton" + i;
        up.textContent = "Up";
        floorDiv.appendChild(up);
      }

      if (i > 1) {
        const down = document.createElement("button");
        down.className = "downButton";
        down.id = "downButton" + i;
        down.textContent = "Down";
        floorDiv.appendChild(down);
      }

      // Add lifts to ground floor
      if (i === 1) {
        const liftsContainer = document.createElement("div");
        liftsContainer.className = "lifts-container";

        for (let j = 1; j <= numberOfLift; j++) {
          const liftDiv = document.createElement("div");
          liftDiv.className = "lift";
          liftDiv.id = "lift" + j;
          liftDiv.dataset.currentFloor = 1; // Initial floor for lifts
          // console.log(liftDiv.dataset);
          liftsContainer.appendChild(liftDiv);
        }

        floorDiv.appendChild(liftsContainer);
      }

      building.appendChild(floorDiv);
    }

    document.querySelectorAll(".upButton, .downButton").forEach((button) => {
      button.addEventListener("click", handleButtonClick);
    });
  } else {
    alert("Enter both fields with valid numbers");
  }
});

function handleButtonClick(event) {
  const button = event.target;
  const targetFloor = parseInt(button.id.replace(/\D/g, ""));
  const direction = button.className.includes("upButton") ? 1 : -1;
  const lifts = Array.from(document.querySelectorAll(".lift"));

  let nearestLift = null;
  let minDistance = Infinity;

  lifts.forEach((lift) => {
    const liftFloor = parseInt(lift.dataset.currentFloor);
    const distance = Math.abs(liftFloor - targetFloor);
    if (distance < minDistance) {
      minDistance = distance;
      nearestLift = lift;
    }
  });

  if (nearestLift) {
    const liftCurrentFloor = parseInt(nearestLift.dataset.currentFloor);
    const distanceToTarget = Math.abs(liftCurrentFloor - targetFloor);
    nearestLift.dataset.currentFloor = targetFloor; // Update lift's current floor

    // Open doors if already on the target floor
    if (liftCurrentFloor === targetFloor) {
      nearestLift.classList.add("open");
      setTimeout(() => {
        nearestLift.classList.remove("open");
      }, 2500); // Duration of doors open
      return;
    }

    // Animate lift movement
    nearestLift.style.transition = `transform ${distanceToTarget * 2}s linear`;
    nearestLift.style.transform = `translateY(-${(targetFloor - 1) * 120}px)`; // Adjust translation to fit within the floor

    // Open doors once lift reaches target floor
    setTimeout(() => {
      nearestLift.classList.add("open");
      setTimeout(() => {
        nearestLift.classList.remove("open");
      }, 2500); // Duration of doors open
    }, distanceToTarget * 2000); // Time for the lift to move
  }
}
