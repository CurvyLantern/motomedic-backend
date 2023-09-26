import { SelectCustomerOrCreate } from "@/components/customer/SelectCustomerOrCreate";
import { CompWithChildren } from "@/types/defaultTypes";

const WithCustomerLayout: CompWithChildren = ({ children }) => {
    return (
        <>
            <SelectCustomerOrCreate />
            {children}
        </>
    );
};

export default WithCustomerLayout;
