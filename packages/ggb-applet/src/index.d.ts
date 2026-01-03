/**
 * GeoGebra Apps API Type Declarations
 * @see https://geogebra.github.io/docs/reference/en/GeoGebra_Apps_API/
 */

// ============================================================================
// GeoGebra Applet API (returned by appletOnLoad)
// ============================================================================

/**
 * The main GeoGebra Applet API interface for interacting with GeoGebra apps.
 */
export interface GGBAppletAPI {
  // --------------------------------------------------------------------------
  // Creating Objects
  // --------------------------------------------------------------------------

  /**
   * Evaluates the given string just like it would be evaluated when entered into GeoGebra's input bar.
   * Note: you must use English command names.
   * @param cmdString - Command string to evaluate (multiple commands separated by \n)
   * @returns Whether command evaluation was successful
   * @since 3.0
   */
  evalCommand(cmdString: string): boolean;

  /**
   * Evaluates LaTeX string to a construction element.
   * Basic syntaxes like x^{2} or \frac are supported.
   * @param input - LaTeX string to evaluate
   * @returns Whether evaluation was successful
   * @since 5.0
   */
  evalLaTeX(input: string): boolean;

  /**
   * Like evalCommand(), but returns a comma-separated list of created object labels.
   * @param cmdString - Command string to evaluate
   * @returns Comma-separated list of labels (e.g., "A,B,C")
   * @since 5.0
   */
  evalCommandGetLabels(cmdString: string): string;

  /**
   * Passes the string to GeoGebra's CAS and returns the result.
   * @param string - CAS command string
   * @returns CAS result as string
   * @since 3.2
   */
  evalCommandCAS(string: string): string;

  /**
   * Inserts embedded element with specific type and URI (Notes app only).
   * @param type - Embed element type
   * @param uri - Embed element URI
   * @since 6.0
   */
  insertEmbed(type: string, uri: string): void;

  // --------------------------------------------------------------------------
  // Setting the State of Objects - General Methods
  // --------------------------------------------------------------------------

  /**
   * Deletes the object with the given name.
   * @param objName - Name of the object to delete
   * @since 2.7
   */
  deleteObject(objName: string): void;

  /**
   * Sets or unsets the "auxiliary object" status.
   * @param objName - Name of the object
   * @param flag - Whether the object is auxiliary
   * @since 5.0
   */
  setAuxiliary(objName: string, flag: boolean): void;

  /**
   * Sets the double value of the object.
   * For boolean objects, use 1 for true, any other value for false.
   * @param objName - Name of the object
   * @param value - Value to set
   * @since 3.2
   */
  setValue(objName: string, value: number): void;

  /**
   * Sets the text value of a text object.
   * @param objName - Name of the text object
   * @param value - Text value to set
   * @since 3.2
   */
  setTextValue(objName: string, value: string): void;

  /**
   * Sets the value of a list element at the specified position.
   * @param objName - Name of the list object
   * @param i - Index position (1-based)
   * @param value - Value to set
   * @since 5.0
   */
  setListValue(objName: string, i: number, value: number): void;

  /**
   * Sets the coordinates of a point, vector, line, or absolutely positioned object.
   * @param objName - Name of the object
   * @param x - X coordinate
   * @param y - Y coordinate
   * @param z - Z coordinate (optional, for 3D)
   * @since 3.0 (2D), 5.0 (3D)
   */
  setCoords(objName: string, x: number, y: number, z?: number): void;

  /**
   * Sets the caption of an object.
   * @param objName - Name of the object
   * @param caption - Caption text
   * @since 5.0
   */
  setCaption(objName: string, caption: string): void;

  /**
   * Sets the color of an object.
   * @param objName - Name of the object
   * @param red - Red component (0-255)
   * @param green - Green component (0-255)
   * @param blue - Blue component (0-255)
   * @since 2.7
   */
  setColor(objName: string, red: number, green: number, blue: number): void;

  /**
   * Shows or hides the object in the graphics window.
   * @param objName - Name of the object
   * @param visible - Whether the object should be visible
   * @since 2.7
   */
  setVisible(objName: string, visible: boolean): void;

  /**
   * Shows or hides the label of the object.
   * @param objName - Name of the object
   * @param visible - Whether the label should be visible
   * @since 3.0
   */
  setLabelVisible(objName: string, visible: boolean): void;

  /**
   * Sets the label style of an object.
   * @param objName - Name of the object
   * @param style - Label style (0=NAME, 1=NAME_VALUE, 2=VALUE, 3=CAPTION)
   * @since 3.0
   */
  setLabelStyle(objName: string, style: GGBLabelStyle): void;

  /**
   * Sets the "Fixed" and "Selection Allowed" state of an object.
   * @param objName - Name of the object
   * @param fixed - Whether the object is fixed
   * @param selectionAllowed - Whether selection is allowed
   * @since 3.0
   */
  setFixed(objName: string, fixed: boolean, selectionAllowed: boolean): void;

  /**
   * Turns the trace of an object on or off.
   * @param objName - Name of the object
   * @param flag - Whether trace is enabled
   * @since 3.0
   */
  setTrace(objName: string, flag: boolean): void;

