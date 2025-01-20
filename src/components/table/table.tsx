"use client";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableProps } from "@/interfaces/table";
import { ItemsSummationTableFooter } from "./summationTFooter";
const DynamicTable = <T extends Record<string, string | number>>({
  headers,
  data,
  action,
  allowItemsSummationFooter,
  summation,
  stuffingRprt,
  preparedRprt,
}: TableProps<T>) => {
  return (
    <Table className="bg-white shadow rounded w-full  overflow-x-auto">
      <TableHeader>
        <TableRow className="bg-gray-50 text-gray-900">
          <TableHead
            className={`font-semibold text-xs ${
              stuffingRprt ? "md:text-xs" : "md:text-sm"
            } p-2}`}
          >
            #
          </TableHead>
          {headers.map((header, index) => (
            <TableHead
              key={index}
              className={`font-medium text-xs whitespace-nowrap ${
                preparedRprt ? "border border-b-0 border-t-0" : ""
              }${stuffingRprt ? "md:text-xs" : "md:text-sm"} ${
                header.header?.toLowerCase() == "shipper"
                  ? "min-w-[150px] text-center flex"
                  : ""
              }  ${
                header.header?.toLowerCase() == "less container"
                  ? "bg-red-400 text-black"
                  : ""
              } 
              ${header.hidden ? "hidden" : ""}
              p-2 w-fit`}
            >
              {header.header}
            </TableHead>
          ))}
          {action ? (
            <TableHead
              className={`font-medium  text-xs whitespace-nowrap ${
                stuffingRprt ? "md:text-xs" : "md:text-sm"
              } p-2"`}
            >
              Action
            </TableHead>
          ) : (
            ""
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.length > 0 ? (
          data.map((row, rowIndex) => (
            <TableRow key={rowIndex} className="text-gray-700">
              <TableCell
                className={`text-xs ${
                  stuffingRprt ? "md:text-xs" : "md:text-sm"
                }  text-gray-700 p-3`}
              >
                {rowIndex + 1}
              </TableCell>
              {headers.map((header, colIndex) => (
                <TableCell
                  key={colIndex}
                  className={`text-xs ${
                    stuffingRprt ? "md:text-xs" : "md:text-sm"
                  } p-3 ${
                    header.field?.toLowerCase() == "description"
                      ? "min-w-[150px] text-center flex"
                      : ""
                  } ${header.hidden ? "hidden" : ""}${
                    header.field?.toLowerCase() == "lesscontainer"
                      ? "bg-red-400 text-black  border border-red-500"
                      : ""
                  } ${preparedRprt ? "border border-b-0 border-t-0" : ""}  ${
                    header.field?.toLowerCase() == "ysf"
                      ? "bg-green-600 text-black  border border-green-600"
                      : ""
                  }`}
                >
                  {row[header.field] as string | number}
                </TableCell>
              ))}
              <TableCell
                className={
                  action
                    ? `text-xs ${stuffingRprt ? "md:text-xs" : "md:text-sm"}`
                    : "hidden p-3"
                }
              >
                <div className={`flex w-fit gap-2 ml-2`}>
                  {action
                    ? action.map((action, index) => (
                        <Label
                          key={index}
                          className={
                            action.name == "delete"
                              ? "text-red-400 hover:cursor-pointer"
                              : `cursor-pointer ${
                                  (action?.name === "Approve payment" &&
                                    row?.paymentStatus !== "Paid") ||
                                  (action.name === "Approve payment" &&
                                    row?.amountPaid < row?.totalUsd) ||
                                  ((action.name === "Approve payment" &&
                                    row?.paymentApproved) ||
                                  (action.name === "Approve payment" &&
                                    row?.releaseGenerated)
                                    ? "hidden"
                                    : "")
                                } 
                                ${
                                  action.name === "View release letter" &&
                                  !row?.releaseGenerated
                                    ? "hidden"
                                    : ""
                                }`
                          }
                          title={action?.name}
                          onClick={() => action.Click(row.id as number)}
                        >
                          {action.icon}
                        </Label>
                      ))
                    : ""}
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={Array.from(Object.keys(headers)).length}
              className="p-3"
            >
              <div
                className={`rounded w-full h-[40px] flex justify-center items-center capitalize ${
                  stuffingRprt ? "md:text-xs" : "md:text-sm"
                } text-black`}
              >
                no record found
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
      {allowItemsSummationFooter ? (
        <ItemsSummationTableFooter summation={summation} stuffingRprt={true} />
      ) : (
        ""
      )}
    </Table>
  );
};
export default DynamicTable;
