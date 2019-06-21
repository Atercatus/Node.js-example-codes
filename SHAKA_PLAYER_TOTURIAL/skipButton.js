// skipButton.js

const myapp = document.getElementById("asd");

// Use shaka.ui.Element as a base class
myapp.SkipButton = class extends shaka.ui.Element {
  constructor(parent, controls) {
    super(parent, controls);

    // The actual button that will be displayed
    this.button_ = document.createElement("button");
    this.button_.textContent = "Skip current video";
    this.parent.appendChild(this.button_);

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

// This will add three buttons to the controls panel (in that order): shaka-provided
// rewind and fast forward button and out custom skip button, referenced by the name
// we used when registering the factory with the controls.
// uiConfig['controlPanelElements'] = ['rewind', 'fast_forward', 'skip'];