  /**
   * Renames an object.
   * @param oldObjName - Current name of the object
   * @param newObjName - New name for the object
   * @returns Whether the rename was successful
   * @since 3.2
   */
  renameObject(oldObjName: string, newObjName: string): boolean;

  /**
   * Sets the layer of an object.
   * @param objName - Name of the object
   * @param layer - Layer number
   * @since 3.2
   */
  setLayer(objName: string, layer: number): void;

  /**
   * Shows or hides all objects in a layer.
   * @param layer - Layer number
   * @param visible - Whether the layer should be visible
   * @since 3.2
   */
  setLayerVisible(layer: number, visible: boolean): void;

  /**
   * Sets the line style of an object.
   * @param objName - Name of the object
   * @param style - Line style (0-4)
   * @since 3.2
   */
  setLineStyle(objName: string, style: number): void;

  /**
   * Sets the thickness of an object.
   * @param objName - Name of the object
   * @param thickness - Line thickness (1-13, -1 for default)
   * @since 3.2
   */
  setLineThickness(objName: string, thickness: number): void;

  /**
   * Sets the style of a point.
   * @param objName - Name of the point
   * @param style - Point style (-1=default, 0=filled circle, 1=cross, 2=circle, 3=plus, 4=filled diamond, 5=unfilled diamond, 6-9=triangles)
   * @since 3.2
   */
  setPointStyle(objName: string, style: GGBPointStyle): void;

  /**
   * Sets the size of a point.
   * @param objName - Name of the point
   * @param size - Point size (1-9)
   * @since 3.2
   */
  setPointSize(objName: string, size: number): void;

  /**
   * Sets the display style of an object.
   * @param objName - Name of the object
   * @param style - Display style ("parametric", "explicit", "implicit", "specific")
   * @since 5.0
   */
  setDisplayStyle(objName: string, style: GGBDisplayStyle): void;

  /**
   * Sets the filling of an object.
   * @param objName - Name of the object
   * @param filling - Filling value (0-1)
   * @since 3.2
   */
  setFilling(objName: string, filling: number): void;

  // --------------------------------------------------------------------------
  // Export Methods
  // --------------------------------------------------------------------------

  /**
   * Returns the active Graphics View as a base64-encoded PNG string.
   * @param exportScale - Scale factor for export
   * @param transparent - Whether background should be transparent
   * @param DPI - DPI setting (use undefined if not needed, as it's slow)
   * @returns Base64-encoded PNG string
   * @since 4.0
   */
  getPNGBase64(exportScale: number, transparent: boolean, DPI?: number): string;

  /**
   * Renders the active Graphics View as SVG.
   * @param filenameOrCallback - Filename to download or callback function
   * @since HTML5
   */
  exportSVG(filename: string): void;
  exportSVG(callback: (svg: string | null) => void): void;

  /**
   * Renders the active Graphics View as PDF.
   * @param scale - Scale factor
   * @param filenameOrCallback - Filename to download or callback function
   * @param sliderLabel - Optional slider label for animation
   * @since HTML5
   */
  exportPDF(scale: number, filename: string, sliderLabel?: string): void;
  exportPDF(scale: number, callback: (pdf: string) => void, sliderLabel?: string): void;

  /**
   * Gets screenshot of the whole applet as PNG (internal use).
   * @param callback - Callback receiving base64 encoded string
   * @since 5.0
   */
  getScreenshotBase64(callback: (base64: string) => void): void;

  /**
   * Writes a PNG image to file.
   * @param filename - Output filename
   * @param exportScale - Scale factor
   * @param transparent - Whether background should be transparent
   * @param DPI - DPI setting
   * @param copyToClipboard - Whether to copy to clipboard
   * @returns Whether the operation was successful
   * @since 5.0
   */
  writePNGtoFile(
    filename: string,
    exportScale: number,
    transparent: boolean,
    DPI: number,
    copyToClipboard: boolean
  ): boolean;

  // --------------------------------------------------------------------------
  // Getting Object State
  // --------------------------------------------------------------------------

  /**
   * Gets the double value of an object.
   * @param objName - Name of the object
   * @returns Value of the object (NaN if not numeric)
   * @since 3.2
   */
  getValue(objName: string): number;

  /**
   * Gets the list value at a specific index.
   * @param objName - Name of the list
   * @param index - Index position
   * @returns Value at the index
   * @since 5.0
   */
  getListValue(objName: string, index: number): number;

  /**
   * Gets the string representation of an object.
   * @param objName - Name of the object
   * @returns String representation
   * @since 3.2
   */
  getValueString(objName: string): string;

  /**
   * Gets the LaTeX representation of an object.
   * @param objName - Name of the object
   * @returns LaTeX string
   * @since 5.0
   */
  getLaTeXString(objName: string): string;

  /**
   * Gets the LaTeX representation of an object's definition.
   * @param objName - Name of the object
   * @returns LaTeX definition string
   * @since 5.0
   */
  getLaTeXBase64(objName: string, value: boolean): string;

  /**
   * Gets the command used to create an object.
   * @param objName - Name of the object
   * @returns Command string
   * @since 3.2
   */
  getCommandString(objName: string): string;

