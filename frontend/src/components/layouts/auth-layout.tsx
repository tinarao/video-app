const AuthLayout = ({ children }: { children: JSX.Element }) => {
  return (
    <div className="h-screen grid grid-cols-5">
      <div className="col-span-1 h-screen border-r-2 shadow-md flex flex-col justify-between">
        <div className="py-16"></div>
        {children}
      </div>
      <div className="col-span-4 h-screen"></div>
    </div>
  );
};

export default AuthLayout;
