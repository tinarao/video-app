const Logo = ({ size = 8 }: { size?: number }) => {
  return (
    <img
      src="https://firebasestorage.googleapis.com/v0/b/video-hosting-8c6bf.appspot.com/o/logo.svg?alt=media&token=b624c3e9-ab32-4a68-ab3f-07ff74776e86"
      className={`size-${size}`}
    />
  );
};

export default Logo;
