import * as BW from "../../build/brilliantwear.module.js";

window.BW = BW;

/** @type {import("three")} */
const THREE = window.THREE;

// DEVICE HELPERS

/** @param {BW.Device} device */
const isDeviceRing = (device) => device.isRing;
const getRingDevice = () =>
  BW.DeviceManager.connectedDevices.find((device) => isDeviceRing(device));

/** @param {(device: BW.Device) => void} callback */
const onRingDeviceConnected = (callback) => {
  BW.DeviceManager.addEventListener("deviceConnected", (event) => {
    const { device } = event.message;
    if (isDeviceRing(device)) {
      callback(device);
    }
  });
};
/** @param {(device: BW.Device) => void} callback */
const onRingDeviceNotConnected = (callback) => {
  BW.DeviceManager.addEventListener("deviceNotConnected", (event) => {
    const { device } = event.message;
    if (isDeviceRing(device) && !getRingDevice()) {
      callback(device);
    }
  });
};
/** @param {(device: BW.Device, isConnected: boolean) => void} callback */
const onRingDeviceIsConnected = (callback) => {
  onRingDeviceConnected((device) => callback(device, true));
  onRingDeviceNotConnected((device) => callback(device, false));
};

// CONNECTION

/** @type {HTMLButtonElement} */
const addDeviceButton = document.getElementById("addDevice");
addDeviceButton.disabled = !(await BW.Device.CanConnect);
addDeviceButton.addEventListener("click", async () => {
  let device = getRingDevice();
  if (device) {
    addDeviceButton.disabled = true;
    addDeviceButton.innerText = "disconnecting";
    await device.disconnect();
    return;
  }

  addDeviceButton.disabled = true;
  addDeviceButton.innerText = "adding device...";
  device = await BW.Device.Connect();
  if (device) {
    if (!isDeviceRing(device)) {
      window.alert("device isn't a ring - disconnecting now");
      await device.disconnect();
    }
  } else {
    addDeviceButton.innerText = "add device";
  }
  addDeviceButton.disabled = false;
});

onRingDeviceIsConnected((device, isConnected) => {
  const hasDevice = Boolean(getRingDevice());
  addDeviceButton.innerText = hasDevice ? "disconnect" : "add device";
  addDeviceButton.disabled = false;
});

// A-FRAME
const scene = document.querySelector("a-scene");
const targetEntity = scene.querySelector(".target");
const targetPositionEntity = targetEntity.querySelector(".position");
const targetRotationEntity = targetEntity.querySelector(".rotation");
const touchpadEntity = targetEntity.querySelector(".touchpad");

/** @param {HTMLCanvasElement} canvas */
const getTexture = (canvas) => {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.center.set(0.5, 0.5);
  texture.rotation = -Math.PI / 2;
  return texture;
};
/** @param {import("three").CanvasTexture<HTMLCanvasElement>} texture */
const applyTouchpadTexture = (texture) => {
  const mesh = touchpadEntity.getObject3D("mesh");
  if (!mesh || !mesh.material) return;
  if (mesh.material.map !== texture) {
    mesh.material.map = texture;
    mesh.material.color.set("white");
    mesh.material.needsUpdate = true;
  }
  texture.needsUpdate = true;
};

/**
 * @param {BW.Vector3?} acceleration
 * @param {number?} timestamp
 */
const updateTargetPositionEntityPosition = (acceleration, timestamp) => {
  const { x, y, z } = acceleration ?? { x: 0, y: 0, z: 0 };
  targetPositionEntity.object3D.position.set(x, y, z).multiplyScalar(0.05);
};
/**
 * @param {BW.Euler?} orientation
 * @param {number?} timestamp
 */
