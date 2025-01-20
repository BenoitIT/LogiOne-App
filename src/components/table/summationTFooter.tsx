import { StuffingReportTotals } from "@/interfaces/stuffingItem";
import { TableCell, TableFooter, TableRow } from "../ui/table";
interface footer {
  summation?: StuffingReportTotals;
  stuffingRprt?: boolean;
}
export const ItemsSummationTableFooter = ({ summation }: footer) => {
  return (
    <TableFooter className="bg-blue-400 text-white w-full uppercase font-semibold text-xs">
      <TableRow>
        <TableCell className="text-center"></TableCell>
        <TableCell colSpan={7} className="text-center">
          Total
        </TableCell>
        <TableCell>{summation?.noOfPkgs}</TableCell>
        <TableCell className="text-center">
          {Intl.NumberFormat("en-Us").format(summation?.weight ?? 0)}
        </TableCell>
        <TableCell className="text-center">{summation?.line}</TableCell>
        <TableCell className="text-center">{summation?.handling}</TableCell>
        <TableCell className="text-center">
          {Intl.NumberFormat("en-Us").format(summation?.cbm ?? 0)}
        </TableCell>
        <TableCell className="text-center"></TableCell>
        <TableCell className="text-center">
          {Intl.NumberFormat("en-Us").format(summation?.freight ?? 0)}
        </TableCell>
        <TableCell className="text-center">
          {Intl.NumberFormat("en-Us").format(summation?.blFee ?? 0)}
        </TableCell>
        <TableCell className="text-center">
          {Intl.NumberFormat("en-Us").format(summation?.jb ?? 0)}
        </TableCell>
        <TableCell className="text-center">
          {Intl.NumberFormat("en-Us").format(summation?.carHanging ?? 0)}
        </TableCell>
        <TableCell className="text-center">
          {Intl.NumberFormat("en-Us").format(summation?.recovery ?? 0)}
        </TableCell>
        <TableCell className="text-center">
          {Intl.NumberFormat("en-Us").format(summation?.insurance ?? 0)}
        </TableCell>
        <TableCell className="text-center">
          {Intl.NumberFormat("en-Us").format(summation?.inspection ?? 0)}
        </TableCell>
        <TableCell className="text-center">
          {Intl.NumberFormat("en-Us").format(summation?.localCharges ?? 0)}
        </TableCell>
        <TableCell className="text-center">
          {Intl.NumberFormat("en-Us").format(summation?.totalUsd ?? 0)}
        </TableCell>
        <TableCell className="text-center">
          {Intl.NumberFormat("en-Us").format(summation?.totalAed ?? 0)}
        </TableCell>
        <TableCell className="text-center"></TableCell>
        <TableCell className="text-center"></TableCell>
      </TableRow>
    </TableFooter>
  );
};
