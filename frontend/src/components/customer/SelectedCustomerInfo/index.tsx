import BasicSection from "@/components/sections/BasicSection";
import { useAppSelector } from "@/hooks/storeConnectors";

export const SelectedUserInfo = () => {
  const selectedCustomer = useAppSelector(
    (state) => state.customer.selectedCustomer
  );

  console.log({ selectedCustomer });

  return (
    <BasicSection title="Customer Profile">
      {selectedCustomer ? (
        <>
          <p>Name : {selectedCustomer.name}</p>
          <p>Phone : {selectedCustomer.phone}</p>
          <p>Email : {selectedCustomer.email}</p>
          <p>Address : {selectedCustomer.address}</p>
        </>
      ) : (
        <div>No customer selected</div>
      )}
    </BasicSection>
  );
};