const updateTargetRotationEntityEuler = (orientation, timestamp) => {
  const { pitch, heading, roll } = orientation ?? {
    pitch: 0,
    heading: 0,
    roll: 0,
  };
  targetPositionEntity.object3D.rotation.set(
    THREE.MathUtils.degToRad(pitch),
    THREE.MathUtils.degToRad(heading),
    THREE.MathUtils.degToRad(roll),
    "YXZ",
  );
};
/**
 * @param {BW.Quaternion} quaternion
 * @param {number?} timestamp
 */
const updateTargetRotationEntityQuaternion = (quaternion, timestamp) => {
  const { x, y, z, w } = quaternion;
  targetPositionEntity.object3D.quaternion.set(x, y, z, w);
};

// ORIENTATION
/** @type {HTMLSelectElement} */
const orientationSelect = document.getElementById("orientationSelect");
const orientationOptions = Array.from(
  orientationSelect.querySelectorAll("option"),
).filter((option) => option.value != "none");
orientationSelect.addEventListener("input", () => {
  const device = getRingDevice();
  const sensorType = orientationSelect.value;
  device.setSensorConfiguration({
    gameRotation: sensorType == "gameRotation" ? 20 : 0,
    gyroscope: sensorType == "gyroscope" ? 20 : 0,
    orientation: sensorType == "orientation" ? 20 : 0,
  });
});
onRingDeviceIsConnected((device, isConnected) => {
  if (isConnected) {
    orientationOptions.forEach((option) => {
      option.disabled = !device.hasSensorType(option.value);
    });
    device.addEventListener(
      "getSensorConfiguration",
      (event) => {
        updateTargetRotationEntityEuler();

        const option = orientationOptions.find((option) => {
          return device.sensorConfiguration[option.value] > 0;
        });
        orientationSelect.value = option?.value ?? "none";
      },
      device.connectionAbortSignalObject,
    );
  }
  orientationSelect.disabled = !isConnected;
});

// GAME ROTATION
/** @type {HTMLPreElement} */
const gameRotationDataPre = document.getElementById("gameRotationData");
onRingDeviceIsConnected((device, isConnected) => {
  if (isConnected) {
    device.addEventListener(
      "gameRotation",
      (event) => {
        const { gameRotation, timestamp } = event.message;
        gameRotationDataPre.textContent = JSON.stringify(
          { gameRotation, timestamp },
          null,
          2,
        );
        updateTargetRotationEntityQuaternion(gameRotation, timestamp);
      },
      device.connectionAbortSignalObject,
    );
  }
});

// ORIENTATION DATA
/** @type {HTMLPreElement} */
const orientationDataPre = document.getElementById("orientationData");
onRingDeviceIsConnected((device, isConnected) => {
  if (isConnected) {
    device.addEventListener(
      "orientation",
      (event) => {
        const { orientation, timestamp } = event.message;
        orientationDataPre.textContent = JSON.stringify(
          { orientation, timestamp },
          null,
          2,
        );
        updateTargetRotationEntityEuler(orientation, timestamp);
      },
      device.connectionAbortSignalObject,
    );
  }
});

// GYROSCOPE
/** @type {HTMLPreElement} */
const gyroscopeDataPre = document.getElementById("gyroscopeData");
onRingDeviceIsConnected((device, isConnected) => {
  if (isConnected) {
    device.addEventListener(
      "gyroscope",
      (event) => {
        const { gyroscope, timestamp } = event.message;
        gyroscopeDataPre.textContent = JSON.stringify(
          { gyroscope, timestamp },
          null,
          2,
        );
        const { x: pitch, y: heading, z: roll } = gyroscope;
        updateTargetRotationEntityEuler(
          {
            pitch,
            heading,
            roll,
          },
          timestamp,
        );
      },
      device.connectionAbortSignalObject,
    );
  }
});

// POSITION

