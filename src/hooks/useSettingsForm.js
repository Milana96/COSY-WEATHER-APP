import { useEffect, useState } from "react";

export default function useSettingsForm(defaultLocation, onUpdateSettings) {
  const [locationValue, setLocationValue] = useState(defaultLocation);

  useEffect(() => {
    setLocationValue(defaultLocation);
  }, [defaultLocation]);

  const onSaveDefaultLocation = (event) => {
    event.preventDefault();
    const nextLocation = locationValue.trim();
    if (!nextLocation) return;
    onUpdateSettings({ defaultLocation: nextLocation });
  };

  return {
    locationValue,
    setLocationValue,
    onSaveDefaultLocation,
  };
}
