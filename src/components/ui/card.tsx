import type { CardProps } from './shared';
import { SurfaceCard } from './shared';

export function Card({ children, style }: CardProps) {
  return <SurfaceCard style={style}>{children}</SurfaceCard>;
}