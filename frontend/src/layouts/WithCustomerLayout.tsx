import { SelectCustomerOrCreate } from "@/components/customer/SelectCustomerOrCreate";

const WithCustomerLayout: CompWithChildren = ({ children }) => {
  return (
    <>
      <SelectCustomerOrCreate />
      {children}
    </>
  );
};

export default WithCustomerLayout;
