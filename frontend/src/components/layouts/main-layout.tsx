import Header from '../containers/Header';

const MainLayout = ({ children }: { children: JSX.Element }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default MainLayout;