/** @type {HTMLSelectElement} */
const positionSelect = document.getElementById("positionSelect");
const positionOptions = Array.from(
  positionSelect.querySelectorAll("option"),
).filter((option) => option.value != "none");
positionSelect.addEventListener("input", () => {
  const device = getRingDevice();
  const sensorType = positionSelect.value;
  device.setSensorConfiguration({
    linearAcceleration: sensorType == "linearAcceleration" ? 20 : 0,
    acceleration: sensorType == "acceleration" ? 20 : 0,
    gravity: sensorType == "gravity" ? 20 : 0,
  });
});
onRingDeviceIsConnected((device, isConnected) => {
  if (isConnected) {
    device.addEventListener(
      "getSensorConfiguration",
      () => {
        updateTargetPositionEntityPosition();
      },
      device.connectionAbortSignalObject,
    );

    positionOptions.forEach((option) => {
      option.disabled = !device.hasSensorType(option.value);
    });
    device.addEventListener(
      "getSensorConfiguration",
      (event) => {
        const option = positionOptions.find((option) => {
          return device.sensorConfiguration[option.value] > 0;
        });
        positionSelect.value = option?.value ?? "none";
      },
      device.connectionAbortSignalObject,
    );
  }
  positionSelect.disabled = !isConnected;
});

// ACCELERATION
/** @type {HTMLPreElement} */
const accelerationDataPre = document.getElementById("accelerationData");
onRingDeviceIsConnected((device, isConnected) => {
  if (isConnected) {
    device.addEventListener(
      "acceleration",
      (event) => {
        const { acceleration, timestamp } = event.message;
        accelerationDataPre.textContent = JSON.stringify(
          { acceleration, timestamp },
          null,
          2,
        );
        updateTargetPositionEntityPosition(acceleration, timestamp);
      },
      device.connectionAbortSignalObject,
    );
  }
});

// LINEAR ACCELERATION
/** @type {HTMLPreElement} */
const linearAccelerationDataPre = document.getElementById(
  "linearAccelerationData",
);
onRingDeviceIsConnected((device, isConnected) => {
  if (isConnected) {
    device.addEventListener(
      "linearAcceleration",
      (event) => {
        const { linearAcceleration, timestamp } = event.message;
        linearAccelerationDataPre.textContent = JSON.stringify(
          { linearAcceleration, timestamp },
          null,
          2,
        );
        updateTargetPositionEntityPosition(linearAcceleration, timestamp);
      },
      device.connectionAbortSignalObject,
    );
  }
});

// GRAVITY
/** @type {HTMLPreElement} */
const gravityDataPre = document.getElementById("gravityData");
onRingDeviceIsConnected((device, isConnected) => {
  if (isConnected) {
    device.addEventListener(
      "gravity",
      (event) => {
        const { gravity, timestamp } = event.message;
        gravityDataPre.textContent = JSON.stringify(
          { gravity, timestamp },
          null,
          2,
        );
        updateTargetPositionEntityPosition(gravity, timestamp);
      },
      device.connectionAbortSignalObject,
    );
  }
});

/**
 * @template {BW.SensorType} T
 * @param {object} options
 * @param {T} options.type
 * @param {string} options.buttonId
 * @param {string} options.dataId
 * @param {string} options.label
 * @param {(event: BW.DeviceEventMap[T]["message"]) => object} options.formatData
 */
function setupSensor({ type, buttonId, dataId, label, formatData }) {
  /** @type {HTMLButtonElement} */
  const button = document.getElementById(buttonId);

  /** @type {HTMLPreElement} */
  const dataPre = document.getElementById(dataId);

  const updateButton = () => {
    const device = getRingDevice();

    let enabled = false;
    let disabled = true;

    if (device?.isConnected) {
      enabled = device.sensorConfiguration[type] > 0;
      disabled = !device.hasSensorType(type);
    }

    button.innerText = `${enabled ? "disable" : "enable"} ${label}`;
    button.disabled = disabled;
  };

  button.addEventListener("click", () => {
    getRingDevice()?.toggleSensor(type, 20);
  });

  onRingDeviceIsConnected((device, isConnected) => {
    updateButton();

    if (!isConnected) return;

    device.addEventListener(
      "getSensorConfiguration",
      updateButton,
      device.connectionAbortSignalObject,
    );

    device.addEventListener(
      type,
      (event) => {
        dataPre.textContent = JSON.stringify(
          formatData(event.message),
          null,
          2,
        );
      },
      device.connectionAbortSignalObject,
    );
  });
}

