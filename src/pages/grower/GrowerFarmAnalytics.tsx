import FarmAnalytics from '@/pages/FarmAnalytics';
import { withGrowerPage } from './withGrowerPage';

export default withGrowerPage(FarmAnalytics, {
  activeSection: 'farm-analytics',
  title: 'Farm Analytics',
  subtitle: 'Track your farm performance and insights',
});
