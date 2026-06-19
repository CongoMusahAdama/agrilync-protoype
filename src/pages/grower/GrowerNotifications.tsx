import Notifications from '@/pages/Notifications';
import { withGrowerPage } from './withGrowerPage';

export default withGrowerPage(Notifications, {
  activeSection: 'notifications',
  title: 'Notifications',
  subtitle: 'Your updates and alerts',
});