  /**
   * Gets the command string with localized command names.
   * @param objName - Name of the object
   * @returns Localized command string
   * @since 5.0
   */
  getCommandString(objName: string, localize: boolean): string;

  /**
   * Gets the definition string of an object.
   * @param objName - Name of the object
   * @returns Definition string
   * @since 3.2
   */
  getDefinitionString(objName: string): string;

  /**
   * Gets the definition string with optional localization.
   * @param objName - Name of the object
   * @param localize - Whether to localize
   * @returns Definition string
   * @since 5.0
   */
  getDefinitionString(objName: string, localize: boolean): string;

  /**
   * Gets the X coordinate of an object.
   * @param objName - Name of the object
   * @returns X coordinate
   * @since 3.2
   */
  getXcoord(objName: string): number;

  /**
   * Gets the Y coordinate of an object.
   * @param objName - Name of the object
   * @returns Y coordinate
   * @since 3.2
   */
  getYcoord(objName: string): number;

  /**
   * Gets the Z coordinate of an object.
   * @param objName - Name of the object
   * @returns Z coordinate
   * @since 5.0
   */
  getZcoord(objName: string): number;

  /**
   * Gets the color of an object as hex string.
   * @param objName - Name of the object
   * @returns Hex color string (e.g., "#FF0000")
   * @since 3.2
   */
  getColor(objName: string): string;

  /**
   * Gets the filling of an object.
   * @param objName - Name of the object
   * @returns Filling value (0-1)
   * @since 3.2
   */
  getFilling(objName: string): number;

  /**
   * Gets the line style of an object.
   * @param objName - Name of the object
   * @returns Line style (0-4)
   * @since 5.0
   */
  getLineStyle(objName: string): number;

  /**
   * Gets the line thickness of an object.
   * @param objName - Name of the object
   * @returns Line thickness
   * @since 5.0
   */
  getLineThickness(objName: string): number;

  /**
   * Gets the point style of a point.
   * @param objName - Name of the point
   * @returns Point style
   * @since 5.0
   */
  getPointStyle(objName: string): number;

  /**
   * Gets the point size of a point.
   * @param objName - Name of the point
   * @returns Point size
   * @since 5.0
   */
  getPointSize(objName: string): number;

  /**
   * Gets the caption of an object.
   * @param objName - Name of the object
   * @returns Caption string
   * @since 5.0
   */
  getCaption(objName: string): string;

  /**
   * Gets the caption with optional substitution.
   * @param objName - Name of the object
   * @param substitution - Whether to substitute
   * @returns Caption string
   * @since 5.0
   */
  getCaption(objName: string, substitution: boolean): string;

  /**
   * Gets the object type.
   * @param objName - Name of the object
   * @returns Type string (e.g., "point", "line", "circle")
   * @since 3.2
   */
  getObjectType(objName: string): string;

  /**
   * Checks if an object exists.
   * @param objName - Name of the object
   * @returns Whether the object exists
   * @since 3.2
   */
  exists(objName: string): boolean;

  /**
   * Checks if an object is defined.
   * @param objName - Name of the object
   * @returns Whether the object is defined
   * @since 4.0
   */
  isDefined(objName: string): boolean;

  /**
   * Checks if an object is visible.
   * @param objName - Name of the object
   * @returns Whether the object is visible
   * @since 3.2
   */
  isVisible(objName: string): boolean;

  /**
   * Gets all object names in the construction.
   * @returns Array of object names
   * @since 3.0
   */
  getAllObjectNames(): string[];

  /**
   * Gets all object names of a specific type.
   * @param type - Object type (e.g., "point", "line")
   * @returns Array of object names
   * @since 4.0
   */
  getAllObjectNames(type: string): string[];

  /**
   * Gets the number of objects in the construction.
   * @returns Number of objects
   * @since 3.0
   */
  getObjectNumber(): number;

  /**
   * Gets the object name at a specific position in the construction.
   * @param i - Index position
   * @returns Object name
   * @since 3.0
   */
  getObjectName(i: number): string;

  /**
   * Gets the layer of an object.
   * @param objName - Name of the object
   * @returns Layer number
   * @since 3.2
   */
  getLayer(objName: string): number;

  /**
   * Checks if an object is independent.
   * @param objName - Name of the object
   * @returns Whether the object is independent
   * @since 3.2
   */
  isIndependent(objName: string): boolean;

  /**
   * Checks if an object is moveable.
   * @param objName - Name of the object
   * @returns Whether the object is moveable
   * @since 3.2
   */
  isMoveable(objName: string): boolean;

  /**
   * Gets the construction protocol step for an object.
   * @param objName - Name of the object
   * @returns Step number
   * @since 5.0
   */
  getConstructionProtocolStep(objName: string): number;

  // --------------------------------------------------------------------------
  // Animation
  // --------------------------------------------------------------------------

  /**
   * Sets whether an object is animated.
   * @param objName - Name of the object
   * @param animate - Whether to animate
   * @since 3.2
   */
  setAnimating(objName: string, animate: boolean): void;

  /**
   * Sets the animation speed of an object.
   * @param objName - Name of the object
   * @param speed - Animation speed
   * @since 3.2
   */
  setAnimationSpeed(objName: string, speed: number): void;

