export const SERVICES = [
  { value: "oral_prophylaxis_cleaning", label: "Oral Prophylaxis (Cleaning)" },
  { value: "tooth_restoration_pasta", label: "Tooth Restoration (Pasta)" },
  { value: "tooth_extraction_bunot", label: "Tooth Extraction (Bunot)" },
  { value: "dentures_pustiso", label: "Dentures (Pustiso)" },
  { value: "jacket_crown", label: "Jacket Crown" },
  { value: "fixed_bridge", label: "Fixed Bridge" },
  { value: "veneers", label: "Veneers" },
  { value: "teeth_whitening", label: "Teeth Whitening" },
  { value: "root_canal_treatment", label: "Root Canal Treatment" },
  { value: "implants", label: "Implants" },
  { value: "surgery", label: "Surgery" },
  { value: "periapical_x_ray", label: "Periapical X-Ray" },
  { value: "panoramic_x_ray", label: "Panoramic X-Ray" },
] as const;

export type ServiceValue = (typeof SERVICES)[number]["value"];
