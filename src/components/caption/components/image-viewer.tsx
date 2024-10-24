export const ImageViewer = () => {
  return (
    <div className="relative w-full h-full max-h-full flex justify-center items-center p-2">
      <img
        src="https://placehold.co/3000x3000"
        className="max-w-full max-h-[calc(100vh-200px)] object-contain"
        alt="Image Viewer"
      />
    </div>
  );
};
