import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  url: string;
  pages_length: number;
  current_page: number;
}

const CEPagination: React.FC<PaginationProps> = async ({
  url,
  pages_length,
  current_page,
}) => {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href={url + (current_page - 1)} />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href={url + 0}>0</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href={url + pages_length}>
            {pages_length}
          </PaginationLink>
        </PaginationItem>
        {current_page < pages_length && (
          <PaginationItem>
            <PaginationNext href={url + (current_page + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default CEPagination;
