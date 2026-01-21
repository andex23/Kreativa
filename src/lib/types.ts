// Creative Profile Types

export type PrimaryPlatform = 'Instagram' | 'TikTok' | 'Twitter';

export interface SocialLink {
  platform: string;
  url: string;
}

export interface PrimarySocialAccount {
  platform: PrimaryPlatform;
  handle: string;
}

export interface Profile {
  id: string;
  primary_platform: PrimaryPlatform;
  primary_handle: string;
  // Optional alternate platforms
  instagram_handle?: string;
  tiktok_handle?: string;
  twitter_handle?: string;
  full_name: string;
  category: Category;
  location: Location;
  bio: string;
  portfolio_url?: string;
  profile_photo_url?: string;
  header_image_url?: string;
  follower_count?: number;
  following_count?: number;
  posts_count?: number;
  social_links?: SocialLink[];
  status: ProfileStatus;
  created_at: string;
  updated_at: string;
}

export type ProfileStatus = 'pending' | 'approved' | 'rejected';

export type Category =
  | 'Photographers'
  | 'Graphic Designers'
  | 'Visual Artists'
  | 'Fashion Designers'
  | 'Makeup Artists'
  | 'Content Creators'
  | 'Videographers'
  | 'Illustrators'
  | 'Creative Directors'
  | 'UI/UX Designers'
  | 'Music Producers'
  | 'Writers'
  | 'Fashion Stylists'
  | 'Art Directors'
  | 'Digital Artists';

export type Location =
  | 'Lagos'
  | 'Abuja'
  | 'Port Harcourt'
  | 'Ibadan'
  | 'Kano'
  | 'Enugu'
  | 'Benin City'
  | 'Calabar'
  | 'Jos'
  | 'Kaduna'
  | 'Other';

export interface ProfileFormData {
  primary_platform: PrimaryPlatform;
  primary_handle: string;
  instagram_handle?: string;
  tiktok_handle?: string;
  twitter_handle?: string;
  full_name: string;
  category: Category;
  location: Location;
  bio: string;
  portfolio_url?: string;
  profile_photo?: File | null;
  header_image?: File | null;
  profile_photo_base64?: string;
  header_image_base64?: string;
  social_links: SocialLink[];
}

export interface FilterState {
  search: string;
  category: Category | '';
  location: Location | '';
  platform: PrimaryPlatform | '';
}
