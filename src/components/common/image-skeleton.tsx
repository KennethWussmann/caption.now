import { ImgHTMLAttributes, useState } from "react";
import { Skeleton } from "../ui";
import clsx from "clsx";

type ImageSkeletonProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & { src: string | null };

export const ImageSkeleton = ({ src, ...props }: ImageSkeletonProps) => {
  const [loaded, setLoaded] = useState(false);
  return <>
    {src && <img {...props} src={src} onLoad={() => setLoaded(true)} className={clsx(props.className, { "display-none": !loaded })} />}
    {!src || !loaded && <Skeleton className={props.className} />}
  </>;
}