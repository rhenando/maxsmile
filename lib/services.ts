// lib/services.ts

export const SERVICES = [
  { value: "braces", label: "Braces" },
  { value: "dentures_pustiso", label: "Dentures (Pustiso)" },
  { value: "fixed_bridge", label: "Fixed Bridge" },
  { value: "implants", label: "Implants" },
  { value: "jacket_crown", label: "Jacket Crown" },
  { value: "laser_gum_contouring", label: "Laser Gum Contouring" },
  { value: "oral_prophylaxis_cleaning", label: "Oral Prophylaxis (Cleaning)" },
  { value: "panoramic_x_ray", label: "Panoramic X-Ray" },
  { value: "periapical_x_ray", label: "Periapical X-Ray" },
  { value: "retainers", label: "Retainers" },
  { value: "root_canal_treatment", label: "Root Canal Treatment" },
  { value: "surgery", label: "Surgery" },
  { value: "teeth_whitening", label: "Teeth Whitening" },
  { value: "tooth_extraction_bunot", label: "Tooth Extraction (Bunot)" },
  { value: "tooth_restoration_pasta", label: "Tooth Restoration (Pasta)" },
  { value: "veneers", label: "Veneers" },
] as const;

export type ServiceValue = (typeof SERVICES)[number]["value"];