  /**
   * Starts all animations.
   * @since 3.2
   */
  startAnimation(): void;

  /**
   * Stops all animations.
   * @since 3.2
   */
  stopAnimation(): void;

  /**
   * Checks if animations are running.
   * @returns Whether animations are running
   * @since 5.0
   */
  isAnimationRunning(): boolean;

  // --------------------------------------------------------------------------
  // Construction / UI State
  // --------------------------------------------------------------------------

  /**
   * Sets the current construction step.
   * @param step - Step number (0-indexed)
   * @since 5.0
   */
  setConstructionStep(step: number): void;

  /**
   * Goes to the previous construction step.
   * @since 5.0
   */
  previousConstructionStep(): void;

  /**
   * Goes to the next construction step.
   * @since 5.0
   */
  nextConstructionStep(): void;

  /**
   * Gets the current construction step.
   * @returns Current step number
   * @since 5.0
   */
  getConstructionSteps(): number;

  /**
   * Sets the current mode/tool.
   * @param mode - Mode number
   * @since 3.0
   */
  setMode(mode: number): void;

  /**
   * Gets the current mode/tool.
   * @returns Current mode number
   * @since 5.0
   */
  getMode(): number;

  /**
   * Opens a specific view.
   * @param viewId - View ID (1=Graphics, 2=Graphics2, 4=CAS, 8=Spreadsheet, etc.)
   * @since 5.0
   */
  openFile(base64: string): void;

  /**
   * Resets the construction.
   * @since 3.0
   */
  reset(): void;

  /**
   * Refreshes all views.
   * @since 3.0
   */
  refreshViews(): void;

  /**
   * Sets the coordinates system of the Graphics View.
   * @param xmin - Minimum x value
   * @param xmax - Maximum x value
   * @param ymin - Minimum y value
   * @param ymax - Maximum y value
   * @since 3.0
   */
  setCoordSystem(xmin: number, xmax: number, ymin: number, ymax: number): void;

  /**
   * Sets the axis ratio.
   * @param ratio - Axis ratio
   * @since 5.0
   */
  setAxisRatio(xScale: number, yScale: number): void;

  /**
   * Sets axis visibility.
   * @param viewNumber - View number
   * @param xAxis - Whether x-axis is visible
   * @param yAxis - Whether y-axis is visible
   * @since 3.2
   */
  setAxesVisible(viewNumber: number, xAxis: boolean, yAxis: boolean): void;
  setAxesVisible(xAxis: boolean, yAxis: boolean): void;

  /**
   * Sets grid visibility.
   * @param visible - Whether grid is visible
   * @since 3.0
   */
  setGridVisible(visible: boolean): void;
  setGridVisible(viewNumber: number, visible: boolean): void;

  /**
   * Gets the grid visibility status.
   * @returns Whether grid is visible
   * @since 5.0
   */
  getGridVisible(): boolean;
  getGridVisible(viewNumber: number): boolean;

  /**
   * Performs an undo action.
   * @since 3.2
   */
  undo(): void;

  /**
   * Performs a redo action.
   * @since 3.2
   */
  redo(): void;

  /**
   * Selects an object.
   * @param objName - Name of the object to select
   * @since 5.0
   */
  selectObject(objName: string): void;

  /**
   * Unselects all objects.
   * @since 5.0
   */
  unselectAll(): void;

  /**
   * Shows/hides algebra input.
   * @param visible - Whether algebra input should be visible
   * @since 5.0
   */
  showAlgebraInput(visible: boolean): void;

  /**
   * Shows/hides menu bar.
   * @param visible - Whether menu bar should be visible
   * @since 5.0
   */
  showMenuBar(visible: boolean): void;

  /**
   * Shows/hides toolbar.
   * @param visible - Whether toolbar should be visible
   * @since 5.0
   */
  showToolBar(visible: boolean): void;

  /**
   * Shows/hides reset icon.
   * @param visible - Whether reset icon should be visible
   * @since 5.0
   */
  showResetIcon(visible: boolean): void;

  /**
   * Enables/disables right click.
   * @param enabled - Whether right click is enabled
   * @since 5.0
   */
  enableRightClick(enabled: boolean): void;

  /**
   * Enables/disables label dragging.
   * @param enabled - Whether label dragging is enabled
   * @since 5.0
   */
  enableLabelDrags(enabled: boolean): void;

  /**
   * Enables/disables shift-drag zoom.
   * @param enabled - Whether shift-drag zoom is enabled
   * @since 5.0
   */
  enableShiftDragZoom(enabled: boolean): void;

  // --------------------------------------------------------------------------
  // Event Listeners
  // --------------------------------------------------------------------------

  /**
   * Registers an add listener.
   * @param listener - Callback function receiving object name
   * @since 3.0
   */
  registerAddListener(listener: (objName: string) => void): void;

  /**
   * Unregisters an add listener.
   * @param listener - Previously registered callback function
   * @since 3.0
   */
  unregisterAddListener(listener: (objName: string) => void): void;

  /**
   * Registers a remove listener.
   * @param listener - Callback function receiving object name
   * @since 3.0
   */
  registerRemoveListener(listener: (objName: string) => void): void;

