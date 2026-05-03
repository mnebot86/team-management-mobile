import ScreenDefault from './ScreenDefault';
import ScreenScroll from './ScreenScroll';
import ScreenCentered from './ScreenCenter';

type ScreenContainerType = typeof ScreenDefault & {
  Scroll: typeof ScreenScroll;
  Centered: typeof ScreenCentered;
};

const ScreenContainer = ScreenDefault as ScreenContainerType;

ScreenContainer.Scroll = ScreenScroll;
ScreenContainer.Centered = ScreenCentered;

export default ScreenContainer;
