import React from 'react';
import GrowerLayout from '@/components/grower/GrowerLayout';
import type { EndUserPageProps } from '@/components/end-user/EndUserPageFrame';

type GrowerPageConfig = {
  activeSection: string;
  title: string;
  subtitle?: string;
};

/** Wraps a shared end-user page with GrowerLayout (agent-style separation). */
export function withGrowerPage(
  Content: React.FC<EndUserPageProps>,
  config: GrowerPageConfig
): React.FC {
  const GrowerPage: React.FC = () => (
    <GrowerLayout
      activeSection={config.activeSection}
      title={config.title}
      subtitle={config.subtitle}
    >
      <Content skipLayout />
    </GrowerLayout>
  );
  GrowerPage.displayName = `GrowerPage(${config.activeSection})`;
  return GrowerPage;
}