  /**
   * Unregisters a remove listener.
   * @param listener - Previously registered callback function
   * @since 3.0
   */
  unregisterRemoveListener(listener: (objName: string) => void): void;

  /**
   * Registers an update listener.
   * @param listener - Callback function receiving object name
   * @since 3.0
   */
  registerUpdateListener(listener: (objName: string) => void): void;

  /**
   * Unregisters an update listener.
   * @param listener - Previously registered callback function
   * @since 3.0
   */
  unregisterUpdateListener(listener: (objName: string) => void): void;

  /**
   * Registers a rename listener.
   * @param listener - Callback function receiving old and new names
   * @since 3.2
   */
  registerRenameListener(listener: (oldName: string, newName: string) => void): void;

  /**
   * Unregisters a rename listener.
   * @param listener - Previously registered callback function
   * @since 3.2
   */
  unregisterRenameListener(listener: (oldName: string, newName: string) => void): void;

  /**
   * Registers a clear listener.
   * @param listener - Callback function
   * @since 3.0
   */
  registerClearListener(listener: () => void): void;

  /**
   * Unregisters a clear listener.
   * @param listener - Previously registered callback function
   * @since 3.0
   */
  unregisterClearListener(listener: () => void): void;

  /**
   * Registers an object update listener for a specific object.
   * @param objName - Name of the object to listen to
   * @param listener - Callback function
   * @since 3.0
   */
  registerObjectUpdateListener(objName: string, listener: () => void): void;

  /**
   * Unregisters an object update listener.
   * @param objName - Name of the object
   * @since 3.0
   */
  unregisterObjectUpdateListener(objName: string): void;

  /**
   * Registers an object click listener.
   * @param objName - Name of the object to listen to
   * @param listener - Callback function
   * @since 3.2
   */
  registerObjectClickListener(objName: string, listener: () => void): void;

  /**
   * Unregisters an object click listener.
   * @param objName - Name of the object
   * @since 3.2
   */
  unregisterObjectClickListener(objName: string): void;

  /**
   * Registers a click listener for all objects.
   * @param listener - Callback function receiving object name
   * @since 5.0
   */
  registerClickListener(listener: (objName: string) => void): void;

  /**
   * Unregisters a click listener.
   * @param listener - Previously registered callback function
   * @since 5.0
   */
  unregisterClickListener(listener: (objName: string) => void): void;

  /**
   * Registers a client listener for various events.
   * @param listener - Callback function receiving event object
   * @since 5.0
   */
  registerClientListener(listener: (event: GGBClientEvent) => void): void;

  /**
   * Unregisters a client listener.
   * @param listener - Previously registered callback function
   * @since 5.0
   */
  unregisterClientListener(listener: (event: GGBClientEvent) => void): void;

  /**
   * Registers a store undo listener.
   * @param listener - Callback function
   * @since 5.0
   */
  registerStoreUndoListener(listener: () => void): void;

  /**
   * Unregisters a store undo listener.
   * @param listener - Previously registered callback function
   * @since 5.0
   */
  unregisterStoreUndoListener(listener: () => void): void;

  // --------------------------------------------------------------------------
  // GeoGebra File Format
  // --------------------------------------------------------------------------

  /**
   * Evaluates XML string and changes the current construction.
   * Note: Construction is NOT cleared before evaluating.
   * @param xmlString - XML string to evaluate
   * @since 2.7
   */
  evalXML(xmlString: string): void;

  /**
   * Sets the construction from XML string (clears existing construction).
   * @param xmlString - XML string representing the construction
   * @since 2.7
   */
  setXML(xmlString: string): void;

  /**
   * Gets the current construction in GeoGebra's XML format.
   * @returns XML string
   * @since 2.7
   */
  getXML(): string;

  /**
   * Gets the XML string for a specific object.
   * @param objName - Name of the object
   * @returns XML string for the element
   * @since 3.2
   */
  getXML(objName: string): string;

  /**
   * Gets the XML string of the parent algorithm for a dependent object.
   * @param objName - Name of the object
   * @returns XML string of the algorithm (empty string for free objects)
   * @since 3.2
   */
  getAlgorithmXML(objName: string): string;

  /**
   * Gets the current construction as JSON including XML and images.
   * @returns JSON object
   * @since 5.0
   */
  getFileJSON(): GGBFileJSON;

  /**
   * Sets the construction from JSON (object or string).
   * @param content - JSON content
   * @since 5.0
   */
  setFileJSON(content: GGBFileJSON | string): void;

  /**
   * Gets the current construction as base64-encoded .ggb file.
   * @returns Base64 string
   */
  getBase64(): string;

  /**
   * Gets the current construction as base64-encoded .ggb file asynchronously.
   * @param callback - Callback receiving the base64 string
   * @since 4.2
   */
  getBase64(callback: (base64: string) => void): void;

  /**
   * Sets the construction from base64-encoded .ggb file.
   * @param base64 - Base64 string
   * @param callback - Optional callback when file is loaded
   * @since 4.0
   */
  setBase64(base64: string, callback?: () => void): void;

  // --------------------------------------------------------------------------
  // Miscellaneous
  // --------------------------------------------------------------------------