/**
 * @param {BW.Device} device
 * @param {HTMLCanvasElement} canvas
 * @param {number?} aspectRatio
 * @param {import("three").CanvasTexture<HTMLCanvasElement>?} texture
 */
function setupCanvas(device, canvas, aspectRatio, texture) {
  const trackpadInformation = device.trackpadsInformation[0];
  const { width, height } = trackpadInformation.actualSize;
  aspectRatio = aspectRatio ?? width / height;
  canvas.width = canvas.height * aspectRatio;

  if (texture) {
    texture.dispose();
    texture.needsUpdate = true;
  }
}
/**
 *
 * @param {BW.Vector2} vector
 * @param {boolean} isMovement
 * @param {HTMLCanvasElement} canvas
 * @param {CanvasRenderingContext2D} context
 * @param {number} scalar
 */
function drawTrackpadCanvas(vector, isMovement, canvas, context, scalar = 1) {
  const { width, height } = canvas;
  context.clearRect(0, 0, width, height);

  let x, y;
  if (isMovement) {
    x = vector.x * scalar + 0.5;
    y = 1 - vector.y * scalar - 0.5;
  } else {
    x = vector.x;
    y = 1 - vector.y;
  }

  // crosshair
  context.strokeStyle = "white";
  context.lineWidth = 0.5;
  context.beginPath();
  context.moveTo(0.5 * width, 0);
  context.lineTo(0.5 * width, height);
  context.moveTo(0, 0.5 * height);
  context.lineTo(width, 0.5 * height);
  context.stroke();

  if (isMovement) {
    context.strokeStyle = "white";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(0.5 * width, 0.5 * height);
    context.lineTo(x * width, y * height);
    context.stroke();
  }

  const radius = 4;
  context.fillStyle = "red";
  context.beginPath();
  context.arc(x * width, y * height, radius, 0, 2 * Math.PI);
  context.fill();
}

// TAP DETECTOR
setupSensor({
  type: "tapDetector",
  buttonId: "toggleTapDetector",
  dataId: "tapDetectorData",
  label: "tap detector",
  formatData: ({ timestamp }) => ({ timestamp }),
});

// STEP DETECTOR
setupSensor({
  type: "stepDetector",
  buttonId: "toggleStepDetector",
  dataId: "stepDetectorData",
  label: "step detector",
  formatData: ({ timestamp }) => ({ timestamp }),
});

// STEP COUNTER
setupSensor({
  type: "stepCounter",
  buttonId: "toggleStepCounter",
  dataId: "stepCounterData",
  label: "step counter",
  formatData: ({ stepCounter, timestamp }) => ({
    stepCounter,
    timestamp,
  }),
});

// ACTIVITY
setupSensor({
  type: "activity",
  buttonId: "toggleActivity",
  dataId: "activityData",
  label: "activity recognition",
  formatData: ({ activity, timestamp }) => ({
    activity,
    timestamp,
  }),
});

// TRACKPAD TOUCH
setupSensor({
  type: "trackpadTouches",
  buttonId: "toggleTrackpadTouch",
  dataId: "trackpadTouchData",
  label: "trackpad touch",
  formatData: ({ trackpadTouches, timestamp }) => ({
    trackpadTouches,
    timestamp,
  }),
});

// TRACKPAD TOUCH POSITION
setupSensor({
  type: "trackpadTouchPositions",
  buttonId: "toggleTrackpadTouchPosition",
  dataId: "trackpadTouchPositionData",
  label: "trackpad touch position",
  formatData: ({ trackpadTouchPositions, timestamp }) => ({
    trackpadTouchPositions,
    timestamp,
  }),
});

