export const SERIES_MAPPING: { [key: string]: string } = {
  "hp-omen": "HP Omen",
  "hp-zbook": "HP Zbook",
  "hp-elitebook": "HP Elitebook",
  "dell-precision": "Dell Precision",
  "dell-latitude": "Dell Latitude",
  "dell-xps": "Dell XPS",
  "lenovo-legion": "Lenovo Legion",
  "lenovo-thinkpad": "Lenovo ThinkPad",
  "lenovo-thinkbook": "Lenovo Thinkbook",
  "lenovo-yoga": "Lenovo Yoga",
  "apple-macbook": "Apple Macbook",
  "toshiba": "Toshiba",
  "asus": "Asus"
};

export const SERIES_NAMES = Object.values(SERIES_MAPPING);
export const SERIES_SLUGS = Object.keys(SERIES_MAPPING);

export const CATEGORIES = [
  "Gaming",
  "ChromeBooks",
  "Workstations",
  "Business",
  "2 in 1",
  "Ultra Light"
];
