import { GlobalBackground } from '../../shared/components/layout';

export const AppShell = ({ children }) => (
  <>
    <GlobalBackground />
    <div className="relative z-10">{children}</div>
  </>
);
