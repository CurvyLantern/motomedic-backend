// import { Box } from "@mantine/core";
// import React, {
//   forwardRef,
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";
// import { useReactToPrint } from "react-to-print";

// const usePrintInvoice = () => {
//   const [printData, setPrintData] = useState<TInvoiceProps | null>(null);
//   const [printRef, setPrintRef] = useState<HTMLDivElement | null>(null);
//   const componentRef = useRef<HTMLDivElement>(null);

//   const printFn = useReactToPrint({
//     content: () => componentRef.current,
//     onAfterPrint: () => {
//       setPrintData(null);
//       setPrintRef(null);
//     },
//   });

//   useEffect(() => {
//     if (printRef) {
//       setTimeout(() => {
//         printFn();
//       }, 500);
//     }
//   }, [printRef, printFn]);

//   const PRINT_ELEMENT = useMemo(() => {
//     if (printData) {
//       return <Invoice {...printData} ref={setPrintRef} />;
//     } else {
//       return null;
//     }
//   }, [printData]);

//   const handlePrint = useCallback((args: TInvoiceProps) => {
//     setPrintData(args);
//   }, []);

//   return {
//     handlePrint,
//     setPrintData,
//     PRINT_ELEMENT,
//   };
// };

// export default usePrintInvoice;
