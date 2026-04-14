import * as React from "react"
import { cn } from "@/lib/utils"
import { ArrowRightLeft } from "lucide-react"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto scrollbar-hide">
    {/* Swipe Indicator for Mobile */}
    <div className="sm:hidden absolute top-0 right-0 z-10 pointer-events-none p-2 bg-white/80 backdrop-blur-md shadow-lg rounded-bl-xl opacity-90 animate-pulse flex items-center gap-1.5 border-b border-l border-emerald-500/20">
      <ArrowRightLeft className="h-3 w-3 text-emerald-700" />
      <span className="text-[8px] font-black uppercase tracking-widest text-emerald-900 leading-none">Scroll to view more</span>
    </div>
    
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm border-collapse", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b-2 border-[#002f37]/15 bg-gray-50/50", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t border-[#002f37]/20 bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-[#002f37]/10 transition-all hover:bg-[#065f46]/5 data-[state=selected]:bg-muted group",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-8 sm:h-12 px-3 sm:px-4 text-left align-middle font-black text-[9px] sm:text-xs uppercase tracking-widest text-[#002f37]/60 [&:has([role=checkbox])]:pr-0 border-r border-[#002f37]/10 last:border-r-0 whitespace-nowrap bg-emerald-50/30",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-1.5 sm:p-4 align-middle [&:has([role=checkbox])]:pr-0 border-r border-[#002f37]/10 last:border-r-0 font-bold text-[11px] sm:text-sm text-gray-800 transition-all group-hover:text-black", className)}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
