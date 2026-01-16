export interface NewsSlideProps {
  id: string;
  title: string;
  date: string;
  shortDescription: string;
  featuredImageUrl: string;
  slug: string;
}

export interface NewsSliderProps {
  slides: NewsSlideProps[];
  className?: string;
}