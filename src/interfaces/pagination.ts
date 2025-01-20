export interface PaginatorProps {
    activePage: number;
    totalPages: number;
    onPageChange: (pageNumber: number) => void;
    onNextPageChange: () => void;
    onPreviousPageChange: () => void;
  }