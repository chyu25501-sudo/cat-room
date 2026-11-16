import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import {
  CareItemIcon,
  KibbleFoodIcon,
  CannedFoodIcon,
  TreatPureeIcon,
  TeaserToyIcon,
  YarnBallToyIcon,
  LaserPointerToyIcon,
} from './CareItemIcon.tsx';

describe('CareItemIcon コンポーネント (ごはん・おもちゃの専用SVGアイコン描画)', () => {
  describe('ごはんアイコン', () => {
    it('カリカリ (kibble) の専用SVGアイコンが正常にレンダリングされること', () => {
      render(<CareItemIcon type="food" id="kibble" className="w-10 h-10" />);
      const icon = screen.getByTestId('food-icon-kibble');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('w-10 h-10');
    });

    it('ねこ缶 (canned) の専用SVGアイコンが正常にレンダリングされること', () => {
      render(<CareItemIcon type="food" id="canned" className="w-8 h-8" />);
      const icon = screen.getByTestId('food-icon-canned');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('w-8 h-8');
    });

    it('おやつピューレ (treat) の専用SVGアイコンが正常にレンダリングされること', () => {
      render(<CareItemIcon type="food" id="treat" />);
      const icon = screen.getByTestId('food-icon-treat');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('w-7 h-7'); // デフォルトクラス
    });

    it('未知のごはんIDが渡された場合はカリカリがフォールバック描画されること', () => {
      render(<CareItemIcon type="food" id="unknown" />);
      expect(screen.getByTestId('food-icon-kibble')).toBeInTheDocument();
    });
  });

  describe('おもちゃアイコン', () => {
    it('ねこじゃらし (teaser) の専用SVGアイコンが正常にレンダリングされること', () => {
      render(<CareItemIcon type="toy" id="teaser" className="w-10 h-10" />);
      const icon = screen.getByTestId('toy-icon-teaser');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('w-10 h-10');
    });

    it('毛糸ボール (ball) の専用SVGアイコンが正常にレンダリングされること', () => {
      render(<CareItemIcon type="toy" id="ball" className="w-8 h-8" />);
      const icon = screen.getByTestId('toy-icon-ball');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('w-8 h-8');
    });

    it('レーザーポインター (laser) の専用SVGアイコンが正常にレンダリングされること', () => {
      render(<CareItemIcon type="toy" id="laser" />);
      const icon = screen.getByTestId('toy-icon-laser');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('w-7 h-7'); // デフォルトクラス
    });

    it('未知のおもちゃIDが渡された場合はねこじゃらしがフォールバック描画されること', () => {
      render(<CareItemIcon type="toy" id="unknown" />);
      expect(screen.getByTestId('toy-icon-teaser')).toBeInTheDocument();
    });
  });

  describe('個別コンポーネントのエクスポート', () => {
    it('個別コンポーネントを直接呼んでも正常に描画されること', () => {
      const { container } = render(
        <div>
          <KibbleFoodIcon />
          <CannedFoodIcon />
          <TreatPureeIcon />
          <TeaserToyIcon />
          <YarnBallToyIcon />
          <LaserPointerToyIcon />
        </div>
      );
      expect(screen.getByTestId('food-icon-kibble')).toBeInTheDocument();
      expect(screen.getByTestId('food-icon-canned')).toBeInTheDocument();
      expect(screen.getByTestId('food-icon-treat')).toBeInTheDocument();
      expect(screen.getByTestId('toy-icon-teaser')).toBeInTheDocument();
      expect(screen.getByTestId('toy-icon-ball')).toBeInTheDocument();
      expect(screen.getByTestId('toy-icon-laser')).toBeInTheDocument();
    });
  });
});
