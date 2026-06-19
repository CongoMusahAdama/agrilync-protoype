import FarmManagement from '@/pages/FarmManagement';
import { withGrowerPage } from './withGrowerPage';

export default withGrowerPage(FarmManagement, {
  activeSection: 'farm-management',
  title: 'Farm Management',
  subtitle: 'Manage your crops and farm projects',
});
