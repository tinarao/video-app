const Logo = ({ size = 8 }: { size?: number }) => {
  return <img src="./src/assets/logo.svg" className={`size-${size}`} />;
};

export default Logo;
