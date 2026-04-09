import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * @param {{ page: number, totalPages: number, onPageChange: (page: number) => void }} props
 */
export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  // Clamp visible page numbers to a window of 5
  const windowSize = 5;
  let start = Math.max(1, page - Math.floor(windowSize / 2));
  let end = start + windowSize - 1;
  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, end - windowSize + 1);
  }
  const visible = pages.slice(start - 1, end);

  return (
    <nav
      aria-label="Pagination"
      className="mt-4 flex items-center justify-center gap-1"
    >
      <button
        type="button"
        aria-label="Previous page"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="pagination-btn"
      >
        <ChevronLeft size={15} />
      </button>

      {start > 1 && (
        <>
          <button
            type="button"
            onClick={() => onPageChange(1)}
            className="pagination-btn"
          >
            1
          </button>
          {start > 2 && (
            <span className="px-1 text-[var(--on-surface-muted)]">…</span>
          )}
        </>
      )}

      {visible.map((p) => (
        <button
          key={p}
          type="button"
          aria-current={p === page ? "page" : undefined}
          onClick={() => onPageChange(p)}
          className={`pagination-btn${p === page ? " pagination-btn--active" : ""}`}
        >
          {p}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && (
            <span className="px-1 text-[var(--on-surface-muted)]">…</span>
          )}
          <button
            type="button"
            onClick={() => onPageChange(totalPages)}
            className="pagination-btn"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        type="button"
        aria-label="Next page"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="pagination-btn"
      >
        <ChevronRight size={15} />
      </button>
    </nav>
  );
}