  /**
   * Prints debug message to console.
   * @param string - Message to print
   * @since 3.2
   */
  debug(string: string): void;

  /**
   * Gets the GeoGebra version.
   * @returns Version string
   * @since 5.0
   */
  getVersion(): string;

  /**
   * Removes the applet and frees up memory.
   * @since 5.0
   */
  remove(): void;

  /**
   * Recalculates environments (for hit detection after resize).
   */
  recalculateEnvironments(): void;
}

// ============================================================================
// Type Aliases and Enums
// ============================================================================

/** Label style constants */
export type GGBLabelStyle = 0 | 1 | 2 | 3;
export const GGBLabelStyleName = 0
export const GGBLabelStyleNameValue = 1
export const GGBLabelStyleValue = 2
export const GGBLabelStyleCaption = 3

/** Point style constants */
export type GGBPointStyle = -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/** Display style options */
export type GGBDisplayStyle = 'parametric' | 'explicit' | 'implicit' | 'specific';

/** Client event types */
export type GGBClientEventType =
  | 'addMacro'
  | 'addPolygon'
  | 'addPolygonComplete'
  | 'algebraPanelSelected'
  | 'deleteGeos'
  | 'deselect'
  | 'dragEnd'
  | 'dropdownClosed'
  | 'dropdownItemFocused'
  | 'dropdownOpened'
  | 'editorKeyTyped'
  | 'editorStart'
  | 'editorStop'
  | 'export'
  | 'mouseDown'
  | 'movedGeos'
  | 'movingGeos'
  | 'openDialog'
  | 'openMenu'
  | 'pasteElms'
  | 'pasteElmsComplete'
  | 'perspectiveChange'
  | 'redo'
  | 'relationTool'
  | 'removeMacro'
  | 'renameComplete'
  | 'renameMacro'
  | 'select'
  | 'setMode'
  | 'showNavigationBar'
  | 'showStyleBar'
  | 'sidePanelClosed'
  | 'sidePanelOpened'
  | 'tablePanelSelected'
  | 'toolsPanelSelected'
  | 'undo'
  | 'updateStyle'
  | 'viewChanged2D'
  | 'viewChanged3D';

/** Client event object */
export interface GGBClientEvent {
  type: GGBClientEventType;
  target?: string;
  argument?: string;
  x?: number;
  y?: number;
  index?: number;
  xZero?: number;
  yZero?: number;
  zZero?: number;
  scale?: number;
  xscale?: number;
  yscale?: number;
  zscale?: number;
  viewNo?: number;
  xAngle?: number;
  zAngle?: number;
}

/** File JSON structure */
export interface GGBFileJSON {
  archive: Array<{
    fileName: string;
    fileContent: string;
  }>;
}

// ============================================================================
// GGBApplet Parameters
// ============================================================================

/** Views configuration */
export interface GGBViews {
  is3D?: boolean;
  /** Algebra View */
  AV?: boolean;
  /** Spreadsheet View */
  SV?: boolean;
  /** CAS View */
  CV?: boolean;
  /** Graphics View 2 */
  EV2?: boolean;
  /** Construction Protocol */
  CP?: boolean;
  /** Probability Calculator */
  PC?: boolean;
  /** Data Analysis */
  DA?: boolean;
  /** Function Inspector */
  FI?: boolean;
  /** 3D View Panel */
  PV?: boolean;
  /** Macro */
  macro?: boolean;
}

/** App names for different GeoGebra apps */
export type GGBAppName =
  | 'graphing'
  | 'geometry'
  | 'classic'
  | '3d'
  | 'suite'
  | 'evaluator'
  | 'scientific'
  | 'notes';

/** Parameters for GGBApplet constructor */
export interface GGBAppletParameters {
  /** Unique identifier for the applet */
  id?: string;
  /** Width in pixels */
  width?: number;
  /** Height in pixels */
  height?: number;
  /** GeoGebra material ID to load */
  material_id?: string;
  /** URL of a .ggb file to load */
  filename?: string;
  /** Alias for filename */
  fileName?: string;
  /** Base64-encoded .ggb file content */
  ggbBase64?: string;
  /** App type to use */
  appName?: GGBAppName;

  // UI Options
  /** Show toolbar */
  showToolBar?: boolean;
  /** Show toolbar help */
  showToolBarHelp?: boolean;
  /** Show menu bar */
  showMenuBar?: boolean;
  /** Show algebra input */
  showAlgebraInput?: boolean;
  /** Allow style bar */
  allowStyleBar?: boolean;
  /** Show reset icon */
  showResetIcon?: boolean;
  /** Show animation button */
  showAnimationButton?: boolean;
  /** Show fullscreen button */
  showFullscreenButton?: boolean;
  /** Show suggestion buttons */
  showSuggestionButtons?: boolean;
  /** Show start tooltip */
  showStartTooltip?: boolean;

  // Interaction Options
  /** Enable label dragging */
  enableLabelDrags?: boolean;
  /** Enable shift-drag zoom */
  enableShiftDragZoom?: boolean;
  /** Enable right click */
  enableRightClick?: boolean;
  /** Enable CAS */
  enableCAS?: boolean;
  /** Enable 3D */
  enable3D?: boolean;
  /** Enable undo/redo */
  enableUndoRedo?: boolean;
  /** Enable keyboard input */
  enableKeyboardInput?: boolean;

