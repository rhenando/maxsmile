export const BRANCHES = {
  "manila-main": {
    name: "Manila Main",
    subtitle: "MaxSmile Dental Clinic",
    address: "Manila, Philippines",
    phone: "+639000000000",
    hours: "Mon–Sat • 9:00 AM – 6:00 PM",
    mapEmbedSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3494.5950113069252!2d120.99426657457226!3d14.56181427802615!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c9b93a9b5a3b%3A0x281be1309a897b1f!2sMaxSmile%20Dental%20Clinic%20-%20Manila%20Main!5e1!3m2!1sen!2sph!4v1767424674091!5m2!1sen!2sph",
  },
  pateros: {
    name: "Pateros",
    subtitle: "MaxSmile Dental Clinic",
    address: "Pateros, Philippines",
    phone: "+639000000000",
    hours: "Mon–Sat • 9:00 AM – 6:00 PM",
    mapEmbedSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3494.7771866400917!2d121.07063037457209!3d14.550311678306965!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c944692a1633%3A0xab84abbe7f32abed!2sMaxSmile%20Dental%20Clinic%20-%20Pateros!5e1!3m2!1sen!2sph!4v1767425393225!5m2!1sen!2sph",
  },
  paranaque: {
    name: "Parañaque",
    subtitle: "MaxSmile Dental Clinic",
    address: "Parañaque, Philippines",
    phone: "+639000000000",
    hours: "Mon–Sat • 9:00 AM – 6:00 PM",
    mapEmbedSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3495.674584363083!2d120.98592327457115!3d14.493519379690401!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397cf0fa97ec191%3A0xb52f4d68011debaa!2sMaxSmile%20Dental%20Clinic%20-%20Para%C3%B1aque!5e1!3m2!1sen!2sph!4v1767425488951!5m2!1sen!2sph",
  },
} as const;

export type BranchSlug = keyof typeof BRANCHES;
export type Branch = (typeof BRANCHES)[BranchSlug];