/** @type {HTMLCanvasElement} */
const trackpadTouchPositionCanvas = document.getElementById(
  "trackpadTouchPosition",
);
const trackpadTouchPositionContext =
  trackpadTouchPositionCanvas.getContext("2d");
const trackpadTouchPositionTexture = getTexture(trackpadTouchPositionCanvas);
onRingDeviceConnected((device) => {
  setupCanvas(
    device,
    trackpadTouchPositionCanvas,
    undefined,
    trackpadTouchPositionTexture,
  );
  device.addEventListener(
    "trackpadTouchPosition",
    (event) => {
      const { position } = event.message;
      drawTrackpadCanvas(
        position,
        false,
        trackpadTouchPositionCanvas,
        trackpadTouchPositionContext,
      );
      applyTouchpadTexture(trackpadTouchPositionTexture);
    },
    device.connectionAbortSignalObject,
  );
});

// TRACKPAD TOUCH MOVEMENT
setupSensor({
  type: "trackpadTouchMovements",
  buttonId: "toggleTrackpadTouchMovement",
  dataId: "trackpadTouchMovementData",
  label: "trackpad touch movement",
  formatData: ({ trackpadTouchMovements, timestamp }) => ({
    trackpadTouchMovements,
    timestamp,
  }),
});

/** @type {HTMLCanvasElement} */
const trackpadTouchMovementCanvas = document.getElementById(
  "trackpadTouchMovement",
);
const trackpadTouchMovementContext =
  trackpadTouchMovementCanvas.getContext("2d");
onRingDeviceConnected((device) => {
  setupCanvas(device, trackpadTouchMovementCanvas);
  device.addEventListener(
    "trackpadTouchMovement",
    (event) => {
      const { delta } = event.message;
      drawTrackpadCanvas(
        delta,
        true,
        trackpadTouchMovementCanvas,
        trackpadTouchMovementContext,
        2,
      );
    },
    device.connectionAbortSignalObject,
  );
});

// TRACKPAD TOUCH STRENGTH
setupSensor({
  type: "trackpadTouchStrengths",
  buttonId: "toggleTrackpadTouchStrength",
  dataId: "trackpadTouchStrengthData",
  label: "trackpad touch strength",
  formatData: ({ trackpadTouchStrengths, timestamp }) => ({
    trackpadTouchStrengths,
    timestamp,
  }),
});

// TRACKPAD TOUCH AREA
setupSensor({
  type: "trackpadTouchAreas",
  buttonId: "toggleTrackpadTouchArea",
  dataId: "trackpadTouchAreaData",
  label: "trackpad touch area",
  formatData: ({ trackpadTouchAreas, timestamp }) => ({
    trackpadTouchAreas,
    timestamp,
  }),
});

// TRACKPAD GESTURE
setupSensor({
  type: "trackpadGestures",
  buttonId: "toggleTrackpadGesture",
  dataId: "trackpadGestureData",
  label: "trackpad gesture",
  formatData: ({ trackpadGestures, timestamp }) => ({
    trackpadGestures,
    timestamp,
  }),
});

/** @type {HTMLCanvasElement} */
const trackpadGestureCanvas = document.getElementById("trackpadGesture");
const trackpadGestureContext = trackpadGestureCanvas.getContext("2d");
onRingDeviceConnected((device) => {
  setupCanvas(device, trackpadGestureCanvas);
  device.addEventListener(
    "trackpadGesture",
    (event) => {
      const { message } = event;
      if (message.position) {
        drawTrackpadCanvas(
          message.position,
          false,
          trackpadGestureCanvas,
          trackpadGestureContext,
        );
      } else {
        drawTrackpadCanvas(
          message.delta,
          true,
          trackpadGestureCanvas,
          trackpadGestureContext,
        );
      }
    },
    device.connectionAbortSignalObject,
  );
});

