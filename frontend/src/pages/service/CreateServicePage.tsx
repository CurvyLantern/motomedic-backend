import { ServiceFieldWrapper } from "@/components/service/fields/ServiceField";
import WithCustomerLayout from "@/layouts/WithCustomerLayout";

const CreateServicePage = () => {
  return (
    <WithCustomerLayout>
      <ServiceFieldWrapper />
      {/* <ServiceDrawer /> */}
    </WithCustomerLayout>
  );
};

export default CreateServicePage;
