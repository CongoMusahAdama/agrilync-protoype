import TrainingSessions from '@/pages/TrainingSessions';
import { withGrowerPage } from './withGrowerPage';

export default withGrowerPage(TrainingSessions, {
  activeSection: 'training',
  title: 'Training',
  subtitle: 'Assigned modules, completion status, and certificates',
});