// TRACKPAD BITMAP
setupSensor({
  type: "trackpadBitmaps",
  buttonId: "toggleTrackpadBitmap",
  dataId: "trackpadBitmapData",
  label: "trackpad bitmap",
  formatData: ({ trackpadBitmaps, timestamp }) => ({
    trackpadBitmaps,
    timestamp,
  }),
});
/** @type {HTMLCanvasElement} */
const trackpadBitmapCanvas = document.getElementById("trackpadBitmap");
const trackpadBitmapContext = trackpadBitmapCanvas.getContext("2d");
const trackpadBitmapTexture = getTexture(trackpadBitmapCanvas);

onRingDeviceConnected((device) => {
  setupCanvas(device, trackpadBitmapCanvas, undefined, trackpadBitmapTexture);
  device.addEventListener(
    "trackpadBitmap",
    (event) => {
      const { bitmap } = event.message;
      const { width, height } = trackpadBitmapCanvas;
      trackpadBitmapContext.clearRect(0, 0, width, height);
      trackpadBitmapContext.fillStyle = "red";
      const cellWidth = width / bitmap.width;
      const cellHeight = height / bitmap.height;

      bitmap.rows.forEach((row, rowIndex) => {
        row.forEach((value, columnIndex) => {
          if (value) {
            const x = columnIndex * cellWidth;
            const y = rowIndex * cellHeight;
            trackpadBitmapContext.fillRect(x, y, cellWidth, cellHeight);
          }
        });
      });
      applyTouchpadTexture(trackpadBitmapTexture);
    },
    device.connectionAbortSignalObject,
  );
});

// MICROPHONE

const toggleMicrophoneRecordingButton = document.getElementById(
  "toggleMicrophoneRecording",
);
const toggleMicrophoneRecordingOnTouchCheckbox = document.getElementById(
  "toggleMicrophoneRecordingOnTouch",
);
/** @type {HTMLAudioElement} */
const microphoneRecordingAudio = document.getElementById("microphoneRecording");

toggleMicrophoneRecordingButton.addEventListener("click", () => {
  const device = getRingDevice();
  if (!device) {
    return;
  }
  device.toggleMicrophone();
});
onRingDeviceIsConnected((device, isConnected) => {
  toggleMicrophoneRecordingButton.disabled = !isConnected;
  if (isConnected) {
    device.setMicrophoneConfiguration({ sampleRate: "16000", bitDepth: "8" });
    device.addEventListener(
      "microphoneRecording",
      (event) => {
        if (microphoneRecordingAudio.src) {
          URL.revokeObjectURL(microphoneRecordingAudio.src);
        }
        microphoneRecordingAudio.src = event.message.url;
      },
      device.connectionAbortSignalObject,
    );
    device.addEventListener(
      "isRecordingMicrophone",
      (event) => {
        toggleMicrophoneRecordingButton.innerText = device.isRecordingMicrophone
          ? "stop recording microphone"
          : "record microphone";
      },
      device.connectionAbortSignalObject,
    );
    device.addEventListener(
      "trackpadTouch",
      async (event) => {
        if (!toggleMicrophoneRecordingOnTouchCheckbox.checked) {
          return;
        }
        if (event.message.isDown) {
          await device.startMicrophone();
        } else {
          await device.stopMicrophone();
        }
      },
      device.connectionAbortSignalObject,
    );
    device.addEventListener(
      "microphoneStatus",
      async (event) => {
        if (device.microphoneStatus == "streaming") {
          device.startRecordingMicrophone();
        } else {
          device.stopRecordingMicrophone();
        }
      },
      device.connectionAbortSignalObject,
    );
  }
});

const micEntity = targetEntity.querySelector(".mic");
onRingDeviceConnected((device) => {
  device.addEventListener(
    "microphoneStatus",
    (event) => {
      micEntity.setAttribute(
        "color",
        device.microphoneStatus == "streaming" ? "red" : "black",
      );
    },
    device.connectionAbortSignalObject,
  );
});
