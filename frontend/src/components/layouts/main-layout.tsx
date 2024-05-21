import Header from '../containers/Header';

const MainLayout = ({ children }: { children: JSX.Element }) => {
  return (
    <>
      <Header />
      <main className="py-4">{children}</main>
    </>
  );
};

export default MainLayout;