  // Appearance
  /** Border color (CSS color or "none") */
  borderColor?: string;
  /** Show splash screen */
  showSplash?: boolean;
  /** Show loading animation */
  showLoading?: boolean;
  /** Custom toolbar definition */
  customToolBar?: string;
  /** Alias for customToolBar */
  customToolbar?: string;
  /** Language code */
  language?: string;
  /** Country code */
  country?: string;
  /** Allow rescaling */
  allowRescaling?: boolean;
  /** Rounding */
  rounding?: string;
  /** Button rounding */
  buttonRounding?: number;
  /** Button border color */
  buttonBorderColor?: string;
  /** Button shadow color */
  buttonShadows?: boolean;

  // Scaling Options
  /** Scale factor */
  scale?: number;
  /** Allow upscaling */
  allowUpscale?: boolean;
  /** Disable auto scale */
  disableAutoScale?: boolean;
  /** Scale container CSS class */
  scaleContainerClass?: string;
  /** Auto height */
  autoHeight?: boolean;
  /** No scale margin */
  noScaleMargin?: boolean;

  // Playback Options
  /** Show play button before loading */
  playButton?: boolean;
  /** Alias for playButton */
  clickToLoad?: boolean;
  /** Auto decide whether to show play button on mobile */
  playButtonAutoDecide?: boolean;

  // Logging
  /** Enable logging */
  showLogging?: boolean | string;

  // Random Seed
  /** Random seed for reproducible constructions */
  randomSeed?: number;

  // Perspective
  /** Perspective string */
  perspective?: string;

  // Callbacks
  /** Callback when applet is loaded */
  appletOnLoad?: (api: GGBAppletAPI) => void;
  /** Error callback */
  onError?: () => void;

  /** Allow any other parameters */
  [key: string]: unknown;
}

// ============================================================================
// GGBApplet Class
// ============================================================================

/** Injection type options */
export type GGBInjectType =
  | 'auto'
  | 'html5'
  | 'java'
  | 'screenshot'
  | 'preferJava'
  | 'preferHtml5';

/**
 * GGBApplet constructor function for creating GeoGebra applet instances.
 */
export interface GGBAppletConstructor {
  /**
   * Creates a new GGBApplet instance.
   * @param parameters - Applet parameters
   * @param views - Views configuration (optional)
   */
  new (parameters: GGBAppletParameters, views?: GGBViews): GGBAppletInstance;
  new (parameters: GGBAppletParameters, html5NoWebSimple?: boolean): GGBAppletInstance;
  new (
    version: string | number,
    parameters: GGBAppletParameters,
    views?: GGBViews
  ): GGBAppletInstance;
  new (
    version: string | number,
    parameters: GGBAppletParameters,
    html5NoWebSimple?: boolean
  ): GGBAppletInstance;

  /**
   * Creates a new GGBApplet instance (function call syntax).
   */
  (parameters: GGBAppletParameters, views?: GGBViews): GGBAppletInstance;
  (parameters: GGBAppletParameters, html5NoWebSimple?: boolean): GGBAppletInstance;
  (
    version: string | number,
    parameters: GGBAppletParameters,
    views?: GGBViews
  ): GGBAppletInstance;
  (
    version: string | number,
    parameters: GGBAppletParameters,
    html5NoWebSimple?: boolean
  ): GGBAppletInstance;
}

/**
 * GGBApplet instance methods.
 */
export interface GGBAppletInstance {
  /**
   * Sets the HTML5 codebase URL.
   * @param codebase - URL to the codebase
   * @param offline - Whether running offline
   */
  setHTML5Codebase(codebase: string, offline?: boolean): void;

  /**
   * Sets the HTML5 codebase version.
   * @param version - Version string (e.g., "5.0")
   * @param offline - Whether running offline
   */
  setHTML5CodebaseVersion(version: string, offline?: boolean): void;

  /**
   * Gets the HTML5 codebase version.
   * @returns Version string
   */
  getHTML5CodebaseVersion(): string;

  /**
   * Gets the parameters object.
   * @returns Parameters object
   */
  getParameters(): GGBAppletParameters;

  /**
   * Sets the fonts CSS URL.
   * @param url - URL to fonts CSS
   */
  setFontsCSSURL(url: string): void;

  /**
   * Sets the Giac JS URL (deprecated, no-op).
   * @param url - URL to Giac JS
   */
  setGiacJSURL(url: string): void;

  /**
   * Sets the JNLP file path (deprecated, no-op).
   * @param path - Path to JNLP file
   */
  setJNLPFile(path: string): void;

  /**
   * Sets the JNLP base directory (deprecated, no-op).
   * @param baseDir - Base directory path
   */
  setJNLPBaseDir(baseDir: string): void;

  /**
   * Injects the applet into the page.
   * @param container - Container element or ID
   * @param type - Injection type
   * @param noPreview - Whether to skip preview image
   */
  inject(container?: string | HTMLElement, type?: GGBInjectType, noPreview?: boolean): void;
  inject(container: string | HTMLElement, noPreview?: boolean): void;
  inject(type: GGBInjectType, noPreview?: boolean): void;

