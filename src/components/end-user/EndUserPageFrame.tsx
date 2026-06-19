import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export type EndUserPageProps = {
  /** When true, page content renders without DashboardLayout (e.g. inside GrowerLayout). */
  skipLayout?: boolean;
};

type EndUserPageFrameProps = EndUserPageProps & {
  activeSidebarItem: string;
  title: string;
  subtitle?: string;
  description?: string;
  children: React.ReactNode;
};

export const EndUserPageFrame: React.FC<EndUserPageFrameProps> = ({
  skipLayout,
  activeSidebarItem,
  title,
  subtitle,
  description,
  children,
}) => {
  if (skipLayout) {
    return <>{children}</>;
  }

  return (
    <DashboardLayout
      activeSidebarItem={activeSidebarItem}
      title={title}
      subtitle={subtitle}
      description={description}
    >
      {children}
    </DashboardLayout>
  );
};
