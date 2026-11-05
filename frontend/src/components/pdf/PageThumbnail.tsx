interface PageThumbnailProps {
  pageNumber: number;
  selected?: boolean;
  onToggle?: (pageNumber: number) => void;
}

export function PageThumbnail({ pageNumber, selected = false, onToggle }: PageThumbnailProps) {
  return (
    <button
      type="button"
      onClick={() => onToggle?.(pageNumber)}
      className={`flex h-20 w-14 items-center justify-center rounded-lg border text-xs transition ${
        selected ? "border-black bg-black text-white" : "border-border bg-white text-foreground hover:bg-hover-bg"
      }`}
    >
      p{pageNumber}
    </button>
  );
}
