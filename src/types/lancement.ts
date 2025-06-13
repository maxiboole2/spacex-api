export interface Lancement {
  id: string;
  name: string;
  date_utc: string;
  success: boolean | null;
  details: string | null;
  failures?: {
    time: number;
    altitude: number | null;
    reason: string;
  }[];
  links: {
    youtube_id?: string;
    article?: string;
    patch?: {
      small?: string;
      large?: string;
    };
    flickr?: {
      original: string[];
    };
    webcast?: string;
    reddit?: {
      campaign?: string | null;
      launch?: string | null;
      media?: string | null;
      recovery?: string | null;
    };
    presskit?: string | null;
    wikipedia?: string;
  };
  payloads: {
    id: string;
    name: string;
    type?: string;
    customers?: string[];
  }[];
  launchpad?: {
    name: string;
    full_name?: string;
  };
  rocket?: {
    name?: string;
  };
  cores?: {
    core?: string;
    flight?: number;
    reused?: boolean;
  }[];
  upcoming?: boolean;
  static_fire_date_utc?: string;
  flight_number?: number;
}
