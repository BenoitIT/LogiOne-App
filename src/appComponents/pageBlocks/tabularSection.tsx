import DynamicTable from "@/components/table/table";
import { TableProps } from "@/interfaces/table";
const TabularSection = (Component: React.FC) => {
  const modifiedSection = <T extends Record<string, string | number>>(
    props: TableProps<T>
  ) => {
    const {
      headers,
      action,
      data,
      allowItemsSummationFooter,
      summation,
      stuffingRprt,
      preparedRprt,
    } = props;
    return (
      <div className="max-w-full overflow-x-auto">
        <Component />
        <DynamicTable
          headers={headers}
          data={data}
          action={action}
          summation={summation}
          allowItemsSummationFooter={allowItemsSummationFooter}
          stuffingRprt={stuffingRprt}
          preparedRprt={preparedRprt}
        />
      </div>
    );
  };
  return modifiedSection;
};
export default TabularSection;
