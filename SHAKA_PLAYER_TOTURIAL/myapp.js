"use strict";

// myapp.js
var manifestUri =
  "https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd";

function initApp() {
  // Debug logs, when the default of INFO isn't enough:
  // shaka.log.setLevel(shaka.log.Level.DEBUG);
  // // Verbose logs, which can generate a lot of output:
  // shaka.log.setLevel(shaka.log.Level.V1);
  // // Verbose 2, which is extremely noisy:
  // shaka.log.setLevel(shaka.log.Level.V2);

  // Install built-in polyfills to patch browser incompatibilities.
  shaka.polyfill.installAll();

  // Check to see if the browser supports the basic APIs Shaka needs.
  if (shaka.Player.isBrowserSupported()) {
    // Everything looks good!
    initPlayer();
  } else {
    // This browser does not have the minimum set of APIs we need.
    console.error("Browser not supported!");
  }
}

async function initPlayer() {
  // // Create a Player instance.
  // var video = document.getElementById("video");
  // var player = new shaka.Player(video);

  // ///////////////////////////////
  // // Configuration
  // player.configure({
  //   retryParameters: {
  //     timeout: 0, // timeout in ms, after which we abort; 0 means never
  //     maxAttempts: 2, // the maximum number of requests before we fail
  //     baseDelay: 1000, // the base delay in ms between retries
  //     backoffFactor: 2, // the multiplicative backoff factor between retries
  //     fuzzFactor: 0.5 // the fuzz factor to apply to each retry delay
  //   },
  //   streaming: {
  //     bufferingGoal: 40,
  //     rebufferingGoal: 25,
  //     bufferBehind: 20
  //   }
  // });
  // console.log(player.getConfiguration());

  // // Attach player to the window to make it easy to access in the JS console.
  // window.player = player;

  ///////////////////////////////
  // UI Conf
  const video = document.getElementById("video");
  const ui = video["ui"];
  const controls = ui.getControls();
  const player = controls.getPlayer();
  const config = {
    retryParameters: {
      timeout: 0, // timeout in ms, after which we abort; 0 means never
      maxAttempts: 2, // the maximum number of requests before we fail
      baseDelay: 1000, // the base delay in ms between retries
      backoffFactor: 2, // the multiplicative backoff factor between retries
      fuzzFactor: 0.5 // the fuzz factor to apply to each retry delay
    },
    streaming: {
      bufferingGoal: 40,
      rebufferingGoal: 25,
      bufferBehind: 20
    }
  };
  const uiConfig = {
    addSeekBar: true,
    controlPanelElements: [
      "fast_forward",
      "spacer",
      "rewind",
      "overflow_menu",
      "skip"
    ],
    overflowMenuButtons: ["captions", "cast", "picture_in_picture", "skip"]
  };

  const myapp = {};
  // Use shaka.ui.Element as a base class
  myapp.SkipButton = class extends shaka.ui.Element {
    constructor(parent, controls) {
      super(parent, controls);

      // The actual button that will be displayed
      this.button_ = document.createElement("button");
      this.button_.textContent = "Skip current video";
      this.parent.appendChild(this.button_);
      console.log(this.parent);

      // Listen for clicks on the button to start the next playback
      // this.eventManager.listen(this.button_, "click", () => {
      //   let nextManifest /* Your logic to pick the next video to be played */ = myapp.getNextManifest();

      //   // shaka.ui.Element gives us access to the player object as member of the class
      //   this.player.load(nextManifest);
      // });
    }
  };

  // Factory that will create a button at run time.
  myapp.SkipButton.Factory = class {
    create(rootElement, controls) {
      return new myapp.SkipButton(rootElement, controls);
    }
  };

  // Register our factory with the controls, so controls can create button instances.
  shaka.ui.Controls.registerElement(
    /* This name will serve as a reference to the button in the UI configuration object */ "skip",
    new myapp.SkipButton.Factory()
  );

  // Configuration
  player.configure(config);
  ui.configure(uiConfig);
  console.log(player.getConfiguration());

  // Listen for error events.
  player.addEventListener("error", onErrorEvent);
  controls.addEventListener("error", onErrorEvent);
  controls.addEventListener("caststatuschanged", onCastStatusChanged);

  // Try to load a manifest.
  // This is an asynchronous process.
  try {
    await player.load(manifestUri);
    console.log("The video has now been loaded!");
  } catch (err) {
    onError(err);
  }
}

function onCastStatusChanged(event) {
  const newCastStatus = event["newStatus"];
  // Handle cast status change
  console.log("The new cast status is: " + newCastStatus);
}

function onErrorEvent(event) {
  // Extract the shaka.util.Error object from the event.
  onError(event.detail);
}

function onError(error) {
  // Log the error.
  console.error("Error code", error.code, "object", error);
}

function initFailed() {
  // Handle the failure to load
  console.error("Unable to load the UI library!");
}

// document.addEventListener("DOMContentLoaded", initApp);

// Listen to the custom shaka-ui-loaded event, to wait until the UI is loaded
document.addEventListener("shaka-ui-loaded", initApp);
// Listen to the custom shaka-ui-load-failed event, in case Shaka Player fails
// to load (e.g. due to lack of browser support).
document.addEventListener("shaka-ui-load-failded", initFailed);
