type DotBackgroundProps = {
  contents?: JSX.Element;
};

export function DotBackground({
  contents,
}: DotBackgroundProps): React.ReactElement<DotBackgroundProps> {
  return (
    <div className="h-[50rem] w-full dark:bg-black bg-white dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex items-center justify-center">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]">
      </div>
      {contents}
    </div>
  );
}
