import DashHeader from '../containers/DashHeader';

const DashLayout = ({
  children,
}: {
  children: JSX.Element[] | JSX.Element;
}) => {
  return (
    <>
      <DashHeader />
      <main className="container py-4">{children}</main>
    </>
  );
};

export default DashLayout;
