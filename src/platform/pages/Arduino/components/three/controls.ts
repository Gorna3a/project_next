interface EnableableControls {
  enabled: boolean;
}

export const setControlsEnabled = (
  controls: EnableableControls | null,
  enabled: boolean,
): void => {
  if (!controls) return;
  controls.enabled = enabled;
};