  /**
   * Gets the views configuration.
   * @returns Views object
   */
  getViews(): GGBViews;

  /**
   * Checks if Java is installed (always returns false in modern versions).
   * @returns Always false
   */
  isJavaInstalled(): boolean;

  /**
   * Checks if HTML5 is installed (always returns true in modern versions).
   * @returns Always true
   */
  isHTML5Installed(): boolean;

  /**
   * Gets the type of applet that was loaded.
   * @returns 'html5', 'screenshot', or null
   */
  getLoadedAppletType(): 'html5' | 'screenshot' | null;

  /**
   * Sets preview images.
   * @param previewFilePath - Path to preview image
   * @param loadingFilePath - Path to loading indicator image
   * @param playFilePath - Path to play button image
   */
  setPreviewImage(
    previewFilePath: string | null,
    loadingFilePath: string | null,
    playFilePath: string | null
  ): void;

  /**
   * Removes existing applet from container.
   * @param appletParent - Parent element or ID
   * @param showScreenshot - Whether to show screenshot after removal
   */
  removeExistingApplet(appletParent: string | HTMLElement, showScreenshot: boolean): void;

  /**
   * Refreshes hit points (for touch/click detection).
   * @returns Whether the operation was successful
   */
  refreshHitPoints(): boolean;

  /**
   * Starts animations in the applet.
   * @returns Whether the operation was successful
   */
  startAnimation(): boolean;

  /**
   * Stops animations in the applet.
   * @returns Whether the operation was successful
   */
  stopAnimation(): boolean;

  /**
   * Gets the applet API object.
   * @returns The GGBAppletAPI instance or null if not loaded
   */
  getAppletObject(): GGBAppletAPI | null;

  /**
   * Triggers responsive resize.
   */
  resize(): void;

  /**
   * Handler for exiting fullscreen mode.
   * @param fullscreenContainer - The fullscreen container element
   * @param appletElem - The applet element
   */
  onExitFullscreen(fullscreenContainer: HTMLElement, appletElem: HTMLElement): void;
}

// ============================================================================
// GGBAppletUtils
// ============================================================================

/**
 * Utility functions for GeoGebra applet management.
 */
export interface GGBAppletUtilsInterface {
  /**
   * Handles responsive resizing of the applet.
   * @param appletElem - The applet container element
   * @param parameters - Applet parameters
   */
  responsiveResize(appletElem: HTMLElement, parameters: GGBAppletParameters): void;

  /**
   * Checks if in flexible worksheet editor mode.
   * @returns Whether in flexible worksheet editor
   */
  isFlexibleWorksheetEditor(): boolean;

  /**
   * Centers the applet element (for fullscreen).
   * @param appletElem - The applet element to center
   */
  positionCenter(appletElem: HTMLElement): void;

  /**
   * Calculates the appropriate scale for the applet.
   * @param parameters - Applet parameters
   * @param appletElem - The applet element
   * @param showPlayButton - Whether play button is shown
   * @returns Scale factor
   */
  getScale(
    parameters: GGBAppletParameters,
    appletElem: HTMLElement,
    showPlayButton?: boolean
  ): number;

  /**
   * Applies scale transform to an element.
   * @param el - Element to scale
   * @param scale - Scale factor
   */
  scaleElement(el: HTMLElement, scale: number): void;

  /**
   * Creates a web module (internal use).
   * @param name - Module name
   * @param permutation - Permutation string
   */
  makeModule(name: string, permutation: string): () => boolean;
}

// ============================================================================
// Global Declarations
// ============================================================================

declare global {
  /** GGBApplet constructor */
  const GGBApplet: GGBAppletConstructor

  /** GGBAppletUtils utilities */
  const GGBAppletUtils: GGBAppletUtilsInterface

  /** Global ggbApplet reference (last active applet) */
  var ggbApplet: GGBAppletAPI | undefined

  /** Global function to render GeoGebra elements */
  function renderGGBElement(
    article: HTMLElement,
    appletOnLoad?: (api: GGBAppletAPI) => void
  ): void;

  /** Callback when renderGGBElement is ready */
  var renderGGBElementReady: (() => void) | undefined

  /** Active GeoGebra modules registry */
  var __gwt_activeModules: Record<
    string,
    {
      moduleName: string;
      moduleBase?: string;
      bindings?: () => Record<string, string>;
    }
  >

  /** web3d module loader */
  function web3d(): boolean;

  /** webSimple module loader */
  function webSimple(): boolean;

  interface Window {
    GGBApplet: GGBAppletConstructor;
    GGBAppletUtils: GGBAppletUtilsInterface;
    ggbApplet?: GGBAppletAPI;
    renderGGBElement?: typeof renderGGBElement;
    renderGGBElementReady?: () => void;
    __gwt_activeModules?: typeof __gwt_activeModules;
    web3d?: typeof web3d;
    webSimple?: typeof webSimple;
    /** Custom applet player onload handler */
    ggbAppletPlayerOnload?: (appletElem: HTMLElement) => void;
  }
}

export { }

